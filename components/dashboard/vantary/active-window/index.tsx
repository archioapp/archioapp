"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  ACTIVE WINDOW · BARREL · <ActiveWindowPanel/>
 *  ─────────────────────────────────────────────────────────────────────────
 *  The single component the consumer mounts to replace the three legacy
 *  surfaces (TemporalAnchorHeader, DayPlaybookCompact, ActiveSessionFocusCard).
 *  It owns the spine wiring — calling `useUTCClock`, `useActiveSession`,
 *  `useDaySelection` — and hands the resolved data down to the three
 *  archio layers as fully-typed props.
 *
 *  Reading order on screen (top → bottom):
 *    1. <TemporalAnchorRail/>      — temporal anchor
 *    2. <DayPlaybookCanvas/>       — playbook verdict + expandable intel
 *    3. <ArchioSeam/>              — section break
 *    4. <ActiveWindowDossier/>     — live session dossier
 *
 *  The panel deliberately does NOT render `WhyNowSynthesis`, the trader
 *  posture footer, or the OS context line. Those layers stay in
 *  `SessionsCompactStage` and continue to bracket the Active Window panel
 *  above and below.
 *
 *  Type-bridge note · the consumer's DAY_PLAYBOOK and SESSIONS_INTEL data
 *  is structurally compatible with the lite types declared in the layer
 *  files — TypeScript will narrow them at the call site without any
 *  manual cast required. The panel accepts them as `Record<number, any>`
 *  / `any[]` to keep the API surface small; the layers do their own type
 *  enforcement internally.
 * ═══════════════════════════════════════════════════════════════════════ */

import { useReducedMotion } from "framer-motion"
import { VANTARY } from "../vantary-theme"
import { useUTCClock, useDaySelection } from "../clock-spine"
import { ArchioSeam } from "./archio-seam"
import { TemporalAnchorRail } from "./temporal-anchor-rail"
import { DayPlaybookCanvas, type DayPlaybookData } from "./day-playbook-canvas"
import {
  ActiveWindowDossier,
  type SessionDefLite,
  type MicroPhaseLite,
} from "./active-window-dossier"

/* Re-export primitives for downstream callers. */
export { ArchioSeam } from "./archio-seam"
export { ArchioPulseDot } from "./archio-pulse-dot"
export { ArchioRotatingLabel } from "./archio-rotating-label"
export { TemporalAnchorRail } from "./temporal-anchor-rail"
export { DayPlaybookCanvas } from "./day-playbook-canvas"
export { ActiveWindowDossier } from "./active-window-dossier"
export type { DayPlaybookData, DayQuality } from "./day-playbook-canvas"
export type { SessionDefLite, MicroPhaseLite } from "./active-window-dossier"

/* ─────────────────────────────────────────────────────────────────────────
 *  <ActiveWindowPanel/>  ·  the public mount target
 *  ───────────────────────────────────────────────────────────────────────
 *  The single consumer-facing component. Pass in the static data tables
 *  (DAY_PLAYBOOK + SESSIONS_INTEL) plus the live spine-resolved session
 *  state; the panel composes the three archio layers and handles the
 *  shared day-of-week selection wiring.
 * ─────────────────────────────────────────────────────────────────────── */
export interface ActiveWindowPanelProps {
  /** Static day-of-week playbook table, keyed 1..5 = Mon..Fri. */
  dayPlaybookByDow: Record<number, DayPlaybookData>
  /** Live, spine-resolved active session. */
  activeSession: SessionDefLite
  /** Live, spine-resolved current micro-phase. */
  activePhase: MicroPhaseLite
  /** Live 0..1 progress through the active session. */
  progress: number
  /** Minutes elapsed in the active session. */
  elapsedMin: number
  /** Minutes remaining in the active session. */
  remainingMin: number
  /** Chronological list of all sessions in a trading day. */
  allSessions: SessionDefLite[]
  /** Default day-of-week for the playbook canvas if the
   *  DaySelectionProvider isn't mounted (e.g. weekends). */
  defaultDow?: number
}

export function ActiveWindowPanel({
  dayPlaybookByDow,
  activeSession,
  activePhase,
  progress,
  elapsedMin,
  remainingMin,
  allSessions,
  defaultDow,
}: ActiveWindowPanelProps) {
  /* ── Spine ─────────────────────────────────────────────────────────── */
  const { now, liveDow, utcClock } = useUTCClock()

  /* The "market is open" rule used by the temporal rail: live weekday
   *  (Mon..Fri) AND not the OFF session. */
  const isMarketOpen = activeSession.key !== "OFF" && liveDow >= 1 && liveDow <= 5

  /* ── Day selection · shared with the left card's 7-day grid ────────── */
  const sel = useDaySelection()
  const fallbackDow = defaultDow ?? (liveDow >= 1 && liveDow <= 5 ? liveDow : 2)
  const selectedDow = sel ? sel.selectedDow : fallbackDow
  const setSelectedDow = (d: number) => {
    if (sel) sel.setSelectedDow(d)
  }

  /* The day-playbook accent — used for the section seam color between
   *  the canvas and the dossier. */
  const playbook = dayPlaybookByDow[selectedDow] ?? dayPlaybookByDow[2]
  const playbookAccent =
    playbook?.quality === "high"   ? VANTARY.amber :
    playbook?.quality === "medium" ? VANTARY.paper :
                                     VANTARY.paperDim

  const reducedMotion = useReducedMotion() ?? false

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {/* ─── LAYER A · TEMPORAL ANCHOR RAIL ─── */}
      <TemporalAnchorRail
        now={now}
        liveDow={liveDow}
        utcClock={utcClock}
        isMarketOpen={isMarketOpen}
        reduced={reducedMotion}
      />

      {/* ─── LAYER B · DAY PLAYBOOK CANVAS ─── */}
      <DayPlaybookCanvas
        selectedDow={selectedDow}
        liveDow={liveDow}
        playbookByDow={dayPlaybookByDow}
        onSelectDow={setSelectedDow}
      />

      {/* Section seam — visually marks the boundary between "what kind
          of day" and "what's live right now". */}
      <ArchioSeam accent={playbookAccent} reduced={reducedMotion} marginY={6} />

      {/* ─── LAYER C · ACTIVE WINDOW DOSSIER ─── */}
      <ActiveWindowDossier
        liveSession={activeSession}
        livePhase={activePhase}
        liveProgress={progress}
        elapsedMin={elapsedMin}
        remainingMin={remainingMin}
        utcClock={utcClock}
        allSessions={allSessions}
      />
    </div>
  )
}
