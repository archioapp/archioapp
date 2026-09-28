# 03 — Intent Capture: position, corrections, design target

**Date:** 2026-09-17 (night) · **Status:** PROPOSED · **Responds to:** the ChatGPT "Intent Engine" exchange (Luke ↔ ChatGPT, same night)

---

## 0. Plain language, for Luke and Kan

Three things have to be true. One line each.

1. **Capture.** A trader tells the system what they are about to do — *which setup, why, what would make them wrong* — **before the outcome**, with the smallest effort we can engineer.
2. **Value.** Afterward the system tells them something their broker and their journal do not.
3. **Return.** They come back without anyone pushing them.

Trader Model, agents, workflows, creator intelligence, marketplace: all of it stands on records that only exist if (1) is true and are only worth building if (2) and (3) are. That is the whole test.

**Grok bots — yes, tonight, three of them.** This was already in `00 §10` and `02 §8` (Truth Keeper · Red Team · Architect). "Don't build the eleven-brain org this week" was never "don't touch Grok." ChatGPT and this document agree on the three.

**Code — the rule is corrected.** "No code this week" was too blunt. ChatGPT's version is right: *don't build infrastructure that isn't necessary to test 1–3.* Three tables + one page inside the existing app is inside that rule. The Telegram/spreadsheet loop is not wrong either — it tests (2) and (3) at zero cost; it just does not test (1), because typing in Telegram is the *worst* capture friction, not the best.

---

## 1. Adopted from ChatGPT (into the source of truth)

- **System assembles → user confirms**, not user enters → system stores.
- **Provenance per field:** `OBSERVED` (broker/data/chart) · `DECLARED` (trader said it) · `INFERRED` (AI guessed) · `DEFAULTED` (inherited from playbook/session/account), each with optional `confidence` and `confirmed_at`.
- **Coverage against broker total.** Never present partial data as complete: "based on your 24 planned trades," not "you."
- **Principle: every unit of friction must purchase immediate value.**
- **One data model, many capture surfaces.** Universal *architecture* ≠ universal *initial product*.
- **Competitor correction:** TradeZella (Planning → Trading → Import → Review, pre-trade notes, rules, AI session-vs-plan) and TraderSync (trade plans with entry/exit/risk/strategy before execution) already ship pre-trade planning. "We have pre-trade planning and AI review" is not a claim we can make.
- **Playbooks are derived, not declared.** "You've labeled three trades Opening Range Breakout — save as a playbook?" is right. A two-minute onboarding monologue about strategies the trader *thinks* they trade is wrong — new users describe an idealised self.

---

## 2. Where the Intent Engine overreaches (challenged)

### 2.1 The order is not the intention
"ARCHIO knows 90% of the trade before the trader types" is true **by field count** and false **by information value**. Entry, stop, target, size, side, time are `OBSERVED` — and every journal on the market already imports them. They are the commodity. The scarce fields are **setup, thesis, invalidation** — and no broker, chart, or order ticket will ever produce them. Two traders place identical brackets for opposite reasons. A stop is a *price*; an invalidation is a *condition* ("acceptance below the sweep low"), and traders routinely set stops on money, not thesis.

So the Intent Engine removes friction from the fields that don't matter and leaves it exactly where it always was. **The minimum human contribution is not zero. It is one tap (which setup) plus an optional one line (why / what kills it).** Invalidation and risk can inherit from the playbook or session (`DEFAULTED`). That is the design target. Design to it; do not promise below it.

### 2.2 Zero-friction capture is a platform product
"Place + Lock" — the record created as a by-product of placing the order — requires either being the order UI or having write access to TradeLocker. Then the product *is* a TradeLocker plugin. TradeLocker has AI Studio and is the most natural builder of exactly that. Do not make the wedge depend on the partner who could build it in a quarter. **Read-only pending-order data is the ask to Owen. Cohort 1 is designed as if that ask is refused.**

### 2.3 Inference at v0 is fiction
"London Sweep — 87% confidence — Lock?" requires months of *that trader's* own labels. Before that it is a prompt guessing. Worse: **confirm fatigue launders `INFERRED` into `DECLARED`** — users tap Yes. Rules: a confirmed inference stays `INFERRED` with `confirmed_at`; the setup picker shows no pre-selected default (at least every Nth record); Trader Model claims are built from `DECLARED` + `OBSERVED` only.

### 2.4 Immediate value is a commodity — the retention gap is weeks 1–4
R:R, risk %, daily risk used, rules matched: every broker ticket and all ~10 gate apps show these. Planned-vs-actual on one trade: TradeZella semi-has. Compounding insight ("after two losses you size 1.7×") is the moat and needs 40+ records — weeks for a day trader, months for a swing trader. **So for the first month the product offers only commodity value.** Neither document solved this. Honest bridges:
- **A human review** (Kan, who has traded) for cohort 1 — does not scale, does work.
- **The Coverage Split:** on a connected account, *planned trades vs unplanned trades, same trader, same month.* If planned trades outperform, the trader sees the point in their own numbers — proof of value the product generates about itself. If they don't, the product has honestly told the trader planning does not help them — also a kill signal. This may be the single strongest retention message available early.
- **The room.** Social reinforcement is the one lever the research supports; the Live Room already exists.

### 2.5 Before-fill vs before-outcome — the honesty number
Market orders fill before any prompt can appear. But **before-fill is not the requirement; before-outcome is.** Record `lock_lead_seconds = first_fill_at − locked_at`. Positive = true pre-trade intent. Negative but pre-close = post-fill declaration (weaker, still pre-outcome, still usable). Post-close = contaminated; flagged; excluded from adherence. **This one number is the honesty metric of the entire dataset** and later of every Trader Model claim built on it.

### 2.6 Nobody on the team lives in the moment being designed
Intent capture is a design for the ten seconds before entry. Kan does not trade; Luke's status is unstated (`DL-010`). A zero-friction capture for a moment neither founder lives in daily **cannot be designed from the outside** — it will be evaluated by nobody. Recruiting active traders is therefore not a detour from the Intent Engine; it is its prerequisite.

---

## 3. Capture mechanisms, ranked

Friction = incremental effort at the moment of the trade. Declared quality = how much of setup/thesis/invalidation we actually get. Buildable = without TradeLocker cooperation.

| # | Mechanism | Friction | Declared quality | Observed quality | Needs | Buildable now | What it tests |
|---|---|---|---|---|---|---|---|
| 1 | **Session plan inheritance** — morning: "today only setups A/B, max 0.5%, stop at 11:30"; every trade inherits | one action per session | medium (session-level, not per trade) | via CSV/API | nothing | **yes** | will traders declare *once a day*; is session-level intent enough to match |
| 2 | **Playbook one-tap** — "which of your setups?" single tap; invalidation/risk inherit | 1 tap | high for setup | via CSV/API | 3+ labeled trades first | **yes** | the floor of per-trade declared friction |
| 3 | **Quick line + AI structuring** — "L ES sweep reclaim → VWAP" → structured thesis/invalidation → confirm | 3–6 s | high | via CSV/API | one LLM call | **yes** | is thesis capture tolerable when AI does the formatting |
| 4 | **TradingView alert webhook** — alert text is the thesis; firing creates the record | 0 incremental for alert traders | medium | partial | TV Pro+ on user side | **yes** | zero-incremental capture without any broker deal |
| 5 | **Pending-order watch + prompt** — API sees new pending/open order → pushes "which setup?" | 1 tap | high | **native** | TradeLocker read API + polling | after Owen | does observed-first capture raise completion |
| 6 | **Hotkey / overlay** — desktop shortcut opens a 2-field capture over the chart | 2–5 s | medium–high | via CSV/API | desktop presence | yes, later | capture without leaving the chart |
| 7 | **Voice** | 3–8 s | high, noisy | via CSV/API | STT + LLM, latency | yes, later | thesis-rich traders; fails in loud rooms |
| 8 | **Chart drawing capture** — TV long/short position tool already holds entry/stop/target | ~0 | low (no setup/thesis) | native | TradingView MCP/API access | speculative | whether TV's new agent surface exposes it |
| 9 | **Place + Lock** — record created as the order is placed | ~0 | still 1 tap for setup | perfect | TradeLocker write / being the order UI | not without partner | the ceiling; also the partner's own product |
| 10 | **Form** | 20–40 s | highest | manual | nothing | yes (exists: `copilot-trade-plan.tsx`) | the *lower bound*: if traders do the form, everything above works |
| — | Post-hoc reconstruction — import, then "what was your plan?" | low | contaminated | native | nothing | — | **anti-pattern**: this is what every journal does; flag `locked_at > closed_at`, never count as intent |

**Design note:** 1 + 2 + 3 compose. Session plan sets the defaults; one tap picks the setup; the line is optional. That composite is the v0 capture surface.

---

## 4. What this does to the schema

- `decision_records` gains **per-field provenance**: `{ field, value, source: observed|declared|inferred|defaulted, confidence?, confirmed_at? }` (a JSONB `fields` column or a child table — Architect brain decides).
- Timestamps: `locked_at`, `first_fill_at`, `closed_at`, derived `lock_lead_seconds`, plus `capture_surface` enum (`session|playbook_tap|quick_line|tv_webhook|order_watch|hotkey|voice|form|posthoc`).
- `session_plans` (date, allowed setups, max risk, cutoff time, notes) → records inherit as `DEFAULTED`.
- `playbooks` (derived; version; trigger conditions; default invalidation; default risk) — created *after* labels exist, never on day one.
- `coverage` view: records ÷ broker trades per period; **split stats planned vs unplanned**.
- **Trader Model weighting rule:** assert only from `DECLARED` + `OBSERVED`; `INFERRED` may *suggest*, never assert; `DEFAULTED` counts as declared once, at session level.
- **Agents inherit the same rule** when they exist: act on observed + declared, suggest on inferred, never act on defaulted alone. This is how the foundation feeds agents later without building them now.

---

## 5. Three prototypes that teach the most, fastest

| Prototype | Tests | Fail means | Fail does **not** mean |
|---|---|---|---|
| **P1 · Session plan + one-tap setup** (mechanisms 1+2) | H1 at the minimum declared friction | traders won't declare even once a day + one tap | intention history is worthless — try P2/P3 |
| **P2 · Quick line + AI structuring + confirm** (mechanism 3) | whether thesis-rich capture is tolerable when AI formats | thesis is the friction; drop to setup-only | setup-only capture fails |
| **P3 · TradingView alert → record** (mechanism 4) | zero-incremental capture with no broker deal | alert traders are too few / alert text too thin | order-native capture (5/9) fails |

All three run over CSV import for the outcome side until read API exists. All three report `lock_lead_seconds` and coverage from day one.

---

## 6. First assignments for the three Grok brains (small, then stop)

- **Product / Truth:** write the one-page hypothesis (§0) and the design target (§2.1). Reject any proposed feature that does not serve capture, value, or return.
- **Red Team:** attack §2.1 — try to derive invalidation from order data alone; find who already ships session inheritance; list the reasons a trader would *not* tap once. Attack §2.4 — propose a week-1 value that is not commodity.
- **Systems / Architect:** the §4 schema and its mapping onto existing tables (`orgs`, `rooms`, `SessionEvent` ledger, `copilot-trade-plan.tsx`). Nothing beyond it.

Then stop. The next input the brains need is not another document; it is ten traders.

---

## 7. Genuinely novel vs already shipped

- **Not novel:** pre-trade plan · AI review · rules check · R:R / risk display · trade import · playbooks · session-vs-plan comparison.
- **Partially novel:** per-field provenance (no journal exposes it) · `lock_lead_seconds` as a published honesty metric · Coverage Split as a product message · session inheritance of intent (gate apps have daily *limits*, not inherited *intent*).
- **Novel if it works:** an intention-vs-execution dataset with provenance, feeding a model that refuses to claim anything the trader did not declare. Whether traders *value* that enough to return: **OPEN — the only question.**

---

## 8. On the night itself

Two AIs are producing strategy documents for two founders who have not yet made one decision from last night's list (`00 §10`, `02 §7`). Each document restores clarity for an hour; the next question dissolves it. That is not a knowledge gap. **Clarity is a decision, not a document.** After this file, the next artefact that will make anything clearer is a list of ten names.
