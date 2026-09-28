/* ══════════════════════════════════════════════════════════════════════════
   TRADER PERSONA DATABASE -- 13 UNIQUE TRADER ARCHETYPES
   Each persona is a complete data profile that feeds Psychology, Strategy,
   and Activity tabs. Every number is deliberate. Every pattern is real.
   ══════════════════════════════════════════════════════════════════════════ */

import type { CopilotAnalyticsSnapshot } from "../analytics/CopilotAnalytics"

export interface TraderPersona {
  id: string
  name: string
  alias: string
  tier: "professional" | "advanced" | "good" | "intermediate" | "developing" | "starter" | "gambler"
  tierLabel: string
  tierColor: string
  description: string
  methodology: string
  experience: string
  winRate: number
  avgR: number
  totalTrades: number
  accountGrowth: string  // e.g. "+12.4%" or "-8.2%"
  strengths: string[]
  weaknesses: string[]
  snapshot: CopilotAnalyticsSnapshot
}

const now = Date.now()

/* ════════════════════════════════════════════════════════════════
   1. THE SURGEON -- Professional ICT Trader
   ════════════════════════════════════════════════════════════════ */
const SURGEON: TraderPersona = {
  id: "surgeon",
  name: "Marcus Wei",
  alias: "The Surgeon",
  tier: "professional",
  tierLabel: "PROFESSIONAL",
  tierColor: "#10b981",
  description: "Prop firm trader with 8 years experience. Executes 1-2 trades per day with surgical precision. Runs ICT methodology on EURUSD/GBPUSD exclusively during London and NY sessions.",
  methodology: "ICT Smart Money Concepts",
  experience: "8 years",
  winRate: 68,
  avgR: 1.8,
  totalTrades: 847,
  accountGrowth: "+34.2%",
  strengths: ["Discipline", "Patience", "Rule adherence", "Emotional control"],
  weaknesses: ["Occasionally skips valid setups due to over-filtering"],
  snapshot: {
    activity: {
      counts: { alertsToday: 4, actionsCompleted: 4, avgResponseTime: 2 },
      recentAlerts: [
        { id: "s1", title: "London OB Mitigated", message: "H4 order block at 1.0862 has been mitigated. Watching for M15 confirmation.", timestamp: now - 180000, category: "trading", priority: "high", metadata: { instrument: "EURUSD", value: 1.0862, change: -0.0008 } },
        { id: "s2", title: "Daily Bias Confirmed", message: "D1 bearish displacement confirmed with volume. Sell-side targets 1.0820.", timestamp: now - 600000, category: "trading", priority: "medium", metadata: { instrument: "EURUSD", value: 1.0845 } },
      ],
      activityByHour: [0,0,0,0,0,0,0,1,3,4,3,2,0,1,3,4,3,1,0,0,0,0,0,0],
      topCategories: [{ label: "Trading", value: 3 }, { label: "Market", value: 1 }],
    },
    strategy: {
      counts: { scenariosOpen: 1, forecastsOpen: 1, instrumentsActive: 2 },
      entryMix: [{ label: "limit", value: 8 }, { label: "market", value: 1 }, { label: "stop", value: 1 }],
      timeframes: [{ label: "D1", value: 2 }, { label: "H4", value: 4 }, { label: "H1", value: 3 }, { label: "M15", value: 5 }],
      topModels: [{ label: "OB + FVG", value: 6 }, { label: "Liquidity Sweep", value: 3 }, { label: "BOS Entry", value: 2 }],
      instruments: [{ symbol: "EURUSD", count: 6 }, { symbol: "GBPUSD", count: 4 }],
      openForecasts: [{ id: "F-001", instrument: "EURUSD", status: "published", createdAt: now - 86400000 }],
    },
    psychology: {
      counts: { moodChecks7d: 14, activeDays7d: 7, medianDecisionMins: 8 },
      moodMix7d: [{ label: "Positive", value: 12 }, { label: "Negative", value: 2 }],
      topEmotions: [{ label: "Focused", value: 8 }, { label: "Calm", value: 4 }, { label: "Confident", value: 2 }],
      topPitfalls: [{ label: "Over-filtering", value: 1 }],
      pace24h: [0,0,0,0,0,0,0,1,2,3,2,1,0,1,2,3,2,1,0,0,0,0,0,0],
    },
  },
}

/* ════════════════════════════════════════════════════════════════
   2. THE ARCHITECT -- Professional Supply/Demand Swing Trader
   ════════════════════════════════════════════════════════════════ */
const ARCHITECT: TraderPersona = {
  id: "architect",
  name: "Sarah Chen",
  alias: "The Architect",
  tier: "professional",
  tierLabel: "PROFESSIONAL",
  tierColor: "#10b981",
  description: "Institutional background. Swing trades indices using supply/demand with macro overlays. Holds positions 2-5 days. Risk-averse with 0.25% per trade. Journals religiously.",
  methodology: "Supply & Demand + Macro Analysis",
  experience: "12 years",
  winRate: 58,
  avgR: 2.4,
  totalTrades: 412,
  accountGrowth: "+28.7%",
  strengths: ["Strategic thinking", "Macro awareness", "Low drawdown", "Journaling"],
  weaknesses: ["Slow to adapt to scalping opportunities"],
  snapshot: {
    activity: {
      counts: { alertsToday: 2, actionsCompleted: 2, avgResponseTime: 12 },
      recentAlerts: [
        { id: "a1", title: "Weekly Supply Zone Active", message: "NAS100 entering weekly supply at 18,420. Watching for H4 rejection confirmation.", timestamp: now - 7200000, category: "trading", priority: "high", metadata: { instrument: "NAS100", value: 18420, change: 85 } },
      ],
      activityByHour: [0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0],
      topCategories: [{ label: "Trading", value: 1 }, { label: "Market", value: 1 }],
    },
    strategy: {
      counts: { scenariosOpen: 2, forecastsOpen: 3, instrumentsActive: 3 },
      entryMix: [{ label: "limit", value: 7 }, { label: "stop", value: 2 }, { label: "market", value: 1 }],
      timeframes: [{ label: "W1", value: 2 }, { label: "D1", value: 5 }, { label: "H4", value: 4 }, { label: "H1", value: 2 }],
      topModels: [{ label: "Supply/Demand Zone", value: 5 }, { label: "Macro Confluence", value: 3 }, { label: "Fibonacci Extension", value: 2 }],
      instruments: [{ symbol: "NAS100", count: 4 }, { symbol: "SPX500", count: 3 }, { symbol: "EURUSD", count: 2 }],
      openForecasts: [{ id: "F-101", instrument: "NAS100", status: "published", createdAt: now - 172800000 }, { id: "F-102", instrument: "SPX500", status: "draft", createdAt: now - 86400000 }],
    },
    psychology: {
      counts: { moodChecks7d: 7, activeDays7d: 5, medianDecisionMins: 25 },
      moodMix7d: [{ label: "Positive", value: 6 }, { label: "Negative", value: 1 }],
      topEmotions: [{ label: "Calm", value: 5 }, { label: "Patient", value: 3 }, { label: "Analytical", value: 2 }],
      topPitfalls: [],
      pace24h: [0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0],
    },
  },
}

/* ════════════════════════════════════════════════════════════════
   3. THE SNIPER -- Advanced Price Action Trader
   ════════════════════════════════════════════════════════════════ */
const SNIPER: TraderPersona = {
  id: "sniper",
  name: "James Okafor",
  alias: "The Sniper",
  tier: "advanced",
  tierLabel: "ADVANCED",
  tierColor: "#06b6d4",
  description: "Pure price action trader. No indicators. Reads naked charts on M15/H1. London session specialist. Takes 2-3 trades max. Very selective but aggressive when committed.",
  methodology: "Naked Price Action",
  experience: "5 years",
  winRate: 62,
  avgR: 1.6,
  totalTrades: 1240,
  accountGrowth: "+22.1%",
  strengths: ["Chart reading", "Selectivity", "Session discipline"],
  weaknesses: ["Can become too aggressive after wins", "Occasionally increases size"],
  snapshot: {
    activity: {
      counts: { alertsToday: 6, actionsCompleted: 5, avgResponseTime: 3 },
      recentAlerts: [
        { id: "sn1", title: "Bearish Engulfing H1", message: "GBPUSD printed bearish engulfing at resistance 1.2680. High probability short setup.", timestamp: now - 300000, category: "trading", priority: "high", metadata: { instrument: "GBPUSD", value: 1.2680, change: -0.0015 } },
        { id: "sn2", title: "London Open Sweep", message: "Asian high swept at 1.2695. Expecting reversal within next 30 minutes.", timestamp: now - 900000, category: "trading", priority: "high", metadata: { instrument: "GBPUSD", value: 1.2695 } },
        { id: "sn3", title: "Session Limit Approaching", message: "2 trades taken. Maximum 3 per session. Maintain selectivity.", timestamp: now - 1800000, category: "system", priority: "medium" },
      ],
      activityByHour: [0,0,0,0,0,0,0,2,4,5,4,2,0,0,1,2,1,0,0,0,0,0,0,0],
      topCategories: [{ label: "Trading", value: 4 }, { label: "Market", value: 1 }, { label: "System", value: 1 }],
    },
    strategy: {
      counts: { scenariosOpen: 2, forecastsOpen: 1, instrumentsActive: 3 },
      entryMix: [{ label: "market", value: 5 }, { label: "limit", value: 3 }, { label: "stop", value: 2 }],
      timeframes: [{ label: "H4", value: 2 }, { label: "H1", value: 5 }, { label: "M15", value: 6 }, { label: "M5", value: 3 }],
      topModels: [{ label: "Engulfing Reversal", value: 4 }, { label: "Pin Bar Rejection", value: 3 }, { label: "Break/Retest", value: 3 }],
      instruments: [{ symbol: "GBPUSD", count: 5 }, { symbol: "EURUSD", count: 3 }, { symbol: "USDJPY", count: 2 }],
      openForecasts: [{ id: "F-201", instrument: "GBPUSD", status: "published", createdAt: now - 43200000 }],
    },
    psychology: {
      counts: { moodChecks7d: 10, activeDays7d: 6, medianDecisionMins: 4 },
      moodMix7d: [{ label: "Positive", value: 7 }, { label: "Negative", value: 3 }],
      topEmotions: [{ label: "Confident", value: 4 }, { label: "Focused", value: 3 }, { label: "Overconfidence", value: 2 }, { label: "FOMO", value: 1 }],
      topPitfalls: [{ label: "Chasing trades", value: 1 }],
      pace24h: [0,0,0,0,0,0,0,2,3,4,3,1,0,0,1,1,1,0,0,0,0,0,0,0],
    },
  },
}

/* ════════════════════════════════════════════════════════════════
   4. THE STRATEGIST -- Advanced SMC + Fibonacci Trader
   ════════════════════════════════════════════════════════════════ */
const STRATEGIST: TraderPersona = {
  id: "strategist",
  name: "Priya Kapoor",
  alias: "The Strategist",
  tier: "advanced",
  tierLabel: "ADVANCED",
  tierColor: "#06b6d4",
  description: "SMC trader who layers Fibonacci with order flow. Trades all 3 sessions. Multi-pair portfolio approach. Strong analytics but occasionally overanalyzes and misses entries.",
  methodology: "SMC + Fibonacci + Order Flow",
  experience: "4 years",
  winRate: 56,
  avgR: 1.4,
  totalTrades: 1860,
  accountGrowth: "+18.3%",
  strengths: ["Multi-timeframe analysis", "Risk management", "Data-driven"],
  weaknesses: ["Analysis paralysis", "Sometimes overcomplicates entries"],
  snapshot: {
    activity: {
      counts: { alertsToday: 8, actionsCompleted: 6, avgResponseTime: 5 },
      recentAlerts: [
        { id: "st1", title: "Fibonacci 61.8 Confluence", message: "XAUUSD H4 fib retracement 61.8% aligns with M15 OB at 2348.50.", timestamp: now - 600000, category: "trading", priority: "high", metadata: { instrument: "XAUUSD", value: 2348.5, change: -12.3 } },
        { id: "st2", title: "Multi-Pair Correlation", message: "DXY showing strength. EUR/GBP pairs likely to push lower. Watching for entries.", timestamp: now - 1200000, category: "market", priority: "medium" },
      ],
      activityByHour: [1,0,0,0,1,2,3,3,4,4,3,2,1,2,3,4,3,2,1,0,0,0,1,0],
      topCategories: [{ label: "Trading", value: 5 }, { label: "Market", value: 2 }, { label: "System", value: 1 }],
    },
    strategy: {
      counts: { scenariosOpen: 4, forecastsOpen: 3, instrumentsActive: 5 },
      entryMix: [{ label: "limit", value: 6 }, { label: "stop", value: 3 }, { label: "market", value: 2 }],
      timeframes: [{ label: "D1", value: 2 }, { label: "H4", value: 4 }, { label: "H1", value: 5 }, { label: "M15", value: 4 }, { label: "M5", value: 2 }],
      topModels: [{ label: "SMC + Fib Confluence", value: 5 }, { label: "Order Block Entry", value: 3 }, { label: "CHoCH + FVG", value: 3 }],
      instruments: [{ symbol: "XAUUSD", count: 4 }, { symbol: "EURUSD", count: 3 }, { symbol: "GBPUSD", count: 3 }, { symbol: "USDJPY", count: 2 }, { symbol: "NAS100", count: 1 }],
      openForecasts: [{ id: "F-301", instrument: "XAUUSD", status: "published", createdAt: now - 86400000 }, { id: "F-302", instrument: "EURUSD", status: "draft", createdAt: now - 43200000 }],
    },
    psychology: {
      counts: { moodChecks7d: 12, activeDays7d: 7, medianDecisionMins: 12 },
      moodMix7d: [{ label: "Positive", value: 8 }, { label: "Negative", value: 4 }],
      topEmotions: [{ label: "Analytical", value: 5 }, { label: "Anxious", value: 3 }, { label: "Focused", value: 2 }, { label: "Hesitant", value: 2 }],
      topPitfalls: [{ label: "Didn't follow rules", value: 1 }, { label: "Over-filtering", value: 2 }],
      pace24h: [1,0,0,0,1,1,2,2,3,3,2,1,1,1,2,3,2,1,1,0,0,0,1,0],
    },
  },
}

/* ════════════════════════════════════════════════════════════════
   5. THE STEADY -- Good Consistent Day Trader
   ════════════════════════════════════════════════════════════════ */
const STEADY: TraderPersona = {
  id: "steady",
  name: "David Müller",
  alias: "The Steady",
  tier: "good",
  tierLabel: "GOOD",
  tierColor: "#22d3ee",
  description: "Consistent day trader who grinds small gains. NY session only. 3 pairs max. Knows his edge and plays it repeatedly. Not flashy but profitable.",
  methodology: "Break & Retest",
  experience: "3 years",
  winRate: 54,
  avgR: 1.2,
  totalTrades: 2100,
  accountGrowth: "+14.6%",
  strengths: ["Consistency", "Session focus", "Accepts small wins"],
  weaknesses: ["Leaves money on table", "Cuts winners slightly early"],
  snapshot: {
    activity: {
      counts: { alertsToday: 7, actionsCompleted: 5, avgResponseTime: 4 },
      recentAlerts: [
        { id: "sd1", title: "Break & Retest Confirmed", message: "EURUSD H1 broke 1.0850 and retested. Valid long setup forming.", timestamp: now - 450000, category: "trading", priority: "high", metadata: { instrument: "EURUSD", value: 1.0852, change: 0.0004 } },
      ],
      activityByHour: [0,0,0,0,0,0,0,0,0,0,0,0,0,1,3,4,5,4,2,1,0,0,0,0],
      topCategories: [{ label: "Trading", value: 5 }, { label: "System", value: 2 }],
    },
    strategy: {
      counts: { scenariosOpen: 2, forecastsOpen: 1, instrumentsActive: 3 },
      entryMix: [{ label: "market", value: 4 }, { label: "limit", value: 4 }, { label: "stop", value: 2 }],
      timeframes: [{ label: "H1", value: 4 }, { label: "M15", value: 5 }, { label: "M5", value: 3 }],
      topModels: [{ label: "Break/Retest", value: 7 }, { label: "Range Break", value: 2 }, { label: "Momentum", value: 1 }],
      instruments: [{ symbol: "EURUSD", count: 4 }, { symbol: "GBPUSD", count: 3 }, { symbol: "USDJPY", count: 2 }],
      openForecasts: [{ id: "F-401", instrument: "EURUSD", status: "published", createdAt: now - 43200000 }],
    },
    psychology: {
      counts: { moodChecks7d: 8, activeDays7d: 5, medianDecisionMins: 5 },
      moodMix7d: [{ label: "Positive", value: 5 }, { label: "Negative", value: 3 }],
      topEmotions: [{ label: "Calm", value: 4 }, { label: "Focused", value: 2 }, { label: "Fear of losing", value: 2 }],
      topPitfalls: [{ label: "Cutting winners early", value: 2 }],
      pace24h: [0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,3,2,1,0,0,0,0,0],
    },
  },
}

/* ════════════════════════════════════════════════════════════════
   6. THE HUNTER -- Good Momentum Trader
   ════════════════════════════════════════════════════════════════ */
const HUNTER: TraderPersona = {
  id: "hunter",
  name: "Carlos Rodríguez",
  alias: "The Hunter",
  tier: "good",
  tierLabel: "GOOD",
  tierColor: "#22d3ee",
  description: "Momentum trader who hunts breakouts. Trades indices and gold. Uses VWAP and volume profile. Quick entries but sometimes holds too long hoping for extension.",
  methodology: "Momentum + VWAP",
  experience: "3 years",
  winRate: 52,
  avgR: 1.5,
  totalTrades: 1580,
  accountGrowth: "+16.8%",
  strengths: ["Quick decision making", "Trend identification", "Volume reading"],
  weaknesses: ["Holds losers too long", "Sometimes chases momentum"],
  snapshot: {
    activity: {
      counts: { alertsToday: 10, actionsCompleted: 7, avgResponseTime: 2 },
      recentAlerts: [
        { id: "h1", title: "VWAP Reclaim", message: "NAS100 reclaimed VWAP with volume spike. Momentum shift likely.", timestamp: now - 240000, category: "trading", priority: "high", metadata: { instrument: "NAS100", value: 18380, change: 45 } },
        { id: "h2", title: "Volume Spike Detected", message: "XAUUSD 5min candle 3x average volume. Institutional activity likely.", timestamp: now - 720000, category: "market", priority: "high", metadata: { instrument: "XAUUSD", value: 2345 } },
      ],
      activityByHour: [0,0,0,0,0,0,0,1,2,3,4,3,1,2,4,5,4,2,1,0,0,0,0,0],
      topCategories: [{ label: "Trading", value: 6 }, { label: "Market", value: 3 }, { label: "System", value: 1 }],
    },
    strategy: {
      counts: { scenariosOpen: 3, forecastsOpen: 2, instrumentsActive: 4 },
      entryMix: [{ label: "market", value: 7 }, { label: "stop", value: 2 }, { label: "limit", value: 1 }],
      timeframes: [{ label: "H1", value: 2 }, { label: "M15", value: 4 }, { label: "M5", value: 5 }, { label: "M1", value: 3 }],
      topModels: [{ label: "VWAP Reclaim", value: 4 }, { label: "Momentum Break", value: 4 }, { label: "Volume Spike", value: 3 }],
      instruments: [{ symbol: "NAS100", count: 4 }, { symbol: "XAUUSD", count: 4 }, { symbol: "SPX500", count: 2 }, { symbol: "EURUSD", count: 1 }],
      openForecasts: [{ id: "F-501", instrument: "NAS100", status: "published", createdAt: now - 28800000 }],
    },
    psychology: {
      counts: { moodChecks7d: 9, activeDays7d: 6, medianDecisionMins: 2 },
      moodMix7d: [{ label: "Positive", value: 5 }, { label: "Negative", value: 4 }],
      topEmotions: [{ label: "Excited", value: 3 }, { label: "FOMO", value: 3 }, { label: "Frustrated", value: 2 }, { label: "Confident", value: 1 }],
      topPitfalls: [{ label: "Chasing trades", value: 2 }, { label: "Overtrading", value: 1 }],
      pace24h: [0,0,0,0,0,0,0,1,2,3,3,2,1,1,3,4,3,2,1,0,0,0,0,0],
    },
  },
}

/* ════════════════════════════════════════════════════════════════
   7. THE STUDENT -- Intermediate Learner
   ════════════════════════════════════════════════════════════════ */
const STUDENT: TraderPersona = {
  id: "student",
  name: "Alex Thompson",
  alias: "The Student",
  tier: "intermediate",
  tierLabel: "INTERMEDIATE",
  tierColor: "#a78bfa",
  description: "Learning ICT concepts. Studies hard but execution lags behind knowledge. Knows the theory but fumbles under pressure. Takes too many trades trying to prove the concepts work.",
  methodology: "ICT (Learning)",
  experience: "1.5 years",
  winRate: 45,
  avgR: 0.8,
  totalTrades: 980,
  accountGrowth: "+3.2%",
  strengths: ["Dedication to learning", "Good analysis", "Self-aware"],
  weaknesses: ["Execution under pressure", "Overtrading", "Second-guessing"],
  snapshot: {
    activity: {
      counts: { alertsToday: 14, actionsCompleted: 8, avgResponseTime: 6 },
      recentAlerts: [
        { id: "st1", title: "Potential OB Identified", message: "EURUSD M15 might have an order block at 1.0838. Needs H1 confirmation.", timestamp: now - 180000, category: "trading", priority: "medium", metadata: { instrument: "EURUSD", value: 1.0838 } },
        { id: "st2", title: "Overtrading Warning", message: "4th trade today. Your maximum is 3. Consider stopping.", timestamp: now - 600000, category: "system", priority: "high" },
        { id: "st3", title: "No HTF Confluence", message: "This M5 setup has no H4 backing. Skipping recommended.", timestamp: now - 1500000, category: "trading", priority: "medium" },
      ],
      activityByHour: [1,0,0,0,1,2,3,3,4,5,4,3,2,3,4,5,4,3,2,1,0,1,1,0],
      topCategories: [{ label: "Trading", value: 8 }, { label: "System", value: 4 }, { label: "Market", value: 2 }],
    },
    strategy: {
      counts: { scenariosOpen: 5, forecastsOpen: 2, instrumentsActive: 6 },
      entryMix: [{ label: "market", value: 6 }, { label: "limit", value: 3 }, { label: "stop", value: 1 }],
      timeframes: [{ label: "H4", value: 1 }, { label: "H1", value: 2 }, { label: "M15", value: 4 }, { label: "M5", value: 5 }, { label: "M1", value: 3 }],
      topModels: [{ label: "FVG Entry", value: 3 }, { label: "BOS + Retest", value: 3 }, { label: "OB Rejection", value: 2 }, { label: "Random", value: 2 }],
      instruments: [{ symbol: "EURUSD", count: 3 }, { symbol: "GBPUSD", count: 3 }, { symbol: "USDJPY", count: 2 }, { symbol: "XAUUSD", count: 2 }, { symbol: "GBPJPY", count: 1 }, { symbol: "EURJPY", count: 1 }],
      openForecasts: [{ id: "F-601", instrument: "EURUSD", status: "draft", createdAt: now - 21600000 }],
    },
    psychology: {
      counts: { moodChecks7d: 6, activeDays7d: 6, medianDecisionMins: 3 },
      moodMix7d: [{ label: "Positive", value: 3 }, { label: "Negative", value: 5 }],
      topEmotions: [{ label: "FOMO", value: 4 }, { label: "Frustration", value: 3 }, { label: "Anxious", value: 2 }, { label: "Hopeful", value: 1 }],
      topPitfalls: [{ label: "Overtrading", value: 3 }, { label: "Didn't follow rules", value: 2 }, { label: "Chasing trades", value: 2 }],
      pace24h: [1,0,0,0,1,1,2,2,3,4,3,2,1,2,3,4,3,2,1,1,0,1,0,0],
    },
  },
}

/* ════════════════════════════════════════════════════════════════
   8. THE GRINDER -- Intermediate Scalper
   ════════════════════════════════════════════════════════════════ */
const GRINDER: TraderPersona = {
  id: "grinder",
  name: "Yuki Tanaka",
  alias: "The Grinder",
  tier: "intermediate",
  tierLabel: "INTERMEDIATE",
  tierColor: "#a78bfa",
  description: "Scalper who takes 5-8 trades per session on M1/M5. Wins most trades but the occasional large loss wipes out multiple small wins. Struggles with stop loss discipline.",
  methodology: "Scalping (M1/M5)",
  experience: "2 years",
  winRate: 61,
  avgR: 0.4,
  totalTrades: 4200,
  accountGrowth: "+6.1%",
  strengths: ["Quick reflexes", "High win rate", "Session consistency"],
  weaknesses: ["Moves stop loss", "Large occasional losses", "Doesn't let winners run"],
  snapshot: {
    activity: {
      counts: { alertsToday: 18, actionsCompleted: 12, avgResponseTime: 1 },
      recentAlerts: [
        { id: "g1", title: "Rapid Fire Entry", message: "3 trades in 12 minutes. Slow down. Quality over quantity.", timestamp: now - 60000, category: "system", priority: "high" },
        { id: "g2", title: "SL Moved Warning", message: "Stop loss moved 2x on current USDJPY position. Original SL was correct.", timestamp: now - 300000, category: "system", priority: "high" },
      ],
      activityByHour: [0,0,0,0,0,0,0,3,5,7,6,4,1,2,5,7,6,3,1,0,0,0,0,0],
      topCategories: [{ label: "Trading", value: 12 }, { label: "System", value: 4 }, { label: "Market", value: 2 }],
    },
    strategy: {
      counts: { scenariosOpen: 1, forecastsOpen: 0, instrumentsActive: 3 },
      entryMix: [{ label: "market", value: 9 }, { label: "limit", value: 1 }, { label: "stop", value: 0 }],
      timeframes: [{ label: "M1", value: 7 }, { label: "M5", value: 5 }, { label: "M15", value: 1 }],
      topModels: [{ label: "Scalp Reversal", value: 5 }, { label: "Range Play", value: 3 }, { label: "Momentum Burst", value: 2 }],
      instruments: [{ symbol: "USDJPY", count: 5 }, { symbol: "EURUSD", count: 3 }, { symbol: "GBPJPY", count: 2 }],
      openForecasts: [],
    },
    psychology: {
      counts: { moodChecks7d: 5, activeDays7d: 7, medianDecisionMins: 0.5 },
      moodMix7d: [{ label: "Positive", value: 3 }, { label: "Negative", value: 4 }],
      topEmotions: [{ label: "Rushed", value: 4 }, { label: "Frustration", value: 3 }, { label: "FOMO", value: 2 }, { label: "Hopeful", value: 1 }],
      topPitfalls: [{ label: "Overtrading", value: 4 }, { label: "Trading without SL", value: 2 }, { label: "Chasing trades", value: 1 }],
      pace24h: [0,0,0,0,0,0,0,3,4,5,4,3,1,2,4,5,4,2,1,0,0,0,0,0],
    },
  },
}

/* ════════════════════════════════════════════════════════════════
   9. THE SEEKER -- Developing Indicator Trader
   ════════════════════════════════════════════════════════════════ */
const SEEKER: TraderPersona = {
  id: "seeker",
  name: "Emma Larsson",
  alias: "The Seeker",
  tier: "developing",
  tierLabel: "DEVELOPING",
  tierColor: "#f59e0b",
  description: "Switches between indicators frequently. Uses RSI + MACD + MA crossovers. Hasn't found a consistent edge yet. Backtests but doesn't stick to one system long enough.",
  methodology: "Indicator-based (RSI/MACD/MA)",
  experience: "1 year",
  winRate: 42,
  avgR: 0.6,
  totalTrades: 680,
  accountGrowth: "-4.2%",
  strengths: ["Willingness to learn", "Backtests systems", "Uses demo well"],
  weaknesses: ["System hopping", "No consistent methodology", "Lacks conviction"],
  snapshot: {
    activity: {
      counts: { alertsToday: 11, actionsCompleted: 4, avgResponseTime: 8 },
      recentAlerts: [
        { id: "se1", title: "Signal Contradiction", message: "RSI oversold but MACD bearish. Mixed signals on EURUSD. Consider waiting.", timestamp: now - 300000, category: "trading", priority: "medium", metadata: { instrument: "EURUSD", value: 1.0840 } },
        { id: "se2", title: "Strategy Change Detected", message: "You switched from MA crossover to RSI divergence mid-session. Stick to one system.", timestamp: now - 900000, category: "system", priority: "high" },
      ],
      activityByHour: [0,0,0,0,0,1,2,2,3,3,2,2,1,2,3,3,2,1,1,0,0,0,0,0],
      topCategories: [{ label: "Trading", value: 6 }, { label: "System", value: 3 }, { label: "Market", value: 2 }],
    },
    strategy: {
      counts: { scenariosOpen: 3, forecastsOpen: 0, instrumentsActive: 5 },
      entryMix: [{ label: "market", value: 5 }, { label: "limit", value: 3 }, { label: "stop", value: 2 }],
      timeframes: [{ label: "H1", value: 3 }, { label: "M15", value: 4 }, { label: "M5", value: 3 }],
      topModels: [{ label: "RSI Divergence", value: 3 }, { label: "MA Crossover", value: 2 }, { label: "MACD Signal", value: 2 }, { label: "Random Entry", value: 1 }],
      instruments: [{ symbol: "EURUSD", count: 3 }, { symbol: "GBPUSD", count: 2 }, { symbol: "XAUUSD", count: 2 }, { symbol: "USDJPY", count: 1 }, { symbol: "AUDUSD", count: 1 }],
      openForecasts: [],
    },
    psychology: {
      counts: { moodChecks7d: 4, activeDays7d: 4, medianDecisionMins: 7 },
      moodMix7d: [{ label: "Positive", value: 2 }, { label: "Negative", value: 4 }],
      topEmotions: [{ label: "Confused", value: 3 }, { label: "Hopeful", value: 2 }, { label: "Frustration", value: 2 }, { label: "Fear of losing", value: 1 }],
      topPitfalls: [{ label: "Didn't follow rules", value: 3 }, { label: "Strategy switching", value: 2 }, { label: "Overtrading", value: 1 }],
      pace24h: [0,0,0,0,0,1,1,2,2,3,2,1,1,1,2,2,2,1,0,0,0,0,0,0],
    },
  },
}

/* ════════════════════════════════════════════════════════════════
   10. THE WANDERER -- Developing Multi-System Hopper
   ════════════════════════════════════════════════════════════════ */
const WANDERER: TraderPersona = {
  id: "wanderer",
  name: "Ryan Mitchell",
  alias: "The Wanderer",
  tier: "developing",
  tierLabel: "DEVELOPING",
  tierColor: "#f59e0b",
  description: "Jumps between strategies weekly. This week it's SMC, last week it was supply/demand, before that it was Elliott Wave. Never gives a system enough trades to prove itself.",
  methodology: "Everything (changes weekly)",
  experience: "1 year",
  winRate: 38,
  avgR: 0.3,
  totalTrades: 520,
  accountGrowth: "-11.4%",
  strengths: ["Wide knowledge base", "Curiosity"],
  weaknesses: ["No commitment", "Strategy hopping", "Inconsistency", "No edge"],
  snapshot: {
    activity: {
      counts: { alertsToday: 15, actionsCompleted: 5, avgResponseTime: 10 },
      recentAlerts: [
        { id: "w1", title: "System Inconsistency", message: "3 different entry models used today. No statistical edge can develop this way.", timestamp: now - 300000, category: "system", priority: "high" },
        { id: "w2", title: "No Journal Entries", message: "0 journal entries this week. Without reflection, patterns cannot be identified.", timestamp: now - 86400000, category: "system", priority: "high" },
      ],
      activityByHour: [1,0,0,0,1,1,2,3,3,2,2,3,2,2,3,3,2,2,1,1,0,1,1,0],
      topCategories: [{ label: "Trading", value: 8 }, { label: "System", value: 5 }, { label: "Market", value: 2 }],
    },
    strategy: {
      counts: { scenariosOpen: 6, forecastsOpen: 0, instrumentsActive: 8 },
      entryMix: [{ label: "market", value: 7 }, { label: "limit", value: 2 }, { label: "stop", value: 1 }],
      timeframes: [{ label: "D1", value: 1 }, { label: "H4", value: 2 }, { label: "H1", value: 3 }, { label: "M15", value: 3 }, { label: "M5", value: 3 }, { label: "M1", value: 2 }],
      topModels: [{ label: "SMC Entry", value: 2 }, { label: "Supply Zone", value: 2 }, { label: "Elliott Wave", value: 1 }, { label: "Random", value: 3 }],
      instruments: [{ symbol: "EURUSD", count: 2 }, { symbol: "GBPUSD", count: 2 }, { symbol: "XAUUSD", count: 2 }, { symbol: "USDJPY", count: 1 }, { symbol: "NAS100", count: 1 }, { symbol: "GBPJPY", count: 1 }, { symbol: "AUDUSD", count: 1 }, { symbol: "BTCUSD", count: 1 }],
      openForecasts: [],
    },
    psychology: {
      counts: { moodChecks7d: 3, activeDays7d: 7, medianDecisionMins: 2 },
      moodMix7d: [{ label: "Positive", value: 1 }, { label: "Negative", value: 5 }],
      topEmotions: [{ label: "Frustration", value: 4 }, { label: "FOMO", value: 3 }, { label: "Confused", value: 2 }, { label: "Hopeful", value: 1 }],
      topPitfalls: [{ label: "Didn't follow rules", value: 4 }, { label: "Overtrading", value: 3 }, { label: "Chasing trades", value: 2 }, { label: "Strategy switching", value: 3 }],
      pace24h: [1,0,0,0,1,1,2,2,3,2,2,2,2,2,2,3,2,2,1,1,0,1,0,0],
    },
  },
}

/* ════════════════════════════════════════════════════════════════
   11. THE ROOKIE -- Starter / Just Beginning
   ════════════════════════════════════════════════════════════════ */
const ROOKIE: TraderPersona = {
  id: "rookie",
  name: "Jake Wilson",
  alias: "The Rookie",
  tier: "starter",
  tierLabel: "STARTER",
  tierColor: "#94a3b8",
  description: "Brand new to trading. Learned from YouTube. Just opened a demo account. Doesn't understand risk management yet. Takes trades based on gut feeling and social media calls.",
  methodology: "YouTube/Social Media",
  experience: "2 months",
  winRate: 35,
  avgR: -0.2,
  totalTrades: 120,
  accountGrowth: "-18.5%",
  strengths: ["Enthusiasm", "Wants to learn"],
  weaknesses: ["No risk management", "No methodology", "Social media influenced", "No plan"],
  snapshot: {
    activity: {
      counts: { alertsToday: 20, actionsCompleted: 3, avgResponseTime: 15 },
      recentAlerts: [
        { id: "r1", title: "No Stop Loss", message: "Trade entered without stop loss. Account at extreme risk.", timestamp: now - 120000, category: "system", priority: "high" },
        { id: "r2", title: "Lot Size Warning", message: "Position size 5% of account. Recommended maximum is 1%.", timestamp: now - 300000, category: "system", priority: "high" },
        { id: "r3", title: "Counter-Trend Entry", message: "Buying against D1 downtrend. No structural confluence.", timestamp: now - 900000, category: "trading", priority: "high" },
      ],
      activityByHour: [2,1,0,0,0,1,1,2,2,3,2,2,2,2,3,3,2,2,2,1,1,2,2,1],
      topCategories: [{ label: "System", value: 10 }, { label: "Trading", value: 7 }, { label: "Market", value: 3 }],
    },
    strategy: {
      counts: { scenariosOpen: 0, forecastsOpen: 0, instrumentsActive: 10 },
      entryMix: [{ label: "market", value: 9 }, { label: "limit", value: 1 }, { label: "stop", value: 0 }],
      timeframes: [{ label: "M5", value: 5 }, { label: "M1", value: 6 }, { label: "M15", value: 2 }],
      topModels: [{ label: "Gut Feeling", value: 4 }, { label: "Social Media Call", value: 3 }, { label: "Random", value: 3 }],
      instruments: [{ symbol: "BTCUSD", count: 3 }, { symbol: "XAUUSD", count: 2 }, { symbol: "EURUSD", count: 2 }, { symbol: "GBPJPY", count: 1 }, { symbol: "NAS100", count: 1 }, { symbol: "SOLUSD", count: 1 }],
      openForecasts: [],
    },
    psychology: {
      counts: { moodChecks7d: 2, activeDays7d: 7, medianDecisionMins: 0.5 },
      moodMix7d: [{ label: "Positive", value: 1 }, { label: "Negative", value: 6 }],
      topEmotions: [{ label: "FOMO", value: 5 }, { label: "Fear of losing", value: 3 }, { label: "Frustration", value: 3 }, { label: "Overconfidence", value: 2 }],
      topPitfalls: [{ label: "Trading without SL", value: 5 }, { label: "Overtrading", value: 4 }, { label: "Chasing trades", value: 3 }, { label: "Didn't follow rules", value: 3 }],
      pace24h: [2,1,0,0,0,1,1,1,2,2,2,1,1,2,2,3,2,2,2,1,1,2,1,1],
    },
  },
}

/* ════════════════════════════════════════════════════════════════
   12. THE GAMBLER -- Pure Gambling Behavior
   ════════════════════════════════════════════════════════════════ */
const GAMBLER_PERSONA: TraderPersona = {
  id: "gambler",
  name: "Mike 'All-In' Davis",
  alias: "The Gambler",
  tier: "gambler",
  tierLabel: "GAMBLER",
  tierColor: "#ef4444",
  description: "Treats trading like a casino. 10% risk per trade. Martingales after losses. No analysis, no plan, no journal. Chases every move. Has blown 3 accounts.",
  methodology: "None (Gambling)",
  experience: "6 months (3 blown accounts)",
  winRate: 28,
  avgR: -1.2,
  totalTrades: 2800,
  accountGrowth: "-67.3%",
  strengths: [],
  weaknesses: ["No risk management", "Martingale sizing", "Revenge trading", "No methodology", "Emotional decisions", "No journal"],
  snapshot: {
    activity: {
      counts: { alertsToday: 35, actionsCompleted: 1, avgResponseTime: 0 },
      recentAlerts: [
        { id: "gm1", title: "ACCOUNT CRITICAL", message: "Account down -8.4% today. Daily limit exceeded by 420%. ALL TRADING MUST STOP.", timestamp: now - 60000, category: "system", priority: "high" },
        { id: "gm2", title: "Revenge Trade #5", message: "5th trade in 18 minutes after a loss. Win rate on revenge trades: 12%.", timestamp: now - 180000, category: "system", priority: "high" },
        { id: "gm3", title: "Position Size Violation", message: "Current position: 12% of account. This is 12x recommended risk.", timestamp: now - 300000, category: "system", priority: "high" },
        { id: "gm4", title: "Martingale Detected", message: "Each trade is 2x the previous. 4th consecutive double-down.", timestamp: now - 600000, category: "system", priority: "high" },
      ],
      activityByHour: [3,2,1,1,1,2,4,5,6,7,6,5,4,5,6,8,7,5,4,3,3,3,3,2],
      topCategories: [{ label: "System", value: 20 }, { label: "Trading", value: 12 }, { label: "Market", value: 3 }],
    },
    strategy: {
      counts: { scenariosOpen: 0, forecastsOpen: 0, instrumentsActive: 12 },
      entryMix: [{ label: "market", value: 10 }, { label: "limit", value: 0 }, { label: "stop", value: 0 }],
      timeframes: [{ label: "M1", value: 8 }, { label: "M5", value: 3 }],
      topModels: [{ label: "Gut Feeling", value: 5 }, { label: "Revenge Trade", value: 4 }, { label: "Martingale", value: 3 }],
      instruments: [{ symbol: "XAUUSD", count: 4 }, { symbol: "BTCUSD", count: 3 }, { symbol: "NAS100", count: 3 }, { symbol: "GBPJPY", count: 2 }, { symbol: "EURUSD", count: 1 }],
      openForecasts: [],
    },
    psychology: {
      counts: { moodChecks7d: 1, activeDays7d: 7, medianDecisionMins: 0.2 },
      moodMix7d: [{ label: "Positive", value: 0 }, { label: "Negative", value: 7 }],
      topEmotions: [{ label: "FOMO", value: 6 }, { label: "Frustration", value: 5 }, { label: "Fear of losing", value: 4 }, { label: "Overconfidence", value: 3 }],
      topPitfalls: [{ label: "Overtrading", value: 6 }, { label: "Trading without SL", value: 5 }, { label: "Chasing trades", value: 5 }, { label: "Didn't follow rules", value: 5 }],
      pace24h: [3,2,1,1,1,2,3,4,5,6,5,4,3,4,5,6,5,4,3,3,2,3,3,2],
    },
  },
}

/* ════════════════════════════════════════════════════════════════
   13. THE PHOENIX -- Low Performer Recovering
   ════════════════════════════════════════════════════════════════ */
const PHOENIX: TraderPersona = {
  id: "phoenix",
  name: "Amir Hassan",
  alias: "The Phoenix",
  tier: "developing",
  tierLabel: "RECOVERING",
  tierColor: "#fb923c",
  description: "Was a gambler. Lost 40% of account. Hit rock bottom and started journaling, following rules, and reducing size. Still has bad days but the trend is improving. Recovery in progress.",
  methodology: "Price Action (Simplified)",
  experience: "1.5 years (recovering 6 months)",
  winRate: 44,
  avgR: 0.5,
  totalTrades: 340,
  accountGrowth: "-2.1% (recovering from -40%)",
  strengths: ["Self-awareness", "Journaling", "Improving discipline"],
  weaknesses: ["Occasional revenge trades", "Confidence rebuilding", "Still impulsive under stress"],
  snapshot: {
    activity: {
      counts: { alertsToday: 9, actionsCompleted: 6, avgResponseTime: 6 },
      recentAlerts: [
        { id: "ph1", title: "Recovery Progress", message: "3 consecutive green days. Longest streak in 2 months. Keep going.", timestamp: now - 300000, category: "system", priority: "medium" },
        { id: "ph2", title: "Cooldown Reminder", message: "Loss taken 8 minutes ago. Your 15-minute cooldown is active. 7 minutes remaining.", timestamp: now - 480000, category: "system", priority: "high" },
      ],
      activityByHour: [0,0,0,0,0,0,0,1,2,3,3,2,0,1,2,3,3,2,1,0,0,0,0,0],
      topCategories: [{ label: "System", value: 4 }, { label: "Trading", value: 4 }, { label: "Market", value: 1 }],
    },
    strategy: {
      counts: { scenariosOpen: 1, forecastsOpen: 1, instrumentsActive: 2 },
      entryMix: [{ label: "market", value: 4 }, { label: "limit", value: 4 }, { label: "stop", value: 2 }],
      timeframes: [{ label: "H4", value: 2 }, { label: "H1", value: 4 }, { label: "M15", value: 4 }],
      topModels: [{ label: "Pin Bar", value: 3 }, { label: "Engulfing", value: 2 }, { label: "Break/Retest", value: 2 }],
      instruments: [{ symbol: "EURUSD", count: 5 }, { symbol: "GBPUSD", count: 3 }],
      openForecasts: [{ id: "F-1201", instrument: "EURUSD", status: "draft", createdAt: now - 43200000 }],
    },
    psychology: {
      counts: { moodChecks7d: 7, activeDays7d: 5, medianDecisionMins: 5 },
      moodMix7d: [{ label: "Positive", value: 4 }, { label: "Negative", value: 4 }],
      topEmotions: [{ label: "Hopeful", value: 3 }, { label: "Anxious", value: 2 }, { label: "FOMO", value: 2 }, { label: "Frustrated", value: 1 }],
      topPitfalls: [{ label: "Overtrading", value: 1 }, { label: "Chasing trades", value: 1 }],
      pace24h: [0,0,0,0,0,0,0,1,2,3,2,1,0,1,2,2,2,1,1,0,0,0,0,0],
    },
  },
}

/* ════════════════════════════════════════════════════════════════
   FRESH SETUP -- Empty state (just completed onboarding)
   ════════════════════════════════════════════════════════════════ */
export const FRESH_SETUP: TraderPersona = {
  id: "fresh",
  name: "New User",
  alias: "Fresh Setup",
  tier: "starter",
  tierLabel: "FRESH",
  tierColor: "#64748b",
  description: "Just completed the onboarding questionnaire. No trade history yet. All analytics are at zero/default. This is what a brand-new profile looks like.",
  methodology: "Pending first session",
  experience: "Day 1",
  winRate: 0,
  avgR: 0,
  totalTrades: 0,
  accountGrowth: "0.0%",
  strengths: ["Clean slate", "No bad habits yet"],
  weaknesses: ["No data", "Unproven"],
  snapshot: {
    activity: {
      counts: { alertsToday: 0, actionsCompleted: 0, avgResponseTime: 0 },
      recentAlerts: [],
      activityByHour: Array(24).fill(0),
      topCategories: [],
    },
    strategy: {
      counts: { scenariosOpen: 0, forecastsOpen: 0, instrumentsActive: 0 },
      entryMix: [{ label: "market", value: 0 }, { label: "limit", value: 0 }, { label: "stop", value: 0 }],
      timeframes: [],
      topModels: [],
      instruments: [],
      openForecasts: [],
    },
    psychology: {
      counts: { moodChecks7d: 0, activeDays7d: 0, medianDecisionMins: 0 },
      moodMix7d: [{ label: "Positive", value: 0 }, { label: "Negative", value: 0 }],
      topEmotions: [],
      topPitfalls: [],
      pace24h: Array(24).fill(0),
    },
  },
}

/* ════════════════════════════════════════════════════════════════
   EXPORTS -- All 14 personas (13 + fresh state)
   ════════════════════════════════════════════════════════════════ */
export const ALL_PERSONAS: TraderPersona[] = [
  SURGEON,
  ARCHITECT,
  SNIPER,
  STRATEGIST,
  STEADY,
  HUNTER,
  STUDENT,
  GRINDER,
  SEEKER,
  WANDERER,
  ROOKIE,
  GAMBLER_PERSONA,
  PHOENIX,
  FRESH_SETUP,
]

export const PERSONAS_BY_TIER = {
  professional: [SURGEON, ARCHITECT],
  advanced: [SNIPER, STRATEGIST],
  good: [STEADY, HUNTER],
  intermediate: [STUDENT, GRINDER],
  developing: [SEEKER, WANDERER, PHOENIX],
  starter: [ROOKIE, FRESH_SETUP],
  gambler: [GAMBLER_PERSONA],
}
