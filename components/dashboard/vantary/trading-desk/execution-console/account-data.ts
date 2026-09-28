/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION CONSOLE · ACCOUNT + RISK MODEL  (Phase 2)
 *  ─────────────────────────────────────────────────────────────────────────
 *  The single source of truth for the Account & Risk-First Sizing station.
 *
 *  This file is PURE DATA + PURE DERIVATION — no React, no DOM, tree-shakable.
 *  Everything the station renders (health, risk budget, guardrails, readiness,
 *  the console mode itself) is *derived* from a small set of honest account
 *  fields here, so the cockpit can never show a number that contradicts
 *  another number.
 *
 *  Design law (blueprint §2): RISK IS THE PROTAGONIST. The trader does not
 *  think "lot size" first — they think "how much am I willing to lose."
 *  So the model is built around a RISK BUDGET (daily loss limit, used,
 *  remaining) and a PER-TRADE RISK (percent → amount), and lot size is a
 *  downstream consequence (computed in a later phase).
 *
 *  Phase 2 rule: SIMULATION + DISCONNECTED are fully real here. LIVE is
 *  modelled but LOCKED — we never submit, never call TradeLocker. The shapes
 *  below are intentionally TradeLocker-friendly so Phase 5 can swap the mock
 *  loader for a real one with zero downstream change.
 * ═══════════════════════════════════════════════════════════════════════ */

import type { ConsoleMode } from "./console-theme"

/* ─── Account kinds ────────────────────────────────────────────────────── */
export type AccountKind = "simulation" | "prop" | "live"
export type ConnectionStatus = "connected" | "syncing" | "disconnected"

export interface ConsoleAccount {
  id:        string
  /** Human nickname the trader gave it. */
  nickname:  string
  /** Broker / platform name. */
  broker:    string
  /** Masked account number tail, e.g. "••4821". */
  mask:      string
  kind:      AccountKind
  status:    ConnectionStatus
  currency:  string

  /* — Capital — */
  balance:        number
  equity:         number
  availableMargin: number
  /** Margin currently tied up in open positions. */
  usedMargin:     number
  leverage:       string

  /* — Risk governance (the protagonist) — */
  /** Hard daily loss limit in account currency (prop rule or self-imposed). */
  dailyLossLimit: number
  /** Loss already taken today (positive number = amount lost). */
  dailyLossUsed:  number
  /** Max number of trades allowed today (0 = uncapped). */
  tradeCap:       number
  tradesUsed:     number
  /** Ceiling on risk per single trade, as % of equity. */
  maxRiskPctPerTrade: number

  /* — Connection meta — */
  /** Whether LIVE order submission is permitted for this account. Phase 2
   *  keeps every live account FALSE — the rail is built, the door is locked. */
  liveEnabled:   boolean
  /** ms epoch of last sync, or null when never synced. */
  lastSyncedAt:  number | null
  /** A normalised 0..1 equity micro-spark (most recent N ticks). */
  spark:         number[]
}

/* ─── Deterministic spark generator (no Math.random → SSR-stable) ──────── */
function buildSpark(seed: number, bias: number): number[] {
  const out: number[] = []
  let v = 0.5
  for (let i = 0; i < 48; i++) {
    const wave  = Math.sin((i + seed) * 0.5) * 0.05
    const drift = (i / 48) * bias
    const noise = (((i * 9301 + seed * 49297) % 233) / 233 - 0.5) * 0.045
    v = 0.5 + wave + drift + noise
    out.push(Math.max(0.06, Math.min(0.94, v)))
  }
  return out
}

/* A fixed "now" reference keeps lastSynced labels deterministic across SSR
 * and first client paint (avoids hydration text mismatch). The live ticker
 * elsewhere on the page owns real wall-clock; this station speaks in
 * relative, stable phrases seeded from these offsets. */
export const SYNC_OFFSETS_MS = {
  fresh:  9_000,
  recent: 47_000,
  stale:  18 * 60_000,
} as const

/* ─── The Phase-2 account roster (simulation-first, live modelled+locked) ─ */
export const CONSOLE_ACCOUNT_ROSTER: ReadonlyArray<ConsoleAccount> = [
  {
    id: "sim-practice",
    nickname: "Practice Desk",
    broker:   "ARCHIO SIM",
    mask:     "••SIM1",
    kind:     "simulation",
    status:   "connected",
    currency: "USD",
    balance:        100_000,
    equity:         100_240,
    availableMargin: 98_910,
    usedMargin:     1_330,
    leverage:       "1:100",
    dailyLossLimit: 5_000,
    dailyLossUsed:  640,
    tradeCap:       0,
    tradesUsed:     2,
    maxRiskPctPerTrade: 2,
    liveEnabled:   false,
    lastSyncedAt:  SYNC_OFFSETS_MS.fresh,
    spark:         buildSpark(7, 0.14),
  },
  {
    id: "ftmo-100k",
    nickname: "FTMO Challenge",
    broker:   "TRADELOCKER",
    mask:     "••4821",
    kind:     "prop",
    status:   "connected",
    currency: "USD",
    balance:        102_480,
    equity:         102_180,
    availableMargin: 96_540,
    usedMargin:     5_640,
    leverage:       "1:100",
    dailyLossLimit: 5_000,
    dailyLossUsed:  3_180,
    tradeCap:       5,
    tradesUsed:     3,
    maxRiskPctPerTrade: 1,
    liveEnabled:   false,
    lastSyncedAt:  SYNC_OFFSETS_MS.recent,
    spark:         buildSpark(11, 0.03),
  },
  {
    id: "ic-live",
    nickname: "IC Markets Live",
    broker:   "TRADELOCKER",
    mask:     "••1105",
    kind:     "live",
    status:   "connected",
    currency: "USD",
    balance:        25_340,
    equity:         25_010,
    availableMargin: 22_870,
    usedMargin:     2_140,
    leverage:       "1:500",
    dailyLossLimit: 1_250,
    dailyLossUsed:  1_090,
    tradeCap:       0,
    tradesUsed:     6,
    maxRiskPctPerTrade: 1.5,
    liveEnabled:   false,
    lastSyncedAt:  SYNC_OFFSETS_MS.stale,
    spark:         buildSpark(19, -0.12),
  },
]

/* ─── DERIVATION ───────────────────────────────────────────────────────── */

/** Console mode implied by an account + its connection. Disconnected when no
 *  account; simulation for sim; live-locked for any live/prop account because
 *  Phase 2 never enables live submission. (Blocked is layered on top by the
 *  guardrail engine when a hard rule is violated.) */
export function modeForAccount(acc: ConsoleAccount | null): ConsoleMode {
  if (!acc || acc.status === "disconnected") return "disconnected"
  if (acc.kind === "simulation") return "simulation"
  // prop + live both reach for real-money rules → locked until liveEnabled.
  return acc.liveEnabled ? "live-ready" : "live-locked"
}

/* — Risk budget — the heart of the station — */
export interface RiskBudget {
  limit:        number   // daily loss limit
  used:         number   // lost today
  remaining:    number   // limit - used (never < 0)
  usedPct:      number    // 0..1 of the limit consumed
  remainingPct: number    // 0..1 of the limit still available
  /** Risk allowed on the NEXT trade = min(maxPerTrade$, remaining). */
  perTradeCeiling: number
  /** maxRiskPctPerTrade expressed as a currency amount of equity. */
  perTradeAmount:  number
  perTradePct:     number
  /** trade-cap remaining (Infinity when uncapped). */
  tradesLeft:   number
  tradeCap:     number
}

export function deriveRiskBudget(acc: ConsoleAccount): RiskBudget {
  const limit     = acc.dailyLossLimit
  const used      = Math.max(0, acc.dailyLossUsed)
  const remaining = Math.max(0, limit - used)
  const usedPct   = limit > 0 ? Math.min(1, used / limit) : 0

  const perTradeAmount = (acc.maxRiskPctPerTrade / 100) * acc.equity
  const perTradeCeiling = Math.min(perTradeAmount, remaining)

  const tradesLeft = acc.tradeCap > 0
    ? Math.max(0, acc.tradeCap - acc.tradesUsed)
    : Infinity

  return {
    limit,
    used,
    remaining,
    usedPct,
    remainingPct: 1 - usedPct,
    perTradeCeiling,
    perTradeAmount,
    perTradePct: acc.maxRiskPctPerTrade,
    tradesLeft,
    tradeCap: acc.tradeCap,
  }
}

/* — Account health — a 0..100 composite the dial renders — */
export type HealthTier = "strong" | "steady" | "caution" | "critical"

export interface AccountHealth {
  score: number          // 0..100
  tier:  HealthTier
  label: string
  /** equity vs balance drift, signed fraction (e.g. -0.003 = -0.3%). */
  equityDrift: number
  /** margin utilisation 0..1. */
  marginUse: number
}

export function deriveHealth(acc: ConsoleAccount, budget: RiskBudget): AccountHealth {
  // Health blends three honest signals:
  //  · how much daily risk budget remains (most weight — risk-first)
  //  · margin headroom (over-leverage erodes health)
  //  · equity vs balance (floating drawdown bleeds health)
  const budgetScore = budget.remainingPct                              // 0..1
  const marginUse   = acc.equity > 0
    ? Math.min(1, acc.usedMargin / acc.equity)
    : 0
  const marginScore = 1 - marginUse                                    // 0..1
  const equityDrift = acc.balance > 0
    ? (acc.equity - acc.balance) / acc.balance
    : 0
  const driftScore  = Math.max(0, Math.min(1, 0.5 + equityDrift * 12)) // centred

  const score = Math.round(
    (budgetScore * 0.55 + marginScore * 0.25 + driftScore * 0.20) * 100,
  )

  let tier: HealthTier
  let label: string
  if (score >= 80)      { tier = "strong";   label = "Strong" }
  else if (score >= 60) { tier = "steady";   label = "Steady" }
  else if (score >= 38) { tier = "caution";  label = "Caution" }
  else                  { tier = "critical"; label = "Critical" }

  return { score, tier, label, equityDrift, marginUse }
}

/* — Guardrails — the readiness checklist — */
export type GuardrailStatus = "pass" | "warn" | "fail" | "pending" | "locked"

export interface Guardrail {
  id:      string
  label:   string
  /** short human verdict shown on the right. */
  detail:  string
  status:  GuardrailStatus
  /** future-phase items render as a deliberate, dimmed "later" seat. */
  future?: boolean
}

/** The full guardrail set. Some are live (account/risk/trade-cap), some are
 *  intentional future seats (SL-required, news-window) so the checklist reads
 *  complete and teaches the trader the whole pre-flight, not a half-built one. */
export function deriveGuardrails(
  acc: ConsoleAccount | null,
  budget: RiskBudget | null,
): Guardrail[] {
  if (!acc || !budget) {
    return [
      { id: "account", label: "Account selected",      detail: "None",            status: "fail" },
      { id: "symbol",  label: "Symbol available",       detail: "—",               status: "pending" },
      { id: "market",  label: "Market open",            detail: "—",               status: "pending" },
      { id: "risk",    label: "Risk within limit",      detail: "—",               status: "pending" },
      { id: "cap",     label: "Trade cap available",    detail: "—",               status: "pending" },
      { id: "sl",      label: "Stop-loss before live",  detail: "Later",           status: "locked", future: true },
      { id: "news",    label: "News window clear",      detail: "Later",           status: "locked", future: true },
      { id: "mode",    label: "Execution mode",         detail: "Disconnected",    status: "fail" },
    ]
  }

  const live = acc.kind !== "simulation"
  const riskOk   = budget.remaining > 0
  const riskWarn = budget.usedPct >= 0.7 && budget.remaining > 0
  const capOk    = budget.tradesLeft > 0
  const capWarn  = Number.isFinite(budget.tradesLeft) && budget.tradesLeft <= 1 && capOk

  return [
    {
      id: "account", label: "Account selected",
      detail: `${acc.nickname}`, status: "pass",
    },
    {
      id: "symbol", label: "Symbol available",
      detail: "EUR/USD", status: "pass",
    },
    {
      id: "market", label: "Market open",
      detail: "London · open", status: "pass",
    },
    {
      id: "risk", label: "Risk within limit",
      detail: riskOk
        ? `${Math.round(budget.remainingPct * 100)}% budget left`
        : "Daily limit reached",
      status: !riskOk ? "fail" : riskWarn ? "warn" : "pass",
    },
    {
      id: "cap", label: "Trade cap available",
      detail: budget.tradeCap === 0
        ? "Uncapped"
        : `${budget.tradesLeft} of ${budget.tradeCap} left`,
      status: !capOk ? "fail" : capWarn ? "warn" : "pass",
    },
    {
      id: "sl", label: "Stop-loss before live",
      detail: live ? "Required" : "Optional in sim",
      status: "locked", future: true,
    },
    {
      id: "news", label: "News window clear",
      detail: "Later", status: "locked", future: true,
    },
    {
      id: "mode", label: "Execution mode",
      detail: acc.kind === "simulation"
        ? "Simulation"
        : acc.liveEnabled ? "Live · armed" : "Live · locked",
      status: acc.kind === "simulation" ? "pass" : "warn",
    },
  ]
}

/* — Readiness — the single verdict the readiness rail renders — */
export type ReadinessState = "ready" | "sim-ready" | "blocked" | "locked" | "idle"

export interface Readiness {
  state:   ReadinessState
  /** Big human line — the one sentence the trader reads. */
  headline: string
  /** Supporting clause — what to do / why. */
  detail:   string
  /** count of hard failures driving a block. */
  failures: number
}

export function deriveReadiness(
  acc: ConsoleAccount | null,
  budget: RiskBudget | null,
  guardrails: Guardrail[],
): Readiness {
  if (!acc || !budget) {
    return {
      state: "idle",
      headline: "Connect an account to begin",
      detail: "Choose a simulation or broker account to open the cockpit.",
      failures: 0,
    }
  }

  const failures = guardrails.filter(g => g.status === "fail").length

  if (failures > 0) {
    const first = guardrails.find(g => g.status === "fail")
    return {
      state: "blocked",
      headline: "Execution blocked",
      detail: first ? `Resolve: ${first.label.toLowerCase()}.` : "Resolve the failing guardrail.",
      failures,
    }
  }

  if (acc.kind === "simulation") {
    return {
      state: "sim-ready",
      headline: "Simulation ready",
      detail: "Practice freely — no real capital is at risk.",
      failures: 0,
    }
  }

  // Live / prop account, no hard failures, but live submission is locked.
  if (!acc.liveEnabled) {
    return {
      state: "locked",
      headline: "Live execution locked",
      detail: "Unlock live arming in the crown to enable real orders.",
      failures: 0,
    }
  }

  return {
    state: "ready",
    headline: "Cleared for execution",
    detail: "All guardrails pass — hold to execute when ready.",
    failures: 0,
  }
}

/* ─── Formatting helpers (shared by the station's instruments) ─────────── */
export function fmtMoney(n: number, currency = "USD"): string {
  const sym = currency === "USD" ? "$" : ""
  return `${sym}${Math.round(n).toLocaleString("en-US")}`
}

export function fmtMoneyPrecise(n: number, currency = "USD"): string {
  const sym = currency === "USD" ? "$" : ""
  return `${sym}${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function fmtSyncLabel(offsetMs: number | null): string {
  if (offsetMs == null) return "never synced"
  if (offsetMs < 15_000) return "synced just now"
  if (offsetMs < 90_000) return `synced ${Math.round(offsetMs / 1000)}s ago`
  const min = Math.round(offsetMs / 60_000)
  return `synced ${min}m ago`
}
