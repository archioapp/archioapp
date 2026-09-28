"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  FLIGHT PROFILE · TAB GLYPHS
 *  ─────────────────────────────────────────────────────────────────────────
 *
 *  Four hand-crafted 18×18 SVG glyphs — one per tab in the FLIGHT PROFILE
 *  surface (formerly "Strategy OS"). Each glyph is built from primitive
 *  hairlines (1.5 stroke) using the same line-weight as the rest of the
 *  Vantary editorial system, so they read as siblings of the Flight
 *  Deck Portal HUD instrument in the dashboard header rather than as
 *  generic icon-set imports.
 *
 *  Anatomy
 *  ────────────────────────────────────────────────────────────────────
 *    MIRROR    → concentric rings with a hairline diameter.
 *                Reads as "a reflective optical surface" — the trader
 *                seeing themselves day-by-day across the week.
 *
 *    RULES     → a charter panel with three horizontal stanzas plus a
 *                pinned corner mark. Reads as "a code on parchment".
 *
 *    EXPOSURE  → a three-bar histogram on a hairline baseline, with one
 *                bar lit amber to indicate dominant currency / symbol
 *                concentration. Reads as "where the dollars went".
 *
 *    DNA       → twin sinusoidal curves with three rung connectors,
 *                forming a stylised double helix. Reads as "the pilot's
 *                inherited instincts".
 *
 *  Theming
 *  ────────────────────────────────────────────────────────────────────
 *  All four glyphs accept a `color` prop and use `currentColor` fallback,
 *  so they recolour with the surrounding tab text. The active tab pulses
 *  the glyph stroke amber via the parent's `style.color`; inactive tabs
 *  render in `paperDim`.
 *
 *  Reduced motion
 *  ────────────────────────────────────────────────────────────────────
 *  None of the glyphs animate. They're static line drawings — the
 *  motion in the tab strip is owned by the underline (layoutId) and
 *  the active background flash; the glyph itself is a stable identity
 *  marker. ─────────────────────────────────────────────────────────── */

import * as React from "react"

interface GlyphProps {
  size?: number
  /** Stroke colour. Defaults to currentColor so the glyph inherits the
   *  surrounding text colour (which we already animate via the tab). */
  color?: string
  /** Optional secondary accent. Defaults to color. Used for the lit
   *  bar in EXPOSURE and the amber ring in MIRROR's centre dot. */
  accent?: string
  className?: string
  /** Stroke width. Defaults to 1.5 to match Vantary hairline weight. */
  strokeWidth?: number
}

/* ════════════════════════════════════════════════════════════════════
 *  MIRROR · concentric reflective surface
 *  ───────────────────────────────────────────────────────────────────
 *  Anatomy:
 *    · Outer ring          (full circle, hairline, r=8)
 *    · Inner ring          (full circle, hairline, r=4.5)
 *    · Diameter            (single horizontal hairline through centre)
 *    · Centre dot          (filled, accent colour, r=1.4)
 *
 *  The diameter line + centre dot together read as "a horizon split"
 *  which is the visual metaphor of the Discipline Mirror — INTENDED
 *  vs ACTUAL across the week. ─────────────────────────────────────── */
export function MirrorGlyph({
  size = 18,
  color = "currentColor",
  accent,
  className,
  strokeWidth = 1.5,
}: GlyphProps) {
  const acc = accent ?? color
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* outer ring */}
      <circle cx="9" cy="9" r="7.5" />
      {/* inner ring */}
      <circle cx="9" cy="9" r="4" opacity={0.7} />
      {/* horizon diameter */}
      <line x1="1" y1="9" x2="17" y2="9" opacity={0.5} />
      {/* centre dot — filled accent so it pops against both rings */}
      <circle cx="9" cy="9" r="1.1" fill={acc} stroke="none" />
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════════════
 *  RULES · charter / code panel
 *  ───────────────────────────────────────────────────────────────────
 *  Anatomy:
 *    · Outer panel rectangle (rounded corners, hairline)
 *    · Three horizontal stanza lines inside (decreasing opacity to
 *      suggest "a written list, getting fainter as it descends")
 *    · A single accent dot on the top-right corner — the "seal" /
 *      compliance marker.
 *
 *  Reads as a parchment of commitments. ─────────────────────────────── */
export function RulesGlyph({
  size = 18,
  color = "currentColor",
  accent,
  className,
  strokeWidth = 1.5,
}: GlyphProps) {
  const acc = accent ?? color
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* charter panel */}
      <rect x="2.5" y="3" width="13" height="12" rx="1.5" />
      {/* three stanza lines */}
      <line x1="5"  y1="6.5"  x2="11" y2="6.5"  opacity={0.95} />
      <line x1="5"  y1="9"    x2="13" y2="9"    opacity={0.7}  />
      <line x1="5"  y1="11.5" x2="10" y2="11.5" opacity={0.5}  />
      {/* compliance seal dot */}
      <circle cx="14" cy="4.5" r="1.2" fill={acc} stroke="none" />
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════════════
 *  EXPOSURE · capital concentration histogram
 *  ───────────────────────────────────────────────────────────────────
 *  Anatomy:
 *    · Hairline baseline at y=14
 *    · Three vertical bars of varying heights (5, 9, 7 → reads as
 *      asymmetric concentration)
 *    · The TALLEST bar (centre) is filled accent — it's the dominant
 *      symbol / currency, the "where most of the dollars are" signal.
 *
 *  Reads as a tiny exposure-by-strata bar chart. ─────────────────────── */
export function ExposureGlyph({
  size = 18,
  color = "currentColor",
  accent,
  className,
  strokeWidth = 1.5,
}: GlyphProps) {
  const acc = accent ?? color
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* hairline baseline */}
      <line x1="2" y1="14" x2="16" y2="14" />
      {/* left bar — short, hollow */}
      <rect x="3.5"  y="9.5" width="2.4" height="4" />
      {/* centre bar — tallest, FILLED accent (dominant exposure) */}
      <rect x="7.8"  y="5.5" width="2.4" height="8" fill={acc} stroke={acc} />
      {/* right bar — medium, hollow */}
      <rect x="12.1" y="7.5" width="2.4" height="6" />
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════════════
 *  DNA · twin helix with rungs
 *  ───────────────────────────────────────────────────────────────────
 *  Anatomy:
 *    · Two cubic-bezier sinusoidal curves running top-to-bottom,
 *      mirrored across the vertical centre line so they cross each
 *      other twice.
 *    · Three short horizontal rung-connectors at the crossings.
 *    · A small accent dot at the top of one strand to suggest "the
 *      reading head" / current position in the helix.
 *
 *  Reads as a stylised double helix — the trader's execution
 *  instincts encoded as inherited pattern. ──────────────────────────── */
export function DnaGlyph({
  size = 18,
  color = "currentColor",
  accent,
  className,
  strokeWidth = 1.5,
}: GlyphProps) {
  const acc = accent ?? color
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* left strand — sinusoid bowing right at midpoint */}
      <path d="M 5 2 C 14 6, 4 12, 13 16" opacity={0.95} />
      {/* right strand — mirror sinusoid bowing left at midpoint */}
      <path d="M 13 2 C 4 6, 14 12, 5 16" opacity={0.85} />
      {/* three rung crossings */}
      <line x1="6.5" y1="5" x2="11.5" y2="5"  opacity={0.55} />
      <line x1="5.5" y1="9" x2="12.5" y2="9"  opacity={0.7}  />
      <line x1="6.5" y1="13" x2="11.5" y2="13" opacity={0.55} />
      {/* reading-head accent */}
      <circle cx="5" cy="2" r="1.2" fill={acc} stroke="none" />
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════════════
 *  PUBLIC SURFACE · single dispatcher
 *  ───────────────────────────────────────────────────────────────────
 *  Pass `kind` and the right glyph renders. Useful for the TabStrip
 *  loop where we map over all four tab keys. ──────────────────────── */
export type FlightProfileGlyphKind = "mirror" | "rules" | "exposure" | "dna"

export function FlightProfileGlyph({
  kind,
  ...rest
}: GlyphProps & { kind: FlightProfileGlyphKind }) {
  switch (kind) {
    case "mirror":   return <MirrorGlyph   {...rest} />
    case "rules":    return <RulesGlyph    {...rest} />
    case "exposure": return <ExposureGlyph {...rest} />
    case "dna":      return <DnaGlyph      {...rest} />
  }
}
