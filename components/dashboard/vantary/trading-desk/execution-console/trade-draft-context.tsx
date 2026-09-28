"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION CONSOLE · TRADE DRAFT PROVIDER  (Phase 3)
 *  ─────────────────────────────────────────────────────────────────────────
 *  The cockpit's shared brain for an in-progress trade idea. It is the ONLY
 *  owner of mutable draft state; the three new stations (Market Context,
 *  Direction, SL/TP/RR) read the resolved draft from context and write back
 *  through small, intention-revealing actions (setSide, setStop, …).
 *
 *  It also owns the single market "tick" — a slow, deterministic counter that
 *  rolls the live quote so the cockpit feels alive without any wall-clock /
 *  Math.random (SSR-safe; first paint = tick 0).
 *
 *  The provider is FED, not in charge of, the upstream world: the selected
 *  account, its risk budget, the console mode, and the live-unlock are passed
 *  down from the shell (which gets them from the Account station). This keeps
 *  the data flow one-directional and clean for Phase 4/5.
 * ═══════════════════════════════════════════════════════════════════════ */

import {
  createContext, useContext, useReducer, useEffect, useMemo, useRef, useState,
  useCallback, type ReactNode,
} from "react"
import { useReducedMotion } from "framer-motion"

import { useTradingDesk } from "../provider"
import type { ConsoleMode } from "./console-theme"
import type { ConsoleAccount, RiskBudget } from "./account-data"
import {
  deriveMarketContext, instrumentFor, mapChartSymbolToConsole, type MarketContext,
} from "./market-data"
import {
  resolveTradeDraft, emptyDraft,
  type TradeDraftInput, type ResolvedTradeDraft,
  type TradeSide, type OrderType,
} from "./trade-draft"

/* ─── Draft reducer ────────────────────────────────────────────────────── */
type DraftAction =
  | { type: "setSide";       side: TradeSide }
  | { type: "setOrderType";  orderType: OrderType }
  | { type: "setEntry";      entry: number | null }
  | { type: "setStop";       stopLoss: number | null }
  | { type: "setTarget";     takeProfit: number | null }
  | { type: "setRiskPct";    riskPct: number }
  | { type: "nudgeStopPips";  pips: number }   // ± pips from current/seed
  | { type: "reset";         symbol: string; riskPct: number }
  | { type: "rehome";        symbol: string }  // symbol changed → keep risk, drop prices

function draftReducer(state: TradeDraftInput, action: DraftAction): TradeDraftInput {
  switch (action.type) {
    case "setSide":      return { ...state, side: action.side }
    case "setOrderType": return { ...state, orderType: action.orderType, entry: action.orderType === "market" ? null : state.entry }
    case "setEntry":     return { ...state, entry: action.entry }
    case "setStop":      return { ...state, stopLoss: action.stopLoss }
    case "setTarget":    return { ...state, takeProfit: action.takeProfit }
    case "setRiskPct":   return { ...state, riskPct: action.riskPct }
    case "reset":        return emptyDraft(action.symbol, action.riskPct)
    case "rehome":       return { ...emptyDraft(action.symbol, state.riskPct), side: state.side, orderType: state.orderType }
    default:             return state
  }
}

/* ─── Context shape ────────────────────────────────────────────────────── */
interface TradeDraftContextValue {
  /* live world (read-only, fed from upstream) */
  account:   ConsoleAccount | null
  budget:    RiskBudget | null
  mode:      ConsoleMode
  market:    MarketContext
  /* the resolved draft (the single truth the stations render) */
  draft:     ResolvedTradeDraft
  input:     TradeDraftInput
  /* actions */
  setSymbol:    (s: string) => void
  setSide:      (s: TradeSide) => void
  setOrderType: (o: OrderType) => void
  setEntry:     (n: number | null) => void
  setStop:      (n: number | null) => void
  setTarget:    (n: number | null) => void
  setRiskPct:   (n: number) => void
  /** seed SL/TP from a sensible default (1×ATR stop, RR-based target). */
  autoFillLadder: () => void
  resetDraft:   () => void
  /* whether the draft-building surfaces should be dimmed (disconnected). */
  buildingEnabled: boolean
  /* ── chart link ──────────────────────────────────────────────────────
   * The console is attached to the chart by default. `chartSymbol` is the
   * tradable console instrument the chart currently maps to (null when the
   * chart sits on something the desk can't trade). `chartLinked` is true while
   * the console mirrors the chart; a manual setSymbol breaks the link and
   * `relinkChart()` re-attaches it. `chartLabel` is the chart's raw quote. */
  chartSymbol:  string | null
  chartLabel:   string
  chartLinked:  boolean
  chartTradable: boolean
  relinkChart:  () => void
}

const TradeDraftContext = createContext<TradeDraftContextValue | null>(null)

export function useTradeDraft(): TradeDraftContextValue {
  const ctx = useContext(TradeDraftContext)
  if (!ctx) throw new Error("useTradeDraft must be used within TradeDraftProvider")
  return ctx
}

/* ─── Provider ─────────────────────────────────────────────────────────── */
export function TradeDraftProvider({
  account,
  budget,
  mode,
  liveUnlocked = false,
  initialSymbol = "EUR/USD",
  children,
}: {
  account: ConsoleAccount | null
  budget:  RiskBudget | null
  mode:    ConsoleMode
  liveUnlocked?: boolean
  initialSymbol?: string
  children: ReactNode
}) {
  const reduce = useReducedMotion()

  /* — the chart owns the active instrument. We read its current quote and map
   *    it onto a tradable console symbol. The console MIRRORS the chart unless
   *    the trader manually overrides (which breaks the link until relinked). — */
  const { selectors } = useTradingDesk()
  const chartLabel = selectors.currentSymbol.quote
  const chartSymbol = useMemo(() => mapChartSymbolToConsole(chartLabel), [chartLabel])
  const chartTradable = chartSymbol != null

  // `override` null ⇒ console follows the chart. A manual pick sets it.
  const [override, setOverride] = useState<string | null>(null)
  const chartLinked = override == null

  // effective console symbol: manual override → else chart map → else last good.
  const lastGoodRef = useRef<string>(initialSymbol)
  const symbol = useMemo(() => {
    if (override != null) return override
    if (chartSymbol != null) { lastGoodRef.current = chartSymbol; return chartSymbol }
    return lastGoodRef.current // chart on an untradable instrument → hold last tradable
  }, [override, chartSymbol])

  const setSymbol = useCallback((s: string) => setOverride(s), [])
  const relinkChart = useCallback(() => setOverride(null), [])

  /* — market tick: a slow deterministic heartbeat (SSR-safe; starts at 0) — */
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setTick(t => t + 1), 1600)
    return () => clearInterval(id)
  }, [reduce])

  const market = useMemo(() => deriveMarketContext(symbol, tick), [symbol, tick])

  /* — draft input (seeded from the account's per-trade ceiling) — */
  const seedRisk = account?.maxRiskPctPerTrade ?? 1
  const [input, dispatch] = useReducer(draftReducer, undefined, () => emptyDraft(symbol, seedRisk))

  // when the account changes, re-seed the risk ceiling (clamp current down).
  const prevAccountId = useRef<string | null>(account?.id ?? null)
  useEffect(() => {
    const id = account?.id ?? null
    if (id !== prevAccountId.current) {
      prevAccountId.current = id
      // keep the trade idea but clamp risk into the new account's ceiling
      const ceiling = account?.maxRiskPctPerTrade ?? 1
      dispatch({ type: "setRiskPct", riskPct: Math.min(input.riskPct, ceiling) })
    }
  }, [account, input.riskPct])

  // when the symbol changes, drop stale prices but keep side/orderType/risk.
  const prevSymbol = useRef(symbol)
  useEffect(() => {
    if (symbol !== prevSymbol.current) {
      prevSymbol.current = symbol
      dispatch({ type: "rehome", symbol })
    }
  }, [symbol])

  /* — resolve — */
  const draft = useMemo(
    () => resolveTradeDraft({ input, account, budget, market, mode, liveUnlocked }),
    [input, account, budget, market, mode, liveUnlocked],
  )

  /* — actions — */
  const setSide      = useCallback((s: TradeSide) => dispatch({ type: "setSide", side: s }), [])
  const setOrderType = useCallback((o: OrderType) => dispatch({ type: "setOrderType", orderType: o }), [])
  const setEntry     = useCallback((n: number | null) => dispatch({ type: "setEntry", entry: n }), [])
  const setStop      = useCallback((n: number | null) => dispatch({ type: "setStop", stopLoss: n }), [])
  const setTarget    = useCallback((n: number | null) => dispatch({ type: "setTarget", takeProfit: n }), [])
  const setRiskPct   = useCallback((n: number) => {
    const ceiling = account?.maxRiskPctPerTrade ?? 5
    dispatch({ type: "setRiskPct", riskPct: Math.max(0.1, Math.min(n, ceiling)) })
  }, [account])
  const resetDraft   = useCallback(() => dispatch({ type: "reset", symbol, riskPct: seedRisk }), [symbol, seedRisk])

  /* autoFill: place a sensible 1×ATR-ish stop and a 2R target on the correct
   * side of the effective entry, so the trader gets an instant, valid draft
   * they can then refine. Direction-aware. */
  const autoFillLadder = useCallback(() => {
    const inst = market.instrument
    const q = market.quote
    if (!inst || !q || !input.side) return
    const entry = input.orderType === "market"
      ? (input.side === "sell" ? q.bid : q.ask)
      : (input.entry ?? q.mid)
    const vol = market.volatility?.atrPips ?? 40
    const stopPips = Math.max(8, Math.round(vol * 0.4)) // ~0.4 ATR
    const stopDist = stopPips * inst.pipSize
    const targetDist = stopDist * 2 // 2R default
    if (input.side === "buy") {
      dispatch({ type: "setStop", stopLoss: round(entry - stopDist, inst.digits) })
      dispatch({ type: "setTarget", takeProfit: round(entry + targetDist, inst.digits) })
    } else {
      dispatch({ type: "setStop", stopLoss: round(entry + stopDist, inst.digits) })
      dispatch({ type: "setTarget", takeProfit: round(entry - targetDist, inst.digits) })
    }
    if (input.orderType !== "market" && input.entry == null) {
      dispatch({ type: "setEntry", entry: round(entry, inst.digits) })
    }
  }, [market, input])

  const buildingEnabled = account != null && market.readiness !== "unavailable" && market.readiness !== "closed"

  const value = useMemo<TradeDraftContextValue>(() => ({
    account, budget, mode, market, draft, input,
    setSymbol, setSide, setOrderType, setEntry, setStop, setTarget, setRiskPct,
    autoFillLadder, resetDraft, buildingEnabled,
    chartSymbol, chartLabel, chartLinked, chartTradable, relinkChart,
  }), [
    account, budget, mode, market, draft, input,
    setSymbol, setSide, setOrderType, setEntry, setStop, setTarget, setRiskPct,
    autoFillLadder, resetDraft, buildingEnabled,
    chartSymbol, chartLabel, chartLinked, chartTradable, relinkChart,
  ])

  return <TradeDraftContext.Provider value={value}>{children}</TradeDraftContext.Provider>
}

/* round a price to the instrument's digit count, FP-safe. */
function round(n: number, digits: number): number {
  const f = Math.pow(10, digits)
  return Math.round(n * f) / f
}

export { instrumentFor }
