# ARCHIO — MASTER PLAN

**Authored under responsibility.** Written as if the product had to ship with no second pass.
**Scope:** the entire app, the entire public website, the feature taxonomy, the ecosystem, and the rollout sequence.
**Status:** single source of truth for organisation. Everything below is a numbered decision (D-01 … D-47). Veto any decision by number.

---

## 0. THE ONE-LINE THESIS

Archio is not a charting tool, not a journal, not a course platform, not a signal group, not a broker. Archio is the **operating system for the self-directed trader** — one rail that carries a single thesis from *screen-read* to *order-send* to *post-trade record*, with the trader's psychology, his community, his mentor, his risk budget, and his history all living inside that same rail.

Every design decision in this document serves that line.

---

## 1. THE ONE PROBLEM WE ARE SOLVING

The retail trader lives across **six tabs**:

1. TradingView for charts
2. Forex Factory for macro
3. MT5 / cTrader for execution
4. Discord for his mentor / signals
5. Notion or an Excel sheet for his journal
6. Prop-firm dashboard for account rules

None of those six tabs know that the other five exist. The thesis he writes on Sunday is not on the order ticket on Tuesday. The confluence he counted in TradingView is not in his MT5 order. The rule his prop firm gives him is not gating his size. His mentor's live call never appears on his chart.

**The tab-tax is the real drawdown.** Archio's only job is to kill it.

> **Decision D-01.** The product's entire framing — marketing, product, docs — must be organised around *killing the tab-tax*, not around "features." Every surface answers the question *"which tab does this replace?"*.

---

## 2. THE CURRENT STATE — HONEST AUDIT

**What exists (the brief documents it well):**
- F01 Network — mentors, rooms, live calls, community.
- F02 Trade Forge — newly merged: Analyze → Forecast → Execute rail (done in the last pass).
- F03 System OS — psychology + strategy surface (underdeveloped header).
- F04 AI Copilot — always-on AI (underdeveloped header).
- F05 Dashboard AI — aggregate brain (renumbered from F06).

**What is strong:**
- The Cockpit (F02) is now the flagship. The spine (Thesis → Confluences → Risk → Cortex → Verdict) is the correct abstraction.
- The visual DNA (serif + mono + amber + paper) is consistent and premium.
- The monetisation architecture exists and is coherent.

**What is weak:**
- F03 and F04 are flat compared to F02. They need the same cockpit-grade reorganisation.
- F05 Dashboard AI is end-of-document — it should be understood as *the other end of the rail*, the retrospective twin of F02.
- No explicit **ecosystem diagram** — broker bridge, prop-firm bridge, oracle, marketplace are implied but not named.
- No explicit **flow chapters** — the brief lists features, not journeys. A new trader cannot read the document and see his own day.
- No explicit **growth ladder** — paper → small real → prop → funded — is invisible. This is the spine of the mentor business and must be first-class.
- The marketing site has no clear top-level IA separate from the brief. "Brief" and "site" are collapsed.

---

## 3. THE NEW TOP-LEVEL ARCHITECTURE

Two properties, cleanly separated:

- **archio.com** — the public marketing site (acquisition, proof, pricing, academy).
- **app.archio.com** — the product (where money moves and journals get written).

> **Decision D-02.** Split the domains cleanly. Marketing lives on the root domain; product lives on `app.`. This is standard SaaS discipline and removes ambiguity about what any given URL is.

---

### 3.1 THE PRODUCT (app.archio.com) — FIVE SURFACES, ONE RAIL

```
     +-----------------------------------------------------------+
     |                         COCKPIT                           |
     |     Analyze  ->  Forecast  ->  Execute   (F02 . flagship) |
     +-----------------------------------------------------------+
              |                                      |
              v                                      v
     +------------------+                  +-----------------------+
     |     NETWORK      |                  |          OS           |
     |  mentors, rooms, |                  | journal, rules, risk, |
     |  live, community |                  | psychology, playbooks |
     |     (F01)        |                  |         (F03)         |
     +------------------+                  +-----------------------+
              \                                      /
               \                                    /
                v                                  v
              +----------------------------------------+
              |              DASHBOARD AI              |
              |  portfolio, oracle, retrospective,     |
              |  edge decomposition, growth ladder     |
              |                (F05)                   |
              +----------------------------------------+
                               ^
                               |
                 +-----------------------------+
                 |           COPILOT           |
                 |   cross-surface intelligence|
                 |   (F04 . always present)    |
                 +-----------------------------+
```

> **Decision D-03.** Five surfaces, not six. The Copilot is *always present* — it is a layer, not a destination. Its own "page" exists only as a documentation surface in the product (the prompt library, the rules, the memory).

> **Decision D-04.** The Cockpit is the hub. Everything else orbits it. The app's default home is the Cockpit, not a generic dashboard.

> **Decision D-05.** The Dashboard is the *retrospective* twin of the Cockpit. The Cockpit asks "what should I do now." The Dashboard asks "what did I do, over time, and what does it mean." One is forward-facing; one is backward-facing. Together they bracket the trader's cognition.

---

### 3.2 THE PUBLIC SITE (archio.com) — SEVEN ROOMS

```
/                       Landing (manifesto + coach + edge + brain demos)
/product                Product overview (links to the 5 surfaces below)
/product/cockpit        Feature page - Cockpit
/product/os             Feature page - OS
/product/copilot        Feature page - Copilot
/product/network        Feature page - Network
/product/dashboard      Feature page - Dashboard AI
/flows                  The day, the week, the growth ladder, the diagnostic
/academy                Structured learning path (not a course library)
/mentors                Mentor directory, public records, proof-of-edge
/pricing                Tiers + tokens + mentor ladder
/manifesto              Why Archio exists (the trust + category argument)
/brief                  The deep brief (what exists today, kept as a "spec" room)
```

> **Decision D-06.** The brief is no longer the site. It is one link on the site, reserved for serious readers. The site is a public acquisition surface with its own IA.

> **Decision D-07.** `/flows` is a new top-level room. No SaaS today explains its product through the user's day. Archio will, and that alone is a marketing moat. Six canonical flows live there — see Section 6.

> **Decision D-08.** `/mentors` is a top-level room. Mentors are not a feature page inside Network — they are a primary acquisition surface with their own directory, their own public proof, their own credibility.

---

## 4. THE FIVE SURFACES — EXPANDED TAXONOMY

### 4.1 F02 · COCKPIT (already rebuilt in the last pass — keep, extend)

Three stages, spine of five, route `/forge`. Done. One addition:

> **Decision D-09.** Add a hidden **fourth stage — RECORD** — that is not a stage the trader navigates to, but an *automatic* stage the system performs at the moment of order-send. It writes the trade record (thesis, confluences, cortex, verdict, screenshots, timestamps, fills) into the Vault and into the Journal. This is the plumbing that guarantees every trade has a complete record.

---

### 4.2 F03 · OS — **rename: "Operating System — Psychology, Strategy, Governance"**

Current header is too flat. The OS is three things, not one:

- **Psychology** — cortex, tilt detection, forced cooldowns, session-state, pre-market ritual.
- **Strategy** — playbooks, rules, patterns, backtest, strategy-vault.
- **Governance** — risk caps, prop-firm rules, daily/weekly limits, the interlock.

> **Decision D-10.** Reorganise F03 into three named chambers: **Psychology**, **Strategy**, **Governance**. Each is its own deep section with its own header, its own modules, its own flows. Same cockpit-grade visual system as F02 (three-stage rail pattern, reused).

> **Decision D-11.** Add a new module: **The Morning Ritual** — a three-step pre-market check-in (sleep / state / intent) that must be completed before the first trade of the day or the interlock throttles size by 50%. This is the psychological equivalent of the rule-locked autosize.

> **Decision D-12.** Add **The Evening Ledger** — an automatic end-of-day digest written by the Copilot, summarising the trader's day, rule violations, emotional state, and one proposed change for tomorrow. Mandatory read; optional journal entry.

> **Decision D-13.** Add **The Rule Forge** — a surface where the trader composes his own rules in plain English, and the Copilot compiles them into interlock predicates. Example: *"Never trade GBP on NFP if I'm already up 3R this week"* → compiled rule object → stored → enforced.

> **Decision D-14.** Add **The Playbook Library** — named strategies (London OB, NY Liquidity Sweep, Asian Breakout, etc.) each with entry rules, exit rules, risk profile, historical hit-rate, and one-click prefill into the Cockpit ticket.

> **Decision D-15.** Add **The Prop Firm Mirror** — live sync of the trader's prop-firm rules (FTMO / MFF / Topstep / Funding Pips) with daily cap, max DD, permitted instruments, news restrictions, consistency rules — all of which flow into the Cockpit interlock as hard gates.

> **Decision D-16.** Add **The Growth Ladder** — explicit visible progression: Paper → Micro Live → Prop Challenge → Prop Funded → Live Capital. Current rung visible on every surface. The OS knows where the trader is on the ladder and adjusts defaults accordingly.

OS suggested new sub-route tree:

```
/os                         overview
/os/psychology              cortex, ritual, ledger, tilt
/os/strategy                playbooks, rules, backtest, vault
/os/governance              risk, prop-mirror, ladder, interlock
```

---

### 4.3 F04 · COPILOT — **rename: "Cortex — The Always-On Intelligence"**

Current "AI Copilot" is generic and crowded (everyone has a copilot). "Cortex" is claimed, sharp, and matches the existing spine vocabulary.

> **Decision D-17.** Rename the feature from "AI Copilot" to **"Cortex"** in headings and marketing. Keep "copilot" as the generic noun when describing *how the assistant feels*, but the product-name is Cortex. This is a brand-taste call; it also resolves the confusion with the "cortex" meter in the spine.

*Alternative if you disagree:* keep "Copilot" as the name, and rename the spine meter from "Cortex" to "State" or "Discipline." Pick one; do not let both exist.

> **Decision D-18.** The Cortex feature is described as **four organs**, not one chat box:

1. **Chart-Reader** — reads any chart on any surface, answers cited to the chart.
2. **Verdict** — GREEN / AMBER / RED on any proposed trade, cited to spine state.
3. **Diagnostic** — after a loss or drawdown, produces a root-cause narrative (not a tweet).
4. **Oracle** — queryable across the trader's full history. "How did I do on NFPs when I was up on the week?" → cited answer.

> **Decision D-19.** The Cortex has **one memory layer**, shared across all four organs, persisted per-user. It reads the Vault, the Journal, the Cockpit state, the OS state. It never forgets. This is the oracle-readiness the Dashboard plan already hints at.

Cortex suggested sub-routes:

```
/cortex                   overview + prompt bar
/cortex/reader            chart-reader surface
/cortex/verdict           verdict console (usually embedded in Cockpit)
/cortex/diagnostic        diagnostic reports
/cortex/oracle            natural-language query over history
```

---

### 4.4 F01 · NETWORK — **rename: "Network — Mentors, Rooms, Relay"**

"Unified Network" is soft. The word that makes this feature sing is **Relay** — the thing no competitor has. When a mentor on a live call marks a setup, that setup *relays* into every viewer's Cockpit as a pre-populated card. Not a signal — a *framed observation* with the spine pre-filled.

> **Decision D-20.** Make **Relay** a first-class named module of F01. It is the bridge between the community surface and the execution surface. It is the single biggest reason a user pays for community inside Archio rather than a $250 Discord.

> **Decision D-21.** Network is reorganised into three chambers:

- **Mentors** — directory, proof-of-edge, subscription, DMs.
- **Rooms** — live and scheduled rooms, stage view, audience layer.
- **Relay** — the pipe that pushes framed observations from any room into any viewer's Cockpit.

> **Decision D-22.** Add **Proof-of-Edge** — every mentor has a public, verifiable performance record (the Dashboard's public view, tied to their actual trades). Not testimonials. *Data*. This is the credibility engine for the whole marketplace.

> **Decision D-23.** Add **Stage View** — mentor's host surface for running a live call, distinct from the viewer's room surface. Mentor sees audience segments, Q&A priority queue, cortex overlay of the room, engagement quality bars, and a single button: *relay this setup to viewers' Cockpits.*

Network suggested sub-routes:

```
/network                 overview
/network/mentors         directory + proof-of-edge
/network/rooms           live + scheduled
/network/relay           relay inbox (viewer side) + relay sender (host side embedded in Stage)
```

---

### 4.5 F05 · DASHBOARD AI — **rename: "Archio Brain — Retrospective, Portfolio, Oracle"**

The word "dashboard" undersells it. This is the **retrospective twin** of the Cockpit.

> **Decision D-24.** Rename to **"Archio Brain"** in the product. Keep "Dashboard" only as a generic English descriptor on hover.

> **Decision D-25.** The Brain has four rooms:

- **Portfolio** — aggregate P&L across accounts, exposure map, correlation matrix.
- **Edge** — edge decomposition by instrument, session, setup, and mentor influence.
- **Behaviour** — psychology over time (cortex trend, rule violations, tilt events).
- **Oracle** — the natural-language query surface (shared with Cortex but lives here as the primary UI).

> **Decision D-26.** Keep the existing Community Performance Dashboard plan (`v0_plans/intuitive-spec.md`) as the **mentor-facing variant** of the Brain. Users see their own Brain; mentors see a mentor-grade Brain with audience intelligence layered on top. Same component family, different privilege.

> **Decision D-27.** Add **The Concentration Warning** — if the trader's recent P&L is >60% from one instrument or one session type, the Brain shows a persistent amber strip. Edge is quietly fragile when it is concentrated; most traders do not notice until the concentration breaks.

---

## 5. WHAT'S MISSING — NEW FEATURES TO ADD

These are first-class systems the brief does not yet name. Each has a proposed home.

### 5.1 The ecosystem bridges

> **Decision D-28.** Add **Broker Bridge** (lives in OS → Governance). Abstract adapter layer for MT5, cTrader, DXtrade, TradingView webhooks, Binance, Coinbase, IBKR. The Cockpit Execute stage talks to Broker Bridge, never to a specific broker. Makes the product broker-agnostic and survives any individual broker's API going down.

> **Decision D-29.** Add **Prop Firm Bridge** (lives in OS → Governance). Read-only sync with FTMO, MyForexFunds successor, Topstep, Funding Pips, The5ers, etc. Fetches rules, account state, consistency metrics. Feeds interlock.

> **Decision D-30.** Add **Vault** (cross-cutting; its own sub-route `/vault`). Immutable storage of every trade record, screenshot, voice note, journal entry, thesis, verdict. The Oracle reads from here. The mentor's public Proof-of-Edge reads from here. The backbone of memory.

### 5.2 The growth ladder surfaces

> **Decision D-31.** Add **Paper Ground** (its own sub-route `/paper`). Not a toggle — a full environment. Real-time tape, real spreads, identical Cockpit, identical OS, identical interlock, zero money. Every feature that exists in live, exists in paper. The Growth Ladder starts here.

> **Decision D-32.** Add **Prop Challenge Mode** (lives in OS → Ladder). A pre-configured mode where the interlock is tuned to a specific prop firm's rules. The trader picks his firm; Archio auto-configures caps, instruments, consistency rules. He trades toward the challenge inside the Cockpit.

### 5.3 The surveillance layer

> **Decision D-33.** Add **Sentinel** (cross-cutting; daemon; surfaces live in Cockpit and as push notifications). Alert daemon that watches: price hitting confluence levels, news imminent, correlated exposure too high, daily drawdown approaching cap, cortex meter dropping, a mentor in Relay marking a setup on an instrument in my watchlist. Replaces TradingView alerts, Forex Factory filter, broker email alerts, mentor Discord pings — all in one surveillance plane.

### 5.4 The learning layer

> **Decision D-34.** Add **Academy** (lives on marketing site at `/academy`; progress syncs into OS). Structured path: Foundations → Reading the Chart → Building a Playbook → Risk Discipline → Psychology → Execution → Scaling. Each module has a drill, the drill runs in Paper Ground, the drill's outcome feeds the OS growth-ladder metric. *Learning and practising are the same substrate, not two.*

### 5.5 The marketplace layer

> **Decision D-35.** Add **Marketplace** (lives in Network). Curated catalog of playbooks, templates, mentor subscriptions, research packs. Revenue split with creators. This is the second revenue pillar after subscription.

### 5.6 The verification layer

> **Decision D-36.** Add **Verifier** (lives in Vault; exposed on mentor profiles). Cryptographic or broker-attested verification of mentor performance. Solves the "anyone can lie on Twitter" problem at the root. Without this, Proof-of-Edge is disputable; with it, it is definitive.

### 5.7 The presence layer

> **Decision D-37.** Add **Presence** (cross-cutting UI element, top-right of every surface). Shows: who's live right now on Network, what instruments the trader's mentors are watching, what the Copilot is currently thinking about. Ambient awareness, low friction, one click to jump to any of them.

---

## 6. THE SIX CANONICAL FLOWS

`/flows` on the marketing site documents these. The app is designed *around* them, not around features.

### Flow 1 — **The Daily Flow**
Morning ritual (OS) → market open scan (Cockpit Analyze) → macro check (Cockpit Forecast) → setups (Cockpit + Relay) → execute (Cockpit Execute) → review (Brain) → evening ledger (OS) → sleep. Eight beats. One day.

### Flow 2 — **The Weekly Flow**
Sunday plan (OS + Brain) → Monday–Friday daily flows → Friday review (Brain Behaviour + Edge) → Saturday lesson pick (Academy). Closes the loop weekly.

### Flow 3 — **The Community Flow**
Follow mentor (Network) → join live room (Stage) → learn frame (Relay) → trade opens (Relay → Cockpit pre-fill) → execute with mentor visible (Cockpit) → post-trade Q&A in room → record in Vault tagged to mentor.

### Flow 4 — **The Growth Ladder Flow**
Paper Ground → first micro live account → Prop Challenge → Prop Funded → Live Capital. Current rung visible everywhere. Each rung has its own default interlock profile.

### Flow 5 — **The Learning Flow**
Academy lesson → drill in Paper Ground → supervised execute in Paper Ground → graduate to micro live → mentor review → advance. Learning loop.

### Flow 6 — **The Diagnostic Flow**
Drawdown crosses threshold → Cortex Diagnostic fires → root-cause narrative → rule proposal → trader accepts / modifies → rule compiled into interlock → 20-trade recovery watch. Closes the feedback loop on bad patches.

> **Decision D-38.** Each of the six flows is a page on the marketing site. Each has a narrated walkthrough (scroll-triggered, not video), with the actual in-product UI rendered at each beat. This is the single strongest acquisition asset in the product — no competitor has it.

---

## 7. THE SPINE — CROSS-CUTTING STATE

Already defined in the Cockpit pass. Re-stated here because every surface reads/writes it:

| Field | Written in | Read by |
|---|---|---|
| Thesis | Cockpit Forecast | Cockpit Execute ticket, Vault, Brain retro |
| Confluences | Cockpit Analyze | Cockpit Execute verdict, Brain Edge |
| Risk Budget | OS Governance (live) | Cockpit Execute autosize, Sentinel |
| Cortex | OS Psychology (live) | Cockpit Execute gate, Brain Behaviour |
| Verdict | Cortex at Execute moment | Vault, Brain retro, mentor Relay record |

> **Decision D-39.** The spine is a single state object in the product, versioned per-trade. Every surface that renders any spine field renders it with the same component, the same colours, the same typography. This is the cognitive thread that makes the five surfaces feel like one product.

---

## 8. NAMING — THE UPGRADE SUMMARY

| Today | Proposed | Why |
|---|---|---|
| F01 Unified Network | **Network — Mentors, Rooms, Relay** | Names the actual modules; "Relay" is the differentiator |
| F02 Trade Forge | **Cockpit — Analyze · Forecast · Execute** (done) | Verbs, not nouns; the rail is the product |
| F03 System OS | **Operating System — Psychology, Strategy, Governance** | Three chambers named explicitly |
| F04 AI Copilot | **Cortex — Reader, Verdict, Diagnostic, Oracle** | Four organs named; brand-specific name |
| F05 Dashboard AI | **Archio Brain — Portfolio, Edge, Behaviour, Oracle** | Retrospective twin; word "dashboard" undersells |

> **Decision D-40.** Ship the rename. Not as marketing copy — as the product. Navigation labels, feature-page H1s, documentation, onboarding copy. This is a half-day of work and changes the weight of the product by an order of magnitude.

---

## 9. THE ECOSYSTEM — ONE DIAGRAM

```
            +----------------------+
            |   COVENANTS (TRUST)  |
            |  Mentor . Copilot .  |
            |  Community . Archio  |
            +----------+-----------+
                       |
                       v
  +------------+   +---+----+   +-------------+
  |  MENTORS   |-->| ARCHIO |<--|   USERS     |
  |  (supply)  |   |  CORE  |   |  (demand)   |
  +-----+------+   +---+----+   +------+------+
        |              |               |
        v              v               v
  +----------+   +----------+    +------------+
  |  STAGE   |   |   RAIL   |    |  COCKPIT   |
  |  RELAY   |-->| THE SPINE|<-->|  OS . BRAIN|
  +----------+   +----------+    +------------+
                      |
         +------------+-----------+
         |            |           |
         v            v           v
     +--------+  +----------+  +-------+
     | BROKER |  | PROP FIRM|  | VAULT |
     | BRIDGE |  |  MIRROR  |  |(memory)|
     +--------+  +----------+  +-------+
```

Two supply-sides (mentors + brokers/props), one core (the Rail + Spine), one memory (Vault), one trust substrate (Covenants). Every other piece is a surface on this substrate.

> **Decision D-41.** This diagram is printed on the landing page. It is the clearest single-frame explanation of the business and it also passes the institutional test (allocators, press, prop operators can all read it in fifteen seconds).

---

## 10. ROLLOUT — FOUR PHASES, ONE ARTEFACT EACH

> **Decision D-42.** Ship in four phases, each ending in a public artefact. No phase overlaps. Each is independently impressive and can stand alone if the next phase slips.

### Phase 1 — **The Cockpit**
Ship F02 end-to-end (Analyze → Forecast → Execute with the spine). Paper Ground bundled. Broker Bridge abstracted but pointed at a single broker initially. Public artefact: a five-minute walkthrough video, the Cockpit feature page on the marketing site.

### Phase 2 — **The OS**
Ship F03 with all three chambers. Prop Firm Mirror live for two firms. Rule Forge compiler. Morning Ritual + Evening Ledger wired. Growth Ladder visible. Public artefact: the OS feature page + the Growth Ladder flow page.

### Phase 3 — **The Network**
Ship F01 with Mentors, Rooms, Relay. Proof-of-Edge wired from Vault. Marketplace catalog live. First twenty vetted mentors onboarded. Public artefact: the mentors directory + the Community Flow page + the launch.

### Phase 4 — **The Brain + Cortex**
Ship F05 fully (Portfolio, Edge, Behaviour, Oracle). Cortex unified memory. Oracle natural-language query live. Diagnostic flow working end-to-end. Public artefact: the Brain + Oracle demo on the landing.

---

## 11. WHAT GOES ON THE LANDING PAGE

> **Decision D-43.** The landing page has seven sections in this exact order:

1. **The one-line manifesto.** "Six tabs, one trader. Archio is the sixth-tab killer." Or whichever variant tests best.
2. **The ecosystem diagram** (Section 9 of this doc).
3. **The Cockpit demo.** Three-stage rail, playable, no signup.
4. **The Coach demo.** Cortex verdict on a stubbed trade. No signup.
5. **The Brain demo.** Oracle-style natural-language query returns a cited answer over a sample dataset.
6. **The three paths.** Learning / Growing / Leading — the existing "Three Paths" chapter, polished.
7. **Pricing + covenants.** One page, no navigation diversion.

> **Decision D-44.** No carousels, no video auto-play, no hero-video-of-nature. Three actual *playable* surfaces (Cockpit, Coach, Brain) beat any motion design.

---

## 12. PRICING — THE ORGANISATIONAL VIEW

The monetisation already exists in the brief. The plan proposes one adjustment:

> **Decision D-45.** Price by **surface bundles**, not by "tier levels." Three bundles:

- **Trader** — Cockpit + OS + Cortex + Brain + Paper Ground. The self-directed trader.
- **Student** — Trader bundle + Academy + one Mentor subscription included. The learner.
- **Mentor** — Trader bundle + Stage View + Marketplace seller tools + public Proof-of-Edge. The creator.

Add-ons (tokens) for: extra mentor subscriptions, Relay fan-out, Oracle query volume, Prop Firm mirrors beyond one, broker connections beyond two.

This is clearer than "Basic / Pro / Elite" and it maps to who the buyer *is*, not to arbitrary feature gates.

---

## 13. MOATS & RISKS

### Moats
1. **Taste** — the visual DNA and copy voice are not reproducible by a competitor who hasn't done the thinking.
2. **Relay** — the mentor-to-cockpit pipe is a community-execution bridge nobody else has.
3. **Spine** — the cross-surface state object is the real lock-in. Leaving Archio means losing the thread of one's thesis, confluences, cortex history, verdicts.
4. **Vault** — the immutable trade record compounds value the longer the user stays.
5. **Covenants** — published trust promises are hard to retro-fit by an incumbent.

### Risks
1. **Scope.** Five surfaces is a lot. Phase discipline is the only answer.
2. **Broker API fragility.** Mitigated by Broker Bridge abstraction and by making Paper Ground fully functional — the product works even if a broker goes dark.
3. **Mentor quality.** Proof-of-Edge + Verifier is the mitigation. Never onboard a mentor without it.
4. **Regulation.** Nothing about Archio is a signal service or advisory. The copy must respect that consistently. Covenants help.

---

## 14. THE 33+ DECISIONS — INDEX

For veto, amendment, or sign-off. Number, one-line summary, status column to fill in:

| # | Decision | Status |
|---|----------|--------|
| D-01 | Frame product around killing the tab-tax | |
| D-02 | Split domains: archio.com vs app.archio.com | |
| D-03 | Five surfaces, not six; Copilot is a layer | |
| D-04 | Cockpit is the default home | |
| D-05 | Dashboard is Cockpit's retrospective twin | |
| D-06 | The brief becomes /brief, not the whole site | |
| D-07 | /flows is a top-level room on the site | |
| D-08 | /mentors is a top-level room on the site | |
| D-09 | Add a hidden fourth Cockpit stage: RECORD | |
| D-10 | OS → three chambers: Psychology, Strategy, Governance | |
| D-11 | Add Morning Ritual | |
| D-12 | Add Evening Ledger | |
| D-13 | Add Rule Forge | |
| D-14 | Add Playbook Library | |
| D-15 | Add Prop Firm Mirror | |
| D-16 | Add Growth Ladder | |
| D-17 | Rename Copilot → Cortex (or rename spine meter) | |
| D-18 | Cortex has four organs: Reader, Verdict, Diagnostic, Oracle | |
| D-19 | Cortex has one shared memory layer | |
| D-20 | Make Relay a first-class named module | |
| D-21 | Network → three chambers: Mentors, Rooms, Relay | |
| D-22 | Add Proof-of-Edge for every mentor | |
| D-23 | Add Stage View (mentor host surface) | |
| D-24 | Rename Dashboard → Archio Brain | |
| D-25 | Brain has four rooms: Portfolio, Edge, Behaviour, Oracle | |
| D-26 | Mentor-facing Brain is a privilege variant, not a separate page | |
| D-27 | Add Concentration Warning strip | |
| D-28 | Add Broker Bridge abstraction | |
| D-29 | Add Prop Firm Bridge | |
| D-30 | Add Vault as immutable memory | |
| D-31 | Add Paper Ground as a full environment | |
| D-32 | Add Prop Challenge Mode | |
| D-33 | Add Sentinel (alert daemon) | |
| D-34 | Add Academy (structured learning path) | |
| D-35 | Add Marketplace | |
| D-36 | Add Verifier (cryptographic performance proof) | |
| D-37 | Add Presence (ambient cross-surface awareness) | |
| D-38 | Each of the six flows is a marketing page | |
| D-39 | Spine is a single versioned state object | |
| D-40 | Ship the naming upgrade everywhere | |
| D-41 | Print the ecosystem diagram on the landing | |
| D-42 | Four-phase rollout, one public artefact per phase | |
| D-43 | Landing has seven sections in the specified order | |
| D-44 | No carousels, no video autoplay; three playable demos | |
| D-45 | Price by surface bundles: Trader / Student / Mentor | |
| D-46 | Every surface reads the same spine | |
| D-47 | No surface ships without a covenant line | |

---

## 15. WHAT I AM ASKING YOU FOR

Three answers. Then I build against this document.

1. **Scope vote.** Keep the five-surfaces-with-15-new-modules scope (D-03, D-09 through D-37), or cut to a smaller launch surface. If cut, which decisions stay?
2. **Naming vote.** Ship the naming upgrade (D-17, D-24, D-40), or keep today's names?
3. **Rollout vote.** Four phases (D-42) with Cockpit first, or a different order?

Once these three answers exist, the brief HTML gets rewritten against this plan in one pass: new chapters for `/flows`, new headers for F03 and F04, new modules added to F05, the ecosystem diagram rendered, the 47-decision index printed at the back of the document as the contract.

---

**Signed.** This is the plan. Bend the plan; do not bend the principle.
The principle is: *one rail, one spine, one memory, one trader.* Everything else is implementation.
