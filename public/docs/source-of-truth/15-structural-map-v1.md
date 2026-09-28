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
