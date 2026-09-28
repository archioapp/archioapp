"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { AccessSlab, type InteractionState, type AuthMode } from "./AccessSlab"
import { AccessArchitecturePreview } from "./AccessArchitecturePreview"
import { SURFACE, ACCENT, GLOW } from "@/components/mtf/mtf-theme"

interface EntryThresholdProps {
  mode: AuthMode
  onSubmit?: (data: { email: string; password: string; confirmPassword?: string }) => Promise<void>
  error?: string
  successMessage?: string
}

export function EntryThreshold({ mode, onSubmit, error, successMessage }: EntryThresholdProps) {
  const [interactionState, setInteractionState] = useState<InteractionState>("idle")
  const [, setHoveredLayer] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [breathPhase, setBreathPhase] = useState(0)

  const handleInteractionChange = useCallback((state: InteractionState) => {
    setInteractionState(state)
  }, [])

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

  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase((p) => (p + 1) % 360)
    }, 80)
    return () => clearInterval(interval)
  }, [])

  const breathValue = Math.sin((breathPhase * Math.PI) / 180)
  const isEngaged = interactionState !== "idle"
  const isActive = ["email-focus", "password-focus", "confirm-focus", "cta-hover"].includes(interactionState)
  const isProcessing = interactionState === "submitting"
  const isComplete = interactionState === "success"

  const accentRgb = isComplete ? ACCENT.emerald.rgb : isProcessing ? ACCENT.blue.rgb : ACCENT.purple.rgb

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen flex overflow-hidden"
      style={{
        background: `
          radial-gradient(
            ellipse 80% 60% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
            rgba(${accentRgb}, ${isEngaged ? 0.06 : 0.02}) 0%,
            transparent 70%
          ),
          linear-gradient(
            145deg,
            ${SURFACE.void} 0%,
            rgba(14,16,28,1) 30%,
            rgba(12,14,25,1) 60%,
            ${SURFACE.void} 100%
          )
        `,
      }}
    >
      {/* Ambient particle dots -- matching MTF star field */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => {
          const sizes = [2, 1.5, 2.5, 1, 2, 1.5, 1, 2.5]
          const xPos = [12, 28, 45, 62, 78, 88, 35, 55]
          const yPos = [18, 35, 55, 22, 68, 42, 82, 12]
          const colors = [
            `rgba(${ACCENT.purple.rgb},0.12)`,
            `rgba(${ACCENT.blue.rgb},0.08)`,
            `rgba(${ACCENT.rose.rgb},0.06)`,
            `rgba(${ACCENT.purple.rgb},0.1)`,
            `rgba(${ACCENT.emerald.rgb},0.06)`,
            `rgba(${ACCENT.amber.rgb},0.05)`,
            `rgba(${ACCENT.purple.rgb},0.08)`,
            `rgba(${ACCENT.cyan.rgb},0.06)`,
          ]
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: sizes[i],
                height: sizes[i],
                left: `${xPos[i]}%`,
                top: `${yPos[i]}%`,
                background: colors[i],
                opacity: 0.6 + breathValue * 0.2,
                transition: "opacity 0.4s",
              }}
            />
          )
        })}
      </div>

      {/* Subtle horizontal data lines with purple accent */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[0.2, 0.35, 0.5, 0.65, 0.8].map((y, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px transition-all"
            style={{
              top: `${y * 100}%`,
              background: isActive
                ? `linear-gradient(90deg, transparent 0%, rgba(${ACCENT.purple.rgb},${0.04 + breathValue * 0.02}) 30%, rgba(${ACCENT.purple.rgb},${0.06 + breathValue * 0.02}) 50%, rgba(${ACCENT.purple.rgb},${0.04 + breathValue * 0.02}) 70%, transparent 100%)`
                : `linear-gradient(90deg, transparent 0%, rgba(${ACCENT.purple.rgb},${0.015 + breathValue * 0.005}) 40%, rgba(${ACCENT.purple.rgb},${0.02 + breathValue * 0.005}) 50%, rgba(${ACCENT.purple.rgb},${0.015 + breathValue * 0.005}) 60%, transparent 100%)`,
              transitionDuration: `${800 + i * 200}ms`,
            }}
          />
        ))}
      </div>

      {/* Processing overlay glow */}
      {isProcessing && (
        <div className="fixed inset-0 pointer-events-none z-30">
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              background: `radial-gradient(ellipse 60% 40% at 50% 50%, rgba(${ACCENT.blue.rgb},0.04), transparent)`,
              animationDuration: "2s",
            }}
          />
        </div>
      )}

      {/* LEFT PANEL: Access Slab */}
      <div className="relative z-10 w-full lg:w-[44%] flex-shrink-0 flex items-center justify-center p-6 lg:p-12">
        <AccessSlab
          mode={mode}
          onInteractionChange={handleInteractionChange}
          onSubmit={onSubmit}
          error={error}
          successMessage={successMessage}
        />
      </div>

      {/* CENTER DIVIDER: Purple accent seam */}
      <div className="hidden lg:flex relative z-10 w-px self-stretch my-16 flex-col items-center">
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: isActive
              ? `linear-gradient(180deg, transparent 5%, rgba(${ACCENT.purple.rgb},0.12) 20%, rgba(${ACCENT.purple.rgb},0.2) 50%, rgba(${ACCENT.purple.rgb},0.12) 80%, transparent 95%)`
              : `linear-gradient(180deg, transparent 10%, rgba(${ACCENT.purple.rgb},0.04) 30%, rgba(${ACCENT.purple.rgb},0.06) 50%, rgba(${ACCENT.purple.rgb},0.04) 70%, transparent 90%)`,
          }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-500 blur-[2px]"
          style={{
            opacity: isActive ? 0.5 : 0,
            background: isComplete
              ? `linear-gradient(180deg, transparent 20%, rgba(${ACCENT.emerald.rgb},0.2) 50%, transparent 80%)`
              : `linear-gradient(180deg, transparent 20%, rgba(${ACCENT.purple.rgb},0.12) 50%, transparent 80%)`,
          }}
        />
      </div>

      {/* RIGHT PANEL: Access Architecture Preview */}
      <div className="hidden lg:flex relative z-10 flex-1 items-center justify-center overflow-hidden">
        <AccessArchitecturePreview
          interactionState={interactionState}
          breathValue={breathValue}
          onHoveredLayerChange={setHoveredLayer}
        />
      </div>

      {/* BOTTOM: Mobile status */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-[rgba(10,12,21,1)] to-transparent">
        <div className="flex items-center justify-center gap-2 text-[9px] font-mono tracking-[0.15em] text-slate-600">
          <div
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-all duration-500",
              isEngaged ? "bg-purple-400/60" : "bg-slate-700"
            )}
            style={{
              boxShadow: isEngaged ? GLOW.low(ACCENT.purple.rgb) : "none",
            }}
          />
          <span className="uppercase">6 System Layers Awaiting Credentials</span>
        </div>
      </div>
    </div>
  )
}
