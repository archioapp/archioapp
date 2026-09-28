/**
 * VANTARY DESIGN SYSTEM — DYNAMIC THEME ROUTING
 *
 * All values are now CSS custom-property references that the
 * <VantaryThemeProvider/> writes onto :root. This means a theme switch
 * propagates to every component that reads VANTARY.* without needing
 * any per-component refactor:
 *
 *   - Sessions Radar (Tokyo highlight, hour pin)
 *   - Live Equity Volume (chart bars, axis)
 *   - Watchlist (candle bullish stroke)
 *   - Macro alerts (countdown bars)
 *   - Oracle "Ask me anything" (input glow, sparkles)
 *   - Header notification bell, status dots, ticker, etc.
 *
 * Fallbacks (the second value inside var(...)) are the original Teal
 * Glass palette so SSR / first paint never shows blank colors.
 */

const v = (name: string, fallback: string) => `var(${name}, ${fallback})`

export const VANTARY = {
  /* ── Plane 0 · World ── */
  ink:        v("--vt-ink",   "#0A0E12"),
  ink2:       v("--vt-ink2",  "#141B21"),
  ink3:       v("--vt-ink3",  "#1A2329"),

  /* ── Foreground ── */
  paper:      v("--vt-paper",     "#EAEFF4"),
  paperDim:   v("--vt-paper-dim", "#C5CCD4"),
  ash:        v("--vt-ash",       "#7B8894"),
  ashSoft:    v("--vt-ash-soft",  "#5E6A75"),
  ashGhost:   v("--vt-ash-ghost", "#3D4851"),

  /* ── Primary accent — was hardcoded teal, now theme-driven ── */
  teal:       v("--vt-primary",      "#2DD4BF"),
  tealDeep:   v("--vt-primary-deep", "#14B8A6"),
  tealInk:    v("--vt-primary-ink",  "#0D1E1C"),
  tealWash:   v("--vt-primary-wash", "rgba(45,212,191,0.10)"),
  tealHalo:   v("--vt-primary-halo", "rgba(45,212,191,0.20)"),

  /* ── Secondary accent ── */
  blue:       v("--vt-secondary",      "#3B82F6"),
  blueDeep:   v("--vt-secondary-deep", "#2563EB"),
  blueWash:   v("--vt-secondary-wash", "rgba(59,130,246,0.10)"),

  /* ── Severity tints (theme-driven) ── */
  warnWash:   v("--vt-warn-wash", "rgba(239,68,68,0.15)"),
  warnInk:    v("--vt-warn-ink",  "#2A1414"),
  warnEdge:   v("--vt-warn-edge", "rgba(239,68,68,0.30)"),

  /* ── Status indicators ── */
  onlineDot:  v("--vt-online-dot",  "#10B981"),
  offlineDot: v("--vt-offline-dot", "#EF4444"),
  badgeRed:   v("--vt-badge-red",   "#DC2626"),

  /* ── Rules / hairlines ── */
  rule:        v("--vt-rule",        "rgba(45,212,191,0.12)"),
  ruleSoft:    v("--vt-rule-soft",   "rgba(45,212,191,0.06)"),
  ruleStrong:  v("--vt-rule-strong", "rgba(45,212,191,0.20)"),

  /* ── Glass surfaces (Plane 1) ── */
  glass:       v("--vt-glass",        "rgba(16,23,28,0.60)"),
  glassStrong: v("--vt-glass-strong", "rgba(14,20,26,0.80)"),
  glassDeep:   v("--vt-glass-deep",   "rgba(10,14,18,0.88)"),

  /* ── Chips (Plane 2) ── */
  chipFill:    v("--vt-chip-fill",    "rgba(45,212,191,0.06)"),
  chipFillHi:  v("--vt-chip-fill-hi", "rgba(45,212,191,0.12)"),
  chipBorder:  v("--vt-chip-border",  "rgba(45,212,191,0.18)"),

  /* ── Chart colors ── */
  chartUp:      v("--vt-chart-up",      "#10B981"),
  chartDown:    v("--vt-chart-down",    "#EF4444"),
  chartNeutral: v("--vt-chart-neutral", "#6B7280"),

  /* ── Legacy "amber" alias — every component using VANTARY.amber
       now automatically gets the active theme's primary accent ── */
  amber:      v("--vt-primary",      "#2DD4BF"),
  amberDeep:  v("--vt-primary-deep", "#14B8A6"),
  amberInk:   v("--vt-primary-ink",  "#0D1E1C"),
  amberWash:  v("--vt-primary-wash", "rgba(45,212,191,0.10)"),
  amberHalo:  v("--vt-primary-halo", "rgba(45,212,191,0.20)"),
} as const

/* ── Radii ── */
export const RADIUS_V = {
  card:    "20px",
  cardLg:  "24px",
  inner:   "14px",
  chip:    "10px",
  pill:    "999px",
} as const

/* ── Easing curve ── */
export const EASE_V = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

/* ── Theme-reactive glow / shimmer composites ── */
export const TEAL_GLOW =
  v("--vt-glow", "0 0 20px rgba(45,212,191,0.25), 0 0 40px rgba(45,212,191,0.10)")

export const TEAL_SHIMMER =
  v("--vt-shimmer", "-0.8px 0 0 rgba(45,212,191,0.30), 0.8px 0 0 rgba(59,130,246,0.30), 0 0 24px rgba(45,212,191,0.15)")

/* ── Legacy aliases used across modules ── */
export const CHROMA_SHADOW = TEAL_SHIMMER
export const CHROMA_SHADOW_LO = TEAL_SHIMMER

/* ── Chart constants ── */
export const DASH = "4 6"
export const HAIR = 1

/* ── Reusable glass card style ── */
export function vantaryCard(active = false): React.CSSProperties {
  return {
    background:   active ? VANTARY.glassStrong : VANTARY.glass,
    border:       `1px solid ${active ? VANTARY.ruleStrong : VANTARY.rule}`,
    borderRadius: RADIUS_V.card,
    backdropFilter: "blur(32px) saturate(160%)",
    WebkitBackdropFilter: "blur(32px) saturate(160%)",
    boxShadow: active ? TEAL_GLOW : "0 4px 16px rgba(0,0,0,0.2)",
  }
}

/* ── Reusable chip style ── */
export function vantaryChip(active = false): React.CSSProperties {
  return {
    background:   active ? VANTARY.chipFillHi : VANTARY.chipFill,
    border:       `1px solid ${active ? VANTARY.teal : VANTARY.chipBorder}`,
    borderRadius: RADIUS_V.pill,
    color:        active ? VANTARY.teal : VANTARY.paperDim,
  }
}
