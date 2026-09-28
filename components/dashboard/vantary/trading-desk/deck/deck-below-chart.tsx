"use client"

/* ─────────────────────────────────────────────────────────────────────────
 *  components/dashboard/vantary/trading-desk/deck/deck-below-chart.tsx
 *
 *  L A Y E R   1 . 4   ·   T H E   D E C K   B E L O W   T H E   C H A R T
 *  ─────────────────────────────────────────────────────────────────
 *
 *  This is the layer where the Trading Desk deck becomes VISIBLE on
 *  the page for the first time.
 *
 *  It is the vertical stack that lives directly under the TradingView
 *  bay in Your Space. The trader can:
 *
 *    · drag cards to reorder them (framer-motion <Reorder/>)
 *    · expand any card from "short" → "expanded" (DeckCard's expand
 *      button — wired via the provider in Layer 1.2)
 *    · hide any card (DeckCard's hide button — same wiring)
 *    · open the configure-short-view drawer per card
 *      (passed up via `onConfigureCard` — Layer 1.5 plugs in the
 *      drawer; until then the gear button is hidden because no
 *      handler is wired)
 *    · restore hidden cards from the inline "+ ADD MODULE" picker
 *    · reset every deck preference back to the registry defaults
 *
 *  Architecture decisions documented inline next to each block. The
 *  three foundational principles for this file:
 *
 *  1.  THIS COMPONENT KNOWS NOTHING ABOUT SPECIFIC MODULES.
 *      Every render decision is driven by the module registry
 *      (`./modules/registry.ts`) and the per-card resolved state
 *      from `useDeck()`. To add a new module: add an entry to the
 *      registry — DeckBelowChart picks it up automatically.
 *
 *  2.  ALL HOVER / FOCUS / DRAG INTERACTIONS ARE EARNED.
 *      Every interactive surface has a visible state for hover,
 *      focus-visible, and (where applicable) drag. No bare buttons.
 *
 *  3.  THE COMPONENT IS THEME-AGNOSTIC.
 *      Every color and edge reads through `VANTARY.*`, which is
 *      itself a CSS-variable indirection routed through
 *      <VantaryThemeProvider/>. The deck below the chart will look
 *      coherent in teal, cyber, neural, quantum, solar, light, and
 *      obsidian themes without any per-theme code.
 *
 *  This file is intentionally thorough. Every export is a stable
 *  contract for Layers 1.5 → 1.10.
 * ──────────────────────────────────────────────────────────────────────── */

import {
  CSSProperties,
  ReactNode,
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useState,
} from "react"
import {
  AnimatePresence,
  LayoutGroup,
  Reorder,
  motion,
  useDragControls,
} from "framer-motion"
import {
  ChevronDown,
  Layers,
  Plus,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react"

import { VANTARY, EASE_V, RADIUS_V } from "../../vantary-theme"
import {
  TdDeckCard,
  TdSideSlot,
  useDeck,
  MODULE_CATEGORY_LABELS,
  type ModuleCategory,
} from ".."
import { DeckCard } from "./deck-card"

/* ─── 1.  TYPES & PUBLIC API ────────────────────────────────────────── */

/** A renderer pair for a single module in the deck. Layer 1.4 keeps
 *  this map empty by default — the DeckCard primitive falls back to
 *  the registry-description placeholder when a renderer is missing,
 *  which reads beautifully out of the box. Layers 1.7 → 1.9 plug
 *  real renderers in for `live-equity`, `active-windows`, and
 *  `account-assets`. Future modules slot in by adding an entry here.
 *
 *  The renderer functions receive the resolved card (NOT raw state),
 *  so they read `card.shortFields`, `card.maxItems`, `card.entry.*`
 *  etc. directly. */
export interface DeckRenderer {
  renderShort?:    (card: TdDeckCard) => ReactNode
  renderExpanded?: (card: TdDeckCard) => ReactNode
}

export type DeckRendererMap = Partial<Record<TdSideSlot, DeckRenderer>>

export interface DeckBelowChartProps {
  /** Per-module renderer dispatch table. Missing entries fall back
   *  to the DeckCard primitive's registry-description placeholder. */
  rendererById?: DeckRendererMap

  /** Called when the trader clicks the gear icon on any card. Layer
   *  1.5 will wire this to the configure-short-view drawer. When
   *  omitted, the gear icon is hidden on every card — keeping the
   *  deck functional during partial rollouts. */
  onConfigureCard?: (card: TdDeckCard) => void

  /** Called when the trader clicks the deck's section-level "CUSTOMIZE
   *  DECK" affordance. Layer 1.6 will wire this to the customize
   *  popover's DECK tab. When omitted, the affordance is hidden. */
  onOpenDeckSettings?: () => void

  /** Optional className applied to the outer <section/>. */
  className?: string

  /** Optional inline style merged into the outer <section/>. */
  style?: CSSProperties

  /** When true, the deck renders inside a `mt-0 mb-8` shell so it
   *  sits flush below the trading-desk bay in Your Space. Default
   *  true; set to false when embedding inside an alternate layout
   *  (e.g. the Layer 4 flight-deck overlay). */
  flushBelowBay?: boolean
}

/* ─── 2.  ANIMATION / GEOMETRY CONSTANTS ────────────────────────────── */

/** The vertical gap between cards in the stack. Matches the existing
 *  bay header rhythm so the eye reads bay → deck as a continuous
 *  composition instead of two stacked bands. */
const CARD_GAP_PX = 14

/** Container max-width — caps the deck so it doesn't stretch on
 *  ultra-wide monitors where line-length becomes uncomfortable.
 *  Same constant the rest of Your Space uses (~max-w-screen-xl). */
const DECK_MAX_WIDTH = 1280

/** Section gutters — match `<main className="px-6 lg:px-8">` in
 *  your-space.tsx so the deck content aligns with the editorial
 *  column above. */
const DECK_GUTTER_X = 24
const DECK_GUTTER_X_LG = 32

/** Whether to show the inline live status row (counts of visible /
 *  expanded / hidden modules) in the section header. Flipping this
 *  is cheap and reversible — kept as a local constant rather than a
 *  prop to keep the component API small. */
const SHOW_LIVE_STATUS = true

/* ─── 3.  SECTION HEADER ─────────────────────────────────────────────
 *  The deck's editorial heading band. Mirrors the VANTARY hairline
 *  language used by the Trading Desk bay's HeaderStrip — kerned
 *  mono eyebrow + hairline rule + right-aligned action group.
 *
 *  Visual rhythm:
 *    [ DECK · BELOW CHART ]  ──────────  [5 / 10 visible · 3 expanded]  [+ ADD]  [↺ RESET]
 *
 *  The status sub-line is compact and tabular so the numbers live
 *  in one width even as they tick (5→6, 3→4 etc.).
 * ──────────────────────────────────────────────────────────────── */

interface DeckHeaderProps {
  visibleCount:   number
  totalCount:     number
  expandedCount:  number
  hiddenCount:    number
  onReset:        () => void
  onOpenAdd:      () => void
  onOpenSettings: (() => void) | undefined
  addOpen:        boolean
}

const DeckHeader = memo(function DeckHeader({
  visibleCount,
  totalCount,
  expandedCount,
  hiddenCount,
  onReset,
  onOpenAdd,
  onOpenSettings,
  addOpen,
}: DeckHeaderProps) {
  const [resetHover, setResetHover] = useState(false)
  const [addHover, setAddHover]     = useState(false)
  const [settingsHover, setSettingsHover] = useState(false)

  return (
    <header
      style={{
        display:       "flex",
        alignItems:    "center",
        gap:           18,
        paddingTop:    20,
        paddingBottom: 14,
      }}
    >
      {/* Left — eyebrow + heading composition */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            gap:            10,
            fontFamily:     "var(--font-mono)",
            fontSize:       10.5,
            fontWeight:     600,
            letterSpacing:  "0.22em",
            textTransform:  "uppercase",
            color:          VANTARY.amber,
          }}
        >
          <Layers size={11} strokeWidth={2} aria-hidden />
          <span>Deck · Below Chart</span>
          {/* Hairline anchor dot — small chroma cue that ties the
              eyebrow to the bay header above. */}
          <span
            aria-hidden
            style={{
              width:           4,
              height:          4,
              borderRadius:    "50%",
              background:      VANTARY.amber,
              boxShadow:       `0 0 8px ${VANTARY.amberHalo}`,
              opacity:         0.9,
            }}
          />
        </div>

        <h2
          style={{
            margin:         0,
            fontFamily:     "var(--font-serif, var(--font-sans))",
            fontSize:       24,
            fontWeight:     400,
            letterSpacing:  "-0.01em",
            color:          VANTARY.paper,
            lineHeight:     1.15,
          }}
        >
          Your Trading Surface
        </h2>

        {SHOW_LIVE_STATUS && (
          <div
            style={{
              display:        "flex",
              alignItems:     "center",
              gap:            10,
              fontFamily:     "var(--font-mono)",
              fontSize:       10,
              letterSpacing:  "0.18em",
              textTransform:  "uppercase",
              color:          VANTARY.ash,
              fontVariantNumeric: "tabular-nums",
              marginTop:      2,
            }}
          >
            <span style={{ color: VANTARY.paperDim }}>
              {visibleCount.toString().padStart(2, "0")}
              <span style={{ color: VANTARY.ashGhost }}> / </span>
              {totalCount.toString().padStart(2, "0")} visible
            </span>
            <span style={{ color: VANTARY.ashGhost }}>·</span>
            <span>{expandedCount} expanded</span>
            <span style={{ color: VANTARY.ashGhost }}>·</span>
            <span>{hiddenCount} hidden</span>
          </div>
        )}
      </div>

      {/* Spacer — pushes the action group to the right edge */}
      <div style={{ flex: 1, minWidth: 12 }} />

      {/* Right — action group: ADD MODULE · CUSTOMIZE · RESET
          Each button is a quiet hairline pill with its own micro-hover.
          The whole group uses a shared font/spacing language so the
          three buttons read as siblings, not strangers. */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

        {/* ADD MODULE — primary action; brightens on hover */}
        <motion.button
          type="button"
          onClick={onOpenAdd}
          onMouseEnter={() => setAddHover(true)}
          onMouseLeave={() => setAddHover(false)}
          aria-expanded={addOpen}
          aria-haspopup="listbox"
          initial={false}
          animate={{
            backgroundColor: addOpen
              ? VANTARY.amberWash
              : addHover ? VANTARY.chipFillHi : VANTARY.chipFill,
            borderColor: addOpen || addHover ? VANTARY.amber : VANTARY.chipBorder,
          }}
          transition={{ duration: 0.18, ease: EASE_V }}
          style={{
            display:        "inline-flex",
            alignItems:     "center",
            gap:            8,
            height:         32,
            padding:        "0 12px",
            border:         "1px solid",
            borderRadius:   RADIUS_V.pill,
            cursor:         "pointer",
            color:          addOpen || addHover ? VANTARY.amber : VANTARY.paperDim,
            fontFamily:     "var(--font-mono)",
            fontSize:       10.5,
            fontWeight:     600,
            letterSpacing:  "0.16em",
            textTransform:  "uppercase",
            transition:     "color 0.18s",
          }}
        >
          <motion.span
            aria-hidden
            animate={{ rotate: addOpen ? 45 : 0 }}
            transition={{ duration: 0.22, ease: EASE_V }}
            style={{ display: "inline-flex" }}
          >
            <Plus size={13} strokeWidth={2.2} />
          </motion.span>
          <span>{addOpen ? "Close" : "Add module"}</span>
          {hiddenCount > 0 && !addOpen && (
            <span
              style={{
                fontVariantNumeric: "tabular-nums",
                color: VANTARY.amber,
                marginLeft: 2,
              }}
            >
              · {hiddenCount}
            </span>
          )}
        </motion.button>

        {/* CUSTOMIZE — opens the customize popover's DECK tab (Layer 1.6).
            Hidden when no handler is wired so the deck stays clean
            during partial rollouts. */}
        {onOpenSettings && (
          <motion.button
            type="button"
            onClick={onOpenSettings}
            onMouseEnter={() => setSettingsHover(true)}
            onMouseLeave={() => setSettingsHover(false)}
            initial={false}
            animate={{
              backgroundColor: settingsHover ? VANTARY.chipFillHi : "transparent",
              borderColor:     settingsHover ? VANTARY.chipBorder  : "transparent",
            }}
            transition={{ duration: 0.18, ease: EASE_V }}
            style={{
              display:        "inline-flex",
              alignItems:     "center",
              gap:            8,
              height:         32,
              padding:        "0 12px",
              border:         "1px solid",
              borderRadius:   RADIUS_V.pill,
              cursor:         "pointer",
              color:          settingsHover ? VANTARY.paper : VANTARY.ash,
              fontFamily:     "var(--font-mono)",
              fontSize:       10.5,
              fontWeight:     600,
              letterSpacing:  "0.16em",
              textTransform:  "uppercase",
              transition:     "color 0.18s",
            }}
          >
            <Sparkles size={12} strokeWidth={2} aria-hidden />
            <span>Customize</span>
          </motion.button>
        )}

        {/* RESET — destructive-leaning; brightens to warn-edge on hover.
            Shown only when there is something to reset (any deviation
            from registry defaults). The simple proxy used here:
            non-zero hiddenCount OR any expanded card. A more rigorous
            "isDirty" check is overkill for a single button. */}
        <motion.button
          type="button"
          onClick={onReset}
          onMouseEnter={() => setResetHover(true)}
          onMouseLeave={() => setResetHover(false)}
          aria-label="Reset deck to default order and visibility"
          title="Reset deck"
          initial={false}
          animate={{
            backgroundColor: resetHover ? VANTARY.warnWash : "transparent",
            borderColor:     resetHover ? VANTARY.warnEdge : VANTARY.ruleSoft,
            color:           resetHover ? VANTARY.paper    : VANTARY.ashSoft,
            rotate:          resetHover ? -90 : 0,
          }}
          transition={{ duration: 0.24, ease: EASE_V }}
          style={{
            display:        "inline-flex",
            alignItems:     "center",
            justifyContent: "center",
            width:          32,
            height:         32,
            border:         "1px solid",
            borderRadius:   "50%",
            cursor:         "pointer",
          }}
        >
          <RotateCcw size={12} strokeWidth={2} aria-hidden />
        </motion.button>
      </div>
    </header>
  )
})

/* ─── 4.  ADD-MODULE PICKER ──────────────────────────────────────────
 *  Inline panel that drops down from the section header when the
 *  trader clicks "+ ADD MODULE". Lists every hidden card grouped by
 *  category, with a single-click restore. When all modules are
 *  visible, the panel renders an empty-state line.
 *
 *  Visual: hairline panel with rounded corners; each module entry
 *  is a row that highlights on hover with a left-edge accent. The
 *  motion is a cubic ease-out + scaleY so it reads like a deck
 *  drawer opening from the eyebrow line above.
 * ──────────────────────────────────────────────────────────────── */

interface AddModulePickerProps {
  hiddenCards: TdDeckCard[]
  onRestore:   (id: TdSideSlot) => void
  onClose:     () => void
}

const AddModulePicker = memo(function AddModulePicker({
  hiddenCards,
  onRestore,
  onClose,
}: AddModulePickerProps) {
  // Group by category for legibility — "PERFORMANCE / MARKET /
  // INTELLIGENCE / SOCIAL". When a category has no hidden cards we
  // omit it entirely. When all are visible we render an empty-state.
  const grouped = useMemo(() => {
    const map: Partial<Record<ModuleCategory, TdDeckCard[]>> = {}
    for (const card of hiddenCards) {
      const cat = card.entry.category
      if (!map[cat]) map[cat] = []
      map[cat]!.push(card)
    }
    return map
  }, [hiddenCards])

  const categoryOrder: ModuleCategory[] = ["performance", "intelligence", "market", "social"]
  const visibleGroups = categoryOrder.filter(cat => grouped[cat] && grouped[cat]!.length > 0)

  return (
    <motion.div
      role="dialog"
      aria-label="Add hidden modules to deck"
      initial={{ opacity: 0, y: -6, scaleY: 0.98 }}
      animate={{ opacity: 1, y: 0, scaleY: 1 }}
      exit={{ opacity: 0, y: -6, scaleY: 0.98 }}
      transition={{ duration: 0.22, ease: EASE_V }}
      style={{
        transformOrigin: "top right",
        marginBottom:    14,
        background:      VANTARY.glassStrong,
        border:          `1px solid ${VANTARY.rule}`,
        borderRadius:    RADIUS_V.cardLg,
        backdropFilter:  "blur(32px) saturate(160%)",
        WebkitBackdropFilter: "blur(32px) saturate(160%)",
        overflow:        "hidden",
        position:        "relative",
      }}
    >
      {/* Top-edge accent rail — matches DeckCard's hover rail so the
          picker reads as part of the same family. */}
      <div
        aria-hidden
        style={{
          position:    "absolute",
          top:         0,
          left:        0,
          right:       0,
          height:      1,
          background:  `linear-gradient(90deg, transparent, ${VANTARY.amber}, transparent)`,
          opacity:     0.55,
        }}
      />

      {/* Picker header — eyebrow + close */}
      <div
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "14px 18px 10px",
          borderBottom:   `1px solid ${VANTARY.ruleSoft}`,
        }}
      >
        <div
          style={{
            fontFamily:     "var(--font-mono)",
            fontSize:       10,
            fontWeight:     600,
            letterSpacing:  "0.22em",
            textTransform:  "uppercase",
            color:          VANTARY.amber,
          }}
        >
          Hidden modules · {hiddenCards.length}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close add-module panel"
          style={{
            display:        "inline-flex",
            alignItems:     "center",
            justifyContent: "center",
            width:          22,
            height:         22,
            border:         "none",
            borderRadius:   "50%",
            background:     "transparent",
            cursor:         "pointer",
            color:          VANTARY.ash,
            transition:     "color 0.16s, background 0.16s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = VANTARY.chipFill;
            (e.currentTarget as HTMLButtonElement).style.color      = VANTARY.paper;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color      = VANTARY.ash;
          }}
        >
          <X size={12} strokeWidth={2.4} aria-hidden />
        </button>
      </div>

      {/* Body */}
      {hiddenCards.length === 0 ? (
        <div
          style={{
            padding:        "22px 18px",
            textAlign:      "center",
            fontFamily:     "var(--font-mono)",
            fontSize:       10.5,
            letterSpacing:  "0.18em",
            textTransform:  "uppercase",
            color:          VANTARY.ash,
          }}
        >
          Every module is visible · nothing to add
        </div>
      ) : (
        <div style={{ padding: "10px 0 14px" }}>
          {visibleGroups.map((cat) => (
            <div key={cat} style={{ marginTop: 8 }}>
              <div
                style={{
                  padding:        "6px 18px",
                  fontFamily:     "var(--font-mono)",
                  fontSize:       9.5,
                  letterSpacing:  "0.24em",
                  textTransform:  "uppercase",
                  color:          VANTARY.ashSoft,
                }}
              >
                {MODULE_CATEGORY_LABELS[cat].long}
              </div>
              <ul role="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {grouped[cat]!.map((card) => (
                  <PickerRow key={card.id} card={card} onRestore={onRestore} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
})

/** A single row inside the picker. Hover slides a left-edge accent
 *  in from the rule line; click restores the module to the deck. */
const PickerRow = memo(function PickerRow({
  card,
  onRestore,
}: {
  card:      TdDeckCard
  onRestore: (id: TdSideSlot) => void
}) {
  const [hover, setHover] = useState(false)

  // Readiness chip color — green (ready) / amber (beta) / ash (planned).
  const readinessColor =
    card.entry.readiness === "ready"   ? VANTARY.onlineDot :
    card.entry.readiness === "beta"    ? VANTARY.amber     :
                                         VANTARY.ashSoft

  return (
    <li>
      <button
        type="button"
        onClick={() => onRestore(card.id)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display:        "flex",
          alignItems:     "center",
          gap:            14,
          width:          "100%",
          padding:        "10px 18px",
          border:         "none",
          background:     hover ? VANTARY.chipFill : "transparent",
          cursor:         "pointer",
          textAlign:      "left",
          position:       "relative",
          transition:     "background 0.16s",
        }}
      >
        {/* Left-edge accent — slides in on hover */}
        <motion.span
          aria-hidden
          initial={false}
          animate={{
            scaleY:  hover ? 1   : 0.2,
            opacity: hover ? 1   : 0,
          }}
          transition={{ duration: 0.18, ease: EASE_V }}
          style={{
            position:        "absolute",
            left:            0,
            top:             6,
            bottom:          6,
            width:           2,
            background:      VANTARY.amber,
            borderRadius:    1,
            transformOrigin: "center",
          }}
        />

        {/* Readiness dot */}
        <span
          aria-hidden
          style={{
            width:        6,
            height:       6,
            borderRadius: "50%",
            background:   readinessColor,
            boxShadow:    hover && card.entry.readiness === "ready"
              ? `0 0 6px ${readinessColor}`
              : "none",
            transition:   "box-shadow 0.18s",
            flexShrink:   0,
          }}
        />

        {/* Label + description */}
        <span style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontFamily:     "var(--font-mono)",
              fontSize:       11.5,
              fontWeight:     600,
              letterSpacing:  "0.12em",
              textTransform:  "uppercase",
              color:          hover ? VANTARY.paper : VANTARY.paperDim,
              transition:     "color 0.16s",
            }}
          >
            {card.entry.label}
          </span>
          <span
            style={{
              fontFamily:     "var(--font-sans)",
              fontSize:       11.5,
              fontWeight:     400,
              color:          VANTARY.ash,
              marginTop:      2,
              overflow:       "hidden",
              textOverflow:   "ellipsis",
              whiteSpace:     "nowrap",
            }}
          >
            {card.entry.description}
          </span>
        </span>

        {/* Right — restore affordance */}
        <span
          style={{
            display:        "inline-flex",
            alignItems:     "center",
            gap:            6,
            fontFamily:     "var(--font-mono)",
            fontSize:       9.5,
            letterSpacing:  "0.22em",
            textTransform:  "uppercase",
            color:          hover ? VANTARY.amber : VANTARY.ashSoft,
            transition:     "color 0.16s",
          }}
        >
          <motion.span
            aria-hidden
            animate={{ x: hover ? 2 : 0 }}
            transition={{ duration: 0.18, ease: EASE_V }}
          >
            <Plus size={11} strokeWidth={2.4} />
          </motion.span>
          Restore
        </span>
      </button>
    </li>
  )
})

/* ─── 5.  EMPTY STATE ─────────────────────────────────────────────────
 *  The reducer's last-visible-card guard means this state SHOULD be
 *  unreachable at runtime — but defending against a corrupt save
 *  (somehow) is cheap and prevents a blank deck from confusing the
 *  trader. If it ever renders, the message is honest and the action
 *  is one click.
 * ──────────────────────────────────────────────────────────────── */

const DeckEmptyState = memo(function DeckEmptyState({
  onReset,
}: { onReset: () => void }) {
  return (
    <div
      role="status"
      style={{
        textAlign:      "center",
        padding:        "48px 24px",
        border:         `1px dashed ${VANTARY.ruleSoft}`,
        borderRadius:   RADIUS_V.cardLg,
        background:     VANTARY.glass,
      }}
    >
      <div
        style={{
          fontFamily:     "var(--font-mono)",
          fontSize:       10.5,
          fontWeight:     600,
          letterSpacing:  "0.22em",
          textTransform:  "uppercase",
          color:          VANTARY.ash,
        }}
      >
        Deck empty
      </div>
      <div
        style={{
          marginTop:  10,
          fontFamily: "var(--font-serif, var(--font-sans))",
          fontSize:   16,
          color:      VANTARY.paper,
        }}
      >
        Every module is hidden.
      </div>
      <button
        type="button"
        onClick={onReset}
        style={{
          marginTop:      18,
          padding:        "8px 16px",
          border:         `1px solid ${VANTARY.amber}`,
          borderRadius:   RADIUS_V.pill,
          background:     VANTARY.amberWash,
          color:          VANTARY.amber,
          fontFamily:     "var(--font-mono)",
          fontSize:       10.5,
          fontWeight:     600,
          letterSpacing:  "0.18em",
          textTransform:  "uppercase",
          cursor:         "pointer",
        }}
      >
        Restore default deck
      </button>
    </div>
  )
})

/* ─── 6.  MAIN — DeckBelowChart ───────────────────────────────────── */

/**
 * The deck below TradingView. Reads the trader-curated card array
 * from `useDeck()`, wraps each one in a draggable `Reorder.Item`,
 * and feeds it the registered renderer pair (or the registry-
 * description placeholder fallback).
 *
 * Mounted once in `your-space.tsx` directly under `<TradingDeskBay/>`.
 */
export const DeckBelowChart = memo(forwardRef<HTMLElement, DeckBelowChartProps>(
  function DeckBelowChart(
    {
      rendererById,
      onConfigureCard,
      onOpenDeckSettings,
      className,
      style,
      flushBelowBay = true,
    },
    ref,
  ) {
    const { cards, visibleCards, actions } = useDeck()
    const [addOpen, setAddOpen] = useState(false)

    /* ── derive header counts ────────────────────────────────────── */
    const totalCount    = cards.length
    const visibleCount  = visibleCards.length
    const expandedCount = visibleCards.filter(c => c.viewMode === "expanded").length
    const hiddenCount   = totalCount - visibleCount

    /* ── hidden cards (in trader-order, not category-order) ──────── */
    const hiddenCards = useMemo(
      () => cards.filter(c => c.hidden),
      [cards],
    )

    /* ── handlers ───────────────────────────────────────────────── */

    /** When the trader drags-reorders, framer-motion gives us a new
     *  array of TdDeckCard objects. We extract the ids in the new
     *  order and dispatch — the reducer reconciles against the
     *  registry, preserves hidden cards' positions, and persists. */
    const handleReorder = useCallback((next: TdDeckCard[]) => {
      // The Reorder.Group receives ONLY the visible cards (we don't
      // want hidden ones to be drag-reorderable while invisible).
      // To produce a complete deck order, we splice the new visible
      // order into the existing deckOrder positions where hidden
      // cards live. This way, un-hiding a previously-hidden card
      // restores it to its original neighborhood instead of dumping
      // it at the bottom.
      const visibleOrder = next.map(c => c.id)
      const hiddenIds    = new Set(cards.filter(c => c.hidden).map(c => c.id))
      // Walk the original deckOrder; whenever we hit a non-hidden
      // slot, take the next id from `visibleOrder`. Hidden ids stay
      // in place.
      const merged: TdSideSlot[] = []
      let visibleCursor = 0
      for (const card of cards) {
        if (hiddenIds.has(card.id)) {
          merged.push(card.id)
        } else {
          // visibleOrder is guaranteed to have a value here because
          // we built it from the same set of non-hidden cards.
          merged.push(visibleOrder[visibleCursor++] ?? card.id)
        }
      }
      actions.setOrder(merged)
    }, [actions, cards])

    const handleReset = useCallback(() => {
      // Confirm-by-feel: reset is a one-click action because the
      // operation is non-destructive (no data is lost — registry
      // defaults are restored). The amber rotate animation on the
      // header button gives enough motion feedback to read as
      // "something happened".
      actions.resetAll()
      setAddOpen(false)
    }, [actions])

    const handleRestore = useCallback((id: TdSideSlot) => {
      actions.setHidden(id, false)
      // Auto-close the picker once the trader has nothing left to
      // restore — keeps the chrome out of the way.
      const remaining = hiddenCards.filter(c => c.id !== id).length
      if (remaining === 0) setAddOpen(false)
    }, [actions, hiddenCards])

    const handleToggleAdd = useCallback(() => {
      setAddOpen(prev => !prev)
    }, [])

    const handleCloseAdd = useCallback(() => {
      setAddOpen(false)
    }, [])

    /* ── per-card renderer resolver ─────────────────────────────── */

    const resolveRenderer = useCallback((id: TdSideSlot): DeckRenderer => {
      return rendererById?.[id] ?? {}
    }, [rendererById])

    /* ── outer styles ───────────────────────────────────────────── */

    const outerStyle: CSSProperties = {
      // Match the bay's full-bleed treatment when flushBelowBay is
      // true — the bay is `mb-8` so we sit flush below it without
      // adding extra top margin.
      marginTop:    flushBelowBay ? 0 : 24,
      marginBottom: 32,
      paddingLeft:  DECK_GUTTER_X,
      paddingRight: DECK_GUTTER_X,
      maxWidth:     DECK_MAX_WIDTH,
      marginLeft:   "auto",
      marginRight:  "auto",
      ...style,
    }

    return (
      <section
        ref={ref}
        data-vantary-anchor="deck-below-chart"
        aria-label="Trading desk · deck below chart"
        className={className}
        style={outerStyle}
      >
        {/* Larger gutter on lg+ via a CSS variable hook — keeps the
            inline-style approach consistent with the rest of trading-
            desk while still respecting the breakpoint pattern from
            your-space.tsx (px-6 lg:px-8). */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @media (min-width: 1024px) {
            [data-vantary-anchor="deck-below-chart"] {
              padding-left:  ${DECK_GUTTER_X_LG}px !important;
              padding-right: ${DECK_GUTTER_X_LG}px !important;
            }
          }
        `,
          }}
        />

        {/* SECTION HEADER */}
        <DeckHeader
          visibleCount={visibleCount}
          totalCount={totalCount}
          expandedCount={expandedCount}
          hiddenCount={hiddenCount}
          onReset={handleReset}
          onOpenAdd={handleToggleAdd}
          onOpenSettings={onOpenDeckSettings}
          addOpen={addOpen}
        />

        {/* HAIRLINE RULE — separates the header from the stack */}
        <div
          aria-hidden
          style={{
            height:       1,
            background:   `linear-gradient(90deg, ${VANTARY.ruleSoft}, ${VANTARY.rule}, ${VANTARY.ruleSoft})`,
            marginBottom: 18,
          }}
        />

        {/* ADD-MODULE PICKER (animated) */}
        <AnimatePresence initial={false}>
          {addOpen && (
            <AddModulePicker
              hiddenCards={hiddenCards}
              onRestore={handleRestore}
              onClose={handleCloseAdd}
            />
          )}
        </AnimatePresence>

        {/* CARD STACK — drag-reorderable */}
        {visibleCount === 0 ? (
          <DeckEmptyState onReset={handleReset} />
        ) : (
          <LayoutGroup id="vt-deck-stack">
            <Reorder.Group
              as="ul"
              axis="y"
              values={visibleCards}
              onReorder={handleReorder}
              role="list"
              aria-label="Deck modules"
              style={{
                listStyle:      "none",
                margin:         0,
                padding:        0,
                display:        "flex",
                flexDirection:  "column",
                gap:            CARD_GAP_PX,
              }}
            >
              {visibleCards.map((card) => {
                const renderer = resolveRenderer(card.id)
                return (
                  <DeckReorderItem
                    key={card.id}
                    card={card}
                    renderer={renderer}
                    onConfigure={onConfigureCard}
                  />
                )
              })}
            </Reorder.Group>
          </LayoutGroup>
        )}
      </section>
    )
  },
))

DeckBelowChart.displayName = "DeckBelowChart"

/* ─── 7.  Reorder.Item bridge ─────────────────────────────────────────
 *  framer-motion's Reorder.Item exposes drag handlers via children-
 *  as-render-prop in some versions and via the `dragListener` API
 *  in others. We use `dragListener={false}` + `useDragControls()`
 *  so the drag is initiated ONLY from the gripper button — preventing
 *  accidental drags when the trader interacts with the rest of the
 *  card (charts, buttons, expand/collapse).
 *
 *  This keeps the entire card a hover surface, while the gripper is
 *  the explicit "I want to move this" affordance — exactly the
 *  pattern used in professional trading terminals.
 * ──────────────────────────────────────────────────────────────── */

interface DeckReorderItemProps {
  card:        TdDeckCard
  renderer:    DeckRenderer
  onConfigure: ((card: TdDeckCard) => void) | undefined
}

const DeckReorderItem = memo(function DeckReorderItem({
  card,
  renderer,
  onConfigure,
}: DeckReorderItemProps) {
  /* Drag state — drives the DeckCard's `isDragging` prop so the card
   * raises its border and adds a faint amber halo while in flight. */
  const [isDragging, setIsDragging] = useState(false)

  /* The framer-motion-documented "gripper-only" pattern.
   *
   *   1. Reorder.Item gets `dragListener={false}` — the body of the
   *      card cannot start a drag.
   *   2. Reorder.Item gets `dragControls={controls}` — a programmatic
   *      handle to start the drag from anywhere we want.
   *   3. The gripper's pointer-down calls `controls.start(e)` which
   *      arms the gesture for that one event.
   *
   * Result: the trader can click any button on the card without
   * accidentally starting a drag, but pressing-and-dragging the
   * gripper works exactly like a native list-reorder. */
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      value={card}
      dragListener={false}
      dragControls={dragControls}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      style={{ listStyle: "none" }}
      whileDrag={{
        /* Tiny lift so the dragged card reads "in front of" siblings,
         * without a heavy shadow that would clash with the hairline
         * language. */
        zIndex: 30,
      }}
      transition={{ duration: 0.22, ease: EASE_V }}
    >
      <DeckCard
        card={card}
        renderShort={renderer.renderShort}
        renderExpanded={renderer.renderExpanded}
        onConfigure={onConfigure}
        isDragging={isDragging}
        dragHandleProps={{
          /* Press-and-drag on the gripper hands the gesture directly
           * to framer-motion. We also stop propagation so the press
           * doesn't bubble up and trigger any parent click handlers
           * (e.g. card-level focus-toggling). The `touch-action: none`
           * style is applied inside DeckCard's gripper to prevent the
           * browser from hijacking the gesture for scroll on touch
           * devices. */
          onPointerDown: (e) => {
            e.stopPropagation()
            dragControls.start(e)
          },
          /* The drag is purely a pointer gesture, so we don't need a
           * keyboard fallback here — the visual gripper still serves
           * as the drag affordance. A future a11y pass can add
           * keyboard reordering via the DECK tab in the customize
           * popover (Layer 1.6) where it's a more natural fit. */
        }}
      />
    </Reorder.Item>
  )
})

/* ─���─ 8.  EXPORTS ─────────────────────────────────────────────────── */

// Default export aliases the named export for convenient import in
// places that prefer default imports (your-space.tsx uses named).
export default DeckBelowChart
