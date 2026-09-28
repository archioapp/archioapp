/**
 * Dashboard Type System
 * The private AI chief-of-staff for the individual trader.
 * Spine: Observe -> Interpret -> Plan -> Monitor -> Protect
 */

/* ── Session Mode ── */
export type SessionMode = "pre_market" | "in_session" | "post_session" | "reset"

/* ── Account Types ── */
export type AccountType = "live" | "prop_firm" | "demo"
export type PropFirmPhase = "evaluation" | "verification" | "funded"

export interface TradingAccount {
  id: string
  name: string
  broker: string
  type: AccountType
  balance: number
  equity: number
  floatingPnl: number
  currency: string
  drawdownCurrent: number
  drawdownMax: number
  propFirm?: {
    firm: string
    phase: PropFirmPhase
    profitTarget: number
    profitCurrent: number
    maxDrawdown: number
    dailyLossLimit: number
    dailyLossUsed: number
    daysTraded: number
    daysRequired: number
  }
}

/* ── Performance Types ── */
export interface PerformanceSnapshot {
  accuracy: number
  accuracyTrend: number // +/- vs last period
  winRate: number
  totalTrades: number
  profitFactor: number
  averageRR: number
  bestSetup: { name: string; winRate: number; sampleSize: number }
  worstSetup: { name: string; winRate: number; sampleSize: number; aiSuggestion: string }
  bestSession: { name: string; winRate: number }
  worstSession: { name: string; winRate: number }
  bestPair: { name: string; winRate: number }
  worstPair: { name: string; winRate: number; aiSuggestion: string }
  consistencyScore: number // 0-100
  sparkline: number[] // last 30 days accuracy
}

/* ── Psychology Types ── */
export type MoodLevel = "sharp" | "focused" | "neutral" | "distracted" | "tilted"
export type DisciplineLevel = "excellent" | "good" | "fair" | "poor" | "danger"

export interface PsychologyState {
  currentMood: MoodLevel | null
  lastCheckIn: string | null
  disciplineScore: number // 0-100
  disciplineLevel: DisciplineLevel
  consecutiveLosses: number
  revengeTradingRisk: "low" | "medium" | "high"
  dangerFlags: string[]
  moodHistory: { date: string; mood: MoodLevel; note?: string }[]
  patterns: string[] // AI-detected patterns
}

/* ── Strategy Health Types ── */
export interface StrategyHealth {
  name: string
  winRate: number
  winRateTrend: "improving" | "stable" | "decaying"
  sampleSize: number
  averageRR: number
  pnlContribution: number // positive = helping, negative = hurting
  lastUsed: string
  aiRecommendation: "keep" | "review" | "pause" | "insufficient_data"
}

/* ── Plan Types ── */
export interface DailyPlan {
  date: string
  focusPairs: string[]
  sessionFocus: string[]
  maxTrades: number
  tradesUsed: number
  maxRiskPerTrade: number
  maxDailyLoss: number
  dailyLossUsed: number
  personalRules: string[]
  macroEvents: { time: string; event: string; impact: "high" | "medium" | "low"; currency: string }[]
  aiSuggestion?: string
  isActive: boolean
}

/* ── Notification Types ── */
export type NotificationType =
  | "forecast_resolved"
  | "challenge_alert"
  | "mentor_activity"
  | "community_relevance"
  | "plan_compliance"
  | "reminder"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  timestamp: string
  read: boolean
  actionUrl?: string
  severity: "info" | "warning" | "critical"
}

/* ── Private Note Types ── */
export interface PrivateNote {
  id: string
  content: string
  createdAt: string
  tags: string[]
  linkedForecastId?: string
  linkedTradeId?: string
  type: "reflection" | "lesson" | "bookmark" | "setup"
}

/* ── AI Check-In Types ── */
export interface AICheckIn {
  greeting: string
  stateSummary: {
    accountBalance: string
    openPositions: number
    activeForecasts: number
    currentStreak: { count: number; type: "win" | "loss" }
  }
  keyInsight: string
  suggestion: string
  lastMood: MoodLevel | null
  sessionInfo: { name: string; opensIn: string; isOpen: boolean }
}

/* ── Reset Mode Types ── */
export interface ResetModeState {
  isActive: boolean
  activatedAt: string | null
  reason: string | null
  duration: string | null
  tradeLockEnabled: boolean
  exitCheckInRequired: boolean
}
