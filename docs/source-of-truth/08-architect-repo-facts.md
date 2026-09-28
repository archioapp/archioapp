# ARCHIO — repo facts for the bots (v0-verified, 17 Sep 2026 · one row corrected 20 Sep 2026, DL-019 · connect-candidate + legacy-audit lines corrected 20 Sep 2026, second session)

*Paste this into every Grok bot. It is the only authorised description of what exists in code. If a claim about the codebase is not here or in a dated v0 verification note, treat it as UNVERIFIED. Newest date wins.*

## Size and shape

- **337,512 lines** of TypeScript/TSX across **819 files** (`app/` 4,501 · `components/` 319,725 · `lib/` 12,717 · `hooks/` 569). The often-quoted "48k" is two dashboard files only.
- Next.js App Router · React · Tailwind · Supabase (Postgres + Auth + RLS) · Stripe · Polygon.io market data · AI SDK. Branch `v0/fxp1casso-52674d7b`.
- Largest files: `components/dashboard/vantary/your-space.tsx` (33,482), `vantary-modules.tsx` (14,882), `components/forecast-hub/forecast-detail-intelligence.tsx` (13,513). These are UI; they persist nothing about trading.

## REAL (persisted or server-verified)

| System | Where | Notes |
|---|---|---|
| Auth (signup/login/reset/session) | `app/api/auth/*`, `scripts/001_auth_schema.sql` | Supabase Auth, RLS on all tables |
| Orgs · rooms · memberships · invites · profiles | `app/api/orgs`, `rooms`, `memberships`, `invites/[token]`, `users/*` | Zod-validated, session-checked; tables referenced in code: `organizations, rooms, memberships, invites, profiles, groups, group_members` |
| Billing | `app/api/subscriptions/*`, `app/api/stripe/webhook` | Checkout from DB plans; webhook verifies signature; tables `plans, subscriptions` |
| Market data | `app/api/polygon/snapshot`, `polygon/bars`, `market/agg`, `market/candles`, `market/overlays` | Real Polygon.io, server-side |
| AI response engine | `app/api/archio/route.ts` | Deterministic routing → real Polygon snapshot + 48 hourly bars → grounded prompt that forbids inventing numbers → schema-validated streamed JSON envelope. **The journal it analyses is a labelled demo book** (`lib/response-engine/journal.ts`, `source: "demo-journal"`) |
| Event log (schema only — **dead table**) | `public.copilot_events` (`scripts/copilot-tables.sql`) | `id uuid, type text, ts bigint, session_id text, user_id uuid, context jsonb, data jsonb`. ~~Written from `app/api/copilot/chat`.~~ **[CORRECTED 20 Sep 2026, DL-019:** the table has **no writer**. The only insert is `lib/copilot/persist.ts` → `persistCopilotEvents`, whose sole call site in `components/copilot/CopilotProvider.tsx` (import line 6, `startFlushLoop` line 49) is commented out; `app/api/copilot/chat` is a keyword matcher that writes nothing; nothing reads the table. Its *shape* is reusable, the table is not live — `13` §3.2.**]** **SECURITY-FLAG:** RLS insert policy is `with check (true)` — anyone can insert; select policy also exposes `user_id IS NULL` rows to every authenticated user (`13` §7 S2, S3). Must be closed before real trader data. |
| Mentor notifications | `public.mentor_notifications` | `mentor_id, entry_id, from_user_id, kind, read` |

## NOT REAL (visual mock or client-side prototype — no persistence)

- **Any trade, plan, decision, rule, strategy, journal entry, forecast, or trader model.** No table exists for any of them. Confirmed by grep of every `.from('…')` call and every `.sql` file.
- Flight Deck telemetry, DNA/psychology analytics, community feeds, mentor dashboards, Catch Me Up, marketplace, leaderboards, Net Worth, Portfolio — all mock or demo state.
- **Broker connection: none.** No TradeLocker, no MT, no CSV import. The path is CSV import → read-only API.
- **Execution: not connected.** Both decks (`/pitch`, `/owen`) say so honestly.
- The Live Room `SessionEvent` ledger (`components/live-room/session-store.tsx`, `session-state.ts`) is **client state only** — append-only shape, derived lenses, but nothing is saved.

## CONNECT CANDIDATES (already the right shape; just don't write anywhere)

- `components/execution-copilot/copilot-trade-plan.tsx` — a trade-plan panel: instrument, direction, entry, stop, target, reasoning. Right shape for a Decision Record capture; no backend.
- `components/copilot/trade/TradeExecutionPanel.tsx` — execution UI, no backend.
- Forecast (`components/forecast-hub/*`, `create-forecast-*.tsx`) — conceptually a *public* Decision Record: thesis, invalidation, timestamp, outcome. No table.
- Live Room ledger — the natural place for a hotkey capture during a live session.
- ~~`copilot_events` — an existing append-only JSONB event table; the Decision Record pipeline can reuse its pattern (or write typed rows alongside it).~~ **[CORRECTED 20 Sep 2026, second founder session:** `copilot_events` is a **dormant / dead pattern, not an active persistence pipeline** — the writer in `lib/copilot/persist.ts` has one call site, commented out (`CopilotProvider.tsx` lines 6, 49); `app/api/copilot/chat` writes nothing; nothing reads the table. Only its *row shape* (`type/ts/session_id/user_id/context/data`) is a reference. Do not describe it as the event spine or as something to "extend"; anything built on it revives a dead table under fixed RLS policies (`13` §3.2, §7 S2/S3).**]**
- `/api/archio` — the grounded-prompt + schema-validated-envelope pattern is the right template for the single v0 LLM call (the review).

## What the smallest loop needs that does not exist

1. `decision_records` (with per-field provenance, `locked_at`, market snapshot, visibility).
2. `trades` (from CSV import first; later broker read-only).
3. `decision_reviews` (SQL-judged deviation + one LLM-phrased review).
4. A matcher pairing records ↔ fills; `lock_lead_seconds = first_fill_at − locked_at`.
5. One capture surface (one tap + optional line) on one new page — not inside the 33k-line dashboard.
6. Six SQL aggregates = Trader Model v0 (plan rate, adherence, deviation mix, setup expectancy, time pattern, impulse flag).

## Legacy documentation — read as archaeology only

`docs/` holds ~50 earlier documents (masterplans, blueprints, investor decks, an architecture autopsy, QClay inventories). They contradict each other and the source-of-truth. **Only `docs/source-of-truth/` is authoritative.** ~~The one legacy document the Architect should read is `docs/current-state-audit.md` (16 Aug 2026) — an evidence-cited technical audit whose conclusions still hold.~~ **[20 Sep 2026:** the 16 Aug audit is superseded for the Architect by `13-technical-backend-control-center.md` (from code, 20 Sep 2026 — tables, routes, F1–F15, S1–S10). The Architect receives a dated extract of `13` in its pack; the 16 Aug audit is archaeology.**]**

## Rules for using this file

- Cite paths from this file. Do not extrapolate to files not listed.
- If you need a fact not here, write `NEEDS-V0-VERIFICATION: <question>` and stop.
- This file is updated only by v0. Date at top is authoritative.
