"use client"

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  FocusRailDropdown — header-mounted focus rail trigger
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Replaces the persistent 56px right-edge rail with its vertical
 *  "FOCUS RAIL · PIN ANYTHING" eyebrow text. That rail used to take up
 *  permanent screen real-estate even when nothing was pinned, which the
 *  user (correctly) called out as visual clutter.
 *
 *  This component renders a single 34×34 Pin button styled identically
 *  to the other UtilityButton circles in the VantaryHeader (Wifi /
 *  Headphones / Bell). Click it → an animated dropdown panel descends
 *  below it carrying:
 *
 *    • Eyebrow header "Focus Rail" + history count + close X
 *    • Currently-pinned item card (if any) with unpin button
 *    • Tip block explaining the pin pattern
 *    • Recent-pins history list (clickable to restore)
 *
 *  When something IS pinned, the trigger button lights up with an
 *  amber dot indicator and the SideDetailRail still renders its
 *  expanded card on the right edge — that piece is still useful as a
 *  persistent companion column when the trader has actively chosen to
 *  pin a card. The dropdown is the gateway; the rail is the sustained
 *  workspace. The collapsed/peek empty-state of the rail is gone.
 *
 *  Click outside or press Escape to close. Mirrors the bell-dropdown
 *  pattern in <VantaryHeader/>.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Pin, X, History } from "lucide-react"
import { VANTARY, RADIUS_V, EASE_V } from "./vantary-theme"
import {
  useSideRail,
  type SideRailCategory,
  type PinnedItem,
} from "./side-detail-rail"

/* ── category-rgb helper (mirrors side-detail-rail's table) ── */
const CATEGORY_RGB: Record<SideRailCategory, string> = {
  forex:       "6, 182, 212",
  indices:     "16, 185, 129",
  crypto:      "251, 146, 60",
  commodities: "16, 185, 129",
  macro:       "239, 68, 68",
  session:     "34, 197, 94",
  focus:       "6, 182, 212",
  alert:       "251, 146, 60",
  neutral:     "255, 255, 255",
}

const categoryRgb = (c?: SideRailCategory): string =>
  CATEGORY_RGB[c ?? "neutral"]

function formatAge(pinnedAt: number): string {
  const d = Date.now() - pinnedAt
  const m = Math.floor(d / 60_000)
  if (m < 1)  return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  Component
 * ══════════════════════════════════════════════════════════════════════════ */

export function FocusRailDropdown() {
  const { pinned, history, unpin, restoreFromHistory, clearHistory } = useSideRail()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  /* Close on outside click */
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    window.addEventListener("mousedown", onClick)
    return () => window.removeEventListener("mousedown", onClick)
  }, [open])

  /* Close on Escape */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const pinnedRgb = categoryRgb(pinned?.category)

  return (
    <div ref={wrapperRef} className="relative">
      {/* ─── Trigger — borderless, melts into header glass ──────────
       *
       * Matches the new <UtilityButton/> treatment in VantaryHeader:
       * 34×34, no border, transparent background by default.  Active
       * states (open dropdown OR something pinned) get a faint
       * chipFill so the trigger still reads as "engaged" without
       * needing a hard pill outline. */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={pinned ? `Focus rail · ${pinned.label} pinned` : "Focus rail"}
        className="relative flex items-center justify-center transition-all duration-300 hover:scale-105"
        style={{
          width:        34,
          height:       34,
          borderRadius: RADIUS_V.pill,
          background:   open || pinned ? VANTARY.chipFill : "transparent",
          border:       "none",
          cursor:       "pointer",
        }}
      >
        <Pin
          size={14}
          strokeWidth={1.5}
          style={{
            color:     open || pinned ? VANTARY.paper : VANTARY.ash,
            transform: pinned ? "rotate(-30deg)" : "rotate(0deg)",
            transition:"transform 280ms cubic-bezier(0.22,1,0.36,1)",
            fill:      pinned ? `rgba(${pinnedRgb}, 0.85)` : "none",
          }}
        />
        {/* Live indicator dot — top-right corner when pinned */}
        {pinned && (
          <span
            aria-hidden
            className="absolute rounded-full"
            style={{
              top:        2,
              right:      2,
              width:      6,
              height:     6,
              background: `rgb(${pinnedRgb})`,
              boxShadow:  `0 0 6px rgba(${pinnedRgb}, 0.7)`,
            }}
          />
        )}
        {/* History badge — bottom-right corner when no pin but history exists */}
        {!pinned && history.length > 0 && (
          <span
            aria-hidden
            className="absolute rounded-full font-mono flex items-center justify-center"
            style={{
              top:        -2,
              right:      -2,
              width:      14,
              height:     14,
              fontSize:   8,
              fontWeight: 600,
              color:      VANTARY.paperDim,
              background: VANTARY.chipFillHi,
              border:     `1px solid ${VANTARY.ink}`,
            }}
          >
            {history.length}
          </span>
        )}
      </button>

      {/* ─── Panel ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="focus-rail-panel"
            role="dialog"
            aria-label="Focus rail"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{    opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: EASE_V }}
            className="absolute z-50"
            style={{
              top:           "calc(100% + 8px)",
              right:         0,
              width:         320,
              borderRadius:  12,
              background:    "rgba(10,11,14,0.92)",
              backdropFilter:"blur(28px) saturate(180%)",
              WebkitBackdropFilter: "blur(28px) saturate(180%)",
              border:        `1px solid ${VANTARY.rule}`,
              boxShadow:     "0 24px 60px -20px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.04)",
              overflow:      "hidden",
            }}
          >
            {/* ── HEADER ────────────────────────────────────────── */}
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: `1px solid ${VANTARY.rule}` }}
            >
              <div className="flex items-center gap-2">
                <Pin size={11} strokeWidth={1.6} style={{ color: VANTARY.amberHalo }} />
                <span
                  className="font-mono uppercase"
                  style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
                >
                  Focus Rail
                </span>
                {history.length > 0 && (
                  <span
                    className="font-mono tabular-nums rounded"
                    style={{
                      fontSize:      9,
                      letterSpacing: "0.1em",
                      color:         VANTARY.ash,
                      padding:       "1px 5px",
                      background:    VANTARY.chipFill,
                      border:        `1px solid ${VANTARY.chipBorder}`,
                    }}
                  >
                    {history.length}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close focus rail"
                className="flex items-center justify-center rounded transition-colors"
                style={{
                  width:  20,
                  height: 20,
                  color:  VANTARY.ashSoft,
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLElement).style.color = VANTARY.paper
                  ;(e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLElement).style.color = VANTARY.ashSoft
                  ;(e.currentTarget as HTMLElement).style.background = "transparent"
                }}
              >
                <X size={12} strokeWidth={1.6} />
              </button>
            </div>

            {/* ── BODY ──────────────────────────────────────────── */}
            <div className="px-4 py-3 flex flex-col gap-3" style={{ maxHeight: 420, overflowY: "auto" }}>
              {/* Currently-pinned card */}
              {pinned ? (
                <PinnedCard item={pinned} onUnpin={unpin} />
              ) : (
                <EmptyHint />
              )}

              {/* History list */}
              {history.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between mt-1">
                    <span
                      className="font-mono uppercase flex items-center gap-1.5"
                      style={{ fontSize: 9, letterSpacing: "0.20em", color: VANTARY.ashSoft }}
                    >
                      <History size={10} strokeWidth={1.6} />
                      Recent
                    </span>
                    <button
                      type="button"
                      onClick={clearHistory}
                      className="font-mono uppercase transition-colors"
                      style={{
                        fontSize:      8.5,
                        letterSpacing: "0.18em",
                        color:         VANTARY.ash,
                        background:    "transparent",
                        border:        "none",
                        cursor:        "pointer",
                        padding:       "2px 4px",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = VANTARY.paper }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = VANTARY.ash }}
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-col gap-1">
                    {history.map(h => (
                      <HistoryChip
                        key={h.id}
                        item={h}
                        onClick={() => {
                          restoreFromHistory(h.id)
                          setOpen(false)
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  Sub-components
 * ══════════════════════════════════════════════════════════════════════════ */

function PinnedCard({ item, onUnpin }: { item: PinnedItem; onUnpin: () => void }) {
  const rgb = categoryRgb(item.category)
  return (
    <div
      className="flex items-center gap-2.5 p-2.5 rounded-lg"
      style={{
        background: `rgba(${rgb}, 0.06)`,
        border:     `1px solid rgba(${rgb}, 0.18)`,
      }}
    >
      <span
        aria-hidden
        className="rounded-full flex-shrink-0"
        style={{
          width:      6,
          height:     6,
          background: `rgb(${rgb})`,
          boxShadow:  `0 0 6px rgba(${rgb}, 0.6)`,
        }}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <span
          className="font-mono uppercase"
          style={{ fontSize: 8.5, letterSpacing: "0.20em", color: VANTARY.ashSoft }}
        >
          Pinned · {formatAge(item.pinnedAt)}
        </span>
        <span
          className="font-sans truncate"
          style={{ fontSize: 12, fontWeight: 500, color: VANTARY.paper }}
          title={item.label}
        >
          {item.label}
        </span>
      </div>
      <button
        type="button"
        onClick={onUnpin}
        aria-label={`Unpin ${item.label}`}
        className="flex items-center justify-center rounded transition-colors flex-shrink-0"
        style={{
          width:  22,
          height: 22,
          color:  VANTARY.ashSoft,
          cursor: "pointer",
          background: "transparent",
          border: "none",
        }}
        onMouseEnter={e => {
          ;(e.currentTarget as HTMLElement).style.color = VANTARY.paper
          ;(e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"
        }}
        onMouseLeave={e => {
          ;(e.currentTarget as HTMLElement).style.color = VANTARY.ashSoft
          ;(e.currentTarget as HTMLElement).style.background = "transparent"
        }}
      >
        <X size={11} strokeWidth={1.7} />
      </button>
    </div>
  )
}

function EmptyHint() {
  return (
    <div
      className="p-3 rounded-lg"
      style={{
        background: "rgba(255,255,255,0.025)",
        border:     "1px dashed rgba(255,255,255,0.06)",
      }}
    >
      <p style={{ fontSize: 11.5, lineHeight: 1.55, color: VANTARY.paperDim, margin: 0 }}>
        Click a{" "}
        <strong style={{ color: VANTARY.paper, fontWeight: 600 }}>pin icon</strong>
        {" "}on any card to drop it into the focus rail.
      </p>
      <div
        className="mt-2 pt-2 flex items-center gap-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <kbd
          style={{
            padding:      "1px 5px",
            fontSize:     9,
            background:   "rgba(255,255,255,0.05)",
            border:       "1px solid rgba(255,255,255,0.08)",
            borderRadius: 3,
            color:        VANTARY.paperDim,
            fontFamily:   "monospace",
          }}
        >
          Esc
        </kbd>
        <span style={{ fontSize: 10, color: VANTARY.ash }}>
          to close · pin persists across sessions
        </span>
      </div>
    </div>
  )
}

function HistoryChip({ item, onClick }: { item: PinnedItem; onClick: () => void }) {
  const rgb = categoryRgb(item.category)
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md transition-all"
      style={{
        background: "rgba(255,255,255,0.025)",
        border:     "1px solid rgba(255,255,255,0.05)",
        cursor:     "pointer",
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.background  = "rgba(255,255,255,0.05)"
        ;(e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.10)"
        ;(e.currentTarget as HTMLElement).style.transform   = "translateY(-1px)"
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.background  = "rgba(255,255,255,0.025)"
        ;(e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.05)"
        ;(e.currentTarget as HTMLElement).style.transform   = "translateY(0px)"
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          aria-hidden
          className="rounded-full flex-shrink-0"
          style={{ width: 5, height: 5, background: `rgba(${rgb}, 0.85)` }}
        />
        <span
          className="truncate"
          style={{ fontSize: 11.5, color: VANTARY.paperDim, fontWeight: 500 }}
        >
          {item.label}
        </span>
      </div>
      <span
        className="font-mono tabular-nums flex-shrink-0"
        style={{ fontSize: 9, color: VANTARY.ash, letterSpacing: "0.05em" }}
      >
        {formatAge(item.pinnedAt)}
      </span>
    </button>
  )
}
