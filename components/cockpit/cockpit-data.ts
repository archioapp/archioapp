/**
 * COCKPIT DATA
 * ----------------------------------------------------------------------------
 * The single source of truth for the /cockpit experience.
 *
 * This file encodes the masterplan in machine-readable form:
 *   - Three stages (Analyze / Forecast / Execute) with their modules
 *   - Five spine nodes (Thesis / Confluences / Risk / Cortex / Verdict)
 *   - Seven-act day-in-the-life flow
 *   - Six-layer ecosystem (the organism)
 *
 * No UI logic lives here. Sections consume this data and animate it.
 * ----------------------------------------------------------------------------
 */

export type StageId = "analyze" | "forecast" | "execute"

export interface CockpitModule {
  name: string
  hint: string
  isNew?: boolean
}

export interface CockpitStage {
  id: StageId
  position: "I" | "II" | "III"
  verb: string
  sub: string
  question: string
  lede: string
  rationale: string
  modules: CockpitModule[]
  accent: {
    from: string
    to: string
    ink: string
  }
}

export const COCKPIT_STAGES: CockpitStage[] = [
  {
    id: "analyze",
    position: "I",
    verb: "Analyze",
    sub: "Read the screen",
    question: "What is on the screen right now?",
    lede: "Structure, liquidity, smart-money prints, session context, confluences. The trader's eye, at rest, assisted.",
    rationale:
      "Stage I is pure perception. No opinions, no forecasts, no size. Only what the chart is showing at this moment — counted, named, scored, cited.",
    modules: [
      { name: "Multi-Timeframe Stack", hint: "5 TFs · linked crosshair" },
      { name: "Liquidity Map", hint: "HTF pools · sweeps · killzones", isNew: true },
      { name: "Smart-Money Structure", hint: "OB · FVG · BOS · CHoCH", isNew: true },
      { name: "Session Clock", hint: "Tokyo · London · NY · personal edge" },
      { name: "9 Named Confluences", hint: "live · scored · cross-cited" },
      { name: "Volume Profile + VWAP", hint: "bands · POC · value area", isNew: true },
      { name: "Correlation Overlay", hint: "any pair vs DXY / VIX / BTC" },
      { name: "Chart Annotation", hint: "saved to the trade record" },
      { name: "Copilot Chart-Reader", hint: "ask: what do you see here" },
    ],
    accent: { from: "#22d3ee", to: "#0ea5e9", ink: "#22d3ee" },
  },
  {
    id: "forecast",
    position: "II",
    verb: "Forecast",
    sub: "Look ahead",
    question: "What is about to happen?",
    lede: "Macro, volatility, sessions, scenarios. The trader's eye looking forward — where the thesis is composed and scored for clarity.",
    rationale:
      "Stage II projects. Calendar windows, expected moves, correlated reactions, branch scenarios. The thesis is written here, in prose, before any order exists.",
    modules: [
      { name: "Macro Calendar", hint: "filtered to book + watchlist" },
      { name: "Central-Bank Bias", hint: "rate path · DXY · VIX" },
      { name: "Session Edge Clock", hint: "personal win-rate by session" },
      { name: "Volatility Forecast", hint: "expected move · ATR / IV / event", isNew: true },
      { name: "Scenario Branch Tree", hint: "if reaches X, then", isNew: true },
      { name: "Crowd Sentiment", hint: "COT · retail · social skew" },
      { name: "AI Scenario Drafter", hint: "Buy / Sell scripts, cited" },
      { name: "Correlation Forecast", hint: "expected book moves", isNew: true },
      { name: "Thesis Composer", hint: "write BEFORE the trade · clarity-scored", isNew: true },
    ],
    accent: { from: "#d4af37", to: "#a97142", ink: "#e0b449" },
  },
  {
    id: "execute",
    position: "III",
    verb: "Execute",
    sub: "Forge the order",
    question: "Should the order leave — and at what size?",
    lede: "The thesis from II renders on the ticket. The 9-of-9 confluence from I is cited. The cortex is read. The interlock is live.",
    rationale:
      "Stage III is the wall between intent and the market. Autosize, rehearsal, psychology check, verdict, server-side interlock, fan-out, replay. Nothing touches the broker without passing every gate.",
    modules: [
      { name: "Unified Account Switcher", hint: "prop · live · demo · crypto" },
      { name: "Rule-Locked Autosize", hint: "arithmetic eliminated" },
      { name: "Order Ticket", hint: "mandatory SL & TP" },
      { name: "Multi-Leg Builder", hint: "pairs · hedge · DCA as one intent", isNew: true },
      { name: "Pre-Trade Rehearsal", hint: "Paper Fire on live tape", isNew: true },
      { name: "Trade Templates", hint: "playbook → one-click prefill", isNew: true },
      { name: "Psychology Check", hint: "3–6 unskippable questions" },
      { name: "Pre-Trade Verdict", hint: "GREEN / AMBER / RED · cited" },
      { name: "Server-Side Interlock", hint: "RED blocks the send" },
      { name: "Alert Weaver", hint: "conditional on confluences", isNew: true },
      { name: "Event Fan-Out", hint: "journal · copilot · mentor · community" },
      { name: "Execution Quality Meter", hint: "slippage · fill · spread · graded", isNew: true },
      { name: "Replay Engine", hint: "post-trade scrub with cortex + decisions", isNew: true },
    ],
    accent: { from: "#f472b6", to: "#e11d48", ink: "#fb7185" },
  },
]

/* -------------------------------------------------------------------------- */
/* SPINE · five state objects that survive every handoff                       */
/* -------------------------------------------------------------------------- */

export interface SpineNode {
  id: string
  label: string
  role: string
  description: string
  originStage: StageId | "all"
}

export const COCKPIT_SPINE: SpineNode[] = [
  {
    id: "thesis",
    label: "Thesis",
    role: "the written claim",
    description: "What he expects to happen, and why. Composed in II, rendered on the ticket in III.",
    originStage: "forecast",
  },
  {
    id: "confluences",
    label: "Confluences",
    role: "the named reasons",
    description: "The 9-model library. Counted in I, consumed by the verdict in III.",
    originStage: "analyze",
  },
  {
    id: "risk",
    label: "Risk Budget",
    role: "the live cap",
    description: "Per-trade · daily · drawdown · correlated exposure. Feeds autosize in III.",
    originStage: "all",
  },
  {
    id: "cortex",
    label: "Cortex",
    role: "the discipline meter",
    description: "0–100 read of his behavioural state at this moment. Gated in III.",
    originStage: "all",
  },
  {
    id: "verdict",
    label: "Verdict",
    role: "the cited judgement",
    description: "GREEN / AMBER / RED from the copilot, produced by reading the four above.",
    originStage: "execute",
  },
]

/* -------------------------------------------------------------------------- */
/* FLOW · Marco's 13-minute trade across all three stages                      */
/* -------------------------------------------------------------------------- */

export interface FlowStep {
  time: string
  stage: string
  headline: string
  body: string
  tags: Array<{ label: string; hot?: boolean }>
}

export const COCKPIT_FLOW: FlowStep[] = [
  {
    time: "09:14",
    stage: "Stage I",
    headline: "Marco opens the Cockpit. Analyze begins.",
    body: "The rail opens on GBP/USD, 1H. Five timeframes stack in the left panel. Liquidity Map paints equal highs at 1.2760 and a swept pool at 1.2702. Smart-Money Structure auto-labels a bullish BOS on 4H, a fresh OB on 15m. The session clock says London in 46 minutes — Marco's 62% edge window.",
    tags: [
      { label: "multi-tf" },
      { label: "liquidity map" },
      { label: "confluence: 6 of 9", hot: true },
      { label: "london -46m" },
    ],
  },
  {
    time: "09:19",
    stage: "I → II",
    headline: 'He asks the copilot: "what do you see?"',
    body: 'Copilot, cited to the chart: "4H BOS intact. 15m OB at 1.2712 unmitigated. 9-of-9 unlocks if price tags 1.2712 with wick below 1.2708 during London. Your historical hit-rate on this exact setup: 67% over 31 trades." Confluences move from 6 to pending 9.',
    tags: [
      { label: "copilot" },
      { label: "historical 67% / 31", hot: true },
      { label: "spine: confluences +3 pending" },
    ],
  },
  {
    time: "09:23",
    stage: "Stage II",
    headline: "He composes the thesis. Stage II opens.",
    body: 'In the Thesis Composer he writes: "London bulls sweep Asia high, OB at 1.2712 holds, target 1.2760 equal highs, invalidation below 1.2698." Clarity score: 94/100 — direction, level, invalidation all present. Volatility Forecast: 34p expected, range 22–48. The 48-pip target is inside the high-end envelope. Scenario Branch Tree drafts two branches.',
    tags: [
      { label: "thesis 94/100" },
      { label: "vol 34p expected" },
      { label: "scenarios: 2 branches" },
      { label: "spine: thesis written", hot: true },
    ],
  },
  {
    time: "09:46",
    stage: "II → III",
    headline: "Price tags 1.2712. Alert Weaver fires.",
    body: 'Not a price alert — a confluence alert. "9-of-9 reached on GBP/USD: OB tag + BOS intact + London active + your hit-rate." The rail advances to Stage III automatically. The thesis renders on the ticket. The confluences counted in I are cited on the verdict preview.',
    tags: [
      { label: "alert weaver" },
      { label: "9/9 confluence", hot: true },
      { label: "spine: handoff to stage III" },
    ],
  },
  {
    time: "09:47",
    stage: "Stage III",
    headline: "Autosize. Rehearsal. Check.",
    body: "Autosize returns 0.38 lots (0.5% across his aggregate book, respecting FTMO daily cap). Marco clicks Paper Fire first — the rehearsal executes on live tape, no broker, same slippage model. Clean. Psychology Check asks three questions — plan match? yes. 2+ losses today? no. 3rd GBP trade today? no.",
    tags: [
      { label: "autosize 0.38" },
      { label: "paper-fire clean" },
      { label: "check 3/3 pass" },
    ],
  },
  {
    time: "09:49",
    stage: "Stage III",
    headline: "The verdict renders. Cited. Green.",
    body: "The copilot emits GREEN. Citation: plan.match = true · confluences = 9/9 · cortex = 81/100 · risk within caps · rehearsal clean · interlock idle. Marco sends. The broker adapter routes to FTMO. Fill at 1.2713. Event fan-out fires: journal stub opens with thesis pre-filled, mentor dashboard shows the entry, copilot stores the setup signature.",
    tags: [
      { label: "verdict: GREEN", hot: true },
      { label: "fill 1.2713" },
      { label: "fan-out: 4 surfaces" },
    ],
  },
  {
    time: "11:12",
    stage: "Post",
    headline: "Replay. The trade writes its own record.",
    body: "Target hit at 1.2758. +2.4R. Replay Engine scrubs back to 09:14 with every annotation, confluence mark, copilot whisper, cortex trace, thesis, and verdict overlay rendered in sequence. Execution Quality Meter grades the entry: slippage 0.3p, fill 41ms, spread 1.1p — A. The whole trade is one scrubable object.",
    tags: [
      { label: "+2.4R", hot: true },
      { label: "replay: 1 object" },
      { label: "exec quality: A" },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* ECOSYSTEM · the organism — six layers, inside-out                          */
/* -------------------------------------------------------------------------- */

export interface EcosystemLayer {
  index: string
  name: string
  role: string
  description: string
  surfaces: string[]
}

export const COCKPIT_ECOSYSTEM: EcosystemLayer[] = [
  {
    index: "L1",
    name: "The Rail",
    role: "the act of trading",
    description: "Analyze → Forecast → Execute. The three-stage cockpit. Where the money moves.",
    surfaces: ["Cockpit", "Spine", "Rehearsal", "Interlock"],
  },
  {
    index: "L2",
    name: "The Mind",
    role: "why he does what he does",
    description: "System OS — Psychology, Strategy, Governance, Cortex. The discipline that binds the trader.",
    surfaces: ["System OS", "Cortex", "Rule Forge", "Growth Ladder"],
  },
  {
    index: "L3",
    name: "The Reader",
    role: "the intelligence that sees",
    description: "Copilot — chart-aware, cited, verdict-bound. Every answer comes with receipts.",
    surfaces: ["Chart-Reader", "Verdict Engine", "Diagnostic", "Oracle"],
  },
  {
    index: "L4",
    name: "The Mirror",
    role: "the map of himself",
    description: "Archio Brain — dashboard, performance, ledger, patterns. What he is, measured.",
    surfaces: ["Dashboard", "Journal", "Ledger", "Pattern Library"],
  },
  {
    index: "L5",
    name: "The World",
    role: "the network of others",
    description: "Network + Relay — communities, mentors, calls, live edge, the Presence field.",
    surfaces: ["Communities", "Mentor Ladder", "Relay", "Presence"],
  },
  {
    index: "L6",
    name: "The Ground",
    role: "where the system lives",
    description: "Rails — broker bridge, prop bridge, paper ground, vault, academy, marketplace.",
    surfaces: ["Broker Bridge", "Prop Bridge", "Vault", "Academy"],
  },
]

/* -------------------------------------------------------------------------- */
/* PRINCIPLES · the five laws from the masterplan foundation                   */
/* -------------------------------------------------------------------------- */

export interface Principle {
  index: string
  name: string
  line: string
}

export const COCKPIT_PRINCIPLES: Principle[] = [
  {
    index: "L1",
    name: "One Rail",
    line: "Analyze, Forecast, and Execute are one act held across three moments. One cockpit, one record.",
  },
  {
    index: "L2",
    name: "Cited, or Silent",
    line: "No unsourced intelligence. Every answer carries the chart, the model, the number, the hit-rate.",
  },
  {
    index: "L3",
    name: "Interlock Before Broker",
    line: "A RED verdict does not reach the market. The wall is server-side. Discipline is infrastructure.",
  },
  {
    index: "L4",
    name: "One Spine",
    line: "Thesis, Confluences, Risk, Cortex, Verdict. One record across every surface. One truth.",
  },
  {
    index: "L5",
    name: "Replay Over Regret",
    line: "Every trade writes its own scrubable record. The past becomes a teacher, not a wound.",
  },
]
