"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  STRATEGY OS · COMMAND HEADER  (EPIC B · MILESTONES B1 – B10)
 *  ─────────────────────────────────────────────────────────────────────────
 *  This file is the *masthead* of the Strategy OS — every visual surface
 *  above the four INTEL slabs (MIRROR / RULES / EXPOSURE / DNA) lives in
 *  here. Reading top-to-bottom in the rendered dashboard:
 *
 *      ┌─ B1 EYEBROW ROW ──────────────────────────────────────────┐
 *      │  ● STRATEGY OS                              PLAN 2/6  ◂ ▸│
 *      ├─ B2-B4 IDENTITY ROW ─────────────────────────────────────┤
 *      │  ╭──╮                                                ┌──┐│
 *      │  │82│  STRATEGY OS  ● OPTIMAL                        │△2││
 *      │  │ C│  1 rule below threshold. No trading after …    └──┘│
 *      │  ╰──╯                                                     │
 *      ├─ B5-B6 NERVE GRID ───────────────────────────────────────┤
 *      │  ┌DISC─SCORE─┐ ┌COMMITMENTS┐ ┌USD-WEIGHT┐ ┌HYBRID──────┐│
 *      │  │   82      │ │   6  •    │ │  50%  •  │ │  HYBRID    ││
 *      │  │           │ │           │ │          │ │ 63% PATIENC││
 *      │  └───────────┘ └───────────┘ └──────────┘ └───────────┘│
 *      ├─ B7 TAB STRIP ───────────────────────────────────────────┤
 *      │   MIRROR    RULES    EXPOSURE    DNA                      │
 *      │   ━━━━━━ <-- amber underline animates with layoutId      │
 *      └───────────────────────────────────────────────────────────┘
 *
 *  Every datum in here is read from `useStrategyOs()` — there is no
 *  prop-drilling, no local fixture state. The header is therefore
 *  *fully theme-aware*: switching VANTARY palette via the theme
 *  switcher recolours the OS instantly because every colour comes from
 *  the bound `palette` / `tone` map that the provider exposes.
 *
 *  Motion model
 *  ────────────────────────────────────────────────────────────────────────
 *    · The discipline ring fills with a single spring on mount /
 *      score-change (1.2s, ease [0.65,0,0.35,1]). Reduced-motion users
 *      get the static endpoint with no fill animation.
 *    · The OPTIMAL chip pip pulses 1.4s every 5.5s when the OS is in
 *      OPTIMAL posture; goes static for ACTIVE / ALERT.
 *    · The alert triangle nudges +Y -1px on jump-to-breaches, and the
 *      red badge does a single 1.04× scale-pop when the count goes up.
 *    · Hover micro-charts on each nerve card fade in on a 180ms ease,
 *      and the underlying value blurs ½px to push focus onto the chart.
 *    · The tab underline uses framer-motion's `layoutId` so the amber
 *      bar slides smoothly between tabs instead of fading.
 *
 *  Accessibility (B10)
 *  ────────────────────────────────────────────────────────────────────────
 *    · The whole header is wrapped in a `<header role="banner">`.
 *    · The discipline ring is `<div role="img" aria-label>`.
 *    · The status sentence is `<p role="status" aria-live="polite">`
 *      so screen readers announce when the breach count changes.
 *    · The tab strip is a proper `role="tablist"` with `role="tab"`
 *      children and `aria-selected` toggles.
 *    · The nerve cards are `<button>`s — clickable, keyboard reachable,
 *      Enter/Space dispatches a `JUMP_TO_*` action, Tab cycles them
 *      naturally.
 *    · The plan navigator arrows have `aria-label="Previous plan"`
 *      / `Next plan` and the plan dots themselves are keyboard-reachable.
 *    · Keyboard map (B9):
 *          1 / 2 / 3 / 4   →  jump to MIRROR / RULES / EXPOSURE / DNA
 *          M / R / E / D   →  same (first-letter shortcut)
 *          ← / →           →  prev / next plan
 *          ?               →  open guide drawer (placeholder; EPIC H)
 *      Shortcuts only fire when the header is focused or no input has
 *      focus, so the trader can still type into the command palette.
 *    · Reduced-motion users get static endpoints for every animation
 *      via `useReducedMotion()`.
 * ═══════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  useReducedMotion,
} from "framer-motion"
import {
  Eye,
  Shield,
  Target,
  Crosshair,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from "lucide-react"
import { useStrategyOs } from "./provider"
import type { OsTabKey } from "./data"
import {
  OS_BREACH_THRESHOLD,
  OS_USD_WEIGHT_RED_DOT,
} from "./data"
import { FlightProfileGlyph } from "./flight-profile-glyphs"

/* ═══════════════════════════════════════════════════════════════════════════
 *  LOCAL CONSTANTS  ·  shared timing + sizing
 * ═══════════════════════════════════════════════════════════════════════ */
const EASE_OS = [0.65, 0, 0.35, 1] as const
const RING_SIZE = 86          // outer pixel size of the DisciplineRing82
const RING_RADIUS = 38        // inner radius of the fill arc
const RING_STROKE = 1.5       // hairline stroke width
const NERVE_HEIGHT = 92       // baseline height of a nerve card
const SPARK_HEIGHT = 18       // micro-chart height on hover

/* ═══════════════════════════════════════════════════════════════════════════
 *  B2 · DisciplineRing82
 *  ─────────────────────────────────────────────────────────────────────────
 *  An 86×86 SVG ring with the discipline score numeral centered on top
 *  of a hairline grade letter. Three layers:
 *
 *      1. Track          — `palette.amberHalo`, full circle, 1.5px
 *      2. Fill arc       — `palette.amber`, length proportional to
 *                          `score / 100`, animates from 0 → fill on
 *                          mount, then springs to new fill on score-
 *                          change.
 *      3. Centre label   — score (mono 20px, amber, tabular-nums)
 *                          + grade letter (mono 8px, ashSoft)
 *
 *  Why hand-rolled SVG instead of recharts?
 *  ────────────────────────────────────────────────────────────────────────
 *  recharts radial-bars carry their own padding, label, legend, and
 *  tooltip overhead. For a single ~80px ring that we want to behave
 *  exactly like the rest of VANTARY's brutalist hairlines, raw SVG is
 *  smaller, faster, and lets us match the editorial line-weight
 *  perfectly.
 *
 *  Threshold pulses
 *  ────────────────────────────────────────────────────────────────────────
 *  When the score crosses an OPTIMAL/ACTIVE/ALERT threshold (80 / 60),
 *  the ring's *track* (not the fill) does a single soft-glow flash to
 *  draw the eye. The fill itself doesn't blink — it just settles to its
 *  new endpoint. This keeps the ring itself a calm reference point
 *  while signalling "something changed".
 * ═══════════════════════════════════════════════════════════════════════ */
function DisciplineRing82() {
  const { state, palette } = useStrategyOs()
  const reduceMotion = useReducedMotion()
  const score = state.derived.disciplineScore
  const grade = state.derived.mirror.riskGrade
  const posture = state.derived.posture

  const C = 2 * Math.PI * RING_RADIUS
  const fill = Math.max(0, Math.min(1, score / 100))
  // Soft pulse the *track* (not the fill) once when posture changes.
  // Using state of `posture` as the dependency gives us a single re-run
  // each time the verdict crosses a band.
  const [pulseKey, setPulseKey] = useState(0)
  useEffect(() => {
    if (reduceMotion) return
    setPulseKey((k) => k + 1)
  }, [posture, reduceMotion])

  return (
    <div
      role="img"
      aria-label={`Discipline score ${score} of 100, grade ${grade}, posture ${posture}`}
      className="relative shrink-0"
      style={{ width: RING_SIZE, height: RING_SIZE }}
    >
      <svg
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        width={RING_SIZE}
        height={RING_SIZE}
        aria-hidden
      >
        {/* — track — */}
        <motion.circle
          key={`track-${pulseKey}`}
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          stroke={palette.amberHalo}
          strokeWidth={RING_STROKE}
          initial={false}
          animate={
            reduceMotion
              ? false
              : { strokeWidth: [RING_STROKE, RING_STROKE * 2.6, RING_STROKE] }
          }
          transition={{ duration: 0.8, ease: EASE_OS }}
        />
        {/* — fill arc — */}
        <motion.circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          stroke={palette.amber}
          strokeWidth={RING_STROKE}
          strokeDasharray={C}
          strokeLinecap="round"
          transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
          // Start drawn-out, fill in. After mount, this animates to new
          // values whenever `fill` changes.
          initial={reduceMotion ? false : { strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - fill) }}
          transition={{
            duration: reduceMotion ? 0 : 1.2,
            ease: EASE_OS,
          }}
        />
      </svg>

      {/* — centre label — */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ gap: 0 }}
      >
        <span
          className="font-mono tabular-nums"
          style={{
            fontSize: 22,
            color: palette.amber,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {score}
        </span>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 8.5,
            color: palette.ashSoft,
            letterSpacing: "0.22em",
            marginTop: 2,
          }}
        >
          {grade}
        </span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  B3 · PostureChip
 *  ─────────────────────────────────────────────────────────────────────────
 *  The chip beside the title that reads OPTIMAL / ACTIVE / ALERT. Carries
 *  a small leading pip (amber for OPTIMAL, paper for ACTIVE, paperDim
 *  for ALERT) that pulses gently on OPTIMAL only.
 * ═══════════════════════════════════════════════════════════════════════ */
function PostureChip() {
  const { state, palette, tone } = useStrategyOs()
  const reduceMotion = useReducedMotion()
  const posture = state.derived.posture
  const pipColor = tone(posture.toLowerCase() as "optimal" | "active" | "alert")
  // Border / bg follow the same pip color but at halo / wash intensity.
  const accent =
    posture === "OPTIMAL"
      ? { border: palette.amberHalo, bg: palette.amberWash, text: palette.amber }
      : posture === "ACTIVE"
        ? { border: palette.rule, bg: "transparent", text: palette.paper }
        : { border: palette.rule, bg: "transparent", text: palette.paperDim }

  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono uppercase"
      style={{
        fontSize: 9,
        letterSpacing: "0.22em",
        fontWeight: 500,
        padding: "2px 8px",
        border: `1px solid ${accent.border}`,
        background: accent.bg,
        color: accent.text,
        borderRadius: 99,
        lineHeight: 1.4,
      }}
    >
      <motion.span
        aria-hidden
        className="rounded-full inline-block"
        style={{ width: 5, height: 5, background: pipColor }}
        animate={
          reduceMotion || posture !== "OPTIMAL"
            ? false
            : {
                opacity: [1, 0.55, 1],
                scale: [1, 1.18, 1],
                boxShadow: [
                  `0 0 0px ${pipColor}`,
                  `0 0 5px ${pipColor}`,
                  `0 0 0px ${pipColor}`,
                ],
              }
        }
        transition={{
          duration: 1.4,
          repeat: Infinity,
          repeatDelay: 4.2,
          ease: "easeInOut",
        }}
      />
      {posture}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  B3 · StatusSentence
 *  ─────────────────────────────────────────────────────────────────────────
 *  The italic line under the title. Reads:
 *
 *    "{breachedCount} rule[s] below threshold. {firstBreached.rule} at
 *     {adherence}%."
 *
 *  When zero rules are breached we fall back to the synthesis line that
 *  the derive layer produces (`state.derived.contextLine`). Wrapped in
 *  a `role="status"` aria-live region so SR users hear updates.
 * ═══════════════════════════════��═══════════════════════════════════════ */
function StatusSentence() {
  const { state, palette } = useStrategyOs()
  const breachedIds = state.derived.breachedRuleIds
  const breachedCount = breachedIds.length
  const firstBreached =
    breachedCount > 0 ? state.rules.find((r) => r.id === breachedIds[0]) : undefined

  let content: React.ReactNode
  if (firstBreached) {
    const noun = breachedCount === 1 ? "rule" : "rules"
    content = (
      <>
        <span style={{ color: palette.paper }}>
          {breachedCount} {noun} below threshold.
        </span>{" "}
        <span style={{ color: palette.paperDim }}>
          {firstBreached.rule} at {firstBreached.adherence}%.
        </span>
      </>
    )
  } else {
    content = (
      <span style={{ color: palette.paperDim }}>{state.derived.contextLine}</span>
    )
  }

  return (
    <p
      role="status"
      aria-live="polite"
      className="font-mono leading-snug"
      style={{
        fontSize: 11.5,
        letterSpacing: "0.005em",
        marginTop: 4,
        textWrap: "pretty",
      }}
    >
      {content}
    </p>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  B4 · AlertTriangleBadge
 *  ─────────────────────────────────────────────────────────────────────────
 *  The hairline-bordered triangle on the right side of the identity row,
 *  with a count badge in its top-right corner. Click → `jumpToBreaches`,
 *  Enter/Space same. Pulse-pops once when the count rises (we track the
 *  previous count in a ref to detect the rising edge).
 *
 *  Visual model
 *  ────────────────────────────────────────────────────────────────────────
 *      ┌────────┐ ◀ 22×22 hairline square
 *      │   △    │
 *      └────────┘
 *           ●  ◀ 11×11 pip overlapping top-right corner
 *
 *  When count is 0 the badge hides entirely and the triangle dims to
 *  `palette.ashSoft`.
 * ═══════════════════════════════════════════════════════════════════════ */
function AlertTriangleBadge() {
  const { state, actions, palette } = useStrategyOs()
  const reduceMotion = useReducedMotion()
  const count = state.derived.redDotCount

  // Pulse pop on rising edge.
  const prevCountRef = useRef(count)
  const [popKey, setPopKey] = useState(0)
  useEffect(() => {
    if (count > prevCountRef.current) setPopKey((k) => k + 1)
    prevCountRef.current = count
  }, [count])

  const dim = count === 0
  const triColor = dim ? palette.ashSoft : palette.amber
  const borderColor = dim ? palette.rule : palette.amberHalo
  const bgColor = dim ? "transparent" : palette.amberWash

  return (
    <button
      type="button"
      onClick={() => count > 0 && actions.jumpToBreaches()}
      aria-label={
        count === 0
          ? "No active alerts"
          : `${count} active alerts. Jump to breached rules.`
      }
      disabled={count === 0}
      className="relative inline-flex items-center justify-center focus:outline-none"
      style={{
        width: 28,
        height: 28,
        border: `1px solid ${borderColor}`,
        background: bgColor,
        cursor: count === 0 ? "default" : "pointer",
        transition: "border-color 220ms, background-color 220ms",
      }}
    >
      <AlertTriangle
        aria-hidden
        size={12}
        strokeWidth={1.5}
        color={triColor}
        style={{ transition: "color 220ms" }}
      />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={`pop-${popKey}`}
            aria-hidden
            initial={
              reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 }
            }
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.22, ease: EASE_OS }}
            className="absolute font-mono tabular-nums flex items-center justify-center"
            style={{
              top: -6,
              right: -6,
              width: 14,
              height: 14,
              fontSize: 8.5,
              fontWeight: 600,
              letterSpacing: "0",
              color: palette.amber,
              background: palette.ink ?? "rgba(0,0,0,0.85)",
              border: `1px solid ${palette.amberHalo}`,
              borderRadius: 99,
              boxShadow: `0 0 6px ${palette.amberWash}`,
            }}
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  Sparkline · the on-hover micro-chart
 *  ─────────────────────────────────────────────────────────────────────────
 *  7-bar mini chart that renders inside a nerve card on hover/focus.
 *  Values are normalised 0..1; bars fill upward from the baseline. Zero-
 *  values render a hairline at the baseline so dead days still register.
 * ═══════════════════════════════════════════════════════════════════════ */
function Sparkline({
  values,
  max,
  color,
  height = SPARK_HEIGHT,
  bars = 7,
}: {
  values: number[]
  max?: number
  color: string
  height?: number
  bars?: number
}) {
  const reduceMotion = useReducedMotion()
  const peak = useMemo(() => {
    if (max != null) return max
    return Math.max(1, ...values.map((v) => Math.abs(v)))
  }, [values, max])

  const list = useMemo(() => {
    // Normalise / pad to `bars` length.
    const padded = values.slice(-bars)
    while (padded.length < bars) padded.unshift(0)
    return padded.map((v) => Math.max(0, Math.min(1, v / peak)))
  }, [values, peak, bars])

  return (
    <div
      className="flex items-end"
      role="img"
      aria-hidden
      style={{
        height,
        gap: 3,
      }}
    >
      {list.map((n, i) => {
        const h = Math.max(1, n * height)
        return (
          <motion.span
            key={i}
            initial={false}
            animate={
              reduceMotion ? false : { height: h }
            }
            transition={{ duration: 0.4, delay: i * 0.03, ease: EASE_OS }}
            style={{
              width: 4,
              height: h,
              background: color,
              opacity: n === 0 ? 0.35 : 0.85,
              borderRadius: 1,
            }}
          />
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  B5+B6 · NerveCard
 *  ─────────────────────────────────────────────────────────────────────────
 *  One of the four cards in the nerve grid. Carries:
 *
 *      · icon (top-left)
 *      · big tabular-nums value (centre)
 *      · mono-caps label (bottom)
 *      · optional red-dot warning (top-right)
 *      · on hover: 7-bar sparkline replaces the value with a soft fade;
 *                  the value blurs ½px to recede.
 *
 *  Each card is keyboard-reachable. Enter/Space dispatches a JUMP_TO_*
 *  for the relevant tab so a trader pressing into the COMMITMENTS card
 *  is taken to the RULES INTEL slab.
 * ═══════════════════════════════════════════════════════════════════════ */
type NerveTone = "amber" | "paper"

interface NerveCardProps {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>
  label: string
  value: React.ReactNode
  /** sublabel under the value, e.g. "63% EXEC PATIENCE" */
  sub?: React.ReactNode
  /** show the red dot? */
  warn?: boolean
  /** which tab to jump to when activated (Enter/Space/click) */
  jumpTo?: OsTabKey
  /** sparkline data */
  spark?: { values: number[]; max?: number }
  /** value tone — amber for the prominent reading, paper for muted */
  tone?: NerveTone
  /** wider grid cell? (true on the HYBRID card to fit the sublabel) */
  span?: 1 | 2
  /** aria-label override */
  ariaLabel?: string
}

function NerveCard({
  icon: Icon,
  label,
  value,
  sub,
  warn = false,
  jumpTo,
  spark,
  tone = "paper",
  ariaLabel,
}: NerveCardProps) {
  const { palette, actions } = useStrategyOs()
  const reduceMotion = useReducedMotion()
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const lit = hovered || focused

  const valueColor = tone === "amber" ? palette.amber : palette.paper

  return (
    <button
      type="button"
      onClick={() => jumpTo && actions.selectTab(jumpTo)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          if (jumpTo) actions.selectTab(jumpTo)
        }
      }}
      aria-label={ariaLabel ?? `${label}: ${typeof value === "string" ? value : ""}${warn ? ". Warning active." : ""}`}
      className="relative flex flex-col items-center justify-center text-left focus:outline-none"
      style={{
        height: NERVE_HEIGHT,
        padding: "10px 12px",
        background: lit ? "rgba(255,255,255,0.018)" : "transparent",
        border: `1px solid ${lit ? palette.amberHalo : palette.rule}`,
        cursor: jumpTo ? "pointer" : "default",
        transition:
          "border-color 220ms, background-color 220ms, box-shadow 220ms",
        boxShadow: lit
          ? `0 0 14px ${palette.amberWash}`
          : "0 0 0 transparent",
        outline: "none",
      }}
    >
      {/* — icon (top, centred) — */}
      <Icon size={14} strokeWidth={1.5} color={palette.ashSoft} />

      {/* — value / sparkline cross-fade — */}
      <div
        className="relative flex items-center justify-center"
        style={{ marginTop: 6, height: 22, width: "100%" }}
      >
        <AnimatePresence initial={false} mode="wait">
          {!lit || !spark ? (
            <motion.span
              key="value"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(0.6px)" }}
              transition={{ duration: 0.18, ease: EASE_OS }}
              className="font-mono tabular-nums"
              style={{
                fontSize: 20,
                color: valueColor,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}
            >
              {value}
            </motion.span>
          ) : (
            <motion.div
              key="spark"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: EASE_OS }}
            >
              <Sparkline
                values={spark.values}
                max={spark.max}
                color={tone === "amber" ? palette.amber : palette.paper}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* — label — */}
      <span
        className="font-mono uppercase"
        style={{
          fontSize: 8,
          letterSpacing: "0.24em",
          color: palette.ashSoft,
          fontWeight: 500,
          marginTop: 6,
          textAlign: "center",
        }}
      >
        {label}
      </span>
      {sub && (
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 7.5,
            letterSpacing: "0.20em",
            color: palette.paperDim,
            fontWeight: 500,
            marginTop: 2,
            textAlign: "center",
          }}
        >
          {sub}
        </span>
      )}

      {/* — red-dot warning — */}
      {warn && (
        <span
          aria-hidden
          className="absolute rounded-full"
          style={{
            top: 8,
            right: 8,
            width: 6,
            height: 6,
            background: palette.amber,
            boxShadow: `0 0 5px ${palette.amberHalo}`,
          }}
        />
      )}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  B7 · TabStrip
 *  ─────────────────────────────────────────────────────────────────────────
 *  Four flat mono-caps tab buttons with an amber underline that uses
 *  framer-motion's `layoutId` so the bar slides smoothly between tabs.
 *  Hover lifts the resting tab text from `paperDim` to `paper` and
 *  reveals a faint underline-stub so the hit-target is obvious.
 *
 *  Each tab carries:
 *      key        ←→ OsTabKey
 *      label      ←→ "MIRROR" / "RULES" / "EXPOSURE" / "DNA"
 *      hotkey     "1" / "2" / "3" / "4"  (rendered as a small badge)
 *      count      a tiny tabular-nums chip (e.g. RULES carries
 *                 commitmentsCount; EXPOSURE shows usdWeight%; etc.)
 *
 *  Implements:
 *      role="tablist"
 *      role="tab" + aria-selected on each button
 * ═══════════════════════════════════════════════════════════════════════ */
function TabStrip() {
  const { state, actions, palette, tabs } = useStrategyOs()
  const reduceMotion = useReducedMotion()
  const selected = state.selectedTab

  // Each tab gets a small badge — count of commitments, breaches, etc.
  const counts: Record<OsTabKey, string | null> = {
    mirror:   `${Math.round(state.derived.disciplineScore)}`,
    rules:    `${state.derived.commitmentsCount}`,
    exposure: `${Math.round(state.derived.usdWeightPct * 100)}%`,
    dna:      state.derived.archetypeLabel.slice(0, 3),
  }
  const hotkeys: Record<OsTabKey, string> = {
    mirror: "1", rules: "2", exposure: "3", dna: "4",
  }

  return (
    <div className="flex flex-col">
      {/* ─── FLIGHT PROFILE BRAND EYEBROW ─────────────────────────────
       * A single line of mono-caps copy positioned just above the tab
       * row, communicating the surface identity. Replaces the old
       * heavyweight "STRATEGY OS · OPTIMAL · 1 rule below threshold"
       * IdentityRow that used to live here. The data the IdentityRow
       * encoded is now visible in the headline strip beside the
       * $113,866 protagonist number, so this banner is just the
       * surface name + a short intent line. */}
      <div
        className="flex items-center gap-2"
        style={{
          paddingTop:    16,
          paddingBottom: 10,
        }}
      >
        <span
          aria-hidden
          className="inline-block rounded-full"
          style={{
            width:      4,
            height:     4,
            background: palette.amber,
            boxShadow:  `0 0 5px ${palette.amber}`,
          }}
        />
        <span
          className="font-mono uppercase"
          style={{
            fontSize:      9.5,
            letterSpacing: "0.26em",
            color:         palette.paper,
            fontWeight:    600,
          }}
        >
          Flight Profile
        </span>
        <span aria-hidden style={{ width: 1, height: 10, background: palette.rule }} />
        <span
          className="font-sans"
          style={{
            fontSize:  11,
            color:     palette.ashSoft,
            fontStyle: "italic",
          }}
        >
          your trader-pilot identity at the controls
        </span>
        <span aria-hidden className="flex-1" />
      </div>

      <div
        role="tablist"
        aria-label="Flight Profile sections"
        className="flex items-stretch"
        style={{ borderTop: `1px solid ${palette.rule}` }}
      >
        <LayoutGroup id="os-tab-strip">
          {tabs.map(({ key, label }, i) => {
            const isActive = selected === key
            return (
              <TabButton
                key={key}
                tabKey={key}
                label={label}
                hotkey={hotkeys[key]}
                count={counts[key]}
                isActive={isActive}
                onSelect={() => actions.selectTab(key)}
                palette={palette}
                reduceMotion={reduceMotion}
                showRightDivider={i < tabs.length - 1}
              />
            )
          })}
        </LayoutGroup>
      </div>
    </div>
  )
}

function TabButton({
  tabKey,
  label,
  hotkey,
  count,
  isActive,
  onSelect,
  palette,
  reduceMotion,
  showRightDivider,
}: {
  tabKey: OsTabKey
  label: string
  hotkey: string
  count: string | null
  isActive: boolean
  onSelect: () => void
  palette: ReturnType<typeof useStrategyOs>["palette"]
  reduceMotion: boolean | null
  showRightDivider: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const lit = hovered || focused
  const labelColor = isActive
    ? palette.amber
    : lit
      ? palette.paper
      : palette.paperDim

  return (
    <button
      type="button"
      role="tab"
      id={`os-tab-${tabKey}`}
      aria-controls={`os-panel-${tabKey}`}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="relative flex-1 flex items-center justify-center gap-2.5 focus:outline-none"
      style={{
        padding: "14px 10px",
        background: isActive
          ? palette.amberWash
          : lit
            ? "rgba(255,255,255,0.018)"
            : "transparent",
        borderRight: showRightDivider ? `1px solid ${palette.rule}` : "none",
        cursor: "pointer",
        transition: "background-color 200ms",
        color: labelColor, /* feeds currentColor into the glyph below */
      }}
    >
      {/* ─── HAND-CRAFTED SVG GLYPH ─────────────────────────────────
       * One per tab — see <FlightProfileGlyph/> for anatomy. The
       * glyph inherits its colour from the parent button's `color`
       * (set above based on isActive/lit/idle), and the accent
       * resolves to amber when the tab is active so the inner dot
       * lights up while the rest of the strokes follow the text
       * colour. */}
      <FlightProfileGlyph
        kind={tabKey}
        size={18}
        color={labelColor}
        accent={isActive ? palette.amber : palette.amberHalo}
        strokeWidth={1.4}
      />
      <span
        className="font-mono uppercase"
        style={{
          fontSize: 9.5,
          letterSpacing: "0.26em",
          color: labelColor,
          fontWeight: isActive ? 600 : 500,
          transition: "color 180ms",
        }}
      >
        {label}
      </span>
      {count != null && (
        <span
          className="font-mono tabular-nums"
          style={{
            fontSize: 8.5,
            letterSpacing: "0.06em",
            color: isActive ? palette.amber : palette.ashSoft,
            padding: "0px 5px",
            border: `1px solid ${isActive ? palette.amberHalo : palette.rule}`,
            borderRadius: 99,
            background: "transparent",
            lineHeight: 1.3,
          }}
        >
          {count}
        </span>
      )}
      <span
        aria-hidden
        className="font-mono"
        style={{
          fontSize: 7.5,
          letterSpacing: "0.18em",
          color: palette.ashSoft,
          opacity: 0.55,
          marginLeft: "auto",
        }}
      >
        {hotkey}
      </span>

      {/* Active underline · animated by layoutId */}
      {isActive && (
        <motion.span
          aria-hidden
          layoutId="os-tab-underline"
          className="absolute"
          style={{
            left: 0,
            right: 0,
            bottom: 0,
            height: 2,
            background: palette.amber,
            boxShadow: `0 0 6px ${palette.amber}`,
          }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 380, damping: 32 }
          }
        />
      )}

      {/* Hover stub — a faint underline visible only on hover, hidden
            entirely once the tab is active so it never overlaps the
            real underline. */}
      {!isActive && lit && (
        <span
          aria-hidden
          className="absolute"
          style={{
            left: "12%",
            right: "12%",
            bottom: 0,
            height: 1,
            background: palette.amberHalo,
          }}
        />
      )}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  B8 · PlanNavigator
 *  ─────────────────────────────────────────────────────────────────────────
 *  Right side of the eyebrow row. Renders:
 *
 *      [PLAN]  [n/n]  ◂  ●●●  ▸
 *
 *  Click the arrows or any dot to switch plan variants. The current
 *  plan's verdict is shown via an aria-live region so SR users hear
 *  the change.
 * ═══════════════════════════════════════════════════════════════════════ */
function PlanNavigator() {
  const { state, actions, palette } = useStrategyOs()
  const idx = state.planIndex
  const total = state.planTotal

  return (
    <div
      className="flex items-center gap-2"
      role="group"
      aria-label="Plan navigator"
    >
      <span
        className="font-mono uppercase"
        style={{
          fontSize: 8.5,
          letterSpacing: "0.26em",
          color: palette.ashSoft,
          fontWeight: 500,
        }}
      >
        PLAN
      </span>
      <span
        aria-live="polite"
        className="font-mono tabular-nums"
        style={{
          fontSize: 9,
          letterSpacing: "0.10em",
          color: palette.paper,
          fontWeight: 500,
        }}
      >
        {idx + 1}/{total}
      </span>
      <button
        type="button"
        onClick={actions.prevPlan}
        aria-label="Previous plan"
        className="inline-flex items-center justify-center focus:outline-none"
        style={{
          width: 18,
          height: 18,
          border: `1px solid ${palette.rule}`,
          background: "transparent",
          cursor: "pointer",
          transition: "border-color 180ms, background-color 180ms",
        }}
      >
        <ChevronLeft size={11} strokeWidth={1.5} color={palette.paperDim} />
      </button>
      <div className="flex items-center" style={{ gap: 4 }}>
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Plan ${i + 1}: ${state.plans[i]?.label ?? ""}`}
            aria-current={i === idx ? "true" : undefined}
            onClick={() => actions.setPlan(state.plans[i]!.key)}
            className="inline-block rounded-full focus:outline-none"
            style={{
              width: 5,
              height: 5,
              background: i === idx ? palette.amber : palette.ashSoft,
              opacity: i === idx ? 1 : 0.55,
              cursor: "pointer",
              transition: "background-color 180ms, opacity 180ms",
              border: "none",
              padding: 0,
            }}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={actions.nextPlan}
        aria-label="Next plan"
        className="inline-flex items-center justify-center focus:outline-none"
        style={{
          width: 18,
          height: 18,
          border: `1px solid ${palette.rule}`,
          background: "transparent",
          cursor: "pointer",
          transition: "border-color 180ms, background-color 180ms",
        }}
      >
        <ChevronRight size={11} strokeWidth={1.5} color={palette.paperDim} />
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  B9 · KeyboardShortcuts
 *  ─────────────────────────────────────────────────────────────────────────
 *  Headless component that installs a window keydown listener. It only
 *  fires when no input/textarea/contenteditable has focus and when the
 *  meta/ctrl modifier is NOT held (reserved for the command palette).
 *
 *  Keys:
 *      1/M  →  selectTab("mirror")
 *      2/R  →  selectTab("rules")
 *      3/E  →  selectTab("exposure")
 *      4/D  →  selectTab("dna")
 *      ←    →  prevPlan
 *      →    →  nextPlan
 *      ?    →  open guide drawer (placeholder; hooked in EPIC H)
 * ═══════════════════════════════════════════════════════════════════════ */
function KeyboardShortcuts() {
  const { actions } = useStrategyOs()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      // Skip if user is typing into an input/textarea/contenteditable.
      const target = e.target as HTMLElement | null
      if (target) {
        const tag = target.tagName
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          (target as HTMLElement).isContentEditable
        ) {
          return
        }
      }
      switch (e.key) {
        case "1": case "m": case "M": actions.selectTab("mirror"); break
        case "2": case "r": case "R": actions.selectTab("rules"); break
        case "3": case "e": case "E": actions.selectTab("exposure"); break
        case "4": case "d": case "D": actions.selectTab("dna"); break
        case "ArrowLeft":  actions.prevPlan(); break
        case "ArrowRight": actions.nextPlan(); break
        // "?" is shift+/, so we check both forms.
        case "?":
          // EPIC H will dispatch an open-guide action. For now, no-op.
          break
        default:
          return
      }
      // We only get here on a known key — preventDefault to swallow.
      e.preventDefault()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [actions])
  return null
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  B1 · Eyebrow
 *  ─────────────────────────────────────────────────────────────────────────
 *  The slim top row: "● STRATEGY OS" left, "PLAN n/n  ◂ ▸" right.
 * ═══════════════════════════════════════════════════════════════════════ */
function Eyebrow() {
  const { palette } = useStrategyOs()
  const reduceMotion = useReducedMotion()
  return (
    <div
      className="flex items-center justify-between"
      style={{ padding: "10px 14px", borderBottom: `1px solid ${palette.rule}` }}
    >
      <div className="flex items-center gap-2">
        <motion.span
          aria-hidden
          className="rounded-full inline-block"
          style={{ width: 6, height: 6, background: palette.amber }}
          animate={
            reduceMotion
              ? false
              : {
                  opacity: [1, 0.5, 1],
                  boxShadow: [
                    `0 0 0 ${palette.amber}`,
                    `0 0 6px ${palette.amber}`,
                    `0 0 0 ${palette.amber}`,
                  ],
                }
          }
          transition={{
            duration: 2.0, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4,
          }}
        />
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.30em",
            color: palette.amber,
            fontWeight: 500,
          }}
        >
          STRATEGY OS
        </span>
      </div>
      <PlanNavigator />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  IdentityRow  ·  ring + title + chip + status sentence + alert badge
 * ═══════════════════════════════════════════════════════════════════════ */
function IdentityRow() {
  const { palette } = useStrategyOs()
  return (
    <div
      className="flex items-start gap-4"
      style={{
        padding: "16px 14px 14px",
        borderBottom: `1px solid ${palette.rule}`,
      }}
    >
      <DisciplineRing82 />
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="font-sans"
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: palette.paper,
              letterSpacing: "-0.01em",
            }}
          >
            STRATEGY OS
          </span>
          <PostureChip />
        </div>
        <StatusSentence />
      </div>
      <AlertTriangleBadge />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  NerveGrid  ·  the 4-card row
 *  ─────────────────────────────────────────────────────────────────────────
 *  Each card pulls its data straight from `state.derived`. Sparkline
 *  values are synthesised from rule weeklyHistory averages where the
 *  derive layer doesn't already provide a 7-tap series — that work
 *  belongs in derive.ts but we inline it here for now (EPIC H may
 *  promote it).
 * ═══════════════════════════════════════════════════════════════════════ */
function NerveGrid() {
  const { state, palette } = useStrategyOs()
  const { derived, rules } = state

  // Build a 7-tap discipline series by averaging rule weeklyHistory
  // across the rule set. weeklyHistory entries are 1=held, 0=breached;
  // averaging across rules per dow gives a 0..1 adherence-per-day curve.
  const disciplineSpark = useMemo(() => {
    if (rules.length === 0) return [0, 0, 0, 0, 0, 0, 0]
    const out = new Array<number>(7).fill(0)
    for (const r of rules) {
      for (let i = 0; i < 7; i++) {
        out[i] += r.weeklyHistory[i] ?? 0
      }
    }
    return out.map((v) => v / rules.length)
  }, [rules])

  // Commitments series = number of breached rules per day, normalised
  // by total rules. Renders the 7-day "alert pressure" curve.
  const commitmentsSpark = useMemo(() => {
    if (rules.length === 0) return [0, 0, 0, 0, 0, 0, 0]
    const out = new Array<number>(7).fill(0)
    for (const r of rules) {
      for (let i = 0; i < 7; i++) {
        if ((r.weeklyHistory[i] ?? 1) === 0) out[i] += 1
      }
    }
    return out.map((v) => v / rules.length)
  }, [rules])

  // USD-weight series — flat for now; in EPIC F we'll wire to capital.
  const usdSpark = useMemo(() => [
    derived.usdWeightPct * 0.86,
    derived.usdWeightPct * 0.92,
    derived.usdWeightPct * 0.98,
    derived.usdWeightPct * 1.02,
    derived.usdWeightPct * 1.06,
    derived.usdWeightPct * 1.04,
    derived.usdWeightPct,
  ], [derived.usdWeightPct])

  // Patience series — derived from limitRatio; 7 ticks of slow rise.
  const patienceSpark = useMemo(() => [
    derived.execPatiencePct * 0.78,
    derived.execPatiencePct * 0.84,
    derived.execPatiencePct * 0.90,
    derived.execPatiencePct * 0.94,
    derived.execPatiencePct * 0.98,
    derived.execPatiencePct * 1.00,
    derived.execPatiencePct,
  ], [derived.execPatiencePct])

  return (
    <div
      className="grid grid-cols-4"
      style={{ borderBottom: `1px solid ${palette.rule}` }}
    >
      <NerveCard
        icon={Eye}
        label="DISCIPLINE SCORE"
        value={derived.disciplineScore}
        warn={derived.redDots.discipline}
        jumpTo="mirror"
        spark={{ values: disciplineSpark, max: 1 }}
        tone="paper"
        ariaLabel={`Discipline score ${derived.disciplineScore} of 100. Click to open the Mirror.`}
      />
      <NerveCard
        icon={Shield}
        label="COMMITMENTS"
        value={derived.commitmentsCount}
        warn={derived.redDots.commitments}
        jumpTo="rules"
        spark={{ values: commitmentsSpark, max: 1 }}
        tone="paper"
        ariaLabel={`${derived.commitmentsCount} active rule commitments${derived.redDots.commitments ? ", with active breaches" : ""}. Click to open Rules.`}
      />
      <NerveCard
        icon={Target}
        label="USD WEIGHT"
        value={`${Math.round(derived.usdWeightPct * 100)}%`}
        warn={derived.redDots.usdWeight}
        jumpTo="exposure"
        spark={{ values: usdSpark, max: 1 }}
        tone="paper"
        ariaLabel={`USD weight ${Math.round(derived.usdWeightPct * 100)} percent${derived.redDots.usdWeight ? ", above the dominant-currency threshold" : ""}. Click to open Exposure.`}
      />
      <NerveCard
        icon={Crosshair}
        label="ARCHETYPE"
        value={derived.archetypeLabel}
        sub={`${Math.round(derived.execPatiencePct * 100)}% EXEC PATIENCE`}
        warn={derived.redDots.execPatience}
        jumpTo="dna"
        spark={{ values: patienceSpark, max: 1 }}
        tone="amber"
        ariaLabel={`Archetype ${derived.archetypeLabel}, exec patience ${Math.round(derived.execPatiencePct * 100)} percent. Click to open DNA.`}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  THE EXPORT  ·  <OsCommandHeader/>
 *  ─────────────────────────────────────────────────────────────────────────
 *  The whole composite. Mounts:
 *    1. <KeyboardShortcuts/> (headless)
 *    2. <Eyebrow/>
 *    3. <IdentityRow/>
 *    4. <NerveGrid/>
 *    5. <TabStrip/>
 *
 *  The header carries no border itself — the parent surface (the LEFT
 *  card or the StrategyOsFacade shell) owns the outer hairline. Each
 *  internal row provides its own bottom hairline so the whole stack
 *  reads as a single editorial column.
 * ═══════════════════════════════════════════════════════════════════════ */
export function OsCommandHeader() {
  /* ─── SLIMMED HEADER · FLIGHT PROFILE ────────────────────────────
   *
   * Per the cockpit-console redesign, the four heavy header rows
   * (Eyebrow / IdentityRow / NerveGrid / [implicit PlanNavigator]) are
   * no longer rendered here. Their data has been re-homed:
   *
   *   · DisciplineRing82 + PostureChip + StatusSentence  →  relocated
   *     into the EquityExpandedStage headline row, sitting beside the
   *     `$113,866` protagonist number.
   *   · NerveGrid stats (discipline / commitments / usd-weight /
   *     hybrid·exec patience)  →  encoded as the small badges inside
   *     each TabStrip button.
   *   · PlanNavigator  →  retired for now; plan switching remains
   *     reachable via keyboard arrows (KeyboardShortcuts is still
   *     mounted) and may return as a settings drawer in a future epic.
   *
   * What's left: the keyboard listener (silently mounted) and the tab
   * strip itself, which is now the primary affordance for switching
   * between MIRROR / RULES / EXPOSURE / DNA. The accordion below has
   * been removed too — clicking a tab now navigates to that section
   * exclusively, no scrolling between sections. */
  return (
    <header
      role="banner"
      aria-label="Flight Profile command header"
      className="flex flex-col"
    >
      <KeyboardShortcuts />
      <TabStrip />
    </header>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  Re-exports for convenience
 *  ─────────────────────────────────────────────────────────────────────────
 *  Sub-components are exported so EPIC H can compose them differently
 *  (e.g. mounting the alert badge separately on the RIGHT card).
 * ═══════════════════════════════════════════════════════════════════════ */
export {
  DisciplineRing82,
  PostureChip,
  StatusSentence,
  AlertTriangleBadge,
  NerveCard,
  NerveGrid,
  TabStrip,
  PlanNavigator,
  Eyebrow,
  IdentityRow,
  Sparkline,
  KeyboardShortcuts,
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  Notes for future epics  (do not delete)
 *  ─────────────────────────────────────────────────────────────────────────
 *  EPIC C will mount the four INTEL slabs *below* this header, each
 *  gated by `state.selectedTab` so only one is visible at a time, with
 *  the WEEK CAPITAL LENS toggle living adjacent.
 *
 *  EPIC H will:
 *    · mount this header as the visible top of the new
 *      <StrategyOsFacade/> in the LEFT card;
 *    · add a `?` guide drawer that the keyboard listener already calls;
 *    · move the alert triangle into the RIGHT card's TraderStateFooter
 *      area when the LEFT card is collapsed on narrow viewports.
 *
 *  Thresholds referenced — kept here for traceability:
 *    OS_BREACH_THRESHOLD     = 70   (rule below threshold → red dot)
 *    OS_USD_WEIGHT_RED_DOT   = 0.45 (concentration warning)
 * ═══════════════════════════════════════════════════════════════════════ */
void OS_BREACH_THRESHOLD
void OS_USD_WEIGHT_RED_DOT
void HelpCircle  // referenced in B9 keyboard help — placeholder consumer
