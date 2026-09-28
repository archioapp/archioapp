/* ──────────────────────────────────────────────────────────────────────────
 *  PITCH DATA  ·  the entire investor briefing as structured content
 *
 *  Every word and number rendered on /newpitch lives here. Sourced verbatim
 *  from the prior pitch deck's logic (Problem · Market · Solution ·
 *  Architecture · Built · Partial · Roadmap · Ask) and re-presented in the
 *  cockpit terminal language.
 * ──────────────────────────────────────────────────────────────────────── */

import type { Severity } from "./pitch-dna"

/* ── Mission rail destinations ──────────────────────────────────────── */
export interface Destination {
  id: string
  index: string
  label: string
  glyph: string
}

export const DESTINATIONS: Destination[] = [
  { id: "fracture", index: "01", label: "THE FRACTURE", glyph: "⚡" },
  { id: "field", index: "02", label: "THE FIELD", glyph: "◎" },
  { id: "unification", index: "03", label: "THE UNIFICATION", glyph: "⬢" },
  { id: "stack", index: "04", label: "THE STACK", glyph: "▤" },
  { id: "live", index: "05", label: "WHAT'S LIVE", glyph: "◉" },
  { id: "gap", index: "06", label: "THE GAP", glyph: "▱" },
  { id: "path", index: "07", label: "THE PATH", glyph: "⟶" },
  { id: "ask", index: "08", label: "THE ASK", glyph: "◆" },
]

/* ── Boot / hero ────────────────────────────────────────────────────── */
export const HERO = {
  eyebrow: "ARCHIO AI · INVESTOR TERMINAL · 2026",
  bootLines: [
    "init archio.terminal --mode=investor",
    "mounting market intelligence … OK",
    "resolving fragmentation index … 6 systems",
    "thesis loaded. one trading OS for a $26.5T market.",
  ],
  title: "One trade idea shatters across six disconnected systems.",
  titleAccent: "We are building the one OS that holds it together.",
  sub: "Archio AI unifies the entire trading workflow — news, analysis, communication, execution, account management, and journaling — into a single intelligent operating system. The terminal below is the full investment briefing.",
  rail: [
    { label: "MARKET", value: "$26.5T" },
    { label: "DAILY FX", value: "$9.6T" },
    { label: "UNIFIED PLATFORMS", value: "0" },
    { label: "SYSTEMS UNIFIED", value: "6" },
    { label: "RAISE", value: "$145–160K" },
  ],
}

/* ════════════════════════════════════════════════════════════════════
   01 · THE FRACTURE  (Problem)
   ════════════════════════════════════════════════════════════════════ */

export interface FractureNode {
  id: string
  name: string
  tools: number
  sev: Severity
  detail: string
}

export const FRACTURE = {
  kicker: "ONE TRADE, SIX BREAKS",
  headline: "Every trade lives in six tools that were never built to talk to each other.",
  body: "A single trade idea travels through news, analysis, communication, execution, account management, and journaling daily. Each step uses different tools from different companies with different logins. Context is lost at every handoff. The workflow between them is fragmented, manual, and dangerously slow.",
  nodes: [
    { id: "news", name: "News & Events", tools: 3, sev: "amber", detail: "Economic calendars, news terminals, and alert feeds the trader checks before every session. None of it flows into analysis." },
    { id: "analysis", name: "Analysis", tools: 3, sev: "teal", detail: "Charting platforms, indicators, and screeners. The chart never knows what the news said or what the journal learned." },
    { id: "comms", name: "Communication", tools: 3, sev: "teal", detail: "Discord, Telegram, and mentor rooms. Signals and context arrive as chat messages that evaporate." },
    { id: "execution", name: "Execution", tools: 3, sev: "risk", detail: "Broker terminals and order tickets. The intent formed three tools ago has to be re-typed by hand." },
    { id: "account", name: "Account Mgmt", tools: 3, sev: "risk", detail: "Broker portals, prop-firm dashboards, and spreadsheets. Prop traders track drawdown limits across separate logins on stale data." },
    { id: "journaling", name: "Journaling", tools: 3, sev: "amber", detail: "Spreadsheets and journaling apps filled out hours later, from memory. 89% of traders abandon them." },
  ] as FractureNode[],
  stats: [
    { value: "45–60", unit: "min", label: "TIME LOST DAILY", sev: "amber" as Severity },
    { value: "$2,160", unit: "+", label: "EST. ANNUAL COST", sev: "amber" as Severity },
    { value: "6", unit: "+", label: "DISCONNECTED SYSTEMS", sev: "risk" as Severity },
    { value: "<15", unit: "%", label: "CONTEXT RETAINED", sev: "risk" as Severity },
    { value: "89", unit: "%", label: "JOURNAL ABANDONMENT", sev: "risk" as Severity },
    { value: "31", unit: "%", label: "MANUAL ENTRY ERRORS", sev: "amber" as Severity },
  ],
}

/* ════════════════════════════════════════════════════════════════════
   02 · THE FIELD  (Market)
   ════════════════════════════════════════════════════════════════════ */

export const FIELD = {
  kicker: "A TRILLION-DOLLAR WORKFLOW WITH NO OPERATING SYSTEM",
  headline: "The market is enormous, growing, and completely unconsolidated.",
  body: "Retail trading exploded post-2020 and never receded. Yet the tooling stayed fragmented — point solutions for charts, chat, brokers, and journals. There is no horizontal operating system stitching the workflow together. That gap is the opportunity.",
  macro: [
    { value: "$26.5T", label: "GLOBAL FINANCIAL SERVICES" },
    { value: "$9.6T", label: "FX TRADED PER DAY" },
    { value: "$0", label: "UNIFIED WORKFLOW PLATFORMS" },
  ],
  funnel: [
    { tier: "TAM", value: "$14.2B", desc: "Total retail + prop trading software & data spend.", pct: 100 },
    { tier: "SAM", value: "$5.8B", desc: "Active, tool-paying traders in served regions.", pct: 41 },
    { tier: "SOM", value: "$420M", desc: "Reachable 3-year obtainable share.", pct: 7 },
  ],
  tailwinds: [
    "Retail participation at all-time highs",
    "Prop-firm funding boom (FTMO et al.)",
    "AI copilots now an expected layer",
    "Creator-led mentor economies",
    "API-first brokers everywhere",
    "Mobile-first execution demand",
  ],
  scenarios: [
    { tier: "BEAR", value: "$8M ARR", note: "Niche prop-trader tool. Slow handoff adoption.", sev: "risk" as Severity, pct: 28 },
    { tier: "BASE", value: "$42M ARR", note: "Default OS for serious retail. Community flywheel turns.", sev: "amber" as Severity, pct: 62 },
    { tier: "BULL", value: "$180M ARR", note: "Category-defining workflow layer + data network.", sev: "teal" as Severity, pct: 100 },
  ],
  thesis: "No incumbent owns the workflow horizontally. Charts, chat, brokers, and journals each defend a vertical and have no incentive to unify. A workflow OS captures the seam between all of them — and the seam is where every trader is bleeding time.",
}

/* ════════════════════════════════════════════════════════════════════
   03 · THE UNIFICATION  (Solution)
   ════════════════════════════════════════════════════════════════════ */

export interface Pillar {
  id: string
  name: string
  tagline: string
  ai: number
  sev: Severity
}

export const UNIFICATION = {
  kicker: "ONE PLATFORM · SIX PILLARS · ZERO HANDOFFS",
  headline: "The six broken systems become one continuous intelligent surface.",
  body: "Archio is a trading operating system. Every stage shares one context layer, so intent formed in analysis arrives intact at execution, and outcomes flow back into the journal automatically. The handoffs that cost 45 minutes a day disappear.",
  before: { label: "TODAY", value: "8", unit: "fragmented tools", sev: "risk" as Severity },
  after: { label: "ARCHIO", value: "1", unit: "operating system", sev: "teal" as Severity },
  counters: [
    { value: "6", label: "UNIFIED PILLARS" },
    { value: "48", label: "AI COMPONENTS" },
    { value: "23", label: "AUTO HANDOFFS" },
  ],
  pillars: [
    { id: "intel", name: "Intelligence", tagline: "News, macro, and analysis fused into one live context.", ai: 11, sev: "teal" },
    { id: "exec", name: "Execution", tagline: "Order intent carried straight from idea to ticket.", ai: 7, sev: "teal" },
    { id: "community", name: "Community & Trust", tagline: "Verified mentors and signals, not evaporating chat.", ai: 8, sev: "teal" },
    { id: "journal", name: "Journaling", tagline: "Auto-captured decisions — zero manual entry.", ai: 9, sev: "teal" },
    { id: "account", name: "Account & Risk", tagline: "Live drawdown and prop-rule guardrails in one view.", ai: 7, sev: "amber" },
    { id: "news", name: "News Engine", tagline: "Severity-tinted events wired into every surface.", ai: 6, sev: "amber" },
  ] as Pillar[],
  moat: "The moat compounds: every trade journaled feeds the intelligence layer, every verified mentor strengthens trust, and the shared context layer gets harder to replicate with each integration. Point solutions can't catch a workflow that learns.",
}

/* ════════════════════════════════════════════════════════════════════
   04 · THE STACK  (Architecture)
   ════════════════════════════════════════════════════════════════════ */

export interface Layer {
  id: string
  name: string
  role: string
  nodes: string[]
  tech: string
  metric: string
  sev: Severity
}

export const STACK = {
  kicker: "BUILT LIKE INFRASTRUCTURE, NOT A FEATURE",
  headline: "Six layers carry one context from interface to foundation.",
  body: "The platform is a vertical stack. A query enters at the interface, the orchestrator routes it, the AI engine reasons over the data pipeline, and results persist through a row-level-secured database on a typed foundation. Context never leaves the rail.",
  layers: [
    { id: "interface", name: "Interface Layer", role: "Cockpit surfaces the trader touches", nodes: ["Flight Deck", "Macro Sheet", "Command Bar", "Swipe Drawer"], tech: "Next.js · React · Framer", metric: "34+ routes", sev: "teal" },
    { id: "orchestrator", name: "Orchestrator", role: "Routes intent across pillars", nodes: ["Intent Router", "Context Bus", "Handoff Engine"], tech: "Server Actions · Edge", metric: "23 handoffs", sev: "teal" },
    { id: "ai", name: "AI Engine", role: "Reasons over live trading context", nodes: ["Copilot", "Signal Synth", "Risk Audit", "Forecast"], tech: "AI SDK · Gateway", metric: "48 AI modules", sev: "teal" },
    { id: "data", name: "Data Pipeline", role: "Normalizes every external feed", nodes: ["Market Feeds", "Broker APIs", "News Wire"], tech: "Streams · Cron · Webhooks", metric: "25+ integrations", sev: "amber" },
    { id: "db", name: "Database", role: "Secured persistence of all state", nodes: ["Trades", "Journals", "Communities", "Accounts"], tech: "Postgres · RLS", metric: "9 RLS tables", sev: "amber" },
    { id: "foundation", name: "Foundation", role: "Typed, tested platform substrate", nodes: ["Type System", "Auth", "Design DNA"], tech: "TypeScript · Better Auth", metric: "241K+ LOC", sev: "teal" },
  ] as Layer[],
  totals: [
    { value: "241K+", label: "LINES OF CODE" },
    { value: "340+", label: "COMPONENTS" },
    { value: "48", label: "AI MODULES" },
    { value: "25+", label: "INTEGRATIONS" },
  ],
}

/* ════════════════════════════════════════════════════════════════════
   05 · WHAT'S LIVE  (Built)
   ════════════════════════════════════════════════════════════════════ */

export interface BuiltGroup {
  group: string
  systems: { name: string; what: string }[]
}

export const LIVE = {
  kicker: "NOT A DECK — A RUNNING PLATFORM",
  headline: "Twelve systems are already live and interactive today.",
  body: "This is not vaporware. The cockpit, the design system, the community surfaces, and the intelligence shells are built and running. What remains is wiring real data behind surfaces that already work.",
  groups: [
    {
      group: "FOUNDATION",
      systems: [
        { name: "Visual DNA System", what: "Single-source teal-glass design system powering every screen." },
        { name: "Auth & Accounts", what: "Email + password auth, sessions, protected routes." },
        { name: "Cockpit Shell", what: "Flight Deck navigator, command bar, status rail." },
      ],
    },
    {
      group: "EXECUTION",
      systems: [
        { name: "Dashboard / Command Center", what: "Summon any surface, orchestrate the workflow." },
        { name: "Swipe / Drawer Language", what: "Spring bottom-sheet interaction grammar." },
        { name: "Macro Alert Sheet", what: "Severity-tinted event rows with affected pairs." },
      ],
    },
    {
      group: "INTELLIGENCE",
      systems: [
        { name: "Copilot Surface", what: "Ask-bar query interface over trading context." },
        { name: "Forecast Room", what: "Publish, compare, and audit directional forecasts." },
        { name: "Intelligence Hub", what: "Unified news + macro + analysis shell." },
      ],
    },
    {
      group: "COMMUNITY",
      systems: [
        { name: "Communities & Ecosystems", what: "Radial finder, ecosystem cards, mentor halls." },
        { name: "Fit Analysis", what: "Five-axis style profiler matching traders to ecosystems." },
        { name: "Profile & History", what: "Trader cartouche, record, and equity views." },
      ],
    },
  ] as BuiltGroup[],
  liveCount: 12,
}

/* ════════════════════════════════════════════════════════════════════
   06 · THE GAP  (Partial)
   ════════════════════════════════════════════════════════════════════ */

export const GAP = {
  kicker: "RADICAL HONESTY ON WHAT REMAINS",
  headline: "The interface is ahead of the backend — and that's the cheapest place to be ahead.",
  body: "The hard, expensive work — the design system, the interaction grammar, the surface architecture — is done. What's left is mostly wiring real data into shells that already render and feel right.",
  columns: [
    {
      title: "BUILT · NEEDS DATA",
      sev: "teal" as Severity,
      items: ["Dashboard surfaces", "Forecast Room UI", "Community finder", "Macro alert rows", "Copilot ask-bar", "Journaling shell"],
    },
    {
      title: "PARTIAL · LOGIC STARTED",
      sev: "amber" as Severity,
      items: ["Signal verification", "Risk / drawdown engine", "Mentor trust scoring", "Forecast scoring", "Account aggregation"],
    },
    {
      title: "NOT BUILT YET",
      sev: "risk" as Severity,
      items: ["Live broker execution", "Real-time market feeds", "Payments & billing", "Mobile native shell", "Notification system"],
    },
  ],
  tables: [
    "users_extended",
    "trades",
    "journals",
    "forecasts",
    "signals",
    "communities",
    "accounts",
    "subscriptions",
  ],
}

/* ════════════════════════════════════════════════════════════════════
   07 · THE PATH  (Roadmap)
   ════════════════════════════════════════════════════════════════════ */

export interface Workstream {
  id: string
  name: string
  budget: string
  sev: Severity
  lanes: { name: string; deliverables: string[] }[]
}

export const PATH = {
  kicker: "THREE WORKSTREAMS, ONE LAUNCH",
  headline: "A funded path from running prototype to revenue.",
  body: "The capital splits cleanly across three parallel workstreams. Frontend completes the surfaces, backend wires the data and execution, and go-to-market turns the community flywheel.",
  workstreams: [
    {
      id: "frontend",
      name: "Frontend Completion",
      budget: "$75–105K",
      sev: "teal",
      lanes: [
        { name: "Surface polish", deliverables: ["Wire all 34+ routes to data", "Mobile responsive pass", "Motion + a11y audit"] },
        { name: "Onboarding", deliverables: ["Trader profiler", "Ecosystem matching", "First-run cockpit tour"] },
      ],
    },
    {
      id: "backend",
      name: "Backend & Data",
      budget: "$150–175K",
      sev: "amber",
      lanes: [
        { name: "Core data", deliverables: ["9 RLS tables live", "Broker API integration", "Real-time market feeds"] },
        { name: "Intelligence", deliverables: ["Signal verification", "Risk / drawdown engine", "Forecast scoring"] },
      ],
    },
    {
      id: "gtm",
      name: "Go-To-Market",
      budget: "TBD",
      sev: "teal",
      lanes: [
        { name: "Community flywheel", deliverables: ["Mentor onboarding", "Verified signals launch", "Referral loops"] },
        { name: "Monetization", deliverables: ["Subscription tiers", "Prop-firm partnerships", "Billing + payments"] },
      ],
    },
  ] as Workstream[],
}

/* ════════════════════════════════════════════════════════════════════
   08 · THE ASK
   ════════════════════════════════════════════════════════════════════ */

export interface Phase {
  index: string
  name: string
  window: string
  milestones: string[]
  sev: Severity
}

export const ASK = {
  kicker: "THE ASK",
  headline: "$145–160K to ship the backend and launch the operating system.",
  body: "The interface is built and the market is wide open. This round funds the data layer, live execution, and the go-to-market motion that turns a running platform into recurring revenue.",
  amount: "$145–160K",
  amountSub: "SEED · WORKFLOW OS",
  phases: [
    { index: "P1", name: "Data Foundation", window: "Days 1–30", milestones: ["RLS schema live", "Auth hardening", "Journaling persistence"], sev: "teal" },
    { index: "P2", name: "Intelligence Wiring", window: "Days 25–55", milestones: ["Forecast scoring", "Signal verification", "Macro feed live"], sev: "teal" },
    { index: "P3", name: "Execution", window: "Days 50–80", milestones: ["Broker API", "Risk engine", "Live market feeds"], sev: "amber" },
    { index: "P4", name: "Monetization", window: "Days 75–100", milestones: ["Subscription tiers", "Billing + payments", "Prop partnerships"], sev: "amber" },
    { index: "P5", name: "Launch", window: "Days 95–120", milestones: ["Mentor onboarding", "Verified signals GA", "Public launch"], sev: "teal" },
  ] as Phase[],
  worlds: [
    { name: "FRONT WORLD", desc: "The cockpit traders touch — already live, polished, and demo-ready today." },
    { name: "SHADOW WORLD", desc: "The data, execution, and intelligence engines this round brings online behind it." },
  ],
  whyNow: "Retail and prop trading are at all-time highs, AI copilots are now expected, and no one owns the workflow. The window to become the default operating system is open — and the product is already running.",
  cta: "Ask the founder anything about this round…",
}
