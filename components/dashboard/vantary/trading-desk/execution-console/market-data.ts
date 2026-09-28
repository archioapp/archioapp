/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION CONSOLE · MARKET CONTEXT MODEL  (Phase 3)
 *  ─────────────────────────────────────────────────────────────────────────
 *  The honest, TradeLocker-friendly market layer the Market Context station
 *  reads from. Like account-data.ts this is PURE DATA + PURE DERIVATION — no
 *  React, no DOM — so the cockpit can never render a quote that disagrees
 *  with the spread that disagrees with the session.
 *
 *  Phase-3 rule (blueprint): the market layer is mock-but-honest. Every shape
 *  here is intentionally close to a broker instrument + quote so Phase 5 can
 *  swap the deterministic loader for a real TradeLocker feed with no change
 *  to the stations that consume it.
 *
 *  We never use Math.random → all "live-ish" motion is derived from a seed +
 *  a tick counter the station owns, so SSR and first client paint agree.
 * ═══════════════════════════════════════════════════════════════════════ */

/* ─── Instrument (the tradable symbol) ─────────────────────────────────── */
export type AssetClass = "forex" | "metal" | "index" | "crypto"

export interface Instrument {
  symbol:   string          // "EUR/USD"
  base:     string          // "EUR"
  quote:    string          // "USD"
  klass:    AssetClass
  /** price increment of ONE pip (0.0001 majors, 0.01 JPY, 0.1 gold…). */
  pipSize:  number
  /** number of price decimals to render. */
  digits:   number
  /** units in one standard lot (100k forex, 100oz gold…). */
  contractSize: number
  /** $ value of one pip for ONE standard lot (USD-quoted ≈ $10). */
  pipValuePerLot: number
  /** broker says it's tradable right now. Phase 3 keeps one symbol false to
   *  prove the "unavailable" rail. */
  tradable: boolean
}

/* The Phase-3 instrument book. EUR/USD is the protagonist (always tradable);
 * the others let the station prove availability + asset-class breadth. */
export const INSTRUMENT_BOOK: ReadonlyArray<Instrument> = [
  { symbol: "EUR/USD", base: "EUR", quote: "USD", klass: "forex",  pipSize: 0.0001, digits: 5, contractSize: 100_000, pipValuePerLot: 10,  tradable: true },
  { symbol: "GBP/USD", base: "GBP", quote: "USD", klass: "forex",  pipSize: 0.0001, digits: 5, contractSize: 100_000, pipValuePerLot: 10,  tradable: true },
  { symbol: "USD/JPY", base: "USD", quote: "JPY", klass: "forex",  pipSize: 0.01,   digits: 3, contractSize: 100_000, pipValuePerLot: 9.1, tradable: true },
  { symbol: "XAU/USD", base: "XAU", quote: "USD", klass: "metal",  pipSize: 0.1,    digits: 2, contractSize: 100,     pipValuePerLot: 10,  tradable: true },
  { symbol: "US100",   base: "US100", quote: "USD", klass: "index", pipSize: 0.1,   digits: 1, contractSize: 1,       pipValuePerLot: 0.1, tradable: false },
]

export function instrumentFor(symbol: string): Instrument | null {
  return INSTRUMENT_BOOK.find(i => i.symbol === symbol) ?? null
}

/* ─── Chart → console symbol bridge ────────────────────────────────────────
 *  The console is "attached to the chart": the trading-desk chart owns the
 *  active symbol (a TdSymbol whose `quote` reads like "EUR/USD", "XAU/USD",
 *  "BTC", "ES"…). This maps that chart quote onto a tradable console
 *  instrument. When the chart sits on something this desk can't trade yet
 *  (futures, crypto, single stocks) we return null — the console then shows
 *  the chart's raw label as UNAVAILABLE rather than silently drifting to a
 *  different pair. Phase 5 swaps this for a real broker instrument lookup. */
const CHART_QUOTE_TO_CONSOLE: Record<string, string> = {
  "EUR/USD": "EUR/USD",
  "GBP/USD": "GBP/USD",
  "USD/JPY": "USD/JPY",
  "XAU/USD": "XAU/USD",
  // index proxies → the desk's US100 CFD
  "NDX": "US100",
  "NQ":  "US100",
}

export function mapChartSymbolToConsole(chartQuote: string | null | undefined): string | null {
  if (!chartQuote) return null
  const key = chartQuote.toUpperCase()
  return CHART_QUOTE_TO_CONSOLE[key] ?? CHART_QUOTE_TO_CONSOLE[chartQuote] ?? null
}

/* ─── Live quote ───────────────────────────────────────────────────────── */
export interface Quote {
  symbol: string
  bid:    number
  ask:    number
  mid:    number
  /** spread expressed in pips (ask-bid)/pipSize. */
  spreadPips: number
  /** signed change over the recent window, in price. */
  change: number
  /** % change over the window. */
  changePct: number
}

/* Reference mids per symbol — the "anchor" a tick oscillates around. */
const REF_MID: Record<string, number> = {
  "EUR/USD": 1.08642,
  "GBP/USD": 1.26418,
  "USD/JPY": 156.842,
  "XAU/USD": 2338.40,
  "US100":   19847.5,
}

/* Typical broker spread (in pips) per symbol — drives the spread pill tone. */
const REF_SPREAD_PIPS: Record<string, number> = {
  "EUR/USD": 0.8,
  "GBP/USD": 1.2,
  "USD/JPY": 1.0,
  "XAU/USD": 2.4,
  "US100":   1.5,
}

/* Deterministic quote at a given tick. `tick` is owned by the station's
 * interval; identical tick → identical quote (SSR-safe when tick starts 0). */
export function quoteAt(symbol: string, tick: number): Quote | null {
  const inst = instrumentFor(symbol)
  const ref  = REF_MID[symbol]
  if (!inst || ref == null) return null

  // a smooth pseudo-random walk from sin layers (no Math.random).
  // Kept to a realistic intra-tick jitter (~±2.6 pips) so the quote feels
  // alive WITHOUT making a fixed stop/target's R:R swing between ticks — an
  // 18-pip-per-second walk would make every built trade look incoherent.
  const t = tick
  const wave =
    Math.sin(t * 0.21 + symbol.length) * 0.6 +
    Math.sin(t * 0.07 + 1.3) * 0.32 +
    Math.sin(t * 0.4 + 2.1) * 0.12
  const drift = wave * inst.pipSize * 2.6 // ±~2.6 pip band (calm, coherent)
  const mid = ref + drift

  const baseSpread = REF_SPREAD_PIPS[symbol] ?? 1
  // spread breathes a little, occasionally widening (teaches the spread pill)
  const spreadWobble = 1 + Math.max(0, Math.sin(t * 0.13 + 3)) * 0.9
  const spreadPips = baseSpread * spreadWobble
  const half = (spreadPips * inst.pipSize) / 2

  const bid = mid - half
  const ask = mid + half
  // Day change is a stable per-instrument figure (a slow session move), not the
  // tick jitter — so the headline %/spark read like a real daily change.
  const daySeed = Math.sin(symbol.length * 1.7 + 0.4) * 0.5 + Math.sin(symbol.length * 0.9) * 0.3
  const changePct = daySeed * 0.55 + Math.sin(t * 0.03) * 0.06 // ~ -0.4%..+0.5%, gently breathing
  const change = (changePct / 100) * ref

  return {
    symbol,
    bid,
    ask,
    mid,
    spreadPips,
    change,
    changePct,
  }
}

/* ─── Spread condition (drives the spread pill tone) ───────────────────── */
export type SpreadCondition = "tight" | "normal" | "wide"

export function spreadCondition(symbol: string, spreadPips: number): SpreadCondition {
  const base = REF_SPREAD_PIPS[symbol] ?? 1
  if (spreadPips <= base * 1.25) return "tight"
  if (spreadPips <= base * 1.9)  return "normal"
  return "wide"
}

/* ─── Trading session (London / New York / Tokyo / Sydney) ─────────────── */
export type SessionId = "sydney" | "tokyo" | "london" | "newyork"

export interface SessionState {
  active:    SessionId
  label:     string
  /** human "open" / "closed" verdict for the whole market. */
  marketOpen: boolean
  /** overlap with a second major session (highest liquidity). */
  overlap:   SessionId | null
  /** minutes until the next session boundary. */
  nextBoundaryMin: number
  nextBoundaryLabel: string
}

/* A fixed, deterministic session snapshot (Phase 3 doesn't read wall-clock to
 * stay SSR-stable; the live clock elsewhere owns real time). London open,
 * overlapping into New York pre-open — the canonical high-liquidity window. */
export const SESSION_STATE: SessionState = {
  active: "london",
  label: "London",
  marketOpen: true,
  overlap: null,
  nextBoundaryMin: 138,
  nextBoundaryLabel: "New York open",
}

/* ─── Volatility regime ────────────────────────────────────────────────── */
export type VolatilityState = "calm" | "normal" | "elevated" | "high"

export interface Volatility {
  state: VolatilityState
  /** 0..1 normalised intensity for the meter. */
  intensity: number
  /** average true range, in pips, over the recent window (mock). */
  atrPips: number
  label: string
}

const VOL_BY_SYMBOL: Record<string, Volatility> = {
  "EUR/USD": { state: "normal",   intensity: 0.46, atrPips: 62,  label: "Normal" },
  "GBP/USD": { state: "elevated", intensity: 0.68, atrPips: 94,  label: "Elevated" },
  "USD/JPY": { state: "normal",   intensity: 0.52, atrPips: 71,  label: "Normal" },
  "XAU/USD": { state: "high",     intensity: 0.83, atrPips: 240, label: "High" },
  "US100":   { state: "elevated", intensity: 0.71, atrPips: 180, label: "Elevated" },
}

export function volatilityFor(symbol: string): Volatility {
  return VOL_BY_SYMBOL[symbol] ?? { state: "normal", intensity: 0.5, atrPips: 60, label: "Normal" }
}

/* ─── Macro event (the "is news about to hit?" line) ───────────────────── */
export type MacroImpact = "low" | "medium" | "high"

export interface MacroEvent {
  title:    string
  currency: string
  impact:   MacroImpact
  /** minutes until the event. */
  inMin:    number
  label:    string
}

export const NEXT_MACRO: MacroEvent = {
  title: "US Core PCE (m/m)",
  currency: "USD",
  impact: "high",
  inMin: 52,
  label: "in 52m",
}

/* whether a macro event sits inside a "danger window" (≤ 30m, high impact). */
export function macroInDangerWindow(ev: MacroEvent): boolean {
  return ev.impact === "high" && ev.inMin <= 30
}

/* ─── Timeframe context ────────────────────────────────────────────────── */
export const ACTIVE_TIMEFRAME = "M15"
export const TIMEFRAMES = ["M1", "M5", "M15", "H1", "H4", "D1"] as const

/* ─── Market readiness (the station's single "is this tradable now?" verdict) */
export type MarketReadiness = "tradable" | "caution" | "unavailable" | "closed"

export interface MarketContext {
  instrument: Instrument | null
  quote:      Quote | null
  spread:     SpreadCondition | null
  session:    SessionState
  volatility: Volatility | null
  macro:      MacroEvent
  timeframe:  string
  readiness:  MarketReadiness
  /** human caution line shown when the AI co-pilot has something to say. */
  caution:    string | null
  /** firm warning when the symbol/quote can't be traded. */
  warning:    string | null
}

export function deriveMarketContext(symbol: string, tick: number): MarketContext {
  const instrument = instrumentFor(symbol)
  const quote = quoteAt(symbol, tick)
  const session = SESSION_STATE
  const volatility = instrument ? volatilityFor(symbol) : null
  const macro = NEXT_MACRO
  const spread = quote ? spreadCondition(symbol, quote.spreadPips) : null

  let readiness: MarketReadiness
  let caution: string | null = null
  let warning: string | null = null

  if (!instrument) {
    readiness = "unavailable"
    warning = "Symbol not found in the broker instrument book."
  } else if (!instrument.tradable) {
    readiness = "unavailable"
    warning = `${instrument.symbol} is not tradable on this account right now.`
  } else if (!session.marketOpen) {
    readiness = "closed"
    warning = "Market is closed for this instrument. Orders cannot be worked."
  } else {
    // tradable — but layer caution for wide spread / pending news / high vol.
    const danger = macroInDangerWindow(macro)
    const wideSpread = spread === "wide"
    const highVol = volatility?.state === "high"
    if (danger) {
      readiness = "caution"
      caution = `${macro.title} ${macro.label} — spreads may spike. Consider waiting.`
    } else if (wideSpread) {
      readiness = "caution"
      caution = "Spread is wider than usual — execution may slip."
    } else if (highVol) {
      readiness = "caution"
      caution = `${instrument.symbol} is in a high-volatility regime — size with care.`
    } else {
      readiness = "tradable"
      caution = macro.impact === "high"
        ? `${macro.title} ${macro.label}. Clear window for now.`
        : null
    }
  }

  return {
    instrument,
    quote,
    spread,
    session,
    volatility,
    macro,
    timeframe: ACTIVE_TIMEFRAME,
    readiness,
    caution,
    warning,
  }
}

/* ─── Formatting ───────────────────────────────────────────────────────── */
export function fmtPrice(price: number, digits: number): string {
  return price.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

/** Split a price into [big, pip, fraction] so the quote can render the pip
 *  digit larger (the broker-terminal "big figure / pip / fractional pip"). */
export function priceParts(price: number, inst: Instrument): {
  big: string; pip: string; frac: string
} {
  const s = fmtPrice(price, inst.digits)
  // pip digit index from the right depends on pipSize/digits
  // majors digits=5 → pip is 4th decimal (index len-2), frac is last digit
  if (inst.digits >= 4) {
    const big = s.slice(0, -2)
    const pip = s.slice(-2, -1)
    const frac = s.slice(-1)
    return { big, pip, frac }
  }
  if (inst.digits === 3) {
    // JPY: big figure to 1 decimal, pip = 2nd decimal, frac = 3rd
    const big = s.slice(0, -2)
    const pip = s.slice(-2, -1)
    const frac = s.slice(-1)
    return { big, pip, frac }
  }
  // index / 2-digit
  const big = s.slice(0, -1)
  const pip = s.slice(-1)
  return { big, pip, frac: "" }
}

export function fmtPips(pips: number): string {
  return `${pips.toFixed(1)} pip${Math.abs(pips - 1) < 0.05 ? "" : "s"}`
}
