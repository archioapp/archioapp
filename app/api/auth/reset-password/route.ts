import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { resetPasswordSchema } from "@/lib/validation/auth"
import { json, badRequest, unauthorized, serverError } from "@/lib/http/json"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validation = resetPasswordSchema.safeParse(body)
    if (!validation.success) {
      return badRequest(validation.error.errors[0].message)
    }

    const { password } = validation.data
    const supabase = await createClient()

    if (!supabase) {
      return serverError(new Error("Supabase not configured"), "Service unavailable")
    }

    // The user must be authenticated via the reset link token
    // Supabase automatically handles the session from the reset link
    const { data, error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      console.error("[v0] Reset password error:", error)
      if (error.message.includes("session") || error.message.includes("token")) {
        return unauthorized("Reset link has expired. Please request a new one.")
      }
      return badRequest(error.message)
    }

    console.info(`[v0] POST /api/auth/reset-password - Password updated for: ${data.user.id}`)

    return json({
      message: "Password has been updated successfully.",
    })
  } catch (error) {
    return serverError(error, "Failed to reset password")
  }
}
