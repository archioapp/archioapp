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
