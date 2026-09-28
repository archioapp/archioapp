"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  FLIGHT DECK · PHASE 2 MOTION SYSTEM
 *  ───────────────────────────────────────────────────────────────────────────
 *  A small, self-contained set of premium microinteraction primitives shared
 *  across the Flight Deck. Everything here is built on three hard rules:
 *
 *    1. Animate ONLY `transform` and `opacity`. Never animate blur, box-shadow
 *       spread, width/height, or background strings inside a loop.
 *    2. Pointer tracking is driven by framer-motion `MotionValue`s + springs
 *       and written straight to the DOM — it NEVER triggers React re-renders.
 *    3. Everything degrades to a calm static state under
 *       `prefers-reduced-motion`. No loops, no parallax, no ripple.
 *
 *  The primitives:
 *    · <BreathingScope/>    idle "alive" breathing for cards (staggered)
 *    · <MagneticGlass/>     magnetic hover + cursor reflection + border light
 *                           + click ripple, composable on any surface
 *    · useAccentRgb()       resolves the active theme accent triplet ("r,g,b")
 *
 *  These are intentionally decoupled from the 31k-line your-space monolith so
 *  they can be reused anywhere and tested in isolation.
 * ═══════════════════════════════════════════════════════════════════════════ */

import React from "react"
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type MotionStyle,
} from "framer-motion"
import { rgba as vgRgba, useThemeAccent } from "@/components/vantary-glass"

/* Resolve the active theme's primary accent as an "r,g,b" triplet. */
export function useAccentRgb(): string {
  return useThemeAccent().primary.rgb
}

/* ───────────────────────────────────────────────────────────────────────────
 *  <BreathingScope/>
 *  ───────────────────────────────────────────────────────────────────────────
 *  Wraps any subtree in a near-invisible idle breathing loop — the surface
 *  scales between 1 and ~1.004 and its opacity drifts a hair, every 4–6s.
 *  This is the "alive even when the mouse isn't moving" layer.
 *
 *  Stagger: pass a `phase` (0..n) and each instance offsets its loop so the
 *  whole UI never pulses in unison. We translate phase → a negative
 *  animation delay so every card is already mid-cycle at mount (no synchronised
 *  "first beat").
 * ─────────────────────────────────────────────────────────────────────────── */
export function BreathingScope({
  children,
  phase = 0,
  period = 5,
  intensity = 1,
  className,
  style,
}: {
  children: React.ReactNode
  /** Stagger index — each unit offsets the loop so cards breathe out of sync. */
  phase?: number
  /** Loop duration in seconds (4–6 is the luxury range). */
  period?: number
  /** 0..1+ multiplier on the (already tiny) scale/opacity delta. */
  intensity?: number
  className?: string
  style?: React.CSSProperties
}) {
  const reduced = useReducedMotion()
  const scaleHi = 1 + 0.004 * intensity
  // Negative delay so each card starts already in-cycle → no unison "beat".
  const delay = -((phase * 0.9) % period)

  if (reduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      style={{ willChange: "transform", ...style }}
      animate={{ scale: [1, scaleHi, 1] }}
      transition={{
        duration: period,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

/* ───────────────────────────────────────────────────────────────────────────
 *  <MagneticGlass/>
 *  ───────────────────────────────────────────────────────────────────────────
 *  The premium hover envelope. Wrap an important surface (metric card, room
 *  pill, AI capsule, button) and it gains, all at once and all GPU-only:
 *
 *    · MAGNETIC LIFT      the surface translates a few px toward the cursor
 *                         and lifts slightly on hover (spring-damped, max ~5px).
 *    · CURSOR REFLECTION  a soft accent radial follows the pointer across the
 *                         glass, like light moving over a wet surface.
 *    · BORDER LIGHT       on hover-enter, a single accent trace travels once
 *                         around the perimeter (rotating conic gradient masked
 *                         to a 1px ring) — a terminal "scanning the component".
 *    · CLICK RIPPLE       a fast, controlled light ripple blooms from the
 *                         pointer-down point.
 *
 *  All four can be toggled. Reduced-motion disables magnetism, reflection,
 *  ripple and the border sweep — the wrapper becomes an inert passthrough that
 *  still renders its children and a static hover reflection at low opacity.
 * ─────────────────────────────────────────────────────────────────────────── */
export function MagneticGlass({
  children,
  className,
  style,
  radius = 16,
  strength = 5,
  reflection = true,
  borderLight = true,
  ripple = true,
  accentRgb,
  as = "div",
  onClick,
  role,
  tabIndex,
  ariaLabel,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  /** Corner radius used by the reflection mask + border ring (px). */
  radius?: number
  /** Max magnetic offset in px (4–6 is the tasteful range). */
  strength?: number
  reflection?: boolean
  borderLight?: boolean
  ripple?: boolean
  /** Optional accent override ("r,g,b"); defaults to the active theme accent. */
  accentRgb?: string
  as?: "div" | "button"
  onClick?: (e: React.MouseEvent) => void
  role?: string
  tabIndex?: number
  ariaLabel?: string
}) {
  const reduced = useReducedMotion()
  const themeRgb = useAccentRgb()
  const rgb = accentRgb ?? themeRgb
  const hostRef = React.useRef<HTMLDivElement | null>(null)

  /* ── Magnetic translate — motion values + spring; never re-renders React. */
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 150, damping: 18, mass: 0.4 })
  const sy = useSpring(my, { stiffness: 150, damping: 18, mass: 0.4 })

  /* ── Reflection position (0..100 %) written to CSS vars on the host. */
  const setReflectionVars = React.useCallback((px: number, py: number) => {
    const el = hostRef.current
    if (!el) return
    el.style.setProperty("--fdm-rx", `${px}%`)
    el.style.setProperty("--fdm-ry", `${py}%`)
  }, [])

  const [hovered, setHovered] = React.useState(false)
  const [ripples, setRipples] = React.useState<{ id: number; x: number; y: number }[]>([])
  const rippleId = React.useRef(0)
  // Border-sweep is re-keyed on each hover-enter so the one-shot replays.
  const [sweepKey, setSweepKey] = React.useState(0)

  const handleMove = React.useCallback(
    (e: React.MouseEvent) => {
      const el = hostRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const relX = e.clientX - r.left
      const relY = e.clientY - r.top
      // Reflection follows the raw cursor position.
      if (reflection && !reduced) {
        setReflectionVars((relX / r.width) * 100, (relY / r.height) * 100)
      }
      // Magnetism: normalised −0.5..0.5 → ±strength px.
      if (!reduced) {
        mx.set((relX / r.width - 0.5) * strength * 2)
        my.set((relY / r.height - 0.5) * strength * 2)
      }
    },
    [reflection, reduced, strength, mx, my, setReflectionVars],
  )

  const handleEnter = React.useCallback(() => {
    setHovered(true)
    if (!reduced && borderLight) setSweepKey((k) => k + 1)
  }, [reduced, borderLight])

  const handleLeave = React.useCallback(() => {
    setHovered(false)
    mx.set(0)
    my.set(0)
  }, [mx, my])

  const handleDown = React.useCallback(
    (e: React.MouseEvent) => {
      if (reduced || !ripple) return
      const el = hostRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const id = rippleId.current++
      setRipples((prev) => [...prev, { id, x: e.clientX - r.left, y: e.clientY - r.top }])
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((p) => p.id !== id))
      }, 620)
    },
    [reduced, ripple],
  )

  const hostStyle: MotionStyle = {
    position: "relative",
    borderRadius: radius,
    x: reduced ? 0 : sx,
    y: reduced ? 0 : sy,
    willChange: reduced ? undefined : "transform",
    ...(style as MotionStyle),
  }

  const MotionTag: any = as === "button" ? motion.button : motion.div

  return (
    <MotionTag
      ref={hostRef as any}
      className={className}
      style={hostStyle}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      onMouseDown={handleDown}
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
    >
      {/* CURSOR REFLECTION — soft accent radial tracking the pointer. The
          gradient is static; only its CENTER (via CSS vars) and the layer's
          opacity move, so this stays cheap. */}
      {reflection && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: radius,
            pointerEvents: "none",
            background: `radial-gradient(180px circle at var(--fdm-rx,50%) var(--fdm-ry,0%), ${vgRgba(rgb, 0.16)}, transparent 60%)`,
            opacity: reduced ? 0.18 : hovered ? 1 : 0,
            transition: "opacity 320ms ease",
            mixBlendMode: "screen",
            zIndex: 0,
          }}
        />
      )}

      {/* BORDER LIGHT — a single accent trace travels once around the ring on
          hover-enter. A conic-gradient square rotates 360° (GPU transform)
          behind a border-only mask so only the perimeter lights up. */}
      {borderLight && !reduced && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: radius,
            pointerEvents: "none",
            padding: 1,
            // border-only mask: show the 1px frame, punch out the interior
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            overflow: "hidden",
            opacity: hovered ? 1 : 0,
            transition: "opacity 200ms ease",
            zIndex: 2,
          }}
        >
          {hovered && (
            <motion.span
              key={sweepKey}
              aria-hidden
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "220%",
                aspectRatio: "1",
                translateX: "-50%",
                translateY: "-50%",
                background: `conic-gradient(from 0deg, transparent 0deg, transparent 300deg, ${vgRgba(rgb, 0.9)} 350deg, ${vgRgba(rgb, 0)} 360deg)`,
              }}
              initial={{ rotate: 0, opacity: 0 }}
              animate={{ rotate: 360, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </span>
      )}

      {/* CLICK RIPPLES — fast, controlled light bloom from the pointer. */}
      {ripple && !reduced && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: radius,
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 3,
          }}
        >
          {ripples.map((r) => (
            <motion.span
              key={r.id}
              style={{
                position: "absolute",
                left: r.x,
                top: r.y,
                width: 12,
                height: 12,
                marginLeft: -6,
                marginTop: -6,
                borderRadius: 999,
                background: `radial-gradient(circle, ${vgRgba(rgb, 0.5)} 0%, ${vgRgba(rgb, 0)} 70%)`,
                mixBlendMode: "screen",
              }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 16, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </span>
      )}

      {/* Actual content sits above the effect layers. */}
      <span style={{ position: "relative", zIndex: 1, display: "contents" }}>
        {children}
      </span>
    </MotionTag>
  )
}

/* ───────────────────────────────────────────────────────────────────────────
 *  <RollingNumber/>  ·  PHASE 3 — cinematic odometer
 *  ───────────────────────────────────────────────────────────────────────────
 *  Renders a formatted numeric string (e.g. "$12,480", "+$1,247", "74%") where
 *  each DIGIT lives in its own vertical reel. When the `value` string changes,
 *  only the digits that actually changed roll to their new glyph — non-digit
 *  characters ($, +, comma, %, .) are static and never animate.
 *
 *  This is the "the number is alive" effect institutional terminals use. It is
 *  GPU-only (each reel translateY), keyed per character position so React keeps
 *  reels stable across renders. Under reduced-motion it degrades to a plain
 *  static string — zero motion, identical layout.
 *
 *  Direction: when the new digit is greater we roll UP, lesser we roll DOWN, so
 *  rising equity visually climbs and falling equity visually drops.
 * ─────────────────────────────────────────────────────────────────────────── */
const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

function DigitReel({ digit, height }: { digit: string; height: number }) {
  const d = Number(digit)
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        height,
        lineHeight: `${height}px`,
        overflow: "hidden",
        verticalAlign: "top",
      }}
    >
      <motion.span
        style={{ display: "flex", flexDirection: "column" }}
        animate={{ y: -d * height }}
        transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.6 }}
      >
        {DIGITS.map((n) => (
          <span key={n} style={{ height, lineHeight: `${height}px` }}>
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

export function RollingNumber({
  value,
  digitHeight = 40,
  className,
  style,
}: {
  /** The fully-formatted string to display (currency symbols, signs, etc.). */
  value: string
  /** Line height of a single digit reel in px — match the font's line box. */
  digitHeight?: number
  className?: string
  style?: React.CSSProperties
}) {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <span className={className} style={style}>
        {value}
      </span>
    )
  }

  const chars = value.split("")
  return (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "baseline", ...style }}
      aria-label={value}
    >
      {chars.map((ch, i) =>
        /[0-9]/.test(ch) ? (
          <DigitReel key={`d-${i}`} digit={ch} height={digitHeight} />
        ) : (
          <span key={`s-${i}`} aria-hidden style={{ display: "inline-block" }}>
            {ch}
          </span>
        ),
      )}
    </span>
  )
}

/* ───────────────────────────────────────────────────────────────────────────
 *  <PnlHeartbeat/>  ·  PHASE 3 — value-change pulse
 *  ───────────────────────────────────────────────────────────────────────────
 *  Wraps a subtree and emits a single soft accent bloom from behind it whenever
 *  `trigger` changes (e.g. the PnL value updated). The bloom expands + fades
 *  once — a "heartbeat" confirming fresh data landed. Colour resolves from the
 *  active accent or an override (e.g. warn-red on a losing print). GPU-only;
 *  suppressed under reduced-motion.
 * ─────────────────────────────────────────────────────────────────────────── */
export function PnlHeartbeat({
  children,
  trigger,
  accentRgb,
  radius = 12,
  className,
  style,
}: {
  children: React.ReactNode
  /** Any value — when it changes (vs previous render) the bloom fires once. */
  trigger: string | number
  accentRgb?: string
  radius?: number
  className?: string
  style?: React.CSSProperties
}) {
  const reduced = useReducedMotion()
  const themeRgb = useAccentRgb()
  const rgb = accentRgb ?? themeRgb
  const prev = React.useRef(trigger)
  const [beat, setBeat] = React.useState(0)

  React.useEffect(() => {
    if (prev.current !== trigger) {
      prev.current = trigger
      if (!reduced) setBeat((b) => b + 1)
    }
  }, [trigger, reduced])

  return (
    <span className={className} style={{ position: "relative", display: "inline-flex", ...style }}>
      {!reduced && (
        <AnimatePresence>
          {beat > 0 && (
            <motion.span
              key={beat}
              aria-hidden
              style={{
                position: "absolute",
                inset: -8,
                borderRadius: radius,
                background: `radial-gradient(circle, ${vgRgba(rgb, 0.30)} 0%, transparent 68%)`,
                mixBlendMode: "screen",
                pointerEvents: "none",
                zIndex: 0,
              }}
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: [0, 0.9, 0], scale: [0.86, 1.12, 1.22] }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
        </AnimatePresence>
      )}
      <span style={{ position: "relative", zIndex: 1, display: "inline-flex" }}>{children}</span>
    </span>
  )
}
