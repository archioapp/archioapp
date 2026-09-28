import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUserSubscription } from "@/lib/auth/db"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subscription = await getUserSubscription(user.id)

    // If no subscription, user is on free tier
    if (!subscription) {
      return NextResponse.json({
        subscription: null,
        tier: "free",
      })
    }

    // Get plan details
    const { data: plan } = await (await createClient())
      .from("plans")
      .select("*")
      .eq("id", subscription.plan_id)
      .single()

    return NextResponse.json({
      subscription,
      plan,
    })
  } catch (error) {
    console.error("[v0] Error fetching subscription:", error)
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 })
  }
}
