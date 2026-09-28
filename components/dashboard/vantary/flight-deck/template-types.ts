/* ═══════════════════════════════════════════════════════════════════════════
 *  UNIVERSAL TEMPLATE ENGINE — TYPE CONTRACT
 *  ─────────────────────────────────────────────────────────────────────────
 *  A Template is a structured operational workspace definition. Every
 *  flight-deck destination (Mentor Hall → Compare Mentors, Review Room →
 *  Risk Audit, etc.) is a Template. The shell owns the spatial doctrine
 *  (registration corners, live ticks, route IDs, dashed connectors,
 *  footer telemetry) and the template provides the content modules.
 *
 *  This file defines the contract. The Template registry maps each of
 *  the sixteen destination IDs to a TemplateModule and TemplateShell
 *  consumes that module to render the seven-zone anatomy:
 *
 *    1. Identity strip        — eyebrow code, live UTC tick, room chip
 *    2. Prelude               — one-sentence framing
 *    3. Inputs zone           — schema-driven inputs the template needs
 *    4. Resolver / picker     — visible selection state + presets
 *    5. Render plan           — the operational answer surface
 *    6. Drill-forward rail    — three to six suggested follow-up actions
 *    7. Footer telemetry      — UTC tick, sources, refreshed-at, export
 *
 *  Templates that are not yet fully built (the fifteen non-marquee
 *  destinations) provide a `kind: "warming"` render plan so they fall
 *  back to the shared, polished WarmingBody — never an ugly TODO card.
 * ═══════════════════════════════════════════════════════════════════════ */

import type { ReactNode } from "react"

/* ────────────────────────────────────────────────────────────────────────
 *  Identity & taxonomy
 *  ────────────────────────────────────────────────────────────────────── */

export type FlightDeckRoomId =
  | "market"
  | "studio"
  | "mentors"
  | "review"
  /** "collective" carries the three Communities marquee templates:
   *  Discover Ecosystems (M04), Community Atlas (M05), and the
   *  Community Profile deep-view (M06). */
  | "collective"

/** The canonical destination IDs. All template IDs are
 *  `${roomId}.${destinationSlug}`. */
export type FlightDeckTemplateId =
  | "market.signal-room"
  | "market.forecast-room"
  | "market.live-charts"
  | "market.news-wire"
  | "studio.create-forecast"
  | "studio.publish-signal"
  | "studio.journal-entry"
  | "studio.build-setup"
  | "mentors.compare-mentors"
  | "mentors.mentor-library"
  | "mentors.replay-sessions"
  | "mentors.insights-vault"
  | "review.todays-stats"
  | "review.performance-audit"
  | "review.risk-audit"
  | "review.schedule-review"
  // ── THE COLLECTIVE — four destinations for ecosystem discovery ──
  | "collective.community-hub"
  | "collective.compare-ecosystems"
  | "collective.my-fit"
  | "collective.live-activity"

/* ────────────────────────────────────────────────────────────────────────
 *  Source / status descriptors — surfaced in the footer telemetry strip.
 *  ────────────────────────────────────────────────────────────────────── */

export type TemplateSourceStatus =
  /** Live — sources are streaming and fresh. */
  | { kind: "live"; sources: readonly string[]; refreshedAt: Date }
  /** Cached — last good telemetry is some seconds/minutes old. */
  | { kind: "cached"; sources: readonly string[]; refreshedAt: Date }
  /** Warming — telemetry hasn't arrived yet (used by warming templates). */
  | { kind: "warming"; sources: readonly string[] }
  /** Degraded — at least one source is unreachable; render with caveat. */
  | { kind: "degraded"; sources: readonly string[]; reason: string; refreshedAt?: Date }

/* ────────────────────────────────────────────────────────────────────────
 *  Drill-forward rail — three to six suggested follow-up actions.
 *  ────────────────────────────────────────────────────────────────────── */

export interface DrillForwardSuggestion {
  /** Stable id, used for keying + DrillCard cross-key. */
  id: string
  /** Route ID prefix — D01..D06 by convention. */
  routeId: string
  /** Imperative verb-first label. */
  label: string
  /** Optional short reason / context line. */
  hint?: string
  /** Urgency — drives accent + ordering. */
  urgency?: "high" | "medium" | "low"
  /** What happens when the user invokes the suggestion. */
  onSelect?: () => void
}

/* ────────────────────────────────────────────────────────────────────────
 *  Inputs schema — minimal descriptor that the inputs zone renders.
 *  Templates that drive their own picker UI (e.g. Compare Mentors) leave
 *  this empty and provide their own pickerNode in the renderPlan.
 *  ────────────────────────────────────────────────────────────────────── */

export type TemplateInputField =
  | { kind: "date"; id: string; label: string; defaultValue?: Date }
  | { kind: "symbol"; id: string; label: string; placeholder?: string }
  | { kind: "select"; id: string; label: string; options: readonly { value: string; label: string }[]; defaultValue?: string }
  | { kind: "text"; id: string; label: string; placeholder?: string }

/* ────────────────────────────────────────────────────────────────────────
 *  Render plan — what the shell paints inside the answer area.
 *
 *  Two flavors:
 *
 *    1. "warming" — the fifteen non-marquee templates use this. The
 *       shell paints a polished operational warming body with the
 *       template's prelude, sources hint, expected inputs, and a
 *       reassurance that the destination is "coming online". Never
 *       a developer-facing TODO.
 *
 *    2. "custom" — the marquee templates render their own answer
 *       surface (mission briefing + telemetry quad + advisory sheets
 *       + schedule matrix + destination bay + drill-forward rail +
 *       footer telemetry). The shell still paints the identity strip,
 *       prelude, and footer; the custom node owns everything between.
 *  ────────────────────────────────────────────────────────────────────── */

export interface WarmingRenderPlan {
  kind: "warming"
  /** What this destination will eventually replace. */
  replaces: string
  /** What decision it helps the trader make. */
  decision: string
  /** What sources it expects to consume. */
  expectedSources: readonly string[]
  /** Where on the trading rail it connects (prep / decision / record). */
  railConnection: "prep" | "decision" | "execution" | "record" | "review"
}

export interface CustomRenderPlan {
  kind: "custom"
  render: (ctx: TemplateRenderContext) => ReactNode
}

export type TemplateRenderPlan = WarmingRenderPlan | CustomRenderPlan

/* ────────────────────────────────────────────────────────────────────────
 *  TemplateRenderContext — passed to the custom render() callback.
 *  ────────────────────────────────────────────────────────────────────── */

export interface TemplateRenderContext {
  /** The active template descriptor. */
  template: TemplateDescriptor
  /** Optional initial parameters from a click path, NL path, or deep link.
   *  Compare Mentors uses { mentorAId, mentorBId, resolverNote, rawQuery }.
   *  Other templates can adopt their own keys. */
  initialParams?: Record<string, unknown>
  /** Imperative dispatcher for opening another template (used by the
   *  drill-forward rail and destination-bay actions). */
  openTemplate: (id: FlightDeckTemplateId, params?: Record<string, unknown>) => void
  /** Imperative dismiss — back to the cockpit. */
  closeTemplate: () => void
}

/* ────────────────────────────────────────────────────────────────────────
 *  TemplateDescriptor — the static metadata for a template.
 *  ────────────────────────────────────────────────────────────────────── */

export interface TemplateDescriptor {
  /** "${roomId}.${destinationSlug}" — globally unique. */
  id: FlightDeckTemplateId
  /** Parent room. */
  room: FlightDeckRoomId
  /** Display label of the destination — same string as the cockpit button. */
  destination: string
  /** Mono eyebrow code shown in the identity strip ("MENTOR HALL · COMPARE"). */
  eyebrow: string
  /** One-sentence framing under the identity strip. */
  prelude: string
  /** Optional anchor highlights inside the prelude (rendered emphasised). */
  preludeAnchors?: readonly string[]
  /** Source/status metadata for the footer. */
  sourceStatus: TemplateSourceStatus
  /** Optional inputs schema — shell renders simple fields automatically. */
  inputsSchema?: readonly TemplateInputField[]
  /** Render plan — warming or custom. */
  renderPlan: TemplateRenderPlan
  /** Drill-forward suggestions — 3–6 items. */
  drillForward: readonly DrillForwardSuggestion[]
  /** Route ID prefix for cards inside this template (e.g. "M-CMP" for
   *  Mentor Hall · Compare). Templates use this to derive per-card
   *  IDs like "M-CMP-A01". */
  routePrefix: string
}

/* ────────────────────────────────────────────────────────────────────────
 *  Builder helpers — keep the call sites in templates/* tidy.
 *  ────────────────────────────────────────────────────────────────────── */

/** Build a warming render plan with sensible defaults. */
export function warmingPlan(args: {
  replaces: string
  decision: string
  expectedSources: readonly string[]
  railConnection: WarmingRenderPlan["railConnection"]
}): WarmingRenderPlan {
  return { kind: "warming", ...args }
}

/** Build a custom render plan from a render callback. */
export function customPlan(render: CustomRenderPlan["render"]): CustomRenderPlan {
  return { kind: "custom", render }
}

/** Alias for backward compatibility. */
export type DrillForwardItem = DrillForwardSuggestion
