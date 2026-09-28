# ARCHIO — Partner Backend Brief

> **What this is:** everything you need to (1) email your partner so he stops feeling
> overwhelmed by "the backend," (2) run one focused working session together, and (3) send
> QClay a tight reply afterward.
>
> **How to use it:** Part 1 is a send-ready email — copy/paste it. Part 2 is the honest
> current state of the code. Part 3 is the decision workbook you fill in *together*. Part 4
> is the QClay reply you assemble *after* the workbook. Part 5 is what to prepare so you stop
> paying QClay to think about things you can decide yourselves.
>
> **One rule for this whole document:** we never present a *recommendation* as a *fact*. Every
> open item is labelled. That is what keeps QClay honest and keeps us from overpromising.

---

## Part 0 — The one thing to understand first (read this before anything else)

QClay's estimate ($300k–$350k / ~12 months) is **not the price of ARCHIO's first real
product.** It is roughly the price of the *entire document we sent them* — about 75 screens,
45 modals, 10 drawers, the marketplace, the social network, execution, verification, all of
it. We handed them the **five-year city plan** and asked what the **first house** costs, and
they (correctly) priced a lot of the city.

That is not QClay being greedy or wrong. It is us not yet having drawn a line around the
**smallest version of ARCHIO that is actually valuable and sellable.**

So the goal of the session is **not** "how do we afford $350k." The goal is:

1. Draw the line around the **first valuable loop** (what we actually build first).
2. Answer the handful of decisions that change the *architecture* (region, data, AI, money).
3. Send QClay a reply that says "here is the bounded thing, here is what's decided, here is
   where we want your expertise" — so they can quote the **house**, not the **city**.

If you internalize only one sentence for your partner, it's this:

> **We are not behind. We just described the whole vision to a builder before telling them
> which room to build first. Tonight we pick the room.**

---

## Part 1 — The email to send your partner (copy/paste, edit the voice to yours)

**Subject: Before we talk — here's the backend in plain English (it's smaller than it looks)**

Hey [partner],

I know the backend + the QClay estimate have felt like a lot. I spent real time breaking it
down so we can walk in clear-headed instead of anxious. Read this once before we talk — it's
written for us, not for engineers.

**First, the estimate.** QClay's $300k–$350k number is priced against the *full* document we
sent them — basically the entire long-term vision (~75 screens, the marketplace, the social
side, execution, everything). That's the whole "city." We haven't yet told them which single
"house" to build first. That's on us, and it's the main thing we fix in this call. The real
MVP is a fraction of that scope.

**Second, the backend itself.** Here's the mental model that made it click for me — think of
ARCHIO as a restaurant:

- **The dining room = the app screens.** What the user sees and taps. We've basically built
  this already.
- **The kitchen = the backend.** Everything behind the door. And a kitchen only ever does
  four jobs:
  - **Storage room (Database):** remembers things — trades, profiles, communities.
  - **The bouncer (Auth):** checks who you are and what you're allowed to see.
  - **Supplier trucks (External APIs):** things we *rent* from outside — market prices
    (Polygon), payments (Stripe), the AI brain, and later broker connections.
  - **The specialty chef (AI):** takes raw data and turns it into an actual answer.

Every single feature — communities, the journal, net worth, the AI verdicts — is just those
four jobs in a different combination. Once I saw that, "the huge scary backend" turned into
**one simple pattern repeated a bunch of times.** When you tap something: the waiter carries
your order to the kitchen (an "API route"), the bouncer checks you, the kitchen grabs your
data / calls a supplier / asks the chef, then a clean plate comes back to your screen. That's
the whole thing.

**Third — and this matters — what we RENT vs what we BUILD.** We do **not** build the hard,
expensive commodity stuff. We *rent* the AI brain, the payment system, the market prices, the
charts. Nobody builds their own electricity. What we *build* — and what actually makes ARCHIO
worth money — is the stuff no one can rent: turning a trader's messy history into one clean
record, giving the AI that real data so it can't make things up, the trust/verification, and
the decision logic. **We rent the muscles; we build the brain and the memory.**

**Fourth, what already exists.** A lot. We have the screens, login, the database structure,
the market-data hookup, the payments plumbing, and a working AI engine that already refuses to
invent numbers. The honest gap is: the AI is currently reasoning over *demo* trade data
because we haven't built the pipeline that pulls in a user's *real* trades yet. That pipeline
is the single most important thing to build next, and everything else leans on it.

**What I need from you on the call.** I don't need you to become technical. I need your gut on
a set of business/direction questions — where we launch, who pays and for what, how "free"
the free version is, and how ambitious the first version should be. I've written them all out
with the trade-offs so we can just go down the list. By the end we'll have decisions written
down, and I'll turn those into a short, confident reply to QClay so they can quote the *real*
first version instead of the whole galaxy.

Take a breath — this is more in control than it's felt. See you [when].

— [you]

---

## Part 2 — The honest current state (what's real vs what only looks real)

Bring this table to the call. It is deliberately conservative so we never overclaim — to each
other *or* to QClay. Status is grounded in the actual repository.

| Area | What exists | Honest status |
|---|---|---|
| App screens (Flight Deck, communities, charts, AI chat) | Built in Next.js + React | **Working** (frontend) |
| Login / signup / sessions | Supabase Auth | **Working** |
| Database + per-user security | Supabase Postgres + Row Level Security | **Working** (structure) |
| Communities / rooms / memberships | Our own API routes on Supabase | **Working** |
| Market data (FX / equities) | Polygon.io + fallbacks | **Working, free tier** — needs paid tier for production |
| Charts | TradingView widget | **Working** (rented, embedded) |
| Payments / subscriptions | Stripe routes + webhook | **Plumbed** — needs real products/prices + a decided pricing model |
| AI engine | Response engine via Vercel AI Gateway (OpenAI today) | **Working, but grounded on DEMO trades** |
| Real trade pipeline (import → normalize → store) | — | **Missing — this is the keystone** |
| File storage (screenshots, statements) | — | **Missing** (Vercel Blob is the likely rental) |
| Verified track record | — | **Missing** (depends on the trade pipeline) |
| Live trade execution | — | **Deliberately out of MVP** |
| EU / multi-region data | — | **Deliberately later** |

**The single most important honest sentence:** *the AI is real, but until we build the trade
pipeline it's reasoning over demo data, not the user's real trades.* Everything downstream —
verified records, real verdicts, net worth truth — waits on that one pipeline.

---

## Part 3 — The Decision Workbook (fill this in together)

These are the decisions that actually change the architecture, the cost, or what we promise.
For each one: what it means, why it matters, the options, a **recommendation** (clearly a
recommendation, not a decree), what happens if we defer it, and a blank for your answer.

> Label each final answer as: **APPROVED** (we're committing) · **LEAN** (probably, revisit) ·
> **DEFER** (intentionally decide later) · **ASK QCLAY / COUNSEL** (need an expert first).

### Group A — Scope & product boundary (the most important group)

**A1. What is the first valuable loop?**
- *Meaning:* the smallest version someone would actually use and pay for.
- *Why it matters:* this is the number that turns $350k-for-everything into a real quote.
- *Recommendation:* the **paired loop** — a trader imports real trades → gets one honest AI
  insight; a mentor runs a room → sees members' shared performance. Journal + AI + communities
  + verified basics. **Out:** marketplace, social feed, execution, net-worth aggregation.
- *Defer cost:* if we don't draw this line, QClay keeps quoting the whole city.
- **Your answer:** ______________________

**A2. How ambitious is v1 publicly?**
- *Meaning:* do we ship the small loop quietly, or market it big?
- *Options:* (a) quiet founding beta with mentors we know; (b) public launch with a waitlist.
- *Recommendation:* **(a) founding beta.** Real users, low promises, fast learning.
- **Your answer:** ______________________

### Group B — Geography & law (this one truly changes the architecture)

**B1. Launch region.**
- *Meaning:* which country our database physically lives in first.
- *Why it matters:* trading data often must be stored in the user's region by law. US and EU
  at once ≈ ~2.5× the infrastructure and cost.
- *Recommendation:* **US-first, but built "region-aware"** so an EU copy can be added later
  without a rebuild. **ASK QCLAY** to confirm the region and review the boundary.
- **Your answer:** ______________________

**B2. Legal posture.**
- *Meaning:* what we legally *are*.
- *Recommendation:* **software / analytics only** — no custody, no brokerage, no personalized
  investment advice, no order execution in v1. This massively shrinks legal risk.
- *Note:* **ASK COUNSEL** to confirm wording before launch; we don't self-certify compliance.
- **Your answer:** ______________________

### Group C — Trade data (the keystone)

**C1. How trades get in first.**
- *Recommendation:* **CSV import first**, then **read-only** broker/exchange connections
  (they can see history but cannot move money). Crypto exchanges first (cleanest APIs), then
  FX/CFD.
- **Your answer:** ______________________

**C2. Ingestion vs execution.**
- *Meaning:* reading trades already made vs placing new orders.
- *Recommendation:* **ingestion only** in v1. Execution is a whole separate licensing/liability
  project — worth a *separate* future QClay discovery, not the MVP.
- **Your answer:** ______________________

### Group D — AI

**D1. Do we train our own AI?**
- *Recommendation:* **No.** We **rent** hosted models (OpenAI/Anthropic/etc.) through one
  gateway so we can swap providers per feature. Training our own is unnecessary and
  cost-prohibitive.
- **Your answer:** ______________________

**D2. What's our proprietary AI work then?**
- *Answer to align on:* the **grounding + orchestration** — routing each question to the right
  place, feeding the model the user's *real* data, and enforcing "never invent numbers." This
  is already scaffolded; it just needs the real trade pipeline behind it.
- **Your answer:** ______________________

### Group E — Money (the part we've been circling — see the full monetization doc)

**E1. Free vs paid boundary.**
- *Meaning:* how much works without paying.
- *Recommendation:* **useful-free core** (join communities, follow verified mentors, small
  import, one real insight) → pay for **depth** (unlimited memory, full analysis, operator
  tools). Free fills the rooms; paid charges once the value is *felt*.
- **Your answer:** ______________________

**E2. Who is the first reliable payer?**
- *Recommendation:* **Mentor Pro first** (a mentor brings many students and expenses the cost),
  with a narrower **Founding Trader Pro** alongside for early believers.
- **Your answer:** ______________________

**E3. Marketplace fee + affiliate payouts.**
- *Meaning:* our cut when users sell to each other; paying referrers.
- *Recommendation:* **turn on later**, once the rooms are populated. Affiliates get paid only
  when a referred user actually *spends*, never for a free signup.
- **Your answer:** ______________________

> Full reasoning, side-by-side models, and pros/cons live in
> `docs/archio-monetization-strategy.md`. Bring both docs to the call.

### Group F — Handoff & budget

**F1. What do we ask QClay to quote?**
- *Recommendation:* **three separate numbers**, not one: (1) design/IA for the bounded MVP,
  (2) the read-only intelligence MVP build, (3) an *optional* later execution discovery. This
  stops the single scary $350k number from dominating.
- **Your answer:** ______________________

**F2. Who owns security & compliance work?**
- *Recommendation:* **QClay owns production security review; counsel owns legal.** We don't
  pretend we've done either.
- **Your answer:** ______________________

---

## Part 4 — The QClay reply (assemble AFTER the workbook)

The full sendable draft lives in `docs/qclay-reply-draft.md`. It answers their three exact
questions in order and adds the one thing they're missing: **the bounded MVP.** The posture:

- Confident about what's **decided and already built.**
- Honest about what's **intentionally open.**
- Explicit that the first document was the **vision**, and here is the **bounded first build.**
- Inviting their expertise: *"Given these constraints, what would you change before design?"*

**The reply must reduce their work, not shift ours onto them.** We send resolved product
behavior, our vendor choices, and the MVP boundary. We ask them to validate architecture,
flag risks, and quote the bounded scope — not to invent our business model or research every
vendor for us.

---

## Part 5 — What to prepare so we stop overpaying QClay

Every hour we spend deciding is an hour we don't pay QClay to guess. Before more paid work:

**We (founders) decide — free:**
- The bounded MVP loop, the free/paid line, first payer, launch region, legal posture,
  ambition level, budget ceiling. (Part 3.)

**We + v0 prepare — cheap:**
- The honest current-state inventory (done — Part 2).
- The vendor/API matrix with statuses (in the decision packet + QClay draft).
- Draft trade schema, user flows, and clickable prototype priorities.
- A written question log for QClay so the call is efficient.

**QClay owns — paid, and worth paying for:**
- Final architecture validation, security threat model, regional design, production build and
  accountability, and the phased estimate.

**Counsel owns — paid, non-negotiable:**
- Data residency, financial-services posture, market-data licensing, disclosures.

**Do NOT fake ourselves into believing:** that the AI runs on real user trades yet, that we're
production-scale, that execution or EU are in the MVP, or that we've done a security/compliance
review. Honesty here is what makes the QClay relationship (and the product) trustworthy.

---

## Appendix — Jargon, translated

| Term | Plain meaning |
|---|---|
| Backend | Everything behind the kitchen door — the user never sees it. |
| API route | One door into our kitchen, built for one job. |
| Database | The storage room. We use Supabase (Postgres). |
| Auth | The bouncer — who you are, what you can see. |
| RLS | A rule so a user can only ever read *their own* rows. |
| External API | A supplier truck — something we rent (Polygon, Stripe, AI, brokers). |
| Ingestion vs execution | Reading trades you already made vs placing new orders that move money. |
| Grounding | Handing the AI real data before it answers so it can't make things up. |
| Foundation model | A big pre-trained brain (GPT/Claude) we **rent** — never train. |
| Region | Which country the database physically lives in. Matters for the law. |
| Read-only API key | A key that can *see* an account but cannot move money. |
| Normalize | Turn many messy data shapes into one clean, consistent shape. |
