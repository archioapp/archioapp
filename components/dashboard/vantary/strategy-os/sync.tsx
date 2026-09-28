"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  STRATEGY OS · DAY-SYNC BRIDGE  (EPIC H · H1)
 *  ─────────────────────────────────────────────────────────────────────────
 *  Two day-of-week stores live on this page:
 *
 *    1. <DaySelectionProvider>  ·  the legacy "which day are we looking at"
 *       store, used by the LEFT-card week-stations grid and the RIGHT-card
 *       Day Playbook panel. Shape: { selectedDow, setSelectedDow }.
 *
 *    2. <StrategyOsProvider>    ·  the OS state store, with its own
 *       state.selectedDow that drives the Discipline Mirror's selected
 *       cell, the Capital Exposure Map's DAY stratum highlight, and any
 *       OS surface that responds to "the day in focus".
 *
 *  Without a bridge, those two stores drift: a user clicks WED on the
 *  week-stations tile and the OS Mirror still highlights MON. <OsDaySync/>
 *  is the invisible mediator that subscribes to both and mirrors changes
 *  in either direction — with explicit loop protection so a write from
 *  one side doesn't bounce back as a write from the other.
 *
 *  Mount: anywhere inside <StrategyOsProvider> (which is itself inside
 *  <DaySelectionProvider>). Renders nothing.
 *
 *  Loop protection strategy
 *  ────────────────────────
 *  We do NOT compare values inside an effect and write — that race-
 *  conditions on the first render and can cause double-writes. Instead we
 *  remember the *last value we wrote* on each side. If the next observed
 *  value matches what we just wrote, we skip the propagation (it's our
 *  own echo). If it differs, we propagate.
 * ═══════════════════════════════════════════════════════════════════════ */

import { memo, useEffect, useRef } from "react"
import { useDaySelection } from "../clock-spine"
import { useStrategyOs }   from "./provider"

export const OsDaySync = memo(function OsDaySync() {
  // Both stores. `useDaySelection()` may legitimately return null if the
  // bridge ever mounts outside its provider — we no-op cleanly.
  const sel = useDaySelection()
  const { state, actions } = useStrategyOs()

  // Echo-suppression refs: the last value WE wrote to each side. If the
  // next observed value matches this, we know it's our own echo and we
  // skip propagation. Initialised to a sentinel that can never match a
  // valid dow.
  const lastWroteToLegacy = useRef<number | null>(NaN as unknown as number)
  const lastWroteToOs     = useRef<number | null>(NaN as unknown as number)

  /* ── LEGACY → OS ─────────────────────────────────────────────────
     When DaySelectionProvider's selectedDow changes (e.g. user clicked a
     week-station tile), reflect it into the OS store unless it's our
     own echo. */
  useEffect(() => {
    if (!sel) return
    const next = sel.selectedDow
    if (next === lastWroteToLegacy.current) {
      // Our echo — clear the marker and don't propagate.
      lastWroteToLegacy.current = NaN as unknown as number
      return
    }
    if (next === state.selectedDow) return
    lastWroteToOs.current = next
    actions.selectDow(next)
  }, [sel?.selectedDow])  // eslint-disable-line react-hooks/exhaustive-deps

  /* ── OS → LEGACY ─────────────────────────────────────────────────
     When state.selectedDow changes (e.g. user clicked a Mirror cell),
     reflect into the legacy provider unless it's our own echo. */
  useEffect(() => {
    if (!sel) return
    const next = state.selectedDow
    if (next == null) return  // OS allows null; legacy doesn't represent that
    if (next === lastWroteToOs.current) {
      lastWroteToOs.current = NaN as unknown as number
      return
    }
    if (next === sel.selectedDow) return
    lastWroteToLegacy.current = next
    sel.setSelectedDow(next)
  }, [state.selectedDow])  // eslint-disable-line react-hooks/exhaustive-deps

  return null
})
