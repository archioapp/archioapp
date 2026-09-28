import type {
  TradingAccount, PerformanceSnapshot, PsychologyState,
  StrategyHealth, DailyPlan, AICheckIn, Notification,
  PrivateNote, ResetModeState,
} from "./dashboard-types"

/* ── Accounts ── */
export const ACCOUNTS: TradingAccount[] = [
  {
    id: "acc-1", name: "Main Live", broker: "IC Markets", type: "live",
    balance: 12480.32, equity: 12615.80, floatingPnl: 135.48, currency: "USD",
    drawdownCurrent: 2.1, drawdownMax: 10,
  },
  {
    id: "acc-2", name: "FTMO Challenge", broker: "FTMO", type: "prop_firm",
    balance: 98420.00, equity: 101250.00, floatingPnl: 2830.00, currency: "USD",
    drawdownCurrent: 3.2, drawdownMax: 10,
    propFirm: {
      firm: "FTMO", phase: "evaluation", profitTarget: 10,
      profitCurrent: 4.2, maxDrawdown: 10, dailyLossLimit: 5,
      dailyLossUsed: 0.8, daysTraded: 7, daysRequired: 4,
    },
  },
  {
    id: "acc-3", name: "Demo Practice", broker: "Oanda", type: "demo",
    balance: 50000.00, equity: 50000.00, floatingPnl: 0, currency: "USD",
    drawdownCurrent: 0, drawdownMax: 100,
  },
]

/* ── Performance ── */
export const PERFORMANCE: PerformanceSnapshot = {
  accuracy: 67.3, accuracyTrend: -2.8,
  winRate: 64.2, totalTrades: 142, profitFactor: 1.82, averageRR: 2.1,
  bestSetup: { name: "FVG + OB", winRate: 78, sampleSize: 34 },
  worstSetup: { name: "Breakout", winRate: 41, sampleSize: 22, aiSuggestion: "Consider pausing breakout entries until you review approach on ranging days" },
  bestSession: { name: "London", winRate: 72 },
  worstSession: { name: "NY PM", winRate: 48 },
  bestPair: { name: "EUR/USD", winRate: 74 },
  worstPair: { name: "GBP/JPY", winRate: 38, aiSuggestion: "Your GBP/JPY entries tend to be early. Wait for displacement confirmation." },
  consistencyScore: 71,
  sparkline: [62, 65, 68, 64, 70, 72, 68, 65, 63, 67, 71, 69, 66, 64, 68, 72, 74, 70, 67, 65, 63, 66, 69, 71, 68, 65, 67, 70, 68, 67],
}

/* ── Psychology ── */
export const PSYCHOLOGY: PsychologyState = {
  currentMood: null,
  lastCheckIn: null,
  disciplineScore: 72,
  disciplineLevel: "good",
  consecutiveLosses: 1,
  revengeTradingRisk: "low",
  dangerFlags: [],
  moodHistory: [
    { date: "2026-04-03", mood: "focused", note: "Good prep, stuck to plan" },
    { date: "2026-04-02", mood: "sharp" },
    { date: "2026-04-01", mood: "neutral" },
    { date: "2026-03-31", mood: "distracted", note: "Poor sleep" },
    { date: "2026-03-30", mood: "focused" },
    { date: "2026-03-29", mood: "sharp" },
    { date: "2026-03-28", mood: "neutral" },
  ],
  patterns: [
    "After 2 consecutive losses, your next trade has a 34% win rate",
    "Your accuracy improves 12% when you complete pre-market preparation",
    "Friday NY sessions have your lowest discipline score (58/100)",
  ],
}

/* ── Strategy Health ── */
export const STRATEGIES: StrategyHealth[] = [
  { name: "FVG + Order Block", winRate: 78, winRateTrend: "improving", sampleSize: 34, averageRR: 2.8, pnlContribution: 1240, lastUsed: "2026-04-03", aiRecommendation: "keep" },
  { name: "Liquidity Sweep", winRate: 65, winRateTrend: "stable", sampleSize: 28, averageRR: 2.1, pnlContribution: 580, lastUsed: "2026-04-02", aiRecommendation: "keep" },
  { name: "BPR Entry", winRate: 61, winRateTrend: "stable", sampleSize: 18, averageRR: 1.9, pnlContribution: 220, lastUsed: "2026-04-01", aiRecommendation: "keep" },
  { name: "Breakout", winRate: 41, winRateTrend: "decaying", sampleSize: 22, averageRR: 1.3, pnlContribution: -340, lastUsed: "2026-04-03", aiRecommendation: "pause" },
  { name: "Market Structure Shift", winRate: 55, winRateTrend: "improving", sampleSize: 8, averageRR: 2.4, pnlContribution: 160, lastUsed: "2026-03-28", aiRecommendation: "insufficient_data" },
]

/* ── Daily Plan ── */
export const DAILY_PLAN: DailyPlan = {
  date: "2026-04-04",
  focusPairs: ["EUR/USD", "XAU/USD"],
  sessionFocus: ["London"],
  maxTrades: 2,
  tradesUsed: 0,
  maxRiskPerTrade: 1.5,
  maxDailyLoss: 3,
  dailyLossUsed: 0,
  personalRules: [
    "No trading 30min before high-impact news",
    "Only FVG and Liquidity Sweep setups today",
    "Wait for displacement confirmation before entry",
  ],
  macroEvents: [
    { time: "08:30", event: "ECB Rate Decision", impact: "high", currency: "EUR" },
    { time: "13:30", event: "US Initial Jobless Claims", impact: "medium", currency: "USD" },
    { time: "15:00", event: "ISM Services PMI", impact: "high", currency: "USD" },
  ],
  aiSuggestion: "Based on your recent performance, focus on EUR/USD during London killzone. Your win rate on this pair in London is 74%. Avoid GBP/JPY today -- your accuracy on this pair has been 38% over the last 14 trades.",
  isActive: true,
}

/* ── AI Check-In ── */
export const AI_CHECKIN: AICheckIn = {
  greeting: "Good morning",
  stateSummary: {
    accountBalance: "$12,480",
    openPositions: 1,
    activeForecasts: 3,
    currentStreak: { count: 2, type: "win" },
  },
  keyInsight: "Your GBP/JPY accuracy is 38% over the last 14 trades. Historical pattern: your entries on this pair tend to be 8-12 pips too early. Consider waiting for displacement confirmation or pausing this pair.",
  suggestion: "Focus on EUR/USD during London. Your win rate on this pair in London is 74%. Max 2 trades today. Your FTMO challenge is at 4.2% -- staying disciplined here protects everything you have built.",
  lastMood: "focused",
  sessionInfo: { name: "London", opensIn: "47 minutes", isOpen: false },
}

/* ── Notifications ── */
export const NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "forecast_resolved", title: "Forecast Resolved: EUR/USD LONG", description: "Your forecast was resolved as WON (+42 pips). Accuracy updated to 67.3%.", timestamp: "2h ago", read: false, actionUrl: "/forecast?id=fc-001", severity: "info" },
  { id: "n2", type: "challenge_alert", title: "FTMO Challenge: Drawdown Warning", description: "You are at 3.2% drawdown. Max allowed: 10%. Daily loss used: 0.8% of 5% limit.", timestamp: "4h ago", read: false, severity: "warning" },
  { id: "n3", type: "mentor_activity", title: "Mentor Posted New Forecast", description: "Marcus Wei posted a new forecast on GBP/JPY. Matches your watchlist.", timestamp: "6h ago", read: true, actionUrl: "/forecast?id=fc-099", severity: "info" },
  { id: "n4", type: "plan_compliance", title: "Plan Check", description: "You have 2 trades remaining in today's plan. London session closes in 1h 23m.", timestamp: "1h ago", read: true, severity: "info" },
  { id: "n5", type: "reminder", title: "Self-Reminder", description: "Review yesterday's NY session trades before London open.", timestamp: "8h ago", read: true, severity: "info" },
]

/* ── Private Notes ── */
export const PRIVATE_NOTES: PrivateNote[] = [
  { id: "pn1", content: "The FVG + OB confluence on EUR/USD during London killzone is consistently my highest-probability setup. Need to journal more about the specific candle patterns that confirm the entry.", createdAt: "2026-04-03", tags: ["FVG", "EUR/USD", "London"], type: "lesson" },
  { id: "pn2", content: "Marcus Wei's forecast on GBP/JPY -- study his confluence reasoning. He uses institutional flow data I haven't integrated yet.", createdAt: "2026-04-02", tags: ["mentor", "GBP/JPY"], type: "bookmark", linkedForecastId: "fc-099" },
  { id: "pn3", content: "After every losing day, I need to step away for 30 minutes before reviewing. Reviewing immediately leads to revenge trading thoughts.", createdAt: "2026-03-31", tags: ["psychology", "discipline"], type: "reflection" },
]

/* ── Personal Mission ── */
export const PERSONAL_MISSION = {
  statement: "Build consistent, disciplined income through trading to create freedom for my family and the life I envision. Become the best version of myself through the discipline this craft demands.",
  whyTrading: "Trading is the vehicle, not the destination. I trade to build financial independence, prove that discipline and patience compound over time, and create a life where I control my schedule and impact.",
  longTermVision: "Funded accounts generating consistent monthly income. A proven track record that opens doors. The mental clarity and emotional control that trading builds, applied to every area of life.",
}

/* ── Personal Goals ── */
export const PERSONAL_GOALS = [
  { id: "g1", title: "Pass FTMO Challenge", progress: 42, type: "trading" as const, milestoneLabel: "4.2% of 10% target" },
  { id: "g2", title: "30-day discipline streak", progress: 17, type: "discipline" as const, milestoneLabel: "5 / 30 consecutive days" },
  { id: "g3", title: "Master London killzone", progress: 68, type: "trading" as const, milestoneLabel: "74% win rate achieved" },
  { id: "g4", title: "Daily journaling habit", progress: 55, type: "personal" as const, milestoneLabel: "11 / 20 days this month" },
  { id: "g5", title: "Eliminate revenge trading", progress: 80, type: "discipline" as const, milestoneLabel: "Zero instances this week" },
]

/* ── Recent Trades (last 5, most-recent-first) ──
   Used by the Trader Cartouche's `last-5-trades` streak badge and the
   `last-trade` single-card badge. Mirrors the reference image: pair +
   timeframe + R-multiple + recency, win flag drives the chip colour.
   Five-trade window is deliberate — long enough to show pattern,
   short enough to fit in a single horizontal strip beside the
   headline. */
export interface RecentTrade {
  id: string
  pair: string
  timeframe: "M5" | "M15" | "M30" | "H1" | "H4" | "D1" | "W1"
  rMultiple: number
  direction: "long" | "short"
  recency: string
  won: boolean
}

export const RECENT_TRADES: RecentTrade[] = [
  { id: "t1", pair: "EUR/USD", timeframe: "H1",  rMultiple:  0.7, direction: "long",  recency: "today",  won: true  },
  { id: "t2", pair: "GBP/USD", timeframe: "M15", rMultiple: -0.8, direction: "short", recency: "1d ago", won: false },
  { id: "t3", pair: "XAU/USD", timeframe: "D1",  rMultiple:  2.9, direction: "long",  recency: "3d ago", won: true  },
  { id: "t4", pair: "USD/JPY", timeframe: "H4",  rMultiple: -1.0, direction: "short", recency: "3d ago", won: false },
  { id: "t5", pair: "EUR/USD", timeframe: "H1",  rMultiple:  2.3, direction: "long",  recency: "5d ago", won: true  },
]

/* ── Reset Mode ── */
export const RESET_MODE: ResetModeState = {
  isActive: false,
  activatedAt: null,
  reason: null,
  duration: null,
  tradeLockEnabled: false,
  exitCheckInRequired: true,
}

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · LIVING CARTOUCHE — extended series
   ───────────────────────────────────────────────────────────────────────────
   These exports feed the multi-face gadgets in the welcome cartouche
   (accuracy-engine TREND face, equity-beacon-live CURVE/DAILY, accuracy
   LAST 10 callouts, macro-pulse TODAY list).

   Shapes are kept primitive (readonly number[] / object[]) so they can
   later be swapped 1:1 for a Supabase query response without touching the
   gadget render code. Synthetic but plausible values mirror PERFORMANCE
   and PSYCHOLOGY for narrative coherence — e.g. ACCURACY_TREND_30D ends
   at 67.3 because PERFORMANCE.accuracy is 67.3.
   ═══════════════════════════════════════════════════════════════════════════ */

/** 30-day accuracy trend, oldest → newest. Last value should match
 *  `PERFORMANCE.accuracy` so the RING and TREND faces read consistently. */
export const ACCURACY_TREND_30D: readonly number[] = [
  63.1, 62.4, 64.0, 65.8, 64.3, 66.1, 67.4, 66.9, 65.2, 64.8,
  66.0, 67.3, 68.4, 67.2, 65.9, 66.4, 67.8, 68.9, 70.1, 69.4,
  68.2, 67.0, 65.8, 66.5, 67.2, 68.4, 67.9, 66.8, 67.0, 67.3,
] as const

/** 14-day daily P&L, oldest → newest. Mixed positive/negative for the
 *  daily-bars face. Last value (today) ≈ +$2,184 to match the LEDGER
 *  narrative arc. */
export const EQUITY_DAILY_14D: readonly number[] = [
  +840, -210,  +320, +1240,  -180, +1560, +2100,
  +480, -340,   +90, +1820, -1100,  +780, +2184,
] as const

/** Last 10 trade outcomes, oldest → newest. `true` = win, `false` = loss.
 *  6 wins / 4 losses — the rightmost (most recent) is true, matching the
 *  RECENT_TRADES face. */
export const LAST_10_CALLS: readonly boolean[] = [
  true,  true,  false, true,  true,
  false, true,  false, false, true,
] as const

/** Events scheduled for today, ordered by time. Mirrors DAILY_PLAN.macroEvents
 *  but typed for the macro-pulse gadget. */
export interface MacroEventToday {
  time: string
  event: string
  impact: "high" | "medium" | "low"
  currency: string
}
export const EVENTS_TODAY: readonly MacroEventToday[] = [
  { time: "08:30", event: "ECB Rate Decision",       impact: "high",   currency: "EUR" },
  { time: "13:30", event: "US Initial Jobless Claims", impact: "medium", currency: "USD" },
  { time: "15:00", event: "ISM Services PMI",         impact: "high",   currency: "USD" },
] as const

/** 24-point intraday P&L (today, hour-by-hour). Synthesized as a curve
 *  ending at +$2,184. Feeds management-pulse TODAY face's sparkline. */
export const TODAY_PNL_SPARKLINE_24H: readonly number[] = [
   0,  0,  0,  -80, -120,  +40, +180, +320,
  +280, +420, +680, +1120, +940, +1280, +1520, +1840,
  +1720, +1880, +2040, +2180, +2120, +2050, +2110, +2184,
] as const

/** Per-account mini-sparklines for the LEDGER face. Each is a recent
 *  equity tail. Length 8 keeps each row terse. */
export const ACCOUNT_SPARKLINES: Readonly<Record<string, readonly number[]>> = {
  "acc-1":  [12120, 12180, 12260, 12340, 12420, 12490, 12555, 12615] as const,
  "acc-2":  [98800, 99100, 99450, 99800, 100200, 100600, 100920, 101250] as const,
  "acc-3":  [50000, 50000, 50000, 50000, 50000, 50000, 50000, 50000] as const,
}
