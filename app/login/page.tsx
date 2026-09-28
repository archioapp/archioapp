"use client"

import { Suspense, useEffect, useCallback, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth/AuthProvider"
import { EntryThreshold } from "@/components/auth/EntryThreshold"
import { AccessPortal } from "@/components/auth/AccessPortal"
import { createClient } from "@/lib/supabase/client"
import { useSession } from "@/lib/stores/useSession"
import { ACCENT, SURFACE } from "@/components/mtf/mtf-theme"

function LoginInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || "/"
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { signIn } = useSession()
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const [mode, setMode] = useState<"face" | "credentials">("face")
  const [forceReady, setForceReady] = useState(false)

  // If auth check takes too long (Supabase paused), force render after 1.5s
  useEffect(() => {
    const t = setTimeout(() => setForceReady(true), 1500)
    return () => clearTimeout(t)
  }, [])

  const isLoading = authLoading && !forceReady

  /* Hide floating nav & community hub on auth pages */
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

  /* Only redirect if truly authenticated with a real session -- not just Zustand user */
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(from)
    }
  }, [isAuthenticated, isLoading, router, from])

  const handleSubmit = useCallback(async (data: { email: string; password: string }) => {
    setError(undefined)
    try {
      const supabase = createClient()
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        setError(authError.message)
        throw new Error(authError.message)
      }

      if (authData.user) {
        signIn({
          id: authData.user.id,
          handle: authData.user.email?.split("@")[0] || "operator",
          email: authData.user.email || undefined,
          role: "STUDENT",
        })
      }

      setSuccess("Access granted. Initializing all system layers...")
      await new Promise((r) => setTimeout(r, 1800))
      router.push(from)
    } catch {
      if (!error) setError("Connection failed. Check your network and try again.")
    }
  }, [router, from, signIn, error])

  const handleFaceAuth = useCallback(() => {
    signIn({
      id: "face-auth-user",
      handle: "operator",
      email: undefined,
      role: "STUDENT",
    })
    setSuccess("Identity verified. Entering platform...")
    setTimeout(() => router.push(from), 1500)
  }, [router, from, signIn])

  const errorMessage = useMemo(() => {
    const urlError = searchParams.get("error")
    if (urlError === "auth_callback_failed") return "Authentication callback failed. Please try again."
    return error
  }, [searchParams, error])

  /* Don't render until auth state is resolved */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: SURFACE.void }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500/60 rounded-full animate-spin" />
          <p className="text-slate-600 font-mono text-[10px] tracking-[0.15em] uppercase">Checking identity status</p>
        </div>
      </div>
    )
  }

  /* ── Face Scan mode (primary) ── */
  if (mode === "face") {
    return (
      <div className="min-h-screen relative" style={{ background: SURFACE.void }}>
        <AccessPortal
          onAuthenticated={handleFaceAuth}
          onNavigateRegister={() => router.push("/register")}
          error={errorMessage}
          successMessage={success}
          onSwitchToCredentials={() => setMode("credentials")}
        />
      </div>
    )
  }

  /* ── Credentials mode (fallback -- original EntryThreshold design) ── */
  return (
    <div className="min-h-screen relative" style={{ background: SURFACE.void }}>
      <EntryThreshold
        mode="login"
        onSubmit={handleSubmit}
        error={errorMessage}
        successMessage={success}
      />

      {/* Back to face scan link */}
      <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center">
        <button
          onClick={() => setMode("face")}
          className="group flex items-center gap-3 px-6 py-3 rounded-xl border transition-all duration-300"
          style={{
            background: `rgba(${ACCENT.purple.rgb}, 0.04)`,
            borderColor: `rgba(${ACCENT.purple.rgb}, 0.12)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `rgba(${ACCENT.purple.rgb}, 0.08)`
            e.currentTarget.style.borderColor = `rgba(${ACCENT.purple.rgb}, 0.25)`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `rgba(${ACCENT.purple.rgb}, 0.04)`
            e.currentTarget.style.borderColor = `rgba(${ACCENT.purple.rgb}, 0.12)`
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-40 group-hover:opacity-70 transition-opacity">
            <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.2" className="text-white" />
            <path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-white" />
          </svg>
          <span className="text-[12px] font-mono tracking-[0.08em] text-white/40 group-hover:text-white/70 transition-colors uppercase font-semibold">
            Use face scan instead
          </span>
        </button>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0c14" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500/60 rounded-full animate-spin" />
          <p className="text-slate-600 font-mono text-[10px] tracking-[0.15em] uppercase">Initializing access layers</p>
        </div>
      </div>
    }>
      <LoginInner />
    </Suspense>
  )
}
