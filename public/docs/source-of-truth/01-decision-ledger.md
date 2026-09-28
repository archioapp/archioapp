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
