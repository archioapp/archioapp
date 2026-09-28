# ARCHIO — Founding Beta Gap Analysis

Companion to `docs/current-state-audit.md`. Same evidence base, August 16, 2026.
Scope: the SMALLER Founding Beta only — not the long-term platform.

## Beta boundary used

**IN:** strategy calibration/rules · market context · persistent Flight Deck workspace ·
forecast creation/locking · pre-trade decision contract · manual trade entry + CSV import ·
read-only broker sync (if achievable) · automatic journal creation · DNA-lite feedback ·
context-aware ARCHIO AI · basic community/Live Room/Catch Me Up · basic mentor attribution ·
private proof sharing.

**OUT / LATER:** public marketplace · creator payouts · full social network · net-worth ·
broad broker coverage · direct execution · autonomous agents · agent economy · every long-term screen.

---

## Capability-by-capability gap table

Estimates are person-weeks (pw) as optimistic / realistic / risk-adjusted. Implementer codes:
V0 = v0/AI-assisted builder · FE = front-end engineer · FS = full-stack engineer ·
SA = senior architect · SEC = security specialist · LEGAL = vendor/legal/compliance.

### 1. Strategy calibration and rules
- **Exists:** UI surfaces in copilot/coach consoles; mentor template structure (`lib/mentor/templates/jadecap-ict-ny.ts`) proves the rule-shape concept.
- **Visual only:** all rule display; nothing saves.
- **Missing:** `strategies` + `strategy_rules` tables, CRUD API, RLS, UI wiring.
- **Dependencies:** none (pure Supabase work).
- **Risk:** low — standard CRUD.
- **Estimate:** 1 / 2 / 3 pw. **Implementer:** V0 + FS review.

### 2. Market context
- **Exists:** REAL Polygon REST integration (`lib/providers/polygonRest.ts`), market API proxies, session detection.
- **Missing:** persistence of context snapshots at forecast/decision time; Polygon plan limits (403s on snapshot tier are handled but real).
- **Risk:** vendor plan cost; display licensing review.
- **Estimate:** 0.5 / 1 / 2 pw. **Implementer:** V0/FS + LEGAL (data licensing check).

### 3. Persistent central Flight Deck workspace
- **Exists:** full visual workspace; TradingView iframe FUNCTIONAL; layout templates in localStorage (`lib/cartouche/flight-deck-templates.ts`).
- **Missing:** per-user workspace persistence (move localStorage → DB), re-protect routes (middleware comment `lib/supabase/middleware.ts:60-76`), real telemetry replacing `dashboard-data.ts` mocks.
- **Risk:** scope creep — the deck references many mock gadgets; wire only Beta gadgets.
- **Estimate:** 2 / 3 / 5 pw. **Implementer:** V0 + FE.

### 4. Forecast creation and locking
- **Exists:** forecast UI (`/forecast`, `create-forecast-cockpit.tsx`); `forecast_groups` table sketch (`scripts/community-schema.sql:42`).
- **Missing:** forecasts table with lock semantics (immutable after lock), write/read API, verification timestamps, chart-context capture.
- **Risk:** medium — locking/verification is the credibility core; design must prevent edit-after-fact.
- **Estimate:** 1.5 / 3 / 4 pw. **Implementer:** FS (integrity design) + V0 (UI wiring).

### 5. Pre-trade decision contract
- **Exists:** concept in UI and narrative docs only.
- **Missing:** everything durable: `decisions` table linking strategy+forecast+market context, UI flow, AI read access.
- **Estimate:** 1 / 2 / 3 pw. **Implementer:** V0 + FS.

### 6. Manual trade entry + CSV import
- **Exists:** `TradeExecutionPanel.tsx` visual; NO trades schema, NO parser, NO upload route.
- **Missing:** canonical `trades` + `trade_events` schema (THE keystone of the whole product), manual entry POST, CSV normalizer for 2–3 broker formats, dedup, provenance field.
- **Dependencies:** blocks journal, DNA, real AI post-mortems.
- **Risk:** medium — CSV format variance; keep to named formats first.
- **Estimate:** 2 / 4 / 6 pw. **Implementer:** FS (schema+normalizer) + V0 (UI).

### 7. Read-only broker sync
- **Exists:** nothing (audit: zero broker code).
- **Missing:** vendor selection (aggregator vs direct), credential custody design, sync jobs.
- **Risk:** HIGH — vendor contracts, credentials security, background jobs infra (none exists).
- **Estimate:** 3 / 6 / 10 pw AFTER vendor chosen. **Implementer:** SA + FS + SEC + LEGAL.
- **Recommendation:** ship Beta with CSV + manual first; treat sync as stretch.

### 8. Automatic journal creation
- **Exists:** journal UI (mock); demo adapter proves the consumption shape (`lib/response-engine/journal.ts` — only `collectJournalGrounding` must change, by design).
- **Missing:** journal entries generated from real trades; edit/annotate; attachments (needs storage).
- **Dependencies:** #6.
- **Estimate:** 1 / 2 / 4 pw. **Implementer:** V0 + FS.

### 9. DNA-lite / evidence feedback
- **Exists:** rich analytics UI (all mock); deterministic pattern computation concept in demo journal.
- **Missing:** real metrics computed in code (not by AI) from real trades; evidence records table.
- **Dependencies:** #6, #8.
- **Estimate:** 1.5 / 3 / 5 pw. **Implementer:** FS (deterministic stats) + V0 (UI).

### 10. Context-aware ARCHIO AI
- **Exists:** REAL grounded engine (`/api/archio`) — router, market grounding, schema-validated streamed envelope, anti-fabrication rules. This is the single most advanced real asset.
- **Missing:** swap demo journal for real trades (adapter swap); workspace context bus (current chart/strategy/forecast into prompt); durable memory (write+retrieve `copilot_events` or successor with proper RLS); usage limits.
- **Dependencies:** #4, #5, #6.
- **Estimate:** 2 / 4 / 6 pw. **Implementer:** FS + V0; SEC review for memory privacy.

### 11. Basic community / Live Room / Catch Me Up
- **Exists:** REAL org/room/membership/invite CRUD with RLS + integration tests (unrunnable but written); seeded discovery; mentor tables.
- **Missing:** room MESSAGES table + realtime (Supabase Realtime), transcripts, Catch Me Up = AI summary over transcripts (engine exists, needs the data), presence.
- **Estimate:** 2 / 4 / 6 pw. **Implementer:** FS (realtime) + V0 (UI).

### 12. Basic coach/mentor attribution
- **Exists:** `community_mentors` table + RLS; mentor UI (mock analytics); `mentor_notifications` (insecure route — fix).
- **Missing:** attribution links (student outcome ↔ mentor guidance), secure notification path.
- **Estimate:** 1 / 2 / 3 pw. **Implementer:** V0 + FS + SEC (fix notify-mentor).

### 13. Private proof sharing
- **Exists:** nothing durable.
- **Missing:** share-scoped read tokens/policies over forecasts + trades ("private by default, share by explicit grant").
- **Risk:** access-control mistakes leak trading data — needs careful RLS.
- **Estimate:** 1 / 2 / 4 pw. **Implementer:** FS + SEC review.

---

## Cross-cutting engineering debt (must-do inside Beta)

| Item | Evidence | Estimate |
|---|---|---|
| Fix 483 type errors (or triage to <50 with strictness plan) | tsc output | 1 / 2 / 3 pw (V0) |
| Make tests runnable (`ts-node`), CI gate | jest failure | 0.2 / 0.5 / 1 pw (V0) |
| Configure lint | `next lint` unconfigured | 0.1 pw (V0) |
| Rate limiting (auth + AI) | none exists | 0.5 / 1 / 1.5 pw (FS) |
| Secure `notify-mentor` + `copilot_events` policies | risk register #1–2 | 0.3 / 0.5 / 1 pw (FS+SEC) |
| Observability (Sentry + basic analytics) | none exists | 0.5 / 1 / 1.5 pw (V0/FS) |
| Bundle diet for `/dashboard` 726 kB | build table | 0.5 / 1 / 2 pw (FE) |

---

## Totals (excluding broker sync stretch)

- **Optimistic:** ~15 pw
- **Realistic:** ~28 pw
- **Risk-adjusted:** ~44 pw

With broker read-only sync: add 3/6/10 pw plus vendor lead time.

Assumptions: one senior FS + v0-assisted building in parallel; Supabase remains the backend;
CSV before sync; no execution; no marketplace; existing AI engine reused, not rebuilt.

## Founding Beta IN / OUT / LATER matrix (one-line verdicts)

| Capability | Verdict |
|---|---|
| Strategy + rules | IN — 2 pw realistic |
| Market context | IN — mostly done |
| Flight Deck persistence | IN — 3 pw |
| Forecast lock | IN — 3 pw |
| Decision contract | IN — 2 pw |
| Manual + CSV trades | IN — keystone, 4 pw |
| Broker read-only sync | STRETCH — vendor-gated |
| Auto journal | IN — 2 pw |
| DNA-lite | IN — 3 pw |
| Context-aware AI | IN — 4 pw (engine exists) |
| Rooms + Catch Me Up | IN — 4 pw |
| Mentor attribution | IN — 2 pw |
| Private proof sharing | IN — 2 pw |
| Marketplace, payouts, social network, net-worth, execution, agents | OUT/LATER |

## Four work lists

**1. Safely v0/AI-assisted:** CRUD tables+APIs mirroring existing org/room patterns; UI wiring
of real data into existing mock components; CSV upload UI; type-error cleanup; lint/test config;
seed scripts; docs; bundle splitting.

**2. Competent full-stack engineer:** trades schema + normalizer design; forecast lock
integrity; realtime rooms; AI memory retrieval; rate limiting; Stripe E2E verification;
deterministic DNA stats.

**3. Senior architecture/security:** credential custody for any broker sync; RLS review of all
new tables; share-grant model for private proof; prompt-injection hardening before AI actions;
region/data-residency plan.

**4. Vendor/legal/compliance:** market-data display licensing (Polygon tier), TradingView
advanced library agreement (if upgrading from free widget), broker/aggregator contracts,
financial-advice posture review, privacy/deletion obligations.

## Ten highest-priority next actions (in order)

1. Apply + verify ALL SQL files against the live Supabase instance (live schema introspection errored — must confirm RLS is actually active).
2. Fix the two concrete security holes: `notify-mentor` auth + `copilot_events` insert policy.
3. Design and create the canonical `trades` + `trade_events` schema (keystone).
4. Build manual trade entry POST + CSV import for 2 named broker formats.
5. Swap `collectJournalGrounding` from demo book to real trades (adapter already designed for this).
6. Create `strategies`/`strategy_rules` + `forecasts` (with lock) + `decisions` tables and wire existing UIs.
7. Re-protect `/profile /hub /copilot /nexus /intelligence` in middleware once real data lands.
8. Make tests runnable + CI; start burning down 483 type errors.
9. Add rate limiting to auth + AI routes and basic observability.
10. Run Stripe test-mode E2E (products, checkout, webhook → subscription row) and document it.
