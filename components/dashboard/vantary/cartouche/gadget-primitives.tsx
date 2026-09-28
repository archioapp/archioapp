"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · LIVING CARTOUCHE — gadget primitives
   ───────────────────────────────────────────────────────────────────────────
   Reusable visual sub-atoms shared across multiple gadgets.

     · TinySparkline  — inline area+line curve with optional riding dot
     · MicroRing      — circular ring with a value in the centre
     · SegmentBar     — horizontal segmented bar (used by management-pulse LARGEST)
     · ProgressBar    — horizontal fill bar with oscillation
     · MiniBars       — small vertical bar series (daily P&L)
     · RidingDot      — pulsing tip indicator
     · HeartbeatStrip — 3-dot heart-rhythm pulse
     · ScanSweep      — left-to-right accent gradient sweep overlay
     · ConicHalo      — slowly rotating conic-gradient ring overlay
     · DigitRoll      — rolls a single digit when changed

   Every primitive accepts a ThemeAccent and re-tints to match.
   Every periodic effect uses a pairwise-irrational interval.
   ═══════════════════════════════════════════════════════════════════════════ */

import React, { useId, useMemo } from "react"
import { motion } from "framer-motion"
import { rgba as vgRgba, VT as VG_VT, type ThemeAccent } from "@/components/vantary-glass"

/* ────────────────────────────────────────────────────────────────────────
   TinySparkline — inline area + line
   ──────────────────────────────────────────────────────────────────────── */
export function TinySparkline({
  data, width, height = 22, accent, color, showRidingDot = true,
  riderRadius = 2.2, scanSweep = true, sweepDuration = 8.6,
}: {
  data: readonly number[]
  width: number
  height?: number
  accent: ThemeAccent
  /** Optional override line color. */
  color?: string
  showRidingDot?: boolean
  riderRadius?: number
  scanSweep?: boolean
  sweepDuration?: number
}) {
  const safeData = data.length > 0 ? data : [0, 0]
  const min = Math.min(...safeData)
  const max = Math.max(...safeData)
  const span = Math.max(1, max - min)

  const points = safeData.map((v, i) => {
    const x = (i / Math.max(1, safeData.length - 1)) * width
    const y = height - ((v - min) / span) * (height - 2) - 1
    return { x, y }
  })

  const linePath = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ")
  const areaPath =
    `${linePath} L${width},${height} L0,${height} Z`

  const last  = points[points.length - 1]
  const strokeColor = color ?? accent.hex
  const id = useId().replace(/[:]/g, "")

  return (
    <svg width={width} height={height} aria-hidden style={{ display: "block" }}>
      <defs>
        <linearGradient id={`tspk-area-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor={accent.hex} stopOpacity="0.25" />
          <stop offset="100%" stopColor={accent.hex} stopOpacity="0.00" />
        </linearGradient>
        {scanSweep && (
          <linearGradient id={`tspk-sweep-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor={accent.hex} stopOpacity="0" />
            <stop offset="50%"  stopColor={accent.hex} stopOpacity="0.45" />
            <stop offset="100%" stopColor={accent.hex} stopOpacity="0" />
          </linearGradient>
        )}
      </defs>
      <path d={areaPath} fill={`url(#tspk-area-${id})`} />
      <path d={linePath} fill="none" stroke={strokeColor} strokeWidth={1.25} strokeLinejoin="round" />
      {scanSweep && (
        <motion.rect
          x={-width / 3}
          y={0}
          width={width / 3}
          height={height}
          fill={`url(#tspk-sweep-${id})`}
          animate={{ x: [-width / 3, width * 1.1] }}
          transition={{ duration: sweepDuration, repeat: Infinity, ease: "linear" }}
          style={{ mixBlendMode: "screen" }}
        />
      )}
      {showRidingDot && last && (
        <>
          <motion.circle
            cx={last.x} cy={last.y}
            r={riderRadius + 2}
            fill={vgRgba(accent.rgb, 0.25)}
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.15, 0.9] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx={last.x} cy={last.y} r={riderRadius} fill={strokeColor} />
        </>
      )}
    </svg>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   MicroRing — small circular ring with central value
   ──────────────────────────────────────────────────────────────────────── */
export function MicroRing({
  value, max = 100, size = 44, strokeWidth = 3, accent, label, conicHalo = true,
  decimals = 0,
}: {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  accent: ThemeAccent
  /** Optional label inside the ring (overrides value). */
  label?: string
  conicHalo?: boolean
  decimals?: number
}) {
  const radius      = (size - strokeWidth) / 2
  const circ        = 2 * Math.PI * radius
  const pct         = Math.max(0, Math.min(1, value / max))
  const dashOffset  = circ * (1 - pct)
  const id          = useId().replace(/[:]/g, "")

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {conicHalo && (
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, ${vgRgba(accent.rgb, 0.28)} 120deg, transparent 240deg, transparent 360deg)`,
            mask: `radial-gradient(circle, transparent ${radius - 2}px, black ${radius - 2}px, black ${radius + strokeWidth}px, transparent ${radius + strokeWidth + 1}px)`,
            WebkitMask: `radial-gradient(circle, transparent ${radius - 2}px, black ${radius - 2}px, black ${radius + strokeWidth}px, transparent ${radius + strokeWidth + 1}px)`,
            opacity: 0.65,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        />
      )}
      <svg width={size} height={size}>
        <defs>
          <linearGradient id={`mr-stroke-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor={accent.hex} stopOpacity="0.55" />
            <stop offset="100%" stopColor={accent.hex} stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={vgRgba(accent.rgb, 0.14)}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={`url(#mr-stroke-${id})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.2, ease: [0.22, 0.61, 0.36, 1] }}
          style={{ transform: `rotate(-90deg)`, transformOrigin: `${size / 2}px ${size / 2}px` }}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center font-sans tabular-nums"
        style={{
          fontSize: size <= 36 ? 11 : 13,
          color: accent.hex,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          textShadow: `0 0 8px ${vgRgba(accent.rgb, 0.45)}`,
        }}
      >
        {label ?? value.toFixed(decimals)}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   SegmentBar — proportional segmented horizontal bar
   ──────────────────────────────────────────────────────────────────────── */
export function SegmentBar({
  segments, accent, height = 6, highlightIndex,
}: {
  segments: ReadonlyArray<{ id: string; pct: number; label?: string }>
  accent: ThemeAccent
  height?: number
  /** If provided, this segment glows brightest; others dim. */
  highlightIndex?: number
}) {
  return (
    <div
      className="flex items-stretch overflow-hidden"
      style={{
        height,
        borderRadius: height / 2,
        background: vgRgba(accent.rgb, 0.06),
        gap: 1.5,
      }}
    >
      {segments.map((s, i) => {
        const isHL = highlightIndex == null ? true : i === highlightIndex
        return (
          <motion.div
            key={s.id}
            style={{
              flex: `${s.pct} 1 0`,
              background: isHL ? accent.hex : vgRgba(accent.rgb, 0.32),
              boxShadow: isHL ? `0 0 8px ${vgRgba(accent.rgb, 0.55)}` : "none",
            }}
            animate={
              isHL && highlightIndex != null
                ? { opacity: [0.9, 1, 0.9] }
                : undefined
            }
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />
        )
      })}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   ProgressBar — fill % with oscillation
   ──────────────────────────────────────────────────────────────────────── */
export function ProgressBar({
  pct, accent, width = 120, height = 5, oscillate = true, fillColor,
}: {
  pct: number
  accent: ThemeAccent
  width?: number
  height?: number
  oscillate?: boolean
  fillColor?: string
}) {
  const id = useId().replace(/[:]/g, "")
  const fill = fillColor ?? accent.hex
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width,
        height,
        borderRadius: height / 2,
        background: vgRgba(accent.rgb, 0.08),
      }}
    >
      <motion.div
        className="absolute left-0 top-0 bottom-0"
        style={{
          background: `linear-gradient(90deg, ${vgRgba(accent.rgb, 0.5)} 0%, ${fill} 100%)`,
          borderRadius: height / 2,
          boxShadow: `0 0 8px ${vgRgba(accent.rgb, 0.45)}`,
        }}
        initial={{ width: 0 }}
        animate={
          oscillate
            ? { width: [`${Math.max(0, pct - 1)}%`, `${pct}%`, `${Math.max(0, pct - 1)}%`] }
            : { width: `${pct}%` }
        }
        transition={
          oscillate
            ? { duration: 4.2, repeat: Infinity, ease: "easeInOut" }
            : { duration: 1.2, ease: [0.22, 0.61, 0.36, 1] }
        }
      />
      {/* gradient sweep along the filled portion */}
      <motion.div
        aria-hidden
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{
          width: width * 0.3,
          background: `linear-gradient(90deg, transparent 0%, ${vgRgba(accent.rgb, 0.45)} 50%, transparent 100%)`,
          mixBlendMode: "screen",
        }}
        animate={{ x: [-width * 0.3, width * 1.05] }}
        transition={{ duration: 6.7, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   MiniBars — vertical bar series (daily P&L)
   ──────────────────────────────────────────────────────────────────────── */
export function MiniBars({
  data, width, height = 22, accent, positiveColor, negativeColor,
}: {
  data: readonly number[]
  width: number
  height?: number
  accent: ThemeAccent
  positiveColor?: string
  negativeColor?: string
}) {
  const pos = positiveColor ?? "#22d3a3"
  const neg = negativeColor ?? "#ff5c6d"
  const maxAbs = Math.max(1, ...data.map((d) => Math.abs(d)))
  const barWidth = Math.max(2, (width - (data.length - 1) * 2) / data.length)
  return (
    <div
      className="flex items-end"
      style={{ width, height, gap: 2 }}
    >
      {data.map((v, i) => {
        const isPos = v >= 0
        const h = (Math.abs(v) / maxAbs) * height
        const isLast = i === data.length - 1
        return (
          <motion.div
            key={i}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: h, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: i * 0.03,
              ease: [0.22, 0.61, 0.36, 1],
            }}
            style={{
              width: barWidth,
              background: isPos ? pos : neg,
              boxShadow: isLast
                ? `0 0 8px ${isPos ? vgRgba([34, 211, 163], 0.6) : vgRgba([255, 92, 109], 0.6)}`
                : "none",
              borderRadius: 1,
            }}
          />
        )
      })}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   RidingDot — pulsing tip indicator
   ──────────────────────────────────────────────────────────────────────── */
export function RidingDot({
  size = 6, accent, periodSec = 3.4,
}: {
  size?: number
  accent: ThemeAccent
  periodSec?: number
}) {
  return (
    <span
      aria-hidden
      className="relative inline-block"
      style={{ width: size, height: size }}
    >
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ background: vgRgba(accent.rgb, 0.35) }}
        animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: periodSec, repeat: Infinity, ease: "easeInOut" }}
      />
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: accent.hex,
          boxShadow: `0 0 6px ${vgRgba(accent.rgb, 0.7)}`,
          transform: "scale(0.55)",
        }}
      />
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   HeartbeatStrip — 3-dot heart-rhythm pulse
   ──────────────────────────────────────────────────────────────────────── */
export function HeartbeatStrip({ accent }: { accent: ThemeAccent }) {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="rounded-full"
          style={{
            width: 4,
            height: 4,
            background: accent.hex,
            boxShadow: `0 0 4px ${vgRgba(accent.rgb, 0.6)}`,
          }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
          transition={{
            duration: 1.4,
            delay: i * 0.18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   ImpactDot — pulsing severity indicator
   ──────────────────────────────────────────────────────────────────────── */
export function ImpactDot({
  impact, periodSecHigh = 1.2,
}: {
  impact: "high" | "medium" | "low"
  periodSecHigh?: number
}) {
  const color =
    impact === "high"   ? "#ff5c6d" :
    impact === "medium" ? "#f5b86c" :
                          "#22d3a3"
  const period =
    impact === "high"   ? periodSecHigh :
    impact === "medium" ? 2.0 :
                          0  // low = static
  if (period === 0) {
    return (
      <span
        aria-hidden
        className="inline-block rounded-full"
        style={{ width: 6, height: 6, background: color }}
      />
    )
  }
  return (
    <span aria-hidden className="relative inline-block" style={{ width: 6, height: 6 }}>
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ background: color, opacity: 0.3 }}
        animate={{ scale: [1, 1.8, 1], opacity: [0.45, 0, 0.45] }}
        transition={{ duration: period, repeat: Infinity, ease: "easeOut" }}
      />
      <span
        className="absolute inset-0 rounded-full"
        style={{ background: color, boxShadow: `0 0 5px ${color}` }}
      />
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   GaugeArc — semicircular gauge (revenge risk)
   ──────────────────────────────────────────────────────────────────────── */
export function GaugeArc({
  pct, width = 80, height = 38, accent, zoneIndex = 0,
}: {
  /** 0..1 — needle position from left (low risk) to right (high risk). */
  pct: number
  width?: number
  height?: number
  accent: ThemeAccent
  /** 0=green, 1=amber, 2=red — used to tint the active zone. */
  zoneIndex?: number
}) {
  const cx = width / 2
  const cy = height
  const r  = (width - 6) / 2
  /* Sweep from 180° (left) to 0° (right). */
  const angle = 180 - pct * 180
  const rad   = (Math.PI / 180) * angle
  const nx    = cx + r * Math.cos(rad)
  const ny    = cy - r * Math.sin(rad)
  const id    = useId().replace(/[:]/g, "")
  const zoneColor =
    zoneIndex === 2 ? "#ff5c6d" :
    zoneIndex === 1 ? "#f5b86c" :
                      "#22d3a3"

  return (
    <svg width={width} height={height + 2} aria-hidden style={{ display: "block" }}>
      <defs>
        <linearGradient id={`gauge-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"    stopColor="#22d3a3" stopOpacity={zoneIndex === 0 ? 1 : 0.35} />
          <stop offset="50%"   stopColor="#f5b86c" stopOpacity={zoneIndex === 1 ? 1 : 0.35} />
          <stop offset="100%"  stopColor="#ff5c6d" stopOpacity={zoneIndex === 2 ? 1 : 0.35} />
        </linearGradient>
      </defs>
      <path
        d={`M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy}`}
        stroke={`url(#gauge-${id})`}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
      <motion.line
        x1={cx} y1={cy}
        x2={nx} y2={ny}
        stroke={zoneColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
      />
      <circle cx={cx} cy={cy} r={2.5} fill={accent.hex} />
    </svg>
  )
}
