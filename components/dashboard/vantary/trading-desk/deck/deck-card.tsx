"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  TRADING DESK · DECK · CARD PRIMITIVE
 *  ─────────────────────────────────────────────────────────────────────────
 *  THE atom of the deck-below-chart placement. Renders any module from
 *  the registry inside the same hairline editorial shell so the deck
 *  reads as one instrument rack, not a row of unrelated panels.
 *
 *  Anatomy
 *  ───────
 *
 *    ┌────────────────────────────────────────────────────────────────────┐
 *    │ ⋮⋮  │ EYEBROW · MODULE NAME · 3 / 8 fields  [READY]   ⊞  ⚙  ✕ │  ← header (38px)
 *    ├────────────────────────────────────────────────────────────────────┤
 *    │                                                                    │
 *    │   short-view  OR  expanded-view (animated crossfade)                │
 *    │                                                                    │
 *    └────────────────────────────────────────────────────────────────────┘
 *
 *  Every interaction is functional and every hover earns its motion:
 *
 *    · Card resting     — `glass` background, `rule` border, no shadow
 *    · Card hover       — `ruleStrong` border, top-edge accent line fades in,
 *                          a single shine sweeps left → right across the header
 *    · Drag handle      — gripper dots brighten + scale; cursor "grab"
 *    · Field-count      — on hover, opens a tooltip-grade title attribute
 *                          (the real configure drawer is Layer 1.5)
 *    · Toggle short/exp — icon rotates 90°; background fills to chipFillHi
 *    · Configure gear   — slow 360° pulse on hover (1.2s); border lights amber
 *    · Hide button      — icon nudges right 1px; border lights warnEdge red
 *    · Body switch      — AnimatePresence height tween, soft 200ms crossfade
 *
 *  Architecture
 *  ────────────
 *  The DeckCard is *placement-agnostic shell only*. It does NOT know how
 *  to render any specific module's content. The container (Layer 1.4 ·
 *  DeckBelowChart) iterates `useDeck().visibleCards` and passes the
 *  appropriate `renderShort` / `renderExpanded` functions for each id.
 *  When a module is `wired-soon` / `planned`, the card auto-renders a
 *  beautiful placeholder using the registry's description — no
 *  callsite logic needed.
 *
 *  Drag-drop reorder is also delegated up: this component exposes
 *  `dragHandleProps` and `dragListeners` slots that Layer 1.4 fills in
 *  with framer-motion's Reorder primitives. That keeps the card pure.
 * ═══════════════════════════════════════════════════════════════════════ */

import {
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  GripVertical,
  Maximize2,
  Minimize2,
  Settings2,
  EyeOff,
  Hourglass,
  ArrowUpRight,
  Sparkles,
} from "lucide-react"

import {
  VANTARY,
  RADIUS_V,
  EASE_V,
} from "../../vantary-theme"
import {
  useDeck,
  type TdDeckCard,
} from "../provider"
import {
  MODULE_READINESS_LABELS,
} from "../modules/registry"

/* ─── 1.  PROPS ─────────────────────────────────────────────────────── */

export interface DeckCardProps {
  /** The resolved deck card from `useDeck().visibleCards`. The renderer
   *  derives EVERY display detail from this object — id, viewMode,
   *  shortFields, maxItems, hidden, plus the full registry entry. */
  card: TdDeckCard

  /** Render the trader's curated short view. Receives the resolved
   *  card so the renderer can read `card.shortFields` (ordered token
   *  array), `card.maxItems` (for list-mode modules), and
   *  `card.entry.shortFieldCatalog` (for label/unit/weight metadata).
   *
   *  When omitted, the card renders a placeholder body. This is the
   *  expected behaviour for modules whose registry readiness is
   *  "planned" — the placeholder uses `entry.description` and reads
   *  beautifully out of the box. */
  renderShort?:    (card: TdDeckCard) => ReactNode

  /** Render the full module canvas. Receives the same resolved card.
   *  When omitted, the card falls back to the short view in expanded
   *  mode. */
  renderExpanded?: (card: TdDeckCard) => ReactNode

  /** Called when the trader clicks the gear icon. Layer 1.5 wires this
   *  to the `<ConfigureShortView/>` drawer. When omitted, the gear
   *  icon is hidden — keeps the card useable in contexts where the
   *  configure drawer isn't mounted (e.g. preview tiles in the
   *  customize popover). */
  onConfigure?:    (card: TdDeckCard) => void

  /** Drag-handle slot. Layer 1.4 (`<DeckBelowChart/>`) passes the
   *  framer-motion Reorder.Item drag listeners here. When omitted,
   *  the gripper still renders but does nothing (visual continuity
   *  in non-reorderable contexts like the customize popover preview). */
  dragHandleProps?: HTMLAttributes<HTMLButtonElement>

  /** When true, the entire card is rendered with a soft "is being
   *  dragged" visual (raised border, faint amber halo, slight scale).
   *  Layer 1.4 sets this from Reorder.Item's drag state. */
  isDragging?: boolean

  /** Optional className appended to the outer card. */
  className?: string

  /** Optional style merged into the outer card's inline style. Use
   *  sparingly — most layout concerns belong in `<DeckBelowChart/>`. */
  style?: CSSProperties
}

/* ─── 2.  THE PRIMITIVE ─────────────────────────────────────────────── */

export const DeckCard = memo(
  forwardRef<HTMLElement, DeckCardProps>(function DeckCard(
    {
      card,
      renderShort,
      renderExpanded,
      onConfigure,
      dragHandleProps,
      isDragging = false,
      className,
      style,
    },
    ref,
  ) {
    const { actions } = useDeck()
    const [hover, setHover] = useState(false)
    const [pressedAction, setPressedAction] = useState<
      "expand" | "config" | "hide" | null
    >(null)

    const isShort    = card.viewMode === "short"
    const isReady    = card.entry.readiness === "ready"
    const isBeta     = card.entry.readiness === "beta"
    const isPlanned  = card.entry.readiness === "planned"

    /* ── handlers ───────────────────────────────────────────────── */

    const handleToggleView = useCallback(() => {
      setPressedAction("expand")
      actions.toggleViewMode(card.id)
      // Release the depress visual after the toggle settles. Using a
      // microtask + a paint frame so the animation reads cleanly.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPressedAction(null))
      })
    }, [actions, card.id])

    const handleConfigure = useCallback(() => {
      if (!onConfigure) return
      setPressedAction("config")
      onConfigure(card)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPressedAction(null))
      })
    }, [onConfigure, card])

    const handleHide = useCallback(() => {
      setPressedAction("hide")
      actions.toggleHidden(card.id)
    }, [actions, card.id])

    /* ── derived display values ─────────────────────────────────── */

    const fieldCount = card.shortFields.length
    const fieldTotal = card.entry.shortFieldCatalog.filter(f => !f.deprecated).length
    const showConfigureButton = isShort && Boolean(onConfigure)

    /* ── outer shell ───────────────────────────────────────────── */

    return (
      <motion.section
        ref={ref as React.Ref<HTMLElement>}
        role="region"
        aria-label={`${card.entry.label} — ${isShort ? "short view" : "expanded view"}`}
        data-deck-card-id={card.id}
        data-deck-card-mode={card.viewMode}
        data-deck-card-readiness={card.entry.readiness}
        className={className}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        initial={false}
        animate={{
          // Hover lifts the card a hair so the deck reads tactile.
          y: isDragging ? -2 : hover ? -1 : 0,
          scale: isDragging ? 1.005 : 1,
        }}
        transition={{ duration: 0.18, ease: EASE_V }}
        style={{
          position:       "relative",
          background:     hover ? VANTARY.glassStrong : VANTARY.glass,
          border:         `1px solid ${
            isDragging ? VANTARY.amberHalo : hover ? VANTARY.ruleStrong : VANTARY.rule
          }`,
          borderRadius:   RADIUS_V.card,
          backdropFilter: "blur(28px) saturate(150%)",
          WebkitBackdropFilter: "blur(28px) saturate(150%)",
          boxShadow: isDragging
            ? `0 12px 32px rgba(0,0,0,0.32), 0 0 0 1px ${VANTARY.amberHalo}, 0 0 24px ${VANTARY.amberHalo}`
            : hover
              ? "0 6px 20px rgba(0,0,0,0.25)"
              : "0 2px 10px rgba(0,0,0,0.18)",
          overflow:       "hidden",
          transition:     "background-color 180ms ease, border-color 180ms ease, box-shadow 220ms ease",
          ...style,
        }}
      >
        {/* Top accent rail — a 1px hairline at the very top edge that
            fades in on hover. Reads like the card has just "armed". */}
        <motion.div
          aria-hidden
          initial={false}
          animate={{ opacity: hover || isDragging ? 1 : 0 }}
          transition={{ duration: 0.22, ease: EASE_V }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: `linear-gradient(90deg,
              transparent 0%,
              ${VANTARY.amberHalo} 12%,
              ${VANTARY.amber} 50%,
              ${VANTARY.amberHalo} 88%,
              transparent 100%)`,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Shine sweep — single pass left → right when hover begins.
            Uses `key` re-mount trick so each new hover fires it again
            from -100%. */}
        <AnimatePresence>
          {hover && (
            <motion.div
              key="shine"
              aria-hidden
              initial={{ x: "-110%", opacity: 0 }}
              animate={{ x: "110%", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "60%",
                height: 38, // header height — confines the shine to the header strip
                background: `linear-gradient(100deg,
                  transparent 0%,
                  rgba(255,255,255,0) 35%,
                  rgba(255,255,255,0.06) 50%,
                  rgba(255,255,255,0) 65%,
                  transparent 100%)`,
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
          )}
        </AnimatePresence>

        {/* Header strip */}
        <DeckCardHeader
          card={card}
          fieldCount={fieldCount}
          fieldTotal={fieldTotal}
          isShort={isShort}
          isReady={isReady}
          isBeta={isBeta}
          isPlanned={isPlanned}
          showConfigureButton={showConfigureButton}
          dragHandleProps={dragHandleProps}
          onToggleView={handleToggleView}
          onConfigure={onConfigure ? handleConfigure : undefined}
          onHide={handleHide}
          pressedAction={pressedAction}
        />

        {/* Body — animates between short and expanded with a height
            tween and a soft crossfade. AnimatePresence with `mode="wait"`
            keeps the height transition stable; the inner content fades
            via the variants below. */}
        <DeckCardBody
          card={card}
          isShort={isShort}
          isReady={isReady}
          isPlanned={isPlanned}
          renderShort={renderShort}
          renderExpanded={renderExpanded}
        />
      </motion.section>
    )
  }),
)

/* ─── 3.  HEADER STRIP ──────────────────────────────────────────────── */

interface DeckCardHeaderProps {
  card:                TdDeckCard
  fieldCount:          number
  fieldTotal:          number
  isShort:             boolean
  isReady:             boolean
  isBeta:              boolean
  isPlanned:           boolean
  showConfigureButton: boolean
  dragHandleProps?:    HTMLAttributes<HTMLButtonElement>
  onToggleView:        () => void
  onConfigure?:        () => void
  onHide:              () => void
  pressedAction:       "expand" | "config" | "hide" | null
}

function DeckCardHeader({
  card,
  fieldCount,
  fieldTotal,
  isShort,
  isReady,
  isBeta,
  isPlanned,
  showConfigureButton,
  dragHandleProps,
  onToggleView,
  onConfigure,
  onHide,
  pressedAction,
}: DeckCardHeaderProps) {
  return (
    <header
      className="flex items-center"
      style={{
        height: 38,
        paddingInline: 4,
        gap: 8,
        borderBottom: `1px solid ${VANTARY.rule}`,
        position: "relative",
        zIndex: 3, // above shine sweep
      }}
    >
      {/* Drag handle */}
      <DeckCardDragHandle dragHandleProps={dragHandleProps} />

      {/* Vertical hairline */}
      <span
        aria-hidden
        style={{
          width: 1,
          height: 14,
          background: VANTARY.rule,
        }}
      />

      {/* Eyebrow + meta */}
      <div className="flex items-baseline gap-2 min-w-0 flex-1">
        <span
          className="font-mono uppercase truncate"
          style={{
            fontSize:      10.5,
            letterSpacing: "0.22em",
            color:         VANTARY.amber,
            fontWeight:    500,
          }}
        >
          {card.entry.label}
        </span>

        {/* Field-count meta — only meaningful in short mode */}
        {isShort && fieldTotal > 0 && (
          <span
            className="font-mono uppercase shrink-0"
            title={`${fieldCount} of ${fieldTotal} short-view fields visible`}
            style={{
              fontSize:      9,
              letterSpacing: "0.18em",
              color:         VANTARY.ashSoft,
            }}
          >
            {fieldCount} <span style={{ color: VANTARY.ashGhost }}>/</span> {fieldTotal} FIELDS
          </span>
        )}

        {/* List-mode max-items meta */}
        {isShort && card.entry.supportsListMode && card.maxItems != null && (
          <span
            className="font-mono uppercase shrink-0"
            title={`Showing up to ${card.maxItems} rows in short view`}
            style={{
              fontSize:      9,
              letterSpacing: "0.18em",
              color:         VANTARY.ashSoft,
            }}
          >
            <span style={{ color: VANTARY.ashGhost }}>·</span>{" "}
            {card.maxItems} ROWS
          </span>
        )}
      </div>

      {/* Readiness badge */}
      <ReadinessBadge isReady={isReady} isBeta={isBeta} isPlanned={isPlanned} />

      {/* Controls */}
      <div className="flex items-center gap-1">
        <DeckCardControlButton
          intent="expand"
          ariaLabel={isShort ? "Expand card" : "Collapse to short view"}
          tooltip={isShort ? "Expand · ⌥E" : "Collapse · ⌥E"}
          onClick={onToggleView}
          pressed={pressedAction === "expand"}
        >
          {isShort
            ? <Maximize2 size={13} strokeWidth={1.6} />
            : <Minimize2 size={13} strokeWidth={1.6} />}
        </DeckCardControlButton>

        {showConfigureButton && (
          <DeckCardControlButton
            intent="config"
            ariaLabel="Configure short view"
            tooltip="Configure short view · ⌥C"
            onClick={onConfigure}
            pressed={pressedAction === "config"}
          >
            <Settings2 size={13} strokeWidth={1.6} />
          </DeckCardControlButton>
        )}

        <DeckCardControlButton
          intent="hide"
          ariaLabel="Hide module from deck"
          tooltip="Hide from deck · re-add via Customize"
          onClick={onHide}
          pressed={pressedAction === "hide"}
        >
          <EyeOff size={13} strokeWidth={1.6} />
        </DeckCardControlButton>
      </div>
    </header>
  )
}

/* ─── 4.  DRAG HANDLE ───────────────────────────────────────────────── */

function DeckCardDragHandle({
  dragHandleProps,
}: {
  dragHandleProps?: HTMLAttributes<HTMLButtonElement>
}) {
  const isInteractive = Boolean(dragHandleProps)
  const [hover, setHover] = useState(false)

  return (
    <button
      type="button"
      aria-label="Drag to reorder"
      tabIndex={isInteractive ? 0 : -1}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      // Spread the framer-motion drag listeners last so they win over
      // our local handlers in case of a clash.
      {...(dragHandleProps ?? {})}
      style={{
        display:        "inline-flex",
        alignItems:     "center",
        justifyContent: "center",
        width:          24,
        height:         28,
        background:     "transparent",
        border:         "none",
        borderRadius:   4,
        color:          VANTARY.ashGhost,
        cursor:         isInteractive ? "grab" : "default",
        transition:     "color 160ms ease, background-color 160ms ease, transform 160ms ease",
        opacity:        isInteractive ? (hover ? 1 : 0.55) : 0.32,
        transform:      isInteractive && hover ? "scale(1.08)" : "scale(1)",
        ...(dragHandleProps?.style ?? {}),
      }}
    >
      <GripVertical size={14} strokeWidth={1.6} />
    </button>
  )
}

/* ─── 5.  CONTROL BUTTON ──────────────────────────────��─────────────── */

interface DeckCardControlButtonProps {
  intent:    "expand" | "config" | "hide"
  ariaLabel: string
  tooltip:   string
  onClick?:  () => void
  pressed:   boolean
  children:  ReactNode
}

function DeckCardControlButton({
  intent,
  ariaLabel,
  tooltip,
  onClick,
  pressed,
  children,
}: DeckCardControlButtonProps) {
  const [hover, setHover] = useState(false)

  // Hover/active border colour by intent. The HIDE button intentionally
  // borrows the warn edge so the trader feels its destructive weight
  // without a heavy red fill.
  const hoverBorder =
    intent === "hide" ? VANTARY.warnEdge : VANTARY.amberHalo
  const hoverColor =
    intent === "hide" ? VANTARY.paper : VANTARY.amber
  const hoverBackground =
    intent === "hide" ? VANTARY.warnWash : VANTARY.amberWash

  // Per-intent micro-animation on hover. CONFIG gets a slow rotation
  // (gear pulses), EXPAND gets a soft scale, HIDE gets a 1px nudge.
  const motionProps =
    intent === "config"
      ? { rotate: hover ? 90 : 0 }
      : intent === "expand"
        ? { scale: hover ? 1.08 : 1, rotate: pressed ? 90 : 0 }
        : { x: hover ? 1 : 0, scale: pressed ? 0.92 : 1 }

  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      title={tooltip}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileTap={{ scale: 0.92 }}
      animate={motionProps}
      transition={{ duration: intent === "config" ? 0.6 : 0.22, ease: EASE_V }}
      style={{
        display:        "inline-flex",
        alignItems:     "center",
        justifyContent: "center",
        width:          26,
        height:         26,
        borderRadius:   6,
        border:         `1px solid ${
          pressed ? hoverBorder : hover ? hoverBorder : "transparent"
        }`,
        background:     pressed
          ? hoverBackground
          : hover
            ? `color-mix(in oklab, ${hoverBackground} 70%, transparent)`
            : "transparent",
        color:          pressed ? hoverColor : hover ? hoverColor : VANTARY.ashSoft,
        cursor:         "pointer",
        transition:     "color 160ms ease, background-color 160ms ease, border-color 160ms ease",
        position:       "relative",
        overflow:       "hidden",
      }}
    >
      {/* Inner sheen — a 1px highlight slides across when hovered.
          Constrained to the button so the shine reads as a focused
          highlight rather than a card-wide effect. */}
      <AnimatePresence>
        {hover && (
          <motion.span
            key="sheen"
            aria-hidden
            initial={{ x: "-130%" }}
            animate={{ x: "130%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
            style={{
              position:  "absolute",
              top:       0,
              bottom:    0,
              width:     "60%",
              background: `linear-gradient(110deg,
                transparent 0%,
                rgba(255,255,255,0.10) 50%,
                transparent 100%)`,
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>
      <span style={{ position: "relative", zIndex: 1, display: "inline-flex" }}>
        {children}
      </span>
    </motion.button>
  )
}

/* ─── 6.  READINESS BADGE ───────────────────────────────────────────── */

function ReadinessBadge({
  isReady,
  isBeta,
  isPlanned,
}: {
  isReady:   boolean
  isBeta:    boolean
  isPlanned: boolean
}) {
  // READY status is the default — we don't print a badge for it. It's
  // visual debt to label the normal state.
  if (isReady) return null

  const label = isBeta ? MODULE_READINESS_LABELS.beta : MODULE_READINESS_LABELS.planned
  const color = isBeta ? VANTARY.amber : VANTARY.ashSoft
  const border = isBeta ? VANTARY.amberHalo : VANTARY.rule
  const Icon  = isPlanned ? Hourglass : Sparkles

  return (
    <span
      className="font-mono uppercase flex items-center gap-1 shrink-0"
      style={{
        padding:       "2px 6px",
        fontSize:      8.5,
        letterSpacing: "0.22em",
        color,
        border:        `1px solid ${border}`,
        borderRadius:  3,
        height:        18,
      }}
    >
      <Icon size={9} strokeWidth={1.6} />
      {label}
    </span>
  )
}

/* ─── 7.  BODY ──────────────────────────────────────────────────────── */

interface DeckCardBodyProps {
  card:            TdDeckCard
  isShort:         boolean
  isReady:         boolean
  isPlanned:       boolean
  renderShort?:    (card: TdDeckCard) => ReactNode
  renderExpanded?: (card: TdDeckCard) => ReactNode
}

function DeckCardBody({
  card,
  isShort,
  isReady,
  isPlanned,
  renderShort,
  renderExpanded,
}: DeckCardBodyProps) {
  // Resolve the actual content node. Order of precedence:
  //   1. Module is `planned` → always show the placeholder. Renderers
  //      are ignored even if passed (defensive — keeps the deck honest
  //      about what's wired and what isn't).
  //   2. Module is `ready`/`beta` AND a renderer is provided for the
  //      current viewMode → use it.
  //   3. Module is `ready`/`beta` but no renderer for THIS view →
  //      fall back to the OTHER view's renderer if available.
  //   4. Nothing renderable → empty-state placeholder (dev guard).
  const content = useMemo<ReactNode>(() => {
    if (isPlanned) {
      return <DeckCardPlaceholder card={card} />
    }
    const primary  = isShort ? renderShort   : renderExpanded
    const fallback = isShort ? renderExpanded : renderShort
    if (primary) return primary(card)
    if (fallback) return fallback(card)
    return <DeckCardEmpty card={card} />
  }, [isShort, isPlanned, renderShort, renderExpanded, card])

  return (
    <div
      style={{
        position: "relative",
        zIndex:   2,
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${card.id}-${card.viewMode}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.22, ease: EASE_V }}
          style={{
            padding: isShort ? "12px 14px" : "14px 16px 16px",
          }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ─── 8.  PLANNED-MODULE PLACEHOLDER ────────────────────────────────── */

/** Rendered when a module's registry readiness is "planned". Reads the
 *  module's own `description` so the placeholder is concrete (it tells
 *  the trader what THIS module will show) instead of generic. The
 *  schematic at the bottom is purely visual rhythm — five hairline
 *  rows of varying widths that suggest "a module will live here". */
function DeckCardPlaceholder({ card }: { card: TdDeckCard }) {
  return (
    <div className="flex flex-col gap-3">
      <p
        className="font-sans"
        style={{
          fontSize:   12.5,
          color:      VANTARY.paperDim,
          lineHeight: 1.55,
          margin:     0,
        }}
      >
        {card.entry.description}
      </p>

      {/* Schematic — five rows of hairlines hint at the future shape */}
      <div className="flex flex-col gap-1.5 mt-1" aria-hidden>
        {[0.72, 0.46, 0.58, 0.40, 0.62].map((w, i) => (
          <div
            key={i}
            style={{
              height:       6,
              width:        `${w * 100}%`,
              background:   VARIATIONS.rowBg(i),
              borderRadius: 2,
              opacity:      0.55,
            }}
          />
        ))}
      </div>

      {/* Footer hint */}
      <span
        className="font-mono uppercase mt-2 inline-flex items-center gap-1.5 self-start"
        style={{
          fontSize:      9,
          letterSpacing: "0.22em",
          color:         VANTARY.ashSoft,
        }}
      >
        <ArrowUpRight size={10} strokeWidth={1.6} />
        SHIPS WITH ANALYZE TRANSFER · M3
      </span>
    </div>
  )
}

/* Tiny helper to alternate placeholder rows so the rhythm doesn't read
 * mechanical. Pure presentation. */
const VARIATIONS = {
  rowBg: (i: number) => (i % 2 === 0 ? VANTARY.rule : VANTARY.ruleSoft),
}

/* ─── 9.  EMPTY GUARD ───────────────────────────────────────────────── */

/** Defensive fallback when a `ready` module reaches the deck without a
 *  renderer. This is a developer-facing message that should never ship
 *  to a real trader — but if it does, it surfaces the omission instead
 *  of rendering nothing. */
function DeckCardEmpty({ card }: { card: TdDeckCard }) {
  return (
    <div
      className="flex flex-col items-start gap-2"
      style={{
        padding:       "10px 0",
        color:         VANTARY.ashSoft,
      }}
    >
      <span
        className="font-mono uppercase"
        style={{ fontSize: 9.5, letterSpacing: "0.22em" }}
      >
        NO RENDERER WIRED
      </span>
      <p className="font-sans" style={{ fontSize: 12, color: VANTARY.paperDim, margin: 0 }}>
        {`The "${card.entry.label}" module is marked READY in the registry but its deck renderer is missing. Pass a `}<code style={{ fontFamily: "var(--font-mono)" }}>{`renderShort`}</code>{` / `}<code style={{ fontFamily: "var(--font-mono)" }}>{`renderExpanded`}</code>{` prop from the deck container.`}
      </p>
    </div>
  )
}
