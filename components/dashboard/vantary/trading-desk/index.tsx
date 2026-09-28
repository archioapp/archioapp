/* ════════════════════════════════════════════════════════════════════════════
 *  TRADING DESK · public barrel + composed entry
 *  ──────────────────────────────────────────────────────────────────────────
 *  This module is the single import surface for the Trading Desk feature.
 *  The composed entry — `<TradingDeskBay/>` — wraps `<TradingDeskShell/>`
 *  in its own `<TradingDeskProvider/>` so it can be dropped into a tree
 *  with one line:
 *
 *      <TradingDeskBay />
 *
 *  Layout shape (when expanded):
 *
 *      ┌─────────────────────────────────────────────────────────────────┐
 *      │ TRADING DESK · header (eyebrow · symbol+interval · mode chips · │
 *      │ window controls)                                                │
 *      ├──────────────────────────────────────┬──────────────────────────┤
 *      │                                      │ Side slot:               │
 *      │   TradingView chart (iframe)         │  ACTIVE WINDOWS  /       │
 *      │   width ↔ resizable via drag handle  │  LIVE EQUITY mini        │
 *      │   30 % .. 80 %                       │  (toggle via pill)       │
 *      ├──────────────────────────────────────┴──────────────────────────┤
 *      │ caption strip · last update · keyboard hints                    │
 *      └─────────────────────────────────────────────────────────────────┘
 *
 *  Layout modes (`TdLayoutMode`):
 *      · "split"        — chart left, side slot right (default)
 *      · "stacked"      — chart on top full-width, side slot below
 *      · "chart-only"   — chart full-width, side slot folded into header
 *      · "minimized"    — bay collapses to a 36 px-tall hairline ticker
 *
 *  Side-slot variants (`TdSideSlot`):
 *      · "active-windows" — compact list of open trades
 *      · "live-equity"    — micro equity dossier
 *
 *  Persistence:
 *      Layout, width-pct, side-slot, symbol, interval all persist to
 *      localStorage under `vantary.trading-desk.v1`. Hydration is gated
 *      on mount to avoid SSR mismatch.
 *
 *  Theming:
 *      Reads VANTARY tokens from `../vantary-theme`. Iframe theme
 *      param (`light` / `dark`) is inferred from the palette.
 *
 *  Accessibility:
 *      Resize handle exposes ARIA slider semantics, all chips/buttons
 *      are aria-labelled, the layout-mode strip is wired as a `tablist`,
 *      reduced-motion is honoured for every transition.
 * ══════════════════════════════════════════════════════════════════════════ */

"use client"

import * as React           from "react"
import { TradingDeskProvider, type TradingDeskProviderProps } from "./provider"
import { TradingDeskShell, type TradingDeskShellProps }       from "./shell"
import {
  DeckBelowChart,
  type DeckBelowChartProps,
  type DeckRendererMap,
} from "./deck/deck-below-chart"

/* — Composed entry: provider + shell. Drop-in at any depth. ─────────────
 *
 *   <TradingDeskBay />
 *   <TradingDeskBay initialState={{ layout: "stacked", symbolId: "btcusdt" }} />
 *   <TradingDeskBay fullBleed={false} className="my-8" />
 *
 * Provider props (`initialState`) and shell props (`fullBleed`, `className`)
 * are both passed through. */
export interface TradingDeskBayProps {
  /** Initial state seed for the underlying provider. Falls back to
   *  whatever's in localStorage; if nothing is persisted, falls back
   *  to `TD_DEFAULTS`. Useful for storybook / test harnesses. */
  initialState?: TradingDeskProviderProps["initialState"]

  /** When true (default), the shell breaks out of any centered max-width
   *  parent to span the full viewport width using negative margins. */
  fullBleed?: TradingDeskShellProps["fullBleed"]

  /** Optional className applied to the outermost shell wrapper. */
  className?: TradingDeskShellProps["className"]

  /** Render-prop override for the LIVE EQUITY VOLUME side-slot variant.
   *  Pass the real <EquityVolumeInline checkin={…}/> from your-space.tsx
   *  here to replace the bay's built-in mock mini with the real module. */
  liveEquityContent?: TradingDeskShellProps["liveEquityContent"]

  /** Render-prop override for the ACTIVE WINDOWS side-slot variant.
   *  Pass the real <SessionsCompactStage/> from your-space.tsx here to
   *  replace the bay's built-in mock mini with the real module. */
  activeWindowsContent?: TradingDeskShellProps["activeWindowsContent"]
}

export function TradingDeskBay({
  initialState,
  fullBleed,
  className,
  liveEquityContent,
  activeWindowsContent,
}: TradingDeskBayProps) {
  return (
    <TradingDeskProvider initialState={initialState}>
      <TradingDeskShell
        fullBleed={fullBleed}
        className={className}
        liveEquityContent={liveEquityContent}
        activeWindowsContent={activeWindowsContent}
      />
    </TradingDeskProvider>
  )
}

/* — Composed entry · BAY + DECK (Layer 1.4+) ───────────────────────────────
 *
 * Drop-in replacement for `<TradingDeskBay/>` that ALSO renders
 * `<DeckBelowChart/>` directly under the bay, all under a single
 * `<TradingDeskProvider/>` so both surfaces share state — drag-reorder,
 * hide/show, expand-toggle, and short-field configuration on the deck
 * stay in sync with the side-slot pickers in the bay header.
 *
 * Usage in your-space.tsx is a one-line swap from <TradingDeskBay/>:
 *
 *   <TradingDeskWithDeck
 *     liveEquityContent={<EquityVolumeInline checkin={AI_CHECKIN}/>}
 *     activeWindowsContent={<SessionsCompactStage/>}
 *   />
 *
 * Renderers for individual deck modules (live-equity, active-windows,
 * account-assets etc.) are slotted in via `deckRendererById` — Layers
 * 1.7 → 1.9 will wire those. Layer 1.4 leaves the map empty so every
 * card renders the registry-description placeholder defined in
 * `<DeckCard/>`.
 * ──────────────────────────────────────────────────────────────────────── */

export interface TradingDeskWithDeckProps extends TradingDeskBayProps {
  /** Per-module renderer dispatch table for the deck below the chart.
   *  Missing entries fall back to the registry-description placeholder
   *  defined in <DeckCard/>. */
  deckRendererById?: DeckRendererMap

  /** Forwarded to <DeckBelowChart onConfigureCard/>. Layer 1.5 wires
   *  this to the configure-short-view drawer. */
  onConfigureDeckCard?: DeckBelowChartProps["onConfigureCard"]

  /** Forwarded to <DeckBelowChart onOpenDeckSettings/>. Layer 1.6
   *  wires this to the customize popover's DECK tab. */
  onOpenDeckSettings?: DeckBelowChartProps["onOpenDeckSettings"]

  /** When true, the (Layer 1.4) placeholder deck stack is mounted under
   *  the bay. Default: false. The end-product flow uses
   *  <DeckCustomizeStrip/> + the existing components instead — see
   *  your-space.tsx for the canonical mount pattern. */
  showDeckBelow?: boolean
}

export function TradingDeskWithDeck({
  initialState,
  fullBleed,
  className,
  liveEquityContent,
  activeWindowsContent,
  deckRendererById,
  onConfigureDeckCard,
  onOpenDeckSettings,
  showDeckBelow = false,
}: TradingDeskWithDeckProps) {
  return (
    <TradingDeskProvider initialState={initialState}>
      <TradingDeskShell
        fullBleed={fullBleed}
        className={className}
        liveEquityContent={liveEquityContent}
        activeWindowsContent={activeWindowsContent}
      />
      {showDeckBelow && (
        <DeckBelowChart
          rendererById={deckRendererById}
          onConfigureCard={onConfigureDeckCard}
          onOpenDeckSettings={onOpenDeckSettings}
        />
      )}
    </TradingDeskProvider>
  )
}

/* — Granular surface modules ──────────────────────────────────────────── */
export { TradingDeskShell }                                       from "./shell"
export type { TradingDeskShellProps }                             from "./shell"
export { TradingViewEmbed }                                       from "./chart"
export type { TradingViewEmbedProps }                             from "./chart"
export { SideSlot }                                               from "./side-slot"
export {
  SymbolPicker,
  IntervalPicker,
  LayoutModeChips,
  WindowControls,
  MiniTicker,
} from "./pickers"

/* — Provider + hook (consumer-facing) ─────────────────────────────────── */
export {
  TradingDeskProvider,
  useTradingDesk,
  useTdLayout,
  useTdSymbol,
  useTdInterval,
  useTdSideSlot,
  useTdActions,
  useTdIsFullscreen,
  useDeck,
} from "./provider"
export type {
  TradingDeskProviderProps,
  TdState,
  TdActions,
  TdSelectors,
  TdContextValue,
  TdNavActions,
  TdDeckActions,
  TdDeckCard,
} from "./provider"

/* — Module registry (public API) ──────────────────────────────────────── */
export {
  MODULE_REGISTRY,
  MODULE_BY_ID,
  MODULE_CATEGORIES_ORDER,
  MODULE_CATEGORY_LABELS,
  MODULE_PLACEMENTS_ORDER,
  MODULE_PLACEMENT_LABELS,
  MODULE_READINESS_LABELS,
  MODULE_DEFAULT_DECK_ORDER,
  MODULE_DEFAULT_DECK_HIDDEN,
  MODULE_COUNTS_BY_CATEGORY,
  MODULE_COUNTS_BY_PLACEMENT,
  getModuleById,
  tryGetModuleById,
  getModulesByCategory,
  getModulesByPlacement,
  getModuleField,
  reconcileShortFields,
  reconcileMaxItems,
} from "./modules/registry"
export type {
  ModuleId,
  ModuleEntry,
  ModuleCategory,
  ModulePlacement,
  ModuleField,
  ModuleReadiness,
  FieldUnit,
  FieldWeight,
} from "./modules/registry"

/* — Data + types ──────────────────────────────────────────────────────── */
export {
  // mode + slot vocab
  TD_LAYOUT_MODES_ORDER,
  TD_LAYOUT_LABELS,
  TD_SIDE_SLOT_LABELS,
  // symbols
  DEMO_SYMBOLS,
  DEFAULT_SYMBOL_ID,
  getSymbolById,
  // intervals
  DEMO_INTERVALS,
  DEFAULT_INTERVAL_ID,
  getIntervalById,
  // demo content
  DEMO_ACTIVE_TRADES,
  DEMO_EQUITY_MICRO,
  // resize math
  TD_RESIZE_MIN,
  TD_RESIZE_MAX,
  TD_RESIZE_SNAPS,
  TD_HEIGHTS,
  snapResize,
  clampResize,
  // persistence
  TD_STORAGE_KEY,
  TD_DEFAULTS,
} from "./data"

export type {
  TdLayoutMode,
  TdSideSlot,
  TdSymbol,
  TdInterval,
  TdActiveTrade,
  TdEquityMicro,
  TdPersistedState,
  TdDeckViewMode,
} from "./data"

/* — Deck primitives (Layer 1.3+) ──────────────────────────────────────── */
export { DeckCard } from "./deck/deck-card"
export type { DeckCardProps } from "./deck/deck-card"

/* — Deck container (Layer 1.4) — internal placeholder stack, retained for
     future "compact dashboard" use-cases but NOT mounted in the trader's
     primary surface. The end-product customization layer is the deck-
     surface module below, which wraps the existing real components. ───── */
export { DeckBelowChart } from "./deck/deck-below-chart"
export type {
  DeckBelowChartProps,
  DeckRenderer,
  DeckRendererMap,
} from "./deck/deck-below-chart"

/* — Deck SURFACE (the user-facing customization model) ──────────────────
 *  This is the layer that ships to the trader. It does NOT replace any
 *  existing component — it WRAPS them with hide / show / reorder powers,
 *  driven by a single "Customize" button anchored top-right just below
 *  the trading-desk bay.
 *
 *  Pool defaults:  live-equity, active-windows, account-asset
 *  Source of truth:  same TradingDeskProvider (v3 schema) the bay uses.
 *  ─────────────────────────────────────────────────────────────────── */
export {
  DECK_SURFACE_POOL,
  useDeckSurface,
  DeckCustomizeButton,
  DeckCustomizeMenu,
  DeckCustomizeStrip,
} from "./deck/deck-surface"
export type {
  DeckSurfaceApi,
  DeckSurfaceCounter,
  DeckCustomizeButtonProps,
  DeckCustomizeMenuProps,
  DeckCustomizeStripProps,
} from "./deck/deck-surface"
