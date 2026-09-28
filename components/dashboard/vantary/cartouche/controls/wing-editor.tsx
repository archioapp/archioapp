"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · FLIGHT DECK · CONTROLS — wing editor, gadget library, symmetry
   ───────────────────────────────────────────────────────────────────────────
   The interactive editing surfaces shown inside Controls Mode tabs:
     · WingEditorPanel  — reorder / remove / cross-send gadgets on one wing
     · GadgetLibraryPanel — searchable catalog grouped by category; adds to a wing
     · SymmetryMeter    — left/right balance read-out + nudge
   All bridge to the REAL wings via onHighlight (hover) so the cockpit lights
   the affected slot before any commit. Colour from accent.rgb only.
   ═══════════════════════════════════════════════════════════════════════════ */

import { memo, useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowLeftRight, ChevronUp, ChevronDown, X, Plus, Search, Scale } from "lucide-react"

import { VT, rgba } from "@/components/vantary-glass"
import type { ThemeAccent } from "@/components/vantary-glass"
import { ControlsGlass } from "./loadout-revolver"
import type { ControlsGadgetEntry, WingSide } from "./types"

const SIZE_LABEL: Record<"s" | "m" | "l", string> = { s: "SMALL", m: "MEDIUM", l: "LARGE" }
const SIZE_COLS: Record<"s" | "m" | "l", number> = { s: 1, m: 2, l: 3 }

/* ───────────────────────────────────────────────────────────────────────────
   WingEditorPanel
   ─────────────────────────────────────────────────────────────────────────── */
export const WingEditorPanel = memo(function WingEditorPanel({
  accent,
  side,
  ids,
  entryOf,
  capacityUsed,
  onRemove,
  onReorder,
  onSendToOther,
  onHighlight,
}: {
  accent: ThemeAccent
  side: WingSide
  ids: readonly string[]
  entryOf: (id: string) => ControlsGadgetEntry | undefined
  capacityUsed: number
  onRemove: (index: number) => void
  onReorder: (index: number, dir: -1 | 1) => void
  onSendToOther: (index: number) => void
  onHighlight: (index: number | null) => void
}) {
  return (
    <div className="flex flex-col" style={{ gap: 10 }}>
      <div className="flex items-center justify-between">
        <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.18em", color: VT.ashSoft }}>
          {side === "left" ? "LEFT WING" : "RIGHT WING"}
        </span>
        <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.12em", color: rgba(accent.rgb, 0.85) }}>
          {capacityUsed} / 6 COLS
        </span>
      </div>

      {ids.length === 0 && (
        <div
          className="flex items-center justify-center font-mono uppercase"
          style={{
            fontSize: 9, letterSpacing: "0.14em", color: VT.ashSoft,
            padding: "18px 0", borderRadius: 10, border: `1px dashed ${rgba(accent.rgb, 0.22)}`,
          }}
        >
          EMPTY WING · ADD FROM LIBRARY
        </div>
      )}

      <div className="flex flex-col" style={{ gap: 6 }}>
        <AnimatePresence initial={false}>
          {ids.map((id, i) => {
            const entry = entryOf(id)
            return (
              <motion.div
                key={`${id}-${i}`}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: side === "left" ? -12 : 12 }}
                transition={{ duration: 0.18 }}
                onMouseEnter={() => onHighlight(i)}
                onMouseLeave={() => onHighlight(null)}
              >
                <ControlsGlass accent={accent} radius={10}>
                  <div className="flex items-center" style={{ gap: 8, padding: "8px 10px" }}>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: 8, letterSpacing: "0.1em", color: accent.hex,
                        width: 18, textAlign: "center", flexShrink: 0,
                      }}
                    >
                      {SIZE_LABEL[entry?.size ?? "s"][0]}
                    </span>
                    <div className="flex flex-col" style={{ minWidth: 0, flex: 1 }}>
                      <span className="font-sans truncate" style={{ fontSize: 12, fontWeight: 500, color: VT.paper }}>
                        {entry?.label ?? id}
                      </span>
                      <span className="font-mono uppercase truncate" style={{ fontSize: 7.5, letterSpacing: "0.12em", color: VT.ashSoft }}>
                        {entry?.category ?? "GADGET"} · {SIZE_LABEL[entry?.size ?? "s"]}
                      </span>
                    </div>
                    <div className="flex items-center" style={{ gap: 2, flexShrink: 0 }}>
                      <IconBtn accent={accent} label="Move up" disabled={i === 0} onClick={() => onReorder(i, -1)}><ChevronUp size={13} /></IconBtn>
                      <IconBtn accent={accent} label="Move down" disabled={i === ids.length - 1} onClick={() => onReorder(i, 1)}><ChevronDown size={13} /></IconBtn>
                      <IconBtn accent={accent} label={`Send to ${side === "left" ? "right" : "left"} wing`} onClick={() => onSendToOther(i)}><ArrowLeftRight size={12} /></IconBtn>
                      <IconBtn accent={accent} label="Remove" danger onClick={() => onRemove(i)}><X size={12} /></IconBtn>
                    </div>
                  </div>
                </ControlsGlass>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
})

function IconBtn({
  accent, children, label, onClick, disabled, danger,
}: {
  accent: ThemeAccent
  children: React.ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
  danger?: boolean
}) {
  const reduce = useReducedMotion()
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled || reduce ? undefined : { scale: 1.12 }}
      whileTap={disabled || reduce ? undefined : { scale: 0.92 }}
      className="inline-flex items-center justify-center"
      style={{
        width: 24, height: 24, borderRadius: 7,
        border: `1px solid ${rgba(danger ? "239,68,68" : accent.rgb, disabled ? 0.08 : 0.24)}`,
        background: rgba(danger ? "239,68,68" : accent.rgb, disabled ? 0.02 : 0.06),
        color: disabled ? VT.ashSoft : danger ? "rgb(248,113,113)" : accent.hex,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
    </motion.button>
  )
}

/* ───────────────────────────────────────────────────────────────────────────
   GadgetLibraryPanel
   ─────────────────────────────────────────────────────────────────────────── */
export const GadgetLibraryPanel = memo(function GadgetLibraryPanel({
  accent,
  catalog,
  categoryOrder,
  canFit,
  onAdd,
}: {
  accent: ThemeAccent
  catalog: readonly ControlsGadgetEntry[]
  categoryOrder: readonly string[]
  canFit: (side: WingSide, size: "s" | "m" | "l") => boolean
  onAdd: (side: WingSide, gadgetId: string) => void
}) {
  const [query, setQuery] = useState("")

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase()
    const match = catalog.filter(
      (g) => !q || g.label.toLowerCase().includes(q) || g.category.toLowerCase().includes(q) || (g.blurb ?? "").toLowerCase().includes(q),
    )
    const byCat = new Map<string, ControlsGadgetEntry[]>()
    for (const g of match) {
      const arr = byCat.get(g.category) ?? []
      arr.push(g)
      byCat.set(g.category, arr)
    }
    const cats = [...byCat.keys()].sort(
      (a, b) => (categoryOrder.indexOf(a) + 1 || 999) - (categoryOrder.indexOf(b) + 1 || 999),
    )
    return cats.map((c) => ({ category: c, items: byCat.get(c)! }))
  }, [catalog, categoryOrder, query])

  return (
    <div className="flex flex-col" style={{ gap: 12, height: "100%" }}>
      {/* search */}
      <div
        className="flex items-center"
        style={{
          gap: 8, padding: "8px 11px", borderRadius: 10,
          border: `1px solid ${rgba(accent.rgb, 0.2)}`, background: rgba(accent.rgb, 0.04),
        }}
      >
        <Search size={13} color={VT.ashSoft} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search gadgets…"
          aria-label="Search gadgets"
          className="font-sans bg-transparent outline-none w-full"
          style={{ fontSize: 12, color: VT.paper }}
        />
        {query && (
          <button type="button" aria-label="Clear search" onClick={() => setQuery("")} style={{ color: VT.ashSoft }}>
            <X size={12} />
          </button>
        )}
      </div>

      <div className="flex flex-col" style={{ gap: 14, overflowY: "auto", paddingRight: 2 }}>
        {grouped.length === 0 && (
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.14em", color: VT.ashSoft, padding: "12px 0" }}>
            NO GADGETS MATCH
          </span>
        )}
        {grouped.map(({ category, items }) => (
          <div key={category} className="flex flex-col" style={{ gap: 7 }}>
            <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.18em", color: VT.ashSoft }}>
              {category}
            </span>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 7 }}>
              {items.map((g) => (
                <LibraryGadgetCard key={g.id} accent={accent} entry={g} canFit={canFit} onAdd={onAdd} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

const LibraryGadgetCard = memo(function LibraryGadgetCard({
  accent, entry, canFit, onAdd,
}: {
  accent: ThemeAccent
  entry: ControlsGadgetEntry
  canFit: (side: WingSide, size: "s" | "m" | "l") => boolean
  onAdd: (side: WingSide, gadgetId: string) => void
}) {
  const leftOk = canFit("left", entry.size)
  const rightOk = canFit("right", entry.size)
  return (
    <ControlsGlass accent={accent} radius={10} sheen>
      <div className="flex flex-col" style={{ gap: 7, padding: 10, height: "100%" }}>
        <div className="flex items-center justify-between" style={{ gap: 6 }}>
          <span className="font-sans truncate" style={{ fontSize: 12, fontWeight: 500, color: VT.paper }}>{entry.label}</span>
          <span
            className="font-mono uppercase"
            style={{ fontSize: 7, letterSpacing: "0.1em", color: rgba(accent.rgb, 0.85), flexShrink: 0,
              border: `1px solid ${rgba(accent.rgb, 0.26)}`, borderRadius: 5, padding: "1px 4px" }}
          >
            {Array.from({ length: SIZE_COLS[entry.size] }).map(() => "▮").join("")}
          </span>
        </div>
        {entry.blurb && (
          <p className="font-sans" style={{ fontSize: 9.5, lineHeight: 1.4, color: VT.ash, margin: 0,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {entry.blurb}
          </p>
        )}
        <span style={{ flex: 1 }} />
        <div className="flex items-center" style={{ gap: 5 }}>
          <AddBtn accent={accent} label="L" disabled={!leftOk} onClick={() => onAdd("left", entry.id)} />
          <AddBtn accent={accent} label="R" disabled={!rightOk} onClick={() => onAdd("right", entry.id)} />
        </div>
      </div>
    </ControlsGlass>
  )
})

function AddBtn({ accent, label, disabled, onClick }: { accent: ThemeAccent; label: string; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={`Add to ${label === "L" ? "left" : "right"} wing`}
      className="inline-flex items-center justify-center font-mono uppercase"
      style={{
        flex: 1, gap: 4, height: 24, borderRadius: 7, fontSize: 8, letterSpacing: "0.12em",
        border: `1px solid ${rgba(accent.rgb, disabled ? 0.08 : 0.28)}`,
        background: rgba(accent.rgb, disabled ? 0.02 : 0.07),
        color: disabled ? VT.ashSoft : accent.hex,
        cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.4 : 1,
      }}
    >
      <Plus size={10} /> {label}
    </button>
  )
}

/* ───────────────────────────────────────────────────────────────────────────
   SymmetryMeter — a balance read-out between the two wings.
   ─────────────────────────────────────────────────────────────────────────── */
export const SymmetryMeter = memo(function SymmetryMeter({
  accent, leftCols, rightCols,
}: {
  accent: ThemeAccent
  leftCols: number
  rightCols: number
}) {
  const reduce = useReducedMotion()
  const total = Math.max(1, leftCols + rightCols)
  const leftPct = (leftCols / total) * 100
  const balanced = Math.abs(leftCols - rightCols) <= 1
  const verdict = leftCols === rightCols ? "PERFECTLY BALANCED" : balanced ? "WELL BALANCED" : leftCols > rightCols ? "LEFT-HEAVY" : "RIGHT-HEAVY"
  const verdictColor = balanced ? accent.hex : "rgb(245,158,11)"

  return (
    <div className="flex flex-col" style={{ gap: 12 }}>
      <div className="flex items-center" style={{ gap: 8 }}>
        <Scale size={14} color={accent.hex} />
        <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.18em", color: VT.ashSoft }}>WING SYMMETRY</span>
      </div>

      <div className="flex items-center justify-between font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.12em", color: VT.ashSoft }}>
        <span>LEFT · {leftCols} COLS</span>
        <span style={{ color: verdictColor }}>{verdict}</span>
        <span>RIGHT · {rightCols} COLS</span>
      </div>

      {/* balance bar */}
      <div style={{ position: "relative", height: 10, borderRadius: 999, background: rgba(accent.rgb, 0.08), overflow: "hidden" }}>
        <motion.span
          aria-hidden
          initial={false}
          animate={{ width: `${leftPct}%` }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 28 }}
          style={{ position: "absolute", left: 0, top: 0, bottom: 0, background: rgba(accent.rgb, 0.4) }}
        />
        {/* center marker */}
        <span aria-hidden style={{ position: "absolute", left: "50%", top: -2, bottom: -2, width: 1.5, background: rgba(accent.rgb, 0.6), transform: "translateX(-50%)" }} />
      </div>
    </div>
  )
})
