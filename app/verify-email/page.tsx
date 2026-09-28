"use client"

import { Suspense, useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ArchioLogoMark,
  EmailIcon,
  ArrowRightIcon,
} from "@/components/auth/icons"

function VerifyEmailInner() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "your registered email"
  const [breathPhase, setBreathPhase] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Hide community hub and floating nav on this page
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

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Ambient breathing
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase((p) => (p + 1) % 360)
    }, 80)
    return () => clearInterval(interval)
  }, [])

  const breathValue = Math.sin((breathPhase * Math.PI) / 180)

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(
            ellipse 80% 60% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
            rgba(40,48,70, 0.06) 0%,
            transparent 70%
          ),
          linear-gradient(
            135deg,
            rgb(12, 15, 24) 0%,
            rgb(16, 19, 30) 25%,
            rgb(14, 17, 28) 50%,
            rgb(12, 15, 26) 75%,
            rgb(10, 13, 22) 100%
          )
        `,
      }}
    >
      {/* Grid fabric */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          opacity: 0.02 + breathValue * 0.005,
          backgroundImage: `
            linear-gradient(90deg, rgba(120, 130, 155, 0.4) 1px, transparent 1px),
            linear-gradient(rgba(120, 130, 155, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Horizontal seam lines */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[0.3, 0.5, 0.7].map((y, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px"
            style={{
              top: `${y * 100}%`,
              background: `linear-gradient(90deg, transparent 0%, rgba(80, 90, 110, ${0.02 + breathValue * 0.01}) 40%, rgba(80, 90, 110, ${0.04 + breathValue * 0.015}) 50%, rgba(80, 90, 110, ${0.02 + breathValue * 0.01}) 60%, transparent 100%)`,
            }}
          />
        ))}
      </div>

      {/* Center divider line */}
      <div
        className="fixed top-0 bottom-0 w-px left-1/2 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, transparent 15%, rgba(60, 70, 90, 0.06) 50%, transparent 85%)`,
        }}
      />

      {/* Main card */}
      <div
        className={cn(
          "relative z-10 w-full max-w-[440px] mx-6",
          "transition-all duration-700",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        )}
      >
        <div
          className="relative px-10 py-12 border border-slate-700/35 bg-[rgba(16,19,32,0.94)]"
          style={{ borderRadius: 0 }}
        >
          {/* Top edge seam */}
          <div
            className="absolute top-0 left-6 right-6 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(100, 140, 200, 0.1), transparent)",
            }}
          />

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <ArchioLogoMark size={24} className="text-slate-500" />
            <div className="h-3 w-px bg-slate-800/40" />
            <span className="text-[9px] font-mono tracking-[0.18em] text-slate-600 uppercase">
              Identity Verification
            </span>
            <div className="flex-1" />
            <div className="relative">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400/70" style={{ boxShadow: "0 0 6px rgba(96, 165, 250, 0.4)" }} />
              <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-blue-400/50 animate-ping" style={{ animationDuration: "2s" }} />
            </div>
          </div>

          {/* Email icon -- large, animated */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* Orbit ring */}
              <div
                className="absolute inset-[-12px] border border-slate-700/20 rounded-full"
                style={{
                  animation: "spin 20s linear infinite",
                }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-blue-400/40" />
              </div>
              {/* Outer glow */}
              <div
                className="absolute inset-[-6px] rounded-full"
                style={{
                  background: `radial-gradient(circle, rgba(96, 165, 250, ${0.04 + breathValue * 0.02}), transparent 70%)`,
                }}
              />
              {/* Icon container */}
              <div
                className="w-16 h-16 flex items-center justify-center border border-slate-600/30 bg-[rgba(20,24,38,0.8)]"
                style={{ borderRadius: 0 }}
              >
                <EmailIcon size={28} className="text-blue-400/60" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-[18px] font-medium text-slate-100 tracking-tight text-center mb-3">
            Verification Signal Sent
          </h1>

          <p className="text-[12px] text-slate-400 leading-relaxed text-center mb-2">
            A verification link has been transmitted to:
          </p>

          {/* Email display */}
          <div
            className="mx-auto max-w-[320px] px-4 py-2.5 mb-8 border border-slate-700/30 bg-[rgba(20,24,38,0.6)]"
            style={{ borderRadius: 0 }}
          >
            <p className="text-[13px] font-mono text-slate-300 text-center tracking-wide truncate">
              {email}
            </p>
          </div>

          {/* Divider */}
          <div
            className="h-px mb-7"
            style={{
              background: "linear-gradient(90deg, rgba(60, 70, 90, 0.15), rgba(60, 70, 90, 0.04))",
            }}
          />

          {/* Instructions */}
          <div className="space-y-4 mb-8">
            {[
              { step: "01", text: "Open the verification email from ArchioAI" },
              { step: "02", text: "Click the secure verification link" },
              { step: "03", text: "You will be redirected to authenticate" },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-4">
                <span className="text-[9px] font-mono tracking-[0.15em] text-slate-600 mt-0.5 flex-shrink-0">
                  {step}
                </span>
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-slate-700 flex-shrink-0" />
                  <p className="text-[11px] font-mono text-slate-400 tracking-wide">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Warning */}
          <div
            className="px-4 py-3 mb-7 border border-slate-700/20 bg-[rgba(20,24,38,0.5)]"
            style={{ borderRadius: 0 }}
          >
            <p className="text-[10px] font-mono text-slate-500 tracking-wide leading-relaxed">
              {"/// "}The link expires in 24 hours. Check your spam folder if you do not see the email within a few minutes.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <a
              href="/login"
              className={cn(
                "relative w-full h-[42px] flex items-center justify-center gap-2.5",
                "border border-slate-700/30 bg-[rgba(16,20,32,0.8)]",
                "text-[11px] font-mono tracking-[0.15em] text-slate-400",
                "hover:bg-[rgba(22,28,44,0.9)] hover:border-slate-500/30 hover:text-slate-200",
                "transition-all duration-250 group/btn",
              )}
              style={{ borderRadius: 0 }}
            >
              <span>RETURN TO ACCESS</span>
              <ArrowRightIcon size={12} className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </a>
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-slate-700/20" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-slate-700/20" />
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-slate-700/20" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-slate-700/20" />
        </div>

        {/* Sub-card legal */}
        <p className="text-center text-[9px] font-mono text-slate-700 mt-5 tracking-[0.08em]">
          Secured by institutional-grade encryption protocols.
        </p>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0c14]" />}>
      <VerifyEmailInner />
    </Suspense>
  )
}
