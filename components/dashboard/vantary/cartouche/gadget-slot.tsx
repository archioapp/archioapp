"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · FLIGHT DECK · GADGET GRID + SLOT  (Phase A skeleton)
   ───────────────────────────────────────────────────────────────────────────
   The single LAYOUT OWNER for the cockpit wings. Everything that used to be
   scattered across ad-hoc `motion.div` transforms, absolute edit clusters, and
   off-canvas popovers is consolidated here so there is exactly ONE place that
   controls:

     · column structure + gaps          (FlightDeckGadgetGrid / GadgetWing)
     · per-gadget clipping              (GadgetSlot · overflow:clip + safe pad)
     · z-index ordering                 (Z scale below — nothing improvises)
     · min-width legibility floor       (GadgetSlot enforces registry.minWidth)
     · hover layering                   (GadgetSlot raises a single z token)

   The gadgets themselves NEVER position, clip, or set z-index anymore. They
   render their face; the slot owns the geometry. This is what guarantees no
   gadget can ever escape its hero, overlap a neighbour, or fall under the
   chart toolbar.

   Phase A delivers the primitives + a single z-index scale. Phases B/C wire the
   real wings onto it; D adds the swap panel; E the hover/expand + dock.
   ═══════════════════════════════════════════════════════════════════════════ */

import React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { rgba as vgRgba } from "@/components/vantary-glass"
import {
  CELLS_PER_ROW,
  sizeToCols,
  type CartoucheSide,
  type GadgetSize,
} from "@/lib/hooks/use-welcome-badge-config"

/* ───────────────────────────────────────────────────────────────────────────
   THE Z-INDEX SCALE  ·  one ladder, no improvising
   ───────────────────────────────────────────────────────────────────────────
   Every layer in the cockpit reads its z from here. Lower numbers sit behind
   higher ones. The whole point of the rebuild is that these never collide:
     rail < wing surface < raised (hover) < edit affordance < popover < inspector
   ─────────────────────────────────────────────────────────────────────────── */
export const FLIGHT_DECK_Z = {
  rail: 1,
  wing: 2,
  slot: 3,
  slotRaised: 6,
  editAffordance: 8,
  swapPopover: 40,
  inspector: 60,
} as const

/* Slot inner padding (px) — reserves room INSIDE the clip for the edit
 * affordance so it never has to live at top:-10 outside the cell again. */
const SLOT_SAFE_PAD = 12

/* ───────────────────────────────────────────────────────────────────────────
   <FlightDeckGadgetGrid/>  ·  the outer 3-column owner of one wing
   ─────────────────────────────────────────────────────────────────────────── */
export function FlightDeckGadgetGrid({
  children,
  gap = 10,
  className,
  style,
}: {
  children: React.ReactNode
  gap?: number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${CELLS_PER_ROW}, minmax(0, 1fr))`,
        gridAutoRows: "minmax(0, auto)",
        gap,
        position: "relative",
        zIndex: FLIGHT_DECK_Z.wing,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ───────────────────────────────────────────────────────────────────────────
   <GadgetSlot/>  ·  the ONLY element allowed to own position/clip/z
   ───────────────────────────────────────────────────────────────────────────
   Responsibilities:
     · span the right number of columns for its size (s=1, m=2, l=3)
     · clip its content (overflow:clip) with a safe inner pad so the edit
       affordance lives INSIDE the hero, never bleeding over neighbours
     · enforce a minimum legible width (registry minWidth) — below that the
       grid will wrap rather than crush the gadget
     · raise its z-index on hover via the single Z token (no per-gadget hacks)
     · host an optional `affordance` slot (pencil/remove cluster) positioned
       in the reserved safe-pad corner

   It is deliberately presentational: state (hover open, swap) is owned by the
   wing in Phase B/C and passed down. Here we own ONLY geometry + layering.
   ─────────────────────────────────────────────────────────────────────────── */
export function GadgetSlot({
  size,
  side,
  minWidth,
  accentRgb,
  raised = false,
  affordance,
  children,
  onHoverChange,
  ariaLabel,
}: {
  size: GadgetSize
  side: CartoucheSide
  /** Legibility floor from the registry. */
  minWidth: number
  /** Accent for the (subtle) hover ring. */
  accentRgb: string
  /** External raise (e.g. while its swap popover is open). */
  raised?: boolean
  /** Edit cluster rendered in the reserved safe-pad corner. */
  affordance?: React.ReactNode
  children: React.ReactNode
  onHoverChange?: (hovered: boolean) => void
  ariaLabel?: string
}) {
  const reduced = useReducedMotion()
  const [hover, setHover] = React.useState(false)
  const cols = sizeToCols(size)
  const isRaised = hover || raised

  const setH = (v: boolean) => {
    setHover(v)
    onHoverChange?.(v)
  }

  /* The affordance sits in the top-OUTER corner but INSIDE the clip, in the
   * reserved safe pad — so it is always fully visible and never overlaps a
   * sibling slot. */
  const affordanceCorner: React.CSSProperties =
    side === "left"
      ? { top: 2, left: 2 }
      : { top: 2, right: 2 }

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        gridColumn: `span ${cols} / span ${cols}`,
        minWidth,
        position: "relative",
        zIndex: isRaised ? FLIGHT_DECK_Z.slotRaised : FLIGHT_DECK_Z.slot,
      }}
    >
      <motion.div
        style={{
          position: "relative",
          height: "100%",
          padding: SLOT_SAFE_PAD,
          borderRadius: 14,
          /* clip (not hidden) keeps the rounded corners crisp while still
           * containing the gadget's glows, flip back-faces, and halos. */
          overflow: "clip",
          // Hover ring is drawn as an inset shadow so it never adds layout.
          boxShadow: isRaised
            ? `inset 0 0 0 1px ${vgRgba(accentRgb, 0.22)}, 0 8px 28px rgba(0,0,0,0.28)`
            : "inset 0 0 0 1px rgba(255,255,255,0.02)",
        }}
        animate={
          reduced
            ? undefined
            : { y: isRaised ? -2 : 0, scale: isRaised ? 1.006 : 1 }
        }
        transition={{ type: "spring", stiffness: 320, damping: 30, mass: 0.7 }}
      >
        {/* The gadget face. */}
        <div style={{ position: "relative", zIndex: 1, height: "100%" }}>
          {children}
        </div>

        {/* Edit affordance — reserved corner, above the face, inside the clip. */}
        {affordance && (
          <div
            style={{
              position: "absolute",
              ...affordanceCorner,
              zIndex: FLIGHT_DECK_Z.editAffordance,
            }}
          >
            {affordance}
          </div>
        )}
      </motion.div>
    </div>
  )
}

/* ───────────────────────────────────────────────────────────────────────────
   <GadgetWing/>  ·  a labelled column of packed slots (left or right)
   ───────────────────────────────────────────────────────────────────────────
   Thin wrapper around FlightDeckGadgetGrid that establishes the wing's stacking
   context + alignment. Rows are packed by the caller (via packRows); this just
   lays the packed children into the 3-col grid.
   ─────────────────────────────────────────────────────────────────────────── */
export function GadgetWing({
  side,
  children,
  className,
  style,
}: {
  side: CartoucheSide
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <section
      aria-label={`${side === "left" ? "Left" : "Right"} instrument wing`}
      className={className}
      style={{
        position: "relative",
        zIndex: FLIGHT_DECK_Z.wing,
        // Each wing is its own stacking context so a raised slot never escapes
        // into the opposite wing or the center command.
        isolation: "isolate",
        ...style,
      }}
    >
      <FlightDeckGadgetGrid>{children}</FlightDeckGadgetGrid>
    </section>
  )
}
