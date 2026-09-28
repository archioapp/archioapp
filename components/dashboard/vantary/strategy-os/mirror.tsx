"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  STRATEGY OS · DISCIPLINE MIRROR  (EPIC D)
 *  ─────────────────────────────────────────────────────────────────────────
 *  Full-fidelity port of <WeeklyMirrorTimeline/> from the source
 *  StrategyAnalytics terminal panel, re-skinned in VANTARY editorial
 *  language. Renders inside the MIRROR slab.
 *
 *  Anatomy
 *  ───────
 *      ╔══════════════════════════════════════════════════════════╗
 *      ║   THE DISCIPLINE MIRROR        +12% vs prior week  →     ║
 *      ║                                                          ║
 *      ║   100 ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ INTENDED ┄    ║
 *      ║       █▆█  █▆▄▄  ███  █▄▄  █▆█  ░░░  ░░░                ║
 *      ║    70 ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ THRESHOLD ┄    ║
 *      ║       MON  TUE  WED  THU  FRI  SAT  SUN                  ║
 *      ║                                                          ║
 *      ║   [crumb]  THU · 88% · 0 breaches · best-streak (3)      ║
 *      ╚══════════════════════════════════════════════════════════╝
 *
 *  Each bar = one day-of-week (MON..SUN, dow 0..6). Bar fill rises to
 *  ACTUAL adherence; dashed lines mark INTENDED (95%) and BREACH (70%).
 *  Days that fall below BREACH get an amber pip at their top.
 *
 *  Bidirectional sync
 *  ──────────────────
 *  Clicking or hovering a bar fires `actions.selectDow(dow)`. The OS
 *  state's `selectedDow` is the single source of truth — the LEFT-card
 *  week-station grid (in your-space.tsx) reads the same selector to
 *  light its matching tile. EPIC H will wire the reverse direction so
 *  hovering a week-station also highlights this mirror.
 *
 *  Best-streak ribbon
 *  ──────────────────
 *  Consecutive days at or above the OS_INVIOLABLE_THRESHOLD (100) — or
 *  failing that, the longest above-OPTIMAL run — get a thin amber line
 *  drawn across their top edge as a "ribbon".
 *
 *  Weekly delta caption
 *  ────────────────────
 *  Computes `+12% vs prior week` from a fixture-based prior-week
 *  baseline (kept in this file so it's easy to swap to a real source).
 * ═══════════════════════════════════════════════════════════════════════ */

import React, { memo, useCallback, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ArrowUpRight, ArrowDownRight, Trophy } from "lucide-react"

import { useStrategyOs } from "./provider"
import { OS_BREACH_THRESHOLD, OS_POSTURE_THRESHOLDS } from "./data"

const DOW_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const
const SEVEN_COLS = "repeat(7, 1fr)"
const INTENDED   = 0.95   // the line you swore to hold
const BREACH     = OS_BREACH_THRESHOLD / 100

/** Prior-week adherence baseline — used for the delta caption. In a real
 *  build this would come from `/api/discipline/last-week`. Hard-coded here
 *  so the demo is internally consistent. */
const PRIOR_WEEK_ADH: number[] = [0.78, 0.82, 0.71, 0.66, 0.79, 0, 0]

/* ═══════════════════════════════════════════════════════════════════════════
 *  Hover-crumb · per-bar tooltip
 * ═══════════════════════════════════════════════════════════════════════ */
interface CrumbDatum {
  dow:           number
  label:         string
  adherence:     number
  breachedRules: { id: string; rule: string }[]
  isBest:        boolean
  trend:         "up" | "down" | "flat"
  prior:         number
}

function HoverCrumb({
  datum,
  palette,
}: {
  datum:   CrumbDatum | null
  palette: ReturnType<typeof useStrategyOs>["palette"]
}) {
  const reduce = useReducedMotion()
  return (
    <AnimatePresence mode="wait">
      {datum && (
        <motion.div
          key={datum.dow}
          initial={reduce ? false : { opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -2 }}
          transition={{ duration: 0.18, ease: [0.65, 0, 0.35, 1] }}
          className="grid items-baseline gap-x-3 gap-y-1"
          style={{
            gridTemplateColumns: "auto 1fr auto auto",
            border:     `1px solid ${palette.amberHalo}`,
            background: palette.amberWash,
            padding:    "8px 12px",
          }}
          role="status"
          aria-live="polite"
        >
          {/* eyebrow */}
          <span
            className="font-mono uppercase tabular-nums"
            style={{
              fontSize:      9.5,
              letterSpacing: "0.24em",
              color:         palette.amber,
              fontWeight:    500,
            }}
          >
            {datum.label}
          </span>
          <span
            className="font-mono tabular-nums"
            style={{ fontSize: 14, color: palette.paper, fontWeight: 500 }}
          >
            {Math.round(datum.adherence * 100)}%
          </span>
          {/* trend */}
          <span
            className="inline-flex items-center gap-1 font-mono uppercase tabular-nums"
            style={{
              fontSize:      9.5,
              letterSpacing: "0.18em",
              color:
                datum.trend === "up"
                  ? palette.amber
                  : datum.trend === "down"
                    ? palette.paperDim
                    : palette.ashSoft,
            }}
          >
            {datum.trend === "up" && <ArrowUpRight size={10} strokeWidth={1.5} aria-hidden />}
            {datum.trend === "down" && <ArrowDownRight size={10} strokeWidth={1.5} aria-hidden />}
            {datum.trend === "up"
              ? `+${Math.round((datum.adherence - datum.prior) * 100)}%`
              : datum.trend === "down"
                ? `${Math.round((datum.adherence - datum.prior) * 100)}%`
                : "FLAT"}
          </span>
          {/* badge */}
          <span
            className="inline-flex items-center gap-1 font-mono uppercase"
            style={{
              fontSize:      9,
              letterSpacing: "0.18em",
              color:         datum.isBest ? palette.amber : palette.ashSoft,
              opacity:       datum.isBest ? 1 : 0.65,
            }}
          >
            {datum.isBest && <Trophy size={10} strokeWidth={1.5} aria-hidden />}
            {datum.isBest ? "BEST RUN" : datum.breachedRules.length > 0 ? "BROKE" : "HELD"}
          </span>

          {/* row 2: breached rules or held verdict, spans all 4 cols */}
          <div
            className="font-sans"
            style={{
              gridColumn: "1 / -1",
              fontSize:   12,
              color:      palette.ashSoft,
              lineHeight: 1.55,
            }}
          >
            {datum.breachedRules.length === 0 ? (
              <span style={{ color: palette.paper }}>
                Discipline held — every rule honoured.
              </span>
            ) : (
              <>
                <span style={{ color: palette.paperDim, marginRight: 6 }}>
                  Broke {datum.breachedRules.length}:
                </span>
                {datum.breachedRules.slice(0, 2).map((r, i) => (
                  <span key={r.id}>
                    {i > 0 && " · "}
                    <span style={{ color: palette.paper }}>{r.rule}</span>
                  </span>
                ))}
                {datum.breachedRules.length > 2 && (
                  <span style={{ color: palette.ashSoft }}>
                    {" "}+{datum.breachedRules.length - 2} more
                  </span>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  Best-streak detector
 *  Returns the (start, length) of the longest run of days at or above the
 *  OPTIMAL threshold. Used to render the "best run" ribbon overlay.
 * ═══════════════════════════════════════════════════════════════════════ */
function findBestStreak(adh: number[]): { start: number; length: number } {
  let bestStart = 0
  let bestLen   = 0
  let runStart  = 0
  let runLen    = 0
  const min = OS_POSTURE_THRESHOLDS.optimal / 100
  for (let i = 0; i < adh.length; i++) {
    if (adh[i] >= min) {
      if (runLen === 0) runStart = i
      runLen++
      if (runLen > bestLen) {
        bestLen   = runLen
        bestStart = runStart
      }
    } else {
      runLen = 0
    }
  }
  return { start: bestStart, length: bestLen }
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  THE COMPONENT
 * ═══════════════════════════════════════════════════════════════════════ */
export const DisciplineMirror = memo(function DisciplineMirror() {
  const { state, selectors, actions, palette, toneMap } = useStrategyOs()
  const reduce = useReducedMotion()
  const adh    = state.derived.mirror.weeklyAdherence
  const lensOn = state.lensWeekCapital
  const ref    = useRef<HTMLDivElement>(null)

  /* ── per-day capital share for the LENS overlay ───────────────── */
  const lensByDow = useMemo(() => {
    const map = new Array<number>(7).fill(0)
    for (const slice of state.capital.byDay) {
      const i = DOW_LABELS.findIndex((d) => slice.label.toUpperCase().startsWith(d))
      if (i >= 0) map[i] = slice.pct
    }
    return map
  }, [state.capital.byDay])

  /* ── per-day breached rule list (drives crumb body + breach pips) ── */
  const breachesByDow = useMemo(() => {
    const out: { id: string; rule: string }[][] = Array.from({ length: 7 }, () => [])
    for (const r of state.rules) {
      r.weeklyHistory.forEach((held, dow) => {
        if (!held) out[dow]?.push({ id: r.id, rule: r.rule })
      })
    }
    return out
  }, [state.rules])

  /* ── best-streak ribbon math ──────────────────────────────────── */
  const best = useMemo(() => findBestStreak(adh), [adh])

  /* ── delta vs prior week ─────────────────────────────────────── */
  const weekAvg = useMemo(() => {
    const live = adh.filter((v) => v > 0)
    return live.length === 0 ? 0 : live.reduce((s, v) => s + v, 0) / live.length
  }, [adh])
  const priorAvg = useMemo(() => {
    const live = PRIOR_WEEK_ADH.filter((v) => v > 0)
    return live.length === 0 ? 0 : live.reduce((s, v) => s + v, 0) / live.length
  }, [])
  const delta = weekAvg - priorAvg

  /* ── crumb data for the hover state ──────────────────────────── */
  const crumb = useMemo<CrumbDatum | null>(() => {
    const dow = state.selectedDow
    if (dow == null) return null
    const dowAdh = adh[dow] ?? 0
    const prior  = PRIOR_WEEK_ADH[dow] ?? 0
    const isBest = best.length > 1 && dow >= best.start && dow < best.start + best.length
    const trend: CrumbDatum["trend"] =
      Math.abs(dowAdh - prior) < 0.005
        ? "flat"
        : dowAdh >= prior
          ? "up"
          : "down"
    return {
      dow,
      label:         DOW_LABELS[dow],
      adherence:     dowAdh,
      breachedRules: breachesByDow[dow] ?? [],
      isBest,
      trend,
      prior,
    }
  }, [state.selectedDow, adh, best, breachesByDow])

  const handleEnter = useCallback(
    (dow: number) => actions.selectDow(dow),
    [actions],
  )
  const handleLeave = useCallback(() => actions.selectDow(null), [actions])

  return (
    <div ref={ref} className="flex flex-col gap-4">
      {/* ── header row — eyebrow + delta caption ─────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className="font-mono uppercase"
          style={{
            fontSize:      9,
            letterSpacing: "0.24em",
            color:         palette.ashSoft,
            fontWeight:    500,
          }}
        >
          WEEKLY ADHERENCE
        </span>
        <span aria-hidden style={{ flex: 1, height: 1, background: palette.rule, opacity: 0.5 }} />
        <DeltaCaption delta={delta} palette={palette} />
        <span aria-hidden style={{ width: 1, height: 11, background: palette.rule }} />
        <Legend palette={palette} toneMap={toneMap} />
      </div>

      {/* ── ribbon · 7 vertical bars ─────────────────────────────── */}
      <div
        className="relative grid"
        style={{
          gridTemplateColumns: SEVEN_COLS,
          gap:        6,
          alignItems: "end",
            height:     112,
        }}
        role="list"
        aria-label="Weekly discipline adherence by day"
      >
        {/* INTENDED gridline (95%) */}
        <Gridline
          fraction={INTENDED}
          label="INTENDED 95%"
          palette={palette}
          dashed
          tone="amber"
        />
        {/* BREACH threshold (70%) */}
        <Gridline
          fraction={BREACH}
          label="BREACH 70%"
          palette={palette}
          dashed
          tone="paperDim"
        />

        {/* Best-streak ribbon */}
        {best.length >= 2 && (
          <BestStreakRibbon
            start={best.start}
            length={best.length}
            palette={palette}
          />
        )}

        {DOW_LABELS.map((label, idx) => {
          const v        = adh[idx] ?? 0
          const breach   = v < BREACH && v > 0
          const selected = selectors.isDowSelected(idx)
          const lensPct  = lensByDow[idx] ?? 0
          const noTrade  = v === 0
          const breachCt = breachesByDow[idx]?.length ?? 0

          return (
            <button
              key={label}
              type="button"
              role="listitem"
              onMouseEnter={() => handleEnter(idx)}
              onMouseLeave={handleLeave}
              onFocus={() => handleEnter(idx)}
              onBlur={handleLeave}
              onClick={() => handleEnter(idx)}
              className="relative flex flex-col items-stretch focus:outline-none"
              aria-label={`${label} adherence ${Math.round(v * 100)} percent · ${
                breachCt > 0 ? `${breachCt} rules breached` : "all rules held"
              }`}
              style={{
                height:     "100%",
                background: "transparent",
                border:     "none",
                cursor:     "pointer",
                padding:    0,
              }}
            >
              {/* track */}
              <div
                className="relative flex-1"
                style={{
                  border: `1px solid ${
                    selected ? palette.amberHalo : palette.rule
                  }`,
                  background: selected ? palette.amberWash : "transparent",
                  transition: "border-color 200ms ease, background 200ms ease",
                }}
              >
                {/* ACTUAL — slim 6px-wide centered "thermometer" column.
                    Replaces the previous full-cell-width bottom-up flood.
                    In teal-glass theme the flood resolved to a heavy
                    teal wash that filled 80%+ of every cell; the column
                    keeps the editorial hairline feel and reads as a
                    clean adherence indicator, not a background flood. */}
                <motion.div
                  aria-hidden
                  initial={false}
                  animate={{ height: `${v * 100}%` }}
                  transition={{
                    duration: reduce ? 0 : 0.5,
                    ease:     [0.65, 0, 0.35, 1],
                    delay:    reduce ? 0 : idx * 0.045,
                  }}
                  style={{
                    position: "absolute",
                    left:     "50%",
                    bottom:   0,
                    width:    6,
                    transform: "translateX(-50%)",
                    background: noTrade
                      ? "transparent"
                      : breach
                        ? `repeating-linear-gradient(0deg, ${palette.paperDim} 0, ${palette.paperDim} 1px, transparent 1px, transparent 3px)`
                        : toneMap.discipline,
                    opacity: breach ? 0.7 : noTrade ? 0 : 0.92,
                    borderTopLeftRadius:  1,
                    borderTopRightRadius: 1,
                  }}
                />

                {/* ACTUAL · cap tick — 1px hairline across the cell at the
                    top of the column, anchoring the eye to the level. */}
                {!noTrade && (
                  <motion.div
                    aria-hidden
                    initial={false}
                    animate={{ bottom: `calc(${v * 100}% - 0.5px)` }}
                    transition={{
                      duration: reduce ? 0 : 0.5,
                      ease:     [0.65, 0, 0.35, 1],
                      delay:    reduce ? 0 : idx * 0.045,
                    }}
                    style={{
                      position: "absolute",
                      left:     6,
                      right:    6,
                      height:   1,
                      background: breach ? palette.paperDim : palette.amber,
                      opacity: 0.55,
                    }}
                  />
                )}

                {/* INTENDED-vs-ACTUAL · gap band — featherweight tint
                    only when the cell is hovered/selected. Removed from
                    the resting state because in glass themes it stacked
                    with the column to read as a flood. */}
                {!noTrade && v < INTENDED && selected && (
                  <div
                    aria-hidden
                    style={{
                      position:  "absolute",
                      left:      6,
                      right:     6,
                      bottom:    `${v * 100}%`,
                      height:    `${(INTENDED - v) * 100}%`,
                      background: palette.amberWash,
                      opacity:    0.22,
                    }}
                  />
                )}

                {/* LENS overlay — capital-of-week tint, kept very subtle */}
                {lensOn && !noTrade && (
                  <motion.div
                    aria-hidden
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.35 }}
                    style={{
                      position:     "absolute",
                      left:         "50%",
                      bottom:       0,
                      width:        2,
                      height:       `${lensPct * 100}%`,
                      transform:    "translateX(4px)",
                      background:   toneMap.optimal,
                      mixBlendMode: "screen",
                    }}
                  />
                )}
                {/* breach pip */}
                {breach && (
                  <span
                    aria-hidden
                    className="absolute"
                    style={{
                      top:          5,
                      right:        5,
                      width:        4,
                      height:       4,
                      borderRadius: 99,
                      background:   palette.amber,
                      boxShadow:    `0 0 4px ${palette.amber}`,
                    }}
                  />
                )}
                {/* no-trade dim */}
                {noTrade && (
                  <span
                    aria-hidden
                    className="absolute inset-0 flex items-center justify-center font-mono uppercase tabular-nums"
                    style={{
                      fontSize:      9,
                      letterSpacing: "0.18em",
                      color:         palette.ashSoft,
                      opacity:       0.5,
                    }}
                  >
                    OFF
                  </span>
                )}
              </div>

              {/* dow label */}
              <span
                className="font-mono uppercase tabular-nums mt-1.5"
                style={{
                  fontSize:      9,
                  letterSpacing: "0.18em",
                  color:         selected ? palette.paper : palette.ashSoft,
                  textAlign:     "center",
                }}
              >
                {label}
              </span>
              {/* adherence number */}
              <span
                className="font-mono tabular-nums mt-0.5"
                style={{
                  fontSize:  10,
                  color:
                    noTrade
                      ? palette.ashSoft
                      : selected
                        ? palette.amber
                        : palette.ashSoft,
                  textAlign: "center",
                  opacity:   noTrade ? 0.5 : 1,
                }}
              >
                {noTrade ? "—" : Math.round(v * 100)}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── crumb · floats below the ribbon ──────────────────────── */}
      <div style={{ minHeight: 64 }}>
        <HoverCrumb datum={crumb} palette={palette} />
        {!crumb && (
          <p
            className="font-sans"
            style={{
              fontSize: 12.5,
              color:    palette.ashSoft,
              margin:   0,
              lineHeight: 1.55,
            }}
          >
            Hover any day to inspect what discipline asked of you and what
            you actually delivered. Days at or above the dashed{" "}
            <span style={{ color: palette.amber }}>INTENDED</span> line are
            held days; below the lower dashed{" "}
            <span style={{ color: palette.paperDim }}>BREACH</span> line is
            where the tax accrued.
          </p>
        )}
      </div>
    </div>
  )
})

/* ═══════════════════════════════════════════════════════════════════════════
 *  Gridline  ·  horizontal hairline at fraction%
 *  Spans the full ribbon width (positioned absolute over the grid).
 * ═══════════════════════════════════════════════════════════════════════ */
function Gridline({
  fraction,
  label,
  palette,
  dashed,
  tone,
}: {
  fraction: number
  label:    string
  palette:  ReturnType<typeof useStrategyOs>["palette"]
  dashed:   boolean
  tone:     "amber" | "paperDim"
}) {
  const color = tone === "amber" ? palette.amberHalo : palette.rule
  const text  = tone === "amber" ? palette.amber     : palette.ashSoft
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left:     0,
        right:    0,
        bottom:   `calc(${fraction * 100}% + 22px)`, // 22px = label + count below
        height:   0,
        gridColumn: "1 / -1",
        pointerEvents: "none",
        zIndex:   1,
      }}
    >
      <div
        style={{
          position:  "absolute",
          left:      0,
          right:     90,
          height:    0,
          borderTop: `1px ${dashed ? "dashed" : "solid"} ${color}`,
          opacity:   0.7,
        }}
      />
      <span
        className="font-mono uppercase tabular-nums"
        style={{
          position:      "absolute",
          right:         0,
          top:           -7,
          fontSize:      8.5,
          letterSpacing: "0.20em",
          color:         text,
          fontWeight:    500,
          background:    palette.ink,
          padding:       "1px 4px",
        }}
      >
        {label}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  BestStreakRibbon  ·  amber bracket above the streak's bars
 * ═══════════════════════════════════════════════════════════════════════ */
function BestStreakRibbon({
  start,
  length,
  palette,
}: {
  start:   number
  length:  number
  palette: ReturnType<typeof useStrategyOs>["palette"]
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      aria-hidden
      initial={reduce ? false : { opacity: 0, y: -2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
      className="flex items-center justify-center gap-1"
      style={{
        position:    "absolute",
        top:         -2,
        left:        `calc((100% / 7) * ${start} + 3px)`,
        width:       `calc((100% / 7) * ${length} - 6px)`,
        height:      14,
        pointerEvents: "none",
        zIndex:      2,
      }}
    >
      <span
        style={{
          flex:       1,
          height:     1,
          background: palette.amber,
          boxShadow:  `0 0 6px ${palette.amberHalo}`,
        }}
      />
      <Trophy
        size={10}
        strokeWidth={1.5}
        color={palette.amber}
        aria-hidden
      />
      <span
        className="font-mono uppercase tabular-nums"
        style={{
          fontSize:      8,
          letterSpacing: "0.20em",
          color:         palette.amber,
          fontWeight:    500,
        }}
      >
        BEST · {length}D
      </span>
      <Trophy
        size={10}
        strokeWidth={1.5}
        color={palette.amber}
        aria-hidden
      />
      <span
        style={{
          flex:       1,
          height:     1,
          background: palette.amber,
          boxShadow:  `0 0 6px ${palette.amberHalo}`,
        }}
      />
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  DeltaCaption  ·  `+12% vs prior week`
 * ═══════════════════════════════════════════════════════════════════════ */
function DeltaCaption({
  delta,
  palette,
}: {
  delta:   number
  palette: ReturnType<typeof useStrategyOs>["palette"]
}) {
  const positive = delta >= 0
  const Icon = positive ? ArrowUpRight : ArrowDownRight
  return (
    <span
      className="inline-flex items-baseline gap-1.5 font-mono uppercase tabular-nums"
      style={{
        fontSize:      9.5,
        letterSpacing: "0.20em",
        color:         positive ? palette.amber : palette.paperDim,
      }}
    >
      <Icon size={10} strokeWidth={1.5} aria-hidden />
      <span style={{ color: positive ? palette.amber : palette.paperDim }}>
        {positive ? "+" : ""}
        {Math.round(delta * 100)}%
      </span>
      <span style={{ color: palette.ashSoft }}>VS PRIOR WEEK</span>
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  Legend  ·  amber=actual, dashed=intended, dotted=breach
 * ═══════════════════════════════════════════════════════════════════════ */
function Legend({
  palette,
  toneMap,
}: {
  palette: ReturnType<typeof useStrategyOs>["palette"]
  toneMap: ReturnType<typeof useStrategyOs>["toneMap"]
}) {
  return (
    <div className="flex items-center gap-3">
      <LegendSwatch label="ACTUAL"   color={toneMap.discipline} palette={palette} />
      <LegendSwatch label="INTENDED" color={palette.amberHalo}  palette={palette} dashed />
      <LegendSwatch label="BREACH"   color={palette.paperDim}   palette={palette} dotted />
    </div>
  )
}

function LegendSwatch({
  label,
  color,
  palette,
  dashed,
  dotted,
}: {
  label:   string
  color:   string
  palette: ReturnType<typeof useStrategyOs>["palette"]
  dashed?: boolean
  dotted?: boolean
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden
        style={{
          width:  14,
          height: 0,
          borderTop: `2px ${dotted ? "dotted" : dashed ? "dashed" : "solid"} ${color}`,
        }}
      />
      <span
        className="font-mono uppercase"
        style={{
          fontSize:      8.5,
          letterSpacing: "0.22em",
          color:         palette.ashSoft,
        }}
      >
        {label}
      </span>
    </span>
  )
}

export default DisciplineMirror
