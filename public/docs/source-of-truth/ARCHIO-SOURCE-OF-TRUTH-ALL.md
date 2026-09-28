<!--
  ARCHIO Source of Truth — complete folder
  Generated 2026-09-23 from docs/source-of-truth/ by scripts/bundle-source-of-truth.mjs
  17 files concatenated in reading order. Each file starts at a line
  reading "<!-- FILE: name -->" followed by a level-1 heading, so an AI can address
  a section as "<file> §<n>" exactly as the documents cross-reference each other.

  READING ORDER FOR AN AI
    1. 14-archio-master-cross-reference.md  §0  (the AI-to-AI briefing: what ARCHIO is, who the bots are, what is real vs mock)
    2. 12-product-design-control-center.md   (every UI surface as a control record, one vocabulary)
    3. 13-technical-backend-control-center.md (every table, route, foundation, security flag — from code)
    4. everything else, only when a control record points at it
  Counts are canonical in 13 §9 — do not re-derive them.
-->

# ARCHIO Source of Truth — complete folder

_Generated 2026-09-23. Source of truth remains `docs/source-of-truth/`; this file is a convenience copy._

## Contents

| # | File | Title | Lines | Size |
|---|------|-------|------:|-----:|
| 1 | `README.md` | ARCHIO — source of truth: index | 73 | 18 KB |
| 2 | `00-founder-synthesis-2026-09-17.md` | ARCHIO — Founder Synthesis | 320 | 33 KB |
| 3 | `01-decision-ledger.md` | Founder Decision Ledger | 446 | 66 KB |
| 4 | `02-revision-2026-09-17-kan-correction.md` | Revision 02 — after the Kan correction | 102 | 14 KB |
| 5 | `03-intent-capture-position.md` | 03 — Intent Capture: position, corrections, design target | 129 | 13 KB |
| 6 | `04-kan-5-minute-version.md` | Kan — the 5-minute version | 39 | 6 KB |
| 7 | `05-founder-memo.md` | Full founder memo — Luke to Kan | 188 | 21 KB |
| 8 | `06-tonight-working-session.md` | Tonight's working session — Luke + Kan | 105 | 9 KB |
| 9 | `07-grok-grounding-2026-09-17.md` | Grok bot setup — grounding verification against the real ARCHIO project | 195 | 17 KB |
| 10 | `08-architect-repo-facts.md` | ARCHIO — repo facts for the bots (v0-verified, 17 Sep 2026 · one row corrected 20 Sep 2026, DL-019 · connect-candidate + legacy-audit lines corrected 20 Sep 2026, second session) | 58 | 7 KB |
| 11 | `09-bot-context-packs.md` | Grok bots — governance, glossary, context packs and system prompts | 136 | 30 KB |
| 12 | `10-kan-chain-evidence-ladder.md` | Kan's chain as the evidence ladder — arrow-by-arrow challenge | 56 | 8 KB |
| 13 | `11-founder-direction-2026-09-19.md` | ARCHIO — Founder Direction | 198 | 16 KB |
| 14 | `12-product-design-control-center.md` | 12 — ARCHIO Product / Design Control Center | 719 | 92 KB |
| 15 | `13-technical-backend-control-center.md` | 13 — ARCHIO Technical / Backend Control Center | 545 | 57 KB |
| 16 | `14-archio-master-cross-reference.md` | 14 — ARCHIO Master Cross-Reference | 882 | 132 KB |
| 17 | `15-structural-map-v1.md` | ARCHIO — Structural Map v1 (founder-approved) | 83 | 14 KB |



---

<!-- FILE: README.md -->

# ARCHIO — source of truth: index

*Last updated 20 September 2026 (second founder session — DL-026…030, pack v3). This folder is the only authoritative record of what ARCHIO is deciding and why. Everything else under `docs/` (masterplans, blueprints, decks, audits) is archaeology: it says what was once intended, never what is true now. Newest date wins. Only Luke or Kan change a ledger status; every AI proposes.*

## Files, in number order

| File | What it is | Status | Superseded by / read with |
|---|---|---|---|
| `00-founder-synthesis-2026-09-17.md` | Full reconciliation of every input (email, prompt, ChatGPT, QClay, deck, repo, live research). KNOWN / BELIEVED / WRONG lists, competitor table, thesis comparison, object schemas, existing-work classification. | CURRENT with erratum | **Partially superseded by `02`:** §5 Thesis F "Mentor's Ledger", the §2 "B2C solo trader is probably wrong" row, the Kan-cohort steps in §10, and the single kill criterion (§10 item 9). §1–4, §6, §7 (existing-work classification), §8 (answers) stand — but read the "Initial user / Entry wedge / Kan's students" lines in §8 and §10 through the erratum. "Truth Keeper" in §10 item 8 is now **Product Brain** (DL-014). **`11` (DL-017, DECIDED) supersedes the company definition in §0 ("the system of record for trading intentions") and in §8 ("What company are we building?" · "it is the only core") — exact wording in `11` Appendix A.** |
| `01-decision-ledger.md` | The decision ledger. DL-001 … DL-031 plus the rejected-ideas table. Since 20 Sep (second session) lines inside an entry may be tagged DECIDED · OPEN · FOUNDER DIRECTION · DEMO/SIMULATION · FUTURE/VISION. | CURRENT, living | **DL-007 (name = ARCHIO)**, **DL-017 (founder direction — company scope)**, **DL-018 (`11` governs the current phase; bots re-tasked to structural inputs)**, **DL-019 (Q-21 housekeeping; Structural Map v1 filed as `15`)**, **DL-020 (Community tenancy = Model B: organization → rooms → memberships)**, **DL-021 (Intent Loop this phase = design shape only)**, **DL-022 (Education = combination)**, **DL-023 (privacy = social-style configurable; D1 = public-vs-authenticated boundary only; + visibility-layers addendum)**, **DL-024 (zero-data first open = guided empty state; + optional-tutorial addendum)**, **DL-025 (Flight Deck keeps four zones as a navigation abstraction; `/cockpit` rename deferred; + addendum: names and 16-destination placement OPEN for Product Brain review)**, **DL-026 (signed-out = product-first exploration, TradingView-like; limits OPEN)** and **DL-027 (login + registration → the Dashboard / Flight Deck workspace; routes unchanged)** are DECIDED. **DL-028 (Ask Archio as conversational guide)** and **DL-030 (workspace = customisable trader workspace; its name OPEN)** are FOUNDER DIRECTION. **DL-029** classifies the face scan DEMO/SIMULATION, records the auth direction, and leaves KYC / account integrity OPEN. DL-002 and DL-008 are SUPERSEDED inside the file (kept on purpose). DL-010 is OPEN. Everything else PROPOSED. |
| `02-revision-2026-09-17-kan-correction.md` | The correction after the founder fact "Kan has no students and does not trade." Three layers separated (thesis / wedge / test environment), candidate populations, per-hypothesis kill criteria H1–H5, Layer 0–7 earned-complexity ladder, tonight's list. | CURRENT | Its §6 ladder is restated in amended form by `10` §4 (same object, CAPTURE and REVIEW nodes added, fork after TRADER MODEL). **Read §2 "Long-term company thesis" and §3 "the company's single load-bearing hypothesis" through `11`: they describe the loop engine, not the whole company. §3 "Nothing above it should be built until…" is flagged OPEN in `11` Appendix A.** |
| `03-intent-capture-position.md` | Position on the "Intent Engine" exchange: what was adopted (provenance, system-assembles-user-confirms, coverage), where it overreaches, ten capture mechanisms ranked, schema consequences, three prototypes. | CURRENT | §0 and §6 call the first bot "Product / Truth" / "Truth Keeper" — renamed **Product Brain** in `07`/`09` (DL-014). The bots' first tasks are now the ones in `09` §4; `03` §6 is the earlier sketch. |
| `04-kan-5-minute-version.md` | Luke → Kan, the short catch-up message. | CURRENT, founder-only | Per `09` §3, **no bot receives this file.** |
| `05-founder-memo.md` | Luke → Kan, the long why. VISION · HYPOTHESIS · EXPERIMENT · DECISION · UNKNOWN labels. | CURRENT | Given to Product Brain and Red Team (`09` §3). |
| `06-tonight-working-session.md` | The two-page practical agenda for the founders' session, with the decision table. | CURRENT | Its §D (bot setup) is **superseded by `09`**. |
| `07-grok-grounding-2026-09-17.md` | v0's grounding verification against the real repo: 14 questions answered, two corrections to the record (337,512 lines not 48k; `copilot_events` exists, Live Room ledger is client-only). | CURRENT | Feeds `08`. |
| `08-architect-repo-facts.md` | The only authorised short-form description of what exists in code. | CURRENT (two corrections 20 Sep 2026: `copilot_events` = dormant / dead pattern, never an active pipeline; the 16 Aug audit superseded by `13` for the Architect) | Every bot receives it. Any code claim not in here or in a dated v0 verification note is UNVERIFIED. The Architect additionally receives a dated extract of `13` in its pack. |
| `09-bot-context-packs.md` | Governance rules (12), glossary, per-bot context packs, system prompts for Product Brain / Red Team / Architect, the flow. | CURRENT (amended 19 Sep, DL-017 + DL-018; **re-set 20 Sep second session for D1 — pack v3**) | Operative bot setup. Paste §1 first to every bot. §2 carries the company-scope, current-phase and D1 terminology lines (zones · Dashboard / Flight Deck / Command Center OPEN · Your Space / Trading Terminal not authoritative). **§3 packs are now role-specific D1 extracts, not full copies of `12` / `13` / `14`.** **§4: the 19 Sep structural task is COMPLETED (`15`); the D1 next tasks are written but NOT sent until a founder sends them; the 17 Sep loop tasks stay parked.** Two outdated prompt lines corrected (nine-system canon → `15`; `copilot_events` → dormant pattern). |
| `10-kan-chain-evidence-ladder.md` | Kan's chain adopted as the long-range evidence ladder; arrow-by-arrow challenge; the amended canonical chain; per-bot boundaries. | CURRENT | Recorded as DL-016 (PROPOSED). Founder alignment on the chain is context, never evidence. **Per `11` §7 the chain is an intelligence engine inside ARCHIO, not the company. "The company's single load-bearing hypothesis" (§2 Gap A) reads as the loop's. §5 bot boundaries govern loop-engine work only (DL-018 note added in the file).** |
| `11-founder-direction-2026-09-19.md` | **The founders' approved statement of ARCHIO's overall company scope** — eight points and a founder principle, written by Luke + Kan. Appendix A lists the older wording it supersedes; Appendix B lists what it does not do. | **CURRENT, newest — DECIDED (DL-017); governs the current work phase (DL-018)** | Read as the company scope *and* the sequencing of the next phase (§8: STRUCTURE → FLOWS → DATA/BACKEND → DETAILED PAGE DESIGN). The intent → trade → compare → review → memory loop in `02`/`03`/`10` is an important potential intelligence engine **inside** ARCHIO, not the definition of the company. Supersedes the company-definition wording in `00` §0/§8 and `02` §2 (not rewritten — flagged). Contains no strategy, features or architecture; the ARCHIO System Bible it asks for (§8) is not yet written. |
| `15-structural-map-v1.md` | **The founder-approved Structural Map v1**, filed 20 Sep 2026 (DL-019): seven Level-1 user-facing systems (Flight Deck · Intent Loop / Decision experience · Market Experience · Education · Community & Opportunity · Ask Archio · Account / Money) and three Level-4 / VISION interfaces, verbatim; the 20 Sep founder decisions that bind it (DL-020 tenancy Model B · DL-021 Intent Loop design shape only · DL-022 Education combination); the superseded / conflicting maps marked. | **CURRENT — DECIDED (DL-019). The single current structural map.** | Supersedes the QClay "Locked product map" *as a structural map* (kept as legacy page inventory) and marks the `09` §2 nine-system list as a legacy naming layer (kept for alias resolution). Levels 2–3 are not yet written. `12`, `13`, `14` follow it. |

## Operational control documents (not governance)

These three files are **working instruments**, not decisions. They inventory what exists (surfaces, tables, routes, flags) and cross-reference it so v0, ChatGPT, the Grok bots, the founders and later QClay name the same thing the same way. They record founder decisions by pointing at `01`; they never make them. Only v0 writes them (from code); founders review. They are rebuilt into paste-ready bundles by `node scripts/bundle-source-of-truth.mjs` (`public/docs/source-of-truth/`).

| File | What it is | Status | Read with |
|---|---|---|---|
| `12-product-design-control-center.md` | Every user-facing surface as a control record (120 records across SH / FD / IL / MX / ED / CO / AA / AM / TP / SM / AG / MK), one status vocabulary, design register, user-flow coverage, definition of done, 15 audit flags. | OPERATIONAL, living | `15` (system ownership) · `14` §3 (names) · `13` (what the backend really does) |
| `13-technical-backend-control-center.md` | The backend from code: runtime, 14 tables, 37 routes with callers and auth posture, five Architect answers, F1–F15 shared foundations with REUSE / REFRAME / REBUILD verdicts, AI inventory, S1–S10 security register, re-runnable verification method. | OPERATIONAL, living | `08` (the bots' authorised repo facts — `13` is its long form) · `15` |
| `14-archio-master-cross-reference.md` | The connective tissue: AI-to-AI briefing, master ID index, 12 system records × 24 fields, naming (N-1…N-21) and duplication (D-1…D-19) control, trace chains, change log, 8-week runway (D1–D8 / T1–T8), Lego protocol, founder inbox (Q-1…Q-28), blockers (B-1…B-12). | OPERATIONAL, living | everything; answered inbox rows are struck through with their DL number |

## Reading order for a new AI

1. `09` §1 (governance) and §2 (glossary)
2. **`11` — the founders' approved company scope (DECIDED, DL-017).** Every file after this describes the loop engine *inside* that scope, or the state of the code.
3. **`15` — the Structural Map v1 (DECIDED, DL-019).** The seven systems everything else is filed under, and the 20 Sep decisions that bind them.
4. `01` (what is decided, what is proposed, what is rejected)
5. `02` (the correction — read before `00`; read its "company thesis" wording through `11`)
6. `03` (capture position)
7. `10` (the ladder — an engine inside ARCHIO, per `11` §7)
8. `08` (what exists in code)
9. `00` only as background, through its erratum header and `11` Appendix A
10. `14` §0, then `12` and `13` when the work touches a specific surface or table (operational, not governance)

## Bot context packs

Defined in `09` §3 (pack v3, 20 Sep 2026 — D1). All three bots receive `09` §1–2 (governance + glossary), `01`, `11`, `15`, `08`, this README and the current-state sheet `00-CURRENT-STATE-2026-09-20.md`. Each bot then receives **one role-specific D1 extract** (Product Brain: product / navigation context; Red Team: navigation-challenge context; Architect: technical context = dated extract of `13`). The loop-era files (`02`, `03`, `10`, `05`, `06`, `00` excerpts) are parked in the pack's `04-PARKED-LOOP-REFERENCE/` and are **not** uploaded for D1 — re-upload when a founder assigns a loop task. Next tasks are written in `09` §4 but are **not sent until a founder sends them**. Nobody receives `04`, the QClay Telegram log, any `.env` or key, `docs/postman/*`, v0 memory files, or the legacy `docs/`.

## Standing facts every reader must hold

- Product name is **ARCHIO**. "Trading Pilot" is retired.
- **ARCHIO's scope is the connected environment around the trader's entire journey (`11` §1, DECIDED 19 Sep 2026).** The intent → trade → compare → review → memory loop is an important potential intelligence engine *inside* it — not the definition of the company (`11` §7). Do not describe ARCHIO as "the system of record for trading intentions"; that wording is superseded.
- **The current work phase is STRUCTURE → FLOWS → DATA/BACKEND → DETAILED PAGE DESIGN (`11` §8, made operative by DL-018).** The working objective is to begin constructing the ARCHIO System Bible. The bots produce inputs to it (Product Brain maps · Red Team challenges · Architect grounds); no bot writes it, no bot invents features. It is not yet written.
- **The current structural map is `15-structural-map-v1.md` (DL-019, 20 Sep 2026):** seven Level-1 systems, three Level-4 / VISION interfaces. The QClay locked map and the `09` §2 nine-system list are legacy; use their names only as aliases.
- **Community tenancy is Model B (DL-020):** organization / community → rooms / channels → memberships / access — one model. The `groups`-only model is superseded for design and architecture; the tables stay until a migration is separately approved. Do not copy Discord literally; do not invent rooms from the example.
- **The Intent Loop this phase is DESIGN SHAPE ONLY (DL-021):** define fit, UX / shape / flows and data-model learning; no persistence / backend implementation; the `09` §4 loop tasks stay parked.
- **Education is a COMBINATION (DL-022):** a dedicated learning system (structured learning · mentor-created content · student access / progression) plus contextual surfacing across Community, Ask Archio, Flight Deck and onboarding. Creator knowledge feeding agents or marketplace products is VISION.
- **Privacy is a social-style configurable model (DL-023):** personalised product behind login; public / marketing / auth / help may be signed-out; profile = public layer + user-controlled social layer + always-private account / intelligence layer (a connection never exposes email, phone, auth, private Trading DNA, AI memory, brokerage, journal). D1 fixes the boundary only; the permission matrix is a later block.
- **Zero-data first open = GUIDED EMPTY STATE (DL-024):** the real Flight Deck, never demo numbers presented as the user's, no mandatory onboarding, optional gradual configuration.
- **The Flight Deck's four categories are ZONES, a navigation abstraction (DL-025):** MARKET FLOOR · STUDIO · MENTOR HALL · COLLECTIVE kept provisionally; they do not represent the seven systems and are not Community "rooms"; `/cockpit` will be renamed later (name open). **Addendum 20 Sep (second session): the zone names and the placement of the 16 destinations are OPEN for Product Brain review — nothing renamed or moved before that.** **22 Sep — DL-031 PROVISIONAL D1 DESIGN DIRECTION (Luke approves; Kan's asynchronous review pending; NOT joint approval; names reversible):** the surviving direction is MARKET FLOOR (Intelligence · Daily Brief · Live Calls) · TRADING DESK (ONE Forecasts · Copilot · Post-Mortem) · THE ACADEMY (Education + honest Compare / Mentor AI shells) · THE COLLECTIVE (Communities · The Floor · Collab Hub); Ask Archio, Nexus (absorption candidate, code kept), account chrome and Flight Deck customisation are global chrome; Marketplace = FUTURE under THE COLLECTIVE, not a door; Centralized / Decentralized = FUTURE/VISION, UX OPEN, no literal toggle. **Code still unchanged.** D1 Block 2 (first-use design-definition) is open: `docs/lego/D1-block-2-first-use.md`.
- **Signed-out = product-first exploration (DL-026, DECIDED as philosophy):** ARCHIO behaves like a product (TradingView reference), not a marketing site — a visitor explores the real environment, especially the chart / trading workspace, and is asked to log in / register only when reaching for identity, persistence, personalisation, private data, community participation, personal AI context, account information, saved settings or deeper use. Never a login wall on arrival; never another user's private data. **Exact limits OPEN** (Q-23).
- **One destination after login and registration = the Dashboard / Flight Deck workspace (DL-027).** Today's `/` and `/copilot` are not final; routes unchanged until a founder orders the change.
- **Optional short tutorial after first sign-in = FOUNDER DIRECTION; full tutorial design = OPEN / later block (DL-024 addendum). Ask Archio as the conversational guide = FOUNDER DIRECTION (DL-028), not a spec.**
- **Authentication (DL-029):** the face scan is **DEMO/SIMULATION** (timers, fabricated local user, no biometric check). Real secure authentication (device biometrics / passkeys · email · codes · phone) = FOUNDER DIRECTION. KYC / account integrity = OPEN. **Never merge** authentication · biometrics / passkeys · email / phone confirmation · KYC · duplicate-account prevention.
- **The workspace's visible name is OPEN (DL-030):** Dashboard · Flight Deck · Command Center are the founders' live terms; **"Your Space" and "Trading Terminal" are not authoritative.** "Flight Deck" in these documents is the `15` handle, not a UI decision. The workspace is intended to become a highly customisable trader workspace (direction).
- **`copilot_events` is a dormant / dead pattern, not an active persistence pipeline** (`08`, `13` §3.2): one writer, its only call site commented out, no route writes it, nothing reads it.
- The intent / Decision Record loop is one important subsystem inside ARCHIO, kept in every pack (`02`, `03`, `10`); its 17 Sep bot tasks are parked in `09` §4, not deleted.
- Kan has no students and does not trade actively. Whether Luke trades is unstated (DL-010).
- The repo has **no** trades / decisions / plans table and **no** broker connection (`08`).
- On the loop's ladder we stand at node 0 (CAPTURE) with no evidence for node 1.
- Kill criteria are per hypothesis (`02` §5), never one for the whole thesis. H1–H5 are the loop engine's hypotheses.


---

<!-- FILE: 00-founder-synthesis-2026-09-17.md -->

# ARCHIO — Founder Synthesis

**Date:** 17 Sep 2026
> **ERRATUM (same night, see `02-revision-2026-09-17-kan-correction.md`):** §5 "Thesis F — Mentor's Ledger", the "B2C solo trader is probably wrong" claim, the Kan-cohort steps in §10, and the single kill criterion were built on a false premise (Kan has no students and does not trade). Those parts are SUPERSEDED. §1–4 (KNOWN / WRONG / market research), §6 object schemas, §7 repo audit and §8 existing-work classification stand.

**Inputs reconciled:** existing v0 codebase (this repo), Luke→Kan email (43 sections), master prompt (54 sections), ChatGPT context dump, QClay Visual Narrative v1.1 + Dashboard Design & Release Plan v1.1, QClay Telegram log (Jul 16 – Sep 4), backend decision packet / partner brief / learning workshop, Owen/TradeLocker deck, live external research (17 Sep 2026).
**Status of this document:** PROPOSED. Nothing here is decided until a founder moves it to the ledger (`01-decision-ledger.md`).
**Labels used:** KNOWN (evidence) · BELIEVED (plausible, undemonstrated) · IDEA · DECIDED · BUILT · LEGACY · OPEN · CONTRADICTION · ASSUMPTION · EXPERIMENT.

---

## 0. The one-paragraph answer

You are not building a trading tool, an OS, or an agent platform yet. You are building **the system of record for trading intentions** — the place where a trader writes down what they are about to do and why *before* the outcome exists, and where the outcome is later matched back to that intention. Everything else in the 43-section email (Trader Model, agents, creator intelligence, marketplace, cockpit) is downstream of whether traders will create that record. **That is the single hypothesis the company rests on, and today there is zero evidence for it in your own product** — the repo has no table for a trade, a plan, or a decision. The smallest honest move is to get that record created by real traders for 30 days, with a mentor-led cohort as the commitment device, before spending anything on design agencies, eleven Grok brains, or broker execution.

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

## 5. Thesis F in full — the alternative neither ChatGPT nor the email articulated

**The Mentor's Ledger.** Sell to the mentor who already runs a paid community, not to the solo trader.

Why it is materially different: every existing document treats the creator as a *later* marketplace layer sitting on top of a B2C Trader OS. F inverts it: the mentor is the **first customer, the distribution channel, and the commitment device**, and the Trader Model is a **cohort model first** (how do Kan's students deviate from Kan's rules?) before it is an individual model.

How it works:
1. A mentor (Kan first) writes their strategy as a **checkable spec**: setups, valid conditions, invalidation, sizing rule, no-trade windows. This is the email's §37 creator experiment, done for real, with real students.
2. Students record a Decision Record before each trade — from the Live Room call, from a hotkey, from a 20-second form. The mentor's spec pre-fills the checklist. **The mentor asking is the commitment device**; the research says social reinforcement is what makes interventions stick.
3. Outcomes arrive by CSV / screenshot-OCR / TradeLocker read-only sync and are matched to records.
4. The student sees adherence and deviation types; the mentor sees the cohort; both see the one thing screenshots cannot fake: **intention → adherence → outcome, timestamped**.
5. The mentor pays per seat. Students get it through the mentor.

What it makes possible later, without re-architecture: individual Trader OS (a student who leaves keeps their ledger), creator intelligence (the spec is already software), verification (adherence + broker-synced outcomes replace screenshots), marketplace (mentors with verified cohorts).

Risks, stated plainly: mentors may not want cohort adherence visible (it exposes teaching quality); mentors churn and take students; each mentor is a small TAM; a mentor whose spec we encode could look like an unregistered adviser in some jurisdictions — the product must always frame it as *the student checking the student's own chosen rules*, never as a recommendation; students may game adherence by only planning easy trades (measure plan-rate *and* trade coverage).

Evidence for it in your own material: Act I of the Owen deck is *entirely* about this pain (Whop/Skool noise, $3,600, screenshots-as-proof, four accounts). The repo's real backend is org-shaped. Kan is a mentor with a strategy and students. QClay's Founding Beta already assumed invited cohorts.

---

## 6. The objects, v0 (buildable in days, deterministic, honest)

### 6.1 Decision Record v0
```
decision_records
  id                uuid
  user_id           uuid            -- the trader
  org_id            uuid null       -- cohort / mentor tenant (F); null for solo
  locked_at         timestamptz     -- immutable once set; THE field that makes it a decision, not a journal
  instrument        text
  direction         enum(long, short, flat)
  setup_id          uuid null       -- from the user's (or mentor's) playbook
  thesis            text            -- <= 280 chars; why now
  invalidation      text            -- price or condition that proves the thesis wrong
  entry_plan        numeric null
  stop              numeric null
  target            numeric null
  risk_pct          numeric null    -- of account, as planned
  rules_checked     jsonb           -- [{rule_id, passed: bool}] against the active spec
  state_self_report smallint null   -- 1–5 or null (never mandatory)
  source            enum(form, hotkey, live_room, import)
  session_event_id  uuid null       -- link to the mentor's Live Room call, if any
  market_snapshot   jsonb           -- price, ATR, session, from Polygon at lock time (stamp, not a model)
  status            enum(planned, taken, skipped, invalidated, expired)
  visibility        enum(private, cohort, public)   -- public = a forecast
  outcome_trade_id  uuid null       -- set by the matcher
```
```
trades   (imported or synced; never hand-typed P&L)
  id, user_id, instrument, direction, opened_at, closed_at, entry_avg, exit_avg,
  size, pnl, fees, source enum(csv, tradelocker_ro, manual), raw jsonb
```
```
decision_reviews (one LLM call per matched record; deterministic inputs)
  id, decision_record_id, trade_id, deviations jsonb   -- computed: early_entry, late_entry, stop_moved,
                                                         --  size_breach, early_exit, held_past_invalidation, no_plan
  summary text (<= 3 sentences), question text (exactly one), model, created_at
```

### 6.2 Trader Model v0 = six SQL aggregates, no ML
1. **Plan rate** — % of trades with a record locked before `opened_at`.
2. **Adherence rate** — % of planned trades with zero deviations.
3. **Deviation mix** — which deviation types dominate (this is the "weakness" the email talks about).
4. **Setup expectancy** — R-multiple by `setup_id`, planned vs unplanned.
5. **Time pattern** — plan rate and adherence by session / hour.
6. **Impulse flag** — trades opened < N minutes after a loss with no record.

If these six numbers move for real traders over 30 days, the Trader Model is real. If nobody creates records, no ML would have saved it.

### 6.3 Market Model v0 = none. A `market_snapshot` stamp from data you already have.

### 6.4 AI v0 = one step
- **Plan capture is a form, not an agent.** Faster, deterministic, no hallucination, no advice.
- **Review is the only LLM call.** Inputs: the record, the matched trade, the computed deviations. Output: three sentences that cite the exact rule and number, plus one question. The model phrases; the SQL judges. A review that is wrong once about "you broke your rule" ends trust — so the judgment must never come from the model.
- Agents never place, modify or cancel orders in v1 or v2. Permissions v0: `read:records`, `read:trades`, `write:review`. Nothing else exists.

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

## 9. Things you did not ask that matter

1. **Second-order:** once adherence is visible, students game it (plan only easy trades). Measure *coverage* (records ÷ trades), not just adherence.
2. **Missing stakeholder:** prop firms. Their business is rule breaches. They are a channel *and* a potential builder (PropSentinel et al. already sell to their traders).
3. **Missing infrastructure:** the matcher. Partial fills, scale-ins, multiple stops. Design it before the UI or the data will be unusable.
4. **Missing trust mechanic:** the review must cite rule + number. A single false accusation ends the relationship.
5. **UX ceiling:** capture > 20 seconds = death. Hotkey from the chart (TradingView MCP now makes "prefill from the active chart" plausible) and voice are the two experiments.
6. **Technological shift:** TradingView MCP (yesterday) means agents will sit *beside* the chart by default within a year. Do not build the chart; build what the agent should know about the trader.
7. **Founder psychology:** 337k lines of code with zero trade tables, a 43-section email, a 54-section prompt, an eleven-brain org chart — the pattern is systematizing before evidence. The Grok organization risks becoming the next meta-product. Three roles and a ledger, then product data.
8. ~~**Name:** decide Trading Pilot vs ARCHIO this week.~~ **DONE — ARCHIO** (DL-007).
9. **QClay debt:** answer their three technical questions or close the engagement cleanly. Silence since 31 Aug costs goodwill you may want later.
10. **Traders contradict themselves:** they say they want discipline and buy indicators. The mentor's ask is the only lever the research supports for closing that gap.

---

## 10. What to do

**Tonight (2–3 hours, no code)**
1. Read this and mark each verdict ACCEPT / REJECT / OPEN in `01-decision-ledger.md`.
2. Decide: name; cohort 1 (Kan's students — how many, which strategy); TradeLocker = read-only ask.
3. Kan writes his strategy as a checkable spec: setups, valid conditions, invalidation, sizing, no-trade windows. One page.

**This week**
4. Ship `decision_records`, `trades`, `decision_reviews` (SQL above) and a single page: **Plan** (the 20-second form, prefilled from Kan's spec) / **Today** (open records) / **Review** (matched trades, six aggregates, one LLM review).
5. CSV import for trades. No broker.
6. Ten students, Kan asking daily in the room. Instrument plan rate from day one.
7. Reply to QClay: pause the full-product scope; offer the bounded loop or a clean stop.
8. Grok org v0: three bots (Truth Keeper reads only this folder; Red Team attacks every ledger entry; Architect turns accepted entries into schema/API). Constitution = §31 of the email verbatim. Bots propose; founders approve; every rejection is logged with why.

**30 days**
9. Kill criteria, decided now: plan rate < 30% of trades by week 2 *with a mentor pushing* → the solo Trader OS is dead and you know it for ~$0; pivot fully to the mentor-facing product or stop. Plan rate > 60% and week-4 retention > 50% → fund cohort 2.
10. Kan experiment: agent evaluates 50 historical setups against the spec; log every disagreement; measure whether the spec or Kan was wrong.

**60 days**
11. TradeLocker read-only sync (fills → matcher) if Owen agrees; screenshot OCR as fallback.
12. Two more mentors. Per-seat price test. Hotkey / Live Room capture.
13. Add the Trading Intelligence brain to the Grok org now that records exist.

**90 days**
14. Decide with data: Mentor's Ledger (B2B2C) vs Trader OS (B2C) as the *lead* — the objects are the same either way.
15. Only then: cockpit shell, second LLM step (plan drafting from chart), and the conversation about a marketplace.

---

## 11. What could make this company special / what could kill it

**Special:** owning the one dataset nobody else can import — timestamped intention — and being the place a mentor's word becomes something a student can be measured against. The verification layer that ends screenshots.

**Kill:** traders do not lock records; TradeZella adds pre-trade plans and a cohort view; TradingView agents make "knows your trades" free; founders build the eleven-brain org and the nine-system cockpit before anyone has planned a trade in the product; QClay's $300k is spent designing rooms nobody enters.

The advantage was never going to be guessing right once. It is the loop in §10, run honestly, with kill criteria written down before the data arrives.


---

<!-- FILE: 01-decision-ledger.md -->

# Founder Decision Ledger

Format per the master prompt §34. Bots may PROPOSE entries; only Luke or Kan may set STATUS to DECIDED. Every REJECTED entry keeps its WHY so no bot re-proposes it three weeks later.

Status values: PROPOSED · DECIDED · REJECTED · SUPERSEDED · OPEN

*Labels added 20 Sep 2026 (second founder session) so an entry can carry several kinds of statement without blurring them — every line inside an entry is tagged with one:* **DECIDED** (a scoped founder decision) · **OPEN** (a question the founders have not answered) · **FOUNDER DIRECTION** (recorded intent that binds the *direction* of design work but is not yet a specification or a scoped decision) · **DEMO/SIMULATION** (a classification of existing code — a fact, not a decision) · **FUTURE/VISION** (a founder-named possibility with no current commitment) · **PROVISIONAL D1 DESIGN DIRECTION** (added 22 Sep 2026 — a direction **one** founder has approved for design work while the other founder's asynchronous review is pending; stable enough to design against, exact names reversible; **never** to be quoted as joint final approval).

---

## DL-001 — The core object is the Decision Record, locked before outcome

- **Date:** 2026-09-17
- **Problem being solved:** every source (email, ChatGPT, QClay, repo) implicitly has a different core object (record / page / card / trade). Without one, nine systems get built around nothing.
- **Evidence:** repo has no trade/decision/plan table; competitors all store the *trade*; no researched competitor stores thesis + invalidation before the outcome; pre-commitment research supports the mechanism.
- **Assumptions (amended 02):** active traders will record setup + thesis + invalidation + risk *voluntarily* when asked personally, at ≤ 20s friction. The earlier "if asked by someone they respect" leaned on a mentor who does not exist.
- **Alternatives considered:** the trade as core (TradeZella model); the agent as core (ChatGPT §14); the page as core (QClay v1.1).
- **Why rejected:** trade-as-core is a commodity at $59/mo; agent-as-core has no data to act on; page-as-core is presentation without a system.
- **Confidence:** Medium (mechanism KNOWN, voluntary adoption BELIEVED — the company's single load-bearing hypothesis).
- **What would change our mind:** H1 in 02 §5 fails across two capture mechanisms **and** broker-derived intent (bracket orders, 02 §3.1) cannot reconstruct the plan either.
- **Owner:** Luke + Kan
- **Status:** PROPOSED (amended by 02)

## DL-002 — Entry wedge is the Mentor's Ledger (cohort), not the solo Trader OS

- **Date:** 2026-09-17
- **Problem:** we have no distribution; solo traders abandon journals; interventions decay without social reinforcement.
- **Evidence:** Owen deck Act I pain (Whop/Skool, $3,600, screenshots); repo backend is org/membership/mentor-shaped; research on tailored + reinforced interventions; ten single-feature gate apps, none large.
- **Assumptions:** mentors will accept cohort adherence being visible to them; Kan's students will participate.
- **Alternatives:** B2C solo Trader OS (Thesis B/E); agent platform (C); marketplace-first (D); polish existing (A).
- **Why rejected (for now):** B/E have no distribution and the hardest adoption problem; C competes with TradingView/TradeLocker on their own turf; D needs verification that does not exist; A is irrelevance.
- **Confidence:** was Medium.
- **Status:** **SUPERSEDED by 02** — built on a false premise. Kan has no students and does not trade; the repo's org/mentor shape is product archaeology, not market evidence. The wedge is now "voluntary intention capture → review" (02 §2); the test environment is OPEN (02 §4); mentor-led cohorts remain a *possible market* (H5, parked) but not our available test.
- **Why this entry is kept:** so no bot re-proposes "sell to mentors first" without first producing a named mentor with named students.

## DL-003 — AI in v1 is exactly one call: the Review. Plan capture is a form.

- **Date:** 2026-09-17
- **Problem:** AI cost, hallucination and advice-risk; trust destroyed by one wrong "you broke your rule".
- **Evidence:** TradeZella's agents are post-hoc commodity; behaviour research: the record + feedback loop is the mechanism, not the model.
- **Assumptions:** deterministic deviation detection is sufficient for v1 insight.
- **Alternatives:** Trade Plan Agent + Review Agent (email §36); multi-agent workflows (ChatGPT §18).
- **Why rejected:** an LLM plan agent adds latency and advice exposure for no adoption gain; workflows need records that do not exist.
- **Confidence:** High.
- **What would change our mind:** capture > 20s with a form and < 20s with an agent, measured.
- **Owner:** Luke
- **Status:** PROPOSED

## DL-004 — TradeLocker is a read-only data partner in v2; no execution before v3 evidence

- **Date:** 2026-09-17
- **Problem:** execution is regulated, TradeLocker builds its own AI, and Owen has not committed.
- **Evidence:** TradeLocker Studio AI assistant (2026); Owen deck "we don't touch the trade"; gate apps that route orders are all tiny.
- **Assumptions:** read-only fills are obtainable via Brand API / BrandSocket or per-user export.
- **Alternatives:** execution in v1 (email §35 step 5); no broker ever (CSV only).
- **Why rejected:** execution-first invites regulatory exposure and platform dependence before the loop is proven; CSV-only breaks at scale.
- **Confidence:** High.
- **What would change our mind:** Owen offers a partnership that includes execution with TradeLocker carrying the regulatory surface.
- **Owner:** Luke (Owen relationship)
- **Status:** PROPOSED

## DL-005 — Grok organization starts at three brains, not eleven

- **Date:** 2026-09-17
- **Problem:** eleven specialized bots with no product data produce eleven confident hallucinations and a meta-product instead of a product.
- **Evidence:** repo has no trade data for a Trading Intelligence brain to reason over; the pattern of systematizing before evidence is visible in the 337k-line codebase (corrected from "48k" on 17 Sep — that was two dashboard files).
- **Assumptions:** three roles (Truth Keeper, Red Team, Architect) cover the decisions of the next 30 days.
- **Alternatives:** full eleven-brain pyramid (email §28).
- **Why rejected:** premature; add Trading Intelligence when `decision_records` has rows; add Community/Creator when cohort 2 exists.
- **Confidence:** High.
- **What would change our mind:** a decision blocked for lack of a specialist perspective twice in one week.
- **Owner:** Luke
- **Status:** PROPOSED

## DL-006 — QClay full-product scope is paused; offer the bounded loop or a clean stop

- **Date:** 2026-09-17
- **Problem:** $35k design + $300–350k, 12 months, 12–15 people to build a product whose core hypothesis has zero evidence; AI excluded from scope.
- **Evidence:** QClay v1.1 mandates "design the complete product now"; their three technical questions unanswered; no reply since 31 Aug.
- **Assumptions:** the bounded loop can be designed in-house or by QClay in weeks, not months.
- **Alternatives:** proceed as quoted; cancel outright.
- **Why rejected:** proceeding funds rooms nobody has entered; cancelling outright burns a relationship that may be useful for the cockpit later.
- **Confidence:** High.
- **What would change our mind:** cohort 1 retains > 50% at week 4 and design becomes the bottleneck.
- **Owner:** Luke
- **Status:** PROPOSED

## DL-007 — Product name is ARCHIO

- **Date:** 2026-09-17
- **Problem:** QClay assets say ARCHIO; the founder email/prompt and a ChatGPT thread said "Trading Pilot"; the Source of Truth cannot have two names.
- **Evidence:** QClay logo approved 13 Aug under ARCHIO. Luke confirmed 17 Sep: **the name is ARCHIO**; "Trading Pilot" was a label one chat thread drifted into, never a candidate.
- **Decision:** ARCHIO. All source-of-truth documents, brain instructions and QClay assets use ARCHIO. "Trading Pilot" is retired and must not reappear in any bot output.
- **Status:** DECIDED (Luke, 2026-09-17)
- **Owner:** Luke + Kan

## DL-008 — Kill criteria for cohort 1 (written before data arrives)

- **Date:** 2026-09-17
- **Problem:** without pre-registered thresholds, founders rationalize any result.
- **Original (wrong):** plan rate < 30% by week 2 → solo Trader OS thesis dead. This let one capture mechanism falsify the entire thesis.
- **Status:** **SUPERSEDED by 02 §5** — per-hypothesis kill criteria (H1 voluntary capture, H2 review value, H3 unforced return, H4 broker intent sufficiency, H5 community enforcement), each stating what its failure does *not* falsify. Green light to write software = H1 ≥ 50% with one mechanism **and** H2 ≥ 50% **and** H3 ≥ 50%.
- **Principle kept (High):** thresholds are written before data arrives; coverage (records ÷ trades) is always reported next to adherence.
- **Owner:** Luke + Kan

## DL-009 — First test environment is OPEN; recruitment precedes product

- **Date:** 2026-09-17 (revision 02)
- **Problem:** with Kan's cohort gone, we have no population to test H1–H3 on. Building software before five real traders are reachable repeats the repo's pattern.
- **Evidence:** 02 §4 — no candidate population is currently reachable by us; the strongest on paper (prop/funded traders) is also the one TradeLocker can reach.
- **Decision (proposed):** the next seven days are a recruitment task, not a build task. Layer 0 (manual loop over chat + spreadsheet + human-written review) runs before any code. Owner of recruiting named tonight.
- **What would change our mind:** ten named active traders on a list tonight → Layer 0 starts Monday.
- **Owner:** Luke + Kan
- **Status:** PROPOSED

## DL-010 — Nobody on the team is currently the user

- **Date:** 2026-09-17 (revision 02)
- **Problem:** Kan does not trade; whether Luke trades actively is unstated. A decision-capture product built by non-traders will get the moment-before-entry wrong.
- **Options:** (a) Luke trades small, live, daily from Monday and is user #1; (b) an active trader joins as advisor/user #1 this week; (c) both.
- **Status:** OPEN — founders answer tonight.

## DL-011 — Per-field provenance is part of the Decision Record from day one

- **Date:** 2026-09-17 (03)
- **Problem:** a Trader Model that cannot tell what the trader *said* from what the AI *guessed* or the session *defaulted* will confidently assert things nobody intended.
- **Decision (proposed):** every field carries `source ∈ {observed, declared, inferred, defaulted}` + optional `confidence`, `confirmed_at`. Trader Model asserts only from declared + observed; inferred suggests; defaulted counts once at session level. Agents inherit the rule.
- **Confidence:** High on principle; storage shape (JSONB vs child table) is the Architect brain's call.
- **Owner:** Systems brain → Luke approves
- **Status:** PROPOSED

## DL-012 — Capture design target: one tap + optional one line

- **Date:** 2026-09-17 (03)
- **Problem:** "90% auto-assembled from the order" is true by field count, false by value — setup/thesis/invalidation never come from a broker.
- **Decision (proposed):** the v0 capture surface is session plan (defaults) + one-tap setup + optional one line; entry/stop/target/size observed via CSV then API. Promise nothing below one tap.
- **What would change our mind:** Red Team derives invalidation from order data alone; or P1 shows even one tap is refused while P3 (zero-incremental) succeeds.
- **Owner:** Luke + Kan
- **Status:** PROPOSED

## DL-013 — `lock_lead_seconds` is the dataset's published honesty metric

- **Date:** 2026-09-17 (03)
- **Problem:** market orders fill before any prompt; post-hoc "plans" are what every journal already stores; without a timestamp delta the dataset silently degrades into a journal.
- **Decision (proposed):** store `locked_at`, `first_fill_at`, `closed_at`; derive `lock_lead_seconds`; post-close records are flagged and excluded from adherence; coverage (records ÷ broker trades) and the planned-vs-unplanned split are reported next to every insight.
- **Confidence:** High.
- **Owner:** Systems brain
- **Status:** PROPOSED

## DL-014 — Bot governance: Grok recommends, v0 verifies, founders decide

- **Date:** 2026-09-17 (07/09)
- **Problem:** three advisory bots plus ChatGPT plus v0 will each produce "the plan." Without rules, a bot proposal becomes a decision by repetition, and a bot's description of the codebase becomes "fact."
- **Decision (proposed):** the twelve governance rules in `09` §1 bind every bot. Only founders change ledger status. No bot has repo/DB/env/account access or a write path to this folder. Code claims must cite `08` or a dated v0 verification note. Every session ends in ≤ 5 accept/reject bullets. Bot 1 is the **Product Brain** (proposer), not a "truth" role — the git folder is the truth.
- **Confidence:** High on principle.
- **Owner:** Luke + Kan
- **Status:** PROPOSED

## DL-015 — ChatGPT's role is drafting assistant, outside the ledger

- **Date:** 2026-09-17 (07)
- **Problem:** ChatGPT has produced more strategy this week than the three bots will this month, none of it logged; it is the de-facto fourth brain and the biggest drift source.
- **Decision (proposed):** ChatGPT is Luke's drafting and thinking assistant. Nothing it produces enters the ledger, the bots' context or the repo unless a founder commits it here. v0 verification notes never route through ChatGPT.
- **Owner:** Luke
- **Status:** PROPOSED

## DL-016 — Kan's chain adopted as the evidence ladder; founder alignment ≠ market validation

- **Date:** 2026-09-17 (10)
- **Evidence:** after reading `04`, Kan independently sent DECISION → ACTUAL TRADE → COMPARE → MEMORY → TRADER MODEL → PERSONALIZED AI → AGENTS → WORKFLOWS → CREATOR INTELLIGENCE → POTENTIAL MARKETPLACE. Same object as the Layer 0–7 ladder in `02` §6.
- **Decision (proposed):** the chain is the shared long-range vocabulary, amended with node 0 CAPTURE and a REVIEW node after COMPARE, and forked after TRADER MODEL (personal branch ∥ collective branch) — see `10` §4. Movement right requires the evidence in `10` §3.
- **Recorded distinction:** founder alignment STRONG · thesis CLEARER · market validation NONE · nodes 6–10 HYPOTHESES. No bot may cite founder agreement as evidence.
- **Confidence:** High that the two founders mean the same thing; zero that a trader wants it.
- **Owner:** Luke + Kan
- **Status:** PROPOSED — becomes DECIDED when both founders mark it in this file.

## DL-017 — Founder Direction 2026-09-19: ARCHIO's scope is the connected environment around the trader's entire journey; the intent loop is an intelligence engine inside it

- **Date:** 2026-09-19
- **Problem being solved:** after `00`–`10`, the record defined the company by its first hypothesis — "the system of record for trading intentions" — and that narrow definition was starting to govern what bots and v0 treated as in scope. The founders' actual intent is wider.
- **Decision:** the eight-point Founder Direction in `11-founder-direction-2026-09-19.md` is the company's scope statement. In brief: (1) the connected environment around the trader's entire journey — not only a journal, pre-trade tool, AI coach, community or dashboard; (2) personalised intelligence as one of the core connecting layers, with the user's permission; (3) General ARCHIO Intelligence + Personal ARCHIO Intelligence, combined; (4) as little manual input as reasonably possible, richer context by the user's choice; (5) a configurable trading buddy / coach / assistant — informational and educational, never a financial adviser, never manipulative; (6) immediate value from the environment itself, personalised value compounding over time; (7) CAPTURE → DECISION → ACTUAL TRADE → COMPARE → REVIEW → MEMORY → TRADER MODEL remains an important intelligence engine but is not the entire company; (8) the immediate founder problem is structural clarity — an ARCHIO System Bible, in the order STRUCTURE → FLOWS → DATA/BACKEND → DETAILED PAGE DESIGN → OUTSIDE POLISH/ENGINEERING — before finishing every page, paying QClay ~$42k to complete design, committing ~$350k to a backend build, or handing the platform to another engineering team.
- **What it changes:** the *definition of the company* in `00` §0, `00` §8 and the "long-term company thesis" wording in `02` §2 is superseded; "the company's single load-bearing hypothesis" (`02` §3, `10` §2, DL-001) now reads as the *loop engine's*. The exact wording is listed in `11` Appendix A. Historical text is flagged, not rewritten.
- **What it does not change:** the status of DL-001 … DL-016. H1–H5 remain the loop's hypotheses. The Decision Record remains the loop's core object. The bots' node boundaries (`09` §2, `10` §5), their first tasks (`09` §4) and `02` §3 "Nothing above it should be built until…" are flagged **OPEN** in `11` Appendix A for the founders — not changed by this entry. The QClay design figure ($35k in DL-006 vs ~$42k in `11` §8) is flagged, not reconciled.
- **Evidence:** founder decision. Per DL-016, founder alignment is scope, not market validation; this entry records what ARCHIO is meant to be, not proof that traders want it.
- **Owner:** Luke + Kan
- **Status:** **DECIDED** (Luke + Kan, 2026-09-19)

## DL-018 — `11` governs the current work phase: STRUCTURE → FLOWS → DATA/BACKEND → DETAILED PAGE DESIGN; bots re-tasked to structural inputs

- **Date:** 2026-09-19 (after DL-017)
- **Problem being solved:** DL-017 left three items OPEN in `11` Appendix A — the bots' first tasks (`09` §4), the node boundaries (`09` §2, `10` §5) and `02` §3 "Nothing above it should be built until…". With `11` in every pack and the 17 Sep loop tasks still live, the bots received conflicting instructions.
- **Decision:** Founder Direction `11` governs company scope **and** the next phase of work. The immediate priority is **STRUCTURE → FLOWS → DATA/BACKEND → DETAILED PAGE DESIGN.** The intent / Decision Record loop remains an important subsystem and intelligence engine inside ARCHIO, but it is no longer the Product Council's only first task and does not define the company. The next working objective is to begin constructing the ARCHIO System Bible / structural blueprint — how the platform's major systems, features, pages, data, AI, integrations and backend requirements connect.
- **Bot first tasks (re-set in `09` §4; 17 Sep tasks parked there, not deleted):** Product Brain — map ARCHIO's major product systems, user journeys, problems solved, immediate value and relationships between features; prevent the System Bible from becoming a random feature inventory. Red Team — challenge the structural map: duplicated systems, disconnected features, assumptions, unnecessary complexity, missing user flows, and places where pages may be designed before the system is understood. Architect — ground the surviving map against the actual repo; identify system boundaries, data objects, integrations, backend requirements, AI vs deterministic responsibilities and NEEDS-V0-VERIFICATION items; **not** implement the full architecture.
- **Constraints (founders):** the System Bible is not created yet — bots produce inputs to it. No new features are invented. No other founder decision changes.
- **Consequence recorded by v0 (follows necessarily from the tasks above; strike if wrong):** the node boundaries in `09` §2 / `10` §5 now govern *loop-engine* work. In the structural phase every bot maps all major systems; a node right of REVIEW may be placed on the map and its connections named, but stays labelled VISION and is not designed in detail.
- **Left OPEN on purpose:** `02` §3 "Nothing above it should be built until capture is observed…" — structural mapping is not building, so this decision neither applies nor withdraws that sentence. The QClay figure ($35k / ~$42k) is still unreconciled.
- **Evidence:** founder decision. Per DL-016, this is scope and sequencing, not market validation.
- **Owner:** Luke + Kan
- **Status:** **DECIDED** (Luke + Kan, 2026-09-19)

## DL-019 — Q-21 housekeeping approved: `08` `copilot_events` correction · `12`/`13`/`14` indexed as operational control documents · Structural Map v1 filed as `15`

- **Date:** 2026-09-20
- **Problem being solved:** the 20 Sep audit (`12` §12 F-1, F-9; `14` §5 three PROPOSED rows; `14` §9 Q-20/Q-21) found (a) `08` stated `copilot_events` is "written from `app/api/copilot/chat`" while the repo shows no writer; (b) the three operational control documents were not in the Source-of-Truth README; (c) the Structural Map v1 that `12`/`13`/`14` follow existed only inside a founder request, so four maps of the same territory were in circulation (`14` §3.1 N-20).
- **Decision:** apply all three housekeeping edits. (1) `08` REAL-table row corrected: `copilot_events` has **no writer** — the only insert, `lib/copilot/persist.ts`, is called from a flush loop that is commented out in `components/copilot/CopilotProvider.tsx` (lines 6, 49); `app/api/copilot/chat` writes nothing (re-verified from code 20 Sep 2026; `13` §3.2). Original wording kept struck through. (2) The README gains the section "Operational control documents (not governance)" listing `12`, `13`, `14`. (3) The founder-approved Structural Map v1 is filed as **`15-structural-map-v1.md`** — the single current structural map referenced by v0, Grok, ChatGPT, Luke, Kan and later QClay. Historical maps are preserved and marked in `15` §3: the QClay locked product map is SUPERSEDED as a structural map (kept as legacy page inventory), the `09` §2 nine-system list is a LEGACY naming layer (kept for alias resolution), the Room Navigator rooms are a UI layer, not a map.
- **What it changes:** `08` (one row + header), README (index, reading order, packs, standing facts), `09` §2 (legacy marker) and §3 (all bots receive `15`), `12` §3 flag and §12 F-1/F-9, `14` §0, §3.1 N-20, §5, §9 Q-20/Q-21, §10 B-1/B-11.
- **What it does not change:** no product code; no strategy; no bot prompt text (the `09` §4 prompt lines that still cite the nine-system canon are identified in `14` §5, not rewritten). The SECURITY FLAG on `copilot_events` policies stands (`13` §7 S2, S3).
- **Evidence:** repo grep 20 Sep 2026 — `copilot_events` appears in `scripts/copilot-tables.sql` and `lib/copilot/persist.ts` only; both `persist` references in `CopilotProvider.tsx` are commented out; no `app/api/copilot/*` route touches the table.
- **Owner:** Luke + Kan
- **Status:** **DECIDED** (Luke + Kan, 2026-09-20)

## DL-020 — Community tenancy is Model B: organization / community → rooms / channels → memberships / access

- **Date:** 2026-09-20
- **Problem being solved:** two half-built tenancy systems share nothing (`13` §4 F3; `14` §3.2 D-2): `groups → group_members → …` read by `/communities` discovery, and `organizations → rooms → memberships → invites` with a full API and no UI. Join / create / detail design was blocked (`14` §10 B-2) and the Architect's biggest data decision was open (`14` §9 Q-6).
- **Decision:** **Model B.** The underlying structural model of ARCHIO Community is **organization / community → rooms / channels → memberships / access** — one model, not two parallel tenancy systems.
- **Founder rationale (recorded):** ARCHIO Community should feel familiar and intuitive, similar to how Discord trading communities organise their communities and channels. A user enters a main mentor / community / group environment and naturally navigates into rooms / channels based on what they need — for example a community / mentor organisation → general room → trading room → education room → forecasts / analysis room → other specialised rooms as appropriate. **Do not copy Discord literally and do not invent new rooms or features from this example.** The decision is about the structural model only.
- **What it changes:** for all future architecture and design work, Model A / duplicate `groups` tenancy is **SUPERSEDED** (`13` §4 F3 VERDICT; `14` §2.6, §3.2 D-2). `14` FLOW-005 join and CO-STATE-001/002/003 can now be designed against one model. `13` §4 F3 labels corrected to match `14`/Q-6 (Model A = `groups`, Model B = `orgs → rooms`); the decision is recorded by substance, so the earlier label inversion changes nothing.
- **What it does not change:** **repo facts and history are preserved.** No table is dropped, renamed or migrated; the three `groups` DDLs (`14` D-1), the `groups`-backed discovery page and the `006` seed stay as documented until an actual technical migration / refactor is **separately approved**. The `01` rejected idea "letting repo architecture define the market" still applies — the orgs API existing is not a reason to design admin UI (`12` F-8). "Opportunity" (Q-7) and room naming (Q-3) remain open.
- **Evidence:** founder decision (scope, not market validation — DL-016).
- **Owner:** Luke + Kan
- **Status:** **DECIDED** (Luke + Kan, 2026-09-20)

## DL-021 — Intent Loop this phase: DESIGN SHAPE ONLY

- **Date:** 2026-09-20
- **Problem being solved:** DL-006 parked the bounded loop and `09` §4 parked the three loop bot tasks; `11` §7 / DL-017 then made the loop an important intelligence engine inside ARCHIO. `14` §9 Q-10 asked whether to un-park implementation in this phase.
- **Decision:** **design shape only.** The Intent Loop is important and the founders expect to work on it. In the current phase: continue defining how it fits into ARCHIO; continue designing the user experience / shape / flows; continue technical learning about the underlying data model where useful; do **not** implement the full persistence / backend loop; do **not** un-park implementation because the concept is important.
- **Founder principle (recorded):** move toward it in the proper order and minimise working backwards or rebuilding things unnecessarily.
- **What it changes:** `14` §2.3 IL NEXT REQUIRED DECISION closed; `14` §6 D5 confirmed as design only and T5 as read-only technical learning; `13` §4 F5 gains a phase note. The 17 Sep loop tasks in `09` §4 stay parked as written — this entry is the founder assignment `14` §2.3 asked for, and it assigns *shape*, not implementation.
- **What it does not change:** DL-001, DL-003, DL-006, DL-011, DL-012, DL-013 — the engine's design targets remain the design targets. `02` §3 "Nothing above it should be built until capture is observed…" remains OPEN (`11` Appendix A): designing shape is not building. Q-11 (which UI becomes capture) remains open. F4 / F5 remain MISSING.
- **Evidence:** founder decision (sequencing).
- **Owner:** Luke + Kan
- **Status:** **DECIDED** (Luke + Kan, 2026-09-20) — *a current-phase decision; revisit when the FLOWS phase is done.*

## DL-022 — Education is a combination: a dedicated learning system plus contextual surfacing

- **Date:** 2026-09-20
- **Problem being solved:** Education is a Level-1 system on the Structural Map v1 (`15`) with zero backend (`13` §3.1, §4 F14) and no definition (`14` §2.5, §10 B-4, §9 Q-15); every ED screen was blocked on "what is Education in ARCHIO?".
- **Decision (current founder definition, verbatim):** Education is a dedicated ARCHIO learning system with structured learning experiences, mentor-created educational content, and student access / progression, while educational content and intelligence can also surface contextually across Community, Ask Archio, Flight Deck, onboarding, and other relevant ARCHIO experiences.
- **VISION boundary (recorded):** future creator / mentor knowledge potentially feeding AI agents or marketplace products remains **VISION** and is not a current implementation commitment.
- **What it changes:** `14` §2.5 ED FOUNDER DECISION STATUS and NEXT REQUIRED DECISION; `13` §4 F14 VERDICT (direction decided; data shape follows the FLOWS phase — still no CMS choice before flows). Unblocks D7 in `14` §6.
- **What it does not change:** no courses, lessons, content types or progression rules are specified — those are FLOWS-phase outputs (Product Brain maps · Red Team challenges · Architect grounds). No commitment to a content backend or provider.
- **Evidence:** founder decision (direction, not demand).
- **Owner:** Luke + Kan
- **Status:** **DECIDED** (Luke + Kan, 2026-09-20)

## DL-023 — Public vs private: a social-style configurable privacy model; for D1 only the public-vs-authenticated boundary

- **Date:** 2026-09-20
- **Problem being solved:** `14` §9 Q-1 — which pages require login and whether profiles are public by default. Today the whole product including `/dashboard` is reachable signed-out (`12` SH-STATE-002; `13` S7) and `profiles_select_all USING (true)` makes every profile row public (`13` S8). D1 and T1 were gated on this.
- **Decision:** **social-style configurable privacy model.** ARCHIO should feel familiar to users of platforms such as Instagram in the broad privacy / navigation sense, **without copying Instagram literally.**
- **Founder intent (recorded verbatim):**
  - Public / marketing / auth / help surfaces can be available signed-out where appropriate.
  - The actual personalised ARCHIO product requires login.
  - A user's ARCHIO identity / profile can have a shareable / social-facing layer.
  - Users should eventually have control over how open or private that social profile is.
  - Connected / friend / follow relationships may allow access to additional information **only where the user has chosen that information to be shared.**
  - Being connected to another user must **NEVER** automatically expose private account information such as email, phone number, authentication information, private Trading DNA, private AI memory, brokerage / account details, private journal / history, or similar sensitive information.
  - Basic / public profile information and deeper shareable information must be treated **separately** from private account / intelligence information.
  - Private / personal intelligence remains private by default unless a specific future product mechanism allows the user to deliberately share an appropriate output.
- **Scope for D1:** establish **only the public-vs-authenticated boundary** (which routes are signed-out surfaces, which are the personalised product). The detailed social / profile permission matrix (three tiers: public profile · connection-shared · private account / intelligence) is a **future dedicated design + technical block** — do not design it now.
- **What it changes:** `14` §2.1 SH decision status; `12` SH-STATE-002 gains the boundary rule; `13` §7 S7 / S8 and §4 F2 — F2's "write the product privacy model first" now has its first paragraph (this entry). The T1 slice (`/register` → `profiles` → `/api/users/me`) reads S7 / S8 with this boundary in hand.
- **What it does not change:** no middleware, RLS policy or route list is changed by this entry — the route list is a D1 output for founder review; `USING (true)` on `profiles` stays flagged (S8) until profile fields are separated into public vs private. No social features are approved.
- **Evidence:** founder decision (product privacy model — `13` F2 REFRAME asked for exactly this).
- **Owner:** Luke + Kan
- **Status:** **DECIDED** (Luke + Kan, 2026-09-20)
- **Addendum — 2026-09-20, second founder session (clarification recorded under this entry; the decision above stands unchanged):**
  - **FOUNDER DIRECTION:** ARCHIO should eventually feel familiar to users of social platforms such as Instagram *in terms of configurable visibility*. A user may have: a public / social-facing profile layer · information visible to approved connections / friends / followers · information the user deliberately chooses to share · private account / intelligence information that is **never automatically shared**.
  - **DECIDED (restated, unchanged):** being connected to someone must **NOT** automatically expose email, phone number, authentication information, private Trading DNA, private AI memory, brokerage / account information, private journal / history, or other sensitive personal information.
  - **FOUNDER DIRECTION:** users should eventually have controls over how public / private they are and what appropriate information becomes visible to others.
  - **OPEN / later block:** the entire social permission matrix is **not** designed during D1 (unchanged from the scope line above).
  - Read together with **DL-026** (signed-out visitors may explore public product surfaces but never another user's private / personalised information).

## DL-024 — Zero-data first open: GUIDED EMPTY STATE

- **Date:** 2026-09-20
- **Problem being solved:** `14` §9 Q-2 — a real trader with zero trades opening the Flight Deck today sees demo telemetry presented as their own (`12` FD-STATE-002 / FD-STATE-003 both `NOT DESIGNED`; "the single most important missing state in the product").
- **Decision:** **GUIDED EMPTY STATE.** A brand-new user enters the **real** Flight Deck rather than being shown fake personal trading history / numbers.
- **Founder intent (recorded verbatim):**
  - the experience should still feel useful and alive
  - ARCHIO should guide the new user toward useful first actions
  - the user should be able to explore without being forced through a large mandatory onboarding process
  - personalisation / configuration should be easy and optional
  - the user can configure ARCHIO as much or as little as they want over time
  - empty state should explain what areas can become once ARCHIO has real information
  - **do not represent demo data as if it belongs to the user**
- **Boundary:** a lightweight guided buddy / tutorial **may** support this experience, but the entire onboarding system is **not** to be invented during D1.
- **What it changes:** `14` §2.2 FD decision status and next decision; `12` FD-STATE-002 / 003 status → `DECIDED — to be designed in D1`; D1's definition of "what a real trader with zero data sees on first open" is now fixed to this option. The two rejected options — demo mode labelled DEMO, mandatory onboarding first — are recorded in the rejected-ideas table below.
- **What it does not change:** theme count (Q-4) is still open; no data model for "real information" is implied (F5 / F8 / F10 remain MISSING; DL-021 still governs the loop).
- **Evidence:** founder decision (product honesty — consistent with `01` DL-013 honesty principle and `12` DOCTRINE "honesty in placeholders").
- **Owner:** Luke + Kan
- **Status:** **DECIDED** (Luke + Kan, 2026-09-20)
- **Addendum — 2026-09-20, second founder session (the decision above is reconfirmed; nothing is withdrawn):**
  - **DECIDED (reconfirmed verbatim):** a brand-new user should **not** see fake personal trading history, fake account numbers, fake psychology data, fake P&L, fake trade counts, or a fabricated trader persona presented as if it belongs to them. They enter the **real** ARCHIO workspace; it still feels alive and useful; ARCHIO explains what the major areas can do and gives useful first actions; personalisation / configuration is optional and easy; the user customises as much or as little as they want over time; no large mandatory onboarding before they can see / use the product.
  - **FOUNDER DIRECTION:** the founders like the idea of a **short, optional tutorial after first sign-in.** It may eventually introduce: Flight Deck · the TradingView / chart area · Community · the controls beside / below the chart · gadgets · the major navigation areas · Ask Archio / the question bar. After the tutorial the user returns to the main workspace.
  - **OPEN / later block:** the full onboarding / tutorial system is **not** being designed yet. Summary: **guided empty state = DECIDED · full tutorial design = OPEN / later block.**

## DL-025 — Flight Deck organisation: KEEP the four-category command-centre model for now; the four are a navigation abstraction, not the seven systems, and not "rooms"

- **Date:** 2026-09-20
- **Problem being solved:** `14` §9 Q-3 — whether the four Flight Deck areas (MARKET FLOOR / STUDIO / MENTOR HALL / COLLECTIVE) should be renamed to align with Structural Map v1's seven systems, and whether `/cockpit` (an Education page) should be renamed given `09` calls the Flight Deck "the cockpit surface" (`14` N-7, N-10; `12` F-10).
- **Decision:** **KEEP the four-category command-centre model for now.** The four Flight Deck areas are **not** intended to represent ARCHIO's underlying seven-system architecture. They are a **USER NAVIGATION / COMMAND-CENTRE abstraction.**
- **Founder intent (recorded verbatim):**
  - The Flight Deck should keep charts accessible / in view while giving the trader a complete workspace across the trading process, the trading industry and the ARCHIO platform.
  - The four top-level categories exist to compress ARCHIO's large number of capabilities into understandable immediate destinations.
  - Within those categories ARCHIO may expose: subcategories · destinations · actions · features · relevant information · AI assistance · reusable / premade templates · navigation to deeper ARCHIO areas.
  - Example founder thinking: MARKET FLOOR broadly represents something like "What is happening right now?" — conceptual intent, **not** a final definition of every category.
- **Names:** keep the current four **provisionally** — MARKET FLOOR · STUDIO · MENTOR HALL · COLLECTIVE. **Do NOT rename them merely to match Structural Map v1.** During D1, inspect whether each current name / category actually makes sense for what lives beneath it.
- **Terminology:** **stop treating these four Flight Deck categories as Community "rooms".** After DL-020, Community may use organization → rooms / channels terminology. Use a separate **neutral working term** for the four Flight Deck categories — *zones / spaces / destinations* — until the founders choose final terminology. (These documents use **zones** as the working term from this entry on; the record ID `FD-NAV-001` and its historical title are kept.)
- **`/cockpit`:** the Education `/cockpit` naming collision (N-7) is **recorded for a later rename**; the exact replacement name does **not** need to be chosen during this step.
- **What it changes:** `14` §3.1 N-7 (direction decided, name open), N-10 ("room" no longer applies to the four zones), §2.2 FD; `12` FD-NAV-001 and F-10; `15` §3 row for the Room Navigator. D1 now includes a name-fit inspection of each zone against its contents.
- **What it does not change:** no route, label or component is renamed by this entry; response-engine `RoomId` code identifiers (`studio`, `market-floor`) are untouched; Live Room stays a separate surface; nothing is added beneath a zone — the list of what a zone "may expose" is permission, not a backlog.
- **Evidence:** founder decision (navigation model).
- **Owner:** Luke + Kan
- **Status:** **DECIDED** (Luke + Kan, 2026-09-20) — *names provisional; revisit after the D1 inspection.*
- **Addendum — 2026-09-20, second founder session (status clarified after the D1 Block 1 inspection sheet `docs/lego/D1-block-1-front-door.md` was issued; the earlier text is kept as written):**
  - **What stays DECIDED:** the four-zone **model** — a simple command-centre navigation abstraction that helps the trader reach different parts of ARCHIO quickly while keeping the chart / workspace central. The four zones are **NOT** the Structural Map (`15`) systems. They do **not** use Community "room" terminology (DL-020 reserves room / channel for Community) — working term **zones** stands.
  - **FOUNDER DIRECTION:** each zone may contain subcategories · destinations · actions · features · AI guidance · reusable templates · deeper site navigation. Example: MARKET FLOOR roughly means "What is happening right now?" — conceptual intent, not a definition of every zone.
  - **OPEN — for Product Brain review:** the **zone-fit** question. The founders are **not** ready to approve the current placement of all 16 destinations (door table in `12` FD-NAV-001; misfits listed in the Lego sheet KNOWN PROBLEMS 7). The current names MARKET FLOOR · THE STUDIO · MENTOR HALL · THE COLLECTIVE remain **provisional**. **Do NOT rename or move anything yet.** The Product Brain evaluates the four-zone organisation and the placement of the 16 destinations (its next assigned task, `09` §4.1); the Red Team challenges; the founders decide.
  - Summary line: **model = DECIDED (kept, provisional) · names + placement of the 16 destinations = OPEN (Product Brain review) · not rooms = DECIDED.**

## DL-026 — Signed-out experience: product-first exploration (TradingView-like), identity asked for at the moment of need

- **Date:** 2026-09-20 (second founder session)
- **Problem being solved:** Lego Block 1 founder question 1 and KNOWN PROBLEM 6 (`docs/lego/D1-block-1-front-door.md`): signed-out `/` is a trading terminal with no product framing; every route returns 200 signed-out (`12` SH-STATE-002, `13` S7); DL-023 said the *personalised product* requires login but did not say whether the product *environment* itself may be seen before login. The alternative — a login wall on arrival — was one of the three ticks offered.
- **DECIDED (broad philosophy):** ARCHIO should behave more like a **product such as TradingView** than a traditional marketing website. A signed-out visitor should be able to land on ARCHIO and **see / explore the actual product environment first — especially the chart / trading workspace** — rather than immediately hitting a login wall. The visitor should be able to understand what ARCHIO is and begin exploring. When they attempt actions that require **identity, persistence, personalisation, private data, community participation, personal AI context, account information, saved settings, or deeper use**, ARCHIO should **naturally ask them to log in or register.**
- **DECIDED (the distinction):** signed-out users may see / explore *appropriate public product surfaces*; signed-out users must **NOT** see another user's private / personalised information; private / personalised ARCHIO data **remains authenticated.**
- **OPEN:** the **exact signed-out feature limits** — which surfaces, gadgets and actions are explorable signed-out and which trigger the login / register ask — are **not** decided. They are a D1 output (route + action list) for founder tick-off.
- **How it reads with DL-023:** a refinement, not a contradiction. DL-023's boundary is drawn around **identity, persistence and private data**, not around the product environment as a whole. "Public / marketing / auth / help may be signed-out" now includes *public product surfaces*; "the personalised product requires login" now reads *personalised / private data and identity-bound actions require login*.
- **How it reads with DL-024:** public exploration is **not** a licence to show the demo persona. A signed-out stranger and a zero-data new user both see the real workspace with no fabricated personal numbers; what differs is that the stranger is asked to log in / register at the moment they reach for something personal.
- **What it changes:** `14` §2.1 SH decision status; `12` SH-STATE-002 (the boundary is per-action / per-data, the middleware rule is not "gate the whole product"); `13` S7 fix column; Lego sheet question 1 answered in principle; **rejected-ideas table gains "login wall on arrival"**.
- **What it does not change:** no middleware, route, landing-page or copy change (founder order: no product code). Which landing survives (Q-19), what `/` is after login (Q-4), the TradingView-as-chart stance (D2, F-7) and the theme count are all still open. Whether the Signal Terminal at `/` is the right public surface is **not** decided by this entry — only that *some* public product surface is the front door, not a wall.
- **Evidence:** founder decision (product philosophy). TradingView is named as the *behavioural reference*, not as a design to copy.
- **Owner:** Luke + Kan
- **Status:** **DECIDED** (philosophy) · **OPEN** (exact limits) — Luke + Kan, 2026-09-20

## DL-027 — After login and after registration: one destination — the main Dashboard / Flight Deck workspace

- **Date:** 2026-09-20 (second founder session)
- **Problem being solved:** Lego Block 1 founder question 2 and KNOWN PROBLEM 4: today login pushes to `?from` or **`/`** (Signal Terminal — `app/login/page.tsx` lines 46, 75, 89), registration pushes to **`/copilot`** (`app/register/page.tsx` line 25); nothing sends a user to `/dashboard`; three post-authentication destinations exist.
- **DECIDED (direction):** **both login and registration ultimately land the user in the main Dashboard / Flight Deck environment** — the main ARCHIO workspace. The current split (login → `/`, registration → `/copilot`) is **not** the intended final product behaviour.
- **What it changes:** `14` §2.1 SH and §2.2 FD decision status; `12` SH-PAGE-001 / SH-PAGE-002 gain the destination line; Lego sheet question 2 answered.
- **What it does not change:** **routes are not changed yet** (founder order). The `?from` return-path behaviour after an in-product login ask (DL-026) is a D1 Block 2 detail, not decided here. The visible *name* of that destination is **OPEN** (DL-030). What `/` becomes once it is no longer the post-login landing (Q-4) is still open.
- **Evidence:** founder decision (product flow). Code facts re-verified 20 Sep 2026.
- **Owner:** Luke + Kan
- **Status:** **DECIDED** (destination direction; routes unchanged) — Luke + Kan, 2026-09-20

## DL-028 — Ask Archio as the conversational guide during exploration — FOUNDER DIRECTION, not a specification

- **Date:** 2026-09-20 (second founder session)
- **Context:** DL-024 (guided empty state) and DL-026 (product-first exploration) both need a way for a newcomer to find their bearings without a mandatory onboarding flow. `12` AA-AI-001 (command bar) and AA-AI-002 (grounded engine `/api/archio`) exist; which of them *is* Ask Archio is open (`14` Q-8, N-2, N-8).
- **FOUNDER DIRECTION (recorded):** once users are inside the Flight Deck they should be able to use **Ask Archio / the question bar** to ask things such as *what are you? · what can you do? · where do I go? · how does this feature work?* ARCHIO should help guide users through the product **conversationally**. If a signed-out user tries to go deeper into a feature requiring identity or persistence, the product / ARCHIO can **naturally encourage login or registration** (DL-026).
- **Not a specification:** the full assistant / onboarding logic is **not** designed by this entry. No prompt, no intent list, no surface choice, no grounding source is fixed. Q-8 (which surface is Ask Archio) stays open.
- **What it changes:** `14` §2.7 AA decision status gains this direction; `12` AA-AI-001 / AA-AI-002 gain a one-line pointer.
- **What it does not change:** DL-003 (one LLM call in the *loop engine*) is untouched — this direction is about the General / product-guidance layer (`11` §3), not the Review. No AI work is scheduled by this entry.
- **Evidence:** founder product direction.
- **Owner:** Luke + Kan
- **Status:** **FOUNDER DIRECTION** (recorded 2026-09-20) — not DECIDED as a specification; not OPEN as a question

## DL-029 — Authentication: the face-scan flow is DEMO/SIMULATION; real secure authentication is FOUNDER DIRECTION; KYC / account integrity is OPEN — five concepts kept separate

- **Date:** 2026-09-20 (second founder session)
- **Problem being solved:** Lego Block 1 founder question 3 and KNOWN PROBLEM 3: `/login` opens in "face scan" mode promising "No passwords. No codes."; `12` SH-PAGE-001; `13` F1.
- **DEMO/SIMULATION (classification of existing code — verified 20 Sep 2026):** the current face-scan flow is **not** real authentication. `components/auth/AccessPortal.tsx` lines 534–535 advance on **timers** (`setTimeout` 3.4 s → "processing", 5.2 s → "verified"); `handleFaceAuth` in `app/login/page.tsx` (lines 83–89) then signs in a **fabricated local user** (`id: "face-auth-user"`, handle `operator`, role `STUDENT`) with **no Supabase session**; there is **no biometric verification** of any kind. The only real path is email + password via Supabase Auth ("USE CREDENTIALS INSTEAD").
- **FOUNDER DIRECTION (future):** ARCHIO should eventually support secure, convenient authentication such as: device / platform-native biometric authentication where technically supported · Face ID / passkey-style authentication on compatible Apple devices · email-based authentication · confirmation codes · phone verification where appropriate.
- **OPEN:** the founders are considering **stronger identity verification / KYC or a similar account-integrity system** to reduce abusive duplicate-account creation and strengthen trust. **The exact KYC requirement is OPEN.** The exact KYC / account-integrity architecture is **OPEN**.
- **Separation rule (DECIDED as a way of talking about this):** these are **five separate concepts and must not be merged** — (1) authentication · (2) device biometrics / passkeys · (3) email / phone confirmation · (4) KYC / identity verification · (5) duplicate-account prevention / account integrity. A document, bot or design that treats them as one thing is wrong.
- **What it changes:** `12` SH-PAGE-001 gains the classification; `13` F1 gains a note (verdict REUSE Supabase Auth stands; the face scan is UI, not F1); `14` §2.1 SH decision status; Lego sheet question 3 partly answered (classification recorded; the fate of the face-scan *UI* — remove / disable the fake path / keep as a visual — is **still unticked**, see `14` Q-27).
- **What it does not change:** **no authentication implementation changes yet** (founder order). Supabase Auth remains the real path. No provider, SDK or KYC vendor is chosen or implied.
- **Evidence:** code facts (verified); founder direction (future).
- **Owner:** Luke + Kan
- **Status:** **DEMO/SIMULATION** (current face scan) · **FOUNDER DIRECTION** (future secure authentication) · **OPEN** (KYC / account-integrity requirement and architecture) — recorded 2026-09-20

## DL-030 — The central workspace: what it is intended to become is FOUNDER DIRECTION; its name (Dashboard / Flight Deck / Command Center) is OPEN

- **Date:** 2026-09-20 (second founder session)
- **Problem being solved:** Lego Block 1 founder question 4 and KNOWN PROBLEM 5: five names for one surface — tab "Command Center | Archio AI" · nav "Dashboard · Private command center" · component "Your Space" · documents "Flight Deck" · site title "ArchioAI Trading Terminal" (`14` N-7).
- **FOUNDER DIRECTION (recorded):** the broader **Dashboard** concept is intended to become a **highly customisable trader workspace.** Over time it may include: Flight Deck · the TradingView / chart workspace · gadgets · controls beside the chart · controls below the chart · themes / colours · layout customisation · quick-access settings · **mentor-resold / customised configurations** (this item touches marketplace — **FUTURE/VISION**, `15` V2) · other user-customisable elements. The central operational area is conceptually similar to a **command center for the trader.**
- **OPEN:** final naming. The founders currently use **Dashboard · Flight Deck · Command Center** as related but not yet fully resolved terms. **Do not force a final naming decision yet.**
- **DECIDED (housekeeping):** **"Your Space"** and **"Trading Terminal"** are **not** authoritative current product names and must not be treated as such unless the founders explicitly revive them. (They remain as code identifiers / historical labels — `your-space.tsx`, the site `<title>` — and are not renamed by this entry.)
- **Document convention (unchanged, stated for clarity):** the Source of Truth keeps **Flight Deck** as the label for `15` L1-1 exactly as the founders wrote it on the Structural Map; that is the *document* handle. The *user-visible* name and the relationship between the three terms are what is OPEN. Do not read "Flight Deck" in these documents as a naming decision for the UI.
- **What it changes:** `14` §2.2 FD decision status and §3.1 N-7; `12` FD-PAGE-001; Lego sheet question 4 recorded as OPEN; new inbox row `14` Q-26.
- **What it does not change:** no tab title, nav label, greeting, route or component is renamed. The `/cockpit` rename (N-7, DL-025) stays deferred. Theme count (Q-14) stays open — "themes / colours" above is permission to customise, not a count.
- **Evidence:** founder direction.
- **Owner:** Luke + Kan
- **Status:** **FOUNDER DIRECTION** (what the workspace becomes) · **OPEN** (its name) · **DECIDED** (Your Space / Trading Terminal not authoritative) — recorded 2026-09-20

## DL-031 — Four-zone Flight Deck navigation after the Product Brain / Red Team reconciliation: PROVISIONAL D1 DESIGN DIRECTION (MARKET FLOOR · TRADING DESK · THE ACADEMY · THE COLLECTIVE)

- **Date:** 2026-09-22
- **Approval — read this line first:** **Luke approves this direction (2026-09-22). Kan has NOT reviewed it** — Kan operates asynchronously and reviews accumulated founder decisions later. **This is not a joint Luke + Kan approval and must never be quoted as one.** Label: **PROVISIONAL D1 DESIGN DIRECTION** — the organisation is stable enough to design against; the exact names remain reversible.
- **Problem being solved:** DL-025 addendum / `14` Q-24 left the zone names and the placement of the 16 destinations OPEN for the Product Brain's evaluation and the Red Team's challenge. That reconciliation is now **complete enough to move forward** (founder statement, 22 Sep). The bots' reasoning was relayed through the founders / ChatGPT; only the *surviving* direction is recorded here — proposals are not governance (`09` §1: bots propose, founders decide).
- **PROVISIONAL D1 DESIGN DIRECTION — what survives:**
  - **The four-zone model stays** (DL-025). The zones are **not** `15` Structural-Map systems and **not** Community rooms. Their purpose: make ARCHIO's broad product understandable and fast to navigate **while the chart / workspace stays central**.
  - **ZONE 1 — MARKET FLOOR** (working name). Job: *see what is happening in markets right now.* D1 destinations: **Intelligence · Daily Brief · Live Calls.** *Live Calls* = live / current activity first; historical calls, summaries and outcomes may eventually be a **sub-mode inside Live Calls** — **no separate history door in D1.**
  - **ZONE 2 — TRADING DESK** (working name, **REVERSIBLE**; "Workbench" and "Studio" remain historical alternatives — **never show all three names in the UI**). Job: *work on my trading.* D1 destinations: **Forecasts · Copilot · Post-Mortem.** **FORECAST RULE:** exactly **ONE** primary trader-facing Forecasts navigation entry; the previous Forecasts / Forecast Hub split must **not** remain as two peer doors; existing Forecast Hub functionality may eventually sit behind the one entry. Future modes (viewing / public forecasts · my forecasts · creating / managing forecasts) are **not designed in this step.** Working single-door label: **Forecasts.**
  - **ZONE 3 — THE ACADEMY** (working name; concept approved directionally; the final name is **REVERSIBLE** and may later be compared against better education-oriented alternatives). Job: *learn how to trade better.* Broader than a course library — should eventually support learning reputable strategies / methods, understanding them, mentor education, structured education, learning how to apply methods, guided development. D1 destination: **Education.** Current shells / demo that must be treated **honestly**: **Compare · Mentor AI** — do not visually imply a mature mentor ecosystem while no real mentor data exists. **Ownership rule:** discipline / accountability is **CROSS-CUTTING** — the Academy can teach a rule; Trading Desk / Intent can later show whether the trader followed it; Trading DNA / Personal Intelligence shows patterns over time; Ask Archio explains and helps. **The Academy is not the sole owner of discipline.**
  - **ZONE 4 — THE COLLECTIVE** (working name). Job: *find people and participate.* D1 destinations: **Communities · The Floor · Collab Hub.** **FUTURE architectural concept — Marketplace:** its conceptual long-term home remains The Collective / the Community & Opportunity family (`15` `CO`; `15` V2 `SM`). Marketplace is **NOT** a live D1 product door, **NOT** approved for implementation, and **must stay visible** in future architecture / design planning so the creator / opportunity vision is not lost (appropriately verified AI agents · creator / mentor intelligence products · dashboards / workspaces · templates / layouts · other creator offerings). **Not designed during D1 Block 2.**
- **Global Flight Deck / product chrome — NOT forced into the four zones:**
  - **Ask Archio** — global assistant / navigation / explanation layer (DL-028). **Nexus** is currently considered a **likely legacy duplicate** whose broad "all-knowing ARCHIO" job is absorbed by Ask Archio — **do not delete code yet** (`14` D-19; fate decided with N-8 / Q-8).
  - **Profile / account / privacy / security** — should eventually behave like familiar modern account / avatar chrome, **not** a Collective destination.
  - **Flight Deck customisation** — workspace-specific controls (layout · gadgets · themes / colours · chart-adjacent settings) stay **conveniently accessible on the Flight Deck**, not buried inside account settings.
- **Consequence for today's 16 doors (a design target, NOT a code change — `FLIGHT_DECK_ROOMS` is untouched):** the door-by-door mapping is the second table of `12` FD-NAV-001. In short: the Forecasts template (MARKET FLOOR) and Forecast Hub `/forecast` (STUDIO) fold into the **one** Forecasts entry in TRADING DESK · Nexus leaves the zones (absorption candidate) · Collab Hub moves from MENTOR HALL to THE COLLECTIVE · The Cockpit `/cockpit` is the ACADEMY's Education destination (route rename still deferred, N-7) · My Profile leaves for account chrome · Controls leaves for Flight Deck customisation chrome. **16 doors → 10 destinations + 2 honest shells.**
- **FUTURE/VISION — CENTRALIZED / DECENTRALIZED, UX OPEN:** ARCHIO may eventually support meaningfully different working contexts for **traditional / brokerage / centralised trading** and **crypto / wallet / on-chain / decentralised trading.** The original "Centralized ↔ Decentralized toggle" was a **metaphor** for the concept — **a literal toggle is NOT approved.** Future UX could be an environment picker · an account-context selector · a market-universe selector · a connected wallet / broker context · another professional UX · or **no explicit switch** if one unified environment proves better. **Preserve the concept. Do NOT include it in current D1 chrome.** Do NOT design blockchain infrastructure, tokenomics or liquidity-provider architecture; do NOT imply wallet / broker execution currently exists.
- **Naming flag raised by v0 while recording (not a decision):** "Trading Desk" already names the chart + execution surface in code (`vantary/trading-desk/`, 40 files, `12` FD-SECTION-002, `14` D-9). The zone name is explicitly reversible; the collision is registered as `14` N-21 and must be resolved before any label reaches the UI.
- **What it changes:** `12` FD-NAV-001 (surviving-direction table added; code table kept), MX-PAGE-003 (Nexus), SM-SECTION-001 (Marketplace home), FD-STATE-002 / 003 + SH-STATE-002 (Block 2 pointers); `14` §2.2, §2.7, §2.10, §3.1 N-6 / N-7 / N-8 / N-10 + **N-21**, §3.2 **D-19**, §5, §6.1 D1, §9 Q-24 → provisional + **Q-28** (Kan's review); `15` §2 row + §3 zones row; `09` §2 terminology line, §3 note, §4.1 Product Brain task → COMPLETED; README standing facts; Block 1 sheet. **D1 Lego Block 2 opened the same day as a design-definition block** (`docs/lego/D1-block-2-first-use.md`).
- **What it does not change:** **no product code** — `FLIGHT_DECK_ROOMS`, labels, taglines, routes, `/cockpit`, Nexus, middleware, demo data all untouched; **T1 not started.** No final names (zone names, workspace name Q-26, `/cockpit` replacement). No Forecasts modes, no Marketplace design, no Centralized / Decentralized UX, no tutorial design, no theme count, no chart stance. **Grok packs NOT rebuilt** — pack v3 is now *stale* (zone names; the Product Brain ★ NEXT TASK it carries is complete) but not materially incorrect about code; rebuild waits for a founder-approved reason (`14` §7.2).
- **Evidence:** founder statement 22 Sep 2026 (Luke) recording the surviving direction after the Product Brain / Red Team reconciliation.
- **Owner:** Luke (approved) · Kan (asynchronous review pending — `14` Q-28)
- **Status:** **PROVISIONAL D1 DESIGN DIRECTION** (Luke, 2026-09-22) · **OPEN:** Kan's review; final zone names (TRADING DESK, THE ACADEMY explicitly reversible); N-21; Centralized / Decentralized UX · **FUTURE/VISION:** Marketplace; multi-environment contexts

---

## Rejected ideas (keep forever)

| Idea | Rejected | Why | Re-open if |
|---|---|---|---|
| Rules-check-before-ticket as the differentiator | 2026-09-17 | ~10 apps do it (TRADIS, TradeGate, EdgeFlo, TradingPlan, XeanVI, PropSentinel, Risk Marshal, LockMyTrades, KhomaAPI, Meridian) | never as differentiator; fine as a feature |
| AI session review as the wedge | 2026-09-17 | TradeZella ships it at $59/mo with background agents | never |
| TradingView embedded as the centre of the cockpit | 2026-09-17 | TradingView AI Copilot + MCP make the chart everyone's agent surface | if TradingView MCP becomes our read path |
| Nine systems designed before the loop | 2026-09-17 | "pretty upper layers first" (email §39) | cohort 2 retained |
| Marketplace before verification | 2026-09-17 | trust cannot be manufactured; Invo/Fomo already pay creators in crypto | verified adherence + synced outcomes exist for ≥ 3 mentors |
| Autonomous execution | 2026-09-17 | regulatory + platform dependence + no evidence it improves decisions | v3 evidence + partner carrying regulatory surface |
| "Mentor's Ledger" as wedge/test env (Kan's students) | 2026-09-17 (02) | false premise — Kan has no students, does not trade; repo shape ≠ market evidence | a named educator with named students agrees to run H5 |
| Letting repo architecture define the market | 2026-09-17 (02) | orgs/memberships/mentors reflect an earlier product direction, not demand | never — evidence only |
| One kill criterion for the whole thesis | 2026-09-17 (02) | one capture mechanism failing does not falsify intention-history | never — per-hypothesis criteria only (02 §5) |
| "Zero-friction intent from the order ticket" as the wedge | 2026-09-17 (03) | order data is the commodity fields; setup/thesis/invalidation never come from a broker; Place+Lock = a TradeLocker plugin the partner can build | TradeLocker grants write access AND declared fields prove unnecessary |
| AI setup inference ("87% confidence") in v0 | 2026-09-17 (03) | needs months of the trader's own labels; confirm-fatigue launders inferred into declared | ≥ 40 declared records per trader exist |
| Upfront playbook declaration in onboarding | 2026-09-17 (03) | new users describe an idealised self | never as primary — playbooks are derived from labeled trades |
| "No code this week" as stated | 2026-09-17 (03) | too blunt; the rule is "no infrastructure that doesn't test capture/value/return" | — |
| "Truth Keeper" as a separate proposing bot | 2026-09-17 (07) | a proposer guarding the truth is a conflict of interest; the git folder is the truth | never — fold the constraint into Product Brain |
| Eleven-department Grok org this month | 2026-09-17 (07) | no product data for eleven brains to reason over; meta-product risk | ≥ 40 real Decision Records exist |
| Demo telemetry shown to a real zero-data user, even labelled "DEMO" | 2026-09-20 (DL-024) | "do not represent demo data as if it belongs to the user"; a label does not make fake personal numbers honest | never on the personalised Flight Deck; sample data stays fine on explicitly public / marketing surfaces |
| Large mandatory onboarding before the Flight Deck | 2026-09-20 (DL-024) | the user must be able to explore; configuration is optional and gradual | never as a gate — a lightweight optional guide may support the empty state |
| Renaming the four Flight Deck zones to match Structural Map v1 | 2026-09-20 (DL-025) | the four are a navigation abstraction over capabilities, not the system architecture | only if the D1 inspection shows a zone name does not fit what lives beneath it — then rename for fit, not for alignment |
| A login wall on arrival (redirecting signed-out visitors straight to `/login`; treating ARCHIO as a marketing site with the product behind the door) | 2026-09-20 (DL-026) | ARCHIO behaves like a product (TradingView reference): explore the real environment first, ask for identity at the moment of need | never as the default arrival; specific private / personalised surfaces still require login (DL-023) |
| Presenting the timer-based face scan as authentication | 2026-09-20 (DL-029) | it verifies nothing — timers plus a fabricated local user with no session; the copy promises "No passwords" while the only real path is a password | when a device-native biometric / passkey path actually authenticates (FOUNDER DIRECTION) — the fate of the current UI (remove / disable / keep as visual) is a separate OPEN tick (`14` Q-27) |
| Treating "Your Space" or "Trading Terminal" as the current product name | 2026-09-20 (DL-030) | founders named Dashboard · Flight Deck · Command Center as the live (unresolved) terms | only if the founders explicitly revive either name |
| Merging authentication, device biometrics / passkeys, email / phone confirmation, KYC / identity verification and duplicate-account prevention into one concept | 2026-09-20 (DL-029) | five different problems; a merged design hides which one is being solved | never |
| Showing TRADING DESK, Workbench and Studio together in the UI as alternatives | 2026-09-22 (DL-031, provisional — Luke) | one working label per zone; the other two are historical alternatives kept in the ledger, not on screen | if the founders pick a different single label — then that one, alone |
| A separate Live Calls *history* door in D1 | 2026-09-22 (DL-031, provisional — Luke) | live / current activity comes first; history, summaries and outcomes are a later sub-mode inside Live Calls | when real live-call data exists and the sub-mode is designed |
| Forecasts and Forecast Hub as two peer doors | 2026-09-22 (DL-031, provisional — Luke) | two confusing doors for one trader-facing entry; Forecast Hub functionality sits behind the single Forecasts entry | never as peers — future modes (public / mine / create) live inside the one entry |
| A literal Centralized ↔ Decentralized toggle in the chrome | 2026-09-22 (DL-031) | the toggle was a metaphor for a multi-environment concept; a literal switch is not approved and would imply wallet / broker execution that does not exist | when the founders choose a future UX (environment picker · account context · market universe · connected wallet / broker · none) — not in D1 |
| Making THE ACADEMY the sole owner of discipline / accountability | 2026-09-22 (DL-031, provisional — Luke) | discipline is cross-cutting: Academy teaches, Trading Desk / Intent shows adherence, Trading DNA shows patterns, Ask Archio explains | never |


---

<!-- FILE: 02-revision-2026-09-17-kan-correction.md -->

# Revision 02 — after the Kan correction

**Date:** 2026-09-17 (same night as 00/01)
**Trigger:** founder fact: Kan does NOT currently run a trading community or have students, and does not actively trade. He has deep trading knowledge and history and co-owns the concept.
**Effect:** supersedes Thesis F ("Mentor's Ledger") as wedge and as test environment. DL-002 and DL-008 are SUPERSEDED; DL-001 is amended. Document 00 stands for everything else (market research, KNOWN/WRONG lists, repo audit, object schemas, existing-work classification).

---

## 1. Erratum — what I got wrong and why it matters

I concluded "B2C solo trader is probably the wrong user" and proposed the Mentor's Ledger from three inputs: the repo's backend is org/membership/mentor-shaped, one line calling Kan a mentor, and the Owen deck's Act I pain. Two of those are **product archaeology**, not market evidence. The third is real pain but not pain *we can reach*. I did exactly what the master prompt warned against: let the existing architecture dictate the market. The correct statement was always:

> Mentor-led cohorts *may be* the easiest environment in which to test the Decision Record hypothesis — **if one is available.** None is.

I also blurred three layers into one sentence. They are separated below and must stay separated in every future document.

## 2. The three layers, separated

| Layer | Statement | Status |
|---|---|---|
| **Long-term company thesis** | ARCHIO becomes the operating system around a trader's *decisions*: it stores intention before outcome, matches what happened, and over time knows the trader well enough that its intelligence (and later its agents, and later other people's expertise expressed as software) is grounded in that trader's real record rather than in generic market commentary. | BELIEVED. Not falsified by research. Not supported by a single data point we own. |
| **Initial wedge** | Capturing intention before execution, then showing planned → actual → outcome, produces something a trader values enough to keep doing it **voluntarily**. | HYPOTHESIS. This is the one thing to test. |
| **First test environment** | Unknown. Was "Kan's students." Is now OPEN and is the **first problem**, ahead of the product. | OPEN |

The mentor idea is not dead as a *market*. Trading education (Whop/Skool/Discord communities) is a large, real distribution channel and the deck's Act I pain is real. It is dead as *our available test environment*, and it must not be promoted to "the company" again without an actual mentor with actual students signed up.

## 3. Does the Decision Record survive when nobody is forcing anyone?

Honest answer: **it survives as an output, and it is fragile as an input.** Both halves matter.

**Why it is fragile.** The moment before entry is when a trader is least willing to type. Every journaling company that grew did so by *removing* input effort (TradeZella, Tradervue: auto-import; the value arrives without work). Pre-trade capture asks for work at the worst moment, before there is any result to be curious about. Voluntary commitment devices in general (stickK, Beeminder) are a niche used by people who already know they have a discipline problem and have failed to fix it alone. Expect that population to be small and specific.

**Why it survives.** Three things reduce the input problem more than my first document acknowledged:

1. **Most of a Decision Record already exists in a bracket order.** A trader who places entry + stop + target has *declared* entry, invalidation price, target and size before the outcome. From broker data alone (pending orders, modifications, fills) you can measure: stop moved, target moved, size changed, entered before the level, exited before the plan. The only truly manual fields are **setup tag + one-line thesis**. That is a ~10-second ask, not a form. This matters for the TradeLocker conversation: read-only order history (not just fills) *is* the intent data for bracket traders. It is not yet secured; it is the one thing to ask Owen for.
2. **The first review has to buy the second capture.** The economics of voluntary use are: one surprising sentence the trader could not have produced from their own journal ("you planned 0.5% and risked 0.9% on 6 of your last 8 losers; your winners were all inside plan") is what earns the next record. If the first review is generic, no UI polish saves it. The test must therefore include a human-quality review from day one, even if a human writes it.
3. **Extrinsic frames exist without a mentor.** Prop/funded challenge traders have explicit, machine-checkable rules with real money attached to breaking them. That is the closest thing to "someone making you" that does not require us to own a community.

**Verdict:** the Decision Record remains the strongest idea on the table and the correct first object. Its adoption is the company's single load-bearing hypothesis. Nothing above it should be built until capture is observed happening voluntarily, repeatedly, in at least a handful of real traders.

## 4. Candidate first populations (ranked, none proven, none currently reachable)

| Population | Pain | Frequency | Rules explicit? | Reachable by us in 7 days? | Risk |
|---|---|---|---|---|---|
| **Prop / funded challenge traders** (futures, forex, CFDs on TradeLocker-class platforms) | very high — one rule break loses the account | daily | yes (firm rules + own rules) | via Discords, r/Prop trading, and *TradeLocker itself* — the Owen relationship is a distribution door into exactly this population | they may want a hard *lockout*, not a reflective record; ~10 tiny risk-guard apps already serve part of this |
| **Serious active discretionary retail traders** with a defined setup | medium-high — inconsistency | daily / several per day | partly | via personal network only; no channel | TradeZella's users; will compare to auto-import journals |
| **Students of an external educator** (not Kan) | high (deck Act I) | varies | yes (the educator's) | only if a real educator with real students says yes this week | we own no such relationship; recruiting one is a sales task |
| **Founders themselves** | — | — | — | Kan does not trade. **Does Luke?** If neither founder trades actively, nobody on the team is the user; that gap must be named and closed (a trading advisor who is an active user, or a founder starting to trade small, live). | building for a user you are not |

The first population is the strongest on paper *and* the one our only warm partner (TradeLocker) can reach. That is a hypothesis, not a decision. The honest first question is not "who is best" but **"who can we get five of by next Monday?"**

## 5. Which experiment falsifies which hypothesis (kill criteria rewritten)

DL-008's "plan rate < 30% → solo Trader OS is dead" was wrong: it let one capture mechanism falsify the whole thesis. Corrected:

| ID | Hypothesis | Test | Falsified when | What that does NOT falsify |
|---|---|---|---|---|
| **H1 — Voluntary capture** | Active traders will record setup + thesis + invalidation + risk before entry when asked personally, with ≤ 20s friction. | 5–10 traders, 5 trading days, capture via the lowest-friction channel available (Telegram message / form). Measure records ÷ trades. | < 30% coverage **after** trying at least two capture mechanisms (form → chat message → partial auto-fill from bracket) and personally asking each trader why. | The thesis. It falsifies *manual* capture as the foundation and points to broker-derived intent (§3.1). |
| **H2 — Review value** | Seeing planned → actual → outcome tells a trader something their current journal does not. | After each week, a written review per trader (human-written in the test). Ask: "Was there anything here you did not already know?" | ≥ 70% say no, twice. | H1. People may record and still find the review generic — that is a review-quality problem, fixable. |
| **H3 — Unforced return** | Traders come back without being pushed. | Stop reminding in week 2. Measure who keeps recording. | < 30% of week-1 recorders record in week 2 unprompted. | H1/H2 individually. It falsifies the *standalone* product; suggests capture must be embedded in an existing surface (chart, broker, community). |
| **H4 — Broker intent sufficiency** | Pending-order history reconstructs ≥ 70% of a bracket trader's plan without typing. | Needs TradeLocker read-only order history or a CSV export with order modifications. | Reconstruction < 50%, or platform gives fills only. | H1–H3. It just means capture stays manual longer. |
| **H5 — Community enforcement** (parked) | A mentor asking daily lifts H1 coverage materially. | Only runnable when a real educator with students exists. | — | — |

Green light for building software: H1 ≥ 50% coverage with one mechanism **and** H2 ≥ 50% "yes" **and** H3 ≥ 50%. Anything less means iterate the test, not the codebase.

## 6. Earned-complexity chain — no layer without evidence from the one below

| Layer | What gets built | Gate UP (evidence required) | STOP (evidence that says do not proceed) |
|---|---|---|---|
| **0. Manual loop** | Nothing coded. Traders message intent; a spreadsheet; a human writes the review. | H1 + H2 + H3 green across ≥ 5 traders | H1 fails across two mechanisms → rethink capture (broker-derived) before any UI |
| **1. Decision Record + Review** | 3 tables, one page (Plan / Today / Review), CSV import, deterministic deviation, one LLM sentence-writer | 10+ traders keep using it for 4 weeks; LLM review rated ≥ human review 50% of the time | LLM review rated worse → keep it human-assisted longer; retention < 50% → capture friction problem, go to Layer 1b (chart/broker capture) not Layer 2 |
| **1b. Embedded capture** | TradingView alert/webhook or TradeLocker order read → partial record | H4 ≥ 70% reconstruction; coverage rises | Platform refuses read access → CSV lane only; reassess TAM |
| **2. Trading Memory** | 500+ records per active trader; searchable; setup expectancy per trader | Traders ask questions of their own history unprompted ("how do I do on Tuesdays?") | Nobody queries → memory is a report, not a product; stay at 1 |
| **3. Trader Model** | Derived aggregates become a persistent profile; model flags a deviation *before* it recurs | A flagged deviation is avoided ≥ 30% of the time it fires (measured) | Flags ignored → model is noise; back to 2 |
| **4. Personalised AI** | The model can explain a trader's pattern and ask a question that changes behaviour | Traders rate AI review ≥ human review; behaviour change measurable in adherence | Rated below human → keep humans in loop |
| **5. Agents / workflows** | AI acts *for* the trader inside its permissions (drafts plan from chart context, blocks a rule-breaking ticket if the trader opted in) | Traders opt in and keep the agent on for 30 days; adherence rises vs. control | Opt-out > 50% → agents are unwanted; intelligence stays advisory |
| **6. Creator / expert intelligence** | An expert's strategy as a checkable spec, grounded in thousands of records by that spec's users | ≥ 3 experts with ≥ 20 active followers each; spec-vs-expert disagreement rate measured and low | No expert will expose a spec, or disagreement rate > 30% → "feel" dominates; expertise not softwarable at this stage |
| **7. Marketplace** | Paid access to expert intelligence with verified records as the trust layer | Layer 6 stable for a quarter; users request it | Invo/Fomo-class competitor owns the category → partner, do not build |

The chain is causal, not aspirational: each layer is only *necessary* if the one below generates the demand for it.

## 7. Tonight — what Luke and Kan leave with (no code, ~90 minutes)

1. **Read this document together; mark the three layers as agreed or not.** If not agreed on Layer 1 (vision), stop and argue about that first — everything else is downstream.
2. **Freeze Decision Record v0 fields on one line.** Instrument · direction · setup tag · thesis (≤ 280) · invalidation · entry / stop / target · risk % · optional 1–5 state · timestamp locked. Nothing else. Write it down and stop editing it.
3. **Write the recruitment list.** Ten named people you can each personally message tomorrow who trade actively (or three communities you have standing in). **If you cannot fill this list tonight, that is the finding:** distribution is problem #1 and the next week is about reaching traders, not product. Decide who owns recruiting.
4. **Pick the capture channel for the manual test.** Recommendation: a Telegram/WhatsApp message to a private group in a fixed shape (one line, the v0 fields in order). Not a UI. Not an app. A form only if traders prefer it.
5. **Decide who writes the reviews for week 1.** Kan's trading knowledge is the asset here: a human-written planned-vs-actual review from someone who has traded is the highest-quality version of H2 we can produce, and it tells us what the LLM must eventually match.
6. **Answer the founder question you have been avoiding:** does Luke trade actively? If neither of you does, name how the team gets a user in the room (an active trader as advisor, or a founder trading small and live from Monday).
7. ~~Decide the name.~~ **Done — ARCHIO** (DL-007). QClay's assets stand as named.
8. **Send QClay three lines:** thank you; we are running a two-week product test before committing to full scope; we will come back with a bounded brief or a clean stop by [date].
9. **Do not build the Grok organization this week.** One shared document (this folder) is the organization until there is data for a second brain to reason about.

Success for tonight is not a plan. It is: a frozen field list, a named list of traders, a capture channel, a reviewer, a name, and a sent message.

## 8. Open questions only the founders can answer

- Does Luke trade? How often, what instruments, on what platform?
- Who — by name — can you reach this week who trades daily?
- Is TradeLocker read-only *order history* (not just fills) something Owen can grant to a partner? If yes, H4 becomes testable within the month.
- Is anyone in your network running a paid trading community who would let us run H5 with their members?


---

<!-- FILE: 03-intent-capture-position.md -->

# 03 — Intent Capture: position, corrections, design target

**Date:** 2026-09-17 (night) · **Status:** PROPOSED · **Responds to:** the ChatGPT "Intent Engine" exchange (Luke ↔ ChatGPT, same night)

---

## 0. Plain language, for Luke and Kan

Three things have to be true. One line each.

1. **Capture.** A trader tells the system what they are about to do — *which setup, why, what would make them wrong* — **before the outcome**, with the smallest effort we can engineer.
2. **Value.** Afterward the system tells them something their broker and their journal do not.
3. **Return.** They come back without anyone pushing them.

Trader Model, agents, workflows, creator intelligence, marketplace: all of it stands on records that only exist if (1) is true and are only worth building if (2) and (3) are. That is the whole test.

**Grok bots — yes, tonight, three of them.** This was already in `00 §10` and `02 §8` (Truth Keeper · Red Team · Architect). "Don't build the eleven-brain org this week" was never "don't touch Grok." ChatGPT and this document agree on the three.

**Code — the rule is corrected.** "No code this week" was too blunt. ChatGPT's version is right: *don't build infrastructure that isn't necessary to test 1–3.* Three tables + one page inside the existing app is inside that rule. The Telegram/spreadsheet loop is not wrong either — it tests (2) and (3) at zero cost; it just does not test (1), because typing in Telegram is the *worst* capture friction, not the best.

---

## 1. Adopted from ChatGPT (into the source of truth)

- **System assembles → user confirms**, not user enters → system stores.
- **Provenance per field:** `OBSERVED` (broker/data/chart) · `DECLARED` (trader said it) · `INFERRED` (AI guessed) · `DEFAULTED` (inherited from playbook/session/account), each with optional `confidence` and `confirmed_at`.
- **Coverage against broker total.** Never present partial data as complete: "based on your 24 planned trades," not "you."
- **Principle: every unit of friction must purchase immediate value.**
- **One data model, many capture surfaces.** Universal *architecture* ≠ universal *initial product*.
- **Competitor correction:** TradeZella (Planning → Trading → Import → Review, pre-trade notes, rules, AI session-vs-plan) and TraderSync (trade plans with entry/exit/risk/strategy before execution) already ship pre-trade planning. "We have pre-trade planning and AI review" is not a claim we can make.
- **Playbooks are derived, not declared.** "You've labeled three trades Opening Range Breakout — save as a playbook?" is right. A two-minute onboarding monologue about strategies the trader *thinks* they trade is wrong — new users describe an idealised self.

---

## 2. Where the Intent Engine overreaches (challenged)

### 2.1 The order is not the intention
"ARCHIO knows 90% of the trade before the trader types" is true **by field count** and false **by information value**. Entry, stop, target, size, side, time are `OBSERVED` — and every journal on the market already imports them. They are the commodity. The scarce fields are **setup, thesis, invalidation** — and no broker, chart, or order ticket will ever produce them. Two traders place identical brackets for opposite reasons. A stop is a *price*; an invalidation is a *condition* ("acceptance below the sweep low"), and traders routinely set stops on money, not thesis.

So the Intent Engine removes friction from the fields that don't matter and leaves it exactly where it always was. **The minimum human contribution is not zero. It is one tap (which setup) plus an optional one line (why / what kills it).** Invalidation and risk can inherit from the playbook or session (`DEFAULTED`). That is the design target. Design to it; do not promise below it.

### 2.2 Zero-friction capture is a platform product
"Place + Lock" — the record created as a by-product of placing the order — requires either being the order UI or having write access to TradeLocker. Then the product *is* a TradeLocker plugin. TradeLocker has AI Studio and is the most natural builder of exactly that. Do not make the wedge depend on the partner who could build it in a quarter. **Read-only pending-order data is the ask to Owen. Cohort 1 is designed as if that ask is refused.**

### 2.3 Inference at v0 is fiction
"London Sweep — 87% confidence — Lock?" requires months of *that trader's* own labels. Before that it is a prompt guessing. Worse: **confirm fatigue launders `INFERRED` into `DECLARED`** — users tap Yes. Rules: a confirmed inference stays `INFERRED` with `confirmed_at`; the setup picker shows no pre-selected default (at least every Nth record); Trader Model claims are built from `DECLARED` + `OBSERVED` only.

### 2.4 Immediate value is a commodity — the retention gap is weeks 1–4
R:R, risk %, daily risk used, rules matched: every broker ticket and all ~10 gate apps show these. Planned-vs-actual on one trade: TradeZella semi-has. Compounding insight ("after two losses you size 1.7×") is the moat and needs 40+ records — weeks for a day trader, months for a swing trader. **So for the first month the product offers only commodity value.** Neither document solved this. Honest bridges:
- **A human review** (Kan, who has traded) for cohort 1 — does not scale, does work.
- **The Coverage Split:** on a connected account, *planned trades vs unplanned trades, same trader, same month.* If planned trades outperform, the trader sees the point in their own numbers — proof of value the product generates about itself. If they don't, the product has honestly told the trader planning does not help them — also a kill signal. This may be the single strongest retention message available early.
- **The room.** Social reinforcement is the one lever the research supports; the Live Room already exists.

### 2.5 Before-fill vs before-outcome — the honesty number
Market orders fill before any prompt can appear. But **before-fill is not the requirement; before-outcome is.** Record `lock_lead_seconds = first_fill_at − locked_at`. Positive = true pre-trade intent. Negative but pre-close = post-fill declaration (weaker, still pre-outcome, still usable). Post-close = contaminated; flagged; excluded from adherence. **This one number is the honesty metric of the entire dataset** and later of every Trader Model claim built on it.

### 2.6 Nobody on the team lives in the moment being designed
Intent capture is a design for the ten seconds before entry. Kan does not trade; Luke's status is unstated (`DL-010`). A zero-friction capture for a moment neither founder lives in daily **cannot be designed from the outside** — it will be evaluated by nobody. Recruiting active traders is therefore not a detour from the Intent Engine; it is its prerequisite.

---

## 3. Capture mechanisms, ranked

Friction = incremental effort at the moment of the trade. Declared quality = how much of setup/thesis/invalidation we actually get. Buildable = without TradeLocker cooperation.

| # | Mechanism | Friction | Declared quality | Observed quality | Needs | Buildable now | What it tests |
|---|---|---|---|---|---|---|---|
| 1 | **Session plan inheritance** — morning: "today only setups A/B, max 0.5%, stop at 11:30"; every trade inherits | one action per session | medium (session-level, not per trade) | via CSV/API | nothing | **yes** | will traders declare *once a day*; is session-level intent enough to match |
| 2 | **Playbook one-tap** — "which of your setups?" single tap; invalidation/risk inherit | 1 tap | high for setup | via CSV/API | 3+ labeled trades first | **yes** | the floor of per-trade declared friction |
| 3 | **Quick line + AI structuring** — "L ES sweep reclaim → VWAP" → structured thesis/invalidation → confirm | 3–6 s | high | via CSV/API | one LLM call | **yes** | is thesis capture tolerable when AI does the formatting |
| 4 | **TradingView alert webhook** — alert text is the thesis; firing creates the record | 0 incremental for alert traders | medium | partial | TV Pro+ on user side | **yes** | zero-incremental capture without any broker deal |
| 5 | **Pending-order watch + prompt** — API sees new pending/open order → pushes "which setup?" | 1 tap | high | **native** | TradeLocker read API + polling | after Owen | does observed-first capture raise completion |
| 6 | **Hotkey / overlay** — desktop shortcut opens a 2-field capture over the chart | 2–5 s | medium–high | via CSV/API | desktop presence | yes, later | capture without leaving the chart |
| 7 | **Voice** | 3–8 s | high, noisy | via CSV/API | STT + LLM, latency | yes, later | thesis-rich traders; fails in loud rooms |
| 8 | **Chart drawing capture** — TV long/short position tool already holds entry/stop/target | ~0 | low (no setup/thesis) | native | TradingView MCP/API access | speculative | whether TV's new agent surface exposes it |
| 9 | **Place + Lock** — record created as the order is placed | ~0 | still 1 tap for setup | perfect | TradeLocker write / being the order UI | not without partner | the ceiling; also the partner's own product |
| 10 | **Form** | 20–40 s | highest | manual | nothing | yes (exists: `copilot-trade-plan.tsx`) | the *lower bound*: if traders do the form, everything above works |
| — | Post-hoc reconstruction — import, then "what was your plan?" | low | contaminated | native | nothing | — | **anti-pattern**: this is what every journal does; flag `locked_at > closed_at`, never count as intent |

**Design note:** 1 + 2 + 3 compose. Session plan sets the defaults; one tap picks the setup; the line is optional. That composite is the v0 capture surface.

---

## 4. What this does to the schema

- `decision_records` gains **per-field provenance**: `{ field, value, source: observed|declared|inferred|defaulted, confidence?, confirmed_at? }` (a JSONB `fields` column or a child table — Architect brain decides).
- Timestamps: `locked_at`, `first_fill_at`, `closed_at`, derived `lock_lead_seconds`, plus `capture_surface` enum (`session|playbook_tap|quick_line|tv_webhook|order_watch|hotkey|voice|form|posthoc`).
- `session_plans` (date, allowed setups, max risk, cutoff time, notes) → records inherit as `DEFAULTED`.
- `playbooks` (derived; version; trigger conditions; default invalidation; default risk) — created *after* labels exist, never on day one.
- `coverage` view: records ÷ broker trades per period; **split stats planned vs unplanned**.
- **Trader Model weighting rule:** assert only from `DECLARED` + `OBSERVED`; `INFERRED` may *suggest*, never assert; `DEFAULTED` counts as declared once, at session level.
- **Agents inherit the same rule** when they exist: act on observed + declared, suggest on inferred, never act on defaulted alone. This is how the foundation feeds agents later without building them now.

---

## 5. Three prototypes that teach the most, fastest

| Prototype | Tests | Fail means | Fail does **not** mean |
|---|---|---|---|
| **P1 · Session plan + one-tap setup** (mechanisms 1+2) | H1 at the minimum declared friction | traders won't declare even once a day + one tap | intention history is worthless — try P2/P3 |
| **P2 · Quick line + AI structuring + confirm** (mechanism 3) | whether thesis-rich capture is tolerable when AI formats | thesis is the friction; drop to setup-only | setup-only capture fails |
| **P3 · TradingView alert → record** (mechanism 4) | zero-incremental capture with no broker deal | alert traders are too few / alert text too thin | order-native capture (5/9) fails |

All three run over CSV import for the outcome side until read API exists. All three report `lock_lead_seconds` and coverage from day one.

---

## 6. First assignments for the three Grok brains (small, then stop)

- **Product / Truth:** write the one-page hypothesis (§0) and the design target (§2.1). Reject any proposed feature that does not serve capture, value, or return.
- **Red Team:** attack §2.1 — try to derive invalidation from order data alone; find who already ships session inheritance; list the reasons a trader would *not* tap once. Attack §2.4 — propose a week-1 value that is not commodity.
- **Systems / Architect:** the §4 schema and its mapping onto existing tables (`orgs`, `rooms`, `SessionEvent` ledger, `copilot-trade-plan.tsx`). Nothing beyond it.

Then stop. The next input the brains need is not another document; it is ten traders.

---

## 7. Genuinely novel vs already shipped

- **Not novel:** pre-trade plan · AI review · rules check · R:R / risk display · trade import · playbooks · session-vs-plan comparison.
- **Partially novel:** per-field provenance (no journal exposes it) · `lock_lead_seconds` as a published honesty metric · Coverage Split as a product message · session inheritance of intent (gate apps have daily *limits*, not inherited *intent*).
- **Novel if it works:** an intention-vs-execution dataset with provenance, feeding a model that refuses to claim anything the trader did not declare. Whether traders *value* that enough to return: **OPEN — the only question.**

---

## 8. On the night itself

Two AIs are producing strategy documents for two founders who have not yet made one decision from last night's list (`00 §10`, `02 §7`). Each document restores clarity for an hour; the next question dissolves it. That is not a knowledge gap. **Clarity is a decision, not a document.** After this file, the next artefact that will make anything clearer is a list of ten names.


---

<!-- FILE: 04-kan-5-minute-version.md -->

# Kan — the 5-minute version

*Luke → Kan, 17 September 2026. Send this before we talk.*

---

Bro, I've spent about four hours tonight running our own ideas through ChatGPT and v0 and trying to break them. I want to catch you up before we talk, because I don't want this to land as "Luke changed the company again." It's closer to the opposite. I think I finally see the structure that sits underneath everything you've built.

**What I did.** I gave both AIs everything we've ever written — my partner email, the 54-section prompt, the two QClay decks and the whole Telegram log with Sofia, the backend docs, the ChatGPT dump. v0 also read our actual codebase and researched the competitors as of today. Then I made the two AIs argue with each other and with me. Some of what came back is uncomfortable. Some of it is the clearest I've felt in months.

**What did NOT change.** The big vision. An intelligent operating system around the trader — one that understands the market, understands the trader, and helps them make better decisions before, during and after the trade. Nobody killed that. Agents, creator intelligence, the marketplace — all still on the board. The dashboard you built stays the surface where it all comes together.

**What changed.** I no longer think "the sickest cockpit with the most features" is something we can own. v0 checked what's shipping right now. TradeZella already sells AI agents that review your trades for $35–99 a month. TradingView shipped an AI chart copilot in April and *yesterday* shipped a way for outside AIs to act on your account. TradeLocker has its own AI Studio. "Rules checked before you enter" exists as about ten small apps. Fomo raised $75M in June for social/copy trading with creator payouts. So every feature on our list, somebody with more money is already shipping. Features get copied. The question is what we do *underneath* the features that nobody does well.

**Where I think that is.** Every platform knows the *ending* of a trade — you bought here, sold there, made or lost this. Almost nobody knows what the trader *intended* before they knew the result: which setup, why now, what would prove them wrong. If ARCHIO captured the intention before the outcome, compared it with what actually happened, and did that a hundred times, we'd have evidence about how a person trades that no broker or journal has.

That's the loop: **PLAN → TRADE → COMPARE → REVIEW → LEARN.**

Everything you designed — psychology, journal, forecast, execution, education, community, agents — can plug into that one loop instead of being separate pages.

**The hard part, and I think it's our first real product problem.** This cannot feel like filling out a journal before every trade. That dies. Think checkout on a website — every extra button tightens the funnel. So the design question isn't "how do we make traders fill out a form," it's "how does the system already know almost everything and ask the trader only for the tiny piece it can't know?" System assembles, trader confirms — not trader fills out form.

v0 pushed back hard here, and I think it's right: the fields a broker can give us — entry, stop, target, size — are the boring ones every journal already imports. The fields that actually matter — which setup, the thesis, what makes it wrong — *never* come from a broker. So there's a floor. We probably can't get below one tap (which setup) plus maybe one line (why). And honestly: our code today has **no broker connection at all**. Zero trade tables. So "the system already knows" is where we're going, not where we are.

**A mistake I want you to know about.** v0 first suggested we start with you and "your students" as the first test group. That was built on a wrong assumption about you and it withdrew it the same night. But it exposed something real: neither of us is the user right now. You're not trading day to day, and I need to be honest about whether I am. Whoever the first five real traders are, we don't have them yet. That's problem zero, before any product.

**Why this matters for you specifically.** The last year of your work isn't wasted and I want to say that plainly. What we've been doing is building the upper floors before the foundation — about 337,000 lines of code across 819 files — one dashboard file alone is 33,000 — and not one table for a trade, a plan or a decision. That's not a design failure. It's a sequencing failure, and I drove it as much as you did by expanding the vision every week. Under this model a lot of your pages make *more* sense, not less: psychology can react to actual behaviour instead of being a page; the journal writes itself from the plan and the fills; Forecast is literally a public decision record; the Live Room's event log is already the closest thing we have to a decision ledger; the trade-plan panel in the execution copilot is already the right shape. We connect. We don't rebuild.

**Where we stand, honestly.**
- **VISION** — the trading OS around decisions.
- **HYPOTHESIS** — traders will record intent before entry with tiny friction, find the comparison useful, and come back on their own. Not proven. Nothing about Decision Records, the Trader Model, agents, creators or a marketplace is proven.
- **EXPERIMENT** — the smallest thing that tests that hypothesis with real traders.
- **DECISIONS** tonight — a short list, below.
- **UNKNOWN** — who the first traders are, which capture mechanism wins, whether TradeLocker gives us order data, what we say to QClay.

**What I want tonight.** Not another four-hour feature brainstorm. Read this and tell me where it's wrong — you know the product better than anyone and I want your disagreement more than your agreement. Then: agree or disagree on the direction. Create three Grok brains — not eleven — Truth Keeper, Red Team, Architect. Give them our source-of-truth docs. One problem for all three: *how does ARCHIO capture what a trader intends before a trade with almost no work from the trader, and give back enough value that they do it again?* We decide, the bots don't. Then the boring stuff: three lines to QClay, and a list of ten traders we can personally message tomorrow. If we can't fill that list, that's the finding.

I'm not asking us to think smaller. I'm asking us to think in order.


---

<!-- FILE: 05-founder-memo.md -->

# Full founder memo — Luke to Kan

*17 September 2026. Read `04-kan-5-minute-version.md` first. This is the longer why. Labels used throughout: **VISION · HYPOTHESIS · EXPERIMENT · DECISION · UNKNOWN**.*

---

## 1. Why I spent tonight on this

Three things are sitting on us at once. QClay has been waiting since 31 August for a $35k design + $300–350k build decision. Owen at TradeLocker needs one clear ask from us, not a deck. And after a year of your build and a 54-section prompt from me, neither of us can say in one sentence what ARCHIO *owns*.

So I fed everything we have ever written into two AIs and made them fight — with each other and with me. Not to get a new plan. To find out which of our beliefs survive being attacked. Most didn't. A few did. This memo is the record of which.

## 2. How we've been thinking, and why it stopped working

Our pattern: idea → page → feature → AI capability → another idea. Nine systems. Four rooms. Sixty-six page cards in QClay's plan. Eleven Grok departments in my prompt. Every one of them individually good.

Then v0 audited the repo. About 337,000 lines of code across 819 files (one dashboard file alone is 33,000 lines). Real login, real orgs, memberships and invites, real Stripe, real Polygon market data, a real AI endpoint grounded in live prices, even a real event-log table. And **not one table for a trade, a plan, a decision or a rule. No broker connection.** Every line in our pitch that says "it knows you" is a design, not a system.

This is not your fault and it is not a UI problem. It's the order we did things in. I expanded the vision every week; you made it real on screen every week. What neither of us did was make the system *underneath* real. My own partner email names this in §39 — "pretty upper layers first" — and the repo is the proof of it. We built the cockpit before the engine.

## 3. What's actually out there right now

v0 researched this today, not from memory:

- **TradeZella** runs background AI agents over your imported trades — auto-tagging, session review, game plans — at $35–99/mo. "AI reviews your trades" is a commodity.
- **TradingView** shipped AI Chart Copilot in April and an MCP server *yesterday* that lets outside AIs act on a user's account. The chart is becoming everyone's agent surface.
- **TradeLocker** has its own AI Studio. "Why wouldn't they just build it?" is a live question for anything we put next to their order ticket.
- **"Rules checked before the ticket"** — our Act III slide 04 — is about ten small apps (TRADIS, TradeGate, EdgeFlo, XeanVI, PropSentinel, Risk Marshal and more).
- **Invo** pays creators 15% of copied trades with verified records. **Fomo** raised $75M at a $550M valuation in June. Social + copy + creator payouts is funded.
- **Behaviour research:** pre-commitment works; process metrics beat P&L; the effect fades unless it's personal and socially reinforced.

What this means: every differentiator on our list — AI review, rules gate, TradingView in the centre, creator fee share, the cockpit — already exists or is already funded. Fine as features. Dead as the reason we exist.

What the research did **not** find: anyone who stores what the trader intended — thesis plus what would prove them wrong — *locked before the outcome*, then matches the outcome back and measures adherence over time. Gate apps check rules and keep nothing. TradeZella tags after the fact. Copy apps store the trade. **Nobody stores the intention.** That's the strongest idea that survived. And "nobody does it" can also mean "nobody wants it." We hold both until traders tell us.

## 4. The argument: what ChatGPT proposed, what v0 challenged, what survived

**ChatGPT proposed** a bounded first version — "a trading floor with a memory" — instead of the full nine systems. Then, when we got into capture, the *Intent Engine*: the system assembles everything it already knows and the trader confirms, rather than the trader filling out a form. Provenance on every field (where did this fact come from). Value at three speeds — now, after this trade, over time. Playbooks *derived* from labeled trades, not declared in onboarding. And two corrections aimed at v0: it had blurred *company*, *wedge* and *test environment* into one sentence, and its single kill criterion let one capture method failing kill the whole thesis. Both fair.

**v0 challenged** — starting with itself. It had proposed a "Mentor's Ledger": you and "your students" as the first cohort, mentors as the first customer. That was built on a wrong assumption about you and on the shape of our code (orgs, memberships, mentors tables) rather than on any market evidence. It withdrew it and logged it as rejected. Then it went after ChatGPT:

- **The order is not the intention.** "The system knows 90% before the trader types" is true by field count and false by value. Entry, stop, target, size are the commodity fields every journal already imports. Setup, thesis, invalidation — the scarce fields — never come from a broker. Two traders place identical bracket orders for opposite reasons. A stop is a price; an invalidation is a *condition*.
- **Zero-friction capture is a platform product.** "Place + Lock" needs us to be the order UI or to have TradeLocker write access — at which point we're a TradeLocker plugin, and TradeLocker is the natural builder. Design as if Owen says no.
- **"AI infers your setup with 87% confidence" is fiction at v0.** It needs months of *that trader's* own labels. And confirm-fatigue launders AI guesses into "declared" — people just tap Yes.
- **The retention gap is weeks 1–4 and nobody has solved it** — not ChatGPT, not v0, not us. More on this in §7.
- **One number keeps the dataset honest:** the time between when the plan was locked and when the order filled. Post-outcome "plans" are journal entries and never count as intent.
- **Nobody on this team lives in the ten seconds before entry.** You don't trade day to day. Whether I do seriously is unstated. A capture surface for a moment neither of us lives in daily can't be designed from the outside.

**What survived both:**

1. The loop — PLAN → TRADE → COMPARE → REVIEW → LEARN — as the organizing idea. **VISION.**
2. Intention captured *before* the outcome as the scarce data. **HYPOTHESIS.**
3. System assembles, trader confirms — with a realistic floor of one tap + one optional line. **HYPOTHESIS about the design.**
4. Provenance on every field. **DECISION-ready.**
5. Value at three speeds, and the honest admission that speeds one and two are the unsolved part. **UNKNOWN.**
6. Intelligence is earned from real records, never claimed before them. **Principle.**
7. Agents and creator intelligence are sequenced, not killed. **VISION.**
8. Keep the existing product; reconnect it; rebuild nothing. **DECISION-ready.**
9. Three Grok brains working one problem. Founders decide. **DECISION-ready.**

## 5. Intent capture — the first real product problem

The question is *not* "how do we make traders fill out a journal before every trade." That probably fails and every journaling product's history says so.

The question is: **how can ARCHIO understand what a trader intends before the outcome, with almost no extra work from the trader?**

Checkout analogy. Every extra button tightens the funnel. A ten-field form before entry is a checkout with ten pages.

What the system could eventually know without asking: instrument, long/short, size, entry, stop, target, risk %, time, session, account, market conditions. *Could* — today it knows none of it, because we have no broker feed. First version gets this from a CSV import, then a read-only broker connection.

What only the human can contribute: **which setup, why now, what would make this wrong.**

Ways to get that, roughly from least to most effort for the trader: a session plan once per morning that every trade inherits ("only setups A and B today, max 0.5%, done by 11:30"); one-tap setup pick; saved playbooks; one quick line the AI structures; voice; TradingView alert webhooks (the only true zero-extra-effort path that needs no broker deal); pending-order watch; hotkey in the Live Room; eventually a TradeLocker integration; eventually execution through ARCHIO itself.

We do **not** know which one wins. The ranked list with what each costs and what each would prove is in `03-intent-capture-position.md`. The realistic design target we should freeze tonight: **one tap + optional one line.** Promise nothing below that until a real trader shows us it's possible.

## 6. Decision Records, provenance and the Trader Model — in plain English

**Decision Record.** One row per trade idea. What you intended, when you committed to it, what actually happened. Fields: instrument, direction, setup, thesis (one line), invalidation (the condition that makes you wrong), entry/stop/target, risk %, which rules you checked, optional 1–5 how-you-feel, when you locked it, a snapshot of the market at that moment, and a link to the outcome once it exists. The lock is just a timestamp that can't be edited afterward. That timestamp is the whole point — it's what separates *intention* from *hindsight*.

**Why the timestamp matters.** If the record was locked before the fill, it's real intent. If it was written after the trade closed, it's a journal entry — useful, but every journal already has those, and it never counts toward adherence. We publish that number next to every insight so we can never fool ourselves.

**Provenance.** Every piece of information carries a label saying where it came from:

- **OBSERVED** — the broker told us you entered at 1.0842.
- **DECLARED** — you told us this was a breakout.
- **INFERRED** — the AI thinks this looks like a liquidity sweep.
- **DEFAULTED** — your saved strategy normally risks 0.5%, so we assumed it.

Why it matters: we cannot build a model of a trader that treats an AI guess as if the trader said it. The Trader Model asserts things only from OBSERVED and DECLARED. INFERRED suggests. DEFAULTED counts once at the session level. Agents inherit the same rule. This is boring infrastructure and it's the difference between an AI that "understands you" and one that hallucinates you.

**Trader Model, version zero.** Not machine learning. Six numbers computed with plain SQL over the records: plan rate (how often you planned before entering), adherence rate (how often the trade matched the plan), deviation mix (what kind of breaks — size, early exit, moved stop, chased), expectancy per setup, time-of-day pattern, and an impulse flag (trades with no record, or a record locked after the fill). If those six numbers move for real traders within 30 days, the model is real and we earn the right to add intelligence. If nobody creates records, no amount of ML would have saved it.

## 7. Value at three speeds — and the gap nobody has solved

- **NOW** — before or during the trade, something useful immediately.
- **AFTER THIS TRADE** — planned vs actual, in one glance.
- **OVER TIME** — patterns the trader can't see themselves. This is where the Trader Model and personal AI become powerful.

Here's the honest problem. Speed three is the moat and needs 40+ records — a month or more. Speed one, today, is risk % and reward-to-risk, which is already on every broker ticket. Speed two, planned vs actual on one trade, TradeZella half-has. So for roughly a month we would be offering commodity value and asking for above-commodity effort.

Two bridges that might hold, neither proven: a **human-written review** for the first handful of traders (you, Kan, writing three sentences a night that cite the trader's own rule and their own number — before any LLM touches it), and the **Coverage Split** — planned vs unplanned trades on the *same* account. If planned trades outperform, the trader sees the point in their own P&L. If they don't, the product has honestly told them planning doesn't help them — which is also our kill signal. Either way we learn.

Nobody has cracked weeks 1–4. Not ChatGPT, not v0, not us. It's the thing the Red Team brain should be attacking first.

## 8. How what you built fits

This is the section I care most about you reading, because it's where "start over" is the wrong conclusion.

- **Flight Deck / the cockpit** — stays the surface where everything meets. It is not the moat; the intelligence underneath it is. **Freeze it** — don't add pages to it while we test the loop. The loop ships on one new page.
- **Live Room** — its event ledger is already the closest thing in our code to a decision log: append-only, timestamped, derived views. It's the natural place for a hotkey capture during a live session. **Keep and connect.**
- **Forecast** — a forecast *is* a public Decision Record: thesis, invalidation, timestamp, outcome. Same object, visibility set to public. **Keep and reframe.**
- **Execution copilot's trade-plan panel** — already the right shape (instrument, direction, entry, stop, target, reasoning). It just doesn't write anywhere yet. **Connect it** to the record.
- **Psychology / Trading DNA** — becomes views over records instead of a page: "you're trying to size up after three losses" only means something when there are records to compute it from. **Merge into the model.**
- **Journal** — mostly generated from plan + fills. Note: TradeZella already auto-journals from imports, so this is table stakes, not moat. **Merge.**
- **Market intelligence** — becomes the market snapshot stamped on each record (we already have Polygon). Context for *this* decision, not a separate feed. **Connect.**
- **Education / Student Hub** — appears when the system sees a repeated weakness. Needs records first. **Defer.**
- **Community / Social feed** — shares reasoning and process, not screenshots and P&L. Needs records first. **Defer.**
- **Agents** — see §9. **Defer, sequenced.**
- **Net Worth / Portfolio / leaderboards / marketplace / the 9-card landing / QClay's full scope** — **defer.**
- **Orgs, memberships, invites, rooms, mentors** — real, working plumbing. It's a *possible* later market (cohorts, educators), not a decision and not evidence. It stays; it doesn't steer.

**Rebuild: nothing.** Rebuilding is the trap we'd fall into with a new thesis. **Missing foundation:** three tables, a matcher that pairs records with fills, and a 20-second capture. That's it.

## 9. Agents and creator intelligence — kept, in order

**Agents.** I still think this could be enormous. Planning, Risk, Psychology, Market Intelligence, Execution, Monitoring, Review, Coaching — each with a real job, sharing one understanding of the trader, chained into workflows. But agents need real jobs, real data, real context and real user problems, or they're fancy chatbots. Right now they'd have nothing to read. So version zero has exactly **one** LLM call: the review. Plain software judges the deviation (it's arithmetic — don't ask an AI to guess it); the model phrases three sentences citing the rule and the number, and asks one question. Agents never place orders in v1 or v2. Execution isn't connected today — the Owen deck already says so, honestly — and it stays a read-only ask until there's evidence.

**Creator / expert intelligence.** One day a proven trader turns their setups, confirmations, invalidations, risk rules and review method into usable intelligence inside ARCHIO. Then instead of buying signals, a course, a Discord or a copy feed, a user accesses that person's *framework* — and ARCHIO combines **expert framework + current market + the user's own Trader Model** into personalized decision support. That could become a marketplace for trading intelligence. Invo and Fomo prove the "pay creators" half is real and funded. The "intelligence, not signals" half is unproven and cannot exist before Trader Models exist. **Long-term. Sequenced. Not tonight.**

## 10. How we need to think as founders

We both think big. You turn ideas into screens faster than anyone I know; I expand the vision every week. That's an asset. It also produces more pages, more features, more architecture, without proving what a trader values. Neither of us gets to blame the other for that — we've been doing it together.

The shift I want us to make:

- Instead of **"that would be sick"** → **"what problem does this solve, for whom, how often?"**
- Instead of **"nobody has this"** → **"who has tried it, and what are they missing?"** (We said "nobody has this" about five things that ten companies have.)
- Instead of **"build it"** → **"what is the smallest version that tells us if it deserves to exist?"**
- Instead of **"AI can do this"** → **"should AI do this, or should normal software do it reliably?"** Risk is arithmetic. Deviation is arithmetic. Interpretation is AI.
- Instead of **"we already built it so we need it"** → **"does it still strengthen the system?"**
- Instead of **"new thesis, rebuild everything"** → **"what existing work reconnects to the stronger architecture?"**
- Instead of **"we need to know the whole future"** → **"what do we need to know to make the next correct decision?"**

And the one that's hardest for both of us: getting comfortable saying **"we don't know yet"** — and then designing how to find out, instead of designing around it.

This doesn't mean building boring things forever. It means each layer earns permission for the next.

## 11. What we don't know, and where this leaves us

**UNKNOWN — and we should say so out loud:**

- Who the first five to ten real traders are, and how we reach them.
- Whether traders will record intent voluntarily at one tap + one line.
- Whether the first review is good enough to earn the second record.
- Which capture mechanism wins.
- Whether TradeLocker will give us read-only order history including pending/bracket orders.
- Whether the solo trader or a cohort/educator is the better first market (B2C is **not** rejected; it's untested).
- What we tell QClay.
- Whether I trade seriously from Monday.

**Where this leaves us:**

- **VISION** — an intelligent trading OS around the trader's decisions. Unchanged.
- **HYPOTHESIS** — intent captured before the outcome, compared and reviewed, is valuable enough that traders keep doing it. The company rests on this one.
- **EXPERIMENT** — the smallest thing that tests capture, value and return with real traders. Manual first if we have to.
- **DECISIONS** — a short list for tonight, in `06-tonight-working-session.md`.
- **UNKNOWN** — the list above.

The first loop we have to earn is **PLAN → LOCK → TRADE → COMPARE → REVIEW → LEARN**, and the product challenge is making PLAN/LOCK almost invisible. If that works and traders get value, the Trader Model becomes real. Then personal AI becomes real. Then agents. Then workflows. Then creator intelligence becomes believable. Then maybe the marketplace.

We aren't abandoning the vision. We're finally putting it in order.

---

## Appendix — fact-check flags (from v0, against the repo and source-of-truth; not in Luke's voice)

These are places where the ChatGPT draft to Kan, or the brief for this memo, drifts from what the code and the documents actually say. The direction is unaffected; the tense and certainty are.

1. **"ARCHIO or the broker can already know: instrument, long/short, entry, stop, target, size, risk…"** — Today the repo has **no broker connection and no trade table**. Nothing about a trader's orders is known. Polygon market data exists; account data does not. Correct tense: "will be able to know once we import a CSV, then connect a read-only broker feed."
2. **Agent workflow ending in "Trader confirms → Execution happens"** — Source-of-truth (00 §6, 03) states agents never place orders in v1/v2, and the Owen deck states execution is not connected. Keep as VISION; do not present as the near-term loop.
3. **"System assembles → human confirms" presented as settled** — 03 records the counter-argument: the scarce fields (setup, thesis, invalidation) never come from a broker; floor is one tap + optional line; zero-friction "Place + Lock" is a platform product that depends on TradeLocker write access. Both positions should be visible to Kan.
4. **"Journal writes itself"** — true in direction, but TradeZella already auto-journals from imports. It's table stakes, not differentiation.
5. **"Before trade: ARCHIO makes something easier/better immediately"** — listed as success criteria in the draft; nobody has actually named what that immediate value is beyond R:R/risk %, which every ticket shows. Logged as UNKNOWN (05 §7), not solved.
6. **Naming** — RESOLVED. The product is **ARCHIO** (DL-007, Luke 17 Sep). "Trading Pilot" was a label one ChatGPT thread drifted into and was carried into the email/prompt; it was never a candidate. QClay's assets stand as named.
7. **Grok "Architect" brain** — it cannot read the repo. It works from the audit facts in 00 §7–8 and 03. Actual code-level checks remain v0's job; do not let the Architect brain assert what is or isn't in the codebase.
8. **Kan's status** — the docs are consistent that Kan has no students and does not trade actively. Nothing in the deliverables implies otherwise; the ChatGPT draft is also clean on this.


---

<!-- FILE: 06-tonight-working-session.md -->

# Tonight's working session — Luke + Kan

*17 September 2026. Two pages. Practical only. Time-box the whole thing to about two hours; the bots can keep working after you sleep.*

---

## A. What to discuss first (30 min, before any bots)

1. Does the loop — PLAN → TRADE → COMPARE → REVIEW → LEARN — make sense to both of us as the thing underneath every page? If not, where exactly does it break?
2. Kan: what in the 5-minute version is *wrong*? Name at least three things. You know the product better than the two AIs combined.
3. Which existing pages suddenly make **more** sense under this model? (My list: Live Room, Forecast, execution trade-plan, Psychology. Yours?)
4. Which things are we currently building because they look impressive, not because a trader asked for them?
5. What should a trader get in the first 30 seconds of using ARCHIO?
6. What is the smallest pre-trade interaction each of us would personally tolerate on a fast market open? (One tap? One line? Voice? Nothing?)
7. Where should AI help, and where should plain software do the job reliably?
8. What would have to happen for us to abandon the intention-capture idea? Say it now, before data exists.
9. What would make us believe we're onto something? Same — say it now.

## B. Decisions to make tonight (mark each ACCEPT / REJECT / OPEN)

| # | Decision | Ledger ref |
|---|---|---|
| 1 | The loop is our organizing VISION. Every feature answers "which step of the loop does this serve?" — *Kan sent his own version of the ladder unprompted (DL-016); accept the amended chain in `10` §4 or edit it, then mark.* | DL-001, DL-016 |
| 2 | Intent capture (with immediate value + voluntary return) is problem #1. Nothing else is built until it's tested. | DL-009 |
| 3 | Decision Record v0 fields are frozen: instrument · direction · setup · thesis ≤ 280 · invalidation · entry/stop/target · risk % · rules checked · optional 1–5 state · locked_at (immutable) · market snapshot · outcome link. | DL-001, DL-013 |
| 4 | Capture design target is **one tap + optional one line**. Promise nothing below it. | DL-012 |
| 5 | Every field carries provenance: observed / declared / inferred / defaulted. | DL-011 |
| 6 | Three Grok brains, not eleven. Founders decide; bots propose. | DL-006 |
| 7 | Existing product: freeze the shell, connect the loop, rebuild nothing. | DL-004 |
| 8 | Name is **ARCHIO** — already decided (DL-007). Not on tonight's agenda; QClay assets stand. | DL-007 |
| 9 | QClay: send three lines — testing a bounded loop first; bounded brief or clean stop by a named date. | DL-005 |
| 10 | Who owns recruiting the first ten traders, by when. | DL-009 |
| 11 | Does Luke trade live, small, daily from Monday? Yes / no. If no, who on the team is the user? | DL-010 |

## C. What stays OPEN (do not decide tonight)

Which capture mechanism wins · first test population · B2C vs cohort/educator as first market · broker integration path (until Owen answers) · pricing · agent roster · marketplace · which existing pages retire · QClay's long-term role.

## D. How to create the three Grok brains (20 min)

Three **separate** Grok conversations (or Projects/Workspaces if your plan has them). Each gets one standing instruction as its first message and the **same** documents attached. Never merge them into one chat.

**Brain 1 — TRUTH KEEPER (Product / Truth)**
> You are the Truth Keeper for ARCHIO (the product is named ARCHIO; "Trading Pilot" is a retired label — correct it wherever it appears). You maintain one coherent account of: KNOWN facts, BELIEVED claims, HYPOTHESES under test, EXPERIMENTS, founder DECISIONS (with status), REJECTED ideas (with why), and OPEN questions. You label every statement with exactly one of those. You never invent facts about the product, the market, or the founders. When a new idea arrives you say which existing entry it changes, contradicts, or duplicates, and you refuse to restate the company thesis until the founders record a decision. You are the guard against changing the company every time an AI gives an interesting answer. Your outputs are short, labeled, and cite the source document by name.

**Brain 2 — RED TEAM (Research / Challenge)**
> You are the Red Team for ARCHIO. Your job is to be wrong-proof, not agreeable. For every claim you receive you ask: who already does this (name them); why would a trader care; where is the friction; what are we assuming; what kills it; how would we test it cheaply; what evidence would change the founders' minds. You prefer named competitors, real user behaviour and dated sources over opinion. You never soften a finding to be polite and you never propose features. You end every response with the single cheapest experiment that would settle the argument.

**Brain 3 — ARCHITECT (Prototype)**
> **[SUPERSEDED — use the prompts in `09-bot-context-packs.md` §4. Bot 1 is renamed Product Brain; the line count below is wrong (337k, not 48k); `copilot_events` exists. Kept for history only.]**
>
> You are the Architect for ARCHIO. Once the founders approve a hypothesis or experiment, you find the smallest clean way to test it using the existing platform: Next.js + Supabase (Postgres) + Stripe + Polygon market data, ~48k lines of dashboard UI, working auth/orgs/memberships/rooms, and NO trade/plan/decision tables or broker connection today. You state what to reuse, what to add, what NOT to build yet, and how to avoid architecture that blocks later expansion. You cannot read the code; you work from the audit in the documents and you say so. You never propose more than the approved experiment needs. Output: tables, one page, one integration — nothing else.

## E. What each brain receives

**All three:** `00-founder-synthesis-2026-09-17.md` · `01-decision-ledger.md` · `02-revision-2026-09-17-kan-correction.md` · `03-intent-capture-position.md` · `04-kan-5-minute-version.md` · `05-founder-memo.md` · this file.

**Truth Keeper additionally:** Luke's partner email; the 54-section prompt (as history, labeled LEGACY where superseded). It owns `01-decision-ledger.md` from tonight — every founder decision gets entered there by Truth Keeper, status included.

**Red Team additionally:** the competitor list from `00` §3 with the instruction to *extend and date* it.

**Architect additionally:** `00` §6 (object schemas), §7–8 (repo audit and existing-work classification); the names of the two components that matter: the execution copilot's trade-plan panel and the Live Room's `SessionEvent` ledger. Tell it plainly: **v0 is your eyes on the repo — anything code-level gets verified there.**

## F. First assignment — one problem, three angles

The problem, verbatim, to all three:

> *How can ARCHIO understand what a trader intends to do before a trade with almost no additional effort from the trader, and provide enough immediate value that the trader wants to do it again?*

- **Truth Keeper:** produce a **one-page** statement of this hypothesis — what we know, what we believe, what we're assuming, what we've already rejected, what's open. Then list every contradiction between the seven documents. Nothing else.
- **Red Team:** attack two claims: (1) "the order is the intention" (that broker data gets us most of the way), and (2) "traders will voluntarily record intent." Name every product that has tried pre-trade capture and what happened to it. End with the cheapest test.
- **Architect:** using only what exists, propose the three tables, the one page (Plan / Today / Review), the CSV import, and the provenance shape. List what must **not** be touched. No code tonight — a plan we can read in five minutes.

## G. How the three interact

Sequential relay, carried by you two. No bot talks to another directly.

1. Truth Keeper proposes (one page).
2. You paste it to Red Team. Red Team attacks.
3. You paste the attack back to Truth Keeper. It revises and marks what changed.
4. You paste the surviving version to Architect. It translates into the smallest build.
5. Every output must carry labels (KNOWN / BELIEVED / HYPOTHESIS / …). Unlabeled output goes back.

One round tonight. Not three.

## H. When Luke and Kan step in

After one full round (propose → attack → revise → translate) you two read all four outputs together and make **one** call: which capture experiment runs first, and with whom. Truth Keeper records it in the ledger with a status and a kill criterion. Anything a bot "decides" that isn't in the ledger is void. Bots have no decision authority — tonight or ever.

## I. What NOT to build tonight

No tables. No pages. No agents. No eleven brains. No dashboard redesign. No landing page changes. No marketplace design. No QClay scope work. No new Grok "departments." No Trader Model ML. No prompt engineering for plan capture. If it's not on the list in B, it waits.

## J. What counts as a successful night

- Kan has read the 5-minute version and pushed back on at least three things — in writing, so Truth Keeper can log them.
- Both of you agree on B1 and B2, **or** have a written disagreement with what evidence would settle it.
- Every row in B is marked ACCEPT / REJECT / OPEN in the ledger.
- Three brains exist with their instructions and documents loaded; first assignments sent.
- The ten-names list is started — or the honest finding that it can't be filled is written down.
- Name decided. QClay reply drafted. Luke's Monday answered.
- Nobody wrote code. Nobody added a feature. Both of you can say in one sentence what we're testing next.

Then close the laptops. The next artefact that makes anything clearer is the list of names, not another document.


---

<!-- FILE: 07-grok-grounding-2026-09-17.md -->

# Grok bot setup — grounding verification against the real ARCHIO project

*17 September 2026. v0 acting strictly as the grounding/verification layer. No thesis reopened, no redesign, no code. Answers the 14 questions in ChatGPT's brief, then A–E.*

**Two corrections to the record first** (they would otherwise be inherited by every bot):

1. **Line count.** Every document this week says "~48,000 lines of UI." Wrong. That figure is the *two files* of the Vantary dashboard (`your-space.tsx` 33,482 + `vantary-modules.tsx` 14,882). The codebase is **337,512 lines of TS/TSX across 819 files** (`components/` alone 319,725). The argument does not change — there are still zero trade/plan/decision tables — but the number is off by 7× and Kan knows his own repo. Fixed in 00, 04, 05.
2. **A persisted event log already exists.** `public.copilot_events` (`scripts/copilot-tables.sql`): `id, type, ts, session_id, user_id, context jsonb, data jsonb`, RLS enabled. It is the closest thing in the *database* to a decision ledger. The Live Room's `SessionEvent` ledger I kept citing is **client-side state only** (`components/live-room/session-store.tsx`, no persistence). The Architect must know both. Note the RLS policy `"anyone can insert events" with check (true)` — an open insert path that must be closed before real traders touch it.

---

## The 14 questions

### 1. Is the division of responsibility sensible given what ARCHIO contains today?

Yes, with one structural change (Q10/B). The product today is a 337k-line interactive prototype with three real subsystems (auth/orgs/Stripe skeleton, a grounded AI response engine on real Polygon data, an event-log table) and **no persisted trading loop**. That is exactly the situation where a proposing brain, an attacking brain and a smallest-prototype brain are useful — and where a code-reality layer (v0) is indispensable, because 90% of what the eye sees is mock and a bot reading screenshots or docs will believe it is real.

The workflow order is right: propose → attack → design smallest → v0 verifies against code → founders decide → only then implement.

### 2. What Grok should own that v0 should not

- Hypothesis formation and ranking (what to test, for whom, why now).
- External research: competitors, funding, behaviour science, regulatory lines. v0 can search too, but Grok is where the *ongoing* research memory should live.
- Structured disagreement: attack surfaces, failure modes, pre-mortems.
- Prototype *design* as a spec: objects, fields, flows, success/kill criteria, what to measure.
- Founder-facing drafts: memos, briefs, the Owen ask, the QClay reply.
- Keeping proposals labelled and dated.

### 3. What v0 must own that Grok must not pretend to know

- **What exists in the repo** — files, routes, tables, RLS, env, what is mock vs real. Grok has no repo access and must never assert "the app already has X."
- **Whether an Architect spec is buildable in this codebase** — which existing component connects, what breaks, migration paths.
- **Schema and code changes** — the only writer of code and SQL.
- **Verification notes** into the source-of-truth (Q12).
- **Security posture** — env vars, keys, RLS, exposure.
- **Line counts, table lists, route lists** — any number about the codebase.

### 4. Source-of-truth files ALL three bots receive

- `01-decision-ledger.md` — the record. Every bot must read it before proposing, and cite entry IDs.
- `02-revision-2026-09-17-kan-correction.md` — the vision/wedge/test-environment split, per-hypothesis kill criteria, earned-complexity chain, and the fact that Kan has no students and does not trade.
- `03-intent-capture-position.md` — the ranked capture mechanisms and the "order ≠ intention" argument. Without it every bot re-derives the Intent Engine debate.
- `08-architect-repo-facts.md` — the one-page repo reality (all bots, so none of them imagines features that don't exist).

### 5. Files only certain bots receive

| File | Product | Red Team | Architect | Why |
|---|---|---|---|---|
| `00-founder-synthesis` §1–4, §7–8 | yes | yes | §7–8 only | market research + existing-work classification; §5 Thesis F is superseded, tell them |
| `05-founder-memo` | yes | yes | no | tone, vision layers, how founders want to think; Architect doesn't need narrative |
| `06-tonight-working-session` | yes | no | no | the decision agenda; Red Team should not know what founders want to hear |
| `docs/current-state-audit.md` (Aug 16) | no | summary only | **yes** | the real technical audit with file:line evidence |
| Competitor research citations (00 §3) | yes | **yes** | no | Red Team must verify/extend them, not trust them |
| `04-kan-5-minute-version` | no | no | no | private founder communication |

### 6. Context in this v0 project NOT captured in the source-of-truth (would be lost)

**Yes — six items. Document before creating the bots:**

1. **The Aug 16 technical audit** (`docs/current-state-audit.md`) — the only evidence-cited account of what's real. Not referenced from source-of-truth until now. → Hand to Architect; summarised in 08.
2. **`copilot_events` table + `/api/archio` response engine** — real infrastructure the Architect should reuse (event log, grounded-prompt pattern, Polygon snapshot fetch, schema-validated JSON envelope). → In 08.
3. **Naming canon** (v0 memory, `archio-mvp-verdict`): Flight Deck · Community · AI Agent Marketplace · Decision Desk · Trading DNA · Net Worth · Portfolio · AI Verified Track Record · Social Network; daily rituals Morning Brief / Trade Review / Catch Me Up / What If / Ask Archio; dead names (all aviation names, My Rules, Mentors, Home Base). → In 09 as a glossary so bots don't invent new names.
4. **Owen/TradeLocker relationship state** (`docs/owen-call-briefing*.md`, `/owen` deck): the "we don't touch the trade" reframe, never "sixth-tab killer," the three-questions ask. The single new ask (read-only order history incl. pending/bracket orders) is in 03 but the relationship rules are not. → One paragraph in 09.
5. **QClay state**: $35k design + $300–350k, 12 months, AI excluded, three unanswered technical questions, silent since 31 Aug; logo approved 13 Aug as ARCHIO. → In 09 for Product bot only. **Do not export the Telegram log** (third-party PII and commercial terms).
6. **~50 legacy docs in `docs/`** (masterplans, blueprints, investor decks, autopsies) that **contradict each other and the source-of-truth**. Bots must be told these exist and are archaeology. → Rule in 09: legacy docs are inputs to archaeology only, never evidence of current direction.

Also: v0's own memory files (`archio-response-engine-masterplan`, `archio-ecosystem-masterplan`, `archio-flight-deck`, `archio-live-room`, `archio-owen-*`) hold months of design canon. They stay in v0 (D). Anything a bot needs from them gets exported on request as a dated note, not wholesale.

### 7. Factual repo summary for the Architect

Written as `08-architect-repo-facts.md` — paste-ready, one page, file paths included, mock/real labelled.

### 8. What the Product bot should know about the existing product

Ten lines, no code:

- ARCHIO is a large interactive prototype. Real: login, orgs/rooms/memberships/invites, Stripe checkout skeleton, an AI endpoint grounded in real market data, an event-log table. **Not real: any trade, plan, decision, rule, journal, forecast or trader model.** The journal the AI analyses is a labelled demo book.
- Nine named systems exist as designs (glossary in 09). Do not invent a tenth.
- Two pitch decks (`/pitch`, `/owen`) state honestly that execution is not connected. Keep it that way.
- The Forecast feature is conceptually a public Decision Record; the execution-copilot trade-plan panel is already the right shape; the Live Room has a client-side event ledger. These are *connect* candidates, not new builds.
- There is no broker connection. CSV import then read-only API is the path.
- Kan does not trade or have students. Whether Luke trades is unstated. No user is on the team.
- Name is ARCHIO (DL-007, DECIDED).

### 9. What the Red Team should know to challenge fairly

Everything in Q8, plus:

- The competitor list and dates in 00 §3 came from v0 web search on 17 Sep — **verify and extend; do not trust.**
- The repo's org/mentor plumbing led v0 to a wrong "sell to mentors" conclusion (02). Architecture is not evidence of demand — attack any proposal that leans on it.
- The three unsolved problems every prior document dodged: (a) weeks 1–4 value before the model has data; (b) voluntary capture floor; (c) who the first traders are. If a proposal doesn't address these, that's the attack.
- The rejected-ideas table in 01 — attack any proposal that re-imports a rejected idea under a new name.

### 10. Where the setup duplicates work or creates conflicting truth

1. **"Truth Keeper" vs "Product/Truth."** My 06 defined bot 1 as a passive guardian of the record; ChatGPT's brief defines it as the *proposer*. A proposer that also guards the truth has a conflict of interest. → Resolve: bot 1 is the **Product Brain** (proposer), bound by the ledger; **the git folder is the truth**, kept by founders; v0 runs consistency checks. No fourth bot.
2. **ChatGPT is the shadow fourth brain.** It has produced more strategy than all three bots will this month and none of it is logged. → Define its role (DL-015): Luke's drafting assistant. Nothing it says enters the ledger unless a founder commits it.
3. **Architect vs v0 on architecture.** Both will describe "the system." → Architect writes *specs* (what/why/fields/measures); v0 writes *implementation notes* (how/where/what breaks). Different documents, different owners.
4. **Red Team vs Product both researching competitors.** → Product cites; Red Team verifies. Only Red Team's research enters the record.
5. **Legacy `docs/` vs `docs/source-of-truth/`.** Fifty documents say different things. → Only `source-of-truth/` is authoritative; the rest is labelled archaeology in 09.
6. **Two copies of the bot prompts** (06 §D and 09). → 06 §D now points to 09.

### 11. Rules so proposals never silently become decisions or code

1. Every bot output ends with `Status: PROPOSED — requires founder decision (Luke + Kan)`. No exceptions.
2. Only a founder changes a ledger status. Bots may *draft* a ledger entry; a human commits it.
3. No bot writes to git, the repo, Supabase or any env. Bots produce text. Humans move text.
4. Every proposal cites the ledger entries it depends on and flags any DECIDED entry it contradicts.
5. Any claim about the codebase must cite a file path **from 08 or a v0 verification note**. Unverified code claims are marked `UNVERIFIED` by the bot itself.
6. "Nobody does this" requires a named search and date, or it's marked BELIEVED.
7. A bot may not cite another bot as evidence.
8. Rejected ideas go into the rejected table with the reason; re-proposing one requires stating what changed.
9. Every bot session is time-boxed and ends with ≤ 5 bullets a founder can accept or reject. No 1,000-line outputs.
10. Grok recommends; v0 verifies; founders decide; v0 implements only after a DECIDED ledger entry.

### 12. How information flows back from v0 to the bots

- After verifying an Architect spec, v0 writes `docs/source-of-truth/verifications/YYYY-MM-DD-<topic>.md`: per claim → `VERIFIED` (file:line) / `CONTRADICTED` (what's actually there) / `UNVERIFIABLE` / `BUILDABLE-NOW` / `NEEDS-MIGRATION` / `SECURITY-FLAG`.
- Luke pastes the note into the Architect thread. Architect revises. Product/Red Team receive the note only if it changes the hypothesis.
- If v0 finds repo facts the bots lack, it updates 08 and bumps its date. Bots are told to prefer the newest 08.
- Nothing flows back through ChatGPT.

### 13. Access the bots must NOT have initially

- **No repo, no GitHub, no Vercel, no Supabase, no env vars, no API keys.** `.env*`, `docs/postman/env.json` (checked: only a `baseUrl`, but the pattern is the risk), Stripe/Polygon/Gemini/OpenAI keys — none of it.
- **No trader data or PII** — once cohort traders exist, bots receive aggregates and anonymised excerpts only.
- **No QClay Telegram log** — third-party names and commercial terms.
- **No `04-kan-5-minute-version`** or private founder messages.
- **No write path** to `docs/source-of-truth/` — proposals arrive as text; a founder commits.
- **No tool/browsing autonomy** that could post, email or message anyone on the founders' behalf.

### 14. Anything important missing before tonight?

1. **The ChatGPT role** (Q10.2). Undefined = the biggest drift source.
2. **A commit ritual.** Who physically edits `01-decision-ledger.md` when a decision is made tonight (Luke, via v0 or GitHub UI), and when (end of session, not mid-argument).
3. **The user problem** cannot be solved by bots. Item 10 on the agenda (ten names) is still the real bottleneck.
4. **The corrected line count** and the `copilot_events` fact must be in the bots' context from the first message (done — 08).
5. **A stop condition.** Each bot session ≤ 45 minutes, ends with ≤ 5 accept/reject bullets. Otherwise tonight becomes a fourth 1,000-line document.
6. **The Owen ask in one sentence** for the Architect: *read-only access to order history including pending and bracket orders, no execution.* Already in 03; must be in 09 so the Architect doesn't design for write access.
7. **The open RLS insert on `copilot_events`** — a SECURITY-FLAG for the Architect and a v0 fix before any real trader data lands.

---

## A. APPROVED AS-IS

- Three bots, not eleven.
- The workflow order: propose → attack → smallest prototype → v0 verifies → founders decide → implement.
- Grok = thinking · v0 = code reality · founders = decisions.
- One shared problem statement for all three (from 06 §E, renamed ARCHIO).
- The ledger as the single record; PROPOSED/DECIDED/REJECTED statuses.
- "Do not code" for the bots.
- Founder approval gates implementation.

## B. MODIFY BEFORE CREATING

1. Rename bot 1 **Product Brain** (proposer). Drop "Truth" from a proposer's title. The git folder is the truth.
2. Define **ChatGPT's role** explicitly: drafting assistant, outside the ledger (DL-015).
3. Fix the **48k line count** everywhere → 337k / 819 files (done in 00/04/05).
4. Give all bots **08 (repo facts)** so none imagines features.
5. Tell all bots the **legacy `docs/` are archaeology**, not direction.
6. Add the **stop condition** and the **≤ 5-bullet ending** to every prompt.
7. Add the **Owen ask** (read-only, incl. pending/bracket orders) and the **copilot_events** fact to the Architect prompt.
8. Add **rule 5** (code claims must cite 08 or a verification note) to every prompt.

## C. CONTEXT TO EXPORT (paste into Grok, in this order)

**All three:** `01` · `02` · `03` · `08` · glossary + governance rules from `09`.
**Product Brain adds:** `00` §1–4, §7–8 (with the Thesis F erratum) · `05` · `06` · QClay one-paragraph state (09).
**Red Team adds:** `00` §1–4 (as claims to verify) · `05` · the three unsolved problems (09).
**Architect adds:** `docs/current-state-audit.md` (Aug 16) · `00` §6 object schemas · Owen ask · SECURITY-FLAG on `copilot_events`.

Do **not** export: `04`, the QClay Telegram log, any `.env`, `docs/postman/*`, v0 memory files, the 50 legacy docs.

## D. KEEP IN V0

- Repo, schema, RLS, env, keys — and every number about them.
- The v0 memory canon (response-engine, ecosystem, flight-deck, live-room, owen) — exported on request as dated notes.
- Implementation of anything DECIDED.
- Verification notes (Q12) and updates to 08.
- The consistency check between ledger and code before any build starts.
- Security fixes (start with the open insert policy).

## E. FINAL SETUP CHECKLIST — before creating Bot #1

- [ ] Read this file and 08 once. Confirm the two corrections don't change anything you already told Kan (they don't change direction; they change a number and add a table).
- [ ] Decide tonight's commit ritual: who edits the ledger, when.
- [ ] Copy the **governance rules** (09 §1) into a note you'll paste as the first message to every bot.
- [ ] Create **Product Brain** with the 09 prompt + its context pack. First task: one-page hypothesis in the five-layer format, citing ledger IDs, ≤ 5 bullets at the end.
- [ ] Create **Red Team** with the 09 prompt + its pack. First task: attack "the order is the intention" and the weeks-1–4 value gap; verify three competitor claims from 00 §3 with dates.
- [ ] Create **Architect** with the 09 prompt + its pack + the Aug 16 audit. First task: the three-table spec (decision_records / trades / decision_reviews) with provenance and lock_lead_seconds, **reusing `copilot_events` patterns**, flagging what needs v0 verification. Nothing else.
- [ ] Paste each bot's ≤ 5 bullets to v0 for a verification note before either founder acts on them.
- [ ] 45-minute cap per bot. Then close the windows and write the ten names.

*Status of this document: v0 verification, not a founder decision. Items in B become ledger entries only when a founder accepts them.*


---

<!-- FILE: 08-architect-repo-facts.md -->

# ARCHIO — repo facts for the bots (v0-verified, 17 Sep 2026 · one row corrected 20 Sep 2026, DL-019 · connect-candidate + legacy-audit lines corrected 20 Sep 2026, second session)

*Paste this into every Grok bot. It is the only authorised description of what exists in code. If a claim about the codebase is not here or in a dated v0 verification note, treat it as UNVERIFIED. Newest date wins.*

## Size and shape

- **337,512 lines** of TypeScript/TSX across **819 files** (`app/` 4,501 · `components/` 319,725 · `lib/` 12,717 · `hooks/` 569). The often-quoted "48k" is two dashboard files only.
- Next.js App Router · React · Tailwind · Supabase (Postgres + Auth + RLS) · Stripe · Polygon.io market data · AI SDK. Branch `v0/fxp1casso-52674d7b`.
- Largest files: `components/dashboard/vantary/your-space.tsx` (33,482), `vantary-modules.tsx` (14,882), `components/forecast-hub/forecast-detail-intelligence.tsx` (13,513). These are UI; they persist nothing about trading.

## REAL (persisted or server-verified)

| System | Where | Notes |
|---|---|---|
| Auth (signup/login/reset/session) | `app/api/auth/*`, `scripts/001_auth_schema.sql` | Supabase Auth, RLS on all tables |
| Orgs · rooms · memberships · invites · profiles | `app/api/orgs`, `rooms`, `memberships`, `invites/[token]`, `users/*` | Zod-validated, session-checked; tables referenced in code: `organizations, rooms, memberships, invites, profiles, groups, group_members` |
| Billing | `app/api/subscriptions/*`, `app/api/stripe/webhook` | Checkout from DB plans; webhook verifies signature; tables `plans, subscriptions` |
| Market data | `app/api/polygon/snapshot`, `polygon/bars`, `market/agg`, `market/candles`, `market/overlays` | Real Polygon.io, server-side |
| AI response engine | `app/api/archio/route.ts` | Deterministic routing → real Polygon snapshot + 48 hourly bars → grounded prompt that forbids inventing numbers → schema-validated streamed JSON envelope. **The journal it analyses is a labelled demo book** (`lib/response-engine/journal.ts`, `source: "demo-journal"`) |
| Event log (schema only — **dead table**) | `public.copilot_events` (`scripts/copilot-tables.sql`) | `id uuid, type text, ts bigint, session_id text, user_id uuid, context jsonb, data jsonb`. ~~Written from `app/api/copilot/chat`.~~ **[CORRECTED 20 Sep 2026, DL-019:** the table has **no writer**. The only insert is `lib/copilot/persist.ts` → `persistCopilotEvents`, whose sole call site in `components/copilot/CopilotProvider.tsx` (import line 6, `startFlushLoop` line 49) is commented out; `app/api/copilot/chat` is a keyword matcher that writes nothing; nothing reads the table. Its *shape* is reusable, the table is not live — `13` §3.2.**]** **SECURITY-FLAG:** RLS insert policy is `with check (true)` — anyone can insert; select policy also exposes `user_id IS NULL` rows to every authenticated user (`13` §7 S2, S3). Must be closed before real trader data. |
| Mentor notifications | `public.mentor_notifications` | `mentor_id, entry_id, from_user_id, kind, read` |

## NOT REAL (visual mock or client-side prototype — no persistence)

- **Any trade, plan, decision, rule, strategy, journal entry, forecast, or trader model.** No table exists for any of them. Confirmed by grep of every `.from('…')` call and every `.sql` file.
- Flight Deck telemetry, DNA/psychology analytics, community feeds, mentor dashboards, Catch Me Up, marketplace, leaderboards, Net Worth, Portfolio — all mock or demo state.
- **Broker connection: none.** No TradeLocker, no MT, no CSV import. The path is CSV import → read-only API.
- **Execution: not connected.** Both decks (`/pitch`, `/owen`) say so honestly.
- The Live Room `SessionEvent` ledger (`components/live-room/session-store.tsx`, `session-state.ts`) is **client state only** — append-only shape, derived lenses, but nothing is saved.

## CONNECT CANDIDATES (already the right shape; just don't write anywhere)

- `components/execution-copilot/copilot-trade-plan.tsx` — a trade-plan panel: instrument, direction, entry, stop, target, reasoning. Right shape for a Decision Record capture; no backend.
- `components/copilot/trade/TradeExecutionPanel.tsx` — execution UI, no backend.
- Forecast (`components/forecast-hub/*`, `create-forecast-*.tsx`) — conceptually a *public* Decision Record: thesis, invalidation, timestamp, outcome. No table.
- Live Room ledger — the natural place for a hotkey capture during a live session.
- ~~`copilot_events` — an existing append-only JSONB event table; the Decision Record pipeline can reuse its pattern (or write typed rows alongside it).~~ **[CORRECTED 20 Sep 2026, second founder session:** `copilot_events` is a **dormant / dead pattern, not an active persistence pipeline** — the writer in `lib/copilot/persist.ts` has one call site, commented out (`CopilotProvider.tsx` lines 6, 49); `app/api/copilot/chat` writes nothing; nothing reads the table. Only its *row shape* (`type/ts/session_id/user_id/context/data`) is a reference. Do not describe it as the event spine or as something to "extend"; anything built on it revives a dead table under fixed RLS policies (`13` §3.2, §7 S2/S3).**]**
- `/api/archio` — the grounded-prompt + schema-validated-envelope pattern is the right template for the single v0 LLM call (the review).

## What the smallest loop needs that does not exist

1. `decision_records` (with per-field provenance, `locked_at`, market snapshot, visibility).
2. `trades` (from CSV import first; later broker read-only).
3. `decision_reviews` (SQL-judged deviation + one LLM-phrased review).
4. A matcher pairing records ↔ fills; `lock_lead_seconds = first_fill_at − locked_at`.
5. One capture surface (one tap + optional line) on one new page — not inside the 33k-line dashboard.
6. Six SQL aggregates = Trader Model v0 (plan rate, adherence, deviation mix, setup expectancy, time pattern, impulse flag).

## Legacy documentation — read as archaeology only

`docs/` holds ~50 earlier documents (masterplans, blueprints, investor decks, an architecture autopsy, QClay inventories). They contradict each other and the source-of-truth. **Only `docs/source-of-truth/` is authoritative.** ~~The one legacy document the Architect should read is `docs/current-state-audit.md` (16 Aug 2026) — an evidence-cited technical audit whose conclusions still hold.~~ **[20 Sep 2026:** the 16 Aug audit is superseded for the Architect by `13-technical-backend-control-center.md` (from code, 20 Sep 2026 — tables, routes, F1–F15, S1–S10). The Architect receives a dated extract of `13` in its pack; the 16 Aug audit is archaeology.**]**

## Rules for using this file

- Cite paths from this file. Do not extrapolate to files not listed.
- If you need a fact not here, write `NEEDS-V0-VERIFICATION: <question>` and stop.
- This file is updated only by v0. Date at top is authoritative.


---

<!-- FILE: 09-bot-context-packs.md -->

# Grok bots — governance, glossary, context packs and system prompts

*17 September 2026; amended 19 September 2026 (DL-017: §2 company-scope line added, §3 adds `11` to every pack; **DL-018: `11` governs company scope AND the current work phase — §2 ladder boundary scoped, §3 note replaced, §4 first tasks re-set for the STRUCTURE → FLOWS phase, 17 Sep loop tasks parked not deleted**). **Re-set 20 September 2026, second founder session — PACK v3 for D1 (Front Door / Flight Deck):** §2 gains the D1 terminology lines; §3 packs become role-specific extracts (the 17/19 Sep lists are kept below as history); §4 marks the 19 Sep structural task COMPLETED (`15` exists, DL-019), writes each bot's D1 next task **which is NOT sent until a founder sends it**, keeps the 17 Sep loop tasks parked, and corrects two outdated lines (nine-system canon → `15`; `copilot_events` → dormant pattern). Supersedes `06-tonight-working-session.md` §D. Three bots. Paste §1 as the first message to every bot, then the bot's own prompt from §4, then its context pack from §3. **Bots propose / challenge / ground. Luke + Kan decide.***

## 1. Governance rules (paste to every bot, verbatim)

1. You are one of three advisory brains for ARCHIO. You **recommend**. You never decide. Every output ends with: `Status: PROPOSED — requires founder decision (Luke + Kan).`
2. The only record of decisions is `docs/source-of-truth/01-decision-ledger.md`. Only founders change a status. You may draft an entry; a human commits it.
3. You have no access to the repo, database, environment or any account, and you must not claim to. Any claim about the codebase must cite a path from `08-architect-repo-facts.md` or a dated v0 verification note. Otherwise mark it `UNVERIFIED`.
4. Cite the ledger IDs your proposal depends on. If you contradict a `DECIDED` entry, say so in the first line.
5. "Nobody does this" requires a named search and a date, or it is labelled `BELIEVED`.
6. You may not cite another bot as evidence.
7. Re-proposing an idea in the rejected table requires stating what changed.
8. Legacy documents in `docs/` (masterplans, blueprints, decks) are archaeology. They tell you what was once intended, never what is true now. Only `docs/source-of-truth/` is authoritative.
9. The product name is **ARCHIO**. "Trading Pilot" is a retired label; correct it wherever it appears.
10. Kan has no students and does not trade actively. Whether Luke trades is unstated. Do not assume a user exists on the team.
11. Sessions are time-boxed to 45 minutes. Your final message is **≤ 5 bullets** a founder can accept or reject. No 1,000-line outputs.
12. Label every claim: KNOWN (evidence) · BELIEVED (reasoned, unverified) · UNKNOWN. Label every proposal: VISION · HYPOTHESIS · EXPERIMENT · DECISION-READY.

## 2. Glossary (so nobody invents names)

**Company scope (founder-approved 19 Sep 2026 — `11`, DL-017, DECIDED):** ARCHIO is intended to become the connected environment around the trader's entire journey. The loop / ladder below is an important potential intelligence engine *inside* it, not the definition of the company. Named layers: **General ARCHIO Intelligence** (markets, instruments, sessions, events, news, risk, education, platform) and **Personal ARCHIO Intelligence** (the user's history, preferences, strategies, behaviour, goals, routines, accumulated ARCHIO history). **ARCHIO System Bible** = the structural blueprint the founders want before further page design or outside engineering (`11` §8; not yet written). Do not describe ARCHIO as "the system of record for trading intentions" — that wording is superseded (`11` Appendix A).
**Nine systems (design canon, mostly unbuilt):** Flight Deck (the cockpit surface) · Community · AI Agent Marketplace · Decision Desk · Trading DNA (Trader OS + Psychology combined; "Mind Check" inside) · Net Worth · Portfolio · AI Verified Track Record · Social Network (the feed, separate from Community). **[LEGACY NAMING LAYER since 20 Sep 2026 (DL-019): the current structural map is `15-structural-map-v1.md` — seven Level-1 systems (Flight Deck · Intent Loop / Decision experience · Market Experience · Education · Community & Opportunity · Ask Archio · Account / Money) and three Level-4 / VISION interfaces. Use these nine names only as aliases when reading older material (`14` §3.1); never as the structure.]**
**Daily rituals (design canon):** Morning Brief · Trade Review · Catch Me Up · What If · Ask Archio.
**Dead names:** all aviation names, My Rules, My System, Mentors, My Money, AI Team, Home Base, Trading Pilot.
**Loop objects (this week, source-of-truth):** Decision Record · lock (`locked_at`) · `lock_lead_seconds` · provenance (OBSERVED / DECLARED / INFERRED / DEFAULTED) · Trader Model v0 (six SQL aggregates) · Coverage Split (planned vs unplanned trades on the same account) · session plan · one-tap setup.
**The ladder (Kan, 17 Sep, amended in `10` §4):** CAPTURE → DECISION → ACTUAL TRADE → COMPARE → REVIEW → MEMORY → TRADER MODEL → { PERSONALISED AI → AGENTS → WORKFLOWS } ∥ { CREATOR INTELLIGENCE → MARKETPLACE }. We stand at node 0. When bots work *on the loop engine*, they work nodes 0–4 only; everything right of REVIEW is VISION. In the current STRUCTURE → FLOWS phase (DL-018) bots map **every** major system structurally — a node right of REVIEW may be *placed on the map* and its connections named, but it stays labelled VISION and is not designed in detail. Founder alignment on the ladder is context, never evidence.
**Current work phase (founder decision 19 Sep 2026 — DL-018, DECIDED):** `11` governs company scope *and* the current phase: **STRUCTURE → FLOWS → DATA/BACKEND → DETAILED PAGE DESIGN.** The working objective is to begin constructing the ARCHIO System Bible. The bots produce *inputs* to it (map → challenge → ground); no bot writes the System Bible itself, and no bot invents features — anything not already named by the founders (`11`), the design canon above, or `08` is labelled PROPOSAL and goes to the ledger.
**Current D1 terminology (20 Sep 2026, second session — DL-025 addendum, DL-026, DL-027, DL-029, DL-030):** the four Flight Deck categories MARKET FLOOR · THE STUDIO · MENTOR HALL · THE COLLECTIVE are **zones** (never "rooms" — room / channel belongs to Community, DL-020); the zone **model** is kept; ~~the zone **names and the placement of the 16 destinations are OPEN for Product Brain review**~~ → **22 Sep 2026 (DL-031, PROVISIONAL D1 DESIGN DIRECTION — Luke approves, Kan's asynchronous review pending; never quote as joint approval):** the surviving direction is **MARKET FLOOR · TRADING DESK · THE ACADEMY · THE COLLECTIVE** (TRADING DESK and THE ACADEMY explicitly reversible; the code still says THE STUDIO / MENTOR HALL; door mapping in `12` FD-NAV-001). Ask Archio, Nexus (absorption candidate, code kept), account chrome and Flight Deck customisation are **global chrome, not zone doors**; Marketplace is a FUTURE concept under THE COLLECTIVE, not a door; Centralized / Decentralized is FUTURE/VISION with UX OPEN — no literal toggle. The central workspace's visible name is **OPEN** — the founders' live terms are **Dashboard · Flight Deck · Command Center**; **"Your Space" and "Trading Terminal" are NOT authoritative** product names; these documents use "Flight Deck" as the `15` L1-1 handle only. **Signed-out = product-first exploration** (TradingView-like; identity asked for at the moment of need; never a login wall; never another user's private data; exact limits OPEN). **One destination after login and registration = the Dashboard / Flight Deck workspace** (routes unchanged). **Authentication vocabulary — five separate concepts, never merged:** authentication · device biometrics / passkeys · email / phone confirmation · KYC / identity verification · duplicate-account prevention / account integrity; the current face scan is **DEMO/SIMULATION**. **`copilot_events` is a dormant / dead pattern**, not an active persistence pipeline or event spine (`08`, `13` §3.2). **Ledger labels:** DECIDED · OPEN · FOUNDER DIRECTION · DEMO/SIMULATION · FUTURE/VISION — quote the label with the ID.
**People/partners:** Luke + Kan (founders) · Owen (TradeLocker; ask = read-only order history incl. pending/bracket orders, no execution; never say "sixth-tab killer") · QClay (design agency: $35k design + $300–350k build quoted, 12 months, AI excluded, silent since 31 Aug, logo approved 13 Aug as ARCHIO; three technical questions unanswered).
**Competitors (v0 search, 17 Sep — Red Team to verify):** TradeZella (background AI agents over imported trades, $35–99/mo) · TradingView (AI Chart Copilot Apr 2026; MCP server 16 Sep 2026) · TradeLocker AI Studio · rules-gate apps (TRADIS, TradeGate, EdgeFlo, XeanVI, PropSentinel, Risk Marshal, LockMyTrades, KhomaAPI, Meridian, TradingPlan) · Invo (15% creator share on copied trades) · Fomo ($75M at $550M, June 2026).

## 3. Context packs

### 3.1 Pack v3 — D1 Front Door / Flight Deck (20 Sep 2026, second session — CURRENT)

Built as **role-specific extracts**, not full copies of `12` / `13` / `14`: enough context to make each bot accurate without thousands of irrelevant lines. Published at `public/docs/grok/ARCHIO-GROK-STARTER-PACK/` (zip alongside). If this section and the published pack ever disagree, this section wins.

**All three receive (`00-COMMON/`, 8 files):** `09a-governance-rules.md` (this file §1 — paste first) · `09b-glossary.md` (this file §2, incl. the D1 terminology line) · `00-CURRENT-STATE-2026-09-20.md` (**new** — the current work phase, D1 status, the DECIDED / OPEN / FOUNDER DIRECTION / DEMO-SIMULATION / FUTURE-VISION tables for D1, terminology corrections and the superseded-map table; every bot must understand *bots propose / challenge / ground — Luke + Kan decide*) · `01-decision-ledger.md` (DL-001 … DL-030) · `11-founder-direction-2026-09-19.md` (company scope) · `15-structural-map-v1.md` (the single current structural map) · `08-architect-repo-facts.md` (the short anti-hallucination anchor: what is real vs mock — kept for every bot so governance rule 3 stays enforceable; corrected for `copilot_events`) · `README-source-of-truth-index.md`.

**Product Brain adds (`01-PRODUCT-BRAIN/`):** `SYSTEM-PROMPT-product-brain.md` · **`D1-PRODUCT-CONTEXT-product-brain.md`** — extract of the relevant `12` records (SH-STATE-002 · SH-PAGE-001/002 · FD-PAGE-001 · FD-NAV-001 door table · FD-STATE-002/003 · AA intro · ED-PAGE-001 collision), the Flight Deck / navigation records of `14` §2.1–2.2 in short form, the current four-zone structure with all 16 destinations and their real / demo status, the guided-empty-state decision, the public / private philosophy, the naming conflicts (five names, N-7 / N-10), and the rejected / superseded ideas that bear on navigation. **No backend detail beyond what prevents a false product assumption.** It must NOT treat the `09` §2 nine-system list as the current map.

**Red Team adds (`02-RED-TEAM/`):** `SYSTEM-PROMPT-red-team.md` · **`D1-NAVIGATION-CONTEXT-red-team.md`** — the user journeys as they exist today (signed-out → `/` → `/login` face scan → `/` · `/register` → `/copilot` · `/dashboard` greeting a stranger as "Marcus"), the four zones and 16 destinations with status, the ten KNOWN PROBLEMS from the D1 sheet, the rejected / superseded decisions that must not resurface, and the attack focus: confusion · duplication · bad navigation · unnecessary complexity · misleading product behaviour · broken user journeys. **It does not invent features.**

**Architect adds (`03-ARCHITECT/`):** `SYSTEM-PROMPT-architect.md` · **`D1-TECHNICAL-CONTEXT-architect-2026-09-20.md`** — a **dated v0 verification extract of `13`**: tables, routes, F1–F15 verdicts, S1–S10, the T1 slice, the auth reality (Supabase Auth real; face scan DEMO/SIMULATION), middleware facts, the privacy / auth direction (DL-023, DL-026, DL-029), the D1 technical implications (read-only — no code), the Owen ask (read-only; design as if the answer is no) and the corrected `copilot_events` rule: **dormant / dead pattern — `lib/copilot/persist.ts` has a writer, its only call site in `CopilotProvider.tsx` is commented out, `app/api/copilot/chat` writes nothing.** This extract resolves `14` §8's "Architect should receive `13` §3 + §7 as a verification note".

**Parked, not uploaded for D1 (`04-PARKED-LOOP-REFERENCE/`):** `02` · `03` · `10` · `05` · `06` · the `00` excerpts (Product Brain §1–4/§7–8, Red Team claims, Architect §6 schemas) · `THREE-UNSOLVED-PROBLEMS.md` · `OWEN-ASK-AND-SECURITY-FLAG.md` (folded into the Architect extract) · `current-state-audit-2026-08-16.md` (superseded by `13`). These are the intent-loop engine's documents; DL-021 keeps the loop at design-shape-only this phase and its binding decisions are already in `01` and `15`. **Re-upload the relevant ones when a founder assigns a loop task.**

**Nobody receives:** `04-kan-5-minute-version.md` · the QClay Telegram log · any `.env` or key · `docs/postman/*` · v0 memory files · the ~50 legacy `docs/` · full copies of `12`, `13` or `14`.

### 3.2 Pack v1 / v2 lists (17 Sep · 19 Sep — HISTORY, superseded by §3.1)

**All three received:** `01-decision-ledger.md` · `02-revision-…-kan-correction.md` · `03-intent-capture-position.md` · `08-architect-repo-facts.md` · `10-kan-chain-evidence-ladder.md` · **`11-founder-direction-2026-09-19.md`** (added 19 Sep — read as the company scope; the loop is an engine inside it; its Appendix A lists the older wording it supersedes) · **`15-structural-map-v1.md`** (added 20 Sep, DL-019 — the single current structural map; its §2 carries the 20 Sep founder decisions DL-020 tenancy Model B · DL-021 Intent Loop design shape only · DL-022 Education combination) · this file §1–2.

**Product Brain added:** `00-founder-synthesis` §1–4 and §7–8 (tell it §5 Thesis F is superseded, and that the §0/§8 "system of record for trading intentions" company definition and "it is the only core" are superseded by `11`) · `05-founder-memo.md` · `06-tonight-working-session.md` · the QClay paragraph in §2.

**Red Team added:** `00` §1–4 as *claims to verify, not facts* · `05-founder-memo.md` · the three unsolved problems: (a) weeks 1–4 value before the model has data; (b) the voluntary capture floor; (c) who the first traders are.

**Architect added:** `docs/current-state-audit.md` (16 Aug 2026) · `00` §6 object schemas · the Owen ask (read-only; design as if the answer is no) · the SECURITY-FLAG on `copilot_events` open insert policy.

**Note, 19 Sep 2026 (DL-018 — resolves the OPEN items DL-017 left on this file):** Luke + Kan decided that `11` governs company scope **and the current work phase**. The §4 first tasks below are now the STRUCTURE → FLOWS tasks; the 17 Sep loop-engine tasks are **parked** under each prompt, not deleted — they resume when a founder assigns them. The node boundaries in §2 / `10` §5 govern loop-engine work; in this phase every bot maps all major systems, with nodes right of REVIEW placed but labelled VISION. The intent loop stays in every pack (`02`, `03`, `10`) as one important subsystem to be placed correctly inside the larger architecture. **No bot writes the System Bible; no bot invents features.** `02` §3 "Nothing above it should be built until…" remains OPEN and untouched by DL-018 — structural mapping is not building.

**Note, 20 Sep 2026 (second founder session — D1):** the 19 Sep structural task is **COMPLETED** — the founders filed Structural Map v1 as `15` (DL-019) and the control documents `12` / `13` / `14` follow it. The current work is **D1 — Front Door / Flight Deck**, opened as inspection + design-definition only (no product code, no T1). The founders answered the D1 Block 1 sheet on 20 Sep (DL-026 … DL-030 + addenda to DL-023 / 024 / 025). The three bots are being brought back into the D1 workflow: **Product Brain** evaluates the four-zone command-centre organisation and the placement of the 16 destinations; **Red Team** challenges that proposed navigation structure; **Architect** grounds the D1 technical implications. **The §4 next tasks are written but are NOT sent until a founder sends them.** Nothing in D1 is built by a bot. **Bots propose / challenge / ground. Luke + Kan decide.** **22 Sep 2026:** the Product Brain / Red Team reconciliation is complete enough to move forward; the surviving direction is **DL-031 (PROVISIONAL D1 DESIGN DIRECTION — Luke; Kan review pending)**. The §4.1 Product Brain D1 task is therefore **COMPLETED** and must not be re-sent unless a founder re-issues it. **Pack v3 is now STALE** on two lines (the zone names; the Product Brain ★ NEXT TASK) but not materially incorrect about the code — **not rebuilt** (no founder-approved reason yet, `14` §7.2). D1 Block 2 (first-use design-definition) opened the same day; **no bot was asked anything** (founder order).

## 4. System prompts

### 4.1 Product Brain

> You are the **Product Brain** for ARCHIO. Your job is to turn what the founders know into one testable product hypothesis at a time, in the five-layer format: VISION · HYPOTHESIS · EXPERIMENT · DECISIONS · UNKNOWN.
>
> Before proposing anything, state what the decision ledger already says (cite IDs) and what is DECIDED that you must not contradict. Your hypotheses must be about real traders doing real things — capture, value, return — not about features. Every hypothesis names: who, how often, the smallest experiment, the metric, the kill criterion, and what its failure would *not* falsify.
>
> You do not research competitors — you cite the existing list and let the Red Team verify. You do not describe the codebase — you cite `08` or write NEEDS-V0-VERIFICATION. You do not design schemas — that is the Architect. You propose; Luke + Kan decide.
>
> **The current structural map is `15-structural-map-v1.md`** — seven Level-1 systems and three VISION interfaces. The `09` §2 "nine systems" list is a legacy naming layer: use it only to translate older names, never as the structure. *(Corrected 20 Sep 2026; the 19 Sep wording "the design canon (`09` §2 nine systems …)" is superseded.)*
>
> **Current work phase (DL-018 → D1, 20 Sep 2026):** `11` governs company scope; the order is STRUCTURE → FLOWS → DATA/BACKEND → DETAILED PAGE DESIGN. The STRUCTURE step you were first asked for is **complete** — the founders filed Structural Map v1 as `15`. The current block is **D1 — Front Door / Flight Deck**, inspection and design-definition only: no product code, no onboarding system, no feature invention. Read `00-CURRENT-STATE-2026-09-20.md` and `D1-PRODUCT-CONTEXT-product-brain.md` before anything else; quote ledger IDs with their labels (DECIDED · OPEN · FOUNDER DIRECTION · DEMO/SIMULATION · FUTURE/VISION).
>
> **D1 zone task — COMPLETED 22 Sep 2026** (the founders relayed the Product Brain / Red Team reconciliation; the surviving direction is **DL-031, PROVISIONAL** — do not re-run this task unless a founder re-issues it; the paragraph is kept as history): ~~Your next task (D1 — do NOT begin until a founder sends this paragraph):~~ evaluate the four-zone Flight Deck command-centre organisation and the current placement of its 16 destinations (`D1-PRODUCT-CONTEXT`, door table). The four zones are a **navigation abstraction** kept by decision (DL-025, model DECIDED); their **names and the placement of the 16 destinations are OPEN** (DL-025 addendum). For each zone: does the name and tagline describe what a trader finds beneath it today; which doors belong, which do not, and where a misplaced door would naturally live; what a zero-data, possibly signed-out trader needs from that zone on day one (DL-024, DL-026). Hold every proposal against: the guided empty state (DL-024), product-first exploration with identity asked at the moment of need (DL-026), one post-auth destination (DL-027), Ask Archio as conversational guide (DL-028, direction only), the OPEN workspace name (DL-030 — do not pick one), zones ≠ `15` systems and zones ≠ Community rooms, and the rejected-ideas table in `01`. Output: per zone **keep / rename-for-fit / merge**, per door **keep / move → where**, each labelled PROPOSED with the problem it fixes (KNOWN PROBLEMS 7 / 8 / 10 of the D1 sheet). Do not design pages, gadgets or the tutorial; do not add destinations; do not rename anything yourself. End with ≤ 5 bullets for the founders and the Red Team.
>
> *Completed (19 Sep task, DL-018 — kept as history):* map ARCHIO's major product systems, journeys, problems solved and relationships as input to the System Bible → the founders filed the result as `15` (DL-019).
>
> *Parked (17 Sep, resumes when a founder assigns it):* a one-page hypothesis for *how ARCHIO captures what a trader intends before a trade with almost no work from the trader, and gives back enough value that they do it again*, using the ranked mechanisms in `03` rather than re-deriving them. End with ≤ 5 accept/reject bullets.
>
> [Governance rules §1 apply.]

### 4.2 Red Team

> You are the **Red Team** for ARCHIO. Your job is to make proposals fail on paper before they fail with traders. Attack assumptions, find the competitor who already does it, name the friction, the regulatory line, the retention gap and the incentive problem. Every attack cites evidence or is labelled BELIEVED.
>
> You verify — never trust — the competitor list in `00` §3 and the glossary; give dates and sources. You check every proposal against the rejected-ideas table in `01` and against `02`'s warning that the repo's org/mentor shape is not evidence of demand.
>
> You are not asked to be constructive. You are asked to be right. But every attack ends with the cheapest experiment that would settle it. You challenge; Luke + Kan decide.
>
> **The current structural map is `15-structural-map-v1.md`.** Older maps (QClay locked map, the `09` §2 nine systems, the Flight Deck zones) are not the structure — `15` §3 says what each is still used for.
>
> **Current work phase (DL-018 → D1, 20 Sep 2026):** the STRUCTURE step is complete (`15`, DL-019). The current block is **D1 — Front Door / Flight Deck**, inspection and design-definition only. Your target in this block is the **proposed D1 navigation structure** the Product Brain produces. Read `00-CURRENT-STATE-2026-09-20.md` and `D1-NAVIGATION-CONTEXT-red-team.md` first; quote ledger IDs with their labels.
>
> **Your next task (D1 — do NOT begin until a founder sends this paragraph and pastes the Product Brain's proposal):** attack the proposed four-zone organisation and destination placement for **confusion** (would a new trader know where they are and where a door leads?), **duplication** (two doors, prompts or surfaces that are the same thing — the five-names problem, three "command" surfaces, three "hubs", N-7 / N-9 / N-19), **bad navigation** (dead ends, loops, doors that land on demo data or on pages with no real content, the no-shell problem), **unnecessary complexity** (zones, sub-levels or door counts a day-one trader does not need), **misleading product behaviour** (anything that presents demo numbers as the user's — DL-024; anything that promises what the code cannot do — the face scan, the DISCONNECTED execution rail), and **broken user journeys** (signed-out → explore → asked to log in → land in the workspace → find the same door again; the register path; the return path). Check every proposal against the rejected-ideas table in `01` (login wall · demo-as-yours · mandatory onboarding · renaming zones for alignment · nine-systems-before-the-loop) and against the DECIDED lines it must not contradict (DL-023 … DL-027). **Do not invent features or destinations; propose deletions, merges, moves and missing flows.** End with ≤ 5 bullets and, for each, the cheapest check that would settle it.
>
> *Completed (19 Sep task, DL-018 — kept as history):* challenge the Product Brain's structural map → superseded by the founders filing `15` (DL-019).
>
> *Parked (17 Sep, resumes when a founder assigns it):* (1) attack "the order is the intention" and the claim that a system can know 90% of a trade before the trader types; (2) attack the weeks-1–4 value gap — what does a trader get before the Trader Model has data, and is it more than every broker ticket already shows; (3) verify three competitor claims from `00` §3 with dates. End with ≤ 5 bullets.
>
> [Governance rules §1 apply.]

### 4.3 Architect

> You are the **Architect** for ARCHIO. Your job is to translate a surviving hypothesis into the smallest technically credible prototype spec: objects, fields, provenance, flows, what is measured, what is deliberately excluded. You write **specs**, not code, and not implementation plans — v0 owns how and where.
>
> You cannot read the repository. Your only sources of code facts are `08-architect-repo-facts.md` and dated v0 verification notes — in this pack, `D1-TECHNICAL-CONTEXT-architect-2026-09-20.md` (a dated extract of `13`). Reuse what exists there (the `/api/archio` grounded-prompt pattern, Supabase Auth + `profiles`, the trade-plan panel, the Live Room ledger shape) before proposing anything new. Where you need a fact you don't have, write NEEDS-V0-VERIFICATION and stop. You ground; Luke + Kan decide.
>
> **Correction (20 Sep 2026, founder instruction — supersedes the 17 Sep line "reuse the `copilot_events` event-log pattern"):** `copilot_events` is **NOT an active working persistence pipeline and NOT a real event spine.** Verified reality: `lib/copilot/persist.ts` contains a writer; its only call site in `components/copilot/CopilotProvider.tsx` (lines 6, 49) is commented out; `app/api/copilot/chat` does not write to `copilot_events`; nothing reads the table. Treat it as a **dormant / dead pattern** whose row shape is at most a reference; anything that would use it revives a dead table under fixed RLS policies (S2, S3). Never describe it as something to "extend".
>
> Design for: CSV import first, broker read-only later (assume TradeLocker says no to write access). Agents never place orders. Exactly one LLM call in the loop engine's v0: the review; deviation is arithmetic. The open insert / select policies on `copilot_events` (S2, S3) and the other open writes (S1, S4) remain prerequisite fixes before any real trader data — flag them, do not fix them.
>
> **Current work phase (DL-018 → D1, 20 Sep 2026):** the STRUCTURE step is complete (`15`, DL-019). The current block is **D1 — Front Door / Flight Deck**, inspection and design-definition only: **no code, no schemas, no build plan, no T1.** Read `00-CURRENT-STATE-2026-09-20.md` and `D1-TECHNICAL-CONTEXT-architect-2026-09-20.md` first; quote ledger IDs with their labels.
>
> **Your next task (D1 — do NOT begin until a founder sends this paragraph):** ground the D1 decisions against the repo facts and state their **technical implications only** — no implementation. Per decision: (a) **DL-026** product-first exploration with identity asked at the moment of need — what the per-action / per-data boundary means for `lib/supabase/middleware.ts` (S7: protects only non-existent routes), for `profiles_select_all USING (true)` (S8) and for F2; which existing surfaces could be public and which are identity-bound by their data; (b) **DL-027** one post-auth destination — the two redirect sites (`app/login/page.tsx`, `app/register/page.tsx`) and the `?from` return path; (c) **DL-024** guided empty state — what "real workspace, no fake personal numbers" requires of F5 / F8 / F10 (all MISSING) and what can be honest with zero data today; (d) **DL-029** authentication — Supabase Auth is the real F1 path; the face scan is DEMO/SIMULATION; list, **separately and without merging**, what device biometrics / passkeys, email / phone confirmation, KYC and duplicate-account prevention would each need, labelled FUTURE — no provider chosen; (e) **DL-023** privacy tiers — which `profiles` fields are public-layer vs private today. Mark what already exists vs what is visual / demo only. Do **not** write schemas, policies, middleware rules or a build plan; do not invent features. End with ≤ 5 bullets — the NEEDS-V0-VERIFICATION items Luke pastes to v0.
>
> *Completed (19 Sep task, DL-018 — kept as history):* ground the surviving structural map against the repo → the founders filed `15`; `13` (20 Sep) is the grounded backend view it asked for.
>
> *Parked (17 Sep, resumes when a founder assigns it):* the three-table spec — `decision_records` (with per-field provenance and `locked_at`), `trades`, `decision_reviews` — plus the record↔fill matcher and `lock_lead_seconds`, plus the six Trader Model v0 aggregates as plain SQL descriptions. Mark every line that needs v0 verification. Nothing else. End with ≤ 5 bullets.
>
> [Governance rules §1 apply.]

## 5. Flow

Product proposes → Red Team attacks → Architect specs the survivor → **Luke pastes the Architect's ≤ 5 bullets to v0** → v0 writes `verifications/<date>-<topic>.md` → Luke pastes it back → Architect revises → founders mark ledger entries DECIDED / REJECTED → only then v0 implements.

In the current phase (DL-018) the same flow reads: Product Brain **maps** → Red Team **challenges the map** → Architect **grounds the survivor against the repo** → v0 verifies → founders assemble the System Bible from the surviving map. Nothing is implemented in this phase.

In **D1 (20 Sep 2026 →)** the flow reads: founders send the Product Brain its D1 task → Product Brain **evaluates the four-zone organisation and the 16 destinations** (PROPOSED) → Red Team **challenges the proposed navigation structure** → Architect **states the technical implications** of the D1 decisions (no code) → v0 verifies the NEEDS-V0-VERIFICATION bullets → **Luke + Kan tick Q-23 … Q-27 in `14` §9 and mark the ledger** → only then D1 Lego Block 2 (design definition) opens, still before product code. **Bots propose / challenge / ground. Luke + Kan decide.**

ChatGPT sits outside this loop as Luke's drafting assistant (DL-015). Nothing it produces enters the ledger unless a founder commits it.


---

<!-- FILE: 10-kan-chain-evidence-ladder.md -->

# Kan's chain as the evidence ladder — arrow-by-arrow challenge

*17 September 2026. Context for the Grok grounding, not a strategy document. Kan sent this after reading the 5-minute memo, unprompted:*

> **DECISION → ACTUAL TRADE → COMPARE → MEMORY → TRADER MODEL → PERSONALIZED AI → AGENTS → WORKFLOWS → CREATOR INTELLIGENCE → POTENTIAL MARKETPLACE**

## 1. What this is and is not

| | Status |
|---|---|
| Founder alignment on "features need an underlying decision/intelligence architecture" | **Strong.** Kan produced the abstraction himself; that is better evidence than agreement. |
| Product thesis | Clearer. The chain and the Layer 0–7 ladder in `02` §6 are the same object. |
| Market / user validation | **Unchanged: none.** Zero real traders, zero Decision Records. |
| Nodes 6–10 (Personalised AI → Marketplace) | Hypotheses. Not build priorities because both founders like them. |

**Caution, stated plainly:** two founders converging on an abstraction in one evening is the exact moment the house pattern fires — systematise before evidence. Kan turned a memo into a ten-node architecture overnight. That skill produced 337k lines with no trade table. The chain is only useful if it is read as a **ladder you climb with evidence**, never as a roadmap you build down.

## 2. Two structural gaps in the chain

**Gap A — it starts one node too late.** "DECISION" presumes the decision already exists as data. It does not. The company's single load-bearing hypothesis (H1) is that a trader will *make the decision visible* voluntarily, before the fill, at ≤ one tap + one line. Node 0 is **CAPTURE**. Everything to the right is unreachable if node 0 fails.

**Gap B — it is a data-flow, not a value-flow.** The trader receives nothing back until node 6 (Personalised AI). Records only accumulate if the trader keeps recording, and the trader keeps recording only if node 3 gives something back *immediately*. The per-trade loop in the memo has the step: PLAN → TRADE → COMPARE → **REVIEW** → LEARN. Kan's MEMORY is LEARN on the system side; REVIEW — the human-facing moment — is missing. Insert it, or the weeks-1–4 gap (`05` §7) becomes structural.

**Ordering note — the chain is linear, the dependencies are not.** CREATOR INTELLIGENCE does not derive from WORKFLOWS. It derives from **many traders' records under one spec** — i.e. from MEMORY + TRADER MODEL at *scale*. From TRADER MODEL the ladder forks: a *personal* branch (Personalised AI → Agents → Workflows) and a *collective* branch (Creator Intelligence → Marketplace). Good news: creator intelligence is not gated on agents. Bad news: it is gated on user count, which is the thing we have least of.

## 3. Arrow by arrow — where the arrow does not follow, what earns it, what the repo says

| # | Arrow | Why it is NOT automatic | Evidence that earns it | Repo: strengthens / contradicts |
|---|---|---|---|---|
| 0→1 | CAPTURE → DECISION | Market orders fill before any prompt; post-hoc "plans" are journal entries. Voluntary capture is unproven anywhere. | **H1:** ≥ 50% of a trader's trades carry a record with `lock_lead_seconds > 0`, across ≥ 5 traders, one mechanism. | *Contradicts today:* no decision object exists. *Strengthens:* `copilot-trade-plan.tsx` has the right field shape (writes nowhere); `copilot_events` is a live append-only pattern to reuse. |
| 1→2 | DECISION → ACTUAL TRADE | Many trades have no decision (impulse). The Coverage Split (planned vs unplanned on one account) is the honest measure, and it may show planning does not help that trader. | Coverage reported next to every insight; planned trades ≥ unplanned on expectancy for ≥ 60% of traders. | *Contradicts:* no broker connection, no `trades` table. CSV import first; Owen ask second; design as if Owen says no. |
| 2→3 | ACTUAL TRADE → COMPARE | Matching a record to fills is not trivial: partials, scale-ins, same instrument twice a day. Deviation must be arithmetic, never an LLM guess. | Matcher pairs ≥ 90% of records to fills unambiguously on real CSVs; deviation types reproducible. | *Neutral:* nothing built; three tables + a matcher is the whole Layer 1. |
| 3→4 | COMPARE → MEMORY (via REVIEW) | Memory only grows if the trader comes back. **The missing REVIEW node earns the next record.** Weeks 1–4 offer only commodity value (R:R, risk %) — unsolved. | **H2:** ≥ 50% of reviews rated "told me something I didn't know." **H3:** ≥ 50% record again without being asked. Human-written reviews (Kan) before any LLM. | *Strengthens:* `copilot_events` shows the team can persist events. *Contradicts:* `lib/response-engine/journal.ts` is demo data; the Live Room ledger is client state only, nothing saved. |
| 4→5 | MEMORY → TRADER MODEL | "Model" must be defined as computable aggregates or it is a vibe. Per-setup expectancy needs ≥ 40 records per trader; with 9 setups that is months. | Trader Model v0 = six SQL aggregates (`05` §6). Gate: a flagged deviation is avoided ≥ 30% of the times it fires. | *Contradicts:* Trading DNA / Psychology are pages, not computations over data. Nothing derived from real records exists. |
| 5→6 | TRADER MODEL → PERSONALISED AI | Personalisation must be *measurably* better than generic review, which TradeZella already sells at $35–99/mo. | Traders rate personal review ≥ human review ≥ 50% of the time; adherence moves. | *Strengthens:* `/api/archio` already grounds Gemini in live Polygon prices — the exact template for grounding in the trader's own records. |
| 6→7 | PERSONALISED AI → AGENTS | Context is not an agent. Agent = context + a job + permission to act + a feedback signal. Blocking a ticket needs broker write access we do not have; touching orders adds regulatory surface. | Traders opt in and keep the agent on 30 days; adherence rises vs control; opt-out < 50%. | *Contradicts:* no agent runtime, no tool use, no scheduler; Owen deck states execution not connected. Any near-term "agents" claim is unsupported. |
| 7→8 | AGENTS → WORKFLOWS | Only if ≥ 2 repeatable jobs exist and traders chain them. | Traders turn on ≥ 2 chained automations and keep them. | *Neutral:* nothing exists. |
| 5→9 | TRADER MODEL (at scale) → CREATOR INTELLIGENCE | Depends on user count, not on agents. An expert must expose a *checkable* spec; "feel" may dominate. | ≥ 3 experts with ≥ 20 active followers each; spec-vs-expert disagreement rate measured and < 30%. | *Strengthens:* orgs / rooms / memberships / invites are real — the *container* for creator→follower exists. *Contradicts:* no spec object, no verified record. |
| 9→10 | CREATOR INTELLIGENCE → MARKETPLACE | Invo/Fomo own "pay creators for copied trades." The "intelligence, not signals" half is unproven; selling trading intelligence edges toward advisory regulation in several jurisdictions. | Layer 9 stable for a quarter; users request paid access; legal review done. | *Strengthens:* Stripe is live — the payment rail exists. Rail ≠ demand. |

## 4. The canonical chain (proposed — founders accept or edit)

**Per-trade cycle:** PLAN/LOCK → TRADE → COMPARE → REVIEW → LEARN
**Long-range ladder (Kan's, amended):** CAPTURE → DECISION → ACTUAL TRADE → COMPARE → REVIEW → MEMORY → TRADER MODEL → { PERSONALISED AI → AGENTS → WORKFLOWS } ∥ { CREATOR INTELLIGENCE → MARKETPLACE }

Rule for everyone (bots included): **we believe the whole ladder could exist; we earn the right to move one node right only when the node to the left has produced the evidence in §3.** Today we stand at node 0 with no evidence for node 1.

## 5. For the three bots

*Amended 19 Sep 2026 (DL-018): the boundaries below govern work **on the loop engine**. In the current STRUCTURE → FLOWS phase the bots' first tasks are the structural ones in `09` §4 and they map every major system; the loop is placed inside that map as one subsystem. Text kept as written.*

- **Product Brain** proposes only within nodes 0–3. Anything right of REVIEW is labelled VISION in its output.
- **Red Team** attacks arrows, not the whole chain — first 0→1 and 3→4 (the two unsolved ones).
- **Architect** builds nothing right of node 4 (MEMORY). Three tables + matcher + one page.
- Every bot: founder alignment is context, not evidence. Do not cite "the founders agree" as support for anything.


---

<!-- FILE: 11-founder-direction-2026-09-19.md -->

# ARCHIO — Founder Direction

**Date:** 19 September 2026
**Approved by:** Luke + Kan. This is a founder decision, not an AI proposal.
**Ledger:** DL-017 — **DECIDED**
**Status of this document:** CURRENT. Newest date wins. It is the founders' statement of ARCHIO's overall company scope and is to be read as a **clarification of scope** — not as a new hypothesis, feature list, architecture or plan.

> **How to read this against `00`–`10`.** The intent → trade → compare → review → memory loop described in `02`, `03` and `10` remains an important potential intelligence engine *inside* ARCHIO. It is **not** the definition of the entire company. Where an older document's wording defines the company as that loop, this document supersedes the wording; the older text is flagged in Appendix A and left in place, not rewritten. Nothing about the Decision Record, the capture mechanisms, provenance, kill criteria H1–H5 or the evidence ladder is deleted or revoked here.

> **Provenance.** Written by Luke and Kan. Transcribed into this folder by v0 on 19 September 2026 on the founders' instruction. v0 changed formatting only (headings, bullet lists, bold on named terms). No sentence was added to, removed from, or reworded in §1–§8 or the Founder principle. Appendices A and B are v0's governance notes and are labelled as such.

---

## APPROVED FOUNDER DIRECTION — LUKE + KAN

### 1. ARCHIO is intended to become the connected environment around the trader’s entire journey.

ARCHIO is not being built as only a journal, only a pre-trade tool, only an AI coach, only a community, or only a trading dashboard.

The long-term idea is to bring together the parts of trading that currently live across disconnected tools, platforms, communities and workflows into one connected environment.

A trader should be able to learn, research, prepare, analyze markets, interact with mentors or other traders, plan trades, review behavior, understand performance, use tools, communicate, discover opportunities and improve over time without constantly jumping between unrelated systems that know nothing about each other.

ARCHIO should eventually feel like the place where the trader’s trading life lives and should feel like opportunity.

### 2. Personalized intelligence should become one of the core layers connecting that entire environment.

ARCHIO should gradually understand the person behind the trading account, not only the trades themselves.

Over time, with the user’s permission, ARCHIO should learn from how the trader behaves throughout the platform:

- what markets they watch
- what they actually trade
- what sessions they are active during
- what tools they use
- what pages they repeatedly visit
- what educational material they consume
- what mentors or communities influence them
- how their behavior changes after wins and losses
- how behavior changes during winning and losing streaks
- where they repeatedly drift from stated goals
- emotional context when voluntarily provided
- what strategies they believe they trade
- and what their actual behavior shows.

The purpose is not surveillance. The purpose is for the user to knowingly allow ARCHIO to understand enough about them that the platform becomes increasingly useful and personal.

ARCHIO should help break down the user’s behavior and compare it with actual outcomes and what the user says they are trying to achieve.

### 3. ARCHIO should combine general intelligence with personalized intelligence.

**General ARCHIO Intelligence** should understand information useful to traders broadly:

markets, instruments, sessions, volatility, economic events, news, risk concepts, trading terminology, education, platform functionality and general trading knowledge.

**Personal ARCHIO Intelligence** should understand:

the user’s history, preferences, strategies, behavior, goals, tendencies, strengths, weaknesses, routines, activity and accumulated ARCHIO history.

The long-term advantage comes from combining both.

ARCHIO should not only understand something like “JPY has CPI today.”

Eventually it should be capable of understanding the market context together with how that context relates specifically to this user’s normal behavior and history.

### 4. The user should provide as little information manually as reasonably possible, while having the ability to provide more context when they choose.

Normal use should be simple and low friction.

ARCHIO should automatically observe whatever information it can legitimately obtain from the platform, connected data sources and the user’s activity.

When additional context is useful, the user should be able to explain naturally through text, voice, guided questions, multiple choice, yes/no choices or similar interactions rather than being forced into long forms.

This may include emotional state, what they believe they are seeing, questions about a trade idea, a mentor’s forecast, news, a setup or other relevant context.

ARCHIO should help the user explore the situation rather than simply outputting a final answer.

### 5. The AI should eventually feel like a configurable trading buddy, coach and intelligent assistant.

Different traders respond to different kinds of help.

Some users may want ARCHIO mostly quiet. Others may want accountability, education, detailed explanations, questions, or a more conversational trading buddy.

The user should eventually have control over the style, intensity, depth and proactivity of the assistance.

ARCHIO should remain informational and educational rather than acting as a financial adviser that tells users what trades to take.

It should surface relevant market information, risks, events, context, history and behavioral patterns so the trader can make their own decisions.

ARCHIO should be compelling and proactive, but not intentionally manipulative or designed to encourage emotional/compulsive trading.

Rather than forcing conversations to continue forever, ARCHIO should rarely leave a useful next question, relevant context or helpful path unexplored.

### 6. ARCHIO should create value immediately, before it knows the trader deeply, and personalized value should compound over time.

Immediate value does not have to come only from a single pre-trade review.

The connected ARCHIO environment itself can create value through market information, dashboards, mentor/community content, summaries, forecasts, tools, education, communication, opportunities and AI assistance.

This can also include broader opportunities for users to participate, build communities, lead groups, create value, earn money or interact with other parts of the platform where appropriate.

A new user should have reasons to find ARCHIO useful before months of personal history exist.

As ARCHIO learns the trader, personalized value should compound.

Eventually it should recognize when a user is drifting from their normal behavior, entering unfamiliar markets, changing risk after wins/losses, behaving differently from their goals, or repeating patterns that have hurt them before.

The long-term feeling should be that the trader has a knowledgeable trading buddy beside them.

### 7. The intention → action → outcome loop remains an important intelligence engine, but it is not the entire company.

The chain:

**CAPTURE → DECISION → ACTUAL TRADE → COMPARE → REVIEW → MEMORY → TRADER MODEL**

remains potentially very important because it may create valuable information about the difference between what a trader intended to do and what they actually did.

That information may later power stronger personalization, coaching, behavioral awareness, agents and workflows.

However, ARCHIO should not be reduced to “a product that asks traders to record their intention before trades.”

Intent is one potentially valuable source of intelligence inside the larger ARCHIO system.

We still need to learn how much intent can be observed automatically, how much must be declared, how little friction can be created and what value makes the interaction worthwhile.

### 8. Our immediate founder problem is structural clarity.

We have a large vision, substantial design/UI work, many individual features and concepts, and a partially built application.

We do not yet have a complete functional blueprint explaining how everything belongs together.

Before blindly finishing every page, paying QClay approximately $42,000 to complete design, committing to a roughly $350,000 backend build, or handing the platform to another engineering team, Luke and Kan want to understand the structure themselves.

We need an **ARCHIO System Bible** that eventually explains:

- every major system
- its purpose
- the user
- the problem it solves
- where it sits in the user journey
- what data it creates
- what data it consumes
- what other systems it connects to
- what AI does
- what deterministic software does
- what already exists
- what is visual/demo only
- what backend must exist
- what integrations are required
- what may be built internally using AI
- what may require outside engineering
- what QClay would actually be designing around

We do NOT want to finish every page independently and attempt to connect everything afterward.

We want:

**STRUCTURE → FLOWS → DATA/BACKEND → DETAILED PAGE DESIGN → OUTSIDE POLISH/ENGINEERING.**

This System Bible should also prepare Luke and Kan for the next Owen / TradeLocker discussion by making clear what exists, what is missing, what integrations matter and where outside technical assistance is actually needed.

### Founder principle

We are not trying to think smaller. We are trying to put the big vision into the correct order.

Preserve ARCHIO’s ambition while preventing disconnected pieces of the future from being built before the underlying system is understood.

---

## Appendix A — Older wording this direction supersedes (flagged, not rewritten) — *v0 governance note*

Rule: historical documents keep their text. A reader who meets any line below reads it through `11`. The **superseded** column names exactly which words no longer define the company. The **still stands as** column says what the same passage still validly describes. Rows marked **OPEN** are conflicts v0 is not permitted to resolve; a founder rules on them.

| Where | Exact wording | Superseded by `11` | Still stands as |
|---|---|---|---|
| `00` §0, line 14 | "You are not building a trading tool, an OS, or an agent platform yet. You are building **the system of record for trading intentions**" | The phrase "the system of record for trading intentions" **as the definition of what ARCHIO is building**. | A description of the loop engine's first object (the Decision Record) and of hypothesis H1. |
| `00` §0, line 14 | "Everything else in the 43-section email (Trader Model, agents, creator intelligence, marketplace, cockpit) is downstream of whether traders will create that record." | "Everything else … is downstream" **as a company-scope statement**. `11` §6: the connected environment itself can create value before the loop has data. | The dependency *inside the loop*: a Trader Model built from intent data cannot exist without captured intent. |
| `00` §8, line 248 | "**What company are we building?** A decision-infrastructure company for discretionary traders: the system of record for trading intentions, entered through mentors. 'Trading OS' is the horizon, not the pitch." | The whole first sentence as the company definition. ("entered through mentors" was already superseded by `02`.) `11` §1 is now the answer to "what company are we building". | Nothing of the first sentence. The second sentence (pitch vs horizon) is not addressed by `11` and remains as written. |
| `00` §8, line 257 | "**Decision Record core?** Yes; it is the only core." | "it is the only core." `11` §7: "Intent is one potentially valuable source of intelligence inside the larger ARCHIO system." | The Decision Record as the core object *of the loop engine* (DL-001). |
| `02` §2, row "Long-term company thesis" | "ARCHIO becomes the operating system around a trader's *decisions*" | The scope "around a trader's *decisions*". `11` §1 widens it to "around the trader's entire journey". | The rest of the row — stores intention before outcome, matches what happened, knows the trader well enough that its intelligence is grounded in the trader's real record — now read as describing the loop feeding Personal ARCHIO Intelligence. |
| `02` §3 verdict, line 39 · `10` §2 Gap A, line 20 · `01` DL-001 "Confidence" | "the company's single load-bearing hypothesis" | The words "the company's". H1 is the load-bearing hypothesis **of the loop engine**. | H1 itself, its kill criteria (`02` §5), and the rule that founder alignment is not evidence (DL-016). |
| `02` §3 verdict, line 39 | "Nothing above it should be built until capture is observed happening voluntarily, repeatedly, in at least a handful of real traders." | **OPEN.** As written, the sentence forbids building anything in ARCHIO before capture is proven. `11` §6 states the environment creates value independently of the loop; `11` §8 orders the work STRUCTURE → FLOWS → DATA/BACKEND → DETAILED PAGE DESIGN. Whether this sentence now applies to the loop's upper nodes only, or is withdrawn, is a founder call. | Undetermined until a founder rules. |
| `05`, line 164 | "**VISION** — an intelligent trading OS around the trader's decisions. Unchanged." | "around the trader's decisions" — narrower than `11` §1. | "an intelligent trading OS" as a VISION label. |
| `09` §2 glossary (ladder line) · `10` §5 | "Bots work nodes 0–4 only; everything right of REVIEW is VISION." · "Product Brain proposes only within nodes 0–3." | **RESOLVED 19 Sep 2026 by DL-018** (was OPEN). The boundaries govern *loop-engine* work. In the STRUCTURE → FLOWS phase the bots map every major system; nodes right of REVIEW may be placed on the map but stay labelled VISION. See `09` §2–3, `10` §5 note. | The boundaries as written, for loop-engine work. |
| `09` §4 first tasks | Product Brain: the capture hypothesis. Red Team: attack "the order is the intention" and the weeks-1–4 gap. Architect: the three-table spec. | **RESOLVED 19 Sep 2026 by DL-018** (was OPEN). First tasks re-set to the structural ones (map → challenge → ground). The 17 Sep tasks are **parked** under each prompt in `09` §4, not deleted. | The parked tasks resume when a founder assigns them. |
| `01` DL-006 · `09` §2 glossary (QClay) | "$35k design" | **FIGURE CONFLICT, not reconciled.** `11` §8 says "approximately $42,000 to complete design". Both figures came from founders on different dates. v0 does not know which is current. | — until a founder corrects one of them. |

**Not in conflict, unchanged:** the twelve governance rules (`09` §1 — none defines the company); the rejected-ideas table (`01`); per-field provenance (DL-011); the capture design target (DL-012); `lock_lead_seconds` (DL-013); the Owen ask — read-only order history, no execution (`11` §8 names the Owen discussion as a purpose of the System Bible, consistent with DL-004); "agents never place orders"; the product name ARCHIO (DL-007); "Kan has no students and does not trade actively" (`09` §1 rule 10).

## Appendix B — What this document does not do — *v0 governance note*

- It does not decide the contents, format, owner or timeline of the ARCHIO System Bible. `11` §8 records that the founders want one and in what order the work should go; nothing more.
- It does not change the status of DL-001 … DL-016. It adds DL-017 only.
- It does not revoke H1–H5, the ten capture mechanisms in `03`, or the evidence ladder in `10`. They now describe the loop engine inside ARCHIO.
- It does not itself widen or narrow the three bots' boundaries or first tasks. Those tensions were flagged in Appendix A as OPEN and were **resolved the same day by a separate founder decision, DL-018** (`01`; operative text in `09` §2–4).
- It does not resolve the QClay design figure ($35k vs ~$42k).
- It adds no feature, system, architecture, schema or recommendation. Where the founders' text names capabilities (voice input, guided questions, drift recognition, communities, earning), those are scope statements by the founders — not proposals by v0 — and carry no ledger status of their own.


---

<!-- FILE: 12-product-design-control-center.md -->

# 12 — ARCHIO Product / Design Control Center

**Date:** 20 September 2026
**Kind:** OPERATIONAL CONTROL DOCUMENT (not governance). `11-founder-direction-2026-09-19.md` and DL-018 remain authoritative. Where this inventory contradicts a Source-of-Truth file, the contradiction is **flagged in §12** — nothing in `00`–`11` is changed by this file.
**Built by:** v0, from the actual repo at commit `08f58a1` on branch `v0/fxp1casso-52674d7b`. Every route, component, table and status below was read from code, not from memory or from earlier documents. Where a fact could not be established from code it says `UNKNOWN` or `NEEDS-V0-VERIFICATION`.
**Owners:** Luke + Kan. Only they set `LUKE APPROVAL` / `KAN APPROVAL`. Nothing is marked APPROVED in this first edition because there is no written evidence of approval for any surface.
**Companion files:** `13-technical-backend-control-center.md` (what makes it work) · `14-archio-master-cross-reference.md` (the connective matrix, naming control, change log, 8-week runway).

> **The question this file answers:** *What does the user see, touch, click, open, read, edit or experience — and how finished is it?*

---

## 0. How to use this document

1. **Find the surface** by system (§4–§7) or by ID (`14` §1 has the master index).
2. **Read its control record.** Every record has the same fields in the same order so two surfaces can be compared line by line.
3. **Review it in the running app** (route is given), take a screenshot, and put the screenshot path in `SCREENSHOT / VISUAL REFERENCE`.
4. **Set your decision** in `LUKE APPROVAL` / `KAN APPROVAL` (`NOT REVIEWED` → `CHANGES REQUESTED` or `APPROVED`) and write the reason in `DESIGN ISSUES` / `FUNCTIONAL ISSUES`.
5. **Do not edit a status on somebody else's line.** Each founder owns one approval column.
6. **When a surface changes,** update its record here and add one dated line to the change log in `14` §5. Never rewrite history — supersede it.

**Repo-size context (verified 20 Sep 2026):** Next.js 14.2.25 App Router · React 19 · Tailwind 3 (`tailwind.config.ts`) · shadcn/ui (61 primitives in `components/ui/`) · Supabase · Stripe · Polygon.io · AI SDK 6. `app/` 30 page routes + 37 API route files · `components/` 38 top-level folders + 80 loose top-level components · `components/dashboard/` alone is **132,260 lines** across 167 files. `tsc --noEmit` reports **483 type errors** today; the build passes only because `next.config` sets `ignoreBuildErrors: true` and `ignoreDuringBuilds: true`. This is stated here because "it compiles" must not be mistaken for "it is finished".

---

## 1. Controlled vocabularies

Use these words and no others in the status columns. If none fits, use `UNKNOWN` and say why in the issues field.

### 1.1 CURRENT VISUAL STATUS

| Value | Meaning |
|---|---|
| `NOT DESIGNED` | The concept exists in Source of Truth or a legacy blueprint; no UI exists in the repo. |
| `ROUGH` | UI exists but was built as a functional sketch or is from the pre-Vantary era; not styled to any system. |
| `V0 DRAFT` | Built with v0 to a deliberate visual standard, never founder-reviewed as a whole. **Default for most of the product.** |
| `FOUNDER REVIEW` | A founder has opened it with intent to approve and has left notes; not yet approved. |
| `FOUNDER APPROVED` | Both founders recorded APPROVED on the record. Visual direction is locked for QClay. |
| `QCLAY POLISH LATER` | Function approved by founders; visual execution deliberately left for QClay. |
| `SUPERSEDED` | A newer surface replaced it; it still exists in code (mounted or not). |
| `UNKNOWN` | v0 could not render or fully read it in this audit. |

### 1.2 CURRENT FUNCTIONAL STATUS

| Value | Meaning |
|---|---|
| `UI ONLY` | Renders; no data, no state that survives a reload. |
| `MOCK DATA` | Renders with hard-coded sample/demo data or generated numbers; nothing is read from or written to a backend. |
| `PARTIAL` | Some real data or persistence, some mock; specify which in the record. |
| `FUNCTIONAL` | Real data end-to-end for its stated purpose. |
| `BACKEND BLOCKED` | The UI is ready to be wired but the table/API it needs does not exist. |
| `INTEGRATION BLOCKED` | Needs an external system (broker, TradeLocker, email provider) that is not connected. |
| `VISION ONLY` | Level-4 concept; exists only as words, a deck slide, or a placeholder. |
| `UNKNOWN` | Not established in this audit. |

### 1.3 LUKE APPROVAL / KAN APPROVAL

`NOT REVIEWED` · `CHANGES REQUESTED` · `APPROVED`. One column each. A surface is founder-design-complete only when **both** read `APPROVED` **and** the §10 checklist is satisfied.

---

## 2. ID convention

`<SYSTEM>-<TYPE>-<NNN>` — stable, never reused, never renumbered. When a surface is deleted its ID stays in the register with status `SUPERSEDED`.

**System codes** (from Structural Map v1, Level 1 — see §3):

| Code | System |
|---|---|
| `SH` | Global shell (layout, navigation, auth entry, global providers) — not a Level-1 system, but every user meets it first |
| `FD` | Flight Deck |
| `IL` | Intent Loop / Decision experience |
| `MX` | Market Experience |
| `ED` | Education |
| `CO` | Community & Opportunity |
| `AA` | Ask Archio |
| `AM` | Account / Money |
| `TP` | Trading Passport / verified proof (Level 4 / VISION) |
| `SM` | Social / creator / marketplace (Level 4 / VISION) |
| `AG` | Agents / workflows (Level 4 / VISION) |
| `MK` | Founder, marketing and internal surfaces (decks, landings, design page, backend map) — **not the product**, inventoried so nobody mistakes them for it |

**Type codes:** `PAGE` route · `SECTION` region of a page · `TAB` · `MODAL` · `DRAWER` · `PANEL` side/inspector panel · `CARD` · `WIDGET` gadget/instrument · `TABLE` · `CHART` · `NAV` navigation item/menu · `SEARCH` · `FORM` · `STATE` empty/loading/error/permission/first-run state · `AI` AI/chat surface · `TPL` AI-generated template surface · `FLOW` multi-step journey.

---

## 3. Structural Map v1 → this inventory

The founder-approved **Structural Map v1** names seven Level-1 user-facing systems (Flight Deck · Intent Loop / Decision experience · Market Experience · Education · Community & Opportunity · Ask Archio · Account / Money) and three Level-4 / VISION interfaces (Trading Passport / verified proof · Social / creator / marketplace · agents / workflows).

> **RESOLVED 20 Sep 2026 (DL-019):** the Structural Map v1 is now filed as **`15-structural-map-v1.md`** — cite it by path. Its §2 also carries the 20 Sep founder decisions that bind three of the systems (DL-020 tenancy Model B · DL-021 Intent Loop design shape only · DL-022 Education combination). *Original flag, kept for history:* ~~the Structural Map v1 document itself is not in the repo (`docs/source-of-truth/` has `00`–`11`; no file contains the phrase "Structural Map"). This inventory uses the system list exactly as the founders gave it in the request. The map should be pasted into `docs/source-of-truth/` as its own numbered file so `12`/`13`/`14` can cite it by path.~~ Every system assignment below remains v0's reading of "where does this most obviously belong" and is marked **OWNER: PROPOSED** where the placement is arguable — filing the map does not approve the placements.

**How the current code maps onto the seven systems (high level):**

| Level-1 system | What exists in code today | Maturity in one line |
|---|---|---|
| Flight Deck | `/dashboard` → `components/dashboard/vantary/your-space.tsx` (33,482 lines) and its 148-file `vantary/` tree: Room Navigator (4 rooms × 4 doors), living gadgets, trading desk, Strategy OS, Active Window, Jarvis surfaces, 7 visual themes, command palette, template shell | Very large, visually the most developed, **100 % demo telemetry** — nothing it shows is the user's |
| Intent Loop / Decision experience | `/forecast` (Forecast Hub, 24k lines), `/copilot` (Execution Copilot), the Copilot "buddy" system (52 files), Live Room ledger, Strategy OS / psychology modules | Rich UI for the *shape* of a decision; **no decision, plan, trade, forecast or journal is persisted anywhere** |
| Market Experience | `/` (Signal Terminal), `/intelligence` (Macro), `/nexus`, ~40 loose analysis components, confluence system, MTF | Real Polygon routes exist server-side; **the home page still renders `generateMockPriceData`** |
| Education | `/cockpit` (guided narrative), `/hub` (student hub, the only login-gated page), mentor components, tutorial overlays, glossary | UI/demo only; **zero education backend of any kind** (see `13` §3.1) |
| Community & Opportunity | `/communities` (discovery), floating Community Hub (13 views), `/history`, `/live-room` | Discovery reads a real `groups` table with mock fallback; everything else is client state |
| Ask Archio | Command layer (`/api/command`, gpt-5-mini), grounded response engine (`/api/archio`, gpt-4.1-mini + real Polygon), Copilot chat (scripted), Oracle console, Nexus AI panel | Two real LLM endpoints, both unauthenticated; the "journal" the engine analyses is a labelled demo book |
| Account / Money | `/profile` (mock, demo-mentor toggle), auth pages (real Supabase Auth), Stripe/plans/subscriptions backend (**no UI calls it**), orgs/rooms/memberships/invites backend (**no UI calls it**) | Auth is real; everything money- or org-related is backend without a front door |

---

## 4. Global shell (`SH`)

The shell is what every user touches before any system. It is inventoried first because inconsistency here multiplies across every page.

### SH-NAV-001 · Floating left-edge navigation

- **SYSTEM:** Shell
- **ROUTE / LOCATION:** every page except `/pitch`, `/owen`, `/live-room` · `components/floating-nav.tsx`, mounted in `app/layout.tsx`
- **WHAT THE USER SEES:** a 20 px invisible strip on the left edge with a faint purple chevron; on hover, five 3-D-tilting cards appear: **Dashboard** ("Private command center"), **Signal Terminal** (`/`, "Real-time market analysis"), **Macro Economic** (`/intelligence`), **Forecast Hub** (`/forecast`), **Community** (`/communities`).
- **WHAT THE USER CAN DO:** hover to reveal, click to navigate, prefetch on hover.
- **WHY IT EXISTS:** the only global navigation. Hidden-by-default so the Flight Deck owns the viewport.
- **CONNECTS TO:** FD, MX, IL, CO. **Does not link** to `/copilot`, `/nexus`, `/history`, `/hub`, `/cockpit`, `/profile`, `/live-room` — those are reachable only through the Flight Deck Room Navigator (`FD-NAV-001`).
- **CURRENT VISUAL STATUS:** `V0 DRAFT` — purple accent (`purple-400/…`), which is **not** the Vantary teal used inside the dashboard it opens onto.
- **CURRENT FUNCTIONAL STATUS:** `FUNCTIONAL`
- **LUKE APPROVAL:** NOT REVIEWED · **KAN APPROVAL:** NOT REVIEWED
- **DESIGN ISSUES:** hover-only discovery is invisible on touch devices; no current-page indicator visible when collapsed; accent colour disagrees with the dashboard.
- **FUNCTIONAL ISSUES:** `LiveClock` inside this file calls `useEffect` without importing it — dead code today (not rendered) but a latent crash if ever mounted.
- **BACKEND DEPENDENCIES:** none · **AI:** none · **INTEGRATIONS:** none
- **QCLAY HANDOFF:** a real, consistent global navigation model (this vs. Room Navigator vs. Community Hub rail is three navigation systems).
- **SCREENSHOT / VISUAL REFERENCE:** _(attach)_

### SH-NAV-002 · User button

- **ROUTE / LOCATION:** all pages · `components/auth/UserButton.tsx` mounted in `app/layout.tsx`
- **SEES / CAN DO:** signed-in identity chip; sign out. Reads the real Supabase session via `lib/auth/AuthProvider.tsx`.
- **VISUAL:** `V0 DRAFT` · **FUNCTIONAL:** `FUNCTIONAL`
- **LUKE:** NOT REVIEWED · **KAN:** NOT REVIEWED
- **ISSUES:** role is read from `user_metadata.role` (default `STUDENT`); the `profiles` table has no role column, so role is not a first-class fact (see `13` §4.1).

### SH-PAGE-001 · Login — `/login`

- **LOCATION:** `app/login/page.tsx` (179 lines) · `components/auth/EntryThreshold.tsx`, `AccessPortal.tsx`, `SignInModal.tsx`, `AuthBackground`, `orbit-fields/`
- **SEES:** cinematic dark entry ("threshold") with animated orbit fields and an access portal form (email + password); `?from=` return path supported.
- **CAN DO:** sign in with password (`supabase.auth.signInWithPassword` directly from the browser), go to register / forgot password.
- **WHY:** entry.
- **CONNECTS TO:** SH-PAGE-002…005, `/hub` (the only page that bounces here), `AM`.
- **VISUAL:** `V0 DRAFT` · **FUNCTIONAL:** `FUNCTIONAL` (real Supabase Auth)
- **LUKE:** NOT REVIEWED · **KAN:** NOT REVIEWED
- **DESIGN ISSUES:** uses `mtf-theme` purple/`SURFACE` tokens — a third palette; heavy motion on an entry screen; no reduced-motion path verified.
- **FUNCTIONAL ISSUES:** a parallel REST auth layer (`/api/auth/login|signup|logout|me|forgot|reset`) exists and **nothing in the UI calls it** — two auth implementations, one dead (`13` §2.1).
- **BACKEND:** Supabase Auth (`13` F1) · **INTEGRATIONS:** Supabase
- **FOUNDER DECISIONS (20 Sep 2026, second session):** **DL-029 — the face-scan mode is `DEMO/SIMULATION`**: `AccessPortal.tsx` lines 534–535 advance on timers (3.4 s / 5.2 s); `handleFaceAuth` (`app/login/page.tsx` 83–89) signs in a fabricated local user (`face-auth-user`, no Supabase session); no biometric verification exists. Future real secure authentication (device-native biometrics / Face ID / passkeys · email · confirmation codes · phone) = **FOUNDER DIRECTION**; KYC / account integrity = **OPEN**; the five concepts stay separate. The fate of the face-scan *UI* is unticked (`14` Q-27). **DL-027 — destination after login = the main Dashboard / Flight Deck workspace** (today: `?from` else `/`, lines 46 / 75 / 89 — not final). No implementation change yet.
- **QCLAY HANDOFF:** decide whether entry is cinematic or utilitarian; one auth palette.

### SH-PAGE-002 · Register — `/register` · `components/auth/IdentityCreation.tsx` — `V0 DRAFT` / `FUNCTIONAL` (`supabase.auth.signUp`). Same palette note. NOT REVIEWED ×2. **DL-027 (20 Sep 2026):** destination after registration = the main Dashboard / Flight Deck workspace (today `router.push("/copilot")`, `app/register/page.tsx` line 25 — not final; route unchanged yet).
### SH-PAGE-003 · Forgot password — `/forgot-password` — `V0 DRAFT` / `FUNCTIONAL` (`resetPasswordForEmail`). NOT REVIEWED ×2.
### SH-PAGE-004 · Reset password — `/reset-password` — `V0 DRAFT` / `FUNCTIONAL` (`updateUser`). NOT REVIEWED ×2.
### SH-PAGE-005 · Verify email — `/verify-email` (286 lines, inline in the page file, no component) — `ROUGH` / `FUNCTIONAL`. NOT REVIEWED ×2. **Design issue:** the only auth page not built from the `components/auth` kit.
### SH-STATE-001 · Auth callback — `/auth/callback` and `/api/auth/callback` (two callbacks) — `FUNCTIONAL`. **Issue:** duplicate callback routes; `NEEDS-V0-VERIFICATION` which one Supabase redirects to in production.

### SH-STATE-002 · Route protection (what is actually gated)

- **LOCATION:** `middleware.ts` → `lib/supabase/middleware.ts`
- **WHAT HAPPENS:** public prefixes `/welcome /pitch /docs /_next /api/health`. Protected roots: `/usage /support /integrations /developers /status /settings /billing /admin` — **none of these routes exist as pages.** `/profile /hub /copilot /nexus /intelligence` were deliberately removed from protection in July 2026 (code comment) because they render demo telemetry. ~~Only `/hub` self-redirects to `/login` in its own page file.~~ **Correction (D1 inspection, 20 Sep 2026):** `/hub`'s own guard was removed in the same July 2026 pass — **zero existing routes are gated anywhere** (`/hub` → 200 signed-out; `/settings` → 307 `/login?from=/settings`, then 404 after login because the page does not exist).
- **CONSEQUENCE:** the entire product, including `/dashboard`, is reachable signed-out. This is consistent with "everything is demo" and **inconsistent with any surface that claims to be "your" data**.
- **FOUNDER DECISION (DL-023, 20 Sep 2026):** the rule is now fixed — **public / marketing / auth / help surfaces may be signed-out; the personalised ARCHIO product requires login.** Profiles carry a public layer, a user-controlled shareable / social layer, and an always-private account / intelligence layer (email, phone, auth, private Trading DNA, AI memory, brokerage, journal / history never exposed by a connection). **D1 establishes only the public-vs-authenticated boundary** — the route-by-route list is D1's output for founder tick-off; the social permission matrix is a future dedicated block. *No middleware change is made by the decision itself.*
- **FOUNDER DECISION (DL-026, 20 Sep 2026 — second session):** **product-first exploration.** A signed-out visitor may land on ARCHIO and explore the real product environment — especially the chart / trading workspace — like a TradingView visitor, **not** a login wall. Identity is asked for at the moment of need: actions that require identity, persistence, personalisation, private data, community participation, personal AI context, account information, saved settings or deeper use trigger a natural login / register ask. Signed-out users never see another user's private / personalised data. **Consequence for this record:** the boundary is **per action / per data**, not "gate every product route"; the middleware rule to write later is not a blanket redirect. **OPEN:** the exact signed-out feature limits (route + action list) — D1 output.
- **VISUAL:** n/a · **FUNCTIONAL:** `PARTIAL` (works as written; protects nothing that exists)
- **FOUNDER DECISION NEEDED:** ~~which surfaces are private once real user data exists (this is a §9 flow question, not a page question).~~ → rule fixed by DL-023 + DL-026; remaining: the concrete route + action list (D1 output, founder tick-off). **Being written in D1 Block 2 (opened 22 Sep 2026, `docs/lego/D1-block-2-first-use.md`) as the Q-23 list — per surface: public / ask-at-need / authenticated; per action: what triggers the login / register ask. No middleware edit.**

### SH-STATE-003 · Global loading — `app/loading.tsx`, `app/login/loading.tsx` — the only two route-level loading states. `<Skeleton>` is used in 2 files (27 uses) product-wide. **Loading/skeleton treatment is effectively absent** (see §8).
### SH-STATE-004 · Global error / not-found — **none** (no `error.tsx`, no `not-found.tsx` anywhere). `components/dashboard/vantary/deck-stage-error-boundary.tsx` is the only error boundary and it is local to the trading desk.
### SH-STATE-005 · Toasts — `components/ui/toaster` mounted in `app/(main)/layout.tsx`; `<Toast` used once. Notification semantics otherwise live in per-feature UIs (`CO-PANEL-003`, `FD-WIDGET-…notifications`).

### SH-NAV-003 · Providers mounted on every `(main)` page
`CopilotProvider` (IL buddy system) · `CommunityHubGate` (CO floating hub) · `CommandLayer` (AA command bar) · `Toaster`. Root: `AuthProvider`, `AppInit`, `FloatingNav`, `UserButton`. **Design consequence:** three floating/overlay systems (nav strip, community hub, command layer, plus the Copilot FAB) compete for screen edges on every page. Register as one **founder decision**: how many persistent overlays may a page carry?

---

## 5. Level-1 system inventories

### 5.1 Flight Deck (`FD`)

Owner file: `components/dashboard/vantary/your-space.tsx` (33,482 lines) mounted by `components/dashboard/dashboard.tsx` at `/dashboard`. Design doctrine lives in `components/dashboard/vantary/DOCTRINE.md` ("hairline editorial language, earned motion, color discipline, honesty in placeholders, persistence and reconciliation"). **Everything on this page is demo telemetry** — there is no user account, trade, plan or event behind any number (`13` §2).

#### FD-PAGE-001 · Flight Deck / Your Space — `/dashboard`

- **SEES:** a full-viewport dark "cockpit": time/session spine at top (7 session phases: PRE-LONDON · LONDON KZ · LDN-NY GAP · NEW YORK KZ · LONDON CLOSE · POST-NY · OFF), the **Room Navigator** band (4 rooms), the **Active Window** dossier, gadget rails, the trading desk (chart + deck below chart), Strategy OS, Jarvis text surfaces, side detail rail, focus-rail dropdown, session debrief overlay, theme switcher, command palette.
- **CAN DO:** open any of 16 doors; customise gadgets (inspector, template picker); switch 7 themes; open command palette; toggle the Flight Deck Hub control room; interact with the chart; run Ask Archio prompts from doors.
- **WHY:** the private command centre — "what should I look at right now".
- **CONNECTS TO:** every other system (it is the hub).
- **VISUAL:** `V0 DRAFT` (highest-effort surface in the product)
- **FUNCTIONAL:** `MOCK DATA` (all telemetry), `PARTIAL` for the chart (real Polygon bars) and Ask Archio doors (real LLM).
- **LUKE:** NOT REVIEWED · **KAN:** NOT REVIEWED
- **DESIGN ISSUES:** 33k lines in one file makes piece-by-piece review hard — this record is the parent; approve children (`FD-*` below) individually. Seven themes means seven versions of every decision (§8.14). Density is extreme; no responsive/mobile behaviour verified.
- **FUNCTIONAL ISSUES:** no persistence of layout, gadgets or theme to a backend (some in `localStorage` — 8 keys product-wide); 13 TS errors in this file alone.
- **BACKEND:** would need accounts, trades, plans, events, preferences (`13` F5, F7, F8 — all MISSING) · **AI:** `/api/archio` via doors · **INTEGRATIONS:** Polygon (chart), TradingView (widget)
- **FOUNDER DECISIONS (20 Sep 2026, second session):** **DL-027** — this is the single destination after login *and* registration (routes not yet changed). **DL-030** — the surface is intended to become a highly customisable trader workspace (chart workspace · gadgets · controls beside / below the chart · themes · layout · quick-access settings · mentor-resold configurations = FUTURE/VISION); its **visible name is OPEN** — Dashboard · Flight Deck · Command Center are the founders' live terms; **"Your Space" (this component's name) and "Trading Terminal" (the site title) are not authoritative.** "Flight Deck" in this document is the `15` L1-1 handle, not a UI naming decision. **DL-026** — signed-out visitors may explore this workspace's *public* surfaces; the exact limits are OPEN (D1 output).
- **QCLAY HANDOFF:** this is the page QClay said the landing page cannot be finished without. Hand them approved *children*, not the parent.

#### FD-NAV-001 · Room Navigator (4 rooms × 4 doors) — `your-space.tsx` `FLIGHT_DECK_ROOMS`

> **DL-025 (20 Sep 2026):** the four categories are a **user navigation / command-centre abstraction**, not the seven systems; **working term = zones** (not "rooms" — reserved for Community after DL-020). Names kept **provisionally**; D1 inspects whether each name fits what lives beneath it. The record title and the code identifier `FLIGHT_DECK_ROOMS` are kept as history. Table column "Room" reads as "Zone".
>
> **DL-025 addendum (20 Sep 2026, second session):** the four-zone **model** stays (DECIDED, provisional). The **names and the placement of all 16 destinations below are OPEN — for Product Brain review.** The founders are not ready to approve the current placement; **nothing is renamed or moved before that review and a founder decision.** Each zone may contain subcategories · destinations · actions · features · AI guidance · reusable templates · deeper navigation (FOUNDER DIRECTION). MARKET FLOOR ≈ "What is happening right now?" (example intent only). Misfits found by the D1 inspection: `docs/lego/D1-block-1-front-door.md` KNOWN PROBLEMS 7.
>
> **DL-031 (22 Sep 2026) — PROVISIONAL D1 DESIGN DIRECTION. Luke approves; Kan's asynchronous review is pending (`14` Q-28) — NOT joint final approval; names reversible.** The Product Brain / Red Team reconciliation is complete enough to design against. The surviving direction is the table immediately below — it is the **design target**, not the code. **Nothing in `FLIGHT_DECK_ROOMS` has been renamed or moved.**

**Surviving direction (DL-031, provisional) — where today's 16 doors go:**

| Zone (working name) | Job | Destination in the direction | Today's door(s) it absorbs | Honesty status today |
|---|---|---|---|---|
| **MARKET FLOOR** | See what is happening in markets right now | Intelligence | Intelligence `/intelligence` | live page |
| | | Daily Brief | Daily Brief (Ask prompt → `/api/archio`) | real LLM |
| | | Live Calls — live / current first; history, summaries, outcomes = a later **sub-mode**, **no separate history door in D1** | Live Calls `/history` | live page, mock data |
| **TRADING DESK** (REVERSIBLE — Workbench / Studio are historical alternatives; never show all three) | Work on my trading | **Forecasts — exactly ONE trader-facing entry** (Forecast Hub functionality may sit behind it; public / mine / create modes not designed in D1) | Forecast Hub `/forecast` (from THE STUDIO) **+** Forecasts template `market.forecast-room` (from MARKET FLOOR) | sample data · real renderer |
| | | Copilot | Copilot `/copilot` | hard-coded prices |
| | | Post-Mortem | Post-Mortem (Ask prompt) | real LLM over **demo journal** |
| **THE ACADEMY** (REVERSIBLE — may be compared with education-oriented alternatives) | Learn how to trade better (broader than a course library) | Education | The Cockpit `/cockpit` (route rename still deferred — `14` N-7) | live page |
| | | Compare — **honest shell**, no mature mentor ecosystem implied | Compare template `mentors.compare-mentors` | real renderer, **no mentor data** |
| | | Mentor AI — **honest shell / demo** | Mentor AI (Ask prompt) | real LLM, **no mentor data** |
| **THE COLLECTIVE** | Find people and participate | Communities | Communities `/communities` | real `groups` + mock fallback |
| | | The Floor | The Floor (Ask prompt) | real LLM, no community data |
| | | Collab Hub | Collab Hub `/hub` (from MENTOR HALL) | mock, not gated |
| | *FUTURE* | **Marketplace — NOT a D1 door, NOT approved for implementation;** conceptual long-term home only | — | `15` V2 `SM` — VISION |
| **Leaves the zones → global Flight Deck chrome** | | Ask Archio — global assistant / navigation / explanation layer | (the Ask bar is already global) | AA-AI-001 / 002 |
| | | **Nexus → absorption candidate** into Ask Archio; **code kept** | Nexus `/nexus` (from THE STUDIO) | live page, mock — `14` D-19 |
| | | Profile / account / privacy / security → familiar account / avatar chrome | My Profile `/profile` (from THE COLLECTIVE) | live page, mock |
| | | Flight Deck customisation → stays on the deck as a workspace control (layout · gadgets · themes / colours · chart-adjacent settings) | Controls (event `flight-deck-hub:toggle` → FD-PANEL-001) (from THE COLLECTIVE) | UI only |

Count: 16 doors today → **10 destinations + 2 honest shells** in the direction; 4 doors become chrome; 2 doors merge into one. Discipline / accountability is **cross-cutting** (Academy teaches · Trading Desk / Intent shows adherence · Trading DNA shows patterns · Ask Archio explains) — no zone owns it alone. Centralized / Decentralized multi-environment contexts = FUTURE/VISION, UX OPEN, **not** in D1 chrome (DL-031). Naming flag: "Trading Desk" already names FD-SECTION-002 (`vantary/trading-desk/`) — `14` N-21.

**Today's code (unchanged):**

| Room | Door | Kind | Target | Status today |
|---|---|---|---|---|
| **MARKET FLOOR** "What's happening right now." | Intelligence | href | `/intelligence` | live page |
| | Live Calls | href | `/history` | live page (mock data) |
| | Forecasts | template | `market.forecast-room` | real renderer |
| | Daily Brief | Ask prompt | "What matters for EUR/USD today?" → `/api/archio` | real LLM |
| **THE STUDIO** "Make something today." | Forecast Hub | href | `/forecast` | live page (sample data) |
| | Copilot | href | `/copilot` | live page (hard-coded prices) |
| | Post-Mortem | Ask prompt | "Why did I lose yesterday?" | real LLM over **demo journal** |
| | Nexus | href | `/nexus` | live page |
| **MENTOR HALL** "Learn from the best." | Compare | template | `mentors.compare-mentors` | real renderer |
| | Collab Hub | href | `/hub` | live page (mock) — ~~login-gated~~ **NOT gated** (guard removed July 2026 per the code comment in `app/(main)/hub/page.tsx`; verified HTTP 200 signed-out, D1 inspection 20 Sep 2026) |
| | The Cockpit | href | `/cockpit` | live page |
| | Mentor AI | Ask prompt | "What would my mentor flag…" | real LLM, no mentor data |
| **THE COLLECTIVE** "Find your ecosystem." | Communities | href | `/communities` | live page (real `groups` + mock fallback) |
| | The Floor | Ask prompt | "Summarize what the community is discussing…" | real LLM, no community data |
| | My Profile | href | `/profile` | live page (mock) |
| | Controls | event | `flight-deck-hub:toggle` | opens FD-PANEL-001 |

- **VISUAL:** `V0 DRAFT` · **FUNCTIONAL:** `PARTIAL` (all doors open; 4 doors deliver AI over demo data)
- **LUKE / KAN:** NOT REVIEWED
- **DESIGN ISSUES:** ~~the four room names (MARKET FLOOR / STUDIO / MENTOR HALL / COLLECTIVE) are a fourth naming layer on top of Structural Map v1's seven systems~~ → **by decision (DL-025) they are not a map layer at all**: a navigation abstraction that compresses capabilities into four immediate destinations. The open design question is **fit**: does each name describe what is actually beneath it today (see the door table — e.g. MENTOR HALL currently holds an Education page, a login-gated hub and an AI prompt with no mentor data). Response-engine `RoomId` (`studio`, `market-floor`) remains a separate code-identifier layer. See `14` §3 N-10.
- **FUNCTIONAL ISSUES:** the July 2026 comment says only 2 templates have real renderers; 8 further `community-*` template files now exist — `NEEDS-V0-VERIFICATION` which are wired vs. `warming()` (19 `warming()` stubs remain in `template-registry.ts`).

#### FD-PANEL-001 · Flight Deck Hub (control room) — `cartouche/flight-deck-hub.tsx` (custom `role="dialog"`)
Full-screen control room for choosing gadgets/templates; opened by the Controls door or `flight-deck-hub:toggle`. `V0 DRAFT` / `UI ONLY` (choices not persisted server-side). NOT REVIEWED ×2. **QClay:** this is the "Workspace Customizer" from the legacy QClay inventory (01.3).

#### FD-MODAL-001 · Template picker — `cartouche/template-picker.tsx` — `V0 DRAFT` / `UI ONLY`. NOT REVIEWED ×2.
#### FD-PANEL-002 · Gadget inspector — `cartouche/gadget-inspector.tsx` — `V0 DRAFT` / `UI ONLY`. NOT REVIEWED ×2.
#### FD-SEARCH-001 · Command palette — `vantary/command-palette.tsx` (`role="dialog"`) — keyboard-first jump to doors/gadgets. `V0 DRAFT` / `FUNCTIONAL` (client). NOT REVIEWED ×2. **Naming flag:** distinct from the Ask Archio **Command bar** (`AA-AI-001`) — two "command" things.
#### FD-NAV-002 · Focus-rail dropdown — `vantary/focus-rail-dropdown.tsx` — `V0 DRAFT` / `UI ONLY`.
#### FD-PANEL-003 · Side detail rail — `vantary/side-detail-rail.tsx` — `V0 DRAFT` / `MOCK DATA`.
#### FD-STATE-001 · Session debrief overlay — `vantary/session-debrief.tsx` (`SessionDebriefOverlay`) — end-of-session summary. `V0 DRAFT` / `MOCK DATA`. **Connects to** IL review (would be real only with trades).
#### FD-NAV-003 · Theme switcher — `vantary/theme-switcher.tsx`, `theme-system.ts` — 7 themes: `teal` (TEAL_GLASS) · `cyber` · `neural` · `quantum` · `solar` · `light` · `obsidian`. `V0 DRAFT` / `FUNCTIONAL` (client). **Founder decision (§8.14):** ship 7 themes, 2, or 1?

#### FD-WIDGET-001…026 · Living gadgets (v1 registry) — `cartouche/living-gadgets.tsx`, `living-gadget.tsx`, `gadget-slot.tsx`, `instruments.tsx`
Registry ids (all `MOCK DATA`, all `V0 DRAFT`, NOT REVIEWED ×2): Identity — `firm` (Firm & Phase) · `desk` · `tier` · `accounts` · `day-count` · Performance — `equity-beacon` · `win-rate` · `profit-factor` · `avg-r` · `accuracy` · `equity-spark` (Equity Trend) · Activity — `last-5-trades` · `last-trade` · `current-streak` · Plan — `trades-used` · Discipline — `discipline-ring` · `consistency-ring` · `revenge-risk` · Setups — `best-pair` · `worst-pair` · `best-setup` · `best-session` · Macro — `session-clock` · `next-event` · Goals — `primary-goal` · `discipline-streak`.
**Every one of these requires trades + plans + rules data that does not exist (`13` F7).** Approving the visual of a gadget is fine; do not approve its *promise* until the data path is named.

#### FD-WIDGET-027…039 · Living gadgets v2 — `cartouche/living-gadgets-v2.tsx`
`firm-identity` (s) · `win-rate-heart` (s) · `best-pair` (s) · `macro-pulse` (s) · `accuracy-engine` (m) · `session-clockwork` (m) · `discipline-pulse` (m) · `equity-beacon-live` (m) · `management-pulse` (l) · `last-5-trades` (l) · `risk-envelope` (s) · `daily-plan` (m) · `goals-beacon` (m). **Duplication flag:** v1 and v2 registries overlap (`best-pair`, `last-5-trades`, equity beacon). Founder decision: retire v1 or v2.

#### FD-SECTION-001 · Active Window — `vantary/active-window/` (`active-window-dossier.tsx`, `day-playbook-canvas.tsx`, `temporal-anchor-rail.tsx`, `archio-pulse-dot`, `archio-rotating-label`, `archio-seam`; own `MASTERPLAN.md`)
"What is the market doing in *this* window and what is my plan for it" — dossier + day playbook canvas + temporal anchor rail. `V0 DRAFT` / `MOCK DATA`. **Connects to** IL (the playbook is a plan), MX (session context). NOT REVIEWED ×2.

#### FD-SECTION-002 · Trading Desk — `vantary/trading-desk/` (40 files: `shell.tsx`, `chart.tsx`, `navigator.tsx`, `deck/deck-surface.tsx`, `deck/deck-below-chart.tsx`, `execution-console/`, `modules/`, `pickers.tsx`, `customize-popover.tsx`, `side-slot.tsx`, `provider.tsx`)
- **SEES:** TradingView-style chart (grid removed via `overrides` per Live Room plan), instrument navigator, a "deck below the chart" of modules, an execution console, customise popover.
- **FUNCTIONAL:** `PARTIAL` — chart data real (Polygon via `/api/polygon/bars`), execution console `UI ONLY` (no broker; `13` F10 MISSING).
- **VISUAL:** `V0 DRAFT`. NOT REVIEWED ×2.
- **QCLAY:** this is the legacy "Account & Execution Center" (01.4) in embryo.

#### FD-SECTION-003 · Strategy OS — `vantary/strategy-os/` (`dna.tsx`, `exposure.tsx`, `rules.tsx`, `mirror.tsx`, `sync.tsx`, `intel.tsx`, `header.tsx`, `derive.ts`, `data.ts`)
Strategy identity ("DNA"), exposure, rules, mirror (stated vs actual), sync, intel. `V0 DRAFT` / `MOCK DATA`. **OWNER: PROPOSED** — this is conceptually **Trading DNA / Personal Intelligence**, which is not a Level-1 system in Structural Map v1; placed under FD because it renders there; flagged in `14` §3 (DNA vs Personal Intelligence). NOT REVIEWED ×2.

#### FD-SECTION-004 · Jarvis surfaces — `vantary/jarvis/` (`jarvis-text.tsx`, `jarvis-rule.tsx`, `surfaces/` incl. `equity-period-spine.tsx`)
Typographic "AI voice" surfaces that narrate the deck. `V0 DRAFT` / `MOCK DATA`. **Naming flag:** "Jarvis" is an internal codename appearing in code; user-facing name is Archio. NOT REVIEWED ×2.

#### FD-TPL-001…010 · Flight Deck templates — `vantary/flight-deck/templates/`
`forecast-room` (real) · `compare-mentors` (real) · `community-hub` (fetches `/api/communities`) · `community-atlas` · `community-profile` · `compare-ecosystems` (15 TS errors) · `discover-ecosystems` · `live-activity` · `my-fit-analysis` · `warming-previews` (the "warming up" placeholder). Shell: `template-shell.tsx`, `flight-deck-viewport.tsx`, `template-registry.ts` (19 `warming()`), `theater/`. `V0 DRAFT` / mostly `MOCK DATA`. **Design issue:** a door that opens `warming-previews` is exactly what the July comment calls a "useless door" — verify none remain.

#### FD-SECTION-005 · Response-engine registry (generated-template state) — `vantary/response-engine/registry.tsx`, `primitives.tsx`
Renders the schema-validated JSON envelope from `/api/archio` into UI (tone, drivers, levels, confidence). `V0 DRAFT` / `FUNCTIONAL` for the two intents that have templates (`trade-post-mortem`, `asset-deep-dive`); other intents fall back to generic rendering. See `AA-TPL-001`.

#### FD-WIDGET-040…051 · Legacy dashboard modules — `components/dashboard/modules/` (12): `accounts` · `action-paths` · `arrival-layer` · `daily-plan` · `notifications` · `performance` · `personal-state` · `private-notes` · `psychology` · `relevance-stream` · `reset-mode` (with `ResetModeOverlay`) · `strategy-health`
`ROUGH`→`V0 DRAFT` (pre-Vantary era) / `MOCK DATA`. **Duplication flag:** `daily-plan`, `accounts`, `psychology`, `performance` duplicate concepts in living gadgets and Strategy OS. Founder decision: mounted or retired? `NEEDS-V0-VERIFICATION` which of the 12 are still rendered.

#### FD-SECTION-006 · Command Desk — `components/dashboard/command-desk/` (`command-desk.tsx`, `neural-orb.tsx`, `summoned-workspace.tsx`)
A "summoned workspace" with a neural orb. `V0 DRAFT` / `UI ONLY`. `NEEDS-V0-VERIFICATION` whether mounted. **Naming flag:** third "command" surface.

> **`/cockpit` (ED-PAGE-001) — DL-025 (20 Sep 2026):** the collision with "the cockpit surface" (= Flight Deck, `09` §2) is **recorded for a later rename**; the replacement name is deliberately not chosen yet (pick it when the Education flows are mapped, D7).

#### FD-STATE-002 · First-run / onboarding state — **none found** on `/dashboard`. `FlightDeckRoomIgnitionOverlay` (room-entry animation) exists; a genuine first-time-user state does not. `NOT DESIGNED` → **DECIDED (DL-024, 20 Sep 2026): no large mandatory onboarding; a lightweight optional guide may support the guided empty state. To be designed in D1 — the onboarding system itself is not invented in D1.** **DL-024 addendum (second session): a short optional tutorial after first sign-in = FOUNDER DIRECTION** (may introduce Flight Deck · chart area · Community · controls beside / below the chart · gadgets · major navigation · Ask Archio / question bar; returns the user to the workspace); **full tutorial design = OPEN / later block.** **DL-028:** Ask Archio as the conversational guide ("what are you? · what can you do? · where do I go? · how does this work?") = FOUNDER DIRECTION, not a spec. **D1 Block 2 (22 Sep 2026) defines only WHERE an optional lightweight tutorial entry would sit and how it is dismissed — not the tutorial itself (`docs/lego/D1-block-2-first-use.md`).**
#### FD-STATE-003 · Empty state — **none**: with no user data the page shows demo data, not emptiness. `NOT DESIGNED` → **DECIDED (DL-024, 20 Sep 2026): GUIDED EMPTY STATE** — the real Flight Deck, no fake personal numbers, useful and alive, guides first actions, explains what each area becomes with real information, configuration optional and gradual. **To be designed in D1.** **This is the single most important missing state in the product** — the moment a real user with zero trades opens the Flight Deck. **D1 Block 2 opened 22 Sep 2026 (Luke's order; Kan reviews asynchronously) as the design-definition of this state for three user states — signed-out explorer · brand-new signed-in zero-data · returning signed-in with real data: `docs/lego/D1-block-2-first-use.md`. Still no product code.**
#### FD-STATE-004 · Error state — `deck-stage-error-boundary.tsx` only (trading desk). Elsewhere `NOT DESIGNED`.
#### FD-STATE-005 · Responsive / mobile — `UNKNOWN`; `hooks/use-mobile.tsx` exists; no verified mobile layout of the Flight Deck.

---

### 5.2 Intent Loop / Decision experience (`IL`)

The loop per `10`: CAPTURE → DECISION → ACTUAL TRADE → COMPARE → REVIEW → MEMORY → TRADER MODEL. In code, three separate UI families express pieces of it, **none persists anything** (`13` §3.3, F7).

#### IL-PAGE-001 · Forecast Hub — `/forecast` · `components/forecast-hub/forecast-hub.tsx` (+11 files, 24,417 lines)

- **SEES:** a scope navigator and four views — **Feed** (`forecast-feed.tsx`, cards with direction LONG/SHORT, instrument class Forex/Crypto/Indices/Commodities, status lifecycle, confluences, inline detail), **My Record** (`forecast-my-record.tsx`), **Leaderboard** (`forecast-leaderboard.tsx`), **Archive** (`forecast-archive.tsx`, by day). Plus **Submit drawer** (`forecast-submit-drawer.tsx`), **Detail drawer** (`forecast-detail-drawer.tsx`) and **Detail Intelligence** (`forecast-detail-intelligence.tsx`, 13,513 lines).
- **CAN DO:** browse, filter, open detail, open submit drawer and fill a forecast (thesis, direction, levels, invalidation, confidence), view own record and leaderboard.
- **WHY:** "Make a call. Prove it." — a public Decision Record with a timestamp and outcome (conceptually the loop's CAPTURE + REVIEW for a *prediction*).
- **CONNECTS TO:** TP (verified record), CO (leaderboard/feed are social), AA (`market.forecast-room` template), FD door.
- **VISUAL:** `V0 DRAFT` (own token file `forecast-vantary-tokens.ts` + `mtf-theme` accents — two palettes in one page)
- **FUNCTIONAL:** `MOCK DATA` — `SAMPLE_FORECASTS` constant; **submitting a forecast stores nothing** (no table, no API, no `localStorage`). `forecast_groups` table exists in SQL with a comment "References forecasts table (to be created)" and **zero code references** (`13` §3.3).
- **LUKE:** NOT REVIEWED · **KAN:** NOT REVIEWED
- **DESIGN ISSUES:** 21 TS errors in `forecast-feed.tsx`; the user role/tier model here (`student|trader|mentor`, `beginner…expert`) is its own — not the auth role model.
- **FUNCTIONAL ISSUES:** the whole "Prove it" promise is unbacked. Forecast **is** a Decision Record shape — the ledger (DL-001/DL-011) says the object is the Decision Record with per-field provenance; this UI has no provenance fields.
- **BACKEND:** `forecasts` table (MISSING), resolution job (MISSING), `13` F7 · **AI:** detail intelligence panel is scripted/mock · **INTEGRATIONS:** market data for resolution (Polygon exists)
- **QCLAY HANDOFF:** this is the legacy QClay "Decision Desk 03.2/03.3". Founders must first decide: is Forecast the public face of the Decision Record, or a separate object? (`14` §3 row "Decision Desk vs Intent Loop vs Forecast").

##### IL-DRAWER-001 · Forecast submit drawer — `V0 DRAFT` / `UI ONLY` (form works, nothing saved). Capture-design target per DL-012 is "one tap + optional one line" — this drawer is a long form. **Contradiction flagged §12.**
##### IL-DRAWER-002 · Forecast detail drawer — `V0 DRAFT` / `MOCK DATA`.
##### IL-PANEL-001 · Forecast detail intelligence — 13.5k lines, `V0 DRAFT` / `MOCK DATA`. Largest single non-dashboard file; needs its own child review.
##### IL-TAB-001…004 · Feed / My Record / Leaderboard / Archive — each `V0 DRAFT` / `MOCK DATA`.
##### IL-MODAL-001 · Legacy forecast modals — `components/create-forecast-modal.tsx`, `submit-forecast-modal.tsx`, `student-forecast-modal.tsx`, `create-forecast-cockpit.tsx`, `forecast-brain.tsx`, `forecast-engine-section.tsx`, `forecast-history-panel.tsx`, `forecast-share-card.tsx`, `forecast-notification-view.tsx`, `student-forecast-system.tsx` — **ten loose forecast components from an earlier era.** `ROUGH` / `MOCK DATA`. `NEEDS-V0-VERIFICATION` which are mounted; likely `SUPERSEDED` by Forecast Hub. Founder decision: delete or archive.

#### IL-PAGE-002 · Execution Copilot — `/copilot` · `components/execution-copilot/execution-copilot-layout.tsx` (+34 files)

- **SEES:** `SignalTerminalHeader` (instrument selector), `CopilotChartPanel` (TradingView widget), right column with `TradeExecutionPanel` (from `components/copilot/trade/`), `ConfluenceBottomBar`, plus `copilot-trade-plan.tsx` (instrument, direction, entry, stop, target, reasoning), `copilot-checklist.tsx`, `pre-flight-analysis.tsx`, `live-commentary.tsx`, `monitoring-widget(s).tsx`, `pnl-widget.tsx`, `gauge-widget.tsx`, `price-ticker.tsx`, `instrument-search-modal.tsx`, `copilot-ai-terminal.tsx`, `copilot-instructions-panel.tsx`, `copilot-help-trigger.tsx`.
- **CAN DO:** pick instrument, view chart, fill a trade plan, tick a checklist, read pre-flight analysis and commentary, "execute" (nothing happens — no broker).
- **WHY:** the DECISION → EXECUTION seam of the loop: plan before ticket.
- **CONNECTS TO:** FD trading desk (duplicate chart + execution console), AA (`copilot-ai-terminal`), IL review.
- **VISUAL:** `V0 DRAFT` · **FUNCTIONAL:** `UI ONLY` — current prices are **hard-coded** in the layout (`EURUSD 1.08423 · BTCUSD 67234 · XAUUSD 2341.50`), execution has no backend.
- **LUKE / KAN:** NOT REVIEWED
- **DESIGN ISSUES:** two execution UIs exist (this and `FD-SECTION-002` execution console); no visual relationship between them.
- **FUNCTIONAL ISSUES:** `copilot-trade-plan.tsx` is named in `08` as the "right shape for a Decision Record capture" — it has no provenance, no lock, no timestamp, no save.
- **BACKEND:** `decision_records`, `trades` (MISSING, `13` F7) · **INTEGRATIONS:** broker read-only (MISSING, F10) · **AI:** terminal is UI over scripted `/api/copilot/chat`
- **QCLAY:** legacy "Pre-Trade Contract 03.5 / Decision Builder 03.4".

#### IL-PANEL-002 · Copilot "buddy" system — `components/copilot/` (52 files, 38,053 lines)
- **LOCATION:** `CopilotProvider` mounted for every `(main)` page; `CopilotFAB` → `CopilotDrawer`; right rails `CopilotRightRail.tsx`, `EnhancedCopilotRightRail.tsx`, `OptimizedCopilotRightRail.tsx` (**three variants of the same rail**); `CopilotSplit`; tabs registry (`tabs/ActivityTab.tsx` + labels **AI Copilot · Edge Tracker · Entry · Live Feed · Mentor Dashboard · Psychology · SL · Strategy OS · TP**); subsystems `ai/` (10) · `analytics/` (5) · `chat/` (3, `CopilotChatPanel` with `useChat`) · `coach/` (3) · `journal/` (1) · `onboarding/` (3) · `order-layer/` (2) · `psychology/` (3) · `simulator/` (2) · `social/` (1) · `strategy/` (3) · `trade/` (1) · `activity/` (2, `ActivityNotifications`, `EventTimeline`).
- **SEES:** a floating assistant with tabs for journal, psychology, strategy, simulator, order layer, activity timeline, chat.
- **FUNCTIONAL:** `MOCK DATA` throughout; the event bus (`lib/copilot/eventBus.ts`, watchers `riskWatcher`, `copyWatcher`, `progressWatcher`) emits client events; **persistence to `copilot_events` is commented out** (`CopilotProvider.tsx` lines 6, 49) — `13` §3.2.
- **VISUAL:** `V0 DRAFT`→`ROUGH` mix (older era than Vantary)
- **LUKE / KAN:** NOT REVIEWED
- **DESIGN ISSUES:** overlaps FD Strategy OS (Strategy OS tab), FD modules (psychology, journal), AA (chat). This is the clearest case of **the same concept built three times**.
- **FUNCTIONAL ISSUES:** `EventTimeline`/`ActivityNotifications` are the only UI for the "one event, many consumers" principle — and the event never leaves the browser.
- **QCLAY:** do not hand this over until founders pick one home for journal, psychology, strategy.
- **OWNER: PROPOSED** — placed under IL because its tabs are the loop's MEMORY/REVIEW; parts belong to AA (chat) and FD (rail).

##### IL-DRAWER-003 · Copilot drawer — `CopilotDrawer.tsx` — `V0 DRAFT` / `MOCK DATA`.
##### IL-TAB-005…013 · Copilot tabs — AI Copilot · Edge Tracker · Entry · Live Feed · Mentor Dashboard · Psychology · SL · Strategy OS · TP — each `MOCK DATA`. "Entry / SL / TP" are order fields as *tabs* — design question.
##### IL-MODAL-002 · Tutorial overlays — `ActivityTutorialOverlay`, `PsychologyTutorialOverlay`, `StrategyTutorialOverlay`, `ActivityGuideOverlay` — first-time-state overlays for copilot tabs. `V0 DRAFT` / `UI ONLY`. Also listed under ED.
##### IL-FLOW-001 · Copilot onboarding — `copilot/onboarding/` (3 files) — `V0 DRAFT` / `UI ONLY`. The only onboarding flow in the product and it onboards to the *copilot*, not to ARCHIO.

#### IL-SECTION-001 · Live Room ledger — `components/live-room/session-store.tsx`, `session-state.ts`
Append-only `SessionEvent` ledger with derived lenses (BREAKDOWN / INTELLIGENCE / TIMELINE / ANATOMY) and phase-aware tools (ORDER FLOW / COMPARE PLAN / ORACLE SUMMARY / FORECAST THIS). Client memory only. The natural **capture surface during a live mentor session** (`08`). Primary record under `CO-PAGE-003`.

#### IL-SECTION-002 · Scenario system — `components/create-scenario-modal.tsx`, `scenario-edit-modal.tsx`, `scenario-selector.tsx`, `floating-scenario-panel.tsx`, `user-scenario-card.tsx`, `lib/scenario-store.ts`
"If price does X I do Y" scenarios. `ROUGH` / `MOCK DATA` (store is client). Conceptually a **conditional Decision Record**. `NEEDS-V0-VERIFICATION` if mounted.

#### IL-STATE-001 · Empty / first-decision state — `NOT DESIGNED`. There is no "you have not recorded a decision yet" anywhere.
#### IL-STATE-002 · Review after outcome — `SessionDebriefOverlay` (FD) and Post-Mortem door (AA over demo journal). No real REVIEW surface. `NOT DESIGNED` for real data.

---

### 5.3 Market Experience (`MX`)

#### MX-PAGE-001 · Signal Terminal — `/` · `components/live-market-intelligence.tsx` (dynamic import)
- **SEES:** instrument cards with price, change %, sparkline; sections drawn from the loose analysis components.
- **FUNCTIONAL:** `MOCK DATA` — prices come from `generateMockPriceData(instrument.symbol)` **even though real `/api/polygon/*` routes exist and are used elsewhere.** This is the product's front door after login and it shows invented prices.
- **VISUAL:** `ROUGH`→`V0 DRAFT` (pre-Vantary green/red semantics `#34d399` / `#f87171`)
- **LUKE / KAN:** NOT REVIEWED
- **DESIGN ISSUES:** named "Signal Terminal" in nav, "Live Market Intelligence" in code, "Market Intelligence dashboard" in the door descriptor — three names.
- **FUNCTIONAL ISSUES:** highest-priority honesty fix in MX: swap mock generator for the existing Polygon snapshot.
- **BACKEND:** `13` F6 market-data gateway (REAL, unused here) · **INTEGRATIONS:** Polygon
- **QCLAY:** decide whether `/` is a terminal, a home, or redirects to `/dashboard`.

#### MX-PAGE-002 · Macro Economic — `/intelligence` · `components/mrkt-intelligence-dashboard.tsx`
Composes: `economic-calendar.tsx`, `central-bank-events.tsx`, `live-headlines.tsx`, `market-sentiment.tsx`, `currency-market-summary.tsx`, `fundamental-drivers.tsx`, `trump-tracker.tsx`, `macro-analysis-display.tsx`, `key-insights-panel.tsx`, `news-ai-breakdown-modal.tsx`, `components/macro/` (1,216 lines). `ROUGH`→`V0 DRAFT` / `MOCK DATA` (env vars `FINNHUB_KEY`, `ALPHAVANTAGE_KEY` are referenced once each — `NEEDS-V0-VERIFICATION` whether any real call is live). NOT REVIEWED ×2. **Design issue:** "Trump tracker" is a dated, opinion-bearing widget — founder call.

#### MX-PAGE-003 · Nexus — `/nexus` · `components/nexus/` (mindmap, control panel, AI synthesis panel, node detail panel, legend), `hooks/use-nexus-graph.ts`
Force/circular graph of market nodes (types: `market`, `correlation`, `event`, `indicator`, `influence`, `opportunity`, `risk`, `trend`) with an AI synthesis panel. `V0 DRAFT` / `MOCK DATA` (default layouts hard-coded). NOT REVIEWED ×2. **OWNER: PROPOSED** — MX (it maps market relationships); the Room Navigator files it under Studio / "Review & Synthesis". Founder decision. **DL-031 (22 Sep 2026, provisional — Luke): Nexus is currently considered a likely legacy duplicate whose broad "all-knowing ARCHIO" job is absorbed by Ask Archio; it leaves the zone direction (no longer a TRADING DESK door). Do NOT delete code yet — `14` D-19; fate decided with N-8 / Q-8 (D4).**

#### MX-SECTION-001 · Confluence system — `chart-confluences.tsx`, `confluence-editor.tsx`, `confluence-modal.tsx`, `custom-confluence-modal.tsx`, `enhanced-confluence-selector.tsx`, `floating-confluence-menu.tsx` (`role=dialog`), `floating-confluence-panel.tsx`, `rich-confluence-card.tsx`, `components/ultra-confluence/` (4 files), `lib/confluences.ts`, `lib/confluence-price-engine.ts`, `execution-copilot/bottom-panel/confluence-modal.tsx`, `/docs/ultra-breakdown` (explainer page)
A "confluence" = a stack of technical reasons at a level. `ROUGH` / `PARTIAL` (price engine uses real bars in places). **Duplication flag:** three confluence modals. NOT REVIEWED ×2. **Connects to** IL (a confluence is the *reasoning* field of a Decision Record).

#### MX-SECTION-002 · Multi-timeframe (MTF) — `components/mtf/` (7 files: `compact-chart`, `command-deck`, `insight-panel`, `ambient-field`, `mtf-theme.ts`), `multi-timeframe-display.tsx`, `lib/multi-timeframe-analysis.ts` — `V0 DRAFT` / `PARTIAL`. Its `mtf-theme.ts` (purple/amber `ACCENT`, `SURFACE`, `PHASE_COLOR`, `TAB_ACCENT`) is imported by **login and forecast** too — a de-facto second design system (§8).

#### MX-SECTION-003 · Session / liquidity / range analysis — `session-analysis-display.tsx` (**58 TS errors**, calls **non-existent** `/api/market/stats` twice), `liquidity-analysis-display.tsx`, `range-tracker.tsx`, `zone-heatmap.tsx`, `market-zone.tsx`, `market-state-instrument.tsx`, `lib/session-analysis.ts`, `lib/liquidity-analysis.ts` — `ROUGH` / `MOCK DATA` + dead API call. **Functional issue:** the missing route means this component silently fails today.

#### MX-SECTION-004 �� Charts — `trading-view-widget.tsx` (TradingView `tv.js`, grid overrides), `single-trading-chart.tsx`, `live-charts-section.tsx`, `inline-chart-analysis.tsx`, `components/charts/` (1), `chart-share-modal.tsx`, `premium-chart-analysis-modal.tsx` — `PARTIAL` (TradingView embed real; overlays via `/api/market/overlays`). **Rejected-ideas note (`01`):** "TradingView embedded as the centre of the cockpit" is rejected as differentiator; it is still the centre of `/copilot` and the trading desk. Flagged §12.

#### MX-SECTION-005 · Oracle — `components/oracle/oracle-node.tsx` (**26 TS errors**), `vantary/oracle-command-console.tsx` (18 errors), `oracle-data.ts`, `lib/oracle/`, `OracleSheet` — an "oracle" reading of the tape. `V0 DRAFT` / `MOCK DATA`. **Naming flag:** Oracle vs Ask Archio vs Jarvis.

#### MX-SECTION-006 · Analysis history & boxes — `analysis-boxes.tsx` (22 errors), `analysis-card.tsx`, `analysis-history-modal.tsx`, `lib/analysis-history.ts`, `lib/analysis-data.ts`, `lib/stores/useAnalysis.ts` (real Polygon composition), `metrics-grid.tsx`, `advanced-filter-system.tsx` (10 errors) — `ROUGH` / `PARTIAL`.

#### MX-STATE-001 · Market-closed / weekend state — `UNKNOWN` (session phases exist in FD; no explicit closed-market UI found).
#### MX-STATE-002 · Data-unavailable state — `UNKNOWN`; the mock generators mask provider failure.

---

### 5.4 Education (`ED`)

**Backend reality first:** there are **no** education tables, APIs, storage buckets, content models, courses, lessons, progress or enrollments anywhere in the repo (`13` §3.1). Everything below is UI, narrative, or tutorial chrome.

#### ED-PAGE-001 · The Cockpit — `/cockpit` · `components/cockpit/CockpitExperience.tsx`, `CockpitRailNav.tsx`, `cockpit-data.ts`, `sections/` (Hero · Spine · Flow · Principles · Ecosystem · Rail · Close)
A guided "Analyze → Forecast → Execute" narrative with rail navigation. `V0 DRAFT` / `UI ONLY`. NOT REVIEWED ×2. **OWNER: PROPOSED** — ED (it teaches the method); it reads as a marketing scroll page. Founder decision: is this Education, Onboarding, or MK?

#### ED-PAGE-002 · Student Collaboration Hub — `/hub` · `components/student-collaboration-hub.tsx`, `components/hub/student-dashboard.tsx`, `hub/dashboard-skeleton.tsx`, plus loose `student-hub.tsx`, `student-section.tsx`, `student-original-analysis.tsx`
The only page that requires login (self-redirect). Student dashboard skeleton, cohort views. `ROUGH` / `MOCK DATA`. NOT REVIEWED ×2. **Note:** the only real `<Skeleton>` loading treatment in the product lives here.

#### ED-SECTION-001 · Mentor method components — `components/mentor/` (10): `MethodVault`, `EntryModelCards`, `MentorAIChat`, `MentorDashboardRail`, `MentorIdentityHeader`, `BiasContext`, `DayFilterStrip`, `RiskGuidanceBar`, `SessionGate`, `WarRoomLauncher` — a mentor's curriculum-as-components. `ROUGH` / `MOCK DATA`. `NEEDS-V0-VERIFICATION` where mounted (likely inside the Community Hub `mentor-hub` view).

#### ED-SECTION-002 · Coach & tutorials — `copilot/coach/` (`MentorGuideAndTutorial`, `CopilotMentorConsole`, `CoachQna`), `CoachButtons`, `CoachChecklist`, `lib/stores/coach.ts`, `coachProfile.ts` — `ROUGH` / `MOCK DATA`.
#### ED-MODAL-001 · Guide / education modals — `ProfessionalGuideModal`, `EducationPopup`, `ShortcutsOverlay`, the four tutorial overlays (IL-MODAL-002) — `V0 DRAFT` / `UI ONLY`.
#### ED-SECTION-003 · Glossary / explain-term — `live-room/glossary.ts`, `explain-term.tsx` (`role=dialog`) — inline term explanations in the Live Room. `V0 DRAFT` / `FUNCTIONAL` (static glossary). **Good pattern** for "General ARCHIO Intelligence" (`11` §3) — the only place education is contextual.
#### ED-STATE-001 · Progress / completion state — `NOT DESIGNED` (no progress model exists).
#### ED-STATE-002 · Curriculum browser / course detail / enrollment — `NOT DESIGNED`. (Legacy QClay inventory 02.5 "Room Memory / Knowledge Library" and 02.7 "Student Progress" have no UI.)

---

### 5.5 Community & Opportunity (`CO`)

#### CO-PAGE-001 · Community Discovery — `/communities` · `components/communities/DiscoveryEngine.tsx`, `CommunityObject.tsx`, `CommunityInspector.tsx`, `discovery-dimensions.ts` (`ALL_DIMENSIONS`)
- **SEES:** a discovery engine (search + dimension filters: asset class, trading style, session focus, has AI, has live calls, verified, beginner-friendly, has mentor dashboard, visibility, sort), community objects, an inspector panel.
- **FUNCTIONAL:** `PARTIAL` — `/api/communities` reads the real `groups` table (with the 12 discovery columns added by `004_community_hub_alter_groups.sql`) and **falls back to `MOCK_COMMUNITIES` when the table is missing or empty**, returning `source: "mock"`. Whether the live DB has rows: `CANNOT VERIFY LIVE DB FROM REPO`.
- **VISUAL:** `V0 DRAFT` · **LUKE / KAN:** NOT REVIEWED
- **DESIGN ISSUES:** "communities" here = `groups` table; the older org/room model is a different thing (`13` F3 — two tenancy models). **DECIDED 20 Sep 2026 (DL-020): the target structure is Model B — organization / community → rooms → memberships**; the `groups`-only model is superseded for design. This page still reads `groups` today (repo fact preserved); no migration is approved yet.
- **BACKEND:** `groups`, `group_members` (REAL schema; `group_members` has 4 `.from()` callers) · **AI:** none
- **QCLAY:** legacy 02.1/02.2.

#### CO-PANEL-001 · Floating Community Hub — `components/community-panel/floating-community-hub.tsx` (+14 files, 15,862 lines), gated by `community-hub-gate.tsx` on every `(main)` page
- **SEES:** a floating rail/panel with 13 views: `dashboard` · `entry-room` · `live-stage` (→ Live Room) · `call-history` · `daily-gameplan` · `forecast-feed` · `leaderboard` · `mentor-hub` · `war-room` · `whale-room` · `crypto-elite` · `gold-masters` · `ny-traders` (the last five are **hard-coded example rooms**), plus `notification-center.tsx`, `member-profile.tsx`, `community-archio-bridge.tsx`, `live-calls-dashboard.tsx`, `daily-gameplan.tsx`, `leaderboard.tsx`, `mentor-stage.tsx` (unmounted, superseded by Live Room).
- **FUNCTIONAL:** `MOCK DATA` (`community-data.ts`, `lib/community-data.ts` `mockForecasts`, `mockEntries`).
- **VISUAL:** `V0 DRAFT` · NOT REVIEWED ×2
- **DESIGN ISSUES:** a second navigation system; theater mode folds it to 56 px when in Live Room; rooms are named after example communities (whale-room…) — sample content masquerading as structure.
- **QCLAY:** legacy "Community" system 02.*; **Catch Me Up (02.4)** exists only as a concept in decks — `NOT DESIGNED` in code.

#### CO-PAGE-002 · Live Call History — `/history` · `community-panel/live-call-history.tsx` — `V0 DRAFT` / `MOCK DATA`. NOT REVIEWED ×2.

#### CO-PAGE-003 · Live Room — `/live-room` (standalone, `100dvh`) and inside the hub as `live-stage` · `components/live-room/` (23 files, 6,440 lines): `live-room.tsx`, `workspace.tsx` (resizable panes, `react-resizable-panels`), `inspector.tsx` (deck: 4 instrument keys + 4 tool keys; stage swaps one card), `inspector-drawer.tsx` (narrow fallback, portal), `stage-screen.tsx` (chart hero + transport bar, `TransportDrawer`), `stage-discussion.tsx` (talk dock), `stage-tools.tsx`, `mentor-presence.tsx`, `phase-rail.tsx`, `breakdown-spine.tsx`, `intelligence-lenses.tsx`, `session-timeline.tsx`, `trade-anatomy.tsx`, `replay-scrubber.tsx`, `room-header.tsx` (THEATER toggle), `explain-term.tsx`, `glossary.ts`, `live-room-tokens.ts`
- **SEES:** mentor's screen as hero; left inspector with BREAKDOWN / INTELLIGENCE / TIMELINE / ANATOMY and ORDER FLOW / COMPARE PLAN / ORACLE SUMMARY / FORECAST THIS keys; chat dock beneath; draggable split; theater mode; drawer under 880 px.
- **FUNCTIONAL:** `MOCK DATA` — the whole session is a scripted `SessionEvent` ledger in client memory; layout ratios persist to `localStorage`. No streaming, no real mentor, no real chat.
- **VISUAL:** `V0 DRAFT` — the most recently designed surface, with its own token file and a masterplan (`docs/live-room-design-masterplan.md`).
- **LUKE / KAN:** NOT REVIEWED
- **DESIGN ISSUES:** own theme ("Teal Glass · Obsidian Cut") — the fourth token family in the product.
- **FUNCTIONAL ISSUES:** requires real-time infrastructure (video/screen share, chat, presence) that does not exist (`13` F11 MISSING). ORDER FLOW and COMPARE PLAN tools imply broker + plan data (MISSING).
- **QCLAY:** legacy 02.3; the ledger → lenses → tools architecture is a strong candidate for the "one event, many systems" pattern **if** it is ever persisted.

##### CO-DRAWER-001 · Inspector drawer (narrow) — `V0 DRAFT` / `FUNCTIONAL` (client).
##### CO-DRAWER-002 · Transport drawer (replay/pulse) — `V0 DRAFT` / `MOCK DATA`.
##### CO-DRAWER-003 · Proof / Weakness drawers — `ProofDrawer`, `WeaknessDrawer` (`NEEDS-V0-VERIFICATION` location: community-panel or live-room) — `V0 DRAFT` / `MOCK DATA`.

#### CO-PANEL-002 · Leaderboards — `community-panel/leaderboard.tsx`, `forecast-hub/forecast-leaderboard.tsx`, `components/premium-leaderboard.tsx`, `MonthlyMegaCard.tsx` — **three leaderboards**. `MOCK DATA`. Duplication flag.
#### CO-PANEL-003 · Notification center — `community-panel/notification-center.tsx` — `V0 DRAFT` / `MOCK DATA`; **no real notification backend except `mentor_notifications`** (`13` §3.5).
#### CO-PANEL-004 · Member profile hover/card — `member-profile.tsx`, `profile/ProfileHoverCard.tsx` — `MOCK DATA`.
#### CO-TPL-001…007 · Community templates in Flight Deck — see `FD-TPL-*` (`community-hub` is the one template that fetches real data).
#### CO-STATE-001 · Join / request / invite flow — **backend exists** (`invites`, `memberships`, `/api/invites/[token]/accept`), **no UI anywhere**. `NOT DESIGNED`.
#### CO-STATE-002 · Create a community / mentor studio — `groups_insert_own` policy exists; **no UI**. `NOT DESIGNED`. (Legacy 02.6.)
#### CO-STATE-003 · Community detail / preview page — the `CommunityInspector` panel is the closest; no route per community. `NOT DESIGNED` as a page.

---

### 5.6 Ask Archio (`AA`)

Two real LLM endpoints, one scripted one, several UI shells. Per `11` §3 this system is meant to combine **General** and **Personal** ARCHIO Intelligence; today it has General only, over demo personal data.

> **DL-028 (20 Sep 2026, FOUNDER DIRECTION — not a specification):** inside the Flight Deck, Ask Archio / the question bar is meant to guide users conversationally — *what are you? · what can you do? · where do I go? · how does this feature work?* — and may naturally encourage a signed-out user to log in / register when they reach for identity- or persistence-bound features (DL-026). Which surface below *is* Ask Archio remains open (`14` Q-8, N-2, N-8). No AI work is scheduled by this direction.

#### AA-AI-001 · Command layer — `components/command/CommandLayer.tsx`, `CommandBar.tsx`, `CommandRail.tsx`, `CommandResultObjects.tsx`, `lib/command/` (`intent-parser.ts`, `suggestions.ts`, `types.ts` `CAPABILITY_MATRIX`), `lib/stores/commandStore.ts` → `POST /api/command`
- **SEES:** a summonable command bar; typed intent → streamed text reply + structured result objects.
- **FUNCTIONAL:** `FUNCTIONAL` (streams `openai/gpt-5-mini` via AI Gateway with `useChat`), **unauthenticated**, ungrounded in market or user data.
- **VISUAL:** `V0 DRAFT` · NOT REVIEWED ×2
- **ISSUES:** overlaps `FD-SEARCH-001` (command palette) and `AA-AI-002`. **Naming:** "Command" ≠ "Ask Archio" in the UI copy.

#### AA-AI-002 · Grounded response engine — `POST /api/archio` (`streamObject`, `openai/gpt-4.1-mini`, `maxDuration 30`), `lib/response-engine/` (`router.ts`, `contract.ts`, `journal.ts`), rendered by `vantary/cartouche/ask-answer-surface.tsx`, `ask-quick-actions.tsx`, `archio-room/`, `response-engine/registry.tsx`
- **HOW IT WORKS:** deterministic router picks intent/room/template **before** the model (`review`→studio→`trade-post-mortem` · `check`→studio · `simulate`→market-floor · `analyze`→market-floor→`asset-deep-dive` · `explain`→market-floor · fallback); collects **real** Polygon snapshot + 48 hourly bars; prompt forbids inventing numbers; output validated against `archioEnvelopeSchema` (tone `bullish|bearish|neutral|mixed`, drivers with `weight high|med|low`, confidence `high|medium|low`).
- **PERSONAL DATA:** `collectJournalGrounding` reads `lib/response-engine/journal.ts` — a **labelled demo book** (`source: "demo-journal"`). So "Why did I lose yesterday?" is answered honestly about a fictional trader.
- **FUNCTIONAL:** `PARTIAL` (real General intelligence; fake Personal intelligence) · **unauthenticated**
- **VISUAL:** `V0 DRAFT` · NOT REVIEWED ×2
- **THIS IS THE TEMPLATE** (`08`) for every future grounded AI call. Approve the *pattern* (router → grounding → schema → registry) as an architecture decision, separately from any single answer's look.

#### AA-TPL-001 · Generated-template surfaces — `response-engine/registry.tsx` renderers for `trade-post-mortem` and `asset-deep-dive`; others generic. `V0 DRAFT` / `FUNCTIONAL`. **Design issue:** generated surfaces must obey the same design system as hand-built ones — no rule exists yet (§8.15).

#### AA-AI-003 · Copilot chat — `copilot/chat/CopilotChatPanel.tsx` (`useChat`) and 3 `fetch('/api/copilot/chat')` callers → `POST /api/copilot/chat`
- **REALITY:** **not AI.** A keyword matcher (`recap|summarize|confluence`, `checklist`, `next session`, `note`, `remind`) returning canned markdown with emoji, plus a session detector (Asia/London/NY by UTC hour). `FUNCTIONAL` as scripted, `MOCK/DEMO` as intelligence.
- **VISUAL:** `ROUGH` · NOT REVIEWED ×2
- **CONTRADICTION FLAG (§12):** `08` lists `copilot_events` as "Written from `app/api/copilot/chat`" — this route writes nothing.

#### AA-AI-004 · Oracle command console — `vantary/oracle-command-console.tsx` — `MOCK DATA` (see MX-SECTION-005).
#### AA-AI-005 · Nexus AI synthesis panel — `nexus/nexus-ai-synthesis-panel.tsx` — `MOCK DATA`.
#### AA-AI-006 · Mentor AI chat — `mentor/MentorAIChat.tsx` — `MOCK DATA`.
#### AA-AI-007 · Loose AI shells — `ai-copilot.tsx`, `ai-clarification-panel.tsx`, `ai-interaction-panel.tsx`, `ai-strategy-matrix.tsx` + `ai-strategy-matrix-modal.tsx` (11 errors), `enhanced-ai-analysis.tsx`, `ai-forecast-header.tsx`, `AIInsightPopup` — `ROUGH` / `MOCK DATA`. `NEEDS-V0-VERIFICATION` which are mounted.
#### AA-AI-008 · Jarvis narration — see `FD-SECTION-004`.
#### AA-STATE-001 · Streaming / thinking state — present in `ask-answer-surface` (streams first field first by design). `V0 DRAFT`.
#### AA-STATE-002 · AI error / refusal / rate-limit state — `UNKNOWN`; no auth means no per-user limits (`13` §6 cost).
#### AA-STATE-003 · Assistance style controls (quiet ↔ proactive, `11` §5) — `NOT DESIGNED`.
#### AA-STATE-004 · Consent / "what ARCHIO knows about you" (`11` §2) — `NOT DESIGNED`.

---

### 5.7 Account / Money (`AM`)

#### AM-PAGE-001 · Profile — `/profile` · `app/(main)/profile/page.tsx`, `components/profile/` (10): `ProfileHeader`, `ProfileStats`, `ProfileIdentity`, `ProfileBadges`, `ProfileActivity`, `ProfileMentorModule`, `ProfileStudentModule`, `ProfileConnections`, `ProfileHoverCard`; store `lib/stores/useProfile.ts`
- **SEES:** header, stats, identity, badges, activity, a mentor module or student module depending on role, connections (TradingView connect UI).
- **CAN DO:** toggle **demo mentor role** (`toggleDemoRole`), view; nothing saves to the server.
- **FUNCTIONAL:** `MOCK DATA` — `MOCK_PROFILE`, `MOCK_MENTOR_PROFILE`, `MOCK_BADGES`, `MOCK_ACTIVITY`; the store is `persist`ed to `localStorage`. **`/api/users/me` and `/api/users/profile` exist and are never called.**
- **VISUAL:** `V0 DRAFT` · NOT REVIEWED ×2
- **ISSUES:** the real `profiles` table has `display_name, bio, avatar_url, verified_level (0–3)` — the UI shows far more than the schema holds. `ProfileConnections` shows a broker/TradingView connection that cannot connect (`13` F10).
- **QCLAY:** decide what a profile *is* (identity card vs. Trading Passport `TP`).

#### AM-STATE-001 · Settings — **no page** (middleware protects `/settings`, which does not exist). `NOT DESIGNED`.
#### AM-STATE-002 · Billing / plans / upgrade — **backend complete, UI absent**: `plans`, `subscriptions` tables; `/api/subscriptions/checkout|portal|current|me`; Stripe webhook handling `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.updated|deleted`; `002_seed_plans.sql`. **Zero client callers.** `NOT DESIGNED`. The word "pricing" appears only in pitch slides and dashboard copy.
#### AM-STATE-003 · Organisation / room administration — backend complete (`/api/orgs`, `/api/rooms`, `/api/memberships`, `/api/invites` — all session-checked, Zod-validated), **zero UI**. `NOT DESIGNED`. **Governance note (`01` rejected ideas):** "orgs/memberships/mentors reflect an earlier product direction, not demand" — do not design UI for this because the backend exists.
#### AM-SECTION-001 · Accounts module — `dashboard/modules/accounts.tsx`, `lib/stores/useAccounts.ts` (no persistence, no broker) — `MOCK DATA`. Feeds `FD-WIDGET-…accounts`.
#### AM-STATE-004 · Connected accounts / broker — `ProfileConnections`, `trading-desk/execution-console` — `INTEGRATION BLOCKED` (no TradeLocker/MT/CSV; DL-004 says read-only in v2).
#### AM-STATE-005 · Data & privacy controls (`11` §2 "with the user's permission") — `NOT DESIGNED`.
#### AM-STATE-006 · Delete account / export — `NOT DESIGNED`.

---

## 6. Level-4 / VISION interfaces (only where UI or mockups exist)

| ID | Interface | What exists | Status |
|---|---|---|---|
| `TP-SECTION-001` | Trading Passport / verified proof | `profiles.verified_level` column (0–3) in real schema; `ProfileBadges`; `forecast-my-record.tsx` "verifiable record"; `ProofDrawer`; pitch slides "Verified Record + feed" (`pitch/deck/*`) | `VISION ONLY` for the proof itself — nothing verifies anything. UI fragments exist. **Naming:** Passport vs Verified Track Record (`14` §3). |
| `SM-SECTION-001` | Social / creator / marketplace | `copilot/social/` (1 file); leaderboards; pitch Act IV "four lanes", "clone agents", "GMV math"; `groups.visibility = 'paid'` + `stripe_price_id` column in `groups` schema (paid communities) | `VISION ONLY`. The paid-community column is the only code-level trace of "opportunity/earning" (`11` §6). Rejected-ideas table: "Marketplace before verification". **DL-031 (22 Sep 2026, provisional): Marketplace's conceptual long-term home = THE COLLECTIVE / Community & Opportunity family; NOT a D1 door, NOT approved for implementation; stays visible in future architecture planning (appropriately verified AI agents · creator / mentor intelligence products · dashboards / workspaces · templates / layouts · other creator offerings). Not designed in D1 Block 2.** |
| `AG-SECTION-001` | Agents / workflows | `lib/copilot/watchers/` (risk/copy/progress watchers — client-side rule agents); pitch Act IV "AI agent marketplace"; `/backend-map` explainer | `VISION ONLY` beyond the three client watchers. "Agents never place orders" stands. |

---

## 7. Founder, marketing and internal surfaces (`MK`) — not the product

These exist in the same repo and are reachable by URL. They are inventoried so that nobody counts them as product screens and so that `/design` can be used for §8.

| ID | Route | What it is | Status |
|---|---|---|---|
| `MK-PAGE-001` | `/welcome` | `LandingExperience` — 12 cinematic scenes (Hero · Ignition · Isolation · ToolChaos · GuruBetrayal · Psychology · PsychOS · Copilot · Community · Ecosystem · Transformation · CTA) | `V0 DRAFT` marketing; public |
| `MK-PAGE-002` | `/archio` | `ArchioLanding` — sectioned marketing page (Hero, Pain, Solution, Pillars scroller, Magic, Personalization, Showcase, Outcomes, Trust, Pathways, QuickWin, Transformation, Final CTA, Footer) | `V0 DRAFT`; **two landing pages** — founder decision which is canonical; QClay is separately building a landing page |
| `MK-PAGE-003` | `/pitch` | `OwenDeck` — 35 slides, 5 acts, presenter notes (`components/pitch/deck/`) | `V0 DRAFT`; public (middleware) |
| `MK-PAGE-004` | `/newpitch` | `NewPitchPage` (10 files) | `V0 DRAFT`; noindex |
| `MK-PAGE-005` | `/owen`, `/owen/guide`, `/owen/presenter` | Owen/TradeLocker meeting deck + synced presenter + guide | `V0 DRAFT` |
| `MK-PAGE-006` | `/masterplan` | `MasterPlanPage` (5,289 lines) | legacy narrative; **archaeology** |
| `MK-PAGE-007` | `/design` | `ArchioDesignPage` — `archio-kit.tsx`, `palette-sections.tsx`, `design-tokens.ts`, `design-scaffold.tsx` | the only design-system reference page; **not** what the product uses (see §8) |
| `MK-PAGE-008` | `/backend-map` | interactive "restaurant" metaphor of request flow + the ~35 API doors | founder learning tool; keep for `13` |
| `MK-PAGE-009` | `/playground/glass-demo`, `/playground/glass-popup` | `GlassWindowPopup`, `GlassHoverPopup`, glass UI kit demos | dev playground |
| `MK-PAGE-010` | `/docs/ultra-breakdown` | 309-line inline explainer of the confluence system | dev doc as page |

**Count check against QClay's estimate:** QClay counted ≈75 unique screens, 45 modals, 10 drawers for the *intended* product. The repo today has **30 page routes** (16 product, 4 auth, 10 founder/internal), roughly **56 named modal/drawer/sheet/popup/overlay components** (≈50 after removing purely decorative overlays), of which **14** are shadcn `Dialog` surfaces, **2** `Sheet`, **1** `Drawer`, **20** custom `role="dialog"` surfaces, and about **12 named drawers** (`CopilotDrawer`, `DayDetailDrawer`, `ForecastDetailDrawer`, `ForecastSubmitDrawer`, `InspectorDrawer`, `ProofDrawer`, `TransportDrawer`, `WeaknessDrawer`, `*Sheet` ×8). The order of magnitude matches QClay's; the *content* does not — QClay's list is the intended product, this is the built one.

---

## 8. Design consistency register

Rule for this section: **do not pretend current inconsistency is intentional.** Each row records what is verifiably in code, then the decision the founders must make. `FOUNDER DECISION` cells start `UNKNOWN`.

| # | Element | What is verifiably in code today | Consistent? | Founder decision needed |
|---|---|---|---|---|
| 8.1 | **Typography — families** | Root loads **Inter** (`--font-sans`) + **JetBrains Mono** (`--font-mono`). Usage: `font-mono` **4,894** occurrences vs `font-sans` **945** vs `font-serif` **11** (no serif is loaded → system serif fallback). | No — mono is the de-facto body font on most surfaces; serif appears without a font. | Is ARCHIO a mono-first terminal or a sans-first product? Remove or load a serif. `UNKNOWN` |
| 8.2 | **Heading hierarchy** | No shared heading scale; Vantary uses hairline eyebrows + display caps; MTF/Forecast use `ACCENT` + clamp sizes; auth uses its own. | No | One H1–H6 + eyebrow scale. `UNKNOWN` |
| 8.3 | **Body / subtext sizing** | Ad-hoc `text-[10px]`, `text-xs`, `text-[11px]`; nav subtitle is 10 px. | No | Minimum body 14 px? (guideline) Micro-caps allowed where? `UNKNOWN` |
| 8.4 | **Button typography & sizes** | shadcn `Button` variants exist (`components/ui/button.tsx`) **and** bespoke buttons in Vantary, live-room keys (44 px), auth `AuthButton`, landing CTAs. | No | One button family with terminal-key variant? `UNKNOWN` |
| 8.5 | **Cards** | shadcn `Card`; `vantaryCard()` inline-style helper; `interactive-border-card.tsx`; live-room `lr-capsule`; forecast cards; glass popups. ≥5 card grammars. | No | One card grammar + one "glass" variant. `UNKNOWN` |
| 8.6 | **Corner radius** | `--radius: 0.5rem` (shadcn). Class census: `rounded-full` 1,666 · `rounded-lg` 966 · `rounded-xl` 915 · `rounded-md` 522 · `rounded-2xl` 209 · `rounded-sm` 115 · `rounded-3xl` 23 · arbitrary (`[14px]`,`[10px]`,`[2px]`,`[3px]`) 19. Vantary defines its own `RADIUS_V` in **two** files. | No | Pick 3 radii (control / card / sheet). `UNKNOWN` |
| 8.7 | **Spacing** | Tailwind scale used, but gadgets and decks use px inline styles (`HAIR = 1`, `DASH = "4 6"`). | Partial | 4-pt grid confirmed? `UNKNOWN` |
| 8.8 | **Iconography** | `lucide-react` everywhere (one family). Custom SVG glyphs in `strategy-os/flight-profile-glyphs.tsx`, `communities-icons.tsx`, auth `icons/`. | Mostly yes | Allowed sizes 16/20/24 only? `UNKNOWN` |
| 8.9 | **Borders** | Vantary hairline doctrine (1 px, low-alpha); nav uses `border-white/10`; shadcn `--border`. | Partial | Hairline as canon? `UNKNOWN` |
| 8.10 | **Shadows / depth** | Glass + blur (`backdrop-blur-xl`) in nav, hub, popups; Vantary `TEAL_GLOW`, `TEAL_SHIMMER`, `CHROMA_SHADOW`; `obsidian-glass-effects.tsx`, `neural-light-effects.tsx`. | No | Is depth glass, glow, or flat? `UNKNOWN` |
| 8.11 | **Chart treatment** | TradingView embed (dark, grid removed) · Recharts (`recharts@2.15`) sparklines · custom canvas in live-room · SVG in gadgets. Four renderers. | No | One chart palette + one renderer per job. `UNKNOWN` |
| 8.12 | **Table treatment** | shadcn `Table` exists; most "tables" are card lists or `dl` ledgers. | Unknown | Ledger-style rows as canon? `UNKNOWN` |
| 8.13 | **Modal / drawer / sheet treatment** | 14 shadcn `Dialog` + 20 custom `role="dialog"` + portals via `components/core/ModalPortal.tsx`; drawers from `vaul` (`components/ui/drawer`), shadcn `Sheet`, and hand-rolled (`inspector-drawer`). | No | One modal, one sheet, one drawer primitive; bespoke only by exception. `UNKNOWN` |
| 8.14 | **Color usage** | **Root `<html class="dark">` hard-coded**; shadcn HSL tokens (light + dark blocks present); Vantary **7 themes**; `mtf-theme` purple/amber (used by login + forecast); `floating-nav` purple; live-room teal/obsidian; forecast amber/slate; `jarvis-tokens`; `design/design-tokens.ts`. **At least 6 parallel token systems.** | No | How many themes ship? Which token file is canon? `UNKNOWN` |
| 8.15 | **Positive / negative / warning semantics** | Green `#34d399` / red `#f87171` (Signal Terminal); Vantary emerald/rose; forecast `amber`; family colours (sativa/hybrid… no — that is another project) — here: `bullish|bearish|neutral|mixed` tones in the AI contract map to colours per theme. | Partial | One semantic ramp (up/down/flat/warn) independent of theme. `UNKNOWN` |
| 8.16 | **Loading / skeleton** | `<Skeleton>` in 2 files; `app/loading.tsx` + `app/login/loading.tsx`; most surfaces render demo data instantly so loading never shows. | Absent | Skeleton grammar per surface type. `UNKNOWN` |
| 8.17 | **Empty states** | None found for the core objects (no trades / no decisions / no communities joined). Demo data hides emptiness. | Absent | **Highest-priority design gap.** `UNKNOWN` |
| 8.18 | **Navigation behaviour** | Left-edge hover strip (global) + Room Navigator (dashboard) + Community Hub rail (floating) + Command palette + Command bar. | No | One primary nav model. `UNKNOWN` |
| 8.19 | **Menu behaviour** | `DropdownMenu` in 1 file; `Popover` in 2; most menus bespoke. | No | — |
| 8.20 | **Responsive behaviour** | `use-mobile.tsx` hook; Live Room has an 880 px container-query fallback; Flight Deck has none verified; Vantary zoom-fit patterns. | Unknown | Desktop-only for v1? `UNKNOWN` |
| 8.21 | **Animation / motion** | `framer-motion@12` everywhere; Vantary `EASE_V [0.25,0.46,0.45,0.94]` + "earned motion" doctrine; live-room `LR.ease`; landing scenes heavy; reduced-motion honoured in some files, not audited globally. | Partial | One easing set, one duration scale, reduced-motion mandatory. `UNKNOWN` |
| 8.22 | **3D / visual assets** | `images.unoptimized: true`; landing/auth use CSS "orbit fields", `EnvironmentalField`, `FloatingFinancialField`; no 3D library. | n/a | — |
| 8.23 | **AI-generated surfaces / templates** | `response-engine/registry.tsx` renders envelopes with `primitives.tsx`. No written rule that generated surfaces use the same tokens. | Rule absent | Generated UI obeys the same tokens as hand-built UI — record as a rule. `UNKNOWN` |
| 8.24 | **Form controls** | shadcn `Input/Select/Switch/…` exist; auth uses `AuthInput`; forecast submit and copilot plan use bespoke fields. | No | One control set. `UNKNOWN` |
| 8.25 | **Copy voice** | "MARKET FLOOR / THE STUDIO / MENTOR HALL / THE COLLECTIVE" (theatrical) vs "Signal Terminal / Macro Economic" (utilitarian) vs Jarvis narration (first-person AI) vs emoji canned replies (`/api/copilot/chat`). | No | One voice. `UNKNOWN` |

**The `/design` page (`MK-PAGE-007`) is not the product's design system.** It documents a kit (`archio-kit.tsx`) that the Flight Deck does not import. Founders should decide whether `/design` becomes the canon page that every system must match, or is retired.

---

## 9. User-flow coverage

Only flows that exist in the repo are mapped. The founder journey from `11` is the spine; each step lists the surfaces that participate today.

### 9.1 The founder journey (`11`): Open ARCHIO → Prepare → Learn / Participate / Trade → ARCHIO observes → ARCHIO helps → ARCHIO learns → user returns

| Step | Surfaces that participate today | Reality |
|---|---|---|
| **Open ARCHIO** | `SH-PAGE-001` login (real) → `MX-PAGE-001` `/` (Signal Terminal, mock prices) **or** `FD-PAGE-001` `/dashboard` (public, demo) | Landing after login is `/` by default — a mock terminal. No first-run state. |
| **Prepare** | `FD-SECTION-001` Active Window (day playbook), `FD-NAV-001` Daily Brief door (real LLM), `MX-PAGE-002` macro, `CO-PANEL-001` daily-gameplan view | Preparation is possible to *read*; nothing the user prepares is kept. |
| **Learn** | `ED-PAGE-001` Cockpit, `ED-SECTION-003` glossary, tutorials | Narrative only; no progress. |
| **Participate** | `CO-PAGE-001` discovery (real groups if seeded), `CO-PAGE-003` Live Room (scripted), `IL-PAGE-001` forecast feed | Can browse; cannot join (`CO-STATE-001` NOT DESIGNED); cannot post. |
| **Trade** | `IL-PAGE-002` Execution Copilot, `FD-SECTION-002` trading desk | Plan UI exists; no ticket, no broker, no record. |
| **ARCHIO observes** | `lib/copilot/eventBus.ts` + watchers (client), Live Room ledger (client) | Observation happens in the browser and is discarded on reload. **The observe step has no persistence at all.** |
| **ARCHIO helps** | `AA-AI-002` `/api/archio` (real, grounded in market; personal side is demo), `AA-AI-001` command bar | Help is real for General intelligence, fictional for Personal. |
| **ARCHIO learns** | — | **Nothing.** No table receives user behaviour. |
| **User returns** | `useProfile` `localStorage` persist, layout ratios, theme | Returning user sees the same demo. |

### 9.2 Real flows discovered in the repo (exist end-to-end in code)

| Flow ID | Flow | Surfaces | End-to-end? |
|---|---|---|---|
| `FLOW-001` | Sign up → verify email → sign in → sign out | `SH-PAGE-002` → `SH-PAGE-005` → `SH-PAGE-001` → `SH-NAV-002` | **Yes** (Supabase Auth; `handle_new_user` trigger creates `profiles` row) |
| `FLOW-002` | Forgot → reset password | `SH-PAGE-003` → email → `SH-PAGE-004` | **Yes** |
| `FLOW-003` | Ask a grounded market question | door / quick action → `/api/archio` → `ask-answer-surface` | **Yes** (General intelligence) |
| `FLOW-004` | Ask the command bar anything | `CommandBar` → `/api/command` → streamed reply | **Yes** (ungrounded) |
| `FLOW-005` | Discover communities with filters | `/communities` → `/api/communities` → `groups` (or mock) | **Yes** with mock fallback; **stops at "join"** |
| `FLOW-006` | Navigate the cockpit via 16 doors | `FD-NAV-001` → pages/templates/prompts | **Yes** (navigation only) |
| `FLOW-007` | Watch a (scripted) live session, inspect lenses, resize workspace | `CO-PAGE-003` | Yes as demo |
| `FLOW-008` | Browse and "submit" a forecast | `IL-PAGE-001` → `IL-DRAWER-001` | **No** — submit discards |
| `FLOW-009` | Plan and "execute" a trade | `IL-PAGE-002` | **No** — no save, no broker |
| `FLOW-010` | Billing checkout → webhook → subscription row | `/api/subscriptions/checkout` → Stripe → `/api/stripe/webhook` → `subscriptions` | **Backend yes, no UI entry** |
| `FLOW-011` | Create org → room → invite → accept | `/api/orgs` → `/api/rooms` → `/api/invites` → `/api/invites/[token]/accept` (+ `increment_invite_usage` RPC) | **Backend yes, no UI** |
| `FLOW-012` | Copy a mentor entry → mentor notified | `notify-mentor` → `mentor_notifications` | Backend yes; **no UI reads notifications**; route unauthenticated (`13` §7) |

**Flows the Source of Truth names that have no UI:** capture a Decision Record (DL-001/DL-012), lock before outcome, compare with actual trade, receive a review, Catch Me Up, join/leave a community, set assistance style, consent to observation. All `NOT DESIGNED`.

---

## 10. Founder definition of "done"

A screen or feature is **founder-design-complete** only when every box is ticked and both approval columns read `APPROVED`. Copy this block into the record's issues field while working it; delete when complete.

```
[ ] PURPOSE — one sentence a new trader would understand; recorded in WHY IT EXISTS
[ ] SYSTEM OWNER — one Level-1 system; OWNER: PROPOSED flags resolved
[ ] CONNECTED FLOWS — every FLOW-### it participates in is listed; §9 updated
[ ] DESKTOP VISUAL — reviewed live at the standard viewport (record which)
[ ] PRIMARY INTERACTIONS — every button/tap does something or is removed
[ ] SUBCOMPONENTS — every child record (TAB/MODAL/DRAWER/WIDGET) reviewed or explicitly deferred
[ ] EMPTY / LOADING / ERROR — designed, or recorded as deliberately absent with reason
[ ] RESPONSIVE — requirement stated (desktop-only / tablet / mobile) even if not built
[ ] COPY — every label/eyebrow/microcopy read aloud once; voice matches §8.25 decision
[ ] REAL vs MOCK — every number/list on screen tagged REAL / DEMO in the record
[ ] BACKEND DEPENDENCY — the `13` foundation(s) it needs named; MISSING ones acknowledged
[ ] AI / INTEGRATION DEPENDENCY — named; "AI appropriate" vs "deterministic" stated
[ ] LUKE DECISION — recorded with date
[ ] KAN DECISION — recorded with date
[ ] QCLAY POLISH ITEMS — written as a list QClay can act on without a call
[ ] SCREENSHOT — attached and dated
```

A page that looks good and fails any line above is **not done**.

---

## 11. Counts discovered (20 Sep 2026)

| Thing | Count | Note |
|---|---|---|
| Page routes | **30** | 16 product (`/`, `/dashboard`, `/forecast`, `/copilot`, `/intelligence`, `/nexus`, `/communities`, `/history`, `/hub`, `/cockpit`, `/profile`, `/live-room`, + 4 auth pages counted separately below), 4 auth (`/login /register /forgot-password /reset-password`, plus `/verify-email` = 5 auth screens), 10 founder/internal |
| Layouts / special files | 6 | 2 layouts + `(main)` layout + `owen` + `welcome` layouts; 2 `loading.tsx`; **0** `error.tsx`, **0** `not-found.tsx` |
| API route files | **37** | 8 auth · 4 users · 2 orgs · 2 rooms · 2 memberships · 4 invites · 4 subscriptions · 1 stripe · 3 market · 2 polygon · 1 archio · 1 command · 2 copilot · 1 communities · 1 health · 1 auth callback |
| API routes with **zero** UI callers | **19** | all `/api/auth/*` (UI uses Supabase client directly), all `/api/orgs|rooms|memberships|invites|users|subscriptions/*` |
| UI calls to **non-existent** routes | 1 | `/api/market/stats` (2 call sites) |
| Component folders | 38 | + 80 loose top-level components |
| Named modal/drawer/sheet/popup/overlay components | ≈56 | ≈50 dialog-like; 14 shadcn Dialog, 2 Sheet, 1 Drawer, 20 custom `role=dialog` |
| Tab sets | 8 files (76 `<Tabs*` uses) | Copilot rail tabs ×9, forecast views ×4, others |
| Flight Deck doors | 16 | 9 href · 2 template · 4 Ask · 1 event |
| Living gadget definitions | ≈26 (v1) + 13 (v2) | overlapping |
| Flight Deck templates | 10 files | 19 `warming()` stubs in registry |
| Community Hub views | 13 | 5 are hard-coded example rooms |
| Visual themes | 7 (Vantary) | + ≥5 other token files |
| Fonts loaded | 2 | Inter, JetBrains Mono (serif referenced, not loaded) |
| `localStorage` keys | 8 | the only client persistence |
| Real LLM endpoints | 2 | `/api/archio` (gpt-4.1-mini, grounded), `/api/command` (gpt-5-mini) |
| Scripted "AI" endpoints | 1 | `/api/copilot/chat` |
| TypeScript errors | **483** | build ignores them |
| Tests | 4 files (`__tests__/integration/`) | `auth.test.ts` has 13 TS errors |

---

## 12. Contradictions and flags surfaced by this audit

Flagged, not resolved. A founder rules on each; v0 does not change strategy.

| # | Flag | Where | Kind |
|---|---|---|---|
| F-1 | `08` says `copilot_events` is "Written from `app/api/copilot/chat`". **False.** That route is a keyword matcher that writes nothing. The only writer, `lib/copilot/persist.ts`, is called from a **commented-out** flush loop. The table is effectively unused. | `08` REAL table | **APPLIED 20 Sep 2026 (DL-019)** — `08` row corrected, original wording struck through |
| F-2 | `08` lists `mentor_notifications` under REAL. True, but the only writer route uses the **service-role key with no auth check** and accepts arbitrary `mentorId`/`userId` — anyone on the internet can insert notifications into any mentor's inbox. | `app/api/copilot/notify-mentor/route.ts` | **SECURITY FLAG** |
| F-3 | `copilot_events` select policy `auth.uid() = user_id OR user_id IS NULL` — any authenticated user can read every anonymous event. Combined with insert `with check (true)` (already flagged in `08`). | `scripts/copilot-tables.sql` | **SECURITY FLAG** |
| F-4 | Both LLM routes (`/api/archio`, `/api/command`) and all Polygon proxy routes are **unauthenticated**. Cost exposure if the URL leaks. | `app/api/archio`, `app/api/command`, `app/api/polygon/*`, `app/api/market/*` | **SECURITY / COST FLAG** |
| F-5 | Middleware protects eight routes that **do not exist** and leaves every real page public. | `lib/supabase/middleware.ts` | Design/security decision |
| F-6 | DL-012 "Capture design target: one tap + optional one line" vs. the only capture-shaped UIs (`IL-DRAWER-001` forecast submit, `IL-PAGE-002` trade plan) which are long forms with no lock/provenance. | `01` DL-012, DL-011 | UI contradicts ledger intent (expected — built before the ledger) |
| F-7 | Rejected idea "TradingView embedded as the centre of the cockpit" (`01`) vs. TradingView is the centre of `/copilot` and the trading desk. | `01` rejected ideas | Flag only; "fine as a feature" clause may cover it |
| F-8 | Rejected idea "Letting repo architecture define the market" vs. a complete orgs/rooms/memberships/invites/billing backend with no UI. Risk: somebody designs UI for it *because it exists*. | `01` rejected ideas | Guard rail for the runway |
| F-9 | Structural Map v1 is cited by founders but **not in `docs/source-of-truth/`**. | this file §3 | **RESOLVED 20 Sep 2026 (DL-019)** — filed as `15-structural-map-v1.md` |
| F-10 | Four naming layers for the same territory: Structural Map v1 systems · Room Navigator rooms (MARKET FLOOR / STUDIO / MENTOR HALL / COLLECTIVE) · response-engine `RoomId` (`studio`, `market-floor`) · legacy QClay systems (Flight Deck / Community / Decision Desk / Trading DNA / Marketplace…). | `14` §3 | **REDUCED 20 Sep 2026:** Structural Map v1 = the map (`15`, DL-019); the four Flight Deck **zones** = navigation abstraction, not a map layer (DL-025); QClay systems = legacy aliases. Remaining: `RoomId` code ids · Live Room word-share (`14` N-10) |
| F-11 | `/` (the post-login landing) shows **generated mock prices** while real Polygon routes exist and are used on `/dashboard`. | `MX-PAGE-001` | Honesty fix — cheap |
| F-12 | Two landing pages (`/welcome`, `/archio`) plus QClay's landing work. | `MK-PAGE-001/002` | Founder decision |
| F-13 | Three Copilot right-rail variants, three leaderboards, three confluence modals, two gadget registries, two chart+execution surfaces, two auth implementations, two auth callbacks, two "command" surfaces. | various | Duplication register (`14` §3.2) |
| F-14 | 483 TypeScript errors hidden by `ignoreBuildErrors`. | `next.config` | Technical debt, not design — but it means "it renders" ≠ "it is correct" |
| F-15 | QClay design figure $35k (DL-006) vs ~$42k (`11` §8) — still unreconciled (carried from `11` App. A). | `01`, `11` | Founder |

---

## Appendix A — Attaching screenshots

Put screenshots in `docs/screens/<SYSTEM>/<ID>-<yyyy-mm-dd>-<viewport>.png` (e.g. `docs/screens/FD/FD-NAV-001-2026-09-22-1440.png`) and write the relative path into the record's `SCREENSHOT / VISUAL REFERENCE` field. One screenshot per state (default / empty / loading / error) where those states exist. Never overwrite — add a new dated file and keep the old path in the record's history line.

## Appendix B — Adding a new record

Copy the `SH-NAV-001` block, assign the next number in that system+type series (check `14` §1 index), fill every field (write `UNKNOWN` rather than leaving blank), add the ID to `14` §1, and add a change-log line in `14` §5.


---

<!-- FILE: 13-technical-backend-control-center.md -->

# 13 — ARCHIO Technical / Backend Control Center

**Date:** 20 September 2026
**Kind:** OPERATIONAL CONTROL DOCUMENT (not governance). `11` and DL-018 remain authoritative. This file describes **what exists in code, what is missing, and what would have to exist** for the surfaces in `12` to become real. It proposes no architecture and adds no feature.
**Built by:** v0 from the repo at `08f58a1` (`v0/fxp1casso-52674d7b`). Every table, route, policy and call path below was located by reading SQL files, route handlers and `grep` over `.from(...)`, `fetch('/api/...')`, `process.env.*`, `streamText|streamObject`. Method is recorded in §9 so any bot can re-run it.
**Supersedes nothing; corrects `08` in three places** (§3.2, §3.5, §7 — listed in `12` §12 as F-1…F-3). `08` remains the bots' short fact sheet; v0 will update it separately once founders have read this.
**Live-database caveat:** the repo contains SQL files, not a migration runner. Whether any given statement was ever applied to the production Supabase project **cannot be verified from the repo**. Every "schema exists" claim below means *the SQL file exists in `scripts/`*. Where it matters the row says `CANNOT VERIFY LIVE DB FROM REPO`.

> **The question this file answers:** *What makes ARCHIO actually work — and what does not exist yet?*

---

## 0. How to use this document

- **Founders:** read §1 (vocabulary), §2 (what is real in one table), §3 (the five verification answers), then one foundation from §4 per Lego session.
- **Grok Architect:** treat §2, §4 and §9 as the verified ground; anything not here is `NEEDS-V0-VERIFICATION`.
- **QClay / outside engineers:** §4 "EVENTUAL QCLAY / OUTSIDE-ENGINEER QUESTION" rows and §10 are the questions you will be asked to quote against.
- **v0:** update a row only with a code path or SQL line as evidence; add a change-log line in `14` §5.

---

## 1. Technical status vocabulary

| Value | Meaning |
|---|---|
| `REAL` | Code path exists, is reachable from the running app, and reads/writes real data or a real external service. |
| `PARTIAL` | Some of the path is real (e.g. schema exists, UI does not; or server route exists, no caller). Row must say which half. |
| `MOCK/DEMO` | Hard-coded, generated, or labelled-demo data; or a scripted stand-in for a real service. |
| `MISSING` | Nothing in code; needed by at least one `12` surface or by `11`. |
| `VISION` | Level-4 concept; not needed for any current surface to be honest. |
| `SECURITY FLAG` | Exists and is unsafe as written. Listed in §7 regardless of other status. |
| `NEEDS VERIFICATION` | v0 could not establish from the repo; listed in §9. |

---

## 2. Current reality — verified inventory

### 2.1 Runtime and platform

| Item | Verified value |
|---|---|
| Framework | Next.js **14.2.25**, App Router, `middleware.ts` (not `proxy.ts`), React 19 |
| Language | TypeScript; **483 `tsc` errors**; `next.config` sets `ignoreBuildErrors: true`, `ignoreDuringBuilds: true`, `images.unoptimized: true` |
| Styling | Tailwind 3 (`tailwind.config.ts`), shadcn/ui (61 primitives), `framer-motion@12`, `recharts@2.15` |
| State | `zustand@5` (12 stores in `lib/stores/`), React context providers, `swr@2` (installed; usage light), `localStorage` (8 keys) |
| Data platform | Supabase (`@supabase/supabase-js@2.58`, `@supabase/ssr@0.7`) — Postgres + Auth + RLS. `lib/supabase/{client,server,middleware}.ts` |
| Payments | `stripe@18.5` |
| Market data | Polygon.io REST (`lib/providers/polygonRest.ts`) |
| AI | `ai@6.0.x`, `@ai-sdk/react@3.x` via **Vercel AI Gateway** (model ids `openai/gpt-4.1-mini`, `openai/gpt-5-mini`; no provider package installed — correct gateway pattern) |
| Background jobs | **None.** No `vercel.json`, no cron, no queue, no worker |
| File / media storage | **None.** Zero `storage.from(...)` calls; no Blob integration |
| Tests | `jest`; 4 files under `__tests__/integration/` (`auth.test.ts` has 13 TS errors) |
| Environment variables referenced in code | `NEXT_PUBLIC_SUPABASE_URL`(9) · `STRIPE_SECRET_KEY`(7) · `NEXT_PUBLIC_SUPABASE_ANON_KEY`(6) · `SUPABASE_SERVICE_ROLE_KEY`(3) · `NEXT_PUBLIC_SITE_URL`(3) · `STRIPE_WEBHOOK_SECRET`(2) · `POLYGON_API_KEY`(2) · `POLYGON_REST_URL` · `NEXT_PUBLIC_APP_URL` · `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` · `SESSION_ASIA/LONDON/NEWYORK` · `MARKET_TZ` · `FINNHUB_KEY`(1) · `ALPHAVANTAGE_KEY`(1) |
| Env vars present in the project but **unused by code** | `GEMINI_API_KEY`, `API_KEY` (no Gemini or generic-key call site exists) |

### 2.2 Database — every table defined in `scripts/*.sql`

There is **no `supabase/migrations/` directory** and no migration tool. Ten SQL files sit in `scripts/`. Three of them define `groups` differently (see §3.4).

| Table | Defined in | Columns (abridged) | RLS | Code readers/writers (`.from()`) | Status |
|---|---|---|---|---|---|
| `profiles` | `001_auth_schema.sql` | `id→auth.users`, `display_name`, `bio`, `avatar_url`, `verified_level 0–3`, timestamps. Trigger `handle_new_user` creates a row on signup. | select all · insert/update/delete own | 2 (`/api/users/me`, `/api/users/profile`) — **no UI caller** | `PARTIAL` (schema+API real; UI reads a mock store) |
| `organizations` | `001` | `name`, `slug` (unique), `description`, `avatar_url`, `owner_id` | select member · insert own · update admin · delete owner | 6 (`/api/orgs`, `/api/orgs/[id]`) — no UI | `PARTIAL` (backend only) |
| `rooms` | `001` | `name`, `slug`, `organization_id`, `visibility public/private/invite_only` | member/admin policies | 6 (`/api/rooms*`) — no UI | `PARTIAL` (backend only) |
| `memberships` | `001` | `user_id`, `organization_id`, `room_id`, `role admin/creator/moderator/member/pending/banned`, `status` | own/admin policies | 8 (`/api/memberships*`, orgs, rooms) — no UI | `PARTIAL` (backend only) |
| `invites` | `001` | `invite_code` (unique), `email`, org/room, `invited_by`, `role`, `max_uses`, `used_count`, `expires_at` | own/admin/creator | 5 (`/api/invites*`) + RPC `increment_invite_usage` — no UI | `PARTIAL` (backend only) |
| `plans` | `001` + seed `002_seed_plans.sql` | `name`, `slug`, `features jsonb`, `limits jsonb`, `is_active` | select all | 2 (`/api/subscriptions/checkout`, `current`) — no UI | `PARTIAL` |
| `subscriptions` | `001` | `user_id`, `plan_id`, `status active/cancelled/expired/trial`, `billing_cycle`, period, `stripe_subscription_id`, `stripe_customer_id` | own | 2 (webhook, `current`) — no UI | `PARTIAL` (Stripe webhook writes; nothing displays) |
| `groups` | **three definitions**: `community-schema.sql`, `community.sql`, `create-community-tables.sql`; **altered** by `004_community_hub_alter_groups.sql` (+`asset_class, trading_style, risk_profile, session_focus, language, timezone, beginner_friendly, tagline, strategy_focus, discipline, founded_at, max_members`); **seeded** by `006_seed_community_discovery.sql` | `name`, `slug`, `description`, `tags[]`, `visibility public/paid/private`, `stripe_price_id`, `owner_id` (+12 discovery columns) | select all · insert own · update/delete owner/admin | 1 (`/api/communities` GET, with mock fallback) | `REAL` read path (if seeded) — `CANNOT VERIFY LIVE DB FROM REPO` |
| `group_members` | same three files | `group_id`, `user_id`, `role owner/admin/member`, `status active/pending/expired` | self-join / admin | 4 | `PARTIAL` (read in communities; **no join UI**) |
| `group_invites` | `community-schema.sql`, `create-community-tables.sql` | — | admin | **0** | schema only |
| `group_posts` | `community.sql` | — | read all / own | **0** | schema only |
| `forecast_groups` | `community-schema.sql` | `forecast_id` (**comment: "References forecasts table (to be created)"** — no FK), `group_id`, `shared_by`, `shared_at` | member | **0** | **schema only, orphaned** (§3.3) |
| `community_mentors` | `005_community_hub_mentors.sql` (+seed in `006`) | `group_id`, `user_id`, `display_name`, `title`, `bio`, `specialties[]`, `asset_focus[]`, `trading_style`, `years_experience`, `verified`, `rating`, `total_students`, `total_reviews`, `is_lead`, `mentor_role`, `office_hours_schedule jsonb`, `is_available` | select all · admin write | **0** | schema + seed only; the mentor UIs read mock files |
| `copilot_events` | `copilot-tables.sql` | `id uuid`, `type`, `ts bigint`, `session_id`, `user_id`, `context jsonb`, `data jsonb` | select `auth.uid()=user_id OR user_id IS NULL` · **insert `with check (true)`** | 1 insert in `lib/copilot/persist.ts` — **never called** (§3.2) | **dead table + SECURITY FLAG** |
| `mentor_notifications` | `copilot-tables.sql` | `mentor_id`, `entry_id`, `from_user_id`, `kind`, `read`, `created_at` | select own · **insert `with check (true)`** | 1 insert (`/api/copilot/notify-mentor`, service role, **no auth**) — **no reader** | `PARTIAL` + **SECURITY FLAG** (§3.5, §7) |

**Tables the Source of Truth or `12` surfaces need that do not exist anywhere:** `decision_records`, `trades`, `decision_reviews`, `forecasts`, `journal_entries`, `rules`/`playbooks`, `accounts` (broker), `user_preferences`/`layouts`, `events` (typed, per-user, readable), `notifications` (generic), `courses`/`lessons`/`progress`, `sessions` (live), `messages`.

**DB functions / triggers:** `update_updated_at_column()` + 6 triggers; `handle_new_user()` + `on_auth_user_created`; `increment_invite_usage(uuid)`; `generate_org_slug(text)`; `generate_room_slug(text, uuid)`; `update_community_mentors_updated_at()` + trigger.

### 2.3 API routes — all 37, with callers and auth posture

| Route | Method(s) | Auth check in handler | Service role | UI callers | Status |
|---|---|---|---|---|---|
| `/api/auth/login` | POST | yes | — | **0** (UI uses `supabase.auth.signInWithPassword` directly) | `PARTIAL` — dead duplicate |
| `/api/auth/signup` | POST | — | **yes** (`auth.admin.createUser` + `user_metadata.role`) | **0** (UI uses `supabase.auth.signUp`) | dead duplicate; note: this is the only place a *role* is written and it is unreachable |
| `/api/auth/logout`, `/me`, `/forgot-password`, `/reset-password`, `/callback` | — | mixed | — | **0** | dead duplicates; `/auth/callback` (page-level) also exists |
| `/api/users/me`, `/api/users/profile`, `/api/users/[id]` | GET/PATCH | yes (`[id]` **no**) | — | **0** | `PARTIAL` |
| `/api/orgs`, `/api/orgs/[id]` | GET/POST/PATCH/DELETE | yes (Zod `lib/validation/orgs.ts`) | — | **0** | `PARTIAL` |
| `/api/rooms`, `/api/rooms/[id]` | " | yes | — | **0** | `PARTIAL` |
| `/api/memberships`, `/api/memberships/[id]` | " | yes | — | **0** | `PARTIAL` |
| `/api/invites`, `/api/invites/[token]`, `/accept`, `/revoke` | " | yes (`[token]` GET **no** — by design, token is the secret) | — | **0** | `PARTIAL` |
| `/api/subscriptions/checkout`, `/portal`, `/current`, `/me` | POST/GET | yes | — | **0** | `PARTIAL` |
| `/api/stripe/webhook` | POST | Stripe signature (`STRIPE_WEBHOOK_SECRET`) | — | Stripe | `REAL` — handles `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.updated`, `customer.subscription.deleted` |
| `/api/polygon/snapshot`, `/api/polygon/bars` | GET | **no** | — | 3 / **9** | `REAL` (unauthenticated proxy) |
| `/api/market/agg`, `/candles`, `/overlays` | GET | **no** | — | 1 / 4 / 3 | `REAL` (unauthenticated) |
| `/api/market/stats` | — | — | — | **2 callers, route does not exist** | `MISSING` (dead call in `session-analysis-display.tsx`) |
| `/api/archio` | POST | **no** | — | 1 (`ask-answer-surface`) | `REAL` LLM, grounded (§6) |
| `/api/command` | POST | **no** | — | 1 (`CommandRail` via `useChat`) | `REAL` LLM, ungrounded (§6) |
| `/api/copilot/chat` | POST | no | — | 3 | `MOCK/DEMO` — keyword matcher, no model, no DB |
| `/api/copilot/notify-mentor` | POST | **no** | **yes** | 1 | **SECURITY FLAG** |
| `/api/communities` | GET | no (public read) | — | 2 | `REAL` with mock fallback |
| `/api/health` | GET | — | — | — | `REAL` |

**Summary:** 37 route files → **19 have zero UI callers** (the entire REST auth/org/room/membership/invite/user/billing layer), **1 UI call targets a non-existent route**, **4 routes run an external paid service without authentication** (2 LLM, Polygon ×2 + market ×3).

### 2.4 Authentication and session — `REAL`
- Supabase Auth via browser client (`lib/supabase/client.ts`) for sign-up/in/out/reset; SSR cookie refresh in `lib/supabase/middleware.ts` (`updateSession`); `lib/auth/AuthProvider.tsx` exposes `useAuth()` with `role` from `user_metadata.role` (default `"STUDENT"`).
- Role model: `STUDENT | MENTOR | ADMIN` in `lib/stores/useSession.ts` / `components/auth/RoleProvider.tsx`; `RequireRole` component exists and is **used by nothing**.
- Route protection: protects `/usage /support /integrations /developers /status /settings /billing /admin` (**none exist**); ~~`/hub` self-gates~~ **`/hub` does NOT self-gate** — its page-level guard was removed July 2026 (code comment in `app/(main)/hub/page.tsx`); verified HTTP 200 signed out, D1 inspection 20 Sep 2026 (`12` SH-STATE-002 / FD-NAV-001 corrected the same day; this line corrected 20 Sep second session). All real pages public.

### 2.5 Event systems — all client-side, none persisted
| System | File | What it does | Persists? |
|---|---|---|---|
| Global bus | `lib/bus.ts` | untyped `on/emit` Map with `console.log("[BUS]")` | no |
| Copilot EventBus | `lib/copilot/eventBus.ts` | typed `CopilotEvent` buffer, subscribers, `startFlushLoop(persist)` | **no — flush loop commented out** in `CopilotProvider.tsx` |
| Watchers | `lib/copilot/watchers/{risk,copy,progress}Watcher.ts` | rule-based client "agents" emitting events | no |
| Event log store | `lib/stores/useEventLog.ts` | zustand, no `persist` | no |
| Live Room ledger | `components/live-room/session-store.tsx`, `session-state.ts` | append-only `SessionEvent[]`, derived lenses | no (layout ratios only, `localStorage`) |
| Real-time pipeline | `lib/services/realTimeDataPipeline.ts`, `hooks/useRealTimeAnalytics.ts`, `components/copilot/RealTimeDataProvider.tsx` | client polling/synthesis | no |

### 2.6 Market data — `REAL` server side, unevenly used
`lib/providers/polygonRest.ts` (`fetchUnifiedSnapshot`, `fetchCustomBars`), `lib/market/composeBars.ts`, `lib/stores/useAnalysis.ts` (has 1 TS error: `PolygonBar.v` missing), `lib/price-api.ts`, `lib/price/`, `lib/hooks/useLivePrice.ts`. Consumers: Flight Deck trading desk chart, `/api/archio` grounding, MTF, analysis stores. **Not** consumed by `/` (Signal Terminal uses `generateMockPriceData`). `FINNHUB_KEY` / `ALPHAVANTAGE_KEY` referenced once each — `NEEDS VERIFICATION` whether live.

### 2.7 TradingView — embed only
`components/trading-view-widget.tsx` (`tv.js`, grid overrides), `vantary/trading-desk/chart.tsx` (widgetembed URL with `overrides` + `gridColor`), `execution-copilot/copilot-chart-panel.tsx`, `profile/ProfileConnections.tsx` (a "connect TradingView" UI with nothing behind it), `lib/stores/useProfile.ts`. No TradingView auth, no MCP, no data read-back. Status `REAL` (embed) / `MISSING` (any integration).

### 2.8 Forecasting code — UI only
`components/forecast-hub/*` (24k lines, `SAMPLE_FORECASTS`), legacy `components/*forecast*.tsx` ×10, `lib/community-data.ts` (`mockForecasts`), `flight-deck/templates/forecast-room.tsx`. No table (`forecasts` does not exist), no API, no `localStorage`, no resolution logic. See §3.3.

### 2.9 Notifications — one table, no system
`mentor_notifications` (insert-only via unauthenticated service-role route; no reader); `community-panel/notification-center.tsx` (mock); `dashboard/modules/notifications.tsx` (mock); `copilot/ActivityNotifications.tsx` (client events); shadcn toast. No email provider, no push, no outbox, no generic table. See §3.5.

### 2.10 Demo / mock data registry (so nobody mistakes it for real)
`lib/response-engine/journal.ts` (`source: "demo-journal"`) · `lib/stores/useProfile.ts` (`MOCK_PROFILE`, `MOCK_MENTOR_PROFILE`, `MOCK_BADGES`, `MOCK_ACTIVITY`) · `app/api/communities/route.ts` (`MOCK_COMMUNITIES`) · `components/forecast-hub/forecast-feed.tsx` (`SAMPLE_FORECASTS`) · `components/community-panel/community-data.ts` · `lib/community-data.ts` (`mockForecasts`, `mockEntries`) · `components/live-market-intelligence.tsx` (`generateMockPriceData`) · `components/live-room/session-state.ts` (scripted session) · `components/dashboard/dashboard-data.ts` · `components/dashboard/vantary/oracle-data.ts` · `components/dashboard/vantary/trading-desk/data.ts` · `components/dashboard/vantary/strategy-os/data.ts` · `components/cockpit/cockpit-data.ts` · `components/nexus/*` default layouts · `execution-copilot-layout.tsx` hard-coded prices · `/api/copilot/chat` canned replies.

---

## 3. The five Architect verification questions — answered from code

### 3.1 Education

| Asked | Finding | Class |
|---|---|---|
| Schemas / tables | No SQL file creates any course, lesson, curriculum, enrollment, progress or content table. The only "education" words in SQL are the `beginner_friendly` column on `groups` and seed text in `006`. | **ABSENT** |
| APIs / routes | None. No `/api/*` mentions courses, lessons, progress. | **ABSENT** |
| Storage / content | No storage buckets, no CMS, no MDX content tree. | **ABSENT** |
| Curriculum / courses | Narrative only: `/cockpit` (`cockpit-data.ts`), `components/mentor/MethodVault.tsx`, `EntryModelCards.tsx`, `copilot/coach/MentorGuideAndTutorial.tsx`, tutorial overlays, `live-room/glossary.ts` (static term dictionary). | **UI-DEMO** |
| Progress / enrollments | None in code; `community_mentors.total_students` is a seeded integer, not a relation. | **ABSENT** |
| What is real | `groups.beginner_friendly`, `community_mentors.*` (schema+seed), the glossary component. | **REAL (schema/static) but not education** |

**Verdict:** Education has **zero backend**. Every learning surface in `12` §5.4 is UI-DEMO. If Education is a Level-1 system, it starts from nothing technically; the glossary/explain-term pattern is the one reusable seed (contextual General intelligence, `11` §3).

### 3.2 `copilot_events`

| Asked | Finding (exact paths) |
|---|---|
| What writes to it | `lib/copilot/persist.ts` → `persistCopilotEvents(events)` → `sb.from("copilot_events").insert(events)` using the **browser anon key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`). This function is imported **only** in `components/copilot/CopilotProvider.tsx` where both the import (line 6) and the call `copilotBus.startFlushLoop(persistCopilotEvents, 4000, 40)` (line 49) are **commented out**. |
| What reads it | **Nothing.** `grep copilot_events` over `app/ components/ lib/` returns only `persist.ts`. |
| Does `/api/archio` read it | **No.** `app/api/archio/route.ts` contains no `.from()` call at all; its "journal" is `lib/response-engine/journal.ts` (demo book). |
| Does DNA / journal / review read it | **No.** Strategy OS, psychology modules, copilot journal tab, `SessionDebriefOverlay` all read local mock data. |
| Effectively write-only? | **Effectively dead.** Not write-only — *nothing* writes to it today. If the flush loop is un-commented it becomes write-only with an open insert policy. |
| Correction to `08` | `08` says "Written from `app/api/copilot/chat`". That route (`app/api/copilot/chat/route.ts`) is a keyword matcher and performs no DB operation. **`08` must be corrected.** |

**Verdict:** `copilot_events` is a **schema-only, dead table with an open insert policy** (`with check (true)`) and a permissive select policy (`user_id IS NULL` rows readable by any authenticated user). Its *shape* (append-only JSONB events with `type/ts/session_id/user_id/context/data`) is still the right shape for a shared event spine (F4) — the table is not; the policies are not.

**Reading rule for the Architect bot (founder instruction, 20 Sep 2026 second session — re-verified from code the same day):** `copilot_events` is a **dormant / dead pattern, not an active working persistence pipeline and not a real event spine.** `lib/copilot/persist.ts` contains a writer; its only call site (`components/copilot/CopilotProvider.tsx` lines 6 and 49) is commented out; `app/api/copilot/chat` does not write to `copilot_events`; nothing reads it. Any proposal that "reuses the `copilot_events` pipeline" must say it is reviving a dead table under fixed policies (S2, S3), not extending a live one.

### 3.3 Forecast persistence

| Asked | Finding |
|---|---|
| Schema exists | `forecast_groups` in `scripts/community-schema.sql` (id, `forecast_id` with **no FK** — comment "References forecasts table (to be created)", `group_id`, `shared_by`, `shared_at`; 3 RLS policies). **No `forecasts` table anywhere.** |
| Migration exists | No migration tool. The SQL file exists. |
| Migration applied | `CANNOT VERIFY LIVE DB FROM REPO`. |
| Write path | **None.** Zero `.from('forecast_groups')`, zero `.from('forecasts')`, zero forecast API route, zero `localStorage` in `components/forecast-hub/`. `ForecastSubmitDrawer` collects a form and discards it. |
| Read path | **None** from DB. All feeds read `SAMPLE_FORECASTS` / `mockForecasts`. |
| Classification | `forecast_groups`: **dead schema (orphaned join table to a table that was never created)**. Forecast Hub: **DEMO**. Forecast as a data object: **MISSING**. |

**Verdict:** there is no forecast persistence of any kind. The Forecast Hub (24k lines) is the largest pure-UI system in the product.

### 3.4 Database migrations and RLS

| Asked | Finding |
|---|---|
| Migration system | **None.** `scripts/*.sql` are hand-run files (v0 "run script" convention). No `supabase/` CLI project, no `migrations/` folder, no version table, no `package.json` script. |
| Ordering / conflicts | Numbered files `001`–`006` plus **four un-numbered** files (`community-schema.sql`, `community.sql`, `copilot-tables.sql`, `create-community-tables.sql`). `groups`/`group_members` are **defined three times** with different columns and different policy names (`community-schema.sql` has one `DROP`); `group_invites` twice. Which definition the live DB has: `CANNOT VERIFY LIVE DB FROM REPO`. `004` uses `ADD COLUMN IF NOT EXISTS` so it tolerates any of the three. |
| RLS coverage | Every created table has `ENABLE ROW LEVEL SECURITY` and at least one policy (verified list in `12` audit). |
| Open policies | `copilot_events` insert `with check (true)` (already in `08`); **new:** `copilot_events` select allows `user_id IS NULL` rows to any authenticated user; `mentor_notifications` insert `with check (true)` (intended "server role only" per the policy name, but the anon key could also insert since RLS does not distinguish). |
| Service-role usage (bypasses RLS) | `lib/auth/supabaseAdmin.ts` (`createAdminClient`, null-safe); `app/api/auth/signup/route.ts` (`auth.admin.createUser` with role metadata — unreachable from UI); `app/api/copilot/notify-mentor/route.ts` (**unauthenticated insert — see §7**). |
| What repo code proves | Only that these statements were *written*. The one soft proof of application is `/api/communities`, which logs `"groups table not found, using mock data"` — meaning the author expected the table might be absent in some environments. |

**Verdict:** RLS is present on paper for every table; there is **no migration discipline**, three competing community schemas, and two `with check (true)` inserts. Before real trader data exists: adopt one migration path, collapse the `groups` definitions, close both open inserts.

### 3.5 Notifications

| Asked | Finding |
|---|---|
| Reusable notification table | **No.** Only `mentor_notifications` (single-purpose: `kind = 'copied_entry'`). |
| Event bus | Client only (§2.5). No server-side bus. |
| Outbox | **No.** |
| Push | **No** (no service worker, no web-push, no push table). |
| Email | **No** provider (no Resend/SendGrid/Nodemailer/react-email). Supabase Auth sends its own auth emails — that is the only email in the product. |
| In-app delivery | **No reader exists** for `mentor_notifications`. `notification-center.tsx`, `modules/notifications.tsx`, `ActivityNotifications.tsx` render mock or client events. |
| Real backend vs UI/demo | Backend: one insert route (unauthenticated) into one table nobody reads. UI: three notification UIs on demo data. |

**Verdict:** there is **no notification system**. There is a hole where one would go, and three UIs pretending it exists.

---

## 4. Shared technical foundations

Each foundation is something several Level-1 systems need. The list follows the request but is reorganised where the repo suggests it (F3 splits into two tenancy models because the code has two; F4/F8 are kept separate because the event spine and trading memory have different write rules). Nothing here is designed — only located and classified.

Field key: **PURPOSE** · **NEEDED BY** (Level-1 systems from `12`) · **CURRENT IMPLEMENTATION** · **FILES / PATHS** · **CURRENT DATA** · **SECURITY / PERMISSIONS** · **MISSING** · **REUSE / REFRAME / REBUILD / UNKNOWN** · **AI vs DETERMINISTIC** · **EXTERNAL DEPENDENCIES** · **SYSTEMS BLOCKED BY IT** · **NEEDS-V0-VERIFICATION** · **EVENTUAL QCLAY / OUTSIDE-ENGINEER QUESTION**

### F1 · Identity (who is this user)
- **PURPOSE:** one trusted `user_id`, session, and profile row for everything else to key on.
- **NEEDED BY:** all seven systems.
- **CURRENT IMPLEMENTATION:** `REAL`. Supabase Auth; `profiles` row auto-created by trigger; `AuthProvider` context.
- **FILES:** `lib/supabase/{client,server,middleware}.ts`, `lib/auth/AuthProvider.tsx`, `lib/auth/supabaseAdmin.ts`, `components/auth/*`, `scripts/001_auth_schema.sql` (profiles + `handle_new_user`).
- **CURRENT DATA:** `auth.users`, `profiles` (4 real columns). Role only in `user_metadata`.
- **SECURITY:** RLS on `profiles` (select all — profiles are public by policy; is that intended?). Two auth implementations; the REST one is dead.
- **MISSING:** role as a first-class column or claims; settings/preferences; account deletion/export; consent record (`11` §2).
- **VERDICT:** **REUSE** (delete the dead REST auth layer; keep Supabase Auth). **Founder note (DL-029, 20 Sep 2026):** the `/login` face-scan mode is **DEMO/SIMULATION** — timers + a fabricated local user, no session, no biometric check (`components/auth/AccessPortal.tsx` 534–535, `app/login/page.tsx` 83–89); it is UI, not part of F1. Future real secure authentication (device-native biometrics / Face ID / passkeys · email · confirmation codes · phone) = FOUNDER DIRECTION; KYC / account integrity = OPEN; the five concepts stay separate. **No implementation change yet.** DL-027: one post-auth destination (the Dashboard / Flight Deck workspace) — routes unchanged.
- **AI vs DETERMINISTIC:** deterministic.
- **EXTERNAL:** Supabase.
- **BLOCKS:** nothing today (public app); blocks every "your data" surface once data exists.
- **NEEDS-V0-VERIFICATION:** which `/auth/callback` Supabase is configured to use; whether `profiles_select_all` is intended.
- **QCLAY / ENGINEER QUESTION:** none — this is done enough. Ask only: "settings/consent pages — who designs them?"

### F2 · Permissions & privacy (who may see what)
- **PURPOSE:** row-level rules and a product-level privacy model (`11` §2: observation "with the user's permission").
- **NEEDED BY:** IL (private decisions), AA (personal intelligence), CO (rooms), AM.
- **CURRENT IMPLEMENTATION:** `PARTIAL`. RLS everywhere on paper; `RequireRole` unused; middleware protects nothing real; two open inserts.
- **FILES:** all `scripts/*.sql` policy blocks; `lib/supabase/middleware.ts`; `components/auth/RequireRole.tsx`, `RoleProvider.tsx`.
- **CURRENT DATA:** none about consent or visibility preferences.
- **SECURITY:** see §7 (four flags).
- **MISSING:** visibility field on any user-created object (there are no user-created objects yet); consent model; per-route auth on paid endpoints.
- **VERDICT:** **REFRAME** — keep RLS as the mechanism, write the product privacy model first (a founder document), then policies follow it. **First paragraph of that model now exists — DL-023 (20 Sep 2026):** social-style configurable privacy; three tiers (public profile · connection-shared, user-chosen · private account / intelligence, never exposed by a connection); personalised product requires login. The detailed permission matrix and the policies that encode it are a **future dedicated design + technical block** (not D1, not T1).
- **AI vs DETERMINISTIC:** deterministic, always.
- **BLOCKS:** any real capture; any personal AI.
- **QCLAY / ENGINEER QUESTION:** "Given this privacy model, quote the policy + audit work." (Cannot be quoted until the model exists.)

### F3 · Community tenancy — two models
- **PURPOSE:** the container a trader belongs to (mentor room / community) and its membership.
- **NEEDED BY:** CO, ED, IL (shared decisions), SM.
- **CURRENT IMPLEMENTATION:** `PARTIAL`, **twice**. **Model A:** `groups → group_members → group_invites/group_posts/forecast_groups/community_mentors` (read by `/api/communities`, discovery UI; no write UI). **Model B:** `organizations → rooms → memberships → invites` (Zod-validated REST API, session-checked, no UI). A and B share nothing. *[LABELS CORRECTED 20 Sep 2026: this row originally had A and B the other way round from `14` §2.6 / §3.2 D-2 / Q-6 — the labels the founders answered. Corrected to match; the code facts are unchanged.]*
- **FILES:** A — `app/api/communities/route.ts`, `components/communities/*`, `scripts/community-schema.sql`, `community.sql`, `create-community-tables.sql`, `004`, `005`, `006`. B — `app/api/{orgs,rooms,memberships,invites}/**`, `lib/validation/*.ts`, `scripts/001`, `003`.
- **CURRENT DATA:** seeded `groups` + `community_mentors` (if `006` was applied).
- **SECURITY:** both RLS'd; A has three conflicting policy sets by file.
- **MISSING:** join/leave/request UI; room detail; posts; live session object. ~~A decision about which model survives.~~ → decided, below.
- **VERDICT:** **DECIDED — Model B (DL-020, Luke + Kan, 20 Sep 2026).** The structural model for all future architecture / design work is **organization / community → rooms / channels → memberships / access** — one model, not two. Model A (`groups`-only tenancy) is **SUPERSEDED for design and architecture**; its tables, the discovery page that reads them and the `006` seed are **preserved as repo facts** until an actual technical migration / refactor is separately approved (that approval is not this decision). Founder framing: familiar like Discord trading communities' community → channels; not a literal copy; no rooms or features invented from the example. *Previous verdict, kept for history:* ~~UNKNOWN pending founder decision — `01` rejected ideas warn "orgs/memberships reflect an earlier product direction, not demand." Recommendation to founders: choose one model on the product map before any engineer touches either.~~ The `01` warning still binds: the Model B API existing is not a reason to design admin UI (`12` F-8).
- **AI vs DETERMINISTIC:** deterministic; AI only for discovery matching (`my-fit-analysis` template is a candidate) — not yet.
- **EXTERNAL:** Stripe (`groups.stripe_price_id` for paid communities).
- **BLOCKS:** CO join flows, Live Room reality, mentor studio, SM.
- **NEEDS-V0-VERIFICATION:** which `groups` DDL is live; whether `006` seed ran.
- **QCLAY / ENGINEER QUESTION:** "Community = which model? Then quote join/manage flows."

### F4 · Shared event / persistence spine
- **PURPOSE:** the principle in §5 — one user action → one trusted record → many systems read it.
- **NEEDED BY:** FD (telemetry), IL (capture/compare/review), AA (personal intelligence), TP, AG.
- **CURRENT IMPLEMENTATION:** `MISSING` on the server. Client shape exists three times (`lib/bus.ts`, `lib/copilot/eventBus.ts`, Live Room ledger). `copilot_events` is the right *shape*, dead and unsafe.
- **FILES:** `lib/bus.ts`, `lib/copilot/{eventBus,persist,types}.ts`, `lib/copilot/watchers/*`, `components/live-room/session-store.tsx`, `session-state.ts`, `scripts/copilot-tables.sql`.
- **CURRENT DATA:** none persisted.
- **SECURITY:** open insert; anonymous-readable rows.
- **MISSING:** a server-side write path with auth; typed event catalogue; per-user read; retention.
- **VERDICT:** **REFRAME** the `copilot_events` shape into a real, authenticated spine; **REBUILD** the policies; retire `lib/bus.ts` (untyped, logs to console).
- **AI vs DETERMINISTIC:** writing events is deterministic; interpreting them is AI (later).
- **BLOCKS:** everything in `11` §2 ("learn from how the trader behaves"). **This is the foundation the founder direction depends on most and has least of.**
- **QCLAY / ENGINEER QUESTION:** "Event spine: catalogue of ~N event types, one table or per-type tables, retention, read API — quote." (N is a founder/Architect output.)

### F5 · Trading memory / Intent data (the loop's objects)
- **PURPOSE:** `decision_records` (per-field provenance, `locked_at`, market snapshot, visibility — DL-001/011/012/013), `trades`, `decision_reviews`, matcher, `lock_lead_seconds`.
- **NEEDED BY:** IL, FD (every gadget), AA (personal), TP.
- **CURRENT IMPLEMENTATION:** `MISSING`. UI shapes exist: `copilot-trade-plan.tsx`, `TradeExecutionPanel.tsx`, `ForecastSubmitDrawer`, Live Room ledger, `lib/scenario-store.ts`.
- **CURRENT DATA:** demo journal in `lib/response-engine/journal.ts`.
- **MISSING:** all three tables; CSV import; matcher; six SQL aggregates (Trader Model v0, `08`).
- **VERDICT:** **REBUILD** (nothing to reuse but UI shapes and the `/api/archio` pattern).
- **AI vs DETERMINISTIC:** capture, lock, match, deviation math — **deterministic**; the phrasing of a review — AI (DL-003: one call).
- **EXTERNAL:** none for CSV; broker read-only later (F10).
- **BLOCKS:** the entire loop; every Flight Deck number.
- **GOVERNANCE NOTE:** `02` §3 "Nothing above it should be built until capture is observed…" is OPEN (`11` App. A). This row *locates*; it does not schedule.
- **PHASE NOTE (DL-021, Luke + Kan, 20 Sep 2026):** this phase is **DESIGN SHAPE ONLY** — keep defining how the loop fits ARCHIO, its UX / shape / flows, and technical learning about this data model where useful; **do not implement** the persistence / backend loop; implementation stays parked regardless of the concept's importance. The REBUILD verdict above describes *what would be built*, not a green light.
- **QCLAY / ENGINEER QUESTION:** "Three tables + CSV import + matcher + six aggregates — quote as one bounded unit" (this is the DL-006 'bounded loop' offer).

### F6 · Market-data gateway
- **PURPOSE:** one server-side source of prices/bars/snapshots for every surface and for AI grounding.
- **NEEDED BY:** MX, FD, IL, AA, CO (Live Room chart).
- **CURRENT IMPLEMENTATION:** `REAL`. Polygon REST behind 5 routes; `composeBars`; used by `/api/archio` grounding.
- **FILES:** `lib/providers/polygonRest.ts`, `lib/market/composeBars.ts`, `app/api/polygon/*`, `app/api/market/*`, `lib/stores/useAnalysis.ts`, `lib/price-api.ts`, `lib/hooks/useLivePrice.ts`.
- **CURRENT DATA:** live Polygon (server key).
- **SECURITY:** routes unauthenticated — cost exposure (§7).
- **MISSING:** auth/rate-limit; the missing `/api/market/stats`; `/` still on mock; caching layer (none; `swr` installed but sparse).
- **VERDICT:** **REUSE** (add auth + cache; delete mock generators).
- **AI vs DETERMINISTIC:** deterministic.
- **EXTERNAL:** Polygon.io (paid). Finnhub/AlphaVantage keys referenced — `NEEDS VERIFICATION`.
- **BLOCKS:** nothing; enables honesty fixes immediately.
- **QCLAY / ENGINEER QUESTION:** none needed for v1.

### F7 · Grounded AI / context assembly
- **PURPOSE:** the pattern route → ground → prompt → schema → registry (`08`: "the template for the single LLM call").
- **NEEDED BY:** AA, FD (doors), IL (review), ED (explain), CO (Catch Me Up later).
- **CURRENT IMPLEMENTATION:** `REAL` for General intelligence (`/api/archio`), `REAL` ungrounded (`/api/command`), `MOCK/DEMO` (`/api/copilot/chat`).
- **FILES:** `app/api/archio/route.ts`, `lib/response-engine/{router,contract,journal}.ts`, `components/dashboard/vantary/response-engine/{registry,primitives}.tsx`, `cartouche/ask-answer-surface.tsx`; `app/api/command/route.ts`, `lib/command/*`.
- **CURRENT DATA:** real Polygon + demo journal.
- **SECURITY:** unauthenticated; no per-user quota.
- **MISSING:** personal grounding (needs F4/F5); auth; cost control; a rule that generated UI uses product tokens (`12` §8.23).
- **VERDICT:** **REUSE** the `/api/archio` pattern as the canonical AI path; **RETIRE** `/api/copilot/chat` or relabel it as scripted help; decide whether `/api/command` merges into `/api/archio` (two front doors to the same brain).
- **AI vs DETERMINISTIC:** routing and grounding — deterministic; the answer — AI; the *numbers* in the answer — must come from grounding (already enforced by prompt + schema).
- **EXTERNAL:** Vercel AI Gateway → OpenAI models.
- **BLOCKS:** Personal ARCHIO Intelligence (`11` §3) until F4/F5 exist.
- **QCLAY / ENGINEER QUESTION:** "AI modules were excluded from your estimate — here is the one pattern; quote hardening (auth, quota, eval) not invention."

### F8 · Personal memory (what ARCHIO knows about *this* trader)
- **PURPOSE:** preferences, watched markets, sessions active, tools used, pages visited, goals, style (`11` §2).
- **NEEDED BY:** AA (personal), FD (personalised deck), IL (drift), ED (what they consumed).
- **CURRENT IMPLEMENTATION:** `MISSING` server-side. Client fragments: `useProfile` persist (mock), `useNavigatorConfig`, `useInstrument`, `useSession`, 8 `localStorage` keys, Live Room layout memory.
- **MISSING:** everything; depends on F4 (behaviour events) + a preferences table.
- **VERDICT:** **REBUILD** on top of F4.
- **AI vs DETERMINISTIC:** storage deterministic; "understanding" AI — later.
- **BLOCKS:** `11` §6 compounding value.
- **QCLAY / ENGINEER QUESTION:** defer until F4 exists.

### F9 · Notifications
- **PURPOSE:** in-app + eventual email/push delivery of events to a person.
- **NEEDED BY:** CO (mentor calls), IL (review ready), ED, AA (proactive help, `11` §5).
- **CURRENT IMPLEMENTATION:** `MISSING` (see §3.5). One unsafe insert route.
- **VERDICT:** **REBUILD** as a *consumer* of F4 (a notification is one reaction to one event) — do not build it as its own island.
- **AI vs DETERMINISTIC:** deterministic delivery; AI only decides *relevance* (later).
- **EXTERNAL:** an email provider (none chosen).
- **BLOCKS:** any "ARCHIO nudges you" promise.
- **QCLAY / ENGINEER QUESTION:** "Notification centre UI + delivery — quote after F4."

### F10 · Integrations normalisation (broker / TradeLocker / TradingView)
- **PURPOSE:** read-only trade history into `trades` (DL-004: read-only in v2, no execution).
- **NEEDED BY:** IL (COMPARE), FD (all P&L gadgets), TP, AM (accounts).
- **CURRENT IMPLEMENTATION:** `MISSING`. UI stubs: `ProfileConnections.tsx`, `trading-desk/execution-console/`, `TradeExecutionPanel.tsx`, `dashboard/modules/accounts.tsx`, `useAccounts`.
- **VERDICT:** **REBUILD**; first step is CSV import (no partner needed), per `08`.
- **AI vs DETERMINISTIC:** deterministic.
- **EXTERNAL:** TradeLocker (Owen) — read-only API; the Owen deck already states "not connected" honestly.
- **BLOCKS:** F5 COMPARE; every real number in FD.
- **QCLAY / ENGINEER QUESTION:** "CSV import → normalised `trades`; later one read-only broker adapter — quote separately." **Owen question sharpened by this file:** *"What read-only order-history endpoint and auth model does TradeLocker offer a third party, and what fields does a fill carry?"*

### F11 · Real-time & live sessions
- **PURPOSE:** presence, chat, screen/video, live events for the Live Room and community rooms.
- **NEEDED BY:** CO, ED, IL (live capture).
- **CURRENT IMPLEMENTATION:** `MISSING`. Live Room is a scripted client ledger. Supabase Realtime is available in the platform but **unused** (no `channel(` / `.on('postgres_changes'` found).
- **VERDICT:** **REBUILD**; candidate primitives exist (Supabase Realtime) — not chosen.
- **AI vs DETERMINISTIC:** deterministic transport; AI for summaries (Catch Me Up) later.
- **EXTERNAL:** video/screen-share provider (none).
- **BLOCKS:** Live Room reality; Catch Me Up.
- **QCLAY / ENGINEER QUESTION:** "Live Room transport (presence + chat + screen) — provider choice and quote." One of the larger unknown costs in the $300–350k.

### F12 · Billing
- **PURPOSE:** plans, subscriptions, paid communities.
- **NEEDED BY:** AM, CO (paid groups), SM.
- **CURRENT IMPLEMENTATION:** `PARTIAL` — backend `REAL` (checkout, portal, webhook, tables, seed), UI `MISSING`.
- **FILES:** `app/api/subscriptions/*`, `app/api/stripe/webhook/route.ts`, `scripts/001`, `002`.
- **SECURITY:** webhook signature verified; routes session-checked.
- **MISSING:** any UI; `groups.stripe_price_id` flow; what the plans *gate* (no feature flags read `plans.limits`).
- **VERDICT:** **REUSE** backend; **founder decision first** on what is paid (F-8 guard rail in `12`).
- **EXTERNAL:** Stripe.
- **QCLAY / ENGINEER QUESTION:** "Pricing/billing pages — design only; backend exists."

### F13 · File / media storage
- **PURPOSE:** avatars, chart screenshots, recordings, imported CSVs.
- **CURRENT IMPLEMENTATION:** `MISSING` (zero storage calls; `avatar_url` columns exist with nothing behind them; `images.unoptimized`).
- **VERDICT:** **REBUILD** when first needed (CSV import is the first real need — F10).
- **EXTERNAL:** Supabase Storage or Vercel Blob (not chosen).

### F14 · Education / content
- **PURPOSE:** courses, lessons, progress, mentor method content.
- **CURRENT IMPLEMENTATION:** `MISSING` (§3.1). Static glossary is the only content primitive.
- **VERDICT:** **direction DECIDED — COMBINATION (DL-022, Luke + Kan, 20 Sep 2026):** a dedicated learning system (structured learning experiences · mentor-created educational content · student access / progression) **plus** contextual surfacing of educational content and intelligence across Community, Ask Archio, Flight Deck, onboarding and other experiences. Creator knowledge feeding AI agents / marketplace products = VISION, no implementation commitment. The *technical* verdict stays **MISSING → shape follows the FLOWS phase**; still do not pick a CMS or content backend before the Education flows are mapped. *Previous:* ~~UNKNOWN — depends on what Education is on the product map.~~
- **AI vs DETERMINISTIC:** contextual explanations are a strong AI fit (General intelligence over a curated glossary); progress is deterministic.
- **QCLAY / ENGINEER QUESTION:** defer.

### F15 · Search / retrieval
- **PURPOSE:** find communities, mentors, past decisions, glossary terms; later RAG over the user's own history.
- **CURRENT IMPLEMENTATION:** `PARTIAL` — `/api/communities` filter/sort over `groups` is the only server search; client `Command` palette (26 uses) does in-memory search.
- **VERDICT:** **REUSE** for communities; **MISSING** for everything personal (needs F4/F5).

### Foundation status at a glance

| F | Foundation | Status | Verdict |
|---|---|---|---|
| F1 | Identity | REAL | REUSE |
| F2 | Permissions & privacy | PARTIAL + SECURITY FLAG | REFRAME |
| F3 | Community tenancy (×2) | PARTIAL, duplicated | **DECIDED Model B** `orgs → rooms → memberships` (DL-020); Model A superseded for design; migration not yet approved |
| F4 | Event spine | MISSING (dead shape exists) | REFRAME shape / REBUILD policies |
| F5 | Trading memory / Intent | MISSING | REBUILD — **design shape only this phase, no implementation (DL-021)** |
| F6 | Market-data gateway | REAL (unauth) | REUSE + harden |
| F7 | Grounded AI | REAL (General only, unauth) | REUSE pattern |
| F8 | Personal memory | MISSING | REBUILD on F4 |
| F9 | Notifications | MISSING + SECURITY FLAG | REBUILD as F4 consumer |
| F10 | Integrations (broker) | MISSING | REBUILD (CSV first) |
| F11 | Real-time / live | MISSING | REBUILD |
| F12 | Billing | PARTIAL (backend real, no UI) | REUSE |
| F13 | File storage | MISSING | REBUILD when needed |
| F14 | Education / content | MISSING | direction **DECIDED: combination** (DL-022) — technical shape follows the FLOWS phase |
| F15 | Search | PARTIAL | REUSE / MISSING |

**Real foundations: 3 (F1, F6, F7). Partial: 4 (F2, F3, F12, F15). Missing: 8 (F4, F5, F8, F9, F10, F11, F13, F14).**

---

## 5. The major principle — is it followed?

**ONE USER ACTION → ONE TRUSTED EVENT/RECORD → MANY ARCHIO SYSTEMS CAN USE IT**

**Answer: not yet, anywhere.** No user action in the product today produces a server-side record that a second system reads. The closest things are:

- **Correct shape, not persisted:** Live Room `SessionEvent` ledger → derived lenses → phase-aware tools (one append, many derived views) — this is the principle working *inside one browser tab*.
- **Correct shape, dead:** `copilot_events` + `EventBus` + watchers.
- **Persisted, single consumer:** Stripe webhook → `subscriptions` (nothing else reads it); `notify-mentor` → `mentor_notifications` (nothing reads it).

**Surfaces that create — or would create — a disconnected private backend instead of using shared foundations** (identified, not refactored):

| Surface | Private state it keeps | Should instead read/write |
|---|---|---|
| `useProfile` (zustand `persist`) | a whole profile in `localStorage` | `profiles` (F1) + F8 |
| Forecast Hub | nothing (discards) — but if wired naively it would get its own `forecasts` silo | a Decision Record with `visibility = public` (F5) — **founder decision** (`14` §3) |
| Copilot journal / psychology / strategy tabs | mock; would naturally grow their own tables | F5 + F4 |
| Strategy OS (`strategy-os/data.ts`) | mock rules/DNA | F5 (`rules`) + F8 |
| `dashboard/modules/notifications.tsx`, `notification-center.tsx` | mock | F9 as consumer of F4 |
| `lib/scenario-store.ts` | client scenarios | F5 (conditional decision records) |
| `useAccounts`, `modules/accounts.tsx` | mock accounts | F10 |
| `mentor_notifications` | its own table with its own semantics | F9 over F4 |
| Model A vs Model B tenancy | two membership truths | one F3 — **Model B decided (DL-020)**; collapse awaits a separately approved migration |
| `/api/copilot/chat` | its own "AI" | F7 |

---

## 6. AI inventory

### 6.1 Every AI responsibility in the current context

| # | Responsibility | Where | Class | Input context | Trusted source | Permissions | Output | Fact or interpretation | Model / provider | Cost / latency (verifiable) | Fallback / error |
|---|---|---|---|---|---|---|---|---|---|---|---|
| A1 | Grounded market/trade answer (analyze · explain · review · check · simulate) | `/api/archio` | **existing real AI endpoint** | prompt + route + Polygon snapshot + 48 h bars + journal grounding | Polygon (real); journal (**demo**) | **none** (unauth) | schema-validated JSON envelope (tone, drivers, levels, confidence, template id) | interpretation over grounded facts; prompt forbids new numbers | `openai/gpt-4.1-mini` via AI Gateway | `maxDuration 30`; per-call cost not measured | schema failure → stream error; no retry visible; `NEEDS VERIFICATION` |
| A2 | Free-form command / intent reply | `/api/command` | **existing real AI endpoint** | messages + parsed intent + `CAPABILITY_MATRIX` + suggestions | none (ungrounded) | **none** | streamed text | interpretation | `openai/gpt-5-mini` | `maxDuration 30` | none visible |
| A3 | Copilot "buddy" chat (recap, checklist, next session, note, remind) | `/api/copilot/chat` | **scripted / fake AI** | `q` + instrument + prevDay | UTC clock | none | canned markdown w/ emoji | scripted | none | trivial | n/a |
| A4 | Risk / copy / progress watchers | `lib/copilot/watchers/*` | **deterministic software owns this** (currently rule-based, client) | client events | client state | n/a | client events | fact (rules) | none | n/a | n/a |
| A5 | Oracle reading / Oracle summary tool | `oracle-*`, live-room ORACLE SUMMARY | scripted / mock | — | — | — | text | — | none | — | — |
| A6 | Nexus AI synthesis | `nexus-ai-synthesis-panel.tsx` | scripted / mock | graph | mock | — | text | — | none | — | — |
| A7 | Mentor AI chat / "Mentor lens" door | `MentorAIChat.tsx`; Ask prompt → A1 | mock UI; door is real A1 with **no mentor data** | — | — | — | — | — | A1 | — | — |
| A8 | Jarvis narration | `vantary/jarvis/*` | scripted | deck state | mock | — | typographic narration | — | none | — | — |
| A9 | Forecast detail intelligence | `forecast-detail-intelligence.tsx` | scripted / mock (13.5k lines) | forecast | sample | — | panels | — | none | — | — |
| A10 | Generated template surfaces | `response-engine/registry.tsx` | **real** rendering of A1 output | A1 envelope | A1 | — | UI | — | — | — | generic renderer when no template |
| A11 | Catch Me Up (session summary) | decks / legacy QClay 02.4 | **future VISION** (AI appropriate) | session events (F4/F11) | — | — | — | — | — | — | — |
| A12 | Post-trade review phrasing (DL-003: the one v1 call) | not built | **AI appropriate**, bounded | deterministic deviation result (F5) | `decision_reviews` | owner only | one review text | interpretation over SQL-judged facts | A1 pattern | — | — |
| A13 | Deviation / adherence / `lock_lead_seconds` math | not built | **deterministic software should own this** | records + trades | F5 | owner | numbers | fact | none | — | — |
| A14 | Drift detection ("entering unfamiliar markets", `11` §6) | not built | **deterministic first** (thresholds), AI for explanation | F4/F5/F8 | — | owner | flag + text | fact then interpretation | — | — | — |
| A15 | Contextual explanations / General intelligence | `explain-term.tsx` (static) | **AI appropriate** over a curated glossary | term + page context | glossary | public | text | interpretation | none yet | — | — |
| A16 | Community discovery matching (`my-fit-analysis`) | template exists, mock | AI appropriate later | profile + groups | F3/F8 | — | ranked list | interpretation | none | — | — |
| A17 | Assistance-style configuration (quiet ↔ proactive, `11` §5) | not built | **deterministic** (a setting) | — | F8 | owner | — | — | — | — | — |
| A18 | Agents that act (marketplace, workflows) | pitch only | **future VISION**; "agents never place orders" stands | — | — | — | — | — | — | — | — |

### 6.2 Classification totals
- **Existing real AI endpoints:** 2 (A1, A2) + 1 real renderer (A10).
- **Scripted / fake AI:** 6 (A3, A5, A6, A7-UI, A8, A9).
- **AI appropriate (not built):** A11, A12, A15, A16.
- **Deterministic software should own:** A4, A13, A14 (first pass), A17.
- **Future VISION:** A11, A18.
- **Unknown:** cost and latency for A1/A2 (no logging, no eval); A1 failure behaviour.

**Gemini note:** `GEMINI_API_KEY` exists in the project environment; **no code uses it**. Either remove it or record why it is there.

---

## 7. Security flags register (exists and is unsafe as written)

| # | Flag | Path | Severity (v0 judgement) | Fix class |
|---|---|---|---|---|
| S1 | `mentor_notifications` insert route uses **service-role key, no session check, arbitrary `mentorId/userId/entryId` from body** | `app/api/copilot/notify-mentor/route.ts` | **High** (anyone can write into any mentor's inbox; abuse vector) | add auth; derive `from_user_id` from session; validate mentor relationship |
| S2 | `copilot_events` insert `with check (true)` | `scripts/copilot-tables.sql:30` | High if table is live and route ever enabled | `with check (auth.uid() = user_id)` |
| S3 | `copilot_events` select `… OR user_id IS NULL` — anonymous rows readable by all | `scripts/copilot-tables.sql:26` | Medium | drop the `IS NULL` clause; never insert anonymous rows |
| S4 | `mentor_notifications` insert `with check (true)` | `scripts/copilot-tables.sql:39` | Medium | server-only insert via service role **with** an authenticated caller (S1) |
| S5 | LLM routes unauthenticated | `/api/archio`, `/api/command` | Medium (cost) | session check + per-user quota |
| S6 | Polygon/market proxies unauthenticated | `/api/polygon/*`, `/api/market/*` | Low–Medium (cost, ToS) | session check + cache |
| S7 | Middleware protects only non-existent routes | `lib/supabase/middleware.ts` | Low today (all demo), **High the day real data lands** | ~~decide private surfaces~~ **rule decided (DL-023): personalised product behind login; public / marketing / auth / help signed-out.** **Refined (DL-026, 20 Sep second session): the boundary is per action / per data, not a blanket product gate** — signed-out visitors explore public product surfaces (TradingView-like), identity is asked for at the moment of need; never another user's private data. Route + action list = D1 output; middleware change follows founder tick-off, not before |
| S8 | `profiles_select_all USING (true)` | `001_auth_schema.sql:27` | Low–Medium (bios/avatars public by default) | ~~founder decision on public profiles~~ **DL-023: profiles = public layer + user-controlled social layer + always-private account layer.** `USING (true)` on the *whole row* is therefore wrong by definition once any private field lives in `profiles`; fix = separate public fields from private (schema / view) — a future dedicated block, not D1 |
| S9 | Browser-side anon-key insert path exists in code (`persist.ts`) | `lib/copilot/persist.ts` | Low (disabled) | delete or move server-side |
| S10 | 483 TS errors suppressed at build | `next.config` | Not security; **correctness risk** | schedule a burn-down; block new errors |

None of these are refactored by this document.

---

## 8. What the smallest honest version of each Level-1 system needs (backend view)

Not a plan — a dependency reading so founders can see which system is *cheap to make honest* and which is *expensive*.

| System | To stop being demo it needs | Cheapest honest step |
|---|---|---|
| Market Experience | nothing new — F6 exists | swap `generateMockPriceData` for the existing snapshot route; delete `/api/market/stats` calls |
| Ask Archio | auth (S5); personal grounding needs F4/F5 | auth + quota on two routes; relabel `/api/copilot/chat` as scripted |
| Account / Money | UI over F1/F12 that already exist | a real `/profile` reading `profiles`; a settings page |
| Community & Opportunity | tenancy decided — Model B (F3, DL-020); next is the join / room-entry flow shape | founders: "Opportunity" meaning (Q-7); migration approval before any DDL work |
| Flight Deck | F5 + F10 for every number; F8 for layout | a true **empty state** (no data yet) instead of demo |
| Intent Loop | F5 (+F4) | the "bounded loop" (DL-006) — only when founders un-park it |
| Education | a definition, then F14 | none until the product map says what Education is |

---

## 9. Verification method (re-runnable)

All from repo root, 20 Sep 2026:

- Tables: `grep -rhoiE "create table (if not exists )?(public\.)?[a-z_]+" scripts/*.sql`
- Policies: `grep -rniE "create policy|with check \(true\)|using \(true\)" scripts/*.sql`
- Table usage: `grep -rhoE "\.from\(['\"][a-z_]+['\"]\)" app components lib hooks | sort | uniq -c`
- Route callers: for each route, `grep -rlE "['\"\`]/api/<route>" components app lib hooks` excluding `app/api/`
- Auth posture per route: `grep -cE "getUser\(\)|getSession\(\)|401" <route>` and `grep -c SERVICE_ROLE <route>`
- AI calls: `grep -rlnE "from ['\"]ai['\"]|streamText|streamObject|generateText" app lib components`; model ids via `grep -rhoE "model: ?['\"][a-z0-9./:-]+['\"]"`
- Env: `grep -rhoE "process\.env\.[A-Z_]+" app lib components middleware.ts | sort | uniq -c`
- Realtime: `grep -rn "\.channel(\|postgres_changes" app components lib` → none
- Storage: `grep -rn "storage\.from(" app components lib` → none
- Types: `pnpm exec tsc --noEmit -p tsconfig.json | grep -c "error TS"` → 483

**Not verifiable from repo (list for the Architect):** live schema state; which `groups` DDL is applied; whether `006` seed ran; Supabase Auth redirect config; Stripe dashboard products vs `plans` seed; Polygon plan/quota; AI Gateway spend; whether `FINNHUB_KEY`/`ALPHAVANTAGE_KEY` are set in production.

---

## 10. Questions this file makes sharper for QClay / outside engineers / Owen

**For QClay (design):** design the *empty states* and the *privacy/consent* surfaces first — they exist in no blueprint and every honest version of the product needs them. Do not design org/room admin UI (F-8 guard rail).

**For an outside engineering quote — decomposable units, each independently quotable:**
1. Security hardening S1–S9 (small, immediate).
2. Migration discipline + collapse of three `groups` schemas (small).
3. F4 event spine with auth (medium; catalogue is a founder/Architect input).
4. F5 bounded loop: three tables + CSV import + matcher + six aggregates (medium; DL-006 unit).
5. F3 one tenancy model + join/manage UI (medium; after founder decision).
6. F9 notifications as F4 consumer (small–medium).
7. F11 live transport (large; provider choice first).
8. F14 education backend (unknown until defined).
9. TS burn-down 483 → 0 (medium, mechanical).

The $300–350k "make ARCHIO work" figure decomposes into roughly these nine units plus UI wiring; QClay's exclusion of "AI modules" now maps to hardening one existing pattern (F7), not inventing one.

**For Owen / TradeLocker (sharpened):** (a) read-only order/fill history endpoint, auth model, and field list per fill; (b) whether timestamps are exchange or server time (needed for `lock_lead_seconds`, DL-013); (c) rate limits for a polling importer; (d) nothing about execution (DL-004).


---

<!-- FILE: 14-archio-master-cross-reference.md -->

# 14 — ARCHIO Master Cross-Reference

**Date:** 20 September 2026
**Kind:** OPERATIONAL CONTROL DOCUMENT (not governance). `11-founder-direction-2026-09-19.md`, `01-decision-ledger.md` and DL-018 remain authoritative. This file connects `12` (what the user sees) and `13` (what makes it work) so that one feature has **one name, one ID and one trace** across every AI and every person on the project. Where the connection exposes a contradiction, it is **flagged** (§3, §9) — nothing in `00`–`11` is changed by this file.
**Built by:** v0, from `12` and `13` (themselves built from commit `08f58a1`, branch `v0/fxp1casso-52674d7b`), from `01`, `09`, `11` and from `docs/qclay-dashboard-page-inventory-master.md` (the legacy QClay map). Nothing here was invented; where a link could not be established it says `UNKNOWN` or `NEEDS-V0-VERIFICATION`.
**Owners:** Luke + Kan. Only they set `LUKE REVIEW` / `KAN REVIEW` / `FOUNDER DECISION STATUS`.
**Companion files:** `12-product-design-control-center.md` · `13-technical-backend-control-center.md`.

> **The question this file answers:** *Given any ARCHIO feature, by any of its names, where is it on the map, what does it need, how finished is it, who decides next, and what does each AI need to know about it?*

---

## 0. If you are an AI reading this for the first time (AI-to-AI briefing)

Read this section, then §1, then the record you were asked about. Do not read the whole file to answer one question.

**What ARCHIO is.** A trading product being built by two founders, Luke and Kan. Its founder-approved scope (`11` §1, DL-017, DECIDED 19 Sep 2026) is *the connected environment around the trader's entire journey*. Inside it, one important potential intelligence engine is the intent → trade → compare → review → memory loop (`02`, `03`, `10`, `11` §7) — an engine *inside* ARCHIO, not the definition of the company. The old wording "system of record for trading intentions" is superseded. The product name is ARCHIO (DL-007); "Trading Pilot" and every aviation name are dead (`09` §2).

**What phase we are in.** STRUCTURE → FLOWS → DATA/BACKEND → DETAILED PAGE DESIGN (`11` §8, DL-018). The working objective is to begin constructing the **ARCHIO System Bible**. In this phase nobody implements product code, nobody invents features, nobody renames things without evidence. Three Grok bots produce *inputs* to the Bible (Product Brain **maps** · Red Team **challenges** · Architect **grounds** — `09` §4–5); v0 **verifies against the repo and builds**; ChatGPT **drafts and relays** (DL-015, outside the ledger); Luke and Kan **decide** (DL-014).

**What exists.** One Next.js 14 / Supabase / Stripe / Polygon repo. 30 page routes, 37 API route files, ≈56 dialog-like components, one 132k-line dashboard tree. Real: Supabase Auth, a `profiles` table, real Polygon market routes, two LLM endpoints, a complete but UI-less orgs/rooms/billing backend, a `groups` discovery read. Demo: **every number the trader would think is theirs** — no trade, decision, forecast, plan, journal entry, progress or notification is persisted anywhere (`13` §2.10, §3). 483 TypeScript errors are hidden by the build config (`13` S10).

**The seven Level-1 systems (Structural Map v1, founder-given — filed as `15-structural-map-v1.md` on 20 Sep 2026, DL-019; its §2 carries the binding decisions DL-020 tenancy Model B · DL-021 Intent Loop design shape only · DL-022 Education combination):** Flight Deck (`FD`) · Intent Loop / Decision experience (`IL`) · Market Experience (`MX`) · Education (`ED`) · Community & Opportunity (`CO`) · Ask Archio (`AA`) · Account / Money (`AM`). Three Level-4 / VISION interfaces: Trading Passport / verified proof (`TP`) · Social / creator / marketplace (`SM`) · agents / workflows (`AG`). Plus the global shell (`SH`) and founder/marketing surfaces (`MK`) which are inventoried but are not the product. **The Structural Map v1 document is not in the repo** (§9 F-9) — the system list above is the founders' own wording from the 20 Sep request and is the only authority until the map is filed.

**How to talk about any feature.** Use its canonical ID from §1 (`<SYSTEM>-<TYPE>-<NNN>`) and its canonical name from §2. If someone uses another name, look it up in §3.1 (aliases) — do not create a new name. If you cannot find it, say `NOT IN REGISTER` and stop; do not describe it from memory.

**What you may not do.** Contradict a DECIDED ledger entry (`01`) · state a code fact without citing `08`, `12`, `13` or a dated v0 verification · mark anything APPROVED · resolve a naming conflict (§3) · design UI for the orgs/rooms/memberships backend because it exists (`01` rejected ideas; `12` F-8) · describe the loop as the company · paste this file into a bot context pack wholesale (§8).

**Standing facts to hold** (from `README`): Kan has no students and does not trade actively; whether Luke trades is unstated (DL-010). The repo has no trades / decisions / plans table and no broker connection. On the loop's ladder we stand at node 0 (CAPTURE) with no evidence for node 1. Kill criteria are per hypothesis (`02` §5), never one for the whole thesis.

---

## 1. Master ID index

Every control record in `12`, one line each, with the two statuses and the `13` foundations it depends on. `L` = Luke review, `K` = Kan review; both are `NOT REVIEWED` (`NR`) for every line in this first edition because no written approval exists for any surface. Foundations are `13` §4 IDs (F1–F15). Ranges (`001…026`) are one record covering many near-identical items.

### 1.1 `SH` — Global shell

| ID | Canonical name | Route / file | Visual | Functional | F | L | K |
|---|---|---|---|---|---|---|---|
| SH-NAV-001 | Floating left-edge navigation | `(main)` layout | V0 DRAFT | FUNCTIONAL (client) | — | NR | NR |
| SH-NAV-002 | User button | `(main)` layout | V0 DRAFT | FUNCTIONAL | F1 | NR | NR |
| SH-NAV-003 | Providers mounted on every `(main)` page | `app/(main)/layout.tsx` | — | FUNCTIONAL | F1 | NR | NR |
| SH-PAGE-001 | Login | `/login` | V0 DRAFT | FUNCTIONAL | F1 | NR | NR |
| SH-PAGE-002 | Register | `/register` · `components/auth/IdentityCreation.tsx` | V0 DRAFT | FUNCTIONAL | F1 | NR | NR |
| SH-PAGE-003 | Forgot password | `/forgot-password` | V0 DRAFT | FUNCTIONAL | F1 | NR | NR |
| SH-PAGE-004 | Reset password | `/reset-password` | V0 DRAFT | FUNCTIONAL | F1 | NR | NR |
| SH-PAGE-005 | Verify email | `/verify-email` (inline page, 286 lines) | ROUGH | FUNCTIONAL | F1 | NR | NR |
| SH-STATE-001 | Auth callback (×2) | `/auth/callback`, `/api/auth/callback` | — | FUNCTIONAL · duplicate | F1 | NR | NR |
| SH-STATE-002 | Route protection | `lib/supabase/middleware.ts` | — | protects 8 non-existent routes (S7) | F2 | NR | NR |
| SH-STATE-003 | Global loading | `app/loading.tsx`, `app/login/loading.tsx` | ROUGH | effectively absent | — | NR | NR |
| SH-STATE-004 | Global error / not-found | none (0 `error.tsx`, 0 `not-found.tsx`) | NOT DESIGNED | — | — | NR | NR |
| SH-STATE-005 | Toasts | `components/ui/toaster` | V0 DRAFT | FUNCTIONAL | — | NR | NR |

### 1.2 `FD` — Flight Deck

| ID | Canonical name | Route / file | Visual | Functional | F | L | K |
|---|---|---|---|---|---|---|---|
| FD-PAGE-001 | Flight Deck / Your Space | `/dashboard` · `vantary/your-space.tsx` (33,482 lines) | V0 DRAFT | MOCK DATA | F5 F8 F10 | NR | NR |
| FD-NAV-001 | Room Navigator (4 rooms × 4 doors) | `FLIGHT_DECK_ROOMS` | V0 DRAFT | FUNCTIONAL (nav) | — | NR | NR |
| FD-NAV-002 | Focus-rail dropdown | `vantary/focus-rail-dropdown.tsx` | V0 DRAFT | UI ONLY | — | NR | NR |
| FD-NAV-003 | Theme switcher (7 themes) | `vantary/theme-switcher.tsx` | V0 DRAFT | FUNCTIONAL (client) | F8 | NR | NR |
| FD-PANEL-001 | Flight Deck Hub (control room) | `cartouche/flight-deck-hub.tsx` | V0 DRAFT | UI ONLY | — | NR | NR |
| FD-PANEL-002 | Gadget inspector | `cartouche/gadget-inspector.tsx` | V0 DRAFT | UI ONLY | — | NR | NR |
| FD-PANEL-003 | Side detail rail | `vantary/side-detail-rail.tsx` | V0 DRAFT | MOCK DATA | F5 | NR | NR |
| FD-MODAL-001 | Template picker | `cartouche/template-picker.tsx` | V0 DRAFT | UI ONLY | F8 | NR | NR |
| FD-SEARCH-001 | Command palette | `vantary/command-palette.tsx` | V0 DRAFT | FUNCTIONAL (client) | — | NR | NR |
| FD-WIDGET-001…026 | Living gadgets v1 | `cartouche/living-gadgets.tsx` | V0 DRAFT | MOCK DATA | F5 F6 F10 | NR | NR |
| FD-WIDGET-027…039 | Living gadgets v2 | `cartouche/living-gadgets-v2.tsx` | V0 DRAFT | MOCK DATA | F5 F6 F10 | NR | NR |
| FD-WIDGET-040…051 | Legacy dashboard modules (12) | `components/dashboard/modules/` | ROUGH | MOCK DATA | F5 F9 | NR | NR |
| FD-SECTION-001 | Active Window | `vantary/active-window/` | V0 DRAFT | MOCK DATA | F5 F6 | NR | NR |
| FD-SECTION-002 | Trading Desk | `vantary/trading-desk/` (40 files) | V0 DRAFT | PARTIAL (TradingView real) | F6 F10 | NR | NR |
| FD-SECTION-003 | Strategy OS | `vantary/strategy-os/` | V0 DRAFT | MOCK DATA | F5 F8 | NR | NR |
| FD-SECTION-004 | Jarvis surfaces | `vantary/jarvis/` | V0 DRAFT | MOCK DATA | F7 F8 | NR | NR |
| FD-SECTION-005 | Response-engine registry | `vantary/response-engine/registry.tsx` | V0 DRAFT | FUNCTIONAL | F7 | NR | NR |
| FD-SECTION-006 | Command Desk | `components/dashboard/command-desk/` | ROUGH | MOCK DATA | — | NR | NR |
| FD-TPL-001…010 | Flight Deck templates (10 files, 19 `warming()` stubs) | `vantary/flight-deck/templates/` | V0 DRAFT | MOCK DATA (community-hub fetches real) | F3 F8 | NR | NR |
| FD-STATE-001 | Session debrief overlay | `vantary/session-debrief.tsx` | V0 DRAFT | MOCK DATA | F5 | NR | NR |
| FD-STATE-002 | First-run / onboarding | none | NOT DESIGNED | — | F8 | NR | NR |
| FD-STATE-003 | Empty state (zero trades) | none — **most important missing state** | NOT DESIGNED | — | F5 | NR | NR |
| FD-STATE-004 | Error state | `deck-stage-error-boundary.tsx` only | NOT DESIGNED (elsewhere) | — | — | NR | NR |
| FD-STATE-005 | Responsive / mobile | `hooks/use-mobile.tsx` | UNKNOWN | UNKNOWN | — | NR | NR |

### 1.3 `IL` — Intent Loop / Decision experience

| ID | Canonical name | Route / file | Visual | Functional | F | L | K |
|---|---|---|---|---|---|---|---|
| IL-PAGE-001 | Forecast Hub | `/forecast` · `components/forecast-hub/` (24,417 lines) | V0 DRAFT | MOCK DATA | F5 F4 | NR | NR |
| IL-DRAWER-001 | Forecast submit drawer | forecast-hub | V0 DRAFT | UI ONLY (discards) | F5 | NR | NR |
| IL-DRAWER-002 | Forecast detail drawer | forecast-hub | V0 DRAFT | MOCK DATA | F5 | NR | NR |
| IL-PANEL-001 | Forecast detail intelligence (13.5k lines) | forecast-hub | V0 DRAFT | MOCK DATA | F5 F7 | NR | NR |
| IL-TAB-001…004 | Feed / My Record / Leaderboard / Archive | forecast-hub | V0 DRAFT | MOCK DATA | F5 | NR | NR |
| IL-MODAL-001 | Legacy forecast modals (10 loose components) | `components/*forecast*` | ROUGH | MOCK DATA · likely SUPERSEDED | F5 | NR | NR |
| IL-PAGE-002 | Execution Copilot | `/copilot` · `components/execution-copilot/` | V0 DRAFT | MOCK DATA | F5 F6 F10 | NR | NR |
| IL-PANEL-002 | Copilot "buddy" system (52 files) | `components/copilot/` | V0 DRAFT | MOCK DATA | F5 F4 | NR | NR |
| IL-DRAWER-003 | Copilot drawer | `CopilotDrawer.tsx` | V0 DRAFT | MOCK DATA | F5 | NR | NR |
| IL-TAB-005…013 | Copilot tabs (9) | copilot rail | V0 DRAFT | MOCK DATA | F5 | NR | NR |
| IL-MODAL-002 | Tutorial overlays (4) | copilot | V0 DRAFT | UI ONLY | F14 | NR | NR |
| IL-FLOW-001 | Copilot onboarding | `copilot/onboarding/` | V0 DRAFT | UI ONLY | F8 | NR | NR |
| IL-SECTION-001 | Live Room ledger | `live-room/session-store.tsx`, `session-state.ts` | — | client state (F4 shape) | F4 F11 | NR | NR |
| IL-SECTION-002 | Scenario system | `*scenario*`, `lib/scenario-store.ts` | ROUGH | MOCK DATA | F5 | NR | NR |
| IL-STATE-001 | Empty / first-decision state | none | NOT DESIGNED | — | F5 | NR | NR |
| IL-STATE-002 | Review after outcome | FD debrief + Post-Mortem door only | NOT DESIGNED (real) | — | F5 F7 | NR | NR |

### 1.4 `MX` — Market Experience

| ID | Canonical name | Route / file | Visual | Functional | F | L | K |
|---|---|---|---|---|---|---|---|
| MX-PAGE-001 | Signal Terminal | `/` · `live-market-intelligence.tsx` | V0 DRAFT | MOCK DATA (`generateMockPriceData`) | F6 | NR | NR |
| MX-PAGE-002 | Macro Economic | `/intelligence` · `mrkt-intelligence-dashboard.tsx` | V0 DRAFT | PARTIAL | F6 | NR | NR |
| MX-PAGE-003 | Nexus | `/nexus` · `components/nexus/` | V0 DRAFT | MOCK DATA | F6 F7 | NR | NR |
| MX-SECTION-001 | Confluence system | `*confluence*`, `ultra-confluence/`, `lib/confluences.ts` | V0 DRAFT | PARTIAL | F6 | NR | NR |
| MX-SECTION-002 | Multi-timeframe (MTF) | `components/mtf/`, `lib/multi-timeframe-analysis.ts` | V0 DRAFT | PARTIAL | F6 | NR | NR |
| MX-SECTION-003 | Session / liquidity / range analysis | `session-analysis-display.tsx` (58 TS errors, dead `/api/market/stats`) | ROUGH | MOCK DATA + dead call | F6 | NR | NR |
| MX-SECTION-004 | Charts (TradingView embed + overlays) | `trading-view-widget.tsx`, `components/charts/` | V0 DRAFT | PARTIAL | F6 F10 | NR | NR |
| MX-SECTION-005 | Oracle | `components/oracle/`, `vantary/oracle-command-console.tsx` | V0 DRAFT | MOCK DATA | F6 F7 | NR | NR |
| MX-SECTION-006 | Analysis history & boxes | `analysis-*`, `lib/stores/useAnalysis.ts` | ROUGH | PARTIAL | F6 F15 | NR | NR |
| MX-STATE-001 | Market-closed / weekend state | — | UNKNOWN | UNKNOWN | F6 | NR | NR |
| MX-STATE-002 | Data-unavailable state | — | UNKNOWN | masked by mocks | F6 | NR | NR |

### 1.5 `ED` — Education

| ID | Canonical name | Route / file | Visual | Functional | F | L | K |
|---|---|---|---|---|---|---|---|
| ED-PAGE-001 | The Cockpit (guided narrative) | `/cockpit` · `components/cockpit/` | V0 DRAFT | UI ONLY | F14 | NR | NR |
| ED-PAGE-002 | Student Collaboration Hub | `/hub` (only login-gated page) | ROUGH | MOCK DATA | F14 F3 | NR | NR |
| ED-SECTION-001 | Mentor method components (10) | `components/mentor/` | ROUGH | MOCK DATA | F14 | NR | NR |
| ED-SECTION-002 | Coach & tutorials | `copilot/coach/`, `lib/stores/coach.ts` | ROUGH | MOCK DATA | F14 | NR | NR |
| ED-MODAL-001 | Guide / education modals | `ProfessionalGuideModal`, `EducationPopup`, `ShortcutsOverlay` | V0 DRAFT | UI ONLY | F14 | NR | NR |
| ED-SECTION-003 | Glossary / explain-term | `live-room/glossary.ts`, `explain-term.tsx` | V0 DRAFT | FUNCTIONAL (static) | F14 F7 | NR | NR |
| ED-STATE-001 | Progress / completion | none | NOT DESIGNED | — | F14 | NR | NR |
| ED-STATE-002 | Curriculum browser / course / enrollment | none | NOT DESIGNED | — | F14 F13 | NR | NR |

### 1.6 `CO` — Community & Opportunity

| ID | Canonical name | Route / file | Visual | Functional | F | L | K |
|---|---|---|---|---|---|---|---|
| CO-PAGE-001 | Community Discovery | `/communities` · `communities/DiscoveryEngine.tsx` | V0 DRAFT | PARTIAL (real `groups` + mock fallback) | F3 F15 | NR | NR |
| CO-PANEL-001 | Floating Community Hub (13 views) | `community-panel/floating-community-hub.tsx` (15,862 lines) | V0 DRAFT | MOCK DATA | F3 F11 | NR | NR |
| CO-PAGE-002 | Live Call History | `/history` | V0 DRAFT | MOCK DATA | F11 F13 | NR | NR |
| CO-PAGE-003 | Live Room | `/live-room` + hub `live-stage` · `components/live-room/` (23 files) | V0 DRAFT | MOCK DATA (scripted ledger) | F11 F4 | NR | NR |
| CO-DRAWER-001 | Inspector drawer (narrow) | live-room | V0 DRAFT | FUNCTIONAL (client) | — | NR | NR |
| CO-DRAWER-002 | Transport drawer (replay/pulse) | live-room | V0 DRAFT | MOCK DATA | F11 | NR | NR |
| CO-DRAWER-003 | Proof / Weakness drawers | `ProofDrawer`, `WeaknessDrawer` | V0 DRAFT | MOCK DATA | F5 | NR | NR |
| CO-PANEL-002 | Leaderboards (×3) | community-panel, forecast-hub, `premium-leaderboard.tsx` | V0 DRAFT | MOCK DATA · duplication | F5 | NR | NR |
| CO-PANEL-003 | Notification center | `community-panel/notification-center.tsx` | V0 DRAFT | MOCK DATA | F9 | NR | NR |
| CO-PANEL-004 | Member profile hover/card | `member-profile.tsx`, `profile/ProfileHoverCard.tsx` | V0 DRAFT | MOCK DATA | F1 F2 | NR | NR |
| CO-TPL-001…007 | Community templates in Flight Deck | see FD-TPL | V0 DRAFT | MOCK (1 real) | F3 | NR | NR |
| CO-STATE-001 | Join / request / invite flow | backend exists, no UI | NOT DESIGNED | BACKEND-READY | F3 F2 | NR | NR |
| CO-STATE-002 | Create a community / mentor studio | `groups_insert_own` policy, no UI | NOT DESIGNED | BACKEND-READY | F3 | NR | NR |
| CO-STATE-003 | Community detail / preview page | `CommunityInspector` panel only | NOT DESIGNED (page) | — | F3 | NR | NR |

### 1.7 `AA` — Ask Archio

| ID | Canonical name | Route / file | Visual | Functional | F | L | K |
|---|---|---|---|---|---|---|---|
| AA-AI-001 | Command layer (command bar) | `components/command/`, `lib/command/` → `POST /api/command` (gpt-5-mini) | V0 DRAFT | FUNCTIONAL (unauth, ungrounded) | F7 | NR | NR |
| AA-AI-002 | Grounded response engine | `POST /api/archio` (gpt-4.1-mini + Polygon), `lib/response-engine/`, `ask-answer-surface.tsx` | V0 DRAFT | FUNCTIONAL (General only; demo journal) | F7 F6 | NR | NR |
| AA-TPL-001 | Generated-template surfaces | `response-engine/registry.tsx` | V0 DRAFT | FUNCTIONAL | F7 | NR | NR |
| AA-AI-003 | Copilot chat (scripted) | `copilot/chat/CopilotChatPanel.tsx` → `/api/copilot/chat` (keyword matcher) | V0 DRAFT | MOCK (scripted) | — | NR | NR |
| AA-AI-004 | Oracle command console | `vantary/oracle-command-console.tsx` | V0 DRAFT | MOCK DATA | F7 | NR | NR |
| AA-AI-005 | Nexus AI synthesis panel | `nexus/nexus-ai-synthesis-panel.tsx` | V0 DRAFT | MOCK DATA | F7 | NR | NR |
| AA-AI-006 | Mentor AI chat | `mentor/MentorAIChat.tsx` | ROUGH | MOCK DATA | F7 | NR | NR |
| AA-AI-007 | Loose AI shells (8) | `ai-*.tsx`, `AIInsightPopup` | ROUGH | MOCK DATA | F7 | NR | NR |
| AA-AI-008 | Jarvis narration | see FD-SECTION-004 | V0 DRAFT | MOCK DATA | F7 F8 | NR | NR |
| AA-STATE-001 | Streaming / thinking state | `ask-answer-surface` | V0 DRAFT | FUNCTIONAL | F7 | NR | NR |
| AA-STATE-002 | AI error / refusal / rate-limit | — | UNKNOWN | no per-user limits (S5) | F7 F2 | NR | NR |
| AA-STATE-003 | Assistance style controls (quiet ↔ proactive) | none (`11` §5) | NOT DESIGNED | — | F8 | NR | NR |
| AA-STATE-004 | Consent / "what ARCHIO knows about you" | none (`11` §2) | NOT DESIGNED | — | F2 F8 | NR | NR |

### 1.8 `AM` — Account / Money

| ID | Canonical name | Route / file | Visual | Functional | F | L | K |
|---|---|---|---|---|---|---|---|
| AM-PAGE-001 | Profile | `/profile` · `components/profile/` (10) | V0 DRAFT | MOCK DATA (demo-mentor toggle) | F1 F2 | NR | NR |
| AM-SECTION-001 | Accounts module | `dashboard/modules/accounts.tsx`, `useAccounts.ts` | ROUGH | MOCK DATA | F10 F5 | NR | NR |
| AM-STATE-001 | Settings | none (`/settings` protected but absent) | NOT DESIGNED | — | F1 F8 | NR | NR |
| AM-STATE-002 | Billing / plans / upgrade | backend complete (`plans`, `subscriptions`, 4 routes, webhook), 0 UI | NOT DESIGNED | BACKEND-READY | F12 | NR | NR |
| AM-STATE-003 | Organisation / room administration | backend complete (`orgs`, `rooms`, `memberships`, `invites`), 0 UI — **do not design** (`12` F-8) | NOT DESIGNED | BACKEND-READY | F3 | NR | NR |
| AM-STATE-004 | Connected accounts / broker | `ProfileConnections`, `execution-console` | V0 DRAFT | INTEGRATION BLOCKED | F10 | NR | NR |
| AM-STATE-005 | Data & privacy controls | none (`11` §2) | NOT DESIGNED | — | F2 | NR | NR |
| AM-STATE-006 | Delete account / export | none | NOT DESIGNED | — | F1 F2 | NR | NR |

### 1.9 `TP` · `SM` · `AG` — Level-4 / VISION

| ID | Canonical name | What exists | Visual | Functional | F | L | K |
|---|---|---|---|---|---|---|---|
| TP-SECTION-001 | Trading Passport / verified proof | "My Record" tab (IL-TAB-001…004 "My Record"), Proof drawer (CO-DRAWER-003), pitch slides | V0 DRAFT fragments | VISION ONLY | F5 F2 | NR | NR |
| SM-SECTION-001 | Social / creator / marketplace | Room Navigator door copy, pitch Act IV, legacy System 05 | NOT DESIGNED | VISION ONLY | F3 F12 F13 | NR | NR |
| AG-SECTION-001 | Agents / workflows | pitch "clone agents", legacy 05.5 | NOT DESIGNED | VISION ONLY | F4 F7 F8 | NR | NR |

### 1.10 `MK` — Founder, marketing, internal (not the product)

| ID | Route | Purpose | Note |
|---|---|---|---|
| MK-PAGE-001 | `/welcome` | landing (variant 1) | `12` F-12: two landings + QClay's |
| MK-PAGE-002 | `/archio` | landing (variant 2) | idem |
| MK-PAGE-003 | `/pitch` | 35-slide founder deck | narrative canon, not UI canon |
| MK-PAGE-004 | `/newpitch` | deck variant | UNKNOWN which is current |
| MK-PAGE-005 | `/owen`, `/owen/guide`, `/owen/presenter` | TradeLocker meeting decks | Owen ask = read-only only (DL-004) |
| MK-PAGE-006 | `/masterplan` | internal plan page | — |
| MK-PAGE-007 | `/design` | design-system page | reference for §3 design tokens |
| MK-PAGE-008 | `/backend-map` | internal backend map | must not be mistaken for `13` |
| MK-PAGE-009 | `/playground/glass-demo`, `/playground/glass-popup` | experiments | — |
| MK-PAGE-010 | `/docs/ultra-breakdown` | confluence explainer | closest thing to product docs |

**Flows** (`12` §9.2): `FLOW-001…012` are indexed there; §4 of this file traces them. **Design register** items are `12` §8.x. **Security flags** are `13` §7 S1–S10. **Audit flags** are `12` §12 F-1…F-15. **Foundations** are `13` §4 F1–F15. Decision-ledger entries are `01` DL-001…DL-018.

---

## 2. Master feature / system matrix

One record per system (the seven Level-1 systems, the shell, the three VISION interfaces, the MK surfaces). Every record has the same 24 fields in the same order. Field definitions are in Appendix A. `OWNER: PROPOSED` means v0's placement is arguable and a founder must confirm.

### 2.1 SH — Global shell

- **CANONICAL NAME:** Global shell
- **ALIASES / LEGACY NAMES:** "the app shell", "Global application shell" (QClay legacy §4), "(main) layout", "floating nav", "the rail"
- **STRUCTURAL MAP LEVEL:** outside the map — a prerequisite every Level-1 system inherits
- **OWNER SYSTEM:** none (shared). Auth pages are here because identity is a foundation, not a product system.
- **USER-FACING SURFACES:** SH-NAV-001/002/003 · SH-PAGE-001…005 · SH-STATE-001…005
- **IMPORTANT SUBFEATURES:** left-edge navigation · user button · five auth screens · route protection · loading / error / not-found · toasts
- **ROUTES / COMPONENTS:** `app/(main)/layout.tsx`, `app/layout.tsx`, `components/auth/*`, `/login /register /forgot-password /reset-password /verify-email /auth/callback`, `lib/supabase/middleware.ts`
- **ASSOCIATED DATA:** `auth.users` (Supabase), `profiles` (`001_auth_schema.sql`)
- **TECHNICAL FOUNDATIONS:** F1 Identity (REAL) · F2 Permissions (PARTIAL + flag)
- **AI DEPENDENCY:** none
- **INTEGRATION DEPENDENCY:** Supabase Auth (real). Email = Supabase's own auth mail only (`13` §3.5)
- **PRIVACY / PERMISSION SENSITIVITY:** **High** — `profiles_select_all USING (true)` makes bios/avatars public by default (S8); middleware gates only non-existent routes (S7)
- **CURRENT DESIGN STATUS:** V0 DRAFT (auth kit) · ROUGH (`/verify-email`) · NOT DESIGNED (error/not-found/first-run)
- **CURRENT FUNCTIONAL STATUS:** FUNCTIONAL (auth) · absent (states)
- **CURRENT BACKEND STATUS:** REAL (F1) · duplicate callback (`/auth/callback` + `/api/auth/callback`) · 8 `/api/auth/*` routes with zero UI callers
- **FOUNDER DECISION STATUS:** **DL-023 DECIDED (20 Sep 2026) — social-style configurable privacy model.** Public / marketing / auth / help surfaces may be signed-out; the personalised product requires login; a profile may have a shareable social-facing layer the user controls; connections never auto-expose private account / intelligence data; public-profile · connection-shared · private-account information are three separate tiers. **D1 scope = the public-vs-authenticated boundary only**; the social permission matrix is a future dedicated block. *Previously:* ~~none recorded~~ **Second session, 20 Sep 2026: DL-026 DECIDED (philosophy) — product-first exploration:** a signed-out visitor explores the real product environment (TradingView-like), never a login wall; identity is asked for at the moment of need (identity · persistence · personalisation · private data · community participation · personal AI context · account info · saved settings · deeper use); never another user's private data. **OPEN:** exact signed-out limits (route + action list = D1 output). **DL-027 DECIDED (direction):** login *and* registration land in the Dashboard / Flight Deck workspace (routes unchanged). **DL-029:** face scan = DEMO/SIMULATION · real secure auth (device biometrics / passkeys · email · codes · phone) = FOUNDER DIRECTION · KYC / account integrity = OPEN · five concepts separate. **DL-023 addendum:** Instagram-familiar configurable visibility recorded (public / connections / deliberately shared / never-shared private), matrix still a later block.
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** legacy §4 "Global application shell" (4.1 persistent zones · 4.2 three presentation modes · 4.3 persistent Archio AI · 4.4 required global states). QClay's landing work is blocked on the dashboard shell existing.
- **GROK BOT RESPONSIBLE (planning):** Architect (which surfaces are private, F2 reframe) · Red Team (is a public profile a leak?)
- **SOURCE-OF-TRUTH REFERENCES:** `12` §4 · `13` §2.4, §4 F1–F2, §7 S7–S8 · `08` auth section
- **SCREENSHOTS / REFERENCE LINKS:** `docs/screens/SH/` — none yet
- **BLOCKERS:** none technical. ~~Decision-blocked on "which surfaces are private" (S7).~~ Boundary decided (DL-023); the concrete route list is a **D1 output** for founder review, not a further decision.
- **NEXT REQUIRED DECISION:** ~~*Which pages require login?* (fill in: `/dashboard` [ ] `/forecast` [ ] `/copilot` [ ] `/communities` [ ] `/profile` [ ] `/` [ ]) and *are profiles public by default?* [ ] yes [ ] no~~ **DECIDED 20 Sep 2026 (DL-023):** rule = personalised product behind login, public / marketing / auth / help signed-out; profiles have a public layer + user-controlled social layer + always-private account / intelligence layer. Next: D1 proposes the route-by-route list under that rule; founders tick it. **Refined by DL-026 (20 Sep, second session):** the list is a route **+ action** list — which public product surfaces are explorable signed-out and which actions trigger the login / register ask (Q-23). Also open: the fate of the face-scan UI (Q-27); KYC / account-integrity requirement (Q-25).

### 2.2 FD — Flight Deck

- **CANONICAL NAME:** Flight Deck — *as the `15` L1-1 document handle.* **The user-visible name is OPEN (DL-030, 20 Sep 2026):** the founders use **Dashboard · Flight Deck · Command Center** as related, unresolved terms; do not force one. **"Your Space" and "Trading Terminal" are not authoritative** product names (code / title identifiers only) unless the founders revive them.
- **ALIASES / LEGACY NAMES:** "Your Space" (`your-space.tsx` — **not authoritative**, DL-030), "the dashboard" (`/dashboard`), "Command Center" (tab title — a live founder term), "Trading Terminal" (site `<title>` — **not authoritative**, DL-030), "the cockpit surface" (`09` §2 — **not** `/cockpit`, which is Education), "Vantary" (component tree name), legacy QClay SYSTEM 01 (01.1 Workspace/Home · 01.2 Morning Brief · 01.3 Workspace Customizer · 01.4 Account & Execution Center · 01.5 Notifications & Interventions · 01.6 Archio AI Expanded Workspace), "Home Base" (dead), "Trader OS" (dead)
- **STRUCTURAL MAP LEVEL:** Level 1
- **OWNER SYSTEM:** Flight Deck
- **USER-FACING SURFACES:** FD-PAGE-001 · FD-NAV-001…003 · FD-PANEL-001…003 · FD-MODAL-001 · FD-SEARCH-001 · FD-WIDGET-001…051 · FD-SECTION-001…006 · FD-TPL-001…010 · FD-STATE-001…005
- **IMPORTANT SUBFEATURES:** Room Navigator (4 rooms × 4 doors = 16 doors: 9 href · 2 template · 4 Ask · 1 event) · living gadgets (≈26 v1 + 13 v2) · Active Window / day playbook · Trading Desk (chart + execution console) · Strategy OS (dna · exposure · rules · mirror · sync · intel) · Jarvis narration · 7 visual themes · command palette · templates · session debrief
- **ROUTES / COMPONENTS:** `/dashboard` → `components/dashboard/vantary/` (148 files) + `components/dashboard/modules/` (12) + `command-desk/` (3); `components/dashboard/` total 132,260 lines / 167 files
- **ASSOCIATED DATA:** **none of its own.** Every number is demo telemetry (`13` §2.10). Would need: trades / decisions (F5), broker fills (F10), layout & preferences (F8), notifications (F9)
- **TECHNICAL FOUNDATIONS:** F5 (MISSING) · F6 (REAL — used by trading desk) · F8 (MISSING) · F10 (MISSING) · F9 (MISSING)
- **AI DEPENDENCY:** Ask doors → AA-AI-002 (real) · Jarvis copy (mock) · generated templates via F7
- **INTEGRATION DEPENDENCY:** TradingView embed (real, no data back) · broker (none — DL-004 read-only in v2)
- **PRIVACY / PERMISSION SENSITIVITY:** **Highest once real** — it is the trader's whole record on one screen. Today none (all demo).
- **CURRENT DESIGN STATUS:** V0 DRAFT (most developed visual surface in the product) · NOT DESIGNED: first-run, empty, error, mobile
- **CURRENT FUNCTIONAL STATUS:** MOCK DATA end to end; navigation, themes, palette are FUNCTIONAL client state
- **CURRENT BACKEND STATUS:** MISSING for everything it displays
- **FOUNDER DECISION STATUS:** **DL-024 DECIDED (20 Sep 2026) — zero-data first open = GUIDED EMPTY STATE** (real Flight Deck, no fake personal numbers, useful and alive, guides first actions, exploration without mandatory onboarding, optional gradual configuration, explains what areas become with real information; a lightweight guide may support it — the onboarding system is not invented in D1). **DL-025 DECIDED — keep the four-category command-centre model for now:** the four areas are a **user navigation / command-centre abstraction**, not the seven systems; names MARKET FLOOR · STUDIO · MENTOR HALL · COLLECTIVE kept **provisionally**, D1 inspects name-fit; working term **zones** (not "rooms"); `/cockpit` collision recorded for a later rename (name open). Still open: theme count (`12` §8.14, Q-4). *Previously:* ~~none recorded. Open: theme count, room names (§3.1 N-7), what a zero-data trader sees (FD-STATE-003)~~ **Second session, 20 Sep 2026:** **DL-025 addendum — zone model DECIDED (kept, provisional); zone NAMES + placement of the 16 destinations OPEN for Product Brain review; do not rename / move yet; not rooms.** **DL-024 addendum — guided empty state reconfirmed; a short optional post-sign-in tutorial = FOUNDER DIRECTION; full tutorial design = OPEN / later block.** **DL-027 DECIDED (direction) — this workspace is the single destination after login and registration (routes unchanged).** **DL-030 — highly customisable trader workspace (chart · gadgets · controls beside / below the chart · themes · layout · quick settings · mentor-resold configurations = FUTURE/VISION) = FOUNDER DIRECTION; the name Dashboard / Flight Deck / Command Center = OPEN.** **DL-028 — Ask Archio guides exploration conversationally = FOUNDER DIRECTION.** **DL-026 — public product surfaces explorable signed-out; limits OPEN.** **22 Sep 2026 — DL-031 PROVISIONAL D1 DESIGN DIRECTION (Luke approves; Kan's asynchronous review pending — NOT joint approval; names reversible):** the four zones survive the Product Brain / Red Team reconciliation as **MARKET FLOOR** ("see what is happening in markets right now": Intelligence · Daily Brief · Live Calls, history = later sub-mode) · **TRADING DESK** (reversible; "work on my trading": **ONE** Forecasts entry · Copilot · Post-Mortem) · **THE ACADEMY** (reversible; "learn how to trade better": Education + honest Compare / Mentor AI shells; discipline is cross-cutting) · **THE COLLECTIVE** ("find people and participate": Communities · The Floor · Collab Hub; Marketplace = FUTURE home, not a door). Ask Archio, Nexus (absorption candidate, code kept), profile / account chrome and Flight Deck customisation are **global chrome, not zone doors**. Centralized / Decentralized multi-environment contexts = FUTURE/VISION, UX OPEN, not in D1 chrome. **D1 Block 2 opened the same day as design-definition** (`docs/lego/D1-block-2-first-use.md`): the signed-out product-first experience + the guided zero-data first Flight Deck experience, across three user states.
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** **Highest.** Legacy 01.1–01.6 map onto FD-PAGE-001, Active Window (≈01.2 Morning Brief), FD-MODAL-001/FD-PANEL-002 (≈01.3 Customizer), FD-SECTION-002 + AM-SECTION-001 (≈01.4), FD-WIDGET notifications (≈01.5), AA-AI-002 (≈01.6). QClay said the landing page cannot finish until these interfaces exist.
- **GROK BOT RESPONSIBLE (planning):** Product Brain (what problem the Flight Deck solves on day 1 with zero data) · Red Team (is a 33k-line demo a liability?) · Architect (F5/F8/F10 boundary)
- **SOURCE-OF-TRUTH REFERENCES:** `12` §5.1, §8.14 · `13` §2.10, §8 · `11` §4 (Prepare) · `01` rejected "TradingView as centre" (F-7)
- **SCREENSHOTS / REFERENCE LINKS:** `docs/screens/FD/` — none yet; `/pitch` Act III slides are narrative references only
- **BLOCKERS:** F5 + F10 for any real number; F8 for remembering layout; ~~founder decision on empty state~~ → decided (DL-024); the empty state is now a D1 design deliverable
- **NEXT REQUIRED DECISION:** ~~*What does a trader with zero trades see on first open?* [ ] guided empty state [ ] demo mode clearly labelled DEMO [ ] onboarding flow first~~ **DECIDED 20 Sep 2026 — GUIDED EMPTY STATE (DL-024).** Still open: *how many themes ship?* [ ] 1 [ ] 2 [ ] 7 (Q-4). After D1's inspection: *does each zone name fit what lives beneath it?* keep / rename-for-fit per zone (DL-025 follow-up) → **now routed to the Product Brain (Q-24): evaluate the four-zone organisation and the placement of all 16 destinations; founders decide after the Red Team challenge.** Also open: the visible name of this workspace (Q-26, DL-030); the tutorial design (later block, DL-024 addendum). **22 Sep 2026: Q-24 now has a PROVISIONAL answer (DL-031, Luke); Kan's asynchronous review = Q-28; N-21 (the zone "Trading Desk" vs the chart + execution surface "Trading Desk") must be resolved before any label reaches the UI. The decisions Block 2 needs before code are listed in `docs/lego/D1-block-2-first-use.md` §7.**

### 2.3 IL — Intent Loop / Decision experience

- **CANONICAL NAME:** Intent Loop / Decision experience
- **ALIASES / LEGACY NAMES:** "the loop", "the loop engine" (`11` §7), "Decision Desk" (legacy QClay SYSTEM 03, `09` nine systems), "Forecast Hub" (code), "Execution Copilot" (code), "Copilot" / "buddy", "Scenario", "trade plan", "Pre-Trade Contract" (legacy 03.5), "Decision Builder" (03.4), "Auto-Journal" (03.7), "Autopsy Replay" (03.9), "Trade Review" (ritual)
- **STRUCTURAL MAP LEVEL:** Level 1 (the *experience*); its data engine is the ladder nodes 0–4 (`10`)
- **OWNER SYSTEM:** Intent Loop / Decision experience — **OWNER: PROPOSED** for Forecast Hub (could be MX or TP), Scenario system (could be MX), Live Room ledger (could be CO)
- **USER-FACING SURFACES:** IL-PAGE-001/002 · IL-DRAWER-001…003 · IL-PANEL-001/002 · IL-TAB-001…013 · IL-MODAL-001/002 · IL-FLOW-001 · IL-SECTION-001/002 · IL-STATE-001/002
- **IMPORTANT SUBFEATURES:** forecast submit / detail / feed / record / leaderboard / archive · copilot 9 tabs (AI Copilot · Edge Tracker · Entry · Live Feed · Mentor Dashboard · Psychology · SL · Strategy OS · TP) · copilot onboarding · scenario create/edit · Live Room ledger (`SessionEvent`) · session debrief
- **ROUTES / COMPONENTS:** `/forecast` (`components/forecast-hub/`, 24,417 lines) · `/copilot` (`components/execution-copilot/` 35 files + `components/copilot/` 52 files / 38,053 lines) · 10 loose legacy forecast components · `lib/scenario-store.ts`
- **ASSOCIATED DATA:** **none persisted.** `forecast_groups` is an orphan join to a `forecasts` table that was never created (`13` §3.3); `copilot_events` is dead (`13` §3.2). Ledger objects that *should* exist: Decision Record (`decision_records`), `trades`, `decision_reviews` (Architect parked spec, `09` §4.3), `lock_lead_seconds` (DL-013), per-field provenance (DL-011)
- **TECHNICAL FOUNDATIONS:** F5 (MISSING) · F4 (MISSING, dead shape) · F10 (MISSING, CSV first) · F7 (REAL pattern, for the one Review call — DL-003)
- **AI DEPENDENCY:** by ledger exactly one call in v1: the Review (DL-003). Today: Post-Mortem door over a demo journal (AA-AI-002); copilot chat is scripted (AA-AI-003)
- **INTEGRATION DEPENDENCY:** broker fills for COMPARE — CSV import first, TradeLocker read-only later (DL-004)
- **PRIVACY / PERMISSION SENSITIVITY:** **Highest** — intentions before outcome are the most sensitive trader data; `11` §2 requires permission
- **CURRENT DESIGN STATUS:** V0 DRAFT (rich UI for the *shape* of a decision) · ROUGH (legacy modals) · NOT DESIGNED: first-decision empty state, real review, one-tap capture (DL-012)
- **CURRENT FUNCTIONAL STATUS:** MOCK DATA / UI ONLY — submit discards, plan does not save
- **CURRENT BACKEND STATUS:** MISSING. The bounded loop (DL-006) implementation stays **parked by decision** — **DL-021 (20 Sep 2026): this phase is DESIGN SHAPE ONLY**; `09` §4 loop tasks remain parked
- **FOUNDER DECISION STATUS:** DL-001, DL-003, DL-011, DL-012, DL-013 DECIDED for the *engine*; **DL-021 DECIDED for the phase — design the fit / UX / shape / flows and learn the data model, implement nothing**; the *experience* (which of Forecast Hub / Copilot / Scenario is the capture surface) is still undecided (Q-11). Contradiction `12` F-6 (long forms vs one tap).
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** legacy SYSTEM 03 (03.1–03.9) is the closest map; **name conflict** Decision Desk ↔ Intent Loop (§3.1 N-1). Nothing here is ready for QClay: function is not approved.
- **GROK BOT RESPONSIBLE (planning):** Product Brain (parked: capture hypothesis) · Red Team (parked: "order is the intention"; weeks 1–4 value gap) · Architect (parked: three-table spec). **All parked by founders — do not resume without assignment.**
- **SOURCE-OF-TRUTH REFERENCES:** `02`, `03`, `10` (the loop) · `11` §7 · `01` DL-001/003/006/011/012/013 · `12` §5.2, §12 F-6 · `13` §3.2, §3.3, §4 F4–F5, §8
- **SCREENSHOTS / REFERENCE LINKS:** `docs/screens/IL/` — none yet
- **BLOCKERS:** implementation parked by decision (DL-021) — design of the shape proceeds; F5 absent; three intent-shaped UIs with no canonical object (§3.1 N-11)
- **NEXT REQUIRED DECISION:** ~~*Un-park the bounded loop in this phase?* [ ] yes — assign the three parked bot tasks [ ] no — design the *experience* only, no persistence [ ] defer entirely until FLOWS phase is done~~ **DECIDED 20 Sep 2026 — DESIGN SHAPE ONLY (DL-021).** Next open: Q-11 — which UI, if any, becomes Decision-Record capture (D5).

### 2.4 MX — Market Experience

- **CANONICAL NAME:** Market Experience
- **ALIASES / LEGACY NAMES:** "Signal Terminal" (`/`), "Macro Economic" (`/intelligence`), "Nexus", "MARKET FLOOR" (Room Navigator room), `market-floor` (response-engine `RoomId`), "market intelligence", "Oracle", "confluence", "MTF"
- **STRUCTURAL MAP LEVEL:** Level 1
- **OWNER SYSTEM:** Market Experience — **OWNER: PROPOSED** for Oracle (could be AA), Nexus (could be AA), Charts (shared with FD Trading Desk)
- **USER-FACING SURFACES:** MX-PAGE-001…003 · MX-SECTION-001…006 · MX-STATE-001/002
- **IMPORTANT SUBFEATURES:** live prices / signals · macro dashboard · Nexus mindmap · confluence editor + modals + ultra-confluence · MTF · session / liquidity / range · TradingView charts + overlays · Oracle · analysis history
- **ROUTES / COMPONENTS:** `/`, `/intelligence`, `/nexus`, `/docs/ultra-breakdown`; ~40 loose analysis components; `components/mtf/`, `components/nexus/`, `components/oracle/`, `components/ultra-confluence/`, `lib/confluences.ts`, `lib/multi-timeframe-analysis.ts`, `lib/stores/useAnalysis.ts`
- **ASSOCIATED DATA:** none of the user's. Market data via `/api/polygon/*`, `/api/market/*` (3 + 2 routes, server-side, REAL). `/api/market/stats` is called twice and **does not exist**.
- **TECHNICAL FOUNDATIONS:** F6 (REAL, unauthenticated — S6) · F15 (PARTIAL, analysis history)
- **AI DEPENDENCY:** none required. Nexus AI panel and Oracle are mock; grounded questions go to AA-AI-002
- **INTEGRATION DEPENDENCY:** Polygon.io (real key), TradingView `tv.js` embed (real), `FINNHUB_KEY`/`ALPHAVANTAGE_KEY` referenced (`13` §9: production presence unverifiable)
- **PRIVACY / PERMISSION SENSITIVITY:** Low (public market data). Cost exposure via unauthenticated proxies (S6).
- **CURRENT DESIGN STATUS:** V0 DRAFT · ROUGH (session analysis, analysis boxes) · `mtf-theme.ts` is a second de-facto design system (`12` §8)
- **CURRENT FUNCTIONAL STATUS:** PARTIAL — real Polygon on `/dashboard` trading desk; **`/` still renders `generateMockPriceData`** (`12` F-11)
- **CURRENT BACKEND STATUS:** REAL and sufficient (F6). Nothing new needed to stop being demo (`13` §8).
- **FOUNDER DECISION STATUS:** none recorded. `01` rejects "TradingView as the centre" as differentiator; it is the centre of `/copilot` and the desk (`12` F-7 — "fine as a feature" clause may cover it)
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** no dedicated legacy system — market content lives inside legacy 01 Flight Deck and 03.2 "Create Forecast / Market Read". Charts are QCLAY POLISH LATER candidates once function is approved.
- **GROK BOT RESPONSIBLE (planning):** Red Team (is any of this differentiated vs TradingView's own AI copilot?) · Architect (F6 hardening: auth + cache)
- **SOURCE-OF-TRUTH REFERENCES:** `12` §5.3, §12 F-7, F-11 · `13` §2.6, §2.7, §4 F6, §7 S6, §8 · `11` §3 (General intelligence: markets, instruments, sessions, events, news)
- **SCREENSHOTS / REFERENCE LINKS:** `docs/screens/MX/` — none yet
- **BLOCKERS:** none technical. Honesty fix is cheap (swap mock for the existing snapshot route; delete dead `/api/market/stats` calls).
- **NEXT REQUIRED DECISION:** *What is `/` after login?* [ ] Signal Terminal with real data [ ] redirect to Flight Deck [ ] a lighter "today" page — and *keep TradingView as the chart?* [ ] yes (feature) [ ] replace later

### 2.5 ED — Education

- **CANONICAL NAME:** Education
- **ALIASES / LEGACY NAMES:** "The Cockpit" (`/cockpit` — a guided narrative, **not** the Flight Deck), "Student Hub" / "Student Collaboration Hub" (`/hub`), "mentor method", "MethodVault", "coach", "tutorials", "glossary", legacy 02.5 "Room Memory / Knowledge Library", 02.7 "Student Progress", "General ARCHIO Intelligence — education layer" (`11` §3)
- **STRUCTURAL MAP LEVEL:** Level 1
- **OWNER SYSTEM:** Education — **OWNER: PROPOSED** for tutorial overlays (also IL), mentor components (also CO), glossary (also AA)
- **USER-FACING SURFACES:** ED-PAGE-001/002 · ED-SECTION-001…003 · ED-MODAL-001 · ED-STATE-001/002
- **IMPORTANT SUBFEATURES:** guided narrative (7 sections) · student dashboard · mentor method vault / entry models · coach Q&A · guide/shortcut modals · glossary + explain-term (the one *contextual* pattern)
- **ROUTES / COMPONENTS:** `/cockpit` (`components/cockpit/`), `/hub` (`student-collaboration-hub.tsx`, `hub/`), `components/mentor/` (10), `copilot/coach/`, `live-room/glossary.ts` + `explain-term.tsx`
- **ASSOCIATED DATA:** **none.** No course, lesson, curriculum, enrollment, progress or content table; no storage bucket; no CMS (`13` §3.1). `community_mentors.total_students` is a seeded integer.
- **TECHNICAL FOUNDATIONS:** F14 (MISSING — undefined) · F13 (MISSING, media) · F7 (glossary → contextual intelligence)
- **AI DEPENDENCY:** potential — explain-term is the seed for contextual General intelligence (`11` §3). Today static.
- **INTEGRATION DEPENDENCY:** none
- **PRIVACY / PERMISSION SENSITIVITY:** Medium once progress exists (a student's progress visible to a mentor requires permission — `11` §2)
- **CURRENT DESIGN STATUS:** V0 DRAFT (cockpit) · ROUGH (hub, mentor, coach) · NOT DESIGNED: progress, curriculum, enrollment
- **CURRENT FUNCTIONAL STATUS:** UI ONLY / MOCK DATA throughout
- **CURRENT BACKEND STATUS:** **zero** (`13` §3.1 verdict)
- **FOUNDER DECISION STATUS:** **DL-022 DECIDED (20 Sep 2026) — COMBINATION:** a dedicated ARCHIO learning system (structured learning experiences · mentor-created educational content · student access / progression) **plus** educational content and intelligence surfacing contextually across Community, Ask Archio, Flight Deck, onboarding and other experiences. Creator / mentor knowledge feeding AI agents or marketplace products = VISION, not a commitment. *Previously:* ~~the system has no definition — what Education is in ARCHIO is unstated in `11`~~
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** legacy 02.5 + 02.7 only. Nothing for QClay until defined.
- **GROK BOT RESPONSIBLE (planning):** **Product Brain first** (define the system: problem, journey position, connections) · then Red Team · then Architect (F14 shape)
- **SOURCE-OF-TRUTH REFERENCES:** `12` §5.4 · `13` §3.1, §4 F14, §8 · `11` §3, §4 (Learn)
- **SCREENSHOTS / REFERENCE LINKS:** `docs/screens/ED/` — none yet
- **BLOCKERS:** ~~definition~~ — resolved (DL-022). Now: the Education flows (learning-system side and contextual-surfacing side) must be mapped in the FLOWS phase before any ED screen is designed (D7); F14 shape follows those flows.
- **NEXT REQUIRED DECISION:** ~~*What is Education in ARCHIO?* [ ] structured courses [ ] mentor-authored method inside communities [ ] contextual explanations everywhere (glossary pattern) [ ] combination: ________~~ **DECIDED 20 Sep 2026 — COMBINATION (DL-022).** No further founder decision needed before the FLOWS-phase mapping; Product Brain maps the two sides, Red Team challenges, Architect grounds F14.

### 2.6 CO — Community & Opportunity

- **CANONICAL NAME:** Community & Opportunity
- **ALIASES / LEGACY NAMES:** "Community" (legacy SYSTEM 02; `09` nine systems), "COLLECTIVE" and "MENTOR HALL" (Room Navigator rooms), "Community Hub" (floating panel), "groups" (DB, ×3 DDL), "orgs / rooms / memberships" (DB, second tenancy model), "Live Room" / "live-stage" / "Live Call" / "War Room", "Mentor's Ledger" (DL-002 entry wedge), "cohort", "Social Network" (`09` — the feed, *separate* from Community), "Network / Marketplace" (founder discussion)
- **STRUCTURAL MAP LEVEL:** Level 1
- **OWNER SYSTEM:** Community & Opportunity — **OWNER: PROPOSED** for Live Room (also IL ledger, F11), leaderboards (also IL/TP), notification center (also SH/F9)
- **USER-FACING SURFACES:** CO-PAGE-001…003 · CO-PANEL-001…004 · CO-DRAWER-001…003 · CO-TPL-001…007 · CO-STATE-001…003
- **IMPORTANT SUBFEATURES:** discovery with dimension filters · floating hub with 13 views (5 hard-coded example rooms) · Live Room (resizable workspace, inspector deck, talk dock, theater mode) · live call history · leaderboards ×3 · notification center · member profile card · **missing:** join / request / invite, create community, community detail page
- **ROUTES / COMPONENTS:** `/communities` (`components/communities/`), `/history`, `/live-room`; `components/community-panel/` (15 files, 15,862 lines), `components/live-room/` (23 files, 6,440 lines), `community-hub-gate.tsx` on every `(main)` page
- **ASSOCIATED DATA:** `groups`, `group_members`, `group_invites`, `community_mentors` (Model A — `community-schema.sql`, `community.sql`, `create-community-tables.sql`, `005`, `006`) **and** `orgs`, `rooms`, `memberships`, `invites` (Model B — session-checked, Zod-validated routes, zero UI). `forecast_groups` (dead). `mentor_notifications` (one writer, no reader). Which `groups` DDL the live DB has: `CANNOT VERIFY LIVE DB FROM REPO`. **DL-020 (20 Sep 2026): Model B is the target structure; Model A is superseded for design — both table sets remain as repo facts until a migration is separately approved.**
- **TECHNICAL FOUNDATIONS:** F3 (PARTIAL, **duplicated** — founder decision) · F11 (MISSING — no realtime, no live transport) · F9 (MISSING) · F15 (PARTIAL — discovery filters) · F2
- **AI DEPENDENCY:** none required. Live Room "instruments" derive lenses deterministically from the `SessionEvent` ledger (good pattern for `13` §5).
- **INTEGRATION DEPENDENCY:** live audio/video/stream provider — **none chosen** (F11 "provider choice first")
- **PRIVACY / PERMISSION SENSITIVITY:** **High** — membership, mentor↔student visibility, live sessions recorded; `01` warns the repo's org/mentor shape is not evidence of demand
- **CURRENT DESIGN STATUS:** V0 DRAFT (discovery, hub, Live Room — the Live Room is the most *recently* designed surface, Masterplan II) · NOT DESIGNED: join, create, detail page
- **CURRENT FUNCTIONAL STATUS:** PARTIAL (discovery reads real `groups` with mock fallback — FLOW-005, **stops at "join"**) · MOCK elsewhere
- **CURRENT BACKEND STATUS:** two competing tenancy models, both partial; membership/invite backend exists with no front door (FLOW-011)
- **FOUNDER DECISION STATUS:** DL-002 (entry wedge = Mentor's Ledger, cohort) DECIDED; **DL-020 DECIDED (20 Sep 2026) — tenancy = Model B: organization / community → rooms / channels → memberships / access, one model; Model A `groups` superseded for design; Discord-familiar mental model, not a literal copy, no rooms invented from the example**; `01` rejected "letting repo architecture define the market" (still binds: the Model B API existing is not a reason to design admin UI, `12` F-8)
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** legacy SYSTEM 02 (02.1 Discovery ≈ CO-PAGE-001 · 02.2 Detail/Preview ≈ CO-STATE-003 · 02.3 Live Room ≈ CO-PAGE-003 · 02.4 Catch Me Up = no UI · 02.5/02.7 → ED · 02.6 Mentor Studio ≈ CO-STATE-002). Discovery + Live Room are the two surfaces closest to "FOUNDER APPROVED FUNCTION / QCLAY VISUAL POLISH".
- **GROK BOT RESPONSIBLE (planning):** Architect (F3 — ground **Model B** `orgs → rooms → memberships → invites` against the real SQL now that it is decided, DL-020; name what a migration off `groups` would touch, **without scheduling it**) · Red Team (is the hub's 13-view scope justified? which of the 5 example rooms is real?) · Product Brain (Opportunity = what, exactly?)
- **SOURCE-OF-TRUTH REFERENCES:** `12` §5.5, §9.2 FLOW-005/011/012, §12 F-8, F-13 · `13` §2.2, §3.4, §4 F3, F9, F11, §7 S1, S4, §8 · `01` DL-002, rejected ideas · `02` (org shape ≠ demand)
- **SCREENSHOTS / REFERENCE LINKS:** `docs/screens/CO/` — none yet; `docs/live-room-design-masterplan.md` (Masterplan I + II)
- **BLOCKERS:** ~~F3 decision blocks join/create/detail design~~ — resolved (DL-020); join / room-entry design can proceed against Model B. Still blocking: D-1 collapse + migration discipline need a **separate** approval (B-6); F11 provider blocks anything live being real
- **NEXT REQUIRED DECISION:** ~~*One tenancy model:* [ ] Model A `groups` (community-first, discovery already reads it) [ ] Model B `orgs → rooms → memberships` (admin-first, full API, no UI) [ ] merge: ________~~ **DECIDED 20 Sep 2026 — Model B (DL-020).** Still open: *"Opportunity" means:* ________ (Q-7) · room names (Q-3).

### 2.7 AA — Ask Archio

- **CANONICAL NAME:** Ask Archio
- **ALIASES / LEGACY NAMES:** "Personal ARCHIO Intelligence" and "General ARCHIO Intelligence" (`11` §3 — these are *layers*, not surfaces), "Archio AI" / "Persistent Archio AI" (legacy §4.3, 01.6), "command bar" / "Command layer" (code `/api/command`), "response engine" / "grounded response engine" (code `/api/archio`), "Jarvis" (FD narration), "Oracle" (MX), "Copilot chat" (scripted), "Nexus AI", "Mentor AI", "AI Team" (dead)
- **STRUCTURAL MAP LEVEL:** Level 1 (the *surface*); the intelligence layers are cross-cutting (`11` §3)
- **OWNER SYSTEM:** Ask Archio — **OWNER: PROPOSED** for Oracle, Jarvis, Nexus AI (each could stay in its host system as a *consumer* of AA)
- **USER-FACING SURFACES:** AA-AI-001…008 · AA-TPL-001 · AA-STATE-001…004
- **IMPORTANT SUBFEATURES:** command bar (intent parser, capability matrix, streamed reply) · grounded answers (structured JSON → template registry: `trade-post-mortem`, `asset-deep-dive`, generic) · quick actions · streaming state · **missing:** assistance style (quiet ↔ proactive), consent / "what ARCHIO knows about you", error / refusal / rate-limit
- **ROUTES / COMPONENTS:** `POST /api/command` (`openai/gpt-5-mini`) · `POST /api/archio` (`streamObject`, `openai/gpt-4.1-mini`, `maxDuration 30`, real Polygon grounding) · `POST /api/copilot/chat` (keyword matcher — **not AI**) · `components/command/`, `lib/command/`, `lib/response-engine/` (`router.ts`, `contract.ts`, `journal.ts` = labelled demo book), `vantary/cartouche/ask-answer-surface.tsx`, `ask-quick-actions.tsx`, `archio-room/`
- **ASSOCIATED DATA:** reads **no user table**. `/api/archio` has no `.from()` call; its "journal" is a demo book. Personal grounding would need F4/F5/F8.
- **TECHNICAL FOUNDATIONS:** F7 (REAL — General only, unauthenticated) · F6 (grounding) · F8 (MISSING — personal memory) · F2 (quota/consent)
- **AI DEPENDENCY:** this *is* the AI surface. Two real LLM endpoints via AI Gateway model IDs; one scripted. Classification totals in `13` §6.2.
- **INTEGRATION DEPENDENCY:** Vercel AI Gateway (zero-config), Polygon for grounding
- **PRIVACY / PERMISSION SENSITIVITY:** **High** the moment personal grounding exists (`11` §2 "with the user's permission"); **Medium now** (cost — S5, no per-user quota)
- **CURRENT DESIGN STATUS:** V0 DRAFT · NOT DESIGNED: assistance style, consent, error/refusal · no rule yet that generated surfaces obey the design system (`12` §8.15)
- **CURRENT FUNCTIONAL STATUS:** FUNCTIONAL for General questions (FLOW-003, FLOW-004) · MOCK for every "personal" answer
- **CURRENT BACKEND STATUS:** REAL pattern to reuse; needs auth + quota (S5); personal layer MISSING
- **FOUNDER DECISION STATUS:** DL-003 (AI in v1 = one call, the Review) applies to the *loop engine*; `11` §3 names the two intelligence layers; which of the ~8 AI-labelled surfaces is *the* Ask Archio is undecided (§3.1 N-2, N-8). **DL-028 (20 Sep 2026) — FOUNDER DIRECTION, not a spec:** inside the Flight Deck, Ask Archio / the question bar guides users conversationally (*what are you? · what can you do? · where do I go? · how does this work?*) and may naturally encourage login / registration when a signed-out user reaches for identity- or persistence-bound features (DL-026). No assistant / onboarding logic is designed by it. **DL-031 (22 Sep 2026, provisional — Luke): Ask Archio is global Flight Deck chrome — never forced into a zone; Nexus is a likely legacy duplicate whose broad "all-knowing ARCHIO" job Ask Archio absorbs — absorption candidate, code kept (D-19).**
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** legacy §4.3 "Persistent Archio AI" + 01.6 "Archio AI Expanded Workspace". QClay excluded "AI modules" from their quote — that exclusion now maps to hardening one existing pattern (F7), not inventing one (`13` §10).
- **GROK BOT RESPONSIBLE (planning):** Architect (F7 reuse; AI vs deterministic table per system — `13` §5) · Red Team (TradingView AI Chart Copilot, TradeZella agents — what is ours?) · Product Brain (what does "personal" mean before the model has data)
- **SOURCE-OF-TRUTH REFERENCES:** `12` §5.6, §8.15, §9.2 FLOW-003/004 · `13` §2.3, §4 F7–F8, §5, §6, §7 S5 · `11` §2, §3, §5 · `01` DL-003
- **SCREENSHOTS / REFERENCE LINKS:** `docs/screens/AA/` — none yet
- **BLOCKERS:** auth/quota (small); personal grounding blocked on F4/F5/F8; naming (N-2, N-8)
- **NEXT REQUIRED DECISION:** *Which surface is "Ask Archio"?* [ ] command bar (`/api/command`) [ ] grounded engine (`/api/archio`) [ ] one merged surface — and *Oracle / Jarvis / Nexus AI are:* [ ] the same thing under other names → retire names [ ] distinct features → each needs a definition

### 2.8 AM — Account / Money

- **CANONICAL NAME:** Account / Money
- **ALIASES / LEGACY NAMES:** "Profile", "Settings" (absent), "Accounts module" (FD), "Account & Execution Center" (legacy 01.4), "Portfolio" (legacy SYSTEM 06), "Net Worth" (legacy SYSTEM 07), "Connections & Wallets" (06.2), "My Money" (dead), "billing / plans / subscriptions" (DB), "orgs" (DB — **not** this system's UI to design)
- **STRUCTURAL MAP LEVEL:** Level 1
- **OWNER SYSTEM:** Account / Money — **OWNER: PROPOSED** for Accounts module (also FD), Connections (also F10)
- **USER-FACING SURFACES:** AM-PAGE-001 · AM-SECTION-001 · AM-STATE-001…006
- **IMPORTANT SUBFEATURES:** profile (header, stats, identity, badges, activity, mentor/student modules, connections) · accounts module · **missing:** settings, billing UI, connected broker, privacy controls, delete/export
- **ROUTES / COMPONENTS:** `/profile` (`components/profile/` 10 files, `lib/stores/useProfile.ts`), `dashboard/modules/accounts.tsx`, `lib/stores/useAccounts.ts`, `ProfileConnections`, `trading-desk/execution-console/`
- **ASSOCIATED DATA:** `profiles` (REAL, F1) · `plans`, `subscriptions` (REAL, `002_seed_plans.sql`, Stripe webhook handles `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.updated|deleted`) · `/api/subscriptions/checkout|portal|current|me`, `/api/users/*` — **all with zero UI callers** · broker accounts: none
- **TECHNICAL FOUNDATIONS:** F1 (REAL) · F12 (PARTIAL — backend real, no UI) · F10 (MISSING) · F2 · F13 (avatar upload — MISSING)
- **AI DEPENDENCY:** none
- **INTEGRATION DEPENDENCY:** Stripe (real backend; dashboard products vs `plans` seed unverifiable — `13` §9) · broker (none)
- **PRIVACY / PERMISSION SENSITIVITY:** **High** — money, identity, public-profile default (S8), export/delete are legal obligations
- **CURRENT DESIGN STATUS:** V0 DRAFT (profile) · ROUGH (accounts) · NOT DESIGNED: settings, billing, privacy, delete/export
- **CURRENT FUNCTIONAL STATUS:** MOCK DATA (profile has a demo-mentor toggle) · INTEGRATION BLOCKED (broker)
- **CURRENT BACKEND STATUS:** REAL and waiting (F1, F12) — "backend without a front door"
- **FOUNDER DECISION STATUS:** DL-004 (broker read-only in v2). Pricing appears only in pitch slides; no plan/price decision recorded. **Guard rail:** do not design org/room admin because the API exists (`12` F-8).
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** legacy 01.4, SYSTEM 06 Portfolio (06.1–06.6), SYSTEM 07 Net Worth (07.1–07.2) — **name conflict** Portfolio ↔ Net Worth ↔ Account / Money (§3.1 N-4). Settings + billing are classic "FOUNDER APPROVED FUNCTION / QCLAY VISUAL POLISH" candidates once function is decided.
- **GROK BOT RESPONSIBLE (planning):** Architect (F12 wiring is cheap; F10 CSV-first) · Red Team (public profiles; who pays and for what) · Product Brain (does Account / Money include Portfolio and Net Worth, or are those separate systems?)
- **SOURCE-OF-TRUTH REFERENCES:** `12` §5.7, §12 F-8 · `13` §2.2, §2.3, §4 F1, F10, F12, §7 S8, §8 · `01` DL-004, rejected ideas
- **SCREENSHOTS / REFERENCE LINKS:** `docs/screens/AM/` — none yet
- **BLOCKERS:** none technical for profile/settings/billing UI; broker is DL-004-gated
- **NEXT REQUIRED DECISION:** *Does Account / Money absorb legacy Portfolio (06) and Net Worth (07)?* [ ] yes, as sections [ ] no, they are future Level-1 systems [ ] they are VISION — and *ship a real settings + billing page in this phase?* [ ] yes [ ] no

### 2.9 TP — Trading Passport / verified proof (Level 4 / VISION)

- **CANONICAL NAME:** Trading Passport / verified proof
- **ALIASES / LEGACY NAMES:** "Passport", "Verified Track Record", "AI Verified Track Record" (`09` nine systems), "My Record" (IL-TAB-001…004 "My Record"), "Proof drawer" (CO-DRAWER-003), "public record" (pitch Act III), "verified proof"
- **STRUCTURAL MAP LEVEL:** Level 4 / VISION
- **OWNER SYSTEM:** TP (VISION) — fragments live in IL and CO today
- **USER-FACING SURFACES:** TP-SECTION-001 (fragments only)
- **IMPORTANT SUBFEATURES:** none built as such. Concept: a shareable, verifiable record of decisions-before-outcome (depends on `lock_lead_seconds`, DL-013)
- **ROUTES / COMPONENTS:** none of its own
- **ASSOCIATED DATA:** would be a *read model* over F5 (decision records + trades + reviews) with F2 visibility rules
- **TECHNICAL FOUNDATIONS:** F5 (MISSING) · F2 · F13 (share images)
- **AI DEPENDENCY:** none required (verification is arithmetic — `13` §5)
- **INTEGRATION DEPENDENCY:** broker fills for verification (F10)
- **PRIVACY / PERMISSION SENSITIVITY:** **Highest** — public by definition; opt-in only
- **CURRENT DESIGN STATUS:** NOT DESIGNED (fragments V0 DRAFT)
- **CURRENT FUNCTIONAL STATUS:** VISION ONLY
- **CURRENT BACKEND STATUS:** MISSING (right of REVIEW on the ladder = VISION, `09` §2)
- **FOUNDER DECISION STATUS:** DL-013 makes `lock_lead_seconds` the honesty metric — the *seed* of proof is decided; the product is not
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** none of the seven legacy systems is this exactly; nearest legacy 03.3 "Forecast Detail / Resolution" and 04.7 "DNA History". Not for QClay in this phase.
- **GROK BOT RESPONSIBLE (planning):** none in this phase (VISION). Red Team when un-parked (Invo, Fomo — proof-as-product competitors, `09` §2).
- **SOURCE-OF-TRUTH REFERENCES:** `12` §6 · `10` (ladder) · `01` DL-013 · `09` §2
- **SCREENSHOTS / REFERENCE LINKS:** `/pitch` Act III "Verified Record" slide (narrative)
- **BLOCKERS:** everything left of it on the ladder
- **NEXT REQUIRED DECISION:** *canonical name:* [ ] Trading Passport [ ] Verified Track Record [ ] other: ________ (name only — no design)

### 2.10 SM — Social / creator / marketplace (Level 4 / VISION)

- **CANONICAL NAME:** Social / creator / marketplace
- **ALIASES / LEGACY NAMES:** "The Marketplace" (legacy SYSTEM 05: 05.1–05.7), "AI Agent Marketplace" (`09`), "Social Network" (`09` — the feed), "Network", "creator storefront", "Layout Publisher", "Creator Intelligence" (ladder), "Opportunity" (possibly — see CO)
- **STRUCTURAL MAP LEVEL:** Level 4 / VISION
- **OWNER SYSTEM:** SM (VISION) — boundary with CO "Opportunity" is **undefined** (§3.1 N-6)
- **USER-FACING SURFACES:** SM-SECTION-001 (none built)
- **IMPORTANT SUBFEATURES:** none built. Concept: creators publish agents / layouts / method; ARCHIO takes a share (pitch Act IV "GMV math")
- **ROUTES / COMPONENTS:** none; Room Navigator door copy and pitch slides only
- **ASSOCIATED DATA:** none. Would need F3 (creator = community owner?), F12 (payouts), F13 (assets)
- **TECHNICAL FOUNDATIONS:** F3 · F12 · F13 · F4 (all MISSING or partial)
- **AI DEPENDENCY:** agents (AG) if the marketplace sells agents
- **INTEGRATION DEPENDENCY:** Stripe Connect or equivalent for payouts — not present
- **PRIVACY / PERMISSION SENSITIVITY:** High (money to creators, public storefronts)
- **CURRENT DESIGN STATUS:** NOT DESIGNED
- **CURRENT FUNCTIONAL STATUS:** VISION ONLY
- **CURRENT BACKEND STATUS:** MISSING
- **FOUNDER DECISION STATUS:** none; `01` warns against letting repo architecture (orgs) define the market. **DL-031 (22 Sep 2026, provisional — Luke): Marketplace's conceptual long-term home = THE COLLECTIVE / Community & Opportunity family; NOT a D1 door, NOT approved for implementation; preserved in future architecture planning so the creator / opportunity vision is not lost. Not designed in D1 Block 2.**
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** legacy SYSTEM 05 in full — **flag:** QClay's locked map has this as a core system; the Structural Map v1 has it as VISION. QClay must be told which map is current.
- **GROK BOT RESPONSIBLE (planning):** none in this phase
- **SOURCE-OF-TRUTH REFERENCES:** `12` §6 · `10` (right branch of the ladder) · `01` rejected ideas · `09` §2
- **SCREENSHOTS / REFERENCE LINKS:** `/pitch` Act IV slides
- **BLOCKERS:** VISION by decision
- **NEXT REQUIRED DECISION:** *Is "Opportunity" in "Community & Opportunity" the Level-1 seed of this system?* [ ] yes [ ] no — Opportunity means: ________

### 2.11 AG — Agents / workflows (Level 4 / VISION)

- **CANONICAL NAME:** Agents / workflows
- **ALIASES / LEGACY NAMES:** "AI agents", "clone agents" (pitch), "Agent Builder / Training Studio" (legacy 05.5), "AI Team" (dead), "PERSONALISED AI → AGENTS → WORKFLOWS" (ladder), "background agents" (TradeZella competitor framing)
- **STRUCTURAL MAP LEVEL:** Level 4 / VISION
- **OWNER SYSTEM:** AG (VISION)
- **USER-FACING SURFACES:** AG-SECTION-001 (none built)
- **IMPORTANT SUBFEATURES:** none. Governance constraint already decided: **agents never place orders** (`09` §4.3 Architect rules; DL-004)
- **ROUTES / COMPONENTS:** none
- **ASSOCIATED DATA:** would consume F4 (event spine) + F8 (personal memory)
- **TECHNICAL FOUNDATIONS:** F4 · F7 · F8 (MISSING)
- **AI DEPENDENCY:** total
- **INTEGRATION DEPENDENCY:** none until defined
- **PRIVACY / PERMISSION SENSITIVITY:** Highest (an agent acting on personal data)
- **CURRENT DESIGN STATUS:** NOT DESIGNED
- **CURRENT FUNCTIONAL STATUS:** VISION ONLY
- **CURRENT BACKEND STATUS:** MISSING
- **FOUNDER DECISION STATUS:** none beyond "never execute"
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** legacy 05.2 Agent Listing, 05.5 Agent Builder. Not for QClay.
- **GROK BOT RESPONSIBLE (planning):** none in this phase
- **SOURCE-OF-TRUTH REFERENCES:** `12` §6 · `10` · `09` §4.3 · `01` DL-004
- **SCREENSHOTS / REFERENCE LINKS:** `/pitch` Act IV "clone agents"
- **BLOCKERS:** VISION by decision
- **NEXT REQUIRED DECISION:** none in this phase

### 2.12 MK — Founder, marketing and internal surfaces

- **CANONICAL NAME:** Founder / marketing / internal surfaces
- **ALIASES / LEGACY NAMES:** "the pitch", "Owen deck", "landing", "design page", "backend map", "playground"
- **STRUCTURAL MAP LEVEL:** outside the product
- **OWNER SYSTEM:** none (founders)
- **USER-FACING SURFACES:** MK-PAGE-001…010 — **not user-facing**; public only by URL
- **IMPORTANT SUBFEATURES:** two landings · two decks · Owen decks · masterplan · design page · backend map · playgrounds · ultra-confluence explainer
- **ROUTES / COMPONENTS:** `/welcome`, `/archio`, `/pitch`, `/newpitch`, `/owen*`, `/masterplan`, `/design`, `/backend-map`, `/playground/*`, `/docs/ultra-breakdown`
- **ASSOCIATED DATA:** none
- **TECHNICAL FOUNDATIONS:** none
- **AI DEPENDENCY:** none · **INTEGRATION DEPENDENCY:** none
- **PRIVACY / PERMISSION SENSITIVITY:** Medium — internal pages (`/backend-map`, `/masterplan`, `/owen/presenter`) are publicly routable; decide whether they should be
- **CURRENT DESIGN STATUS:** V0 DRAFT (decks are polished narrative; `/design` is a token showcase)
- **CURRENT FUNCTIONAL STATUS:** FUNCTIONAL as pages
- **CURRENT BACKEND STATUS:** n/a
- **FOUNDER DECISION STATUS:** none. `12` F-12: two landings + QClay's landing work = three
- **LUKE REVIEW:** NOT REVIEWED · **KAN REVIEW:** NOT REVIEWED
- **QCLAY RELEVANCE:** **direct** — QClay's landing page cannot finish until the product interfaces exist; `/welcome` and `/archio` overlap their work
- **GROK BOT RESPONSIBLE (planning):** none (bots do not see MK)
- **SOURCE-OF-TRUTH REFERENCES:** `12` §7, §12 F-12 · memory files (Owen deck, pitch) are **not** bot inputs
- **SCREENSHOTS / REFERENCE LINKS:** none needed
- **BLOCKERS:** none
- **NEXT REQUIRED DECISION:** *Which landing survives?* [ ] `/welcome` [ ] `/archio` [ ] QClay's [ ] none until product exists — and *hide internal routes behind login?* [ ] yes [ ] no

---

## 3. Naming and duplication control

**Rule:** a name is *canonical* only if it appears in `11`, `01` (DECIDED), the Structural Map v1 as given by the founders, or the `12` register. Everything else is an alias until a founder rules. **v0 does not resolve these. It flags them.** A resolution is recorded in `01` as a DL entry, then mirrored here (status → `DECIDED`, alias table updated) and logged in §5.

### 3.1 Naming conflicts register

| # | Names in play | Evidence (where each name lives) | What is actually different | Status | Who rules |
|---|---|---|---|---|---|
| **N-1** | **Decision Desk** vs **Intent Loop / Decision experience** vs "the loop" vs Forecast Hub vs Execution Copilot | Decision Desk: QClay legacy SYSTEM 03, `09` §2 nine systems · Intent Loop / Decision experience: Structural Map v1 (founders, 20 Sep) · "the loop": `02`, `10`, `11` §7 · Forecast Hub / Execution Copilot: code | Decision Desk was a *page family* (03.1–03.9). Intent Loop is a *system*; "the loop" is its *engine*. Forecast Hub and Copilot are two *UIs* that each partially resemble 03.2/03.4. | **FLAGGED** — founders raised it | Luke + Kan |
| **N-2** | **Ask Archio** vs **Personal ARCHIO Intelligence** vs General ARCHIO Intelligence vs Archio AI vs Command layer vs response engine | Ask Archio: Structural Map v1, `09` daily rituals · Personal / General ARCHIO Intelligence: `11` §3 (layers) · Archio AI: legacy §4.3, 01.6 · Command layer: `components/command/`, `/api/command` · response engine: `lib/response-engine/`, `/api/archio` | `11` §3 names two intelligence *layers*; Ask Archio is the *surface*; the code has two *endpoints* that do not share a name with either. | **FLAGGED** — founders raised it | Luke + Kan; Architect grounds which endpoint is which layer |
| **N-3** | **DNA** vs **Personal Intelligence** vs Trading DNA vs Strategy OS `dna.tsx` vs Trader Model v0 | DNA / Trading DNA: legacy SYSTEM 04, `09` nine systems ("Trader OS + Psychology combined; Mind Check inside") · Personal Intelligence: `11` §3 · `dna.tsx`: `vantary/strategy-os/` · Trader Model v0: `09` §2 loop objects (six SQL aggregates) | Trading DNA was a *product system*; Personal Intelligence is a *layer*; Trader Model v0 is a *data object*; `dna.tsx` is a *mock panel*. | **FLAGGED** — founders raised it | Luke + Kan |
| **N-4** | **Portfolio** vs **Net Worth** vs Account / Money vs Accounts module | Portfolio: legacy SYSTEM 06 · Net Worth: legacy SYSTEM 07 · Account / Money: Structural Map v1 · Accounts module: `dashboard/modules/accounts.tsx` | Two legacy systems (positions vs total wealth) collapsed by the Structural Map into one Level-1 system whose name is about *account + billing*, not positions. | **FLAGGED** — founders raised it | Luke + Kan; Product Brain maps |
| **N-5** | **Passport** vs **Verified Track Record** vs AI Verified Track Record vs Trading Passport / verified proof vs My Record vs Proof | Passport / Trading Passport: Structural Map v1 (VISION) · (AI) Verified Track Record: `09` nine systems · My Record: IL-TAB-001…004 "My Record" · Proof drawer: CO-DRAWER-003 | Same concept, four names, two UI fragments. | **FLAGGED** — founders raised it | Luke + Kan (name only; VISION) |
| **N-6** | **Community** vs **Network / Marketplace** vs Community & Opportunity vs Social Network vs AI Agent Marketplace vs COLLECTIVE | Community: legacy SYSTEM 02 · Community & Opportunity: Structural Map v1 · Social Network + AI Agent Marketplace: `09` nine systems (feed "separate from Community") · COLLECTIVE: Room Navigator room · Network / Marketplace: founder discussion | `09` says the feed is *separate* from Community; the Structural Map puts "Opportunity" inside Community; the legacy map has Marketplace as its own system. Three maps, three cuts. | **FLAGGED** — founders raised it. **Narrowed 22 Sep 2026 (DL-031, provisional — Luke):** Marketplace's conceptual home is THE COLLECTIVE / CO family (not a door, not approved); "THE COLLECTIVE" stays the zone's working name; its D1 doors = Communities · The Floor · Collab Hub | Luke + Kan; Red Team challenges |
| **N-7** | **Flight Deck** vs Your Space vs dashboard vs **Cockpit** vs Vantary | Flight Deck: Structural Map v1, `09` ("the cockpit surface") · Your Space: `your-space.tsx` · `/dashboard`: route · `/cockpit`: **an Education narrative page** · Vantary: component tree | `09` calls Flight Deck "the cockpit surface" while `/cockpit` is a different page in a different system. An AI told "open the cockpit" will go to the wrong place. | **DIRECTION DECIDED — DL-025 (20 Sep 2026):** the Education `/cockpit` page will be **renamed later**; the replacement name is deliberately **not** chosen yet. Until then "Flight Deck" is the only name for `/dashboard`; do not call it "the cockpit" in new material. **Widened — DL-030 (20 Sep 2026, second session):** the *user-visible* name of `/dashboard` is **OPEN** — founders' live terms are **Dashboard · Flight Deck · Command Center** (tab title already says "Command Center"); **"Your Space" and "Trading Terminal" are NOT authoritative** unless revived. "Flight Deck" stays the `15` document handle only. Five names observed on the surface today (D1 sheet, KNOWN PROBLEM 5). **22 Sep 2026 (DL-031, provisional):** in the zone direction the `/cockpit` Education page is THE ACADEMY's **Education** destination — the route rename stays deferred | Luke + Kan (pick the replacement name when D7 / ED flows are mapped; pick the workspace's visible name — Q-26) |
| **N-8** | **Oracle** vs **Jarvis** vs Ask Archio vs Copilot vs Nexus AI vs Mentor AI | Oracle: `components/oracle/`, `oracle-command-console.tsx` · Jarvis: `vantary/jarvis/` · Copilot: `components/copilot/` (scripted chat) · Nexus AI: `nexus-ai-synthesis-panel.tsx` · Mentor AI: `mentor/MentorAIChat.tsx` | Six AI-labelled personas; two real endpoints; one scripted matcher. Which are *one thing wearing costumes* and which are features is unknown. | **FLAGGED** — found by audit. **22 Sep 2026 (DL-031, provisional — Luke):** Nexus / Nexus AI = likely legacy duplicate whose "all-knowing ARCHIO" job Ask Archio absorbs — absorption candidate, **code kept** (D-19); Ask Archio itself is global chrome, not a zone door | Luke + Kan; Architect lists what each calls |
| **N-9** | **Command palette** vs **Command bar** vs Command Desk vs Command layer | palette: `vantary/command-palette.tsx` (jump to doors) · bar/layer: `components/command/` (LLM) · Command Desk: `dashboard/command-desk/` (neural orb) | Three "command" surfaces; only one calls an LLM. | **FLAGGED** — found by audit | Luke + Kan |
| **N-10** | **Room** (×3) | Room Navigator rooms: MARKET FLOOR / STUDIO / MENTOR HALL / COLLECTIVE · response-engine `RoomId`: `studio`, `market-floor` · DB `rooms`: org sub-tenancy · **Live Room**: a live session surface | "Room" means a cockpit zone, a prompt-routing key, a tenancy record, and a live session. | **PARTLY RESOLVED — DL-025 + DL-020 (20 Sep 2026):** the four Flight Deck categories are **no longer called rooms** — working term **zones** (spaces / destinations acceptable) until founders pick final terminology; "room / channel" is reserved for Community tenancy (Model B). Remaining collisions: response-engine `RoomId` (code identifiers, untouched) · **Live Room** (a live session surface — still shares the word). **Reconfirmed 20 Sep second session (DL-025 addendum):** the four zones must not use Community "room" terminology; zone names + the 16-destination placement are OPEN for Product Brain review (Q-24). **22 Sep 2026: Q-24 → PROVISIONAL (DL-031, Luke; Kan review pending): MARKET FLOOR · TRADING DESK · THE ACADEMY · THE COLLECTIVE — still "zones", still not rooms; the code still says THE STUDIO / MENTOR HALL** | Luke + Kan (final zone term; Live Room naming); Architect for DB `rooms` |
| **N-11** | **Forecast** vs Market Read vs **Decision Record** vs Scenario vs trade plan vs Pre-Trade Contract | Forecast: IL-PAGE-001 · Market Read: legacy 03.2 · Decision Record: DL-001 (the ledger's core object) · Scenario: IL-SECTION-002 · trade plan: IL-PAGE-002 · Pre-Trade Contract: legacy 03.5 | Six names for "what the trader intends before the outcome". The ledger has decided the *object* name (Decision Record); the UIs predate it. | **FLAGGED** — `12` F-6 | Luke + Kan (which UI, if any, becomes capture) |
| **N-12** | **Mentor** vs creator vs community owner vs org owner vs `community_mentors` | mentor: `components/mentor/`, `/hub`, DL-002 · creator: `09` (Creator Intelligence), legacy 05.7 · owner: `groups.owner`/`orgs.owner_id` (`13` §2.2) | Role names differ by layer (product / ladder / DB). | **FLAGGED** — found by audit | Product Brain proposes; founders rule |
| **N-13** | **Student** vs member vs trader vs user | student: `/hub`, `ProfileStudentModule`, legacy 02.7 · member: `group_members`, `memberships`, `member-profile.tsx` · trader: `11` throughout · user: `profiles`, Supabase | Same person, four words. `11` uses *trader*. | **FLAGGED** — found by audit | Founders (recommend `11`'s word: trader) |
| **N-14** | **Journal** vs Auto-Journal vs private notes vs demo journal vs copilot journal tab | Auto-Journal: legacy 03.7 · private-notes: `dashboard/modules/private-notes` · demo journal: `lib/response-engine/journal.ts` (labelled demo) · journal tab: copilot | No journal is persisted; the "journal" the AI reads is a fixture. | **FLAGGED** — found by audit | Founders (is journal = Decision Record + review, or separate?) |
| **N-15** | **Review** vs Trade Review vs Post-Mortem vs Session debrief vs Autopsy Replay vs `decision_reviews` | Trade Review: `09` ritual · Post-Mortem: Ask door → `trade-post-mortem` template · Session debrief: FD-STATE-001 · Autopsy Replay: legacy 03.9 · `decision_reviews`: parked Architect spec | DL-003 says the Review is the one AI call. Five names for its surface. | **FLAGGED** — found by audit | Founders |
| **N-16** | **Morning Brief** vs Daily plan vs Active Window / Day Playbook vs session plan | Morning Brief: `09` ritual, legacy 01.2 · daily-plan: `dashboard/modules/daily-plan` · Active Window: FD-SECTION-001 · session plan: `09` loop objects | The "prepare" moment (`11` §4) has four names and one mock UI. | **FLAGGED** — found by audit | Founders |
| **N-17** | **Catch Me Up** vs Live Call History | Catch Me Up: `09` ritual, legacy 02.4, `/pitch` · `/history`: CO-PAGE-002 | Ritual named everywhere; no UI. `/history` is the nearest surface. | **FLAGGED** — found by audit | Founders (is `/history` Catch Me Up?) |
| **N-18** | **Template** (×3) | Flight Deck templates: FD-TPL · generated-template surfaces: AA-TPL-001 · Layout listing: legacy 05.3 | A saved layout, an AI-rendered answer shape, and a marketplace item. | **FLAGGED** — found by audit | Founders |
| **N-19** | **Hub** (×3) | Flight Deck Hub: FD-PANEL-001 · Community Hub: CO-PANEL-001 · Student Hub: ED-PAGE-002 | Three unrelated things called Hub. | **FLAGGED** — found by audit | Founders |
| **N-20** | **Structural Map v1** vs QClay "Locked product map" vs `09` "Nine systems (design canon)" vs Room Navigator rooms | Structural Map v1: **`15-structural-map-v1.md`** (filed 20 Sep) · Locked product map: `docs/qclay-dashboard-page-inventory-master.md` §3 · Nine systems: `09` §2 · rooms: `FLIGHT_DECK_ROOMS` | ~~Four maps of the same territory.~~ **One current map (`15`).** The QClay locked map is SUPERSEDED as a structural map (legacy page IDs kept for QCLAY RELEVANCE); the nine-system list is marked LEGACY in `09` §2 (aliases only); the rooms are a UI layer (Q-3 open). | **DECIDED — DL-019** (20 Sep 2026) | done: `15` filed, `09` §2 marked. Remaining: **tell QClay** `15` is the current map (D8 pack, `09` §4 prompt lines still cite the nine systems — identified, not rewritten) |
| **N-21** | **Trading Desk** (zone) vs **Trading Desk** (chart + execution surface) — and, smaller, **The Floor** (Collective door) beside **MARKET FLOOR** (zone) | zone: DL-031 working name for the former THE STUDIO ("work on my trading") · surface: `vantary/trading-desk/` (40 files), `12` FD-SECTION-002, D-9 ("FD Trading Desk vs `/copilot`") · The Floor: FD-NAV-001 Ask door | A navigation zone that groups Forecasts · Copilot · Post-Mortem vs the chart + execution console component that lives *inside* the workspace. An AI or a trader told "open the Trading Desk" cannot know which is meant; the two words "Floor" in one band read as one place. | **FLAGGED 22 Sep 2026** (v0, while recording DL-031). The zone name is explicitly **reversible** (Workbench / Studio are the historical alternatives); resolve **before any label reaches the UI**. Not a decision. | Luke + Kan (Kan review pending — Q-28) |

### 3.2 Duplication register (same thing built more than once)

| # | Duplicated thing | Instances (paths) | Consequence | Recommended handling (founder decides) |
|---|---|---|---|---|
| D-1 | `groups` / `group_members` DDL | `community-schema.sql`, `community.sql`, `create-community-tables.sql` (three definitions, different columns and policy names; `group_invites` twice) | Unknown which the live DB has (`13` §3.4) | collapse to one under migration discipline (`13` §10 unit 2) — **DL-020 does not approve this collapse; it needs its own approval** |
| D-2 | Community tenancy model | Model A `groups…` vs Model B `orgs → rooms → memberships → invites` | two half-systems; join UI cannot be designed | **DECIDED — Model B (DL-020, 20 Sep 2026).** Model A superseded for design / architecture; tables preserved until a separately approved migration |
| D-3 | Auth callback | `/auth/callback` (page) + `/api/auth/callback` (route) | `NEEDS-V0-VERIFICATION` which one production redirects to | keep one |
| D-4 | Auth implementation | `components/auth/*` kit (4 pages) vs `/verify-email` inline (286 lines) · UI uses Supabase client directly while 8 `/api/auth/*` routes exist unused | inconsistent visuals; dead routes | move verify-email into the kit; delete or document dead routes |
| D-5 | Copilot right rail | three variants (`12` F-13) | `NEEDS-V0-VERIFICATION` which is mounted | keep one |
| D-6 | Leaderboards | `community-panel/leaderboard.tsx`, `forecast-hub/forecast-leaderboard.tsx`, `premium-leaderboard.tsx` + `MonthlyMegaCard.tsx` | three ranking UIs over mock data, no ranking object | one leaderboard component, one data contract (after F5) |
| D-7 | Confluence modals | `confluence-modal.tsx`, `custom-confluence-modal.tsx`, `execution-copilot/bottom-panel/confluence-modal.tsx` (+ editor/selector/menu/panel) | three editors for one concept | one |
| D-8 | Gadget registries | `living-gadgets.tsx` (v1, ≈26) vs `living-gadgets-v2.tsx` (13, overlapping) | two definitions of "what a gadget is" | keep one registry |
| D-9 | Chart + execution surface | FD Trading Desk (`vantary/trading-desk/`) vs `/copilot` Execution Copilot | two cockpits for the same act | founder: which is *the* place a trade is planned |
| D-10 | "Command" surfaces | palette · bar/layer · Command Desk (N-9) | three | one keyboard entry point |
| D-11 | Landing pages | `/welcome`, `/archio`, QClay's | three landings | one (§2.12) |
| D-12 | Forecast UIs | Forecast Hub (12 files) vs 10 loose legacy forecast components (IL-MODAL-001) | `NEEDS-V0-VERIFICATION` which legacy ones are mounted | archive legacy |
| D-13 | Notification UIs | `community-panel/notification-center.tsx`, `dashboard/modules/notifications.tsx`, `ActivityNotifications.tsx` | three UIs, zero backend readers (`13` §3.5) | one, as an F9 consumer |
| D-14 | Design token systems | `vantary/theme-system.ts` (7 themes) vs `mtf/mtf-theme.ts` (imported by login + forecast) vs ≥5 other token files vs `live-room-tokens.ts` | no single design system (`12` §8) | founder picks the base; v0 consolidates |
| D-15 | Profile cards | `community-panel/member-profile.tsx` vs `profile/ProfileHoverCard.tsx` | two | one |
| D-16 | Hubs | Flight Deck Hub · Community Hub · Student Hub (N-19) | naming + purpose overlap | rename two |
| D-17 | Live Room mount | `/live-room` standalone + hub `live-stage` | **intentional** (same component, testable route) — not a defect | keep; document |
| D-18 | Market-data callers | `/api/polygon/*` + `/api/market/*` + dead `/api/market/stats` | one gateway, three call styles | one client helper over F6 |
| D-19 | The "all-knowing ARCHIO" surface | **Nexus** (`/nexus`, `components/nexus/` ×5 files, Nexus AI synthesis panel AA-AI-005, MX-PAGE-003) vs **Ask Archio** (AA-AI-001 command layer / AA-AI-002 grounded engine) | two surfaces claiming to synthesise everything; Nexus is mock-data mindmap + AI panel | **DL-031 (22 Sep 2026, provisional — Luke): Nexus = likely legacy duplicate absorbed by Ask Archio — absorption candidate; do NOT delete code yet (founder order).** Fate decided in D4 (One Ask Archio, N-8 / Q-8) |

### 3.3 How a name gets resolved

1. A founder writes the decision as a DL entry in `01` (name, aliases retired, date).
2. v0 updates the §3.1 row → `DECIDED (DL-0xx)`, updates every `ALIASES` field in §2 and the `12` records, adds a §5 change-log line.
3. ChatGPT includes the resolution in the next Context Delta (§7.2) so all three Grok bots stop using the retired name.
4. Code renames (routes, component names) are **separate** implementation work and are never done in this phase.

---

## 4. The trace chain — how to follow one feature end to end

Every feature can be read across this chain. The table says which document holds each link, so nobody re-derives it.

| Link | Question it answers | Where it lives | Field / ID form |
|---|---|---|---|
| **VISION** | Why does ARCHIO want this? | `11` (scope, journey, layers), `01` (DECIDED / REJECTED), `00`/`05` (background only) | `11` §n · DL-0xx |
| **SYSTEM** | Which Level-1 system owns it? | `12` §2–§3 · this file §2 | `FD` `IL` `MX` `ED` `CO` `AA` `AM` (+ `TP` `SM` `AG` `SH` `MK`) |
| **USER FLOW** | Where in the trader's journey; which steps? | `12` §9 (§9.1 founder journey, §9.2 real flows) | `FLOW-0nn` |
| **DESIGN** | What does it look like; how finished visually? | `12` record → `CURRENT VISUAL STATUS`, `DESIGN ISSUES`; `12` §8 design register | vocabulary `12` §1.1 |
| **COMPONENT** | Which files render it? | `12` record → route / component paths; this file §1 | path |
| **DATA** | Which tables / objects? | `13` §2.2 (tables), §2.10 (demo registry), §3 (five answers) | table name · `MISSING` |
| **BACKEND** | Which shared foundation; does it exist? | `13` §4 F1–F15, §8 | `F#` + `REAL / PARTIAL / MISSING` |
| **AI** | Does it call a model; should it? | `13` §5 (principle), §6 (inventory) | endpoint + model id · `deterministic` |
| **INTEGRATION** | External system needed? | `13` §2.6, §2.7, §4 F10–F12 | Polygon · TradingView · Stripe · Supabase Auth · broker (none) |
| **STATUS** | Functional truth today | `12` record → `CURRENT FUNCTIONAL STATUS` | vocabulary `12` §1.2 |
| **FOUNDER APPROVAL** | Has anyone said yes? | `12` record → `LUKE APPROVAL` / `KAN APPROVAL`; this file §2 → `FOUNDER DECISION STATUS` | `NOT REVIEWED / CHANGES REQUESTED / APPROVED` · DL-0xx |
| **QCLAY** | What QClay called it; what they get | this file §2 → `QCLAY RELEVANCE`; `docs/qclay-dashboard-page-inventory-master.md` | legacy `0N.n` |

### 4.1 Worked trace — a real flow: Community Discovery

VISION `11` §4 "Participate" · DL-002 entry wedge is a mentor's cohort → SYSTEM `CO` → FLOW `FLOW-005` discover with filters, **stops at "join"** → DESIGN `CO-PAGE-001` V0 DRAFT, `12` §8 (mtf tokens not used here) → COMPONENT `/communities`, `components/communities/DiscoveryEngine.tsx`, `CommunityObject.tsx`, `CommunityInspector.tsx`, `discovery-dimensions.ts` → DATA `groups` (which of three DDLs: `CANNOT VERIFY LIVE DB`), `community_mentors` seed → BACKEND `F3` PARTIAL (`/api/communities` logs "groups table not found, using mock data" on miss), `F15` PARTIAL → AI none (deterministic filters — correct per `13` §5) → INTEGRATION none → STATUS `PARTIAL` (real read + mock fallback) → APPROVAL NOT REVIEWED ×2 → QCLAY legacy `02.1 Community Discovery`. **Next link missing:** `CO-STATE-001` join (backend exists in Model B, not Model A) — blocked on F3 decision (§2.6).

### 4.2 Worked trace — a decided object with no UI: the Decision Record

VISION DL-001 (core object, locked before outcome), DL-011 (per-field provenance), DL-012 (one tap + optional one line), DL-013 (`lock_lead_seconds`) → SYSTEM `IL` → FLOW named in `12` §9.2 tail "capture a Decision Record" — **no FLOW ID because no UI exists** → DESIGN `NOT DESIGNED`; nearest UIs `IL-DRAWER-001` (long form) and `IL-PAGE-002` (plan) contradict DL-012 (`12` F-6) → COMPONENT none → DATA `decision_records` **MISSING**; `copilot_events` dead; `forecast_groups` orphan → BACKEND `F5` MISSING, `F4` MISSING → AI none for capture; one Review call later (DL-003) → INTEGRATION CSV import first (F10) → STATUS `BACKEND BLOCKED` + **parked** (`09` §4) → APPROVAL: the *object* is DECIDED, the *surface* is not → QCLAY legacy `03.4 Decision Builder` / `03.5 Pre-Trade Contract` (both long-form — same contradiction). **Next link:** founder decision §2.3.

### 4.3 The twelve real flows, traced to foundations

| FLOW | Chain summary | Real? | Foundation |
|---|---|---|---|
| FLOW-001 | register / login / reset → `profiles` | yes | F1 |
| FLOW-002 | open `/dashboard` → demo telemetry | renders; nothing is the user's | F5 F8 F10 missing |
| FLOW-003 | ask a grounded market question → `/api/archio` | yes (General) | F7 F6 |
| FLOW-004 | command bar → `/api/command` | yes (ungrounded) | F7 |
| FLOW-005 | discover communities → `groups` | yes, mock fallback, stops at join | F3 F15 |
| FLOW-006 | 16 doors navigation | yes (nav only) | — |
| FLOW-007 | watch scripted live session, resize workspace | demo | F11 missing |
| FLOW-008 | browse / "submit" forecast | submit discards | F5 missing |
| FLOW-009 | plan / "execute" trade | no save, no broker | F5 F10 missing |
| FLOW-010 | checkout → Stripe → webhook → `subscriptions` | backend yes, no UI entry | F12 |
| FLOW-011 | org → room → invite → accept | backend yes, no UI | F3 (Model B) |
| FLOW-012 | copy mentor entry → `mentor_notifications` | backend yes, unauthenticated, no reader | F9 · S1 |

---

## 5. Change log

Append-only. One line per meaningful change. Never edit an earlier line — supersede it. Format:

```
| yyyy-mm-dd | WHAT changed | WHY | APPROVED BY (Luke / Kan / both / none-operational) | AFFECTED DESIGNS (12 IDs) | AFFECTED BACKEND (13 F#/S#) | AFFECTED GROK CONTEXT (which bot, which pack section) | AFFECTED QCLAY HANDOFF | REF |
```

| Date | What changed | Why | Approved by | Affected designs | Affected backend | Affected Grok context | Affected QClay handoff | Ref |
|---|---|---|---|---|---|---|---|---|
| 2026-09-20 | Created `12-product-design-control-center.md` (678 lines): 120 control records across SH/FD/IL/MX/ED/CO/AA/AM/TP/SM/AG/MK, vocabularies, ID convention, design register, flow coverage, definition of done, counts, 15 flags | Founder request: inventory every user-facing surface before design work; eliminate ambiguity for QClay | none — operational; founders to review | all | — | none yet (packs not rebuilt by instruction) | none yet | commit `7b2aae0` |
| 2026-09-20 | Created `13-technical-backend-control-center.md` (541 lines): runtime, 14 tables, 37 routes with callers/auth posture, five Architect answers, F1–F15 foundations, AI inventory, S1–S10 security register, smallest-honest-version table, re-runnable verification method | Founder request: verify backend from code; make outside quotes decomposable | none — operational | — | all F#, S# | **Architect** must receive the five answers and the S1–S9 register (via `08` correction or a dated verification note — not yet done) | decomposition `13` §10 | commit `7b2aae0` |
| 2026-09-20 | Created this file `14-archio-master-cross-reference.md`: AI-to-AI briefing, master ID index, 12 system records × 24 fields, 20 naming conflicts, 18 duplications, trace chain, change log, 8-week runway, Lego protocol, cross-AI routing, open decisions, blockers | Founder request: connective tissue so v0 / ChatGPT / Grok / QClay stop naming the same thing differently | none — operational | — | — | all three bots: **glossary `09` §2 nine-system list is now a legacy alias set (N-20) — pending founder confirmation** | QClay must be told which map is current (N-20) | this commit |
| 2026-09-20 | ~~PROPOSED, not applied:~~ **APPLIED (DL-019, Luke + Kan, Q-21):** corrected `08` "copilot_events written from `app/api/copilot/chat`" → dead table, no writer; original wording struck through, header dated; re-verified from code (`persist.ts` sole insert, `CopilotProvider.tsx` lines 6/49 commented out) | audit finding `12` F-1 | Luke + Kan | — | `13` §3.2 | Architect pack cites `08` — now correct | — | `12` F-1 → APPLIED |
| 2026-09-20 | ~~PROPOSED, not applied:~~ **APPLIED (DL-019):** README gained "Operational control documents (not governance)" listing `12`/`13`/`14`; reading order + packs + standing facts updated | discoverability | Luke + Kan | — | — | — | — | — |
| 2026-09-20 | ~~PROPOSED, not applied:~~ **APPLIED (DL-019):** Structural Map v1 filed as **`15-structural-map-v1.md`** (Level 1 + Level 4 verbatim; §2 binding decisions; §3 superseded-map table). `09` §2 nine-system list marked LEGACY; `09` §3 all bots receive `15`; `12` §3 flag + F-9 resolved; N-20 → DECIDED | `12` F-9, N-20 | Luke + Kan | — | — | all bots (pack list) | QClay must be told `15` is current | `12` §3 |
| 2026-09-20 | **DL-020 recorded:** Community tenancy = **Model B** (organization / community → rooms / channels → memberships / access). §2.6 status / bot line / blockers / next decision, §3.2 D-1 + D-2, §6 wk 3, §9 Q-6, §10 B-2 updated. **`13` §4 F3 A/B labels were inverted vs this file — corrected in `13`** (code facts unchanged); `13` F3 VERDICT → DECIDED; `12` CO-PAGE-001 DESIGN ISSUES annotated. Repo facts preserved; no migration approved | founder decision Q-6 | Luke + Kan | CO-* | F3, D-1, D-2 | Architect: ground Model B, do not schedule migration | QClay: join / room flows designable | none new |
| 2026-09-20 | **DL-021 recorded:** Intent Loop this phase = **DESIGN SHAPE ONLY**. §2.3 backend status / decision status / blockers / next decision, §6 wk 5, §9 Q-10, §10 B-3 updated; `13` §4 F5 phase note. `09` §4 loop tasks stay parked as written | founder decision Q-10 | Luke + Kan | IL-* (design continues) | F4, F5 (no implementation) | all three: shape, not persistence | — | none new |
| 2026-09-20 | **DL-022 recorded:** Education = **COMBINATION** (dedicated learning system + contextual surfacing; creator knowledge → agents / marketplace = VISION). §2.5 status / blockers / next decision, §6 wk 7, §9 Q-15, §10 B-4 updated; `13` §4 F14 VERDICT → direction decided, shape follows FLOWS | founder decision Q-15 | Luke + Kan | ED-* (flows before screens) | F14 | Product Brain maps both sides first | — | none new |
| 2026-09-20 | **Identified, not rewritten (per founder instruction):** `09` §4 Product Brain prompt still says "the design canon (`09` §2 nine systems …)" as a source of system names; `09` §4 Architect prompt still tells the bot to "reuse … the `copilot_events` event-log pattern". Neither is *wrong* as a pattern reference, but both now point at legacy / dead material — the §2 LEGACY marker and the corrected `08` row travel with the packs, so the bots read the correction. Rewrite the prompt lines when the packs are next rebuilt | consequence of DL-019 | v0 (flag) | — | — | Product Brain, Architect | — | none new |
| 2026-09-20 | **DL-023 recorded:** public vs private = **social-style configurable privacy model**; D1 scope = public-vs-authenticated boundary only; social permission matrix = future dedicated block. §2.1 SH status / blockers / next decision, §3.1 (no change), §6 wk 1, §9 Q-1 updated; `12` SH-STATE-002 gains the rule; `13` §7 S7 / S8 owner column + §4 F2 verdict annotated. No middleware / RLS / route change | founder decision Q-1 | Luke + Kan | SH-STATE-002, SH-NAV-* | F2, S7, S8 | Architect: T1 reads S7/S8 under the boundary; Red Team: "is a public profile a leak?" now has a rule to test against | QClay: shell can assume login for the product | none new |
| 2026-09-20 | **DL-024 recorded:** zero-data first open = **GUIDED EMPTY STATE**; demo-as-yours and mandatory onboarding rejected (`01` rejected table). §2.2 FD status / blockers / next decision, §6 wk 1, §9 Q-2; `12` FD-STATE-002 / 003 → DECIDED, to be designed in D1 | founder decision Q-2 | Luke + Kan | FD-PAGE-001, FD-STATE-002/003 | — (no data model implied) | Product Brain: day-1 zero-data problem now framed | QClay: the missing state QClay's landing needed is now defined | none new |
| 2026-09-20 | **DL-025 recorded:** Flight Deck keeps the **four-category command-centre model**; the four are a navigation abstraction, **not** the seven systems and **not "rooms"** — working term **zones**; names provisional, D1 inspects fit; `/cockpit` rename deferred, name open. §2.2 FD, §3.1 N-7 → direction decided, N-10 → partly resolved, §6 wk 1, §9 Q-3; `12` FD-NAV-001 + F-10 annotated; `15` §3 Room Navigator row rewritten | founder decision Q-3 | Luke + Kan | FD-NAV-001, ED-PAGE-001 | — | all bots: say "zones" for the Flight Deck four, "rooms / channels" only for Community | QClay: legacy 01.x navigation names stay for now | none new |
| 2026-09-20 | **D1 opened as INSPECTION + DESIGN-DEFINITION** (founder order: no product code, no T1, no unrelated redesign). Lego Block 1 sheet filed at `docs/lego/D1-block-1-front-door.md` and issued in chat; screenshots to be preserved under `docs/screens/SH/` + `docs/screens/FD/`. **Two doc-drift corrections from the inspection:** `12` FD-NAV-001 + SH-STATE-002 said `/hub` was login-gated — its guard was removed July 2026 (code comment), verified 200 signed-out; zero existing routes are gated | D1 start | v0 → Luke + Kan | SH-NAV-*, FD-PAGE-001, FD-NAV-001, FD-STATE-002/003 | S7 (scope confirmed: nothing real is gated) | — | — | none new |
| 2026-09-20 (2nd session) | **Ledger vocabulary extended:** entries may tag lines DECIDED · OPEN · FOUNDER DIRECTION · DEMO/SIMULATION · FUTURE/VISION (`01` header). **DL-026 recorded:** signed-out = product-first exploration (TradingView-like), identity asked at the moment of need; philosophy DECIDED, exact limits OPEN; "login wall on arrival" → rejected table. §2.1 SH status / next decision; `12` SH-STATE-002 (boundary per action / data); `13` S7 fix column | founder answers to the D1 sheet, item 1 | Luke + Kan | SH-STATE-002, SH-NAV-* | S7 (rule refined; no change) | all three (D1 packs) | QClay: no login wall in the shell | none new |
| 2026-09-20 (2nd session) | **DL-027 recorded:** login and registration both land in the Dashboard / Flight Deck workspace — direction DECIDED, routes unchanged (today `/` and `/copilot`, re-verified). §2.1, §2.2; `12` SH-PAGE-001/002, FD-PAGE-001 | D1 sheet item 2 | Luke + Kan | SH-PAGE-001/002, FD-PAGE-001 | — | Product Brain, Red Team (journey), Architect (`?from` detail later) | — | none new |
| 2026-09-20 (2nd session) | **DL-024 addendum:** guided empty state reconfirmed; short optional post-sign-in tutorial = FOUNDER DIRECTION; full tutorial design = OPEN / later block. **DL-028 recorded (FOUNDER DIRECTION):** Ask Archio guides exploration conversationally; may encourage login / register at the moment of need. §2.2, §2.7; `12` FD-STATE-002, AA intro | D1 sheet items 3–4 | Luke + Kan | FD-STATE-002, AA-AI-001/002 | — | Product Brain (no onboarding design), Architect (no AI work scheduled) | — | none new |
| 2026-09-20 (2nd session) | **DL-029 recorded:** face scan = **DEMO/SIMULATION** (timers + `face-auth-user`, no session, re-verified); real secure authentication = FOUNDER DIRECTION; KYC / account integrity = OPEN; **five concepts never merged** (authentication · biometrics / passkeys · email / phone confirmation · KYC · duplicate-account prevention). §2.1; `12` SH-PAGE-001; `13` F1 note; rejected table ×2; inbox Q-25, Q-27 | D1 sheet item 5 | Luke + Kan | SH-PAGE-001 | F1 (no change) | Architect (auth direction, no implementation) | — | none new |
| 2026-09-20 (2nd session) | **DL-023 addendum:** Instagram-familiar configurable visibility recorded (public / connections / deliberately shared / never-shared private); permission matrix still a later block. §2.1 | D1 sheet item 6 | Luke + Kan | SH-*, AM-* | F2 (no change) | Red Team (privacy leak tests) | — | none new |
| 2026-09-20 (2nd session) | **DL-030 recorded:** workspace = highly customisable trader workspace (FOUNDER DIRECTION; mentor-resold configurations = FUTURE/VISION); name Dashboard / Flight Deck / Command Center = **OPEN**; "Your Space" / "Trading Terminal" not authoritative. §2.2 CANONICAL NAME annotated, §3.1 N-7 widened; `12` FD-PAGE-001; inbox Q-26 | D1 sheet item 7 | Luke + Kan | FD-PAGE-001 | — | all three: do not pick a name | QClay: no final name yet | none new |
| 2026-09-20 (2nd session) | **DL-025 addendum:** zone model DECIDED (kept, provisional); zone names + placement of the 16 destinations **OPEN for Product Brain review**; do not rename / move; not rooms. §2.2, §3.1 N-10, §9 Q-24, §10 B-11; `12` FD-NAV-001; `15` §2 | D1 sheet item 8 | Luke + Kan | FD-NAV-001 | — | **Product Brain next task; Red Team challenge** | — | none new |
| 2026-09-20 (2nd session) | **Grok packs rebuilt (v3, D1)** at `public/docs/grok/ARCHIO-GROK-STARTER-PACK/` — role-specific extracts instead of full copies of `12`/`13`/`14`: COMMON = governance · glossary · ledger · `11` · `15` · `08` · README index · **new `00-CURRENT-STATE-2026-09-20.md`** (phase, D1 status, DECIDED / OPEN / DIRECTION / DEMO tables, superseded maps); Product Brain + Red Team + Architect each get one D1 context extract; loop-era files (`02` `03` `10` `05` `06` `00` excerpts, three problems, Owen note, 16 Aug audit) moved to `04-PARKED-LOOP-REFERENCE/`. `09` §3 pack lists + §4 prompts re-set for D1 (19 Sep structural task = COMPLETED via `15`; 17 Sep loop tasks still parked). **Two outdated prompt lines corrected** (Product Brain "nine systems design canon" → `15`; Architect "reuse the `copilot_events` event-log pattern" → dormant / dead pattern). **§8 contradiction resolved:** the Architect now receives a dated extract of `13` §3 + §7 as its verification note | founder request | Luke + Kan (request) · v0 (build) | — | — | all three packs | QClay: none | `09` §3–4; `08` |
| 2026-09-22 | **DL-031 recorded — PROVISIONAL D1 DESIGN DIRECTION (new ledger label; Luke approves, Kan's asynchronous review pending — NOT joint approval).** Four zones survive the Product Brain / Red Team reconciliation: MARKET FLOOR (Intelligence · Daily Brief · Live Calls) · TRADING DESK (reversible; ONE Forecasts · Copilot · Post-Mortem) · THE ACADEMY (reversible; Education + honest Compare / Mentor AI shells) · THE COLLECTIVE (Communities · The Floor · Collab Hub; Marketplace = FUTURE home). Global chrome (Ask Archio · Nexus absorption candidate · account / avatar chrome · Flight Deck customisation) not forced into zones. Centralized / Decentralized = FUTURE/VISION, UX OPEN, no literal toggle. §2.2, §2.7, §2.10, §3.1 N-6 / N-7 / N-8 / N-10 + **N-21 (Trading Desk name collision)**, §3.2 **D-19 (Nexus vs Ask Archio)**, §6.1 D1, §9 Q-24 → provisional + **Q-28**; `12` FD-NAV-001 (surviving-direction table; code table kept), MX-PAGE-003, SM-SECTION-001; `15` §2 + §3; `09` §2, §3, §4.1 (Product Brain D1 task COMPLETED); README; `01` rejected table ×5. **No product code; `FLIGHT_DECK_ROOMS` untouched.** | founder statement 22 Sep after the bot reconciliation | Luke (approved) · Kan (async) | FD-NAV-001, FD-SECTION-002, MX-PAGE-003, SM-SECTION-001 | — | Product Brain: D1 zone task complete — do not re-run; Red Team: challenge N-21 + the honest-shell rule; Architect: none | QClay: zone labels are provisional — do not ship them | **none new — packs v3 STALE (zone names; Product Brain ★ NEXT TASK complete) but not materially incorrect about code; rebuild waits for a founder-approved reason (§7.2)** |
| 2026-09-22 | **D1 Lego Block 2 OPENED as DESIGN-DEFINITION** (Luke's order; no product code; T1 not started; no bot asked): `docs/lego/D1-block-2-first-use.md` — the signed-out product-first experience + the guided zero-data first Flight Deck experience, defined for three user states (A signed-out explorer · B brand-new signed-in zero-data · C returning signed-in with real data). Sheet carries: exact design target · the DECIDED / DIRECTION / PROVISIONAL / OPEN inputs · eight repo-grounded surfaces · five screenshots · must-not-touch · definition of done. `12` FD-STATE-002 / 003 + SH-STATE-002 gain pointers; Block 1 sheet DoD updated | D1 sequence (Block 1 inspection complete in substance) | Luke (order) · Kan (async) | SH-STATE-002, SH-PAGE-001/002, SH-NAV-001, FD-PAGE-001, FD-NAV-001, FD-STATE-002/003, AA-AI-001/002 | S7 (list being written; no change) | none sent — founder order | QClay: none | none new |

---

## 6. The 8-week founder runway

**What this is:** a practical *sequence* of Lego blocks for Luke + Kan working with v0, ChatGPT and the three Grok bots. **What it is not:** a schedule. Week numbers are a reading order, not a promise; a block that takes three days or three weeks is still the same block. Blocks run in two lanes — **D** (product/design) and **T** (technical learning) — and one D and one T block are open at a time, never more.

**Exit state at the end of the runway** (from the founders' brief, restated as checkable lines):

```
PRODUCT / DESIGN                                          TECHNICAL
[x] Structural Map v1 filed (15, DL-019) [ ] mature (L2–3)   [ ] every 13 §2 row re-verified once by founders reading it
[ ] FLOW-001…012 + the missing loop flows mapped           [ ] F1–F15 each has a founder-readable one-paragraph explanation
[ ] every 12 record has a dated screenshot                 [ ] major missing systems named (F4 F5 F8 F9 F10 F11 F14) with a founder yes/no/later
[ ] major missing screens listed (12 §9.2 tail + STATEs)   [ ] AI vs deterministic decided per system (13 §5 table filled)
[ ] design language: one token base chosen (D-14)          [ ] integration list fixed: Polygon · TradingView · Stripe · Supabase · broker=CSV
[ ] each Level-1 page worked once with v0 (D1–D7)          [ ] Owen/TradeLocker question sheet final (13 §10 a–d)
[ ] both approval columns set on every record              [ ] outside quote decomposed into 13 §10's nine units, each with a founder "in/out"
[ ] docs/screens/ organised by system                      [ ] S1–S9 either fixed or explicitly accepted
[ ] QClay pack = FOUNDER APPROVED FUNCTION / QCLAY VISUAL POLISH list
```

### 6.1 Block sequence

| Wk | Lane D — product / design block | Lane T — technical learning block | Founder decisions the week forces |
|---|---|---|---|
| **1** | **D1 · The Front Door** — `SH-NAV-001/002/003`, `FD-PAGE-001`, `FD-NAV-001`, `FD-STATE-002/003`: *what a real trader with zero data sees on first open* — **now fixed: GUIDED EMPTY STATE (DL-024)**. Also ~~rules on room names (N-7, N-10)~~ → **name-fit inspection of the four zones (DL-025: keep provisionally, inspect fit; `/cockpit` rename deferred)**. Runs as an INSPECTION + DESIGN-DEFINITION block first (Lego sheets), product code untouched until founders approve a sheet. | **T1 · The one real vertical slice** — `/register` → Supabase Auth → `profiles` row → `/api/users/me`: learn *table, row, policy, route, client* on the only slice that is real end to end (F1). Read S7, S8 with the DL-023 boundary in hand. **Not started (founder order).** | ~~Which pages need login? Public profiles? Empty state vs labelled demo? Room names.~~ → DL-023 / DL-024 / DL-025 (20 Sep). Now: tick the route-by-route login list D1 proposes; per-zone keep / rename-for-fit after inspection. **22 Sep: Block 1 inspection complete in substance; zone fit → DL-031 PROVISIONAL (Luke; Kan async, Q-28); Block 2 = first-use design-definition (signed-out explorer · zero-data new user · returning user) OPEN — `docs/lego/D1-block-2-first-use.md`. Still no code, no T1.** |
| **2** | **D2 · Market Experience honesty** — `MX-PAGE-001` (mock → the existing snapshot route), `MX-SECTION-003` (dead `/api/market/stats`), decide `/` after login, TradingView stance (F-7). | **T2 · What an API route costs** — F6 gateway: read `/api/polygon/*`, learn auth + cache, decide S5/S6 (auth on LLM + market proxies). | `/` after login? TradingView stays as a feature? Auth on proxies? |
| **3** | **D3 · Community: from discovery to join** — `CO-PAGE-001`, `CO-STATE-001` (join), `CO-STATE-003` (detail page); triage the 13 hub views + 5 example rooms (keep / kill). | **T3 · Tenancy** — F3 **Model B (decided, DL-020)** walkthrough on the real SQL: `orgs → rooms → memberships → invites`; what a migration off the three `groups` DDLs (D-1) would touch — **learning only, no migration until separately approved**; migration discipline (`13` §10 unit 2). | ~~The tenancy decision~~ → DL-020. What "Opportunity" means (N-6, Q-7). Room names (Q-3). |
| **4** | **D4 · One Ask Archio** — `AA-AI-001` vs `AA-AI-002` canon (N-2), retire or define Oracle / Jarvis / Nexus AI / Mentor AI (N-8), `AA-STATE-001…004` (streaming · error · assistance style · consent). | **T4 · Grounded AI pattern** — F7: read `/api/archio` router → contract → registry; fill the AI-vs-deterministic table (`13` §5) per system; quota design. | Which surface is Ask Archio? What is AI, what is arithmetic, per system. |
| **5** | **D5 · Intent Loop experience** — reconcile Forecast Hub / Copilot / Scenario (N-11, D-9, D-12) into one capture *shape* per DL-012 — **design only (confirmed: DL-021, design shape only this phase)**. `IL-STATE-001/002`. | **T5 · The loop's data, read-only** — F4/F5: what `decision_records` / `trades` / `decision_reviews` would be (Architect parked spec as reading material), `lock_lead_seconds`, provenance. **No implementation (DL-021).** | ~~Un-park the bounded loop?~~ → DL-021: no. Which UI, if any, becomes capture (Q-11). |
| **6** | **D6 · Account / Money** — real `/profile` over `profiles`, `AM-STATE-001` settings, `AM-STATE-002` billing UI decision, `AM-STATE-005/006` privacy + delete/export. **Guard rail F-8: no org admin UI.** | **T6 · Backend without a front door** — F12 billing + F1 wiring walkthrough; TS burn-down policy (S10: block new errors, schedule 483 → 0). | Portfolio / Net Worth inside AM? Ship settings + billing this phase? Plans and prices. |
| **7** | **D7 · Education flows + Live Room / hub triage** — `ED-*`: the definition is **decided (DL-022, combination)**; map the two sides (learning system · contextual surfacing) as flows before any screen; `CO-PAGE-003` Live Room approval pass; `CO-PANEL-003` notifications design as an F9 consumer. | **T7 · Live + notify requirements** — F11 provider question (audio/video/stream), F9 as F4 consumer, S1/S4 fixes; **finalize the Owen / TradeLocker question sheet** (`13` §10). | ~~What Education is~~ → DL-022. Live provider direction. Owen questions signed off. |
| **8** | **D8 · The Screens Book** — every `12` record has a dated screenshot and both approval columns set (APPROVED or CHANGES REQUESTED with reason); assemble the QClay pack: **FOUNDER APPROVED FUNCTION / QCLAY VISUAL POLISH** list + "not yet" list + which map is current (N-20). | **T8 · The quote, decomposed** — `13` §10's nine units, each with scope, foundation, founder in/out, and what QClay's "AI excluded" now means (harden F7). Architect grounding round complete. | Which units go outside; which stay with v0; what QClay is asked to polish. |

**Weekly rhythm (every week, both lanes):** Monday — pick the block, ChatGPT prepares the session sheet (§7.1) from these documents · mid-week — v0 does, founders answer fill-in-the-blanks · Friday — v0 updates the records, ChatGPT writes the Context Delta (§7.2), Luke pastes the ≤ 5 bullets to the bot that needs them (`09` §5 flow).

**Why D1 is the Front Door and not the biggest page.** The shell multiplies every inconsistency (`12` §4); the empty state is the single most important missing state (`FD-STATE-003`); the room names are the first naming decision that unblocks four others (N-7, N-9, N-10, N-19); and QClay's landing work is blocked on exactly this surface existing. It is also *small*: three nav records, one page record, one navigator, two states.

**Why T1 is the auth slice and not the security fixes.** Luke and Kan need to know what a table, a policy, a route and a client are *before* they can be quoted for nine units of them. FLOW-001 is the only place all four exist and work. The security fixes (S1–S9) come immediately after, as the first thing they watch v0 change (T2/T3/T7).

### 6.2 What the runway deliberately does not do

- It does not implement F4/F5/F8–F11 or the bounded loop. Those are decisions, not builds, in this phase (DL-018).
- It does not design UI for orgs/rooms/memberships (F-8).
- It does not rename routes or components (§3.3 step 4).
- It does not rebuild the three Grok context packs; it produces Context Deltas (§7.2) and *proposes* pack edits in §5.
- It does not touch `00`–`11` except through founder-approved DL entries.

---

## 7. Lego session protocol

### 7.1 Session sheet (ChatGPT prepares; v0 fills the "does" and "updated" lines; founders answer)

```
CURRENT BLOCK          D3 · Community: from discovery to join           (one block ID from §6.1)
WHAT WE ARE LOOKING AT CO-PAGE-001 /communities · components/communities/DiscoveryEngine.tsx ·
                       CO-STATE-001 (no UI) · 13 §4 F3 · 13 §2.2 groups (×3 DDL) · FLOW-005
WHAT FOUNDERS ANSWER   1. Tenancy model: [ ] A groups  [ ] B orgs/rooms  [ ] merge: ____
                       2. "Opportunity" means: ______________________
                       3. Of the 13 hub views, keep: [ ] … [ ] …   kill: [ ] … [ ] …
                       4. Join is: [ ] one tap  [ ] request → approve  [ ] invite only
WHAT V0 DOES NEXT      after answers: design CO-STATE-001 join state on the chosen model; write the
                       CO-STATE-003 detail page record; verify which groups DDL is live (needs DB access)
WHAT NEEDS SCREENSHOTS CO-PAGE-001 default + empty-results + mock-fallback (3) → docs/screens/CO/
WHAT GETS UPDATED      12 §5.5 records CO-PAGE-001, CO-STATE-001/003 · 13 §4 F3 status · 14 §2.6,
                       §3.1 N-6, §5 change log · Context Delta → Architect (F3), Red Team (hub scope)
DEFINITION OF DONE     tenancy decision recorded as DL-0xx · both founders set LUKE/KAN on CO-PAGE-001 ·
                       join flow has a record with a route and a sketch · screenshots attached · delta sent
```

Rules: one block open per lane · questions are fill-in-the-blank or accept/change, never essays · if a question cannot be answered, it becomes a **BLOCKER** (§10) and the block narrows, it does not stall · a session sheet never contains more than **five** founder questions.

### 7.2 Context Delta (written at the end of each completed block; ≤ 40 lines)

```
CONTEXT DELTA · <date> · block <ID> · written by ChatGPT from 12/13/14 · verified by v0
WHAT WAS LEARNED       facts found (cite 12/13 records or "v0 verified <date>")
WHAT CHANGED           records/statuses changed (IDs), decisions made (DL-0xx)
WHAT FOUNDERS DECIDED  the fill-in-the-blank answers, verbatim
WHAT REMAINS OPEN      questions carried to §9; new BLOCKERS in §10
SCREENSHOTS / FILES    paths under docs/screens/, files touched
WHAT EACH AI NEEDS     v0: … · Product Brain: … · Red Team: … · Architect: … · ChatGPT: … · QClay (later): …
```

The delta is the **only** thing pasted to a bot after a block. Packs (`09` §3) are rebuilt only when §5 accumulates a founder-approved reason.

---

## 8. Cross-AI routing — who needs what

| Reader | Receives | Never receives | Uses it to |
|---|---|---|---|
| **v0** | everything; owns `12`/`13`/`14` edits and `08` corrections | — | verify against code, build in later phases, keep records honest |
| **ChatGPT** (drafting assistant, DL-015, outside the ledger) | `14` §0, §1, the §2 record and §3 rows for the current block; `12`/`13` records named in the session sheet | founder approval authority; the whole of `12`/`13` at once | prepare the session sheet (§7.1), draft the Context Delta (§7.2), translate founder answers into DL-entry drafts for founders to paste |
| **Grok Product Brain** (maps) | `09` §3 pack + the delta; the §2 record for a system whose *definition* is open (ED, CO "Opportunity", AM scope, AA "personal") | `13` internals, code paths, MK | keep the structural map honest: problem · journey position · connections per system; propose alias resolutions for founders (never decide) |
| **Grok Red Team** (challenges) | `09` §3 pack + the delta; §3.1 and §3.2 in full (duplicates and disconnected features are its target); `12` §9 flows | approval status; MK | attack the map: pairs that are one thing under two names, systems with no problem, flows a trader would need that do not exist |
| **Grok Architect** (grounds) | `09` §3 pack + the delta; `13` §3 five answers, §4 F1–F15, §7 S1–S10 as a **dated v0 verification note**; the §2 DATA / BACKEND / AI / INTEGRATION fields | `12` visual fields; anything not in `08` or a dated note | ground the map: boundaries, objects, integrations, AI vs deterministic, exists vs demo, NEEDS-V0-VERIFICATION list |
| **Luke · Kan** | the session sheet; the §9 open-decisions list; screenshots | nothing withheld | decide; set approval columns; write DL entries |
| **QClay** (eventually) | `12` records marked FOUNDER APPROVED + their QCLAY POLISH ITEMS; the §1 index; the current map statement (N-20); `13` §10 decomposition | `13` security register, bot packs, `00`–`11`, memory files, anything NOT REVIEWED | polish approved function; quote decomposed units |

**Three rules that keep this from becoming context chaos:**
1. **Cite, don't paste.** A bot is told "`12` CO-PAGE-001 is PARTIAL (real `groups` read, mock fallback)" — not handed the file.
2. **One delta per block.** Nothing goes to a bot between deltas.
3. **Names come from §1/§2.** If a bot uses a §3.1 alias, ChatGPT corrects it in the next delta and does not propagate it.

**Contradiction with `09` §3 to be aware of:** the Architect's pack says its "only source of code facts is `08` and dated v0 verification notes". `13` is a dated v0 verification note in all but filename. Until founders decide whether `13` is *added* to the Architect pack or its findings are *copied into `08`*, the Architect should receive `13` §3 + §7 as a verification note titled `verifications/2026-09-20-backend-control-center.md` (a copy, not a new source). ~~**Proposed in §5; not done.**~~ **DONE 20 Sep 2026 (second session, pack v3):** the Architect pack carries `03-ARCHITECT/D1-TECHNICAL-CONTEXT-architect-2026-09-20.md`, a dated v0 verification extract of `13` §2–§4, §7 and §3.2 (tables, routes, F1–F15 verdicts, S1–S10, the `copilot_events` dormant-pattern rule) — a copy, not a new source; `08` remains the short-form authority.

---

## 9. Open decisions register (the founder inbox, ordered by what each unblocks)

Fill-in-the-blank. Each line names the block it unblocks and the record(s) it changes. Answered lines move to `01` as DL entries and are struck through here with the DL number.

| # | Decision | Unblocks | Changes | Form |
|---|---|---|---|---|
| ~~Q-1~~ | ~~Which pages require login; are profiles public by default?~~ **CLOSED → DL-023: social-style configurable privacy model** — personalised product behind login; public / marketing / auth / help may be signed-out; profile = public layer + user-controlled social layer + always-private account / intelligence layer; **D1 = boundary only**, permission matrix later. *Residual, not a decision:* founders tick the route-by-route list D1 proposes | D1, T1, S7, S8 | SH-STATE-002, F2 | **[x] configurable** — list of routes: D1 output |
| ~~Q-2~~ | ~~Zero-data first open: guided empty state / labelled demo / onboarding first?~~ **CLOSED → DL-024: GUIDED EMPTY STATE** (real Flight Deck, no fake personal numbers, optional gradual configuration, lightweight guide allowed, onboarding system not invented in D1) | D1, FD-STATE-002/003 | FD-PAGE-001 | **[x] guided** [ ] demo [ ] onboarding |
| ~~Q-3~~ | ~~Room names — keep MARKET FLOOR / STUDIO / MENTOR HALL / COLLECTIVE, or align to the seven systems? Rename `/cockpit`?~~ **CLOSED → DL-025: KEEP the four-category command-centre model for now** — a navigation abstraction, not the seven systems; names provisional, D1 inspects fit; working term **zones**, not rooms; `/cockpit` rename recorded for later, name open | D1, N-7, N-10 | FD-NAV-001, ED-PAGE-001 | **[x] keep (provisional)** · `/cockpit`: rename later, name ____ |
| Q-4 | `/` after login: Signal Terminal (real) / redirect to Flight Deck / lighter page? TradingView stays as the chart? | D2, F-7, F-11 | MX-PAGE-001, MX-SECTION-004 | [ ] [ ] [ ] · [ ] yes [ ] later |
| Q-5 | Auth + quota on LLM and market proxies now? | T2, S5, S6 | F6, F7 | [ ] yes [ ] accept risk until real users |
| ~~Q-6~~ | ~~**Tenancy: Model A `groups` / Model B `orgs → rooms` / merge?**~~ **CLOSED → DL-020: Model B** (organization / community → rooms / channels → memberships / access; Model A superseded for design; migration needs separate approval) | D3, T3, FLOW-005 join, CO-STATE-001/002/003 | F3, D-1, D-2 | [ ] A **[x] B** [ ] merge |
| Q-7 | What does "Opportunity" mean in Community & Opportunity; is it the seed of SM? | D3, N-6 | §2.6, §2.10 | ____ |
| Q-8 | Which surface *is* Ask Archio; are Oracle / Jarvis / Nexus AI / Mentor AI the same thing? | D4, N-2, N-8, N-9 | AA-AI-001…008 | [ ] bar [ ] engine [ ] merged · retire: ____ |
| Q-9 | AI vs deterministic per system (`13` §5 table) | T4 | every §2 AI DEPENDENCY | table |
| ~~Q-10~~ | ~~**Un-park the bounded loop in this phase?**~~ **CLOSED → DL-021: design shape only** (fit · UX / shape / flows · data-model learning; no persistence / backend implementation) | D5, T5, `09` §4 parked tasks | IL-*, F4, F5 | [ ] yes **[x] design shape only** [ ] defer |
| Q-11 | Which UI (if any) becomes Decision-Record capture: Forecast Hub / Copilot / Scenario / none? | D5, N-11, D-9, D-12, F-6 | IL-PAGE-001/002, IL-SECTION-002 | [ ] [ ] [ ] [ ] new one-tap |
| Q-12 | Does Account / Money absorb Portfolio (06) and Net Worth (07)? | D6, N-4 | §2.8 | [ ] sections [ ] future L1 [ ] VISION |
| Q-13 | Ship real settings + billing UI this phase? Plans and prices? | D6, T6 | AM-STATE-001/002, F12 | [ ] yes [ ] no · prices: ____ |
| Q-14 | Theme count: 1 / 2 / 7? One token base (D-14)? | D6–D8, `12` §8.14 | FD-NAV-003, every page | [ ] [ ] [ ] · base: ____ |
| ~~Q-15~~ | ~~**What is Education in ARCHIO?**~~ **CLOSED → DL-022: combination** (dedicated learning system + contextual surfacing across Community / Ask Archio / Flight Deck / onboarding; creator knowledge → agents / marketplace = VISION) | D7 | ED-*, F14 | [ ] courses [ ] mentor method [ ] contextual **[x] combination** |
| Q-16 | Live provider direction (audio / video / stream / none this year)? | T7, F11 | CO-PAGE-003 | ____ |
| Q-17 | Is `/history` "Catch Me Up"? Is Active Window "Morning Brief"? Is Session debrief "Trade Review"? | D7, N-15, N-16, N-17 | CO-PAGE-002, FD-SECTION-001, FD-STATE-001 | yes/no ×3 |
| Q-18 | Canonical names: Passport vs Verified Track Record; trader vs student/member/user; mentor vs creator | N-5, N-12, N-13 | aliases everywhere | ____ |
| Q-19 | Which landing survives; hide internal routes behind login? | D8, F-12 | MK-PAGE-001/002, MK-PAGE-006/008 | [ ] [ ] [ ] · [ ] yes [ ] no |
| ~~Q-20~~ | ~~File the Structural Map v1 in Source of Truth; mark `09` §2 nine systems as legacy; tell QClay which map is current~~ **CLOSED → DL-019** (filed as `15`; `09` §2 marked LEGACY). *Residual action, not a decision:* tell QClay `15` is current (D8 pack) | everything (N-20, F-9) | `09`, README, QClay | **[x] yes** |
| ~~Q-21~~ | ~~Approve the three PROPOSED housekeeping edits in §5 (`08` correction · README index · verification note for Architect)~~ **CLOSED → DL-019: all three applied** (`08` corrected · README section · Structural Map v1 filed as `15`) | Architect accuracy | `08`, README, `09` | **[x] yes** [ ] no |
| Q-22 | Which of `13` §10's nine units go outside (QClay/engineers) and which stay with v0? | T8 | quote | in / out ×9 |
| Q-23 | **Exact signed-out limits (DL-026):** which public product surfaces / gadgets are explorable signed-out, and which actions trigger the login / register ask? (D1 proposes the route + action list) | D1 Block 2, S7 | SH-STATE-002, FD-PAGE-001 | list — tick per surface / action |
| Q-24 | **Zone names + placement of the 16 destinations (DL-025 addendum):** after the Product Brain's evaluation and the Red Team's challenge — per zone keep / rename-for-fit; per door keep / move. **→ PROVISIONAL D1 DESIGN DIRECTION, DL-031 (Luke, 22 Sep 2026):** MARKET FLOOR (keep) · THE STUDIO → **TRADING DESK** (reversible) · MENTOR HALL → **THE ACADEMY** (reversible) · THE COLLECTIVE (keep); doors per `12` FD-NAV-001 second table (16 → 10 + 2 shells; Nexus / My Profile / Controls → chrome; Forecasts merged). **Not struck through:** Kan's review pending (Q-28); names reversible | D1 Block 2 | FD-NAV-001 | per zone **[x] provisional** · final tick after Kan: [ ] confirm [ ] change |
| Q-25 | **KYC / account-integrity requirement (DL-029):** is stronger identity verification required, for whom, and when? (separate from authentication, biometrics, email / phone confirmation) | later auth block | SH-PAGE-001, F1 | [ ] none now [ ] at signup [ ] at first payout / social feature [ ] other: ____ |
| Q-26 | **Visible name of the central workspace (DL-030):** Dashboard / Flight Deck / Command Center — one name for tab title, nav label, greeting? ("Your Space" / "Trading Terminal" are not options unless revived) | D1 Block 2, N-7 | FD-PAGE-001, SH-NAV-001 | [ ] Dashboard [ ] Flight Deck [ ] Command Center [ ] keep several with defined roles: ____ |
| Q-27 | **Fate of the face-scan UI (DL-029 classified it DEMO/SIMULATION; Lego Q3 left unticked):** remove from the front door until real / keep as a visual but disable the fake "verified" path / keep as is | D1 Block 2 | SH-PAGE-001 | [ ] remove [ ] disable fake path [ ] keep |
| Q-28 | **Kan's asynchronous review of DL-031 (four-zone PROVISIONAL D1 DESIGN DIRECTION) and of the D1 Block 2 opening:** confirm or change per zone — names explicitly reversible (TRADING DESK ↔ Workbench / Studio; THE ACADEMY ↔ an education-oriented alternative) — and resolve **N-21** (zone "Trading Desk" vs the chart + execution surface "Trading Desk"). Until ticked, every citation of DL-031 says *provisional (Luke)* | D1 Block 2 → the first code block | FD-NAV-001, FD-SECTION-002 | [ ] confirm as is [ ] change: ____ · N-21: [ ] rename the zone [ ] rename the surface [ ] accept both |

---

## 10. Blockers register

| # | Blocker | Blocks | Kind | Owner | Way through |
|---|---|---|---|---|---|
| ~~B-1~~ | ~~Structural Map v1 not in the repo~~ **RESOLVED 20 Sep 2026 — filed as `15` (DL-019).** Levels 2–3 still unwritten (maturity, not a blocker) | citation of levels; QClay alignment | governance | — | residual: tell QClay `15` is current (D8) |
| ~~B-2~~ | ~~Tenancy undecided (F3)~~ **RESOLVED — Model B (DL-020).** Join / create / detail design unblocked. *Not resolved by it:* D-1 collapse — a migration needs its own approval (B-6) | ~~join / create / detail design~~; D-1 collapse | decision → technical (B-6) | Luke + Kan (migration approval) | B-6 when the founders approve a migration |
| ~~B-3~~ | ~~Bounded loop parked~~ **RESOLVED as a decision — DL-021: design shape only this phase.** Implementation stays parked *by choice*, so it no longer blocks D5 (design) or T5 (read-only learning); it blocks only persistence, which is out of phase | ~~any IL persistence~~ (out of phase); Architect three-table spec remains reading material | decision | — | revisit after the FLOWS phase |
| ~~B-4~~ | ~~Education undefined~~ **RESOLVED — combination (DL-022).** ED screens now wait on the Education *flows* (D7), not on a definition | ~~every ED screen~~ → ED flows first | decision → design sequencing | Product Brain (map) → founders (review) | D7 |
| B-5 | Live DB state unverifiable from repo | which `groups` DDL is applied; whether `006` seed ran | access | v0 needs DB access (Supabase MCP or read query) | grant access; v0 writes a dated verification note |
| B-6 | No migration discipline | any schema change safely | technical | v0 (after Q-6) | `13` §10 unit 2 |
| B-7 | S1–S4 open writes | putting any real trader data in | security | v0 (small) | fix in T2/T3/T7; none touched by these documents |
| B-8 | 483 TS errors hidden | trusting "it renders" | technical debt | v0 | policy in T6 (block new; schedule burn-down) |
| B-9 | Broker data absent (F10) | every real number on Flight Deck; COMPARE | integration | CSV first (Architect rule); Owen read-only later | T7 question sheet |
| B-10 | No live transport (F11) | Live Room being real | integration | provider choice (Q-16) | T7 |
| B-11 | ~~Four naming layers (N-20)~~ **Reduced (DL-019):** one current map (`15`); nine-system list = legacy aliases; QClay map = legacy page IDs. Remaining layer: ~~Room Navigator rooms vs the seven systems (Q-3, N-7)~~ → zones are *not a map* by decision (DL-025); what remains is zone-fit (Q-24, Product Brain review) and the workspace's visible name (Q-26, DL-030) | every cross-AI conversation | naming | Luke + Kan | Q-24, Q-26; §3.3 |
| B-12 | No founder approval recorded anywhere | QClay handoff | process | Luke + Kan | D1 onward: set two columns per record |

---

## Appendix A — Matrix field definitions (§2)

| Field | Definition | Allowed values / form |
|---|---|---|
| CANONICAL NAME | the one name to use | from `11`, `01` DECIDED, Structural Map v1, or `12` |
| ALIASES / LEGACY NAMES | every other name seen for the same thing, with where it lives | free text; each alias traceable to §3.1 |
| STRUCTURAL MAP LEVEL | Level 1 (seven systems) · Level 4 / VISION · outside (SH, MK). Levels 2–3 are **not defined in any repo document** (B-1); sub-features are written as record IDs, not levels | L1 · L4/VISION · outside |
| OWNER SYSTEM | the one Level-1 system; `OWNER: PROPOSED` if arguable | system code |
| USER-FACING SURFACES | `12` record IDs | IDs |
| IMPORTANT SUBFEATURES | what a founder would list if asked "what's in it" | short list |
| ROUTES / COMPONENTS | exact paths | paths |
| ASSOCIATED DATA | tables that exist; objects that should | table names · `MISSING` |
| TECHNICAL FOUNDATIONS | `13` §4 F# with its status | F# (REAL / PARTIAL / MISSING) |
| AI DEPENDENCY | real endpoint + model, or `none`, or `should be deterministic` | per `13` §5–§6 |
| INTEGRATION DEPENDENCY | external systems | Polygon · TradingView · Stripe · Supabase Auth · AI Gateway · broker |
| PRIVACY / PERMISSION SENSITIVITY | Low / Medium / High / Highest, with the reason | scale + reason |
| CURRENT DESIGN STATUS | `12` §1.1 vocabulary, may list several | vocabulary |
| CURRENT FUNCTIONAL STATUS | `12` §1.2 vocabulary | vocabulary |
| CURRENT BACKEND STATUS | REAL / PARTIAL / MISSING / BACKEND-READY (exists, no UI) / dead | `13` §1 vocabulary |
| FOUNDER DECISION STATUS | DL entries that bind it; what is undecided | DL-0xx · "undecided: …" |
| LUKE REVIEW · KAN REVIEW | one column each | NOT REVIEWED · CHANGES REQUESTED · APPROVED |
| QCLAY RELEVANCE | legacy `0N.n` mapping and what QClay may receive | legacy IDs + note |
| GROK BOT RESPONSIBLE (planning) | which bot's *first task* (`09` §4) touches it | Product Brain · Red Team · Architect · none |
| SOURCE-OF-TRUTH REFERENCES | file + section | `NN` §n |
| SCREENSHOTS / REFERENCE LINKS | `docs/screens/<SYSTEM>/…` paths | paths · "none yet" |
| BLOCKERS | §10 items or free text | B-# |
| NEXT REQUIRED DECISION | one fill-in-the-blank question | form |

## Appendix B — Reading order for a new human

1. `README.md` standing facts → 2. `11` (scope + phase) → 3. this file §0 → 4. `12` §3 (map → code) and §11 (counts) → 5. `13` §2.10 (what is demo) and §4 (foundations at a glance) → 6. this file §6 (runway) and §9 (your inbox). Total: under an hour. Everything else is reference.

## Appendix C — Distribution (how these files travel between AIs)

The master copies are `docs/source-of-truth/*.md` in the repo. `scripts/bundle-source-of-truth.mjs` publishes read-only copies to `public/docs/source-of-truth/` so the whole folder moves in one download:

| Artifact | Path on any deployment / preview | Use |
|----------|----------------------------------|-----|
| Download page | `/docs/source-of-truth/index.html` | one screen, every link below |
| Whole folder | `/docs/source-of-truth/archio-source-of-truth.zip` | all 16 files, original names, plus both bundles |
| Control bundle | `/docs/source-of-truth/ARCHIO-CONTROL-CENTER-12-13-14.md` | `12` + `13` + `14` as ONE file — the object ChatGPT receives; each file begins at a `<!-- FILE: name -->` marker so `NN §n` references still resolve |
| Full bundle | `/docs/source-of-truth/ARCHIO-SOURCE-OF-TRUTH-ALL.md` | README + `00`…`14` as one file, for an AI that needs the governance layer too |

Rules. (1) The bundles are copies, never edited by hand — a change made in a bundle is lost at the next run. (2) Re-run the script after any edit to `docs/source-of-truth/`; the page shows its publish date, and a date older than the newest master file means the copies are stale. (3) The Grok starter pack (`public/docs/grok/ARCHIO-GROK-STARTER-PACK.zip`) is a *separate* artifact built from `09` §5 and is not regenerated by this script (see §5 PROPOSED items).


---

<!-- FILE: 15-structural-map-v1.md -->

# ARCHIO — Structural Map v1 (founder-approved)

*Filed 20 September 2026 as a numbered Source-of-Truth document (DL-019, approved by Luke + Kan under Q-21). This is the **single current structural map** of ARCHIO for v0, Grok (Product Brain · Red Team · Architect), ChatGPT, Luke, Kan and later QClay. Status: **CURRENT — DECIDED.** Only Luke or Kan change it; every AI proposes. Newest date wins.*

## 0. What this document is and is not

- It is the founders' structure of ARCHIO at **Level 1** (user-facing systems / environments) and the **Level-4 / VISION** interfaces, filed verbatim from the founders' 20 Sep 2026 request, so that `12`, `13`, `14` and every bot can cite it by path instead of by memory.
- It is **not** a feature list, a page inventory, a data model or a roadmap. Those live in `12` (surfaces), `13` (backend), `14` (cross-reference). The company scope it sits inside is `11` (DL-017); the work order is STRUCTURE → FLOWS → DATA/BACKEND → DETAILED PAGE DESIGN (DL-018).
- **Levels 2 and 3** (sub-systems and flows inside each system) are **not yet written**. `14` §6 keeps "Structural Map v1 mature (levels 1–4 written)" as an open maturity gate. Nothing in this file invents them.

## 1. The map (verbatim, as given by the founders)

**Level 1 — User-facing systems / environments**

| # | System | Code used in `12` / `13` / `14` |
|---|---|---|
| 1 | Flight Deck | `FD` |
| 2 | Intent Loop / Decision experience | `IL` |
| 3 | Market Experience | `MX` |
| 4 | Education | `ED` |
| 5 | Community & Opportunity | `CO` |
| 6 | Ask Archio | `AA` |
| 7 | Account / Money | `AM` |

**Level 4 / VISION interfaces** (listed separately; UI or mockups may exist — they are not current-phase systems)

| # | Interface | Code |
|---|---|---|
| V1 | Trading Passport / verified proof | `TP` |
| V2 | Social / creator / marketplace | `SM` |
| V3 | agents / workflows | `AG` |

The two-letter codes are `12` §2's convention, not part of the founders' text. `12` and `14` also carry `SH` (global shell) and `MK` (founder / marketing / internal surfaces) as inventory containers; they are not systems on this map.

## 2. Founder decisions that bind the map (20 Sep 2026)

Recorded here so the map is always read with them. The entries of record are in `01-decision-ledger.md`.

| System | Decision | Ledger |
|---|---|---|
| **Community & Opportunity** | **Tenancy = Model B:** organization / community → rooms / channels → memberships / access. One structural model, not two parallel tenancy systems. Mental model: a member enters a mentor's / community's environment and moves between rooms (general · trading · education · forecasts / analysis · other specialised rooms as appropriate) — familiar, the way Discord trading communities organise themselves; **not** a literal copy of Discord and **not** a licence to invent rooms or features from the example. Model A (`groups`-only tenancy) is **SUPERSEDED for future architecture / design work**; repo facts and history are preserved until a technical migration / refactor is separately approved. | DL-020 |
| **Intent Loop / Decision experience** | **This phase: DESIGN SHAPE ONLY.** Keep defining how it fits into ARCHIO, its user experience / shape / flows, and the technical learning about its data model where useful. Do **not** implement the full persistence / backend loop. Do **not** un-park implementation because the concept is important. Principle: move toward it in the proper order and minimise working backwards or rebuilding. | DL-021 |
| **Education** | **COMBINATION.** A dedicated ARCHIO learning system (structured learning experiences · mentor-created educational content · student access / progression) **and** educational content and intelligence surfacing contextually across Community, Ask Archio, Flight Deck, onboarding and other relevant ARCHIO experiences. Creator / mentor knowledge feeding AI agents or marketplace products remains **VISION**, not a current implementation commitment. | DL-022 |
| **Flight Deck** | **Zero-data first open = GUIDED EMPTY STATE.** A new user enters the real Flight Deck; no fake personal history / numbers; useful and alive; guides first actions; exploration without a large mandatory onboarding; configuration optional and gradual; the empty state explains what areas become once ARCHIO has real information. A lightweight guide may support it. | DL-024 |
| **Flight Deck** | **Keep the four-category command-centre model for now.** The four areas (MARKET FLOOR · STUDIO · MENTOR HALL · COLLECTIVE, names provisional) are a **user navigation / command-centre abstraction** that compresses ARCHIO's capabilities into immediate destinations — **not** a representation of the seven Level-1 systems in this file, and **not** Community "rooms". Working term: **zones**. D1 inspects whether each name fits its contents. The Education `/cockpit` naming collision is recorded for a later rename. **Addendum (20 Sep, second session):** the zone **model** is kept (DECIDED, provisional); the zone **names and the placement of the 16 destinations are OPEN — for Product Brain review**; nothing is renamed or moved before that review and a founder decision. | DL-025 |
| **Cross-cutting — shell · Account / Money · every personalised system** | **Public vs private = social-style configurable privacy model.** Public / marketing / auth / help surfaces may be signed-out; the personalised product requires login; a profile has a public layer, a user-controlled shareable layer, and an always-private account / intelligence layer that a connection can never expose. D1 fixes only the public-vs-authenticated boundary; the permission matrix is a future dedicated block. **Addendum (20 Sep, second session):** Instagram-familiar *configurable visibility* recorded as FOUNDER DIRECTION (public / social-facing · approved connections · deliberately shared · never-shared private); the matrix stays a later block. | DL-023 |
| **Cross-cutting — signed-out arrival · shell · Flight Deck** | **Signed-out experience = product-first exploration (DECIDED as philosophy).** ARCHIO behaves like a product (TradingView reference), not a marketing site: a signed-out visitor sees / explores the real product environment — especially the chart / trading workspace — never a login wall; identity is asked for at the moment of need (identity · persistence · personalisation · private data · community participation · personal AI context · account information · saved settings · deeper use). Signed-out users never see another user's private / personalised data. **OPEN:** the exact signed-out feature limits (D1 output). | DL-026 |
| **Flight Deck** | **One destination after login and after registration = the main Dashboard / Flight Deck workspace (DECIDED as direction).** Today's split (login → `/`, register → `/copilot`) is not final; routes are not changed yet. | DL-027 |
| **Flight Deck** | **Guided empty state reconfirmed (DECIDED).** A short optional tutorial after first sign-in = **FOUNDER DIRECTION** (may introduce Flight Deck · chart area · Community · controls beside / below the chart · gadgets · navigation · Ask Archio); full tutorial design = **OPEN / later block**. | DL-024 addendum |
| **Ask Archio** | **Conversational guide during exploration = FOUNDER DIRECTION, not a specification.** Inside the Flight Deck the question bar answers *what are you? · what can you do? · where do I go? · how does this work?* and may naturally encourage login / registration at the moment of need. Which surface *is* Ask Archio stays open. | DL-028 |
| **Account / Money — identity** | **Authentication.** The current face-scan flow = **DEMO/SIMULATION** (timers, fabricated local user, no biometric check). Real secure convenient authentication (device-native biometrics / Face ID / passkeys · email · confirmation codes · phone) = **FOUNDER DIRECTION**. KYC / account integrity = **OPEN**. Five concepts — authentication · biometrics / passkeys · email / phone confirmation · KYC · duplicate-account prevention — are never merged. No implementation change yet. | DL-029 |
| **Flight Deck — name** | **The workspace is intended to become a highly customisable trader workspace (FOUNDER DIRECTION;** mentor-resold configurations = FUTURE/VISION, V2**).** Its user-visible name — **Dashboard · Flight Deck · Command Center** — is **OPEN**; do not force it. "Your Space" and "Trading Terminal" are not authoritative. "Flight Deck" on this map is the founders' Level-1 label and the documents' handle, not a UI naming decision. | DL-030 |
| **Flight Deck — four zones (22 Sep 2026)** | **PROVISIONAL D1 DESIGN DIRECTION — Luke approves; Kan's asynchronous review pending; NOT joint final approval; names reversible.** After the Product Brain / Red Team reconciliation the four zones survive as **MARKET FLOOR** (see what is happening now: Intelligence · Daily Brief · Live Calls) · **TRADING DESK** (reversible; work on my trading: **one** Forecasts entry · Copilot · Post-Mortem) · **THE ACADEMY** (reversible; learn how to trade better: Education + honest Compare / Mentor AI shells; discipline cross-cutting) · **THE COLLECTIVE** (find people and participate: Communities · The Floor · Collab Hub). Zones are still **not** the systems on this map and **not** Community rooms. Ask Archio, Nexus (absorption candidate, code kept), account / avatar chrome and Flight Deck customisation are global chrome, not zone doors. **Marketplace**'s conceptual home stays in L1-5 Community & Opportunity / V2 — not a D1 door, not approved. **Centralized / Decentralized** multi-environment contexts = FUTURE/VISION, UX OPEN, no literal toggle, not in D1 chrome, no blockchain / tokenomics / LP design, no implied wallet / broker execution. Code untouched. | DL-031 |

## 3. Superseded and conflicting maps (kept and marked — never deleted)

`14` §3.1 N-20 found four maps of the same territory. From 20 Sep 2026 **this file is the only current structural map**; the others keep their history and the uses listed below.

| Map | Where | Status from 20 Sep 2026 | Still used for |
|---|---|---|---|
| **Structural Map v1** | this file | **CURRENT — DECIDED (DL-019)** | system ownership in `12` §5, `13` §4 NEEDED BY, every `14` §2 record; canonical names (`14` §3) |
| QClay "Locked product map" (SYSTEM 01–09 page inventory) | `docs/qclay-dashboard-page-inventory-master.md` §3 | **SUPERSEDED as a structural map.** Legacy page inventory, kept. | the QCLAY RELEVANCE line of every `14` §2 record (legacy page IDs 01.x–09.x); QClay handoff cross-reference. QClay must be told this file is the current map (`14` Q-20 → DL-019). |
| `09` §2 "Nine systems (design canon)" — Flight Deck · Community · AI Agent Marketplace · Decision Desk · Trading DNA · Net Worth · Portfolio · AI Verified Track Record · Social Network | `09-bot-context-packs.md` §2 | **LEGACY naming layer.** Marked in `09` §2 on 20 Sep 2026. | alias resolution only (`14` §3.1 N-1, N-2, N-4, N-5, N-6, N-7). The daily rituals named beside it in `09` §2 are unaffected. |
| Flight Deck **zones** (historically "Room Navigator rooms") — in code MARKET FLOOR · THE STUDIO · MENTOR HALL · THE COLLECTIVE; in the **provisional D1 direction (DL-031, 22 Sep 2026)** MARKET FLOOR · **TRADING DESK** · **THE ACADEMY** · THE COLLECTIVE | `FLIGHT_DECK_ROOMS` in code (unchanged); `12` FD-NAV-001 (code table + surviving-direction table) | **Not a map — by decision (DL-025, 20 Sep 2026).** A user navigation / command-centre abstraction inside Flight Deck; deliberately **not** aligned to the seven systems; call them **zones**, not rooms (Q-3 closed). Names: **PROVISIONAL D1 DESIGN DIRECTION** (Luke; Kan review pending; TRADING DESK and THE ACADEMY explicitly reversible). | Flight Deck navigation as built; D1 Block 2 design target |
| Response-engine `RoomId` (`studio`, `market-floor`) | `lib/response-engine/` | **Not a map** — code identifiers. | Ask Archio routing as built |

A conflict between any of these and this file resolves in favour of this file. A resolution that changes a *name* is recorded in `01` as a DL entry and mirrored in `14` §3 (`14` §3.3).

## 4. How to cite

- Ownership: "`15` L1-5 Community & Opportunity" (Level 1, row 5), or simply "`15` `CO`".
- VISION: "`15` V1 Trading Passport".
- Never cite the nine-system canon or the QClay locked map *as the structure*; cite them only as aliases or legacy page IDs.

## 5. Change log

| Date | Change | Approved by |
|---|---|---|
| 2026-09-20 | Filed from the founders' 20 Sep request (Level 1 + Level 4 verbatim). Decisions DL-020 / DL-021 / DL-022 annotated in §2. Superseded-map table (§3) written. | Luke + Kan (Q-21 housekeeping · DL-019) |
| 2026-09-20 | §2 gains DL-023 (privacy boundary, cross-cutting), DL-024 (Flight Deck guided empty state), DL-025 (Flight Deck four zones = navigation abstraction). §3 Room Navigator row rewritten: zones, not a map, by decision. Level 1 / Level 4 text untouched. | Luke + Kan (Q-1 / Q-2 / Q-3 answers) |
| 2026-09-20 (second session) | §2 gains DL-026 (signed-out = product-first exploration; limits OPEN), DL-027 (one post-auth destination), DL-024 addendum (optional tutorial = direction; design OPEN), DL-028 (Ask Archio guide = direction), DL-029 (face scan = DEMO/SIMULATION; auth direction; KYC OPEN), DL-030 (workspace direction; name OPEN); DL-023 and DL-025 rows gain their addenda (visibility layers; zone names + placement OPEN for Product Brain review). Level 1 / Level 4 text untouched. | Luke + Kan (D1 sheet answers, items 1–8) |
| 2026-09-22 | §2 gains **DL-031** (four zones = PROVISIONAL D1 DESIGN DIRECTION after the Product Brain / Red Team reconciliation: MARKET FLOOR · TRADING DESK · THE ACADEMY · THE COLLECTIVE; global chrome; Marketplace home in CO / V2; Centralized / Decentralized = FUTURE/VISION, UX OPEN). §3 zones row carries both the code names and the provisional names. **Level 1 / Level 4 text untouched** — no system, interface or level added. | **Luke (approved) · Kan (asynchronous review pending — not joint approval)** |
