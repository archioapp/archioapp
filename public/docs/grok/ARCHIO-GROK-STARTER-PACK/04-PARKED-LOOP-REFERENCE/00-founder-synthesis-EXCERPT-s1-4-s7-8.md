# EXCERPT of 00-founder-synthesis-2026-09-17.md — §1–4 and §7–8 (Product Brain pack)

*Exact copy of the header and sections 1, 2, 3, 4, 7 and 8 of `docs/source-of-truth/00-founder-synthesis-2026-09-17.md`. Sections 0, 5, 6, 9, 10, 11 are omitted per `09` §3. **§5 "Thesis F — Mentor's Ledger" is SUPERSEDED by `02` and is not included.** §6 object schemas are the Architect's. Read the ERRATUM in the header first.*

*Added 19 Sep 2026 (DL-017): in §8 below, "the system of record for trading intentions, entered through mentors" as the answer to "What company are we building?" and "it is the only core" are SUPERSEDED by `11-founder-direction-2026-09-19.md` (see its Appendix A). The text is kept verbatim; read it as describing the loop engine inside ARCHIO, not the company.*

---

# ARCHIO — Founder Synthesis

**Date:** 17 Sep 2026
> **ERRATUM (same night, see `02-revision-2026-09-17-kan-correction.md`):** §5 "Thesis F — Mentor's Ledger", the "B2C solo trader is probably wrong" claim, the Kan-cohort steps in §10, and the single kill criterion were built on a false premise (Kan has no students and does not trade). Those parts are SUPERSEDED. §1–4 (KNOWN / WRONG / market research), §6 object schemas, §7 repo audit and §8 existing-work classification stand.

**Inputs reconciled:** existing v0 codebase (this repo), Luke→Kan email (43 sections), master prompt (54 sections), ChatGPT context dump, QClay Visual Narrative v1.1 + Dashboard Design & Release Plan v1.1, QClay Telegram log (Jul 16 – Sep 4), backend decision packet / partner brief / learning workshop, Owen/TradeLocker deck, live external research (17 Sep 2026).
**Status of this document:** PROPOSED. Nothing here is decided until a founder moves it to the ledger (`01-decision-ledger.md`).
**Labels used:** KNOWN (evidence) · BELIEVED (plausible, undemonstrated) · IDEA · DECIDED · BUILT · LEGACY · OPEN · CONTRADICTION · ASSUMPTION · EXPERIMENT.

---
## 1. What we KNOW (evidence, not belief)

### 1.1 About our own product (from the repo, 17 Sep 2026)

| Fact | Evidence | Label |
|---|---|---|
| 337,512 lines of TS/TSX across 819 files; the two Vantary dashboard files alone are 48,364 (`your-space.tsx` 33,482 · `vantary-modules.tsx` 14,882) — corrected 17 Sep, see 07 | `wc -l` | KNOWN |
| A persisted event log exists: `public.copilot_events` (type/ts/session_id/user_id/context/data JSONB) with an open insert policy — corrected 17 Sep, see 07/08 | `scripts/copilot-tables.sql` | KNOWN |
| 31 component/lib files carry mock/demo data markers | grep | KNOWN |
| Real backend that exists: Supabase auth, `profiles`, `organizations`, `memberships`, `invites`, `groups`, `group_members`, `group_posts`, `rooms`, `community_mentors`, `plans`, `subscriptions` (Stripe webhook + checkout + portal), `copilot_events`, `forecast_groups`; 36 API routes; Polygon market data (`/api/market/*`, `/api/polygon/*`) | `scripts/*.sql`, `app/api/**` | KNOWN / BUILT |
| **No table for trades, orders, positions, plans, decisions, journal entries, rules, or a trader model. No broker connection. Zero server actions.** | grep across `lib`, `app`, `components`, `scripts` | KNOWN |
| One UI component already has a Trade Plan shape (`components/execution-copilot/copilot-trade-plan.tsx`) and one has a forecast object (`create-forecast-cockpit.tsx`); neither persists a decision | grep `TradePlan\|DecisionRecord` | KNOWN |
| The Live Room (`components/live-room/`) is built on a real `SessionEvent` ledger with derived lenses and provenance — the only thing in the repo that already behaves like an append-only decision log | memory + code | KNOWN |
| The Owen deck states plainly: "execution is the piece we don't have connected" | `deck-data.ts` | KNOWN |
| 30+ routes exist, several overlapping (`/dashboard`, `/cockpit`, `/archio`, `/nexus`, `/intelligence`, `/hub`, `/pitch`, `/newpitch`, `/owen`, `/masterplan`, `/backend-map`) | `find app -name page.tsx` | KNOWN |

**What this tells us:** the product is a *presentation layer with real auth, community and billing plumbing underneath*. The intelligence layer the thesis depends on has never been started. That is not a criticism of the work — the UI is genuinely strong — it is the single most important fact for deciding what to do next, because it means **every claim about "it knows you" is currently a design, not a system**.

### 1.2 About the market (live research, 17 Sep 2026)

| Player | What they ship today | What it proves / commoditizes |
|---|---|---|
| **TradeZella** | Zella AI: autonomous background agents on imported trade history — Trade Auto-Tagger, Session Review, Market Sentiment Briefing, AI game plans. $35 / $59 / $99 per month, no free tier. | "AI that reads your trades and reviews your session" is a **$59/month commodity today**. Journaling-with-AI is not a wedge. |
| **TradingView** | AI Chart Copilot public beta (2 Apr 2026, Chrome side panel: S/R, alerts, news context). Ask Pine (NL→Pine v6). **MCP Server public beta (16 Sep 2026)**: paid subscribers can connect external agents (e.g. Claude) to their TradingView account for platform-wide data and tool access. | The chart is becoming an *agent surface*. "TradingView in the centre of our cockpit" is about to be everyone's. Also an **opportunity**: an agent can read chart state without us embedding TradingView. |
| **TradeLocker** | Studio: integrated desktop algo environment with an AI assistant for strategy creation, backtesting, Python. Brand API + BrandSocket (positions/orders/balances in real time). | Owen's company builds AI itself. "Why won't TradeLocker build it?" is a live question, not rhetorical. |
| **Pre-trade gate apps** | TRADIS (checklist + 30-min cooldown), TradeGate (checklist + mindset check + budget block), EdgeFlo (disables trade button on limits), TradingPlan (rules→mandatory flow), **XeanVI (AI validation gate against playbook + broker-routed orders)**, PropSentinel, Risk Marshal, LockMyTrades, KhomaAPI (kill-switch via Tradovate API), Meridian. | "Rules checked BEFORE the ticket" (our Act III slide 04) is a **crowded micro-category of ~10 small apps**. Not differentiated. Fine as a feature; dead as a wedge. |
| **Invo (Involio)** | Mobile crypto/derivatives copy-trading, non-custodial, verified trades, leaderboards; creators earn 15% fee-share when their trade is mimicked. | Creator monetization via verified copy is **live and priced**. |
| **Fomo** | Social-first cross-chain trading, copy from the feed, perps added June 2026. **$75M Series B, $550M valuation (June 2026).** | Social + copy + creator economy has institutional capital behind it — in crypto. |
| **eToro / Whop / Skool / Discord** | LEGACY context from Act I of our own deck: mentors run paid communities, students pay ~$3,600, proof = screenshots. | The mentor-student market exists and pays. The trust problem (screenshots) is unsolved by any of the above. |

### 1.3 About trader behaviour (research)

- Pre-commitment devices measurably reduce disposition effect and trend-chasing. **KNOWN.**
- Process-focused metrics outperform raw P&L as feedback for improvement. **KNOWN.**
- Informational interventions decay over time unless tailored to the individual. **KNOWN.**
- Traders say they want to journal; the industry's retention numbers say most stop within weeks. **BELIEVED (strong), no first-party data.**

### 1.4 About QClay

- Proposal: $7k IA / $35k design / $300–350k build, 12 months, 12–15 people, **AI excluded**. **KNOWN.**
- Their v1.1 plan mandates "design the complete product now" (66 page cards, 9 systems, five phases). **KNOWN.**
- Their three technical questions are unanswered; landing sections 06–07/09 are blocked on dashboard UI; they owe "options for moving forward" since 31 Aug and the log shows no reply. **KNOWN / OPEN.**
- Logo direction approved 13 Aug. **DECIDED (visual only).**

---

## 2. What we THINK (BELIEVED) and what we are probably WRONG about

| Belief | Held by | Verdict |
|---|---|---|
| Traders will write a plan before a trade if the tool is good enough | Email §35, ChatGPT | **Unproven and the whole thesis rests on it.** No first-party data. Ten gate apps exist and none is large — weak signal that the solo version is hard. |
| "Nobody records the decision, only the trade" | Email §2, ChatGPT | **Mostly true today** — the gate apps check rules but do not store thesis/invalidation; TradeZella tags after the fact; copy apps store the trade. This is the strongest surviving claim. But "nobody does it" can mean "nobody wants it". |
| The moat is longitudinal personal data | Email §40 | **Partially wrong.** TradeZella already has years of imported trade history per user. The *outcome* history is not scarce. The *intention* history is — and only if traders create it. |
| Nine systems are needed for the product to feel complete | QClay v1.1, Ecosystem Masterplan | **Wrong for now.** It is the "build the pretty upper layers first" failure the email itself names in §39. |
| An eleven-brain Grok organization will accelerate us | Email §28 | **Premature.** Eleven specialized bots with no product data and no users produce eleven confidently-argued hallucinations. Three roles and one document will do more this month. |
| TradeLocker is our execution rail | Owen deck, decision packet | **Undecided in reality.** Owen has not committed; TradeLocker ships its own AI; execution is regulated. Treat as a *read-only data partner first*. |
| We are a B2C product for the individual trader | Every document | **Worth challenging** — see Thesis F. The repo's real backend (orgs, memberships, invites, rooms, mentors, Stripe) fits a mentor-cohort product better than it fits a solo OS. |
| "Trading OS" is the right description | Email §41 | **Too big a promise for a company with no trade table.** Use it internally as a horizon; do not put it on a landing page until the loop retains. |

**CONTRADICTIONS on file**
1. QClay v1.1 "design the complete product now" vs. the email's "one complete trading loop" and the decision packet's bounded first house. — *Resolve by reasoning: the email wins; QClay's scope must be cut or paused.*
2. Decision Packet marks region / scope / AI as LOCKED; Partner Brief and ChatGPT dump leave them blank. — *Resolve by a founder decision this week; record it in the ledger.*
3. ~~Name: ARCHIO across QClay material vs. Trading Pilot in the email and prompt.~~ — **RESOLVED: ARCHIO** (DL-007). "Trading Pilot" was chat-thread drift, not a candidate.
4. Owen deck says "we don't touch the trade"; the email's loop (§35 step 5) includes Execute. — *Resolve by sequencing: read-only sync in v1, execution never before v3 evidence.*

---

## 3. Disagreement map

| Question | ChatGPT thesis | Email (Luke) | Existing product implies | QClay | Competitors show | Behaviour research | Technical reality |
|---|---|---|---|---|---|---|---|
| What is the core object? | Decision Record + Trader Model | Same | The *card* (UI) — no data object exists | The *page* (66 cards) | The *trade* (all of them) | The *pre-commitment* | An append-only event is cheapest to build (Live Room already does it) |
| Who is the user? | Individual serious trader | Individual, later creators | Individual (dashboard) but backend is org/membership/mentor | Individual + Founding Beta | Crypto retail (Invo/Fomo); journalers (TradeZella) | Interventions work best when *tailored* and *socially reinforced* | Cohort = one tenant model already in `organizations` |
| Is AI central? | Yes (agents) | Yes but "only as the loop requires" | Yes in copy, none in code | Excluded from quote | Yes — and priced at $59/mo | No — the record and the feedback loop are the mechanism | One LLM call (review) is sufficient for v1 |
| Execution? | Later, permissioned | Step 5, "could be simulated/manual" | Not connected (honest) | Phase 4+ | Gate apps route orders; TradeLocker builds AI | Irrelevant to behaviour change | Regulated, hard, and someone else's core business |
| Marketplace? | Long-term, after verification | §37: after creator experiment | Featured in pitch, nothing in code | Group 09 | Invo/Fomo live in crypto with $M funding | — | Needs verified adherence + outcomes first |
| Scope now | Bounded loop | Bounded loop | 9-system product | Complete product | Single-feature apps everywhere | — | 337k lines of UI cannot be maintained by two founders + bots |

**Resolvable by reasoning now:** scope (bounded loop), AI's role (review only), execution (read-only first), marketplace (defer), Grok org size (3 not 11).
**Needs external research:** regulatory line between "checking your own rules" and "advice" per jurisdiction; TradeLocker's actual API terms for read-only third-party sync.
**Needs technical investigation:** plan→fill matching (partial fills, scale-ins, multiple entries); TradingView MCP as a read surface.
**Needs user interviews (this week):** will Kan's students write a plan if Kan asks? What do they write today (Discord message? nothing?)?
**Needs a prototype:** the 20-second plan capture — nothing else.
**Needs real product data:** everything about the Trader Model.

---

## 4. Competing theses, compared honestly

Scoring is relative (1 weak – 5 strong) on the dimensions that actually discriminate. Ambition is not a column.

| | A. Existing TP (polish what's built) | B. Trader OS (Trader Model + Decision Records) | C. Agent platform | D. Intelligence marketplace | E. Simple wedge: Plan→Review loop for individuals | **F. Mentor's Ledger (cohort wedge)** |
|---|---|---|---|---|---|---|
| Pain severity | 2 (features exist elsewhere) | 4 | 2 | 3 (for creators) | 4 | **5** (mentor's proof problem + student's discipline problem, same record) |
| Frequency | 3 | 5 (every trade) | 2 | 1 | 5 | **5** |
| Willingness to pay | 2 (TradeZella owns $35–99) | 3 | 2 | 4 (creators pay for distribution) | 2–3 | **4** (mentor already charges $3,600; pays for retention + proof) |
| Current alternatives | Many | Few (nobody stores intention) | TradingView MCP, TradeLocker Studio | Invo, Fomo, Whop | 10 gate apps, TradeZella | Whop/Skool/Discord + screenshots (weak) |
| Differentiation | 1 | 4 | 1 | 2 | 3 | **4** |
| Defensibility (data created) | 1 | 4 (intention data) | 1 | 3 (network) | 3 | **4** (intention data + cohort adherence + mentor lock-in) |
| Distribution | 1 (we have none) | 1 | 1 | 3 | 1 | **5** (each mentor brings 50–500 students) |
| Regulatory exposure | Low | Low–Med (own rules only) | High (autonomy) | High (signals) | Low | Low–Med (mentor is not advised by us; must not become one through us) |
| Time to useful | Never (no core) | 60–90 days | 6+ months | 12+ months | 30 days | **30 days** |
| Fit with existing code | 5 | 2 | 1 | 2 | 3 | **4** (orgs/memberships/invites/rooms/mentors/Stripe/Live Room all fit) |
| Cheap to validate | 1 | 3 | 2 | 2 | 4 | **5** (Kan's own students) |
| AI dependence / cost | Low | Med | High | Med | Low | Low |
| Ease of copying | Trivial | Hard once data exists | Trivial | Hard once network exists | Medium | Hard once a mentor's cohort history lives here |
| Kill risk | Irrelevance | Traders don't record | Platform giants | Cold start | Solo traders don't record | Mentors won't expose adherence; small TAM per mentor |

**Placement of each concept**
- Decision Record: **infrastructure and entry wedge** — the only object that matters.
- Trader Model: **infrastructure**, v0 is deterministic aggregates (see §6). Not AI.
- Agents: **product experience, later** — one LLM step in v1 (the review).
- Multi-agent workflows: **long-term expansion**. A "London Open workflow" is a scheduled template for now.
- Creator intelligence: **entry wedge in F** (the mentor's rules as a checkable spec), **network effect later**.
- Marketplace: **monetization + network effect, much later**. Not before verified adherence exists.
- Community: **the commitment device** (cohort), not a feed. Feed = distraction now.
- Cockpit: **product experience, later**. The loop lives on one page first.
- Execution / TradeLocker: **infrastructure, read-only first**; execution = long-term.
- Forecasts: **a Decision Record with `visibility=public`**. Reframe, do not rebuild.
- Education / Student Hub: **distraction now** — the mentor's rules *are* the education.
- Journal: **a view over Decision Records**, not a system.
- Psychology: **infrastructure** — a self-report field on the record + deterministic flags (revenge, size creep). Not a page.
- Leaderboards / Net Worth / Portfolio: **distraction now**.

---

*[§5 and §6 omitted — see note at top]*

---

## 7. Existing work — classification

| Component | Verdict | Why |
|---|---|---|
| Supabase auth, `profiles`, `/api/auth/*` | **KEEP** | Real, needed by every thesis. |
| `organizations`, `memberships`, `invites`, `groups`, `rooms`, `community_mentors`, Stripe `subscriptions` | **KEEP + REFRAME** | This *is* the Mentor's Ledger tenant model. Rename nothing; use it. |
| Polygon routes (`/api/market/*`, `/api/polygon/*`), `lib/providers/polygonRest.ts` | **KEEP** | Feeds `market_snapshot`. |
| Live Room `SessionEvent` ledger + lenses | **KEEP + CONNECT** | Closest thing to a decision log in the repo. A mentor's "call" event should be able to spawn a student's Decision Record (`session_event_id`). |
| `copilot-trade-plan.tsx`, `copilot_events` | **CONNECT** | Already the right shape; make it write `decision_records` instead of ephemeral state. |
| Forecast (`/forecast`, `create-forecast-cockpit.tsx`, `forecast_groups`) | **KEEP + REFRAME** | A forecast is a Decision Record with `visibility=public` and no size. Keep the UI, change what it writes. |
| Flight Deck dashboard shell (`your-space.tsx`, 33k lines) | **MODIFY (freeze growth)** | Keep as the visual shell; do not add to it. The loop ships on one new page. Split the file when you next touch it, not before. |
| Trading DNA, Psychology, Journal, History concepts | **MERGE** | All become views over `decision_records` + `decision_reviews`. No separate systems. |
| Owen deck, `/pitch`, `/newpitch` | **KEEP, do not touch** | Already honest ("not connected yet"). Update only after loop evidence. |
| Design system (tokens, glass, Cinzel/Geist grammar), brand assets, QClay logo | **KEEP** | Done. Stop iterating. |
| `/nexus`, `/intelligence`, `/archio`, `/cockpit`, `/hub`, `/masterplan`, `/backend-map` | **DEFER / consolidate later** | Overlapping routes; consolidation is cheap and not urgent. Do not build into them. |
| Marketplace, agent marketplace, Net Worth, Portfolio, leaderboards, Student Hub, 9-card landing morph | **DEFER** | Distractions until the loop retains. |
| QClay full-product design engagement ($35k + $300k) | **DEFER / rescope** | Do not fund a 12-month build of a product whose core hypothesis is untested. Offer them the bounded loop or pause. |
| Broker execution (TradeLocker write) | **DEFER to v3** | Read-only sync first. |
| Anything | **REBUILD: none** | Rebuilding is the trap. Nothing here needs to be torn down to test the hypothesis. |
| Missing foundation | `decision_records`, `trades`, `decision_reviews`, the matcher, the 20-second capture UI | This is the whole gap. |

---

## 8. Answers to the questions we could not skip

**What company are we building?** A decision-infrastructure company for discretionary traders: the system of record for trading intentions, entered through mentors. "Trading OS" is the horizon, not the pitch.
**What problem should we own?** The gap between what a trader intended and what they did — measured, not remembered.
**Initial user?** Kan's students (cohort 1), then two more mentors' cohorts. Not the anonymous solo trader.
**What do they need?** To plan in under 20 seconds, to see the deviation without judgment, and to have their mentor see it too.
**What does the market already solve?** Post-hoc AI journaling (TradeZella), chart AI (TradingView), rule gates (10 apps), copy + creator pay (Invo/Fomo), algo AI (TradeLocker Studio).
**What are competitors proving?** Traders pay $59/mo for AI over their history; creators will share for 15%; capital believes in social+copy; platforms are opening to external agents.
**Incorrectly assumed unique:** rules-before-ticket; AI session review; TradingView-in-the-centre; "it knows your history"; creator fee-share.
**Actually differentiated:** the locked pre-outcome record, adherence as the primary metric, cohort-level view for the mentor, verification that is not P&L.
**Defensible:** intention data over time; a mentor's cohort history; the spec-as-software for a strategy. **Not defensible:** UI, AI, agents, any single feature, TradingView embedding, broker plumbing.
**Do we need a Trader Model?** Yes — as six aggregates first. **Market Model?** No. **Decision Record core?** Yes; it is the only core.
**Trading memory?** Append-only records + matched trades + reviews. Nothing is edited after `locked_at`.
**AI does:** phrase the review, later draft a plan from a chart. **Deterministic does:** every judgment, every match, every metric, every permission.
**Multiple agents?** No. **Agents never:** place orders, move stops, judge adherence, or speak without citing the record.
**Creator intelligence — can expert knowledge become software?** Partly and testably: setups, invalidation, sizing and no-trade windows can be checked; "feel" cannot. Run the Kan experiment (§37) with real students and measure disagreement rate.
**Marketplace?** Only after: verified adherence records exist, one strategy is expressed as a checkable spec, one cohort shows adherence lift. Trust comes from adherence + synced outcomes, never screenshots or P&L.
**Community fits as:** the cohort. **Execution:** read-only sync v2; write never before v3 evidence. **TradeLocker:** data partner first — go to Owen with "read-only fills for adherence" and nothing else. **Psychology:** a field and three flags. **Journaling:** a view. **Education:** the mentor's spec. **Forecasting:** a public record. **Cockpit:** later shell. **Monetization:** free for cohort 1; mentor per-seat from cohort 2; never compete with TradeZella at $35–99 B2C. **Distribution:** mentors; later, TradingView MCP as a read surface.
**Entry wedge:** Mentor's Ledger. **V1:** one cohort, form capture, CSV import, six aggregates, one review call. **V2:** TradeLocker read-only sync, hotkey/Live Room capture, second and third mentors, per-seat billing. **Much later:** solo B2C, agents, workflows, marketplace, cockpit. **Never unless evidence changes:** autonomous execution, leaderboards, an AI that recommends trades.
**Biggest technical risks:** plan→fill matching; capture latency; keeping a 337k-line UI alive. **Business:** mentors refuse visibility; TAM per mentor; TradeZella adds pre-trade plans in one release. **AI:** a wrong review; cost per review at scale is trivial, trust is not. **Data:** broker credentials (use OAuth/read-only only), PII of students under a mentor tenant, screenshot OCR errors. **Regulatory:** the line between "checking your rules" and "advice"; a mentor's encoded spec as a signal; execution. **Validate with traders:** will they lock a record in <20s; will mentors show cohort adherence; do students want the mentor to see. **Test rather than build:** everything above — with a form and a spreadsheet if necessary.

---

