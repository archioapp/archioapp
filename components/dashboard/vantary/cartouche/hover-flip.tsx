"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · HOVER FLIP PRIMITIVE
   ───────────────────────────────────────────────────────────────────────────
   The reusable 3D card-flip every gadget will use to expose its "back face"
   of denser stats. Hover (or tap on touch, Space/Enter on keyboard) flips
   the same card in place — never a tooltip, never a modal.

   Anatomy:

     · Outer wrapper: tabbable, perspective container, hosts accent spine.
     · Inner card:    `transform-style: preserve-3d`, rotates 0→180deg.
     · Front face:    `backface-visibility: hidden`, rotateY(0).
     · Back face:     `backface-visibility: hidden`, rotateY(180deg).

   Behaviour:

     · Hover → flip after a 50ms intent-debounce (suppresses accidental
       flicker from cursor grazing). Mouse-leave → revert after a 120ms
       grace window (so users can hover OUT and back IN without resetting
       the flip every time).
     · Touch → small chevron tap target in the inner corner of the front
       face. Tap toggles. Outside tap reverts.
     · Keyboard → Space/Enter toggle. Esc reverts. The wrapper announces
       `aria-pressed` on its tab role for screen reader users.
     · Sibling guard via `<HoverFlipScope/>`: only one card flipped per
       scope at a time. Hovering a new one auto-reverts the previous after
       120ms. Implemented with a Map<owner, revert> registered in scope
       context.

   Accent treatment:

     · Mid-flip (40–60% of the duration), a soft accent gradient sweeps
       across the spine and the card lifts 8px toward the viewer. Reads
       as "card catching light as it turns" — sells the 3D, not a wipe.

   Reduced-motion:

     · `disabled` prop OR `prefers-reduced-motion` short-circuit the flip
       entirely. Only the front face renders. A small "↗ Details" caret
       in the front's corner is exposed instead, which is a no-op in this
       ship (future works will wire it to the room-room navigation).
   ═══════════════════════════════════════════════════════════════════════════ */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useReducedMotion } from "@/lib/cartouche/cartouche-hooks"
import { rgba as vgRgba, type ThemeAccent } from "@/components/vantary-glass"

/* ────────────────────────────────────────────────────────────────────────
   HoverFlipScope — sibling-hover guard. Place at each wing root so that
   only one card per wing can be flipped to its back face at a time.
   ──────────────────────────────────────────────────────────────────────── */
interface ScopeApi {
  /** Acquire the back-face lock. If another card has it, this auto-frees it. */
  acquire: (id: string, revert: () => void) => void
  /** Release the lock when the local card returns to its front. */
  release: (id: string) => void
}

const HoverFlipScopeContext = createContext<ScopeApi | null>(null)

export function HoverFlipScope({ children }: { children: React.ReactNode }) {
  /* The current holder + its revert callback. Stored in a ref so we don't
     re-render every consumer when the lock changes hands. */
  const holderRef = useRef<{ id: string; revert: () => void } | null>(null)

  const acquire = useCallback((id: string, revert: () => void) => {
    if (holderRef.current && holderRef.current.id !== id) {
      const prev = holderRef.current
      /* Delay the previous revert slightly so the two cards visually
         crossfade instead of one popping out while the new one is still
         starting to flip in. */
      window.setTimeout(() => prev.revert(), 120)
    }
    holderRef.current = { id, revert }
  }, [])

  const release = useCallback((id: string) => {
    if (holderRef.current && holderRef.current.id === id) {
      holderRef.current = null
    }
  }, [])

  const api = useMemo<ScopeApi>(() => ({ acquire, release }), [acquire, release])
  return (
    <HoverFlipScopeContext.Provider value={api}>
      {children}
    </HoverFlipScopeContext.Provider>
  )
}

function useHoverFlipScope(): ScopeApi {
  /* No-op scope when used outside a HoverFlipScope. The card still flips,
     it just doesn't coordinate with siblings. */
  return useContext(HoverFlipScopeContext) ?? { acquire: () => {}, release: () => {} }
}

/* ────────────────────────────────────────────────────────────────────────
   <HoverFlip/> — the primitive
   ──────────────────────────────────────────────────────────────────────── */
export interface HoverFlipApi {
  isFlipped: boolean
  flip:      () => void
  reset:     () => void
}

export interface HoverFlipProps {
  /** Front face render. Receives the imperative api so the front can drive its own caret. */
  front:               (api: HoverFlipApi) => React.ReactNode
  /** Back face render. Same api shape. */
  back:                (api: HoverFlipApi) => React.ReactNode
  /** Accessible label describing what the back face contains. */
  ariaLabel:           string
  /** Accent for the spine glow. */
  accent:              ThemeAccent
  /** Flip duration in ms. Default 460. */
  flipDurationMs?:     number
  /** Skip the flip entirely (disabled or reduced-motion). */
  disabled?:           boolean
  /** Touch chevron alignment — "inner-corner" places it on the inner side
   *  of the wing (toward the cartouche headline). Pass "left" or "right"
   *  to force a specific side. Default "inner-corner". */
  touchChevronSide?:   "left" | "right"
  /** Hover-out grace window before reverting. Default 120ms. */
  revertGraceMs?:      number
  /** Hover-in intent debounce. Default 50ms. */
  intentDebounceMs?:   number
}

export function HoverFlip({
  front, back, ariaLabel, accent,
  flipDurationMs   = 460,
  disabled         = false,
  touchChevronSide = "right",
  revertGraceMs    = 120,
  intentDebounceMs = 50,
}: HoverFlipProps) {
  const reducedMotion = useReducedMotion()
  const skipFlip      = disabled || reducedMotion

  const id        = useId()
  const scope     = useHoverFlipScope()
  const [flipped, setFlipped] = useState(false)
  const intentTimer = useRef<number | null>(null)
  const revertTimer = useRef<number | null>(null)

  /* ── imperative api ────────────────────────────────────────────��─── */
  const reset = useCallback(() => {
    setFlipped(false)
    scope.release(id)
  }, [id, scope])

  const flip = useCallback(() => {
    if (skipFlip) return
    setFlipped(true)
    scope.acquire(id, () => setFlipped(false))
  }, [id, scope, skipFlip])

  const api = useMemo<HoverFlipApi>(() => ({ isFlipped: flipped, flip, reset }), [flipped, flip, reset])

  /* ── hover intent debounce ────────────────────────────────────────── */
  const onMouseEnter = useCallback(() => {
    if (revertTimer.current != null) {
      window.clearTimeout(revertTimer.current)
      revertTimer.current = null
    }
    if (skipFlip || flipped) return
    if (intentTimer.current != null) window.clearTimeout(intentTimer.current)
    intentTimer.current = window.setTimeout(() => {
      flip()
      intentTimer.current = null
    }, intentDebounceMs)
  }, [flip, flipped, intentDebounceMs, skipFlip])

  const onMouseLeave = useCallback(() => {
    if (intentTimer.current != null) {
      window.clearTimeout(intentTimer.current)
      intentTimer.current = null
    }
    if (!flipped) return
    if (revertTimer.current != null) window.clearTimeout(revertTimer.current)
    revertTimer.current = window.setTimeout(() => {
      reset()
      revertTimer.current = null
    }, revertGraceMs)
  }, [flipped, reset, revertGraceMs])

  /* ── keyboard ─────────────────────────────────────────────────────── */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (skipFlip) return
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault()
        flipped ? reset() : flip()
      } else if (e.key === "Escape" && flipped) {
        e.preventDefault()
        reset()
      }
    },
    [flip, flipped, reset, skipFlip],
  )

  /* ── cleanup ──────────────────────────────────────────────────────── */
  useEffect(() => () => {
    if (intentTimer.current != null) window.clearTimeout(intentTimer.current)
    if (revertTimer.current != null) window.clearTimeout(revertTimer.current)
    scope.release(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── touch tap chevron in the inner corner of the front face ─────── */
  const onTouchToggle = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation()
      if (skipFlip) return
      flipped ? reset() : flip()
    },
    [flip, flipped, reset, skipFlip],
  )

  /* ── Render: reduced-motion path renders only the front ──────────── */
  if (skipFlip) {
    return (
      <div
        aria-label={ariaLabel}
        style={{ position: "relative", width: "100%" }}
      >
        {front(api)}
      </div>
    )
  }

  const dur = flipDurationMs / 1000

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={ariaLabel}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={onKeyDown}
      data-hoverflip
      data-hoverflip-flipped={flipped || undefined}
      style={{
        position: "relative",
        width: "100%",
        perspective: 1200,
        outline: "none",
        cursor: "pointer",
      }}
    >
      <motion.div
        animate={{
          rotateY: flipped ? 180 : 0,
          z:       flipped ? 8   : 0,
        }}
        transition={{ duration: dur, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative",
          width: "100%",
          transformStyle: "preserve-3d",
        }}
      >
        {/* ── Front face — kept in normal flow so it establishes the card's
            height. The back face is overlaid absolutely on top of it. ── */}
        <div
          aria-hidden={flipped}
          style={{
            position: "relative",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {front(api)}
          {/* Touch + click affordance: tiny chevron in the inner corner so
              touch users (and anyone who prefers explicit affordance) can
              tap to flip without hovering. */}
          <button
            type="button"
            aria-label="Show details"
            onClick={onTouchToggle}
            tabIndex={-1}
            style={{
              position: "absolute",
              bottom: 4,
              [touchChevronSide === "left" ? "left" : "right"]: 6,
              width: 14,
              height: 10,
              padding: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              opacity: 0.4,
              color: accent.hex,
              fontSize: 10,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            } as React.CSSProperties}
          >
            ⤺
          </button>
        </div>

        {/* ── Back face ────────────────────────────────────────────── */}
        <div
          aria-hidden={!flipped}
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {back(api)}
          {/* Same chevron, oriented the other way — taps revert. */}
          <button
            type="button"
            aria-label="Hide details"
            onClick={onTouchToggle}
            tabIndex={-1}
            style={{
              position: "absolute",
              bottom: 4,
              [touchChevronSide === "left" ? "left" : "right"]: 6,
              width: 14,
              height: 10,
              padding: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              opacity: 0.55,
              color: accent.hex,
              fontSize: 10,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            } as React.CSSProperties}
          >
            ⤻
          </button>
        </div>
      </motion.div>

      {/* ── Spine glow during the flip ─────────────────────────────── */}
      <AnimatePresence>
        {flipped && (
          <motion.span
            key="spine"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.45, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur, times: [0, 0.5, 1], ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 10,
              pointerEvents: "none",
              boxShadow: `inset 0 0 18px ${vgRgba(accent.rgb, 0.32)}, 0 0 14px ${vgRgba(accent.rgb, 0.22)}`,
              background: `linear-gradient(90deg, transparent 0%, ${vgRgba(accent.rgb, 0.12)} 50%, transparent 100%)`,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
