import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Handles Supabase auth redirects (email verification, password reset).
 * Supabase sends a code that we exchange for a session.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/copilot"
  const type = searchParams.get("type")

  if (code) {
    const supabase = await createClient()

    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (!error) {
        // Redirect based on the type of auth action
        if (type === "recovery") {
          // Password reset flow -- redirect to reset password page
          return NextResponse.redirect(`${origin}/reset-password`)
        }
        if (type === "signup" || type === "email") {
          // Email verification -- redirect to login with success message
          return NextResponse.redirect(`${origin}/login?verified=true`)
        }
        // Default redirect
        return NextResponse.redirect(`${origin}${next}`)
      }

      console.error("[v0] Auth callback error:", error)
    }
  }

  // Something went wrong -- redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
