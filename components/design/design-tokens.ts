/**
 * ARCHIOAI · VISUAL DNA TOKENS
 *
 * Extracted from the TEAL_GLASS theme inside
 * components/dashboard/vantary/theme-system.ts.
 *
 * These tokens are intentionally hardcoded here so the /design page is a
 * museum specimen — fully isolated from cockpit providers, hooks, stores,
 * and runtime state. Keep these values in lockstep with TEAL_GLASS.
 */

export const DNA = {
  /* ── Plane 0 · World ink ── */
  ink: "#0A0E12",
  ink2: "#141B21",
  ink3: "#1A2329",

  /* ── Foreground typography ── */
  paper: "#EAEFF4",
  paperDim: "#C5CCD4",
  ash: "#7B8894",
  ashSoft: "#5E6A75",
  ashGhost: "#3D4851",

  /* ── Teal — system intelligence ── */
  teal: "#2DD4BF",
  tealDeep: "#14B8A6",
  tealWash: "rgba(45,212,191,0.10)",
  tealHalo: "rgba(45,212,191,0.20)",
  tealRule: "rgba(45,212,191,0.12)",
  tealRuleStrong: "rgba(45,212,191,0.20)",

  /* ── Risk red — institutional, controlled ── */
  riskEdge: "rgba(122,47,47,0.45)",
  riskWash: "rgba(122,47,47,0.18)",
  riskGlow: "rgba(255,80,80,0.15)",
  riskGlowEdge: "rgba(255,80,80,0.35)",
  riskInk: "#F87171",
  riskAmber: "#F59E0B",

  /* ── Glass surfaces ── */
  glass: "rgba(16,23,28,0.60)",
  glassStrong: "rgba(14,20,26,0.80)",
  glassDeep: "rgba(10,14,18,0.88)",

  /* ── Chips ── */
  chipFill: "rgba(45,212,191,0.06)",
  chipFillHi: "rgba(45,212,191,0.12)",
  chipBorder: "rgba(45,212,191,0.18)",

  /* ── Radius scale ── */
  rSm: 8,
  rMd: 12,
  rLg: 16,
  rXl: 20,
} as const

/* ── Typography helpers ─────────────────────────────────────────────── */

export const MONO_CAP = {
  fontFamily: "var(--font-mono), ui-monospace, SFMono-Regular, monospace",
  textTransform: "uppercase" as const,
  letterSpacing: "0.18em",
  fontWeight: 500,
}

export const MONO_CAP_TIGHT = {
  ...MONO_CAP,
  letterSpacing: "0.14em",
}

/* ── Tactical grid (subtle 32px crosshatch) ─────────────────────────── */

export const TACTICAL_GRID: React.CSSProperties = {
  backgroundImage: `
    linear-gradient(to right, rgba(45,212,191,0.035) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(45,212,191,0.035) 1px, transparent 1px)
  `,
  backgroundSize: "32px 32px",
}

/* ── Hairline (dashed rule used inside cockpit panels) ──────────────── */

export const DASHED_RULE = {
  backgroundImage: `repeating-linear-gradient(90deg, ${DNA.tealRule} 0 6px, transparent 6px 12px)`,
  height: 1,
}
