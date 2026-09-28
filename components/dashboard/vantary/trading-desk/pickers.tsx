"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  TRADING DESK · HEADER PICKERS
 *  ─────────────────────────────────────────────────────────────────────────
 *  Three small components that live in the bay header strip:
 *
 *    SymbolPicker  — clickable pill that opens a category-grouped
 *                    dropdown of every TdSymbol in DEMO_SYMBOLS, with a
 *                    text-search filter. Editorial hairline rows.
 *
 *    IntervalPicker — horizontal chip strip of every TdInterval, with
 *                    layoutId underline animating between active items.
 *
 *    LayoutModeChips — the 4-mode chip strip (SPLIT · STACKED · CHART
 *                    · MIN). Same layoutId underline pattern as the
 *                    Strategy OS tab strip.
 *
 *  Every interactive surface has aria-labels, keyboard support, and
 *  obeys VANTARY tone tokens (no hard-coded colors).
 * ═══════════════════════════════════════════════════════════════════════ */

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  Search,
  X,
  Maximize2,
  Minus,
  Plus,
  ArrowLeftRight,
  Eye,
  EyeOff,
} from "lucide-react"

import { useTradingDesk } from "./provider"
import {
  DEMO_SYMBOLS,
  DEMO_INTERVALS,
  TD_LAYOUT_MODES_ORDER,
  TD_LAYOUT_LABELS,
  TD_SIDE_SLOT_LABELS,
  TD_SIDE_SLOT_SHORT_LABELS,
  TD_DEFAULT_FAVORITE_SLOTS,
  TdSymbol,
  TdLayoutMode,
  TdSideSlot,
} from "./data"
import { VANTARY } from "../vantary-theme"

/* ──────────────────────────────────────────────────────────────────────
 *  1. SYMBOL PICKER
 * ────────────────────────────────────────────────────────────────── */

export const SymbolPicker = memo(function SymbolPicker() {
  const { selectors, actions } = useTradingDesk()
  const current = selectors.currentSymbol

  const [open, setOpen]     = useState(false)
  const [query, setQuery]   = useState("")
  const rootRef = useRef<HTMLDivElement | null>(null)

  /* Close on outside click + ESC */
  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDoc)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q
      ? DEMO_SYMBOLS.filter(s =>
          s.displayName.toLowerCase().includes(q) ||
          s.tvSymbol.toLowerCase().includes(q)   ||
          s.quote.toLowerCase().includes(q),
        )
      : DEMO_SYMBOLS

    // Group by category, preserving DEMO_SYMBOLS' source order.
    const map = new Map<TdSymbol["category"], TdSymbol[]>()
    for (const s of filtered) {
      const arr = map.get(s.category) ?? []
      arr.push(s)
      map.set(s.category, arr)
    }
    return Array.from(map.entries())
  }, [query])

  return (
    <div ref={rootRef} className="relative">
      {/* Trigger pill */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Change symbol — currently ${current.displayName}`}
        className="flex items-center gap-2 font-mono uppercase tabular-nums"
        style={{
          padding:       "5px 10px",
          fontSize:      11,
          letterSpacing: "0.18em",
          color:         VANTARY.paper,
          background:    open ? VANTARY.amberWash : "transparent",
          border:        `1px solid ${open ? VANTARY.amberHalo : VANTARY.rule}`,
          borderRadius:  3,
          cursor:        "pointer",
          transition:    "background 0.18s, border-color 0.18s",
        }}
      >
        <span style={{ color: VANTARY.amber, fontWeight: 500 }}>
          {current.quote}
        </span>
        <ChevronDown size={11} strokeWidth={1.6} color={VANTARY.ash} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            role="listbox"
            aria-label="Symbol picker"
            style={{
              position:   "absolute",
              top:        "calc(100% + 6px)",
              left:       0,
              width:      280,
              maxHeight:  420,
              overflowY:  "auto",
              background: VANTARY.ink ?? VANTARY.paper,
              border:     `1px solid ${VANTARY.rule}`,
              borderRadius: 4,
              boxShadow:  "0 8px 32px rgba(0,0,0,0.35)",
              zIndex:     50,
            }}
          >
            {/* Search input */}
            <div
              className="flex items-center gap-2 px-3 py-2"
              style={{ borderBottom: `1px solid ${VANTARY.rule}` }}
            >
              <Search size={12} strokeWidth={1.5} color={VANTARY.ashSoft} />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search symbol…"
                className="flex-1 font-sans bg-transparent outline-none"
                style={{
                  fontSize:   12,
                  color:      VANTARY.paper,
                  border:     "none",
                }}
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <X size={12} strokeWidth={1.5} color={VANTARY.ashSoft} />
                </button>
              )}
            </div>

            {/* Grouped list */}
            {grouped.length === 0 ? (
              <div
                className="font-sans italic px-3 py-4 text-center"
                style={{ fontSize: 12, color: VANTARY.paperDim }}
              >
                No symbols match &quot;{query}&quot;.
              </div>
            ) : (
              grouped.map(([cat, items]) => (
                <div key={cat}>
                  <div
                    className="font-mono uppercase px-3 py-1.5"
                    style={{
                      fontSize:      9.5,
                      letterSpacing: "0.24em",
                      color:         VANTARY.ashSoft,
                      background:    VANTARY.rule,
                      opacity:       0.65,
                    }}
                  >
                    {cat}
                  </div>
                  {items.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      role="option"
                      aria-selected={s.id === current.id}
                      onClick={() => {
                        actions.setSymbol(s.id)
                        setOpen(false)
                        setQuery("")
                      }}
                      className="flex items-center gap-2 w-full text-left"
                      style={{
                        padding:    "8px 12px",
                        background: s.id === current.id ? VANTARY.amberWash : "transparent",
                        border:     "none",
                        borderBottom: `1px dashed ${VANTARY.rule}`,
                        cursor:     "pointer",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={e => {
                        if (s.id !== current.id) {
                          (e.currentTarget as HTMLElement).style.background = VANTARY.rule
                        }
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = s.id === current.id ? VANTARY.amberWash : "transparent"
                      }}
                    >
                      <span
                        className="font-sans flex-1"
                        style={{
                          fontSize: 12.5,
                          color: s.id === current.id ? VANTARY.amber : VANTARY.paper,
                          fontWeight: s.id === current.id ? 500 : 400,
                        }}
                      >
                        {s.displayName}
                      </span>
                      <span
                        className="font-mono tabular-nums"
                        style={{
                          fontSize: 11,
                          color: s.id === current.id ? VANTARY.amber : VANTARY.ashSoft,
                        }}
                      >
                        {s.fakeLast?.toLocaleString("en-US", { maximumFractionDigits: 4 })}
                      </span>
                    </button>
                  ))}
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

/* ──────────────────────────────────────────────────────────────────────
 *  2. INTERVAL PICKER
 * ────────────────────────────────────────────────────────────────── */

export const IntervalPicker = memo(function IntervalPicker() {
  const { selectors, actions } = useTradingDesk()
  const current = selectors.currentInterval

  return (
    <div
      role="radiogroup"
      aria-label="Chart interval"
      className="flex items-center"
      style={{
        gap:          1,
        padding:      2,
        background:   VANTARY.rule,
        borderRadius: 4,
      }}
    >
      {DEMO_INTERVALS.map(iv => {
        const active = iv.id === current.id
        return (
          <button
            key={iv.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`Interval ${iv.label}`}
            onClick={() => actions.setInterval(iv.id)}
            className="font-mono uppercase tabular-nums relative"
            style={{
              padding:       "4px 8px",
              fontSize:      10,
              letterSpacing: "0.16em",
              color:         active ? VANTARY.amber : VANTARY.ashSoft,
              fontWeight:    active ? 500 : 400,
              background:    active ? (VANTARY.ink ?? VANTARY.paper) : "transparent",
              border:        "none",
              borderRadius:  2,
              cursor:        "pointer",
              transition:    "color 0.18s, background 0.18s",
            }}
          >
            {active && (
              <motion.span
                aria-hidden
                layoutId="td-interval-underline"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: VANTARY.amberWash,
                  border: `1px solid ${VANTARY.amberHalo}`,
                  borderRadius: 2,
                  zIndex: 0,
                }}
                transition={{ type: "spring", stiffness: 360, damping: 32 }}
              />
            )}
            <span style={{ position: "relative", zIndex: 1 }}>{iv.label}</span>
          </button>
        )
      })}
    </div>
  )
})

/* ──────────────────────────────────────────────────────────────────────
 *  3. LAYOUT-MODE CHIPS
 * ────────────────────────────────────────────────────────────────── */

export interface LayoutModeChipsProps {
  /** Tighter visual sizing for inline use in a packed header row. */
  compact?: boolean
}

export const LayoutModeChips = memo(function LayoutModeChips({
  compact = false,
}: LayoutModeChipsProps = {}) {
  const { state, actions } = useTradingDesk()

  return (
    <div
      role="radiogroup"
      aria-label="Bay layout mode"
      className="flex items-center"
      style={{
        gap:          1,
        padding:      compact ? 1.5 : 2,
        background:   VANTARY.rule,
        borderRadius: compact ? 3 : 4,
      }}
    >
      {TD_LAYOUT_MODES_ORDER.map(mode => {
        const active = mode === state.layout
        const def    = TD_LAYOUT_LABELS[mode]
        return (
          <button
            key={mode}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`Layout ${def.label}`}
            onClick={() => actions.setLayout(mode)}
            className="font-mono uppercase tabular-nums relative"
            style={{
              /* M6 · tighter compact dims so the chip group reads as
               * one tight micro-toggle inline with the surrounding
               * rail typography. Compact mode now uses chipFillHi for
               * active state to match the brand-chip family in the
               * VantaryHeader above us. */
              padding:       compact ? "3px 7px" : "4px 9px",
              fontSize:      compact ? 9 : 10,
              letterSpacing: compact ? "0.16em" : "0.18em",
              color:         active ? VANTARY.amber : VANTARY.ashSoft,
              fontWeight:    active ? 500 : 400,
              background:    active
                ? (compact ? VANTARY.chipFillHi : (VANTARY.ink ?? VANTARY.paper))
                : "transparent",
              border:        "none",
              borderRadius:  2,
              cursor:        "pointer",
              transition:    "color 0.18s, background 0.18s",
            }}
          >
            {active && (
              <motion.span
                aria-hidden
                layoutId="td-layout-underline"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: VANTARY.amberWash,
                  border: `1px solid ${VANTARY.amberHalo}`,
                  borderRadius: 2,
                  zIndex: 0,
                }}
                transition={{ type: "spring", stiffness: 360, damping: 32 }}
              />
            )}
            <span style={{ position: "relative", zIndex: 1 }}>{def.label}</span>
          </button>
        )
      })}
    </div>
  )
})

/* ───────���───────────────────────────────────�����─────────────────────────
 *  3b. SIDE-SLOT CHIPS  ·  ACTIVE WINDOWS / LIVE EQUITY
 *  ─────────────────────────────────────────────────────────────────
 *  This used to live as a 2-pill toggle at the top of the side panel
 *  itself. We moved it up into the bay header — directly next to the
 *  layout-mode chips — so the side panel itself can use its full height
 *  to render the real LIVE EQUITY VOLUME and ACTIVE WINDOWS modules
 *  (rather than burning ~32px of vertical real-estate on a switcher
 *  that always hugged the same control rail anyway).
 *
 *  Visual language matches `<LayoutModeChips/>` deliberately so the two
 *  read as a single "Layout · Slot" control group.
 * ────────────────────────────────────────────────────────────────── */

export interface SideSlotChipsProps {
  /** When true, renders the chip group at a tighter scale — used when
   *  the chips need to fit inline with categories + window controls in
   *  a single consolidated header row. Default visual sizing is left
   *  alone so the dozens of other call-sites aren't affected. */
  compact?: boolean
  /** Optional short labels — when provided, override the long
   *  `TD_SIDE_SLOT_LABELS` text. By default we use TD_SIDE_SLOT_SHORT_LABELS
   *  in compact mode and TD_SIDE_SLOT_LABELS otherwise. */
  shortLabels?: Partial<Record<TdSideSlot, string>>
}

export const SideSlotChips = memo(function SideSlotChips({
  compact     = false,
  shortLabels,
}: SideSlotChipsProps = {}) {
  const { state, actions, selectors } = useTradingDesk()
  const disabled = !selectors.hasSideSlot

  // The chips render the trader's favourites (configured from the
  // customize popover). The rest of the module library lives behind
  // the customize button. Falls back to the default favourites if
  // somehow the slotFavorites list is empty.
  const order: readonly TdSideSlot[] =
    state.slotFavorites && state.slotFavorites.length > 0
      ? state.slotFavorites
      : TD_DEFAULT_FAVORITE_SLOTS

  return (
    <div
      role="radiogroup"
      aria-label="Side panel content"
      aria-disabled={disabled || undefined}
      className="flex items-center"
      style={{
        gap:          1,
        padding:      compact ? 1.5 : 2,
        background:   VANTARY.rule,
        borderRadius: compact ? 3 : 4,
        opacity:      disabled ? 0.55 : 1,
        // Important: in chart-only mode the chips must remain CLICKABLE
        // (clicking promotes layout to split + selects that slot). The
        // legacy `pointerEvents: none` made them dead in chart mode,
        // which broke the customize-from-rail flow. Now we keep them
        // alive but visually dim.
        transition:   "opacity 0.18s",
      }}
      title={disabled ? "Click to open this module — chart will split" : undefined}
    >
      {order.map(slot => {
        const active = slot === state.sideSlot && !disabled
        const label  = shortLabels?.[slot]
          ?? (compact ? TD_SIDE_SLOT_SHORT_LABELS[slot] : TD_SIDE_SLOT_LABELS[slot])
        return (
          <button
            key={slot}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`Side panel — ${TD_SIDE_SLOT_LABELS[slot]}`}
            onClick={() => {
              // If chart-only is active, promote to split first so the
              // chosen slot becomes visible; otherwise just swap content.
              if (state.layout === "chart-only") {
                actions.pinPeek()
              }
              actions.setSideSlot(slot)
            }}
            className="font-mono uppercase tabular-nums relative whitespace-nowrap"
            style={{
              /* M6 · matched to LayoutModeChips above. */
              padding:       compact ? "3px 7px" : "4px 9px",
              fontSize:      compact ? 9 : 10,
              letterSpacing: compact ? "0.16em" : "0.18em",
              color:         active ? VANTARY.amber : VANTARY.ashSoft,
              fontWeight:    active ? 500 : 400,
              background:    active
                ? (compact ? VANTARY.chipFillHi : (VANTARY.ink ?? VANTARY.paper))
                : "transparent",
              border:        "none",
              borderRadius:  2,
              cursor:        "pointer",
              transition:    "color 0.18s, background 0.18s",
            }}
          >
            {active && (
              <motion.span
                aria-hidden
                layoutId="td-slot-chips-underline"
                style={{
                  position:     "absolute",
                  inset:        0,
                  background:   VANTARY.amberWash,
                  border:       `1px solid ${VANTARY.amberHalo}`,
                  borderRadius: 2,
                  zIndex:       0,
                }}
                transition={{ type: "spring", stiffness: 360, damping: 32 }}
              />
            )}
            <span style={{ position: "relative", zIndex: 1 }}>
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
})

/* ──────────────────────────────────────────────────────────────────────
 *  4. WINDOW CONTROLS — minimize / expand / fullscreen
 *  ─────────────────────────────────────────────────────────────────
 *  A small icon group on the right of the bay header. Mac-toolbar
 *  inspired ergonomics: one button for each common operation, all
 *  styled as identical hairline circles to read as a "set".
 * ────────────────────────────────────────────────────────────────── */

export const WindowControls = memo(function WindowControls() {
  const { state, actions } = useTradingDesk()
  const isMin = state.layout === "minimized"

  const Btn = useCallback(
    ({
      label,
      onClick,
      children,
    }: {
      label: string
      onClick: () => void
      children: React.ReactNode
    }) => (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className="flex items-center justify-center rounded-full"
        style={{
          width:      24,
          height:     24,
          border:     `1px solid ${VANTARY.rule}`,
          background: "transparent",
          cursor:     "pointer",
          transition: "background 0.18s, border-color 0.18s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background    = VANTARY.amberWash
          ;(e.currentTarget as HTMLElement).style.borderColor   = VANTARY.amberHalo
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background    = "transparent"
          ;(e.currentTarget as HTMLElement).style.borderColor   = VANTARY.rule
        }}
      >
        {children}
      </button>
    ),
    [],
  )

  return (
    <div className="flex items-center gap-1.5">
      <Btn
        label={isMin ? "Expand bay" : "Minimize bay"}
        onClick={actions.toggleMinimize}
      >
        {isMin
          ? <Plus  size={11} strokeWidth={1.6} color={VANTARY.ash} />
          : <Minus size={11} strokeWidth={1.6} color={VANTARY.ash} />}
      </Btn>
      <Btn
        label={state.isFullscreen ? "Exit fullscreen" : "Fullscreen chart"}
        onClick={actions.toggleFullscreen}
      >
        <Maximize2 size={10} strokeWidth={1.6} color={VANTARY.ash} />
      </Btn>
    </div>
  )
})

/* ──────────────────────────────────────────────────────────────────────
 *  4b. SIDE-SLOT POSITION TOGGLE  ·  ◀ LEFT │ RIGHT ▶
 *  ─────────────────────────────────────────────────────────────────
 *  A single icon button — clicking flips the side slot between LEFT
 *  and RIGHT. Visual is an arrow-left-right symbol with a tiny dot
 *  indicating the current side. Lives next to the layout chips.
 * ────────────────────────────────────────────────────────────────── */

export const SidePositionToggle = memo(function SidePositionToggle() {
  const { state, actions } = useTradingDesk()
  const isLeft = state.sideSlotPosition === "left"

  return (
    <button
      type="button"
      onClick={actions.toggleSideSlotPosition}
      aria-label={`Move side panel to ${isLeft ? "right" : "left"}`}
      title={`Side panel: ${isLeft ? "LEFT" : "RIGHT"} — click to flip`}
      className="flex items-center gap-1.5 font-mono uppercase tabular-nums whitespace-nowrap"
      style={{
        padding:       "3px 7px",
        fontSize:      9,
        letterSpacing: "0.16em",
        color:         VANTARY.ashSoft,
        background:    "transparent",
        border:        `1px solid ${VANTARY.rule}`,
        borderRadius:  3,
        cursor:        "pointer",
        transition:    "color 0.18s, background 0.18s, border-color 0.18s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background  = VANTARY.amberWash
        ;(e.currentTarget as HTMLElement).style.borderColor = VANTARY.amberHalo
        ;(e.currentTarget as HTMLElement).style.color       = VANTARY.amber
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background  = "transparent"
        ;(e.currentTarget as HTMLElement).style.borderColor = VANTARY.rule
        ;(e.currentTarget as HTMLElement).style.color       = VANTARY.ashSoft
      }}
    >
      <ArrowLeftRight size={10} strokeWidth={1.6} />
      <span>{isLeft ? "L" : "R"}</span>
    </button>
  )
})

/* ──────────────────────────────────────────────────────────────────────
 *  4c. PEEK TOGGLE  ·  global "auto-hide side panel" switch
 *  ─────────────────────────────────────────────────────────────────
 *  When ENABLED (eye-off icon · amber): the side panel is HIDDEN by
 *  default in BOTH split and chart layouts. The trader hovers the
 *  chart's slot-side edge to slide the panel in (real flex squeeze —
 *  TradingView shrinks to make room, panel doesn't overlay). Cursor
 *  leaves → panel slides back out, chart reclaims the width.
 *
 *  When DISABLED (eye icon · neutral): the side panel is permanently
 *  visible — split mode shows it, chart-only hides it with no peek.
 *
 *  This is the same UX grammar as "Marcus Big scroll-up to reveal":
 *  hidden-by-default + reveal-on-intent.
 * ────────────────────────────────────────────────────────────────── */

export const PeekToggle = memo(function PeekToggle() {
  const { state, actions } = useTradingDesk()
  const enabled = state.slotPeekEnabled

  return (
    <button
      type="button"
      onClick={() => actions.setPeekEnabled(!enabled)}
      aria-pressed={enabled}
      aria-label={enabled ? "Auto-hide ON — click to keep panel always visible" : "Auto-hide OFF — click to hide panel by default"}
      title={
        enabled
          ? "Auto-hide: ON — panel hidden, hover edge to reveal"
          : "Auto-hide: OFF — panel always visible"
      }
      className="flex items-center justify-center"
      style={{
        width:         22,
        height:        22,
        padding:       0,
        background:    enabled ? VANTARY.amberWash : "transparent",
        border:        `1px solid ${enabled ? VANTARY.amberHalo : VANTARY.rule}`,
        borderRadius:  3,
        cursor:        "pointer",
        transition:    "background 0.18s, border-color 0.18s",
      }}
    >
      {/* Icon semantics: when auto-hide is ON, the panel is hidden, so
          we show the EyeOff (hidden) glyph in amber. When auto-hide is
          OFF, the panel is visible, so we show the Eye glyph in ash. */}
      {enabled
        ? <EyeOff size={11} strokeWidth={1.6} color={VANTARY.amber} />
        : <Eye    size={11} strokeWidth={1.6} color={VANTARY.ashSoft} />}
    </button>
  )
})

/* ──────────────────────────────────────────────────────────────────────
 *  5. EYEBROW + PRICE TICKER (used in the minimized strip)
 *  ─────────────────────────────────────────────────────────────────
 *  When the bay is collapsed to its 36px-tall hairline strip, this is
 *  what fills it. Just enough to give the trader a "what's the chart
 *  doing right now?" glance even when the bay is closed.
 * ──────────────────────────────────────────────────────────────���─── */

export const MiniTicker = memo(function MiniTicker() {
  const { selectors } = useTradingDesk()
  const sym = selectors.currentSymbol
  const itv = selectors.currentInterval

  const last = sym.fakeLast?.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }) ?? "—"
  const chg = sym.fakeChangePct ?? 0
  const isUp = chg >= 0

  return (
    <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
      <span
        className="font-mono uppercase whitespace-nowrap"
        style={{
          fontSize: 9.5, letterSpacing: "0.32em",
          color: VANTARY.amber, fontWeight: 500,
        }}
      >
        TRADING DESK
      </span>
      <span aria-hidden style={{ width: 1, height: 11, background: VANTARY.rule }} />

      <span
        className="font-mono uppercase tabular-nums whitespace-nowrap"
        style={{ fontSize: 11, color: VANTARY.paper, fontWeight: 500, letterSpacing: "0.1em" }}
      >
        {sym.quote}
      </span>
      <span
        className="font-mono tabular-nums whitespace-nowrap"
        style={{ fontSize: 11, color: VANTARY.paper }}
      >
        {last}
      </span>
      <span
        className="font-mono tabular-nums whitespace-nowrap"
        style={{ fontSize: 11, color: isUp ? VANTARY.amber : VANTARY.paperDim, fontWeight: 500 }}
      >
        {isUp ? "▲" : "▼"} {Math.abs(chg).toFixed(2)}%
      </span>

      <span aria-hidden style={{ flex: 1, height: 1, background: VANTARY.rule, minWidth: 24, opacity: 0.6 }} />

      <span
        className="font-mono uppercase whitespace-nowrap"
        style={{ fontSize: 9.5, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
      >
        {itv.label} · COLLAPSED
      </span>
    </div>
  )
})
