# Revision 02 — after the Kan correction

**Date:** 2026-09-17 (same night as 00/01)
**Trigger:** founder fact: Kan does NOT currently run a trading community or have students, and does not actively trade. He has deep trading knowledge and history and co-owns the concept.
**Effect:** supersedes Thesis F ("Mentor's Ledger") as wedge and as test environment. DL-002 and DL-008 are SUPERSEDED; DL-001 is amended. Document 00 stands for everything else (market research, KNOWN/WRONG lists, repo audit, object schemas, existing-work classification).

---

## 1. Erratum — what I got wrong and why it matters

I concluded "B2C solo trader is probably the wrong user" and proposed the Mentor's Ledger from three inputs: the repo's backend is org/membership/mentor-shaped, one line calling Kan a mentor, and the Owen deck's Act I pain. Two of those are **product archaeology**, not market evidence. The third is real pain but not pain *we can reach*. I did exactly what the master prompt warned against: let the existing architecture dictate the market. The correct statement was always:

> Mentor-led cohorts *may be* the easiest environment in which to test the Decision Record hypothesis — **if one is available.** None is.

I also blurred three layers into one sentence. They are separated below and must stay separated in every future document.

## 2. The three layers, separated

| Layer | Statement | Status |
|---|---|---|
| **Long-term company thesis** | ARCHIO becomes the operating system around a trader's *decisions*: it stores intention before outcome, matches what happened, and over time knows the trader well enough that its intelligence (and later its agents, and later other people's expertise expressed as software) is grounded in that trader's real record rather than in generic market commentary. | BELIEVED. Not falsified by research. Not supported by a single data point we own. |
| **Initial wedge** | Capturing intention before execution, then showing planned → actual → outcome, produces something a trader values enough to keep doing it **voluntarily**. | HYPOTHESIS. This is the one thing to test. |
| **First test environment** | Unknown. Was "Kan's students." Is now OPEN and is the **first problem**, ahead of the product. | OPEN |

The mentor idea is not dead as a *market*. Trading education (Whop/Skool/Discord communities) is a large, real distribution channel and the deck's Act I pain is real. It is dead as *our available test environment*, and it must not be promoted to "the company" again without an actual mentor with actual students signed up.

## 3. Does the Decision Record survive when nobody is forcing anyone?

Honest answer: **it survives as an output, and it is fragile as an input.** Both halves matter.

**Why it is fragile.** The moment before entry is when a trader is least willing to type. Every journaling company that grew did so by *removing* input effort (TradeZella, Tradervue: auto-import; the value arrives without work). Pre-trade capture asks for work at the worst moment, before there is any result to be curious about. Voluntary commitment devices in general (stickK, Beeminder) are a niche used by people who already know they have a discipline problem and have failed to fix it alone. Expect that population to be small and specific.

**Why it survives.** Three things reduce the input problem more than my first document acknowledged:

1. **Most of a Decision Record already exists in a bracket order.** A trader who places entry + stop + target has *declared* entry, invalidation price, target and size before the outcome. From broker data alone (pending orders, modifications, fills) you can measure: stop moved, target moved, size changed, entered before the level, exited before the plan. The only truly manual fields are **setup tag + one-line thesis**. That is a ~10-second ask, not a form. This matters for the TradeLocker conversation: read-only order history (not just fills) *is* the intent data for bracket traders. It is not yet secured; it is the one thing to ask Owen for.
2. **The first review has to buy the second capture.** The economics of voluntary use are: one surprising sentence the trader could not have produced from their own journal ("you planned 0.5% and risked 0.9% on 6 of your last 8 losers; your winners were all inside plan") is what earns the next record. If the first review is generic, no UI polish saves it. The test must therefore include a human-quality review from day one, even if a human writes it.
3. **Extrinsic frames exist without a mentor.** Prop/funded challenge traders have explicit, machine-checkable rules with real money attached to breaking them. That is the closest thing to "someone making you" that does not require us to own a community.

**Verdict:** the Decision Record remains the strongest idea on the table and the correct first object. Its adoption is the company's single load-bearing hypothesis. Nothing above it should be built until capture is observed happening voluntarily, repeatedly, in at least a handful of real traders.

## 4. Candidate first populations (ranked, none proven, none currently reachable)

| Population | Pain | Frequency | Rules explicit? | Reachable by us in 7 days? | Risk |
|---|---|---|---|---|---|
| **Prop / funded challenge traders** (futures, forex, CFDs on TradeLocker-class platforms) | very high — one rule break loses the account | daily | yes (firm rules + own rules) | via Discords, r/Prop trading, and *TradeLocker itself* — the Owen relationship is a distribution door into exactly this population | they may want a hard *lockout*, not a reflective record; ~10 tiny risk-guard apps already serve part of this |
| **Serious active discretionary retail traders** with a defined setup | medium-high — inconsistency | daily / several per day | partly | via personal network only; no channel | TradeZella's users; will compare to auto-import journals |
| **Students of an external educator** (not Kan) | high (deck Act I) | varies | yes (the educator's) | only if a real educator with real students says yes this week | we own no such relationship; recruiting one is a sales task |
| **Founders themselves** | — | — | — | Kan does not trade. **Does Luke?** If neither founder trades actively, nobody on the team is the user; that gap must be named and closed (a trading advisor who is an active user, or a founder starting to trade small, live). | building for a user you are not |

The first population is the strongest on paper *and* the one our only warm partner (TradeLocker) can reach. That is a hypothesis, not a decision. The honest first question is not "who is best" but **"who can we get five of by next Monday?"**

## 5. Which experiment falsifies which hypothesis (kill criteria rewritten)

DL-008's "plan rate < 30% → solo Trader OS is dead" was wrong: it let one capture mechanism falsify the whole thesis. Corrected:

| ID | Hypothesis | Test | Falsified when | What that does NOT falsify |
|---|---|---|---|---|
| **H1 — Voluntary capture** | Active traders will record setup + thesis + invalidation + risk before entry when asked personally, with ≤ 20s friction. | 5–10 traders, 5 trading days, capture via the lowest-friction channel available (Telegram message / form). Measure records ÷ trades. | < 30% coverage **after** trying at least two capture mechanisms (form → chat message → partial auto-fill from bracket) and personally asking each trader why. | The thesis. It falsifies *manual* capture as the foundation and points to broker-derived intent (§3.1). |
| **H2 — Review value** | Seeing planned → actual → outcome tells a trader something their current journal does not. | After each week, a written review per trader (human-written in the test). Ask: "Was there anything here you did not already know?" | ≥ 70% say no, twice. | H1. People may record and still find the review generic — that is a review-quality problem, fixable. |
| **H3 — Unforced return** | Traders come back without being pushed. | Stop reminding in week 2. Measure who keeps recording. | < 30% of week-1 recorders record in week 2 unprompted. | H1/H2 individually. It falsifies the *standalone* product; suggests capture must be embedded in an existing surface (chart, broker, community). |
| **H4 — Broker intent sufficiency** | Pending-order history reconstructs ≥ 70% of a bracket trader's plan without typing. | Needs TradeLocker read-only order history or a CSV export with order modifications. | Reconstruction < 50%, or platform gives fills only. | H1–H3. It just means capture stays manual longer. |
| **H5 — Community enforcement** (parked) | A mentor asking daily lifts H1 coverage materially. | Only runnable when a real educator with students exists. | — | — |

Green light for building software: H1 ≥ 50% coverage with one mechanism **and** H2 ≥ 50% "yes" **and** H3 ≥ 50%. Anything less means iterate the test, not the codebase.

## 6. Earned-complexity chain — no layer without evidence from the one below

| Layer | What gets built | Gate UP (evidence required) | STOP (evidence that says do not proceed) |
|---|---|---|---|
| **0. Manual loop** | Nothing coded. Traders message intent; a spreadsheet; a human writes the review. | H1 + H2 + H3 green across ≥ 5 traders | H1 fails across two mechanisms → rethink capture (broker-derived) before any UI |
| **1. Decision Record + Review** | 3 tables, one page (Plan / Today / Review), CSV import, deterministic deviation, one LLM sentence-writer | 10+ traders keep using it for 4 weeks; LLM review rated ≥ human review 50% of the time | LLM review rated worse → keep it human-assisted longer; retention < 50% → capture friction problem, go to Layer 1b (chart/broker capture) not Layer 2 |
| **1b. Embedded capture** | TradingView alert/webhook or TradeLocker order read → partial record | H4 ≥ 70% reconstruction; coverage rises | Platform refuses read access → CSV lane only; reassess TAM |
| **2. Trading Memory** | 500+ records per active trader; searchable; setup expectancy per trader | Traders ask questions of their own history unprompted ("how do I do on Tuesdays?") | Nobody queries → memory is a report, not a product; stay at 1 |
| **3. Trader Model** | Derived aggregates become a persistent profile; model flags a deviation *before* it recurs | A flagged deviation is avoided ≥ 30% of the time it fires (measured) | Flags ignored → model is noise; back to 2 |
| **4. Personalised AI** | The model can explain a trader's pattern and ask a question that changes behaviour | Traders rate AI review ≥ human review; behaviour change measurable in adherence | Rated below human → keep humans in loop |
| **5. Agents / workflows** | AI acts *for* the trader inside its permissions (drafts plan from chart context, blocks a rule-breaking ticket if the trader opted in) | Traders opt in and keep the agent on for 30 days; adherence rises vs. control | Opt-out > 50% → agents are unwanted; intelligence stays advisory |
| **6. Creator / expert intelligence** | An expert's strategy as a checkable spec, grounded in thousands of records by that spec's users | ≥ 3 experts with ≥ 20 active followers each; spec-vs-expert disagreement rate measured and low | No expert will expose a spec, or disagreement rate > 30% → "feel" dominates; expertise not softwarable at this stage |
| **7. Marketplace** | Paid access to expert intelligence with verified records as the trust layer | Layer 6 stable for a quarter; users request it | Invo/Fomo-class competitor owns the category → partner, do not build |

The chain is causal, not aspirational: each layer is only *necessary* if the one below generates the demand for it.

## 7. Tonight — what Luke and Kan leave with (no code, ~90 minutes)

1. **Read this document together; mark the three layers as agreed or not.** If not agreed on Layer 1 (vision), stop and argue about that first — everything else is downstream.
2. **Freeze Decision Record v0 fields on one line.** Instrument · direction · setup tag · thesis (≤ 280) · invalidation · entry / stop / target · risk % · optional 1–5 state · timestamp locked. Nothing else. Write it down and stop editing it.
3. **Write the recruitment list.** Ten named people you can each personally message tomorrow who trade actively (or three communities you have standing in). **If you cannot fill this list tonight, that is the finding:** distribution is problem #1 and the next week is about reaching traders, not product. Decide who owns recruiting.
4. **Pick the capture channel for the manual test.** Recommendation: a Telegram/WhatsApp message to a private group in a fixed shape (one line, the v0 fields in order). Not a UI. Not an app. A form only if traders prefer it.
5. **Decide who writes the reviews for week 1.** Kan's trading knowledge is the asset here: a human-written planned-vs-actual review from someone who has traded is the highest-quality version of H2 we can produce, and it tells us what the LLM must eventually match.
6. **Answer the founder question you have been avoiding:** does Luke trade actively? If neither of you does, name how the team gets a user in the room (an active trader as advisor, or a founder trading small and live from Monday).
7. ~~Decide the name.~~ **Done — ARCHIO** (DL-007). QClay's assets stand as named.
8. **Send QClay three lines:** thank you; we are running a two-week product test before committing to full scope; we will come back with a bounded brief or a clean stop by [date].
9. **Do not build the Grok organization this week.** One shared document (this folder) is the organization until there is data for a second brain to reason about.

Success for tonight is not a plan. It is: a frozen field list, a named list of traders, a capture channel, a reviewer, a name, and a sent message.

## 8. Open questions only the founders can answer

- Does Luke trade? How often, what instruments, on what platform?
- Who — by name — can you reach this week who trades daily?
- Is TradeLocker read-only *order history* (not just fills) something Owen can grant to a partner? If yes, H4 becomes testable within the month.
- Is anyone in your network running a paid trading community who would let us run H5 with their members?
