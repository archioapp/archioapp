/* ──────────────────────────────────────────────────────────────────────────
 *  PITCH DNA  ·  the /newpitch token surface  ·  BRIGHT PAPER EDITION
 *
 *  /newpitch keeps the platform's teal accent + tactical-grid grammar, but
 *  renders it on a clean off-white "investor memo" canvas — the opposite of
 *  the dark cockpit. We deliberately mirror the EXACT key names of the
 *  platform DNA so every instrument / chrome component reads the same token
 *  surface; only the values change (dark → paper).
 *
 *  Law: ink + warm neutrals carry the page. Teal is the single brand accent.
 *  Red/amber are reserved strictly for loss & risk numbers. No other hues.
 * ──────────────────────────────────────────────────────────────────────── */

import type React from "react"
import { MONO_CAP, MONO_CAP_TIGHT } from "@/components/design/design-tokens"

export { MONO_CAP, MONO_CAP_TIGHT }

/* ── Bright paper palette (same keys as platform DNA, light values) ──── */
export const DNA = {
  /* Plane 0 · world / recessed surfaces (now light) */
  ink: "#FCFBF8",
  ink2: "#F5F4EF",
  ink3: "#ECEAE3",

  /* Foreground typography (dark ink → faint) */
  paper: "#16201D",
  paperDim: "#3C4A46",
  ash: "#62706B",
  ashSoft: "#7E8A85",
  ashGhost: "#A7B1AB",

  /* Teal — the single brand accent (deepened for white-bg legibility) */
  teal: "#0D9488",
  tealDeep: "#0F766E",
  tealWash: "rgba(13,148,136,0.07)",
  tealHalo: "rgba(13,148,136,0.16)",
  tealRule: "rgba(13,148,136,0.16)",
  tealRuleStrong: "rgba(13,148,136,0.32)",

  /* Risk red / amber — loss & danger only */
  riskEdge: "rgba(220,38,38,0.40)",
  riskWash: "rgba(220,38,38,0.06)",
  riskGlow: "rgba(220,38,38,0.10)",
  riskGlowEdge: "rgba(220,38,38,0.32)",
  riskInk: "#DC2626",
  riskAmber: "#D97706",

  /* Glass → card surfaces on paper */
  glass: "rgba(255,255,255,0.78)",
  glassStrong: "#FFFFFF",
  glassDeep: "#F3F2ED",

  /* Chips */
  chipFill: "rgba(13,148,136,0.06)",
  chipFillHi: "rgba(13,148,136,0.12)",
  chipBorder: "rgba(13,148,136,0.24)",

  /* Hairline neutral border (for non-accent separators) */
  hair: "rgba(22,32,29,0.10)",
  hairStrong: "rgba(22,32,29,0.16)",

  /* Soft elevation shadows for the paper look */
  shadowSm: "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
  shadowMd: "0 1px 2px rgba(16,24,40,0.04), 0 12px 28px -18px rgba(16,24,40,0.18)",
  shadowLg: "0 2px 4px rgba(16,24,40,0.04), 0 24px 48px -28px rgba(16,24,40,0.22)",

  /* Radius scale */
  rSm: 8,
  rMd: 12,
  rLg: 16,
  rXl: 20,
} as const

/* ── Alpha mixer for hex tokens ─────────────────────────────────────── */
export function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace("#", "")
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h
  const r = Number.parseInt(full.slice(0, 2), 16)
  const g = Number.parseInt(full.slice(2, 4), 16)
  const b = Number.parseInt(full.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/* ── Severity → accent resolution ───────────────────────────────────── */
export type Severity = "teal" | "amber" | "risk" | "good"

export function accentFor(sev: Severity): { ink: string; edge: string; wash: string; halo: string } {
  switch (sev) {
    case "risk":
      return { ink: DNA.riskInk, edge: DNA.riskGlowEdge, wash: DNA.riskWash, halo: DNA.riskGlow }
    case "amber":
      return {
        ink: DNA.riskAmber,
        edge: "rgba(217,119,6,0.38)",
        wash: "rgba(217,119,6,0.07)",
        halo: "rgba(217,119,6,0.16)",
      }
    case "good":
      return {
        ink: "#059669",
        edge: "rgba(5,150,105,0.34)",
        wash: "rgba(5,150,105,0.07)",
        halo: "rgba(5,150,105,0.16)",
      }
    default:
      return { ink: DNA.teal, edge: DNA.tealRuleStrong, wash: DNA.tealWash, halo: DNA.tealHalo }
  }
}

/* ── Shared cinematic easing ────────────────────────────────────────── */
export const EASE_V = "cubic-bezier(0.22, 1, 0.36, 1)"

/* ── Page background — clean warm paper with a faint teal sky ────────── */
export const PITCH_BACKDROP = `
  radial-gradient(ellipse 70% 48% at 50% -6%, rgba(13,148,136,0.06) 0%, transparent 56%),
  linear-gradient(180deg, #FCFBF8 0%, #F6F5F0 100%)
`

/* ── Tactical grid — faint neutral ink lines (visible on paper) ──────── */
export const TACTICAL_GRID: React.CSSProperties = {
  backgroundImage: `
    linear-gradient(to right, rgba(22,32,29,0.045) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(22,32,29,0.045) 1px, transparent 1px)
  `,
  backgroundSize: "32px 32px",
}

/* ── Dashed hairline rule ───────────────────────────────────────────── */
export const DASHED_RULE = {
  backgroundImage: `repeating-linear-gradient(90deg, ${DNA.tealRuleStrong} 0 6px, transparent 6px 12px)`,
  height: 1,
}
