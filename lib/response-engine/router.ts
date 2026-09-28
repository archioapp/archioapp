/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO RESPONSE ENGINE · ROUTER (deterministic, server-side)
   ───────────────────────────────────────────────────────────────────────────
   Decides mode / room / lenses / template BEFORE the model runs, extending
   the existing `parseIntent` heuristics (lib/command/intent-parser.ts) with
   the masterplan's intent taxonomy. Deterministic routing = instant UI
   feedback (room glow, named thinking) + no "AI decides layout" risk.

   Masterplan section E. BUILD intents are handled CLIENT-side by the
   chamber's existing routeIntent (archio-intelligence.ts) and never reach
   this router.
   ═══════════════════════════════════════════════════════════════════════════ */

import { parseIntent } from "@/lib/command/intent-parser"
import type { ArchioRoute, LensId, RoomId } from "./contract"

/* Signals that promote an instrument-bearing question to a full ANALYSIS. */
const ANALYZE_SIGNALS =
  /\b(what matters|analyz|outlook|setup|bias|brief|deep.?dive|levels?|today|this (week|session)|should i (trade|size|long|short)|worth (trading|watching))\b/i

const REVIEW_SIGNALS = /\b(why did i|post.?mortem|review my (trades|losses|week|day)|what went wrong)\b/i
const SIMULATE_SIGNALS = /\b(what if|drops? \d|falls? \d|crash|scenario|simulate)\b/i
const CHECK_SIGNALS = /\b(can i (take|trade)|am i (allowed|ok)|risk (left|budget|state)|trades? left)\b/i

const LENS_THINKING: Record<LensId, string> = {
  master: "Composing",
  market: "Reading live market state",
  strategy: "Reviewing Strategy OS",
  psychology: "Reading psychology signals",
  portfolio: "Scanning portfolio exposure",
  network: "Searching the network",
  trust: "Checking trust records",
}

/** Normalize a detected instrument entity to a polygon-friendly pair code. */
function normalizeInstrument(v: string): string {
  const up = v.toUpperCase().replace(/[^A-Z0-9]/g, "")
  if (up === "GOLD") return "XAUUSD"
  if (up === "SILVER") return "XAGUSD"
  if (up === "BITCOIN") return "BTCUSD"
  if (up === "ETHEREUM") return "ETHUSD"
  if (up === "DOLLARINDEX") return "DXY"
  return up
}

/* Slash/space-tolerant instrument dictionary — "EUR/USD", "eur usd",
   "EUR-USD" all resolve. Supplements parseIntent's plain matching. */
const INSTRUMENT_CODES = [
  "EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "NZDUSD", "USDCAD",
  "EURGBP", "EURJPY", "GBPJPY", "AUDJPY", "CADJPY", "CHFJPY",
  "EURAUD", "EURNZD", "GBPAUD", "GBPNZD", "GBPCAD", "AUDNZD",
  "XAUUSD", "XAGUSD", "BTCUSD", "ETHUSD", "DXY",
]
const INSTRUMENT_WORDS: Record<string, string> = {
  GOLD: "XAUUSD", SILVER: "XAGUSD", BITCOIN: "BTCUSD", ETHEREUM: "ETHUSD",
}

function detectInstrument(prompt: string): string | null {
  const compact = prompt.toUpperCase().replace(/[^A-Z0-9]/g, "")
  for (const code of INSTRUMENT_CODES) {
    if (compact.includes(code)) return code
  }
  for (const [word, code] of Object.entries(INSTRUMENT_WORDS)) {
    if (compact.includes(word)) return code
  }
  return null
}

export function routeArchio(prompt: string): ArchioRoute {
  const parsed = parseIntent(prompt)
  const instrumentEntity = parsed.entities.find((e) => e.type === "instrument")
  const instrument =
    detectInstrument(prompt) ?? (instrumentEntity ? normalizeInstrument(instrumentEntity.value) : null)

  /* ── REVIEW → Studio · TRADE POST-MORTEM (P3, live) ──────────────────
        "Why did I lose yesterday?" — full ANALYSIS grounded in the
        journal pack. Strategy lens asks "did the edge fail?", psychology
        lens asks "did the human fail?" — the model's verdict enum
        (discipline/execution/strategy/market) answers which. */
  if (REVIEW_SIGNALS.test(prompt)) {
    return {
      intent: "review",
      mode: "analysis",
      room: "studio",
      lenses: ["strategy", "psychology"],
      templateId: "trade-post-mortem",
      thinking: ["Opening your journal", LENS_THINKING.strategy, LENS_THINKING.psychology, "Composing the verdict"],
      instrument,
    }
  }

  /* ── CHECK → Studio quick status ─────────────────────────────────────── */
  if (CHECK_SIGNALS.test(prompt)) {
    return {
      intent: "check",
      mode: "quick",
      room: "studio",
      lenses: ["strategy"],
      templateId: null,
      thinking: [LENS_THINKING.strategy],
      instrument,
    }
  }

  /* ── SIMULATE → Market Floor (Scenario Lab template ships in P3) ─────── */
  if (SIMULATE_SIGNALS.test(prompt) && instrument) {
    return {
      intent: "simulate",
      mode: "quick",
      room: "market-floor",
      lenses: ["portfolio", "market"],
      templateId: null,
      thinking: [LENS_THINKING.portfolio, LENS_THINKING.market],
      instrument,
    }
  }

  /* ── ANALYZE → Market Floor · THE VERTICAL SLICE ─────────────────────
        Instrument + analysis signal (or bare "analyze X") → full ANALYSIS
        mode with the Asset Deep Dive composition, grounded in real
        polygon data. */
  if (instrument && (ANALYZE_SIGNALS.test(prompt) || /\banalyz/i.test(prompt))) {
    return {
      intent: "analyze",
      mode: "analysis",
      room: "market-floor",
      lenses: ["market"],
      templateId: "asset-deep-dive",
      thinking: [LENS_THINKING.market, "Grounding in live prices", "Composing the read"],
      instrument,
    }
  }

  /* ── Instrument mentioned without analysis intent → quick w/ grounding ── */
  if (instrument) {
    return {
      intent: "explain",
      mode: "quick",
      room: "market-floor",
      lenses: ["market"],
      templateId: null,
      thinking: [LENS_THINKING.market],
      instrument,
    }
  }

  /* ── Default: honest conversational QUICK ────────────────────────────── */
  return {
    intent: parsed.intent, // reuse the legacy heuristic label for provenance
    mode: "quick",
    room: null,
    lenses: ["master"],
    templateId: null,
    thinking: [LENS_THINKING.master],
    instrument: null,
  }
}

/* Room display names for provenance whispers + glow targeting. */
export const ROOM_LABEL: Record<RoomId, string> = {
  "market-floor": "Market Floor",
  studio: "The Studio",
  "mentor-hall": "Mentor Hall",
  collective: "The Collective",
}
