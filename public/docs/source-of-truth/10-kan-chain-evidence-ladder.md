# Kan's chain as the evidence ladder — arrow-by-arrow challenge

*17 September 2026. Context for the Grok grounding, not a strategy document. Kan sent this after reading the 5-minute memo, unprompted:*

> **DECISION → ACTUAL TRADE → COMPARE → MEMORY → TRADER MODEL → PERSONALIZED AI → AGENTS → WORKFLOWS → CREATOR INTELLIGENCE → POTENTIAL MARKETPLACE**

## 1. What this is and is not

| | Status |
|---|---|
| Founder alignment on "features need an underlying decision/intelligence architecture" | **Strong.** Kan produced the abstraction himself; that is better evidence than agreement. |
| Product thesis | Clearer. The chain and the Layer 0–7 ladder in `02` §6 are the same object. |
| Market / user validation | **Unchanged: none.** Zero real traders, zero Decision Records. |
| Nodes 6–10 (Personalised AI → Marketplace) | Hypotheses. Not build priorities because both founders like them. |

**Caution, stated plainly:** two founders converging on an abstraction in one evening is the exact moment the house pattern fires — systematise before evidence. Kan turned a memo into a ten-node architecture overnight. That skill produced 337k lines with no trade table. The chain is only useful if it is read as a **ladder you climb with evidence**, never as a roadmap you build down.

## 2. Two structural gaps in the chain

**Gap A — it starts one node too late.** "DECISION" presumes the decision already exists as data. It does not. The company's single load-bearing hypothesis (H1) is that a trader will *make the decision visible* voluntarily, before the fill, at ≤ one tap + one line. Node 0 is **CAPTURE**. Everything to the right is unreachable if node 0 fails.

**Gap B — it is a data-flow, not a value-flow.** The trader receives nothing back until node 6 (Personalised AI). Records only accumulate if the trader keeps recording, and the trader keeps recording only if node 3 gives something back *immediately*. The per-trade loop in the memo has the step: PLAN → TRADE → COMPARE → **REVIEW** → LEARN. Kan's MEMORY is LEARN on the system side; REVIEW — the human-facing moment — is missing. Insert it, or the weeks-1–4 gap (`05` §7) becomes structural.

**Ordering note — the chain is linear, the dependencies are not.** CREATOR INTELLIGENCE does not derive from WORKFLOWS. It derives from **many traders' records under one spec** — i.e. from MEMORY + TRADER MODEL at *scale*. From TRADER MODEL the ladder forks: a *personal* branch (Personalised AI → Agents → Workflows) and a *collective* branch (Creator Intelligence → Marketplace). Good news: creator intelligence is not gated on agents. Bad news: it is gated on user count, which is the thing we have least of.

## 3. Arrow by arrow — where the arrow does not follow, what earns it, what the repo says

| # | Arrow | Why it is NOT automatic | Evidence that earns it | Repo: strengthens / contradicts |
|---|---|---|---|---|
| 0→1 | CAPTURE → DECISION | Market orders fill before any prompt; post-hoc "plans" are journal entries. Voluntary capture is unproven anywhere. | **H1:** ≥ 50% of a trader's trades carry a record with `lock_lead_seconds > 0`, across ≥ 5 traders, one mechanism. | *Contradicts today:* no decision object exists. *Strengthens:* `copilot-trade-plan.tsx` has the right field shape (writes nowhere); `copilot_events` is a live append-only pattern to reuse. |
| 1→2 | DECISION → ACTUAL TRADE | Many trades have no decision (impulse). The Coverage Split (planned vs unplanned on one account) is the honest measure, and it may show planning does not help that trader. | Coverage reported next to every insight; planned trades ≥ unplanned on expectancy for ≥ 60% of traders. | *Contradicts:* no broker connection, no `trades` table. CSV import first; Owen ask second; design as if Owen says no. |
| 2→3 | ACTUAL TRADE → COMPARE | Matching a record to fills is not trivial: partials, scale-ins, same instrument twice a day. Deviation must be arithmetic, never an LLM guess. | Matcher pairs ≥ 90% of records to fills unambiguously on real CSVs; deviation types reproducible. | *Neutral:* nothing built; three tables + a matcher is the whole Layer 1. |
| 3→4 | COMPARE → MEMORY (via REVIEW) | Memory only grows if the trader comes back. **The missing REVIEW node earns the next record.** Weeks 1–4 offer only commodity value (R:R, risk %) — unsolved. | **H2:** ≥ 50% of reviews rated "told me something I didn't know." **H3:** ≥ 50% record again without being asked. Human-written reviews (Kan) before any LLM. | *Strengthens:* `copilot_events` shows the team can persist events. *Contradicts:* `lib/response-engine/journal.ts` is demo data; the Live Room ledger is client state only, nothing saved. |
| 4→5 | MEMORY → TRADER MODEL | "Model" must be defined as computable aggregates or it is a vibe. Per-setup expectancy needs ≥ 40 records per trader; with 9 setups that is months. | Trader Model v0 = six SQL aggregates (`05` §6). Gate: a flagged deviation is avoided ≥ 30% of the times it fires. | *Contradicts:* Trading DNA / Psychology are pages, not computations over data. Nothing derived from real records exists. |
| 5→6 | TRADER MODEL → PERSONALISED AI | Personalisation must be *measurably* better than generic review, which TradeZella already sells at $35–99/mo. | Traders rate personal review ≥ human review ≥ 50% of the time; adherence moves. | *Strengthens:* `/api/archio` already grounds Gemini in live Polygon prices — the exact template for grounding in the trader's own records. |
| 6→7 | PERSONALISED AI → AGENTS | Context is not an agent. Agent = context + a job + permission to act + a feedback signal. Blocking a ticket needs broker write access we do not have; touching orders adds regulatory surface. | Traders opt in and keep the agent on 30 days; adherence rises vs control; opt-out < 50%. | *Contradicts:* no agent runtime, no tool use, no scheduler; Owen deck states execution not connected. Any near-term "agents" claim is unsupported. |
| 7→8 | AGENTS → WORKFLOWS | Only if ≥ 2 repeatable jobs exist and traders chain them. | Traders turn on ≥ 2 chained automations and keep them. | *Neutral:* nothing exists. |
| 5→9 | TRADER MODEL (at scale) → CREATOR INTELLIGENCE | Depends on user count, not on agents. An expert must expose a *checkable* spec; "feel" may dominate. | ≥ 3 experts with ≥ 20 active followers each; spec-vs-expert disagreement rate measured and < 30%. | *Strengthens:* orgs / rooms / memberships / invites are real — the *container* for creator→follower exists. *Contradicts:* no spec object, no verified record. |
| 9→10 | CREATOR INTELLIGENCE → MARKETPLACE | Invo/Fomo own "pay creators for copied trades." The "intelligence, not signals" half is unproven; selling trading intelligence edges toward advisory regulation in several jurisdictions. | Layer 9 stable for a quarter; users request paid access; legal review done. | *Strengthens:* Stripe is live — the payment rail exists. Rail ≠ demand. |

## 4. The canonical chain (proposed — founders accept or edit)

**Per-trade cycle:** PLAN/LOCK → TRADE → COMPARE → REVIEW → LEARN
**Long-range ladder (Kan's, amended):** CAPTURE → DECISION → ACTUAL TRADE → COMPARE → REVIEW → MEMORY → TRADER MODEL → { PERSONALISED AI → AGENTS → WORKFLOWS } ∥ { CREATOR INTELLIGENCE → MARKETPLACE }

Rule for everyone (bots included): **we believe the whole ladder could exist; we earn the right to move one node right only when the node to the left has produced the evidence in §3.** Today we stand at node 0 with no evidence for node 1.

## 5. For the three bots

*Amended 19 Sep 2026 (DL-018): the boundaries below govern work **on the loop engine**. In the current STRUCTURE → FLOWS phase the bots' first tasks are the structural ones in `09` §4 and they map every major system; the loop is placed inside that map as one subsystem. Text kept as written.*

- **Product Brain** proposes only within nodes 0–3. Anything right of REVIEW is labelled VISION in its output.
- **Red Team** attacks arrows, not the whole chain — first 0→1 and 3→4 (the two unsolved ones).
- **Architect** builds nothing right of node 4 (MEMORY). Three tables + matcher + one page.
- Every bot: founder alignment is context, not evidence. Do not cite "the founders agree" as support for anything.
