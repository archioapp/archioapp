/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION CONSOLE · TRADE DRAFT MODEL  (Phase 3)
 *  ─────────────────────────────────────────────────────────────────────────
 *  The single source of truth for an in-progress trade IDEA. Pure data + pure
 *  derivation — no React, no DOM. The TradeDraftProvider owns one mutable
 *  TradeDraftInput; everything the three new stations render (entry refs, pip
 *  distances, RR, lot size, estimated P/L, readiness, blocking + caution
 *  reasons) is DERIVED here so no two numbers can ever contradict.
 *
 *  Design law (blueprint §2 carried into Phase 3): RISK IS THE PROTAGONIST.
 *  The trader chooses what they're willing to lose (risk %, from the Account
 *  station) and where the stop goes; LOT SIZE is the downstream consequence —
 *  never typed, always computed. If the stop is missing or on the wrong side,
 *  the draft is not "0 lots", it is INVALID, and readiness is blocked.
 *
 *  Phase-3 boundary: this builds a serious DRAFT. No order is constructed for
 *  submission, no preview/confirm exists yet, no TradeLocker call is made. The
 *  DraftReadiness ("preview-ready") is the furthest this phase reaches.
 *
 *  The shapes are intentionally forward-compatible: Phase 4 (Preview /
 *  Confirmation) and Phase 5 (Simulation / Live submit) consume the exact same
 *  ResolvedTradeDraft with zero change here.
 * ═══════════════════════════════════════════════════════════════════════ */

import type { ConsoleMode } from "./console-theme"
import type { ConsoleAccount, RiskBudget } from "./account-data"
import type { Instrument, Quote, MarketContext } from "./market-data"

/* ─── Direction + order type ───────────────────────────────────────────── */
export type TradeSide = "buy" | "sell"
export type OrderType = "market" | "limit" | "stop"

/* ─── The raw, user-editable draft (what the provider mutates) ─────────── */
export interface TradeDraftInput {
  /** the symbol the market station resolved (mirrors chart). */
  symbol:     string
  side:       TradeSide | null
  orderType:  OrderType
  /** explicit entry for limit/stop; null = use live market price. */
  entry:      number | null
  stopLoss:   number | null
  takeProfit: number | null
  /** risk per trade as % of equity — seeded from the account ceiling, the
   *  trader can dial it DOWN but never above the account's max. */
  riskPct:    number
}

export function emptyDraft(symbol: string, riskPct: number): TradeDraftInput {
  return {
    symbol,
    side: null,
    orderType: "market",
    entry: null,
    stopLoss: null,
    takeProfit: null,
    riskPct,
  }
}

/* ─── Validation issues ────────────────────────────────────────────────── */
export type IssueLevel = "block" | "caution"
export interface DraftIssue {
  level:  IssueLevel
  code:   string
  /** the human one-liner shown in the readiness rail / under a field. */
  message: string
  /** which station owns the fix (drives the "resolve here" affordance). */
  station: "account" | "market" | "direction" | "ladder"
}

/* ─── The resolved, fully-derived draft (what stations render) ─────────── */
export type DraftReadinessState =
  | "idle"          // nothing chosen yet
  | "incomplete"    // building, but missing required pieces
  | "invalid"       // a hard rule is violated (e.g. SL on wrong side)
  | "blocked"       // account/market refuses (daily limit, closed, unavailable)
  | "preview-ready" // a complete, valid, sane draft — the Phase-3 summit
  | "sim-ready"     // preview-ready on a simulation account
  | "locked"        // preview-ready but live submission is locked

export interface ResolvedTradeDraft {
  /* echoed identity */
  accountId:  string | null
  mode:       ConsoleMode
  symbol:     string
  side:       TradeSide | null
  orderType:  OrderType

  /* prices */
  entry:      number | null   // effective entry (market price for "market")
  entrySource: "market" | "manual"
  stopLoss:   number | null
  takeProfit: number | null

  /* the protagonist: risk */
  riskPct:    number
  riskAmount: number          // riskPct% of equity, capped by remaining budget
  riskCappedByBudget: boolean

  /* distances (pips) */
  stopPips:   number | null
  targetPips: number | null

  /* the math */
  rr:         number | null   // reward : risk
  lotSize:    number | null   // computed standard lots
  units:      number | null   // lotSize * contractSize
  estLoss:    number | null   // ≈ -riskAmount when sized to risk
  estProfit:  number | null
  pipValue:   number | null   // $ per pip at the computed lot size
  marginEst:  number | null   // rough margin requirement placeholder

  /* readiness */
  readiness:  DraftReadinessState
  issues:     DraftIssue[]
  blocks:     DraftIssue[]
  cautions:   DraftIssue[]
  /** completion 0..1 for the progress hairline (side, entry, SL, TP). */
  completion: number
}

/* ─── pip distance between two prices ──────────────────────────────────── */
export function pipsBetween(a: number, b: number, inst: Instrument): number {
  return Math.abs(a - b) / inst.pipSize
}

/* ─── effective entry price for the current order type ─────────────────── */
function effectiveEntry(
  input: TradeDraftInput,
  quote: Quote | null,
): { entry: number | null; source: "market" | "manual" } {
  if (input.orderType === "market") {
    // market buys at ask, sells at bid (honest fill side)
    if (!quote) return { entry: null, source: "market" }
    const px = input.side === "sell" ? quote.bid : quote.ask
    return { entry: px, source: "market" }
  }
  // limit / stop use the typed entry
  return { entry: input.entry, source: "manual" }
}

/* ─── pending-order price sanity (limit/stop sit on the correct side) ──── */
function pendingEntryIssue(
  input: TradeDraftInput,
  quote: Quote | null,
): DraftIssue | null {
  if (input.orderType === "market" || input.entry == null || !quote) return null
  const mid = quote.mid
  const { side, orderType, entry } = input

  // BUY LIMIT below market, BUY STOP above market; inverse for sells.
  if (side === "buy" && orderType === "limit" && entry >= mid)
    return { level: "caution", code: "buy-limit-above", message: "Buy limit is at/above market — it would fill immediately as a market order.", station: "direction" }
  if (side === "buy" && orderType === "stop" && entry <= mid)
    return { level: "caution", code: "buy-stop-below", message: "Buy stop is at/below market — place it above to trigger on a breakout.", station: "direction" }
  if (side === "sell" && orderType === "limit" && entry <= mid)
    return { level: "caution", code: "sell-limit-below", message: "Sell limit is at/below market — it would fill immediately.", station: "direction" }
  if (side === "sell" && orderType === "stop" && entry >= mid)
    return { level: "caution", code: "sell-stop-above", message: "Sell stop is at/above market — place it below to trigger on a breakdown.", station: "direction" }
  return null
}

/* ─── direction-aware SL / TP side validation ──────────────────────────── */
function stopSideIssue(side: TradeSide, entry: number, sl: number): DraftIssue | null {
  // BUY: stop must be BELOW entry. SELL: stop must be ABOVE entry.
  if (side === "buy" && sl >= entry)
    return { level: "block", code: "sl-wrong-side-buy", message: "Stop loss must sit below entry for a buy.", station: "ladder" }
  if (side === "sell" && sl <= entry)
    return { level: "block", code: "sl-wrong-side-sell", message: "Stop loss must sit above entry for a sell.", station: "ladder" }
  return null
}
function targetSideIssue(side: TradeSide, entry: number, tp: number): DraftIssue | null {
  // BUY: target ABOVE entry. SELL: target BELOW entry.
  if (side === "buy" && tp <= entry)
    return { level: "block", code: "tp-wrong-side-buy", message: "Take profit must sit above entry for a buy.", station: "ladder" }
  if (side === "sell" && tp >= entry)
    return { level: "block", code: "tp-wrong-side-sell", message: "Take profit must sit below entry for a sell.", station: "ladder" }
  return null
}

/* ─── THE RESOLVER — the one function that turns input → resolved draft ─── */
export function resolveTradeDraft(args: {
  input:    TradeDraftInput
  account:  ConsoleAccount | null
  budget:   RiskBudget | null
  market:   MarketContext
  mode:     ConsoleMode
  /** crown lock: when a live/prop account is armed. */
  liveUnlocked: boolean
}): ResolvedTradeDraft {
  const { input, account, budget, market, mode } = args
  const inst = market.instrument
  const quote = market.quote

  const issues: DraftIssue[] = []

  /* — risk amount (capped by remaining daily budget) — */
  const equity = account?.equity ?? 0
  const rawRiskAmount = (input.riskPct / 100) * equity
  const remaining = budget?.remaining ?? 0
  const riskCappedByBudget = budget != null && rawRiskAmount > remaining && remaining >= 0
  const riskAmount = budget != null ? Math.min(rawRiskAmount, remaining) : rawRiskAmount

  /* — effective entry — */
  const { entry, source: entrySource } = effectiveEntry(input, quote)

  /* — account / market level blocks (architecturally clean: these come from
   *   the upstream stations, never invented here) — */
  if (!account) {
    issues.push({ level: "block", code: "no-account", message: "Select an account to build a trade.", station: "account" })
  }
  if (market.readiness === "unavailable") {
    issues.push({ level: "block", code: "symbol-unavailable", message: market.warning ?? "Symbol unavailable.", station: "market" })
  } else if (market.readiness === "closed") {
    issues.push({ level: "block", code: "market-closed", message: market.warning ?? "Market closed.", station: "market" })
  }
  if (budget && budget.remaining <= 0) {
    issues.push({ level: "block", code: "budget-spent", message: "Daily risk budget is spent — no new risk allowed.", station: "account" })
  }
  if (budget && Number.isFinite(budget.tradesLeft) && budget.tradesLeft <= 0) {
    issues.push({ level: "block", code: "cap-reached", message: "Daily trade cap reached.", station: "account" })
  }
  if (market.readiness === "caution" && market.caution) {
    issues.push({ level: "caution", code: "market-caution", message: market.caution, station: "market" })
  }

  /* — direction — */
  if (!input.side) {
    issues.push({ level: "block", code: "no-side", message: "Choose buy or sell.", station: "direction" })
  }
  if ((input.orderType === "limit" || input.orderType === "stop") && input.entry == null) {
    issues.push({ level: "block", code: "no-entry", message: `Enter a ${input.orderType} price.`, station: "direction" })
  }
  const pendingIssue = pendingEntryIssue(input, quote)
  if (pendingIssue) issues.push(pendingIssue)

  /* — stop / target distances + side validation — */
  let stopPips: number | null = null
  let targetPips: number | null = null

  if (input.stopLoss == null) {
    issues.push({ level: "block", code: "no-sl", message: "A stop loss is required before this trade can be sized.", station: "ladder" })
  }
  if (input.takeProfit == null) {
    issues.push({ level: "caution", code: "no-tp", message: "No take profit set — reward is open-ended and RR can't be measured.", station: "ladder" })
  }

  if (inst && entry != null && input.side) {
    if (input.stopLoss != null) {
      const sideIssue = stopSideIssue(input.side, entry, input.stopLoss)
      if (sideIssue) {
        issues.push(sideIssue)
      } else {
        stopPips = pipsBetween(entry, input.stopLoss, inst)
        if (stopPips < 0.5) {
          issues.push({ level: "block", code: "sl-too-tight", message: "Stop is effectively at entry — widen it to a real distance.", station: "ladder" })
          stopPips = null
        }
      }
    }
    if (input.takeProfit != null) {
      const sideIssue = targetSideIssue(input.side, entry, input.takeProfit)
      if (sideIssue) {
        issues.push(sideIssue)
      } else {
        targetPips = pipsBetween(entry, input.takeProfit, inst)
      }
    }
  }

  /* — RR — */
  const rr = stopPips && targetPips ? targetPips / stopPips : null
  if (rr != null && rr < 1) {
    issues.push({ level: "caution", code: "rr-low", message: `Reward-to-risk is ${rr.toFixed(2)} — you're risking more than you stand to make.`, station: "ladder" })
  }

  /* — lot size (THE downstream consequence of risk + stop) — */
  let lotSize: number | null = null
  let units: number | null = null
  let pipValue: number | null = null
  let estLoss: number | null = null
  let estProfit: number | null = null
  let marginEst: number | null = null

  if (inst && stopPips && riskAmount > 0) {
    // riskAmount = stopPips * pipValuePerLot * lots  →  solve for lots
    const rawLots = riskAmount / (stopPips * inst.pipValuePerLot)
    lotSize = Math.max(0.01, Math.round(rawLots * 100) / 100) // 0.01 lot precision
    units = Math.round(lotSize * inst.contractSize)
    pipValue = lotSize * inst.pipValuePerLot
    estLoss = -(stopPips * pipValue)
    estProfit = targetPips != null ? targetPips * pipValue : null
    // rough margin placeholder: notional / leverage (leverage parsed loosely)
    const lev = account ? parseLeverage(account.leverage) : 100
    const notional = units * (entry ?? quote?.mid ?? 0) * (inst.klass === "forex" ? fxNotionalFactor(inst) : 1)
    marginEst = lev > 0 ? notional / lev : null
  }

  /* — partition issues — */
  const blocks = issues.filter(i => i.level === "block")
  const cautions = issues.filter(i => i.level === "caution")

  /* — completion (side, entry-or-market, SL, TP) — */
  const completionParts = [
    !!input.side,
    input.orderType === "market" ? !!quote : input.entry != null,
    input.stopLoss != null,
    input.takeProfit != null,
  ]
  const completion = completionParts.filter(Boolean).length / completionParts.length

  /* — readiness state machine — */
  let readiness: DraftReadinessState
  const hasAnything = !!input.side || input.stopLoss != null || input.takeProfit != null
  const accountOrMarketBlock = blocks.some(b => b.station === "account" || b.station === "market")
  const ladderOrDirBlock = blocks.some(b => b.station === "ladder" || b.station === "direction")

  if (!account && !hasAnything) {
    readiness = "idle"
  } else if (accountOrMarketBlock) {
    readiness = "blocked"
  } else if (ladderOrDirBlock) {
    // distinguish "still building" from "actively invalid"
    const invalidCodes = blocks.filter(b =>
      b.code.includes("wrong-side") || b.code === "sl-too-tight",
    )
    readiness = invalidCodes.length > 0 ? "invalid" : "incomplete"
  } else if (lotSize != null && stopPips != null) {
    // a complete, sane, sized draft — the Phase-3 summit
    if (mode === "simulation") readiness = "sim-ready"
    else if (mode === "live-ready") readiness = "preview-ready"
    else if (mode === "live-locked") readiness = "locked"
    else readiness = "preview-ready"
  } else {
    readiness = "incomplete"
  }

  return {
    accountId: account?.id ?? null,
    mode,
    symbol: input.symbol,
    side: input.side,
    orderType: input.orderType,
    entry,
    entrySource,
    stopLoss: input.stopLoss,
    takeProfit: input.takeProfit,
    riskPct: input.riskPct,
    riskAmount,
    riskCappedByBudget,
    stopPips,
    targetPips,
    rr,
    lotSize,
    units,
    estLoss,
    estProfit,
    pipValue,
    marginEst,
    readiness,
    issues,
    blocks,
    cautions,
    completion,
  }
}

/* ─── helpers ──────────────────────────────────────────────────────────── */
function parseLeverage(lev: string): number {
  // "1:100" → 100
  const m = lev.match(/1:(\d+)/)
  return m ? Number(m[1]) : 100
}
function fxNotionalFactor(inst: Instrument): number {
  // for USD-quoted pairs notional ≈ units * price; for USD-base (USD/JPY) the
  // notional in USD ≈ units (already in base). Keep it simple + honest.
  return inst.base === "USD" ? 1 / 100 : 1
}

/* ─── readiness presentation (shared by the draft readiness rail) ──────── */
export interface DraftReadinessView {
  headline: string
  detail:   string
}
export function draftReadinessView(d: ResolvedTradeDraft): DraftReadinessView {
  switch (d.readiness) {
    case "idle":
      return { headline: "No trade drafted", detail: "Choose a direction to begin shaping an idea." }
    case "incomplete": {
      const first = d.blocks[0]
      return { headline: "Draft in progress", detail: first ? first.message : "Add the missing pieces to complete the draft." }
    }
    case "invalid": {
      const first = d.blocks.find(b => b.code.includes("wrong-side") || b.code === "sl-too-tight")
      return { headline: "Draft invalid", detail: first ? first.message : "A price is on the wrong side — fix the ladder." }
    }
    case "blocked": {
      const first = d.blocks.find(b => b.station === "account" || b.station === "market")
      return { headline: "Execution blocked", detail: first ? first.message : "An account or market rule is being violated." }
    }
    case "sim-ready":
      return { headline: "Simulation draft ready", detail: "Complete and risk-sized — place when you're ready." }
    case "locked":
      return { headline: "Draft ready · live locked", detail: "A valid idea — unlock live arming to place it." }
    case "preview-ready":
      return { headline: "Ready to place", detail: "All checks pass — the order is armed and ready." }
  }
}
