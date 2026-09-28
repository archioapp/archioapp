"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
  ChevronLeft,
  Activity,
} from "lucide-react"
import dynamic from "next/dynamic"
import type { RuleCommitment } from "@/components/copilot/analytics/StrategyAnalytics"

const StrategyAnalytics = dynamic(
  () => import("@/components/copilot/analytics/StrategyAnalytics").then(m => ({ default: m.StrategyAnalytics })),
  { ssr: false }
)
import { StrategyGuideAndTutorial } from "@/components/copilot/strategy/StrategyGuideAndTutorial"

/* ═══════════════════════════════════════════════════════════════
   COPILOT STRATEGY CONSOLE

   A thin orchestration wrapper that:
   1. Presents a trader-profile carousel (ELITE / DISCIPLINED /
      DEVELOPING / STRUGGLING / RECKLESS) with left/right arrows,
      dot indicators, and a LIVE auto-play toggle.
   2. Generates profile-specific StrategyData for each profile.
   3. Renders the REAL StrategyAnalytics component (the exact same
      3 400-line component from the sidebar) with that data.

   Zero custom sub-components. The real thing, always.
   ═══════════════════════════════════════════════════════════════ */

/* ── Trader Profiles ── */

interface TraderProfile {
  id: string
  label: string
  grade: string
  color: string
  description: string
  // Data generation parameters
  limitPct: number    // % of entries that are limit orders
  stopPct: number     // % of entries that are stop orders
  scenarioCount: number
  forecastCount: number
  instrumentCount: number
  instrumentSpread: "concentrated" | "balanced" | "scattered"
}

const PROFILES: TraderProfile[] = [
  {
    id: "elite",
    label: "ELITE TRADER",
    grade: "A+",
    color: "#10b981",
    description: "Surgical precision. Every entry is pre-planned, every rule followed. This is what mastery looks like -- patience, discipline, zero impulsive behavior.",
    limitPct: 75,
    stopPct: 15,
    scenarioCount: 12,
    forecastCount: 8,
    instrumentCount: 5,
    instrumentSpread: "balanced",
  },
  {
    id: "disciplined",
    label: "DISCIPLINED TRADER",
    grade: "A",
    color: "#06b6d4",
    description: "Strong execution with minor lapses. Rules are respected 85%+ of the time. Occasional impulsive entries but quickly self-corrects.",
    limitPct: 60,
    stopPct: 20,
    scenarioCount: 9,
    forecastCount: 6,
    instrumentCount: 6,
    instrumentSpread: "balanced",
  },
  {
    id: "developing",
    label: "DEVELOPING TRADER",
    grade: "B",
    color: "#f59e0b",
    description: "Knows the rules but struggles to follow them under pressure. Alternates between disciplined streaks and reactive sessions. Needs structure.",
    limitPct: 40,
    stopPct: 20,
    scenarioCount: 6,
    forecastCount: 4,
    instrumentCount: 7,
    instrumentSpread: "scattered",
  },
  {
    id: "struggling",
    label: "STRUGGLING TRADER",
    grade: "C",
    color: "#f97316",
    description: "Reactive trading dominates. Rules exist on paper but are rarely followed in live conditions. Overtrading and poor timing are consistent patterns.",
    limitPct: 25,
    stopPct: 15,
    scenarioCount: 3,
    forecastCount: 2,
    instrumentCount: 9,
    instrumentSpread: "concentrated",
  },
  {
    id: "reckless",
    label: "RECKLESS TRADER",
    grade: "D",
    color: "#ef4444",
    description: "No system adherence. Market orders dominate, position sizing is random, no killzone awareness. Every session is a gamble disguised as trading.",
    limitPct: 10,
    stopPct: 10,
    scenarioCount: 1,
    forecastCount: 0,
    instrumentCount: 12,
    instrumentSpread: "concentrated",
  },
]

/* ── Profile-specific instrument universes ── */

const INSTRUMENT_SETS: Record<string, string[]> = {
  elite:       ["EURUSD", "GBPUSD", "USDJPY", "XAUUSD", "NAS100"],                    // focused forex + gold + index
  disciplined: ["EURUSD", "GBPUSD", "XAUUSD", "AUDUSD", "USDCAD", "EURJPY"],           // broader forex + gold
  developing:  ["BTCUSD", "ETHUSD", "SOLUSD", "XAUUSD", "EURUSD", "NAS100", "GBPUSD"], // crypto-heavy + mixed
  struggling:  ["NAS100", "SPX500", "AAPL", "TSLA", "MSFT", "AMZN", "NVDA", "XAUUSD", "BTCUSD"], // stocks + scattered
  reckless:    ["BTCUSD", "ETHUSD", "DOGEUSD", "SOLUSD", "XRPUSD", "NAS100", "XAUUSD", "EURUSD", "GBPUSD", "USDJPY", "GBPJPY", "EURJPY"], // everything
}

/* ── Profile-specific rule commitment sets ── */

const PROFILE_RULES: Record<string, RuleCommitment[]> = {
  elite: [
    { id: "e1", rule: "Only enter during killzones", category: "session", adherence: 97, violations: 0, streak: 28, bestStreak: 28, totalDaysTracked: 28, weeklyHistory: [1,1,1,1,1,1,1], teaching: "Killzones have highest institutional flow. You never violate this.", impactWhenFollowed: "Win rate 74% inside killzones.", impactWhenBroken: "N/A -- perfect adherence.", violationLog: [] },
    { id: "e2", rule: "Wait for HTF confluence before LTF entry", category: "entry", adherence: 95, violations: 1, streak: 14, bestStreak: 21, totalDaysTracked: 28, weeklyHistory: [1,1,1,1,1,1,0], lastViolation: "Feb 14", teaching: "H4/D1 structure provides directional bias.", impactWhenFollowed: "Trades with HTF alignment avg +2.1R.", impactWhenBroken: "Single miss on a Friday -- minor.", violationLog: [{ date: "Feb 14", context: "One LTF-only scalp on Friday close. Small loss, recognized immediately." }] },
    { id: "e3", rule: "Max 1% risk per trade", category: "risk", adherence: 100, violations: 0, streak: 28, bestStreak: 28, totalDaysTracked: 28, weeklyHistory: [1,1,1,1,1,1,1], teaching: "Risk control is non-negotiable.", impactWhenFollowed: "Max drawdown 2.1% over 28 days.", impactWhenBroken: "Never broken.", violationLog: [] },
    { id: "e4", rule: "No trading after a loss", category: "mindset", adherence: 92, violations: 1, streak: 12, bestStreak: 18, totalDaysTracked: 28, weeklyHistory: [1,1,1,1,1,0,1], lastViolation: "Feb 8", teaching: "Post-loss cortisol degrades decisions.", impactWhenFollowed: "Next-session win rate: 68%.", impactWhenBroken: "One instance, caught yourself within 2 mins.", violationLog: [{ date: "Feb 8", context: "Opened chart after a loss but closed it before executing. Self-corrected." }] },
    { id: "e5", rule: "Set SL before entry confirmation", category: "exit", adherence: 100, violations: 0, streak: 28, bestStreak: 28, totalDaysTracked: 28, weeklyHistory: [1,1,1,1,1,1,1], teaching: "Every trade has defined risk before entry.", impactWhenFollowed: "100% risk definition rate.", impactWhenBroken: "Never broken.", violationLog: [] },
    { id: "e6", rule: "Maximum 2 trades per session", category: "session", adherence: 94, violations: 1, streak: 9, bestStreak: 15, totalDaysTracked: 28, weeklyHistory: [1,1,1,1,0,1,1], lastViolation: "Feb 6", teaching: "Quality over quantity. 2 trades max preserves edge.", impactWhenFollowed: "Avg R on trade 1-2: +0.9R.", impactWhenBroken: "One 3-trade session, 3rd was breakeven.", violationLog: [{ date: "Feb 6", context: "Took a 3rd trade on strong momentum. Breakeven, no damage but unnecessary." }] },
  ],
  disciplined: [
    { id: "d1", rule: "Only enter during killzones", category: "session", adherence: 85, violations: 3, streak: 5, bestStreak: 12, totalDaysTracked: 28, weeklyHistory: [1,1,0,1,1,1,0], lastViolation: "Feb 12", teaching: "Killzones concentrate institutional activity.", impactWhenFollowed: "Win rate +14% in killzones.", impactWhenBroken: "3 off-session trades avg -0.6R.", violationLog: [{ date: "Feb 12", context: "Asian session entry on EURUSD. Stopped out." }, { date: "Feb 7", context: "Late NY entry. Choppy, breakeven." }, { date: "Feb 3", context: "Pre-London scalp, small loss." }] },
    { id: "d2", rule: "Wait for HTF confluence", category: "entry", adherence: 78, violations: 4, streak: 3, bestStreak: 10, totalDaysTracked: 28, weeklyHistory: [1,0,1,1,0,1,1], lastViolation: "Feb 10", teaching: "Without HTF alignment, LTF entries are gambling.", impactWhenFollowed: "Aligned trades avg +1.6R.", impactWhenBroken: "4 misaligned trades, net -2.1R.", violationLog: [{ date: "Feb 10", context: "M15 setup on XAUUSD without H4 check." }, { date: "Feb 8", context: "GBPUSD M5 entry, D1 opposing." }, { date: "Feb 5", context: "Quick M15 trade, no structure check." }, { date: "Feb 1", context: "NAS100 counter-trend." }] },
    { id: "d3", rule: "Max 1% risk per trade", category: "risk", adherence: 91, violations: 2, streak: 8, bestStreak: 16, totalDaysTracked: 28, weeklyHistory: [1,1,1,1,0,1,1], lastViolation: "Feb 6", teaching: "Consistent sizing prevents catastrophic drawdowns.", impactWhenFollowed: "Drawdown stays under 5%.", impactWhenBroken: "Two 1.5% trades caused 40% of monthly drawdown.", violationLog: [{ date: "Feb 6", context: "XAUUSD conviction trade at 1.5%." }, { date: "Feb 2", context: "EURUSD oversized on strong bias." }] },
    { id: "d4", rule: "No revenge trading", category: "mindset", adherence: 72, violations: 5, streak: 2, bestStreak: 7, totalDaysTracked: 28, weeklyHistory: [1,0,1,0,1,0,1], lastViolation: "Feb 13", teaching: "Post-loss trading is ego-driven.", impactWhenFollowed: "Recovery sessions avg +0.8R.", impactWhenBroken: "Revenge trades collectively -4.2R.", violationLog: [{ date: "Feb 13", context: "Re-entered GBPUSD 5min after loss." }, { date: "Feb 11", context: "3 trades after first loss." }, { date: "Feb 9", context: "Flipped direction after stop." }, { date: "Feb 5", context: "Doubled size after losing." }, { date: "Feb 2", context: "Immediate re-entry, same pair." }] },
    { id: "d5", rule: "Risk-to-reward minimum 1:2", category: "risk", adherence: 88, violations: 2, streak: 6, bestStreak: 11, totalDaysTracked: 28, weeklyHistory: [1,1,1,0,1,1,0], lastViolation: "Feb 8", teaching: "Below 1:2 you need 50%+ win rate to profit.", impactWhenFollowed: "Avg winner +1.9R.", impactWhenBroken: "Two 1:1 trades, both losers.", violationLog: [{ date: "Feb 8", context: "Tight TP on AUDUSD, 1:1.2 R:R." }, { date: "Feb 4", context: "Scalp on USDCAD, 1:0.8." }] },
  ],
  developing: [
    { id: "v1", rule: "Only enter during killzones", category: "session", adherence: 62, violations: 8, streak: 1, bestStreak: 5, totalDaysTracked: 28, weeklyHistory: [0,1,0,1,0,1,0], lastViolation: "Today", teaching: "Most of your losses come from off-session trades.", impactWhenFollowed: "Win rate doubles during killzones.", impactWhenBroken: "8 off-session trades avg -0.9R.", violationLog: [{ date: "Today", context: "BTC trade at 3am. Low liquidity sweep." }, { date: "Feb 13", context: "Asian session EURUSD." }, { date: "Feb 11", context: "Late night crypto trade." }, { date: "Feb 10", context: "Off-hours NAS100 scalp." }] },
    { id: "v2", rule: "Wait for HTF alignment", category: "entry", adherence: 55, violations: 9, streak: 0, bestStreak: 4, totalDaysTracked: 28, weeklyHistory: [0,1,0,0,1,0,1], lastViolation: "Today", teaching: "You know HTF matters but skip it under pressure.", impactWhenFollowed: "Aligned trades: +1.2R avg.", impactWhenBroken: "9 unaligned entries: -5.8R total.", violationLog: [{ date: "Today", context: "ETH M5 entry without checking D1." }, { date: "Feb 14", context: "SOL breakout trade, no structure." }, { date: "Feb 12", context: "Quick XAUUSD scalp, no HTF." }] },
    { id: "v3", rule: "Max 2% risk per trade", category: "risk", adherence: 71, violations: 5, streak: 2, bestStreak: 6, totalDaysTracked: 28, weeklyHistory: [1,0,1,0,1,0,1], lastViolation: "Feb 13", teaching: "You swing between 1% and 3% based on confidence.", impactWhenFollowed: "Controlled drawdown 4%.", impactWhenBroken: "5 oversized trades caused 65% of drawdown.", violationLog: [{ date: "Feb 13", context: "BTC trade at 3.5% size." }, { date: "Feb 10", context: "ETH conviction trade 2.8%." }, { date: "Feb 8", context: "XAUUSD 2.5% on revenge." }] },
    { id: "v4", rule: "Stop after 2 consecutive losses", category: "mindset", adherence: 48, violations: 10, streak: 0, bestStreak: 3, totalDaysTracked: 28, weeklyHistory: [0,0,1,0,0,1,0], lastViolation: "Today", teaching: "Your worst sessions always have 4+ trades.", impactWhenFollowed: "Daily loss stays under 2%.", impactWhenBroken: "10 instances of 3+ trade losing streaks.", violationLog: [{ date: "Today", context: "4 trades after 2 losses on BTC." }, { date: "Feb 14", context: "5 trades, last 3 losses." }, { date: "Feb 12", context: "Kept going after 2 stops." }] },
    { id: "v5", rule: "Journal every trade", category: "mindset", adherence: 45, violations: 12, streak: 0, bestStreak: 5, totalDaysTracked: 28, weeklyHistory: [0,1,0,0,0,1,0], lastViolation: "Today", teaching: "You only journal winning trades.", impactWhenFollowed: "Pattern recognition improves.", impactWhenBroken: "No data on 12 losing trades = no learning.", violationLog: [{ date: "Today", context: "Skipped journal on 3 trades." }, { date: "Feb 14", context: "Only logged winner." }] },
    { id: "v6", rule: "Maximum 4 trades per day", category: "session", adherence: 58, violations: 7, streak: 1, bestStreak: 4, totalDaysTracked: 28, weeklyHistory: [0,1,0,1,0,0,1], lastViolation: "Feb 14", teaching: "Overtrading is your biggest leak.", impactWhenFollowed: "Profitable days avg +1.4R.", impactWhenBroken: "7 overtrade days avg -2.1R.", violationLog: [{ date: "Feb 14", context: "6 trades on crypto, 4 losers." }, { date: "Feb 12", context: "5 trades across BTC/ETH." }] },
  ],
  struggling: [
    { id: "s1", rule: "Only trade during US session", category: "session", adherence: 42, violations: 14, streak: 0, bestStreak: 3, totalDaysTracked: 28, weeklyHistory: [0,0,1,0,0,0,1], lastViolation: "Today", teaching: "You trade 18 hours a day across all sessions.", impactWhenFollowed: "US session win rate: 45%.", impactWhenBroken: "Off-session trades: 22% win rate.", violationLog: [{ date: "Today", context: "AAPL pre-market trade, stopped out." }, { date: "Feb 14", context: "NAS100 during Asian overlap." }, { date: "Feb 13", context: "TSLA trade at 4am." }] },
    { id: "s2", rule: "No market orders", category: "entry", adherence: 28, violations: 18, streak: 0, bestStreak: 2, totalDaysTracked: 28, weeklyHistory: [0,0,0,1,0,0,0], lastViolation: "Today", teaching: "85% of your entries are market orders. You chase.", impactWhenFollowed: "Limit entries avg +0.4R.", impactWhenBroken: "Market order entries avg -0.7R.", violationLog: [{ date: "Today", context: "Market bought NAS100 on a spike." }, { date: "Feb 14", context: "Market order TSLA on news." }, { date: "Feb 13", context: "Chased AAPL breakout." }] },
    { id: "s3", rule: "Max 1% risk per trade", category: "risk", adherence: 38, violations: 15, streak: 0, bestStreak: 2, totalDaysTracked: 28, weeklyHistory: [0,0,1,0,0,0,0], lastViolation: "Today", teaching: "Average risk per trade is 3.2%. Some trades are 5%+.", impactWhenFollowed: "When at 1%, recoverable.", impactWhenBroken: "3 trades last week > 4% risk each.", violationLog: [{ date: "Today", context: "NVDA at 4% risk, stopped out." }, { date: "Feb 14", context: "SPX500 at 3.5% size." }, { date: "Feb 13", context: "BTCUSD 5% conviction play." }] },
    { id: "s4", rule: "No revenge trading", category: "mindset", adherence: 22, violations: 20, streak: 0, bestStreak: 1, totalDaysTracked: 28, weeklyHistory: [0,0,0,0,0,0,1], lastViolation: "Today", teaching: "You trade MORE when losing. This is your #1 leak.", impactWhenFollowed: "Rare adherence shows +0.3R recovery.", impactWhenBroken: "Revenge trades: -12.6R total this month.", violationLog: [{ date: "Today", context: "5 revenge trades on NAS100." }, { date: "Feb 14", context: "4 trades in 20 minutes." }, { date: "Feb 13", context: "Doubled size after loss." }] },
    { id: "s5", rule: "Daily loss limit 3%", category: "risk", adherence: 35, violations: 12, streak: 0, bestStreak: 3, totalDaysTracked: 28, weeklyHistory: [0,0,0,1,0,0,0], lastViolation: "Today", teaching: "You have hit -5%+ on 8 separate days.", impactWhenFollowed: "Capped days save account.", impactWhenBroken: "12 days exceeded 3%, 4 exceeded 5%.", violationLog: [{ date: "Today", context: "-4.8% day on mixed stock trades." }, { date: "Feb 14", context: "-6.1% on NAS100 overtrading." }] },
  ],
  reckless: [
    { id: "x1", rule: "Have a trade plan before entering", category: "entry", adherence: 12, violations: 24, streak: 0, bestStreak: 1, totalDaysTracked: 28, weeklyHistory: [0,0,0,0,0,0,0], lastViolation: "Today", teaching: "You enter based on impulse, not analysis.", impactWhenFollowed: "Rare planned trades: +0.8R avg.", impactWhenBroken: "24 unplanned entries, net -18R.", violationLog: [{ date: "Today", context: "Opened 4 positions simultaneously with no SL." }, { date: "Feb 14", context: "Market order on DOGEUSD pump." }, { date: "Feb 13", context: "Random BTC short at 3am." }] },
    { id: "x2", rule: "Always use a stop loss", category: "exit", adherence: 18, violations: 22, streak: 0, bestStreak: 1, totalDaysTracked: 28, weeklyHistory: [0,0,0,0,0,0,0], lastViolation: "Today", teaching: "You manually close when the pain is too much. That IS your stop loss.", impactWhenFollowed: "Rare SL trades: loss capped at planned level.", impactWhenBroken: "Average loss without SL: -3.4R.", violationLog: [{ date: "Today", context: "Held BTCUSD short without SL. -4.2R." }, { date: "Feb 14", context: "ETHUSD no SL, -2.8R." }, { date: "Feb 13", context: "DOGEUSD, rode it down -5R." }] },
    { id: "x3", rule: "Max 2% risk per trade", category: "risk", adherence: 8, violations: 25, streak: 0, bestStreak: 0, totalDaysTracked: 28, weeklyHistory: [0,0,0,0,0,0,0], lastViolation: "Today", teaching: "Your average position size is 8% of account.", impactWhenFollowed: "Never consistently followed.", impactWhenBroken: "Average risk 8%. Max single trade risk: 15%.", violationLog: [{ date: "Today", context: "BTCUSD at 12% account risk." }, { date: "Feb 14", context: "NAS100 at 10% risk on news." }] },
    { id: "x4", rule: "Maximum 3 trades per day", category: "session", adherence: 5, violations: 26, streak: 0, bestStreak: 0, totalDaysTracked: 28, weeklyHistory: [0,0,0,0,0,0,0], lastViolation: "Today", teaching: "Average: 11 trades per day. Record: 23.", impactWhenFollowed: "Never followed.", impactWhenBroken: "Overtrading costs -6R/week in commissions alone.", violationLog: [{ date: "Today", context: "14 trades today across 8 instruments." }, { date: "Feb 14", context: "19 trades, 15 losers." }] },
    { id: "x5", rule: "No trading on tilt", category: "mindset", adherence: 3, violations: 27, streak: 0, bestStreak: 0, totalDaysTracked: 28, weeklyHistory: [0,0,0,0,0,0,0], lastViolation: "Today", teaching: "Every session becomes a tilt session after trade 3.", impactWhenFollowed: "Never meaningfully followed.", impactWhenBroken: "Tilt trading is 90% of your activity.", violationLog: [{ date: "Today", context: "10 consecutive revenge trades." }, { date: "Feb 14", context: "Threw phone after loss, came back and traded more." }] },
  ],
}

/* ── Deterministic data generator ── */

function generateStrategyData(profile: TraderProfile) {
  const seed = profile.id.charCodeAt(0) + profile.id.charCodeAt(1)
  const instruments = INSTRUMENT_SETS[profile.id] ?? INSTRUMENT_SETS.elite

  const limitVal = Math.round(profile.limitPct * 0.6 + (seed % 10))
  const stopVal = Math.round(profile.stopPct * 0.4 + (seed % 5))
  const marketVal = Math.max(5, 100 - limitVal - stopVal)

  // Build instrument list with profile-specific concentration
  const instrumentData: { symbol: string; count: number }[] = []
  for (let i = 0; i < instruments.length; i++) {
    let count: number
    if (profile.instrumentSpread === "concentrated") {
      count = i === 0 ? 38 + (seed % 8) : Math.max(2, 14 - i * 3 + (seed % 3))
    } else if (profile.instrumentSpread === "balanced") {
      count = Math.max(5, 22 - i * 3 + ((seed + i) % 5))
    } else {
      count = Math.max(3, 14 + ((seed * (i + 1)) % 7) - i)
    }
    instrumentData.push({ symbol: instruments[i], count })
  }

  // Profile-specific timeframe focus
  const timeframes = profile.id === "elite"
    ? [{ label: "H1", value: 28 }, { label: "H4", value: 22 }, { label: "D1", value: 15 }, { label: "M15", value: 8 }]
    : profile.id === "disciplined"
    ? [{ label: "M15", value: 22 }, { label: "H1", value: 20 }, { label: "H4", value: 14 }, { label: "D1", value: 8 }]
    : profile.id === "developing"
    ? [{ label: "M5", value: 25 }, { label: "M15", value: 18 }, { label: "H1", value: 10 }, { label: "H4", value: 5 }]
    : profile.id === "struggling"
    ? [{ label: "M1", value: 30 }, { label: "M5", value: 22 }, { label: "M15", value: 10 }, { label: "H1", value: 3 }]
    : [{ label: "M1", value: 40 }, { label: "M5", value: 28 }, { label: "M15", value: 5 }, { label: "H1", value: 1 }]

  // Profile-specific execution models
  const topModels = profile.id === "elite"
    ? [{ label: "Liquidity Sweep", value: 18 }, { label: "FVG + OB", value: 14 }, { label: "SMT Divergence", value: 10 }, { label: "Breaker Block", value: 6 }]
    : profile.id === "disciplined"
    ? [{ label: "FVG + OB", value: 16 }, { label: "Break/Retest", value: 12 }, { label: "Liquidity Sweep", value: 9 }, { label: "Order Block", value: 7 }]
    : profile.id === "developing"
    ? [{ label: "Break/Retest", value: 14 }, { label: "Trendline Bounce", value: 11 }, { label: "FVG Entry", value: 8 }, { label: "Support/Resist", value: 6 }]
    : profile.id === "struggling"
    ? [{ label: "Breakout Chase", value: 18 }, { label: "News Reaction", value: 12 }, { label: "Random Scalp", value: 9 }, { label: "FOMO Entry", value: 7 }]
    : [{ label: "Market Order Spam", value: 22 }, { label: "Revenge Entry", value: 16 }, { label: "News Gamble", value: 12 }, { label: "Random Click", value: 8 }]

  const openForecasts: { id: string; instrument: string; status: "draft" | "published"; createdAt: number }[] = []
  for (let i = 0; i < profile.forecastCount; i++) {
    openForecasts.push({
      id: `fc-${profile.id}-${i}`,
      instrument: instruments[i % instruments.length],
      status: i < profile.forecastCount / 2 ? "published" : "draft",
      createdAt: Date.now() - i * 3600000,
    })
  }

  return {
    counts: {
      scenariosOpen: profile.scenarioCount,
      forecastsOpen: profile.forecastCount,
      instrumentsActive: instruments.length,
    },
    entryMix: [
      { label: "limit" as const, value: limitVal },
      { label: "market" as const, value: marketVal },
      { label: "stop" as const, value: stopVal },
    ],
    timeframes,
    topModels,
    instruments: instrumentData,
    openForecasts,
  }
}

/* ── Get profile rules ── */
function getProfileRules(profileId: string) {
  return PROFILE_RULES[profileId] ?? PROFILE_RULES.elite
}

/* ═══════════════════════════════════════════════════════════════
   MAIN CONSOLE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export function CopilotStrategyConsole() {
  const [profileIdx, setProfileIdx] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)
  const autoPlayRef = useRef(autoPlay)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { autoPlayRef.current = autoPlay }, [autoPlay])

  const profile = PROFILES[profileIdx]

  // Generate deterministic data + rules for current profile
  const strategyData = useMemo(() => generateStrategyData(profile), [profile])
  const profileRules = useMemo(() => getProfileRules(profile.id), [profile.id])

  // Navigation
  const goToProfile = useCallback((idx: number) => {
    setProfileIdx(((idx % PROFILES.length) + PROFILES.length) % PROFILES.length)
  }, [])

  // Auto-play
  useEffect(() => {
    if (autoPlay) {
      intervalRef.current = setInterval(() => {
        setProfileIdx(prev => (prev + 1) % PROFILES.length)
      }, 5000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [autoPlay])

  return (
    <div className="relative flex flex-col h-full bg-transparent">

      {/* ═══ SCROLLABLE CONTENT ═══ */}
      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-terminal">

      {/* ── Strategy Tutorial & Guide (buttons inline, overlay absolute inset-0 on outer relative) ── */}
      <StrategyGuideAndTutorial
        onStartDemo={() => {
          setAutoPlay(true)
        }}
      />

      {/* ── Profile Navigation Bar ── */}
      <div className="sticky top-0 z-20 px-3 pt-3 pb-2"
        style={{ background: "linear-gradient(180deg, rgba(12,14,22,0.98) 0%, rgba(12,14,22,0.92) 80%, transparent 100%)" }}>

        {/* Nav row: arrows + dots + LIVE */}
        <div className="flex items-center gap-1">
          {/* Left arrow */}
          <button
            onClick={() => { setAutoPlay(false); goToProfile(profileIdx - 1) }}
            className="w-6 h-6 flex items-center justify-center text-white/15 hover:text-white/40 transition-colors shrink-0"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Profile dots */}
          <div className="flex-1 flex items-center justify-center gap-1.5">
            {PROFILES.map((p, i) => {
              const isActive = i === profileIdx
              return (
                <button
                  key={p.id}
                  onClick={() => { setAutoPlay(false); goToProfile(i) }}
                  className="group flex flex-col items-center gap-1 shrink-0 py-1 px-1"
                >
                  <div
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: isActive ? 20 : 6,
                      height: 6,
                      backgroundColor: isActive ? p.color : `${p.color}25`,
                      boxShadow: isActive ? `0 0 10px ${p.color}40` : "none",
                    }}
                  />
                  <span
                    className="text-[6px] font-mono font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap"
                    style={{
                      color: isActive ? p.color : "rgba(255,255,255,0.12)",
                      opacity: isActive ? 1 : 0.8,
                    }}
                  >
                    {isActive ? p.label : ""}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => { setAutoPlay(false); goToProfile(profileIdx + 1) }}
            className="w-6 h-6 flex items-center justify-center text-white/15 hover:text-white/40 transition-colors shrink-0"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Auto-play toggle */}
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`ml-1 flex items-center gap-1 px-2 py-1 rounded-md border text-[7px] font-mono font-black uppercase tracking-wider transition-all shrink-0 ${
              autoPlay
                ? "border-amber-400/25 bg-amber-400/[0.06] text-amber-400/70"
                : "border-white/[0.04] bg-white/[0.01] text-white/20 hover:border-white/[0.08] hover:text-white/35"
            }`}
          >
            {autoPlay ? (
              <motion.div className="w-1.5 h-1.5 rounded-full bg-amber-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }} />
            ) : (
              <Activity className="w-2.5 h-2.5" />
            )}
            {autoPlay ? "LIVE" : "DEMO"}
          </button>
        </div>

        {/* Profile identity bar */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2.5">
            {/* Pulse */}
            <div className="relative">
              <motion.div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: profile.color }}
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <motion.div className="absolute inset-0 w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: profile.color }}
                animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>

            {/* Grade badge */}
            <motion.span className="text-[11px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
              style={{
                backgroundColor: `${profile.color}10`,
                color: `${profile.color}90`,
                border: `1px solid ${profile.color}20`,
              }}
              animate={{ borderColor: [`${profile.color}20`, `${profile.color}45`, `${profile.color}20`] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {profile.grade}
            </motion.span>

            {/* Profile name */}
            <span className="text-[12px] font-mono font-black uppercase tracking-wider"
              style={{ color: profile.color }}>
              {profile.label}
            </span>
          </div>

          {/* Profile index */}
          <span className="text-[8px] font-mono text-white/15 tabular-nums">
            {profileIdx + 1} / {PROFILES.length}
          </span>
        </div>

        {/* Profile description */}
        <p className="text-[9px] font-mono text-white/25 leading-relaxed mt-1.5 max-w-[500px]">
          {profile.description}
        </p>
      </div>

      {/* ── The REAL StrategyAnalytics Component ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={profile.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <StrategyAnalytics data={strategyData} profileRules={profileRules} />
        </motion.div>
      </AnimatePresence>

      </div>{/* end scrollable */}
    </div>
  )
}
