"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · FLIGHT DECK · TEMPLATE PICKER
   ───────────────────────────────────────────────────────────────────────────
   A small chip lives in the cartouche header rail. Click → popover with a
   2-column grid of 6 template cards. Each card shows:

     · Top:    template name + persona descriptor
     · Middle: mini wing diagram (two tiny 3-col × 2-row grids side by side,
               each cell labeled with the gadget's 2-letter abbreviation)
     · Bottom: rationale line · "Best for ..."
     · Active card: accent border + glow + ACTIVE chip

   Click a card → atomically swap the cartouche to that template's snapshot
   (default OR user-customised), persist the active id, close the popover.

   Footer: [Reset This Template's Defaults] action wipes the current
   template's snapshot so the next activation reads factory defaults.
   ═══════════════════════════════════════════════════════════════════════════ */

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, LayoutGrid, RotateCcw, X } from "lucide-react"
import { rgba as vgRgba, VT as VG_VT, type ThemeAccent } from "@/components/vantary-glass"
import {
  GADGET_ABBREVIATIONS,
  GADGET_LABELS,
  flattenWingSlots,
  isShippingGadget,
  type FlightDeckTemplate,
  type GadgetId,
  type GadgetSize,
  type TemplateWing,
} from "@/lib/cartouche/flight-deck-templates"
import {
  defaultSnapshotFromTemplate,
  resolveSnapshot,
  type UseActiveTemplateApi,
  type WingSnapshot,
} from "@/lib/cartouche/use-active-template"

const EASE_V = [0.22, 1, 0.36, 1] as const

/* ────────────────────────────────────────────────────────────────────────
   Public component — trigger + popover bundled
   ──────────────────────────────────────────────────────────────────────── */
export interface TemplatePickerProps {
  /** The active-template hook api (provided by the cartouche so both stay in sync). */
  activeTemplateApi: UseActiveTemplateApi
  /** Accent for chip + popover hairlines. */
  accent: ThemeAccent
  /** Called whenever the user selects a template. The parent applies the
   *  returned snapshot to the wing configuration (via `loadGadgets`). */
  onActivate: (snapshot: WingSnapshot) => void
  /** Optional: a setScrollLocked callback (from FlightDeckReveal) so the
   *  popover can disable the global wheel-conceal while it's open — the
   *  same way GadgetSwapPopover works. */
  setScrollLocked?: (locked: boolean) => void
}

export function TemplatePicker({
  activeTemplateApi, accent, onActivate, setScrollLocked,
}: TemplatePickerProps) {
  const { activeId, template, templates, setActive, resetSnapshot } = activeTemplateApi
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  /* Lock global wheel-conceal while open, restore on close. */
  useEffect(() => {
    if (!setScrollLocked) return
    setScrollLocked(open)
    return () => setScrollLocked(false)
  }, [open, setScrollLocked])

  /* Close on Escape (in addition to the explicit close button). */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  /* Click-outside dismissal. */
  const popoverRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      const node = popoverRef.current
      const trig = triggerRef.current
      if (!node) return
      const tgt = e.target as Node
      if (node.contains(tgt) || trig?.contains(tgt)) return
      setOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [open])

  const handleActivate = useCallback((id: string) => {
    const snapshot = setActive(id)
    onActivate(snapshot)
    setOpen(false)
    triggerRef.current?.focus()
  }, [setActive, onActivate])

  const handleReset = useCallback(() => {
    resetSnapshot()
    /* Re-apply the factory defaults for the now-cleaned template. */
    onActivate(defaultSnapshotFromTemplate(template))
  }, [resetSnapshot, onActivate, template])

  return (
    <div style={{ position: "relative" }}>
      <TemplatePickerTrigger
        ref={triggerRef}
        accent={accent}
        templateName={template.name}
        open={open}
        onToggle={() => setOpen((v) => !v)}
      />

      <AnimatePresence>
        {open && (
          <TemplatePickerPopover
            ref={popoverRef}
            accent={accent}
            templates={templates}
            activeId={activeId}
            onActivate={handleActivate}
            onClose={() => setOpen(false)}
            onResetActive={handleReset}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   TemplatePickerTrigger — the small chip
   ──────────────────────────────────────────────────────────────────────── */
interface TriggerProps {
  accent:       ThemeAccent
  templateName: string
  open:         boolean
  onToggle:     () => void
}

const TemplatePickerTrigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  function TemplatePickerTrigger({ accent, templateName, open, onToggle }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Switch loadout (current: ${templateName})`}
        onClick={onToggle}
        className="inline-flex items-center font-mono uppercase"
        style={{
          height: 22,
          padding: "0 8px 0 7px",
          gap: 6,
          background: vgRgba(accent.rgb, open ? 0.14 : 0.07),
          border: `1px solid ${vgRgba(accent.rgb, open ? 0.48 : 0.22)}`,
          borderRadius: 999,
          color: accent.hex,
          fontSize: 9,
          letterSpacing: "0.22em",
          cursor: "pointer",
          boxShadow: open ? `0 0 12px ${vgRgba(accent.rgb, 0.32)}` : "none",
          transition: "border-color 200ms, background 200ms, box-shadow 200ms",
        }}
      >
        <LayoutGrid size={10} strokeWidth={1.8} />
        <span style={{ opacity: 0.65 }}>Loadout</span>
        <span style={{ opacity: 0.30 }}>·</span>
        <span style={{ color: VG_VT.paper, letterSpacing: "0.16em" }}>
          {templateName}
        </span>
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22, ease: EASE_V }}
          style={{ display: "inline-flex", alignItems: "center", color: accent.hex, opacity: 0.7 }}
        >
          <ChevronDown size={10} strokeWidth={2} />
        </motion.span>
      </button>
    )
  },
)

/* ────────────────────────────────────────────────────────────────────────
   TemplatePickerPopover — the 2x3 grid of template cards
   ──────────────────────────────────────────────────────────────────────── */
interface PopoverProps {
  accent:         ThemeAccent
  templates:      readonly FlightDeckTemplate[]
  activeId:       string
  onActivate:     (id: string) => void
  onClose:        () => void
  onResetActive:  () => void
}

const TemplatePickerPopover = React.forwardRef<HTMLDivElement, PopoverProps>(
  function TemplatePickerPopover(
    { accent, templates, activeId, onActivate, onClose, onResetActive }, ref,
  ) {
    const labelId = useId()
    return (
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal={false}
        aria-labelledby={labelId}
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y:  0, scale: 1     }}
        exit   ={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.22, ease: EASE_V }}
        style={{
          position: "absolute",
          top: "calc(100% + 10px)",
          right: 0,
          zIndex: 60,
          width: "min(720px, 90vw)",
          maxHeight: 520,
          overflowY: "auto",
          padding: 16,
          background: "rgba(8, 12, 16, 0.96)",
          backdropFilter: "blur(14px)",
          border: `1px solid ${vgRgba(accent.rgb, 0.28)}`,
          borderRadius: 12,
          boxShadow: `0 12px 36px rgba(0,0,0,0.55), 0 0 24px ${vgRgba(accent.rgb, 0.18)}`,
          overscrollBehavior: "contain",
        }}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${vgRgba(accent.rgb, 0.16)}` }}
        >
          <div className="flex flex-col gap-0.5">
            <h3
              id={labelId}
              className="font-sans"
              style={{ fontSize: 13.5, letterSpacing: "-0.01em", color: VG_VT.paper, margin: 0, fontWeight: 500 }}
            >
              Choose a loadout
            </h3>
            <p
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: "0.22em", color: VG_VT.paperDim, margin: 0 }}
            >
              Persona-tuned cartouche templates
            </p>
          </div>
          <button
            type="button"
            aria-label="Close picker"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full"
            style={{
              width: 22, height: 22,
              border: `1px solid ${vgRgba(accent.rgb, 0.20)}`,
              background: "transparent",
              color: VG_VT.paperDim,
              cursor: "pointer",
            }}
          >
            <X size={11} strokeWidth={1.8} />
          </button>
        </div>

        {/* ── 2-col card grid ───────────────────────────────────────── */}
        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}
        >
          {templates.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              accent={accent}
              active={t.id === activeId}
              onActivate={() => onActivate(t.id)}
            />
          ))}
        </div>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between"
          style={{ marginTop: 14, paddingTop: 10, borderTop: `1px solid ${vgRgba(accent.rgb, 0.14)}` }}
        >
          <p
            className="font-mono uppercase"
            style={{ fontSize: 8.5, letterSpacing: "0.22em", color: VG_VT.paperDim, margin: 0 }}
          >
            Per-slot swaps stay scoped to the active loadout
          </p>
          <button
            type="button"
            onClick={onResetActive}
            className="inline-flex items-center gap-1.5 font-mono uppercase rounded-full"
            style={{
              height: 22,
              padding: "0 9px",
              fontSize: 8.5,
              letterSpacing: "0.22em",
              color: VG_VT.paperDim,
              background: "transparent",
              border: `1px solid ${vgRgba(accent.rgb, 0.20)}`,
              cursor: "pointer",
            }}
            title="Wipe customisations for the active loadout"
          >
            <RotateCcw size={9} strokeWidth={1.8} />
            Reset Defaults
          </button>
        </div>
      </motion.div>
    )
  },
)

/* ────────────────────────────────────────────────────────────────────────
   TemplateCard — single card with mini wing diagram
   ──────────────────────────────────────────────────────────────────────── */
function TemplateCard({
  template, accent, active, onActivate,
}: {
  template:   FlightDeckTemplate
  accent:     ThemeAccent
  active:     boolean
  onActivate: () => void
}) {
  const [hover, setHover] = useState(false)
  const snapshot = useMemo(() => resolveSnapshot(template), [template])
  return (
    <motion.button
      type="button"
      onClick={onActivate}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.18, ease: EASE_V }}
      className="relative text-left flex flex-col"
      style={{
        padding: "12px 12px 11px",
        gap: 10,
        background: active
          ? vgRgba(accent.rgb, 0.08)
          : hover ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.015)",
        border: `1px solid ${active ? vgRgba(accent.rgb, 0.55) : vgRgba(accent.rgb, hover ? 0.30 : 0.16)}`,
        borderRadius: 10,
        boxShadow: active
          ? `0 0 18px ${vgRgba(accent.rgb, 0.28)}, inset 0 0 14px ${vgRgba(accent.rgb, 0.06)}`
          : hover
            ? `0 0 10px ${vgRgba(accent.rgb, 0.18)}`
            : "none",
        cursor: "pointer",
        transition: "background 200ms, border-color 200ms, box-shadow 200ms",
      }}
    >
      {/* ── Active chip ─────────────────────────────────────────────── */}
      {active && (
        <div
          className="font-mono uppercase"
          style={{
            position: "absolute",
            top: 8,
            right: 10,
            fontSize: 8,
            letterSpacing: "0.24em",
            color: accent.hex,
            background: vgRgba(accent.rgb, 0.14),
            border: `1px solid ${vgRgba(accent.rgb, 0.42)}`,
            padding: "1px 6px",
            borderRadius: 3,
          }}
        >
          Active
        </div>
      )}

      {/* ── Header: name + persona ──────────────────────────────────── */}
      <div className="flex flex-col" style={{ gap: 1, paddingRight: active ? 52 : 0 }}>
        <span
          className="font-sans"
          style={{ fontSize: 13.5, color: VG_VT.paper, fontWeight: 500, letterSpacing: "-0.01em" }}
        >
          {template.name}
        </span>
        <span
          className="font-mono uppercase"
          style={{ fontSize: 8.5, letterSpacing: "0.22em", color: VG_VT.paperDim }}
        >
          {template.persona}
        </span>
      </div>

      {/* ── Mini wing diagram ───────────────────────────────────────── */}
      <MiniCartouche template={template} accent={accent} snapshot={snapshot} />

      {/* ── Rationale ───────────────────────────────────────────────── */}
      <p
        className="font-sans"
        style={{
          fontSize: 11,
          color: VG_VT.paperDim,
          margin: 0,
          lineHeight: 1.45,
          letterSpacing: "-0.005em",
        }}
      >
        {template.rationale}
      </p>
    </motion.button>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   MiniCartouche — two tiny 3×2 grids side by side, with a center spacer
   that suggests the cartouche headline. Cells labeled with 2-letter
   abbreviations, sized to scale (s=1col, m=2col, l=3col).
   ──────────────────────────────────────────────────────────────────────── */
function MiniCartouche({
  template, accent, snapshot,
}: {
  template: FlightDeckTemplate
  accent:   ThemeAccent
  snapshot: WingSnapshot
}) {
  return (
    <div
      aria-hidden
      className="grid items-center"
      style={{
        gridTemplateColumns: "1fr 18px 1fr",
        gap: 0,
        padding: "8px 4px",
        background: "rgba(255,255,255,0.015)",
        border: `1px solid ${vgRgba(accent.rgb, 0.14)}`,
        borderRadius: 6,
      }}
    >
      <MiniWing wing={template.left}  accent={accent} snapshotIds={snapshot.left}  alignment="left" />
      {/* Center seam */}
      <div
        style={{
          height: 36,
          width: 1,
          margin: "0 auto",
          background: `linear-gradient(180deg, transparent 0%, ${vgRgba(accent.rgb, 0.32)} 50%, transparent 100%)`,
        }}
      />
      <MiniWing wing={template.right} accent={accent} snapshotIds={snapshot.right} alignment="right" />
    </div>
  )
}

function MiniWing({
  wing, accent, snapshotIds, alignment,
}: {
  wing:        TemplateWing
  accent:      ThemeAccent
  snapshotIds: readonly string[]
  alignment:   "left" | "right"
}) {
  /* If the user has captured an arrangement (snapshot differs from the
     template default), the mini diagram should reflect their arrangement
     using the row geometry from the template (which never changes). */
  const defaultIds = flattenWingSlots(wing).map((s) => s.id)
  const usingSnapshot = snapshotIds.length === defaultIds.length &&
    snapshotIds.some((id, i) => id !== defaultIds[i])

  const labels: string[] = (usingSnapshot ? snapshotIds : defaultIds).slice()
  /* Re-pack into row buckets using the template's row geometry. */
  let cursor = 0
  const rows: { size: GadgetSize; id: string }[][] = [
    wing.top.slots.map((slot) => ({ size: slot.size, id: labels[cursor++] ?? slot.id })),
    wing.bottom.slots.map((slot) => ({ size: slot.size, id: labels[cursor++] ?? slot.id })),
  ]

  return (
    <div
      className="grid"
      style={{
        gridTemplateRows: "repeat(2, 16px)",
        gap: 3,
        padding: "0 3px",
        direction: alignment === "left" ? "rtl" : "ltr",
      }}
    >
      {rows.map((row, rIdx) => (
        <div
          key={rIdx}
          className="grid"
          style={{
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 3,
            direction: "ltr",
          }}
        >
          {row.map((cell, cIdx) => {
            const cols = cell.size === "l" ? 3 : cell.size === "m" ? 2 : 1
            const id = cell.id as GadgetId
            const abbr = GADGET_ABBREVIATIONS[id] ?? "?"
            const shipping = isShippingGadget(id)
            const fullLabel = GADGET_LABELS[id] ?? id
            return (
              <div
                key={cIdx}
                title={`${fullLabel}${shipping ? "" : " · coming soon"}`}
                className="font-mono uppercase tabular-nums flex items-center justify-center"
                style={{
                  gridColumn: `span ${cols} / span ${cols}`,
                  height: 16,
                  fontSize: 8,
                  letterSpacing: "0.10em",
                  color: shipping ? VG_VT.paper : VG_VT.paperDim,
                  background: shipping
                    ? vgRgba(accent.rgb, 0.16)
                    : `repeating-linear-gradient(135deg, ${vgRgba(accent.rgb, 0.06)} 0 4px, transparent 4px 8px)`,
                  border: `1px solid ${shipping ? vgRgba(accent.rgb, 0.32) : vgRgba(accent.rgb, 0.18)}`,
                  borderRadius: 3,
                  opacity: shipping ? 1 : 0.62,
                }}
              >
                {abbr}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
