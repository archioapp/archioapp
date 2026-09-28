/**
 * MTF Design System v2 -- Premium Analysis Chart Tokens
 *
 * Design language:
 *  - Deep space backgrounds with layered depth (#0a0c15 -> #12152a)
 *  - Purple star particles with interactive glow orbs
 *  - Cards separated by background depth, NEVER borders
 *  - Pink/rose + purple + emerald accent system
 *  - Hover lift animations with ambient glow reflections
 *  - Phase-driven color identity (bull=emerald, bear=rose, neutral=slate)
 */

/* ── Surface Palette (darkest to lightest) ── */
export const SURFACE = {
  /** Page-level deep space */
  void: "rgba(10,12,21,1)",
  /** Recessed inner element -- chart bg, signal bars */
  recess: "rgba(8,10,18,0.65)",
  /** Primary card surface */
  card: "rgba(16,19,34,0.92)",
  /** Card surface on hover */
  cardHover: "rgba(20,24,42,0.96)",
  /** Elevated inner element -- tooltips, popovers */
  raised: "rgba(22,26,48,0.5)",
  /** Control surface (mode pills, badges, tabs) */
  control: "rgba(12,14,26,0.85)",
  /** Subtle divider line */
  divider: "rgba(139,92,246,0.06)",
} as const

/* ── Accent Palette ── */
export const ACCENT = {
  purple: { rgb: "139,92,246", hex: "#8b5cf6" },
  rose: { rgb: "244,63,94", hex: "#f43f5e" },
  emerald: { rgb: "16,185,129", hex: "#10b981" },
  amber: { rgb: "245,158,11", hex: "#f59e0b" },
  blue: { rgb: "59,130,246", hex: "#3b82f6" },
  cyan: { rgb: "6,182,212", hex: "#06b6d4" },
  slate: { rgb: "148,163,184", hex: "#94a3b8" },
} as const

/* ── Mode Accents ── */
export const MODE_ACCENT: Record<string, typeof ACCENT.purple> = {
  scalp: ACCENT.emerald,
  day: ACCENT.blue,
  swing: ACCENT.amber,
}

/* ── Phase Colors ── */
export const PHASE_COLOR = {
  accumulation: ACCENT.emerald,
  distribution: ACCENT.rose,
  range: ACCENT.slate,
} as const

/* ── Tab Accent Colors ── */
export const TAB_ACCENT: Record<string, typeof ACCENT.purple> = {
  mtf: ACCENT.emerald,
  sessions: ACCENT.cyan,
  liquidity: ACCENT.blue,
  macro: ACCENT.amber,
  levels: ACCENT.purple,
  structure: ACCENT.rose,
  history: ACCENT.slate,
  forecast: ACCENT.amber,
}

/* ── Glow Shadows ── */
export const GLOW = {
  low: (rgb: string) => `0 0 12px rgba(${rgb},0.08), 0 0 4px rgba(${rgb},0.04)`,
  med: (rgb: string) => `0 0 24px rgba(${rgb},0.14), 0 0 8px rgba(${rgb},0.08)`,
  high: (rgb: string) => `0 0 40px rgba(${rgb},0.22), 0 0 16px rgba(${rgb},0.12)`,
  /** Card-beneath glow for hover states */
  reflection: (rgb: string) => `0 20px 60px rgba(${rgb},0.12), 0 8px 24px rgba(${rgb},0.08)`,
} as const

/* ── Gradient Strings ── */
export const GRADIENT = {
  /** Header bottom accent line */
  headerLine: (rgb: string) =>
    `linear-gradient(90deg, transparent 0%, rgba(${rgb},0.4) 20%, rgba(${rgb},0.6) 50%, rgba(${rgb},0.4) 80%, transparent 100%)`,
  /** Section divider */
  divider: `linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.1) 30%, rgba(244,63,94,0.06) 50%, rgba(139,92,246,0.1) 70%, transparent 100%)`,
  /** Card top accent */
  cardAccent: (rgb: string) =>
    `linear-gradient(90deg, transparent 10%, rgba(${rgb},0.2) 50%, transparent 90%)`,
  /** Shimmer sweep for loading */
  shimmer: `linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.04) 25%, rgba(139,92,246,0.08) 50%, rgba(139,92,246,0.04) 75%, transparent 100%)`,
} as const

/* ── Card Elevation ── */
export const ELEVATION = {
  flat: "0 2px 8px rgba(0,0,0,0.15)",
  card: "0 4px 24px rgba(0,0,0,0.35), 0 0 1px rgba(255,255,255,0.03)",
  cardHover: "0 16px 56px rgba(0,0,0,0.55), 0 0 1px rgba(255,255,255,0.06)",
  tooltip: "0 8px 32px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.06)",
  /** Outer glow beneath card on hover */
  cardGlow: (rgb: string) => `0 16px 56px rgba(0,0,0,0.55), 0 0 1px rgba(255,255,255,0.06), ${GLOW.reflection(rgb)}`,
} as const

/* ── Radius ── */
export const RADIUS = {
  card: "20px",
  inner: "14px",
  pill: "12px",
  badge: "8px",
  dot: "999px",
} as const

/* ── Motion ── */
export const MOTION = {
  ease: [0.33, 1, 0.68, 1] as [number, number, number, number],
  spring: { type: "spring" as const, stiffness: 280, damping: 28 },
  springGentle: { type: "spring" as const, stiffness: 200, damping: 24 },
  stagger: 0.12,
  hoverLift: -4,
  slideIn: 24,
  /** Tab progression view time in ms */
  tabViewTime: 3000,
}

/* ── Z-Index Layers ── */
export const Z_INDEX = {
  particles: 0,
  cards: 1,
  controls: 2,
  tooltips: 10,
  overlays: 20,
} as const

/* ── Typography ── */
export const TYPE = {
  /** Section heading */
  heading: "text-[18px] font-bold tracking-tight leading-tight",
  /** Card title -- big timeframe abbreviation */
  title: "text-[36px] font-bold tracking-tight leading-none",
  /** Subtitle -- full timeframe name, section labels */
  subtitle: "text-[11px] font-mono uppercase tracking-[0.16em]",
  /** Stat number -- large dashboard-style */
  stat: "text-[32px] font-bold font-mono leading-none tracking-tighter",
  /** Metric value -- medium numbers */
  metric: "text-[28px] font-bold font-mono leading-none tracking-tighter",
  /** Small metric */
  metricSm: "text-[20px] font-bold font-mono leading-none tracking-tight",
  /** Label */
  label: "text-[9px] font-mono uppercase tracking-[0.14em] font-semibold",
  /** Body text */
  body: "text-[11px] leading-[1.85]",
  /** Caption */
  caption: "text-[10px] leading-[1.6] text-slate-400",
  /** Micro label */
  micro: "text-[8px] font-mono uppercase tracking-[0.18em] font-bold",
}

/* ── Particle Config ── */
export const PARTICLES = {
  count: 12,
  colors: [
    "rgba(139,92,246,0.12)",
    "rgba(59,130,246,0.08)",
    "rgba(244,63,94,0.06)",
    "rgba(139,92,246,0.1)",
    "rgba(16,185,129,0.06)",
    "rgba(245,158,11,0.05)",
    "rgba(139,92,246,0.08)",
    "rgba(6,182,212,0.06)",
    "rgba(244,63,94,0.04)",
    "rgba(59,130,246,0.06)",
    "rgba(139,92,246,0.1)",
    "rgba(16,185,129,0.04)",
  ],
  sizes: [2, 1.5, 2.5, 1, 2, 1.5, 1, 2.5, 1.5, 2, 1, 3],
}

/* ── Animation Keyframes (for CSS) ── */
export const ANIMATION = {
  shimmerDuration: "2s",
  pulseDuration: "3s",
  twinkleDuration: "0.3s",
  twinkleInterval: [4000, 8000] as [number, number],
  typewriterCharDelay: 8,
  signalBarStagger: 40,
  cardEntranceStagger: 120,
} as const
