# ARCHIO — Technical Handoff Document

For any engineering team (QClay or otherwise) taking over or joining this codebase.
Written August 16, 2026 from the read-only audit (`docs/current-state-audit.md`).

## 1. Stack at a glance

- Next.js 14 App Router · React 18 · TypeScript 5 (483 outstanding type errors — see audit §H)
- pnpm · Tailwind + shadcn/ui · Framer Motion · Zustand stores (`lib/stores/`, `stores/`)
- Supabase (auth + Postgres + RLS) · Stripe (subscriptions skeleton) · Polygon.io (market data)
- AI SDK with Vercel AI Gateway — model `openai/gpt-5-mini` (`app/api/archio/route.ts:161`)
- Deployed on Vercel. No vercel.json; defaults.

## 2. Repository orientation (what matters, in order)

| Area | Path | Truth level |
|---|---|---|
| Database schema (source of truth) | `scripts/001_auth_schema.sql` … `006_seed_community_discovery.sql`, `copilot-tables.sql`, `community-schema.sql` | REAL — but live application state UNVERIFIED; verify against the Supabase instance first |
| Auth plumbing | `lib/supabase/{client,server,middleware}.ts`, `middleware.ts`, `app/api/auth/*` | REAL |
| Real API surface | `app/api/{orgs,rooms,memberships,invites,users,subscriptions}/**` — auth-gated, Zod-validated (`lib/validation/`) | REAL |
| AI response engine | `app/api/archio/route.ts`, `lib/response-engine/{router,contract,journal}.ts` | REAL engine; journal grounding = demo adapter by design |
| Market data | `lib/providers/polygonRest.ts`, `app/api/{polygon,market}/**` | REAL (free-tier fallbacks for 403/429) |
| Billing | `app/api/subscriptions/*`, `app/api/stripe/webhook/route.ts` | REAL code, E2E unverified |
| The visual product | `components/dashboard/**` (Flight Deck/VANTARY), `components/copilot/**`, `components/community-panel/**`, `components/cockpit/**` | MOCK-FED — beautiful, not wired |
| Mock data to replace | `components/dashboard/dashboard-data.ts`, `components/cockpit/cockpit-data.ts`, `lib/community-data.ts`, `lib/mentor/*`, `lib/response-engine/journal.ts` (demo book), `lib/stores/useProfile.ts` | DEMO |
| Scripted fake AI | `app/api/copilot/chat/route.ts` — deterministic responder, NOT a model | DEMO — do not confuse with `/api/archio` |
| Tests | `__tests__/integration/*.test.ts` (4 files) — currently unrunnable (missing `ts-node`) | NEEDS FIX |

## 3. Environment variables (NAMES only — never commit values)

Referenced by code: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `POLYGON_API_KEY`, `POLYGON_REST_URL` (optional),
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_URL`,
`NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`, `ALPHAVANTAGE_KEY` (vestigial), `FINNHUB_KEY`
(vestigial), `MARKET_TZ`, `SESSION_ASIA`, `SESSION_LONDON`, `SESSION_NEWYORK`.
Present but unused: `GEMINI_API_KEY`.

## 4. Commands

```bash
pnpm install
pnpm dev          # local dev
pnpm build        # PASSES today (57 routes)
pnpm exec tsc --noEmit   # FAILS: 483 errors — see audit §H
pnpm test         # BROKEN: install ts-node first
pnpm lint         # UNCONFIGURED: interactive prompt
```

## 5. Architecture decisions worth keeping

1. **Adapter pattern for AI grounding** — `collectJournalGrounding()` is the ONLY function that
   changes when real trades land (`lib/response-engine/journal.ts` header comment). Same for
   market. Don't rebuild the engine; swap adapters.
2. **Deterministic routing before model calls** — `routeArchio()` classifies intent/mode/template
   without a model, shipped in `X-Archio-Route` header for instant UI. Cheap and fast; keep.
3. **Numbers from code, words from model** — change %, stats computed deterministically; the
   model is forbidden to invent numbers. Extend this to DNA metrics.
4. **RLS-first schema** — every real table ships with policies in the same SQL file.
5. **TradingView public widget iframe** — deliberately avoids the script-tag widget for CSP/
   React reasons (`trading-desk/chart.tsx` header comment). Upgrading to the licensed Charting
   Library is a separate vendor decision.
6. **Middleware fails open** — availability over lockout while data is mock
   (`lib/supabase/middleware.ts`); revisit when real user data lands.

## 6. Known landmines

- **Two "AI" routes** — `/api/archio` is real; `/api/copilot/chat` is scripted. Demos must not
  mix them up.
- **Route protection intentionally removed** for `/profile /hub /copilot /nexus /intelligence`
  (mock data, login bounces) — comment at `lib/supabase/middleware.ts:60-76` says to re-add.
- **`notify-mentor` route is unauthenticated with service-role writes** — fix before anything
  else (audit risk #1).
- **`copilot_events` insert policy is `with check (true)`** — fix with real auth scoping.
- **`main-dashboard.tsx` imports a missing module** (`./LiveMarketIntelligence`) — file appears
  orphaned; verify before deleting.
- **Type errors are load-bearing in a few stores** (`useAnalysis.ts`, `chatThreads.ts`) —
  fix with tests, not blindly.
- **Heavy pages** — `/dashboard` 726 kB and `/design` 746 kB first-load.

## 7. What does NOT exist (do not assume)

No trades / journal / forecasts (durable) / strategies / decisions / DNA tables.
No broker or TradeLocker code. No CSV import. No file storage. No background jobs.
No email beyond Supabase auth. No rate limiting. No monitoring. No Discord API integration
(community is internal). No marketplace/payout code.

## 8. Credential transfer checklist (secure channel only, never chat)

- Supabase project (owner transfer or member invite): URL, anon key, service-role key rotation after transfer
- Stripe account (test + live keys, webhook secret regeneration)
- Polygon.io account/key
- Vercel project + domains
- GitHub repository (`networkappfinance/v0-b8-ue-t0y4bc-nt1772788011015`, base branch `visual-dna-extraction`)

## 9. First week for a new team (suggested)

Day 1–2: run build+tsc+tests, verify live Supabase schema vs `scripts/*.sql`, read
`docs/current-state-audit.md` + `docs/founding-beta-gap-analysis.md`.
Day 3: fix the two security holes; install ts-node; get tests green in CI.
Day 4–5: design the `trades`/`trade_events` schema (the keystone) and review it against the
AI journal-grounding shape it must feed (`lib/response-engine/journal.ts` interfaces).

## 10. Product context documents

- `docs/archio-chatgpt-context-dump.md` — full founder/vendor negotiation context (QClay estimate, scope questions)
- `docs/archio-partner-backend-brief.md`, `docs/archio-monetization-strategy.md`, `docs/qclay-reply-draft.md`
- `/backend-map` route — visual founder-facing status map
- QClay Product Development Plan v1.1 (external PDF, in founder's possession)
