/* ────────────────────────────────────────────────────────────────────────
   COMMUNITIES MONO ICON PACK
   Vantary Universal Template Engine · Phase 2

   The legacy DiscoveryEngine.tsx drew every dimension as a fully filled
   multi-color SVG (red REC dots, amber/green dashboard lights, two-tone
   compass needles, lightning-bolt fills, gem facets, etc.).  None of
   that survives Vantary's calm mono doctrine.

   Every icon below is redrawn single-stroke in amber at three
   intensities — idle 0.32, hover 0.7, active 1.0 — driven by the
   `intensity` prop.  Strokes are 1.4 px, fills are never used.
   The viewBox is always 0 0 32 32 so glyphs sit cleanly inside the
   28 px orbit nodes.

   No "currentColor" — colour is read from VANTARY.amber via the prop
   so a future theme switch propagates automatically.

   Coverage: all 21 community dimensions plus a few utility glyphs
   (verified-tick, live-pulse, member-glyph, growth-chip, search,
   compass-x).
   ──────────────────────────────────────────────────────────────────── */

import { VANTARY } from "../vantary-theme"

/* ────────────────────────────────────────────────────────────────────
   Shared types
   ──────────────────────────────────────────────────────────────────── */

export type IconIntensity = "idle" | "hover" | "active"

export interface MonoIconProps {
  /** Display size (px). Default 22. */
  readonly size?: number
  /** Visual intensity. Default "idle". */
  readonly intensity?: IconIntensity
  /** Optional override stroke color. Defaults to VANTARY.amber. */
  readonly color?: string
  /** Optional aria-label for accessibility (icons are decorative by
   *  default — the orbit node renders a separate text label). */
  readonly ariaLabel?: string
}

/* Intensity → stroke opacity. */
function opacityFor(intensity: IconIntensity): number {
  switch (intensity) {
    case "active":
      return 1
    case "hover":
      return 0.7
    case "idle":
    default:
      return 0.32
  }
}

/* Common SVG props builder. */
function svgProps(size: number, ariaLabel?: string) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 32 32",
    fill: "none" as const,
    role: ariaLabel ? "img" : "presentation",
    "aria-label": ariaLabel,
    "aria-hidden": ariaLabel ? undefined : true,
    focusable: false,
  }
}

/* ────────────────────────────────────────────────────────────────────
   Ring 0 · Platform Intelligence
   ──────────────────────────────────────────────────────────────────── */

export function IconAiModels({
  size = 22,
  intensity = "idle",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      {/* neural triangle */}
      <circle cx="16" cy="9" r="3" stroke={color} strokeWidth="1.4" opacity={op} />
      <circle cx="9" cy="20" r="2.5" stroke={color} strokeWidth="1.4" opacity={op} />
      <circle cx="23" cy="20" r="2.5" stroke={color} strokeWidth="1.4" opacity={op} />
      <line x1="16" y1="12" x2="9.5" y2="18" stroke={color} strokeWidth="1.2" opacity={op * 0.7} />
      <line x1="16" y1="12" x2="22.5" y2="18" stroke={color} strokeWidth="1.2" opacity={op * 0.7} />
      <line x1="11" y1="20" x2="21" y2="20" stroke={color} strokeWidth="1.2" opacity={op * 0.7} />
      {/* halo */}
      <circle cx="16" cy="9" r="6" stroke={color} strokeWidth="0.7" opacity={op * 0.25} strokeDasharray="2 3" />
    </svg>
  )
}

export function IconLiveCalls({
  size = 22,
  intensity = "idle",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      {/* tower */}
      <line x1="16" y1="26" x2="16" y2="14" stroke={color} strokeWidth="1.4" opacity={op} />
      <line x1="12" y1="26" x2="16" y2="16" stroke={color} strokeWidth="1.2" opacity={op * 0.7} />
      <line x1="20" y1="26" x2="16" y2="16" stroke={color} strokeWidth="1.2" opacity={op * 0.7} />
      <circle cx="16" cy="12" r="1.6" stroke={color} strokeWidth="1.4" opacity={op} />
      {/* signal */}
      <path d="M11 9 C11 5 21 5 21 9" stroke={color} strokeWidth="1.2" opacity={op * 0.6} />
      <path d="M8 7 C8 1 24 1 24 7" stroke={color} strokeWidth="1" opacity={op * 0.4} />
    </svg>
  )
}

export function IconDashboard({
  size = 22,
  intensity = "idle",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      {/* frame */}
      <rect x="5" y="6" width="22" height="20" rx="2" stroke={color} strokeWidth="1.4" opacity={op} />
      <line x1="5" y1="11" x2="27" y2="11" stroke={color} strokeWidth="1" opacity={op * 0.5} />
      {/* dots */}
      <circle cx="8" cy="8.5" r="0.9" stroke={color} strokeWidth="1" opacity={op * 0.6} />
      <circle cx="11" cy="8.5" r="0.9" stroke={color} strokeWidth="1" opacity={op * 0.6} />
      <circle cx="14" cy="8.5" r="0.9" stroke={color} strokeWidth="1" opacity={op * 0.6} />
      {/* bars */}
      <line x1="9" y1="22" x2="9" y2="17" stroke={color} strokeWidth="1.4" opacity={op * 0.85} />
      <line x1="13" y1="22" x2="13" y2="14" stroke={color} strokeWidth="1.4" opacity={op} />
      <line x1="17" y1="22" x2="17" y2="16" stroke={color} strokeWidth="1.4" opacity={op * 0.9} />
      <line x1="21" y1="22" x2="21" y2="13" stroke={color} strokeWidth="1.4" opacity={op} />
      <line x1="25" y1="22" x2="25" y2="18" stroke={color} strokeWidth="1.4" opacity={op * 0.85} />
    </svg>
  )
}

export function IconVerified({
  size = 22,
  intensity = "idle",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      {/* shield */}
      <path
        d="M16 4 L26 8 L26 17 C26 22 21 27 16 28 C11 27 6 22 6 17 L6 8 Z"
        stroke={color}
        strokeWidth="1.4"
        opacity={op}
        strokeLinejoin="round"
      />
      {/* check */}
      <polyline
        points="11,16 14.5,19.5 21,13"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={op}
      />
    </svg>
  )
}

/* ────────────────────────────────────────────────────────────────────
   Ring 1 · Support Structure
   ──────────────────────────────────────────────────────────────────── */

export function IconMentorAccess({
  size = 22,
  intensity = "idle",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      {/* compass */}
      <circle cx="16" cy="16" r="11" stroke={color} strokeWidth="1.4" opacity={op} />
      <circle cx="16" cy="16" r="7.5" stroke={color} strokeWidth="0.8" strokeDasharray="2 3" opacity={op * 0.5} />
      {/* needle */}
      <polygon points="16,7 18,16 16,18 14,16" stroke={color} strokeWidth="1.2" opacity={op} fill="none" />
      <polygon points="16,25 14,16 16,14 18,16" stroke={color} strokeWidth="1.2" opacity={op * 0.6} fill="none" />
      <circle cx="16" cy="16" r="1" stroke={color} strokeWidth="1" opacity={op} />
    </svg>
  )
}

export function IconBeginnerSafe({
  size = 22,
  intensity = "idle",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      {/* stem */}
      <line x1="16" y1="26" x2="16" y2="16" stroke={color} strokeWidth="1.4" opacity={op} />
      {/* leaves */}
      <path d="M16 16 C13 12 8 11 8 14 C8 17 16 16 16 16" stroke={color} strokeWidth="1.4" opacity={op} fill="none" />
      <path d="M16 14 C19 10 24 9 24 12 C24 15 16 14 16 14" stroke={color} strokeWidth="1.2" opacity={op * 0.75} fill="none" />
      {/* ground */}
      <line x1="9" y1="26" x2="23" y2="26" stroke={color} strokeWidth="1" opacity={op * 0.5} />
    </svg>
  )
}

export function IconAccountability({
  size = 22,
  intensity = "idle",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      {/* target */}
      <circle cx="16" cy="16" r="11" stroke={color} strokeWidth="1.2" opacity={op * 0.5} />
      <circle cx="16" cy="16" r="7" stroke={color} strokeWidth="1.2" opacity={op * 0.7} />
      <circle cx="16" cy="16" r="3" stroke={color} strokeWidth="1.4" opacity={op} />
      <circle cx="16" cy="16" r="1" stroke={color} strokeWidth="1" opacity={op} />
      {/* crosshair */}
      <line x1="16" y1="3" x2="16" y2="9" stroke={color} strokeWidth="1" opacity={op * 0.6} />
      <line x1="16" y1="23" x2="16" y2="29" stroke={color} strokeWidth="1" opacity={op * 0.6} />
      <line x1="3" y1="16" x2="9" y2="16" stroke={color} strokeWidth="1" opacity={op * 0.6} />
      <line x1="23" y1="16" x2="29" y2="16" stroke={color} strokeWidth="1" opacity={op * 0.6} />
    </svg>
  )
}

export function IconPeerEnergy({
  size = 22,
  intensity = "idle",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      {/* lightning outline */}
      <polygon
        points="18,4 11,15 16,15 13,28 22,13 17,13"
        stroke={color}
        strokeWidth="1.4"
        opacity={op}
        fill="none"
        strokeLinejoin="round"
      />
      {/* radiating */}
      <line x1="6" y1="16" x2="9" y2="16" stroke={color} strokeWidth="1" opacity={op * 0.5} />
      <line x1="23" y1="16" x2="26" y2="16" stroke={color} strokeWidth="1" opacity={op * 0.5} />
    </svg>
  )
}

export function IconSmallTribe({
  size = 22,
  intensity = "idle",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      {/* diamond */}
      <polygon points="16,5 27,15 16,28 5,15" stroke={color} strokeWidth="1.4" opacity={op} fill="none" />
      <line x1="5" y1="15" x2="27" y2="15" stroke={color} strokeWidth="1" opacity={op * 0.6} />
      <line x1="11" y1="15" x2="16" y2="5" stroke={color} strokeWidth="1" opacity={op * 0.5} />
      <line x1="21" y1="15" x2="16" y2="5" stroke={color} strokeWidth="1" opacity={op * 0.5} />
      <line x1="11" y1="15" x2="16" y2="28" stroke={color} strokeWidth="1" opacity={op * 0.5} />
      <line x1="21" y1="15" x2="16" y2="28" stroke={color} strokeWidth="1" opacity={op * 0.5} />
    </svg>
  )
}

export function IconTradingPsychology({
  size = 22,
  intensity = "idle",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      {/* head */}
      <path
        d="M11 21 C11 17 8 14 11 10 C13 7 19 7 21 10 C24 14 21 17 21 21 L13 21 Z"
        stroke={color}
        strokeWidth="1.4"
        opacity={op}
        fill="none"
        strokeLinejoin="round"
      />
      <line x1="13" y1="24" x2="19" y2="24" stroke={color} strokeWidth="1" opacity={op * 0.6} />
      <line x1="14" y1="27" x2="18" y2="27" stroke={color} strokeWidth="1" opacity={op * 0.5} />
      {/* gear */}
      <circle cx="16" cy="14" r="2" stroke={color} strokeWidth="1" opacity={op} />
    </svg>
  )
}

/* ────────────────────────────────────────────────────────────────────
   Ring 2 · Market & Style
   ──────────────────────────────────────────────────────────────────── */

export function IconScalping({
  size = 22,
  intensity = "idle",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      {/* stopwatch */}
      <circle cx="16" cy="18" r="9" stroke={color} strokeWidth="1.4" opacity={op} />
      <line x1="16" y1="18" x2="16" y2="11" stroke={color} strokeWidth="1.4" opacity={op} strokeLinecap="round" />
      <line x1="16" y1="18" x2="22" y2="18" stroke={color} strokeWidth="1.2" opacity={op * 0.7} strokeLinecap="round" />
      <rect x="14" y="4" width="4" height="3" rx="1" stroke={color} strokeWidth="1" opacity={op * 0.6} />
      <line x1="16" y1="4" x2="16" y2="2" stroke={color} strokeWidth="1" opacity={op * 0.5} />
    </svg>
  )
}

export function IconDayTrading({
  size = 22,
  intensity = "idle",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      {/* sun */}
      <circle cx="16" cy="13" r="5" stroke={color} strokeWidth="1.4" opacity={op} />
      {/* rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const r = (deg * Math.PI) / 180
        return (
          <line
            key={deg}
            x1={16 + Math.cos(r) * 7}
            y1={13 + Math.sin(r) * 7}
            x2={16 + Math.cos(r) * 9}
            y2={13 + Math.sin(r) * 9}
            stroke={color}
            strokeWidth="1"
            opacity={op * 0.55}
            strokeLinecap="round"
          />
        )
      })}
      {/* chart */}
      <polyline
        points="5,26 11,22 15,24 19,20 23,23 27,19"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
        opacity={op * 0.7}
      />
    </svg>
  )
}

export function IconSwing({
  size = 22,
  intensity = "idle",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      {/* sine */}
      <path
        d="M3 16 C7 8 13 8 16 16 C19 24 25 24 29 16"
        stroke={color}
        strokeWidth="1.4"
        opacity={op}
        fill="none"
      />
      <circle cx="11" cy="10" r="1.4" stroke={color} strokeWidth="1.2" opacity={op} />
      <circle cx="21" cy="22" r="1.4" stroke={color} strokeWidth="1.2" opacity={op} />
    </svg>
  )
}

export function IconForex({
  size = 22,
  intensity = "idle",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      <circle cx="16" cy="16" r="11" stroke={color} strokeWidth="1.2" opacity={op * 0.5} />
      {/* exchange arrows */}
      <path d="M11 19 L21 9" stroke={color} strokeWidth="1.4" opacity={op} />
      <polyline points="17,9 21,9 21,13" stroke={color} strokeWidth="1.4" fill="none" opacity={op} />
      <polyline points="15,23 11,23 11,19" stroke={color} strokeWidth="1.4" fill="none" opacity={op} />
      <path d="M11 23 L21 13" stroke={color} strokeWidth="0" opacity={0} />
    </svg>
  )
}

export function IconCrypto({
  size = 22,
  intensity = "idle",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      {/* chain links */}
      <rect x="4" y="11" width="11" height="10" rx="5" stroke={color} strokeWidth="1.4" opacity={op} />
      <rect x="17" y="11" width="11" height="10" rx="5" stroke={color} strokeWidth="1.4" opacity={op} />
      <line x1="13" y1="14" x2="19" y2="14" stroke={color} strokeWidth="1.2" opacity={op * 0.55} />
      <line x1="13" y1="18" x2="19" y2="18" stroke={color} strokeWidth="1.2" opacity={op * 0.55} />
    </svg>
  )
}

export function IconStocks({
  size = 22,
  intensity = "idle",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      {/* candles */}
      <line x1="7" y1="6" x2="7" y2="26" stroke={color} strokeWidth="1" opacity={op * 0.6} />
      <rect x="5" y="11" width="4" height="9" stroke={color} strokeWidth="1.2" opacity={op} />
      <line x1="14" y1="4" x2="14" y2="26" stroke={color} strokeWidth="1" opacity={op * 0.6} />
      <rect x="12" y="9" width="4" height="13" stroke={color} strokeWidth="1.2" opacity={op} />
      <line x1="21" y1="8" x2="21" y2="28" stroke={color} strokeWidth="1" opacity={op * 0.6} />
      <rect x="19" y="13" width="4" height="11" stroke={color} strokeWidth="1.2" opacity={op} />
      <line x1="27" y1="10" x2="27" y2="24" stroke={color} strokeWidth="1" opacity={op * 0.6} />
      <rect x="25" y="14" width="4" height="6" stroke={color} strokeWidth="1.2" opacity={op} />
    </svg>
  )
}

export function IconLondon({
  size = 22,
  intensity = "idle",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      {/* tower */}
      <rect x="12" y="9" width="8" height="19" stroke={color} strokeWidth="1.4" opacity={op} />
      <rect x="13" y="6" width="6" height="3" stroke={color} strokeWidth="1" opacity={op * 0.6} />
      <line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="1.2" opacity={op * 0.7} />
      {/* clock */}
      <circle cx="16" cy="16" r="3" stroke={color} strokeWidth="1.2" opacity={op} />
      <line x1="16" y1="16" x2="16" y2="14" stroke={color} strokeWidth="1.2" opacity={op} strokeLinecap="round" />
      <line x1="16" y1="16" x2="18" y2="16" stroke={color} strokeWidth="1" opacity={op * 0.7} strokeLinecap="round" />
    </svg>
  )
}

export function IconRiskMgmt({
  size = 22,
  intensity = "idle",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      {/* shield */}
      <path
        d="M16 4 L26 8 L26 17 C26 22 21 26 16 28 C11 26 6 22 6 17 L6 8 Z"
        stroke={color}
        strokeWidth="1.4"
        opacity={op}
        fill="none"
        strokeLinejoin="round"
      />
      {/* exclamation */}
      <line x1="16" y1="11" x2="16" y2="18" stroke={color} strokeWidth="1.6" opacity={op} strokeLinecap="round" />
      <line x1="16" y1="21" x2="16" y2="22" stroke={color} strokeWidth="1.8" opacity={op} strokeLinecap="round" />
    </svg>
  )
}

export function IconSignals({
  size = 22,
  intensity = "idle",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      {/* concentric arcs */}
      <circle cx="16" cy="20" r="2" stroke={color} strokeWidth="1.4" opacity={op} />
      <path d="M10 18 C10 13 22 13 22 18" stroke={color} strokeWidth="1.2" opacity={op * 0.7} fill="none" />
      <path d="M7 18 C7 9 25 9 25 18" stroke={color} strokeWidth="1" opacity={op * 0.5} fill="none" />
      <path d="M4 18 C4 5 28 5 28 18" stroke={color} strokeWidth="0.8" opacity={op * 0.35} fill="none" />
    </svg>
  )
}

export function IconPropFirm({
  size = 22,
  intensity = "idle",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      {/* coin stack */}
      <ellipse cx="16" cy="9" rx="9" ry="3" stroke={color} strokeWidth="1.4" opacity={op} />
      <path d="M7 9 L7 15 C7 17 11 18 16 18 C21 18 25 17 25 15 L25 9" stroke={color} strokeWidth="1.4" opacity={op} fill="none" />
      <path d="M7 15 L7 21 C7 23 11 24 16 24 C21 24 25 23 25 21 L25 15" stroke={color} strokeWidth="1.4" opacity={op * 0.7} fill="none" />
      <path d="M7 21 L7 26 C7 28 11 29 16 29 C21 29 25 28 25 26 L25 21" stroke={color} strokeWidth="1.4" opacity={op * 0.45} fill="none" />
    </svg>
  )
}

export function IconResearch({
  size = 22,
  intensity = "idle",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      <circle cx="13" cy="13" r="8" stroke={color} strokeWidth="1.4" opacity={op} />
      <line x1="19" y1="19" x2="27" y2="27" stroke={color} strokeWidth="1.6" opacity={op} strokeLinecap="round" />
      <polyline points="9,15 12,11 15,14 18,9" stroke={color} strokeWidth="1.2" fill="none" opacity={op * 0.7} />
    </svg>
  )
}

/* ────────────────────────────────────────────────────────────────────
   Utility glyphs — used across cards & chips.
   ──────────────────────────────────────────────────────────────────── */

export function IconLivePulse({
  size = 14,
  intensity = "active",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      <circle cx="16" cy="16" r="3" stroke={color} strokeWidth="1.6" opacity={op} />
      <circle cx="16" cy="16" r="7" stroke={color} strokeWidth="1" opacity={op * 0.5} />
      <circle cx="16" cy="16" r="11" stroke={color} strokeWidth="0.8" opacity={op * 0.25} />
    </svg>
  )
}

export function IconMember({
  size = 14,
  intensity = "active",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      <circle cx="16" cy="11" r="4" stroke={color} strokeWidth="1.6" opacity={op} />
      <path d="M6 26 C6 20 12 17 16 17 C20 17 26 20 26 26" stroke={color} strokeWidth="1.6" opacity={op} fill="none" />
    </svg>
  )
}

export function IconGrowth({
  size = 14,
  intensity = "active",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      <polyline points="5,22 12,15 17,19 27,8" stroke={color} strokeWidth="1.6" fill="none" opacity={op} />
      <polyline points="22,8 27,8 27,13" stroke={color} strokeWidth="1.4" fill="none" opacity={op} />
    </svg>
  )
}

export function IconCheckTick({
  size = 12,
  intensity = "active",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      <polyline
        points="6,16 13,22 24,9"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={op}
      />
    </svg>
  )
}

export function IconClose({
  size = 12,
  intensity = "active",
  color = VANTARY.amber,
  ariaLabel,
}: MonoIconProps) {
  const op = opacityFor(intensity)
  return (
    <svg {...svgProps(size, ariaLabel)}>
      <line x1="9" y1="9" x2="23" y2="23" stroke={color} strokeWidth="1.6" opacity={op} strokeLinecap="round" />
      <line x1="23" y1="9" x2="9" y2="23" stroke={color} strokeWidth="1.6" opacity={op} strokeLinecap="round" />
    </svg>
  )
}

/* ────────────────────────────────────────────────────────────────────
   DIMENSION → ICON RESOLVER
   Maps every CommunityDimension.id to its mono icon component.
   ──────────────────────────────────────────────────────────────────── */

const DIM_TO_ICON: Readonly<
  Record<string, React.ComponentType<MonoIconProps>>
> = {
  /* Ring 0 */
  "ai-models": IconAiModels,
  "live-calls": IconLiveCalls,
  "mentor-dashboard": IconDashboard,
  verified: IconVerified,

  /* Ring 1 */
  "direct-mentor": IconMentorAccess,
  "beginner-safe": IconBeginnerSafe,
  accountability: IconAccountability,
  "peer-energy": IconPeerEnergy,
  "small-tribe": IconSmallTribe,
  "trading-psychology": IconTradingPsychology,

  /* Ring 2 */
  scalping: IconScalping,
  "day-trading": IconDayTrading,
  swing: IconSwing,
  forex: IconForex,
  crypto: IconCrypto,
  stocks: IconStocks,
  "london-session": IconLondon,
  "risk-management": IconRiskMgmt,
  "signal-service": IconSignals,
  "prop-firm": IconPropFirm,
  "research-analysis": IconResearch,
}

export function getDimensionIcon(
  id: string,
): React.ComponentType<MonoIconProps> {
  return DIM_TO_ICON[id] ?? IconAiModels
}
