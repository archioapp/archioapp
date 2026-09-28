/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · FLIGHT DECK · TEMPLATE REGISTRY
   ───────────────────────────────────────────────────────────────────────────
   Six persona-tuned cartouche loadouts. Each template specifies the gadgets
   in both wings, packed in the same `sss | sm | ms | l` row geometry that
   the existing LIVING_GADGETS_DESCRIPTOR uses.

   The flight-deck cartouche reads the ACTIVE template (via `use-active-
   template`) and the per-template overrides (the existing swap-popover
   selection saved per-template), and renders accordingly.

   ┌────────────────────────── ROW GEOMETRY ──────────────────────────┐
   │ Each wing is a 3-col × 2-row grid. Allowed row packings:         │
   │     "sss"   3 small                                              │
   │     "sm"    1 small + 1 medium                                   │
   │     "ms"    1 medium + 1 small                                   │
   │     "l"     1 large (spans 3 cols)                               │
   │ A template's wing is an ordered array of slots; each slot pins   │
   │ a gadget by id + size + packing.                                 │
   └──────────────────────────────────────────────────────────────────┘

   Gadget ids reference the union below — gadgets that are NOT yet built
   in living-gadgets.tsx are rendered as a `<TemplateSkeletonGadget/>`
   placeholder that honours wing-height parity and accent treatment, so
   the user can still preview the structure of templates that depend on
   future works (Mentor / Analyst / Notifications fully wired).
   ═══════════════════════════════════════════════════════════════════════════ */

/* ────────────────────────────────────────────────────────────────────────
   Gadget id union — every shipping gadget + the not-yet-built skeleton
   placeholders that future works will land on.
   ──────────────────────────────────────────────────────────────────────── */
export const SHIPPING_GADGET_IDS = [
  "management-pulse",
  "last-5-trades",
  "accuracy-engine",
  "best-pair",
  "session-clockwork",
  "macro-pulse",
  "win-rate-heart",
] as const

export const SKELETON_GADGET_IDS = [
  "student-feed",
  "student-comments",
  "cohort-pulse",
  "discipline-pulse",
  "revenge-risk",
  "notification-stream",
  "alerts-pulse",
  "correlation-matrix",
] as const

export type ShippingGadgetId = (typeof SHIPPING_GADGET_IDS)[number]
export type SkeletonGadgetId = (typeof SKELETON_GADGET_IDS)[number]
export type GadgetId         = ShippingGadgetId | SkeletonGadgetId

/* ────────────────────────────────────────────────────────────────────────
   Slot + wing geometry types
   ──────────────────────────────────────────────────────────────────────── */
export type GadgetSize     = "s" | "m" | "l"
export type RowPacking     = "sss" | "sm" | "ms" | "l"

export interface TemplateSlot {
  /** Gadget rendered at this slot. */
  id:   GadgetId
  /** The size class — drives the grid col-span. */
  size: GadgetSize
}

export interface TemplateRow {
  /** Row packing key, e.g. "sm". Slots length must match: sss=3, sm=2, ms=2, l=1. */
  packing: RowPacking
  /** Slots from outer→inner direction in the wing. */
  slots:   readonly TemplateSlot[]
}

export interface TemplateWing {
  /** Top row of the wing. */
  top:    TemplateRow
  /** Bottom row of the wing. */
  bottom: TemplateRow
}

export interface FlightDeckTemplate {
  /** Stable id used as the localStorage key + URL slug. */
  id:          string
  /** Display name shown in the picker chip. */
  name:        string
  /** One-line persona descriptor under the name. */
  persona:     string
  /** Long-form rationale shown on the picker card. */
  rationale:   string
  /** Mini-diagram color hint — defaults to the active accent. */
  accentHint?: "default" | "warm" | "cool"
  /** Left wing. */
  left:  TemplateWing
  /** Right wing. */
  right: TemplateWing
}

/* ────────────────────────────────────────────────────────────────────────
   Row validation — runtime guard. Compile-time exhaustiveness via TS
   inference on `slots.length`.
   ──────────────────────────────────────────────────────────────────────── */
const ROW_LENGTH: Record<RowPacking, number> = {
  sss: 3, sm: 2, ms: 2, l: 1,
}

export function isValidRow(row: TemplateRow): boolean {
  return row.slots.length === ROW_LENGTH[row.packing]
}

/* ────────────────────────────────────────────────────────────────────────
   FLIGHT_DECK_TEMPLATES — the 6 persona loadouts
   ────────────────────────────────────────────────────────────────────────
   Order in this array is the order they appear in the picker grid.
   Slot order is OUTER → INNER (so on the left wing, the outer side is
   the LEFT edge of the screen, and on the right wing the outer side is
   the RIGHT edge).
   ──────────────────────────────────────────────────────────────────────── */
export const FLIGHT_DECK_TEMPLATES: readonly FlightDeckTemplate[] = [
  /* ──────────────────────────────────────────────────────────────────── */
  {
    id:        "trader-default",
    name:      "Trader Default",
    persona:   "The ARCHIO baseline loadout",
    rationale: "Total Equity + Last 5 Trades on the left; Accuracy, Best Pair, Session and Macro on the right. Everything a working trader needs at a glance.",
    left: {
      top:    { packing: "l", slots: [{ id: "management-pulse", size: "l" }] },
      bottom: { packing: "l", slots: [{ id: "last-5-trades",    size: "l" }] },
    },
    right: {
      top:    { packing: "ms", slots: [{ id: "accuracy-engine",   size: "m" }, { id: "best-pair",  size: "s" }] },
      bottom: { packing: "ms", slots: [{ id: "session-clockwork", size: "m" }, { id: "macro-pulse", size: "s" }] },
    },
  },

  /* ──────────────────────────────────────────────────────────────────── */
  {
    id:        "mentor",
    name:      "Mentor",
    persona:   "Educators tracking a cohort",
    rationale: "Cohort pulse and student activity replace personal P/L emphasis. For traders who teach.",
    accentHint: "warm",
    left: {
      top:    { packing: "l", slots: [{ id: "management-pulse", size: "l" }] },
      bottom: { packing: "l", slots: [{ id: "student-feed",     size: "l" }] },
    },
    right: {
      top:    { packing: "ms", slots: [{ id: "cohort-pulse",      size: "m" }, { id: "best-pair",         size: "s" }] },
      bottom: { packing: "ms", slots: [{ id: "session-clockwork", size: "m" }, { id: "student-comments",  size: "s" }] },
    },
  },

  /* ──────────────────────────────────────────────────────────────────── */
  {
    id:        "psychology",
    name:      "Psychology",
    persona:   "Discipline-first traders",
    rationale: "Big discipline pulse + win-rate heart + revenge risk. Built for traders rebuilding their head game.",
    accentHint: "cool",
    left: {
      top:    { packing: "l", slots: [{ id: "discipline-pulse", size: "l" }] },
      bottom: { packing: "l", slots: [{ id: "last-5-trades",    size: "l" }] },
    },
    right: {
      top:    { packing: "ms", slots: [{ id: "accuracy-engine",   size: "m" }, { id: "win-rate-heart", size: "s" }] },
      bottom: { packing: "ms", slots: [{ id: "session-clockwork", size: "m" }, { id: "revenge-risk",   size: "s" }] },
    },
  },

  /* ──────────────────────────────────────────────────────────────────── */
  {
    id:        "notifications",
    name:      "Notifications",
    persona:   "Alert-driven workflow",
    rationale: "A live notification stream takes the hero slot. Useful when you want the cartouche to nudge you instead of you reading it.",
    left: {
      top:    { packing: "l", slots: [{ id: "notification-stream", size: "l" }] },
      bottom: { packing: "l", slots: [{ id: "last-5-trades",        size: "l" }] },
    },
    right: {
      top:    { packing: "ms", slots: [{ id: "macro-pulse",         size: "m" }, { id: "alerts-pulse", size: "s" }] },
      bottom: { packing: "ms", slots: [{ id: "session-clockwork",   size: "m" }, { id: "best-pair",    size: "s" }] },
    },
  },

  /* ──────────────────────────────────────────────────────────────────── */
  {
    id:        "compact-pro",
    name:      "Compact Pro",
    persona:   "Density-maximalist",
    rationale: "Eight gadgets in eight slots. The most information per square pixel — no large hero cards.",
    left: {
      top:    { packing: "ms", slots: [{ id: "management-pulse", size: "m" }, { id: "win-rate-heart", size: "s" }] },
      bottom: { packing: "ms", slots: [{ id: "last-5-trades",    size: "m" }, { id: "best-pair",      size: "s" }] },
    },
    right: {
      top:    { packing: "ms", slots: [{ id: "accuracy-engine", size: "m" }, { id: "session-clockwork", size: "s" }] },
      bottom: { packing: "ms", slots: [{ id: "macro-pulse",     size: "m" }, { id: "discipline-pulse",  size: "s" }] },
    },
  },

  /* ──────────────────────────────────────────────────────────────────── */
  {
    id:        "analyst-macro",
    name:      "Analyst / Macro",
    persona:   "Big-picture readers",
    rationale: "Total Equity + Correlation Matrix on the left, Macro headline on the right. Built for the trader who reads the global tape.",
    left: {
      top:    { packing: "l", slots: [{ id: "management-pulse",   size: "l" }] },
      bottom: { packing: "l", slots: [{ id: "correlation-matrix", size: "l" }] },
    },
    right: {
      top:    { packing: "ms", slots: [{ id: "macro-pulse",        size: "m" }, { id: "best-pair",       size: "s" }] },
      bottom: { packing: "ms", slots: [{ id: "session-clockwork",  size: "m" }, { id: "accuracy-engine", size: "s" }] },
    },
  },
] as const

/* ────────────────────────────────────────────────────────────────────────
   Lookups + helpers
   ──────────────────────────────────────────────────────────────────────── */
export const TEMPLATE_BY_ID: Readonly<Record<string, FlightDeckTemplate>> =
  FLIGHT_DECK_TEMPLATES.reduce<Record<string, FlightDeckTemplate>>(
    (acc, t) => { acc[t.id] = t; return acc },
    {},
  )

export const DEFAULT_TEMPLATE_ID = "trader-default" as const

export function getTemplate(id: string): FlightDeckTemplate {
  return TEMPLATE_BY_ID[id] ?? TEMPLATE_BY_ID[DEFAULT_TEMPLATE_ID]!
}

/* ────────────────────────────────────────────────────────────────────────
   Gadget abbreviations — used by the picker's mini wing diagrams
   ──────────────────────────────────────────────────────────────────────── */
export const GADGET_ABBREVIATIONS: Readonly<Record<GadgetId, string>> = {
  "management-pulse":    "MP",
  "last-5-trades":       "L5",
  "accuracy-engine":     "AE",
  "best-pair":           "BP",
  "session-clockwork":   "SC",
  "macro-pulse":         "MC",
  "win-rate-heart":      "WR",
  "student-feed":        "SF",
  "student-comments":    "SQ",
  "cohort-pulse":        "CP",
  "discipline-pulse":    "DP",
  "revenge-risk":        "RR",
  "notification-stream": "NS",
  "alerts-pulse":        "AL",
  "correlation-matrix":  "CM",
}

/** Full label used by the skeleton placeholder. */
export const GADGET_LABELS: Readonly<Record<GadgetId, string>> = {
  "management-pulse":    "Total Equity",
  "last-5-trades":       "Last 5 Trades",
  "accuracy-engine":     "Accuracy Engine",
  "best-pair":           "Best Pair",
  "session-clockwork":   "Session Clockwork",
  "macro-pulse":         "Macro Pulse",
  "win-rate-heart":      "Win-Rate Heart",
  "student-feed":        "Student Feed",
  "student-comments":    "Student Comments",
  "cohort-pulse":        "Cohort Pulse",
  "discipline-pulse":    "Discipline Pulse",
  "revenge-risk":        "Revenge Risk",
  "notification-stream": "Notification Stream",
  "alerts-pulse":        "Alerts Pulse",
  "correlation-matrix":  "Correlation Matrix",
}

/** True if the gadget id has a real implementation in living-gadgets.tsx. */
export function isShippingGadget(id: GadgetId): id is ShippingGadgetId {
  return (SHIPPING_GADGET_IDS as readonly string[]).includes(id)
}

/* ────────────────────────────────────────────────────────────────────────
   Iteration helpers — flatten the rows of a wing into a slot list, in
   render order (top-then-bottom, outer→inner within a row).
   ──────────────────────────────────────────────────────────────────────── */
export function flattenWingSlots(wing: TemplateWing): readonly TemplateSlot[] {
  return [...wing.top.slots, ...wing.bottom.slots]
}

/** Count the slots in a template (used for stagger math + tests). */
export function countTemplateSlots(template: FlightDeckTemplate): number {
  return flattenWingSlots(template.left).length + flattenWingSlots(template.right).length
}
