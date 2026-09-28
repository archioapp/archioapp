/**
 * Forecast Room — design tokens
 *
 * THEME-AWARE: every value is routed through the global Vantary theme
 * (`components/dashboard/vantary/vantary-theme.ts`), which writes CSS
 * custom properties onto :root via <VantaryThemeProvider/>. That means
 * a theme switch (Teal Glass / Amber / Cobalt / etc.) propagates to the
 * entire forecast room with zero per-component refactor.
 *
 * Backward-compatible export names (`VT`, `amber()`, `slate()`) are
 * preserved so the rest of the forecast-hub doesn't need to change.
 */

import { VANTARY } from "@/components/dashboard/vantary/vantary-theme"

/**
 * `color-mix` helper — takes any CSS color (including `var(--token)`)
 * and produces a translucent variant. Lets us keep `amber(0.5)` calls
 * working while staying fully theme-routed.
 */
const mix = (token: string, alpha: number) =>
  `color-mix(in oklab, ${token} ${Math.round(alpha * 100)}%, transparent)`

export const VT = {
  // ─── SURFACES (theme-routed glass) ───────────────────────────────────
  ink: VANTARY.ink,
  inkSoft: VANTARY.ink2,
  glass: VANTARY.glass,
  glassStrong: VANTARY.glassStrong,
  glassDeep: VANTARY.glassDeep,
  glassRecess:
    "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)",
  blur: "blur(24px) saturate(150%)",
  blurStrong: "blur(32px) saturate(160%)",

  // ─── HAIRLINES (theme-routed) ────────────────────────────────────────
  rule: VANTARY.rule,
  ruleSoft: VANTARY.ruleSoft,
  ruleStrong: VANTARY.ruleStrong,
  ruleAmber: VANTARY.ruleStrong,
  ruleAmberSoft: VANTARY.rule,

  // ─── FOREGROUND LADDER ───────────────────────────────────────────────
  paper: VANTARY.paper,
  paperDim: VANTARY.paperDim,
  ash: VANTARY.ash,
  ashSoft: VANTARY.ashSoft,
  ashGhost: VANTARY.ashGhost,
  ashWhisper: "rgba(255,255,255,0.08)",

  // ─── PRIMARY ACCENT (theme primary — was hardcoded amber) ────────────
  amber: VANTARY.amber,
  amberDeep: VANTARY.amberDeep,
  amberInk: VANTARY.amberInk,
  amberWash: VANTARY.amberWash,
  amberHalo: VANTARY.amberHalo,
  /** Static amber RGB triplet for `rgba(${VT.amberRgb}, a)` template strings.
   *  Kept deliberately static — used in many template-string contexts where
   *  a CSS color (var/oklab) cannot be injected. Theme-routed callers should
   *  use `VT.amber` (the CSS color) or `amber(a)` helper instead. */
  amberRgb: "245,158,11",

  // ─── SEMANTIC ACCENTS (kept static — they're chart semantics
  //     that don't change between themes: green = win, red = loss) ─────
  emerald: VANTARY.chartUp,
  emeraldRgb: "16,185,129",

  rose: VANTARY.chartDown,
  roseRgb: "239,68,68",

  blue: VANTARY.blue,
  blueRgb: "59,130,246",

  purple: "#9d88d9",
  purpleRgb: "157,136,217",

  cyan: "#7bd0c5",
  cyanRgb: "123,208,197",

  slate: "148,163,184",

  // ─── GEOMETRY ────────────────────────────────────────────────────────
  cardRadius: 20,
  cardRadiusTight: 14,
  chipRadius: 8,
  badgeRadius: 6,
  pillRadius: 999,

  // ─── ELEVATION ───────────────────────────────────────────────────────
  cardShadow:
    "0 1px 0 rgba(255,255,255,0.02) inset, 0 8px 24px rgba(0,0,0,0.32)",
  cardShadowHover:
    "0 1px 0 rgba(255,255,255,0.04) inset, 0 16px 40px rgba(0,0,0,0.48), 0 0 0 1px rgba(255,255,255,0.04)",
  recessShadow: "inset 0 1px 2px rgba(0,0,0,0.18)",

  // ─── MOTION ──────────────────────────────────────────────────────────
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  easeOut: [0.16, 1, 0.3, 1] as [number, number, number, number],
} as const

// ─── HELPERS ───────────────────────────────────────────────────────────
/** Theme-aware translucent primary accent. `amber(0.5)` → 50% opacity primary. */
export const amber = (a: number) => mix(VANTARY.amber, a)

/** Static slate — kept for muted neutral overlays that shouldn't theme. */
export const slate = (a: number) => `rgba(148,163,184,${a})`

/** General-purpose translucent helper for any CSS token (theme-aware). */
export const rgba = (rgb: string, a: number) => `rgba(${rgb},${a})`

// ─── TYPOGRAPHY CONTRACT ───────────────────────────────────────────────
export const VT_TYPE = {
  eyebrow: "font-mono uppercase font-medium tabular-nums",
  eyebrowTracking: "0.22em",
  num: "font-mono tabular-nums",
} as const
