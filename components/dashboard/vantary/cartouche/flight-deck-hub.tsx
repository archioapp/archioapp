"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · FLIGHT DECK · UNIFIED HUB CHIP
   ───────────────────────────────────────────────────────────────────────────
   PROBLEM STATEMENT (user · 12 May 2026)
     "the loadout menu and all should be in the menu when we hit the plus
      sign… i want to add this plus sign to be not inside the right or left
      side of the deck because it takes space and they cannot be same height
      block left one or right one."

   RESOLUTION
     Previously the cartouche surfaced TWO independent affordances:
       · `<TemplatePicker/>`     — a chip above the welcome line that
                                     swapped loadouts (6 templates)
       · `<AddGadgetAffordance/>` — a small hover-revealed "+" living
                                     INSIDE each wing, which forced the
                                     two wings to be unequal heights
                                     whenever only one had a `canAddSmall`
                                     slot free.

     This file consolidates both into a single chip that sits OUTSIDE
     the wings (in the cartouche center column, immediately above the
     welcome line). One click reveals a tabbed popover with three
     panels:

       · LOADOUT       — quick-pick list of 6 templates · active row
                          highlighted · click activates instantly
       · LEFT WING     — gadget catalog grouped by category · disabled
                          rows for items that won't fit · click adds
                          to the LEFT wing
       · RIGHT WING    — symmetric · click adds to the RIGHT wing

     Because the `+` no longer lives in either wing, the wings become
     pure gadget stacks → perfectly height-matchable by the existing
     `useWingHeightParity` measurement.

   The chip itself is designed to read as a single deck-controls
   instrument: a small accent dot, the active template name, and a
   chevron. It's NOT primarily a "+" — it's "FLIGHT DECK · LOADOUT" —
   but the popover treats add-gadget as a first-class peer of loadout.

   The popover styling deliberately mirrors `<TemplatePicker/>`'s
   popover so the two surfaces feel like the same family: 12-px
   border-radius, accent border at 0.28 alpha, blur backdrop, dim
   eyebrow caps, accent-tinted active states.
   ═══════════════════════════════════════════════════════════════════════════ */

import React, {
  useCallback, useEffect, useId, useMemo, useRef, useState,
} from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, LayoutGrid, Plus, RotateCcw, X } from "lucide-react"
import { rgba as vgRgba, VT as VG_VT, type ThemeAccent } from "@/components/vantary-glass"
import {
  defaultSnapshotFromTemplate,
  type UseActiveTemplateApi,
  type WingSnapshot,
} from "@/lib/cartouche/use-active-template"

const EASE_V = [0.22, 1, 0.36, 1] as const

/* ─────────────────────────────────────────────────────────────────────────
   Public types
   ───────────────────────────────────────────────────────────────────────── */

/** A single gadget catalog entry as the hub needs to know it. Matches
 *  the shape of `LivingGadgetCatalogEntry` in your-space.tsx but
 *  declared here so the hub stays decoupled from that 30K-line file. */
export interface HubGadgetEntry {
  id:       string
  label:    string
  size:     "s" | "m" | "l"
  category: string
}

/** Configuration for ONE wing's add-gadget panel. */
export interface HubWingConfig {
  /** Slot sizes currently occupying this wing (used to compute fit). */
  currentSizes: readonly ("s" | "m" | "l")[]
  /** IDs already mounted in this wing (so "already added" rows are hidden). */
  takenIds:     ReadonlySet<string>
  /** Predicate: would adding a gadget of this size fit in this wing? */
  canFit:       (size: "s" | "m" | "l") => boolean
  /** Performs the add. Returns true if it succeeded so the hub can
   *  close the popover when the operation lands. */
  onAdd:        (gadgetId: string) => boolean
}

export interface FlightDeckHubChipProps {
  /** Active-template hook (provided by the cartouche). */
  activeTemplateApi: UseActiveTemplateApi
  accent:            ThemeAccent
  /** Applied snapshot side-effect. The cartouche calls `loadGadgets()`
   *  and re-measures parity in response. */
  onActivateTemplate: (snapshot: WingSnapshot) => void
  /** All shippable gadgets, in their declared catalog order. */
  catalog:    readonly HubGadgetEntry[]
  /** Stable category order — keeps the catalog visually rhythmic. */
  categoryOrder: readonly string[]
  leftWing:   HubWingConfig
  rightWing:  HubWingConfig
  /**
   * When `true`, the chip's visible "Flight Deck · LOADOUT ▾" trigger
   * is rendered at zero size with `visibility: hidden` so the chip
   * disappears from the layout — BUT its wrapper `<div>` remains in
   * the DOM at the same location, so the popover's
   * `position: absolute; top: calc(100% + 10px); left: 50%` anchoring
   * still places the popover in exactly the spot the visible chip used
   * to sit (centered above the wings). Use this when an external
   * element supplies the trigger affordance — see also `externalToggleEvent`.
   */
  hideTrigger?: boolean
  /**
   * Optional name of a `window` `CustomEvent` that, when dispatched
   * anywhere on the page, toggles this chip's open state. Lets a
   * visually-distant element (e.g. the FLIGHT DECK rail title) act as
   * the trigger without plumbing props through ~2K lines of
   * component tree. The chip subscribes on mount and unsubscribes on
   * unmount; only ONE chip on the page should listen to any given
   * event name. Defaults to `undefined` → no external toggle.
   */
  externalToggleEvent?: string
}

type HubTab = "loadout" | "left" | "right"

/* ─────────────────────────────────────────────────────────────────────────
   Public component
   ───────────────────────────────────────────────────────────────────────── */
export function FlightDeckHubChip({
  activeTemplateApi, accent, onActivateTemplate,
  catalog, categoryOrder, leftWing, rightWing,
  hideTrigger = false,
  externalToggleEvent,
}: FlightDeckHubChipProps) {
  const { activeId, template, templates, setActive, resetSnapshot } = activeTemplateApi
  const [open, setOpen] = useState(false)
  const [tab,  setTab]  = useState<HubTab>("loadout")
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)

  /* ── External-trigger bridge ────────────────────────────────────────
     When an `externalToggleEvent` name is supplied, subscribe to that
     window CustomEvent and toggle `open` whenever it fires. This is
     the mechanism that lets the FLIGHT DECK rail headline act as the
     visible trigger while the chip stays mounted (hidden) at its
     original location so the popover keeps its proven anchoring. */
  useEffect(() => {
    if (!externalToggleEvent) return
    const onToggle = () => setOpen((v) => !v)
    window.addEventListener(externalToggleEvent, onToggle)
    return () => window.removeEventListener(externalToggleEvent, onToggle)
  }, [externalToggleEvent])

  /* Esc → close. */
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

  /* Outside-click → close. */
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

  const handleActivateTemplate = useCallback((id: string) => {
    const snapshot = setActive(id)
    onActivateTemplate(snapshot)
    setOpen(false)
    triggerRef.current?.focus()
  }, [setActive, onActivateTemplate])

  const handleResetActive = useCallback(() => {
    resetSnapshot()
    onActivateTemplate(defaultSnapshotFromTemplate(template))
  }, [resetSnapshot, onActivateTemplate, template])

  const handleAddToWing = useCallback((side: "left" | "right", gadgetId: string) => {
    const ok = (side === "left" ? leftWing : rightWing).onAdd(gadgetId)
    if (ok) {
      setOpen(false)
      triggerRef.current?.focus()
    }
  }, [leftWing, rightWing])

  return (
    <div style={{ position: "relative" }}>
      {/*
        When `hideTrigger` is set, the chip's visible button is wrapped
        in a 0×0 invisible shell. The button itself stays mounted so
        the popover's existing `position: absolute` anchoring works
        unchanged, and so the Esc handler's `triggerRef.current?.focus()`
        still has a valid focus target. The external trigger (e.g. the
        FLIGHT DECK rail title) drives `setOpen` via the
        `externalToggleEvent` listener wired above.
      */}
      <div
        style={
          hideTrigger
            ? {
                width:  0,
                height: 0,
                overflow: "hidden",
                pointerEvents: "none",
                visibility: "hidden",
              }
            : undefined
        }
        aria-hidden={hideTrigger || undefined}
      >
        <HubTrigger
          ref={triggerRef}
          accent={accent}
          templateName={template.name}
          open={open}
          onToggle={() => setOpen((v) => !v)}
        />
      </div>

      <AnimatePresence>
        {open && (
          <HubPopover
            ref={popoverRef}
            accent={accent}
            tab={tab}
            onTabChange={setTab}
            templates={templates}
            activeTemplateId={activeId}
            onActivateTemplate={handleActivateTemplate}
            onResetActiveTemplate={handleResetActive}
            catalog={catalog}
            categoryOrder={categoryOrder}
            leftWing={leftWing}
            rightWing={rightWing}
            onAddToWing={handleAddToWing}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Trigger — single chip "[+] Flight Deck · ANALYST / MACRO  ▾"
   ─────────────────────────────────────────────────────────────────────────
   Visually it reads as a deck-controls instrument, not a generic +. The
   `+` glyph lives in an accent-tinted dot on the LEFT, the active
   loadout name is the primary label, and a chevron signals popover.
   ───────────────────────────────────────────────────────────────────── */
interface TriggerProps {
  accent:       ThemeAccent
  templateName: string
  open:         boolean
  onToggle:     () => void
}

const HubTrigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  function HubTrigger({ accent, templateName, open, onToggle }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Open flight-deck controls (current loadout: ${templateName})`}
        onClick={onToggle}
        className="inline-flex items-center font-mono uppercase"
        style={{
          height: 24,
          padding: "0 9px 0 4px",
          gap: 7,
          background: vgRgba(accent.rgb, open ? 0.14 : 0.07),
          border: `1px solid ${vgRgba(accent.rgb, open ? 0.48 : 0.22)}`,
          borderRadius: 999,
          color: accent.hex,
          fontSize: 9,
          letterSpacing: "0.22em",
          cursor: "pointer",
          boxShadow: open ? `0 0 14px ${vgRgba(accent.rgb, 0.32)}` : "none",
          transition: "border-color 200ms, background 200ms, box-shadow 200ms",
        }}
      >
        {/* + glyph in an accent dot */}
        <span
          aria-hidden
          className="inline-flex items-center justify-center rounded-full"
          style={{
            width: 18, height: 18,
            background: vgRgba(accent.rgb, open ? 0.28 : 0.16),
            border: `1px solid ${vgRgba(accent.rgb, open ? 0.62 : 0.36)}`,
            color: accent.hex,
            transition: "background 200ms, border-color 200ms",
          }}
        >
          <Plus size={11} strokeWidth={2.2} />
        </span>

        <span style={{ opacity: 0.65 }}>Flight Deck</span>
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

/* ─────────────────────────────────────────────────────────────────────────
   Popover — three-tab surface (Loadout · Left wing · Right wing)
   ───────────────────────────────────────────────────────────────────────── */
interface PopoverProps {
  accent:                ThemeAccent
  tab:                   HubTab
  onTabChange:           (t: HubTab) => void
  templates:             readonly { id: string; name: string; subtitle?: string; rationale?: string }[] | any
  activeTemplateId:      string
  onActivateTemplate:    (id: string) => void
  onResetActiveTemplate: () => void
  catalog:               readonly HubGadgetEntry[]
  categoryOrder:         readonly string[]
  leftWing:              HubWingConfig
  rightWing:             HubWingConfig
  onAddToWing:           (side: "left" | "right", gadgetId: string) => void
  onClose:               () => void
}

const HubPopover = React.forwardRef<HTMLDivElement, PopoverProps>(
  function HubPopover(p, ref) {
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
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 60,
          width: "min(640px, 92vw)",
          maxHeight: 540,
          display: "flex",
          flexDirection: "column",
          background: "rgba(8, 12, 16, 0.96)",
          backdropFilter: "blur(14px)",
          border: `1px solid ${vgRgba(p.accent.rgb, 0.28)}`,
          borderRadius: 12,
          boxShadow: `0 14px 40px rgba(0,0,0,0.55), 0 0 24px ${vgRgba(p.accent.rgb, 0.18)}`,
          overscrollBehavior: "contain",
        }}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* ── Header · title + close ─────────────────────────────────── */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: "12px 14px 10px",
            borderBottom: `1px solid ${vgRgba(p.accent.rgb, 0.16)}`,
          }}
        >
          <div className="flex flex-col gap-0.5">
            <h3
              id={labelId}
              className="font-sans"
              style={{
                fontSize: 13.5, letterSpacing: "-0.01em",
                color: VG_VT.paper, margin: 0, fontWeight: 500,
              }}
            >
              Flight Deck · Controls
            </h3>
            <p
              className="font-mono uppercase"
              style={{
                fontSize: 9, letterSpacing: "0.22em",
                color: VG_VT.paperDim, margin: 0,
              }}
            >
              Loadout · gadgets · symmetry
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={p.onClose}
            className="inline-flex items-center justify-center rounded-full"
            style={{
              width: 22, height: 22,
              border: `1px solid ${vgRgba(p.accent.rgb, 0.20)}`,
              background: "transparent",
              color: VG_VT.paperDim,
              cursor: "pointer",
            }}
          >
            <X size={11} strokeWidth={1.8} />
          </button>
        </div>

        {/* ── Tab strip ──────────────────────────────────────────────── */}
        <div
          role="tablist"
          aria-label="Hub sections"
          className="flex items-center"
          style={{
            padding: "8px 14px 0",
            gap: 4,
          }}
        >
          {([
            { id: "loadout", label: "Loadout"    },
            { id: "left",    label: "Left wing"  },
            { id: "right",   label: "Right wing" },
          ] as const).map((t) => {
            const active = p.tab === t.id
            return (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => p.onTabChange(t.id)}
                className="font-mono uppercase"
                style={{
                  height: 26,
                  padding: "0 11px",
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  color: active ? p.accent.hex : VG_VT.paperDim,
                  background: active ? vgRgba(p.accent.rgb, 0.12) : "transparent",
                  border: active
                    ? `1px solid ${vgRgba(p.accent.rgb, 0.36)}`
                    : `1px solid transparent`,
                  borderRadius: 999,
                  cursor: "pointer",
                  transition: "color 160ms, background 160ms, border-color 160ms",
                }}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        {/* ── Scrollable panel area ──────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overscrollBehavior: "contain",
            padding: "12px 14px 14px",
          }}
        >
          {p.tab === "loadout" && (
            <LoadoutPanel
              accent={p.accent}
              templates={p.templates as any}
              activeId={p.activeTemplateId}
              onActivate={p.onActivateTemplate}
              onResetActive={p.onResetActiveTemplate}
            />
          )}
          {p.tab === "left" && (
            <WingAddPanel
              accent={p.accent}
              side="left"
              wing={p.leftWing}
              catalog={p.catalog}
              categoryOrder={p.categoryOrder}
              onAdd={(id) => p.onAddToWing("left", id)}
            />
          )}
          {p.tab === "right" && (
            <WingAddPanel
              accent={p.accent}
              side="right"
              wing={p.rightWing}
              catalog={p.catalog}
              categoryOrder={p.categoryOrder}
              onAdd={(id) => p.onAddToWing("right", id)}
            />
          )}
        </div>
      </motion.div>
    )
  },
)

/* ─────────────────────────────────────────────────────────────────────────
   LoadoutPanel — quick-pick list of 6 templates
   ─────────────────────────────────────────────────────────────────────────
   We deliberately do NOT replicate TemplatePicker's mini wing-diagram
   cards here. That picker is gorgeous but heavy; inside a tabbed hub
   the user wants speed, not preview. A clean two-column list of
   loadout rows reads faster:

     ┌─ ANALYST / MACRO ──────────  Best for read-heavy days  ─ ACTIVE ─┐
     │                                                                  │
     ├─ SCALPER / TAPE ──────────  Best for high-frequency desks  ─────┤
     │                                                                  │
     ...

   Active row is glow-bordered. Click → activate + close (handled by
   the parent).
   ───────────────────────────────────────────────────────────────────── */
function LoadoutPanel({
  accent, templates, activeId, onActivate, onResetActive,
}: {
  accent:       ThemeAccent
  templates:    readonly any[]
  activeId:     string
  onActivate:   (id: string) => void
  onResetActive: () => void
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 8,
        }}
      >
        {templates.map((t) => {
          const isActive = t.id === activeId
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onActivate(t.id)}
              className="text-left rounded-md"
              style={{
                padding: "10px 12px",
                background: isActive
                  ? vgRgba(accent.rgb, 0.10)
                  : "rgba(255, 255, 255, 0.012)",   /* near-transparent surface */
                border: isActive
                  ? `1px solid ${vgRgba(accent.rgb, 0.42)}`
                  : `1px solid rgba(255,255,255,0.06)`,
                boxShadow: isActive
                  ? `inset 0 0 14px ${vgRgba(accent.rgb, 0.12)}`
                  : "none",
                cursor: "pointer",
                transition: "background 160ms, border-color 160ms, box-shadow 160ms",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.22em",
                    color: isActive ? accent.hex : VG_VT.paperDim,
                  }}
                >
                  {t.name}
                </span>
                {isActive && (
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontSize: 8,
                      letterSpacing: "0.22em",
                      color: accent.hex,
                      padding: "1px 5px",
                      borderRadius: 3,
                      background: vgRgba(accent.rgb, 0.16),
                      border: `1px solid ${vgRgba(accent.rgb, 0.40)}`,
                    }}
                  >
                    Active
                  </span>
                )}
              </div>
              {/* Persona descriptor — the one-line role. Used as the
                 primary body text of the card. The longer `rationale`
                 lives under the persona at smaller size so cards stay
                 short enough to fit two per row. */}
              <div
                className="font-sans"
                style={{
                  fontSize: 12,
                  color: VG_VT.paper,
                  opacity: isActive ? 1 : 0.86,
                  lineHeight: 1.3,
                  fontWeight: 500,
                  marginBottom: 2,
                }}
              >
                {t.persona ?? ""}
              </div>
              <div
                className="font-sans"
                style={{
                  fontSize: 10.5,
                  color: VG_VT.paperDim,
                  opacity: 0.85,
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {t.rationale ?? ""}
              </div>
            </button>
          )
        })}
      </div>

      {/* Footer · reset the active loadout's customisations */}
      <div
        className="flex items-center justify-between"
        style={{
          marginTop: 4,
          paddingTop: 10,
          borderTop: `1px solid ${vgRgba(accent.rgb, 0.14)}`,
        }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: 8.5, letterSpacing: "0.22em",
            color: VG_VT.paperDim, margin: 0,
          }}
        >
          Per-slot swaps stay scoped to active loadout
        </p>
        <button
          type="button"
          onClick={onResetActive}
          className="inline-flex items-center gap-1.5 font-mono uppercase rounded-full"
          style={{
            height: 22, padding: "0 9px",
            fontSize: 8.5, letterSpacing: "0.22em",
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
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   WingAddPanel — category-grouped gadget catalog for ONE wing
   ─────────────────────────────────────────────────────────────────────────
   Visual grammar mirrors the in-wing GadgetSwapPopover so the user
   feels they're in the same instrument family. Disabled rows (size
   would overflow the wing) are kept visible at 36% opacity with a
   "won't fit" affordance — discoverability over hiding.
   ───────────────────────────────────────────────────────────────────── */
function WingAddPanel({
  accent, side, wing, catalog, categoryOrder, onAdd,
}: {
  accent:        ThemeAccent
  side:          "left" | "right"
  wing:          HubWingConfig
  catalog:       readonly HubGadgetEntry[]
  categoryOrder: readonly string[]
  onAdd:         (id: string) => void
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, HubGadgetEntry[]>()
    for (const g of catalog) {
      if (!map.has(g.category)) map.set(g.category, [])
      map.get(g.category)!.push(g)
    }
    return categoryOrder
      .filter((c) => map.has(c))
      .map((c) => ({ cat: c, items: map.get(c)! }))
  }, [catalog, categoryOrder])

  /* Capacity readout — "3/6 rows used" style header. Communicates
     why some rows are greyed out without forcing the user to guess. */
  const used   = wing.currentSizes.length
  const totalS = wing.currentSizes.filter((s) => s === "s").length
  const totalM = wing.currentSizes.filter((s) => s === "m").length
  const totalL = wing.currentSizes.filter((s) => s === "l").length

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex items-center justify-between"
        style={{
          padding: "6px 8px",
          borderRadius: 8,
          background: vgRgba(accent.rgb, 0.04),
          border: `1px solid ${vgRgba(accent.rgb, 0.14)}`,
        }}
      >
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.22em",
            color: accent.hex,
          }}
        >
          {side === "left" ? "Left wing" : "Right wing"}
          <span style={{ opacity: 0.35, margin: "0 6px" }}>·</span>
          <span style={{ color: VG_VT.paperDim }}>
            {used} mounted
          </span>
        </span>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 8.5,
            letterSpacing: "0.20em",
            color: VG_VT.paperDim,
          }}
        >
          {totalS}<span style={{ opacity: 0.5 }}>s</span>{" "}
          · {totalM}<span style={{ opacity: 0.5 }}>m</span>{" "}
          · {totalL}<span style={{ opacity: 0.5 }}>l</span>
        </span>
      </div>

      {grouped.map((group) => (
        <div key={group.cat}>
          <div
            className="font-mono uppercase"
            style={{
              fontSize: 9,
              letterSpacing: "0.26em",
              color: accent.hex,
              opacity: 0.82,
              marginBottom: 6,
            }}
          >
            {group.cat}
          </div>
          <ul
            className="flex flex-col"
            style={{
              listStyle: "none", margin: 0, padding: 0,
              gap: 2,
            }}
          >
            {group.items.map((g) => {
              const isTaken = wing.takenIds.has(g.id)
              if (isTaken) return null
              const willFit = wing.canFit(g.size)
              return (
                <li key={g.id}>
                  <button
                    type="button"
                    disabled={!willFit}
                    onClick={() => onAdd(g.id)}
                    className="w-full text-left rounded-md"
                    style={{
                      padding: "8px 10px",
                      background: "transparent",
                      border: `1px solid transparent`,
                      cursor: willFit ? "pointer" : "not-allowed",
                      opacity: willFit ? 1 : 0.36,
                      transition: "background 140ms, border-color 140ms",
                    }}
                    onMouseEnter={(e) => {
                      if (!willFit) return
                      const el = e.currentTarget as HTMLButtonElement
                      el.style.background = vgRgba(accent.rgb, 0.07)
                      el.style.borderColor = vgRgba(accent.rgb, 0.22)
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLButtonElement
                      el.style.background = "transparent"
                      el.style.borderColor = "transparent"
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="font-sans truncate"
                          style={{
                            fontSize: 12.5,
                            color: VG_VT.paper,
                            fontWeight: 500,
                            letterSpacing: "-0.005em",
                          }}
                        >
                          {g.label}
                        </span>
                        <span
                          className="font-mono uppercase"
                          style={{
                            fontSize: 8.5,
                            letterSpacing: "0.18em",
                            color: accent.hex,
                            padding: "1px 5px",
                            borderRadius: 3,
                            background: vgRgba(accent.rgb, 0.10),
                            border: `1px solid ${vgRgba(accent.rgb, 0.28)}`,
                            lineHeight: 1.4,
                            flexShrink: 0,
                          }}
                        >
                          {g.size.toUpperCase()}
                        </span>
                      </div>
                      {!willFit && (
                        <span
                          className="font-mono uppercase"
                          style={{
                            fontSize: 8,
                            letterSpacing: "0.18em",
                            color: VG_VT.paperDim,
                            flexShrink: 0,
                          }}
                        >
                          Won&apos;t fit
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
