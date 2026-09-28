# EXCERPT of 00-founder-synthesis-2026-09-17.md — §6 object schemas (Architect pack)

*Exact copy of the header and section 6 of `docs/source-of-truth/00-founder-synthesis-2026-09-17.md`. These are v0 sketches from 17 Sep 2026, PROPOSED, never implemented. `03` §4 amends them (per-field provenance, `lock_lead_seconds`, `session_plans`, `playbooks`, `capture_surface`). Nothing in this file exists in the database — see `08`.*

---

# ARCHIO — Founder Synthesis

**Date:** 17 Sep 2026
> **ERRATUM (same night, see `02-revision-2026-09-17-kan-correction.md`):** §5 "Thesis F — Mentor's Ledger", the "B2C solo trader is probably wrong" claim, the Kan-cohort steps in §10, and the single kill criterion were built on a false premise (Kan has no students and does not trade). Those parts are SUPERSEDED. §1–4 (KNOWN / WRONG / market research), §6 object schemas, §7 repo audit and §8 existing-work classification stand.

**Inputs reconciled:** existing v0 codebase (this repo), Luke→Kan email (43 sections), master prompt (54 sections), ChatGPT context dump, QClay Visual Narrative v1.1 + Dashboard Design & Release Plan v1.1, QClay Telegram log (Jul 16 – Sep 4), backend decision packet / partner brief / learning workshop, Owen/TradeLocker deck, live external research (17 Sep 2026).
**Status of this document:** PROPOSED. Nothing here is decided until a founder moves it to the ledger (`01-decision-ledger.md`).
**Labels used:** KNOWN (evidence) · BELIEVED (plausible, undemonstrated) · IDEA · DECIDED · BUILT · LEGACY · OPEN · CONTRADICTION · ASSUMPTION · EXPERIMENT.

---
## 6. The objects, v0 (buildable in days, deterministic, honest)

### 6.1 Decision Record v0
```
decision_records
  id                uuid
  user_id           uuid            -- the trader
  org_id            uuid null       -- cohort / mentor tenant (F); null for solo
  locked_at         timestamptz     -- immutable once set; THE field that makes it a decision, not a journal
  instrument        text
  direction         enum(long, short, flat)
  setup_id          uuid null       -- from the user's (or mentor's) playbook
  thesis            text            -- <= 280 chars; why now
  invalidation      text            -- price or condition that proves the thesis wrong
  entry_plan        numeric null
  stop              numeric null
  target            numeric null
  risk_pct          numeric null    -- of account, as planned
  rules_checked     jsonb           -- [{rule_id, passed: bool}] against the active spec
  state_self_report smallint null   -- 1–5 or null (never mandatory)
  source            enum(form, hotkey, live_room, import)
  session_event_id  uuid null       -- link to the mentor's Live Room call, if any
  market_snapshot   jsonb           -- price, ATR, session, from Polygon at lock time (stamp, not a model)
  status            enum(planned, taken, skipped, invalidated, expired)
  visibility        enum(private, cohort, public)   -- public = a forecast
  outcome_trade_id  uuid null       -- set by the matcher
```
```
trades   (imported or synced; never hand-typed P&L)
  id, user_id, instrument, direction, opened_at, closed_at, entry_avg, exit_avg,
  size, pnl, fees, source enum(csv, tradelocker_ro, manual), raw jsonb
```
```
decision_reviews (one LLM call per matched record; deterministic inputs)
  id, decision_record_id, trade_id, deviations jsonb   -- computed: early_entry, late_entry, stop_moved,
                                                         --  size_breach, early_exit, held_past_invalidation, no_plan
  summary text (<= 3 sentences), question text (exactly one), model, created_at
```

### 6.2 Trader Model v0 = six SQL aggregates, no ML
1. **Plan rate** — % of trades with a record locked before `opened_at`.
2. **Adherence rate** — % of planned trades with zero deviations.
3. **Deviation mix** — which deviation types dominate (this is the "weakness" the email talks about).
4. **Setup expectancy** — R-multiple by `setup_id`, planned vs unplanned.
5. **Time pattern** — plan rate and adherence by session / hour.
6. **Impulse flag** — trades opened < N minutes after a loss with no record.

If these six numbers move for real traders over 30 days, the Trader Model is real. If nobody creates records, no ML would have saved it.

### 6.3 Market Model v0 = none. A `market_snapshot` stamp from data you already have.

### 6.4 AI v0 = one step
- **Plan capture is a form, not an agent.** Faster, deterministic, no hallucination, no advice.
- **Review is the only LLM call.** Inputs: the record, the matched trade, the computed deviations. Output: three sentences that cite the exact rule and number, plus one question. The model phrases; the SQL judges. A review that is wrong once about "you broke your rule" ends trust — so the judgment must never come from the model.
- Agents never place, modify or cancel orders in v1 or v2. Permissions v0: `read:records`, `read:trades`, `write:review`. Nothing else exists.

---

