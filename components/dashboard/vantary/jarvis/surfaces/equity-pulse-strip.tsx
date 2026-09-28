"use client"

/* ════════════════════════════════════════════════════════════════════════
 *  JARVIS · SURFACE 2 · EQUITY PULSE STRIP
 *  ─────────────────────────────────────────────────────────────────────
 *  A two-cell auto-rotating editorial rail. Replaces the legacy six-cell
 *  data-spec box (TRADES · EXPECTANCY · AVG WIN · BEST · WORST · CAP USED)
 *  with a single rectangle that rotates through up to N "metric pairs"
 *  every 7 seconds. The eye lands on TWO numbers at rest, not six. The
 *  rest are reachable but quiet.
 *
 *  Three states (per the JARVIS doctrine):
 *    · IDLE      — the active pair is rendered as two stacked editorial
 *                  blocks side-by-side, separated by a single 1px hairline.
 *                  A row of N tick-dots beneath signals which pair is
 *                  active and how many sit in the rotation.
 *    · AWAKENED  — cursor enters the strip → rotation pauses, dots
 *                  brighten, and the active pair grows a quiet "pause
 *                  held" eyebrow. Hairline brightens to the awakened tone.
 *    · ENGAGED   — click a tick-dot → jump to that pair AND lock rotation.
 *                  Click the pinned pair OR the pause indicator → unlock.
 *
 *  CARD-SCOPED CUSTOMIZATION
 *    The strip is "slot-shaped". The host card decides which pairs sit
 *    in the rotation by passing a `pairs` array. The trader, in the
 *    card's customize panel, can re-order, hide, or add pairs (including
 *    DNA · EXPOSURE — promoted to a first-class slot here). The strip
 *    itself doesn't know about the customize UI; it just renders what
 *    it's given. This separation keeps the surface dumb and the
 *    customize architecture (a separate file) the single source of
 *    truth for slot configuration.
 *
 *  WIDTH-AWARENESS
 *    A ResizeObserver-driven 3-tier collapse runs internally:
 *      · full   (>= 360px) → two cells side-by-side, full ladder visible
 *      · narrow (>= 220px) → single cell at a time; rotation cycles
 *                            through left+right of every pair as separate
 *                            beats so the trader still sees both halves
 *      · minimum (< 220px) → strip hides itself entirely; the host should
 *                            not mount it at this width but we degrade
 *                            gracefully if it does
 * ════════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import {
  JARVIS_TX,
  JARVIS_TONE,
  JARVIS_RULE,
  JARVIS_RHYTHM,
  JARVIS_MOTION,
  JARVIS_CADENCE,
  JARVIS_WEIGHT,
  Tx,
  splitMagnitude,
} from "../index"

/* ─────────────────────────────────────────────────────────────────────────
 *  PUBLIC TYPES
 *  ───────────────────────────────────────────────────────────────────── */

/** A single half of a pulse pair. Renders as a label, a hero value
 *  (split into bold lead + light tail), and an optional sub-line.
 *
 *  `tone` controls the value tone. The label always stays in the
 *  quiet eyebrow tone — the value is the protagonist, the label is
 *  the supporting role. */
export interface PulseCell {
  /** Mono-caps label (e.g. "TRADES" / "WIN-RATE" / "DNA LONG%"). */
  label: string
  /** Pre-formatted value string (e.g. "5" / "80%" / "+0.82R"). */
  value: string
  /** Optional sub-caption rendered beneath at caption tone+size. */
  sub?:  string
  /** Tone resolution for the value. */
  tone:  "protag" | "amber" | "warnEdge" | "support"
}

/** A pulse pair — two cells that share a hairline divider. Each pair
 *  has a stable `id` so the customize layer can reference / re-order
 *  / hide it, and a stable `theme` keyword that surfaces (e.g. the
 *  rotation indicator) can use to color the active dot. */
export interface PulsePair {
  /** Stable id (e.g. "trades-winrate", "dna-exposure"). */
  id:    string
  /** Stable theme keyword for tinting the rotation dot. */
  theme: "default" | "amber" | "warn"
  /** The left cell. */
  left:  PulseCell
  /** The right cell. */
  right: PulseCell
}

export interface EquityPulseStripProps {
  /** The rotation. Order is the rotation order; first item is the
   *  initial active pair. Length 1 = no rotation, just a static pair. */
  pairs: PulsePair[]

  /** Override the rotation cadence in ms. Defaults to JARVIS_CADENCE.pulse
   *  (7000). Pass 0 to disable rotation entirely. */
  rotateMs?: number

  /** Optional className passthrough so the host can add layout margin
   *  without bleeding into the surface's internal rhythm. */
  className?: string
}

/* ─────────────────────────────────────────────────────────────────────────
 *  WIDTH TIER
 *  ───────────────────────────────────────────────────────────────────── */

type WidthTier = "full" | "narrow" | "minimum"

function tierFromWidth(w: number): WidthTier {
  if (w >= 360) return "full"
  if (w >= 220) return "narrow"
  return "minimum"
}

function useElementWidth<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = useRef<T | null>(null)
  const [w, setW] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === "undefined") return
    setW(el.getBoundingClientRect().width)
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setW(e.contentRect.width)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return [ref, w]
}

/* ─────────────────────────────────────────────────────────────────────────
 *  CELL — the editorial half-pair primitive
 *  ─────────────────────────────────────────────────────────────────────
 *  Three lines of typography stacked on a single baseline rhythm:
 *
 *    LABEL          ← 9.5px mono-caps eyebrow, quiet tone
 *    +$1,247        ← 22px sans-serif protagonist, lead/tail split
 *    vs prior       ← 10.5px mono caption, support tone (optional)
 *
 *  The hero value uses splitMagnitude() — bold lead + light tail — so
 *  every rectangle on the page that renders a hero numeral reads with
 *  the same visual signature. ─────────────────────────────────────── */

function Cell({
  label, value, sub, tone, tier,
}: PulseCell & { tier: WidthTier }) {
  const { lead, tail } = splitMagnitude(value)

  /* The hero size scales with width tier — same value, different
   * weight on the page. Locked to JARVIS_TX.protag.fontSize at full,
   * tightened at narrow so a single cell still reads as the protagonist
   * in a half-row. */
  const heroSize    = tier === "full" ? 22 : 19
  const heroSpacing = "-0.012em"

  const valueColor =
    tone === "amber"    ? JARVIS_TONE.amber    :
    tone === "warnEdge" ? JARVIS_TONE.warnEdge :
    tone === "support"  ? JARVIS_TONE.support  :
                          JARVIS_TONE.protag

  return (
    <div
      style={{
        display:        "flex",
        flexDirection:  "column",
        gap:            3,
        flex:           "1 1 0",
        minWidth:       0,
      }}
    >
      <Tx size="eyebrow" tone="quiet">
        {label}
      </Tx>

      <span
        className="font-sans tabular-nums"
        style={{
          fontSize:      heroSize,
          letterSpacing: heroSpacing,
          fontWeight:    JARVIS_WEIGHT.medium,
          color:         valueColor,
          lineHeight:    1.05,
          whiteSpace:    "nowrap",
          overflow:      "hidden",
          textOverflow:  "ellipsis",
        }}
      >
        <span style={{ fontWeight: JARVIS_WEIGHT.medium }}>{lead}</span>
        <span
          style={{
            fontWeight: JARVIS_WEIGHT.regular,
            opacity:    0.78,
            marginLeft: tail.length > 0 ? 1 : 0,
          }}
        >
          {tail}
        </span>
      </span>

      {sub && (
        <Tx size="caption" tone="quiet">
          {sub}
        </Tx>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  ROTATION DOTS — the active-pair indicator
 *  ─────────────────────────────────────────────────────────────────────
 *  N small dots in a row beneath the strip. The active dot is a 4px
 *  amber circle; inactive dots are 3px quiet circles. Clicking any
 *  dot jumps to that pair and pins the rotation; clicking the active
 *  dot un-pins. The hit-zone is intentionally larger than the dot
 *  itself — a 14px square invisible button — so the trader doesn't
 *  have to aim at a 4px target. (Fitts's law applied to a deliberately
 *  delicate visual.) ─────────────────────────────────────────────── */

function RotationDots({
  count, activeIdx, pinned, paused, onJump, onUnpin,
}: {
  count:     number
  activeIdx: number
  pinned:    boolean
  paused:    boolean
  onJump:    (i: number) => void
  onUnpin:   () => void
}) {
  if (count <= 1) return null
  return (
    <div
      role="tablist"
      aria-label="Pulse rotation"
      style={{
        display:     "flex",
        alignItems:  "center",
        gap:         6,
        marginTop:   JARVIS_RHYTHM.bay,
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const isActive = i === activeIdx
        return (
          <button
            key={i}
            role="tab"
            aria-selected={isActive}
            aria-label={`Pair ${i + 1} of ${count}`}
            onClick={() => (isActive && pinned ? onUnpin() : onJump(i))}
            type="button"
            style={{
              width:      14,
              height:     14,
              padding:    0,
              border:     "none",
              background: "transparent",
              cursor:     "pointer",
              display:    "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              aria-hidden
              style={{
                width:        isActive ? 4 : 3,
                height:       isActive ? 4 : 3,
                borderRadius: "50%",
                background:   isActive
                                ? (pinned ? JARVIS_TONE.amber : JARVIS_TONE.protag)
                                : JARVIS_TONE.quiet,
                opacity:      isActive ? 0.9 : 0.5,
                transition:   `background ${JARVIS_MOTION.awaken.duration}ms ease, opacity ${JARVIS_MOTION.awaken.duration}ms ease`,
              }}
            />
          </button>
        )
      })}

      {/* Status eyebrow on the right — only mounts when something is
       *  worth saying. Three editorial states:
       *    · pinned  → "PINNED · TAP DOT TO UNLOCK"
       *    · paused  → "PAUSED"
       *    · idle    → nothing (rotation is the silent default) */}
      <span aria-hidden style={{ flex: 1 }} />
      {(pinned || paused) && (
        <Tx size="eyebrow" tone={pinned ? "amber" : "quietest"}>
          {pinned ? "PINNED" : "PAUSED"}
        </Tx>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  THE STRIP
 *  ───────────────────────────────────────────────────────────────────── */

export function EquityPulseStrip({
  pairs,
  rotateMs = JARVIS_CADENCE.pulse,
  className,
}: EquityPulseStripProps) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const tier         = tierFromWidth(width)

  const [activeIdx,  setActiveIdx]  = useState(0)
  const [hoverPause, setHoverPause] = useState(false)
  const [pinned,     setPinned]     = useState(false)
  /* In narrow tier we rotate through "beats" — left half then right
   * half of the active pair as separate frames. This boolean tracks
   * which beat is current. */
  const [narrowBeat, setNarrowBeat] = useState<"left" | "right">("left")

  /* Clamp activeIdx whenever the rotation list shrinks (the customize
   * panel can drop a pair while the strip is mounted). */
  useEffect(() => {
    if (activeIdx >= pairs.length) setActiveIdx(0)
  }, [pairs.length, activeIdx])

  /* Rotation engine. Disabled when:
   *  · pairs.length <= 1  (nothing to rotate to)
   *  · rotateMs === 0     (host explicitly disabled rotation)
   *  · hoverPause === true (cursor is inside the strip)
   *  · pinned === true    (trader picked a specific pair)
   *
   * In narrow tier we rotate twice as fast (each beat = one cell)
   * so the trader still sees both halves of every pair within the
   * same window of attention as the full-tier rotation. */
  useEffect(() => {
    if (pairs.length <= 1) return
    if (rotateMs <= 0) return
    if (hoverPause || pinned) return

    const stride = tier === "narrow" ? Math.max(1500, Math.round(rotateMs / 2)) : rotateMs
    const id = window.setInterval(() => {
      if (tier === "narrow") {
        setNarrowBeat((b) => {
          if (b === "left") return "right"
          // wrapping right→left also advances the pair index
          setActiveIdx((i) => (i + 1) % pairs.length)
          return "left"
        })
      } else {
        setActiveIdx((i) => (i + 1) % pairs.length)
      }
    }, stride)
    return () => window.clearInterval(id)
  }, [pairs.length, rotateMs, hoverPause, pinned, tier])

  /* Reset the narrow beat whenever the trader pins a pair or jumps
   * via dot — a narrow strip should always return to the LEFT cell
   * of the new pair so the rotation reads predictably. */
  useEffect(() => { setNarrowBeat("left") }, [activeIdx, pinned])

  /* Tier minimum → degrade gracefully (host should not have mounted
   * us this small, but we render an empty placeholder rather than
   * exploding on a missing pair). */
  if (tier === "minimum" || pairs.length === 0) {
    return <div ref={ref} aria-hidden style={{ width: "100%" }} />
  }

  const active = pairs[activeIdx]

  return (
    <section
      ref={ref}
      aria-label="Equity pulse strip"
      className={className}
      onMouseEnter={() => setHoverPause(true)}
      onMouseLeave={() => setHoverPause(false)}
      style={{
        display:        "flex",
        flexDirection:  "column",
        minWidth:       0,
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${active.id}-${tier === "narrow" ? narrowBeat : "full"}`}
          initial={{ opacity: 0, y:  3 }}
          animate={{ opacity: 1, y:  0 }}
          exit={{    opacity: 0, y: -3 }}
          transition={{
            duration: JARVIS_MOTION.awaken.duration / 1000,
            ease:     JARVIS_MOTION.awaken.easeArray,
          }}
          style={{
            display:             "grid",
            gridTemplateColumns: tier === "full" ? "minmax(0,1fr) 1px minmax(0,1fr)" : "minmax(0,1fr)",
            alignItems:          "stretch",
            gap:                 tier === "full" ? JARVIS_RHYTHM.band : 0,
            paddingTop:          JARVIS_RHYTHM.tight,
            paddingBottom:       JARVIS_RHYTHM.tight,
          }}
        >
          {tier === "full" ? (
            <>
              <Cell {...active.left}  tier={tier} />
              <span
                aria-hidden
                style={{
                  width:      1,
                  background: hoverPause || pinned ? JARVIS_RULE.awakened.color : JARVIS_RULE.idle.color,
                  opacity:    hoverPause || pinned ? JARVIS_RULE.awakened.opacity : JARVIS_RULE.idle.opacity,
                  margin:     "3px 0",
                  transition: `background ${JARVIS_MOTION.awaken.duration}ms ease, opacity ${JARVIS_MOTION.awaken.duration}ms ease`,
                }}
              />
              <Cell {...active.right} tier={tier} />
            </>
          ) : (
            <Cell {...(narrowBeat === "left" ? active.left : active.right)} tier={tier} />
          )}
        </motion.div>
      </AnimatePresence>

      <RotationDots
        count={pairs.length}
        activeIdx={activeIdx}
        pinned={pinned}
        paused={hoverPause && !pinned}
        onJump={(i) => {
          setActiveIdx(i)
          setPinned(true)
        }}
        onUnpin={() => setPinned(false)}
      />
    </section>
  )
}
