# D1 — LEGO BLOCK 2 · First Use (design-definition sheet)

Filed 22 Sep 2026 by v0 on Luke's order. **DESIGN-DEFINITION ONLY — no product code is changed by this block; T1 is not started; no bot was asked anything.** Approval: **Luke opened this block. Kan reviews asynchronously** (`14` Q-28) — nothing here is joint final approval. Preceded by Block 1 (`D1-block-1-front-door.md`, inspection). Governing ledger entries: DL-023 (privacy boundary), DL-024 + addendum (guided empty state · optional tutorial = direction), DL-026 (product-first exploration), DL-027 (one post-auth destination), DL-028 (Ask Archio guide = direction), DL-029 (face scan = DEMO/SIMULATION), DL-030 (workspace name OPEN), **DL-031 (four zones = PROVISIONAL D1 DESIGN DIRECTION)**. Control records: `12` SH-STATE-002 · SH-PAGE-001/002 · SH-NAV-001 · FD-PAGE-001 · FD-NAV-001 · FD-STATE-002/003 · AA-AI-001/002. Code facts below were re-verified against the repo on 22 Sep 2026 (branch `v0/fxp1casso-52674d7b`).

## 1. EXACT DESIGN TARGET

We are designing — on paper, in `12` records and in ChatGPT sketches, not in code — **the first-use experience of ARCHIO as one continuous path**: a stranger arrives on a real product surface with the chart / workspace central and no login wall (DL-026); they can look, explore and ask Ask Archio what this is (DL-028); the moment they reach for something that needs identity, persistence, personalisation, private data, community participation, personal AI context, account information, saved settings or deeper use, one consistent **login / register ask** appears and, after login or registration, lands them in the **one** Dashboard / Flight Deck workspace (DL-027); a brand-new user then sees the **real** Flight Deck as an honest **guided empty state** — no Marcus, no FTMO 50K, no $113,869, no fabricated trades — that stays useful and alive, guides the first three to five actions, says what each area becomes once ARCHIO has real information, and offers (not forces) a lightweight tutorial entry (DL-024); the four-zone band reads as the surviving direction — MARKET FLOOR · TRADING DESK · THE ACADEMY · THE COLLECTIVE with 10 destinations + 2 honest shells, profile / controls / Ask Archio living in the chrome (DL-031, provisional); and a returning user with real data sees the same structure filled with **their** numbers. The output is a written definition of what each screen shows in each of three user states, the trigger list and shape of the login / register ask, the route + action list for Q-23, and the zone-band spec — precise enough that a founder can order the first code change knowing exactly what will move. The workspace keeps whichever name the founders later choose (Q-26): the design must not depend on the name.

## 2. WHAT THIS BLOCK DESIGNS AGAINST (read before proposing anything)

| Kind | Statement | Source |
|---|---|---|
| DECIDED | Signed-out visitors may explore appropriate **real** product surfaces, especially the chart / trading workspace; never a login wall on arrival; never another user's private data | DL-026 |
| DECIDED | The boundary is per action / per data (identity · persistence · personalisation · private data · community participation · personal AI context · account information · saved settings · deeper use) — not "gate the product" | DL-023, DL-026 |
| DECIDED (direction) | Login and registration both land in the Dashboard / Flight Deck workspace; routes not yet changed | DL-027 |
| DECIDED | Zero-data first open = GUIDED EMPTY STATE; demo-as-yours rejected even if labelled DEMO; no large mandatory onboarding | DL-024, `01` rejected table |
| FOUNDER DIRECTION | A short optional tutorial after first sign-in may exist; its full design is a later block — this block places only its **entry point** | DL-024 addendum |
| FOUNDER DIRECTION | Ask Archio may explain and navigate conversationally and may naturally encourage login / register at the moment of need — no prompt, intent list or surface is fixed | DL-028 |
| DEMO/SIMULATION | The face scan verifies nothing (timers, `face-auth-user`, no session); the only real path is email + password via Supabase | DL-029 |
| PROVISIONAL (Luke; Kan pending) | Four zones: MARKET FLOOR (Intelligence · Daily Brief · Live Calls) · TRADING DESK (ONE Forecasts · Copilot · Post-Mortem) · THE ACADEMY (Education + honest Compare / Mentor AI shells) · THE COLLECTIVE (Communities · The Floor · Collab Hub); Ask Archio, Nexus, account chrome, Flight Deck customisation = global chrome; Marketplace and Centralized / Decentralized = FUTURE, not in D1 chrome | DL-031, `12` FD-NAV-001 second table |
| OPEN | Exact signed-out limits (Q-23) · face-scan UI fate (Q-27) · workspace visible name (Q-26) · Kan's review of DL-031 and N-21 (Q-28) · what `/` is after login (Q-4, D2) · which landing survives (Q-19) | `14` §9 |

## 3. THREE USER STATES (plain English — what the design must account for; not designed here)

**A. Signed-out explorer.** Someone who arrived by link or search with no account. Today they land on `/` (the Signal Terminal: a real TradingView chart, a mock FOCUS NOW feed, an EXECUTE button) and every route — including `/dashboard` — returns 200 and greets them as "Marcus" with $113,869. The design must let this person **see the real environment** (chart, workspace shape, the four zones, what Ask Archio is) and **understand what ARCHIO is** without a wall, while showing **no personal numbers of anyone** — not Marcus's, not a sample trader's dressed as "yours". Every action that needs identity or persistence produces the same login / register ask, with a return path so they land back where they were once identified. The UserButton is `null` for them today; the design must give them a visible way in (sign in / create identity) somewhere in the chrome. Their `localStorage` layout state (`vantary-flight-deck-config`, theme) may persist per device, but nothing pretends to be an account.

**B. Brand-new signed-in user with zero personal data.** A real Supabase user who has just registered or logged in for the first time. Today they are pushed to `/copilot` (register) or `/` (login) and, if they reach `/dashboard`, see the identical Marcus persona. The design must land them in the workspace (DL-027) and show the **guided empty state**: the real Flight Deck structure — session spine, zone band, Ask bar, chart bay — with honest empty content everywhere a personal number would be (equity, discipline, accuracy, last trades, plan, phase), each area saying what it becomes once ARCHIO has real information, and three to five guided first actions (e.g. look at the market · ask Ask Archio · open a zone · connect / import later · set a preference) — configuration optional and gradual. The execution rail must not offer OPEN on a broker that is not connected. An optional lightweight tutorial entry appears here and is dismissible; the tutorial itself is a later block. Nothing they do not have is faked; nothing they need on day one is missing.

**C. Returning signed-in user with real personal data.** The future state the design must not paint itself out of: the same structure as B, now filled with the trader's own data (accounts, decisions, plan, history) once F5 / F8 / F10 exist. Today this state **cannot exist** — there is no trades / decisions / plan table and no broker connection (`13` §2, `08`). The design must define which slots B's empty state hands over to real data, in place, without a redesign, and must keep C byte-for-byte consistent with A and B in structure so the product never has two Flight Decks. C is described, not designed, in this block.

## 4. EXACT SCREENS / COMPONENTS THIS BLOCK WILL TOUCH (ordered; repo-grounded; read, not edited)

1. **Arrival — `/`** · `app/(main)/page.tsx` → `components/live-market-intelligence.tsx` (Signal Terminal). Block 2 proposes what the signed-out visitor is offered from here (product framing · a way in · the chart central); whether `/` stays the arrival surface is Q-19 / Q-4 — the proposal is written for founder tick, not decided by v0.
2. **The login / register ask (moment of need)** — a pattern with no component yet; today the nearest things are `/login` (`app/login/page.tsx` → `components/auth/AccessPortal.tsx` face scan · `components/auth/EntryThreshold.tsx` credentials) and `/register` (`app/register/page.tsx` → `components/auth/IdentityCreation`). Block 2 defines the trigger list, where the ask appears, its copy intent and its return path. **Q-27 (face-scan UI fate) is a prerequisite tick** — the ask cannot be drawn around a screen whose fate is open.
3. **Post-auth destination** — `app/login/page.tsx` lines 46 / 75 / 89 (`router.push(from)`, `from` defaults to `/`) and `app/register/page.tsx` line 25 (`router.push("/copilot")`). Block 2 writes the rule: both → `/dashboard`, and whether `?from` is honoured after an in-product ask (return to where they were) — decided by founders, changed in code later.
4. **`/dashboard` first screen** — `app/(main)/dashboard/page.tsx` → `components/dashboard/dashboard.tsx` → `components/dashboard/vantary/your-space.tsx` (33k lines). The parts Block 2 defines per state: the session spine; the greeting block (`"Welcome back, {telemetry.trader.name}."` at ~line 14917 and "Where would you like to go today?"); `AskVantaryBar` (~line 15052, the single AI entry point, placeholder rotates "Ask anything, Marcus…"); `JarvisWelcomeBand` (~line 16843: DISCIPLINE · PHASE · EQUITY · ACCURACY · LAST 5 TRADES); and the demo source `useTraderTelemetry` (~line 12857: `trader.name "Marcus"`, `firm "FTMO 50K"`) over `ACCOUNTS` / `PERFORMANCE` in `components/dashboard/dashboard-data.ts`. The guided empty state replaces every personal slot for states A and B.
5. **The zone band** — `FlightDeckCockpit` (~line 10478) + `FLIGHT_DECK_ROOMS` (~line 10766) in `your-space.tsx`. Block 2 writes the band spec on the DL-031 direction (4 zones × job × destinations, honest status per destination, label fit at ≥ 910 px, where Profile / Controls / Nexus go instead). Code untouched.
6. **Chart bay + execution rail** — `components/dashboard/vantary/trading-desk/` (`12` FD-SECTION-002; real Polygon bars via TradingView). The one element that stays central and real in all three states; Block 2 defines what states A and B see on the rail (today: DISCONNECTED yet SELL / BUY 1.0863 and an OPEN button — Block 1 KNOWN PROBLEM 9). Note N-21: this surface is also called "Trading Desk".
7. **Global chrome** — `components/floating-nav.tsx` (left-edge chevron: Dashboard · Signal Terminal · Macro Economic · Forecast Hub · Community), `components/auth/UserButton.tsx` (top-right; `return null` when signed out; Sign out when in), `components/command/CommandLayer.tsx` (LLM command bar, mounted in `app/(main)/layout.tsx`), the Community Hub tab (`components/community-panel/community-hub-gate.tsx`), and the Flight Deck control room entry (`flight-deck-hub:toggle` → `cartouche/flight-deck-hub.tsx`, FD-PANEL-001). Block 2 says where four things live, one place each: sign in / create identity (state A) · account / avatar chrome (B, C) · Ask Archio entry · Flight Deck customisation entry.
8. **`lib/supabase/middleware.ts`** (read-only) — public prefixes `/welcome /pitch /docs /_next /api/health`; protected roots are eight routes with no page. The Q-23 route + action list is written against this file; **no edit in this block.**

Not on this list on purpose: the ten destinations themselves (`/intelligence`, `/forecast`, `/copilot`, `/history`, `/cockpit`, `/communities`, `/hub`, `/nexus`, `/profile`, the Ask prompts), the gadget rails below the chart, Strategy OS, Jarvis internals, the theme system, the two landing pages (`/welcome`, `/archio`).

## 5. WHAT LUKE SHOULD SCREENSHOT / SEND TO CHATGPT BEFORE DESIGN WORK

Five, at Luke's real window size, signed out unless stated; dated files under `docs/screens/SH/` and `docs/screens/FD/`. If Block 1's nine were already taken, reuse 1–5 of these from that set — do not retake.

1. **`SH-root-signed-out.png`** — `/` as it loads, nothing clicked. *The arrival truth: chart, EXECUTE, no product name, no way in.*
2. **`FD-first-open.png`** — `/dashboard`, top of page, signed out. *One frame must hold the session spine, the zone band, "Welcome back, Marcus.", the Ask bar and the Jarvis band — this is states A and B's problem in one picture.*
3. **`FD-zone-band-open.png`** — the band with **one** zone expanded showing its four doors, at the width Luke actually uses (labels truncate at 910 px). *ChatGPT redesigns these labels onto the DL-031 names; it needs the real widths.*
4. **`FD-chart-and-rail.png`** — the TradingView bay with the DISCONNECTED execution rail and its OPEN button visible. *The element that stays; the rail that must stop implying execution.*
5. **`SH-login-face.png`** — `/login` initial face-scan screen. *The moment-of-need ask will either reuse or replace this; ChatGPT must see what exists.*

Optional sixth, only if a real Supabase account exists: **`FD-first-open-signed-in.png`** — `/dashboard` top of page signed in as that account, to show ChatGPT it is identical to the signed-out frame (it is, by code; a picture makes it undeniable).

Not needed for this block: the full-page capture, `/cockpit`, the floating nav open, the post-scan "operator · STUDENT" button — Block 1 covers them and they are not design inputs here. Send with the screenshots: the DL-031 text from `01`, this sheet's §1–§3, and the second table of `12` FD-NAV-001 — not the whole of `12`.

## 6. WHAT D1 BLOCK 2 MUST NOT TOUCH

- **No product code.** No middleware edit, no route change, no `FLIGHT_DECK_ROOMS` rename or move, no removal of the demo persona, no new component, no RLS / `profiles` policy change. The block ends with definitions and records, and a founder orders the first code block separately.
- **Not T1** (register → `profiles` → `/api/users/me`) — founder order.
- **No authentication implementation** (DL-029): the face scan stays exactly as it is until Q-27 is ticked; no biometric / passkey / email-code / phone / KYC work.
- **Not the tutorial** (DL-024 addendum): only its entry point and dismissal are placed; the onboarding system, buddy or tutorial content are a later block.
- **No final names:** zone names stay reversible (TRADING DESK ↔ Workbench / Studio; THE ACADEMY ↔ alternatives); the workspace name (Q-26) is not chosen — the design tolerates all three; `/cockpit` is not renamed (N-7).
- **No Forecasts modes** (public / mine / create) — one door, nothing behind it designed.
- **No Marketplace design;** it stays a FUTURE note under THE COLLECTIVE.
- **No Centralized / Decentralized UX;** no blockchain infrastructure, tokenomics or liquidity-provider architecture; never imply wallet / broker execution exists.
- **Not the ten destinations' own pages,** the gadget rails, Jarvis, Strategy OS, the command palette internals, the theme count (Q-4 / `12` §8.14), the TradingView stance (D2, F-7), or what `/` becomes after login (Q-4, D2).
- **Not the social permission matrix** (DL-023 defers it) — only the public-vs-authenticated boundary.
- **No Nexus deletion** (DL-031: absorption candidate, code kept; fate in D4).
- **No Grok pack rebuild and no question to any bot** (founder order). Pack v3 is noted stale in `09` §3; a rebuild waits for a founder-approved reason.

## 7. DEFINITION OF DONE — what must be decided and designed before product code can safely change

**Decided (founder ticks; Luke now, Kan asynchronously — record who ticked):**

- [ ] **Q-23 route + action list** ticked: per surface → *public* / *ask at need* / *authenticated*; per action → the exact triggers of the login / register ask (save layout · follow · post · join · ask a personal question · view own history · open account · connect broker · …).
- [ ] **Arrival surface** named for state A (`/` as the Signal Terminal · a product-first front on the workspace · other) — a proposal from this block, ticked under Q-19 / DL-026 limits.
- [ ] **Q-27** face-scan UI fate ticked — remove / disable fake path / keep as visual.
- [ ] **Return rule** after an in-product ask: `?from` honoured (back to where they were) or always `/dashboard` first (DL-027 detail).
- [ ] **Q-28** Kan's review of DL-031 + this sheet recorded — or Luke explicitly records "proceeding without Kan's review" — and **N-21** (Trading Desk name collision) resolved before any label is drawn.
- [ ] Block 1 KNOWN PROBLEMS 1–10 each marked FIX IN D1 / ACCEPT FOR NOW / LATER (carried over, still unmarked).

**Designed (v0 + ChatGPT deliverables — records and sketches, no code):**

- [ ] **State A / B / C definitions** of the first screen of `/dashboard`, section by section (spine · zone band · greeting + Ask bar · Jarvis band · toolbar · chart bay · execution rail · below-chart deck): what each shows, in words, per state — written into `12` FD-STATE-002 / FD-STATE-003 and a new **FD-STATE-006 · Signed-out explorer state** record.
- [ ] **The login / register ask** has one record (new `SH-STATE-003` or `SH-MODAL-001`): trigger list, where it appears, copy intent, return path — **one pattern reused everywhere**, never a wall.
- [ ] **Zone band spec** on the DL-031 direction, written into FD-NAV-001 as the design target: 4 zones × job × destinations, one-line honest status per destination (live · demo · shell), label fit at ≥ 910 px, and where Profile / Controls / Nexus / Ask Archio live in the chrome instead.
- [ ] **Guided empty state content list:** for every personal slot, what it *says* when empty (what it becomes with real data) and the three to five first actions it guides — with an explicit check that no demo persona, number or trade appears anywhere in states A or B.
- [ ] **Global chrome sketch:** one place each for sign in / create identity (A) · account / avatar chrome (B, C) · the Ask Archio entry · the Flight Deck customisation entry; the execution rail's A / B behaviour stated (no OPEN without a broker).
- [ ] **Optional tutorial entry:** only its location and dismissal noted; a pointer to the later block.
- [ ] Screenshots 1–5 saved under `docs/screens/` and referenced from the records' `SCREENSHOT / VISUAL REFERENCE` fields.
- [ ] LUKE REVIEW set on SH-STATE-002, FD-PAGE-001, FD-NAV-001, FD-STATE-002 / 003 (KAN REVIEW set asynchronously or recorded pending).
- [ ] A **Context Delta** (`14` §7.2) written for Block 2 — the only thing later pasted to a bot.
- [ ] **Then, and only then,** a founder may open the first code block, whose order of edits this sheet already implies: (1) remove the demo persona from states A / B behind the empty state → (2) one post-auth destination → (3) zone band on the DL-031 names (after Q-28 / N-21) → (4) the login / register ask pattern → (5) the middleware / route list. Each is its own commit, each verified on the preview signed out and signed in.
