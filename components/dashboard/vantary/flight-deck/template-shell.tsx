"use client"

/* ═════════════════════════════════════════════════════════════════════════
   <TemplateShell />

   The universal seven-zone wrapper that every flight-deck destination
   template renders inside. Every one of the sixteen destinations
   (Compare Mentors, Today's Stats, Build Setup, etc.) renders inside
   this shell, so users learn the surface ONCE and apply it everywhere.

   The seven zones are rendered in this fixed order:

     1. Identity strip ............... eyebrow code · live UTC tick · pulse
     2. Prelude ...................... framing line · what this template does
     3. Inputs zone .................. picker / search / date range / etc.
     4. Resolver zone ................ confirmation of selection · presets
     5. Render plan .................. mission briefing · telemetry quad ·
                                       advisory sheets · schedule matrix ·
                                       destination bay
     6. Drill-forward rail ........... 3–6 follow-up question chips
     7. Footer telemetry strip ....... UTC tick · sources · refresh · pin

   Each zone is OPTIONAL — a stub template might render only zones 1, 2,
   and 7. The marquee Compare Mentors template renders all seven.

   The shell itself is a passive container. It owns:
     · the dashed-rule + corner registration marks (FdCorners)
     · the breathing pulse on the eyebrow
     · the slot-based composition (children-by-name via props)
     · the calm, in-place mount/unmount with EASE_V curves
     · a "warming up" state for stub destinations that aren't built yet

   It does NOT own:
     · selection state — owned by individual templates
     · data fetching — pure render
     · command shortcuts — owned by the cockpit shell
   ═════════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Pin, Share2, Download, Loader2 } from "lucide-react"
import { VANTARY, EASE_V } from "../vantary-theme"
import { useUTCSecondClock } from "../clock-spine"
import {
  FdCorners,
  FdLiveTick,
  FdRouteId,
  FdDashedRule,
} from "./flight-deck-primitives"
import type { DrillForwardSuggestion } from "./template-types"

type TemplateShellProps = {
  /** Stable id for instrumentation + key. */
  id: string
  /** Eyebrow band code, e.g. "MENTOR HALL · COMPARE · LIVE". */
  eyebrow: string
  /** Route id prefix shown to the left of the headline (e.g. "T-09"). */
  routeId?: string
  /** Headline shown directly under the identity strip. */
  headline: string
  /** Optional sub-headline (small, ash). */
  subheadline?: string
  /** Prelude paragraph — what this template does + what it needs. */
  prelude?: React.ReactNode
  /** Inputs zone (e.g. picker, search, date range). */
  inputs?: React.ReactNode
  /** Resolver zone (presets, confirmation chips). */
  resolver?: React.ReactNode
  /** Main render plan zone (mission briefing, telemetry quad, etc.). */
  renderPlan?: React.ReactNode
  /** Drill-forward follow-ups. */
  drillForward?: readonly DrillForwardSuggestion[]
  /** Optional source-citation chips for the footer. */
  sources?: readonly string[]
  /** Footer "last refreshed" stamp. Pass an ISO string or display string. */
  lastRefreshed?: string
  /** "warming" → render a calm "coming online" body inside the shell. */
  state?: "ready" | "warming"
  /** Substantive content for the warming body. When provided, the shell
   *  paints a four-panel preview ("what this replaces", "one decision
   *  you can make here", "data this will consume", "where this lives in
   *  your day"). When omitted, the shell falls back to the minimal
   *  spinner-card warming state. */
  warmingDetails?: {
    /** Headline framing — e.g. "MENTOR HALL · LIBRARY". */
    destination: string
    /** What this destination replaces in the legacy app. */
    replaces: string
    /** One decision the destination will help you make. */
    decision: string
    /** The data sources the destination will consume. */
    expectedSources: readonly string[]
    /** Where on the trading rail it connects. */
    railConnection: "prep" | "decision" | "execution" | "record" | "review"
    /** Optional preview node for destinations that have richer staging
     *  content (e.g. Mentor Hall · Library can show all eight mentor
     *  cards even before its full filtering UI lands). */
    preview?: React.ReactNode
  }
  /** Callback fired when the user clicks "Close" — host owns the close. */
  onClose?: () => void
  /** Callback fired when the user clicks the pin icon. Host owns persistence. */
  onPin?: () => void
  /** Whether this template is currently pinned. */
  pinned?: boolean
}

export function TemplateShell({
  id,
  eyebrow,
  routeId,
  headline,
  subheadline,
  prelude,
  inputs,
  resolver,
  renderPlan,
  drillForward,
  sources,
  lastRefreshed,
  state = "ready",
  warmingDetails,
  onClose,
  onPin,
  pinned = false,
}: TemplateShellProps) {
  const tickDate = useUTCSecondClock()
  const tickStr = `${tickDate.getUTCHours().toString().padStart(2, "0")}:${tickDate
    .getUTCMinutes()
    .toString()
    .padStart(2, "0")}:${tickDate.getUTCSeconds().toString().padStart(2, "0")}`

  return (
    <motion.section
      data-fd-template={id}
      role="region"
      aria-label={headline}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.32, ease: EASE_V }}
      className="relative w-full rounded-3xl overflow-hidden"
      style={{
        /* Match the Oracle answer deck so the template feels like a
           natural extension of the ask-bar, not a separate panel. */
        background: VANTARY.glassDeep,
        border: `1px solid ${VANTARY.amberHalo}`,
        backdropFilter: "blur(36px) saturate(160%)",
        WebkitBackdropFilter: "blur(36px) saturate(160%)",
        boxShadow: `0 8px 48px rgba(0,0,0,0.4), 0 0 80px ${VANTARY.amberHalo}20`,
      }}
    >
      <FdCorners inset={14} size={12} />

      {/* ── ZONE 1 · Identity strip ──────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-5 py-3"
        style={{ borderBottom: `1px solid ${VANTARY.ruleSoft}` }}
      >
        <motion.span
          aria-hidden
          className="rounded-full"
          style={{
            width: 5,
            height: 5,
            background: VANTARY.amber,
            boxShadow: `0 0 6px ${VANTARY.amberHalo}`,
          }}
          animate={{ opacity: [0.45, 1, 0.45], scale: [0.92, 1.06, 0.92] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <span
          className="font-mono uppercase whitespace-nowrap select-none"
          style={{
            fontSize: 10,
            letterSpacing: "0.22em",
            color: VANTARY.amber,
            fontWeight: 500,
          }}
        >
          {eyebrow}
        </span>

        <span aria-hidden style={{ flex: 1, height: 1, background: VANTARY.rule }} />

        {routeId && (
          <FdRouteId id={routeId} tone="neutral" />
        )}
        <FdLiveTick label="UTC" showSeconds size={9.5} />

        {/* Pin / close affordances — quiet, right-edge. */}
        <button
          type="button"
          onClick={onPin}
          aria-pressed={pinned}
          aria-label={pinned ? "Unpin template" : "Pin template"}
          className="inline-flex items-center justify-center rounded-sm transition-colors"
          style={{
            width: 22, height: 22,
            border: `1px solid ${pinned ? VANTARY.amberHalo : VANTARY.rule}`,
            background: pinned ? VANTARY.amberWash : "transparent",
          }}
        >
          <Pin size={11} strokeWidth={1.5} color={pinned ? VANTARY.amber : VANTARY.ashSoft} />
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close template"
            className="font-mono uppercase rounded-sm transition-colors"
            style={{
              fontSize: 9,
              letterSpacing: "0.22em",
              padding: "3px 8px",
              border: `1px solid ${VANTARY.rule}`,
              color: VANTARY.ashSoft,
              background: "transparent",
            }}
          >
            CLOSE
          </button>
        )}
      </div>

      {/* ── ZONE 2 · Prelude ─────────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-baseline gap-3 mb-1">
          {routeId && (
            <span
              className="font-mono uppercase tabular-nums select-none shrink-0"
              style={{
                fontSize: 10,
                letterSpacing: "0.22em",
                color: VANTARY.ashSoft,
                paddingTop: 6,
              }}
            >
              {routeId}
            </span>
          )}
          <h2
            className="font-sans"
            style={{
              fontSize: 24,
              lineHeight: 1.2,
              letterSpacing: "-0.018em",
              color: VANTARY.paper,
              fontWeight: 600,
              textWrap: "balance",
            }}
          >
            {headline}
          </h2>
        </div>
        {subheadline && (
          <p
            className="font-sans"
            style={{
              fontSize: 13.5,
              lineHeight: 1.55,
              color: VANTARY.ashSoft,
              maxWidth: 720,
              textWrap: "pretty",
            }}
          >
            {subheadline}
          </p>
        )}
        {prelude && (
          <div
            className="font-sans mt-3"
            style={{
              fontSize: 13.5,
              lineHeight: 1.6,
              color: VANTARY.ash,
              maxWidth: 760,
              textWrap: "pretty",
            }}
          >
            {prelude}
          </div>
        )}
      </div>

      {/* ── State branch · WARMING vs READY ──────────────────────────── */}
      {state === "warming" ? (
        <WarmingState details={warmingDetails} />
      ) : (
        <>
          {/* ── ZONE 3 · Inputs ──────────────────────────────────────── */}
          {inputs && (
            <div
              className="px-5 pb-4"
              style={{ borderTop: `1px dashed ${VANTARY.rule}` }}
            >
              <div className="pt-2">
                <ZoneHeader code="INPUTS" routeId="Z03" />
                <div className="mt-3">{inputs}</div>
              </div>
            </div>
          )}

          {/* ── ZONE 4 · Resolver ────────────────────────────────────── */}
          {resolver && (
            <div className="px-5 pb-4">
              <FdDashedRule />
              <div className="pt-3">
                <ZoneHeader code="RESOLVER" routeId="Z04" />
                <div className="mt-3">{resolver}</div>
              </div>
            </div>
          )}

          {/* ── ZONE 5 · Render plan ─────────────────────────────────── */}
          {renderPlan && (
            <div className="px-5 pb-4">
              <FdDashedRule />
              <div className="pt-4">{renderPlan}</div>
            </div>
          )}

          {/* ── ZONE 6 · Drill-forward rail ──────────────────────────── */}
          {drillForward && drillForward.length > 0 && (
            <div className="px-5 pb-5">
              <FdDashedRule />
              <div className="pt-3">
                <ZoneHeader code="DRILL-FORWARD" routeId="Z06" />
                <div className="flex flex-wrap gap-2 mt-3">
                  {drillForward.map((d) => (
                    <DrillForwardChip key={d.id} driller={d} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── ZONE 7 · Footer telemetry ────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-5 py-3"
        style={{ borderTop: `1px solid ${VANTARY.ruleSoft}` }}
      >
        <span
          className="font-mono uppercase tabular-nums"
          style={{
            fontSize: 10,
            letterSpacing: "0.22em",
            color: VANTARY.ashSoft,
          }}
        >
          TRANSMIT · UTC {tickStr}
        </span>
        <span aria-hidden style={{ width: 22, height: 1, background: VANTARY.rule }} />
        {sources && sources.length > 0 && (
          <span
            className="font-mono uppercase truncate"
            style={{
              fontSize: 10,
              letterSpacing: "0.18em",
              color: VANTARY.ashSoft,
            }}
          >
            SRC · {sources.slice(0, 4).join(" · ")}
          </span>
        )}
        <span aria-hidden style={{ flex: 1, height: 1, background: VANTARY.rule }} />
        {lastRefreshed && (
          <span
            className="font-mono uppercase tabular-nums"
            style={{
              fontSize: 10,
              letterSpacing: "0.18em",
              color: VANTARY.ashSoft,
            }}
          >
            REFRESHED · {lastRefreshed}
          </span>
        )}
        <button
          type="button"
          aria-label="Share template result"
          className="inline-flex items-center justify-center rounded-sm"
          style={{
            width: 22, height: 22,
            border: `1px solid ${VANTARY.rule}`,
            background: "transparent",
          }}
        >
          <Share2 size={11} strokeWidth={1.5} color={VANTARY.ashSoft} />
        </button>
        <button
          type="button"
          aria-label="Export template result"
          className="inline-flex items-center justify-center rounded-sm"
          style={{
            width: 22, height: 22,
            border: `1px solid ${VANTARY.rule}`,
            background: "transparent",
          }}
        >
          <Download size={11} strokeWidth={1.5} color={VANTARY.ashSoft} />
        </button>
      </div>
    </motion.section>
  )
}

/* ── Zone header — small eyebrow + dashed rule + route id ──────────── */

function ZoneHeader({ code, routeId }: { code: string; routeId: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="font-mono uppercase select-none"
        style={{
          fontSize: 9,
          letterSpacing: "0.24em",
          color: VANTARY.amber,
          fontWeight: 600,
        }}
      >
        {code}
      </span>
      <FdDashedRule className="flex-1" />
      <FdRouteId id={routeId} tone="neutral" />
    </div>
  )
}

/* ── Drill-forward chip ─────────────────────────────────────────────── */

function DrillForwardChip({
  driller,
}: {
  driller: DrillForwardSuggestion
}) {
  const [hover, setHover] = React.useState(false)
  return (
    <button
      type="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => driller.onSelect?.()}
      className="group inline-flex items-center gap-2 transition-colors"
      style={{
        padding: "8px 12px",
        background: hover ? VANTARY.amberWash : VANTARY.glass,
        border: `1px solid ${hover ? VANTARY.amberHalo : VANTARY.rule}`,
        borderRadius: 4,
      }}
    >
      <span
        className="font-mono uppercase tabular-nums"
        style={{
          fontSize: 9,
          letterSpacing: "0.22em",
          color: hover ? VANTARY.amber : VANTARY.ashSoft,
        }}
      >
        {driller.routeId}
      </span>
      <span
        className="font-sans text-left"
        style={{
          fontSize: 12.5,
          color: hover ? VANTARY.amber : VANTARY.paper,
          fontWeight: 500,
          letterSpacing: "-0.005em",
        }}
      >
        {driller.label}
      </span>
      <ArrowRight
        size={12}
        strokeWidth={1.5}
        color={hover ? VANTARY.amber : VANTARY.ashSoft}
        style={{
          transform: hover ? "translateX(2px)" : "translateX(0)",
          transition: `transform 180ms ${EASE_V}`,
        }}
      />
    </button>
  )
}

/* ── Warming state · structured "coming online" preview body ────────
     Four panels arranged in a calm two-column grid:
       01 · WHAT THIS REPLACES         (legacy surface being absorbed)
       02 · ONE DECISION HERE          (the operational verb)
       03 · DATA THIS WILL CONSUME     (source chips with staging pulse)
       04 · WHERE IT LIVES IN YOUR DAY (rail-connection band)

     A "WHAT YOU CAN DO TODAY" callout sits below the grid, pointing
     at the drill-forward rail. If `details.preview` is provided, it
     paints between the grid and the callout — used by destinations
     that already have substantive staging content (e.g. mentor cards
     in Mentor Hall · Library, today's session list in Sessions).
   ───────────────────────────────────────────────────────────────── */

const RAIL_LABEL: Record<
  "prep" | "decision" | "execution" | "record" | "review",
  { code: string; copy: string }
> = {
  prep:      { code: "01 · PREP",      copy: "Lands inside your morning prep window — before the first execution decision." },
  decision:  { code: "02 · DECISION",  copy: "Sits at the moment of decision — between the chart and the order ticket." },
  execution: { code: "03 · EXECUTION", copy: "Wraps around the order itself — entry, sizing, stop, target." },
  record:    { code: "04 · RECORD",    copy: "Fires after execution — the trade gets named, tagged, and stored." },
  review:    { code: "05 · REVIEW",    copy: "Sits inside the evening ledger — what worked, what didn't, why." },
}

function WarmingState({
  details,
}: {
  details?: {
    destination: string
    replaces: string
    decision: string
    expectedSources: readonly string[]
    railConnection: "prep" | "decision" | "execution" | "record" | "review"
    preview?: React.ReactNode
  }
}) {
  /* ── Fallback: minimal calm placeholder when no details are passed.
        Kept for backwards compatibility but the registry now passes
        warmingDetails on every entry, so this branch is rarely hit. */
  if (!details) {
    return (
      <div className="px-5 pb-6">
        <FdDashedRule />
        <div
          className="mt-5 flex items-center gap-3 px-4 py-5"
          style={{
            background: VANTARY.glassDeep,
            border: `1px solid ${VANTARY.rule}`,
            borderRadius: 4,
          }}
        >
          <motion.span
            aria-hidden
            animate={{ rotate: 360 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 size={14} strokeWidth={1.5} color={VANTARY.amber} />
          </motion.span>
          <div className="flex-1">
            <div
              className="font-mono uppercase mb-1"
              style={{ fontSize: 10, letterSpacing: "0.22em", color: VANTARY.amber }}
            >
              COMING ONLINE
            </div>
            <div
              className="font-sans"
              style={{ fontSize: 13, lineHeight: 1.55, color: VANTARY.ash, textWrap: "pretty" }}
            >
              This destination is wired into the cockpit. Its render plan is
              still warming — navigation, shortcuts, and the drill-forward
              rail are live; the in-template telemetry lands in the next
              milestone.
            </div>
          </div>
        </div>
      </div>
    )
  }

  const rail = RAIL_LABEL[details.railConnection]

  return (
    <div className="px-5 pb-6">
      <FdDashedRule />

      {/* ── Section header — STAGING badge, mono ──────────────────── */}
      <div className="flex items-center gap-3 mt-5 mb-4">
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.24em",
            color: VANTARY.amber,
            fontWeight: 600,
          }}
        >
          STAGING · {details.destination.toUpperCase()}
        </span>
        <FdDashedRule className="flex-1" />
        <span className="inline-flex items-center gap-1.5">
          <motion.span
            aria-hidden
            className="rounded-full"
            style={{
              width: 5, height: 5,
              background: VANTARY.amber,
              boxShadow: `0 0 6px ${VANTARY.amberHalo}`,
            }}
            animate={{ opacity: [0.45, 1, 0.45], scale: [0.92, 1.06, 0.92] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <span
            className="font-mono uppercase"
            style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
          >
            COMING ONLINE
          </span>
        </span>
      </div>

      {/* ── Four-panel grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <PreviewPanel
          eyebrow="01 · WHAT THIS REPLACES"
          headline={details.replaces}
          body="The legacy surface stays usable until this destination ships. Pin it now to keep it queued for one-click access on launch."
        />
        <PreviewPanel
          eyebrow="02 · ONE DECISION HERE"
          headline={details.decision}
          body="The destination is built around this single operational question. Drill-forward chips below queue follow-ups for the moment it goes live."
        />
        <PreviewPanel
          eyebrow="03 · DATA THIS WILL CONSUME"
          headline={`${details.expectedSources.length} source${details.expectedSources.length === 1 ? "" : "s"} staged`}
          body={
            <div className="flex flex-wrap gap-2 mt-2">
              {details.expectedSources.map((s) => (
                <SourceChip key={s} label={s} />
              ))}
            </div>
          }
        />
        <PreviewPanel
          eyebrow={`04 · ${rail.code}`}
          headline="Where this lives in your day"
          body={rail.copy}
        />
      </div>

      {/* ── Optional rich preview slot ─────────────────────────────── */}
      {details.preview && (
        <div className="mt-4">
          <FdDashedRule />
          <div className="mt-4">{details.preview}</div>
        </div>
      )}

      {/* ── What you can do today callout ──────────────────────────── */}
      <div
        className="mt-4 px-4 py-3 flex items-start gap-3"
        style={{
          background: `linear-gradient(180deg, ${VANTARY.amberWash} 0%, transparent 100%)`,
          border: `1px solid ${VANTARY.amberHalo}`,
          borderRadius: 4,
        }}
      >
        <span
          aria-hidden
          className="rounded-full shrink-0 mt-1"
          style={{
            width: 5, height: 5,
            background: VANTARY.amber,
            boxShadow: `0 0 6px ${VANTARY.amberHalo}`,
          }}
        />
        <div>
          <div
            className="font-mono uppercase"
            style={{
              fontSize: 9,
              letterSpacing: "0.22em",
              color: VANTARY.amber,
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            WHAT YOU CAN DO TODAY
          </div>
          <div
            className="font-sans"
            style={{
              fontSize: 13,
              lineHeight: 1.55,
              color: VANTARY.ash,
              textWrap: "pretty",
            }}
          >
            Use the drill-forward rail below to queue the actions you want
            this destination to handle when it goes live. Anything you queue
            here lands on the surface the moment its first feed reports in.
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Preview panel — one of four cells in the warming grid ──────── */

function PreviewPanel({
  eyebrow,
  headline,
  body,
}: {
  eyebrow: string
  headline: string
  body: React.ReactNode
}) {
  return (
    <div
      className="relative px-4 py-4"
      style={{
        background: VANTARY.glassDeep,
        border: `1px solid ${VANTARY.rule}`,
        borderRadius: 4,
      }}
    >
      <FdCorners size={8} thickness={1} inset={4} color={VANTARY.amberHalo} />
      <div
        className="font-mono uppercase mb-2"
        style={{
          fontSize: 9,
          letterSpacing: "0.24em",
          color: VANTARY.amber,
          fontWeight: 600,
        }}
      >
        {eyebrow}
      </div>
      <div
        className="font-sans mb-1.5"
        style={{
          fontSize: 14,
          lineHeight: 1.4,
          fontWeight: 500,
          color: VANTARY.paper,
          letterSpacing: "-0.01em",
          textWrap: "pretty",
        }}
      >
        {headline}
      </div>
      <div
        className="font-sans"
        style={{
          fontSize: 12.5,
          lineHeight: 1.55,
          color: VANTARY.ashSoft,
          textWrap: "pretty",
        }}
      >
        {body}
      </div>
    </div>
  )
}

/* ── Source chip — staging-status data feed ───────────────────────── */

function SourceChip({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono uppercase tabular-nums"
      style={{
        fontSize: 9.5,
        letterSpacing: "0.18em",
        color: VANTARY.ashSoft,
        padding: "3px 8px",
        border: `1px solid ${VANTARY.rule}`,
        borderRadius: 999,
        background: VANTARY.glassDeep,
      }}
    >
      <motion.span
        aria-hidden
        className="rounded-full"
        style={{
          width: 4, height: 4,
          background: VANTARY.amber,
          boxShadow: `0 0 4px ${VANTARY.amberHalo}`,
        }}
        animate={{ opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      {label}
    </span>
  )
}
