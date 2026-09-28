"use client"

import { useEffect, useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { EntryThreshold } from "@/components/auth"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [successMessage, setSuccessMessage] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()
  const [sessionReady, setSessionReady] = useState(false)

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

  // Verify the user has a valid recovery session from the reset link
  useEffect(() => {
    const supabase = createClient()
    if (!supabase) {
      setError("Authentication service unavailable.")
      return
    }

    const checkSession = async () => {
      // Supabase auto-exchanges the recovery token from the URL hash
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError("No valid recovery session found. Please request a new reset link.")
      } else {
        setSessionReady(true)
      }
    }

    // Listen for PASSWORD_RECOVERY event from the URL token exchange
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true)
        setError(undefined)
      }
    })

    checkSession()
    return () => subscription?.unsubscribe()
  }, [])

  const handleSubmit = useCallback(async (data: { password: string; confirmPassword?: string }) => {
    if (data.confirmPassword && data.password !== data.confirmPassword) {
      throw new Error("Passwords do not match")
    }

    const supabase = createClient()
    if (!supabase) {
      throw new Error("Authentication service unavailable.")
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: data.password,
    })

    if (updateError) {
      throw new Error(updateError.message)
    }

    setSuccessMessage("Your access key has been updated. Redirecting to authentication...")

    await new Promise((resolve) => setTimeout(resolve, 2400))
    router.push("/login?reset=success")
  }, [router])

  return (
    <EntryThreshold
      mode="reset-password"
      onSubmit={handleSubmit}
      error={error}
      successMessage={successMessage}
    />
  )
}
