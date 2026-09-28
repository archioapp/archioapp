# ARCHIO — current state for the Grok bots (20 September 2026, second founder session)

*Written by v0 for Product Brain · Red Team · Architect. Every line points at a Source-of-Truth document you also hold (`01`, `11`, `15`, `08`) or at an operational control record (`12` / `13` / `14` — you receive extracts, not the files). Nothing here is new strategy. If this sheet and `01` disagree, `01` wins.*

**Bots propose / challenge / ground. Luke + Kan decide.**

## 1. Where the company is

- **Scope (DECIDED, DL-017, `11`):** ARCHIO is the connected environment around the trader's entire journey — General ARCHIO Intelligence + Personal ARCHIO Intelligence. The intent → trade → compare → review → memory loop is an engine *inside* it, not the company.
- **Order of work (DECIDED, DL-018, `11` §8):** STRUCTURE → FLOWS → DATA/BACKEND → DETAILED PAGE DESIGN.
- **STRUCTURE is done:** Structural Map v1 is filed as `15` (DL-019). Seven Level-1 systems — Flight Deck `FD` · Intent Loop / Decision experience `IL` · Market Experience `MX` · Education `ED` · Community & Opportunity `CO` · Ask Archio `AA` · Account / Money `AM` — and three VISION interfaces (Trading Passport `TP` · Social / creator / marketplace `SM` · agents / workflows `AG`). Levels 2–3 are not written.
- **Binding decisions on the map (`15` §2):** Community tenancy = Model B, organization → rooms / channels → memberships (DL-020) · Intent Loop this phase = design shape only, no persistence (DL-021) · Education = combination (DL-022) · privacy = social-style configurable, D1 = boundary only (DL-023) · zero-data first open = guided empty state (DL-024) · Flight Deck four zones = navigation abstraction, not the seven systems, not rooms (DL-025).
- **The current block is D1 — Front Door / Flight Deck.** Opened 20 Sep as **inspection + design-definition only**: no product code, no middleware / RLS / route change, no T1 (register → profiles → `/api/users/me`), no unrelated redesign. Block 1 (the inspection sheet, `docs/lego/D1-block-1-front-door.md`) is issued; the founders answered its questions on 20 Sep (below). **Block 2 (design definition) is not open yet.**
- **What exists in code (`08`):** real Supabase Auth + `profiles`; real orgs / rooms / memberships / invites / billing APIs with **zero UI**; real Polygon market data; one real grounded LLM route (`/api/archio`). **No trade, plan, decision, journal, forecast or trader-model table exists. No broker connection. Every personal number on every surface is demo.** `copilot_events` is a dormant / dead table (writer exists, its only call site is commented out, nothing reads it).

## 2. The D1 founder decisions of 20 September 2026 — by kind

Read the labels literally. A FOUNDER DIRECTION is not a DECIDED; an OPEN is a question the founders have not answered; DEMO/SIMULATION is a fact about code.

### DECIDED

| ID | Decision |
|---|---|
| DL-023 | **Privacy = social-style configurable model.** Public / marketing / auth / help surfaces may be signed-out; the personalised product requires login; a profile has a public layer, a user-controlled shareable layer and an always-private account / intelligence layer that a connection can **never** expose (email, phone, auth, private Trading DNA, AI memory, brokerage, journal). **D1 fixes only the public-vs-authenticated boundary.** |
| DL-024 | **Zero-data first open = GUIDED EMPTY STATE.** A new user enters the **real** workspace; no fake personal history, account numbers, psychology data, P&L, trade counts or fabricated persona presented as theirs; still alive and useful; explains what areas do; gives first actions; configuration optional and gradual; **no large mandatory onboarding**. Reconfirmed 20 Sep (second session). |
| DL-025 | **Four-zone command-centre model kept (provisional).** The zones are a navigation abstraction, **not** the `15` systems and **not** Community rooms — working term **zones**. |
| DL-026 | **Signed-out = product-first exploration (philosophy).** ARCHIO behaves like a product (TradingView reference), not a marketing site: a visitor sees / explores the real environment — especially the chart / trading workspace — never a login wall; ARCHIO asks for login / registration when the visitor reaches for identity, persistence, personalisation, private data, community participation, personal AI context, account information, saved settings or deeper use. Signed-out users never see another user's private / personalised data. |
| DL-027 | **One destination after login and after registration = the main Dashboard / Flight Deck workspace.** Today's split (login → `/`, register → `/copilot`) is not final. Routes unchanged for now. |
| DL-029 (part) | **Five auth concepts are never merged:** authentication · device biometrics / passkeys · email / phone confirmation · KYC / identity verification · duplicate-account prevention / account integrity. |
| DL-030 (part) | **"Your Space" and "Trading Terminal" are not authoritative product names** unless the founders revive them. |

### OPEN (founders have not decided — do not decide for them)

| ID · inbox | Question |
|---|---|
| DL-026 · Q-23 | The **exact signed-out limits** — which public product surfaces / gadgets are explorable signed-out; which actions trigger the login / register ask. (D1 proposes a route + action list.) |
| DL-025 addendum · Q-24 | **Zone names and the placement of all 16 destinations.** The founders are **not ready to approve the current placement.** Nothing is renamed or moved before the Product Brain's review, the Red Team's challenge and a founder decision. |
| DL-029 · Q-25 | **KYC / account-integrity requirement** — whether, for whom, when. |
| DL-030 · Q-26 | **The visible name of the central workspace** — Dashboard / Flight Deck / Command Center are the founders' live, unresolved terms. **Do not force one.** |
| DL-029 · Q-27 | **Fate of the face-scan UI** — remove until real / keep as visual but disable the fake "verified" path / keep as is. |
| DL-024 addendum | **Full onboarding / tutorial system design** — later block. |
| Q-4, Q-8, Q-14, Q-19 (older) | What `/` is after login · which surface *is* Ask Archio · theme count · which landing page survives. |

### FOUNDER DIRECTION (binds direction, is not a specification)

| ID | Direction |
|---|---|
| DL-024 addendum | A **short optional tutorial after first sign-in**, which may introduce Flight Deck · the TradingView / chart area · Community · controls beside / below the chart · gadgets · the major navigation · Ask Archio / question bar, then returns the user to the workspace. |
| DL-028 | **Ask Archio guides exploration conversationally** — *what are you? · what can you do? · where do I go? · how does this feature work?* — and may naturally encourage login / registration when a signed-out user reaches for identity- or persistence-bound features. |
| DL-029 | **Future secure, convenient authentication:** device / platform-native biometrics where supported · Face ID / passkey-style on compatible Apple devices · email-based authentication · confirmation codes · phone verification where appropriate. Stronger identity verification / KYC is *under consideration* (OPEN above). |
| DL-030 | **The Dashboard concept becomes a highly customisable trader workspace:** Flight Deck · chart workspace · gadgets · controls beside / below the chart · themes / colours · layout customisation · quick-access settings · mentor-resold / customised configurations (FUTURE/VISION) · other user-customisable elements — conceptually a **command center for the trader**. |
| DL-025 addendum | Each zone **may** contain subcategories · destinations · actions · features · AI guidance · reusable templates · deeper navigation. MARKET FLOOR ≈ "What is happening right now?" (example intent, not a definition). |
| DL-023 addendum | Instagram-familiar **configurable visibility**: public / social-facing layer · approved connections / friends / followers · deliberately shared information · never-shared private account / intelligence. Users eventually control how public / private they are. |

### DEMO/SIMULATION (facts about code, verified 20 Sep 2026)

| ID | Fact |
|---|---|
| DL-029 | The `/login` **face scan is not authentication**: `components/auth/AccessPortal.tsx` lines 534–535 advance on timers (3.4 s → "processing", 5.2 s → "verified"); `handleFaceAuth` (`app/login/page.tsx` 83–89) signs in a fabricated local user `face-auth-user` with no Supabase session; no biometric verification exists. The only real path is email + password via Supabase Auth. |
| DL-024 context | `/dashboard` greets every visitor — including signed-out strangers — as **"Marcus"** with $113,869 equity, an FTMO plan, a discipline score and a trade history. All hard-coded. No empty state exists. |
| `08`, `13` §3.2 | **`copilot_events` is a dormant / dead pattern**, not an active persistence pipeline: `lib/copilot/persist.ts` has a writer; its only call site (`components/copilot/CopilotProvider.tsx` lines 6, 49) is commented out; `app/api/copilot/chat` writes nothing; nothing reads the table. Its RLS is unsafe as written (S2, S3). |

### FUTURE/VISION

Mentor-resold / customised workspace configurations (DL-030 → `15` V2 marketplace) · creator knowledge feeding agents / marketplace (DL-022) · everything right of REVIEW on the ladder · `15` V1–V3.

## 3. Rejected — never re-propose without stating what changed (`01` rejected table)

Login wall on arrival · demo telemetry shown to a real zero-data user even labelled "DEMO" · large mandatory onboarding before the workspace · renaming the four zones to match `15` · presenting the timer-based face scan as authentication · treating "Your Space" / "Trading Terminal" as the product name · merging the five auth concepts · TradingView as the *differentiating* centre (fine as a feature) · rules-check-before-ticket as differentiator · AI session review as the wedge · nine systems designed before the loop · marketplace before verification · autonomous execution · "Mentor's Ledger" / Kan's students as wedge · letting repo architecture define the market · eleven-department Grok org.

## 4. Terminology corrections and superseded maps

| Say | Never say | Why |
|---|---|---|
| **zones** (MARKET FLOOR · THE STUDIO · MENTOR HALL · THE COLLECTIVE) | "rooms" for the Flight Deck four | DL-025 / DL-020 — room / channel is Community tenancy vocabulary |
| **Flight Deck** as the `15` L1-1 document handle; **"the workspace"** when you mean the UI whose name is OPEN | a chosen UI name; "Your Space"; "Trading Terminal"; "the cockpit" | DL-030 (name OPEN); `/cockpit` is an Education page (N-7) |
| **Structural Map v1 (`15`)** — seven systems | the nine-system canon or the QClay locked map *as the structure* | DL-019; `15` §3 lists what each legacy map is still used for |
| **Intent Loop / Decision experience** | "Decision Desk" as a current system | N-1 — legacy page family |
| **dormant / dead pattern** for `copilot_events` | "event spine", "the event pipeline", "extend copilot_events" | `08` corrected 20 Sep; `13` §3.2 |
| **DEMO/SIMULATION** for the face scan | "biometric login", "Face ID login" | DL-029 |
| **trader** | student / member / user (unless quoting a table) | `11` uses *trader* (N-13) |
| **product-first exploration; identity asked at the moment of need** | "public app" or "login-walled app" | DL-026 |

## 5. What every bot may and may not do in D1

- **May:** evaluate, challenge, ground — against `01`, `11`, `15`, `08`, this sheet and your role extract; propose deletions, merges, moves, missing flows and NEEDS-V0-VERIFICATION items; draft ledger entries for a founder to commit.
- **May not:** invent features or destinations; design pages, gadgets, the tutorial or the assistant logic; pick the workspace's name; rename or move a zone / door; write schemas, policies, middleware rules or a build plan; treat any DEMO/SIMULATION as a capability; treat a FOUNDER DIRECTION as DECIDED; cite another bot as evidence; start before a founder sends the task paragraph.
- **Every output:** ≤ 5 bullets · ledger IDs with labels · `Status: PROPOSED — requires founder decision (Luke + Kan).`
