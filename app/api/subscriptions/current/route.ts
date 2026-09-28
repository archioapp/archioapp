import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { json, unauthorized, serverError } from "@/lib/http/json"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return unauthorized()
    }

    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select(
        `
        *,
        plans (*)
      `,
      )
      .eq("user_id", user.id)
      .eq("status", "active")
      .single()

    if (error && error.code !== "PGRST116") {
      throw error
    }

    console.info(`[v0] GET /api/subscriptions/current - User: ${user.id}`)

    return json({ subscription: subscription || null })
  } catch (error) {
    return serverError(error, "Failed to fetch subscription")
  }
}
