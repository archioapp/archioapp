/* ────────────────────────────────────────────────
   ARCHIO COMMAND LAYER — Intent Parser
   Client-side heuristic pre-parser for fast UX.
   The API route uses AI for final classification.
   ──────────────────────────────────────────────── */

import type { IntentClass, ExtractedEntity, ParsedIntent, EntityType } from "./types"

/* ── Known Entity Dictionaries ── */

const SESSIONS = ["london", "ny am", "ny pm", "asia", "sydney", "new york", "tokyo"]
const ACCOUNT_TYPES = ["prop", "personal", "demo", "funded", "phase-1", "phase-2", "phase 1", "phase 2", "live", "ftmo", "myforexfunds", "the5ers"]
const CONFLUENCES = [
  "order block", "ob", "fvg", "fair value gap", "break and retest", "break & retest",
  "displacement", "bos", "break of structure", "choch", "change of character",
  "liquidity sweep", "inducement", "mitigation", "imbalance", "breaker block",
  "rejection block", "supply zone", "demand zone", "golden zone", "fibonacci",
]
const MACRO_EVENTS = ["cpi", "nfp", "fomc", "ecb", "boe", "rba", "gdp", "pmi", "retail sales", "jobless claims", "interest rate", "fed"]
const TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "4h", "daily", "weekly", "monthly", "1d", "1w"]
const DATE_WORDS = ["today", "yesterday", "this week", "last week", "this month", "last month", "last 7 days", "last 30 days", "past week", "past month"]

/* Major / minor FX pairs + indices + crypto */
const INSTRUMENTS = [
  "eurusd", "gbpusd", "usdjpy", "usdchf", "audusd", "nzdusd", "usdcad",
  "eurgbp", "eurjpy", "gbpjpy", "audjpy", "cadjpy", "chfjpy",
  "euraud", "eurnzd", "gbpaud", "gbpnzd", "gbpcad", "audnzd",
  "xauusd", "gold", "silver", "xagusd",
  "nas100", "nasdaq", "us30", "dow", "spx500", "sp500", "us500",
  "btcusd", "ethusd", "bitcoin", "ethereum",
  "dxy", "dollar index",
]

/* ── Intent Detection ── */

const COMPARE_SIGNALS = ["compare", "vs", "versus", "vs.", "against", "difference between", "compared to"]
const EXPLAIN_SIGNALS = ["what is", "what's", "why", "how does", "explain", "what happened", "what pattern"]
const GUIDE_SIGNALS = ["should i", "am i", "my plan", "following my plan", "according to my plan", "what should", "focus on", "rules"]
const DRILL_SIGNALS = ["cluster", "summarize", "extract", "pattern", "which one", "most", "best", "worst", "win rate", "win most", "average r:r"]
const NAVIGATE_SIGNALS = ["open", "go to", "navigate", "show me the", "take me to", "run this in"]
const SHOW_SIGNALS = ["show", "find", "get", "pull up", "list", "display", "what are", "give me"]

function detectIntent(q: string): IntentClass {
  const lower = q.toLowerCase()

  // Order matters: more specific first
  if (COMPARE_SIGNALS.some((s) => lower.includes(s))) return "compare"
  if (GUIDE_SIGNALS.some((s) => lower.includes(s))) return "guide"
  if (EXPLAIN_SIGNALS.some((s) => lower.includes(s))) return "explain"
  if (NAVIGATE_SIGNALS.some((s) => lower.includes(s))) return "navigate"
  if (DRILL_SIGNALS.some((s) => lower.includes(s))) return "drill"
  return "show" // default: user wants to see something
}

/* ── Entity Extraction ── */

function extractEntities(q: string): ExtractedEntity[] {
  const lower = q.toLowerCase()
  const entities: ExtractedEntity[] = []

  // Sessions
  for (const s of SESSIONS) {
    if (lower.includes(s)) {
      entities.push({ type: "session", value: s, confidence: 0.9 })
    }
  }

  // Account types
  for (const a of ACCOUNT_TYPES) {
    if (lower.includes(a)) {
      entities.push({ type: "accountType", value: a, confidence: 0.85 })
    }
  }

  // Confluences
  for (const c of CONFLUENCES) {
    if (lower.includes(c)) {
      entities.push({ type: "confluence", value: c, confidence: 0.9 })
    }
  }

  // Macro events
  for (const m of MACRO_EVENTS) {
    if (lower.includes(m)) {
      entities.push({ type: "macroEvent", value: m.toUpperCase(), confidence: 0.95 })
    }
  }

  // Instruments
  for (const i of INSTRUMENTS) {
    if (lower.includes(i)) {
      entities.push({ type: "instrument", value: i.toUpperCase(), confidence: 0.9 })
    }
  }

  // Timeframes
  for (const t of TIMEFRAMES) {
    if (lower.includes(t)) {
      entities.push({ type: "timeframe", value: t, confidence: 0.85 })
    }
  }

  // Date ranges
  for (const d of DATE_WORDS) {
    if (lower.includes(d)) {
      entities.push({ type: "dateRange", value: d, confidence: 0.8 })
    }
  }

  // Tags (#live, etc.)
  const tagMatches = q.match(/#(\w+)/g)
  if (tagMatches) {
    for (const tag of tagMatches) {
      entities.push({ type: "tag", value: tag, confidence: 0.95 })
    }
  }

  // Plan references
  if (/\b(my plan|my rules|max trades|loss limit|daily plan)\b/i.test(q)) {
    entities.push({ type: "planRef", value: "plan", confidence: 0.9 })
  }

  return entities
}

/* ── Timeframe Resolution ── */

function resolveTimeframe(q: string): string | undefined {
  const lower = q.toLowerCase()
  for (const d of DATE_WORDS) {
    if (lower.includes(d)) return d
  }
  return undefined
}

/* ── Public API ── */

export function parseIntent(query: string): ParsedIntent {
  return {
    intent: detectIntent(query),
    entities: extractEntities(query),
    raw: query,
    timeframe: resolveTimeframe(query),
  }
}
