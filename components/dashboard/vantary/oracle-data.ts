"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ORACLE DATA LAYER
   ───────────────────────────────────────────────────────────────────────────
   The data + heuristics that power the <OracleCommandConsole/>.

   The Oracle search bar is the single most-used surface in Dashboard AI.
   What appears under it has to feel:

     • specific      — every prompt names a real number, pair, or person
     • intelligent   — the top suggestions read the trader's current state
     • dignified     — no "tip of the day", no marketing copy, no upsell
     • complete      — every prompt resolves to a real, actionable answer

   Layer overview:

     1. MENTORS      — 4 archetypal mentor profiles for the COMPARE flow.
     2. PEER_PROFILES— 4 anonymised peer traders for profile-vs-profile.
     3. COMMAND_*    — the static command catalog (Compare / Analyze / Quick).
     4. getSmartSuggestions(now, performance, plan, accounts)
                     — context-aware prompts ranked by relevance to the
                       trader's current state. Returned with a 0-100 match
                       score that the dropdown displays inline.
     5. fuzzyScore(query, target)
                     — single-pass fuzzy matcher used for live filter as the
                       user types. Returns 0-1 score; 0 means "no match".

   None of these helpers reach into React. Pure data + pure functions.
   ═══════════════════════════════════════════════════════════════════════════ */

import type {
  PerformanceSnapshot,
  PsychologyState,
  DailyPlan,
  TradingAccount,
} from "../dashboard-types"

/* ─────────────────────────────────────────────────────────────────────────
   1 · MENTORS
   ───────────────────────────────────────────────────────────────────────── */

/* ── Compare Mentors extension — behavioural & operational telemetry ─────
   The original MentorProfile is the public-facing card. The Compare
   Mentors template needs richer telemetry to render an eight-axis
   side-by-side that is useful under pressure, not decorative. Every new
   field is OPTIONAL so existing surfaces (Oracle answer, mentor row in
   getSmartSuggestions, etc.) keep compiling without any back-fill.
   ───────────────────────────────────────────────────────────────────── */

/** A single entry in a mentor's recent track-record. Used by the
 *  Compare Mentors schedule matrix. Keep these short — the matrix
 *  reads them as compact rows, not articles. */
export interface MentorTradeRecord {
  /** Stable per-mentor id, prefixed with mentor.id, e.g. "mentor.cohen.t01". */
  id: string
  /** ISO-ish day (YYYY-MM-DD) for the trade. Deterministic relative dates. */
  date: string
  /** Session window the trade fired in. */
  session: "Asia" | "London" | "NY AM" | "NY PM" | "Overnight"
  /** Symbol traded (FX, indices, metals, crypto). */
  instrument: string
  /** "long" | "short". */
  side: "long" | "short"
  /** Setup label (mentor's own taxonomy). */
  setup: string
  /** R outcome — positive means they captured R, negative means they paid R. */
  rOutcome: number
  /** Whether the trade closed at target, stop, or via discretion. */
  exit: "target" | "stop" | "manual" | "trail"
  /** One-line note on what mattered (e.g. "Took partials at HOD"). */
  note?: string
}

/** Coarse session window the mentor primarily trades in. Used by the
 *  morning-session preset and the session-overlap axis. */
export type MentorSessionWindow = "Asia" | "London" | "NY AM" | "NY PM" | "Overnight"

/** Mentor's structural style. Distinct from `archetype` (ICT/SMC/etc) —
 *  this is about hold time and entry rhythm, not method taxonomy. */
export type MentorTradingStyle = "swing" | "day" | "scalp" | "position"

export interface MentorProfile {
  /** Stable id used in URLs / pinning. */
  id: string
  /** Display name. */
  name: string
  /** Two-letter monogram for the avatar tile. */
  monogram: string
  /** "ICT", "SMC", "Wyckoff", "Algorithmic", "Macro", "Price Action". */
  archetype: string
  /** Years on the desk. */
  years: number
  /** Track-record win rate over a verified sample. */
  winRate: number
  /** Verified sample size of the win rate. */
  sampleSize: number
  /** Average R:R captured by the same sample. */
  averageRR: number
  /** Pairs they specialise in. Used for the "fit" calculation. */
  specialityPairs: readonly string[]
  /** Sessions they trade. Used for the "fit" calculation. */
  specialitySessions: readonly string[]
  /** One-line "what this mentor is known for". Surfaced in the result body. */
  signature: string
  /** Active student count — proxy for community pull. */
  mentees: number
  /** Subscription tier — surfaced in the action footer of the result. */
  tier: "free" | "pro" | "premium"
  /** Live floor URL slug — used by the "Open floor" action. */
  slug: string

  /* ── Compare Mentors extension fields — all OPTIONAL ─────────────── */

  /** True if the user follows this mentor. Drives the "Following" tab. */
  followed?: boolean
  /** Group id this mentor belongs to within the user's study group(s).
   *  Drives the "My Group" tab. `undefined` means library-only. */
  groupId?: string
  /** Single primary session window — used by morning-session preset. */
  sessionWindow?: MentorSessionWindow
  /** Hold-time / rhythm style. Used by the swing-vs-day preset. */
  style?: MentorTradingStyle
  /** Asset-class instrument cluster, for the Instruments axis. */
  instruments?: readonly string[]
  /** Average R captured per closed trade (continuous, can be negative). */
  averageR?: number
  /** Trades per week (deterministic mean). Used by Frequency axis. */
  tradeFrequencyPerWeek?: number
  /** 0–100 — composite of: stop honour rate, oversize-position rate (inverse),
   *  out-of-window entry rate (inverse), risk-cap adherence. */
  riskDisciplineScore?: number
  /** Short headline, e.g. "Patient · Probability-first · Rule-bound". */
  temperament?: string
  /** Behavioural-telemetry tags. Treat as STRUCTURED, not vibes:
   *    aggressive · patient · impulsive · methodical · disciplined ·
   *    discretionary · rule-bound · drawdown-resilient · overtrades ·
   *    teaches-clearly · session-patient · probability-first. */
  temperamentTags?: readonly string[]
  /** How many traders watch them in real time. High = potential herd. */
  watchedCount?: number
  /** How many times the user has previously compared this mentor (any pair). */
  comparisonCount?: number
  /** Growth stages they fit best — "starter" / "consistent" / "scaling". */
  growthStageFit?: readonly string[]
  /** Single-line market bias: "Trend-following · USD-cycle aware". */
  primaryMarketBias?: string
  /** Risk profile descriptor — "Tight stops · uniform 0.5R" etc. */
  riskProfile?: string
  /** Last 10 trades for the schedule matrix. Deterministic per mentor. */
  lastTenTrades?: readonly MentorTradeRecord[]
}

/* ── Deterministic last-10 trade records per mentor ──────────────────────
   Pure-data block. Not random — every mentor's record is hand-shaped to
   reflect their style (e.g. Picasso wins more, smaller R; Girard fewer,
   bigger R; Cohen tight stops; Takeda Asia-session entries). The
   schedule matrix reads from `lastTenTrades` — not from a random
   generator inside the component. */

const TRADES_COHEN: readonly MentorTradeRecord[] = [
  { id: "mentor.cohen.t01", date: "2025-04-25", session: "London", instrument: "EUR/USD", side: "long",  setup: "FVG retrace · LSE killzone", rOutcome:  2.4, exit: "target",  note: "Trapped sellers below Asia low." },
  { id: "mentor.cohen.t02", date: "2025-04-24", session: "London", instrument: "GBP/USD", side: "short", setup: "Liquidity sweep · OB tap",    rOutcome:  1.8, exit: "trail",   note: "Trail behind 5m structure." },
  { id: "mentor.cohen.t03", date: "2025-04-23", session: "NY AM",  instrument: "XAU/USD", side: "long",  setup: "London close BPR",            rOutcome: -1.0, exit: "stop",    note: "Stopped at 0.6 — clean honour." },
  { id: "mentor.cohen.t04", date: "2025-04-22", session: "London", instrument: "EUR/USD", side: "long",  setup: "FVG · 4h bias confluence",    rOutcome:  3.1, exit: "target",  note: "Held to weekly objective." },
  { id: "mentor.cohen.t05", date: "2025-04-21", session: "London", instrument: "EUR/USD", side: "short", setup: "Equal-highs raid",             rOutcome:  1.6, exit: "target" },
  { id: "mentor.cohen.t06", date: "2025-04-18", session: "NY AM",  instrument: "XAU/USD", side: "short", setup: "Daily premium · OB",          rOutcome:  2.0, exit: "target" },
  { id: "mentor.cohen.t07", date: "2025-04-17", session: "London", instrument: "GBP/USD", side: "long",  setup: "FVG · DXY pullback",          rOutcome: -1.0, exit: "stop",    note: "DXY ran the wrong way." },
  { id: "mentor.cohen.t08", date: "2025-04-16", session: "London", instrument: "EUR/USD", side: "long",  setup: "BPR continuation",            rOutcome:  1.4, exit: "manual",  note: "Closed early into red folder." },
  { id: "mentor.cohen.t09", date: "2025-04-15", session: "London", instrument: "XAU/USD", side: "long",  setup: "Asian range raid",            rOutcome:  2.6, exit: "target" },
  { id: "mentor.cohen.t10", date: "2025-04-14", session: "London", instrument: "EUR/USD", side: "short", setup: "FVG retrace",                  rOutcome:  1.2, exit: "trail" },
] as const

const TRADES_TAKEDA: readonly MentorTradeRecord[] = [
  { id: "mentor.takeda.t01", date: "2025-04-25", session: "Asia",   instrument: "USD/JPY", side: "long",  setup: "Spring · accumulation",      rOutcome:  3.4, exit: "target",  note: "Classic spring print." },
  { id: "mentor.takeda.t02", date: "2025-04-24", session: "Asia",   instrument: "GBP/JPY", side: "long",  setup: "Phase D · markup",            rOutcome:  2.1, exit: "trail" },
  { id: "mentor.takeda.t03", date: "2025-04-23", session: "London", instrument: "EUR/JPY", side: "short", setup: "Distribution · UTAD",         rOutcome: -1.0, exit: "stop" },
  { id: "mentor.takeda.t04", date: "2025-04-22", session: "Asia",   instrument: "USD/JPY", side: "long",  setup: "Spring re-test",              rOutcome:  4.0, exit: "target",  note: "Held into NY AM run." },
  { id: "mentor.takeda.t05", date: "2025-04-21", session: "Asia",   instrument: "USD/JPY", side: "short", setup: "Phase B sweep",               rOutcome:  1.8, exit: "target" },
  { id: "mentor.takeda.t06", date: "2025-04-18", session: "Asia",   instrument: "GBP/JPY", side: "long",  setup: "Spring · low volume",         rOutcome:  2.6, exit: "trail" },
  { id: "mentor.takeda.t07", date: "2025-04-17", session: "London", instrument: "EUR/JPY", side: "long",  setup: "Re-accumulation tap",         rOutcome: -1.0, exit: "stop",    note: "Sold the news." },
  { id: "mentor.takeda.t08", date: "2025-04-16", session: "Asia",   instrument: "USD/JPY", side: "long",  setup: "Spring · BoJ window",         rOutcome:  3.2, exit: "target" },
  { id: "mentor.takeda.t09", date: "2025-04-15", session: "Asia",   instrument: "GBP/JPY", side: "short", setup: "Distribution top",            rOutcome:  1.4, exit: "manual",  note: "Closed pre-CPI." },
  { id: "mentor.takeda.t10", date: "2025-04-14", session: "Asia",   instrument: "USD/JPY", side: "long",  setup: "Spring re-entry",             rOutcome:  2.0, exit: "target" },
] as const

const TRADES_OKAFOR: readonly MentorTradeRecord[] = [
  { id: "mentor.okafor.t01", date: "2025-04-25", session: "NY AM",  instrument: "DXY",     side: "short", setup: "Macro · post-NFP",            rOutcome:  4.5, exit: "target",  note: "DXY rejected weekly resistance." },
  { id: "mentor.okafor.t02", date: "2025-04-23", session: "NY AM",  instrument: "XAU/USD", side: "long",  setup: "DXY-inverse continuation",    rOutcome:  3.8, exit: "trail" },
  { id: "mentor.okafor.t03", date: "2025-04-21", session: "NY AM",  instrument: "EUR/USD", side: "long",  setup: "Cross-asset confluence",      rOutcome: -1.0, exit: "stop",    note: "ECB hawkish — bond yields cut it." },
  { id: "mentor.okafor.t04", date: "2025-04-18", session: "NY AM",  instrument: "DXY",     side: "long",  setup: "Macro · risk-off pivot",      rOutcome:  5.2, exit: "target",  note: "Held into 1.5 weeks." },
  { id: "mentor.okafor.t05", date: "2025-04-16", session: "NY AM",  instrument: "XAU/USD", side: "short", setup: "Macro · USD strength",        rOutcome: -1.0, exit: "stop" },
  { id: "mentor.okafor.t06", date: "2025-04-14", session: "NY AM",  instrument: "EUR/USD", side: "short", setup: "Cross-asset · yield split",   rOutcome:  3.6, exit: "trail" },
  { id: "mentor.okafor.t07", date: "2025-04-11", session: "NY AM",  instrument: "DXY",     side: "short", setup: "Post-CPI continuation",       rOutcome:  4.0, exit: "target" },
  { id: "mentor.okafor.t08", date: "2025-04-09", session: "NY AM",  instrument: "XAU/USD", side: "long",  setup: "Macro · slow accumulation",   rOutcome:  4.2, exit: "trail",   note: "Carried for 5 sessions." },
  { id: "mentor.okafor.t09", date: "2025-04-07", session: "NY AM",  instrument: "EUR/USD", side: "long",  setup: "DXY top + ECB",               rOutcome: -1.0, exit: "stop" },
  { id: "mentor.okafor.t10", date: "2025-04-04", session: "NY AM",  instrument: "DXY",     side: "long",  setup: "Macro · USD-cycle low",       rOutcome:  3.4, exit: "target" },
] as const

const TRADES_ALVAREZ: readonly MentorTradeRecord[] = [
  { id: "mentor.alvarez.t01", date: "2025-04-25", session: "NY AM",  instrument: "NAS100",  side: "long",  setup: "OB · BPR continuation",       rOutcome:  2.0, exit: "target" },
  { id: "mentor.alvarez.t02", date: "2025-04-24", session: "London", instrument: "US30",    side: "long",  setup: "Order-block · 4h bias",       rOutcome:  1.8, exit: "trail" },
  { id: "mentor.alvarez.t03", date: "2025-04-24", session: "NY AM",  instrument: "EUR/USD", side: "short", setup: "OB · liquidity sweep",        rOutcome: -1.0, exit: "stop" },
  { id: "mentor.alvarez.t04", date: "2025-04-23", session: "London", instrument: "NAS100",  side: "short", setup: "Distribution · OB",           rOutcome:  2.2, exit: "target" },
  { id: "mentor.alvarez.t05", date: "2025-04-23", session: "NY AM",  instrument: "US30",    side: "long",  setup: "Continuation BPR",            rOutcome:  1.6, exit: "trail",   note: "Trail off 15m structure." },
  { id: "mentor.alvarez.t06", date: "2025-04-22", session: "NY AM",  instrument: "NAS100",  side: "long",  setup: "OB · pre-open setup",         rOutcome: -1.0, exit: "stop" },
  { id: "mentor.alvarez.t07", date: "2025-04-21", session: "London", instrument: "EUR/USD", side: "long",  setup: "OB · sweep",                  rOutcome:  2.4, exit: "target" },
  { id: "mentor.alvarez.t08", date: "2025-04-21", session: "NY AM",  instrument: "US30",    side: "long",  setup: "Continuation · 1h",           rOutcome:  1.4, exit: "manual" },
  { id: "mentor.alvarez.t09", date: "2025-04-18", session: "NY AM",  instrument: "NAS100",  side: "short", setup: "Distribution OB",             rOutcome:  2.0, exit: "target" },
  { id: "mentor.alvarez.t10", date: "2025-04-17", session: "London", instrument: "EUR/USD", side: "long",  setup: "Continuation BPR",            rOutcome:  1.2, exit: "trail" },
] as const

const TRADES_PICASSO: readonly MentorTradeRecord[] = [
  { id: "mentor.picasso.t01", date: "2025-04-25", session: "London", instrument: "EUR/USD", side: "long",  setup: "Range fade · session high",   rOutcome:  1.4, exit: "target",  note: "Tight 0.5R risk." },
  { id: "mentor.picasso.t02", date: "2025-04-25", session: "London", instrument: "GBP/USD", side: "short", setup: "Mean-reversion fade",         rOutcome:  1.2, exit: "target" },
  { id: "mentor.picasso.t03", date: "2025-04-24", session: "London", instrument: "EUR/USD", side: "long",  setup: "Asia-low retest",             rOutcome:  1.6, exit: "trail",   note: "Held into NY AM open." },
  { id: "mentor.picasso.t04", date: "2025-04-24", session: "NY AM",  instrument: "XAU/USD", side: "short", setup: "Range fade · NY high",        rOutcome: -0.5, exit: "stop",    note: "Honoured stop fast." },
  { id: "mentor.picasso.t05", date: "2025-04-23", session: "London", instrument: "EUR/USD", side: "short", setup: "Premium fade",                rOutcome:  1.8, exit: "target" },
  { id: "mentor.picasso.t06", date: "2025-04-23", session: "London", instrument: "GBP/USD", side: "long",  setup: "Discount tap",                rOutcome:  1.4, exit: "trail" },
  { id: "mentor.picasso.t07", date: "2025-04-22", session: "London", instrument: "EUR/USD", side: "long",  setup: "Asia-low retest",             rOutcome:  1.2, exit: "target" },
  { id: "mentor.picasso.t08", date: "2025-04-22", session: "London", instrument: "XAU/USD", side: "short", setup: "Premium fade",                rOutcome: -0.5, exit: "stop" },
  { id: "mentor.picasso.t09", date: "2025-04-21", session: "London", instrument: "EUR/USD", side: "short", setup: "Mean-reversion · 5m",         rOutcome:  1.5, exit: "target" },
  { id: "mentor.picasso.t10", date: "2025-04-21", session: "London", instrument: "GBP/USD", side: "long",  setup: "Discount tap",                rOutcome:  1.6, exit: "trail" },
] as const

const TRADES_GIRARD: readonly MentorTradeRecord[] = [
  { id: "mentor.girard.t01", date: "2025-04-25", session: "NY PM",  instrument: "BTC/USD", side: "long",  setup: "Breakout · weekly OB",        rOutcome:  4.8, exit: "trail",   note: "Aggressive size · half off at 2R." },
  { id: "mentor.girard.t02", date: "2025-04-24", session: "NY PM",  instrument: "NAS100",  side: "long",  setup: "Momentum continuation",       rOutcome:  3.6, exit: "target" },
  { id: "mentor.girard.t03", date: "2025-04-23", session: "NY PM",  instrument: "BTC/USD", side: "short", setup: "Failed-breakdown reversal",   rOutcome: -1.5, exit: "stop",    note: "Wide stop — paid the variance." },
  { id: "mentor.girard.t04", date: "2025-04-22", session: "NY PM",  instrument: "USOIL",   side: "long",  setup: "Macro continuation",          rOutcome:  4.2, exit: "trail" },
  { id: "mentor.girard.t05", date: "2025-04-21", session: "NY PM",  instrument: "BTC/USD", side: "long",  setup: "Breakout · weekly close",     rOutcome: -1.5, exit: "stop" },
  { id: "mentor.girard.t06", date: "2025-04-18", session: "NY PM",  instrument: "NAS100",  side: "short", setup: "Distribution top",            rOutcome:  3.0, exit: "target" },
  { id: "mentor.girard.t07", date: "2025-04-17", session: "NY PM",  instrument: "BTC/USD", side: "long",  setup: "Discount tap · weekly",       rOutcome:  5.4, exit: "trail",   note: "Held to weekly target." },
  { id: "mentor.girard.t08", date: "2025-04-16", session: "NY PM",  instrument: "USOIL",   side: "short", setup: "Inventory shock",             rOutcome:  2.8, exit: "manual" },
  { id: "mentor.girard.t09", date: "2025-04-15", session: "NY PM",  instrument: "NAS100",  side: "long",  setup: "Momentum · earnings beat",    rOutcome: -1.5, exit: "stop",    note: "Earnings reversed mid-session." },
  { id: "mentor.girard.t10", date: "2025-04-14", session: "NY PM",  instrument: "BTC/USD", side: "long",  setup: "Breakout continuation",       rOutcome:  4.0, exit: "target" },
] as const

const TRADES_NAKAMURA: readonly MentorTradeRecord[] = [
  { id: "mentor.nakamura.t01", date: "2025-04-25", session: "Asia", instrument: "USD/JPY", side: "short", setup: "Algo fade · 30m",             rOutcome:  1.2, exit: "target" },
  { id: "mentor.nakamura.t02", date: "2025-04-24", session: "Asia", instrument: "USD/JPY", side: "short", setup: "Algo · MA cross",             rOutcome:  1.0, exit: "trail" },
  { id: "mentor.nakamura.t03", date: "2025-04-23", session: "Asia", instrument: "GBP/JPY", side: "long",  setup: "Algo · momentum filter",      rOutcome: -0.8, exit: "stop" },
  { id: "mentor.nakamura.t04", date: "2025-04-22", session: "Asia", instrument: "USD/JPY", side: "long",  setup: "Algo · trend filter",         rOutcome:  1.4, exit: "target" },
  { id: "mentor.nakamura.t05", date: "2025-04-21", session: "Asia", instrument: "EUR/JPY", side: "short", setup: "Algo · session boundary",     rOutcome:  1.0, exit: "target" },
  { id: "mentor.nakamura.t06", date: "2025-04-18", session: "Asia", instrument: "USD/JPY", side: "short", setup: "Algo · pivot fade",           rOutcome: -0.8, exit: "stop" },
  { id: "mentor.nakamura.t07", date: "2025-04-17", session: "Asia", instrument: "USD/JPY", side: "long",  setup: "Algo · momentum",             rOutcome:  1.6, exit: "trail" },
  { id: "mentor.nakamura.t08", date: "2025-04-16", session: "Asia", instrument: "GBP/JPY", side: "short", setup: "Algo · Tokyo high fade",      rOutcome:  1.2, exit: "target" },
  { id: "mentor.nakamura.t09", date: "2025-04-15", session: "Asia", instrument: "USD/JPY", side: "long",  setup: "Algo · trend rebuy",          rOutcome:  1.4, exit: "trail" },
  { id: "mentor.nakamura.t10", date: "2025-04-14", session: "Asia", instrument: "USD/JPY", side: "short", setup: "Algo · pivot fade",           rOutcome: -0.8, exit: "stop" },
] as const

const TRADES_HAYES: readonly MentorTradeRecord[] = [
  { id: "mentor.hayes.t01", date: "2025-04-25", session: "London", instrument: "FTSE",    side: "long",  setup: "Equity index · trend day",    rOutcome:  2.8, exit: "trail" },
  { id: "mentor.hayes.t02", date: "2025-04-23", session: "London", instrument: "DAX",     side: "short", setup: "Distribution top · 4h",       rOutcome:  3.4, exit: "target" },
  { id: "mentor.hayes.t03", date: "2025-04-22", session: "London", instrument: "FTSE",    side: "long",  setup: "Bias continuation",           rOutcome: -1.0, exit: "stop" },
  { id: "mentor.hayes.t04", date: "2025-04-21", session: "London", instrument: "DAX",     side: "long",  setup: "Discount accumulation",       rOutcome:  3.0, exit: "trail" },
  { id: "mentor.hayes.t05", date: "2025-04-18", session: "London", instrument: "FTSE",    side: "short", setup: "Premium · weekly",            rOutcome:  2.4, exit: "target" },
  { id: "mentor.hayes.t06", date: "2025-04-17", session: "London", instrument: "DAX",     side: "long",  setup: "Macro continuation",          rOutcome:  3.6, exit: "trail",   note: "Held over weekend." },
  { id: "mentor.hayes.t07", date: "2025-04-16", session: "London", instrument: "FTSE",    side: "long",  setup: "Trend · 4h bias",             rOutcome: -1.0, exit: "stop" },
  { id: "mentor.hayes.t08", date: "2025-04-15", session: "London", instrument: "DAX",     side: "short", setup: "Distribution · UTAD",         rOutcome:  2.6, exit: "target" },
  { id: "mentor.hayes.t09", date: "2025-04-14", session: "London", instrument: "FTSE",    side: "long",  setup: "Discount tap",                rOutcome:  2.2, exit: "trail" },
  { id: "mentor.hayes.t10", date: "2025-04-11", session: "London", instrument: "DAX",     side: "long",  setup: "Trend · momentum",            rOutcome:  3.0, exit: "target" },
] as const

export const MENTORS: readonly MentorProfile[] = [
  /* ── Followed + group: the user's primary pool ────────────────────── */
  {
    id: "mentor.cohen",
    name: "Daniel Cohen",
    monogram: "DC",
    archetype: "ICT",
    years: 11,
    winRate: 71,
    sampleSize: 412,
    averageRR: 2.7,
    specialityPairs: ["EUR/USD", "GBP/USD", "XAU/USD"],
    specialitySessions: ["London", "NY AM"],
    signature: "Liquidity-grab + FVG retracement, London killzone only.",
    mentees: 1840,
    tier: "premium",
    slug: "daniel-cohen",
    followed: true,
    groupId: "group.morning-floor",
    sessionWindow: "London",
    style: "day",
    instruments: ["EUR/USD", "GBP/USD", "XAU/USD"],
    averageR: 1.6,
    tradeFrequencyPerWeek: 9,
    riskDisciplineScore: 87,
    temperament: "Patient · Probability-first · Rule-bound",
    temperamentTags: ["patient", "rule-bound", "probability-first", "session-patient", "teaches-clearly"],
    watchedCount: 1840,
    comparisonCount: 12,
    growthStageFit: ["consistent", "scaling"],
    primaryMarketBias: "Trend-following · DXY-aware",
    riskProfile: "Tight stops · uniform 0.5R · 1R per setup max",
    lastTenTrades: TRADES_COHEN,
  },
  {
    id: "mentor.alvarez",
    name: "Mateo Álvarez",
    monogram: "MA",
    archetype: "SMC",
    years: 7,
    winRate: 68,
    sampleSize: 502,
    averageRR: 2.2,
    specialityPairs: ["EUR/USD", "US30", "NAS100"],
    specialitySessions: ["London", "NY AM"],
    signature: "Order-block + BPR continuation, indices favoured.",
    mentees: 2410,
    tier: "free",
    slug: "mateo-alvarez",
    followed: true,
    groupId: "group.morning-floor",
    sessionWindow: "London",
    style: "day",
    instruments: ["EUR/USD", "US30", "NAS100"],
    averageR: 1.3,
    tradeFrequencyPerWeek: 14,
    riskDisciplineScore: 78,
    temperament: "Methodical · Indices-tilted · Trend-friendly",
    temperamentTags: ["methodical", "rule-bound", "discretionary", "teaches-clearly"],
    watchedCount: 2410,
    comparisonCount: 9,
    growthStageFit: ["starter", "consistent"],
    primaryMarketBias: "Continuation · indices > FX",
    riskProfile: "Adaptive stops · 0.5–0.75R · partials at 1R",
    lastTenTrades: TRADES_ALVAREZ,
  },
  /* ── Followed only (not in user's group) ──────────────────────────── */
  {
    id: "mentor.takeda",
    name: "Yumi Takeda",
    monogram: "YT",
    archetype: "Wyckoff",
    years: 9,
    winRate: 64,
    sampleSize: 318,
    averageRR: 3.1,
    specialityPairs: ["USD/JPY", "GBP/JPY", "EUR/JPY"],
    specialitySessions: ["Tokyo", "London"],
    signature: "Spring + accumulation phase entries on JPY crosses.",
    mentees: 920,
    tier: "pro",
    slug: "yumi-takeda",
    followed: true,
    sessionWindow: "Asia",
    style: "swing",
    instruments: ["USD/JPY", "GBP/JPY", "EUR/JPY"],
    averageR: 2.0,
    tradeFrequencyPerWeek: 4,
    riskDisciplineScore: 84,
    temperament: "Patient · Phase-aware · Drawdown-resilient",
    temperamentTags: ["patient", "drawdown-resilient", "probability-first", "session-patient"],
    watchedCount: 920,
    comparisonCount: 6,
    growthStageFit: ["consistent", "scaling"],
    primaryMarketBias: "JPY-crosses · BoJ-aware",
    riskProfile: "Wider stops · 1R uniform · multi-session holds",
    lastTenTrades: TRADES_TAKEDA,
  },
  {
    id: "mentor.picasso",
    name: "Lucien Picasso",
    monogram: "LP",
    archetype: "Price Action",
    years: 13,
    winRate: 73,
    sampleSize: 612,
    averageRR: 1.7,
    specialityPairs: ["EUR/USD", "GBP/USD", "XAU/USD"],
    specialitySessions: ["London"],
    signature: "Range-fade and mean-reversion in London — high frequency, tight risk.",
    mentees: 1620,
    tier: "premium",
    slug: "lucien-picasso",
    followed: true,
    groupId: "group.morning-floor",
    sessionWindow: "London",
    style: "scalp",
    instruments: ["EUR/USD", "GBP/USD", "XAU/USD"],
    averageR: 1.0,
    tradeFrequencyPerWeek: 22,
    riskDisciplineScore: 91,
    temperament: "Patient · Mean-reversion · Tight-risk",
    temperamentTags: ["patient", "rule-bound", "probability-first", "disciplined", "session-patient", "teaches-clearly"],
    watchedCount: 1620,
    comparisonCount: 18,
    growthStageFit: ["starter", "consistent"],
    primaryMarketBias: "Mean-reversion · range-bound days",
    riskProfile: "Very tight stops · 0.5R uniform · partials early",
    lastTenTrades: TRADES_PICASSO,
  },
  /* ── Library only (not followed, not in group) ────────────────────── */
  {
    id: "mentor.girard",
    name: "Henri Girard",
    monogram: "HG",
    archetype: "Macro",
    years: 16,
    winRate: 56,
    sampleSize: 188,
    averageRR: 4.6,
    specialityPairs: ["BTC/USD", "NAS100", "USOIL"],
    specialitySessions: ["NY PM"],
    signature: "Aggressive macro continuation — fewer trades, larger R, higher variance.",
    mentees: 740,
    tier: "premium",
    slug: "henri-girard",
    followed: false,
    sessionWindow: "NY PM",
    style: "swing",
    instruments: ["BTC/USD", "NAS100", "USOIL"],
    averageR: 2.4,
    tradeFrequencyPerWeek: 3,
    riskDisciplineScore: 68,
    temperament: "Aggressive · Conviction-led · Drawdown-tolerant",
    temperamentTags: ["aggressive", "discretionary", "drawdown-resilient", "probability-first"],
    watchedCount: 740,
    comparisonCount: 2,
    growthStageFit: ["scaling"],
    primaryMarketBias: "Macro continuation · risk-on rotations",
    riskProfile: "Wider stops · 1.5R uniform · long holds",
    lastTenTrades: TRADES_GIRARD,
  },
  {
    id: "mentor.okafor",
    name: "Kelechi Okafor",
    monogram: "KO",
    archetype: "Macro",
    years: 14,
    winRate: 58,
    sampleSize: 226,
    averageRR: 4.2,
    specialityPairs: ["EUR/USD", "DXY", "XAU/USD"],
    specialitySessions: ["NY AM"],
    signature: "Cross-asset macro reads — slow setups, deep R:R.",
    mentees: 540,
    tier: "premium",
    slug: "kelechi-okafor",
    followed: false,
    sessionWindow: "NY AM",
    style: "position",
    instruments: ["EUR/USD", "DXY", "XAU/USD"],
    averageR: 2.6,
    tradeFrequencyPerWeek: 2,
    riskDisciplineScore: 81,
    temperament: "Patient · Cross-asset · Probability-led",
    temperamentTags: ["patient", "probability-first", "drawdown-resilient", "methodical"],
    watchedCount: 540,
    comparisonCount: 1,
    growthStageFit: ["consistent", "scaling"],
    primaryMarketBias: "DXY-cycle · cross-asset confluence",
    riskProfile: "Wider stops · 1R uniform · multi-day holds",
    lastTenTrades: TRADES_OKAFOR,
  },
  {
    id: "mentor.nakamura",
    name: "Hina Nakamura",
    monogram: "HN",
    archetype: "Algorithmic",
    years: 8,
    winRate: 62,
    sampleSize: 1040,
    averageRR: 1.5,
    specialityPairs: ["USD/JPY", "GBP/JPY", "EUR/JPY"],
    specialitySessions: ["Tokyo"],
    signature: "Algorithmic Asia-session fade — high sample, tight stops.",
    mentees: 380,
    tier: "pro",
    slug: "hina-nakamura",
    followed: false,
    sessionWindow: "Asia",
    style: "scalp",
    instruments: ["USD/JPY", "GBP/JPY", "EUR/JPY"],
    averageR: 0.7,
    tradeFrequencyPerWeek: 28,
    riskDisciplineScore: 94,
    temperament: "Methodical · Rule-bound · Sample-driven",
    temperamentTags: ["methodical", "disciplined", "rule-bound", "probability-first"],
    watchedCount: 380,
    comparisonCount: 0,
    growthStageFit: ["starter", "consistent"],
    primaryMarketBias: "Mean-reversion · Tokyo session only",
    riskProfile: "Algorithmic stops · 0.5R uniform · sample-driven",
    lastTenTrades: TRADES_NAKAMURA,
  },
  {
    id: "mentor.hayes",
    name: "Owen Hayes",
    monogram: "OH",
    archetype: "Price Action",
    years: 12,
    winRate: 66,
    sampleSize: 290,
    averageRR: 2.9,
    specialityPairs: ["FTSE", "DAX", "NAS100"],
    specialitySessions: ["London", "NY AM"],
    signature: "European-index trend trader — clean trend days only.",
    mentees: 480,
    tier: "pro",
    slug: "owen-hayes",
    followed: false,
    sessionWindow: "London",
    style: "swing",
    instruments: ["FTSE", "DAX", "NAS100"],
    averageR: 1.8,
    tradeFrequencyPerWeek: 5,
    riskDisciplineScore: 80,
    temperament: "Methodical · Patient · Trend-only",
    temperamentTags: ["methodical", "patient", "rule-bound", "probability-first", "session-patient"],
    watchedCount: 480,
    comparisonCount: 0,
    growthStageFit: ["consistent", "scaling"],
    primaryMarketBias: "European indices · trend continuation",
    riskProfile: "Adaptive stops · 1R uniform · multi-session trails",
    lastTenTrades: TRADES_HAYES,
  },
] as const

/**
 * Compute the trader's "fit" for a mentor as a 0-1 score.
 *
 * Score is the fraction of the trader's focus pairs and session focus that
 * the mentor specialises in, averaged. Pure function; deterministic from
 * inputs. Used both to rank mentors in the COMPARE flow and to render the
 * "MATCH 82%" pill inline on each mentor card.
 */
export function mentorFitScore(
  mentor: MentorProfile,
  focusPairs: readonly string[],
  focusSessions: readonly string[],
): number {
  const pairOverlap =
    focusPairs.length === 0
      ? 0
      : focusPairs.filter((p) => mentor.specialityPairs.includes(p)).length /
        focusPairs.length
  const sessionOverlap =
    focusSessions.length === 0
      ? 0
      : focusSessions.filter((s) => mentor.specialitySessions.includes(s))
          .length / focusSessions.length
  return (pairOverlap + sessionOverlap) / 2
}

/* ─────────────────────────────────────────────────────────────────────────
   2 · PEER PROFILES (anonymised leaderboard sample)

   Every profile is a synthetic but coherent peer — same shape as the user's
   own performance so a side-by-side comparison is meaningful without leaking
   real identifying data. Used by the PROFILE compare flow.
   ───────────────────────────────────────────────────────────────────────── */

export interface PeerProfile {
  id: string
  /** Display handle (anonymised). */
  handle: string
  monogram: string
  rankPercentile: number          // 0..100
  winRate: number
  totalTrades: number
  profitFactor: number
  averageRR: number
  disciplineScore: number
  topPair: string
  topSession: string
  /** Edge over the user — positive means peer is ahead. Computed on the fly. */
}

export const PEER_PROFILES: readonly PeerProfile[] = [
  {
    id: "peer.atlas",
    handle: "@atlas-04",
    monogram: "A4",
    rankPercentile: 96,
    winRate: 71.5,
    totalTrades: 168,
    profitFactor: 2.4,
    averageRR: 2.9,
    disciplineScore: 88,
    topPair: "EUR/USD",
    topSession: "London",
  },
  {
    id: "peer.vega",
    handle: "@vega-22",
    monogram: "V2",
    rankPercentile: 89,
    winRate: 67.2,
    totalTrades: 204,
    profitFactor: 2.1,
    averageRR: 2.4,
    disciplineScore: 81,
    topPair: "XAU/USD",
    topSession: "NY AM",
  },
  {
    id: "peer.koto",
    handle: "@koto-09",
    monogram: "K0",
    rankPercentile: 73,
    winRate: 62.0,
    totalTrades: 132,
    profitFactor: 1.7,
    averageRR: 2.0,
    disciplineScore: 74,
    topPair: "USD/JPY",
    topSession: "Tokyo",
  },
  {
    id: "peer.ren",
    handle: "@ren-17",
    monogram: "R1",
    rankPercentile: 58,
    winRate: 58.5,
    totalTrades: 118,
    profitFactor: 1.4,
    averageRR: 1.8,
    disciplineScore: 67,
    topPair: "GBP/USD",
    topSession: "London",
  },
] as const

/* ─────────────────────────────────────────────────────────────────────────
   3 · STATIC COMMAND CATALOG

   These commands appear in fixed sections inside the dropdown. The Oracle
   resolves the `query` text to a real generator branch in `generateOracleResult`
   in vantary-modules.tsx, so the queries here have to match the keywords that
   branch checks.
   ───────────────────────────────────────────────────────────────────────── */

export type CommandKind =
  | "compare"
  | "analyze"
  | "quick"
  | "suggested"
  | "recent"

export interface CommandItem {
  /** Unique within its section. Used as React key + keyboard target. */
  id: string
  /** What appears in the row (1 line). */
  label: string
  /** Optional one-line context shown beneath the label, dimmed. */
  hint?: string
  /** Lucide icon name — resolved client-side in the console. */
  icon:
    | "scale"
    | "users"
    | "user"
    | "split"
    | "history"
    | "barChart"
    | "trendingUp"
    | "trendingDown"
    | "brain"
    | "flame"
    | "clock"
    | "crosshair"
    | "globe"
    | "calendar"
    | "shield"
    | "target"
    | "zap"
    | "sparkles"
  /** What category of result this resolves to — drives the row's accent. */
  category:
    | "MENTOR"
    | "PROFILE"
    | "ACCOUNT"
    | "STATISTICS"
    | "SESSION"
    | "WATCHLIST"
    | "MACRO"
    | "STRATEGY"
    | "PLAN"
    | "PSYCHOLOGY"
    | "OVERVIEW"
  /** The actual query string submitted to `generateOracleResult`. */
  query: string
  /** Optional inline preview tokens shown on hover (1-line, max 3). */
  previewChips?: readonly string[]
}

export const COMPARE_COMMANDS: readonly CommandItem[] = [
  {
    id: "cmp.mentors",
    label: "Compare mentors",
    hint: "Top 4 mentors ranked by fit to your focus pairs · sessions",
    icon: "users",
    category: "MENTOR",
    query: "compare mentors for me",
    previewChips: ["DC · 71% · ICT", "MA · 68% · SMC", "YT · 64% · WYCKOFF"],
  },
  {
    id: "cmp.profiles",
    label: "Compare my profile to a top peer",
    hint: "Side-by-side with the trader closest to your style · top 5%",
    icon: "user",
    category: "PROFILE",
    query: "compare my profile to a top peer",
    previewChips: ["YOU 64.2%", "@atlas-04 71.5%", "Δ +7.3%"],
  },
  {
    id: "cmp.live-prop",
    label: "Compare live vs prop discipline",
    hint: "Where do they diverge · what closes the gap",
    icon: "split",
    category: "ACCOUNT",
    query: "compare my live and prop discipline",
    previewChips: ["LIVE 72/100", "PROP 85/100", "Δ +13"],
  },
  {
    id: "cmp.weeks",
    label: "This week vs last week",
    hint: "Which sessions, pairs, and rules moved",
    icon: "history",
    category: "STATISTICS",
    query: "compare this week to last week",
    previewChips: ["WR Δ -1.4%", "PF Δ +0.12", "DD Δ -0.6%"],
  },
  {
    id: "cmp.sessions",
    label: "Best session vs worst session",
    hint: "London 72% vs NY PM 48% · what behavioural factors split them",
    icon: "globe",
    category: "SESSION",
    query: "compare best and worst session",
    previewChips: ["London 72%", "NY PM 48%", "Δ -24%"],
  },
] as const

export const ANALYZE_COMMANDS: readonly CommandItem[] = [
  {
    id: "anl.account-stats",
    label: "My account statistics",
    hint: "Drawdown · time-in-market · profit factor · avg duration",
    icon: "barChart",
    category: "STATISTICS",
    query: "show my account statistics",
    previewChips: ["PF 1.82", "DD 2.4%", "TIM 41%"],
  },
  {
    id: "anl.equity",
    label: "My equity curves",
    hint: "Live + prop overlaid · last 90 days",
    icon: "trendingUp",
    category: "ACCOUNT",
    query: "show my equity curves overlaid",
    previewChips: ["+$2,184 · LIVE", "+5.6% · PROP"],
  },
  {
    id: "anl.discipline",
    label: "My discipline trend",
    hint: "30-day score · revenge-trade flags · sleep correlation",
    icon: "brain",
    category: "PSYCHOLOGY",
    query: "show my discipline trend",
    previewChips: ["72/100", "−2.8 vs 30d", "1 streak risk"],
  },
  {
    id: "anl.decay",
    label: "Strategy decay",
    hint: "Which setups have lost edge · when to retire",
    icon: "flame",
    category: "STRATEGY",
    query: "which strategies are decaying?",
    previewChips: ["Breakout 41%", "−$340", "PAUSE"],
  },
  {
    id: "anl.timeofday",
    label: "Time-of-day heatmap",
    hint: "Win-rate by UTC hour across 90 days",
    icon: "clock",
    category: "STATISTICS",
    query: "show my time-of-day performance heatmap",
    previewChips: ["Best 09:00", "Worst 19:00"],
  },
] as const

export const QUICK_COMMANDS: readonly CommandItem[] = [
  { id: "qk.session",  label: "Sessions",   icon: "globe",     category: "SESSION",    query: "what session is upcoming and how do i perform there?" },
  { id: "qk.watch",    label: "Watchlist",  icon: "crosshair", category: "WATCHLIST",  query: "show me my watchlist" },
  { id: "qk.macro",    label: "Macro",      icon: "calendar",  category: "MACRO",      query: "today's macro events" },
  { id: "qk.plan",     label: "Plan",       icon: "shield",    category: "PLAN",       query: "am i on plan today?" },
  { id: "qk.strategy", label: "Strategy",   icon: "target",    category: "STRATEGY",   query: "which strategies are decaying?" },
  { id: "qk.psych",    label: "Psychology", icon: "brain",     category: "PSYCHOLOGY", query: "show my discipline trend" },
] as const

/* ─────────────────────────────────────────────────────────────────────────
   4 · SMART SUGGESTION ENGINE

   Reads the trader's current state and returns 3 prompts ranked by
   relevance. The match score is a 0-100 integer the dropdown shows inline,
   so the trader can tell why a prompt is at the top.

   Heuristics, in order of weight:
     · drawdown band             → STATISTICS / ACCOUNT
     · macro event proximity     → MACRO
     · session boundary          → SESSION
     · weakest pair / setup      → STRATEGY
     · discipline trend          → PSYCHOLOGY

   Pure function — no React, no globals. The caller passes the full state.
   ───────────────────────────────────────────────────────────────────────── */

export interface SmartSuggestion extends CommandItem {
  /** 0-100 — surfaces inline as "MATCH 87%". */
  matchScore: number
  /** Why this prompt is here (1 line, ash colour). */
  reason: string
}

export function getSmartSuggestions({
  utcHour,
  performance,
  psychology,
  plan,
  accounts,
}: {
  utcHour: number
  performance: PerformanceSnapshot
  psychology: PsychologyState
  plan: DailyPlan
  accounts: readonly TradingAccount[]
}): readonly SmartSuggestion[] {
  const out: SmartSuggestion[] = []

  /* Heuristic A — macro proximity ----------------------------------------
     If a high-impact event is < 90 min away, surface a "should I trade…"
     prompt with a high match score. */
  const upcomingHigh = plan.macroEvents
    .map((e) => {
      const [h, m] = e.time.split(":").map(Number)
      let dt = (h ?? 0) + (m ?? 0) / 60 - utcHour
      if (dt < -0.05) dt += 24
      return { e, dt }
    })
    .filter((x) => x.e.impact === "high" && x.dt < 1.5 && x.dt > -0.05)
    .sort((a, b) => a.dt - b.dt)[0]

  if (upcomingHigh) {
    const mins = Math.round(upcomingHigh.dt * 60)
    out.push({
      id: "sug.macro",
      label: `Should I trade ${upcomingHigh.e.currency} pairs into ${upcomingHigh.e.event} in ${mins}m?`,
      hint: `${upcomingHigh.e.time} UTC · plan rule: no trading 30 min before`,
      icon: "calendar",
      category: "MACRO",
      query: `should i trade ${upcomingHigh.e.currency} into ${upcomingHigh.e.event}`,
      previewChips: [`${mins}m left`, "HIGH impact", "EUR pairs"],
      matchScore: 92,
      reason: "High-impact event inside the next 90 minutes",
    })
  }

  /* Heuristic B — weak session / weak pair --------------------------------
     If the trader's worst session is currently active, surface a "why is X
     down?" prompt. Same idea for the worst pair. */
  const sessionBands: Record<string, [number, number]> = {
    Tokyo:    [0, 9],
    London:   [7, 16],
    "NY AM":  [12, 17],
    "NY PM":  [17, 21],
    Sydney:   [21, 24],
  }
  const inWorstSession = (() => {
    const band = sessionBands[performance.worstSession.name]
    if (!band) return false
    return utcHour >= band[0] && utcHour < band[1]
  })()
  if (inWorstSession) {
    out.push({
      id: "sug.weak-session",
      label: `Why is my ${performance.worstSession.name} win-rate at ${performance.worstSession.winRate}%?`,
      hint: `${performance.worstSession.name} is your weakest window — you are inside it now`,
      icon: "trendingDown",
      category: "STATISTICS",
      query: `why is my ${performance.worstSession.name} win-rate down?`,
      previewChips: [
        `${performance.worstSession.winRate}%`,
        `vs best ${performance.bestSession.winRate}%`,
        `Δ -${performance.bestSession.winRate - performance.worstSession.winRate}%`,
      ],
      matchScore: 87,
      reason: "Your weakest session is currently live",
    })
  }

  /* Heuristic C — discipline / consecutive losses -------------------------
     If the trader is on a 2+ loss streak, surface the psychology pattern. */
  if (psychology.consecutiveLosses >= 2 || psychology.revengeTradingRisk !== "low") {
    out.push({
      id: "sug.psych",
      label: "Am I in revenge-trade range right now?",
      hint: `${psychology.consecutiveLosses} consecutive losses · risk band: ${psychology.revengeTradingRisk}`,
      icon: "brain",
      category: "PSYCHOLOGY",
      query: "am i in revenge-trade range",
      previewChips: [
        `${psychology.consecutiveLosses}L streak`,
        `disc ${psychology.disciplineScore}/100`,
        psychology.revengeTradingRisk.toUpperCase(),
      ],
      matchScore: 84,
      reason: `${psychology.consecutiveLosses} consecutive losses`,
    })
  }

  /* Heuristic D — prop drawdown approaching --------------------------------
     If any prop_firm account is ≥ 50% of its drawdown cap, surface the
     account watch-out prompt. */
  const propAtRisk = accounts.find(
    (a) =>
      a.type === "prop_firm" &&
      a.drawdownMax > 0 &&
      a.drawdownCurrent / a.drawdownMax >= 0.5,
  )
  if (propAtRisk) {
    out.push({
      id: "sug.prop-dd",
      label: `${propAtRisk.name} is at ${Math.round((propAtRisk.drawdownCurrent / propAtRisk.drawdownMax) * 100)}% of its drawdown cap`,
      hint: `${propAtRisk.drawdownCurrent}% / ${propAtRisk.drawdownMax}% · what to do next`,
      icon: "shield",
      category: "ACCOUNT",
      query: `am i safe on ${propAtRisk.name}`,
      previewChips: [
        `${propAtRisk.drawdownCurrent}%`,
        `cap ${propAtRisk.drawdownMax}%`,
        propAtRisk.propFirm?.phase.toUpperCase() ?? "PROP",
      ],
      matchScore: 81,
      reason: "Prop drawdown approaching the cap",
    })
  }

  /* Heuristic E — universal fallback --------------------------------------
     Always surface one "compare mentors" prompt with a moderate match score.
     The Oracle should never feel empty even when nothing is acute. */
  out.push({
    id: "sug.mentors",
    label: "Compare mentors who fit my edge",
    hint: `4 mentors ranked by overlap with ${plan.focusPairs.join(" · ")}`,
    icon: "users",
    category: "MENTOR",
    query: "compare mentors for me",
    previewChips: ["DC · 71%", "MA · 68%", "YT · 64%"],
    matchScore: 70,
    reason: "Fit-to-style ranking refreshed every session",
  })

  // Cap to 3 — the dropdown can't host more without losing density.
  return out.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3)
}

/* ─────────────────────────────────────────────────────────────────────────
   5 · FUZZY MATCHER

   Single-pass character-by-character matcher. Returns 0-1.
     · sequential characters scoring higher than scattered ones
     · word-boundary matches scoring higher than mid-word
     · empty query → 1 (everything matches)

   Used for live filter as the user types. Fast enough to run on every
   keystroke against the full catalog.
   ───────────────────────────────────────────────────────────────────────── */

export function fuzzyScore(query: string, target: string): number {
  if (!query) return 1
  const q = query.toLowerCase().trim()
  const t = target.toLowerCase()
  if (!q) return 1
  if (t.includes(q)) return Math.min(1, 0.85 + (q.length / t.length) * 0.15)

  let qi = 0
  let score = 0
  let lastMatchIdx = -1
  let prevChar = ""

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      let bump = 0.6
      if (lastMatchIdx >= 0 && ti === lastMatchIdx + 1) bump += 0.4 // consecutive
      if (prevChar === " " || prevChar === "-" || prevChar === "/") bump += 0.2 // word-boundary
      score += bump
      lastMatchIdx = ti
      qi++
    }
    prevChar = t[ti]
  }
  if (qi < q.length) return 0
  return Math.min(1, score / (q.length * 1.2))
}

/* ─────────────────────────────────────────────────────────────────────────
   6 · UTILITIES — used by the result generator branches in vantary-modules.tsx
   ───────────────────────────────────────────────────────────────────────── */

/** Format a 0-1 score as "MATCH 82%". */
export function fmtMatch(score: number): string {
  return `MATCH ${Math.round(score * 100)}%`
}

/** Clamp + round to one decimal. Used by the comparison result tables. */
export function pct(n: number, d = 1): string {
  return `${n.toFixed(d)}%`
}

/* ═════════════════════════════════════════════════════════════════════════
   7 · COMPARE MENTORS — DECISION-SUPPORT LAYER
   ─────────────────────────────────────────────────────────────────────────
   Pure data + pure functions. Powers the Compare Mentors template inside
   the flight-deck Universal Template Engine.

   Key principles:

     · Compare Mentors is NOT a social ranking widget. It is a decision-
       support surface for choosing whose process should influence the
       trader. Treat the eight axes as behavioural telemetry, not vibes.

     · Single outcomes mean almost nothing. The schedule matrix already
       shows ten trades head-to-head; the helper here surfaces process
       implications, not single-trade verdicts.

     · The compareMentors() helper is deterministic from inputs so the
       same A vs B always renders the same advisory copy.

     · The natural-language path (e.g. "compare picasso to girard") and
       the click path (Mentor Hall → Compare Mentors → pick A & B) MUST
       converge on the same template render. parseMentorCompareIntent()
       detects compare-intent queries and resolves named mentors via
       findMentorByName(); the Compare Mentors template consumes the
       result identically in either path.
   ═════════════════════════════════════════════════════════════════════════ */

/** Quick-lookup of a single mentor by id. */
export function findMentorById(id: string | undefined): MentorProfile | undefined {
  if (!id) return undefined
  return MENTORS.find((m) => m.id === id)
}

/** Fuzzy lookup by user-provided name. Used by the natural-language
 *  classifier to resolve "picasso" → mentor.picasso. Returns the best
 *  match by fuzzyScore, or undefined if nothing scores above 0.4. */
export function findMentorByName(name: string): MentorProfile | undefined {
  const trimmed = name.trim()
  if (!trimmed) return undefined
  const ranked = MENTORS
    .map((m) => {
      const nameScore = fuzzyScore(trimmed, m.name)
      const lastScore = fuzzyScore(trimmed, m.name.split(" ").slice(-1)[0] ?? "")
      const monoScore = trimmed.length <= 3 ? fuzzyScore(trimmed, m.monogram) : 0
      return { m, score: Math.max(nameScore, lastScore, monoScore) }
    })
    .sort((a, b) => b.score - a.score)
  const top = ranked[0]
  if (!top || top.score < 0.4) return undefined
  return top.m
}

/** Single-axis comparison shape — one row of the eight-axis telemetry grid. */
export interface MentorAxisComparison {
  /** Stable id for keying + drill-card crossKey. */
  id:
    | "session"
    | "style"
    | "instruments"
    | "win-rate"
    | "avg-r"
    | "frequency"
    | "discipline"
    | "temperament"
  /** Eyebrow label shown on the card. */
  label: string
  /** Route id prefix for the card (A01..A08). */
  routeId: string
  /** Display values for both mentors. */
  mentorAValue: string
  mentorBValue: string
  /** "A" / "B" / null — who leads on this axis (null = ambiguous / shared). */
  leader: "A" | "B" | null
  /** Numeric delta, signed if applicable. Used to render mini bars / arrows. */
  delta: number | null
  /** Whether the mentors are convergent ("shared") or divergent on this axis. */
  sharedOrDivergent: "shared" | "divergent" | "neutral"
  /** One-line interpretation for the card body. Operational, not vague. */
  shortInterpretation: string
  /** What this axis implies for the user's risk budget. Empty if neutral. */
  riskImplication?: string
  /** What this axis implies for the user's process / cognitive load. */
  processImplication?: string
  /** Hint about which micro-visual the renderer should pick. */
  tinyVisualType:
    | "delta-bar"
    | "shared-chips"
    | "session-chips"
    | "discipline-meter"
    | "frequency-spark"
    | "temperament-vector"
}

/** Top-level comparison summary returned by compareMentors(). */
export interface MentorComparison {
  mentorA: MentorProfile
  mentorB: MentorProfile
  /** Headline for the mission briefing — generated, never canned. */
  headline: string
  /** Operational readout paragraphs that sit under the headline. */
  readout: string[]
  /** Eight-axis grid in display order. */
  axes: readonly MentorAxisComparison[]
  /** Where mentor A is structurally stronger (PRIMARY advisory). */
  mentorAAdvantages: readonly string[]
  /** Where mentor B is structurally stronger (PRIMARY advisory · B variant). */
  mentorBAdvantages: readonly string[]
  /** What the user gives up by switching A→B (RISK advisory). */
  tradeoffs: readonly string[]
  /** Where A and B complement each other (OPPORTUNITY advisory). */
  complementaryZones: readonly string[]
  /** Behavioural risk warnings about mismatch / dependency. */
  riskWarnings: readonly string[]
  /** Best-fit recommendation given the user's likely growth stage. */
  bestFitRecommendation: string
  /** Signed delta of fit-score (A − B) given the user's focus. */
  fitScoreDelta: number
  /** Suggested next-best mentor to swap A for, if any. */
  nextBestFitMentorId?: string
}

/* ── Internal helpers — kept private to the comparison engine ────────── */

function leaderOf(aVal: number, bVal: number, eps = 0.0001): "A" | "B" | null {
  if (Math.abs(aVal - bVal) < eps) return null
  return aVal > bVal ? "A" : "B"
}

function leaderInverse(aVal: number, bVal: number, eps = 0.0001): "A" | "B" | null {
  // Lower-is-better axes (e.g. cognitive load proxies). Currently unused but
  // available for future axes like overtrading risk.
  if (Math.abs(aVal - bVal) < eps) return null
  return aVal < bVal ? "A" : "B"
}

function sharedOrDivergentSets(a: readonly string[], b: readonly string[]):
  "shared" | "divergent" | "neutral" {
  if (a.length === 0 || b.length === 0) return "neutral"
  const aset = new Set(a)
  const overlap = b.filter((x) => aset.has(x)).length
  if (overlap === Math.max(a.length, b.length)) return "shared"
  if (overlap === 0) return "divergent"
  return "neutral"
}

function temperamentOverlap(a: readonly string[], b: readonly string[]): number {
  if (a.length === 0 || b.length === 0) return 0
  const aset = new Set(a)
  return b.filter((t) => aset.has(t)).length
}

/** Build the eight-axis grid for two mentors. Determinstic and pure. */
function buildComparisonAxes(a: MentorProfile, b: MentorProfile): readonly MentorAxisComparison[] {
  const aSession = a.sessionWindow ?? a.specialitySessions[0] ?? "—"
  const bSession = b.sessionWindow ?? b.specialitySessions[0] ?? "—"
  const aStyle = a.style ?? "—"
  const bStyle = b.style ?? "—"
  const aInstruments = a.instruments ?? a.specialityPairs
  const bInstruments = b.instruments ?? b.specialityPairs
  const aAvgR = a.averageR ?? a.averageRR / 2
  const bAvgR = b.averageR ?? b.averageRR / 2
  const aFreq = a.tradeFrequencyPerWeek ?? 6
  const bFreq = b.tradeFrequencyPerWeek ?? 6
  const aDisc = a.riskDisciplineScore ?? 70
  const bDisc = b.riskDisciplineScore ?? 70
  const aTags = a.temperamentTags ?? []
  const bTags = b.temperamentTags ?? []

  const axes: MentorAxisComparison[] = [
    {
      id: "session",
      label: "SESSION WINDOW",
      routeId: "A01",
      mentorAValue: aSession,
      mentorBValue: bSession,
      leader: aSession === bSession ? null : null,
      delta: null,
      sharedOrDivergent: aSession === bSession ? "shared" : "divergent",
      shortInterpretation:
        aSession === bSession
          ? `Both anchor in ${aSession}. Overlap is high — direct switch is low-friction.`
          : `${a.name.split(" ")[0]} runs ${aSession}; ${b.name.split(" ")[0]} runs ${bSession}. Switching changes your wake-up.`,
      processImplication:
        aSession === bSession
          ? "Your daily rhythm doesn't change."
          : "Switching means re-mapping your prep window and your screen-time block.",
      tinyVisualType: "session-chips",
    },
    {
      id: "style",
      label: "STYLE",
      routeId: "A02",
      mentorAValue: aStyle.toUpperCase(),
      mentorBValue: bStyle.toUpperCase(),
      leader: aStyle === bStyle ? null : null,
      delta: null,
      sharedOrDivergent: aStyle === bStyle ? "shared" : "divergent",
      shortInterpretation:
        aStyle === bStyle
          ? `Both ${aStyle}. Hold-time and entry rhythm carry across.`
          : `${a.name.split(" ")[0]} is ${aStyle}; ${b.name.split(" ")[0]} is ${bStyle}. Different rhythm — different patience curve.`,
      processImplication:
        aStyle === bStyle
          ? "No retraining of hold-time muscle."
          : "Expect a discretion shift: scalp ⇄ swing requires very different patience.",
      tinyVisualType: "shared-chips",
    },
    {
      id: "instruments",
      label: "INSTRUMENTS",
      routeId: "A03",
      mentorAValue: aInstruments.slice(0, 3).join(" · "),
      mentorBValue: bInstruments.slice(0, 3).join(" · "),
      leader: null,
      delta: null,
      sharedOrDivergent: sharedOrDivergentSets(aInstruments, bInstruments),
      shortInterpretation: (() => {
        const overlap = aInstruments.filter((p) => bInstruments.includes(p))
        if (overlap.length === 0) return "Zero instrument overlap — different markets, different microstructures."
        if (overlap.length >= Math.min(aInstruments.length, bInstruments.length))
          return `Identical instrument focus on ${overlap.slice(0, 2).join(" · ")}.`
        return `Partial overlap on ${overlap.slice(0, 2).join(" · ")}. Diverge on the rest.`
      })(),
      processImplication: "If overlap is zero you'll be re-learning microstructure, not just tweaking style.",
      tinyVisualType: "shared-chips",
    },
    {
      id: "win-rate",
      label: "WIN RATE",
      routeId: "A04",
      mentorAValue: `${a.winRate}%`,
      mentorBValue: `${b.winRate}%`,
      leader: leaderOf(a.winRate, b.winRate),
      delta: a.winRate - b.winRate,
      sharedOrDivergent: Math.abs(a.winRate - b.winRate) <= 3 ? "shared" : "divergent",
      shortInterpretation: (() => {
        const d = Math.round(a.winRate - b.winRate)
        if (Math.abs(d) <= 3) return `Functionally tied at ${a.winRate}% vs ${b.winRate}% — sample noise dominates.`
        const higher = d > 0 ? a : b
        return `${higher.name.split(" ")[0]} prints ${Math.abs(d)} more wins per 100. Verify across the same instrument cluster.`
      })(),
      riskImplication:
        Math.abs(a.winRate - b.winRate) > 5
          ? "A higher win rate at the same R is structurally less stressful for your psychology."
          : undefined,
      tinyVisualType: "delta-bar",
    },
    {
      id: "avg-r",
      label: "AVG R PER TRADE",
      routeId: "A05",
      mentorAValue: aAvgR.toFixed(2) + "R",
      mentorBValue: bAvgR.toFixed(2) + "R",
      leader: leaderOf(aAvgR, bAvgR),
      delta: +(aAvgR - bAvgR).toFixed(2),
      sharedOrDivergent: Math.abs(aAvgR - bAvgR) <= 0.2 ? "shared" : "divergent",
      shortInterpretation: (() => {
        const d = aAvgR - bAvgR
        if (Math.abs(d) <= 0.2) return `Nearly identical R captured per trade — process delta is small.`
        const higher = d > 0 ? a : b
        return `${higher.name.split(" ")[0]} captures ${Math.abs(d).toFixed(2)}R more per trade. Costs more variance.`
      })(),
      riskImplication: aAvgR - bAvgR > 0.5
        ? `Larger R targets mean wider stops and more variance — your account size must absorb that.`
        : aAvgR - bAvgR < -0.5
        ? `Smaller R targets reduce variance but require more frequency to compound.`
        : undefined,
      tinyVisualType: "delta-bar",
    },
    {
      id: "frequency",
      label: "FREQUENCY · TRADES/WK",
      routeId: "A06",
      mentorAValue: `${aFreq}/wk`,
      mentorBValue: `${bFreq}/wk`,
      leader: leaderOf(aFreq, bFreq),
      delta: aFreq - bFreq,
      sharedOrDivergent: Math.abs(aFreq - bFreq) <= 2 ? "shared" : "divergent",
      shortInterpretation: (() => {
        const d = aFreq - bFreq
        if (Math.abs(d) <= 2) return `Similar cadence — ${Math.round((aFreq + bFreq) / 2)}/wk on average.`
        const higher = d > 0 ? a : b
        const lower = d > 0 ? b : a
        return `${higher.name.split(" ")[0]} fires ${Math.round(Math.abs(d))}× more per week than ${lower.name.split(" ")[0]}.`
      })(),
      processImplication:
        Math.abs(aFreq - bFreq) > 5
          ? "High-frequency mentorship demands more screen time and faster rule recall."
          : undefined,
      tinyVisualType: "frequency-spark",
    },
    {
      id: "discipline",
      label: "RISK DISCIPLINE",
      routeId: "A07",
      mentorAValue: `${aDisc}/100`,
      mentorBValue: `${bDisc}/100`,
      leader: leaderOf(aDisc, bDisc),
      delta: aDisc - bDisc,
      sharedOrDivergent: Math.abs(aDisc - bDisc) <= 4 ? "shared" : "divergent",
      shortInterpretation: (() => {
        const d = aDisc - bDisc
        if (Math.abs(d) <= 4) return `Both score in the same band — neither is the loose anchor.`
        const higher = d > 0 ? a : b
        return `${higher.name.split(" ")[0]} runs ${Math.abs(d)} points tighter on stop honour and risk-cap adherence.`
      })(),
      riskImplication:
        Math.abs(aDisc - bDisc) > 8
          ? "A lower-discipline mentor will leak into your behaviour faster than you think."
          : undefined,
      tinyVisualType: "discipline-meter",
    },
    {
      id: "temperament",
      label: "TEMPERAMENT",
      routeId: "A08",
      mentorAValue: a.temperament ?? "—",
      mentorBValue: b.temperament ?? "—",
      leader: null,
      delta: null,
      sharedOrDivergent: temperamentOverlap(aTags, bTags) >= 3 ? "shared" : "divergent",
      shortInterpretation: (() => {
        const overlap = aTags.filter((t) => bTags.includes(t))
        if (overlap.length >= 3) return `Behavioural overlap: ${overlap.slice(0, 3).join(" · ")}.`
        const aOnly = aTags.filter((t) => !bTags.includes(t)).slice(0, 2)
        const bOnly = bTags.filter((t) => !aTags.includes(t)).slice(0, 2)
        return `${a.name.split(" ")[0]}: ${aOnly.join(" · ") || "—"}. ${b.name.split(" ")[0]}: ${bOnly.join(" · ") || "—"}.`
      })(),
      riskImplication:
        bTags.includes("aggressive") && !aTags.includes("aggressive")
          ? `Importing aggression without rule scaffolding tends to break the same week it lands.`
          : undefined,
      processImplication: "Temperament leaks into discretion — match it to your stage, not your fantasy.",
      tinyVisualType: "temperament-vector",
    },
  ]
  return axes
}

/** Build the structured comparison object. Pure. */
export function compareMentors(a: MentorProfile, b: MentorProfile): MentorComparison {
  const axes = buildComparisonAxes(a, b)

  const aDisc = a.riskDisciplineScore ?? 70
  const bDisc = b.riskDisciplineScore ?? 70
  const aAvgR = a.averageR ?? a.averageRR / 2
  const bAvgR = b.averageR ?? b.averageRR / 2
  const aFreq = a.tradeFrequencyPerWeek ?? 6
  const bFreq = b.tradeFrequencyPerWeek ?? 6
  const wrDelta = a.winRate - b.winRate
  const discDelta = aDisc - bDisc
  const rDelta = aAvgR - bAvgR

  // Headline — generated, not canned. Picks the most material delta.
  const headline = (() => {
    const aFirst = a.name.split(" ")[0]
    const bFirst = b.name.split(" ")[0]
    if (Math.abs(discDelta) > 8 && Math.abs(rDelta) > 0.4) {
      const tighter = discDelta > 0 ? aFirst : bFirst
      const wider = rDelta > 0 ? aFirst : bFirst
      return `${tighter} is the cleaner governance fit. ${wider} captures more R but loads more variance.`
    }
    if (Math.abs(wrDelta) > 5) {
      const winner = wrDelta > 0 ? aFirst : bFirst
      const loser = wrDelta > 0 ? bFirst : aFirst
      return `${winner} prints more wins per 100. ${loser} keeps a different curve — verify before switching.`
    }
    if (Math.abs(rDelta) > 0.4) {
      const richer = rDelta > 0 ? aFirst : bFirst
      const tighter = rDelta > 0 ? bFirst : aFirst
      return `${richer} captures more R per trade; ${tighter} runs a tighter, higher-frequency curve.`
    }
    if (Math.abs(discDelta) > 6) {
      const tighter = discDelta > 0 ? aFirst : bFirst
      const looser = discDelta > 0 ? bFirst : aFirst
      return `${tighter} is the cleaner governance fit; ${looser} leans on discretion under pressure.`
    }
    return `${aFirst} and ${bFirst} run different rhythms — overlap is real but the process gap matters more than the score gap.`
  })()

  // Operational readout — what to read across the whole comparison.
  const readout: string[] = []
  if (a.sessionWindow && b.sessionWindow && a.sessionWindow !== b.sessionWindow) {
    readout.push(`Session windows split (${a.sessionWindow} vs ${b.sessionWindow}). Switching changes your wake-up, not just your rules.`)
  }
  if (Math.abs(rDelta) > 0.4) {
    const richer = rDelta > 0 ? a : b
    const tighter = rDelta > 0 ? b : a
    readout.push(`${richer.name.split(" ")[0]} runs the larger-R curve (${(richer.averageR ?? richer.averageRR / 2).toFixed(2)}R). ${tighter.name.split(" ")[0]} runs the higher-frequency curve (${tighter.tradeFrequencyPerWeek ?? "—"}/wk).`)
  }
  if (Math.abs(discDelta) > 6) {
    const tighter = discDelta > 0 ? a : b
    readout.push(`${tighter.name.split(" ")[0]} carries the tighter governance score (${(tighter.riskDisciplineScore ?? 70)}/100) — your rule-set will follow whoever you watch the most.`)
  }
  if (readout.length === 0) {
    readout.push("Telemetry is close. The decision is more about session compatibility and temperament than headline numbers.")
  }
  readout.push("This is a probability and process recommendation, not a guarantee.")

  // Per-mentor advantages.
  const mentorAAdvantages: string[] = []
  const mentorBAdvantages: string[] = []
  if (wrDelta > 3) mentorAAdvantages.push(`Higher win rate at ${a.winRate}% vs ${b.winRate}%.`)
  else if (wrDelta < -3) mentorBAdvantages.push(`Higher win rate at ${b.winRate}% vs ${a.winRate}%.`)
  if (rDelta > 0.3) mentorAAdvantages.push(`Larger R captured per trade (${aAvgR.toFixed(2)}R vs ${bAvgR.toFixed(2)}R).`)
  else if (rDelta < -0.3) mentorBAdvantages.push(`Larger R captured per trade (${bAvgR.toFixed(2)}R vs ${aAvgR.toFixed(2)}R).`)
  if (discDelta > 5) mentorAAdvantages.push(`Tighter governance — ${aDisc}/100 vs ${bDisc}/100.`)
  else if (discDelta < -5) mentorBAdvantages.push(`Tighter governance — ${bDisc}/100 vs ${aDisc}/100.`)
  if (aFreq - bFreq > 4) mentorAAdvantages.push(`More frequent setups — ${aFreq}/wk if you need rep volume.`)
  else if (bFreq - aFreq > 4) mentorBAdvantages.push(`More frequent setups — ${bFreq}/wk if you need rep volume.`)
  if (a.sampleSize > b.sampleSize * 1.4) mentorAAdvantages.push(`Larger verified sample (n=${a.sampleSize}) — telemetry is denser.`)
  if (b.sampleSize > a.sampleSize * 1.4) mentorBAdvantages.push(`Larger verified sample (n=${b.sampleSize}) — telemetry is denser.`)
  if (mentorAAdvantages.length === 0) mentorAAdvantages.push(`Sets the rhythm of your current group — switching costs more than the delta suggests.`)
  if (mentorBAdvantages.length === 0) mentorBAdvantages.push(`Different lens on the same instruments — useful even if you don't switch.`)

  // Tradeoffs (RISK advisory).
  const tradeoffs: string[] = []
  if (b.sessionWindow && a.sessionWindow && a.sessionWindow !== b.sessionWindow) {
    tradeoffs.push(`Lose your ${a.sessionWindow}-session anchor. ${b.name.split(" ")[0]} runs ${b.sessionWindow}.`)
  }
  if (rDelta < -0.4) tradeoffs.push(`Average R drops by ${Math.abs(rDelta).toFixed(2)}R per trade — variance changes shape.`)
  if (discDelta > 5) tradeoffs.push(`Trade governance discipline away — ${b.name.split(" ")[0]} runs ${Math.abs(discDelta)} points looser.`)
  if (aFreq - bFreq > 5) tradeoffs.push(`Cadence drops from ${aFreq}/wk to ${bFreq}/wk — rep volume falls fast.`)
  if (tradeoffs.length === 0) tradeoffs.push(`The visible trade-offs are small. The hidden one is muscle memory — your hands already know ${a.name.split(" ")[0]}'s rhythm.`)

  // Complementary zones (OPPORTUNITY advisory).
  const complementaryZones: string[] = []
  const aInst = a.instruments ?? a.specialityPairs
  const bInst = b.instruments ?? b.specialityPairs
  const overlap = aInst.filter((p) => bInst.includes(p))
  if (overlap.length > 0) {
    complementaryZones.push(`Confluence on ${overlap.slice(0, 2).join(" · ")} — when both agree, signal weight goes up.`)
  } else {
    complementaryZones.push(`Zero instrument overlap — use ${a.name.split(" ")[0]} for ${aInst[0]} and ${b.name.split(" ")[0]} for ${bInst[0]}, never the same trade.`)
  }
  if (a.sessionWindow !== b.sessionWindow) {
    complementaryZones.push(`Different sessions: assign ${a.name.split(" ")[0]} to your ${a.sessionWindow ?? "primary"} window, ${b.name.split(" ")[0]} to ${b.sessionWindow ?? "secondary"}.`)
  }
  if (a.archetype !== b.archetype) {
    complementaryZones.push(`${a.archetype} ⇄ ${b.archetype} disagree-by-design. Where they agree, conviction is real; where they diverge, that's a useful warning signal.`)
  }

  // Behavioural risk warnings.
  const riskWarnings: string[] = []
  const aTags = a.temperamentTags ?? []
  const bTags = b.temperamentTags ?? []
  if (bTags.includes("aggressive") && !aTags.includes("aggressive")) {
    riskWarnings.push(`Importing ${b.name.split(" ")[0]}'s aggression without their rule scaffolding tends to break the same week it lands.`)
  }
  if (aTags.includes("aggressive") && !bTags.includes("aggressive")) {
    riskWarnings.push(`Switching from ${a.name.split(" ")[0]}'s aggression to ${b.name.split(" ")[0]}'s patience demands a real psychology reset, not a config flip.`)
  }
  if (Math.max(a.watchedCount ?? 0, b.watchedCount ?? 0) > 1500) {
    const big = (a.watchedCount ?? 0) > (b.watchedCount ?? 0) ? a : b
    riskWarnings.push(`${big.name.split(" ")[0]}'s call gets watched by ${(big.watchedCount ?? 0).toLocaleString()} traders in real time — herd risk is real on entry chase.`)
  }
  if (riskWarnings.length === 0) {
    riskWarnings.push(`No acute behavioural mismatch detected. The standard caution applies: do not let either mentor become a single point of failure.`)
  }

  // Best-fit recommendation.
  const bestFitRecommendation = (() => {
    const aFirst = a.name.split(" ")[0]
    const bFirst = b.name.split(" ")[0]
    if (discDelta > 8 && wrDelta >= -3) {
      return `${aFirst} is the cleaner governance fit if your current goal is consistency.`
    }
    if (discDelta < -8 && wrDelta <= 3) {
      return `${bFirst} is the cleaner governance fit if your current goal is consistency.`
    }
    if (rDelta > 0.5 && (a.growthStageFit ?? []).includes("scaling")) {
      return `${aFirst} suits a scaling stage — larger R, lower frequency, requires bankroll to absorb variance.`
    }
    if (rDelta < -0.5 && (b.growthStageFit ?? []).includes("scaling")) {
      return `${bFirst} suits a scaling stage — larger R, lower frequency, requires bankroll to absorb variance.`
    }
    return `Run them complementary, not as substitutes — assign one to your primary window, one to a different surface.`
  })()

  // Fit-score delta — favour mentors that overlap user's focus pairs.
  const focusPairs = ["EUR/USD", "GBP/USD", "XAU/USD"]
  const focusSessions = ["London", "NY AM"]
  const fitA = mentorFitScore(a, focusPairs, focusSessions)
  const fitB = mentorFitScore(b, focusPairs, focusSessions)
  const fitScoreDelta = fitA - fitB

  // Next-best-fit suggestion — closest mentor by aggregate similarity to A
  // that isn't B. Used by the drill-forward "Swap A for next-best" action.
  const candidates = MENTORS
    .filter((m) => m.id !== a.id && m.id !== b.id)
    .map((m) => {
      const sessionMatch = m.sessionWindow === a.sessionWindow ? 1 : 0
      const styleMatch = m.style === a.style ? 1 : 0
      const instOverlap = (m.instruments ?? m.specialityPairs).filter((p) => aInst.includes(p)).length
      return {
        m,
        score: sessionMatch * 2 + styleMatch * 1.5 + instOverlap * 0.4 + (m.riskDisciplineScore ?? 70) / 100,
      }
    })
    .sort((x, y) => y.score - x.score)
  const nextBestFitMentorId = candidates[0]?.m.id

  return {
    mentorA: a,
    mentorB: b,
    headline,
    readout,
    axes,
    mentorAAdvantages,
    mentorBAdvantages,
    tradeoffs,
    complementaryZones,
    riskWarnings,
    bestFitRecommendation,
    fitScoreDelta,
    nextBestFitMentorId,
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   8 · NATURAL-LANGUAGE PATH — MENTOR_COMPARE intent parser.

   Detects queries of the form:

     "compare picasso to girard"
     "compare my current mentor picasso to girard"
     "compare Picasso vs Girard"
     "show me Picasso against Girard"
     "who is better for me, Picasso or Girard"
     "compare my mentor to Girard"

   Returns a structured intent with both resolved mentor IDs (or partial
   match if only one was named). The Compare Mentors template consumes
   this and pre-fills the picker. Pure function, no side effects.
   ───────────────────────────────────────────────────────────────────────── */

export interface MentorCompareIntent {
  /** True if the query reads as a mentor-compare intent at all. */
  detected: boolean
  /** Resolved mentor A id, if a name parsed and matched. */
  mentorAId?: string
  /** Resolved mentor B id, if a name parsed and matched. */
  mentorBId?: string
  /** Human-readable hint when only one or zero names matched. */
  resolverNote?: string
  /** Echo of the raw query string for the template's prelude. */
  rawQuery: string
}

const COMPARE_VERBS = [
  "compare", "vs", " v ", "versus", "against", "match", "stack",
]

const MENTOR_HINTS = [
  "mentor", "coach", "teacher", "guru", "trader",
]

/** Strip common filler words so name extraction is cleaner. */
function stripFiller(s: string): string {
  return s
    .replace(/\b(my|the|a|an|to|with|and|or|for|me|this|that|currently|considering)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/** Extract candidate name tokens from the segments around compare words.
 *  Returns the names in order of appearance, max 2. */
function extractNameCandidates(query: string): string[] {
  const cleaned = query.replace(/[?,.!]/g, " ").replace(/\s+/g, " ").trim()
  // Split on the dominant compare verb (vs / against / to / or).
  const splitRegex = /\b(?:vs|versus|against|to|or)\b/gi
  const parts = cleaned.split(splitRegex).map(stripFiller).filter(Boolean)
  if (parts.length < 2) return []

  // The first part typically begins with "compare" — drop the leading verb.
  const first = parts[0].replace(/^\s*(compare|show me|who is better)\s+/i, "").trim()
  const rest = parts.slice(1).join(" ").trim()

  // Pick the LAST 1–2 capitalised-or-known tokens from `first` and the
  // FIRST 1–2 from `rest`. Mentors are usually identified by last name.
  const firstTokens = first.split(/\s+/).filter((t) => /^[A-Za-z][A-Za-z'-]+$/.test(t))
  const restTokens = rest.split(/\s+/).filter((t) => /^[A-Za-z][A-Za-z'-]+$/.test(t))
  const a = firstTokens.slice(-2).join(" ").trim()
  const b = restTokens.slice(0, 2).join(" ").trim()
  const out: string[] = []
  if (a) out.push(a)
  if (b) out.push(b)
  return out
}

/** Detect a mentor-compare intent and resolve named mentors. */
export function parseMentorCompareIntent(query: string): MentorCompareIntent {
  const raw = (query ?? "").trim()
  const q = raw.toLowerCase()
  if (!q) return { detected: false, rawQuery: raw }

  const hasCompareVerb = COMPARE_VERBS.some((v) => q.includes(v))
  const hasMentorHint = MENTOR_HINTS.some((h) => q.includes(h))
  const hasTwoNames = /\b\w+\s+(?:vs|versus|to|against|or)\s+\w+/i.test(q)

  if (!hasCompareVerb && !hasTwoNames) return { detected: false, rawQuery: raw }
  // "compare mentors for me" with no names is a generic Oracle prompt — let
  // it fall through to the existing text-only Oracle answer.
  const looksGeneric = /compare\s+(my\s+)?mentors?$/.test(q) || /compare\s+(my\s+)?mentors?\s+for\s+me/.test(q)
  if (looksGeneric && !hasTwoNames) return { detected: false, rawQuery: raw }

  // Try direct two-name extraction.
  const names = extractNameCandidates(raw)
  const candidates: (MentorProfile | undefined)[] = names.map((n) => findMentorByName(n))
  let mentorA = candidates[0]
  let mentorB = candidates[1]

  // Fallback: scan the whole query for any mentor names directly.
  if (!mentorA || !mentorB) {
    const direct: MentorProfile[] = []
    for (const m of MENTORS) {
      const last = m.name.split(" ").slice(-1)[0]?.toLowerCase()
      if (last && q.includes(last)) direct.push(m)
    }
    if (!mentorA && direct[0]) mentorA = direct[0]
    if (!mentorB && direct[1]) mentorB = direct[1]
    if (!mentorB && direct[0] && direct[0].id !== mentorA?.id) mentorB = direct[0]
  }

  // If user said "my mentor" with no name, pull a followed mentor as A.
  if (!mentorA && /my\s+(current\s+)?mentor/i.test(raw)) {
    mentorA = MENTORS.find((m) => m.followed)
  }

  // Compose resolver hints when ambiguous.
  let resolverNote: string | undefined
  if (mentorA && !mentorB) {
    resolverNote = `I parsed ${mentorA.name} but couldn't resolve the second mentor. Pick one to continue.`
  } else if (!mentorA && mentorB) {
    resolverNote = `I parsed ${mentorB.name} but couldn't resolve the first mentor. Pick one to continue.`
  } else if (!mentorA && !mentorB && hasCompareVerb && hasMentorHint) {
    resolverNote = "I found multiple possible mentor matches. Choose two to continue."
  }

  return {
    detected: true,
    mentorAId: mentorA?.id,
    mentorBId: mentorB?.id,
    resolverNote,
    rawQuery: raw,
  }
}
