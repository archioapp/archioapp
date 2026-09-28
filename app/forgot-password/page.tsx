"use client"

import { useEffect, useCallback, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { EntryThreshold } from "@/components/auth"

export default function ForgotPasswordPage() {
  const [successMessage, setSuccessMessage] = useState<string | undefined>()

  // Hide floating elements on auth pages
  useEffect(() => {
    const hub = document.querySelector('[data-component="floating-community-hub"]')
    const nav = document.querySelector('[data-component="floating-nav"]')
    if (hub) (hub as HTMLElement).style.display = "none"
    if (nav) (nav as HTMLElement).style.display = "none"
    return () => {
      if (hub) (hub as HTMLElement).style.display = ""
      if (nav) (nav as HTMLElement).style.display = ""
    }
  }, [])

  const handleSubmit = useCallback(async (data: { email: string }) => {
    const supabase = createClient()
    if (!supabase) {
      throw new Error("Authentication service unavailable. Please try again later.")
    }

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      throw new Error(error.message)
    }

    // Always show success to prevent email enumeration
    setSuccessMessage(
      "If an account exists with this identifier, a reset link has been transmitted. Check your inbox."
    )

    await new Promise((resolve) => setTimeout(resolve, 2000))
  }, [])

  return (
    <EntryThreshold
      mode="forgot-password"
      onSubmit={handleSubmit}
      successMessage={successMessage}
    />
  )
}
