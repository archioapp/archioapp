# ARCHIO Backend — Learning Workshop

> A plain-English guide to how the backend works, written so a non-technical founder
> can lead the conversation with Kan, Luke, and QClay. Read this top to bottom once.
> Every technical term is defined the first time it appears.

---

## 0. Why this document exists

QClay sent three questions:

1. Which **APIs** (external tools/services) will each feature use — decided or TBD?
2. What is the **hosting / infrastructure** plan — and which **region** (US vs EU) for legal reasons?
3. Are the **AI features** designed? Do we have trained models, or do we build from scratch? Which providers?

These are not "gotcha" questions. They are the exact three decisions that, if answered
wrong, cost a rebuild later. This document teaches you enough to answer all three with
confidence, and shows what ARCHIO **already has built** versus what is **still open**.

---

## 1. The restaurant model (the one mental picture for everything)

Think of ARCHIO as a restaurant.

- **The frontend** = the dining room. What the customer sees and touches. (You already
  understand this — it's the screens.)
- **The backend** = everything behind the kitchen door: the cooks, the storage room, the
  supplier trucks, the bouncer at the door.

A backend only ever does **four jobs**:

| Job | Restaurant version | ARCHIO version |
|-----|--------------------|----------------|
| **Remember** | The storage room / walk-in fridge | The **database** (Supabase) — trades, profiles, communities |
| **Check permission** | The bouncer / ID check | **Auth** — "who are you, are you allowed to see this?" |
| **Talk to the outside world** | Supplier trucks | **External APIs** — market data, payments, AI, brokers |
| **Do the thinking** | The specialty chef | **AI** — turning raw data into an answer |

That's it. Every single feature is a combination of those four jobs. Once you see that,
the "huge scary backend" becomes **one pattern repeated many times.**

---

## 2. The universal chain (first line of code to last)

Every feature — communities, journal, net worth, AI verdicts — runs this exact chain.
Memorize this; it is the spine of the whole platform.

```
1. User does something in the browser        (dining room)
2. Browser calls one of OUR api routes       (waiter walks to kitchen)
3. The route checks WHO you are + ALLOWED?    (bouncer)
4. The route REMEMBERS or FETCHES data:
      - our own database (Supabase)           (storage room)
      - a rented supplier (Polygon/Stripe/...) (supplier truck)
      - the AI brain (AI Gateway) WITH our data attached (specialty chef)
5. The route sends a clean answer back        (plate arrives at table)
6. The frontend shows it                      (customer eats)
```

**"API route"** = a single door into our kitchen for one job. ARCHIO has ~35 of them today.
Examples that already exist in the code:
- `POST /api/auth/login` — check credentials, start a session
- `GET /api/communities` — list the groups you can see
- `POST /api/archio` — the AI verdict engine
- `POST /api/stripe/webhook` — Stripe tells us a payment happened

---

## 3. Rent vs Build — the most important money concept

There are two kinds of API, and confusing them is how startups waste six figures.

### APIs we RENT (someone else's computer)
We pay a company and plug into their truck. We do **not** rebuild what they do.
- **Market data** — we do not run our own stock exchange feed.
- **AI models** — we do not train our own GPT (that costs hundreds of millions).
- **Payments** — we do not become a bank; Stripe handles cards.
- **Broker data** — we read the user's trades from their broker; we don't become a broker.

### APIs we BUILD (our own computer)
Our own logic that is unique to ARCHIO. This is the ~35 routes above. This is our product.

> **The rule:** Rent commodities. Build only what makes ARCHIO *ARCHIO*.
> Our moat is not "we have market data" (anyone can rent that). Our moat is
> **what we do with the user's own trades** — the intelligence layer.

---

## 4. What ARCHIO already has (audited from the real code)

This is the part that changes how QClay sees you. You are further along than a wireframe.

| Capability | Service (rent/build) | Status | Evidence in code |
|---|---|---|---|
| Login, signup, sessions | **Supabase Auth** (rent) | **Working** | `app/api/auth/*`, `lib/supabase/*` |
| Database + security rules | **Supabase Postgres + RLS** (rent) | **Working** | `scripts/001_auth_schema.sql`, `scripts/community-schema.sql` |
| Communities / groups / invites | **Our routes on Supabase** (build) | **Working** | `app/api/communities`, `rooms`, `memberships`, `invites` |
| Market / price data | **Polygon.io** primary (rent) | **Working, free tier** | `lib/providers/polygonRest.ts`, `app/api/polygon/*`, `app/api/market/*` |
| Market data backup | **Alpha Vantage / Finnhub** (rent) | **Partial fallback** | `app/api/market/candles/route.ts` |
| Charts | **TradingView** widget (rent/embed) | **Working** | chart components |
| AI verdicts, grounded in real numbers | **OpenAI via Vercel AI Gateway** (rent) | **Working** | `app/api/archio/route.ts` |
| AI routing + no-hallucination rules | **Our response engine** (build) | **Working (scaffold)** | `lib/response-engine/*` |
| Payments / subscriptions | **Stripe** (rent) | **Working, needs live products** | `app/api/stripe/webhook`, `app/api/subscriptions/*` |

**Two important asterisks (be honest about these with QClay):**

1. **Polygon is on a free tier.** The code already handles `403` (needs paid plan) and
   `429` (rate limited) gracefully by returning empty data. For production we upgrade the
   plan. This is a billing decision, not a rebuild.
2. **The AI currently reads a "demo book."** Look at `lib/response-engine/journal.ts` —
   grounding is pulled from a deterministic demo dataset today. The AI *architecture* is
   real and correct; it's just waiting for **real user trades** to flow in. That is the
   single most important next build (see §7).

---

## 5. What is MISSING (the honest gap list)

No spin. These are the pieces not yet built.

| Missing piece | Why it matters | Difficulty |
|---|---|---|
| **`trades` table + trade import** | This is the fuel for the entire AI. No trades = AI reasons about fake data. | Medium — the keystone |
| **CSV import** (MT4/MT5/cTrader/TradeLocker exports) | Fastest, safest way to get real trades in. | Low–Medium |
| **Read-only broker/exchange API sync** (crypto: Binance/Bybit/Coinbase; FX where available) | Automatic trade sync without touching execution. | Medium |
| **Crypto market data source** | Polygon core is equities/FX-leaning; crypto needs its own feed. | Low–Medium |
| **File storage** (screenshots, avatars, statements) | Users will upload chart screenshots and broker PDFs. | Low (Vercel Blob) |
| **Net worth / portfolio persistence** | Currently visual; needs its own tables + valuation logic. | Medium |
| **AI Verified Track Record** (tamper-proof performance) | The trust product; needs verified trade lineage. | Medium–High |
| **Real-time chat / live rooms at scale** | Communities have data but not live messaging infra. | Medium |
| **Live trade execution** | Deliberately **out of MVP scope** (see §6). | High (licensing + compliance) |

---

## 6. The three big founder decisions (answers we're locking tonight)

### Decision A — Region / hosting
- **Chosen: US first, "region-aware" architecture.**
- Plain English: laws care about *which country* the database computer sits in. EU citizen
  data on a US server can break EU law (GDPR); some US financial data must stay in the US.
- "All regions at once" isn't one bigger app — it's **two parallel backends** (a US kitchen
  and an EU kitchen) that must store, route, and separate data per region. Roughly **2.5×**
  the work because of the coordination between them.
- So: launch **US-hosted**, but **design so an EU region can be added as a deployment step,
  not a rewrite.** Supabase supports choosing a region and adding replicas later.

### Decision B — Trading scope
- **Chosen: no live execution in MVP. Ingest, don't execute.**
- **Execution** = placing orders that move real money (high compliance, needs broker
  licensing). **Ingestion** = reading trades the user already made (low risk).
- The magic — "your win rate on EURUSD drops 40% after 11am" — needs **ingestion only.**
  Execution is Phase 2 once trust and licensing exist. We lose nothing by waiting.
- How data gets in for MVP: **CSV upload + read-only broker/exchange API keys.** A read-only
  key can *see* trades but *cannot* move funds.

### Decision C — Legal posture
- **Chosen: software-only.**
- ARCHIO provides tools, records, AI assistance, simulations, and communities. Users keep
  execution and investment decisions. We are **not** an advisor, **not** a broker, and we
  **do not hold custody** of money. This dramatically shrinks the compliance surface for MVP.
- First markets: **Forex, Crypto, CFD** (matches the current product and audience).

---

## 7. The keystone build: the trade pipeline

Everything intelligent depends on this one chain. Build it first.

```
User's broker (MT5 / cTrader / TradeLocker / Binance / Bybit)
        |
        |  (A) export CSV        OR    (B) paste READ-ONLY api key
        v
ARCHIO import route  ->  NORMALIZE (one shape for all sources)
        v
Save to OUR `trades` table (Supabase, secured by RLS to that user)
        v
The AI response engine reads that table as grounding
        v
"Your win rate on EURUSD drops 40% after 11am. Stop trading tired."
```

Why this order:
- The AI engine (`app/api/archio`) is **already built** to accept "grounding." Today it
  gets grounding from a demo book. Swap the demo book for the real `trades` table and the
  entire AI product becomes real — with almost no change to the AI code itself.
- **Normalize** means: MT5, TradeLocker, and Binance all describe a trade differently. We
  translate every source into one consistent shape so the rest of the app never cares where
  a trade came from. (The code already anticipates this — grounding is written as an
  "adapter" that doesn't know or care about the source.)

---

## 8. The AI, explained once and for all

QClay asked: "Do you have trained models? Build from scratch? Which providers?"

**We do not train our own models, and we should not.** Here is the correct three-layer picture:

1. **The model (raw brain)** — GPT / Claude / etc. **Rented** via Vercel AI Gateway.
   We already use `openai/gpt-5-mini` in `app/api/archio/route.ts`. We can route different
   features to different models without changing our app.
2. **The grounding (the briefing packet)** — before every answer, our backend hands the
   brain the user's *real* data: their trades, live market numbers. **This is ours.** It is
   why our AI can say true, specific things instead of generic ones.
3. **The orchestration (the rules)** — which "room" a question goes to, what data to fetch,
   and the hard rule **"NEVER invent numbers"** (that exact instruction is already in our
   system prompt). **This is ours too**, and it's already scaffolded in `lib/response-engine`.

> The one-liner for QClay: *"We rent hosted foundation models through Vercel AI Gateway.
> Our proprietary work is the grounding and orchestration layer — routing, fetching the
> user's real trades and live market data, and enforcing no-hallucination output contracts.
> That layer is already in the codebase."*

---

## 9. Glossary (say these words with confidence)

- **API** — a way for one computer to ask another computer to do something.
- **API route** — one door into our own backend for one job.
- **Frontend / Backend** — the dining room vs everything behind the kitchen door.
- **Database** — the storage room. We use Supabase (Postgres).
- **Auth** — the bouncer. Checks who you are and what you're allowed to see.
- **RLS (Row Level Security)** — a rule inside the database itself so users can only ever
  read their own rows. We already use this heavily.
- **Ingestion vs Execution** — reading trades you already made vs placing new orders.
- **Grounding** — handing the AI real data before it answers, so it can't make things up.
- **Foundation model** — a big pre-trained brain (GPT/Claude) we rent, never train.
- **Region** — which country our database physically lives in. Matters for the law.
- **Webhook** — a supplier's truck honking at us: "hey, a payment just happened." (Stripe.)
- **Read-only API key** — a key that can *see* a user's account but *cannot* move money.
- **Normalize** — translate many different data shapes into one consistent shape.
