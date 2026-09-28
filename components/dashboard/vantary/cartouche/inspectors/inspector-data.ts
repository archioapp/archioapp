"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · FLIGHT DECK · INSPECTOR DATA
   ───────────────────────────────────────────────────────────────────────────
   Derives the richer shapes the Inspector bodies need from the canonical
   dashboard-data constants. Kept separate so the bodies stay declarative and
   so this single file is the one place to swap mock → Supabase later.

   Everything here is pure + synchronous (mock data). No hooks.
   ═══════════════════════════════════════════════════════════════════════════ */

import {
  ACCOUNTS, PERFORMANCE, PSYCHOLOGY, DAILY_PLAN, AI_CHECKIN,
  PERSONAL_GOALS, RECENT_TRADES, STRATEGIES,
  ACCURACY_TREND_30D, EQUITY_DAILY_14D, LAST_10_CALLS,
  EVENTS_TODAY, TODAY_PNL_SPARKLINE_24H, ACCOUNT_SPARKLINES,
} from "@/components/dashboard/dashboard-data"

/* Re-export the raw constants so inspector bodies import from one place. */
export {
  ACCOUNTS, PERFORMANCE, PSYCHOLOGY, DAILY_PLAN, AI_CHECKIN,
  PERSONAL_GOALS, RECENT_TRADES, STRATEGIES,
  ACCURACY_TREND_30D, EQUITY_DAILY_14D, LAST_10_CALLS,
  EVENTS_TODAY, TODAY_PNL_SPARKLINE_24H, ACCOUNT_SPARKLINES,
}

/* ── Derived: live (non-demo) accounts + totals ─────────────────────────── */
export const LIVE_ACCOUNTS = ACCOUNTS.filter((a) => a.type !== "demo")
export const TOTAL_EQUITY = LIVE_ACCOUNTS.reduce((s, a) => s + a.equity, 0)
export const TOTAL_BALANCE = LIVE_ACCOUNTS.reduce((s, a) => s + a.balance, 0)
export const TOTAL_FLOATING = LIVE_ACCOUNTS.reduce((s, a) => s + a.floatingPnl, 0)

/* ── Derived: the FTMO evaluation account (firm identity / risk envelope) ── */
export const PROP_ACCOUNT = ACCOUNTS.find((a) => a.propFirm) ?? ACCOUNTS[1]!
export const PROP = PROP_ACCOUNT.propFirm!

/* ── Equity curve (synthesized 30-pt curve ending at TOTAL_EQUITY) ──────── */
export const EQUITY_CURVE_30D: number[] = (() => {
  const end = TOTAL_EQUITY
  const start = end * 0.86
  const pts: number[] = []
  for (let i = 0; i < 30; i++) {
    const base = start + ((end - start) * i) / 29
    // gentle deterministic wobble so it reads organic but stable across renders
    const wobble = Math.sin(i * 1.7) * (end * 0.012) + Math.cos(i * 0.6) * (end * 0.008)
    pts.push(Math.round(base + wobble))
  }
  pts[pts.length - 1] = Math.round(end)
  return pts
})()

/* ── Win / loss tally derived from win rate + total trades ──────────────── */
export const WINS = Math.round((PERFORMANCE.winRate / 100) * PERFORMANCE.totalTrades)
export const LOSSES = PERFORMANCE.totalTrades - WINS

/* ── Expectancy (R) = winRate*avgWin - lossRate*avgLoss ─────────────────── */
export const EXPECTANCY_R = (() => {
  const w = PERFORMANCE.winRate / 100
  const l = 1 - w
  const avgWin = PERFORMANCE.averageRR // R won per winning trade (approx)
  const avgLoss = 1 // assume -1R per loss
  return +(w * avgWin - l * avgLoss).toFixed(2)
})()

/* ── Pair leaderboard (synthesized from best/worst + plausible mid pairs) ── */
export interface PairStat {
  pair: string
  winRate: number
  netR: number
  trades: number
  bias: "long" | "short" | "balanced"
}
export const PAIR_LEADERBOARD: PairStat[] = [
  { pair: "EUR/USD", winRate: PERFORMANCE.bestPair.winRate, netR: 14.8, trades: 41, bias: "long" },
  { pair: "XAU/USD", winRate: 69, netR: 11.2, trades: 33, bias: "long" },
  { pair: "USD/JPY", winRate: 61, netR: 6.4, trades: 27, bias: "short" },
  { pair: "GBP/USD", winRate: 57, netR: 3.1, trades: 24, bias: "balanced" },
  { pair: "AUD/USD", winRate: 52, netR: 1.2, trades: 18, bias: "long" },
  { pair: PERFORMANCE.worstPair.name, winRate: PERFORMANCE.worstPair.winRate, netR: -4.6, trades: 14, bias: "short" },
]

/* ── Session ribbon (FX sessions in UTC hours) ──────────────────────────── */
export interface SessionInfo {
  name: string
  startHour: number
  endHour: number
  winRate: number
  killzone: string
}
export const SESSIONS: SessionInfo[] = [
  { name: "Sydney", startHour: 21, endHour: 6, winRate: 51, killzone: "21:00–22:00" },
  { name: "Tokyo", startHour: 0, endHour: 9, winRate: 58, killzone: "00:00–01:00" },
  { name: "London", startHour: 7, endHour: 16, winRate: PERFORMANCE.bestSession.winRate, killzone: "07:00–10:00" },
  { name: "New York", startHour: 12, endHour: 21, winRate: 63, killzone: "12:30–15:00" },
]

/* ── 12-day discipline adherence strip (1 = perfect, 0 = breach) ────────── */
export const DISCIPLINE_12D: number[] = [
  0.9, 1, 0.8, 1, 0.6, 1, 1, 0.7, 1, 0.9, 1, 0.85,
]

/* ── Behavioral ledger entries (discipline inspector) ───────────────────── */
export interface BehaviorEntry {
  label: string
  status: "good" | "watch" | "breach"
  detail: string
}
export const BEHAVIOR_LEDGER: BehaviorEntry[] = [
  { label: "Plan adherence", status: "good", detail: "Followed daily plan 11 of last 12 sessions" },
  { label: "Revenge trading", status: "good", detail: "Zero revenge entries this week" },
  { label: "Overtrading", status: "watch", detail: "Exceeded trade cap once in last 12 sessions" },
  { label: "Cut winners early", status: "watch", detail: "3 trades closed below 1.5R target" },
  { label: "Pre-market prep", status: "good", detail: "Completed prep on 9 of 12 sessions" },
]

/* ── Helpers ────────────────────────────────────────────────────────────── */
export const fmtUsd = (n: number, decimals = 0) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`

export const fmtSignedUsd = (n: number) =>
  `${n >= 0 ? "+" : "−"}$${Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`

export const fmtPct = (n: number, decimals = 1) => `${n.toFixed(decimals)}%`

/** Current UTC hour as a fractional number (for the session clock now-marker). */
export function nowUtcHour(): number {
  const d = new Date()
  return d.getUTCHours() + d.getUTCMinutes() / 60
}
