"use client"

import type React from "react"
import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInstrument } from "@/lib/stores/useInstrument"
import { useAnalysis } from "@/lib/stores/useAnalysis"
import { useConfluenceStore } from "@/stores/confluence-store"
import { confluenceById } from "@/lib/confluences"
import {
  deriveOrderLayerState,
  generateIntelligenceQuestions,
  DIRECTIVE_CONFIG,
  STATE_CONFIG,
  QUESTION_SOURCE_CONFIG,
  QUESTION_PRIORITY_CONFIG,
  type StrategyInput,
  type PsychologyInput,
  type ActivityInput,
  type OrderLayerState,
  type IntelligenceQuestion,
  type SessionContext,
} from "@/components/copilot/order-layer/order-layer-engine"
import {
  Send,
  ChevronDown,
  ChevronRight,
  Crosshair,
  Clock,
  Shield,
  Brain,
  AlertTriangle,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Zap,
  Eye,
  BarChart3,
  Layers,
  ArrowRight,
  Gauge,
  BookOpen,
  Radar,
  Lock,
  Sparkles,


  X,
  ChevronUp,
  Calendar,
  Star,
  ShieldAlert,
  Timer,
  Scale,
  Swords,
  Flame,
  Route,
  CircleDot,
  HeartPulse,
  Scan,
  Fingerprint,
  ChevronLeft,
} from "lucide-react"
import { ActivityGuideAndDemo, type DemoOverrides, SESSION_OPTIONS } from "./ActivityGuideAndDemo"

// ═══════════════════════════════════════════════════════════════════
// SESSION INTELLIGENCE ENGINE
// ═══════════════════════════════════════════════════════════════════
function getSessionPhase(nowMs: number) {
  const d = new Date(nowMs)
  const h = d.getUTCHours()
  const m = d.getUTCMinutes()
  const t = h * 60 + m

  const inAsiaKZ = t >= 0 * 60 && t < 4 * 60
  const inLondonKZ = t >= 7 * 60 && t < 10 * 60
  const inNYKZ = t >= 13 * 60 && t < 16 * 60
  const inLondonClose = t >= 15 * 60 && t < 16 * 60

  if (inLondonClose) {
    const elapsed = t - 15 * 60
    const remaining = 16 * 60 - t
    return { name: "London Close", phase: "Reversal Window", phaseColor: "#f59e0b", killzone: true, subPhase: elapsed < 20 ? "Early reversal scan" : "Late reversal confirmation", elapsed, remaining, totalMinutes: 60, kzProgress: elapsed / 60 }
  }
  if (inNYKZ) {
    const elapsed = t - 13 * 60
    const remaining = 16 * 60 - t
    const sub = elapsed < 30 ? "Opening displacement" : elapsed < 90 ? "Prime execution zone" : "Momentum fade"
    return { name: "New York", phase: "Prime Execution", phaseColor: "#3b82f6", killzone: true, subPhase: sub, elapsed, remaining, totalMinutes: 180, kzProgress: elapsed / 180 }
  }
  if (inLondonKZ) {
    const elapsed = t - 7 * 60
    const remaining = 10 * 60 - t
    const sub = elapsed < 30 ? "Initial sweep phase" : elapsed < 90 ? "Displacement in progress" : "Trend continuation zone"
    return { name: "London", phase: "Displacement Phase", phaseColor: "#10b981", killzone: true, subPhase: sub, elapsed, remaining, totalMinutes: 180, kzProgress: elapsed / 180 }
  }
  if (inAsiaKZ) {
    const elapsed = t - 0 * 60
    const remaining = 4 * 60 - t
    const sub = elapsed < 60 ? "Range building" : elapsed < 150 ? "Consolidation deepening" : "Pre-London positioning"
    return { name: "Asia", phase: "Accumulation", phaseColor: "#8b5cf6", killzone: false, subPhase: sub, elapsed, remaining, totalMinutes: 240, kzProgress: elapsed / 240 }
  }
  if (t >= 4 * 60 && t < 7 * 60) {
    const remaining = 7 * 60 - t
    return { name: "Pre-London", phase: "Preparation", phaseColor: "#71717a", killzone: false, subPhase: remaining < 30 ? "London imminent -- prepare bias" : "Dead zone -- mark Asia range", elapsed: t - 4 * 60, remaining, totalMinutes: 180, kzProgress: (t - 4 * 60) / 180 }
  }
  if (t >= 10 * 60 && t < 13 * 60) {
    const remaining = 13 * 60 - t
    return { name: "London-NY Transition", phase: "Low Volume", phaseColor: "#52525b", killzone: false, subPhase: remaining < 30 ? "NY open imminent" : "Consolidation -- avoid entries", elapsed: t - 10 * 60, remaining, totalMinutes: 180, kzProgress: (t - 10 * 60) / 180 }
  }
  if (t >= 16 * 60 && t < 21 * 60) {
    return { name: "Post-NY", phase: "Cooldown", phaseColor: "#52525b", killzone: false, subPhase: "Session over -- review and journal", elapsed: t - 16 * 60, remaining: 21 * 60 - t, totalMinutes: 300, kzProgress: (t - 16 * 60) / 300 }
  }
  return { name: "Off-Hours", phase: "No Session", phaseColor: "#3f3f46", killzone: false, subPhase: "Markets closed", elapsed: 0, remaining: 0, totalMinutes: 1, kzProgress: 0 }
}

// Build a synthetic session phase from demo overrides
function buildOverriddenSession(
  sessionOverride: string | null,
  progressOverride: number | null,
  realSession: ReturnType<typeof getSessionPhase>,
): ReturnType<typeof getSessionPhase> {
  if (!sessionOverride) {
    // Only progress override
    if (progressOverride != null) {
      return { ...realSession, kzProgress: progressOverride }
    }
    return realSession
  }

  const prog = progressOverride ?? 0.3
  const synthetics: Record<string, ReturnType<typeof getSessionPhase>> = {
    asia: { name: "Asia", phase: "Accumulation", phaseColor: "#8b5cf6", killzone: false, subPhase: "Range building", elapsed: Math.round(prog * 240), remaining: Math.round((1 - prog) * 240), totalMinutes: 240, kzProgress: prog },
    "pre-london": { name: "Pre-London", phase: "Preparation", phaseColor: "#71717a", killzone: false, subPhase: prog > 0.8 ? "London imminent -- prepare bias" : "Dead zone -- mark Asia range", elapsed: Math.round(prog * 180), remaining: Math.round((1 - prog) * 180), totalMinutes: 180, kzProgress: prog },
    london: { name: "London", phase: "Displacement Phase", phaseColor: "#10b981", killzone: true, subPhase: prog < 0.17 ? "Initial sweep phase" : prog < 0.5 ? "Displacement in progress" : "Trend continuation zone", elapsed: Math.round(prog * 180), remaining: Math.round((1 - prog) * 180), totalMinutes: 180, kzProgress: prog },
    "london-ny": { name: "London-NY Transition", phase: "Low Volume", phaseColor: "#52525b", killzone: false, subPhase: prog > 0.8 ? "NY open imminent" : "Consolidation -- avoid entries", elapsed: Math.round(prog * 180), remaining: Math.round((1 - prog) * 180), totalMinutes: 180, kzProgress: prog },
    newyork: { name: "New York", phase: "Prime Execution", phaseColor: "#3b82f6", killzone: true, subPhase: prog < 0.17 ? "Opening displacement" : prog < 0.5 ? "Prime execution zone" : "Momentum fade", elapsed: Math.round(prog * 180), remaining: Math.round((1 - prog) * 180), totalMinutes: 180, kzProgress: prog },
    "london-close": { name: "London Close", phase: "Reversal Window", phaseColor: "#f59e0b", killzone: true, subPhase: prog < 0.5 ? "Early reversal scan" : "Late reversal confirmation", elapsed: Math.round(prog * 60), remaining: Math.round((1 - prog) * 60), totalMinutes: 60, kzProgress: prog },
    "post-ny": { name: "Post-NY", phase: "Cooldown", phaseColor: "#52525b", killzone: false, subPhase: "Session over -- review and journal", elapsed: Math.round(prog * 300), remaining: Math.round((1 - prog) * 300), totalMinutes: 300, kzProgress: prog },
    off: { name: "Off-Hours", phase: "No Session", phaseColor: "#3f3f46", killzone: false, subPhase: "Markets closed", elapsed: 0, remaining: 0, totalMinutes: 1, kzProgress: 0 },
  }

  return synthetics[sessionOverride] || realSession
}

// All killzone phases with time boundaries -- used for the phase timeline
interface KZPhase {
  id: string
  label: string
  shortLabel: string
  startPct: number   // 0-1 within the killzone
  endPct: number
  focusNow: string
  focusWhy: string
  expectation: string
}

function getKillzonePhases(sessionName: string): KZPhase[] {
  if (sessionName === "London") return [
    { id: "ldn-1", label: "Opening Volatility", shortLabel: "OPEN", startPct: 0, endPct: 0.17,
      focusNow: "Institutional volume entering. Sharp moves are liquidity-driven, not directional. Wait for the noise to settle.",
      focusWhy: "The first 30 minutes have the highest false-signal rate of the session.",
      expectation: "Rapid price movement that feels urgent but resolves into a clearer direction." },
    { id: "ldn-2", label: "Direction Window", shortLabel: "DIRECTION", startPct: 0.17, endPct: 0.33,
      focusNow: "The session's true direction should be forming now. Strong, clean candles confirm intent. Choppy action means no setup.",
      focusWhy: "This is the highest-probability window for the session. Direction established here tends to persist.",
      expectation: "Either clean directional movement confirming bias, or choppy consolidation signaling a low-quality session." },
    { id: "ldn-3", label: "Optimal Entry Zone", shortLabel: "ENTRY", startPct: 0.33, endPct: 0.5,
      focusNow: "If direction confirmed, look for a pullback to key levels for entry. This is the best risk-reward window.",
      focusWhy: "Entries after direction confirmation but before full expansion give the tightest stops and largest targets.",
      expectation: "Price pulls back to a significant level before continuing. If no pullback, the move may be exhausting." },
    { id: "ldn-4", label: "Expansion", shortLabel: "EXPAND", startPct: 0.5, endPct: 0.72,
      focusNow: "The session's primary move is underway. If positioned, manage the trade. If not, the window is narrowing.",
      focusWhy: "This is where the session delivers its main range. Interfering with a working position is the most common error.",
      expectation: "Steady directional movement with shallow pullbacks. Volume supports the direction." },
    { id: "ldn-5", label: "Momentum Fade", shortLabel: "FADE", startPct: 0.72, endPct: 0.88,
      focusNow: "Volume is declining and momentum is weakening. Consider reducing exposure. New entries carry elevated reversal risk.",
      focusWhy: "Late-session entries have the lowest win rate. Institutional flow is completing for this session.",
      expectation: "Smaller candles, potential consolidation. The session's primary objective should be complete." },
    { id: "ldn-6", label: "Session Wind Down", shortLabel: "WIND DOWN", startPct: 0.88, endPct: 1.0,
      focusNow: "Session closing. Manage or close positions. Prepare for the transition period ahead.",
      focusWhy: "Holding unmanaged positions through session transitions exposes you to low-volume, unpredictable moves.",
      expectation: "Decreasing volume. Price may consolidate. The next session will bring fresh institutional flow." },
  ]
  if (sessionName === "New York") return [
    { id: "ny-1", label: "Opening Volatility", shortLabel: "OPEN", startPct: 0, endPct: 0.17,
      focusNow: "Fresh institutional volume entering. Watch whether the prior session's move continues or reverses.",
      focusWhy: "The first 30 minutes determine whether this is a continuation or reversal day.",
      expectation: "High volatility as new participants enter. Direction becomes clear after the opening noise settles." },
    { id: "ny-2", label: "Direction Confirmation", shortLabel: "CONFIRM", startPct: 0.17, endPct: 0.33,
      focusNow: "The session's direction should be confirmed. Enter only after confirmation, not during the opening noise.",
      focusWhy: "Entering after direction confirmation dramatically increases win rate compared to guessing the open.",
      expectation: "Clear directional bias established. The session is either trending or ranging -- act accordingly." },
    { id: "ny-3", label: "Prime Execution", shortLabel: "PRIME", startPct: 0.33, endPct: 0.56,
      focusNow: "Peak volume and institutional activity. This is the highest-probability window. Execute confirmed setups with conviction.",
      focusWhy: "Institutional flow is cleanest during this window. Setups have the highest statistical edge.",
      expectation: "Directional movement with clean pullbacks. The market is at its most readable." },
    { id: "ny-4", label: "Midday Lull", shortLabel: "LULL", startPct: 0.56, endPct: 0.72,
      focusNow: "Volume dropping as major participants step back. Tighten stops on existing positions. Avoid new entries.",
      focusWhy: "Low-volume periods create false signals. Setups here have the worst statistics of the session.",
      expectation: "Choppy, range-bound price action. False breakouts are common. Wait for the afternoon." },
    { id: "ny-5", label: "Afternoon Session", shortLabel: "PM", startPct: 0.72, endPct: 0.88,
      focusNow: "Volume returns. Watch for a final extension or a reversal setup. Be selective -- this is the last clean window.",
      focusWhy: "The afternoon push is the last opportunity for clean execution before end-of-day positioning begins.",
      expectation: "Either a final leg of the daily move or signs of reversal. Quality over quantity." },
    { id: "ny-6", label: "Session Wind Down", shortLabel: "WIND DOWN", startPct: 0.88, endPct: 1.0,
      focusNow: "Session closing. Close intraday positions. Journal trades. Calculate daily results.",
      focusWhy: "Holding past session close exposes you to overnight risk without the intraday edge.",
      expectation: "Decreasing volume, widening spreads. The trading day is over." },
  ]
  if (sessionName === "Asia") return [
    { id: "asia-1", label: "Range Building", shortLabel: "RANGE", startPct: 0, endPct: 0.25,
      focusNow: "Low-volume session starting. A range is forming. Mark emerging highs and lows -- these become key levels for higher-volume sessions.",
      focusWhy: "The range established here defines where the next major session finds its starting conditions.",
      expectation: "Slow, range-bound price action. Low volatility. Use this time for level-marking and preparation." },
    { id: "asia-2", label: "Consolidation", shortLabel: "CONSOL", startPct: 0.25, endPct: 0.625,
      focusNow: "Consolidation deepening. The range is becoming defined. False breakouts reveal where the most interest is clustered.",
      focusWhy: "Each false breakout adds more pending orders at that level, making it a higher-probability target for the next session.",
      expectation: "Continued range-bound action. Small moves that look like breakouts but reverse. This is informative, not tradeable." },
    { id: "asia-3", label: "Pre-London Prep", shortLabel: "PRE-LDN", startPct: 0.625, endPct: 1.0,
      focusNow: "Asia winding down. Finalize your analysis. The range is set. Build your plan for the high-volume session ahead.",
      focusWhy: "Preparation quality directly determines execution quality. Your bias and levels should be locked in before the next session.",
      expectation: "Range fully established. The next session's opening will reference these levels. Be ready, not reactive." },
  ]
  if (sessionName === "London Close") return [
    { id: "lc-1", label: "Reversal Window", shortLabel: "REVERSAL", startPct: 0, endPct: 0.5,
      focusNow: "Institutional position-closing creates counter-moves. Watch for reversal signals against the day's primary direction.",
      focusWhy: "This is driven by profit-taking, not new institutional intent. Temporary, not trend-changing.",
      expectation: "Potential counter-move forming. If nothing materializes soon, the day's trend is strong enough to persist." },
    { id: "lc-2", label: "Window Closing", shortLabel: "CLOSING", startPct: 0.5, endPct: 1.0,
      focusNow: "The reversal window is narrowing. Either the setup has confirmed or it is not coming today.",
      focusWhy: "Forcing a trade in a closing window has the lowest probability of any session period.",
      expectation: "Accept the outcome. Either you are in a confirmed reversal or the day is a pure trend day." },
  ]
  return [
    { id: "off-1", label: "Off Hours", shortLabel: "OFF", startPct: 0, endPct: 1.0,
      focusNow: "No active session. Use this time for review, journaling, and preparation.",
      focusWhy: "No institutional flow means no edge.",
      expectation: "No significant activity expected." },
  ]
}

function getSessionBias(sessionOHLC: any) {
  const sessions = ["asia", "london", "newyork"] as const
  let bullish = 0, bearish = 0
  for (const s of sessions) {
    const d = sessionOHLC[s]
    if (d?.open && d?.close) { if (d.close > d.open) bullish++; else if (d.close < d.open) bearish++ }
  }
  if (bullish > bearish) return { label: "Bullish", color: "#10b981", icon: TrendingUp }
  if (bearish > bullish) return { label: "Bearish", color: "#ef4444", icon: TrendingDown }
  return { label: "Neutral", color: "#71717a", icon: Minus }
}

interface DayIntel {
  day: string
  shortDay: string
  insight: string
  quality: "high" | "medium" | "low"
  qualityLabel: string
  recommendation: string
  optimalSessions: string[]
  riskProfile: string
  manipulationPattern: string
  historicalEdge: string
  keyBehavior: string
  positionSizing: string
  weekPosition: string
  color: string
}

function getDayContext(dayOverride?: number | null): DayIntel {
  const dow = dayOverride != null ? dayOverride : new Date().getUTCDay()
  const days: Record<number, DayIntel> = {
    0: {
      day: "Sunday", shortDay: "SUN", insight: "Markets closed. Prepare weekly analysis.",
      quality: "low", qualityLabel: "NO TRADE", recommendation: "Use this time for weekly bias construction. Review last week's data, mark HTF levels, identify weekly order blocks. The traders who prepare on Sunday win on Tuesday.",
      optimalSessions: [], riskProfile: "Markets closed -- no risk exposure possible.",
      manipulationPattern: "Sunday open gap can create a liquidity void that Monday fills. Mark the Friday close level.",
      historicalEdge: "Preparation quality on Sunday correlates directly with Tuesday/Wednesday execution quality.",
      keyBehavior: "Build your weekly narrative. Identify the story the market is telling on HTF. Don't force a bias -- let the structure speak.",
      positionSizing: "No positions. If you have swing trades, review stop placement.", weekPosition: "Week start -- narrative construction phase", color: "#52525b"
    },
    1: {
      day: "Monday", shortDay: "MON", insight: "Manipulation day. False moves set the weekly range.",
      quality: "medium", qualityLabel: "CAUTION", recommendation: "Monday exists to deceive. Smart money uses Monday to establish one side of the weekly range by trapping early-week entries. Watch for false displacement that reverses Tuesday. Reduce size or sit out entirely.",
      optimalSessions: ["London"], riskProfile: "Elevated false breakout risk. Monday moves frequently reverse by Tuesday. The weekly high or low is often a Monday trap.",
      manipulationPattern: "Monday's primary move is often a liquidity hunt designed to set the weekly range extreme. The move LOOKS real -- strong displacement, clean break of structure. But it's bait. Smart money is building the opposite position.",
      historicalEdge: "Monday setups have 15-20% lower win rates than Tuesday/Wednesday. The traders who profit on Monday are typically fading Monday's move on Tuesday.",
      keyBehavior: "Observe and mark levels. If you must trade, use half size. The real edge is identifying which side Monday is trapping so you can trade the opposite on Tuesday.",
      positionSizing: "50% max size. Prefer no entries. If you enter, tighten stops significantly.", weekPosition: "Early week -- range establishment phase", color: "#f59e0b"
    },
    2: {
      day: "Tuesday", shortDay: "TUE", insight: "Highest probability for clean displacement and trend initiation.",
      quality: "high", qualityLabel: "PRIME DAY", recommendation: "This is your day. Tuesday is statistically the highest-probability day for clean institutional displacement. Monday's trap has been set -- Tuesday reveals the real direction. Full size, full conviction on confirmed setups.",
      optimalSessions: ["London", "New York"], riskProfile: "Lowest false signal rate of the week. Displacement is typically clean and directional. This is when smart money commits to the weekly direction.",
      manipulationPattern: "Tuesday's displacement often runs Monday's high or low first (completing the trap), then displaces violently in the real direction. The initial sweep of Monday's extreme IS the entry signal.",
      historicalEdge: "Tuesday London killzone produces the highest win rate and cleanest R:R of any day-session combination. Historical data shows 60-70% of the weekly move initiates on Tuesday.",
      keyBehavior: "Execute with conviction. This is not the day to hesitate. If your setup aligns with Monday's trap reversal, this is an A+ opportunity. Trust the displacement.",
      positionSizing: "Full position size on confirmed setups. This is the day your edge is sharpest.", weekPosition: "Mid-early week -- trend initiation phase", color: "#10b981"
    },
    3: {
      day: "Wednesday", shortDay: "WED", insight: "Midweek reversal zone. Weekly high or low often forms here.",
      quality: "high", qualityLabel: "KEY DAY", recommendation: "Wednesday is the inflection point. If Tuesday initiated the weekly trend, Wednesday either continues it OR forms the weekly high/low. Watch for exhaustion signals. If Tuesday's move is extending, ride it. If it's stalling, the reversal is forming.",
      optimalSessions: ["London", "New York"], riskProfile: "Dual-natured day. Can produce strong continuation OR sharp reversal. The key is reading whether Tuesday's move has conviction or exhaustion.",
      manipulationPattern: "Wednesday's manipulation is subtler than Monday's. It often creates a false continuation of Tuesday's move before reversing, or a false reversal that shakes out weak positions before continuing. Read the context from Tuesday.",
      historicalEdge: "Wednesday typically forms one extreme of the weekly range. If Tuesday went bullish, Wednesday often forms the weekly high. If Tuesday went bearish, Wednesday often forms the weekly low. This creates the weekly reversal point.",
      keyBehavior: "Context is everything today. What did Tuesday do? If Tuesday displaced strongly, look for continuation early then reversal signs. If Tuesday was indecisive, Wednesday may provide the real displacement instead.",
      positionSizing: "Full size on continuation of Tuesday. If fading Tuesday's move, use 75% size with wider stops.", weekPosition: "Midweek -- inflection and reversal phase", color: "#3b82f6"
    },
    4: {
      day: "Thursday", shortDay: "THU", insight: "Continuation or exhaustion. Validate against weekly objectives.",
      quality: "medium", qualityLabel: "SELECTIVE", recommendation: "Thursday reveals whether the weekly move is done or has more room. If you hit your weekly target already, consider sitting out. If the weekly move is still developing, Thursday can offer a final continuation push. Be selective -- only A+ setups.",
      optimalSessions: ["London"], riskProfile: "Increasing exhaustion risk. Institutional players begin reducing exposure ahead of Friday. Late-week reversals are common.",
      manipulationPattern: "Thursday manipulation targets traders who entered late to the weekly trend. It creates a final push that looks like continuation but is actually smart money distributing/accumulating for the reversal.",
      historicalEdge: "Thursday's win rate drops significantly compared to Tuesday/Wednesday. However, when Thursday does work, it often produces the final leg of the weekly move -- the climactic extension.",
      keyBehavior: "Audit your week. Have you hit your R target? If yes, stop trading. The marginal trade on Thursday is rarely worth the risk. If you're behind, don't force it -- Thursday desperation trades are account killers.",
      positionSizing: "50-75% size maximum. If weekly R target is met, no new entries.", weekPosition: "Late week -- exhaustion and distribution phase", color: "#f59e0b"
    },
    5: {
      day: "Friday", shortDay: "FRI", insight: "Profit-taking and position squaring. Reduced conviction.",
      quality: "low", qualityLabel: "AVOID", recommendation: "Friday is for closing, not opening. Institutional traders square positions before the weekend. Price action becomes erratic, spreads widen, and false moves increase. Close open trades, take profits, and prepare your weekly review.",
      optimalSessions: [], riskProfile: "Highest noise-to-signal ratio of the week. Position squaring creates unpredictable moves that look like setups but are liquidation flows.",
      manipulationPattern: "Friday's 'manipulation' isn't intentional -- it's the byproduct of mass position closing. The resulting price action looks like displacement but has no institutional intent behind it. It's noise disguised as signal.",
      historicalEdge: "Friday has the lowest win rate and worst R:R of any trading day. The traders who consistently profit on Fridays are typically closing positions they entered Tuesday/Wednesday, not opening new ones.",
      keyBehavior: "Close positions. Write your weekly review. Calculate your weekly P&L. Identify what worked, what didn't, and what you'll do differently next week. This is where the real edge is built.",
      positionSizing: "No new entries. Close existing positions before London close.", weekPosition: "Week end -- review and close phase", color: "#ef4444"
    },
    6: {
      day: "Saturday", shortDay: "SAT", insight: "Markets closed. Review week performance.",
      quality: "low", qualityLabel: "NO TRADE", recommendation: "Deep review day. Go through every trade this week. What was your entry quality? Did you follow your rules? Where did emotion override logic? Write it all down. The weekend review is where losing traders become winning traders.",
      optimalSessions: [], riskProfile: "Markets closed -- no risk exposure possible.",
      manipulationPattern: "No market manipulation. But self-manipulation is at its peak -- you'll replay losses, fantasize about missed trades, and build narratives that justify next week's mistakes. Be aware of this.",
      historicalEdge: "Traders who do structured weekend reviews improve win rates by 10-15% over 3 months compared to those who don't.",
      keyBehavior: "Structured review: (1) List all trades, (2) Grade each on process not outcome, (3) Identify the #1 behavioral pattern to fix, (4) Set one specific goal for next week.",
      positionSizing: "No positions. If swing trades are open, review stop placement for gap risk.", weekPosition: "Weekend -- structured review phase", color: "#52525b"
    },
  }
  return days[dow] || days[0]
}

// ═══════════════════════════════════════════════════════════════════
// ORDER LAYER SAMPLE INPUTS
// ═════════════════════════════════�����═════════════════════════════════
function buildOrderLayerInputs(sessionPhase: ReturnType<typeof getSessionPhase>): { strategy: StrategyInput; psychology: PsychologyInput; activity: ActivityInput } {
  const dow = new Date().getUTCDay()
  return {
    strategy: {
      overallDiscipline: 64, riskGrade: "B", entryQuality: 58, structureDepth: 42,
      limitRatio: 0.625, exposureConcentration: 50, correlationRisk: false,
      dominantCurrency: "EUR", dominantPct: 35,
      weeklyAdherence: [72, 68, 71, 65, 60, 58, 64],
      intentVsAction: { intended: 85, actual: 64 },
      rules: [
        { rule: "Wait for HTF confirmation", adherence: 78, violations: 2, streak: 3 },
        { rule: "Max 2 trades per session", adherence: 85, violations: 1, streak: 5 },
        { rule: "No trading after 2 losses", adherence: 61, violations: 6, streak: 0 },
        { rule: "Only trade during killzones", adherence: 72, violations: 3, streak: 2 },
        { rule: "Use limit orders for entries", adherence: 70, violations: 3, streak: 1 },
        { rule: "Set SL before entry", adherence: 92, violations: 0, streak: 14 },
      ],
      executionIdentity: "HYBRID",
    },
    psychology: {
      stabilityIndex: 61, stabilityLevel: "elevated", drawdownResponse: "aggressive",
      decisionLatency: "fast", revengeRisk: "watch", cutWinnersRisk: "warning",
      sizeEscalation: "clear", overtradingRisk: "watch", emotionVolatility: 55,
      disciplineScore: 62, dominantHemisphere: "right", dominantEmotion: "Frustration",
      activeAlerts: [{ message: "Cut winners pattern detected", severity: "warning", pattern: "cutWinners" }],
      cortexVerdictLevel: "elevated",
    },
    activity: {
      sessionName: sessionPhase.name, killzone: sessionPhase.killzone,
      kzProgress: sessionPhase.kzProgress, remaining: sessionPhase.remaining,
      subPhase: sessionPhase.subPhase,
      dayQuality: dow >= 2 && dow <= 3 ? "high" : dow === 5 ? "low" : "medium",
    },
  }
}

// ═══════════════════════════════════════════════════════════════════
// PROMPT CATEGORIES -- strategy/psychology connected questions
// ═══════════════════════════════════════════════════════════════════
interface StructuredPrompt {
  id: string; label: string; prompt: string; description: string
  icon: typeof Brain; priority: "critical" | "high" | "medium" | "standard"
  contextual: boolean; connection?: "strategy" | "psychology" | "both"
}
interface PromptCategory {
  id: string; label: string; icon: typeof Brain; color: string
  description: string; prompts: StructuredPrompt[]; connection: "strategy" | "psychology" | "both" | "session"
}

function generatePromptCategories(
  symbol: string, timeframe: string,
  sessionPhase: ReturnType<typeof getSessionPhase>,
  selectedConfluences: string[], sessionOHLC: any,
  sessionBias: ReturnType<typeof getSessionBias>,
  dayContext: ReturnType<typeof getDayContext>,
  orderState: OrderLayerState,
): PromptCategory[] {
  const confNames = selectedConfluences.map((id) => confluenceById.get(id as any)?.name).filter(Boolean)
  const categories: PromptCategory[] = []
  const directiveConfig = DIRECTIVE_CONFIG[orderState.directive]

  // ── 1. SYSTEM INTELLIGENCE -- Order Layer ──
  const orderPrompts: StructuredPrompt[] = []
  orderPrompts.push({
    id: "ol-verdict", label: `${directiveConfig.label} -- Readiness ${orderState.readinessScore}/100`,
    prompt: `My trading system readiness is ${orderState.readinessScore}/100 (${orderState.readinessLabel}). Directive: ${directiveConfig.label}. ${orderState.dominantRisk} ${orderState.primaryCorrection} Given this system state during ${sessionPhase.name}, what is the single most important thing I should do right now?`,
    description: orderState.dominantRisk.length > 60 ? orderState.dominantRisk.substring(0, 60) + "..." : orderState.dominantRisk,
    icon: Shield, priority: orderState.systemState === "critical" ? "critical" : "high", contextual: false, connection: "both",
  })
  for (const mission of orderState.missions.filter(m => !m.completed).slice(0, 2)) {
    orderPrompts.push({
      id: `ol-${mission.id}`, label: mission.label,
      prompt: `Help me with: "${mission.label}". ${mission.description}${mission.rImpact ? ` Costing ${mission.rImpact}.` : ""} During ${sessionPhase.name} on ${symbol}. Give exact steps.`,
      description: mission.rImpact || mission.description.split(".")[0],
      icon: mission.category === "stabilize" ? Shield : mission.category === "protect" ? Lock : TrendingUp,
      priority: mission.category === "stabilize" ? "critical" : "high", contextual: false,
      connection: mission.category === "stabilize" || mission.category === "protect" ? "psychology" : "strategy",
    })
  }
  for (const gate of orderState.gates.slice(0, 2)) {
    orderPrompts.push({
      id: `ol-${gate.id}`, label: gate.label,
      prompt: `${gate.severity === "hard" ? "HARD" : "Soft"} gate: "${gate.label}". ${gate.reason}. Action: ${gate.resolveAction}. Walk me through resolving this.`,
      description: gate.reason.length > 55 ? gate.reason.substring(0, 55) + "..." : gate.reason,
      icon: gate.severity === "hard" ? AlertTriangle : Eye,
      priority: gate.severity === "hard" ? "critical" : "high", contextual: false,
      connection: gate.targetTab === "psychology" ? "psychology" : "strategy",
    })
  }
  categories.push({
    id: "system-intelligence", label: "SYSTEM INTELLIGENCE", icon: Layers,
    color: orderState.systemState === "critical" ? "#ef4444" : orderState.systemState === "reactive" ? "#f97316" : orderState.systemState === "elevated" ? "#f59e0b" : "#10b981",
    description: `${directiveConfig.label} -- ${orderState.activeMissionCount} missions`, prompts: orderPrompts, connection: "both",
  })

  // ── 2. PRE-DECISION -- Strategy connected ──
  const preDecision: StructuredPrompt[] = [
    { id: "pd-conf", label: "What confluences support this setup?", prompt: `On ${symbol} ${timeframe} during ${sessionPhase.name} (${sessionPhase.subPhase}): What confluences should I look for? ${confNames.length > 0 ? `Active: ${confNames.join(", ")}. Aligning or conflicting?` : "None selected. What first?"}`, description: confNames.length > 0 ? `${confNames.length} active -- check alignment` : "Identify key confluences", icon: Layers, priority: confNames.length > 0 ? "high" : "critical", contextual: false, connection: "strategy" },
    { id: "pd-htf", label: "Check bias against higher timeframe", prompt: `${symbol} on ${timeframe}. Session bias: ${sessionBias.label}. Validate against HTF structure. Am I aligned with the weekly/daily narrative?`, description: `Bias: ${sessionBias.label}`, icon: TrendingUp, priority: "high", contextual: false, connection: "strategy" },
    { id: "pd-rr", label: "Validate R:R for current structure", prompt: `${symbol} ${timeframe} during ${sessionPhase.name}: What minimum R:R given ${sessionPhase.phase} conditions? Where should invalidation sit?`, description: "Risk-to-reward validation", icon: Target, priority: "high", contextual: false, connection: "strategy" },
  ]
  if (sessionPhase.killzone) {
    preDecision.push({ id: "pd-kz", label: "Right time in this killzone?", prompt: `${sessionPhase.name} KZ ${Math.round(sessionPhase.kzProgress * 100)}% through (${sessionPhase.elapsed}min elapsed, ${sessionPhase.remaining}min left). Sub-phase: "${sessionPhase.subPhase}". Execute now or wait for confirmation?`, description: `${sessionPhase.remaining}min remaining in KZ`, icon: Clock, priority: "critical", contextual: true, connection: "strategy" })
  }
  categories.push({ id: "pre-decision", label: "PRE-DECISION", icon: Crosshair, color: "#10b981", description: "Validate before execution", prompts: preDecision, connection: "strategy" })

  // ── 3. RISK AUDIT -- Strategy connected ──
  const riskAudit: StructuredPrompt[] = [
    { id: "ra-exp", label: "Am I overexposed on this pair?", prompt: `Am I overexposed on ${symbol}? Correlated positions? Max exposure for ${sessionPhase.name}?`, description: "Correlation and exposure check", icon: Shield, priority: "high", contextual: false, connection: "strategy" },
    { id: "ra-size", label: "Position size for 0.5% risk", prompt: `Position size for ${symbol} with 0.5% risk. ${sessionOHLC.asia?.rangePips ? `Asia range: ${sessionOHLC.asia.rangePips.toFixed(1)} pips.` : ""} What stop distance for current volatility?`, description: "Size calculation with context", icon: Gauge, priority: "medium", contextual: false, connection: "strategy" },
    { id: "ra-inv", label: "Where does my thesis break?", prompt: `${symbol} ${timeframe}: Where does my ${sessionBias.label} thesis become invalid? Not where I want my stop -- where does structure say I'm wrong?`, description: "Structural invalidation level", icon: AlertTriangle, priority: "high", contextual: false, connection: "strategy" },
  ]
  categories.push({ id: "risk-audit", label: "RISK AUDIT", icon: Shield, color: "#f59e0b", description: "Protect your capital", prompts: riskAudit, connection: "strategy" })

  // ── 4. SESSION CONTEXT -- Session connected ──
  const sessionContext: StructuredPrompt[] = []
  const asiaData = sessionOHLC?.asia
  const londonData = sessionOHLC?.london
  if (asiaData?.open && asiaData?.close && sessionPhase.name !== "Asia") {
    const asiaDir = asiaData.close > asiaData.open ? "bullish" : "bearish"
    sessionContext.push({ id: "sc-asia", label: "What happened in Asia?", prompt: `Asia on ${symbol} closed ${asiaDir} (${asiaData.rangePips?.toFixed(1) || "?"} pips). O:${asiaData.open?.toFixed(5)} H:${asiaData.high?.toFixed(5)} L:${asiaData.low?.toFixed(5)} C:${asiaData.close?.toFixed(5)}. How does this Asia range inform ${sessionPhase.name} bias? High/low swept?`, description: `${asiaDir} -- ${asiaData.rangePips?.toFixed(1) || "?"} pips`, icon: BarChart3, priority: "high", contextual: true, connection: "strategy" })
  }
  if (londonData?.open && londonData?.close && sessionPhase.name === "New York") {
    const londonDir = londonData.close > londonData.open ? "bullish" : "bearish"
    sessionContext.push({ id: "sc-ldn", label: "London displacement direction?", prompt: `London displaced ${londonDir} (${londonData.rangePips?.toFixed(1) || "?"} pips) on ${symbol}. O:${londonData.open?.toFixed(5)} C:${londonData.close?.toFixed(5)}. Did London establish direction? Should NY continue or reverse?`, description: `London ${londonDir}`, icon: Activity, priority: "critical", contextual: true, connection: "strategy" })
  }
  sessionContext.push({ id: "sc-next", label: "What should I prepare for next?", prompt: `In ${sessionPhase.name} (${sessionPhase.subPhase}) on ${symbol}. ${sessionPhase.remaining > 0 ? `${sessionPhase.remaining}min remaining.` : ""} What to prepare for next session transition?`, description: `${sessionPhase.remaining}min to transition`, icon: ArrowRight, priority: "medium", contextual: false, connection: "strategy" })
  sessionContext.push({ id: "sc-day", label: `${dayContext.day} -- what to expect?`, prompt: `${dayContext.day}. "${dayContext.insight}" How does this apply to ${symbol} during ${sessionPhase.name}? Adjust aggression?`, description: dayContext.insight.substring(0, 50), icon: BookOpen, priority: dayContext.quality === "high" ? "high" : "medium", contextual: false, connection: "both" })
  categories.push({ id: "session-context", label: "SESSION CONTEXT", icon: Clock, color: "#3b82f6", description: "Market structure in time", prompts: sessionContext, connection: "session" })

  // ── 5. PSYCHOLOGICAL EDGE -- Psychology connected ──
  const psychEdge: StructuredPrompt[] = [
    { id: "pe-bias", label: "Challenge my current thinking", prompt: `Challenge my ${sessionBias.label} bias on ${symbol}. In ${sessionPhase.name} (${sessionPhase.subPhase}). What cognitive biases am I vulnerable to? Am I seeing what I want?`, description: "Cognitive bias detection", icon: Brain, priority: "medium", contextual: false, connection: "psychology" },
    { id: "pe-revenge", label: "Am I revenge trading?", prompt: `Am I taking this ${symbol} setup because structure demands it, or to recover? What are the signs of revenge trading I should check?`, description: "Emotional state audit", icon: Eye, priority: "high", contextual: false, connection: "psychology" },
    { id: "pe-patience", label: "Should I sit this one out?", prompt: `Given ${symbol} during ${sessionPhase.name} (${sessionPhase.phase}): Is the highest-probability action to trade or wait? ${dayContext.quality === "low" ? `It's ${dayContext.day} with lower quality setups.` : ""} Give me permission to be patient if right.`, description: "Patience vs opportunity cost", icon: Radar, priority: "medium", contextual: false, connection: "psychology" },
  ]
  if (!sessionPhase.killzone) {
    psychEdge.push({ id: "pe-off", label: "Why am I looking at charts right now?", prompt: `Looking at ${symbol} outside killzone (${sessionPhase.name} -- ${sessionPhase.subPhase}). Am I productive or screen-addicted? What would a disciplined trader do?`, description: "Discipline check -- no killzone", icon: AlertTriangle, priority: "critical", contextual: true, connection: "psychology" })
  }
  categories.push({ id: "psych-edge", label: "PSYCHOLOGICAL EDGE", icon: Brain, color: "#8b5cf6", description: "Master yourself before the market", prompts: psychEdge, connection: "psychology" })

  return categories
}

// ═══════════════════════════════════════════════════════════════════
// ACTIVITY COMMAND CENTER
//
// Three breathing panels. No numbers. No scores. Pure intelligence.
//
// Panel 1: SESSION FIELD -- Deep awareness of exactly where you are
//          in time, what the market is doing NOW, and what to expect
//          in the next 10/30/60 minutes. Phase-specific guidance.
//
// Panel 2: THREAT FIELD -- The #1 thing that will destroy you right
//          now, expanded with WHY it matters, HOW it manifests in
//          your behavior, and WHAT it costs in R.
//
// Panel 3: ACTION FIELD -- The exact next move. Not vague advice.
//          Specific, phase-aware, context-aware instruction.
//
// The ring + title row remains as the system identity.
// ═══════════════════════════════════════════════════════════════════
function ActivityCommandCenter({ state, session, bias, symbol, timeframe, dayContext, onNavigate, demoOverrides, onOverridesChange }: {
  state: OrderLayerState
  session: ReturnType<typeof getSessionPhase>
  bias: ReturnType<typeof getSessionBias>
  symbol: string; timeframe: string
  dayContext: ReturnType<typeof getDayContext>
  onNavigate: (tab: string) => void
  demoOverrides: DemoOverrides
  onOverridesChange: (o: DemoOverrides) => void
}) {
  const dc = DIRECTIVE_CONFIG[state.directive]
  const sc = STATE_CONFIG[state.systemState]
  const isBad = state.systemState === "critical" || state.systemState === "reactive"
  const BiasIcon = bias.icon

  const [threatOpen, setThreatOpen] = useState(false)
  const [actionOpen, setActionOpen] = useState(false)
  const [dayExpanded, setDayExpanded] = useState(true)

  // ═══ AUTO-PLAY: 24-hour simulation cycling through sessions/days ═══
  const [autoPlay, setAutoPlay] = useState(false)
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const autoPlayStepRef = useRef(0)

  // Session carousel: find current session index
  const currentSessionIdx = useMemo(() => {
    if (demoOverrides.sessionOverride) {
      return SESSION_OPTIONS.findIndex(s => s.value === demoOverrides.sessionOverride)
    }
    // Match real session by name comparison
    const normalized = session.name.toLowerCase().replace(/[\s-]+/g, "")
    const idx = SESSION_OPTIONS.findIndex(s => {
      const sNorm = s.label.toLowerCase().replace(/[\s-]+/g, "")
      return normalized.includes(sNorm.slice(0, 4)) || sNorm.includes(normalized.slice(0, 4))
    })
    return idx >= 0 ? idx : 0
  }, [demoOverrides.sessionOverride, session.name])

  // Session navigation
  const goToSession = useCallback((idx: number) => {
    const clamped = ((idx % SESSION_OPTIONS.length) + SESSION_OPTIONS.length) % SESSION_OPTIONS.length
    const sess = SESSION_OPTIONS[clamped]
    onOverridesChange({
      ...demoOverrides,
      sessionOverride: sess.value,
      progressOverride: sess.killzone ? 0.35 : null, // Start at optimal entry if killzone
    })
  }, [demoOverrides, onOverridesChange])

  const goToDay = useCallback((dayVal: number) => {
    onOverridesChange({
      ...demoOverrides,
      dayOverride: dayVal,
    })
  }, [demoOverrides, onOverridesChange])

  // Auto-play: cycle through session + progress + day every 3 seconds
  // Define the 24-hour sequence outside the effect to avoid recreating each render
  const sessionsWithProgress = useMemo(() => SESSION_OPTIONS.flatMap(sess => {
    if (sess.killzone) {
      return [
        { session: sess.value, progress: 0.05 },
        { session: sess.value, progress: 0.35 },
        { session: sess.value, progress: 0.75 },
      ]
    }
    return [{ session: sess.value, progress: null as number | null }]
  }), [])

  const weekdays = useMemo(() => [1, 2, 3, 4, 5], []) // MON-FRI

  useEffect(() => {
    if (!autoPlay) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
      return
    }

    const totalSteps = sessionsWithProgress.length * weekdays.length

    autoPlayRef.current = setInterval(() => {
      const step = autoPlayStepRef.current % totalSteps
      const dayIdx = Math.floor(step / sessionsWithProgress.length)
      const sessIdx = step % sessionsWithProgress.length
      const entry = sessionsWithProgress[sessIdx]

      onOverridesChange({
        dayOverride: weekdays[dayIdx],
        sessionOverride: entry.session,
        progressOverride: entry.progress,
        systemStateOverride: null,
      })

      autoPlayStepRef.current++
    }, 3000)

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [autoPlay, onOverridesChange, sessionsWithProgress, weekdays])

  const utcNow = new Date()
  const utcH = utcNow.getUTCHours()
  const utcM = utcNow.getUTCMinutes()
  const utcStr = `${String(utcH).padStart(2, "0")}:${String(utcM).padStart(2, "0")}`

  // Deep session intelligence -- context-aware guidance
  const sessionIntel = useMemo(() => {
    const phase = session.subPhase
    const kz = session.killzone
    const rem = session.remaining
    const prog = session.kzProgress
    const name = session.name

    // What to focus on RIGHT NOW based on exact phase
    let focusNow = ""
    let focusWhy = ""
    let expectation = ""
    let behaviorWarning = ""

    if (name === "London" && kz) {
      if (prog < 0.17) {
        focusNow = "London opening -- institutional volume is entering the market. The first 30 minutes create sharp moves designed to trigger early entries. Do NOT chase. Let the opening volatility reveal direction before acting."
        focusWhy = "The opening period has the highest false-signal rate of the entire session. Every sharp move feels urgent, but most are liquidity-driven, not directional. Patience here is your biggest edge."
        expectation = "Rapid price movement into obvious levels, followed by a directional commitment. The real move comes after the initial noise."
        behaviorWarning = "The strongest urge right now is to jump in early. Every fiber will say 'it's moving, I'll miss it.' That's the trap."
      } else if (prog < 0.5) {
        focusNow = "The session's direction should be forming. Look for strong, decisive candles -- bodies larger than wicks signal institutional commitment. If price is choppy and indecisive, there may be no clean setup today."
        focusWhy = "This is the highest-probability window of the London session. Direction established here tends to hold. Missing this window means the best risk-reward is behind you."
        expectation = "Either clean directional movement confirming the session's intent, or choppy consolidation signaling a low-quality day. Decide now: participate or stand down."
        behaviorWarning = "If you haven't entered yet and price is moving, you'll feel urgency. Check: is this clean direction or just volatility?"
      } else {
        focusNow = "The session's primary move is maturing. If you are positioned, manage the trade -- trail stops, protect profits. If you are not in, the highest-probability window has passed. Do not chase."
        focusWhy = "Late-session entries carry elevated reversal risk. Volume is declining and institutional flow is completing. The edge is shrinking with each passing minute."
        expectation = "Momentum fading toward the transition period. Volume drops. If positioned, manage. If not, prepare for the next session -- the opportunity here is closing."
        behaviorWarning = "Late entries feel 'safe' because the direction seems clear. But you're entering at worst risk-reward. Don't confuse clarity with opportunity."
      }
    } else if (name === "New York" && kz) {
      if (prog < 0.17) {
        focusNow = "New York opening -- fresh institutional volume is entering. Watch whether the prior session's direction continues or reverses. The first 30 minutes determine the day's character."
        focusWhy = "NY either confirms or reverses the earlier session's move. This is the highest-volume session globally and sets the daily close direction."
        expectation = "Initial volatility as new participants enter. Direction becomes clear after the opening noise settles. Wait for confirmation before committing."
        behaviorWarning = "NY open is emotional. The speed of moves triggers FOMO. You need directional confirmation, not just movement."
      } else if (prog < 0.5) {
        focusNow = "Peak institutional activity zone. This is the highest-volume, highest-probability window. If your setup aligns with the confirmed direction, execute with full conviction."
        focusWhy = "Institutional flow is at its cleanest. Setups forming here have the highest statistical edge of any period. Hesitation costs more than a small loss."
        expectation = "Clean directional movement with shallow pullbacks offering re-entry opportunities. The market is at its most readable right now."
        behaviorWarning = "If you have a valid setup, execute it. Hesitation here costs you. But verify against your rules first."
      } else {
        focusNow = "Volume is declining and the session is entering its final phase. If in profit, consider reducing exposure. New entries carry elevated risk as the session winds down."
        focusWhy = "Late-session price action is driven by profit-taking and position-squaring, not fresh institutional intent. The clean flow of prime execution is ending."
        expectation = "Thinning price action, potential for choppy reversals. The session is winding down. No new entries unless an exceptional setup appears."
        behaviorWarning = "The temptation is to 'get one more trade in.' This is where revenge trading and overtrading live."
      }
    } else if (name === "London Close") {
      focusNow = "London Close -- institutional traders are closing positions, creating counter-moves against the day's primary direction. These moves are profit-taking, not new trends."
      focusWhy = "The reversal window is temporary and driven by position-closing, not fresh institutional intent. Mistaking this for a new trend is the most common error during this period."
      expectation = rem > 30 ? "Counter-move forming or about to form. If nothing materializes in the next 30 minutes, this is a strong trend day." : "Window closing. The setup has either confirmed or it is not coming today."
      behaviorWarning = "The reversal looks convincing. It's designed to. The danger is holding overnight thinking it's a new trend."
    } else if (name === "Asia") {
      focusNow = "Asia session -- low volume, range-building. Mark the emerging highs and lows carefully. These levels become the key reference points for the next high-volume session."
      focusWhy = "The range established during this session defines the starting conditions for London. Precise level-marking now gives you a significant edge later."
      expectation = "Consolidation within a tightening range. Small moves that look like breakouts are false -- use them to identify where interest is clustered."
      behaviorWarning = "The temptation in Asia is boredom-trading. Small moves look like setups. They're not. Wait for your session."
    } else if (name === "Pre-London") {
      focusNow = rem < 30
        ? "London imminent. Finalize your analysis. Mark the key levels from the prior session. Build your plan for the opening volatility. Know your bias before the session opens."
        : "Transition period. Use this time to prepare your session plan. Mark key levels on the chart. Review your trading rules."
      focusWhy = "Preparation quality directly determines execution quality. Traders who have a plan before the session opens execute cleanly. Those who don't, react emotionally."
      expectation = rem < 30 ? "London about to open. Expect initial volatility targeting the prior session's range extremes." : "Quiet price action. Use this time for preparation, not trading."
      behaviorWarning = "Pre-entering before the session opens is one of the most common edge-destroying habits. Wait for the open."
    } else if (name === "London-NY Transition") {
      focusNow = "Low volume transition between sessions. Avoid new entries. If you have positions from the prior session, decide now: hold into the next session or take profit."
      focusWhy = "This gap between sessions has the lowest institutional participation of the day. Setups here are unreliable and false breakouts are common."
      expectation = "Low volume, possible false breakouts. The next session will bring fresh volume and potential directional commitment -- prepare, don't trade."
      behaviorWarning = "Boredom trades and pre-session entries destroy accounts. This is a no-trade zone."
    } else {
      focusNow = "No active session. Markets are either closed or in an off-session period. Use this time for review, journaling, and preparation for the next trading day."
      focusWhy = "No institutional flow means no edge. Any price movement during this period is noise without meaningful participation behind it."
      expectation = "No significant price action expected. Any movement is random noise. Close your charts and focus on preparation."
      behaviorWarning = "If you're watching charts right now, you're feeding an addiction, not building an edge. Close the charts."
    }

    return { focusNow, focusWhy, expectation, behaviorWarning }
  }, [session])

  // Deep threat intelligence
  const threatIntel = useMemo(() => {
    const risk = state.dominantRisk
    let manifestation = ""
    let rCost = ""
    let pattern = ""

    // Map system state to behavioral patterns
    if (state.systemState === "critical") {
      manifestation = "Your decision-making is compromised. You will rationalize bad trades as 'calculated risks.' You will move stops. You will size up."
      rCost = "At this threat level, the average loss is 2-3R due to stop manipulation and oversizing."
      pattern = "The pattern: feel frustrated, see a setup, enter without full confirmation, move stop when it goes against you, take a larger loss than planned."
    } else if (state.systemState === "reactive") {
      manifestation = "You're making decisions faster than you should. Speed feels like decisiveness but it's actually anxiety. You're skipping checklist items."
      rCost = "Reactive trades average 0.5R less profit and 0.3R more loss than planned trades."
      pattern = "The pattern: see price move, feel urgency, enter before your process completes, feel relief at entry, then anxiety as it doesn't immediately work."
    } else if (state.systemState === "guarded") {
      manifestation = "You're functional but not optimal. Small errors are creeping in -- not catastrophic, but they erode edge over time."
      rCost = "Guarded state costs approximately 0.2R per trade through suboptimal entries and early exits."
      pattern = "The pattern: follow most rules but skip the hard ones. Enter slightly early. Exit slightly early. Feel 'close enough' to your plan."
    } else {
      manifestation = "Operating within parameters. The primary risk is complacency -- optimal states breed overconfidence which leads to rule-breaking."
      rCost = "The cost of complacency is usually one large violation after a winning streak that wipes multiple wins."
      pattern = "The pattern: things are going well, so you loosen rules. 'Just this once' becomes a habit. The blowup comes when you least expect it."
    }

    return { manifestation, rCost, pattern }
  }, [state.systemState, state.dominantRisk])

  // Deep action intelligence
  const actionIntel = useMemo(() => {
    const correction = state.primaryCorrection
    let immediateAction = ""
    let ifYouIgnore = ""
    let checkIn = ""

    if (isBad) {
      immediateAction = "Stop. Literally stop what you're doing. Close the order entry panel. Pull up your journal. Write down what you're feeling RIGHT NOW before you do anything else."
      ifYouIgnore = "If you ignore this: statistically, your next trade has a 73% chance of being a loss and a 40% chance of being more than 1R loss."
      checkIn = "Set a timer for 10 minutes. When it goes off, re-read what you wrote. If you still want to trade, run through your full checklist from scratch."
    } else if (state.systemState === "guarded") {
      immediateAction = "Slow down by one step. Whatever you were about to do, add one more confirmation. If you were about to enter, wait for one more candle close."
      ifYouIgnore = "If you skip the extra confirmation: you'll have slightly worse entries on average, compounding into significant R loss over the session."
      checkIn = "Before each action, verbally state your reason out loud. If you can't articulate it clearly, you don't have a reason."
    } else {
      immediateAction = "You're clear to execute your plan as written. The system sees no elevated risk. Follow your process with full conviction."
      ifYouIgnore = "Even in a clear state, deviating from your plan means you're trading emotion, not edge. The plan IS the edge."
      checkIn = "After each trade, take 60 seconds to log the trade in your journal before looking at the next chart."
    }

    return { immediateAction, ifYouIgnore, checkIn }
  }, [state.primaryCorrection, state.systemState, isBad])

  // ═══ BEHAVIORAL TRAP ENGINE ═══
  // Deep dual-domain trap system: Strategy traps (market-facing) + Psychology traps (self-facing)
  // Each trap is phase-aware, session-aware, directive-aware, and connects back to Focus Now / Threat
  const behavioralTraps = useMemo(() => {
    const phase = session.subPhase
    const kz = session.killzone
    const name = session.name
    const sysState = state.systemState
    const prog = session.kzProgress

    // ── STRATEGY TRAPS ──
    // These are about WHAT you do wrong with the market
    interface TrapItem {
      id: string
      label: string
      description: string
      trigger: string       // What causes this trap to activate
      consequence: string   // What happens if you fall in
      escape: string        // How to get out / prevent
      severity: "critical" | "high" | "medium"
      active: boolean       // Whether this trap is relevant right now
      connection: string    // How it connects to Focus Now / Primary Threat
    }

    const strategyTraps: TrapItem[] = []

    // 1. Entry Timing Trap -- always relevant during killzones
    if (kz) {
      if (prog < 0.15) {
        strategyTraps.push({
          id: "st-early-entry",
          label: "Early Entry Trap",
          description: "Entering during the initial sweep before displacement confirms. The first move in any killzone is designed to trap early entries. You see movement and interpret it as direction -- but it's liquidity collection.",
          trigger: `Price starts moving at ${name} open. Your chart shows a break of structure. Your finger is on the button because "it's going."`,
          consequence: "You enter in the direction of the sweep. Price reverses violently in the displacement move. Your stop hits. You were right about direction but wrong about timing -- and timing IS direction in ICT.",
          escape: "Wait for the displacement candle. It must have: body > 60% of total range, clear rejection of the swept level, and ideally a fair value gap forming. No displacement candle = no entry. Period.",
          severity: "critical",
          active: true,
          connection: "This trap directly contradicts FOCUS NOW. Your focus says to watch for the sweep -- this trap catches you entering DURING it instead of AFTER it."
        })
      } else if (prog < 0.5) {
        strategyTraps.push({
          id: "st-chase-entry",
          label: "Chase Entry Trap",
          description: "The displacement happened but you missed the optimal entry. Now you're entering at a worse price, convincing yourself 'it still has room.' Your R:R is degraded and your stop is too tight or too wide.",
          trigger: `Displacement confirmed ${Math.round(prog * session.totalMinutes)}min ago. Price has already moved significantly. You didn't enter at the order block. Now you're watching it extend without you.`,
          consequence: "Chased entries average 40% less R:R than planned entries. Your stop is either too tight (hit on normal pullback) or too wide (excessive risk). Either way, your edge is destroyed.",
          escape: "If you missed the entry, wait for a pullback to the nearest order block or fair value gap. If no pullback comes, accept that this trade wasn't yours. The market will offer another setup.",
          severity: "high",
          active: true,
          connection: "FOCUS NOW says this is the execution window. The trap is executing WITHOUT proper entry structure just because the window is open."
        })
      } else {
        strategyTraps.push({
          id: "st-late-entry",
          label: "Late Session Entry Trap",
          description: "The killzone is mature. Entering now means you're buying the top or selling the bottom of the session move. Reversal risk is elevated. The institutional flow that created the move is winding down.",
          trigger: `${name} KZ is ${Math.round(prog * 100)}% through. The direction is clear and feels 'safe.' You haven't traded yet and feel the pressure of a closing window.`,
          consequence: "Late entries catch the tail end of moves. You enter just as smart money is taking profit. The 'obvious direction' reverses right after your entry.",
          escape: "Accept the miss. A missed trade costs $0. A bad late entry costs real money. Shift your focus to preparing for the next session instead of forcing this one.",
          severity: "high",
          active: true,
          connection: "FOCUS NOW has shifted to management/continuation. This trap ignores that context and treats a closing window like an opening one."
        })
      }
    }

    // 2. Structure Misread Trap
    strategyTraps.push({
      id: "st-structure-misread",
      label: "Structure Misread Trap",
      description: "Seeing the structure you want to see instead of what's actually there. Confirmation bias applied to chart structure. You find the order block that supports your thesis and ignore the one that contradicts it.",
      trigger: "You have a bias (bullish or bearish) and you're scanning the chart for evidence. Every candle becomes 'confirmation.' You're not analyzing -- you're prosecuting a case you've already decided.",
      consequence: "Trading against true market structure while convinced you're aligned with it. This is the #1 cause of 'I was right about direction but still lost' -- no, you weren't right. You misread the structure.",
      escape: "Before entering, draw the OPPOSITE case on your chart. Where would a trader with the opposite bias enter? If their case is stronger than yours, you're the one being trapped.",
      severity: state.psychologyScore < 60 ? "critical" : "high",
      active: true,
      connection: "Primary Threat identifies your dominant risk. This trap shows how that risk manifests in your chart reading -- you see what your emotional state wants you to see."
    })

    // 3. Invalidation Denial Trap
    strategyTraps.push({
      id: "st-invalidation-denial",
      label: "Invalidation Denial Trap",
      description: "Price has reached your invalidation level but you move your stop instead of accepting the loss. You tell yourself 'it just needs more room' or 'they're just hunting stops.' Your predetermined invalidation was correct -- you're wrong to move it.",
      trigger: "Price approaches your stop loss. The anxiety of taking a loss overrides your pre-trade plan. You find a 'structural reason' to widen your stop -- there's always one if you look hard enough.",
      consequence: "A planned 1R loss becomes 2-3R. The invalidation you identified pre-trade was your best, most objective analysis. Moving the stop is your worst, most emotional analysis overriding your best work.",
      escape: "Set your stop and remove the ability to modify it. If your platform allows, use a 'set and forget' mode. Your pre-trade self is smarter than your in-trade self. Trust the plan.",
      severity: sysState === "critical" || sysState === "reactive" ? "critical" : "high",
      active: true,
      connection: "This trap is amplified by your current system state. When threat level is elevated, the urge to 'save' a losing trade intensifies. The Action Field tells you to slow down -- this trap catches you speeding up."
    })

    // ── PSYCHOLOGY TRAPS ──
    // These are about WHO you become when trading
    const psychologyTraps: TrapItem[] = []

    // 1. Revenge Cycle Trap
    psychologyTraps.push({
      id: "ps-revenge-cycle",
      label: "Revenge Cycle Trap",
      description: "After a loss, your brain shifts from 'trade the plan' to 'recover the loss.' This isn't a conscious decision -- it's neurological. The pain of loss activates the same circuits as physical threat. Your brain treats the lost money as something stolen that must be recovered immediately.",
      trigger: "You've taken a loss. You feel a physical tension -- stomach, chest, jaw. Your eyes are scanning faster. You're looking for 'the setup that will make this right.' You're not waiting for your process -- you're hunting.",
      consequence: "Revenge trades have a documented 73% loss rate. The average revenge trade loses 1.5x the original loss. A 1R loss becomes a 3.5R drawdown within 30 minutes. This single pattern destroys more accounts than any other.",
      escape: "The moment you feel the physical sensation of wanting to 'get it back,' stand up. Leave the desk. Set a timer for 15 minutes minimum. When you return, you must run through your FULL checklist from scratch as if this is your first trade of the day.",
      severity: sysState === "critical" ? "critical" : state.psychologyScore < 55 ? "critical" : "high",
      active: true,
      connection: "Your Primary Threat is often a downstream effect of this pattern. The revenge cycle doesn't just cause one bad trade -- it corrupts your entire session. Everything FOCUS NOW is telling you becomes invisible when this trap activates."
    })

    // 2. Overconfidence Decay Trap
    psychologyTraps.push({
      id: "ps-overconfidence",
      label: "Overconfidence Decay Trap",
      description: "After a streak of wins, your brain releases dopamine that makes you feel invincible. You stop following your process because 'you can feel the market.' Rules feel like constraints rather than edge-generators. This is when the blowup comes -- not during losing streaks, but after winning ones.",
      trigger: "You've had a winning streak. You feel 'in the zone.' Your sizing is creeping up. You're taking setups you normally wouldn't because 'everything is working.' You skip one checklist item. Then another.",
      consequence: "The blowup trade after a winning streak typically wipes 50-80% of the streak's gains. One trade, one moment of 'I don't need the checklist today.' This is how 'winning months' become 'break-even months.'",
      escape: "After every win, your next trade must have MORE confirmation, not less. Winning should make you MORE disciplined, not less. Write down: 'The win was because of the process. The process is the edge. Not me.'",
      severity: sysState === "stable" ? "high" : "medium",
      active: true,
      connection: "When your system state is STABLE, this is your PRIMARY trap. The threat field might show low risk -- but that's exactly when overconfidence breeds. Stability is not safety."
    })

    // 3. Identity Fragmentation Trap
    psychologyTraps.push({
      id: "ps-identity-frag",
      label: "Identity Fragmentation Trap",
      description: "You're not one trader -- you're multiple. There's the 'disciplined you' who writes the plan, the 'emotional you' who executes it, and the 'rationalizing you' who justifies deviations. These identities conflict. The plan-writer and the executor are different people with different risk tolerances.",
      trigger: "You write a plan that says 'only A+ setups.' Then you see a B+ setup and your executor says 'close enough.' Your rationalizer says 'you can't just sit here doing nothing.' Your plan-writer is no longer in the room.",
      consequence: "Inconsistent execution. Some days you follow rules perfectly. Other days you don't. You can't build a track record because your track record is actually 3 different traders' results mixed together.",
      escape: "Before every trade, state out loud which 'you' is making this decision. If it's not the plan-writer, don't trade. The plan-writer operates before the session. Once the session starts, your only job is to execute what the plan-writer decided.",
      severity: "high",
      active: true,
      connection: "This is the root cause of the gap between your strategy's INTENDED performance and ACTUAL performance. The system sees this gap in intent-vs-action metrics. Every other trap is a symptom of this one."
    })

    // 4. Session-specific psychology trap
    if (kz && name === "London" && prog < 0.2) {
      psychologyTraps.push({
        id: "ps-fomo-open",
        label: "Opening FOMO Trap",
        description: "London open triggers a fight-or-flight response. Rapid price movement activates your amygdala. Your prefrontal cortex (rational decision-making) gets overridden by emotional urgency. This is neurological -- not a character flaw.",
        trigger: `London just opened. Price is moving fast. Your heart rate is elevated. You're thinking 'if I don't enter now, I'll miss the whole move.' This thought is the trap.`,
        consequence: "FOMO entries at session open are statistically the worst entries of any killzone. They enter in the sweep, not the displacement. They're the liquidity that smart money is collecting.",
        escape: "Acknowledge the feeling: 'My amygdala is firing. This is not a signal -- it's a response.' Then wait. The displacement will come. It always comes. And when it does, you'll enter calmly at a better price with a better stop.",
        severity: "critical",
        active: true,
        connection: "FOCUS NOW explicitly says to watch and wait. This trap is the exact opposite -- it makes you act when your plan says observe."
      })
    }

    if (!kz) {
      psychologyTraps.push({
        id: "ps-boredom",
        label: "Boredom Addiction Trap",
        description: "You're outside a killzone but you're still watching charts. This isn't analysis -- it's screen addiction. Your brain has associated the chart with dopamine (from previous wins) and is seeking a hit. You'll find a 'setup' because your brain needs you to.",
        trigger: `It's ${name} -- no killzone active. But you're here, reading this, watching price. Ask yourself honestly: are you preparing for the next session, or are you looking for a reason to trade NOW?`,
        consequence: "Off-killzone trades have the lowest win rate of any category. They exist purely because of the trader's need for action, not because of market opportunity. These trades are the hidden leak in most accounts.",
        escape: "Close the chart. Open your journal. Review your last 5 trades. Grade each one on process (not outcome). This is more valuable than watching a chart move 3 pips in a dead zone.",
        severity: "high",
        active: true,
        connection: "FOCUS NOW for off-session is always about preparation. This trap converts preparation time into trading time, stealing from your future edge to feed your present addiction."
      })
    }

    // Calculate composite severity
    const criticalCount = [...strategyTraps, ...psychologyTraps].filter(t => t.active && t.severity === "critical").length
    const totalActive = [...strategyTraps, ...psychologyTraps].filter(t => t.active).length

    return {
      strategy: strategyTraps.filter(t => t.active),
      psychology: psychologyTraps.filter(t => t.active),
      criticalCount,
      totalActive,
      overallSeverity: criticalCount >= 2 ? "critical" as const : criticalCount >= 1 ? "high" as const : "medium" as const,
    }
  }, [session, state.systemState, state.psychologyScore])

  const [trapView, setTrapView] = useState<"overview" | "strategy" | "psychology">("overview")

  // Killzone phase timeline
  const kzPhases = useMemo(() => getKillzonePhases(session.name), [session.name])
  const activePhaseIndex = useMemo(() => {
    const prog = session.kzProgress
    const idx = kzPhases.findIndex(p => prog >= p.startPct && prog < p.endPct)
    return idx >= 0 ? idx : kzPhases.length - 1
  }, [session.kzProgress, kzPhases])
  const activePhase = kzPhases[activePhaseIndex]

  // Derive progress percentage for display
  const kzPct = Math.min(Math.round(session.kzProgress * 100), 100)

  return (
    <div className="border-b border-white/[0.04] relative overflow-hidden">

      {/* ═══ SESSION FIELD -- cinematic full-width hero ═══ */}
      <div className="relative">
        <div className="relative overflow-hidden"
          style={{ backgroundColor: session.killzone ? `${session.phaseColor}04` : "rgba(255,255,255,0.006)" }}>

          {/* Layer 1: Deep ambient orbs -- slow drift */}
          <motion.div className="absolute inset-0 pointer-events-none"
            animate={{ opacity: session.killzone ? [0.02, 0.07, 0.02] : [0.005, 0.02, 0.005] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
            <motion.div className="absolute w-48 h-48 rounded-full"
              style={{ backgroundColor: session.phaseColor, filter: "blur(60px)", left: "5%", top: "-20%" }}
              animate={{ x: [0, 30, 0], y: [0, 15, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
            <motion.div className="absolute w-36 h-36 rounded-full"
              style={{ backgroundColor: session.phaseColor, filter: "blur(50px)", right: "10%", bottom: "-10%", opacity: 0.6 }}
              animate={{ x: [0, -20, 0], y: [0, -10, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />
            {session.killzone && (
              <motion.div className="absolute w-24 h-24 rounded-full"
                style={{ backgroundColor: session.phaseColor, filter: "blur(35px)", left: "50%", top: "30%", marginLeft: -48, opacity: 0.3 }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
            )}
          </motion.div>

          {/* Layer 2: Horizontal scan line */}
          <motion.div className="absolute inset-y-0 pointer-events-none"
            style={{ width: 1, background: `linear-gradient(to bottom, transparent, ${session.phaseColor}15, transparent)` }}
            animate={{ left: ["-5%", "105%"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />

          {/* Layer 3: Vertical shimmer (killzone only) */}
          {session.killzone && (
            <motion.div className="absolute inset-x-0 pointer-events-none"
              style={{ height: 1, background: `linear-gradient(to right, transparent, ${session.phaseColor}10, transparent)` }}
              animate={{ top: ["-5%", "105%"] }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }} />
          )}

          {/* Layer 4: Edge glow lines */}
          <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: `linear-gradient(to right, transparent, ${session.phaseColor}10, ${session.phaseColor}18, ${session.phaseColor}10, transparent)` }} />

          <div className="relative px-4 pt-3.5 pb-4 space-y-3">

            {/* ═══ SESSION CAROUSEL -- compact inline strip ═══ */}
            <div className="flex items-center gap-1.5">
              <motion.button
                onClick={() => goToSession(currentSessionIdx - 1)}
                className="w-6 h-6 flex items-center justify-center text-white/15 hover:text-white/40 transition-all shrink-0 rounded-md"
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-3 h-3" />
              </motion.button>

              <div className="flex-1 flex items-center justify-center gap-0.5 overflow-x-auto scrollbar-none">
                {SESSION_OPTIONS.map((sess, i) => {
                  const isActive = i === currentSessionIdx
                  const isPast = i < currentSessionIdx
                  return (
                    <motion.button
                      key={sess.value}
                      onClick={() => goToSession(i)}
                      className="group flex items-center gap-1 shrink-0 px-1.5 py-1 rounded-md transition-all duration-200"
                      style={{
                        backgroundColor: isActive ? `${sess.color}0c` : "transparent",
                      }}
                      whileHover={{ backgroundColor: isActive ? `${sess.color}12` : "rgba(255,255,255,0.02)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="relative">
                        <div className="rounded-full transition-all duration-200"
                          style={{
                            width: isActive ? 6 : 4,
                            height: isActive ? 6 : 4,
                            backgroundColor: isActive ? sess.color : isPast ? `${sess.color}25` : `${sess.color}18`,
                            boxShadow: isActive ? `0 0 6px ${sess.color}40` : "none",
                          }}
                        />
                      </div>
                      <span className="text-[7px] font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200"
                        style={{ color: isActive ? `${sess.color}90` : isPast ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.15)" }}>
                        {sess.shortLabel || sess.label}
                      </span>
                    </motion.button>
                  )
                })}
              </div>

              <motion.button
                onClick={() => goToSession(currentSessionIdx + 1)}
                className="w-6 h-6 flex items-center justify-center text-white/15 hover:text-white/40 transition-all shrink-0 rounded-md"
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-3 h-3" />
              </motion.button>

              <motion.button
                onClick={() => { setAutoPlay(!autoPlay); autoPlayStepRef.current = 0 }}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[7px] font-mono font-black uppercase tracking-wider transition-all shrink-0 ${
                  autoPlay
                    ? "bg-amber-400/[0.06] text-amber-400/60"
                    : "text-white/18 hover:text-white/35"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {autoPlay ? (
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-amber-400"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }} />
                ) : (
                  <Activity className="w-2.5 h-2.5" />
                )}
                {autoPlay ? "LIVE" : "24H"}
              </motion.button>
            </div>

            {/* ═══ SESSION IDENTITY -- clean breathing header ═══ */}
            <div className="relative">
              {/* Core layout: session name left, metrics right */}
              <div className="flex items-center justify-between">

                {/* Left: status + session name + badge */}
                <div className="flex items-center gap-2.5">
                  {session.killzone ? (
                    <div className="relative flex items-center justify-center" style={{ width: 10, height: 10 }}>
                      <motion.div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: session.phaseColor }}
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }} />
                      <motion.div className="absolute w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: session.phaseColor }}
                        animate={{ scale: [1, 2.8], opacity: [0.3, 0] }}
                        transition={{ duration: 2, repeat: Infinity }} />
                    </div>
                  ) : (
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `${session.phaseColor}30` }} />
                  )}

                  <span className="text-[14px] font-mono font-black uppercase tracking-wider"
                    style={{ color: session.phaseColor }}>
                    {session.name}
                  </span>

                  {session.killzone && (
                    <motion.span className="text-[7px] font-mono font-black uppercase tracking-[0.12em] px-1.5 py-0.5 rounded-md"
                      style={{ backgroundColor: `${session.phaseColor}08`, color: `${session.phaseColor}80`, border: `1px solid ${session.phaseColor}12` }}
                      animate={{ borderColor: [`${session.phaseColor}10`, `${session.phaseColor}28`, `${session.phaseColor}10`] }}
                      transition={{ duration: 3, repeat: Infinity }}>
                      KZ
                    </motion.span>
                  )}
                </div>

                {/* Right: pair + time remaining + UTC */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono font-bold text-white/40">{symbol}</span>

                  <div className="w-px h-3 bg-white/[0.06]" />

                  {session.remaining > 0 ? (
                    <motion.span className="text-[11px] font-mono font-black tabular-nums"
                      style={{ color: `${session.phaseColor}80` }}
                      animate={session.remaining < 15 ? { opacity: [1, 0.4, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}>
                      {session.remaining}m
                    </motion.span>
                  ) : (
                    <span className="text-[11px] font-mono font-bold text-white/15">--</span>
                  )}

                  <span className="text-[9px] font-mono tabular-nums text-white/18">{utcStr}</span>
                </div>
              </div>

              {/* Simple progress bar */}
              <div className="mt-2.5">
                <div className="h-[3px] bg-white/[0.03] rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full relative"
                    style={{ backgroundColor: session.phaseColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${kzPct}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}>
                    <motion.div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                      style={{ backgroundColor: session.phaseColor, filter: "blur(4px)" }}
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }} />
                  </motion.div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[8px] font-mono text-white/15">{session.subPhase}</span>
                  <span className="text-[8px] font-mono font-bold tabular-nums" style={{ color: `${session.phaseColor}50` }}>{kzPct}%</span>
                </div>
              </div>
            </div>

            {/* ═══ DAY INTELLIGENCE BANNER ═══ */}
            <div className="relative">
              <div
                className="w-full text-left group cursor-pointer"
              >
                <div className="relative rounded-xl overflow-hidden border transition-all duration-300"
                  style={{
                    backgroundColor: dayExpanded ? `${dayContext.color}06` : `${dayContext.color}03`,
                    borderColor: dayExpanded ? `${dayContext.color}18` : `${dayContext.color}08`,
                  }}>

                  {/* Day ambient glow */}
                  <motion.div className="absolute inset-0 pointer-events-none"
                    animate={{ opacity: [0.01, 0.04, 0.01] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
                    <motion.div className="absolute w-20 h-20 rounded-full"
                      style={{ backgroundColor: dayContext.color, filter: "blur(25px)", left: "10%", top: "-20%" }}
                      animate={{ x: [0, 15, 0] }}
                      transition={{ duration: 10, repeat: Infinity }} />
                  </motion.div>

                  {/* Collapsed: Day name + quality + insight */}
                  <div className="relative px-4 py-3" onClick={() => setDayExpanded(!dayExpanded)}>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: `${dayContext.color}60` }} />
                        <span className="text-[14px] font-mono font-black uppercase tracking-wider"
                          style={{ color: `${dayContext.color}` }}>
                          {dayContext.day}
                        </span>
                        <span className="text-[8px] font-mono font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider"
                          style={{
                            backgroundColor: `${dayContext.color}10`,
                            color: `${dayContext.color}80`,
                            border: `1px solid ${dayContext.color}15`,
                          }}>
                          {dayContext.qualityLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">{dayContext.weekPosition.split("--")[0].trim()}</span>
                        <motion.div
                          animate={{ rotate: dayExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                          <ChevronDown className="w-4 h-4 shrink-0" style={{ color: `${dayContext.color}30` }} />
                        </motion.div>
                      </div>
                    </div>
                    {/* One-line insight always visible */}
                    <p className="text-[10.5px] text-white/40 mt-1.5 leading-snug"
                      style={{ paddingLeft: 22 }}>
                      {dayContext.insight}
                    </p>
                  </div>

                  {/* Expanded: Full day intelligence */}
                  <AnimatePresence>
                    {dayExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-3">
                          <div className="h-px" style={{ background: `linear-gradient(to right, ${dayContext.color}12, ${dayContext.color}06, transparent)` }} />

                          {/* Week position bar -- INTERACTIVE */}
                          <div className="flex items-center gap-1">
                            {([
                              { d: "MON" as const, val: 1, color: "#f59e0b", quality: "CAUTION" },
                              { d: "TUE" as const, val: 2, color: "#10b981", quality: "PRIME" },
                              { d: "WED" as const, val: 3, color: "#3b82f6", quality: "KEY DAY" },
                              { d: "THU" as const, val: 4, color: "#f59e0b", quality: "SELECTIVE" },
                              { d: "FRI" as const, val: 5, color: "#ef4444", quality: "AVOID" },
                            ]).map((item) => {
                              const isToday = item.d === dayContext.shortDay
                              const isSelected = demoOverrides.dayOverride === item.val
                              const isHighlighted = isToday || isSelected
                              return (
                                <button
                                  key={item.d}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    if (isSelected) {
                                      // Clicking the already-selected day resets to real
                                      onOverridesChange({ ...demoOverrides, dayOverride: null })
                                    } else {
                                      goToDay(item.val)
                                    }
                                  }}
                                  className="flex-1 relative group cursor-pointer"
                                >
                                  <div className="h-[4px] rounded-full transition-all duration-300"
                                    style={{
                                      backgroundColor: isHighlighted ? item.color : `${item.color}12`,
                                      boxShadow: isHighlighted ? `0 0 10px ${item.color}35` : "none",
                                    }} />
                                  <span className={`text-[8px] font-mono font-black block text-center mt-1.5 tracking-wider transition-all duration-200 ${
                                    isHighlighted ? "text-white/70" : "text-white/15 group-hover:text-white/35"
                                  }`}>
                                    {item.d}
                                  </span>
                                  {isHighlighted && (
                                    <motion.div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                                      style={{ backgroundColor: item.color }}
                                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                                      transition={{ duration: 1.5, repeat: Infinity }} />
                                  )}
                                  {isSelected && !isToday && (
                                    <span className="text-[5px] font-mono font-black block text-center mt-0.5 tracking-wider"
                                      style={{ color: `${item.color}50` }}>
                                      SIM
                                    </span>
                                  )}
                                </button>
                              )
                            })}
                          </div>

                          {/* Recommendation */}
                          <motion.div className="space-y-1.5 pl-4 relative rounded-lg py-2.5 pr-3"
                            whileHover={{ backgroundColor: `${dayContext.color}05` }}
                            transition={{ duration: 0.35, ease: "easeOut" }}>
                            <motion.div className="absolute left-0 top-2 w-[2px] rounded-full"
                              style={{ backgroundColor: `${dayContext.color}15`, height: "calc(100% - 16px)" }}
                              animate={{ backgroundColor: [`${dayContext.color}10`, `${dayContext.color}28`, `${dayContext.color}10`] }}
                              transition={{ duration: 3.5, repeat: Infinity }} />
                            <div className="flex items-center gap-1.5">
                              <Star className="w-3.5 h-3.5" style={{ color: `${dayContext.color}45` }} />
                              <span className="text-[8px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${dayContext.color}40` }}>
                                RECOMMENDATION
                              </span>
                            </div>
                            <p className="text-[11px] text-white/40 leading-relaxed">
                              {dayContext.recommendation}
                            </p>
                          </motion.div>

                          {/* Manipulation Pattern */}
                          <motion.div className="space-y-1.5 pl-4 relative rounded-lg py-2.5 pr-3"
                            whileHover={{ backgroundColor: "rgba(239,68,68,0.03)" }}
                            transition={{ duration: 0.35, ease: "easeOut" }}>
                            <div className="absolute left-0 top-2 w-[2px] rounded-full" style={{ backgroundColor: "rgba(239,68,68,0.12)", height: "calc(100% - 16px)" }} />
                            <div className="flex items-center gap-1.5">
                              <ShieldAlert className="w-3.5 h-3.5 text-red-400/35" />
                              <span className="text-[8px] font-mono font-black text-red-400/30 uppercase tracking-[0.15em]">
                                MANIPULATION PATTERN
                              </span>
                            </div>
                            <p className="text-[11px] text-white/35 leading-relaxed">
                              {dayContext.manipulationPattern}
                            </p>
                          </motion.div>

                          {/* Historical Edge */}
                          <motion.div className="space-y-1.5 pl-4 relative rounded-lg py-2.5 pr-3"
                            whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                            transition={{ duration: 0.35, ease: "easeOut" }}>
                            <div className="absolute left-0 top-2 w-[2px] rounded-full bg-white/[0.06]" style={{ height: "calc(100% - 16px)" }} />
                            <div className="flex items-center gap-1.5">
                              <BarChart3 className="w-3.5 h-3.5 text-white/20" />
                              <span className="text-[8px] font-mono font-black text-white/15 uppercase tracking-[0.15em]">
                                HISTORICAL EDGE
                              </span>
                            </div>
                            <p className="text-[11px] text-white/30 leading-relaxed italic">
                              {dayContext.historicalEdge}
                            </p>
                          </motion.div>

                          {/* Two-column: Risk + Sizing */}
                          <div className="grid grid-cols-2 gap-2">
                            <motion.div className="px-3 py-2.5 rounded-xl border relative overflow-hidden"
                              style={{ backgroundColor: `${dayContext.color}02`, borderColor: `${dayContext.color}08` }}
                              whileHover={{ borderColor: `${dayContext.color}18` }}
                              transition={{ duration: 0.3, ease: "easeOut" }}>
                              <div className="flex items-center gap-1.5 mb-1">
                                <ShieldAlert className="w-3 h-3" style={{ color: `${dayContext.color}30` }} />
                                <span className="text-[7px] font-mono font-black uppercase tracking-[0.12em]" style={{ color: `${dayContext.color}28` }}>RISK</span>
                              </div>
                              <p className="text-[10px] text-white/30 leading-relaxed">{dayContext.riskProfile.split(".")[0]}.</p>
                            </motion.div>
                            <motion.div className="px-3 py-2.5 rounded-xl border relative overflow-hidden"
                              style={{ backgroundColor: `${dayContext.color}02`, borderColor: `${dayContext.color}08` }}
                              whileHover={{ borderColor: `${dayContext.color}18` }}
                              transition={{ duration: 0.3, ease: "easeOut" }}>
                              <div className="flex items-center gap-1.5 mb-1">
                                <Scale className="w-3 h-3" style={{ color: `${dayContext.color}30` }} />
                                <span className="text-[7px] font-mono font-black uppercase tracking-[0.12em]" style={{ color: `${dayContext.color}28` }}>SIZING</span>
                              </div>
                              <p className="text-[10px] text-white/30 leading-relaxed">{dayContext.positionSizing}</p>
                            </motion.div>
                          </div>

                          {/* Key Behavior Today */}
                          <motion.div className="px-3.5 py-3 rounded-xl border relative overflow-hidden"
                            style={{ backgroundColor: `${dayContext.color}02`, borderColor: `${dayContext.color}10` }}
                            whileHover={{ borderColor: `${dayContext.color}20` }}
                            transition={{ duration: 0.3, ease: "easeOut" }}>
                            <motion.div className="absolute inset-0 pointer-events-none"
                              animate={{ opacity: [0, 0.015, 0] }}
                              transition={{ duration: 4, repeat: Infinity }}>
                              <div className="absolute right-0 top-0 w-16 h-16 rounded-full"
                                style={{ backgroundColor: dayContext.color, filter: "blur(20px)" }} />
                            </motion.div>
                            <div className="flex items-center gap-1.5 mb-1.5 relative">
                              <Brain className="w-3 h-3" style={{ color: `${dayContext.color}35` }} />
                              <span className="text-[7px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${dayContext.color}30` }}>
                                KEY BEHAVIOR TODAY
                              </span>
                            </div>
                            <p className="text-[11px] leading-relaxed font-medium relative" style={{ color: `${dayContext.color}55` }}>
                              {dayContext.keyBehavior}
                            </p>
                          </motion.div>

                          {/* Optimal sessions */}
                          {dayContext.optimalSessions.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Timer className="w-3 h-3 text-white/15" />
                              <span className="text-[7px] font-mono font-bold text-white/15 uppercase tracking-wider">OPTIMAL:</span>
                              {dayContext.optimalSessions.map((s) => (
                                <span key={s} className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-md"
                                  style={{ backgroundColor: `${dayContext.color}08`, color: `${dayContext.color}50`, border: `1px solid ${dayContext.color}10` }}>
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* ═══ SESSION INTELLIGENCE ORGANISM ═══
                One unified living block: phase timeline + focus + why + expectation
                All breathing together as a single system, not 3 separate cards */}
            <div className="relative rounded-2xl border overflow-hidden"
              style={{ borderColor: `${session.phaseColor}0a` }}>

              {/* Multi-layer ambient field */}
              <div className="absolute inset-0 pointer-events-none">
                <motion.div className="absolute inset-0"
                  style={{ background: `radial-gradient(ellipse 80% 60% at 20% 10%, ${session.phaseColor}06, transparent)` }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
                <motion.div className="absolute inset-0"
                  style={{ background: `radial-gradient(ellipse 50% 70% at 80% 90%, ${session.phaseColor}04, transparent)` }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
                {/* Drifting particle */}
                <motion.div className="absolute w-1 h-1 rounded-full"
                  style={{ backgroundColor: `${session.phaseColor}30` }}
                  animate={{ x: [20, 280, 150, 20], y: [30, 80, 200, 30], opacity: [0, 0.6, 0.3, 0] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
                <motion.div className="absolute w-0.5 h-0.5 rounded-full"
                  style={{ backgroundColor: `${session.phaseColor}20` }}
                  animate={{ x: [250, 50, 180, 250], y: [150, 40, 120, 150], opacity: [0, 0.4, 0.2, 0] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
              </div>

              {/* Horizontal scan line */}
              <motion.div className="absolute inset-x-0 pointer-events-none"
                style={{ height: 1, background: `linear-gradient(to right, transparent, ${session.phaseColor}08, transparent)` }}
                animate={{ top: ["-2%", "102%"] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }} />

              <div className="relative">

                {/* ── FOCUS NOW -- the hero ── */}
                <div className="px-5 pt-5 pb-4">
                  <div className="flex items-start gap-4">
                    {/* Breathing vertical accent -- clean, proportional */}
                    <div className="flex flex-col items-center pt-1.5 shrink-0">
                      <motion.div className="w-[2px] rounded-full"
                        style={{ backgroundColor: session.phaseColor, height: 24 }}
                        animate={{
                          opacity: [0.4, 0.85, 0.4],
                          boxShadow: [`0 0 4px ${session.phaseColor}00`, `0 0 10px ${session.phaseColor}25`, `0 0 4px ${session.phaseColor}00`],
                        }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} />
                      <div className="w-[2px] h-1.5 rounded-full mt-0.5"
                        style={{ backgroundColor: `${session.phaseColor}12` }} />
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                      {/* Phase badge + label */}
                      <div className="flex items-center gap-2.5">
                        <motion.div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border"
                          style={{ backgroundColor: `${session.phaseColor}08`, borderColor: `${session.phaseColor}12` }}
                          animate={{ borderColor: [`${session.phaseColor}0a`, `${session.phaseColor}20`, `${session.phaseColor}0a`] }}
                          transition={{ duration: 4, repeat: Infinity }}>
                          <motion.div className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: session.phaseColor }}
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity }} />
                          <span className="text-[8px] font-mono font-black uppercase tracking-wider"
                            style={{ color: `${session.phaseColor}90` }}>
                            {activePhase?.shortLabel || session.subPhase}
                          </span>
                        </motion.div>
                        <span className="text-[8px] font-mono text-white/12 uppercase tracking-wider">
                          {activePhaseIndex + 1}/{kzPhases.length}
                          {activePhaseIndex < kzPhases.length - 1 && ` \u2192 ${kzPhases[activePhaseIndex + 1]?.shortLabel}`}
                        </span>
                      </div>

                      {/* FOCUS NOW title */}
                      <motion.h2 className="text-[18px] font-mono font-black uppercase tracking-[0.08em] leading-tight"
                        style={{ color: session.phaseColor }}
                        animate={{ textShadow: [`0 0 20px ${session.phaseColor}00`, `0 0 20px ${session.phaseColor}15`, `0 0 20px ${session.phaseColor}00`] }}
                        transition={{ duration: 5, repeat: Infinity }}>
                        FOCUS NOW
                      </motion.h2>

                      {/* The instruction -- large, readable, commanding */}
                      <motion.p className="text-[15px] text-white/70 leading-[1.7] font-medium"
                        key={`focus-${activePhase?.id || session.subPhase}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                        {sessionIntel.focusNow}
                      </motion.p>
                    </div>
                  </div>
                </div>

                {/* ── WHY + EXPECTATION -- two-column intelligence ── */}
                <div className="px-4 pb-5">
                  <div className="grid grid-cols-2 gap-3">

                    {/* WHY THIS MATTERS */}
                    <motion.div className="relative rounded-xl border overflow-hidden cursor-default"
                      style={{ backgroundColor: `${session.phaseColor}03`, borderColor: `${session.phaseColor}06` }}
                      whileHover={{ borderColor: `${session.phaseColor}15`, backgroundColor: `${session.phaseColor}05` }}
                      transition={{ duration: 0.3, ease: "easeOut" }}>

                      <div className="relative px-3.5 py-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <motion.div className="w-[2px] h-4 rounded-full"
                            style={{ backgroundColor: `${session.phaseColor}30` }}
                            animate={{ backgroundColor: [`${session.phaseColor}20`, `${session.phaseColor}45`, `${session.phaseColor}20`] }}
                            transition={{ duration: 4, repeat: Infinity }} />
                          <span className="text-[9px] font-mono font-black uppercase tracking-[0.12em]"
                            style={{ color: `${session.phaseColor}55` }}>
                            WHY
                          </span>
                        </div>
                        <motion.p className="text-[11px] text-white/40 leading-[1.6]"
                          key={`why-${activePhase?.id || session.subPhase}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.05 }}>
                          {sessionIntel.focusWhy}
                        </motion.p>
                      </div>
                    </motion.div>

                    {/* EXPECTATION */}
                    <motion.div className="relative rounded-xl border overflow-hidden cursor-default"
                      style={{ backgroundColor: "rgba(255,255,255,0.01)", borderColor: "rgba(255,255,255,0.04)" }}
                      whileHover={{ borderColor: "rgba(255,255,255,0.10)", backgroundColor: "rgba(255,255,255,0.02)" }}
                      transition={{ duration: 0.3, ease: "easeOut" }}>

                      <div className="relative px-3.5 py-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <motion.div className="w-[2px] h-4 rounded-full"
                            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                            animate={{ backgroundColor: ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.15)", "rgba(255,255,255,0.05)"] }}
                            transition={{ duration: 5, repeat: Infinity }} />
                          <span className="text-[9px] font-mono font-black uppercase tracking-[0.12em] text-white/25">
                            EXPECT
                          </span>
                        </div>
                        <motion.p className="text-[11px] text-white/30 leading-[1.6]"
                          key={`exp-${activePhase?.id || session.subPhase}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.1 }}>
                          {sessionIntel.expectation}
                        </motion.p>
                      </div>
                    </motion.div>

                  </div>
                </div>

                {/* ── SESSION PHASES -- 6 phase cards with hover ── */}
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-6 gap-1.5">
                    {kzPhases.map((phase, i) => {
                      const isPast = i < activePhaseIndex
                      const isCurrent = i === activePhaseIndex
                      const phaseLocalProg = isCurrent
                        ? Math.max(0, Math.min(1, (session.kzProgress - phase.startPct) / (phase.endPct - phase.startPct)))
                        : isPast ? 1 : 0

                      return (
                        <div key={phase.id + "-card"} className="group relative">
                          <motion.div
                            className="rounded-lg border px-2 py-2 cursor-default transition-all duration-200 relative overflow-hidden"
                            style={{
                              backgroundColor: isCurrent ? `${session.phaseColor}06` : isPast ? `${session.phaseColor}03` : "rgba(255,255,255,0.005)",
                              borderColor: isCurrent ? `${session.phaseColor}18` : isPast ? `${session.phaseColor}08` : "rgba(255,255,255,0.03)",
                            }}
                            whileHover={{
                              backgroundColor: `${session.phaseColor}0a`,
                              borderColor: `${session.phaseColor}25`,
                            }}
                          >
                            {/* Fill bar at bottom */}
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.02]">
                              <motion.div className="h-full"
                                style={{ backgroundColor: isPast || isCurrent ? session.phaseColor : "transparent", opacity: isPast ? 0.3 : 0.6 }}
                                initial={false}
                                animate={{ width: `${phaseLocalProg * 100}%` }}
                                transition={{ duration: 0.8 }} />
                            </div>

                            {/* Phase dot + label */}
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full"
                                style={{
                                  backgroundColor: isCurrent ? session.phaseColor : isPast ? `${session.phaseColor}50` : `${session.phaseColor}12`,
                                  boxShadow: isCurrent ? `0 0 6px ${session.phaseColor}40` : "none",
                                }} />
                              <span className="text-[6px] font-mono font-black uppercase tracking-wider text-center leading-tight"
                                style={{
                                  color: isCurrent ? `${session.phaseColor}90` : isPast ? `${session.phaseColor}40` : "rgba(255,255,255,0.10)",
                                }}>
                                {phase.shortLabel}
                              </span>
                            </div>
                          </motion.div>

                          {/* Hover tooltip with description */}
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 w-44">
                            <div className="rounded-lg border px-3 py-2 shadow-xl"
                              style={{ backgroundColor: "#0a0a0b", borderColor: `${session.phaseColor}18` }}>
                              <div className="flex items-center gap-1.5 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isPast ? `${session.phaseColor}50` : isCurrent ? session.phaseColor : `${session.phaseColor}15` }} />
                                <span className="text-[8px] font-mono font-black uppercase tracking-wider" style={{ color: `${session.phaseColor}80` }}>{phase.label}</span>
                                {isCurrent && <span className="text-[6px] font-mono uppercase ml-auto" style={{ color: `${session.phaseColor}60` }}>Active</span>}
                                {isPast && <span className="text-[6px] font-mono uppercase text-white/15 ml-auto">Done</span>}
                              </div>
                              <p className="text-[9px] text-white/35 leading-relaxed">{phase.focusNow}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* ═══ BEHAVIORAL TRAP SYSTEM -- dual-domain deep intelligence ═══ */}
            <div className="relative rounded-xl border overflow-hidden"
              style={{
                backgroundColor: behavioralTraps.overallSeverity === "critical" ? "rgba(239,68,68,0.02)" : "rgba(245,158,11,0.015)",
                borderColor: behavioralTraps.overallSeverity === "critical" ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.06)",
              }}>

              {/* Multi-layer ambient glow */}
              <motion.div className="absolute inset-0 pointer-events-none"
                animate={{ opacity: behavioralTraps.overallSeverity === "critical" ? [0.015, 0.05, 0.015] : [0.005, 0.025, 0.005] }}
                transition={{ duration: behavioralTraps.overallSeverity === "critical" ? 3 : 6, repeat: Infinity, ease: "easeInOut" }}>
                <motion.div className="absolute w-24 h-24 rounded-full"
                  style={{ backgroundColor: behavioralTraps.overallSeverity === "critical" ? "#ef4444" : "#f59e0b", filter: "blur(30px)", left: "5%", top: "-15%" }}
                  animate={{ x: [0, 12, 0] }}
                  transition={{ duration: 8, repeat: Infinity }} />
                <motion.div className="absolute w-20 h-20 rounded-full"
                  style={{ backgroundColor: "#8b5cf6", filter: "blur(25px)", right: "8%", bottom: "-10%", opacity: 0.4 }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 10, repeat: Infinity }} />
              </motion.div>

              {/* Scan line */}
              <motion.div className="absolute inset-y-0 pointer-events-none"
                style={{ width: 1, background: `linear-gradient(to bottom, transparent, ${behavioralTraps.overallSeverity === "critical" ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.06)"}, transparent)` }}
                animate={{ left: ["-2%", "102%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />

              <div className="relative">
                {/* Header bar */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <motion.div
                      animate={behavioralTraps.overallSeverity === "critical" ? { rotate: [0, -8, 0, 8, 0], scale: [1, 1.1, 1] } : { rotate: [0, -3, 0, 3, 0] }}
                      transition={{ duration: behavioralTraps.overallSeverity === "critical" ? 2 : 5, repeat: Infinity }}>
                      <AlertTriangle className="w-4 h-4 shrink-0"
                        style={{ color: behavioralTraps.overallSeverity === "critical" ? "rgba(239,68,68,0.6)" : "rgba(245,158,11,0.5)" }} />
                    </motion.div>
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider"
                      style={{ color: behavioralTraps.overallSeverity === "critical" ? "rgba(239,68,68,0.65)" : "rgba(245,158,11,0.55)" }}>
                      BEHAVIORAL TRAPS
                    </span>
                    {behavioralTraps.criticalCount > 0 && (
                      <motion.span className="text-[8px] font-mono font-black px-1.5 py-0.5 rounded-md bg-red-400/10 text-red-400/60 border border-red-400/15"
                        animate={{ borderColor: ["rgba(248,113,113,0.15)", "rgba(248,113,113,0.35)", "rgba(248,113,113,0.15)"] }}
                        transition={{ duration: 2, repeat: Infinity }}>
                        {behavioralTraps.criticalCount} CRITICAL
                      </motion.span>
                    )}
                  </div>
                  <span className="text-[8px] font-mono font-bold text-white/20">{behavioralTraps.totalActive} active</span>
                </div>

                {/* Quick summary -- the session-specific warning */}
                <div className="px-4 pb-3">
                  <p className="text-[10.5px] leading-relaxed italic"
                    style={{ color: behavioralTraps.overallSeverity === "critical" ? "rgba(239,68,68,0.45)" : "rgba(245,158,11,0.4)" }}>
                    {sessionIntel.behaviorWarning}
                  </p>
                </div>

                {/* Domain toggle tabs */}
                <div className="px-4 pb-3">
                  <div className="flex gap-1.5">
                    {/* Strategy tab */}
                    <button
                      onClick={() => setTrapView(trapView === "strategy" ? "overview" : "strategy")}
                      className="flex-1 group"
                    >
                      <div className={`relative rounded-lg border px-3 py-2.5 overflow-hidden transition-all duration-300 ${
                        trapView === "strategy"
                          ? "border-amber-400/20 bg-amber-400/[0.04]"
                          : "border-white/[0.04] bg-white/[0.01] hover:border-amber-400/10 hover:bg-amber-400/[0.02]"
                      }`}>
                        {trapView === "strategy" && (
                          <motion.div className="absolute inset-0 pointer-events-none"
                            animate={{ opacity: [0, 0.03, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}>
                            <div className="absolute left-0 top-0 w-16 h-16 rounded-full"
                              style={{ backgroundColor: "#f59e0b", filter: "blur(20px)" }} />
                          </motion.div>
                        )}
                        <div className="relative flex items-center gap-2">
                          <Swords className={`w-3.5 h-3.5 transition-colors duration-300 ${
                            trapView === "strategy" ? "text-amber-400/70" : "text-amber-400/25"
                          }`} />
                          <div className="text-left">
                            <span className={`text-[9px] font-mono font-black uppercase tracking-wider block transition-colors duration-300 ${
                              trapView === "strategy" ? "text-amber-400/80" : "text-amber-400/35"
                            }`}>STRATEGY</span>
                            <span className="text-[8px] font-mono text-white/15">Market-facing traps</span>
                          </div>
                          <span className={`text-[9px] font-mono font-black ml-auto tabular-nums transition-colors duration-300 ${
                            trapView === "strategy" ? "text-amber-400/50" : "text-white/15"
                          }`}>{behavioralTraps.strategy.length}</span>
                        </div>
                      </div>
                    </button>

                    {/* Psychology tab */}
                    <button
                      onClick={() => setTrapView(trapView === "psychology" ? "overview" : "psychology")}
                      className="flex-1 group"
                    >
                      <div className={`relative rounded-lg border px-3 py-2.5 overflow-hidden transition-all duration-300 ${
                        trapView === "psychology"
                          ? "border-violet-400/20 bg-violet-400/[0.04]"
                          : "border-white/[0.04] bg-white/[0.01] hover:border-violet-400/10 hover:bg-violet-400/[0.02]"
                      }`}>
                        {trapView === "psychology" && (
                          <motion.div className="absolute inset-0 pointer-events-none"
                            animate={{ opacity: [0, 0.03, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}>
                            <div className="absolute right-0 top-0 w-16 h-16 rounded-full"
                              style={{ backgroundColor: "#8b5cf6", filter: "blur(20px)" }} />
                          </motion.div>
                        )}
                        <div className="relative flex items-center gap-2">
                          <Fingerprint className={`w-3.5 h-3.5 transition-colors duration-300 ${
                            trapView === "psychology" ? "text-violet-400/70" : "text-violet-400/25"
                          }`} />
                          <div className="text-left">
                            <span className={`text-[9px] font-mono font-black uppercase tracking-wider block transition-colors duration-300 ${
                              trapView === "psychology" ? "text-violet-400/80" : "text-violet-400/35"
                            }`}>PSYCHOLOGY</span>
                            <span className="text-[8px] font-mono text-white/15">Self-facing traps</span>
                          </div>
                          <span className={`text-[9px] font-mono font-black ml-auto tabular-nums transition-colors duration-300 ${
                            trapView === "psychology" ? "text-violet-400/50" : "text-white/15"
                          }`}>{behavioralTraps.psychology.length}</span>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* ═══ STRATEGY TRAPS VIEW ═══ */}
                <AnimatePresence mode="wait">
                  {trapView === "strategy" && (
                    <motion.div
                      key="strategy-traps"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3">
                        <div className="h-px" style={{ background: "linear-gradient(to right, rgba(245,158,11,0.12), rgba(245,158,11,0.04), transparent)" }} />

                        <div className="flex items-center gap-2 py-1">
                          <Swords className="w-3.5 h-3.5 text-amber-400/50" />
                          <span className="text-[8px] font-mono font-black text-amber-400/45 uppercase tracking-[0.2em]">
                            WHAT YOU DO WRONG WITH THE MARKET
                          </span>
                        </div>

                        {behavioralTraps.strategy.map((trap, i) => (
                          <div key={trap.id} className="rounded-xl border overflow-hidden"
                            style={{
                              backgroundColor: trap.severity === "critical" ? "rgba(239,68,68,0.02)" : "rgba(245,158,11,0.015)",
                              borderColor: trap.severity === "critical" ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.05)",
                            }}>
                            <div className="px-3.5 py-3 space-y-2.5">
                              {/* Trap header */}
                              <div className="flex items-center gap-2">
                                {trap.severity === "critical" ? (
                                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                    <Flame className="w-3.5 h-3.5 text-red-400/55" />
                                  </motion.div>
                                ) : (
                                  <CircleDot className="w-3.5 h-3.5 text-amber-400/40" />
                                )}
                                <span className="text-[10px] font-mono font-black uppercase tracking-wider"
                                  style={{ color: trap.severity === "critical" ? "rgba(239,68,68,0.65)" : "rgba(245,158,11,0.55)" }}>
                                  {trap.label}
                                </span>
                                {trap.severity === "critical" && (
                                  <motion.div className="w-1.5 h-1.5 rounded-full bg-red-400"
                                    animate={{ opacity: [1, 0.2, 1] }}
                                    transition={{ duration: 0.8, repeat: Infinity }} />
                                )}
                              </div>

                              {/* Description */}
                              <p className="text-[11px] text-white/45 leading-relaxed">
                                {trap.description}
                              </p>

                              {/* Trigger */}
                              <div className="space-y-1 pl-3.5 relative">
                                <motion.div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full"
                                  style={{ backgroundColor: "rgba(245,158,11,0.12)" }}
                                  animate={{ backgroundColor: ["rgba(245,158,11,0.08)", "rgba(245,158,11,0.22)", "rgba(245,158,11,0.08)"] }}
                                  transition={{ duration: 3, repeat: Infinity }} />
                                <div className="flex items-center gap-1.5">
                                  <Scan className="w-3 h-3 text-amber-400/30" />
                                  <span className="text-[7px] font-mono font-black text-amber-400/30 uppercase tracking-[0.12em]">TRIGGER</span>
                                </div>
                                <p className="text-[10px] text-white/35 leading-relaxed">{trap.trigger}</p>
                              </div>

                              {/* Consequence */}
                              <div className="space-y-1 pl-3.5 relative">
                                <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full bg-red-400/10" />
                                <div className="flex items-center gap-1.5">
                                  <Flame className="w-3 h-3 text-red-400/25" />
                                  <span className="text-[7px] font-mono font-black text-red-400/25 uppercase tracking-[0.12em]">CONSEQUENCE</span>
                                </div>
                                <p className="text-[10px] text-red-400/35 leading-relaxed">{trap.consequence}</p>
                              </div>

                              {/* Escape */}
                              <div className="px-3 py-2 rounded-lg bg-emerald-400/[0.015] border border-emerald-400/[0.06]">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <Route className="w-3 h-3 text-emerald-400/30" />
                                  <span className="text-[7px] font-mono font-black text-emerald-400/28 uppercase tracking-[0.12em]">ESCAPE ROUTE</span>
                                </div>
                                <p className="text-[10px] text-emerald-400/40 leading-relaxed">{trap.escape}</p>
                              </div>

                              {/* Connection to system */}
                              <div className="flex items-start gap-2 pt-1">
                                <div className="w-0.5 h-0.5 rounded-full bg-white/15 mt-1.5 shrink-0" />
                                <p className="text-[9px] text-white/20 leading-relaxed italic">{trap.connection}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ═══ PSYCHOLOGY TRAPS VIEW ═══ */}
                  {trapView === "psychology" && (
                    <motion.div
                      key="psychology-traps"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3">
                        <div className="h-px" style={{ background: "linear-gradient(to right, rgba(139,92,246,0.12), rgba(139,92,246,0.04), transparent)" }} />

                        <div className="flex items-center gap-2 py-1">
                          <Fingerprint className="w-3.5 h-3.5 text-violet-400/50" />
                          <span className="text-[8px] font-mono font-black text-violet-400/45 uppercase tracking-[0.2em]">
                            WHO YOU BECOME WHEN TRADING
                          </span>
                        </div>

                        {behavioralTraps.psychology.map((trap, i) => (
                          <div key={trap.id} className="rounded-xl border overflow-hidden"
                            style={{
                              backgroundColor: trap.severity === "critical" ? "rgba(239,68,68,0.02)" : "rgba(139,92,246,0.015)",
                              borderColor: trap.severity === "critical" ? "rgba(239,68,68,0.08)" : "rgba(139,92,246,0.05)",
                            }}>
                            <div className="px-3.5 py-3 space-y-2.5">
                              {/* Trap header */}
                              <div className="flex items-center gap-2">
                                {trap.severity === "critical" ? (
                                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                    <HeartPulse className="w-3.5 h-3.5 text-red-400/55" />
                                  </motion.div>
                                ) : (
                                  <Brain className="w-3.5 h-3.5 text-violet-400/40" />
                                )}
                                <span className="text-[10px] font-mono font-black uppercase tracking-wider"
                                  style={{ color: trap.severity === "critical" ? "rgba(239,68,68,0.65)" : "rgba(139,92,246,0.55)" }}>
                                  {trap.label}
                                </span>
                                {trap.severity === "critical" && (
                                  <motion.div className="w-1.5 h-1.5 rounded-full bg-red-400"
                                    animate={{ opacity: [1, 0.2, 1] }}
                                    transition={{ duration: 0.8, repeat: Infinity }} />
                                )}
                              </div>

                              {/* Description */}
                              <p className="text-[11px] text-white/45 leading-relaxed">
                                {trap.description}
                              </p>

                              {/* Trigger */}
                              <div className="space-y-1 pl-3.5 relative">
                                <motion.div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full"
                                  style={{ backgroundColor: "rgba(139,92,246,0.12)" }}
                                  animate={{ backgroundColor: ["rgba(139,92,246,0.08)", "rgba(139,92,246,0.22)", "rgba(139,92,246,0.08)"] }}
                                  transition={{ duration: 3.5, repeat: Infinity }} />
                                <div className="flex items-center gap-1.5">
                                  <Scan className="w-3 h-3 text-violet-400/30" />
                                  <span className="text-[7px] font-mono font-black text-violet-400/28 uppercase tracking-[0.12em]">TRIGGER</span>
                                </div>
                                <p className="text-[10px] text-white/35 leading-relaxed">{trap.trigger}</p>
                              </div>

                              {/* Consequence */}
                              <div className="space-y-1 pl-3.5 relative">
                                <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full bg-red-400/10" />
                                <div className="flex items-center gap-1.5">
                                  <Flame className="w-3 h-3 text-red-400/25" />
                                  <span className="text-[7px] font-mono font-black text-red-400/25 uppercase tracking-[0.12em]">CONSEQUENCE</span>
                                </div>
                                <p className="text-[10px] text-red-400/35 leading-relaxed">{trap.consequence}</p>
                              </div>

                              {/* Escape */}
                              <div className="px-3 py-2 rounded-lg bg-emerald-400/[0.015] border border-emerald-400/[0.06]">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <Route className="w-3 h-3 text-emerald-400/30" />
                                  <span className="text-[7px] font-mono font-black text-emerald-400/28 uppercase tracking-[0.12em]">ESCAPE ROUTE</span>
                                </div>
                                <p className="text-[10px] text-emerald-400/40 leading-relaxed">{trap.escape}</p>
                              </div>

                              {/* Connection to system */}
                              <div className="flex items-start gap-2 pt-1">
                                <div className="w-0.5 h-0.5 rounded-full bg-white/15 mt-1.5 shrink-0" />
                                <p className="text-[9px] text-white/20 leading-relaxed italic">{trap.connection}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ═══ ANALYZE CHARTS CTA -- Premium AI Interface ═══ */}
            <button className="w-full group" onClick={() => onNavigate("analyze")}>
              <motion.div
                className="relative rounded-2xl overflow-hidden transition-all duration-500"
                style={{
                  background: "linear-gradient(135deg, rgba(6,182,212,0.02) 0%, rgba(6,182,212,0.01) 50%, rgba(14,165,233,0.02) 100%)",
                  border: "1px solid rgba(6,182,212,0.06)",
                  boxShadow: "0 0 0 1px rgba(6,182,212,0.02) inset",
                }}
                whileHover={{
                  borderColor: "rgba(6,182,212,0.25)",
                  boxShadow: "0 0 30px rgba(6,182,212,0.06), 0 0 0 1px rgba(6,182,212,0.08) inset",
                }}
              >
                {/* Animated gradient mesh */}
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse 80% 50% at 80% 50%, rgba(6,182,212,0.04) 0%, transparent 60%)",
                  }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />

                {/* Cinematic sweep */}
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(105deg, transparent 30%, rgba(6,182,212,0.06) 50%, transparent 70%)" }}
                  animate={{ x: ["-150%", "250%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }} />

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-cyan-400/20 to-transparent" />
                  <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-cyan-400/20 to-transparent" />
                </div>
                <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
                  <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-cyan-400/20 to-transparent" />
                  <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-cyan-400/20 to-transparent" />
                </div>

                <div className="relative px-5 py-4 flex items-center gap-4">
                  {/* Icon container -- premium with glow */}
                  <div className="relative">
                    <motion.div
                      className="w-12 h-12 rounded-xl flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: "linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(6,182,212,0.04) 100%)",
                        border: "1px solid rgba(6,182,212,0.12)",
                      }}
                      whileHover={{ borderColor: "rgba(6,182,212,0.35)" }}
                    >
                      <motion.div className="absolute inset-0 pointer-events-none"
                        style={{ background: "radial-gradient(circle at center, rgba(6,182,212,0.1) 0%, transparent 70%)" }}
                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }} />
                      <BarChart3 className="w-5 h-5 text-cyan-400/60 group-hover:text-cyan-400 transition-colors duration-300 relative z-10" />
                    </motion.div>
                    {/* Pulse ring */}
                    <motion.div className="absolute -inset-1 rounded-xl pointer-events-none"
                      style={{ border: "1px solid rgba(6,182,212,0.15)" }}
                      animate={{ scale: [1, 1.15], opacity: [0.4, 0] }}
                      transition={{ duration: 2, repeat: Infinity }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="text-[13px] font-mono font-black tracking-tight text-cyan-400/70 group-hover:text-cyan-400 transition-colors duration-300">
                        Analyze Charts
                      </span>
                      <motion.div
                        className="flex items-center gap-1 px-2 py-0.5 rounded-md relative overflow-hidden"
                        style={{
                          background: "linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(6,182,212,0.04) 100%)",
                          border: "1px solid rgba(6,182,212,0.1)",
                        }}
                        animate={{ borderColor: ["rgba(6,182,212,0.1)", "rgba(6,182,212,0.25)", "rgba(6,182,212,0.1)"] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      >
                        <motion.div className="w-1 h-1 rounded-full bg-cyan-400"
                          animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1, 0.8] }}
                          transition={{ duration: 1.5, repeat: Infinity }} />
                        <span className="text-[8px] font-mono font-black text-cyan-400/60 tracking-wider">AI</span>
                      </motion.div>
                    </div>
                    <p className="text-[10px] text-white/25 group-hover:text-white/45 leading-relaxed transition-colors duration-300">
                      Deep AI analysis of your chart setup, levels, and trade ideas
                    </p>
                  </div>

                  {/* Arrow with glow */}
                  <motion.div
                    className="relative w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(6,182,212,0.04)", border: "1px solid rgba(6,182,212,0.08)" }}
                    whileHover={{ background: "rgba(6,182,212,0.08)", borderColor: "rgba(6,182,212,0.2)" }}
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-4 h-4 text-cyan-400/30 group-hover:text-cyan-400/80 transition-colors duration-300" />
                  </motion.div>
                </div>

                {/* Bottom accent line */}
                <motion.div className="absolute bottom-0 left-4 right-4 h-px pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.15), transparent)" }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }} />
              </motion.div>
            </button>

            {/* Day footer removed -- day intel is now the banner above */}
          </div>

          {/* Bottom edge with gradient */}
          <div className="h-px"
            style={{ background: `linear-gradient(to right, transparent, ${session.killzone ? `${session.phaseColor}15` : "rgba(255,255,255,0.03)"}, transparent)` }} />
        </div>
      </div>

      {/* ═══ INLINE STATUS -- breathing directive strip ═══ */}
      <div className="relative px-4 py-2.5 flex items-center gap-2.5">
        <motion.div className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0, 0.008, 0] }}
          transition={{ duration: 5, repeat: Infinity }}>
          <div className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full"
            style={{ backgroundColor: dc.color, filter: "blur(20px)" }} />
        </motion.div>
        <motion.div className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
          style={{ backgroundColor: `${dc.color}06`, border: `1px solid ${dc.color}10` }}
          animate={{ borderColor: [`${dc.color}10`, `${dc.color}35`, `${dc.color}10`] }}
          transition={{ duration: 3.5, repeat: Infinity }}>
          <motion.div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dc.color }}
            animate={isBad ? { scale: [1, 1.6, 1], opacity: [1, 0.15, 1] } : { scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: isBad ? 0.5 : 3, repeat: Infinity }} />
          <span className="text-[9px] font-mono font-black uppercase tracking-wider" style={{ color: dc.color }}>
            {dc.label}
          </span>
        </motion.div>
        <span className="text-[9px] font-mono font-bold" style={{ color: `${sc.color}70` }}>{sc.label}</span>
        <div className="w-0.5 h-0.5 rounded-full bg-white/10" />
        <span className="text-[9px] font-mono font-bold tabular-nums" style={{ color: `${dc.color}45` }}>
          {state.readinessScore} {state.readinessLabel}
        </span>
        {state.activeMissionCount > 0 && (
          <>
            <div className="w-0.5 h-0.5 rounded-full bg-white/10" />
            <span className="text-[9px] font-mono font-bold text-amber-400/40">{state.activeMissionCount} active</span>
          </>
        )}
      </div>

      {/* ═══ PRIMARY THREAT -- Premium Cinematic Danger Field ═══ */}
      <div className="relative px-4 pb-3">
        <button className="w-full text-left" onClick={() => setThreatOpen(!threatOpen)}>
          <motion.div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: threatOpen
                ? `linear-gradient(135deg, ${dc.color}06 0%, ${dc.color}03 50%, ${dc.color}04 100%)`
                : `linear-gradient(135deg, ${dc.color}03 0%, ${dc.color}01 100%)`,
              border: `1px solid ${threatOpen ? `${dc.color}20` : `${dc.color}08`}`,
              boxShadow: threatOpen ? `0 0 40px ${dc.color}08, inset 0 0 30px ${dc.color}02` : "none",
            }}
            transition={{ duration: 0.5 }}
          >
            {/* Dynamic threat aurora */}
            <motion.div className="absolute inset-0 pointer-events-none"
              animate={{ opacity: isBad ? [0.03, 0.1, 0.03] : [0.01, 0.03, 0.01] }}
              transition={{ duration: isBad ? 2 : 6, repeat: Infinity, ease: "easeInOut" }}>
              <motion.div className="absolute w-40 h-40 rounded-full"
                style={{ backgroundColor: dc.color, filter: "blur(50px)", right: "-5%", top: "-30%" }}
                animate={{ x: [0, -20, 0], y: [0, 10, 0] }}
                transition={{ duration: 10, repeat: Infinity }} />
              <motion.div className="absolute w-32 h-32 rounded-full"
                style={{ backgroundColor: dc.color, filter: "blur(40px)", left: "10%", bottom: "-20%" }}
                animate={{ x: [0, 15, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, delay: 1 }} />
            </motion.div>

            {/* Edge accents */}
            <div className="absolute top-0 left-0 w-12 h-12 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(to right, ${dc.color}25, transparent)` }} />
              <div className="absolute top-0 left-0 h-full w-px" style={{ background: `linear-gradient(to bottom, ${dc.color}25, transparent)` }} />
            </div>
            <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none">
              <div className="absolute bottom-0 right-0 w-full h-px" style={{ background: `linear-gradient(to left, ${dc.color}15, transparent)` }} />
              <div className="absolute bottom-0 right-0 h-full w-px" style={{ background: `linear-gradient(to top, ${dc.color}15, transparent)` }} />
            </div>

            {/* Collapsed state */}
            <div className="relative px-5 py-4">
              <div className="flex items-center gap-4">
                {/* Threat icon with pulse rings */}
                <div className="relative">
                  <motion.div
                    className="w-10 h-10 rounded-xl flex items-center justify-center relative"
                    style={{
                      background: `linear-gradient(135deg, ${dc.color}12 0%, ${dc.color}06 100%)`,
                      border: `1px solid ${dc.color}18`,
                    }}
                    animate={isBad ? { borderColor: [`${dc.color}18`, `${dc.color}45`, `${dc.color}18`] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <motion.div
                      animate={isBad ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                      transition={{ duration: 1.2, repeat: Infinity }}>
                      <Zap className="w-5 h-5" style={{ color: `${dc.color}80` }} />
                    </motion.div>
                  </motion.div>
                  {isBad && (
                    <>
                      <motion.div className="absolute -inset-1 rounded-xl pointer-events-none"
                        style={{ border: `1px solid ${dc.color}` }}
                        animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }} />
                      <motion.div className="absolute -inset-2 rounded-xl pointer-events-none"
                        style={{ border: `1px solid ${dc.color}` }}
                        animate={{ scale: [1, 1.5], opacity: [0.15, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} />
                    </>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="text-[10px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${dc.color}70` }}>
                      PRIMARY THREAT
                    </span>
                    {isBad && (
                      <motion.div
                        className="flex items-center gap-1.5 px-2 py-0.5 rounded-md"
                        style={{ background: `${dc.color}15`, border: `1px solid ${dc.color}25` }}
                        animate={{ borderColor: [`${dc.color}25`, `${dc.color}50`, `${dc.color}25`] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <motion.div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dc.color }}
                          animate={{ opacity: [1, 0.2, 1], scale: [1, 1.3, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity }} />
                        <span className="text-[7px] font-mono font-black uppercase tracking-wider" style={{ color: dc.color }}>ACTIVE</span>
                      </motion.div>
                    )}
                  </div>
                  <p className="text-[12px] text-white/55 leading-snug font-medium line-clamp-1">
                    {state.dominantRisk}
                  </p>
                </div>

                <motion.div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${dc.color}06`, border: `1px solid ${dc.color}10` }}
                  animate={{ rotate: threatOpen ? 180 : 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ChevronDown className="w-4 h-4" style={{ color: `${dc.color}40` }} />
                </motion.div>
              </div>
            </div>

            {/* Expanded detail panel */}
            <AnimatePresence>
              {threatOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-4">
                    {/* Separator */}
                    <motion.div className="h-px"
                      style={{ background: `linear-gradient(to right, transparent, ${dc.color}20, ${dc.color}10, transparent)` }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }} />

                    {/* Main threat statement */}
                    <div className="relative py-3 px-4 rounded-xl" style={{ background: `${dc.color}04`, border: `1px solid ${dc.color}08` }}>
                      <p className="text-[14px] text-white/70 leading-relaxed font-semibold">
                        {state.dominantRisk}
                      </p>
                    </div>

                    {/* HOW THIS SHOWS UP */}
                    <div className="relative pl-5">
                      <motion.div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
                        style={{ background: `linear-gradient(to bottom, ${dc.color}40, ${dc.color}15)` }}
                        animate={{ background: [`linear-gradient(to bottom, ${dc.color}30, ${dc.color}10)`, `linear-gradient(to bottom, ${dc.color}50, ${dc.color}25)`, `linear-gradient(to bottom, ${dc.color}30, ${dc.color}10)`] }}
                        transition={{ duration: 3, repeat: Infinity }} />
                      <span className="text-[8px] font-mono font-black uppercase tracking-[0.2em] block mb-2" style={{ color: `${dc.color}45` }}>
                        HOW THIS SHOWS UP
                      </span>
                      <p className="text-[12px] text-white/45 leading-relaxed">
                        {threatIntel.manifestation}
                      </p>
                    </div>

                    {/* THE PATTERN */}
                    <div className="relative pl-5">
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-white/[0.06]" />
                      <span className="text-[8px] font-mono font-black text-white/18 uppercase tracking-[0.2em] block mb-2">THE PATTERN</span>
                      <p className="text-[12px] text-white/35 leading-relaxed italic">
                        {threatIntel.pattern}
                      </p>
                    </div>

                    {/* COST IF IGNORED -- premium warning box */}
                    <motion.div
                      className="relative rounded-xl overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${dc.color}06 0%, ${dc.color}03 100%)`,
                        border: `1px solid ${dc.color}15`,
                      }}
                      animate={{ borderColor: [`${dc.color}12`, `${dc.color}25`, `${dc.color}12`] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <motion.div className="absolute inset-0 pointer-events-none"
                        animate={{ opacity: [0, 0.03, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}>
                        <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full"
                          style={{ backgroundColor: dc.color, filter: "blur(40px)" }} />
                      </motion.div>
                      <div className="relative px-4 py-3">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-3.5 h-3.5" style={{ color: `${dc.color}50` }} />
                          <span className="text-[8px] font-mono font-black uppercase tracking-[0.2em]" style={{ color: `${dc.color}40` }}>
                            COST IF IGNORED
                          </span>
                        </div>
                        <p className="text-[12px] leading-relaxed font-medium" style={{ color: `${dc.color}65` }}>
                          {threatIntel.rCost}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </button>
      </div>

      {/* ═══ NEXT ACTION -- Premium Emerald Directive Field ═══ */}
      <div className="relative px-4 pb-4">
        <button className="w-full text-left" onClick={() => setActionOpen(!actionOpen)}>
          <motion.div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: actionOpen
                ? "linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(16,185,129,0.02) 50%, rgba(16,185,129,0.04) 100%)"
                : "linear-gradient(135deg, rgba(16,185,129,0.02) 0%, rgba(16,185,129,0.008) 100%)",
              border: `1px solid ${actionOpen ? "rgba(16,185,129,0.22)" : "rgba(16,185,129,0.08)"}`,
              boxShadow: actionOpen ? "0 0 40px rgba(16,185,129,0.06), inset 0 0 30px rgba(16,185,129,0.015)" : "none",
            }}
            transition={{ duration: 0.5 }}
          >
            {/* Dynamic emerald aurora */}
            <motion.div className="absolute inset-0 pointer-events-none"
              animate={{ opacity: [0.01, 0.04, 0.01] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
              <motion.div className="absolute w-40 h-40 rounded-full"
                style={{ backgroundColor: "#10b981", filter: "blur(50px)", left: "-5%", bottom: "-30%" }}
                animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
                transition={{ duration: 10, repeat: Infinity }} />
              <motion.div className="absolute w-32 h-32 rounded-full"
                style={{ backgroundColor: "#34d399", filter: "blur(40px)", right: "10%", top: "-20%" }}
                animate={{ x: [0, -15, 0], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 8, repeat: Infinity, delay: 1 }} />
            </motion.div>

            {/* Edge accents */}
            <div className="absolute top-0 left-0 w-12 h-12 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-emerald-400/25 to-transparent" />
              <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-emerald-400/25 to-transparent" />
            </div>
            <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none">
              <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-emerald-400/15 to-transparent" />
              <div className="absolute bottom-0 right-0 h-full w-px bg-gradient-to-t from-emerald-400/15 to-transparent" />
            </div>

            {/* Collapsed state */}
            <div className="relative px-5 py-4">
              <div className="flex items-center gap-4">
                {/* Action icon with forward momentum */}
                <div className="relative">
                  <motion.div
                    className="w-10 h-10 rounded-xl flex items-center justify-center relative"
                    style={{
                      background: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.06) 100%)",
                      border: "1px solid rgba(16,185,129,0.18)",
                    }}
                  >
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                      <ArrowRight className="w-5 h-5 text-emerald-400/70" />
                    </motion.div>
                  </motion.div>
                  <motion.div className="absolute -inset-1 rounded-xl pointer-events-none"
                    style={{ border: "1px solid rgba(16,185,129,0.15)" }}
                    animate={{ scale: [1, 1.2], opacity: [0.3, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="text-[10px] font-mono font-black uppercase tracking-[0.15em] text-emerald-400/65">
                      NEXT ACTION
                    </span>
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                      animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }} />
                  </div>
                  <p className="text-[12px] text-white/55 leading-snug font-medium line-clamp-1">
                    {state.primaryCorrection}
                  </p>
                </div>

                <motion.div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.1)" }}
                  animate={{ rotate: actionOpen ? 180 : 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ChevronDown className="w-4 h-4 text-emerald-400/40" />
                </motion.div>
              </div>
            </div>

            {/* Expanded detail panel */}
            <AnimatePresence>
              {actionOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-4">
                    {/* Separator */}
                    <motion.div className="h-px"
                      style={{ background: "linear-gradient(to right, transparent, rgba(16,185,129,0.2), rgba(16,185,129,0.1), transparent)" }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }} />

                    {/* Main action statement */}
                    <div className="relative py-3 px-4 rounded-xl" style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.1)" }}>
                      <p className="text-[14px] text-white/70 leading-relaxed font-semibold">
                        {state.primaryCorrection}
                      </p>
                    </div>

                    {/* EXACTLY WHAT TO DO */}
                    <div className="relative pl-5">
                      <motion.div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
                        style={{ background: "linear-gradient(to bottom, rgba(16,185,129,0.45), rgba(16,185,129,0.15))" }}
                        animate={{ background: ["linear-gradient(to bottom, rgba(16,185,129,0.35), rgba(16,185,129,0.1))", "linear-gradient(to bottom, rgba(16,185,129,0.55), rgba(16,185,129,0.25))", "linear-gradient(to bottom, rgba(16,185,129,0.35), rgba(16,185,129,0.1))"] }}
                        transition={{ duration: 3.5, repeat: Infinity }} />
                      <span className="text-[8px] font-mono font-black uppercase tracking-[0.2em] block mb-2 text-emerald-400/45">
                        EXACTLY WHAT TO DO
                      </span>
                      <p className="text-[12px] text-white/45 leading-relaxed">
                        {actionIntel.immediateAction}
                      </p>
                    </div>

                    {/* IF YOU SKIP THIS */}
                    <div className="relative pl-5">
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-white/[0.06]" />
                      <span className="text-[8px] font-mono font-black text-white/18 uppercase tracking-[0.2em] block mb-2">IF YOU SKIP THIS</span>
                      <p className="text-[12px] text-white/35 leading-relaxed italic">
                        {actionIntel.ifYouIgnore}
                      </p>
                    </div>

                    {/* CHECK-IN PROTOCOL -- premium action box */}
                    <motion.div
                      className="relative rounded-xl overflow-hidden"
                      style={{
                        background: "linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(16,185,129,0.025) 100%)",
                        border: "1px solid rgba(16,185,129,0.15)",
                      }}
                      animate={{ borderColor: ["rgba(16,185,129,0.12)", "rgba(16,185,129,0.28)", "rgba(16,185,129,0.12)"] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <motion.div className="absolute inset-0 pointer-events-none"
                        animate={{ opacity: [0, 0.03, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}>
                        <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full"
                          style={{ backgroundColor: "#10b981", filter: "blur(40px)" }} />
                      </motion.div>
                      <div className="relative px-4 py-3">
                        <div className="flex items-center gap-2 mb-2">
                          <motion.div
                            className="w-5 h-5 rounded-md flex items-center justify-center"
                            style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}
                            animate={{ borderColor: ["rgba(16,185,129,0.2)", "rgba(16,185,129,0.4)", "rgba(16,185,129,0.2)"] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Target className="w-3 h-3 text-emerald-400/60" />
                          </motion.div>
                          <span className="text-[8px] font-mono font-black uppercase tracking-[0.2em] text-emerald-400/45">
                            CHECK-IN PROTOCOL
                          </span>
                        </div>
                        <p className="text-[12px] leading-relaxed font-medium text-emerald-400/55">
                          {actionIntel.checkIn}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// INTELLIGENCE QUESTION CARD -- AI asks, user responds
// The question is FROM the AI. The user types their answer.
// The answer is then sent to AI for reflection and feedback.
// ═══════════════════════════════════════════════════════════════�����═══
function QuestionCard({ question, index, onRespond }: {
  question: IntelligenceQuestion; index: number
  onRespond: (question: string, answer: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [answer, setAnswer] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [selectedExample, setSelectedExample] = useState<number | null>(null)
  const srcConfig = QUESTION_SOURCE_CONFIG[question.source]
  const prioConfig = QUESTION_PRIORITY_CONFIG[question.priority]
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    const finalAnswer = answer.trim()
    if (!finalAnswer) return
    onRespond(question.question, finalAnswer)
    setSubmitted(true)
  }

  const handleExampleClick = (ex: string, idx: number) => {
    setAnswer(ex)
    setSelectedExample(idx)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  const connColor = question.connection === "strategy" ? "#06b6d4" : question.connection === "psychology" ? "#8b5cf6" : "#f59e0b"
  const connLabel = question.connection === "strategy" ? "STRATEGY" : question.connection === "psychology" ? "PSYCHOLOGY" : "STR + PSY"

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div className="rounded-xl border relative overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: isOpen ? `${srcConfig.color}04` : submitted ? "rgba(16,185,129,0.02)" : prioConfig.bgColor,
          borderColor: isOpen ? `${srcConfig.color}20` : submitted ? "rgba(16,185,129,0.12)" : `${srcConfig.color}08`,
        }}>

        {/* Priority accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full transition-colors"
          style={{ backgroundColor: submitted ? "#10b981" : prioConfig.color }} />

        {/* Ambient glow when open */}
        <AnimatePresence>
          {isOpen && (
            <motion.div className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
                style={{ backgroundColor: srcConfig.color, filter: "blur(40px)", opacity: 0.03 }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Question header (always visible) ── */}
        <button
          onClick={() => { if (!submitted) setIsOpen(!isOpen) }}
          className="w-full text-left relative px-3.5 py-3 pl-4"
        >
          {/* Source + connection badges */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[7px] font-mono font-black tracking-wider px-1.5 py-0.5 rounded"
              style={{ color: srcConfig.color, backgroundColor: `${srcConfig.color}10` }}>
              {srcConfig.label}
            </span>
            <span className="text-[6px] font-mono font-black tracking-wider px-1 py-0.5 rounded"
              style={{ color: connColor, backgroundColor: `${connColor}08` }}>
              {connLabel}
            </span>
            {question.priority === "critical" && (
              <motion.div className="flex items-center gap-0.5"
                animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
                <AlertTriangle className="w-2.5 h-2.5 text-red-400" />
              </motion.div>
            )}
            {submitted && (
              <span className="text-[7px] font-mono font-black tracking-wider text-emerald-400/70 ml-auto">ANSWERED</span>
            )}
            {!submitted && (
              <motion.div className="ml-auto" animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-3 h-3 text-white/15" />
              </motion.div>
            )}
          </div>

          {/* Question text */}
          <span className={`text-[11px] font-semibold leading-snug block transition-colors ${submitted ? "text-white/40" : "text-white/70 hover:text-white/90"}`}>
            {question.question}
          </span>

          {/* Note */}
          <p className="text-[9px] font-mono text-white/20 mt-1 leading-relaxed">
            {question.note}
          </p>
        </button>

        {/* ���─ Answer area (expanded) ── */}
        <AnimatePresence>
          {isOpen && !submitted && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-3.5 pb-3 pl-4 space-y-2.5">

                {/* Example answers -- clickable suggestions */}
                {question.exampleAnswers && question.exampleAnswers.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono font-bold text-white/15 uppercase tracking-wider">Example responses</span>
                    <div className="space-y-1">
                      {question.exampleAnswers.map((ex, ei) => (
                        <button key={ei}
                          onClick={() => handleExampleClick(ex, ei)}
                          className={`w-full text-left px-2.5 py-2 rounded-lg border text-[10px] leading-snug transition-all ${
                            selectedExample === ei
                              ? "border-white/[0.15] bg-white/[0.04] text-white/60"
                              : "border-white/[0.04] bg-white/[0.01] text-white/30 hover:border-white/[0.1] hover:bg-white/[0.03] hover:text-white/50"
                          }`}>
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* User response textarea */}
                <div className="space-y-1.5">
                  <span className="text-[8px] font-mono font-bold text-white/15 uppercase tracking-wider">Your honest answer</span>
                  <textarea
                    ref={textareaRef}
                    value={answer}
                    onChange={(e) => { setAnswer(e.target.value); setSelectedExample(null) }}
                    placeholder="Type your answer here... Be honest with yourself."
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2.5 text-[11px] text-white/80 placeholder:text-white/12 resize-none focus:outline-none focus:border-white/[0.18] transition-all font-sans leading-relaxed"
                    rows={3}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && answer.trim()) { e.preventDefault(); handleSubmit() } }}
                  />
                </div>

                {/* Submit + navigate actions */}
                <div className="flex items-center gap-2">
                  <button onClick={handleSubmit} disabled={!answer.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold text-white/70 bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] hover:text-white/90 transition-all disabled:opacity-20 disabled:cursor-not-allowed">
                    <Send className="w-3 h-3" /> Submit reflection
                  </button>
                  {question.navigateTo && (
                    <button onClick={() => {
                      const tab = question.navigateTo!
                      window.dispatchEvent(new CustomEvent("copilot:switch-tab", { detail: { tab } }))
                    }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[8px] font-mono font-bold tracking-wider transition-all border"
                      style={{ color: `${connColor}60`, borderColor: `${connColor}10`, backgroundColor: `${connColor}04` }}>
                      <ArrowRight className="w-2.5 h-2.5" /> View in {question.navigateTo === "strategy" ? "STR" : "PSY"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Submitted confirmation ── */}
        {submitted && (
          <div className="px-3.5 pb-2.5 pl-4">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-400/50">
              <Shield className="w-3 h-3" />
              <span>Your response was sent to Copilot for reflection feedback</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// MESSAGE TYPE
// ═══════════════════════════════════════════════════════════════════
interface Message {
  id: string; role: "user" | "system"; content: string
  timestamp: number; type?: "query" | "insight" | "warning" | "guidance"
}

// ═══════════════════════════════════════════════════════════════════
// MAIN CONSOLE -- Activity OS
// ═══════════════════════════════════════════════════════════════════
export function CopilotActivityConsole() {
  const { instrument } = useInstrument()
  const { sessionOHLC } = useAnalysis()
  const selectedConfluences = useConfluenceStore((s) => s.selectedConfluences)

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>("system-intelligence")
  const [showQuestions, setShowQuestions] = useState(true)
  const [copilotAIOpen, setCopilotAIOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // ═══ DEMO OVERRIDES ═══
  const [demoOverrides, setDemoOverrides] = useState<DemoOverrides>({
    dayOverride: null,
    sessionOverride: null,
    progressOverride: null,
    systemStateOverride: null,
  })

  const now = Date.now()
  const realSessionPhase = useMemo(() => getSessionPhase(now), [Math.floor(now / 60000)])

  // Apply session/progress overrides
  const sessionPhase = useMemo(
    () => buildOverriddenSession(demoOverrides.sessionOverride, demoOverrides.progressOverride, realSessionPhase),
    [demoOverrides.sessionOverride, demoOverrides.progressOverride, realSessionPhase],
  )

  const sessionBias = useMemo(() => getSessionBias(sessionOHLC), [sessionOHLC])

  // Apply day override
  const dayContext = useMemo(() => getDayContext(demoOverrides.dayOverride), [Math.floor(now / 3600000), demoOverrides.dayOverride])

  const orderInputs = useMemo(() => buildOrderLayerInputs(sessionPhase), [sessionPhase])

  // Apply system state override by manipulating psychology inputs
  const orderState = useMemo(() => {
    if (demoOverrides.systemStateOverride) {
      // Build modified inputs that force the desired system state
      const modPsych = { ...orderInputs.psychology }
      const modStrategy = { ...orderInputs.strategy }
      switch (demoOverrides.systemStateOverride) {
        case "critical":
          modPsych.stabilityIndex = 20
          modPsych.stabilityLevel = "critical"
          modPsych.disciplineScore = 25
          modStrategy.overallDiscipline = 20
          break
        case "reactive":
          modPsych.stabilityIndex = 40
          modPsych.stabilityLevel = "critical"
          modPsych.disciplineScore = 42
          modStrategy.overallDiscipline = 38
          break
        case "guarded":
          modPsych.stabilityIndex = 55
          modPsych.stabilityLevel = "elevated"
          modPsych.disciplineScore = 58
          modStrategy.overallDiscipline = 55
          break
        case "stable":
          modPsych.stabilityIndex = 85
          modPsych.stabilityLevel = "normal"
          modPsych.disciplineScore = 88
          modStrategy.overallDiscipline = 90
          break
      }
      return deriveOrderLayerState(modStrategy, modPsych, orderInputs.activity)
    }
    return deriveOrderLayerState(orderInputs.strategy, orderInputs.psychology, orderInputs.activity)
  }, [orderInputs, demoOverrides.systemStateOverride])

  const sessionCtx: SessionContext = useMemo(() => ({
    sessionName: sessionPhase.name, killzone: sessionPhase.killzone,
    kzProgress: sessionPhase.kzProgress, remaining: sessionPhase.remaining,
    subPhase: sessionPhase.subPhase, activeSymbol: instrument.symbol,
    timeframe: instrument.timeframe,
  }), [sessionPhase, instrument])

  const intelligenceQuestions = useMemo(
    () => generateIntelligenceQuestions(orderState, sessionCtx, orderInputs.psychology, orderInputs.strategy),
    [orderState, sessionCtx, orderInputs]
  )

  const categories = useMemo(
    () => generatePromptCategories(instrument.symbol, instrument.timeframe, sessionPhase, selectedConfluences, sessionOHLC, sessionBias, dayContext, orderState),
    [instrument.symbol, instrument.timeframe, sessionPhase, selectedConfluences, sessionOHLC, sessionBias, dayContext, orderState],
  )

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const handleNavigate = useCallback((tab: string) => {
    window.dispatchEvent(new CustomEvent("copilot:switch-tab", { detail: { tab } }))
  }, [])

  const handleSend = useCallback(async (text?: string) => {
    const t = (text ?? input).trim()
    if (!t || isLoading) return
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", content: t, timestamp: Date.now(), type: "query" }])
    if (!text) setInput("")
    setIsLoading(true)
    try {
      const response = await fetch("/api/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: t,
          context: {
            threadType: "activity", symbol: instrument.symbol, timeframe: instrument.timeframe,
            assetClass: instrument.assetClass, session: sessionPhase.name, phase: sessionPhase.phase,
            subPhase: sessionPhase.subPhase, killzone: sessionPhase.killzone, kzProgress: sessionPhase.kzProgress,
            kzRemaining: sessionPhase.remaining, confluences: selectedConfluences, sessionOHLC,
            bias: sessionBias.label, dayOfWeek: dayContext.day, dayQuality: dayContext.quality,
            orderLayer: {
              readiness: orderState.readinessScore, readinessLabel: orderState.readinessLabel,
              directive: orderState.directive, systemState: orderState.systemState,
              dominantRisk: orderState.dominantRisk, activeMissions: orderState.activeMissionCount,
              gateCount: orderState.gates.length, dangerCount: orderState.dangerSignals.length,
            },
          },
        }),
      })
      const data = await response.json()
      setMessages((prev) => [...prev, { id: `s-${Date.now()}`, role: "system", content: data.a || data.messages?.[0] || "Processing...", timestamp: Date.now(), type: "insight" }])
    } catch {
      setMessages((prev) => [...prev, { id: `e-${Date.now()}`, role: "system", content: "Connection interrupted. Retry.", timestamp: Date.now(), type: "warning" }])
    } finally { setIsLoading(false) }
  }, [input, isLoading, instrument, sessionPhase, selectedConfluences, sessionOHLC, sessionBias, dayContext, orderState])

  const handleRespond = useCallback((question: string, answer: string) => {
    const prompt = `I was asked this self-reflection question by my trading system:\n\nQuestion: "${question}"\n\nMy honest answer: "${answer}"\n\nBased on my answer, give me direct feedback:\n1. Is my answer honest or am I rationalizing?\n2. What does my answer reveal about my current psychological state?\n3. Based on this, should I trade right now or step away?\n4. One specific action I should take in the next 10 minutes.\n\nBe direct. Don't sugarcoat. I need truth, not comfort.`
    handleSend(prompt)
  }, [handleSend])

  const handleGenerateMore = useCallback(() => {
    const prompt = `I need you to push me deeper. My current state: readiness ${orderState.readinessScore}/100, directive ${DIRECTIVE_CONFIG[orderState.directive].label}, ${sessionPhase.name} session on ${instrument.symbol} ${instrument.timeframe}.

Generate 5 hard-hitting self-reflection questions I haven't considered yet. For each:
- The question itself (make it uncomfortable -- the kind that forces honesty)
- WHY this question matters right now based on my specific state
- What a BAD answer looks like (so I can catch myself rationalizing)
- What a GOOD answer looks like (so I know what self-awareness sounds like)

Don't give me surface-level questions. Go deep into my psychology, my patterns, my blind spots. Push me where I don't want to look.`
    handleSend(prompt)
  }, [handleSend, orderState, sessionPhase, instrument])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleBackToPrompts = () => { setMessages([]); setShowQuestions(true); setExpandedCategory("system-intelligence") }

  const priorityColor = (p: string) => {
    switch (p) { case "critical": return "bg-red-400"; case "high": return "bg-white/60"; case "medium": return "bg-white/30"; default: return "bg-white/15" }
  }

  const connectionBadge = (conn?: string) => {
    if (!conn) return null
    const cfg = conn === "strategy" ? { label: "STR", color: "#06b6d4" } : conn === "psychology" ? { label: "PSY", color: "#8b5cf6" } : conn === "both" ? { label: "STR+PSY", color: "#f59e0b" } : null
    if (!cfg) return null
    return (
      <span className="text-[6px] font-mono font-black tracking-wider px-1 py-0.5 rounded"
        style={{ color: cfg.color, backgroundColor: `${cfg.color}10` }}>
        {cfg.label}
      </span>
    )
  }

  return (
    <div className="relative flex flex-col h-full bg-transparent">

      {/* ═══ SCROLLABLE CONTENT ═══ */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 scrollbar-terminal">
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            <motion.div key="prompts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="pb-2">

              {/* ═══ GUIDE + DEMO CONTROLS ═══ */}
              <ActivityGuideAndDemo overrides={demoOverrides} onOverridesChange={setDemoOverrides} />

              {/* ═══ ACTIVITY COMMAND CENTER ═══ */}
              <ActivityCommandCenter state={orderState} session={sessionPhase} bias={sessionBias} symbol={instrument.symbol} timeframe={instrument.timeframe} dayContext={dayContext} onNavigate={handleNavigate} demoOverrides={demoOverrides} onOverridesChange={setDemoOverrides} />

            </motion.div>
          ) : (
            <motion.div key="empty" />
          )}
        </AnimatePresence>
      </div>

      {/* AI functionality moved to dedicated CopilotAIView via vertical nav strip */}
      <AnimatePresence>
        {false && (
          <motion.div
                className="absolute inset-0 z-50 flex flex-col bg-white/[0.02] backdrop-blur-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* AI Panel Header */}
            <div className="flex-shrink-0 px-4 py-3 border-b border-white/[0.06] relative overflow-hidden">
              {/* Ambient background */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.04), rgba(59,130,246,0.02), transparent)" }} />
              <motion.div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 60% 100% at 80% 0%, rgba(139,92,246,0.06), transparent)" }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 6, repeat: Infinity }} />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => { setCopilotAIOpen(false); setMessages([]) }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.04] transition-all"
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-white/40" />
                  </motion.button>
                  <div>
                    <div className="flex items-center gap-2">
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-purple-400"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }} />
                      <span className="text-[12px] font-mono font-black text-white/60 uppercase tracking-wider">Copilot AI</span>
                    </div>
                    <span className="text-[8px] font-mono text-white/20 ml-3.5">
                      1-on-1 intelligence session \u2022 {sessionPhase.name}
                    </span>
                  </div>
                </div>

                <button onClick={handleGenerateMore} disabled={isLoading}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.06] hover:border-purple-500/20 hover:bg-purple-500/[0.04] transition-all group/more disabled:opacity-30">
                  <Sparkles className="w-3 h-3 text-white/20 group-hover/more:text-purple-400/60 transition-colors" />
                  <span className="text-[9px] font-mono font-bold text-white/25 group-hover/more:text-white/45 transition-colors uppercase tracking-wider">
                    Generate
                  </span>
                </button>
              </div>
            </div>

            {/* AI Panel Scrollable Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 scrollbar-terminal">
              <AnimatePresence mode="wait">
                {messages.length === 0 ? (
                  <motion.div key="ai-prompts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="pb-2">

                    {/* ═══ INTELLIGENCE QUESTIONS ═══ */}
                    {intelligenceQuestions.length > 0 && (
                      <div className="px-3 pt-3">
                        <button onClick={() => setShowQuestions(!showQuestions)}
                          className="w-full flex items-center justify-between px-1 py-1.5 group">
                          <div className="flex items-center gap-2">
                            <motion.div animate={{ rotate: showQuestions ? 0 : -90 }} transition={{ duration: 0.15 }}>
                              <ChevronDown className="w-3 h-3 text-white/20" />
                            </motion.div>
                            <Sparkles className="w-3 h-3 text-amber-400/50" />
                            <span className="text-[10px] font-mono font-black text-white/35 uppercase tracking-[0.15em] group-hover:text-white/50 transition-colors">
                              AI Questions
                            </span>
                            <span className="text-[8px] font-mono text-white/15 px-1.5 py-0.5 rounded bg-white/[0.03]">
                              {intelligenceQuestions.filter(q => q.priority === "critical").length} critical
                            </span>
                          </div>
                          <span className="text-[8px] font-mono text-white/15">{intelligenceQuestions.length}</span>
                        </button>

                        <AnimatePresence>
                          {showQuestions && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                              <div className="space-y-1.5 pt-1 pb-2">
                                {intelligenceQuestions.map((q, i) => (
                                  <QuestionCard key={q.id} question={q} index={i} onRespond={handleRespond} />
                                ))}
                                <motion.button onClick={handleGenerateMore} disabled={isLoading}
                                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.02] transition-all group/gen disabled:opacity-30"
                                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: intelligenceQuestions.length * 0.06 + 0.1 }}
                                  whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}>
                                  <Sparkles className="w-3 h-3 text-white/20 group-hover/gen:text-amber-400/50 transition-colors" />
                                  <span className="text-[10px] font-mono font-bold text-white/25 group-hover/gen:text-white/50 transition-colors uppercase tracking-wider">
                                    Push me deeper
                                  </span>
                                  <ArrowRight className="w-3 h-3 text-white/10 group-hover/gen:text-white/30 transition-colors" />
                                </motion.button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* ═══ PROMPT CATEGORIES ═══ */}
                    {categories.map((category) => {
                      const catExpanded = expandedCategory === category.id
                      const CatIcon = category.icon
                      const hasCritical = category.prompts.some((p) => p.priority === "critical")

                      return (
                        <div key={category.id} className="border-b border-white/[0.03] last:border-b-0">
                          <button
                            onClick={() => setExpandedCategory(catExpanded ? null : category.id)}
                            className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-white/[0.02] transition-colors group"
                          >
                            <div className="flex items-center gap-2">
                              <CatIcon className="w-3 h-3 opacity-50 group-hover:opacity-90 transition-opacity" style={{ color: category.color }} />
                              <span className="text-[10px] font-black uppercase tracking-[0.15em] opacity-60 group-hover:opacity-90 transition-opacity" style={{ color: category.color }}>
                                {category.label}
                              </span>
                              {hasCritical && (
                                <motion.div className="w-1.5 h-1.5 rounded-full bg-red-400"
                                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                                  transition={{ duration: 1.2, repeat: Infinity }} />
                              )}
                              {connectionBadge(category.connection)}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[8px] font-mono text-white/12">{category.prompts.length}</span>
                              <motion.div animate={{ rotate: catExpanded ? 90 : 0 }} transition={{ duration: 0.15 }}>
                                <ChevronRight className="w-3 h-3 text-white/15" />
                              </motion.div>
                            </div>
                          </button>

                          <AnimatePresence>
                            {catExpanded && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeInOut" }} className="overflow-hidden">
                                <div className="px-2.5 pb-2 space-y-[3px]">
                                  {category.prompts.map((prompt, idx) => (
                                    <motion.button key={prompt.id}
                                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: idx * 0.04, duration: 0.15 }}
                                      onClick={() => handleSend(prompt.prompt)} disabled={isLoading}
                                      className="w-full text-left px-3 py-2.5 rounded-lg border border-transparent hover:border-white/[0.06] hover:bg-white/[0.025] transition-all duration-150 group/prompt disabled:opacity-30 relative"
                                    >
                                      <div className="flex items-start gap-2.5">
                                        <div className="flex flex-col items-center gap-1 pt-0.5">
                                          <div className={`w-1.5 h-1.5 rounded-full ${priorityColor(prompt.priority)} ${prompt.priority === "critical" ? "animate-pulse" : ""}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-[11px] font-semibold text-white/65 group-hover/prompt:text-white/95 transition-colors leading-tight">
                                              {prompt.label}
                                            </span>
                                            {prompt.contextual && <Zap className="w-2.5 h-2.5 text-amber-400/50 flex-shrink-0" />}
                                            {prompt.connection && connectionBadge(prompt.connection)}
                                          </div>
                                          <div className="text-[9px] text-white/20 mt-0.5 leading-relaxed group-hover/prompt:text-white/35 transition-colors">
                                            {prompt.description}
                                          </div>
                                        </div>
                                        <ArrowRight className="w-3 h-3 text-white/0 group-hover/prompt:text-white/30 transition-all mt-0.5 flex-shrink-0" />
                                      </div>
                                    </motion.button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}

                  </motion.div>
                ) : (
                  /* ═══ CONVERSATION VIEW ═══ */
                  <motion.div key="conversation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="px-3 py-3 space-y-3">
                    <div className="flex items-center justify-between mb-1">
                      <button onClick={handleBackToPrompts} className="flex items-center gap-1.5 text-[10px] text-white/25 hover:text-white/60 transition-colors">
                        <ChevronUp className="w-3 h-3" /><span className="font-mono font-bold uppercase tracking-wider">Prompts</span>
                      </button>
                    </div>
                    {messages.map((msg) => (
                      <div key={msg.id}>
                        {msg.role === "user" ? (
                          <div className="flex justify-end">
                            <div className="max-w-[88%] px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                              <div className="text-[11.5px] text-white/90 leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                              <div className="text-[8px] text-white/15 mt-1.5 text-right tabular-nums font-mono">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-start">
                            <div className={`max-w-[95%] px-3 py-2.5 rounded-xl border ${msg.type === "warning" ? "bg-amber-500/[0.04] border-amber-500/[0.12]" : "bg-white/[0.02] border-white/[0.06]"}`}>
                              {msg.type === "warning" && (
                                <div className="flex items-center gap-1 mb-1.5">
                                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                                  <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest font-mono">Alert</span>
                                </div>
                              )}
                              <div className="text-[11.5px] text-white/80 leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                              <div className="text-[8px] text-white/10 mt-1.5 tabular-nums font-mono">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="px-3 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <div className="flex items-center gap-1.5">
                            {[0, 150, 300].map((d) => (
                              <motion.div key={d} className="w-1.5 h-1.5 bg-white/30 rounded-full"
                                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: d / 1000 }} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AI Panel Input */}
            <div className="flex-shrink-0 border-t border-white/[0.06] p-2.5 bg-white/[0.02] backdrop-blur-2xl">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyPress}
                  placeholder={`Ask about ${instrument.symbol} during ${sessionPhase.name}...`}
                  className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2 text-[11.5px] text-white/90 placeholder:text-white/15 focus:outline-none focus:border-white/[0.15] resize-none transition-all font-sans"
                  rows={1} style={{ minHeight: "36px", maxHeight: "80px" }}
                />
                <button onClick={() => handleSend()} disabled={!input.trim() || isLoading}
                  className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] disabled:opacity-15 disabled:cursor-not-allowed transition-all">
                  <Send className="w-3.5 h-3.5 text-white/50" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
