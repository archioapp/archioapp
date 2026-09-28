"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · FLIGHT DECK · INSTRUMENTS
   ───────────────────────────────────────────────────────────────────────────
   A shared library of premium, accent-aware, reduced-motion-safe SVG
   instruments. These are the visual vocabulary of the whole gadget system:
   the SAME instrument renders in a tiny compact card AND scaled up inside an
   Inspector, so the deck feels like one coherent, instrument-grade cockpit.

   Design contract for EVERY instrument here:
     · Accent-aware     — driven by a ThemeAccent (hex/rgb), never hardcoded.
     · Reduced-motion   — accept `animate?: boolean`; when false, render the
                          resolved end-state with zero motion.
     · Self-scaling     — sized by `w`/`h`/`size` props; crisp at 32px and 320px.
     · Layout-neutral   — draw with SVG + transforms; never push layout around.
     · Depth + light    — gradients, inset highlights, soft accent glow.

   Nothing here owns gadget state. They are pure, declarative visual atoms.
   ═══════════════════════════════════════════════════════════════════════════ */

import React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { VT, rgba } from "@/components/vantary-glass"
import type { ThemeAccent } from "@/components/vantary-glass"

/* ───────────────────────────────────────────────────────────────────────────
   Shared helpers
   ─────────────────────────────────────────────────────────────────────────── */

/** Stable unique id for SVG <defs> so gradients never collide across instances. */
let __instrumentUid = 0
export function useInstrumentId(prefix: string): string {
  return React.useMemo(() => `${prefix}-${(__instrumentUid += 1)}`, [prefix])
}

/** Clamp a number into [min,max]. */
export const clamp = (v: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, v))

/** Map a value in [inMin,inMax] → [outMin,outMax]. */
export const mapRange = (
  v: number, inMin: number, inMax: number, outMin: number, outMax: number,
) => {
  if (inMax === inMin) return outMin
  return outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin)
}

/** Semantic up/down color for a signed number. */
export function signColor(v: number): { hex: string; rgb: string } {
  if (v > 0) return { hex: VT.emerald, rgb: VT.emeraldRgb }
  if (v < 0) return { hex: VT.rose, rgb: VT.roseRgb }
  return { hex: VT.ash, rgb: VT.slate }
}

/** Build an SVG arc path between two angles (degrees, 0 = 3 o'clock, CW). */
export function arcPath(
  cx: number, cy: number, r: number, startDeg: number, endDeg: number,
): string {
  const rad = (d: number) => (d * Math.PI) / 180
  const sx = cx + r * Math.cos(rad(startDeg))
  const sy = cy + r * Math.sin(rad(startDeg))
  const ex = cx + r * Math.cos(rad(endDeg))
  const ey = cy + r * Math.sin(rad(endDeg))
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0
  const sweep = endDeg > startDeg ? 1 : 0
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} ${sweep} ${ex} ${ey}`
}

/** Catmull-Rom → cubic-bezier smoothed path from points. */
export function smoothPath(pts: Array<{ x: number; y: number }>): string {
  if (pts.length === 0) return ""
  if (pts.length === 1) return `M ${pts[0]!.x} ${pts[0]!.y}`
  let d = `M ${pts[0]!.x} ${pts[0]!.y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]!
    const p1 = pts[i]!
    const p2 = pts[i + 1]!
    const p3 = pts[i + 2] ?? p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }
  return d
}

/* ═══════════════════════════════════════════════════════════════════════════
   RADIAL GAUGE — arc gauge with gradient sweep, tick ring, and center label
   ─────────────────────────────────────────────────────────────────────────── */
export function RadialGauge({
  value, min = 0, max = 100, size = 72, thickness = 7,
  accent, label, sublabel, animate = true,
  startDeg = 135, sweepDeg = 270, ticks = 0,
  valueColor, trackColor,
}: {
  value: number
  min?: number
  max?: number
  size?: number
  thickness?: number
  accent: ThemeAccent
  label?: React.ReactNode
  sublabel?: React.ReactNode
  animate?: boolean
  startDeg?: number
  sweepDeg?: number
  ticks?: number
  valueColor?: string
  trackColor?: string
}) {
  const reduced = useReducedMotion()
  const id = useInstrumentId("gauge")
  const doAnim = animate && !reduced

  const cx = size / 2
  const cy = size / 2
  const r = (size - thickness) / 2 - 1
  const pct = clamp((value - min) / (max - min))
  const endDeg = startDeg + sweepDeg * pct

  const circ = (sweepDeg / 360) * 2 * Math.PI * r
  const fullArcLen = (sweepDeg / 360) * 2 * Math.PI * r

  const vColor = valueColor ?? accent.hex

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={`${id}-sweep`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={vColor} stopOpacity={0.65} />
            <stop offset="100%" stopColor={vColor} stopOpacity={1} />
          </linearGradient>
          <filter id={`${id}-glow`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <path
          d={arcPath(cx, cy, r, startDeg, startDeg + sweepDeg)}
          fill="none"
          stroke={trackColor ?? rgba("255,255,255", 0.07)}
          strokeWidth={thickness}
          strokeLinecap="round"
        />

        {/* Tick ring (optional) */}
        {ticks > 0 &&
          Array.from({ length: ticks + 1 }, (_, i) => {
            const a = ((startDeg + (sweepDeg * i) / ticks) * Math.PI) / 180
            const r1 = r - thickness / 2 - 1
            const r2 = r - thickness / 2 - 4
            return (
              <line
                key={i}
                x1={cx + r1 * Math.cos(a)}
                y1={cy + r1 * Math.sin(a)}
                x2={cx + r2 * Math.cos(a)}
                y2={cy + r2 * Math.sin(a)}
                stroke={rgba("255,255,255", 0.14)}
                strokeWidth={1}
              />
            )
          })}

        {/* Value sweep */}
        <motion.path
          d={arcPath(cx, cy, r, startDeg, startDeg + sweepDeg)}
          fill="none"
          stroke={`url(#${id}-sweep)`}
          strokeWidth={thickness}
          strokeLinecap="round"
          filter={`url(#${id}-glow)`}
          strokeDasharray={fullArcLen}
          initial={doAnim ? { strokeDashoffset: fullArcLen } : false}
          animate={{ strokeDashoffset: fullArcLen * (1 - pct) }}
          transition={{ duration: doAnim ? 1.1 : 0, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>

      {(label || sublabel) && (
        <div
          style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            textAlign: "center", lineHeight: 1,
          }}
        >
          {label != null && (
            <div
              className="font-sans tabular-nums"
              style={{
                fontSize: size * 0.26, fontWeight: 600, color: vColor,
                letterSpacing: "-0.02em",
                textShadow: `0 0 12px ${rgba(accent.rgb, 0.4)}`,
              }}
            >
              {label}
            </div>
          )}
          {sublabel != null && (
            <div
              className="font-mono uppercase"
              style={{
                fontSize: size * 0.1, letterSpacing: "0.18em",
                color: VT.ashSoft, marginTop: size * 0.04,
              }}
            >
              {sublabel}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   AREA SPARK — gradient-filled sparkline with glow line + last-point pulse
   ─────────────────────────────────────────────────────────────────────────── */
export function AreaSpark({
  data, w = 120, h = 36, accent, animate = true,
  strokeWidth = 1.6, showDot = true, baseline,
  colorBySign = false, fill = true,
}: {
  data: number[]
  w?: number
  h?: number
  accent: ThemeAccent
  animate?: boolean
  strokeWidth?: number
  showDot?: boolean
  baseline?: number
  colorBySign?: boolean
  fill?: boolean
}) {
  const reduced = useReducedMotion()
  const id = useInstrumentId("spark")
  const doAnim = animate && !reduced

  if (data.length < 2) {
    return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} />
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const pad = 3
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * (w - pad * 2) + pad,
    y: h - pad - mapRange(v, min, max, 0, h - pad * 2),
  }))

  const last = data[data.length - 1]!
  const first = data[0]!
  const trend = last - first
  const lineColor = colorBySign ? signColor(trend).hex : accent.hex
  const lineRgb = colorBySign ? signColor(trend).rgb : accent.rgb

  const line = smoothPath(pts)
  const area = `${line} L ${pts[pts.length - 1]!.x} ${h - pad} L ${pts[0]!.x} ${h - pad} Z`
  const lastPt = pts[pts.length - 1]!

  const baseY =
    baseline != null
      ? h - pad - mapRange(baseline, min, max, 0, h - pad * 2)
      : null

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity={0.28} />
          <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
        </linearGradient>
        <filter id={`${id}-glow`} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {baseY != null && (
        <line
          x1={pad} y1={baseY} x2={w - pad} y2={baseY}
          stroke={rgba("255,255,255", 0.12)} strokeWidth={1}
          strokeDasharray="2 3"
        />
      )}

      {fill && <path d={area} fill={`url(#${id}-fill)`} />}

      <motion.path
        d={line}
        fill="none"
        stroke={lineColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${id}-glow)`}
        initial={doAnim ? { pathLength: 0, opacity: 0 } : false}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: doAnim ? 1.0 : 0, ease: [0.22, 1, 0.36, 1] }}
      />

      {showDot && (
        <>
          {doAnim && (
            <motion.circle
              cx={lastPt.x} cy={lastPt.y} r={3} fill={lineColor}
              initial={{ opacity: 0.5, scale: 1 }}
              animate={{ opacity: [0.5, 0, 0.5], scale: [1, 2.4, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: `${lastPt.x}px ${lastPt.y}px` }}
            />
          )}
          <circle
            cx={lastPt.x} cy={lastPt.y} r={2.2}
            fill={lineColor}
            stroke={VT.ink} strokeWidth={1}
            style={{ filter: `drop-shadow(0 0 4px ${rgba(lineRgb, 0.7)})` }}
          />
        </>
      )}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   BAR COLUMNS — signed P&L columns with a zero baseline
   ─────────────────────────────────────────────────────────────────────────── */
export function BarColumns({
  data, w = 120, h = 40, accent, animate = true, gap = 2, rounded = true,
}: {
  data: number[]
  w?: number
  h?: number
  accent: ThemeAccent
  animate?: boolean
  gap?: number
  rounded?: boolean
}) {
  const reduced = useReducedMotion()
  const doAnim = animate && !reduced
  if (data.length === 0) return <svg width={w} height={h} />

  const absMax = Math.max(...data.map((d) => Math.abs(d)), 1)
  const n = data.length
  const bw = (w - gap * (n - 1)) / n
  const zeroY = h / 2

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <line x1={0} y1={zeroY} x2={w} y2={zeroY} stroke={rgba("255,255,255", 0.1)} strokeWidth={1} />
      {data.map((v, i) => {
        const x = i * (bw + gap)
        const barH = Math.max(1.5, (Math.abs(v) / absMax) * (h / 2 - 2))
        const up = v >= 0
        const c = up ? VT.emerald : VT.rose
        const cr = up ? VT.emeraldRgb : VT.roseRgb
        const y = up ? zeroY - barH : zeroY
        return (
          <motion.rect
            key={i}
            x={x}
            width={bw}
            rx={rounded ? Math.min(bw / 2, 2) : 0}
            fill={c}
            initial={doAnim ? { height: 0, y: zeroY } : false}
            animate={{ height: barH, y }}
            transition={{
              duration: doAnim ? 0.6 : 0,
              delay: doAnim ? i * 0.025 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ filter: `drop-shadow(0 0 3px ${rgba(cr, 0.45)})` }}
          />
        )
      })}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   HEATSTRIP — a row of heat cells (sessions / days / adherence)
   ─────────────────────────────────────────────────────────────────────────── */
export function Heatstrip({
  cells, w = 120, h = 14, gap = 2, accent, animate = true, radius = 2,
}: {
  /** value in [-1,1] (signed) or [0,1] (positive); `null` = empty/neutral */
  cells: Array<number | null>
  w?: number
  h?: number
  gap?: number
  accent: ThemeAccent
  animate?: boolean
  radius?: number
}) {
  const reduced = useReducedMotion()
  const doAnim = animate && !reduced
  const n = cells.length
  if (n === 0) return <svg width={w} height={h} />
  const cw = (w - gap * (n - 1)) / n

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      {cells.map((v, i) => {
        let color = rgba("255,255,255", 0.06)
        if (v != null) {
          if (v > 0) color = rgba(VT.emeraldRgb, clamp(0.25 + Math.abs(v) * 0.7))
          else if (v < 0) color = rgba(VT.roseRgb, clamp(0.25 + Math.abs(v) * 0.7))
          else color = rgba(accent.rgb, 0.35)
        }
        return (
          <motion.rect
            key={i}
            x={i * (cw + gap)} y={0} width={cw} height={h} rx={radius}
            fill={color}
            initial={doAnim ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: doAnim ? 0.4 : 0, delay: doAnim ? i * 0.02 : 0 }}
          />
        )
      })}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   DONUT — proportional ring (allocation / split), with optional center label
   ─────────────────────────────────────────────────────────────────────────── */
export function Donut({
  segments, size = 64, thickness = 9, animate = true, label, sublabel, gapDeg = 3,
}: {
  segments: Array<{ value: number; color: string; rgb?: string; label?: string }>
  size?: number
  thickness?: number
  animate?: boolean
  label?: React.ReactNode
  sublabel?: React.ReactNode
  gapDeg?: number
}) {
  const reduced = useReducedMotion()
  const doAnim = animate && !reduced
  const cx = size / 2
  const cy = size / 2
  const r = (size - thickness) / 2 - 1
  const total = segments.reduce((s, x) => s + x.value, 0) || 1

  let cursor = -90
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={rgba("255,255,255", 0.06)} strokeWidth={thickness} />
        {segments.map((seg, i) => {
          const frac = seg.value / total
          const start = cursor + gapDeg / 2
          const end = cursor + frac * 360 - gapDeg / 2
          cursor += frac * 360
          if (end <= start) return null
          return (
            <motion.path
              key={i}
              d={arcPath(cx, cy, r, start, end)}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeLinecap="round"
              initial={doAnim ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ duration: doAnim ? 0.5 : 0, delay: doAnim ? i * 0.08 : 0 }}
              style={{ filter: seg.rgb ? `drop-shadow(0 0 4px ${rgba(seg.rgb, 0.4)})` : undefined }}
            />
          )
        })}
      </svg>
      {(label || sublabel) && (
        <div
          style={{
            position: "absolute", inset: 0, display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center",
            textAlign: "center", lineHeight: 1.1,
          }}
        >
          {label != null && (
            <div className="font-sans tabular-nums" style={{ fontSize: size * 0.22, fontWeight: 600, color: VT.paper }}>
              {label}
            </div>
          )}
          {sublabel != null && (
            <div className="font-mono uppercase" style={{ fontSize: size * 0.1, letterSpacing: "0.16em", color: VT.ashSoft }}>
              {sublabel}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   VAULT NUMBER — odometer-style rolling number (digit flips on change)
   ─────────────────────────────────────────────────────────────────────────── */
export function VaultNumber({
  value, prefix = "", suffix = "", decimals = 0, size = 22, color,
  weight = 600, animate = true, separator = true,
}: {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  size?: number
  color?: string
  weight?: number
  animate?: boolean
  separator?: boolean
}) {
  const reduced = useReducedMotion()
  const doAnim = animate && !reduced
  const [display, setDisplay] = React.useState(doAnim ? 0 : value)
  const raf = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (!doAnim) { setDisplay(value); return }
    const from = display
    const to = value
    const dur = 900
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = clamp((now - t0) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(from + (to - from) * eased)
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, doAnim])

  const formatted = React.useMemo(() => {
    const fixed = display.toFixed(decimals)
    if (!separator) return fixed
    const [int, dec] = fixed.split(".")
    const withSep = int!.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return dec != null ? `${withSep}.${dec}` : withSep
  }, [display, decimals, separator])

  return (
    <span
      className="font-sans tabular-nums"
      style={{ fontSize: size, fontWeight: weight, color: color ?? VT.paper, letterSpacing: "-0.02em", lineHeight: 1 }}
    >
      {prefix}{formatted}{suffix}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   R-MULTIPLE PIPS — a row of win/loss pips encoding recent R outcomes
   ─────────────────────────────────────────────────────────────────────────── */
export function RMultiplePips({
  results, max = 10, size = 8, gap = 4, animate = true,
}: {
  /** signed R multiples; sign → win/loss, magnitude → intensity */
  results: number[]
  max?: number
  size?: number
  gap?: number
  animate?: boolean
}) {
  const reduced = useReducedMotion()
  const doAnim = animate && !reduced
  const items = results.slice(-max)
  return (
    <div style={{ display: "flex", gap, alignItems: "center" }}>
      {items.map((r, i) => {
        const up = r >= 0
        const c = up ? VT.emerald : VT.rose
        const cr = up ? VT.emeraldRgb : VT.roseRgb
        const intensity = clamp(0.4 + Math.abs(r) / 3, 0.4, 1)
        return (
          <motion.span
            key={i}
            initial={doAnim ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: doAnim ? 0.3 : 0, delay: doAnim ? i * 0.04 : 0, type: "spring", stiffness: 400, damping: 24 }}
            style={{
              width: size, height: size, borderRadius: up ? "50%" : 2,
              background: rgba(cr, intensity),
              boxShadow: `0 0 ${size * 0.7}px ${rgba(cr, intensity * 0.6)}`,
              display: "inline-block",
            }}
            title={`${up ? "+" : ""}${r.toFixed(1)}R`}
          />
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   TREND ARROW — compact signed delta chip with directional caret
   ─────────────────────────────────────────────────────────────────────────── */
export function TrendArrow({
  value, suffix = "", size = 11, showBg = false,
}: {
  value: number
  suffix?: string
  size?: number
  showBg?: boolean
}) {
  const { hex, rgb } = signColor(value)
  const caret = value > 0 ? "▲" : value < 0 ? "▼" : "—"
  return (
    <span
      className="font-mono tabular-nums"
      style={{
        display: "inline-flex", alignItems: "center", gap: 3,
        fontSize: size, color: hex, fontWeight: 600,
        padding: showBg ? "2px 6px" : 0,
        borderRadius: showBg ? 5 : 0,
        background: showBg ? rgba(rgb, 0.1) : "transparent",
        border: showBg ? `1px solid ${rgba(rgb, 0.24)}` : "none",
      }}
    >
      <span style={{ fontSize: size * 0.72 }}>{caret}</span>
      {value > 0 ? "+" : ""}{value.toFixed(1)}{suffix}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   KILLZONE CLOCK — 24h ring with session bands + now-marker
   ─────────────────────────────────────────────────────────────────────────── */
export interface SessionBand {
  startHour: number
  endHour: number
  color: string
  rgb?: string
  label: string
}
export function KillzoneClock({
  size = 88, thickness = 8, sessions, nowHour, accent, animate = true, label, sublabel,
}: {
  size?: number
  thickness?: number
  sessions: SessionBand[]
  /** current hour in [0,24) (can be fractional) */
  nowHour: number
  accent: ThemeAccent
  animate?: boolean
  label?: React.ReactNode
  sublabel?: React.ReactNode
}) {
  const reduced = useReducedMotion()
  const doAnim = animate && !reduced
  const cx = size / 2
  const cy = size / 2
  const r = (size - thickness) / 2 - 1
  const hourToDeg = (hr: number) => -90 + (hr / 24) * 360
  const nowDeg = hourToDeg(nowHour)
  const mx = cx + r * Math.cos((nowDeg * Math.PI) / 180)
  const my = cy + r * Math.sin((nowDeg * Math.PI) / 180)

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={rgba("255,255,255", 0.06)} strokeWidth={thickness} />
        {sessions.map((s, i) => {
          const start = hourToDeg(s.startHour)
          const end = hourToDeg(s.endHour > s.startHour ? s.endHour : s.endHour + 24)
          return (
            <path
              key={i}
              d={arcPath(cx, cy, r, start, end)}
              fill="none" stroke={s.color} strokeWidth={thickness} strokeLinecap="round"
              opacity={0.85}
              style={{ filter: s.rgb ? `drop-shadow(0 0 3px ${rgba(s.rgb, 0.4)})` : undefined }}
            />
          )
        })}
        {/* hour ticks */}
        {Array.from({ length: 24 }, (_, i) => {
          const a = (hourToDeg(i) * Math.PI) / 180
          const major = i % 6 === 0
          const r1 = r - thickness / 2 - 1
          const r2 = r - thickness / 2 - (major ? 5 : 3)
          return (
            <line key={i}
              x1={cx + r1 * Math.cos(a)} y1={cy + r1 * Math.sin(a)}
              x2={cx + r2 * Math.cos(a)} y2={cy + r2 * Math.sin(a)}
              stroke={rgba("255,255,255", major ? 0.22 : 0.1)} strokeWidth={1}
            />
          )
        })}
        {/* now marker */}
        <motion.circle
          cx={mx} cy={my} r={4} fill={accent.hex} stroke={VT.ink} strokeWidth={1.5}
          initial={doAnim ? { scale: 0 } : false}
          animate={{ scale: 1 }}
          transition={{ duration: doAnim ? 0.5 : 0, type: "spring", stiffness: 300, damping: 18 }}
          style={{ filter: `drop-shadow(0 0 6px ${rgba(accent.rgb, 0.8)})` }}
        />
      </svg>
      {(label || sublabel) && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", lineHeight: 1.1 }}>
          {label != null && <div className="font-sans tabular-nums" style={{ fontSize: size * 0.2, fontWeight: 600, color: accent.hex }}>{label}</div>}
          {sublabel != null && <div className="font-mono uppercase" style={{ fontSize: size * 0.095, letterSpacing: "0.16em", color: VT.ashSoft, marginTop: 2 }}>{sublabel}</div>}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   HEARTBEAT — animated ECG-style pulse line (discipline / composure)
   ─────────────────────────────────────────────────────────────────────────── */
export function Heartbeat({
  w = 120, h = 30, accent, bpm = 60, amplitude = 1, animate = true, colorRgb,
}: {
  w?: number
  h?: number
  accent: ThemeAccent
  /** beats per minute → animation speed; higher = more agitated */
  bpm?: number
  /** 0..1.4 → spike height */
  amplitude?: number
  animate?: boolean
  colorRgb?: string
}) {
  const reduced = useReducedMotion()
  const doAnim = animate && !reduced
  const id = useInstrumentId("ecg")
  const mid = h / 2
  const amp = clamp(amplitude, 0, 1.4) * (h / 2 - 3)
  const color = colorRgb ? `rgb(${colorRgb})` : accent.hex
  const rgbStr = colorRgb ?? accent.rgb

  // one ECG cycle, tiled
  const seg = (x0: number) =>
    `L ${x0 + 6} ${mid} L ${x0 + 9} ${mid - amp} L ${x0 + 12} ${mid + amp * 0.6} L ${x0 + 15} ${mid} L ${x0 + 30} ${mid}`
  let d = `M 0 ${mid}`
  for (let x = 0; x < w; x += 30) d += seg(x)

  const dur = clamp(mapRange(bpm, 40, 120, 4, 1.2), 1.2, 4)

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <defs>
        <filter id={`${id}-glow`} x="-10%" y="-50%" width="120%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity={0} />
          <stop offset="12%" stopColor={color} stopOpacity={1} />
          <stop offset="88%" stopColor={color} stopOpacity={1} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke={`url(#${id}-fade)`} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" filter={`url(#${id}-glow)`} opacity={doAnim ? 1 : 0.85} />
      {doAnim && (
        <motion.rect
          x={0} y={0} width={14} height={h}
          fill={rgba(rgbStr, 0.16)}
          initial={{ x: -14 }}
          animate={{ x: w }}
          transition={{ duration: dur, repeat: Infinity, ease: "linear" }}
        />
      )}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   DUAL HEADROOM BAR — used vs max with a danger zone (risk envelope)
   ─────────────────────────────────────────────────────────────────────────── */
export function HeadroomBar({
  used, max, w = 120, h = 8, accent, label, animate = true, warnAt = 0.7, dangerAt = 0.9,
}: {
  used: number
  max: number
  w?: number
  h?: number
  accent: ThemeAccent
  label?: React.ReactNode
  animate?: boolean
  warnAt?: number
  dangerAt?: number
}) {
  const reduced = useReducedMotion()
  const doAnim = animate && !reduced
  const pct = clamp(used / max)
  const color = pct >= dangerAt ? VT.rose : pct >= warnAt ? VT.amber : accent.hex
  const colorRgb = pct >= dangerAt ? VT.roseRgb : pct >= warnAt ? VT.amberRgb : accent.rgb

  return (
    <div style={{ width: w }}>
      <div style={{ position: "relative", width: w, height: h, borderRadius: h, background: rgba("255,255,255", 0.06), overflow: "hidden" }}>
        {/* warn / danger zone ticks */}
        <div style={{ position: "absolute", left: `${warnAt * 100}%`, top: 0, bottom: 0, width: 1, background: rgba(VT.amberRgb, 0.4) }} />
        <div style={{ position: "absolute", left: `${dangerAt * 100}%`, top: 0, bottom: 0, width: 1, background: rgba(VT.roseRgb, 0.5) }} />
        <motion.div
          initial={doAnim ? { width: 0 } : false}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: doAnim ? 0.9 : 0, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: "100%", borderRadius: h, background: color, boxShadow: `0 0 8px ${rgba(colorRgb, 0.6)}` }}
        />
      </div>
      {label != null && (
        <div className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.14em", color: VT.ashSoft, marginTop: 4 }}>
          {label}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAT — a labelled metric block used heavily inside inspectors
   ─────────────────────────────────────────────────────────────────────────── */
export function Stat({
  label, value, sub, color, align = "left", valueSize = 18,
}: {
  label: React.ReactNode
  value: React.ReactNode
  sub?: React.ReactNode
  color?: string
  align?: "left" | "center" | "right"
  valueSize?: number
}) {
  return (
    <div style={{ textAlign: align, minWidth: 0 }}>
      <div className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.16em", color: VT.ashSoft, marginBottom: 4, whiteSpace: "nowrap" }}>
        {label}
      </div>
      <div className="font-sans tabular-nums" style={{ fontSize: valueSize, fontWeight: 600, color: color ?? VT.paper, lineHeight: 1.05, letterSpacing: "-0.01em" }}>
        {value}
      </div>
      {sub != null && (
        <div className="font-sans" style={{ fontSize: 10.5, color: VT.paperDim, marginTop: 2 }}>{sub}</div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROGRESS LADDER — vertical milestone ladder (profit targets, goals)
   ─────────────────────────────────────────────────────────────────────────── */
export function ProgressLadder({
  steps, current, accent, w = 120, animate = true,
}: {
  steps: Array<{ label: string; value: string; reached?: boolean }>
  current: number
  accent: ThemeAccent
  w?: number
  animate?: boolean
}) {
  const reduced = useReducedMotion()
  const doAnim = animate && !reduced
  return (
    <div style={{ width: w, display: "flex", flexDirection: "column", gap: 6 }}>
      {steps.map((s, i) => {
        const reached = s.reached ?? i <= current
        const isCurrent = i === current
        return (
          <motion.div
            key={i}
            initial={doAnim ? { opacity: 0, x: -6 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: doAnim ? 0.4 : 0, delay: doAnim ? i * 0.06 : 0 }}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
              background: reached ? accent.hex : rgba("255,255,255", 0.1),
              border: isCurrent ? `2px solid ${accent.hex}` : "none",
              boxShadow: reached ? `0 0 6px ${rgba(accent.rgb, 0.6)}` : "none",
            }} />
            <span className="font-sans" style={{ fontSize: 11, color: reached ? VT.paper : VT.ashSoft, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {s.label}
            </span>
            <span className="font-mono tabular-nums" style={{ fontSize: 11, color: reached ? accent.hex : VT.ashSoft }}>
              {s.value}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
