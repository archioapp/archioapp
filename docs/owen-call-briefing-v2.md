ARCHIO × OWEN — CALL BRIEFING v2.0
The one document Kan and Luke rehearse from. Supersedes v1. Anything in [brackets] is a blank only you can fill.

====================================================================
0. WHAT CHANGED FROM v1, AND WHY
====================================================================

v1 said: "One workspace where ten fragmented tools become one." That is why we started. It is no longer the pitch for THIS person, because Owen already builds the connected ecosystem: TradeLocker Hub (brokers and prop firms listed in front of traders), Studio (bots, backtesting), WhatProp (prop-firm verification), FXPanic (market news). If we lead with fragmentation he can answer "that's Hub" and we are done.

v2 says: platforms record the trade. Nobody keeps the decision behind it. That is the gap, and it is truer to what we have actually built than v1 was.

One fact the outside review missed: Owen also co-founded FunderPro, a prop firm. Prop firms fail traders on RULES — daily loss, max drawdown, consistency, trade limits. "Which rule did the trader break, and when" is the native language of his other business. Our demo journal is tagged in exactly that language. Use it.

====================================================================
1. THE GAP AND THE SENTENCE
====================================================================

THE GAP (say this first, slowly)
"A trade has a record. The decision behind it usually doesn't."

THE SENTENCE (say once)
"ARCHIO keeps the decision behind every trade — what the trader saw, what they believed, what rule applied, what they actually did, and what it taught them."

If he pushes for the short version: "Platforms record the trade. We keep the decision."

THE FOUNDER STORY BRIDGE (thirty seconds, once)
"We started because a serious trader runs one decision through ten tools that don't know each other. As we built it, we realised the real problem isn't the number of tools. It's that the context dies between them. The thesis doesn't travel with the execution."

Never say "persistent trader memory", "decision provenance" or "decision intelligence" out loud. Those are our internal words. His words are: the record, the decision, the rule, the review.

====================================================================
2. THE CHAIN (the one visual)
====================================================================

Technical labels on the screen:
CONTEXT → THESIS → DECISION → EXECUTION → REVIEW
with one line running underneath all five: THE RECORD (ARCHIO)

Plain words in your mouth:
what they saw → what they believed → what they decided → what they did → what it taught them

Where things live today:
- CONTEXT: the mentor's call, the room, the news. (Live Room — built, scripted session.)
- THESIS: the trader's forecast, prefilled from the mentor's thesis. (Live Room forecast sheet — built.)
- DECISION: the rules in front of the ticket. (Pre-trade check — built, never sends.)
- EXECUTION: the fill. (This is the platform's event. We have no connection. Say so.)
- REVIEW: "Why did I lose yesterday?" (Ask Archio post-mortem — real model, demo book.)

Relationship to our product loop — only if asked:
Discover → Learn live → Decide → Prove is what the trader DOES in the product. The chain is what the record KEEPS about one trade. Same loop, cut lengthwise. They do not compete; the chain is the version you show a platform founder.

====================================================================
3. TRUTH TABLE — what we may show, say, and must not imply
====================================================================

DEMO TRUTHFULLY (real clicks, with the say-first line)
- Live Room: mentor call lands on a timeline; the Forecast tool prefills from the mentor's thesis and publishes as an event beside the call; Compare puts the mentor's thesis against the trader's own game plan and returns an alignment verdict with a reason.
  Say first: "Scripted session, real interface."
- Ask Archio: "Why did I lose yesterday?" — the post-mortem splits rule-clean trades from rule-breaking trades in R, shows the AM/PM discipline drift, flags trades sized above plan after a loss, counts trades over the daily limit, gives one take per losing trade and one lesson.
  Say first: "The model is real and it is forbidden to invent a trade. The trade book is our demo journal, tagged the way a real one will be — every trade carries the rules it broke. When the data model lands, this same engine reads the trader's real book."
- Ask Archio: one market question, twenty seconds, credibility only.
  Say first: "Live prices — it can only cite numbers from the feed."
- Pre-trade check: readiness rail — blocked, invalid, sim-ready, locked.
  Say first: "This never sends an order. It's the rule in front of the ticket."

EXPLAIN AS ARCHITECTURE BEING BUILT (words, not clicks)
- The record: one data model that links forecast, rule check, execution event and review. Each piece exists today in isolation; the keystone is the table and the adapters. The journal adapter is already written to swap from demo to real in one function.
- Broker ingestion: the "what they actually did" step. We drafted an integration contract against TradeLocker's public API docs. Never spoken to anyone who knows the platform.
- Verified history: forecasts already carry a full lifecycle (active, near expiry, resolved win or loss, invalidated), confluences, an invalidation clause and a mentor review. The record grows out of resolved forecasts.

FUTURE VISION (never imply it works)
- "Three of your last five trades after mentor calls did X." (no link from a call to a trade today)
- "Where do my forecasts differ from my executions this month?" (no forecast-to-fill join)
- Trading DNA / behavioural profile from real data (today: fixture data — show only with that label, or not at all)
- Live broker connectivity
- Mentor AI trained on the room's record

====================================================================
4. THE DEMO — ONE DECISION, NOT THREE PRODUCTS
====================================================================

One trader. One EUR/USD decision. Six minutes at most. Navigator drives, driver narrates.

1. CONTEXT (45s) — Live Room. Point at the mentor's call on the timeline. "This is where influence enters the record."
2. THESIS (45s) — open Forecast. It is prefilled from the mentor's thesis. Publish. It lands on the timeline next to the call. "What the trader believed, stamped, before anything happens."
   Optional (15s): Compare — mentor thesis vs the trader's own plan → alignment verdict.
3. DECISION (45s, +15 version and up) — pre-trade check. Show a blocked state. "The rule in front of the ticket. It never sends."
4. EXECUTION (10s) — say it, don't show it: "The fill is the platform's event. We don't have it. That's the missing piece."
5. REVIEW (2.5 min) — Flight Deck. Type: "Why did I lose yesterday?" Let it run. Read the two numbers out loud: rule-clean R versus rule-breaking R. Then the oversize-after-loss line. Then the lesson.
   Say: "It isn't telling him the market was hard. It's telling him which of his own rules cost him and when. That is the difference between a trade log and a decision record."
6. STOP. Twenty seconds: "Does that separation — strategy failure versus rule failure — match what you see?"

Never open anything named "Execution Console" in front of him. Call it the pre-trade check. Never demo the market question first. Never let him discover demo data — name it before every click.

====================================================================
5. TIME-FLEX — 10 / 25 / 45 / 60–90
====================================================================

Minute zero, first real sentence: "How much time do you have?" Then say the shape back: "I'll take ten, then it's yours."

10 MINUTES (the emergency version — actually ten)
- 0–1  Who we are. One line each. Mahdi in one sentence. Nothing about his story.
- 1–2  The gap + the sentence + the thirty-second bridge.
- 2–3  The chain visual. Plain words.
- 3–7  ONE journey: Live Room forecast (90s) → "Why did I lose yesterday?" (2.5 min). Skip the pre-trade check.
- 7–10 THE question. Silence. His words back. One next step. Thank you.
No kitchens speech. No second story. No Live Room tour. No mentor fraud. No monetization. No truth table — one sentence instead: "The engine and the interface are real; the record that links them is the next brick."
Job of the ten-minute version: make him curious enough to give you another meeting.

25 MINUTES
- Everything in the ten.
- + Kan's story after the gap (60s, one moment, one number). Then: "Does that match what you see in your users — and at FunderPro?" Let him talk.
- + Pre-trade check in the journey.
- + Truth table: real / built-not-linked / next. Calm, yourself, no estimates.
- + Where TradeLocker may fit, as a hypothesis (section 7).
- + Questions 2 and 3. Silence after each.

45 MINUTES (default)
- Everything in the 25.
- + Luke's story (60s) beside Kan's.
- + Market question, twenty seconds, before the post-mortem.
- + Compare tool in the Live Room.
- + Architecture explanation: the record, broker ingestion, verified history (three sentences each).
- + Strategy OS rules and the intent-versus-action gap — ONLY with the label "designed view, fixture data".
- + Questions 4 and 5.
- Then hand him the wheel: "What would you poke at?"

60–90 MINUTES — driven only by him
Nothing new is presented. Branches you open only when he pulls the thread:
- Integration: the API contract (appendix A).
- Prop firms: rule failures versus strategy failures; question 6.
- Money: monetization hypotheses (section 8).
- Mentors: verification and the fake maze (appendix B).
- Compliance: section 9.
- Team and timeline: section 10.

HARD STOP AT ANY POINT — the ninety-second close: his words back, one next step you own with a day on it, one thank-you.

====================================================================
6. BEATS — how it actually sounds
====================================================================

Roles: DRIVER narrates and holds the room. NAVIGATOR runs the screen, writes down everything Owen says, and owns the timer. Default: Kan drives the open and the ask (the Mahdi connection is his); Luke navigates and drives the journey. Swap once, at the demo. Decide tonight.

BEAT 1 — OPEN (Kan, 60–90s)
Names. What each of you actually does. "Mahdi put us in touch — thank you for taking it." Then: "How much time do you have?" Say the shape back. That's it. No compliments about his career. Respectful is not starstruck.

BEAT 2 — THE GAP (Kan, 90s)
"A trade has a record. The decision behind it usually doesn't." Pause. The thirty-second bridge (ten tools → context dies between them). The sentence, once.
STOP. No question yet. Let it sit for two seconds, then move.

BEAT 3 — THE STORY (Kan, 60s; +25 and up)
[One specific morning. One number.] End on the rule that lived in the other tab.
STOP + ASK: "Does that match what you see in your users?" — and if he mentions FunderPro, or you're at 25+: "At the prop firm, how much of a failed challenge is strategy and how much is rules?"
Navigator writes his answer down verbatim.

BEAT 4 — THE CHAIN (Luke, 60s)
Screen: the five words and the line underneath. Plain-words version out loud. "The platform owns the middle word. Nobody owns the line."
STOP. If he leans in, let him talk. If not, move.

BEAT 5 — THE JOURNEY (Luke drives, Kan narrates, 4–6 min)
As in section 4. Say-first line before every click. Read the two R numbers out loud at the end.
STOP + ASK: "Does that separation — strategy failure versus rule failure — match what you see?"

BEAT 6 — WHERE WE ARE (Kan, 90s; +25 and up)
Truth table, calmly. "Real: accounts, the community backend, billing, the engine on live data. Built but not linked: the room, the forecast, the pre-trade check, the review. Next: the record that links them, then the broker event, then the verified history on top." No estimates. No apology.
STOP.

BEAT 7 — THE FIT (Kan, 60s; +25 and up)
Section 7, word for word if needed. It is a hypothesis, not a pitch.
STOP + ASK: question 1.

BEAT 8 — THE ASK (Kan, then both silent)
Question 1 if not already asked. Silence. Then question 2 or 3 depending on what he said. One question at a time. Never stack them.
If he offers anything: "We'd love to explore that. Can we send a one-pager and pick the next conversation?" Nothing more.

BEAT 9 — HIS WHEEL (45 and up)
"What would you poke at?" Then follow him. Open appendix branches only when he pulls them.

BEAT 10 — CLOSE (Kan, 90s)
Navigator hands over the notes. Read two or three of his lines back, no commentary. "The one thing we're going to do next is [X], by [day]." One thank-you. End the call.

====================================================================
7. WHERE TRADELOCKER MAY FIT — the hypothesis, not the pitch
====================================================================

Say this, not "we don't touch the trade":

"We don't assume where ARCHIO sits relative to TradeLocker — you know that map and we don't. The gap that interests us is between execution data and the context behind it. A platform can know what happened in the account. We're building the thing that keeps what led to it and what should be learned afterward. One thing we'd genuinely like your read on is whether those two layers should ever connect, and if so, where the boundary belongs."

Do not describe his company to him. Do not call TradeLocker "a rail". Do not flatter ("best in the industry"). Present the gap; let him place himself in it.

====================================================================
8. THE SEVEN QUESTIONS (ask one, then silence)
====================================================================

1. THE QUESTION — "If TradeLocker already knows what happened in the account, how valuable is it to also know the context behind the trade — what the trader believed, which rules applied, what influenced them, and what they learned afterward?"
2. THE BOUNDARY — "Looking a few years out, which parts of that layer should TradeLocker own itself, and where does it make more sense for a partner to build it?"
3. THE PROOF — "If you were us, what's the one thing you'd prove in the next ninety days?"
4. THE BAR — "What would we have to demonstrate before an integration or a deeper relationship became genuinely interesting to TradeLocker?"
5. THE DATA — "In your data, what actually predicts whether a trader is still on the platform in six months?"
6. THE PROP FIRM — "At FunderPro, what share of failed challenges are strategy failures versus rule failures — and would a trader who could see the rule breach coming be worth more to you or less?"
7. THE DOOR — "Who should we be talking to that we don't know we should be talking to?"

Order for a short call: 1, then 3 or 7. Order for a long call: 1, 2, 6, 3, 4, 5, 7. Never all seven.

====================================================================
9. HOW IT EARNS — hypotheses, only if he asks "who pays?"
====================================================================

"Free to enter. Paid when the value is undeniable. Our current hypotheses, in order of confidence:
- serious traders pay for the full record — memory, morning brief, review, the AI in full;
- mentors and operators pay for the room, the student view and verified proof — and one operator brings a whole room of traders, which is why they may be the early distribution wedge;
- and the one we most want your view on: if this materially changes engagement, retention and rule behaviour, does the larger economic buyer become the broker or the prop firm?"

DELETED FOREVER: "traders are the inventory." "The mentor is the buyer" as settled fact. Any number of person-weeks.

====================================================================
10. COMPLIANCE, TEAM, TIMELINE — the honest answers
====================================================================

COMPLIANCE — "We've deliberately separated decision support and record-keeping from brokerage and execution, and we don't pretend that settles it. Mentor content, AI decision support, forecasts, data and any future integration each need formal legal review, market by market, before launch."

TEAM — [Who writes code. Hours per week. What is contracted.] Then: "Small on purpose until the data model is right. We're here partly because we know what we don't have."

TIMELINE — "The next technical milestone is durable trade state. Then broker ingestion. Then the trader model and verified history on top. We know the order; the major unknown is what we can reach through platform integrations." If he pushes for weeks: answer honestly (realistic: about seven months of one strong engineer; risk-adjusted more). Never volunteer it.

"IS THIS REAL?" — "Accounts, community backend, billing and the engine on live market data are real. The room, the forecast, the pre-trade check and the review are built interfaces on scripted or demo data. The record that links them is the next brick."

====================================================================
11. OBJECTIONS — one line each, honest
====================================================================

- "TradeLocker could build this." — "You could. The question is whether the layer that holds what the trader believed belongs inside an execution platform or beside it. We'd rather hear your answer than argue ours."
- "Journals already exist." — "After the fact, written by the trader, about themselves. The thesis here is stamped before the trade, the rule check is logged at the ticket, and the review reads both. The journal is a by-product, not a chore."
- "AI can already analyse trades." — "On the fill data, yes. It can't tell you the trader broke his three-trade rule, because the rule was never in the data. Ours is."
- "Traders won't document their reasoning." — "Agreed, if it's homework. Here the forecast is prefilled from the mentor's thesis and the rule check happens at the ticket. The record is captured, not written."
- "Garbage context, garbage AI." — "Which is why the engine is forbidden to cite anything outside the grounded data, and why the first brick is the data model, not more prompts."
- "Why does the mentor matter?" — "Because the mentor's call is the richest single input into a retail decision, and today it evaporates the second it's said. It's where influence enters the record."
- "What's proprietary?" — "Nothing today except the shape of the record and the discipline to build the data model before the features. The moat, if it comes, is the accumulated record per trader."
- "Network effects?" — "Room-level first: a mentor's record makes the room worth joining; the room's traders make the record deeper. Cross-room later, through verified history."
- "Privacy and data ownership?" — "The trader owns the record. The mentor sees what the trader shares. A platform partner would see what the trader consents to. We haven't built the consent layer yet; it's designed in, not bolted on."
- "Broker API limits?" — "Our biggest unknown, honestly. It's half of why we wanted this conversation."
- "Compliance?" — section 10.
- "Distribution?" — "Mentor-led rooms first — one operator brings a room. Prop-challenge traders second; they already live by rules."
- "Monetization?" — section 9.
- "Retention?" — "Our hypothesis is that a trader who can see his own rule breaches comes back and stays. Your data would confirm or kill that faster than ours will."
- "This is too much product." — "Fair. For this call it's three surfaces and one record. The rest is a map, not a roadmap."

====================================================================
12. NEVER SAY · NEVER SHOW
====================================================================

NEVER SAY
- "Sixth-tab killer." "Replaces MT5 / TradeLocker." "Outdated UX." "The best rail."
- "One workspace" as the headline. (It invites a platform comparison.)
- "Persistent memory", "decision provenance", "decision intelligence".
- "Traders are the inventory." "The mentor is the buyer."
- "28 person-weeks" or any estimate, unprompted.
- "We don't give signals so we're fine."
- "We've dreamed of this meeting." "One shot." Anything starstruck.
- Nine systems. Any system name except the ones on the screen.

NEVER SHOW
- Anything titled "Execution Console".
- The market question as the centrepiece.
- Trading DNA or Strategy OS numbers without the fixture label.
- The ICT / fake-maze story in the core (appendix only).
- The Dubai investor brief. The 13-slide investor deck. Any slide with "TradeLocker" as a villain.
- A browser window with other tabs. Repo root pages. Type-error counts.

====================================================================
13. OUTCOMES — how to judge the call afterwards
====================================================================

Bad: you talked for 45 minutes, he complimented the design, nothing happens.
Okay: he understood it and gave useful feedback.
Good: he named one real use case or told you what to change, and agreed to another conversation.
Very good: an introduction — product, API, broker, prop-firm — or some form of access.
Great: he helped define a small proof of concept he wants to see afterwards.
Extraordinary: he raised partnership, integration, distribution, advisory or capital himself. You did not.

The objective is UNDERSTANDING → CURIOSITY → STRATEGIC FEEDBACK → A SECOND STEP. Not investment. Not explaining ARCHIO.

====================================================================
14. TONIGHT · TEN MINUTES BEFORE · WITHIN 24 HOURS
====================================================================

TONIGHT — five decisions
1. The sentence. Both say it without reading. Same words or change them.
2. Advisor or partner? Decide what you'd say yes to. Then don't say it.
3. Who drives. One hand-off, at the demo.
4. The two stories. Sixty seconds. A morning, a number. Rehearse until they stop sounding rehearsed.
5. Rehearse the ten-minute version with a timer. Twice. It is the version that has to work.

TEN MINUTES BEFORE
- Fresh window. Only: the Owen route, /live-room, /dashboard. Read every tab title.
- Presenter notes on the second screen or the navigator's laptop.
- Notifications off. Charger in. Water.
- Reload the dashboard; ask it one question off-camera so the engine is warm.
- Say-first lines memorised. Timer ready. Camera at eye level.

WITHIN 24 HOURS
Subject: ARCHIO — what we heard
"Owen — thank you for the time today. Three things you said that changed how we're thinking: [his words, one line each]. The one thing we're doing next: [step, date]. One page in case it's useful to forward: [link]. — Kan and Luke"

====================================================================
APPENDIX A — INTEGRATION (open only if he asks how deep the design goes)
====================================================================
A contract drafted against TradeLocker's public API: token auth, demo and live base URLs, account-number header, route ids for trade and info, instruments, trade configuration, proposed server-only broker routes, idempotency keys, strict simulation/live separation. Zero code connected. Say: "This is what we could design from the outside. We've never had a conversation with anyone inside."

APPENDIX B — MENTOR VERIFICATION (open only if he raises mentors, scams or trust)
The fake maze around known mentors — copycat groups, signal sellers wearing a real name — costs beginners real money. ARCHIO's answer: an official profile, a verified room, a public forecast record, source-linked lessons. It is adjacent to what WhatProp does for prop firms. Not for the core call.

APPENDIX C — STRATEGY OS (open only at 45+ with the fixture label)
Rules with adherence, streaks, breaches; posture (optimal / active / alert); the intent-versus-action gap. It is the designed view of what the accumulated record produces. Fixture data today.
