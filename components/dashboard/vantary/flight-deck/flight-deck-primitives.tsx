"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  FLIGHT-DECK PRIMITIVES
 *  ─────────────────────────────────────────────────────────────────────────
 *  Shared visual primitives for the Universal Template Engine. These
 *  primitives mirror the ones used by the Oracle answer surface inside
 *  vantary-modules.tsx — by convention, the Oracle render path keeps its
 *  inline copies (so we don't break any existing call sites), and any
 *  template that lives under flight-deck/ imports from THIS file.
 *
 *  The primitives follow the same doctrine described in the product
 *  doctrine document:
 *
 *    - small-caps mono eyebrows, ~9pt, letter-spacing 0.22–0.24em
 *    - sans display titles, ~22pt, letter-spacing -0.018em
 *    - magnitude numerals using lead-bold / tail-light split
 *    - registration corners on every primary panel
 *    - dashed connector rules / solid content separators
 *    - breathing pulse on the live UTC tick (1.6s, opacity 0.45→1)
 *    - shared useUTCSecondClock — no new clocks
 *
 *  Color tokens come exclusively from VANTARY (vantary-theme.ts). No
 *  hardcoded hex values. The user's color picker re-routes the entire
 *  primitive set automatically because VANTARY.amber is theme-driven.
 * ═══════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { motion } from "framer-motion"

import { VANTARY, EASE_V } from "../vantary-theme"
import { useUTCSecondClock } from "../clock-spine"
import { splitMagnitude } from "../jarvis/jarvis-tokens"

/* ────────────────────────────────────────────────────────────────────────
 *  FdCorners — registration L-marks at the four corners of a panel.
 *  ────────────────────────────────────────────────────────────────────── */

export function FdCorners({
  inset = 10,
  size = 9,
  color,
  thickness = 1,
}: {
  inset?: number
  size?: number
  color?: string
  thickness?: number
}) {
  const c = color ?? VANTARY.ashSoft
  const corner = (rotate: number, x: "l" | "r", y: "t" | "b") => (
    <span
      key={`${x}${y}`}
      aria-hidden
      className="absolute pointer-events-none"
      style={{
        left:   x === "l" ? inset : "auto",
        right:  x === "r" ? inset : "auto",
        top:    y === "t" ? inset : "auto",
        bottom: y === "b" ? inset : "auto",
        width:  size,
        height: size,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <span style={{ position: "absolute", left: 0, top: 0, width: size, height: thickness, background: c, opacity: 0.7 }} />
      <span style={{ position: "absolute", left: 0, top: 0, width: thickness, height: size, background: c, opacity: 0.7 }} />
    </span>
  )
  return (
    <>
      {corner(0,   "l", "t")}
      {corner(90,  "r", "t")}
      {corner(270, "l", "b")}
      {corner(180, "r", "b")}
    </>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  FdLiveTick — UTC HH:MM:SS in mono with a breathing primary dot.
 *  ────────────────────────────────────────────────────────────────────── */

export function FdLiveTick({
  label = "UTC",
  showSeconds = true,
  size = 10,
  color,
}: {
  label?: string
  showSeconds?: boolean
  size?: number
  color?: string
}) {
  const sec = useUTCSecondClock()
  const hh = sec.getUTCHours().toString().padStart(2, "0")
  const mm = sec.getUTCMinutes().toString().padStart(2, "0")
  const ss = sec.getUTCSeconds().toString().padStart(2, "0")
  const txt = showSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`
  return (
    <span className="inline-flex items-center gap-1.5">
      <motion.span
        aria-hidden
        className="rounded-full"
        style={{
          width: 5,
          height: 5,
          background: VANTARY.amber,
          boxShadow: `0 0 6px ${VANTARY.amberHalo}`,
        }}
        animate={{ opacity: [0.45, 1, 0.45], scale: [0.92, 1.06, 0.92] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <span
        className="font-mono uppercase tabular-nums"
        style={{
          fontSize: size,
          letterSpacing: "0.16em",
          color: color ?? VANTARY.ashSoft,
          fontWeight: 500,
        }}
      >
        {label} · {txt}
      </span>
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  FdMagnitude — lead-bold / tail-light split numeral. The Vantary
 *  signature for any protagonist number.
 *  ────────────────────────────────────────────────────────────────────── */

export function FdMagnitude({
  value,
  suffix,
  size = 56,
  hover = false,
  tone,
}: {
  value: string
  suffix?: string
  size?: number
  hover?: boolean
  tone?: "ok" | "warn" | "bad"
}) {
  const { lead, tail } = splitMagnitude(value)
  const leadColor =
    tone === "warn" ? VANTARY.amber
    : tone === "bad"  ? VANTARY.chartDown
    : VANTARY.paper
  const shadowOn  = `0 0 12px ${VANTARY.amberHalo}`
  const shadowOff = `0 0 4px ${VANTARY.amberHalo}40`
  return (
    <span className="inline-flex items-baseline gap-1.5 select-none">
      <span
        className="font-sans transition-[text-shadow] duration-500 tabular-nums"
        style={{
          fontSize: size,
          lineHeight: 0.95,
          letterSpacing: "-0.025em",
          fontWeight: 600,
          color: leadColor,
          textShadow: hover ? shadowOn : shadowOff,
        }}
      >
        {lead}
      </span>
      {tail && (
        <span
          className="font-sans tabular-nums"
          style={{
            fontSize: size,
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
            fontWeight: 200,
            color: VANTARY.ash,
          }}
        >
          {tail}
        </span>
      )}
      {suffix && (
        <span
          className="font-sans"
          style={{
            fontSize: Math.max(11, Math.round(size * 0.26)),
            color: VANTARY.ash,
            fontWeight: 400,
            marginLeft: 4,
          }}
        >
          {suffix}
        </span>
      )}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  FdRangeRing — dashed concentric range ring with a progress arc and
 *  centre crosshair. The Ron Design "Passenger Load 87%" motif.
 *  ────────────────────────────────────────────────────────────────────── */

export function FdRangeRing({
  size = 96,
  accent,
  pct = 0.78,
  showCenterMark = true,
  spin = false,
}: {
  size?: number
  accent?: string
  pct?: number
  showCenterMark?: boolean
  spin?: boolean
}) {
  const c = accent ?? VANTARY.amber
  const halo = `${c}30`
  const r1 = size / 2 - 2
  const r2 = size / 2 - 10
  const circ = 2 * Math.PI * r1
  return (
    <span
      aria-hidden
      className="relative inline-block"
      style={{ width: size, height: size }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-90"
        animate={spin ? { rotate: 360 } : undefined}
        transition={spin ? { duration: 28, repeat: Infinity, ease: "linear" } : undefined}
      >
        <circle cx={size / 2} cy={size / 2} r={r1} fill="none" stroke={halo} strokeWidth={1} strokeDasharray="3 5" />
        <circle cx={size / 2} cy={size / 2} r={r2} fill="none" stroke={`${c}18`} strokeWidth={1} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r1}
          fill="none"
          stroke={c}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          style={{ transition: "stroke-dashoffset 800ms cubic-bezier(0.22,1,0.36,1)" }}
        />
      </motion.svg>
      {showCenterMark && (
        <>
          <span aria-hidden className="absolute" style={{ left: "50%", top: "50%", width: 8, height: 1, background: c, transform: "translate(-50%,-50%)", opacity: 0.4 }} />
          <span aria-hidden className="absolute" style={{ left: "50%", top: "50%", width: 1, height: 8, background: c, transform: "translate(-50%,-50%)", opacity: 0.4 }} />
        </>
      )}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  FdPanelHeader — eyebrow + dashed connector + optional hint + live
 *  tick + count. Used at the top of every primary panel in the template.
 *  ────────────────────────────────────────────────────────────────────── */

export function FdPanelHeader({
  eyebrow,
  count,
  hint,
  showLiveTick = true,
  accent,
  trailing,
}: {
  eyebrow: string
  count?: string | number
  hint?: string
  showLiveTick?: boolean
  accent?: string
  /** Optional element rendered to the far right after the live tick. */
  trailing?: React.ReactNode
}) {
  const a = accent ?? VANTARY.amber
  return (
    <div className="flex items-center gap-3 px-5 pt-4 pb-3">
      <span
        className="font-mono uppercase"
        style={{ fontSize: 9, letterSpacing: "0.24em", color: a, fontWeight: 600 }}
      >
        {eyebrow}
      </span>
      <span
        aria-hidden
        className="flex-1 h-px"
        style={{
          background: `repeating-linear-gradient(90deg, ${VANTARY.rule} 0 4px, transparent 4px 8px)`,
        }}
      />
      {hint && (
        <span
          className="font-mono uppercase"
          style={{ fontSize: 8.5, letterSpacing: "0.18em", color: VANTARY.ashSoft, opacity: 0.85 }}
        >
          {hint}
        </span>
      )}
      {showLiveTick && <FdLiveTick label="UTC" showSeconds size={9.5} />}
      {typeof count !== "undefined" && (
        <span
          className="font-mono tabular-nums"
          style={{ fontSize: 9, letterSpacing: "0.16em", color: VANTARY.ashSoft, minWidth: 18, textAlign: "right" }}
        >
          {typeof count === "number" ? String(count).padStart(2, "0") : count}
        </span>
      )}
      {trailing}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  FdDashedRule — connector hairline. Used for header rules, timeline
 *  strips, advisory footers — anywhere a divider plays a connector role.
 *
 *  FdSolidRule — content separator. Used between rows of a true content
 *  matrix (e.g. schedule rows).
 *  ────────────────────────────────────────────────────────────────────── */

export function FdDashedRule({
  color,
  thickness = 1,
  className = "",
  style,
}: {
  color?: string
  thickness?: number
  className?: string
  style?: React.CSSProperties
}) {
  const c = color ?? VANTARY.rule
  return (
    <span
      aria-hidden
      className={`block w-full ${className}`}
      style={{
        height: thickness,
        background: `repeating-linear-gradient(90deg, ${c} 0 4px, transparent 4px 8px)`,
        ...style,
      }}
    />
  )
}

export function FdSolidRule({
  color,
  thickness = 1,
  className = "",
  style,
}: {
  color?: string
  thickness?: number
  className?: string
  style?: React.CSSProperties
}) {
  const c = color ?? VANTARY.rule
  return (
    <span
      aria-hidden
      className={`block w-full ${className}`}
      style={{
        height: thickness,
        background: c,
        ...style,
      }}
    />
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  FdRouteId — small mono route prefix chip. Every list of meaningful
 *  rows / cards / actions in the template system gets one of these so
 *  the cockpit reads as a procedure, not a feed.
 *  ────────────────────────────────────────────────────────────────────── */

export function FdRouteId({
  id,
  tone = "neutral",
  size = 9,
  className = "",
}: {
  id: string
  tone?: "neutral" | "active" | "warn"
  size?: number
  className?: string
}) {
  const color =
    tone === "active" ? VANTARY.amber
    : tone === "warn"   ? VANTARY.warnEdge
    : VANTARY.ashSoft
  return (
    <span
      className={`font-mono uppercase tabular-nums ${className}`}
      style={{
        fontSize: size,
        letterSpacing: "0.20em",
        color,
        fontWeight: 600,
      }}
    >
      {id}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  FdEyebrow — small-caps mono eyebrow. Same scale as FdRouteId but
 *  semantic. Use for section labels.
 *  ────────────────────────────────────────────────────────────────────── */

export function FdEyebrow({
  children,
  tone = "ash",
  className = "",
  size = 9,
}: {
  children: React.ReactNode
  tone?: "ash" | "amber" | "paper"
  className?: string
  size?: number
}) {
  const color =
    tone === "amber" ? VANTARY.amber
    : tone === "paper" ? VANTARY.paper
    : VANTARY.ashSoft
  return (
    <span
      className={`font-mono uppercase ${className}`}
      style={{
        fontSize: size,
        letterSpacing: "0.22em",
        color,
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  FdGlassPanel — the canonical glass surface used by every primary
 *  zone of TemplateShell. Encapsulates the blur/saturate, the rule
 *  border, the radius, and the optional registration corners + corners
 *  inset so individual templates don't repeat this every time.
 *  ────────────────────────────────────────────────────────────────────── */

export function FdGlassPanel({
  children,
  className = "",
  style,
  variant = "glass",
  withCorners = true,
  cornerInset = 10,
  cornerSize = 9,
  initialAnimation = true,
  motionDelay = 0,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  variant?: "glass" | "deep" | "warn" | "amber"
  withCorners?: boolean
  cornerInset?: number
  cornerSize?: number
  initialAnimation?: boolean
  motionDelay?: number
}) {
  const background =
    variant === "deep"  ? VANTARY.glassDeep
    : variant === "warn"  ? VANTARY.warnWash
    : variant === "amber" ? VANTARY.amberWash
    : VANTARY.glass
  const borderColor =
    variant === "warn"  ? VANTARY.warnEdge
    : variant === "amber" ? VANTARY.amberHalo
    : VANTARY.rule

  const Body = (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background,
        border: `1px solid ${borderColor}`,
        borderRadius: 20,
        backdropFilter: "blur(28px) saturate(150%)",
        WebkitBackdropFilter: "blur(28px) saturate(150%)",
        ...style,
      }}
    >
      {withCorners && <FdCorners inset={cornerInset} size={cornerSize} />}
      {children}
    </div>
  )
  if (!initialAnimation) return Body
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE_V, delay: motionDelay }}
      className={`relative overflow-hidden ${className}`}
      style={{
        background,
        border: `1px solid ${borderColor}`,
        borderRadius: 20,
        backdropFilter: "blur(28px) saturate(150%)",
        WebkitBackdropFilter: "blur(28px) saturate(150%)",
        ...style,
      }}
    >
      {withCorners && <FdCorners inset={cornerInset} size={cornerSize} />}
      {children}
    </motion.div>
  )
}
