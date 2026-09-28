# D1 technical context — dated v0 verification extract for the Architect (20 September 2026)

*Prepared by v0 from `docs/source-of-truth/13-technical-backend-control-center.md` (§2 inventory · §3.2 · §3.4 · §4 F1–F15 · §7 S1–S10 · §8 · §9), `docs/lego/D1-block-1-front-door.md` (D1 inspection, verified on the preview 20 Sep 2026 at 910 × 784, signed out) and `01` (DL-023 … DL-030). This is a **dated v0 verification note** in the sense of governance rule 3 — you may cite it as "`13` <section>" or "v0 verification 20 Sep 2026". It resolves `14` §8's "Architect should receive `13` §3 + §7 as a verification note". Where `08` (17 Sep) and this extract disagree, this extract wins; where this extract and `01` disagree, `01` wins. Nothing here is designed — only located and classified. You ground; Luke + Kan decide.*

## 1. Runtime facts you will need (`13` §2.1)

Next.js **14.2.25** App Router with `middleware.ts` (not `proxy.ts`), React 19, TypeScript with **483 `tsc` errors suppressed at build** (`ignoreBuildErrors`, `ignoreDuringBuilds`). Supabase (`@supabase/supabase-js@2.58`, `@supabase/ssr@0.7`) = Postgres + Auth + RLS via `lib/supabase/{client,server,middleware}.ts`. `stripe@18.5`. Polygon.io REST (`lib/providers/polygonRest.ts`). AI: `ai@6.0.x` via **Vercel AI Gateway** (`openai/gpt-4.1-mini`, `openai/gpt-5-mini`; no provider package). **No background jobs, no cron, no queue, no file / media storage, no Supabase Realtime usage.** State: 12 zustand stores, React context, `swr` (light), **8 `localStorage` keys**. Tests: 4 jest files. Env vars unused by any code: `GEMINI_API_KEY`, `API_KEY`.

## 2. Database — every table that exists (`13` §2.2) · `CANNOT VERIFY LIVE DB FROM REPO` applies to all

No `supabase/migrations/`, no migration tool; ten hand-run SQL files in `scripts/`. `groups` / `group_members` are **defined three times** with different columns and policy names (§3.4).

| Table | Defined in | Key columns | RLS | Code readers / writers | Status |
|---|---|---|---|---|---|
| `profiles` | `001_auth_schema.sql` | `id→auth.users`, `display_name`, `bio`, `avatar_url`, `verified_level 0–3`, timestamps; trigger `handle_new_user` creates the row on signup | **select all (`USING (true)`)** · insert / update / delete own | 2 API routes (`/api/users/me`, `/api/users/profile`) — **no UI caller**; the UI reads `useProfile` (mock, `localStorage`) | `PARTIAL` |
| `organizations` · `rooms` · `memberships` · `invites` | `001` | Model B tenancy (org → rooms → memberships; `rooms.visibility public/private/invite_only`; `memberships.role admin/creator/moderator/member/pending/banned`) | member / admin / owner policies | Zod-validated REST (`/api/orgs*`, `/api/rooms*`, `/api/memberships*`, `/api/invites*`) — **no UI** | `PARTIAL` (backend only) — **Model B is the DECIDED tenancy model (DL-020); no migration approved** |
| `plans` · `subscriptions` | `001` + `002_seed_plans.sql` | Stripe ids, `status`, `billing_cycle` | select all / own | checkout · portal · current · webhook — **no UI** | `PARTIAL` (webhook writes; nothing displays) |
| `groups` · `group_members` (+ `group_invites`, `group_posts`, `forecast_groups`, `community_mentors`) | `community-schema.sql` · `community.sql` · `create-community-tables.sql` · `004` · `005` · `006` seed | Model A tenancy + 12 discovery columns; `community_mentors` seeded | select all · owner / admin write | `/api/communities` GET (mock fallback) is the **only** real UI data read in the product | `REAL` read path if seeded — **Model A SUPERSEDED for design (DL-020); tables preserved as repo facts** |
| `forecast_groups` | `community-schema.sql` | `forecast_id` with **no FK** ("References forecasts table (to be created)") | member | **0** | dead, orphaned — **no `forecasts` table exists anywhere** |
| `copilot_events` | `copilot-tables.sql` | `id uuid, type, ts bigint, session_id, user_id, context jsonb, data jsonb` | select `auth.uid()=user_id OR user_id IS NULL` · **insert `with check (true)`** | 1 insert in `lib/copilot/persist.ts` — **never called** (§3) | **dormant / dead + SECURITY FLAG** |
| `mentor_notifications` | `copilot-tables.sql` | `mentor_id`, `entry_id`, `from_user_id`, `kind`, `read` | select own · **insert `with check (true)`** | 1 insert (`/api/copilot/notify-mentor`, service role, **no auth**) — **no reader** | `PARTIAL` + **SECURITY FLAG** |

**Tables the product surfaces need that do not exist anywhere:** `decision_records`, `trades`, `decision_reviews`, `forecasts`, `journal_entries`, `rules` / `playbooks`, `accounts` (broker), `user_preferences` / `layouts`, `events` (typed, per-user, readable), `notifications` (generic), `courses` / `lessons` / `progress`, `sessions` (live), `messages`.

## 3. `copilot_events` — the corrected reading rule (founder instruction 20 Sep 2026; re-verified from code the same day, `13` §3.2)

| Asked | Verified finding |
|---|---|
| What writes to it | `lib/copilot/persist.ts` → `persistCopilotEvents(events)` → `.from("copilot_events").insert(events)` with the **browser anon key**. Imported **only** in `components/copilot/CopilotProvider.tsx`, where both the import (line 6) and the call `copilotBus.startFlushLoop(persistCopilotEvents, 4000, 40)` (line 49) are **commented out**. |
| What reads it | **Nothing.** `grep copilot_events` over `app/ components/ lib/` returns only `persist.ts`. |
| Does `/api/copilot/chat` write it | **No.** `app/api/copilot/chat/route.ts` is a keyword matcher with **no DB operation at all**. The 17 Sep `08` line "Written from `app/api/copilot/chat`" was wrong and is corrected. |
| Does `/api/archio` read it | **No.** `app/api/archio/route.ts` contains no `.from()` call; its "journal" is `lib/response-engine/journal.ts` (a labelled demo book). |
| Verdict | **Dormant / dead pattern. Not an active persistence pipeline. Not a real event spine.** Its *row shape* (append-only JSONB events) is at most a reference. Any proposal that "reuses" it is reviving a dead table under fixed policies (S2, S3) — say so; never say "extend". |

## 4. Authentication, session and the Front Door — as verified (`13` §2.4, D1 sheet)

- **F1 Identity = `REAL`.** Supabase Auth via the browser client for sign-up / in / out / reset; SSR cookie refresh in `lib/supabase/middleware.ts` (`updateSession`); `lib/auth/AuthProvider.tsx` exposes `useAuth()` with `role` from `user_metadata.role` (default `"STUDENT"`). Role model `STUDENT | MENTOR | ADMIN`; `RequireRole` exists and is **used by nothing**. A second, REST auth layer (`/api/auth/*`, 7 routes) is a **dead duplicate** with zero UI callers — `/api/auth/signup` is the only place a *role* is written and it is unreachable.
- **The `/login` face scan = DEMO/SIMULATION (DL-029).** `components/auth/AccessPortal.tsx` lines 534–535: `setTimeout` 3.4 s → "processing", 5.2 s → "verified" → `onAuthenticated`. `handleFaceAuth` in `app/login/page.tsx` (83–89) signs in a **fabricated local user** (`id: "face-auth-user"`, handle `operator`, role `STUDENT`) — **no Supabase session, no biometric check**. The real path (email + password) hides behind "USE CREDENTIALS INSTEAD". **UI fate OPEN (Q-27). No implementation change ordered.**
- **Post-auth destinations (DL-027 — routes unchanged):** `/login` pushes to `?from` or **`/`**; `/register` (`IdentityCreation`) pushes to **`/copilot`**; nothing sends anyone to `/dashboard`. `?from` on a protected-but-missing route (`/settings`) → `/login?from=/settings` → after sign-in → **404**.
- **Middleware (`lib/supabase/middleware.ts`, S7):** public prefixes `/welcome /pitch /docs /_next /api/health`; redirects to `/login` **only** for `/usage /support /integrations /developers /status /settings /billing /admin` — **none exist as pages.** `/profile /hub /copilot /nexus /intelligence` were deliberately removed from protection in July 2026 (code comment: they render demo telemetry). `/hub`'s own page-level guard was also removed July 2026 — **it does not self-gate** (verified HTTP 200 signed out; earlier documents said otherwise — corrected 20 Sep). Verified: `/dashboard` 200 · `/hub` 200 · `/settings` 307.
- **Client-side persistence on the Flight Deck:** layout, theme, deck config and side-rail history live only in `localStorage` (`vantary-flight-deck-config`, `vantary.trading-desk.v3`, `vantary:side-rail:history:v1`, `confluenceBarMinimized`, `confluenceDockPos`). Nothing server-side (F8 MISSING).
- **Every personal number on `/dashboard` is a hard-coded demo persona** ("Marcus", FTMO 50K, $113,869) — no account, trade, plan or event behind any of it. The execution rail reads DISCONNECTED and quotes 1.0863 under a real ~1.150 Polygon chart (F10 absent).

## 5. API routes — the ones D1 touches (`13` §2.3; 37 routes total, 19 with zero UI callers)

| Route | Auth in handler | UI callers | Status |
|---|---|---|---|
| `/api/auth/*` (7) | mixed | **0** | dead duplicates of the browser-client auth |
| `/api/users/me`, `/api/users/profile` | yes | **0** | `PARTIAL` — the T1 slice's read path (not started) |
| `/api/users/[id]` | **no** | 0 | `PARTIAL` |
| `/api/archio` | **no** | 1 (`ask-answer-surface`, the ASK bar + the four Ask-prompt doors) | `REAL` LLM, grounded on Polygon + demo journal |
| `/api/command` | **no** | 1 (`CommandRail`) | `REAL` LLM, **ungrounded** |
| `/api/copilot/chat` | no | 3 | `MOCK/DEMO` keyword matcher, no model, **no DB** |
| `/api/copilot/notify-mentor` | **no** + service role | 1 | **SECURITY FLAG S1** |
| `/api/communities` | public read | 2 | `REAL` with mock fallback |
| `/api/polygon/*` (2), `/api/market/*` (3) | **no** | 3 / 9 / 1 / 4 / 3 | `REAL`, unauthenticated paid proxies (S6) |
| `/api/market/stats` | — | 2 callers | **route does not exist** |

## 6. Foundations F1–F15 — status and verdict at a glance (`13` §4; nothing designed)

| F | Foundation | Status | Verdict | D1 relevance |
|---|---|---|---|---|
| F1 | Identity | REAL | REUSE (delete dead REST layer) | DL-029: Supabase Auth is the real path; face scan is UI, not F1 |
| F2 | Permissions & privacy | PARTIAL + SECURITY FLAG | REFRAME — privacy model first, policies follow. **First paragraph exists = DL-023**; matrix is a later block | DL-023 / DL-026 boundary; S7, S8 |
| F3 | Community tenancy (×2) | PARTIAL, duplicated | **DECIDED Model B** (DL-020); Model A superseded for design; **no migration approved** | none in D1 |
| F4 | Event / persistence spine | MISSING (dead shape) | REFRAME shape / REBUILD policies | none in D1 — do not propose building it |
| F5 | Trading memory / Intent | MISSING | REBUILD — **design shape only, no implementation (DL-021)** | DL-024: every Flight Deck number needs F5; none exists → honest zero-data state is the only truthful option today |
| F6 | Market-data gateway | REAL (unauth) | REUSE + harden | the one real thing a signed-out visitor can see honestly (DL-026) |
| F7 | Grounded AI | REAL (General only, unauth) | REUSE `/api/archio` pattern; retire / relabel `/api/copilot/chat`; decide whether `/api/command` merges | DL-028: the conversational guide would ride F7; personal grounding needs F4 / F5 |
| F8 | Personal memory | MISSING | REBUILD on F4 | DL-030 customisation has nothing behind it but `localStorage` |
| F9 | Notifications | MISSING + SECURITY FLAG | REBUILD as F4 consumer | none in D1 |
| F10 | Integrations (broker) | MISSING | REBUILD (CSV first) | the DISCONNECTED rail; no broker |
| F11 | Real-time / live | MISSING | REBUILD | none in D1 |
| F12 | Billing | PARTIAL (backend real, no UI) | REUSE | none in D1 |
| F13 | File storage | MISSING | REBUILD when needed | avatars (`profiles.avatar_url`) have nothing behind them |
| F14 | Education / content | MISSING | direction DECIDED combination (DL-022); shape follows FLOWS | `/cockpit` is an Education page (N-7) |
| F15 | Search | PARTIAL | REUSE / MISSING | command palette is in-memory |

**Real: 3 (F1, F6, F7). Partial: 4 (F2, F3, F12, F15). Missing: 8.**

## 7. Security flags register S1–S10 (`13` §7 — exists and is unsafe as written; **flag, do not fix**)

| # | Flag | Path | Severity | Fix class (for later, not D1) |
|---|---|---|---|---|
| S1 | `notify-mentor` route: service-role key, no session check, arbitrary ids from body | `app/api/copilot/notify-mentor/route.ts` | **High** | add auth; derive `from_user_id` from session |
| S2 | `copilot_events` insert `with check (true)` | `scripts/copilot-tables.sql:30` | High if ever enabled | `with check (auth.uid() = user_id)` |
| S3 | `copilot_events` select `… OR user_id IS NULL` | `scripts/copilot-tables.sql:26` | Medium | drop the `IS NULL` clause |
| S4 | `mentor_notifications` insert `with check (true)` | `scripts/copilot-tables.sql:39` | Medium | server-only insert with an authenticated caller |
| S5 | LLM routes unauthenticated | `/api/archio`, `/api/command` | Medium (cost) | session check + quota |
| S6 | Polygon / market proxies unauthenticated | `/api/polygon/*`, `/api/market/*` | Low–Medium | session check + cache |
| S7 | Middleware protects only non-existent routes | `lib/supabase/middleware.ts` | Low today, **High the day real data lands** | **rule decided (DL-023) and refined (DL-026): the boundary is per action / per data, not a blanket gate; the route + action list is a D1 output; the middleware change follows founder tick-off (Q-23), not before** |
| S8 | `profiles_select_all USING (true)` | `001_auth_schema.sql:27` | Low–Medium | **DL-023: whole-row `USING (true)` is wrong by definition once any private field lives in `profiles`; fix = separate public from private (schema / view) — a future dedicated block, not D1** |
| S9 | Browser-side anon-key insert path exists (`persist.ts`) | `lib/copilot/persist.ts` | Low (disabled) | delete or move server-side |
| S10 | 483 TS errors suppressed at build | `next.config` | correctness risk | burn-down |

## 8. The D1 decisions and the code they touch (facts only — the *implications* are your task when a founder sends it)

| Decision · label | Touchpoints in code (verified) | Related flags / foundations |
|---|---|---|
| **DL-026** signed-out = product-first exploration; identity at the moment of need — DECIDED philosophy · **OPEN limits (Q-23)** | `lib/supabase/middleware.ts` protected list (8 non-existent routes) and public prefixes; the July 2026 comment removing `/profile /hub /copilot /nexus /intelligence` from protection; `/hub` page guard removed; every real route 200 signed out; `/` = Signal Terminal on `generateMockPriceData` while F6 is real | S7, S8, F2, F6 |
| **DL-027** one post-auth destination = Dashboard / Flight Deck workspace — DECIDED direction, **routes unchanged** | `app/login/page.tsx` push to `?from` ∥ `/`; `app/register/page.tsx` (`IdentityCreation`) push to `/copilot`; `?from` → 404 on missing routes | F1 |
| **DL-024** guided empty state — DECIDED (+ tutorial FOUNDER DIRECTION, full design OPEN) | `components/dashboard/vantary/your-space.tsx` (33,482 lines) demo persona; `dashboard-data.ts`, `oracle-data.ts`, `trading-desk/data.ts`, `strategy-os/data.ts` (mock registries, `13` §2.10); `12` FD-STATE-002/003 NOT DESIGNED; no table behind any personal number | F5, F8, F10 all MISSING; F6, F7 REAL |
| **DL-029** face scan DEMO/SIMULATION · real auth FOUNDER DIRECTION · KYC OPEN (Q-25) · UI fate OPEN (Q-27) · five concepts never merged | `AccessPortal.tsx` 534–535; `app/login/page.tsx` 83–89 (`face-auth-user`); `lib/auth/AuthProvider.tsx`; dead `/api/auth/*`; `profiles.verified_level 0–3` column exists with nothing behind it | F1 REAL; no passkey / WebAuthn / phone / KYC code exists anywhere (`13` §2.1 env + deps) |
| **DL-023** privacy boundary DECIDED · matrix later · Instagram-style visibility FOUNDER DIRECTION | `profiles` = `display_name`, `bio`, `avatar_url`, `verified_level` (all readable by `USING (true)`); `auth.users` holds email; `user_metadata.role`; no visibility / consent field on anything | S8, F2 |
| **DL-030** workspace name OPEN (Q-26) · customisable workspace FOUNDER DIRECTION | five names in code (tab title · nav label · `YourSpace` component · site title); `localStorage`-only layout persistence; "CUSTOMIZE FLIGHT DECK" rail commented out | F8 MISSING |
| **DL-025** four zones — model DECIDED · names + placement OPEN (Q-24) | `FLIGHT_DECK_ROOMS` (`your-space.tsx` ~10766), `FlightDeckCockpit` (~10478); door kinds href / template / Ask prompt (`/api/archio`) / event | F7 (four Ask doors, three without data) |
| **DL-028** Ask Archio as conversational guide — FOUNDER DIRECTION only | `/api/archio` (grounded, `ask-answer-surface`) vs `/api/command` (ungrounded, `CommandRail`) vs `/api/copilot/chat` (scripted) — three "command" surfaces (N-9); which is Ask Archio is OPEN (Q-8) | F7, S5 |

## 9. The T1 slice — defined, **not started** (founder order)

`/register` → `profiles` row (trigger `handle_new_user`) → `/api/users/me` read → a real `/profile`. Everything in it already exists on the backend (`13` §8: Account / Money "cheapest honest step = a real `/profile` reading `profiles`; a settings page"); the UI reads a mock store instead. **T1 opens only when a founder orders it — after D1's boundary (Q-23) is ticked, because T1 reads S7 / S8 with that boundary in hand (`01` DL-023).** Do not spec it in D1.

## 10. The Owen / TradeLocker ask — read-only; design as if the answer is no

Owen (TradeLocker) has been asked, via Mahdi, for **read-only order history including pending / bracket orders — no execution** (DL-004 PROPOSED: read-only data partner in v2, no execution before v3 evidence; never "sixth-tab killer"). Sharpened by `13` §10: (a) the read-only order / fill history endpoint, its auth model and the field list per fill; (b) whether timestamps are exchange or server time (needed for `lock_lead_seconds`, DL-013); (c) rate limits for a polling importer; (d) nothing about execution. **Design consequence for every spec:** CSV import is the outcome lane in v0; broker read-only is v2; broker write never appears. The Owen deck already states "not connected" honestly. **None of this is D1 work.**

## 11. Not verifiable from the repo (`13` §9 — write NEEDS-V0-VERIFICATION only for things *not* on this list; these are already known unknowns)

Live schema state · which `groups` DDL is applied · whether the `006` seed ran · Supabase Auth redirect / callback config · Stripe dashboard products vs `plans` seed · Polygon plan / quota · AI Gateway spend · whether `FINNHUB_KEY` / `ALPHAVANTAGE_KEY` are set in production · whether `profiles_select_all` was ever *intended*.

## 12. What is deliberately not in this extract

The AI inventory A1–A16 (`13` §6), the QClay / outside-engineer quote decomposition (`13` §10), the intent-loop object schemas and evidence ladder (`00` §6, `02`, `03`, `10` — parked under DL-021), the 16 Aug audit (superseded by `13`). If a D1 implication needs one of them, write NEEDS-V0-VERIFICATION naming the section and stop.
