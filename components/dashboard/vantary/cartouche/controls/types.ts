/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · FLIGHT DECK · CONTROLS MODE — shared types
   ───────────────────────────────────────────────────────────────────────────
   The cinematic Flight Deck Controls surface that REPLACES the center
   "Welcome back" hero in place. Everything in this folder is presentational
   + wired through these callbacks, which the cartouche (TraderCartouche in
   your-space.tsx) supplies. The cartouche stays the single source of truth
   for wing state (useWelcomeBadgeConfig) + the active loadout
   (useActiveTemplate). Controls mode never owns persisted state — it only
   PREVIEWS (live, uncommitted) and COMMITS through these handlers.
   ═══════════════════════════════════════════════════════════════════════════ */

import type { ThemeAccent } from "@/components/vantary-glass"
import type {
  UseActiveTemplateApi,
  WingSnapshot,
} from "@/lib/cartouche/use-active-template"

export type WingSide = "left" | "right"
export type ControlsTab = "loadout" | "left" | "right" | "gadgets" | "symmetry"

/** A gadget as controls mode needs to know it — mirrors the cartouche's
 *  catalog entry shape but stays decoupled from the 30K-line file. */
export interface ControlsGadgetEntry {
  id:       string
  label:    string
  size:     "s" | "m" | "l"
  category: string
  /** Optional one-line purpose, used by the library rows. */
  blurb?:   string
}

/** The committed wing configuration (what is persisted right now). */
export interface ControlsWings {
  left:  readonly string[]
  right: readonly string[]
}

/** A live, uncommitted preview the wings should render instead of their
 *  committed config. `null` clears the preview (wings show committed state). */
export type ControlsPreview = WingSnapshot | null

/** A single highlighted slot on a real wing (editor/library hover bridge). */
export interface ControlsHighlight {
  side:  WingSide
  /** Slot index in that wing, or null to clear. */
  index: number | null
}

export interface FlightDeckControlsModeProps {
  accent:            ThemeAccent
  activeTemplateApi: UseActiveTemplateApi
  /** Current committed wings (so the editor + symmetry read live state). */
  wings:             ControlsWings
  /** Full shippable gadget catalog, in declared order. */
  catalog:           readonly ControlsGadgetEntry[]
  /** Stable category order for the library. */
  categoryOrder:     readonly string[]

  /* ── Commit handlers (write to persisted state) ─────────────────────── */
  onApplyLoadout:    (snapshot: WingSnapshot) => void
  onResetLoadout:    () => void
  onAddGadget:       (side: WingSide, gadgetId: string) => boolean
  onRemoveGadget:    (side: WingSide, index: number) => void
  onReorderGadget:   (side: WingSide, index: number, direction: -1 | 1) => void
  onSendToOtherSide: (side: WingSide, index: number) => boolean

  /* ── Fit predicate (does a gadget of this size still fit in a wing?) ── */
  canFit:            (side: WingSide, size: "s" | "m" | "l") => boolean

  /* ── Live preview bridge (the wings react before committing) ────────── */
  onPreview:         (preview: ControlsPreview) => void
  onHighlight:       (highlight: ControlsHighlight | null) => void

  /* ── Chrome ─────────────────────────────────────────────────────────── */
  onClose:           () => void
}
