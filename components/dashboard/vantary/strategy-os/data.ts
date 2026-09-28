/* ═══════════════════════════════════════════════════════════════════════════
 *  STRATEGY OS · DATA MODULE  (EPIC A · FOUNDATION)
 *  ─────────────────────────────────────────────────────────────────────────
 *  This module is the single source of truth for the Strategy OS that lives
 *  inside the LEFT card of the Vantary Live-Equity dashboard. It is a port
 *  of the data-engine that previously lived in
 *
 *      components/copilot/analytics/StrategyAnalytics.tsx
 *
 *  redesigned for VANTARY's editorial language (paper / amber / ash, no
 *  hardcoded emerald, cyan or red — every tone routes through the existing
 *  vantary-theme.ts tokens so a theme switch propagates automatically).
 *
 *  WHAT LIVES HERE
 *  ─────────────────────────────────────────────────────────────────────
 *  · The shape of a single behavioural rule the trader has committed to
 *    (RuleCommitment), including adherence %, weekly history, teaching,
 *    impact when followed, impact when broken, and a per-violation log.
 *  · The shape of an "OS Plan" — a snapshot of strategy state at a point
 *    in time (OPTIMAL / ACTIVE / ALERT). Plans page horizontally in the
 *    header navigator (PLAN 2/3 ◂ ▸).
 *  · The shape of the trader's Capital-of-Week allocation by SYMBOL,
 *    SESSION and DAY — this is the data that fuels the EXPOSURE map and
 *    is what the user explicitly asked us to "mix in" to the Strategy OS.
 *  · The DEMO_RULES (6) that match the screenshot's "6 COMMITMENTS" tile.
 *  · The ALL_AVAILABLE_RULES (~30) library the AddRule picker draws from.
 *  · The OS_TONE map that re-binds the source's emerald/cyan/red roles
 *    onto the VANTARY token surface (amber / paper / ash / paperDim).
 *
 *  WHAT DOES NOT LIVE HERE
 *  ─────────────────────────────────────────────────────────────────────
 *  · No JSX / React imports — keep this module tree-shakeable and reusable
 *    from server components, tests, and storybook.
 *  · No derivation logic — that lives in `derive.ts`. This file is data
 *    structures + fixtures only.
 *  · No state management — that lives in `use-strategy-os.tsx`.
 *
 *  WHY THE SOURCE'S DERIVATION IS NOT REUSED VERBATIM
 *  ─────────────────────────────────────────────────────────────────────
 *  The terminal version derived OS state purely from `StrategyData`
 *  (forecasts, instruments, entryMix). Our version derives it from a
 *  combination of `StrategyData` + `WEEK_DAYS` (the LEFT-card week grid)
 *  + `STRATEGY_RULES` (the existing compact-rules fixture in your-space)
 *  + `TRADER_DNA` (the existing DNA fixture). That fusion is what gives
 *  us the "Strategy OS that reads the whole identity" the user asked for.
 * ═══════════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────────────
   1.  RULE COMMITMENT  ·  the atomic unit of self-discipline
   ─────────────────────────────────────────────────────────────────────── */

/**
 * The five categories a rule can belong to. Each maps to a discipline
 * pillar and is used by the AddRule picker for filtering.
 */
export type RuleCategory =
  | "entry"     // when / how to enter a position
  | "exit"     // when / how to exit a position
  | "risk"     // sizing, drawdown, daily loss limit
  | "session"  // time-of-day / day-of-week scope
  | "mindset"  // psychology / journaling / cooldowns

/**
 * A single behavioural commitment — the trader's contract with themselves.
 * Everything the RULES intel slab renders is a transformation of this type.
 */
export interface RuleCommitment {
  id: string
  rule: string
  category: RuleCategory
  /** 0..100 — percentage of qualifying days the rule was held */
  adherence: number
  /** total breaches counted in the tracking window */
  violations: number
  /** human-readable date of most recent breach, undefined = never breached */
  lastViolation?: string
  /** consecutive days held right now */
  streak: number
  /** longest consecutive streak ever recorded */
  bestStreak: number
  /** size of the tracking window in days */
  totalDaysTracked: number
  /** last 7 days · 1 = held, 0 = breached. Renders as the 7-dot history */
  weeklyHistory: number[]
  /** the wisdom behind the rule — the WHY */
  teaching: string
  /** the upside when the rule is honored — the carrot */
  impactWhenFollowed: string
  /** the downside when the rule is broken — the stick */
  impactWhenBroken: string
  /** prose log of every breach, oldest first */
  violationLog: Array<{ date: string; context: string }>
}

/* ─────────────────────────────────────────────────────────────────────────
   2.  STRATEGY DATA  ·  what the trader has been DOING (orderflow side)
   ─────────────────────────────────────────────────────────────────────── */

/**
 * Mirrors the StrategyData interface in StrategyAnalytics.tsx. Holds the
 * raw counts that the strategic-mirror derivation needs to compute entry
 * quality, structure depth, exposure concentration and dominant currency.
 */
export interface StrategyData {
  counts: {
    scenariosOpen: number
    forecastsOpen: number
    instrumentsActive: number
  }
  entryMix: Array<{ label: "market" | "limit" | "stop"; value: number }>
  timeframes: Array<{ label: string; value: number }>
  topModels: Array<{ label: string; value: number }>
  instruments: Array<{ symbol: string; count: number }>
  openForecasts: Array<{ id: string; instrument: string; status: "draft" | "published"; createdAt: number }>
}

/* ─────────────────────────────────────────────────────────────────────────
   3.  STRATEGIC MIRROR STATE  ·  the derivation output
   ─────────────────────────────────────────────────────────────────────── */

/**
 * The shape of `deriveStrategicMirror()`'s return value. Lifted verbatim
 * from the source — kept identical so any component that depended on the
 * source shape can be ported with zero re-keying.
 */
export interface StrategicMirrorState {
  overallDiscipline: number
  riskGrade: "A" | "B" | "C" | "D"
  entryQuality: number
  structureDepth: number
  /** 0..1 — share of entries that were limit-style (vs market) */
  limitRatio: number
  exposureConcentration: number
  correlationRisk: boolean
  dominantCurrency: string
  dominantPct: number
  weeklyAdherence: number[]
  intentVsAction: { intended: number; actual: number }
}

/* ─────────────────────────────────────────────────────────────────────────
   4.  CAPITAL OF WEEK  ·  the EXPOSURE-section centerpiece
   ─────────────────────────────────────────────────────────────────────── */

/**
 * One slice of weekly capital exposure. Renders as one bar in one stratum.
 * `pct` is normalized 0..1 — the strata sum to 1.0 within their grouping.
 */
export interface CapitalSlice {
  /** stable id for selection / hover-isolate */
  id: string
  /** display label — shown above the bar */
  label: string
  /** 0..1 share of the relevant total */
  pct: number
  /** absolute net P&L for this slice (USD) */
  pl: number
  /** R-multiple cumulative for this slice */
  rMultiple: number
  /** number of trades that hit this slice */
  trades: number
  /** optional subtitle (e.g. session window, day-of-week) */
  detail?: string
}

/**
 * The three strata that the EXPOSURE map renders top-to-bottom.
 * SYMBOL stratum   ·  NQ vs ES vs FX
 * SESSION stratum  ·  LDN-KZ vs NY-AM vs ASIA
 * DAY stratum      ·  MON..SUN, vertically aligned with the LEFT-card week
 */
export interface CapitalOfWeek {
  /** ISO week start date (Monday) for the rendered window */
  weekStart: string
  /** total absolute net P&L across the week (USD) — used as the "100%" */
  totalPl: number
  /** total R-multiple across the week */
  totalR: number
  bySymbol:  CapitalSlice[]
  bySession: CapitalSlice[]
  byDay:     CapitalSlice[]
  /** dominant currency callout, e.g. "USD" + 0..1 weight */
  dominantCurrency: { code: string; weight: number }
  /** correlation risk flag — true when ≥2 strongly correlated bets dominate */
  correlationRisk: boolean
  /** human-readable suggestion ("Exit ES Friday → reduce USD-beta by 18%") */
  suggestion: string
}

/* ─────────────────────────────────────────────────────────────────────────
   5.  OS PLAN VARIANT  ·  the 3 fixture states the navigator pages through
   ─────────────────────────────────────────────────────────────────────── */

/**
 * A "plan" is a snapshot of how the Strategy OS reads at a moment in time.
 * The header navigator (PLAN n/total ◂ ▸) cycles through these. Useful for
 * sanity testing, the guide drawer, and demo storytelling.
 *
 * NB the underlying rules + capital fixtures are SHARED across plans —
 * what differs is which rules show as breached and what the verdict reads.
 * That keeps demo data internally consistent.
 */
export type OsPlanKey = "optimal" | "active" | "alert"

export interface OsPlanVariant {
  key: OsPlanKey
  label: string
  /** one-line summary that appears next to the OPTIMAL/ACTIVE/ALERT chip */
  status: string
  /** adherence overrides applied to DEMO_RULES per-id when this plan is active */
  adherenceOverrides: Record<string, Partial<Pick<RuleCommitment, "adherence" | "streak" | "violations">>>
  /** the verdict line on the RIGHT-card OS-context footer when this plan is active */
  verdict: string
}

/* ─────────────────────────────────────────────────────────────────────────
   6.  OS TONE  ·  binding the source's emerald/cyan/red roles to VANTARY
   ─────────────────────────────────────────────────────────────────────── */

/**
 * Semantic tone keys used by OS sub-components. They are STRINGS rather
 * than direct color values so the consumer (a React component that imports
 * VANTARY from vantary-theme.ts) can resolve them at render time, ensuring
 * theme-switch reactivity. This is the same pattern the rest of the
 * vantary modules use.
 *
 *   discipline → primary accent (amber alias of theme primary)
 *   violation  → paper foreground (a breach is loud but not alarming)
 *   flow       → amberWash (background highlight)
 *   calm       → ashSoft (everything that is not under threat)
 *   optimal    → amber (chip when overallDiscipline ≥ 80)
 *   alert      → paperDim (chip when overallDiscipline < 60)
 *   warning    → paper (chip when overallDiscipline 60-79)
 *
 * Resolver helper lives in derive.ts (`resolveOsTone`).
 */
export const OS_TONE = {
  discipline: "amber",
  violation:  "paper",
  flow:       "amberWash",
  calm:       "ashSoft",
  optimal:    "amber",
  alert:      "paperDim",
  warning:    "paper",
} as const

export type OsToneKey = keyof typeof OS_TONE

/* ─────────────────────────────────────────────────────────────────────────
   7.  DEMO_RULES  ·  the 6 commitments shown in the screenshot
   ─────────────────────────────────────────────────────────────────────── */

/**
 * Six rules — the same six the source DEMO_RULES had. Wording is preserved
 * because the prose carries pedagogical weight. Numbers are left at their
 * source values so adherence-driven derivations agree with the screenshot:
 *
 *   r1  killzone-only          ·  87 / 2  · streak 5 / best 12
 *   r2  HTF-confluence         ·  72 / 4  · streak 2 / best 8
 *   r3  1% risk per trade      ·  94 / 1  · streak 11 / best 21
 *   r4  no trading after a loss·  61 / 6  · streak 0 / best 5    ← the leak
 *   r5  SL before entry        · 100 / 0  · streak 14 / best 14  ← inviolable
 *   r6  max 3 trades / session ·  78 / 3  · streak 3 / best 9
 *
 * Rule r4 is the one that produces the "1 rule below threshold. No trading
 * after a loss at 61%." status sentence the screenshot displays.
 */
export const DEMO_RULES: RuleCommitment[] = [
  {
    id: "r1",
    rule: "Only enter during killzones",
    category: "session",
    adherence: 87,
    violations: 2,
    streak: 5,
    bestStreak: 12,
    totalDaysTracked: 28,
    weeklyHistory: [1, 1, 1, 0, 1, 1, 1],
    lastViolation: "Feb 12",
    teaching:
      "Killzones (London Open, NY Open, NY Close) carry the highest institutional order flow. " +
      "Trading outside these windows means you are competing in thin liquidity where stops get hunted more frequently.",
    impactWhenFollowed:
      "Win rate increases by 18% when entries align with killzone sessions vs off-hours entries.",
    impactWhenBroken:
      "Avg loss per trade is 2.3x larger outside killzones due to erratic price action and wider spreads.",
    violationLog: [
      { date: "Feb 12", context: "Entered EURUSD short during Asian session. Hit SL within 20 minutes on a liquidity sweep." },
      { date: "Jan 29", context: "Took a GBPUSD long at 21:45 UTC. Price chopped sideways for 4 hours before reversing." },
    ],
  },
  {
    id: "r2",
    rule: "Wait for HTF confluence before LTF entry",
    category: "entry",
    adherence: 72,
    violations: 4,
    streak: 2,
    bestStreak: 8,
    totalDaysTracked: 28,
    weeklyHistory: [1, 0, 1, 0, 1, 1, 0],
    lastViolation: "Feb 14",
    teaching:
      "Higher timeframe structure (H4/D1) provides the directional bias. Lower timeframe entries " +
      "without HTF alignment are counter-trend gambling disguised as precision.",
    impactWhenFollowed:
      "Trades with HTF alignment average +1.8R. Without it, average is -0.4R.",
    impactWhenBroken:
      "4 of your last 6 losses came from LTF-only entries where D1 structure was opposing your direction.",
    violationLog: [
      { date: "Feb 14", context: "M15 bearish engulfing on USDJPY but H4 was in a bullish OB. Shorted anyway, stopped out +35 pips above." },
      { date: "Feb 10", context: "Saw M5 BOS on XAUUSD, entered long. D1 was distribution. Stopped -1.2R." },
      { date: "Feb 7",  context: "GBPUSD M15 FVG fill. No H1/H4 POI. Entry worked briefly then reversed." },
      { date: "Feb 1",  context: "NAS100 M5 CHoCH taken without checking weekly range. Counter-trend, lost 0.8R." },
    ],
  },
  {
    id: "r3",
    rule: "Max 1% risk per trade",
    category: "risk",
    adherence: 94,
    violations: 1,
    streak: 11,
    bestStreak: 21,
    totalDaysTracked: 28,
    weeklyHistory: [1, 1, 1, 1, 1, 1, 1],
    lastViolation: "Feb 5",
    teaching:
      "Risk per trade is the only variable you fully control. Exceeding 1% turns a statistical edge " +
      "into a coin flip — one bad streak can destroy a month of gains.",
    impactWhenFollowed:
      "Max drawdown stays under 4%. Recovery from losing streaks takes 3-5 days instead of weeks.",
    impactWhenBroken:
      "The one 2.5% risk trade on Feb 5 caused more drawdown than the previous 8 trades combined.",
    violationLog: [
      { date: "Feb 5", context: "XAUUSD conviction trade. Sized at 2.5% because the setup looked perfect. It was perfect — for the opposite direction. -2.5R." },
    ],
  },
  {
    id: "r4",
    rule: "No trading after a loss",
    category: "mindset",
    adherence: 61,                     // ← the breach driving the screenshot's status sentence
    violations: 6,
    streak: 0,
    bestStreak: 5,
    totalDaysTracked: 28,
    weeklyHistory: [0, 1, 0, 0, 1, 0, 1],
    lastViolation: "Today",
    teaching:
      "After a loss, cortisol spikes and decision-making shifts from rational to emotional. " +
      "The next trade is statistically your worst because you are no longer trading the market — " +
      "you are trading your ego.",
    impactWhenFollowed:
      "Win rate on first trade of next session: 64%. On revenge trade: 28%.",
    impactWhenBroken:
      "Your revenge trades have a collective P&L of -8.4R over 28 days. That is your largest single edge leak.",
    violationLog: [
      { date: "Today",  context: "Lost on EURUSD, immediately re-entered on the next candle. Doubled the loss." },
      { date: "Feb 13", context: "GBPUSD loss followed by GBPJPY trade within 4 minutes. No new analysis. Lost again." },
      { date: "Feb 11", context: "3 consecutive trades after first loss on XAUUSD. Each one larger than the last. -3.1R total." },
      { date: "Feb 9",  context: "Switched from short to long after stop hit. Emotional flip, no structural reason." },
      { date: "Feb 6",  context: "Took NAS100 trade 2 minutes after USDJPY loss. Same session, no cooldown." },
      { date: "Feb 2",  context: "Revenge-shorted EURUSD after a losing long. Twice the size. Lost 1.8R." },
    ],
  },
  {
    id: "r5",
    rule: "Set SL before entry confirmation",
    category: "exit",
    adherence: 100,
    violations: 0,
    streak: 14,
    bestStreak: 14,
    totalDaysTracked: 28,
    weeklyHistory: [1, 1, 1, 1, 1, 1, 1],
    teaching:
      "A trade without a stop loss is not a trade — it is a gamble. Defining your exit before " +
      "entry removes the emotional decision of when to cut, which is where most traders leak edge.",
    impactWhenFollowed:
      "Every trade has defined risk. Worst-case scenario is always quantified before exposure begins.",
    impactWhenBroken:
      "N/A — you have never violated this rule. This is your strongest discipline.",
    violationLog: [],
  },
  {
    id: "r6",
    rule: "Maximum 3 trades per session",
    category: "session",
    adherence: 78,
    violations: 3,
    streak: 3,
    bestStreak: 9,
    totalDaysTracked: 28,
    weeklyHistory: [1, 1, 0, 1, 1, 1, 0],
    lastViolation: "Feb 11",
    teaching:
      "Quality degrades with quantity. After 3 trades, pattern recognition fatigue sets in and you " +
      "start seeing setups that are not there. Each additional trade past 3 has diminishing expected value.",
    impactWhenFollowed:
      "Average R per trade on trades 1-3: +0.6R. Your best days are 2-trade days.",
    impactWhenBroken:
      "Trade #4+ average: -0.3R. The extra trades are not just neutral — they actively destroy edge.",
    violationLog: [
      { date: "Feb 11", context: "5 trades on EURUSD during London. First 2 were wins, last 3 were losses. Net: -0.8R." },
      { date: "Feb 8",  context: "4 trades across pairs. 4th was a boredom trade on USDJPY — no setup, just wanted to be in a position." },
      { date: "Feb 3",  context: "6 trades on NFP day. Overtrading on news. The first trade was the only winner." },
    ],
  },
]

/* ─────────────────────────────────────────────────────────────────────────
   8.  ALL_AVAILABLE_RULES  ·  the 30-row library the picker draws from
   ─────────────────────────────────────────────────────────────────────── */

/**
 * Rule template — what the AddRule picker offers. When the trader adds a
 * template to their commitments, a fresh `RuleCommitment` is hydrated with
 * default counters (adherence 100, streak 0, history [1,1,1,1,1,1,1]).
 */
export interface RuleTemplate {
  rule: string
  category: RuleCategory
  teaching: string
}

export const ALL_AVAILABLE_RULES: RuleTemplate[] = [
  /* ── Entry rules ── */
  { rule: "Only trade with the trend on HTF",        category: "entry", teaching: "Trading with the higher-timeframe trend dramatically increases your probability of success." },
  { rule: "Wait for price to reach a POI before entering", category: "entry", teaching: "Chasing price away from points of interest leads to poor R:R and frequent stop-outs." },
  { rule: "Require minimum 2 confluences per trade", category: "entry", teaching: "Single-reason entries are coin flips. Confluence stacks the odds." },
  { rule: "Only trade BOS/CHoCH confirmed entries",  category: "entry", teaching: "Entering before market structure confirms is anticipation, not reaction." },
  { rule: "Wait for FVG mitigation before entry",    category: "entry", teaching: "Fair value gaps act as magnets. Let price fill the imbalance before committing." },
  { rule: "No counter-trend trades",                 category: "entry", teaching: "Counter-trend trades have lower probability and require tighter management." },
  { rule: "Limit-order entries only",                category: "entry", teaching: "Limit orders force patience and ensure entries at planned levels." },
  { rule: "Require candle close confirmation",       category: "entry", teaching: "Wicks lie, bodies tell the truth. Wait for the close." },

  /* ── Exit rules ── */
  { rule: "Move SL to breakeven after 1R",           category: "exit",  teaching: "Protecting capital after the trade proves you right removes downside risk." },
  { rule: "Take 50% at first target",                category: "exit",  teaching: "Partial profits lock in gains while leaving upside exposure." },
  { rule: "Never move SL further from entry",        category: "exit",  teaching: "Widening stops is hope disguised as risk management." },
  { rule: "Trail stop using structure",              category: "exit",  teaching: "Structure-based trailing adapts to market conditions, not arbitrary pip counts." },
  { rule: "Set TP before entering",                  category: "exit",  teaching: "Defining targets prevents greed from turning winners into losers." },

  /* ── Risk rules ── */
  { rule: "Max 2% total exposure at any time",       category: "risk",  teaching: "Total exposure caps prevent correlated positions from amplifying losses." },
  { rule: "Max 1 trade per pair per session",        category: "risk",  teaching: "Multiple entries on the same pair compound directional risk." },
  { rule: "No trading on high-impact news",          category: "risk",  teaching: "News creates unpredictable volatility. The expected value of trading news is negative." },
  { rule: "Risk-to-reward minimum 1:2",              category: "risk",  teaching: "Below 1:2, you need over 50% win rate to be profitable. Above 1:2, even 40% wins make money." },
  { rule: "Never risk more on losing days",          category: "risk",  teaching: "Increasing risk to recover losses is the fastest path to account destruction." },
  { rule: "Daily loss limit of 3%",                  category: "risk",  teaching: "A hard daily stop prevents one bad day from becoming a catastrophic drawdown." },

  /* ── Session rules ── */
  { rule: "Trade only London and NY sessions",       category: "session", teaching: "These sessions have the highest volume and most reliable institutional price delivery." },
  { rule: "No trading on Fridays after 12 EST",      category: "session", teaching: "Friday afternoon is position unwinding, not new trend creation." },
  { rule: "No trading on Mondays before London",     category: "session", teaching: "Monday Asian session is often manipulation before the real weekly move." },
  { rule: "Maximum 2 hours of screen time per session", category: "session", teaching: "Overexposure to charts degrades pattern recognition and increases impulsive entries." },

  /* ── Mindset rules ── */
  { rule: "Journal every trade within 1 hour",       category: "mindset", teaching: "Immediate journaling captures the emotional state that led to the decision." },
  { rule: "No trading when emotionally compromised", category: "mindset", teaching: "Anger, excitement, FOMO and revenge are all edge destroyers." },
  { rule: "Review rules before each session",        category: "mindset", teaching: "Priming your framework before trading activates disciplined decision-making pathways." },
  { rule: "Accept the loss before entering",         category: "mindset", teaching: "If you cannot emotionally accept the stop loss being hit, the position is too large." },
  { rule: "No trading after 2 consecutive losses",   category: "mindset", teaching: "Two losses signal either a misread day or degrading execution. Step away." },
  { rule: "Meditate or breathe before session",      category: "mindset", teaching: "Calm nervous system = better pattern recognition = better entries." },
]

/* ─────────────────────────────────────────────────────────────────────────
   9.  DEMO_STRATEGY_DATA  ·  fixture matching the screenshot's posture
   ─────────────────────────────────────────────────────────────────────── */

/**
 * Sample StrategyData — a 14-day window where the trader was hybrid between
 * patient sniper (limit-heavy) and reactor (some market entries), with two
 * dominant pairs (EURUSD, NAS100) and a balanced timeframe spread leaning
 * higher-timeframe.
 *
 * Tuned so that `deriveStrategicMirror()` returns:
 *   overallDiscipline ≈ 82      (from the 6-rule average)
 *   limitRatio        ≈ 0.50    (matches "50% USD WEIGHT" tile)
 *   riskGrade         = "B"     (close to A but pulled by correlationRisk)
 *   dominantCurrency  = "USD"
 */
export const DEMO_STRATEGY_DATA: StrategyData = {
  counts: { scenariosOpen: 4, forecastsOpen: 2, instrumentsActive: 6 },
  entryMix: [
    { label: "market", value: 7 },
    { label: "limit",  value: 9 },
    { label: "stop",   value: 2 },
  ],
  timeframes: [
    { label: "M5",  value: 3 },
    { label: "M15", value: 5 },
    { label: "H1",  value: 6 },
    { label: "H4",  value: 4 },
    { label: "D1",  value: 2 },
  ],
  topModels: [
    { label: "SMT Reversal",       value: 6 },
    { label: "PD-Array Sweep",     value: 4 },
    { label: "FVG Mitigation",     value: 3 },
    { label: "Continuation Fail",  value: 2 },
    { label: "OB Retest",          value: 1 },
  ],
  instruments: [
    { symbol: "EURUSD", count: 5 },
    { symbol: "NAS100", count: 4 },
    { symbol: "GBPUSD", count: 3 },
    { symbol: "XAUUSD", count: 2 },
    { symbol: "USDJPY", count: 2 },
    { symbol: "ES",     count: 2 },
  ],
  openForecasts: [
    { id: "f1", instrument: "NAS100", status: "draft",     createdAt: Date.now() - 1000 * 60 * 60 * 6  },
    { id: "f2", instrument: "EURUSD", status: "published", createdAt: Date.now() - 1000 * 60 * 60 * 22 },
  ],
}

/* ─────────────────────────────────────────────────────────────────────────
   10.  DEMO_WEEK_CAPITAL  ·  the Capital-of-Week fixture
   ─────────────────────────────────────────────────────────────────────── */

/**
 * The fixture that fuels the EXPOSURE map. Three strata, each summing to
 * ~1.0. Numbers were chosen so the LEFT-card week grid `WEEK_DAYS` (P&L
 * per day) and this `byDay` stratum render the same shape — the user can
 * see at a glance that the OS is reading the same week.
 *
 * `WEEK_DAYS` (in your-space.tsx, for reference):
 *   MON +92  ·  TUE +214  ·  WED -76  ·  THU +44  ·  FRI 0  ·  SAT 0  ·  SUN 0
 *   Net week = +274 USD across 4 trading days, with TUE the dominant day.
 *
 * The byDay stratum below mirrors that shape with normalized pcts of the
 * absolute-P&L total (|92|+|214|+|76|+|44| = 426).
 */
export const DEMO_WEEK_CAPITAL: CapitalOfWeek = {
  weekStart: "2026-04-27",
  totalPl: 274,
  totalR: 6.4,
  bySymbol: [
    { id: "sym-nq",  label: "NQ",     pct: 0.42, pl: +186, rMultiple: 3.8, trades: 6, detail: "Nasdaq 100 e-mini" },
    { id: "sym-es",  label: "ES",     pct: 0.18, pl:  -32, rMultiple: 0.4, trades: 3, detail: "S&P 500 e-mini" },
    { id: "sym-eur", label: "EURUSD", pct: 0.16, pl:  +58, rMultiple: 1.2, trades: 4, detail: "EUR / USD spot" },
    { id: "sym-gbp", label: "GBPUSD", pct: 0.12, pl:  +24, rMultiple: 0.6, trades: 2, detail: "GBP / USD spot" },
    { id: "sym-au",  label: "XAUUSD", pct: 0.08, pl:  +28, rMultiple: 0.3, trades: 1, detail: "Gold spot" },
    { id: "sym-jpy", label: "USDJPY", pct: 0.04, pl:  +10, rMultiple: 0.1, trades: 1, detail: "USD / JPY spot" },
  ],
  bySession: [
    { id: "ses-ldn",  label: "LDN-KZ", pct: 0.46, pl: +194, rMultiple: 3.9, trades: 7, detail: "06:00–09:00 UTC · the killzone" },
    { id: "ses-nyam", label: "NY-AM",  pct: 0.28, pl:  +52, rMultiple: 1.4, trades: 5, detail: "13:30–15:30 UTC · NY morning" },
    { id: "ses-nypm", label: "NY-PM",  pct: 0.14, pl:  +18, rMultiple: 0.6, trades: 3, detail: "15:30–20:00 UTC · NY afternoon" },
    { id: "ses-pre",  label: "PRE-LDN",pct: 0.08, pl:  -12, rMultiple: 0.2, trades: 1, detail: "04:00–06:00 UTC · early bias" },
    { id: "ses-asia", label: "ASIA",   pct: 0.04, pl:  +22, rMultiple: 0.3, trades: 1, detail: "23:00–04:00 UTC · low edge" },
  ],
  byDay: [
    { id: "day-mon", label: "MON", pct: 0.22, pl:  +92, rMultiple: 1.8, trades: 4, detail: "Monday · range exploration" },
    { id: "day-tue", label: "TUE", pct: 0.50, pl: +214, rMultiple: 3.1, trades: 7, detail: "Tuesday · displacement day" },
    { id: "day-wed", label: "WED", pct: 0.18, pl:  -76, rMultiple: -0.4, trades: 5, detail: "Wednesday · continuation fail" },
    { id: "day-thu", label: "THU", pct: 0.10, pl:  +44, rMultiple: 1.9, trades: 3, detail: "Thursday · pre-Friday distribution" },
    { id: "day-fri", label: "FRI", pct: 0.00, pl:    0, rMultiple: 0,   trades: 0, detail: "Friday · LIVE · waiting for LND-KZ" },
    { id: "day-sat", label: "SAT", pct: 0.00, pl:    0, rMultiple: 0,   trades: 0, detail: "Saturday · market closed" },
    { id: "day-sun", label: "SUN", pct: 0.00, pl:    0, rMultiple: 0,   trades: 0, detail: "Sunday · market closed" },
  ],
  dominantCurrency: { code: "USD", weight: 0.50 },
  correlationRisk: false,
  suggestion:
    "Exit ES Friday → reduce NQ-ES dollar-beta by 18%. Tuesday concentration is healthy: keep it.",
}

/* ─────────────────────────────────────────────────────────────────────────
   11.  OS_PLAN_VARIANTS  ·  the 3 fixture states
   ─────────────────────────────────────────────────────────────────────── */

/**
 * Three plan snapshots the navigator pages through. `optimal` matches the
 * screenshot exactly. `active` represents a mid-discipline week with two
 * rules drifting. `alert` represents a broken-discipline week where four
 * rules are below threshold and the trader should not be trading.
 */
export const OS_PLAN_VARIANTS: OsPlanVariant[] = [
  {
    key: "optimal",
    label: "OPTIMAL",
    status: "1 rule below threshold. No trading after a loss at 61%.",
    adherenceOverrides: {
      // matches the DEMO_RULES baseline exactly
    },
    verdict:
      "Discipline 82, edge intact — one behavioral leak active: revenge trading.",
  },
  {
    key: "active",
    label: "ACTIVE",
    status: "2 rules drifting. Killzone discipline slipped to 74% this week.",
    adherenceOverrides: {
      r1: { adherence: 74, streak: 2 },          // killzone discipline weakening
      r4: { adherence: 55, streak: 0 },          // revenge trading worse
      r6: { adherence: 68, streak: 1 },          // overtrading creeping in
    },
    verdict:
      "Discipline 71, edge thinning — two leaks active. Tighten killzone scope before scale-up.",
  },
  {
    key: "alert",
    label: "ALERT",
    status: "4 rules broken. Stop trading. Re-read the playbook.",
    adherenceOverrides: {
      r1: { adherence: 52, streak: 0 },
      r2: { adherence: 48, streak: 0 },
      r4: { adherence: 38, streak: 0 },
      r6: { adherence: 51, streak: 0 },
    },
    verdict:
      "Discipline 56, edge compromised — four leaks active. Close the platform for 24 hours.",
  },
]

/* ─────────────────────────────────────────────────────────────────────────
   12.  OS STATE  ·  the runtime state the provider exposes
   ─────────────────────────────────────────────────────────────────────── */

/**
 * Which of the 4 INTEL slabs is currently in focus. Drives the tab strip
 * underline + the section-jump behaviour from the nerve-center cards.
 */
export type OsTabKey = "mirror" | "rules" | "exposure" | "dna"

/**
 * Which of the 4 collapsible sections is open in the bottom of the OS.
 * Multiple sections can be open at once — this is a Set, not a single id.
 */
export type OsSectionId = "section-mirror" | "section-rules" | "section-exposure" | "section-dna"

/**
 * The full OS runtime state. This is what `useStrategyOs()` returns under
 * `state`. Every UI sub-component reads from here; nothing reaches into
 * raw fixtures during render.
 *
 * The `derived` sub-object is the output of `deriveOsState()` — discipline
 * score, breached rules, the strategic mirror, capital-of-week, etc. It is
 * computed once per planKey switch + memoized, so re-renders are cheap.
 */
export interface OsState {
  /* — fixtures — */
  rules: RuleCommitment[]
  data: StrategyData
  capital: CapitalOfWeek

  /* — plan navigation — */
  planKey: OsPlanKey
  planIndex: number
  planTotal: number
  plans: OsPlanVariant[]

  /* — UI state — */
  selectedTab: OsTabKey
  /** dow 0..6 (Sun..Sat) of the day cell currently in focus, null = whole-week */
  selectedDow: number | null
  /** ids of currently expanded collapsible sections */
  openSections: Set<OsSectionId>
  /** the rule whose deep-dive panel is expanded inline (null = none) */
  expandedRuleId: string | null
  /** WEEK CAPITAL LENS overlay toggle inside MIRROR + EXPOSURE */
  lensWeekCapital: boolean
  /** AddRule picker visibility */
  pickerOpen: boolean
  /** RuleCommitment id flashing because of a programmatic jump */
  flashRuleId: string | null

  /* — derived (filled by derive.ts) — */
  derived: OsDerived
}

/**
 * The derived layer — pure outputs of derivation functions, memoized.
 * Lifted out into its own type so consumers can pass just the derived
 * piece to leaf components without dragging the whole state object.
 */
export interface OsDerived {
  mirror: StrategicMirrorState
  /** rule-ids whose adherence < 70 */
  breachedRuleIds: string[]
  /** rule-ids whose adherence === 100 (the "INVIOLABLE" tier) */
  inviolableRuleIds: string[]
  /** overall posture verdict */
  posture: "OPTIMAL" | "ACTIVE" | "ALERT"
  /** one-line synthesis line shown on the RIGHT-card OS-context footer */
  contextLine: string
  /** count of nerve-center red-dots that should appear (0..4) */
  redDotCount: number
  /** which nerve cards should display a red-dot warning */
  redDots: { discipline: boolean; commitments: boolean; usdWeight: boolean; execPatience: boolean }
  /** disciplined adherence average rounded for header display */
  disciplineScore: number
  /** count of active commitments */
  commitmentsCount: number
  /** USD weight of the dominant currency expressed as a 0..1 fraction */
  usdWeightPct: number
  /** limit-ratio expressed as a 0..1 fraction (the "EXEC PATIENCE" % chip) */
  execPatiencePct: number
  /** archetype label rendered in the 4th nerve card ("HYBRID" / "SNIPER" / "REACTOR") */
  archetypeLabel: "REACTOR" | "HYBRID" | "SNIPER"
}

/* ─────────────────────────────────────────────────────────────────────────
   13.  CONSTANTS  ·  thresholds + display defaults
   ─────────────────────────────────────────────────────────────────────── */

/** Adherence below this triggers the "below threshold" red dot + status sentence. */
export const OS_BREACH_THRESHOLD = 70

/** Adherence at or above this earns the "INVIOLABLE" tier badge. */
export const OS_INVIOLABLE_THRESHOLD = 100

/** Discipline score thresholds for OPTIMAL / ACTIVE / ALERT chip rendering. */
export const OS_POSTURE_THRESHOLDS = { optimal: 80, active: 60 } as const

/** USD-weight threshold above which the "USD WEIGHT" nerve card lights its red dot. */
export const OS_USD_WEIGHT_RED_DOT = 0.45

/** The visible INTEL slab keys, in display order — used by the tab strip.
 *
 * MIRROR was retired from the visible tab strip per the cockpit-console
 * redesign — its discipline-day data is already encoded in the
 * <DayHoursPresentation/> + <WeekStationsPresentation/> + month/year
 * grids that sit ABOVE the FLIGHT PROFILE bay (and which the trader
 * already drills into via the period picker), so duplicating the same
 * data inside an INTEL tab was redundant.
 *
 * The "mirror" key is intentionally still present in the `OsTabKey`
 * type union and in <ActiveSlab/>'s switch statement, so any legacy
 * JUMP_TO_DAY dispatches still resolve cleanly — they just won't be
 * reachable from the visible UI. Future work can delete those code
 * paths once we're certain no entry-point still calls them. */
export const OS_TABS_ORDER: ReadonlyArray<{ key: OsTabKey; label: string }> = [
  { key: "rules",    label: "RULES"    },
  { key: "exposure", label: "EXPOSURE" },
  { key: "dna",      label: "DNA"      },
] as const
