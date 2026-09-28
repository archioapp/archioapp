import type { NextRequest } from "next/server"
import { signUpSchema } from "@/lib/validation/auth"
import { json, badRequest, serverError } from "@/lib/http/json"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validation = signUpSchema.safeParse(body)
    if (!validation.success) {
      return badRequest(validation.error.errors[0].message)
    }

    const { email, password, displayName } = validation.data

    // Check for required env vars before attempting to create admin client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return serverError(
        new Error("Authentication service not configured"),
        "Registration service is currently unavailable. Please try again later."
      )
    }

    // Import and create admin client only when env vars are confirmed
    const { createAdminClient } = await import("@/lib/auth/supabaseAdmin")
    const supabase = createAdminClient()

    if (!supabase) {
      return serverError(
        new Error("Admin client unavailable"),
        "Registration service is currently unavailable. Please try again later."
      )
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        display_name: displayName || email.split("@")[0],
      },
    })

    if (error) {
      console.error("[v0] Signup error:", error.message)
      // Map common Supabase errors to user-friendly messages
      if (error.message.includes("already been registered") || error.message.includes("already exists")) {
        return badRequest("An account with this email already exists")
      }
      return badRequest(error.message)
    }

    return json(
      {
        userId: data.user.id,
        email: data.user.email,
      },
      { status: 201 },
    )
  } catch (error) {
    return serverError(error, "Failed to sign up")
  }
}
