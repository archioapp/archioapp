import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { loginSchema } from "@/lib/validation/auth"
import { json, badRequest, unauthorized, serverError } from "@/lib/http/json"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return badRequest(validation.error.errors[0].message)
    }

    const { email, password } = validation.data

    const supabase = await createClient()

    if (!supabase) {
      // Supabase not configured -- return a clear service unavailable error
      return serverError(
        new Error("Authentication service not configured"),
        "Authentication service is currently unavailable. Please try again later."
      )
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("[v0] Login error:", error.message)
      return unauthorized("Invalid email or password")
    }

    return json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        handle: data.user.user_metadata?.display_name || data.user.email?.split("@")[0] || "user",
        role: data.user.user_metadata?.role || "STUDENT",
      },
    })
  } catch (error) {
    return serverError(error, "Failed to log in")
  }
}
