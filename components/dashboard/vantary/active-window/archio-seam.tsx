"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  <ArchioSeam/>  ·  the panel's signature divider
 *  ─────────────────────────────────────────────────────────────────────────
 *  In the archio language every "edge" is expressed as a low-alpha
 *  horizontal gradient instead of a hard `border: 1px solid rule`. The
 *  gradient pinches to transparent at both ends so the seam reads as a
 *  pulled thread of light rather than a four-walled box. A 14-second
 *  shimmer pass travels left-to-right across the seam, idle-at-both-ends,
 *  giving the surface a constant low-grade "alive" signal without ever
 *  becoming visual noise.
 *
 *  This component is the single source of truth for every horizontal
 *  divider in the Active Window panel. There are zero ad-hoc hairlines
 *  in the panel — every section change is marked by an <ArchioSeam/>.
 *
 *  ┌────────────────────────────────── seam at rest ────────────────────┐
 *  │ transparent  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ transparent │
 *  │                       (accent @ 22% alpha)                          │
 *  └─────────────────────────────────────────────────────────────────────┘
 *
 *  ┌────────────────────────────── seam mid-shimmer ────────────────────┐
 *  │ transparent ━━━━━━━━━━━━━━╱┃▓▓▓┃╲━━━━━━━━━━━━━━━━━━━━ transparent │
 *  │                          (10%-wide bright pass at 55% alpha)        │
 *  └─────────────────────────────────────────────────────────────────────┘
 *
 *  Reduced-motion: the shimmer pass is omitted entirely; the seam renders
 *  static at base alpha.
 *
 *  Performance note · the shimmer is a single `transform: translateX`
 *  driven by Framer Motion — promoted to the compositor thread, so the
 *  animation runs off the main thread even when the surrounding panel
 *  re-renders. Paint area per frame ≈ seam width × 1px.
 * ═══════════════════════════════════════════════════════════════════════ */

import { motion } from "framer-motion"
import { AW_CADENCE, AW_SEAM, AW_SIZE } from "@/lib/vantary/active-window-tokens"

export interface ArchioSeamProps {
  /** CSS color string — the accent the seam paints (typically VANTARY.amber). */
  accent: string
  /** When true, the 14s traveling shimmer pass is enabled. Default true. */
  shimmer?: boolean
  /** Override the shimmer cycle in seconds. Defaults to AW_CADENCE.seamShimmer. */
  shimmerCycle?: number
  /** Reduced-motion override — when true, shimmer is forced off. */
  reduced?: boolean
  /** Class name applied to the outer wrapper. */
  className?: string
  /** Inline style overrides applied to the outer wrapper. */
  style?: React.CSSProperties
  /** Top/bottom margin shorthand — the seam wraps itself in spacing so
   *  call sites don't need to manage margins for the most common cases. */
  marginY?: number
}

export function ArchioSeam({
  accent,
  shimmer = true,
  shimmerCycle = AW_CADENCE.seamShimmer,
  reduced = false,
  className,
  style,
  marginY,
}: ArchioSeamProps) {
  /* ── Base seam recipe ─────────────────────────────────────────────────
   *  A 1px-tall horizontal gradient that pinches to transparent at both
   *  ends. The accent fills the middle 40% of the seam (30%→70%) — same
   *  pinch ratio as the existing Forecast popup seams so the language is
   *  consistent across pillars. */
  const baseGradient = `linear-gradient(90deg, transparent 0%, ${accent} 30%, ${accent} 70%, transparent 100%)`

  /* ── Shimmer pass recipe ──────────────────────────────────────────────
   *  A narrow brighter gradient that slides across the seam. We render
   *  this as a separate absolutely-positioned <motion.div> sitting on
   *  top of the base gradient, with `mix-blend-mode: screen` so it
   *  composites additively over the base hairline. */
  const shimmerGradient = `linear-gradient(90deg, transparent 0%, ${accent} 50%, transparent 100%)`

  /* The shimmer travels from -100% to +100% of the seam's own width,
   *  so the bright spot starts fully off-screen left and ends fully
   *  off-screen right. The non-linear `times` array gives the pass
   *  long "rest" intervals at each end (≈ 28% of cycle at each end) so
   *  the seam feels like an organic pulse rather than a metronome. */
  const idleFrac = AW_SEAM.shimmerIdleFrac
  const shimmerKeyframes = {
    x: ["-110%", "-110%", "110%", "110%"],
  }
  const shimmerTimes = [0, idleFrac, 1 - idleFrac, 1]

  const showShimmer = shimmer && !reduced

  return (
    <div
      className={className}
      aria-hidden
      style={{
        position: "relative",
        width: "100%",
        height: AW_SIZE.seamHeight,
        overflow: "hidden",
        marginTop: marginY,
        marginBottom: marginY,
        ...style,
      }}
    >
      {/* Base seam — the always-on gradient hairline. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: baseGradient,
          opacity: AW_SEAM.baseAlpha,
        }}
      />
      {/* Shimmer pass — only when allowed by motion preferences. */}
      {showShimmer && (
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: AW_SIZE.seamShimmerWidth,
            backgroundImage: shimmerGradient,
            opacity: AW_SEAM.shimmerAlpha,
            mixBlendMode: "screen",
            willChange: "transform",
          }}
          initial={false}
          animate={shimmerKeyframes}
          transition={{
            duration: shimmerCycle,
            ease: "easeInOut",
            repeat: Infinity,
            times: shimmerTimes,
          }}
        />
      )}
    </div>
  )
}
