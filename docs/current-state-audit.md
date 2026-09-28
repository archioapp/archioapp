# ARCHIO — Current-State Technical Audit (Read-Only Due Diligence)

Audit date: August 16, 2026
Auditor: v0 acting as senior staff engineer, READ-ONLY. No product code was changed.
Method: full repository inspection, production build, type check, test run, live SQL/RLS review,
route inventory, and integration verification. Every claim cites evidence. Anything not
verifiable is labeled UNVERIFIED.

---

## A. Executive Summary (one page, plain English)

ARCHIO today is a **high-fidelity interactive prototype with real skeleton systems underneath** —
not a functional product, and not pure vapor either. Three real, working subsystems exist:

1. **A real auth + community backend skeleton.** Supabase authentication with signup/login/
   password-reset routes, a real Postgres schema (profiles, organizations, rooms, memberships,
   invites, plans, subscriptions) with Row Level Security policies, protected API routes that
   check the session user, and Zod input validation. Evidence: `scripts/001_auth_schema.sql`
   (RLS lines 24–360), `app/api/orgs/route.ts` (auth check lines 9–16), `lib/validation/`.

2. **A real AI response engine grounded in real market data.** `/api/archio` deterministically
   routes a prompt, fetches REAL Polygon.io market snapshots and 48 hourly bars server-side,
   composes a grounded prompt that forbids inventing numbers, and streams a schema-validated
   JSON envelope from `openai/gpt-5-mini` via the AI SDK. Evidence: `app/api/archio/route.ts`
   lines 26–182.

3. **A real Stripe billing skeleton.** Checkout session creation (auth-gated, plan lookup from
   DB) and a webhook route that verifies Stripe signatures before writing subscriptions.
   Evidence: `app/api/subscriptions/checkout/route.ts` lines 25–93, `app/api/stripe/webhook/route.ts`
   lines 7–28.

Everything else the eye sees — Flight Deck telemetry, trade journal numbers, DNA/psychology
analytics, community activity feeds, mentor dashboards, forecasts, Catch Me Up, marketplace —
is **visual mock or client-side prototype**. The trade journal the AI analyzes is a
deterministic demo book, honestly labeled `source: "demo-journal"` in code
(`lib/response-engine/journal.ts` lines 1–30). There is **no trades table, no forecasts table,
no journal table, no strategy table** in any SQL schema. The core trading loop — the actual
product — persists nothing.

**The production build succeeds** (57 routes compile). **The type check fails with 483 errors**
across ~30+ files — the app runs because Next.js builds with `ignoreBuildErrors`-style tolerance,
but the code is not type-clean. **Tests exist but cannot run** (missing `ts-node`; jest config
unparseable). **Lint is not configured** (interactive prompt, never completed).

Distance to a fully operational Founding Beta: realistically **14–24 person-weeks of focused
engineering** (see `docs/founding-beta-gap-analysis.md`), dominated by: trade data model +
ingestion (CSV first), wiring the demo-grounded AI to real user data, per-user scoping of the
workspace, and community room persistence. The architecture choices already made (adapter
pattern for grounding, RLS-first schema, deterministic routing before model calls) are sound
and reduce that work.

---

## B. What ARCHIO Actually Is Today

**Classification: INTERACTIVE PROTOTYPE + FUNCTIONAL ALPHA SKELETONS.**

| Layer | Verdict | Evidence |
|---|---|---|
| Visual product (75+ surfaces) | VISUAL MOCK / CLIENT PROTOTYPE | mock/demo data in 30+ files (grep evidence below) |
| Auth + org/room/membership backend | PARTIALLY CONNECTED → FUNCTIONAL | real routes + RLS + validation + integration tests (tests currently unrunnable) |
| AI response engine | PARTIALLY CONNECTED | real model + real market grounding; journal grounding is demo |
| Billing | PARTIALLY CONNECTED | real Stripe code; plans/prices must exist in Stripe; UNVERIFIED end-to-end |
| Trading loop (forecast→decision→trade→journal→DNA) | VISUAL MOCK | no schema, no persistence, no ingestion |

It is NOT a "connected beta": the central product loop has no durable data. It is NOT a mere
mockup: auth, RLS, market data, AI grounding, and payments skeletons are real code that runs.

---

## C. Route / Page / Surface Inventory

Status labels: VISUAL MOCK · CLIENT PROTOTYPE · PARTIALLY CONNECTED · FUNCTIONAL ·
PRODUCTION-READY · BROKEN · UNVERIFIED.

### Pages (from `pnpm build` route table — all 57 compiled)

| Route | File | Purpose | Data source | Status |
|---|---|---|---|---|
| `/` | `app/(main)/page.tsx` | Landing | static | CLIENT PROTOTYPE |
| `/dashboard` | `app/(main)/dashboard/page.tsx` | Flight Deck workspace (726 kB first load) | mock telemetry (`components/dashboard/dashboard-data.ts`) | VISUAL MOCK |
| `/cockpit` | `app/cockpit/page.tsx` | Cockpit workspace | mock (`components/cockpit/cockpit-data.ts`) | VISUAL MOCK |
| `/copilot` | `app/(main)/copilot/page.tsx` | Copilot console (journal, psychology, analytics) | mock + localStorage | CLIENT PROTOTYPE |
| `/intelligence` | `app/(main)/intelligence/page.tsx` | Intelligence Chamber (Ask Archio) | REAL AI + polygon + demo journal | PARTIALLY CONNECTED |
| `/forecast` | `app/(main)/forecast/page.tsx` | Forecast workflow | local state | CLIENT PROTOTYPE |
| `/history` | `app/(main)/history/page.tsx` | Trade history | mock | VISUAL MOCK |
| `/hub` | `app/(main)/hub/page.tsx` | Community hub | seeded DB + mock mix | PARTIALLY CONNECTED (UNVERIFIED depth) |
| `/communities` | `app/(main)/communities/page.tsx` | Community discovery | seeded via `scripts/006_seed_community_discovery.sql` | PARTIALLY CONNECTED |
| `/nexus` | `app/(main)/nexus/page.tsx` | Social/nexus surface | mock | VISUAL MOCK |
| `/profile` | `app/(main)/profile/page.tsx` | Profile | `lib/stores/useProfile.ts` (mock + localStorage) | CLIENT PROTOTYPE |
| `/login` `/register` `/forgot-password` `/reset-password` `/verify-email` | `app/*` | Auth flows | REAL Supabase | FUNCTIONAL (E2E UNVERIFIED) |
| `/welcome` | `app/welcome/page.tsx` | Onboarding narrative | static | CLIENT PROTOTYPE |
| `/pitch` `/newpitch` `/masterplan` `/archio` | `app/*` | Narrative/pitch decks | static | CLIENT PROTOTYPE |
| `/backend-map` | `app/backend-map/page.tsx` | Founder education map | static (this audit's companion) | CLIENT PROTOTYPE |
| `/design` `/playground/*` `/docs/ultra-breakdown` | `app/*` | Design system / demos | static | CLIENT PROTOTYPE |

### Workspace surfaces (inside Flight Deck / dashboard)

| Surface | File evidence | Status |
|---|---|---|
| TradingView chart embed | `components/dashboard/vantary/trading-desk/chart.tsx` (public `s.tradingview.com/widgetembed` iframe, lines 1–64) | FUNCTIONAL (free widget; no user TV account link) |
| Top slide-down ARCHIO AI | `components/dashboard/vantary/jarvis/` + `/api/archio` | PARTIALLY CONNECTED (real AI; market grounding real; per-user context absent) |
| Side rails / peek panels / cartouche gadgets | `lib/cartouche/gadget-registry.ts`, `components/dashboard/vantary/flight-deck/` | VISUAL MOCK (mock registry data) |
| Community/Discord-style panel | `components/community-panel/*` (mentor-stage, live-calls use localStorage + mock) | CLIENT PROTOTYPE |
| Entry/order/execution panel | `components/copilot/trade/TradeExecutionPanel.tsx` | VISUAL MOCK (no broker; no order API) |
| Trade journal dashboard | `components/copilot/journal/TradeJournalDashboard.tsx` | VISUAL MOCK (in grep mock list) |
| Trader DNA / psychology | `components/copilot/psychology/CopilotPsychologyConsole.tsx`, `analytics/*` | VISUAL MOCK |
| Coaching / mentor attribution | `lib/mentor/engine.ts`, `lib/mentor/templates/jadecap-ict-ny.ts` | CLIENT PROTOTYPE (template-driven, mock) |
| Live Rooms / Catch Me Up | community-panel + rooms API | PARTIALLY CONNECTED (rooms CRUD real; transcripts/catch-me-up mock) |
| Private agents/workspaces | flight-deck templates (`lib/cartouche/flight-deck-templates.ts`, localStorage) | CLIENT PROTOTYPE |
| Marketplace surfaces | pitch/narrative only | VISUAL MOCK (mentioned only) |

Navigation reachability: main routes are reachable via `components/app-sidebar.tsx`,
`components/floating-nav.tsx`, `components/header.tsx`. NOTE: `/profile /hub /copilot /nexus
/intelligence` were deliberately REMOVED from middleware protection because they render mock
demo telemetry (comment evidence: `lib/supabase/middleware.ts` lines 60–76).

---

## D. Feature-Evidence Matrix (canonical data objects)

| Object | Schema defined | Written | Read | Persists | User-scoped | Verdict |
|---|---|---|---|---|---|---|
| User/profile | `scripts/001_auth_schema.sql:13` | signup trigger + `/api/users/profile` | `/api/users/me` | YES | RLS (`profiles_*` policies) | REAL |
| Trading account | — | — | — | NO | — | ABSENT |
| Strategy | — | — | — | NO | — | ABSENT (UI only) |
| Strategy rule | — | — | — | NO | — | ABSENT (UI only) |
| Market context | not persisted | — | `/api/polygon/*`, `/api/market/*` live fetch | n/a | n/a | REAL-TIME FETCH, NOT STORED |
| Forecast | `forecast_groups` table exists (`scripts/community-schema.sql:42`) | UNVERIFIED (no write found) | UNVERIFIED | UNKNOWN | RLS partial | INCOMPLETE |
| Decision/pre-trade contract | — | — | — | NO | — | ABSENT (UI only) |
| Trade | — | — | — | NO | — | ABSENT — demo book only (`lib/response-engine/journal.ts`) |
| Trade event | — | — | — | NO | — | ABSENT |
| Journal entry | — | — | — | NO | — | ABSENT (UI mock) |
| AI observation/memory | `copilot_events` (`scripts/copilot-tables.sql:3`) | `lib/copilot/persist.ts:9` | UNVERIFIED | YES if table applied | WEAK (insert policy `with check (true)`) | PARTIAL |
| DNA/evidence record | — | — | — | NO | — | ABSENT (UI mock) |
| Coach/mentor relationship | `community_mentors` (`scripts/005_community_hub_mentors.sql:19`) | seeds | hub UI | YES | RLS present | PARTIAL |
| Community room | `rooms` (`001_auth_schema.sql:95`) | `/api/rooms` POST | `/api/rooms` GET | YES | RLS (`rooms_*`) | REAL (CRUD) |
| Room message/transcript | — | — | — | NO | — | ABSENT (mock in community-panel) |
| Agent | — | — | — | NO | — | ABSENT (concept only) |
| Workspace | localStorage templates | client | client | browser-only | n/a | CLIENT PROTOTYPE |
| Subscription/payment | `subscriptions`+`plans` (`001_auth_schema.sql:303,328`) | Stripe webhook | `/api/subscriptions/*` | YES | RLS (`subscriptions_*`) | REAL SKELETON (E2E UNVERIFIED) |
| Marketplace entitlement | — | — | — | NO | — | ABSENT |

### Hard-coded / demo data inventory (explicit)

Files containing mock/demo/sample fixtures shown in UI (grep evidence):
`lib/community-data.ts`, `lib/mentor/engine.ts`, `lib/mentor/templates/jadecap-ict-ny.ts`,
`lib/mentor/useMentorDashboard.ts`, `lib/price-api.ts`, `lib/multi-timeframe-analysis.ts`,
`lib/session-analysis.ts`, `lib/services/realTimeDataPipeline.ts`, `lib/stores/useProfile.ts`,
`lib/response-engine/journal.ts` (deterministic demo trade book),
`lib/cartouche/gadget-registry.ts`, `components/copilot/journal/TradeJournalDashboard.tsx`,
`components/copilot/analytics/CopilotAnalytics.tsx`, `components/copilot/analytics/StrategyAnalytics.tsx`,
`components/copilot/psychology/CopilotPsychologyConsole.tsx`, `components/copilot/ActivityNotifications.tsx`,
`components/copilot/CopilotRightRail.tsx`, `components/copilot/EventTimeline.tsx`,
`components/copilot/simulator/trader-personas.ts`, `components/dashboard/dashboard-data.ts`,
`components/cockpit/cockpit-data.ts`, plus community-panel mentor-stage/live-calls (localStorage).

---

## E. Backend Map

- **Framework:** Next.js 14.2.x App Router (build output format and `next.config.mjs`), React 18, TypeScript 5.
- **Package manager:** pnpm (lockfile present).
- **Styling:** Tailwind CSS + shadcn/ui components; Framer Motion.
- **Database:** Supabase Postgres. Live connection CONFIGURED (env vars present). Live schema
  introspection returned an error during this audit — table application status is UNVERIFIED
  against the live instance; SQL sources are in `scripts/`.
- **Auth:** Supabase Auth. Cookie sessions via `@supabase/ssr` middleware
  (`lib/supabase/middleware.ts`), signup/login/logout/reset routes under `app/api/auth/*`.
- **API surface:** 38 route handlers (build table). Auth-gated CRUD for orgs/rooms/memberships/
  invites/users/subscriptions; market data proxies; 2 AI routes; Stripe webhook.
- **Server actions:** `lib/actions/runAnalyze.ts` (1).
- **File storage:** none found. **Background jobs/queues/schedulers:** none found.
- **Observability:** console.log only. No Sentry/analytics/monitoring found.
- **Env var NAMES referenced in code:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`, `POLYGON_API_KEY`, `POLYGON_REST_URL`, `STRIPE_SECRET_KEY`,
  `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_URL`,
  `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`, `ALPHAVANTAGE_KEY`, `FINNHUB_KEY`, `MARKET_TZ`,
  `SESSION_ASIA`, `SESSION_LONDON`, `SESSION_NEWYORK`, `NODE_ENV`.
  Present in project but NOT referenced by code: `GEMINI_API_KEY` (unused — grep found zero usages).

---

## F. Integration-Status Matrix

| Integration | Classification | Evidence | To make operational |
|---|---|---|---|
| TradingView chart | VERIFIED WORKING (free widget iframe) | `trading-desk/chart.tsx:12-64` | For advanced features: TradingView Charting Library license + datafeed adapter |
| Market data (Polygon) | PARTIALLY WORKING | `lib/providers/polygonRest.ts` (real REST; graceful 403/429 handling lines 19–33) | Paid Polygon plan for snapshot tier; entitlement/licensing review for display |
| AlphaVantage / Finnhub | MENTIONED ONLY | env names referenced; no active pipeline verified | decide keep/remove |
| Broker connectivity | ABSENT | no SDK, no API route | vendor selection + contracts + engineering |
| TradeLocker | ABSENT | zero code references beyond narrative components | vendor agreement + integration |
| Manual trade entry | UI PLACEHOLDER | `TradeExecutionPanel.tsx` (no POST target) | trades schema + API + wiring |
| CSV trade import | ABSENT | no parser, no upload route | schema + normalizer + upload UI |
| Read-only account sync | ABSENT | — | vendor (e.g. broker APIs/SnapTrade-class) + legal |
| Order execution | ABSENT | — | out of Beta scope (correctly) |
| AI model/provider | CONFIGURED + WORKING | `app/api/archio/route.ts:161` — `openai/gpt-5-mini` via AI SDK `streamObject` (Vercel AI Gateway model string) | none for basic; add usage limits |
| AI routing/gateway | CONFIGURED | AI SDK default gateway; deterministic pre-router `lib/response-engine/router.ts` | — |
| Supabase | CONFIGURED + PARTIALLY WORKING | env present; middleware live; CRUD routes | apply/verify all schema files on live DB (live introspection errored: UNVERIFIED) |
| Stripe subscriptions | CONFIGURED (E2E UNVERIFIED) | checkout + signed webhook code | create real products/prices; run test-mode E2E |
| Stripe Connect / payouts | ABSENT | — | later (marketplace phase) |
| Discord/community | INTERNAL ONLY | own rooms model; no Discord API | keep internal (recommended) |
| Email/notifications | ABSENT (beyond Supabase auth emails) | — | pick provider when needed |
| File uploads | ABSENT | — | Supabase Storage when journal attachments land |

---

## G. ARCHIO AI Capability Assessment

**Classification today: a REAL, context-grounded assistant on real market data + demo journal
data — not an animation, not a scripted demo, not action-capable.**

Two AI routes exist with different maturity:

1. `/api/archio` (`app/api/archio/route.ts`) — the real brain. Deterministic router →
   real Polygon grounding → `streamObject` with `openai/gpt-5-mini` against a Zod envelope
   schema (`lib/response-engine/contract.ts`). System prompt forbids invented numbers/trades,
   requires provenance-aware confidence, forbids direct financial advice (lines 34–49).
   History passed (last 6 turns) — session memory only, nothing durable.
2. `/api/copilot/chat` (`app/api/copilot/chat/route.ts`) — NOT AI. A deterministic scripted
   responder with hard-coded session notes (lines 3–30). Anything demoed through it is scripted.
3. `/api/command` (`app/api/command/route.ts`) — real `streamText` command surface with strict
   behavioral rules (never execute trades, never fabricate).

| Capability ladder | Status | Missing for next rung |
|---|---|---|
| 1. AI that explains | WORKING (`/api/archio` quick mode) | — |
| 2. AI that understands live context | PARTIAL — real market data yes; user's actual chart state, strategy, forecast, open trade: NO | context bus from workspace state into prompt; real user data model |
| 3. AI that remembers | NO (6-turn history only; `copilot_events` table exists but is not read back into prompts) | durable memory schema + retrieval + privacy policy |
| 4. AI that recommends | PARTIAL (verdicts/plans from grounding) | real journal/strategy data to recommend against |
| 5. AI that performs approved product actions | NO (contract has `actions` as plain-english suggestions only) | tool-calling with confirmation UX + permission model |
| 6. AI safely interacting with broker/execution | NO | everything in rung 5 + broker integration + compliance review |

Anti-fabrication protections: real (grounding-only numbers rule, tradeId echo joins, confidence
tied to data provenance, null-grounding degradation — route lines 42–48, 96–101). Calculations:
market change % computed in deterministic code (route lines 74–77), not by the model.
Prompt injection: user text is interpolated into the prompt with grounding; no sanitization
layer; risk present but blast radius small because the AI has NO tools/write access.

---

## H. Build, Test, and Deployment Report

| Check | Result | Detail |
|---|---|---|
| `pnpm install` | OK | (implicit — build ran) |
| `pnpm build` | **PASS** | 57 routes; largest first-load: `/design` 746 kB, `/dashboard` 726 kB, `/copilot` 404 kB — heavy |
| `pnpm exec tsc --noEmit` | **FAIL — 483 errors** | e.g. `lib/supabase/client.ts:1` + `server.ts:1` (`SupabaseClient` not exported from `@supabase/ssr`), `main-dashboard.tsx:3` (missing module `./LiveMarketIntelligence`), `lib/stores/useAnalysis.ts` (multiple), `lib/copilot/sdk.ts:15`, `lib/stores/chatThreads.ts:107`, framer-motion variant typings in `lib/cartouche/face-transitions.ts`, plus ~30 more files |
| `pnpm test` | **BROKEN** | `jest.config.ts` unparseable: `ts-node` not installed. 4 integration test files exist (`__tests__/integration/{auth,invites,orgs,rooms}.test.ts`) but cannot run |
| `pnpm lint` | **NOT CONFIGURED** | `next lint` drops into interactive setup and exits 1 |
| Deployment | Vercel (v0 project `prj_vf9SYfCkIrc448iX470AZAHJq9rl`) | no `vercel.json`; defaults |

All errors reported verbatim in audit logs; none repaired (per instruction).

---

## I. Security-Risk Register

| # | Risk | Severity | Evidence |
|---|---|---|---|
| 1 | `POST /api/copilot/notify-mentor` uses SERVICE ROLE with NO auth check and NO input validation — anyone can spam arbitrary mentor notifications with forged `userId` | HIGH | `app/api/copilot/notify-mentor/route.ts:4-17` |
| 2 | `copilot_events` insert policy `with check (true)` — unauthenticated writes allowed by design; events with `user_id null` readable by anyone | MEDIUM-HIGH | `scripts/copilot-tables.sql:29-32` |
| 3 | No rate limiting anywhere (auth, AI routes, market proxies) — AI cost abuse + brute force | MEDIUM-HIGH | grep: zero rate-limit hits |
| 4 | 483 TypeScript errors mask real defects; build tolerates them | MEDIUM | tsc output |
| 5 | Client-side ANON-key Supabase client used for copilot persistence — fine with RLS, but pairs with risk #2 | MEDIUM | `lib/copilot/persist.ts:4-6` |
| 6 | Prompt injection surface on AI routes (no sanitization); low blast radius today (no tools) but must be addressed before rung-5 actions | MEDIUM (future HIGH) | `app/api/archio/route.ts:129-134` |
| 7 | No account deletion/export flows | MEDIUM (compliance) | none found |
| 8 | No monitoring/error reporting; console.log only, some logging user ids | LOW-MEDIUM | `app/api/orgs/route.ts:20` |
| 9 | Middleware fails OPEN when Supabase unreachable (`catch` allows request through) — availability-over-security tradeoff, acceptable now, revisit for protected data | LOW-MEDIUM | `lib/supabase/middleware.ts` final catch |
| 10 | Live RLS application status UNVERIFIED (schema introspection errored) — policies exist in SQL files, but confirm they are applied | UNVERIFIED | GetOrRequestIntegration db_schema error |

Positive findings: Stripe webhook signature verification present; API CRUD routes consistently
auth-check via `supabase.auth.getUser()`; Zod validation in `lib/validation/*`; secrets referenced
via env names only; no secrets committed (checked).

---

## J. Exact Five-Minute Demo Script (only what genuinely works)

1. **(0:00)** Open `/welcome` → `/register`: create a real account (Supabase). Check email
   verification screen. Log in. This is real auth with real sessions.
2. **(1:00)** Open `/dashboard` Flight Deck: real TradingView chart iframe with live symbol/
   interval switching. Say clearly: "surrounding telemetry is demo data."
3. **(2:00)** Open the Intelligence Chamber (`/intelligence`). Ask: "What's EURUSD doing today?"
   → watch route header glow, then a streamed verdict grounded in REAL Polygon numbers.
4. **(3:00)** Ask: "Why did I lose money yesterday?" → post-mortem with per-trade takes from the
   deterministic demo journal. Say clearly: "demo book — the pipeline is real, the trades are
   sample data until import lands."
5. **(4:00)** Open `/communities`: seeded community discovery from the real database. Create an
   org/room via the hub if desired (real CRUD, persists across refresh).
6. **(4:40)** Close on `/backend-map`: show the honest status map itself.

Do NOT demo: journal analytics, DNA, psychology consoles, execution panel, live rooms activity,
Catch Me Up, marketplace — all mock.

---

## O. Handoff Inventory (for any technical team)

Files a new team needs first: `docs/current-state-audit.md` (this), `docs/founding-beta-gap-analysis.md`,
`docs/technical-handoff.md`, `scripts/*.sql` (schema truth), `lib/response-engine/*` (AI contract),
`lib/supabase/*` (auth plumbing), `app/api/**` (real surface), `package.json`,
env-var NAME list (section E), QClay v1.1 product plan PDFs, and the canonical memory docs
(product naming and release ladder). Credentials to transfer via secure channel, never chat:
Supabase project, Stripe account, Polygon key, Vercel project.
