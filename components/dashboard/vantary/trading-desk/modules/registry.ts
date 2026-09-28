/* ═══════════════════════════════════════════════════════════════════════════
 *  TRADING DESK · MODULE REGISTRY
 *  ─────────────────────────────────────────────────────────────────────────
 *  THE SPINE.
 *
 *  This file is the ONE canonical declaration of what a "module" is on the
 *  Vantary Trading Desk. Every surface that renders modules — the header
 *  chip rail, the split-side panel, the deck below the chart, and the
 *  upcoming flight-deck overlay — reads from this registry. Adding a new
 *  capability to the platform should mean *one entry here*, nothing else.
 *
 *  WHY THIS FILE EXISTS
 *  ────────────────────
 *  Before this registry, each placement (chip rail / split / deck / flight-
 *  deck) re-implemented its own catalog: which modules are available, what
 *  they show in compact form, what they show expanded, whether they're
 *  ready or coming-soon. That fragmentation is what we are unwiring with
 *  this layer. From here forward:
 *
 *    · The registry declares what modules exist and what they can show.
 *    · A *placement* (chip rail, split, deck, flight-deck) declares which
 *      registry entries it shows, in what order, and which subset of each
 *      module's short-field catalog the trader has chosen to surface.
 *    · The trader's choices live in the provider, persisted to local-
 *      storage. The registry itself is static — it is the *grammar*; the
 *      provider is the *sentence*.
 *
 *  RELATIONSHIP TO ./data.ts
 *  ─────────────────────────
 *  The existing `TdSideSlot` union in data.ts already defines the ten
 *  canonical module ids. We REUSE that union as `ModuleId` so we do not
 *  fork the type system. This file *extends* each id with the four pieces
 *  of metadata that data.ts intentionally left out (because data.ts was
 *  scoped to side-slot mechanics, not the broader module system):
 *
 *    1. CATEGORY            — performance / market / intelligence / social
 *    2. PLACEMENT ELIGIBILITY — which surfaces a module can live on
 *    3. SHORT-FIELD CATALOG  — the named tokens the trader can pick from
 *    4. DEFAULT SHORT VIEW   — the curated initial subset
 *
 *  Adding category (5) `analyze`, `forecast`, `community-search` — i.e.,
 *  the future modules that don't exist today as side-slot variants — is
 *  intentionally NOT done in this layer. Layer 1.1 freezes the spine for
 *  the modules that exist today; Milestone 3 / 5 / 6 each add their own
 *  registry entry by extending `ModuleId` then. Doing it now would force
 *  us to declare short-field catalogs for code we haven't written, which
 *  is the exact mistake this registry is meant to prevent.
 *
 *  THE SHORT-FIELD CONTRACT (the most important idea in this file)
 *  ───────────────────────────────────────────────────────────────
 *  Every module declares a CATALOG of named field tokens — e.g. Live
 *  Equity exposes  ['sparkline', 'today-pnl-usd', 'today-pnl-pct',
 *  'week-pnl-usd', ...]. The trader's "short view" is an *ordered subset*
 *  of those tokens. This is what makes the configuration drawer feel like
 *  a real control surface and not a free-text field: the trader is
 *  choosing instruments from a fixed cockpit, not typing into a textarea.
 *
 *  A field token is a stable string id. Renaming a token would break
 *  persisted trader configs, so once a token ships in main, it is
 *  effectively forever. Add new tokens by appending; deprecate by
 *  removing from defaults but keeping in the catalog (with a `deprecated`
 *  flag) so legacy persisted choices still resolve.
 *
 *  Pure data only — no React, no DOM access, no side effects. Every
 *  exported value is `as const` so callers can pattern-match on string
 *  literal types. Tree-shakable. Unit-testable.
 * ═══════════════════════════════════════════════════════════════════════ */

import type { TdSideSlot } from "../data"

/* ─── 1.  ID ALIAS ──────────────────────────────────────────────────────
 *  We REUSE TdSideSlot as the module id. Future modules added in
 *  Milestone 3+ will extend this alias (likely by widening TdSideSlot
 *  itself in data.ts so there is still ONE source of truth for module
 *  ids in the entire codebase). Keep this alias narrow on purpose — it
 *  forces every new id to be declared in data.ts first, which is the
 *  right ordering: data first, behaviour second. */
export type ModuleId = TdSideSlot

/* ─── 2.  PLACEMENT TAXONOMY ────────────────────────────────────────────
 *  Where a module instance can be rendered. A placement is *not* a layout
 *  mode — it is a surface inside the trading desk that holds module
 *  instances. The four canonical placements:
 *
 *    header-chip   — Quick-toggle chip in the bay header rail. Width is
 *                    a single chip (~110px), height is one row. Used as
 *                    a one-glance promotion of the trader's most-used
 *                    modules. Maps to the existing `slotFavorites`
 *                    array in TdPersistedState.
 *
 *    split-panel   — The companion pane next to TradingView in `split`
 *                    layout, OR the slide-out peek panel in `chart-only`
 *                    layout. Width is variable (260px → 720px clamped
 *                    by `peekPanelWidth`). Maps to the existing
 *                    `sideSlot` field plus the upcoming `splitShortFields`
 *                    map (introduced in Layer 1.2).
 *
 *    deck          — The vertical stack BELOW the chart. Full bay width,
 *                    each card sized by its content. This is the new
 *                    placement Layer 1.4 introduces. Maps to the new
 *                    `deckOrder` / `deckHidden` / `deckShortFields`
 *                    state added in Layer 1.2.
 *
 *    flight-deck   — The overlay that slides down OVER the chart when
 *                    the trader invokes Analyze / Forecast / Community-
 *                    Search from the Ask bar. Built in Milestone 4.
 *                    Maps to the upcoming `flightDeckRoute` state.
 *
 *  Every module declares which placements it supports. Default rule:
 *  most modules support all four. Exceptions exist (see notes on each
 *  entry) where the module's intrinsic shape conflicts with a placement
 *  — e.g., a 12-row table cannot meaningfully live as a header chip. */
export type ModulePlacement =
  | "header-chip"
  | "split-panel"
  | "deck"
  | "flight-deck"

export const MODULE_PLACEMENTS_ORDER: ReadonlyArray<ModulePlacement> = [
  "header-chip",
  "split-panel",
  "deck",
  "flight-deck",
] as const

export const MODULE_PLACEMENT_LABELS: Record<ModulePlacement, { short: string; long: string; hint: string }> = {
  "header-chip":  { short: "CHIP",   long: "Header chip rail",     hint: "One-glance promotion in the bay header." },
  "split-panel":  { short: "PANEL",  long: "Split / peek panel",   hint: "Companion pane next to the chart." },
  "deck":         { short: "DECK",   long: "Deck below chart",     hint: "Vertical stack below the chart." },
  "flight-deck":  { short: "DECK ↑", long: "Flight-deck overlay",  hint: "Slides down over the chart on demand." },
}

/* ─── 3.  CATEGORY TAXONOMY ─────────────────────────────────────────────
 *  Modules group into four categories. The category drives:
 *    · the section heading in the customize popover's MODULES tab
 *    · the colour role hint for the module's accent rail
 *    · the default sort order when the trader hits "reset to defaults"
 *
 *    performance  — about THE TRADER. Their account, their open trades,
 *                   their PnL, their risk usage. The most-glanced-at
 *                   numbers on the desk. Default-favourited modules
 *                   live here.
 *
 *    market       — about THE WORLD. Watchlist, movers, news, calendar.
 *                   Reference data the trader scans periodically.
 *
 *    intelligence — about WHAT TO DO NEXT. AI Copilot, Signal Terminal,
 *                   Analyze (MTF / session / liquidity), Forecast.
 *                   Heavy modules — usually live in deck or flight-deck,
 *                   rarely in a chip.
 *
 *    social       — about OTHER TRADERS. Community search, mentor feed,
 *                   shared playbooks. Lighter weight than intelligence;
 *                   typically discovery-driven via the Ask bar. */
export type ModuleCategory = "performance" | "market" | "intelligence" | "social"

export const MODULE_CATEGORIES_ORDER: ReadonlyArray<ModuleCategory> = [
  "performance",
  "market",
  "intelligence",
  "social",
] as const

export const MODULE_CATEGORY_LABELS: Record<ModuleCategory, { short: string; long: string; description: string }> = {
  performance:  { short: "PERFORMANCE",  long: "Your Performance",    description: "Your account, trades, PnL, risk." },
  market:       { short: "MARKET",       long: "The Market",           description: "Watchlist, movers, news, calendar." },
  intelligence: { short: "INTELLIGENCE", long: "Decision Intelligence", description: "AI, signals, analyze, forecast." },
  social:       { short: "SOCIAL",       long: "Community",            description: "Other traders, playbooks, search." },
}

/* ─── 4.  READINESS TAXONOMY ────────────────────────────────────────────
 *  Three states. The customize popover renders a small badge for each:
 *
 *    ready    — fully implemented. The trader's interaction is real.
 *    beta     — partially implemented. Renders a working surface but
 *               some fields are placeholders. Badge says "BETA".
 *    planned  — placeholder shell only. Renders a "COMING SOON" card
 *               with a meaningful preview of what will land. The trader
 *               can still pin it so they're ready when it ships. */
export type ModuleReadiness = "ready" | "beta" | "planned"

export const MODULE_READINESS_LABELS: Record<ModuleReadiness, string> = {
  ready:   "READY",
  beta:    "BETA",
  planned: "SOON",
}

/* ─── 5.  FIELD UNIT + WEIGHT TAXONOMY ──────────────────────────────────
 *  Every short-field declares a UNIT (so the renderer knows how to
 *  format the value — `$1,247` vs `+5.4%` vs `+1.4R`) and a WEIGHT (so
 *  the renderer knows the typographic hierarchy — protagonist numerals
 *  use the display cut, principals use sans-bold tabular, details use
 *  the small mono rail).
 *
 *  These are *hints* to the renderer, not rules. A given placement may
 *  override the weight (e.g. a header chip is so small that everything
 *  is rendered as `detail` regardless of declared weight). */
export type FieldUnit =
  | "usd"        // $1,247 / -$184
  | "pct"        // +5.4% / -2.11%
  | "r"          // +1.4R
  | "ratio"      // 0.62 / 1.18
  | "count"      // 12 / 96
  | "time"       // 08:14 UTC / 132m
  | "label"      // unit-less short string ("LONG" / "EUR/USD")
  | "spark"      // sparkline series (renderer draws a thin chart)
  | "bar"        // single horizontal bar (capacity / progress)
  | "mix"        // composite — renderer-specific shape

export type FieldWeight =
  | "protagonist"   // hero numeral (display cut, oversized)
  | "principal"     // sans-bold tabular numeral
  | "detail"        // small mono telemetry text

export interface ModuleField {
  /** Stable token. Once shipped, immutable forever. */
  id:           string
  /** Short label rendered above the value (eyebrow). ≤10 chars. */
  label:        string
  /** What this field shows — used as a tooltip in the configure drawer. */
  description:  string
  unit:         FieldUnit
  weight:       FieldWeight
  /** Sign-aware: when true, the renderer applies a +/- colour role
   *  (green for positive, red for negative). Default `false`. */
  signed?:      boolean
  /** Marked deprecated — kept in the catalog so persisted trader
   *  choices still resolve, but hidden from the configure drawer's
   *  "available" list. */
  deprecated?:  boolean
}

/* ─── 6.  MODULE ENTRY SHAPE ────────────────────────────────────────────
 *  The full declaration for one module. Every field is required except
 *  the list-mode triplet (`supportsListMode`, `defaultMaxItems`,
 *  `maxItemsRange`) which only matters for modules that render a list
 *  of rows in their short view (active-windows, watchlist, news). */
export interface ModuleEntry {
  /** Canonical id — see ModuleId. */
  id:                 ModuleId
  /** Long label rendered as the card eyebrow. */
  label:              string
  /** Short label (≤7 chars) for chip-rail placements. */
  shortLabel:         string
  /** One-line description rendered as the card subtitle and as the
   *  customize popover hover hint. */
  description:        string
  category:           ModuleCategory
  readiness:          ModuleReadiness
  /** Which placements this module can live on. Order does not matter. */
  placements:         ReadonlyArray<ModulePlacement>
  /** Every field this module knows how to render in short form. The
   *  trader's "short view" is an ordered subset of these ids. */
  shortFieldCatalog:  ReadonlyArray<ModuleField>
  /** The curated initial short view — ordered subset of catalog ids.
   *  Picked to read well at the smallest placement (header chip). */
  defaultShortFields: ReadonlyArray<string>
  /** The trader can never reduce their short view below this count
   *  (otherwise the card would render empty and feel broken). */
  shortFieldMin:      number
  /** Upper bound for the short view. Beyond this the card stops being
   *  "short" and the trader should expand instead. */
  shortFieldMax:      number
  /** When true, the short view renders a list of rows (one per item)
   *  and the configure drawer surfaces a "max items" stepper. */
  supportsListMode?:  boolean
  /** Default rows shown in list-mode short view. */
  defaultMaxItems?:   number
  /** [min, max] inclusive range for the max-items stepper. */
  maxItemsRange?:     readonly [number, number]
  /** lucide-react icon name. Used by the card header strip. */
  iconHint:           string
  /** The colour role of this module's accent rail. The actual hex/HSL
   *  is theme-provided (see theme-system.ts) — this is just the
   *  semantic role:
   *    'green' = profit / go / online
   *    'red'   = loss / stop / alert
   *    'amber' = attention / pending / hold
   *    'cyan'  = neutral telemetry / live data
   *    'plain' = no accent (let the theme's base-on-canvas decide). */
  accentRole?:        "green" | "red" | "amber" | "cyan" | "plain"
}

/* ═══════════════════════════════════════════════════════════════════════
 *  THE REGISTRY
 *  ─────────────────────────────────────────────────────────────────────
 *  Ten module entries. Order in this array is the canonical default
 *  display order — it is what `deckOrder` / `slotFavorites` initialize
 *  to when the trader has never customized anything. The trader's
 *  customizations override this; "reset to defaults" restores it.
 *
 *  Editing rules:
 *    · NEVER rename a field id once shipped (breaks persisted configs).
 *    · NEVER remove a field from the catalog — mark it deprecated.
 *    · APPEND new fields to the end of a catalog, not the middle.
 *    · KEEP defaultShortFields ordered for visual reading order in the
 *      card (left-to-right, top-to-bottom).
 * ═══════════════════════════════════════════════════════════════════════ */

export const MODULE_REGISTRY: ReadonlyArray<ModuleEntry> = [

  /* ─────────────────────────────────────────────────────────────────────
   *  ACTIVE WINDOWS
   *  Live list of open trades. The trader's "what am I in right now?"
   *  glance. Lives everywhere — chip, split, deck, flight-deck — because
   *  knowing your open positions is the most fundamental piece of state
   *  on a trading desk.
   *
   *  Default short view shows the four numbers a trader scans first:
   *  symbol (anchor), side (direction), live PnL in USD, R-multiple.
   *  Everything else (entry, current, size, time) is one click away in
   *  expanded view.
   * ─────────────────────────────────────────────────────────────────── */
  {
    id:           "active-windows",
    label:        "ACTIVE WINDOWS",
    shortLabel:   "ACTIVE",
    description:  "Currently open trades · live PnL and R per row.",
    category:     "performance",
    readiness:    "ready",
    placements:   ["header-chip", "split-panel", "deck", "flight-deck"],
    iconHint:     "LayoutList",
    accentRole:   "green",
    supportsListMode:  true,
    defaultMaxItems:   3,
    maxItemsRange:     [2, 8] as const,
    shortFieldCatalog: [
      { id: "symbol",       label: "SYMBOL",   description: "Instrument ticker.",                unit: "label",  weight: "principal" },
      { id: "side",         label: "SIDE",     description: "LONG or SHORT direction.",          unit: "label",  weight: "detail" },
      { id: "pnl-usd",      label: "PNL",      description: "Unrealised PnL in USD.",            unit: "usd",    weight: "principal", signed: true },
      { id: "pnl-r",        label: "R",        description: "Unrealised PnL as R-multiple.",    unit: "r",      weight: "principal", signed: true },
      { id: "entry",        label: "ENTRY",    description: "Entry price.",                       unit: "ratio",  weight: "detail" },
      { id: "current",      label: "MARK",     description: "Current mark price.",                unit: "ratio",  weight: "detail" },
      { id: "size",         label: "SIZE",     description: "Position size in lots / contracts.", unit: "ratio",  weight: "detail" },
      { id: "duration",     label: "TIME IN",  description: "Minutes since entry.",               unit: "time",   weight: "detail" },
      { id: "opened-at",    label: "OPENED",   description: "Entry time (UTC).",                  unit: "time",   weight: "detail" },
      { id: "distance-tp",  label: "→ TP",     description: "Distance to take-profit.",           unit: "ratio",  weight: "detail" },
      { id: "distance-sl",  label: "→ SL",     description: "Distance to stop-loss.",             unit: "ratio",  weight: "detail" },
    ],
    defaultShortFields: ["symbol", "side", "pnl-usd", "pnl-r"],
    shortFieldMin: 2,
    shortFieldMax: 6,
  },

  /* ─────────────────────────────────────────────────────────────────────
   *  LIVE EQUITY
   *  The equity curve plus the four PnL anchor numbers. The "how am I
   *  doing" glance.
   *
   *  Default short view leads with a sparkline (the most expressive
   *  single-glance instrument on the desk) and three anchor numbers:
   *  today, this week, best day. Worst day, drawdown, and Sharpe live
   *  in expanded view — the trader doesn't need them at-a-glance, only
   *  when reviewing.
   * ─────────────────────────────────────────────────────────────────── */
  {
    id:           "live-equity",
    label:        "LIVE EQUITY VOLUME",
    shortLabel:   "EQUITY",
    description:  "Equity curve · today / week / best / worst PnL.",
    category:     "performance",
    readiness:    "ready",
    placements:   ["header-chip", "split-panel", "deck", "flight-deck"],
    iconHint:     "LineChart",
    accentRole:   "green",
    shortFieldCatalog: [
      { id: "sparkline",       label: "CURVE",    description: "24h equity curve sparkline.",          unit: "spark",  weight: "protagonist" },
      { id: "current-equity",  label: "EQUITY",   description: "Current account equity (USD).",        unit: "usd",    weight: "protagonist" },
      { id: "today-pnl-usd",   label: "TODAY",    description: "Today's PnL in USD.",                  unit: "usd",    weight: "principal", signed: true },
      { id: "today-pnl-pct",   label: "TODAY %",  description: "Today's PnL as percent of equity.",    unit: "pct",    weight: "detail",    signed: true },
      { id: "week-pnl-usd",    label: "WEEK",     description: "This week's PnL in USD.",              unit: "usd",    weight: "principal", signed: true },
      { id: "week-pnl-pct",    label: "WEEK %",   description: "This week's PnL as percent.",          unit: "pct",    weight: "detail",    signed: true },
      { id: "best-day",        label: "BEST",     description: "Best single-day PnL (rolling 30d).",   unit: "usd",    weight: "detail",    signed: true },
      { id: "worst-day",       label: "WORST",    description: "Worst single-day PnL (rolling 30d).",  unit: "usd",    weight: "detail",    signed: true },
      { id: "current-streak",  label: "STREAK",   description: "Consecutive winning / losing days.",   unit: "count",  weight: "detail",    signed: true },
      { id: "drawdown",        label: "DRAWDOWN", description: "Max drawdown from peak (rolling 30d).",unit: "pct",    weight: "detail" },
      { id: "sharpe",          label: "SHARPE",   description: "Sharpe ratio (rolling 30d).",          unit: "ratio",  weight: "detail" },
    ],
    defaultShortFields: ["sparkline", "today-pnl-usd", "week-pnl-usd", "best-day"],
    shortFieldMin: 2,
    shortFieldMax: 6,
  },

  /* ─────────────────────────────────────────────────────────────────────
   *  ACCOUNT & ASSETS
   *  Account balance + margin + asset mix. The "what's the shape of my
   *  account right now" glance.
   *
   *  Default short view shows balance, free margin, and daily ROI —
   *  the three numbers a discretionary trader checks before sizing the
   *  next trade. Asset-mix is a composite renderer (a thin horizontal
   *  bar showing FX / metals / crypto / cash split) and is opt-in
   *  because not every trader cares about cross-asset breakdown.
   * ─────────────────────────────────────────────────────────────────── */
  {
    id:           "account-asset",
    label:        "ACCOUNT & ASSETS",
    shortLabel:   "ACCOUNT",
    description:  "Balance · margin · asset mix · daily ROI.",
    category:     "performance",
    readiness:    "ready",
    placements:   ["header-chip", "split-panel", "deck", "flight-deck"],
    iconHint:     "Wallet",
    accentRole:   "cyan",
    shortFieldCatalog: [
      { id: "balance",      label: "BALANCE",   description: "Account balance (USD).",                    unit: "usd",    weight: "protagonist" },
      { id: "equity",       label: "EQUITY",    description: "Account equity (balance + open PnL).",      unit: "usd",    weight: "principal" },
      { id: "margin-used",  label: "MARGIN",    description: "Margin currently in use (USD).",            unit: "usd",    weight: "detail" },
      { id: "margin-free",  label: "FREE",      description: "Free margin available (USD).",              unit: "usd",    weight: "principal" },
      { id: "leverage",     label: "LEVERAGE",  description: "Effective leverage on open positions.",     unit: "ratio",  weight: "detail" },
      { id: "daily-roi",    label: "DAILY ROI", description: "Today's PnL as percent of starting equity.",unit: "pct",    weight: "principal", signed: true },
      { id: "asset-mix",    label: "MIX",       description: "Allocation across FX / metals / crypto / cash.", unit: "mix", weight: "detail" },
      { id: "buying-power", label: "BP",        description: "Notional buying power.",                    unit: "usd",    weight: "detail" },
    ],
    defaultShortFields: ["balance", "margin-free", "daily-roi"],
    shortFieldMin: 2,
    shortFieldMax: 5,
  },

  /* ─────────────────────────────────────────────────────────────────────
   *  PAIRS YOU TRADE
   *  Per-instrument performance ledger. The "which pairs am I actually
   *  good at" glance.
   *
   *  Default short view is a list (3 rows): pair / win-rate / total PnL.
   *  This module is used to nudge the trader toward their edge —
   *  rendering it as a chip is allowed but compresses the list to
   *  a single "best pair" callout.
   * ─────────────────────────────────────────────────────────────────── */
  {
    id:           "pairs-you-trade",
    label:        "PAIRS YOU TRADE",
    shortLabel:   "PAIRS",
    description:  "Per-instrument win-rate, average R, and total PnL.",
    category:     "performance",
    readiness:    "ready",
    placements:   ["header-chip", "split-panel", "deck", "flight-deck"],
    iconHint:     "GitBranch",
    accentRole:   "plain",
    supportsListMode:  true,
    defaultMaxItems:   3,
    maxItemsRange:     [1, 6] as const,
    shortFieldCatalog: [
      { id: "pair",             label: "PAIR",     description: "Instrument ticker.",                          unit: "label",  weight: "principal" },
      { id: "win-rate",         label: "WIN %",    description: "Win-rate over the last 90 sessions.",         unit: "pct",    weight: "principal" },
      { id: "avg-r",            label: "AVG R",    description: "Average R-multiple per trade (90 sessions).", unit: "r",      weight: "detail",    signed: true },
      { id: "total-pnl",        label: "TOTAL",    description: "Total PnL over the last 90 sessions.",         unit: "usd",    weight: "principal", signed: true },
      { id: "sessions-traded",  label: "N",        description: "Number of trades in the lookback window.",    unit: "count",  weight: "detail" },
      { id: "last-traded",      label: "LAST",     description: "How long since the last trade on this pair.", unit: "time",   weight: "detail" },
      { id: "expectancy",       label: "EXP",      description: "Expectancy per trade (USD).",                 unit: "usd",    weight: "detail",    signed: true },
    ],
    defaultShortFields: ["pair", "win-rate", "total-pnl"],
    shortFieldMin: 2,
    shortFieldMax: 5,
  },

  /* ─────────────────────────────────────────────────────────────────────
   *  PENDING ORDERS
   *  Resting limit / stop orders waiting to fill. Today this is a
   *  planned shell — the trader can pin it now and the wired version
   *  lands in a later epic.
   * ─────────────────────────────────────────────────────────────────── */
  {
    id:           "pending-orders",
    label:        "PENDING ORDERS",
    shortLabel:   "PENDING",
    description:  "Resting limit / stop / OCO orders waiting to fill.",
    category:     "performance",
    readiness:    "planned",
    placements:   ["header-chip", "split-panel", "deck", "flight-deck"],
    iconHint:     "Hourglass",
    accentRole:   "amber",
    supportsListMode:  true,
    defaultMaxItems:   3,
    maxItemsRange:     [2, 8] as const,
    shortFieldCatalog: [
      { id: "symbol",     label: "SYMBOL",   description: "Instrument the order is on.",                 unit: "label",  weight: "principal" },
      { id: "type",       label: "TYPE",     description: "Order type — LIMIT / STOP / OCO.",            unit: "label",  weight: "detail" },
      { id: "side",       label: "SIDE",     description: "BUY or SELL.",                                unit: "label",  weight: "detail" },
      { id: "price",      label: "PRICE",    description: "Order price level.",                           unit: "ratio",  weight: "principal" },
      { id: "distance",   label: "→ MKT",    description: "Distance from current market.",               unit: "pct",    weight: "principal", signed: true },
      { id: "size",       label: "SIZE",     description: "Order size in lots / contracts.",             unit: "ratio",  weight: "detail" },
      { id: "expires",    label: "EXPIRES",  description: "Time until the order expires (GTC / GTD).",   unit: "time",   weight: "detail" },
    ],
    defaultShortFields: ["symbol", "type", "price", "distance"],
    shortFieldMin: 2,
    shortFieldMax: 5,
  },

  /* ─────────────────────────────────────────────────────────────────────
   *  RISK METER
   *  Real-time exposure + value-at-risk + correlation cluster heat.
   *  Planned — the math needs the position service in place first.
   * ─────────────────────────────────────────────────────────────────── */
  {
    id:           "risk-meter",
    label:        "RISK METER",
    shortLabel:   "RISK",
    description:  "Live exposure · 1-day VaR · correlation heat.",
    category:     "performance",
    readiness:    "planned",
    /* No header-chip placement — the canonical risk reading is a
     * horizontal bar that doesn't compress to a single chip without
     * losing meaning. Lives in panel / deck / flight-deck. */
    placements:   ["split-panel", "deck", "flight-deck"],
    iconHint:     "Gauge",
    accentRole:   "amber",
    shortFieldCatalog: [
      { id: "exposure-pct",      label: "EXPOSURE",  description: "Net notional exposure as % of equity.",     unit: "pct",    weight: "protagonist" },
      { id: "var-1d",            label: "1D VAR",    description: "1-day Value-at-Risk at 95% confidence.",   unit: "usd",    weight: "principal" },
      { id: "current-risk-r",    label: "RISK ON",   description: "Total open risk in R across all positions.",unit: "r",      weight: "principal" },
      { id: "max-loss-allowed",  label: "MAX LOSS",  description: "Per-trader max-loss cap (USD).",            unit: "usd",    weight: "detail" },
      { id: "correlation-heat",  label: "CLUSTER",   description: "Highest-correlation cluster strength.",    unit: "ratio",  weight: "detail" },
      { id: "kelly-suggest",     label: "KELLY",     description: "Suggested Kelly-optimal next position size.",unit: "pct",  weight: "detail" },
      { id: "exposure-bar",      label: "USAGE",     description: "Visual bar of exposure vs. cap.",            unit: "bar",    weight: "principal" },
    ],
    defaultShortFields: ["exposure-bar", "current-risk-r", "max-loss-allowed"],
    shortFieldMin: 2,
    shortFieldMax: 5,
  },

  /* ─────────────────────────────────────────────────────────────────────
   *  DAILY MAX
   *  Daily-loss budget tracker. Hard rail against revenge trading.
   *  Planned shell — wired version lands with the risk service.
   * ─────────────────────────────────────────────────────────────────── */
  {
    id:           "daily-max",
    label:        "DAILY MAX",
    shortLabel:   "MAX",
    description:  "Daily-loss budget · used today · time until reset.",
    category:     "performance",
    readiness:    "planned",
    placements:   ["header-chip", "split-panel", "deck", "flight-deck"],
    iconHint:     "ShieldAlert",
    accentRole:   "red",
    shortFieldCatalog: [
      { id: "max-loss-budget",  label: "BUDGET",  description: "Daily-loss budget cap (USD).",              unit: "usd",    weight: "principal" },
      { id: "used-today",       label: "USED",    description: "Loss budget consumed today (USD).",         unit: "usd",    weight: "protagonist", signed: true },
      { id: "remaining",        label: "LEFT",    description: "Budget remaining before lockout (USD).",     unit: "usd",    weight: "principal" },
      { id: "usage-bar",        label: "BAR",     description: "Visual bar of used vs. budget.",             unit: "bar",    weight: "principal" },
      { id: "time-to-reset",    label: "RESET",   description: "Time until daily counter resets (00:00 UTC).",unit: "time",  weight: "detail" },
      { id: "hit-streak",       label: "STREAK",  description: "Days since last budget breach.",            unit: "count",  weight: "detail" },
    ],
    defaultShortFields: ["used-today", "remaining", "usage-bar"],
    shortFieldMin: 2,
    shortFieldMax: 4,
  },

  /* ─────────────────────────────────────────────────────────────────────
   *  NEWS & CALENDAR
   *  Macro calendar + headline tape. Planned — shells out to a feed
   *  service we haven't wired yet.
   * ─────────────────────────────────────────────────────────────────── */
  {
    id:           "news-calendar",
    label:        "NEWS & CALENDAR",
    shortLabel:   "NEWS",
    description:  "Upcoming macro events · live headline tape.",
    category:     "market",
    readiness:    "planned",
    /* No header-chip — a single news headline doesn't compress to a
     * chip width meaningfully. Lives in panel / deck / flight-deck. */
    placements:   ["split-panel", "deck", "flight-deck"],
    iconHint:     "Newspaper",
    accentRole:   "amber",
    supportsListMode:  true,
    defaultMaxItems:   4,
    maxItemsRange:     [3, 8] as const,
    shortFieldCatalog: [
      { id: "time",      label: "TIME",     description: "Event time (UTC).",                       unit: "time",   weight: "detail" },
      { id: "currency",  label: "CCY",      description: "Currency / region the event affects.",    unit: "label",  weight: "detail" },
      { id: "event",     label: "EVENT",    description: "Event headline.",                          unit: "label",  weight: "principal" },
      { id: "impact",    label: "IMPACT",   description: "Expected market impact (low / med / high).",unit: "label", weight: "detail" },
      { id: "forecast",  label: "FORECAST", description: "Consensus forecast value.",                unit: "ratio",  weight: "detail" },
      { id: "previous",  label: "PREV",     description: "Previous reading.",                        unit: "ratio",  weight: "detail" },
      { id: "actual",    label: "ACTUAL",   description: "Actual reading once released.",            unit: "ratio",  weight: "principal" },
    ],
    defaultShortFields: ["time", "currency", "event", "impact"],
    shortFieldMin: 3,
    shortFieldMax: 6,
  },

  /* ─────────────────────────────────────────────────────────────────────
   *  WATCHLIST
   *  Trader-curated instrument scan. Planned shell — the watchlist
   *  store and price subscription land in a later epic.
   * ─────────────────────────────────────────────────────────────────── */
  {
    id:           "watchlist",
    label:        "WATCHLIST",
    shortLabel:   "WATCH",
    description:  "Curated instruments · live price · day change.",
    category:     "market",
    readiness:    "planned",
    placements:   ["header-chip", "split-panel", "deck", "flight-deck"],
    iconHint:     "ListChecks",
    accentRole:   "plain",
    supportsListMode:  true,
    defaultMaxItems:   6,
    maxItemsRange:     [3, 12] as const,
    shortFieldCatalog: [
      { id: "symbol",      label: "SYMBOL",   description: "Instrument ticker.",                       unit: "label",  weight: "principal" },
      { id: "last",        label: "LAST",     description: "Last traded price.",                        unit: "ratio",  weight: "principal" },
      { id: "change-pct",  label: "Δ %",      description: "Day change as percent.",                    unit: "pct",    weight: "principal", signed: true },
      { id: "change-abs",  label: "Δ ABS",    description: "Day change in price units.",                unit: "ratio",  weight: "detail",    signed: true },
      { id: "volume",      label: "VOL",      description: "Day volume.",                                unit: "count",  weight: "detail" },
      { id: "day-range",   label: "RANGE",    description: "Day high / low compressed into a bar.",     unit: "bar",    weight: "detail" },
      { id: "ath-pct",     label: "← ATH",    description: "Distance from all-time high (%).",          unit: "pct",    weight: "detail" },
    ],
    defaultShortFields: ["symbol", "last", "change-pct"],
    shortFieldMin: 2,
    shortFieldMax: 5,
  },

  /* ─────────────────────────────────────────────────────────────────────
   *  AI COPILOT
   *  Live AI suggestions tied to the current symbol + open positions.
   *  Beta — surface is wired but the model output is gated by the
   *  oracle streaming work in Milestone 7.
   * ─────────────────────────────────────────────────────────────────── */
  {
    id:           "ai-copilot",
    label:        "AI COPILOT",
    shortLabel:   "AI",
    description:  "Live AI read on the current symbol and open trades.",
    category:     "intelligence",
    readiness:    "beta",
    /* No header-chip — the canonical copilot read is a sentence, not a
     * single number, and a sentence doesn't fit a chip. Lives in
     * panel / deck / flight-deck. */
    placements:   ["split-panel", "deck", "flight-deck"],
    iconHint:     "Sparkles",
    accentRole:   "cyan",
    shortFieldCatalog: [
      { id: "last-suggestion",  label: "READ",      description: "Most recent copilot read in plain language.", unit: "label",  weight: "principal" },
      { id: "confidence",       label: "CONFIDENCE",description: "Model confidence in the current read.",       unit: "pct",    weight: "principal" },
      { id: "action-button",    label: "ACTION",    description: "One-click action the copilot suggests.",      unit: "label",  weight: "detail" },
      { id: "latency",          label: "LATENCY",   description: "Round-trip time of the last read (ms).",      unit: "count",  weight: "detail" },
      { id: "model",            label: "MODEL",     description: "Model identifier behind the read.",           unit: "label",  weight: "detail" },
      { id: "citation-count",   label: "CITES",     description: "How many sources the read cites.",            unit: "count",  weight: "detail" },
      { id: "regenerate",       label: "REGEN",     description: "Affordance to regenerate the read.",          unit: "label",  weight: "detail" },
    ],
    defaultShortFields: ["last-suggestion", "confidence"],
    shortFieldMin: 1,
    shortFieldMax: 4,
  },

] as const

/* ═══════════════════════════════════════════════════════════════════════
 *  DERIVED INDEXES + LOOKUPS
 *  ─────────────────────────────────────────────────────────────────────
 *  Pre-computed at module load so callers never iterate the registry on
 *  every render. All values are frozen by `as const` upstream so
 *  consumers can rely on referential stability.
 * ═══════════════════════════════════════════════════════════════════════ */

/** id → entry, O(1) lookup. */
export const MODULE_BY_ID: Readonly<Record<ModuleId, ModuleEntry>> =
  MODULE_REGISTRY.reduce((acc, m) => {
    acc[m.id] = m
    return acc
  }, {} as Record<ModuleId, ModuleEntry>)

/** Resolve an id to its entry. Throws if the id is unknown — that
 *  would mean a placement is referencing a module that was deleted,
 *  which is a programming error, not a runtime case. */
export function getModuleById(id: ModuleId): ModuleEntry {
  const entry = MODULE_BY_ID[id]
  if (!entry) {
    throw new Error(`[module-registry] unknown module id: "${id}"`)
  }
  return entry
}

/** Soft variant — returns null instead of throwing. Use this when
 *  reading from persisted trader state that may reference a module
 *  that has since been removed. */
export function tryGetModuleById(id: string | null | undefined): ModuleEntry | null {
  if (!id) return null
  return (MODULE_BY_ID as Record<string, ModuleEntry | undefined>)[id] ?? null
}

/** Filter by category. Returns the entries in registry order. */
export function getModulesByCategory(category: ModuleCategory): ModuleEntry[] {
  return MODULE_REGISTRY.filter(m => m.category === category)
}

/** Filter by placement eligibility. Returns the entries in registry
 *  order — this is the canonical source for "what can the trader pin
 *  to placement X?" */
export function getModulesByPlacement(placement: ModulePlacement): ModuleEntry[] {
  return MODULE_REGISTRY.filter(m => m.placements.includes(placement))
}

/** Per-category counts — pre-computed for the customize popover badges. */
export const MODULE_COUNTS_BY_CATEGORY: Readonly<Record<ModuleCategory, number>> =
  MODULE_CATEGORIES_ORDER.reduce((acc, cat) => {
    acc[cat] = getModulesByCategory(cat).length
    return acc
  }, {} as Record<ModuleCategory, number>)

/** Per-placement counts — pre-computed for the customize popover. */
export const MODULE_COUNTS_BY_PLACEMENT: Readonly<Record<ModulePlacement, number>> =
  MODULE_PLACEMENTS_ORDER.reduce((acc, p) => {
    acc[p] = getModulesByPlacement(p).length
    return acc
  }, {} as Record<ModulePlacement, number>)

/** Field lookup inside a module's short-field catalog. Returns null
 *  when the field id has been removed from the catalog (which
 *  shouldn't happen because we mark deprecated rather than delete,
 *  but defending against future mistakes is cheap). */
export function getModuleField(moduleId: ModuleId, fieldId: string): ModuleField | null {
  const m = tryGetModuleById(moduleId)
  if (!m) return null
  return m.shortFieldCatalog.find(f => f.id === fieldId) ?? null
}

/** Validate + repair a persisted short-fields array against the
 *  canonical catalog. Returns the input filtered to known field ids,
 *  clamped to [shortFieldMin, shortFieldMax], with the module's
 *  defaults appended if the result is too short. Pure — does not
 *  mutate inputs.
 *
 *  This is the function every persistence-loading site should call
 *  before trusting a trader's saved short-view config. */
export function reconcileShortFields(
  moduleId: ModuleId,
  persisted: ReadonlyArray<string> | null | undefined,
): string[] {
  const m = tryGetModuleById(moduleId)
  if (!m) return []
  const catalog = new Set(m.shortFieldCatalog.map(f => f.id))
  const filtered = (persisted ?? []).filter(id => catalog.has(id))
  // Clamp upper bound by simple slice.
  let next = filtered.slice(0, m.shortFieldMax)
  // If too short, top up from the module's defaults (preserving order
  // and avoiding duplicates with what the trader already had).
  if (next.length < m.shortFieldMin) {
    for (const def of m.defaultShortFields) {
      if (next.length >= m.shortFieldMin) break
      if (!next.includes(def)) next.push(def)
    }
  }
  return next
}

/** Validate + repair a persisted max-items count for a list-mode
 *  module. Returns the input clamped to the module's range, or the
 *  module's default if the input is missing / not applicable. */
export function reconcileMaxItems(
  moduleId: ModuleId,
  persisted: number | null | undefined,
): number | null {
  const m = tryGetModuleById(moduleId)
  if (!m || !m.supportsListMode) return null
  const def = m.defaultMaxItems ?? 3
  const range = m.maxItemsRange ?? ([1, 12] as const)
  if (persisted == null || !Number.isFinite(persisted)) return def
  const n = Math.round(persisted)
  if (n < range[0]) return range[0]
  if (n > range[1]) return range[1]
  return n
}

/** The default deck order — the canonical vertical stack below the
 *  chart when the trader has never customized the deck. Hand-picked
 *  so the trader's most-glanced-at modules sit at the top:
 *
 *    1. LIVE EQUITY      — the curve is the daily emotional anchor
 *    2. ACTIVE WINDOWS   — what am I in right now
 *    3. ACCOUNT & ASSETS — what's the shape of my account
 *    4. PAIRS YOU TRADE  — where is my edge
 *    5. RISK METER       — am I over-extended (planned)
 *    6. DAILY MAX        — am I about to break my rules (planned)
 *    7. PENDING ORDERS   — what's resting (planned)
 *    8. WATCHLIST        — what else am I scanning (planned)
 *    9. NEWS & CALENDAR  — what could move things (planned)
 *   10. AI COPILOT       — what does the model think (beta) */
export const MODULE_DEFAULT_DECK_ORDER: ReadonlyArray<ModuleId> = [
  "live-equity",
  "active-windows",
  "account-asset",
  "pairs-you-trade",
  "risk-meter",
  "daily-max",
  "pending-orders",
  "watchlist",
  "news-calendar",
  "ai-copilot",
] as const

/** Modules hidden from the deck by default — the trader can un-hide
 *  any of them via the customize popover. We default-hide the planned
 *  modules so a brand-new deck reads as a tight, real, four-card
 *  performance stack (LIVE EQUITY · ACTIVE · ACCOUNT · PAIRS) instead
 *  of a long list of "coming soon" placeholders. */
export const MODULE_DEFAULT_DECK_HIDDEN: ReadonlyArray<ModuleId> =
  MODULE_REGISTRY
    .filter(m => m.readiness === "planned")
    .map(m => m.id)
