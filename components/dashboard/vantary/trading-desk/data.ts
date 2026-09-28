/* ═══════════════════════════════════════════════════════════════════════════
 *  TRADING DESK · DATA LAYER
 *  ─────────────────────────────────────────────────────────────────────────
 *  All shared types, constants, demo fixtures, and pure helpers for the
 *  Vantary Trading Desk Bay — the full-bleed editorial workspace that
 *  lives between the "Ask Me Anything" oracle pill and the LIVE EQUITY
 *  VOLUME / ACTIVE WINDOWS deck.
 *
 *  This is the ONE place where:
 *    · the layout-mode union is defined          (`split` | `stacked` | …)
 *    · the side-slot variants are listed         (`active-windows` | …)
 *    · the symbol bank lives                     (DEMO_SYMBOLS)
 *    · the interval bank lives                   (DEMO_INTERVALS)
 *    · the active-trades fixture lives           (DEMO_ACTIVE_TRADES)
 *    · the live-equity fixture lives             (DEMO_EQUITY_SERIES)
 *    · localStorage keys + version are defined   (TD_STORAGE_KEY)
 *
 *  Pure data only — no React, no DOM access, no side effects. Unit-
 *  testable. Tree-shakable.
 * ═══════════════════════════════════════════════════════════════════════ */

/* ─── 1.  LAYOUT MODE UNION ──────────────────────────────────────────────
 *  Four canonical states the bay can be in:
 *
 *    split       — TradingView left, side slot right (default).
 *                  Dragging the vertical handle resizes the split from
 *                  30% to 80% TradingView-width.
 *
 *    stacked     — TradingView full-width on top, side slot full-width
 *                  below. Useful when the trader wants a tall chart and
 *                  the active-windows / live-equity rail beneath.
 *
 *    chart-only  — TradingView spans the entire bay edge-to-edge. The
 *                  side slot disappears (its switcher condenses into a
 *                  small inline pill on the bay header).
 *
 *    minimized   — bay collapses to a single 36px-tall hairline strip
 *                  showing the symbol, last price, and an expand pill.
 * ──────────────────────────────────────────────────────────────────── */
export type TdLayoutMode = "split" | "stacked" | "chart-only" | "minimized"

/* Visible to the chip strip — only SPLIT + CHART. The other two stay
 * in the union for backwards-compat with persisted localStorage shapes
 * and the fullscreen / minimized escape hatches in <WindowControls/>,
 * but they no longer surface as chips because they confused the trader
 * (M3 simplification — the canonical user-facing layout grammar is
 * "chart-only" with optional peek/pin OR "split" with two panes). */
export const TD_LAYOUT_MODES_ORDER: ReadonlyArray<TdLayoutMode> = [
  "chart-only",
  "split",
] as const

/* Human-readable labels + 1-letter keyboard hints for each layout mode.
 * Used by the layout-mode chip strip in the bay header. STACKED and MIN
 * are kept in the record so that any legacy persisted state still
 * resolves to a label, but they are no longer in TD_LAYOUT_MODES_ORDER
 * so the chip strip never renders them. */
export const TD_LAYOUT_LABELS: Record<TdLayoutMode, { label: string; hint: string }> = {
  split:        { label: "SPLIT",   hint: "S" },
  stacked:      { label: "STACKED", hint: "K" },
  "chart-only": { label: "CHART",   hint: "C" },
  minimized:    { label: "MIN",     hint: "M" },
}

/* ─── Side-slot POSITION ──────────────────────────────────────────────
 *  Independent of which slot is active or which layout is on, the slot
 *  itself can hug the LEFT or the RIGHT edge of the chart. Default is
 *  RIGHT (Bloomberg, IBKR convention). The trader can flip it via the
 *  position toggle in the header. Persists to localStorage so the
 *  setting survives reloads. */
export type TdSideSlotPosition = "left" | "right"
export const TD_SIDE_SLOT_POSITIONS_ORDER: ReadonlyArray<TdSideSlotPosition> = ["left", "right"] as const
export const TD_SIDE_SLOT_POSITION_LABELS: Record<TdSideSlotPosition, string> = {
  left:  "LEFT",
  right: "RIGHT",
}

/* ─── 2.  SIDE-SLOT VARIANT UNION ────────────────────────────────────────
 *  What lives in the right-hand panel (or the bottom panel in stacked
 *  mode). The trader switches between these via a two-pill toggle at
 *  the top of the slot.
 *
 *  active-windows  — compact list of currently open trades, mirroring
 *                    a slice of the bigger ACTIVE WINDOWS card from the
 *                    deck below. Symbol + side + entry + live PnL +
 *                    R-multiple per row.
 *
 *  live-equity     — micro version of LIVE EQUITY VOLUME. Equity
 *                    sparkline + today's PnL + week's PnL + best/worst
 *                    day chips.
 * ──────────────────────────────────────────────────────────────────── */
/* The full module library that can fill the side slot. Each entry
 * resolves to either a built-in mini (active-windows, live-equity) or
 * a parent-supplied render-prop content (account-asset, pairs-you-trade
 * — passed in via TradingDeskBay's `customSlotContent` map). The chip
 * strip renders only the modules the trader has favourited from the
 * customize popover; the remaining modules live in the popover so the
 * trader can swap in any of them at any time without crowding the
 * header rail. */
export type TdSideSlot =
  | "execution-console"
  | "active-windows"
  | "live-equity"
  | "account-asset"
  | "pairs-you-trade"
  | "pending-orders"
  | "risk-meter"
  | "daily-max"
  | "news-calendar"
  | "watchlist"
  | "ai-copilot"

export const TD_SIDE_SLOT_LABELS: Record<TdSideSlot, string> = {
  "execution-console": "EXECUTION CONSOLE",
  "active-windows":  "ACTIVE WINDOWS",
  "live-equity":     "LIVE EQUITY",
  "account-asset":   "ACCOUNT & ASSETS",
  "pairs-you-trade": "PAIRS YOU TRADE",
  "pending-orders":  "PENDING ORDERS",
  "risk-meter":      "RISK METER",
  "daily-max":       "DAILY MAX",
  "news-calendar":   "NEWS & CALENDAR",
  "watchlist":       "WATCHLIST",
  "ai-copilot":      "AI COPILOT",
}

/* Short labels for the compact chip variant in the header rail. Kept
 * to ≤7 chars per id so the chip group never overflows the rail. */
export const TD_SIDE_SLOT_SHORT_LABELS: Record<TdSideSlot, string> = {
  "execution-console": "EXECUTE",
  "active-windows":  "ACTIVE",
  "live-equity":     "EQUITY",
  "account-asset":   "ACCOUNT",
  "pairs-you-trade": "PAIRS",
  "pending-orders":  "PENDING",
  "risk-meter":      "RISK",
  "daily-max":       "MAX",
  "news-calendar":   "NEWS",
  "watchlist":       "WATCH",
  "ai-copilot":      "AI",
}

/* What's actually IMPLEMENTED today vs. what's a stub-with-coming-soon
 * placeholder. The customize popover uses this to render a small badge
 * next to each module so the trader knows what to expect. */
export const TD_SIDE_SLOT_IMPLEMENTED: Record<TdSideSlot, boolean> = {
  "execution-console": true,
  "active-windows":  true,
  "live-equity":     true,
  "account-asset":   true,
  "pairs-you-trade": true,
  "pending-orders":  false,
  "risk-meter":      false,
  "daily-max":       false,
  "news-calendar":   false,
  "watchlist":       false,
  "ai-copilot":      false,
}

/* Which modules the trader has chosen to expose as quick-toggle chips
 * in the header rail. The remaining modules are still reachable — they
 * just live behind the customize popover. Default is the four that we
 * actually have implementations for. */
export const TD_DEFAULT_FAVORITE_SLOTS: ReadonlyArray<TdSideSlot> = [
  "execution-console",
  "ai-copilot",
  "active-windows",
  "live-equity",
  "account-asset",
  "pairs-you-trade",
] as const

/* ─── 3.  SYMBOL BANK ────────────────────────────────────────────────────
 *  Canonical instrument list. The `tvSymbol` field holds the
 *  TradingView-formatted symbol the iframe widget needs (e.g.
 *  "FX:EURUSD", "OANDA:XAUUSD", "BINANCE:BTCUSDT", "SP:SPX").
 *
 *  `category` groups them in the picker dropdown. `displayName` is
 *  what the trader sees on the chip; `quote` is a human readable
 *  short label for the eyebrow ticker bar.
 * ──────────────────────────────────────────────────────────────────── */
export interface TdSymbol {
  /** Stable id used as React key + in actions. Not visible to user. */
  id: string
  /** What renders on the picker chip and the bay header. */
  displayName: string
  /** Short ticker for the minimize-mode strip. */
  quote: string
  /** TradingView-formatted symbol passed straight into the widget URL. */
  tvSymbol: string
  /** Group label for the picker dropdown. */
  category: "FUTURES" | "INDEX" | "FOREX" | "METALS" | "CRYPTO" | "STOCK"
  /** Optional last-known price — only used by the minimize-mode ticker
   *  while real prices aren't wired. Will be replaced by a live ws
   *  subscription in a later epic. */
  fakeLast?: number
  fakeChangePct?: number
}

export const DEMO_SYMBOLS: ReadonlyArray<TdSymbol> = [
  /* — FUTURES — */
  { id: "es",  displayName: "ES · S&P E-mini",   quote: "ES",     tvSymbol: "CME_MINI:ES1!",      category: "FUTURES", fakeLast: 5847.25, fakeChangePct: +0.32 },
  { id: "nq",  displayName: "NQ · Nasdaq E-mini",quote: "NQ",     tvSymbol: "CME_MINI:NQ1!",      category: "FUTURES", fakeLast: 20431.50, fakeChangePct: +0.48 },
  { id: "ym",  displayName: "YM · Dow E-mini",   quote: "YM",     tvSymbol: "CBOT_MINI:YM1!",     category: "FUTURES", fakeLast: 42312, fakeChangePct: -0.12 },
  { id: "rty", displayName: "RTY · Russell",     quote: "RTY",    tvSymbol: "CME_MINI:RTY1!",     category: "FUTURES", fakeLast: 2298.40, fakeChangePct: +0.71 },
  { id: "cl",  displayName: "CL · Crude Oil",    quote: "CL",     tvSymbol: "NYMEX:CL1!",         category: "FUTURES", fakeLast: 71.85, fakeChangePct: -0.28 },

  /* — INDEX (cash, non-tradable) — */
  { id: "spx", displayName: "SPX · S&P 500",     quote: "SPX",    tvSymbol: "SP:SPX",             category: "INDEX",   fakeLast: 5849.34, fakeChangePct: +0.34 },
  { id: "ndx", displayName: "NDX · Nasdaq 100",  quote: "NDX",    tvSymbol: "NASDAQ:NDX",         category: "INDEX",   fakeLast: 20425.18, fakeChangePct: +0.46 },
  { id: "dxy", displayName: "DXY · Dollar Index",quote: "DXY",    tvSymbol: "TVC:DXY",            category: "INDEX",   fakeLast: 106.81, fakeChangePct: +0.18 },
  { id: "vix", displayName: "VIX · Volatility",  quote: "VIX",    tvSymbol: "TVC:VIX",            category: "INDEX",   fakeLast: 15.23, fakeChangePct: -2.11 },

  /* — FOREX — */
  { id: "eurusd", displayName: "EUR/USD",        quote: "EUR/USD",tvSymbol: "FX:EURUSD",          category: "FOREX",   fakeLast: 1.0843, fakeChangePct: +0.12 },
  { id: "gbpusd", displayName: "GBP/USD",        quote: "GBP/USD",tvSymbol: "FX:GBPUSD",          category: "FOREX",   fakeLast: 1.2671, fakeChangePct: -0.04 },
  { id: "usdjpy", displayName: "USD/JPY",        quote: "USD/JPY",tvSymbol: "FX:USDJPY",          category: "FOREX",   fakeLast: 153.94, fakeChangePct: +0.21 },
  { id: "audusd", displayName: "AUD/USD",        quote: "AUD/USD",tvSymbol: "FX:AUDUSD",          category: "FOREX",   fakeLast: 0.6612, fakeChangePct: +0.08 },
  { id: "usdcad", displayName: "USD/CAD",        quote: "USD/CAD",tvSymbol: "FX:USDCAD",          category: "FOREX",   fakeLast: 1.3884, fakeChangePct: -0.11 },

  /* — METALS — */
  { id: "xauusd", displayName: "XAU/USD · Gold", quote: "XAU/USD",tvSymbol: "OANDA:XAUUSD",       category: "METALS",  fakeLast: 2761.40, fakeChangePct: +0.62 },
  { id: "xagusd", displayName: "XAG/USD · Silver",quote: "XAG/USD",tvSymbol: "OANDA:XAGUSD",      category: "METALS",  fakeLast: 33.84, fakeChangePct: +1.18 },

  /* — CRYPTO — */
  { id: "btcusdt", displayName: "BTC/USDT",      quote: "BTC",    tvSymbol: "BINANCE:BTCUSDT",    category: "CRYPTO",  fakeLast: 97842, fakeChangePct: +1.84 },
  { id: "ethusdt", displayName: "ETH/USDT",      quote: "ETH",    tvSymbol: "BINANCE:ETHUSDT",    category: "CRYPTO",  fakeLast: 3641.20, fakeChangePct: +2.04 },
  { id: "solusdt", displayName: "SOL/USDT",      quote: "SOL",    tvSymbol: "BINANCE:SOLUSDT",    category: "CRYPTO",  fakeLast: 261.40, fakeChangePct: +3.62 },

  /* — STOCK — */
  { id: "spy", displayName: "SPY · S&P 500 ETF",  quote: "SPY",    tvSymbol: "AMEX:SPY",          category: "STOCK",   fakeLast: 583.92, fakeChangePct: +0.31 },
  { id: "qqq", displayName: "QQQ · Nasdaq ETF",   quote: "QQQ",    tvSymbol: "NASDAQ:QQQ",        category: "STOCK",   fakeLast: 498.21, fakeChangePct: +0.46 },
  { id: "nvda",displayName: "NVDA · Nvidia",      quote: "NVDA",   tvSymbol: "NASDAQ:NVDA",       category: "STOCK",   fakeLast: 142.83, fakeChangePct: +1.21 },
  { id: "tsla",displayName: "TSLA · Tesla",       quote: "TSLA",   tvSymbol: "NASDAQ:TSLA",       category: "STOCK",   fakeLast: 261.40, fakeChangePct: -0.84 },
] as const

export const DEFAULT_SYMBOL_ID = "eurusd"

/* Resolve an id to a TdSymbol; returns the default if id is unknown. */
export function getSymbolById(id: string | null | undefined): TdSymbol {
  const found = DEMO_SYMBOLS.find(s => s.id === id)
  return found ?? DEMO_SYMBOLS.find(s => s.id === DEFAULT_SYMBOL_ID)!
}

/* ─── 4.  INTERVAL BANK ──────────────────────────────────────────────────
 *  The TradingView widget interval format is a string like "1", "5",
 *  "15", "60", "240", "D", "W", "M". `tvInterval` holds that exact
 *  string; `label` is what the user sees.
 * ──────────────────────────────────────────────────────────────────── */
export interface TdInterval {
  id: string
  label: string
  tvInterval: string
}

export const DEMO_INTERVALS: ReadonlyArray<TdInterval> = [
  { id: "1m",  label: "1m",  tvInterval: "1"   },
  { id: "5m",  label: "5m",  tvInterval: "5"   },
  { id: "15m", label: "15m", tvInterval: "15"  },
  { id: "1h",  label: "1H",  tvInterval: "60"  },
  { id: "4h",  label: "4H",  tvInterval: "240" },
  { id: "1d",  label: "1D",  tvInterval: "D"   },
  { id: "1w",  label: "1W",  tvInterval: "W"   },
  { id: "1mo", label: "1M",  tvInterval: "M"   },
] as const

export const DEFAULT_INTERVAL_ID = "1h"

export function getIntervalById(id: string | null | undefined): TdInterval {
  return DEMO_INTERVALS.find(i => i.id === id) ?? DEMO_INTERVALS.find(i => i.id === DEFAULT_INTERVAL_ID)!
}

/* ─── 5.  ACTIVE TRADES FIXTURE ──────────────────────────�����������───────────────
 *  Compact mock of currently-open positions for the side-slot variant
 *  `active-windows`. Replace with a real subscription later. */
export interface TdActiveTrade {
  id: string
  symbol: string
  side: "LONG" | "SHORT"
  entry: number
  current: number
  size: number          // contracts / lots
  pnlUsd: number        // signed
  rMultiple: number     // signed
  openedAtUtc: string   // "08:14" formatted
  durationMin: number   // minutes since entry
}

export const DEMO_ACTIVE_TRADES: ReadonlyArray<TdActiveTrade> = [
  { id: "t1", symbol: "EUR/USD", side: "LONG",  entry: 1.0821, current: 1.0843, size: 2.0, pnlUsd:  +44.0,  rMultiple: +1.4, openedAtUtc: "08:14", durationMin: 132 },
  { id: "t2", symbol: "XAU/USD", side: "LONG",  entry: 2754.80, current: 2761.40, size: 0.5, pnlUsd: +33.0,  rMultiple: +0.7, openedAtUtc: "09:42", durationMin:  74 },
  { id: "t3", symbol: "ES",      side: "SHORT", entry: 5852.00, current: 5847.25, size: 1.0, pnlUsd: +237.5, rMultiple: +1.9, openedAtUtc: "10:08", durationMin:  48 },
] as const

/* ─── 6.  LIVE EQUITY MICRO FIXTURE ──────────────────────────────────────
 *  Compact 96-tick equity curve and aggregate KPIs for the
 *  `live-equity` side-slot variant. */
export interface TdEquityMicro {
  /** 96 normalised values 0..1 (last 24h, 15-min granularity). */
  series: number[]
  todayPnlUsd: number
  todayPnlPct: number
  weekPnlUsd: number
  weekPnlPct: number
  bestDayPnlUsd: number
  worstDayPnlUsd: number
  currentEquity: number
}

/* Pre-computed series for the demo. Stable shape with a strong end-of-
 * day bias up so the trader feels the green. */
function buildDemoEquitySeries(): number[] {
  const out: number[] = []
  let v = 0.42
  for (let i = 0; i < 96; i++) {
    const seed     = Math.sin(i * 0.61) * 0.04
    const drift    = i / 96 * 0.18
    const noise    = ((i * 7919) % 17 - 8) / 800
    v = 0.42 + drift + seed + noise
    if (v < 0.05) v = 0.05
    if (v > 0.95) v = 0.95
    out.push(v)
  }
  return out
}

export const DEMO_EQUITY_MICRO: TdEquityMicro = {
  series:        buildDemoEquitySeries(),
  todayPnlUsd:   +274,
  todayPnlPct:   +1.2,
  weekPnlUsd:    +1247,
  weekPnlPct:    +5.4,
  bestDayPnlUsd: +427,
  worstDayPnlUsd: -184,
  currentEquity: 12480,
}

/* ─── 6b.  NAVIGATOR  ────────────────────────────────────────────────────
 *  The bay header hosts an "Institutional Confluence Navigator" — a
 *  customizable strip of category dropdowns (FUTURES · INDEX · FOREX ·
 *  METALS · CRYPTO · STOCK), a favourites pin row, and a recents trail.
 *  Design cues lifted from `components/execution-copilot/signal-terminal-
 *  header.tsx` and recoded into the VANTARY hairline editorial language.
 *
 *  The trader can:
 *    · pin / unpin instruments to a FAVOURITES strip
 *    · hide / show entire categories from the strip
 *    · auto-track the last N symbols viewed (recents)
 *  All three preferences persist via TdPersistedState below.
 * ──────────────────────────────────────────────────────────────────── */
export type TdSymbolCategory = TdSymbol["category"]

export const TD_CATEGORIES_ORDER: ReadonlyArray<TdSymbolCategory> = [
  "FUTURES",
  "INDEX",
  "FOREX",
  "METALS",
  "CRYPTO",
  "STOCK",
] as const

/** Short / long label pair per category. The short label drives the chip
 *  (limited horizontal real-estate in the navigator strip); the long
 *  label is used in the customize popover. */
export const TD_CATEGORY_LABELS: Record<TdSymbolCategory, { short: string; long: string }> = {
  FUTURES: { short: "FUTURES",    long: "Futures" },
  INDEX:   { short: "INDEX",      long: "Cash Indexes" },
  FOREX:   { short: "FX",         long: "Forex Pairs" },
  METALS:  { short: "METALS",     long: "Metals" },
  CRYPTO:  { short: "CRYPTO",     long: "Crypto" },
  STOCK:   { short: "STOCK",      long: "Stocks & ETFs" },
}

/** Returns every symbol in a category. Pure, memo-friendly. */
export function getSymbolsByCategory(cat: TdSymbolCategory): TdSymbol[] {
  return DEMO_SYMBOLS.filter(s => s.category === cat)
}

/** Per-symbol category counts — pre-computed for the customize popover
 *  badges so the popover never re-iterates the bank on every render. */
export const TD_CATEGORY_COUNTS: Record<TdSymbolCategory, number> =
  TD_CATEGORIES_ORDER.reduce((acc, cat) => {
    acc[cat] = getSymbolsByCategory(cat).length
    return acc
  }, {} as Record<TdSymbolCategory, number>)

/** How many recent symbols the navigator remembers. */
export const TD_RECENTS_LIMIT = 6

/* ─── 7.  PERSISTENCE ────────────────────────────────────────────────────
 *  We save the bay's state to localStorage so the layout survives a
 *  page reload. Versioned key — bumping the version invalidates old
 *  shapes cleanly. v2 added: sideSlotPosition, slotFavorites,
 *  slotPeekEnabled. v3 adds the deck-below-chart placement:
 *  deckOrder, deckHidden, deckViewMode, deckShortFields, deckMaxItems.
 *
 *  Migration policy:
 *  ─────────────────
 *  v3 hydration ALSO reads the v2 key as a one-shot fallback so
 *  upgrading users keep their existing layout / chip favourites /
 *  recents instead of being reset. After successful migration the
 *  v2 key is deleted. Field-by-field hydration is still permissive,
 *  so a future v4 bump that adds optional fields will not require a
 *  hard reset either. */
export const TD_STORAGE_KEY = "vantary.trading-desk.v3"

/** Legacy storage key from before deck state existed. Read by the
 *  provider's hydration step as a one-shot migration source when the
 *  v3 key is missing. Do not write to this key — it is read-and-
 *  delete-only. */
export const TD_STORAGE_KEY_LEGACY_V2 = "vantary.trading-desk.v2"

/** A single deck card's intrinsic display state — short = trader's
 *  curated subset of the module's short-field catalog (the resting,
 *  glance-able view); expanded = the module's full canvas. Persisted
 *  per-module so closing/reopening the deck restores the trader's
 *  exact reading state. */
export type TdDeckViewMode = "short" | "expanded"

export interface TdPersistedState {
  layout: TdLayoutMode
  /** TradingView width as a 0..1 fraction of the bay width (split mode). */
  tvWidthPct: number
  sideSlot: TdSideSlot
  /** Which edge the side slot hugs in split mode + which edge the peek
   *  strip lives on in chart-only mode. Default is "right". */
  sideSlotPosition: TdSideSlotPosition
  /** Quick-toggle module ids the trader has surfaced as chips in the
   *  header rail. The rest of the library lives in the customize
   *  popover. Defaults to TD_DEFAULT_FAVORITE_SLOTS. */
  slotFavorites: TdSideSlot[]
  /** When true (default), hovering the chart's slot edge in chart-only
   *  mode reveals a peek of the side slot. When false, the peek is
   *  disabled and chart-only is purely chart. */
  slotPeekEnabled: boolean
  /** Width in pixels of the peek panel that slides in from the chart's
   *  slot edge. Resizable by the trader via the draggable handle on the
   *  panel's chart-side edge. Clamped to TD_PEEK_PANEL_MIN/MAX_WIDTH. */
  peekPanelWidth: number
  symbolId: string
  intervalId: string
  /** Categories the trader has chosen to show in the navigator strip.
   *  Hiding a category does NOT remove instruments from the symbol bank
   *  or break deep-links — it only collapses the chip from the row. */
  navVisibleCategories: TdSymbolCategory[]
  /** Pinned instrument ids — render in a small "★" strip on the left of
   *  the navigator regardless of category visibility. */
  navFavorites: string[]
  /** Symbol ids the trader recently viewed, newest first, capped to
   *  TD_RECENTS_LIMIT. Surfaces under the navigator on hover. */
  navRecents: string[]

  /* ── DECK-BELOW-CHART (introduced in v3) ─────────────────────────
   *  The deck is the vertical stack of module cards under the chart.
   *  Five fields drive the trader's customization. The provider seeds
   *  meaningful defaults from the module registry at init time — the
   *  empty defaults below exist purely so this interface is sound for
   *  fresh sessions before the registry overlay runs. */

  /** Module ids in the order they appear in the deck (top → bottom).
   *  Includes hidden ids — visibility is a separate axis (see
   *  `deckHidden`). The registry provides the canonical default order
   *  via `MODULE_DEFAULT_DECK_ORDER`. */
  deckOrder: TdSideSlot[]
  /** Subset of `deckOrder` that the trader has hidden. Hidden ≠ absent
   *  — the card stays in the order list so un-hiding restores its
   *  position instead of dropping it back to the bottom. */
  deckHidden: TdSideSlot[]
  /** Per-module view-mode override. Missing keys default to "short".
   *  When the trader expands a card, we persist that choice so the
   *  next session opens with the same emphasis. */
  deckViewMode: Partial<Record<TdSideSlot, TdDeckViewMode>>
  /** Per-module short-field selection. Missing keys default to the
   *  module's `defaultShortFields` from the registry. The array is
   *  the trader's ordered subset of the module's short-field
   *  catalog — reconciled on hydration via
   *  `reconcileShortFields(id, persisted)` so a renamed/removed token
   *  in the registry can never poison persisted state. */
  deckShortFields: Partial<Record<TdSideSlot, string[]>>
  /** Per-module max-items count for list-mode modules
   *  (`supportsListMode` in the registry). Missing keys fall back to
   *  the module's `defaultMaxItems`. Reconciled on hydration via
   *  `reconcileMaxItems(id, persisted)` so the value is always within
   *  the module's declared range. */
  deckMaxItems: Partial<Record<TdSideSlot, number>>

  /* ── DUAL-DECK SPLITTER (introduced in v3.1) ─────────────────────
   *  LEFT-side fraction (0..1) for the LIVE EQUITY ⫴ ACTIVE WINDOWS
   *  vertical splitter at the top of the deck-below-chart region.
   *  Persisted across reloads. Default = 0.5 (exact 50/50). The
   *  provider clamps + magnetically snaps the value via
   *  `clampDualDeckRatio()` before committing — see
   *  `DUAL_DECK_RATIO_MIN/MAX/SNAP_POINTS` constants in provider.tsx
   *  for the canonical bounds and snap targets. */
  dualDeckRatio: number
}

/* The hard defaults — applied when nothing is in localStorage or the
 * persisted shape doesn't match.
 *
 * Note on the deck fields: the registry (`./modules/registry.ts`)
 * defines the canonical defaults via `MODULE_DEFAULT_DECK_ORDER` /
 * `MODULE_DEFAULT_DECK_HIDDEN` / `getModuleById(id).defaultShortFields`
 * / `getModuleById(id).defaultMaxItems`. We deliberately leave the
 * deck fields below as empty literals here to avoid a circular
 * import (data.ts ⇄ registry.ts). The provider's `INITIAL_STATE`
 * overlays the registry defaults at init time, and the HYDRATE
 * reducer case heals empty/missing deck fields against the registry
 * on every load. The single source of truth for deck defaults is
 * the registry; this file only declares the *shape*. */
export const TD_DEFAULTS: TdPersistedState = {
  layout:           "split",
  tvWidthPct:       0.62,
  sideSlot:         "ai-copilot",
  sideSlotPosition: "right",
  slotFavorites:    [...TD_DEFAULT_FAVORITE_SLOTS],
  slotPeekEnabled:  true,
  // Splitter ratio default — 50/50 between LIVE EQUITY and ACTIVE WINDOWS.
  // The clamp/snap helper lives in provider.tsx but its DEFAULT is
  // duplicated here as a literal to avoid a circular import.
  dualDeckRatio:    0.5,
  // Default peek-panel pixel width. Inlined here as a literal because
  // TD_PEEK_PANEL_WIDTH is declared below this block (section 8) and
  // referencing it here would trip a temporal-dead-zone error at
  // module init. Keep this value in sync with TD_PEEK_PANEL_WIDTH.
  peekPanelWidth:   380,
  symbolId:         DEFAULT_SYMBOL_ID,
  intervalId:       DEFAULT_INTERVAL_ID,
  // All categories visible by default — trader can hide via customize popover.
  navVisibleCategories: [...TD_CATEGORIES_ORDER],
  // Two sensible defaults so the favourites strip never reads empty on
  // first load (one FX pair, one crypto). User can unpin freely.
  navFavorites: ["eurusd", "btcusdt"],
  navRecents:   [],
  // Deck fields — see the note above. Empty here, registry-seeded by
  // the provider.
  deckOrder:       [],
  deckHidden:      [],
  deckViewMode:    {},
  deckShortFields: {},
  deckMaxItems:    {},
}

/* Resize bounds for the vertical drag handle, expressed as fractions
 * of the bay width. The trader can drag from 30% (mostly side slot) to
 * 80% (mostly chart). */
export const TD_RESIZE_MIN = 0.3
export const TD_RESIZE_MAX = 0.8

/* Snap points the handle gravitates toward when dragging is released
 * within ±2 percentage points of any of these values. */
export const TD_RESIZE_SNAPS: ReadonlyArray<number> = [0.33, 0.5, 0.6, 0.66, 0.75]

/* Bay heights per layout mode (in px). These are now used only as the
 * **fallback** intrinsic heights — the runtime height is computed by
 * `useViewportBayHeight` in `shell.tsx`, which always returns
 * `window.innerHeight − TD_VIEWPORT_PADDING` on desktop. The intrinsic
 * values are kept large enough to avoid any "the bay is shorter than
 * the viewport" sensation if the hook somehow returns its fallback
 * (e.g. SSR pre-mount). They also serve as the authoritative size in
 * fullscreen mode (since fullscreen takes over the viewport itself). */
export const TD_HEIGHTS: Record<TdLayoutMode, number> = {
  split:        820,
  stacked:      960,
  "chart-only": 820,
  minimized:    36,    // single-line hairline collapse — unchanged
}

/* Lower-bound height — even on tiny viewports the bay never goes below
 * this. Below this point the chart becomes too cramped to be useful. */
export const TD_HEIGHT_MIN = 520

/* Pixels of vertical chrome the bay needs to leave for the page above
 * (top dashboard nav + Jarvis welcome band) and a small breathing gap
 * below. `useViewportBayHeight` returns `vh - TD_VIEWPORT_PADDING` so
 * the bay matches the signal terminal page's `h-full` chart pane: the
 * chart actually fills the viewport from "just below the dashboard
 * header" all the way down to "just before the next section". */
export const TD_VIEWPORT_PADDING = 160

/* Snap helper — pulls a value toward the closest snap point if within
 * the threshold. Pure function, deterministic. */
export function snapResize(pct: number, threshold = 0.02): number {
  for (const snap of TD_RESIZE_SNAPS) {
    if (Math.abs(pct - snap) <= threshold) return snap
  }
  return pct
}

/* Clamp helper bounded to TD_RESIZE_MIN/MAX. */
export function clampResize(pct: number): number {
  if (pct < TD_RESIZE_MIN) return TD_RESIZE_MIN
  if (pct > TD_RESIZE_MAX) return TD_RESIZE_MAX
  return pct
}

/* ─── 8.  GUTTER + PEEK CONSTANTS ──────────────���────────────────────────
 *  Visual breathing-room around TradingView. The chart is the trader's
 *  anchor — small horizontal padding on either side prevents it from
 *  reading as flush-glued to the page edges or to the side slot border.
 *  Values are intentionally small (8-10px) so we don't waste real
 *  estate. */
export const TD_CHART_GUTTER_X    = 10  // left/right padding around TradingView (split + chart-only)
export const TD_CHART_GUTTER_Y    = 6   // top/bottom padding around TradingView
/* Width of the always-visible peek strip on the chart's slot edge in
 * chart-only mode (the trader hovers it to expand the side slot). */
export const TD_PEEK_STRIP_WIDTH  = 6
/* Default width of the side slot that slides out on peek hover.
 * Overridden per-trader via the draggable resize handle on the panel's
 * chart-side edge. The clamped runtime value lives at state.peekPanelWidth. */
export const TD_PEEK_PANEL_WIDTH      = 380
/* Resize bounds for the peek panel — small enough to read 2 lines of
 * a register row at min, generous enough at max so the trader can
 * effectively use it as a half-screen workspace. */
export const TD_PEEK_PANEL_MIN_WIDTH  = 260
export const TD_PEEK_PANEL_MAX_WIDTH  = 720
/* How long after pointer leaves the peek panel before it auto-collapses. */
export const TD_PEEK_GRACE_MS         = 220

/* Clamp helper for the peek panel width — bounded by MIN/MAX above. */
export function clampPeekPanelWidth(px: number): number {
  if (!Number.isFinite(px)) return TD_PEEK_PANEL_WIDTH
  if (px < TD_PEEK_PANEL_MIN_WIDTH) return TD_PEEK_PANEL_MIN_WIDTH
  if (px > TD_PEEK_PANEL_MAX_WIDTH) return TD_PEEK_PANEL_MAX_WIDTH
  return Math.round(px)
}

/* ─── 9.  LAYOUT PRESETS ────────────────────────────────────────────────
 *  Hand-crafted one-click configurations the trader can apply from the
 *  customize popover. Each preset writes to the parts of state it cares
 *  about and leaves everything else alone. */
export interface TdLayoutPreset {
  id:           string
  label:        string
  description:  string
  /** Patch applied to state when the preset is activated. */
  apply: Partial<Pick<TdPersistedState,
    | "layout"
    | "tvWidthPct"
    | "sideSlotPosition"
    | "slotPeekEnabled"
  >>
}

export const TD_LAYOUT_PRESETS: ReadonlyArray<TdLayoutPreset> = [
  {
    id:          "focus",
    label:       "FOCUS · CHART ONLY",
    description: "Hide the side panel. Hover the edge to peek.",
    apply: { layout: "chart-only", slotPeekEnabled: true },
  },
  {
    id:          "split-60-40",
    label:       "SPLIT · 60 / 40",
    description: "Default. Chart leads, side panel supports.",
    apply: { layout: "split", tvWidthPct: 0.6 },
  },
  {
    id:          "split-50-50",
    label:       "SPLIT · 50 / 50",
    description: "Half chart, half side panel.",
    apply: { layout: "split", tvWidthPct: 0.5 },
  },
  {
    id:          "split-70-30",
    label:       "SPLIT · 70 / 30",
    description: "Mostly chart with a slim companion strip.",
    apply: { layout: "split", tvWidthPct: 0.7 },
  },
  {
    id:          "side-left",
    label:       "PANEL · LEFT",
    description: "Side panel hugs the left edge of the chart.",
    apply: { sideSlotPosition: "left" },
  },
  {
    id:          "side-right",
    label:       "PANEL · RIGHT",
    description: "Side panel hugs the right edge of the chart.",
    apply: { sideSlotPosition: "right" },
  },
] as const
