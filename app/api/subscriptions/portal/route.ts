import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUserSubscription } from "@/lib/auth/db"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subscription = await getUserSubscription(user.id)

    if (!subscription || !subscription.stripe_subscription_id) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 })
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    })

    // Get the Stripe subscription to find the customer ID
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id)

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeSubscription.customer as string,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard`,
    })

    return NextResponse.json({
      portal_url: portalSession.url,
    })
  } catch (error) {
    console.error("[v0] Error creating portal session:", error)
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 })
  }
}
