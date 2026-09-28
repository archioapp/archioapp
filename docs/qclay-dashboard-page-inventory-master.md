# ARCHIO Dashboard Page Inventory & Product Design Brief

**Prepared for:** QClay  
**Purpose:** Give the design team a complete, honest source of truth for every ARCHIO application page: what exists today, what should be redesigned or expanded, what is only a prototype, and what must be designed from zero.

---

## 1. The decision this document makes

ARCHIO should not be designed as nine unrelated applications behind nine navigation links. It is one financial operating environment with:

- **Flight Deck** as the persistent workspace and command center.
- **Archio AI** as the persistent controller and conversational interface.
- **Eight connected systems** that can appear as an embedded panel, an overlay, or a full deep-work page without making the user feel they have left the platform.
- **AI Verified Track Record** as the invisible data spine underneath every financial decision, not only a page visited near the end.

The final design should always answer three questions:

1. **Where am I?** The active system and current object must be unmistakable.
2. **What am I working on?** The chart, room, forecast, trade, agent, portfolio, or record must stay in context.
3. **Where does this go next?** Every important action should naturally continue the verified workflow instead of becoming a dead-end page.

---

## 2. Status key

Every page is classified using one of four statuses.

| Status | Meaning for QClay |
|---|---|
| **A — Existing & retain** | The useful product concept and most of the interaction model already exist. QClay should refine and unify it, not restart blindly. |
| **B — Existing, redesign required** | A working or substantial page exists, but information architecture, hierarchy, visual language, or workflow must change. |
| **C — Partial / prototype** | Individual modules or experiments exist, but they are not yet a coherent production page. QClay can reuse the strongest pieces while redesigning the whole. |
| **D — New / not built** | No coherent page exists. QClay should design it from the functional specification in this document. |

A page labeled “existing” does **not** mean “finished.” It means there is real material that should inform the redesign.

---

## 3. Locked product map

These nine systems and their order are the canonical product architecture:

1. **Flight Deck**
2. **Community**
3. **Decision Desk**
4. **Trading DNA**
5. **The Marketplace**
6. **Portfolio**
7. **Net Worth**
8. **AI Verified Track Record**
9. **Social Network**

This order is a presentation and product-understanding sequence. It is not a requirement that users navigate linearly after onboarding.

### The operational loop

The application becomes useful through one repeated loop:

**Morning Brief → Observe → Forecast → Decide → Contract → Execute or Simulate → Auto-journal → Review → Learn → Prove**

The nine systems support this loop; they should not compete with it.

---

## 4. Global application shell

Before designing individual pages, QClay should define the shared shell. Without it, the dashboard will become nine visually disconnected redesigns.

### 4.1 Persistent zones

#### A. Top navigation / context bar

Must provide:

- Current system and current object.
- Search and command access.
- Persistent **Ask Archio** entry.
- Fast system switching.
- Notification center.
- Account/profile access.
- Environment state: connected account, market session, data freshness, and privacy mode where relevant.

#### B. Center workspace

The main working object. In Flight Deck this is normally the chart; elsewhere it may be a live room, forecast, agent, portfolio scenario, record, or social post.

#### C. Right action rail

Context-sensitive actions such as:

- Execution and order ticket.
- Account and risk summary.
- Forecast/contract creation.
- What If impact.
- AI response or recommended next action.

#### D. Footer dock / left slide-in utilities

Persistent utility icons open panels over the workspace instead of forcing navigation away. Examples:

- Community/live room chat.
- Journal.
- Notifications.
- Calendar/news.
- Connected communication tools.
- Quick tools.

#### E. Below-workspace module zone

A customizable area containing modules selected by the user: positions, forecasts, mentor feed, news, journal, room activity, economic calendar, risk, or agent output.

### 4.2 Three presentation modes

Every system does not require a hard route transition. QClay should define these modes:

1. **Peek panel** — temporary context, opened without losing the chart or main object.
2. **Focused overlay** — a substantial task while preserving workspace context beneath it.
3. **Deep-work page** — the full system for browsing, management, analytics, creation, or settings.

This is how ARCHIO delivers “one screen” without cramming every feature into one viewport.

### 4.3 Persistent Archio AI

Archio AI is not a separate chatbot page only. It should be reachable everywhere through:

- Ask bar in the top context bar.
- Contextual side panel.
- Selection actions on charts, positions, forecasts, journal entries, rooms, agents, and records.
- Structured responses that can write back into the correct system.

The AI should be visibly aware of what the user is looking at and what it is allowed to read or change.

### 4.4 Required global states

QClay should design reusable states for:

- Loading and stale market data.
- Empty state / first-use guidance.
- Disconnected account or wallet.
- Read-only versus trading-enabled connection.
- Permission required.
- AI confidence and source disclosure.
- Locked/verified object.
- Sync or broker error.
- Offline / degraded service.
- Success, failure, and dispute states.
- Mobile or compact-view handoff where a desktop workflow cannot be compressed safely.

---

# 5. Page inventory by system

## SYSTEM 01 — FLIGHT DECK

**System purpose:** The trader’s persistent workspace. The dashboard, chart, live context, execution, navigation, AI, and chosen modules become one operating environment.

### 01.1 Flight Deck Workspace / Home

- **Status:** **B — Existing, redesign required**
- **Current material:** A substantial `/dashboard` implementation exists with the Flight Deck portal, customizable card modules, command palette, period controls, equity surfaces, watchlists, session/macro modules, AI surfaces, and multiple rich dashboard experiments.
- **Keep:** Modular card architecture; command access; market/account surfaces; customization concept; temporal period views; AI entry points; premium data-dense direction.
- **Change/add:**
  - Make TradingView/live chart the permanent center rather than one dashboard card among many.
  - Establish the persistent top context bar, right execution rail, footer dock, and customizable lower module zone.
  - Replace decorative complexity with a clearer hierarchy: market → decision → action → consequence.
  - Let the user rearrange, resize, save, duplicate, reset, and name workspaces.
  - Preserve chart and current instrument when entering another system through peek or overlay mode.
  - Add visible data freshness and connection status.
- **Core functions:** Observe, ask AI, mark chart, create forecast, draft contract, execute/simulate, open room, inspect risk, review alerts, navigate systems.
- **Primary objects:** Workspace layout, chart context, account, position, alert, AI response.
- **Priority:** **MVP / highest priority for QClay**.

### 01.2 Morning Brief

- **Status:** **C — Partial / prototype**
- **Current material:** Existing dashboard components contain market/session summaries, alerts, watchlists, day/week planning, and AI summarization patterns, but no canonical Morning Brief page/overlay.
- **Design intent:** The first useful screen of the day, not a generic news feed.
- **Required content:**
  - Overnight impact on the user’s positions.
  - Contracts approaching invalidation.
  - Unjournaled or unresolved activity.
  - Mentor/community developments.
  - Today’s high-impact calendar items.
  - One recommended next action, with reasons.
- **Interaction:** Each line opens the exact source object; “Start my day” converts the brief into the current Flight Deck plan.
- **Priority:** **MVP**.

### 01.3 Workspace Customizer

- **Status:** **C — Partial / prototype**
- **Current material:** Card customization controls and theme/command experiments exist.
- **Required design:**
  - Layout edit mode with drag, resize, add, remove, and snap behavior.
  - Module library grouped by Market, Decisions, Risk, Community, Journal, and AI.
  - Save as new layout; version history; restore default.
  - Privacy-safe preview before publishing to The Marketplace.
  - Desktop breakpoint rules and a deliberate compact mode.
- **Priority:** **Post-MVP, design now because it shapes the shell**.

### 01.4 Account & Execution Center

- **Status:** **C — Partial / prototype**
- **Current material:** Account/equity/portfolio composition and performance surfaces exist, but not a complete execution center.
- **Required design:**
  - Connected accounts list with live/prop/demo/wallet labeling.
  - Order ticket, size, risk, stop, target, and fee preview.
  - Pre-Trade Contract and rules status before confirmation.
  - Clear separation between read-only and execution-enabled connections.
  - Post-submit state that writes execution to Journal and Track Record.
- **Priority:** **MVP for simulation/manual capture; direct execution follows integration readiness**.

### 01.5 Notifications & Interventions Center

- **Status:** **C — Partial / prototype**
- **Current material:** Macro alerts, watchers, and AI/copilot activity patterns exist.
- **Required design:** Unified inbox separating market alerts, contract/rule interventions, room updates, platform messages, verification events, and account sync failures.
- **Priority:** **MVP-lite**.

### 01.6 Archio AI Expanded Workspace

- **Status:** **C — Partial / prototype**
- **Current material:** `/copilot`, `/intelligence`, command palette, AI surfaces, watchers, and Ask patterns exist.
- **Required design:** One canonical expanded AI surface that preserves conversation, sources, selected chart/object context, permission scope, generated artifacts, and write-back actions. Old AI routes should become modes of this shared system, not separate competing products.
- **Priority:** **MVP**.

---

## SYSTEM 02 — COMMUNITY

**System purpose:** Find the right people and rooms, enter live financial conversations, catch up instantly, retain institutional memory, and convert teaching into structured knowledge.

### 02.1 Community Discovery

- **Status:** **A — Existing & retain**
- **Current material:** `/communities` provides a rich discovery concept with filters for asset class, strategy, psychology, education, sessions, research, competitions, and other dimensions, plus community objects and inspection flows.
- **Keep:** Discovery dimensions; searchable community objects; mentor and session context; room schedules; education/media previews.
- **Change/add:** Simplify the visual hierarchy; distinguish community type, live status, price/access, verified host, and “why this fits you”; add recommendation reasons from Trading DNA without making discovery feel algorithmically opaque.
- **Priority:** **MVP**.

### 02.2 Community Detail / Preview

- **Status:** **B — Existing, redesign required**
- **Current material:** Community Inspector contains schedules, hosts, sessions, video libraries, analytics-like content, and feature information.
- **Required design:** Public preview before joining: purpose, host, verified record summary, room schedule, curriculum/library, rules, pricing, member fit, and sample Catch Me Up. Join/free trial/purchase must be explicit.
- **Priority:** **MVP**.

### 02.3 Live Room

- **Status:** **C — Partial / prototype**
- **Current material:** Multiple live-room and ecosystem prototypes exist, but no single canonical room interface.
- **Required design:**
  - Live stream or shared chart as the main stage.
  - Room timeline/chat and pinned thesis.
  - Host/mentor identity and record plate.
  - Current calls/forecasts with locked timestamps.
  - Ask the Room’s Brain.
  - Catch Me Up at any moment.
  - Convert selected room thesis into the user’s own forecast with attribution.
  - Clear host, moderator, member, and visitor permissions.
- **Priority:** **MVP / highest Community priority**.

### 02.4 Catch Me Up

- **Status:** **D — New / not built as canonical flow**
- **Required design:** A focused overlay available before entering and while inside a room. It must summarize: opening thesis, what changed, important calls, unresolved questions, current consensus/disagreement, and source timestamps. Users can jump directly to any source moment.
- **Priority:** **MVP**.

### 02.5 Room Memory / Knowledge Library

- **Status:** **C — Partial / prototype**
- **Required design:** Searchable archive of sessions, transcripts, theses, forecasts, lessons, files, and AI-extracted concepts. It should show provenance: who said it, when, under what market conditions, and what happened later.
- **Priority:** **Post-MVP**.

### 02.6 Community Management / Mentor Studio

- **Status:** **D — New / not built**
- **Required design:** Create/edit community, membership tiers, schedule sessions, upload curriculum, manage moderators, review AI answers, configure the room agent, view earnings, issue announcements, and handle members/refunds/disputes.
- **Priority:** **Post-MVP, required before creator monetization**.

### 02.7 Student Progress

- **Status:** **C — Partial / prototype**
- **Current material:** Profile student/mentor modules and learning-hub concepts exist.
- **Required design:** Goals, completed lessons, attended sessions, forecasts created from room content, mentor feedback, discipline progress, and proof artifacts earned.
- **Priority:** **Future**.

---

## SYSTEM 03 — DECISION DESK

**System purpose:** Turn market information into a committed decision with provenance: market read → forecast → decision → contract → execution/simulation → journal → review.

### 03.1 Decision Desk Home

- **Status:** **B — Existing, redesign required**
- **Current material:** `/forecast` is a substantial Forecast Hub with Global, Community, Mentors, and Personal scopes, detailed filters, forecasts, and personal record views.
- **Keep:** Forecast scopes, instrument/timeframe inputs, active/resolved separation, personal record, community/mentor context.
- **Change/add:** Reframe the page around the entire decision chain rather than a public forecast feed. The user should immediately see decisions requiring attention, active contracts, upcoming invalidations, pending reviews, and a clear “Create Decision” path.
- **Priority:** **MVP / highest priority**.

### 03.2 Create Forecast / Market Read

- **Status:** **A — Existing & retain**
- **Current material:** A forecast submission drawer already captures instrument, timeframe, direction, entry, stop, target, confidence, and expiry.
- **Change/add:** Add source thesis, selected chart state, evidence, invalidation logic, audience/privacy, AI assistance, and explicit lock semantics. Preview exactly what becomes public and permanent before locking.
- **Priority:** **MVP**.

### 03.3 Forecast Detail / Resolution

- **Status:** **C — Partial / prototype**
- **Required design:** Locked forecast, original chart snapshot, author’s reasoning, timestamps, linked thesis, updates that do not overwrite the original, final market outcome, AI verdict, dispute/review path, and downstream journal/record references.
- **Priority:** **MVP**.

### 03.4 Decision Builder

- **Status:** **D — New / not built**
- **Required design:** Convert forecast into a trade/no-trade/simulate decision. Capture setup, reasons, alternatives, risk, expected value, rule checks, and “why now.” It should support the valid outcome “do nothing.”
- **Priority:** **MVP**.

### 03.5 Pre-Trade Contract

- **Status:** **D — New / not built**
- **Required design:** Lock entry, invalidation, target, size, time condition, and exit commitment. Show green/yellow/red rule state before confirmation. If invalidation occurs while the position remains open, surface the contract on the chart and require an explicit response.
- **Output:** Kept/broken contract events feed Trading DNA and a Discipline Score.
- **Priority:** **MVP differentiator**.

### 03.6 Active Decisions & Contracts

- **Status:** **D — New / not built**
- **Required design:** A monitoring page for upcoming, active, breached, expired, and completed decisions. Designed for action, not a passive table.
- **Priority:** **MVP-lite**.

### 03.7 Auto-Journal / Journal Entry Detail

- **Status:** **C — Partial / prototype**
- **Current material:** History/timeline concepts and journal-related modules exist, but no canonical journal page was found.
- **Required design:** Auto-created entry containing forecast, contract, execution, chart before/after, outcome, rule state, emotion prompt, notes, linked room/mentor, and AI review. Users may add reflections but cannot rewrite locked source events.
- **Priority:** **MVP**.

### 03.8 Trade Review / Daily & Weekly Review

- **Status:** **C — Partial / prototype**
- **Current material:** AI weekly review and performance summaries exist as dashboard patterns.
- **Required design:** Score decision quality separately from financial outcome; classify good loss, bad loss, good win, lucky win; propose one lesson and one rule change; send accepted insights into Trading DNA.
- **Priority:** **MVP for daily review; weekly review follows**.

### 03.9 Autopsy Replay

- **Status:** **D — New / not built**
- **Required design:** Replay the worst or most instructive decision with chart state, prior losses, contract, action versus stated intention, and final outcome. End with “Turn this into a rule” and optional privacy-safe sharing to Social Network.
- **Priority:** **Post-MVP**.

---

## SYSTEM 04 — TRADING DNA

**System purpose:** Convert accumulated behavior into a private, evolving model of how the user trades, where they have edge, and where they become dangerous to themselves.

### 04.1 Trading DNA Overview

- **Status:** **C — Partial / prototype**
- **Current material:** `/profile`, performance modules, AI diagnostics, equity/period analytics, rule/discipline concepts, and profile statistics exist, but not a canonical private DNA system.
- **Required design:** Edge summary, risk patterns, best/worst contexts, rule adherence, contract discipline, emotional triggers, setup map, time/session behavior, confidence calibration, and current focus. Clearly label evidence volume and confidence to avoid pretending conclusions are certain.
- **Priority:** **Post-MVP, first system after launch loop**.

### 04.2 Mind Check

- **Status:** **D — New / not built as canonical flow**
- **Required design:** A contextual intervention, not a generic mood questionnaire. Detect loss streaks, size escalation, rapid re-entry, rule breaches, or unusual behavior; present evidence and offer cooldown, half-size, simulation, mentor contact, or proceed-with-reason.
- **Priority:** **First Trading DNA release**.

### 04.3 Rules & Playbook

- **Status:** **C — Partial / prototype**
- **Required design:** Create rules manually or accept AI-proposed rules from repeated patterns. Show active, experimental, retired, and mentor-supplied rules. Every override is captured with a reason; no silent bypass.
- **Priority:** **Post-MVP**.

### 04.4 Pattern Explorer

- **Status:** **C — Partial / prototype**
- **Required design:** Filter behavior by setup, instrument, day, session, holding time, risk, emotional state, mentor/source, result, and rule adherence. Each conclusion must link back to sample trades.
- **Priority:** **Post-MVP**.

### 04.5 Cold Streak Protocol

- **Status:** **D — New / not built**
- **Required design:** A temporary platform mode triggered by user-defined or evidence-based thresholds. Offer size caps, paper mode for the next defined number of trades, queued autopsy, simplified workspace, and mentor/community support. The user should understand why it triggered and how to exit safely.
- **Priority:** **Post-MVP differentiator**.

### 04.6 Shadow Mode & Compatibility Report

- **Status:** **D — New / not built**
- **Required design:** Follow a mentor’s locked calls while committing the user’s own paper decisions before seeing outcomes. After enough samples, compare entry selection, sizing, drawdown, and rule compatibility. Answer: “Is this mentor right for the way I trade?”
- **Priority:** **Future**.

### 04.7 DNA History / Evolution

- **Status:** **D — New / not built**
- **Required design:** Timeline of how the user’s style, edge, risks, and rules changed, with evidence thresholds and accepted/rejected AI interpretations.
- **Priority:** **Future**.

---

## SYSTEM 05 — THE MARKETPLACE

**System purpose:** Discover, evaluate, buy, install, create, and sell verified intelligence objects—starting with AI agents and Flight Deck layouts.

### 05.1 Marketplace Home / Discovery

- **Status:** **C — Partial / prototype**
- **Current material:** Signal/hub experiments, recommendation concepts, mentor surfaces, and community commerce patterns exist, but there is no canonical marketplace page.
- **Required design:** Separate object types: Agents, Flight Deck Layouts, Mentor Knowledge, and later Tools. Listings must prioritize verified creator evidence, fit, permissions, data requirements, version, price, and transparent limitations—not ratings alone.
- **Priority:** **Post-MVP**.

### 05.2 Agent Listing Detail

- **Status:** **D — New / not built**
- **Required design:** Creator record plate, intended job, training sources, sample outputs, required permissions, compatible markets, version history, price, refund/trial policy, limitations, and install destination. Never imply an agent guarantees profit.
- **Priority:** **Post-MVP**.

### 05.3 Layout Listing Detail

- **Status:** **D — New / not built**
- **Required design:** Live preview with sample data, module map, required integrations, screen-size compatibility, creator attribution, privacy guarantee (“layout only; creator cannot see your data”), version and price. One-click install writes a copy into Flight Deck.
- **Priority:** **Post-MVP**.

### 05.4 Installed Library

- **Status:** **D — New / not built**
- **Required design:** Installed agents/layouts, active location, permissions, usage, updates, pause/remove, billing, and rollback.
- **Priority:** **Post-MVP**.

### 05.5 Agent Builder / Training Studio

- **Status:** **D — New / not built**
- **Required design:** Choose purpose, select permissioned source material from Decision Desk/Trading DNA/Community, test responses, inspect citations, define boundaries, review privacy, version, publish privately or publicly, and monitor quality.
- **Priority:** **Future; complex and safety-sensitive**.

### 05.6 Layout Publisher

- **Status:** **C — Partial / prototype**
- **Current material:** Workspace customization patterns exist.
- **Required design:** Select a saved layout, remove private modules/data, generate preview, define compatibility, set price/license, publish, and maintain versions.
- **Priority:** **Post-MVP**.

### 05.7 Creator Storefront, Earnings & Payouts

- **Status:** **D — New / not built**
- **Required design:** Public creator catalog plus private revenue, subscriptions, refunds, fees, payout status, customer support, and performance analytics. Keep financial earnings separate from trading performance.
- **Priority:** **Required before monetization launch**.

---

## SYSTEM 06 — PORTFOLIO

**System purpose:** Connect accounts and wallets, understand positions and true correlated risk, rehearse scenarios before commitment, and eventually execute inside the same remembered environment.

### 06.1 Portfolio Overview

- **Status:** **C — Partial / prototype**
- **Current material:** Flight Deck includes equity/account composition and performance surfaces; connection-flow concepts exist, but no canonical Portfolio route was found.
- **Required design:** Total portfolio, account/wallet grouping, position list, allocation, P&L, leverage, margin/liquidation proximity, fees, concentration, data freshness, and connection state.
- **Priority:** **Post-MVP**.

### 06.2 Connections & Wallets

- **Status:** **C — Partial / prototype**
- **Required design:** Connect broker, exchange, wallet, Hyperliquid, or manual account; explain read-only vs execution permissions; test connection; resolve sync error; revoke access; show last sync. Wallet signing must never be confused with KYC identity.
- **Priority:** **Post-MVP foundation**.

### 06.3 Position Detail

- **Status:** **D — New / not built**
- **Required design:** Position history, live risk, related forecast/contract/journal, liquidation, fees/funding, correlated positions, What If contribution, and available actions.
- **Priority:** **Post-MVP**.

### 06.4 What If Scenario Lab

- **Status:** **D — New / not built**
- **Required design:** Ask natural-language or structured shocks such as “BTC -30%” or “USD +5%”; show account-level cascade, liquidation order, correlated losses, and ranked actions. Scenarios can be saved and compared.
- **Priority:** **Post-MVP differentiator**.

### 06.5 Pre-Trade Impact Preview

- **Status:** **D — New / not built**
- **Required design:** Before execution, show how the proposed trade changes concentration, drawdown exposure, liquidation buffer, risk budget, and correlation. This appears inline in the order flow, not only in the scenario lab.
- **Priority:** **Post-MVP**.

### 06.6 Transaction / Trade Activity

- **Status:** **C — Partial / prototype**
- **Current material:** `/history` and account activity patterns exist.
- **Required design:** Unified event ledger across accounts and wallets with sync state, journal linkage, fees, verification origin, and correction/dispute workflow.
- **Priority:** **Post-MVP**.

---

## SYSTEM 07 — NET WORTH

**System purpose:** Extend the portfolio lens across the user’s financial life: assets, debt, income dependence, spending, runway, and life-level concentration.

### 07.1 Net Worth Overview

- **Status:** **D — New / not built**
- **Required design:** One computed number with asset/liability composition, update freshness, history, and “what changed.” Separate verified connected data, imported data, and manual estimates.
- **Priority:** **Future / after Portfolio**.

### 07.2 Exposure Map

- **Status:** **D — New / not built**
- **Required design:** Show when apparently different parts of life depend on one factor—for example salary from a crypto company, token compensation, BTC, ETF, miner equity, and correlated private investments. It inherits the correlation lens from Portfolio and applies it to the whole life.
- **Priority:** **Future differentiator**.

### 07.3 Runway Planner

- **Status:** **D — New / not built**
- **Required design:** Current monthly burn, liquid runway, stressed runway, income scenarios, upcoming obligations, and survival horizon. Make assumptions editable and visible.
- **Priority:** **Future**.

### 07.4 Assets, Liabilities & Income Sources

- **Status:** **D — New / not built**
- **Required design:** Manage connected/manual assets, debts, recurring income, expenses, ownership, currency, valuation source, and privacy. Debt is first-class, not buried.
- **Priority:** **Future foundation**.

### 07.5 Life What If

- **Status:** **D — New / not built**
- **Required design:** Model job loss, market drawdown, debt-rate change, large purchase, relocation, or income reduction and show runway/net-worth impact.
- **Priority:** **Future**.

---

## SYSTEM 08 — AI VERIFIED TRACK RECORD

**System purpose:** Make forecasts and financial decisions attributable, timestamped, outcome-scored, and difficult to rewrite after the fact. The page is the visible record; the underlying record spine should exist from the first MVP decision.

### 08.1 Private Record Center

- **Status:** **C — Partial / prototype**
- **Current material:** Forecast personal-record views, profile statistics, verification labels, history/activity, badges, and identity components exist.
- **Required design:** Pending/resolved/disputed entries; filters; forecast and discipline metrics; provenance; visibility controls; correction versus deletion semantics; KYC status; data-source health.
- **Priority:** **MVP**.

### 08.2 Public Trader Passport

- **Status:** **B — Existing, redesign required**
- **Current material:** `/profile` includes identity, stats, badges, linked accounts, mentor/student modules, and activity.
- **Required design:** Public, shareable profile focused on proof: verified identity state, sample size, forecast hit rate, calibration, Discipline Score, market specialties, misses as well as hits, record timeline, public communities/products, and clear separation between verified, linked, imported, mentor-reviewed, and self-reported evidence.
- **Privacy:** Public proof must not expose private Trading DNA, balances, exact positions, or private journal content.
- **Priority:** **MVP-lite / growth engine**.

### 08.3 Record Entry Detail / Audit Trail

- **Status:** **D — New / not built as canonical page**
- **Required design:** Original locked object, timestamp, revisions as append-only events, market data used, AI evaluation reasoning, result, sources, linked execution/journal, visibility, and dispute state.
- **Priority:** **MVP**.

### 08.4 Verification & KYC Center

- **Status:** **C — Partial / prototype**
- **Current material:** Auth and verification flows exist; complete financial KYC product flow is not established.
- **Required design:** Identity status, required steps, consent, privacy explanation, vendor handoff, review/pending/failed states, appeal, and what KYC does and does not prove.
- **Priority:** **MVP planning; legal/vendor dependency**.

### 08.5 Permissions & Privacy Center

- **Status:** **D — New / not built**
- **Required design:** Object-level visibility (private/followers/community/public), agent permissions, connected-account access, data export, consent history, revocation, and jurisdiction-sensitive retention/deletion handling.
- **Priority:** **MVP foundation**.

### 08.6 AI Verdict & Dispute Review

- **Status:** **D — New / not built**
- **Required design:** Explain verdict criteria and confidence, show data sources, let a user flag incorrect data/evaluation without rewriting history, and preserve the final resolution as another record event.
- **Priority:** **MVP or before public ranking**.

### 08.7 Proof-of-Skill Challenges

- **Status:** **D — New / not built**
- **Required design:** Free standardized forecast challenges on common instruments, locked entries, transparent scoring, sample-size thresholds, consistency rankings, and eligibility for Marketplace discovery. The goal is to let skill create proof without requiring capital.
- **Priority:** **Post-MVP acquisition loop**.

---

## SYSTEM 09 — SOCIAL NETWORK

**System purpose:** A financial network where content carries receipts, charts remain interactive, and discovery is based on verified consistency rather than engagement farming.

### 09.1 Proof Feed / Social Home

- **Status:** **C — Partial / prototype**
- **Current material:** `/nexus`, Forecast Hub social scopes, and social/feed experiments exist.
- **Required design:** Posts with author record plates, living charts, forecasts, room clips, autopsy posts, long-form analysis, and company content. Ranking must disclose why something appears and should privilege verified consistency, relevance, and user choice—not likes alone.
- **Priority:** **Future / requires record population**.

### 09.2 Post Composer

- **Status:** **D — New / not built as canonical flow**
- **Required design:** Create text, living chart, locked forecast, room excerpt, journal/autopsy artifact, or product post; select visibility; preview proof plate; manage attribution and compliance prompts.
- **Priority:** **Future**.

### 09.3 Post Detail / Discussion

- **Status:** **D — New / not built**
- **Required design:** Interactive chart, thesis and forecast context, author proof, sourced updates, structured discussion, summarize-discussion action, moderation, and “make this my forecast” with attribution.
- **Priority:** **Future**.

### 09.4 Following & Discovery

- **Status:** **C — Partial / prototype**
- **Required design:** Discover people, mentors, rooms, companies, agents, and topics; explain recommendations; let users choose chronological/following views; avoid a single opaque engagement feed.
- **Priority:** **Future**.

### 09.5 Autopsy Post

- **Status:** **D — New / not built**
- **Required design:** Privacy-safe share version of an Autopsy Replay with source decision, chart, lesson, rule created, and record link. Celebrate honest learning without gamifying losses.
- **Priority:** **Future differentiator**.

### 09.6 Verified Company / Institution Profile

- **Status:** **D — New / not built**
- **Required design:** Legal/verified entity state, team, public claims, attributable forecasts/content, products/services, hiring, disclosures, and audited record references. Company verification must be distinct from individual KYC.
- **Priority:** **Future**.

### 09.7 Messages & Collaboration

- **Status:** **D — New / not built**
- **Required design:** Direct and group conversations with permission controls, shared chart/forecast objects, report/block, and explicit boundaries between social communication and regulated advice.
- **Priority:** **Future; not required for initial Social release**.

---

# 6. Cross-system and operational pages

These are not among the nine marketing systems, but a usable product cannot omit them.

## 6.1 Authentication

- **Status:** **A — Existing & retain**
- **Existing:** Login, registration, email verification, forgotten/reset password.
- **Change/add:** Apply final design system; add session/security messaging; support legal consent/versioning.

## 6.2 Onboarding & Personalization

- **Status:** **C — Partial / prototype**
- **Required steps:** Role (trader/student/mentor/creator/company), markets, experience, goals, timezone/session, data connections, privacy choice, initial workspace, and guided first forecast. Progressive onboarding is preferable to one giant questionnaire.

## 6.3 Integration Center

- **Status:** **C — Partial / prototype**
- **Purpose:** Manage brokers, exchanges, wallets, communication sources, calendar/news providers, and imported data with permissions and sync health.

## 6.4 Settings

- **Status:** **D — No canonical page found**
- **Required sections:** Account, security, notifications, appearance/workspaces, privacy, AI permissions, integrations, data/export, billing, accessibility, and legal consents.

## 6.5 Plans, Billing & Subscriptions

- **Status:** **D — New / not built**
- **Purpose:** ARCHIO plan, community subscriptions, Marketplace purchases, invoices, payment method, cancellation, trial, and refund status.

## 6.6 Creator Earnings & Payouts

- **Status:** **D — New / not built**
- **Purpose:** Revenue from communities, mentoring, agents, layouts, forecasts/subscriptions where allowed, fees, holds, disputes, tax information, and payouts.

## 6.7 Support, Safety & Disputes

- **Status:** **D — New / not built**
- **Purpose:** Help center, report content/user, trade-data sync issue, AI verdict dispute, purchase/refund issue, KYC appeal, and status tracking.

## 6.8 Admin & Moderation

- **Status:** **D — New / not built**
- **Purpose:** Identity review, marketplace review, community moderation, content reports, disputes, agent safety, financial claim review, and audit logs. Internal tooling should use the same object/status language as the product.

---

# 7. Canonical object flow

QClay should design objects so they visibly travel through the system instead of being recreated in each page.

| From | To | Object / transfer |
|---|---|---|
| Community | Decision Desk | Room thesis, source timestamp, mentor attribution |
| Decision Desk | AI Verified Track Record | Locked forecast, decision, contract, timestamps |
| Decision Desk | Portfolio | Proposed or executed trade context |
| Portfolio | Decision Desk | Execution, fees, position, final outcome |
| Decision Desk | Journal | Forecast, contract, execution, chart and result |
| Journal | Trading DNA | Behavioral evidence, rule adherence, reflection |
| Trading DNA | Flight Deck | Current risks, interventions, preferred modules |
| Trading DNA | Marketplace | Fit profile, only with explicit permission and minimum necessary data |
| Flight Deck | Marketplace | Publishable workspace layout, stripped of personal data |
| Marketplace | Flight Deck | Installed layout or agent |
| Track Record | Community / Marketplace / Social | Public proof plate, not private raw data |
| Portfolio | Net Worth | Verified balances, positions and risk factors |
| Social Network | Decision Desk | Attributed living chart or thesis converted into the user’s own forecast |

### Required visual rule

Whenever an action creates one of these transfers, the interface should say what happened. Example: **“Forecast locked and added to your record”**, not only **“Success.”**

---

# 8. Product boundaries QClay must make visible

## 8.1 Private versus public

- **Trading DNA:** private by default.
- **Journal:** private by default.
- **Exact balances and positions:** private by default.
- **Public Trader Passport:** selected proof metrics and public record entries.
- **Community content:** governed by room permissions.
- **Marketplace training sources:** selected, permissioned, and reviewable.

## 8.2 Verified versus inferred

Every important figure or claim should be able to show its provenance:

- Verified connected data.
- Linked third-party data.
- AI-inferred interpretation.
- Mentor-reviewed.
- Imported.
- Self-reported/manual.

These should not look equally authoritative.

## 8.3 Live versus future

Design can include future systems, but the production application must not impersonate completion. For release planning:

- **Live core:** Flight Deck, Community, Decision Desk, and the Track Record spine/public Passport.
- **Next:** Trading DNA, Portfolio, The Marketplace.
- **Later:** Social Network and Net Worth.

The landing page may tell the full nine-system story. The logged-in app should only open usable rooms; future rooms receive an honest preview/waitlist state if shown.

---

# 9. QClay design priority and recommended sequence

## Priority 0 — Shared foundations

1. Application shell and navigation model.
2. Peek / overlay / deep-work behavior.
3. Shared object cards and status language.
4. Archio AI pattern.
5. Privacy, provenance, verification, lock, and connection states.

## Priority 1 — MVP daily loop

1. Flight Deck Workspace.
2. Morning Brief.
3. Decision Desk Home.
4. Create Forecast.
5. Forecast Detail.
6. Decision Builder + Pre-Trade Contract.
7. Auto-Journal + Trade Review.
8. Private Record Center + public Trader Passport.

## Priority 2 — Community retention

1. Community Discovery.
2. Community Detail.
3. Live Room.
4. Catch Me Up.

## Priority 3 — Product expansion

1. Mind Check and Trading DNA Overview.
2. Portfolio Overview, Connections, and What If.
3. Marketplace Discovery, Agent/Layout details, and Installed Library.

## Priority 4 — Network and whole-life layer

1. Social Network.
2. Net Worth.
3. Creator economy and company profiles.

---

# 10. Decisions QClay should not invent without product confirmation

The studio has broad creative ownership over composition, movement, hierarchy, transitions, and interaction expression. The following product decisions require explicit confirmation before final UI:

1. Which brokers/exchanges/wallets support read-only or execution at each release.
2. TradingView/data licensing and what chart interactions are technically available.
3. KYC vendor, geography, age limits, and legal copy.
4. AI verdict methodology, confidence display, and dispute policy.
5. Exact public metrics and minimum sample sizes.
6. Marketplace commercial model, fees, refunds, and prohibited claims.
7. Community monetization and moderation policy.
8. Record retention/deletion rules by jurisdiction.
9. Whether a feature is live, beta, waitlisted, or conceptual at launch.

QClay should design the state model for these choices, but should not silently resolve policy questions through visual assumptions.

---

# 11. Current repository appendix

This appendix prevents valuable work from disappearing while keeping the official architecture clean.

| Current route / area | Current role | Final treatment |
|---|---|---|
| `/dashboard` | Main rich dashboard / Flight Deck prototype | **Retain and redesign as Flight Deck Workspace** |
| `/` inside main layout | Alternate dashboard entry | **Merge into canonical Flight Deck route** |
| `/forecast` | Forecast Hub | **Retain and expand into Decision Desk** |
| `/communities` | Community discovery | **Retain and redesign within Community** |
| `/profile` | Identity, stats, badges, connections and activity | **Split public proof into Trader Passport; keep private profile/settings separate** |
| `/history` | Activity/history timeline | **Merge into Journal, Portfolio Activity and Record events as appropriate** |
| `/intelligence` | AI intelligence surface | **Merge into persistent Archio AI and contextual intelligence views** |
| `/copilot` | Copilot activity/workspace | **Merge into persistent Archio AI; avoid a competing AI product name** |
| `/nexus` | Social/network prototype | **Reuse strongest concepts for Social Network; do not keep “Nexus” as an official system** |
| `/hub` | Learning/community ecosystem prototype | **Reuse for Community library and student progress; not a top-level official system** |
| `/cockpit` | Alternative command-center prototype | **Mine interaction ideas; consolidate into Flight Deck; do not ship duplicate cockpit** |
| `/archio` | Product/landing prototype | **Keep separate from logged-in dashboard inventory; landing workstream** |
| `/pitch`, `/newpitch`, `/masterplan`, `/design` | Internal presentation/design routes | **Internal only; exclude from production navigation** |
| `/docs/ultra-breakdown` | Internal documentation | **Internal only** |
| `/playground/glass-demo`, `/playground/glass-popup` | Visual experiments | **Internal only; use as reference, never production navigation** |
| `/welcome` | Welcome/onboarding | **Retain and evolve into progressive onboarding** |
| `/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password` | Authentication | **Retain and restyle within the final system** |

---

# 12. Definition of done for dashboard design

QClay’s dashboard work is ready for handoff when:

1. Every page in Priority 0–2 has a desktop design and responsive intent.
2. Every page identifies its status: existing retain, redesign, partial, or new.
3. The persistent shell is demonstrated across at least Flight Deck, Live Room, Decision Desk, and Trader Passport.
4. Peek, overlay, and deep-work transitions are shown.
5. The end-to-end daily loop is clickable from Morning Brief through verified record.
6. Empty, loading, error, disconnected, permission, lock, and dispute states are represented.
7. Public/private and verified/inferred states are visually unambiguous.
8. All reusable components and tokens are documented.
9. Future features are clearly labeled rather than faked as operational.
10. Open policy and integration dependencies are listed for founder/engineering decisions.

---

## Final direction

The product should feel large because its objects connect, not because it has dozens of unrelated pages. Flight Deck gives the user one persistent place to work; the other systems deepen a task without breaking context; the Track Record makes every important decision accountable. QClay’s responsibility is to make that architecture understandable in seconds and powerful over years.
