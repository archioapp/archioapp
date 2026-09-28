"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  CLOCK SPINE  ·  shared real-time provider tree for the Vantary surface
 *  ─────────────────────────────────────────────────────────────────────────
 *  This module is the canonical home for the page-wide ticking clock that
 *  every Vantary panel subscribes to. Originally five separate components
 *  on the YourSpace dashboard each ran their own setInterval — the cognitive
 *  arc, the market intel console, the day playbook tabs, the countdown
 *  popovers, and the week stations grid. They drifted by seconds and burned
 *  five renders per minute when one was enough. This module replaces all
 *  five with a single provider tree:
 *
 *      <ClockSpineProvider>            ← minute-tick (60s, boundary-aligned)
 *        <SecondClockProvider>         ← second-tick (1s, only when consumed)
 *          <DaySelectionProvider>      ← shared selected day-of-week
 *            <YourPage />
 *          </DaySelectionProvider>
 *        </SecondClockProvider>
 *      </ClockSpineProvider>
 *
 *  Hooks:
 *    useUTCClock()         → minute-resolution snapshot (now, utcH, utcM,
 *                            nowH, liveDow, utcClock).  Falls back to a local
 *                            interval if no provider is mounted.
 *    useUTCSecondClock()   → second-resolution Date for countdown popovers.
 *                            Same fallback semantics.
 *    useDaySelection()     → `[selectedDow, setSelectedDow]` shared between
 *                            any two cards that want to lock-step on a
 *                            day-of-week selection.  Returns `null` if no
 *                            provider is mounted (caller falls back to local
 *                            state).
 *
 *  Designed for cross-system reuse — SignalTerminal, Briefing Card, Vantary
 *  Oracle, and any future panel that needs synchronised time.
 * ═══════════════════════════════════════════════════════════════════════ */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

/* ───── Minute-clock context ─────────────────────────────────────────────── */

export type MinuteClockSnapshot = {
  /** Live UTC `Date` instance, refreshed once per minute. */
  now: Date
  /** Hours component (0..23) of `now`, in UTC. */
  utcH: number
  /** Minutes component (0..59) of `now`, in UTC. */
  utcM: number
  /** Decimal hour (e.g. 14.5 for 14:30). Useful for session math. */
  nowH: number
  /** Day-of-week (0=Sun..6=Sat) of `now`, in UTC. */
  liveDow: number
  /** "HH:MM" string for headers and chips. */
  utcClock: string
}

const MinuteClockContext = createContext<MinuteClockSnapshot | null>(null)

function buildMinuteSnapshot(d: Date): MinuteClockSnapshot {
  const utcH = d.getUTCHours()
  const utcM = d.getUTCMinutes()
  return {
    now: d,
    utcH,
    utcM,
    nowH: utcH + utcM / 60,
    liveDow: d.getUTCDay(),
    utcClock: `${utcH.toString().padStart(2, "0")}:${utcM.toString().padStart(2, "0")}`,
  }
}

/**
 * Page-wide minute-tick clock.
 *
 * Aligns the first tick to the next minute boundary so every consumer
 * snaps to the same instant, then runs a steady 60-second interval
 * thereafter. Mount once near the application root (above any consumer
 * of `useUTCClock`).
 */
export function ClockSpineProvider({
  children,
  initialNow,
}: {
  children: ReactNode
  /** Epoch ms stamped by the server render. Seeds the FIRST snapshot on
   *  both server and client so hydration compares identical clocks; the
   *  mount effect immediately re-ticks to the real client time. Without
   *  it, server and client each call `new Date()` seconds apart and every
   *  time-derived text node mismatches. */
  initialNow?: number
}) {
  const [snap, setSnap] = useState<MinuteClockSnapshot>(() =>
    buildMinuteSnapshot(initialNow != null ? new Date(initialNow) : new Date()),
  )

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let intervalId: ReturnType<typeof setInterval> | null = null

    const tick = () => setSnap(buildMinuteSnapshot(new Date()))
    const startInterval = () => {
      tick()
      intervalId = setInterval(tick, 60_000)
    }

    // Snap from the server-stamped seed to the live client clock right away.
    if (initialNow != null) tick()

    const d = new Date()
    const msToNextMin = 60_000 - (d.getSeconds() * 1000 + d.getMilliseconds())
    timeoutId = setTimeout(startInterval, msToNextMin)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed is read once on mount
  }, [])

  return (
    <MinuteClockContext.Provider value={snap}>
      {children}
    </MinuteClockContext.Provider>
  )
}

/* ───── Second-clock context (lazy) ──────────────────────────────────────── */

type SecondClockSnapshot = { now: Date }
const SecondClockContext = createContext<SecondClockSnapshot | null>(null)

/**
 * Page-wide second-tick clock for countdown popovers and live timers.
 *
 * Mount inside `<ClockSpineProvider>` so countdowns can co-render with
 * minute-resolution data. If you only need minute-precision data, omit
 * this provider entirely — `useUTCSecondClock` will fall back to a local
 * interval per consumer.
 */
export function SecondClockProvider({
  children,
  initialNow,
}: {
  children: ReactNode
  /** Server-stamped epoch ms — see `ClockSpineProvider.initialNow`. */
  initialNow?: number
}) {
  const [snap, setSnap] = useState<SecondClockSnapshot>(() => ({
    now: initialNow != null ? new Date(initialNow) : new Date(),
  }))
  useEffect(() => {
    // Leave the server seed behind as soon as we're mounted, then tick.
    if (initialNow != null) setSnap({ now: new Date() })
    const id = setInterval(() => setSnap({ now: new Date() }), 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed is read once on mount
  }, [])
  return (
    <SecondClockContext.Provider value={snap}>
      {children}
    </SecondClockContext.Provider>
  )
}

/* ───── Day-selection context (cross-card sync) ──────────────────────────── */

export type DaySelectionAPI = {
  /** Currently selected day-of-week (0=Sun..6=Sat). */
  selectedDow: number
  /** Update the selected day-of-week. Both consumers re-render in lock-step. */
  setSelectedDow: (dow: number) => void
}
const DaySelectionContext = createContext<DaySelectionAPI | null>(null)

/**
 * Shared `selectedDow` between two or more cards that want lock-step
 * day-of-week selection. Initialises to today (UTC) with a Tuesday
 * fallback on weekends so demo dashboards remain narratively rich.
 */
export function DaySelectionProvider({
  children,
  initialDow,
  initialNow,
}: {
  children: ReactNode
  /** Override the initial day-of-week. Useful for testing. */
  initialDow?: number
  /** Server-stamped epoch ms — see `ClockSpineProvider.initialNow`. */
  initialNow?: number
}) {
  const initial =
    initialDow ??
    (() => {
      const d = (initialNow != null ? new Date(initialNow) : new Date()).getUTCDay()
      return d >= 1 && d <= 5 ? d : 2
    })()
  const [selectedDow, setSelectedDow] = useState<number>(initial)
  const api = useMemo<DaySelectionAPI>(
    () => ({ selectedDow, setSelectedDow }),
    [selectedDow],
  )
  return (
    <DaySelectionContext.Provider value={api}>
      {children}
    </DaySelectionContext.Provider>
  )
}

/* ───── Hooks ────────────────────────────────────────────────────────────── */

/**
 * Read the page-wide minute-tick clock.
 *
 * If a `<ClockSpineProvider>` is mounted above this hook, the consumer is
 * effectively free — every other consumer shares the same snapshot. If no
 * provider is found, the hook spins up its own local 60-second interval as
 * a graceful fallback so the file remains importable in isolation tests.
 */
export function useUTCClock(): MinuteClockSnapshot {
  const ctx = useContext(MinuteClockContext)
  // Always-call-the-same-hooks rule: keep this state regardless of whether
  // we use it. We just skip the interval if the context is doing the work.
  const [fallback, setFallback] = useState<MinuteClockSnapshot>(() =>
    buildMinuteSnapshot(new Date()),
  )
  useEffect(() => {
    if (ctx) return // provider exists — nothing to do
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let intervalId: ReturnType<typeof setInterval> | null = null
    const tick = () => setFallback(buildMinuteSnapshot(new Date()))
    const d = new Date()
    const msToNextMin = 60_000 - (d.getSeconds() * 1000 + d.getMilliseconds())
    timeoutId = setTimeout(() => {
      tick()
      intervalId = setInterval(tick, 60_000)
    }, msToNextMin)
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [ctx])
  return ctx ?? fallback
}

/**
 * Read the page-wide second-tick clock used by countdown popovers.
 * Falls back to a local 1-second interval if no provider is mounted.
 */
export function useUTCSecondClock(): Date {
  const ctx = useContext(SecondClockContext)
  const [fallback, setFallback] = useState<Date>(() => new Date())
  useEffect(() => {
    if (ctx) return
    const id = setInterval(() => setFallback(new Date()), 1000)
    return () => clearInterval(id)
  }, [ctx])
  return ctx?.now ?? fallback
}

/**
 * Read the shared day-of-week selection.
 *
 * Returns `null` if no `<DaySelectionProvider>` is mounted — callers can
 * cleanly fall back to local state (useful for standalone usage of a
 * panel outside the dashboard root).
 */
export function useDaySelection(): DaySelectionAPI | null {
  return useContext(DaySelectionContext)
}
