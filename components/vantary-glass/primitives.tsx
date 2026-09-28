"use client"

/**
 * Vantary Glass — primitives.
 *
 * These are the shared visual atoms behind the "billion-dollar" look used
 * across the Forecast Room and now the rest of the AI dashboard:
 *
 *   GlassCard   — 22px radius, 24px backdrop-blur, accent corner glow,
 *                 inner top highlight, layered shadows.
 *   Eyebrow     — tiny mono-caps section eyebrow with wide tracking.
 *   Caption     — mono caption, dim, used sparingly.
 *   Hairline    — 1px rule (solid or dashed).
 *   StatNumber  — split-magnitude tabular-num, heavy 500 lead + thin 200 tail.
 *   seedFrom    — deterministic id → uint32 seed (used by visual systems
 *                 that need stable randomness per record).
 *
 * Every value is theme-routed through VT (which itself flows from
 * VANTARY CSS custom properties). Switching the global theme switches
 * every consumer with zero refactor.
 */

import type React from "react"
import { motion } from "framer-motion"
import { VT, rgba } from "@/components/forecast-hub/forecast-vantary-tokens"

/* ──────────────────────────────────────────────────────────────────────
   GlassCard — shell.
   22px radius · 24px backdrop blur · accent corner glow · inner top
   highlight · two-stop background gradient · layered shadow.
   ────────────────────────────────────────────────────────────────────── */
export function GlassCard({
  children,
  accentRgb,
  className,
  delay = 0,
  onClick,
  interactive,
  padding = 24,
  radius = 22,
}: {
  children: React.ReactNode
  /** Optional accent — drives the top-right corner glow. */
  accentRgb?: string
  className?: string
  delay?: number
  onClick?: () => void
  interactive?: boolean
  padding?: number
  radius?: number
}) {
  const hasClick = !!onClick
  return (
    <motion.div
      onClick={onClick}
      role={hasClick ? "button" : undefined}
      tabIndex={hasClick ? 0 : undefined}
      onKeyDown={
        hasClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onClick?.()
              }
            }
          : undefined
      }
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: VT.easeOut, delay }}
      whileHover={interactive ? { y: -2 } : undefined}
      className={`relative overflow-hidden text-left w-full ${className ?? ""}`}
      style={{
        borderRadius: radius,
        padding,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.038) 0%, rgba(255,255,255,0.012) 50%, rgba(255,255,255,0.024) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(24px) saturate(150%)",
        WebkitBackdropFilter: "blur(24px) saturate(150%)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 24px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)",
        cursor: interactive ? "pointer" : "default",
      }}
    >
      {/* Top inner highlight — the tiny "wet glass" gleam */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.18) 50%, transparent 95%)",
        }}
      />
      {/* Accent corner glow (optional) */}
      {accentRgb && (
        <div
          className="pointer-events-none absolute"
          style={{
            top: 0,
            right: 0,
            width: 160,
            height: 160,
            background: `radial-gradient(circle at top right, ${rgba(accentRgb, 0.09)}, transparent 65%)`,
          }}
        />
      )}
      <div className="relative">{children}</div>
    </motion.div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Eyebrow — tiny mono-caps section eyebrow.
   ────────────────────────────────────────────────────────────────────── */
export function Eyebrow({
  children,
  color = VT.ashSoft,
  size = 9.5,
}: {
  children: React.ReactNode
  color?: string
  size?: number
}) {
  return (
    <span
      className="font-mono uppercase"
      style={{
        fontSize: size,
        fontWeight: 500,
        letterSpacing: "0.22em",
        color,
        lineHeight: 1,
      }}
    >
      {children}
    </span>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   StatNumber — split-magnitude tabular-num.
   Heavy 500 lead (the digits) + thin 200 tail (the unit / decimals).
   ────────────────────────────────────────────────────────────────────── */
export function StatNumber({
  value,
  size = 22,
  color = VT.paper,
  tailColor,
}: {
  value: string
  size?: number
  color?: string
  tailColor?: string
}) {
  const m = value.match(/^([+\-−]?[\d.,]+)(.*)$/)
  const lead = m ? m[1] : value
  const tail = m ? m[2] : ""
  return (
    <span
      className="font-sans tabular-nums"
      style={{
        fontSize: size,
        fontWeight: 500,
        color,
        letterSpacing: "-0.025em",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {lead}
      {tail && (
        <span
          style={{
            fontWeight: 200,
            color: tailColor ?? rgba("255,255,255", 0.42),
            marginLeft: 1,
            letterSpacing: "-0.01em",
          }}
        >
          {tail}
        </span>
      )}
    </span>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Caption — mono caption, dim, used sparingly.
   ────────────────────────────────────────────────────────────────────── */
export function Caption({
  children,
  color = VT.ashGhost,
  size = 10.5,
}: {
  children: React.ReactNode
  color?: string
  size?: number
}) {
  return (
    <span
      className="font-mono"
      style={{
        fontSize: size,
        fontWeight: 400,
        color,
        letterSpacing: "0.04em",
        lineHeight: 1.3,
      }}
    >
      {children}
    </span>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Hairline — 1px horizontal rule, solid or dashed.
   ────────────────────────────────────────────────────────────────────── */
export function Hairline({ dashed = false }: { dashed?: boolean }) {
  return (
    <div
      className="w-full"
      style={{
        height: 1,
        borderTop: `1px ${dashed ? "dashed" : "solid"} rgba(255,255,255,0.06)`,
      }}
    />
  )
}

/* ──────────────────────────────────────────────────────────────────────
   seedFrom — deterministic uint32 hash from any id string.
   Used so visual systems (sparklines, jitter offsets) stay stable
   across renders for the same record.
   ────────────────────────────────────────────────────────────────────── */
export function seedFrom(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h
}
