"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · LIVING CARTOUCHE — gadget wrapper
   ───────────────────────────────────────────────────────────────────────────
   Every gadget in the welcome cartouche wraps its faces in <LivingGadget/>.
   The wrapper owns:

     · Face rotation       (useFaceRotation)
     · Face-dot strip      (clickable, 8s manual-suspend)
     · Hover pause         (mouse over freezes rotation)
     · Focus halo          (soft accent glow band on hover)
     · Reduced-motion gate (face 0 frozen)
     · Cell sizing         (s/m/l → grid col-span)
     · Crossfade choreography (AnimatePresence + per-transition variant)

   The gadget's own component just declares `faces[]` and a
   `transition` key — the wrapper handles everything else.
   ═══════════════════════════════════════════════════════════════════════════ */

import React, { useMemo, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  useFaceRotation,
  useFaceKeyboardNav,
  useCartouchePauseAll,
  type FaceRotationOptions,
} from "@/lib/cartouche/cartouche-hooks"
/* ARCHIO · Ask Vantary state machine — when the user is engaged with
   the Ask surface (suggesting / submitted / answering), every gadget's
   face rotation freezes. Reads via a safe `IDLE_STUB` fallback so this
   component works outside the provider too. */
import { useAskVantaryState } from "@/components/dashboard/vantary/cartouche/ask-vantary-state-context"
import {
  FACE_TRANSITIONS,
  type FaceTransitionKey,
  type FaceAlignment,
} from "@/lib/cartouche/face-transitions"
import { rgba as vgRgba, VT as VG_VT, type ThemeAccent } from "@/components/vantary-glass"

export type GadgetSize = "s" | "m" | "l"
export type GadgetAlignment = FaceAlignment

/* ────────────────────────────────────────────────────────────────────────
   Per-gadget face definition
   ──────────────────────────────────────────────────────────────────────── */
export interface LivingGadgetFace {
  /** Stable id used as the AnimatePresence `key`. */
  id: string
  /** Human-readable face label (for a11y, e.g. "Total"). */
  label: string
  /** The face's rendered content. */
  render: () => ReactNode
  /** Optional per-face interval override (ms). */
  intervalMs?: number
}

export interface LivingGadgetProps {
  /** Stable gadget name (e.g. "management-pulse") — used for keys + phase seed. */
  name: string
  /** Display label (e.g. "Management Pulse") — used for a11y aria-label. */
  label: string
  /** The wing this gadget is rendered into — left or right. */
  alignment: GadgetAlignment
  /** The size class — drives grid col-span externally + halo padding here. */
  size: GadgetSize
  /** The active theme accent. */
  accent: ThemeAccent
  /** Faces to cycle through. 1 face = static (no rotation). */
  faces: readonly LivingGadgetFace[]
  /** Motion grammar key — one of the 9 declared in face-transitions.ts. */
  transition: FaceTransitionKey
  /** Optional per-face base interval. Default 5400ms. */
  baseInterval?: number
  /** Render extra decorative content above the face-dot strip. */
  topRight?: ReactNode
  /** Override gadget min-height (defaults to size-based). */
  minHeight?: number
  /** When true, draws a subtle priority halo and a "PRIORITY" pip in the
   *  inner corner. Drives the macro/revenge attention flow. */
  priority?: boolean
  /** Optional priority label, e.g. "ALERT", "IMMINENT". Default "PRIORITY". */
  priorityLabel?: string
}

/** Size → minimum height. Big enough to feel substantial, small enough to
 *  fit two rows per wing under the cartouche headline. */
const SIZE_MIN_HEIGHT: Record<GadgetSize, number> = {
  s: 64,
  m: 64,
  l: 78,
}

/* ────────────────────────────────────────────────────────────────────────
   Face-dot strip — sits at the gadget's inner corner (toward headline)
   ──────────────────────────────────────────────────────────────────────── */
function FaceDotStrip({
  count, activeIndex, accent, onPick, alignment,
}: {
  count: number
  activeIndex: number
  accent: ThemeAccent
  onPick: (i: number) => void
  alignment: GadgetAlignment
}) {
  if (count <= 1) return null
  return (
    <div
      role="tablist"
      aria-label="Switch face"
      className="flex items-center gap-1.5"
      style={{
        position: "absolute",
        top: 6,
        /* Inner corner: left wing → inner side is RIGHT (toward headline). */
        [alignment === "left" ? "right" : "left"]: 6,
      } as React.CSSProperties}
    >
      {Array.from({ length: count }, (_, i) => {
        const active = i === activeIndex
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={`Show face ${i + 1} of ${count}`}
            onClick={(e) => { e.stopPropagation(); onPick(i) }}
            className="rounded-full"
            style={{
              width: 5,
              height: 5,
              background: active ? accent.hex : vgRgba(accent.rgb, 0.18),
              boxShadow: active ? `0 0 6px ${vgRgba(accent.rgb, 0.55)}` : "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "background 200ms, box-shadow 200ms",
            }}
          />
        )
      })}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   LivingGadget
   ──────────────────────────────────────────────────────────────────────── */
export function LivingGadget({
  name, label, alignment, size, accent, faces, transition,
  baseInterval = 5400, topRight, minHeight,
  priority = false, priorityLabel = "PRIORITY",
}: LivingGadgetProps) {
  /* Per-face interval overrides, derived from `faces`. */
  const perFaceInterval = useMemo(
    () => faces.map((f) => f.intervalMs ?? baseInterval),
    [faces, baseInterval],
  )

  /* Honor the global pause-all toggle (set from the cartouche command bar)
   *  AND the Ask Vantary state machine's `rotationPaused` flag — both
   *  collapse into one boolean fed to `useFaceRotation`. We OR them so
   *  EITHER source pauses every gadget's face rotation; the gadget
   *  resumes only when BOTH sources are inactive. */
  const { paused: pausedAll } = useCartouchePauseAll()
  const { rotationPaused: askPaused } = useAskVantaryState()
  const externalPause = pausedAll || askPaused

  const rotation = useFaceRotation(faces.length, {
    baseInterval,
    perFaceInterval,
    pauseOnHover: true,
    phaseSeed: name,
    externalPause,
  })

  /* Keyboard map for ←/→/Home/End/digit on the face strip. */
  const onKeyDown = useFaceKeyboardNav(faces.length, rotation)

  const transitionFn = FACE_TRANSITIONS[transition]
  const motionSpec = useMemo(
    () => transitionFn({ alignment, reducedMotion: rotation.reducedMotion }),
    [transitionFn, alignment, rotation.reducedMotion],
  )

  const face = faces[rotation.index] ?? faces[0]
  const resolvedMinHeight = minHeight ?? SIZE_MIN_HEIGHT[size]

  return (
    <div
      role="group"
      aria-label={`${label} (face ${rotation.index + 1} of ${faces.length}: ${face?.label ?? ""})`}
      data-gadget-name={name}
      data-gadget-size={size}
      data-priority={priority || undefined}
      className="relative outline-none"
      tabIndex={0}
      onKeyDown={onKeyDown}
      style={{
        minHeight: resolvedMinHeight,
        textAlign: alignment === "left" ? "right" : "left",
        padding: "8px 10px",
        borderRadius: 10,
      }}
      onMouseEnter={rotation.bind.onMouseEnter}
      onMouseLeave={rotation.bind.onMouseLeave}
    >
      {/* ── Focus halo (on hover or keyboard focus) — soft accent glow ── */}
      <motion.span
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: 10,
          border: `1px solid ${vgRgba(accent.rgb, 0.16)}`,
          boxShadow: `0 0 16px ${vgRgba(accent.rgb, 0.12)}, inset 0 0 12px ${vgRgba(accent.rgb, 0.06)}`,
        }}
        initial={false}
        animate={{ opacity: rotation.hovered ? 1 : 0 }}
        transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
      />

      {/* ── Priority halo · always-on amber pulse when `priority` is set ─ */}
      {priority && (
        <motion.span
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: 10,
            border: `1px solid ${vgRgba([255, 178, 36], 0.40)}`,
            boxShadow: `0 0 14px ${vgRgba([255, 178, 36], 0.22)}, inset 0 0 10px ${vgRgba([255, 178, 36], 0.10)}`,
          }}
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Face dot strip removed for a cleaner multibillion-dollar look.
          Face navigation still works via keyboard (←/→/Home/End/digits).
          Auto-rotation continues to advance faces over time.            */}

      {/* ── Priority pip · amber mono caps in outer corner ───────────── */}
      {priority && (
        <div
          aria-label={`${priorityLabel}: ${label}`}
          className="font-mono uppercase"
          style={{
            position: "absolute",
            top: 4,
            /* Sits opposite the dot strip — outer side of the cell. */
            [alignment === "left" ? "left" : "right"]: 8,
            fontSize: 8.5,
            letterSpacing: "0.22em",
            color: "rgb(255, 178, 36)",
            background: vgRgba([255, 178, 36], 0.10),
            border: `1px solid ${vgRgba([255, 178, 36], 0.30)}`,
            padding: "1px 5px",
            borderRadius: 3,
            lineHeight: 1.4,
            pointerEvents: "none",
            textShadow: `0 0 8px ${vgRgba([255, 178, 36], 0.45)}`,
          } as React.CSSProperties}
        >
          {priorityLabel}
        </div>
      )}

      {/* ── Optional top-right slot (used by some gadgets for a status pip) ── */}
      {topRight && (
        <div
          className="absolute"
          style={{
            top: 6,
            [alignment === "left" ? "left" : "right"]: 6,
          } as React.CSSProperties}
        >
          {topRight}
        </div>
      )}

      {/* ── The face content ──────────────────────────────────────────── */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={face?.id ?? rotation.index}
          initial={motionSpec.initial}
          animate={motionSpec.animate}
          exit={motionSpec.exit}
          transition={motionSpec.transition}
          style={{
            transformOrigin:
              alignment === "left" ? "right center" : "left center",
          }}
        >
          {face?.render()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Shared sub-atoms — used across many gadgets to keep typography uniform
   ──────────────────────────────────────────────────────────────────────── */

/** Mono-caps eyebrow ("MANAGEMENT · LIVE"). */
export function GadgetEyebrow({
  children, alignment, accent,
}: {
  children: ReactNode
  alignment: GadgetAlignment
  accent?: ThemeAccent
}) {
  return (
    <div
      className="font-mono uppercase tabular-nums"
      style={{
        fontSize: 9,
        letterSpacing: "0.22em",
        color: accent ? vgRgba(accent.rgb, 0.85) : VG_VT.ashSoft,
        lineHeight: 1,
        textAlign: alignment === "left" ? "right" : "left",
        marginBottom: 4,
      }}
    >
      {children}
    </div>
  )
}

/** The "big number" line. Theme-accent tinted by default. */
export function GadgetBig({
  children, alignment, accent, size = 22,
}: {
  children: ReactNode
  alignment: GadgetAlignment
  accent: ThemeAccent
  size?: number
}) {
  return (
    <div
      className="font-sans tabular-nums"
      style={{
        fontSize: size,
        fontWeight: 500,
        letterSpacing: "-0.015em",
        color: accent.hex,
        lineHeight: 1.05,
        textAlign: alignment === "left" ? "right" : "left",
        textShadow: `0 0 14px ${vgRgba(accent.rgb, 0.35)}`,
      }}
    >
      {children}
    </div>
  )
}

/** Sub-line under the big number. */
export function GadgetSub({
  children, alignment, color,
}: {
  children: ReactNode
  alignment: GadgetAlignment
  color?: string
}) {
  return (
    <div
      className="font-sans"
      style={{
        fontSize: 10.5,
        color: color ?? VG_VT.paperDim,
        lineHeight: 1.35,
        textAlign: alignment === "left" ? "right" : "left",
        marginTop: 2,
      }}
    >
      {children}
    </div>
  )
}
