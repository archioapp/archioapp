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
