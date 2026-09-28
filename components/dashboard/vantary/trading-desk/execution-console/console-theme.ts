/* ═══════════════════════════════════════════════════════════════════════════
 *  EXECUTION CONSOLE · MODE THEME
 *  ─────────────────────────────────────────────────────────────────────────
 *  The Console's entire emotional grammar is "the room changes colour with
 *  the world you're in." This file is the SINGLE source of truth for that
 *  mapping. Everything in the console reads its accent from here so the mode
 *  pill, the safety pip, the station rails, and the arming control can never
 *  drift out of sync.
 *
 *  Design law (blueprint §2.1.2): calm by default, dangerous on demand.
 *    · disconnected — grey, still. nothing is armed, nothing can go wrong.
 *    · simulation   — teal (the platform primary). practice freely.
 *    · live-ready   — gold. charged but calm. real money is one ritual away.
 *    · live-locked  — gold, but the arming control is physically locked.
 *    · blocked      — red, firm. a rule is being violated; execution refused.
 *
 *  We intentionally use a LITERAL gold for the live accent rather than the
 *  themed primary, because the primary token is teal — and the whole point
 *  of the mode system is that LIVE must look unmistakably different from
 *  SIMULATION at a peripheral glance. Gold vs teal is that difference.
 *
 *  Pure data — no React, no DOM. Tree-shakable.
 * ═══════════════════════════════════════════════════════════════════════ */

import { VANTARY } from "../../vantary-theme"

export type ConsoleMode =
  | "disconnected"
  | "simulation"
  | "live-ready"
  | "live-locked"
  | "blocked"

export interface ConsoleAccent {
  /** The line/numeral colour for this mode. */
  base:   string
  /** A translucent wash for fills / active plates. */
  wash:   string
  /** A translucent halo for borders / glows. */
  halo:   string
  /** A soft glow box-shadow string for the crown top-edge light. */
  glow:   string
  /** The pill copy. */
  token:  string
  /** One-line caption shown under the crown (blueprint §5). */
  caption: string
  /** True when this mode means "real capital is reachable". */
  isLive:  boolean
}

/* Literal gold for LIVE — deliberately NOT the themed teal primary so the
 * two worlds are never confused at a glance. */
const GOLD       = "#E5A93C"
const GOLD_WASH  = "rgba(229,169,60,0.10)"
const GOLD_HALO  = "rgba(229,169,60,0.34)"
const GOLD_GLOW  = "0 -1px 0 rgba(229,169,60,0.55), 0 6px 30px -8px rgba(229,169,60,0.30)"

const RED        = "#E5484D"
const RED_WASH   = "rgba(229,72,77,0.10)"
const RED_HALO   = "rgba(229,72,77,0.38)"
const RED_GLOW   = "0 -1px 0 rgba(229,72,77,0.60), 0 6px 30px -8px rgba(229,72,77,0.32)"

export const CONSOLE_ACCENTS: Record<ConsoleMode, ConsoleAccent> = {
  "disconnected": {
    base:    VANTARY.ash,
    wash:    "rgba(123,136,148,0.07)",
    halo:    "rgba(123,136,148,0.20)",
    glow:    "0 -1px 0 rgba(123,136,148,0.18)",
    token:   "DISCONNECTED",
    caption: "Connect an account to begin.",
    isLive:  false,
  },
  "simulation": {
    base:    VANTARY.teal,
    wash:    VANTARY.tealWash,
    halo:    VANTARY.tealHalo,
    glow:    "0 -1px 0 rgba(45,212,191,0.45), 0 6px 30px -8px rgba(45,212,191,0.26)",
    token:   "SIMULATION",
    caption: "Simulation — practice freely.",
    isLive:  false,
  },
  "live-ready": {
    base:    GOLD,
    wash:    GOLD_WASH,
    halo:    GOLD_HALO,
    glow:    GOLD_GLOW,
    token:   "LIVE · READY",
    caption: "Live account armed — hold to execute.",
    isLive:  true,
  },
  "live-locked": {
    base:    GOLD,
    wash:    GOLD_WASH,
    halo:    GOLD_HALO,
    glow:    GOLD_GLOW,
    token:   "LIVE · LOCKED",
    caption: "Live execution locked. Unlock to arm.",
    isLive:  true,
  },
  "blocked": {
    base:    RED,
    wash:    RED_WASH,
    halo:    RED_HALO,
    glow:    RED_GLOW,
    token:   "BLOCKED",
    caption: "A rule is being violated — execution refused.",
    isLive:  false,
  },
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  GLASS LANGUAGE TOKENS  ·  the "billion-dollar" surface DNA
 *  ─────────────────────────────────────────────────────────────────────────
 *  Extracted from the Flight Deck room cards (the design the trader loves):
 *  alive theme-tinted hairlines, a soft top-down radial glow, a diagonal sheen
 *  sweep, a slow conic edge-light ring, and an optional cursor reflection.
 *
 *  These are TIMINGS + RATIOS only — colour comes from whatever accent the
 *  surface is given (a ConsoleAccent.base, a buy/sell colour, or a VANTARY
 *  token). Components turn ratios into colour with `tintA()` (color-mix), so
 *  any CSS colour incl. custom-property strings works — never assume hex/rgb.
 * ═══════════════════════════════════════════════════════════════════════ */

export type GlassTone = "idle" | "active" | "buy" | "sell" | "warn" | "live"

export interface GlassToneSpec {
  /** Border hairline alpha at rest / hover (0..1). */
  borderRest: number
  borderHover: number
  /** Top-down radial glow alpha at rest / hover. */
  glowRest: number
  glowHover: number
  /** Top accent strip alpha. */
  strip: number
  /** Diagonal sheen sweep peak alpha (0 disables sheen). */
  sheen: number
}

export const GLASS_TONES: Record<GlassTone, GlassToneSpec> = {
  idle:   { borderRest: 0.16, borderHover: 0.34, glowRest: 0.05, glowHover: 0.10, strip: 0.42, sheen: 0.22 },
  active: { borderRest: 0.30, borderHover: 0.46, glowRest: 0.10, glowHover: 0.16, strip: 0.60, sheen: 0.28 },
  buy:    { borderRest: 0.26, borderHover: 0.44, glowRest: 0.09, glowHover: 0.15, strip: 0.58, sheen: 0.26 },
  sell:   { borderRest: 0.26, borderHover: 0.44, glowRest: 0.09, glowHover: 0.15, strip: 0.58, sheen: 0.26 },
  warn:   { borderRest: 0.30, borderHover: 0.48, glowRest: 0.10, glowHover: 0.16, strip: 0.60, sheen: 0.20 },
  live:   { borderRest: 0.32, borderHover: 0.50, glowRest: 0.11, glowHover: 0.18, strip: 0.64, sheen: 0.30 },
}

/** Motion timings for the glass layers (seconds). */
export const GLASS_MOTION = {
  /** Diagonal sheen sweep duration on hover-enter (slow, considered, luxe). */
  sheenSec: 1.6,
  /** Conic edge-light ring full rotation. */
  ringSec: 7.5,
  /** Border / glow cross-fade. */
  fadeSec: 0.32,
} as const

/** Buy / sell semantic colours for tone-keyed glass (emerald / rose). */
export const GLASS_SIDE = {
  buy:  VANTARY.chartUp,
  sell: VANTARY.chartDown,
} as const

/* The order the demo cycler steps through (skips "blocked" — that is a
 * derived state, not a world the trader chooses). */
export const CONSOLE_DEMO_MODE_ORDER: ReadonlyArray<ConsoleMode> = [
  "disconnected",
  "simulation",
  "live-locked",
  "live-ready",
] as const

/* ─── Demo account fixtures (Phase 1 — no real connection) ─────────────────
 *  These seed the Status Crown's account identity per mode so the three
 *  worlds read as genuinely different desks, not the same desk recoloured. */
export interface ConsoleDemoAccount {
  name:     string
  broker:   string
  balance:  number
  currency: string
  /** Normalised 0..1 equity micro-spark series (last N ticks). */
  spark:    number[]
}

function buildSpark(seed: number, bias: number): number[] {
  const out: number[] = []
  let v = 0.5
  for (let i = 0; i < 40; i++) {
    const wave  = Math.sin((i + seed) * 0.5) * 0.06
    const drift = (i / 40) * bias
    const noise = (((i * 9301 + seed * 49297) % 233) / 233 - 0.5) * 0.05
    v = 0.5 + wave + drift + noise
    out.push(Math.max(0.05, Math.min(0.95, v)))
  }
  return out
}

export const CONSOLE_DEMO_ACCOUNTS: Record<ConsoleMode, ConsoleDemoAccount> = {
  "disconnected": { name: "No account",        broker: "—",          balance: 0,      currency: "USD", spark: buildSpark(3, 0) },
  "simulation":   { name: "Sim · Practice",    broker: "ARCHIO SIM", balance: 100000, currency: "USD", spark: buildSpark(7, 0.12) },
  "live-locked":  { name: "FTMO · 100K",       broker: "TRADELOCKER",balance: 102480, currency: "USD", spark: buildSpark(11, 0.04) },
  "live-ready":   { name: "FTMO · 100K",       broker: "TRADELOCKER",balance: 102480, currency: "USD", spark: buildSpark(11, 0.04) },
  "blocked":      { name: "FTMO · 100K",       broker: "TRADELOCKER",balance: 102480, currency: "USD", spark: buildSpark(11, -0.10) },
}
