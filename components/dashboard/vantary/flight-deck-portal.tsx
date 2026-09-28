"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *
 *   FLIGHT DECK PORTAL  ·  Vantary cockpit-grade reveal affordance
 *
 *   The single most premium interactive surface on the Your Space dashboard.
 *   Per the trader's direction this is no longer a pill or a button — it is
 *   the INSTRUMENT itself, naked. No border, no fill, no inscription, no
 *   chevron. Just a 32×32 hand-illustrated aviation HUD that breathes,
 *   tilts, blooms, and toggles the Flight Deck on click.
 *
 *   The entire affordance language is carried by the SVG geometry:
 *   the V-reticle (aircraft symbol) flips 180° to communicate
 *   deploy/retract; the horizon line tilts on hover; the center dot
 *   pulses; an outer status arc traces around the ring during transitions
 *   like a digital wristwatch dial; a launch-trail glyph erupts beneath
 *   the instrument during deploy. Hover scales 1.10×, press 0.94×,
 *   pulse 1.18×.
 *
 *   ─────────────────────────────────────────────────────────────────────
 *   VISUAL ANATOMY  (32×32 SVG, no chrome)
 *   ─────────────────────────────────────────────────────────────────────
 *
 *      ┌─────── 32 ───────┐
 *      │     ◜───◝         │   (a) outer ring — always present
 *      │    ╱  ◌  ╲        │   (b) status arc — sweeps during pulse
 *      │   │ ─── ─ │       │   (c) horizon line — tilts on hover
 *      │    ╲ V/Λ ╱        │   (d) V-reticle — flips on open/close
 *      │     ◟───◞         │   (e) breathing dot — heartbeat
 *      └──────────────────┘   (f) launch trail — erupts during pulse
 *
 *   ─────────────────────────────────────────────────────────────────────
 *   STATE MACHINE
 *   ─────────────────────────────────────────────────────────────────────
 *
 *      CLOSED-IDLE   ring quiet · horizon level · V↓ · dot slow-pulse
 *      CLOSED-HOVER  ring amber · horizon −8°  · V↓ · dot mid-pulse · halo
 *      OPEN-IDLE     ring amber · horizon level · V↑ · dot mid-pulse
 *      DEPLOY-PULSE  ring amber · arc-sweep ↻   · V↓→↑ · dot fast-pulse · trail bloom
 *      RETRACT-FLASH ring amber · arc-sweep ↺   · V↑→↓ · dot fast-pulse
 *
 *   ─────────────────────────────────────────────────────────────────────
 *   INTERACTION CONTRACT
 *   ─────────────────────────────────────────────────────────────────────
 *
 *      click            → toggle the deck
 *      keyboard ⌃⇧F     → toggle (handled in provider)
 *      Escape           → conceal (when open; handled in provider)
 *      hover            → horizon tilt, halo, scale 1.10×
 *      pointer-active   → scale 0.94× (tactile press)
 *      focus-visible    → halo (no ugly outline)
 *
 *   ═══════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { VANTARY } from "./vantary-theme"
import { useFlightDeckReveal, useSearchPortalPulse } from "./flight-deck-reveal"

/* M3 · 32 → 36 px. With all chrome stripped (no border, no fill, no
 * inscription, no chevron), the bare instrument needs more visual
 * weight to anchor the center of the header rail. 36 px is the
 * sweet spot between "obvious affordance" and "not aggressive". */
const SIZE = 36

export function FlightDeckPortal() {
  const { open, toggle } = useFlightDeckReveal()
  const pulsing = useSearchPortalPulse()
  const reduced = useReducedMotion()

  const [hover,   setHover]   = useState(false)
  const [pressed, setPressed] = useState(false)
  const [focused, setFocused] = useState(false)

  /* Conceal-direction visual flash. The global pulse only fires on
     reveal — for retract we run our own short flash so the V-reticle
     spin and arc-sweep also play during conceal, matching the deploy
     direction in craft and weight. */
  const [retractFlash, setRetractFlash] = useState(false)
  const prevOpenRef = useRef(open)
  useEffect(() => {
    if (prevOpenRef.current && !open) {
      setRetractFlash(true)
      const t = setTimeout(() => setRetractFlash(false), 700)
      return () => clearTimeout(t)
    }
    prevOpenRef.current = open
  }, [open])

  const isPulsing = pulsing || retractFlash

  return (
    <motion.button
      type="button"
      onClick={toggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPressed(false) }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      data-flight-deck-portal
      aria-pressed={open}
      aria-label={
        open
          ? "Retract Flight Deck — keyboard shortcut Control Shift F"
          : "Deploy Flight Deck — keyboard shortcut Control Shift F"
      }
      className="relative inline-flex items-center justify-center cursor-pointer focus:outline-none"
      style={{
        width:        SIZE + 12,
        height:       SIZE + 12,
        background:   "transparent",
        border:       "none",
        padding:      0,
        WebkitTapHighlightColor: "transparent",
      }}
      animate={{
        scale:
          isPulsing ? 1.18 :
          pressed   ? 0.94 :
          hover     ? 1.10 :
                      1,
      }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* (g) ambient halo — a soft radial wash that lives BEHIND the
              instrument. Mounted permanently for free smooth fades.
              Renders nothing on idle-closed; brightens on hover, open,
              and pulse. */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${VANTARY.amberHalo} 0%, transparent 65%)`,
        }}
        animate={{
          opacity:
            isPulsing ? 0.85 :
            open      ? 0.45 :
            hover     ? 0.55 :
            focused   ? 0.40 :
                        0,
          scale:
            isPulsing ? 1.4 :
            hover     ? 1.15 :
                        1.0,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      <FlightDeckHUD
        open={open}
        pulsing={isPulsing}
        hover={hover}
        reduced={!!reduced}
      />

      {/* (f) LAUNCH TRAIL — three stacked chevrons that erupt downward
              during deploy and upward during retract. Lives in front of
              the instrument so it reads as exhaust escaping the HUD.
              Only mounts during pulse states. */}
      <AnimatePresence>
        {isPulsing && !reduced && (
          <LaunchTrail direction={pulsing ? "down" : "up"} />
        )}
      </AnimatePresence>
    </motion.button>
  )
}

/* ─────────────────────────────────────────────────────────────────────
 *  <FlightDeckHUD /> — the 32×32 SVG attitude indicator.
 *
 *  Composed entirely of primitive SVG elements (circle, line, path)
 *  with all rotations pivoting from a shared 16px center so transforms
 *  compose cleanly. Six layers, each animated independently:
 *
 *    (a) outer ring          — color shifts with state
 *    (b) status arc          — invisible idle, sweeps during pulse
 *    (c) horizon group       — tilts -8° on hover (closed only)
 *    (d) V-reticle           — flips 180° between deploy/retract
 *    (e) breathing dot       — heartbeat of the instrument
 *    (extra) tick marks      — small notches at 12/3/6/9 o'clock,
 *                              brighten progressively during pulse
 * ────────────────────────────────────────────────────────────────── */

function FlightDeckHUD({
  open, pulsing, hover, reduced,
}: {
  open:    boolean
  pulsing: boolean
  hover:   boolean
  reduced: boolean
}) {
  /* horizon tilt — only when CLOSED + HOVER (idle "checking horizon"). */
  const horizonRotate = !reduced && hover && !open && !pulsing ? -8 : 0
  /* V-reticle direction — points DOWN when deck is closed (deploy
     downward), UP when deck is open (retract upward). Inverts via 180°
     rotation rather than swapping paths so the transition is animated. */
  const reticleRotate = open ? 180 : 0

  const ringStroke =
    pulsing       ? VANTARY.amber  :
    open          ? VANTARY.amber  :
    hover         ? VANTARY.amberHalo :
                    VANTARY.chipBorder

  const horizonStroke =
    pulsing || open ? VANTARY.amber :
    hover           ? VANTARY.paper :
                      VANTARY.ash

  return (
    <motion.svg
      width={SIZE} height={SIZE} viewBox="0 0 32 32"
      className="relative"
      style={{ overflow: "visible" }}
      animate={{
        scale:  pulsing ? [1, 1.10, 1] : 1,
      }}
      transition={{ duration: pulsing ? 0.9 : 0.4, ease: "easeOut" }}
      aria-hidden
    >
      {/* (a) outer ring */}
      <motion.circle
        cx={16} cy={16} r={13}
        fill="none"
        strokeWidth={1.2}
        animate={{ stroke: ringStroke }}
        transition={{ duration: 0.4 }}
      />

      {/* (extra) compass-tick marks at 12/3/6/9. These create the
                 "instrument" feeling — without them the ring reads as
                 a generic circle. Each tick brightens during pulse,
                 staggered, like a launch sequence "armed → engaged". */}
      <CompassTicks pulsing={pulsing} hover={hover} open={open} reduced={reduced} />

      {/* (b) status arc — a 270° arc that sweeps during pulse.
              Drawn via stroke-dasharray + stroke-dashoffset animation
              on a path so it traces cleanly around the ring like a
              sport-watch dial completing a rep. Hidden when idle. */}
      <StatusArc pulsing={pulsing} reduced={reduced} reverse={!pulsing ? false : !open} />

      {/* (c) horizon group — line + pitch markers — rotates together */}
      <motion.g
        animate={{ rotate: horizonRotate }}
        style={{ transformOrigin: "16px 16px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.line
          x1={5} y1={16} x2={27} y2={16}
          strokeWidth={1.4}
          strokeLinecap="round"
          animate={{ stroke: horizonStroke }}
          transition={{ duration: 0.4 }}
        />
        {/* pitch markers above and below horizon */}
        <line x1={12} y1={11.5} x2={20} y2={11.5} stroke={VANTARY.ashSoft} strokeWidth={1} strokeLinecap="round" />
        <line x1={13.5} y1={20.5} x2={18.5} y2={20.5} stroke={VANTARY.ashSoft} strokeWidth={1} strokeLinecap="round" />
      </motion.g>

      {/* (d) aircraft V-reticle — points DOWN to "deploy" when closed,
              flips 180° to point UP to "retract" when open. */}
      <motion.g
        animate={{ rotate: reticleRotate }}
        style={{ transformOrigin: "16px 16px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <path
          d="M11 16 L16 19.5 L21 16"
          fill="none"
          stroke={VANTARY.amber}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.g>

      {/* (e) breathing center dot — the heartbeat */}
      <motion.circle
        cx={16} cy={16} r={1.4}
        fill={VANTARY.amber}
        style={{ transformOrigin: "16px 16px" }}
        animate={
          reduced
            ? {}
            : {
                opacity: pulsing ? [0.4, 1, 0.4] : [0.5, 1, 0.5],
                scale:   pulsing ? [1, 2.0, 1]   : hover ? [1, 1.4, 1] : [1, 1.2, 1],
              }
        }
        transition={{
          duration: pulsing ? 0.5 : hover ? 1.4 : 2.4,
          repeat:   Infinity,
          ease:     "easeInOut",
        }}
      />
    </motion.svg>
  )
}

/* ─────────────────────────────────────────────────────────────────────
 *  <CompassTicks/> — 12/3/6/9 o'clock notches on the ring.
 *  Each tick brightens during pulse with a staggered delay so they
 *  light up in sequence (12 → 3 → 6 → 9), like a launch armament
 *  sequence. Idle: faint hairlines barely visible.
 * ────────────────────────────────────────────────────────────────── */

function CompassTicks({
  pulsing, hover, open, reduced,
}: { pulsing: boolean; hover: boolean; open: boolean; reduced: boolean }) {
  /* tick coordinates: outer-end → inner-end at 12/3/6/9 o'clock */
  const ticks = [
    { x1: 16,   y1: 1.5, x2: 16,   y2: 4 },   // 12
    { x1: 30.5, y1: 16,  x2: 28,   y2: 16 },  // 3
    { x1: 16,   y1: 30.5,x2: 16,   y2: 28 },  // 6
    { x1: 1.5,  y1: 16,  x2: 4,    y2: 16 },  // 9
  ]

  const baseOpacity =
    pulsing ? 1   :
    open    ? 0.7 :
    hover   ? 0.55 :
              0.25

  return (
    <>
      {ticks.map((t, i) => (
        <motion.line
          key={i}
          x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={pulsing || open ? VANTARY.amber : VANTARY.ashSoft}
          strokeWidth={1}
          strokeLinecap="round"
          animate={
            reduced
              ? { opacity: baseOpacity }
              : pulsing
                ? { opacity: [0.2, 1, 0.6] }
                : { opacity: baseOpacity }
          }
          transition={
            pulsing
              ? { duration: 0.7, delay: i * 0.08, ease: "easeOut" }
              : { duration: 0.3 }
          }
        />
      ))}
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────
 *  <StatusArc/> — a 270° arc traced around the ring during pulse.
 *  Implemented as a single SVG path with stroke-dasharray equal to its
 *  full length, animated from full-offset (invisible) to zero-offset
 *  (fully drawn). Sweeps clockwise on deploy and counter-clockwise on
 *  retract, providing a directional cue for which way the deck moves.
 * ────────────────────────────────────────────────────────────────── */

function StatusArc({
  pulsing, reduced, reverse,
}: { pulsing: boolean; reduced: boolean; reverse: boolean }) {
  /* Path = arc from 12 o'clock around 270° clockwise to 9 o'clock,
     drawn at radius 13 (matches outer ring). */
  const arcPath = "M 16 3 A 13 13 0 1 1 3 16"
  const length  = 2 * Math.PI * 13 * (270 / 360) // ≈ 61.26

  return (
    <AnimatePresence>
      {pulsing && !reduced && (
        <motion.path
          key="status-arc"
          d={arcPath}
          fill="none"
          stroke={VANTARY.amber}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeDasharray={length}
          initial={{ strokeDashoffset: reverse ? -length : length, opacity: 0 }}
          animate={{ strokeDashoffset: 0,                          opacity: 1 }}
          exit={{    strokeDashoffset: reverse ? length : -length, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "16px 16px" }}
        />
      )}
    </AnimatePresence>
  )
}

/* ─────────────────────────────────────────────────────────────────────
 *  <LaunchTrail/> — three stacked chevrons in mono caps that erupt
 *  away from the HUD during pulse. On DEPLOY they fall downward
 *  (deck dropping in); on RETRACT they fly upward (deck pulling out).
 *  Each chevron staggers by 60ms for a "launch contrail" cascade.
 * ────────────────────────────────────────────────────────────────── */

function LaunchTrail({ direction }: { direction: "up" | "down" }) {
  const sign = direction === "down" ? 1 : -1

  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{
        translate: `-50% -50%`,
        width: SIZE,
        height: SIZE,
      }}
    >
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="absolute left-1/2"
          style={{
            top:           "50%",
            translate:     "-50% 0",
            width:         8,
            height:        4,
            borderLeft:    `1.4px solid ${VANTARY.amber}`,
            borderTop:     `1.4px solid ${VANTARY.amber}`,
            transform:     `translateX(-50%) rotate(${direction === "down" ? 225 : 45}deg)`,
            borderTopLeftRadius: 1,
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], y: sign * (18 + i * 6) }}
          transition={{
            duration: 0.7,
            delay:    i * 0.06,
            ease:     "easeOut",
          }}
        />
      ))}
    </motion.span>
  )
}
