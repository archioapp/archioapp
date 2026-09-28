"use client"

/* ════════════════════════════════════════════════════════════════════════
 *  JARVIS · SURFACE 3 · EQUITY PERIOD SPINE
 *  ─────────────────────────────────────────────────────────────────────
 *  Replaces the legacy three-button period-tabs row + the duplicate
 *  cadence stamp + the inline microspark + the secondary period label.
 *  The legacy row was the single biggest typographic-density violator on
 *  the card — four words that all said "this is the WEEK" stacked against
 *  each other.
 *
 *  This surface reduces all of that to ONE editorial line:
 *
 *      WEEK · MONTH · YEAR · LIFETIME            +$1,247
 *      ────                                       ─────
 *
 *  · Five mono-caps period names laid out as a single horizontal "spine"
 *    on the left, separated by a thin mid-dot character (·).
 *  · The active period is rendered in protag tone with a 1px amber
 *    underline that uses framer-motion `layoutId` to slide between
 *    selections — silky 220ms cross-period animation, zero pop-in.
 *  · On the right, a single mono-tabular net summary for the active
 *    period is rendered in the same delta-tone the protagonist band
 *    above is using. ONE editorial value, not three. The numeric eye
 *    that already lives on the protagonist gets a subtle echo here so
 *    the trader's gaze flows top-to-bottom without re-anchoring.
 *
 *  No bars, no SVG, no streak ribbons, no stamps. The spine is the
 *  surface — the data lives next to it, not under it.
 *
 *  ENGAGEMENT MODEL
 *    · IDLE       — period names in quiet tone, except active in protag.
 *                    Underline beneath active period.
 *    · AWAKENED   — hovering any period name lifts it to support tone
 *                    instantly so the trader pre-visualizes what tapping
 *                    will do. The underline does NOT move on hover (only
 *                    on click) so the trader doesn't get visual whiplash
 *                    while sweeping the cursor across the spine.
 *    · ENGAGED    — clicking a period dispatches `onChange(periodKey)`.
 *                    The underline slides with motion's layoutId to the
 *                    new selection.
 *
 *  WIDTH-AWARENESS
 *    A 3-tier collapse runs internally:
 *      · full   (>= 380px) → all configured periods + net summary
 *      · narrow (>= 260px) → all periods, net summary hidden
 *      · minimum (< 260px) → first 3 periods only, net summary hidden
 *
 *    The host can override the period list to a custom subset (e.g.
 *    "DAY · WEEK · MONTH" for a high-frequency trader) by passing a
 *    custom `periods` array. The customize panel writes to this prop.
 * ════════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { useLayoutEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

import {
  JARVIS_TX,
  JARVIS_TONE,
  JARVIS_RULE,
  JARVIS_RHYTHM,
  JARVIS_MOTION,
  JARVIS_WEIGHT,
  Tx,
} from "../index"
import { RollingNumber } from "../../flight-deck-motion"

/* ─────────────────────────────────────────────────────────────────────────
 *  PUBLIC TYPES
 *  ───────────────────────────────────────────────────────────────────── */

export interface PeriodEntry {
  /** Stable id (e.g. "week", "month", "year"). Used as the engaged
   *  callback's argument. */
  id:    string
  /** Mono-caps display label (e.g. "WEEK", "MONTH"). */
  label: string
  /** Pre-formatted net summary for THIS period (e.g. "+$1,247").
   *  The spine renders this in the active period's net summary slot
   *  on the right; non-active periods don't render this anywhere. */
  net:   string
  /** Tone for the net summary when this period is active. */
  tone:  "amber" | "warnEdge" | "support" | "protag"
  /** Optional editorial tail rendered in JARVIS_TONE.quietest
   *  immediately to the right of the net summary. Use it to add a
   *  genuinely-new piece of period intelligence the trader doesn't
   *  already see in the protagonist band — examples:
   *
   *      tail: "5 TRD"           — period trade count
   *      tail: "82% WIN"         — period win rate
   *      tail: "8.2R OF 12R"     — risk consumption vs cap
   *
   *  Mounts only when the period is active AND we're at full width.
   *  Set undefined to suppress entirely (default). */
  tail?: string
}

export interface EquityPeriodSpineProps {
  /** The list of periods to render in the spine. Order is the visual
   *  order. The host owns this list — the customize panel writes to it. */
  periods:  PeriodEntry[]
  /** The currently-active period's id. Must match a `periods[i].id`. */
  activeId: string
  /** Engaged callback. Fires when the trader clicks a period name. */
  onChange: (id: string) => void
  /** Optional className passthrough. */
  className?: string
}

/* ─────────────────────────────────────────────────────────────────────────
 *  WIDTH TIER
 *  ───────────────────────────────────────────────────────────────────── */

type WidthTier = "full" | "narrow" | "minimum"

function tierFromWidth(w: number): WidthTier {
  if (w >= 380) return "full"
  if (w >= 260) return "narrow"
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
 *  THE SPINE
 *  ───────────────────────────────────────────────────────────────────── */

export function EquityPeriodSpine({
  periods, activeId, onChange, className,
}: EquityPeriodSpineProps) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const tier         = tierFromWidth(width)

  const visiblePeriods = tier === "minimum" ? periods.slice(0, 3) : periods
  const showNet        = tier === "full"

  const active = periods.find((p) => p.id === activeId) ?? periods[0]

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label="Period selector"
      className={className}
      style={{
        display:        "flex",
        alignItems:     "baseline",
        justifyContent: "space-between",
        gap:            JARVIS_RHYTHM.band,
        minWidth:       0,
        paddingTop:     JARVIS_RHYTHM.bay,
        paddingBottom:  JARVIS_RHYTHM.tight,
      }}
    >
      {/* ── Spine ─────────────────────────────────────────────────────
       *  The five (or fewer) period names laid horizontally with a
       *  mid-dot separator between them. The active period gets the
       *  amber underline that animates between selections via
       *  layoutId. */}
      <div
        style={{
          display:    "flex",
          alignItems: "baseline",
          flexWrap:   "wrap",
          rowGap:     JARVIS_RHYTHM.tight,
          minWidth:   0,
        }}
      >
        {visiblePeriods.map((p, i) => {
          const isActive  = p.id === active?.id
          const isLast    = i === visiblePeriods.length - 1
          return (
            <React.Fragment key={p.id}>
              <PeriodToken
                label={p.label}
                isActive={isActive}
                onClick={() => onChange(p.id)}
              />
              {!isLast && (
                <span
                  aria-hidden
                  style={{
                    fontFamily:    "var(--font-mono, ui-monospace, monospace)",
                    fontSize:      JARVIS_TX.eyebrow.fontSize,
                    color:         JARVIS_TONE.quietest,
                    margin:        `0 ${JARVIS_RHYTHM.bay}px`,
                    userSelect:    "none",
                    letterSpacing: "0.18em",
                  }}
                >
                  ·
                </span>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* ── Net summary on the right ──────────────────────────────────
       *  Single mono-tabular value, tone matched to the active period.
       *  Only mounts at full width — at narrow / minimum the trader
       *  has the protagonist band above for the same number, so the
       *  spine collapses to its essence.
       *
       *  When the host wires up an editorial `tail` on the active
       *  period (e.g. "5 TRD" / "82% WIN"), it renders in the
       *  quietest tone immediately to the right of the net so the
       *  spine reads as ONE editorial line:
       *
       *      WEEK · MONTH · YEAR        +$1,247 · 5 TRD
       *
       *  The mid-dot separator inherits JARVIS_RULE.idle so it sits
       *  visually below the net but above the rule beneath the spine. */}
      {showNet && active && (
        <span
          className="inline-flex items-baseline"
          aria-live="polite"
          style={{ gap: 6, whiteSpace: "nowrap" }}
        >
          <span
            className="font-mono tabular-nums"
            style={{
              fontSize:      JARVIS_TX.body.fontSize,
              lineHeight:    JARVIS_TX.body.lineHeight,
              letterSpacing: JARVIS_TX.body.letterSpacing,
              fontWeight:    JARVIS_WEIGHT.medium,
              color:
                active.tone === "amber"    ? JARVIS_TONE.amber    :
                active.tone === "warnEdge" ? JARVIS_TONE.warnEdge :
                active.tone === "support"  ? JARVIS_TONE.support  :
                                             JARVIS_TONE.protag,
            }}
          >
            <RollingNumber value={active.net} digitHeight={JARVIS_TX.body.fontSize} />
          </span>

          {active.tail && (
            <>
              <span
                aria-hidden
                style={{
                  fontFamily:    "var(--font-mono, ui-monospace, monospace)",
                  fontSize:      JARVIS_TX.eyebrow.fontSize,
                  letterSpacing: "0.18em",
                  color:         JARVIS_RULE.idle.color,
                  opacity:       0.7,
                  userSelect:    "none",
                }}
              >
                ·
              </span>
              <span
                className="font-mono uppercase tabular-nums"
                style={{
                  fontSize:      JARVIS_TX.eyebrow.fontSize,
                  lineHeight:    JARVIS_TX.eyebrow.lineHeight,
                  letterSpacing: JARVIS_TX.eyebrow.letterSpacing,
                  fontWeight:    JARVIS_WEIGHT.regular,
                  color:         JARVIS_TONE.quietest,
                }}
              >
                {active.tail}
              </span>
            </>
          )}
        </span>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  PERIOD TOKEN — one editorial period name with click affordance
 *  ───────────────────────────────────────────────────────────────────── */

function PeriodToken({
  label, isActive, onClick,
}: {
  label:    string
  isActive: boolean
  onClick:  () => void
}) {
  const [hover, setHover] = useState(false)

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      type="button"
      style={{
        position:      "relative",
        padding:       `2px 0 6px 0`,
        background:    "transparent",
        border:        "none",
        cursor:        isActive ? "default" : "pointer",
        font:          "inherit",
        outline:       "none",
      }}
    >
      <span
        className="font-mono uppercase select-none"
        style={{
          fontSize:      JARVIS_TX.eyebrow.fontSize,
          lineHeight:    JARVIS_TX.eyebrow.lineHeight,
          letterSpacing: JARVIS_TX.eyebrow.letterSpacing,
          fontWeight:    isActive ? JARVIS_WEIGHT.medium : JARVIS_WEIGHT.regular,
          color:
            isActive ? JARVIS_TONE.protag :
            hover    ? JARVIS_TONE.support :
                       JARVIS_TONE.quiet,
          transition: `color ${JARVIS_MOTION.awaken.duration}ms ease`,
        }}
      >
        {label}
      </span>

      {/* The LIQUID underline. layoutId ties every PeriodToken's
       *  underline together — when active changes, the underline
       *  glides from the previous token to the new one. Phase 3 upgrade:
       *  it is now a 2px rounded bar with an accent glow and a spring
       *  settle (slight overshoot), reading like a liquid marker that
       *  flows between periods rather than a hard rule that teleports. */}
      {isActive && (
        <motion.span
          layoutId="jarvis-period-spine-underline"
          aria-hidden
          style={{
            position:     "absolute",
            left:         0,
            right:        0,
            bottom:       0,
            height:       2,
            borderRadius: 999,
            background:   JARVIS_TONE.amber,
            boxShadow:    `0 0 8px ${JARVIS_TONE.amber}, 0 1px 4px ${JARVIS_TONE.amber}`,
          }}
          transition={{ type: "spring", stiffness: 380, damping: 30, mass: 0.7 }}
        />
      )}
    </button>
  )
}
