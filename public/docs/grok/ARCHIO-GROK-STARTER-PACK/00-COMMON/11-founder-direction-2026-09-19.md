# ARCHIO — Founder Direction

**Date:** 19 September 2026
**Approved by:** Luke + Kan. This is a founder decision, not an AI proposal.
**Ledger:** DL-017 — **DECIDED**
**Status of this document:** CURRENT. Newest date wins. It is the founders' statement of ARCHIO's overall company scope and is to be read as a **clarification of scope** — not as a new hypothesis, feature list, architecture or plan.

> **How to read this against `00`–`10`.** The intent → trade → compare → review → memory loop described in `02`, `03` and `10` remains an important potential intelligence engine *inside* ARCHIO. It is **not** the definition of the entire company. Where an older document's wording defines the company as that loop, this document supersedes the wording; the older text is flagged in Appendix A and left in place, not rewritten. Nothing about the Decision Record, the capture mechanisms, provenance, kill criteria H1–H5 or the evidence ladder is deleted or revoked here.

> **Provenance.** Written by Luke and Kan. Transcribed into this folder by v0 on 19 September 2026 on the founders' instruction. v0 changed formatting only (headings, bullet lists, bold on named terms). No sentence was added to, removed from, or reworded in §1–§8 or the Founder principle. Appendices A and B are v0's governance notes and are labelled as such.

---

## APPROVED FOUNDER DIRECTION — LUKE + KAN

### 1. ARCHIO is intended to become the connected environment around the trader’s entire journey.

ARCHIO is not being built as only a journal, only a pre-trade tool, only an AI coach, only a community, or only a trading dashboard.

The long-term idea is to bring together the parts of trading that currently live across disconnected tools, platforms, communities and workflows into one connected environment.

A trader should be able to learn, research, prepare, analyze markets, interact with mentors or other traders, plan trades, review behavior, understand performance, use tools, communicate, discover opportunities and improve over time without constantly jumping between unrelated systems that know nothing about each other.

ARCHIO should eventually feel like the place where the trader’s trading life lives and should feel like opportunity.

### 2. Personalized intelligence should become one of the core layers connecting that entire environment.

ARCHIO should gradually understand the person behind the trading account, not only the trades themselves.

Over time, with the user’s permission, ARCHIO should learn from how the trader behaves throughout the platform:

- what markets they watch
- what they actually trade
- what sessions they are active during
- what tools they use
- what pages they repeatedly visit
- what educational material they consume
- what mentors or communities influence them
- how their behavior changes after wins and losses
- how behavior changes during winning and losing streaks
- where they repeatedly drift from stated goals
- emotional context when voluntarily provided
- what strategies they believe they trade
- and what their actual behavior shows.

The purpose is not surveillance. The purpose is for the user to knowingly allow ARCHIO to understand enough about them that the platform becomes increasingly useful and personal.

ARCHIO should help break down the user’s behavior and compare it with actual outcomes and what the user says they are trying to achieve.

### 3. ARCHIO should combine general intelligence with personalized intelligence.

**General ARCHIO Intelligence** should understand information useful to traders broadly:

markets, instruments, sessions, volatility, economic events, news, risk concepts, trading terminology, education, platform functionality and general trading knowledge.

**Personal ARCHIO Intelligence** should understand:

the user’s history, preferences, strategies, behavior, goals, tendencies, strengths, weaknesses, routines, activity and accumulated ARCHIO history.

The long-term advantage comes from combining both.

ARCHIO should not only understand something like “JPY has CPI today.”

Eventually it should be capable of understanding the market context together with how that context relates specifically to this user’s normal behavior and history.

### 4. The user should provide as little information manually as reasonably possible, while having the ability to provide more context when they choose.

Normal use should be simple and low friction.

ARCHIO should automatically observe whatever information it can legitimately obtain from the platform, connected data sources and the user’s activity.

When additional context is useful, the user should be able to explain naturally through text, voice, guided questions, multiple choice, yes/no choices or similar interactions rather than being forced into long forms.

This may include emotional state, what they believe they are seeing, questions about a trade idea, a mentor’s forecast, news, a setup or other relevant context.

ARCHIO should help the user explore the situation rather than simply outputting a final answer.

### 5. The AI should eventually feel like a configurable trading buddy, coach and intelligent assistant.

Different traders respond to different kinds of help.

Some users may want ARCHIO mostly quiet. Others may want accountability, education, detailed explanations, questions, or a more conversational trading buddy.

The user should eventually have control over the style, intensity, depth and proactivity of the assistance.

ARCHIO should remain informational and educational rather than acting as a financial adviser that tells users what trades to take.

It should surface relevant market information, risks, events, context, history and behavioral patterns so the trader can make their own decisions.

ARCHIO should be compelling and proactive, but not intentionally manipulative or designed to encourage emotional/compulsive trading.

Rather than forcing conversations to continue forever, ARCHIO should rarely leave a useful next question, relevant context or helpful path unexplored.

### 6. ARCHIO should create value immediately, before it knows the trader deeply, and personalized value should compound over time.

Immediate value does not have to come only from a single pre-trade review.

The connected ARCHIO environment itself can create value through market information, dashboards, mentor/community content, summaries, forecasts, tools, education, communication, opportunities and AI assistance.

This can also include broader opportunities for users to participate, build communities, lead groups, create value, earn money or interact with other parts of the platform where appropriate.

A new user should have reasons to find ARCHIO useful before months of personal history exist.

As ARCHIO learns the trader, personalized value should compound.

Eventually it should recognize when a user is drifting from their normal behavior, entering unfamiliar markets, changing risk after wins/losses, behaving differently from their goals, or repeating patterns that have hurt them before.

The long-term feeling should be that the trader has a knowledgeable trading buddy beside them.

### 7. The intention → action → outcome loop remains an important intelligence engine, but it is not the entire company.

The chain:

**CAPTURE → DECISION → ACTUAL TRADE → COMPARE → REVIEW → MEMORY → TRADER MODEL**

remains potentially very important because it may create valuable information about the difference between what a trader intended to do and what they actually did.

That information may later power stronger personalization, coaching, behavioral awareness, agents and workflows.

However, ARCHIO should not be reduced to “a product that asks traders to record their intention before trades.”

Intent is one potentially valuable source of intelligence inside the larger ARCHIO system.

We still need to learn how much intent can be observed automatically, how much must be declared, how little friction can be created and what value makes the interaction worthwhile.

### 8. Our immediate founder problem is structural clarity.

We have a large vision, substantial design/UI work, many individual features and concepts, and a partially built application.

We do not yet have a complete functional blueprint explaining how everything belongs together.

Before blindly finishing every page, paying QClay approximately $42,000 to complete design, committing to a roughly $350,000 backend build, or handing the platform to another engineering team, Luke and Kan want to understand the structure themselves.

We need an **ARCHIO System Bible** that eventually explains:

- every major system
- its purpose
- the user
- the problem it solves
- where it sits in the user journey
- what data it creates
- what data it consumes
- what other systems it connects to
- what AI does
- what deterministic software does
- what already exists
- what is visual/demo only
- what backend must exist
- what integrations are required
- what may be built internally using AI
- what may require outside engineering
- what QClay would actually be designing around

We do NOT want to finish every page independently and attempt to connect everything afterward.

We want:

**STRUCTURE → FLOWS → DATA/BACKEND → DETAILED PAGE DESIGN → OUTSIDE POLISH/ENGINEERING.**

This System Bible should also prepare Luke and Kan for the next Owen / TradeLocker discussion by making clear what exists, what is missing, what integrations matter and where outside technical assistance is actually needed.

### Founder principle

We are not trying to think smaller. We are trying to put the big vision into the correct order.

Preserve ARCHIO’s ambition while preventing disconnected pieces of the future from being built before the underlying system is understood.

---

## Appendix A — Older wording this direction supersedes (flagged, not rewritten) — *v0 governance note*

Rule: historical documents keep their text. A reader who meets any line below reads it through `11`. The **superseded** column names exactly which words no longer define the company. The **still stands as** column says what the same passage still validly describes. Rows marked **OPEN** are conflicts v0 is not permitted to resolve; a founder rules on them.

| Where | Exact wording | Superseded by `11` | Still stands as |
|---|---|---|---|
| `00` §0, line 14 | "You are not building a trading tool, an OS, or an agent platform yet. You are building **the system of record for trading intentions**" | The phrase "the system of record for trading intentions" **as the definition of what ARCHIO is building**. | A description of the loop engine's first object (the Decision Record) and of hypothesis H1. |
| `00` §0, line 14 | "Everything else in the 43-section email (Trader Model, agents, creator intelligence, marketplace, cockpit) is downstream of whether traders will create that record." | "Everything else … is downstream" **as a company-scope statement**. `11` §6: the connected environment itself can create value before the loop has data. | The dependency *inside the loop*: a Trader Model built from intent data cannot exist without captured intent. |
| `00` §8, line 248 | "**What company are we building?** A decision-infrastructure company for discretionary traders: the system of record for trading intentions, entered through mentors. 'Trading OS' is the horizon, not the pitch." | The whole first sentence as the company definition. ("entered through mentors" was already superseded by `02`.) `11` §1 is now the answer to "what company are we building". | Nothing of the first sentence. The second sentence (pitch vs horizon) is not addressed by `11` and remains as written. |
| `00` §8, line 257 | "**Decision Record core?** Yes; it is the only core." | "it is the only core." `11` §7: "Intent is one potentially valuable source of intelligence inside the larger ARCHIO system." | The Decision Record as the core object *of the loop engine* (DL-001). |
| `02` §2, row "Long-term company thesis" | "ARCHIO becomes the operating system around a trader's *decisions*" | The scope "around a trader's *decisions*". `11` §1 widens it to "around the trader's entire journey". | The rest of the row — stores intention before outcome, matches what happened, knows the trader well enough that its intelligence is grounded in the trader's real record — now read as describing the loop feeding Personal ARCHIO Intelligence. |
| `02` §3 verdict, line 39 · `10` §2 Gap A, line 20 · `01` DL-001 "Confidence" | "the company's single load-bearing hypothesis" | The words "the company's". H1 is the load-bearing hypothesis **of the loop engine**. | H1 itself, its kill criteria (`02` §5), and the rule that founder alignment is not evidence (DL-016). |
| `02` §3 verdict, line 39 | "Nothing above it should be built until capture is observed happening voluntarily, repeatedly, in at least a handful of real traders." | **OPEN.** As written, the sentence forbids building anything in ARCHIO before capture is proven. `11` §6 states the environment creates value independently of the loop; `11` §8 orders the work STRUCTURE → FLOWS → DATA/BACKEND → DETAILED PAGE DESIGN. Whether this sentence now applies to the loop's upper nodes only, or is withdrawn, is a founder call. | Undetermined until a founder rules. |
| `05`, line 164 | "**VISION** — an intelligent trading OS around the trader's decisions. Unchanged." | "around the trader's decisions" — narrower than `11` §1. | "an intelligent trading OS" as a VISION label. |
| `09` §2 glossary (ladder line) · `10` §5 | "Bots work nodes 0–4 only; everything right of REVIEW is VISION." · "Product Brain proposes only within nodes 0–3." | **RESOLVED 19 Sep 2026 by DL-018** (was OPEN). The boundaries govern *loop-engine* work. In the STRUCTURE → FLOWS phase the bots map every major system; nodes right of REVIEW may be placed on the map but stay labelled VISION. See `09` §2–3, `10` §5 note. | The boundaries as written, for loop-engine work. |
| `09` §4 first tasks | Product Brain: the capture hypothesis. Red Team: attack "the order is the intention" and the weeks-1–4 gap. Architect: the three-table spec. | **RESOLVED 19 Sep 2026 by DL-018** (was OPEN). First tasks re-set to the structural ones (map → challenge → ground). The 17 Sep tasks are **parked** under each prompt in `09` §4, not deleted. | The parked tasks resume when a founder assigns them. |
| `01` DL-006 · `09` §2 glossary (QClay) | "$35k design" | **FIGURE CONFLICT, not reconciled.** `11` §8 says "approximately $42,000 to complete design". Both figures came from founders on different dates. v0 does not know which is current. | — until a founder corrects one of them. |

**Not in conflict, unchanged:** the twelve governance rules (`09` §1 — none defines the company); the rejected-ideas table (`01`); per-field provenance (DL-011); the capture design target (DL-012); `lock_lead_seconds` (DL-013); the Owen ask — read-only order history, no execution (`11` §8 names the Owen discussion as a purpose of the System Bible, consistent with DL-004); "agents never place orders"; the product name ARCHIO (DL-007); "Kan has no students and does not trade actively" (`09` §1 rule 10).

## Appendix B — What this document does not do — *v0 governance note*

- It does not decide the contents, format, owner or timeline of the ARCHIO System Bible. `11` §8 records that the founders want one and in what order the work should go; nothing more.
- It does not change the status of DL-001 … DL-016. It adds DL-017 only.
- It does not revoke H1–H5, the ten capture mechanisms in `03`, or the evidence ladder in `10`. They now describe the loop engine inside ARCHIO.
- It does not itself widen or narrow the three bots' boundaries or first tasks. Those tensions were flagged in Appendix A as OPEN and were **resolved the same day by a separate founder decision, DL-018** (`01`; operative text in `09` §2–4).
- It does not resolve the QClay design figure ($35k vs ~$42k).
- It adds no feature, system, architecture, schema or recommendation. Where the founders' text names capabilities (voice input, guided questions, drift recognition, communities, earning), those are scope statements by the founders — not proposals by v0 — and carry no ledger status of their own.
