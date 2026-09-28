"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  TRADING DESK · STATE PROVIDER
 *  ─────────────────────────────────────────────────────────────────────────
 *  React context + reducer that owns every piece of mutable state for
 *  the Trading Desk Bay. Mounted once near the top of YourSpaceContent
 *  so the shell, chart, side slot, pickers, and resize handle all read
 *  from a single store.
 *
 *  State shape (see also TdPersistedState in ./data.ts):
 *    layout        — current TdLayoutMode ("split" | "stacked" | …)
 *    tvWidthPct    — 0..1 fraction of the bay's width that the chart
 *                    occupies in split mode (right side = side slot).
 *    sideSlot      — which slot variant is showing
 *                    ("active-windows" | "live-equity").
 *    symbolId      — currently displayed instrument id.
 *    intervalId    — currently displayed interval id.
 *    isFullscreen  — when true, the bay is rendered as a position:fixed
 *                    overlay covering the viewport (chart-only).
 *    lastNonMinLayout — remembers the last non-minimized layout so the
 *                    "expand" button restores it. Useful when the user
 *                    minimized from "stacked" — they want to go back to
 *                    "stacked", not the default "split".
 *
 *  Actions are dispatched via the `useTradingDesk()` hook's `actions`
 *  proxy. Every action is a pure reducer transition — easy to test,
 *  easy to log, easy to time-travel debug.
 *
 *  Persistence: state is saved to localStorage under TD_STORAGE_KEY on
 *  every mutation. On mount, hydrated from there if a valid record
 *  exists. Hydration is gated by a `hydrated` ref so SSR-rendered
 *  output uses defaults — preventing hydration mismatches.
 * ═══════════════════════════════════════════════════════════════════════ */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react"
import {
  TdLayoutMode,
  TdSideSlot,
  TdSideSlotPosition,
  TdPersistedState,
  TdDeckViewMode,
  TD_DEFAULTS,
  TD_STORAGE_KEY,
  TD_STORAGE_KEY_LEGACY_V2,
  TdSymbol,
  TdSymbolCategory,
  TdInterval,
  TD_CATEGORIES_ORDER,
  TD_RECENTS_LIMIT,
  TD_SIDE_SLOT_LABELS,
  TD_DEFAULT_FAVORITE_SLOTS,
  TD_LAYOUT_PRESETS,
  getSymbolById,
  getIntervalById,
  clampResize,
  snapResize,
  clampPeekPanelWidth,
} from "./data"
import {
  ModuleEntry,
  MODULE_BY_ID,
  MODULE_DEFAULT_DECK_ORDER,
  MODULE_DEFAULT_DECK_HIDDEN,
  getModuleById,
  tryGetModuleById,
  reconcileShortFields,
  reconcileMaxItems,
} from "./modules/registry"

/* ─── 1.  STATE + ACTION SHAPES ─────────────────────────────────────── */

/** Default LEFT-side fraction (0..1) for the dual-stage deck row. 0.5
 *  is exact 50/50 — what the existing UI shipped with — and is the
 *  fallback whenever the persisted value is missing or out of range. */
export const DUAL_DECK_RATIO_DEFAULT = 0.5

/** Hard bounds so the splitter can never leave one side unreadably
 *  small. 0.20 keeps ~20% minimum width on either side. The customize
 *  menu's "snap to 50/50" affordance reads these too. */
export const DUAL_DECK_RATIO_MIN     = 0.20
export const DUAL_DECK_RATIO_MAX     = 0.80

/** Soft magnetic snap points the splitter lock onto when dragged
 *  within ±0.02 of any value. Curated for trader rhythm:
 *
 *    0.25 — equity narrow (focus on sessions)
 *    0.33 — equity third
 *    0.50 — exact half
 *    0.67 — equity two-thirds
 *    0.75 — equity wide (focus on equity)  */
export const DUAL_DECK_SNAP_POINTS: ReadonlyArray<number> = [0.25, 0.33, 0.50, 0.67, 0.75]
export const DUAL_DECK_SNAP_TOLERANCE = 0.02

/** Clamp + snap a raw ratio coming from the splitter drag. Public so
 *  the UI can preview the snapped value (e.g. live tooltip) without
 *  dispatching. */
export function clampDualDeckRatio(raw: number): number {
  if (!Number.isFinite(raw)) return DUAL_DECK_RATIO_DEFAULT
  let r = raw
  if (r < DUAL_DECK_RATIO_MIN) r = DUAL_DECK_RATIO_MIN
  if (r > DUAL_DECK_RATIO_MAX) r = DUAL_DECK_RATIO_MAX
  for (const snap of DUAL_DECK_SNAP_POINTS) {
    if (Math.abs(r - snap) <= DUAL_DECK_SNAP_TOLERANCE) return snap
  }
  return r
}

export interface TdState extends TdPersistedState {
  isFullscreen:     boolean
  lastNonMinLayout: TdLayoutMode
  /** Set to a non-null number while the user is actively dragging the
   *  resize handle. UI uses this to suppress transitions and to show a
   *  "live percentage" tooltip near the cursor. */
  draggingPct: number | null
  /** LEFT-side fraction (0..1) for the dual-stage deck row's vertical
   *  divider. Persisted across reloads. Clamped + snapped on write
   *  via clampDualDeckRatio(). Default = 0.5 (exact 50/50). */
  dualDeckRatio: number
}

type TdAction =
  | { type: "SET_LAYOUT";     payload: TdLayoutMode }
  | { type: "CYCLE_LAYOUT" }
  | { type: "TOGGLE_MINIMIZE" }
  | { type: "EXPAND" }
  | { type: "SET_TV_WIDTH";   payload: number }
  | { type: "SET_DRAGGING";   payload: number | null }
  | { type: "SET_SIDE_SLOT";  payload: TdSideSlot }
  | { type: "TOGGLE_SIDE_SLOT" }
  | { type: "SET_SIDE_SLOT_POSITION"; payload: TdSideSlotPosition }
  | { type: "TOGGLE_SIDE_SLOT_POSITION" }
  | { type: "SET_SLOT_FAVORITES"; payload: TdSideSlot[] }
  | { type: "TOGGLE_SLOT_FAVORITE"; payload: TdSideSlot }
  | { type: "SET_PEEK_ENABLED"; payload: boolean }
  | { type: "SET_PEEK_PANEL_WIDTH"; payload: number }
  | { type: "APPLY_PRESET"; payload: string }
  | { type: "PIN_PEEK" }
  | { type: "SET_SYMBOL";     payload: string }
  | { type: "SET_INTERVAL";   payload: string }
  | { type: "TOGGLE_FULLSCREEN" }
  | { type: "EXIT_FULLSCREEN" }
  /* Navigator preferences — visibility / favourites / recents. */
  | { type: "NAV_TOGGLE_CATEGORY"; payload: TdSymbolCategory }
  | { type: "NAV_SET_VISIBLE_CATEGORIES"; payload: TdSymbolCategory[] }
  | { type: "NAV_TOGGLE_FAVORITE"; payload: string }
  | { type: "NAV_CLEAR_RECENTS" }
  /* Deck-below-chart preferences (v3+). */
  | { type: "DECK_SET_ORDER";          payload: TdSideSlot[] }
  | { type: "DECK_TOGGLE_HIDDEN";      payload: TdSideSlot }
  | { type: "DECK_SET_HIDDEN";         payload: { id: TdSideSlot; hidden: boolean } }
  | { type: "DECK_SET_VIEW_MODE";      payload: { id: TdSideSlot; mode: TdDeckViewMode } }
  | { type: "DECK_TOGGLE_VIEW_MODE";   payload: TdSideSlot }
  | { type: "DECK_SET_SHORT_FIELDS";   payload: { id: TdSideSlot; fields: string[] } }
  | { type: "DECK_TOGGLE_SHORT_FIELD"; payload: { id: TdSideSlot; fieldId: string } }
  | { type: "DECK_SET_MAX_ITEMS";      payload: { id: TdSideSlot; count: number } }
  | { type: "DECK_RESET_MODULE";       payload: TdSideSlot }
  | { type: "DECK_RESET_ALL" }
  /* Deck-pair-row preferences (v3.1) — the draggable splitter between
   * the LIVE EQUITY VOLUME and ACTIVE WINDOWS halves of the dual-stage
   * row. The ratio is the LEFT side's fraction of the row, clamped to
   * [DUAL_DECK_RATIO_MIN, DUAL_DECK_RATIO_MAX] by the reducer. ────── */
  | { type: "DECK_SET_DUAL_RATIO";     payload: number }
  | { type: "DECK_RESET_DUAL_RATIO" }
  | { type: "HYDRATE";        payload: Partial<TdState> }

/* ─── 2.  REDUCER ───────────────────────────────────────────────────── */

/** Compute the canonical default deck state from the module registry.
 *  Called once at module-init for `INITIAL_STATE` and again by the
 *  HYDRATE / DECK_RESET_ALL cases. The function is pure and cheap —
 *  the registry is small and the work is O(modules). */
function buildDeckDefaults(): {
  deckOrder: TdSideSlot[]
  deckHidden: TdSideSlot[]
  deckViewMode: Partial<Record<TdSideSlot, TdDeckViewMode>>
  deckShortFields: Partial<Record<TdSideSlot, string[]>>
  deckMaxItems: Partial<Record<TdSideSlot, number>>
} {
  const deckShortFields: Partial<Record<TdSideSlot, string[]>> = {}
  const deckMaxItems:    Partial<Record<TdSideSlot, number>>   = {}
  for (const id of MODULE_DEFAULT_DECK_ORDER) {
    const entry = getModuleById(id)
    deckShortFields[id] = [...entry.defaultShortFields]
    if (entry.supportsListMode && entry.defaultMaxItems != null) {
      deckMaxItems[id] = entry.defaultMaxItems
    }
  }
  return {
    deckOrder:       [...MODULE_DEFAULT_DECK_ORDER],
    deckHidden:      [...MODULE_DEFAULT_DECK_HIDDEN],
    // Empty view-mode map → every card defaults to "short" via
    // `state.deckViewMode[id] ?? "short"` at the read site.
    deckViewMode:    {},
    deckShortFields,
    deckMaxItems,
  }
}

const INITIAL_STATE: TdState = {
  ...TD_DEFAULTS,
  ...buildDeckDefaults(), // overlays the empty deck defaults from data.ts
  isFullscreen:     false,
  lastNonMinLayout: TD_DEFAULTS.layout,
  draggingPct:      null,
  dualDeckRatio:    DUAL_DECK_RATIO_DEFAULT,
}

function reducer(state: TdState, action: TdAction): TdState {
  switch (action.type) {

    case "SET_LAYOUT": {
      const next = action.payload
      return {
        ...state,
        layout: next,
        // Track the last non-minimized layout so EXPAND can restore it.
        lastNonMinLayout: next === "minimized" ? state.lastNonMinLayout : next,
      }
    }

    case "CYCLE_LAYOUT": {
      // SPLIT → STACKED → CHART-ONLY → SPLIT (skipping minimized — that's
      // its own dedicated action). The minimize toggle handles that case.
      const order: TdLayoutMode[] = ["split", "stacked", "chart-only"]
      const idx = order.indexOf(state.layout)
      const next = order[(idx + 1) % order.length]
      return { ...state, layout: next, lastNonMinLayout: next }
    }

    case "TOGGLE_MINIMIZE": {
      if (state.layout === "minimized") {
        return { ...state, layout: state.lastNonMinLayout }
      }
      return { ...state, lastNonMinLayout: state.layout, layout: "minimized" }
    }

    case "EXPAND": {
      return { ...state, layout: state.lastNonMinLayout }
    }

    case "SET_TV_WIDTH": {
      return { ...state, tvWidthPct: clampResize(action.payload) }
    }

    case "SET_DRAGGING": {
      // When dragging ends (payload === null), snap the final committed
      // tvWidthPct to the closest snap point if within threshold.
      if (action.payload === null) {
        return {
          ...state,
          draggingPct: null,
          tvWidthPct:  snapResize(state.tvWidthPct),
        }
      }
      const clamped = clampResize(action.payload)
      return { ...state, draggingPct: clamped, tvWidthPct: clamped }
    }

    case "SET_SIDE_SLOT":
      return { ...state, sideSlot: action.payload }

    case "TOGGLE_SIDE_SLOT": {
      // Cycle through the trader's favourite slots so the keyboard
      // shortcut (or the mini-toggle button) feels deterministic and
      // useful. Falls back to the legacy two-slot toggle if the
      // favourites list is empty for some reason.
      const favs = state.slotFavorites && state.slotFavorites.length > 0
        ? state.slotFavorites
        : (TD_DEFAULT_FAVORITE_SLOTS as readonly TdSideSlot[])
      const idx  = favs.indexOf(state.sideSlot)
      const next = favs[(idx + 1) % favs.length]
      return { ...state, sideSlot: next }
    }

    case "SET_SIDE_SLOT_POSITION":
      return { ...state, sideSlotPosition: action.payload }

    case "TOGGLE_SIDE_SLOT_POSITION":
      return {
        ...state,
        sideSlotPosition: state.sideSlotPosition === "right" ? "left" : "right",
      }

    case "SET_SLOT_FAVORITES": {
      // Always at least one favourite — never let the chip rail go blank.
      const next = action.payload.length > 0
        ? action.payload
        : [state.sideSlot]
      return { ...state, slotFavorites: next }
    }

    case "TOGGLE_SLOT_FAVORITE": {
      const id = action.payload
      const current = state.slotFavorites ?? []
      const isOn = current.includes(id)
      // Don't allow removing the last favourite.
      if (isOn && current.length === 1) return state
      const next = isOn ? current.filter(s => s !== id) : [...current, id]
      return { ...state, slotFavorites: next }
    }

    case "SET_PEEK_ENABLED":
      return { ...state, slotPeekEnabled: action.payload }

    case "SET_PEEK_PANEL_WIDTH":
      return { ...state, peekPanelWidth: clampPeekPanelWidth(action.payload) }

    case "APPLY_PRESET": {
      const preset = TD_LAYOUT_PRESETS.find(p => p.id === action.payload)
      if (!preset) return state
      const patch = preset.apply
      return {
        ...state,
        ...patch,
        // Track lastNonMinLayout if the preset changed layout.
        lastNonMinLayout: patch.layout && patch.layout !== "minimized"
          ? patch.layout
          : state.lastNonMinLayout,
      }
    }

    case "PIN_PEEK": {
      // PIN promotes the peek drawer to a permanent panel.
      //   · Switches layout to SPLIT (panel becomes the permanent
      //     side pane in whichever side the trader chose).
      //   · Disables peek so the panel stops auto-hiding.
      //   · Preserves tvWidthPct so the split ratio is unchanged.
      // Either way the trader ends with peek OFF + a stable visible
      // panel.
      return {
        ...state,
        layout: "split",
        lastNonMinLayout: "split",
        slotPeekEnabled: false,
      }
    }

    case "SET_SYMBOL": {
      // Auto-record in recents (newest first, deduped, capped to limit).
      // We never record the default fallback symbol on hydration — only
      // explicit user-driven changes go through this case.
      const id = action.payload
      const next = [id, ...state.navRecents.filter(x => x !== id)].slice(0, TD_RECENTS_LIMIT)
      return { ...state, symbolId: id, navRecents: next }
    }

    case "SET_INTERVAL":
      return { ...state, intervalId: action.payload }

    case "TOGGLE_FULLSCREEN":
      return { ...state, isFullscreen: !state.isFullscreen }

    case "EXIT_FULLSCREEN":
      return { ...state, isFullscreen: false }

    case "NAV_TOGGLE_CATEGORY": {
      // Always preserve the canonical TD_CATEGORIES_ORDER. We don't allow
      // hiding the LAST visible category — at least one must remain or the
      // strip would render empty (refusing to allow that protects the
      // user from a silently broken UI).
      // The `?? TD_DEFAULTS.navVisibleCategories` fallback heals state
      // that was hydrated from a pre-nav-fields persisted shape.
      const cat = action.payload
      const current = state.navVisibleCategories ?? TD_DEFAULTS.navVisibleCategories
      const isOn = current.includes(cat)
      if (isOn && current.length === 1) return state
      const next = isOn
        ? current.filter(c => c !== cat)
        : TD_CATEGORIES_ORDER.filter(c => current.includes(c) || c === cat)
      return { ...state, navVisibleCategories: next }
    }

    case "NAV_SET_VISIBLE_CATEGORIES": {
      // Order-preserving + at-least-one guard.
      const next = TD_CATEGORIES_ORDER.filter(c => action.payload.includes(c))
      if (next.length === 0) return state
      return { ...state, navVisibleCategories: next }
    }

    case "NAV_TOGGLE_FAVORITE": {
      const id = action.payload
      const current = state.navFavorites ?? []
      const next = current.includes(id)
        ? current.filter(x => x !== id)
        : [...current, id]
      return { ...state, navFavorites: next }
    }

    case "NAV_CLEAR_RECENTS":
      return { ...state, navRecents: [] }

    /* ── DECK CASES (v3) ───────────────────────────────────────────
     *  Every case is a pure transition. Reconciliation against the
     *  registry happens here (not at the call site) so any caller —
     *  drawer, popover, keyboard shortcut — gets a safe outcome. */

    case "DECK_SET_ORDER": {
      // Order the trader committed (drag-drop). We DO trust the input
      // shape but we DON'T trust its contents — filter to known module
      // ids, append any registry ids the caller forgot so the deck is
      // always a complete set, and de-dupe.
      const incoming = action.payload.filter(id => id in MODULE_BY_ID) as TdSideSlot[]
      const seen = new Set<TdSideSlot>(incoming)
      const completed: TdSideSlot[] = [...incoming]
      for (const id of MODULE_DEFAULT_DECK_ORDER) {
        if (!seen.has(id)) { completed.push(id); seen.add(id) }
      }
      return { ...state, deckOrder: completed }
    }

    case "DECK_TOGGLE_HIDDEN": {
      const id = action.payload
      const current = state.deckHidden ?? []
      const isHidden = current.includes(id)
      const next = isHidden
        ? current.filter(x => x !== id)
        : [...current, id]
      // Guard: refuse to hide the LAST visible card so the deck can
      // never read empty. The customize popover's "hide all" path is
      // not a thing — un-pinning is the way to remove a module.
      if (!isHidden) {
        const visibleAfter = (state.deckOrder ?? []).filter(
          d => !next.includes(d) && d in MODULE_BY_ID,
        )
        if (visibleAfter.length === 0) return state
      }
      return { ...state, deckHidden: next }
    }

    case "DECK_SET_HIDDEN": {
      const { id, hidden } = action.payload
      const current = state.deckHidden ?? []
      const isHidden = current.includes(id)
      if (isHidden === hidden) return state
      const next = hidden ? [...current, id] : current.filter(x => x !== id)
      // Same last-visible guard as DECK_TOGGLE_HIDDEN.
      if (hidden) {
        const visibleAfter = (state.deckOrder ?? []).filter(
          d => !next.includes(d) && d in MODULE_BY_ID,
        )
        if (visibleAfter.length === 0) return state
      }
      return { ...state, deckHidden: next }
    }

    case "DECK_SET_VIEW_MODE": {
      const { id, mode } = action.payload
      // Clean write — replace the whole map by reference so React
      // memoised selectors invalidate predictably.
      return {
        ...state,
        deckViewMode: { ...(state.deckViewMode ?? {}), [id]: mode },
      }
    }

    case "DECK_TOGGLE_VIEW_MODE": {
      const id = action.payload
      const current = state.deckViewMode?.[id] ?? "short"
      const next: TdDeckViewMode = current === "short" ? "expanded" : "short"
      return {
        ...state,
        deckViewMode: { ...(state.deckViewMode ?? {}), [id]: next },
      }
    }

    case "DECK_SET_SHORT_FIELDS": {
      const { id, fields } = action.payload
      const reconciled = reconcileShortFields(id, fields)
      return {
        ...state,
        deckShortFields: { ...(state.deckShortFields ?? {}), [id]: reconciled },
      }
    }

    case "DECK_TOGGLE_SHORT_FIELD": {
      const { id, fieldId } = action.payload
      const entry = tryGetModuleById(id)
      if (!entry) return state
      // Resolve current selection (registry default if the trader
      // hasn't touched this module yet).
      const current = state.deckShortFields?.[id] ?? [...entry.defaultShortFields]
      const isOn = current.includes(fieldId)
      // Guard: don't allow dropping below shortFieldMin. The drawer
      // should disable the off toggle when this is true, but we
      // defend at the reducer too so keyboard / programmatic callers
      // can't break invariants.
      if (isOn && current.length <= entry.shortFieldMin) return state
      // Guard: don't allow exceeding shortFieldMax.
      if (!isOn && current.length >= entry.shortFieldMax) return state
      // Guard: don't add unknown field ids.
      if (!isOn && !entry.shortFieldCatalog.some(f => f.id === fieldId)) return state
      const nextFields = isOn
        ? current.filter(x => x !== fieldId)
        : [...current, fieldId]
      return {
        ...state,
        deckShortFields: { ...(state.deckShortFields ?? {}), [id]: nextFields },
      }
    }

    case "DECK_SET_MAX_ITEMS": {
      const { id, count } = action.payload
      const reconciled = reconcileMaxItems(id, count)
      if (reconciled == null) return state // module is not list-mode
      return {
        ...state,
        deckMaxItems: { ...(state.deckMaxItems ?? {}), [id]: reconciled },
      }
    }

    case "DECK_RESET_MODULE": {
      const id = action.payload
      const entry = tryGetModuleById(id)
      if (!entry) return state
      // Strip this module's per-key overrides and let the read sites
      // fall back to the registry defaults.
      const nextViewMode    = { ...(state.deckViewMode ?? {})    }; delete nextViewMode[id]
      const nextShortFields = { ...(state.deckShortFields ?? {}) }; delete nextShortFields[id]
      const nextMaxItems    = { ...(state.deckMaxItems ?? {})    }; delete nextMaxItems[id]
      return {
        ...state,
        deckViewMode:    nextViewMode,
        deckShortFields: nextShortFields,
        deckMaxItems:    nextMaxItems,
        // Also un-hide the card on reset — the trader is asking for a
        // clean slate, which means visible.
        deckHidden:      (state.deckHidden ?? []).filter(x => x !== id),
      }
    }

    case "DECK_RESET_ALL": {
      /* Resetting the entire deck also restores the splitter to dead-
       * center 50/50 — anything else would feel like an incomplete
       * reset. */
      return {
        ...state,
        ...buildDeckDefaults(),
        dualDeckRatio: DUAL_DECK_RATIO_DEFAULT,
      }
    }

    case "DECK_SET_DUAL_RATIO": {
      const next = clampDualDeckRatio(action.payload)
      // Same-value short-circuit — drag-events fire continuously and
      // we'd otherwise re-render every frame for no reason.
      if (next === state.dualDeckRatio) return state
      return { ...state, dualDeckRatio: next }
    }

    case "DECK_RESET_DUAL_RATIO": {
      if (state.dualDeckRatio === DUAL_DECK_RATIO_DEFAULT) return state
      return { ...state, dualDeckRatio: DUAL_DECK_RATIO_DEFAULT }
    }

    case "HYDRATE": {
      // Backwards-compat heal — older persisted shapes (from before the
      // nav fields existed in TD_DEFAULTS) and stale-HMR module caches
      // can leave these arrays as `undefined` after a state spread. We
      // fill them in here so every downstream selector and component
      // can rely on them being arrays.
      const next: TdState = { ...state, ...action.payload }
      if (!Array.isArray(next.navFavorites))         next.navFavorites         = TD_DEFAULTS.navFavorites
      if (!Array.isArray(next.navRecents))           next.navRecents           = TD_DEFAULTS.navRecents
      if (!Array.isArray(next.navVisibleCategories) || next.navVisibleCategories.length === 0) {
        next.navVisibleCategories = TD_DEFAULTS.navVisibleCategories
      }
      // v2 fields — heal from undefined for v1 records.
      if (next.sideSlotPosition !== "left" && next.sideSlotPosition !== "right") {
        next.sideSlotPosition = TD_DEFAULTS.sideSlotPosition
      }
      if (!Array.isArray(next.slotFavorites) || next.slotFavorites.length === 0) {
        next.slotFavorites = [...TD_DEFAULTS.slotFavorites]
      }
      if (typeof next.slotPeekEnabled !== "boolean") {
        next.slotPeekEnabled = TD_DEFAULTS.slotPeekEnabled
      }
      if (typeof next.peekPanelWidth !== "number" || !Number.isFinite(next.peekPanelWidth)) {
        next.peekPanelWidth = TD_DEFAULTS.peekPanelWidth
      } else {
        next.peekPanelWidth = clampPeekPanelWidth(next.peekPanelWidth)
      }
      // v3.1 — dual-deck splitter ratio. Older records won't have it;
      // it might also arrive out-of-range from a corrupt save. Either
      // way clampDualDeckRatio() does the right thing.
      if (typeof next.dualDeckRatio !== "number" || !Number.isFinite(next.dualDeckRatio)) {
        next.dualDeckRatio = DUAL_DECK_RATIO_DEFAULT
      } else {
        next.dualDeckRatio = clampDualDeckRatio(next.dualDeckRatio)
      }
      // If the persisted layout was the now-deprecated `stacked` mode,
      // promote it to `split` so the trader doesn't see a broken state
      // (the chip strip no longer exposes STACKED).
      if (next.layout === "stacked") next.layout = "split"
      if (next.lastNonMinLayout === "stacked") next.lastNonMinLayout = "split"

      // ── v3 deck-fields heal ──────────────────────────────────────
      // Either we hydrated a v2 record (no deck fields at all) or the
      // trader removed/renamed something in the registry since the
      // last save. Either way the registry is the source of truth.
      const defaults = buildDeckDefaults()

      // deckOrder: filter to known ids; if empty or missing, use the
      // canonical default; if the trader's order is missing newly-
      // added registry ids, append them to the bottom so new modules
      // appear on next load instead of being invisible until reset.
      let deckOrder: TdSideSlot[]
      if (Array.isArray(next.deckOrder) && next.deckOrder.length > 0) {
        const seen = new Set<TdSideSlot>()
        deckOrder = []
        for (const raw of next.deckOrder) {
          if (typeof raw === "string" && raw in MODULE_BY_ID && !seen.has(raw as TdSideSlot)) {
            deckOrder.push(raw as TdSideSlot)
            seen.add(raw as TdSideSlot)
          }
        }
        for (const id of MODULE_DEFAULT_DECK_ORDER) {
          if (!seen.has(id)) deckOrder.push(id)
        }
      } else {
        deckOrder = defaults.deckOrder
      }
      next.deckOrder = deckOrder

      // deckHidden: filter to known ids that exist in the order list.
      const orderSet = new Set<TdSideSlot>(deckOrder)
      if (Array.isArray(next.deckHidden)) {
        next.deckHidden = next.deckHidden.filter(
          (id): id is TdSideSlot =>
            typeof id === "string" && id in MODULE_BY_ID && orderSet.has(id as TdSideSlot),
        )
      } else {
        next.deckHidden = defaults.deckHidden.filter(id => orderSet.has(id))
      }
      // Last-visible guard at hydrate too — if everything got hidden
      // (corrupt save), force the registry-default hidden set.
      if (deckOrder.every(id => next.deckHidden!.includes(id))) {
        next.deckHidden = defaults.deckHidden.filter(id => orderSet.has(id))
      }

      // deckViewMode: drop unknown ids and unknown values.
      const cleanViewMode: Partial<Record<TdSideSlot, TdDeckViewMode>> = {}
      const rawViewMode = next.deckViewMode ?? {}
      for (const [k, v] of Object.entries(rawViewMode)) {
        if (!(k in MODULE_BY_ID)) continue
        if (v === "short" || v === "expanded") {
          cleanViewMode[k as TdSideSlot] = v
        }
      }
      next.deckViewMode = cleanViewMode

      // deckShortFields: per-module reconcile against the registry.
      const cleanShortFields: Partial<Record<TdSideSlot, string[]>> = {}
      const rawShortFields = next.deckShortFields ?? {}
      for (const id of deckOrder) {
        const persisted = (rawShortFields as Record<string, string[] | undefined>)[id]
        if (Array.isArray(persisted)) {
          cleanShortFields[id] = reconcileShortFields(id, persisted)
        } else {
          // Fall through to defaults so the read site always finds
          // a meaningful selection.
          cleanShortFields[id] = [...getModuleById(id).defaultShortFields]
        }
      }
      next.deckShortFields = cleanShortFields

      // deckMaxItems: per-module reconcile against the registry.
      const cleanMaxItems: Partial<Record<TdSideSlot, number>> = {}
      const rawMaxItems = next.deckMaxItems ?? {}
      for (const id of deckOrder) {
        const entry = getModuleById(id)
        if (!entry.supportsListMode) continue
        const persisted = (rawMaxItems as Record<string, number | undefined>)[id]
        const reconciled = reconcileMaxItems(id, persisted ?? null)
        if (reconciled != null) cleanMaxItems[id] = reconciled
      }
      next.deckMaxItems = cleanMaxItems

      return next
    }

    default:
      return state
  }
}

/* ─── 3.  CONTEXT VALUE TYPES ───────────────────────────────────────── */

export interface TdNavActions {
  /** Toggle a single category's visibility in the navigator strip. The
   *  reducer guards against hiding the last visible category. */
  toggleCategory:        (c: TdSymbolCategory) => void
  /** Replace the visible-categories set wholesale. Order is normalized
   *  to TD_CATEGORIES_ORDER. */
  setVisibleCategories:  (next: TdSymbolCategory[]) => void
  /** Pin / unpin an instrument id to the favourites strip. */
  toggleFavorite:        (id: string) => void
  /** Wipe the recents list (does not affect favourites). */
  clearRecents:          () => void
}

/** Actions that customise the DECK BELOW THE CHART. The deck is a
 *  vertical stack of module cards under TradingView. Every action
 *  here is reconciled against the module registry by the reducer
 *  before being committed, so callers can pass raw user input. */
export interface TdDeckActions {
  /** Replace the deck order wholesale (drag-drop). Unknown ids are
   *  dropped, missing registry ids are appended so the order is
   *  always complete. */
  setOrder:           (ids: TdSideSlot[]) => void
  /** Flip a card's hidden flag. The reducer refuses to hide the last
   *  visible card so the deck never reads empty. */
  toggleHidden:       (id: TdSideSlot) => void
  /** Set a card's hidden flag explicitly (idempotent). */
  setHidden:          (id: TdSideSlot, hidden: boolean) => void
  /** Set a card's view mode ("short" or "expanded"). */
  setViewMode:        (id: TdSideSlot, mode: TdDeckViewMode) => void
  /** Flip a card's view mode. */
  toggleViewMode:     (id: TdSideSlot) => void
  /** Replace the trader's short-field selection for a module. The
   *  reducer reconciles against the registry catalog. */
  setShortFields:     (id: TdSideSlot, fields: string[]) => void
  /** Toggle a single field token on/off. The reducer enforces the
   *  module's shortFieldMin / shortFieldMax bounds. */
  toggleShortField:   (id: TdSideSlot, fieldId: string) => void
  /** Set the max-items count for a list-mode module. */
  setMaxItems:        (id: TdSideSlot, count: number) => void
  /** Reset a single module's deck config to registry defaults. Also
   *  un-hides the card. */
  resetModule:        (id: TdSideSlot) => void
  /** Reset the entire deck (order, hidden, view modes, short fields,
   *  max items) to registry defaults. */
  resetAll:           () => void
  /** Set the LIVE EQUITY ⫴ ACTIVE WINDOWS splitter ratio. The reducer
   *  clamps to [DUAL_DECK_RATIO_MIN, DUAL_DECK_RATIO_MAX] and applies
   *  ±0.02 magnetic snap to DUAL_DECK_SNAP_POINTS. Continuous values
   *  during a drag are fine — the reducer short-circuits on equality
   *  so the UI can fire on every pointer-move without thrashing. */
  setDualRatio:       (ratio: number) => void
  /** Restore the dual-deck splitter to dead-center 50/50. */
  resetDualRatio:     () => void
}

export interface TdActions {
  setLayout:             (m: TdLayoutMode) => void
  cycleLayout:           () => void
  toggleMinimize:        () => void
  expand:                () => void
  setTvWidth:            (pct: number) => void
  setDragging:           (pct: number | null) => void
  setSideSlot:           (slot: TdSideSlot) => void
  toggleSideSlot:        () => void
  /** Position the side slot on the left or right edge of the chart. */
  setSideSlotPosition:   (pos: TdSideSlotPosition) => void
  toggleSideSlotPosition: () => void
  /** Pin/unpin a module from the header chip rail. */
  toggleSlotFavorite:    (slot: TdSideSlot) => void
  setSlotFavorites:      (slots: TdSideSlot[]) => void
  /** Enable/disable the chart-only edge peek behavior. */
  setPeekEnabled:        (enabled: boolean) => void
  /** Width in pixels of the peek panel — driven by the draggable
   *  resize handle on the panel's chart-side edge. Clamped on write. */
  setPeekPanelWidth:     (px: number) => void
  /** Apply a one-click layout preset (FOCUS, 50/50, etc.). */
  applyPreset:           (presetId: string) => void
  /** Promote chart-only → split (used by the peek's pin button). */
  pinPeek:               () => void
  setSymbol:             (id: string) => void
  setInterval:           (id: string) => void
  toggleFullscreen:      () => void
  exitFullscreen:        () => void
  /** Customizable navigator preferences (categories, favourites, recents). */
  nav:                   TdNavActions
  /** Customizable DECK BELOW THE CHART preferences. */
  deck:                  TdDeckActions
}

/** A single deck card resolved from raw state + the registry. The
 *  selector layer does the work so renderers (DeckCard, the
 *  customize popover) can iterate a clean array without knowing
 *  anything about reconciliation. */
export interface TdDeckCard {
  /** Stable module id. */
  id:           TdSideSlot
  /** Full registry entry — gives the renderer label, category,
   *  short-field catalog, etc. without a second lookup. */
  entry:        ModuleEntry
  /** "short" or "expanded" — defaults to "short" when the trader
   *  hasn't set a preference. */
  viewMode:     TdDeckViewMode
  /** Trader's curated short-field token order, reconciled against
   *  the registry. Always non-empty for ready modules. */
  shortFields:  string[]
  /** Resolved max-items count for list-mode modules; null for
   *  non-list-mode modules. */
  maxItems:     number | null
  /** Whether this card is hidden from the deck. The selector still
   *  surfaces hidden cards so the customize popover can show "all
   *  modules" with a toggle, but the deck renderer itself filters
   *  them out via `visibleCards`. */
  hidden:       boolean
}

export interface TdSelectors {
  /** Resolved current TdSymbol object (never null). */
  currentSymbol:   TdSymbol
  /** Resolved current TdInterval object (never null). */
  currentInterval: TdInterval
  /** Whether the bay is in a state that shows the side slot. */
  hasSideSlot:     boolean
  /** Whether the bay is in a state that shows the chart in any way. */
  hasChart:        boolean
  /** Resolved favourite symbols, in pin-order. Filters out unknown ids. */
  favoriteSymbols: TdSymbol[]
  /** Resolved recent symbols, newest first. Filters out unknown ids and
   *  drops the currently-active symbol so it never duplicates. */
  recentSymbols:   TdSymbol[]
  /** Every deck card in trader-order, including hidden ones, fully
   *  resolved against the registry. The single source DeckBelowChart,
   *  the customize popover's DECK tab, and any future "deck-status"
   *  hover should all read. */
  deckCards:       TdDeckCard[]
  /** Filtered subset of `deckCards` with `hidden === false`, kept in
   *  trader order. This is what `<DeckBelowChart/>` iterates. */
  visibleDeckCards: TdDeckCard[]
}

export interface TdContextValue {
  state:     TdState
  actions:   TdActions
  selectors: TdSelectors
}

/* ─── 4.  CONTEXT ───────────────────────────────────────────────���───── */

const TdContext = createContext<TdContextValue | null>(null)

/* ─── 5.  PROVIDER ──────────────────────────────────────────────────── */

export interface TradingDeskProviderProps {
  children: ReactNode
  /** Allows callers to override the initial defaults — useful for
   *  storybook stories or tests. */
  initialState?: Partial<TdPersistedState>
}

export function TradingDeskProvider({
  children,
  initialState,
}: TradingDeskProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL_STATE,
    ...initialState,
  })

  /* ── 5a. localStorage hydration on mount (client only) ─────────── */
  const hydrated = useRef(false)
  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true

    try {
      if (typeof window === "undefined") return

      // Read v3 first; fall back to the legacy v2 key one-shot.
      // After a successful v2 read, delete the v2 key so the next
      // mount goes straight through the v3 path. Either way the
      // HYDRATE reducer reconciles every field against the registry,
      // so the data we feed in just needs to be SAFE (typed, bounds-
      // checked) — not necessarily complete.
      let raw = window.localStorage.getItem(TD_STORAGE_KEY)
      let migratedFromV2 = false
      if (!raw) {
        const legacy = window.localStorage.getItem(TD_STORAGE_KEY_LEGACY_V2)
        if (legacy) {
          raw = legacy
          migratedFromV2 = true
        }
      }
      if (!raw) return
      const parsed = JSON.parse(raw) as Partial<TdPersistedState>
      // Only hydrate fields we recognise — guards against schema drift.
      const safe: Partial<TdState> = {}
      if (parsed.layout && ["split", "stacked", "chart-only", "minimized"].includes(parsed.layout)) {
        safe.layout = parsed.layout as TdLayoutMode
        if (parsed.layout !== "minimized") safe.lastNonMinLayout = parsed.layout as TdLayoutMode
      }
      if (typeof parsed.tvWidthPct === "number") safe.tvWidthPct = clampResize(parsed.tvWidthPct)
      // Side-slot id — accept any value defined in TD_SIDE_SLOT_LABELS
      // so we don't reject newly-added module ids.
      if (typeof parsed.sideSlot === "string" && parsed.sideSlot in TD_SIDE_SLOT_LABELS) {
        safe.sideSlot = parsed.sideSlot as TdSideSlot
      }
      if (parsed.sideSlotPosition === "left" || parsed.sideSlotPosition === "right") {
        safe.sideSlotPosition = parsed.sideSlotPosition
      }
      if (Array.isArray(parsed.slotFavorites)) {
        const cleaned = (parsed.slotFavorites as unknown[])
          .filter((s): s is TdSideSlot => typeof s === "string" && (s as string) in TD_SIDE_SLOT_LABELS)
        if (cleaned.length > 0) safe.slotFavorites = cleaned
      }
      if (typeof parsed.slotPeekEnabled === "boolean") safe.slotPeekEnabled = parsed.slotPeekEnabled
      if (typeof parsed.peekPanelWidth === "number" && Number.isFinite(parsed.peekPanelWidth)) {
        safe.peekPanelWidth = clampPeekPanelWidth(parsed.peekPanelWidth)
      }
      if (typeof parsed.symbolId === "string")   safe.symbolId   = parsed.symbolId
      if (typeof parsed.intervalId === "string") safe.intervalId = parsed.intervalId
      // Nav prefs — guard each one independently so a corrupt sub-field
      // doesn't sink the others.
      if (Array.isArray(parsed.navVisibleCategories)) {
        const cleaned = (parsed.navVisibleCategories as string[]).filter(
          (c): c is TdSymbolCategory => TD_CATEGORIES_ORDER.includes(c as TdSymbolCategory),
        )
        if (cleaned.length > 0) safe.navVisibleCategories = TD_CATEGORIES_ORDER.filter(c => cleaned.includes(c))
      }
      if (Array.isArray(parsed.navFavorites)) {
        safe.navFavorites = (parsed.navFavorites as unknown[]).filter(
          (x): x is string => typeof x === "string",
        )
      }
      if (Array.isArray(parsed.navRecents)) {
        safe.navRecents = (parsed.navRecents as unknown[])
          .filter((x): x is string => typeof x === "string")
          .slice(0, TD_RECENTS_LIMIT)
      }

      // ── Deck fields (v3+) — pass through raw; HYDRATE reconciles
      // each one against the registry. We do basic type guards here
      // to keep the reducer hot path clean.
      if (Array.isArray(parsed.deckOrder)) {
        safe.deckOrder = (parsed.deckOrder as unknown[]).filter(
          (s): s is TdSideSlot => typeof s === "string" && (s as string) in TD_SIDE_SLOT_LABELS,
        )
      }
      if (Array.isArray(parsed.deckHidden)) {
        safe.deckHidden = (parsed.deckHidden as unknown[]).filter(
          (s): s is TdSideSlot => typeof s === "string" && (s as string) in TD_SIDE_SLOT_LABELS,
        )
      }
      if (parsed.deckViewMode && typeof parsed.deckViewMode === "object" && !Array.isArray(parsed.deckViewMode)) {
        safe.deckViewMode = parsed.deckViewMode as Partial<Record<TdSideSlot, TdDeckViewMode>>
      }
      if (parsed.deckShortFields && typeof parsed.deckShortFields === "object" && !Array.isArray(parsed.deckShortFields)) {
        safe.deckShortFields = parsed.deckShortFields as Partial<Record<TdSideSlot, string[]>>
      }
      if (parsed.deckMaxItems && typeof parsed.deckMaxItems === "object" && !Array.isArray(parsed.deckMaxItems)) {
        safe.deckMaxItems = parsed.deckMaxItems as Partial<Record<TdSideSlot, number>>
      }
      // ── v3.1 dual-deck splitter ratio ────────────────────────────
      if (typeof parsed.dualDeckRatio === "number" && Number.isFinite(parsed.dualDeckRatio)) {
        safe.dualDeckRatio = clampDualDeckRatio(parsed.dualDeckRatio)
      }

      dispatch({ type: "HYDRATE", payload: safe })

      // One-shot migration finalisation: clean up the legacy v2 key
      // AFTER a successful HYDRATE so a JSON-parse failure (caught
      // below) leaves the legacy data in place for a future retry.
      if (migratedFromV2) {
        try { window.localStorage.removeItem(TD_STORAGE_KEY_LEGACY_V2) } catch { /* noop */ }
      }
    } catch {
      // Corrupt localStorage entry — silently ignore, defaults stand.
    }
  }, [])

  /* ── 5b. localStorage persistence on every mutation ────────────── */
  useEffect(() => {
    if (!hydrated.current) return
    if (typeof window === "undefined") return
    try {
      const persisted: TdPersistedState = {
        layout:               state.layout,
        tvWidthPct:           state.tvWidthPct,
        sideSlot:             state.sideSlot,
        sideSlotPosition:     state.sideSlotPosition,
        slotFavorites:        state.slotFavorites,
        slotPeekEnabled:      state.slotPeekEnabled,
        peekPanelWidth:       state.peekPanelWidth,
        symbolId:             state.symbolId,
        intervalId:           state.intervalId,
        navVisibleCategories: state.navVisibleCategories,
        navFavorites:         state.navFavorites,
        navRecents:           state.navRecents,
        deckOrder:            state.deckOrder,
        deckHidden:           state.deckHidden,
        deckViewMode:         state.deckViewMode,
        deckShortFields:      state.deckShortFields,
        deckMaxItems:         state.deckMaxItems,
        // v3.1 — dual-deck splitter ratio. Listed last so older readers
        // that only know v3 ignore it harmlessly.
        dualDeckRatio:        state.dualDeckRatio,
      }
      window.localStorage.setItem(TD_STORAGE_KEY, JSON.stringify(persisted))
    } catch {
      // Quota exceeded etc — non-critical, drop silently.
    }
  }, [
    state.layout,
    state.tvWidthPct,
    state.sideSlot,
    state.sideSlotPosition,
    state.slotFavorites,
    state.slotPeekEnabled,
    state.peekPanelWidth,
    state.symbolId,
    state.intervalId,
    state.navVisibleCategories,
    state.navFavorites,
    state.navRecents,
    state.deckOrder,
    state.deckHidden,
    state.deckViewMode,
    state.deckShortFields,
    state.deckMaxItems,
    state.dualDeckRatio,
  ])

  /* ── 5c. ESC closes fullscreen ─────────────────────────────────── */
  useEffect(() => {
    if (!state.isFullscreen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch({ type: "EXIT_FULLSCREEN" })
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [state.isFullscreen])

  /* ── 5d. memoised actions ──────────────────────────────────────── */
  const actions = useMemo<TdActions>(() => ({
    setLayout:              (m)   => dispatch({ type: "SET_LAYOUT",     payload: m   }),
    cycleLayout:            ()    => dispatch({ type: "CYCLE_LAYOUT" }),
    toggleMinimize:         ()    => dispatch({ type: "TOGGLE_MINIMIZE" }),
    expand:                 ()    => dispatch({ type: "EXPAND" }),
    setTvWidth:             (pct) => dispatch({ type: "SET_TV_WIDTH",   payload: pct }),
    setDragging:            (pct) => dispatch({ type: "SET_DRAGGING",   payload: pct }),
    setSideSlot:            (s)   => dispatch({ type: "SET_SIDE_SLOT",  payload: s   }),
    toggleSideSlot:         ()    => dispatch({ type: "TOGGLE_SIDE_SLOT" }),
    setSideSlotPosition:    (p)   => dispatch({ type: "SET_SIDE_SLOT_POSITION", payload: p }),
    toggleSideSlotPosition: ()    => dispatch({ type: "TOGGLE_SIDE_SLOT_POSITION" }),
    toggleSlotFavorite:     (s)   => dispatch({ type: "TOGGLE_SLOT_FAVORITE", payload: s }),
    setSlotFavorites:       (s)   => dispatch({ type: "SET_SLOT_FAVORITES", payload: s }),
    setPeekEnabled:         (e)   => dispatch({ type: "SET_PEEK_ENABLED", payload: e }),
    setPeekPanelWidth:      (px)  => dispatch({ type: "SET_PEEK_PANEL_WIDTH", payload: px }),
    applyPreset:            (id)  => dispatch({ type: "APPLY_PRESET", payload: id }),
    pinPeek:                ()    => dispatch({ type: "PIN_PEEK" }),
    setSymbol:              (id)  => dispatch({ type: "SET_SYMBOL",     payload: id  }),
    setInterval:            (id)  => dispatch({ type: "SET_INTERVAL",   payload: id  }),
    toggleFullscreen:       ()    => dispatch({ type: "TOGGLE_FULLSCREEN" }),
    exitFullscreen:         ()    => dispatch({ type: "EXIT_FULLSCREEN" }),
    nav: {
      toggleCategory:       (c)    => dispatch({ type: "NAV_TOGGLE_CATEGORY", payload: c }),
      setVisibleCategories: (next) => dispatch({ type: "NAV_SET_VISIBLE_CATEGORIES", payload: next }),
      toggleFavorite:       (id)   => dispatch({ type: "NAV_TOGGLE_FAVORITE", payload: id }),
      clearRecents:         ()     => dispatch({ type: "NAV_CLEAR_RECENTS" }),
    },
    deck: {
      setOrder:         (ids)         => dispatch({ type: "DECK_SET_ORDER",          payload: ids }),
      toggleHidden:     (id)          => dispatch({ type: "DECK_TOGGLE_HIDDEN",      payload: id }),
      setHidden:        (id, hidden)  => dispatch({ type: "DECK_SET_HIDDEN",         payload: { id, hidden } }),
      setViewMode:      (id, mode)    => dispatch({ type: "DECK_SET_VIEW_MODE",      payload: { id, mode } }),
      toggleViewMode:   (id)          => dispatch({ type: "DECK_TOGGLE_VIEW_MODE",   payload: id }),
      setShortFields:   (id, fields)  => dispatch({ type: "DECK_SET_SHORT_FIELDS",   payload: { id, fields } }),
      toggleShortField: (id, fieldId) => dispatch({ type: "DECK_TOGGLE_SHORT_FIELD", payload: { id, fieldId } }),
      setMaxItems:      (id, count)   => dispatch({ type: "DECK_SET_MAX_ITEMS",      payload: { id, count } }),
      resetModule:      (id)          => dispatch({ type: "DECK_RESET_MODULE",       payload: id }),
      resetAll:         ()            => dispatch({ type: "DECK_RESET_ALL" }),
      setDualRatio:     (r)           => dispatch({ type: "DECK_SET_DUAL_RATIO",     payload: r }),
      resetDualRatio:   ()            => dispatch({ type: "DECK_RESET_DUAL_RATIO" }),
    },
  }), [])

  /* ── 5e. memoised selectors ─────────────────────────────────────── */
  const selectors = useMemo<TdSelectors>(() => {
    // Resolve every deck card once. The reducer guarantees deckOrder
    // contains only known ids (HYDRATE + DECK_SET_ORDER both filter),
    // but tryGetModuleById defends against a stale-HMR snapshot.
    const cards: TdDeckCard[] = []
    for (const id of state.deckOrder ?? []) {
      const entry = tryGetModuleById(id)
      if (!entry) continue
      const persistedFields = state.deckShortFields?.[id]
      const shortFields = Array.isArray(persistedFields) && persistedFields.length > 0
        ? reconcileShortFields(id, persistedFields)
        : [...entry.defaultShortFields]
      const persistedMax = state.deckMaxItems?.[id]
      const maxItems = entry.supportsListMode
        ? reconcileMaxItems(id, persistedMax ?? null)
        : null
      cards.push({
        id,
        entry,
        viewMode:    state.deckViewMode?.[id] ?? "short",
        shortFields,
        maxItems,
        hidden:      (state.deckHidden ?? []).includes(id),
      })
    }

    return {
      currentSymbol:   getSymbolById(state.symbolId),
      currentInterval: getIntervalById(state.intervalId),
      hasSideSlot:     state.layout === "split" || state.layout === "stacked",
      hasChart:        state.layout !== "minimized" || state.isFullscreen,
      // Defensive fallback to [] — a stale-HMR snapshot or a localStorage
      // entry written before nav fields existed can leave these as
      // `undefined` for one render before the heal kicks in.
      favoriteSymbols: (state.navFavorites ?? [])
        .map(id => getSymbolById(id))
        // De-duplicate by id while preserving pin order.
        .filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i),
      recentSymbols:   (state.navRecents ?? [])
        .filter(id => id !== state.symbolId)
        .map(id => getSymbolById(id))
        .filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i),
      deckCards:        cards,
      visibleDeckCards: cards.filter(c => !c.hidden),
    }
  }, [
    state.symbolId,
    state.intervalId,
    state.layout,
    state.isFullscreen,
    state.navFavorites,
    state.navRecents,
    state.deckOrder,
    state.deckHidden,
    state.deckViewMode,
    state.deckShortFields,
    state.deckMaxItems,
  ])

  const value = useMemo<TdContextValue>(
    () => ({ state, actions, selectors }),
    [state, actions, selectors],
  )

  return <TdContext.Provider value={value}>{children}</TdContext.Provider>
}

/* ─── 6.  PUBLIC HOOK ───────────────────────────────────────────────── */

export function useTradingDesk(): TdContextValue {
  const ctx = useContext(TdContext)
  if (!ctx) {
    throw new Error(
      "[trading-desk] useTradingDesk() must be called inside <TradingDeskProvider/>. " +
      "Mount the provider once near the top of YourSpaceContent so every leaf can read the same store.",
    )
  }
  return ctx
}

/* ─── 7.  SLIM CONVENIENCE HOOKS ────────────────────────────────────── */

export function useTdLayout()       { return useTradingDesk().state.layout }
export function useTdSymbol()       { return useTradingDesk().selectors.currentSymbol }
export function useTdInterval()     { return useTradingDesk().selectors.currentInterval }
export function useTdSideSlot()     { return useTradingDesk().state.sideSlot }
export function useTdActions()      { return useTradingDesk().actions }
export function useTdIsFullscreen() { return useTradingDesk().state.isFullscreen }

/** Resolved deck-below-chart view. The hook every deck renderer
 *  should call: it returns the trader-ordered, registry-reconciled
 *  card list along with the deck actions, in one stable shape.
 *
 *  Usage:
 *    const { cards, visibleCards, actions } = useDeck()
 *    visibleCards.map(card => <DeckCard key={card.id} card={card} />)
 *    actions.toggleViewMode("live-equity")
 *
 *  The returned object is memoised against the underlying state so a
 *  card whose config didn't change doesn't trigger child re-renders. */
export function useDeck(): {
  cards:        TdDeckCard[]
  visibleCards: TdDeckCard[]
  actions:      TdDeckActions
  /** LEFT-side fraction (0..1) for the dual-stage deck row's vertical
   *  splitter. The renderer reads this to drive the row's grid template
   *  and the splitter primitive reads it to position its handle. */
  dualDeckRatio: number
} {
  const { state, selectors, actions } = useTradingDesk()
  return useMemo(
    () => ({
      cards:         selectors.deckCards,
      visibleCards:  selectors.visibleDeckCards,
      actions:       actions.deck,
      dualDeckRatio: state.dualDeckRatio,
    }),
    [selectors.deckCards, selectors.visibleDeckCards, actions.deck, state.dualDeckRatio],
  )
}
