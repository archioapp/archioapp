"use client"

import { useState, useEffect, useMemo, useCallback, useRef, useId } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
  AlertTriangle,
  Brain,
  Timer,
  ShieldAlert,
  Zap,
  Pause,
  Eye,
  Target,
  Activity,
  Gauge,
  Flame,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Crosshair,
  HeartPulse,
  Sparkles,
  CircleDot,
  Shield,
  Scan,
  Radio,
  Radar,
  Link2,
  Layers,
  BookOpen,
  Clock,
  Compass,
  Wind,
  Anchor,
  Orbit,
  Fingerprint,
  MessageSquare,
  Calendar,
  Award,
  RotateCcw,
  Mic,
  Waves,
  Lock,
  PlayCircle,
  PauseCircle,
  Trophy,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Hash,
  Filter,
  CheckCircle2,
  ChevronDown,
  Ban,
  AlertCircle,
  ArrowRight,
  ArrowDown,
  Stethoscope,
  Lightbulb,
  HandMetal,
  LineChart,
} from "lucide-react"

/* ══════════════════════════════════════════════════════════════════════════
   PSYCHOLOGY OS -- "NEURAL CORTEX 2.0"
   The Mind Operating System. A neuroscience lab built inside a trading
   terminal. An MRI of the trader's behavior. Not a page -- a weapon.

   CORTEX STANDARD activated. Every pixel is a signal.
   ══════════════════════════════════════════════════════════════════════════ */

/* ────────────────────────── types ────────────────────────── */

interface PsychologyData {
  counts: {
    moodChecks7d: number
    activeDays7d: number
    medianDecisionMins: number
  }
  moodMix7d: Array<{ label: "Positive" | "Negative"; value: number }>
  topEmotions: Array<{ label: string; value: number }>
  topPitfalls: Array<{ label: string; value: number }>
  pace24h?: Array<number>
}

interface PsychologyAnalyticsProps {
  data?: PsychologyData
}

/* ────────────────────────── derived intelligence ────────────────────────── */

type StabilityLevel = "stable" | "elevated" | "reactive"
type DrawdownResponse = "aggressive" | "defensive" | "detached"
type PatternSeverity = "critical" | "warning" | "watch" | "clear"

interface CauseEffectChain {
  trigger: string
  emotion: string
  action: string
  result: string
  costEstimate: string
  interruptProtocol: string
}

interface BrainZone {
  id: string
  label: string
  hemisphere: "left" | "right"
  intensity: number
  color: string
  status: "active" | "elevated" | "critical" | "dormant"
  description: string
}

interface EmotionChapter {
  id: string
  name: string
  color: string
  definition: string
  markers: string[]
  evidence: string
  costPerWeek: string
  protocol: string[]
  drill: string
  proofMetric: string
  intensity: number
}

interface BehavioralState {
  stabilityIndex: number
  stabilityLevel: StabilityLevel
  drawdownResponse: DrawdownResponse
  decisionLatency: "fast" | "measured" | "slow"
  revengeRisk: PatternSeverity
  cutWinnersRisk: PatternSeverity
  sizeEscalation: PatternSeverity
  overtradingRisk: PatternSeverity
  emotionVolatility: number
  disciplineScore: number
  consistencyStreak: number
  peakActivityHour: number
  lowActivityHour: number
  paceShape: "front-loaded" | "distributed" | "back-loaded" | "erratic"
  stabilityTrend: number[]
  leftBrainZones: BrainZone[]
  rightBrainZones: BrainZone[]
  causeEffectChains: Record<string, CauseEffectChain>
  cortexVerdict: string
  cortexVerdictLevel: StabilityLevel
  dominantHemisphere: "left" | "right" | "balanced"
  emotionOrbits: Array<{ label: string; value: number; frequency: number; color: string }>
  dominantEmotion: string
  dominantEmotionColor: string
  activeAlerts: Array<{ message: string; severity: "critical" | "warning"; pattern: string }>
  emotionChapters: EmotionChapter[]
  crossLayerImpacts: Array<{ emotion: string; impact: string; rCost: string; color: string }>
  // Task A: Emotional Topology
  emotionTopology: Array<{ label: string; value: number; angle: number; radius: number; color: string; when: string; interrupt: string }>
  // Task B: Personality Profiler + Biases
  personalityTraits: Array<{ trait: string; score: number; label: string; evidence: string; color: string }>
  behavioralBiases: Array<{ bias: string; detected: boolean; severity: PatternSeverity; example: string; color: string; fix: string }>
  // Task C: Emotional Journal
  journalEntries: Array<{ id: string; date: string; time: string; emotion: string; color: string; note: string; impact: "positive" | "negative" | "neutral"; tradeRef?: string }>
  // Task D: Score Evolution
  compositeScores: Array<{ day: string; score: number; delta: number }>
  milestones: Array<{ label: string; achieved: boolean; date?: string }>
  emotionPnLCorrelation: Array<{ emotion: string; avgPnL: number; count: number; color: string }>
  improvementVelocity: number
  currentStreak: number
  bestStreak: number
}

function deriveBehavior(data: PsychologyData): BehavioralState {
  const posCount = data.moodMix7d.find((m) => m.label === "Positive")?.value ?? 0
  const negCount = data.moodMix7d.find((m) => m.label === "Negative")?.value ?? 0
  const totalMood = posCount + negCount || 1
  const posRatio = posCount / totalMood

  const moodBalance = posRatio * 50
  const consistencyBonus = Math.min(data.counts.activeDays7d / 7, 1) * 30
  const decisionBonus = data.counts.medianDecisionMins >= 3 && data.counts.medianDecisionMins <= 10 ? 20 : 5
  const stabilityIndex = Math.round(moodBalance + consistencyBonus + decisionBonus)

  const stabilityLevel: StabilityLevel =
    stabilityIndex >= 65 ? "stable" : stabilityIndex >= 40 ? "elevated" : "reactive"

  const decisionLatency: "fast" | "measured" | "slow" =
    data.counts.medianDecisionMins < 3 ? "fast" : data.counts.medianDecisionMins <= 8 ? "measured" : "slow"

  const emotionMap = new Map(data.topEmotions.map((e) => [e.label.toLowerCase(), e.value]))
  const pitfallMap = new Map(data.topPitfalls.map((p) => [p.label.toLowerCase(), p.value]))

  const fomoCount = emotionMap.get("fomo") ?? 0
  const frustrationCount = emotionMap.get("frustration") ?? 0
  const fearCount = emotionMap.get("fear of losing") ?? 0
  const overconfidenceCount = emotionMap.get("overconfidence") ?? 0
  const calmCount = emotionMap.get("calm") ?? emotionMap.get("focused") ?? 0

  const overtradingCount = pitfallMap.get("overtrading") ?? 0
  const chasingCount = pitfallMap.get("chasing trades") ?? pitfallMap.get("chasing") ?? 0
  const noRulesCount = pitfallMap.get("didn't follow rules") ?? 0
  const noSLCount = pitfallMap.get("trading without sl") ?? 0

  const revengeScore = fomoCount * 2 + frustrationCount * 2 + overtradingCount * 3
  const revengeRisk: PatternSeverity =
    revengeScore >= 8 ? "critical" : revengeScore >= 5 ? "warning" : revengeScore >= 2 ? "watch" : "clear"

  const cutScore = fearCount * 3 + (decisionLatency === "fast" ? 2 : 0)
  const cutWinnersRisk: PatternSeverity =
    cutScore >= 8 ? "critical" : cutScore >= 5 ? "warning" : cutScore >= 2 ? "watch" : "clear"

  const sizeScore = overconfidenceCount * 3 + noSLCount * 3 + noRulesCount * 2
  const sizeEscalation: PatternSeverity =
    sizeScore >= 8 ? "critical" : sizeScore >= 5 ? "warning" : sizeScore >= 2 ? "watch" : "clear"

  const overtradingRisk: PatternSeverity =
    overtradingCount + chasingCount >= 4
      ? "critical"
      : overtradingCount + chasingCount >= 2
        ? "warning"
        : overtradingCount + chasingCount >= 1
          ? "watch"
          : "clear"

  const emotionTotal = data.topEmotions.reduce((s, e) => s + e.value, 0)
  const emotionVolatility = Math.min(Math.round((emotionTotal / Math.max(data.counts.moodChecks7d, 1)) * 100), 100)

  const disciplineScore = Math.round(
    100 - (overtradingCount * 10 + noRulesCount * 15 + noSLCount * 20 + chasingCount * 10),
  )

  const consistencyStreak = data.counts.activeDays7d

  const pace = data.pace24h ?? Array(24).fill(0)
  const firstHalf = pace.slice(0, 12).reduce((s, v) => s + v, 0)
  const secondHalf = pace.slice(12).reduce((s, v) => s + v, 0)
  const total = firstHalf + secondHalf || 1
  const variance = pace.reduce((s, v) => s + Math.pow(v - total / 24, 2), 0) / 24

  const peakActivityHour = pace.indexOf(Math.max(...pace))
  const lowActivityHour = pace.indexOf(Math.min(...pace.filter((v) => v > 0).length > 0 ? pace : [0]))

  const paceShape: "front-loaded" | "distributed" | "back-loaded" | "erratic" =
    variance > 3
      ? "erratic"
      : firstHalf / total > 0.65
        ? "front-loaded"
        : secondHalf / total > 0.65
          ? "back-loaded"
          : "distributed"

  const drawdownResponse: DrawdownResponse =
    revengeRisk === "critical" || sizeEscalation !== "clear"
      ? "aggressive"
      : fearCount > frustrationCount
        ? "defensive"
        : "detached"

  const stabilityTrend = Array.from({ length: 7 }, (_, i) => {
    const base = stabilityIndex
    return Math.max(0, Math.min(100, Math.round(base + Math.sin(i * 1.2) * 12 + (Math.random() - 0.5) * 8)))
  })

  const clamp = (v: number) => Math.max(0, Math.min(100, v))

  const leftBrainZones: BrainZone[] = [
    {
      id: "discipline", label: "DISCIPLINE", hemisphere: "left",
      intensity: clamp(disciplineScore),
      color: disciplineScore >= 70 ? "#10b981" : disciplineScore >= 50 ? "#f59e0b" : "#ef4444",
      status: disciplineScore >= 80 ? "active" : disciplineScore >= 50 ? "elevated" : "critical",
      description: disciplineScore >= 80 ? "Rules followed consistently." : disciplineScore >= 50 ? "Some rule-breaking detected." : "Discipline breaking down.",
    },
    {
      id: "patience", label: "PATIENCE", hemisphere: "left",
      intensity: clamp(decisionLatency === "measured" ? 80 : decisionLatency === "slow" ? 60 : 25),
      color: decisionLatency === "measured" ? "#10b981" : decisionLatency === "slow" ? "#06b6d4" : "#ef4444",
      status: decisionLatency === "measured" ? "active" : decisionLatency === "slow" ? "elevated" : "critical",
      description: decisionLatency === "measured" ? "Appropriate analysis time." : decisionLatency === "slow" ? "Overthinking entries." : "Impulsive decisions.",
    },
    {
      id: "structure", label: "STRUCTURE", hemisphere: "left",
      intensity: clamp(paceShape === "distributed" ? 85 : paceShape === "front-loaded" ? 60 : paceShape === "back-loaded" ? 55 : 20),
      color: paceShape === "distributed" ? "#10b981" : paceShape === "erratic" ? "#ef4444" : "#f59e0b",
      status: paceShape === "distributed" ? "active" : paceShape === "erratic" ? "critical" : "elevated",
      description: paceShape === "distributed" ? "Structured session approach." : paceShape === "erratic" ? "Random activity bursts." : `Activity ${paceShape}.`,
    },
  ]

  const rightBrainZones: BrainZone[] = [
    {
      id: "impulse", label: "IMPULSE", hemisphere: "right",
      intensity: clamp(revengeScore * 8 + overtradingCount * 10),
      color: revengeRisk === "clear" ? "#10b981" : revengeRisk === "watch" ? "#f59e0b" : "#ef4444",
      status: revengeRisk === "clear" ? "dormant" : revengeRisk === "watch" ? "elevated" : "critical",
      description: revengeRisk === "clear" ? "Impulse control stable." : "Revenge/chasing patterns detected.",
    },
    {
      id: "fear", label: "FEAR", hemisphere: "right",
      intensity: clamp(fearCount * 20),
      color: cutWinnersRisk === "clear" ? "#10b981" : cutWinnersRisk === "watch" ? "#f59e0b" : "#ef4444",
      status: cutWinnersRisk === "clear" ? "dormant" : cutWinnersRisk === "watch" ? "elevated" : "critical",
      description: cutWinnersRisk === "clear" ? "Fear circuits quiet." : "Cutting winners short.",
    },
    {
      id: "ego", label: "EGO", hemisphere: "right",
      intensity: clamp(overconfidenceCount * 20 + noRulesCount * 15),
      color: sizeEscalation === "clear" ? "#10b981" : sizeEscalation === "watch" ? "#f59e0b" : "#ef4444",
      status: sizeEscalation === "clear" ? "dormant" : sizeEscalation === "watch" ? "elevated" : "critical",
      description: sizeEscalation === "clear" ? "Ego dormant." : "Overconfidence detected.",
    },
    {
      id: "emotion", label: "VOLATILITY", hemisphere: "right",
      intensity: clamp(emotionVolatility),
      color: emotionVolatility <= 40 ? "#10b981" : emotionVolatility <= 70 ? "#f59e0b" : "#ef4444",
      status: emotionVolatility <= 30 ? "dormant" : emotionVolatility <= 60 ? "elevated" : "critical",
      description: emotionVolatility <= 40 ? "Emotional state calm." : "Mood swings affecting decisions.",
    },
  ]

  const causeEffectChains: Record<string, CauseEffectChain> = {
    revenge: {
      trigger: fomoCount > frustrationCount ? "Missed entry / price ran without you" : "Loss triggers frustration spike",
      emotion: fomoCount > frustrationCount ? "FOMO -- fear of missing the move" : "Frustration -- need to recover loss NOW",
      action: "Immediate re-entry without new analysis. Larger size. No plan.",
      result: `${revengeScore >= 5 ? "Avg -2.1R per revenge sequence" : "Minimal impact when controlled"}. Compounding losses.`,
      costEstimate: revengeRisk === "critical" ? "-6.3R/wk" : revengeRisk === "warning" ? "-2.8R/wk" : "Minimal",
      interruptProtocol: "10-minute cooldown after any loss. Close charts. Write what happened. Return with a NEW edge.",
    },
    cutWinners: {
      trigger: "Trade goes profitable. Mind shifts to 'protect this gain'",
      emotion: "Fear of giving back profit. Loss aversion stronger than conviction.",
      action: "Manual close before TP. Move SL too tight. Exit on first pullback.",
      result: `Winners avg ${cutWinnersRisk === "critical" ? "0.4R" : cutWinnersRisk === "warning" ? "0.7R" : "1.2R"} vs planned 2-3R.`,
      costEstimate: cutWinnersRisk === "critical" ? "-4.1R/wk" : cutWinnersRisk === "warning" ? "-1.8R/wk" : "Controlled",
      interruptProtocol: "Set TP at entry. Walk away. Check only at planned intervals.",
    },
    sizeEscalation: {
      trigger: "Winning or loss streak triggers 'this next one is THE one'",
      emotion: "Overconfidence after wins. Recovery pressure after losses.",
      action: "Double/triple position size. Remove stop loss. 'Just this once.'",
      result: `One oversized loss erases ${sizeEscalation === "critical" ? "2-3 weeks" : "1 week"} of consistent gains.`,
      costEstimate: sizeEscalation === "critical" ? "CATASTROPHIC" : sizeEscalation === "warning" ? "-3.5R/incident" : "Controlled",
      interruptProtocol: "Position size is FIXED. Pre-calculate before charts. Urge to size up = signal to size DOWN.",
    },
    overtrading: {
      trigger: "Boredom. Quiet market. Screen addiction. Need for action.",
      emotion: "Restlessness. Dopamine-seeking from execution, not results.",
      action: `${overtradingCount + chasingCount}+ trades in compressed timeframes. Chasing phantom setups.`,
      result: "Commission bleed + poor entries. Win rate drops below 30%.",
      costEstimate: overtradingRisk === "critical" ? "-4.7R/wk" : overtradingRisk === "warning" ? "-1.5R/wk" : "Minimal",
      interruptProtocol: "Session trade limit (max 2-3). After limit: charts close. Physical activity replaces screen time.",
    },
  }

  const emotionColors: Record<string, string> = {
    "fomo": "#f59e0b", "fear of losing": "#3b82f6", "frustration": "#ef4444",
    "overconfidence": "#eab308", "calm": "#10b981", "focused": "#10b981",
    "anxiety": "#8b5cf6", "greed": "#f97316", "impatience": "#ec4899", "doubt": "#6366f1",
  }

  const maxEmotionVal = Math.max(...data.topEmotions.map(e => e.value), 1)
  const emotionOrbits = data.topEmotions.map(e => ({
    label: e.label, value: e.value,
    frequency: Math.round((e.value / maxEmotionVal) * 100),
    color: emotionColors[e.label.toLowerCase()] ?? "#6366f1",
  })).sort((a, b) => b.value - a.value)

  const dominantEmotion = emotionOrbits[0]?.label ?? "Calm"
  const dominantEmotionColor = emotionOrbits[0]?.color ?? "#10b981"

  const leftAvg = leftBrainZones.reduce((s, z) => s + z.intensity, 0) / leftBrainZones.length
  const rightAvg = rightBrainZones.reduce((s, z) => s + z.intensity, 0) / rightBrainZones.length
  const dominantHemisphere: "left" | "right" | "balanced" =
    Math.abs(leftAvg - rightAvg) < 15 ? "balanced" : leftAvg > rightAvg ? "left" : "right"

  const criticalCount = [revengeRisk, cutWinnersRisk, sizeEscalation, overtradingRisk].filter(r => r === "critical").length
  const warningCount = [revengeRisk, cutWinnersRisk, sizeEscalation, overtradingRisk].filter(r => r === "warning").length

  const activeAlerts: Array<{ message: string; severity: "critical" | "warning"; pattern: string }> = []
  if (revengeRisk === "critical") activeAlerts.push({ message: "FRUSTRATION CIRCUIT ACTIVE", severity: "critical", pattern: "revenge" })
  else if (revengeRisk === "warning") activeAlerts.push({ message: "REVENGE PATTERN RISING", severity: "warning", pattern: "revenge" })
  if (cutWinnersRisk === "critical") activeAlerts.push({ message: "FEAR OVERRIDE DETECTED", severity: "critical", pattern: "cutWinners" })
  else if (cutWinnersRisk === "warning") activeAlerts.push({ message: "FEAR RESPONSE ELEVATED", severity: "warning", pattern: "cutWinners" })
  if (sizeEscalation === "critical") activeAlerts.push({ message: "EGO ESCALATION CRITICAL", severity: "critical", pattern: "sizeEscalation" })
  else if (sizeEscalation === "warning") activeAlerts.push({ message: "SIZE DISCIPLINE SLIPPING", severity: "warning", pattern: "sizeEscalation" })
  if (overtradingRisk === "critical") activeAlerts.push({ message: "BOREDOM LOOP ACTIVE", severity: "critical", pattern: "overtrading" })
  else if (overtradingRisk === "warning") activeAlerts.push({ message: "OVERTRADING RISK HIGH", severity: "warning", pattern: "overtrading" })
  if (decisionLatency === "fast") activeAlerts.push({ message: "IMPULSIVE SPEED DETECTED", severity: "warning", pattern: "patience" })
  if (paceShape === "erratic") activeAlerts.push({ message: "ERRATIC ACTIVITY PATTERN", severity: "warning", pattern: "structure" })

  let cortexVerdict: string
  let cortexVerdictLevel: StabilityLevel

  if (criticalCount >= 2) {
    cortexVerdict = "Multiple neural pathways critical. Emotional override active. Stop trading."
    cortexVerdictLevel = "reactive"
  } else if (criticalCount === 1) {
    const p = [{ name: "Revenge trading", risk: revengeRisk }, { name: "Cutting winners", risk: cutWinnersRisk },
      { name: "Size escalation", risk: sizeEscalation }, { name: "Overtrading", risk: overtradingRisk }].find(p => p.risk === "critical")
    cortexVerdict = `${p?.name} pathway critical. Focus correction here first.`
    cortexVerdictLevel = "reactive"
  } else if (warningCount >= 2) {
    cortexVerdict = "Pre-reactive state. Multiple systems elevated. Reduce exposure."
    cortexVerdictLevel = "elevated"
  } else if (warningCount === 1) {
    cortexVerdict = "Cortex mostly stable. One pattern needs attention."
    cortexVerdictLevel = "elevated"
  } else if (stabilityIndex >= 70) {
    cortexVerdict = "Neural cortex stable. Logic active, emotions dormant."
    cortexVerdictLevel = "stable"
  } else {
    cortexVerdict = "Below peak. Reinforce consistency and emotional balance."
    cortexVerdictLevel = "elevated"
  }

  // ── Emotion Chapters ──
  const emotionChapters: EmotionChapter[] = [
    {
      id: "fear", name: "FEAR", color: "#3b82f6",
      definition: "The need to protect. It cuts winners, exits early, hesitates on A+ setups.",
      markers: ["Cutting winners short", "Avg hold time reduction", "Early exit before TP", "Hesitation on valid setups"],
      evidence: fearCount > 0 ? `Fear detected ${fearCount}x this week. Cut winners risk: ${cutWinnersRisk}.` : "Fear circuits quiet this week.",
      costPerWeek: cutWinnersRisk === "critical" ? "-4.1R/wk" : cutWinnersRisk === "warning" ? "-1.8R/wk" : "Minimal",
      protocol: ["Set TP at entry, do not modify", "Reduce chart-check frequency to 15m intervals", "Schedule exit checks, no manual closes"],
      drill: "Pre-entry conviction check: write 3 reasons this trade is valid before placing it.",
      proofMetric: "Avg winner hold time trending up 12% this week",
      intensity: clamp(fearCount * 25),
    },
    {
      id: "greed", name: "GREED", color: "#f59e0b",
      definition: "The hunger for more. It overtrades, oversizes, holds too long, chases.",
      markers: ["Overtrading frequency", "Position size variance", "Chase entries", "Adding to winners"],
      evidence: overconfidenceCount > 0 || overtradingCount > 0 ? `Greed signals: overconfidence ${overconfidenceCount}x, overtrading ${overtradingCount}x.` : "Greed circuits quiet.",
      costPerWeek: overtradingRisk === "critical" ? "-4.7R/wk" : overtradingRisk === "warning" ? "-1.5R/wk" : "Minimal",
      protocol: ["Session trade limit: max 3 per session", "Fixed position size, no exceptions", "No adding to winners without plan"],
      drill: "Size calculator oath: calculate position before looking at charts.",
      proofMetric: "Trades per day stable at planned limit",
      intensity: clamp(overconfidenceCount * 20 + overtradingCount * 15),
    },
    {
      id: "hope", name: "HOPE", color: "#06b6d4",
      definition: "The refusal to accept reality. It holds losers, moves stops, ignores invalidation.",
      markers: ["Holding past invalidation", "Moving SL away from entry", "Ignoring exit signals", "Averaging down"],
      evidence: noSLCount > 0 ? `Trading without SL detected ${noSLCount}x. Stop discipline compromised.` : "No hope-driven violations detected.",
      costPerWeek: noSLCount >= 2 ? "-5.2R/wk" : noSLCount === 1 ? "-2.0R/wk" : "Minimal",
      protocol: ["SL is set at entry and NEVER moved against you", "If invalidated, exit immediately", "Write the reason for exit before closing"],
      drill: "Invalidation pre-commit: before entry, write the exact price that proves you wrong.",
      proofMetric: "Zero SL modifications this week",
      intensity: clamp(noSLCount * 30),
    },
    {
      id: "frustration", name: "FRUSTRATION", color: "#ef4444",
      definition: "The reaction to injustice. It triggers revenge trades, larger sizes, irrational entries.",
      markers: ["Re-entry after loss", "Size increase after loss", "Rule violations spike", "Rapid-fire entries"],
      evidence: frustrationCount > 0 ? `Frustration detected ${frustrationCount}x. Revenge risk: ${revengeRisk}.` : "Frustration circuits quiet.",
      costPerWeek: revengeRisk === "critical" ? "-6.3R/wk" : revengeRisk === "warning" ? "-2.8R/wk" : "Minimal",
      protocol: ["10-minute mandatory cooldown after any loss", "Close charts completely during cooldown", "Write loss analysis before re-entry"],
      drill: "Post-loss protocol: 3 deep breaths, write what happened, wait 10 minutes.",
      proofMetric: "Zero revenge entries this week",
      intensity: clamp(frustrationCount * 25 + fomoCount * 10),
    },
    {
      id: "boredom", name: "BOREDOM", color: "#8b5cf6",
      definition: "The need for stimulation. It creates phantom setups, forces trades, seeks dopamine from execution.",
      markers: ["Trading during dead zones", "Entering without valid setup", "Excessive chart switching", "Low-conviction entries"],
      evidence: chasingCount > 0 || overtradingCount > 0 ? `Boredom signals: chasing ${chasingCount}x, overtrading ${overtradingCount}x.` : "Activity structure healthy.",
      costPerWeek: overtradingRisk === "critical" ? "-4.7R/wk" : overtradingRisk === "warning" ? "-1.5R/wk" : "Minimal",
      protocol: ["Max 3 trades per session, hard limit", "After limit: close charts, physical activity", "Only trade A+ setups, nothing else"],
      drill: "Setup quality check: score setup 1-10 before entry. Below 7 = no trade.",
      proofMetric: "All entries scored 7+ this week",
      intensity: clamp(chasingCount * 20 + overtradingCount * 15),
    },
  ]

  // ── Cross-Layer Bridges ──
  const crossLayerImpacts: Array<{ emotion: string; impact: string; rCost: string; color: string }> = []
  if (fearCount > 0) crossLayerImpacts.push({ emotion: "FEAR", impact: `Reduced avg R-multiple by cutting ${fearCount} winners early`, rCost: cutWinnersRisk === "critical" ? "-4.1R" : "-1.8R", color: "#3b82f6" })
  if (frustrationCount > 0) crossLayerImpacts.push({ emotion: "FRUSTRATION", impact: `Triggered ${frustrationCount} revenge sequences post-loss`, rCost: revengeRisk === "critical" ? "-6.3R" : "-2.8R", color: "#ef4444" })
  if (overtradingCount + chasingCount > 0) crossLayerImpacts.push({ emotion: "BOREDOM", impact: `${overtradingCount + chasingCount} forced entries outside valid setups`, rCost: overtradingRisk === "critical" ? "-4.7R" : "-1.5R", color: "#8b5cf6" })
  if (overconfidenceCount > 0) crossLayerImpacts.push({ emotion: "EGO", impact: `${overconfidenceCount} oversized positions from overconfidence`, rCost: sizeEscalation === "critical" ? "-3.5R" : "-1.2R", color: "#eab308" })
  if (noSLCount > 0) crossLayerImpacts.push({ emotion: "HOPE", impact: `${noSLCount} trades held past invalidation without stop`, rCost: "-5.2R", color: "#06b6d4" })

  // ── Emotional Topology (orbital positions) ──
  const emotionTopology = emotionOrbits.map((em, i) => {
    const angle = (i / Math.max(emotionOrbits.length, 1)) * 360
    const radius = 30 + (1 - em.frequency / 100) * 50
    const whenMap: Record<string, string> = {
      "fomo": "After missing entries, during strong moves",
      "fear of losing": "During open trades, approaching TP/SL",
      "frustration": "Post-loss, after missed setups",
      "overconfidence": "After winning streaks, during high conviction",
      "calm": "Pre-session, after meditation/routine",
      "focused": "During analysis phase, structured sessions",
      "anxiety": "Before high-impact news, large positions",
      "greed": "During winning trades, seeing profit grow",
      "impatience": "During consolidation, slow markets",
      "doubt": "After consecutive losses, low confidence",
    }
    const interruptMap: Record<string, string> = {
      "fomo": "Pause 5 mins. Ask: is this MY setup? If no, walk away.",
      "fear of losing": "Review original thesis. If still valid, hold. Set alerts and step back.",
      "frustration": "10-min break. Physical movement. Journal the feeling before acting.",
      "overconfidence": "Reduce next position by 50%. Review last 3 losers.",
      "calm": "Maintain. This is the target state.",
      "focused": "Excellent. Channel this into analysis quality.",
      "anxiety": "Box breathing 4-4-4-4. Reduce size or sit out.",
      "greed": "Lock in partial profit. Re-read position sizing rules.",
      "impatience": "Switch to longer timeframe. If no setup, close charts.",
      "doubt": "Paper trade next 3 setups. Rebuild confidence with small wins.",
    }
    return {
      label: em.label, value: em.value, angle, radius, color: em.color,
      when: whenMap[em.label.toLowerCase()] ?? "During active trading sessions",
      interrupt: interruptMap[em.label.toLowerCase()] ?? "Pause. Breathe. Reassess.",
    }
  })

  // ── Personality Profiler ──
  const riskAppetite = clamp(Math.round(
    (overconfidenceCount * 20 + noSLCount * 25 + (overtradingCount + chasingCount) * 10) -
    (fearCount * 15 + calmCount * 5) + 50
  ))
  const conscientiousnessScore = clamp(Math.round(
    100 - (noRulesCount * 20 + noSLCount * 15 + (paceShape === "erratic" ? 20 : 0) + (overtradingCount * 10))
  ))
  const neuroticismScore = clamp(Math.round(
    (frustrationCount * 15 + fearCount * 15 + fomoCount * 10 + emotionVolatility * 0.5)
  ))
  const opennessScore = clamp(Math.round(
    (data.counts.activeDays7d / 7) * 40 + (data.counts.moodChecks7d > 10 ? 30 : data.counts.moodChecks7d > 5 ? 20 : 10) +
    (decisionLatency === "measured" ? 30 : 15)
  ))

  const personalityTraits = [
    { trait: "RISK APPETITE", score: riskAppetite, label: riskAppetite > 70 ? "Aggressive" : riskAppetite > 40 ? "Moderate" : "Conservative",
      evidence: riskAppetite > 70 ? `High risk signals: overconfidence ${overconfidenceCount}x, no SL ${noSLCount}x` : riskAppetite > 40 ? "Balanced risk approach with occasional boundary pushes" : `Conservative: fear ${fearCount}x, cautious entries`,
      color: riskAppetite > 70 ? "#ef4444" : riskAppetite > 40 ? "#f59e0b" : "#10b981" },
    { trait: "CONSCIENTIOUSNESS", score: conscientiousnessScore, label: conscientiousnessScore > 70 ? "Disciplined" : conscientiousnessScore > 40 ? "Inconsistent" : "Undisciplined",
      evidence: conscientiousnessScore > 70 ? `Rules followed, structured sessions, SL discipline` : `Rule violations ${noRulesCount}x, SL skipped ${noSLCount}x`,
      color: conscientiousnessScore > 70 ? "#10b981" : conscientiousnessScore > 40 ? "#f59e0b" : "#ef4444" },
    { trait: "NEUROTICISM", score: neuroticismScore, label: neuroticismScore > 60 ? "Highly Reactive" : neuroticismScore > 30 ? "Moderately Reactive" : "Emotionally Stable",
      evidence: neuroticismScore > 60 ? `High emotional reactivity: frustration ${frustrationCount}x, fear ${fearCount}x, FOMO ${fomoCount}x` : "Emotional responses within normal range",
      color: neuroticismScore > 60 ? "#ef4444" : neuroticismScore > 30 ? "#f59e0b" : "#10b981" },
    { trait: "OPENNESS", score: opennessScore, label: opennessScore > 70 ? "Growth-Oriented" : opennessScore > 40 ? "Developing" : "Resistant",
      evidence: opennessScore > 70 ? `${data.counts.activeDays7d}/7 active days, ${data.counts.moodChecks7d} mood checks` : "Limited self-reflection and tracking consistency",
      color: opennessScore > 70 ? "#10b981" : opennessScore > 40 ? "#06b6d4" : "#f59e0b" },
  ]

  // ── Behavioral Biases ──
  const behavioralBiases = [
    { bias: "CONFIRMATION BIAS", detected: fomoCount > 0 || chasingCount > 0, severity: (fomoCount + chasingCount >= 3 ? "critical" : fomoCount + chasingCount >= 1 ? "warning" : "clear") as PatternSeverity,
      example: "Seeking data that confirms your existing trade thesis while ignoring contradicting signals",
      color: "#f59e0b", fix: "Before entry, list 3 reasons the trade could fail. If you can't, you have confirmation bias." },
    { bias: "LOSS AVERSION", detected: fearCount > 0 || cutWinnersRisk !== "clear", severity: (fearCount >= 3 ? "critical" : fearCount >= 1 ? "warning" : "clear") as PatternSeverity,
      example: `Cutting winners ${cutWinnersRisk !== "clear" ? "detected" : "not detected"}. Pain of loss is 2x stronger than pleasure of gain.`,
      color: "#3b82f6", fix: "Measure by R-multiple, not dollar P&L. A 1R loss is normal. Focus on expectancy over 100 trades." },
    { bias: "ANCHORING", detected: overtradingCount > 0 || noRulesCount > 0, severity: (overtradingCount + noRulesCount >= 3 ? "critical" : overtradingCount + noRulesCount >= 1 ? "warning" : "clear") as PatternSeverity,
      example: "Fixating on entry price and refusing to adjust thesis when market structure changes",
      color: "#8b5cf6", fix: "Use invalidation-based exits, not price-based. The market doesn't know your entry price." },
    { bias: "GAMBLER'S FALLACY", detected: revengeRisk !== "clear", severity: revengeRisk,
      example: "After 3 losses: 'the next one HAS to win.' After 3 wins: 'I'm due for a loss.'",
      color: "#ef4444", fix: "Each trade is independent. Past results don't change future probabilities. Stick to edge." },
    { bias: "AVAILABILITY BIAS", detected: emotionVolatility > 50, severity: (emotionVolatility > 70 ? "warning" : "clear") as PatternSeverity,
      example: "Last trade's outcome disproportionately affects your next decision. Recent vivid memories override statistics.",
      color: "#06b6d4", fix: "Keep a stats dashboard visible. Make decisions based on 100-trade data, not last 3 trades." },
    { bias: "HINDSIGHT BIAS", detected: overconfidenceCount > 0, severity: (overconfidenceCount >= 2 ? "warning" : overconfidenceCount >= 1 ? "watch" : "clear") as PatternSeverity,
      example: "'I knew that was going to happen.' Overestimating your predictive ability after the fact.",
      color: "#eab308", fix: "Record predictions BEFORE the event. Review prediction accuracy honestly." },
  ]

  // ── Emotional Journal (synthetic from data) ──
  const journalEntries = (() => {
    const entries: BehavioralState["journalEntries"] = []
    const emotions = data.topEmotions.slice(0, 5)
    const now = Date.now()
    let idx = 0
    emotions.forEach(em => {
      for (let i = 0; i < Math.min(em.value, 3); i++) {
        const daysAgo = Math.floor(Math.random() * 7)
        const hour = 8 + Math.floor(Math.random() * 10)
        const d = new Date(now - daysAgo * 86400000)
        entries.push({
          id: `j-${idx++}`,
          date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          time: `${hour.toString().padStart(2, "0")}:${Math.floor(Math.random() * 60).toString().padStart(2, "0")}`,
          emotion: em.label,
          color: emotionColors[em.label.toLowerCase()] ?? "#6366f1",
          note: `${em.label} detected during trading session`,
          impact: em.label.toLowerCase().includes("calm") || em.label.toLowerCase().includes("focused") ? "positive" as const : "negative" as const,
          tradeRef: Math.random() > 0.5 ? `#T${100 + Math.floor(Math.random() * 50)}` : undefined,
        })
      }
    })
    return entries.sort((a, b) => b.id.localeCompare(a.id))
  })()

  // ── Score Evolution ──
  const compositeScores = Array.from({ length: 7 }, (_, i) => {
    const base = stabilityIndex
    const score = Math.max(0, Math.min(100, Math.round(base - 10 + i * 3 + (Math.random() - 0.3) * 8)))
    return {
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      score,
      delta: i === 0 ? 0 : Math.round((Math.random() - 0.4) * 8),
    }
  })

  const milestones = [
    { label: "7-Day Streak", achieved: data.counts.activeDays7d >= 7, date: data.counts.activeDays7d >= 7 ? "This week" : undefined },
    { label: "Zero Revenge Week", achieved: revengeRisk === "clear", date: revengeRisk === "clear" ? "Current" : undefined },
    { label: "Discipline 80+", achieved: disciplineScore >= 80, date: disciplineScore >= 80 ? "Active" : undefined },
    { label: "Stability 70+", achieved: stabilityIndex >= 70, date: stabilityIndex >= 70 ? "Active" : undefined },
    { label: "All Biases Clear", achieved: behavioralBiases.every(b => !b.detected) },
  ]

  const emotionPnLCorrelation = [
    { emotion: "Calm", avgPnL: 1.8, count: calmCount, color: "#10b981" },
    { emotion: "Focused", avgPnL: 1.4, count: emotionMap.get("focused") ?? 0, color: "#10b981" },
    { emotion: "FOMO", avgPnL: -1.2, count: fomoCount, color: "#f59e0b" },
    { emotion: "Frustration", avgPnL: -2.1, count: frustrationCount, color: "#ef4444" },
    { emotion: "Fear", avgPnL: -0.8, count: fearCount, color: "#3b82f6" },
    { emotion: "Overconfidence", avgPnL: -1.5, count: overconfidenceCount, color: "#eab308" },
  ].filter(e => e.count > 0)

  const latestScore = compositeScores[compositeScores.length - 1]?.score ?? stabilityIndex
  const earliestScore = compositeScores[0]?.score ?? stabilityIndex
  const improvementVelocity = latestScore - earliestScore

  const currentStreak = data.counts.activeDays7d
  const bestStreak = Math.max(data.counts.activeDays7d, 7)

  return {
    stabilityIndex: Math.max(0, Math.min(100, stabilityIndex)), stabilityLevel, drawdownResponse, decisionLatency,
    revengeRisk, cutWinnersRisk, sizeEscalation, overtradingRisk, emotionVolatility,
    disciplineScore: Math.max(0, Math.min(100, disciplineScore)), consistencyStreak, peakActivityHour, lowActivityHour,
    paceShape, stabilityTrend, leftBrainZones, rightBrainZones, causeEffectChains, cortexVerdict, cortexVerdictLevel,
    dominantHemisphere, emotionOrbits, dominantEmotion, dominantEmotionColor, activeAlerts,
    emotionChapters, crossLayerImpacts,
    emotionTopology, personalityTraits, behavioralBiases, journalEntries,
    compositeScores, milestones, emotionPnLCorrelation, improvementVelocity,
    currentStreak, bestStreak,
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Neural Stability Meter (SVG) ── */
function NeuralStabilityMeter({ value, level }: { value: number; level: StabilityLevel }) {
    const _uid = useId()
    const sid = (n: string) => `${_uid.replace(/:/g, "")}-${n}`
  const color = level === "stable" ? "#10b981" : level === "elevated" ? "#f59e0b" : "#ef4444"
  const r = 32
  const circ = 2 * Math.PI * r
  const filled = (value / 100) * circ

  const eegPoints = useMemo(() => {
    const pts: string[] = []
    for (let i = 0; i <= 40; i++) {
      const x = (i / 40) * 78 + 1
      const base = 40
      const amp = level === "reactive" ? 8 : level === "elevated" ? 4 : 2
      const freq = level === "reactive" ? 0.8 : level === "elevated" ? 0.5 : 0.3
      const y = base + Math.sin(i * freq) * amp + Math.sin(i * 1.7) * (amp * 0.3) + (Math.random() - 0.5) * 2
      pts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`)
    }
    return pts.join(" ")
  }, [level])

  return (
    <div className="relative flex items-center justify-center">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <defs>
          <linearGradient id={sid("neural-grad")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </linearGradient>
          <filter id={sid("neural-glow")}>
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id={sid("neural-center")} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.06" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>

            <circle cx="40" cy="40" r="36" fill={`url(#${sid("neural-center")})`} />

        <circle cx="40" cy="40" r="38" fill="none" stroke={color} strokeWidth="0.3" opacity="0.15">
          <animate attributeName="r" values="37;39;37" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.3;0.15" dur="4s" repeatCount="indefinite" />
        </circle>

        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3.5" />

        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i / 36) * 360 - 90
          const rad = (angle * Math.PI) / 180
          const isLit = i <= (value / 100) * 36
          const isMajor = i % 9 === 0
          const innerR = isMajor ? 26 : 28
          const x1 = 40 + innerR * Math.cos(rad)
          const y1 = 40 + innerR * Math.sin(rad)
          const x2 = 40 + 30 * Math.cos(rad)
          const y2 = 40 + 30 * Math.sin(rad)
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isLit ? `${color}60` : "rgba(255,255,255,0.04)"}
              strokeWidth={isMajor ? "0.8" : "0.4"} />
          )
        })}

        <motion.circle
          cx="40" cy="40" r={r} fill="none" stroke={`url(#${sid("neural-grad")})`}
          strokeWidth="3.5" strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - filled }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          transform="rotate(-90 40 40)" filter={`url(#${sid("neural-glow")})`}
        />

        {(() => {
          const endAngle = ((value / 100) * 360 - 90) * (Math.PI / 180)
          const ex = 40 + r * Math.cos(endAngle)
          const ey = 40 + r * Math.sin(endAngle)
          return (
            <circle cx={ex} cy={ey} r="2.5" fill={color} opacity="0.9">
              <animate attributeName="r" values="2;3.5;2" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite" />
            </circle>
          )
        })()}

        <path d={eegPoints} fill="none" stroke={color} strokeWidth="0.6" opacity="0.2" strokeLinecap="round" />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-xl font-black tabular-nums leading-none"
          style={{ color, textShadow: `0 0 16px ${color}30` }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {value}
        </motion.span>
        <span className="text-[6px] font-mono text-white/20 uppercase tracking-[0.2em] mt-0.5 font-bold">STABILITY</span>
      </div>
    </div>
  )
}

/* ── Brain Hemisphere Button ── */
function HemisphereButton({ side, zones, isActive, onClick, otherActive }: {
  side: "left" | "right"
  zones: BrainZone[]
  isActive: boolean
  otherActive: boolean
  onClick: () => void
}) {
  const avg = Math.round(zones.reduce((s, z) => s + z.intensity, 0) / zones.length)
  const hasCritical = zones.some(z => z.status === "critical")
  const hasElevated = zones.some(z => z.status === "elevated")
  const accentColor = side === "left" ? "#10b981" : "#ef4444"
  const label = side === "left" ? "LOGIC CORTEX" : "LIMBIC SYSTEM"
  const sublabel = side === "left" ? "Executive Function" : "Emotional Activity"

  return (
    <motion.button
      className="flex-1 relative overflow-hidden rounded-xl focus:outline-none"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      animate={{ opacity: otherActive ? 0.4 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="px-3 py-3 rounded-xl relative"
        animate={{
          backgroundColor: isActive ? `${accentColor}08` : "rgba(255,255,255,0.01)",
          borderColor: isActive ? `${accentColor}30` : hasCritical ? "#ef444420" : "rgba(255,255,255,0.04)",
        }}
        style={{ border: "1px solid" }}
      >
        {isActive && (
          <motion.div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full"
              style={{ backgroundColor: accentColor, filter: "blur(25px)", opacity: 0.08 }} />
          </motion.div>
        )}

        <div className="relative flex flex-col items-center gap-1">
          <div className="flex items-center gap-1 mb-1">
            {zones.map((zone, i) => (
              <motion.div key={zone.id} className="relative"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05, type: "spring" }}>
                <div className="w-3 h-3 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: `${zone.color}15`,
                    border: `1px solid ${zone.color}30`,
                    boxShadow: zone.status === "critical" ? `0 0 6px ${zone.color}30` : "none",
                  }}>
                  {zone.status === "critical" && (
                    <motion.div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: zone.color }}
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }} />
                  )}
                </div>
                {i < zones.length - 1 && (
                  <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-1 h-px"
                    style={{ backgroundColor: isActive ? `${accentColor}30` : "rgba(255,255,255,0.06)" }} />
                )}
              </motion.div>
            ))}
          </div>

          <motion.span
            className="text-xl font-black tabular-nums leading-none"
            style={{ color: isActive ? accentColor : "rgba(255,255,255,0.65)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          >
            {avg}
          </motion.span>

          <span className="text-[10px] font-mono uppercase tracking-[0.12em] font-black"
            style={{ color: isActive ? `${accentColor}` : "rgba(255,255,255,0.25)" }}>
            {label}
          </span>
          <span className="text-[8px] font-mono uppercase tracking-wider font-bold"
            style={{ color: isActive ? `${accentColor}60` : "rgba(255,255,255,0.12)" }}>
            {sublabel}
          </span>

          {(hasCritical || hasElevated) && (
            <div className="flex items-center gap-1 mt-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hasCritical ? "#ef4444" : "#f59e0b" }} />
              <span className="text-[8px] font-mono font-black uppercase tracking-wider"
                style={{ color: hasCritical ? "#ef4444" : "#f59e0b" }}>
                {hasCritical ? "CRITICAL" : "ELEVATED"}
              </span>
            </div>
          )}
        </div>

        {isActive && (
          <motion.div className="absolute bottom-0 inset-x-3 h-0.5 rounded-full"
            style={{ backgroundColor: accentColor, opacity: 0.5 }}
            layoutId="hemisphere-indicator" />
        )}
      </motion.div>
    </motion.button>
  )
}

/* ── Alert Strip ── */
function AlertStrip({ alerts }: { alerts: BehavioralState["activeAlerts"] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (alerts.length <= 1) return
    const t = setInterval(() => setCurrentIndex(i => (i + 1) % alerts.length), 3000)
    return () => clearInterval(t)
  }, [alerts.length])

  if (alerts.length === 0) return null

  const current = alerts[currentIndex]
  const isCritical = current.severity === "critical"
  const color = isCritical ? "#ef4444" : "#f59e0b"

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg"
      style={{ backgroundColor: `${color}06`, border: `1px solid ${color}15` }}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-y-0 w-12"
        style={{ background: `linear-gradient(90deg, transparent, ${color}08, transparent)` }}
        animate={{ left: ["-48px", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative px-3 py-2 flex items-center gap-2">
        <motion.div
          className="shrink-0 w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
          animate={isCritical ? { scale: [1, 1.8, 1], opacity: [1, 0.3, 1] } : { opacity: [0.5, 1, 0.5] }}
          transition={{ duration: isCritical ? 1 : 2, repeat: Infinity }}
        />
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className="text-[8px] font-mono font-black uppercase tracking-wider"
            style={{ color }}>{isCritical ? "HIGH RISK" : "WARNING"}</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              className="text-[8px] font-mono font-bold tracking-wider truncate"
              style={{ color: `${color}80` }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {current.message}
            </motion.span>
          </AnimatePresence>
        </div>
        {alerts.length > 1 && (
          <div className="flex gap-0.5 shrink-0">
            {alerts.map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full transition-all duration-200"
                style={{ backgroundColor: i === currentIndex ? color : `${color}30` }} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ── Interactive Brain SVG Visualization ── */
function BrainVisualization({ state, activeHemisphere, onSelectHemisphere, onSelectZone, onAsk }: {
  state: BehavioralState
  activeHemisphere: "left" | "right" | null
  onSelectHemisphere: (side: "left" | "right" | null) => void
  onSelectZone: (zoneId: string) => void
  onAsk: (text: string) => void
}) {
  const _uid = useId()
  const sid = (n: string) => `${_uid.replace(/:/g, "")}-${n}`
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const detailPanelRef = useRef<HTMLDivElement>(null)

  const allZones = [...state.leftBrainZones, ...state.rightBrainZones]
  const centerColor = state.stabilityLevel === "stable" ? "#10b981" : state.stabilityLevel === "elevated" ? "#f59e0b" : "#ef4444"

  const zonePositions: Record<string, { x: number; y: number; labelX: number; labelY: number; labelAnchor: string }> = {
    discipline: { x: 100, y: 70, labelX: 55, labelY: 65, labelAnchor: "end" },
    patience:   { x: 80,  y: 130, labelX: 35, labelY: 130, labelAnchor: "end" },
    structure:  { x: 110, y: 180, labelX: 60, labelY: 190, labelAnchor: "end" },
    impulse:    { x: 260, y: 65, labelX: 305, labelY: 60, labelAnchor: "start" },
    fear:       { x: 285, y: 110, labelX: 325, labelY: 105, labelAnchor: "start" },
    ego:        { x: 275, y: 160, labelX: 315, labelY: 160, labelAnchor: "start" },
    emotion:    { x: 250, y: 200, labelX: 300, labelY: 205, labelAnchor: "start" },
  }

  const connections: Array<{ from: string; to: string; type: "intra" | "cross" }> = [
    { from: "discipline", to: "patience", type: "intra" },
    { from: "patience", to: "structure", type: "intra" },
    { from: "discipline", to: "structure", type: "intra" },
    { from: "impulse", to: "fear", type: "intra" },
    { from: "fear", to: "ego", type: "intra" },
    { from: "ego", to: "emotion", type: "intra" },
    { from: "impulse", to: "emotion", type: "intra" },
    { from: "discipline", to: "impulse", type: "cross" },
    { from: "patience", to: "fear", type: "cross" },
    { from: "structure", to: "emotion", type: "cross" },
  ]

  const brainOutlineLeft = "M 180 30 C 140 25, 90 40, 70 70 C 50 100, 45 140, 60 170 C 70 195, 95 220, 130 235 C 155 245, 170 240, 180 230"
  const brainOutlineRight = "M 180 30 C 220 25, 270 40, 290 70 C 310 100, 315 140, 300 170 C 290 195, 265 220, 230 235 C 205 245, 190 240, 180 230"
  const brainStem = "M 170 230 C 165 245, 168 260, 175 270 Q 180 275, 185 270 C 192 260, 195 245, 190 230"

  // Cerebellum — the small "little brain" at the back/bottom (a premium anatomical detail)
  const cerebellumLeft  = "M 155 240 C 145 248, 140 258, 148 265 C 155 270, 165 268, 170 262"
  const cerebellumRight = "M 205 240 C 215 248, 220 258, 212 265 C 205 270, 195 268, 190 262"

  // Anatomical sulci (the deep fissures between gyri). Each follows the curvature of
  // the hemisphere, mimicking the central, lateral, parieto-occipital & calcarine sulci.
  // This replaces the arbitrary mesh lines with curves that read as real brain folds.
  const meshLinesLeft = [
    // Frontal lobe gyri (top arc)
    "M 155 38 C 128 45, 105 58, 88 78",
    "M 168 42 C 140 56, 110 76, 85 100",
    // Central sulcus (primary motor / somatosensory divide)
    "M 172 58 C 148 82, 118 108, 88 128",
    // Precentral & postcentral gyri
    "M 176 82 C 155 108, 122 140, 95 158",
    // Parietal lobe folds
    "M 178 110 C 158 132, 128 162, 108 180",
    "M 178 138 C 162 156, 138 180, 122 198",
    // Temporal lobe ridge (lateral sulcus)
    "M 172 170 C 155 188, 135 208, 130 222",
    // Occipital / parieto-occipital crease
    "M 118 60 C 98 86, 78 112, 64 138",
    "M 96 78 C 82 102, 70 128, 62 156",
    // Deep tertiary folds near the core
    "M 150 95 C 132 112, 115 135, 105 152",
    "M 142 150 C 128 165, 118 182, 115 200",
  ]
  const meshLinesRight = [
    "M 205 38 C 232 45, 255 58, 272 78",
    "M 192 42 C 220 56, 250 76, 275 100",
    "M 188 58 C 212 82, 242 108, 272 128",
    "M 184 82 C 205 108, 238 140, 265 158",
    "M 182 110 C 202 132, 232 162, 252 180",
    "M 182 138 C 198 156, 222 180, 238 198",
    "M 188 170 C 205 188, 225 208, 230 222",
    "M 242 60 C 262 86, 282 112, 296 138",
    "M 264 78 C 278 102, 290 128, 298 156",
    "M 210 95 C 228 112, 245 135, 255 152",
    "M 218 150 C 232 165, 242 182, 245 200",
  ]

  const handleZoneClick = (zoneId: string) => {
    const zone = allZones.find(z => z.id === zoneId)
    if (!zone) return
    if (selectedZone === zoneId) {
      setSelectedZone(null)
    } else {
      setSelectedZone(zoneId)
      onSelectHemisphere(zone.hemisphere)
    }
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2.5 px-4 pt-3 pb-1.5">
        <Scan className="w-4 h-4 text-white/20" />
        <span className="text-[11px] font-mono text-white/25 uppercase tracking-[0.12em] font-black">Neural Topology</span>
        <div className="flex-1 h-px bg-white/[0.04]" />
        <span className="text-[9px] font-mono text-white/15 uppercase font-bold">Interactive</span>
      </div>

      <svg viewBox="0 0 360 285" className="w-full max-w-full" style={{ height: "auto", maxHeight: 240 }}>
        <defs>
            <filter id={sid("brain-glow-green")}><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <filter id={sid("brain-glow-red")}><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <filter id={sid("brain-glow-amber")}><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <linearGradient id={sid("corpus-grad")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={centerColor} stopOpacity="0.15" />
            <stop offset="50%" stopColor={centerColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={centerColor} stopOpacity="0.15" />
          </linearGradient>
            <radialGradient id={sid("left-ambient")} cx="30%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity={activeHemisphere === "left" ? "0.06" : "0.02"} />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
            <radialGradient id={sid("right-ambient")} cx="70%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={activeHemisphere === "right" ? "0.06" : "0.02"} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
        </defs>

            <rect x="0" y="0" width="180" height="285" fill={`url(#${sid("left-ambient")})`} />
            <rect x="180" y="0" width="180" height="285" fill={`url(#${sid("right-ambient")})`} />

        <line x1="180" y1="28" x2="180" y2="232" stroke={centerColor} strokeWidth="0.5" opacity="0.1" />
                    <line x1="180" y1="28" x2="180" y2="232" stroke={`url(#${sid("corpus-grad")})`} strokeWidth="2" opacity="0.15">
          <animate attributeName="opacity" values="0.1;0.25;0.1" dur="4s" repeatCount="indefinite" />
        </line>

        {/* Left brain outline -- clickable */}
        <g className="cursor-pointer" style={{ pointerEvents: "all" }}
          onClick={() => onSelectHemisphere(activeHemisphere === "left" ? null : "left")}
          onTouchEnd={(e) => { e.preventDefault(); onSelectHemisphere(activeHemisphere === "left" ? null : "left") }}>
          <path d={brainOutlineLeft} fill="rgba(16,185,129,0.01)" stroke="#10b981"
            strokeWidth={activeHemisphere === "left" ? "1.8" : "0.8"}
            opacity={activeHemisphere === "right" ? "0.08" : activeHemisphere === "left" ? "0.6" : "0.25"}
            strokeLinecap="round" />
          {/* Wide invisible hit area */}
          <path d={brainOutlineLeft} fill="transparent" stroke="transparent" strokeWidth="16" />
        </g>
        {/* Right brain outline -- clickable */}
        <g className="cursor-pointer" style={{ pointerEvents: "all" }}
          onClick={() => onSelectHemisphere(activeHemisphere === "right" ? null : "right")}
          onTouchEnd={(e) => { e.preventDefault(); onSelectHemisphere(activeHemisphere === "right" ? null : "right") }}>
          <path d={brainOutlineRight} fill="rgba(239,68,68,0.01)" stroke="#ef4444"
            strokeWidth={activeHemisphere === "right" ? "1.8" : "0.8"}
            opacity={activeHemisphere === "left" ? "0.08" : activeHemisphere === "right" ? "0.6" : "0.25"}
            strokeLinecap="round" />
          {/* Wide invisible hit area */}
          <path d={brainOutlineRight} fill="transparent" stroke="transparent" strokeWidth="16" />
        </g>
        <path d={brainStem} fill="none" stroke={centerColor} strokeWidth="0.8" opacity="0.15" strokeLinecap="round" />
        {/* Cerebellum silhouettes — the anatomical "little brain" behind the brainstem */}
        <path d={cerebellumLeft}  fill="none" stroke="#10b981" strokeWidth="0.6"
          opacity={activeHemisphere === "right" ? "0.04" : activeHemisphere === "left" ? "0.3" : "0.15"}
          strokeLinecap="round" />
        <path d={cerebellumRight} fill="none" stroke="#ef4444" strokeWidth="0.6"
          opacity={activeHemisphere === "left" ? "0.04" : activeHemisphere === "right" ? "0.3" : "0.15"}
          strokeLinecap="round" />
        {/* Horizontal folia lines inside the cerebellum suggesting its layered structure */}
        <path d="M 150 252 C 158 250, 166 250, 172 253" fill="none" stroke="#10b981" strokeWidth="0.3"
          opacity={activeHemisphere === "right" ? "0.02" : "0.12"} strokeLinecap="round" />
        <path d="M 148 260 C 158 258, 168 258, 175 260" fill="none" stroke="#10b981" strokeWidth="0.3"
          opacity={activeHemisphere === "right" ? "0.02" : "0.1"} strokeLinecap="round" />
        <path d="M 188 253 C 194 250, 202 250, 210 252" fill="none" stroke="#ef4444" strokeWidth="0.3"
          opacity={activeHemisphere === "left" ? "0.02" : "0.12"} strokeLinecap="round" />
        <path d="M 185 260 C 192 258, 202 258, 212 260" fill="none" stroke="#ef4444" strokeWidth="0.3"
          opacity={activeHemisphere === "left" ? "0.02" : "0.1"} strokeLinecap="round" />

        {meshLinesLeft.map((d, i) => (
          <path key={`ml${i}`} d={d} fill="none" stroke="#10b981" strokeWidth="0.3"
            opacity={activeHemisphere === "right" ? "0.02" : activeHemisphere === "left" ? "0.12" : "0.05"}
            strokeLinecap="round" />
        ))}
        {meshLinesRight.map((d, i) => (
          <path key={`mr${i}`} d={d} fill="none" stroke="#ef4444" strokeWidth="0.3"
            opacity={activeHemisphere === "left" ? "0.02" : activeHemisphere === "right" ? "0.12" : "0.05"}
            strokeLinecap="round" />
        ))}

        {connections.map((conn, ci) => {
          const from = zonePositions[conn.from]
          const to = zonePositions[conn.to]
          if (!from || !to) return null

          const fromZone = allZones.find(z => z.id === conn.from)
          const toZone = allZones.find(z => z.id === conn.to)
          const isCriticalPath = fromZone?.status === "critical" || toZone?.status === "critical"

          const midX = (from.x + to.x) / 2
          const midY = (from.y + to.y) / 2
          const cpOffset = conn.type === "cross" ? -20 : (from.x < to.x ? -15 : 15)
          const pathD = `M ${from.x} ${from.y} Q ${midX + cpOffset} ${midY + cpOffset} ${to.x} ${to.y}`

          const dimmed = activeHemisphere !== null && conn.type === "intra" &&
            ((activeHemisphere === "left" && fromZone?.hemisphere === "right") ||
             (activeHemisphere === "right" && fromZone?.hemisphere === "left"))

          return (
            <g key={`conn-${ci}`} opacity={dimmed ? 0.05 : 1}
              style={{ transition: "opacity 0.3s", cursor: isCriticalPath ? "pointer" : "default", pointerEvents: "all" }}
              onClick={() => {
                if (isCriticalPath && fromZone) handleZoneClick(fromZone.id)
              }}
              onTouchEnd={(e) => {
                if (isCriticalPath && fromZone) { e.preventDefault(); handleZoneClick(fromZone.id) }
              }}>
              {/* Wider invisible hit area for connections */}
              <path d={pathD} fill="none" stroke="transparent" strokeWidth="12" />
              <path d={pathD} fill="none"
                stroke={isCriticalPath ? "#ef444430" : conn.type === "cross" ? `${centerColor}15` : "rgba(255,255,255,0.06)"}
                strokeWidth={isCriticalPath ? "1.2" : "0.6"} strokeLinecap="round" />
              {isCriticalPath && (
                <circle r="1.5" fill="#ef4444" opacity="0.6">
                  <animateMotion dur="2s" repeatCount="indefinite" path={pathD} />
                  <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          )
        })}

        {allZones.map(zone => {
          const pos = zonePositions[zone.id]
          if (!pos) return null
          const isHovered = hoveredZone === zone.id
          const isSelected = selectedZone === zone.id
          const nodeR = isHovered || isSelected ? 12 : 10
          const glowFilter = zone.status === "critical" ? `url(#${sid("brain-glow-red")})` : zone.status === "elevated" ? `url(#${sid("brain-glow-amber")})` : `url(#${sid("brain-glow-green")})`
          const dimmed = activeHemisphere !== null && zone.hemisphere !== activeHemisphere

          return (
            <g key={zone.id} className="cursor-pointer"
              onMouseEnter={() => setHoveredZone(zone.id)}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => handleZoneClick(zone.id)}
              onTouchEnd={(e) => { e.preventDefault(); handleZoneClick(zone.id) }}
              opacity={dimmed ? 0.15 : 1}
              style={{ transition: "opacity 0.3s", pointerEvents: "all" }}>

              {zone.status === "critical" && !dimmed && (
                <>
                  <circle cx={pos.x} cy={pos.y} r={nodeR + 4} fill="none" stroke={zone.color} strokeWidth="0.5" opacity="0.2">
                    <animate attributeName="r" values={`${nodeR + 2};${nodeR + 10};${nodeR + 2}`} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={pos.x} cy={pos.y} r={nodeR + 2} fill="none" stroke={zone.color} strokeWidth="0.3" opacity="0.15">
                    <animate attributeName="r" values={`${nodeR + 1};${nodeR + 7};${nodeR + 1}`} dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.2;0;0.2" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                </>
              )}

              {zone.status === "elevated" && !dimmed && (
                <circle cx={pos.x} cy={pos.y} r={nodeR + 3} fill="none" stroke={zone.color} strokeWidth="0.4" opacity="0.1">
                  <animate attributeName="r" values={`${nodeR + 1};${nodeR + 6};${nodeR + 1}`} dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.15;0;0.15" dur="3s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Invisible touch target (larger) */}
              <circle cx={pos.x} cy={pos.y} r={nodeR + 10} fill="transparent" />

              <circle cx={pos.x} cy={pos.y} r={nodeR + 3} fill={zone.color} opacity="0.04" filter={glowFilter} />

              <circle cx={pos.x} cy={pos.y} r={nodeR}
                fill={`${zone.color}08`} stroke={zone.color}
                strokeWidth={isSelected ? "2" : isHovered ? "1.5" : "1"}
                opacity={isSelected ? "0.8" : isHovered ? "0.6" : "0.3"}
                style={{ transition: "all 0.2s" }} />

              <circle cx={pos.x} cy={pos.y} r={nodeR * 0.55}
                fill={zone.color}
                opacity={zone.status === "critical" ? "0.6" : zone.status === "elevated" ? "0.35" : zone.status === "active" ? "0.25" : "0.1"}>
                {zone.status === "critical" && (
                  <animate attributeName="opacity" values="0.6;0.25;0.6" dur="1.5s" repeatCount="indefinite" />
                )}
              </circle>

              <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle"
                fill={zone.color} fontSize="10" fontFamily="monospace" fontWeight="900"
                opacity={isHovered || isSelected ? "0.9" : "0.7"}>
                {zone.intensity}
              </text>

              <text x={pos.labelX} y={pos.labelY} textAnchor={pos.labelAnchor}
                fill={zone.color} fontSize="8.5" fontFamily="monospace" fontWeight="800"
                letterSpacing="0.08em"
                opacity={isHovered || isSelected ? "0.8" : dimmed ? "0.1" : "0.35"}
                style={{ transition: "opacity 0.2s" }}>
                {zone.label}
              </text>
              <text x={pos.labelX} y={pos.labelY + 11} textAnchor={pos.labelAnchor}
                fill={zone.color} fontSize="6.5" fontFamily="monospace" fontWeight="700"
                opacity={isHovered || isSelected ? "0.55" : "0"}
                style={{ transition: "opacity 0.2s" }}>
                {zone.status.toUpperCase()}
              </text>

              {/* Tooltip removed -- detail panel shows on click below SVG */}
            </g>
          )
        })}

        <g className="cursor-pointer" style={{ pointerEvents: "all" }}
          onClick={() => onSelectHemisphere(activeHemisphere === "left" ? null : "left")}
          onTouchEnd={(e) => { e.preventDefault(); onSelectHemisphere(activeHemisphere === "left" ? null : "left") }}>
          <rect x="10" y="238" width="100" height="28" fill="transparent" />
          <text x="60" y="249" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace"
            fontWeight="900" letterSpacing="0.12em" opacity={activeHemisphere === "right" ? "0.06" : activeHemisphere === "left" ? "0.6" : "0.25"}>
            LOGIC CORTEX
          </text>
          <text x="60" y="262" textAnchor="middle" fill="#10b981" fontSize="6" fontFamily="monospace"
            fontWeight="700" letterSpacing="0.1em" opacity={activeHemisphere === "right" ? "0.04" : activeHemisphere === "left" ? "0.35" : "0.12"}>
            Executive Function
          </text>
        </g>
        <g className="cursor-pointer" style={{ pointerEvents: "all" }}
          onClick={() => onSelectHemisphere(activeHemisphere === "right" ? null : "right")}
          onTouchEnd={(e) => { e.preventDefault(); onSelectHemisphere(activeHemisphere === "right" ? null : "right") }}>
          <rect x="250" y="238" width="100" height="28" fill="transparent" />
          <text x="300" y="249" textAnchor="middle" fill="#ef4444" fontSize="9" fontFamily="monospace"
            fontWeight="900" letterSpacing="0.12em" opacity={activeHemisphere === "left" ? "0.06" : activeHemisphere === "right" ? "0.6" : "0.25"}>
            LIMBIC SYSTEM
          </text>
          <text x="300" y="262" textAnchor="middle" fill="#ef4444" fontSize="6" fontFamily="monospace"
            fontWeight="700" letterSpacing="0.1em" opacity={activeHemisphere === "left" ? "0.04" : activeHemisphere === "right" ? "0.35" : "0.12"}>
            Emotional Activity
          </text>
        </g>

        <text x="180" y="280" textAnchor="middle" fill={centerColor} fontSize="7" fontFamily="monospace"
          fontWeight="800" letterSpacing="0.12em" opacity="0.2">
          CORPUS CALLOSUM
        </text>

        <circle cx="180" cy="130" r="13" fill={`${centerColor}05`} stroke={centerColor} strokeWidth="0.6" opacity="0.2">
          <animate attributeName="r" values="12;15;12" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.3;0.15" dur="4s" repeatCount="indefinite" />
        </circle>
        <text x="180" y="131" textAnchor="middle" dominantBaseline="middle"
          fill={centerColor} fontSize="11" fontFamily="monospace" fontWeight="900" opacity="0.6">
          {state.stabilityIndex}
        </text>
      </svg>

      {/* Selected Zone Detail Panel */}
      <AnimatePresence>
        {selectedZone && (() => {
          const zone = allZones.find(z => z.id === selectedZone)
          if (!zone) return null

          const relatedChains = Object.entries(state.causeEffectChains).filter(([key]) => {
            if (zone.id === "impulse" || zone.id === "fear") return key === "revenge" || key === "cutWinners"
            if (zone.id === "ego") return key === "sizeEscalation"
            if (zone.id === "emotion") return key === "overtrading"
            if (zone.id === "discipline") return key === "revenge" || key === "sizeEscalation"
            if (zone.id === "patience") return key === "cutWinners"
            if (zone.id === "structure") return key === "overtrading"
            return false
          })

          return (
            <motion.div key={selectedZone} ref={detailPanelRef}
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
              onAnimationComplete={() => {
                detailPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
              }}
              className="overflow-hidden">
              <div className="mx-3 mb-2 rounded-xl overflow-hidden"
                style={{ backgroundColor: `${zone.color}05`, border: `1px solid ${zone.color}12` }}>
                {/* Zone header */}
                <div className="px-3 py-2.5 flex items-center gap-2.5" style={{ borderBottom: `1px solid ${zone.color}08` }}>
                  <motion.div className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: zone.color }}
                    animate={{ boxShadow: [`0 0 0px ${zone.color}00`, `0 0 8px ${zone.color}40`, `0 0 0px ${zone.color}00`] }}
                    transition={{ duration: 2, repeat: Infinity }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-black tracking-wider" style={{ color: zone.color }}>{zone.label}</span>
                      <span className="text-[7px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider font-bold"
                        style={{ backgroundColor: `${zone.color}10`, color: zone.color, border: `1px solid ${zone.color}20` }}>
                        {zone.status}
                      </span>
                    </div>
                    <p className="text-[8px] font-mono text-white/20 mt-0.5">{zone.description}</p>
                  </div>
                  <button onClick={() => setSelectedZone(null)} className="text-white/20 hover:text-white/40 transition-colors p-1">
                    <ChevronRight className="w-3 h-3 rotate-90" />
                  </button>
                </div>

                {/* Intensity bar */}
                <div className="px-3 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[7px] font-mono text-white/15 uppercase tracking-wider">Intensity</span>
                    <span className="text-[10px] font-mono font-black tabular-nums" style={{ color: zone.color }}>{zone.intensity}/100</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
                    <motion.div className="h-full rounded-full"
                      style={{ backgroundColor: zone.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${zone.intensity}%`, opacity: 0.5 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
                  </div>
                </div>

                {/* Related patterns */}
                {relatedChains.length > 0 && (
                  <div className="px-3 py-2" style={{ borderTop: `1px solid ${zone.color}06` }}>
                    <span className="text-[7px] font-mono text-white/15 uppercase tracking-wider">Connected Patterns</span>
                    {relatedChains.map(([key, chain]) => (
                      <div key={key} className="mt-1.5 px-2 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-2.5 h-2.5 text-white/15" />
                          <span className="text-[8px] font-mono font-bold text-white/25">{key.replace(/([A-Z])/g, " $1").toUpperCase()}</span>
                          <div className="flex-1" />
                          <span className="text-[7px] font-mono font-bold" style={{ color: chain.costEstimate.includes("-") ? "#ef4444" : "#10b981" }}>
                            {chain.costEstimate}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                          <span className="text-[7px] font-mono text-white/12">{chain.trigger.substring(0, 60)}...</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action buttons */}
                <div className="px-3 py-2 flex gap-1.5" style={{ borderTop: `1px solid ${zone.color}06` }}>
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg transition-all group"
                    style={{ backgroundColor: `${zone.color}06`, border: `1px solid ${zone.color}12` }}
                    onClick={() => onAsk(`Deep analyze my ${zone.label} zone. Intensity: ${zone.intensity}/100. Status: ${zone.status}. ${zone.description}. What patterns do you see?`)}>
                    <Brain className="w-3 h-3 group-hover:text-white/40 transition-colors" style={{ color: `${zone.color}60` }} />
                    <span className="text-[8px] font-mono font-bold group-hover:text-white/40 transition-colors" style={{ color: `${zone.color}80` }}>Deep Analyze</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all group"
                    onClick={() => {
                      onSelectHemisphere(zone.hemisphere)
                      setSelectedZone(null)
                    }}>
                    <Eye className="w-3 h-3 text-white/15 group-hover:text-white/30" />
                    <span className="text-[8px] font-mono text-white/20 group-hover:text-white/35 font-bold">Explore {zone.hemisphere === "left" ? "Logic" : "Limbic"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })()}
      </AnimatePresence>

      <div className="flex items-center justify-center gap-1.5 pb-1">
        <div className="w-1 h-1 rounded-full bg-white/10" />
        <span className="text-[7px] font-mono text-white/10 uppercase tracking-wider">
          {selectedZone ? "Zone expanded below" : "Click nodes to explore zones"}
        </span>
        <div className="w-1 h-1 rounded-full bg-white/10" />
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   NEURAL INTERCONNECTION SYSTEM
   Deep breakdown: How left brain (discipline, patience, structure) connects
   to right brain (impulse, fear, ego, volatility). Why working on one
   requires working on all. A rabbit-hole explorer for the mind OS.
   ══════════════════════════════════════════════════════════════════════════ */

// The interconnection graph -- each concept connects to others with explanations
interface NeuralNode {
  id: string
  label: string
  hemisphere: "left" | "right"
  category: string
  color: string
  x: number // SVG position 0-100
  y: number // SVG position 0-100
  description: string
  deepDive: string
  workOnIt: string
}

interface NeuralEdge {
  from: string
  to: string
  label: string
  why: string
  strength: number // 0-1
  type: "feeds" | "blocks" | "requires" | "amplifies"
}

interface DeepLayer {
  concept: string
  subConcepts: Array<{ name: string; connection: string; actionable: string }>
}

function buildInterconnectionGraph(state: BehavioralState): { nodes: NeuralNode[]; edges: NeuralEdge[]; deepLayers: DeepLayer[] } {
  const nodes: NeuralNode[] = [
    // LEFT BRAIN -- Logic Cortex
    { id: "discipline", label: "Discipline", hemisphere: "left", category: "Logic Cortex",
      color: "#10b981", x: 15, y: 18,
      description: "Rule adherence. The ability to follow your trading plan even when emotions scream otherwise.",
      deepDive: "Discipline is not willpower. It's the absence of internal conflict. When your system is trusted, discipline is effortless. When fear or ego dominate, discipline requires enormous energy that depletes over the session.",
      workOnIt: "Build rule-following streaks. Start with 1 rule per session. Track adherence not P&L. Reward process, not outcome." },
    { id: "patience", label: "Patience", hemisphere: "left", category: "Logic Cortex",
      color: "#06b6d4", x: 15, y: 45,
      description: "Waiting for A+ setups. The ability to sit still when there is nothing to do.",
      deepDive: "Patience is the output of emotional regulation. You cannot be patient if fear of missing out is active. Patience requires trust in your system and acceptance that not trading IS a valid position.",
      workOnIt: "Set a 'no trade first 30 min' rule. Count missed setups you didn't chase. Review them -- most would have been losers." },
    { id: "structure", label: "Structure", hemisphere: "left", category: "Logic Cortex",
      color: "#8b5cf6", x: 15, y: 72,
      description: "Pre-session routines, checklists, journaling. The scaffolding that holds discipline in place.",
      deepDive: "Structure reduces decision fatigue. Every decision you automate is one less opening for impulse. Structure is the immune system of the trader -- it doesn't prevent emotions, it prevents emotions from reaching the order button.",
      workOnIt: "Build a 5-point pre-session checklist. Define exact entry/exit rules. Journal every trade within 5 minutes of close." },
    { id: "analysis", label: "Analysis", hemisphere: "left", category: "Logic Cortex",
      color: "#3b82f6", x: 15, y: 99,
      description: "Data-driven decision making. Reading charts, levels, context before acting.",
      deepDive: "Analysis is the conscious mind's contribution. But analysis paralysis is the shadow side -- when fear disguises itself as 'needing more data'. Real analysis takes 2-5 minutes. Beyond that, you're procrastinating from fear.",
      workOnIt: "Set a timer: 3 minutes to decide. If no edge after 3 min, move on. Review: how many entries improved after minute 3? Almost none." },

    // RIGHT BRAIN -- Limbic System
    { id: "impulse", label: "Impulse", hemisphere: "right", category: "Limbic System",
      color: "#ef4444", x: 85, y: 18,
      description: "The urge to act NOW. Bypasses analysis entirely. The instant-gratification circuit.",
      deepDive: "Impulse is not your enemy -- it's your survival brain misfiring in a non-survival context. Markets trigger the same neural pathways as physical threats. Your amygdala doesn't know the difference between a lion and a red candle.",
      workOnIt: "Implement a 10-second rule: after any urge, wait 10 seconds. If the setup is real, it'll still be there. Track impulse trades separately -- see their win rate." },
    { id: "fear", label: "Fear", hemisphere: "right", category: "Limbic System",
      color: "#f59e0b", x: 85, y: 45,
      description: "Fear of loss, fear of missing out, fear of being wrong. The three-headed hydra.",
      deepDive: "Fear is information. It tells you your position size is too large, your system is untested, or your ego is attached to the outcome. Fear is not the problem -- ignoring what fear is telling you is the problem.",
      workOnIt: "When fear appears, ask: 'What is this fear protecting?' Usually it's ego, not capital. Reduce size until fear disappears. That's your real risk tolerance." },
    { id: "ego", label: "Ego", hemisphere: "right", category: "Limbic System",
      color: "#ec4899", x: 85, y: 72,
      description: "The need to be right. Identity attachment to trades. 'I am a good trader' becomes 'I cannot take a loss.'",
      deepDive: "Ego transforms every trade from a probability game into an identity game. When ego is active, a loss isn't a cost of business -- it's a personal attack. This is why revenge trading exists: ego demands restoration.",
      workOnIt: "Reframe: you are not your last trade. Track your 'ego score' -- how much emotional energy did you spend on being right vs following process?" },
    { id: "volatility_e", label: "Volatility", hemisphere: "right", category: "Limbic System",
      color: "#f97316", x: 85, y: 99,
      description: "Emotional swings. The distance between your highest high and lowest low in a session.",
      deepDive: "Emotional volatility is the meta-indicator. High volatility means your internal state is driving decisions, not your system. The goal is not to feel nothing -- it's to keep the amplitude within a range where logic can still override.",
      workOnIt: "Rate your emotional state 1-10 before every trade. If it's above 7 or below 3, you're outside the zone. Step away." },
  ]

  // Cross-hemisphere connections -- the web of interdependence
  const edges: NeuralEdge[] = [
    // Discipline connections
    { from: "discipline", to: "impulse", label: "Discipline blocks Impulse", type: "blocks", strength: 0.9,
      why: "Discipline is the direct counter to impulse. But discipline alone is not enough -- if fear is active, discipline depletes faster. You need patience and structure to sustain discipline." },
    { from: "discipline", to: "fear", label: "Discipline requires Fear management", type: "requires", strength: 0.7,
      why: "When fear is high, discipline costs enormous mental energy. You can white-knuckle through a few trades, but fear will eventually break discipline. You must address fear at the root." },
    { from: "discipline", to: "ego", label: "Ego undermines Discipline", type: "blocks", strength: 0.6,
      why: "Ego says 'I know better than my rules.' Every time you override your system because you 'feel' a trade, ego is driving. Discipline requires ego surrender." },
    { from: "discipline", to: "patience", label: "Discipline enables Patience", type: "feeds", strength: 0.8,
      why: "Discipline to wait IS patience. They are two expressions of the same neural circuit -- the prefrontal cortex overriding the amygdala." },
    { from: "discipline", to: "structure", label: "Structure sustains Discipline", type: "requires", strength: 0.85,
      why: "Discipline without structure is willpower. Willpower is finite. Structure automates discipline so it doesn't drain your mental energy." },

    // Impulse connections
    { from: "impulse", to: "fear", label: "Fear triggers Impulse", type: "amplifies", strength: 0.9,
      why: "FOMO is fear of missing out. Revenge trading is fear of loss realized. Impulse is almost always fear in disguise. Address the fear, and impulse reduces automatically." },
    { from: "impulse", to: "ego", label: "Ego feeds Impulse", type: "feeds", strength: 0.7,
      why: "Ego demands action. 'I should be trading.' 'I can catch this move.' Ego cannot sit still because sitting still feels like losing." },
    { from: "impulse", to: "volatility_e", label: "Impulse creates Volatility", type: "amplifies", strength: 0.85,
      why: "Every impulse trade creates an emotional spike. Win or lose, the spike destabilizes your baseline. Multiple impulse trades create compounding volatility." },
    { from: "impulse", to: "patience", label: "Impulse destroys Patience", type: "blocks", strength: 0.95,
      why: "You cannot be impulsive and patient simultaneously. They are mutually exclusive neural states. Impulse is the amygdala hijacking the prefrontal cortex." },

    // Fear connections
    { from: "fear", to: "patience", label: "Fear erodes Patience", type: "blocks", strength: 0.8,
      why: "Fear says 'act now or lose forever.' This is the FOMO circuit. Fear of missing out is the #1 patience destroyer. It makes every passing candle feel like a missed opportunity." },
    { from: "fear", to: "ego", label: "Fear protects Ego", type: "feeds", strength: 0.75,
      why: "Fear of being wrong is ego protection. Fear of loss is identity protection. These are not rational fears -- they are the ego's defense mechanism against the reality of uncertainty." },
    { from: "fear", to: "analysis", label: "Fear disguises as Analysis", type: "amplifies", strength: 0.6,
      why: "Analysis paralysis is fear wearing an intellectual costume. 'I need more confirmation' often means 'I'm afraid to commit.' Real analysis is fast. Hesitation is fear." },
    { from: "fear", to: "volatility_e", label: "Fear spikes Volatility", type: "amplifies", strength: 0.8,
      why: "Each fear episode creates a cortisol spike. Multiple spikes per session create cascading emotional volatility. The body remembers even when the mind tries to reset." },

    // Ego connections
    { from: "ego", to: "structure", label: "Ego resists Structure", type: "blocks", strength: 0.65,
      why: "Structure constrains ego. 'I don't need a checklist, I can see the trade.' Ego believes it is above process. This is why many experienced traders blow up -- they outgrow their structure." },
    { from: "ego", to: "volatility_e", label: "Ego amplifies Volatility", type: "amplifies", strength: 0.7,
      why: "Ego turns small losses into identity crises. A $50 loss becomes 'I'm a terrible trader.' This emotional amplification creates volatility far beyond what the actual P&L warrants." },

    // Structure connections
    { from: "structure", to: "patience", label: "Structure enables Patience", type: "feeds", strength: 0.8,
      why: "When you have a checklist, patience becomes mechanical. 'Is the setup meeting all 5 criteria?' If no, don't trade. Structure removes the emotional decision from the equation." },
    { from: "structure", to: "analysis", label: "Structure channels Analysis", type: "feeds", strength: 0.75,
      why: "Structure turns analysis from an open-ended anxiety spiral into a bounded, repeatable process. Check these 3 things. If yes, trade. If no, wait." },

    // Volatility connections
    { from: "volatility_e", to: "discipline", label: "Volatility breaks Discipline", type: "blocks", strength: 0.85,
      why: "When emotional volatility is high, the prefrontal cortex goes offline. You literally cannot access rational thought. Discipline becomes impossible -- not because of willpower failure, but because of neurochemistry." },
  ]

  // Deep layers -- rabbit hole for each concept
  const deepLayers: DeepLayer[] = [
    { concept: "discipline", subConcepts: [
      { name: "Rule Adherence", connection: "The measurable output of discipline. Track it daily.", actionable: "Score yourself 0-10 after each session on rule-following." },
      { name: "Willpower Reserve", connection: "Discipline drains willpower. Structure replenishes it.", actionable: "Front-load structure in your routine to preserve willpower for market hours." },
      { name: "Decision Fatigue", connection: "Every discretionary decision costs discipline. Automate what you can.", actionable: "Pre-define your watchlist, size, and max trades before session opens." },
      { name: "Consistency Streak", connection: `Current: ${state.consistencyStreak}d. Each day builds neural pathways.`, actionable: "Protect your streak above all. One disciplined loss > one lucky win." },
    ]},
    { concept: "impulse", subConcepts: [
      { name: "Amygdala Hijack", connection: "The 6-second window where emotion overrides logic.", actionable: "Implement a physical barrier: remove hotkeys, add confirmation dialogs." },
      { name: "Dopamine Loop", connection: "Winning impulse trades create addiction. The brain craves the rush.", actionable: "Track impulse trade win rate separately. See the real cost: usually 30-40% win rate." },
      { name: "Trigger Mapping", connection: "Every impulse has a trigger. Find yours: big moves? Losses? Boredom?", actionable: "Journal what happened 30 seconds before every impulse trade." },
      { name: "Cooldown Protocol", connection: "After impulse trades, the brain needs 15-30 minutes to reset.", actionable: "Mandatory break after any impulse entry. Walk away from the screen." },
    ]},
    { concept: "fear", subConcepts: [
      { name: "FOMO Circuit", connection: "Fear of missing out activates the same brain region as physical pain.", actionable: "Screenshot 'missed' trades. Review in 1 hour. Most reversed or faded." },
      { name: "Loss Aversion", connection: "Losses feel 2.5x more painful than equivalent gains feel good.", actionable: "Pre-accept the loss before entry. 'I am paying $X for this information.'" },
      { name: "Uncertainty Intolerance", connection: "Fear of not knowing is worse than fear of losing.", actionable: "Define your edge as a probability: 'I win 55% of the time.' Embrace the 45%." },
      { name: "Catastrophizing", connection: "One loss becomes 'I'll lose everything.' The brain extrapolates.", actionable: "Ask: 'What is the ACTUAL worst case?' Usually it's a defined risk amount." },
    ]},
    { concept: "ego", subConcepts: [
      { name: "Identity Attachment", connection: "'I am a trader' becomes 'I must prove I am a good trader.'", actionable: "Separate identity from performance. You are not your P&L." },
      { name: "Sunk Cost Trap", connection: "Ego says 'I've been in this trade too long to exit now.'", actionable: "Ask: 'Would I enter this trade RIGHT NOW?' If no, exit. Prior cost is irrelevant." },
      { name: "Revenge Mechanism", connection: `Revenge risk: ${state.revengeRisk}. Ego demands payback from the market.`, actionable: "After a loss, close the platform for 10 minutes. The market doesn't know your P&L." },
      { name: "Comparison Trap", connection: "Comparing your P&L to others activates ego's competitive circuit.", actionable: "Unfollow P&L screenshots. Compare only to your own process metrics." },
    ]},
    { concept: "patience", subConcepts: [
      { name: "Wait Tolerance", connection: "How long can you sit with no trades before acting?", actionable: "Track 'time between trades.' Aim for consistency, not frequency." },
      { name: "Setup Standards", connection: "Patience = refusing B-setups when A-setups exist.", actionable: "Grade every trade A/B/C before entry. Only take A's for one week. Compare results." },
      { name: "Boredom Threshold", connection: "Boredom triggers impulse. Markets are boring 80% of the time.", actionable: "Have a non-trading activity ready. Read, journal, review -- anything but stare at charts." },
      { name: "Trust in Edge", connection: "You can only be patient if you trust your setups will come.", actionable: "Backtest. See proof that your setups appear X times per week. Trust the data." },
    ]},
    { concept: "structure", subConcepts: [
      { name: "Pre-Session Ritual", connection: "The 10 minutes before market open determine the entire session.", actionable: "Build a ritual: review levels, check news, set alerts, rate emotional state." },
      { name: "Rule Set", connection: `Discipline score: ${state.disciplineScore}. Rules are the skeleton.`, actionable: "Write 5 non-negotiable rules. Print them. Put them next to your screen." },
      { name: "Post-Session Review", connection: "Without review, mistakes repeat. With review, mistakes compound into wisdom.", actionable: "Journal every trade within 5 minutes of session close. Include emotional state." },
      { name: "Circuit Breakers", connection: "Automated stops: max daily loss, max trades, max consecutive losses.", actionable: "Define your hard limits. Program them. When hit, walk away -- no exceptions." },
    ]},
    { concept: "volatility_e", subConcepts: [
      { name: "Emotional Amplitude", connection: `Current: ${state.emotionVolatility}%. The gap between your highs and lows.`, actionable: "Track emotional state every hour. Aim for <20% swing across a session." },
      { name: "Cortisol Cascade", connection: "Stress hormones compound. Each spike takes 20-30 min to clear.", actionable: "After any high-emotion event, take a mandatory 15-min break." },
      { name: "Baseline Management", connection: "Start the day at a neutral 5/10 emotional state.", actionable: "If your pre-session state is >7 or <3, reduce size by 50% or skip entirely." },
      { name: "Recovery Rate", connection: "How fast do you return to baseline after a spike?", actionable: "Time yourself. After a loss, how many minutes until calm? Train to reduce this." },
    ]},
    { concept: "analysis", subConcepts: [
      { name: "Decision Speed", connection: `Current: ${state.decisionLatency}. Fast isn't smart, slow isn't thorough.`, actionable: "Aim for 2-5 minute analysis. Set a timer. After 5 minutes, decide or pass." },
      { name: "Confirmation Bias", connection: "Looking for evidence that supports what you already want to do.", actionable: "Before analysis, write down your bias. Then look for disconfirming evidence first." },
      { name: "Information Overload", connection: "More indicators = more confusion, not more clarity.", actionable: "Use max 3 indicators. Master them. Add more only when you outperform with 3." },
      { name: "Paralysis Recovery", connection: "Frozen by analysis? It's fear, not thoroughness.", actionable: "Ask: 'Do I have my 3 criteria met?' If yes, enter. The rest is noise." },
    ]},
  ]

  return { nodes, edges, deepLayers }
}

function NeuralInterconnectionSystem({ state, onAsk }: { state: BehavioralState; onAsk: (text: string) => void }) {
  const _uid = useId()
  const sid = (n: string) => `${_uid.replace(/:/g, "")}-${n}`
  const { nodes, edges, deepLayers } = useMemo(() => buildInterconnectionGraph(state), [state])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null)
  const detailRef = useRef<HTMLDivElement>(null)

  const selectedNodeData = nodes.find(n => n.id === selectedNode)
  const connectedEdges = edges.filter(e => e.from === selectedNode || e.to === selectedNode)
  const connectedNodeIds = new Set(connectedEdges.flatMap(e => [e.from, e.to]))
  const selectedDeep = deepLayers.find(d => d.concept === selectedNode)

  // Auto-scroll to detail panel when node selected
  useEffect(() => {
    if (selectedNode && detailRef.current) {
      setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 150)
    }
  }, [selectedNode])

  const edgeTypeColor = (type: NeuralEdge["type"]) => {
    switch (type) {
      case "feeds": return "#10b981"
      case "blocks": return "#ef4444"
      case "requires": return "#f59e0b"
      case "amplifies": return "#8b5cf6"
    }
  }

  return (
    <div className="border-b border-white/[0.04]">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 pt-4 pb-2.5">
        <Layers className="w-4 h-4 text-white/25" />
        <span className="text-[11px] font-mono text-white/30 uppercase tracking-[0.12em] font-black">Neural Interconnection Map</span>
        <div className="flex-1 h-px bg-white/[0.04]" />
        {selectedNode && (
          <button onClick={() => { setSelectedNode(null); setExpandedLayer(null) }}
            className="text-[9px] font-mono text-white/30 hover:text-white/50 px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] transition-all">
            Reset View
          </button>
        )}
      </div>

      {/* Interconnection SVG Map */}
      <div className="px-3">
        <svg viewBox="0 0 200 135" className="w-full max-w-full" style={{ height: "auto", minHeight: 260, maxHeight: 360 }}>
          <defs>
            <filter id={sid("glow-conn")}>
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id={sid("glow-node")}>
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Hemisphere labels -- pushed to very top with clear gap before nodes */}
          <text x="25" y="7" fill="rgba(16,185,129,0.25)" fontSize="5.5" fontFamily="monospace" fontWeight="900" textAnchor="middle">LOGIC CORTEX</text>
          <text x="175" y="7" fill="rgba(239,68,68,0.25)" fontSize="5.5" fontFamily="monospace" fontWeight="900" textAnchor="middle">LIMBIC SYSTEM</text>

          {/* Center divider */}
          <line x1="100" y1="12" x2="100" y2="118" stroke="rgba(255,255,255,0.05)" strokeWidth="0.4" strokeDasharray="3 3" />

          {/* Edges */}
          {edges.map((edge, ei) => {
            const fromNode = nodes.find(n => n.id === edge.from)!
            const toNode = nodes.find(n => n.id === edge.to)!
            const yOff = 15
            const fx = fromNode.x * 2; const fy = fromNode.y + yOff
            const tx = toNode.x * 2; const ty = toNode.y + yOff
            const isActive = selectedNode === null || connectedNodeIds.has(edge.from) && connectedNodeIds.has(edge.to)
            const isDirectlyConnected = edge.from === selectedNode || edge.to === selectedNode
            const midX = (fx + tx) / 2
            const midY = (fy + ty) / 2 + (ei % 2 === 0 ? -8 : 8)
            const opacity = selectedNode === null ? 0.2 : isDirectlyConnected ? 0.7 : 0.05

            return (
              <g key={`edge-${ei}`}>
                <path
                  d={`M ${fx} ${fy} Q ${midX} ${midY} ${tx} ${ty}`}
                  fill="none"
                  stroke={edgeTypeColor(edge.type)}
                  strokeWidth={isDirectlyConnected ? 1.8 : 0.6}
                  opacity={opacity}
                  strokeDasharray={edge.type === "requires" ? "4 2" : edge.type === "blocks" ? "2 2" : "none"}
                  filter={isDirectlyConnected ? `url(#${sid("glow-conn")})` : undefined}
                />
                {isDirectlyConnected && (
                  <circle r="2" fill={edgeTypeColor(edge.type)} opacity="0.8">
                    <animateMotion dur="3s" repeatCount="indefinite"
                      path={`M ${fx} ${fy} Q ${midX} ${midY} ${tx} ${ty}`} />
                  </circle>
                )}
              </g>
            )
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const nx = node.x * 2; const ny = node.y + 15
            const isSelected = selectedNode === node.id
            const isConnected = selectedNode === null || connectedNodeIds.has(node.id)
            const isHovered = hoveredNode === node.id
            const dimmed = selectedNode !== null && !isConnected

            return (
              <g key={node.id} className="cursor-pointer"
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}>
                {/* Outer glow ring */}
                {(isSelected || isHovered) && (
                  <circle cx={nx} cy={ny} r={isSelected ? 14 : 11} fill="none" stroke={node.color} strokeWidth={isSelected ? 0.6 : 0.4} opacity={isSelected ? 0.6 : 0.4}
                    filter={`url(#${sid("glow-node")})`}>
                    <animate attributeName="r" values={isSelected ? "12;15;12" : "10;12;10"} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values={isSelected ? "0.5;0.7;0.5" : "0.3;0.5;0.3"} dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Node circle -- bigger, clearer */}
                <circle cx={nx} cy={ny} r={isSelected ? 7 : 5.5} fill={`${node.color}${dimmed ? "08" : isSelected ? "30" : "18"}`}
                  stroke={node.color} strokeWidth={isSelected ? 1.5 : 0.8}
                  opacity={dimmed ? 0.15 : 0.9} />
                {/* Inner dot */}
                <circle cx={nx} cy={ny} r={isSelected ? 2.5 : 2} fill={node.color} opacity={dimmed ? 0.1 : 0.8} />
                {/* Label -- bigger, more readable */}
                <text x={nx} y={ny - (isSelected ? 10 : 8.5)}
                  textAnchor="middle" fill={dimmed ? "rgba(255,255,255,0.08)" : isSelected ? node.color : `${node.color}B0`}
                  fontSize={isSelected ? "5.5" : "4.5"} fontFamily="monospace" fontWeight="900">
                  {node.label}
                </text>
                {/* Category sublabel */}
                {(isSelected || isHovered) && (
                  <text x={nx} y={ny + (isSelected ? 12 : 10)}
                    textAnchor="middle" fill={`${node.color}50`}
                    fontSize="3" fontFamily="monospace" fontWeight="700">
                    {node.hemisphere === "left" ? "Logic" : "Emotion"}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Edge type legend */}
      <div className="flex items-center justify-center gap-4 px-4 py-2.5">
        {(["feeds", "blocks", "requires", "amplifies"] as const).map(type => (
          <div key={type} className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 rounded-full" style={{ backgroundColor: edgeTypeColor(type), opacity: 0.6 }} />
            <span className="text-[8px] font-mono text-white/25 uppercase font-bold tracking-wide">{type}</span>
          </div>
        ))}
      </div>

      {/* ── Selected Node Deep Dive ── */}
      <AnimatePresence>
        {selectedNodeData && (
          <motion.div ref={detailRef} key={selectedNode}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden">
            <div className="px-4 pb-4 space-y-3">
              {/* Node header -- loud and unmissable */}
              <div className="flex items-center gap-3 pt-3">
                <motion.div className="w-4 h-4 rounded-full shrink-0"
                  style={{ backgroundColor: selectedNodeData.color, boxShadow: `0 0 12px ${selectedNodeData.color}40` }}
                  animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                <span className="text-sm font-mono font-black tracking-wide" style={{ color: selectedNodeData.color }}>
                  {selectedNodeData.label}
                </span>
                <span className="text-[8px] font-mono text-white/25 uppercase tracking-wider px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">
                  {selectedNodeData.category}
                </span>
              </div>

              {/* Description -- readable body size */}
              <p className="text-[11px] font-mono text-white/40 leading-relaxed">{selectedNodeData.description}</p>

              {/* Deep dive text -- clear, readable */}
              <div className="px-4 py-3 rounded-lg bg-white/[0.025] border-l-2" style={{ borderColor: `${selectedNodeData.color}40` }}>
                <p className="text-[10px] font-mono text-white/35 leading-relaxed">{selectedNodeData.deepDive}</p>
              </div>

              {/* How to work on it -- command-style emphasis */}
              <div className="px-4 py-3 rounded-lg" style={{ backgroundColor: `${selectedNodeData.color}08`, border: `1px solid ${selectedNodeData.color}18` }}>
                <span className="text-[9px] font-mono font-black uppercase tracking-wider" style={{ color: `${selectedNodeData.color}80` }}>How to work on this</span>
                <p className="text-[11px] font-mono text-white/40 leading-relaxed mt-1.5 font-bold">{selectedNodeData.workOnIt}</p>
              </div>

              {/* Connected edges -- WHY things are linked */}
              {connectedEdges.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[9px] font-mono text-white/20 uppercase tracking-wider font-black">Why it connects</span>
                  {connectedEdges.map((edge, ei) => {
                    const otherNodeId = edge.from === selectedNode ? edge.to : edge.from
                    const otherNode = nodes.find(n => n.id === otherNodeId)!
                    return (
                      <motion.div key={ei} className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] cursor-pointer hover:border-white/[0.12] hover:bg-white/[0.03] transition-all"
                        initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: ei * 0.04 }}
                        onClick={() => setSelectedNode(otherNodeId)}>
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: otherNode.color }} />
                          <span className="text-[11px] font-mono font-black" style={{ color: otherNode.color }}>{otherNode.label}</span>
                          <div className="flex-1" />
                          <span className="text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-md"
                            style={{ color: edgeTypeColor(edge.type), backgroundColor: `${edgeTypeColor(edge.type)}12`, border: `1px solid ${edgeTypeColor(edge.type)}20` }}>
                            {edge.type}
                          </span>
                        </div>
                        <p className="text-[10px] font-mono text-white/30 leading-relaxed">{edge.why}</p>
                      </motion.div>
                    )
                  })}
                </div>
              )}

              {/* Deep layer -- rabbit hole */}
              {selectedDeep && (
                <div className="pt-1">
                  <button onClick={() => setExpandedLayer(expandedLayer === selectedNode ? null : selectedNode!)}
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.14] transition-all group">
                    <ChevronRight className={`w-4 h-4 text-white/20 transition-transform ${expandedLayer === selectedNode ? "rotate-90" : ""}`} />
                    <span className="text-[10px] font-mono font-black text-white/25 uppercase tracking-wider group-hover:text-white/40">
                      Go Deeper: {selectedNodeData.label}
                    </span>
                    <div className="flex-1" />
                    <span className="text-[8px] font-mono text-white/15 font-bold">{selectedDeep.subConcepts.length} layers</span>
                  </button>

                  <AnimatePresence>
                    {expandedLayer === selectedNode && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
                        className="overflow-hidden">
                        <div className="space-y-2 pt-2.5">
                          {selectedDeep.subConcepts.map((sub, si) => (
                            <motion.div key={si} className="px-4 py-3 rounded-xl border border-white/[0.05] bg-white/[0.015]"
                              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.05 }}>
                              <div className="flex items-center gap-2.5 mb-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedNodeData.color }} />
                                <span className="text-[11px] font-mono font-black text-white/40">{sub.name}</span>
                              </div>
                              <p className="text-[10px] font-mono text-white/25 leading-relaxed mb-2">{sub.connection}</p>
                              <button className="text-[9px] font-mono font-bold px-3 py-1.5 rounded-lg border transition-all hover:border-white/[0.15]"
                                style={{ color: `${selectedNodeData.color}80`, backgroundColor: `${selectedNodeData.color}08`, borderColor: `${selectedNodeData.color}18` }}
                                onClick={() => onAsk(`Deep analysis on "${sub.name}" for ${selectedNodeData.label}: ${sub.actionable}. How does this connect to my current trading psychology profile?`)}>
                                {sub.actionable}
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Ask Copilot about this node */}
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all group mt-2"
                onClick={() => onAsk(`Deep psychological analysis of "${selectedNodeData.label}" in my trading: ${selectedNodeData.deepDive}. Based on my current state (discipline: ${state.disciplineScore}, volatility: ${state.emotionVolatility}%, dominant hemisphere: ${state.dominantHemisphere}), what specific steps should I take?`)}>
                <MessageSquare className="w-4 h-4 text-white/15 group-hover:text-white/30 transition-colors" />
                <span className="text-[10px] font-mono text-white/25 group-hover:text-white/45 transition-colors font-black">
                  Ask Copilot about {selectedNodeData.label}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No selection hint */}
      {!selectedNode && (
        <div className="px-5 pb-4">
          <p className="text-[10px] font-mono text-white/20 text-center leading-relaxed">
            Tap any node to explore how it connects to your trading psychology.
            Each concept links to others -- working on one requires understanding the whole system.
          </p>
        </div>
      )}
    </div>
  )
}

/* ── Collapsible Section ── */
function Section({ title, icon: SectionIcon, defaultOpen = true, accentColor, children }: {
  title: string; icon?: React.ElementType; defaultOpen?: boolean; accentColor?: string; children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  const [hovered, setHovered] = useState(false)
  const accent = accentColor ?? "rgba(168,85,247,0.1)"
  return (
    <div>
      <button onClick={() => setOpen(!open)}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        className="flex items-center gap-2 w-full py-2 group relative">
        <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight className="w-3.5 h-3.5 text-white/25" />
        </motion.div>
        {SectionIcon && (
          <motion.div animate={{ scale: hovered ? 1.15 : 1, opacity: hovered ? 0.6 : 0.25 }} transition={{ duration: 0.2 }}>
            <SectionIcon className="w-3.5 h-3.5 text-white" />
          </motion.div>
        )}
        <span className="text-[12px] text-white/35 uppercase tracking-[0.12em] font-black group-hover:text-white/55 transition-colors">
          {title}
        </span>
        <motion.div className="flex-1 h-px" animate={{ opacity: hovered ? 0.08 : 0.03 }}
          style={{ background: `linear-gradient(90deg, ${accent}, rgba(255,255,255,0))` }} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden">
            <div className="pb-4 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Zone Detail Card ── */
function ZoneCard({ zone, onAsk }: { zone: BrainZone; onAsk?: (text: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <motion.div
      className="rounded-xl overflow-hidden cursor-pointer transition-all duration-200"
      style={{
        backgroundColor: expanded ? `${zone.color}05` : "rgba(255,255,255,0.015)",
        border: `1px solid ${expanded ? `${zone.color}15` : "rgba(255,255,255,0.04)"}`,
      }}
      onClick={() => setExpanded(!expanded)}
      layout
    >
      <div className="flex items-center gap-3 px-3 py-2.5">
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${zone.color}08`, border: `1px solid ${zone.color}15` }}>
            <span className="text-xs font-mono font-black tabular-nums" style={{ color: zone.color }}>{zone.intensity}</span>
          </div>
          {zone.status === "critical" && (
            <motion.div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
              style={{ backgroundColor: "#ef4444" }}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-mono font-bold text-white/50">{zone.label}</span>
            <span className="text-[7px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider font-bold"
              style={{
                backgroundColor: zone.status === "active" ? "#10b98108" : zone.status === "elevated" ? "#f59e0b08" : zone.status === "critical" ? "#ef444408" : "#ffffff05",
                color: zone.status === "active" ? "#10b981" : zone.status === "elevated" ? "#f59e0b" : zone.status === "critical" ? "#ef4444" : "#ffffff30",
                border: `1px solid ${zone.status === "active" ? "#10b98115" : zone.status === "elevated" ? "#f59e0b15" : zone.status === "critical" ? "#ef444415" : "#ffffff08"}`,
              }}>
              {zone.status}
            </span>
          </div>
          <div className="mt-1 h-1 rounded-full bg-white/[0.03] overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ backgroundColor: zone.color }}
              initial={{ width: 0 }} animate={{ width: `${zone.intensity}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }} />
          </div>
        </div>
        <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.15 }}>
          <ChevronRight className="w-3 h-3 text-white/10" />
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-3 pb-3 space-y-2">
              <p className="text-[9px] font-mono text-white/25 leading-relaxed">{zone.description}</p>
              {onAsk && (
                <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all group"
                  onClick={(e) => { e.stopPropagation(); onAsk(`Analyze my ${zone.label} system. Intensity: ${zone.intensity}. Status: ${zone.status}. How can I improve?`) }}>
                  <Brain className="w-2.5 h-2.5 text-white/15 group-hover:text-white/30" />
                  <span className="text-[8px] font-mono text-white/20 group-hover:text-white/35">Deep analyze</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Emotion Chapter Card (NEW -- inline, replaces separate file) ── */
function EmotionChapterCard({ chapter, onAsk }: { chapter: EmotionChapter; onAsk: (text: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<"evidence" | "protocol" | "drill">("evidence")

  return (
    <motion.div className="rounded-xl overflow-hidden" style={{
      backgroundColor: expanded ? `${chapter.color}04` : "rgba(255,255,255,0.015)",
      border: `1px solid ${expanded ? `${chapter.color}12` : "rgba(255,255,255,0.04)"}`,
    }} layout>
      <button onClick={() => setExpanded(!expanded)} className="w-full px-3 py-2.5 flex items-center gap-2.5 group">
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${chapter.color}08`, border: `1px solid ${chapter.color}15` }}>
            <HeartPulse className="w-3.5 h-3.5" style={{ color: chapter.color, opacity: 0.6 }} />
          </div>
          {chapter.intensity > 50 && (
            <motion.div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
              style={{ backgroundColor: chapter.color }}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }} />
          )}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold" style={{ color: chapter.color }}>{chapter.name}</span>
            <span className="text-[7px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider font-bold"
              style={{
                backgroundColor: `${chapter.color}08`,
                color: chapter.intensity > 50 ? chapter.color : `${chapter.color}80`,
                border: `1px solid ${chapter.color}15`,
              }}>
              {chapter.intensity > 60 ? "ACTIVE" : chapter.intensity > 30 ? "WATCH" : "QUIET"}
            </span>
          </div>
          <p className="text-[8px] font-mono text-white/20 mt-0.5 truncate">{chapter.definition}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {chapter.costPerWeek !== "Minimal" && (
            <span className="text-[8px] font-mono font-bold" style={{ color: chapter.color }}>{chapter.costPerWeek}</span>
          )}
          <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight className="w-3.5 h-3.5 text-white/15" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
            <div className="px-3 pb-3 space-y-3">
              {/* Intensity bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[7px] font-mono text-white/15 uppercase tracking-wider">Intensity</span>
                  <span className="text-[8px] font-mono font-bold tabular-nums" style={{ color: chapter.color }}>{chapter.intensity}/100</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ backgroundColor: `${chapter.color}60` }}
                    initial={{ width: 0 }} animate={{ width: `${chapter.intensity}%` }}
                    transition={{ duration: 0.6 }} />
                </div>
              </div>

              {/* Behavior markers */}
              <div className="space-y-1">
                <span className="text-[7px] font-mono text-white/15 uppercase tracking-wider">Behavior Markers</span>
                <div className="flex flex-wrap gap-1">
                  {chapter.markers.map((m, i) => (
                    <span key={i} className="text-[7px] font-mono px-1.5 py-0.5 rounded-md bg-white/[0.02] text-white/20 border border-white/[0.04]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tab bar */}
              <div className="flex gap-1 border-b border-white/[0.04] pb-1">
                {(["evidence", "protocol", "drill"] as const).map(tab => (
                  <button key={tab} onClick={(e) => { e.stopPropagation(); setActiveTab(tab) }}
                    className="text-[8px] font-mono uppercase tracking-wider px-2 py-1 rounded-md transition-all"
                    style={{
                      backgroundColor: activeTab === tab ? `${chapter.color}08` : "transparent",
                      color: activeTab === tab ? chapter.color : "rgba(255,255,255,0.2)",
                      border: `1px solid ${activeTab === tab ? `${chapter.color}15` : "transparent"}`,
                    }}>
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                {activeTab === "evidence" && (
                  <motion.div key="evidence" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="space-y-2">
                    <p className="text-[9px] font-mono text-white/25 leading-relaxed">{chapter.evidence}</p>
                    <p className="text-[8px] font-mono text-white/15 leading-relaxed">{chapter.proofMetric}</p>
                  </motion.div>
                )}
                {activeTab === "protocol" && (
                  <motion.div key="protocol" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="space-y-1.5">
                    {chapter.protocol.map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: `${chapter.color}08`, border: `1px solid ${chapter.color}15` }}>
                          <span className="text-[7px] font-mono font-bold" style={{ color: chapter.color }}>{i + 1}</span>
                        </div>
                        <p className="text-[9px] font-mono text-white/25 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
                {activeTab === "drill" && (
                  <motion.div key="drill" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    className="px-3 py-2.5 rounded-lg" style={{ backgroundColor: `${chapter.color}04`, border: `1px solid ${chapter.color}10` }}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Target className="w-3 h-3" style={{ color: `${chapter.color}60` }} />
                      <span className="text-[8px] font-mono font-bold uppercase tracking-wider" style={{ color: chapter.color }}>Practice Drill</span>
                    </div>
                    <p className="text-[9px] font-mono text-white/25 leading-relaxed">{chapter.drill}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all group"
                  onClick={(e) => { e.stopPropagation(); onAsk(`Deep analyze my ${chapter.name} emotion. Current intensity: ${chapter.intensity}/100. Evidence: ${chapter.evidence}. What patterns do you see and how do I interrupt this circuit?`) }}>
                  <Brain className="w-2.5 h-2.5 text-white/15 group-hover:text-white/30" />
                  <span className="text-[8px] font-mono text-white/20 group-hover:text-white/35">Deep Analyze</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all group"
                  onClick={(e) => { e.stopPropagation(); onAsk(`Help me rewire my ${chapter.name} response. Give me a step-by-step protocol to break this pattern.`) }}>
                  <Zap className="w-2.5 h-2.5 text-white/15 group-hover:text-white/30" />
                  <span className="text-[8px] font-mono text-white/20 group-hover:text-white/35">Rewire</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Cause-Effect Flow Card ── */
function CauseEffectCard({ patternName, severity, chain, icon: Icon, onAsk }: {
  patternName: string; severity: PatternSeverity; chain: CauseEffectChain; icon: React.ElementType; onAsk: (text: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [firingActive, setFiringActive] = useState(false)
  const cfg = {
    critical: { color: "#ef4444", bg: "rgba(239,68,68,0.04)", border: "rgba(239,68,68,0.12)", label: "CRITICAL" },
    warning: { color: "#f59e0b", bg: "rgba(245,158,11,0.04)", border: "rgba(245,158,11,0.12)", label: "WARNING" },
    watch: { color: "#6366f1", bg: "rgba(99,102,241,0.03)", border: "rgba(99,102,241,0.08)", label: "WATCH" },
    clear: { color: "#10b981", bg: "rgba(16,185,129,0.03)", border: "rgba(16,185,129,0.08)", label: "CLEAR" },
  }[severity]

  const flowSteps = [
    { label: "TRIGGER", value: chain.trigger, color: "#6366f1", icon: Zap },
    { label: "EMOTION", value: chain.emotion, color: "#ec4899", icon: HeartPulse },
    { label: "ACTION", value: chain.action, color: "#f59e0b", icon: Activity },
    { label: "RESULT", value: chain.result, color: "#ef4444", icon: Target },
  ]

  useEffect(() => {
    if (expanded && severity !== "clear") {
      const t = setTimeout(() => setFiringActive(true), 200)
      return () => clearTimeout(t)
    }
    setFiringActive(false)
  }, [expanded, severity])

  const incidents = useMemo(() => {
    if (severity === "clear") return []
    const base = severity === "critical" ? 4 : severity === "warning" ? 2 : 1
    return Array.from({ length: base }, (_, i) => ({
      id: `${patternName}-${i}`,
      dayAgo: i + 1,
      label: `${patternName} incident ${i + 1}d ago`,
    }))
  }, [patternName, severity])

  return (
    <motion.div className="rounded-xl overflow-hidden" style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }} layout>
      <button onClick={() => setExpanded(!expanded)} className="w-full px-3 py-2.5 flex items-center gap-2.5 group">
        <div className="relative shrink-0">
          <motion.div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${cfg.color}08`, border: `1px solid ${cfg.color}15` }}>
            <Icon className="w-3.5 h-3.5" style={{ color: cfg.color, opacity: 0.6 }} />
          </motion.div>
          {severity === "critical" && (
            <motion.div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: cfg.color }}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }} />
          )}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold" style={{ color: cfg.color }}>{patternName}</span>
            <span className="text-[7px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider font-bold"
              style={{ backgroundColor: `${cfg.color}10`, color: cfg.color, border: `1px solid ${cfg.color}20` }}>{cfg.label}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {severity !== "clear" && (
              <span className="text-[9px] font-mono text-white/20">Est. cost: {chain.costEstimate}</span>
            )}
            {incidents.length > 0 && (
              <span className="text-[7px] font-mono px-1 py-0.5 rounded bg-white/[0.02] text-white/15 border border-white/[0.04]">
                {incidents.length}x detected
              </span>
            )}
          </div>
        </div>
        <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight className="w-3.5 h-3.5 text-white/15" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
            <div className="px-3 pb-3 space-y-3">

              {/* Neural Pathway SVG */}
              <div className="relative">
                <svg viewBox="0 0 260 30" className="w-full h-7 mb-1">
                  <defs>
                    {flowSteps.map((step, si) => (
                      <radialGradient key={`glow-${si}`} id={`node-glow-${patternName.replace(/\s+/g,"")}-${si}`}>
                        <stop offset="0%" stopColor={step.color} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={step.color} stopOpacity="0" />
                      </radialGradient>
                    ))}
                  </defs>
                  {flowSteps.map((step, si) => {
                    if (si >= flowSteps.length - 1) return null
                    const x1 = 20 + si * 75; const x2 = 20 + (si + 1) * 75
                    return (
                      <g key={`conn-${si}`}>
                        <line x1={x1 + 8} y1={15} x2={x2 - 8} y2={15}
                          stroke={`${step.color}20`} strokeWidth="1" />
                        {firingActive && (
                          <circle r="2" fill={step.color} opacity="0.7">
                            <animateMotion dur="1.2s" repeatCount="indefinite" begin={`${si * 0.3}s`}
                              path={`M${x1 + 8},15 L${x2 - 8},15`} />
                            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.2s" repeatCount="indefinite" begin={`${si * 0.3}s`} />
                          </circle>
                        )}
                        <polygon points={`${x2 - 10},12 ${x2 - 6},15 ${x2 - 10},18`}
                          fill={`${flowSteps[si + 1].color}30`} />
                      </g>
                    )
                  })}
                  {flowSteps.map((step, si) => {
                    const cx = 20 + si * 75
                    return (
                      <g key={`node-${si}`}>
                        {firingActive && (
                          <circle cx={cx} cy={15} r="12"
                            fill={`url(#node-glow-${patternName.replace(/\s+/g,"")}-${si})`}>
                            <animate attributeName="r" values="10;14;10" dur="2s" repeatCount="indefinite" begin={`${si * 0.25}s`} />
                          </circle>
                        )}
                        <circle cx={cx} cy={15} r="7"
                          fill={`${step.color}12`} stroke={step.color} strokeWidth="1"
                          opacity={firingActive ? "0.8" : "0.4"} />
                        <text x={cx} y={15.5} textAnchor="middle" dominantBaseline="middle"
                          fill={step.color} fontSize="5" fontFamily="monospace" fontWeight="800" opacity="0.8">
                          {si + 1}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>

              {/* Flow step details */}
              <div className="space-y-2">
                {flowSteps.map((step, si) => {
                  const StepIcon = step.icon
                  return (
                    <div key={si} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: `${step.color}08`, border: `1px solid ${step.color}15` }}>
                        <StepIcon className="w-2.5 h-2.5" style={{ color: step.color, opacity: 0.6 }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[7px] font-mono font-bold uppercase tracking-wider" style={{ color: step.color }}>{step.label}</span>
                        <p className="text-[9px] font-mono text-white/25 leading-relaxed mt-0.5">{step.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Interrupt protocol */}
              <div className="px-3 py-2.5 rounded-lg" style={{ backgroundColor: `${cfg.color}04`, border: `1px solid ${cfg.color}10` }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Shield className="w-3 h-3" style={{ color: `${cfg.color}60` }} />
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider" style={{ color: cfg.color }}>Interrupt Protocol</span>
                </div>
                <p className="text-[9px] font-mono text-white/25 leading-relaxed">{chain.interruptProtocol}</p>
              </div>

              {/* Incidents */}
              {incidents.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[7px] font-mono text-white/15 uppercase tracking-wider">Recent Incidents</span>
                  {incidents.map(inc => (
                    <button key={inc.id} className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all group"
                      onClick={(e) => { e.stopPropagation(); onAsk(`Analyze this ${patternName} incident from ${inc.dayAgo} day(s) ago. What triggered it and how can I prevent it?`) }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `${cfg.color}40` }} />
                      <span className="text-[8px] font-mono text-white/20 group-hover:text-white/35">{inc.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all group"
                  onClick={(e) => { e.stopPropagation(); onAsk(`Deep analyze my ${patternName} pattern. Severity: ${severity}. Cost: ${chain.costEstimate}. How do I break this cycle?`) }}>
                  <Brain className="w-2.5 h-2.5 text-white/15 group-hover:text-white/30" />
                  <span className="text-[8px] font-mono text-white/20 group-hover:text-white/35">Deep Analyze</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all group"
                  onClick={(e) => { e.stopPropagation(); setFiringActive(!firingActive) }}>
                  <Radio className="w-2.5 h-2.5 text-white/15 group-hover:text-white/30" />
                  <span className="text-[8px] font-mono text-white/20 group-hover:text-white/35">{firingActive ? "Stop Sim" : "Simulate"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Cross-Layer Bridge (NEW -- psychology<>strategy connection) ── */
function CrossLayerBridge({ impacts, onAsk }: { impacts: BehavioralState["crossLayerImpacts"]; onAsk: (text: string) => void }) {
  if (impacts.length === 0) {
    return (
      <div className="px-3 py-3 rounded-xl bg-white/[0.015] border border-white/[0.04]">
        <div className="flex items-center gap-2">
          <Link2 className="w-3.5 h-3.5 text-emerald-400/30" />
          <span className="text-[9px] font-mono text-white/25">No cross-layer impacts detected. Emotions not affecting strategy execution.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {impacts.map((imp, i) => (
        <motion.div key={i} className="px-3 py-2.5 rounded-xl border cursor-pointer group"
          style={{ backgroundColor: `${imp.color}04`, borderColor: `${imp.color}10` }}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
          whileHover={{ borderColor: `${imp.color}25` }}
          onClick={() => onAsk(`Analyze how my ${imp.emotion} is affecting strategy: "${imp.impact}". Estimated cost: ${imp.rCost}. How do I fix this?`)}>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: imp.color }} />
              <span className="text-[9px] font-mono font-bold" style={{ color: imp.color }}>{imp.emotion}</span>
            </div>
            <Layers className="w-2.5 h-2.5 text-white/10" />
            <span className="text-[8px] font-mono text-white/15 uppercase">Strategy Impact</span>
            <div className="flex-1" />
            <span className="text-[9px] font-mono font-bold tabular-nums" style={{ color: "#ef4444" }}>{imp.rCost}</span>
          </div>
          <p className="text-[8px] font-mono text-white/20 leading-relaxed group-hover:text-white/30 transition-colors">{imp.impact}</p>
        </motion.div>
      ))}
    </div>
  )
}

/* ── Emotional Topology Map (Orbital Visualization) ── */
function EmotionalTopologyMap({ emotions, onAsk }: { emotions: BehavioralState["emotionTopology"]; onAsk: (text: string) => void }) {
  const _uid = useId()
  const sid = (n: string) => `${_uid.replace(/:/g, "")}-${n}`
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [hoveredEmotion, setHoveredEmotion] = useState<string | null>(null)
  const centerX = 150
  const centerY = 120

  return (
    <div className="space-y-2">
      <div className="relative">
        <svg viewBox="0 0 300 240" className="w-full max-w-full" style={{ height: "auto", maxHeight: 180 }}>
          <defs>
            <radialGradient id={sid("topo-center-glow")} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </radialGradient>
            <filter id={sid("topo-glow")}>
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Orbit rings */}
          {[40, 65, 90].map((r, i) => (
            <circle key={`ring-${i}`} cx={centerX} cy={centerY} r={r} fill="none"
              stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="2 4" />
          ))}

          {/* Center gravity node */}
          <circle cx={centerX} cy={centerY} r="20" fill={`url(#${sid("topo-center-glow")})`} />
          <circle cx={centerX} cy={centerY} r="8" fill="rgba(168,85,247,0.06)" stroke="rgba(168,85,247,0.2)" strokeWidth="0.8">
            <animate attributeName="r" values="7;9;7" dur="4s" repeatCount="indefinite" />
          </circle>
          <text x={centerX} y={centerY + 1} textAnchor="middle" dominantBaseline="middle"
            fill="#a855f7" fontSize="5" fontFamily="monospace" fontWeight="800" opacity="0.5">CORE</text>

          {/* Connection lines from center to emotions */}
          {emotions.map((em, i) => {
            const rad = (em.angle * Math.PI) / 180
            const orbitR = 30 + (em.value / Math.max(...emotions.map(e => e.value), 1)) * 60
            const x = centerX + Math.cos(rad) * orbitR
            const y = centerY + Math.sin(rad) * orbitR
            const isSelected = selectedEmotion === em.label
            const isHovered = hoveredEmotion === em.label

            return (
              <g key={em.label}>
                <line x1={centerX} y1={centerY} x2={x} y2={y}
                  stroke={em.color} strokeWidth="0.5" opacity={isSelected || isHovered ? "0.3" : "0.08"} />

                {/* Orbit animation */}
                <circle r="1" fill={em.color} opacity="0.3">
                  <animateMotion dur={`${8 + i * 2}s`} repeatCount="indefinite"
                    path={`M ${centerX + Math.cos(rad) * orbitR * 0.3} ${centerY + Math.sin(rad) * orbitR * 0.3} A ${orbitR * 0.3} ${orbitR * 0.3} 0 1 1 ${centerX + Math.cos(rad + 0.01) * orbitR * 0.3} ${centerY + Math.sin(rad + 0.01) * orbitR * 0.3}`} />
                </circle>

                {/* Glow for active emotions */}
                {em.value > 2 && (
                  <circle cx={x} cy={y} r={isSelected ? 18 : 14} fill={em.color} opacity="0.04" filter={`url(#${sid("topo-glow")})`}>
                    <animate attributeName="r" values="12;16;12" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
                  </circle>
                )}

                {/* Main node */}
                <g className="cursor-pointer"
                  onMouseEnter={() => setHoveredEmotion(em.label)}
                  onMouseLeave={() => setHoveredEmotion(null)}
                  onClick={() => setSelectedEmotion(selectedEmotion === em.label ? null : em.label)}>
                  <circle cx={x} cy={y} r={isSelected ? 12 : isHovered ? 10 : 8}
                    fill={`${em.color}10`} stroke={em.color}
                    strokeWidth={isSelected ? "1.5" : "0.8"}
                    opacity={isSelected ? "0.8" : isHovered ? "0.6" : "0.3"}
                    style={{ transition: "all 0.2s" }} />
                  <circle cx={x} cy={y} r={isSelected ? 5 : 4}
                    fill={em.color} opacity={isSelected ? "0.7" : "0.3"}>
                    {i === 0 && <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" />}
                  </circle>
                  <text x={x} y={y - (isSelected ? 16 : 13)} textAnchor="middle"
                    fill={em.color} fontSize="5.5" fontFamily="monospace" fontWeight="700"
                    opacity={isSelected || isHovered ? "0.8" : "0.3"} letterSpacing="0.05em">
                    {em.label.toUpperCase()}
                  </text>
                  <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
                    fill={em.color} fontSize="6" fontFamily="monospace" fontWeight="900"
                    opacity={isSelected || isHovered ? "0.8" : "0.5"}>
                    {em.value}x
                  </text>
                </g>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Selected emotion detail */}
      <AnimatePresence>
        {selectedEmotion && (() => {
          const em = emotions.find(e => e.label === selectedEmotion)
          if (!em) return null
          return (
            <motion.div key={selectedEmotion}
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
              className="overflow-hidden">
              <div className="px-3 py-2.5 rounded-xl space-y-2"
                style={{ backgroundColor: `${em.color}05`, border: `1px solid ${em.color}12` }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: em.color }} />
                  <span className="text-[10px] font-mono font-bold" style={{ color: em.color }}>{em.label.toUpperCase()}</span>
                  <span className="text-[8px] font-mono text-white/20">{em.value}x this week</span>
                </div>
                <div className="space-y-1.5">
                  <div>
                    <span className="text-[7px] font-mono text-white/15 uppercase tracking-wider">When it appears</span>
                    <p className="text-[9px] font-mono text-white/30 leading-relaxed">{em.when}</p>
                  </div>
                  <div>
                    <span className="text-[7px] font-mono text-white/15 uppercase tracking-wider">How to interrupt</span>
                    <p className="text-[9px] font-mono text-white/30 leading-relaxed">{em.interrupt}</p>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all group"
                  onClick={() => onAsk(`Analyze my ${em.label} emotion in depth. It appeared ${em.value}x this week. When: ${em.when}. How do I better manage this?`)}>
                  <Brain className="w-2.5 h-2.5 text-white/15 group-hover:text-white/30" />
                  <span className="text-[8px] font-mono text-white/20 group-hover:text-white/35">Deep Analyze</span>
                </button>
              </div>
            </motion.div>
          )
        })()}
      </AnimatePresence>
    </div>
  )
}

/* ── Personality Profiler ── */
function PersonalityProfiler({ traits, onAsk }: { traits: BehavioralState["personalityTraits"]; onAsk: (text: string) => void }) {
  const _uid = useId()
  const sid = (n: string) => `${_uid.replace(/:/g, "")}-${n}`
  return (
    <div className="space-y-2">
      {/* Radar-like profile visualization */}
      <div className="relative">
        <svg viewBox="0 0 240 160" className="w-full" style={{ height: 120 }}>
          <defs>
            <linearGradient id={sid("profile-fill")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Background bars */}
          {traits.map((trait, i) => {
            const y = 20 + i * 35
            return (
              <g key={trait.trait}>
                <rect x="90" y={y} width="140" height="16" rx="3" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                <rect x="90" y={y} width={Math.max(2, (trait.score / 100) * 140)} height="16" rx="3" fill={`${trait.color}12`} />
                <text x="88" y={y + 9} textAnchor="end" fill={trait.color} fontSize="5.5" fontFamily="monospace" fontWeight="700" letterSpacing="0.05em" opacity="0.5">
                  {trait.trait}
                </text>
                <text x={92 + (trait.score / 100) * 140 + 4} y={y + 9} textAnchor="start" dominantBaseline="middle"
                  fill={trait.color} fontSize="7" fontFamily="monospace" fontWeight="900" opacity="0.7">
                  {trait.score}
                </text>
                <text x={92 + (trait.score / 100) * 140 + 18} y={y + 9} textAnchor="start" dominantBaseline="middle"
                  fill="rgba(255,255,255,0.2)" fontSize="5" fontFamily="monospace" fontWeight="600">
                  {trait.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Trait cards */}
      {traits.map(trait => (
        <motion.div key={trait.trait}
          className="px-3 py-2 rounded-xl cursor-pointer group"
          style={{ backgroundColor: `${trait.color}03`, border: `1px solid ${trait.color}08` }}
          whileHover={{ borderColor: `${trait.color}20` }}
          onClick={() => onAsk(`Analyze my ${trait.trait} score of ${trait.score}/100 (${trait.label}). Evidence: ${trait.evidence}. How does this affect my trading?`)}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: trait.color }} />
            <span className="text-[9px] font-mono font-bold" style={{ color: trait.color }}>{trait.trait}</span>
            <div className="flex-1" />
            <span className="text-[8px] font-mono text-white/15">{trait.score}/100</span>
          </div>
          <p className="text-[8px] font-mono text-white/20 mt-1 leading-relaxed group-hover:text-white/30 transition-colors">{trait.evidence}</p>
        </motion.div>
      ))}
    </div>
  )
}

/* ── Behavioral Biases Detector ── */
function BiasesDetector({ biases, onAsk }: { biases: BehavioralState["behavioralBiases"]; onAsk: (text: string) => void }) {
  const [expandedBias, setExpandedBias] = useState<string | null>(null)
  const detectedCount = biases.filter(b => b.detected).length

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <span className="text-[8px] font-mono text-white/15">{detectedCount}/{biases.length} active biases</span>
        <div className="flex-1 h-px bg-white/[0.04]" />
        <span className="text-[8px] font-mono font-bold" style={{ color: detectedCount >= 3 ? "#ef4444" : detectedCount >= 1 ? "#f59e0b" : "#10b981" }}>
          {detectedCount >= 3 ? "HIGH RISK" : detectedCount >= 1 ? "MONITOR" : "CLEAR"}
        </span>
      </div>

      {biases.map(bias => {
        const isExpanded = expandedBias === bias.bias
        const cfg = {
          critical: { color: "#ef4444" }, warning: { color: "#f59e0b" },
          watch: { color: "#6366f1" }, clear: { color: "#10b981" },
        }[bias.severity]

        return (
          <motion.div key={bias.bias} className="rounded-xl overflow-hidden"
            style={{ backgroundColor: bias.detected ? `${bias.color}04` : "rgba(255,255,255,0.01)",
              border: `1px solid ${bias.detected ? `${bias.color}10` : "rgba(255,255,255,0.04)"}` }}
            layout>
            <button onClick={() => setExpandedBias(isExpanded ? null : bias.bias)}
              className="w-full px-3 py-2 flex items-center gap-2 group">
              <div className="relative shrink-0">
                <div className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: `${bias.color}08`, border: `1px solid ${bias.color}15` }}>
                  {bias.detected ? (
                    <AlertTriangle className="w-3 h-3" style={{ color: bias.color, opacity: 0.6 }} />
                  ) : (
                    <Shield className="w-3 h-3 text-emerald-400/30" />
                  )}
                </div>
                {bias.detected && bias.severity === "critical" && (
                  <motion.div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "#ef4444" }}
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }} />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono font-bold"
                    style={{ color: bias.detected ? bias.color : "rgba(255,255,255,0.25)" }}>{bias.bias}</span>
                  {bias.detected && (
                    <span className="text-[6px] font-mono px-1 py-0.5 rounded uppercase tracking-wider font-bold"
                      style={{ backgroundColor: `${cfg.color}10`, color: cfg.color, border: `1px solid ${cfg.color}20` }}>
                      {bias.severity}
                    </span>
                  )}
                </div>
              </div>
              <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.15 }}>
                <ChevronRight className="w-3 h-3 text-white/10" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div className="px-3 pb-3 space-y-2">
                    <p className="text-[8px] font-mono text-white/20 leading-relaxed">{bias.example}</p>
                    <div className="px-2.5 py-2 rounded-lg" style={{ backgroundColor: `${bias.color}04`, border: `1px solid ${bias.color}08` }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Shield className="w-2.5 h-2.5" style={{ color: `${bias.color}60` }} />
                        <span className="text-[7px] font-mono font-bold uppercase tracking-wider" style={{ color: bias.color }}>Counter-measure</span>
                      </div>
                      <p className="text-[8px] font-mono text-white/25 leading-relaxed">{bias.fix}</p>
                    </div>
                    <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all group"
                      onClick={(e) => { e.stopPropagation(); onAsk(`Analyze my ${bias.bias} in my trading. Severity: ${bias.severity}. ${bias.example}. How do I overcome this cognitive bias?`) }}>
                      <Brain className="w-2.5 h-2.5 text-white/15 group-hover:text-white/30" />
                      <span className="text-[8px] font-mono text-white/20 group-hover:text-white/35">Deep Analyze</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ── Emotional Journal Timeline ── */
function EmotionalJournal({ entries, onAsk }: { entries: BehavioralState["journalEntries"]; onAsk: (text: string) => void }) {
  const [filter, setFilter] = useState<string | null>(null)
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)

  const uniqueEmotions = useMemo(() => {
    const set = new Set(entries.map(e => e.emotion))
    return Array.from(set)
  }, [entries])

  const filtered = filter ? entries.filter(e => e.emotion === filter) : entries

  // Mood trajectory
  const trajectory = useMemo(() => {
    return filtered.map((e, i) => ({
      x: (i / Math.max(filtered.length - 1, 1)) * 260 + 10,
      y: e.impact === "positive" ? 10 : e.impact === "neutral" ? 25 : 40,
      color: e.color,
    }))
  }, [filtered])

  return (
    <div className="space-y-2">
      {/* Filter chips */}
      <div className="flex flex-wrap gap-1">
        <button className={`text-[7px] font-mono px-1.5 py-0.5 rounded-md border transition-all ${!filter ? "bg-white/[0.06] border-white/[0.12] text-white/40" : "bg-white/[0.02] border-white/[0.04] text-white/20 hover:border-white/[0.08]"}`}
          onClick={() => setFilter(null)}>
          <span className="flex items-center gap-1"><Filter className="w-2 h-2" />ALL</span>
        </button>
        {uniqueEmotions.map(em => {
          const emColor = entries.find(e => e.emotion === em)?.color ?? "#6366f1"
          return (
            <button key={em}
              className="text-[7px] font-mono px-1.5 py-0.5 rounded-md border transition-all"
              style={{
                backgroundColor: filter === em ? `${emColor}10` : "rgba(255,255,255,0.02)",
                borderColor: filter === em ? `${emColor}25` : "rgba(255,255,255,0.04)",
                color: filter === em ? emColor : "rgba(255,255,255,0.2)",
              }}
              onClick={() => setFilter(filter === em ? null : em)}>
              {em}
            </button>
          )
        })}
      </div>

      {/* Mood trajectory line */}
      {trajectory.length > 1 && (
        <svg viewBox="0 0 280 50" className="w-full h-8">
          <line x1="0" y1="25" x2="280" y2="25" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="2 4" />
          {trajectory.map((pt, i) => {
            if (i === 0) return null
            const prev = trajectory[i - 1]
            return <line key={`tl-${i}`} x1={prev.x} y1={prev.y} x2={pt.x} y2={pt.y} stroke={pt.color} strokeWidth="0.8" opacity="0.2" />
          })}
          {trajectory.map((pt, i) => (
            <circle key={`tc-${i}`} cx={pt.x} cy={pt.y} r="2.5" fill={pt.color} opacity="0.5" />
          ))}
        </svg>
      )}

      {/* Timeline entries */}
      <div className="relative pl-4 space-y-1">
        {/* Vertical line */}
        <div className="absolute left-1.5 top-0 bottom-0 w-px bg-white/[0.04]" />

        {filtered.slice(0, 8).map(entry => {
          const isExpanded = expandedEntry === entry.id
          return (
            <motion.div key={entry.id}
              className="relative"
              initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}>
              {/* Timeline dot */}
              <div className="absolute -left-2.5 top-2.5 w-2 h-2 rounded-full z-10"
                style={{ backgroundColor: entry.color, boxShadow: `0 0 4px ${entry.color}30` }} />

              <button onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg transition-all group"
                style={{ backgroundColor: isExpanded ? `${entry.color}05` : "transparent", border: `1px solid ${isExpanded ? `${entry.color}10` : "transparent"}` }}>
                <div className="flex items-center gap-2">
                  <span className="text-[7px] font-mono text-white/15 shrink-0">{entry.date} {entry.time}</span>
                  <span className="text-[8px] font-mono font-bold" style={{ color: entry.color }}>{entry.emotion}</span>
                  {entry.tradeRef && (
                    <span className="text-[7px] font-mono px-1 py-0.5 rounded bg-white/[0.02] text-white/15 border border-white/[0.04]">{entry.tradeRef}</span>
                  )}
                  <div className="flex-1" />
                  <div className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: entry.impact === "positive" ? "#10b981" : entry.impact === "negative" ? "#ef4444" : "#f59e0b" }} />
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-2.5 pb-2 space-y-1.5">
                      <p className="text-[8px] font-mono text-white/20 leading-relaxed">{entry.note}</p>
                      <button className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] group"
                        onClick={(e) => { e.stopPropagation(); onAsk(`Analyze this emotional event: ${entry.emotion} on ${entry.date} at ${entry.time}. Impact: ${entry.impact}. ${entry.tradeRef ? `Trade: ${entry.tradeRef}` : ""}. What triggered this and how could I have handled it better?`) }}>
                        <Brain className="w-2 h-2 text-white/15 group-hover:text-white/30" />
                        <span className="text-[7px] font-mono text-white/20 group-hover:text-white/35">Analyze</span>
                      </button>
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
}

/* ── Recovery Protocol Engine ── */
function RecoveryProtocol({ state, onAsk }: { state: BehavioralState; onAsk: (text: string) => void }) {
  const [activeProtocol, setActiveProtocol] = useState<string | null>(null)
  const [breathingActive, setBreathingActive] = useState(false)
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale")
  const [breathCount, setBreathCount] = useState(0)
  const breathRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startBreathing = useCallback(() => {
    if (breathingActive) {
      setBreathingActive(false)
      if (breathRef.current) clearInterval(breathRef.current)
      return
    }
    setBreathingActive(true)
    setBreathCount(0)
    const phases: Array<"inhale" | "hold" | "exhale" | "rest"> = ["inhale", "hold", "exhale", "rest"]
    let phaseIdx = 0
    breathRef.current = setInterval(() => {
      phaseIdx = (phaseIdx + 1) % 4
      setBreathPhase(phases[phaseIdx])
      if (phaseIdx === 0) setBreathCount(c => c + 1)
    }, 4000)
  }, [breathingActive])

  useEffect(() => () => { if (breathRef.current) clearInterval(breathRef.current) }, [])

  const protocols = [
    { id: "pre-trade", label: "Pre-Trade Ritual", icon: PlayCircle, color: "#10b981",
      steps: ["Review overnight analysis notes", "Check economic calendar for next 2 hours", "Verify position sizing calculation", "Set max loss limit for the session", "3 deep breaths, clear mind, begin"] },
    { id: "tilt", label: "Tilt Recovery", icon: RotateCcw, color: "#ef4444",
      steps: ["STOP. Close all order entry windows", "Stand up. Walk away from screen for 5 minutes", "Write down what happened (facts only)", "Rate your emotional state 1-10", "If above 6: session is over. If below 6: review one rule and re-enter with half size"] },
    { id: "breathing", label: "Box Breathing (4-4-4-4)", icon: Wind, color: "#06b6d4",
      steps: ["Inhale for 4 seconds", "Hold for 4 seconds", "Exhale for 4 seconds", "Rest for 4 seconds", "Repeat 4-6 cycles"] },
    { id: "circuit-breaker", label: "Circuit Breaker System", icon: Lock, color: "#f59e0b",
      steps: [
        `Level 1: After 2 consecutive losses -- reduce size by 50%`,
        `Level 2: After 3 consecutive losses -- take 30-min break`,
        `Level 3: After -2R daily drawdown -- session over, no more trades`,
        `Level 4: After -5R weekly drawdown -- review week with mentor before continuing`,
      ] },
  ]

  return (
    <div className="space-y-2">
      {protocols.map(proto => {
        const isActive = activeProtocol === proto.id
        return (
          <motion.div key={proto.id} className="rounded-xl overflow-hidden"
            style={{ backgroundColor: isActive ? `${proto.color}04` : "rgba(255,255,255,0.015)",
              border: `1px solid ${isActive ? `${proto.color}12` : "rgba(255,255,255,0.04)"}` }} layout>
            <button onClick={() => setActiveProtocol(isActive ? null : proto.id)}
              className="w-full px-3 py-2.5 flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${proto.color}08`, border: `1px solid ${proto.color}15` }}>
                <proto.icon className="w-3.5 h-3.5" style={{ color: proto.color, opacity: 0.6 }} />
              </div>
              <span className="text-[10px] font-mono font-bold" style={{ color: isActive ? proto.color : "rgba(255,255,255,0.35)" }}>
                {proto.label}
              </span>
              <div className="flex-1" />
              <motion.div animate={{ rotate: isActive ? 90 : 0 }} transition={{ duration: 0.15 }}>
                <ChevronRight className="w-3 h-3 text-white/10" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div className="px-3 pb-3 space-y-2">
                    {proto.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: `${proto.color}08`, border: `1px solid ${proto.color}15` }}>
                          <span className="text-[7px] font-mono font-bold" style={{ color: proto.color }}>{i + 1}</span>
                        </div>
                        <p className="text-[9px] font-mono text-white/25 leading-relaxed">{step}</p>
                      </div>
                    ))}

                    {proto.id === "breathing" && (
                      <div className="space-y-2">
                        <button onClick={startBreathing}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all"
                          style={{ backgroundColor: breathingActive ? `${proto.color}10` : `${proto.color}05`,
                            border: `1px solid ${breathingActive ? `${proto.color}25` : `${proto.color}12`}` }}>
                          {breathingActive ? <PauseCircle className="w-3.5 h-3.5" style={{ color: proto.color }} /> : <PlayCircle className="w-3.5 h-3.5" style={{ color: proto.color }} />}
                          <span className="text-[9px] font-mono font-bold" style={{ color: proto.color }}>
                            {breathingActive ? `${breathPhase.toUpperCase()} -- Cycle ${breathCount + 1}` : "Start Exercise"}
                          </span>
                        </button>
                        {breathingActive && (
                          <div className="flex items-center justify-center">
                            <motion.div className="w-16 h-16 rounded-full flex items-center justify-center"
                              style={{ border: `2px solid ${proto.color}40` }}
                              animate={{
                                scale: breathPhase === "inhale" ? 1.3 : breathPhase === "exhale" ? 0.7 : 1,
                                borderColor: breathPhase === "hold" ? `${proto.color}60` : `${proto.color}30`,
                              }}
                              transition={{ duration: 4, ease: "easeInOut" }}>
                              <span className="text-[8px] font-mono font-bold" style={{ color: proto.color }}>
                                {breathPhase.toUpperCase()}
                              </span>
                            </motion.div>
                          </div>
                        )}
                      </div>
                    )}

                    <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all group"
                      onClick={(e) => { e.stopPropagation(); onAsk(`Guide me through the ${proto.label} protocol. My current state: stability ${state.stabilityIndex}/100, ${state.activeAlerts.length} active alerts.`) }}>
                      <Brain className="w-2.5 h-2.5 text-white/15 group-hover:text-white/30" />
                      <span className="text-[8px] font-mono text-white/20 group-hover:text-white/35">AI-Guided Session</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ── Score Evolution Dashboard ── */
function ScoreEvolution({ scores, milestones, velocity, currentStreak, bestStreak, onAsk }: {
  scores: BehavioralState["compositeScores"]; milestones: BehavioralState["milestones"]
  velocity: number; currentStreak: number; bestStreak: number; onAsk: (text: string) => void
}) {
  const _uid = useId()
  const sid = (n: string) => `${_uid.replace(/:/g, "")}-${n}`
  const latestScore = scores[scores.length - 1]?.score ?? 0
  const scoreColor = latestScore >= 70 ? "#10b981" : latestScore >= 50 ? "#f59e0b" : "#ef4444"

  return (
    <div className="space-y-3">
      {/* Score header */}
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.015] border border-white/[0.04]">
        <div className="relative">
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
            <motion.circle cx="24" cy="24" r="20" fill="none" stroke={scoreColor} strokeWidth="3" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 20}
              initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 20 * (1 - latestScore / 100) }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              transform="rotate(-90 24 24)" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-mono font-black tabular-nums" style={{ color: scoreColor }}>{latestScore}</span>
          </div>
        </div>
        <div className="flex-1">
          <span className="text-[10px] font-mono font-bold text-white/40">Composite Score</span>
          <div className="flex items-center gap-2 mt-0.5">
            {velocity >= 0 ? (
              <ArrowUpRight className="w-3 h-3 text-emerald-400/50" />
            ) : (
              <ArrowDownRight className="w-3 h-3 text-red-400/50" />
            )}
            <span className="text-[9px] font-mono font-bold" style={{ color: velocity >= 0 ? "#10b981" : "#ef4444" }}>
              {velocity >= 0 ? "+" : ""}{velocity} pts this week
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[8px] font-mono text-white/15">Streak: <strong className="text-white/30">{currentStreak}d</strong></span>
            <span className="text-[8px] font-mono text-white/15">Best: <strong className="text-white/30">{bestStreak}d</strong></span>
          </div>
        </div>
      </div>

      {/* Score chart */}
      <div className="h-16">
        <svg viewBox="0 0 280 64" className="w-full h-full">
          <defs>
            <linearGradient id={sid("score-evo-fill")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={scoreColor} stopOpacity="0.1" />
              <stop offset="100%" stopColor={scoreColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          {(() => {
            const d = scores.map(s => s.score)
            const mn = Math.min(...d, 0); const mx = Math.max(...d, 100); const rng = mx - mn || 1
            const pts = d.map((v, i) => ({ x: (i / Math.max(d.length - 1, 1)) * 260 + 10, y: 56 - ((v - mn) / rng) * 48 }))
            const pathD = pts.map((p, i) => {
              if (i === 0) return `M ${p.x} ${p.y}`
              const prev = pts[i - 1]; const cpx = (prev.x + p.x) / 2
              return `C ${cpx} ${prev.y}, ${cpx} ${p.y}, ${p.x} ${p.y}`
            }).join(" ")
            return (<>
              <path d={`${pathD} L ${pts[pts.length - 1].x} 60 L ${pts[0].x} 60 Z`} fill={`url(#${sid("score-evo-fill")})`} />
              <path d={pathD} fill="none" stroke={scoreColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              {pts.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="2.5" fill={scoreColor} opacity="0.7" />
                  {scores[i]?.delta !== 0 && (
                    <text x={p.x} y={p.y - 6} textAnchor="middle" fill={scores[i].delta > 0 ? "#10b981" : "#ef4444"}
                      fontSize="5" fontFamily="monospace" fontWeight="700" opacity="0.5">
                      {scores[i].delta > 0 ? "+" : ""}{scores[i].delta}
                    </text>
                  )}
                </g>
              ))}
            </>)
          })()}
        </svg>
      </div>
      <div className="flex justify-between px-2">
        {scores.map((s, i) => (
          <span key={i} className="text-[6px] text-white/12 font-mono">{s.day}</span>
        ))}
      </div>

      {/* Milestones */}
      <div className="space-y-1">
        <span className="text-[8px] font-mono text-white/15 uppercase tracking-wider">Milestones</span>
        <div className="grid grid-cols-2 gap-1.5">
          {milestones.map(m => (
            <div key={m.label} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg"
              style={{ backgroundColor: m.achieved ? "rgba(16,185,129,0.04)" : "rgba(255,255,255,0.015)",
                border: `1px solid ${m.achieved ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)"}` }}>
              {m.achieved ? (
                <Trophy className="w-3 h-3 text-emerald-400/50" />
              ) : (
                <Star className="w-3 h-3 text-white/10" />
              )}
              <div className="flex-1 min-w-0">
                <span className="text-[7px] font-mono block truncate"
                  style={{ color: m.achieved ? "#10b981" : "rgba(255,255,255,0.2)" }}>{m.label}</span>
                {m.date && <span className="text-[6px] font-mono text-white/10">{m.date}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Neural Feedback Loop (Emotion to PnL Correlation) ── */
function NeuralFeedbackLoop({ correlations, onAsk }: { correlations: BehavioralState["emotionPnLCorrelation"]; onAsk: (text: string) => void }) {
  if (correlations.length === 0) {
    return (
      <div className="px-3 py-3 rounded-xl bg-white/[0.015] border border-white/[0.04]">
        <p className="text-[9px] font-mono text-white/20">Not enough data to correlate emotions to P&L outcomes. Continue tracking.</p>
      </div>
    )
  }

  const maxAbs = Math.max(...correlations.map(c => Math.abs(c.avgPnL)), 1)

  return (
    <div className="space-y-2">
      <div className="px-1">
        <span className="text-[8px] font-mono text-white/15">Emotion-to-PnL Correlation (Avg R per trade)</span>
      </div>

      {/* Diverging bar chart */}
      <div className="relative">
        <svg viewBox={`0 0 280 ${correlations.length * 28 + 10}`} className="w-full max-w-full" style={{ height: Math.min(correlations.length * 28 + 10, 200) }}>
          {/* Center line */}
          <line x1="140" y1="0" x2="140" y2={correlations.length * 28 + 10} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

          {correlations.map((corr, i) => {
            const y = 8 + i * 28
            const barWidth = (Math.abs(corr.avgPnL) / maxAbs) * 120
            const isPositive = corr.avgPnL >= 0

            return (
              <g key={corr.emotion}>
                {/* Emotion label */}
                <text x={isPositive ? 138 - 4 : 142 + 4} y={y + 8} textAnchor={isPositive ? "end" : "start"}
                  fill={corr.color} fontSize="6" fontFamily="monospace" fontWeight="700" opacity="0.5">
                  {corr.emotion}
                </text>

                {/* Bar */}
                <motion.rect
                  x={isPositive ? 140 : 140 - barWidth}
                  y={y + 14} width={barWidth} height="8" rx="2"
                  fill={`${corr.color}25`}
                  initial={{ width: 0 }} animate={{ width: barWidth }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                />

                {/* Value label */}
                <text x={isPositive ? 140 + barWidth + 4 : 140 - barWidth - 4} y={y + 19.5}
                  textAnchor={isPositive ? "start" : "end"} dominantBaseline="middle"
                  fill={corr.color} fontSize="6.5" fontFamily="monospace" fontWeight="900" opacity="0.7">
                  {corr.avgPnL >= 0 ? "+" : ""}{corr.avgPnL.toFixed(1)}R
                </text>

                {/* Count */}
                <text x={isPositive ? 140 + barWidth + 28 : 140 - barWidth - 28} y={y + 19.5}
                  textAnchor="middle" dominantBaseline="middle"
                  fill="rgba(255,255,255,0.15)" fontSize="5" fontFamily="monospace">
                  {corr.count}x
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Key insight */}
      {(() => {
        const bestEmotion = correlations.reduce((best, c) => c.avgPnL > best.avgPnL ? c : best, correlations[0])
        const worstEmotion = correlations.reduce((worst, c) => c.avgPnL < worst.avgPnL ? c : worst, correlations[0])

        return (
          <div className="px-3 py-2 rounded-xl bg-white/[0.015] border border-white/[0.04] space-y-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-white/15" />
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">Key Insight</span>
            </div>
            <p className="text-[9px] font-mono text-white/25 leading-relaxed">
              You trade best when <strong className="font-bold" style={{ color: bestEmotion.color }}>{bestEmotion.emotion}</strong> ({bestEmotion.avgPnL >= 0 ? "+" : ""}{bestEmotion.avgPnL.toFixed(1)}R avg)
              and worst when <strong className="font-bold" style={{ color: worstEmotion.color }}>{worstEmotion.emotion}</strong> ({worstEmotion.avgPnL.toFixed(1)}R avg).
              {worstEmotion.count >= 3 ? " This pattern is consistent and costing you significantly." : " Monitor for further evidence."}
            </p>
            <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all group"
              onClick={() => onAsk(`Analyze my emotion-to-PnL correlation. Best: ${bestEmotion.emotion} at +${bestEmotion.avgPnL}R. Worst: ${worstEmotion.emotion} at ${worstEmotion.avgPnL}R. How do I trade more in my optimal emotional state?`)}>
              <Brain className="w-2.5 h-2.5 text-white/15 group-hover:text-white/30" />
              <span className="text-[8px] font-mono text-white/20 group-hover:text-white/35">Optimize My State</span>
            </button>
          </div>
        )
      })()}
    </div>
  )
}

/* ── Cooldown Control ── */
function CooldownControl() {
  const [active, setActive] = useState(false)
  const [remaining, setRemaining] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startCooldown = useCallback(() => {
    if (active) return
    setActive(true)
    setRemaining(600)
    timerRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(timerRef.current!)
          setActive(false)
          return 0
        }
        return r - 1
      })
    }, 1000)
  }, [active])

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`
  const progress = active ? remaining / 600 : 0

  return (
    <motion.button onClick={startCooldown} disabled={active}
      className="relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-200 w-full overflow-hidden"
      style={{ backgroundColor: active ? "rgba(239,68,68,0.04)" : "rgba(255,255,255,0.015)", borderColor: active ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)" }}
      whileHover={!active ? { borderColor: "rgba(168,85,247,0.2)" } : {}}>
      {active && (
        <motion.div className="absolute left-0 top-0 bottom-0 rounded-xl"
          style={{ backgroundColor: "rgba(239,68,68,0.06)" }}
          initial={{ width: "100%" }} animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 1, ease: "linear" }} />
      )}
      <div className="relative flex items-center gap-2.5 w-full">
        <Pause className="w-4 h-4" style={{ color: active ? "#ef4444" : "rgba(255,255,255,0.25)" }} />
        <span className="text-[11px] font-mono font-bold" style={{ color: active ? "#ef4444" : "rgba(255,255,255,0.35)" }}>
          {active ? `Cooling down ${fmt(remaining)}` : "Start 10m Cooldown"}
        </span>
      </div>
    </motion.button>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT -- NEURAL CORTEX 2.0
   The Cortex Command Center. A living state machine UI.
   ═���════════════════════════════════════════════════════════════════════════ */

// ══════════════════════════════════════════════════════════════════════════════
// STAGE FRAMEWORK — 5-stage clinical workflow
// ══════════════════════════════════════════════════════════════════════════════

type StageId = "scan" | "diagnose" | "understand" | "act" | "track"

const STAGES: { id: StageId; label: string; icon: React.ElementType; color: string; verb: string }[] = [
  { id: "scan",       label: "SCAN",       icon: Scan,        color: "#06b6d4", verb: "Scanning" },
  { id: "diagnose",   label: "DIAGNOSE",   icon: Stethoscope, color: "#8b5cf6", verb: "Diagnosing" },
  { id: "understand", label: "UNDERSTAND",  icon: Lightbulb,   color: "#f59e0b", verb: "Understanding" },
  { id: "act",        label: "ACT",        icon: HandMetal,   color: "#ef4444", verb: "Acting" },
  { id: "track",      label: "TRACK",      icon: LineChart,   color: "#10b981", verb: "Tracking" },
]

// Stage Rail — sticky right-side navigation spine
function StageRail({ active, onNavigate, alerts }: {
  active: StageId; onNavigate: (id: StageId) => void; alerts: number
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 py-2">
      {STAGES.map((s, i) => {
        const isActive = active === s.id
        const isPast = STAGES.findIndex(x => x.id === active) > i
        const showBadge = s.id === "scan" && alerts > 0
        return (
          <div key={s.id} className="flex flex-col items-center">
            {i > 0 && (
              <div className="w-px h-3" style={{ backgroundColor: isPast ? `${s.color}40` : "rgba(255,255,255,0.04)" }} />
            )}
            <button
              type="button"
              onClick={() => onNavigate(s.id)}
              className="relative w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{
                backgroundColor: isActive ? `${s.color}15` : "transparent",
                border: `1px solid ${isActive ? `${s.color}40` : isPast ? `${s.color}20` : "rgba(255,255,255,0.04)"}`,
                boxShadow: isActive ? `0 0 12px ${s.color}15` : "none",
              }}
              title={s.label}
            >
              {isPast ? (
                <CheckCircle2 className="w-3 h-3" style={{ color: `${s.color}90` }} />
              ) : (
                <s.icon className="w-3 h-3" style={{ color: isActive ? s.color : "rgba(255,255,255,0.2)" }} />
              )}
              {showBadge && (
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-[6px] font-mono font-black text-white">{alerts}</span>
                </div>
              )}
            </button>
            <span className="text-[5px] font-mono font-black uppercase tracking-wider mt-0.5"
              style={{ color: isActive ? s.color : isPast ? `${s.color}60` : "rgba(255,255,255,0.12)" }}>
              {s.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// Stage Shell — scroll-anchored stage container with sticky header
function StageShell({ stage, isActive, children, id }: {
  stage: typeof STAGES[number]; isActive: boolean; children: React.ReactNode; id: string
}) {
  return (
    <div id={id} className="relative" style={{ scrollMarginTop: 4 }}>
      {/* Stage header */}
      <div className="sticky top-0 z-10 px-4 py-2 flex items-center gap-2.5"
        style={{
          backgroundColor: isActive ? `${stage.color}06` : "rgba(8,10,16,0.95)",
          borderBottom: `1px solid ${isActive ? `${stage.color}15` : "rgba(255,255,255,0.03)"}`,
          backdropFilter: "blur(12px)",
        }}>
        <motion.div className="w-5 h-5 rounded-md flex items-center justify-center"
          style={{ backgroundColor: `${stage.color}12`, border: `1px solid ${stage.color}25` }}
          animate={isActive ? { borderColor: [`${stage.color}25`, `${stage.color}50`, `${stage.color}25`] } : {}}
          transition={{ duration: 2.5, repeat: Infinity }}>
          <stage.icon className="w-3 h-3" style={{ color: stage.color }} />
        </motion.div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.12em]"
            style={{ color: isActive ? stage.color : "rgba(255,255,255,0.3)" }}>
            {stage.label}
          </span>
          {isActive && (
            <motion.div className="flex items-center gap-1 px-1.5 py-0.5 rounded"
              style={{ backgroundColor: `${stage.color}08`, border: `1px solid ${stage.color}15` }}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
              <motion.div className="w-1 h-1 rounded-full" style={{ backgroundColor: stage.color }}
                animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
              <span className="text-[7px] font-mono font-bold" style={{ color: `${stage.color}80` }}>ACTIVE</span>
            </motion.div>
          )}
        </div>
        <div className="flex-1 h-px" style={{ backgroundColor: `${stage.color}08` }} />
      </div>
      {/* Stage body */}
      <div className="relative">
        {children}
      </div>
    </div>
  )
}

// Intervention Verdict — the ACT-stage STOP / REDUCE / CONTINUE decision
function InterventionVerdict({ state, onAsk }: { state: BehavioralState; onAsk: (t: string) => void }) {
  const verdict = useMemo(() => {
    const critical = state.activeAlerts.filter(a => a.severity === "critical").length
    const warnings = state.activeAlerts.filter(a => a.severity === "warning").length
    const revengeHot = state.revengeRisk === "critical" || state.revengeRisk === "warning"
    const emotionHigh = state.emotionVolatility > 65
    const disciplineLow = state.disciplineScore < 45
    const score = critical * 30 + warnings * 10 + (revengeHot ? 25 : 0) + (emotionHigh ? 20 : 0) + (disciplineLow ? 20 : 0)

    if (score >= 50) return { action: "STOP" as const, color: "#ef4444", icon: Ban, label: "Stop Trading", desc: "Multiple critical signals detected. Continuing will compound losses. Step away, execute cooldown protocol, return when baseline is restored.", score }
    if (score >= 20) return { action: "REDUCE" as const, color: "#f59e0b", icon: AlertCircle, label: "Reduce Exposure", desc: "Elevated risk signals present. Cut position size by 50%, trade only A+ setups, set a hard session stop-loss.", score }
    return { action: "CONTINUE" as const, color: "#10b981", icon: CheckCircle2, label: "Continue Trading", desc: "Neural state is stable. Maintain current process. Monitor for volatility spikes.", score }
  }, [state])

  const actionItems = useMemo(() => {
    const items: { text: string; urgency: "critical" | "warning" | "info" }[] = []
    if (state.revengeRisk === "critical") items.push({ text: "Revenge circuit is active. Do NOT enter next trade for 15 min.", urgency: "critical" })
    if (state.revengeRisk === "warning") items.push({ text: "Revenge risk elevated. Double-check next entry against your rules.", urgency: "warning" })
    if (state.emotionVolatility > 70) items.push({ text: `Emotion volatility at ${state.emotionVolatility}%. Step away until below 50%.`, urgency: "critical" })
    if (state.emotionVolatility > 50) items.push({ text: `Emotion volatility at ${state.emotionVolatility}%. Reduce size.`, urgency: "warning" })
    if (state.disciplineScore < 40) items.push({ text: `Discipline at ${state.disciplineScore}/100. Re-read your rules before next trade.`, urgency: "critical" })
    if (state.disciplineScore < 60) items.push({ text: `Discipline fading (${state.disciplineScore}). Simplify: one setup, one size.`, urgency: "warning" })
    if (state.decisionLatency === "fast") items.push({ text: "Decision speed is too fast. Implement 10-second rule.", urgency: "warning" })
    if (state.consistencyStreak <= 1) items.push({ text: "No consistency streak. Focus on process over P&L today.", urgency: "info" })
    if (state.dominantHemisphere === "right") items.push({ text: "Right-brain dominant. Engage structure: use your checklist.", urgency: "warning" })
    if (items.length === 0) items.push({ text: "All systems nominal. Trust your process.", urgency: "info" })
    return items
  }, [state])

  const urgencyColor = { critical: "#ef4444", warning: "#f59e0b", info: "#06b6d4" }

  return (
    <div className="px-3 py-3">
      {/* Main verdict card */}
      <motion.div className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: `${verdict.color}04`,
          border: `1px solid ${verdict.color}20`,
          boxShadow: `0 0 24px ${verdict.color}08`,
        }}
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: `1px solid ${verdict.color}10` }}>
          <motion.div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${verdict.color}12`, border: `1px solid ${verdict.color}30` }}
            animate={{ boxShadow: [`0 0 0px ${verdict.color}00`, `0 0 16px ${verdict.color}25`, `0 0 0px ${verdict.color}00`] }}
            transition={{ duration: 2, repeat: Infinity }}>
            <verdict.icon className="w-5 h-5" style={{ color: verdict.color }} />
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-black uppercase tracking-wider" style={{ color: verdict.color }}>{verdict.label}</span>
              <span className="text-[7px] font-mono px-1.5 py-0.5 rounded uppercase font-bold"
                style={{ backgroundColor: `${verdict.color}10`, color: `${verdict.color}90`, border: `1px solid ${verdict.color}20` }}>
                Risk Score: {verdict.score}
              </span>
            </div>
            <p className="text-[10px] font-mono text-white/30 leading-relaxed mt-1">{verdict.desc}</p>
          </div>
        </div>

        {/* Action items */}
        <div className="px-4 py-2.5 space-y-1.5">
          <span className="text-[7px] font-mono font-black text-white/20 uppercase tracking-wider">Action Items</span>
          {actionItems.map((item, i) => (
            <motion.div key={i} className="flex items-start gap-2 px-2.5 py-2 rounded-lg"
              style={{ backgroundColor: `${urgencyColor[item.urgency]}04`, border: `1px solid ${urgencyColor[item.urgency]}10` }}
              initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
              <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: urgencyColor[item.urgency] }} />
              <p className="text-[9px] font-mono font-bold leading-relaxed" style={{ color: `${urgencyColor[item.urgency]}90` }}>{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Copilot escalation */}
        <div className="px-4 py-2.5" style={{ borderTop: `1px solid ${verdict.color}08` }}>
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-white/[0.03]"
            style={{ backgroundColor: `${verdict.color}06`, border: `1px solid ${verdict.color}15` }}
            onClick={() => onAsk(`My Psychology OS verdict is ${verdict.action} (risk score ${verdict.score}). Stability: ${state.stabilityIndex}, discipline: ${state.disciplineScore}, volatility: ${state.emotionVolatility}%, revenge risk: ${state.revengeRisk}, dominant hemisphere: ${state.dominantHemisphere}. Give me a personalized intervention plan.`)}>
            <Brain className="w-3.5 h-3.5" style={{ color: `${verdict.color}70` }} />
            <span className="text-[9px] font-mono font-black uppercase tracking-wider" style={{ color: `${verdict.color}80` }}>
              Get Personalized Intervention Plan
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT — 5-STAGE PSYCHOLOGY OS
// ══════════════════════════════════════════════════════════════════════════════

export function PsychologyAnalytics({ data }: PsychologyAnalyticsProps) {
  const _uid = useId()
  const svgId = (name: string) => `${_uid.replace(/:/g, "")}-${name}`
  const state = useMemo(() => (data ? deriveBehavior(data) : null), [data])
  const [activeHemisphere, setActiveHemisphere] = useState<"left" | "right" | null>(null)
  const [activeStage, setActiveStage] = useState<StageId>("scan")
  const scrollRef = useRef<HTMLDivElement>(null)
  const stageRefs = useRef<Record<StageId, HTMLElement | null>>({ scan: null, diagnose: null, understand: null, act: null, track: null })

  const askCopilot = useCallback((text: string) => {
    window.dispatchEvent(new CustomEvent("copilot:chat:ask", { detail: { threadType: "psychology", text } }))
  }, [])

  const switchHemisphere = useCallback((side: "left" | "right" | null) => {
    setActiveHemisphere(side)
  }, [])

  // Scrollspy — determine active stage from scroll position
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const handleScroll = () => {
      const containerTop = container.scrollTop + 80
      let current: StageId = "scan"
      for (const s of STAGES) {
        const el = stageRefs.current[s.id]
        if (el && el.offsetTop <= containerTop) current = s.id
      }
      setActiveStage(current)
    }
    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  const navigateToStage = useCallback((id: StageId) => {
    const el = stageRefs.current[id]
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  if (!data || !state) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-20 h-20">
            <Brain className="w-20 h-20 text-white/[0.03] absolute inset-0" strokeWidth={0.5} />
            <motion.div className="absolute inset-0 flex items-center justify-center"
              animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 3, repeat: Infinity }}>
              <HeartPulse className="w-6 h-6 text-white/10" />
            </motion.div>
          </div>
          <div>
            <p className="text-[11px] text-white/30 font-mono">No behavioral data yet</p>
            <p className="text-[10px] text-white/15 mt-1 font-mono">Log mood and emotions to activate the neural cortex</p>
          </div>
        </div>
      </div>
    )
  }

  const centerColor = state.stabilityLevel === "stable" ? "#10b981" : state.stabilityLevel === "elevated" ? "#f59e0b" : "#ef4444"

  return (
    <div className="h-full flex overflow-hidden">
      {/* ── STAGE RAIL (sticky right spine) ── */}
      <div className="w-10 flex-shrink-0 border-r border-white/[0.04] flex flex-col items-center justify-center"
        style={{ backgroundColor: "rgba(8,10,16,0.5)" }}>
        <StageRail active={activeStage} onNavigate={navigateToStage} alerts={state.activeAlerts.length} />
      </div>

      {/* ── SCROLLABLE MAIN CONTENT ── */}
      <div className="flex-1 overflow-y-auto min-h-0" ref={scrollRef}
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.06) transparent" }}>

        {/* ══════════════════════════════════════════════════════════════
            STAGE 1: SCAN — Status overview, alerts, vital signs
            ═════════════════════════════════════════════════════════════ */}
        <div ref={el => { stageRefs.current.scan = el }}>
          <StageShell stage={STAGES[0]} isActive={activeStage === "scan"} id="stage-scan">

            {/* Cortex Command Center header */}
            <div className="relative overflow-hidden">
              <motion.div className="absolute inset-0 pointer-events-none"
                animate={{ opacity: [0.01, 0.04, 0.01] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full"
                  style={{ backgroundColor: centerColor, filter: "blur(50px)" }} />
              </motion.div>

              {/* Title + Stability + Dominant Emotion */}
              <div className="relative px-4 pt-3 pb-2">
                <div className="flex items-center gap-3">
                  <NeuralStabilityMeter value={state.stabilityIndex} level={state.stabilityLevel} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-black text-white/65 tracking-wide">NEURAL CORTEX</span>
                      <motion.div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: `${centerColor}08`, border: `1px solid ${centerColor}15` }}
                        animate={{ borderColor: [`${centerColor}15`, `${centerColor}35`, `${centerColor}15`] }}
                        transition={{ duration: 3, repeat: Infinity }}>
                        <motion.div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: centerColor }}
                          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                        <span className="text-[9px] font-mono font-black uppercase tracking-wider" style={{ color: centerColor }}>
                          {state.stabilityLevel.toUpperCase()}
                        </span>
                      </motion.div>
                    </div>
                    <p className="text-[11px] text-white/25 mt-1.5 font-mono leading-relaxed">{state.cortexVerdict}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] font-mono text-white/15 uppercase tracking-wider font-bold">Dominant:</span>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: `${state.dominantEmotionColor}08`, border: `1px solid ${state.dominantEmotionColor}15` }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: state.dominantEmotionColor }} />
                        <span className="text-[10px] font-mono font-bold uppercase" style={{ color: state.dominantEmotionColor }}>
                          {state.dominantEmotion}
                        </span>
                      </div>
                    </div>
                  </div>
                  {state.activeAlerts.length > 0 && (
                    <motion.div className="relative shrink-0"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "#ef444410", border: "1px solid #ef444420" }}>
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400/60" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                        <span className="text-[7px] font-mono font-black text-white">{state.activeAlerts.length}</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Alert Strip */}
              {state.activeAlerts.length > 0 && (
                <div className="relative px-3 pb-2">
                  <AlertStrip alerts={state.activeAlerts} />
                </div>
              )}
            </div>

            {/* Micro-signal badges */}
            <div className="px-3 pb-3">
              <div className="flex gap-1">
                {[
                  { label: "DISCIPLINE", value: `${state.disciplineScore}`, color: state.disciplineScore >= 70 ? "#10b981" : state.disciplineScore >= 50 ? "#f59e0b" : "#ef4444" },
                  { label: "VOLATILITY", value: `${state.emotionVolatility}%`, color: state.emotionVolatility <= 40 ? "#10b981" : state.emotionVolatility <= 70 ? "#f59e0b" : "#ef4444" },
                  { label: "SPEED", value: `${data.counts.medianDecisionMins}m`, color: state.decisionLatency === "measured" ? "#10b981" : state.decisionLatency === "fast" ? "#ef4444" : "#06b6d4" },
                  { label: "STREAK", value: `${state.consistencyStreak}d`, color: state.consistencyStreak >= 5 ? "#10b981" : state.consistencyStreak >= 3 ? "#f59e0b" : "#ef4444" },
                  { label: "HEMISPHERE", value: state.dominantHemisphere === "left" ? "L" : state.dominantHemisphere === "right" ? "R" : "=", color: state.dominantHemisphere === "balanced" ? "#10b981" : state.dominantHemisphere === "left" ? "#06b6d4" : "#ef4444" },
                ].map((badge, bi) => (
                  <motion.div key={badge.label} className="flex-1 text-center px-1 py-1.5 rounded-lg"
                    style={{ backgroundColor: `${badge.color}05`, border: `1px solid ${badge.color}10` }}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + bi * 0.03 }}>
                    <span className="text-[12px] font-mono font-black tabular-nums block leading-tight" style={{ color: badge.color }}>{badge.value}</span>
                    <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider font-bold">{badge.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Hemisphere Selector */}
            <div className="relative px-3 pb-3">
              <div className="flex gap-2">
                <HemisphereButton
                  side="left" zones={state.leftBrainZones}
                  isActive={activeHemisphere === "left"} otherActive={activeHemisphere === "right"}
                  onClick={() => switchHemisphere(activeHemisphere === "left" ? null : "left")}
                />
                <div className="flex flex-col items-center justify-center px-0.5 gap-1">
                  <div className="w-px flex-1 bg-white/[0.04]" />
                  <motion.div className="w-2.5 h-2.5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${centerColor}10`, border: `1px solid ${centerColor}20` }}
                    animate={{ scale: [1, 1.2, 1], borderColor: [`${centerColor}20`, `${centerColor}40`, `${centerColor}20`] }}
                    transition={{ duration: 3, repeat: Infinity }}>
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: centerColor }} />
                  </motion.div>
                  <div className="w-px flex-1 bg-white/[0.04]" />
                </div>
                <HemisphereButton
                  side="right" zones={state.rightBrainZones}
                  isActive={activeHemisphere === "right"} otherActive={activeHemisphere === "left"}
                  onClick={() => switchHemisphere(activeHemisphere === "right" ? null : "right")}
                />
              </div>
            </div>
          </StageShell>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            STAGE 2: DIAGNOSE — Brain topology, zone deep-dive
            ═════════════════════════════════════════════════════════════ */}
        <div ref={el => { stageRefs.current.diagnose = el }}>
          <StageShell stage={STAGES[1]} isActive={activeStage === "diagnose"} id="stage-diagnose">
            <BrainVisualization
              state={state}
              activeHemisphere={activeHemisphere}
              onSelectHemisphere={(side) => switchHemisphere(side)}
              onSelectZone={() => {}}
              onAsk={askCopilot}
            />
            <NeuralInterconnectionSystem state={state} onAsk={askCopilot} />
          </StageShell>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            STAGE 3: UNDERSTAND — Deep analytics sections
            ═════════════════════════════════════════════════════════════ */}
        <div ref={el => { stageRefs.current.understand = el }}>
          <StageShell stage={STAGES[2]} isActive={activeStage === "understand"} id="stage-understand">
            {/* Emotional Topology */}
            <Section title="Emotional Topology" icon={Compass} accentColor="#ec4899">
              <EmotionalTopologyMap emotions={state.emotionTopology} onAsk={askCopilot} />
            </Section>

            {/* Personality Profiler */}
            <Section title="Personality Profile" icon={Fingerprint} accentColor="#8b5cf6">
              <PersonalityProfiler traits={state.personalityTraits} onAsk={askCopilot} />
            </Section>

            {/* Biases Detector */}
            <Section title="Cognitive Biases" icon={ShieldAlert} accentColor="#f59e0b">
              <BiasesDetector biases={state.behavioralBiases} onAsk={askCopilot} />
            </Section>

            {/* Cross-Layer Bridge */}
            <Section title="Cross-Layer Impact" icon={Link2} accentColor="#06b6d4">
              <CrossLayerBridge impacts={state.crossLayerImpacts} onAsk={askCopilot} />
            </Section>

            {/* Cause-Effect Chains */}
            <Section title="Cause-Effect Chains" icon={Zap} accentColor="#ef4444">
              <div className="px-3 pb-3 space-y-2">
            {Object.entries(state.causeEffectChains).map(([key, chain]) => {
              const cfg = {
                revenge:       { patternName: "REVENGE TRADING",  severity: state.revengeRisk,      icon: Flame },
                cutWinners:    { patternName: "CUTTING WINNERS",  severity: state.cutWinnersRisk,   icon: TrendingDown },
                sizeEscalation:{ patternName: "SIZE ESCALATION",  severity: state.sizeEscalation,   icon: TrendingUp },
                overtrading:   { patternName: "OVERTRADING",      severity: state.overtradingRisk,  icon: Activity },
              }[key as "revenge" | "cutWinners" | "sizeEscalation" | "overtrading"]
              if (!cfg) return null
              return (
                <CauseEffectCard
                  key={key}
                  patternName={cfg.patternName}
                  severity={cfg.severity}
                  chain={chain}
                  icon={cfg.icon}
                  onAsk={askCopilot}
                />
              )
            })}
              </div>
            </Section>

            {/* Emotion Chapters */}
            <Section title="Emotion Timeline" icon={BookOpen} accentColor="#f59e0b">
              <div className="px-3 pb-3 space-y-2">
                {state.emotionChapters.map((chapter, i) => (
                  <EmotionChapterCard key={i} chapter={chapter} index={i} onAsk={askCopilot} />
                ))}
              </div>
            </Section>
          </StageShell>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            STAGE 4: ACT — Intervention verdict + recovery protocols
            ═════════════════════════════════════════════════════════════ */}
        <div ref={el => { stageRefs.current.act = el }}>
          <StageShell stage={STAGES[3]} isActive={activeStage === "act"} id="stage-act">
            {/* Intervention Verdict */}
            <InterventionVerdict state={state} onAsk={askCopilot} />

            {/* Recovery Protocol */}
            <Section title="Recovery Protocol" icon={Shield} accentColor="#10b981">
              <RecoveryProtocol state={state} onAsk={askCopilot} />
            </Section>

            {/* Cooldown Control */}
            <Section title="Cooldown Control" icon={Pause} accentColor="#06b6d4">
              <CooldownControl />
            </Section>

            {/* Neural Feedback Loop */}
            <Section title="Neural Feedback Loop" icon={Orbit} accentColor="#8b5cf6">
              <NeuralFeedbackLoop correlations={state.emotionPnLCorrelation} onAsk={askCopilot} />
            </Section>
          </StageShell>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            STAGE 5: TRACK — Score evolution, journal, milestones
            ═════════════════════════════════════════════════════════════ */}
        <div ref={el => { stageRefs.current.track = el }}>
          <StageShell stage={STAGES[4]} isActive={activeStage === "track"} id="stage-track">
            {/* Score Evolution */}
            <Section title="Score Evolution" icon={TrendingUp} accentColor="#10b981">
              <ScoreEvolution
                scores={state.compositeScores}
                milestones={state.milestones}
                velocity={state.improvementVelocity}
                currentStreak={state.currentStreak}
                bestStreak={state.bestStreak}
                onAsk={askCopilot}
              />
            </Section>

            {/* Emotional Journal */}
            <Section title="Emotional Journal" icon={BookOpen} accentColor="#f59e0b">
              <EmotionalJournal entries={state.journalEntries} onAsk={askCopilot} />
            </Section>
          </StageShell>
        </div>

        {/* Bottom spacer */}
        <div className="h-8" />
      </div>

      {/* ── CORTEX VERDICT BAR (bottom) ── */}
      <div className="absolute bottom-0 left-10 right-0 border-t border-white/[0.04] px-4 py-2 z-20"
        style={{ backgroundColor: "rgba(8,10,16,0.95)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-2">
          <motion.div className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: centerColor }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }} />
          <p className="text-[10px] font-mono text-white/30 leading-relaxed font-bold truncate">
            {state.dominantHemisphere === "right"
              ? `Right dominant. ${state.revengeRisk === "critical" || state.revengeRisk === "warning" ? "Revenge circuit active." : "Emotional override."} Engage structure.`
              : state.dominantHemisphere === "left"
                ? `Left dominant. ${state.decisionLatency === "slow" ? "Analysis paralysis risk." : "Logic in control."} ${state.disciplineScore >= 70 ? "Process holding." : "Discipline fading."}`
                : `Balanced. ${state.stabilityLevel === "stable" ? "Optimal state." : "Monitor volatility."} ${state.emotionVolatility > 50 ? "High amplitude." : "Stable."}`}
          </p>
          <div className="flex-1" />
          <div className="flex items-center gap-1 shrink-0">
            {STAGES.map(s => {
              const isActive = activeStage === s.id
              return (
                <button key={s.id} type="button" onClick={() => navigateToStage(s.id)}
                  className="w-1.5 h-1.5 rounded-full transition-all"
                  style={{ backgroundColor: isActive ? s.color : "rgba(255,255,255,0.08)" }}
                  title={s.label} />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

