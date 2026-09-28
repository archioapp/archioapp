# ARCHIO Backend — Decision Packet

> The record of what we decided, the vendors we chose, and what still needs a human/legal
> sign-off. Bring this to the session with Kan and Luke. Everything here is a *decision*,
> not a discussion — the discussion happens once, then we lock it.

---

## A. Founder decisions (LOCKED tonight)

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| A1 | Launch region | **US first, region-aware architecture** | US legal home base; EU added later as a deployment, not a rewrite |
| A2 | Multi-region | **EU is Phase 2** | Two parallel backends ≈ 2.5× cost/complexity; not justified pre-revenue |
| A3 | Trading scope (MVP) | **No live execution** | Execution needs licensing + heavy compliance; ingestion delivers the intelligence with low risk |
| A4 | Trade ingestion | **CSV import + read-only broker/exchange APIs** | Fastest + safest path to real user data |
| A5 | Legal posture | **Software only** — no advice, no custody, no brokerage | Shrinks compliance surface massively for MVP |
| A6 | First asset classes | **Forex, Crypto, CFD** | Matches current product + audience |
| A7 | AI approach | **Rent foundation models; build grounding + orchestration** | Training our own model is unnecessary and cost-prohibitive |

---

## B. API / vendor decision matrix

Legend: **Locked** = chosen & integrated · **Chosen** = decided, integrated, needs upgrade ·
**Candidate** = leading option, not final · **Open** = needs decision.

| Feature | Vendor | Rent/Build | Status |
|---|---|---|---|
| Auth (login/signup/sessions) | Supabase Auth | Rent | **Locked** (built) |
| Database + security | Supabase Postgres + RLS | Rent | **Locked** (built) |
| Communities / rooms / invites / memberships | Our routes on Supabase | Build | **Locked** (built) |
| Market data (FX/equities) | Polygon.io | Rent | **Chosen** (built, upgrade tier for prod) |
| Market data backup | Alpha Vantage / Finnhub | Rent | **Chosen** (partial fallback in code) |
| Charts | TradingView widget | Rent | **Locked** (built) |
| AI models | OpenAI via Vercel AI Gateway | Rent | **Locked** (built) — can route to Anthropic/others per feature |
| AI routing + no-hallucination contract | Our response engine | Build | **Locked** (scaffold built) |
| Payments / subscriptions | Stripe | Rent | **Chosen** (built, needs live products/prices) |
| File storage (screenshots, statements, avatars) | Vercel Blob | Rent | **Candidate** |
| Crypto market data | CoinAPI / exchange feeds / CoinGecko | Rent | **Open** — pick one |
| FX/CFD trade import | MT4/MT5, cTrader, TradeLocker (CSV first) | Rent+Build | **Open** — CSV first, then read-only API where offered |
| Crypto trade import | Binance / Bybit / Coinbase read-only keys | Rent+Build | **Open** — read-only keys |
| Real-time chat / live rooms | Supabase Realtime | Rent | **Candidate** |
| Email (invites, resets, notifications) | Resend / Supabase email | Rent | **Open** — pick one |
| Live trade execution | (deferred) | — | **Out of MVP** (Phase 2) |

---

## C. Infrastructure Decision Record (IDR)

- **Hosting:** Vercel (app + API routes) + Supabase (database, auth, storage).
- **Primary region:** US.
- **Data residency principle:** design tables and access so a second region (EU) can be a
  parallel deployment; do not hardcode single-region assumptions.
- **Secrets:** all vendor keys live in environment variables (already the pattern in code:
  `POLYGON_API_KEY`, `STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, etc.). No keys in code.
- **Security baseline (already in place):** Row Level Security on every user table, session
  checks in API routes, service-role key used only server-side.
- **Security to add:** rate limiting on public routes, audit logging for track-record data,
  encryption-at-rest confirmation for uploaded broker statements.

---

## D. AI architecture (record)

- **Models:** rented via Vercel AI Gateway. Current: `openai/gpt-5-mini`. Swappable per feature.
- **Proprietary layers:** grounding (real trades + live market) and orchestration (routing +
  output contract). Already scaffolded in `lib/response-engine/*` and `app/api/archio`.
- **No model training.** No proprietary weights. No GPU infrastructure to run.
- **Current limitation:** grounding reads a demo dataset (`lib/response-engine/journal.ts`).
  Swap to the real `trades` table once the pipeline (§E / build phase 1) exists.

---

## E. Build order (proposed sequence)

1. **Trade pipeline (keystone):** `trades` table → CSV import → normalize → save.
   Then point the existing AI grounding at real trades. *Unlocks the entire AI product.*
2. **Read-only sync:** crypto exchange keys first (cleanest API), FX/CFD where available.
3. **Crypto market data source** + Polygon paid tier for production reliability.
4. **File storage (Vercel Blob):** screenshots + broker statement uploads.
5. **Net worth / portfolio persistence:** tables + valuation logic.
6. **AI Verified Track Record:** tamper-evident performance from verified trades.
7. **Real-time community messaging:** Supabase Realtime.
8. **(Phase 2)** EU region · live execution · advanced compliance.

---

## F. Ownership

| Area | Owner |
|---|---|
| Founder decisions (region, scope, posture) | Founder |
| Legal / compliance sign-off | Founder + counsel |
| Backend architecture & security review | QClay (with Kan/Luke) |
| Rapid build / prototypes / schema drafts / AI wiring | v0 + team |
| Vendor accounts & billing (Polygon, Stripe, AI Gateway) | Founder |

---

## G. Open questions requiring a human/legal answer (before final estimate)

1. **Counsel review** of "software-only" positioning for Forex/Crypto/CFD in the US.
2. **Which crypto market-data vendor** (cost vs coverage).
3. **Which email provider** and sending domain.
4. **Broker import priority order** — which of MT5 / cTrader / TradeLocker first?
5. **Track-record verification standard** — what counts as "verified"? (statement + read-only
   key cross-check?)
6. **Data retention & deletion policy** (needed even US-only; mandatory before EU).
7. **KYC/identity** — do paid creators need identity verification? (payouts implication.)
