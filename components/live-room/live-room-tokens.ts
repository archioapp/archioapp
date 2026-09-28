/**
 * LIVE ROOM — "Teal Glass · Obsidian Cut" tokens
 *
 * A surface + light layer on top of VANTARY / VT. Every color here is
 * routed through the Vantary theme CSS variables, so switching the theme
 * (Teal Glass / Amber / Cobalt …) recolors the whole room with no code
 * change. There are no literal accent RGB triplets in this namespace —
 * translucency is produced with `color-mix()` on the theme tokens.
 *
 * Three depths, communicated by translucency rather than darkness:
 *   veil   — the room canvas behind everything
 *   pane   — instrument panes (screen, timeline, intelligence, mentor)
 *   recess — cells inside a pane (stat wells, event cards, chips)
 */

import { VANTARY, TEAL_GLOW } from "@/components/dashboard/vantary/vantary-theme"
import { VT } from "@/components/forecast-hub/forecast-vantary-tokens"

/** Theme-aware translucency for any CSS color, including `var(--token)`. */
export const lrMix = (token: string, alpha: number) =>
  `color-mix(in oklab, ${token} ${Math.round(alpha * 100)}%, transparent)`

const WARN = "var(--vt-warn, #F59E0B)"

export const LR = {
  /* ── Surfaces ─────────────────────────────────────────────────────── */
  ink: VANTARY.ink,
  veil: {
    bg: lrMix(VANTARY.ink, 0.42),
    blur: "blur(36px) saturate(165%)",
  },
  pane: {
    bg: VANTARY.glass,
    bgDeep: VANTARY.glassDeep,
    blur: "blur(28px) saturate(150%)",
    border: VANTARY.rule,
    borderStrong: VANTARY.ruleStrong,
    radius: 20,
  },
  recess: {
    bg: VT.glassRecess,
    bgHover:
      "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.012) 100%)",
    border: VANTARY.ruleSoft,
    radius: 14,
    shadow: VT.recessShadow,
  },
  rule: VANTARY.rule,
  chipRadius: 8,
  badgeRadius: 6,
  pillRadius: 999,

  /* ── Light ────────────────────────────────────────────────────────── */
  topLight: (color: string = VANTARY.amber, a = 0.07) =>
    `radial-gradient(ellipse 80% 60% at 50% 0%, ${lrMix(color, a)}, transparent 70%)`,
  innerLight: (color: string = VANTARY.amber, a = 0.06) =>
    `radial-gradient(circle at top right, ${lrMix(color, a)}, transparent 65%)`,
  thread: (color: string = VANTARY.amber, a = 0.55) =>
    `linear-gradient(90deg, transparent 0%, ${lrMix(color, a)} 50%, transparent 100%)`,
  specular: "inset 0 1px 0 rgba(255,255,255,0.04)",
  shadow: VT.cardShadow,
  shadowHover: VT.cardShadowHover,
  glow: TEAL_GLOW,
  dashed: (color: string = VANTARY.rule) =>
    `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 8px)`,
  dashedV: (color: string = VANTARY.ruleSoft) =>
    `repeating-linear-gradient(180deg, ${color} 0 3px, transparent 3px 7px)`,

  /* ── Semantic color — five meanings, no more ──────────────────────── */
  primary: VANTARY.amber,
  primaryDeep: VANTARY.amberDeep,
  primaryInk: VANTARY.amberInk,
  primaryWash: VANTARY.amberWash,
  primaryHalo: VANTARY.amberHalo,
  up: VANTARY.chartUp,
  down: VANTARY.chartDown,
  live: VANTARY.chartDown,
  warn: WARN,
  neutral: VANTARY.chartNeutral,

  /* ── Foreground ladder ────────────────────────────────────────────── */
  paper: VANTARY.paper,
  paperDim: VANTARY.paperDim,
  ash: VANTARY.ash,
  ashSoft: VANTARY.ashSoft,
  ashGhost: VANTARY.ashGhost,

  /* ── Chips ────────────────────────────────────────────────────────── */
  chipFill: VANTARY.chipFill,
  chipFillHi: VANTARY.chipFillHi,
  chipBorder: VANTARY.chipBorder,

  /* ── Type contract (hard floors: 9 eyebrow · 11 meta · 12.5 body) ─── */
  type: {
    eyebrow: 9,
    eyebrowTracking: "0.22em",
    headerTracking: "0.24em",
    meta: 11,
    body: 12.5,
    label: 14,
    num: 12,
    display: 32,
  },

  /* ── Motion ───────────────────────────────────────────────────────── */
  ease: [0.22, 0.68, 0.36, 1] as [number, number, number, number],
  easeOut: [0.22, 1, 0.36, 1] as [number, number, number, number],
  spring: { type: "spring" as const, stiffness: 500, damping: 35 },
  enter: {
    initial: { opacity: 0, y: 10, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -6, filter: "blur(4px)" },
    duration: 0.34,
    stagger: 0.05,
  },
} as const

export type LrTone = "primary" | "up" | "down" | "warn" | "neutral"

export const toneColor = (tone: LrTone): string =>
  tone === "up" ? LR.up
  : tone === "down" ? LR.down
  : tone === "warn" ? LR.warn
  : tone === "neutral" ? LR.ashSoft
  : LR.primary
