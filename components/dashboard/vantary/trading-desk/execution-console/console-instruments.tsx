"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION CONSOLE · INSTRUMENT KIT  (Phase 2)
 *  ─────────────────────────────────────────────────────────────────────────
 *  The premium, accent-aware, reduced-motion-safe instruments the Account &
 *  Risk station is built from. Every instrument here:
 *    · takes an explicit colour (never guesses) so it follows the mode world,
 *    · degrades gracefully under prefers-reduced-motion (no infinite motion),
 *    · uses layered insets + 1px highlights for depth (no cheap glow),
 *    · animates value changes smoothly (springs / tweens, GPU transforms).
 *
 *  These are deliberately scoped to the console (separate from the cartouche
 *  `instruments.tsx`) so the cockpit can evolve its own visual language —
 *  vault numerals, arc risk meters — without disturbing the gadget system.
 * ═══════════════════════════════════════════════════════════════════════ */

import { memo, useEffect, useRef, useState } from "react"
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from "framer-motion"

import { VANTARY } from "../../vantary-theme"

/* ─────────────────────────────────────────────────────────────────────────
 *  VaultNumber — an odometer-style numeral that rolls when its value changes.
 *  The "vault" feel comes from tabular mono numerals + a soft inner shadow
 *  channel behind them. Reduced-motion → instant set, no roll.
 * ──────────────────────────────────────────────────────────────────────── */
export const VaultNumber = memo(function VaultNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  color = VANTARY.paper,
  size = 22,
  weight = 600,
}: {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  color?: string
  size?: number
  weight?: number
}) {
  const reduce = useReducedMotion()
  const mv = useMotionValue(value)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    if (reduce) {
      setDisplay(value)
      mv.set(value)
      return
    }
    const controls = animate(mv, value, {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: v => setDisplay(v),
    })
    return () => controls.stop()
  }, [value, reduce, mv])

  const text =
    prefix +
    display.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) +
    suffix

  return (
    <span
      className="font-mono tabular-nums"
      style={{
        fontSize: size,
        lineHeight: 1,
        color,
        fontWeight: weight,
        letterSpacing: "-0.02em",
        textShadow: "0 1px 0 rgba(0,0,0,0.35)",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {text}
    </span>
  )
})

/* ─────────────────────────────────────────────────────────────────────────
 *  RiskArcGauge — an arc-based risk-budget meter. The arc fills with the
 *  REMAINING budget (a healthy day = a full, calm sweep), and the colour is
 *  supplied by the caller so it can heat toward amber/red as budget drains.
 *  A tick ring + a center vault readout make it read as an instrument, not a
 *  progress bar.
 * ──────────────────────────────────────────────────────────────────────── */
export const RiskArcGauge = memo(function RiskArcGauge({
  /** 0..1 fraction of budget REMAINING (drives the arc length). */
  fraction,
  color,
  trackColor = VANTARY.rule,
  size = 132,
  thickness = 9,
  centerLabel,
  centerSub,
  centerColor = VANTARY.paper,
  breathing = false,
}: {
  fraction: number
  color: string
  trackColor?: string
  size?: number
  thickness?: number
  centerLabel?: string
  centerSub?: string
  centerColor?: string
  breathing?: boolean
}) {
  const reduce = useReducedMotion()
  const clamped = Math.max(0, Math.min(1, fraction))

  // 270° sweep gauge (gap at the bottom), starting bottom-left.
  const START = 135 // deg
  const SWEEP = 270 // deg
  const r = (size - thickness) / 2 - 2
  const cx = size / 2
  const cy = size / 2
  const circ = 2 * Math.PI * r
  const arcLen = (SWEEP / 360) * circ
  const gapLen = circ - arcLen

  // smooth fraction → animated dash
  const fmv = useSpring(useMotionValue(clamped), {
    stiffness: 120,
    damping: 22,
  })
  useEffect(() => { fmv.set(clamped) }, [clamped, fmv])
  const dashOffset = useTransform(fmv, f => arcLen * (1 - f))

  // tick ring (24 ticks across the 270° sweep)
  const ticks = Array.from({ length: 25 }, (_, i) => {
    const a = (START + (SWEEP / 24) * i) * (Math.PI / 180)
    const inner = r - thickness / 2 - 3
    const outer = r - thickness / 2 - (i % 6 === 0 ? 7 : 5)
    return {
      x1: cx + Math.cos(a) * inner,
      y1: cy + Math.sin(a) * inner,
      x2: cx + Math.cos(a) * outer,
      y2: cy + Math.sin(a) * outer,
      major: i % 6 === 0,
    }
  })

  return (
    <motion.div
      style={{ position: "relative", width: size, height: size }}
      animate={
        breathing && !reduce
          ? { scale: [1, 1.012, 1] }
          : { scale: 1 }
      }
      transition={{ duration: 5.5, repeat: breathing && !reduce ? Infinity : 0, ease: "easeInOut" }}
    >
      <svg width={size} height={size} style={{ display: "block", overflow: "visible" }}>
        <defs>
          <linearGradient id="riskArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={0.65} />
            <stop offset="100%" stopColor={color} stopOpacity={1} />
          </linearGradient>
          <filter id="riskArcGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* tick ring */}
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke={t.major ? color : trackColor}
            strokeWidth={t.major ? 1.4 : 1}
            strokeLinecap="round"
            opacity={t.major ? 0.5 : 0.32}
          />
        ))}

        {/* track */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${arcLen} ${gapLen}`}
          transform={`rotate(${START} ${cx} ${cy})`}
          opacity={0.55}
        />

        {/* value arc */}
        <motion.circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="url(#riskArcGrad)"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${arcLen} ${gapLen}`}
          style={{ strokeDashoffset: dashOffset }}
          transform={`rotate(${START} ${cx} ${cy})`}
          filter="url(#riskArcGlow)"
        />
      </svg>

      {/* center readout */}
      <div
        style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 2,
        }}
      >
        {centerLabel != null && (
          <span
            className="font-mono tabular-nums"
            style={{ fontSize: 26, lineHeight: 1, color: centerColor, fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            {centerLabel}
          </span>
        )}
        {centerSub != null && (
          <span
            className="font-mono uppercase"
            style={{ fontSize: 8, letterSpacing: "0.2em", color: VANTARY.ashSoft, marginTop: 2 }}
          >
            {centerSub}
          </span>
        )}
      </div>
    </motion.div>
  )
})

/* ─────────────────────────────────────────────────────────────────────────
 *  HealthDial — a compact semicircular health meter (0..100) with a moving
 *  needle and a soft heat fill. Breathes gently when healthy.
 * ──────────────────────────────────────────────────────────────────────── */
export const HealthDial = memo(function HealthDial({
  score,
  color,
  size = 76,
  breathing = false,
}: {
  score: number
  color: string
  size?: number
  breathing?: boolean
}) {
  const reduce = useReducedMotion()
  const clamped = Math.max(0, Math.min(100, score))
  const w = size
  const h = size * 0.62
  const r = (w - 12) / 2
  const cx = w / 2
  const cy = h - 4
  const start = Math.PI
  const end = 0
  const ang = start + (clamped / 100) * (end - start)

  const polar = (a: number, rad: number) => ({
    x: cx + Math.cos(a) * rad,
    y: cy + Math.sin(a) * rad,
  })
  const trackStart = polar(start, r)
  const trackEnd = polar(end, r)
  const valEnd = polar(ang, r)
  const large = clamped > 50 ? 1 : 0

  const needle = polar(ang, r - 6)

  return (
    <motion.div
      style={{ position: "relative", width: w, height: h + 4 }}
      animate={breathing && !reduce ? { opacity: [0.92, 1, 0.92] } : { opacity: 1 }}
      transition={{ duration: 5, repeat: breathing && !reduce ? Infinity : 0, ease: "easeInOut" }}
    >
      <svg width={w} height={h + 4} style={{ display: "block", overflow: "visible" }}>
        {/* track */}
        <path
          d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 0 1 ${trackEnd.x} ${trackEnd.y}`}
          fill="none"
          stroke={VANTARY.rule}
          strokeWidth={6}
          strokeLinecap="round"
          opacity={0.55}
        />
        {/* value */}
        <motion.path
          d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 ${large} 1 ${valEnd.x} ${valEnd.y}`}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          initial={false}
        />
        {/* needle */}
        <line
          x1={cx} y1={cy} x2={needle.x} y2={needle.y}
          stroke={color} strokeWidth={1.6} strokeLinecap="round"
          opacity={0.9}
        />
        <circle cx={cx} cy={cy} r={2.6} fill={color} />
      </svg>
    </motion.div>
  )
})

/* ─────────────────────────────────────────────────────────────────────────
 *  SegmentMeter — a segmented horizontal budget bar. Filled segments use the
 *  accent; the consumed portion (right) is dimmed. Used for the slim
 *  risk-budget strip and the per-trade ceiling bar.
 * ──────────────────────────────────────────────────────────────────────── */
export const SegmentMeter = memo(function SegmentMeter({
  fraction,
  color,
  segments = 24,
  height = 8,
  gap = 2,
  trackColor = VANTARY.rule,
}: {
  fraction: number
  color: string
  segments?: number
  height?: number
  gap?: number
  trackColor?: string
}) {
  const reduce = useReducedMotion()
  const clamped = Math.max(0, Math.min(1, fraction))
  const lit = Math.round(clamped * segments)
  return (
    <div className="flex items-stretch" style={{ gap, width: "100%" }}>
      {Array.from({ length: segments }, (_, i) => {
        const on = i < lit
        return (
          <motion.span
            key={i}
            aria-hidden
            initial={false}
            animate={{
              backgroundColor: on ? color : trackColor,
              opacity: on ? 1 : 0.4,
            }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 0.3, delay: on ? i * 0.012 : 0 }
            }
            style={{
              flex: 1,
              height,
              borderRadius: 2,
              boxShadow: on ? `0 0 6px ${color}55` : "none",
            }}
          />
        )
      })}
    </div>
  )
})

/* ─────────────────────────────────────────────────────────────────────────
 *  MicroSparkLine — a clean equity spark, reused from the crown but with an
 *  optional gradient underfill for the account cards.
 * ──────────────────────────────────────────────────────────────────────── */
export const MicroSparkLine = memo(function MicroSparkLine({
  series,
  color,
  width = 100,
  height = 26,
  fill = false,
}: {
  series: number[]
  color: string
  width?: number
  height?: number
  fill?: boolean
}) {
  if (series.length < 2) return null
  const stride = width / (series.length - 1)
  const pts = series.map((v, i) => `${(i * stride).toFixed(2)},${((1 - v) * height).toFixed(2)}`)
  const line = pts.join(" ")
  const area = `${line} ${width},${height} 0,${height}`
  const lastY = (1 - series[series.length - 1]) * height
  const gid = `spark-${color.replace(/[^a-z0-9]/gi, "")}`
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      width="100%"
      height={height}
      aria-hidden
      style={{ display: "block", overflow: "visible" }}
    >
      {fill && (
        <>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <polygon points={area} fill={`url(#${gid})`} />
        </>
      )}
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth={1.3}
        vectorEffect="non-scaling-stroke"
        opacity={0.9}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={width} cy={lastY} r={1.8} fill={color} vectorEffect="non-scaling-stroke" />
    </svg>
  )
})

/* ─────────────────────────────────────────────────────────────────────────
 *  Skeleton — a calm shimmer block for loading states.
 * ──────────────────────────────────────────────────────────────────────── */
export const Skeleton = memo(function Skeleton({
  width = "100%",
  height = 12,
  radius = 6,
}: {
  width?: number | string
  height?: number
  radius?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.span
      aria-hidden
      style={{
        display: "block",
        width,
        height,
        borderRadius: radius,
        background: VANTARY.ruleSoft,
        border: `1px solid ${VANTARY.rule}`,
      }}
      animate={reduce ? undefined : { opacity: [0.5, 0.85, 0.5] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
    />
  )
})

/* small util: a thin terminal hairline rule with optional label gap */
export function Hairline({ opacity = 0.6 }: { opacity?: number }) {
  return (
    <span
      aria-hidden
      style={{ display: "block", height: 1, width: "100%", background: VANTARY.rule, opacity }}
    />
  )
}
