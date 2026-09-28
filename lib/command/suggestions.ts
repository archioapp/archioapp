/* ────────────────────────────────────────────────
   ARCHIO COMMAND LAYER — Suggestion Engine
   Generates 3-5 contextual next-step chips per response.
   ──────────────────────────────────────────────── */

import type { IntentClass, SuggestionChip, SuggestionCategory, ExtractedEntity } from "./types"

let chipId = 0
function chip(
  label: string,
  category: SuggestionCategory,
  query?: string,
  route?: string,
): SuggestionChip {
  return { id: `sug-${++chipId}`, label, category, query, route }
}

/* ── Templates by intent ── */

const SHOW_TEMPLATES: SuggestionChip[] = [
  chip("Filter by session", "drill", "Filter these by session"),
  chip("Show only winners", "drill", "Show only winning entries"),
  chip("Compare to average", "compare", "Compare this to my average"),
  chip("View in Forecast Hub", "navigate", undefined, "/forecast"),
  chip("Summarize patterns", "synthesize", "Summarize the patterns in these results"),
]

const COMPARE_TEMPLATES: SuggestionChip[] = [
  chip("Drill into differences", "drill", "What causes the difference?"),
  chip("Expand time range", "drill", "Compare over the last 3 months"),
  chip("Switch comparison", "compare", "Compare different accounts"),
  chip("Export comparison", "action"),
  chip("View raw entries", "navigate", "Show the underlying entries"),
]

const EXPLAIN_TEMPLATES: SuggestionChip[] = [
  chip("Show affected pairs", "drill", "What pairs are affected?"),
  chip("Historical impact", "explain", "Show historical impact of this event"),
  chip("Tie to my plan", "drill", "How does this affect my plan?"),
  chip("Open macro prep", "navigate", undefined, "/intelligence"),
  chip("Run post-event scenario", "action", "Build a post-event scenario"),
]

const GUIDE_TEMPLATES: SuggestionChip[] = [
  chip("Show compliance", "drill", "Show my plan compliance details"),
  chip("Compare plan vs actual", "compare", "Compare my plan vs actual behavior"),
  chip("Check trade count", "drill", "How many trades have I taken today?"),
  chip("Open daily plan", "navigate", undefined, "/dashboard"),
  chip("Activate Reset Mode", "action", "Start a psychology reset"),
]

const DRILL_TEMPLATES: SuggestionChip[] = [
  chip("Compare top vs bottom", "compare", "Compare my best vs worst setups"),
  chip("Cluster by setup", "drill", "Cluster these results by setup type"),
  chip("Extract rules", "synthesize", "Extract trading rules from these patterns"),
  chip("View detailed entries", "navigate", "Show the full journal entries"),
  chip("Save this analysis", "action"),
]

const NAVIGATE_TEMPLATES: SuggestionChip[] = [
  chip("Back to dashboard", "navigate", undefined, "/dashboard"),
  chip("Open in Copilot", "navigate", undefined, "/copilot"),
  chip("View related forecasts", "drill", "Show related forecasts"),
  chip("Compare with others", "compare", "Compare this to similar items"),
]

const TEMPLATE_MAP: Record<IntentClass, SuggestionChip[]> = {
  show: SHOW_TEMPLATES,
  compare: COMPARE_TEMPLATES,
  explain: EXPLAIN_TEMPLATES,
  guide: GUIDE_TEMPLATES,
  drill: DRILL_TEMPLATES,
  navigate: NAVIGATE_TEMPLATES,
}

/* ── Context-Aware Chip Generation ── */

function entitySpecificChips(entities: ExtractedEntity[]): SuggestionChip[] {
  const chips: SuggestionChip[] = []

  const hasMentor = entities.some((e) => e.type === "mentor")
  const hasInstrument = entities.some((e) => e.type === "instrument")
  const hasSession = entities.some((e) => e.type === "session")
  const hasMacro = entities.some((e) => e.type === "macroEvent")
  const hasAccount = entities.some((e) => e.type === "accountType" || e.type === "account")

  if (hasMentor) {
    chips.push(chip("Compare to another mentor", "compare", "Compare this mentor to another"))
    chips.push(chip("View mentor profile", "navigate", "Open mentor profile"))
  }
  if (hasInstrument) {
    const pair = entities.find((e) => e.type === "instrument")?.value
    chips.push(chip(`${pair} forecast history`, "drill", `Show all forecasts on ${pair}`))
  }
  if (hasSession) {
    chips.push(chip("Compare sessions", "compare", "Compare my performance across sessions"))
  }
  if (hasMacro) {
    chips.push(chip("Check my no-trade window", "guide", "Am I in a no-trade window?"))
  }
  if (hasAccount) {
    chips.push(chip("Compare accounts", "compare", "Compare my prop account to personal"))
  }

  return chips
}

/* ── Public API ── */

export function generateSuggestions(
  intent: IntentClass,
  entities: ExtractedEntity[],
  min = 3,
  max = 5,
): SuggestionChip[] {
  // Reset chip ID counter for clean IDs
  chipId = Date.now()

  // Get base templates
  const base = TEMPLATE_MAP[intent] || SHOW_TEMPLATES

  // Get entity-specific chips
  const specific = entitySpecificChips(entities)

  // Merge: prioritize specific, fill with base
  const merged = [...specific, ...base]

  // Deduplicate by label
  const seen = new Set<string>()
  const unique = merged.filter((c) => {
    if (seen.has(c.label)) return false
    seen.add(c.label)
    return true
  })

  // Clamp to min/max
  return unique.slice(0, Math.max(min, Math.min(unique.length, max)))
}
