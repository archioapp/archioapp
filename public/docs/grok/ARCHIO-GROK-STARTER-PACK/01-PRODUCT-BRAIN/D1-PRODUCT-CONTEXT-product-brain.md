# D1 product context — for the Product Brain (extract, 20 September 2026)

*Role-specific extract prepared by v0 from `12-product-design-control-center.md` (records SH-STATE-002 · SH-PAGE-001/002 · FD-PAGE-001 · FD-NAV-001 · FD-STATE-002/003 · AA intro · ED-PAGE-001), `14-archio-master-cross-reference.md` (§2.1, §2.2, §3.1 N-7 / N-9 / N-10 / N-19), `docs/lego/D1-block-1-front-door.md` (the D1 Block 1 inspection sheet, verified on the preview 20 Sep 2026 at 910 × 784, signed out) and `01` (DL-023 … DL-030). It contains no backend detail beyond what prevents a false product assumption. Real / demo statuses are v0-verified facts; cite them as "`12` <record>" or "D1 sheet".*

## 1. What the founders want from you in D1

Evaluate the **four-zone Flight Deck command-centre organisation** and the **placement of its 16 destinations** (§3 below). Founder position (DL-025 + addendum): the four-zone *model* is kept, provisionally; the zones are a **user navigation / command-centre abstraction** that compresses ARCHIO's capabilities into immediate destinations while keeping the chart / workspace central — **not** the seven `15` systems, **not** Community rooms. The **names and the placement of all 16 destinations are OPEN**; the founders are **not ready to approve the current placement**. Nothing is renamed or moved before your review, the Red Team's challenge and a founder decision.

Each zone *may* contain subcategories · destinations · actions · features · AI guidance · reusable templates · deeper navigation (FOUNDER DIRECTION). MARKET FLOOR roughly means "What is happening right now?" — an example of intent, not a definition of every zone.

## 2. The Front Door as it exists today (D1 sheet, verified)

- **No shell.** No header, sidebar, breadcrumb or "where am I" on any product page. Navigation = a hidden left-edge chevron (`FloatingNav`: Dashboard · Signal Terminal · Macro Economic · Forecast Hub · Community) + a floating Community Hub tab + the LLM command layer + the zone band on one page. Three overlay systems compete for screen edges (`12` SH-NAV-003).
- **Signed-out entry is unguarded.** Every real route returns 200 signed-out, including `/dashboard`, `/hub`, `/profile`, `/copilot` (`12` SH-STATE-002). This is *consistent* with DL-026 (explore first) and *inconsistent* with DL-024 (what is shown is a fake persona).
- **`/` (root) is the Signal Terminal**, not a landing page: a TradingView EUR/USD chart, a mock "FOCUS NOW" feed, an EXECUTE button. Two landing pages exist (`/welcome`, `/archio`) that nobody reaches by default.
- **`/login`** opens in face-scan mode ("Your face is your access key. No passwords. No codes.") — **DEMO/SIMULATION** (DL-029): a timer "verifies" after ~5 s and signs in a fabricated local user (`operator · STUDENT`). The real path is email + password behind "USE CREDENTIALS INSTEAD". After either, the page pushes to `?from` or **`/`** — never to the workspace.
- **`/register`** pushes to **`/copilot`** on completion — a third destination. **DL-027 decides both must land in the Dashboard / Flight Deck workspace; routes not yet changed.**
- **`/dashboard` first open, signed out, zero data, top to bottom:** (1) a session spine (SESSION London · OPENS IN … · PLAN 2 TRADES LEFT · RISK USED 0.0% / 3% · FOCUS EUR/USD · XAU…); (2) the **four-zone band** with taglines, expanding to 4 doors per zone; (3) **"Welcome back, Marcus." — "Where would you like to go today?"** + an ASK bar with rotating placeholders; (4) a Jarvis band: DISCIPLINE 72 · PHASE 2 FTMO 50K · TOTAL EQUITY **$113,869** · +$2,184 today · ACCURACY 30D 67 · 3W 2L +4.1R · LAST 5 TRADES; (5) a theme / deck toolbar (TEAL GLASS · CHART · SPLIT · EXECUTE · AI · ACTIVE · EQUITY · ACCOUNT · PAIRS · CUSTOMIZE); (6) the **TradingView chart bay** (real Polygon bars, EUR/USD ~1.150) with an execution rail beneath reading **DISCONNECTED · SELL 1.0863 · BUY 1.0863 · RISK 1.0% · OPEN →**; (7) a "DECK · BELOW CHART" strip and ~six more screens of gadgets (page height 6,084 px at 910 wide).
- **Every personal number is a hard-coded demo persona ("Marcus", FTMO 50K).** Shown identically to a stranger and to a real user. **This is exactly what DL-024 forbids.** No empty state exists (`12` FD-STATE-003 `NOT DESIGNED → DECIDED, to be designed in D1`). No first-run state exists (`12` FD-STATE-002).
- **Five names for the surface** (`14` N-7): tab "Command Center | Archio AI" · nav "Dashboard · Private command center" · component "Your Space" · documents "Flight Deck" · site title "ArchioAI Trading Terminal". **DL-030: the visible name is OPEN (Dashboard · Flight Deck · Command Center); Your Space / Trading Terminal are not authoritative.** Plus `/cockpit` is an **Education** page (`12` ED-PAGE-001), not the Flight Deck — rename deferred (DL-025).
- **Door labels truncate at 910 px** — nine of sixteen ellipsised ("Intelli…", "Live Ca…", "Forecas…", "Daily B…", "Post-Mo…", "The Coc…", "Communi…", "The Flo…", "My Prof…").
- **Layout, theme, side-rail history and deck config persist only in `localStorage`** (nothing server-side). The "CUSTOMIZE FLIGHT DECK" rail is commented out ("temporarily hidden").

## 3. The four zones and their 16 destinations today (`12` FD-NAV-001, `FLIGHT_DECK_ROOMS`)

Kinds: **href** = navigates to a page · **template** = renders a generated template in place · **Ask prompt** = sends a fixed question to the grounded LLM (`/api/archio`) · **event** = opens a panel.

| Zone · tagline | Door | Kind | Where it goes | Status today (verified) |
|---|---|---|---|---|
| **MARKET FLOOR** "What's happening right now." | Intelligence | href | `/intelligence` | live page |
| | Live Calls | href | `/history` | live page, **mock data** |
| | Forecasts | template | `market.forecast-room` | real renderer, sample data |
| | Daily Brief | Ask prompt | "What matters for EUR/USD today?" | real LLM over **real market data** |
| **THE STUDIO** "Make something today." | Forecast Hub | href | `/forecast` | live page, **sample data**, no table behind it |
| | Copilot | href | `/copilot` | live page, **hard-coded prices** |
| | Post-Mortem | Ask prompt | "Why did I lose yesterday?" | real LLM over a **labelled demo journal** (a fictional trader) |
| | Nexus | href | `/nexus` | live page (synthesis surface, mock) |
| **MENTOR HALL** "Learn from the best." | Compare | template | `mentors.compare-mentors` | real renderer, no mentor data |
| | Collab Hub | href | `/hub` | live page, **mock**, not login-gated |
| | The Cockpit | href | `/cockpit` | live page — **an Education narrative page** (name collision N-7) |
| | Mentor AI | Ask prompt | "What would my mentor flag…" | real LLM, **no mentor data** |
| **THE COLLECTIVE** "Find your ecosystem." | Communities | href | `/communities` | live page — the only door with a **real** data read (`groups` table, mock fallback) |
| | The Floor | Ask prompt | "Summarize what the community is discussing…" | real LLM, **no community data** |
| | My Profile | href | `/profile` | live page, **mock profile** |
| | Controls | event | opens the Flight Deck control panel | opens `12` FD-PANEL-001 |

**Fit misses found by the inspection (D1 sheet KNOWN PROBLEM 7):** THE COLLECTIVE holds **My Profile** and **Controls** (account / settings things, not "ecosystem"); THE STUDIO holds **Post-Mortem** and **Nexus** (review / synthesis, not "make something"); MENTOR HALL's four doors have **no mentor data** behind them and one is an Education page; MARKET FLOOR fits its tagline best. These are observations for you to test, not decisions.

**Other counts you may need:** 16 doors = 9 href · 2 template · 4 Ask · 1 event. A separate **command palette** (keyboard jump to doors / gadgets, `12` FD-SEARCH-001) and a separate **LLM command bar** (`12` AA-AI-001) both exist — three "command" surfaces (`14` N-9). Three unrelated things are called "Hub" (Flight Deck Hub · Community Hub · Student Hub, `14` N-19).

## 4. The D1 decisions you design against (labels matter)

- **DL-023 DECIDED** — privacy: public / marketing / auth / help may be signed-out; the personalised product requires login; profile = public layer + user-controlled social layer + always-private account / intelligence layer. **D1 = boundary only.** *Addendum:* Instagram-familiar configurable visibility (FOUNDER DIRECTION); matrix later.
- **DL-024 DECIDED** — guided empty state: real workspace, **no fake personal numbers / persona**, alive and useful, explains areas, gives first actions, optional gradual configuration, **no large mandatory onboarding**. *Addendum:* short optional post-sign-in tutorial = FOUNDER DIRECTION (may introduce Flight Deck · chart area · Community · controls beside / below the chart · gadgets · navigation · Ask Archio); **full tutorial design = OPEN / later block — do not design it.**
- **DL-025 DECIDED (model) · OPEN (names + placement)** — see §1.
- **DL-026 DECIDED (philosophy) · OPEN (limits)** — signed-out = product-first exploration, TradingView-like; identity asked for at the moment of need (identity · persistence · personalisation · private data · community participation · personal AI context · account information · saved settings · deeper use); never a login wall; never another user's private data. **Which surfaces / actions are explorable vs gated is OPEN (Q-23).**
- **DL-027 DECIDED (direction)** — login and registration both land in the workspace. Routes unchanged.
- **DL-028 FOUNDER DIRECTION** — Ask Archio / the question bar guides exploration conversationally (*what are you? · what can you do? · where do I go? · how does this work?*) and may encourage login / registration at the moment of need. Not a spec; which surface *is* Ask Archio is OPEN (Q-8).
- **DL-029** — face scan = **DEMO/SIMULATION**; real secure auth = FOUNDER DIRECTION; KYC / account integrity = OPEN; five auth concepts never merged. Fate of the face-scan UI = OPEN (Q-27).
- **DL-030 FOUNDER DIRECTION (what it becomes) · OPEN (name)** — highly customisable trader workspace (chart · gadgets · controls beside / below the chart · themes · layout · quick settings · mentor-resold configurations = FUTURE/VISION); a **command center for the trader**. **Do not pick the name.**

## 5. Public / private philosophy in one paragraph

A stranger and a brand-new trader see the **same honest workspace**: the real chart, the real market intelligence, the zones, the question bar — and **no** fabricated personal data. The difference is what happens when they reach for something personal: the stranger is asked to log in / register (DL-026); the new trader sees a guided empty state that explains what that area becomes with real information and offers a first action (DL-024). Personal / private intelligence is never public, never auto-shared through a connection (DL-023). Ask Archio can carry the "what is this / where do I go" conversation for both (DL-028).

## 6. Names — what to say and what not to say (`14` §3.1)

| Current name | Legacy / conflicting names (aliases only) | Note |
|---|---|---|
| **Flight Deck** (`15` L1-1 handle) — UI name **OPEN**: Dashboard · Flight Deck · Command Center | Your Space · Trading Terminal · Vantary · "the cockpit surface" · Home Base · Trader OS (dead) | N-7, DL-030. `/cockpit` = Education page |
| **zones** — MARKET FLOOR · THE STUDIO · MENTOR HALL · THE COLLECTIVE | "rooms" (never — Community tenancy word) | N-10, DL-025, DL-020 |
| **Intent Loop / Decision experience** (`15` L1-2) | Decision Desk · Forecast Hub · Execution Copilot · Copilot · Scenario · trade plan · Pre-Trade Contract | N-1, N-11 — Forecast Hub and Copilot are two *UIs*, not systems |
| **Ask Archio** (`15` L1-6) | Archio AI · Command layer · response engine · Oracle · Jarvis · Nexus AI · Mentor AI | N-2, N-8 — which surface *is* Ask Archio is OPEN (Q-8) |
| **Community & Opportunity** (`15` L1-5) | Community · Social Network · AI Agent Marketplace · COLLECTIVE (a *zone*, not the system) | N-6 |
| **Education** (`15` L1-4) | The Cockpit (`/cockpit`) · Student Hub · mentor method | N-7, N-19 |
| **Account / Money** (`15` L1-7) | Portfolio · Net Worth · Accounts module · My Profile · Controls | N-4 — My Profile / Controls sit in THE COLLECTIVE today |
| **Market Experience** (`15` L1-3) | Signal Terminal (`/`) · Intelligence · Macro | — |
| **trader** | student · member · user | N-13 |

## 7. Rejected and superseded ideas that bear on navigation (`01` rejected table — never re-propose without stating what changed)

Login wall on arrival (DL-026) · demo telemetry shown to a real zero-data user even labelled "DEMO" (DL-024) · large mandatory onboarding before the workspace (DL-024) · renaming the four zones to match `15` (DL-025 — rename for **fit** only) · presenting the timer-based face scan as authentication (DL-029) · "Your Space" / "Trading Terminal" as the product name (DL-030) · TradingView embedded as the *differentiating* centre of the cockpit (fine as a feature) · nine systems designed before the loop · "Truth Keeper" bot · eleven-department Grok org.

**Superseded maps (`15` §3):** the QClay "Locked product map" (SYSTEM 01–09 page inventory) and the `09` §2 nine-system canon are legacy — aliases only. The zones are **not a map** by decision.

## 8. What is deliberately not in this extract

Backend tables, routes, RLS, security flags, the T1 slice — those are the Architect's (`13`). The intent-loop engine documents (`02`, `03`, `10`) — parked; DL-021 keeps the loop at design shape only. The ~50 legacy `docs/` — archaeology. If you need a code fact, cite `08` or write NEEDS-V0-VERIFICATION.
