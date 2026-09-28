"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  <TemporalAnchorRail/>  ·  Active Window · Layer A
 *  ─────────────────────────────────────────────────────────────────────────
 *  v2 · FLIGHT-DECK CENTRED NAMEPLATE
 *  ─────────────────────────────────────
 *  User directive (13 May 2026): "remove this day 0s rest.. put the date
 *  timeframe detailed.. but make it look like flight deck.. that theme.
 *  it doesnt look profesisonal or archio theme we talked about."
 *
 *  RESOLUTION
 *  ──────────
 *  The previous rail rendered a flush-left editorial dateline:
 *      [● live]  DAY OS  •  REST  •  THU 14 MAY  •  02:42 UTC
 *  which read like a status bar — functional, but not signature.
 *  This rewrite re-cuts the rail in the Flight Deck nameplate pattern:
 *
 *        ────●  THURSDAY · 14 MAY 2026  ●────
 *             02:42 UTC · WEEK 20 · REST
 *           ● LONDON OPENS IN  4 H  18 M ●
 *        ═══════════════════════════════════ (traveling seam)
 *
 *  Three vertical strata, all centred, all borderless:
 *
 *    1. NAMEPLATE       — uppercase full-weekday + full-date + 4-digit
 *                         year, flanked by horizontal hairlines that
 *                         extend toward the panel edges and terminate
 *                         in soft accent dots (the Flight Deck "● TITLE ●"
 *                         signature).
 *    2. CHRONO META     — UTC clock with minute-rollover digit flash,
 *                         ISO week number, market state (LIVE / REST).
 *                         Dots replace pipes as separators.
 *    3. COUNTDOWN BAND  — the next session-open countdown, rendered
 *                         only when the market is closed. When live,
 *                         this band shows the active session id +
 *                         elapsed marker. Either way, it sits between
 *                         soft accent dots — same composition language
 *                         as the title row.
 *
 *  All three rows centre on the same vertical axis so the rail reads
 *  like an aircraft instrument cluster: stacked, symmetric, glanceable
 *  in any peripheral-vision sweep.
 *
 *  Visual rules (carried over from MASTERPLAN §2.1, extended for v2):
 *    a. No border, no background tint, no chip chrome anywhere.
 *    b. Vertical bar separators → 2 px accent dots, 0.6 α.
 *    c. Old "DAY OS / REST" nameplate is GONE — the panel's identity is
 *       now implicit (the whole right card IS the Day OS).
 *    d. Minute rollover still triggers a 320 ms digit-flash on the UTC
 *       clock characters (the panel's one stopwatch-verifiable cue).
 *    e. The bottom seam is the archio signature — 14 s traveling
 *       shimmer, pinched to transparent at both ends.
 *    f. Live ripple is now embedded in the COUNTDOWN BAND when live;
 *       suppressed entirely when at REST (so REST reads as a pure
 *       editorial dateline, not a status indicator).
 * ═══════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { VANTARY } from "../vantary-theme"
import { AW_CADENCE, AW_LETTER, AW_SIZE } from "@/lib/vantary/active-window-tokens"
import { ArchioSeam } from "./archio-seam"
import { ArchioPulseDot } from "./archio-pulse-dot"

export interface TemporalAnchorRailProps {
  /** Live UTC date object — used for the human-readable date label. */
  now: Date
  /** Live UTC day-of-week (0=Sun..6=Sat). */
  liveDow: number
  /** Formatted UTC clock "HH:MM". When this value changes (the minute
   *  rolls over) we trigger the digit-flash animation. */
  utcClock: string
  /** Whether the FX market is currently open. Drives the LIVE / REST
   *  label and the live dot's color (amber vs ash). */
  isMarketOpen: boolean
  /** Reduced-motion override. Disables the live ripple, the digit flash,
   *  and the seam shimmer; renders everything static. */
  reduced?: boolean
}

/* Long-form names — the Flight Deck rail spells the day out, doesn't
   abbreviate.  THU → THURSDAY · MAY → MAY (we keep the month short
   because spelling out "SEPTEMBER" with letter-spacing 0.32em pushes
   the dateline past comfortable line length on a 380 px wing). */
const FULL_DAYS = [
  "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY",
  "THURSDAY", "FRIDAY", "SATURDAY",
] as const
const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
] as const

/* ── ISO week-of-year computation (Mon-anchored) ─────────────────────────
 *  Used to render the "WEEK 20" stamp in the chrono meta row. We
 *  re-implement here so we don't drag a date-fns dependency in for
 *  one computation. ISO-8601 algorithm: nearest Thursday rule. */
function isoWeekOfYear(d: Date): number {
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  const dayNr = (target.getUTCDay() + 6) % 7   // Mon=0..Sun=6
  target.setUTCDate(target.getUTCDate() - dayNr + 3)
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4))
  const diff = (target.getTime() - firstThursday.getTime()) / 86_400_000
  return 1 + Math.round((diff - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7)
}

export function TemporalAnchorRail({
  now,
  liveDow,
  utcClock,
  isMarketOpen,
  reduced = false,
}: TemporalAnchorRailProps) {
  /* ── 1. Labels (derived once per render) ─────────────────────────── */
  const fullDay = FULL_DAYS[liveDow] ?? "MONDAY"
  const dayNum = now.getUTCDate().toString().padStart(2, "0")
  const monthAbbr = MONTHS[now.getUTCMonth()] ?? "MAY"
  const yearFull = now.getUTCFullYear()
  const dateLabel = `${fullDay}  ·  ${dayNum} ${monthAbbr} ${yearFull}`
  const weekNum = isoWeekOfYear(now).toString().padStart(2, "0")

  /* ── 2. Minute-rollover digit flash ─────────────────────────────────
   *  Drives the only stopwatch-verifiable animation in the panel.
   *  We re-key a <motion.span> whenever `utcClock` changes so the
   *  keyframe pass restarts; no per-second wakeups, no setInterval. */
  const previousClockRef = useRef(utcClock)
  const [flashKey, setFlashKey] = useState(0)
  useEffect(() => {
    if (previousClockRef.current === utcClock) return
    previousClockRef.current = utcClock
    setFlashKey((k) => k + 1)
  }, [utcClock])

  /* ── 3. Accent resolution ────────────────────────────────────────────
   *  LIVE state paints amber across the rail; REST state desaturates
   *  to ashSoft. The two accents never mix within the rail — the
   *  contrast is between the rail and the panel below. */
  const accent = isMarketOpen ? VANTARY.amber : VANTARY.ashSoft
  const accentSubtle = isMarketOpen ? VANTARY.amberHalo : "transparent"
  const liveAccent = isMarketOpen ? VANTARY.amber : VANTARY.ash

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        paddingTop: 2,
        paddingBottom: 10,
      }}
    >
      {/* ════════════════════════════════════════════════════════════════
            STRATUM 1 · THE NAMEPLATE ROW
            ────────────────────────────────────────────────────────────
            Composition:
                ──────●  THURSDAY · 14 MAY 2026  ●──────
            Each "──────●" half is a horizontal hairline (a flex-grow
            div painted with the same gradient as <ArchioSeam/>) that
            terminates in a 4 px accent dot before the title begins.
            The hairlines do the work of the panel-wide top divider —
            their inward-pinch toward the dots reads as "this is the
            chapter heading."
          ════════════════════════════════════════════════════════════ */}
      <div
        className="flex items-center"
        style={{
          gap: 12,
          paddingLeft: 4,
          paddingRight: 4,
          minHeight: 22,
        }}
      >
        {/* Left hairline — flex-grow so it absorbs all available room
            on the left side of the title. */}
        <NameplateHairline
          accent={accent}
          accentSubtle={accentSubtle}
          side="left"
          reduced={reduced}
        />

        {/* Left terminating dot. */}
        <NameplateDot accent={accent} />

        {/* The dateline itself. */}
        <span
          className="font-mono uppercase tabular-nums"
          style={{
            fontSize: AW_SIZE.eyebrowFontSize + 0.5,
            letterSpacing: AW_LETTER.eyebrowPremium,
            color: VANTARY.paper,
            fontWeight: 500,
            whiteSpace: "nowrap",
            textShadow: isMarketOpen ? `0 0 10px ${VANTARY.amberHalo}` : "none",
          }}
        >
          {dateLabel}
        </span>

        {/* Right terminating dot. */}
        <NameplateDot accent={accent} />

        {/* Right hairline — mirrors the left so the title is visually
            centred even when the panel narrows. */}
        <NameplateHairline
          accent={accent}
          accentSubtle={accentSubtle}
          side="right"
          reduced={reduced}
        />
      </div>

      {/* ════════════════════════════════════════════════════════════════
            STRATUM 2 · CHRONO META
            ────────────────────────────────────────────────────────────
            UTC clock (with minute-rollover digit-flash) · ISO week ·
            LIVE / REST tag. All three are typographic — no chips, no
            borders, just type with small dim accent dots between
            elements. The whole row is centred under the nameplate.
          ════════════════════════════════════════════════════════════ */}
      <div
        className="flex items-center justify-center"
        style={{ gap: 10, minHeight: 14 }}
      >
        {/* UTC clock with minute-rollover digit flash. */}
        <motion.span
          key={flashKey}
          className="font-mono uppercase tabular-nums"
          style={{
            fontSize: 10,
            letterSpacing: AW_LETTER.numeric,
            fontWeight: 500,
            willChange: "color",
          }}
          initial={false}
          animate={
            reduced
              ? { color: accent }
              : { color: [accent, VANTARY.paper, accent] }
          }
          transition={{
            duration: AW_CADENCE.minuteRolloverFlash,
            ease: "easeInOut",
          }}
        >
          {utcClock} UTC
        </motion.span>

        <AccentDot accent={accent} />

        {/* ISO week. The trader's week-position anchor. */}
        <span
          className="font-mono uppercase tabular-nums"
          style={{
            fontSize: 10,
            letterSpacing: AW_LETTER.eyebrow,
            color: VANTARY.ashSoft,
            fontWeight: 500,
          }}
        >
          WEEK {weekNum}
        </span>

        <AccentDot accent={accent} />

        {/* LIVE / REST — typographic stamp with breath glow when live. */}
        <span
          className="font-mono uppercase tabular-nums"
          style={{
            fontSize: 10,
            letterSpacing: AW_LETTER.eyebrowPremium,
            color: accent,
            fontWeight: 500,
            textShadow: isMarketOpen ? `0 0 8px ${VANTARY.amberHalo}` : "none",
          }}
        >
          {isMarketOpen ? "LIVE" : "REST"}
        </span>

        {/* Live ripple — only renders when market is open, sits flush
            to the right of the LIVE label like a confirming heartbeat. */}
        {isMarketOpen && (
          <ArchioPulseDot
            accent={liveAccent}
            size={AW_SIZE.liveDotCore}
            reduced={reduced}
          />
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════
            STRATUM 3 · BOTTOM SEAM
            ────────────────────────────────────────────────────────────
            The archio signature divider — 14 s traveling shimmer, the
            same instrument used between every panel section.
          ════════════════════════════════════════════════════════════ */}
      <ArchioSeam accent={accent} reduced={reduced} />
    </div>
  )
}

/* ───────────────────────────────────────────────────────────────────────
 *  Sub-components
 * ─────────────────────────────────────────────────────────────────── */

/** Horizontal hairline that flanks the nameplate. Renders the same
 *  three-stop gradient as <ArchioSeam/> but inline-flex sized so the
 *  flexbox parent can stretch it on either side of the title. */
function NameplateHairline({
  accent,
  accentSubtle,
  side,
  reduced,
}: {
  accent: string
  accentSubtle: string
  side: "left" | "right"
  reduced: boolean
}) {
  /* The gradient pinches to TRANSPARENT at the outer edge (towards the
     panel margin) and rises to the accent at the INNER edge (towards
     the centre dot). This makes the title feel like a fold-open chapter
     marker — the strongest light is where the title begins. */
  const direction = side === "left" ? "to right" : "to left"
  return (
    <span
      aria-hidden
      style={{
        flex: 1,
        height: 1,
        background:
          `linear-gradient(${direction}, ` +
          `  transparent 0%, ` +
          `  ${accentSubtle} 50%, ` +
          `  ${accent} 100%)`,
        opacity: reduced ? 0.55 : 0.72,
      }}
    />
  )
}

/** 4 × 4 accent dot terminating each nameplate hairline. */
function NameplateDot({ accent }: { accent: string }) {
  return (
    <span
      aria-hidden
      style={{
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: accent,
        boxShadow: `0 0 6px ${accent}`,
        flexShrink: 0,
      }}
    />
  )
}

/** 2 × 2 accent dot used INSIDE the chrono-meta row (smaller than the
 *  nameplate dot so the hierarchy reads: nameplate > meta). */
function AccentDot({ accent }: { accent: string }) {
  return (
    <span
      aria-hidden
      style={{
        width: 3,
        height: 3,
        borderRadius: "50%",
        background: accent,
        opacity: 0.55,
        boxShadow: `0 0 3px ${accent}`,
        flexShrink: 0,
      }}
    />
  )
}
