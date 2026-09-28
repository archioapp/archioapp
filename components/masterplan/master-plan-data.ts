/**
 * MASTERPLAN — pillar data (DETAILED PASS v2)
 * ────────────────────────────────────────────────────────────────────────
 * Five pillars derived from `v0_plans/light-scope.md` (My Record — Masterplan v2).
 * Each pillar is one vertex of the pentagram. The center hub is the
 * "north star" of the plan.
 *
 * v2 multiplies the editorial detail of every pillar without touching its
 * visual contract:
 *   · `phase`         — rollout phase (1, 2 or 3) for the phase ribbon
 *   · `subNodes`      — three sub-elements that orbit the active vertex
 *   · `dependencies`  — PillarKey[] read by the dependency-arc layer
 *   · `risks`         — 3 risks per pillar with severity for the risk band
 *   · `workedExample` — before/after micro-snippet for the example panel
 *   · `kpiDelta`      — single hero metric the pillar moves
 *
 * The visual layer reads only from this file (single source of truth).
 */

import type { LucideIcon } from "lucide-react"
import {
  Target,
  BarChart3,
  Compass,
  Gauge,
  Wrench,
  Layers,
  Hash,
  Crosshair,
  Activity,
  ListChecks,
  ScanSearch,
  TrendingUp,
  Scale,
  Sigma,
  Eye,
  ShieldCheck,
  GitBranch,
  Boxes,
} from "lucide-react"

export type PillarKey = "goal" | "distribution" | "instruments" | "calibration" | "execution"

export type LedgerEntry = {
  /** Mono caps left-side label. */
  label: string
  /** Right-side value (mixed mono/sans, tabular-nums). */
  value: string
  /** Optional sub-line shown under the value. */
  sub?: string
  /** Optional accent color key — `emerald` for positive proof, `rose`
   *  for warning/loss, `amber` for the protagonist anchor. Default is
   *  paper. */
  tone?: "emerald" | "rose" | "amber" | "paper"
}

/** Sub-node — small satellite orbiting the active vertex. Each pillar
 *  has exactly three (a clean trefoil layout). The visual layer reads
 *  `tag` for the chip text and uses `icon` for the orbital glyph. */
export type SubNode = {
  tag: string
  /** One-line description used in the detail panel mirror. */
  desc: string
  icon: LucideIcon
}

/** Risk — single concrete failure mode for the pillar with a severity
 *  level the visual rail color-codes. */
export type Risk = {
  label: string
  /** Short clarifier — what triggers the risk and what neutralises it. */
  note: string
  severity: "low" | "medium" | "high"
}

/** Worked example — before/after micro-narrative shown in the panel
 *  as a tiny ledger comparison. Every value is a string so the visual
 *  layer never needs to format. */
export type WorkedExample = {
  before: { label: string; value: string }
  after: { label: string; value: string }
  delta: { label: string; value: string }
  caption: string
}

/** Single hero KPI delta — the one number this pillar moves the most.
 *  Rendered as a top strip on the detail panel. */
export type KpiDelta = {
  metric: string
  before: string
  after: string
  improvement: string
  tone: "emerald" | "amber" | "rose"
}

export type Pillar = {
  key: PillarKey
  /** Vertex order on the pentagram (0 = top, clockwise). */
  vertex: 0 | 1 | 2 | 3 | 4
  /** Lucide icon rendered inside the node disc. */
  icon: LucideIcon
  /** Rollout phase — 1 (foundation), 2 (cards), 3 (integration). */
  phase: 1 | 2 | 3
  /** Small mono caps band — sits as the eyebrow on the node card AND
   *  on the detail panel header. */
  eyebrow: string
  /** Single-word identity (used as the floating tag near the vertex). */
  tag: string
  /** Editorial title — the headline of the detail panel. */
  title: string
  /** Italic 1-line story/verdict shown below the title. */
  summary: string
  /** Big two-weight protagonist value. */
  headline: [lead: string, tail: string]
  /** Small chip strip beneath the headline. */
  tags: string[]
  /** Mono caps thesis statement — one paragraph max, no fluff. */
  thesis: string
  /** Pillars this one depends on — drawn as inbound arcs in the star
   *  when this pillar is active. Order matters: first listed renders
   *  with the strongest stroke. */
  dependencies: PillarKey[]
  /** 3 sub-nodes — render as satellites around the active vertex. */
  subNodes: [SubNode, SubNode, SubNode]
  /** 3 risks — render as a hairline rail in the detail panel. */
  risks: [Risk, Risk, Risk]
  /** Worked example for the detail panel — concrete before/after. */
  workedExample: WorkedExample
  /** Hero KPI delta strip at the top of the detail panel. */
  kpiDelta: KpiDelta
  /** Left ledger composition (3 rows). */
  leftLedger: LedgerEntry[]
  /** Right ledger composition (3 rows). */
  rightLedger: LedgerEntry[]
  /** Action bullets (max 6) for the central column of the detail panel. */
  actions: string[]
  /** Optional micro-bar values, [0..100] each. */
  rail?: { label: string; value: number; tone: "emerald" | "amber" | "rose" }[]
}

/* ── PILLAR DEFINITIONS ───────────────────────────────────────────────
 * Vertex order is clockwise starting from top:
 *   0 → 12:00 GOAL
 *   1 →  2:30 DISTRIBUTION
 *   2 →  5:00 INSTRUMENTS
 *   3 →  7:00 CALIBRATION
 *   4 →  9:30 EXECUTION
 */
export const PILLARS: Pillar[] = [
  {
    key: "goal",
    vertex: 0,
    icon: Target,
    phase: 1,
    eyebrow: "GOAL · NORTH STAR",
    tag: "Goal",
    title: "Replace the equity curve with three decision-grade analytics",
    summary:
      "The cumulative-R sparkline is table stakes — every dashboard ships one. We replace it with three protagonist cards that drive trader decisions.",
    headline: ["3", "deep dives"],
    tags: ["Replaces equity curve", "Protagonist scale", "One story per card"],
    thesis:
      "A masterplan is a story, not a checklist. The dashboard reads top-to-bottom: matrix → distribution → instruments → calibration → momentum → mentors → milestones. Each protagonist card is one paragraph in that story.",
    dependencies: [],
    subNodes: [
      { tag: "Distribution", desc: "Card 1 — wins, losses & R-buckets", icon: BarChart3 },
      { tag: "Edge", desc: "Card 2 — per-instrument edge profile", icon: Compass },
      { tag: "Calibration", desc: "Card 3 — reliability diagram", icon: Gauge },
    ],
    risks: [
      {
        label: "Scope creep",
        note: "Drift into BriefingMatrix or RecordSpec — kept off-limits in plan.",
        severity: "medium",
      },
      {
        label: "Story arc fracture",
        note: "Three new cards must read top→bottom in narrative order, not visual order.",
        severity: "high",
      },
      {
        label: "Information loss",
        note: "Equity curve carries cumulative-R memory — re-thread it into Distribution footer.",
        severity: "low",
      },
    ],
    workedExample: {
      before: { label: "Sparkline", value: "180px curve · cumulative R" },
      after: { label: "Three cards", value: "390px each · paragraph per card" },
      delta: { label: "Information density", value: "+ 6.5×" },
      caption: "One sparkline becomes a three-paragraph story without inflating the page.",
    },
    kpiDelta: {
      metric: "Decision signal density",
      before: "1 chart",
      after: "3 protagonist cards",
      improvement: "+200% paragraphs per scroll",
      tone: "amber",
    },
    leftLedger: [
      { label: "REPLACES", value: "Equity Curve", sub: "small sparkline" },
      { label: "ALSO REPLACES", value: "Outcome Ring", sub: "old donut" },
      { label: "ALSO REPLACES", value: "Calibration", sub: "old bands list" },
    ],
    rightLedger: [
      { label: "PROTAGONISTS", value: "3", sub: "deep-dive cards", tone: "amber" },
      { label: "AVG HEIGHT", value: "~390px", sub: "from ~180px" },
      { label: "FILE SCOPE", value: "1", sub: "forecast-my-record.tsx" },
    ],
    actions: [
      "Read PopulatedRecord layout end-to-end.",
      "Identify the cards being removed: EquityCurveCard, OutcomeRingCard, CalibrationCard.",
      "Confirm BriefingMatrix, MomentumGridCard, MentorLedger, MilestonePathCard stay untouched.",
      "Confirm RecordData shape stays unchanged — we derive locally per card.",
    ],
    rail: [
      { label: "Story arc", value: 92, tone: "emerald" },
      { label: "Protagonist scale", value: 88, tone: "amber" },
      { label: "Decision impact", value: 84, tone: "amber" },
    ],
  },
  {
    key: "distribution",
    vertex: 1,
    icon: BarChart3,
    phase: 1,
    eyebrow: "OUTCOME · DISTRIBUTION",
    tag: "Distribution",
    title: "Where wins and losses come from",
    summary:
      "Win-day rate of 70% with average +0.78R per active day means your bad days don't undo your good ones.",
    headline: ["120", "verified"],
    tags: ["3-col composition", "Paired bars", "R-bucket profile"],
    thesis:
      "A win rate is not a story — a distribution is. Wins, losses, expired, void; +3R / +2R / +1R / −1R buckets. Reads as: how often, how big, how clean.",
    dependencies: ["goal"],
    subNodes: [
      { tag: "R-buckets", desc: "+3R / +2R / +1R / −1R distribution", icon: Hash },
      { tag: "Paired bars", desc: "Wins emerald · losses rose · paired", icon: Activity },
      { tag: "Day streaks", desc: "Win-day rate · average R / day", icon: TrendingUp },
    ],
    risks: [
      {
        label: "Paired bars cramp",
        note: "Below 360px width the W/L pair illegible — clamp container.",
        severity: "medium",
      },
      {
        label: "Bucket imbalance",
        note: "Few +3R wins relative to +1R distorts horizontal scale; cap visually.",
        severity: "low",
      },
      {
        label: "Footer overflow",
        note: "5-stat strip BEST/WORST/AVG/WIN-DAY/STREAK overflows on narrow.",
        severity: "low",
      },
    ],
    workedExample: {
      before: { label: "Outcome ring", value: "Wins 74% · single donut" },
      after: { label: "Distribution paragraph", value: "89W · 31L · 14 active · 6 expired" },
      delta: { label: "Granularity", value: "+ 4× categories" },
      caption: "A donut doesn't tell you whether wins came clean or messy. A distribution does.",
    },
    kpiDelta: {
      metric: "Outcome categories surfaced",
      before: "2 (W/L)",
      after: "8 (W/L/Active/Void + 4 R-buckets)",
      improvement: "+300% category coverage",
      tone: "emerald",
    },
    leftLedger: [
      { label: "WINS", value: "89", sub: "74.2%", tone: "emerald" },
      { label: "LOSSES", value: "31", sub: "25.8%", tone: "rose" },
      { label: "ACTIVE", value: "14", sub: "live now" },
    ],
    rightLedger: [
      { label: "+3R+", value: "8", sub: "wins", tone: "emerald" },
      { label: "+2R", value: "21", sub: "wins", tone: "emerald" },
      { label: "+1R", value: "60", sub: "wins" },
    ],
    actions: [
      "Build paired horizontal bar set — wins emerald, losses rose, others slate.",
      "Add R-bucket ledger on the right (+3R / +2R / +1R / −1R).",
      "Footer strip: BEST DAY · WORST DAY · AVG/DAY · WIN DAYS · STREAK.",
      "Italic verdict: win-day rate ties bad days into good ones.",
    ],
    rail: [
      { label: "Win-day rate", value: 70, tone: "emerald" },
      { label: "Avg R / active day", value: 78, tone: "amber" },
      { label: "Streak strength", value: 82, tone: "emerald" },
    ],
  },
  {
    key: "instruments",
    vertex: 2,
    icon: Compass,
    phase: 2,
    eyebrow: "INSTRUMENT · EDGE",
    tag: "Instruments",
    title: "Which pairs you actually have an edge on",
    summary:
      "EURUSD is your strongest channel — 81.5% accuracy with 1:2.1 payoff. Three instruments at 70%+ edge means concentration is justified.",
    headline: ["78", "edge score"],
    tags: ["Sparkbar grid", "Strongest / weakest", "Click-to-expand rows"],
    thesis:
      "A tradable edge is per-instrument, not aggregated. Show the strongest pair card, the weakest pair warning, and a sparkbar grid of every instrument with the 50% baseline tick visible.",
    dependencies: ["goal", "distribution"],
    subNodes: [
      { tag: "Strongest", desc: "Pair card · win-rate · R:R · best setup", icon: Crosshair },
      { tag: "Sparkbar grid", desc: "All pairs · 50% baseline · gradient ramp", icon: Layers },
      { tag: "Weakest", desc: "Pause-or-reduce warning · severity dot", icon: ScanSearch },
    ],
    risks: [
      {
        label: "Sparse instruments",
        note: "Fewer than 5 pairs traded → grid feels thin; show all and pad.",
        severity: "medium",
      },
      {
        label: "Sample-size gating",
        note: "Pairs with < 8 trades hidden by default — provide opt-in toggle.",
        severity: "high",
      },
      {
        label: "Wrong gradient cutoffs",
        note: "Rose 0–50, amber 50–70, emerald 70+ — drifting these breaks the read.",
        severity: "low",
      },
    ],
    workedExample: {
      before: { label: "Aggregate edge", value: "Win-rate 74% across all pairs" },
      after: { label: "Per-instrument edge", value: "EURUSD 81.5% · GBPJPY 55% — pause" },
      delta: { label: "Decision actionability", value: "+ pair-level routing" },
      caption: "Aggregate hides where you actually print money. Per-pair tells you where to size up.",
    },
    kpiDelta: {
      metric: "Instrument-level visibility",
      before: "0 (aggregated)",
      after: "5 ranked + sparkbar",
      improvement: "Pair-level edge surfaced",
      tone: "emerald",
    },
    leftLedger: [
      { label: "STRONGEST", value: "EURUSD", sub: "edge 78", tone: "emerald" },
      { label: "WIN RATE", value: "81.5%", sub: "London Open" },
      { label: "PAYOFF", value: "1:2.1", sub: "R:R" },
    ],
    rightLedger: [
      { label: "WEAKEST", value: "GBPJPY", sub: "edge 42", tone: "rose" },
      { label: "WIN RATE", value: "55.0%", sub: "below threshold" },
      { label: "ACTION", value: "Pause", sub: "or reduce size" },
    ],
    actions: [
      "Sparkbar gradient: rose 0–50, amber 50–70, emerald 70–100.",
      "Header row: PAIR · TYPE · TRADES · WIN-RATE · R:R · EDGE · BEST SETUP.",
      "Click row → expands to full breakdown (current expansion logic kept).",
      "Footer: ASSETS · STRONG · NEUTRAL · WEAK · TOTAL TRADES.",
    ],
    rail: [
      { label: "EURUSD", value: 78, tone: "emerald" },
      { label: "XAUUSD", value: 71, tone: "emerald" },
      { label: "NAS100", value: 68, tone: "amber" },
      { label: "USDJPY", value: 54, tone: "amber" },
      { label: "GBPJPY", value: 42, tone: "rose" },
    ],
  },
  {
    key: "calibration",
    vertex: 3,
    icon: Gauge,
    phase: 2,
    eyebrow: "CONVICTION · CALIBRATION",
    tag: "Calibration",
    title: "Does your stated confidence match reality",
    summary:
      "When you say 70%, you're right 71% of the time — well-calibrated. Tight calibration at 70% means your conviction is signal, not noise.",
    headline: ["0.82", "index"],
    tags: ["Reliability diagram", "Bias gauge", "Per-band ledger"],
    thesis:
      "Conviction calibration is the most honest meta-metric a trader has. Plot stated vs actual on a 50–90% diagonal. Sized dots by sample count. Italic verdict identifies the band to size up on.",
    dependencies: ["distribution", "instruments"],
    subNodes: [
      { tag: "Reliability", desc: "X stated 50–90% · Y actual · diagonal ref", icon: Activity },
      { tag: "Bias gauge", desc: "Over / perfect / under verdict", icon: Scale },
      { tag: "Per-band", desc: "5 rows · SAID · ACTUAL · ±delta", icon: ListChecks },
    ],
    risks: [
      {
        label: "Sample-size noise",
        note: "Bands with < 10 samples wobble the diagonal — flag visually.",
        severity: "high",
      },
      {
        label: "SVG geometry drift",
        note: "Reliability diagram is hand-coded SVG — viewBox math must be exact.",
        severity: "medium",
      },
      {
        label: "Dot collision",
        note: "Adjacent stated bands at similar accuracies overlap — dodge by ±2px.",
        severity: "low",
      },
    ],
    workedExample: {
      before: { label: "Calibration list", value: "5 bands · text-only ±delta" },
      after: { label: "Reliability diagram", value: "Plot · diagonal ref · sized dots" },
      delta: { label: "Pattern visibility", value: "+ instant verdict" },
      caption: "A list is parsed; a diagonal is read. Pattern recognition replaces deltas.",
    },
    kpiDelta: {
      metric: "Calibration readability",
      before: "List of 5",
      after: "Reliability plot",
      improvement: "Diagonal seen in 1 glance",
      tone: "amber",
    },
    leftLedger: [
      { label: "AVG STATED", value: "71%", sub: "claimed conviction" },
      { label: "AVG ACTUAL", value: "73%", sub: "realised hits" },
      { label: "DELTA", value: "+2", sub: "slightly under-confident", tone: "amber" },
    ],
    rightLedger: [
      { label: "INDEX", value: "0.82", sub: "well-calibrated", tone: "amber" },
      { label: "PERFECT BANDS", value: "2 / 5", sub: "70% · 80%", tone: "emerald" },
      { label: "SAMPLES", value: "133", sub: "audited", tone: "paper" },
    ],
    actions: [
      "Reliability diagram: x-axis stated 50→90%, y-axis actual 0→100%, diagonal reference.",
      "Plot 5 dots, each sized by sample count, connected by amber line.",
      "Right ledger: 5 rows · SAID · ACTUAL · ±delta with color chips.",
      "Footer: INDEX · OVER · UNDER · PERFECT · SAMPLES.",
    ],
    rail: [
      { label: "50%", value: 52, tone: "amber" },
      { label: "60%", value: 58, tone: "amber" },
      { label: "70%", value: 71, tone: "emerald" },
      { label: "80%", value: 79, tone: "emerald" },
      { label: "90%", value: 86, tone: "rose" },
    ],
  },
  {
    key: "execution",
    vertex: 4,
    icon: Wrench,
    phase: 3,
    eyebrow: "EXECUTION · BUILD ORDER",
    tag: "Execution",
    title: "Build order, design language, and out-of-scope guardrails",
    summary:
      "One file in scope. Six new shared primitives. Eight steps. Type-check at the end. Visual smoke check confirms protagonist scale.",
    headline: ["8", "steps"],
    tags: ["1 file scope", "6 shared primitives", "tsc clean"],
    thesis:
      "Editorial scope discipline: one file, six primitives, three new cards, three deletions. Don't touch BriefingMatrix, MomentumGridCard, MentorLedger, MilestonePathCard, or RecordData.",
    dependencies: ["goal", "distribution", "instruments", "calibration"],
    subNodes: [
      { tag: "Primitives", desc: "6 shared at top of file", icon: Boxes },
      { tag: "New cards", desc: "Distribution · Edge · Calibration", icon: Layers },
      { tag: "Smoke check", desc: "tsc clean + visual scale audit", icon: ShieldCheck },
    ],
    risks: [
      {
        label: "Primitive collision",
        note: "Shared names clash with existing exports — namespace under MR_ prefix if needed.",
        severity: "high",
      },
      {
        label: "Type errors",
        note: "RecordData inference fails on derived fields — pass explicit RecordData type.",
        severity: "medium",
      },
      {
        label: "Scale audit miss",
        note: "Cards rendered at <320px height = not protagonist; must hit ~390px each.",
        severity: "medium",
      },
    ],
    workedExample: {
      before: { label: "Old layout", value: "3 small cards · ~180px each" },
      after: { label: "New layout", value: "3 protagonist cards · ~390px each" },
      delta: { label: "Vertical real estate", value: "+ ~210px / card" },
      caption: "Bigger cards, fewer cards, more story per scroll.",
    },
    kpiDelta: {
      metric: "Card height",
      before: "~180px",
      after: "~390px",
      improvement: "+ 117% (protagonist)",
      tone: "amber",
    },
    leftLedger: [
      { label: "PRIMITIVES", value: "6", sub: "shared, scoped to file", tone: "amber" },
      { label: "NEW CARDS", value: "3", sub: "Distribution · Edge · Calibration" },
      { label: "DELETIONS", value: "3", sub: "after usage removed", tone: "rose" },
    ],
    rightLedger: [
      { label: "FILE", value: "forecast-my-record.tsx", sub: "single source of change" },
      { label: "TYPE-CHECK", value: "tsc --noEmit", sub: "zero errors required", tone: "emerald" },
      { label: "OUT OF SCOPE", value: "BriefingMatrix +3", sub: "language already matches" },
    ],
    actions: [
      "Add 6 shared primitives at top of file (after LedgerRow, before EquityCurveCard).",
      "Build DistributionDeepDive — uses OutcomeRingCard data + new R-bucket bins.",
      "Build InstrumentEdgeDeepDive — wraps current expand logic in 3-col shell.",
      "Build ConvictionCalibrationDeepDive — adds reliability diagram (SVG 600×180).",
      "Update PopulatedRecord layout — remove old cards, mount three new full-width.",
      "Run tsc --noEmit; visual smoke check at protagonist scale.",
    ],
    rail: [
      { label: "Step 1 — primitives", value: 100, tone: "emerald" },
      { label: "Step 2 — distribution", value: 60, tone: "amber" },
      { label: "Step 3 — instruments", value: 40, tone: "amber" },
      { label: "Step 4 — calibration", value: 25, tone: "amber" },
      { label: "Step 5 — relayout", value: 0, tone: "rose" },
    ],
  },
]

/** Out-of-scope rail — rendered as a hairline ledger strip at the
 *  bottom of the page so the boundaries are visually loud. */
export const OUT_OF_SCOPE: { label: string; reason: string }[] = [
  { label: "BriefingMatrix", reason: "language already matches" },
  { label: "RecordSpecHeadline", reason: "preserved" },
  { label: "MomentumGridCard", reason: "kept full-width" },
  { label: "MentorLedger", reason: "kept" },
  { label: "MilestonePathCard", reason: "kept" },
  { label: "RecordData shape", reason: "no new fields" },
  { label: "Empty state", reason: "untouched" },
]

/** Center-hub stat strip — the always-visible scoreboard above the star. */
export const HUB_STATS: { label: string; value: string; tone?: "amber" | "emerald" }[] = [
  { label: "PROTAGONIST CARDS", value: "3", tone: "amber" },
  { label: "FILE SCOPE", value: "1" },
  { label: "PRIMITIVES", value: "6", tone: "amber" },
  { label: "STEPS", value: "8" },
  { label: "OUT-OF-SCOPE", value: "7", tone: "emerald" },
]

/* ── PHASES — rollout sequencer ──────────────────────────────────────
 * Three phases that gate the build. Each lists which pillars belong
 * to it and a short editorial caption. The phase ribbon above the
 * star reads from this constant.
 */
export type Phase = {
  index: 1 | 2 | 3
  label: string
  caption: string
  /** Pillars assigned to this phase. */
  pillars: PillarKey[]
  /** Mock progress 0..100 for the phase strip's progress bar. */
  progress: number
}

export const PHASES: Phase[] = [
  {
    index: 1,
    label: "Foundations",
    caption: "Set the goal, prove the distribution.",
    pillars: ["goal", "distribution"],
    progress: 100,
  },
  {
    index: 2,
    label: "Cards",
    caption: "Build per-instrument edge & conviction calibration.",
    pillars: ["instruments", "calibration"],
    progress: 55,
  },
  {
    index: 3,
    label: "Integration",
    caption: "Relayout, primitives, type-check, smoke audit.",
    pillars: ["execution"],
    progress: 12,
  },
]

/* ── TELEMETRY LOG — rolling stream of events for the dock at the
 * bottom of the page. Pure mock, deterministic order. The log dock
 * cycles through these to convey "this plan is alive". */
export type TelemetryEntry = {
  /** mm:ss relative timestamp shown left-aligned in mono. */
  t: string
  /** Pillar this event belongs to (drives the chip color). */
  pillar: PillarKey
  /** One-liner — desk-radio style. */
  msg: string
}

export const TELEMETRY_LOG: TelemetryEntry[] = [
  { t: "00:01", pillar: "goal", msg: "Plan loaded · 5 pillars · 27 build steps queued" },
  { t: "00:08", pillar: "execution", msg: "6 shared primitives drafted at top of file" },
  { t: "00:14", pillar: "distribution", msg: "Paired W/L bar layout sketched · 1 risk on cramp" },
  { t: "00:19", pillar: "distribution", msg: "R-bucket ledger wired · +3R / +2R / +1R / −1R" },
  { t: "00:23", pillar: "instruments", msg: "Sparkbar gradient cutoffs locked: 50 / 70 / 100" },
  { t: "00:27", pillar: "calibration", msg: "Reliability diagram viewBox set 600×180" },
  { t: "00:32", pillar: "execution", msg: "Smoke check pending · 3 new cards mounted" },
  { t: "00:38", pillar: "instruments", msg: "EURUSD 81.5% surfaced · GBPJPY paused (edge 42)" },
  { t: "00:44", pillar: "calibration", msg: "Index 0.82 · 2 perfect bands @ 70% / 80%" },
  { t: "00:51", pillar: "goal", msg: "Story arc audit: matrix → 3 dives → momentum (clean)" },
  { t: "00:58", pillar: "execution", msg: "tsc --noEmit returned 0 errors · ready to ship" },
]

/* ── LEGEND KEYS — what every visual signal in the constellation means. */
export const LEGEND_KEYS: { dot: "amber" | "emerald" | "rose" | "ash"; label: string; sub: string }[] = [
  { dot: "amber", label: "Active vertex", sub: "the pillar you're reading" },
  { dot: "emerald", label: "Phase complete", sub: "ready to ship" },
  { dot: "amber", label: "Phase in flight", sub: "currently building" },
  { dot: "rose", label: "Risk · high", sub: "guard before merging" },
  { dot: "ash", label: "Hairline · scaffold", sub: "geometry, not data" },
]

/* ── DESIGN-LANGUAGE TYPOGRAPHY ROW (kept from v1, exported here
 * to keep all editorial constants in one file). */
export const LANGUAGE_RULES: { eyebrow: string; sample: string; sub: string }[] = [
  { eyebrow: "EYEBROW · 0.22EM", sample: "OUTCOME · DISTRIBUTION", sub: "mono caps · 9-10pt" },
  { eyebrow: "PROTAGONIST", sample: "120", sub: "sans 56pt · two-weight" },
  { eyebrow: "LEDGER VALUE", sample: "+0.78R", sub: "tabular-nums · -0.01em" },
  { eyebrow: "VERDICT", sample: "Solid edge.", sub: "italic · paper dim" },
]

/* ── ICON GLOSSARY — used by the Legend / Compass component. */
export const COMPASS_ICONS = { Sigma, Eye, GitBranch }
