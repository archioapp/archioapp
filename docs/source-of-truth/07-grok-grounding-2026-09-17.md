# Grok bot setup — grounding verification against the real ARCHIO project

*17 September 2026. v0 acting strictly as the grounding/verification layer. No thesis reopened, no redesign, no code. Answers the 14 questions in ChatGPT's brief, then A–E.*

**Two corrections to the record first** (they would otherwise be inherited by every bot):

1. **Line count.** Every document this week says "~48,000 lines of UI." Wrong. That figure is the *two files* of the Vantary dashboard (`your-space.tsx` 33,482 + `vantary-modules.tsx` 14,882). The codebase is **337,512 lines of TS/TSX across 819 files** (`components/` alone 319,725). The argument does not change — there are still zero trade/plan/decision tables — but the number is off by 7× and Kan knows his own repo. Fixed in 00, 04, 05.
2. **A persisted event log already exists.** `public.copilot_events` (`scripts/copilot-tables.sql`): `id, type, ts, session_id, user_id, context jsonb, data jsonb`, RLS enabled. It is the closest thing in the *database* to a decision ledger. The Live Room's `SessionEvent` ledger I kept citing is **client-side state only** (`components/live-room/session-store.tsx`, no persistence). The Architect must know both. Note the RLS policy `"anyone can insert events" with check (true)` — an open insert path that must be closed before real traders touch it.

---

## The 14 questions

### 1. Is the division of responsibility sensible given what ARCHIO contains today?

Yes, with one structural change (Q10/B). The product today is a 337k-line interactive prototype with three real subsystems (auth/orgs/Stripe skeleton, a grounded AI response engine on real Polygon data, an event-log table) and **no persisted trading loop**. That is exactly the situation where a proposing brain, an attacking brain and a smallest-prototype brain are useful — and where a code-reality layer (v0) is indispensable, because 90% of what the eye sees is mock and a bot reading screenshots or docs will believe it is real.

The workflow order is right: propose → attack → design smallest → v0 verifies against code → founders decide → only then implement.

### 2. What Grok should own that v0 should not

- Hypothesis formation and ranking (what to test, for whom, why now).
- External research: competitors, funding, behaviour science, regulatory lines. v0 can search too, but Grok is where the *ongoing* research memory should live.
- Structured disagreement: attack surfaces, failure modes, pre-mortems.
- Prototype *design* as a spec: objects, fields, flows, success/kill criteria, what to measure.
- Founder-facing drafts: memos, briefs, the Owen ask, the QClay reply.
- Keeping proposals labelled and dated.

### 3. What v0 must own that Grok must not pretend to know

- **What exists in the repo** — files, routes, tables, RLS, env, what is mock vs real. Grok has no repo access and must never assert "the app already has X."
- **Whether an Architect spec is buildable in this codebase** — which existing component connects, what breaks, migration paths.
- **Schema and code changes** — the only writer of code and SQL.
- **Verification notes** into the source-of-truth (Q12).
- **Security posture** — env vars, keys, RLS, exposure.
- **Line counts, table lists, route lists** — any number about the codebase.

### 4. Source-of-truth files ALL three bots receive

- `01-decision-ledger.md` — the record. Every bot must read it before proposing, and cite entry IDs.
- `02-revision-2026-09-17-kan-correction.md` — the vision/wedge/test-environment split, per-hypothesis kill criteria, earned-complexity chain, and the fact that Kan has no students and does not trade.
- `03-intent-capture-position.md` — the ranked capture mechanisms and the "order ≠ intention" argument. Without it every bot re-derives the Intent Engine debate.
- `08-architect-repo-facts.md` — the one-page repo reality (all bots, so none of them imagines features that don't exist).

### 5. Files only certain bots receive

| File | Product | Red Team | Architect | Why |
|---|---|---|---|---|
| `00-founder-synthesis` §1–4, §7–8 | yes | yes | §7–8 only | market research + existing-work classification; §5 Thesis F is superseded, tell them |
| `05-founder-memo` | yes | yes | no | tone, vision layers, how founders want to think; Architect doesn't need narrative |
| `06-tonight-working-session` | yes | no | no | the decision agenda; Red Team should not know what founders want to hear |
| `docs/current-state-audit.md` (Aug 16) | no | summary only | **yes** | the real technical audit with file:line evidence |
| Competitor research citations (00 §3) | yes | **yes** | no | Red Team must verify/extend them, not trust them |
| `04-kan-5-minute-version` | no | no | no | private founder communication |

### 6. Context in this v0 project NOT captured in the source-of-truth (would be lost)

**Yes — six items. Document before creating the bots:**

1. **The Aug 16 technical audit** (`docs/current-state-audit.md`) — the only evidence-cited account of what's real. Not referenced from source-of-truth until now. → Hand to Architect; summarised in 08.
2. **`copilot_events` table + `/api/archio` response engine** — real infrastructure the Architect should reuse (event log, grounded-prompt pattern, Polygon snapshot fetch, schema-validated JSON envelope). → In 08.
3. **Naming canon** (v0 memory, `archio-mvp-verdict`): Flight Deck · Community · AI Agent Marketplace · Decision Desk · Trading DNA · Net Worth · Portfolio · AI Verified Track Record · Social Network; daily rituals Morning Brief / Trade Review / Catch Me Up / What If / Ask Archio; dead names (all aviation names, My Rules, Mentors, Home Base). → In 09 as a glossary so bots don't invent new names.
4. **Owen/TradeLocker relationship state** (`docs/owen-call-briefing*.md`, `/owen` deck): the "we don't touch the trade" reframe, never "sixth-tab killer," the three-questions ask. The single new ask (read-only order history incl. pending/bracket orders) is in 03 but the relationship rules are not. → One paragraph in 09.
5. **QClay state**: $35k design + $300–350k, 12 months, AI excluded, three unanswered technical questions, silent since 31 Aug; logo approved 13 Aug as ARCHIO. → In 09 for Product bot only. **Do not export the Telegram log** (third-party PII and commercial terms).
6. **~50 legacy docs in `docs/`** (masterplans, blueprints, investor decks, autopsies) that **contradict each other and the source-of-truth**. Bots must be told these exist and are archaeology. → Rule in 09: legacy docs are inputs to archaeology only, never evidence of current direction.

Also: v0's own memory files (`archio-response-engine-masterplan`, `archio-ecosystem-masterplan`, `archio-flight-deck`, `archio-live-room`, `archio-owen-*`) hold months of design canon. They stay in v0 (D). Anything a bot needs from them gets exported on request as a dated note, not wholesale.

### 7. Factual repo summary for the Architect

Written as `08-architect-repo-facts.md` — paste-ready, one page, file paths included, mock/real labelled.

### 8. What the Product bot should know about the existing product

Ten lines, no code:

- ARCHIO is a large interactive prototype. Real: login, orgs/rooms/memberships/invites, Stripe checkout skeleton, an AI endpoint grounded in real market data, an event-log table. **Not real: any trade, plan, decision, rule, journal, forecast or trader model.** The journal the AI analyses is a labelled demo book.
- Nine named systems exist as designs (glossary in 09). Do not invent a tenth.
- Two pitch decks (`/pitch`, `/owen`) state honestly that execution is not connected. Keep it that way.
- The Forecast feature is conceptually a public Decision Record; the execution-copilot trade-plan panel is already the right shape; the Live Room has a client-side event ledger. These are *connect* candidates, not new builds.
- There is no broker connection. CSV import then read-only API is the path.
- Kan does not trade or have students. Whether Luke trades is unstated. No user is on the team.
- Name is ARCHIO (DL-007, DECIDED).

### 9. What the Red Team should know to challenge fairly

Everything in Q8, plus:

- The competitor list and dates in 00 §3 came from v0 web search on 17 Sep — **verify and extend; do not trust.**
- The repo's org/mentor plumbing led v0 to a wrong "sell to mentors" conclusion (02). Architecture is not evidence of demand — attack any proposal that leans on it.
- The three unsolved problems every prior document dodged: (a) weeks 1–4 value before the model has data; (b) voluntary capture floor; (c) who the first traders are. If a proposal doesn't address these, that's the attack.
- The rejected-ideas table in 01 — attack any proposal that re-imports a rejected idea under a new name.

### 10. Where the setup duplicates work or creates conflicting truth

1. **"Truth Keeper" vs "Product/Truth."** My 06 defined bot 1 as a passive guardian of the record; ChatGPT's brief defines it as the *proposer*. A proposer that also guards the truth has a conflict of interest. → Resolve: bot 1 is the **Product Brain** (proposer), bound by the ledger; **the git folder is the truth**, kept by founders; v0 runs consistency checks. No fourth bot.
2. **ChatGPT is the shadow fourth brain.** It has produced more strategy than all three bots will this month and none of it is logged. → Define its role (DL-015): Luke's drafting assistant. Nothing it says enters the ledger unless a founder commits it.
3. **Architect vs v0 on architecture.** Both will describe "the system." → Architect writes *specs* (what/why/fields/measures); v0 writes *implementation notes* (how/where/what breaks). Different documents, different owners.
4. **Red Team vs Product both researching competitors.** → Product cites; Red Team verifies. Only Red Team's research enters the record.
5. **Legacy `docs/` vs `docs/source-of-truth/`.** Fifty documents say different things. → Only `source-of-truth/` is authoritative; the rest is labelled archaeology in 09.
6. **Two copies of the bot prompts** (06 §D and 09). → 06 §D now points to 09.

### 11. Rules so proposals never silently become decisions or code

1. Every bot output ends with `Status: PROPOSED — requires founder decision (Luke + Kan)`. No exceptions.
2. Only a founder changes a ledger status. Bots may *draft* a ledger entry; a human commits it.
3. No bot writes to git, the repo, Supabase or any env. Bots produce text. Humans move text.
4. Every proposal cites the ledger entries it depends on and flags any DECIDED entry it contradicts.
5. Any claim about the codebase must cite a file path **from 08 or a v0 verification note**. Unverified code claims are marked `UNVERIFIED` by the bot itself.
6. "Nobody does this" requires a named search and date, or it's marked BELIEVED.
7. A bot may not cite another bot as evidence.
8. Rejected ideas go into the rejected table with the reason; re-proposing one requires stating what changed.
9. Every bot session is time-boxed and ends with ≤ 5 bullets a founder can accept or reject. No 1,000-line outputs.
10. Grok recommends; v0 verifies; founders decide; v0 implements only after a DECIDED ledger entry.

### 12. How information flows back from v0 to the bots

- After verifying an Architect spec, v0 writes `docs/source-of-truth/verifications/YYYY-MM-DD-<topic>.md`: per claim → `VERIFIED` (file:line) / `CONTRADICTED` (what's actually there) / `UNVERIFIABLE` / `BUILDABLE-NOW` / `NEEDS-MIGRATION` / `SECURITY-FLAG`.
- Luke pastes the note into the Architect thread. Architect revises. Product/Red Team receive the note only if it changes the hypothesis.
- If v0 finds repo facts the bots lack, it updates 08 and bumps its date. Bots are told to prefer the newest 08.
- Nothing flows back through ChatGPT.

### 13. Access the bots must NOT have initially

- **No repo, no GitHub, no Vercel, no Supabase, no env vars, no API keys.** `.env*`, `docs/postman/env.json` (checked: only a `baseUrl`, but the pattern is the risk), Stripe/Polygon/Gemini/OpenAI keys — none of it.
- **No trader data or PII** — once cohort traders exist, bots receive aggregates and anonymised excerpts only.
- **No QClay Telegram log** — third-party names and commercial terms.
- **No `04-kan-5-minute-version`** or private founder messages.
- **No write path** to `docs/source-of-truth/` — proposals arrive as text; a founder commits.
- **No tool/browsing autonomy** that could post, email or message anyone on the founders' behalf.

### 14. Anything important missing before tonight?

1. **The ChatGPT role** (Q10.2). Undefined = the biggest drift source.
2. **A commit ritual.** Who physically edits `01-decision-ledger.md` when a decision is made tonight (Luke, via v0 or GitHub UI), and when (end of session, not mid-argument).
3. **The user problem** cannot be solved by bots. Item 10 on the agenda (ten names) is still the real bottleneck.
4. **The corrected line count** and the `copilot_events` fact must be in the bots' context from the first message (done — 08).
5. **A stop condition.** Each bot session ≤ 45 minutes, ends with ≤ 5 accept/reject bullets. Otherwise tonight becomes a fourth 1,000-line document.
6. **The Owen ask in one sentence** for the Architect: *read-only access to order history including pending and bracket orders, no execution.* Already in 03; must be in 09 so the Architect doesn't design for write access.
7. **The open RLS insert on `copilot_events`** — a SECURITY-FLAG for the Architect and a v0 fix before any real trader data lands.

---

## A. APPROVED AS-IS

- Three bots, not eleven.
- The workflow order: propose → attack → smallest prototype → v0 verifies → founders decide → implement.
- Grok = thinking · v0 = code reality · founders = decisions.
- One shared problem statement for all three (from 06 §E, renamed ARCHIO).
- The ledger as the single record; PROPOSED/DECIDED/REJECTED statuses.
- "Do not code" for the bots.
- Founder approval gates implementation.

## B. MODIFY BEFORE CREATING

1. Rename bot 1 **Product Brain** (proposer). Drop "Truth" from a proposer's title. The git folder is the truth.
2. Define **ChatGPT's role** explicitly: drafting assistant, outside the ledger (DL-015).
3. Fix the **48k line count** everywhere → 337k / 819 files (done in 00/04/05).
4. Give all bots **08 (repo facts)** so none imagines features.
5. Tell all bots the **legacy `docs/` are archaeology**, not direction.
6. Add the **stop condition** and the **≤ 5-bullet ending** to every prompt.
7. Add the **Owen ask** (read-only, incl. pending/bracket orders) and the **copilot_events** fact to the Architect prompt.
8. Add **rule 5** (code claims must cite 08 or a verification note) to every prompt.

## C. CONTEXT TO EXPORT (paste into Grok, in this order)

**All three:** `01` · `02` · `03` · `08` · glossary + governance rules from `09`.
**Product Brain adds:** `00` §1–4, §7–8 (with the Thesis F erratum) · `05` · `06` · QClay one-paragraph state (09).
**Red Team adds:** `00` §1–4 (as claims to verify) · `05` · the three unsolved problems (09).
**Architect adds:** `docs/current-state-audit.md` (Aug 16) · `00` §6 object schemas · Owen ask · SECURITY-FLAG on `copilot_events`.

Do **not** export: `04`, the QClay Telegram log, any `.env`, `docs/postman/*`, v0 memory files, the 50 legacy docs.

## D. KEEP IN V0

- Repo, schema, RLS, env, keys — and every number about them.
- The v0 memory canon (response-engine, ecosystem, flight-deck, live-room, owen) — exported on request as dated notes.
- Implementation of anything DECIDED.
- Verification notes (Q12) and updates to 08.
- The consistency check between ledger and code before any build starts.
- Security fixes (start with the open insert policy).

## E. FINAL SETUP CHECKLIST — before creating Bot #1

- [ ] Read this file and 08 once. Confirm the two corrections don't change anything you already told Kan (they don't change direction; they change a number and add a table).
- [ ] Decide tonight's commit ritual: who edits the ledger, when.
- [ ] Copy the **governance rules** (09 §1) into a note you'll paste as the first message to every bot.
- [ ] Create **Product Brain** with the 09 prompt + its context pack. First task: one-page hypothesis in the five-layer format, citing ledger IDs, ≤ 5 bullets at the end.
- [ ] Create **Red Team** with the 09 prompt + its pack. First task: attack "the order is the intention" and the weeks-1–4 value gap; verify three competitor claims from 00 §3 with dates.
- [ ] Create **Architect** with the 09 prompt + its pack + the Aug 16 audit. First task: the three-table spec (decision_records / trades / decision_reviews) with provenance and lock_lead_seconds, **reusing `copilot_events` patterns**, flagging what needs v0 verification. Nothing else.
- [ ] Paste each bot's ≤ 5 bullets to v0 for a verification note before either founder acts on them.
- [ ] 45-minute cap per bot. Then close the windows and write the ten names.

*Status of this document: v0 verification, not a founder decision. Items in B become ledger entries only when a founder accepts them.*
