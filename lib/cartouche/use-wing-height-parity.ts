"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · WING HEIGHT PARITY (the 4-state contract)
   ───────────────────────────────────────────────────────────────────────────
   Both cartouche wings must always render at the SAME pixel height in every
   Ask Vantary state. Independent intrinsic heights produce the "empty
   cathedral" feel — one wing fills, the other has a vacuum strip below it.

   The contract:

     · `state === "idle"`  → measure both wings via ResizeObserver, take
                              max(left, right), debounce-publish as locked
                              height.
     · state ≠ idle        → the locked height is FROZEN. We never re-measure
                              while the wings are transform-scaled, because
                              transforms do not change layout box but COULD
                              report different scrollHeights under some
                              browsers, and that would jitter the locked
                              height mid-animation.

   The hook returns refs to attach to each wing's outer container plus
   the current locked height. The caller is responsible for passing the
   current AskVantaryState in.

   Edge cases handled:
     · First paint: lockedHeight is undefined → wings render `height: auto`.
     · Window resize, font load, content swap: ResizeObserver retriggers.
     · Rapid state thrash: only `idle` state with a 300ms quiet window
       publishes new heights. Otherwise the previous lock stands.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useRef, useState } from "react"
import type { AskVantaryState } from "@/components/dashboard/vantary/cartouche/ask-vantary-state-context"

/* ────────────────────────────────────────────────────────────────────────
   Public hook API
   ──────────────────────────────────────────────────────────────────────── */
export interface WingHeightParityApi {
  /** Attach to the left wing's outer container. */
  leftRef:      React.RefCallback<HTMLDivElement | null>
  /** Attach to the right wing's outer container. */
  rightRef:     React.RefCallback<HTMLDivElement | null>
  /** Locked pixel height to apply to both wings. `null` on first paint. */
  lockedHeight: number | null
  /** Force-recompute now (useful on template swap). */
  remeasure:    () => void
}

/* ────────────────────────────────────────────────────────────────────────
   useWingHeightParity
   ──────────────────────────────────────────────────────────────────────── */
export function useWingHeightParity(
  state: AskVantaryState,
  opts: { debounceMs?: number; enabled?: boolean } = {},
): WingHeightParityApi {
  const { debounceMs = 300, enabled = true } = opts

  const [lockedHeight, setLockedHeight] = useState<number | null>(null)

  /* Mirror state into a ref so the ResizeObserver callback always reads
     the latest state without re-creating its subscription. */
  const stateRef = useRef<AskVantaryState>(state)
  useEffect(() => { stateRef.current = state }, [state])

  /* Per-wing element refs + their intrinsic heights. */
  const leftEl  = useRef<HTMLDivElement | null>(null)
  const rightEl = useRef<HTMLDivElement | null>(null)
  const leftH   = useRef<number>(0)
  const rightH  = useRef<number>(0)

  /* ── Debounced publish — only when state is "idle" ───────────────── */
  const publishTimer = useRef<number | null>(null)
  const schedulePublish = useCallback(() => {
    if (publishTimer.current != null) window.clearTimeout(publishTimer.current)
    publishTimer.current = window.setTimeout(() => {
      publishTimer.current = null
      if (stateRef.current !== "idle") return
      const next = Math.max(leftH.current, rightH.current)
      if (next <= 0) return
      setLockedHeight((prev) => (prev === next ? prev : next))
    }, debounceMs)
  }, [debounceMs])

  /* ── ResizeObserver wired to both wings ───────────────────────────── */
  const observerRef = useRef<ResizeObserver | null>(null)

  const ensureObserver = useCallback(() => {
    if (typeof ResizeObserver === "undefined") return null
    if (observerRef.current) return observerRef.current
    observerRef.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        /* offsetHeight is more reliable than border-box reporting in some
           browsers — we read it directly from the observed element. */
        const el = entry.target as HTMLElement
        if (el === leftEl.current)  leftH.current  = el.offsetHeight
        if (el === rightEl.current) rightH.current = el.offsetHeight
      }
      schedulePublish()
    })
    return observerRef.current
  }, [schedulePublish])

  /* ── Re-observe when refs change ──────────────────────────────────── */
  const attach = useCallback(
    (which: "left" | "right") => (node: HTMLDivElement | null) => {
      const obs = ensureObserver()
      if (!obs) return
      if (which === "left") {
        if (leftEl.current && leftEl.current !== node) obs.unobserve(leftEl.current)
        leftEl.current = node
        if (node) {
          /* Seed the current intrinsic height immediately so the first
             measurement doesn't wait for the next mutation. */
          leftH.current = node.offsetHeight
          obs.observe(node)
        }
      } else {
        if (rightEl.current && rightEl.current !== node) obs.unobserve(rightEl.current)
        rightEl.current = node
        if (node) {
          rightH.current = node.offsetHeight
          obs.observe(node)
        }
      }
      schedulePublish()
    },
    [ensureObserver, schedulePublish],
  )

  const leftRef  = useCallback(attach("left"),  [attach])
  const rightRef = useCallback(attach("right"), [attach])

  /* ── Cleanup ──────────────────────────────────────────────────────── */
  useEffect(() => () => {
    if (publishTimer.current != null) window.clearTimeout(publishTimer.current)
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
  }, [])

  /* ── Disable path ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (!enabled) setLockedHeight(null)
  }, [enabled])

  /* ── Re-publish when state returns to idle (re-arms the measurement) ── */
  useEffect(() => {
    if (state === "idle") schedulePublish()
  }, [state, schedulePublish])

  /* ── Imperative remeasure for caller-driven moments ──────────────── */
  const remeasure = useCallback(() => {
    if (leftEl.current)  leftH.current  = leftEl.current.offsetHeight
    if (rightEl.current) rightH.current = rightEl.current.offsetHeight
    schedulePublish()
  }, [schedulePublish])

  return { leftRef, rightRef, lockedHeight, remeasure }
}
