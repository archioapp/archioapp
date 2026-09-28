---
# V0 NEW-CHAT BOOTSTRAP — 27 September 2026

Filed by v0 to retire a long-running working chat. **This is a navigation document, not a new
Source of Truth.** It orients a fresh v0 conversation and points to the authoritative files instead
of restating them. No product code was touched to produce it. If anything here conflicts with a
newer dated entry in `01-decision-ledger.md` or `15-structural-map-v1.md`, the ledger and map win —
this file can go stale.
---

## 1. What ARCHIO is (one paragraph)

ARCHIO is a connected trading environment, not a single feature. Its scope (`11`, DL-017) is the
whole trader journey: a Flight Deck / Dashboard workspace intended to become the primary home, a
personal-intelligence direction around the trader's own behavior ("Trading DNA"), an intent → proof
→ compare → review loop as one important intelligence engine inside that scope (not the definition of
the company), a conversational "Ask Archio" guide, and Education / Community systems. Some of this is
real code today; most of the personalization and the loop are current-phase design work with mocked
or absent backends. Do not resurrect the old "Trading Pilot" framing — the name and that narrower
scope are both retired (`01` DL-007, `11` §1).

## 2. Current work phase

The founders' sequencing (`11` §8, made operative by DL-018) is:

**STRUCTURE → FLOWS → DATA/BACKEND → detailed page design**, with design learning and technical
learning running iteratively in parallel rather than strictly sequentially.

- Active design work before this pause was **D1 / Flight Deck / first-use** (`docs/lego/D1-block-1-front-door.md`,
  `docs/lego/D1-block-2-first-use.md`).
- That visual work was **temporarily paused** to audit and consolidate the older `/` systems and
  verify the technical spine against a proposed skeleton.
- **That audit/consolidation/technical-verification loop is now substantially complete** — see §6 and
  §7 below.
- **DL-021 still stands, unchanged:** the Intent Loop this phase is design shape / UX / flow / data-model
  *learning* only. No persistence or backend implementation of the loop is currently approved. Do not
  un-park it because it feels important.

## 3. Authority order — read in this sequence

Everything under `docs/source-of-truth/` is numbered and dated; **newest date wins, and only Luke or
Kan change a status — every AI only proposes.** Full index and cross-references:
`docs/source-of-truth/README.md` (read this first — it explains every file below and is not
duplicated here).

Minimum reading order for a new conversation:

1. `docs/source-of-truth/09-bot-context-packs.md` §1–2 — governance rules + glossary.
2. `docs/source-of-truth/11-founder-direction-2026-09-19.md` — **the founders' approved company scope
   (DECIDED, DL-017).** Everything after this describes the loop engine *inside* that scope, or the
   state of the code.
3. `docs/source-of-truth/15-structural-map-v1.md` — **the Structural Map v1 (DECIDED, DL-019).** The
   seven Level-1 systems everything else is filed under.
4. `docs/source-of-truth/01-decision-ledger.md` — the full decision ledger, DL-001…DL-031 plus
   rejected ideas. This is the single place to check whether anything is DECIDED, OPEN, FOUNDER
   DIRECTION, DEMO/SIMULATION, or FUTURE/VISION.
5. `docs/source-of-truth/12-product-design-control-center.md` — every user-facing surface as a
   control record (120 records), operational not governance.
6. `docs/source-of-truth/13-technical-backend-control-center.md` — the backend from code: runtime, 14
   tables, 37 routes, F1–F15 shared foundations, S1–S10 security register. Operational not governance.
7. `docs/source-of-truth/14-archio-master-cross-reference.md` — the connective tissue: master ID
   index, naming/duplication control, the founder inbox Q-1…Q-28, blockers B-1…B-12.
8. `docs/lego/D1-block-1-front-door.md` and `docs/lego/D1-block-2-first-use.md` — the current D1
   inspection/definition sheets.
9. Everything else under `docs/` (masterplans, blueprints, decks, older audits) is **archaeology** —
   it records what was once intended, never what is true now.

**If a proposal has not yet been written into one of files 1–7 above, it is not governance yet** — do
not treat it as decided regardless of how it reads elsewhere (including this file or old chat
history).

## 4. Critical current product direction — Luke-provisional vs. DECIDED

Per `01` DL-031 (22 Sep 2026): **PROVISIONAL, Luke approves; Kan's asynchronous review is pending;
this is explicitly NOT joint founder approval; names are reversible.** Nothing here has shipped in
code.

- Four-zone Flight Deck abstraction survives as a navigation shape: **MARKET FLOOR** (Intelligence ·
  Daily Brief · Live Calls) · **TRADING DESK** (ONE Forecasts · Copilot · Post-Mortem) · **THE
  ACADEMY** (Education + honest Compare / Mentor AI shells) · **THE COLLECTIVE** (Communities · The
  Floor · Collab Hub).
- Dashboard / Flight Deck is intended to become the primary ARCHIO home. **The workspace's visible
  name is still OPEN** (DL-030) — "Dashboard," "Flight Deck," "Command Center" are the founders' live
  terms; "Your Space" and "Trading Terminal" (both present in code today) are **not authoritative**.
- The old `/` route (Signal Terminal) contains legacy concepts worth reusing but should **not**
  automatically remain the product's home just because it is what signed-out visitors hit today.
- Ask Archio is global chrome, not owned by one zone.
- Nexus is an **absorption candidate** (into Ask Archio) — code is kept, not deleted, decision not final.
- Marketplace is preserved as **FUTURE** architecture under THE COLLECTIVE, not a current door.
- Centralized / Decentralized is preserved as a **FUTURE/VISION** multi-environment idea; a literal
  toggle is explicitly **not approved**.
- Signed-out / zero-data / returning-user honesty principle is DECIDED (DL-013, DL-024, reconfirmed 20
  Sep): a brand-new signed-out or zero-data user must never see fabricated personal trading history,
  P&L, account numbers, psychology data, or a persona presented as belonging to them.
- No fake "Marcus" persona or demo numbers may be presented as a real user's own truth anywhere in the
  product — this rule is DECIDED, not provisional.

## 5. Product consolidation — current proposal (not yet governance-recorded)

The surviving conceptual model discussed in this retiring chat, restated as a proposal only. **This
paragraph itself is not yet written into `01`, `12`, `13`, `14`, or `15` — treat it as a working
hypothesis a new conversation should validate against the founder inbox (`14` Q-series) before
building anything on it.**

- Core concepts: **Market Context**, **Strategy & Rules**, **Intent Loop**, **Trader Behavior /
  Trading DNA**, **Declared Profile**, **Readiness** (a derived *view* synthesized from other signals,
  explicitly **not** a single 0–100 score), **Coaching Delivery** as a presentation preference layer
  (not a separate data owner), and **Ask Archio** as an interface over the other systems' data, not an
  owner of intelligence itself.
- Data shape: **Definition → Event → Aggregate.** A definition (e.g. a rule, a strategy config) is
  versioned; events are append-only facts; aggregates are derived views computed from events, never
  stored as the source of truth.
- Chain: **Strategy & Rules → Intent Loop → Trader Behavior** — rules and strategy definitions feed
  the intent loop, whose recorded events accumulate into trader-behavior aggregates.
- Provenance: every fact should carry **DECLARED** (the user said so) / **COMMITTED** (locked at a
  server-authoritative moment) / **OBSERVED** (measured from real activity), with an internal
  **INFERRED** / **DEFAULTED** distinction still relevant when a value is filled in without an
  explicit source.
- **Status: PROPOSED / Luke-provisional. Not recorded in governance.** Do not build persistence
  against this shape without it first being written into the ledger — DL-021 also blocks the Intent
  Loop half of it regardless.

## 6. Technical Skeleton status

The Architect bot produced a **Technical Skeleton v1** — still **PROPOSED**, not DECIDED. Its central
idea: versioned definitions, append-only events, derived (never directly written) aggregate
conclusions, server-authoritative locks on time-sensitive facts, explicit evidence/provenance on every
record, and a grounded (not hallucinated) context object fed to Ask Archio.

v0 then ran a **repo-verification pass** against that skeleton — reading the actual code, not
documentation — and the pass is now substantially complete. The most important corrections from that
pass (full detail lives in the conversation's verification artifacts and should be reconciled into
`13-technical-backend-control-center.md` when a founder authorizes the update — **not yet done as of
this file**):

- **Three session/timezone engines exist in the repo; only one is DST-correct.** The other two will
  drift on DST transitions. Not yet unified.
- **There is no real economic calendar anywhere in the app.** Every calendar-shaped surface
  (`economic-calendar.tsx`, macro-pulse inspector, etc.) renders a static hardcoded array, not a fetch.
- **Order-Layer logic (`components/copilot/order-layer/order-layer-engine.ts`) is a real, deterministic
  engine** — but its inputs are synthesized/mocked upstream, not sourced from live trading data.
- **Strategy Analytics is mostly demo-backed.** The derived formulas are real math; the numbers they
  operate on are demo data in most current call sites.
- **Calibration is browser-local only** (a zustand `persist` store), with some duplicated fields across
  stores — no server persistence, no cross-device sync.
- **`/api/archio` is structured and grounded** (it builds a real context object from what's in the DB)
  **but unauthenticated** — anyone can call it as any user context it's given.
- **`/api/command` is a separate route that overlaps `/api/archio`'s purpose and is also
  unauthenticated.** The two were not designed as one system; they currently duplicate intent.
- **A `NOW()`-style DB timestamp precedent exists** (proving the DB can be the time authority) **but no
  authoritative lock enforcement is actually implemented** anywhere that matters (e.g. no
  server-enforced "this trade intent is now locked" mechanism).
- **There is no migration system** in the repo — schema changes have no tracked, replayable history.
- **`/register` still routes to `/copilot` on completion**, a third distinct post-auth destination
  alongside `/login`'s push to `/` and DL-027's stated intended destination (the Dashboard / Flight
  Deck workspace). Not yet reconciled in code.
- **S1–S8 security-register gaps remain open** (see `13` §S1–S10 for the live list; this file does not
  reproduce it).

**The Architect's skeleton should be treated as unstable/unverified until these corrections are
reconciled into it and a founder re-reviews.** Do not build against Technical Skeleton v1 as if it
were already confirmed accurate.

## 7. Verified repo reality — do not accidentally claim these are real

None of the following exist as real, working systems in the current repo. A fresh conversation must
not describe them as implemented:

- Broker/execution connection (no trades/decisions/plans table, no broker API integration — `08`).
- A real trader-history / Trading DNA backend (behavior aggregates are not persisted from real events).
- A real mentor ecosystem (Kan has no students and does not trade actively — `01` standing fact).
- A real Edge score.
- Real Psychology intelligence.
- Real Strategy-adherence tracking against live trade data.
- A real economic calendar (confirmed static array everywhere, §6 above).
- Persisted calibration (browser-local only, §6 above).
- Authenticated personal Ask Archio context (`/api/archio` is real and grounded but unauthenticated).

**What IS real and can be built on:** Supabase auth (email/password path, real sessions) exists
alongside the demo face-scan path; the Polygon-backed chart data in `useAnalysis` is real market data;
the Order-Layer engine's math is real even though its inputs are mocked; the Strategy Analytics formula
layer is real math; `copilot_events` exists in the schema (but is a dormant/dead write pattern with no
active pipeline — `08`, `13` §3.2); a DB-side `NOW()` time-authority precedent exists.

## 8. Do not resurrect

These are superseded or legacy framings from earlier in this project's history. A fresh v0 conversation
should not casually bring them back as if they were still current:

- The old `/` route (Signal Terminal) treated as the intentional, permanent product home.
- "Marcus" or any other demo persona/data treated as a real user's own truth.
- Strategy OS / Psychology OS / Edge treated as three automatically separate canonical products (the
  current direction combines Trading DNA/Psychology, per earlier memory notes — verify against `15`
  before asserting either way).
- The five historical "Copilot" concepts treated as one already-unified real system.
- Readiness described as a literal 0–100 "permission to trade" score.
- The simulated face-scan login described anywhere as real biometric authentication.
- Marketplace or a Centralized/Decentralized toggle described as built or current (both are
  FUTURE/VISION only, DL-031).
- Kan assumed to be actively trading or running a current student community (explicitly false per the
  founder-corrected record, `01`/`02`).
- "Trading Pilot" as the product name or as defining the company's scope.

## 9. Asynchronous founder workflow

- Luke may give provisional direction for reversible design/UX work (e.g. DL-031) without that
  constituting joint approval.
- Kan reviews accumulated founder decisions asynchronously — his review is expected to lag, and a
  decision tagged "Luke-provisional" stays that way until Kan's review is recorded.
- **Never label Luke-only direction as joint founder approval.** Say "Luke-provisional, Kan review
  pending" explicitly when that is the actual state.
- Major irreversible financial, legal, security, execution, or company-defining decisions require
  actual founder resolution (both, recorded) — not inference, not a provisional label.

## 10. How a new v0 conversation should operate

- **The repo is code truth.** Before stating any fact about what exists or how it behaves, inspect the
  actual files — do not rely on memory, prior chat summaries, or documentation alone.
- **The `docs/source-of-truth/` files are product/governance truth.** Use them to know what is decided
  vs. proposed vs. rejected.
- **Conversation history is task context, not permanent memory.** Nothing said in a chat is
  authoritative unless it has been written into the numbered source-of-truth files.
- Explicitly distinguish **CURRENT** (real, shipped, working) / **MOCK** (renders but backed by fake or
  static data) / **PARTIAL** (some real plumbing, incomplete) / **VISION** (not built, may never be
  built) whenever describing any feature.
- **Never turn a proposal into a decision** by restating it confidently enough that it starts to sound
  decided. If it's not in `01` as DECIDED, say PROPOSED or OPEN.
- When work reveals an important new truth about the repo, **update the proper controlled document
  only when explicitly authorized** to do so — do not unilaterally rewrite `01`, `12`, `13`, `14`, or
  `15`.

## 11. Current handoff / next likely work

- Technical Skeleton verification (the repo-audit pass in §6) has just completed.
- The Architect still needs the verified corrections in §6 reconciled into a stable, corrected
  skeleton before that skeleton should be treated as reliable for backend design decisions.
- After that architecture reconciliation, expected product work returns toward **D1 Flight Deck /
  first-use** design (`docs/lego/D1-block-2-first-use.md`) and preparation for QClay.
- **No persistence implementation of the Intent Loop is authorized while DL-021 stands.** This applies
  regardless of how compelling a design rationale for building it now might seem.

---

*Filed by v0, 27 September 2026. Documentation only — no product code was modified to produce this
file.*
