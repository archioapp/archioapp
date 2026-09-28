"use client"

/* ════════════════════════════════════════════════════════════════════════
 *  JARVIS · SURFACE 5 · QUIET LAYER
 *  ─────────────────────────────────────────────────────────────────────
 *  The card's "I am alive" signal. Sits in the bottom-right of every
 *  Jarvis-grade card as a single editorial line:
 *
 *      LAST UPDATE 12s  ●
 *      └ mono-caps ─┘   └ pulsing 3px amber dot
 *
 *  At rest, the dot pulses on a 2000ms heartbeat cadence (JARVIS_CADENCE
 *  .heartbeat). On hover, the line expands to reveal the connection
 *  triplet:
 *
 *      STREAM · 13ms · NY4    LAST UPDATE 12s  ●
 *
 *  This is the same "card has a heartbeat" affordance you find at the
 *  edge of professional trading software — Bloomberg's tiny "DELAYED"
 *  pill, TradingView's "connection status" gem, IBKR TWS's blinking
 *  green light. Done editorially: typography + a single dot.
 *
 *  THE DOCTRINE
 *    · Tiny, always present, never noisy.
 *    · The dot is the only animated element. Everything else is type.
 *    · The dot's pulse is a single CSS keyframe driven by an inline
 *      <style> tag scoped via a unique attribute selector — no global
 *      keyframe pollution, no framer-motion overhead for a 4px circle.
 *    · The hover-revealed connection triplet is informational only.
 *      It never blocks input. It never grows the card's resting height.
 *
 *  PUBLIC API
 *    · `lastUpdateLabel`  — pre-formatted age string (host computes it
 *                            from the last data tick). Examples:
 *                            "12s" / "1m 04s" / "—".
 *    · `streamLabel`      — connection-quality label rendered on hover.
 *                            Defaults to "STREAM · 13ms · NY4". The host
 *                            can override with custom triplet content.
 *    · `state`            — "live" | "stale" | "down". Drives the dot
 *                            color (amber / quiet / warnEdge) and the
 *                            pulse animation (faster when live, frozen
 *                            when down).
 * ════════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { useId, useState } from "react"

import {
  JARVIS_TONE,
  JARVIS_TX,
  JARVIS_RHYTHM,
  JARVIS_MOTION,
  JARVIS_CADENCE,
  JARVIS_WEIGHT,
  Tx,
} from "../index"

export type QuietLayerState = "live" | "stale" | "down"

export interface QuietLayerProps {
  /** Pre-formatted "age since last update" label. */
  lastUpdateLabel: string
  /** Connection triplet revealed on hover. */
  streamLabel?:    string
  /** Drives the dot color and the pulse cadence. */
  state?:          QuietLayerState
  /** Optional className passthrough — host typically provides absolute
   *  positioning to anchor the layer to the card's bottom-right. */
  className?:      string
  /** Inline style passthrough for positioning. */
  style?:          React.CSSProperties
}

export function QuietLayer({
  lastUpdateLabel,
  streamLabel = "STREAM · 13ms · NY4",
  state       = "live",
  className,
  style,
}: QuietLayerProps) {
  const [hover, setHover] = useState(false)
  /* useId() gives us a stable per-instance attribute selector so the
   * scoped pulse animation never collides with another QuietLayer on
   * the same page (e.g. one per card in a grid).
   *
   * The id MUST be lowercased because React rejects custom `data-*`
   * attributes containing uppercase characters (HTML attributes are
   * case-insensitive but the JSX→DOM bridge enforces a lowercase
   * contract). useId() returns a string like ":R1dfkqn6su6fnafej6:"
   * so we strip colons AND fold to lowercase before composing the
   * attribute name. */
  const idAttr = `data-jarvis-pulse-${useId().replace(/:/g, "").toLowerCase()}`

  const dotColor =
    state === "live"  ? JARVIS_TONE.amber    :
    state === "stale" ? JARVIS_TONE.quiet    :
                        JARVIS_TONE.warnEdge

  /* The pulse cadence is the heartbeat constant scaled by state:
   *  live  → 1.0× — calm, reassuring
   *  stale → 1.6× — slowing, indicating drift
   *  down  → 0    — frozen, indicating loss of signal */
  const pulseMs =
    state === "live"  ? JARVIS_CADENCE.heartbeat       :
    state === "stale" ? JARVIS_CADENCE.heartbeat * 1.6 :
                        0

  return (
    <div
      className={className}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role="status"
      aria-live="polite"
      aria-label={`Connection ${state}, ${lastUpdateLabel} since last update`}
      style={{
        display:        "inline-flex",
        alignItems:     "center",
        gap:            JARVIS_RHYTHM.bay,
        userSelect:     "none",
        ...style,
      }}
    >
      {/* ── Connection triplet — hover-only ───────────────────────────
       *  Width-animated reveal driven entirely by CSS so we don't pay
       *  framer-motion's render cost for a status line. */}
      <span
        style={{
          overflow:     "hidden",
          maxWidth:     hover ? 240 : 0,
          opacity:      hover ? 1 : 0,
          whiteSpace:   "nowrap",
          transition:   `max-width ${JARVIS_MOTION.silk.duration}ms cubic-bezier(${JARVIS_MOTION.silk.easeArray.join(",")}), opacity ${JARVIS_MOTION.awaken.duration}ms ease`,
        }}
      >
        <Tx size="eyebrow" tone={state === "down" ? "warnEdge" : "quiet"}>
          {streamLabel}
        </Tx>
      </span>

      {/* ── Last-update age ───────────────────────────────────────── */}
      <Tx size="eyebrow" tone="quietest">
        {`LAST UPDATE ${lastUpdateLabel}`}
      </Tx>

      {/* ── Heartbeat dot ─────────────────────────────────────────── */}
      <span
        aria-hidden
        {...{ [idAttr]: "" }}
        style={{
          width:        4,
          height:       4,
          borderRadius: "50%",
          background:   dotColor,
          opacity:      0.85,
        }}
      />

      {/* Scoped @keyframes — the only place the surface emits a style
       *  rule into the document. Targets ONLY this instance's dot via
       *  the unique data attribute generated by useId(). */}
      {pulseMs > 0 && (
        <style>{`
          [${idAttr}] {
            animation: ${idAttr}-pulse ${pulseMs}ms ease-in-out infinite;
          }
          @keyframes ${idAttr}-pulse {
            0%   { transform: scale(1);   opacity: 0.85; }
            50%  { transform: scale(1.6); opacity: 0.45; }
            100% { transform: scale(1);   opacity: 0.85; }
          }
        `}</style>
      )}
    </div>
  )
}
