"use client"

import { Suspense, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { IdentityCreation } from "@/components/auth"

function RegisterInner() {
  const router = useRouter()

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

  // Never auto-redirect on register -- user should always be able to create identity

  const handleComplete = useCallback(() => {
    router.push("/copilot")
  }, [router])

  const handleNavigateLogin = useCallback(() => {
    router.push("/login")
  }, [router])

  return (
    <IdentityCreation
      onComplete={handleComplete}
      onNavigateLogin={handleNavigateLogin}
    />
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0c14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500/60 rounded-full animate-spin" />
          <p className="text-slate-600 font-mono text-[10px] tracking-[0.15em] uppercase">Preparing identity creation</p>
        </div>
      </div>
    }>
      <RegisterInner />
    </Suspense>
  )
}
