/* ═══════════════════════════════════════════════════════════════════════════
   ORACLE · PER-ROOM AI SUGGESTION CATALOG + DYNAMIC PROMPT DECK
   ───────────────────────────────────────────────────────────────────────────
   When the Halo Bar arms, each Flight Deck room swaps its navigation
   destinations for two AI suggestions tagged to that room's category.

     MARKET FLOOR  →  Live-market read-outs (signals, forecasts, news,
                       sessions).
     THE STUDIO    →  Authoring intents (drafts, journals, setups).
     MENTOR HALL   →  Mentor comparisons + curriculum picks.
     COLLECTIVE    →  Community / ecosystem / fit analysis.

   The suggestion text is `personaliseSuggestion`-rendered so every
   prompt references the trader's actual state (best pair, current
   streak, next macro event, etc.) instead of generic copy.

   ───────────────────────────────────────────────────────────────────────────
   The DYNAMIC PROMPT DECK is the placeholder text the Halo Bar cycles
   through every ~6 seconds. Each prompt is a function of trader state
   so the bar reads as if the AI is reading Marcus' profile in real
   time.
   ═══════════════════════════════════════════════════════════════════════════ */

export type FlightDeckRoomKey = "market" | "studio" | "mentors" | "review" | "collective"

export interface OracleRoomSuggestion {
  /** Stable id (used as React key and analytics tag). */
  id: string
  /** Short row label rendered in the room (replaces destination label). */
  label: string
  /** Hover tooltip describing what the AI will do. */
  descriptor: string
  /**
   * The actual query sent to the Oracle pipeline when clicked.
   * `personaliseSuggestion` substitutes telemetry tokens (e.g. `{bestPair}`).
   */
  prompt: string
}

/**
 * Trader-state shape that feeds personalised suggestions + dynamic prompts.
 * Mirrors the small TraderTelemetry surface we read from in your-space.tsx —
 * but defined locally here to keep the catalog free of cross-cutting deps.
 */
export interface OraclePersona {
  name: string
  firm: string
  phase: string
  daysLeft: number
  bestPair: string
  worstPair: string
  bestSetup: string
  bestSession: string
  winRate: number
  streakCount: number
  streakType: "win" | "loss" | "neutral"
  nextMacro: string
  nextMacroTime: string
  session: string
  opensIn: string
  isSessionOpen: boolean
  disciplineLevel: string
  focusPairs: readonly string[]
}

/* ─── Token substitution helper ──────────────────────────────────────────
   `{token}` placeholders are resolved against `OraclePersona`. Unknown
   tokens are left as-is so we never silently produce broken copy. */
export function personaliseSuggestion(template: string, persona: OraclePersona): string {
  const tokens: Record<string, string> = {
    name:           persona.name,
    firm:           persona.firm,
    phase:          persona.phase,
    daysLeft:       String(persona.daysLeft),
    bestPair:       persona.bestPair,
    worstPair:      persona.worstPair,
    bestSetup:      persona.bestSetup,
    bestSession:    persona.bestSession,
    winRate:        persona.winRate.toFixed(1),
    streakCount:    String(persona.streakCount),
    streakType:     persona.streakType,
    nextMacro:      persona.nextMacro,
    nextMacroTime:  persona.nextMacroTime,
    session:        persona.session,
    opensIn:        persona.opensIn,
    discipline:     persona.disciplineLevel,
    focusPair1:     persona.focusPairs[0] ?? persona.bestPair,
    focusPair2:     persona.focusPairs[1] ?? persona.bestPair,
  }
  return template.replace(/\{(\w+)\}/g, (_, key) => tokens[key] ?? `{${key}}`)
}

/* ─── Per-room catalog ───────────────────────────────────────────────────
   Two suggestions per room — matches the trader's prior "first 2 only"
   layout decision so the cockpit visually contracts/expands consistently
   between navigation mode and oracle mode. */
export const ORACLE_ROOM_SUGGESTIONS: Record<FlightDeckRoomKey, readonly OracleRoomSuggestion[]> = {
  market: [
    {
      id: "market.signals-bestpair",
      label: "Live signals on {bestPair}",
      descriptor: "Pull the freshest mentor signals streaming for your top pair right now",
      prompt: "Show me the latest live mentor signals on {bestPair} for the {session} session.",
    },
    {
      id: "market.forecasts-window",
      label: "{session} forecasts incoming",
      descriptor: "Aggregate every published forecast tagged to the current trading window",
      prompt: "List every published forecast targeting the {session} session, ranked by mentor accuracy.",
    },
  ],
  studio: [
    {
      id: "studio.draft-forecast",
      label: "Draft forecast for {bestPair}",
      descriptor: "Open the studio with a forecast seeded from your current bias",
      prompt: "Help me draft a {bestPair} forecast for the {session} session using my {bestSetup} setup.",
    },
    {
      id: "studio.publish-signal",
      label: "Publish a signal from this setup",
      descriptor: "Compose a sharable signal from your active read",
      prompt: "Walk me through publishing a signal for my current {bestPair} {bestSetup} setup.",
    },
  ],
  mentors: [
    {
      id: "mentors.compare-style",
      label: "Mentors matching your style",
      descriptor: "Rank mentors by fit to your win-rate profile and pair preferences",
      prompt: "Which mentors most closely match my style — {winRate}% WR, focus on {focusPair1} and {focusPair2}?",
    },
    {
      id: "mentors.audit-best",
      label: "Audit top mentor on {bestPair}",
      descriptor: "Deep-dive the highest-accuracy mentor for your strongest pair",
      prompt: "Audit the top mentor's recent calls on {bestPair} — accuracy, drawdown, and recurring setups.",
    },
  ],
  review: [
    {
      id: "review.discipline-audit",
      label: "Discipline audit · last 30 D",
      descriptor: "Pull a discipline-focused audit of your last 30 days",
      prompt: "Run a discipline audit on my last 30 days — entry quality, stops respected, journal hits.",
    },
    {
      id: "review.streak-pattern",
      label: "Why this {streakType} streak?",
      descriptor: "Surface the common factors behind your current streak",
      prompt: "Why am I on a {streakCount}-trade {streakType} streak? Find the pattern across these trades.",
    },
  ],
  collective: [
    {
      id: "collective.fit-ecosystems",
      label: "Ecosystems that fit you",
      descriptor: "Rank communities by fit to your style and goals",
      prompt: "Rank trading ecosystems by fit to my style — {bestSetup} on {bestPair}, {winRate}% WR.",
    },
    {
      id: "collective.traders-like-me",
      label: "Traders like me",
      descriptor: "Find traders with overlapping pair, session, and setup profiles",
      prompt: "Find traders with overlapping profiles — {bestPair}, {session}, {bestSetup}.",
    },
  ],
}

/* ─── Dynamic prompt deck ────────────────────────────────────────────────
   Cycled by the halo bar every ~6 seconds. Tokens are resolved at render
   time so the bar always reads as if the AI just looked at Marcus' state. */
export const ORACLE_DYNAMIC_PROMPTS: readonly string[] = [
  "{name}, want me to audit your {streakType} streak?",
  "{bestPair} is your strongest pair — want today's plan?",
  "{session} opens in {opensIn}. Preview A+ setups?",
  "{nextMacro} hits at {nextMacroTime} — show plan rules?",
  "Find mentors that match my {bestSetup} on {bestPair}?",
  "{daysLeft} days left in {firm} {phase}. Risk audit?",
  "Why is my discipline reading {discipline}?",
  "Compare this week's trades to last week's?",
  "Find traders with my profile — {winRate}% WR?",
  "Draft a forecast for tomorrow's {session} open?",
] as const

/**
 * Pick the next dynamic prompt from the deck, resolved against persona.
 * Index is provided by the caller so the cycle is deterministic in tests
 * and the halo bar can drive it from a setInterval.
 */
export function getDynamicPrompt(persona: OraclePersona, index: number): string {
  const template = ORACLE_DYNAMIC_PROMPTS[index % ORACLE_DYNAMIC_PROMPTS.length]
  return personaliseSuggestion(template, persona)
}
