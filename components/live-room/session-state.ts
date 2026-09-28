/**
 * LIVE ROOM — session state model
 *
 * One ledger, five projections:
 *   SESSION TIMELINE   → the ordered log of typed events
 *   ROOM INTELLIGENCE  → four lenses FOLDED from the events
 *   THE BREAKDOWN      → the mentor's causal chain, seven nodes folded from the events
 *   TRADE ANATOMY      → the open (or last) position as R-geometry
 *   ROOM PULSE         → audience reaction per event on the time axis
 *
 * Every projection is a pure function of `(events, viewMin)`. Decision
 * Replay works by handing the same functions a truncated ledger.
 *
 * COPY CONTRACT (see docs/live-room-breakdown-masterplan.md §1)
 *   title    WHAT   verb-first · ≤ 64 chars
 *   body     WHY    the mentor's reasoning · may carry {{term}} tokens
 *   meaning  SO WHAT one sentence for the viewer
 *   evidence WHERE  event ids this event stands on
 *   invalidation    price + condition + consequence
 */

import type { LrTone } from "./live-room-tokens"

/* ────────────────────────────────────────────────────────────────────────
 *  Time — the session opened at 2:00 PM. Every event carries `at`
 *  (minutes since open). The room clock is a single number: elapsed
 *  seconds since open. Labels derive from it, so there is ONE clock.
 * ──────────────────────────────────────────────────────────────────────── */

export const SESSION_OPEN_HOUR = 14 // 2:00 PM
export const SESSION_START_ELAPSED_SEC = 45 * 60 + 1 // 45:01 on arrival

export function clockLabel(atMinutes: number): string {
  const total = SESSION_OPEN_HOUR * 60 + Math.floor(atMinutes)
  const h24 = Math.floor(total / 60) % 24
  const m = total % 60
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  const suffix = h24 >= 12 ? "PM" : "AM"
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`
}

export function elapsedLabel(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export function agoLabel(atMinutes: number, nowMinutes: number): string {
  const d = Math.max(0, Math.round(nowMinutes - atMinutes))
  if (d === 0) return "now"
  if (d < 60) return `${d}m`
  return `${Math.floor(d / 60)}h ${d % 60}m`
}

/* ────────────────────────────────────────────────────────────────────────
 *  Events
 * ──────────────────────────────────────────────────────────────────────── */

export type SessionPhase = "observe" | "setup" | "execute" | "review"

export type SessionEventType =
  | "system"
  | "mode-change"
  | "focus-change"
  | "thesis-update"
  | "level-call"
  | "warning"
  | "bias-shift"
  | "audience-milestone"
  | "key-moment"
  | "entry"
  | "exit"
  | "forecast-published"

export type Direction = "bullish" | "bearish" | "neutral"

export type LevelKind = "entry" | "target" | "stop" | "sweep" | "invalidation" | "trail" | "tp1"

export interface SessionLevel {
  kind: LevelKind
  price: number
  instrument: string
}

export type ConfluenceKind = "liquidity" | "structure" | "gap" | "flow" | "macro" | "time"

/** One reason a level matters. `weight` 1–5 → the stratum bar. */
export interface Confluence {
  label: string
  kind: ConfluenceKind
  weight: 1 | 2 | 3 | 4 | 5
}

/** The exact condition that kills an idea, and what happens if it prints. */
export interface Invalidation {
  price?: number
  instrument?: string
  condition: string
  consequence: string
}

export interface SessionEvent {
  id: string
  type: SessionEventType
  /** minutes since session open */
  at: number
  /** WHAT — verb-first, ≤ 64 chars */
  title: string
  /** WHY — the mentor's reasoning. May carry {{term}} tokens. */
  body?: string
  /** SO WHAT — one sentence for the viewer. May carry {{term}} tokens. */
  meaning?: string
  instrument?: string
  direction?: Direction
  /** 1–5 */
  importance: number
  mentor: boolean
  phase: SessionPhase
  reactions?: number
  pnl?: number
  facts?: { label: string; value: string }[]
  from?: string
  to?: string
  levels?: SessionLevel[]
  /** event ids this event stands on */
  evidence?: string[]
  invalidation?: Invalidation
  confluence?: Confluence[]
  /** exit closes the entry with this id */
  closes?: string
  /** message id when the event was pinned from the discussion */
  sourceMessageId?: string
}

export type EventCategory = "all" | "mentor" | "trades" | "levels" | "warnings"

export const EVENT_META: Record<
  SessionEventType,
  { label: string; tone: LrTone; category: Exclude<EventCategory, "all" | "mentor">[] }
> = {
  system:             { label: "System",        tone: "neutral", category: [] },
  "mode-change":      { label: "Mode change",   tone: "primary", category: [] },
  "focus-change":     { label: "Focus",         tone: "primary", category: [] },
  "thesis-update":    { label: "Thesis",        tone: "primary", category: [] },
  "level-call":       { label: "Level",         tone: "primary", category: ["levels"] },
  warning:            { label: "Warning",       tone: "warn",    category: ["warnings"] },
  "bias-shift":       { label: "Bias",          tone: "primary", category: [] },
  "audience-milestone": { label: "Audience",    tone: "neutral", category: [] },
  "key-moment":       { label: "Key moment",    tone: "primary", category: [] },
  entry:              { label: "Entry",         tone: "up",      category: ["trades"] },
  exit:               { label: "Exit",          tone: "up",      category: ["trades"] },
  "forecast-published": { label: "Forecast",    tone: "primary", category: [] },
}

export function eventTone(e: SessionEvent): LrTone {
  if (e.type === "exit") return (e.pnl ?? 0) >= 0 ? "up" : "down"
  if (e.type === "entry") return e.direction === "bearish" ? "down" : "up"
  return EVENT_META[e.type].tone
}

export function eventMatches(e: SessionEvent, cat: EventCategory): boolean {
  if (cat === "all") return true
  if (cat === "mentor") return e.mentor
  return EVENT_META[e.type].category.includes(cat)
}

export const PHASES: { id: SessionPhase; label: string; hint: string }[] = [
  { id: "observe", label: "Observe", hint: "reading the tape" },
  { id: "setup",   label: "Setup",   hint: "preparing entries" },
  { id: "execute", label: "Execute", hint: "trades are live" },
  { id: "review",  label: "Review",  hint: "debrief" },
]

const PHASE_FROM_MODE: Record<string, SessionPhase> = {
  observation: "observe", observe: "observe",
  setup: "setup",
  execution: "execute", execute: "execute",
  review: "review",
}

/* ────────────────────────────────────────────────────────────────────────
 *  Seed — the demo session (2:00 PM open, 45 min in)
 *  Written in the mentor's voice under the copy contract.
 * ──────────────────────────────────────────────────────────────────────── */

const XAU = "XAU/USD"
const EUR = "EUR/USD"

export const SEED_EVENTS: SessionEvent[] = [
  {
    id: "te-1", type: "system", at: 0, importance: 2, mentor: false, phase: "observe",
    title: "Session opened — NY Session Live Trading",
    body: "Institutional flow analysis on Gold and EUR/USD through the New York afternoon.",
  },
  {
    id: "te-2", type: "mode-change", at: 0, importance: 2, mentor: true, phase: "observe", from: "—", to: "Observation",
    title: "Room set to Observation — nobody trades yet",
    body: "The first quarter hour is for reading the tape: where the {{liquidity-pool|liquidity}} rests, what the {{htf-bias}} says, and what London left behind.",
    meaning: "Watch. There is no setup to act on yet.",
  },
  {
    id: "te-3", type: "focus-change", at: 3, importance: 3, mentor: true, phase: "observe", instrument: XAU,
    title: "Focus: Gold and EUR/USD, with DXY and 10Y as context",
    body: "Gold is the trade. EUR/USD is the inverse read on the dollar. {{dxy|DXY}} and the 10-year tell us whether the dollar is helping or fighting the idea.",
    meaning: "If DXY rises while Gold rises, be suspicious — one of them is early.",
    facts: [{ label: "Primary", value: "XAU/USD · EUR/USD" }, { label: "Context", value: "DXY · US10Y" }],
  },
  {
    id: "te-4", type: "thesis-update", at: 8, importance: 4, mentor: true, phase: "observe", instrument: XAU, direction: "bullish", reactions: 34,
    title: "Thesis: Gold longs after the 2035 sweep",
    body: "Price is climbing into the {{liquidity-pool}} above the {{asia-high}} at 2035.50 — the stops of every short taken overnight. The {{draw-on-liquidity|draw}} above is 2042, the H4 {{supply}}. I want price to {{sweep}} 2035.50, print {{displacement}}, then I buy the retrace into the 2033.50 – 2035.80 {{fvg|gap}}.",
    meaning: "The plan has three conditions. None have printed yet — do not front-run the sweep.",
    facts: [{ label: "Buy zone", value: "2033.50 – 2035.80" }, { label: "Draw", value: "2042.00" }, { label: "Conditions", value: "Sweep · Displace · Retrace" }],
    levels: [{ kind: "entry", price: 2033.5, instrument: XAU }, { kind: "entry", price: 2035.8, instrument: XAU }, { kind: "target", price: 2042, instrument: XAU }],
    evidence: ["te-3"],
    invalidation: { price: 2029, instrument: XAU, condition: "15m close below 2029.00 before the sweep", consequence: "The pool below gets taken first — the thesis resets to wait." },
  },
  {
    id: "te-5", type: "level-call", at: 10, importance: 4, mentor: true, phase: "observe", instrument: XAU, direction: "bullish", reactions: 28,
    title: "Level armed: 2035.50, the Asia high",
    body: "Four reasons stack here: the {{asia-high}}, {{equal-highs}} at 2035.40 / 2035.60, a 15m {{fvg}} just beneath, and it sits half an ATR above {{daily-eq|daily equilibrium}}. Stops rest above it. That is the fuel.",
    meaning: "When price tags 2035.50, do not chase. Wait for the candle that {{displacement|displaces}} away from it.",
    facts: [{ label: "Level", value: "2035.50" }, { label: "Type", value: "Liquidity sweep" }, { label: "Action", value: "Wait for displacement" }],
    levels: [{ kind: "sweep", price: 2035.5, instrument: XAU }],
    confluence: [
      { label: "Asia session high", kind: "liquidity", weight: 5 },
      { label: "Equal highs 2035.40 / 2035.60", kind: "structure", weight: 4 },
      { label: "15m fair value gap 2033.50 – 2035.80", kind: "gap", weight: 3 },
      { label: "Daily EQ + 0.5 ATR", kind: "time", weight: 2 },
    ],
    evidence: ["te-4"],
  },
  {
    id: "te-6", type: "mode-change", at: 12, importance: 3, mentor: true, phase: "setup", from: "Observation", to: "Setup",
    title: "Room moved to Setup — building the entry",
    body: "Structure agrees with the idea. From here I mark the levels I will actually trade against and size the position.",
    meaning: "Mark your chart now. The next phase moves fast.",
  },
  {
    id: "te-7", type: "warning", at: 15, importance: 4, mentor: true, phase: "setup", reactions: 19,
    title: "FOMC minutes at 4:00 PM — size cut to half",
    body: "The minutes drop in two hours. Gold can move 15 dollars on a headline, and a stop at 2028 is only 6 dollars away. {{half-size}} keeps a full stop-out inside normal daily risk.",
    meaning: "If you follow this trade, your risk today is 0.5 R, not 1 R.",
    facts: [{ label: "Event", value: "FOMC minutes" }, { label: "Time", value: "4:00 PM · 2h away" }, { label: "Action", value: "Size at 50%" }],
  },
  {
    id: "te-8", type: "level-call", at: 18, importance: 3, mentor: true, phase: "setup", instrument: EUR, direction: "bearish",
    title: "EUR/USD invalidation: 1.0870 on a 15m close",
    body: "The short bias on the euro lives below 1.0870 — the last 15m {{supply}} that pushed price down. A close above it means the dollar bid is gone, and that argues against Gold longs too.",
    meaning: "1.0870 is a Gold signal as much as a euro one. If it goes, rethink both.",
    facts: [{ label: "Level", value: "1.0870" }, { label: "Type", value: "Invalidation" }, { label: "Timeframe", value: "15m close" }],
    levels: [{ kind: "invalidation", price: 1.087, instrument: EUR }],
    confluence: [
      { label: "15m supply 1.0862 – 1.0872", kind: "structure", weight: 4 },
      { label: "DXY 104.40 session high overlap", kind: "flow", weight: 3 },
    ],
    invalidation: { price: 1.087, instrument: EUR, condition: "15m close above 1.0870", consequence: "Euro short bias is off and the dollar-strength read behind Gold weakens." },
    evidence: ["te-3"],
  },
  {
    id: "te-9", type: "bias-shift", at: 22, importance: 3, mentor: true, phase: "setup", instrument: XAU, direction: "bullish", from: "Watching", to: "Bullish confirmed", reactions: 22,
    title: "Gold bias: bullish confirmed",
    body: "Three higher lows on the 5m into the level, volume drying up on every dip. That is {{accumulation}} — sellers are being absorbed, not rewarded.",
    meaning: "The idea has graduated from a plan to a bias. Still no entry — the sweep has not printed.",
    evidence: ["te-4", "te-5"],
  },
  {
    id: "te-10", type: "audience-milestone", at: 25, importance: 1, mentor: false, phase: "setup",
    title: "Room passed 800 concurrent viewers",
  },
  {
    id: "te-11", type: "key-moment", at: 28, importance: 5, mentor: true, phase: "setup", instrument: XAU, direction: "bullish", reactions: 42,
    title: "Delta divergence on the 15m — institutions absorbing",
    body: "Price made a lower low at 2032.90 but {{delta}} printed higher. Someone is buying every sell order below 2033 without letting price fall. That is {{absorption}} — the footprint that precedes a {{sweep}}.",
    meaning: "This is the last confirmation before the trigger. Set your alert at 2035.50.",
    facts: [{ label: "Price low", value: "2032.90" }, { label: "Delta", value: "Higher low" }, { label: "Read", value: "Absorption" }],
    evidence: ["te-9", "te-5"],
  },
  {
    id: "te-12", type: "mode-change", at: 28, importance: 4, mentor: true, phase: "execute", from: "Setup", to: "Execution",
    title: "Room moved to Execution — trades are live",
    body: "Two of three conditions have printed. I trade the third the moment it appears.",
    meaning: "From here every mentor message is actionable. Read the levels, not the chat — the tape is faster than reactions.",
  },
  {
    id: "te-13", type: "entry", at: 39, importance: 5, mentor: true, phase: "execute", instrument: XAU, direction: "bullish", reactions: 63,
    title: "Long Gold at 2034.20 — half size",
    body: "Filled inside the {{fvg|gap}} on the retrace, before the sweep. Stop 2028, under the 2029 pool so a deeper flush cannot take me out. Target 2042 — the {{draw-on-liquidity|draw}}. 1 : 3.2 at a full stop.",
    meaning: "This entry is early by design: the mentor buys the gap and lets the sweep happen with the position on. Copy it only if you accept the 2028 stop.",
    facts: [{ label: "Entry", value: "2034.20" }, { label: "Stop", value: "2028.00" }, { label: "Target", value: "2042.00" }, { label: "R:R", value: "1 : 3.2" }, { label: "Size", value: "50% (FOMC)" }],
    levels: [{ kind: "entry", price: 2034.2, instrument: XAU }, { kind: "target", price: 2042, instrument: XAU }, { kind: "stop", price: 2028, instrument: XAU }],
    evidence: ["te-11", "te-5", "te-7"],
    invalidation: { price: 2028, instrument: XAU, condition: "Any trade at 2028.00", consequence: "Full stop — −0.5 R at half size." },
  },
  {
    id: "te-14", type: "key-moment", at: 41, importance: 5, mentor: true, phase: "execute", instrument: XAU, direction: "bullish", reactions: 47,
    title: "2035.50 swept — displacement confirmed",
    body: "Price ran the {{asia-high}}, took the stops, and the very next 15m candle closed 2.1 dollars higher on a {{delta}} of +340. That is {{displacement}}: the move left a gap behind it instead of filling one.",
    meaning: "All three conditions are now true. The trade is no longer a bet on a plan — it is a plan playing out.",
    facts: [{ label: "Sweep high", value: "2036.10" }, { label: "Displacement", value: "+2.10 · 15m close" }, { label: "Delta", value: "+340" }],
    evidence: ["te-5", "te-13"],
  },
  {
    id: "te-15", type: "exit", at: 42, importance: 4, mentor: true, phase: "execute", instrument: XAU, direction: "bullish", pnl: 1240, reactions: 52, closes: "te-13",
    title: "TP1 at 2038.40 — half banked, +$1,240",
    body: "First target is the {{london-high}}. I take a {{partial}} here because {{fomc|FOMC}} is 80 minutes away, and a {{runner}} with banked profit is a different trade from a full position with none.",
    meaning: "The trade has now paid for its own risk. Whatever happens next is upside.",
    facts: [{ label: "Exit price", value: "2038.40" }, { label: "Realised", value: "+4.20 · 50%" }, { label: "Remaining", value: "50% running to 2042" }],
    levels: [{ kind: "tp1", price: 2038.4, instrument: XAU }],
    evidence: ["te-13", "te-7"],
  },
  {
    id: "te-16", type: "thesis-update", at: 43, importance: 3, mentor: true, phase: "execute", instrument: XAU, direction: "bullish", from: "Stop 2028 · TP 2042", to: "Trail 2036 · TP 2042",
    title: "Trail lifted to 2036 — the runner is risk-free",
    body: "The remaining 50% runs to 2042. The {{trail}} sits at 2036: below the swept 2035.50 so a retest does not stop us out, above the 2034.20 entry so the worst case is a smaller win, not a loss.",
    meaning: "You can stop managing risk on this trade. What is left is patience.",
    facts: [{ label: "Target", value: "2042.00" }, { label: "Trail stop", value: "2036.00" }, { label: "Status", value: "Running 50%" }],
    levels: [{ kind: "target", price: 2042, instrument: XAU }, { kind: "trail", price: 2036, instrument: XAU }],
    evidence: ["te-15", "te-14", "te-13"],
    invalidation: { price: 2036, instrument: XAU, condition: "15m close below 2036.00", consequence: "The runner closes at roughly +0.3 R. Thesis intact, session stays green." },
  },
]

export const MENTOR = {
  name: "Mentor Alex",
  initials: "A",
  title: "Senior Market Strategist",
  winRate: 78,
  accuracy: 92,
  pnl: "+$247K",
  streak: 12,
  sessions: 847,
  status: "Analyzing live flow",
}

export const SESSION_META = {
  name: "NY Session Live Trading",
  theme: "Institutional flow analysis — Gold & EUR/USD",
  startedAt: "2:00 PM EST",
}

export interface Instrument {
  symbol: string
  direction: Direction
  change: number
  note: string
  priority: "primary" | "secondary"
  price: number
  high: number
  low: number
}

export const INSTRUMENTS: Instrument[] = [
  { symbol: XAU, direction: "bullish", change: 0.42, note: "Runner to 2042", priority: "primary", price: 2038.4, high: 2038.4, low: 2029.1 },
  { symbol: EUR, direction: "bearish", change: -0.18, note: "Below 1.0850 supply", priority: "primary", price: 1.0838, high: 1.0862, low: 1.0831 },
  { symbol: "DXY", direction: "bullish", change: 0.11, note: "Supporting thesis", priority: "secondary", price: 104.32, high: 104.4, low: 104.05 },
  { symbol: "US10Y", direction: "neutral", change: -0.03, note: "Range-bound context", priority: "secondary", price: 4.28, high: 4.31, low: 4.26 },
]

export const AUDIENCE = {
  total: 847,
  active: 142,
  peak: 203,
  recent: ["Maya", "Jordan", "Ali", "Chen"],
  pulse: [32, 45, 61, 78, 92, 105, 98, 112, 125, 138, 142, 139],
  level: "High" as const,
  coins: [
    { initials: "TM", name: "TraderMike" },
    { initials: "SF", name: "SarahFX" },
    { initials: "GT", name: "GoldTrader" },
    { initials: "PS", name: "ProScalper" },
  ],
}

/* ────────────────────────────────────────────────────────────────────────
 *  Discussion
 * ──────────────────────────────────────────────────────────────────────── */

export type RoomId = "main" | "questions" | "setups" | "flow"
export type MessageKind = "mentor" | "audience" | "question" | "system" | "callout" | "join" | "summary" | "forecast"
export type ComposerMode = "chat" | "question" | "setup"

export interface DiscussionMessage {
  id: string
  room: RoomId
  kind: MessageKind
  author: string
  initials: string
  role?: "mentor" | "moderator" | "subscriber" | "member"
  body: string
  /** minutes since open */
  at: number
  instrument?: string
  reactions?: number
  pinned?: boolean
  replyTo?: string
  /** reference to a timeline event ("re: ENTRY 2:39 PM") */
  refEventId?: string
  /** true when this message was pinned into the ledger */
  ledgered?: boolean
  bullets?: string[]
  self?: boolean
}

export const ROOMS: { id: RoomId; label: string; live: boolean }[] = [
  { id: "main", label: "Main Stage", live: true },
  { id: "questions", label: "Q&A", live: true },
  { id: "setups", label: "Trade Setups", live: true },
  { id: "flow", label: "Order Flow", live: false },
]

export const SEED_MESSAGES: DiscussionMessage[] = [
  { id: "d-pin", room: "main", kind: "mentor", author: "Mentor Alex", initials: "A", role: "mentor", at: 28, instrument: XAU, pinned: true, reactions: 88,
    body: "Gold is into the 2035 sweep zone. Three conditions: sweep, displacement, retrace into the gap. Two have printed. Do not chase the third — let it come to you." },
  { id: "d-sys1", room: "main", kind: "system", author: "Room", initials: "R", at: 30, body: "Mentor Alex updated the thesis — Gold sweep zone active" },
  { id: "d-1", room: "main", kind: "mentor", author: "Mentor Alex", initials: "A", role: "mentor", at: 32, instrument: XAU, reactions: 46, refEventId: "te-11",
    body: "Look at the 15m delta. Price made a lower low at 2032.90, delta made a higher low. Someone is absorbing every sell order below 2033. That is the footprint." },
  { id: "d-2", room: "main", kind: "audience", author: "TraderMike", initials: "TM", role: "subscriber", at: 34, reactions: 8,
    body: "The absorption read is clean — you can see the sell prints hitting and price refusing to go." },
  { id: "d-3", room: "questions", kind: "question", author: "SarahFX", initials: "SF", role: "moderator", at: 35, instrument: EUR, reactions: 5,
    body: "Is 1.0870 still the euro invalidation, and does it change the Gold idea if it goes?" },
  { id: "d-join1", room: "main", kind: "join", author: "Room", initials: "", at: 35, body: "Maya, Jordan and Ali joined the stage" },
  { id: "d-4", room: "questions", kind: "mentor", author: "Mentor Alex", initials: "A", role: "mentor", at: 36, instrument: EUR, replyTo: "SarahFX", reactions: 31, refEventId: "te-8",
    body: "Yes — 1.0870 on a 15m close. If it goes, the dollar bid is gone and I would tighten the Gold stop, not add. The two ideas share one engine." },
  { id: "d-5", room: "setups", kind: "callout", author: "GoldTrader", initials: "GT", role: "subscriber", at: 37, instrument: XAU, reactions: 31,
    body: "2035.50 is 90 cents away. Volume spike on the 5m — this is the run Alex called at open." },
  { id: "d-6", room: "main", kind: "audience", author: "CryptoKing", initials: "CK", role: "member", at: 38, reactions: 3,
    body: "Sitting on hands until the displacement prints. Patience trade." },
  { id: "d-7", room: "main", kind: "mentor", author: "Mentor Alex", initials: "A", role: "mentor", at: 39, instrument: XAU, reactions: 63, refEventId: "te-13",
    body: "Long from 2034.20, inside the gap. Stop 2028 under the pool, target 2042. Half size because of FOMC. This is early on purpose — I want the position on when the sweep happens." },
  { id: "d-8", room: "flow", kind: "callout", author: "ProScalper", initials: "PS", role: "subscriber", at: 40, instrument: XAU, reactions: 12,
    body: "Delta +340 on the 5m with price holding above 2035. Absorption is finished — buyers are lifting offers now." },
  { id: "d-9", room: "main", kind: "mentor", author: "Mentor Alex", initials: "A", role: "mentor", at: 42, instrument: XAU, reactions: 52, refEventId: "te-15",
    body: "TP1 at 2038.40 — the London high. Banking half. Trail moves to 2036, the rest runs to 2042." },
  { id: "d-10", room: "questions", kind: "question", author: "NoviceFX", initials: "NF", role: "member", at: 43, reactions: 2,
    body: "Why 2036 for the trail and not break-even at 2034.20?" },
  { id: "d-12", room: "questions", kind: "mentor", author: "Mentor Alex", initials: "A", role: "mentor", at: 44, instrument: XAU, replyTo: "NoviceFX", reactions: 27, refEventId: "te-16",
    body: "Break-even sits inside the gap. A retest of the sweep could tag 2034.20 and stop out a trade that is still correct. 2036 is above entry and below the swept level — small win in the worst case, runner in the best." },
  { id: "d-11", room: "setups", kind: "audience", author: "FlowReader", initials: "FR", role: "subscriber", at: 44, instrument: XAU, reactions: 6,
    body: "Same long from 2034.60 — TP1 done, holding a runner with the trail at 2036." },
]

/* ────────────────────────────────────────────────────────────────────────
 *  Replay — the same ledger, truncated
 * ──────────────────────────────────────────────────────────────────────── */

/** Events known at `cutoffMin`. Pass `null` for the live ledger. */
export function atCutoff(events: SessionEvent[], cutoffMin: number | null): SessionEvent[] {
  if (cutoffMin === null) return events
  return events.filter((e) => e.at <= cutoffMin)
}

/* ────────────────────────────────────────────────────────────────────────
 *  Selectors — fold the ledger into the present
 * ──────────────────────────────────────────────────────────────────────── */

export function derivePhase(events: SessionEvent[]): { phase: SessionPhase; startedAt: number; startEventId?: string } {
  let phase: SessionPhase = "observe"
  let startedAt = 0
  let startEventId: string | undefined
  for (const e of events) {
    if (e.type === "mode-change" && e.to) {
      const p = PHASE_FROM_MODE[e.to.toLowerCase()]
      if (p) { phase = p; startedAt = e.at; startEventId = e.id }
    }
  }
  return { phase, startedAt, startEventId }
}

export function phaseStarts(events: SessionEvent[]): Partial<Record<SessionPhase, { at: number; eventId: string }>> {
  const out: Partial<Record<SessionPhase, { at: number; eventId: string }>> = {}
  for (const e of events) {
    if (e.type === "mode-change" && e.to) {
      const p = PHASE_FROM_MODE[e.to.toLowerCase()]
      if (p && !out[p]) out[p] = { at: e.at, eventId: e.id }
    }
  }
  return out
}

export type LensId = "thesis" | "watch" | "risk" | "behavior" | "catchup"
export type Confidence = "high" | "medium" | "low"

export interface LensFact { label: string; value: string; tone?: LrTone }

export interface Lens {
  id: LensId
  title: string
  confidence: Confidence
  /** WHY — may carry {{term}} tokens */
  body: string
  /** SO WHAT — may carry {{term}} tokens */
  meaning?: string
  facts: LensFact[]
  /** events this lens was folded from */
  sourceIds: string[]
  /** the most recent source — the stamp */
  stampEventId?: string
  /** minutes since open of the stamp event */
  stampAt: number
  /** levels to draw on the chart while hovered */
  levels: SessionLevel[]
  /** optional accent thread color override (risk may be amber) */
  tone?: LrTone
  bullets?: string[]
  alignment?: { state: "aligned" | "divergent"; reason: string }
  invalidation?: Invalidation
}

export interface OpenPosition {
  entryId: string
  instrument: string
  direction: Direction
  entry: number
  /** the stop as first placed */
  stopOriginal: number
  /** the stop now (after trail moves) */
  stop: number
  target: number
  sizeLabel?: string
  remaining: number // 0..1
  openedAt: number
  closedAt?: number
  /** partial exits taken */
  exits: { at: number; price: number; pnl: number; fraction: number; eventId: string }[]
  trailEventId?: string
}

function collectPositions(events: SessionEvent[]): OpenPosition[] {
  const all: OpenPosition[] = []
  for (const e of events) {
    if (e.type === "entry") {
      const entry = e.levels?.find((l) => l.kind === "entry")?.price ?? 0
      const stop = e.levels?.find((l) => l.kind === "stop")?.price ?? 0
      const target = e.levels?.find((l) => l.kind === "target")?.price ?? 0
      all.push({ entryId: e.id, instrument: e.instrument ?? "", direction: e.direction ?? "neutral", entry, stopOriginal: stop, stop, target, sizeLabel: e.facts?.find((f) => f.label === "Size")?.value, remaining: 1, openedAt: e.at, exits: [] })
    }
    if (e.type === "exit") {
      const p = all.find((x) => x.remaining > 0 && (e.closes ? x.entryId === e.closes : x.instrument === e.instrument))
      if (p) {
        const partial = /partial|half|tp1/i.test(e.title) || /remaining/i.test(e.facts?.map((f) => f.label).join(" ") ?? "")
        const fraction = partial ? 0.5 : p.remaining
        const factPrice = parseFloat(e.facts?.find((f) => /exit/i.test(f.label))?.value ?? "")
        const price = e.levels?.find((l) => l.kind === "tp1")?.price ?? (Number.isNaN(factPrice) ? p.target : factPrice)
        p.exits.push({ at: e.at, price, pnl: e.pnl ?? 0, fraction, eventId: e.id })
        p.remaining = Math.max(0, p.remaining - fraction)
        if (p.remaining === 0) p.closedAt = e.at
      }
    }
    if (e.type === "thesis-update") {
      const trail = e.levels?.find((l) => l.kind === "trail")
      const p = all.find((o) => o.instrument === e.instrument && o.remaining > 0)
      if (trail && p) { p.stop = trail.price; p.trailEventId = e.id }
    }
  }
  return all
}

export function deriveOpenPositions(events: SessionEvent[]): OpenPosition[] {
  return collectPositions(events).filter((p) => p.remaining > 0)
}

export function deriveLedger(events: SessionEvent[]) {
  const pnl = events.reduce((s, e) => s + (e.type === "exit" ? e.pnl ?? 0 : 0), 0)
  const open = deriveOpenPositions(events).length
  const closed = events.filter((e) => e.type === "exit").length
  const key = events.filter((e) => e.importance >= 4).length
  return { pnl, open, closed, key, total: events.length }
}

const fmtPrice = (p: number) => (p >= 100 ? p.toFixed(2) : p.toFixed(4))

export function deriveThesis(events: SessionEvent[]): Lens {
  const thesis = [...events].reverse().find((e) => e.type === "thesis-update")
  const positions = deriveOpenPositions(events)
  const pos = positions.find((p) => p.instrument === thesis?.instrument) ?? positions[0]
  const entryEvent = pos ? events.find((e) => e.id === pos.entryId) : undefined
  const sources = [thesis?.id, entryEvent?.id].filter(Boolean) as string[]
  events.filter((e) => e.type === "exit" && e.instrument === thesis?.instrument).forEach((e) => sources.push(e.id))

  const dir = thesis?.direction ?? pos?.direction ?? "neutral"
  const facts: LensFact[] = []
  if (pos) {
    const rr = pos.stopOriginal && pos.target ? Math.abs(pos.target - pos.entry) / Math.max(1e-9, Math.abs(pos.entry - pos.stopOriginal)) : 0
    facts.push({ label: "Entry", value: fmtPrice(pos.entry) })
    facts.push({ label: "Target", value: fmtPrice(pos.target), tone: "up" })
    facts.push({ label: pos.stop !== pos.stopOriginal ? "Trail" : "Stop", value: fmtPrice(pos.stop), tone: pos.stop >= pos.entry === (dir === "bullish") ? "up" : "down" })
    facts.push({ label: "R : R", value: `1 : ${rr.toFixed(1)}` })
  } else if (thesis?.facts) {
    thesis.facts.slice(0, 3).forEach((f) => facts.push({ label: f.label, value: f.value }))
  }

  const levels: SessionLevel[] = []
  if (pos) {
    levels.push({ kind: "entry", price: pos.entry, instrument: pos.instrument })
    levels.push({ kind: "target", price: pos.target, instrument: pos.instrument })
    levels.push({ kind: pos.stop !== pos.stopOriginal ? "trail" : "stop", price: pos.stop, instrument: pos.instrument })
  } else thesis?.levels?.forEach((l) => levels.push(l))

  const confidence: Confidence = pos && pos.remaining < 1 ? "high" : thesis ? "medium" : "low"
  const body = thesis?.body ?? thesis?.title ?? "No thesis published yet. The room is still reading the tape."

  return {
    id: "thesis",
    title: thesis ? `${thesis.instrument} ${dir === "bullish" ? "long" : dir === "bearish" ? "short" : ""} — ${thesis.title.split(/[—:]/)[0].trim()}`.trim() : "No thesis yet",
    confidence, body, meaning: thesis?.meaning, facts, sourceIds: Array.from(new Set(sources)),
    stampEventId: thesis?.id, stampAt: thesis?.at ?? 0, levels, invalidation: thesis?.invalidation,
  }
}

export function deriveWatch(events: SessionEvent[], prices: Record<string, number>): Lens {
  const calls = events.filter((e) => e.type === "level-call" && e.levels?.length)
  const isSwept = (c: SessionEvent) => {
    const lvl = c.levels![0]
    return events.some((e) => e.at > c.at && e.type === "key-moment" && e.instrument === c.instrument && e.title.includes(fmtPrice(lvl.price).replace(/\.?0+$/, "")))
  }
  const armed = calls.filter((c) => !isSwept(c))
  const sorted = [...armed].sort((a, b) => {
    const da = Math.abs((prices[a.instrument ?? ""] ?? 0) - a.levels![0].price) / Math.max(1e-9, a.levels![0].price)
    const db = Math.abs((prices[b.instrument ?? ""] ?? 0) - b.levels![0].price) / Math.max(1e-9, b.levels![0].price)
    return da - db
  })
  const latest = [...calls].sort((a, b) => b.at - a.at)[0]
  const swept = calls.length - armed.length
  const nearest = sorted[0]
  const dist = nearest ? Math.abs((prices[nearest.instrument ?? ""] ?? 0) - nearest.levels![0].price) : 0
  // the invalidation itself lives on the red hairline — the ledger carries the census + distance
  const facts: LensFact[] = [
    { label: "Armed", value: String(armed.length), tone: armed.length ? "primary" : undefined },
    { label: "Swept", value: String(swept), tone: swept ? "up" : undefined },
    ...(nearest ? [
      { label: "Nearest", value: `${nearest.instrument} ${fmtPrice(nearest.levels![0].price)}`, tone: (nearest.direction === "bearish" ? "down" : "up") as LrTone },
      { label: "Away", value: nearest.instrument === "EUR/USD" ? `${Math.round(dist * 10000)} pips` : `$${dist.toFixed(2)}` },
    ] : []),
  ]
  const body = armed.length
    ? `${armed.length === 1 ? "One level is" : `${armed.length} levels are`} still armed${swept ? `, ${swept} already ${swept === 1 ? "has" : "have"} been swept` : ""}. Nearest is ${nearest?.instrument} ${fmtPrice(nearest!.levels![0].price)}, ${nearest!.instrument === "EUR/USD" ? `${Math.round(dist * 10000)} pips` : `${dist.toFixed(2)} dollars`} from price.`
    : calls.length ? "Every level the mentor called has been hit. Nothing left to wait for." : "No levels called yet."
  const meaning = armed.length
    ? nearest?.invalidation ? `If ${nearest.instrument} ${nearest.invalidation.condition.toLowerCase()}, ${nearest.invalidation.consequence.charAt(0).toLowerCase()}${nearest.invalidation.consequence.slice(1)}` : "Set alerts on the armed levels — the tape is faster than the chat."
    : undefined
  return {
    id: "watch",
    title: "What to watch",
    confidence: armed.length ? "high" : "low",
    body, meaning, facts,
    sourceIds: calls.map((c) => c.id),
    stampEventId: latest?.id, stampAt: latest?.at ?? 0,
    levels: sorted.flatMap((c) => c.levels ?? []),
    invalidation: nearest?.invalidation,
  }
}

export function deriveRisk(events: SessionEvent[], nowMin: number): Lens {
  const warnings = events.filter((e) => e.type === "warning")
  const latest = [...warnings].sort((a, b) => b.at - a.at)[0]
  const positions = deriveOpenPositions(events)
  const pos = positions[0]
  const exposureR = pos ? (pos.direction === "bullish" ? (pos.entry - pos.stop) : (pos.stop - pos.entry)) / Math.max(1e-9, Math.abs(pos.entry - pos.stopOriginal)) * pos.remaining : 0
  const macroIn = latest ? Math.max(0, 120 - (nowMin - latest.at)) : null
  const protectedNow = pos ? (pos.direction === "bullish" ? pos.stop >= pos.entry : pos.stop <= pos.entry) : false
  const level: Confidence = pos && !protectedNow ? "medium" : "low"
  const facts: LensFact[] = []
  if (macroIn !== null) facts.push({ label: "Macro", value: `FOMC in ${Math.floor(macroIn / 60)}h ${String(macroIn % 60).padStart(2, "0")}m`, tone: "warn" })
  facts.push({ label: "Open risk", value: pos ? protectedNow ? "0.0 R · protected" : `${Math.max(0, exposureR).toFixed(1)} R at the stop` : "flat", tone: pos && !protectedNow ? "down" : "up" })
  if (pos?.sizeLabel) facts.push({ label: "Sizing", value: pos.sizeLabel })
  const body = latest
    ? pos
      ? protectedNow
        ? `${latest.title.split("—")[0].trim()} is still ahead, but the open {{runner}} is protected by the {{trail}} at ${fmtPrice(pos.stop)} — a spike into the minutes cannot turn this session red.`
        : `${latest.title.split("—")[0].trim()} is ahead and ${Math.round(pos.remaining * 100)}% of the position is still exposed to the stop at ${fmtPrice(pos.stop)}.`
      : `${latest.title.split("—")[0].trim()} is ahead. The book is flat — no exposure into the release.`
    : "No active warnings and no macro releases inside the session window."
  const meaning = pos
    ? protectedNow ? "Do not add here. Adding would put new risk on ahead of the release." : "Your risk is defined by the stop, not by the headline. Know your exit before 4:00 PM."
    : undefined
  return {
    id: "risk",
    title: "Current risk",
    confidence: level,
    tone: "warn",
    body, meaning, facts,
    sourceIds: [...warnings.map((w) => w.id), ...positions.map((p) => p.entryId), ...positions.map((p) => p.trailEventId).filter(Boolean) as string[]],
    stampEventId: latest?.id, stampAt: latest?.at ?? 0,
    levels: positions.map((p) => ({ kind: (p.stop !== p.stopOriginal ? "trail" : "stop") as LevelKind, price: p.stop, instrument: p.instrument })),
  }
}

export function deriveBehavior(events: SessionEvent[], phase: SessionPhase): Lens {
  const inPhase = events.filter((e) => (e.type === "key-moment" || e.type === "bias-shift") && e.phase === phase)
  const pool = inPhase.length ? inPhase : events.filter((e) => e.type === "key-moment" || e.type === "bias-shift")
  const latest = [...pool].sort((a, b) => b.at - a.at)[0]
  const bullish = pool.filter((e) => e.direction === "bullish").length
  const bearish = pool.filter((e) => e.direction === "bearish").length
  const text = pool.map((e) => `${e.title} ${e.body ?? ""}`).join(" ")
  const pattern = /displacement/i.test(text) ? "Sweep → displacement" : /accumul|absorb/i.test(text) ? "Accumulation" : /distribut/i.test(text) ? "Distribution" : "Rotation"
  return {
    id: "behavior",
    title: "Key behavior",
    confidence: pool.length >= 2 ? "high" : pool.length ? "medium" : "low",
    body: latest?.body ?? latest?.title ?? "No key moments recorded yet.",
    meaning: latest?.meaning,
    facts: [
      { label: "Pattern", value: `${pattern} · 15m` },
      { label: "Read", value: bullish >= bearish ? `${bullish} bullish signal${bullish === 1 ? "" : "s"}` : `${bearish} bearish signal${bearish === 1 ? "" : "s"}`, tone: bullish >= bearish ? "up" : "down" },
      { label: "Moments", value: `${pool.length} ${inPhase.length ? "this phase" : "so far"}` },
    ],
    sourceIds: pool.map((e) => e.id),
    stampEventId: latest?.id, stampAt: latest?.at ?? 0,
    levels: [],
  }
}

/* ────────────────────────────────────────────────────────────────────────
 *  THE BREAKDOWN — the mentor's causal chain, folded from the ledger
 * ──────────────────────────────────────────────────────────────────────── */

export type NodeRole = "context" | "narrative" | "level" | "trigger" | "entry" | "manage" | "outcome"

export type NodeStatus =
  | "pending"     // nothing yet
  | "forming"     // partial evidence
  | "confirmed"   // done, true
  | "armed"       // level waiting
  | "swept"       // level taken
  | "live"        // position open
  | "banked"      // partial taken
  | "protected"   // stop at/above entry
  | "partial"     // 1 of n targets
  | "complete"    // flat, done
  | "invalidated" // proven wrong

export interface BreakdownNode {
  role: NodeRole
  index: number
  label: string
  /** the single number or 2–3 word claim */
  claim: string
  /** ≤ 2 lines. May carry {{term}} tokens. */
  detail: string
  /** the full reasoning for the dossier. May carry {{term}} tokens. */
  body?: string
  meaning?: string
  status: NodeStatus
  statusLabel: string
  tone: LrTone
  evidenceIds: string[]
  stampAt?: number
  levels: SessionLevel[]
  invalidation?: Invalidation
  confluence?: Confluence[]
  confidence: Confidence
}

export const NODE_ROLES: { role: NodeRole; label: string; question: string }[] = [
  { role: "context",   label: "Context",   question: "What is the higher-timeframe telling us?" },
  { role: "narrative", label: "Narrative", question: "Where is price being drawn, and why?" },
  { role: "level",     label: "Level",     question: "Which exact price is the trade built around?" },
  { role: "trigger",   label: "Trigger",   question: "What has to print before money is risked?" },
  { role: "entry",     label: "Entry",     question: "Where, how much, and what kills it?" },
  { role: "manage",    label: "Manage",    question: "How is the position being protected?" },
  { role: "outcome",   label: "Outcome",   question: "What has it paid, and what is left?" },
]

const STATUS_TONE: Record<NodeStatus, LrTone> = {
  pending: "neutral", forming: "primary", confirmed: "primary", armed: "warn", swept: "primary",
  live: "up", banked: "up", protected: "up", partial: "up", complete: "up", invalidated: "down",
}

const STATUS_LABEL: Record<NodeStatus, string> = {
  pending: "Pending", forming: "Forming", confirmed: "Confirmed", armed: "Armed", swept: "Swept",
  live: "Live", banked: "Banked", protected: "Protected", partial: "1 of 2", complete: "Complete", invalidated: "Invalidated",
}

const fmtMoney = (v: number) => `${v >= 0 ? "+" : "−"}$${Math.abs(Math.round(v)).toLocaleString()}`

export function deriveBreakdown(events: SessionEvent[], primary = XAU): BreakdownNode[] {
  const byId = Object.fromEntries(events.map((e) => [e.id, e]))
  const last = <T extends SessionEvent>(pred: (e: SessionEvent) => boolean) => [...events].reverse().find(pred) as T | undefined
  const focus = last((e) => e.type === "focus-change")
  const bias = last((e) => e.type === "bias-shift" && e.instrument === primary)
  const thesisFirst = events.find((e) => e.type === "thesis-update" && e.instrument === primary)
  const thesisLast = last((e) => e.type === "thesis-update" && e.instrument === primary)
  const call = last((e) => e.type === "level-call" && e.instrument === primary && !!e.levels?.length)
  const sweptBy = call ? events.find((e) => e.at > call.at && e.type === "key-moment" && e.instrument === primary && e.title.includes(fmtPrice(call.levels![0].price).replace(/\.?0+$/, ""))) : undefined
  const triggers = events.filter((e) => e.type === "key-moment" && e.instrument === primary && (!call || e.at >= call.at))
  const positions = collectPositions(events).filter((p) => p.instrument === primary)
  const pos = positions[positions.length - 1]
  const entryEvent = pos ? byId[pos.entryId] : undefined
  const ctx = INSTRUMENTS.filter((i) => i.priority === "secondary")
  const pnl = events.filter((e) => e.type === "exit" && e.instrument === primary).reduce((s, e) => s + (e.pnl ?? 0), 0)

  const node = (partial: Omit<BreakdownNode, "index" | "label" | "tone" | "statusLabel" | "confidence"> & { confidence?: Confidence }): BreakdownNode => {
    const meta = NODE_ROLES.find((r) => r.role === partial.role)!
    return {
      ...partial,
      index: NODE_ROLES.indexOf(meta),
      label: meta.label,
      tone: STATUS_TONE[partial.status],
      statusLabel: STATUS_LABEL[partial.status],
      confidence: partial.confidence ?? (partial.status === "pending" ? "low" : partial.status === "forming" || partial.status === "armed" ? "medium" : "high"),
    }
  }

  /* 1 · CONTEXT */
  const dollarHelping = ctx.find((i) => i.symbol === "DXY")?.change ?? 0
  const context = node({
    role: "context",
    claim: bias ? `${bias.direction === "bullish" ? "Bullish" : "Bearish"} bias` : focus ? `${focus.instrument ?? primary} focus` : "Reading the tape",
    detail: bias
      ? `${primary} above {{daily-eq|daily EQ}} 2031.20 · {{dxy|DXY}} ${dollarHelping >= 0 ? "+" : ""}${dollarHelping.toFixed(2)} ${dollarHelping > 0.2 ? "fighting" : "quiet"}`
      : focus ? "Gold is the trade, EUR/USD the inverse dollar read." : "No focus set yet.",
    body: bias?.body ?? focus?.body,
    meaning: bias?.meaning ?? focus?.meaning,
    status: bias ? "confirmed" : focus ? "forming" : "pending",
    evidenceIds: [focus?.id, bias?.id].filter(Boolean) as string[],
    stampAt: bias?.at ?? focus?.at,
    levels: [],
  })

  /* 2 · NARRATIVE */
  const draw = thesisFirst?.levels?.find((l) => l.kind === "target")
  const narrative = node({
    role: "narrative",
    claim: draw ? `Draw ${fmtPrice(draw.price)}` : "No narrative",
    detail: thesisFirst ? "Sweep the {{asia-high}}, print {{displacement}}, buy the retrace into the {{fvg|gap}}." : "Waiting for the mentor's first thesis.",
    body: thesisFirst?.body,
    meaning: thesisFirst?.meaning,
    status: thesisFirst ? (bias && bias.direction === thesisFirst.direction ? "confirmed" : "forming") : "pending",
    evidenceIds: [thesisFirst?.id, bias?.id].filter(Boolean) as string[],
    stampAt: thesisFirst?.at,
    levels: draw ? [draw] : [],
    invalidation: thesisFirst?.invalidation,
  })

  /* 3 · LEVEL */
  const level = node({
    role: "level",
    claim: call ? fmtPrice(call.levels![0].price) : "No level",
    detail: call ? (call.confluence?.length ? `${call.confluence.length} confluences · ${call.confluence[0].label.toLowerCase()}` : call.title) : "Waiting for a level call.",
    body: call?.body,
    meaning: call?.meaning,
    status: !call ? "pending" : sweptBy ? "swept" : "armed",
    evidenceIds: [call?.id, sweptBy?.id].filter(Boolean) as string[],
    stampAt: sweptBy?.at ?? call?.at,
    levels: call?.levels ?? [],
    confluence: call?.confluence,
  })

  /* 4 · TRIGGER */
  const hasDisplacement = triggers.some((t) => /displacement/i.test(t.title))
  const hasDivergence = triggers.some((t) => /divergence|absorb/i.test(t.title))
  const latestTrigger = triggers[triggers.length - 1]
  const trigger = node({
    role: "trigger",
    claim: hasDisplacement ? "Displacement" : hasDivergence ? "Delta divergence" : "Awaiting trigger",
    detail: hasDisplacement && hasDivergence
      ? "{{delta-divergence|Divergence}} at 2032.90, then {{displacement}} through 2035.50 on +340 {{delta}}."
      : hasDivergence ? "{{absorption|Absorption}} printed below 2033. The {{sweep}} itself has not." : "Needs a sweep of the level and a displacement candle away from it.",
    body: latestTrigger?.body,
    meaning: latestTrigger?.meaning,
    status: hasDisplacement ? "confirmed" : hasDivergence ? "forming" : "pending",
    evidenceIds: triggers.map((t) => t.id),
    stampAt: latestTrigger?.at,
    levels: call?.levels ?? [],
  })

  /* 5 · ENTRY */
  const rr = pos ? Math.abs(pos.target - pos.entry) / Math.max(1e-9, Math.abs(pos.entry - pos.stopOriginal)) : 0
  const entry = node({
    role: "entry",
    claim: pos ? fmtPrice(pos.entry) : "No position",
    detail: pos ? `${pos.direction === "bullish" ? "Long" : "Short"} · ${pos.sizeLabel?.split(" ")[0] ?? "full"} size · stop ${fmtPrice(pos.stopOriginal)} · 1 : ${rr.toFixed(1)}` : "Nothing risked yet.",
    body: entryEvent?.body,
    meaning: entryEvent?.meaning,
    status: !pos ? "pending" : pos.remaining > 0 ? "live" : "complete",
    evidenceIds: entryEvent ? [entryEvent.id, ...(entryEvent.evidence ?? [])] : [],
    stampAt: entryEvent?.at,
    levels: entryEvent?.levels ?? [],
    invalidation: entryEvent?.invalidation,
  })

  /* 6 · MANAGE */
  const protectedNow = pos ? (pos.direction === "bullish" ? pos.stop >= pos.entry : pos.stop <= pos.entry) : false
  const trailEvent = pos?.trailEventId ? byId[pos.trailEventId] : undefined
  const firstExit = pos?.exits[0]
  const manage = node({
    role: "manage",
    claim: !pos ? "—" : protectedNow ? `Trail ${fmtPrice(pos.stop)}` : firstExit ? "Half banked" : "Full risk on",
    detail: !pos
      ? "Nothing to manage yet."
      : protectedNow
        ? `${Math.round(pos.remaining * 100)}% {{runner}} · stop above entry · worst case a smaller win.`
        : firstExit ? `${Math.round(firstExit.fraction * 100)}% off at ${fmtPrice(firstExit.price)} · stop still ${fmtPrice(pos.stop)}.` : `Stop ${fmtPrice(pos.stop)} · ${pos.sizeLabel ?? "full size"} · no partials yet.`,
    body: trailEvent?.body ?? (firstExit ? byId[firstExit.eventId]?.body : undefined),
    meaning: trailEvent?.meaning ?? (firstExit ? byId[firstExit.eventId]?.meaning : undefined),
    status: !pos ? "pending" : protectedNow ? "protected" : firstExit ? "banked" : "live",
    evidenceIds: [trailEvent?.id, ...(pos?.exits.map((x) => x.eventId) ?? [])].filter(Boolean) as string[],
    stampAt: trailEvent?.at ?? firstExit?.at,
    levels: pos ? [{ kind: pos.stop !== pos.stopOriginal ? "trail" : "stop", price: pos.stop, instrument: pos.instrument }] : [],
    invalidation: trailEvent?.invalidation,
  })

  /* 7 · OUTCOME */
  const exits = pos?.exits ?? []
  const outcome = node({
    role: "outcome",
    claim: exits.length ? fmtMoney(pnl) : pos ? "Open" : "—",
    detail: !pos
      ? "No result yet."
      : pos.remaining === 0
        ? `Flat. ${exits.length} exit${exits.length === 1 ? "" : "s"} · ${fmtMoney(pnl)} realised.`
        : exits.length ? `TP1 done at ${fmtPrice(exits[0].price)} · ${fmtPrice(pos.target)} still open for the {{runner}}.` : `Working toward ${fmtPrice(pos.target)} · nothing realised yet.`,
    body: exits.length ? byId[exits[exits.length - 1].eventId]?.body : undefined,
    meaning: exits.length ? byId[exits[exits.length - 1].eventId]?.meaning : undefined,
    status: !pos ? "pending" : pos.remaining === 0 ? "complete" : exits.length ? "partial" : "live",
    evidenceIds: exits.map((x) => x.eventId),
    stampAt: exits[exits.length - 1]?.at,
    levels: pos ? [{ kind: "target", price: pos.target, instrument: pos.instrument }, ...exits.map((x) => ({ kind: "tp1" as LevelKind, price: x.price, instrument: pos.instrument }))] : [],
  })

  /* a node turns red when its invalidation printed against it */
  const nodes = [context, narrative, level, trigger, entry, manage, outcome]
  const invalidatedBy = (inv?: Invalidation) => !!inv?.price && events.some((e) => e.type === "key-moment" && e.instrument === inv.instrument && /invalidat|stopped|closed below|closed above/i.test(e.title) && e.title.includes(fmtPrice(inv.price!).replace(/\.?0+$/, "")))
  for (const n of nodes) if (invalidatedBy(n.invalidation)) { n.status = "invalidated"; n.tone = STATUS_TONE.invalidated; n.statusLabel = STATUS_LABEL.invalidated }
  void thesisLast
  return nodes
}

/** Index of the furthest node that is not pending — where the light rests. */
export function breakdownFrontier(nodes: BreakdownNode[]): number {
  let f = -1
  nodes.forEach((n, i) => { if (n.status !== "pending") f = i })
  return f
}

/* ────────────────────────────────────────────────────────────────────────
 *  TRADE ANATOMY — the position as R-geometry
 * ──────────────────────────────────────────────────────────────────────── */

export type RiskState = "at-risk" | "banked" | "protected" | "risk-free" | "closed" | "flat"

export interface AnatomyRung {
  kind: LevelKind | "price"
  label: string
  price: number
  r: number
  tone: LrTone
  note?: string
  eventId?: string
  retired?: boolean
}

export interface TradeAnatomy {
  instrument: string
  direction: Direction
  entry: number
  stopOriginal: number
  stop: number
  target: number
  riskPerUnit: number
  rungs: AnatomyRung[]
  rNow: number
  rMax: number
  rMin: number
  mfe: number
  mae: number
  price: number
  remaining: number
  sizeLabel?: string
  realised: number
  riskState: RiskState
  openedAt: number
  closedAt?: number
  minutesOpen: number
  entryId: string
  archived: boolean
}

/**
 * `tape` is the live price plus the extremes seen since the entry printed.
 * It comes from the chart, which owns the candle series.
 */
export function deriveAnatomy(
  events: SessionEvent[],
  tape: { price: number; hi: number; lo: number },
  viewMin: number,
  primary = XAU,
): TradeAnatomy | null {
  const positions = collectPositions(events).filter((p) => p.instrument === primary)
  const pos = positions[positions.length - 1]
  if (!pos) return null
  const dir = pos.direction === "bearish" ? -1 : 1
  const riskPerUnit = Math.max(1e-9, Math.abs(pos.entry - pos.stopOriginal))
  const r = (p: number) => (dir * (p - pos.entry)) / riskPerUnit
  const price = pos.remaining > 0 ? tape.price : pos.exits[pos.exits.length - 1]?.price ?? tape.price
  const hi = Math.max(tape.hi, price, ...pos.exits.map((x) => x.price))
  const lo = Math.min(tape.lo, price)
  const mfe = dir > 0 ? hi - pos.entry : pos.entry - lo
  const mae = dir > 0 ? Math.max(0, pos.entry - lo) : Math.max(0, hi - pos.entry)
  const protectedNow = dir > 0 ? pos.stop >= pos.entry : pos.stop <= pos.entry
  const realised = pos.exits.reduce((s, x) => s + x.pnl, 0)
  const riskState: RiskState =
    pos.remaining === 0 ? "closed"
    : protectedNow && pos.stop !== pos.entry ? "risk-free"
    : protectedNow ? "protected"
    : pos.exits.length ? "banked"
    : "at-risk"

  const rungs: AnatomyRung[] = [
    { kind: "target", label: "Target", price: pos.target, r: r(pos.target), tone: "up", note: "draw on liquidity" },
    ...pos.exits.map((x, i) => ({ kind: "tp1" as const, label: `TP${i + 1}`, price: x.price, r: r(x.price), tone: "up" as LrTone, note: `banked ${fmtMoney(x.pnl)}`, eventId: x.eventId })),
    ...(pos.stop !== pos.stopOriginal ? [{ kind: "trail" as const, label: "Trail", price: pos.stop, r: r(pos.stop), tone: "up" as LrTone, note: protectedNow ? "protected" : "trailing", eventId: pos.trailEventId }] : []),
    { kind: "entry", label: "Entry", price: pos.entry, r: 0, tone: "primary", note: pos.sizeLabel, eventId: pos.entryId },
    { kind: "stop", label: "Stop", price: pos.stopOriginal, r: -1, tone: "down", note: pos.stop !== pos.stopOriginal ? "original · retired" : "full stop", retired: pos.stop !== pos.stopOriginal, eventId: pos.entryId },
  ]
  const rs = rungs.map((x) => x.r)
  return {
    instrument: pos.instrument, direction: pos.direction, entry: pos.entry, stopOriginal: pos.stopOriginal, stop: pos.stop, target: pos.target,
    riskPerUnit, rungs, rNow: r(price), rMax: Math.max(...rs, r(price)) + 0.35, rMin: Math.min(...rs, r(price)) - 0.35,
    mfe, mae, price, remaining: pos.remaining, sizeLabel: pos.sizeLabel, realised, riskState,
    openedAt: pos.openedAt, closedAt: pos.closedAt, minutesOpen: Math.max(0, (pos.closedAt ?? viewMin) - pos.openedAt),
    entryId: pos.entryId, archived: pos.remaining === 0,
  }
}

/* ────────────────────────────────────────────────────────────────────────
 *  ROOM PULSE — reactions on the time axis
 * ──────────────────────────────────────────────────────────────────────── */

export interface PulseBar { id: string; at: number; reactions: number; mentor: boolean; importance: number }

export function derivePulse(events: SessionEvent[]): PulseBar[] {
  return events.filter((e) => (e.reactions ?? 0) > 0 || e.importance >= 4).map((e) => ({ id: e.id, at: e.at, reactions: e.reactions ?? 0, mentor: e.mentor, importance: e.importance }))
}

/* ────────────────────────────────────────────────────────────────────────
 *  Tools — phase-aware verbs
 * ──────────────────────────────────────────────────────────────────────── */

export type ToolId = "oracle" | "forecast" | "compare" | "flow"

export interface ToolDef {
  id: ToolId
  label: string
  hint: (ctx: { thesis: Lens; phase: SessionPhase }) => string
}

export const TOOLS: ToolDef[] = [
  { id: "oracle", label: "Oracle summary", hint: ({ phase }) => phase === "review" ? "Generate the session debrief from every event" : "Summarize the session so far into three lines" },
  { id: "forecast", label: "Forecast this", hint: ({ thesis }) => `Prefilled from the current thesis · ${thesis.title.split(" — ")[0]}` },
  { id: "compare", label: "Compare plan", hint: () => "Check the mentor thesis against your Daily Gameplan" },
  { id: "flow", label: "Order flow", hint: () => "Switch the screen to flow mode — delta, imbalance, footprint" },
]

/** Which verbs are foregrounded per phase (order = rank). */
export const PHASE_TOOLS: Record<SessionPhase, ToolId[]> = {
  observe: ["oracle", "forecast"],
  setup: ["compare", "forecast"],
  execute: ["flow", "compare"],
  review: ["oracle", "compare"],
}

/** The viewer's Daily Gameplan (from daily-gameplan.tsx) — used by Compare plan. */
export const VIEWER_GAMEPLAN: Record<string, { bias: Direction; dailyEq: number; h4Supply: number; keySupport: number }> = {
  [XAU]: { bias: "bullish", dailyEq: 2031.2, h4Supply: 2044, keySupport: 2026.5 },
  [EUR]: { bias: "bearish", dailyEq: 1.0854, h4Supply: 1.0872, keySupport: 1.0815 },
}
