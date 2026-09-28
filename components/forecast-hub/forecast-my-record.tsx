"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  TrendingUp, TrendingDown, Target, Flame, CheckCircle2, XCircle, Lock,
  ChevronRight, ArrowUpRight, Compass, Award, Crown, Trophy,
  Star, Activity, Sparkles, ScanLine, RefreshCw,
} from "lucide-react"
import type { ForecastItem } from "./forecast-types"
import { VT, amber, slate } from "./forecast-vantary-tokens"

/* ══════════════════════════════════════════════════════════════════════
   RECORD DATA — UNCHANGED. Replace with live computation when wired.
   ══════════════════════════════════════════════════════════════════════ */
type Outcome = "win" | "loss" | "active" | "expired"

interface InstrumentStat {
  name: string
  type: string
  trades: number
  wins: number
  rate: number
  avgRR: string
  trend: "up" | "down" | "flat"
  bestSetup: string
  status: "strong" | "neutral" | "weak"
  edge: number
}

interface MentorReview {
  id: string
  mentor: string
  role: string
  rating: number
  feedback: string
  reviewedAt: string
  highlight: string
}

interface Milestone {
  id: string
  label: string
  detail: string
  progress: number
  target: number
  reward: string
  unlocked: boolean
}

interface RecordData {
  rank: number
  percentile: number
  tier: "novice" | "intermediate" | "advanced" | "expert" | "elite"
  totalForecasts: number
  wins: number
  losses: number
  active: number
  expired: number
  invalidated: number
  winRate: number
  avgRR: string
  edgeScore: number
  currentStreak: number
  bestStreak: number
  worstLoseStreak: number
  avgConfidence: number
  calibration: number
  monthlyTrend: "improving" | "declining" | "stable"
  weeklyDelta: number
  bestInstrument: string
  weakestInstrument: string
  instruments: InstrumentStat[]
  recent30: { id: string; outcome: Outcome; rr: number; date: string; instrument: string }[]
  calibrationBands: { confidence: number; actual: number; samples: number }[]
  mentorReviews: MentorReview[]
  milestones: Milestone[]
}

const SAMPLE_DATA: RecordData = {
  rank: 47,
  percentile: 88,
  tier: "advanced",
  totalForecasts: 142,
  wins: 89,
  losses: 31,
  active: 14,
  expired: 5,
  invalidated: 3,
  winRate: 74.2,
  avgRR: "1:2.4",
  edgeScore: 68,
  currentStreak: 7,
  bestStreak: 14,
  worstLoseStreak: 3,
  avgConfidence: 71,
  calibration: 0.82,
  monthlyTrend: "improving",
  weeklyDelta: 4.2,
  bestInstrument: "EURUSD",
  weakestInstrument: "GBPJPY",
  instruments: [
    { name: "EURUSD", type: "Forex", trades: 38, wins: 31, rate: 81.5, avgRR: "1:2.1", trend: "up", bestSetup: "London Open Reversal", status: "strong", edge: 78 },
    { name: "BTCUSD", type: "Crypto", trades: 24, wins: 18, rate: 75.0, avgRR: "1:2.8", trend: "up", bestSetup: "Range Sweep", status: "strong", edge: 72 },
    { name: "NAS100", type: "Indices", trades: 32, wins: 22, rate: 68.7, avgRR: "1:2.4", trend: "flat", bestSetup: "NY AM Continuation", status: "neutral", edge: 64 },
    { name: "XAUUSD", type: "Commodities", trades: 28, wins: 20, rate: 71.4, avgRR: "1:2.2", trend: "up", bestSetup: "Asian Liquidity Sweep", status: "strong", edge: 69 },
    { name: "GBPJPY", type: "Forex", trades: 20, wins: 11, rate: 55.0, avgRR: "1:1.8", trend: "down", bestSetup: "—", status: "weak", edge: 42 },
  ],
  recent30: Array.from({ length: 30 }, (_, i) => {
    const r = (i * 7919 + 13) % 100
    const outcome: Outcome = r < 65 ? "win" : r < 85 ? "loss" : r < 95 ? "active" : "expired"
    return { id: `f-${i}`, outcome, rr: outcome === "win" ? 1.8 + (r % 30) / 10 : -1.0, date: `D-${30 - i}`, instrument: ["EURUSD", "BTCUSD", "NAS100", "XAUUSD"][r % 4] }
  }),
  calibrationBands: [
    { confidence: 50, actual: 48, samples: 22 },
    { confidence: 60, actual: 58, samples: 31 },
    { confidence: 70, actual: 71, samples: 38 },
    { confidence: 80, actual: 76, samples: 28 },
    { confidence: 90, actual: 82, samples: 14 },
  ],
  mentorReviews: [
    { id: "r1", mentor: "Sarah Kim", role: "Lead Mentor", rating: 5, feedback: "Exceptional structural reads on EURUSD. Conviction calibration is improving steadily.", reviewedAt: "2d ago", highlight: "Top 5% structural awareness" },
    { id: "r2", mentor: "Marcus Rodriguez", role: "Crypto Mentor", rating: 4, feedback: "Strong execution on range sweeps. Watch counter-trend bias on lower timeframes.", reviewedAt: "5d ago", highlight: "Disciplined entries" },
  ],
  milestones: [
    { id: "m1", label: "Centennial", detail: "Submit 100 forecasts", progress: 142, target: 100, reward: "Verified Analyst Badge", unlocked: true },
    { id: "m2", label: "Calibrated Mind", detail: "70%+ win rate over 50 resolved", progress: 74, target: 70, reward: "Calibration Crown", unlocked: true },
    { id: "m3", label: "Streak Sovereign", detail: "Achieve 20-win streak", progress: 14, target: 20, reward: "Flame Sigil", unlocked: false },
    { id: "m4", label: "Edge Elite", detail: "Edge Score 80+", progress: 68, target: 80, reward: "Elite Tier Promotion", unlocked: false },
    { id: "m5", label: "Multi-Asset Mastery", detail: "75%+ across 4 instruments", progress: 3, target: 4, reward: "Mastery Crest", unlocked: false },
  ],
}

const EMPTY_DATA: RecordData = {
  rank: 0, percentile: 0, tier: "novice",
  totalForecasts: 0, wins: 0, losses: 0, active: 0, expired: 0, invalidated: 0,
  winRate: 0, avgRR: "--", edgeScore: 0,
  currentStreak: 0, bestStreak: 0, worstLoseStreak: 0,
  avgConfidence: 0, calibration: 0, monthlyTrend: "stable", weeklyDelta: 0,
  bestInstrument: "—", weakestInstrument: "—",
  instruments: [], recent30: [], calibrationBands: [], mentorReviews: [], milestones: [],
}

const TIER_CONFIG: Record<RecordData["tier"], { label: string; rgb: string; hex: string; icon: typeof Crown }> = {
  novice: { label: "Novice", rgb: VT.slate, hex: VT.paperDim, icon: Compass },
  intermediate: { label: "Intermediate", rgb: VT.blueRgb, hex: VT.blue, icon: Target },
  advanced: { label: "Advanced", rgb: VT.purpleRgb, hex: VT.purple, icon: Award },
  expert: { label: "Expert", rgb: VT.amberRgb, hex: VT.amber, icon: Crown },
  elite: { label: "Elite", rgb: VT.emeraldRgb, hex: VT.emerald, icon: Trophy },
}

interface ForecastMyRecordProps {
  onViewForecast: (forecast: ForecastItem) => void
}

/* ══════════════════════════════════════════════════════════════════════
   ROOT
   ══════════════════════════════════════════════════════════════════════ */
export function ForecastMyRecord({ onViewForecast }: ForecastMyRecordProps) {
  const [timePeriod, setTimePeriod] = useState<"7d" | "30d" | "90d" | "all">("30d")
  const data = SAMPLE_DATA
  const hasData = data.totalForecasts > 0

  return (
    <div className="space-y-5">
      {/* ── Editorial briefing bar ── */}
      <RecordBriefingBar />

      {/* ── Spec headline (3-col composition) ── */}
      <RecordSpecHeadline data={data} hasData={hasData} timePeriod={timePeriod} setTimePeriod={setTimePeriod} />

      {hasData ? <PopulatedRecord data={data} /> : <EmptyRecord />}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   BRIEFING BAR — anchor circle + LIVE pulse + UTC clock
   ══════════════════════════════════════════════════════════════════════ */
function RecordBriefingBar() {
  const [now, setNow] = useState(() => new Date())
  useMemo(() => {
    const id = typeof window !== "undefined" ? window.setInterval(() => setNow(new Date()), 30000) : undefined
    return () => { if (id) clearInterval(id) }
  }, [])
  const utc = `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")} UTC`

  return (
    <div className="flex items-center gap-3 select-none">
      {/* anchor circle */}
      <svg width="6" height="6" viewBox="0 0 6 6" className="flex-shrink-0">
        <circle cx="3" cy="3" r="2.4" fill="none" stroke={amber(0.5)} strokeWidth="0.7" />
      </svg>
      {/* hairline traveler */}
      <div className="h-px w-10" style={{ background: `linear-gradient(90deg, ${amber(0.32)}, transparent)` }} />
      {/* live dot */}
      <motion.div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: VT.amber, boxShadow: `0 0 6px ${amber(0.7)}` }}
        animate={{ scale: [0.85, 1.1, 0.85] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <span
        className="font-mono uppercase"
        style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.amber, fontWeight: 500 }}
      >
        Live · My Record
      </span>
      {/* hairline traveler */}
      <div className="h-px flex-1" style={{ background: VT.rule }} />
      {/* UTC clock */}
      <span
        className="font-mono"
        style={{ fontSize: 9.5, letterSpacing: "0.18em", color: VT.ashSoft, fontVariantNumeric: "tabular-nums" }}
      >
        {utc}
      </span>
      <svg width="6" height="6" viewBox="0 0 6 6" className="flex-shrink-0">
        <circle cx="3" cy="3" r="2.4" fill="none" stroke={amber(0.5)} strokeWidth="0.7" />
      </svg>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   SPEC HEADLINE — 3-col: LEFT ledger | MID protagonist | RIGHT ledger
   ══════════════════════════════════════════════════════════════════════ */
function RecordSpecHeadline({ data, hasData, timePeriod, setTimePeriod }: {
  data: RecordData; hasData: boolean
  timePeriod: "7d" | "30d" | "90d" | "all"
  setTimePeriod: (p: "7d" | "30d" | "90d" | "all") => void
}) {
  const tier = TIER_CONFIG[data.tier]
  const TierIcon = tier.icon

  // protagonist split for "#47" — bold lead, thin glyph
  const rankStr = `#${data.rank}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: VT.ease }}
      className="relative overflow-hidden"
      style={{
        background: VT.glass,
        backdropFilter: VT.blur,
        WebkitBackdropFilter: VT.blur,
        borderRadius: VT.cardRadius,
        border: `1px solid ${VT.rule}`,
        boxShadow: VT.cardShadow,
      }}
    >
      {/* radial bloom */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          background: `radial-gradient(circle at 50% 0%, rgba(${tier.rgb},0.08), transparent 55%)`,
        }}
      />

      {/* top hairline shimmer */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 5%, ${amber(0.18)} 50%, transparent 95%)`,
        }}
      />

      <div className="relative grid grid-cols-12 gap-0">
        {/* ─── LEFT LEDGER ─── */}
        <div
          className="col-span-3 p-6"
          style={{ borderRight: `1px solid ${VT.rule}` }}
        >
          <LedgerRow label="Trader" value="You" />
          <LedgerRow
            label="Tier"
            valueNode={
              <span className="flex items-center gap-1.5">
                <TierIcon size={11} strokeWidth={1.6} style={{ color: tier.hex }} />
                <span style={{ color: tier.hex }}>{tier.label}</span>
              </span>
            }
          />
          <LedgerRow
            label="Percentile"
            valueNode={hasData ? <span>Top {100 - data.percentile}%</span> : <span style={{ color: VT.ashSoft }}>—</span>}
          />
          <LedgerRow
            label="Source"
            valueNode={<span style={{ color: VT.ashSoft }}>Verified</span>}
            last
          />
        </div>

        {/* ─── MID PROTAGONIST ─── */}
        <div className="col-span-6 p-6 flex flex-col items-center justify-center text-center relative">
          <span
            className="font-mono uppercase mb-3"
            style={{ fontSize: 9.5, letterSpacing: "0.32em", color: VT.ashSoft, fontWeight: 500 }}
          >
            Forecasting Rank
          </span>
          <h1
            className="font-sans"
            style={{
              fontSize: 64,
              fontWeight: 500,
              color: VT.paper,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              textShadow: `0 1px 0 rgba(255,255,255,0.04)`,
            }}
          >
            <span style={{ color: tier.hex, fontWeight: 600 }}>{rankStr.charAt(0)}</span>
            <span>{rankStr.substring(1)}</span>
          </h1>
          <p
            className="font-sans mt-3 max-w-md"
            style={{
              fontSize: 12,
              color: VT.paperDim,
              lineHeight: 1.55,
              letterSpacing: "0.005em",
            }}
          >
            {hasData
              ? `Top ${100 - data.percentile}% of all analysts. Verified from market outcomes — never self-reported.`
              : "Track record computed from verified market outcomes. Authority earned, not claimed."}
          </p>

          {/* whisper line */}
          <div className="flex items-center gap-2 mt-5">
            <span
              className="font-sans italic"
              style={{ fontSize: 11, color: VT.ashSoft, letterSpacing: "0.005em" }}
            >
              You&apos;re +{data.weeklyDelta}% on the week — momentum compounding into structural reads.
            </span>
            <RefreshCw size={9} strokeWidth={1.5} style={{ color: VT.ashGhost }} />
          </div>
        </div>

        {/* ─── RIGHT LEDGER ─── */}
        <div
          className="col-span-3 p-6"
          style={{ borderLeft: `1px solid ${VT.rule}` }}
        >
          <LedgerRow label="Win Rate" valueNode={<span style={{ color: VT.emerald }}>{data.winRate}%</span>} num />
          <LedgerRow label="Avg R:R" valueNode={<span style={{ color: VT.blue }}>{data.avgRR}</span>} num />
          <LedgerRow label="Edge" valueNode={<span style={{ color: VT.purple }}>{data.edgeScore}</span>} num />
          <LedgerRow
            label="Streak"
            valueNode={
              <span className="flex items-center gap-1">
                <Flame size={10} strokeWidth={1.6} style={{ color: VT.amber }} />
                <span style={{ color: VT.amber }}>{data.currentStreak}W</span>
              </span>
            }
            last
          />
        </div>
      </div>

      {/* ─── PERIOD STRIP ─── */}
      <div
        className="relative flex items-center gap-3 px-6 py-3"
        style={{ borderTop: `1px solid ${VT.rule}`, background: VT.glassRecess }}
      >
        <span
          className="font-mono uppercase"
          style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.ashGhost, fontWeight: 500 }}
        >
          Period
        </span>
        <div className="flex items-center gap-0.5">
          {(["7d", "30d", "90d", "all"] as const).map((p, i, arr) => {
            const active = timePeriod === p
            return (
              <div key={p} className="flex items-center">
                <button
                  onClick={() => setTimePeriod(p)}
                  className="px-3 py-1 cursor-pointer transition-colors duration-150"
                  style={{
                    borderRadius: VT.chipRadius,
                    background: active ? amber(0.06) : "transparent",
                    border: `1px solid ${active ? amber(0.22) : "transparent"}`,
                    color: active ? VT.amber : VT.ash,
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    fontFamily: "var(--font-mono, ui-monospace)",
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  {p === "all" ? "All Time" : p}
                </button>
                {i < arr.length - 1 && <div className="w-1 h-px mx-0.5" style={{ background: VT.rule }} />}
              </div>
            )
          })}
        </div>
        <div className="h-4 w-px" style={{ background: VT.rule }} />
        <span
          className="font-mono uppercase"
          style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.ashGhost, fontWeight: 500 }}
        >
          {data.totalForecasts} forecasts in record
        </span>
      </div>
    </motion.div>
  )
}

function LedgerRow({ label, value, valueNode, num, last }: { label: string; value?: string; valueNode?: React.ReactNode; num?: boolean; last?: boolean }) {
  return (
    <div
      className="flex items-baseline justify-between py-2"
      style={{ borderBottom: last ? "none" : `1px dashed ${VT.ruleSoft}` }}
    >
      <span
        className="font-mono uppercase"
        style={{ fontSize: 9.5, letterSpacing: "0.22em", color: VT.ashGhost, fontWeight: 500 }}
      >
        {label}
      </span>
      <span
        className={num ? "font-mono" : "font-sans"}
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: VT.paper,
          fontVariantNumeric: num ? "tabular-nums" : undefined,
          letterSpacing: num ? "-0.01em" : "0",
        }}
      >
        {valueNode ?? value}
      </span>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   POPULATED RECORD — full editorial composition
   ══════════════════════════════════════════════════════════════════════ */
function PopulatedRecord({ data }: { data: RecordData }) {
  return (
    <div className="space-y-5">
      <BriefingMatrix data={data} />
      <DistributionDeepDive data={data} />
      <InstrumentEdgeDeepDive data={data} />
      <ConvictionCalibrationDeepDive data={data} />
      <MomentumGridCard data={data} />
      <MentorLedger data={data} />
      <MilestonePathCard data={data} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   1. BRIEFING MATRIX — 4-station horizontal data row
   ══════════════════════════════════════════════════════════════════════ */
function BriefingMatrix({ data }: { data: RecordData }) {
  const stations = [
    { label: "Win Rate", value: `${data.winRate}%`, sub: `${data.wins}W / ${data.losses}L`, hex: VT.emerald, rgb: VT.emeraldRgb, delta: "+4.2%" },
    { label: "Avg R:R", value: data.avgRR, sub: "Risk-to-reward", hex: VT.blue, rgb: VT.blueRgb, delta: "+0.3" },
    { label: "Edge Score", value: data.edgeScore.toString(), sub: `Top ${100 - data.percentile}%`, hex: VT.purple, rgb: VT.purpleRgb, delta: "+6" },
    { label: "Streak", value: `${data.currentStreak}W`, sub: `Best: ${data.bestStreak}`, hex: VT.amber, rgb: VT.amberRgb, delta: "active" },
  ]
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: VT.glass,
        backdropFilter: VT.blur,
        WebkitBackdropFilter: VT.blur,
        borderRadius: VT.cardRadius,
        border: `1px solid ${VT.rule}`,
        boxShadow: VT.cardShadow,
      }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4">
        {stations.map((s, i) => (
          <div
            key={s.label}
            className="relative p-5 group"
            style={{ borderRight: i < stations.length - 1 ? `1px solid ${VT.rule}` : "none" }}
          >
            {/* hover bloom */}
            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `radial-gradient(circle at 50% 80%, rgba(${s.rgb},0.06), transparent 60%)` }}
            />
            <div className="flex items-center justify-between mb-2 relative">
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9.5, letterSpacing: "0.22em", color: VT.ashGhost, fontWeight: 500 }}
              >
                {s.label}
              </span>
              <span
                className="font-mono uppercase"
                style={{ fontSize: 8.5, letterSpacing: "0.18em", color: `rgba(${s.rgb},0.78)`, fontWeight: 500 }}
              >
                {s.delta}
              </span>
            </div>
            <div
              className="font-mono relative"
              style={{
                fontSize: 32,
                fontWeight: 500,
                color: VT.paper,
                letterSpacing: "-0.03em",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <span style={{ color: s.hex, fontWeight: 600 }}>{s.value.charAt(0)}</span>
              <span style={{ color: VT.ash, fontWeight: 400 }}>{s.value.substring(1)}</span>
            </div>
            <span
              className="font-sans block mt-2 relative"
              style={{ fontSize: 11, color: VT.paperDim, letterSpacing: "0.005em" }}
            >
              {s.sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES — protagonist typography for deep-dive cards
   ═════════════════════��════════════════════════════════════════════════ */

/** Split-magnitude protagonist number — bold first glyph, quieter tail. */
function MagnitudeNumber({
  value,
  leadColor,
  tailColor,
  size = 36,
  unit,
  unitColor,
}: {
  value: string | number
  leadColor: string
  tailColor: string
  size?: number
  unit?: string
  unitColor?: string
}) {
  const v = String(value)
  const lead = v.charAt(0)
  const tail = v.substring(1)
  return (
    <span
      className="font-mono"
      style={{
        fontSize: size,
        fontWeight: 500,
        letterSpacing: "-0.03em",
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ color: leadColor, fontWeight: 600 }}>{lead}</span>
      <span style={{ color: tailColor, fontWeight: 400 }}>{tail}</span>
      {unit && (
        <span
          style={{
            color: unitColor ?? tailColor,
            fontWeight: 400,
            fontSize: size * 0.42,
            letterSpacing: "0.02em",
            marginLeft: 3,
          }}
        >
          {unit}
        </span>
      )}
    </span>
  )
}

/** A small ledger tile: mono-caps eyebrow above, sans value below. */
function LedgerCell({
  label,
  value,
  color = VT.paper,
  num = false,
  sub,
}: {
  label: string
  value: React.ReactNode
  color?: string
  num?: boolean
  sub?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span
        className="font-mono uppercase"
        style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.ashGhost, fontWeight: 500 }}
      >
        {label}
      </span>
      <span
        className={num ? "font-mono" : "font-sans"}
        style={{
          fontSize: 14,
          fontWeight: 500,
          color,
          fontVariantNumeric: num ? "tabular-nums" : undefined,
          letterSpacing: num ? "-0.015em" : "-0.005em",
          lineHeight: 1.1,
        }}
      >
        {value}
      </span>
      {sub && (
        <span
          className="font-sans"
          style={{ fontSize: 10, color: VT.ashSoft, letterSpacing: "0.005em", lineHeight: 1.3 }}
        >
          {sub}
        </span>
      )}
    </div>
  )
}

/** A horizontal hairline rail with an anchor circle on each side. */
function AnchoredHairlineRail({ tone = "rule" }: { tone?: "rule" | "amber" }) {
  const stroke = tone === "amber" ? amber(0.5) : VT.ashWhisper
  return (
    <div className="flex items-center gap-2">
      <svg width="6" height="6" viewBox="0 0 6 6" className="flex-shrink-0">
        <circle cx="3" cy="3" r="2.4" fill="none" stroke={stroke} strokeWidth="0.7" />
      </svg>
      <div className="h-px flex-1" style={{ background: VT.rule }} />
      <svg width="6" height="6" viewBox="0 0 6 6" className="flex-shrink-0">
        <circle cx="3" cy="3" r="2.4" fill="none" stroke={stroke} strokeWidth="0.7" />
      </svg>
    </div>
  )
}

/** A single horizontal accuracy bar. */
function Sparkbar({
  pct,
  color,
  height = 3,
  delay = 0,
  glow = false,
}: {
  pct: number
  color: string
  height?: number
  delay?: number
  glow?: boolean
}) {
  return (
    <div className="relative w-full overflow-hidden" style={{ height, background: VT.ashWhisper, borderRadius: 1 }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        transition={{ duration: 0.85, ease: VT.ease, delay }}
        style={{
          height: "100%",
          background: color,
          opacity: 0.92,
          boxShadow: glow ? `0 0 6px ${color}55` : "none",
        }}
      />
    </div>
  )
}

/** Italic story reading at the bottom of a deep-dive card. */
function StoryReading({
  children,
  accent = VT.amber,
}: {
  children: React.ReactNode
  accent?: string
}) {
  return (
    <div
      className="flex items-start gap-2.5 pt-3 mt-3"
      style={{ borderTop: `1px dashed ${VT.ruleSoft}` }}
    >
      <Sparkles size={11} strokeWidth={1.5} style={{ color: accent, flexShrink: 0, marginTop: 2 }} />
      <p
        className="font-sans italic"
        style={{ fontSize: 11, color: VT.paperDim, lineHeight: 1.55, letterSpacing: "0.005em" }}
      >
        {children}
      </p>
    </div>
  )
}

/** SVG dashed grid for chart backgrounds (matches Active Windows style). */
function DashedGrid({
  width,
  height,
  rows = 4,
  cols = 4,
  color = "rgba(255,255,255,0.025)",
}: {
  width: number
  height: number
  rows?: number
  cols?: number
  color?: string
}) {
  const lines = []
  for (let r = 1; r < rows; r++) {
    const y = (height / rows) * r
    lines.push(<line key={`h-${r}`} x1={0} y1={y} x2={width} y2={y} stroke={color} strokeWidth="0.5" strokeDasharray="2 4" />)
  }
  for (let c = 1; c < cols; c++) {
    const x = (width / cols) * c
    lines.push(<line key={`v-${c}`} x1={x} y1={0} x2={x} y2={height} stroke={color} strokeWidth="0.5" strokeDasharray="2 4" />)
  }
  return <g>{lines}</g>
}

/* ══════════════════════════════════════════════════════════════════════
   2. DISTRIBUTION DEEP DIVE
   Replaces EquityCurveCard + OutcomeRingCard.
   3-col composition: outcome ledger | paired bars | R-bucket histogram
   ══════════════════════════════════════════════════════════════════════ */
function DistributionDeepDive({ data }: { data: RecordData }) {
  const total = data.wins + data.losses + data.active + data.expired + data.invalidated
  const decided = data.wins + data.losses

  // Outcome rows for the center bars
  const outcomeBars = useMemo(() => {
    const rows = [
      { label: "Wins", value: data.wins, hex: VT.emerald, rgb: VT.emeraldRgb },
      { label: "Losses", value: data.losses, hex: VT.rose, rgb: VT.roseRgb },
      { label: "Active", value: data.active, hex: VT.blue, rgb: VT.blueRgb },
      { label: "Expired", value: data.expired, hex: VT.paperDim, rgb: slate },
      { label: "Void", value: data.invalidated, hex: VT.ashSoft, rgb: slate },
    ].filter((r) => r.value > 0)
    return rows
  }, [data.wins, data.losses, data.active, data.expired, data.invalidated])

  // R-bucket histogram from recent30
  const buckets = useMemo(() => {
    const defs = [
      { label: "≤ -1R", min: -Infinity, max: -1, hex: VT.rose, rgb: VT.roseRgb },
      { label: "-1 to 0", min: -1, max: 0, hex: `rgba(${VT.roseRgb},0.55)`, rgb: VT.roseRgb },
      { label: "0 to 1R", min: 0, max: 1, hex: `rgba(${VT.amberRgb},0.7)`, rgb: VT.amberRgb },
      { label: "1 to 2R", min: 1, max: 2, hex: VT.amber, rgb: VT.amberRgb },
      { label: "2 to 3R", min: 2, max: 3, hex: `rgba(${VT.emeraldRgb},0.78)`, rgb: VT.emeraldRgb },
      { label: "≥ 3R", min: 3, max: Infinity, hex: VT.emerald, rgb: VT.emeraldRgb },
    ]
    return defs.map((b) => {
      const count = data.recent30.filter((r) => {
        if (r.outcome === "win" && r.rr >= b.min && r.rr < b.max) return true
        if (r.outcome === "loss" && b.label === "≤ -1R") return true
        return false
      }).length
      return { ...b, count }
    })
  }, [data.recent30])

  const maxBucket = Math.max(1, ...buckets.map((b) => b.count))

  // Day stats for footer
  const wins30 = data.recent30.filter((r) => r.outcome === "win")
  const losses30 = data.recent30.filter((r) => r.outcome === "loss")
  const cum = data.recent30.reduce((a, r) => a + (r.outcome === "win" ? r.rr : r.outcome === "loss" ? -1 : 0), 0)
  const bestR = wins30.length ? Math.max(...wins30.map((r) => r.rr)) : 0
  const worstR = losses30.length ? -1 : 0
  const winDays = wins30.length

  return (
    <CardShell title="Distribution" eyebrow="30-Day Composition" deepLink>
      <div className="px-6 pb-5">
        {/* Anchored sub-rail */}
        <div className="mb-5"><AnchoredHairlineRail tone="amber" /></div>

        {/* 3-column composition */}
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT — protagonist + outcome ledger */}
          <div className="col-span-3 flex flex-col gap-5" style={{ borderRight: `1px solid ${VT.rule}`, paddingRight: 24 }}>
            <div className="flex flex-col gap-2">
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.32em", color: VT.ashGhost, fontWeight: 500 }}
              >
                Win Rate
              </span>
              <MagnitudeNumber
                value={`${data.winRate.toFixed(1)}`}
                leadColor={VT.emerald}
                tailColor={VT.ash}
                size={42}
                unit="%"
                unitColor={`rgba(${VT.emeraldRgb},0.5)`}
              />
              <span className="font-sans" style={{ fontSize: 11, color: VT.paperDim, letterSpacing: "0.005em" }}>
                {data.wins}W / {data.losses}L over {decided} decided
              </span>
            </div>
            <div className="flex flex-col gap-3 pt-3" style={{ borderTop: `1px dashed ${VT.ruleSoft}` }}>
              <LedgerCell label="Total Sample" value={total} color={VT.paper} num />
              <LedgerCell label="Decided" value={decided} color={VT.amber} num />
              <LedgerCell label="In Flight" value={data.active} color={VT.blue} num />
            </div>
          </div>

          {/* CENTER — paired horizontal bars */}
          <div className="col-span-6 flex flex-col gap-3.5">
            <div className="flex items-baseline justify-between mb-1">
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.ashGhost, fontWeight: 500 }}
              >
                Outcome Composition
              </span>
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.18em", color: VT.amber, fontWeight: 500 }}
              >
                {total} total
              </span>
            </div>
            {outcomeBars.map((row, i) => {
              const pct = total > 0 ? (row.value / total) * 100 : 0
              return (
                <div key={row.label} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-3 rounded-sm" style={{ background: row.hex, opacity: 0.85 }} />
                      <span
                        className="font-mono uppercase"
                        style={{ fontSize: 10, letterSpacing: "0.18em", color: VT.ashSoft, fontWeight: 500 }}
                      >
                        {row.label}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span
                        className="font-mono"
                        style={{ fontSize: 13, fontWeight: 500, color: VT.paper, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}
                      >
                        {row.value}
                      </span>
                      <span
                        className="font-mono"
                        style={{ fontSize: 10, color: VT.ashSoft, fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em" }}
                      >
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <Sparkbar pct={pct} color={row.hex} height={4} delay={i * 0.06} glow={i < 2} />
                </div>
              )
            })}
          </div>

          {/* RIGHT — R-bucket histogram */}
          <div className="col-span-3 flex flex-col gap-2" style={{ borderLeft: `1px solid ${VT.rule}`, paddingLeft: 24 }}>
            <div className="flex items-baseline justify-between mb-1">
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.ashGhost, fontWeight: 500 }}
              >
                R-Profile
              </span>
              <span
                className="font-mono uppercase"
                style={{ fontSize: 8.5, letterSpacing: "0.18em", color: VT.ashSoft, fontWeight: 500 }}
              >
                Last 30
              </span>
            </div>
            <svg width="100%" viewBox="0 0 200 140" preserveAspectRatio="xMidYMid meet" style={{ display: "block" }}>
              <DashedGrid width={200} height={120} rows={3} cols={6} />
              {/* zero marker */}
              <line x1={(200 / 6) * 2} y1={0} x2={(200 / 6) * 2} y2={120} stroke={amber(0.32)} strokeWidth="0.7" strokeDasharray="2 3" />
              {buckets.map((b, i) => {
                const w = 200 / 6
                const x = i * w + w * 0.18
                const barW = w * 0.64
                const h = (b.count / maxBucket) * 110
                const y = 120 - h
                return (
                  <g key={b.label}>
                    <motion.rect
                      x={x}
                      y={120}
                      width={barW}
                      height={0}
                      fill={b.hex}
                      opacity={0.88}
                      initial={{ height: 0, y: 120 }}
                      animate={{ height: h, y }}
                      transition={{ duration: 0.7, ease: VT.ease, delay: 0.15 + i * 0.05 }}
                    />
                    <text
                      x={x + barW / 2}
                      y={134}
                      textAnchor="middle"
                      className="font-mono uppercase"
                      style={{ fontSize: 6.5, letterSpacing: "0.14em", fontWeight: 500, fill: VT.ashGhost }}
                    >
                      {b.label}
                    </text>
                    {b.count > 0 && (
                      <text
                        x={x + barW / 2}
                        y={y - 3}
                        textAnchor="middle"
                        className="font-mono"
                        style={{ fontSize: 8, fontWeight: 500, fill: VT.paperDim, letterSpacing: "-0.01em" }}
                      >
                        {b.count}
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        {/* Footer 4-cell strip */}
        <div
          className="grid grid-cols-4 gap-6 mt-5 pt-4"
          style={{ borderTop: `1px dashed ${VT.ruleSoft}` }}
        >
          <LedgerCell label="Cumulative R" value={`${cum >= 0 ? "+" : ""}${cum.toFixed(1)}R`} color={cum >= 0 ? VT.emerald : VT.rose} num />
          <LedgerCell label="Best Trade" value={`+${bestR.toFixed(1)}R`} color={VT.emerald} num />
          <LedgerCell label="Worst Trade" value={`${worstR.toFixed(1)}R`} color={VT.rose} num />
          <LedgerCell label="Win Days" value={`${winDays} / 30`} color={VT.amber} num />
        </div>

        <StoryReading>
          You&apos;re winning {data.winRate.toFixed(0)}% of decided forecasts with {bestR.toFixed(1)}R best — distribution skews {cum >= 0 ? "right" : "left"} of zero. Compounding R&nbsp;profile means the structural reads are paying.
        </StoryReading>
      </div>
    </CardShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   3. INSTRUMENT EDGE DEEP DIVE
   Replaces InstrumentRegister.
   3-col composition: strongest pair | sparkbar grid | weakest pair warning
   ══════════════════════════════════════════════════════════════════════ */
function InstrumentEdgeDeepDive({ data }: { data: RecordData }) {
  const sorted = useMemo(() => [...data.instruments].sort((a, b) => b.edge - a.edge), [data.instruments])
  const strongest = sorted[0]
  const weakest = sorted[sorted.length - 1]
  const [expanded, setExpanded] = useState<string | null>(strongest?.name ?? null)

  if (!strongest) return null

  return (
    <CardShell title="Instrument Edge" eyebrow="Asset Performance Map" deepLink>
      <div className="px-6 pb-5">
        <div className="mb-5"><AnchoredHairlineRail tone="amber" /></div>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT — STRONGEST PAIR CARD */}
          <div
            className="col-span-3 flex flex-col gap-4 p-4 relative overflow-hidden"
            style={{
              border: `1px solid rgba(${VT.emeraldRgb},0.18)`,
              background: `linear-gradient(180deg, rgba(${VT.emeraldRgb},0.04), transparent 70%)`,
              borderRadius: VT.cardRadius,
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: `linear-gradient(90deg, transparent 5%, rgba(${VT.emeraldRgb},0.45) 50%, transparent 95%)` }}
            />
            <div className="flex items-center gap-2">
              <Crown size={11} strokeWidth={1.6} style={{ color: VT.emerald }} />
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.28em", color: VT.emerald, fontWeight: 500 }}
              >
                Strongest
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <h3
                className="font-sans"
                style={{ fontSize: 26, fontWeight: 500, color: VT.paper, letterSpacing: "-0.025em", lineHeight: 1 }}
              >
                {strongest.name}
              </h3>
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.ashGhost, fontWeight: 500 }}
              >
                {strongest.type}
              </span>
            </div>
            <MagnitudeNumber
              value={`${strongest.rate.toFixed(0)}`}
              leadColor={VT.emerald}
              tailColor={VT.ash}
              size={40}
              unit="%"
              unitColor={`rgba(${VT.emeraldRgb},0.5)`}
            />
            <Sparkbar pct={strongest.rate} color={VT.emerald} height={3} glow />
            <div className="flex flex-col gap-2.5 pt-3" style={{ borderTop: `1px dashed ${VT.ruleSoft}` }}>
              <LedgerCell label="Trades" value={strongest.trades} num />
              <LedgerCell label="Avg R:R" value={strongest.avgRR} color={VT.blue} num />
              <LedgerCell label="Edge" value={strongest.edge} color={VT.purple} num sub={strongest.bestSetup} />
            </div>
          </div>

          {/* CENTER — sparkbar grid */}
          <div className="col-span-6 flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.ashGhost, fontWeight: 500 }}
              >
                All Instruments
              </span>
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.18em", color: VT.amber, fontWeight: 500 }}
              >
                {sorted.length} assets · sorted by edge
              </span>
            </div>

            {sorted.map((inst, i) => {
              const isOpen = expanded === inst.name
              const rateColor = inst.rate >= 70 ? VT.emerald : inst.rate >= 55 ? VT.amber : VT.rose
              const trendIcon = inst.trend === "up" ? TrendingUp : inst.trend === "down" ? TrendingDown : Activity
              const TIcon = trendIcon
              return (
                <div key={inst.name}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : inst.name)}
                    className="w-full grid items-center gap-3 py-2.5 text-left cursor-pointer transition-colors duration-150 hover:bg-white/[0.018] px-2 -mx-2"
                    style={{
                      gridTemplateColumns: "82px 60px 1fr 60px 22px",
                      borderBottom: `1px dashed ${VT.ruleSoft}`,
                      borderRadius: 4,
                    }}
                  >
                    <div className="flex flex-col leading-tight min-w-0">
                      <span
                        className="font-sans"
                        style={{ fontSize: 12.5, fontWeight: 500, color: VT.paper, letterSpacing: "-0.005em" }}
                      >
                        {inst.name}
                      </span>
                      <span
                        className="font-mono uppercase"
                        style={{ fontSize: 8, letterSpacing: "0.22em", color: VT.ashGhost, fontWeight: 500 }}
                      >
                        {inst.type}
                      </span>
                    </div>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: rateColor,
                        fontVariantNumeric: "tabular-nums",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {inst.rate.toFixed(0)}%
                    </span>
                    <Sparkbar pct={inst.edge} color={rateColor} height={3} delay={0.08 + i * 0.04} />
                    <div className="flex items-center justify-end gap-1.5">
                      <TIcon size={10} strokeWidth={1.7} style={{ color: inst.trend === "up" ? VT.emerald : inst.trend === "down" ? VT.rose : VT.ashSoft }} />
                      <span
                        className="font-mono"
                        style={{ fontSize: 11, fontWeight: 500, color: VT.paperDim, fontVariantNumeric: "tabular-nums" }}
                      >
                        {inst.edge}
                      </span>
                    </div>
                    <ChevronRight
                      size={11}
                      strokeWidth={1.6}
                      style={{
                        color: VT.ashGhost,
                        transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          className="grid grid-cols-4 gap-4 px-3 py-3 mt-1"
                          style={{ background: VT.glassRecess, borderRadius: 4 }}
                        >
                          <LedgerCell label="Wins" value={inst.wins} color={VT.emerald} num />
                          <LedgerCell label="Losses" value={inst.trades - inst.wins} color={VT.rose} num />
                          <LedgerCell label="Avg R:R" value={inst.avgRR} color={VT.blue} num />
                          <LedgerCell label="Edge" value={inst.edge} color={VT.purple} num sub={inst.status === "strong" ? "above threshold" : inst.status === "weak" ? "below threshold" : "neutral edge"} />
                        </div>
                        {inst.bestSetup && inst.bestSetup !== "—" && (
                          <div className="px-3 py-2 mt-1 flex items-center gap-2">
                            <Target size={9} strokeWidth={1.6} style={{ color: VT.amber }} />
                            <span
                              className="font-mono uppercase"
                              style={{ fontSize: 8.5, letterSpacing: "0.22em", color: VT.ashGhost, fontWeight: 500 }}
                            >
                              Best Setup
                            </span>
                            <span
                              className="font-sans"
                              style={{ fontSize: 11, color: VT.paperDim, letterSpacing: "0.005em" }}
                            >
                              {inst.bestSetup}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          {/* RIGHT — WEAKEST PAIR WARNING */}
          <div
            className="col-span-3 flex flex-col gap-4 p-4 relative overflow-hidden"
            style={{
              border: `1px solid rgba(${VT.roseRgb},0.18)`,
              background: `linear-gradient(180deg, rgba(${VT.roseRgb},0.04), transparent 70%)`,
              borderRadius: VT.cardRadius,
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: `linear-gradient(90deg, transparent 5%, rgba(${VT.roseRgb},0.45) 50%, transparent 95%)` }}
            />
            <div className="flex items-center gap-2">
              <XCircle size={11} strokeWidth={1.6} style={{ color: VT.rose }} />
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.28em", color: VT.rose, fontWeight: 500 }}
              >
                Weakest
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <h3
                className="font-sans"
                style={{ fontSize: 26, fontWeight: 500, color: VT.paper, letterSpacing: "-0.025em", lineHeight: 1 }}
              >
                {weakest.name}
              </h3>
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.ashGhost, fontWeight: 500 }}
              >
                {weakest.type}
              </span>
            </div>
            <MagnitudeNumber
              value={`${weakest.rate.toFixed(0)}`}
              leadColor={VT.rose}
              tailColor={VT.ash}
              size={40}
              unit="%"
              unitColor={`rgba(${VT.roseRgb},0.5)`}
            />
            <Sparkbar pct={weakest.rate} color={VT.rose} height={3} />
            <div className="flex flex-col gap-2.5 pt-3" style={{ borderTop: `1px dashed ${VT.ruleSoft}` }}>
              <LedgerCell label="Trades" value={weakest.trades} num />
              <LedgerCell label="Edge" value={weakest.edge} color={VT.rose} num />
            </div>
            <div className="flex items-start gap-2 pt-2" style={{ borderTop: `1px dashed ${VT.ruleSoft}` }}>
              <Lock size={10} strokeWidth={1.6} style={{ color: VT.rose, marginTop: 2, flexShrink: 0 }} />
              <span
                className="font-sans italic"
                style={{ fontSize: 10.5, color: VT.paperDim, lineHeight: 1.5, letterSpacing: "0.005em" }}
              >
                Below threshold — recommend pausing forecasts.
              </span>
            </div>
          </div>
        </div>

        <StoryReading>
          {strongest.name} is your channel — {strongest.rate.toFixed(0)}% accuracy, edge {strongest.edge}, {strongest.bestSetup} pattern paying. Cut exposure on {weakest.name} until the structural read returns.
        </StoryReading>
      </div>
    </CardShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   4. CONVICTION CALIBRATION DEEP DIVE
   Replaces CalibrationCard.
   3-col composition: bias gauge | reliability diagram | per-band ledger
   ══════════════════════════════════════════════════════════════════════ */
function ConvictionCalibrationDeepDive({ data }: { data: RecordData }) {
  const bands = data.calibrationBands
  const totalSamples = bands.reduce((a, b) => a + b.samples, 0)
  const avgDelta = bands.length
    ? bands.reduce((a, b) => a + (b.actual - b.confidence), 0) / bands.length
    : 0
  const bias = avgDelta // negative = overconfident, positive = under
  const biasLabel = Math.abs(bias) <= 1.5 ? "Well-tuned" : bias > 0 ? "Slightly under" : "Slightly over"
  const biasColor = Math.abs(bias) <= 1.5 ? VT.emerald : Math.abs(bias) <= 4 ? VT.amber : VT.rose
  const biasRgb = Math.abs(bias) <= 1.5 ? VT.emeraldRgb : Math.abs(bias) <= 4 ? VT.amberRgb : VT.roseRgb

  // Reliability diagram geometry — 200×200 chart area
  const W = 220
  const H = 220
  const PAD = 18
  const x = (v: number) => PAD + (v / 100) * (W - PAD * 2)
  const y = (v: number) => H - PAD - (v / 100) * (H - PAD * 2)

  // Best & worst bands
  const sortedByDelta = [...bands].sort((a, b) => Math.abs(a.actual - a.confidence) - Math.abs(b.actual - b.confidence))
  const bestBand = sortedByDelta[0]
  const worstBand = sortedByDelta[sortedByDelta.length - 1]

  return (
    <CardShell title="Conviction Calibration" eyebrow="Reliability Diagram" deepLink>
      <div className="px-6 pb-5">
        <div className="mb-5"><AnchoredHairlineRail tone="amber" /></div>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT — bias gauge */}
          <div className="col-span-3 flex flex-col gap-4" style={{ borderRight: `1px solid ${VT.rule}`, paddingRight: 24 }}>
            <div className="flex flex-col gap-2">
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.32em", color: VT.ashGhost, fontWeight: 500 }}
              >
                Calibration Index
              </span>
              <MagnitudeNumber
                value={`0.${Math.round(data.calibration * 100)}`}
                leadColor={biasColor}
                tailColor={VT.ash}
                size={42}
              />
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9.5, letterSpacing: "0.22em", color: biasColor, fontWeight: 500 }}
              >
                {biasLabel}
              </span>
            </div>

            {/* Bias gauge bar — center anchor with directional indicator */}
            <div className="flex flex-col gap-2 pt-3" style={{ borderTop: `1px dashed ${VT.ruleSoft}` }}>
              <div className="flex items-baseline justify-between">
                <span
                  className="font-mono uppercase"
                  style={{ fontSize: 8.5, letterSpacing: "0.22em", color: VT.ashGhost, fontWeight: 500 }}
                >
                  Bias
                </span>
                <span
                  className="font-mono"
                  style={{ fontSize: 10, color: biasColor, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}
                >
                  {bias >= 0 ? "+" : ""}{bias.toFixed(1)}pt
                </span>
              </div>
              <div className="relative" style={{ height: 22 }}>
                <div className="absolute inset-x-0 top-1/2 h-px" style={{ background: VT.ashWhisper, transform: "translateY(-50%)" }} />
                <div className="absolute top-0 bottom-0 left-1/2" style={{ width: 1, background: VT.amber, opacity: 0.5 }} />
                <motion.div
                  className="absolute top-1/2 rounded-full"
                  initial={{ left: "50%", opacity: 0 }}
                  animate={{
                    left: `${50 + Math.max(-40, Math.min(40, bias * 4))}%`,
                    opacity: 1,
                  }}
                  transition={{ duration: 0.85, ease: VT.ease, delay: 0.2 }}
                  style={{
                    width: 10,
                    height: 10,
                    background: biasColor,
                    transform: "translate(-50%,-50%)",
                    boxShadow: `0 0 8px rgba(${biasRgb},0.55)`,
                  }}
                />
              </div>
              <div className="flex items-baseline justify-between">
                <span
                  className="font-mono uppercase"
                  style={{ fontSize: 7.5, letterSpacing: "0.18em", color: VT.ashGhost, fontWeight: 500 }}
                >
                  Over
                </span>
                <span
                  className="font-mono uppercase"
                  style={{ fontSize: 7.5, letterSpacing: "0.18em", color: VT.amber, fontWeight: 500 }}
                >
                  Perfect
                </span>
                <span
                  className="font-mono uppercase"
                  style={{ fontSize: 7.5, letterSpacing: "0.18em", color: VT.ashGhost, fontWeight: 500 }}
                >
                  Under
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-3" style={{ borderTop: `1px dashed ${VT.ruleSoft}` }}>
              <LedgerCell label="Samples" value={totalSamples} color={VT.paper} num />
              <LedgerCell label="Bands Tracked" value={bands.length} color={VT.blue} num />
              <LedgerCell label="Avg Confidence" value={`${data.avgConfidence}%`} color={VT.purple} num />
            </div>
          </div>

          {/* CENTER — reliability diagram */}
          <div className="col-span-6 flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.ashGhost, fontWeight: 500 }}
              >
                Stated vs Actual
              </span>
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.18em", color: VT.amber, fontWeight: 500 }}
              >
                Diagonal = perfect
              </span>
            </div>
            <div className="relative" style={{ aspectRatio: "1 / 1", maxWidth: 360, margin: "0 auto", width: "100%" }}>
              <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
                {/* axis grid */}
                <DashedGrid width={W - PAD * 2} height={H - PAD * 2} rows={4} cols={4} />
                {/* outer frame — translate dashed grid into chart area */}
                <g transform={`translate(${PAD},${PAD})`} style={{ display: "none" }}>
                  <DashedGrid width={W - PAD * 2} height={H - PAD * 2} rows={4} cols={4} />
                </g>
                {/* axes */}
                <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={VT.rule} strokeWidth="0.7" />
                <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke={VT.rule} strokeWidth="0.7" />
                {/* tick labels */}
                {[0, 25, 50, 75, 100].map((t) => (
                  <g key={`tx-${t}`}>
                    <line x1={x(t)} y1={H - PAD} x2={x(t)} y2={H - PAD + 3} stroke={VT.ashGhost} strokeWidth="0.5" />
                    <text
                      x={x(t)}
                      y={H - PAD + 11}
                      textAnchor="middle"
                      className="font-mono"
                      style={{ fontSize: 7, fontWeight: 500, fill: VT.ashGhost, letterSpacing: "0.06em" }}
                    >
                      {t}
                    </text>
                  </g>
                ))}
                {[0, 25, 50, 75, 100].map((t) => (
                  <g key={`ty-${t}`}>
                    <line x1={PAD - 3} y1={y(t)} x2={PAD} y2={y(t)} stroke={VT.ashGhost} strokeWidth="0.5" />
                    <text
                      x={PAD - 6}
                      y={y(t) + 2.5}
                      textAnchor="end"
                      className="font-mono"
                      style={{ fontSize: 7, fontWeight: 500, fill: VT.ashGhost, letterSpacing: "0.06em" }}
                    >
                      {t}
                    </text>
                  </g>
                ))}
                {/* axis caps */}
                <text
                  x={(W - PAD) / 2 + PAD / 2}
                  y={H - 2}
                  textAnchor="middle"
                  className="font-mono uppercase"
                  style={{ fontSize: 7, fontWeight: 500, fill: VT.ashGhost, letterSpacing: "0.18em" }}
                >
                  Said %
                </text>
                <text
                  x={6}
                  y={(H - PAD) / 2 + PAD / 2}
                  textAnchor="middle"
                  className="font-mono uppercase"
                  style={{ fontSize: 7, fontWeight: 500, fill: VT.ashGhost, letterSpacing: "0.18em" }}
                  transform={`rotate(-90 6 ${(H - PAD) / 2 + PAD / 2})`}
                >
                  Actual %
                </text>
                {/* perfect calibration diagonal */}
                <line
                  x1={x(0)}
                  y1={y(0)}
                  x2={x(100)}
                  y2={y(100)}
                  stroke={amber(0.45)}
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                {/* connector line through points */}
                <motion.path
                  d={bands.map((b, i) => `${i === 0 ? "M" : "L"} ${x(b.confidence)} ${y(b.actual)}`).join(" ")}
                  fill="none"
                  stroke={`rgba(${biasRgb},0.6)`}
                  strokeWidth="1.2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: VT.ease, delay: 0.2 }}
                />
                {/* points */}
                {bands.map((b, i) => {
                  const delta = b.actual - b.confidence
                  const pointHex = Math.abs(delta) <= 3 ? VT.emerald : Math.abs(delta) <= 8 ? VT.amber : VT.rose
                  const pointRgb = Math.abs(delta) <= 3 ? VT.emeraldRgb : Math.abs(delta) <= 8 ? VT.amberRgb : VT.roseRgb
                  const radius = 3 + Math.min(6, b.samples / 8)
                  return (
                    <g key={b.confidence}>
                      <motion.circle
                        cx={x(b.confidence)}
                        cy={y(b.actual)}
                        r={radius + 4}
                        fill={`rgba(${pointRgb},0.12)`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
                      />
                      <motion.circle
                        cx={x(b.confidence)}
                        cy={y(b.actual)}
                        r={radius}
                        fill={pointHex}
                        opacity={0.9}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.45, ease: VT.ease, delay: 0.45 + i * 0.08 }}
                      />
                      <motion.text
                        x={x(b.confidence)}
                        y={y(b.actual) - radius - 6}
                        textAnchor="middle"
                        className="font-mono"
                        style={{ fontSize: 8, fontWeight: 500, fill: VT.paper, letterSpacing: "-0.01em" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.55 + i * 0.08 }}
                      >
                        {b.confidence}
                      </motion.text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>

          {/* RIGHT — per-band ledger */}
          <div className="col-span-3 flex flex-col gap-2" style={{ borderLeft: `1px solid ${VT.rule}`, paddingLeft: 24 }}>
            <div className="flex items-baseline justify-between mb-1">
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.ashGhost, fontWeight: 500 }}
              >
                Per-Band
              </span>
              <span
                className="font-mono uppercase"
                style={{ fontSize: 8.5, letterSpacing: "0.18em", color: VT.ashSoft, fontWeight: 500 }}
              >
                {bands.length} bands
              </span>
            </div>
            {bands.map((b, i) => {
              const delta = b.actual - b.confidence
              const dColor = Math.abs(delta) <= 3 ? VT.emerald : Math.abs(delta) <= 8 ? VT.amber : VT.rose
              return (
                <motion.div
                  key={b.confidence}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                  className="flex items-baseline justify-between py-1.5"
                  style={{ borderBottom: `1px dashed ${VT.ruleSoft}` }}
                >
                  <span
                    className="font-mono uppercase"
                    style={{ fontSize: 9.5, letterSpacing: "0.18em", color: VT.ashSoft, fontWeight: 500 }}
                  >
                    {b.confidence}%
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="font-mono"
                      style={{ fontSize: 11, color: VT.paperDim, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}
                    >
                      {b.actual}%
                    </span>
                    <span
                      className="font-mono"
                      style={{ fontSize: 9.5, color: dColor, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em", minWidth: 28, textAlign: "right" }}
                    >
                      {delta >= 0 ? "+" : ""}{delta}
                    </span>
                    <span
                      className="font-mono"
                      style={{ fontSize: 8.5, color: VT.ashGhost, fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em", minWidth: 24, textAlign: "right" }}
                    >
                      n{b.samples}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Footer — best/worst bands */}
        <div
          className="grid grid-cols-4 gap-6 mt-5 pt-4"
          style={{ borderTop: `1px dashed ${VT.ruleSoft}` }}
        >
          <LedgerCell
            label="Tightest Band"
            value={`${bestBand.confidence}%`}
            color={VT.emerald}
            num
            sub={`${bestBand.actual - bestBand.confidence >= 0 ? "+" : ""}${bestBand.actual - bestBand.confidence}pt off`}
          />
          <LedgerCell
            label="Loosest Band"
            value={`${worstBand.confidence}%`}
            color={VT.rose}
            num
            sub={`${worstBand.actual - worstBand.confidence >= 0 ? "+" : ""}${worstBand.actual - worstBand.confidence}pt off`}
          />
          <LedgerCell label="Avg Bias" value={`${bias >= 0 ? "+" : ""}${bias.toFixed(1)}pt`} color={biasColor} num />
          <LedgerCell label="Total Samples" value={totalSamples} color={VT.amber} num />
        </div>

        <StoryReading>
          You&apos;re tightest at {bestBand.confidence}% — when you say {bestBand.confidence}%, you land {bestBand.actual}%. {Math.abs(worstBand.actual - worstBand.confidence) > 4 ? `Loosest at ${worstBand.confidence}% — recalibrate that band by tightening criteria before publishing.` : `Calibration is sharp across the curve.`}
        </StoryReading>
      </div>
    </CardShell>
  )
}


/* ══════════════════════════════════════════════════════════════════════
   6. MOMENTUM GRID — 30-square heatmap
   ══════════════════════════════════════════════════════════════════════ */
function MomentumGridCard({ data }: { data: RecordData }) {
  const [hovered, setHovered] = useState<typeof data.recent30[number] | null>(null)

  return (
    <CardShell title="Momentum" eyebrow="Last 30 Forecasts" deepLink>
      <div className="px-6 pb-5">
        <div className="grid grid-cols-10 gap-1 mb-4">
          {data.recent30.map((r, i) => {
            const hex =
              r.outcome === "win" ? VT.emerald
              : r.outcome === "loss" ? VT.rose
              : r.outcome === "active" ? VT.blue
              : VT.ashSoft
            const isHovered = hovered?.id === r.id
            return (
              <motion.button
                key={r.id}
                onMouseEnter={() => setHovered(r)}
                onMouseLeave={() => setHovered(null)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.012, duration: 0.25 }}
                className="relative cursor-pointer"
                style={{
                  aspectRatio: "1",
                  background: `rgba(${
                    r.outcome === "win" ? VT.emeraldRgb
                    : r.outcome === "loss" ? VT.roseRgb
                    : r.outcome === "active" ? VT.blueRgb
                    : VT.slate
                  },${isHovered ? 0.85 : 0.42})`,
                  borderRadius: 2,
                  boxShadow: isHovered ? `0 0 8px ${hex}55` : "none",
                  transition: "background 0.15s, box-shadow 0.15s",
                }}
              />
            )
          })}
        </div>
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-3 px-3 py-2"
              style={{
                background: VT.glassRecess,
                border: `1px solid ${VT.rule}`,
                borderRadius: VT.badgeRadius,
              }}
            >
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.ashSoft, fontWeight: 500 }}
              >
                {hovered.date}
              </span>
              <div className="w-px h-3" style={{ background: VT.rule }} />
              <span
                className="font-mono"
                style={{ fontSize: 11, color: VT.paper, fontVariantNumeric: "tabular-nums" }}
              >
                {hovered.instrument}
              </span>
              <div className="w-px h-3" style={{ background: VT.rule }} />
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: 9.5,
                  letterSpacing: "0.18em",
                  fontWeight: 500,
                  color:
                    hovered.outcome === "win" ? VT.emerald
                    : hovered.outcome === "loss" ? VT.rose
                    : hovered.outcome === "active" ? VT.blue
                    : VT.ashSoft,
                }}
              >
                {hovered.outcome}
              </span>
              {hovered.rr > 0 && (
                <>
                  <div className="w-px h-3" style={{ background: VT.rule }} />
                  <span
                    className="font-mono"
                    style={{ fontSize: 11, color: VT.amber, fontVariantNumeric: "tabular-nums" }}
                  >
                    +{hovered.rr.toFixed(1)}R
                  </span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-4 mt-4 pt-3" style={{ borderTop: `1px dashed ${VT.ruleSoft}` }}>
          {[
            { label: "Win", hex: VT.emerald, rgb: VT.emeraldRgb },
            { label: "Loss", hex: VT.rose, rgb: VT.roseRgb },
            { label: "Active", hex: VT.blue, rgb: VT.blueRgb },
            { label: "Other", hex: VT.ashSoft, rgb: VT.slate },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ background: `rgba(${l.rgb},0.7)` }} />
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.ashSoft, fontWeight: 500 }}
              >
                {l.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </CardShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   7. MENTOR LEDGER
   ══════════════════════════════════════════════════════════════════════ */
function MentorLedger({ data }: { data: RecordData }) {
  return (
    <CardShell title="Mentor Intelligence" eyebrow="Verified Reviews" deepLink>
      <div className="px-6 pb-5">
        {data.mentorReviews.map((r, i) => (
          <div
            key={r.id}
            className="py-4 first:pt-0 last:pb-0"
            style={{ borderBottom: i < data.mentorReviews.length - 1 ? `1px dashed ${VT.ruleSoft}` : "none" }}
          >
            <div className="flex items-start gap-4">
              {/* mentor avatar */}
              <div
                className="rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  width: 32, height: 32,
                  background: amber(0.06),
                  border: `1px solid ${amber(0.32)}`,
                }}
              >
                <span
                  className="font-mono"
                  style={{ fontSize: 11, fontWeight: 600, color: VT.amber }}
                >
                  {r.mentor.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span
                    className="font-sans"
                    style={{ fontSize: 13, fontWeight: 500, color: VT.paper, letterSpacing: "-0.01em" }}
                  >
                    {r.mentor}
                  </span>
                  <span
                    className="font-mono uppercase"
                    style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.ashGhost, fontWeight: 500 }}
                  >
                    {r.role}
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={9}
                          strokeWidth={1.5}
                          fill={idx < r.rating ? VT.amber : "transparent"}
                          style={{ color: idx < r.rating ? VT.amber : VT.ashGhost }}
                        />
                      ))}
                    </div>
                    <span
                      className="font-mono"
                      style={{ fontSize: 9.5, color: VT.ashGhost, letterSpacing: "0.04em" }}
                    >
                      {r.reviewedAt}
                    </span>
                  </div>
                </div>
                <p
                  className="font-sans italic mb-2"
                  style={{ fontSize: 12, color: VT.paperDim, lineHeight: 1.55, letterSpacing: "0.005em" }}
                >
                  &ldquo;{r.feedback}&rdquo;
                </p>
                <div
                  className="inline-flex items-center gap-1.5 px-2 py-0.5"
                  style={{
                    background: amber(0.06),
                    border: `1px solid ${amber(0.22)}`,
                    borderRadius: VT.chipRadius,
                  }}
                >
                  <Sparkles size={9} strokeWidth={1.5} style={{ color: VT.amber }} />
                  <span
                    className="font-mono uppercase"
                    style={{ fontSize: 8.5, letterSpacing: "0.18em", color: VT.amber, fontWeight: 500 }}
                  >
                    {r.highlight}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   8. MILESTONE PATH
   ══════════════════════════════════════════════════════════════════════ */
function MilestonePathCard({ data }: { data: RecordData }) {
  return (
    <CardShell title="Milestones" eyebrow="Progression Path" deepLink>
      <div className="px-6 pb-5 space-y-3">
        {data.milestones.map((m) => {
          const pct = Math.min(100, (m.progress / m.target) * 100)
          return (
            <div
              key={m.id}
              className="py-3"
              style={{ borderBottom: `1px dashed ${VT.ruleSoft}` }}
            >
              <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-center gap-2">
                  {m.unlocked
                    ? <CheckCircle2 size={11} strokeWidth={1.6} style={{ color: VT.emerald }} />
                    : <Lock size={11} strokeWidth={1.6} style={{ color: VT.ashSoft }} />}
                  <span
                    className="font-sans"
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: m.unlocked ? VT.paper : VT.paperDim,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {m.label}
                  </span>
                  <span
                    className="font-mono uppercase"
                    style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.ashGhost, fontWeight: 500 }}
                  >
                    · {m.detail}
                  </span>
                </div>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 11,
                    color: m.unlocked ? VT.emerald : VT.amber,
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {m.progress} / {m.target}
                </span>
              </div>
              <div
                className="rounded-full overflow-hidden"
                style={{ height: 3, background: VT.ashWhisper }}
              >
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: VT.ease }}
                  style={{
                    background: m.unlocked ? VT.emerald : VT.amber,
                    opacity: 0.85,
                  }}
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Trophy size={9} strokeWidth={1.5} style={{ color: VT.amber, opacity: 0.7 }} />
                <span
                  className="font-mono uppercase"
                  style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.ashSoft, fontWeight: 500 }}
                >
                  Reward · {m.reward}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </CardShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   CARD SHELL — editorial container with eyebrow, title, deep-link arrow
   ══════════════════════════════════════════════════════════════════════ */
function CardShell({
  children, title, eyebrow, deepLink,
}: { children: React.ReactNode; title: string; eyebrow?: string; deepLink?: boolean }) {
  const [hover, setHover] = useState(false)
  return (
    <motion.div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      className="relative overflow-hidden"
      style={{
        background: VT.glass,
        backdropFilter: VT.blur,
        WebkitBackdropFilter: VT.blur,
        borderRadius: VT.cardRadius,
        border: `1px solid ${hover ? VT.ruleStrong : VT.rule}`,
        boxShadow: hover ? VT.cardShadowHover : VT.cardShadow,
        transition: "border-color 0.25s, box-shadow 0.3s",
      }}
    >
      {/* top hairline shimmer on hover */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        animate={{ opacity: hover ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(90deg, transparent 5%, ${amber(0.32)} 50%, transparent 95%)`,
        }}
      />

      {/* shine sweep on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ x: hover ? ["-100%", "120%"] : "-100%" }}
        transition={{ duration: 0.85, ease: VT.ease }}
        style={{
          background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.022) 50%, transparent 60%)`,
        }}
      />

      {/* header */}
      <div className="flex items-baseline justify-between px-6 pt-5 pb-4">
        <div className="flex items-baseline gap-3">
          {eyebrow && (
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9.5, letterSpacing: "0.22em", color: VT.amber, fontWeight: 500 }}
            >
              {eyebrow}
            </span>
          )}
          <div className="w-12 h-px" style={{ background: VT.rule }} />
          <h3
            className="font-sans"
            style={{ fontSize: 16, fontWeight: 500, color: VT.paper, letterSpacing: "-0.01em" }}
          >
            {title}
          </h3>
        </div>
        {deepLink && (
          <button
            className="flex items-center gap-1 transition-colors duration-200"
            style={{ color: hover ? VT.amber : VT.ashSoft }}
          >
            <ArrowUpRight size={12} strokeWidth={1.7} />
          </button>
        )}
      </div>

      {children}
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   EMPTY RECORD
   ══════════════════════════════════════════════════════════════════════ */
function EmptyRecord() {
  return (
    <div
      className="relative overflow-hidden flex flex-col items-center justify-center py-20 px-8"
      style={{
        background: VT.glass,
        backdropFilter: VT.blur,
        WebkitBackdropFilter: VT.blur,
        borderRadius: VT.cardRadius,
        border: `1px solid ${VT.rule}`,
      }}
    >
      <div
        className="w-14 h-14 flex items-center justify-center mb-5"
        style={{
          background: VT.glassRecess,
          border: `1px solid ${VT.ruleSoft}`,
          borderRadius: 18,
        }}
      >
        <ScanLine size={20} strokeWidth={1.4} style={{ color: VT.amber, opacity: 0.7 }} />
      </div>
      <h3
        className="font-sans mb-2 text-center"
        style={{ fontSize: 16, color: VT.paper, fontWeight: 500, letterSpacing: "-0.01em" }}
      >
        Record builds with verified outcomes
      </h3>
      <p
        className="font-sans text-center max-w-md"
        style={{ fontSize: 12, color: VT.paperDim, lineHeight: 1.6, letterSpacing: "0.005em" }}
      >
        Submit your first forecast to begin building a track record. Every prediction is verified against market outcomes — no self-reporting, no claims, just outcomes.
      </p>
      <div className="flex items-center gap-5 mt-5 pt-5" style={{ borderTop: `1px dashed ${VT.ruleSoft}`, width: "100%", justifyContent: "center" }}>
        {[
          { label: "Outcome-verified", icon: CheckCircle2 },
          { label: "Anti-gaming", icon: Lock },
          { label: "Quality over volume", icon: Target },
        ].map((f) => (
          <div key={f.label} className="flex items-center gap-1.5">
            <f.icon size={10} strokeWidth={1.5} style={{ color: VT.amber, opacity: 0.6 }} />
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: "0.22em", color: VT.ashSoft, fontWeight: 500 }}
            >
              {f.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
