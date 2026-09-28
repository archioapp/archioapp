/**
 * VANTARY MULTI-THEME SYSTEM
 * 
 * Five meticulously crafted color palettes representing the evolution
 * of UI/UX design from 2026 through 2313. Each theme is a complete
 * design system with 50+ tokens covering every visual element.
 * 
 * Themes:
 * 1. TEAL GLASS — Cool professional (current default)
 * 2. CYBER NEON — Vibrant cyberpunk aesthetic (purple/pink/cyan)
 * 3. NEURAL DARK — Deep AI/neural network aesthetic (blue/violet)
 * 4. QUANTUM GREEN — Bio-tech matrix aesthetic (emerald/lime)
 * 5. SOLAR FUSION — Warm energy aesthetic (orange/gold/red)
 */

export type ThemeId = "teal" | "cyber" | "neural" | "quantum" | "solar" | "light" | "obsidian"

export interface VantaryTheme {
  id: ThemeId
  name: string
  description: string
  
  /* ── Plane 0 · World backgrounds ── */
  ink: string        // deepest background
  ink2: string       // base card fill
  ink3: string       // card hover fill
  
  /* ── Foreground text ── */
  paper: string      // primary text
  paperDim: string   // secondary text
  ash: string        // tertiary text
  ashSoft: string    // quaternary text
  ashGhost: string   // disabled text
  
  /* ── Primary accent colors ── */
  primary: string       // main accent
  primaryDeep: string   // deeper shade
  primaryInk: string    // tinted background
  primaryWash: string   // transparent wash
  primaryHalo: string   // glow effect
  
  /* ── Secondary accent ── */
  secondary: string
  secondaryDeep: string
  secondaryWash: string
  
  /* ── Tertiary accent ── */
  tertiary: string
  tertiaryWash: string
  
  /* ── Status indicators ── */
  onlineDot: string   // positive status
  offlineDot: string  // negative status
  badgeRed: string    // notification badge
  
  /* ── Warning/Error tints ── */
  warnWash: string
  warnInk: string
  warnEdge: string
  
  /* ── Rules & borders ── */
  rule: string
  ruleSoft: string
  ruleStrong: string
  
  /* ── Glass surfaces (Plane 1) ── */
  glass: string
  glassStrong: string
  glassDeep: string
  
  /* ── Chips (Plane 2) ── */
  chipFill: string
  chipFillHi: string
  chipBorder: string
  
  /* ── Glow effects ── */
  glow: string[]
  shimmer: string[]
  
  /* ── Chart colors ── */
  chartUp: string      // positive movement
  chartDown: string    // negative movement
  chartNeutral: string // neutral/baseline
  
  /* ── Advanced visual effects ── */
  particleColors: string[]  // for particle systems
  gradientStops: string[]   // for hero gradients
}

/* ═══════════════════════════════════════════════════════════════════════
   THEME 1: TEAL GLASS — Cool Professional (2026 Standard)
   
   Modern glassmorphic design with teal accents. Clean, professional,
   data-focused. Perfect for financial/trading interfaces.
   ═══════════════════════════════════════════════════════════════════════ */

export const TEAL_GLASS: VantaryTheme = {
  id: "teal",
  name: "Teal Glass",
  description: "Cool professional aesthetic with frosted glass surfaces",
  
  ink: "#0A0E12",
  ink2: "#141B21",
  ink3: "#1A2329",
  
  paper: "#EAEFF4",
  paperDim: "#C5CCD4",
  ash: "#7B8894",
  ashSoft: "#5E6A75",
  ashGhost: "#3D4851",
  
  primary: "#2DD4BF",
  primaryDeep: "#14B8A6",
  primaryInk: "#0D1E1C",
  primaryWash: "rgba(45,212,191,0.10)",
  primaryHalo: "rgba(45,212,191,0.20)",
  
  secondary: "#3B82F6",
  secondaryDeep: "#2563EB",
  secondaryWash: "rgba(59,130,246,0.10)",
  
  tertiary: "#8B5CF6",
  tertiaryWash: "rgba(139,92,246,0.10)",
  
  onlineDot: "#10B981",
  offlineDot: "#EF4444",
  badgeRed: "#DC2626",
  
  warnWash: "rgba(239,68,68,0.15)",
  warnInk: "#2A1414",
  warnEdge: "rgba(239,68,68,0.30)",
  
  rule: "rgba(45,212,191,0.12)",
  ruleSoft: "rgba(45,212,191,0.06)",
  ruleStrong: "rgba(45,212,191,0.20)",
  
  glass: "rgba(16,23,28,0.60)",
  glassStrong: "rgba(14,20,26,0.80)",
  glassDeep: "rgba(10,14,18,0.88)",
  
  chipFill: "rgba(45,212,191,0.06)",
  chipFillHi: "rgba(45,212,191,0.12)",
  chipBorder: "rgba(45,212,191,0.18)",
  
  glow: [
    "0 0 20px rgba(45,212,191,0.25)",
    "0 0 40px rgba(45,212,191,0.10)",
  ],
  shimmer: [
    "-0.8px 0 0 rgba(45,212,191,0.30)",
    "0.8px 0 0 rgba(59,130,246,0.30)",
    "0 0 24px rgba(45,212,191,0.15)",
  ],
  
  chartUp: "#10B981",
  chartDown: "#EF4444",
  chartNeutral: "#6B7280",
  
  particleColors: ["#2DD4BF", "#3B82F6", "#8B5CF6", "#10B981"],
  gradientStops: ["#2DD4BF", "#14B8A6", "#0D9488"],
}

/* ═══════════════════════════════════════════════════════════════════════
   THEME 2: CYBER NEON — Vibrant Cyberpunk (2045 Aesthetic)
   
   High-contrast neon aesthetics inspired by cyberpunk futures.
   Purple, pink, cyan dominate with electric intensity.
   ═══════════════════════════════════════════════════════════════════════ */

export const CYBER_NEON: VantaryTheme = {
  id: "cyber",
  name: "Cyber Neon",
  description: "Vibrant cyberpunk with electric neon accents",
  
  ink: "#0D0221",
  ink2: "#190B3A",
  ink3: "#231356",
  
  paper: "#F0E7FF",
  paperDim: "#D4C5F9",
  ash: "#9D8AC7",
  ashSoft: "#7D6BA8",
  ashGhost: "#4A3B6E",
  
  primary: "#FF00E5",
  primaryDeep: "#C700B3",
  primaryInk: "#2B0A2C",
  primaryWash: "rgba(255,0,229,0.12)",
  primaryHalo: "rgba(255,0,229,0.25)",
  
  secondary: "#00D9FF",
  secondaryDeep: "#00A8CC",
  secondaryWash: "rgba(0,217,255,0.12)",
  
  tertiary: "#B026FF",
  tertiaryWash: "rgba(176,38,255,0.12)",
  
  onlineDot: "#00FF9F",
  offlineDot: "#FF0055",
  badgeRed: "#FF0055",
  
  warnWash: "rgba(255,0,85,0.18)",
  warnInk: "#330011",
  warnEdge: "rgba(255,0,85,0.35)",
  
  rule: "rgba(255,0,229,0.15)",
  ruleSoft: "rgba(255,0,229,0.08)",
  ruleStrong: "rgba(255,0,229,0.28)",
  
  glass: "rgba(25,11,58,0.65)",
  glassStrong: "rgba(25,11,58,0.85)",
  glassDeep: "rgba(13,2,33,0.92)",
  
  chipFill: "rgba(255,0,229,0.08)",
  chipFillHi: "rgba(255,0,229,0.16)",
  chipBorder: "rgba(255,0,229,0.25)",
  
  glow: [
    "0 0 28px rgba(255,0,229,0.35)",
    "0 0 56px rgba(255,0,229,0.15)",
    "0 0 84px rgba(0,217,255,0.10)",
  ],
  shimmer: [
    "-1.2px 0 0 rgba(255,0,229,0.40)",
    "1.2px 0 0 rgba(0,217,255,0.40)",
    "0 0 32px rgba(176,38,255,0.20)",
  ],
  
  chartUp: "#00FF9F",
  chartDown: "#FF0055",
  chartNeutral: "#7D6BA8",
  
  particleColors: ["#FF00E5", "#00D9FF", "#B026FF", "#00FF9F"],
  gradientStops: ["#FF00E5", "#B026FF", "#7B2CBF"],
}

/* ═══════════════════════════════════════════════════════════════════════
   THEME 3: NEURAL DARK — Deep AI Aesthetic (2120 Neural Network)
   
   Deep blues and violets suggesting neural networks and AI consciousness.
   Subtle, intelligent, with bio-luminescent accents.
   ═══════════════════════════════════════════════════════════════════════ */

export const NEURAL_DARK: VantaryTheme = {
  id: "neural",
  name: "Neural Dark",
  description: "Deep AI aesthetic with neural network patterns",
  
  ink: "#050914",
  ink2: "#0C1425",
  ink3: "#141D35",
  
  paper: "#E8F0FF",
  paperDim: "#C0D4F5",
  ash: "#7A91BC",
  ashSoft: "#5A6F96",
  ashGhost: "#354261",
  
  primary: "#5B8DFF",
  primaryDeep: "#3D6FE8",
  primaryInk: "#0A1428",
  primaryWash: "rgba(91,141,255,0.10)",
  primaryHalo: "rgba(91,141,255,0.22)",
  
  secondary: "#9D6CFF",
  secondaryDeep: "#7E4FE8",
  secondaryWash: "rgba(157,108,255,0.10)",
  
  tertiary: "#4FC3F7",
  tertiaryWash: "rgba(79,195,247,0.10)",
  
  onlineDot: "#00E5A0",
  offlineDot: "#FF4757",
  badgeRed: "#E63946",
  
  warnWash: "rgba(255,71,87,0.15)",
  warnInk: "#2A1215",
  warnEdge: "rgba(255,71,87,0.30)",
  
  rule: "rgba(91,141,255,0.12)",
  ruleSoft: "rgba(91,141,255,0.06)",
  ruleStrong: "rgba(91,141,255,0.22)",
  
  glass: "rgba(12,20,37,0.62)",
  glassStrong: "rgba(12,20,37,0.82)",
  glassDeep: "rgba(5,9,20,0.90)",
  
  chipFill: "rgba(91,141,255,0.06)",
  chipFillHi: "rgba(91,141,255,0.14)",
  chipBorder: "rgba(91,141,255,0.20)",
  
  glow: [
    "0 0 24px rgba(91,141,255,0.28)",
    "0 0 48px rgba(91,141,255,0.12)",
    "0 0 72px rgba(157,108,255,0.08)",
  ],
  shimmer: [
    "-0.9px 0 0 rgba(91,141,255,0.35)",
    "0.9px 0 0 rgba(79,195,247,0.35)",
    "0 0 28px rgba(157,108,255,0.18)",
  ],
  
  chartUp: "#00E5A0",
  chartDown: "#FF4757",
  chartNeutral: "#5A6F96",
  
  particleColors: ["#5B8DFF", "#9D6CFF", "#4FC3F7", "#00E5A0"],
  gradientStops: ["#5B8DFF", "#7E4FE8", "#5B3FB5"],
}

/* ═══════════════════════════════════════════════════════════════════════
   THEME 4: QUANTUM GREEN — Bio-Tech Matrix (2210 Organic Computing)
   
   Emerald and lime greens suggesting bio-engineering and quantum states.
   Matrix-inspired with living, organic feeling technology.
   ═══════════════════════════════════════════════════════════════════════ */

export const QUANTUM_GREEN: VantaryTheme = {
  id: "quantum",
  name: "Quantum Green",
  description: "Bio-tech matrix aesthetic with organic computing vibes",
  
  ink: "#040D0A",
  ink2: "#0A1B14",
  ink3: "#112920",
  
  paper: "#E7FCF3",
  paperDim: "#C2F4DD",
  ash: "#74B99C",
  ashSoft: "#558976",
  ashGhost: "#325447",
  
  primary: "#10F584",
  primaryDeep: "#0ACC67",
  primaryInk: "#0A1F16",
  primaryWash: "rgba(16,245,132,0.10)",
  primaryHalo: "rgba(16,245,132,0.22)",
  
  secondary: "#7CFF6B",
  secondaryDeep: "#5FE04D",
  secondaryWash: "rgba(124,255,107,0.10)",
  
  tertiary: "#3EFFC7",
  tertiaryWash: "rgba(62,255,199,0.10)",
  
  onlineDot: "#00FF88",
  offlineDot: "#FF3366",
  badgeRed: "#FF1F4D",
  
  warnWash: "rgba(255,51,102,0.15)",
  warnInk: "#2A0F16",
  warnEdge: "rgba(255,51,102,0.30)",
  
  rule: "rgba(16,245,132,0.14)",
  ruleSoft: "rgba(16,245,132,0.07)",
  ruleStrong: "rgba(16,245,132,0.24)",
  
  glass: "rgba(10,27,20,0.63)",
  glassStrong: "rgba(10,27,20,0.83)",
  glassDeep: "rgba(4,13,10,0.91)",
  
  chipFill: "rgba(16,245,132,0.07)",
  chipFillHi: "rgba(16,245,132,0.15)",
  chipBorder: "rgba(16,245,132,0.22)",
  
  glow: [
    "0 0 26px rgba(16,245,132,0.30)",
    "0 0 52px rgba(16,245,132,0.14)",
    "0 0 78px rgba(62,255,199,0.09)",
  ],
  shimmer: [
    "-1.0px 0 0 rgba(16,245,132,0.38)",
    "1.0px 0 0 rgba(62,255,199,0.38)",
    "0 0 30px rgba(124,255,107,0.20)",
  ],
  
  chartUp: "#00FF88",
  chartDown: "#FF3366",
  chartNeutral: "#558976",
  
  particleColors: ["#10F584", "#7CFF6B", "#3EFFC7", "#00FF88"],
  gradientStops: ["#10F584", "#0ACC67", "#089951"],
}

/* ═══════════════════════════════════════════════════════════════════════
   THEME 5: SOLAR FUSION — Warm Energy (2313 Star Power)
   
   Orange, gold, and red suggesting solar fusion and limitless energy.
   Warm, powerful, energetic. Future of stellar civilization.
   ═══════════════════════════════════════════════════════════════════════ */

export const SOLAR_FUSION: VantaryTheme = {
  id: "solar",
  name: "Solar Fusion",
  description: "Warm stellar energy with fusion-powered brilliance",
  
  ink: "#0F0604",
  ink2: "#1D110C",
  ink3: "#2B1D14",
  
  paper: "#FFF4E6",
  paperDim: "#FFE4C4",
  ash: "#D4A574",
  ashSoft: "#B8845C",
  ashGhost: "#7A5438",
  
  primary: "#FF8C42",
  primaryDeep: "#FF6B1A",
  primaryInk: "#2B1408",
  primaryWash: "rgba(255,140,66,0.10)",
  primaryHalo: "rgba(255,140,66,0.22)",
  
  secondary: "#FFD700",
  secondaryDeep: "#FFAA00",
  secondaryWash: "rgba(255,215,0,0.10)",
  
  tertiary: "#FF5733",
  tertiaryWash: "rgba(255,87,51,0.10)",
  
  onlineDot: "#00FF7F",
  offlineDot: "#FF3333",
  badgeRed: "#E02424",
  
  warnWash: "rgba(255,51,51,0.16)",
  warnInk: "#2B0C0C",
  warnEdge: "rgba(255,51,51,0.32)",
  
  rule: "rgba(255,140,66,0.14)",
  ruleSoft: "rgba(255,140,66,0.07)",
  ruleStrong: "rgba(255,140,66,0.25)",
  
  glass: "rgba(29,17,12,0.64)",
  glassStrong: "rgba(29,17,12,0.84)",
  glassDeep: "rgba(15,6,4,0.92)",
  
  chipFill: "rgba(255,140,66,0.08)",
  chipFillHi: "rgba(255,140,66,0.16)",
  chipBorder: "rgba(255,140,66,0.24)",
  
  glow: [
    "0 0 28px rgba(255,140,66,0.32)",
    "0 0 56px rgba(255,140,66,0.16)",
    "0 0 84px rgba(255,215,0,0.10)",
  ],
  shimmer: [
    "-1.1px 0 0 rgba(255,140,66,0.40)",
    "1.1px 0 0 rgba(255,215,0,0.40)",
    "0 0 32px rgba(255,87,51,0.22)",
  ],
  
  chartUp: "#00FF7F",
  chartDown: "#FF3333",
  chartNeutral: "#B8845C",
  
  particleColors: ["#FF8C42", "#FFD700", "#FF5733", "#FFA500"],
  gradientStops: ["#FF8C42", "#FF6B1A", "#E55100"],
}

/* ═══════════════════════════════════════════════════════════════════════
   THEME 6: NEURAL LIGHT — Premium Light Mode (2026 Medical/Neuro-tech)
   
   The most detailed theme in the system with DOUBLE the token definitions.
   Inspired by advanced medical/neuroscience interfaces with holographic
   brain aesthetics. White/lavender base with iridescent pink→purple→blue
   gradients, soft shadows, floating card effects, and sophisticated
   multi-color accent system.
   
   Color psychology:
   - White/lavender: Clean, medical, trustworthy
   - Pink→Purple→Blue gradients: Neural synapses, thought patterns
   - Teal/mint: Vitality, health monitoring
   - Coral: Warmth, human connection
   - Soft pastels: Accessibility, calmness
   ═══════════════════════════════════════════════════════════════════════ */

export const NEURAL_LIGHT: VantaryTheme = {
  id: "light",
  name: "Neural Light",
  description: "Premium light mode with holographic brain-inspired color system",
  
  /* ── World backgrounds (clean off-white, neutral) ── */
  ink: "#FAFAFC",        // soft off-white with whisper of cool
  ink2: "#F4F4F8",       // very subtle wash
  ink3: "#EDEDF3",       // hover state
  
  /* ── Foreground text (BLACK with opacity for hierarchy — readable & sophisticated) ── */
  paper: "#0F0F14",                  // near-black, neutral (NOT blue/purple)
  paperDim: "rgba(15,15,20,0.78)",   // 78% black for body text — strong readability
  ash: "rgba(15,15,20,0.55)",        // 55% black for labels
  ashSoft: "rgba(15,15,20,0.40)",    // 40% black for tertiary
  ashGhost: "rgba(15,15,20,0.20)",   // 20% black for disabled
  
  /* ── Primary accent: Sophisticated Indigo-Purple (NOT pink) ── */
  primary: "#6D5BD0",         // refined indigo-purple — professional & calm
  primaryDeep: "#5443B5",     // deeper for hover/pressed
  primaryInk: "#F0EDFA",      // subtle purple-tinted background
  primaryWash: "rgba(109,91,208,0.06)",
  primaryHalo: "rgba(109,91,208,0.12)",
  
  /* ── Secondary accent: Soft Lavender ── */
  secondary: "#8B7FD8",       // softer lavender, calmer
  secondaryDeep: "#6D5BD0",   // matches primary deep
  secondaryWash: "rgba(139,127,216,0.06)",
  
  /* ── Tertiary accent: Muted Periwinkle Blue ── */
  tertiary: "#7B8FE0",        // muted periwinkle (less saturated than before)
  tertiaryWash: "rgba(123,143,224,0.06)",
  
  /* ── Quaternary accent: Vitality Teal (rare use) ── */
  quaternary: "#10B981",      // refined teal
  quaternaryDeep: "#0D9668",
  quaternaryWash: "rgba(16,185,129,0.06)",
  quaternaryHalo: "rgba(16,185,129,0.12)",
  
  /* ── Quinary accent: Subtle Pink (RARE — only for special highlights) ── */
  quinary: "#D946A6",         // muted magenta-pink (much less saturated)
  quinaryDeep: "#B83589",
  quinaryWash: "rgba(217,70,166,0.05)",
  
  /* ── Status indicators (precise, restrained) ── */
  onlineDot: "#10B981",   // teal for positive
  offlineDot: "#E5484D",  // refined red
  badgeRed: "#DC3D43",    // notification badge
  
  /* ── Warning states (soft, professional) ── */
  warnWash: "rgba(229,72,77,0.08)",
  warnInk: "#FFF5F5",
  warnEdge: "rgba(229,72,77,0.18)",
  
  /* ── Success states (vitality) ── */
  successWash: "rgba(16,185,129,0.08)",
  successInk: "#F0FDF8",
  successEdge: "rgba(16,185,129,0.20)",
  
  /* ── Info states (neutral blue) ── */
  infoWash: "rgba(123,143,224,0.08)",
  infoInk: "#F4F6FD",
  infoEdge: "rgba(123,143,224,0.20)",
  
  /* ── Rules & borders (using BLACK opacity for neutrality) ── */
  rule: "rgba(15,15,20,0.08)",         // neutral hairline (NOT colored)
  ruleSoft: "rgba(15,15,20,0.04)",     // very faint grid
  ruleStrong: "rgba(15,15,20,0.14)",   // emphasized divider
  ruleAccent: "rgba(109,91,208,0.16)", // purple accent (used sparingly)
  
  /* ── Glass surfaces (clean white with subtle depth) ── */
  glass: "rgba(255,255,255,0.70)",
  glassStrong: "rgba(255,255,255,0.85)",
  glassDeep: "rgba(250,250,252,0.94)",
  glassTinted: "rgba(248,248,252,0.78)",
  
  /* ── Chips (using BLACK-based fills — not colored) ── */
  chipFill: "rgba(15,15,20,0.04)",       // subtle gray fill
  chipFillHi: "rgba(15,15,20,0.08)",     // hover gray
  chipBorder: "rgba(15,15,20,0.10)",     // neutral border
  chipFillAlt: "rgba(109,91,208,0.06)",  // rare purple chip variant
  
  /* ── Shadows (soft, neutral, professional) ── */
  shadowSm: "0 1px 3px rgba(15,15,20,0.04), 0 1px 2px rgba(15,15,20,0.06)",
  shadowMd: "0 4px 12px rgba(15,15,20,0.06), 0 2px 4px rgba(15,15,20,0.04)",
  shadowLg: "0 12px 32px rgba(15,15,20,0.08), 0 4px 8px rgba(15,15,20,0.04)",
  shadowXl: "0 24px 56px rgba(15,15,20,0.10), 0 8px 16px rgba(15,15,20,0.06)",
  
  /* ── Glow effects (subtle purple, NOT loud pink) ── */
  glow: [
    "0 0 24px rgba(109,91,208,0.14)",    // soft purple glow
    "0 0 48px rgba(109,91,208,0.06)",    // diffuse purple
  ],
  shimmer: [
    "-0.5px 0 0 rgba(109,91,208,0.18)",  // subtle purple chromatic
    "0.5px 0 0 rgba(123,143,224,0.18)",  // subtle blue chromatic
    "0 0 20px rgba(109,91,208,0.10)",    // soft center glow
  ],
  
  /* ── Specialized glows ── */
  glowTeal: [
    "0 0 16px rgba(16,185,129,0.18)",
    "0 0 32px rgba(16,185,129,0.08)",
  ],
  glowCoral: [
    "0 0 16px rgba(217,70,166,0.18)",    // muted magenta (was pink)
    "0 0 32px rgba(217,70,166,0.08)",
  ],
  
  /* ── Chart colors (sophisticated, professional) ── */
  chartUp: "#10B981",       // teal-green
  chartDown: "#E5484D",     // refined red
  chartNeutral: "rgba(15,15,20,0.40)", // black opacity for neutral
  chartVolume: "#6D5BD0",   // purple for volume
  chartLine: "#7B8FE0",     // periwinkle for trend
  
  /* ── Extended chart palette ── */
  chartSeries1: "#6D5BD0", // primary purple
  chartSeries2: "#7B8FE0", // periwinkle
  chartSeries3: "#10B981", // teal
  chartSeries4: "#8B7FD8", // lavender
  chartSeries5: "#D946A6", // muted pink (rare)
  chartSeries6: "#475569", // slate gray
  
  /* ── Gradient definitions (purple-dominant, refined) ── */
  gradientBrain: ["#6D5BD0", "#8B7FD8", "#7B8FE0"],  // purple→lavender→periwinkle
  gradientWarm: ["#6D5BD0", "#8B7FD8", "#B8A9F0"],   // purple cascade
  gradientCool: ["#7B8FE0", "#6D5BD0", "#5443B5"],   // blue→purple
  gradientVitality: ["#10B981", "#7B8FE0", "#6D5BD0"], // teal→blue→purple
  
  /* ── Particle colors (muted, sophisticated — NOT loud) ── */
  particleColors: [
    "#6D5BD0", // primary purple
    "#8B7FD8", // soft lavender
    "#7B8FE0", // periwinkle
    "#A7B0CC", // gray-blue
    "#B8A9F0", // light purple
    "#10B981", // teal accent (rare)
  ],
  
  /* ── Background gradient stops (clean white) ── */
  gradientStops: [
    "#FAFAFC",
    "#F4F4F8",
    "#EDEDF3",
    "#E5E5ED",
  ],
  
  /* ── Heatmap scale ── */
  heatmapCold: "#7B8FE0",
  heatmapMid: "#6D5BD0",
  heatmapHot: "#5443B5",
  
  /* ── Focus rings (purple but subtle) ── */
  focusRing: "rgba(109,91,208,0.30)",
  focusRingStrong: "rgba(109,91,208,0.45)",
  
  /* ── Overlays ── */
  overlayLight: "rgba(250,250,252,0.70)",
  overlayDark: "rgba(15,15,20,0.50)",
  
  /* ── Skeleton loading ── */
  skeletonBase: "rgba(15,15,20,0.05)",      // neutral gray
  skeletonShimmer: "rgba(109,91,208,0.08)", // subtle purple shimmer
  
  /* ── Interactive state multipliers ── */
  hoverBrightness: 0.95,
  activeBrightness: 0.90,
  disabledOpacity: 0.40,
} as any

/* ═══════════════════════════════════════════════════════════════════════════════════
   THEME 7: OBSIDIAN GLASS — Ultra-Premium Glassmorphic Charcoal (2030)
   
   The MOST DETAILED theme in the entire system. 10x the token complexity of any
   other theme. Inspired by Apple Vision Pro, Linear, and premium cinematic
   dashboards. Heavy glassmorphism, backdrop blur layers, light refraction,
   subtle grain texture, dynamic depth, and atmospheric fog.
   
   Design philosophy:
   - Charcoal/graphite base (NOT pure black — has depth)
   - Heavy frosted glass surfaces with multi-layer blur
   - White/silver typography (NOT bright white — slightly warm)
   - Minimal color: subtle green (online), red (alerts), amber (highlights)
   - Cinematic shadows and light leaks
   - Film grain noise overlay
   - Parallax depth layers
   - Light refraction following cursor
   - Glass edge highlights
   ═══════════════════════════════════════════════════════════════════════════════════ */

export const OBSIDIAN_GLASS: VantaryTheme = {
  id: "obsidian",
  name: "Obsidian Glass",
  description: "Ultra-premium glassmorphic charcoal with cinematic depth and light refraction",
  
  /* ─────────── WORLD BACKGROUNDS (Layered Charcoal Depth) ─────────── */
  ink: "#0A0A0C",            // deep charcoal base (NOT pure black)
  ink2: "#0F0F12",           // slight elevation
  ink3: "#14141A",           // hover/active states
  ink4: "#1A1A22",           // raised surfaces
  ink5: "#202028",           // top elevation
  inkDeep: "#050507",        // deepest shadow recess
  
  /* ─────────── FOREGROUND (Warm Silver Hierarchy) ─────────── */
  paper: "#F5F5F7",                       // warm off-white (Apple-style)
  paperDim: "rgba(245,245,247,0.78)",     // 78% for body
  ash: "rgba(245,245,247,0.55)",          // 55% for labels
  ashSoft: "rgba(245,245,247,0.38)",      // 38% for tertiary
  ashGhost: "rgba(245,245,247,0.20)",     // 20% for disabled
  ashWhisper: "rgba(245,245,247,0.10)",   // barely visible
  
  /* ─────────── PRIMARY: Refined Silver-Steel ─────────── */
  primary: "#C8C8D0",                     // warm silver (main accent)
  primaryDeep: "#A8A8B0",                 // hover state
  primaryInk: "rgba(200,200,208,0.04)",   // ultra-subtle background
  primaryWash: "rgba(200,200,208,0.06)",  // chip fill
  primaryHalo: "rgba(200,200,208,0.12)",  // glow halo
  primaryGlow: "rgba(200,200,208,0.18)",  // active glow
  primaryEdge: "rgba(200,200,208,0.22)",  // border emphasis
  
  /* ─────────── SECONDARY: Cool Slate ─────────── */
  secondary: "#8A8A98",                    // cool slate gray
  secondaryDeep: "#6A6A78",
  secondaryWash: "rgba(138,138,152,0.06)",
  secondaryHalo: "rgba(138,138,152,0.12)",
  
  /* ─────────── TERTIARY: Warm Bronze (rare highlight) ─────────── */
  tertiary: "#B8946A",                     // muted warm bronze
  tertiaryWash: "rgba(184,148,106,0.06)",
  tertiaryHalo: "rgba(184,148,106,0.14)",
  
  /* ─────────── ACCENT: Vital Green (online states) ─────────── */
  accentGreen: "#3DDC84",                   // crisp signal green
  accentGreenDeep: "#2DB868",
  accentGreenWash: "rgba(61,220,132,0.08)",
  accentGreenHalo: "rgba(61,220,132,0.18)",
  accentGreenGlow: "rgba(61,220,132,0.30)",
  
  /* ─────────── ACCENT: Alert Red (warnings) ─────────── */
  accentRed: "#FF4D5E",                     // alert red
  accentRedDeep: "#E63548",
  accentRedWash: "rgba(255,77,94,0.08)",
  accentRedHalo: "rgba(255,77,94,0.18)",
  accentRedGlow: "rgba(255,77,94,0.30)",
  accentRedSheet: "rgba(255,77,94,0.12)",   // for sheet/banner backgrounds
  
  /* ─────────── ACCENT: Amber Highlight (chart focal points) ─────────── */
  accentAmber: "#F2A24A",                   // chart highlight (from screenshots)
  accentAmberDeep: "#D88830",
  accentAmberWash: "rgba(242,162,74,0.08)",
  accentAmberHalo: "rgba(242,162,74,0.18)",
  accentAmberGlow: "rgba(242,162,74,0.30)",
  
  /* ─────────── STATUS INDICATORS ─────────── */
  onlineDot: "#3DDC84",
  offlineDot: "#FF4D5E",
  badgeRed: "#FF4D5E",
  warningTriangle: "#FF4D5E",
  
  /* ─────────── STATE WASHES ─────────── */
  warnWash: "rgba(255,77,94,0.08)",
  warnInk: "rgba(255,77,94,0.04)",
  warnEdge: "rgba(255,77,94,0.20)",
  warnSheet: "linear-gradient(180deg, rgba(255,77,94,0.14) 0%, rgba(255,77,94,0.04) 100%)",
  
  successWash: "rgba(61,220,132,0.08)",
  successInk: "rgba(61,220,132,0.04)",
  successEdge: "rgba(61,220,132,0.22)",
  
  infoWash: "rgba(200,200,208,0.06)",
  infoInk: "rgba(200,200,208,0.03)",
  infoEdge: "rgba(200,200,208,0.18)",
  
  /* ─────────── RULES & BORDERS (Multi-Layer Hairlines) ─────────── */
  rule: "rgba(245,245,247,0.06)",           // standard hairline
  ruleSoft: "rgba(245,245,247,0.03)",       // very faint
  ruleStrong: "rgba(245,245,247,0.10)",     // emphasized
  ruleAccent: "rgba(200,200,208,0.14)",     // accent border
  ruleGlass: "rgba(245,245,247,0.08)",      // glass card edge
  ruleHighlight: "rgba(245,245,247,0.18)",  // top edge highlight (light source)
  ruleShadow: "rgba(0,0,0,0.40)",           // bottom edge shadow
  
  /* ─────────── GLASS SURFACES (THE CORE — 10 Layers) ─────────── */
  glass: "rgba(20,20,26,0.55)",                  // standard frosted glass
  glassStrong: "rgba(20,20,26,0.72)",            // more opaque
  glassDeep: "rgba(20,20,26,0.85)",              // nearly solid
  glassLight: "rgba(40,40,50,0.45)",             // lighter glass (raised)
  glassDark: "rgba(10,10,14,0.65)",              // darker glass (recessed)
  glassTinted: "rgba(30,30,40,0.50)",            // subtle warm tint
  glassPure: "rgba(245,245,247,0.04)",           // very subtle white glass
  glassPureHi: "rgba(245,245,247,0.08)",         // hover white glass
  glassFrost: "rgba(60,60,72,0.30)",             // heavy frost effect
  glassMirror: "rgba(245,245,247,0.06)",         // mirror-like surface
  
  /* ─────────── GLASS BLUR VALUES (CSS backdrop-filter) ─────────── */
  blurSm: "blur(8px) saturate(180%)",
  blurMd: "blur(16px) saturate(180%)",
  blurLg: "blur(24px) saturate(200%)",
  blurXl: "blur(40px) saturate(200%)",
  blur2xl: "blur(60px) saturate(220%)",
  
  /* ─────────── CHIPS (Premium Glass Pills) ─────────── */
  chipFill: "rgba(245,245,247,0.05)",
  chipFillHi: "rgba(245,245,247,0.10)",
  chipFillActive: "rgba(245,245,247,0.14)",
  chipBorder: "rgba(245,245,247,0.10)",
  chipBorderHi: "rgba(245,245,247,0.16)",
  chipFillAlt: "rgba(200,200,208,0.06)",
  chipFillAccent: "rgba(61,220,132,0.10)",  // green online chip
  
  /* ─────────── SHADOWS (Cinematic Depth System) ─────────── */
  shadowSm: "0 1px 3px rgba(0,0,0,0.20), 0 1px 2px rgba(0,0,0,0.30)",
  shadowMd: "0 4px 16px rgba(0,0,0,0.30), 0 2px 4px rgba(0,0,0,0.20)",
  shadowLg: "0 12px 40px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.30)",
  shadowXl: "0 24px 72px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35)",
  shadow2xl: "0 40px 100px rgba(0,0,0,0.65), 0 16px 40px rgba(0,0,0,0.40)",
  shadowInner: "inset 0 1px 2px rgba(0,0,0,0.30), inset 0 -1px 1px rgba(245,245,247,0.05)",
  shadowGlow: "0 0 40px rgba(200,200,208,0.10), 0 0 80px rgba(200,200,208,0.05)",
  
  /* ─────────── GLASS EDGE HIGHLIGHTS (Top-down light source) ─────────── */
  edgeTop: "linear-gradient(180deg, rgba(245,245,247,0.12) 0%, transparent 50%)",
  edgeTopStrong: "linear-gradient(180deg, rgba(245,245,247,0.20) 0%, transparent 40%)",
  edgeLeft: "linear-gradient(90deg, rgba(245,245,247,0.08) 0%, transparent 30%)",
  edgeBottom: "linear-gradient(0deg, rgba(0,0,0,0.30) 0%, transparent 40%)",
  
  /* ─────────── GLOW EFFECTS (Subtle, Sophisticated) ─────────── */
  glow: [
    "0 0 24px rgba(200,200,208,0.10)",
    "0 0 48px rgba(200,200,208,0.05)",
    "0 0 96px rgba(200,200,208,0.02)",
  ],
  shimmer: [
    "-0.5px 0 0 rgba(245,245,247,0.20)",
    "0.5px 0 0 rgba(200,200,208,0.20)",
    "0 0 20px rgba(245,245,247,0.08)",
  ],
  glowGreen: [
    "0 0 16px rgba(61,220,132,0.30)",
    "0 0 32px rgba(61,220,132,0.15)",
    "0 0 64px rgba(61,220,132,0.06)",
  ],
  glowRed: [
    "0 0 16px rgba(255,77,94,0.30)",
    "0 0 32px rgba(255,77,94,0.15)",
    "0 0 64px rgba(255,77,94,0.06)",
  ],
  glowAmber: [
    "0 0 16px rgba(242,162,74,0.30)",
    "0 0 32px rgba(242,162,74,0.15)",
  ],
  
  /* ─────────── CHART COLORS (Monochrome with single highlight) ─────────── */
  chartUp: "#3DDC84",
  chartDown: "#FF4D5E",
  chartNeutral: "rgba(245,245,247,0.40)",
  chartVolume: "rgba(245,245,247,0.20)",
  chartLine: "rgba(245,245,247,0.60)",
  chartHighlight: "#F2A24A",  // amber focal point (from screenshot)
  chartGrid: "rgba(245,245,247,0.04)",
  
  /* ─────────── EXTENDED CHART PALETTE ─────────── */
  chartSeries1: "rgba(245,245,247,0.85)",
  chartSeries2: "rgba(245,245,247,0.55)",
  chartSeries3: "rgba(245,245,247,0.35)",
  chartSeries4: "#F2A24A",
  chartSeries5: "#3DDC84",
  chartSeries6: "#FF4D5E",
  
  /* ─────────── GRADIENTS (Cinematic) ─────────── */
  gradientObsidian: ["#0A0A0C", "#14141A", "#0A0A0C"],
  gradientSilver: ["#C8C8D0", "#8A8A98", "#C8C8D0"],
  gradientFog: ["rgba(20,20,26,0.0)", "rgba(20,20,26,0.6)", "rgba(20,20,26,1.0)"],
  gradientLight: ["rgba(245,245,247,0.12)", "rgba(245,245,247,0.04)", "transparent"],
  gradientWarm: ["#0A0A0C", "#1A1612", "#0A0A0C"],  // very subtle warm tint
  
  /* ─────────── PARTICLE SYSTEM (Subtle floating glass dust) ─────────── */
  particleColors: [
    "rgba(245,245,247,0.40)",
    "rgba(245,245,247,0.25)",
    "rgba(200,200,208,0.30)",
    "rgba(245,245,247,0.15)",
    "rgba(184,148,106,0.20)",
    "rgba(245,245,247,0.10)",
  ],
  
  /* ─────────── BACKGROUND GRADIENT STOPS ─────────── */
  gradientStops: ["#0A0A0C", "#0F0F12", "#14141A", "#0F0F12", "#0A0A0C"],
  
  /* ─────────── HEATMAP ─────────── */
  heatmapCold: "rgba(245,245,247,0.20)",
  heatmapMid: "rgba(245,245,247,0.50)",
  heatmapHot: "#F2A24A",
  
  /* ─────────── FOCUS RINGS ─────────── */
  focusRing: "rgba(200,200,208,0.40)",
  focusRingStrong: "rgba(245,245,247,0.60)",
  
  /* ─────────── OVERLAYS ─────────── */
  overlayLight: "rgba(20,20,26,0.30)",
  overlayDark: "rgba(0,0,0,0.70)",
  overlayBackdrop: "rgba(10,10,14,0.85)",
  overlayFog: "rgba(20,20,26,0.40)",
  
  /* ─────────── SKELETON LOADING ─────────── */
  skeletonBase: "rgba(245,245,247,0.04)",
  skeletonShimmer: "rgba(245,245,247,0.12)",
  
  /* ─────────── NOISE / GRAIN TEXTURE OPACITY ─────────── */
  grainOpacity: 0.04,
  
  /* ─────────── INTERACTIVE STATE MULTIPLIERS ─────────── */
  hoverBrightness: 1.08,    // brighten on hover
  activeBrightness: 0.95,   // dim slightly when pressed
  disabledOpacity: 0.40,
  
  /* ─────────── ANIMATION TIMING (Premium Curves) ─────────── */
  durationFast: "150ms",
  durationMd: "300ms",
  durationSlow: "600ms",
  durationCinematic: "1200ms",
  
  /* ─────────── SCROLLBAR STYLING ─────────── */
  scrollTrack: "rgba(20,20,26,0.40)",
  scrollThumb: "rgba(245,245,247,0.20)",
  scrollThumbHover: "rgba(245,245,247,0.35)",
  
  /* ─────────── MAP-LIKE OVERLAYS (inspired by satellite map screenshot) ─────────── */
  mapMaskLight: "rgba(20,20,26,0.20)",
  mapMaskDark: "rgba(10,10,14,0.65)",
  mapPathStroke: "rgba(245,245,247,0.85)",
  mapPathStrokeDim: "rgba(245,245,247,0.45)",
  mapPathDash: "rgba(245,245,247,0.65)",
  
  /* ─────────── PULSE & RIPPLE COLORS ─────────── */
  pulseRing: "rgba(245,245,247,0.40)",
  pulseRingDim: "rgba(245,245,247,0.15)",
  rippleColor: "rgba(245,245,247,0.20)",
} as any

/* ── Theme Registry ── */
export const ALL_THEMES: Record<ThemeId, VantaryTheme> = {
  teal: TEAL_GLASS,
  cyber: CYBER_NEON,
  neural: NEURAL_DARK,
  quantum: QUANTUM_GREEN,
  solar: SOLAR_FUSION,
  light: NEURAL_LIGHT,
  obsidian: OBSIDIAN_GLASS,
}

/* ── Helper to get theme by ID ── */
export function getTheme(id: ThemeId): VantaryTheme {
  return ALL_THEMES[id]
}

/* ── Radii (consistent across all themes) ── */
export const RADIUS_V = {
  card: "20px",
  cardLg: "24px",
  inner: "14px",
  chip: "10px",
  pill: "999px",
} as const

/* ── Easing curve ── */
export const EASE_V = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

/* ── Hairline stroke width ── */
export const HAIR = 1

/* ── Dashed grid pattern ── */
export const DASH = "4 6"
