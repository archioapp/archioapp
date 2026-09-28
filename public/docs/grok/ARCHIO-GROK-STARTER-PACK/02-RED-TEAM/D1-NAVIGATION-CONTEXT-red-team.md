# D1 navigation context — for the Red Team (extract, 20 September 2026)

*Role-specific extract prepared by v0 from `docs/lego/D1-block-1-front-door.md` (the D1 Block 1 inspection sheet — verified on the preview 20 Sep 2026 at 910 × 784, signed out), `12-product-design-control-center.md` (SH-NAV-001/002/003 · SH-STATE-002 · FD-PAGE-001 · FD-NAV-001 · FD-STATE-002/003 · FD-SEARCH-001 · AA-AI-001 · ED-PAGE-001), `14-archio-master-cross-reference.md` (§3.1 N-7 / N-9 / N-10 / N-19) and `01` (DL-023 … DL-030 + rejected table). Everything below is either a verified fact (say "D1 sheet" or "`12` <record>") or a ledger entry (cite the ID with its label). It contains no backend detail beyond what a navigation attack needs. You attack; Luke + Kan decide.*

## 1. Your target in D1, and what you may not do

Your target is **the Product Brain's PROPOSED four-zone organisation and destination placement** (a founder pastes it to you). Attack it for **confusion · duplication · bad navigation · unnecessary complexity · misleading product behaviour · broken user journeys**. Propose **deletions, merges, moves and missing flows** — a missing flow is "signed-out trader taps My Profile → what happens?", never a new screen. Do **not** invent features or destinations; do not pick the workspace's name (DL-030 OPEN); do not design pages, gadgets, the tutorial or the assistant.

Until the proposal arrives, this extract lets you hold the **current** structure in mind so you can tell whether a proposal fixes a real problem or only moves it.

## 2. The user journeys as they exist today (verified, D1 sheet)

| # | Journey | What actually happens | Verdict against the ledger |
|---|---|---|---|
| J1 | Stranger arrives at `/` | Lands on the **Signal Terminal**: TradingView EUR/USD chart, a mock "FOCUS NOW" feed, an **EXECUTE** button. No product name, no sign-in prompt, no way to know this is ARCHIO. Two landing pages (`/welcome`, `/archio`) exist and nobody reaches them by default. | Consistent with "explore first" (DL-026 DECIDED philosophy) — but the mock feed and EXECUTE button on a page with no broker are **misleading product behaviour**. Whether `/` is the right public surface is **OPEN (Q-4 / Q-23)**. |
| J2 | Stranger opens `/dashboard` | HTTP 200. Greeted **"Welcome back, Marcus."** with $113,869 equity, FTMO 50K, DISCIPLINE 72, 3W 2L +4.1R, LAST 5 TRADES — every number hard-coded, shown identically to strangers and real users. | **Violates DL-024 (DECIDED) by construction.** No empty state exists (`12` FD-STATE-003). |
| J3 | Stranger opens any other real route (`/hub`, `/profile`, `/copilot`, `/nexus`, `/intelligence`) | HTTP 200 for all. Middleware redirects to `/login` only for **eight routes that do not exist as pages** (`/usage /support /integrations /developers /status /settings /billing /admin`). `/hub`'s own guard was removed July 2026 — documents said it self-gated; it does **not** (corrected 20 Sep). | Nothing personal is protected — but nothing personal is real either, so today this is a *future* privacy problem (DL-023) and a *present* honesty problem (DL-024). |
| J4 | Stranger taps a protected-but-missing route | `/settings` → 307 → `/login?from=/settings` → after sign-in → **404**. | **Broken journey** (dead end after authenticating). |
| J5 | `/login` | Opens in **face-scan mode**: "Your face is your access key. No passwords. No codes." Pressing READY TO SCAN does nothing real: a timer "verifies" after ~5 s and signs in a **fabricated local user** (`operator · STUDENT`) with no server session. The real path (email + password, Supabase) hides behind "USE CREDENTIALS INSTEAD". Either path then pushes to `?from` or **`/`** — the Signal Terminal, not the workspace. | Face scan = **DEMO/SIMULATION (DL-029)**; its UI fate is **OPEN (Q-27)**. The copy promises what the code cannot do — **misleading product behaviour**. Destination contradicts **DL-027 (DECIDED direction)**. |
| J6 | `/register` | On completion pushes to **`/copilot`** — a third post-auth destination (hard-coded prices page). | Contradicts DL-027. Routes deliberately unchanged until a founder orders the edit. |
| J7 | Signed-in user wants to go somewhere | **No shell**: no header, sidebar, breadcrumb or "where am I" on any product page. Navigation = a hidden left-edge chevron (`FloatingNav`: Dashboard · Signal Terminal · Macro Economic · Forecast Hub · Community), a floating Community Hub tab, an LLM command layer, and the **zone band on one page only** (`/dashboard`). Three overlay systems compete for the screen edges (`12` SH-NAV-003). | **Bad navigation** baseline: the zones are reachable from exactly one page. |
| J8 | User returns tomorrow | Layout, theme, deck config and side-rail history live only in `localStorage` (five keys). Nothing server-side. The "CUSTOMIZE FLIGHT DECK" rail is commented out ("temporarily hidden"). | Personalisation the founders want (DL-030 FOUNDER DIRECTION) has no persistence behind it — a fact, not a D1 task. |

## 3. The four zones and their 16 destinations today (`12` FD-NAV-001, `FLIGHT_DECK_ROOMS`)

Kinds: **href** = navigates to a page · **template** = renders a generated template in place · **Ask prompt** = sends a fixed question to the grounded LLM (`/api/archio`) · **event** = opens a panel.

| Zone · tagline | Door | Kind | Lands on | What is really behind it (verified) |
|---|---|---|---|---|
| **MARKET FLOOR** "What's happening right now." | Intelligence | href | `/intelligence` | live page |
| | Live Calls | href | `/history` | live page, **mock data** |
| | Forecasts | template | `market.forecast-room` | real renderer, sample data |
| | Daily Brief | Ask prompt | "What matters for EUR/USD today?" | real LLM over **real market data** |
| **THE STUDIO** "Make something today." | Forecast Hub | href | `/forecast` | live page, **sample data**, no table behind it |
| | Copilot | href | `/copilot` | live page, **hard-coded prices** |
| | Post-Mortem | Ask prompt | "Why did I lose yesterday?" | real LLM over a **labelled demo journal** (a fictional trader) |
| | Nexus | href | `/nexus` | live page (synthesis surface, mock) |
| **MENTOR HALL** "Learn from the best." | Compare | template | `mentors.compare-mentors` | real renderer, **no mentor data** |
| | Collab Hub | href | `/hub` | live page, **mock**, **not** login-gated |
| | The Cockpit | href | `/cockpit` | live page — **an Education narrative page**, not the Flight Deck (name collision N-7) |
| | Mentor AI | Ask prompt | "What would my mentor flag…" | real LLM, **no mentor data** |
| **THE COLLECTIVE** "Find your ecosystem." | Communities | href | `/communities` | live page — the **only** door with a real data read (`groups` table, mock fallback) |
| | The Floor | Ask prompt | "Summarize what the community is discussing…" | real LLM, **no community data** |
| | My Profile | href | `/profile` | live page, **mock profile** |
| | Controls | event | Flight Deck control panel | opens `12` FD-PANEL-001 |

Counts: 16 doors = 9 href · 2 template · 4 Ask · 1 event. Nine of sixteen labels **truncate at 910 px** ("Intelli…", "Live Ca…", "Forecas…", "Daily B…", "Post-Mo…", "The Coc…", "Communi…", "The Flo…", "My Prof…").

**What the founders said about the zones (DL-025 DECIDED model · OPEN names + placement):** they are a **navigation / command-centre abstraction** — not the seven `15` systems, not Community rooms; each *may* hold subcategories, destinations, actions, features, AI guidance, reusable templates, deeper navigation (FOUNDER DIRECTION); MARKET FLOOR ≈ "What is happening right now?" (example intent). **The founders are not ready to approve the current placement.** Nothing is renamed or moved before the Product Brain's review, your challenge and a founder decision.

## 4. Duplication you should already know about (`14` §3.1)

- **Five names for one surface (N-7):** tab "Command Center | Archio AI" · nav "Dashboard · Private command center" · component "Your Space" · documents "Flight Deck" · site title "ArchioAI Trading Terminal". **DL-030: the name is OPEN** (Dashboard · Flight Deck · Command Center); "Your Space" / "Trading Terminal" are not authoritative. Plus `/cockpit` is an Education page wearing a cockpit name.
- **Three "command" surfaces (N-9):** the zone band's doors · a keyboard **command palette** that jumps to doors / gadgets (`12` FD-SEARCH-001) · an **LLM command bar** (`12` AA-AI-001, `/api/command`, ungrounded) — and separately the **ASK bar** on `/dashboard` (`/api/archio`, grounded). Which surface *is* Ask Archio is **OPEN (Q-8)**.
- **Three "Hubs" (N-19):** Flight Deck Hub · Community Hub (the floating tab) · Student Hub (`/hub`, called "Collab Hub" on its door).
- **Two UIs of one system (N-1 / N-11):** Forecast Hub (`/forecast`) and Copilot (`/copilot`) are both Intent Loop / Decision-experience *UIs*, listed as separate doors in the same zone.
- **Two review surfaces:** Post-Mortem (Ask prompt, THE STUDIO) and the review the Intent Loop will own (`15` L1-2) — the door exists before the data does.
- **Four Ask prompts** are the same mechanism (`/api/archio`) with four fixed questions, spread across four zones; three of the four have **no data** to answer from (mentor, community, personal journal → demo).

## 5. The ten KNOWN PROBLEMS the inspection verified (D1 sheet) — founder marking FIX IN D1 / ACCEPT / LATER not yet returned

1. **DL-024 violated on first open by construction** — every visitor is "Marcus" with fabricated equity, plan, discipline, history. No empty state.
2. **Nothing real is gated (S7)** — middleware protects eight non-existent routes; all real routes 200 signed out; `/hub` guard removed July 2026.
3. **The primary login path is a simulation** — timer-verified face scan, fake local user, copy promises "No passwords" while the only real path is a password.
4. **Three post-authentication destinations** — login → `/`; register → `/copilot`; nothing lands on `/dashboard`; protected-missing routes bounce to `/login?from=…` then 404.
5. **Five names for the Front Door surface** + the `/cockpit` collision (N-7; rename deferred by DL-025).
6. **Signed-out root is a trading terminal, not a front door** — chart + EXECUTE to strangers; two unreached landing pages elsewhere (`12` F-12).
7. **Zone name-fit misses** — THE COLLECTIVE ("Find your ecosystem") holds **My Profile** and **Controls**; THE STUDIO ("Make something today") holds **Post-Mortem** and **Nexus** (review / synthesis); MENTOR HALL's four doors have **no mentor data**; MARKET FLOOR fits best.
8. **Door labels truncate at 910 px** — nine of sixteen.
9. **Execution rail contradicts its own chart** — DISCONNECTED, yet quotes SELL / BUY **1.0863** under a ~**1.150** chart and offers OPEN with no broker (F10 absent).
10. **No shell** — no header / sidebar / location indicator on any product page.

Decisions behind them so far: 1 → DL-024 (no fix order yet) · 3 → classified DEMO/SIMULATION, UI fate OPEN Q-27 · 4 → DL-027 (routes unchanged) · 5 → OPEN by decision DL-030 · 7 → Product Brain review (Q-24). Problems 2, 6, 8, 9, 10 have no decision yet.

## 6. The DECIDED lines a proposal must not contradict (quote the labels)

- **DL-023 DECIDED** — privacy boundary: public / marketing / auth / help may be signed-out; the personalised product requires login; profile = public layer + user-controlled social layer + always-private account / intelligence layer that a connection can never expose. D1 = boundary only. *Addendum (FOUNDER DIRECTION):* Instagram-familiar configurable visibility — the matrix is a later block.
- **DL-024 DECIDED** — guided empty state: real workspace, no fake personal numbers or persona, alive and useful, explains areas, gives first actions, optional gradual configuration, no large mandatory onboarding. *Addendum:* short optional post-sign-in tutorial = FOUNDER DIRECTION; full tutorial design = OPEN / later block.
- **DL-025 DECIDED (model) · OPEN (names + placement)** — see §3.
- **DL-026 DECIDED (philosophy) · OPEN (limits, Q-23)** — signed-out = product-first exploration (TradingView reference), identity asked for at the moment of need (identity · persistence · personalisation · private data · community participation · personal AI context · account information · saved settings · deeper use); never a login wall; never another user's private data.
- **DL-027 DECIDED (direction)** — login and registration both land in the Dashboard / Flight Deck workspace. Routes unchanged for now.
- **DL-028 FOUNDER DIRECTION** — Ask Archio guides exploration conversationally and may encourage login / register at the moment of need. Not a spec.
- **DL-029** — face scan = DEMO/SIMULATION · real secure auth = FOUNDER DIRECTION · KYC / account integrity = OPEN (Q-25) · five auth concepts never merged · UI fate OPEN (Q-27).
- **DL-030 FOUNDER DIRECTION (customisable trader workspace, "command center") · OPEN (name, Q-26)**.

## 7. Rejected and superseded — never let these resurface (`01` rejected table; `15` §3)

Login wall on arrival (DL-026) · demo telemetry shown to a real zero-data user even labelled "DEMO" (DL-024) · large mandatory onboarding before the workspace (DL-024) · renaming the four zones to match `15` — rename for **fit** only (DL-025) · presenting the timer-based face scan as authentication (DL-029) · "Your Space" / "Trading Terminal" as the product name (DL-030) · merging the five auth concepts (DL-029) · TradingView as the *differentiating* centre of the cockpit (fine as a feature) · rules-check-before-ticket as differentiator · AI session review as the wedge · nine systems designed before the loop · marketplace before verification · autonomous execution · "Mentor's Ledger" / Kan's students as wedge · letting repo architecture define the market · "Truth Keeper" bot · eleven-department Grok org.

**Superseded maps:** the QClay "Locked product map" (SYSTEM 01–09) and the `09` §2 nine-system canon are aliases only. **The zones are not a map** by decision. **Community rooms** (DL-020 Model B: organization → rooms / channels → memberships) are a *tenancy* structure — a proposal that turns a zone into a room, or a room into a zone, has confused two vocabularies.

## 8. Attack vectors this extract arms you for (not conclusions)

- A proposal that moves My Profile / Controls out of THE COLLECTIVE — **where do they land, and is that a zone or an account surface (`15` L1-7)?** Does a signed-out trader tapping either get the DL-026 ask or a 200 with mock data?
- A proposal that keeps four Ask-prompt doors — **three have no data.** Is a door that always answers from demo "alive and useful" (DL-024) or "misleading" (rejected table)?
- A proposal that keeps The Cockpit under MENTOR HALL — it is an Education page; the rename is deferred (DL-025), so **what does the door say it is?**
- A proposal that names the workspace — **stop it** (DL-030 OPEN).
- A proposal that adds a fifth zone, a sub-level or a wizard — **unnecessary complexity / feature invention.** Deletions, merges, moves, missing flows only.
- Any proposal — **walk J1 → J5/J6 → J2 with it:** signed-out explore → asked to log in at a door → register → land in the workspace (DL-027) → find the same door again. Where does the return path break today, and does the proposal fix it or ignore it?

## 9. What is deliberately not in this extract

Backend tables, RLS, security flags, the T1 slice — the Architect's (`13`). The intent-loop documents (`02`, `03`, `10`) — parked (DL-021). Screenshots — the founders will share `docs/screens/SH/*` and `docs/screens/FD/*` when captured. If you need a code fact, cite `08` or write NEEDS-V0-VERIFICATION.
