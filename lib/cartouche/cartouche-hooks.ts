"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · LIVING CARTOUCHE — foundation hooks
   ───────────────────────────────────────────────────────────────────────────
   Primitive hooks the gadgets share. Kept primitive and pure so each
   gadget can compose them without inheritance.

     useFaceRotation        — cycles faces with hover-pause, manual nav, reduced-motion
     useFaceKeyboardNav     — ←/→/Home/End/digit nav helpers for the face strip
     useCountUp             — count-up animation (used on entry)
     useRealtimeCountdown   — ticks down toward a target Date
     useNumberJitter        — tape-feel micro-flicker around a base value
     useReducedMotion       — SSR-safe prefers-reduced-motion query
     usePageVisibility      — true if tab is visible; gates the rotation loop
     useCartouchePauseAll   — global pause toggle (localStorage-backed)
     useWallClock           — trader-desk wall clock (1-second tick)
     useGlobalHotkey        — document-level shortcut with input-field guard

   Every interval in this module uses a PAIRWISE IRRATIONAL decimal — 5.4,
   5.7, 6.0, 6.2, 6.7, 7.1, 8.6 etc — so different gadgets never
   synchronise visually across the cartouche.
   ═══════════════════════════════════════════════════════════════════════════ */

import type React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

/* ────────────────────────────────────────────────────────────────────────
   Reduced-motion gate
   ──────────────────────────────────────────────────────────────────────── */

/** SSR-safe `prefers-reduced-motion` query. Defaults to false on the
 *  server so the first paint matches the most common (motion-enabled)
 *  user. The client-side useEffect updates on hydrate. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener?.("change", onChange)
    return () => mq.removeEventListener?.("change", onChange)
  }, [])
  return reduced
}

/* ────────────────────────────────────────────────────────────────────────
   usePageVisibility — pause everything when the tab is hidden
   ────────────────────────────────────────────────────────────────────────
   Saves CPU/battery on backgrounded tabs. The face rotation loop checks
   `visible` and skips ticks if false. Defaults to true on SSR.
   ──────────────────────────────────────────────────────────────────────── */
export function usePageVisibility(): boolean {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    if (typeof document === "undefined") return
    const update = () => setVisible(!document.hidden)
    update()
    document.addEventListener("visibilitychange", update)
    return () => document.removeEventListener("visibilitychange", update)
  }, [])
  return visible
}

/* ────────────────────────────────────────────────────────────────────────
   useCartouchePauseAll — global pause toggle (localStorage-backed)
   ────────────────────────────────────────────────────────────────────────
   Wired to the command-bar button. When `paused` is true, every gadget's
   face rotation freezes on its current face. Setting cross-tab broadcasts
   via the `storage` event so multiple tabs stay in sync.
   ──────────────────────────────────────────────────────────────────────── */
const PAUSE_KEY = "vantary:cartouche-pause-all"

export function useCartouchePauseAll() {
  const [paused, setPausedState] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = window.localStorage.getItem(PAUSE_KEY)
      if (raw === "1") setPausedState(true)
    } catch { /* swallow */ }

    const onStorage = (e: StorageEvent) => {
      if (e.key === PAUSE_KEY) setPausedState(e.newValue === "1")
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const setPaused = useCallback((next: boolean) => {
    setPausedState(next)
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(PAUSE_KEY, next ? "1" : "0")
    } catch { /* quota */ }
  }, [])

  const toggle = useCallback(() => setPaused(!paused), [paused, setPaused])

  return { paused, setPaused, toggle } as const
}

/* ────────────────────────────────────────────────────────────────────────
   useFaceRotation — the spine of every living gadget
   ──────────────────────────────────────────────────────────────────────── */

export interface FaceRotationOptions {
  /** Default interval if a face doesn't supply one. Pairwise irrational. */
  baseInterval?: number
  /** Per-face interval overrides, in ms. Same length as `faces`. */
  perFaceInterval?: readonly number[]
  /** Pause rotation while mouse is over the gadget. Default true. */
  pauseOnHover?: boolean
  /** After manual nav, suspend auto-rotate for this many ms. Default 8000. */
  manualResumeAfterMs?: number
  /** A stable id (gadget name) used for the random-phase offset. */
  phaseSeed?: string
  /** External pause signal (e.g. the global pause-all toggle). */
  externalPause?: boolean
}

export interface FaceRotationApi {
  /** Currently displayed face index. */
  index: number
  /** Move to the next face manually (resets the manual-suspend timer). */
  next: () => void
  /** Move to a specific face manually. */
  goTo: (i: number) => void
  /** True while the mouse is over the gadget. */
  hovered: boolean
  /** True if reduced-motion is on (gadget should freeze on face 0). */
  reducedMotion: boolean
  /** Wire to the gadget's outer wrapper. */
  bind: {
    onMouseEnter: () => void
    onMouseLeave: () => void
  }
}

/** Compute a deterministic phase offset (0…1) from a seed string. Same
 *  seed → same offset, so gadgets keep their stagger across renders. */
function seedPhase(seed: string | undefined): number {
  if (!seed) return 0
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  return Math.abs(h % 1000) / 1000
}

/**
 * Cycle through `faceCount` faces, honouring hover-pause, manual
 * navigation, and reduced-motion.
 */
export function useFaceRotation(
  faceCount: number,
  opts: FaceRotationOptions = {},
): FaceRotationApi {
  const {
    baseInterval         = 5400,
    perFaceInterval,
    pauseOnHover         = true,
    manualResumeAfterMs  = 8000,
    phaseSeed,
    externalPause        = false,
  } = opts

  const reducedMotion = useReducedMotion()
  const visible       = usePageVisibility()
  const [index, setIndex]   = useState(0)
  const [hovered, setHover] = useState(false)
  const manualSuspendUntil  = useRef<number>(0)
  const phase               = useMemo(() => seedPhase(phaseSeed), [phaseSeed])

  /* Auto-rotate timer · gated on: reduced-motion / single face / hover /
     external pause-all / page visibility. */
  useEffect(() => {
    if (reducedMotion)            return
    if (faceCount <= 1)            return
    if (hovered && pauseOnHover)   return
    if (externalPause)             return
    if (!visible)                  return

    const interval = perFaceInterval?.[index] ?? baseInterval
    /* First-cycle offset: ~12% of interval × seedPhase, so different
       gadgets begin their stagger out of phase. */
    const offset = index === 0 ? interval * 0.12 * phase : 0

    const id = window.setTimeout(() => {
      if (Date.now() < manualSuspendUntil.current) return
      setIndex((i) => (i + 1) % faceCount)
    }, interval + offset)

    return () => window.clearTimeout(id)
  }, [
    reducedMotion, faceCount, hovered, pauseOnHover,
    index, baseInterval, perFaceInterval, phase,
    externalPause, visible,
  ])

  const next = useCallback(() => {
    manualSuspendUntil.current = Date.now() + manualResumeAfterMs
    setIndex((i) => (i + 1) % Math.max(1, faceCount))
  }, [faceCount, manualResumeAfterMs])

  const goTo = useCallback(
    (i: number) => {
      manualSuspendUntil.current = Date.now() + manualResumeAfterMs
      setIndex(Math.max(0, Math.min(faceCount - 1, i)))
    },
    [faceCount, manualResumeAfterMs],
  )

  const bind = useMemo(
    () => ({
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
    }),
    [],
  )

  /* Reduced-motion → always face 0 */
  useEffect(() => {
    if (reducedMotion) setIndex(0)
  }, [reducedMotion])

  return { index, next, goTo, hovered, reducedMotion, bind }
}

/* ────────────────────────────────────────────────────────────────────────
   useFaceKeyboardNav — keyboard map for the face-dot strip
   ────────────────────────────────────────────────────────────────────────
   Wires ←/→ to prev/next, Home/End to first/last, and digit keys 1..n to
   jump directly. Returned `onKeyDown` should be spread on the focusable
   wrapper (LivingGadget container is `tabIndex={0}`).
   ──────────────────────────────────────────────────────────────────────── */

export function useFaceKeyboardNav(
  faceCount: number,
  api: Pick<FaceRotationApi, "index" | "goTo">,
) {
  return useCallback(
    (e: React.KeyboardEvent) => {
      if (faceCount <= 1) return
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault()
          api.goTo((api.index + 1) % faceCount)
          return
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault()
          api.goTo((api.index - 1 + faceCount) % faceCount)
          return
        case "Home":
          e.preventDefault()
          api.goTo(0)
          return
        case "End":
          e.preventDefault()
          api.goTo(faceCount - 1)
          return
      }
      /* Digit shortcuts: 1..faceCount (1-based) */
      if (/^[1-9]$/.test(e.key)) {
        const n = Number(e.key) - 1
        if (n < faceCount) {
          e.preventDefault()
          api.goTo(n)
        }
      }
    },
    [faceCount, api],
  )
}

/* ────────────────────────────────────────────────────────────────────────
   useCountUp — animate a numeric value from start → target
   ──────────────────────────────────────────────────────────────────────── */

export interface CountUpOptions {
  /** Animation duration in ms. Default 1400. */
  durationMs?: number
  /** Easing curve (Framer-Motion compatible). Default `easeOut`. */
  easing?: (t: number) => number
  /** When the count finishes, snap to exactly `target`. Default true. */
  snapAtEnd?: boolean
  /** Decimal places to round to during animation. Default 0. */
  decimals?: number
  /** Re-run the animation when `target` changes (vs. just snap). Default false. */
  restartOnTargetChange?: boolean
}

/** Standard easeOut cubic — good default for "settling" numerics. */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/** Animate a number from 0 → `target` over `durationMs`. Returns the
 *  current displayed value. Honours reduced-motion (snaps to target). */
export function useCountUp(target: number, opts: CountUpOptions = {}): number {
  const {
    durationMs   = 1400,
    easing       = easeOutCubic,
    snapAtEnd    = true,
    decimals     = 0,
    restartOnTargetChange = false,
  } = opts

  const reducedMotion = useReducedMotion()
  const [value, setValue] = useState(reducedMotion ? target : 0)
  const startedAt = useRef<number | null>(null)
  const rafId     = useRef<number | null>(null)
  const fromValue = useRef<number>(0)

  useEffect(() => {
    if (reducedMotion) {
      setValue(target)
      return
    }
    fromValue.current = restartOnTargetChange ? 0 : value
    startedAt.current = null

    const tick = (now: number) => {
      if (startedAt.current === null) startedAt.current = now
      const elapsed = now - startedAt.current
      const t       = Math.min(1, elapsed / durationMs)
      const eased   = easing(t)
      const v       = fromValue.current + (target - fromValue.current) * eased
      const rounded = Number(v.toFixed(decimals))
      setValue(rounded)
      if (t < 1) rafId.current = requestAnimationFrame(tick)
      else if (snapAtEnd) setValue(target)
    }
    rafId.current = requestAnimationFrame(tick)
    return () => {
      if (rafId.current != null) cancelAnimationFrame(rafId.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, reducedMotion])

  return value
}

/* ────────────────────────────────────────────────────────────────────────
   useRealtimeCountdown — count down to a target date
   ──────────────────────────────────────────────────────────────────────── */

export interface RealtimeCountdown {
  totalMs: number
  days:    number
  hours:   number
  minutes: number
  seconds: number
  /** True if the target is in the past. */
  done: boolean
}

/** Tick toward `target`. By default, ticks every minute. When the
 *  countdown drops under `secondsThresholdMs` (default 24h), the tick
 *  rate switches to 1s so the seconds digit visibly rolls. */
export function useRealtimeCountdown(
  target: Date | number,
  opts: { secondsThresholdMs?: number } = {},
): RealtimeCountdown {
  const { secondsThresholdMs = 24 * 60 * 60 * 1000 } = opts
  const targetMs = typeof target === "number" ? target : target.getTime()
  const [now, setNow] = useState<number>(() => Date.now())

  useEffect(() => {
    const update = () => setNow(Date.now())
    update()
    /* Choose tick rate based on remaining time. */
    const remaining = targetMs - Date.now()
    const tickMs    = remaining <= secondsThresholdMs ? 1000 : 60_000

    const id = window.setInterval(update, tickMs)
    return () => window.clearInterval(id)
  }, [targetMs, secondsThresholdMs])

  const totalMs = Math.max(0, targetMs - now)
  const totalSec = Math.floor(totalMs / 1000)
  const days    = Math.floor(totalSec / 86400)
  const hours   = Math.floor((totalSec % 86400) / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60

  return { totalMs, days, hours, minutes, seconds, done: totalMs === 0 }
}

/* ────────────────────────────────────────────────────────────────────────
   useWallClock — trader-desk wall clock (ticks once per second)
   ────────────────────────────────────────────────────────────────────────
   Returns the current Date, refreshed once per second. Honours
   reduced-motion (freezes after first read) and page-visibility
   (skips ticks when the tab is hidden — saves CPU/battery).
   ──────────────────────────────────────────────────────────────────────── */
export function useWallClock(): Date {
  const reducedMotion = useReducedMotion()
  const visible       = usePageVisibility()
  const [now, setNow] = useState<Date>(() => new Date())

  useEffect(() => {
    if (reducedMotion) return
    if (!visible)      return
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [reducedMotion, visible])

  return now
}

/* ────────────────────────────────────────────────────────────────────────
   useGlobalHotkey — document-level keyboard binding (with input guard)
   ────────────────────────────────────────────────────────────────────────
   Binds a single-key shortcut on `document.body`, while IGNORING events
   that originate from form inputs, textareas, contenteditable regions,
   or any element with `data-no-hotkey="true"`. Useful for the cartouche
   command bar's `p`/`r` shortcuts.
   ──────────────────────────────────────────────────────────────────────── */
export interface GlobalHotkeyBinding {
  /** `event.key` to match. Case-insensitive. Example: "p" or "Escape". */
  key: string
  /** Require Shift to be held. */
  shift?: boolean
  /** Require Alt/Option to be held. */
  alt?: boolean
  /** Require Cmd (mac) or Ctrl (win). */
  meta?: boolean
  /** Handler. Called only when all modifier flags match. */
  handler: (e: KeyboardEvent) => void
  /** Disable temporarily without unmounting. */
  disabled?: boolean
}

export function useGlobalHotkey(binding: GlobalHotkeyBinding) {
  const { key, shift = false, alt = false, meta = false, handler, disabled = false } = binding

  useEffect(() => {
    if (disabled) return
    if (typeof document === "undefined") return

    const onKey = (e: KeyboardEvent) => {
      /* Don't swallow keystrokes the user is typing into a form. */
      const target = e.target as HTMLElement | null
      if (target) {
        const tag = target.tagName
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          target.isContentEditable ||
          target.closest?.('[data-no-hotkey="true"]')
        ) return
      }
      /* Match the key (case-insensitive) and the required modifiers. */
      if (e.key.toLowerCase() !== key.toLowerCase()) return
      if (!!e.shiftKey !== shift) return
      if (!!e.altKey   !== alt)   return
      const hasMeta = e.metaKey || e.ctrlKey
      if (!!hasMeta    !== meta)  return
      handler(e)
    }

    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [key, shift, alt, meta, handler, disabled])
}

/* ────────────────────────────────────────────────────────────────────────
   useNumberJitter — tape-feel micro-flicker
   ──────────────────────────────────────────────────────────────────────── */

export interface NumberJitterOptions {
  /** ±range applied around base. */
  range: number
  /** Tick interval in ms. Default 2600 (irrational). */
  intervalMs?: number
  /** Decimal precision for the jittered value. Default 0. */
  decimals?: number
  /** Disable jitter (e.g. when off-screen). Default false. */
  paused?: boolean
}

/** Returns a value that randomly jitters ±range around `base` every
 *  `intervalMs`. Honours reduced-motion (returns base). */
export function useNumberJitter(
  base: number,
  opts: NumberJitterOptions,
): number {
  const { range, intervalMs = 2600, decimals = 0, paused = false } = opts
  const reducedMotion = useReducedMotion()
  const [v, setV] = useState(base)

  useEffect(() => {
    setV(base)
  }, [base])

  useEffect(() => {
    if (reducedMotion || paused) return
    const id = window.setInterval(() => {
      const drift = (Math.random() * 2 - 1) * range
      const next  = Number((base + drift).toFixed(decimals))
      setV(next)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [base, range, intervalMs, decimals, reducedMotion, paused])

  return reducedMotion ? base : v
}
