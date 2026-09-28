"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · LIVING CARTOUCHE — face transitions
   ───────────────────────────────────────────────────────────────────────────
   One file, nine motion grammars. Each generator returns a Framer Motion
   variant trio + transition spec, parametrised by the gadget's alignment
   (so right-wing transitions can mirror) and the active theme accent.

   The mapping (per plan):
     management-pulse  → vault-roll
     accuracy-engine   → ring-redraw
     session-clockwork → dial-tick
     discipline-pulse  → pulse-flash
     equity-beacon-live→ chart-morph
     firm-identity     → card-flip-3d
     win-rate-heart    → heart-beat
     best-pair         → pair-swap
     macro-pulse       → countdown-tick

   A generic `crossfade` is exported as a safe fallback / default.
   ═══════════════════════════════════════════════════════════════════════════ */

import type { Transition, Variants } from "framer-motion"

export type FaceAlignment = "left" | "right"
export interface TransitionOpts {
  alignment?: FaceAlignment
  /** Reduced-motion users skip the animation entirely. */
  reducedMotion?: boolean
}

export interface FaceMotion {
  initial:    Record<string, unknown>
  animate:    Record<string, unknown>
  exit:       Record<string, unknown>
  transition: Transition
}

/* ────────────────────────────────────────────────────────────────────────
   Reduced-motion: instant face replace (no animation)
   ──────────────────────────────────────────────────────────────────────── */
const STATIC: FaceMotion = {
  initial:    { opacity: 1 },
  animate:    { opacity: 1 },
  exit:       { opacity: 1 },
  transition: { duration: 0 },
}

const ease = [0.22, 0.61, 0.36, 1] as const // EASE_V equivalent

/* ────────────────────────────────────────────────────────────────────────
   1 · vault-roll — money tumbling on a split-flap board
   The container slides up; new face slides up from below. The numeric
   content inside the gadget can use a digit-roll for the per-digit effect.
   ──────────────────────────────────────────────────────────────────────── */
export function vaultRoll(opts: TransitionOpts = {}): FaceMotion {
  if (opts.reducedMotion) return STATIC
  return {
    initial:    { opacity: 0, y:  10, filter: "blur(2px)" },
    animate:    { opacity: 1, y:   0, filter: "blur(0px)" },
    exit:       { opacity: 0, y: -10, filter: "blur(2px)" },
    transition: { duration: 0.38, ease },
  }
}

/* ────────────────────────────────────────────────────────────────────────
   2 · ring-redraw — score being recomputed
   Old face shrinks slightly + fades; new face scales up from 0.96 + fades.
   ──────────────────────────────────────────────────────────────────────── */
export function ringRedraw(opts: TransitionOpts = {}): FaceMotion {
  if (opts.reducedMotion) return STATIC
  return {
    initial:    { opacity: 0, scale: 0.96 },
    animate:    { opacity: 1, scale: 1.00 },
    exit:       { opacity: 0, scale: 0.96 },
    transition: { duration: 0.44, ease },
  }
}

/* ────────────────────────────────────────────────────────────────────────
   3 · dial-tick — clock-face turning
   3D rotate around Y axis, slight perspective.
   ──────────────────────────────────────────────────────────────────────── */
export function dialTick(opts: TransitionOpts = {}): FaceMotion {
  if (opts.reducedMotion) return STATIC
  const dir = opts.alignment === "right" ? -1 : 1
  return {
    initial:    { opacity: 0, rotateY:  8 * dir, transformPerspective: 600 },
    animate:    { opacity: 1, rotateY:  0,       transformPerspective: 600 },
    exit:       { opacity: 0, rotateY: -8 * dir, transformPerspective: 600 },
    transition: { duration: 0.36, ease: "easeInOut" },
  }
}

/* ────────────────────────────────────────────────────────────────────────
   4 · pulse-flash — heartbeat reveal
   Brief brightness pulse on entry; faster crossfade.
   ──────────────────────────────────────────────────────────────────────── */
export function pulseFlash(opts: TransitionOpts = {}): FaceMotion {
  if (opts.reducedMotion) return STATIC
  return {
    initial:    { opacity: 0, scale: 0.98, filter: "brightness(1.6)" },
    animate:    { opacity: 1, scale: 1.00, filter: "brightness(1.0)" },
    exit:       { opacity: 0, scale: 0.98, filter: "brightness(1.0)" },
    transition: { duration: 0.42, ease },
  }
}

/* ────────────────────────────────────────────────────────────────────────
   5 · chart-morph — curve being reshaped
   Squashes vertically on exit, expands back on entry.
   ──────────────────────────────────────────────────────────────────────── */
export function chartMorph(opts: TransitionOpts = {}): FaceMotion {
  if (opts.reducedMotion) return STATIC
  return {
    initial:    { opacity: 0, scaleY: 0.92, y:  4 },
    animate:    { opacity: 1, scaleY: 1.00, y:  0 },
    exit:       { opacity: 0, scaleY: 0.92, y: -4 },
    transition: { duration: 0.46, ease },
  }
}

/* ────────────────────────────────────────────────────────────────────────
   6 · card-flip-3d — turning over a contract card
   True 3D Y-flip with backface hidden.
   ──────────────────────────────────────────────────────────────────────── */
export function cardFlip3D(opts: TransitionOpts = {}): FaceMotion {
  if (opts.reducedMotion) return STATIC
  return {
    initial: {
      opacity: 0,
      rotateY: 90,
      transformPerspective: 800,
      transformStyle: "preserve-3d",
    },
    animate: {
      opacity: 1,
      rotateY: 0,
      transformPerspective: 800,
      transformStyle: "preserve-3d",
    },
    exit: {
      opacity: 0,
      rotateY: -90,
      transformPerspective: 800,
      transformStyle: "preserve-3d",
    },
    transition: { duration: 0.42, ease },
  }
}

/* ────────────────────────────────────────────────────────────────────────
   7 · heart-beat — the number has a pulse
   Quick scale dip then bloom. Combined with always-on heartbeat micro.
   ──────────────────────────────────────────────────────────────────────── */
export function heartBeat(opts: TransitionOpts = {}): FaceMotion {
  if (opts.reducedMotion) return STATIC
  return {
    initial:    { opacity: 0, scale: 0.96 },
    animate:    { opacity: 1, scale: [0.96, 1.04, 1.00] as unknown as number },
    exit:       { opacity: 0, scale: 0.96 },
    transition: { duration: 0.48, ease, times: [0, 0.5, 1] } as unknown as Transition,
  }
}

/* ────────────────────────────────────────────────────────────────────────
   8 · pair-swap — one card slides up, replaced by another from below
   No overlap — feels like an old-style flip board for one row.
   ──────────────────────────────────────────────────────────────────────── */
export function pairSwap(opts: TransitionOpts = {}): FaceMotion {
  if (opts.reducedMotion) return STATIC
  return {
    initial:    { opacity: 0, y:  8 },
    animate:    { opacity: 1, y:  0 },
    exit:       { opacity: 0, y: -8 },
    transition: { duration: 0.44, ease },
  }
}

/* ────────────────────────────────────────────────────────────────────────
   9 · countdown-tick — ticker-style digit roll (gadget-wide)
   Faster than vault-roll, more "stopwatch".
   ──────────────────────────────────────────────────────────────────────── */
export function countdownTick(opts: TransitionOpts = {}): FaceMotion {
  if (opts.reducedMotion) return STATIC
  return {
    initial:    { opacity: 0, y:  6, scale: 0.98 },
    animate:    { opacity: 1, y:  0, scale: 1.00 },
    exit:       { opacity: 0, y: -6, scale: 0.98 },
    transition: { duration: 0.28, ease },
  }
}

/* ────────────────────────────────────────────────────────────────────────
   Generic crossfade — safe fallback
   ──────────────────────────────────────────────────────────────────────── */
export function crossfade(opts: TransitionOpts = {}): FaceMotion {
  if (opts.reducedMotion) return STATIC
  return {
    initial:    { opacity: 0 },
    animate:    { opacity: 1 },
    exit:       { opacity: 0 },
    transition: { duration: 0.32, ease },
  }
}

/* ────────────────────────────────────────────────────────────────────────
   Registry — string keys map to generator fns, so a gadget can declare
   `transition: "vault-roll"` without importing each generator.
   ──────────────────────────────────────────────────────────────────────── */
export type FaceTransitionKey =
  | "vault-roll"
  | "ring-redraw"
  | "dial-tick"
  | "pulse-flash"
  | "chart-morph"
  | "card-flip-3d"
  | "heart-beat"
  | "pair-swap"
  | "countdown-tick"
  | "crossfade"

export const FACE_TRANSITIONS: Record<
  FaceTransitionKey,
  (opts?: TransitionOpts) => FaceMotion
> = {
  "vault-roll":     vaultRoll,
  "ring-redraw":    ringRedraw,
  "dial-tick":      dialTick,
  "pulse-flash":    pulseFlash,
  "chart-morph":    chartMorph,
  "card-flip-3d":   cardFlip3D,
  "heart-beat":     heartBeat,
  "pair-swap":      pairSwap,
  "countdown-tick": countdownTick,
  "crossfade":      crossfade,
}

/* Convenience: convert a FaceMotion to a Variants object keyed by motion
   state. Useful for callers that prefer `variants`/`initial`/`animate`. */
export function faceMotionToVariants(m: FaceMotion): Variants {
  return {
    initial: m.initial,
    animate: m.animate,
    exit:    m.exit,
  }
}
