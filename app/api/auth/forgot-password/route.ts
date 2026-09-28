import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { forgotPasswordSchema } from "@/lib/validation/auth"
import { json, badRequest, serverError } from "@/lib/http/json"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validation = forgotPasswordSchema.safeParse(body)
    if (!validation.success) {
      return badRequest(validation.error.errors[0].message)
    }

    const { email } = validation.data
    const supabase = await createClient()

    if (!supabase) {
      return serverError(new Error("Supabase not configured"), "Service unavailable")
    }

    // Send password reset email via Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
    })

    if (error) {
      console.error("[v0] Forgot password error:", error)
      // Return success even on error to prevent email enumeration
    }

    console.info(`[v0] POST /api/auth/forgot-password - Reset email requested for: ${email}`)

    // Always return success to prevent email enumeration attacks
    return json({
      message: "If an account exists with this email, a reset link has been sent.",
    })
  } catch (error) {
    return serverError(error, "Failed to process password reset request")
  }
}
