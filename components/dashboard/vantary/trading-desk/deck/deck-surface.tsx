"use client"

/* ════════════════════════════════════════════════════════════════════════════
 *  ▌  D E C K   S U R F A C E                                              ▐
 *  ▌  ──────────────────────────────────────────────────────────────────   ▐
 *  ▌  The customization layer that wraps the EXISTING editorial sections   ▐
 *  ▌  below TradingView (Live Equity Volume, Active Windows, Asset         ▐
 *  ▌  Register — and Psychology OS, Forecast, Analyze, etc., as they're    ▐
 *  ▌  built). It does NOT introduce a new visual stack. It augments what's ▐
 *  ▌  already on the page with three powers:                               ▐
 *  ▌                                                                       ▐
 *  ▌    1. HIDE / SHOW    — any module, anytime, persistent across reload  ▐
 *  ▌    2. REORDER        — flip the vertical order of the visible blocks  ▐
 *  ▌    3. RESTORE        — return to canonical defaults in one click      ▐
 *  ▌                                                                       ▐
 *  ▌  All controlled by ONE Customize button anchored top-right just below ▐
 *  ▌  the TradingView bay. The button is hairline, quiet, monospaced caps  ▐
 *  ▌  with a live counter ("03 / 03 visible"). Click → opens an editorial  ▐
 *  ▌  dropdown panel with toggles and reorder arrows.                      ▐
 *  ▌                                                                       ▐
 *  ▌  State lives in the existing TradingDeskProvider (Layer 1.2's v3      ▐
 *  ▌  schema). The bay's side-slot pickers and the deck's customize menu   ▐
 *  ▌  read from the same source of truth, so reordering on the deck is     ▐
 *  ▌  reflected anywhere else the registry-backed state is consumed.       ▐
 *  ▌                                                                       ▐
 *  ▌  ─────────────────────────────────────────────────────────────────    ▐
 *  ▌  QUALITY DOCTRINE — see `components/dashboard/vantary/DOCTRINE.md`    ▐
 *  ▌                                                                       ▐
 *  ▌  Hairline editorial language · Earned motion · Color discipline       ▐
 *  ▌  Honesty in placeholders · Persistence and reconciliation             ▐
 *  ▌                                                                       ▐
 *  ▌  Every interactive surface in this file:                              ▐
 *  ▌    · Reads color exclusively through VANTARY.* (theme-routed CSS).    ▐
 *  ▌    · Earns its hover via accent rail + shine sweep + micro-rotation.  ▐
 *  ▌    · Tabular numerals on every numeric reading.                       ▐
 *  ▌    · Editorial display headlines for protagonists, mono caps for ctx. ▐
 *  ▌                                                                       ▐
 *  ▌  ─────────────────────────────────────────────────────────────────    ▐
 *  ▌  PUBLIC API                                                           ▐
 *  ▌                                                                       ▐
 *  ▌    useDeckSurface()        Hook · returns visibility / order / open   ▐
 *  ▌                            handles for the surface below the chart.   ▐
 *  ▌                                                                       ▐
 *  ▌    <DeckCustomizeButton/>  The floating Customize button (the         ▐
 *  ▌                            trigger). Renders the live counter and     ▐
 *  ▌                            owns the open-state of the dropdown.       ▐
 *  ▌                                                                       ▐
 *  ▌    <DeckCustomizeMenu/>    The dropdown panel itself. Mounted by the  ▐
 *  ▌                            button as a popover; exported separately   ▐
 *  ▌                            for advanced cases (e.g. mobile sheet).    ▐
 *  ▌                                                                       ▐
 *  ▌    <DeckCustomizeStrip/>   Convenience wrapper: a thin row that puts  ▐
 *  ▌                            the button at the right edge with a quiet  ▐
 *  ▌                            eyebrow on the left ("CUSTOMIZE / DECK").  ▐
 *  ▌                            Drop this directly under your bay mount.   ▐
 *  ▌                                                                       ▐
 *  ▌    DECK_SURFACE_POOL       The list of registry ids this surface      ▐
 *  ▌                            governs (i.e. "what shows up in the        ▐
 *  ▌                            customize dropdown"). Mutable. Add a new   ▐
 *  ▌                            id here when you wire a new module.        ▐
 *  ▌                                                                       ▐
 *  ▌  ─────────────────────────────────────────────────────────────────    ▐
 * ═══════════════════════════════════════════════════════════════════════ */

import {
  CSSProperties,
  ReactNode,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion"
import {
  ArrowDown,
  ArrowUp,
  Check,
  Eye,
  EyeOff,
  RotateCcw,
  Sliders,
  X,
} from "lucide-react"

import { VANTARY } from "../../vantary-theme"
import {
  MODULE_BY_ID,
  MODULE_CATEGORY_LABELS,
  type ModuleEntry,
} from "../modules/registry"
import {
  TdSideSlot,
  useDeck,
} from ".."

/* ────────────────────────────────────────────────────────────────────────────
 *  EASING TOKENS · same as the rest of the trading-desk surface.            
 *  EASE_V is the editorial easing — used for opacity, transform,            
 *  and grid-template-columns animations. EASE_LIFT is for the deliberate    
 *  "rise" pattern (hover-lift, drawer entrance).                            
 * ──────────────────────────────────────────────────────────────────────── */
const EASE_V    = [0.65, 0, 0.35, 1] as const
const EASE_LIFT = [0.34, 1.56, 0.64, 1] as const

/* ────────────────────────────────────────────────────────────────────────────
 *  THE POOL · the registry ids this surface governs.                        
 *                                                                           
 *  As you wire more modules onto the surface below TradingView (Psychology  
 *  OS, Forecast, Analyze, Community Search), add their ids here so they     
 *  appear in the customize dropdown. Order is the canonical default order —
 *  used as the reset target by "Restore defaults".                          
 *                                                                           
 *  Anything NOT in this list does not show up on the deck surface — it can  
 *  still live elsewhere on the page (header chip, split panel, etc.) via    
 *  the same registry-backed state.                                          
 * ──────────────────────────────────────────────────────────────────────── */
/* The pool is split into TWO conceptual bands but lives as a single
 * ordered array because the customize menu groups them by the registry's
 * `category` automatically:
 *
 *   PERFORMANCE band  · live-equity, active-windows, account-asset,
 *                       pairs-you-trade
 *   MARKET band       · news-calendar
 *
 * Adding more modules later (risk-meter, daily-max, watchlist, etc.) is
 * a one-line append — the menu picks them up immediately. */
export const DECK_SURFACE_POOL: readonly TdSideSlot[] = [
  "live-equity",
  "active-windows",
  "account-asset",
  "pairs-you-trade",
  "news-calendar",
] as const

/* ────────────────────────────────────────────────────────────────────────────
 *  useDeckSurface() — the single hook every deck consumer uses.             
 *                                                                           
 *  Returns:                                                                 
 *    visibleIds      Ordered array of registry ids that are NOT hidden.     
 *                    Iteration order respects the user's reordering.        
 *    isVisible(id)   Convenience predicate.                                 
 *    pool            The full pool the surface governs (DECK_SURFACE_POOL). 
 *    counter         { visible, total } — used by the customize button      
 *                    label to show "03 / 03 visible".                       
 *    setHidden(id,b) Toggle a module's hidden state.                        
 *    moveUp(id)      Reorder · move id one position earlier in the pool.    
 *    moveDown(id)    Reorder · move id one position later  in the pool.    
 *    restoreDefaults Reset visibility AND order back to canonical.         
 * ──────────────────────────────────────────────────────────────────────── */
export interface DeckSurfaceCounter {
  visible: number
  total:   number
}

export interface DeckSurfaceApi {
  /** Registry ids that are visible, in user-chosen order, restricted to the
   *  pool. Iterate this when rendering. */
  visibleIds:      TdSideSlot[]
  /** Same as visibleIds but includes hidden ids — useful for the customize
   *  menu where the user needs to see hidden rows so they can un-hide them.
   *  Order is also user-chosen. */
  orderedIds:      TdSideSlot[]
  /** Predicate: is this module currently visible? */
  isVisible:       (id: TdSideSlot) => boolean
  /** Pool this surface governs. */
  pool:            readonly TdSideSlot[]
  /** Live counter for the Customize button label. */
  counter:         DeckSurfaceCounter
  /** Toggle a module's visibility. */
  setHidden:       (id: TdSideSlot, hidden: boolean) => void
  /** Reorder one position earlier in the pool. */
  moveUp:          (id: TdSideSlot) => void
  /** Reorder one position later in the pool. */
  moveDown:        (id: TdSideSlot) => void
  /** Reset visibility + order to canonical defaults. */
  restoreDefaults: () => void
}

export function useDeckSurface(): DeckSurfaceApi {
  const { cards, actions } = useDeck()

  /* The hook works against DECK_SURFACE_POOL. Anything outside the pool is
   * ignored when computing visibility / order / counter — even if the
   * registry knows about it — so this surface stays purely the trader's
   * "below-the-chart instrument cluster." */
  const pool = DECK_SURFACE_POOL

  /* `cards` from useDeck() is the full registry-reconciled deck list in
   * the trader's chosen order, with each card carrying its hidden flag.
   * We slice out only the pool entries — the "below the chart" surface —
   * preserving their relative order. */
  const orderedIds = useMemo<TdSideSlot[]>(() => {
    const inPool = (id: string): id is TdSideSlot =>
      (pool as readonly string[]).includes(id)
    const fromCards = cards.map((c) => c.id).filter(inPool) as TdSideSlot[]
    /* Append any pool entry that isn't represented in cards — covers
     * the "user upgraded VANTARY and a new module was added to the pool"
     * case. New modules slot in at the end so we don't surprise the
     * trader by reshuffling their existing layout. */
    const missing = pool.filter((id) => !fromCards.includes(id))
    return [...fromCards, ...missing]
  }, [cards, pool])

  /* Hidden flag map — derived from cards so the predicate is O(1). */
  const hiddenById = useMemo<Record<string, boolean>>(() => {
    const m: Record<string, boolean> = {}
    for (const c of cards) m[c.id] = c.hidden
    return m
  }, [cards])

  const visibleIds = useMemo<TdSideSlot[]>(
    () => orderedIds.filter((id) => !hiddenById[id]),
    [orderedIds, hiddenById],
  )

  const counter = useMemo<DeckSurfaceCounter>(
    () => ({ visible: visibleIds.length, total: pool.length }),
    [visibleIds.length, pool.length],
  )

  const isVisible = useCallback(
    (id: TdSideSlot) => !hiddenById[id],
    [hiddenById],
  )

  const setHidden = useCallback(
    (id: TdSideSlot, hidden: boolean) => {
      actions.setHidden(id, hidden)
    },
    [actions],
  )

  /* Reorder writes the FULL registry deck order (not just our pool
   * slice) so non-pool cards stay where they were. We keep the cards-
   * derived ordering for everything outside the pool and replace just
   * the pool entries with the new order. */
  const writePoolOrder = useCallback(
    (nextPoolOrder: TdSideSlot[]) => {
      const allIds = cards.map((c) => c.id)
      const poolSet = new Set<string>(pool)
      /* Walk the original ids; whenever we hit a pool id, emit the next
       * one from nextPoolOrder. Non-pool ids pass through unchanged. */
      let cursor = 0
      const result: TdSideSlot[] = []
      for (const id of allIds) {
        if (poolSet.has(id)) {
          const replacement = nextPoolOrder[cursor]
          cursor += 1
          if (replacement) result.push(replacement)
        } else {
          result.push(id)
        }
      }
      /* Append any pool members that the original cards didn't include
       * (new modules added since last hydrate). */
      for (let i = cursor; i < nextPoolOrder.length; i += 1) {
        result.push(nextPoolOrder[i])
      }
      actions.setOrder(result)
    },
    [actions, cards, pool],
  )

  const moveUp = useCallback(
    (id: TdSideSlot) => {
      const i = orderedIds.indexOf(id)
      if (i <= 0) return
      const next = [...orderedIds]
      next.splice(i, 1)
      next.splice(i - 1, 0, id)
      writePoolOrder(next)
    },
    [orderedIds, writePoolOrder],
  )

  const moveDown = useCallback(
    (id: TdSideSlot) => {
      const i = orderedIds.indexOf(id)
      if (i < 0 || i >= orderedIds.length - 1) return
      const next = [...orderedIds]
      next.splice(i, 1)
      next.splice(i + 1, 0, id)
      writePoolOrder(next)
    },
    [orderedIds, writePoolOrder],
  )

  const restoreDefaults = useCallback(() => {
    actions.resetAll()
  }, [actions])

  return {
    visibleIds,
    orderedIds,
    isVisible,
    pool,
    counter,
    setHidden,
    moveUp,
    moveDown,
    restoreDefaults,
  }
}

/* ────────────────────────────────────────────────────────────────────────────
 *  <DeckCustomizeButton/>                                                   
 *  ──────────��──────────────────                                            
 *  The hairline pill the trader presses to open customize. Anchored at the  
 *  right edge of the strip just below TradingView. The button is the ONLY  
 *  user-facing trigger for the deck-surface customization model — every    
 *  other affordance (reorder / hide) lives inside the dropdown.            
 *                                                                           
 *  Anatomy:                                                                 
 *    [Sliders icon]   CUSTOMIZE   ─────   03 / 03                           
 *      ↑ rotates       ↑ mono caps  ↑ hairline    ↑ tabular live counter   
 *        90° on open                                                        
 *                                                                           
 *  Earned motion (per DOCTRINE §2.2):                                       
 *    · Hover:   accent rail fades in along the top edge,                    
 *               1px → 1px (no thickness change), color shifts amber.        
 *    · Hover:   single shine sweep, ~700ms, one pass only.                  
 *    · Hover:   icon micro-rotates 6° to telegraph "this is interactive."   
 *    · Active:  icon rotates 90°, accent rail anchored visible,             
 *               background shifts 1.5% darker so the open state reads.      
 * ──────────────────────────────────────────────────────────────────────── */
export interface DeckCustomizeButtonProps {
  /** Override the button label. Default: "Customize" */
  label?:        string
  /** Size variant — md is the default, sm is for tighter contexts. */
  size?:         "sm" | "md"
  /** Pre-control of open state. If omitted, the button owns its own state
   *  and mounts the menu inline. */
  open?:         boolean
  onOpenChange?: (open: boolean) => void
  /** Where to anchor the popover (default top-right of the button). */
  align?:        "left" | "right"
  /** Optional class name forwarded to the button shell. */
  className?:    string
  style?:        CSSProperties
}

export const DeckCustomizeButton = forwardRef<HTMLButtonElement, DeckCustomizeButtonProps>(
  function DeckCustomizeButton(props, ref) {
    const {
      label = "Customize",
      size  = "md",
      open: openProp,
      onOpenChange,
      align = "right",
      className,
      style,
    } = props

    const isControlled = openProp !== undefined
    const [openInner, setOpenInner] = useState(false)
    const open = isControlled ? !!openProp : openInner
    const setOpen = useCallback(
      (next: boolean) => {
        if (!isControlled) setOpenInner(next)
        onOpenChange?.(next)
      },
      [isControlled, onOpenChange],
    )

    const surface = useDeckSurface()
    const reduce  = useReducedMotion()
    const [hover, setHover] = useState(false)
    const containerRef      = useRef<HTMLDivElement>(null)

    /* Click-outside / Escape close. The dropdown's own internal Escape
     * handler closes it, but if the button owns its own state we mirror
     * that here so the close path is symmetric. */
    useEffect(() => {
      if (!open) return
      function onPointerDown(e: PointerEvent) {
        const node = containerRef.current
        if (!node) return
        if (node.contains(e.target as Node)) return
        setOpen(false)
      }
      function onKey(e: KeyboardEvent) {
        if (e.key === "Escape") setOpen(false)
      }
      document.addEventListener("pointerdown", onPointerDown, true)
      document.addEventListener("keydown", onKey)
      return () => {
        document.removeEventListener("pointerdown", onPointerDown, true)
        document.removeEventListener("keydown", onKey)
      }
    }, [open, setOpen])

    const dims = size === "sm"
      ? { px: 10, py: 6,  iconSize: 12, fontSize: 10, gap: 8,  count: 9  }
      : { px: 14, py: 9,  iconSize: 14, fontSize: 11, gap: 10, count: 10 }

    /* The shine sweep is a single overlay span that animates from x:-110%
     * to x:110% on hover-enter. We toggle its key on hover so each entry
     * triggers a fresh single-pass — no looping. */
    const shineKey = `shine-${hover ? "on" : "off"}`

    /* Live counter — formats the visible / total readout in tabular nums. */
    const counterText = `${String(surface.counter.visible).padStart(2, "0")} · ${String(
      surface.counter.total,
    ).padStart(2, "0")}`

    return (
      <div
        ref={containerRef}
        className={`relative inline-flex ${className ?? ""}`}
        style={style}
      >
        <button
          ref={ref}
          type="button"
          onClick={() => setOpen(!open)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={`${label} the deck below the chart. ${surface.counter.visible} of ${surface.counter.total} modules visible.`}
          className="relative inline-flex items-center font-mono uppercase select-none focus:outline-none overflow-hidden"
          style={{
            paddingInline: dims.px,
            paddingBlock:  dims.py,
            gap:           dims.gap,
            fontSize:      dims.fontSize,
            letterSpacing: "0.22em",
            color:         open ? VANTARY.paper : (hover ? VANTARY.paper : VANTARY.ash),
            background:    open ? VANTARY.glass : "transparent",
            border:        `1px solid ${open ? VANTARY.ash : VANTARY.rule}`,
            borderRadius:  2,
            transition:    "color 220ms ease, background 220ms ease, border-color 220ms ease",
            cursor:        "pointer",
          }}
        >
          {/* Top-edge accent rail · fades in on hover/open. The rail is
              the canonical "this surface is interactive" signal across
              the VANTARY language. */}
          <motion.span
            aria-hidden
            initial={false}
            animate={{ opacity: hover || open ? 1 : 0 }}
            transition={{ duration: 0.24, ease: EASE_V }}
            style={{
              position: "absolute",
              top:  0,
              left: 0,
              right: 0,
              height: 1,
              background: VANTARY.amber,
              pointerEvents: "none",
            }}
          />

          {/* Single shine sweep · one pass per hover-enter. Sized to the
              button so it reads as a moving highlight rather than a glow. */}
          {!reduce && (
            <motion.span
              key={shineKey}
              aria-hidden
              initial={{ x: "-110%" }}
              animate={{ x: hover ? "110%" : "-110%" }}
              transition={{ duration: 0.7, ease: EASE_V }}
              style={{
                position: "absolute",
                top:    -1,
                bottom: -1,
                left:   0,
                width:  "60%",
                background: `linear-gradient(90deg, transparent, ${VANTARY.glass}, transparent)`,
                pointerEvents: "none",
                opacity: 0.9,
              }}
            />
          )}

          {/* Icon — Sliders. Rotates 90° when open, micro-rotates 6° on
              hover. The icon is the action; the rotation is the verb. */}
          <motion.span
            aria-hidden
            animate={{
              rotate: open ? 90 : (hover ? 6 : 0),
              color:  open || hover ? VANTARY.amber : VANTARY.ash,
            }}
            transition={{ duration: 0.32, ease: EASE_LIFT }}
            style={{ display: "inline-flex", alignItems: "center" }}
          >
            <Sliders size={dims.iconSize} strokeWidth={1.4} />
          </motion.span>

          <span style={{ position: "relative", zIndex: 1 }}>{label}</span>

          {/* Hairline divider · keeps the counter typographically separate
              from the verb. */}
          <span
            aria-hidden
            style={{
              width:  18,
              height: 1,
              background: VANTARY.rule,
              opacity: 0.7,
            }}
          />

          {/* Live counter · tabular numerals so it never jitters as the
              digits change. */}
          <span
            style={{
              fontVariantNumeric: "tabular-nums",
              fontSize: dims.count,
              letterSpacing: "0.18em",
              color: surface.counter.visible === 0
                ? VANTARY.warnEdge
                : (open || hover ? VANTARY.amber : VANTARY.ashSoft),
              transition: "color 220ms ease",
              position: "relative",
              zIndex: 1,
            }}
          >
            {counterText}
          </span>
        </button>

        <AnimatePresence>
          {open && (
            <DeckCustomizeMenu
              align={align}
              onClose={() => setOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    )
  },
)

/* ────────────────────────────────────────────────────────────────────────────
 *  <DeckCustomizeMenu/>                                                     
 *  ─────────────────────────                                                
 *  The dropdown panel. Editorial type, hairline framing, accent rail on the 
 *  top edge, three-section layout:                                          
 *                                                                           
 *    1. Header     — eyebrow / heading / subtitle / live counter            
 *    2. Modules    — one row per pool entry, with reorder + visibility      
 *    3. Footer     — restore defaults · close                               
 *                                                                           
 *  Each module row is a compound control:                                   
 *                                                                           
 *    [↑] [↓]   M  Live Equity Volume               EQUITY    [eye]          
 *               The arc of the bankroll.                                    
 *                                                                           
 *  The eye toggles visibility. The arrows reorder. Hidden rows render with  
 *  their visibility chip greyed and the row label dimmed, but reorder      
 *  arrows still work — so the trader can decide where a module will sit    
 *  BEFORE re-enabling it.                                                  
 * ──────────────────────────────────────────────────────────────────────── */
export interface DeckCustomizeMenuProps {
  align?: "left" | "right"
  onClose: () => void
}

export const DeckCustomizeMenu = memo(function DeckCustomizeMenu({
  align = "right",
  onClose,
}: DeckCustomizeMenuProps) {
  const surface = useDeckSurface()
  const reduce  = useReducedMotion()

  /* Group ids by category so the dropdown reads as an editorial table of
   * contents rather than an undifferentiated list. The MODULE_BY_ID map
   * resolves each id to its registry entry; we group on the resolved
   * category. */
  const groups = useMemo(() => {
    const byCat = new Map<string, ModuleEntry[]>()
    for (const id of surface.orderedIds) {
      const entry = MODULE_BY_ID[id]
      if (!entry) continue
      const cat = entry.category
      const arr = byCat.get(cat) ?? []
      arr.push(entry)
      byCat.set(cat, arr)
    }
    return Array.from(byCat.entries()).map(([cat, entries]) => ({
      cat,
      entries,
    }))
  }, [surface.orderedIds])

  return (
    <motion.div
      role="dialog"
      aria-label="Customize the deck below the chart"
      initial={{ opacity: 0, y: -6, scale: 0.985 }}
      animate={{ opacity: 1, y:  0, scale: 1 }}
      exit={{    opacity: 0, y: -6, scale: 0.985 }}
      transition={{ duration: reduce ? 0 : 0.22, ease: EASE_V }}
      className="absolute z-50"
      style={{
        top:    "calc(100% + 8px)",
        right:  align === "right" ? 0 : "auto",
        left:   align === "left"  ? 0 : "auto",
        minWidth: 380,
        maxWidth: 440,
        /* VANTARY.bg doesn't exist on the theme — `glassDeep` is the
         * authored token for "darkest reading-surface" and is what every
         * other VANTARY popover/dropdown reads, so we match it here. */
        background: VANTARY.glassDeep,
        border:     `1px solid ${VANTARY.rule}`,
        borderRadius: 2,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        boxShadow: "0 12px 36px rgba(0,0,0,0.32), 0 2px 6px rgba(0,0,0,0.18)",
        overflow: "hidden",
      }}
    >
      {/* Top-edge accent rail · same visual signal as the button. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top:  0,
          left: 0,
          right: 0,
          height: 1,
          background: VANTARY.amber,
          pointerEvents: "none",
        }}
      />

      {/* HEADER */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: `1px solid ${VANTARY.rule}` }}>
        <div
          className="flex items-center gap-2 font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.32em",
            color: VANTARY.ashSoft,
          }}
        >
          <span
            aria-hidden
            className="rounded-full"
            style={{ width: 5, height: 5, background: VANTARY.amber }}
          />
          <span>CUSTOMIZE · DECK SURFACE</span>
        </div>

        <h3
          className="font-sans mt-2"
          style={{
            fontSize: 18,
            color: VANTARY.paper,
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          Your trading surface
        </h3>

        <p
          className="mt-1"
          style={{ fontSize: 12, color: VANTARY.ash, lineHeight: 1.55 }}
        >
          Choose what shows below the chart, and in what order. Changes
          persist across reloads.
        </p>

        <div
          className="flex items-center justify-between mt-3 font-mono uppercase"
          style={{ fontSize: 10, letterSpacing: "0.22em" }}
        >
          <span style={{ color: VANTARY.ashSoft }}>
            <span style={{ color: VANTARY.paper, fontVariantNumeric: "tabular-nums" }}>
              {String(surface.counter.visible).padStart(2, "0")}
            </span>{" "}
            <span>of</span>{" "}
            <span style={{ color: VANTARY.paper, fontVariantNumeric: "tabular-nums" }}>
              {String(surface.counter.total).padStart(2, "0")}
            </span>{" "}
            <span>visible</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close customize menu"
            className="inline-flex items-center justify-center"
            style={{
              width: 22,
              height: 22,
              border: `1px solid ${VANTARY.rule}`,
              borderRadius: 2,
              color: VANTARY.ash,
              background: "transparent",
              cursor: "pointer",
              transition: "color 180ms ease, border-color 180ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = VANTARY.paper
              e.currentTarget.style.borderColor = VANTARY.ash
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = VANTARY.ash
              e.currentTarget.style.borderColor = VANTARY.rule
            }}
          >
            <X size={11} strokeWidth={1.6} />
          </button>
        </div>
      </div>

      {/* MODULE GROUPS */}
      <div className="px-3 py-3 max-h-[60vh] overflow-y-auto">
        {groups.map(({ cat, entries }, gi) => (
          <div key={cat} className={gi === 0 ? "" : "mt-3"}>
            <div
              className="px-2 pb-2 font-mono uppercase"
              style={{
                fontSize: 9,
                letterSpacing: "0.32em",
                color: VANTARY.ashSoft,
              }}
            >
              {/* MODULE_CATEGORY_LABELS resolves to `{ short, long, description }`
                   — we render `.short` because it's the mono-caps token built
                   for chrome ("PERFORMANCE", "MARKET", etc). Rendering the
                   whole object would have thrown "Objects are not valid as a
                   React child" (the original cause of the menu black-screen). */}
              {MODULE_CATEGORY_LABELS[cat as keyof typeof MODULE_CATEGORY_LABELS]?.short ?? cat}
            </div>

            <div className="flex flex-col">
              {entries.map((entry) => (
                <DeckCustomizeRow
                  key={entry.id}
                  entry={entry}
                  surface={surface}
                />
              ))}
            </div>
          </div>
        ))}

        {groups.length === 0 && (
          <div
            className="px-3 py-6 text-center"
            style={{ fontSize: 12, color: VANTARY.ash, lineHeight: 1.55 }}
          >
            No modules registered for the deck surface yet. Add an entry to
            <code style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: VANTARY.amber,
              padding: "0 4px",
            }}>
              DECK_SURFACE_POOL
            </code>
            to enable customization.
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ borderTop: `1px solid ${VANTARY.rule}` }}
      >
        <button
          type="button"
          onClick={surface.restoreDefaults}
          className="inline-flex items-center gap-2 font-mono uppercase group"
          style={{
            fontSize: 10,
            letterSpacing: "0.22em",
            color: VANTARY.ash,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px 0",
            transition: "color 220ms ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = VANTARY.paper }}
          onMouseLeave={(e) => { e.currentTarget.style.color = VANTARY.ash }}
        >
          <motion.span
            aria-hidden
            whileHover={{ rotate: -90 }}
            transition={{ duration: 0.4, ease: EASE_LIFT }}
            style={{ display: "inline-flex", alignItems: "center" }}
            className="group-hover:[color:var(--vantary-amber)]"
          >
            <RotateCcw size={11} strokeWidth={1.4} />
          </motion.span>
          <span>Restore defaults</span>
        </button>

        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.22em",
            color: VANTARY.ashSoft,
          }}
        >
          v3 · saved
        </span>
      </div>
    </motion.div>
  )
})

/* ────────────────────────────────────────────────────────────────────────────
 *  <DeckCustomizeRow/>                                                      
 *  One row per module — reorder arrows, label, category tag, visibility.    
 * ──────────────────────────────────────────────────────────────────────── */
interface DeckCustomizeRowProps {
  entry:   ModuleEntry
  surface: DeckSurfaceApi
}

const DeckCustomizeRow = memo(function DeckCustomizeRow({
  entry,
  surface,
}: DeckCustomizeRowProps) {
  const visible = surface.isVisible(entry.id)
  const idx     = surface.orderedIds.indexOf(entry.id)
  const isFirst = idx === 0
  const isLast  = idx === surface.orderedIds.length - 1

  const [hover, setHover] = useState(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative flex items-center gap-3 px-2 py-2.5"
      style={{
        borderRadius: 2,
        background: hover ? VANTARY.glass : "transparent",
        transition: "background 200ms ease",
      }}
    >
      {/* Reorder arrows — vertical pair on the left edge. The disabled
          state is purely visual; the click is short-circuited inside the
          handlers (moveUp/moveDown are no-ops at the boundary). */}
      <div className="flex flex-col items-center gap-0.5">
        <ReorderButton
          direction="up"
          disabled={isFirst}
          onClick={() => surface.moveUp(entry.id)}
        />
        <ReorderButton
          direction="down"
          disabled={isLast}
          onClick={() => surface.moveDown(entry.id)}
        />
      </div>

      {/* Position number — tabular, monospaced, gives the trader a sense
          of "where am I in the stack." */}
      <span
        className="font-mono"
        style={{
          fontSize: 10,
          fontVariantNumeric: "tabular-nums",
          color: visible ? VANTARY.ashSoft : VANTARY.ash,
          width: 14,
          textAlign: "center",
          letterSpacing: "0.05em",
        }}
      >
        {String(idx + 1).padStart(2, "0")}
      </span>

      {/* Label + description. Description from the registry — hairline-
          editorial honesty about what this module IS. */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="font-sans truncate"
            style={{
              fontSize: 13,
              color: visible ? VANTARY.paper : VANTARY.ash,
              fontWeight: 500,
              letterSpacing: "-0.005em",
            }}
          >
            {entry.label}
          </span>
          {entry.readiness === "planned" && (
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 8,
                letterSpacing: "0.22em",
                color: VANTARY.amber,
                border: `1px solid ${VANTARY.amber}`,
                padding: "1px 4px",
                borderRadius: 1,
                opacity: 0.85,
              }}
            >
              SOON
            </span>
          )}
        </div>
        <p
          className="mt-0.5 truncate"
          style={{
            fontSize: 11,
            color: VANTARY.ash,
            lineHeight: 1.4,
          }}
        >
          {entry.description ?? ""}
        </p>
      </div>

      {/* Visibility toggle — eye / eye-off. The toggle borrows the warn
          tint ONLY in the hover state when about to hide the LAST visible
          module (defensive: the reducer also guards this, but visual
          feedback is necessary). */}
      <VisibilityToggle
        visible={visible}
        atFloor={surface.counter.visible <= 1 && visible}
        onToggle={() => surface.setHidden(entry.id, visible)}
      />
    </div>
  )
})

/* ────────────────────────────────────────────────────────────────────────────
 *  <ReorderButton/> — tiny up/down arrow with hover micro-motion.           
 * ──────────────────────────────────────────────────────────────────────── */
interface ReorderButtonProps {
  direction: "up" | "down"
  disabled:  boolean
  onClick:   () => void
}

function ReorderButton({ direction, disabled, onClick }: ReorderButtonProps) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={direction === "up" ? "Move up" : "Move down"}
      className="inline-flex items-center justify-center focus:outline-none"
      style={{
        width:  16,
        height: 12,
        background: "transparent",
        border: "none",
        cursor: disabled ? "default" : "pointer",
        color: disabled
          ? VANTARY.rule
          : hover
            ? VANTARY.paper
            : VANTARY.ash,
        opacity: disabled ? 0.45 : 1,
        transition: "color 180ms ease",
      }}
    >
      <motion.span
        animate={{
          y: hover && !disabled ? (direction === "up" ? -1 : 1) : 0,
        }}
        transition={{ duration: 0.22, ease: EASE_V }}
        style={{ display: "inline-flex" }}
      >
        {direction === "up"
          ? <ArrowUp   size={10} strokeWidth={1.6} />
          : <ArrowDown size={10} strokeWidth={1.6} />
        }
      </motion.span>
    </button>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
 *  <VisibilityToggle/> — eye/eye-off, with warn tint at-floor.              
 * ──────────────────────────────────────────────────────────────────────── */
interface VisibilityToggleProps {
  visible:  boolean
  /** True when toggling THIS row would leave zero visible modules. The
   *  toggle is still clickable (the user might want exactly that), but
   *  the warning tint primes the trader. */
  atFloor:  boolean
  onToggle: () => void
}

function VisibilityToggle({ visible, atFloor, onToggle }: VisibilityToggleProps) {
  const [hover, setHover] = useState(false)
  const willWarn = atFloor && hover

  return (
    <button
      type="button"
      onClick={onToggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={visible ? "Hide module" : "Show module"}
      aria-pressed={visible}
      className="inline-flex items-center justify-center focus:outline-none"
      style={{
        width:  28,
        height: 22,
        /* VANTARY.warn doesn't exist; `warnEdge` is the authored token for
         * "destructive boundary" — same red the rest of the app reads. */
        border: `1px solid ${
          willWarn
            ? VANTARY.warnEdge
            : visible
              ? (hover ? VANTARY.amber : VANTARY.rule)
              : (hover ? VANTARY.ash   : VANTARY.rule)
        }`,
        borderRadius: 2,
        background: visible
          ? (hover ? VANTARY.glass : "transparent")
          : (hover ? VANTARY.glass : "transparent"),
        color: willWarn
          ? VANTARY.warnEdge
          : visible
            ? (hover ? VANTARY.amber : VANTARY.paper)
            : (hover ? VANTARY.paper : VANTARY.ash),
        cursor: "pointer",
        transition: "color 180ms ease, background 180ms ease, border-color 180ms ease",
      }}
    >
      <motion.span
        key={visible ? "on" : "off"}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1,   opacity: 1 }}
        transition={{ duration: 0.18, ease: EASE_LIFT }}
        style={{ display: "inline-flex" }}
      >
        {visible
          ? <Eye    size={11} strokeWidth={1.5} />
          : <EyeOff size={11} strokeWidth={1.5} />
        }
      </motion.span>
    </button>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
 *  <DeckCustomizeStrip/>                                                    
 *  ─────────────────────────                                                
 *  Convenience: the thin row that lives directly under the trading-desk    
 *  bay. Quiet eyebrow on the left, customize button on the right, hairline 
 *  divider underneath.                                                     
 *                                                                           
 *  Drop this directly under <TradingDeskBay/> in your-space.tsx and the    
 *  trader gets the entire customize affordance with no further wiring.    
 * ──────────────────────────────────────────────────────────────────────── */
export interface DeckCustomizeStripProps {
  /** Optional eyebrow override. */
  eyebrow?: string
  /** Optional sub-line override. */
  caption?: ReactNode
  /** Class name forwarded to the strip container. */
  className?: string
  style?: CSSProperties
}

export function DeckCustomizeStrip({
  eyebrow = "DECK · BELOW CHART",
  caption,
  className,
  style,
}: DeckCustomizeStripProps) {
  const surface = useDeckSurface()

  return (
    <div
      className={`flex items-center justify-between gap-4 ${className ?? ""}`}
      style={{
        borderTop:    `1px solid ${VANTARY.rule}`,
        borderBottom: `1px solid ${VANTARY.rule}`,
        paddingTop:    14,
        paddingBottom: 14,
        ...(style ?? {}),
      }}
    >
      <div className="flex flex-col gap-1 min-w-0">
        <div
          className="flex items-center gap-2 font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.32em",
            color: VANTARY.ashSoft,
          }}
        >
          <span
            aria-hidden
            className="rounded-full"
            style={{ width: 5, height: 5, background: VANTARY.amber }}
          />
          <span aria-hidden style={{ width: 16, height: 1, background: VANTARY.rule }} />
          <span>{eyebrow}</span>
        </div>
        <div
          className="flex items-center gap-2 truncate"
          style={{ fontSize: 12, color: VANTARY.ash }}
        >
          {caption ?? (
            <span>
              <span style={{ color: VANTARY.paper, fontVariantNumeric: "tabular-nums" }}>
                {String(surface.counter.visible).padStart(2, "0")}
              </span>{" "}
              of{" "}
              <span style={{ color: VANTARY.paper, fontVariantNumeric: "tabular-nums" }}>
                {String(surface.counter.total).padStart(2, "0")}
              </span>{" "}
              modules visible · drag with the customize menu to reorder
            </span>
          )}
        </div>
      </div>
      <DeckCustomizeButton />
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
 *  Re-export the doctrine reference so consumers can show it inline if    
 *  they want (e.g. a debug overlay, a developer settings sheet).          
 * ──────────────────────────────────────────────────────────────────────── */
export const DECK_DOCTRINE_REF =
  "components/dashboard/vantary/DOCTRINE.md"
