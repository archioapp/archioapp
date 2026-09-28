/* ════════════════════════════════════════════════════════════════════════
 *  JARVIS · BARREL
 *  ─────────────────────────────────────────────────────────────────────
 *  Single import surface for everything JARVIS. Consumers should
 *  ALWAYS import from this barrel, never from the individual files.
 *  This keeps refactoring (e.g. splitting `jarvis-text.tsx` into two
 *  files later) invisible to consumers.
 *
 *  Pattern:
 *    import { Tx, TxEyebrow, TxHeadline, BandRule, JARVIS_TX } from "../jarvis"
 * ════════════════════════════════════════════════════════════════════════ */

/* — TOKENS (the foundation) ────────────────────────────────────────── */
export {
  JARVIS_TX,
  JARVIS_WEIGHT,
  JARVIS_TONE,
  JARVIS_RULE,
  JARVIS_RHYTHM,
  JARVIS_MOTION,
  JARVIS_CADENCE,
  JARVIS_Z,
  jarvisTextStyle,
  jarvisRuleStyle,
  jarvisMotionTransition,
  // Surface helpers — promoted into the foundation so every surface
  // that renders a delta or a hero numeral reads from ONE source.
  jarvisToneFor,
  splitMagnitude,
} from "./jarvis-tokens"
export type {
  JarvisTxToken,
  JarvisTxName,
  JarvisToneName,
  JarvisWeightName,
  JarvisRuleToken,
  JarvisRuleName,
  JarvisRhythmName,
  JarvisMotionToken,
  JarvisMotionName,
  JarvisCadenceName,
  JarvisZName,
} from "./jarvis-tokens"

/* — TEXT PRIMITIVES ────────────────────────────────────────────────── */
export {
  Tx,
  TxEyebrow,
  TxCaption,
  TxBody,
  TxValue,
  TxHeadline,
} from "./jarvis-text"
export type { TxProps } from "./jarvis-text"

/* — RULE PRIMITIVES ────────────────────────────────────────────────── */
export {
  Rule,
  BandRule,
  CellRule,
} from "./jarvis-rule"
export type { RuleProps } from "./jarvis-rule"

/* — SURFACES ────────────────────────────────────────────────────────────
 *  Each surface is a self-contained zone of a Jarvis card. Surfaces
 *  consume the tokens + primitives above and expose a minimal data
 *  contract to the host card. They do NOT own data fetching, period
 *  state, or persistence — those concerns live in the host (e.g.
 *  EquityVolumeInline) and are passed in as props.
 *
 *  Surface 1 — EquityProtagonistBand. The headline + delta + spark
 *              for the Live Equity Volume card. Idle / awakened /
 *              engaged states. Width-aware via ResizeObserver.
 * ──────────────────────────────────────────────────────────────────── */
export { EquityProtagonistBand } from "./surfaces/equity-protagonist-band"
export type { EquityProtagonistBandProps } from "./surfaces/equity-protagonist-band"

/* Surface 2 — Pulse Strip. Auto-rotating two-cell editorial rail.
 *  The card's customize panel writes its rotation list. */
export { EquityPulseStrip } from "./surfaces/equity-pulse-strip"
export type {
  EquityPulseStripProps,
  PulsePair,
  PulseCell,
} from "./surfaces/equity-pulse-strip"

/* Surface 3 — Period Spine. Replaces the period-tab strip + duplicate
 *  cadence stamp + microspark with a single editorial line. */
export { EquityPeriodSpine } from "./surfaces/equity-period-spine"
export type {
  EquityPeriodSpineProps,
  PeriodEntry,
} from "./surfaces/equity-period-spine"

/* Surface 4 — Story Panel. Single-protagonist rotating story rectangle.
 *  Replaces the three stacked below-fold modules. */
export { StoryPanel } from "./surfaces/story-panel"
export type {
  StoryPanelProps,
  StoryEntry,
} from "./surfaces/story-panel"

/* Surface 5 — Quiet Layer. Heartbeat dot + last-update label. */
export { QuietLayer } from "./surfaces/quiet-layer"
export type {
  QuietLayerProps,
  QuietLayerState,
} from "./surfaces/quiet-layer"

/* Hover-reveal sub-surface — Portfolio Composition.
 *  Rendered inside the Protagonist Band's awakened reveal. Answers
 *  "what makes up this number" in editorial typography (no charts). */
export { EquityPortfolioComposition } from "./surfaces/equity-portfolio-composition"
export type {
  EquityPortfolioCompositionProps,
  AccountCompositionRow,
  AccountKind,
} from "./surfaces/equity-portfolio-composition"

/* Inline Card Customize Panel — dropdown-free editorial customize. */
export {
  CardCustomizePanel,
  CustomizeSection,
  CustomizePill,
  CustomizeToggle,
} from "./surfaces/card-customize-panel"
export type {
  CardCustomizePanelProps,
  CustomizeSectionProps,
  CustomizePillProps,
  CustomizeToggleProps,
} from "./surfaces/card-customize-panel"
