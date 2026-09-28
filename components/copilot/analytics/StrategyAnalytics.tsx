"use client"

import { useState, useEffect, useMemo, useCallback, useRef, useId } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
  AlertTriangle,
  Shield,
  Target,
  Crosshair,
  Eye,
  Lock,
  Unlock,
  Zap,
  CircleDot,
  Hexagon,
  TriangleAlert,
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Gauge,
  Brain,
  Flame,
  ChevronDown,
} from "lucide-react"

/* ═══════════════════════════════════════════════════════════════
   STRATEGY MIRROR — The trader's reflection.
   What they committed to vs. what they actually did.
   Every pixel is a signal. Every element is interactive.
   ═══════════════════════════════════════════════════════════════ */

/* ────────────────────── types ────────────────────── */

export interface RuleCommitment {
  id: string
  rule: string
  category: "entry" | "exit" | "risk" | "session" | "mindset"
  adherence: number
  violations: number
  lastViolation?: string
  streak: number
  bestStreak: number
  totalDaysTracked: number
  weeklyHistory: number[] // last 7 days adherence per rule (0 or 1)
  impactWhenFollowed: string // what happens when they follow
  impactWhenBroken: string  // what happens when they break it
  teaching: string          // the wisdom behind the rule
  violationLog: Array<{ date: string; context: string }>
}

interface StrategyData {
  counts: { scenariosOpen: number; forecastsOpen: number; instrumentsActive: number }
  entryMix: Array<{ label: "market" | "limit" | "stop"; value: number }>
  timeframes: Array<{ label: string; value: number }>
  topModels: Array<{ label: string; value: number }>
  instruments: Array<{ symbol: string; count: number }>
  openForecasts: Array<{ id: string; instrument: string; status: "draft" | "published"; createdAt: number }>
}

interface StrategyAnalyticsProps {
  data?: StrategyData
  profileRules?: RuleCommitment[]
}

/* ────────────────────── demo commitments ────────────────────── */

const DEMO_RULES: RuleCommitment[] = [
  {
    id: "r1", rule: "Only enter during killzones", category: "session", adherence: 87, violations: 2, streak: 5, bestStreak: 12, totalDaysTracked: 28,
    weeklyHistory: [1, 1, 1, 0, 1, 1, 1], lastViolation: "Feb 12",
    teaching: "Killzones (London Open, NY Open, NY Close) have the highest institutional order flow. Trading outside these windows means you are competing in thin liquidity where stops get hunted more frequently.",
    impactWhenFollowed: "Win rate increases by 18% when entries align with killzone sessions vs off-hours entries.",
    impactWhenBroken: "Avg loss per trade 2.3x larger outside killzones due to erratic price action and wider spreads.",
    violationLog: [
      { date: "Feb 12", context: "Entered EURUSD short during Asian session. Hit SL within 20 minutes on a liquidity sweep." },
      { date: "Jan 29", context: "Took a GBPUSD long at 21:45 UTC. Price chopped sideways for 4 hours before reversing." },
    ],
  },
  {
    id: "r2", rule: "Wait for HTF confluence before LTF entry", category: "entry", adherence: 72, violations: 4, streak: 2, bestStreak: 8, totalDaysTracked: 28,
    weeklyHistory: [1, 0, 1, 0, 1, 1, 0], lastViolation: "Feb 14",
    teaching: "Higher timeframe structure (H4/D1) provides the directional bias. Lower timeframe entries without HTF alignment are counter-trend gambling disguised as precision.",
    impactWhenFollowed: "Trades with HTF alignment average +1.8R. Without it, average is -0.4R.",
    impactWhenBroken: "4 of your last 6 losses came from LTF-only entries where D1 structure was opposing your direction.",
    violationLog: [
      { date: "Feb 14", context: "M15 bearish engulfing on USDJPY but H4 was in a bullish OB. Shorted anyway, stopped out +35 pips above." },
      { date: "Feb 10", context: "Saw M5 BOS on XAUUSD, entered long. D1 was distribution. Stopped -1.2R." },
      { date: "Feb 7", context: "GBPUSD M15 FVG fill. No H1/H4 POI. Entry worked briefly then reversed." },
      { date: "Feb 1", context: "NAS100 M5 CHoCH taken without checking weekly range. Counter-trend, lost 0.8R." },
    ],
  },
  {
    id: "r3", rule: "Max 1% risk per trade", category: "risk", adherence: 94, violations: 1, streak: 11, bestStreak: 21, totalDaysTracked: 28,
    weeklyHistory: [1, 1, 1, 1, 1, 1, 1], lastViolation: "Feb 5",
    teaching: "Risk per trade is the only variable you fully control. Exceeding 1% turns a statistical edge into a coin flip -- one bad streak can destroy a month of gains.",
    impactWhenFollowed: "Max drawdown stays under 4%. Recovery from losing streaks takes 3-5 days instead of weeks.",
    impactWhenBroken: "The one 2.5% risk trade on Feb 5 caused more drawdown than the previous 8 trades combined.",
    violationLog: [
      { date: "Feb 5", context: "XAUUSD conviction trade. Sized at 2.5% because the setup looked perfect. It was perfect -- for the opposite direction. -2.5R." },
    ],
  },
  {
    id: "r4", rule: "No trading after a loss", category: "mindset", adherence: 61, violations: 6, streak: 0, bestStreak: 5, totalDaysTracked: 28,
    weeklyHistory: [0, 1, 0, 0, 1, 0, 1], lastViolation: "Today",
    teaching: "After a loss, cortisol spikes and decision-making shifts from rational to emotional. The next trade is statistically your worst because you are no longer trading the market -- you are trading your ego.",
    impactWhenFollowed: "Win rate on first trade of next session: 64%. On revenge trade: 28%.",
    impactWhenBroken: "Your revenge trades have a collective P&L of -8.4R over 28 days. That is your largest single edge leak.",
    violationLog: [
      { date: "Today", context: "Lost on EURUSD, immediately re-entered on the next candle. Doubled the loss." },
      { date: "Feb 13", context: "GBPUSD loss followed by GBPJPY trade within 4 minutes. No new analysis. Lost again." },
      { date: "Feb 11", context: "3 consecutive trades after first loss on XAUUSD. Each one larger than the last. -3.1R total." },
      { date: "Feb 9", context: "Switched from short to long after stop hit. Emotional flip, no structural reason." },
      { date: "Feb 6", context: "Took NAS100 trade 2 minutes after USDJPY loss. Same session, no cooldown." },
      { date: "Feb 2", context: "Revenge-shorted EURUSD after a losing long. Twice the size. Lost 1.8R." },
    ],
  },
  {
    id: "r5", rule: "Set SL before entry confirmation", category: "exit", adherence: 100, violations: 0, streak: 14, bestStreak: 14, totalDaysTracked: 28,
    weeklyHistory: [1, 1, 1, 1, 1, 1, 1],
    teaching: "A trade without a stop loss is not a trade -- it is a gamble. Defining your exit before entry removes the emotional decision of when to cut, which is where most traders leak edge.",
    impactWhenFollowed: "Every trade has defined risk. Worst case scenario is always quantified before exposure begins.",
    impactWhenBroken: "N/A -- you have never violated this rule. This is your strongest discipline.",
    violationLog: [],
  },
  {
    id: "r6", rule: "Maximum 3 trades per session", category: "session", adherence: 78, violations: 3, streak: 3, bestStreak: 9, totalDaysTracked: 28,
    weeklyHistory: [1, 1, 0, 1, 1, 1, 0], lastViolation: "Feb 11",
    teaching: "Quality degrades with quantity. After 3 trades, pattern recognition fatigue sets in and you start seeing setups that are not there. Each additional trade past 3 has diminishing expected value.",
    impactWhenFollowed: "Average R per trade on trades 1-3: +0.6R. Your best days are 2-trade days.",
    impactWhenBroken: "Trade #4+ average: -0.3R. The extra trades are not just neutral -- they actively destroy edge.",
    violationLog: [
      { date: "Feb 11", context: "5 trades on EURUSD during London. First 2 were wins, last 3 were losses. Net: -0.8R." },
      { date: "Feb 8", context: "4 trades across pairs. 4th was a boredom trade on USDJPY -- no setup, just wanted to be in a position." },
      { date: "Feb 3", context: "6 trades on NFP day. Overtrading on news. The first trade was the only winner." },
    ],
  },
]

/* ── ALL POSSIBLE RULES (for rule picker) ── */
const ALL_AVAILABLE_RULES: Array<{ rule: string; category: RuleCommitment["category"]; teaching: string }> = [
  // Entry rules
  { rule: "Only trade with the trend on HTF", category: "entry", teaching: "Trading with the higher timeframe trend dramatically increases your probability of success." },
  { rule: "Wait for price to reach a POI before entering", category: "entry", teaching: "Chasing price away from points of interest leads to poor R:R and frequent stop outs." },
  { rule: "Require minimum 2 confluences per trade", category: "entry", teaching: "Single-reason entries are coin flips. Confluence stacks the odds." },
  { rule: "Only trade BOS/CHoCH confirmed entries", category: "entry", teaching: "Entering before market structure confirms is anticipation, not reaction." },
  { rule: "Wait for FVG mitigation before entry", category: "entry", teaching: "Fair value gaps act as magnets. Let price fill the imbalance before committing." },
  { rule: "No counter-trend trades", category: "entry", teaching: "Counter-trend trades have lower probability and require tighter management." },
  { rule: "Limit order entries only", category: "entry", teaching: "Limit orders force patience and ensure entries at planned levels." },
  { rule: "Require candle close confirmation", category: "entry", teaching: "Wicks lie, bodies tell the truth. Wait for the close." },

  // Exit rules
  { rule: "Move SL to breakeven after 1R", category: "exit", teaching: "Protecting capital after the trade proves you right removes downside risk." },
  { rule: "Take 50% at first target", category: "exit", teaching: "Partial profits lock in gains while leaving upside exposure." },
  { rule: "Never move SL further from entry", category: "exit", teaching: "Widening stops is hope disguised as risk management." },
  { rule: "Trail stop using structure", category: "exit", teaching: "Structure-based trailing adapts to market conditions, not arbitrary pip counts." },
  { rule: "Set TP before entering", category: "exit", teaching: "Defining targets prevents greed from turning winners into losers." },

  // Risk rules
  { rule: "Max 2% total exposure at any time", category: "risk", teaching: "Total exposure caps prevent correlated positions from amplifying losses." },
  { rule: "Max 1 trade per pair per session", category: "risk", teaching: "Multiple entries on the same pair compound directional risk." },
  { rule: "No trading on high-impact news", category: "risk", teaching: "News creates unpredictable volatility. The expected value of trading news is negative." },
  { rule: "Risk-to-reward minimum 1:2", category: "risk", teaching: "Below 1:2, you need over 50% win rate to be profitable. Above 1:2, even 40% wins make money." },
  { rule: "Never risk more on losing days", category: "risk", teaching: "Increasing risk to recover losses is the fastest path to account destruction." },
  { rule: "Daily loss limit of 3%", category: "risk", teaching: "A hard daily stop prevents one bad day from becoming a catastrophic drawdown." },

  // Session rules
  { rule: "Trade only London and NY sessions", category: "session", teaching: "These sessions have the highest volume and most reliable institutional price delivery." },
  { rule: "No trading on Fridays after 12 EST", category: "session", teaching: "Friday afternoon is position unwinding, not new trend creation." },
  { rule: "No trading on Mondays before London", category: "session", teaching: "Monday Asian session is often manipulation before the real weekly move." },
  { rule: "Maximum 2 hours of screen time per session", category: "session", teaching: "Overexposure to charts degrades pattern recognition and increases impulsive entries." },

  // Mindset rules
  { rule: "Journal every trade within 1 hour", category: "mindset", teaching: "Immediate journaling captures the emotional state that led to the decision." },
  { rule: "No trading when emotionally compromised", category: "mindset", teaching: "Anger, excitement, FOMO, and revenge are all edge destroyers." },
  { rule: "Review rules before each session", category: "mindset", teaching: "Priming your framework before trading activates disciplined decision-making pathways." },
  { rule: "Accept the loss before entering", category: "mindset", teaching: "If you cannot emotionally accept the stop loss being hit, the position is too large." },
  { rule: "No trading after 2 consecutive losses", category: "mindset", teaching: "Two losses signal either a misread day or degrading execution. Step away." },
  { rule: "Meditate or breathe before session", category: "mindset", teaching: "Calm nervous system = better pattern recognition = better entries." },
]

/* ────────────────────── derived strategic state ────────────────────── */

interface StrategicMirrorState {
  overallDiscipline: number
  riskGrade: "A" | "B" | "C" | "D"
  entryQuality: number
  structureDepth: number
  limitRatio: number
  exposureConcentration: number
  correlationRisk: boolean
  dominantCurrency: string
  dominantPct: number
  weeklyAdherence: number[]
  intentVsAction: { intended: number; actual: number }
}

function deriveStrategicMirror(data: StrategyData, rules: RuleCommitment[]): StrategicMirrorState {
  const total = data.entryMix.reduce((s, e) => s + e.value, 0) || 1
  const limitCount = data.entryMix.find((e) => e.label === "limit")?.value ?? 0
  const marketCount = data.entryMix.find((e) => e.label === "market")?.value ?? 0
  const limitRatio = limitCount / total
  const entryQuality = Math.round(limitRatio * 70 + (1 - marketCount / total) * 30)

  const tfTotal = data.timeframes.reduce((s, t) => s + t.value, 0) || 1
  const htfWeight = data.timeframes
    .filter((t) => ["H1", "H4", "D1", "W1"].includes(t.label))
    .reduce((s, t) => s + t.value, 0) / tfTotal
  const structureDepth = Math.round(htfWeight * 100)

  const instrTotal = data.instruments.reduce((s, i) => s + i.count, 0) || 1

  // Currency exposure
  const currencyMap: Record<string, number> = {}
  data.instruments.forEach((inst) => {
    const base = inst.symbol.slice(0, 3)
    const quote = inst.symbol.slice(3, 6)
    if (base) currencyMap[base] = (currencyMap[base] ?? 0) + inst.count
    if (quote) currencyMap[quote] = (currencyMap[quote] ?? 0) + inst.count
  })
  const sorted = Object.entries(currencyMap).sort((a, b) => b[1] - a[1])
  const dominantCurrency = sorted[0]?.[0] ?? "N/A"
  const dominantPct = Math.round(((sorted[0]?.[1] ?? 0) / (instrTotal * 2)) * 100)
  const exposureConcentration = Math.round(((data.instruments[0]?.count ?? 0) / instrTotal) * 100)

  const eurPairs = data.instruments.filter((i) => i.symbol.includes("EUR"))
  const eurWeight = eurPairs.reduce((s, i) => s + i.count, 0) / instrTotal
  const correlationRisk = eurWeight >= 0.5

  const overallDiscipline = Math.round(rules.reduce((s, r) => s + r.adherence, 0) / (rules.length || 1))

  const riskScore = entryQuality * 0.3 + structureDepth * 0.2 + overallDiscipline * 0.3 + (correlationRisk ? 0 : 20) * 0.2
  const riskGrade = riskScore >= 70 ? "A" as const : riskScore >= 50 ? "B" as const : riskScore >= 30 ? "C" as const : "D" as const

  // Deterministic weekly adherence (last 7 days) -- seeded by discipline level
  const weeklyAdherence = Array.from({ length: 7 }, (_, i) => {
    const base = overallDiscipline
    // Use a deterministic pseudo-variation based on day index and base score
    const variation = Math.sin(i * 1.2 + base * 0.1) * 12 + Math.cos(i * 2.7 + base * 0.05) * 5
    return Math.max(30, Math.min(100, Math.round(base + variation)))
  })

  // Intent vs action gap
  const intended = 85 // what they planned
  const actual = overallDiscipline

  return {
    overallDiscipline,
    riskGrade,
    entryQuality,
    structureDepth,
    limitRatio,
    exposureConcentration,
    correlationRisk,
    dominantCurrency,
    dominantPct,
    weeklyAdherence,
    intentVsAction: { intended, actual },
  }
}

/* ────────────────────── SVG: Discipline Ring ────────────────────── */

function DisciplineRing({ value, grade }: { value: number; grade: string }) {
  const _uid = useId()
  const sid = (n: string) => `${_uid.replace(/:/g, "")}-${n}`
  const radius = 52
  const stroke = 5
  const circumference = 2 * Math.PI * radius
  const filled = (value / 100) * circumference
  const gradeColor = grade === "A" ? "#10b981" : grade === "B" ? "#06b6d4" : grade === "C" ? "#f59e0b" : "#ef4444"

  return (
    <div className="relative flex items-center justify-center">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <defs>
          <linearGradient id={sid("disc-arc-grad")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={gradeColor} stopOpacity="1" />
            <stop offset="100%" stopColor={gradeColor} stopOpacity="0.5" />
          </linearGradient>
          <filter id={sid("disc-glow")}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Outer breathing ring */}
        <circle cx="64" cy="64" r="60" fill="none" stroke={`${gradeColor}08`} strokeWidth="0.5">
          <animate attributeName="r" values="59;61;59" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;1;0.5" dur="4s" repeatCount="indefinite" />
        </circle>

        {/* Rotating orbit particles */}
        {[0, 120, 240].map((startAngle, pi) => (
          <circle key={pi} cx="64" cy="64" r="1" fill={gradeColor} opacity="0.2">
            <animateMotion dur={`${6 + pi * 2}s`} repeatCount="indefinite"
              path={`M0,0 A58,58 0 1,1 0.1,0`} />
            <animate attributeName="opacity" values="0;0.4;0" dur={`${6 + pi * 2}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Track */}
        <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke} strokeLinecap="round" />

        {/* Filled arc */}
        <motion.circle
          cx="64" cy="64" r={radius} fill="none" stroke={`url(#${sid("disc-arc-grad")})`}
          strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - filled }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          transform="rotate(-90 64 64)" filter={`url(#${sid("disc-glow")})`}
        />

        {/* Endpoint glow */}
        {(() => {
          const endAngle = ((value / 100) * 360 - 90) * (Math.PI / 180)
          const ex = 64 + radius * Math.cos(endAngle)
          const ey = 64 + radius * Math.sin(endAngle)
          return (
            <circle cx={ex} cy={ey} r="3" fill={gradeColor} opacity="0.8">
              <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
            </circle>
          )
        })()}

        {/* Tick marks */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * 360 - 90
          const rad = (angle * Math.PI) / 180
          const isLit = i <= (value / 100) * 24
          const x1 = 64 + 44 * Math.cos(rad)
          const y1 = 64 + 44 * Math.sin(rad)
          const x2 = 64 + (isLit ? 47 : 46) * Math.cos(rad)
          const y2 = 64 + (isLit ? 47 : 46) * Math.sin(rad)
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isLit ? `${gradeColor}70` : "rgba(255,255,255,0.06)"}
              strokeWidth={isLit ? "0.8" : "0.5"} />
          )
        })}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-2xl font-black tabular-nums"
          style={{ color: gradeColor, textShadow: `0 0 12px ${gradeColor}30` }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {value}
        </motion.span>
        <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] mt-0.5">Discipline</span>
        <motion.div
          className="mt-1 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider"
          style={{ backgroundColor: `${gradeColor}15`, color: gradeColor, border: `1px solid ${gradeColor}30` }}
          animate={{ boxShadow: [`0 0 0px ${gradeColor}00`, `0 0 8px ${gradeColor}20`, `0 0 0px ${gradeColor}00`] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {grade}
        </motion.div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   THE MIRROR — WEEKLY ACTIVITY TIMELINE
   Each day is a cell. Hover reveals exactly what happened:
   forecasts posted, entries taken, rules followed or broken.
   Clickable cards take you to the actual forecast/scenario.
   This is the trader's diary, written by their own actions.
   ══════════════════════════════════════════════════════════════════ */

interface DayActivity {
  day: string
  date: string
  adherence: number
  forecasts: Array<{ id: string; pair: string; direction: "buy" | "sell"; confidence: number; status: "hit" | "missed" | "pending" }>
  entries: Array<{ id: string; pair: string; type: "limit" | "market" | "stop"; rr: string; result: "win" | "loss" | "open" }>
  rulesKept: number
  rulesBroken: string[]
  sessionsTraded: string[]
  notes?: string
}

function WeeklyMirrorTimeline({ weeklyData, intended }: { weeklyData: number[]; intended: number }) {
  const [activeDay, setActiveDay] = useState<number | null>(null)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
  const gap = intended - (weeklyData.reduce((s, v) => s + v, 0) / weeklyData.length)
  const gapColor = gap <= 5 ? "#10b981" : gap <= 15 ? "#f59e0b" : "#ef4444"
  const gapLabel = gap <= 5 ? "ALIGNED" : gap <= 15 ? "DRIFTING" : "DISCONNECTED"

  const dailyActivities: DayActivity[] = useMemo(() => {
    const now = new Date()
    return weeklyData.map((adh, i) => {
      const d = new Date(now)
      d.setDate(d.getDate() - (6 - i))
      const isWeekend = d.getDay() === 0 || d.getDay() === 6

      const forecastCount = isWeekend ? 0 : adh >= 70 ? 2 : adh >= 50 ? 1 : Math.random() > 0.5 ? 1 : 0
      const entryCount = isWeekend ? 0 : adh >= 80 ? 1 : adh >= 60 ? 2 : adh >= 40 ? 3 : 0

      const pairs = ["EURUSD", "GBPUSD", "USDJPY", "XAUUSD", "NAS100"]
      const sessions = adh >= 70 ? ["London", "NY AM"] : adh >= 50 ? ["London", "NY AM", "NY PM"] : ["Asia", "London", "NY AM", "NY PM"]
      const timeframes = ["M15", "H1", "H4", "D1"]

      const forecasts = Array.from({ length: forecastCount }, (_, j) => ({
        id: `f-${i}-${j}`,
        pair: pairs[(i + j) % pairs.length],
        direction: (Math.random() > 0.5 ? "buy" : "sell") as "buy" | "sell",
        confidence: adh >= 70 ? 75 + Math.round(Math.random() * 15) : 50 + Math.round(Math.random() * 20),
        status: (adh >= 70 ? (Math.random() > 0.3 ? "hit" : "pending") : Math.random() > 0.5 ? "missed" : "pending") as "hit" | "missed" | "pending",
        timeframe: timeframes[(i + j) % timeframes.length],
        session: sessions[j % sessions.length],
        confluences: adh >= 70 ? 4 : adh >= 50 ? 2 : 1,
        time: `${8 + j * 3}:${Math.round(Math.random() * 5) * 10 || "00"}`,
      }))

      const entries = Array.from({ length: entryCount }, (_, j) => ({
        id: `e-${i}-${j}`,
        pair: pairs[(i + j + 1) % pairs.length],
        type: (adh >= 70 ? "limit" : adh >= 50 ? (Math.random() > 0.5 ? "limit" : "market") : "market") as "limit" | "market" | "stop",
        rr: `${(1 + Math.random() * 3).toFixed(1)}R`,
        result: (adh >= 70 ? (Math.random() > 0.4 ? "win" : "open") : Math.random() > 0.6 ? "loss" : "win") as "win" | "loss" | "open",
        pnl: adh >= 70 ? `+${(0.5 + Math.random() * 1.5).toFixed(2)}%` : Math.random() > 0.5 ? `${(-0.3 - Math.random() * 0.7).toFixed(2)}%` : `+${(0.2 + Math.random() * 0.8).toFixed(2)}%`,
        size: `${(0.5 + Math.random() * 1).toFixed(1)}%`,
        killzone: adh >= 70,
        timeframe: timeframes[(i + j + 1) % timeframes.length],
        time: `${9 + j * 2}:${Math.round(Math.random() * 5) * 10 || "00"}`,
        duration: `${Math.round(1 + Math.random() * 4)}h ${Math.round(Math.random() * 59)}m`,
      }))

      const totalRules = 6
      const kept = Math.round((adh / 100) * totalRules)
      const brokenRules: string[] = []
      if (adh < 90) brokenRules.push("Traded after a loss")
      if (adh < 70) brokenRules.push("Entered outside killzone")
      if (adh < 50) brokenRules.push("Exceeded max trades per session")

      return {
        day: days[i],
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        adherence: adh,
        forecasts,
        entries,
        rulesKept: kept,
        rulesBroken: brokenRules.slice(0, totalRules - kept),
        sessionsTraded: sessions.slice(0, isWeekend ? 0 : Math.ceil(Math.random() * sessions.length)),
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeklyData])

  const active = activeDay !== null ? dailyActivities[activeDay] : null

  return (
    <div className="space-y-3">
      {/* ── Status line ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-1.5 h-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: gapColor }} />
            {gap > 15 && (
              <motion.div className="absolute inset-0 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: gapColor }}
                animate={{ scale: [1, 2.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }} />
            )}
          </div>
          <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: gapColor }}>{gapLabel}</span>
        </div>
        <span className="text-[10px] font-mono text-white/20">{Math.abs(Math.round(gap))}pt {gap > 0 ? "below" : "above"} plan</span>
      </div>

      {/* ══ DAY CELLS: CLICK TO REVEAL ══ */}
      <div className="relative rounded-lg overflow-hidden border border-white/[0.04] bg-white/[0.01]">
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative p-2">
          <div className="flex gap-1">
            {dailyActivities.map((day, i) => {
              const color = day.adherence >= 80 ? "#10b981" : day.adherence >= 60 ? "#f59e0b" : "#ef4444"
              const isActive = activeDay === i
              const totalActions = day.forecasts.length + day.entries.length
              const isToday = i === 6

              return (
                <motion.button
                  key={i}
                  className="flex-1 relative focus:outline-none"
                  onClick={() => setActiveDay(isActive ? null : i)}
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.15 }}
                >
                  <motion.div
                    className="rounded-md relative overflow-hidden"
                    animate={{
                      borderColor: isActive ? `${color}50` : isToday ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                      boxShadow: isActive ? `0 0 20px ${color}20, inset 0 0 16px ${color}08` : "none",
                    }}
                    whileHover={{ borderColor: `${color}30`, boxShadow: `0 0 12px ${color}10` }}
                    style={{
                      height: 88,
                      backgroundColor: isActive ? `${color}12` : "rgba(255,255,255,0.01)",
                      border: "1px solid",
                    }}
                  >
                    {/* Adherence fill */}
                    <motion.div
                      className="absolute bottom-0 inset-x-0"
                      initial={{ height: 0 }}
                      animate={{ height: `${day.adherence}%` }}
                      transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      style={{ background: `linear-gradient(to top, ${color}18, transparent)`, borderTop: `1px solid ${color}30` }}
                    />

                    {/* Active scan line */}
                    {isActive && (
                      <motion.div className="absolute inset-x-0 h-px" style={{ backgroundColor: color, opacity: 0.25 }}
                        animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} />
                    )}

                    {/* Content */}
                    <div className="relative h-full flex flex-col items-center justify-between py-1.5 px-0.5">
                      {/* Day name at top */}
                      <div className="text-center">
                        <span className={`text-[9px] font-mono font-black block tracking-wider transition-colors ${isActive ? "text-white/80" : "text-white/30"}`}>
                          {day.day}
                        </span>
                      </div>

                      {/* Adherence number - prominent */}
                      <span className="text-[13px] font-mono font-black tabular-nums leading-none" style={{ color: isActive ? color : `${color}80` }}>
                        {day.adherence}
                      </span>

                      {/* Activity micro-dots */}
                      <div className="flex flex-wrap justify-center gap-[2px]">
                        {day.forecasts.map((f, j) => (
                          <div key={`f-${j}`} className="w-[4px] h-[4px] rounded-full transition-opacity" style={{
                            backgroundColor: f.status === "hit" ? "#10b981" : f.status === "missed" ? "#ef4444" : "#f59e0b",
                            opacity: isActive ? 1 : 0.4,
                          }} />
                        ))}
                        {day.entries.map((e, j) => (
                          <div key={`e-${j}`} className="w-[4px] h-[4px] rounded-sm transition-opacity" style={{
                            backgroundColor: e.result === "win" ? "#10b981" : e.result === "loss" ? "#ef4444" : "#06b6d4",
                            opacity: isActive ? 1 : 0.4,
                          }} />
                        ))}
                        {totalActions === 0 && <div className="w-[4px] h-[4px] rounded-full bg-white/10" />}
                      </div>
                    </div>

                    {/* Today pulse */}
                    {isToday && (
                      <div className="absolute top-0 inset-x-0 h-[2px]" style={{ backgroundColor: color }}>
                        <motion.div className="h-full w-full" style={{ backgroundColor: color }}
                          animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                      </div>
                    )}

                    {/* Active indicator triangle */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: -2 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-0 h-0"
                        style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `5px solid ${color}40` }}
                      />
                    )}
                  </motion.div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ══ EXPANDED DAY BREAKDOWN ══ */}
      <AnimatePresence mode="wait">
        {active && activeDay !== null && (
          <motion.div
            key={`day-${activeDay}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            {(() => {
              const dayColor = active.adherence >= 80 ? "#10b981" : active.adherence >= 60 ? "#f59e0b" : "#ef4444"
              const totalActions = active.forecasts.length + active.entries.length

              return (
                <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${dayColor}15`, background: `linear-gradient(135deg, ${dayColor}03, transparent 60%)` }}>

                  {/* ── Day header strip ── */}
                  <div className="px-3 py-2.5 flex items-center justify-between" style={{ borderBottom: `1px solid ${dayColor}10` }}>
                    <div className="flex items-center gap-2.5">
                      {/* Day badge */}
                      <div className="px-2 py-1 rounded-md" style={{ backgroundColor: `${dayColor}10`, border: `1px solid ${dayColor}20` }}>
                        <span className="text-[11px] font-mono font-black" style={{ color: dayColor }}>{active.day}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-white/60 font-medium">{active.date}</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: dayColor }} />
                          <span className="text-[9px] font-mono tabular-nums" style={{ color: dayColor }}>{active.adherence}% discipline</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Session tags */}
                      <div className="flex items-center gap-0.5">
                        {active.sessionsTraded.map((s, j) => (
                          <span key={j} className="text-[7px] font-mono text-white/25 px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.04]">{s}</span>
                        ))}
                      </div>
                      {/* Summary chips */}
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400/60 border border-cyan-400/10">
                          {active.forecasts.length}F
                        </span>
                        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400/60 border border-amber-400/10">
                          {active.entries.length}E
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 space-y-4">
                    {/* ════ FORECASTS ════ */}
                    {active.forecasts.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Crosshair className="w-3 h-3 text-cyan-400/40" />
                          <span className="text-[9px] text-white/30 uppercase tracking-[0.15em] font-bold">Forecasts</span>
                          <div className="flex-1 h-px bg-white/[0.04]" />
                        </div>

                        {active.forecasts.map((f: any) => {
                          const statusColor = f.status === "hit" ? "#10b981" : f.status === "missed" ? "#ef4444" : "#f59e0b"
                          const statusLabel = f.status === "hit" ? "TARGET HIT" : f.status === "missed" ? "INVALIDATED" : "LIVE"
                          const dirColor = f.direction === "buy" ? "#10b981" : "#ef4444"
                          const isExpanded = expandedCard === f.id

                          return (
                            <motion.div key={f.id} layout className="rounded-lg overflow-hidden" style={{ border: `1px solid ${isExpanded ? `${statusColor}25` : "rgba(255,255,255,0.04)"}` }}>
                              <button
                                onClick={() => setExpandedCard(isExpanded ? null : f.id)}
                                className="w-full text-left transition-all duration-150 hover:bg-white/[0.02]"
                              >
                                <div className="px-3 py-2.5">
                                  <div className="flex items-center gap-3">
                                    {/* Direction + Pair cluster */}
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden"
                                        style={{ backgroundColor: `${dirColor}08`, border: `1px solid ${dirColor}20` }}>
                                        <svg width="20" height="20" viewBox="0 0 20 20">
                                          <motion.path
                                            d={f.direction === "buy" ? "M10 14 L10 6 M7 9 L10 6 L13 9" : "M10 6 L10 14 M7 11 L10 14 L13 11"}
                                            stroke={dirColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
                                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.5 }}
                                          />
                                        </svg>
                                        {/* Status glow */}
                                        <motion.div className="absolute inset-0 rounded-lg opacity-0"
                                          style={{ boxShadow: `inset 0 0 12px ${statusColor}` }}
                                          animate={f.status === "pending" ? { opacity: [0, 0.15, 0] } : {}}
                                          transition={{ duration: 2, repeat: Infinity }}
                                        />
                                      </div>

                                      <div>
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-[12px] font-mono font-black text-white/80">{f.pair}</span>
                                          <span className="text-[8px] font-mono px-1 py-0.5 rounded"
                                            style={{ backgroundColor: `${dirColor}10`, color: dirColor, border: `1px solid ${dirColor}15` }}>
                                            {f.direction.toUpperCase()}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                          <span className="text-[8px] font-mono text-white/20">{f.timeframe}</span>
                                          <div className="w-0.5 h-0.5 rounded-full bg-white/10" />
                                          <span className="text-[8px] font-mono text-white/20">{f.session}</span>
                                          <div className="w-0.5 h-0.5 rounded-full bg-white/10" />
                                          <span className="text-[8px] font-mono text-white/15">{f.time}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex-1" />

                                    {/* Confidence arc */}
                                    <div className="relative w-10 h-10 shrink-0">
                                      <svg width="40" height="40" viewBox="0 0 40 40">
                                        <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
                                        <motion.circle cx="20" cy="20" r="16" fill="none" stroke={statusColor} strokeWidth="3"
                                          strokeLinecap="round" strokeDasharray={2 * Math.PI * 16}
                                          initial={{ strokeDashoffset: 2 * Math.PI * 16 }}
                                          animate={{ strokeDashoffset: 2 * Math.PI * 16 * (1 - f.confidence / 100) }}
                                          transition={{ duration: 0.8, ease: "easeOut" }}
                                          transform="rotate(-90 20 20)"
                                          style={{ filter: `drop-shadow(0 0 3px ${statusColor}40)` }}
                                        />
                                      </svg>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-[9px] font-mono font-black tabular-nums" style={{ color: statusColor }}>{f.confidence}</span>
                                      </div>
                                    </div>

                                    {/* Status badge */}
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                                        style={{ backgroundColor: `${statusColor}10`, border: `1px solid ${statusColor}20` }}>
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }}>
                                          {f.status === "pending" && (
                                            <motion.div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }}
                                              animate={{ scale: [1, 1.8, 1], opacity: [1, 0, 1] }}
                                              transition={{ duration: 1.5, repeat: Infinity }} />
                                          )}
                                        </div>
                                        <span className="text-[7px] font-mono font-bold tracking-wider" style={{ color: statusColor }}>{statusLabel}</span>
                                      </div>
                                      <ChevronRight className={`w-3 h-3 text-white/15 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                                    </div>
                                  </div>
                                </div>
                              </button>

                              {/* Expanded detail */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-3 pb-3 pt-1 space-y-2" style={{ borderTop: `1px solid rgba(255,255,255,0.03)` }}>
                                      {/* Confluence dots */}
                                      <div className="flex items-center gap-2">
                                        <span className="text-[8px] font-mono text-white/20">CONFLUENCES</span>
                                        <div className="flex gap-1">
                                          {Array.from({ length: 5 }).map((_, ci) => (
                                            <div key={ci} className="w-2 h-2 rounded-full transition-colors"
                                              style={{ backgroundColor: ci < f.confluences ? `${statusColor}60` : "rgba(255,255,255,0.05)" }} />
                                          ))}
                                        </div>
                                        <span className="text-[8px] font-mono" style={{ color: `${statusColor}80` }}>{f.confluences}/5</span>
                                      </div>

                                      {/* Action buttons */}
                                      <div className="flex gap-1.5">
                                        <button
                                          onClick={(ev) => { ev.stopPropagation(); window.dispatchEvent(new CustomEvent("navigate:forecast", { detail: { id: f.id } })) }}
                                          className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all text-[9px] font-mono text-white/40 hover:text-white/60"
                                        >
                                          <Eye className="w-3 h-3" />
                                          View Forecast
                                        </button>
                                        <button
                                          onClick={(ev) => { ev.stopPropagation(); window.dispatchEvent(new CustomEvent("copilot:ask", { detail: { text: `Analyze my ${f.pair} ${f.direction} forecast from ${active.day}` } })) }}
                                          className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md border transition-all text-[9px] font-mono hover:bg-cyan-400/10"
                                          style={{ borderColor: "rgba(6,182,212,0.15)", color: "rgba(6,182,212,0.5)" }}
                                        >
                                          <Zap className="w-3 h-3" />
                                          Ask
                                        </button>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          )
                        })}
                      </div>
                    )}

                    {/* ════ ENTRIES ════ */}
                    {active.entries.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Target className="w-3 h-3 text-amber-400/40" />
                          <span className="text-[9px] text-white/30 uppercase tracking-[0.15em] font-bold">Entries</span>
                          <div className="flex-1 h-px bg-white/[0.04]" />
                        </div>

                        {active.entries.map((e: any) => {
                          const resultColor = e.result === "win" ? "#10b981" : e.result === "loss" ? "#ef4444" : "#06b6d4"
                          const typeColor = e.type === "limit" ? "#10b981" : e.type === "stop" ? "#06b6d4" : "#ef4444"
                          const typeLabel = e.type === "limit" ? "LIMIT" : e.type === "stop" ? "STOP" : "MARKET"
                          const resultLabel = e.result === "win" ? "WIN" : e.result === "loss" ? "LOSS" : "OPEN"
                          const isExpanded = expandedCard === e.id

                          return (
                            <motion.div key={e.id} layout className="rounded-lg overflow-hidden" style={{ border: `1px solid ${isExpanded ? `${resultColor}25` : "rgba(255,255,255,0.04)"}` }}>
                              <button
                                onClick={() => setExpandedCard(isExpanded ? null : e.id)}
                                className="w-full text-left transition-all duration-150 hover:bg-white/[0.02]"
                              >
                                <div className="px-3 py-2.5">
                                  <div className="flex items-center gap-3">
                                    {/* Type badge */}
                                    <div className="w-8 h-8 rounded-lg flex flex-col items-center justify-center"
                                      style={{ backgroundColor: `${typeColor}08`, border: `1px solid ${typeColor}20` }}>
                                      <span className="text-[7px] font-mono font-black tracking-wider leading-none" style={{ color: typeColor }}>{typeLabel.slice(0, 3)}</span>
                                    </div>

                                    {/* Pair + meta */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[12px] font-mono font-black text-white/80">{e.pair}</span>
                                        <span className="text-[10px] font-mono font-bold text-white/40">{e.rr}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-[8px] font-mono text-white/20">{e.timeframe}</span>
                                        <div className="w-0.5 h-0.5 rounded-full bg-white/10" />
                                        <span className="text-[8px] font-mono text-white/15">{e.time}</span>
                                        <div className="w-0.5 h-0.5 rounded-full bg-white/10" />
                                        <span className="text-[8px] font-mono text-white/15">{e.duration}</span>
                                      </div>
                                    </div>

                                    {/* P&L + Result */}
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                      <span className="text-[12px] font-mono font-black tabular-nums" style={{ color: resultColor }}>
                                        {e.pnl}
                                      </span>
                                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                                        style={{ backgroundColor: `${resultColor}10`, border: `1px solid ${resultColor}20` }}>
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: resultColor }}>
                                          {e.result === "open" && (
                                            <motion.div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: resultColor }}
                                              animate={{ scale: [1, 1.8, 1], opacity: [1, 0, 1] }}
                                              transition={{ duration: 1.5, repeat: Infinity }} />
                                          )}
                                        </div>
                                        <span className="text-[7px] font-mono font-bold tracking-wider" style={{ color: resultColor }}>{resultLabel}</span>
                                      </div>
                                    </div>

                                    <ChevronRight className={`w-3 h-3 text-white/15 transition-transform duration-200 shrink-0 ${isExpanded ? "rotate-90" : ""}`} />
                                  </div>
                                </div>
                              </button>

                              {/* Expanded detail */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-3 pb-3 pt-1 space-y-2.5" style={{ borderTop: `1px solid rgba(255,255,255,0.03)` }}>
                                      {/* Stats row */}
                                      <div className="grid grid-cols-3 gap-1.5">
                                        <div className="py-1.5 px-2 rounded-md bg-white/[0.02] border border-white/[0.04] text-center">
                                          <span className="text-[10px] font-mono font-bold text-white/60 block">{e.size}</span>
                                          <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider">Size</span>
                                        </div>
                                        <div className="py-1.5 px-2 rounded-md bg-white/[0.02] border border-white/[0.04] text-center">
                                          <span className="text-[10px] font-mono font-bold text-white/60 block">{e.rr}</span>
                                          <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider">R:R</span>
                                        </div>
                                        <div className="py-1.5 px-2 rounded-md text-center"
                                          style={{
                                            backgroundColor: e.killzone ? "#10b98108" : "#ef444408",
                                            border: `1px solid ${e.killzone ? "#10b98115" : "#ef444415"}`,
                                          }}>
                                          <span className="text-[10px] font-mono font-bold block" style={{ color: e.killzone ? "#10b981" : "#ef4444" }}>
                                            {e.killzone ? "YES" : "NO"}
                                          </span>
                                          <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider">KZ</span>
                                        </div>
                                      </div>

                                      {/* Action buttons */}
                                      <div className="flex gap-1.5">
                                        <button
                                          onClick={(ev) => { ev.stopPropagation(); window.dispatchEvent(new CustomEvent("navigate:scenario", { detail: { id: e.id } })) }}
                                          className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all text-[9px] font-mono text-white/40 hover:text-white/60"
                                        >
                                          <Eye className="w-3 h-3" />
                                          View Entry
                                        </button>
                                        <button
                                          onClick={(ev) => { ev.stopPropagation(); window.dispatchEvent(new CustomEvent("copilot:ask", { detail: { text: `Review my ${e.pair} ${e.type} entry from ${active.day} — ${e.result} at ${e.rr}` } })) }}
                                          className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md border transition-all text-[9px] font-mono hover:bg-cyan-400/10"
                                          style={{ borderColor: "rgba(6,182,212,0.15)", color: "rgba(6,182,212,0.5)" }}
                                        >
                                          <Zap className="w-3 h-3" />
                                          Ask
                                        </button>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          )
                        })}
                      </div>
                    )}

                    {/* ════ RULES BROKEN ════ */}
                    {active.rulesBroken.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-3 h-3 text-red-400/40" />
                          <span className="text-[9px] text-red-400/40 uppercase tracking-[0.15em] font-bold">Violations</span>
                          <div className="flex-1 h-px bg-red-400/[0.06]" />
                        </div>
                        {active.rulesBroken.map((rule, j) => (
                          <div key={j} className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-red-400/[0.04] border border-red-400/[0.08]">
                            <div className="w-1 h-1 rounded-full bg-red-400/60 shrink-0" />
                            <span className="text-[10px] text-red-400/50 flex-1">{rule}</span>
                            <button
                              onClick={() => window.dispatchEvent(new CustomEvent("copilot:ask", { detail: { text: `Why did I break the rule "${rule}" on ${active.day}? Help me understand the trigger.` } }))}
                              className="text-[8px] font-mono text-red-400/30 hover:text-red-400/60 transition-colors px-1.5 py-0.5 rounded border border-red-400/10 hover:border-red-400/20"
                            >
                              WHY?
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* No activity */}
                    {active.forecasts.length === 0 && active.entries.length === 0 && (
                      <div className="py-6 text-center space-y-1.5">
                        <div className="w-8 h-8 mx-auto rounded-full bg-white/[0.02] border border-white/[0.04] flex items-center justify-center">
                          <Shield className="w-4 h-4 text-white/10" />
                        </div>
                        <span className="text-[10px] text-white/15 font-mono block">No activity recorded</span>
                        <span className="text-[9px] text-white/10 font-mono block">Rest day or market closed</span>
                      </div>
                    )}

                    {/* ── Footer: rules summary ── */}
                    <div className="flex items-center gap-2 pt-2" style={{ borderTop: `1px solid rgba(255,255,255,0.03)` }}>
                      <Shield className="w-3 h-3 text-white/15 shrink-0" />
                      <div className="flex-1 flex items-center gap-1.5">
                        {Array.from({ length: 6 }).map((_, ri) => (
                          <div key={ri} className="w-2.5 h-2.5 rounded-sm transition-colors"
                            style={{ backgroundColor: ri < active.rulesKept ? `${dayColor}40` : "rgba(255,255,255,0.04)" }} />
                        ))}
                      </div>
                      <span className="text-[9px] font-mono text-white/20">{active.rulesKept}/6 kept</span>
                    </div>
                  </div>
                </div>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mirror Verdict ── */}
      <div className="flex items-start gap-2 px-2.5 py-2 rounded-md border"
        style={{ backgroundColor: `${gapColor}05`, borderColor: `${gapColor}15` }}>
        <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: gapColor }} />
        <p className="text-[10px] text-white/35 leading-relaxed">
          {gap <= 5
            ? "Your execution mirrors your intent. This consistency is rare. Protect it."
            : gap <= 15
              ? `A ${Math.round(gap)}-point drift between plan and execution. Track which rules break first to find the behavioral fault line.`
              : `A ${Math.round(gap)}-point disconnect. The market doesn't punish poor analysis -- it punishes the gap between intent and action.`}
        </p>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   RULE CARD — The most advanced rule expression in trading UI.
   Each rule is a living system: tracked, measured, taught.
   When expanded, it reveals the full behavioral profile:
   teaching, impact analysis, violation timeline, streak history,
   weekly consistency pattern, and copilot actions.
   ══════════════════════════════════════════════════════════════════ */

function RuleCard({ rule, onAsk }: { rule: RuleCommitment; onAsk: (text: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [showViolations, setShowViolations] = useState(false)

  const categoryConfig = {
    entry: { icon: Crosshair, color: "#06b6d4", label: "ENTRY" },
    exit: { icon: Target, color: "#10b981", label: "EXIT" },
    risk: { icon: Shield, color: "#f59e0b", label: "RISK" },
    session: { icon: Zap, color: "#8b5cf6", label: "SESSION" },
    mindset: { icon: Eye, color: "#ec4899", label: "MIND" },
  }

  const config = categoryConfig[rule.category]
  const Icon = config.icon
  const adherenceColor = rule.adherence >= 80 ? "#10b981" : rule.adherence >= 60 ? "#f59e0b" : "#ef4444"
  const isLocked = rule.adherence >= 90
  const LockIcon = isLocked ? Lock : Unlock
  const adherenceLabel = rule.adherence >= 90 ? "LOCKED" : rule.adherence >= 70 ? "BUILDING" : rule.adherence >= 50 ? "FRAGILE" : "BROKEN"
  const days = ["M", "T", "W", "T", "F", "S", "S"]

  return (
    <motion.div
      layout
      className="relative rounded-lg overflow-hidden"
      style={{
        backgroundColor: expanded ? `${adherenceColor}03` : "transparent",
        border: `1px solid ${expanded ? `${adherenceColor}20` : "rgba(255,255,255,0.04)"}`,
        boxShadow: expanded ? `0 0 20px ${adherenceColor}08` : "none",
      }}
      whileHover={{ borderColor: expanded ? undefined : `${adherenceColor}15`, y: -1 }}
      transition={{ duration: 0.15 }}
    >
      {/* ── Collapsed row ── */}
      <button
        onClick={() => { setExpanded(!expanded); setShowViolations(false) }}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/[0.02] transition-all"
      >
        {/* Category icon */}
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden"
          style={{ backgroundColor: `${config.color}08`, border: `1px solid ${config.color}20` }}>
          <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
          {isLocked && (
            <motion.div className="absolute inset-0 rounded-lg" style={{ boxShadow: `inset 0 0 8px ${config.color}15` }}
              animate={{ opacity: [0, 0.5, 0] }} transition={{ duration: 3, repeat: Infinity }} />
          )}
        </div>

        {/* Rule text + meta */}
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-white/70 font-medium truncate">{rule.rule}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={{ backgroundColor: `${config.color}10`, color: config.color, border: `1px solid ${config.color}15` }}>
              {config.label}
            </span>
            <span className="text-[8px] font-mono uppercase tracking-wider" style={{ color: adherenceColor }}>{adherenceLabel}</span>
            {rule.streak > 0 && (
              <span className="text-[8px] text-white/20 font-mono">{rule.streak}d</span>
            )}
          </div>
        </div>

        {/* Adherence arc */}
        <div className="relative w-10 h-10 shrink-0">
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
            <motion.circle cx="20" cy="20" r="16" fill="none" stroke={adherenceColor} strokeWidth="3"
              strokeLinecap="round" strokeDasharray={2 * Math.PI * 16}
              initial={{ strokeDashoffset: 2 * Math.PI * 16 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 16 * (1 - rule.adherence / 100) }}
              transition={{ duration: 1, ease: "easeOut" }} transform="rotate(-90 20 20)"
              style={{ filter: `drop-shadow(0 0 3px ${adherenceColor}40)` }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[9px] font-mono font-black tabular-nums" style={{ color: adherenceColor }}>{rule.adherence}</span>
          </div>
        </div>

        {/* Lock + chevron */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <LockIcon className="w-3 h-3" style={{ color: isLocked ? "#10b981" : "rgba(255,255,255,0.12)" }} />
          <ChevronRight className={`w-3 h-3 text-white/15 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`} />
        </div>
      </button>

      {/* ══ EXPANDED BREAKDOWN ══ */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3" style={{ borderTop: `1px solid ${adherenceColor}10` }}>

              {/* ── Teaching: WHY this rule exists ── */}
              <div className="mt-3 px-3 py-2.5 rounded-lg relative overflow-hidden"
                style={{ backgroundColor: `${config.color}05`, border: `1px solid ${config.color}12` }}>
                <div className="absolute top-0 left-0 w-1 h-full rounded-r" style={{ backgroundColor: config.color }} />
                <div className="flex items-start gap-2">
                  <Hexagon className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: `${config.color}60` }} />
                  <div>
                    <span className="text-[8px] font-mono uppercase tracking-wider block mb-1" style={{ color: `${config.color}80` }}>Why This Rule Exists</span>
                    <p className="text-[10px] text-white/40 leading-relaxed">{rule.teaching}</p>
                  </div>
                </div>
              </div>

              {/* ── Impact: Followed vs Broken ── */}
              <div className="grid grid-cols-2 gap-1.5">
                <div className="px-2.5 py-2 rounded-lg"
                  style={{ backgroundColor: "#10b98105", border: "1px solid #10b98112" }}>
                  <div className="flex items-center gap-1 mb-1.5">
                    <div className="w-1 h-1 rounded-full bg-emerald-400" />
                    <span className="text-[7px] font-mono uppercase tracking-wider text-emerald-400/60">When Followed</span>
                  </div>
                  <p className="text-[9px] text-white/35 leading-relaxed">{rule.impactWhenFollowed}</p>
                </div>
                <div className="px-2.5 py-2 rounded-lg"
                  style={{ backgroundColor: "#ef444405", border: "1px solid #ef444412" }}>
                  <div className="flex items-center gap-1 mb-1.5">
                    <div className="w-1 h-1 rounded-full bg-red-400" />
                    <span className="text-[7px] font-mono uppercase tracking-wider text-red-400/60">When Broken</span>
                  </div>
                  <p className="text-[9px] text-white/35 leading-relaxed">{rule.impactWhenBroken}</p>
                </div>
              </div>

              {/* ── Stats grid ── */}
              <div className="grid grid-cols-4 gap-1">
                {[
                  { value: `${rule.violations}`, label: "BREAKS", color: rule.violations === 0 ? "#10b981" : "#ef4444" },
                  { value: `${rule.streak}d`, label: "STREAK", color: rule.streak >= 7 ? "#10b981" : rule.streak >= 3 ? "#f59e0b" : "#ef4444" },
                  { value: `${rule.bestStreak}d`, label: "BEST", color: "#06b6d4" },
                  { value: rule.lastViolation ?? "Never", label: "LAST", color: rule.lastViolation === "Today" ? "#ef4444" : rule.lastViolation ? "#f59e0b" : "#10b981" },
                ].map((stat) => (
                  <div key={stat.label} className="py-1.5 px-1.5 rounded-md bg-white/[0.02] border border-white/[0.04] text-center">
                    <span className="text-[10px] font-mono font-black tabular-nums block" style={{ color: stat.color }}>{stat.value}</span>
                    <span className="text-[6px] font-mono text-white/20 uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* ── Weekly consistency pattern ── */}
              <div className="space-y-1.5">
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">7-Day Pattern</span>
                <div className="flex gap-1">
                  {rule.weeklyHistory.map((kept, i) => (
                    <div key={i} className="flex-1 text-center">
                      <motion.div
                        className="h-6 rounded-md flex items-center justify-center relative overflow-hidden"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        style={{
                          backgroundColor: kept ? `${adherenceColor}12` : "rgba(239,68,68,0.06)",
                          border: `1px solid ${kept ? `${adherenceColor}25` : "rgba(239,68,68,0.12)"}`,
                        }}
                      >
                        {kept ? (
                          <svg width="10" height="10" viewBox="0 0 10 10">
                            <motion.path d="M2 5 L4 7 L8 3" stroke={adherenceColor} strokeWidth="1.5"
                              fill="none" strokeLinecap="round" strokeLinejoin="round"
                              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                              transition={{ duration: 0.3, delay: 0.2 + i * 0.04 }} />
                          </svg>
                        ) : (
                          <svg width="10" height="10" viewBox="0 0 10 10">
                            <path d="M3 3 L7 7 M7 3 L3 7" stroke="#ef4444" strokeWidth="1.5"
                              fill="none" strokeLinecap="round" opacity="0.5" />
                          </svg>
                        )}
                      </motion.div>
                      <span className="text-[6px] font-mono text-white/15 mt-0.5 block">{days[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Adherence bar ── */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">Adherence over {rule.totalDaysTracked}d</span>
                  <span className="text-[9px] font-mono font-bold tabular-nums" style={{ color: adherenceColor }}>{rule.adherence}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.03] rounded-full overflow-hidden relative">
                  <motion.div
                    className="h-full rounded-full relative overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: `${rule.adherence}%` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    style={{ backgroundColor: adherenceColor }}
                  >
                    <motion.div
                      className="absolute inset-0 opacity-30"
                      style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)" }}
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* ── Violation timeline (expandable) ── */}
              {rule.violationLog.length > 0 && (
                <div className="space-y-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowViolations(!showViolations) }}
                    className="w-full flex items-center justify-between group/viol"
                  >
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-red-400/40" />
                      <span className="text-[8px] font-mono text-red-400/40 uppercase tracking-wider font-bold">
                        Violation History ({rule.violationLog.length})
                      </span>
                    </div>
                    <ChevronRight className={`w-3 h-3 text-white/15 transition-transform duration-200 ${showViolations ? "rotate-90" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {showViolations && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden space-y-1"
                      >
                        {rule.violationLog.map((v, vi) => (
                          <motion.div
                            key={vi}
                            initial={{ x: -8, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: vi * 0.05 }}
                            className="flex gap-2.5 px-2.5 py-2 rounded-md bg-red-400/[0.03] border border-red-400/[0.06] relative"
                          >
                            {/* Timeline dot + line */}
                            <div className="flex flex-col items-center shrink-0">
                              <div className="w-2 h-2 rounded-full bg-red-400/40 shrink-0 mt-0.5" />
                              {vi < rule.violationLog.length - 1 && (
                                <div className="w-px flex-1 bg-red-400/10 mt-1" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[9px] font-mono font-bold text-red-400/50">{v.date}</span>
                              <p className="text-[10px] text-white/30 leading-relaxed mt-0.5">{v.context}</p>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ── Action buttons ── */}
              <div className="flex gap-1.5 pt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onAsk(`Deep-analyze my adherence to: "${rule.rule}". I have ${rule.violations} violations in ${rule.totalDaysTracked} days, current streak is ${rule.streak}d (best: ${rule.bestStreak}d). Last violation: ${rule.lastViolation ?? "never"}. What behavioral triggers cause me to break this rule, and what specific steps can I take to lock it in permanently?`)
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all text-[9px] font-mono text-white/40 hover:text-white/60"
                >
                  <Zap className="w-3 h-3" />
                  Analyze Rule
                </button>
                {rule.violationLog.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onAsk(`Look at my violation pattern for "${rule.rule}": ${rule.violationLog.map(v => `${v.date}: ${v.context}`).join(" | ")}. What is the underlying emotional or behavioral trigger connecting these violations?`)
                    }}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border transition-all text-[9px] font-mono hover:bg-red-400/10"
                    style={{ borderColor: "rgba(239,68,68,0.15)", color: "rgba(239,68,68,0.4)" }}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    Pattern
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Rule Picker: Browse and add new rules ── */

function RulePicker({ existingRuleTexts, onAddRule }: { existingRuleTexts: string[]; onAddRule: (rule: typeof ALL_AVAILABLE_RULES[0]) => void }) {
  const [open, setOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    { key: "entry", label: "Entry", color: "#06b6d4", icon: Crosshair },
    { key: "exit", label: "Exit", color: "#10b981", icon: Target },
    { key: "risk", label: "Risk", color: "#f59e0b", icon: Shield },
    { key: "session", label: "Session", color: "#8b5cf6", icon: Zap },
    { key: "mindset", label: "Mindset", color: "#ec4899", icon: Eye },
  ]

  const filtered = ALL_AVAILABLE_RULES.filter((r) => {
    if (existingRuleTexts.includes(r.rule)) return false
    if (filterCategory && r.category !== filterCategory) return false
    if (searchQuery && !r.rule.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed transition-all hover:bg-white/[0.03]"
        style={{ borderColor: open ? "rgba(6,182,212,0.3)" : "rgba(255,255,255,0.06)" }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" className="opacity-40">
          <motion.path d="M6 2 L6 10 M2 6 L10 6" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" className="text-white"
            animate={{ rotate: open ? 45 : 0 }}
            style={{ transformOrigin: "center" }}
          />
        </svg>
        <span className="text-[10px] font-mono text-white/30 font-medium">
          {open ? "Close Rule Library" : "Add Trading Rules"}
        </span>
        <span className="text-[8px] font-mono text-white/15">{ALL_AVAILABLE_RULES.length - existingRuleTexts.length} available</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              {/* Search */}
              <div className="px-3 py-2 border-b border-white/[0.04]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search rules..."
                  className="w-full bg-transparent text-[11px] font-mono text-white/60 placeholder:text-white/15 outline-none"
                />
              </div>

              {/* Category filter */}
              <div className="px-3 py-2 flex gap-1 border-b border-white/[0.04]">
                <button
                  onClick={() => setFilterCategory(null)}
                  className="px-2 py-1 rounded text-[8px] font-mono uppercase tracking-wider transition-all"
                  style={{
                    backgroundColor: !filterCategory ? "rgba(255,255,255,0.06)" : "transparent",
                    color: !filterCategory ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)",
                    border: `1px solid ${!filterCategory ? "rgba(255,255,255,0.1)" : "transparent"}`,
                  }}
                >
                  All
                </button>
                {categories.map((cat) => {
                  const CatIcon = cat.icon
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setFilterCategory(filterCategory === cat.key ? null : cat.key)}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[8px] font-mono uppercase tracking-wider transition-all"
                      style={{
                        backgroundColor: filterCategory === cat.key ? `${cat.color}10` : "transparent",
                        color: filterCategory === cat.key ? cat.color : "rgba(255,255,255,0.2)",
                        border: `1px solid ${filterCategory === cat.key ? `${cat.color}25` : "transparent"}`,
                      }}
                    >
                      <CatIcon className="w-2.5 h-2.5" />
                      {cat.label}
                    </button>
                  )
                })}
              </div>

              {/* Rule list */}
              <div className="max-h-[280px] overflow-y-auto">
                {filtered.map((r, i) => {
                  const cat = categories.find((c) => c.key === r.category)!
                  const RuleIcon = cat.icon
                  return (
                    <motion.div
                      key={r.rule}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="flex items-start gap-2.5 px-3 py-2.5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group/rule"
                    >
                      <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: `${cat.color}08`, border: `1px solid ${cat.color}15` }}>
                        <RuleIcon className="w-3 h-3" style={{ color: `${cat.color}60` }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] text-white/60 font-medium block">{r.rule}</span>
                        <p className="text-[9px] text-white/20 leading-relaxed mt-0.5 line-clamp-2">{r.teaching}</p>
                      </div>
                      <button
                        onClick={() => onAddRule(r)}
                        className="shrink-0 mt-1 px-2.5 py-1 rounded-md text-[8px] font-mono font-bold uppercase tracking-wider transition-all opacity-0 group-hover/rule:opacity-100"
                        style={{
                          backgroundColor: `${cat.color}10`,
                          border: `1px solid ${cat.color}20`,
                          color: cat.color,
                        }}
                      >
                        Add
                      </button>
                    </motion.div>
                  )
                })}

                {filtered.length === 0 && (
                  <div className="py-6 text-center">
                    <span className="text-[10px] text-white/15 font-mono">
                      {searchQuery ? "No matching rules" : "All rules in this category are active"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   EXPOSURE GRAVITY FIELD
   Each currency is a gravitational body. Weight = exposure.
   Pairs are orbital connections. Concentration = danger.
   The visual tells the story: if one body dominates, the system
   is unstable. Balance = survival.
   ══════════════════════════════════════════════════════════════════ */

function ExposureGravityField({ instruments }: { instruments: StrategyData["instruments"] }) {
  const [hoveredCurrency, setHoveredCurrency] = useState<string | null>(null)
  const [selectedPair, setSelectedPair] = useState<string | null>(null)
  const total = instruments.reduce((s, i) => s + i.count, 0) || 1

  /* ── derive currency weights ── */
  const currencyMap: Record<string, { count: number; pairs: string[] }> = {}
  instruments.forEach((inst) => {
    const base = inst.symbol.slice(0, 3)
    const quote = inst.symbol.slice(3, 6)
    if (base) {
      if (!currencyMap[base]) currencyMap[base] = { count: 0, pairs: [] }
      currencyMap[base].count += inst.count
      currencyMap[base].pairs.push(inst.symbol)
    }
    if (quote) {
      if (!currencyMap[quote]) currencyMap[quote] = { count: 0, pairs: [] }
      currencyMap[quote].count += inst.count
      currencyMap[quote].pairs.push(inst.symbol)
    }
  })

  const currencies = Object.entries(currencyMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 8)

  const maxCount = currencies[0]?.[1]?.count ?? 1
  const totalCurrencyWeight = currencies.reduce((s, [, d]) => s + d.count, 0) || 1

  const tierColor = (pct: number) =>
    pct >= 35 ? { fill: "#ef4444", glow: "rgba(239,68,68,0.15)", text: "#ef4444", tier: "OVERWEIGHT" }
    : pct >= 20 ? { fill: "#f59e0b", glow: "rgba(245,158,11,0.1)", text: "#f59e0b", tier: "HEAVY" }
    : pct >= 10 ? { fill: "#06b6d4", glow: "rgba(6,182,212,0.08)", text: "#06b6d4", tier: "BALANCED" }
    : { fill: "rgba(255,255,255,0.25)", glow: "rgba(255,255,255,0.03)", text: "rgba(255,255,255,0.4)", tier: "LIGHT" }

  const getConnectedPairs = (currency: string) => currencyMap[currency]?.pairs ?? []

  const getConnectedCurrencies = (currency: string) => {
    const pairs = getConnectedPairs(currency)
    const connected = new Set<string>()
    pairs.forEach(p => {
      const base = p.slice(0, 3)
      const quote = p.slice(3, 6)
      if (base !== currency) connected.add(base)
      if (quote !== currency) connected.add(quote)
    })
    return connected
  }

  const connectedSet = hoveredCurrency ? getConnectedCurrencies(hoveredCurrency) : new Set<string>()

  // Generate realistic per-pair data
  const pairDetails = useMemo(() => {
    const details: Record<string, {
      trades: number; wins: number; losses: number; winRate: number;
      avgRR: string; bestTrade: string; worstTrade: string;
      sessions: string[]; avgDuration: string; direction: "buy-heavy" | "sell-heavy" | "balanced";
      recentPnl: number[]; totalPnl: string; streak: number;
    }> = {}
    instruments.forEach((inst) => {
      const count = inst.count
      const wins = Math.round(count * (0.4 + Math.random() * 0.25))
      const losses = count - wins
      const winRate = Math.round((wins / Math.max(count, 1)) * 100)
      details[inst.symbol] = {
        trades: count,
        wins,
        losses,
        winRate,
        avgRR: `${(1.2 + Math.random() * 1.8).toFixed(1)}R`,
        bestTrade: `+${(1.5 + Math.random() * 3).toFixed(1)}R`,
        worstTrade: `-${(0.8 + Math.random() * 1.5).toFixed(1)}R`,
        sessions: winRate >= 55 ? ["London", "NY AM"] : ["London", "NY AM", "NY PM", "Asia"],
        avgDuration: `${Math.round(1 + Math.random() * 5)}h ${Math.round(Math.random() * 59)}m`,
        direction: winRate >= 60 ? "buy-heavy" : winRate <= 40 ? "sell-heavy" : "balanced",
        recentPnl: Array.from({ length: 8 }, () => (Math.random() - 0.45) * 2),
        totalPnl: winRate >= 50 ? `+${(1 + Math.random() * 5).toFixed(2)}%` : `${(-0.5 - Math.random() * 2).toFixed(2)}%`,
        streak: Math.round(Math.random() * 4) * (Math.random() > 0.5 ? 1 : -1),
      }
    })
    return details
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instruments])

  return (
    <div className="space-y-3">
      {/* ── Gravity field: vertical weight pillars + detail panel wrapper ── */}
      <div onMouseLeave={() => { setHoveredCurrency(null); setSelectedPair(null) }}>
      <div className="relative rounded-lg overflow-hidden border border-white/[0.04] bg-white/[0.01]">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        />

        <div className="relative px-3 pt-4 pb-3">
          <div className="flex items-end gap-1" style={{ height: 120 }}>
            {currencies.map(([currency, cData], i) => {
              const pct = Math.round((cData.count / totalCurrencyWeight) * 100)
              const colors = tierColor(pct)
              const pillarHeight = Math.max(16, (cData.count / maxCount) * 100)
              const isHovered = hoveredCurrency === currency
              const isConnected = connectedSet.has(currency)
              const isDimmed = hoveredCurrency !== null && !isHovered && !isConnected

              return (
                <motion.div
                  key={currency}
                  className="flex-1 flex flex-col items-center gap-1 cursor-pointer"
                  style={{ opacity: isDimmed ? 0.15 : 1 }}
                  onMouseEnter={() => { setHoveredCurrency(currency); setSelectedPair(null) }}
                  animate={{ y: isHovered ? -2 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.span
                    className="text-[10px] font-mono font-black tabular-nums"
                    style={{ color: colors.text }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, scale: isHovered ? 1.15 : 1 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    {pct}%
                  </motion.span>

                  <div className="w-full relative">
                    <motion.div
                      className="w-full rounded-t-md relative overflow-hidden"
                      initial={{ height: 0 }}
                      animate={{ height: pillarHeight }}
                      transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        background: `linear-gradient(to top, ${colors.fill}08, ${colors.fill}${isHovered ? "30" : "18"})`,
                        borderTop: `2px solid ${colors.fill}`,
                        borderLeft: `1px solid ${colors.fill}20`,
                        borderRight: `1px solid ${colors.fill}20`,
                        boxShadow: isHovered ? `0 -8px 24px ${colors.glow}, inset 0 1px 16px ${colors.glow}` : "none",
                      }}
                    >
                      {/* Ambient floating particle */}
                      <motion.div
                        className="absolute w-1 h-1 rounded-full"
                        style={{ backgroundColor: colors.fill, opacity: 0.3, left: "50%" }}
                        animate={{ top: ["80%", "10%", "80%"], opacity: [0, 0.5, 0] }}
                        transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                      />

                      {isHovered && (
                        <motion.div className="absolute inset-x-0 h-px"
                          style={{ backgroundColor: colors.fill, opacity: 0.4 }}
                          animate={{ top: ["0%", "100%", "0%"] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      )}

                      <AnimatePresence>
                        {isHovered && (
                          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                            className="absolute inset-x-0 top-1 flex justify-center">
                            <span className="text-[7px] font-mono font-bold tracking-wider px-1 py-0.5 rounded"
                              style={{ backgroundColor: `${colors.fill}20`, color: colors.fill }}>{colors.tier}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>

                  <span className={`text-[9px] font-mono font-bold tracking-wider transition-colors duration-200 ${isHovered ? "text-white" : "text-white/40"}`}>
                    {currency}
                  </span>
                </motion.div>
              )
            })}
          </div>

          <div className="absolute left-0 right-0" style={{ top: `${4 + 120 * (1 - 0.35)}px` }}>
            <div className="flex items-center gap-1 px-1">
              <div className="flex-1 h-px border-t border-dashed border-red-400/20" />
              <span className="text-[7px] font-mono text-red-400/30 shrink-0">35% DANGER</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ ENHANCED PAIR DETAIL PANEL ══ */}
      <AnimatePresence mode="wait">
        {hoveredCurrency && (
          <motion.div
            key={hoveredCurrency}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            {(() => {
              const pairs = getConnectedPairs(hoveredCurrency)
              const currPct = Math.round(((currencyMap[hoveredCurrency]?.count ?? 0) / totalCurrencyWeight) * 100)
              const currColors = tierColor(currPct)

              return (
                <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${currColors.fill}15`, background: `linear-gradient(135deg, ${currColors.fill}03, transparent 70%)` }}>
                  {/* Header */}
                  <div className="px-3 py-2 flex items-center justify-between" style={{ borderBottom: `1px solid ${currColors.fill}10` }}>
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-1 rounded-md" style={{ backgroundColor: `${currColors.fill}10`, border: `1px solid ${currColors.fill}20` }}>
                        <span className="text-[11px] font-mono font-black" style={{ color: currColors.fill }}>{hoveredCurrency}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/50 font-medium">{currPct}% of total exposure</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[8px] font-mono uppercase tracking-wider" style={{ color: currColors.fill }}>{currColors.tier}</span>
                          <div className="w-0.5 h-0.5 rounded-full bg-white/10" />
                          <span className="text-[8px] font-mono text-white/20">{pairs.length} pair{pairs.length !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...connectedSet].slice(0, 4).map(c => (
                        <span key={c} className="text-[7px] font-mono text-white/15 px-1 py-0.5 rounded bg-white/[0.02] border border-white/[0.03]">{c}</span>
                      ))}
                    </div>
                  </div>

                  {/* Pair cards */}
                  <div className="p-2 space-y-1.5">
                    {pairs.map((pair, pi) => {
                      const pd = pairDetails[pair]
                      if (!pd) return null
                      const pairPct = Math.round(((instruments.find(i => i.symbol === pair)?.count ?? 0) / total) * 100)
                      const isSelected = selectedPair === pair
                      const wrColor = pd.winRate >= 55 ? "#10b981" : pd.winRate >= 45 ? "#f59e0b" : "#ef4444"
                      const pnlPositive = pd.totalPnl.startsWith("+")
                      const dirColor = pd.direction === "buy-heavy" ? "#10b981" : pd.direction === "sell-heavy" ? "#ef4444" : "#06b6d4"

                      return (
                        <motion.div key={pair} layout className="rounded-lg overflow-hidden"
                          initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: pi * 0.04 }}
                          style={{ border: `1px solid ${isSelected ? `${wrColor}25` : "rgba(255,255,255,0.04)"}` }}>

                          <button onClick={() => setSelectedPair(isSelected ? null : pair)}
                            className="w-full text-left hover:bg-white/[0.02] transition-all">
                            <div className="px-3 py-2.5">
                              <div className="flex items-center gap-3">
                                {/* Pair badge + mini P&L chart */}
                                <div className="relative">
                                  <div className="w-9 h-9 rounded-lg flex items-center justify-center relative overflow-hidden"
                                    style={{ backgroundColor: `${wrColor}08`, border: `1px solid ${wrColor}20` }}>
                                    {/* Mini sparkline inside the badge */}
                                    <svg width="32" height="20" viewBox="0 0 32 20" className="absolute inset-0 m-auto">
                                      <motion.polyline
                                        fill="none" stroke={wrColor} strokeWidth="1" strokeLinecap="round"
                                        points={pd.recentPnl.map((v, j) => `${(j / 7) * 28 + 2},${10 - v * 4}`).join(" ")}
                                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.6, delay: 0.1 }}
                                        style={{ opacity: 0.5 }}
                                      />
                                    </svg>
                                  </div>
                                  {/* Direction dot */}
                                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-black/40"
                                    style={{ backgroundColor: dirColor }} />
                                </div>

                                {/* Pair name + weight */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[12px] font-mono font-black text-white/80">{pair}</span>
                                    <span className="text-[8px] font-mono px-1 py-0.5 rounded uppercase"
                                      style={{ backgroundColor: `${dirColor}10`, color: `${dirColor}80`, border: `1px solid ${dirColor}15` }}>
                                      {pd.direction === "buy-heavy" ? "LONG" : pd.direction === "sell-heavy" ? "SHORT" : "MIXED"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[8px] font-mono text-white/20">{pd.trades} trades</span>
                                    <div className="w-0.5 h-0.5 rounded-full bg-white/10" />
                                    <span className="text-[8px] font-mono text-white/15">{pairPct}% weight</span>
                                  </div>
                                </div>

                                {/* Win rate arc */}
                                <div className="relative w-9 h-9 shrink-0">
                                  <svg width="36" height="36" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2.5" />
                                    <motion.circle cx="18" cy="18" r="14" fill="none" stroke={wrColor} strokeWidth="2.5"
                                      strokeLinecap="round" strokeDasharray={2 * Math.PI * 14}
                                      initial={{ strokeDashoffset: 2 * Math.PI * 14 }}
                                      animate={{ strokeDashoffset: 2 * Math.PI * 14 * (1 - pd.winRate / 100) }}
                                      transition={{ duration: 0.8, delay: pi * 0.05 }} transform="rotate(-90 18 18)"
                                      style={{ filter: `drop-shadow(0 0 2px ${wrColor}40)` }}
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-[8px] font-mono font-black tabular-nums" style={{ color: wrColor }}>{pd.winRate}</span>
                                  </div>
                                </div>

                                {/* P&L */}
                                <div className="flex flex-col items-end shrink-0">
                                  <span className="text-[11px] font-mono font-black tabular-nums" style={{ color: pnlPositive ? "#10b981" : "#ef4444" }}>
                                    {pd.totalPnl}
                                  </span>
                                  <span className="text-[8px] font-mono text-white/15">{pd.avgRR} avg</span>
                                </div>

                                <ChevronRight className={`w-3 h-3 text-white/15 transition-transform duration-200 shrink-0 ${isSelected ? "rotate-90" : ""}`} />
                              </div>
                            </div>
                          </button>

                          {/* ── Expanded pair detail ── */}
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                <div className="px-3 pb-3 pt-1 space-y-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>

                                  {/* Stats grid */}
                                  <div className="grid grid-cols-4 gap-1">
                                    {[
                                      { value: `${pd.wins}`, label: "WINS", color: "#10b981" },
                                      { value: `${pd.losses}`, label: "LOSSES", color: "#ef4444" },
                                      { value: pd.bestTrade, label: "BEST", color: "#10b981" },
                                      { value: pd.worstTrade, label: "WORST", color: "#ef4444" },
                                    ].map(s => (
                                      <div key={s.label} className="py-1.5 px-1 rounded-md bg-white/[0.02] border border-white/[0.04] text-center">
                                        <span className="text-[10px] font-mono font-black tabular-nums block" style={{ color: s.color }}>{s.value}</span>
                                        <span className="text-[6px] font-mono text-white/20 uppercase tracking-wider">{s.label}</span>
                                      </div>
                                    ))}
                                  </div>

                                  {/* W/L bar */}
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">Win / Loss Distribution</span>
                                      <span className="text-[9px] font-mono font-bold" style={{ color: wrColor }}>{pd.winRate}%</span>
                                    </div>
                                    <div className="h-2 rounded-full overflow-hidden flex">
                                      <motion.div className="h-full bg-emerald-400/60 rounded-l-full"
                                        initial={{ width: 0 }} animate={{ width: `${pd.winRate}%` }}
                                        transition={{ duration: 0.6 }} />
                                      <motion.div className="h-full bg-red-400/40 rounded-r-full flex-1"
                                        initial={{ width: 0 }} animate={{ width: `${100 - pd.winRate}%` }}
                                        transition={{ duration: 0.6, delay: 0.1 }} />
                                    </div>
                                  </div>

                                  {/* Recent P&L sparkline (larger) */}
                                  <div className="space-y-1">
                                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">Recent Equity Curve</span>
                                    <div className="h-10 rounded-md bg-white/[0.01] border border-white/[0.03] overflow-hidden relative p-1">
                                      <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
                                        <defs>
                                          <linearGradient id={`eq-${pair}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={pnlPositive ? "#10b981" : "#ef4444"} stopOpacity="0.15" />
                                            <stop offset="100%" stopColor={pnlPositive ? "#10b981" : "#ef4444"} stopOpacity="0" />
                                          </linearGradient>
                                        </defs>
                                        {/* Zero line */}
                                        <line x1="0" y1="15" x2="100" y2="15" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="2,2" />
                                        {/* Equity path */}
                                        {(() => {
                                          const pts = pd.recentPnl.map((v, j) => `${(j / 7) * 96 + 2},${15 - v * 6}`)
                                          const line = pts.join(" ")
                                          const area = `${pts.join(" ")} ${98},30 2,30`
                                          return (
                                            <>
                                              <motion.polygon points={area} fill={`url(#eq-${pair})`}
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} />
                                              <motion.polyline points={line} fill="none"
                                                stroke={pnlPositive ? "#10b981" : "#ef4444"} strokeWidth="1.5" strokeLinecap="round"
                                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.8 }}
                                                style={{ filter: `drop-shadow(0 0 3px ${pnlPositive ? "#10b98140" : "#ef444440"})` }}
                                              />
                                              <circle cx={`${((pd.recentPnl.length - 1) / 7) * 96 + 2}`} cy={`${15 - pd.recentPnl[pd.recentPnl.length - 1] * 6}`}
                                                r="2.5" fill={pnlPositive ? "#10b981" : "#ef4444"}>
                                                <animate attributeName="r" values="2.5;4;2.5" dur="2s" repeatCount="indefinite" />
                                                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                                              </circle>
                                            </>
                                          )
                                        })()}
                                      </svg>
                                    </div>
                                  </div>

                                  {/* Session + Duration + Streak */}
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {pd.sessions.map((s, si) => (
                                      <span key={si} className="text-[7px] font-mono text-white/20 px-1.5 py-0.5 rounded bg-white/[0.02] border border-white/[0.03]">{s}</span>
                                    ))}
                                    <div className="w-px h-3 bg-white/[0.06]" />
                                    <span className="text-[8px] font-mono text-white/20">{pd.avgDuration} avg</span>
                                    {pd.streak !== 0 && (
                                      <>
                                        <div className="w-px h-3 bg-white/[0.06]" />
                                        <span className="text-[8px] font-mono font-bold" style={{ color: pd.streak > 0 ? "#10b981" : "#ef4444" }}>
                                          {pd.streak > 0 ? `${pd.streak}W streak` : `${Math.abs(pd.streak)}L streak`}
                                        </span>
                                      </>
                                    )}
                                  </div>

                                  {/* Actions */}
                                  <div className="flex gap-1.5">
                                    <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent("copilot:chat:ask", { detail: { threadType: "strategy", text: `Analyze my ${pair} trading performance: ${pd.wins}W/${pd.losses}L (${pd.winRate}% WR), avg ${pd.avgRR}, total P&L ${pd.totalPnl}. What patterns do you see?` } })) }}
                                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all text-[9px] font-mono text-white/40 hover:text-white/60">
                                      <Zap className="w-3 h-3" />
                                      Analyze Pair
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent("navigate:pair", { detail: { symbol: pair } })) }}
                                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border transition-all text-[9px] font-mono hover:bg-cyan-400/10"
                                      style={{ borderColor: "rgba(6,182,212,0.15)", color: "rgba(6,182,212,0.5)" }}>
                                      <Eye className="w-3 h-3" />
                                      View
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* ── Concentration verdict ── */}
      {(() => {
        const topPct = Math.round(((currencies[0]?.[1]?.count ?? 0) / totalCurrencyWeight) * 100)
        const verdict = topPct >= 35
          ? { text: `${currencies[0]?.[0]} dominates ${topPct}% of your exposure. A single news event on this currency could cascade across ${currencyMap[currencies[0]?.[0] ?? ""]?.pairs.length ?? 0} of your positions simultaneously.`, color: "#ef4444", severity: "CRITICAL" }
          : topPct >= 25
            ? { text: `${currencies[0]?.[0]} at ${topPct}% is approaching concentration risk. Consider if your edge justifies the correlation exposure.`, color: "#f59e0b", severity: "WARNING" }
            : { text: "Capital distribution across currencies is balanced. No single-currency event risk detected.", color: "#10b981", severity: "CLEAR" }

        return (
          <div className="flex items-start gap-2 px-2.5 py-2 rounded-md border"
            style={{ backgroundColor: `${verdict.color}05`, borderColor: `${verdict.color}15` }}>
            <div className="relative w-1 h-1 mt-1.5 shrink-0">
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: verdict.color }} />
              {verdict.severity === "CRITICAL" && (
                <motion.div className="absolute inset-0 w-1 h-1 rounded-full" style={{ backgroundColor: verdict.color }}
                  animate={{ scale: [1, 2.5, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }} />
              )}
            </div>
            <div>
              <span className="text-[9px] font-mono font-bold tracking-wider" style={{ color: verdict.color }}>{verdict.severity}</span>
              <p className="text-[10px] text-white/35 leading-relaxed mt-0.5">{verdict.text}</p>
            </div>
          </div>
        )
      })()}
    </div>
  )
}


/* ══════════════════════════════════════════════════════════════════
   EXECUTION DNA
   Three concentric rings showing the trader's execution identity:
   - Outer ring: Order type distribution (market/limit/stop)
   - Middle ring: Timing quality (killzone vs off-hours)
   - Inner core: The verdict
   Below: A behavioral spectrum with animated position marker.
   ══════════════════════════════════════════════════════════════════ */

function ExecutionDNA({ entryMix, limitRatio }: { entryMix: StrategyData["entryMix"]; limitRatio: number }) {
  const _dnaUid = useId()
  const svgId = (name: string) => `${_dnaUid.replace(/:/g, "")}-${name}`
  const total = entryMix.reduce((s, e) => s + e.value, 0) || 1
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null)
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null)

  const segments = entryMix.map((e) => ({
    label: e.label,
    pct: Math.round((e.value / total) * 100),
    count: e.value,
    color: e.label === "limit" ? "#10b981" : e.label === "stop" ? "#06b6d4" : "#ef4444",
    displayName: e.label === "limit" ? "LIMIT" : e.label === "stop" ? "STOP" : "MARKET",
  })).sort((a, b) => b.pct - a.pct)

  /* ── execution identity ── */
  const identity = limitRatio >= 0.7
    ? { label: "SNIPER", color: "#10b981", desc: "You wait for price to come to you. Institutional precision. Your entries mirror how smart money operates -- patient, precise, and pre-planned." }
    : limitRatio >= 0.5
      ? { label: "HYBRID", color: "#06b6d4", desc: "Mixed execution. Disciplined on most setups but occasionally reactive. You have the skill to wait -- the question is whether you consistently choose to." }
      : limitRatio >= 0.3
        ? { label: "REACTIVE", color: "#f59e0b", desc: "Market-order tendency. Edge leaks through impatience. You see setups but enter too late, after confirmation has already priced in." }
        : { label: "IMPULSIVE", color: "#ef4444", desc: "Chasing entries. Every market order is a discipline tax. You are paying the spread to satisfy urgency, not to execute a plan." }

  const w = 200
  const h = 200
  const cx = w / 2
  const cy = h / 2

  // Simulated execution profile stats
  const executionProfile = useMemo(() => ({
    avgSlippage: limitRatio >= 0.7 ? "+0.2 pips" : limitRatio >= 0.5 ? "+0.8 pips" : "+1.6 pips",
    fillRate: limitRatio >= 0.7 ? "73%" : limitRatio >= 0.5 ? "85%" : "98%",
    avgWaitTime: limitRatio >= 0.7 ? "2h 14m" : limitRatio >= 0.5 ? "42m" : "3m",
    bestSession: "London Open",
    worstSession: "Asian Session",
    avgRRonLimit: "+1.9R",
    avgRRonMarket: "-0.3R",
    limitWinRate: 62,
    marketWinRate: 38,
    stopWinRate: 51,
    consecutiveLimits: limitRatio >= 0.7 ? 8 : limitRatio >= 0.5 ? 4 : 1,
    consecutiveMarkets: limitRatio >= 0.3 ? 2 : 5,
    timingAccuracy: Math.round(limitRatio * 80 + 10),
    emotionalEntries: Math.round((1 - limitRatio) * 30),
    planAdherence: Math.round(limitRatio * 85 + 10),
    weeklyTrend: [
      { day: "Mon", limit: 3, market: 1, stop: 0 },
      { day: "Tue", limit: 2, market: 2, stop: 1 },
      { day: "Wed", limit: 4, market: 0, stop: 1 },
      { day: "Thu", limit: 1, market: 3, stop: 0 },
      { day: "Fri", limit: 3, market: 1, stop: 2 },
    ],
    sessionBreakdown: [
      { session: "London Open", limitPct: 72, trades: 18, avgRR: "+1.4R" },
      { session: "NY Open", limitPct: 58, trades: 14, avgRR: "+0.8R" },
      { session: "NY Close", limitPct: 41, trades: 8, avgRR: "-0.2R" },
      { session: "Asian", limitPct: 23, trades: 5, avgRR: "-0.9R" },
    ],
    orderEvolution: [45, 48, 52, 55, 51, 58, 62, 60, 65, 68, 64, Math.round(limitRatio * 100)],
  }), [limitRatio])

  // Sub-panels
  const panels = [
    { id: "profile", label: "Execution Profile", icon: Crosshair },
    { id: "timing", label: "Session Timing", icon: Eye },
    { id: "evolution", label: "Patience Evolution", icon: Target },
    { id: "cost", label: "Impatience Cost", icon: AlertTriangle },
  ]

  return (
    <div className="space-y-3">
      {/* ── Concentric ring SVG ── */}
      <div className="flex justify-center">
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          <defs>
            {segments.map(s => (
              <linearGradient key={`dna-${s.label}`} id={`dna-${s.label}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={hoveredSegment === s.label ? "1" : "0.7"} />
                <stop offset="100%" stopColor={s.color} stopOpacity={hoveredSegment === s.label ? "0.6" : "0.3"} />
              </linearGradient>
            ))}
            <filter id={svgId("dna-glow")}>
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id={svgId("dna-glow-strong")}>
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Outer orbit rings (breathing) */}
          <circle cx={cx} cy={cy} r="95" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5">
            <animate attributeName="r" values="94;96;94" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle cx={cx} cy={cy} r="75" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5">
            <animate attributeName="r" values="74;76;74" dur="4s" repeatCount="indefinite" />
          </circle>

          {/* Orbiting particles */}
          {[0, 120, 240].map((_, pi) => (
            <circle key={`dna-p-${pi}`} cx={cx} cy={cy} r="1.5" fill={identity.color} opacity="0">
              <animateMotion dur={`${6 + pi * 3}s`} repeatCount="indefinite"
                path={`M0,0 A${85 + pi * 5},${85 + pi * 5} 0 1,${pi % 2} 0.1,0`} />
              <animate attributeName="opacity" values="0;0.35;0" dur={`${6 + pi * 3}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Outer ring: Order type arcs */}
          {(() => {
            const outerR = 85
            const outerStroke = 8
            const circumference = 2 * Math.PI * outerR
            const gap = 4
            let accumulated = 0

            return segments.map((s, i) => {
              const arcLen = (s.pct / 100) * circumference - gap
              const offset = accumulated
              accumulated += (s.pct / 100) * circumference
              const isHovered = hoveredSegment === s.label

              return (
                <g key={s.label}
                  onMouseEnter={() => setHoveredSegment(s.label)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  style={{ cursor: "pointer" }}>
                  <motion.circle
                    cx={cx} cy={cy} r={outerR}
                    fill="none"
                    stroke={`url(#dna-${s.label})`}
                    strokeWidth={isHovered ? outerStroke + 3 : outerStroke}
                    strokeLinecap="round"
                    strokeDasharray={`${Math.max(0, arcLen)} ${circumference}`}
                    strokeDashoffset={-offset}
                    transform={`rotate(-90 ${cx} ${cy})`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredSegment && !isHovered ? 0.3 : 1 }}
                    transition={{ duration: 0.3, delay: i * 0.15 }}
                    filter={isHovered ? `url(#${svgId("dna-glow-strong")})` : `url(#${svgId("dna-glow")})`}
                  />
                  {s.pct >= 12 && (() => {
                    const midAngle = ((accumulated - (s.pct / 100) * circumference / 2) / circumference) * 360 - 90
                    const rad = (midAngle * Math.PI) / 180
                    const dist = isHovered ? outerR + 16 : outerR + 14
                    const lx = cx + dist * Math.cos(rad)
                    const ly = cy + dist * Math.sin(rad)
                    return (
                      <text x={lx} y={ly} fill={s.color} fontSize={isHovered ? "10" : "8"} fontWeight="900"
                        textAnchor="middle" dominantBaseline="middle" fontFamily="monospace"
                        style={{ transition: "font-size 0.2s", filter: isHovered ? `drop-shadow(0 0 4px ${s.color}60)` : "none" }}>
                        {s.pct}%
                      </text>
                    )
                  })()}
                </g>
              )
            })
          })()}

          {/* Middle ring: Patience gauge */}
          {(() => {
            const midR = 60
            const midStroke = 4
            const circumference = 2 * Math.PI * midR
            const filled = limitRatio * circumference
            return (
              <>
                <circle cx={cx} cy={cy} r={midR} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={midStroke} />
                <motion.circle cx={cx} cy={cy} r={midR} fill="none" stroke={identity.color}
                  strokeWidth={midStroke} strokeLinecap="round" strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: circumference - filled }}
                  transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                  transform={`rotate(-90 ${cx} ${cy})`} opacity="0.5" />
              </>
            )
          })()}

          {/* Inner core: Identity */}
          <circle cx={cx} cy={cy} r="40" fill={`${identity.color}06`} stroke={`${identity.color}15`} strokeWidth="1">
            <animate attributeName="r" values="39;41;39" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx={cx} cy={cy} r="36" fill="none" stroke={`${identity.color}08`} strokeWidth="0.5">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <text x={cx} y={cy - 8} fill={identity.color} fontSize="11" fontWeight="900"
            textAnchor="middle" dominantBaseline="middle" fontFamily="monospace"
            letterSpacing="0.1em" style={{ filter: `drop-shadow(0 0 4px ${identity.color}40)` }}>
            {identity.label}
          </text>
          <text x={cx} y={cy + 6} fill="rgba(255,255,255,0.3)" fontSize="8"
            textAnchor="middle" dominantBaseline="middle" fontFamily="monospace">
            {Math.round(limitRatio * 100)}% patience
          </text>
          <circle cx={cx} cy={cy} r="40" fill="none" stroke={identity.color} strokeWidth="0.5">
            <animate attributeName="r" values="40;50;40" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.15;0;0.15" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx={cx} cy={cy} r="40" fill="none" stroke={identity.color} strokeWidth="0.3">
            <animate attributeName="r" values="40;55;40" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.08;0;0.08" dur="4s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* ── Segment hover detail ── */}
      <AnimatePresence mode="wait">
        {hoveredSegment && (() => {
          const seg = segments.find(s => s.label === hoveredSegment)
          if (!seg) return null
          const wr = seg.label === "limit" ? executionProfile.limitWinRate : seg.label === "market" ? executionProfile.marketWinRate : executionProfile.stopWinRate
          const wrColor = wr >= 55 ? "#10b981" : wr >= 45 ? "#f59e0b" : "#ef4444"
          const avgRR = seg.label === "limit" ? executionProfile.avgRRonLimit : seg.label === "market" ? executionProfile.avgRRonMarket : "+0.4R"
          return (
            <motion.div key={seg.label} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="rounded-lg overflow-hidden" style={{ border: `1px solid ${seg.color}18`, background: `${seg.color}04` }}>
              <div className="px-3 py-2 flex items-center gap-3">
                <div className="px-2 py-1 rounded-md" style={{ backgroundColor: `${seg.color}12`, border: `1px solid ${seg.color}20` }}>
                  <span className="text-[11px] font-mono font-black" style={{ color: seg.color }}>{seg.displayName}</span>
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <div className="text-center">
                    <span className="text-[11px] font-mono font-black tabular-nums text-white/70">{seg.count}</span>
                    <span className="text-[7px] font-mono text-white/20 uppercase block">trades</span>
                  </div>
                  <div className="w-px h-6 bg-white/[0.06]" />
                  <div className="text-center">
                    <span className="text-[11px] font-mono font-black tabular-nums" style={{ color: wrColor }}>{wr}%</span>
                    <span className="text-[7px] font-mono text-white/20 uppercase block">win rate</span>
                  </div>
                  <div className="w-px h-6 bg-white/[0.06]" />
                  <div className="text-center">
                    <span className="text-[11px] font-mono font-black tabular-nums" style={{ color: avgRR.startsWith("+") ? "#10b981" : "#ef4444" }}>{avgRR}</span>
                    <span className="text-[7px] font-mono text-white/20 uppercase block">avg R</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })()}
      </AnimatePresence>

      {/* ── Legend row ── */}
      <div className="flex items-center justify-center gap-3">
        {segments.map(s => (
          <motion.div key={s.label}
            className="flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded-md transition-all"
            onMouseEnter={() => setHoveredSegment(s.label)}
            onMouseLeave={() => setHoveredSegment(null)}
            whileHover={{ backgroundColor: `${s.color}08` }}
            style={{ border: hoveredSegment === s.label ? `1px solid ${s.color}20` : "1px solid transparent" }}>
            <div className="relative">
              <motion.div className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: s.color }}
                animate={{ scale: hoveredSegment === s.label ? 1.4 : 1 }}
                transition={{ duration: 0.15 }} />
              <motion.div className="absolute inset-0 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}
                animate={{ scale: [1, 2, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: segments.indexOf(s) * 0.3 }} />
            </div>
            <span className="text-[10px] font-mono font-bold transition-colors" style={{ color: hoveredSegment === s.label ? s.color : "rgba(255,255,255,0.3)" }}>{s.displayName}</span>
            <span className="text-[10px] font-mono font-black tabular-nums" style={{ color: s.color, opacity: hoveredSegment === s.label ? 1 : 0.5 }}>{s.pct}%</span>
          </motion.div>
        ))}
      </div>

      {/* ── Behavioral Spectrum ── */}
      <div className="space-y-1.5">
        <div className="relative h-10 rounded-lg overflow-hidden border border-white/[0.06]"
          style={{ background: "linear-gradient(to right, rgba(239,68,68,0.06), rgba(245,158,11,0.06), rgba(6,182,212,0.06), rgba(16,185,129,0.06))" }}>
          {/* Ambient shimmer */}
          <motion.div className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)", backgroundSize: "200% 100%" }}
            animate={{ backgroundPositionX: ["0%", "200%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />

          {/* Spectrum labels -- bigger, reactive */}
          <div className="absolute inset-0 flex items-center justify-between px-4">
            {[
              { text: "CHASE", color: "#ef4444", pos: 0.1 },
              { text: "REACT", color: "#f59e0b", pos: 0.35 },
              { text: "WAIT", color: "#06b6d4", pos: 0.65 },
              { text: "HUNT", color: "#10b981", pos: 0.9 },
            ].map(zone => {
              const dist = Math.abs(limitRatio - zone.pos)
              const isActive = dist < 0.15
              return (
                <motion.span key={zone.text}
                  className="font-mono font-black tracking-wider cursor-default select-none"
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    opacity: isActive ? 1 : 0.25,
                    textShadow: isActive ? `0 0 8px ${zone.color}60` : "none",
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ color: zone.color, fontSize: isActive ? "11px" : "9px" }}>
                  {zone.text}
                </motion.span>
              )
            })}
          </div>

          {/* Position marker */}
          <motion.div className="absolute top-0 bottom-0 w-0.5 z-10"
            style={{ backgroundColor: identity.color, boxShadow: `0 0 14px ${identity.color}60` }}
            initial={{ left: "0%" }}
            animate={{ left: `${Math.min(96, limitRatio * 100)}%` }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-0 h-0"
              style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `6px solid ${identity.color}` }} />
            <motion.div className="absolute top-2 bottom-2 -left-1.5 w-3.5 rounded-full"
              style={{ backgroundColor: identity.color, filter: "blur(4px)" }}
              animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 1.5, repeat: Infinity }} />
          </motion.div>
        </div>
      </div>

      {/* ── Verdict ── */}
      <motion.div className="px-3 py-2.5 rounded-lg relative overflow-hidden"
        style={{ backgroundColor: `${identity.color}04`, border: `1px solid ${identity.color}12` }}
        whileHover={{ borderColor: `${identity.color}25` }}>
        <div className="absolute top-0 left-0 w-1 h-full rounded-r" style={{ backgroundColor: identity.color }} />
        <motion.div className="absolute top-0 left-0 w-10 h-full opacity-[0.03]"
          style={{ backgroundColor: identity.color, filter: "blur(12px)" }}
          animate={{ x: [-20, 350] }} transition={{ duration: 7, repeat: Infinity, ease: "linear" }} />
        <p className="text-[10px] text-white/40 leading-relaxed relative pl-2">{identity.desc}</p>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
         EXECUTION DNA DEEP PANELS -- Personal stats breakdown
         Each panel is an expandable module with full detail
         ══════════════════════════════════════════════════════════ */}

      <div className="space-y-1 pt-1">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-3 h-px bg-white/[0.06]" />
          <span className="text-[8px] font-mono text-white/15 uppercase tracking-[0.2em]">Deep Breakdown</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {/* Panel selector tabs */}
        <div className="flex gap-1">
          {panels.map((p) => {
            const PIcon = p.icon
            const isActive = expandedPanel === p.id
            return (
              <motion.button key={p.id}
                onClick={() => setExpandedPanel(isActive ? null : p.id)}
                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-md font-mono text-[8px] uppercase tracking-wider transition-all"
                style={{
                  backgroundColor: isActive ? `${identity.color}08` : "rgba(255,255,255,0.01)",
                  border: `1px solid ${isActive ? `${identity.color}25` : "rgba(255,255,255,0.04)"}`,
                  color: isActive ? identity.color : "rgba(255,255,255,0.25)",
                }}
                whileHover={{ backgroundColor: `${identity.color}06`, borderColor: `${identity.color}15` }}>
                <PIcon className="w-3 h-3" />
                <span className="hidden sm:inline">{p.label.split(" ")[0]}</span>
              </motion.button>
            )
          })}
        </div>

        {/* Expanded panel content */}
        <AnimatePresence mode="wait">
          {expandedPanel && (
            <motion.div key={expandedPanel}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden">
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.01] overflow-hidden">

                {/* ── EXECUTION PROFILE PANEL ── */}
                {expandedPanel === "profile" && (
                  <div className="p-3 space-y-3">
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { value: executionProfile.avgSlippage, label: "AVG SLIPPAGE", color: limitRatio >= 0.5 ? "#10b981" : "#f59e0b" },
                        { value: executionProfile.fillRate, label: "FILL RATE", color: "#06b6d4" },
                        { value: executionProfile.avgWaitTime, label: "AVG WAIT", color: identity.color },
                        { value: `${executionProfile.timingAccuracy}%`, label: "TIMING ACC", color: executionProfile.timingAccuracy >= 60 ? "#10b981" : "#f59e0b" },
                        { value: `${executionProfile.planAdherence}%`, label: "PLAN ADH", color: executionProfile.planAdherence >= 70 ? "#10b981" : "#ef4444" },
                        { value: `${executionProfile.emotionalEntries}`, label: "EMO ENTRIES", color: executionProfile.emotionalEntries <= 5 ? "#10b981" : "#ef4444" },
                      ].map(s => (
                        <motion.div key={s.label} className="py-2 px-2 rounded-md bg-white/[0.02] border border-white/[0.04] text-center"
                          whileHover={{ borderColor: `${s.color}25`, backgroundColor: `${s.color}05` }}>
                          <span className="text-[11px] font-mono font-black tabular-nums block" style={{ color: s.color }}>{s.value}</span>
                          <span className="text-[6px] font-mono text-white/20 uppercase tracking-wider">{s.label}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Limit vs Market comparison */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="px-2.5 py-2 rounded-lg" style={{ backgroundColor: "#10b98105", border: "1px solid #10b98112" }}>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-[8px] font-mono text-emerald-400/60 uppercase tracking-wider font-bold">Limit Orders</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] text-white/20 font-mono">Win Rate</span>
                            <span className="text-[10px] font-mono font-black text-emerald-400">{executionProfile.limitWinRate}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] text-white/20 font-mono">Avg Return</span>
                            <span className="text-[10px] font-mono font-black text-emerald-400">{executionProfile.avgRRonLimit}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] text-white/20 font-mono">Best Streak</span>
                            <span className="text-[10px] font-mono font-black text-emerald-400/80">{executionProfile.consecutiveLimits}x</span>
                          </div>
                        </div>
                      </div>
                      <div className="px-2.5 py-2 rounded-lg" style={{ backgroundColor: "#ef444405", border: "1px solid #ef444412" }}>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          <span className="text-[8px] font-mono text-red-400/60 uppercase tracking-wider font-bold">Market Orders</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] text-white/20 font-mono">Win Rate</span>
                            <span className="text-[10px] font-mono font-black text-red-400">{executionProfile.marketWinRate}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] text-white/20 font-mono">Avg Return</span>
                            <span className="text-[10px] font-mono font-black text-red-400">{executionProfile.avgRRonMarket}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] text-white/20 font-mono">Worst Streak</span>
                            <span className="text-[10px] font-mono font-black text-red-400/80">{executionProfile.consecutiveMarkets}x</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Weekly order type distribution */}
                    <div className="space-y-1.5">
                      <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">Weekly Order Mix</span>
                      <div className="flex gap-1">
                        {executionProfile.weeklyTrend.map((d, di) => {
                          const dayTotal = d.limit + d.market + d.stop
                          return (
                            <div key={di} className="flex-1 text-center">
                              <div className="h-10 flex flex-col justify-end gap-px rounded-md overflow-hidden bg-white/[0.01] border border-white/[0.03]">
                                {dayTotal > 0 && (
                                  <>
                                    <motion.div style={{ height: `${(d.limit / dayTotal) * 100}%`, backgroundColor: "#10b98130" }}
                                      initial={{ height: 0 }} animate={{ height: `${(d.limit / dayTotal) * 100}%` }}
                                      transition={{ duration: 0.4, delay: di * 0.05 }} />
                                    <motion.div style={{ height: `${(d.stop / dayTotal) * 100}%`, backgroundColor: "#06b6d430" }}
                                      initial={{ height: 0 }} animate={{ height: `${(d.stop / dayTotal) * 100}%` }}
                                      transition={{ duration: 0.4, delay: 0.1 + di * 0.05 }} />
                                    <motion.div style={{ height: `${(d.market / dayTotal) * 100}%`, backgroundColor: "#ef444430" }}
                                      initial={{ height: 0 }} animate={{ height: `${(d.market / dayTotal) * 100}%` }}
                                      transition={{ duration: 0.4, delay: 0.2 + di * 0.05 }} />
                                  </>
                                )}
                              </div>
                              <span className="text-[7px] font-mono text-white/20 mt-1 block">{d.day}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── SESSION TIMING PANEL ── */}
                {expandedPanel === "timing" && (
                  <div className="p-3 space-y-2.5">
                    {executionProfile.sessionBreakdown.map((session, si) => {
                      const limColor = session.limitPct >= 60 ? "#10b981" : session.limitPct >= 40 ? "#f59e0b" : "#ef4444"
                      const rrPositive = session.avgRR.startsWith("+")
                      return (
                        <motion.div key={session.session}
                          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: si * 0.06 }}
                          className="rounded-lg px-3 py-2.5 border border-white/[0.04] hover:border-white/[0.08] bg-white/[0.01] transition-all">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono text-white/60 font-bold">{session.session}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-mono text-white/20">{session.trades} trades</span>
                              <span className="text-[10px] font-mono font-black tabular-nums" style={{ color: rrPositive ? "#10b981" : "#ef4444" }}>{session.avgRR}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] font-mono text-white/20">Limit Order %</span>
                              <span className="text-[9px] font-mono font-bold" style={{ color: limColor }}>{session.limitPct}%</span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden flex bg-white/[0.03]">
                              <motion.div className="h-full rounded-l-full" style={{ backgroundColor: `${limColor}60` }}
                                initial={{ width: 0 }} animate={{ width: `${session.limitPct}%` }}
                                transition={{ duration: 0.6, delay: si * 0.08 }} />
                              <div className="h-full flex-1 rounded-r-full" style={{ backgroundColor: "rgba(239,68,68,0.15)" }} />
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                    <div className="flex items-start gap-2 px-2.5 py-2 rounded-md border"
                      style={{ backgroundColor: identity.color + "04", borderColor: identity.color + "12" }}>
                      <Hexagon className="w-3 h-3 shrink-0 mt-0.5" style={{ color: identity.color + "60" }} />
                      <p className="text-[9px] text-white/30 leading-relaxed">
                        Your limit order percentage drops from {executionProfile.sessionBreakdown[0]?.limitPct}% in London to {executionProfile.sessionBreakdown[executionProfile.sessionBreakdown.length - 1]?.limitPct}% in Asian session. Discipline degrades with fatigue.
                      </p>
                    </div>
                  </div>
                )}

                {/* ── PATIENCE EVOLUTION PANEL ── */}
                {expandedPanel === "evolution" && (
                  <div className="p-3 space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">12-Week Patience Trend</span>
                        <span className="text-[9px] font-mono font-bold" style={{ color: identity.color }}>{executionProfile.orderEvolution[executionProfile.orderEvolution.length - 1]}%</span>
                      </div>
                      <div className="h-20 rounded-lg bg-white/[0.01] border border-white/[0.03] overflow-hidden relative p-2">
                        <svg width="100%" height="100%" viewBox="0 0 120 50" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id={svgId("evo-fill")} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={identity.color} stopOpacity="0.15" />
                              <stop offset="100%" stopColor={identity.color} stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <line x1="0" y1="25" x2="120" y2="25" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="2,3" />
                          <line x1="0" y1="15" x2="120" y2="15" stroke="rgba(16,185,129,0.06)" strokeWidth="0.5" strokeDasharray="2,3" />
                          {(() => {
                            const pts = executionProfile.orderEvolution.map((v, j) => `${(j / (executionProfile.orderEvolution.length - 1)) * 116 + 2},${48 - (v / 100) * 44}`)
                            const line = pts.join(" ")
                            const area = `${pts.join(" ")} 118,48 2,48`
                            return (
                              <>
                                <motion.polygon points={area} fill={`url(#${svgId("evo-fill")})`}
                                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
                                <motion.polyline points={line} fill="none" stroke={identity.color} strokeWidth="1.5" strokeLinecap="round"
                                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                  transition={{ duration: 1.2 }}
                                  style={{ filter: `drop-shadow(0 0 3px ${identity.color}40)` }} />
                                <circle cx={`${118}`} cy={`${48 - (executionProfile.orderEvolution[executionProfile.orderEvolution.length - 1] / 100) * 44}`}
                                  r="3" fill={identity.color}>
                                  <animate attributeName="r" values="2.5;4;2.5" dur="2s" repeatCount="indefinite" />
                                  <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                                </circle>
                              </>
                            )
                          })()}
                          <text x="122" y="15" fill="rgba(16,185,129,0.3)" fontSize="4" fontFamily="monospace">70%</text>
                          <text x="122" y="25" fill="rgba(255,255,255,0.15)" fontSize="4" fontFamily="monospace">50%</text>
                        </svg>
                      </div>
                    </div>

                    {/* Evolution milestones */}
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">Milestones</span>
                      {[
                        { pct: 70, label: "Sniper Tier", desc: "Institutional-grade patience. Top 5% of retail.", achieved: limitRatio >= 0.7 },
                        { pct: 50, label: "Hybrid Tier", desc: "Balanced execution. Conscious of order type.", achieved: limitRatio >= 0.5 },
                        { pct: 30, label: "Reactive Tier", desc: "Awareness of impatience. Work in progress.", achieved: limitRatio >= 0.3 },
                      ].map((m, mi) => (
                        <motion.div key={m.pct}
                          initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: mi * 0.06 }}
                          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md border"
                          style={{
                            backgroundColor: m.achieved ? `${identity.color}04` : "rgba(255,255,255,0.01)",
                            borderColor: m.achieved ? `${identity.color}15` : "rgba(255,255,255,0.04)",
                          }}>
                          <div className="w-5 h-5 rounded-md flex items-center justify-center"
                            style={{ backgroundColor: m.achieved ? `${identity.color}12` : "rgba(255,255,255,0.02)" }}>
                            {m.achieved ? (
                              <svg width="10" height="10" viewBox="0 0 10 10">
                                <motion.path d="M2 5 L4 7 L8 3" stroke={identity.color} strokeWidth="1.5"
                                  fill="none" strokeLinecap="round" strokeLinejoin="round"
                                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                  transition={{ duration: 0.3, delay: 0.2 + mi * 0.1 }} />
                              </svg>
                            ) : (
                              <Lock className="w-2.5 h-2.5 text-white/10" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-mono font-bold" style={{ color: m.achieved ? identity.color : "rgba(255,255,255,0.25)" }}>{m.label}</span>
                              <span className="text-[8px] font-mono text-white/15">{m.pct}%</span>
                            </div>
                            <span className="text-[8px] text-white/20 leading-relaxed">{m.desc}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── IMPATIENCE COST PANEL ── */}
                {expandedPanel === "cost" && (
                  <div className="p-3 space-y-3">
                    {/* Cost headline */}
                    <div className="text-center py-3">
                      <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider block mb-1">Estimated Edge Lost to Impatience</span>
                      <motion.span className="text-2xl font-mono font-black tabular-nums"
                        style={{ color: "#ef4444", textShadow: "0 0 12px rgba(239,68,68,0.2)" }}
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}>
                        -{((1 - limitRatio) * 4.2).toFixed(1)}R
                      </motion.span>
                      <span className="text-[9px] font-mono text-white/15 block mt-1">per 100 trades</span>
                    </div>

                    {/* Cost breakdown */}
                    <div className="space-y-1.5">
                      {[
                        { label: "Spread cost (market vs limit)", value: `-${((1 - limitRatio) * 1.2).toFixed(1)}R`, desc: "Market orders pay the spread every time. Limit orders often get fills inside the spread." },
                        { label: "Slippage on entries", value: `-${((1 - limitRatio) * 0.8).toFixed(1)}R`, desc: "Chasing price causes worse average entry. Even 2 pips of slippage compounds over time." },
                        { label: "Emotional decision tax", value: `-${((1 - limitRatio) * 1.4).toFixed(1)}R`, desc: "Market orders correlate with emotional states. Decisions made under urgency have worse outcomes." },
                        { label: "Missed optimal entry level", value: `-${((1 - limitRatio) * 0.8).toFixed(1)}R`, desc: "Limit orders at the right level give you better SL placement and higher R:R on the same trade." },
                      ].map((cost, ci) => (
                        <motion.div key={ci}
                          initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: ci * 0.06 }}
                          className="flex items-start gap-2.5 px-2.5 py-2 rounded-md bg-red-400/[0.02] border border-red-400/[0.06]">
                          <div className="flex flex-col items-center shrink-0 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400/40" />
                            {ci < 3 && <div className="w-px flex-1 bg-red-400/10 mt-1 min-h-[12px]" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono text-white/40 font-bold">{cost.label}</span>
                              <span className="text-[10px] font-mono font-black text-red-400 tabular-nums">{cost.value}</span>
                            </div>
                            <p className="text-[8px] text-white/20 leading-relaxed mt-0.5">{cost.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Recovery path */}
                    <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg relative overflow-hidden"
                      style={{ backgroundColor: "#10b98104", border: "1px solid #10b98112" }}>
                      <div className="absolute top-0 left-0 w-1 h-full rounded-r bg-emerald-400" />
                      <Hexagon className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400/40" />
                      <div>
                        <span className="text-[8px] font-mono text-emerald-400/60 uppercase tracking-wider font-bold block mb-0.5">Recovery Path</span>
                        <p className="text-[9px] text-white/30 leading-relaxed">
                          Shifting just 20% of your market orders to limit orders would recover approximately {((0.2 * (1 - limitRatio)) * 4.2).toFixed(1)}R per 100 trades.
                          At your current volume, that is the difference between breakeven and consistent profitability.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ────────────────────── Collapsible Section ────────────────────── */

function Section({ title, icon: SectionIcon, defaultOpen = true, sectionId, isOpen, onToggle, children }: {
  title: string
  icon?: React.ElementType
  defaultOpen?: boolean
  sectionId?: string
  isOpen?: boolean
  onToggle?: (open: boolean) => void
  children: React.ReactNode
}) {
  const [localOpen, setLocalOpen] = useState(defaultOpen)
  const [hovered, setHovered] = useState(false)
  const open = isOpen !== undefined ? isOpen : localOpen
  const toggle = () => {
    const next = !open
    if (onToggle) onToggle(next)
    else setLocalOpen(next)
  }
  return (
    <div id={sectionId}>
      <button onClick={toggle}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        className="flex items-center gap-2 w-full py-2.5 group relative">
        <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight className="w-3 h-3 text-white/20" />
        </motion.div>
        {SectionIcon && (
          <motion.div animate={{ scale: hovered ? 1.15 : 1, opacity: hovered ? 0.6 : 0.2 }} transition={{ duration: 0.2 }}>
            <SectionIcon className="w-3 h-3 text-white" />
          </motion.div>
        )}
        <span className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-semibold group-hover:text-white/50 transition-colors">
          {title}
        </span>
        <motion.div className="flex-1 h-px" animate={{ opacity: hovered ? 0.08 : 0.03 }}
          style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0))" }} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-3 space-y-2.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════ */

export function StrategyAnalytics({ data, profileRules }: StrategyAnalyticsProps) {
  const _uid = useId()
  const svgId = (name: string) => `${_uid.replace(/:/g, "")}-${name}`
  const [rules, setRules] = useState<RuleCommitment[]>(profileRules ?? DEMO_RULES)

  // Sync rules when profileRules changes (profile switch)
  useEffect(() => {
    if (profileRules) setRules(profileRules)
  }, [profileRules])

  const state = useMemo(() => (data ? deriveStrategicMirror(data, rules) : null), [data, rules])
  const scrollRef = useRef<HTMLDivElement>(null)

  // Section open states (controlled from Nerve Center)
  const [sectionOpen, setSectionOpen] = useState<Record<string, boolean>>({
    mirror: true, rules: true, exposure: true, dna: true,
  })
  const toggleSection = (id: string) => setSectionOpen(prev => ({ ...prev, [id]: !prev[id] }))
  const openAndScrollTo = (id: string) => {
    setSectionOpen(prev => ({ ...prev, [id]: true }))
    setTimeout(() => {
      const el = document.getElementById(`section-${id}`)
      if (el && scrollRef.current) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 80)
  }

  // Nerve Center hover state
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const askCopilot = useCallback((text: string) => {
    window.dispatchEvent(new CustomEvent("copilot:chat:ask", { detail: { threadType: "strategy", text } }))
  }, [])

  if (!data || !state) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-16 h-16">
            <Hexagon className="w-16 h-16 text-white/[0.04] absolute inset-0" strokeWidth={0.5} />
            <Crosshair className="w-6 h-6 text-white/15 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div>
            <p className="text-[11px] text-white/30">No positioning data yet</p>
            <p className="text-[10px] text-white/15 mt-1">Create scenarios to activate the strategy mirror</p>
          </div>
        </div>
      </div>
    )
  }

  /* ── Nerve Center computed signals ── */
  const gradeColor = state.riskGrade === "A" ? "#10b981" : state.riskGrade === "B" ? "#06b6d4" : state.riskGrade === "C" ? "#f59e0b" : "#ef4444"
  const patienceColor = state.limitRatio >= 0.6 ? "#10b981" : state.limitRatio >= 0.4 ? "#06b6d4" : state.limitRatio >= 0.3 ? "#f59e0b" : "#ef4444"
  const worstRule = rules.reduce((worst, r) => r.adherence < worst.adherence ? r : worst, rules[0])
  const rulesNeedAttention = rules.filter(r => r.adherence < 70).length
  const exposureAlert = state.dominantPct >= 35
  const dnaIdentity = state.limitRatio >= 0.7 ? "SNIPER" : state.limitRatio >= 0.5 ? "HYBRID" : state.limitRatio >= 0.3 ? "REACTIVE" : "IMPULSIVE"

  const nerveNodes = [
    {
      id: "mirror",
      label: "MIRROR",
      icon: Eye,
      color: gradeColor,
      metric: `${state.overallDiscipline}`,
      unit: "discipline score",
      alert: state.overallDiscipline < 70,
      alertMsg: "Discipline below threshold",
      detail: {
        lines: [
          { label: "Weekly Trend", value: state.weeklyAdherence[6] >= state.weeklyAdherence[0] ? "Improving" : "Declining", color: state.weeklyAdherence[6] >= state.weeklyAdherence[0] ? "#10b981" : "#ef4444" },
          { label: "Intent vs Action", value: `${state.intentVsAction.actual}% / ${state.intentVsAction.intended}%`, color: state.intentVsAction.actual >= state.intentVsAction.intended * 0.9 ? "#10b981" : "#f59e0b" },
          { label: "Today", value: state.weeklyAdherence[6] >= 80 ? "On track" : "Slipping", color: state.weeklyAdherence[6] >= 80 ? "#10b981" : "#ef4444" },
        ],
        sparkline: state.weeklyAdherence,
      },
    },
    {
      id: "rules",
      label: "RULES",
      icon: Shield,
      color: worstRule?.adherence >= 80 ? "#10b981" : worstRule?.adherence >= 60 ? "#f59e0b" : "#ef4444",
      metric: `${rules.length}`,
      unit: "commitments",
      alert: rulesNeedAttention > 0,
      alertMsg: `${rulesNeedAttention} rule${rulesNeedAttention > 1 ? "s" : ""} need attention`,
      detail: {
        lines: [
          { label: "Perfect (100%)", value: `${rules.filter(r => r.adherence === 100).length}`, color: "#10b981" },
          { label: "At Risk (<70%)", value: `${rulesNeedAttention}`, color: rulesNeedAttention > 0 ? "#ef4444" : "#10b981" },
          { label: "Worst Rule", value: `${worstRule?.adherence ?? 0}%`, color: (worstRule?.adherence ?? 0) >= 70 ? "#f59e0b" : "#ef4444" },
        ],
        sparkline: rules.slice(0, 7).map(r => r.adherence),
      },
    },
    {
      id: "exposure",
      label: "EXPOSURE",
      icon: CircleDot,
      color: exposureAlert ? "#ef4444" : state.dominantPct >= 25 ? "#f59e0b" : "#10b981",
      metric: `${state.dominantPct}%`,
      unit: `${state.dominantCurrency} weight`,
      alert: exposureAlert,
      alertMsg: `${state.dominantCurrency} over-concentrated`,
      detail: {
        lines: [
          { label: "Top Currency", value: `${state.dominantCurrency} ${state.dominantPct}%`, color: exposureAlert ? "#ef4444" : "#f59e0b" },
          { label: "Active Pairs", value: `${data.instruments.length}`, color: "#06b6d4" },
          { label: "Correlation", value: state.correlationRisk ? "HIGH" : "LOW", color: state.correlationRisk ? "#ef4444" : "#10b981" },
        ],
        sparkline: data.instruments.slice(0, 7).map(i => i.count),
      },
    },
    {
      id: "dna",
      label: "DNA",
      icon: Target,
      color: patienceColor,
      metric: dnaIdentity,
      unit: `${Math.round(state.limitRatio * 100)}% exec patience`,
      alert: state.limitRatio < 0.3,
      alertMsg: "Execution impulsive",
      detail: {
        lines: [
          { label: "Limit Orders", value: `${Math.round(state.limitRatio * 100)}%`, color: patienceColor },
          { label: "Entry Quality", value: `${state.entryQuality}%`, color: state.entryQuality >= 60 ? "#10b981" : "#f59e0b" },
          { label: "Structure Depth", value: `${state.structureDepth}%`, color: state.structureDepth >= 50 ? "#10b981" : "#f59e0b" },
        ],
        sparkline: data.entryMix.map(e => e.value),
      },
    },
  ]

  return (
    <div className="h-full overflow-auto">

      {/* ═══════════════════════════════════════════════════════════
         STRATEGY NERVE CENTER -- Living cockpit instrument panel
         4 signal nodes: Mirror / Rules / Exposure / DNA
         Central heartbeat: Discipline score
         Click any node = scroll + open that section
         Hover = quick-intel overlay with critical insight
         Alert = pulse when section needs attention
         ═══════════════════════════════════════════════════════════ */}
      <div className="border-b border-white/[0.04] relative overflow-hidden">

        {/* Ambient background field */}
        <motion.div className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.015, 0.04, 0.015] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full"
            style={{ backgroundColor: gradeColor, filter: "blur(40px)" }} />
        </motion.div>

        {/* ── Top row: Discipline heartbeat center ── */}
        <div className="relative px-3 pt-2.5 pb-1.5">
          <div className="flex items-center gap-3">
            {/* Compact discipline ring */}
            <div className="relative shrink-0">
              <svg width="58" height="58" viewBox="0 0 58 58">
                <circle cx="29" cy="29" r="25" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
                <motion.circle cx="29" cy="29" r="25" fill="none" stroke={gradeColor} strokeWidth="3"
                  strokeLinecap="round" strokeDasharray={2 * Math.PI * 25}
                  initial={{ strokeDashoffset: 2 * Math.PI * 25 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 25 * (1 - state.overallDiscipline / 100) }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  transform="rotate(-90 29 29)"
                  style={{ filter: `drop-shadow(0 0 4px ${gradeColor}40)` }} />
                {/* Breathing pulse */}
                <circle cx="29" cy="29" r="25" fill="none" stroke={gradeColor} strokeWidth="0.5" opacity="0.2">
                  <animate attributeName="r" values="25;29;25" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0;0.2" dur="3s" repeatCount="indefinite" />
                </circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-black tabular-nums leading-none" style={{ color: gradeColor }}>{state.overallDiscipline}</span>
                <span className="text-[7px] font-mono text-white/25 uppercase tracking-wider font-bold">{state.riskGrade}</span>
              </div>
            </div>

            {/* Title + Status line */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-white/60 tracking-wide">STRATEGY OS</span>
                <motion.div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
                  style={{ backgroundColor: `${gradeColor}08`, border: `1px solid ${gradeColor}15` }}
                  animate={{ borderColor: [`${gradeColor}15`, `${gradeColor}30`, `${gradeColor}15`] }}
                  transition={{ duration: 3, repeat: Infinity }}>
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: gradeColor }}>
                  </div>
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider" style={{ color: gradeColor }}>
                    {state.overallDiscipline >= 80 ? "OPTIMAL" : state.overallDiscipline >= 60 ? "ACTIVE" : "ALERT"}
                  </span>
                </motion.div>
              </div>
              {/* Quick truth: the single most important thing right now */}
              <p className="text-[9px] text-white/25 mt-0.5 font-mono leading-relaxed line-clamp-2">
                {rulesNeedAttention > 0
                  ? `${rulesNeedAttention} rule${rulesNeedAttention > 1 ? "s" : ""} below threshold. ${worstRule?.rule} at ${worstRule?.adherence}%.`
                  : exposureAlert
                    ? `${state.dominantCurrency} exposure at ${state.dominantPct}%. Concentration risk active.`
                    : state.limitRatio < 0.5
                      ? `Execution patience at ${Math.round(state.limitRatio * 100)}%. Edge leaking through order type.`
                      : `All systems nominal. Discipline ${state.overallDiscipline}%, patience ${Math.round(state.limitRatio * 100)}%.`
                }
              </p>
            </div>

            {/* Overall alert count */}
            {(rulesNeedAttention > 0 || exposureAlert || state.limitRatio < 0.3) && (
              <motion.div className="relative shrink-0"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#ef444410", border: "1px solid #ef444420" }}>
                  <TriangleAlert className="w-3.5 h-3.5 text-red-400/60" />
                </div>
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-[7px] font-mono font-black text-white">
                    {(rulesNeedAttention > 0 ? 1 : 0) + (exposureAlert ? 1 : 0) + (state.limitRatio < 0.3 ? 1 : 0)}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* ── Signal Nodes Row ── */}
        <div className="relative px-3 pb-2">
          <div className="flex gap-1.5">
            {nerveNodes.map((node) => {
              const NIcon = node.icon
              const isHovered = hoveredNode === node.id
              const isOpen = sectionOpen[node.id]

              return (
                <motion.button
                  key={node.id}
                  className="flex-1 relative group"
                  onClick={() => openAndScrollTo(node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.div
                    className="rounded-lg px-2 py-2.5 relative overflow-hidden transition-all"
                    animate={{
                      backgroundColor: isHovered ? `${node.color}0c` : "rgba(255,255,255,0.015)",
                      borderColor: isHovered ? `${node.color}35` : isOpen ? `${node.color}15` : "rgba(255,255,255,0.04)",
                    }}
                    style={{ border: "1px solid" }}
                  >
                    {/* Hover glow */}
                    {isHovered && (
                      <motion.div className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full"
                          style={{ backgroundColor: node.color, filter: "blur(20px)", opacity: 0.08 }} />
                      </motion.div>
                    )}

                    {/* Alert pulse */}
                    {node.alert && (
                      <motion.div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: "#ef4444" }}
                        animate={{ scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }} />
                    )}

                    {/* Content */}
                    <div className="relative flex flex-col items-center gap-1">
                      <motion.div animate={{ scale: isHovered ? 1.15 : 1, opacity: isHovered ? 0.9 : 0.35 }}
                        transition={{ duration: 0.15 }}>
                        <NIcon className="w-3.5 h-3.5" style={{ color: isHovered ? node.color : "white" }} />
                      </motion.div>

                      <span className="text-sm font-mono font-black tabular-nums leading-none"
                        style={{ color: isHovered ? node.color : "rgba(255,255,255,0.75)" }}>
                        {node.metric}
                      </span>

                      <span className="text-[7px] font-mono uppercase tracking-wider leading-none font-bold"
                        style={{ color: isHovered ? `${node.color}90` : "rgba(255,255,255,0.2)" }}>
                        {node.unit}
                      </span>
                    </div>

                    {/* Active section indicator */}
                    {isOpen && (
                      <motion.div className="absolute bottom-0 inset-x-2 h-0.5 rounded-full"
                        style={{ backgroundColor: node.color, opacity: 0.4 }} />
                    )}
                  </motion.div>

                  {/* Node label below -- BIGGER */}
                  <div className="mt-1.5 text-center">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-[0.12em]"
                      style={{ color: isHovered ? node.color : "rgba(255,255,255,0.25)" }}>
                      {node.label}
                    </span>
                    {/* Hover down arrow */}
                    {isHovered && (
                      <motion.div initial={{ opacity: 0, y: -2 }} animate={{ opacity: 0.4, y: 0 }}
                        className="flex justify-center mt-0.5">
                        <ChevronDown className="w-2.5 h-2.5" style={{ color: node.color }} />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* ═══════════════════════════════════════════════════════════
             HOVER INTEL OVERLAY -- The most advanced quick-intel panel
             Each node reveals a unique, deeply detailed animated overview
             This is the cockpit readout: not generic stats, but SIGNAL
             ═════════════════════════════════════════════��═════════════ */}
          <AnimatePresence mode="wait">
            {hoveredNode && (() => {
              const node = nerveNodes.find(n => n.id === hoveredNode)
              if (!node) return null

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -4, scaleY: 0.97 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: "top" }}
                  className="mt-2"
                >
                  <div className="rounded-xl overflow-hidden relative"
                    style={{ backgroundColor: `${node.color}06`, border: `1px solid ${node.color}18` }}>

                    {/* Ambient side glow */}
                    <div className="absolute top-0 left-0 w-1 h-full rounded-r" style={{ backgroundColor: node.color, opacity: 0.3 }} />
                    <motion.div className="absolute top-0 right-0 w-20 h-full pointer-events-none"
                      style={{ background: `linear-gradient(to left, ${node.color}04, transparent)` }} />

                    {/* Alert banner */}
                    {node.alert && (
                      <motion.div className="mx-3 mt-2.5 flex items-center gap-2 px-2.5 py-1.5 rounded-md"
                        style={{ backgroundColor: "#ef444406", border: "1px solid #ef444412" }}
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                          <AlertTriangle className="w-3 h-3 text-red-400/60" />
                        </motion.div>
                        <span className="text-[9px] font-mono text-red-400/60 font-bold">{node.alertMsg}</span>
                      </motion.div>
                    )}

                    <div className="p-3">

                      {/* ═══ MIRROR INTEL ═══ */}
                      {hoveredNode === "mirror" && (
                        <div className="space-y-3">
                          {/* Discipline gauge with animated fill */}
                          <div className="flex items-center gap-3">
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <Gauge className="w-3 h-3" style={{ color: `${node.color}50` }} />
                                  <span className="text-[9px] font-mono text-white/30 font-bold uppercase tracking-wider">Discipline Gauge</span>
                                </div>
                                <motion.span className="text-sm font-mono font-black tabular-nums"
                                  style={{ color: node.color, textShadow: `0 0 8px ${node.color}30` }}
                                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                                  {state.overallDiscipline}%
                                </motion.span>
                              </div>
                              <div className="h-2 rounded-full overflow-hidden bg-white/[0.03] relative">
                                <motion.div className="h-full rounded-full relative"
                                  style={{ background: `linear-gradient(90deg, ${node.color}40, ${node.color})` }}
                                  initial={{ width: 0 }} animate={{ width: `${state.overallDiscipline}%` }}
                                  transition={{ duration: 0.8, ease: "easeOut" }}>
                                  <motion.div className="absolute inset-0"
                                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)", backgroundSize: "200% 100%" }}
                                    animate={{ backgroundPositionX: ["0%", "200%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                                </motion.div>
                                {/* Threshold markers */}
                                {[50, 70, 90].map(t => (
                                  <div key={t} className="absolute top-0 bottom-0 w-px bg-white/[0.08]" style={{ left: `${t}%` }} />
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* 7-day sparkline -- animated bars */}
                          <div className="space-y-1.5">
                            <span className="text-[8px] font-mono text-white/15 uppercase tracking-wider">7-Day Adherence Map</span>
                            <div className="flex gap-1.5 h-14">
                              {state.weeklyAdherence.map((v, i) => {
                                const dayColor = v >= 80 ? "#10b981" : v >= 60 ? "#f59e0b" : "#ef4444"
                                const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
                                const isToday = i === 6
                                return (
                                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    {/* Score on top */}
                                    <span className="text-[9px] font-mono font-black tabular-nums leading-none" style={{ color: dayColor }}>{v}</span>
                                    <div className="flex-1 w-full rounded-md overflow-hidden bg-white/[0.02] flex flex-col justify-end relative">
                                      <motion.div className="w-full rounded-md"
                                        style={{ backgroundColor: `${dayColor}30`, boxShadow: `0 0 6px ${dayColor}10` }}
                                        initial={{ height: 0 }} animate={{ height: `${v}%` }}
                                        transition={{ duration: 0.5, delay: i * 0.04 }} />
                                      {isToday && (
                                        <motion.div className="absolute inset-x-0 top-0 h-full border rounded-md"
                                          style={{ borderColor: `${dayColor}30` }}
                                          animate={{ borderColor: [`${dayColor}20`, `${dayColor}40`, `${dayColor}20`] }}
                                          transition={{ duration: 2, repeat: Infinity }} />
                                      )}
                                    </div>
                                    <span className={`text-[8px] font-mono font-bold ${isToday ? "text-white/50" : "text-white/20"}`}>{dayNames[i]}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          {/* Intent vs Action gap */}
                          <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white/[0.015] border border-white/[0.04]">
                            <Brain className="w-3.5 h-3.5 text-white/15 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[8px] font-mono text-white/25">Intent vs Action</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-[8px] font-mono text-white/40">{state.intentVsAction.intended}%</span>
                                  <ChevronRight className="w-2.5 h-2.5 text-white/15" />
                                  <span className="text-[9px] font-mono font-bold"
                                    style={{ color: state.intentVsAction.actual >= state.intentVsAction.intended * 0.9 ? "#10b981" : "#ef4444" }}>
                                    {state.intentVsAction.actual}%
                                  </span>
                                </div>
                              </div>
                              <div className="h-1 rounded-full overflow-hidden bg-white/[0.03] flex">
                                <motion.div className="h-full rounded-full"
                                  style={{ backgroundColor: state.intentVsAction.actual >= state.intentVsAction.intended * 0.9 ? "#10b981" : "#ef4444" }}
                                  initial={{ width: 0 }} animate={{ width: `${(state.intentVsAction.actual / state.intentVsAction.intended) * 100}%` }}
                                  transition={{ duration: 0.6 }} />
                              </div>
                            </div>
                          </div>

                          {/* Trend indicator */}
                          <div className="flex items-center gap-2">
                            {state.weeklyAdherence[6] >= state.weeklyAdherence[0] ? (
                              <TrendingUp className="w-3 h-3 text-emerald-400/50" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-red-400/50" />
                            )}
                            <span className="text-[8px] font-mono text-white/25">
                              {state.weeklyAdherence[6] >= state.weeklyAdherence[0]
                                ? `Trending up ${state.weeklyAdherence[6] - state.weeklyAdherence[0]}pts this week`
                                : `Dropped ${state.weeklyAdherence[0] - state.weeklyAdherence[6]}pts from start of week`}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* ═══ RULES INTEL ═══ */}
                      {hoveredNode === "rules" && (
                        <div className="space-y-3">
                          {/* Rule status grid */}
                          <div className="grid grid-cols-2 gap-1.5">
                            {[
                              { label: "PERFECT", value: rules.filter(r => r.adherence === 100).length, total: rules.length, color: "#10b981", icon: Shield },
                              { label: "AT RISK", value: rulesNeedAttention, total: rules.length, color: rulesNeedAttention > 0 ? "#ef4444" : "#10b981", icon: AlertTriangle },
                              { label: "BEST STREAK", value: `${Math.max(...rules.map(r => r.bestStreak))}d`, total: null, color: "#06b6d4", icon: Flame },
                              { label: "AVG ADHERENCE", value: `${Math.round(rules.reduce((s, r) => s + r.adherence, 0) / rules.length)}%`, total: null, color: gradeColor, icon: Activity },
                            ].map((stat, si) => (
                              <motion.div key={stat.label} className="px-2.5 py-2 rounded-lg bg-white/[0.015] border border-white/[0.04]"
                                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: si * 0.04 }}>
                                <div className="flex items-center gap-1.5 mb-1">
                                  <stat.icon className="w-2.5 h-2.5" style={{ color: `${stat.color}50` }} />
                                  <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider">{stat.label}</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                  <span className="text-sm font-mono font-black tabular-nums" style={{ color: stat.color }}>{stat.value}</span>
                                  {stat.total !== null && <span className="text-[8px] font-mono text-white/15">/{stat.total}</span>}
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          {/* Individual rule bars */}
                          <div className="space-y-1">
                            <span className="text-[8px] font-mono text-white/15 uppercase tracking-wider">Rule Health</span>
                            {rules.slice(0, 4).map((rule, ri) => {
                              const rColor = rule.adherence >= 80 ? "#10b981" : rule.adherence >= 60 ? "#f59e0b" : "#ef4444"
                              return (
                                <motion.div key={rule.id} className="flex items-center gap-2"
                                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: ri * 0.04 }}>
                                  <div className="flex-1 min-w-0">
                                    <span className="text-[8px] font-mono text-white/30 truncate block">{rule.rule}</span>
                                  </div>
                                  <div className="w-14 h-1.5 rounded-full overflow-hidden bg-white/[0.03] shrink-0">
                                    <motion.div className="h-full rounded-full"
                                      style={{ backgroundColor: rColor }}
                                      initial={{ width: 0 }} animate={{ width: `${rule.adherence}%` }}
                                      transition={{ duration: 0.5, delay: ri * 0.06 }} />
                                  </div>
                                  <span className="text-[8px] font-mono font-bold tabular-nums w-7 text-right" style={{ color: rColor }}>{rule.adherence}%</span>
                                </motion.div>
                              )
                            })}
                          </div>

                          {/* Violation heat */}
                          {rulesNeedAttention > 0 && (
                            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-red-400/[0.03] border border-red-400/[0.08]">
                              <Flame className="w-3 h-3 text-red-400/40 shrink-0" />
                              <span className="text-[8px] font-mono text-white/25">
                                {worstRule?.rule} needs immediate attention at {worstRule?.adherence}%
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ═══ EXPOSURE INTEL ═══ */}
                      {hoveredNode === "exposure" && (
                        <div className="space-y-3">
                          {/* Currency concentration visual */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <BarChart3 className="w-3 h-3" style={{ color: `${node.color}50` }} />
                                <span className="text-[9px] font-mono text-white/30 font-bold uppercase tracking-wider">Capital Map</span>
                              </div>
                              <span className="text-[8px] font-mono text-white/20">{data.instruments.length} pairs active</span>
                            </div>

                            {/* Instrument bars */}
                            <div className="space-y-1">
                              {data.instruments.slice(0, 5).map((inst, ii) => {
                                const instrTotal = data.instruments.reduce((s, i) => s + i.count, 0) || 1
                                const pct = Math.round((inst.count / instrTotal) * 100)
                                const barColor = ii === 0 ? (pct >= 35 ? "#ef4444" : "#f59e0b") : "#06b6d4"
                                return (
                                  <motion.div key={inst.symbol} className="flex items-center gap-2"
                                    initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: ii * 0.04 }}>
                                    <span className="text-[9px] font-mono font-bold text-white/50 w-12 shrink-0">{inst.symbol}</span>
                                    <div className="flex-1 h-2 rounded-full overflow-hidden bg-white/[0.03]">
                                      <motion.div className="h-full rounded-full relative overflow-hidden"
                                        style={{ backgroundColor: `${barColor}50` }}
                                        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                        transition={{ duration: 0.6, delay: ii * 0.06 }}>
                                        {ii === 0 && (
                                          <motion.div className="absolute inset-0"
                                            style={{ background: `linear-gradient(90deg, transparent, ${barColor}30, transparent)`, backgroundSize: "200% 100%" }}
                                            animate={{ backgroundPositionX: ["0%", "200%"] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                                        )}
                                      </motion.div>
                                    </div>
                                    <span className="text-[8px] font-mono font-bold tabular-nums w-7 text-right" style={{ color: barColor }}>{pct}%</span>
                                  </motion.div>
                                )
                              })}
                            </div>
                          </div>

                          {/* Correlation + concentration alerts */}
                          <div className="grid grid-cols-2 gap-1.5">
                            <div className="px-2.5 py-2 rounded-lg bg-white/[0.015] border border-white/[0.04]">
                              <span className="text-[7px] font-mono text-white/15 uppercase tracking-wider block mb-1">Concentration</span>
                              <span className="text-sm font-mono font-black tabular-nums"
                                style={{ color: exposureAlert ? "#ef4444" : "#10b981" }}>{state.dominantPct}%</span>
                              <span className="text-[7px] font-mono text-white/15 block">{state.dominantCurrency}</span>
                            </div>
                            <div className="px-2.5 py-2 rounded-lg bg-white/[0.015] border border-white/[0.04]">
                              <span className="text-[7px] font-mono text-white/15 uppercase tracking-wider block mb-1">Correlation</span>
                              <span className="text-sm font-mono font-black"
                                style={{ color: state.correlationRisk ? "#ef4444" : "#10b981" }}>
                                {state.correlationRisk ? "HIGH" : "LOW"}
                              </span>
                              <span className="text-[7px] font-mono text-white/15 block">risk level</span>
                            </div>
                          </div>

                          {/* Warning if exposure concentrated */}
                          {exposureAlert && (
                            <motion.div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-red-400/[0.03] border border-red-400/[0.08]"
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                              <AlertTriangle className="w-3 h-3 text-red-400/40 shrink-0" />
                              <span className="text-[8px] font-mono text-white/25">
                                {state.dominantCurrency} at {state.dominantPct}% -- reduce or hedge to avoid single-currency blowup
                              </span>
                            </motion.div>
                          )}
                        </div>
                      )}

                      {/* ═══ DNA INTEL ═══ */}
                      {hoveredNode === "dna" && (
                        <div className="space-y-3">
                          {/* Identity badge */}
                          <div className="flex items-center gap-3">
                            <motion.div className="px-3 py-2 rounded-lg relative overflow-hidden"
                              style={{ backgroundColor: `${node.color}08`, border: `1px solid ${node.color}20` }}
                              animate={{ borderColor: [`${node.color}15`, `${node.color}30`, `${node.color}15`] }}
                              transition={{ duration: 2.5, repeat: Infinity }}>
                              <span className="text-sm font-mono font-black tracking-wider" style={{ color: node.color, textShadow: `0 0 10px ${node.color}30` }}>
                                {dnaIdentity}
                              </span>
                              <motion.div className="absolute inset-0 pointer-events-none"
                                style={{ background: `linear-gradient(90deg, transparent, ${node.color}08, transparent)`, backgroundSize: "200% 100%" }}
                                animate={{ backgroundPositionX: ["0%", "200%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[8px] font-mono text-white/20 block">Patience Index</span>
                              <div className="flex items-center gap-1.5 mt-1">
                                <div className="flex-1 h-2 rounded-full overflow-hidden bg-white/[0.03]">
                                  <motion.div className="h-full rounded-full"
                                    style={{ background: `linear-gradient(90deg, #ef4444, #f59e0b, #06b6d4, #10b981)` }}
                                    initial={{ width: 0 }} animate={{ width: `${Math.round(state.limitRatio * 100)}%` }}
                                    transition={{ duration: 0.8 }} />
                                </div>
                                <span className="text-[10px] font-mono font-black tabular-nums" style={{ color: node.color }}>
                                  {Math.round(state.limitRatio * 100)}%
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Order type breakdown */}
                          <div className="grid grid-cols-3 gap-1">
                            {data.entryMix.map((e, ei) => {
                              const eColor = e.label === "limit" ? "#10b981" : e.label === "stop" ? "#06b6d4" : "#ef4444"
                              const eTotal = data.entryMix.reduce((s, x) => s + x.value, 0) || 1
                              const ePct = Math.round((e.value / eTotal) * 100)
                              return (
                                <motion.div key={e.label} className="px-2 py-2 rounded-lg bg-white/[0.015] border border-white/[0.04] text-center"
                                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: ei * 0.05 }}>
                                  <div className="w-6 h-6 mx-auto mb-1 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: `${eColor}10`, border: `1px solid ${eColor}20` }}>
                                    <span className="text-[10px] font-mono font-black" style={{ color: eColor }}>{ePct}</span>
                                  </div>
                                  <span className="text-[7px] font-mono uppercase tracking-wider font-bold" style={{ color: `${eColor}80` }}>
                                    {e.label === "limit" ? "LIMIT" : e.label === "stop" ? "STOP" : "MARKET"}
                                  </span>
                                  <span className="text-[7px] font-mono text-white/15 block">{e.value} orders</span>
                                </motion.div>
                              )
                            })}
                          </div>

                          {/* Key stats row */}
                          <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white/[0.015] border border-white/[0.04]">
                            <div className="flex-1 text-center">
                              <span className="text-[10px] font-mono font-black text-emerald-400">{state.entryQuality}%</span>
                              <span className="text-[6px] font-mono text-white/15 block uppercase">Entry Q</span>
                            </div>
                            <div className="w-px h-5 bg-white/[0.06]" />
                            <div className="flex-1 text-center">
                              <span className="text-[10px] font-mono font-black" style={{ color: "#06b6d4" }}>{state.structureDepth}%</span>
                              <span className="text-[6px] font-mono text-white/15 block uppercase">Structure</span>
                            </div>
                            <div className="w-px h-5 bg-white/[0.06]" />
                            <div className="flex-1 text-center">
                              <span className="text-[10px] font-mono font-black" style={{ color: state.limitRatio >= 0.5 ? "#10b981" : "#ef4444" }}>
                                {state.limitRatio >= 0.7 ? "A+" : state.limitRatio >= 0.5 ? "B" : state.limitRatio >= 0.3 ? "C" : "D"}
                              </span>
                              <span className="text-[6px] font-mono text-white/15 block uppercase">Exec Grade</span>
                            </div>
                          </div>

                          {/* Impatience cost teaser */}
                          {state.limitRatio < 0.7 && (
                            <motion.div className="flex items-center gap-2 px-2 py-1.5 rounded-md"
                              style={{ backgroundColor: "#ef444404", border: "1px solid #ef444410" }}
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
                              <Zap className="w-3 h-3 text-red-400/40 shrink-0" />
                              <span className="text-[8px] font-mono text-white/25">
                                Estimated -{((1 - state.limitRatio) * 4.2).toFixed(1)}R per 100 trades lost to impatience
                              </span>
                            </motion.div>
                          )}
                        </div>
                      )}

                      {/* Quick-action row */}
                      <div className="flex gap-1.5 mt-2.5 pt-2" style={{ borderTop: `1px solid ${node.color}08` }}>
                        <motion.button
                          onClick={(e) => { e.stopPropagation(); openAndScrollTo(node.id) }}
                          className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md transition-all text-[8px] font-mono font-bold uppercase tracking-wider"
                          style={{ backgroundColor: `${node.color}08`, border: `1px solid ${node.color}15`, color: `${node.color}70` }}
                          whileHover={{ backgroundColor: `${node.color}15`, borderColor: `${node.color}30` }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Eye className="w-3 h-3" />
                          Inspect Full View
                        </motion.button>
                        <motion.button
                          onClick={(e) => { e.stopPropagation(); askCopilot(`Analyze my ${node.label.toLowerCase()} data and give me your honest assessment`) }}
                          className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-md transition-all text-[8px] font-mono"
                          style={{ backgroundColor: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.12)", color: "rgba(6,182,212,0.5)" }}
                          whileHover={{ backgroundColor: "rgba(6,182,212,0.1)" }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Zap className="w-3 h-3" />
                          Ask AI
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })()}
          </AnimatePresence>
        </div>
      </div>

      {/* ═══ SCROLLABLE CONTENT ═══ */}
        <div className="px-3 py-2 space-y-0.5">

          <Section title="The Discipline Mirror" icon={Eye} sectionId="section-mirror"
            isOpen={sectionOpen.mirror} onToggle={() => toggleSection("mirror")}>
            <WeeklyMirrorTimeline
              weeklyData={state.weeklyAdherence}
              intended={state.intentVsAction.intended}
            />
          </Section>

          <Section title={`Rule Commitments (${rules.length})`} icon={Shield} sectionId="section-rules"
            isOpen={sectionOpen.rules} onToggle={() => toggleSection("rules")}>
            <div className="space-y-1.5">
              {rules.map((rule) => (
                <RuleCard key={rule.id} rule={rule} onAsk={askCopilot} />
              ))}
            </div>
            <RulePicker
              existingRuleTexts={rules.map((r) => r.rule)}
              onAddRule={(newRule) => {
                setRules((prev) => [
                  ...prev,
                  {
                    id: `r${Date.now()}`,
                    rule: newRule.rule,
                    category: newRule.category,
                    adherence: 0,
                    violations: 0,
                    streak: 0,
                    bestStreak: 0,
                    totalDaysTracked: 0,
                    weeklyHistory: [0, 0, 0, 0, 0, 0, 0],
                    teaching: newRule.teaching,
                    impactWhenFollowed: "Start tracking to see impact data.",
                    impactWhenBroken: "No violation data yet.",
                    violationLog: [],
                  },
                ])
              }}
            />
          </Section>

          <Section title="Capital Exposure Map" icon={CircleDot} sectionId="section-exposure"
            isOpen={sectionOpen.exposure} onToggle={() => toggleSection("exposure")}>
            <ExposureGravityField instruments={data.instruments} />
          </Section>

          <Section title="Execution DNA Profile" icon={Target} sectionId="section-dna"
            isOpen={sectionOpen.dna} onToggle={() => toggleSection("dna")}>
            <ExecutionDNA entryMix={data.entryMix} limitRatio={state.limitRatio} />
          </Section>

        </div>
    </div>
  )
}
