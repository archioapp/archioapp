"use client"

/**
 * ═════════════════════════════════════════════════════════════════════════
 *  VolArc — Flight Deck SVG Instrument · Gadget #1
 * ─────────────────────────────────────────────────────────────────────────
 *  An animated arc gauge with severity-routed glow, configurable scale,
 *  draw-in choreography on a shared EASE_V curve, and full center-readout
 *  composition. Designed to be the headline instrument of:
 *
 *    • forecast-room       ← % of forecasters bullish
 *    • my-fit-analysis     ← style-fit score
 *    • discover-ecosystems ← alignment %
 *    • compare-ecosystems  ← delta gauge
 *    • risk-audit warming  ← pressure / capacity
 *
 *  Built to the spec laid out in v0_plans/strategic-sketch.md §3.1.
 *  Backwards-compatible with the prototype VolArcGauge in MacroAlertSheet.
 * ═════════════════════════════════════════════════════════════════════════
 */

import * as React from "react"
import { motion, useReducedMotion, type Transition } from "framer-motion"

import { EASE_V, VANTARY } from "@/components/dashboard/vantary/vantary-theme"

/* ─────────────────────────────────────────────────────────────────────── */
/*  TONES — single source of truth for the severity color routing          */
/* ─────────────────────────────────────────────────────────────────────── */

export type VolArcTone =
  | "neutral"   // ash · informational, no urgency
  | "info"      // teal · the brand default
  | "positive"  // emerald · gain / on-target
  | "warn"      // amber · elevated, watch
  | "danger"    // red · breach
  | "critical"  // pulsing red · breach + alarm

const TONE_RGB: Record<VolArcTone, string> = {
  neutral:  "123, 136, 148",  // VANTARY.ash
  info:     "45, 212, 191",   // teal
  positive: "16, 185, 129",   // emerald
  warn:     "245, 158, 11",   // amber
  danger:   "239, 68, 68",    // red
  critical: "239, 68, 68",    // red, distinguished by motion
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  PROPS                                                                  */
/* ─────────────────────────────────────────────────────────────────────── */

export interface VolArcProps {
  /** The current value to display, in your scale's units. */
  value: number
  /** Lower bound of the scale. Default 0. */
  min?: number
  /** Upper bound of the scale. Default 4 (matches MacroEventTheater). */
  max?: number
  /** How many tick marks to draw (inclusive). Default 5. */
  ticks?: number
  /** Render a tick label under each tick. Default false. */
  showTickLabels?: boolean
  /** Format a tick label. Default `${n}` */
  formatTick?: (n: number) => string
  /** Format the big center value. Default `${n.toFixed(1)}×`. */
  formatValue?: (n: number) => string
  /** Eyebrow text above the value. Default "EXPECTED VOL". */
  topLabel?: string
  /** Eyebrow text below the value. Optional. */
  bottomLabel?: string
  /** Severity tone — routes the entire color system. Default "info". */
  tone?: VolArcTone
  /** Pixel size of the rendered SVG. Default 240. */
  size?: number
  /** Where on a clock face the arc starts (degrees, 0 = 12 o'clock, 90 = 3). Default 150. */
  startAngle?: number
  /** How many degrees the arc sweeps. Default 240. */
  sweepAngle?: number
  /** External choreography delay in seconds. Sequencer beat 6 = 0.42. Default 0.35. */
  delay?: number
  /** Whether to render the breathing halo pulse layer. Default true (auto-off for reduced-motion). */
  ambient?: boolean
  /** A11y label override. If omitted, a structured label is computed. */
  ariaLabel?: string
  /** Optional className on the wrapper for layout glue. */
  className?: string
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  GEOMETRY HELPERS                                                       */
/* ─────────────────────────────────────────────────────────────────────── */

const VIEW = 160          // viewBox is fixed; size scales via width/height
const CX = 80
const CY = 80
const R_PRIMARY = 64      // primary arc radius
const R_GROUND = 64       // ground ring (dashed) shares the primary radius
const R_MID = 56          // mid ring offset inward
const STROKE_W = 6
const TICK_OUT = 8

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const
}

/** Build an SVG arc path string between two polar angles at radius `r`. */
function arcPath(cx: number, cy: number, r: number, fromDeg: number, toDeg: number) {
  const [sx, sy] = polar(cx, cy, r, fromDeg)
  const [ex, ey] = polar(cx, cy, r, toDeg)
  const sweep = toDeg - fromDeg
  const largeArc = Math.abs(sweep) > 180 ? 1 : 0
  const sweepFlag = sweep >= 0 ? 1 : 0
  return `M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} ${sweepFlag} ${ex} ${ey}`
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  COMPONENT                                                              */
/* ─────────────────────────────────────────────────────────────────────── */

export function VolArc({
  value,
  min = 0,
  max = 4,
  ticks = 5,
  showTickLabels = false,
  formatTick,
  formatValue,
  topLabel = "EXPECTED VOL",
  bottomLabel,
  tone = "info",
  size = 240,
  startAngle = 150,
  sweepAngle = 240,
  delay = 0.35,
  ambient = true,
  ariaLabel,
  className,
}: VolArcProps) {
  const prefersReducedMotion = useReducedMotion()

  /* ---- Math: clamp value, derive percentage of arc to fill ---- */
  const span = Math.max(0.0001, max - min)
  const pct = Math.max(0, Math.min(1, (value - min) / span))
  const endAngle = startAngle + sweepAngle * pct

  /* ---- Geometry: build the four key paths once per render ---- */
  const groundPath = React.useMemo(
    () => arcPath(CX, CY, R_GROUND, startAngle, startAngle + sweepAngle),
    [startAngle, sweepAngle],
  )
  const midPath = React.useMemo(
    () => arcPath(CX, CY, R_MID, startAngle, startAngle + sweepAngle),
    [startAngle, sweepAngle],
  )
  const fillPath = React.useMemo(
    () => arcPath(CX, CY, R_PRIMARY, startAngle, endAngle),
    [startAngle, endAngle],
  )
  /** A second, slightly inflated path used solely for the soft halo glow. */
  const haloPath = React.useMemo(
    () => arcPath(CX, CY, R_PRIMARY + 2, startAngle, endAngle),
    [startAngle, endAngle],
  )

  /* ---- Tip position ---- */
  const [tipX, tipY] = polar(CX, CY, R_PRIMARY, endAngle)

  /* ---- Tone resolution ---- */
  const rgb = TONE_RGB[tone]
  const isCritical = tone === "critical"

  /* ---- Unique IDs so two VolArcs in the same DOM don't collide ---- */
  const uid = React.useId()
  const idGrad = `volarc-grad-${uid}`
  const idGlow = `volarc-glow-${uid}`
  const idHalo = `volarc-halo-${uid}`

  /* ---- A11y ---- */
  const computedLabel =
    ariaLabel ??
    `${topLabel} gauge: ${formatValue ? formatValue(value) : value.toFixed(1)} of ${max} scale, ${tone} level`

  /* ---- Choreography (auto-disabled under reduced-motion) ---- */
  const baseTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 1.1, ease: EASE_V, delay }
  const tipTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: EASE_V, delay: delay + 1.0 }
  const valueTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.5, delay: delay + 0.65, ease: EASE_V }

  /* ---- Tick angles ---- */
  const tickAngles = React.useMemo(() => {
    const out: { angle: number; n: number; active: boolean }[] = []
    for (let i = 0; i < ticks; i++) {
      const t = ticks <= 1 ? 0 : i / (ticks - 1)
      const angle = startAngle + sweepAngle * t
      const n = min + span * t
      const active = pct * sweepAngle >= sweepAngle * t - 0.001
      out.push({ angle, n, active })
    }
    return out
  }, [ticks, startAngle, sweepAngle, min, span, pct])

  return (
    <div
      className={className}
      style={{ position: "relative", width: size, height: size }}
      role="img"
      aria-label={computedLabel}
    >
      <svg viewBox={`0 0 ${VIEW} ${VIEW}`} width={size} height={size}>
        <defs>
          {/* Tone-routed gradient stroke for the primary arc */}
          <linearGradient id={idGrad} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={`rgba(${rgb}, 0.40)`} />
            <stop offset="60%"  stopColor={`rgb(${rgb})`} />
            <stop offset="100%" stopColor={`rgba(${rgb}, 0.92)`} />
          </linearGradient>
          {/* Soft glow filter — subtle */}
          <filter id={idGlow} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.4" result="b1" />
            <feMerge>
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Heavy halo filter — atmospheric */}
          <filter id={idHalo} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* ─── Layer 1: ambient halo (slow breathing) ─── */}
        {ambient && !prefersReducedMotion && (
          <motion.path
            d={haloPath}
            stroke={`rgba(${rgb}, 0.55)`}
            strokeWidth={STROKE_W + 2}
            strokeLinecap="round"
            fill="none"
            filter={`url(#${idHalo})`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: isCritical ? [0.35, 0.85, 0.35] : [0.25, 0.55, 0.25],
            }}
            transition={{
              duration: isCritical ? 2.6 : 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay + 0.5,
            }}
          />
        )}

        {/* ─── Layer 2: dashed ground ring ─── */}
        <path
          d={groundPath}
          stroke={`rgba(${rgb}, 0.10)`}
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="2 4"
        />

        {/* ─── Layer 3: solid mid hairline ─── */}
        <path
          d={midPath}
          stroke={`rgba(${rgb}, 0.06)`}
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />

        {/* ─── Layer 4: tick marks ─── */}
        {tickAngles.map(({ angle, active }, i) => {
          const [x1, y1] = polar(CX, CY, R_PRIMARY, angle)
          const [x2, y2] = polar(CX, CY, R_PRIMARY + TICK_OUT, angle)
          return (
            <line
              key={`tick-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={active ? `rgba(${rgb}, 0.85)` : `rgba(${rgb}, 0.18)`}
              strokeWidth={active ? 1.5 : 1}
              strokeLinecap="round"
            />
          )
        })}

        {/* ─── Layer 5: tick labels (optional) ─── */}
        {showTickLabels &&
          tickAngles.map(({ angle, n }, i) => {
            const [lx, ly] = polar(CX, CY, R_PRIMARY + TICK_OUT + 8, angle)
            return (
              <text
                key={`tlabel-${i}`}
                x={lx}
                y={ly}
                fontSize="6"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                fill={`rgba(${rgb}, 0.55)`}
                textAnchor="middle"
                dominantBaseline="middle"
                letterSpacing="0.08em"
              >
                {formatTick ? formatTick(n) : `${Math.round(n)}`}
              </text>
            )
          })}

        {/* ─── Layer 6: primary fill arc — the headline draw ─── */}
        {pct > 0 && (
          <motion.path
            d={fillPath}
            stroke={`url(#${idGrad})`}
            strokeWidth={STROKE_W}
            strokeLinecap="round"
            fill="none"
            filter={`url(#${idGlow})`}
            initial={{ pathLength: prefersReducedMotion ? 1 : 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={baseTransition}
          />
        )}

        {/* ─── Layer 7: tip dot — pops in after the sweep settles, breathes ─── */}
        {pct > 0 && (
          <motion.circle
            cx={tipX}
            cy={tipY}
            r="4.5"
            fill={`rgb(${rgb})`}
            filter={`url(#${idGlow})`}
            initial={{ opacity: 0, scale: 0 }}
            animate={
              prefersReducedMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: [0.85, 1, 0.85], scale: [1, 1.12, 1] }
            }
            transition={
              prefersReducedMotion
                ? tipTransition
                : { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: delay + 1.0 }
            }
          />
        )}
      </svg>

      {/* ─── Layer 8: center readout ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 8,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: VANTARY.ashSoft,
          }}
        >
          {topLabel}
        </span>
        <motion.span
          initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={valueTransition}
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: Math.round(size * 0.15),
            fontWeight: 250,
            letterSpacing: "-0.04em",
            color: VANTARY.paper,
            textShadow: `0 0 24px rgba(${rgb}, 0.45)`,
            lineHeight: 1.05,
            marginTop: 2,
          }}
        >
          {formatValue ? formatValue(value) : `${value.toFixed(1)}×`}
        </motion.span>
        {bottomLabel ? (
          <span
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 8,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: VANTARY.ashGhost,
              marginTop: 2,
            }}
          >
            {bottomLabel}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export default VolArc
