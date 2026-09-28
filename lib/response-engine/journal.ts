/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO RESPONSE ENGINE · JOURNAL GROUNDING ADAPTER (P3 — post-mortem)
   ───────────────────────────────────────────────────────────────────────────
   The second data pack, proving the engine generalizes beyond market data.

   ADAPTER PATTERN (masterplan §mock/real separation): the engine consumes
   `JournalGrounding` — it does NOT care where trades come from. Today the
   source is a deterministic demo book (`source: "demo-journal"`, honestly
   surfaced in the UI provenance); when Supabase journal tables land, ONLY
   `collectJournalGrounding` changes.

   DETERMINISM: the demo book is seeded by the session date, so re-asking
   "why did I lose yesterday?" mid-demo never shuffles the trades under the
   trader — same day, same tape, same numbers. The model receives these
   trades as the ONLY numbers it may cite (same hard rule as market
   grounding), and its per-trade takes are joined back by `tradeId`.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface JournalTrade {
  id: string
  pair: string
  direction: "long" | "short"
  /** Entry time, HH:MM 24h — session rhythm is a core post-mortem signal. */
  time: string
  session: "london" | "ny" | "asia"
  setup: string
  /** Risk taken on the trade, in R multiples of planned risk (1 = plan). */
  riskR: number
  /** Result in R. Negative = loss. */
  resultR: number
  /** Rule violations logged against this trade. Empty = clean execution. */
  ruleBreaks: string[]
  note: string
}

export interface JournalStats {
  date: string
  trades: number
  wins: number
  losses: number
  netR: number
  avgWinR: number
  avgLossR: number
  ruleBreakCount: number
  /** Net R before/after 13:00 — the discipline-drift telltale. */
  amR: number
  pmR: number
}

export interface JournalGrounding {
  stats: JournalStats
  trades: JournalTrade[]
  /** Deterministic pre-computed patterns — the model may cite these verbatim. */
  patterns: string[]
  asOf: string
  source: "demo-journal" | "supabase"
}

/* ── Deterministic demo book ────────────────────────────────────────────────
   One believable losing day. Numbers are hand-tuned to tell a coherent
   story the model can genuinely reason about: clean morning, tilt after
   the second loss, oversized revenge trade, late unplanned entry. */

const DEMO_TRADES: JournalTrade[] = [
  {
    id: "T1",
    pair: "EURUSD",
    direction: "long",
    time: "08:42",
    session: "london",
    setup: "London open breakout",
    riskR: 1,
    resultR: 1.8,
    ruleBreaks: [],
    note: "Planned A-setup. Entry on confirmed break, partials at 1R.",
  },
  {
    id: "T2",
    pair: "EURUSD",
    direction: "long",
    time: "10:15",
    session: "london",
    setup: "Pullback continuation",
    riskR: 1,
    resultR: -1,
    ruleBreaks: [],
    note: "Valid setup, stopped on news wick. Acceptable loss.",
  },
  {
    id: "T3",
    pair: "GBPUSD",
    direction: "short",
    time: "13:38",
    session: "ny",
    setup: "Range fade",
    riskR: 1,
    resultR: -1,
    ruleBreaks: ["outside playbook pair"],
    note: "Not my primary pair. Took it out of boredom during lunch chop.",
  },
  {
    id: "T4",
    pair: "EURUSD",
    direction: "short",
    time: "14:21",
    session: "ny",
    setup: "Reversal attempt",
    riskR: 2.2,
    resultR: -2.2,
    ruleBreaks: ["size 2.2x plan", "no confirmed structure"],
    note: "Doubled size to win it back. Entered before structure confirmed.",
  },
  {
    id: "T5",
    pair: "EURUSD",
    direction: "long",
    time: "15:47",
    session: "ny",
    setup: "Unplanned momentum chase",
    riskR: 1.4,
    resultR: -0.9,
    ruleBreaks: ["past daily trade limit", "no journal entry pre-trade"],
    note: "Fifth trade against a 3-trade plan. Chased a move already 60% done.",
  },
]

function computeStats(date: string, trades: JournalTrade[]): JournalStats {
  const wins = trades.filter((t) => t.resultR > 0)
  const losses = trades.filter((t) => t.resultR < 0)
  const netR = trades.reduce((s, t) => s + t.resultR, 0)
  const am = trades.filter((t) => Number(t.time.slice(0, 2)) < 13)
  const pm = trades.filter((t) => Number(t.time.slice(0, 2)) >= 13)
  const round = (n: number) => Number(n.toFixed(2))
  return {
    date,
    trades: trades.length,
    wins: wins.length,
    losses: losses.length,
    netR: round(netR),
    avgWinR: round(wins.length ? wins.reduce((s, t) => s + t.resultR, 0) / wins.length : 0),
    avgLossR: round(losses.length ? losses.reduce((s, t) => s + t.resultR, 0) / losses.length : 0),
    ruleBreakCount: trades.reduce((s, t) => s + t.ruleBreaks.length, 0),
    amR: round(am.reduce((s, t) => s + t.resultR, 0)),
    pmR: round(pm.reduce((s, t) => s + t.resultR, 0)),
  }
}

/** Deterministic pattern detection — honest signal the model may cite. */
function detectPatterns(stats: JournalStats, trades: JournalTrade[]): string[] {
  const patterns: string[] = []
  if (stats.amR > 0 && stats.pmR < 0) {
    patterns.push(`Session split: +${stats.amR}R before 13:00, ${stats.pmR}R after — losses are time-clustered, not strategy-wide.`)
  }
  const oversized = trades.filter((t) => t.riskR > 1.2)
  if (oversized.length) {
    patterns.push(`${oversized.length} trade(s) sized above plan (max ${Math.max(...oversized.map((t) => t.riskR))}x) — all after a loss.`)
  }
  const dirty = trades.filter((t) => t.ruleBreaks.length > 0)
  const dirtyR = dirty.reduce((s, t) => s + t.resultR, 0)
  const clean = trades.filter((t) => t.ruleBreaks.length === 0)
  const cleanR = clean.reduce((s, t) => s + t.resultR, 0)
  if (dirty.length && clean.length) {
    patterns.push(
      `Rule-clean trades netted ${cleanR >= 0 ? "+" : ""}${cleanR.toFixed(1)}R; rule-breaking trades netted ${dirtyR.toFixed(1)}R.`,
    )
  }
  const overLimit = trades.length > 3
  if (overLimit) patterns.push(`${trades.length} trades taken against a 3-trade daily plan.`)
  return patterns
}

/** The adapter. Swap the body for a Supabase query when journal tables land. */
export function collectJournalGrounding(): JournalGrounding {
  /* "Yesterday" relative to the session — deterministic per day. */
  const d = new Date()
  d.setDate(d.getDate() - 1)
  const date = d.toISOString().slice(0, 10)
  const stats = computeStats(date, DEMO_TRADES)
  return {
    stats,
    trades: DEMO_TRADES,
    patterns: detectPatterns(stats, DEMO_TRADES),
    asOf: new Date().toISOString(),
    source: "demo-journal",
  }
}
