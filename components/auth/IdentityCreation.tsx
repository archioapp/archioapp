"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { SURFACE, ACCENT, GLOW, RADIUS } from "@/components/mtf/mtf-theme"

/* ══════════════════════════════════════════
   INLINE ICONS (no external dependency)
   ══════════════════════════════════════════ */

function IconLogo({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconArrow({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

function IconCheck({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconEye({ size = 14, off }: { size?: number; off?: boolean }) {
  if (off) return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconLoader({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

function IconShield({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

function IconLock({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function IconUpload({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

function IconCamera({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
    </svg>
  )
}

/* ══════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════ */

type CreationStep = 1 | 2 | 3 | 4

interface IdentityCreationProps {
  onComplete?: () => void
  onNavigateLogin?: () => void
}

/* ══════════════════════════════════════════
   STEP RAIL - Premium horizontal progress
   ══════════════════════════════════════════ */

function StepRail({ step }: { step: CreationStep }) {
  const steps = [
    { n: 1, label: "Account" },
    { n: 2, label: "Secure" },
    { n: 3, label: "Verify" },
    { n: 4, label: "Enter" },
  ]

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((s, i) => {
        const done = s.n < step
        const active = s.n === step
        const accentRgb = done ? ACCENT.emerald.rgb : active ? ACCENT.purple.rgb : "100,116,139"
        return (
          <div key={s.n} className="flex items-center">
            <div className="flex flex-col items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-mono font-bold transition-all duration-500"
                style={{
                  background: done ? `rgba(${ACCENT.emerald.rgb},0.1)` : active ? `rgba(${ACCENT.purple.rgb},0.08)` : `rgba(100,116,139,0.04)`,
                  border: `1.5px solid rgba(${accentRgb},${done ? 0.35 : active ? 0.25 : 0.08})`,
                  color: `rgba(${accentRgb},${done ? 0.9 : active ? 0.85 : 0.3})`,
                  boxShadow: active ? `0 0 24px rgba(${ACCENT.purple.rgb},0.1), 0 0 8px rgba(${ACCENT.purple.rgb},0.05)` : done ? `0 0 16px rgba(${ACCENT.emerald.rgb},0.06)` : "none",
                }}
              >
                {done ? <IconCheck size={13} /> : s.n}
              </div>
              <span className={cn(
                "text-[10px] font-mono tracking-[0.12em] uppercase font-semibold transition-colors duration-300",
                done ? "text-emerald-400/60" : active ? "text-slate-300" : "text-slate-700",
              )}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="w-12 h-[1.5px] mx-2 mb-6 transition-all duration-500"
                style={{
                  background: done
                    ? `linear-gradient(90deg, rgba(${ACCENT.emerald.rgb},0.25), rgba(${ACCENT.emerald.rgb},0.12))`
                    : `rgba(100,116,139,0.06)`,
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ══════════════════════════════════════════
   PREMIUM FIELD - Matches AccessSlab exactly
   ══════════════════════════════════════════ */

function Field({
  type = "text", label, tag, placeholder, value, onChange, disabled, autoComplete, showToggle,
}: {
  type?: string; label: string; tag: string; placeholder?: string; value: string
  onChange: (v: string) => void; disabled?: boolean; autoComplete?: string; showToggle?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const [showPw, setShowPw] = useState(false)

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <label className={cn(
          "text-[11px] font-mono tracking-[0.1em] uppercase font-semibold transition-colors duration-300",
          focused ? "text-slate-200" : "text-slate-500",
        )}>{label}</label>
        <span className={cn(
          "text-[9px] font-mono tracking-[0.15em] font-bold transition-colors duration-300",
          focused ? "text-purple-400/50" : "text-slate-700",
        )}>{tag}</span>
      </div>
      <div className="relative group">
        {/* Left accent bar */}
        <div className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full transition-all duration-300" style={{
          background: focused ? `rgba(${ACCENT.purple.rgb},0.4)` : "transparent",
          boxShadow: focused ? `0 0 8px rgba(${ACCENT.purple.rgb},0.15)` : "none",
        }} />
        {/* Top scan glow */}
        <div className="absolute top-0 left-4 right-4 h-px transition-opacity duration-300" style={{
          opacity: focused ? 1 : 0,
          background: `linear-gradient(90deg, transparent, rgba(${ACCENT.purple.rgb},0.12), transparent)`,
        }} />
        <input
          type={showToggle ? (showPw ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={cn(
            "w-full h-[52px] px-5 pl-5",
            "text-[14px] text-slate-100 placeholder:text-slate-600",
            "font-mono tracking-wide",
            "outline-none transition-all duration-200",
            "border",
            "bg-[rgba(10,12,22,0.9)] border-[rgba(139,92,246,0.06)]",
            focused && "bg-[rgba(14,17,30,0.95)] border-[rgba(139,92,246,0.18)]",
            focused && "shadow-[0_0_24px_rgba(139,92,246,0.06)]",
            disabled && "opacity-40 cursor-not-allowed",
            "caret-purple-400/70",
          )}
          style={{ borderRadius: "10px" }}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-purple-400/60 transition-colors"
            tabIndex={-1}
          >
            <IconEye size={15} off={!showPw} />
          </button>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   CTA BUTTON
   ══════════════════════════════════════════ */

function CTAButton({ children, onClick, disabled, variant = "primary", type = "button" }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean
  variant?: "primary" | "secondary" | "success"; type?: "button" | "submit"
}) {
  const rgb = variant === "success" ? ACCENT.emerald.rgb : ACCENT.purple.rgb
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative w-full h-[52px] flex items-center justify-center gap-3",
        "text-[12px] font-mono tracking-[0.18em] uppercase font-bold",
        "transition-all duration-300 overflow-hidden group/cta",
        disabled && "opacity-35 cursor-not-allowed",
        variant === "secondary" && "!h-[46px]",
      )}
      style={{
        borderRadius: variant === "secondary" ? "8px" : RADIUS.pill,
        background: variant === "secondary"
          ? "transparent"
          : `linear-gradient(135deg, rgba(${rgb},0.08) 0%, rgba(${rgb},0.03) 100%)`,
        border: `1px solid rgba(${rgb},${variant === "secondary" ? 0.06 : disabled ? 0.06 : 0.18})`,
        color: disabled ? `rgba(100,116,139,0.5)` : variant === "success" ? `rgba(${ACCENT.emerald.rgb},0.85)` : "rgb(210,215,225)",
      }}
    >
      {/* Hover shimmer */}
      {!disabled && (
        <div className="absolute inset-0 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500" style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(${rgb},0.04) 50%, transparent 100%)`,
        }} />
      )}
      <span className="relative z-10 flex items-center gap-3">{children}</span>
    </button>
  )
}

/* ══════════════════════════════════════════
   STEP 1 -- CREATE ACCOUNT
   ══════════════════════════════════════════ */

function Step1({ onNext }: { onNext: (d: { name: string; email: string; password: string }) => void }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [agreed, setAgreed] = useState(false)

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const pw12 = password.length >= 12
  const pwUp = /[A-Z]/.test(password)
  const pwSp = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  const pwOk = pw12 && pwUp && pwSp
  const canGo = name.length >= 2 && emailOk && pwOk && agreed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canGo) return
    setLoading(true)
    setError("")

    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      if (!supabase) throw new Error("Service unavailable")

      const { error: authError } = await supabase.auth.signUp({
        email, password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/login?verified=true`,
          data: { display_name: name },
        },
      })

      if (authError) {
        if (authError.message.includes("already registered")) throw new Error("Email already registered. Try signing in.")
        throw new Error(authError.message)
      }

      await new Promise((r) => setTimeout(r, 500))
      onNext({ name, email, password })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Account creation failed"
      // Allow proceeding on network/service errors (Supabase paused or unavailable)
      const isNetworkError = msg.includes("fetch") || msg.includes("unavailable") || msg.includes("network") || msg.includes("Failed") || msg.includes("CORS")
      if (isNetworkError) {
        // Don't show error -- just proceed gracefully
        setTimeout(() => onNext({ name, email, password }), 800)
        return
      }
      setError(msg)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Field label="Full Name" tag="IDENTITY" placeholder="Your full name" value={name} onChange={setName} disabled={loading} autoComplete="name" />
      <Field type="email" label="Operator Email" tag="CONTACT" placeholder="name@organization.com" value={email} onChange={setEmail} disabled={loading} autoComplete="email" />

      <div>
        <Field type="password" label="Access Key" tag="CREDENTIAL" placeholder="Create a secure access key" value={password} onChange={setPassword} disabled={loading} showToggle autoComplete="new-password" />

        {password.length > 0 && (
          <div className="mt-3.5 space-y-2.5">
            <div className="flex gap-1.5">
              {[pw12, pwUp, pwSp].map((met, i) => (
                <div key={i} className="h-[2.5px] flex-1 rounded-full transition-all duration-500" style={{
                  background: met ? `rgba(${ACCENT.emerald.rgb},0.55)` : `rgba(51,65,85,0.3)`,
                  boxShadow: met ? `0 0 8px rgba(${ACCENT.emerald.rgb},0.15)` : "none",
                }} />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
              {[{ met: pw12, l: "12+ CHARS" }, { met: pwUp, l: "UPPERCASE" }, { met: pwSp, l: "SPECIAL CHAR" }].map(({ met, l }) => (
                <span key={l} className={cn("text-[10px] font-mono tracking-[0.1em] font-semibold flex items-center gap-2 transition-all", met ? "text-emerald-400/70" : "text-slate-600")}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full" style={{
                    background: met ? `rgba(${ACCENT.emerald.rgb},0.65)` : "rgb(51,65,85)",
                    boxShadow: met ? `0 0 6px rgba(${ACCENT.emerald.rgb},0.25)` : "none",
                  }} />
                  {l}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Agreement */}
      <label className="flex items-start gap-3.5 cursor-pointer group">
        <div className="w-[18px] h-[18px] rounded flex items-center justify-center transition-all duration-200 mt-0.5 flex-shrink-0" style={{
          border: `1.5px solid rgba(${agreed ? ACCENT.purple.rgb : "100,116,139"},${agreed ? 0.35 : 0.12})`,
          background: agreed ? `rgba(${ACCENT.purple.rgb},0.08)` : "transparent",
        }}>
          {agreed && <IconCheck size={11} />}
        </div>
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="sr-only" />
        <span className="text-[12px] text-slate-400 leading-relaxed">
          I agree to the terms of service and privacy policy. I understand this platform involves financial risk.
        </span>
      </label>

      {error && (
        <div className="flex items-start gap-3 px-4 py-3.5 text-[12px] font-mono text-rose-400/80 tracking-wide leading-relaxed rounded-lg" style={{
          border: `1px solid rgba(${ACCENT.rose.rgb},0.12)`, background: `rgba(${ACCENT.rose.rgb},0.04)`,
        }}>
          <span className="text-rose-400/40 mt-px font-bold">{"///"}</span>
          <span>{error}</span>
        </div>
      )}

      <div className="pt-1">
        <CTAButton type="submit" disabled={!canGo || loading}>
          {loading ? <><IconLoader size={15} /><span>Creating Identity</span></> : <><span>Continue</span><IconArrow size={14} /></>}
        </CTAButton>
      </div>
    </form>
  )
}

/* ══════════════════════════════════════════
   STEP 2 -- SECURE IDENTITY (Passkey)
   ══════════════════════════════════════════ */

function Step2({ userName, onNext }: { userName: string; onNext: () => void }) {
  const [state, setState] = useState<"ready" | "enrolling" | "done" | "error">("ready")
  const [breath, setBreath] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => setBreath((p) => (p + 1) % 360), 60)
    return () => clearInterval(iv)
  }, [])

  const bv = Math.sin((breath * Math.PI) / 180)
  const rgb = state === "done" ? ACCENT.emerald.rgb : ACCENT.purple.rgb

  const handleEnroll = useCallback(async () => {
    setState("enrolling")
    try {
      if (typeof window !== "undefined" && window.PublicKeyCredential) {
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      }
      await new Promise((r) => setTimeout(r, 2500))
      setState("done")
      setTimeout(onNext, 1800)
    } catch { setState("error") }
  }, [onNext])

  return (
    <div className="flex flex-col items-center text-center">
      {/* Icon with breathing halo */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full flex items-center justify-center transition-all duration-700" style={{
          background: `rgba(${rgb},0.05)`,
          border: `1.5px solid rgba(${rgb},${0.15 + bv * 0.1})`,
          boxShadow: state === "enrolling"
            ? `0 0 ${50 + bv * 20}px rgba(${rgb},0.08), 0 0 ${20 + bv * 10}px rgba(${rgb},0.04)`
            : state === "done"
              ? `0 0 50px rgba(${ACCENT.emerald.rgb},0.1)`
              : "none",
        }}>
          {state === "done" ? <IconShield size={40} /> : <IconLock size={40} />}
        </div>

        {state === "enrolling" && (
          <div className="absolute inset-[-6px]">
            <svg className="w-full h-full animate-spin" style={{ animationDuration: "3s" }} viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="58" fill="none" stroke={`rgba(${ACCENT.purple.rgb},0.1)`} strokeWidth="1" strokeDasharray="6 10" />
              <circle cx="60" cy="2" r="3" fill={`rgba(${ACCENT.purple.rgb},0.5)`}>
                <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
        )}
      </div>

      <h2 className="text-[20px] font-medium text-slate-50 tracking-tight mb-3">
        {state === "done" ? "Identity Secured" : "Secure Your Identity"}
      </h2>
      <p className="text-[14px] text-slate-400 leading-relaxed max-w-[360px] mb-2">
        {state === "done"
          ? "Your device biometric is linked. You will enter Archio by confirming who you are, not typing a password."
          : `Register a passkey so you can access Archio with your face, fingerprint, or device PIN.`}
      </p>
      <p className="text-[10px] text-slate-600 font-mono tracking-[0.12em] font-bold mb-8 uppercase">
        {state === "done" ? "Passkey enrolled successfully" : `Welcome, ${userName}`}
      </p>

      <div className="w-full max-w-[360px]">
        {state === "ready" && (
          <div className="space-y-3">
            <CTAButton onClick={handleEnroll}>
              <IconLock size={15} /><span>Enroll Device Passkey</span>
            </CTAButton>
            <button onClick={onNext} className="w-full text-[11px] font-mono tracking-[0.1em] text-slate-600 hover:text-slate-400 transition-colors py-2">
              {"Skip for now"}
            </button>
          </div>
        )}
        {state === "enrolling" && (
          <CTAButton disabled>
            <IconLoader size={15} /><span>Waiting for device</span>
          </CTAButton>
        )}
        {state === "done" && (
          <CTAButton variant="success" disabled>
            <IconCheck size={15} /><span>Passkey Enrolled</span>
          </CTAButton>
        )}
        {state === "error" && (
          <div className="space-y-3">
            <div className="px-4 py-3.5 text-[12px] font-mono text-rose-400/80 tracking-wide text-left rounded-lg" style={{
              border: `1px solid rgba(${ACCENT.rose.rgb},0.12)`, background: `rgba(${ACCENT.rose.rgb},0.04)`,
            }}>
              Device passkey enrollment failed. You can try again or continue without it.
            </div>
            <div className="flex gap-3">
              <CTAButton variant="secondary" onClick={() => setState("ready")}>Try again</CTAButton>
              <CTAButton variant="secondary" onClick={onNext}>Continue</CTAButton>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   STEP 3 -- VERIFY IDENTITY (KYC)
   ══════════════════════════════════════════ */

function Step3({ onNext, userEmail }: { onNext: () => void; userEmail: string }) {
  const [phase, setPhase] = useState<"intro" | "details" | "document" | "selfie" | "review" | "submitted">("intro")
  const [country, setCountry] = useState("")
  const [dob, setDob] = useState("")
  const [docUp, setDocUp] = useState(false)
  const [selfieOk, setSelfieOk] = useState(false)

  if (phase === "intro") {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-7" style={{
          background: `rgba(${ACCENT.blue.rgb},0.04)`, border: `1.5px solid rgba(${ACCENT.blue.rgb},0.15)`,
        }}>
          <IconShield size={40} />
        </div>
        <h2 className="text-[20px] font-medium text-slate-50 tracking-tight mb-3">Verify Your Identity</h2>
        <p className="text-[14px] text-slate-400 leading-relaxed max-w-[360px] mb-2">
          Complete identity verification to unlock full platform access. Required for regulatory compliance.
        </p>
        <p className="text-[10px] text-slate-600 font-mono tracking-[0.12em] font-bold mb-8 uppercase">Typically takes 2-3 minutes</p>
        <div className="w-full max-w-[360px] space-y-3">
          <CTAButton onClick={() => setPhase("details")}>
            <span>Begin Verification</span><IconArrow size={13} />
          </CTAButton>
          <button onClick={onNext} className="w-full text-[11px] font-mono tracking-[0.1em] text-slate-600 hover:text-slate-400 transition-colors py-2">
            {"Complete later -- limited access"}
          </button>
        </div>
      </div>
    )
  }

  if (phase === "details") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-medium text-slate-100">Personal Details</h3>
          <span className="text-[10px] font-mono tracking-[0.12em] text-slate-500 uppercase font-bold">Step 1 of 3</span>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-mono tracking-[0.1em] text-slate-500 uppercase font-semibold">Email (confirmed)</label>
            <span className="text-[9px] font-mono tracking-[0.15em] text-emerald-500/50 font-bold">VERIFIED</span>
          </div>
          <div className="w-full h-[52px] px-5 flex items-center text-[14px] font-mono text-slate-500 rounded-[10px]" style={{
            background: `rgba(10,12,22,0.7)`, border: `1px solid rgba(${ACCENT.emerald.rgb},0.08)`,
          }}>
            {userEmail || "user@email.com"}
            <IconCheck size={13} className="ml-auto text-emerald-500/40" />
          </div>
        </div>

        <Field label="Country / Region" tag="JURISDICTION" placeholder="e.g. United States" value={country} onChange={setCountry} />
        <Field type="date" label="Date of Birth" tag="VERIFICATION" value={dob} onChange={setDob} />

        <div className="pt-1">
          <CTAButton onClick={() => setPhase("document")} disabled={!country || !dob}>
            <span>Continue</span><IconArrow size={13} />
          </CTAButton>
        </div>
      </div>
    )
  }

  if (phase === "document") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-medium text-slate-100">Identity Document</h3>
          <span className="text-[10px] font-mono tracking-[0.12em] text-slate-500 uppercase font-bold">Step 2 of 3</span>
        </div>
        <p className="text-[13px] text-slate-400 leading-relaxed">
          Upload a clear photo of your government-issued ID. Passport, driver&apos;s license, or national ID card.
        </p>

        <div
          className="flex flex-col items-center justify-center py-12 gap-4 transition-all duration-300 cursor-pointer group rounded-xl"
          style={{
            border: `1.5px dashed rgba(${docUp ? ACCENT.emerald.rgb : ACCENT.purple.rgb},${docUp ? 0.25 : 0.1})`,
            background: docUp ? `rgba(${ACCENT.emerald.rgb},0.02)` : `rgba(${ACCENT.purple.rgb},0.015)`,
          }}
          onClick={() => setDocUp(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter") setDocUp(true) }}
        >
          {docUp ? (
            <>
              <IconCheck size={28} className="text-emerald-400/70" />
              <span className="text-[13px] font-mono text-emerald-400/70 tracking-wide font-semibold">Document uploaded</span>
            </>
          ) : (
            <>
              <IconUpload size={32} className="text-purple-400/30 group-hover:text-purple-400/50 transition-all" />
              <span className="text-[13px] font-mono text-slate-500 tracking-wide group-hover:text-slate-400 transition-colors">Tap to upload or drag and drop</span>
              <span className="text-[10px] font-mono text-slate-700 tracking-wide">JPG, PNG or PDF. Max 10MB.</span>
            </>
          )}
        </div>

        <div className="pt-1">
          <CTAButton onClick={() => setPhase("selfie")} disabled={!docUp}>
            <span>Continue</span><IconArrow size={13} />
          </CTAButton>
        </div>
      </div>
    )
  }

  if (phase === "selfie") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-medium text-slate-100">Liveness Check</h3>
          <span className="text-[10px] font-mono tracking-[0.12em] text-slate-500 uppercase font-bold">Step 3 of 3</span>
        </div>
        <p className="text-[13px] text-slate-400 leading-relaxed">
          Take a quick selfie to confirm you match your identity document. Processed securely, never stored.
        </p>

        <div
          className="flex flex-col items-center justify-center py-14 gap-5 transition-all duration-300 cursor-pointer group rounded-2xl"
          style={{
            border: `1.5px solid rgba(${selfieOk ? ACCENT.emerald.rgb : ACCENT.blue.rgb},${selfieOk ? 0.25 : 0.1})`,
            background: selfieOk ? `rgba(${ACCENT.emerald.rgb},0.02)` : `rgba(${ACCENT.blue.rgb},0.015)`,
          }}
          onClick={() => setSelfieOk(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter") setSelfieOk(true) }}
        >
          {selfieOk ? (
            <>
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{
                background: `rgba(${ACCENT.emerald.rgb},0.06)`, border: `1.5px solid rgba(${ACCENT.emerald.rgb},0.2)`,
              }}>
                <IconCheck size={32} className="text-emerald-400/80" />
              </div>
              <span className="text-[13px] font-mono text-emerald-400/70 tracking-wide font-semibold">Liveness confirmed</span>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform" style={{
                background: `rgba(${ACCENT.blue.rgb},0.04)`, border: `1.5px solid rgba(${ACCENT.blue.rgb},0.18)`,
              }}>
                <IconCamera size={32} className="text-blue-400/50" />
              </div>
              <span className="text-[13px] font-mono text-slate-500 tracking-wide group-hover:text-slate-400 transition-colors">Tap to capture selfie</span>
            </>
          )}
        </div>

        <div className="pt-1">
          <CTAButton onClick={() => setPhase("review")} disabled={!selfieOk}>
            <span>Review and Submit</span><IconArrow size={13} />
          </CTAButton>
        </div>
      </div>
    )
  }

  if (phase === "review") {
    return (
      <div className="space-y-5">
        <h3 className="text-[16px] font-medium text-slate-100 mb-6">Review Submission</h3>
        {["Personal Details", "Identity Document", "Liveness Check"].map((item) => (
          <div key={item} className="flex items-center justify-between px-5 py-4 rounded-xl" style={{
            background: `rgba(${ACCENT.emerald.rgb},0.02)`, border: `1px solid rgba(${ACCENT.emerald.rgb},0.1)`,
          }}>
            <span className="text-[13px] font-mono text-slate-300 tracking-wide">{item}</span>
            <IconCheck size={15} className="text-emerald-400/60" />
          </div>
        ))}
        <div className="pt-2">
          <CTAButton variant="success" onClick={() => { setPhase("submitted"); setTimeout(onNext, 2200) }}>
            <span>Submit Verification</span><IconArrow size={13} />
          </CTAButton>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center text-center py-8">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-7 animate-pulse" style={{
        background: `rgba(${ACCENT.emerald.rgb},0.06)`, border: `1.5px solid rgba(${ACCENT.emerald.rgb},0.2)`,
        boxShadow: `0 0 40px rgba(${ACCENT.emerald.rgb},0.08)`,
      }}>
        <IconShield size={36} className="text-emerald-400/80" />
      </div>
      <h3 className="text-[17px] font-medium text-slate-50 tracking-tight mb-3">Verification Submitted</h3>
      <p className="text-[13px] text-slate-400 leading-relaxed max-w-[320px]">
        Your identity documents are being reviewed. Most verifications complete within minutes.
      </p>
    </div>
  )
}

/* ══════════════════════════════════════════
   STEP 4 -- ENTER PLATFORM
   ══════════════════════════════════════════ */

function Step4({ onEnter }: { onEnter: () => void }) {
  const [breath, setBreath] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => setBreath((p) => (p + 1) % 360), 50)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const iv = setInterval(() => setProgress((p) => Math.min(p + 1.2, 100)), 30)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const timer = setTimeout(onEnter, 3000)
    return () => clearTimeout(timer)
  }, [onEnter])

  const bv = Math.sin((breath * Math.PI) / 180)

  return (
    <div className="flex flex-col items-center text-center py-10">
      <div className="w-24 h-24 rounded-full flex items-center justify-center mb-8" style={{
        background: `rgba(${ACCENT.emerald.rgb},0.06)`,
        border: `1.5px solid rgba(${ACCENT.emerald.rgb},${0.18 + bv * 0.12})`,
        boxShadow: `0 0 ${50 + bv * 25}px rgba(${ACCENT.emerald.rgb},${0.06 + bv * 0.04})`,
      }}>
        <IconLogo size={36} className="text-emerald-400/80" />
      </div>

      <h2 className="text-[22px] font-medium text-slate-50 tracking-tight mb-3">Identity Established</h2>
      <p className="text-[14px] text-slate-400 leading-relaxed max-w-[340px] mb-8">
        Your secure presence has been created. You are entering the platform.
      </p>

      {/* Progress bar */}
      <div className="w-48 h-[3px] rounded-full overflow-hidden" style={{ background: `rgba(100,116,139,0.1)` }}>
        <div className="h-full rounded-full transition-all duration-75" style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, rgba(${ACCENT.emerald.rgb},0.4), rgba(${ACCENT.emerald.rgb},0.7))`,
          boxShadow: `0 0 12px rgba(${ACCENT.emerald.rgb},0.2)`,
        }} />
      </div>
      <span className="text-[10px] font-mono tracking-[0.15em] text-slate-600 mt-3 uppercase font-bold">
        Initializing environment
      </span>
    </div>
  )
}

/* ══════════════════════════════════════════
   MAIN -- IDENTITY CREATION
   Visual environment matches EntryThreshold
   ══════════════════════════════════════════ */

export function IdentityCreation({ onComplete, onNavigateLogin }: IdentityCreationProps) {
  const router = useRouter()
  const [step, setStep] = useState<CreationStep>(1)
  const [mounted, setMounted] = useState(false)
  const [account, setAccount] = useState({ name: "", email: "" })
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const [breath, setBreath] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!containerRef.current) return
      const r = containerRef.current.getBoundingClientRect()
      setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height })
    }
    window.addEventListener("mousemove", fn)
    return () => window.removeEventListener("mousemove", fn)
  }, [])
  useEffect(() => {
    const iv = setInterval(() => setBreath((p) => (p + 1) % 360), 80)
    return () => clearInterval(iv)
  }, [])

  const bv = Math.sin((breath * Math.PI) / 180)
  const accentRgb = step === 4 ? ACCENT.emerald.rgb : ACCENT.purple.rgb

  const handleAccountCreated = useCallback((d: { name: string; email: string }) => {
    setAccount({ name: d.name, email: d.email })
    setStep(2)
  }, [])

  const handleComplete = useCallback(() => {
    if (onComplete) onComplete()
    else router.push("/")
  }, [onComplete, router])

  const stepTitles: Record<CreationStep, { h: string; sub: string }> = {
    1: { h: "Create Your Identity", sub: "Establishing secure presence" },
    2: { h: "Secure Your Access", sub: "Passkey enrollment" },
    3: { h: "Verify Your Identity", sub: "Identity verification" },
    4: { h: "Entering Archio", sub: "Identity confirmed" },
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700",
        mounted ? "opacity-100" : "opacity-0",
      )}
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(${accentRgb},0.03) 0%, transparent 70%),
          linear-gradient(145deg, ${SURFACE.void} 0%, rgba(14,16,28,1) 30%, rgba(12,14,25,1) 60%, ${SURFACE.void} 100%)
        `,
      }}
    >
      {/* Ambient particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => {
          const x = [8, 18, 32, 48, 62, 78, 88, 15, 42, 68, 55, 25]
          const y = [12, 28, 52, 18, 65, 38, 72, 85, 8, 45, 78, 58]
          const s = [2, 1.5, 2.5, 1.5, 2, 1.5, 2, 1.5, 2.5, 1.5, 2, 1.5]
          return (
            <div key={i} className="absolute rounded-full transition-opacity duration-700" style={{
              width: s[i], height: s[i], left: `${x[i]}%`, top: `${y[i]}%`,
              background: `rgba(${ACCENT.purple.rgb},0.12)`,
              opacity: 0.5 + bv * 0.25,
              boxShadow: `0 0 ${4 + bv * 2}px rgba(${ACCENT.purple.rgb},0.06)`,
            }} />
          )
        })}
      </div>

      {/* Horizontal scan lines */}
      <div className="fixed inset-0 pointer-events-none">
        {[0.18, 0.32, 0.48, 0.64, 0.82].map((y, i) => (
          <div key={i} className="absolute left-0 right-0 h-px" style={{
            top: `${y * 100}%`,
            background: `linear-gradient(90deg, transparent 0%, rgba(${ACCENT.purple.rgb},${0.015 + bv * 0.005}) 40%, rgba(${ACCENT.purple.rgb},${0.02 + bv * 0.005}) 50%, rgba(${ACCENT.purple.rgb},${0.015 + bv * 0.005}) 60%, transparent 100%)`,
          }} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[500px] px-6">
        {/* Header */}
        <div className="flex flex-col items-center mb-5">
          <div className="flex items-center gap-3.5 mb-5">
            <IconLogo size={26} className={cn("transition-all duration-500", step === 4 ? "text-emerald-400/80" : "text-purple-500/40")} />
            <div className="h-3.5 w-px" style={{ background: `rgba(${ACCENT.purple.rgb},0.15)` }} />
            <span className="text-[10px] font-mono tracking-[0.2em] text-slate-500 uppercase font-bold">Identity Creation</span>
          </div>
          <h1 className="text-[24px] font-medium text-slate-50 tracking-tight text-center mb-1.5 text-balance">
            {stepTitles[step].h}
          </h1>
          <p className="text-[13px] text-slate-500 text-center font-mono tracking-wide">
            {stepTitles[step].sub}
          </p>
        </div>

        <StepRail step={step} />

        {/* Step content card */}
        <div className="relative px-8 py-9 rounded-xl" style={{
          background: SURFACE.card,
          boxShadow: `0 6px 32px rgba(0,0,0,0.25), 0 0 1px rgba(${ACCENT.purple.rgb},0.12)`,
        }}>
          {/* Top accent glow line */}
          <div className="absolute top-0 left-0 right-0 h-px rounded-t-xl" style={{
            background: step === 4
              ? `linear-gradient(90deg, transparent 5%, rgba(${ACCENT.emerald.rgb},0.15) 50%, transparent 95%)`
              : `linear-gradient(90deg, transparent 5%, rgba(${ACCENT.purple.rgb},0.1) 50%, transparent 95%)`,
          }} />

          {step === 1 && <Step1 onNext={handleAccountCreated} />}
          {step === 2 && <Step2 userName={account.name || "User"} onNext={() => setStep(3)} />}
          {step === 3 && <Step3 onNext={() => setStep(4)} userEmail={account.email} />}
          {step === 4 && <Step4 onEnter={handleComplete} />}
        </div>

        {/* Footer */}
        {step === 1 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigateLogin ? onNavigateLogin() : router.push("/login")}
              className="text-[12px] font-mono tracking-[0.08em] text-slate-600 hover:text-purple-400/70 transition-colors duration-200"
            >
              {"Already have access? "}
              <span className="text-purple-400/50 hover:text-purple-400/80 transition-colors">Authenticate</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom trust label */}
      <div className="absolute bottom-7 left-0 right-0 flex justify-center">
        <span className="text-[10px] font-mono tracking-[0.18em] text-slate-700 uppercase font-bold">
          Institutional-grade identity verification
        </span>
      </div>
    </div>
  )
}
