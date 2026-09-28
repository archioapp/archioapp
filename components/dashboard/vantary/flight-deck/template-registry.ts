/* ═══════════════════════════════════════════════════════════════════════════
 *  TEMPLATE REGISTRY
 *  ─────────────────────────────────────────────────────────────────────────
 *  Maps each of the sixteen flight-deck destination IDs to a Template
 *  descriptor. Fifteen warming descriptors share the polished "coming
 *  online" body inside TemplateShell. The marquee Compare Mentors
 *  destination provides a CustomRenderPlan that delegates to the
 *  CompareMentorsTemplate component.
 *
 *  Each warming descriptor still carries everything a reader needs:
 *      · what it replaces (current legacy surface, if any)
 *      · what decision it helps the trader make
 *      · what sources it expects to consume
 *      · where on the trading rail it connects
 *
 *  This is the single source of truth for the cockpit. The viewport
 *  component reads from here; the click handler in your-space.tsx
 *  reads from here; the natural-language path resolves into here.
 * ═══════════════════════════════════════════════════════════════════════ */

import type {
  TemplateDescriptor,
  FlightDeckTemplateId,
  FlightDeckRoomId,
} from "./template-types"
import { warmingPlan } from "./template-types"

const NOW = new Date()

/* ── Helper to keep warming descriptors compact ────────────────────── */

function warming(args: {
  id: FlightDeckTemplateId
  room: FlightDeckRoomId
  destination: string
  eyebrow: string
  prelude: string
  preludeAnchors?: readonly string[]
  routePrefix: string
  expectedSources: readonly string[]
  replaces: string
  decision: string
  rail: "prep" | "decision" | "execution" | "record" | "review"
  drillForward: TemplateDescriptor["drillForward"]
}): TemplateDescriptor {
  return {
    id: args.id,
    room: args.room,
    destination: args.destination,
    eyebrow: args.eyebrow,
    prelude: args.prelude,
    preludeAnchors: args.preludeAnchors,
    sourceStatus: { kind: "warming", sources: args.expectedSources },
    renderPlan: warmingPlan({
      replaces: args.replaces,
      decision: args.decision,
      expectedSources: args.expectedSources,
      railConnection: args.rail,
    }),
    drillForward: args.drillForward,
    routePrefix: args.routePrefix,
  }
}

/* ── The sixteen ───────────────────────────────────────────────────── */

export const TEMPLATE_REGISTRY: Readonly<Record<FlightDeckTemplateId, TemplateDescriptor>> = {
  /* ─── MARKET FLOOR ─────────────────────────────────────────────── */

  "market.signal-room": warming({
    id: "market.signal-room",
    room: "market",
    destination: "Signal Room",
    eyebrow: "MARKET FLOOR · SIGNAL ROOM · STAGING",
    prelude:
      "Live trade signals streaming from your followed mentors. The Signal Room composes their setups into a single stream you can audit in real time.",
    routePrefix: "M-SIG",
    expectedSources: ["MentorVault", "BrokerLedger", "SignalRelay"],
    replaces: "the legacy mentor signal feed",
    decision: "should I take, watch, or skip this live signal?",
    rail: "decision",
    drillForward: [
      { id: "d1", routeId: "D01", label: "Filter to my session window", urgency: "medium" },
      { id: "d2", routeId: "D02", label: "Open the originating mentor's profile", urgency: "low" },
      { id: "d3", routeId: "D03", label: "Audit similar setups from the last 7 days", urgency: "low" },
      { id: "d4", routeId: "D04", label: "Mute signals during red-folder events", urgency: "medium" },
    ],
  }),

  // ── MARKET FLOOR · Forecast Room — LIVE ────────────────────────────
  // Full forecast hub with feed, my record, leaderboard, and archive.
  // Custom render plan installed; viewport routes to ForecastRoomTemplate.
  "market.forecast-room": {
    id: "market.forecast-room",
    room: "market",
    destination: "Forecast Room",
    eyebrow: "MARKET FLOOR · FORECAST ROOM · LIVE",
    prelude:
      "Published directional forecasts from the platform across pairs, sessions, and timeframes. Browse the feed, track your record, see the leaderboard, and submit new forecasts.",
    routePrefix: "M-FCT",
    sourceStatus: {
      kind: "live",
      sources: ["ForecastVault", "MentorVault", "MacroFeed"],
      refreshedAt: NOW,
    },
    renderPlan: warmingPlan({
      replaces: "the legacy forecast list",
      decision: "which forecast deserves my attention this session?",
      expectedSources: ["ForecastVault", "MentorVault", "MacroFeed"],
      railConnection: "prep",
    }),
    drillForward: [
      { id: "d1", routeId: "D01", label: "Show only forecasts that align with my bias", urgency: "medium" },
      { id: "d2", routeId: "D02", label: "Compare two forecasts on the same pair", urgency: "low" },
      { id: "d3", routeId: "D03", label: "Audit accuracy of this forecaster", urgency: "low" },
      { id: "d4", routeId: "D04", label: "Pin to today's prep checklist", urgency: "medium" },
    ],
  },

  "market.live-charts": warming({
    id: "market.live-charts",
    room: "market",
    destination: "Live Charts",
    eyebrow: "MARKET FLOOR · LIVE CHARTS · STAGING",
    prelude:
      "Multi-timeframe chart workspace on your watchlist instruments. The Live Charts surface persists your overlay setups, alerts, and side-by-side comparisons across sessions.",
    routePrefix: "M-CHT",
    expectedSources: ["MarketDataFeed", "OverlayVault"],
    replaces: "the legacy chart tab",
    decision: "is this setup printing on multiple timeframes right now?",
    rail: "decision",
    drillForward: [
      { id: "d1", routeId: "D01", label: "Sync overlays from my last forecast", urgency: "medium" },
      { id: "d2", routeId: "D02", label: "Open the higher-timeframe context", urgency: "medium" },
      { id: "d3", routeId: "D03", label: "Compare this pair to its correlated leader", urgency: "low" },
      { id: "d4", routeId: "D04", label: "Set an alert at the next liquidity zone", urgency: "low" },
    ],
  }),

  "market.news-wire": warming({
    id: "market.news-wire",
    room: "market",
    destination: "News Wire",
    eyebrow: "MARKET FLOOR · NEWS WIRE · STAGING",
    prelude:
      "Economic events filtered to your watchlist, with a calm priority colour-key and a session-aware countdown. The News Wire is read-only — for action take it to the Studio or Risk Audit.",
    routePrefix: "M-NWS",
    expectedSources: ["MacroFeed", "EconomicCalendar"],
    replaces: "the generic news ticker",
    decision: "should I sit out, lighten, or hold through this event?",
    rail: "prep",
    drillForward: [
      { id: "d1", routeId: "D01", label: "Show only red-folder events in my window", urgency: "high" },
      { id: "d2", routeId: "D02", label: "Cross-reference with my open positions", urgency: "high" },
      { id: "d3", routeId: "D03", label: "Open the Risk Audit before next event", urgency: "medium" },
      { id: "d4", routeId: "D04", label: "Mute signals during this window", urgency: "medium" },
    ],
  }),

  /* ─── THE STUDIO ──────────────────────────────────────�����────────── */

  "studio.create-forecast": warming({
    id: "studio.create-forecast",
    room: "studio",
    destination: "Create Forecast",
    eyebrow: "THE STUDIO · CREATE FORECAST · STAGING",
    prelude:
      "Publish a directional read with rationale, evidence cards, and a falsifiable invalidation. Create Forecast inherits your last Forecast Room context, so the surface arrives pre-loaded.",
    routePrefix: "S-FCT",
    expectedSources: ["ForecastVault", "MarketDataFeed"],
    replaces: "the legacy create-forecast cockpit",
    decision: "what's my read, why, and what would falsify it?",
    rail: "record",
    drillForward: [
      { id: "d1", routeId: "D01", label: "Inherit context from a Forecast Room item", urgency: "low" },
      { id: "d2", routeId: "D02", label: "Attach a chart snapshot from Live Charts", urgency: "medium" },
      { id: "d3", routeId: "D03", label: "Set a follow-up review when invalidated", urgency: "high" },
      { id: "d4", routeId: "D04", label: "Publish privately first, then promote", urgency: "low" },
    ],
  }),

  "studio.publish-signal": warming({
    id: "studio.publish-signal",
    room: "studio",
    destination: "Publish Signal",
    eyebrow: "THE STUDIO · PUBLISH SIGNAL · STAGING",
    prelude:
      "Broadcast a trade setup to your followers with structured risk parameters, an entry zone, and a stop. Publish Signal locks the trade-spec when sent so the audit trail is unambiguous.",
    routePrefix: "S-SIG",
    expectedSources: ["SignalRelay", "BrokerLedger"],
    replaces: "the legacy publish-signal flow",
    decision: "how do I broadcast this clearly without leaking discretion?",
    rail: "record",
    drillForward: [
      { id: "d1", routeId: "D01", label: "Use my Build Setup template", urgency: "medium" },
      { id: "d2", routeId: "D02", label: "Add a session-window restriction", urgency: "medium" },
      { id: "d3", routeId: "D03", label: "Schedule the broadcast for the open", urgency: "low" },
      { id: "d4", routeId: "D04", label: "Post privately to my group only", urgency: "low" },
    ],
  }),

  "studio.journal-entry": warming({
    id: "studio.journal-entry",
    room: "studio",
    destination: "Journal Entry",
    eyebrow: "THE STUDIO · JOURNAL ENTRY · STAGING",
    prelude:
      "Reflect on a decision while it's still fresh. Journal Entry attaches automatically to the most recent execution or prep window, and the surface guides you with mentor-mirrored prompts.",
    routePrefix: "S-JNL",
    expectedSources: ["JournalVault", "BrokerLedger"],
    replaces: "the legacy journal page",
    decision: "what was I right about, and what did I almost not see?",
    rail: "review",
    drillForward: [
      { id: "d1", routeId: "D01", label: "Attach the trade I just closed", urgency: "high" },
      { id: "d2", routeId: "D02", label: "Mirror to a mentor for review", urgency: "low" },
      { id: "d3", routeId: "D03", label: "Tag with a behavioural pattern", urgency: "medium" },
      { id: "d4", routeId: "D04", label: "Schedule a rule-forge follow-up", urgency: "low" },
    ],
  }),

  "studio.build-setup": warming({
    id: "studio.build-setup",
    room: "studio",
    destination: "Build Setup",
    eyebrow: "THE STUDIO · BUILD SETUP · STAGING",
    prelude:
      "Save a reusable setup template with entry rules, invalidation rules, R-target, session window, and mentor lineage. Build Setup feeds the Signal Room and the Journal so your audit is self-consistent.",
    routePrefix: "S-SETUP",
    expectedSources: ["SetupVault", "MentorVault"],
    replaces: "scattered setup notes",
    decision: "how do I codify this so I'll repeat it the same way next week?",
    rail: "prep",
    drillForward: [
      { id: "d1", routeId: "D01", label: "Inherit from a mentor's published setup", urgency: "low" },
      { id: "d2", routeId: "D02", label: "Tag with a session window restriction", urgency: "medium" },
      { id: "d3", routeId: "D03", label: "Add a falsification clause", urgency: "medium" },
      { id: "d4", routeId: "D04", label: "Promote to my Playbook Library", urgency: "low" },
    ],
  }),

  /* ─── MENTOR HALL ──────────────────────────────────────────────── */

  // The marquee. Custom render plan installed by the registry hook in
  // viewport because we can't import a React component from a .ts file
  // without dragging .tsx through. The viewport replaces this entry's
  // renderPlan at runtime with the CompareMentorsTemplate.
  "mentors.compare-mentors": {
    id: "mentors.compare-mentors",
    room: "mentors",
    destination: "Compare Mentors",
    eyebrow: "MENTOR HALL · COMPARE · LIVE",
    prelude:
      "Pick two mentors. The eight-axis telemetry, advisories, and last-ten trades paint side by side.",
    routePrefix: "M-CMP",
    sourceStatus: {
      kind: "live",
      sources: ["MentorVault", "ProofOfEdge", "BrokerLedger"],
      refreshedAt: NOW,
    },
    renderPlan: warmingPlan({
      replaces: "the legacy mentor-compare modal",
      decision: "whose process should influence my process?",
      expectedSources: ["MentorVault", "ProofOfEdge", "BrokerLedger"],
      railConnection: "review",
    }),
    drillForward: [
      { id: "d1", routeId: "D01", label: "Compare both to me", urgency: "medium" },
      { id: "d2", routeId: "D02", label: "Show me where they disagree", urgency: "medium" },
      { id: "d3", routeId: "D03", label: "Swap A for next-best fit", urgency: "low" },
      { id: "d4", routeId: "D04", label: "Replay their last 5 setups", urgency: "low" },
    ],
  },

  "mentors.mentor-library": warming({
    id: "mentors.mentor-library",
    room: "mentors",
    destination: "Mentor Library",
    eyebrow: "MENTOR HALL · LIBRARY · STAGING",
    prelude:
      "Browse every mentor profile and method. The Library carries proof-of-edge verification badges, telemetry summaries, and follow / group affordances.",
    routePrefix: "M-LIB",
    expectedSources: ["MentorVault", "ProofOfEdge"],
    replaces: "the legacy mentor list",
    decision: "who should I add to my followed pool?",
    rail: "review",
    drillForward: [
      { id: "d1", routeId: "D01", label: "Filter to my session window", urgency: "medium" },
      { id: "d2", routeId: "D02", label: "Filter to verified-only mentors", urgency: "high" },
      { id: "d3", routeId: "D03", label: "Compare two from the library", urgency: "medium" },
      { id: "d4", routeId: "D04", label: "Sort by growth-stage fit", urgency: "low" },
    ],
  }),

  "mentors.replay-sessions": warming({
    id: "mentors.replay-sessions",
    room: "mentors",
    destination: "Replay Sessions",
    eyebrow: "MENTOR HALL · REPLAY · STAGING",
    prelude:
      "Watch recorded mentor session breakdowns with synchronised chart overlays and decision callouts. Replay attaches automatically to your prep checklist and journal.",
    routePrefix: "M-RPL",
    expectedSources: ["ReplayVault", "MentorVault"],
    replaces: "the legacy replay tab",
    decision: "what did the mentor see that I missed?",
    rail: "review",
    drillForward: [
      { id: "d1", routeId: "D01", label: "Replay a mentor's biggest miss", urgency: "low" },
      { id: "d2", routeId: "D02", label: "Filter to my open instruments", urgency: "medium" },
      { id: "d3", routeId: "D03", label: "Mirror a callout to my journal", urgency: "high" },
      { id: "d4", routeId: "D04", label: "Open the Insights Vault", urgency: "low" },
    ],
  }),

  "mentors.insights-vault": warming({
    id: "mentors.insights-vault",
    room: "mentors",
    destination: "Insights Vault",
    eyebrow: "MENTOR HALL · INSIGHTS · STAGING",
    prelude:
      "Top takeaways saved across the platform — from your own journal, mentor sessions, replays, and forecasts. The Vault rebuilds your operating principles in your own words.",
    routePrefix: "M-INS",
    expectedSources: ["JournalVault", "ReplayVault", "MentorVault"],
    replaces: "scattered notes across surfaces",
    decision: "which principles am I actually living by today?",
    rail: "review",
    drillForward: [
      { id: "d1", routeId: "D01", label: "Show insights I haven't applied this week", urgency: "high" },
      { id: "d2", routeId: "D02", label: "Group by behavioural pattern", urgency: "medium" },
      { id: "d3", routeId: "D03", label: "Promote three to my morning ritual", urgency: "high" },
      { id: "d4", routeId: "D04", label: "Send to my Rule Forge", urgency: "low" },
    ],
  }),

  /* ─── REVIEW ROOM ──────────────────────────────────────────────── */

  "review.todays-stats": warming({
    id: "review.todays-stats",
    room: "review",
    destination: "Today's Stats",
    eyebrow: "REVIEW ROOM · TODAY · STAGING",
    prelude:
      "Drilldown of every trade closed today, with R-outcome, session window, setup tag, and discretion footnotes. Today's Stats is the surface you check before walking away.",
    routePrefix: "R-TDY",
    expectedSources: ["BrokerLedger", "JournalVault"],
    replaces: "the legacy daily P&L card",
    decision: "did I trade my plan today?",
    rail: "review",
    drillForward: [
      { id: "d1", routeId: "D01", label: "Group by setup tag", urgency: "medium" },
      { id: "d2", routeId: "D02", label: "Highlight rule violations", urgency: "high" },
      { id: "d3", routeId: "D03", label: "Open evening ledger", urgency: "high" },
      { id: "d4", routeId: "D04", label: "Send to my mentor for review", urgency: "low" },
    ],
  }),

  "review.performance-audit": warming({
    id: "review.performance-audit",
    room: "review",
    destination: "Performance Audit",
    eyebrow: "REVIEW ROOM · PERFORMANCE · STAGING",
    prelude:
      "Full lifecycle audit — wins, losses, leakage, hold-time distribution, and R-curve fingerprint. Performance Audit reads from the broker ledger and your journal in tandem.",
    routePrefix: "R-PRF",
    expectedSources: ["BrokerLedger", "JournalVault", "ProofOfEdge"],
    replaces: "the legacy performance page",
    decision: "where is my edge actually originating, and where is it leaking?",
    rail: "review",
    drillForward: [
      { id: "d1", routeId: "D01", label: "Compare last 30 days to prior 30", urgency: "medium" },
      { id: "d2", routeId: "D02", label: "Highlight discretion deviations", urgency: "high" },
      { id: "d3", routeId: "D03", label: "Open my Risk Audit", urgency: "high" },
      { id: "d4", routeId: "D04", label: "Promote findings to Insights Vault", urgency: "low" },
    ],
  }),

  "review.risk-audit": warming({
    id: "review.risk-audit",
    room: "review",
    destination: "Risk Audit",
    eyebrow: "REVIEW ROOM · RISK · STAGING",
    prelude:
      "Drawdown profile, exposure analysis, position-correlation map, and risk-cap adherence. Risk Audit is read-only, but the destination bay opens the Studio surface that fixes any breach.",
    routePrefix: "R-RSK",
    expectedSources: ["BrokerLedger", "MacroFeed", "JournalVault"],
    replaces: "scattered exposure cards",
    decision: "am I within my risk caps and uncorrelated enough to hold this?",
    rail: "review",
    drillForward: [
      { id: "d1", routeId: "D01", label: "Show today's correlation cluster", urgency: "high" },
      { id: "d2", routeId: "D02", label: "Compare current vs 30-day drawdown", urgency: "medium" },
      { id: "d3", routeId: "D03", label: "Open my Rule Forge to add a cap", urgency: "high" },
      { id: "d4", routeId: "D04", label: "Mute my signals if I'm over-cap", urgency: "high" },
    ],
  }),

  "review.schedule-review": warming({
    id: "review.schedule-review",
    room: "review",
    destination: "Schedule Review",
    eyebrow: "REVIEW ROOM · SCHEDULE · STAGING",
    prelude:
      "Book a 1-on-1 with your mentor, or attach a self-review block. Schedule Review pre-fills agenda from your Today's Stats and Insights Vault so the conversation starts loaded.",
    routePrefix: "R-SCH",
    expectedSources: ["MentorVault", "JournalVault"],
    replaces: "the legacy booking modal",
    decision: "when do I review, with whom, against which evidence?",
    rail: "review",
    drillForward: [
      { id: "d1", routeId: "D01", label: "Pre-fill agenda from this week's journal", urgency: "high" },
      { id: "d2", routeId: "D02", label: "Block 30 minutes for self-review", urgency: "medium" },
      { id: "d3", routeId: "D03", label: "Send my mentor today's stats", urgency: "high" },
      { id: "d4", routeId: "D04", label: "Schedule a Rule Forge follow-up", urgency: "low" },
    ],
  }),

  /* ─── THE COLLECTIVE ─────────────────────────────────────────────
     Single template that embeds the entire communities page with
     radial finder, community cards, and inspector.                   */

  "collective.community-hub": warming({
    id: "collective.community-hub",
    room: "collective",
    destination: "Community Hub",
    eyebrow: "THE COLLECTIVE · HUB · LIVE",
    prelude:
      "The complete community explorer. Radial finder with 21 dimensions, community cards with win rates and mentor manifests, and the full inspector for deep-dive analysis. Find the ecosystem that matches how you actually trade.",
    preludeAnchors: ["radial finder", "community cards", "inspector"],
    routePrefix: "C-HUB",
    expectedSources: ["EcosystemRegistry", "MentorVault", "ProofOfEdge", "BrokerLedger"],
    replaces: "the legacy /communities page",
    decision: "which ecosystem matches the way I actually trade?",
    rail: "decision",
    drillForward: [
      { id: "d1", routeId: "D01", label: "Filter by trading style", urgency: "high" },
      { id: "d2", routeId: "D02", label: "Show verified ecosystems only", urgency: "medium" },
      { id: "d3", routeId: "D03", label: "Sort by weekly activity", urgency: "medium" },
      { id: "d4", routeId: "D04", label: "Compare selected ecosystems", urgency: "low" },
    ],
  }),

  "collective.compare-ecosystems": warming({
    id: "collective.compare-ecosystems",
    room: "collective",
    destination: "Compare Ecosystems",
    eyebrow: "THE COLLECTIVE · COMPARE · LIVE",
    prelude:
      "Side-by-side comparison of trading communities. Objective metrics — win rates, mentor quality, activity levels, dimension alignment. Make the switch decision with data, not FOMO.",
    preludeAnchors: ["side-by-side", "objective metrics", "switch decision"],
    routePrefix: "C-CMP",
    expectedSources: ["EcosystemRegistry", "MentorVault", "ProofOfEdge"],
    replaces: "the inability to objectively compare communities",
    decision: "should I switch ecosystems? Which one objectively fits better?",
    rail: "decision",
    drillForward: [
      { id: "d1", routeId: "D01", label: "Add another ecosystem to compare", urgency: "high" },
      { id: "d2", routeId: "D02", label: "Weight dimensions by my preferences", urgency: "medium" },
      { id: "d3", routeId: "D03", label: "View full profile of winner", urgency: "high" },
      { id: "d4", routeId: "D04", label: "Save comparison for later", urgency: "low" },
    ],
  }),

  "collective.my-fit": warming({
    id: "collective.my-fit",
    room: "collective",
    destination: "My Fit Analysis",
    eyebrow: "THE COLLECTIVE · FIT ANALYSIS · LIVE",
    prelude:
      "Discover which ecosystem matches your trading style. Answer 5 quick questions about how you trade, and we rank every community by fit score. Process over prediction.",
    preludeAnchors: ["trading style", "fit score", "top recommendations"],
    routePrefix: "C-FIT",
    expectedSources: ["EcosystemRegistry", "UserProfile"],
    replaces: "guessing which community might work for you",
    decision: "based on how I actually trade, which ecosystem is the best match?",
    rail: "decision",
    drillForward: [
      { id: "d1", routeId: "D01", label: "Retake the profiler", urgency: "medium" },
      { id: "d2", routeId: "D02", label: "Explore top recommended ecosystem", urgency: "high" },
      { id: "d3", routeId: "D03", label: "Compare top 3 matches", urgency: "high" },
      { id: "d4", routeId: "D04", label: "Save my fit profile", urgency: "low" },
    ],
  }),

  "collective.live-activity": warming({
    id: "collective.live-activity",
    room: "collective",
    destination: "Live Activity",
    eyebrow: "THE COLLECTIVE · ACTIVITY · LIVE",
    prelude:
      "What's happening right now across all ecosystems. Active sessions, recent mentor activity, member engagement. Proof that these communities are alive, not ghost towns.",
    preludeAnchors: ["active sessions", "mentor activity", "real-time"],
    routePrefix: "C-ACT",
    expectedSources: ["EcosystemRegistry", "ActivityFeed", "BroadcastRelay"],
    replaces: "wondering if a community is actually active",
    decision: "which ecosystems are alive right now? Who's trading?",
    rail: "decision",
    drillForward: [
      { id: "d1", routeId: "D01", label: "Join most active ecosystem", urgency: "high" },
      { id: "d2", routeId: "D02", label: "Filter to my timezone", urgency: "medium" },
      { id: "d3", routeId: "D03", label: "Set activity notifications", urgency: "medium" },
      { id: "d4", routeId: "D04", label: "View activity history", urgency: "low" },
    ],
  }),
}

/** Fast lookup of a template descriptor by destination label (e.g. the
 *  cockpit row label). Used by the click-path wiring in your-space.tsx. */
export function templateIdForDestinationLabel(
  roomId: FlightDeckRoomId,
  destinationLabel: string,
): FlightDeckTemplateId | undefined {
  const norm = destinationLabel.toLowerCase().trim()
  for (const t of Object.values(TEMPLATE_REGISTRY)) {
    if (t.room === roomId && t.destination.toLowerCase() === norm) {
      return t.id
    }
  }
  return undefined
}

export function getTemplateDescriptor(id: FlightDeckTemplateId): TemplateDescriptor {
  return TEMPLATE_REGISTRY[id]
}
