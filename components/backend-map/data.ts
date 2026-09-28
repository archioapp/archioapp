/* ═══════════════════════════════════════════════════════════════════════════
   BACKEND MAP · DATA
   ───────────────────────────────────────────────────────────────────────────
   Every claim on this page is grounded in the real codebase. Status values are
   deliberately honest so the founder never overclaims to QClay.
     - "live"    : built and working in the code today
     - "partial" : built but on a free tier / fallback / demo data
     - "missing" : not built yet — a known gap
   ═══════════════════════════════════════════════════════════════════════════ */

export type Status = "live" | "partial" | "missing"

export const STATUS_META: Record<Status, { label: string; dot: string; text: string; ring: string; bg: string }> = {
  live: {
    label: "Working",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    ring: "ring-emerald-400/30",
    bg: "bg-emerald-400/10",
  },
  partial: {
    label: "Partial",
    dot: "bg-amber-400",
    text: "text-amber-300",
    ring: "ring-amber-400/30",
    bg: "bg-amber-400/10",
  },
  missing: {
    label: "To build",
    dot: "bg-rose-400",
    text: "text-rose-300",
    ring: "ring-rose-400/30",
    bg: "bg-rose-400/10",
  },
}

/* ── The universal request chain (the spine of every feature) ─────────────── */
export type FlowStep = {
  id: string
  title: string
  plain: string
  tech: string
}

export const FLOW: FlowStep[] = [
  {
    id: "browser",
    title: "1 · You tap a button",
    plain: "You do something on screen — open a room, ask ARCHIO a question, log a trade.",
    tech: "The React frontend fires a request to one of our API routes.",
  },
  {
    id: "route",
    title: "2 · A door opens",
    plain: "Your tap knocks on one specific door in our kitchen, built for that one job.",
    tech: "A Next.js API route handles it — e.g. POST /api/archio, GET /api/communities.",
  },
  {
    id: "auth",
    title: "3 · The bouncer checks you",
    plain: "The kitchen confirms who you are and whether you're allowed to see this.",
    tech: "Supabase session is verified; Row Level Security scopes every row to you.",
  },
  {
    id: "work",
    title: "4 · The work happens",
    plain: "We remember or fetch what's needed: your data, a supplier's data, or the AI.",
    tech: "Supabase (our DB) + rented APIs (Polygon, Stripe) + AI Gateway with your data attached.",
  },
  {
    id: "answer",
    title: "5 · A clean plate comes back",
    plain: "The kitchen sends a tidy answer back to the screen.",
    tech: "The route returns JSON (or a stream); no raw internals leak out.",
  },
  {
    id: "render",
    title: "6 · You see the result",
    plain: "The screen updates with your answer. Back to what you already understand.",
    tech: "The frontend renders the response — a verdict, a list, a chart.",
  },
]

/* ── System layers (the vertical stack of the map) ────────────────────────── */
export type Node = {
  id: string
  name: string
  status: Status
  rentBuild: "Rent" | "Build" | "Rent + Build"
  plain: string
  tech: string
  evidence?: string
}

export type Layer = {
  id: string
  title: string
  subtitle: string
  nodes: Node[]
}

export const LAYERS: Layer[] = [
  {
    id: "frontend",
    title: "The dining room",
    subtitle: "What you see and touch (the frontend)",
    nodes: [
      {
        id: "app",
        name: "ARCHIO app (screens)",
        status: "live",
        rentBuild: "Build",
        plain: "Every screen: Flight Deck, communities, charts, the AI chat.",
        tech: "Next.js 14 App Router + React 19, Tailwind, Framer Motion.",
        evidence: "app/*, components/*",
      },
    ],
  },
  {
    id: "api",
    title: "Our kitchen",
    subtitle: "The ~35 doors we built (our API routes)",
    nodes: [
      {
        id: "auth-routes",
        name: "Auth doors",
        status: "live",
        rentBuild: "Build",
        plain: "Login, signup, logout, password reset, invites.",
        tech: "Session verification + service-role admin actions, server-side only.",
        evidence: "app/api/auth/*, app/api/invites/*",
      },
      {
        id: "community-routes",
        name: "Community doors",
        status: "live",
        rentBuild: "Build",
        plain: "Groups, rooms, memberships, orgs — who's in, who can see what.",
        tech: "CRUD routes on Supabase, guarded by RLS + role checks.",
        evidence: "app/api/communities, rooms, memberships, orgs",
      },
      {
        id: "market-routes",
        name: "Market doors",
        status: "partial",
        rentBuild: "Build",
        plain: "Price snapshots, candles, and overlays for charts.",
        tech: "Wrap Polygon + fallbacks; handle 403/429 gracefully.",
        evidence: "app/api/market/*, app/api/polygon/*",
      },
      {
        id: "ai-route",
        name: "The AI door",
        status: "live",
        rentBuild: "Build",
        plain: "Ask ARCHIO anything; get a grounded verdict back.",
        tech: "Routes intent, fetches real market data, streams a structured answer.",
        evidence: "app/api/archio/route.ts",
      },
      {
        id: "billing-routes",
        name: "Billing doors",
        status: "partial",
        rentBuild: "Build",
        plain: "Checkout, subscriptions, and the Stripe webhook listener.",
        tech: "Stripe Checkout + webhook updates membership status in Supabase.",
        evidence: "app/api/subscriptions/*, app/api/stripe/webhook",
      },
      {
        id: "trade-routes",
        name: "Trade import doors",
        status: "missing",
        rentBuild: "Rent + Build",
        plain: "Where CSV uploads and read-only broker keys will come in.",
        tech: "To build: import → normalize → save to a trades table.",
        evidence: "not yet built — the keystone",
      },
    ],
  },
  {
    id: "storage",
    title: "The storage room",
    subtitle: "Where we remember things (the database)",
    nodes: [
      {
        id: "supabase-db",
        name: "Supabase Postgres",
        status: "live",
        rentBuild: "Rent",
        plain: "Profiles, communities, memberships, plans, subscriptions.",
        tech: "Postgres with Row Level Security on every user table.",
        evidence: "scripts/001_auth_schema.sql, community-schema.sql",
      },
      {
        id: "trades-table",
        name: "Trades table",
        status: "missing",
        rentBuild: "Build",
        plain: "The user's real trades. This is the fuel for the entire AI.",
        tech: "To build: one normalized schema for MT5/cTrader/TradeLocker/crypto.",
        evidence: "not yet built",
      },
      {
        id: "file-storage",
        name: "File storage",
        status: "missing",
        rentBuild: "Rent",
        plain: "Chart screenshots, broker statement PDFs, avatars.",
        tech: "Candidate: Vercel Blob.",
        evidence: "not yet built",
      },
    ],
  },
  {
    id: "external",
    title: "The supplier trucks",
    subtitle: "Outside companies we rent (external APIs)",
    nodes: [
      {
        id: "supabase-auth",
        name: "Supabase Auth",
        status: "live",
        rentBuild: "Rent",
        plain: "The bouncer: identities, sessions, password resets.",
        tech: "@supabase/ssr with cookie-based sessions.",
        evidence: "lib/supabase/*, lib/auth/*",
      },
      {
        id: "polygon",
        name: "Polygon.io",
        status: "partial",
        rentBuild: "Rent",
        plain: "Live and historical prices for the charts and AI.",
        tech: "REST snapshots + aggregate bars. On free tier (upgrade for prod).",
        evidence: "lib/providers/polygonRest.ts",
      },
      {
        id: "alphavantage",
        name: "Alpha Vantage / Finnhub",
        status: "partial",
        rentBuild: "Rent",
        plain: "Backup price source when the primary is unavailable.",
        tech: "Fallback keys wired in the candles route.",
        evidence: "app/api/market/candles/route.ts",
      },
      {
        id: "tradingview",
        name: "TradingView",
        status: "live",
        rentBuild: "Rent",
        plain: "The interactive charts you see.",
        tech: "Embedded widget.",
        evidence: "chart components",
      },
      {
        id: "stripe",
        name: "Stripe",
        status: "partial",
        rentBuild: "Rent",
        plain: "Cards, subscriptions, paid communities.",
        tech: "Checkout + webhook; needs live products/prices for production.",
        evidence: "app/api/stripe/webhook",
      },
      {
        id: "brokers",
        name: "Brokers / exchanges",
        status: "missing",
        rentBuild: "Rent + Build",
        plain: "Where users' real trades come from (read-only, never execution).",
        tech: "MT5/cTrader/TradeLocker CSV; Binance/Bybit/Coinbase read-only keys.",
        evidence: "not yet built",
      },
      {
        id: "crypto-data",
        name: "Crypto market data",
        status: "missing",
        rentBuild: "Rent",
        plain: "Prices for crypto (Polygon core leans equities/FX).",
        tech: "Candidate: CoinAPI / exchange feeds / CoinGecko.",
        evidence: "not yet chosen",
      },
    ],
  },
  {
    id: "ai",
    title: "The specialty chef",
    subtitle: "The intelligence (AI)",
    nodes: [
      {
        id: "model",
        name: "Foundation model (rented brain)",
        status: "live",
        rentBuild: "Rent",
        plain: "A big pre-trained brain we rent. We never train our own.",
        tech: "openai/gpt-5-mini via Vercel AI Gateway; provider-swappable.",
        evidence: "app/api/archio/route.ts",
      },
      {
        id: "grounding",
        name: "Grounding (the briefing packet)",
        status: "partial",
        rentBuild: "Build",
        plain: "We hand the brain the user's real data so it can't make things up.",
        tech: "Market grounding is REAL; journal grounding still reads a demo book.",
        evidence: "lib/response-engine/journal.ts",
      },
      {
        id: "orchestration",
        name: "Orchestration (the rules)",
        status: "live",
        rentBuild: "Build",
        plain: "Which room a question goes to, and the no-hallucination contract.",
        tech: "Deterministic router + Zod output schema; 'NEVER invent numbers'.",
        evidence: "lib/response-engine/*",
      },
    ],
  },
]

/* ── QClay's three questions, answered ────────────────────────────────────── */
export type Answer = {
  q: string
  short: string
  points: string[]
}

export const QCLAY: Answer[] = [
  {
    q: "1 · Which APIs for each feature — decided or TBD?",
    short: "Core suppliers are decided and already integrated. One area is intentionally open.",
    points: [
      "Decided + built: Supabase (data + auth), Polygon + Alpha Vantage (market data), TradingView (charts), Vercel AI Gateway (AI), Stripe (payments).",
      "Open by design: broker trade ingestion — MVP scope is CSV import + read-only broker/exchange APIs for Forex, Crypto, and CFD.",
      "Live trade execution is deliberately out of MVP (Phase 2). We ingest trades, we don't place them.",
    ],
  },
  {
    q: "2 · Hosting, infrastructure, and data region?",
    short: "US-first, region-aware architecture. EU is a Phase 2 deployment, not a rewrite.",
    points: [
      "Vercel (app + API) + Supabase (Postgres + auth), hosted US-first for the first paid release.",
      "Data model designed so an EU region can be added later without rebuilding the product.",
      "We avoid dual US+EU data planes at MVP: ~2.5x the complexity before product validation.",
      "Legal posture: software-only — no custody, no brokerage, no execution — shrinking the compliance surface.",
    ],
  },
  {
    q: "3 · AI — trained models? Built from scratch? Which providers?",
    short: "We rent hosted models. Our proprietary work is grounding + orchestration, and it's already scaffolded.",
    points: [
      "No proprietary model training. Hosted foundation models via Vercel AI Gateway (currently OpenAI; provider-flexible).",
      "Proprietary layer: route the request, fetch the user's real trades + live market data, enforce no-fabrication output contracts.",
      "Already in code: routing, real market grounding, structured streaming responses.",
      "Main dependency: the trades pipeline, so AI grounds on each user's real trades instead of the current demo dataset.",
    ],
  },
]

/* ── Proposed build order ─────────────────────────────────────────────────── */
export const BUILD_ORDER: { n: number; title: string; why: string; status: Status }[] = [
  { n: 1, title: "Trade pipeline (keystone)", why: "trades table + CSV import + normalize; point existing AI grounding at real trades.", status: "missing" },
  { n: 2, title: "Read-only sync", why: "crypto exchange keys first (cleanest API), then FX/CFD where available.", status: "missing" },
  { n: 3, title: "Crypto data + Polygon paid tier", why: "reliable prices for crypto and production stability.", status: "missing" },
  { n: 4, title: "File storage (Vercel Blob)", why: "screenshots + broker statement uploads.", status: "missing" },
  { n: 5, title: "Net worth / portfolio persistence", why: "tables + valuation logic behind the visuals.", status: "missing" },
  { n: 6, title: "AI Verified Track Record", why: "tamper-evident performance from verified trades — the trust product.", status: "missing" },
  { n: 7, title: "Real-time community messaging", why: "Supabase Realtime for live rooms.", status: "missing" },
  { n: 8, title: "Phase 2: EU region + live execution", why: "regional data plane and broker execution once trust + licensing exist.", status: "missing" },
]

/* ── Monetization: recommended hypothesis, not a locked price sheet ───────── */
export const MONEY_FLOW = [
  {
    actor: "Free trader",
    gives: "Participation, network activity, future conversion",
    gets: "Community access, verified mentors, small import, one real insight",
    pays: "$0 until value is felt",
  },
  {
    actor: "Trader Pro",
    gives: "Recurring subscription",
    gets: "Full memory, analysis, psychology and discipline tools",
    pays: "Pays for depth — never for the TradingView chart",
  },
  {
    actor: "Mentor Pro",
    gives: "Anchor subscription + brings a cohort",
    gets: "Room operations, verified proof, member analytics, Mentor AI",
    pays: "Business expense tied to member outcomes",
  },
  {
    actor: "Creator / affiliate",
    gives: "Products, audience or attributed buyers",
    gets: "Majority of sale or a share of collected revenue",
    pays: "No payout on free signup; money shares only when money moves",
  },
  {
    actor: "ARCHIO",
    gives: "Trust, intelligence, distribution and payments",
    gets: "Subscriptions now; marketplace take-rate later",
    pays: "AI, data, storage, support and payment costs",
  },
]

export const REVENUE_TIMELINE = [
  {
    stage: "MVP",
    engine: "Mentor Pro + Founding Trader Pro",
    why: "Mentors are the earliest reliable payer; traders pay after the first real insight.",
  },
  {
    stage: "V1",
    engine: "Scaled Trader Pro + sponsored seats",
    why: "The real trade pipeline makes personal memory and coaching indispensable.",
  },
  {
    stage: "V2",
    engine: "Marketplace take-rate + affiliate sharing",
    why: "Turn this on only when real buyers, sellers and attributable revenue exist.",
  },
  {
    stage: "Later",
    engine: "Partners + enterprise / regional contracts",
    why: "Requires scale, negotiating power and production compliance capabilities.",
  },
]

/* ── Glossary ─────────────────────────────────────────────────────────────── */
export const GLOSSARY: { term: string; def: string }[] = [
  { term: "API", def: "A way for one computer to ask another computer to do something." },
  { term: "API route", def: "One door into our own backend, built for a single job." },
  { term: "Frontend / Backend", def: "The dining room vs everything behind the kitchen door." },
  { term: "Database", def: "The storage room where we remember things. We use Supabase (Postgres)." },
  { term: "Auth", def: "The bouncer — checks who you are and what you're allowed to see." },
  { term: "RLS (Row Level Security)", def: "A rule inside the database so users can only ever read their own rows." },
  { term: "Ingestion vs Execution", def: "Reading trades you already made vs placing new orders that move money." },
  { term: "Grounding", def: "Handing the AI real data before it answers, so it can't make things up." },
  { term: "Foundation model", def: "A big pre-trained brain (GPT/Claude) we rent — never train." },
  { term: "Region", def: "Which country our database physically lives in. It matters for the law." },
  { term: "Webhook", def: "A supplier honking at us: 'a payment just happened.' (Stripe.)" },
  { term: "Read-only API key", def: "A key that can see a user's account but cannot move money." },
  { term: "Normalize", def: "Translate many different data shapes into one consistent shape." },
]
