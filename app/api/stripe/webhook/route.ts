import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    // Verify Stripe webhook signature
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("[v0] Stripe configuration missing")
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
    }

    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      console.error("[v0] Missing Stripe signature")
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      console.error("[v0] Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const supabase = await createClient()

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object, supabase)
        break

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object, supabase)
        break

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object, supabase)
        break

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object, supabase)
        break

      default:
        console.log(`[v0] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: any, supabase: any) {
  try {
    console.log("[v0] Processing checkout completion:", session.id)

    const { group_id, user_id } = session.metadata

    if (!group_id || !user_id) {
      console.error("[v0] Missing metadata in checkout session")
      return
    }

    // Add user to group as active member
    const { error } = await supabase.from("group_members").upsert(
      {
        group_id,
        user_id,
        role: "member",
        status: "active",
        joined_at: new Date().toISOString(),
      },
      {
        onConflict: "group_id,user_id",
      },
    )

    if (error) {
      console.error("[v0] Error adding member to group:", error)
    } else {
      console.log("[v0] Successfully added member to group:", { group_id, user_id })
    }
  } catch (error) {
    console.error("[v0] Error in handleCheckoutCompleted:", error)
  }
}

async function handlePaymentSucceeded(invoice: any, supabase: any) {
  try {
    console.log("[v0] Processing payment success:", invoice.id)

    // For recurring payments, ensure member status remains active
    const subscription = invoice.subscription
    if (!subscription) return

    // Get subscription metadata to find group and user
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
    const subscriptionData = await stripe.subscriptions.retrieve(subscription)

    if (subscriptionData.metadata?.group_id && subscriptionData.metadata?.user_id) {
      const { group_id, user_id } = subscriptionData.metadata

      const { error } = await supabase.from("group_members").upsert(
        {
          group_id,
          user_id,
          role: "member",
          status: "active",
          joined_at: new Date().toISOString(),
        },
        {
          onConflict: "group_id,user_id",
        },
      )

      if (error) {
        console.error("[v0] Error updating member status:", error)
      } else {
        console.log("[v0] Member status updated for recurring payment:", { group_id, user_id })
      }
    }
  } catch (error) {
    console.error("[v0] Error in handlePaymentSucceeded:", error)
  }
}

async function handleSubscriptionDeleted(subscription: any, supabase: any) {
  try {
    console.log("[v0] Processing subscription deletion:", subscription.id)

    const { group_id, user_id } = subscription.metadata

    if (!group_id || !user_id) {
      console.error("[v0] Missing metadata in subscription")
      return
    }

    // Set member status to expired
    const { error } = await supabase
      .from("group_members")
      .update({ status: "expired" })
      .eq("group_id", group_id)
      .eq("user_id", user_id)

    if (error) {
      console.error("[v0] Error expiring member:", error)
    } else {
      console.log("[v0] Member expired due to subscription cancellation:", { group_id, user_id })
    }
  } catch (error) {
    console.error("[v0] Error in handleSubscriptionDeleted:", error)
  }
}

async function handleSubscriptionUpdated(subscription: any, supabase: any) {
  try {
    console.log("[v0] Processing subscription update:", subscription.id)

    const { group_id, user_id } = subscription.metadata

    if (!group_id || !user_id) return

    // Update member status based on subscription status
    const status = subscription.status === "active" ? "active" : "expired"

    const { error } = await supabase
      .from("group_members")
      .update({ status })
      .eq("group_id", group_id)
      .eq("user_id", user_id)

    if (error) {
      console.error("[v0] Error updating member status:", error)
    } else {
      console.log("[v0] Member status updated:", { group_id, user_id, status })
    }
  } catch (error) {
    console.error("[v0] Error in handleSubscriptionUpdated:", error)
  }
}
