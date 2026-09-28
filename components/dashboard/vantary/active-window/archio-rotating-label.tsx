"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  <ArchioRotatingLabel/>  ·  cross-fading content rotator
 *  ─────────────────────────────────────────────────────────────────────────
 *  Generic two-variant rotator used by:
 *    1. The LIVE phase-tab label — alternates between short name
 *       (`LDN-KZ`) and short thesis (`SWEEP → DIRECTION`) every 9s.
 *    2. The WHY/EXPECT body — alternates between tactical and
 *       psychological framings every 14s.
 *
 *  The rotator owns nothing except the timer and the cross-fade
 *  animation. Content is fully controlled — call sites pass the two
 *  variants directly. If `variants` has fewer than 2 entries, the
 *  component renders the single variant statically (no animation, no
 *  timer). This makes it safe to mount everywhere even when rotation
 *  data is missing.
 *
 *  Cross-fade choreography
 *  ───────────────────────
 *  At the cadence boundary:
 *    1. Current variant fades out: opacity 1 → 0 over 320ms.
 *       Simultaneously: translateY 0 → -4px.
 *    2. Next variant fades in: opacity 0 → 1 over 320ms.
 *       Simultaneously: translateY +4px → 0.
 *    3. The two motions overlap by 100% — same total duration, same
 *       easing. The visual result is a smooth "rolling up" of the
 *       old content while the new content rolls in from below.
 *
 *  Why translateY 4px (not 8 or 12)?
 *  ─────────────────────────────────
 *  Larger displacements read as "movement," small displacements read
 *  as "exhale." 4px is the threshold above which the eye registers
 *  motion and below which it registers atmosphere. We want atmosphere.
 *
 *  Reduced motion contract
 *  ───────────────────────
 *  When `reduced === true` the rotator renders ONLY the first variant
 *  and never starts its timer. The component is still mounted (so
 *  parent layout doesn't shift between modes) but it's a static label.
 *
 *  Pause-when-tab-inactive
 *  ───────────────────────
 *  The rotator pauses its setInterval when `document.visibilityState !==
 *  "visible"`. No reason to flip labels for a tab the user isn't
 *  watching — saves wakeups, keeps battery cleaner.
 * ═══════════════════════════════════════════════════════════════════════ */

import { useEffect, useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AW_CADENCE, AW_DUR, AW_EASE } from "@/lib/vantary/active-window-tokens"

export interface ArchioRotatingLabelProps {
  /** Two or more variants to rotate between. Order is the rotation
   *  order. Single-variant arrays render statically. */
  variants: ReactNode[]
  /** Cycle duration per variant in seconds. Defaults to
   *  AW_CADENCE.tabLabelRotation (9s). */
  cadence?: number
  /** Cross-fade duration per swap in seconds. Defaults to
   *  AW_DUR.rotateCrossfade (0.32s). */
  crossfade?: number
  /** Reduced-motion override — when true, only the first variant
   *  renders and no timer is started. */
  reduced?: boolean
  /** Class name applied to the outer wrapper. */
  className?: string
  /** Inline style override applied to the outer wrapper. */
  style?: React.CSSProperties
  /** Stable key prefix for AnimatePresence children — avoids React
   *  warnings when multiple ArchioRotatingLabels mount in the same
   *  subtree. Default `rot`. */
  keyPrefix?: string
}

export function ArchioRotatingLabel({
  variants,
  cadence = AW_CADENCE.tabLabelRotation,
  crossfade = AW_DUR.rotateCrossfade,
  reduced = false,
  className,
  style,
  keyPrefix = "rot",
}: ArchioRotatingLabelProps) {
  const [index, setIndex] = useState(0)

  /* ── Cycle timer ──────────────────────────────────────────────────────
   *  setInterval is fine here — the component has at most one timer
   *  active at a time and we never lose accuracy beyond ±50ms which is
   *  well inside human flicker perception for label swaps. */
  useEffect(() => {
    if (reduced) return
    if (variants.length < 2) return

    let intervalId: ReturnType<typeof setInterval> | null = null
    let visible = typeof document === "undefined" || document.visibilityState === "visible"

    const start = () => {
      if (intervalId) return
      intervalId = setInterval(() => {
        setIndex((i) => (i + 1) % variants.length)
      }, cadence * 1000)
    }
    const stop = () => {
      if (!intervalId) return
      clearInterval(intervalId)
      intervalId = null
    }

    if (visible) start()

    // Pause when the tab goes hidden, resume when it comes back. This
    // is a measurable battery / wakeup win on traders who keep the
    // dashboard in a side window all day.
    const onVisibility = () => {
      visible = document.visibilityState === "visible"
      if (visible) start()
      else stop()
    }
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      stop()
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [cadence, reduced, variants.length])

  /* ── Render branch · static when there's nothing to rotate ───────────
   *  Always render the wrapper so layout is identical across reduced
   *  and full-motion modes. The wrapper itself is `display: inline-block`
   *  so it lays out inline-friendly. */
  if (reduced || variants.length < 2) {
    return (
      <span className={className} style={{ display: "inline-block", ...style }}>
        {variants[0]}
      </span>
    )
  }

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        position: "relative",
        verticalAlign: "baseline",
        ...style,
      }}
    >
      {/* AnimatePresence with mode="popLayout" lets the outgoing variant
       *  exit while the incoming variant enters at the same wrapper
       *  position. Without popLayout, the two would stack vertically
       *  during the swap which breaks the inline rhythm. */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={`${keyPrefix}-${index}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: crossfade, ease: AW_EASE.aw }}
          style={{
            display: "inline-block",
            willChange: "opacity, transform",
          }}
        >
          {variants[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
