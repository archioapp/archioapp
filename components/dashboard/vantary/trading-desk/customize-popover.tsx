"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  TRADING DESK · CUSTOMIZE POPOVER
 *  ─────────────────────────────────────────────────────────────────────────
 *  A small `[CUSTOMIZE]` chip in the bay header. Clicking it opens a
 *  popover anchored beneath the chip with three tabs:
 *
 *    1. MODULES — pick which module fills the side slot, and pin/unpin
 *                  modules from the header chip rail. The customize
 *                  button is the source of truth for "which modules
 *                  exist" — the chip rail in the header is just the
 *                  trader's pinned subset.
 *
 *    2. LAYOUT  — one-click presets (FOCUS, 50/50, 60/40, 70/30, swap
 *                  side) that write to layout/tvWidthPct/sideSlotPosition.
 *
 *    3. PEEK    — toggle the chart-edge hover-peek behavior on/off.
 *
 *  The popover is dismissible by ESC, outside click, or pressing the
 *  customize chip again. State is owned locally (open/closed + active
 *  tab); everything else flows through the trading-desk provider.
 *
 *  Positioning: the popover renders as a fixed-positioned panel
 *  computed from the trigger's bounding rect on open. This avoids
 *  layout-shift issues if the popover ends up taller than the row
 *  height.
 * ═══════════════════════════════════════════════════════════════════════ */

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Settings2,
  Check,
  Pin,
  PinOff,
  ChevronRight,
  Hourglass,
  Eye,
  EyeOff,
} from "lucide-react"

import { useTradingDesk } from "./provider"
import {
  TD_SIDE_SLOT_LABELS,
  TD_SIDE_SLOT_SHORT_LABELS,
  TD_SIDE_SLOT_IMPLEMENTED,
  TD_LAYOUT_PRESETS,
  type TdSideSlot,
} from "./data"
import { VANTARY } from "../vantary-theme"

/* ─── 1.  TYPES ──────────────────────────────────────────────────── */

type Tab = "modules" | "layout" | "peek"

const TAB_ORDER: ReadonlyArray<{ id: Tab; label: string }> = [
  { id: "modules", label: "MODULES" },
  { id: "layout",  label: "LAYOUT"  },
  { id: "peek",    label: "PEEK"    },
] as const

/* The full module library — order is intentional, groups related
 * modules together so the popover reads as a logical inventory rather
 * than an alphabet soup. */
const ALL_SLOTS: ReadonlyArray<TdSideSlot> = [
  "active-windows",
  "pending-orders",
  "pairs-you-trade",
  "live-equity",
  "risk-meter",
  "daily-max",
  "account-asset",
  "news-calendar",
  "watchlist",
  "ai-copilot",
] as const

/* ─── 2.  THE CUSTOMIZE BUTTON ───────────────────────────────────── */

export const CustomizeButton = memo(function CustomizeButton() {
  const [open,    setOpen]   = useState(false)
  const [tab,     setTab]    = useState<Tab>("modules")
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)

  /* Close on ESC + outside click. */
  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (popoverRef.current?.contains(e.target as Node)) return
      if (triggerRef.current?.contains(e.target as Node)) return
      setOpen(false)
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

  /* Anchor position — recomputed when the popover opens. */
  const [anchor, setAnchor] = useState<{ top: number; right: number } | null>(null)
  useEffect(() => {
    if (!open || !triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setAnchor({
      top:   rect.bottom + 8,
      right: window.innerWidth - rect.right,
    })
    const onResize = () => {
      const r = triggerRef.current?.getBoundingClientRect()
      if (!r) return
      setAnchor({ top: r.bottom + 8, right: window.innerWidth - r.right })
    }
    window.addEventListener("resize", onResize)
    window.addEventListener("scroll", onResize, true)
    return () => {
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", onResize, true)
    }
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="Customize trading desk"
        aria-expanded={open}
        title="Customize · pick modules, layout, peek behavior"
        className="flex items-center gap-1.5 font-mono uppercase tabular-nums whitespace-nowrap"
        style={{
          padding:       "3px 8px",
          fontSize:      9,
          letterSpacing: "0.18em",
          color:         open ? VANTARY.amber : VANTARY.paper,
          background:    open ? VANTARY.amberWash : "transparent",
          border:        `1px solid ${open ? VANTARY.amberHalo : VANTARY.rule}`,
          borderRadius:  3,
          cursor:        "pointer",
          transition:    "background 0.18s, border-color 0.18s, color 0.18s",
        }}
        onMouseEnter={e => {
          if (open) return
          ;(e.currentTarget as HTMLElement).style.background  = VANTARY.amberWash
          ;(e.currentTarget as HTMLElement).style.borderColor = VANTARY.amberHalo
          ;(e.currentTarget as HTMLElement).style.color       = VANTARY.amber
        }}
        onMouseLeave={e => {
          if (open) return
          ;(e.currentTarget as HTMLElement).style.background  = "transparent"
          ;(e.currentTarget as HTMLElement).style.borderColor = VANTARY.rule
          ;(e.currentTarget as HTMLElement).style.color       = VANTARY.paper
        }}
      >
        <Settings2 size={11} strokeWidth={1.6} />
        CUSTOMIZE
      </button>

      <AnimatePresence>
        {open && anchor && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            role="dialog"
            aria-label="Trading desk customization"
            style={{
              position:     "fixed",
              top:          anchor.top,
              right:        anchor.right,
              width:        380,
              maxHeight:    "min(72vh, 620px)",
              background:   VANTARY.ink ?? VANTARY.paper,
              border:       `1px solid ${VANTARY.rule}`,
              borderRadius: 4,
              boxShadow:    "0 12px 48px rgba(0,0,0,0.4)",
              zIndex:       100,
              display:      "flex",
              flexDirection: "column",
              overflow:     "hidden",
            }}
          >
            <PopoverHeader tab={tab} setTab={setTab} onClose={() => setOpen(false)} />
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
              {tab === "modules" && <ModulesTab />}
              {tab === "layout"  && <LayoutTab  />}
              {tab === "peek"    && <PeekTab    />}
            </div>
            <PopoverFooter />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
})

/* ─── 3.  POPOVER HEADER (tab strip) ─────────────────────────────── */

function PopoverHeader({
  tab, setTab, onClose,
}: {
  tab: Tab
  setTab: (t: Tab) => void
  onClose: () => void
}) {
  return (
    <header
      style={{
        borderBottom: `1px solid ${VANTARY.rule}`,
        padding:      "10px 14px 0 14px",
        background:   VANTARY.ink ?? VANTARY.paper,
        flexShrink:   0,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Settings2 size={12} strokeWidth={1.6} color={VANTARY.amber} />
        <span
          className="font-mono uppercase"
          style={{ fontSize: 10.5, letterSpacing: "0.22em", color: VANTARY.amber, fontWeight: 500 }}
        >
          CUSTOMIZE TRADING DESK
        </span>
        <span style={{ flex: 1 }} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="font-mono uppercase"
          style={{
            padding:       "1px 6px",
            fontSize:      9,
            letterSpacing: "0.18em",
            color:         VANTARY.ashSoft,
            background:    "transparent",
            border:        `1px solid ${VANTARY.rule}`,
            borderRadius:  2,
            cursor:        "pointer",
          }}
        >
          ESC
        </button>
      </div>
      <div className="flex items-center gap-1">
        {TAB_ORDER.map(t => {
          const active = t.id === tab
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className="font-mono uppercase tabular-nums relative"
              style={{
                padding:       "5px 9px",
                fontSize:      9.5,
                letterSpacing: "0.18em",
                color:         active ? VANTARY.amber : VANTARY.ashSoft,
                fontWeight:    active ? 500 : 400,
                background:    "transparent",
                border:        "none",
                cursor:        "pointer",
                transition:    "color 0.18s",
              }}
            >
              {t.label}
              {active && (
                <motion.span
                  aria-hidden
                  layoutId="td-popover-tab-underline"
                  style={{
                    position: "absolute",
                    left:     0,
                    right:    0,
                    bottom:   -1,
                    height:   1.5,
                    background: VANTARY.amber,
                  }}
                  transition={{ type: "spring", stiffness: 360, damping: 32 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </header>
  )
}

/* ─── 4.  MODULES TAB ────────────────────────────────────────────── */

function ModulesTab() {
  const { state, actions } = useTradingDesk()
  const favs = useMemo(() => new Set(state.slotFavorites ?? []), [state.slotFavorites])

  return (
    <div className="flex flex-col">
      {/* Section: pick active module */}
      <SectionTitle>ACTIVE MODULE</SectionTitle>
      <p
        className="font-sans px-4 py-2"
        style={{ fontSize: 11.5, color: VANTARY.paperDim, lineHeight: 1.5 }}
      >
        The module currently filling the side panel. Click any row below
        to switch — the chart will split if it&apos;s in CHART mode.
      </p>

      {/* Section: full library list */}
      <SectionTitle>MODULE LIBRARY</SectionTitle>
      <div className="flex flex-col">
        {ALL_SLOTS.map(slot => {
          const active = slot === state.sideSlot
          const pinned = favs.has(slot)
          const ready  = TD_SIDE_SLOT_IMPLEMENTED[slot]
          return (
            <div
              key={slot}
              className="flex items-center gap-2 px-4 py-2.5"
              style={{ borderBottom: `1px dashed ${VANTARY.rule}` }}
            >
              {/* Active radio */}
              <button
                type="button"
                onClick={() => {
                  if (state.layout === "chart-only") actions.pinPeek()
                  actions.setSideSlot(slot)
                }}
                aria-label={`Activate ${TD_SIDE_SLOT_LABELS[slot]}`}
                className="flex items-center justify-center"
                style={{
                  width:        16,
                  height:       16,
                  borderRadius: "50%",
                  border:       `1.4px solid ${active ? VANTARY.amber : VANTARY.rule}`,
                  background:   "transparent",
                  cursor:       "pointer",
                  flexShrink:   0,
                  transition:   "border-color 0.18s",
                }}
              >
                {active && (
                  <span
                    aria-hidden
                    style={{
                      width:        8,
                      height:       8,
                      borderRadius: "50%",
                      background:   VANTARY.amber,
                    }}
                  />
                )}
              </button>

              {/* Label + status */}
              <div className="flex flex-col flex-1 min-w-0">
                <span
                  className="font-sans"
                  style={{
                    fontSize:   12.5,
                    color:      active ? VANTARY.amber : VANTARY.paper,
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  {TD_SIDE_SLOT_LABELS[slot]}
                </span>
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize:      9,
                    letterSpacing: "0.18em",
                    color:         ready ? VANTARY.ashSoft : VANTARY.paperDim,
                    marginTop:     2,
                  }}
                >
                  {ready ? `READY · ${TD_SIDE_SLOT_SHORT_LABELS[slot]}` : "WIRED SOON"}
                  {!ready && <Hourglass size={9} strokeWidth={1.6} style={{ display: "inline", marginLeft: 4, verticalAlign: "middle" }} />}
                </span>
              </div>

              {/* Pin button */}
              <button
                type="button"
                onClick={() => actions.toggleSlotFavorite(slot)}
                aria-label={pinned ? `Unpin ${TD_SIDE_SLOT_LABELS[slot]} from chip rail` : `Pin ${TD_SIDE_SLOT_LABELS[slot]} to chip rail`}
                title={pinned ? "Unpin from header" : "Pin to header"}
                className="flex items-center justify-center"
                style={{
                  width:        24,
                  height:       24,
                  background:   pinned ? VANTARY.amberWash : "transparent",
                  border:       `1px solid ${pinned ? VANTARY.amberHalo : VANTARY.rule}`,
                  borderRadius: 3,
                  cursor:       "pointer",
                  flexShrink:   0,
                  transition:   "all 0.18s",
                }}
              >
                {pinned
                  ? <Pin    size={11} strokeWidth={1.6} color={VANTARY.amber} />
                  : <PinOff size={11} strokeWidth={1.6} color={VANTARY.ashSoft} />}
              </button>
            </div>
          )
        })}
      </div>

      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderTop: `1px solid ${VANTARY.rule}`, background: VANTARY.amberWash }}
      >
        <span
          className="font-mono uppercase"
          style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.amber, fontWeight: 500 }}
        >
          PINNED · {state.slotFavorites?.length ?? 0}
        </span>
        <span
          className="font-sans"
          style={{ fontSize: 11, color: VANTARY.paperDim, lineHeight: 1.5 }}
        >
          appear as quick-toggle chips in the header rail.
        </span>
      </div>
    </div>
  )
}

/* ─── 5.  LAYOUT TAB ─────────────────────────────────────────────── */

function LayoutTab() {
  const { state, actions } = useTradingDesk()

  return (
    <div className="flex flex-col">
      <SectionTitle>LAYOUT PRESETS</SectionTitle>
      <p
        className="font-sans px-4 py-2"
        style={{ fontSize: 11.5, color: VANTARY.paperDim, lineHeight: 1.5 }}
      >
        One-click layouts. Each preset writes the parts of state it cares
        about and leaves the rest alone.
      </p>

      <div className="flex flex-col">
        {TD_LAYOUT_PRESETS.map(preset => {
          // Detect "currently matches this preset" so we can show a checkmark.
          const matches = (() => {
            const a = preset.apply
            if (a.layout && a.layout !== state.layout) return false
            if (typeof a.tvWidthPct === "number" && Math.abs(a.tvWidthPct - state.tvWidthPct) > 0.01) return false
            if (a.sideSlotPosition && a.sideSlotPosition !== state.sideSlotPosition) return false
            if (typeof a.slotPeekEnabled === "boolean" && a.slotPeekEnabled !== state.slotPeekEnabled) return false
            // At least one field must be specified for a "match" to be meaningful.
            return Object.keys(a).length > 0
          })()

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => actions.applyPreset(preset.id)}
              className="flex items-center gap-3 px-4 py-3 w-full text-left"
              style={{
                background:   matches ? VANTARY.amberWash : "transparent",
                border:       "none",
                borderBottom: `1px dashed ${VANTARY.rule}`,
                cursor:       "pointer",
                transition:   "background 0.18s",
              }}
              onMouseEnter={e => {
                if (matches) return
                ;(e.currentTarget as HTMLElement).style.background = VANTARY.rule
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLElement).style.background = matches ? VANTARY.amberWash : "transparent"
              }}
            >
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width:        20,
                  height:       20,
                  borderRadius: 2,
                  border:       `1px solid ${matches ? VANTARY.amber : VANTARY.rule}`,
                  background:   matches ? VANTARY.amber : "transparent",
                }}
              >
                {matches && <Check size={12} strokeWidth={2.2} color={VANTARY.ink ?? VANTARY.paper} />}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize:      10,
                    letterSpacing: "0.22em",
                    color:         matches ? VANTARY.amber : VANTARY.paper,
                    fontWeight:    matches ? 500 : 400,
                  }}
                >
                  {preset.label}
                </span>
                <span
                  className="font-sans"
                  style={{
                    fontSize:   11,
                    color:      VANTARY.paperDim,
                    marginTop:  3,
                    lineHeight: 1.4,
                  }}
                >
                  {preset.description}
                </span>
              </div>
              <ChevronRight size={11} strokeWidth={1.6} color={VANTARY.ashSoft} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─── 6.  PEEK TAB ───────────────────────────────────────────────── */

function PeekTab() {
  const { state, actions } = useTradingDesk()
  const isOn = state.slotPeekEnabled

  return (
    <div className="flex flex-col">
      <SectionTitle>EDGE PEEK</SectionTitle>
      <p
        className="font-sans px-4 py-2"
        style={{ fontSize: 11.5, color: VANTARY.paperDim, lineHeight: 1.55 }}
      >
        When CHART mode is active and peek is ON, hovering near the chart&apos;s
        slot edge reveals a slim preview of the side panel. Click the
        pin icon inside the preview to lock it open (which switches the
        layout to SPLIT).
      </p>

      {/* Big toggle row */}
      <button
        type="button"
        onClick={() => actions.setPeekEnabled(!isOn)}
        className="flex items-center gap-3 mx-4 my-3 px-4 py-3"
        style={{
          background:   isOn ? VANTARY.amberWash : "transparent",
          border:       `1px solid ${isOn ? VANTARY.amberHalo : VANTARY.rule}`,
          borderRadius: 3,
          cursor:       "pointer",
          transition:   "all 0.18s",
        }}
      >
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width:        38,
            height:       22,
            borderRadius: 11,
            background:   isOn ? VANTARY.amber : VANTARY.rule,
            position:     "relative",
            transition:   "background 0.18s",
          }}
        >
          <span
            aria-hidden
            style={{
              position:     "absolute",
              top:          2,
              left:         isOn ? 18 : 2,
              width:        18,
              height:       18,
              borderRadius: "50%",
              background:   VANTARY.ink ?? VANTARY.paper,
              transition:   "left 0.18s ease",
            }}
          />
        </div>
        <div className="flex flex-col flex-1 min-w-0 text-left">
          <span
            className="font-mono uppercase"
            style={{ fontSize: 10.5, letterSpacing: "0.22em", color: isOn ? VANTARY.amber : VANTARY.paper, fontWeight: 500 }}
          >
            HOVER PEEK · {isOn ? "ON" : "OFF"}
          </span>
          <span
            className="font-sans"
            style={{ fontSize: 10.5, color: VANTARY.paperDim, marginTop: 2 }}
          >
            {isOn ? "Hover the chart edge to preview the side panel." : "Chart-only mode is purely chart."}
          </span>
        </div>
        {isOn
          ? <Eye    size={14} strokeWidth={1.6} color={VANTARY.amber} />
          : <EyeOff size={14} strokeWidth={1.6} color={VANTARY.ashSoft} />}
      </button>

      {/* Side position quick toggle */}
      <SectionTitle>SIDE POSITION</SectionTitle>
      <div className="flex items-center gap-2 px-4 py-3">
        {(["left", "right"] as const).map(pos => {
          const active = pos === state.sideSlotPosition
          return (
            <button
              key={pos}
              type="button"
              onClick={() => actions.setSideSlotPosition(pos)}
              className="font-mono uppercase flex-1"
              style={{
                padding:       "8px 12px",
                fontSize:      10,
                letterSpacing: "0.22em",
                color:         active ? VANTARY.amber : VANTARY.paperDim,
                background:    active ? VANTARY.amberWash : "transparent",
                border:        `1px solid ${active ? VANTARY.amberHalo : VANTARY.rule}`,
                borderRadius:  3,
                cursor:        "pointer",
                fontWeight:    active ? 500 : 400,
                transition:    "all 0.18s",
              }}
            >
              {pos === "left" ? "◀ LEFT" : "RIGHT ▶"}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─── 7.  POPOVER FOOTER ─────────────────────────────────────────── */

function PopoverFooter() {
  return (
    <footer
      className="flex items-center gap-2 px-4 py-2"
      style={{
        borderTop:  `1px solid ${VANTARY.rule}`,
        background: VANTARY.ink ?? VANTARY.paper,
        flexShrink: 0,
      }}
    >
      <span
        className="font-mono uppercase"
        style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
      >
        TRADING DESK
      </span>
      <span aria-hidden style={{ flex: 1, height: 1, background: VANTARY.rule, opacity: 0.6 }} />
      <span
        className="font-mono uppercase"
        style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
      >
        AUTO-SAVED
      </span>
    </footer>
  )
}

/* ─── 8.  HELPERS ────────────────────────────────────────────────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  const style: CSSProperties = {
    fontSize:      9.5,
    letterSpacing: "0.24em",
    color:         VANTARY.ashSoft,
    background:    VANTARY.rule,
    opacity:       0.7,
    padding:       "5px 14px",
  }
  return (
    <div className="font-mono uppercase" style={style}>
      {children}
    </div>
  )
}
