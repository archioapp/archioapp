"use client"

/* ═══════════════════════════════════════════════════════════════════════
   SLIDE FRAME — the one layout every slide uses
   ───────────────────────────────────────────────────────────────────────
   eyebrow → headline → one sentence → ONE visual.
   "split"  : words on the left (5/12), visual on the right (7/12)
   "stack"  : words on top, visual full width below
   Nothing else is allowed on a slide. Clarity is the design.
   ═══════════════════════════════════════════════════════════════════════ */

import type React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { type HoloPalette, withAlpha, glow } from "../holographic-kit"

export interface SceneProps {
  pal: HoloPalette
  accent: string
}

const EASE = [0.22, 1, 0.36, 1] as const

export function SlideFrame({
  pal,
  accent,
  eyebrow,
  step,
  headline,
  sub,
  layout,
  children,
}: {
  pal: HoloPalette
  accent: string
  eyebrow: string
  step?: string
  headline: string
  sub: string
  layout: "split" | "stack"
  children: React.ReactNode
}) {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 14, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.6, delay, ease: EASE },
  })

  const words = (
    <div className={layout === "split" ? "flex flex-col gap-5" : "flex flex-col gap-4 max-w-4xl"}>
      <motion.div {...rise(0)} className="flex flex-wrap items-center gap-2.5">
        <motion.span
          className="block w-1.5 h-1.5 rounded-full"
          style={{ background: accent, boxShadow: glow(accent, 0.6) }}
          animate={reduce ? undefined : { opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <span
          className="text-[11px] font-bold uppercase"
          style={{ color: accent, letterSpacing: "0.26em" }}
        >
          {eyebrow}
        </span>
        {step && (
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{ color: pal.text, background: withAlpha(accent, 0.14), border: `1px solid ${withAlpha(accent, 0.45)}` }}
          >
            {step}
          </span>
        )}
      </motion.div>

      <motion.h2
        {...rise(0.08)}
        className="font-black tracking-[-0.03em] text-balance"
        style={{
          color: pal.text,
          fontSize: layout === "split" ? "clamp(2.1rem, 3.6vw, 3.4rem)" : "clamp(2.2rem, 4.2vw, 3.8rem)",
          lineHeight: 1.02,
          textShadow: `0 0 40px ${withAlpha(accent, 0.18)}`,
        }}
      >
        {headline}
      </motion.h2>

      <motion.p
        {...rise(0.16)}
        className="text-pretty leading-relaxed"
        style={{
          color: pal.textDim,
          fontSize: layout === "split" ? "clamp(0.98rem, 1.15vw, 1.15rem)" : "clamp(1rem, 1.2vw, 1.2rem)",
          maxWidth: layout === "split" ? "34ch" : "62ch",
        }}
      >
        {sub}
      </motion.p>
    </div>
  )

  const visual = (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.24, ease: EASE }}
      className="min-w-0 w-full"
    >
      {children}
    </motion.div>
  )

  if (layout === "split") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-5">{words}</div>
        <div className="lg:col-span-7">{visual}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-7">
      {words}
      {visual}
    </div>
  )
}

/* ── Stage: the glass board every visual sits on ─────────────────────── */
export function Stage({
  pal,
  accent,
  children,
  className = "",
  style,
  bare = false,
}: {
  pal: HoloPalette
  accent: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  /** bare = no glass, just the container */
  bare?: boolean
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        borderRadius: 22,
        background: bare ? "transparent" : pal.glass,
        border: bare ? "none" : `1px solid ${pal.glassEdge}`,
        backdropFilter: bare ? undefined : "blur(18px) saturate(140%)",
        WebkitBackdropFilter: bare ? undefined : "blur(18px) saturate(140%)",
        boxShadow: bare ? undefined : `${pal.shadowLg}, inset 0 1px 0 ${pal.glassEdgeHi}`,
        ...style,
      }}
    >
      {!bare && (
        <>
          <span className="absolute inset-x-0 top-0 h-px pointer-events-none" style={{ background: pal.edgeTop }} aria-hidden />
          <span
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-[60%] h-48 pointer-events-none"
            style={{ background: `radial-gradient(ellipse, ${withAlpha(accent, 0.16)}, transparent 70%)`, filter: "blur(20px)" }}
            aria-hidden
          />
        </>
      )}
      {children}
    </div>
  )
}

/* ── Micro label: tiny uppercase tracked caption ─────────────────────── */
export function Micro({
  children,
  color,
  className = "",
}: {
  children: React.ReactNode
  color: string
  className?: string
}) {
  return (
    <span
      className={`text-[9.5px] font-bold uppercase ${className}`}
      style={{ color, letterSpacing: "0.2em" }}
    >
      {children}
    </span>
  )
}

/* ── Pill: small status chip ─────────────────────────────────────────── */
export function Pill({
  children,
  color,
  solid = false,
  className = "",
}: {
  children: React.ReactNode
  color: string
  solid?: boolean
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] ${className}`}
      style={{
        background: solid ? color : withAlpha(color, 0.12),
        color: solid ? "#06100E" : color,
        border: `1px solid ${withAlpha(color, solid ? 0 : 0.35)}`,
        boxShadow: solid ? glow(color, 0.5) : "none",
      }}
    >
      {children}
    </span>
  )
}

/* ── Mono numeral ────────────────────────────────────────────────────── */
export function Num({
  children,
  color,
  size = 22,
  glowColor,
}: {
  children: React.ReactNode
  color: string
  size?: number
  glowColor?: string
}) {
  return (
    <span
      className="font-black tabular-nums"
      style={{
        color,
        fontSize: size,
        fontFamily: "var(--font-mono)",
        letterSpacing: "-0.02em",
        textShadow: glowColor ? `0 0 22px ${withAlpha(glowColor, 0.45)}` : undefined,
      }}
    >
      {children}
    </span>
  )
}

/* ── Deterministic pseudo-random (never Math.random on render) ───────── */
export function seeded(i: number, salt = 1): number {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

export const DECK_EASE = EASE
