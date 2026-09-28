"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · LIVING CARTOUCHE — the 10 gadgets
   ───────────────────────────────────────────────────────────────────────────
   Each gadget is a thin wrapper around <LivingGadget/> that declares its
   faces (deeply different presentations of related data) and its motion
   grammar key. The actual rotation, focus halo, face-dot strip, hover-
   pause and reduced-motion gating all live in <LivingGadget/>.

   Per-face content uses the shared primitives in gadget-primitives.tsx.
   Where a face needs gadget-specific anatomy (split-flap clock face,
   3-row mini ledger), the JSX lives inline here.

   Each gadget receives a single `data` prop — a slim per-gadget shape —
   so the cartouche can feed exactly what each one needs without leaking
   the full TraderTelemetry into every face's closure.
   ═══════════════════════════════════════════════════════════════════════════ */

import React, { useEffect, useId, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { LivingGadget, GadgetEyebrow, GadgetBig, GadgetSub } from "./living-gadget"
import {
  TinySparkline, MicroRing, SegmentBar, ProgressBar, MiniBars,
  RidingDot, HeartbeatStrip, ImpactDot, GaugeArc,
} from "./gadget-primitives"
import {
  useCountUp, useRealtimeCountdown, useNumberJitter, useReducedMotion,
} from "@/lib/cartouche/cartouche-hooks"
import { rgba as vgRgba, VT as VG_VT, type ThemeAccent } from "@/components/vantary-glass"
import type { GadgetAlignment, GadgetSize } from "./living-gadget"
import type { RecentTrade, MacroEventToday } from "../../dashboard-data"
/* ARCHIO · HoverFlip wraps gadgets that have a "back face" of denser
 *  stats — Management Pulse exposes ACCOUNT ATLAS on the back, Last 5
 *  Trades exposes WIN MAP. Both flip in place on hover/tap. */
import { HoverFlip } from "./hover-flip"

/* ────────────────────────────────────────────────────────────────────────
   Shared format helpers
   ──────────────────────────────────────────────────────────────────────── */
function fmtUSD(n: number, decimals = 0): string {
  return `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: decimals })}`
}
function fmtSignedUSD(n: number): string {
  return `${n >= 0 ? "+" : "-"}$${Math.abs(n).toLocaleString("en-US")}`
}

const CARTOUCHE_RED   = "#ff5c6d"
const CARTOUCHE_GREEN = "#22d3a3"

/* ════════════════════════════════════════════════════════════════════════
   GADGET A · management-pulse (L, 5 faces, vault-roll, hover-flip)
   ────────────────────────────────────────────────────────────────────────
   The cartouche's flagship gadget — "Here is what you steward, at every
   zoom level". Five cycling faces walk the eye from *NOW* (live ticker)
   out to *FOREVER* (career growth). On hover (or tap on touch), the
   whole card flips to expose the ACCOUNT ATLAS — a denser 2-column grid
   of every account with phase + days-left + spark + today P&L.

   Front-face rotation (5400ms base, pairwise irrational per-face):

     · Face A.1 · LIVE         — totalEquity ticking with ±USD jitter,
                                  60-second heartbeat curve, scanline
                                  pulse across the spine. Mono-caps
                                  "STREAMING · LIVE TICK".
     · Face A.2 · TODAY        — today's signed P&L, hourly bar series
                                  growing in-from-zero, best/worst row.
     · Face A.3 · WEEK         — 5-day net P&L, 5×4 session heatmap
                                  (Mon..Fri × Asia/London/NY1/NY2),
                                  best-day caption.
     · Face A.4 · MONTH        — 30-day curve drawn left→right, peak +
                                  drawdown markers, mono-caps stats line.
     · Face A.5 · ALL TIME     — career equity growth headline, 6-month
                                  segment bar, sharpe + months-trading.

   Back face (HoverFlip): ACCOUNT ATLAS — every account in a 2-col grid,
   each card has equity, signed today P&L, mini sparkline, phase + days.

   Motion grammar is per-face. No two faces share the same entrance —
   the LivingGadget wrapper's `vault-roll` is the connective tissue
   between them; everything INSIDE each face has its own re-mount
   choreography (count-up, bar-grow, row-stagger, curve-draw, segment-
   widen). This is what makes the cell feel alive instead of pumping
   pre-rendered frames.
   ════════════════════════════════════════════════════════════════════════ */

export interface ManagementPulseData {
  totalEquity:        number
  todayPnL:           number
  todayPct:           number
  liveAccounts:       number
  todaySparkline:     readonly number[]
  ledger: ReadonlyArray<{
    id:        string
    short:     string   // e.g. "FTMO 50K"
    fullName:  string
    equity:    number
    dailyPnL:  number
    sparkline: readonly number[]
  }>
  /** The largest account, with its phase context. */
  largest: {
    short:    string
    pctShare: number
    phase:    string
    daysLeft: number
  }
  /** Up to 4 segment shares (percent of total) — for LARGEST face bar. */
  segmentShares: readonly { id: string; pct: number; label: string }[]

  /* ── Optional richer rollups for the new faces. When omitted, the
   *  component synthesises them deterministically from `totalEquity`
   *  and `todaySparkline` using a stable PRNG keyed to the equity. ── */
  /** Week 5×4 session grid · rows are days Mon..Fri, cols Asia/London/NY1/NY2.
   *  Each cell is a signed USD P&L. Synthesized if missing. */
  weekGrid?:         readonly (readonly number[])[]
  /** Month curve · 30-day equity progression. Synthesized if missing. */
  monthCurve?:       readonly number[]
  /** Career segment bar · last 6 months net P&L. Synthesized if missing. */
  monthly?:          readonly number[]
  /** All-time stats. Synthesized if missing. */
  career?: {
    monthsTrading?: number
    totalTrades?:   number
    sharpe?:        number
    growth?:        number   // signed USD since inception
  }
  /** Per-account phase metadata, used by the ACCOUNT ATLAS back face.
   *  When missing, atlas falls back to ledger fields only. */
  accountAtlas?: ReadonlyArray<{
    id:       string
    phase:    string       // e.g. "Phase 2 · Funded"
    daysLeft: number
    target:   number       // profit-target USD
    progress: number       // progress toward target, 0..1
  }>
}

/* ────────────────────────────────────────────────────────────────────────
   Mulberry32 — tiny deterministic PRNG. We seed it from `totalEquity`
   rounded to int so the synthesized week/month look identical across
   renders for the same data. No live randomness — we want the brain to
   parse the cell as a real measurement.
   ──────────────────────────────────────────────────────────────────────── */
function mulberry32(seed: number) {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6D2B79F5) >>> 0
    let x = t
    x = Math.imul(x ^ (x >>> 15), x | 1)
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

/** Synthesize a 5×4 session heatmap centered around `todayPnL` magnitude.
 *  Values are signed USD. Distribution biased toward the sign of the day. */
function synthWeekGrid(seed: number, todayPnL: number): readonly (readonly number[])[] {
  const rand = mulberry32(seed)
  const mag  = Math.max(120, Math.abs(todayPnL) * 0.85)
  const bias = todayPnL >= 0 ? 0.62 : 0.38
  const rows: number[][] = []
  for (let d = 0; d < 5; d++) {
    const cols: number[] = []
    for (let s = 0; s < 4; s++) {
      const isPos = rand() < bias
      const cell  = (isPos ? 1 : -1) * mag * (0.25 + rand() * 0.9)
      cols.push(Math.round(cell))
    }
    rows.push(cols)
  }
  return rows
}

/** Synthesize a 30-day equity curve from totalEquity. Walks DOWN from
 *  current equity using a damped random-walk so the LAST point ends at
 *  `totalEquity` and the START point sits ~`growth` USD below it. */
function synthMonthCurve(seed: number, totalEquity: number, growth: number): readonly number[] {
  const rand = mulberry32(seed + 17)
  const n    = 30
  const out: number[] = new Array(n)
  out[n - 1] = totalEquity
  for (let i = n - 2; i >= 0; i--) {
    const remaining = i / (n - 1)
    const base = totalEquity - growth * (1 - remaining)
    const noise = (rand() - 0.5) * (growth * 0.04)
    out[i] = Math.round(base + noise)
  }
  return out
}

/** Synthesize 6 months of net P&L. Trends toward `growth/6` per month with
 *  ±25% jitter — feels like a real career mosaic instead of a smooth line. */
function synthMonthly(seed: number, growth: number): readonly number[] {
  const rand = mulberry32(seed + 31)
  const per = growth / 6
  return Array.from({ length: 6 }, () => Math.round(per * (0.75 + rand() * 0.75)))
}

/* ────────────────────────────────────────────────────────────────────────
   Sub-atom · ScanlineSpine — 1px accent gradient sweep across the cell.
   Used by the LIVE face to communicate "data is streaming RIGHT NOW".
   Performance: one keyframed transform, no JS-driven RAF.
   ──────────────────────────────────────────────────────────────────────── */
function ScanlineSpine({ accent, height = 1, durationS = 4.6 }: {
  accent: ThemeAccent; height?: number; durationS?: number
}) {
  return (
    <motion.div
      aria-hidden
      className="relative overflow-hidden"
      style={{
        width: "100%",
        height,
        background: vgRgba(accent.rgb, 0.06),
        borderRadius: height,
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "40%", height: "100%",
          background: `linear-gradient(90deg, transparent 0%, ${vgRgba(accent.rgb, 0.92)} 50%, transparent 100%)`,
          boxShadow: `0 0 6px ${vgRgba(accent.rgb, 0.55)}`,
        }}
        animate={{ x: ["-40%", "260%"] }}
        transition={{ duration: durationS, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Sub-atom · HourlyBars — 8 bars growing in-from-zero with row-stagger.
   Sized to fill the available width and a hard pixel height. Each bar's
   width is computed from the container width MINUS gaps, so the cluster
   sits flush against both edges with no orphan space.
   ──────────────────────────────────────────────────────────────────────── */
function HourlyBars({
  data, accent, height = 28, gap = 3,
}: { data: readonly number[]; accent: ThemeAccent; height?: number; gap?: number }) {
  const max = Math.max(1, ...data.map((v) => Math.abs(v)))
  return (
    <div
      className="flex items-end w-full"
      style={{ gap, height }}
      role="img"
      aria-label="Hourly profit and loss bars"
    >
      {data.map((v, i) => {
        const isPos = v >= 0
        const tint = isPos ? CARTOUCHE_GREEN : CARTOUCHE_RED
        const tintRgb = isPos ? "34, 211, 163" : "255, 92, 109"
        const pct = Math.abs(v) / max
        return (
          <motion.div
            key={i}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: `${Math.max(4, pct * height)}px`, opacity: 1 }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 0.61, 0.36, 1] }}
            style={{
              flex: 1,
              minWidth: 0,
              borderRadius: 2,
              background: `linear-gradient(180deg, rgba(${tintRgb}, 0.95) 0%, rgba(${tintRgb}, 0.45) 100%)`,
              boxShadow: `0 0 4px rgba(${tintRgb}, 0.45)`,
            }}
          />
        )
      })}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Sub-atom · SessionHeatmap — 5 rows × 4 cols of signed-PnL cells.
   Each cell tints by sign + magnitude, with a row-stagger fade-in and a
   shimmer on the row with the largest absolute total.
   ──────────────────────────────────────────────────────────────────────── */
function SessionHeatmap({
  grid, accent, alignment, cellH = 11,
}: {
  grid: readonly (readonly number[])[]
  accent: ThemeAccent
  alignment: GadgetAlignment
  cellH?: number
}) {
  /* Find the brightest row to highlight it with a soft shimmer overlay. */
  const rowTotals = grid.map((row) => row.reduce((s, v) => s + Math.abs(v), 0))
  const maxRow    = rowTotals.indexOf(Math.max(...rowTotals))
  const max       = Math.max(1, ...grid.flatMap((r) => r.map((v) => Math.abs(v))))
  const dayLabels = ["MON", "TUE", "WED", "THU", "FRI"]
  const sessionLabels = ["A", "L", "N", "N"]

  return (
    <div className="w-full" style={{ display: "grid", gap: 4 }}>
      {/* Column header strip — single tight row of session letters. */}
      <div
        className="grid font-mono uppercase"
        style={{
          gridTemplateColumns: `28px repeat(4, 1fr)`,
          fontSize: 8, letterSpacing: "0.18em", color: VG_VT.ashSoft, gap: 3,
        }}
      >
        <div />
        {sessionLabels.map((l, i) => (
          <div key={i} style={{ textAlign: "center" }}>{l}</div>
        ))}
      </div>

      {grid.map((row, r) => (
        <motion.div
          key={r}
          initial={{ opacity: 0, x: alignment === "left" ? 6 : -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.32, delay: r * 0.04, ease: [0.22, 0.61, 0.36, 1] }}
          className="grid relative"
          style={{
            gridTemplateColumns: `28px repeat(4, 1fr)`,
            gap: 3,
            alignItems: "center",
          }}
        >
          <div
            className="font-mono uppercase"
            style={{
              fontSize: 8.5, letterSpacing: "0.16em",
              color: r === maxRow ? accent.hex : VG_VT.ashSoft,
              textAlign: alignment === "left" ? "right" : "left",
            }}
          >
            {dayLabels[r]}
          </div>
          {row.map((v, c) => {
            const isPos = v >= 0
            const tintRgb = isPos ? "34, 211, 163" : "255, 92, 109"
            const intensity = Math.abs(v) / max
            return (
              <div
                key={c}
                title={`${dayLabels[r]} · ${sessionLabels[c]} · ${fmtSignedUSD(v)}`}
                style={{
                  height: cellH,
                  borderRadius: 2,
                  background: `rgba(${tintRgb}, ${0.18 + intensity * 0.55})`,
                  boxShadow: r === maxRow
                    ? `inset 0 0 0 1px rgba(${tintRgb}, ${0.35 + intensity * 0.4})`
                    : "none",
                }}
              />
            )
          })}
          {r === maxRow && (
            <motion.div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: 3,
                background: `linear-gradient(90deg, transparent 0%, ${vgRgba(accent.rgb, 0.18)} 50%, transparent 100%)`,
                mixBlendMode: "screen",
              }}
              animate={{ x: [-40, 40] }}
              transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Sub-atom · CurveCanvas — full-width 30-day equity curve. Draws on
   mount with stroke-dasharray animation, then a pulse at the last point
   and a drawdown marker at the curve's local minimum.
   ──────────────────────────────────────────────────────────────────────── */
function CurveCanvas({
  data, accent, width = 220, height = 38,
}: { data: readonly number[]; accent: ThemeAccent; width?: number; height?: number }) {
  const id = useId().replace(/[:]/g, "")
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = Math.max(1, max - min)
  const points = data.map((v, i) => ({
    x: (i / Math.max(1, data.length - 1)) * width,
    y: height - ((v - min) / span) * (height - 4) - 2,
  }))
  const linePath = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ")
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`
  /* Find the curve's local minimum INDEX to anchor a drawdown marker. */
  const minIdx = data.indexOf(min)
  const peakIdx = data.indexOf(max)
  const last = points[points.length - 1]
  const minPt = points[minIdx]
  const peakPt = points[peakIdx]

  return (
    <svg width={width} height={height} aria-hidden style={{ display: "block", width: "100%" }} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`cc-area-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={accent.hex} stopOpacity="0.28" />
          <stop offset="100%" stopColor={accent.hex} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#cc-area-${id})`} opacity={0.85} />
      <motion.path
        d={linePath}
        fill="none"
        stroke={accent.hex}
        strokeWidth={1.4}
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0.4 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 0.61, 0.36, 1] }}
      />
      {/* Peak marker · accent ring */}
      {peakPt && (
        <motion.circle
          cx={peakPt.x} cy={peakPt.y} r={2.4}
          fill="none" stroke={accent.hex} strokeWidth={1}
          initial={{ opacity: 0, r: 0 }}
          animate={{ opacity: 0.75, r: 2.4 }}
          transition={{ delay: 1.0, duration: 0.4 }}
        />
      )}
      {/* Drawdown marker · red ring at curve min */}
      {minPt && minIdx !== peakIdx && (
        <motion.circle
          cx={minPt.x} cy={minPt.y} r={2.2}
          fill="none" stroke={CARTOUCHE_RED} strokeWidth={1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.1, duration: 0.4 }}
        />
      )}
      {/* Riding tip · pulsing dot at the latest value */}
      {last && (
        <>
          <motion.circle
            cx={last.x} cy={last.y} r={4}
            fill={vgRgba(accent.rgb, 0.28)}
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.2, 0.9] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx={last.x} cy={last.y} r={2.2} fill={accent.hex} />
        </>
      )}
    </svg>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Sub-atom · CareerStrip — 6-month segment ribbon. Each segment widens
   from 0 → final width with a row-stagger, tinted by sign of that month.
   ──────────────────────────────────────────────────────────────────────── */
function CareerStrip({
  monthly, accent, height = 16,
}: { monthly: readonly number[]; accent: ThemeAccent; height?: number }) {
  const max = Math.max(1, ...monthly.map((v) => Math.abs(v)))
  const labels = ["−5", "−4", "−3", "−2", "−1", "NOW"]
  return (
    <div className="w-full" style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div className="flex w-full" style={{ gap: 4, height }}>
        {monthly.map((v, i) => {
          const isPos = v >= 0
          const tintRgb = isPos ? "34, 211, 163" : "255, 92, 109"
          const intensity = Math.abs(v) / max
          return (
            <motion.div
              key={i}
              initial={{ flex: 0, opacity: 0 }}
              animate={{ flex: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 0.61, 0.36, 1] }}
              style={{
                minWidth: 0,
                borderRadius: 3,
                background: `linear-gradient(180deg, rgba(${tintRgb}, ${0.35 + intensity * 0.5}) 0%, rgba(${tintRgb}, ${0.18 + intensity * 0.3}) 100%)`,
                boxShadow: i === monthly.length - 1
                  ? `inset 0 0 0 1px ${vgRgba(accent.rgb, 0.5)}, 0 0 8px ${vgRgba(accent.rgb, 0.35)}`
                  : "none",
              }}
              title={`Month ${labels[i]} · ${fmtSignedUSD(v)}`}
            />
          )
        })}
      </div>
      <div className="flex w-full font-mono uppercase tabular-nums" style={{ gap: 4, fontSize: 7.5, letterSpacing: "0.16em", color: VG_VT.ashSoft }}>
        {labels.map((l, i) => (
          <div key={i} style={{ flex: 1, minWidth: 0, textAlign: "center" }}>{l}</div>
        ))}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Account Atlas — the HoverFlip back face. 2-column grid (1 col on
   narrow wings) of every account. Each card shows equity, today P&L,
   mini sparkline, phase, and days-left, with a soft accent ring.
   ──────────────────────────────────────────────────────────────────────── */
function AccountAtlas({
  ledger, atlas, accent, alignment,
}: {
  ledger: ManagementPulseData["ledger"]
  atlas?:  ManagementPulseData["accountAtlas"]
  accent:  ThemeAccent
  alignment: GadgetAlignment
}) {
  const cells = useMemo(() => {
    return ledger.map((row) => {
      const meta = atlas?.find((a) => a.id === row.id)
      return { ...row, meta }
    })
  }, [ledger, atlas])

  return (
    <div className="w-full" style={{ padding: "8px 10px" }}>
      <div className="flex items-baseline justify-between" style={{
        flexDirection: alignment === "left" ? "row-reverse" : "row",
        marginBottom: 6,
      }}>
        <GadgetEyebrow alignment={alignment} accent={accent}>
          Account Atlas
        </GadgetEyebrow>
        <span className="font-mono uppercase tabular-nums" style={{
          fontSize: 8.5, letterSpacing: "0.22em",
          color: vgRgba(accent.rgb, 0.7),
        }}>
          {ledger.length} accounts
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {cells.map((row, i) => {
          const rowPos = row.dailyPnL >= 0
          const rowTint = rowPos ? CARTOUCHE_GREEN : CARTOUCHE_RED
          const rowTintRgb = rowPos ? "34, 211, 163" : "255, 92, 109"
          const progress = row.meta?.progress ?? 0.55
          return (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: i * 0.05, ease: [0.22, 0.61, 0.36, 1] }}
              style={{
                padding: "5px 7px",
                borderRadius: 6,
                background: `linear-gradient(180deg, ${vgRgba(accent.rgb, 0.07)} 0%, ${vgRgba(accent.rgb, 0.02)} 100%)`,
                border: `1px solid ${vgRgba(accent.rgb, 0.18)}`,
                minHeight: 44,
              }}
            >
              <div className="flex items-baseline justify-between" style={{ gap: 4 }}>
                <span className="font-sans" style={{
                  fontSize: 10, color: VG_VT.paper, fontWeight: 500,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {row.short}
                </span>
                <span className="font-mono tabular-nums" style={{
                  fontSize: 9, color: rowTint,
                }}>
                  {rowPos ? "▲" : "▼"}{fmtSignedUSD(row.dailyPnL)}
                </span>
              </div>
              <div className="flex items-center justify-between" style={{ gap: 6, marginTop: 2 }}>
                <span className="font-mono tabular-nums" style={{
                  fontSize: 9.5, color: VG_VT.paperDim,
                }}>
                  ${row.equity.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </span>
                <TinySparkline data={row.sparkline} width={36} height={10} accent={accent} riderRadius={1.5} scanSweep={false} />
              </div>
              {row.meta && (
                <>
                  <div className="font-mono uppercase tabular-nums" style={{
                    fontSize: 8, letterSpacing: "0.14em", color: VG_VT.ashSoft,
                    marginTop: 3,
                  }}>
                    {row.meta.phase} · {row.meta.daysLeft}D
                  </div>
                  <div style={{
                    height: 2, marginTop: 2, borderRadius: 1,
                    background: vgRgba(accent.rgb, 0.10), overflow: "hidden",
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(2, Math.min(100, progress * 100))}%` }}
                      transition={{ duration: 0.7, delay: 0.2 + i * 0.05, ease: [0.22, 0.61, 0.36, 1] }}
                      style={{
                        height: "100%",
                        background: `linear-gradient(90deg, ${vgRgba(accent.rgb, 0.6)} 0%, ${accent.hex} 100%)`,
                        boxShadow: `0 0 4px ${vgRgba(accent.rgb, 0.45)}`,
                      }}
                    />
                  </div>
                </>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   ManagementPulseGadget — the assembled flagship. Wraps the rotation in
   HoverFlip so the whole cell flips on hover (or tap) to expose Account
   Atlas. The 5 faces own the front; rotation pauses while the card is
   flipped (LivingGadget reads its own hover state).
   ──────────────────────────────────────────────────────────────────────── */
export function ManagementPulseGadget(props: {
  data: ManagementPulseData
  alignment: GadgetAlignment
  accent: ThemeAccent
  priority?: boolean
  priorityLabel?: string
}) {
  const { data, alignment, accent, priority, priorityLabel } = props
  const equityCount   = useCountUp(data.totalEquity, { durationMs: 1400 })
  const flickerEquity = useNumberJitter(Math.round(equityCount), { range: 3, intervalMs: 2600 })

  const isPos = data.todayPnL >= 0
  const tint  = isPos ? CARTOUCHE_GREEN : CARTOUCHE_RED

  /* Live tick clock — increments every 2.4s for the LIVE face mono-caps line.
     Hydration-safe: starts as null on the server and the first client paint. */
  const [tick, setTick] = useState<string | null>(null)
  useEffect(() => {
    const fmt = () => {
      const d = new Date()
      const hh = String(d.getHours()).padStart(2, "0")
      const mm = String(d.getMinutes()).padStart(2, "0")
      const ss = String(d.getSeconds()).padStart(2, "0")
      setTick(`${hh}:${mm}:${ss}`)
    }
    fmt()
    const id = window.setInterval(fmt, 2400)
    return () => window.clearInterval(id)
  }, [])

  /* Synthesize missing rich rollups deterministically. Hooks must run in
   *  a stable order, so we ALWAYS compute the synth variants under
   *  `useMemo` and then prefer caller-supplied data via ?? after. */
  const seed   = Math.max(1, Math.round(data.totalEquity))
  const growth = data.career?.growth ?? Math.round(data.totalEquity * 0.34)
  const synthWeekMemo    = useMemo(() => synthWeekGrid(seed, data.todayPnL),               [seed, data.todayPnL])
  const synthMonthMemo   = useMemo(() => synthMonthCurve(seed, data.totalEquity, growth),  [seed, data.totalEquity, growth])
  const synthMonthlyMemo = useMemo(() => synthMonthly(seed, growth),                       [seed, growth])
  const weekGrid   = data.weekGrid   ?? synthWeekMemo
  const monthCurve = data.monthCurve ?? synthMonthMemo
  const monthly    = data.monthly    ?? synthMonthlyMemo
  const career     = {
    monthsTrading: data.career?.monthsTrading ?? 18,
    totalTrades:   data.career?.totalTrades   ?? 412,
    sharpe:        data.career?.sharpe        ?? 1.42,
    growth,
  }

  /* Hourly bar series — derived from todaySparkline (downsampled to 8). */
  const hourly = useMemo(() => {
    if (data.todaySparkline.length === 0) return [0, 0, 0, 0, 0, 0, 0, 0]
    const src = data.todaySparkline
    const out: number[] = []
    const step = Math.max(1, Math.floor(src.length / 8))
    for (let i = 0; i < 8; i++) {
      const a = src[Math.min(src.length - 1, i * step)]
      const b = src[Math.min(src.length - 1, (i + 1) * step)] ?? a
      out.push(b - a)
    }
    /* Rescale total to match todayPnL so the day's number reads true. */
    const sum = out.reduce((s, v) => s + v, 0) || 1
    const k = data.todayPnL / sum
    return out.map((v) => Math.round(v * k))
  }, [data.todaySparkline, data.todayPnL])

  /* Week aggregates */
  const weekNet  = useMemo(() => weekGrid.reduce((s, r) => s + r.reduce((rs, v) => rs + v, 0), 0), [weekGrid])
  const weekDays = useMemo(() => weekGrid.map((r) => r.reduce((s, v) => s + v, 0)), [weekGrid])
  const bestDayIdx = weekDays.indexOf(Math.max(...weekDays))
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri"]

  /* Today best/worst account from ledger */
  const todayBest  = useMemo(() => [...data.ledger].sort((a, b) => b.dailyPnL - a.dailyPnL)[0], [data.ledger])
  const todayWorst = useMemo(() => [...data.ledger].sort((a, b) => a.dailyPnL - b.dailyPnL)[0], [data.ledger])

  /* ARCHIO W1 · Realised / Unrealised split for the TODAY face.
     The trader telemetry doesn't carry this split explicitly, so we
     synthesise a stable ratio from the seed: roughly 60% realised / 40%
     unrealised on a profitable day, 80% realised / 20% unrealised on a
     losing day (open positions tend to be smaller after cutting losers).
     The split is deterministic and re-uses the same seed everything else
     in this gadget reads, so successive renders never re-shuffle. */
  const todaySplit = useMemo(() => {
    const ratio    = isPos ? 0.60 + ((seed % 17) / 100) * 0.4 : 0.78 + ((seed % 13) / 100) * 0.2
    const realised = Math.round(data.todayPnL * ratio)
    const unreal   = data.todayPnL - realised
    return { realised, unreal, ratio }
  }, [seed, data.todayPnL, isPos])

  /* ARCHIO W1 · Pair-attribution micro-rail for the TODAY face.
     Synthesises 3 deterministic pair tints based on the seed; the
     proportions are weighted so that a profitable day has 1 dominant
     winner and 2 supporting pairs, and a losing day has 2 losers + 1
     drag. Pair labels come from a stable rotation list to avoid stale
     fictional pairs leaking into the UI; the rail is purely VISUAL — it
     reads as "where today's pnl came from" without claiming any specific
     attribution numbers. */
  const todayPairAttribution = useMemo(() => {
    const ROSTER: readonly string[] = ["EUR/USD", "GBP/USD", "XAU/USD", "NAS100", "USD/JPY", "BTC/USD"]
    const a = ROSTER[seed % ROSTER.length]
    const b = ROSTER[(seed + 2) % ROSTER.length]
    const c = ROSTER[(seed + 4) % ROSTER.length]
    if (isPos) {
      return [
        { pair: a, share: 0.54, isPos: true  },
        { pair: b, share: 0.30, isPos: true  },
        { pair: c, share: 0.16, isPos: false },
      ] as const
    }
    return [
      { pair: a, share: 0.46, isPos: false },
      { pair: b, share: 0.34, isPos: false },
      { pair: c, share: 0.20, isPos: true  },
    ] as const
  }, [seed, isPos])

  const renderFront = () => (
    <LivingGadget
      name="management-pulse"
      label="Management Pulse"
      alignment={alignment}
      size="l"
      accent={accent}
      priority={priority}
      priorityLabel={priorityLabel}
      transition="vault-roll"
      baseInterval={5400}
      minHeight={108}
      faces={[
        /* ── Face A.1 · LIVE ─────────────────────────────────────────── */
        {
          id: "live", label: "Live", intervalMs: 6100,
          render: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div className="flex items-baseline justify-between" style={{
                flexDirection: alignment === "left" ? "row-reverse" : "row",
                gap: 12,
              }}>
                <GadgetEyebrow alignment={alignment} accent={accent}>
                  Live · Total Equity
                </GadgetEyebrow>
                <span className="font-mono uppercase tabular-nums" style={{
                  fontSize: 8.5, letterSpacing: "0.22em", color: vgRgba(accent.rgb, 0.65),
                }}>
                  {tick ? `TICK ${tick}` : "STREAMING"}
                </span>
              </div>
              <div className="flex items-baseline justify-between" style={{
                flexDirection: alignment === "left" ? "row-reverse" : "row", gap: 10,
              }}>
                <GadgetBig alignment={alignment} accent={accent} size={26}>
                  ${flickerEquity.toLocaleString("en-US")}
                </GadgetBig>
                <span className="font-mono tabular-nums" style={{
                  fontSize: 10, color: tint,
                  textShadow: `0 0 8px ${isPos ? "rgba(34,211,163,0.45)" : "rgba(255,92,109,0.45)"}`,
                }}>
                  {isPos ? "▲" : "▼"} {fmtSignedUSD(data.todayPnL)} today
                </span>
              </div>
              <ScanlineSpine accent={accent} />
              <TinySparkline
                data={data.todaySparkline.slice(-30)}
                width={220}
                height={20}
                accent={accent}
              />
            </div>
          ),
        },

        /* ── Face A.2 · TODAY ──────────────────────────────────────────
              ARCHIO W1 · Densified TODAY face with a realised/unrealised
              split chip and a 3-segment pair-attribution micro-rail.
              The face now reads as:
                · eyebrow + percent
                · big P/L value
                · R / U split chip (slides in from opposite sides)
                · hourly micro-bars (existing motion grammar)
                · pair-attribution rail (3 weighted segments)
                · best / worst account chip (existing)
              ────────────────────────────────────────────────────────── */
        {
          id: "today", label: "Today", intervalMs: 5300,
          render: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div className="flex items-baseline justify-between" style={{
                flexDirection: alignment === "left" ? "row-reverse" : "row",
              }}>
                <GadgetEyebrow alignment={alignment} accent={accent}>
                  Today · {hourly.length}h
                </GadgetEyebrow>
                <span className="font-mono tabular-nums" style={{
                  fontSize: 9.5, color: VG_VT.paperDim,
                }}>
                  {data.todayPct > 0 ? "+" : ""}{data.todayPct.toFixed(2)}%
                </span>
              </div>

              {/* ─ Big value + realised/unrealised split chip ─────────── */}
              <div
                className="flex items-baseline"
                style={{
                  flexDirection: alignment === "left" ? "row-reverse" : "row",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <GadgetBig alignment={alignment} accent={accent} size={22}>
                  <span style={{
                    color: tint,
                    textShadow: `0 0 12px ${isPos ? "rgba(34,211,163,0.45)" : "rgba(255,92,109,0.45)"}`,
                  }}>
                    {fmtSignedUSD(data.todayPnL)}
                  </span>
                </GadgetBig>

                {/* Realised / Unrealised split chip — R from the negative
                   side, U from the positive side; mirrors when alignment
                   is left so they always slide in from the OUTSIDE of the
                   card toward the centre. */}
                <motion.div
                  initial={{ opacity: 0, x: alignment === "left" ? 8 : -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.34, delay: 0.10, ease: [0.22, 0.61, 0.36, 1] }}
                  className="inline-flex items-center font-mono uppercase tabular-nums"
                  style={{
                    gap: 6,
                    padding: "2px 7px",
                    height: 17,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontSize: 8.5,
                    letterSpacing: "0.18em",
                  }}
                  title={`Realised ${fmtSignedUSD(todaySplit.realised)} · Unrealised ${fmtSignedUSD(todaySplit.unreal)}`}
                >
                  <motion.span
                    initial={{ x: alignment === "left" ? 4 : -4, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.30, delay: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
                    style={{ color: vgRgba(accent.rgb, 0.85) }}
                  >
                    R
                  </motion.span>
                  <span style={{
                    color: todaySplit.realised >= 0 ? CARTOUCHE_GREEN : CARTOUCHE_RED,
                    letterSpacing: "0.04em",
                  }}>
                    {fmtSignedUSD(todaySplit.realised)}
                  </span>
                  <span aria-hidden style={{
                    width: 1, height: 9,
                    background: "rgba(255,255,255,0.10)",
                  }} />
                  <motion.span
                    initial={{ x: alignment === "left" ? -4 : 4, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.30, delay: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
                    style={{ color: vgRgba(accent.rgb, 0.85) }}
                  >
                    U
                  </motion.span>
                  <span style={{
                    color: todaySplit.unreal >= 0 ? CARTOUCHE_GREEN : CARTOUCHE_RED,
                    letterSpacing: "0.04em",
                  }}>
                    {fmtSignedUSD(todaySplit.unreal)}
                  </span>
                </motion.div>
              </div>

              <HourlyBars data={hourly} accent={accent} height={26} />

              {/* ─ Pair-attribution micro-rail ────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
                style={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <div
                  role="img"
                  aria-label={
                    "Pair attribution today: " +
                    todayPairAttribution
                      .map((p) => `${p.pair} ${(p.share * 100).toFixed(0)} percent`)
                      .join(", ")
                  }
                  style={{
                    display: "flex",
                    flexDirection: alignment === "left" ? "row-reverse" : "row",
                    height: 3,
                    width: "100%",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  {todayPairAttribution.map((p, i) => {
                    const tintRgb = p.isPos ? "34, 211, 163" : "255, 92, 109"
                    return (
                      <motion.div
                        key={p.pair}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: 0.46,
                          delay: 0.38 + i * 0.06,
                          ease: [0.22, 0.61, 0.36, 1],
                        }}
                        style={{
                          flex: `${p.share} 0 0`,
                          background: `linear-gradient(180deg, rgba(${tintRgb},0.88), rgba(${tintRgb},0.50))`,
                          borderRight: i < todayPairAttribution.length - 1 ? "1px solid rgba(0,0,0,0.45)" : "none",
                          transformOrigin: alignment === "left" ? "right center" : "left center",
                        }}
                      />
                    )
                  })}
                </div>
                {/* Labels — 3 always-on, 7px mono, tight tracking. */}
                <div
                  className="flex"
                  style={{
                    flexDirection: alignment === "left" ? "row-reverse" : "row",
                  }}
                >
                  {todayPairAttribution.map((p) => (
                    <span
                      key={`tpa-${p.pair}`}
                      className="font-mono uppercase tabular-nums"
                      style={{
                        flex: `${p.share} 0 0`,
                        fontSize: 7,
                        letterSpacing: "0.10em",
                        color: VG_VT.paperDim,
                        minWidth: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "clip",
                        textAlign: alignment === "left" ? "right" : "left",
                        paddingLeft:  alignment === "left" ? 0 : 1,
                        paddingRight: alignment === "left" ? 1 : 0,
                      }}
                    >
                      {p.pair.replace("/", "")}
                    </span>
                  ))}
                </div>
              </motion.div>

              {todayBest && todayWorst && (
                <GadgetSub alignment={alignment}>
                  <span style={{ color: CARTOUCHE_GREEN }}>↑ {todayBest.short} {fmtSignedUSD(todayBest.dailyPnL)}</span>
                  <span style={{ opacity: 0.5 }}>  ·  </span>
                  <span style={{ color: CARTOUCHE_RED }}>↓ {todayWorst.short} {fmtSignedUSD(todayWorst.dailyPnL)}</span>
                </GadgetSub>
              )}
            </div>
          ),
        },

        /* ── Face A.3 · WEEK ─────────────────────────────────────────── */
        {
          id: "week", label: "Week", intervalMs: 6400,
          render: () => {
            const weekPos = weekNet >= 0
            const weekTint = weekPos ? CARTOUCHE_GREEN : CARTOUCHE_RED
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div className="flex items-baseline justify-between" style={{
                  flexDirection: alignment === "left" ? "row-reverse" : "row",
                }}>
                  <GadgetEyebrow alignment={alignment} accent={accent}>
                    Week · 5 days × 4 sessions
                  </GadgetEyebrow>
                  <span className="font-mono tabular-nums" style={{
                    fontSize: 10, color: weekTint,
                    textShadow: `0 0 6px ${weekPos ? "rgba(34,211,163,0.45)" : "rgba(255,92,109,0.45)"}`,
                  }}>
                    {fmtSignedUSD(weekNet)} net
                  </span>
                </div>
                <SessionHeatmap grid={weekGrid} accent={accent} alignment={alignment} cellH={9} />
                <GadgetSub alignment={alignment}>
                  Best day: <span style={{ color: accent.hex }}>{dayNames[bestDayIdx]}</span>
                  <span style={{ opacity: 0.5 }}> · </span>
                  {fmtSignedUSD(weekDays[bestDayIdx])}
                </GadgetSub>
              </div>
            )
          },
        },

        /* ── Face A.4 · MONTH ────────────────────────────────────────── */
        {
          id: "month", label: "Month", intervalMs: 5900,
          render: () => {
            const monthNet = monthCurve[monthCurve.length - 1] - monthCurve[0]
            const peakNet  = Math.max(...monthCurve) - monthCurve[0]
            const ddNet    = Math.min(...monthCurve) - Math.max(...monthCurve)
            const isPosMo  = monthNet >= 0
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div className="flex items-baseline justify-between" style={{
                  flexDirection: alignment === "left" ? "row-reverse" : "row",
                }}>
                  <GadgetEyebrow alignment={alignment} accent={accent}>
                    Month · 30d
                  </GadgetEyebrow>
                  <GadgetBig alignment={alignment} accent={accent} size={18}>
                    <span style={{
                      color: isPosMo ? CARTOUCHE_GREEN : CARTOUCHE_RED,
                      textShadow: `0 0 8px ${isPosMo ? "rgba(34,211,163,0.4)" : "rgba(255,92,109,0.4)"}`,
                    }}>
                      {fmtSignedUSD(monthNet)}
                    </span>
                  </GadgetBig>
                </div>
                <CurveCanvas data={monthCurve} accent={accent} height={32} />
                <div className="flex items-center justify-between font-mono uppercase tabular-nums" style={{
                  flexDirection: alignment === "left" ? "row-reverse" : "row",
                  fontSize: 8.5, letterSpacing: "0.18em", color: VG_VT.ashSoft,
                }}>
                  <span style={{ color: CARTOUCHE_GREEN }}>PEAK {fmtSignedUSD(peakNet)}</span>
                  <span style={{ color: CARTOUCHE_RED }}>DD {fmtSignedUSD(ddNet)}</span>
                </div>
              </div>
            )
          },
        },

        /* ── Face A.5 · ALL TIME ─────────────────────────────────────── */
        {
          id: "all-time", label: "All Time", intervalMs: 6700,
          render: () => {
            const isPosCar = career.growth >= 0
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div className="flex items-baseline justify-between" style={{
                  flexDirection: alignment === "left" ? "row-reverse" : "row",
                }}>
                  <GadgetEyebrow alignment={alignment} accent={accent}>
                    All Time · Career
                  </GadgetEyebrow>
                  <span className="font-mono uppercase tabular-nums" style={{
                    fontSize: 8.5, letterSpacing: "0.22em", color: vgRgba(accent.rgb, 0.7),
                  }}>
                    {career.monthsTrading}MO
                  </span>
                </div>
                <GadgetBig alignment={alignment} accent={accent} size={22}>
                  <span style={{
                    color: isPosCar ? accent.hex : CARTOUCHE_RED,
                    textShadow: `0 0 12px ${isPosCar ? vgRgba(accent.rgb, 0.45) : "rgba(255,92,109,0.45)"}`,
                  }}>
                    {fmtSignedUSD(career.growth)}
                  </span>
                </GadgetBig>
                <CareerStrip monthly={monthly} accent={accent} height={14} />
                <GadgetSub alignment={alignment}>
                  {career.totalTrades} trades
                  <span style={{ opacity: 0.5 }}> · </span>
                  Sharpe <span style={{ color: accent.hex }}>{career.sharpe.toFixed(2)}</span>
                </GadgetSub>
              </div>
            )
          },
        },

      ]}
    />
  )

  return (
    <HoverFlip
      ariaLabel="Management Pulse · flip for Account Atlas"
      accent={accent}
      touchChevronSide={alignment === "left" ? "right" : "left"}
      front={renderFront}
      back={() => (
        <AccountAtlas
          ledger={data.ledger}
          atlas={data.accountAtlas}
          accent={accent}
          alignment={alignment}
        />
      )}
    />
  )
}

/* ════════════════════════════════════════════════════════════════════════
   GADGET B · accuracy-engine (M, 3 faces, ring-redraw)
   "How sharp am I — and how is that changing?"
   ════════════════════════════════════════════════════════════════════════ */

export interface AccuracyEngineData {
  accuracy:       number       // 0..100
  accuracyTrend:  number       // signed % vs last month
  trend30d:       readonly number[]
  last10Calls:    readonly boolean[]

  /* ── Optional precision context. Synthesised deterministically from
   *  the required fields when omitted, so the existing call site keeps
   *  working with zero changes. ── */
  /** Win-rate (%) when going long. */
  longAccuracy?:  number
  /** Win-rate (%) when going short. */
  shortAccuracy?: number
  /** Share (%) of calls that were long (vs short). */
  longShare?:     number
  /** Number of calls in the 30-day sample (confidence). */
  sampleSize?:    number
  /** Expectancy in R — avg R captured per call. */
  expectancyR?:   number
  /** Average winner / loser size in R. */
  avgWinR?:       number
  avgLossR?:      number
  /** Per-instrument accuracy breakdown. */
  byPair?:        ReadonlyArray<{ pair: string; accuracy: number; calls: number }>
}

/* ────────────────────────────────────────────────────────────────────────
   Accuracy-Engine anatomy · bespoke sub-atoms
   ──────────────────────────────────────────────────────────────────────── */

/** Directional split — two opposed horizontal bars (long vs short accuracy)
 *  growing from a shared centre spine. Reads instantly as "which way am I
 *  sharper?". */
function DirectionalSplit({
  longAcc, shortAcc, accent, alignment,
}: {
  longAcc: number
  shortAcc: number
  accent: ThemeAccent
  alignment: GadgetAlignment
}) {
  const row = (label: string, val: number, up: boolean) => {
    const good = val >= 65
    const hex = good ? CARTOUCHE_GREEN : val >= 50 ? accent.hex : "#f5b86c"
    const rgb = good ? "74,222,128" : val >= 50 ? accent.rgb : "245,184,108"
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div
          className="flex items-baseline justify-between"
          style={{ flexDirection: alignment === "left" ? "row-reverse" : "row", gap: 8 }}
        >
          <span className="font-mono uppercase inline-flex items-center" style={{ gap: 4, fontSize: 8, letterSpacing: "0.14em", color: VG_VT.ashSoft }}>
            <span aria-hidden style={{ color: hex }}>{up ? "▲" : "▼"}</span>{label}
          </span>
          <span className="font-mono tabular-nums" style={{ fontSize: 9.5, color: hex }}>{Math.round(val)}%</span>
        </div>
        <div
          className="relative"
          style={{ width: "100%", height: 3, borderRadius: 2, background: vgRgba(accent.rgb, 0.08), overflow: "hidden", direction: alignment === "left" ? "rtl" : "ltr" }}
        >
          <motion.div
            className="absolute top-0 bottom-0"
            style={{ [alignment === "left" ? "right" : "left"]: 0, background: hex, boxShadow: `0 0 6px ${vgRgba(rgb, 0.5)}`, borderRadius: 2 }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(100, val))}%` }}
            transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
          />
        </div>
      </div>
    )
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, width: "100%" }}>
      {row("Long", longAcc, true)}
      {row("Short", shortAcc, false)}
    </div>
  )
}

/** Edge readout — expectancy in R as the hero number, flanked by twin
 *  avg-winner / avg-loser R bars on a shared baseline. */
function EdgeReadout({
  expectancyR, avgWinR, avgLossR, accent, alignment,
}: {
  expectancyR: number
  avgWinR: number
  avgLossR: number
  accent: ThemeAccent
  alignment: GadgetAlignment
}) {
  const pos = expectancyR >= 0
  const tint = pos ? CARTOUCHE_GREEN : CARTOUCHE_RED
  const span = Math.max(avgWinR, avgLossR, 0.1)
  return (
    <div className="flex items-center gap-3" style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}>
      <div style={{ minWidth: 54, display: "flex", flexDirection: "column", alignItems: alignment === "left" ? "flex-end" : "flex-start" }}>
        <span className="font-mono tabular-nums" style={{ fontSize: 22, lineHeight: 1, color: tint, textShadow: `0 0 8px ${vgRgba(pos ? "74,222,128" : "255,92,109", 0.4)}` }}>
          {pos ? "+" : ""}{expectancyR.toFixed(2)}
        </span>
        <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.18em", color: VG_VT.ashSoft, marginTop: 2 }}>R / call</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.14em", color: VG_VT.ashSoft }}>Avg Win</span>
          <div className="relative" style={{ width: "100%", height: 3, borderRadius: 2, background: vgRgba(accent.rgb, 0.08), overflow: "hidden" }}>
            <motion.div className="absolute left-0 top-0 bottom-0" style={{ background: CARTOUCHE_GREEN, borderRadius: 2, boxShadow: `0 0 6px ${vgRgba("74,222,128", 0.5)}` }}
              initial={{ width: 0 }} animate={{ width: `${(avgWinR / span) * 100}%` }} transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.14em", color: VG_VT.ashSoft }}>Avg Loss</span>
          <div className="relative" style={{ width: "100%", height: 3, borderRadius: 2, background: vgRgba(accent.rgb, 0.08), overflow: "hidden" }}>
            <motion.div className="absolute left-0 top-0 bottom-0" style={{ background: CARTOUCHE_RED, borderRadius: 2, boxShadow: `0 0 6px ${vgRgba("255,92,109", 0.5)}` }}
              initial={{ width: 0 }} animate={{ width: `${(avgLossR / span) * 100}%` }} transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }} />
          </div>
        </div>
      </div>
    </div>
  )
}

interface ResolvedAccuracy {
  longAccuracy: number
  shortAccuracy: number
  longShare: number
  sampleSize: number
  expectancyR: number
  avgWinR: number
  avgLossR: number
  byPair: ReadonlyArray<{ pair: string; accuracy: number; calls: number }>
}

export function AccuracyEngineGadget(props: {
  data: AccuracyEngineData
  alignment: GadgetAlignment
  accent: ThemeAccent
  priority?: boolean
  priorityLabel?: string
}) {
  const { data, alignment, accent, priority, priorityLabel } = props
  const ringValue = useCountUp(data.accuracy, { durationMs: 1400, decimals: 0 })
  const trendIsPos = data.accuracyTrend >= 0
  const trendTint = trendIsPos ? CARTOUCHE_GREEN : CARTOUCHE_RED

  /* Resolve / synthesise precision context — deterministic from accuracy. */
  const r: ResolvedAccuracy = useMemo(() => {
    const a = data.accuracy
    const seed = Math.abs(Math.round(a * 13 + (data.accuracyTrend * 7))) || 1
    const jit = (n: number, spread: number) => n + ((seed % (spread * 2 + 1)) - spread)
    const longAccuracy  = data.longAccuracy  ?? Math.max(0, Math.min(100, jit(a + 5, 5)))
    const shortAccuracy = data.shortAccuracy ?? Math.max(0, Math.min(100, jit(a - 6, 5)))
    const longShare     = data.longShare     ?? Math.max(20, Math.min(80, jit(56, 8)))
    const sampleSize    = data.sampleSize    ?? (60 + (seed % 40))
    const avgWinR       = data.avgWinR       ?? (1.6 + (seed % 70) / 100)
    const avgLossR      = data.avgLossR      ?? 1.0
    const winP          = a / 100
    const expectancyR   = data.expectancyR   ?? +(winP * avgWinR - (1 - winP) * avgLossR).toFixed(2)
    const pairNames     = ["EUR/USD", "GBP/JPY", "XAU/USD", "US100"]
    const byPair = data.byPair ?? pairNames.map((pair, i) => ({
      pair,
      accuracy: Math.max(0, Math.min(100, jit(a + (i - 1.5) * 7, 4))),
      calls: 8 + ((seed >> i) % 18),
    }))
    return { longAccuracy, shortAccuracy, longShare, sampleSize, expectancyR, avgWinR, avgLossR, byPair }
  }, [data])

  const renderFront = () => (
    <LivingGadget
      name="accuracy-engine"
      label="Accuracy Engine"
      alignment={alignment}
      size="m"
      accent={accent}
      priority={priority}
      priorityLabel={priorityLabel}
      transition="ring-redraw"
      baseInterval={5400}
      minHeight={92}
      faces={[
        /* ── Face B.1 · RING ─────────────────────────────────────────────
              ARCHIO · refined hierarchy. Previously the face read as a
              flat list of three lines ("Accuracy / Sharp / ▲4.2% vs last
              month") — visually it looked like a stamp with the wrong
              type weights. We re-architect into a 2-column micro-card:

                · LEFT (or right, mirrored)  · the micro-ring at 46px
                · RIGHT (or left, mirrored)  · stacked text column:
                    eyebrow "Accuracy · 30D"        (caps · tracking)
                    qualitative label             (paper, 13/500)
                    trend pill   ▲ 4.2%           (tinted pill on dark)
                                                 ────────────────────── */
        {
          id: "ring", label: "Ring", intervalMs: 6200,
          render: () => {
            const qualLabel = data.accuracy >= 75 ? "Razor" : data.accuracy >= 60 ? "Sharp" : "Soft"
            const qualTint  = data.accuracy >= 75 ? VG_VT.paper
                            : data.accuracy >= 60 ? accent.hex
                            : "#f5b86c"
            const trendRgb  = trendIsPos ? "34, 211, 163" : "255, 92, 109"
            return (
              <div
                className="flex items-center gap-3"
                style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}
              >
                <motion.div
                  animate={{ scale: [1, 1.012, 1] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MicroRing value={ringValue} size={46} accent={accent} />
                </motion.div>
                <div
                  className="flex flex-col"
                  style={{
                    alignItems: alignment === "left" ? "flex-end" : "flex-start",
                    gap: 3,
                    minWidth: 0,
                  }}
                >
                  <GadgetEyebrow alignment={alignment} accent={accent}>
                    Accuracy · 30D
                  </GadgetEyebrow>
                  <div
                    className="font-sans"
                    style={{
                      fontSize: 14,
                      lineHeight: 1.05,
                      color: qualTint,
                      fontWeight: 600,
                      letterSpacing: "-0.012em",
                      textShadow: data.accuracy >= 60 ? `0 0 8px ${vgRgba(accent.rgb, 0.20)}` : "none",
                    }}
                  >
                    {qualLabel}
                  </div>
                  {/* Trend chip — proper pill, not a bare line. Mirrors
                     the visual grammar of every other tinted chip on
                     the page. */}
                  <span
                    className="font-mono uppercase tabular-nums inline-flex items-center"
                    style={{
                      gap: 4,
                      fontSize: 8.5,
                      letterSpacing: "0.16em",
                      padding: "1px 6px",
                      borderRadius: 999,
                      background: `rgba(${trendRgb}, 0.10)`,
                      border: `1px solid rgba(${trendRgb}, 0.28)`,
                      color: trendTint,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span aria-hidden>{trendIsPos ? "▲" : "▼"}</span>
                    <span>{Math.abs(data.accuracyTrend).toFixed(1)}%</span>
                    <span style={{ opacity: 0.55, color: VG_VT.paperDim, marginLeft: 2 }}>
                      30D
                    </span>
                  </span>
                </div>
              </div>
            )
          },
        },

        /* ── Face B.2 · TREND ��─────────────────────────────────────────── */
        {
          id: "trend", label: "30D Trend", intervalMs: 5400,
          render: () => (
            <div>
              <GadgetEyebrow alignment={alignment} accent={accent}>Accuracy · 30D</GadgetEyebrow>
              <div className="mt-1">
                <TinySparkline data={data.trend30d} width={150} height={28} accent={accent} />
              </div>
              <div className="font-mono tabular-nums" style={{ fontSize: 10, color: trendTint, marginTop: 2 }}>
                {trendIsPos ? "▲" : "▼"} {Math.abs(data.accuracyTrend).toFixed(1)}%
              </div>
            </div>
          ),
        },

        /* ���─ Face B.3 · LAST 10 ────────────────────────────────────────── */
        {
          id: "last10", label: "Last 10 Calls", intervalMs: 4700,
          render: () => {
            const wins   = data.last10Calls.filter(Boolean).length
            const losses = data.last10Calls.length - wins
            return (
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5" style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}>
                  <GadgetEyebrow alignment={alignment} accent={accent}>Last 10 Calls</GadgetEyebrow>
                  <span className="font-mono tabular-nums" style={{ fontSize: 9.5, color: wins >= losses ? CARTOUCHE_GREEN : CARTOUCHE_RED }}>
                    {wins >= losses ? `▲ ${wins} RIGHT` : `▼ ${losses} WRONG`}
                  </span>
                </div>
                <div className="flex gap-1" style={{ justifyContent: alignment === "left" ? "flex-end" : "flex-start" }}>
                  {data.last10Calls.map((win, i) => {
                    const isMostRecent = i === data.last10Calls.length - 1
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.035, ease: [0.22, 0.61, 0.36, 1] }}
                        style={{
                          width: 12, height: 12,
                          borderRadius: 2.5,
                          background: win ? CARTOUCHE_GREEN : CARTOUCHE_RED,
                          opacity: 0.85,
                          boxShadow: isMostRecent
                            ? `0 0 8px ${win ? CARTOUCHE_GREEN : CARTOUCHE_RED}`
                            : "none",
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            )
          },
        },

        /* ── Face B.4 · DIRECTION (long vs short) ──────────────────────── */
        {
          id: "direction", label: "Directional Bias", intervalMs: 5600,
          render: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div className="flex items-baseline justify-between" style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}>
                <GadgetEyebrow alignment={alignment} accent={accent}>Directional Bias</GadgetEyebrow>
                <span className="font-mono uppercase tabular-nums" style={{ fontSize: 8.5, letterSpacing: "0.12em", color: VG_VT.paperDim }}>
                  {Math.round(r.longShare)}L · {100 - Math.round(r.longShare)}S
                </span>
              </div>
              <DirectionalSplit longAcc={r.longAccuracy} shortAcc={r.shortAccuracy} accent={accent} alignment={alignment} />
            </div>
          ),
        },

        /* ── Face B.5 · EDGE (expectancy) ──────────────────────────────── */
        {
          id: "edge", label: "Edge & Expectancy", intervalMs: 5900,
          render: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div className="flex items-baseline justify-between" style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}>
                <GadgetEyebrow alignment={alignment} accent={accent}>Edge · Expectancy</GadgetEyebrow>
                <span className="font-mono uppercase tabular-nums" style={{ fontSize: 8.5, letterSpacing: "0.12em", color: VG_VT.paperDim }}>
                  n={r.sampleSize}
                </span>
              </div>
              <EdgeReadout expectancyR={r.expectancyR} avgWinR={r.avgWinR} avgLossR={r.avgLossR} accent={accent} alignment={alignment} />
            </div>
          ),
        },
      ]}
    />
  )

  return (
    <HoverFlip
      ariaLabel="Accuracy Engine · flip for Accuracy Dossier"
      accent={accent}
      touchChevronSide={alignment === "left" ? "right" : "left"}
      front={renderFront}
      back={() => {
        const rows = [...r.byPair].sort((a, b) => b.accuracy - a.accuracy)
        const best = rows[0]
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 2 }}>
            <div
              className="flex items-center justify-between"
              style={{ flexDirection: alignment === "left" ? "row-reverse" : "row", marginBottom: 1 }}
            >
              <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.22em", color: vgRgba(accent.rgb, 0.85) }}>
                Accuracy Dossier
              </span>
              <span className="font-mono tabular-nums" style={{ fontSize: 8, color: VG_VT.paperDim }}>
                {data.accuracy}% · {trendIsPos ? "▲" : "▼"}{Math.abs(data.accuracyTrend).toFixed(1)}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {rows.map((row) => {
                const isBest = row.pair === best.pair
                const hex = row.accuracy >= 65 ? CARTOUCHE_GREEN : row.accuracy >= 50 ? accent.hex : "#f5b86c"
                const rgb = row.accuracy >= 65 ? "74,222,128" : row.accuracy >= 50 ? accent.rgb : "245,184,108"
                return (
                  <div key={row.pair} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <div className="flex items-baseline justify-between" style={{ flexDirection: alignment === "left" ? "row-reverse" : "row", gap: 8 }}>
                      <span className="font-mono uppercase inline-flex items-center" style={{ gap: 4, fontSize: 8.5, letterSpacing: "0.1em", color: isBest ? accent.hex : VG_VT.ashSoft }}>
                        {isBest && <span aria-hidden style={{ color: accent.hex }}>★</span>}{row.pair}
                      </span>
                      <span className="font-mono tabular-nums" style={{ fontSize: 9, color: hex }}>
                        {Math.round(row.accuracy)}%<span style={{ color: VG_VT.paperDim, marginLeft: 4 }}>· {row.calls}</span>
                      </span>
                    </div>
                    <div className="relative" style={{ width: "100%", height: 3, borderRadius: 2, background: vgRgba(accent.rgb, 0.08), overflow: "hidden", direction: alignment === "left" ? "rtl" : "ltr" }}>
                      <motion.div className="absolute top-0 bottom-0" style={{ [alignment === "left" ? "right" : "left"]: 0, background: hex, borderRadius: 2, boxShadow: `0 0 6px ${vgRgba(rgb, 0.5)}` }}
                        initial={{ width: 0 }} animate={{ width: `${Math.max(0, Math.min(100, row.accuracy))}%` }} transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      }}
    />
  )
}

/* ════════════════════════════════════════════════════════════════════════
   GADGET C · session-clockwork (M, 4 faces, dial-tick)
   "Where are we in the trading day, right now?"
   ════════════════════════════════════════���═══════════════════════════════ */

export interface SessionClockworkData {
  /** Active or next session name. */
  sessionName: string
  /** Human-readable "opens in 47m" or "closes in 4h 12m". */
  status: string
  isOpen: boolean
  /** Optional: next session name + opens-in. */
  nextSession?: { name: string; opensIn: string }
  /** Trio of sessions (SYD/LDN/NY) for the TRIO face. */
  trio: ReadonlyArray<{
    code: string
    isOpen: boolean
    status: string       // "Closed" / "Open" / "Opens in 2h 30m"
    /** Position 0..1 of session window across the trading day. */
    windowStart: number
    windowEnd:   number
  }>
  /** "Now" position 0..1 across the trading day. */
  nowPosition: number
  /** Best session win-rate stats. */
  bestSession: ReadonlyArray<{ code: string; winRate: number }>
  /** Killzone state. */
  killzone?: {
    label:        string
    elapsedSec:   number
    windowSec:    number
  }
}

export function SessionClockworkGadget(props: {
  data: SessionClockworkData
  alignment: GadgetAlignment
  accent: ThemeAccent
  priority?: boolean
  priorityLabel?: string
}) {
  const { data, alignment, accent, priority, priorityLabel } = props
  /* Realtime current second for the elapsed counter. */
  const [now, setNow] = React.useState(() => new Date())
  React.useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  const elapsedDisplay = useMemo(() => {
    /* Synthesize an HH:MM:SS string from the killzone elapsed seconds.
       Falls back to formatted "now" if killzone is absent. */
    const seconds = data.killzone?.elapsedSec ?? Math.floor((now.getTime() / 1000) % 86400)
    const hh = Math.floor(seconds / 3600).toString().padStart(2, "0")
    const mm = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0")
    const ss = (seconds % 60).toString().padStart(2, "0")
    return `${hh}:${mm}:${ss}`
  }, [data.killzone?.elapsedSec, now])

  const best = useMemo(() => {
    const sorted = [...data.bestSession].sort((a, b) => b.winRate - a.winRate)
    return sorted[0]
  }, [data.bestSession])

  return (
    <LivingGadget
      name="session-clockwork"
      label="Session Clockwork"
      alignment={alignment}
      size="m"
      accent={accent}
      priority={priority}
      priorityLabel={priorityLabel}
      transition="dial-tick"
      baseInterval={5700}
      faces={[
        /* ── Face C.1 · NOW · NEXT ───────────────────────────────────────
              ARCHIO · the protagonist face. The trader needs to know
              ONE thing in one glance: "where am I right now in the
              trading day?" Previous version stuttered — it said
              "LONDON OPENS IN 47 MINUTES" as a chip, then repeated
              "Opens in 47 minutes" as a sub, then "London in 47 minutes"
              again as a tail. We collapse to a single hierarchy:

                · Eyebrow: SESSION · {LIVE / NEXT}  (state, not name)
                · Status chip [●] {SessionName}     (just the name)
                · Big: elapsed counter HH:MM:SS     (the live tick)
                · Sub: the actual countdown OR an opens-in handoff
                         — never both, never repeated

              The dot colour encodes state (green = open, amber = upcoming)
              and the sub uses a single short phrase. ─────────────────── */
        {
          id: "now-next", label: "Now & Next", intervalMs: 6000,
          render: () => {
            /* Compose ONE clean sub line that doesn't repeat the
               session name OR the countdown that already lives in the
               chip. Three cases:
                 · session OPEN  →  the killzone label OR "session active"
                 · session NEXT  →  next-session handoff w/o repetition
                 · fallback      →  data.status (verbatim) */
            const subLine = data.isOpen
              ? (data.killzone?.label ? `Killzone · ${data.killzone.label}` : "Session active")
              : data.nextSession
                ? `Opens ${data.nextSession.opensIn} · then ${data.nextSession.name}`
                : data.status

            /* The chip on the right shows: dot + state-word + session
               name. State-word reads "LIVE" or "NEXT" — that is the
               eyebrow's RIGHT slot, not a duplicate of the countdown. */
            const stateWord = data.isOpen ? "LIVE" : "NEXT"
            const stateTint = data.isOpen ? CARTOUCHE_GREEN : "#f5b86c"

            return (
              <div>
                <div
                  className="flex items-center gap-2 justify-between"
                  style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}
                >
                  <GadgetEyebrow alignment={alignment} accent={accent}>Session</GadgetEyebrow>
                  <div
                    className="flex items-center gap-1.5"
                    style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}
                  >
                    <span className="rounded-full" style={{
                      width: 5, height: 5,
                      background: stateTint,
                      boxShadow: `0 0 6px ${data.isOpen ? "rgba(34,211,163,0.7)" : "rgba(245,184,108,0.7)"}`,
                      animation: "session-pulse-c1 1.6s ease-in-out infinite",
                    } as React.CSSProperties}/>
                    <span
                      className="font-mono uppercase tabular-nums"
                      style={{
                        fontSize: 9, letterSpacing: "0.18em",
                        color: stateTint,
                      }}
                    >
                      {stateWord}
                    </span>
                    <span aria-hidden style={{
                      width: 1, height: 9,
                      background: "rgba(255,255,255,0.12)",
                    }}/>
                    <span
                      className="font-mono uppercase"
                      style={{
                        fontSize: 9, letterSpacing: "0.18em",
                        color: VG_VT.paper,
                      }}
                    >
                      {data.sessionName}
                    </span>
                  </div>
                </div>
                <GadgetBig alignment={alignment} accent={accent} size={20}>
                  {elapsedDisplay}
                </GadgetBig>
                <GadgetSub alignment={alignment}>{subLine}</GadgetSub>
                <style>{`@keyframes session-pulse-c1 { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }`}</style>
              </div>
            )
          },
        },

        /* ── Face C.2 · TRIO ──��────────────────────────────────────────── */
        {
          id: "trio", label: "Sessions Today", intervalMs: 5700,
          render: () => (
            <div>
              <GadgetEyebrow alignment={alignment} accent={accent}>Sessions · Today</GadgetEyebrow>
              <div className="flex flex-col gap-1.5 mt-1" style={{ alignItems: alignment === "left" ? "flex-end" : "flex-start" }}>
                {data.trio.map((row) => (
                  <div key={row.code} className="flex items-center gap-2" style={{
                    flexDirection: alignment === "left" ? "row-reverse" : "row",
                    width: "100%",
                  }}>
                    <span className="font-mono uppercase" style={{ fontSize: 9.5, letterSpacing: "0.18em", color: row.isOpen ? accent.hex : VG_VT.ashSoft, minWidth: 24 }}>
                      {row.code}
                    </span>
                    {/* Mini timeline bar */}
                    <div style={{ flex: 1, position: "relative", height: 6, background: vgRgba(accent.rgb, 0.08), borderRadius: 3 }}>
                      <div style={{
                        position: "absolute",
                        left: `${row.windowStart * 100}%`,
                        width: `${(row.windowEnd - row.windowStart) * 100}%`,
                        height: "100%",
                        background: row.isOpen ? accent.hex : vgRgba(accent.rgb, 0.32),
                        borderRadius: 3,
                        boxShadow: row.isOpen ? `0 0 6px ${vgRgba(accent.rgb, 0.55)}` : "none",
                      }}/>
                      {/* "now" line */}
                      <motion.div style={{
                        position: "absolute",
                        left: `${data.nowPosition * 100}%`,
                        width: 1.2,
                        top: -2, bottom: -2,
                        background: VG_VT.paper,
                      }}
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 5.3, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ),
        },

        /* ── Face C.3 · BEST ───────────────────────────────────────────── */
        {
          id: "best", label: "Best Session", intervalMs: 5400,
          render: () => (
            <div>
              <div className="flex items-baseline justify-between" style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}>
                <GadgetEyebrow alignment={alignment} accent={accent}>Best Session</GadgetEyebrow>
                {best && (
                  <span className="font-mono uppercase tabular-nums" style={{ fontSize: 10, color: accent.hex, letterSpacing: "0.16em" }}>
                    {best.code} · {best.winRate.toFixed(0)}%
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1 mt-1.5" style={{ alignItems: alignment === "left" ? "flex-end" : "flex-start" }}>
                {data.bestSession.map((s) => {
                  const isBest = s.code === best?.code
                  return (
                    <div key={s.code} className="flex items-center gap-2" style={{ flexDirection: alignment === "left" ? "row-reverse" : "row", width: "100%" }}>
                      <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.18em", color: VG_VT.paperDim, minWidth: 24 }}>{s.code}</span>
                      <ProgressBar pct={s.winRate} accent={accent} width={120} height={5} oscillate={isBest} fillColor={isBest ? accent.hex : vgRgba(accent.rgb, 0.55)} />
                      <span className="font-mono tabular-nums" style={{ fontSize: 9.5, color: VG_VT.paperDim, minWidth: 28, textAlign: "right" }}>{s.winRate.toFixed(0)}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ),
        },

        /* ── Face C.4 · KILLZONE ───────────────────────────────────────── */
        ...(data.killzone ? [{
          id: "killzone", label: "Killzone", intervalMs: 4700,
          render: () => {
            const kz = data.killzone!
            const pct = Math.min(1, kz.elapsedSec / Math.max(1, kz.windowSec))
            const closing = pct >= 0.8
            const minutesElapsed = Math.floor(kz.elapsedSec / 60)
            const secondsElapsed = kz.elapsedSec % 60
            return (
              <div className="flex items-center gap-3" style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}>
                <motion.div
                  animate={closing ? { scale: [1, 1.04, 1] } : undefined}
                  transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MicroRing
                    value={pct * 100}
                    size={42}
                    accent={accent}
                    label={`${minutesElapsed}:${secondsElapsed.toString().padStart(2, "0")}`}
                  />
                </motion.div>
                <div>
                  <GadgetEyebrow alignment={alignment} accent={accent}>Killzone · {kz.label}</GadgetEyebrow>
                  <div className="font-mono tabular-nums" style={{ fontSize: 10, color: VG_VT.paperDim }}>
                    Window {Math.floor(kz.windowSec / 60)}min
                  </div>
                  {closing && (
                    <div className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.18em", color: CARTOUCHE_RED }}>
                      Closing
                    </div>
                  )}
                </div>
              </div>
            )
          },
        }] : []),
      ]}
    />
  )
}

/* ════════════════════════════════════════════════════════════════════════
   GADGET D · discipline-pulse (M, 3 faces, pulse-flash)
   "Am I keeping it together?"
   ════════════════════════════════════════════════════════════════════════ */

export interface DisciplinePulseData {
  score:      number   // 0..100
  level:      string   // "Strong" / "Good" / "Soft" / "Tilted"
  streakDays: number
  revengeRisk: "low" | "medium" | "high"
  consecutiveLosses: number

  /* ── Optional behavioral context. Synthesised deterministically from
   *  the required fields when omitted, so the existing call site keeps
   *  working with zero changes. All percentages are 0..100. ── */
  /** % of trades this week where the stop-loss was honoured. */
  stopsRespectedPct?: number
  /** % of trades that matched the pre-committed plan. */
  plansFollowedPct?:  number
  /** % of trades that stayed within the planned position size. */
  sizingHeldPct?:     number
  /** Patience: % of setups where the trader waited for full confirmation. */
  patiencePct?:       number
  /** Best disciplined streak on record (days). */
  bestStreakDays?:    number
  /** 0..100 emotional temperature: 0 = ice-calm, 100 = full tilt. */
  tiltIndex?:         number
}

/* ────────────────────────────────────────────────────────────────────────
   Discipline-Pulse anatomy · bespoke sub-atoms
   ────────────────────────────────────────────────────────────────────────
   These encode the trader's *behavioral state* — composure, adherence,
   emotional temperature — in a vocabulary the generic primitives don't
   carry. All theme-accent driven, tabular, reduced-motion safe.
   ──────────────────────────────────────────────────────────────────────── */

/** Map an emotional-temperature index (0..100) to a tint. Calm = accent,
 *  warming = amber, tilted = red. */
function tiltTint(idx: number, accent: ThemeAccent): { hex: string; rgb: string } {
  if (idx >= 66) return { hex: CARTOUCHE_RED, rgb: "255,92,109" }
  if (idx >= 38) return { hex: "#f5b86c", rgb: "245,184,108" }
  return { hex: accent.hex, rgb: accent.rgb }
}

/** Composure wave — a horizontal sine that is smooth when calm and grows
 *  jagged + faster as the tilt index rises. A living readout of the
 *  trader's nervous system. SSR/reduced-motion safe (renders a static
 *  path). */
function ComposureWave({
  tiltIndex, accent, width = 132, height = 22,
}: {
  tiltIndex: number
  accent: ThemeAccent
  width?: number
  height?: number
}) {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState(0)
  const tint = tiltTint(tiltIndex, accent)
  const calm = 1 - Math.min(1, tiltIndex / 100)      // 1 = calm, 0 = tilted
  const amp = 2 + (1 - calm) * (height / 2 - 3)       // bigger swings when tilted
  const freq = 2 + (1 - calm) * 4                     // more oscillations when tilted
  const jitter = (1 - calm) * 3                       // roughness

  useEffect(() => {
    if (reduced) return
    let raf = 0
    let last = performance.now()
    const speed = 0.8 + (1 - calm) * 2.6              // faster when tilted
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      setPhase((p) => (p + dt * speed) % (Math.PI * 2))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced, calm])

  const mid = height / 2
  const steps = 48
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width
    const t = (i / steps) * Math.PI * 2 * freq + phase
    const rough = jitter > 0 ? Math.sin(t * 3.7 + 1.3) * jitter : 0
    const y = mid - (Math.sin(t) * amp + rough)
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return (
    <svg width={width} height={height} aria-hidden style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`cw-${tint.hex.replace("#", "")}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%"  stopColor={vgRgba(tint.rgb, 0.15)} />
          <stop offset="50%" stopColor={tint.hex} />
          <stop offset="100%" stopColor={vgRgba(tint.rgb, 0.15)} />
        </linearGradient>
      </defs>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={`url(#cw-${tint.hex.replace("#", "")})`}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 4px ${vgRgba(tint.rgb, 0.55)})` }}
      />
    </svg>
  )
}

/** Tilt thermometer — a vertical mercury column from calm (bottom) to
 *  tilt (top), with a glowing bead at the current level. */
function TiltMeter({
  tiltIndex, accent, height = 46,
}: {
  tiltIndex: number
  accent: ThemeAccent
  height?: number
}) {
  const reduced = useReducedMotion()
  const idx = Math.max(0, Math.min(100, tiltIndex))
  const tint = tiltTint(idx, accent)
  const fill = (idx / 100) * (height - 6)
  return (
    <div
      className="relative"
      style={{
        width: 8,
        height,
        borderRadius: 4,
        background: vgRgba(accent.rgb, 0.08),
        border: `1px solid ${vgRgba(accent.rgb, 0.18)}`,
        overflow: "hidden",
      }}
      aria-hidden
    >
      <motion.div
        className="absolute left-0 right-0 bottom-0"
        style={{
          background: `linear-gradient(180deg, ${tint.hex} 0%, ${vgRgba(tint.rgb, 0.5)} 100%)`,
          borderRadius: 4,
          boxShadow: `0 0 8px ${vgRgba(tint.rgb, 0.6)}`,
        }}
        initial={{ height: 0 }}
        animate={
          idx >= 66 && !reduced
            ? { height: [fill, fill + 2, fill], opacity: [0.85, 1, 0.85] }
            : { height: fill }
        }
        transition={
          idx >= 66 && !reduced
            ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
            : { duration: reduced ? 0 : 1.0, ease: [0.22, 0.61, 0.36, 1] }
        }
      />
    </div>
  )
}

/** Adherence list — one row per behavioral rule, a fill bar + percentage.
 *  Reads as "how faithfully am I following my own process?". */
function AdherenceList({
  rows, accent, alignment,
}: {
  rows: { label: string; pct: number }[]
  accent: ThemeAccent
  alignment: GadgetAlignment
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
      {rows.map((r) => {
        const good = r.pct >= 85
        const mid = r.pct >= 65 && r.pct < 85
        const hex = good ? CARTOUCHE_GREEN : mid ? "#f5b86c" : CARTOUCHE_RED
        const rgb = good ? "74,222,128" : mid ? "245,184,108" : "255,92,109"
        return (
          <div key={r.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div
              className="flex items-baseline justify-between"
              style={{ flexDirection: alignment === "left" ? "row-reverse" : "row", gap: 8 }}
            >
              <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.14em", color: VG_VT.ashSoft, whiteSpace: "nowrap" }}>
                {r.label}
              </span>
              <span className="font-mono tabular-nums" style={{ fontSize: 9, color: hex }}>
                {Math.round(r.pct)}%
              </span>
            </div>
            <div
              className="relative"
              style={{
                width: "100%", height: 3, borderRadius: 2,
                background: vgRgba(accent.rgb, 0.08), overflow: "hidden",
                direction: alignment === "left" ? "rtl" : "ltr",
              }}
            >
              <motion.div
                className="absolute top-0 bottom-0"
                style={{ [alignment === "left" ? "right" : "left"]: 0, background: hex, boxShadow: `0 0 6px ${vgRgba(rgb, 0.5)}`, borderRadius: 2 }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, Math.min(100, r.pct))}%` }}
                transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** Fully-resolved behavioral context. */
interface ResolvedDiscipline {
  score: number
  level: string
  streakDays: number
  revengeRisk: "low" | "medium" | "high"
  consecutiveLosses: number
  stopsRespectedPct: number
  plansFollowedPct: number
  sizingHeldPct: number
  patiencePct: number
  bestStreakDays: number
  tiltIndex: number
}

export function DisciplinePulseGadget(props: {
  data: DisciplinePulseData
  alignment: GadgetAlignment
  accent: ThemeAccent
  priority?: boolean
  priorityLabel?: string
}) {
  const { data, alignment, accent, priority, priorityLabel } = props

  /* ── Resolve / synthesise the full behavioral context ────────────────
   *  Deterministic from the required fields. The discipline score anchors
   *  the adherence percentages (a disciplined trader respects stops &
   *  plans); the tilt index is driven by revenge risk + loss streak. */
  const d: ResolvedDiscipline = useMemo(() => {
    const s = data.score
    const seed = Math.abs(s * 7 + data.streakDays * 3 + data.consecutiveLosses * 11) || 1
    const jit = (n: number, spread: number) => n + ((seed % (spread * 2 + 1)) - spread)
    const stopsRespectedPct = data.stopsRespectedPct ?? Math.max(0, Math.min(100, jit(s + 6, 4)))
    const plansFollowedPct  = data.plansFollowedPct  ?? Math.max(0, Math.min(100, jit(s, 5)))
    const sizingHeldPct     = data.sizingHeldPct     ?? Math.max(0, Math.min(100, jit(s - 4, 5)))
    const patiencePct       = data.patiencePct       ?? Math.max(0, Math.min(100, jit(s - 8, 6)))
    const bestStreakDays    = data.bestStreakDays    ?? Math.max(data.streakDays, data.streakDays + 5 + (seed % 9))
    const baseTilt =
      data.revengeRisk === "high"   ? 74 :
      data.revengeRisk === "medium" ? 46 : 18
    const tiltIndex = data.tiltIndex ?? Math.max(0, Math.min(100, baseTilt + data.consecutiveLosses * 6 - Math.max(0, s - 70) * 0.4))
    return {
      score: s, level: data.level, streakDays: data.streakDays,
      revengeRisk: data.revengeRisk, consecutiveLosses: data.consecutiveLosses,
      stopsRespectedPct, plansFollowedPct, sizingHeldPct, patiencePct,
      bestStreakDays, tiltIndex,
    }
  }, [data])

  const ringValue = useCountUp(d.score, { durationMs: 1400 })
  const levelColor =
    d.score >= 75 ? CARTOUCHE_GREEN :
    d.score >= 60 ? accent.hex :
    d.score >= 40 ? "#f5b86c" :
                    CARTOUCHE_RED
  const zoneIdx =
    d.revengeRisk === "high"   ? 2 :
    d.revengeRisk === "medium" ? 1 : 0
  const riskPct =
    d.revengeRisk === "high"   ? 0.85 :
    d.revengeRisk === "medium" ? 0.5 : 0.15
  const tilt = tiltTint(d.tiltIndex, accent)
  const tiltWord = d.tiltIndex >= 66 ? "Heated" : d.tiltIndex >= 38 ? "Warming" : "Composed"

  const renderFront = () => (
    <LivingGadget
      name="discipline-pulse"
      label="Discipline Pulse"
      alignment={alignment}
      size="m"
      accent={accent}
      priority={priority}
      priorityLabel={priorityLabel}
      transition="pulse-flash"
      baseInterval={5400}
      minHeight={92}
      faces={[
        /* ── Face D.1 · PULSE (ring) ───────────────────────────────────── */
        {
          id: "ring", label: "Discipline Ring", intervalMs: 5400,
          render: () => (
            <div className="flex items-center gap-3" style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}>
              <MicroRing value={ringValue} size={48} accent={accent} />
              <div>
                <GadgetEyebrow alignment={alignment} accent={accent}>Discipline</GadgetEyebrow>
                <div className="font-sans" style={{ fontSize: 13, color: levelColor, fontWeight: 500, textShadow: `0 0 6px ${levelColor}55` }}>
                  {d.level}
                </div>
                <div style={{ marginTop: 4, display: "flex", justifyContent: alignment === "left" ? "flex-end" : "flex-start" }}>
                  <HeartbeatStrip accent={accent} />
                </div>
              </div>
            </div>
          ),
        },

        /* ── Face D.2 · STREAK ─────────────────────────────────────────── */
        {
          id: "streak", label: "Discipline Streak", intervalMs: 5700,
          render: () => (
            <div>
              <div className="flex items-baseline justify-between" style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}>
                <GadgetEyebrow alignment={alignment} accent={accent}>Discipline Streak</GadgetEyebrow>
                <GadgetBig alignment={alignment} accent={accent} size={18}>{d.streakDays} DAYS</GadgetBig>
              </div>
              <div className="flex gap-1 mt-1.5" style={{ justifyContent: alignment === "left" ? "flex-end" : "flex-start" }}>
                {Array.from({ length: Math.min(d.streakDays, 12) }, (_, i) => {
                  const isToday = i === Math.min(d.streakDays, 12) - 1
                  const h = 6 + (i / 11) * 12
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={isToday ? { opacity: 1, scaleY: 1, height: [h, h + 1, h] } : { opacity: 1, scaleY: 1 }}
                      transition={
                        isToday
                          ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                          : { duration: 0.4, delay: i * 0.04, ease: [0.22, 0.61, 0.36, 1] }
                      }
                      style={{
                        width: 4,
                        height: h,
                        background: isToday ? accent.hex : vgRgba(accent.rgb, 0.45),
                        borderRadius: 1,
                        boxShadow: isToday ? `0 0 6px ${vgRgba(accent.rgb, 0.6)}` : "none",
                        transformOrigin: "bottom",
                      }}
                    />
                  )
                })}
              </div>
              <GadgetSub alignment={alignment}>Best on record · {d.bestStreakDays} days</GadgetSub>
            </div>
          ),
        },

        /* ── Face D.3 · REVENGE RISK (gauge) ───────────────────────────── */
        {
          id: "risk", label: "Revenge Risk", intervalMs: 4700,
          render: () => (
            <div className="flex items-center gap-3" style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}>
              <GaugeArc pct={riskPct} accent={accent} zoneIndex={zoneIdx} />
              <div>
                <GadgetEyebrow alignment={alignment} accent={accent}>Revenge Risk</GadgetEyebrow>
                <div className="font-sans uppercase" style={{
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  color: zoneIdx === 2 ? CARTOUCHE_RED : zoneIdx === 1 ? "#f5b86c" : CARTOUCHE_GREEN,
                }}>
                  {d.revengeRisk}
                </div>
                <GadgetSub alignment={alignment}>
                  {d.consecutiveLosses === 0 ? "0 losses · No tilt" : `${d.consecutiveLosses} loss${d.consecutiveLosses === 1 ? "" : "es"} · watch closely`}
                </GadgetSub>
              </div>
            </div>
          ),
        },

        /* ── Face D.4 · EMOTIONAL TEMP (composure) ─────────────────────── */
        {
          id: "composure", label: "Emotional Temp", intervalMs: 5100,
          render: () => (
            <div className="flex items-center gap-3" style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}>
              <TiltMeter tiltIndex={d.tiltIndex} accent={accent} />
              <div style={{ flex: 1 }}>
                <GadgetEyebrow alignment={alignment} accent={accent}>Emotional Temp</GadgetEyebrow>
                <div className="font-sans uppercase" style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", color: tilt.hex, textShadow: `0 0 6px ${vgRgba(tilt.rgb, 0.45)}` }}>
                  {tiltWord}
                </div>
                <div style={{ marginTop: 4, display: "flex", justifyContent: alignment === "left" ? "flex-end" : "flex-start" }}>
                  <ComposureWave tiltIndex={d.tiltIndex} accent={accent} width={116} height={20} />
                </div>
              </div>
            </div>
          ),
        },

        /* ── Face D.5 · ADHERENCE ──────────────────────────────────────── */
        {
          id: "adherence", label: "Rule Adherence", intervalMs: 5900,
          render: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <GadgetEyebrow alignment={alignment} accent={accent}>Rule Adherence · 7D</GadgetEyebrow>
              <AdherenceList
                accent={accent}
                alignment={alignment}
                rows={[
                  { label: "Stops Respected", pct: d.stopsRespectedPct },
                  { label: "Plan Followed",   pct: d.plansFollowedPct },
                  { label: "Sizing Held",     pct: d.sizingHeldPct },
                ]}
              />
            </div>
          ),
        },
      ]}
    />
  )

  return (
    <HoverFlip
      ariaLabel="Discipline Pulse · flip for Behavioral Ledger"
      accent={accent}
      touchChevronSide={alignment === "left" ? "right" : "left"}
      front={renderFront}
      back={() => (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 2 }}>
          <div
            className="flex items-center justify-between"
            style={{ flexDirection: alignment === "left" ? "row-reverse" : "row", marginBottom: 1 }}
          >
            <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.22em", color: vgRgba(accent.rgb, 0.85) }}>
              Behavioral Ledger
            </span>
            <span className="inline-flex items-center" style={{ gap: 5 }}>
              <span className="rounded-full" style={{ width: 6, height: 6, background: tilt.hex, boxShadow: `0 0 6px ${vgRgba(tilt.rgb, 0.7)}` }} />
              <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.16em", color: tilt.hex }}>{tiltWord}</span>
            </span>
          </div>
          <AdherenceList
            accent={accent}
            alignment={alignment}
            rows={[
              { label: "Stops Respected", pct: d.stopsRespectedPct },
              { label: "Plan Followed",   pct: d.plansFollowedPct },
              { label: "Sizing Held",     pct: d.sizingHeldPct },
              { label: "Entry Patience",  pct: d.patiencePct },
            ]}
          />
        </div>
      )}
    />
  )
}

/* ════════════════════════════════════════════════════════════════════════
   GADGET E · equity-beacon-live (M, 3 faces, chart-morph)
   ════════════════════════════════════════════════════════════════════════ */

export interface EquityBeaconData {
  totalEquity:  number
  mtdPct:       number
  mtdAmount:    number
  curve:        readonly number[]   // 30-day equity series
  daily14d:     readonly number[]   // 14-day daily P&L
  todayPnL:     number
}

export function EquityBeaconLiveGadget(props: {
  data: EquityBeaconData
  alignment: GadgetAlignment
  accent: ThemeAccent
  priority?: boolean
  priorityLabel?: string
}) {
  const { data, alignment, accent, priority, priorityLabel } = props
  const equityCount = useCountUp(data.totalEquity, { durationMs: 1400 })
  const flickerEquity = useNumberJitter(Math.round(equityCount), { range: 2, intervalMs: 2600 })
  const greenDays = data.daily14d.filter((d) => d > 0).length
  const redDays   = data.daily14d.filter((d) => d < 0).length

  return (
    <LivingGadget
      name="equity-beacon-live"
      label="Equity Beacon"
      alignment={alignment}
      size="m"
      accent={accent}
      priority={priority}
      priorityLabel={priorityLabel}
      transition="chart-morph"
      baseInterval={5400}
      faces={[
        /* ── Face E.1 · EQUITY ─────────────────────────────────────────── */
        {
          id: "equity", label: "Equity", intervalMs: 5700,
          render: () => (
            <div>
              <div className="flex items-baseline justify-between" style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}>
                <GadgetEyebrow alignment={alignment} accent={accent}>Equity</GadgetEyebrow>
                <GadgetBig alignment={alignment} accent={accent} size={22}>${flickerEquity.toLocaleString("en-US")}</GadgetBig>
              </div>
              <GadgetSub alignment={alignment}>
                +{data.mtdPct.toFixed(1)}% MTD · {fmtSignedUSD(data.mtdAmount)}
              </GadgetSub>
              <div className="mt-1">
                <TinySparkline data={data.curve} width={150} height={20} accent={accent} />
              </div>
            </div>
          ),
        },

        /* ── Face E.2 · CURVE ──────────────────────────────────────────── */
        {
          id: "curve", label: "30D Curve", intervalMs: 5400,
          render: () => {
            const peak  = Math.max(...data.curve)
            const start = data.curve[0]
            const today = data.curve[data.curve.length - 1]
            return (
              <div>
                <GadgetEyebrow alignment={alignment} accent={accent}>Equity · 30D</GadgetEyebrow>
                <div className="mt-1">
                  <TinySparkline data={data.curve} width={150} height={34} accent={accent} />
                </div>
                <div className="font-mono tabular-nums flex justify-between" style={{ fontSize: 9.5, color: VG_VT.paperDim }}>
                  <span>30d ago ${start.toLocaleString("en-US")}</span>
                  <span style={{ color: accent.hex }}>today ${today.toLocaleString("en-US")}</span>
                </div>
              </div>
            )
          },
        },

        /* ── Face E.3 · DAILY ──────────────────────────────────────────── */
        {
          id: "daily", label: "Daily P&L", intervalMs: 4700,
          render: () => (
            <div>
              <div className="flex items-baseline justify-between" style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}>
                <GadgetEyebrow alignment={alignment} accent={accent}>Daily P&L · 14D</GadgetEyebrow>
                <span className="font-mono tabular-nums" style={{ fontSize: 10, color: data.todayPnL >= 0 ? CARTOUCHE_GREEN : CARTOUCHE_RED }}>
                  {fmtSignedUSD(data.todayPnL)} today
                </span>
              </div>
              <div className="mt-1" style={{ display: "flex", justifyContent: alignment === "left" ? "flex-end" : "flex-start" }}>
                <MiniBars data={data.daily14d} width={140} height={28} accent={accent} />
              </div>
              <GadgetSub alignment={alignment}>
                <span style={{ color: CARTOUCHE_GREEN }}>{greenDays} green</span>
                <span style={{ opacity: 0.5 }}> · </span>
                <span style={{ color: CARTOUCHE_RED }}>{redDays} red</span>
              </GadgetSub>
            </div>
          ),
        },
      ]}
    />
  )
}

/* ════════════════════════════════════════════════════════════════════════
   GADGET F · firm-identity (S, 3 faces, card-flip-3d)
   ════════════════════════════════════════════════════════════════════════ */

export interface FirmIdentityData {
  firmShort:    string
  phaseLabel:   string         // "PHASE 2 / 2 · DAY 47"
  daysLeft:     number
  phaseEndsAt:  Date | number
  profitPct:    number         // 0..100
  profitAmount: number
  profitTarget: number

  /* ── Optional richer challenge context. When omitted, the gadget
   *  synthesises them deterministically from the required fields so the
   *  existing call site keeps working untouched (same pattern as
   *  Management Pulse). All money values are USD. ── */
  /** Full firm name, e.g. "FTMO Swing 50K". Falls back to firmShort. */
  firmFull?:        string
  /** Funded-account / challenge size, e.g. 50000. */
  accountSize?:     number
  /** 1-based current phase index and total phases (e.g. 2 of 2). */
  phaseIndex?:      number
  phaseTotal?:      number
  /** Daily-loss limit and how much of it today's drawdown has consumed. */
  dailyLossLimit?:  number
  dailyLossUsed?:   number
  /** Overall max-drawdown limit and current drawdown from peak. */
  maxDrawdown?:     number
  maxDrawdownUsed?: number
  /** Minimum trading days the firm requires, and how many are logged. */
  minTradingDays?:  number
  tradingDaysDone?: number
  /** Profit split the trader keeps once funded (0..1, e.g. 0.90). */
  payoutSplit?:     number
}

/* ────────────────────────────────────────────────────────────────────────
   Firm-Identity anatomy · bespoke sub-atoms
   ────────────────────────────────────────────────────────────────────────
   These exist only for this gadget — they encode the *prop-firm mental
   model* (phase ladder, target thermometer, guardrail proximity, payout
   split) in a way the generic primitives don't. Each one is theme-accent
   driven, tabular, and reduced-motion safe.
   ──────────────────────────────────────────────────────────────────────── */

/** Resolve the proximity tint for a guardrail: the closer `usedPct` gets
 *  to the limit, the hotter the colour. Green (safe) → amber (caution) →
 *  red (danger). Returned as {hex, rgb} for shadows. */
function guardrailTint(usedPct: number, accent: ThemeAccent): { hex: string; rgb: string } {
  if (usedPct >= 0.85) return { hex: CARTOUCHE_RED, rgb: "255,92,109" }
  if (usedPct >= 0.6)  return { hex: "#f5b86c", rgb: "245,184,108" }
  return { hex: accent.hex, rgb: accent.rgb }
}

/** Phase ladder — one pip per phase, the active phase filled + glowing,
 *  passed phases solid-dim, future phases hollow. Reads left→right as the
 *  trader's journey toward funded. */
function PhasePips({
  phaseIndex, phaseTotal, accent, alignment,
}: {
  phaseIndex: number
  phaseTotal: number
  accent: ThemeAccent
  alignment: GadgetAlignment
}) {
  const pips = Array.from({ length: Math.max(1, phaseTotal) }, (_, i) => i + 1)
  return (
    <div
      className="flex items-center gap-1"
      style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}
      aria-hidden
    >
      {pips.map((p) => {
        const passed = p < phaseIndex
        const active = p === phaseIndex
        return (
          <motion.span
            key={p}
            className="rounded-full"
            style={{
              width: active ? 16 : 7,
              height: 5,
              background: active
                ? accent.hex
                : passed
                  ? vgRgba(accent.rgb, 0.45)
                  : vgRgba(accent.rgb, 0.12),
              boxShadow: active ? `0 0 8px ${vgRgba(accent.rgb, 0.6)}` : "none",
            }}
            initial={{ opacity: 0.7 }}
            animate={active ? { opacity: [0.7, 1, 0.7] } : { opacity: 0.7 }}
            transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut" }}
          />
        )
      })}
    </div>
  )
}

/** Profit-target thermometer — a fill bar with milestone ticks at 25/50/
 *  75/100%. The fill glows; once a milestone is cleared its tick lights
 *  up. The 100% tick is the payout line and pulses gold when reached. */
function ProfitLadder({
  pct, accent, alignment, width = 132,
}: {
  pct: number
  accent: ThemeAccent
  alignment: GadgetAlignment
  width?: number
}) {
  const reduced = useReducedMotion()
  const clamped = Math.max(0, Math.min(100, pct))
  const height = 7
  const milestones = [25, 50, 75, 100]
  return (
    <div
      className="relative"
      style={{
        width,
        height,
        borderRadius: height / 2,
        background: vgRgba(accent.rgb, 0.08),
        overflow: "hidden",
        direction: alignment === "left" ? "rtl" : "ltr",
      }}
    >
      {/* fill */}
      <motion.div
        className="absolute top-0 bottom-0"
        style={{
          [alignment === "left" ? "right" : "left"]: 0,
          background: `linear-gradient(90deg, ${vgRgba(accent.rgb, 0.45)} 0%, ${accent.hex} 100%)`,
          borderRadius: height / 2,
          boxShadow: `0 0 10px ${vgRgba(accent.rgb, 0.5)}`,
        }}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={reduced ? { duration: 0 } : { duration: 1.2, ease: [0.22, 0.61, 0.36, 1] }}
      />
      {/* milestone ticks */}
      {milestones.map((m) => {
        const cleared = clamped >= m
        const isPayout = m === 100
        return (
          <span
            key={m}
            className="absolute top-0 bottom-0"
            style={{
              [alignment === "left" ? "right" : "left"]: `calc(${m}% - 0.5px)`,
              width: 1,
              background: cleared
                ? (isPayout ? "rgb(255,200,80)" : vgRgba("255,255,255", 0.55))
                : vgRgba("255,255,255", 0.14),
              boxShadow: cleared && isPayout ? "0 0 6px rgba(255,200,80,0.8)" : "none",
            }}
          />
        )
      })}
    </div>
  )
}

/** Guardrail proximity bar — shows how close the trader is to breaching a
 *  firm limit. Fills from the inner edge, tinted by `guardrailTint`. The
 *  bar pulses faster as it approaches the breach line. */
function GuardrailBar({
  label, usedPct, accent, alignment, detail,
}: {
  label: string
  usedPct: number
  accent: ThemeAccent
  alignment: GadgetAlignment
  detail: string
}) {
  const reduced = useReducedMotion()
  const clamped = Math.max(0, Math.min(1, usedPct))
  const tint = guardrailTint(clamped, accent)
  const hot = clamped >= 0.85
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div
        className="flex items-baseline justify-between"
        style={{ flexDirection: alignment === "left" ? "row-reverse" : "row", gap: 8 }}
      >
        <span
          className="font-mono uppercase"
          style={{ fontSize: 8.5, letterSpacing: "0.18em", color: VG_VT.ashSoft }}
        >
          {label}
        </span>
        <span
          className="font-mono tabular-nums"
          style={{ fontSize: 9, color: tint.hex, textShadow: `0 0 6px ${vgRgba(tint.rgb, 0.4)}` }}
        >
          {detail}
        </span>
      </div>
      <div
        className="relative"
        style={{
          width: "100%",
          height: 4,
          borderRadius: 2,
          background: vgRgba(accent.rgb, 0.08),
          overflow: "hidden",
          direction: alignment === "left" ? "rtl" : "ltr",
        }}
      >
        <motion.div
          className="absolute top-0 bottom-0"
          style={{
            [alignment === "left" ? "right" : "left"]: 0,
            background: tint.hex,
            boxShadow: `0 0 8px ${vgRgba(tint.rgb, 0.55)}`,
            borderRadius: 2,
          }}
          initial={{ width: 0, opacity: 0.7 }}
          animate={
            hot && !reduced
              ? { width: [`${clamped * 100}%`, `${clamped * 100}%`], opacity: [0.7, 1, 0.7] }
              : { width: `${clamped * 100}%`, opacity: 0.7 }
          }
          transition={
            hot && !reduced
              ? { width: { duration: 0.9 }, opacity: { duration: 1.0, repeat: Infinity, ease: "easeInOut" } }
              : { duration: reduced ? 0 : 0.9, ease: [0.22, 0.61, 0.36, 1] }
          }
        />
      </div>
    </div>
  )
}

/** One row of the back-face evaluation dossier. */
function DossierRow({
  label, value, accent, alignment, emphasise = false,
}: {
  label: string
  value: React.ReactNode
  accent: ThemeAccent
  alignment: GadgetAlignment
  emphasise?: boolean
}) {
  return (
    <div
      className="flex items-baseline justify-between"
      style={{ flexDirection: alignment === "left" ? "row-reverse" : "row", gap: 10 }}
    >
      <span
        className="font-mono uppercase"
        style={{ fontSize: 8, letterSpacing: "0.16em", color: VG_VT.ashSoft, whiteSpace: "nowrap" }}
      >
        {label}
      </span>
      <span
        className="font-mono tabular-nums"
        style={{
          fontSize: emphasise ? 10.5 : 9.5,
          color: emphasise ? accent.hex : VG_VT.paper,
          textShadow: emphasise ? `0 0 8px ${vgRgba(accent.rgb, 0.4)}` : "none",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
    </div>
  )
}

/** Back face · EVALUATION DOSSIER — the full firm ruleset as a passport
 *  page. Dense, tabular, scannable. */
function EvaluationDossier({
  d, accent, alignment,
}: {
  d: ResolvedFirm
  accent: ThemeAccent
  alignment: GadgetAlignment
}) {
  const fmtMoney = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 2 }}>
      <div
        className="flex items-center justify-between"
        style={{ flexDirection: alignment === "left" ? "row-reverse" : "row", marginBottom: 1 }}
      >
        <span
          className="font-mono uppercase"
          style={{ fontSize: 8.5, letterSpacing: "0.22em", color: vgRgba(accent.rgb, 0.85) }}
        >
          Evaluation Dossier
        </span>
        <PhasePips phaseIndex={d.phaseIndex} phaseTotal={d.phaseTotal} accent={accent} alignment={alignment} />
      </div>
      <DossierRow label="Account"   value={fmtMoney(d.accountSize)} accent={accent} alignment={alignment} emphasise />
      <DossierRow label="Target"    value={`${fmtMoney(d.profitTarget)} · ${((d.profitTarget / d.accountSize) * 100).toFixed(0)}%`} accent={accent} alignment={alignment} />
      <DossierRow label="Daily Loss" value={`${fmtMoney(d.dailyLossLimit)} · ${((d.dailyLossLimit / d.accountSize) * 100).toFixed(0)}%`} accent={accent} alignment={alignment} />
      <DossierRow label="Max DD"    value={`${fmtMoney(d.maxDrawdown)} · ${((d.maxDrawdown / d.accountSize) * 100).toFixed(0)}%`} accent={accent} alignment={alignment} />
      <DossierRow label="Min Days"  value={`${d.tradingDaysDone} / ${d.minTradingDays}`} accent={accent} alignment={alignment} />
      <DossierRow label="Split"     value={`${(d.payoutSplit * 100).toFixed(0)}%`} accent={accent} alignment={alignment} />
    </div>
  )
}

/** Fully-resolved firm context, with all optional fields synthesised. */
interface ResolvedFirm {
  firmShort:       string
  firmFull:        string
  phaseLabel:      string
  daysLeft:        number
  profitPct:       number
  profitAmount:    number
  profitTarget:    number
  accountSize:     number
  phaseIndex:      number
  phaseTotal:      number
  dailyLossLimit:  number
  dailyLossUsed:   number
  maxDrawdown:     number
  maxDrawdownUsed: number
  minTradingDays:  number
  tradingDaysDone: number
  payoutSplit:     number
}

export function FirmIdentityGadget(props: {
  data: FirmIdentityData
  alignment: GadgetAlignment
  accent: ThemeAccent
  priority?: boolean
  priorityLabel?: string
}) {
  const { data, alignment, accent, priority, priorityLabel } = props
  const countdown = useRealtimeCountdown(data.phaseEndsAt)

  /* ── Resolve / synthesise the full challenge context ─────────────────
   *  Deterministic: derived only from the required fields, so the same
   *  data always yields the same dossier. Keeps the existing call site
   *  (which passes only the 7 core fields) fully functional. */
  const d: ResolvedFirm = useMemo(() => {
    const accountSize    = data.accountSize    ?? 50000
    const profitTarget   = data.profitTarget   || accountSize * 0.10
    const dailyLossLimit = data.dailyLossLimit ?? accountSize * 0.05
    const maxDrawdown    = data.maxDrawdown    ?? accountSize * 0.10
    const minTradingDays = data.minTradingDays ?? 5
    /* Stable seed for synthetic "used" values. */
    const seed = Math.abs(Math.round(data.profitAmount) + data.daysLeft * 7) || 1
    /* Today's daily-loss usage: small, bounded, deterministic. A trader
       up on the day uses little of the limit; we keep it 8–46%. */
    const dailyLossUsed = data.dailyLossUsed ??
      Math.round(dailyLossLimit * (0.08 + (seed % 38) / 100))
    /* Overall drawdown used: inversely related to profit progress —
       more profit banked → further from the floor. 10–55% of the cap. */
    const ddFrac = Math.max(0.1, 0.55 - (data.profitPct / 100) * 0.4)
    const maxDrawdownUsed = data.maxDrawdownUsed ?? Math.round(maxDrawdown * ddFrac)
    /* Trading days logged: assume a 30-day window per phase. */
    const phaseLen = 30
    const tradingDaysDone = data.tradingDaysDone ??
      Math.min(minTradingDays + 4, Math.max(0, phaseLen - data.daysLeft))
    const payoutSplit = data.payoutSplit ?? 0.90
    /* Phase index/total — parse from the label when not provided. */
    const parsedPhase = Number(String(data.phaseLabel).replace(/[^\d]/g, "")) || 1
    const phaseIndex = data.phaseIndex ?? parsedPhase
    const phaseTotal = data.phaseTotal ?? Math.max(phaseIndex, 2)

    return {
      firmShort: data.firmShort,
      firmFull: data.firmFull ?? data.firmShort,
      phaseLabel: data.phaseLabel,
      daysLeft: data.daysLeft,
      profitPct: data.profitPct,
      profitAmount: data.profitAmount,
      profitTarget,
      accountSize,
      phaseIndex,
      phaseTotal,
      dailyLossLimit,
      dailyLossUsed,
      maxDrawdown,
      maxDrawdownUsed,
      minTradingDays,
      tradingDaysDone,
      payoutSplit,
    }
  }, [data])

  /* Count-ups for the headline numerics. */
  const profitCount = useCountUp(Math.round(d.profitPct), { durationMs: 1300 })
  const daysFmt = `${countdown.days}d ${countdown.hours.toString().padStart(2, "0")}h ${countdown.minutes.toString().padStart(2, "0")}m`

  const dailyUsedPct = d.dailyLossUsed / d.dailyLossLimit
  const ddUsedPct    = d.maxDrawdownUsed / d.maxDrawdown
  const daysPct      = Math.min(100, (d.tradingDaysDone / Math.max(1, d.minTradingDays)) * 100)
  const minDaysMet   = d.tradingDaysDone >= d.minTradingDays

  const renderFront = () => (
    <LivingGadget
      name="firm-identity"
      label="Firm Identity"
      alignment={alignment}
      size="s"
      accent={accent}
      priority={priority}
      priorityLabel={priorityLabel}
      transition="vault-roll"
      baseInterval={5400}
      minHeight={88}
      faces={[
        /* ── Face F.1 · PASSPORT ───────────────────────────────────────── */
        {
          id: "passport", label: "Passport", intervalMs: 5700,
          render: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div
                className="flex items-center justify-between"
                style={{ flexDirection: alignment === "left" ? "row-reverse" : "row", gap: 10 }}
              >
                <GadgetEyebrow alignment={alignment} accent={accent}>{d.phaseLabel}</GadgetEyebrow>
                <PhasePips phaseIndex={d.phaseIndex} phaseTotal={d.phaseTotal} accent={accent} alignment={alignment} />
              </div>
              <GadgetBig alignment={alignment} accent={accent} size={16}>{d.firmShort}</GadgetBig>
              <GadgetSub alignment={alignment}>{d.daysLeft} days left in phase</GadgetSub>
            </div>
          ),
        },

        /* ── Face F.2 · COUNTDOWN ──────────────────────────────────────── */
        {
          id: "countdown", label: "Phase Ends In", intervalMs: 5400,
          render: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div
                className="flex items-center justify-between"
                style={{ flexDirection: alignment === "left" ? "row-reverse" : "row", gap: 8 }}
              >
                <GadgetEyebrow alignment={alignment} accent={accent}>Phase Ends In</GadgetEyebrow>
                <span className="inline-flex items-center" style={{ gap: 5 }}>
                  <RidingDot size={5} accent={accent} periodSec={2.6} />
                  <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.18em", color: vgRgba(accent.rgb, 0.7) }}>
                    Live
                  </span>
                </span>
              </div>
              <GadgetBig alignment={alignment} accent={accent} size={16}>{daysFmt}</GadgetBig>
              <GadgetSub alignment={alignment}>
                {minDaysMet ? "Min days met · payout eligible at pass" : `${d.minTradingDays - d.tradingDaysDone} more trading days required`}
              </GadgetSub>
            </div>
          ),
        },

        /* ── Face F.3 · OBJECTIVE (profit target) ──────────────────────── */
        {
          id: "objective", label: "Profit Target", intervalMs: 4700,
          render: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div className="flex items-baseline justify-between" style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}>
                <GadgetEyebrow alignment={alignment} accent={accent}>Profit Target</GadgetEyebrow>
                <GadgetBig alignment={alignment} accent={accent} size={16}>{profitCount.toFixed(0)}%</GadgetBig>
              </div>
              <div style={{ display: "flex", justifyContent: alignment === "left" ? "flex-end" : "flex-start" }}>
                <ProfitLadder pct={d.profitPct} accent={accent} alignment={alignment} />
              </div>
              <GadgetSub alignment={alignment}>
                ${Math.round(d.profitAmount).toLocaleString("en-US")} of ${Math.round(d.profitTarget).toLocaleString("en-US")}
              </GadgetSub>
            </div>
          ),
        },

        /* ── Face F.4 · GUARDRAILS ─────────────────────────────────────── */
        {
          id: "guardrails", label: "Guardrails", intervalMs: 5100,
          render: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <GadgetEyebrow alignment={alignment} accent={accent}>Guardrails · Room Left</GadgetEyebrow>
              <GuardrailBar
                label="Daily Loss"
                usedPct={dailyUsedPct}
                accent={accent}
                alignment={alignment}
                detail={`$${Math.round(d.dailyLossLimit - d.dailyLossUsed).toLocaleString("en-US")} left`}
              />
              <GuardrailBar
                label="Max Drawdown"
                usedPct={ddUsedPct}
                accent={accent}
                alignment={alignment}
                detail={`$${Math.round(d.maxDrawdown - d.maxDrawdownUsed).toLocaleString("en-US")} left`}
              />
            </div>
          ),
        },

        /* ── Face F.5 · CONSISTENCY ────────────────────────────────────── */
        {
          id: "consistency", label: "Consistency", intervalMs: 5900,
          render: () => (
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div className="flex items-baseline justify-between" style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}>
                <GadgetEyebrow alignment={alignment} accent={accent}>Min Trading Days</GadgetEyebrow>
                <GadgetBig alignment={alignment} accent={accent} size={16}>
                  {d.tradingDaysDone}<span style={{ fontSize: 11, color: VG_VT.ashSoft }}> / {d.minTradingDays}</span>
                </GadgetBig>
              </div>
              <div style={{ display: "flex", justifyContent: alignment === "left" ? "flex-end" : "flex-start" }}>
                <ProgressBar pct={daysPct} accent={accent} width={132} height={5} oscillate={false} />
              </div>
              <GadgetSub alignment={alignment}>
                Keeps <span style={{ color: accent.hex }}>{(d.payoutSplit * 100).toFixed(0)}%</span> profit split once funded
              </GadgetSub>
            </div>
          ),
        },
      ]}
    />
  )

  return (
    <HoverFlip
      ariaLabel="Firm Identity · flip for Evaluation Dossier"
      accent={accent}
      touchChevronSide={alignment === "left" ? "right" : "left"}
      front={renderFront}
      back={() => <EvaluationDossier d={d} accent={accent} alignment={alignment} />}
    />
  )
}

/* ════════════════════════════════════════════════════════════════════════
   GADGET G · win-rate-heart (S, 3 faces, heart-beat)
   ════════════════════════════════════════════════════════════════════════ */

export interface WinRateHeartData {
  winRate:      number
  totalTrades:  number
  wins:         number
  losses:       number
  profitFactor: number
  /** Recent R-multiples (mixed signs) — for the PROFIT FACTOR face dots. */
  recentR:      readonly number[]
}

export function WinRateHeartGadget(props: {
  data: WinRateHeartData
  alignment: GadgetAlignment
  accent: ThemeAccent
  priority?: boolean
  priorityLabel?: string
}) {
  const { data, alignment, accent, priority, priorityLabel } = props
  return (
    <LivingGadget
      name="win-rate-heart"
      label="Win Rate Heart"
      alignment={alignment}
      size="s"
      accent={accent}
      priority={priority}
      priorityLabel={priorityLabel}
      transition="heart-beat"
      baseInterval={5400}
      faces={[
        /* ── Face G.1 · WIN RATE ───────────────────────────────────────── */
        {
          id: "winrate", label: "Win Rate", intervalMs: 5700,
          render: () => (
            <div>
              <GadgetEyebrow alignment={alignment} accent={accent}>Win Rate</GadgetEyebrow>
              <motion.div
                animate={{ scale: [1, 1.025, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <GadgetBig alignment={alignment} accent={accent} size={20}>{data.winRate.toFixed(1)}%</GadgetBig>
              </motion.div>
              <GadgetSub alignment={alignment}>
                Last {data.totalTrades} trades
              </GadgetSub>
            </div>
          ),
        },

        /* ── Face G.2 · W / L ──────────────────────────────────────────── */
        {
          id: "wl", label: "Record", intervalMs: 5400,
          render: () => (
            <div>
              <GadgetEyebrow alignment={alignment} accent={accent}>Record</GadgetEyebrow>
              <div className="font-sans tabular-nums" style={{ fontSize: 18, fontWeight: 500, textShadow: `0 0 8px ${vgRgba(accent.rgb, 0.3)}` }}>
                <span style={{ color: CARTOUCHE_GREEN }}>{data.wins}W</span>
                <span style={{ color: VG_VT.paperDim }}> · </span>
                <span style={{ color: CARTOUCHE_RED }}>{data.losses}L</span>
              </div>
              <GadgetSub alignment={alignment}>{data.profitFactor.toFixed(2)} profit factor</GadgetSub>
            </div>
          ),
        },

        /* ── Face G.3 · PROFIT FACTOR ──────────────────────────────────── */
        {
          id: "pf", label: "Profit Factor", intervalMs: 4700,
          render: () => (
            <div>
              <GadgetEyebrow alignment={alignment} accent={accent}>Profit Factor</GadgetEyebrow>
              <GadgetBig alignment={alignment} accent={accent} size={20}>{data.profitFactor.toFixed(2)}</GadgetBig>
              <GadgetSub alignment={alignment}>For every $1 lost · ${data.profitFactor.toFixed(2)} gained</GadgetSub>
              <div style={{ marginTop: 4, display: "flex", gap: 3, justifyContent: alignment === "left" ? "flex-end" : "flex-start" }}>
                {data.recentR.slice(-10).map((r, i) => {
                  const isPos = r >= 0
                  const size = 3 + Math.min(6, Math.abs(r) * 2)
                  return (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -1, 0] }}
                      transition={{ duration: 2.4 + (i % 5) * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.07 }}
                      style={{
                        width: size, height: size,
                        borderRadius: 999,
                        background: isPos ? CARTOUCHE_GREEN : CARTOUCHE_RED,
                        boxShadow: `0 0 4px ${isPos ? "rgba(34,211,163,0.5)" : "rgba(255,92,109,0.5)"}`,
                      }}
                    />
                  )
                })}
              </div>
            </div>
          ),
        },
      ]}
    />
  )
}

/* ════════════════════════════════════════════════════════════════════════
   GADGET H · best-pair (S, 3 faces, pair-swap)
   ════════════════════════════════════════════════════════════════════════ */

export interface BestPairData {
  bestPair:    { name: string; winRate: number }
  worstPair:   { name: string; winRate: number; aiHint?: string }
  bestSetup:   { name: string; winRate: number }

  /* ── Optional roster. When omitted, a deterministic leaderboard is
   *  synthesised from best/worst so the existing call site is untouched. ── */
  roster?: ReadonlyArray<{ name: string; winRate: number; trades: number; netR: number }>
}

interface PairRow { name: string; winRate: number; trades: number; netR: number }

export function BestPairGadget(props: {
  data: BestPairData
  alignment: GadgetAlignment
  accent: ThemeAccent
  priority?: boolean
  priorityLabel?: string
}) {
  const { data, alignment, accent, priority, priorityLabel } = props

  /* Resolve / synthesise the full pair roster — deterministic. */
  const roster: PairRow[] = useMemo(() => {
    if (data.roster && data.roster.length) return [...data.roster]
    const pool = ["EUR/USD", "GBP/JPY", "XAU/USD", "US100", "USD/JPY", "GBP/USD"]
    const seed = Math.abs(Math.round(data.bestPair.winRate * 7 + data.worstPair.winRate * 3)) || 1
    const named = new Set([data.bestPair.name, data.worstPair.name])
    const extras = pool.filter((p) => !named.has(p)).slice(0, 2)
    const mk = (name: string, wr: number, i: number): PairRow => {
      const trades = 6 + ((seed >> i) % 22)
      const netR = +(((wr - 50) / 12) + ((seed % 7) - 3) * 0.15).toFixed(1)
      return { name, winRate: wr, trades, netR }
    }
    const mid = Math.round((data.bestPair.winRate + data.worstPair.winRate) / 2)
    return [
      mk(data.bestPair.name, data.bestPair.winRate, 0),
      mk(extras[0] ?? "XAU/USD", Math.max(data.worstPair.winRate, mid + 4), 1),
      mk(extras[1] ?? "US100", Math.max(data.worstPair.winRate, mid - 2), 2),
      mk(data.worstPair.name, data.worstPair.winRate, 3),
    ]
  }, [data])

  const facePane = (eyebrow: string, name: string, winRate: number, isNegative: boolean) => (
    <div>
      <GadgetEyebrow alignment={alignment} accent={accent}>{eyebrow}</GadgetEyebrow>
      <div className="flex items-baseline justify-between gap-2" style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}>
        <span className="font-sans" style={{ fontSize: 13, color: VG_VT.paper, fontWeight: 500 }}>{name}</span>
        <span className="font-mono tabular-nums" style={{ fontSize: 12, color: isNegative ? CARTOUCHE_RED : accent.hex, textShadow: `0 0 6px ${isNegative ? "rgba(255,92,109,0.45)" : vgRgba(accent.rgb, 0.45)}` }}>
          {winRate.toFixed(0)}%
        </span>
      </div>
      <div className="mt-1.5" style={{ display: "flex", justifyContent: alignment === "left" ? "flex-end" : "flex-start" }}>
        <ProgressBar
          pct={winRate}
          accent={accent}
          width={120}
          height={4}
          fillColor={isNegative ? CARTOUCHE_RED : accent.hex}
        />
      </div>
    </div>
  )

  const renderFront = () => (
    <LivingGadget
      name="best-pair"
      label="Best Pair"
      alignment={alignment}
      size="s"
      accent={accent}
      priority={priority}
      priorityLabel={priorityLabel}
      transition="pair-swap"
      baseInterval={5400}
      faces={[
        { id: "best",  label: "Best On",     intervalMs: 5700, render: () => facePane("Best On",     data.bestPair.name,  data.bestPair.winRate,  false) },
        { id: "avoid", label: "Avoid",       intervalMs: 5400, render: () => facePane("Avoid",       data.worstPair.name, data.worstPair.winRate, true)  },
        { id: "setup", label: "Best Setup",  intervalMs: 4700, render: () => facePane("Best Setup",  data.bestSetup.name, data.bestSetup.winRate, false) },
      ]}
    />
  )

  return (
    <HoverFlip
      ariaLabel="Best Pair · flip for Pair Ledger"
      accent={accent}
      touchChevronSide={alignment === "left" ? "right" : "left"}
      front={renderFront}
      back={() => {
        const rows = [...roster].sort((a, b) => b.winRate - a.winRate)
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 2 }}>
            <div
              className="flex items-center justify-between"
              style={{ flexDirection: alignment === "left" ? "row-reverse" : "row", marginBottom: 1 }}
            >
              <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.22em", color: vgRgba(accent.rgb, 0.85) }}>
                Pair Ledger
              </span>
              <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.12em", color: VG_VT.paperDim }}>
                Win% · Net R
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {rows.map((row, i) => {
                const hex = row.winRate >= 60 ? CARTOUCHE_GREEN : row.winRate >= 50 ? accent.hex : "#f5b86c"
                const rgb = row.winRate >= 60 ? "74,222,128" : row.winRate >= 50 ? accent.rgb : "245,184,108"
                const rPos = row.netR >= 0
                return (
                  <div key={row.name} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <div className="flex items-baseline justify-between" style={{ flexDirection: alignment === "left" ? "row-reverse" : "row", gap: 8 }}>
                      <span className="font-mono uppercase inline-flex items-center" style={{ gap: 4, fontSize: 8.5, letterSpacing: "0.08em", color: i === 0 ? accent.hex : VG_VT.ashSoft }}>
                        {i === 0 && <span aria-hidden style={{ color: accent.hex }}>★</span>}{row.name}
                        <span style={{ color: VG_VT.paperDim, marginLeft: 2 }}>· {row.trades}t</span>
                      </span>
                      <span className="font-mono tabular-nums" style={{ fontSize: 9 }}>
                        <span style={{ color: hex }}>{Math.round(row.winRate)}%</span>
                        <span style={{ color: rPos ? CARTOUCHE_GREEN : CARTOUCHE_RED, marginLeft: 5 }}>{rPos ? "+" : ""}{row.netR.toFixed(1)}R</span>
                      </span>
                    </div>
                    <div className="relative" style={{ width: "100%", height: 3, borderRadius: 2, background: vgRgba(accent.rgb, 0.08), overflow: "hidden", direction: alignment === "left" ? "rtl" : "ltr" }}>
                      <motion.div className="absolute top-0 bottom-0" style={{ [alignment === "left" ? "right" : "left"]: 0, background: hex, borderRadius: 2, boxShadow: `0 0 6px ${vgRgba(rgb, 0.5)}` }}
                        initial={{ width: 0 }} animate={{ width: `${Math.max(0, Math.min(100, row.winRate))}%` }} transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      }}
    />
  )
}

/* ════════════════════════════════════════════════════════════════════════
   GADGET I · macro-pulse (S, 3 faces, countdown-tick)
   ════════════════════════════════════════════════════════════════════════ */

export interface MacroPulseData {
  next:      { event: string; time: string; impact: "high" | "medium" | "low"; currency: string; at: Date | number }
  todays:    readonly MacroEventToday[]
}

export function MacroPulseGadget(props: {
  data: MacroPulseData
  alignment: GadgetAlignment
  accent: ThemeAccent
  priority?: boolean
  priorityLabel?: string
}) {
  const { data, alignment, accent, priority, priorityLabel } = props
  const countdown = useRealtimeCountdown(data.next.at)

  return (
    <LivingGadget
      name="macro-pulse"
      label="Macro Pulse"
      alignment={alignment}
      size="s"
      accent={accent}
      priority={priority}
      priorityLabel={priorityLabel}
      transition="countdown-tick"
      baseInterval={5400}
      faces={[
        /* ── Face I.1 · NEXT ─────────────────────────────────────────────
              Tightened layout: eyebrow on one side, impact dot + currency
              chip on the other; big time value baseline-aligned with a
              live countdown chip ("in 1h 47m") to give the trader the
              "how soon" answer instantly. Sub line carries the event name
              alone — currency now lives in the chip, no duplication. */
        {
          id: "next", label: "Next Event", intervalMs: 5700,
          render: () => {
            /* `useRealtimeCountdown` returns { totalMs, days, hours, minutes,
               seconds, done }. We derive the integer-second remainder for
               the visual countdown chip. */
            const tot = Math.max(0, Math.floor((countdown.totalMs ?? 0) / 1000))
            const h = Math.floor(tot / 3600)
            const m = Math.floor((tot % 3600) / 60)
            const cd = h > 0 ? `${h}h ${m}m` : `${m}m`
            const tightening = tot > 0 && tot < 60 * 60  /* < 1h to event */
            const impactTint = data.next.impact === "high"   ? CARTOUCHE_RED
                             : data.next.impact === "medium" ? "#f5a524"
                             : VG_VT.ashSoft
            const impactRgb  = data.next.impact === "high"   ? "255, 92, 109"
                             : data.next.impact === "medium" ? "245, 165, 36"
                             : "166, 166, 166"
            return (
              <div>
                <div
                  className="flex items-center justify-between"
                  style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}
                >
                  <GadgetEyebrow alignment={alignment} accent={accent}>Next Event</GadgetEyebrow>
                  <span
                    className="font-mono uppercase tabular-nums inline-flex items-center"
                    style={{
                      gap: 4,
                      fontSize: 8.5,
                      letterSpacing: "0.16em",
                      padding: "1px 5px",
                      borderRadius: 999,
                      background: `rgba(${impactRgb}, 0.10)`,
                      border: `1px solid rgba(${impactRgb}, 0.30)`,
                      color: impactTint,
                    }}
                  >
                    <span aria-hidden style={{
                      width: 4, height: 4, borderRadius: 999,
                      background: impactTint,
                      boxShadow: `0 0 4px ${impactTint}`,
                    }}/>
                    {data.next.currency}
                  </span>
                </div>
                <div
                  className="flex items-baseline"
                  style={{
                    gap: 8,
                    flexDirection: alignment === "left" ? "row-reverse" : "row",
                    marginTop: 2,
                  }}
                >
                  <GadgetBig alignment={alignment} accent={accent} size={18}>
                    {data.next.time}
                  </GadgetBig>
                  {tot > 0 && (
                    <motion.span
                      className="font-mono uppercase tabular-nums"
                      initial={{ opacity: 0.7 }}
                      animate={tightening ? { opacity: [0.7, 1, 0.7] } : { opacity: 0.7 }}
                      transition={tightening ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : undefined}
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.14em",
                        color: tightening ? CARTOUCHE_RED : VG_VT.paperDim,
                        padding: "1px 5px",
                        borderRadius: 3,
                        background: tightening
                          ? "rgba(255,92,109,0.08)"
                          : "rgba(255,255,255,0.04)",
                        border: tightening
                          ? "1px solid rgba(255,92,109,0.28)"
                          : "1px solid rgba(255,255,255,0.08)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      in {cd}
                    </motion.span>
                  )}
                </div>
                <GadgetSub alignment={alignment}>{data.next.event}</GadgetSub>
              </div>
            )
          },
        },

        /* ── Face I.2 · TODAY ───────────────────────────��──────────────── */
        {
          id: "today", label: "Events Today", intervalMs: 5400,
          render: () => (
            <div>
              <div className="flex items-baseline justify-between" style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}>
                <GadgetEyebrow alignment={alignment} accent={accent}>Events Today</GadgetEyebrow>
                <GadgetBig alignment={alignment} accent={accent} size={16}>{data.todays.length}</GadgetBig>
              </div>
              <div className="flex flex-col gap-0.5 mt-1" style={{ alignItems: alignment === "left" ? "flex-end" : "flex-start" }}>
                {data.todays.slice(0, 3).map((ev, i) => (
                  <motion.div
                    key={ev.time + ev.event}
                    initial={{ opacity: 0, x: alignment === "left" ? 4 : -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.32, delay: i * 0.06, ease: [0.22, 0.61, 0.36, 1] }}
                    className="flex items-center gap-1.5"
                    style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}
                  >
                    <ImpactDot impact={ev.impact} />
                    <span className="font-mono tabular-nums" style={{ fontSize: 9.5, color: VG_VT.paperDim }}>{ev.time}</span>
                    <span className="font-sans" style={{ fontSize: 10, color: VG_VT.ashSoft, maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.event}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ),
        },

        /* ── Face I.3 · COUNTDOWN ──────────────────────────────────────── */
        {
          id: "countdown", label: "Countdown", intervalMs: 4700,
          render: () => (
            <div>
              <GadgetEyebrow alignment={alignment} accent={accent}>{data.next.event} In</GadgetEyebrow>
              <GadgetBig alignment={alignment} accent={accent} size={16}>
                {countdown.days > 0 && `${countdown.days}d `}
                {countdown.hours.toString().padStart(2, "0")}:{countdown.minutes.toString().padStart(2, "0")}:{countdown.seconds.toString().padStart(2, "0")}
              </GadgetBig>
              <GadgetSub alignment={alignment}>
                <span style={{ color: data.next.impact === "high" ? CARTOUCHE_RED : "#f5b86c" }}>
                  {data.next.impact.toUpperCase()}
                </span>
                <span style={{ opacity: 0.5 }}> · {data.next.currency}</span>
              </GadgetSub>
            </div>
          ),
        },
      ]}
    />
  )
}

/* ══���═════════════════════════════════════════════════════════════════════
   GADGET J · last-5-trades (L, single face — redesigned to user spec)
   ────────────────────────────────────────────────────────────────────────
   Bigger 72×76 chips. NO timeframe. Pair · R-multiple · days-ago stack.
   Halo pulse on most recent. Hover lifts chip + tooltip with timeframe.
   ════════════════════════════════════════════════════════════════════════ */

export interface Last5TradesData {
  trades: readonly RecentTrade[]
}

function TradeChip({
  trade, alignment, accent, isRecent, stagger,
}: {
  trade: RecentTrade
  alignment: GadgetAlignment
  accent: ThemeAccent
  isRecent: boolean
  stagger: number
}) {
  const reducedMotion = useReducedMotion()
  const [hover, setHover] = React.useState(false)
  const isWin = trade.won
  const tint  = isWin ? CARTOUCHE_GREEN : CARTOUCHE_RED
  const tintRgb = isWin ? "34, 211, 163" : "255, 92, 109"
  const arrow = isWin ? "▲" : "▼"
  const big   = Math.abs(trade.rMultiple) >= 1.5

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={`${trade.pair} ${trade.direction} ${trade.rMultiple >= 0 ? "+" : ""}${trade.rMultiple}R, ${trade.recency}`}
      initial={{ opacity: 0, scale: 0.92, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: stagger * 0.05, ease: [0.22, 0.61, 0.36, 1] }}
      whileHover={reducedMotion ? undefined : { y: -2 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative flex flex-col items-center justify-center"
      style={{
        width: 86,
        height: 84,
        borderRadius: 10,
        background: `linear-gradient(180deg, rgba(${tintRgb}, ${hover ? 0.18 : 0.12}) 0%, rgba(${tintRgb}, ${hover ? 0.08 : 0.04}) 100%)`,
        border: `1px solid rgba(${tintRgb}, ${hover ? 0.55 : 0.36})`,
        boxShadow: isRecent
          ? `0 0 0 1px rgba(${tintRgb}, 0.18), 0 0 12px rgba(${tintRgb}, 0.45)`
          : hover ? `0 0 10px rgba(${tintRgb}, 0.35)` : "none",
        cursor: "pointer",
        transition: "border-color 200ms, box-shadow 200ms, background 200ms",
      }}
    >
      {/* Most-recent halo pulse — slow gradient sweep across chip */}
      {isRecent && (
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: 8,
            background: `linear-gradient(120deg, transparent 0%, ${vgRgba(accent.rgb, 0.18)} 50%, transparent 100%)`,
            mixBlendMode: "screen",
          }}
          animate={{ opacity: [0, 0.7, 0], x: [-30, 30, 60] }}
          transition={{ duration: 6.7, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Line 1 · pair */}
      <div
        className="font-sans"
        style={{
          fontSize: 11,
          color: VG_VT.paper,
          letterSpacing: "0.04em",
          fontWeight: 500,
        }}
      >
        {trade.pair}
      </div>

      {/* Line 2 · direction icon + R-multiple.
          Sized down to 13px to read as a "multibillion-dollar-style"
          subtle figure rather than a shouting label. */}
      <div
        className="font-sans tabular-nums"
        style={{
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: tint,
          textShadow: big ? `0 0 6px rgba(${tintRgb}, 0.55)` : `0 0 3px rgba(${tintRgb}, 0.32)`,
          lineHeight: 1.1,
          marginTop: 3,
        }}
      >
        {arrow}{trade.rMultiple >= 0 ? "+" : ""}{trade.rMultiple.toFixed(1)}R
      </div>

      {/* Line 3 · days-ago */}
      <div
        className="font-mono uppercase tabular-nums"
        style={{
          fontSize: 9,
          letterSpacing: "0.14em",
          color: VG_VT.paperDim,
          marginTop: 2,
        }}
      >
        {trade.recency}
      </div>

      {/* Hover tooltip: shows direction + timeframe (timeframe is hidden from
          the chip visually, but surfaced in the tooltip as the user asked
          for it to be retained as data, just not visible). */}
      {hover && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute font-mono uppercase tabular-nums"
          style={{
            top: -22,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 8.5,
            letterSpacing: "0.16em",
            color: accent.hex,
            background: "rgba(8, 12, 16, 0.92)",
            border: `1px solid ${vgRgba(accent.rgb, 0.32)}`,
            padding: "3px 6px",
            borderRadius: 4,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            boxShadow: `0 4px 12px rgba(0,0,0,0.4), 0 0 8px ${vgRgba(accent.rgb, 0.2)}`,
          }}
        >
          {trade.direction.toUpperCase()} · {trade.timeframe}
        </motion.div>
      )}
    </motion.div>
  )
}

/* ─────────────────────────────────────────��──────────────────────────────
   Last5 · WIN MAP back face
   ────────────────────────────────────────────�����──────────────────────────
   The hover-flip diagnostic. Reads as a tight performance autopsy of
   the last 5 closes — same data, denser frame. Anatomy from top:

     · Header     — "WIN MAP · DIAGNOSTIC" eyebrow + signed net R hero
     · WL Strip   — 5 big tinted W/L dots with R underneath each
     · Cum R Curve— cumulative R-multiple curve (draws on mount)
     · Stat Grid  — 2x3 of: best win, worst loss, win rate, profit factor,
                    streak, best pair
   Every cluster gets its own stagger so the back face feels SUITED to the
   front (same motion language) rather than a static popover.
   ──────────────────────────────────────────────────────────────────────── */
function Last5WinMap({
  trades, accent, alignment,
}: {
  trades: readonly RecentTrade[]
  accent: ThemeAccent
  alignment: GadgetAlignment
}) {
  const wins      = trades.filter((t) => t.won).length
  const losses    = trades.length - wins
  const winRate   = trades.length ? (wins / trades.length) * 100 : 0
  const netR      = trades.reduce((s, t) => s + t.rMultiple, 0)
  const winR      = trades.filter((t) => t.won).map((t) => t.rMultiple)
  const lossR     = trades.filter((t) => !t.won).map((t) => t.rMultiple)
  const grossWin  = winR.reduce((s, v) => s + v, 0)
  const grossLoss = Math.abs(lossR.reduce((s, v) => s + v, 0))
  const profitFactor = grossLoss > 0 ? grossWin / grossLoss : grossWin > 0 ? 99 : 0
  const avgWin    = winR.length  ? grossWin / winR.length : 0
  const avgLoss   = lossR.length ? (lossR.reduce((s, v) => s + v, 0) / lossR.length) : 0

  /* Current streak from the MOST RECENT (index 0) back until sign flips. */
  let streak = 0, streakType: "win" | "loss" | "none" = "none"
  if (trades.length > 0) {
    streakType = trades[0].won ? "win" : "loss"
    for (const t of trades) {
      if ((t.won && streakType === "win") || (!t.won && streakType === "loss")) streak++
      else break
    }
  }

  /* Best win & worst loss with pair labels. */
  const bestWin  = trades.filter((t) => t.won).sort((a, b) => b.rMultiple - a.rMultiple)[0]
  const worstLoss = trades.filter((t) => !t.won).sort((a, b) => a.rMultiple - b.rMultiple)[0]

  /* Best pair by R sum. */
  const pairR = new Map<string, number>()
  for (const t of trades) pairR.set(t.pair, (pairR.get(t.pair) ?? 0) + t.rMultiple)
  const bestPair = Array.from(pairR.entries()).sort((a, b) => b[1] - a[1])[0]

  /* Pair distribution (count-weighted) for the bottom rail — proportional
     segment widths with each segment's tint coloured by that pair's net R
     (green if profitable for that pair across the 5, red if net-negative). */
  const pairCount = new Map<string, number>()
  for (const t of trades) pairCount.set(t.pair, (pairCount.get(t.pair) ?? 0) + 1)
  const pairTotal = trades.length || 1
  const pairRail = Array.from(pairCount.entries())
    .map(([pair, count]) => {
      const r = pairR.get(pair) ?? 0
      return { pair, count, share: count / pairTotal, r, isPos: r >= 0 }
    })
    .sort((a, b) => b.share - a.share)

  /* Timeframe mix — dominant TF and its share, used as a tiny header chip. */
  const tfCount = new Map<string, number>()
  for (const t of trades) tfCount.set(t.timeframe, (tfCount.get(t.timeframe) ?? 0) + 1)
  const tfDominant = Array.from(tfCount.entries()).sort((a, b) => b[1] - a[1])[0]
  const tfShare    = tfDominant ? Math.round((tfDominant[1] / pairTotal) * 100) : 0

  /* Cumulative R curve from oldest → newest. data.trades is newest-first
     in source, so we reverse for chronological walk. */
  const chrono = [...trades].reverse()
  const cumR: number[] = []
  let running = 0
  for (const t of chrono) { running += t.rMultiple; cumR.push(running) }
  /* Prepend a zero point so the curve grows OUT from origin instead of
     starting at the first trade's R. */
  cumR.unshift(0)

  /* For the WL strip, render the 5 dots in inside-out order (most recent
     toward inner side). */
  const wlOrder = alignment === "left" ? [...trades].reverse() : trades

  const netIsPos = netR >= 0

  return (
    <div className="w-full" style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
      {/* ── Header row ────────────────────────────────────────────────── */}
      <div className="flex items-baseline justify-between" style={{
        flexDirection: alignment === "left" ? "row-reverse" : "row", gap: 8,
      }}>
        <div className="flex items-center" style={{
          gap: 6,
          flexDirection: alignment === "left" ? "row-reverse" : "row",
        }}>
          <GadgetEyebrow alignment={alignment} accent={accent}>
            Win Map · Diagnostic
          </GadgetEyebrow>
          {/* Timeframe-mix chip — dominant TF and its share. Small caps,
             accent-tinted, sits inline with the eyebrow so the user reads
             "this is mostly H1 data" at a glance. */}
          {tfDominant && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.26, delay: 0.10, ease: [0.22, 0.61, 0.36, 1] }}
              className="font-mono uppercase tabular-nums inline-flex items-center"
              style={{
                fontSize: 7.5, letterSpacing: "0.16em",
                gap: 4, padding: "1px 5px",
                background: `rgba(${accent.rgb}, 0.08)`,
                color: accent.hex,
                borderRadius: 3,
                border: `1px solid rgba(${accent.rgb}, 0.22)`,
              }}
            >
              <span>{tfDominant[0]}</span>
              <span style={{ opacity: 0.55 }}>·</span>
              <span>{tfShare}%</span>
            </motion.span>
          )}
        </div>
        <div className="flex items-baseline" style={{
          gap: 8, flexDirection: alignment === "left" ? "row-reverse" : "row",
        }}>
          <span className="font-sans tabular-nums" style={{
            fontSize: 18, fontWeight: 500, letterSpacing: "-0.015em",
            color: netIsPos ? CARTOUCHE_GREEN : CARTOUCHE_RED,
            textShadow: `0 0 10px ${netIsPos ? "rgba(34,211,163,0.5)" : "rgba(255,92,109,0.5)"}`,
          }}>
            {netR >= 0 ? "+" : ""}{netR.toFixed(1)}R
          </span>
          <span className="font-mono uppercase tabular-nums" style={{
            fontSize: 9, letterSpacing: "0.18em", color: VG_VT.ashSoft,
          }}>
            {winRate.toFixed(0)}% WIN
          </span>
        </div>
      </div>

      {/* ── W/L pattern dots ─────────────────────────────────────────── */}
      <div
        className="flex"
        style={{
          gap: 6,
          justifyContent: alignment === "left" ? "flex-end" : "flex-start",
        }}
      >
        {wlOrder.map((t, i) => {
          const isWin = t.won
          const tint = isWin ? CARTOUCHE_GREEN : CARTOUCHE_RED
          const tintRgb = isWin ? "34, 211, 163" : "255, 92, 109"
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.32, delay: i * 0.06, ease: [0.22, 0.61, 0.36, 1] }}
              className="flex flex-col items-center"
              style={{ minWidth: 36 }}
            >
              <div
                className="font-sans tabular-nums"
                style={{
                  fontSize: 14, fontWeight: 600, lineHeight: 1,
                  color: tint, textShadow: `0 0 6px rgba(${tintRgb}, 0.5)`,
                }}
              >
                {isWin ? "▲" : "▼"}
              </div>
              <div
                className="font-mono tabular-nums"
                style={{
                  fontSize: 9, marginTop: 2,
                  color: tint, letterSpacing: "-0.01em",
                }}
              >
                {t.rMultiple >= 0 ? "+" : ""}{t.rMultiple.toFixed(1)}
              </div>
              <div
                className="font-mono uppercase tabular-nums"
                style={{
                  fontSize: 7.5, marginTop: 1,
                  color: VG_VT.ashSoft, letterSpacing: "0.12em",
                }}
              >
                {t.pair.slice(0, 6)}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ── Cumulative R curve ───────────────────────────────────────── */}
      <CurveCanvas data={cumR} accent={accent} height={26} />

      {/* ── 2×3 stat grid ────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
        <Stat
          label="Best win"
          value={bestWin ? `+${bestWin.rMultiple.toFixed(1)}R` : "—"}
          sub={bestWin?.pair ?? "—"}
          tint={CARTOUCHE_GREEN}
          delay={0.30}
        />
        <Stat
          label="Worst loss"
          value={worstLoss ? `${worstLoss.rMultiple.toFixed(1)}R` : "—"}
          sub={worstLoss?.pair ?? "—"}
          tint={CARTOUCHE_RED}
          delay={0.36}
        />
        <Stat
          label="Streak"
          value={streak ? String(streak) : "0"}
          sub={streakType === "win" ? "consecutive wins" : streakType === "loss" ? "consecutive losses" : "—"}
          tint={streakType === "win" ? CARTOUCHE_GREEN : streakType === "loss" ? CARTOUCHE_RED : VG_VT.paperDim}
          delay={0.42}
        />
        <Stat
          label="Profit factor"
          value={profitFactor >= 99 ? "∞" : profitFactor.toFixed(2)}
          sub={`${grossWin.toFixed(1)}R / ${grossLoss.toFixed(1)}R`}
          tint={profitFactor >= 1 ? accent.hex : CARTOUCHE_RED}
          delay={0.48}
        />
        <Stat
          label="Avg win"
          value={`${avgWin.toFixed(1)}R`}
          sub={`${winR.length} wins`}
          tint={CARTOUCHE_GREEN}
          delay={0.54}
        />
        <Stat
          label="Best pair"
          value={bestPair?.[0] ?? "—"}
          sub={bestPair ? `${bestPair[1] >= 0 ? "+" : ""}${bestPair[1].toFixed(1)}R` : "—"}
          tint={accent.hex}
          delay={0.60}
        />
      </div>

      {/* ── Pair distribution rail ──────────────────────────────────────
            Horizontal bar split proportionally by pair frequency. Each
            segment is tinted green when that pair is net-positive across
            these 5 trades and red when negative — so the rail reads as
            both volume AND quality at once. Labels in 7.5px mono below
            for any segment ≥ 20% (small segments stay anonymous to keep
            the rail clean). ───────────────────────────────────────────── */}
      {pairRail.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, delay: 0.66, ease: [0.22, 0.61, 0.36, 1] }}
          style={{ marginTop: 2 }}
        >
          {/* Eyebrow */}
          <div className="font-mono uppercase" style={{
            fontSize: 7, letterSpacing: "0.20em",
            color: VG_VT.ashSoft, lineHeight: 1,
            marginBottom: 3,
            textAlign: alignment === "left" ? "right" : "left",
          }}>
            Pair Mix
          </div>
          {/* The rail itself */}
          <div
            role="img"
            aria-label={
              "Pair distribution: " +
              pairRail.map((p) => `${p.pair} ${(p.share * 100).toFixed(0)} percent`).join(", ")
            }
            style={{
              display: "flex",
              flexDirection: alignment === "left" ? "row-reverse" : "row",
              height: 4,
              width: "100%",
              borderRadius: 2,
              overflow: "hidden",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {pairRail.map((p, i) => {
              const tint    = p.isPos ? CARTOUCHE_GREEN : CARTOUCHE_RED
              const tintRgb = p.isPos ? "34, 211, 163" : "255, 92, 109"
              return (
                <motion.div
                  key={p.pair}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.42, delay: 0.72 + i * 0.05, ease: [0.22, 0.61, 0.36, 1] }}
                  style={{
                    flex: `${p.share} 0 0`,
                    background: `linear-gradient(180deg, rgba(${tintRgb},0.85), rgba(${tintRgb},0.55))`,
                    borderRight: i < pairRail.length - 1 ? "1px solid rgba(0,0,0,0.42)" : "none",
                    transformOrigin: alignment === "left" ? "right center" : "left center",
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.18)`,
                  }}
                  title={`${p.pair} · ${(p.share * 100).toFixed(0)}% · ${p.r >= 0 ? "+" : ""}${p.r.toFixed(1)}R`}
                />
              )
            })}
          </div>
          {/* Labels — only show pairs that occupy ≥ 20% of the rail so the
             label row stays sparse and legible at this scale. */}
          <div
            className="flex"
            style={{
              flexDirection: alignment === "left" ? "row-reverse" : "row",
              marginTop: 3,
              gap: 0,
            }}
          >
            {pairRail.map((p) => (
              <div
                key={`lbl-${p.pair}`}
                className="font-mono uppercase tabular-nums"
                style={{
                  flex: `${p.share} 0 0`,
                  fontSize: 7.5,
                  letterSpacing: "0.10em",
                  color: VG_VT.paperDim,
                  minWidth: 0,
                  textAlign: alignment === "left" ? "right" : "left",
                  paddingLeft:  alignment === "left" ? 0 : 2,
                  paddingRight: alignment === "left" ? 2 : 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "clip",
                  opacity: p.share >= 0.20 ? 1 : 0,
                }}
              >
                {p.pair.replace("/", "")}
                <span style={{ opacity: 0.55 }}>{" · "}</span>
                <span style={{ color: p.isPos ? CARTOUCHE_GREEN : CARTOUCHE_RED }}>
                  {(p.share * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

/** Single stat block used inside the Win Map back face. */
function Stat({
  label, value, sub, tint, delay = 0,
}: {
  label: string; value: string; sub: string; tint: string; delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay, ease: [0.22, 0.61, 0.36, 1] }}
      style={{ minWidth: 0 }}
    >
      <div className="font-mono uppercase" style={{
        fontSize: 7.5, letterSpacing: "0.18em",
        color: VG_VT.ashSoft, lineHeight: 1,
      }}>
        {label}
      </div>
      <div className="font-sans tabular-nums" style={{
        fontSize: 13, fontWeight: 500, marginTop: 2,
        color: tint, letterSpacing: "-0.01em", lineHeight: 1.05,
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>
        {value}
      </div>
      <div className="font-mono" style={{
        fontSize: 8, marginTop: 1, color: VG_VT.paperDim,
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>
        {sub}
      </div>
    </motion.div>
  )
}

export function Last5TradesGadget(props: {
  data: Last5TradesData
  alignment: GadgetAlignment
  accent: ThemeAccent
  priority?: boolean
  priorityLabel?: string
}) {
  const { data, alignment, accent, priority, priorityLabel } = props
  const wins   = data.trades.filter((t) => t.won).length
  const losses = data.trades.length - wins
  const netR   = data.trades.reduce((s, t) => s + t.rMultiple, 0)
  /* Right-wing reverses chip order so the most-recent chip sits at the
     INNER edge (toward the headline) — same as the wing's text-alignment
     reads inside-out. */
  const orderedTrades = alignment === "left"
    ? [...data.trades].reverse()
    : data.trades

  const renderFront = () => (
    <LivingGadget
      name="last-5-trades"
      label="Last 5 Trades"
      alignment={alignment}
      size="l"
      accent={accent}
      priority={priority}
      priorityLabel={priorityLabel}
      transition="crossfade"
      baseInterval={9999}        // effectively no rotation (single face)
      faces={[
        {
          id: "trades", label: "Last 5",
          render: () => (
            <div>
              <div className="flex items-baseline justify-between" style={{ flexDirection: alignment === "left" ? "row-reverse" : "row" }}>
                <GadgetEyebrow alignment={alignment} accent={accent}>Last 5 Trades</GadgetEyebrow>
                <div className="font-mono tabular-nums" style={{ fontSize: 10, color: VG_VT.paperDim, letterSpacing: "0.04em" }}>
                  <span style={{ color: CARTOUCHE_GREEN }}>{wins}W</span>
                  <span style={{ opacity: 0.5 }}> · </span>
                  <span style={{ color: CARTOUCHE_RED }}>{losses}L</span>
                  <span style={{ opacity: 0.5 }}> · </span>
                  <span style={{ color: netR >= 0 ? accent.hex : CARTOUCHE_RED }}>
                    {netR >= 0 ? "+" : ""}{netR.toFixed(1)}R net
                  </span>
                </div>
              </div>
              <div
                className="flex"
                style={{
                  gap: 10,
                  marginTop: 6,
                  justifyContent: alignment === "left" ? "flex-end" : "flex-start",
                }}
              >
                {orderedTrades.map((trade, i) => {
                  /* Most-recent is the first item in the un-reversed list (index 0). */
                  const originalIndex = data.trades.indexOf(trade)
                  return (
                    <TradeChip
                      key={trade.id}
                      trade={trade}
                      alignment={alignment}
                      accent={accent}
                      isRecent={originalIndex === 0}
                      stagger={i}
                    />
                  )
                })}
              </div>
            </div>
          ),
        },
      ]}
    />
  )

  return (
    <HoverFlip
      ariaLabel="Last 5 Trades · flip for Win Map diagnostic"
      accent={accent}
      touchChevronSide={alignment === "left" ? "right" : "left"}
      front={renderFront}
      back={() => (
        <Last5WinMap
          trades={data.trades}
          accent={accent}
          alignment={alignment}
        />
      )}
    />
  )
}
