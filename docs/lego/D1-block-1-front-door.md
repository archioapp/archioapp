# D1 — LEGO BLOCK 1 · The Front Door (inspection sheet)

Filed 20 Sep 2026 by v0 for Luke + Kan. INSPECTION / DEFINITION ONLY — no product code was changed. Governing decisions: DL-023 (privacy boundary), DL-024 (guided empty state), DL-025 (four zones kept provisionally). Control records: `12` SH-NAV-001/002/003, SH-STATE-002, FD-PAGE-001, FD-NAV-001, FD-STATE-002/003. Verified on the preview at 910 × 784, signed out, branch `v0/fxp1casso-52674d7b`.

## CURRENT BLOCK

The signed-out arrival path into ARCHIO and the first screen of the Flight Deck (`/dashboard`) exactly as it renders today for someone with no account and no data — before any redesign.

## WHAT EXISTS RIGHT NOW

- **There is no shell.** `app/layout.tsx` mounts only a `FloatingNav` (a left-edge chevron that opens a 5-link menu: Dashboard · Signal Terminal · Macro Economic · Forecast Hub · Community) and a `UserButton` (top-right, shows only when signed in). `app/(main)/layout.tsx` adds the floating Community Hub tab (the red-dot bubble on the left edge), the LLM `CommandLayer`, and toasts. No header, no sidebar, no breadcrumb, no "where am I".
- **Signed-out entry is unguarded.** `lib/supabase/middleware.ts` redirects to `/login` only for eight routes that do not exist as pages (`/usage /support /integrations /developers /status /settings /billing /admin`). Every real route — including `/dashboard`, `/hub`, `/profile`, `/copilot` — returns 200 signed out. Verified: `/dashboard` 200 · `/hub` 200 · `/settings` 307 → `/login?from=/settings`.
- **`/` (root) is the Signal Terminal**, not a landing page: a TradingView EUR/USD chart, a "FOCUS NOW" mock feed, an EXECUTE button. Signed-out visitors land here. Separate landing pages exist at `/welcome` and `/archio` and are reached by nobody by default.
- **`/login`** opens in "face scan" mode: "Enter Archio — Your face is your access key. No passwords. No codes. One identity." The scan is a **timer** (`AccessPortal.tsx` lines 534–535: `setTimeout` 3.4 s → "processing", 5.2 s → "verified" → `onAuthenticated`). `handleFaceAuth` in `app/login/page.tsx` then signs in a **fabricated local user** (`id: "face-auth-user"`, handle `operator`, role `STUDENT`) with no Supabase session. The real path is behind "USE CREDENTIALS INSTEAD" (email + password via Supabase). After either path the page pushes to `?from` or **`/`** (Signal Terminal), never to the Flight Deck.
- **`/register`** (`IdentityCreation`) pushes to **`/copilot`** on completion — a third destination.
- **`/dashboard`** (`app/(main)/dashboard/page.tsx` → `Dashboard` → `YourSpace`, 33,482 lines) is titled **"Command Center | Archio AI"**; the nav calls it **"Dashboard · Private command center"**; the component calls itself **"Your Space"**; the documents call it **Flight Deck**; the browser tab of the rest of the app says **"ArchioAI Trading Terminal"**.
- **First open of `/dashboard`, signed out, zero data, top to bottom:** (1) a session spine — SESSION London · OPENS IN 18m 59s · PLAN 2 TRADES LEFT · RISK USED 0.0% / 3% · FOCUS EUR/USD · XAU…; (2) the **four-zone band** MARKET FLOOR / THE STUDIO / MENTOR HALL / THE COLLECTIVE with taglines, which expands on click into 4 doors per zone under two italic eyebrow groups; (3) **"Welcome back, Marcus." — "Where would you like to go today?"** and an ASK bar whose placeholder rotates ("Ask anything, Marcus…", "Should I size up on EUR/USD today?"); (4) a Jarvis welcome band: DISCIPLINE 72 good · PHASE 2 FTMO 50K · 14 days left in phase · LIVE · TOTAL EQUITY **$113,869** · +$2,184 today · ACCURACY 30D 67 Sharp ▲4.2% · BEST ON EUR/USD 74% · 3W 2L +4.1R net · LAST 5 TRADES (EUR/USD +0.7R TODAY … EUR/USD +2.3R 5D AGO); (5) a theme/deck toolbar (TEAL GLASS · CHART · SPLIT · EXECUTE · AI · ACTIVE · EQUITY · ACCOUNT · PAIRS · CUSTOMIZE); (6) the **TradingView chart bay** (real Polygon bars, EUR/USD 1h, ~1.150) with an execution rail beneath it reading **DISCONNECTED · SELL 1.0863 · BUY 1.0863 · RISK 1.0% · OPEN →**; (7) a "DECK · BELOW CHART" customize strip and roughly six more screens of gadgets (page height 6,084 px at 910 wide).
- **Every personal number above is a hard-coded demo persona ("Marcus", FTMO 50K).** There is no account, trade, plan or event behind any of it (`13` §2). It is shown identically to a signed-out stranger and to a real user.
- **Zone → door contents today** (`FLIGHT_DECK_ROOMS`, `your-space.tsx` line 10766): MARKET FLOOR → Intelligence `/intelligence` · Live Calls `/history` (mock) · Forecasts (template) · Daily Brief (Ask prompt). THE STUDIO → Forecast Hub `/forecast` (sample data) · Copilot `/copilot` (hard-coded prices) · Post-Mortem (Ask prompt over demo journal) · Nexus `/nexus`. MENTOR HALL → Compare (template) · Collab Hub `/hub` (mock, not gated) · **The Cockpit `/cockpit`** (Education page) · Mentor AI (Ask prompt, no mentor data). THE COLLECTIVE → Communities `/communities` (real `groups` + mock fallback) · The Floor (Ask prompt, no community data) · **My Profile `/profile`** (mock) · **Controls** (opens the Flight Deck control panel).
- **Onboarding / first-run:** none. `FlightDeckRoomIgnitionOverlay` is a decorative flame animation on the zone band's top hairline, not a first-run state. The "CUSTOMIZE FLIGHT DECK" rail and customizer panel are commented out ("temporarily hidden"). Layout, theme, side-rail history and deck config persist only in `localStorage` (`vantary-flight-deck-config`, `vantary.trading-desk.v3`, `vantary:side-rail:history:v1`, `confluenceBarMinimized`, `confluenceDockPos`).
- **Empty / loading / error states:** no empty state anywhere on `/dashboard` (demo data fills every slot). Loading: `/login` and `/register` show a spinner with "Checking identity status" / "Preparing identity creation"; `/login` force-renders after 1.5 s if Supabase is slow. Error: only `deck-stage-error-boundary.tsx` around the trading desk; a `?error=auth_callback_failed` message on `/login`. No 404 / not-found design; no global error page.

## EXACT SURFACES / ROUTES / COMPONENTS TO OPEN

1. `/` signed out — `app/(main)/page.tsx` → `components/live-market-intelligence.tsx` (Signal Terminal)
2. `/login` — `app/login/page.tsx` → `components/auth/AccessPortal.tsx` (face scan) · `components/auth/EntryThreshold.tsx` (credentials)
3. `/register` — `app/register/page.tsx` → `components/auth/IdentityCreation`
4. `/dashboard` signed out — `app/(main)/dashboard/page.tsx` → `components/dashboard/dashboard.tsx` → `components/dashboard/vantary/your-space.tsx`
5. The zone band on `/dashboard` — `FlightDeckCockpit` (line 10478) + `FLIGHT_DECK_ROOMS` (line 10766); click each of the four zones
6. The left-edge `FloatingNav` (`components/floating-nav.tsx`) and the Community Hub tab (`components/community-panel/community-hub-gate.tsx`)
7. `lib/supabase/middleware.ts` (read only — the protected list and the July 2026 comment)
8. `/cockpit` — `app/cockpit/page.tsx` (only to see the name collision with your own eyes)

## WHAT LUKE + KAN SHOULD LOOK AT VISUALLY

- On `/` signed out: is this what a stranger should see first? Notice there is no sign-in prompt, no product name, no way to know this is ARCHIO.
- On `/login`: read the headline claim ("No passwords. No codes.") and press READY TO SCAN without doing anything — watch it "verify" you after ~5 seconds. Then look top-right on the next page: you are "operator · STUDENT".
- On `/dashboard` signed out: read the greeting. You are Marcus, funded on FTMO 50K, with $113,869. Judge it against DL-024 — this is the exact thing the decision forbids.
- Click each zone in the band. For each, ask: does the name and tagline describe the four doors beneath it? Pay attention to THE COLLECTIVE holding **My Profile** and **Controls**, THE STUDIO holding **Post-Mortem** (a review), MENTOR HALL holding **The Cockpit** (an Education page) and a Mentor AI with no mentor data.
- Look at door labels at your window width: at 910 px they truncate ("Intelli���", "Live Ca…", "Forecas…", "Daily B…", "Post-Mo…", "The Coc…", "Communi…", "The Flo…", "My Prof…").
- Scroll to the chart. Note the chart is real (Polygon bars, ~1.150) while the execution rail beneath it quotes SELL/BUY **1.0863** and offers an OPEN button on a page with no broker.
- Scroll the whole page once (about eight screens). Ask: which of these would a zero-data trader need on day one?
- Open the FloatingNav (left-edge chevron): five destinations, one called "Dashboard". Compare with the tab title "Command Center" and the documents' "Flight Deck".

## WHAT NEEDS SCREENSHOTTED

Save under `docs/screens/SH/` (1–4) and `docs/screens/FD/` (5–9), dated, at your real window size. Share the same files with ChatGPT / Grok.

1. `SH-root-signed-out.png` — `/` as it loads, nothing clicked
2. `SH-login-face.png` — `/login` initial face-scan screen
3. `SH-login-verified.png` — the moment after the fake scan completes (or the top-right "operator · STUDENT" button on the page it lands on)
4. `SH-floating-nav-open.png` — left-edge nav expanded
5. `FD-first-open.png` — `/dashboard` top of page, signed out, nothing clicked ("Welcome back, Marcus.")
6. `FD-zone-band-open.png` — the band with one zone expanded showing its four doors (one screenshot per zone if labels truncate for you)
7. `FD-chart-and-rail.png` — the TradingView bay with the DISCONNECTED execution rail visible
8. `FD-full-page.png` — full-page capture of `/dashboard` (browser "capture full size" or scroll stitched)
9. `FD-cockpit-page.png` — `/cockpit`, to hold beside the Flight Deck when the rename is decided later

## KNOWN PROBLEMS

Only what was verified in code or on screen during this inspection.

1. **DL-024 is violated on first open by construction.** `/dashboard` greets every visitor — including signed-out strangers — as "Marcus" with a fabricated $113,869 equity, FTMO plan, discipline score and trade history. No empty state exists (`12` FD-STATE-003).
2. **Nothing real is gated (S7).** Middleware protects eight routes that have no page; all existing routes return 200 signed out. The documents said `/hub` self-guards — it does not (guard removed July 2026; corrected today in `12`).
3. **The primary login path is a simulation.** Face scan verifies on a timer and signs in a local fake user with no server session; the copy promises "No passwords" while the only real path is a password.
4. **Three different post-authentication destinations.** Login → `/` (Signal Terminal); register → `/copilot`; nothing sends a user to `/dashboard`. Protected non-existent routes bounce to `/login?from=/settings` and then 404 after sign-in.
5. **Five names for the Front Door surface.** Tab "Command Center | Archio AI" · nav "Dashboard · Private command center" · component "Your Space" · docs "Flight Deck" · site title "ArchioAI Trading Terminal". Plus the `/cockpit` collision (N-7, rename deferred by DL-025).
6. **Signed-out root is a trading terminal, not a front door.** `/` shows a chart and an EXECUTE button to strangers; two unreached landing pages exist elsewhere (`12` F-12).
7. **Zone name-fit misses (DL-025 inspection).** THE COLLECTIVE ("Find your ecosystem") holds My Profile and Controls; THE STUDIO ("Make something today") holds Post-Mortem and Nexus (review / synthesis); MENTOR HALL's four doors have no mentor data behind them; MARKET FLOOR fits its tagline best.
8. **Door labels truncate at 910 px** (nine of sixteen ellipsized).
9. **Execution rail contradicts its own chart:** DISCONNECTED, yet quotes SELL/BUY 1.0863 against a ~1.150 chart and shows an OPEN button with no broker (F10 absent).
10. **No shell.** No header / sidebar / location indicator on any product page; navigation is a hidden left-edge chevron plus the zone band on one page.

## FOUNDER QUESTIONS

Maximum five. Tick and return.

1. **Signed-out `/`:** [ ] a real front door (sign in / create identity, one line of what ARCHIO is) [ ] keep the Signal Terminal public as the "market is open to everyone" surface [ ] redirect to `/login`
2. **Single destination after sign-in and after register:** [ ] `/dashboard` (Flight Deck) for both [ ] keep `/copilot` after register [ ] other: ____
3. **The face-scan login:** [ ] remove from the Front Door until it is real [ ] keep as a visual, but disable the fake "verified" path [ ] keep as is (accepting that it signs in a fake user)
4. **One visible name for the Front Door surface** (tab title, nav label, greeting): [ ] Flight Deck [ ] Command Center [ ] Dashboard [ ] other: ____
5. **Zone fit, after seeing the doors:** for each zone tick keep / rename-for-fit / move a door — MARKET FLOOR [ ] keep [ ] rename · THE STUDIO [ ] keep [ ] rename · MENTOR HALL [ ] keep [ ] rename · THE COLLECTIVE [ ] keep [ ] rename; and: should **My Profile** and **Controls** leave THE COLLECTIVE? [ ] yes [ ] no

## FOUNDER ANSWERS RECEIVED — 20 Sep 2026, second session (recorded in `01` as DL-026 … DL-030 + addenda; the tick boxes above are left as issued)

| Q | Answer | Kind | Ledger |
|---|---|---|---|
| 1 | **None of the three boxes as written.** ARCHIO behaves like a product (TradingView reference), not a marketing site: the signed-out visitor explores the real product environment — especially the chart / trading workspace — and is asked to log in / register at the moment they reach for identity, persistence, personalisation, private data, community participation, personal AI context, account information, saved settings or deeper use. Never a login wall; never another user's private data. **Whether the Signal Terminal at `/` is the right public surface is not decided; the exact signed-out limits are OPEN.** | DECIDED (philosophy) · OPEN (limits) | DL-026 |
| 2 | **`/dashboard` (the Dashboard / Flight Deck workspace) for both** login and registration. Routes not changed yet. | DECIDED (direction) | DL-027 |
| 3 | **Not ticked.** Recorded: the face scan is **DEMO/SIMULATION** (timers + fabricated local user); real secure authentication (device biometrics / passkeys · email · codes · phone) = FOUNDER DIRECTION; KYC / account integrity = OPEN; five concepts never merged. **The fate of the face-scan UI (remove / disable fake path / keep) is still open — `14` Q-27.** No auth implementation changes yet. | DEMO/SIMULATION · FOUNDER DIRECTION · OPEN | DL-029 |
| 4 | **OPEN — do not force.** Founders' live terms: Dashboard · Flight Deck · Command Center (related, unresolved). "Your Space" and "Trading Terminal" are **not** authoritative. What the workspace becomes (highly customisable trader workspace) = FOUNDER DIRECTION. | OPEN (name) · FOUNDER DIRECTION | DL-030 |
| 5 | **OPEN — for Product Brain review.** Zone model kept (provisional); founders are not ready to approve the placement of all 16 destinations; do not rename or move anything; zones ≠ Structural Map systems; zones ≠ Community rooms. **→ 22 Sep 2026: reconciliation complete enough to move forward — PROVISIONAL D1 DESIGN DIRECTION (Luke; Kan async): MARKET FLOOR · TRADING DESK · THE ACADEMY · THE COLLECTIVE; My Profile + Controls leave THE COLLECTIVE for chrome; Nexus leaves for Ask Archio absorption; Forecasts merged to one door. Code unchanged.** | DECIDED (model) · PROVISIONAL (names + placement, Luke) · OPEN (Kan review) | DL-025 addendum → DL-031 |

Also recorded from the same session: guided empty state reconfirmed + a short optional post-sign-in tutorial = FOUNDER DIRECTION, full tutorial design = OPEN / later block (DL-024 addendum) · Ask Archio as conversational guide = FOUNDER DIRECTION (DL-028) · Instagram-familiar configurable visibility (DL-023 addendum).

**Known problems 1–10 — founder marking (FIX IN D1 / ACCEPT FOR NOW / LATER) not yet returned.** Implied by the answers: 1 (demo persona) and 4 (three destinations) have decisions behind them (DL-024, DL-027) but no fix order; 3 (face scan) is classified, not resolved (Q-27); 5 (five names) is OPEN by decision (DL-030); 7 (zone fit) goes to the Product Brain (Q-24).

## WHAT NOT TO TOUCH YET

- No product code: no middleware edit, no RLS or `profiles` policy change, no route rename, no `/cockpit` rename, no removal of demo data, no new empty-state UI.
- **No authentication implementation changes** (DL-029 — founder order): the face scan stays as it is until Q-27 is ticked; no biometric / passkey / email-code / phone / KYC work.
- **No post-auth route change yet** (DL-027 records the destination; a founder orders the route edit).
- **No zone renamed or door moved** before the Product Brain review and a founder decision (DL-025 addendum).
- Not T1 (register → profiles → `/api/users/me`) — founder order.
- Not the social / profile permission matrix (DL-023 explicitly defers it).
- Not the onboarding system, buddy or tutorial (DL-024 allows a lightweight guide later; do not design it in this block).
- Not the 16 door destinations themselves (`/intelligence`, `/forecast`, `/copilot`, …) — each is its own record and its own week.
- Not the theme count (Q-4), the chart / TradingView stance (D2, F-7), `/` after login as a market page (D2), the gadget rails, Jarvis, Strategy OS, the command palette or the trading desk internals.
- Not the two landing pages (`/welcome`, `/archio`) beyond noting they exist.

## DEFINITION OF DONE FOR THIS BLOCK

- [ ] Luke and Kan have each opened surfaces 1–6 above, signed out, on their own machines.
- [ ] Screenshots 1–9 saved under `docs/screens/SH/` and `docs/screens/FD/` and shared with ChatGPT / Grok.
- [~] The five founder questions are answered and returned in chat — **answered in substance 20 Sep (second session), see FOUNDER ANSWERS RECEIVED; Q3 (face-scan UI fate), Q4 (name) and Q5 (zone fit) remain OPEN by founder choice** (`14` Q-27, Q-26, Q-24).
- [ ] LUKE REVIEW / KAN REVIEW set on `12` SH-NAV-001, SH-STATE-002, FD-PAGE-001 and FD-NAV-001 (to REVIEWED — CHANGES REQUIRED, or REVIEWED — APPROVED AS IS).
- [x] The answers are logged as DL entries in `01` (DL-026 signed-out · DL-027 destination · DL-029 face scan · DL-030 surface name · DL-025 addendum zone fit; plus DL-028, DL-023 / DL-024 addenda) and mirrored in `14` §2.1, §2.2, §2.7, §3.1, §5, §9, §10; `12`; `13`; `15` §2; README.
- [ ] Known problems 1–10 are each marked by the founders as FIX IN D1 / ACCEPT FOR NOW / LATER.
- [x] Grok context packs rebuilt for D1 (pack v3, `public/docs/grok/`) so Product Brain · Red Team · Architect carry the current state before they are brought back in.
- [x] ~~Then, and only then, D1 Lego Block 2 opens: the **design definition** of the guided empty state (DL-024), the signed-out exploration limits (DL-026 → Q-23, route + action list), the single post-auth destination (DL-027) and the Product Brain's zone-fit evaluation (DL-025 addendum → Q-24) — still before any product code. **Not opened yet (founder order).**~~ **OPENED 22 Sep 2026 by Luke's order** (Kan reviews asynchronously) after the Product Brain / Red Team reconciliation produced the PROVISIONAL four-zone direction (DL-031). Block 2 = `docs/lego/D1-block-2-first-use.md` — design-definition of the signed-out product-first experience + the guided zero-data first Flight Deck experience across three user states. The unticked boxes above (screenshots, review columns, known-problem marking) are carried into Block 2's definition of done rather than blocking it. Still no product code; T1 not started.
