"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION CONSOLE · MOTION VOCABULARY  (Phase 4 — Unified Ticket)
 *  ─────────────────────────────────────────────────────────────────────────
 *  ONE shared interaction grammar for the unified Execution Ticket + the Fast
 *  Entry bottom bar, so every hover, press, reveal, and value-change across the
 *  cockpit feels like the same instrument. TradeLocker-smooth means: fast IN,
 *  slow OUT (the "breath"), tactile press, and numbers that flash — never
 *  reflow — when they change.
 *
 *  Design law:
 *    · Rest      — 100% opacity, 0 translate, hairline border.
 *    · Hover     — 120ms ease-out "breath in": +accent border, faint wash,
 *                  −1px lift (cards) / 1.015 scale (pills), soft 1px ring.
 *    · Leave     — 260ms ease-out "breath out" (slower settle, never snaps).
 *    · Press     — 90ms scale 0.97, wash deepens.
 *    · Selected  — solid accent border + accent text, persistent (not animated).
 *    · Value     — 200ms accent flash on a digit when a derived number changes.
 *    · Idle      — 2.4s opacity breathe [1 → .78 → 1] on the live pulse/prices.
 *
 *  All transform/opacity loops are gated behind prefers-reduced-motion at the
 *  call site via `useBreath()` / the `reduce` flag — fall back to instant
 *  colour swaps, no transforms.
 *
 *  Pure tokens + tiny hooks. No DOM, no app imports beyond framer-motion/react.
 * ═══════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from "react"
import type { Transition, Variants } from "framer-motion"

/* ─── Durations (seconds) ──────────────────────────────────────────────── */
export const MOTION = {
  in:    0.12,   // breath in  — fast, responsive
  out:   0.26,   // breath out — slow, settling
  press: 0.09,   // tactile
  flash: 0.20,   // value-change accent flash
  reveal: 0.30,  // height/expand reveals
  idle:  2.4,    // idle breathe loop
} as const

/* ─── Easings ──────────────────────────────────────────────────────────── */
export const EASE = {
  out:   [0.16, 1, 0.3, 1] as [number, number, number, number],   // expo-out — the signature settle
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
  std:   [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
} as const

/* ─── Springs ──────────────────────────────────────────────────────────── */
export const SPRING = {
  /** sliding thumbs (order-type tabs, side selector) — snappy but settled. */
  thumb:  { type: "spring", stiffness: 420, damping: 32 } as Transition,
  /** layout reveals (entry field expand, ladder rows) — softer. */
  reveal: { type: "spring", stiffness: 300, damping: 30 } as Transition,
  /** bar / panel position changes — heavier, never jittery. */
  panel:  { type: "spring", stiffness: 260, damping: 34 } as Transition,
} as const

/* ─── Transition presets ───────────────────────────────────────────────── */
export const T = {
  in:     { duration: MOTION.in, ease: EASE.out } as Transition,
  out:    { duration: MOTION.out, ease: EASE.out } as Transition,
  press:  { duration: MOTION.press, ease: EASE.out } as Transition,
  flash:  { duration: MOTION.flash, ease: EASE.out } as Transition,
  reveal: { duration: MOTION.reveal, ease: EASE.out } as Transition,
} as const

/* ─────────────────────────────────────────────────────────────────────────
 *  breatheVariants — the canonical hover/press card variants. `lift` controls
 *  whether it translates (cards) or scales (pills). Accent-coloured ring/wash
 *  is applied at the call site via style since framer can't read CSS vars in
 *  variant values cleanly.
 * ──────────────────────────────────────────────────────────────────────── */
export function makeBreatheVariants(opts: {
  /** "lift" = translateY for cards, "scale" = scale for pills/buttons. */
  kind?: "lift" | "scale"
  reduce?: boolean | null
}): Variants {
  const { kind = "lift", reduce } = opts
  if (reduce) {
    return {
      rest:  { transition: T.out },
      hover: { transition: T.in },
      press: { transition: T.press },
    }
  }
  const hover = kind === "lift" ? { y: -1 } : { scale: 1.015 }
  const press = kind === "lift" ? { y: 0, scale: 0.985 } : { scale: 0.97 }
  return {
    rest:  { y: 0, scale: 1, transition: T.out },
    hover: { ...hover, transition: T.in },
    press: { ...press, transition: T.press },
  }
}

/* ─────────────────────────────────────────────────────────────────────────
 *  idleBreath — the 2.4s opacity loop for "alive" elements (pulse dot, live
 *  prices). Returns props you spread onto a motion element. No-op when reduced.
 * ──────────────────────────────────────────────────────────────────────── */
export function idleBreath(reduce?: boolean | null, range: [number, number] = [1, 0.78]) {
  if (reduce) return { animate: { opacity: 1 } }
  return {
    animate: { opacity: [range[0], range[1], range[0]] },
    transition: { duration: MOTION.idle, repeat: Infinity, ease: EASE.inOut },
  }
}

/* ─────────────────────────────────────────────────────────────────────────
 *  useValueFlash — returns a flash key + tone trigger whenever `value` changes,
 *  so a numeral can briefly tint to its accent then settle. We expose a boolean
 *  `flashing` that pulses true→false; the consumer animates colour from accent
 *  back to its base.
 * ──────────────────────────────────────────────────────────────────────── */
export function useValueFlash(value: number | null | undefined): boolean {
  const [flashing, setFlashing] = useState(false)
  const prev = useRef(value)
  useEffect(() => {
    if (prev.current === value) return
    prev.current = value
    setFlashing(true)
    const id = setTimeout(() => setFlashing(false), MOTION.flash * 1000 + 40)
    return () => clearTimeout(id)
  }, [value])
  return flashing
}

/* ─────────────────────────────────────────────────────────────────────────
 *  useBreath — a tiny stateful helper for hover/press on a single element,
 *  giving you the current variant name + the handlers to drive it. Keeps
 *  pointer + focus in sync (keyboard users get the same breath).
 * ──────────────────────────────────────────────────────────────────────── */
export function useBreath() {
  const [state, setState] = useState<"rest" | "hover" | "press">("rest")
  const hovering = useRef(false)
  return {
    state,
    hovering: state !== "rest",
    handlers: {
      onPointerEnter: () => { hovering.current = true; setState("hover") },
      onPointerLeave: () => { hovering.current = false; setState("rest") },
      onPointerDown:  () => setState("press"),
      onPointerUp:    () => setState(hovering.current ? "hover" : "rest"),
      onFocus:        () => setState("hover"),
      onBlur:         () => setState("rest"),
    },
  }
}

/* ─────────────────────────────────────────────────────────────────────────
 *  flashColor — interpolate a base colour toward an accent during a flash.
 *  Simple swap (no blending) keeps it cheap and SSR-safe.
 * ──────────────────────────────────────────────────────────────────────── */
export function flashColor(base: string, accent: string, flashing: boolean): string {
  return flashing ? accent : base
}
