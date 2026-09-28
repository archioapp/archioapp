"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  <ArchioPulseDot/>  ·  concentric ripple live indicator
 *  ─────────────────────────────────────────────────────────────────────────
 *  Two-layer indicator:
 *    1. Inner solid dot, sized by `size` prop, color `accent`.
 *    2. Outer ring that scales 1→2.4 over the cycle while fading 0.6→0
 *       alpha. The ring sits at the same center as the inner dot, so the
 *       effect reads as a calm sonar ping.
 *
 *  The existing panel had ~15 different inline `<motion.span/>` pulses
 *  with subtly different durations, alphas, and box-shadow blurs. This
 *  component collapses them into one shape with three flavor knobs:
 *    - `cadence` — period of the pulse (defaults to 2.6s "calm aliveness")
 *    - `size`    — core dot diameter in px (defaults to 6px)
 *    - `accent`  — color string (no default — every caller must own this)
 *
 *  Reduced-motion: the ring is omitted entirely; the inner dot renders
 *  as a solid filled circle at full opacity with a 0.6× radial halo so
 *  the "live" signal is preserved without animation.
 *
 *  Visual schematic (cycle progression, left→right):
 *
 *    ●          ●··          ●····          ●······
 *  (start)    (25%)         (50%)            (75%)        (end · fades)
 *
 *  Why scale + opacity instead of just scale?
 *  ──────────────────────────────────────────
 *  A scale-only ripple grows large and stays at full alpha, which reads
 *  as aggressive (think alert). Pairing scale with fade-to-zero gives
 *  the "calm propagation" reading — alive but not demanding. Same
 *  recipe as iOS recording indicators and old Garmin watch icons.
 *
 *  Performance · `transform: scale` + `opacity` are both compositor-bound
 *  in modern browsers. The dot never re-paints; the only work is on the
 *  GPU.
 * ═══════════════════════════════════════════════════════════════════════ */

import { motion } from "framer-motion"
import { AW_CADENCE, AW_OPACITY } from "@/lib/vantary/active-window-tokens"

export interface ArchioPulseDotProps {
  /** Color of the dot + ring (typically VANTARY.amber or VANTARY.paper). */
  accent: string
  /** Diameter of the inner solid dot in px. Default 6. */
  size?: number
  /** Cycle duration in seconds. Defaults to AW_CADENCE.liveDot (2.6). */
  cadence?: number
  /** Disable the ring expansion (used for "dim / dead" variants). */
  ringless?: boolean
  /** Reduced-motion override — when true, the ring is omitted. */
  reduced?: boolean
  /** Inline style override applied to the wrapper. Useful for absolute
   *  positioning the dot inside larger components. */
  style?: React.CSSProperties
  /** Maximum scale the outer ring reaches. Defaults to 2.4. Larger
   *  values read as "bigger heartbeat" — use sparingly. */
  ringMaxScale?: number
}

export function ArchioPulseDot({
  accent,
  size = 6,
  cadence = AW_CADENCE.liveDot,
  ringless = false,
  reduced = false,
  style,
  ringMaxScale = 2.4,
}: ArchioPulseDotProps) {
  /* The wrapper is itself the size of the CORE dot — the ring renders
   *  inside it as an absolutely-positioned <motion.div> that scales
   *  outward from the wrapper's center. Hosting the ring inside a
   *  fixed-size wrapper means the wrapper's bounding box never changes
   *  size during the animation, so the surrounding flexbox layout stays
   *  perfectly stable (no jitter from grow/shrink reflow). */
  const showRing = !ringless && !reduced

  return (
    <span
      aria-hidden
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        flexShrink: 0,
        ...style,
      }}
    >
      {/* Outer ripple ring — scales out + fades to zero. */}
      {showRing && (
        <motion.span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `1px solid ${accent}`,
            willChange: "transform, opacity",
          }}
          initial={{ scale: 1, opacity: AW_OPACITY.rippleAlphaStart }}
          animate={{
            scale: [1, ringMaxScale],
            opacity: [AW_OPACITY.rippleAlphaStart, AW_OPACITY.rippleAlphaEnd],
          }}
          transition={{
            duration: cadence,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 0,
          }}
        />
      )}
      {/* Inner solid dot — always rendered, breathes gently to keep the
       *  live signal even when the ring is omitted (reduced-motion case). */}
      {reduced || ringless ? (
        <span
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: accent,
            boxShadow: `0 0 ${size}px ${accent}`,
          }}
        />
      ) : (
        <motion.span
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: accent,
            boxShadow: `0 0 ${size}px ${accent}`,
            willChange: "opacity",
          }}
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{
            duration: cadence,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      )}
    </span>
  )
}
