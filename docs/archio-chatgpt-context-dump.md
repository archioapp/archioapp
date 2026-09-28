# ARCHIO — CANONICAL CONTEXT DUMP FOR CHATGPT

> **What this is:** a single, self-contained briefing you can paste into ChatGPT so it
> understands *everything* that has happened since the QClay estimate landed and you started
> "freaking out about the backend." It is written so a smart assistant with **zero prior
> context** can reason with you about scope, money, architecture, and the reply to QClay.
>
> **How to use it with ChatGPT:** paste the whole thing, then say something like: *"You are my
> co-founder / technical advisor. Here is the full situation. Help me work through the OPEN
> DECISIONS section — ask me one question at a time and challenge my thinking."*
>
> **Ground rule baked into everything below:** a recommendation is never stated as a fact.
> Every open item is labelled. Nothing here is a locked price or a compliance claim.

---

## 0. THE 30-SECOND VERSION (read this first)

- We are building **ARCHIO**: a trader's operating system that **remembers everything, tells
  the truth, and turns both into a better, provable trader.** One sentence, four faces: it's an
  **OS** (the container), an **AI co-pilot** (the interface), a **"become the trader you
  intended"** outcome for the person, and a **"know what/who is real"** outcome for the
  ecosystem.
- We sent our development studio, **QClay**, our *entire long-term vision* (~75 screens). They
  quoted the whole thing: **~$300k–$350k, ~12 months, 12–15 people** for build, **plus $35k /
  ~2 months** for design, **plus $7k / ~2 weeks** for an Information Architecture phase.
- That number caused panic. **The key realization: QClay priced the five-year *city*, because
  we never told them which *first house* to build.** They themselves recommended phasing into
  an MVP. The fix is *ours*: draw the line around the smallest valuable version.
- QClay asked us **three specific technical questions** (external APIs, hosting/region, AI).
  We've drafted answers, but several depend on **founder decisions we haven't finalized.**
- We have already built a *lot* (frontend, auth, database, market data, payments plumbing, a
  working grounded AI engine). The **single biggest real gap** is the **trade pipeline**: the
  AI currently reasons over **demo trades**, not the user's real trades.
- The immediate goals: (1) get my **partner** un-overwhelmed about "the backend," (2) run one
  **working session** to make the open decisions, (3) send QClay a **tight reply** that makes
  them quote the *bounded MVP* instead of the whole galaxy, (4) decide the **monetization
  model** enough to test it.

---

## 1. WHO'S WHO / THE CAST

- **Me (founder):** product + vision owner. Non-technical enough that "the backend" felt
  terrifying; that's the anxiety this whole effort is unwinding.
- **My partner:** co-founder, also non-technical, felt overwhelmed by the backend and the
  QClay number. I need his gut on *business/direction* decisions, not on code.
- **QClay:** the external design + development studio evaluating our docs. They did the
  estimate, asked the three questions, and recommended an MVP-first approach. They have also
  produced Figma work and two v1.1 planning documents (a **Dashboard Design & Release Plan**
  and a **Visual Narrative System**).
- **Sofia:** point of contact on the QClay side (their communications reference her).
- **v0 (me, the AI assistant that produced all the docs):** built the app, wrote the strategy
  documents, and maintains the interactive `/backend-map` page inside the product.

---

## 2. WHAT ARCHIO IS (the product, in plain English)

The problem: a serious trader's life is scattered across ~9 tools — charts, a broker, a
journal in a spreadsheet, Discord communities, screenshots, a mentor's calls they keep
missing, no honest record of whether they're actually any good. ARCHIO collapses that into
**one place that holds everything, remembers you, refuses to lie to you, and can prove your
results.**

**The canonical sentence (locked):**
> **ARCHIO is the trader's operating system that remembers everything, tells the truth, and
> turns both into a better, provable trader.**

**The one loop (four verbs) — this replaces any "9-step" mental model:**
```
DISCOVER (find mentors/communities) → LEARN LIVE (rooms + memory + Mentor AI)
→ DECIDE (analyze → forecast → journal) → PROVE (a public, verified track record)
→ your reputation feeds DISCOVER again.
```

**The first customer is a PAIRED LOOP (locked):** we launch to **both mentors and their
students together**, because mentors bring their students, which solves the "empty room"
cold-start problem. A mentor runs a room; their students fill it; everyone's activity becomes
memory and a verifiable record.

**The nine "systems"** are a great *vision map* but a bad *build order*. They stay on the
landing page as the vision; internally we build **3 cores + 1 primitive first**, then upgrades.
The nine (final canonical names + one-line hook, in presentation order):
1. **Flight Deck** — "One place that actually knows me." (the command center / dashboard)
2. **Community** — "My mentor went live. I missed everything." (mentors, verified accounts,
   live rooms, Catch Me Up)
3. **Decision Desk** — "I made 6 trades today. I couldn't tell you why." (trading intelligence)
4. **Trading DNA** — "Why do I keep breaking my own rules?" (trades + rules + psychology /
   "Mind Check" inside)
5. **AI Agent Marketplace** — "An analyst, a risk manager, a coach — all AI."
6. **Portfolio** — "What happens if BTC drops 30%?" (What-If scenarios; wallet connect later)
7. **Net Worth** — "I trade every day. I still don't know what I'm worth."
8. **AI Verified Track Record** — "Everyone claims. Here, everything is recorded, verified,
   and proven." (identity, KYC, the trust layer)
9. **Social Network** — "A feed for money — not for likes." (the public feed; closes the loop)

---

## 3. THE QCLAY ESTIMATE (the thing that caused the panic) — verbatim substance

QClay reviewed our materials and, based on the **current full documentation**, gave a
**preliminary** estimate:

- **Scope they measured:** ~**75 unique pages/screens**, ~**45 unique modals**, ~**10 side
  panels (drawers)**.
- **Design phase:** ~**$35,000**, ~**2 months.** Includes concept, UX research, full UI design,
  a design language/style guide/color/typography/visual identity, supporting components
  (graphics, charts, icons, transitions), and responsive web/tablet/mobile.
- **Information Architecture (IA) phase (recommended BEFORE design):** ~**$7,000**, ~**2
  weeks**, involving their CTO + three senior designers. Purpose: map all user flows so design
  revisions and dev risk drop.
- **Development (backend + frontend + integrations):** ~**$300,000–$350,000**, ~**12 months**,
  **12–15 specialists in parallel.**
- **Critical caveat from them:** this **does NOT include the AI functionality** — the AI
  modules need additional discussion and technical planning before they can be estimated.
- They said it's **preliminary and rough**; once requirements/architecture/specs are finalized,
  budget and timeline may change.
- They suggested we **could consider dev studios with large teams in South Asia**.
- They **strongly recommended phasing — start with an MVP** — to get to value/revenue early and
  manage budget and timeline.

**The reframing we adopted (the single most important idea in this whole document):**
> QClay's ~$350k is roughly the price of the *entire document we sent them* — the whole vision.
> We handed them the **five-year city plan** and asked what the **first house** costs, and they
> (correctly) priced a lot of the city. **We are not behind. We just described the whole vision
> to a builder before telling them which room to build first.** The job now is to draw the line
> around the smallest valuable version.

---

## 4. THE THREE QUESTIONS QCLAY ASKED US (and our drafted answers)

QClay's clarifying questions fall into three buckets. Our answers are drafted but some depend on
still-open founder decisions (see Section 8).

### Q1 — External APIs / third-party services: which are we using?
**Our drafted answer — DECIDED & ALREADY INTEGRATED:**
- **Supabase** — Postgres database, auth, sessions, Row-Level Security.
- **Polygon.io** (+ Alpha Vantage / Finnhub as fallback) — market data (FX/equities).
- **TradingView** — charting, via the embedded widget (rented, attributed).
- **Vercel AI Gateway** — hosted foundation models (OpenAI today; provider-flexible).
- **Stripe** — payments/subscriptions (plumbed; needs live products once pricing is set).

**Intentionally OPEN (we want QClay's input):**
- **Trade ingestion sources** — MVP is **CSV import + read-only broker/exchange APIs** (Forex,
  Crypto, CFD). Candidate sources: MT4/MT5, cTrader, TradeLocker, Binance, Bybit, Coinbase. We
  want QClay's recommended **priority order** and integration risks.
- **Crypto market-data provider** — we want a recommendation.
- **File storage** — Vercel Blob is our candidate (screenshots, statements).

### Q2 — Hosting, infrastructure, data region: what's the plan?
**Our drafted answer (a recommendation, not yet founder-locked):**
- **US-first, "region-aware" architecture.** Vercel (app + API) + Supabase (Postgres + auth),
  hosted **US-first** for the first paid release.
- Data model + identity designed so an **EU deployment can be added later without a rewrite.**
- We are **NOT** running dual US+EU data planes at MVP (that's ~2.5× the infra/cost and isn't
  justified before validation).
- **Legal posture: software/analytics only** — no custody, no brokerage, no execution, no
  personalized investment advice in v1.
- **Requests to QClay:** confirm the recommended US region, review the region-aware boundary,
  and flag anything that makes a later EU split painful. Counsel confirms final data-residency
  before any EU launch — we do NOT self-certify compliance.

### Q3 — AI: are we training our own models? Building from scratch? Which providers?
**Our drafted answer — DECIDED:**
- We are **NOT training proprietary foundation models.** We **rent** hosted models (OpenAI /
  Anthropic / others) through **one gateway** so we can swap providers per feature.
- **Our proprietary work is the grounding + orchestration layer**, not model training:
  1. route each request to the right ARCHIO domain + response type;
  2. retrieve the user's authorized data + relevant live market data;
  3. give the model that data as the **only** permitted factual grounding;
  4. enforce structured output + explicit **"never invent numbers"** rules;
  5. render the structured result in the right interface.
- This is **already scaffolded and working** in the code.
- **The primary remaining dependency:** the **canonical trade pipeline** (secure `trades`
  schema + CSV/read-only ingestion + normalization) so the AI grounds on **real** user trades
  instead of the current demo dataset.

**What we want to ask QClay to quote — THREE separate numbers, not one blended one:**
1. **Design / IA** for the bounded MVP.
2. **Build** of the read-only intelligence + community MVP (trade pipeline is the keystone).
3. **Optional, later:** a separate discovery for **controlled partner-execution** (NOT part of
   1 or 2).

---

## 5. THE BACKEND, EXPLAINED SO A NON-TECHNICAL PARTNER STOPS PANICKING

This is the mental model that made "the huge scary backend" click. **Think of ARCHIO as a
restaurant:**

- **Dining room = the app screens** (what the user sees and taps). **Mostly built already.**
- **Kitchen = the backend** (everything behind the door). A kitchen only ever does **four
  jobs:**
  - **Storage room (Database):** remembers things — trades, profiles, communities.
  - **The bouncer (Auth):** checks who you are and what you're allowed to see.
  - **Supplier trucks (External APIs):** things we *rent* from outside — market prices
    (Polygon), payments (Stripe), the AI brain, and later broker connections.
  - **The specialty chef (AI):** turns raw data into an actual answer.
- **Waiter carrying orders = "API routes":** when you tap something, an order goes to the
  kitchen, the bouncer checks you, the kitchen grabs data / calls a supplier / asks the chef,
  and a clean plate comes back to your screen. **That's the whole thing** — one simple pattern
  repeated many times.

**Rent vs Build — the money-saving insight:** we do **not** build the hard commodity stuff. We
**rent** the AI brain, payments, market prices, and charts (nobody builds their own
electricity). We **build** the stuff nobody can rent and that actually makes ARCHIO valuable:
turning a trader's messy history into one clean record (normalization), giving the AI that real
data so it can't make things up (grounding), the trust/verification, and the decision logic.
**We rent the muscles; we build the brain and the memory.**

---

## 6. WHAT ACTUALLY EXISTS TODAY (honest current-state — do not overclaim)

Grounded in the real codebase. Deliberately conservative so we never overclaim to each other or
to QClay.

| Area | What exists | Honest status |
|---|---|---|
| App screens (Flight Deck, communities, charts, AI chat) | Next.js + React | **Working** (frontend) |
| Login / signup / sessions | Supabase Auth | **Working** |
| Database + per-user security | Supabase Postgres + Row-Level Security | **Working** (structure) |
| Communities / rooms / memberships | Our API routes on Supabase | **Working** |
| Market data (FX / equities) | Polygon.io + fallbacks | **Working, free tier** (needs paid tier for prod) |
| Charts | TradingView widget | **Working** (rented, embedded) |
| Payments / subscriptions | Stripe routes + webhook | **Plumbed** (needs real products + a decided pricing model) |
| AI engine | Response engine via Vercel AI Gateway (OpenAI today) | **Working, but grounded on DEMO trades** |
| Real trade pipeline (import → normalize → store) | — | **MISSING — this is the keystone** |
| File storage (screenshots, statements) | — | **Missing** (Vercel Blob is the likely rental) |
| Verified track record | — | **Missing** (depends on the trade pipeline) |
| Live trade execution | — | **Deliberately OUT of MVP** |
| EU / multi-region data | — | **Deliberately later** |

**The single most important honest sentence:**
> *The AI is real, but until we build the trade pipeline it's reasoning over demo data, not the
> user's real trades.* Everything downstream — verified records, real verdicts, net-worth truth
> — waits on that one pipeline.

**Deeper technical truth (for a technical advisor):** the AI response engine is genuinely built
— there's a real router (intent → mode → room → lens → template), real market grounding via
Polygon, structured/streamed output with a "never fabricate numbers" contract, and two full
end-to-end templates shipped and browser-verified: **"What matters for EUR/USD today?"** (100%
real: live AI + live Polygon prices + session clock, zero mock in the primary path) and **"Why
did I lose yesterday?"** (a trade post-mortem — real AI reasoning, but over a **demo journal**
of 5 trades because the real trade pipeline doesn't exist yet). The architecture is designed so
swapping the demo journal for a real Supabase `trades` table happens *behind the same
interface*.

---

## 7. THE BOUNDED MVP (the "first house" — this is what we actually want built first)

**MVP in one line:** *"The trading floor with a memory and a verifiable record."*

**The paired intelligence + community product:**
- A trader connects their **real trade history** (CSV first, then read-only broker/exchange
  connections) and gets AI journaling, analytics, and **one honest performance insight**.
- A mentor runs a **community/room** and sees shared member performance + a basic **verified
  record**.
- Powered by the existing screens, auth, database, market data, and AI engine.

**Explicitly OUT of the MVP (roadmap, not first release):** live trade execution, the
marketplace, the public social feed, net-worth aggregation, EU/multi-region.

**The "first 60 seconds of magic" mandate:** the instant the AI reads a trader's real history
and tells them **one true, uncomfortable thing about themselves.** Monetization is timed around
this moment (see Section 9).

**Rough internal build order (post-MVP phases):**
- Phase A — Release the core loop (most exists): landing + Flight Deck + Decision Desk loop +
  Community rooms + auth + Supabase persistence for forecasts/journal.
- Phase B — Room memory + one Mentor AI agent ("Catch Me Up").
- Phase C — Public verified track-record pages (cheap, existential for differentiation).
- Phase D — Scenario Lab (the "BTC −30%" hero interaction) → seed of Portfolio.
- Phase E — Trading DNA (Strategy rules + Psychology / Mind Check).
- Phase F — Social, then Agent Marketplace, then Net Worth tier.

---

## 8. THE OPEN DECISIONS (this is the meat — what ChatGPT should help me work through)

These are the decisions that actually change the **architecture, the cost, or what we promise.**
For each, use the label: **APPROVED** (committing) · **LEAN** (probably, revisit) · **DEFER**
(decide later on purpose) · **ASK QCLAY / COUNSEL** (need an expert first). *Most are still
blank — that's the point of the session.*

### Group A — Scope & product boundary (most important)
- **A1. What is the first valuable loop?** *Recommendation:* the **paired loop** (trader
  imports real trades → one honest AI insight; mentor runs a room → sees members' shared
  performance). Out: marketplace, social feed, execution, net-worth aggregation. **Answer: ___**
- **A2. How ambitious is v1 publicly?** *Recommendation:* **quiet founding beta** with mentors
  we know (vs. a big public waitlist launch). **Answer: ___**

### Group B — Geography & law (truly changes architecture)
- **B1. Launch region.** *Recommendation:* **US-first, built region-aware** so EU can be added
  later without a rebuild. **ASK QCLAY** to confirm region. **Answer: ___**
- **B2. Legal posture.** *Recommendation:* **software/analytics only** — no custody, brokerage,
  execution, or personalized advice in v1. **ASK COUNSEL** to confirm wording. **Answer: ___**

### Group C — Trade data (the keystone)
- **C1. How trades get in first.** *Recommendation:* **CSV import first**, then **read-only**
  broker/exchange connections (can see history, cannot move money). Crypto exchanges first
  (cleanest APIs), then FX/CFD. **Answer: ___**
- **C2. Ingestion vs execution.** *Recommendation:* **ingestion only** in v1. Execution is a
  separate licensing/liability project → a *separate future* QClay discovery. **Answer: ___**

### Group D — AI
- **D1. Do we train our own AI?** *Recommendation:* **No** — rent hosted models via one gateway.
  **Answer: ___**
- **D2. What's our proprietary AI work?** *Align on:* the **grounding + orchestration** layer
  (routing, feeding real data, "never invent numbers") — already scaffolded. **Answer: ___**

### Group E — Money (see the full model in Section 9)
- **E1. Free vs paid boundary.** *Recommendation:* **useful-free core** (join communities,
  follow verified mentors, small import, one real insight) → pay for **depth** (unlimited
  memory, full analysis, operator tools). **Answer: ___**
- **E2. First reliable payer.** *Recommendation:* **Mentor Pro first** (a mentor brings many
  students and expenses the cost), with a narrower **Founding Trader Pro** alongside.
  **Answer: ___**
- **E3. Marketplace fee + affiliate payouts.** *Recommendation:* **turn on later**, once rooms
  are populated. Affiliates paid only when a referred user actually *spends*. **Answer: ___**

### Group F — Handoff & budget
- **F1. What do we ask QClay to quote?** *Recommendation:* **three separate numbers** (design/IA,
  the read-only MVP build, an optional later execution discovery). **Answer: ___**
- **F2. Who owns security & compliance?** *Recommendation:* **QClay owns production security
  review; counsel owns legal.** **Answer: ___**

---

## 9. MONETIZATION — THE FULL PICTURE (this is where I keep getting stuck)

**Prime directive:** a useful product is not automatically a business. Monetization is a
*design problem* — who gets value, who pays, at what moment paying feels fair.

### The six actors (separate the people before pricing)
1. **Free trader** — pays $0; gets community, verified mentors, a small import, one insight;
   costs us AI + storage; is **inventory** that makes rooms feel alive. Abuse risk: farming
   free AI.
2. **Paid trader** — pays monthly; gets full memory, analysis, discipline tools.
3. **Mentor / operator** — pays monthly (a business expense); runs a room, sees members, gets a
   verified record. Brings 50–500 students each.
4. **Creator / seller** — sells communities/courses/agents/templates; we take a cut.
5. **Affiliate** — earns for referrals **that convert to real spend.**
6. **ARCHIO (us)** — earns across all engines.

**Key unlock:** free users aren't freeloaders — they're the inventory that attracts mentors and
makes communities alive. But they're only *worth* their AI/storage cost if enough convert or
attract payers. That tension is the whole game.

### The four revenue engines (layer 2–3 over time; no single one wins)
1. **Subscription** (Netflix) — recurring fee; high resistance, immediate revenue; needs a fast
   "magic moment."
2. **Usage / credits** (utility bill) — pay for what you consume (esp. AI); protects margin, but
   people hate meters.
3. **Commerce take-rate** (App Store / Etsy / Whop) — our cut when *users sell to each other*;
   lowest resistance (nobody pays until they've earned), but earns ~nothing until the
   marketplace is busy. **Likely the biggest long-term engine.**
4. **Partner / referral-in** — brokers/tools pay *us* for qualified users; lucrative later,
   needs scale.

### The core principle (answers "high or low resistance?")
> Resistance should be **low** to get *in* and *feel the magic*, and rise **only** at the exact
> moment the value becomes undeniable.
ARCHIO's **magic moment**: the AI reads real history and says one true, uncomfortable thing.
**Before** it, a paywall kills you (no one pays for a promise); **after** it, a paywall
converts. This is exactly why **freemium** fits. Two failure modes: *everything free forever*
(AI costs sink you) vs *everything paid* (empty rooms, no mentor, no magic moment).

### The recommended hybrid (a HYPOTHESIS to test, not a locked price)
- **Useful free network** layer (discovery, community, verified profiles, a taste of AI).
- **Mentor Pro** as the anchor paid offer (earliest reliable payer; brings the users).
- **Founding Trader Pro** — narrower, for early believers.
- **Included AI allowance** per tier (fair-use) — **not** a visible per-message meter — protects
  margin without meter anxiety.
- **Community-sponsored seats** (mentor pays for students) as an *experiment*.
- **Commerce take-rate + affiliate payouts** turned on **later**, once buyers and sellers exist.

### The affiliate confusion, resolved ("how do we pay affiliates if the app is free?")
You **don't** pay for a free signup. You pay when that person **spends money later.**
- I refer a friend → he joins free → ARCHIO owes me **$0** (correct — no money moved).
- Weeks later he buys Trader Pro or a mentor's community → **now** money moved → ARCHIO takes
  its cut and pays me a slice.
So "free" and "affiliate payouts" don't conflict: the free user is the **seed**; the affiliate
is paid from the **harvest**. Guardrails (non-negotiable): pay from **net collected revenue**
(after refunds/fees/taxes/reserves); define an **attribution window**; block self-referral/
fraud; set a **payout threshold**; allow **clawback** on cancellations/chargebacks; **never**
promise a perpetual percentage before modeling margin.

### The TradingView boundary (clean answer)
We are **not** charging for TradingView. We charge for **ARCHIO's brain** — memory, psychology,
verification, community tools, workflows. The chart is a free embedded widget we display
(attributed). We could remove it tomorrow and still have a paid product. (If we ever pipe in
real-time data *outside* the widget, that's a separate data-licensing/counsel question.)

### Unit-economics rules of thumb (for a technical/business advisor to pressure-test)
- **Revenue per payer** = price × retention. Longer retention beats a higher price.
- **Gross margin** = revenue − (AI + data + payments + support + storage). Free-tier AI cost
  means free users must convert or attract payers, or margin bleeds.
- **LTV should be ≥ 3× CAC**, and CAC should pay back in months, not years.
- **Marketplace revenue = GMV × take-rate** — small % of big volume; a *later, scale* engine.
- **AI allowances** exist because every AI answer costs real money; "unlimited free AI" can be
  bankrupted by a handful of power users.

---

## 10. THE PLAN OF ATTACK (what we're doing about all of this)

1. **De-panic the partner:** send him the plain-English "restaurant/kitchen" backend
   explanation + the reframing that QClay priced the city, not the house.
2. **Run one focused working session** to fill in the Section 8 decisions (label each APPROVED /
   LEAN / DEFER / ASK QCLAY / COUNSEL).
3. **Decide monetization enough to test it** (pick the *structure* to experiment with, not a
   final price sheet).
4. **Send QClay a tight reply** answering their three questions, stating the **bounded MVP**,
   and asking for **three separate quotes** + their expertise ("Given these constraints, what
   would you change before high-fidelity design?").
5. **Build the keystone** — the real trade pipeline — so the AI grounds on real trades.

**The scope-savings rule for the QClay reply:** we hand them **resolved product behavior,
vendor choices, and the MVP boundary.** We do **NOT** ask them to invent our business model,
research every vendor for us, or resolve founder policy. We reduce their discovery work; we
don't shift our decisions onto their meter. But we keep one open lane: *"what would you change
before design?"*

**Reconciliation note (important, don't ignore):** QClay's own v1.1 **Dashboard Design &
Release Plan** deliberately mandates *complete product design before beta* (separate from
backend activation). If we want a *reduced commercial scope*, that's an **explicit rescope /
contract conversation** — we don't silently shrink their agreed design mandate; we ask them to
re-quote the bounded MVP.

---

## 11. HARD "DO NOT OVERCLAIM" LIST (keep everyone honest)

Never let ourselves, the partner, or QClay believe any of these, because none is true yet:
- The AI runs on **real user trades** (it runs on **demo** data until the pipeline exists).
- We're at **production scale.**
- **Live broker sync / execution** exists (it doesn't; it's deliberately out of MVP).
- An **EU data plane** exists (US-first only).
- We've completed a **security review** or **audited compliance** (we haven't; QClay + counsel
  own those).

---

## 12. GLOSSARY (so ChatGPT and I speak the same language)

| Term | Plain meaning |
|---|---|
| Backend | Everything behind the kitchen door — the user never sees it. |
| API route | One door into our kitchen, built for one job. |
| Database | The storage room (we use Supabase / Postgres). |
| Auth | The bouncer — who you are, what you can see. |
| RLS (Row-Level Security) | A rule so a user can only ever read their *own* rows. |
| External API | A supplier truck — something we rent (Polygon, Stripe, AI, brokers). |
| Ingestion vs execution | Reading trades already made vs placing new orders that move money. |
| Grounding | Handing the AI real data before it answers so it can't make things up. |
| Foundation model | A big pre-trained brain (GPT/Claude) we **rent** — never train. |
| Normalize | Turn many messy data shapes into one clean, consistent shape. |
| Region | Which country the database physically lives in (matters for law). |
| Read-only API key | A key that can *see* an account but cannot move money. |
| Freemium | Free to get in and taste the magic; pay for depth. |
| GMV | Gross Merchandise Value — total volume sold through the marketplace. |
| CAC / LTV | Cost to Acquire a Customer / Lifetime Value of that customer. |
| Magic moment | The AI reading real history and telling you one true, uncomfortable thing. |

---

## 13. SUGGESTED PROMPTS TO GIVE CHATGPT AFTER PASTING THIS

- *"Act as my technical co-founder. Walk me through Section 8 one decision at a time, challenge
  my instinct on each, and tell me which ones actually change QClay's estimate."*
- *"Pressure-test the monetization hybrid in Section 9. Where does it bleed money? What would
  you change for a paired mentor/student launch?"*
- *"Help me write the founding-beta pricing experiment — what do I test in the first 30/60/90
  days before committing to any price?"*
- *"Given the bounded MVP in Section 7, estimate the realistic build cost/time for just that,
  versus the $300k–$350k full-vision number, and explain the delta."*
- *"Draft the exact message I send my partner to get him aligned before our session."*

---

*This document is a snapshot for reasoning, not a contract. Every recommendation stays a
recommendation until the founders approve it; every legal/vendor item needs counsel/vendor
confirmation.*
