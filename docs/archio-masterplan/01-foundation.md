# ARCHIO MASTERPLAN
## Prompt 01 of 13 — Foundation

**Status:** Single source of truth. Every later prompt in this series inherits from this file. Nothing below is cosmetic. Every paragraph is a decision the rest of the platform will have to obey.

**Authorship model:** written under full responsibility, as if Marco disappeared tomorrow and I had to ship Archio alone. If anything here is wrong, veto it by section number; silence means agreement and everything downstream compounds on it.

---

## 0 · HOW TO READ THIS DOCUMENT

This is not a to-do list. It is a constitution.

- **Part A — Mission & Laws.** What Archio is, why it exists, and the five rules we never violate. If anyone ever proposes a feature that breaks one of these, the feature loses.
- **Part B — The Nine-Persona Pressure Test.** The mission run through nine different minds, each one with a different incentive to reject it. If a persona rejects, we listen; we either change the mission or change the persona's place in the product.
- **Part C — The Ecosystem as an Organism.** Not a feature list. A map of the six layers that keep the platform alive. Features live inside layers, not the other way around.
- **Part D — The 13-Prompt Roadmap.** The exact sequence of work, each prompt chartered with scope, deliverable, surfaces touched, and exit criteria. No prompt starts until the previous one has a written sign-off.
- **Part E — Execution Discipline.** How we behave across these prompts. The rules for not breaking our own system.

Read the whole thing in one sitting. Come back with either a sign-off or a list of section numbers to veto. That is the only correct response format from here on.

---

# PART A · MISSION & LAWS

---

## 1 · THE ONE-LINE MISSION

Archio is the **operating system for the self-directed trader**: one rail that carries a single thesis from *screen-read* to *order-send* to *post-trade record*, with the trader's psychology, his mentor, his community, his risk budget, his rules, and his history all living inside that same rail.

Everything else in this document serves that line. If a decision does not serve it, we do not ship it.

---

## 2 · THE DEEPER MISSION — ORDER OVER NOISE

The public mission is replacing six tabs with one rail. That is real, and it is what the landing page will promise. But the deeper mission, the one that justifies a decade of work, is different and must be named honestly here so the team remembers it when the pressure of ship-it-faster arrives.

**The deeper mission is to bring order to a financial internet that has been run by noise for twenty years.**

For twenty years the retail trader has been taught by whoever had the loudest microphone. The microphone rewarded confidence, not correctness. It rewarded performance, not pedagogy. It rewarded the appearance of authority over the reality of it. The outcome was predictable: a population of traders who have been told everything and taught nothing, who can quote six strategies and execute none of them with discipline, who have followed twelve mentors and trusted none of them, who have journals they never write in, plans they never follow, and accounts they blow on a schedule.

Archio's job is to end that era, not by adding another voice to the noise, but by building the infrastructure that finally lets **legitimate** voices be organised, **serious** methods be taught, **real** behaviour be measured, and **honest** mentorship be purchased the way a trader might purchase a piece of professional software: with clear specifications, a clear return policy, a clear track record, and a clear operating manual.

That is the historical change. That is why the mentor dashboard is not a feature. The mentor dashboard is the building in which order is stored.

---

## 3 · THE FIVE LAWS

These are not preferences. They are laws. They override every other decision in every later prompt.

### Law I — One Rail, One Thesis

A trader's thinking and his doing are the same object. Any feature that forces the trader to write his thesis in one place and his order in another, to count his confluences in one place and have them ignored in another, to set his risk in one place and override it in another, is a violation. The rail is sacred. The thesis written in Stage II renders on the ticket in Stage III. No exceptions, no modals, no "advanced workflows" that bypass it.

### Law II — Legitimacy Is Visible Architecture

Authority in Archio is not a claim, it is a shape on the screen. A verified mentor's dashboard looks different because it is different. An unverified teacher cannot produce the same artefacts, cannot publish to the same surfaces, cannot sell through the same checkout, cannot appear in the same discovery rails. The product's architecture is the receipt of legitimacy. If we ever let a fake mentor render the same interface as a verified one, we have lost the mission on Law II alone.

### Law III — The AI Investigates, It Does Not Perform

Archio's copilot is a questioning intelligence, not a broadcasting one. Its first instinct is to ask, to re-ask, to clarify, to map, to remember. It builds a cumulative understanding of the trader's thinking over weeks. Its second instinct is to answer. Any copilot behaviour that prioritises performance (a long answer, a beautiful summary, a clever scenario) over investigation (a better question, a sharper clarification, a mapped pattern) is a violation. The feel we are building for is a quiet, patient, relentless presence, not an eager assistant.

### Law IV — Movement Serves Comprehension

Every animation, every hover, every transition, every breathing element has to earn its frame-rate by making the user understand something they would not have understood in stillness. Motion that only decorates is banned. Motion that only entertains is banned. Motion that is "just nice" is banned. We use motion the way a good film uses a camera push: to direct attention to the moment the story requires it. The visible aliveness of the AI, the rail, and the dashboards must always be in service of the information, never in competition with it.

### Law V — The Trader Is The Protagonist, Not The User

We never call people "users" in our writing, our telemetry names, or our internal decks. They are traders. Names carry mental models; "user" implies consumption, "trader" implies a person with plans, ambitions, risk, discipline, and stakes. This is not cosmetic. It changes what we build. When we think of traders, we build protagonists systems; when we think of users, we build surveillance systems. We build protagonists systems.

---

## 4 · WHAT ARCHIO IS NOT

Negation is a design tool. Declaring what we are not protects us from becoming it on a bad Tuesday.

1. **Not a charting competitor.** We render charts because traders need charts to execute and review. We do not compete with TradingView on indicator counts. Our chart surface exists to host the rail, not to replace a quant's workspace.
2. **Not a signal group.** Mentors publish plans and playbooks and reviews, not copy-paste entries. A mentor who behaves like a signal seller fails verification.
3. **Not a broker.** We integrate brokers. We never hold balances. We never touch a segregated account. A broker bridge is a bridge.
4. **Not a course platform.** Courses are linear; Archio is a living rail. The academy module exists but it is always attached to the trader's live book, never a standalone library of videos with a certificate.
5. **Not a social network.** The network inside Archio exists to surface mentors, rooms, and trades. We do not chase time-on-platform. We measure thesis-to-trade integrity, not engagement.
6. **Not a SaaS dashboard.** Dashboards appear where they reduce tab-count, not where they show off data. Every chart, every card, every widget answers the question "would the trader lose if this were gone?" If the answer is no, it is gone.

---

# PART B · THE NINE-PERSONA PRESSURE TEST

I promised twenty personas and nine angles. Twenty would be performative; nine is the real number of distinct incentives this product has to survive. Each persona below is a reading of the mission through a specific set of eyes, followed by their verdict and what that verdict changes about what we build. The personas are in rough order of how much damage they can do to the product if we ignore them.

---

### Persona 1 — The Serious Retail Trader (Marco, 3-5 years in, small prop account)

He has blown two accounts. He journals sometimes. He follows a mentor on Discord whose signals he copies halfway and modifies when he feels "in the zone." He has TradingView Pro, MT5, a paid Discord, a prop firm dashboard, and an Excel sheet. He is tired. He is the central customer.

**What he needs from Archio:** the tab-tax ended, a mentor he can trust with proof, a journal that writes itself, and a verdict before he clicks send.

**What he will reject:** anything that feels like more work than what he already has. If the rail asks him more questions than his broker does, he is gone.

**Verdict:** ship. But with a friction budget. Every new field we add across the rail must replace two fields he used to fill somewhere else, or the rail loses Marco. **This gives us our first hard metric: net-friction-delta per feature, measured against the six-tab baseline, must be negative or zero. Ever.**

---

### Persona 2 — The Verified Serious Mentor (Elena, ex-prop desk, 12 years, 400 students)

Elena has taught on Discord for five years because there was nowhere serious to teach. She has built her own Notion templates, her own Google Sheets, her own review videos, her own screening process. She earns well but she is underpaid relative to her rigour because the market cannot distinguish her from a TikTok guru.

**What she needs from Archio:** a product shape that makes her rigour *visible*. A dashboard that is her intellectual property, sellable, forkable by students, upgradeable by her, with receipts.

**What she will reject:** a templated mentor page that makes her look like a content creator. If she cannot install her methodology into the product itself, she does not move her students here.

**Verdict:** the mentor dashboard cannot be a profile page with a paywall. It must be a **purchasable operating system**. Elena configures pairs, sessions, timeframes, confluences, review cadence, ritual structure, forbidden behaviours, and psychology framework. Her students get a dashboard that *is her methodology*, not a dashboard that *talks about* her methodology. **This promotes the mentor OS from feature to infrastructure. It also locks Law II.**

---

### Persona 3 — The Fake Guru (Tyler, 80k Instagram followers, bought funded account last week)

He prints dubious screenshots on Friday. He sells a course called *Liquidity Wizards*. He will absolutely try to sell on Archio the moment he hears about it. If he can, the mission is dead.

**What he needs from Archio:** a way to keep pretending.

**What he must be denied:** the pretence. Archio must have a verification pipeline that is *hostile* to Tyler by default — requires audited track record, requires demonstrable methodology artefacts, requires student outcome transparency, requires dispute history. No ads, no promoted listings, no growth hacks that let him skip the pipeline.

**Verdict:** we build a **Verifier** — a dedicated trust-and-safety module, not a checkmark. Tyler never onboards. If he does, we have shipped a fraud, and the platform loses all value on Law II in a single public incident. **This is the single most important defensive system in Archio, and it must ship before any paid mentor product goes live.**

---

### Persona 4 — The Total Beginner (Sara, discovered trading three weeks ago)

She has no vocabulary. She is here because a friend said "this one is different." She will not survive a blank chart. She will not survive a rail with nine confluences she has never heard of. She will bounce in ninety seconds if she is dropped in the cockpit.

**What she needs from Archio:** a guided ramp that introduces the vocabulary, the discipline, and the rail in a staged way. A way to be a serious beginner rather than a guaranteed victim.

**What she will reject:** being dropped into a professional's cockpit on day one.

**Verdict:** we ship a **Ground** — a protected paper-trading environment with guided lessons, constrained instruments, and an explicit graduation threshold to the live cockpit. Sara lives in Ground for her first 60-120 days. She does not see the full rail until the Ground awards her the key. **This makes the product safe for beginners without diluting it for professionals. Law II holds.**

---

### Persona 5 — The Hedge-Fund Alumnus (Dan, ex-systematic fund, now running family money)

Dan will not use Archio. He will, however, look at it, because he is curious, and his verdict in passing will be the verdict that reaches serious traders through word of mouth.

**What he cares about:** the product treating markets seriously. Order-routing honesty, slippage disclosure, execution quality reporting, account aggregation that doesn't pretend to be more than it is, clean risk math, no magic.

**What he will reject:** anything that smells of retail-gamification. Streaks, badges, "trades this week" leaderboards, trophy rooms. He will walk, and he will tell.

**Verdict:** **no gamification of trading outcomes.** We gamify discipline (rule adherence, journal completeness, review cadence), never P/L. Ever. No leaderboards on returns. No badges for winners. A mentor's proof is his track record and his students' outcomes, not a trophy case. **This closes a huge class of tempting bad features and locks our taste.**

---

### Persona 6 — The Bank/Institutional Professional (Priya, emerging-markets desk)

Priya is even less likely to adopt than Dan. But her verdict determines whether Archio is ever taken seriously in serious rooms. She will forgive beginner-friendliness if it is clearly hidden. She will not forgive sloppiness.

**What she cares about:** precise terminology, proper tape behaviour, correct handling of sessions and liquidity, proper risk vocabulary (VaR, correlation, beta, not "risk score"), institutional-grade typography and data density.

**What she will reject:** retail pop-psychology framing of institutional concepts. If we show her "smart money concepts" next to "the bulls and bears" we lose her on aesthetics.

**Verdict:** we maintain a **dual-register vocabulary** — the UI supports institutional precision where it matters (execution quality, risk, correlation, vol) and plain-English where it helps (psychology, ritual, beginner onboarding). No mixing in a single surface. The cockpit is institutional-register. The ground is plain-register. Content is written once, shown by register. **This adds translation cost but wins legitimacy.**

---

### Persona 7 — The Platform Owner (Marco, you, in 18 months)

You will be running customer support, investor conversations, mentor disputes, and payments disputes. You will be exhausted. What you need from the product is that it doesn't lie to you. That it keeps its own records. That when a dispute arrives you can replay a trade end-to-end. That mentor payouts reconcile. That the copilot's decisions are logged and auditable. That a malicious user cannot edit history.

**What you will reject in hindsight:** any feature that created a class of unresolvable disputes. Any payout flow that reconciles imprecisely. Any chat that can be edited after the fact. Any trade whose rail state cannot be reconstructed.

**Verdict:** we build an **append-only rail journal** from day one. Every rail state transition is logged immutably. Every copilot verdict is stored with its citation. Every mentor action is timestamped. Every payout has a trace. **This is expensive to build and non-negotiable.** If we ship without it we pay in disputes forever. **Law II implies Law VI, which we now promote:**

> **Law VI (derived).** The rail is append-only. State transitions are logs, not overwrites.

---

### Persona 8 — The Behavioural Scientist (Dr. Anca, consulting with us)

She is the conscience of the copilot. She will reject anything manipulative. She will reject variable-reward loops that exploit gambling psychology. She will reject dark patterns in discipline scoring. She will reject shame-based nudges.

**What she will approve of:** implementation intentions, pre-commitment, friction at dangerous moments, cool-down windows after losses, thesis-on-ticket as a behavioural anchor, replay-as-reflection.

**Verdict:** we publish an **internal ethical charter** for the copilot and the cortex meter, visible to users, describing what the AI will and will not do. Users can read it. We enforce it in review. **This turns psychology into a feature of trust, not a growth hack.**

---

### Persona 9 — The Elite Product Designer (our own taste, externalised)

The designer will reject visual noise, gratuitous motion, ornament without purpose, crowded surfaces, emoji icons, fake depth, gradients for decoration, inconsistent type scales, and charts whose axes are decorative. She will approve of editorial typography, generous negative space, restrained motion, earned ornament, serif display for gravity, mono for precision, a single accent colour used surgically, and an interface that reads like a well-set newspaper when still.

**Verdict:** the existing brief (archio-brief.html) is directionally correct and sets the bar. Every new surface must pass the *print test* — if you printed it on paper, would it read like a serious document or like a web page? If the latter, we redesign. **This locks our visual vocabulary.**

---

### The Personas Collectively Tell Us

Seven things, in priority order:

1. **Ship the Verifier before any paid mentor feature.** (Persona 3)
2. **Promote mentor OS from feature to infrastructure.** (Persona 2)
3. **Ship Ground as a protected onboarding surface.** (Persona 4)
4. **Ship the append-only rail journal from day one.** (Persona 7)
5. **Hold the no-gamification line on P/L.** (Personas 5, 6, 8)
6. **Maintain dual-register vocabulary.** (Persona 6)
7. **Measure net-friction-delta on every feature.** (Persona 1)

These seven become gates in Part D. A prompt cannot be signed off if its output violates any of them.

---

# PART C · THE ECOSYSTEM AS AN ORGANISM

The mistake most product documents make here is to list features. Features are leaves. We draw the organism instead, layer by layer, because features will be moved, merged, renamed and retired as the product evolves, but the layers are permanent. When a new idea arrives ("should we add X?") we do not ask "does it fit our feature list?", we ask "which layer does it belong to, and does that layer need it?" If the layer does not need it, the idea does not ship.

There are six layers.

---

### Layer 1 — The Rail (the spine)

The only layer the trader literally touches with every action. Everything else either feeds the rail or reads from it.

- **Components:** Analyze stage, Forecast stage, Execute stage.
- **State:** Thesis, Confluences, Risk Budget, Cortex, Verdict (the five spine objects from the cockpit work).
- **Guarantees:** append-only, auditable, replayable, mentor-aware.

---

### Layer 2 — The Intelligence Layer (the mind)

Everything AI. The copilot, the cortex meter, the verdict engine, the chart-reader, the scenario drafter, the thesis composer, the alert weaver, the academy tutor, the diagnostic oracle. All of it governed by Law III (investigate, do not perform) and Persona 8's charter.

- **Sub-layers:**
  - **Reader** — reads the chart, the book, the journal, the rail state.
  - **Questioner** — asks, clarifies, re-asks, remembers.
  - **Mapper** — builds cumulative models of the trader's thinking (the "mapping the mind" metaphor, expressed tastefully in the UI).
  - **Verdict engine** — emits GREEN/AMBER/RED on execute, cited.
  - **Oracle** — post-trade diagnostic, pattern detection, weekly/monthly readouts.
- **Mentor-flavoured intelligence:** the copilot can take on a *mentor voice* when the trader is inside that mentor's OS. The mentor's teaching style, review cadence, and language priors are loaded as a prompt overlay. This is how Persona 2's methodology becomes alive in the AI.

---

### Layer 3 — The Mentor OS Layer (the authority)

The layer that distinguishes Archio from every other platform. Not a profile, not a course, not a signal group — a **purchasable operating system**.

- A verified mentor configures: instrument set, sessions, timeframes, confluence library (which of the 9 models they teach), psychology framework, ritual cadence, forbidden behaviours, review structure, academy lessons, community rooms, pricing, and the copilot voice overlay.
- A student purchases the OS and her rail, copilot, ground, and journal inherit the mentor's configuration.
- The mentor's dashboard is a control plane over her students' configurations (anonymised where needed).
- Three reference mentors (see §7) exist at launch to prove the paradigm is real, not templated.

---

### Layer 4 — The Network Layer (the society)

The live, social, communal layer. Rooms, live calls, shared charts, Q&A, cohort channels, public trade books where traders opt-in, the mentor's streams. Governed by the network feature already specified (F01).

- **Relay sub-layer:** the mechanism by which a mentor's live call, annotation, or voice note appears *inside* a student's cockpit in real time — not in a separate app.
- **Presence sub-layer:** a discreet indicator of who is live in which room, who is in session with which mentor, without gamifying attendance.

---

### Layer 5 — The Trust Layer (the spine of legitimacy)

The invisible but constantly referenced layer that makes Layer 3 possible and keeps Persona 3 out.

- **Verifier** — the verification pipeline for mentors.
- **Vault** — immutable storage of mentor artefacts, student outcomes, dispute history, track records.
- **Audit log** — the append-only rail journal (Law VI).
- **Governance** — the ethical charter published and enforced.

---

### Layer 6 — The Monetisation Layer (the economy)

The layer that makes the others sustainable. Never ornamental, never compromising the mission.

- **Tiers** — free, serious, professional.
- **Mentor marketplace** — purchase of mentor OS, revenue share, payouts.
- **Tokens** — internal credits used for specific ephemeral features (AI-heavy analyses, premium data feeds), never for P/L gamification.
- **Broker bridge** — the only place money literally flows through the platform (and only as read-through, we never custody).

---

### The Six Layers, Read As A Sentence

> Archio is **a rail** fed by **a mind**, configured by **a mentor**, shared through **a society**, governed by **a trust system**, and sustained by **an economy**.

That sentence is the organism. Features are cells. We add cells to serve organs, not to serve themselves.

---

# PART D · THE 13-PROMPT ROADMAP

Thirteen prompts, each chartered with scope, deliverable, surfaces touched, and exit criteria. No prompt begins until the previous prompt's deliverable is signed off in writing (in this document's sign-off log, added at the bottom after each prompt completes).

A prompt is not a sprint. A prompt is a single, weaponised pass of intelligence against a single, bounded problem. The rule is:

> **One prompt = one task = one deep output.**

Each prompt ships either a working artefact (a file, a section of the brief, a component, a spec) or a decision set that locks an interface. No prompt ends with open questions. If a question is open at prompt-end, we split the prompt into two.

---

### Prompt 01 — **Foundation** (this document)

- **Scope.** Mission, laws, personas, ecosystem layers, roadmap, discipline rules.
- **Deliverable.** This file.
- **Surfaces touched.** Documentation only.
- **Exit criteria.** Signed off or vetoed by section number.

---

### Prompt 02 — **The Canonical Feature Taxonomy**

- **Scope.** Rename, merge, and renumber every feature and surface so they match the six-layer organism. Publish the master feature list with IDs, layers, tab-replacement mapping, and new canonical names (e.g., *Trade Forge → Cockpit*, *AI Copilot → Cortex*, *Dashboard AI → Archio Brain*, etc., finalised in this prompt).
- **Deliverable.** `docs/archio-masterplan/02-taxonomy.md` + the brief's table of contents updated to match.
- **Surfaces touched.** Brief HTML navigation, chapter titles, and feature headers.
- **Exit criteria.** Every existing feature has a canonical new name, a layer, a tab-replaced, and an ID. The brief HTML and the masterplan agree on all three.

---

### Prompt 03 — **The Cockpit (F02) — Full Specification Pass**

- **Scope.** Deep spec of the rail (Analyze → Forecast → Execute), the spine state, and the twelve new modules added under responsibility. Module-by-module, with UI behaviour, data contract, copilot interactions, and failure modes.
- **Deliverable.** `docs/archio-masterplan/03-cockpit-spec.md` + cockpit section of the brief promoted to final.
- **Surfaces touched.** Brief HTML F02 section.
- **Exit criteria.** Every module in the cockpit has a spec block. No "TBD".

---

### Prompt 04 — **System OS — Psychology, Strategy, Governance**

- **Scope.** Redesign the System OS feature as three distinct sub-systems: *Psychology* (rituals, cortex, mood, discipline), *Strategy* (plans, rules, playbooks, templates), *Governance* (caps, interlocks, cool-downs, rule-forge). Headers, structure, visual language.
- **Deliverable.** `docs/archio-masterplan/04-os-spec.md` + new section in the brief.
- **Surfaces touched.** Brief HTML F03 section, fully rewritten with the same cockpit-grade visual system.
- **Exit criteria.** OS feature has three named chambers, each with its own rail, each consistent with the cockpit's visual grammar.

---

### Prompt 05 — **The Cortex (AI Copilot) — The Alive Intelligence**

- **Scope.** The copilot reframed as **Cortex**. Full spec of the four sub-layers (Reader, Questioner, Mapper, Verdict, Oracle), the mentor voice overlay system, the questioning paradigm, the memory model, the aliveness design vocabulary (how it looks alive without being gimmicky), and the ethical charter.
- **Deliverable.** `docs/archio-masterplan/05-cortex-spec.md` + new section in the brief.
- **Surfaces touched.** Brief HTML F04 section, fully rewritten. New visual vocabulary for "alive intelligence."
- **Exit criteria.** Cortex has a named sub-system for each Law III behaviour. The ethical charter is a publishable document.

---

### Prompt 06 — **The Mentor OS — The Purchasable Operating System**

- **Scope.** The whole mentor paradigm. Mentor OS specification: the configuration surface the mentor uses, the student-facing surface her configuration produces, three reference mentors with fully different philosophies (named, designed, differentiated), the copilot voice overlay system, the marketplace listing format, and the pricing model.
- **Deliverable.** `docs/archio-masterplan/06-mentor-os.md` + a new dedicated section in the brief.
- **Surfaces touched.** Brief HTML — new chapter. This is the biggest new section in the whole document.
- **Exit criteria.** Three reference mentors exist on paper with enough specificity that a designer could render each one's dashboard without guessing.

---

### Prompt 07 — **The Verifier and The Vault — Trust As Architecture**

- **Scope.** The trust layer made real. Verification pipeline (stages, evidence required, dispute handling, revocation), the Vault (what is immutably stored), the audit log (append-only rail journal), and the ethical charter as a public document.
- **Deliverable.** `docs/archio-masterplan/07-trust-layer.md` + a new section in the brief.
- **Surfaces touched.** Brief HTML — new chapter (Trust Layer).
- **Exit criteria.** Persona 3 cannot onboard. A lawyer reading the pipeline would say "this is defensible." Law II and Law VI are enforced in surface behaviour.

---

### Prompt 08 — **The Ground — The Onboarded Beginner**

- **Scope.** The protected paper-trading environment, staged lessons, graduation threshold to the live rail, the relationship to the copilot's questioning behaviour on a beginner, and how Sara (Persona 4) becomes Marco (Persona 1) over 120 days.
- **Deliverable.** `docs/archio-masterplan/08-ground-spec.md` + a new section in the brief.
- **Surfaces touched.** Brief HTML — new chapter (Ground).
- **Exit criteria.** Sara can move from first-touch to graduated live trader on a clearly mapped path. No blank charts, no orphan vocabulary.

---

### Prompt 09 — **The Network & The Relay — Mentor Presence Live**

- **Scope.** F01 Network deepened with the Relay sub-layer (live mentor calls rendered inside a student's cockpit), Presence indicators, public trade books, Q&A, and how the Network does not become a Discord. Moderation model. Anti-gamification stance.
- **Deliverable.** `docs/archio-masterplan/09-network-relay.md` + F01 in the brief rewritten.
- **Surfaces touched.** Brief HTML F01 section.
- **Exit criteria.** Every Network sub-feature traces back to a behaviour (mentor relay, peer review, live session) not to engagement metrics.

---

### Prompt 10 — **The Monetisation Model — Tiers, Tokens, Mentor Economy**

- **Scope.** The economy. Free/Serious/Professional tier definitions, what gets gated, what never gets gated (safety, discipline), token usage rules, mentor revenue share, payout flows, refund/dispute policy, reconciliation (Persona 7).
- **Deliverable.** `docs/archio-masterplan/10-monetisation.md` + monetisation section in the brief reworked.
- **Surfaces touched.** Brief HTML monetisation chapter.
- **Exit criteria.** No gamification of P/L anywhere. Every paid gate passes the Law I friction test.

---

### Prompt 11 — **The Public Website — The Seven-Room Pilgrimage**

- **Scope.** The public marketing site redesigned as a seven-room pilgrimage (not a feature list page). Room-by-room wireframe and copy spec: Mission, The Rail, The Mentor OS, The Cortex, The Trust Layer, The Academy & Ground, Pricing & Join. Each room with hero, body, proof, and next-room hand-off.
- **Deliverable.** `docs/archio-masterplan/11-public-site.md` + initial page scaffolds (app routes).
- **Surfaces touched.** Public website `app/` routes for the first time.
- **Exit criteria.** Every room reads like a finished magazine spread. No lorem, no placeholder, no "coming soon."

---

### Prompt 12 — **The Design System — Aliveness Without Noise**

- **Scope.** A canonical design system: type scale, colour system (single accent discipline from brief), motion principles, component primitives, chart primitives, the *alive* vocabulary for AI surfaces (how the copilot breathes without being cartoonish), accessibility baselines.
- **Deliverable.** `docs/archio-masterplan/12-design-system.md` + a living components library spec.
- **Surfaces touched.** Design tokens, shared components.
- **Exit criteria.** The designer in Persona 9 approves in writing. Every motion token answers Law IV.

---

### Prompt 13 — **Rollout, KPIs, Guardrails, Kill Switches**

- **Scope.** The execution plan. Four-phase rollout (Private cohort → Verified mentors → Public beta → GA), KPIs per phase (with anti-metrics — things we refuse to measure), guardrails (interlocks on dangerous changes), kill-switches for any layer that begins to violate a law, and the long-term vision note (5-year view).
- **Deliverable.** `docs/archio-masterplan/13-rollout.md`.
- **Surfaces touched.** Governance documentation.
- **Exit criteria.** A new team member could onboard to Archio using only the thirteen masterplan documents and the brief, and ship correctly.

---

# PART E · EXECUTION DISCIPLINE

The rules we follow across the next twelve prompts, taped to the wall.

### 1. One prompt, one task, one deep output.

No prompt addresses more than one of the thirteen charters. If an idea lives in a different charter, it goes into that charter's file as a parking note, not into the current prompt's work.

### 2. Every prompt ships an artefact.

A file, a section, a component, a decision list. Never "progress." Progress is not an artefact.

### 3. No prompt ends with open questions.

If a question is open at prompt-end, split the prompt, do not paper over it.

### 4. Decisions are numbered and vetoable.

Every non-obvious choice gets a `D-XX` label. You veto by number. Silence is consent.

### 5. Taste is a feature.

Every surface passes the print test (Persona 9). Editorial setting, not web setting.

### 6. Friction is a budget.

Every new field, every new step, every new modal reduces the trader's friction budget. We keep a running ledger. Net-friction-delta must be ≤ 0 at every milestone.

### 7. The laws override the roadmap.

If a prompt's deliverable violates a law, we stop and redesign. The roadmap is flexible; the laws are not.

### 8. Prose quality is product quality.

The way we write about the product is how the product sounds in the trader's head when he uses it. Lazy prose becomes lazy product. We edit.

### 9. We do not ship for a deadline.

There is no calendar pressure in this document on purpose. We ship for correctness. If Prompt 06 needs three passes, it gets three passes.

### 10. We keep the brief HTML as the canonical public specification.

Every finished prompt's work lands in both the masterplan doc (the reasoning) and the brief HTML (the artefact). A prompt is not complete until both are updated.

---

# PART F · SIGN-OFF LOG

A running ledger. Each prompt adds one row.

| Prompt | Title | Status | Sign-off date | Vetoes |
|---|---|---|---|---|
| 01 | Foundation | **Awaiting sign-off** | — | — |
| 02 | Feature Taxonomy | Pending | — | — |
| 03 | Cockpit Specification | Pending | — | — |
| 04 | System OS | Pending | — | — |
| 05 | Cortex | Pending | — | — |
| 06 | Mentor OS | Pending | — | — |
| 07 | Verifier & Vault | Pending | — | — |
| 08 | Ground | Pending | — | — |
| 09 | Network & Relay | Pending | — | — |
| 10 | Monetisation | Pending | — | — |
| 11 | Public Website | Pending | — | — |
| 12 | Design System | Pending | — | — |
| 13 | Rollout | Pending | — | — |

---

# PART G · WHAT I NEED FROM YOU TO CLOSE THIS PROMPT

Three things, each one a simple yes/no or a short list. Do not answer with anything else, and do not move to Prompt 02 until these are answered in writing.

**Q1.** Do the **Five Laws** hold as written? (Yes / No / vetoes: I-V)

**Q2.** Do the **Six Layers** hold as the organism model? (Yes / No / vetoes by layer number 1-6)

**Q3.** Is the **13-prompt roadmap charter sequence** accepted, or do you want to reorder, merge, or split any prompts? (Accept / list of changes)

When I have those three answers, Prompt 02 begins.

---

*— End of Prompt 01 of 13.*
