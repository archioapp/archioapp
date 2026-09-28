"use client"

/* ════════════════════════════════════════════════════════════════════════
 *  JARVIS · SURFACE 1 · EQUITY PROTAGONIST BAND
 *  ─────────────────────────────────────────────────────────────────────
 *  The single most important rectangle in Live Equity Volume. The trader
 *  glances. They see ONE number. They see ONE eyebrow. They see ONE
 *  delta. Everything else about the period — vs-prior, best day, equity
 *  curve shape — is summoned by hover, not asserted by default.
 *
 *  This is the FIRST surface rebuilt under the JARVIS doctrine. Every
 *  subsequent surface (Pulse Strip, Period Spine, Story Panel, Quiet
 *  Layer) inherits the patterns established here:
 *
 *    · Three states per zone — idle / awakened / engaged
 *    · One protagonist, the rest in the support / quiet tones
 *    · Hairlines, never boxes, except for interactive affordances
 *    · Width-aware self-tiering via ResizeObserver
 *    · Motion is meaning — silk for state, awaken for hover, breath for
 *      ambient pulse
 *
 *  ┌──────────────────────────────────────────────────────────────────┐
 *  │  IDLE                                                            │
 *  │   ┌─ 9.5px mono-caps eyebrow ───────────────────┐                │
 *  │   │  WEEK · LIVE EQUITY                         │   ┌──────────┐ │
 *  │   └────────────────────────────────────────────┘   │  +$1,247 │ │
 *  │   ┌─ 38px sans-serif protagonist (split) ────────┐ │  +139%   │ │
 *  │   │  $12,480                                     │ └──────────┘ │
 *  │   └──────────────────────────────────────────────┘  delta chip   │
 *  └──────────────────────────────────────────────────────────────────┘
 *
 *  ┌──────────────────────────────────────────────────────────────────┐
 *  │  AWAKENED  (cursor enters anywhere in the band)                  │
 *  │   ── eyebrow brightens                                           │
 *  │   ── delta chip's amber wash fades in (winning periods)          │
 *  │   ── 60px horizon strip of the period's equity curve fades in    │
 *  │       below the protagonist, on a single brightened hairline     │
 *  │   ── inline mono-caps line: vs-prior + best-day                  │
 *  │   ── ambient breathing of the protagonist's text-shadow gains    │
 *  │       1.4× amplitude                                             │
 *  └──────────────────────────────────────────────────────────────────┘
 *
 *  ┌──────────────────────────────────────────────────────────────────┐
 *  │  ENGAGED  (click on the band)                                    │
 *  │   ── emits onEngage() — parent stage transitions into the        │
 *  │       expanded view                                              │
 *  │   ── micro-tap haptic (scale 0.985 → 1.0 in 220ms silk)          │
 *  └──────────────────────────────────────────────────────────────────┘
 *
 *  WIDTH TIERS (read off the band's own width via ResizeObserver):
 *
 *    full      ≥ 480 px  · all elements visible — eyebrow + protagonist +
 *                          full delta chip + spark on awaken
 *    medium    ≥ 360 px  · eyebrow shortens (drops the · LIVE EQUITY
 *                          suffix), spark on awaken at 64px wide
 *    narrow    ≥ 240 px  · spark hides even on awaken; protagonist
 *                          drops to 32px headline; delta chip becomes
 *                          a single mono-caps line
 *    minimum   <  240 px · pure mono-caps: eyebrow + 28px protagonist +
 *                          single-line delta. Spark and chip border are
 *                          suppressed. Reserved for the case where the
 *                          card is paired into a 25% column.
 *  ════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import {
  JARVIS_TX,
  JARVIS_TONE,
  JARVIS_RULE,
  JARVIS_RHYTHM,
  JARVIS_MOTION,
  JARVIS_CADENCE,
  JARVIS_WEIGHT,
  jarvisToneFor,
  splitMagnitude,
} from "../jarvis-tokens"
import { Tx } from "../jarvis-text"
import { EquityPortfolioComposition } from "./equity-portfolio-composition"
import { RollingNumber, PnlHeartbeat } from "../../flight-deck-motion"

/* ─────────────────────────────────────────────────────────────────────────
 *  TYPES
 *  ─────────────────────────────────────────────────────────────────────── */

/** The minimum data contract this surface needs. The host card resolves
 *  these from its own period selector + checkin source. We deliberately
 *  do NOT import the host's PeriodSummary type — keeping this surface
 *  decoupled means we can later host the same band inside the
 *  "Capital" or "Forecast" stories without dragging in equity-specific
 *  types. */
export interface EquityProtagonistBandProps {
  /** The hero numeral, already formatted with currency / commas — e.g.
   *  "$12,480.32". Internally split via `splitMagnitude()` into a bold
   *  lead and a light tail per the Vantary numeric language. */
  balance: string

  /** Mono-caps eyebrow describing the period scope — "WEEK", "MONTH",
   *  "YEAR". Rendered through <Tx size="eyebrow">. NOT capitalized by
   *  the component — caller decides. */
  periodLabel: string

  /** Net P&L for the active period — e.g. "+$1,247". Rendered as the
   *  protagonist of the delta chip. */
  net: string

  /** Sign of the P&L drives the chip tone. We resolve to the locked
   *  semantic tone via jarvisToneFor() so the band can never drift to
   *  a one-off color. */
  netRaw: number

  /** Comparison string ��� "+139%" / "-22%". Rendered inside the chip
   *  next to the net. */
  vsPct: string

  /** Long-form comparison line — "vs +$520 prior". Surfaces only on
   *  awaken, replacing the standalone vsPct. */
  vsLong: string

  /** Best-day datapoint for the period — e.g. { day: "Tue", pl: "+$214" }.
   *  Surfaces only on awaken, inline after the vs-prior line. */
  best: { day: string; pl: string }

  /** Period equity curve, normalized to [-1, 1]. Reveals on awaken as a
   *  60-or-96px horizon strip beneath the protagonist. */
  spark: number[]

  /** Click handler — fires when the band is engaged. Parent stage may
   *  transition into the expanded EquityExpandedStage view. Optional —
   *  the band still emits the micro-tap motion but is not focusable. */
  onEngage?: () => void

  /** When true, the band participates in the deck's auto-rotation
   *  scheduler — the protagonist's text-shadow breathes at the
   *  JARVIS_CADENCE.breath rhythm. Default true. */
  ambient?: boolean

  /** Optional portfolio composition — when supplied, an editorial
   *  panel reveals on awaken explaining HOW the headline number is
   *  composed across managed accounts. The panel sits BELOW the
   *  tape/ladder grid and answers, in one read:
   *    · how many accounts the trader manages
   *    · which brokers / prop firms hold them
   *    · what type each one is
   *    · how much each contributes (magnitude + share)
   *  Pass `composition: undefined` to suppress the panel entirely
   *  (e.g. when the band is reused inside a story that doesn't
   *  represent a portfolio aggregate). */
  composition?: {
    /** Pre-sorted account rows. */
    rows: import("./equity-portfolio-composition").AccountCompositionRow[]
    /** Pre-formatted total — must match the headline `balance`. */
    total: string
    /** Trailing summary phrase, e.g. "ACROSS 2 BROKERS · 1 LIVE · 2 PROP". */
    footerSummary?: string
  }

  /** Optional period-aware accounts breakdown — when supplied, an
   *  editorial panel reveals on awaken showing the period's profit
   *  broken down across each managed account. This is the ONLY
   *  hover-reveal on the band: it answers "where did the
   *  {period} profit come from?" with a mono-tabular row per
   *  account, signed P&L, share of period net, and a 12px share bar.
   *
   *  Pass `periodBreakdown: undefined` to suppress the reveal.
   *  When both `composition` AND `periodBreakdown` are provided,
   *  the breakdown wins — composition is treated as legacy. */
  periodBreakdown?: {
    /** Period name in caps — "WEEK", "MONTH", "YEAR". Drives the
     *  panel header phrase. */
    periodLabel:  string
    /** Pre-formatted protagonist net for the period — must match
     *  the parent band's `net` prop. Rendered on the right side
     *  of the panel header. */
    totalPnlFmt:  string
    /** Tone of the protagonist net — drives the panel header value
     *  color. */
    totalTone:    "amber" | "warnEdge" | "support"
    /** Per-account rows, sorted by absolute period P&L descending. */
    rows: Array<{
      id:        string
      /** Account display name — "MAIN LIVE" / "FTMO CHALLENGE". */
      name:      string
      /** Venue / type qualifier — "IC MARKETS · LIVE" or "FTMO · CHL". */
      venue:     string
      /** Pre-formatted account equity (total balance), e.g. "$12,480". */
      equityFmt: string
      /** Signed period P&L formatted, e.g. "+$520" / "−$84". */
      pnlFmt:    string
      /** Numeric P&L driving tone + share calc. */
      pnlRaw:    number
      /** Share of total period P&L 0..1. */
      sharePct:  number
      /** True when this account contributed the largest absolute
       *  share of the period's P&L — gets a single ★ glyph. */
      isLead?:   boolean
    }>
    /** Trailing summary phrase — e.g. "3 ACCOUNTS · 2 GREEN · 1 RED". */
    footerSummary?: string
  }

  /** Optional className passthrough so the parent can position the
   *  band within its grid. */
  className?: string
}

/* ─────────────────────────────────────────────────────────────────────────
 *  WIDTH TIER MACHINERY
 *  ─────────────────────────────────────────────────────────────────────── */

type WidthTier = "full" | "medium" | "narrow" | "minimum"

const TIER_BREAKPOINTS: Array<{ min: number; tier: WidthTier }> = [
  { min: 480, tier: "full"    },
  { min: 360, tier: "medium"  },
  { min: 240, tier: "narrow"  },
  { min: 0,   tier: "minimum" },
]

function tierFromWidth(w: number): WidthTier {
  for (const bp of TIER_BREAKPOINTS) {
    if (w >= bp.min) return bp.tier
  }
  return "minimum"
}

/** Observe an element's content-box width via ResizeObserver. Returns
 *  the latest width as a number. SSR-safe — returns 0 until the first
 *  observation lands.
 *
 *  Why a hook and not a CSS container query: container queries can't
 *  drive React state, so we couldn't conditionally mount the spark or
 *  swap the protagonist size. The hook gives us per-render width with
 *  near-zero cost (RO is cheaper than scroll listeners). */
function useElementWidth<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = useRef<T | null>(null)
  const [w, setW] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver((entries) => {
      // contentBoxSize is the modern path; fallback to contentRect for
      // older Safari builds that still ship classic ResizeObserver.
      for (const entry of entries) {
        const box = (entry as ResizeObserverEntry).contentBoxSize
        const next = Array.isArray(box)
          ? box[0]?.inlineSize
          : (box as ResizeObserverSize | undefined)?.inlineSize
        setW(next ?? entry.contentRect.width)
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return [ref, w]
}

/* ─────────────────────────────────────────────────────────────────────────
 *  PERIOD TAPE — editorial typographic rhythm of the period
 *  ─────────────────────────────────────────────────────────────────────────
 *  Replaces the prior horizon-strip SVG bars. The doctrine: if the trader
 *  wanted a chart they'd open the takeover view. Here we want a *reading*
 *  expression — period markers laid out as a horizontal mono-caps tape,
 *  each marker carrying its own day label and a signed magnitude, every
 *  marker the same width, every marker built from typography only.
 *
 *  No bars. No path geometry. No streak ribbons. Three vocabulary moves:
 *
 *    1. The day / hour / week / month label  (top, mono-caps eyebrow)
 *    2. The magnitude as a signed integer     (middle, tone-by-sign caption)
 *    3. Editorial accents on three cells:
 *         · current (last)  → 4px amber dot beneath, "NOW" replaces value
 *         · peak     (max)  → 3px amber dot above the label
 *         · trough   (min)  → 3px warnEdge dot beneath the value
 *
 *  The eye reads the tape like a stock-tape ribbon — left-to-right, no
 *  vertical decoding required. The accents anchor the period's story
 *  without ever resorting to bar height as a magnitude metaphor.
 * ───────────────────────────────────────────────────────────────────── */

/** Derive human-readable tick labels from the host's period label and
 *  the available tick count. All labels return UPPERCASE so the calling
 *  Tx primitive renders them through the eyebrow scale unchanged.
 *
 *  This helper is the seam between the host's period vocabulary
 *  (WEEK / DAY / MONTH / YEAR / LIFETIME) and the tape's literal
 *  rendering — adding a new period only touches this function, not the
 *  tape body. */
function deriveTickLabels(periodLabel: string, count: number): string[] {
  const p = periodLabel.toUpperCase()
  if (p.startsWith("WEEK")) {
    return ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].slice(0, count)
  }
  if (p.startsWith("DAY")) {
    /* Trading hours starting at 09:00 NY local — hourly bins. The mod 24
     * keeps overnight extension sessions from rendering "27" / "28". */
    return Array.from({ length: count }, (_, i) => String((9 + i) % 24).padStart(2, "0"))
  }
  if (p.startsWith("MONTH")) {
    return Array.from({ length: count }, (_, i) => `W${i + 1}`)
  }
  if (p.startsWith("YEAR")) {
    return ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"].slice(0, count)
  }
  if (p.startsWith("LIFE")) {
    return Array.from({ length: count }, (_, i) => `Y${i + 1}`)
  }
  // Generic fallback — numeric tickers (1, 2, 3 … N).
  return Array.from({ length: count }, (_, i) => String(i + 1))
}

/** Format a tick value into a compact signed integer percentage of the
 *  period's max-abs magnitude. We use the math minus glyph (U+2212)
 *  rather than an ASCII hyphen because U+2212 is the same width as the
 *  `+` glyph in tabular-nums fonts — keeps the tape visually rhythmic.
 *
 *    +0.42 → "+42"
 *    −0.08 → "−8"
 *     0.00 → "·"   (mid-dot, the editorial "no movement" mark)
 */
function formatTickValue(v: number, maxAbs: number): string {
  if (maxAbs <= 0 || Math.abs(v) < 0.01 * maxAbs) return "·"
  const pct = Math.round((v / maxAbs) * 100)
  if (pct > 0) return `+${pct}`
  if (pct < 0) return `\u2212${Math.abs(pct)}`
  return "·"
}

interface PeriodTapeProps {
  values:      number[]
  periodLabel: string
  tier:        WidthTier
  awakened:    boolean
}

function PeriodTape({ values, periodLabel, tier, awakened }: PeriodTapeProps) {
  /* Memoize labels + extrema indices so resize-driven re-renders don't
   * re-walk the array. Cheap at N=12, free at N=5, but the discipline
   * is "every derived value through useMemo" so larger periods land
   * for free later. */
  const labels   = useMemo(
    () => deriveTickLabels(periodLabel, values.length),
    [periodLabel, values.length],
  )
  const maxAbs   = useMemo(
    () => Math.max(0.0001, ...values.map((v) => Math.abs(v))),
    [values],
  )
  const peakIdx  = useMemo(
    () => values.reduce((best, v, i) => (v > values[best] ? i : best), 0),
    [values],
  )
  const troughIdx = useMemo(
    () => values.reduce((worst, v, i) => (v < values[worst] ? i : worst), 0),
    [values],
  )

  if (values.length === 0) return null
  const lastIdx = values.length - 1

  /* On the medium tier with high tick counts (e.g. YEAR=12 markers in a
   * 360px column), drop every other label so the rhythm doesn't crowd.
   * Values still render in full — we never sacrifice numeric truth, only
   * label density. */
  const collapseLabels = tier === "medium" && values.length > 5

  return (
    <div
      role="presentation"
      aria-label={`${periodLabel} period progression`}
      style={{
        display:        "flex",
        alignItems:     "stretch",
        justifyContent: "space-between",
        gap:            tier === "full" ? 4 : 2,
        flex:           "1 1 auto",
        minWidth:       0,
      }}
    >
      {values.map((v, i) => {
        const isLast    = i === lastIdx
        const isPeak    = i === peakIdx   && v > maxAbs * 0.05
        const isTrough  = i === troughIdx && v < -maxAbs * 0.05
        const showLabel = !collapseLabels || i % 2 === 0 || isLast
        const valueText = formatTickValue(v, maxAbs)

        const valueColor =
          isLast                        ? JARVIS_TONE.protag    :
          v >  maxAbs * 0.01            ? JARVIS_TONE.amber     :
          v < -maxAbs * 0.01            ? JARVIS_TONE.warnEdge  :
                                          JARVIS_TONE.quietest

        return (
          <div
            key={i}
            data-jarvis-tick={i}
            data-jarvis-tick-role={
              isLast ? "current" : isPeak ? "peak" : isTrough ? "trough" : "neutral"
            }
            style={{
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              justifyContent: "flex-start",
              gap:            2,
              flex:           "1 1 0",
              minWidth:       0,
              position:       "relative",
            }}
          >
            {/* ── Top accent — peak only, awakened-only ─────────────
             *  3px amber dot, low opacity. Sits above the label so the
             *  eye lands on it before reading the label. */}
            {isPeak && awakened && (
              <span
                aria-hidden
                style={{
                  width:       3,
                  height:      3,
                  borderRadius:"50%",
                  background:  JARVIS_TONE.amber,
                  opacity:     0.65,
                  marginBottom:-1,
                }}
              />
            )}

            {/* ── Label ────────────────────────────────────────────── */}
            <span
              className="font-mono uppercase select-none tabular-nums"
              style={{
                fontSize:      JARVIS_TX.eyebrow.fontSize,
                lineHeight:    JARVIS_TX.eyebrow.lineHeight,
                letterSpacing: JARVIS_TX.eyebrow.letterSpacing,
                fontWeight:    JARVIS_WEIGHT.medium,
                color:         isLast ? JARVIS_TONE.support : JARVIS_TONE.quiet,
                visibility:    showLabel ? "visible" : "hidden",
              }}
            >
              {labels[i]}
            </span>

            {/* ── Magnitude / NOW marker ───────────────────────────── */}
            <span
              className="font-mono select-none tabular-nums"
              style={{
                fontSize:      JARVIS_TX.caption.fontSize,
                lineHeight:    JARVIS_TX.caption.lineHeight,
                letterSpacing: JARVIS_TX.caption.letterSpacing,
                fontWeight:    isLast ? JARVIS_WEIGHT.medium : JARVIS_WEIGHT.regular,
                color:         valueColor,
              }}
            >
              {isLast ? "NOW" : valueText}
            </span>

            {/* ── Bottom accent — current → amber, trough → warnEdge ─
             *  The two strongest period anchors get a bottom punctuation
             *  mark. Current is bigger (4px) and brighter (0.85 opacity)
             *  so the trader's eye locks to "right now" first. */}
            {(isLast || isTrough) && (
              <span
                aria-hidden
                style={{
                  width:        isLast ? 4 : 3,
                  height:       isLast ? 4 : 3,
                  borderRadius: "50%",
                  background:
                    isLast   ? JARVIS_TONE.amber    :
                    isTrough ? JARVIS_TONE.warnEdge :
                               JARVIS_TONE.quiet,
                  opacity:    isLast ? 0.85 : 0.55,
                  marginTop:  1,
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  STAT LADDER — three-row mono-caps editorial readout
 *  ─────────────────────────────────────────────────────────────────────────
 *  Replaces the inline hairline-separated `vsLong · BEST · …` line that
 *  shipped with the first cut of Surface 1. The ladder gives each stat
 *  its OWN row with a left mono-caps label and a right tonal value, the
 *  rows separated by a single quiet hairline.
 *
 *  Three rows is the doctrine maximum — beyond three the eye starts
 *  scanning instead of reading. If a fourth stat is needed the host
 *  should rotate stats into the ladder (Surface 2 territory), not stack
 *  them.
 *
 *  Layout per row:
 *    ┌─ 9.5px mono-caps label ─┐ ┌─ 12.5px tonal value ─┐
 *    │  PRIOR                  │ │  +$520               │
 *    └─────────────────────────┘ └──────────────────────┘
 *  ───────────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────────────────
 *  PERIOD BREAKDOWN PANEL — period profit by managed account
 *  ─────────────────────────────────────────────────────────────────────────
 *  The hover-reveal payload for the protagonist headline. Where the legacy
 *  StatLadder showed PRIOR / BEST / CHANGE (period-over-period restatements
 *  of the same number), this panel answers a structurally different
 *  question:
 *
 *      "Where did this {WEEK | MONTH | YEAR} of profit COME FROM?"
 *
 *  Reading the panel top-to-bottom:
 *
 *    HEADER  ·  WEEK PROFIT · ALL ACCOUNTS                 +$1,247
 *               (period qualifier)                      (protagonist net)
 *
 *    HAIRLINE
 *
 *    ROW · MAIN LIVE          IC MARKETS · LIVE    +$520    42% ▮▮▮▮▮▯▯▯
 *    ROW · FTMO CHALLENGE     FTMO · CHL          +$612 ★   49% ▮▮▮▮▮▮▮▯
 *    ROW · DEMO PRACTICE      OANDA · DEMO        +$115     9% ▮▯▯▯▯▯▯▯
 *
 *    HAIRLINE
 *
 *    FOOTER  ·  3 ACCOUNTS · 3 GREEN · 0 RED          STRONGEST: FTMO
 *
 *  Tone discipline: account names + venues sit in the quietest editorial
 *  tones; the signed P&L per row drives all chromatic energy. The 12px
 *  share-bar at the right end of each row is built from typographic
 *  block-shade glyphs (▮ / ▯) — no SVG paths, no CSS bars. Pure mono
 *  rhythm. ─────────────────────────────────────────────────────────────── */

type PeriodBreakdownProps = NonNullable<EquityProtagonistBandProps["periodBreakdown"]>

function PeriodBreakdownPanel({ data }: { data: PeriodBreakdownProps }) {
  const { periodLabel, totalPnlFmt, totalTone, rows, footerSummary } = data
  const totalColor =
    totalTone === "amber"    ? JARVIS_TONE.amber    :
    totalTone === "warnEdge" ? JARVIS_TONE.warnEdge :
                               JARVIS_TONE.support

  return (
    <div
      role="region"
      aria-label={`${periodLabel} profit by account`}
      style={{
        display:       "flex",
        flexDirection: "column",
        gap:           JARVIS_RHYTHM.tight,
        minWidth:      0,
      }}
    >
      {/* ── HEADER ROW — period phrase on the left, total on the right ── */}
      <div className="flex items-baseline justify-between" style={{ gap: 12 }}>
        <span
          className="font-mono uppercase"
          style={{
            fontSize:      JARVIS_TX.eyebrow.fontSize,
            lineHeight:    JARVIS_TX.eyebrow.lineHeight,
            letterSpacing: JARVIS_TX.eyebrow.letterSpacing,
            color:         JARVIS_TONE.support,
            fontWeight:    JARVIS_WEIGHT.medium,
          }}
        >
          {periodLabel} PROFIT{" "}
          <span style={{ color: JARVIS_TONE.quietest, opacity: 0.85 }}>
            · ALL ACCOUNTS
          </span>
        </span>
        <span
          className="font-mono tabular-nums"
          style={{
            fontSize:      JARVIS_TX.body.fontSize,
            lineHeight:    JARVIS_TX.body.lineHeight,
            letterSpacing: JARVIS_TX.body.letterSpacing,
            color:         totalColor,
            fontWeight:    JARVIS_WEIGHT.medium,
          }}
        >
          {totalPnlFmt}
        </span>
      </div>

      {/* ── HAIRLINE — quietest rule, separates header from rows. ────── */}
      <span
        aria-hidden
        style={{
          display:    "block",
          height:     1,
          background: JARVIS_RULE.idle.color,
          opacity:    JARVIS_RULE.idle.opacity * 0.55,
          marginTop:  2,
          marginBottom: 2,
        }}
      />

      {/* ── ACCOUNT ROWS ─────────────────────────────────────────────── */}
      <div role="list" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {rows.map((r) => {
          const pnlColor =
            r.pnlRaw > 0 ? JARVIS_TONE.amber    :
            r.pnlRaw < 0 ? JARVIS_TONE.warnEdge :
                           JARVIS_TONE.quiet

          /* Build a 10-cell typographic share bar.
           * `filledCells = clamp(round(sharePct * 10), 0..10)`. */
          const filled = Math.max(0, Math.min(10, Math.round(r.sharePct * 10)))
          const bar    = "▮".repeat(filled) + "▯".repeat(10 - filled)
          const sharePctRounded = Math.round(r.sharePct * 100)

          return (
            <div
              key={r.id}
              role="listitem"
              className="flex items-baseline"
              style={{
                gap:        12,
                minHeight:  16,
              }}
            >
              {/* ── LEFT BLOCK · account name + venue qualifier ──────── */}
              <div
                className="flex flex-col"
                style={{
                  flex:     "1 1 auto",
                  minWidth: 0,
                  gap:      1,
                }}
              >
                <span
                  className="font-mono uppercase truncate"
                  style={{
                    fontSize:      JARVIS_TX.body.fontSize,
                    lineHeight:    JARVIS_TX.body.lineHeight,
                    letterSpacing: JARVIS_TX.body.letterSpacing,
                    color:         JARVIS_TONE.protag,
                    fontWeight:    JARVIS_WEIGHT.medium,
                  }}
                >
                  {r.name}
                  {r.isLead && (
                    <span
                      aria-hidden
                      style={{
                        marginLeft: 6,
                        color:      JARVIS_TONE.amber,
                        opacity:    0.95,
                      }}
                    >
                      ★
                    </span>
                  )}
                </span>
                <span
                  className="font-mono uppercase truncate"
                  style={{
                    fontSize:      JARVIS_TX.eyebrow.fontSize,
                    lineHeight:    JARVIS_TX.eyebrow.lineHeight,
                    letterSpacing: JARVIS_TX.eyebrow.letterSpacing,
                    color:         JARVIS_TONE.quietest,
                  }}
                >
                  {r.venue}
                  <span style={{ opacity: 0.6, margin: "0 0.45em" }}>·</span>
                  {r.equityFmt}
                </span>
              </div>

              {/* ── RIGHT BLOCK · signed P&L, share %, share bar ─────── */}
              <div
                className="flex items-baseline"
                style={{
                  gap:           10,
                  flex:          "0 0 auto",
                  whiteSpace:    "nowrap",
                }}
              >
                <span
                  className="font-mono tabular-nums"
                  style={{
                    fontSize:      JARVIS_TX.body.fontSize,
                    lineHeight:    JARVIS_TX.body.lineHeight,
                    letterSpacing: JARVIS_TX.body.letterSpacing,
                    color:         pnlColor,
                    fontWeight:    JARVIS_WEIGHT.medium,
                    minWidth:      66,
                    textAlign:     "right",
                    display:       "inline-block",
                  }}
                >
                  {r.pnlFmt}
                </span>
                <span
                  className="font-mono uppercase tabular-nums"
                  style={{
                    fontSize:      JARVIS_TX.eyebrow.fontSize,
                    lineHeight:    JARVIS_TX.eyebrow.lineHeight,
                    letterSpacing: JARVIS_TX.eyebrow.letterSpacing,
                    color:         JARVIS_TONE.quietest,
                    minWidth:      32,
                    textAlign:     "right",
                    display:       "inline-block",
                  }}
                >
                  {sharePctRounded}%
                </span>
                <span
                  aria-hidden
                  className="font-mono"
                  style={{
                    fontSize:   9,
                    letterSpacing: "0.04em",
                    color:      r.pnlRaw > 0
                      ? JARVIS_TONE.amber
                      : r.pnlRaw < 0
                        ? JARVIS_TONE.warnEdge
                        : JARVIS_TONE.quietest,
                    opacity:    0.85,
                  }}
                >
                  {bar}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── FOOTER · summary phrase ──────────────────────────────────── */}
      {footerSummary && (
        <>
          <span
            aria-hidden
            style={{
              display:    "block",
              height:     1,
              background: JARVIS_RULE.idle.color,
              opacity:    JARVIS_RULE.idle.opacity * 0.45,
              marginTop:  4,
              marginBottom: 2,
            }}
          />
          <span
            className="font-mono uppercase"
            style={{
              fontSize:      JARVIS_TX.eyebrow.fontSize,
              lineHeight:    JARVIS_TX.eyebrow.lineHeight,
              letterSpacing: JARVIS_TX.eyebrow.letterSpacing,
              color:         JARVIS_TONE.quietest,
            }}
          >
            {footerSummary}
          </span>
        </>
      )}
    </div>
  )
}

interface StatLadderRow {
  label: string
  value: string
  tone:  keyof typeof JARVIS_TONE
}

function StatLadder({ rows }: { rows: StatLadderRow[] }) {
  return (
    <div
      role="list"
      aria-label="period statistics"
      style={{
        display:        "flex",
        flexDirection:  "column",
        gap:            2,
        minWidth:       0,
      }}
    >
      {rows.map((r, i) => (
        <React.Fragment key={r.label}>
          <div
            role="listitem"
            style={{
              display:        "flex",
              alignItems:     "baseline",
              justifyContent: "space-between",
              gap:            JARVIS_RHYTHM.bay,
              padding:        "2px 0",
            }}
          >
            <Tx size="eyebrow" tone="quiet">
              {r.label}
            </Tx>
            <span
              className="font-mono tabular-nums"
              style={{
                fontSize:      JARVIS_TX.body.fontSize,
                lineHeight:    JARVIS_TX.body.lineHeight,
                letterSpacing: JARVIS_TX.body.letterSpacing,
                fontWeight:    JARVIS_WEIGHT.medium,
                color:         JARVIS_TONE[r.tone],
              }}
            >
              {r.value}
            </span>
          </div>
          {i < rows.length - 1 && (
            <span
              aria-hidden
              style={{
                display:    "block",
                height:     1,
                background: JARVIS_RULE.idle.color,
                opacity:    JARVIS_RULE.idle.opacity * 0.7,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  THE BAND
 *  ─────────────────────────────────────────────────────────────────────── */

export function EquityProtagonistBand(props: EquityProtagonistBandProps) {
  const {
    balance,
    periodLabel,
    net,
    netRaw,
    vsPct,
    vsLong,
    best,
    spark,
    onEngage,
    ambient = true,
    composition,
    periodBreakdown,
    className,
  } = props

  /* ── State ladder ──────────────────────────────────────────────────
   *  awakened — cursor is inside the band (or the band has focus)
   *  pressed  — pointer is currently down (drives the micro-tap haptic)
   *
   *  We deliberately do NOT track focus separately from awakened — the
   *  keyboard a11y path uses focus to drive `awakened` so the keyboard
   *  user sees the same revelation as the mouse user. */
  const [awakened, setAwakened] = useState(false)
  const [pressed,  setPressed]  = useState(false)
  const reducedMotion = useReducedMotion()

  /* Width tier — the band reads its OWN rendered width. The parent
   *  doesn't have to know. */
  const [bandRef, bandW] = useElementWidth<HTMLDivElement>()
  const tier = useMemo(() => tierFromWidth(bandW || 480), [bandW])

  /* Tone resolution — netRaw drives the chip border + value color via
   *  the locked semantic ladder. We never inline a hex literal here. */
  const tone = useMemo(() => jarvisToneFor(netRaw), [netRaw])

  /* Magnitude split — the Vantary signature numeric trick reproduced
   *  here from the foundation so this surface owns its own typography. */
  const { lead, tail } = useMemo(() => splitMagnitude(balance), [balance])

  /* Protagonist size driven by tier — locked to the JARVIS_TX scale.
   *  The headline token is 38px; we narrow to 32 / 28 at progressively
   *  tighter widths to keep the lead+tail on a single line. */
  const protagonistSize =
    tier === "full"    ? JARVIS_TX.headline.fontSize        :
    tier === "medium"  ? JARVIS_TX.headline.fontSize        :
    tier === "narrow"  ? JARVIS_TX.headline.fontSize - 6    :
                         JARVIS_TX.headline.fontSize - 10

  /* ── EYEBROW TEXT ─────────────────────────────────────────────────
   *  The trader called out "what is this LIVE EQUITY" — the legacy
   *  phrase ("WEEK · LIVE EQUITY") read as a label without context.
   *  The new construction makes the relationship explicit:
   *
   *      ACCOUNT EQUITY · WEEK TO DATE
   *      ACCOUNT EQUITY · MONTH TO DATE
   *      ACCOUNT EQUITY · YEAR TO DATE
   *
   *  Now the headline figure has a clear noun ("ACCOUNT EQUITY"),
   *  and the period reads as the qualifier on the right ("WEEK TO
   *  DATE"). On medium/narrow tiers we keep the period only so the
   *  band's vertical rhythm isn't disturbed. */
  const periodToDate =
    periodLabel === "WEEK"  ? "WEEK TO DATE"  :
    periodLabel === "MONTH" ? "MONTH TO DATE" :
    periodLabel === "YEAR"  ? "YEAR TO DATE"  :
                              periodLabel
  const eyebrowText =
    tier === "full"
      ? `ACCOUNT EQUITY · ${periodToDate}`
      : periodToDate

  /* Whether the period tape + stat ladder mount on awaken.
   *
   * The tape needs horizontal headroom — at "narrow" we collapse to
   * ladder-only, at "minimum" we suppress both (the band has just
   * enough room for the eyebrow + protagonist + chip degraded form).
   *
   * The ladder is more forgiving: it lives in any width >= narrow
   * because its rows reflow vertically. */
  /* PERIOD TAPE — RETIRED.
   * The day-by-day labels (MON/TUE/WED…) were redundant with the
   * Period Presentation strip immediately below the band, which
   * already renders a richer per-day breakdown. Keeping both meant
   * the trader read the same period twice with different vocabulary.
   * The flag stays here as `false` so the prop wiring stays compatible
   * but the tape never mounts. */
  const showTape   = false
  const showLadder = awakened && tier !== "minimum"

  /* The composition panel — surfaces ONLY when the host wired it up
   * AND the band is awakened AND we're not at the very narrowest tier
   * (where the composition rows would lose their column rhythm). The
   * panel sits BELOW the tape/ladder grid and answers, in editorial
   * typography, "what is this number made of?". */
  const showComposition =
    awakened &&
    !!composition &&
    composition.rows.length > 0 &&
    tier !== "minimum"

  /* The period breakdown panel — surfaces on awaken when the host
   * wired it up. This is the protagonist hover surface: "where did
   * this period's profit come from?". When both periodBreakdown and
   * composition are provided, breakdown wins and we suppress the
   * StatLadder grid entirely so the panel becomes the single hover
   * payload. */
  const showPeriodBreakdown =
    awakened &&
    !!periodBreakdown &&
    periodBreakdown.rows.length > 0 &&
    tier !== "minimum"
  /* When the breakdown is shown, suppress the StatLadder — they
   * occupy the same vertical space and the breakdown is the more
   * informative surface. */
  const showLadderResolved = showLadder && !showPeriodBreakdown

  /* The micro-tap haptic — a brief compression on pointerdown that
   *  releases on pointerup. Wrapped behind reducedMotion so users who
   *  opt out get a static affordance. */
  const tapScale = pressed && !reducedMotion ? 0.985 : 1

  /* ── Render ─────────────────────────────────────────────────────── */

  return (
    <motion.div
      ref={bandRef}
      role={onEngage ? "button" : undefined}
      tabIndex={onEngage ? 0 : -1}
      aria-label={
        onEngage
          ? `${periodLabel} balance ${balance}, ${net}, click to expand`
          : undefined
      }
      onMouseEnter={() => setAwakened(true)}
      onMouseLeave={() => { setAwakened(false); setPressed(false) }}
      onFocus={() => setAwakened(true)}
      onBlur={()  => { setAwakened(false); setPressed(false) }}
      onPointerDown={() => onEngage && setPressed(true)}
      onPointerUp={()   => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onClick={onEngage}
      onKeyDown={(e) => {
        if (!onEngage) return
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onEngage()
        }
      }}
      animate={{ scale: tapScale }}
      transition={{
        duration: JARVIS_MOTION.awaken.duration / 1000,
        ease:     JARVIS_MOTION.awaken.easeArray,
      }}
      data-jarvis-tier={tier}
      data-jarvis-state={awakened ? "awakened" : "idle"}
      className={`relative outline-none ${className ?? ""}`}
      style={{
        cursor:        onEngage ? "pointer" : "default",
        display:       "flex",
        flexDirection: "column",
        gap:           JARVIS_RHYTHM.tight,
      }}
    >
      {/* ────────────��────────────────────────────────────────────────
       *  ROW 1 · TOP-LINE FLEX
       *  ─ eyebrow on the left ──────────── delta chip on the right ─
       *  Wraps to a column on the minimum tier so the chip doesn't
       *  squeeze the eyebrow off-screen.
       * ��──────────────────────────────────────────────────────────── */}
      <div
        className="flex items-baseline justify-between"
        style={{
          flexDirection: tier === "minimum" ? "column" : "row",
          gap:           JARVIS_RHYTHM.bay,
        }}
      >
        <Tx
          size="eyebrow"
          tone={awakened ? "support" : "quiet"}
        >
          {eyebrowText}
        </Tx>

        <DeltaChip
          net={net}
          vsPct={vsPct}
          tone={tone}
          netRaw={netRaw}
          tier={tier}
          awakened={awakened}
        />
      </div>

      {/* ─────────────���───────────────────────────────────────────────
       *  ROW 2 · PROTAGONIST
       *  The hero numeral. lead in semibold paper, tail in light ash.
       *  text-shadow breathes at JARVIS_CADENCE.breath cadence, with
       *  amplitude stepped up on awaken.
       * ─────────────���─────────────────────────────────────────────── */}
      <PnlHeartbeat trigger={net} radius={14}>
      <div className="inline-flex items-baseline" style={{ gap: 6 }}>
        <motion.span
          className="font-sans select-none"
          style={{
            fontSize:           protagonistSize,
            lineHeight:         JARVIS_TX.headline.lineHeight,
            letterSpacing:      JARVIS_TX.headline.letterSpacing,
            fontWeight:         JARVIS_WEIGHT.semibold,
            color:              JARVIS_TONE.protag,
            fontVariantNumeric: "tabular-nums",
            // Static text-shadow at rest — the breathe animation modulates it.
            textShadow: awakened
              ? "0 0 28px rgba(245, 245, 244, 0.18)"
              : "0 0 14px rgba(245, 245, 244, 0.08)",
            transition: "text-shadow 280ms ease",
          }}
          animate={
            ambient && !reducedMotion
              ? {
                  textShadow: awakened
                    ? [
                        "0 0 24px rgba(245, 245, 244, 0.16)",
                        "0 0 32px rgba(245, 245, 244, 0.22)",
                        "0 0 24px rgba(245, 245, 244, 0.16)",
                      ]
                    : [
                        "0 0 12px rgba(245, 245, 244, 0.06)",
                        "0 0 18px rgba(245, 245, 244, 0.10)",
                        "0 0 12px rgba(245, 245, 244, 0.06)",
                      ],
                }
              : undefined
          }
          transition={{
            duration: JARVIS_CADENCE.breath / 1000,
            ease:     JARVIS_MOTION.silk.easeArray,
            repeat:   Infinity,
          }}
        >
          {/* PHASE 3 · the protagonist lead is now a per-digit odometer.
              When the period flips (WEEK→MONTH→YEAR) only the changed
              digits roll to their new glyph; $ and commas stay static. */}
          <RollingNumber value={lead} digitHeight={protagonistSize} />
        </motion.span>
        {tail && (
          <span
            className="font-sans select-none"
            style={{
              fontSize:           protagonistSize,
              lineHeight:         JARVIS_TX.headline.lineHeight,
              letterSpacing:      JARVIS_TX.headline.letterSpacing,
              fontWeight:         JARVIS_WEIGHT.regular - 100, // 300, the lightest editorial weight
              color:              JARVIS_TONE.quiet,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {tail}
          </span>
        )}
      </div>
      </PnlHeartbeat>

      {/* ─────────────────────────────────────────────────────────────
       *  ROW 3 · AWAKENED REVEAL  (spark + long-vs / best-day)
       *  Mounted only on awaken. AnimatePresence handles entrance + exit.
       *  Crossed by a single hairline rule above so the band reads as a
       *  layered editorial unit, not a stack of detached rows.
       * ───────────────────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {(showTape || showLadderResolved || showComposition || showPeriodBreakdown) && (
          <motion.div
            key="awakened-reveal"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y:  0, height: "auto" }}
            exit={{    opacity: 0, y: -4, height: 0 }}
            transition={{
              duration: JARVIS_MOTION.awaken.duration / 1000,
              ease:     JARVIS_MOTION.awaken.easeArray,
            }}
            style={{ overflow: "hidden" }}
          >
            {/* ── Above-reveal hairline ───────────────────────────────
             *  JARVIS_RULE.awakened — brightens the moment the cursor
             *  enters. Bay-spacing above, tight below, so the rule
             *  reads as a band-wide editorial divider, not a chart axis. */}
            <span
              aria-hidden
              style={{
                display:      "block",
                height:       1,
                background:   JARVIS_RULE.awakened.color,
                opacity:      JARVIS_RULE.awakened.opacity,
                marginTop:    JARVIS_RHYTHM.bay,
                marginBottom: JARVIS_RHYTHM.tight,
              }}
            />

            {/* ── PERIOD BREAKDOWN PANEL ──────────────────────────────
             *  When the host wires up `periodBreakdown`, this is the
             *  ONLY hover payload — the StatLadder is suppressed
             *  upstream. The panel answers "where did this period's
             *  profit come from?" with one row per managed account. */}
            {showPeriodBreakdown && periodBreakdown && (
              <PeriodBreakdownPanel data={periodBreakdown} />
            )}

            {/* ── Reveal grid ─────────────────────────────────────────
             *  Legacy fallback for hosts that don't wire periodBreakdown.
             *  The StatLadder renders as PRIOR / BEST / CHANGE. */}
            <div
              style={{
                display:    "grid",
                alignItems: "stretch",
              }}
            >
              {showLadderResolved && (
                <StatLadder
                  rows={[
                    /* PRIOR — the period-over-period comparison. Tone
                     * inherits the chip tone so a winning week reads
                     * amber here as well. */
                    {
                      label: "PRIOR",
                      value: vsLong,
                      tone:  tone === "warnEdge" ? "warnEdge" : "support",
                    },
                    /* BEST — the strongest day of the period. Always
                     * amber when present (the "good" anchor of the
                     * period, regardless of the period's net tone). */
                    {
                      label: "BEST",
                      value: `${best.day.toUpperCase()} ${best.pl}`,
                      tone:  "amber",
                    },
                    /* CHANGE — the headline percentage move. Tone
                     * mirrors the chip again so the ladder reads as a
                     * single editorial unit with the chip above. */
                    {
                      label: "CHANGE",
                      value: vsPct,
                      tone:  tone === "warnEdge" ? "warnEdge" :
                             tone === "amber"    ? "amber"    :
                                                   "support",
                    },
                  ]}
                />
              )}
            </div>

            {/* ── Portfolio Composition sub-surface ────────────────────
             *  The hover-reveal account breakdown. Sits BELOW the
             *  tape/ladder grid, separated by a quieter hairline that
             *  reads as a paragraph break inside the same awakened
             *  composition. Only mounts when the host supplied a
             *  `composition` prop AND we have rows to show. */}
            {showComposition && composition && (
              <>
                <span
                  aria-hidden
                  style={{
                    display:      "block",
                    height:       1,
                    background:   JARVIS_RULE.idle.color,
                    opacity:      JARVIS_RULE.idle.opacity * 0.6,
                    marginTop:    JARVIS_RHYTHM.band,
                    marginBottom: 2,
                  }}
                />
                <EquityPortfolioComposition
                  rows={composition.rows}
                  total={composition.total}
                  footerSummary={composition.footerSummary}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 *  DELTA CHIP — interactive-looking pill that summarizes the period P&L
 *  ─────────────────────────────────────────────────────────────────────── */

function DeltaChip({
  net, vsPct, tone, netRaw, tier, awakened,
}: {
  net:      string
  vsPct:    string
  tone:     keyof typeof JARVIS_TONE
  netRaw:   number
  tier:     WidthTier
  awakened: boolean
}) {
  /* Resolve the actual color values off the locked tone. tone is one
   *  of "amber" | "warnEdge" | "support" — the chip border + value
   *  text read it identically so the chip can never have a value /
   *  border mismatch. */
  const valueColor =
    tone === "amber"    ? JARVIS_TONE.amber    :
    tone === "warnEdge" ? JARVIS_TONE.warnEdge :
                          JARVIS_TONE.protag

  const borderColor =
    tone === "amber"    ? JARVIS_TONE.amberHalo :
    tone === "warnEdge" ? JARVIS_TONE.warnEdge  :
                          JARVIS_RULE.awakened.color

  /* The arrow glyph — amber upside, paperDim downside, mid-dot for
   *  flat. Rendered alongside the percentage so the trader can read
   *  direction without parsing the sign. */
  const arrow = netRaw > 0 ? "▲" : netRaw < 0 ? "▼" : "·"

  /* ── DELTA CHIP — REDESIGNED FOR EDITORIAL VOICE ───────────────────
   *  The previous build wrapped the chip in a 1px-bordered, optionally
   *  amber-washed capsule. In a band that's otherwise made of
   *  hairlines + typography that capsule read as the only "boxy"
   *  element on the surface — instantly cheapening the editorial
   *  composition. The trader called it out.
   *
   *  The redesign drops every piece of capsule chrome — no border,
   *  no fill, no internal vertical hairline — and re-expresses the
   *  same two facts in a single editorial voice:
   *
   *      ▲  +$1,247   THIS WEEK +139%
   *      ▼  −$420     THIS MONTH −12%
   *
   *  Direction glyph (amber/warnEdge), then the signed currency net
   *  in tabular medium, then a mono-caps tail that reads as the
   *  comparison phrase. No two visual containers competing for the
   *  trader's eye — the whole chip reads as one editorial line. */
  /* Tail phrase — completes the chip line as one editorial sentence
   * instead of a bordered capsule. Reads "PERIOD UP" / "PERIOD DOWN"
   * / "PERIOD FLAT" depending on the locked tone. */
  const tail =
    tone === "warnEdge" ? "PERIOD DOWN" :
    tone === "amber"    ? "PERIOD UP"   :
                          "PERIOD FLAT"
  /* `borderColor` and `awakened` survive as named bindings to preserve
   * future hooks for accent micro-states (e.g. a quietly pulsing tail
   * on freshly-updated periods) without re-threading props later. */
  void borderColor; void awakened

  /* On the minimum tier the chip degrades further — only the signed
   *  net is shown, percentage suppressed. The protagonist always wins
   *  at narrow widths. */
  if (tier === "minimum") {
    return (
      <span
        className="font-mono tabular-nums"
        style={{
          fontSize:      JARVIS_TX.caption.fontSize,
          letterSpacing: JARVIS_TX.caption.letterSpacing,
          fontWeight:    JARVIS_WEIGHT.medium,
          color:         valueColor,
          whiteSpace:    "nowrap",
        }}
      >
        {`${arrow}  ${net}`}
      </span>
    )
  }

  return (
    <span
      className="inline-flex items-baseline"
      style={{
        gap:        8,
        whiteSpace: "nowrap",
      }}
    >
      {/* Direction arrow — the only ornament. Sized at caption to
       *  read as a glyph beside the value rather than dominate it. */}
      <span
        aria-hidden
        className="font-mono"
        style={{
          fontSize:   JARVIS_TX.caption.fontSize,
          color:      valueColor,
          lineHeight: 1,
        }}
      >
        {arrow}
      </span>

      {/* Net value — the chip's protagonist, now full sans body
       *  weight so it carries on its own without a frame. */}
      <span
        className="font-mono tabular-nums"
        style={{
          fontSize:      JARVIS_TX.body.fontSize,
          letterSpacing: JARVIS_TX.body.letterSpacing,
          fontWeight:    JARVIS_WEIGHT.medium,
          color:         valueColor,
        }}
      >
        {net}
      </span>

      {/* Mono-caps comparison tail — replaces the prior bordered
       *  vs-pct slot. Reads as a phrase that completes the line:
       *  "▲ +$1,247 — THIS WEEK +139%" instead of two boxed values. */}
      {tier !== "narrow" && (
        <span
          className="font-mono uppercase tabular-nums"
          style={{
            fontSize:      JARVIS_TX.eyebrow.fontSize,
            letterSpacing: JARVIS_TX.eyebrow.letterSpacing,
            fontWeight:    JARVIS_WEIGHT.medium,
            color:         JARVIS_TONE.quiet,
            marginLeft:    2,
          }}
        >
          {tail}
        </span>
      )}

      {/* Percentage — back to the chip tone so the eye still picks
       *  up the magnitude relative to the prior period. */}
      <span
        className="font-mono uppercase tabular-nums"
        style={{
          fontSize:      JARVIS_TX.eyebrow.fontSize,
          letterSpacing: JARVIS_TX.eyebrow.letterSpacing,
          fontWeight:    JARVIS_WEIGHT.medium,
          color:         tone === "amber" ? JARVIS_TONE.amber :
                         tone === "warnEdge" ? JARVIS_TONE.warnEdge :
                                               JARVIS_TONE.support,
        }}
      >
        {vsPct}
      </span>
    </span>
  )

}
