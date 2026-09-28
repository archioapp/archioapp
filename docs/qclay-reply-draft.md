# QClay — Reply Draft (two layers)

> **How to use:** Layer 1 is a short holding reply you can send *now* if you want to buy time
> before the partner session. Layer 2 is the real reply to send *after* the decision workbook is
> filled in. Do not send Layer 2 until Group A–F answers exist.
>
> **Posture throughout:** collaborative, confident about what's decided/built, honest about
> what's open, and explicit that our first document was the *vision*, not a request to build all
> ~75 screens. We reduce their ambiguity; we invite their expertise.

---

## Layer 1 — Holding reply (optional, send now)

**Subject: Re: ARCHIO — technical questions (short answer now, full packet coming)**

Hi [QClay],

Great questions — they're exactly the right ones. Quick context first: the document you
reviewed describes the **full ARCHIO vision**, not the first build. We're finalizing a bounded
MVP scope and a few architecture decisions this week, then I'll send a complete packet with our
answers to all three questions plus the exact first-release boundary.

Short version of where we already are: core services are chosen and integrated (Supabase, market
data, TradingView, an AI gateway, Stripe); we're **US-first, region-aware**; and we are **renting
hosted AI models**, not training our own. Detail and the bounded scope to follow.

Thanks for your patience — the packet will make your estimate far more precise.

— [you]

---

## Layer 2 — Full reply (send after the workshop)

**Subject: ARCHIO — bounded MVP, and answers to your three questions**

Hi [QClay team],

Thank you — these are the right questions to lock before finalizing architecture and estimate.
One important reframing first, then direct answers.

**The document you reviewed is our full product vision** (~75 screens, marketplace, social,
execution, verification — the whole roadmap). It was meant to show you where ARCHIO is going,
**not** a request to build all of it first. Below is the **bounded first release** we actually
want scoped, followed by answers to your three questions.

### The bounded MVP (the "first house")

A **paired intelligence + community** product:
- A trader connects their **real trade history** (CSV first, then read-only broker/exchange
  connections) and gets AI-powered journaling, analytics, and one honest performance insight.
- A mentor runs a **community** and sees shared member performance and a basic **verified
  record**.
- Powered by our existing screens, auth, database, market data, and AI engine.

**Explicitly out of the MVP:** live trade execution, the marketplace, the public social feed,
net-worth aggregation, and EU/multi-region. These are roadmap, not first release.

### 1. External APIs / services

**Decided and already integrated:**
- **Supabase** — Postgres, auth, sessions, Row Level Security.
- **Polygon.io** (+ Alpha Vantage / Finnhub fallback) — market data.
- **TradingView** — charting (embedded widget).
- **Vercel AI Gateway** — hosted foundation models (OpenAI today; provider-flexible).
- **Stripe** — payments/subscriptions (plumbed; needs live products once pricing is set).

**Intentionally open (want your input):**
- **Trade ingestion** — MVP scope is **CSV import + read-only broker/exchange APIs** for Forex,
  Crypto, CFD. Likely sources: MT4/MT5, cTrader, TradeLocker, Binance, Bybit, Coinbase. We'd
  like your recommended **priority order** and any integration risks.
- **Crypto market-data provider** — leading candidates only; we'd value your recommendation.
- **File storage** — Vercel Blob is our candidate for screenshots/statements.

**Request:** where do you see build-vs-buy differently, and which integration would you sequence
first?

### 2. Hosting, infrastructure, data region

**Our decision: US-first, region-aware architecture.**
- Vercel (app + API) + Supabase (Postgres + auth), hosted **US-first** for the first paid
  release.
- Data model + identity boundaries designed so an **EU deployment can be added later without a
  rewrite**.
- We are **not** running dual US+EU data planes at MVP — the regional routing, separate
  storage/backups, and operational duplication aren't justified pre-validation.
- **Legal posture: software-only** — no custody, brokerage, execution, or personalized advice —
  which shrinks the compliance surface.

**Request:** please **confirm the recommended US region**, review our region-aware boundary, and
flag anything that would make a later EU split painful. We'll have **counsel** confirm final
data-residency/retention/deletion before any EU launch — we're not self-certifying compliance.

### 3. AI — trained models? Built from scratch? Which providers?

- We are **not training proprietary foundation models.** We use **hosted models via Vercel AI
  Gateway** and can route to OpenAI / Anthropic / others per feature.
- Our **proprietary work is the grounding + orchestration layer**, not base-model training:
  1. route each request to the correct ARCHIO domain + response type;
  2. retrieve the user's authorized data + relevant live market data;
  3. give the model that data as the **only** permitted factual grounding;
  4. enforce structured-output contracts + explicit **no-fabrication** rules;
  5. render the structured result in the right interface.
- This is **already scaffolded** in the codebase (routing, real market grounding, structured
  streaming, "never invent numbers").
- **Primary remaining dependency:** the **canonical trade pipeline** — a secure `trades` schema,
  CSV/read-only ingestion + normalization — so the AI grounds on each user's **real** trades
  instead of the current demo dataset.

### What we'd like to quote — three separate scopes

To keep the estimate precise, we'd value **three distinct numbers** rather than one blended one:
1. **Design / IA** for the bounded MVP above.
2. **Build** of the read-only intelligence + community MVP (trade pipeline is the keystone).
3. **Optional, later:** a separate discovery for **controlled partner-execution** (not part of
   1 or 2).

### What we're asking of QClay

- **Challenge our assumptions** where you have better evidence.
- Confirm the **US region + region-aware boundary**.
- Recommend the **trade-ingestion priority** and **crypto data provider**.
- Own the **production security threat model** and the **phased estimate**.
- Tell us: **"Given these constraints, what would you change before high-fidelity design?"**

We see the existing code as a strong **product + architecture scaffold**, and we're relying on
your team for the final production-grade review, regional/security design, and implementation
accountability.

Best,
ARCHIO team

---

## Internal notes — DO NOT SEND below this line

**Send order:** fill Decision Workbook (Groups A–F) → confirm the bounded MVP paragraph matches
what we actually decided → paste real answers into sections 1–3 → send Layer 2.

**What we can prove from the code:** Supabase auth/DB + RLS, ~35 API routes, Polygon + fallback,
Stripe routes/webhook, AI Gateway response engine with real market grounding and no-fabrication
contract.

**What we must NOT overclaim:** production scale, live broker sync, real user-trade grounding
(still demo), EU data plane, execution, audited compliance, completed security review.

**Scope-savings rule:** we hand QClay resolved *product behavior* + *vendor choices* + *MVP
boundary*. We do **not** ask them to invent our business model, research every vendor for us, or
resolve founder policy. We reduce their discovery work; we don't shift our decisions onto their
meter. Keep the open lane: "what would you change before design?"

**Reconciliation with QClay v1.1 docs:** their Dashboard Design & Release Plan intentionally
mandates *complete product design before beta* (separate from backend activation). If we want a
*reduced commercial scope*, that's an explicit rescope/contract conversation — we don't silently
shrink the agreed design mandate; we ask them to re-quote the bounded MVP.
