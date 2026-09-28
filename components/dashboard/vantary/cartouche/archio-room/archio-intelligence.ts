/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · INTELLIGENCE — the chamber's pure brain (no React, no DOM)
   ───────────────────────────────────────────────────────────────────────────
   Deterministic mock reasoning for the Intelligence Chamber:

     · routeIntent(prompt)  → "conversation" | { build: moduleId }
     · composeAnswer(prompt) → { readout, body, suggestion } (hash-stable,
       so the same question always produces the same answer — no hydration
       or re-render drift)
     · ASSEMBLY_SCRIPTS + MODULE_DATA — staged build logs & fixture data
       consumed by archio-modules.tsx

   Swapping this file for a real agent router later requires zero UI edits:
   the chamber only consumes the exported contracts.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ────────────────────────────────────────────────────────────────────────
   Module registry
   ──────────────────────────────────────────────────────────────────────── */
export type ArchioModuleId =
  | "morning-stack"
  | "decision-feed"
  | "forecast"
  | "risk-pulse"
  | "journal-review"
  | "dashboard-draft"

export type ArchioIntent =
  | { kind: "conversation" }
  | { kind: "build"; moduleId: ArchioModuleId }

/* Matchers are checked in order; first hit wins. The BUILD_VERB fallback
   catches generic "build/show/create …" commands that don't name a module. */
const MODULE_MATCHERS: Array<{ id: ArchioModuleId; re: RegExp }> = [
  { id: "morning-stack",  re: /morning\s*stack|morning\s*brief|start\s*my\s*(day|session)/i },
  { id: "decision-feed",  re: /decision\s*(feed|desk|queue)|what\s*should\s*i\s*(trade|do)\s*(now|today)/i },
  { id: "forecast",       re: /forecast|predict|next\s*week.*(eur|usd|gbp|xau|gold)|(eur|usd|gbp|xau|gold).*next\s*week/i },
  { id: "risk-pulse",     re: /risk\s*(pulse|scan|check|state)|how\s*much\s*risk|exposure/i },
  { id: "journal-review", re: /journal|review\s*my\s*(trades|week|losses)|post[-\s]*mortem/i },
]

const BUILD_VERB = /^\s*(build|show|create|generate|open|make|assemble|draft)\b/i

export function routeIntent(prompt: string): ArchioIntent {
  const p = prompt.trim()
  if (!p) return { kind: "conversation" }
  for (const m of MODULE_MATCHERS) {
    if (m.re.test(p)) return { kind: "build", moduleId: m.id }
  }
  if (BUILD_VERB.test(p)) return { kind: "build", moduleId: "dashboard-draft" }
  return { kind: "conversation" }
}

/* ────────────────────────────────────────────────────────────────────────
   Deterministic conversation composer
   ──────────────────────────────────────────────────────────────────────── */
export interface ComposedAnswer {
  readout:    string   // the 17px headline verdict
  body:       string   // 13px supporting reasoning
  suggestion: string   // fireable next command (pill)
}

/** Tiny stable string hash — same prompt, same voice, every render. */
function hash(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0
  return h
}

const VOICES: ComposedAnswer[] = [
  {
    readout: "Discipline says no — your edge isn't in this window.",
    body: "Cross-referencing your journal against the session engine: your win rate in this exact regime is strong, but your average R drops when you size up before a confirmed break. The risk budget has room, but the structure argues for patience over aggression.",
    suggestion: "Review my trades",
  },
  {
    readout: "The setup is forming — but confirmation is two candles away.",
    body: "Session volatility is compressing into the London open range. Your best entries this month came after the first liquidity sweep, not before it. Holding fire here has historically added +0.4R to your average outcome.",
    suggestion: "Show the session plan",
  },
  {
    readout: "Your data leans yes — with one condition attached.",
    body: "The pair is trading inside your highest-conviction regime and your risk usage today is at zero. The condition: your journal flags degraded execution after 2pm — if this fires late in the session, halve the size and honor the plan.",
    suggestion: "Build my risk pulse",
  },
  {
    readout: "This is a journal question, not a market question.",
    body: "The pattern you're describing appears four times in your last thirty entries — each time preceded by a skipped morning review. The market context is secondary; the process gap is the signal worth trading on.",
    suggestion: "Review my journal",
  },
]

export function composeAnswer(prompt: string): ComposedAnswer {
  return VOICES[hash(prompt.trim().toLowerCase()) % VOICES.length]
}

/* ────────────────────────────────────────────────────────────────────────
   Build-mode assembly scripts (staged mono log lines)
   ──────────────────────────────────────────────────────────────────────── */
export const ASSEMBLY_SCRIPTS: Record<ArchioModuleId, string[]> = {
  "morning-stack": [
    "reading trading DNA · session preferences",
    "pulling watchlist bias + macro calendar",
    "assembling risk state + live rooms",
  ],
  "decision-feed": [
    "scanning open setups against your playbook",
    "ranking by regime fit + session timing",
    "attaching risk-per-trade guidance",
  ],
  "forecast": [
    "loading pair regime + seasonal profile",
    "running scenario spread across sessions",
    "binding confidence bands to your history",
  ],
  "risk-pulse": [
    "reading account exposure + open risk",
    "cross-checking plan limits + phase rules",
    "composing pulse thresholds",
  ],
  "journal-review": [
    "indexing recent entries + tagged emotions",
    "clustering outcomes by setup + session",
    "surfacing the highest-leverage pattern",
  ],
  "dashboard-draft": [
    "parsing requested surfaces",
    "selecting native module primitives",
    "drafting layout for your approval",
  ],
}

/* One-line intent acknowledgement shown while assembling. */
export const BUILD_ACK: Record<ArchioModuleId, string> = {
  "morning-stack":  "Building your Morning Stack from your DNA, watchlist, risk state, and calendar.",
  "decision-feed":  "Assembling your Decision Feed from live setups ranked against your playbook.",
  "forecast":       "Composing the forecast from regime history and your session profile.",
  "risk-pulse":     "Reading exposure and plan limits into a live risk pulse.",
  "journal-review": "Reviewing your journal for the highest-leverage pattern.",
  "dashboard-draft":"Drafting a native module from your command.",
}

/* ────────────────────────────────────────────────────────────────────────
   Module fixture data (typed per module, consumed by archio-modules.tsx)
   ──────────────────────────────────────────────────────────────────────── */
export const MODULE_META: Record<ArchioModuleId, { eyebrow: string; title: string }> = {
  "morning-stack":  { eyebrow: "MORNING STACK",  title: "Your session, staged" },
  "decision-feed":  { eyebrow: "DECISION FEED",  title: "Ranked setups · live" },
  "forecast":       { eyebrow: "FORECAST",       title: "Scenario spread" },
  "risk-pulse":     { eyebrow: "RISK PULSE",     title: "Exposure · live" },
  "journal-review": { eyebrow: "JOURNAL REVIEW", title: "The pattern that pays" },
  "dashboard-draft":{ eyebrow: "MODULE DRAFT",   title: "Drafted from your command" },
}

export const MORNING_STACK = {
  bias: [
    { pair: "EUR/USD", dir: "long" as const,  note: "post-sweep continuation" },
    { pair: "XAU/USD", dir: "short" as const, note: "into weekly supply" },
  ],
  risk:   { usedPct: 0, budgetPct: 3, tradesLeft: 2 },
  events: [
    { time: "08:30", label: "ECB speakers", weight: "high" as const },
    { time: "13:30", label: "US claims",    weight: "med"  as const },
  ],
}

export const DECISION_FEED = [
  { pair: "EUR/USD", setup: "London ORB",      fit: 86, r: "1:2.4", window: "07:30–09:00" },
  { pair: "XAU/USD", setup: "Supply rejection", fit: 71, r: "1:1.8", window: "08:00–11:00" },
  { pair: "GBP/USD", setup: "Range fade",       fit: 58, r: "1:1.5", window: "09:00–12:00" },
]

export const FORECAST = {
  pair: "EUR/USD",
  horizon: "next 5 sessions",
  scenarios: [
    { label: "Base",  prob: 55, path: "grind to 1.1460 into ECB" },
    { label: "Bull",  prob: 27, path: "break + hold 1.1500" },
    { label: "Bear",  prob: 18, path: "sweep 1.1370 then reclaim" },
  ],
}

export const RISK_PULSE = {
  openRiskR: 0.0, dayBudgetR: 1.5, phase: "FTMO Phase 2",
  flags: ["No open positions", "2 trades left in plan", "News window at 08:30"],
}

export const JOURNAL_REVIEW = {
  pattern: "Sizing up before confirmation",
  occurrences: 4, costR: -3.2,
  fix: "Wait for the first 15m close beyond the level — your win rate doubles.",
}
