# ARCHIOAI TRADING TERMINAL - MASTER TECHNICAL BREAKDOWN

**Last Updated:** January 2026  
**Version:** 1.0  
**Status:** Active Development  
**Architecture:** Next.js 15 App Router + Supabase + Polygon.io + Zustand

---

## 1. ONE-PAGE EXECUTIVE SUMMARY

### What the Platform Is

ArchioAI is an **institutional-grade trading operating system** that combines:
- Professional trading terminal (chart analysis, instrument selection, multi-timeframe analysis)
- Forecast engine (weekly HTF analysis + daily intraday forecasts)
- Discord-style community hub (channels, live mentor stage, temporary war rooms)
- AI copilot (behavioral coaching, risk monitoring, execution assistance)
- Real-time market data integration (Polygon.io for live prices, session OHLC)

### Who It's For (Roles)

| Role | Description | Primary Features Used |
|------|-------------|----------------------|
| **Student Trader** | Learning institutional trading concepts | Daily Gameplan, Forecast cards, Community hub, AI Copilot guidance |
| **Active Trader** | Executing trades with ICT methodology | Terminal, Scenario builder, Confluence analysis, Session analysis |
| **Mentor/Educator** | Teaching and sharing forecasts | Mentor Forecast Engine, Live Stage broadcasting, Community management |
| **Community Member** | Collaborating with other traders | War rooms, Signal feed, Community chat, Shared forecasts |
| **Admin** | Platform management | User management, Community moderation, Analytics |

### What Problem It Solves

**Primary Pain Points:**
1. **Fragmented workflow** - Traders currently use 5+ tools (TradingView + Discord + Notion + Spreadsheets + Broker)
2. **No guidance layer** - Platforms provide data but no coaching on what to do with it
3. **Isolated learning** - No structured way to compare mentor analysis vs student execution
4. **FOMO trading** - No systematic framework to validate setups before execution
5. **Community silos** - Trading communities lack integrated forecasting/analysis tools

**How ArchioAI Solves It:**
- **Single workspace** - Terminal + Community + Forecasts + Copilot in one app
- **AI coaching layer** - Copilot watches behavior and suggests improvements in real-time
- **Mentor → Student pipeline** - Forecasts auto-sync to Daily Gameplan, students can copy to scenarios
- **Pre-flight analysis** - Copilot blocks impulsive trades, enforces checklist completion
- **Integrated community** - Discord UX but with native forecast/chart sharing and war room workflows

### Why It's Different

| Competitor | What They Do | What We Do Differently |
|------------|-------------|------------------------|
| **TradingView** | Charting + social feed | We add forecast engine, AI copilot, structured community, scenario management |
| **Discord + Trading Bots** | Chat + signal notifications | We embed forecasts natively, auto-sync to terminal, add AI behavioral layer |
| **MetaTrader/cTrader** | Broker terminal | We focus on ICT/institutional methodology, add educational layer, no broker lock-in |
| **Notion/Airtable** | Manual trade journals | We auto-capture events, AI suggests patterns, integrate with execution |

**Unique Value Props:**
1. **Forecast-to-execution pipeline** - Mentor creates weekly/daily forecast → auto-appears in community Daily Gameplan → students copy to terminal scenarios
2. **Behavioral AI** - Not just price alerts—copilot watches your actions (order previews without execution, excessive instrument switching, trading outside bank sessions)
3. **Institutional pedagogy** - Built around ICT concepts (liquidity sweeps, FVG, order blocks, BPR) with visual confluence system
4. **Temporary collaboration rooms** - War rooms auto-expire after 24h, perfect for discussing live setups without channel clutter

### What is MVP vs Future

#### MVP (Current Phase - 60% Complete)
**Goal:** Prove core workflow works for 50 beta users (students + 3 mentors)

**In Scope:**
- ✅ Instrument selector (FX, Indices, Crypto, Commodities) - **WORKING**
- ✅ Real-time price integration (Polygon.io) - **WORKING**
- ✅ Session OHLC analysis (Asia/London/NY) - **WORKING**
- ✅ Confluence system (11 technical confluences) - **WORKING** (status updates are mock)
- ✅ Scenario builder (create/edit trading scenarios) - **WORKING** (localStorage persisted)
- ⚠️ Forecast engine UI - **PARTIAL** (weekly/daily gameplan display working, creation form exists but doesn't persist)
- ⚠️ Community hub (Discord layout) - **MOCKUP** (5 hardcoded servers, signals, chat messages)
- ⚠️ Auth & user management - **PARTIAL** (Supabase auth schema exists, some API routes work, not integrated in UI)
- ❌ Forecast persistence (weekly → daily → community sync) - **NOT STARTED**
- ❌ Live mentor stage (video/audio) - **NOT STARTED**
- ❌ War room lifecycle (create/join/auto-expire) - **NOT STARTED**
- ❌ AI Copilot intelligence - **MOCKUP** (UI exists, no real event processing)

**Out of MVP:**
- Mobile apps (iOS/Android)
- Advanced charting (TradingView widget integration only)
- Broker integration (order execution)
- Payment/subscription enforcement (Stripe connected but not gating features)
- Advanced analytics (trade journal, performance tracking)
- White-label/enterprise

#### Phase 2 (Post-MVP - 3-4 months)
- Real-time chat/signals (WebSocket)
- Full forecast CRUD with history
- Live mentor stage (WebRTC)
- War room temporary channels
- AI copilot event processing
- Mobile-responsive layouts

#### Phase 3 (6-8 months)
- AI copilot suggestions (risk, progress, psychology watchers)
- Trade journal auto-capture
- Advanced confluence detection (automated HTF structure, liquidity pool detection)
- TradingView advanced charts integration
- Broker API connections (read-only initially)

#### Phase 4 (Future / TBD)
- Mobile native apps
- White-label for trading education businesses
- Advanced AI (strategy backtesting, pattern recognition)
- Algorithmic trading helpers

---

## 2. FULL FEATURE INVENTORY (A→Z)

### MODULE 1: Institutional Terminal

#### 2.1.1 Instrument Selector
**Description:** Dropdown to select trading instrument across 4 asset classes.  
**User Value:** Quickly switch between instruments; favorite frequently traded pairs.  
**Inputs:** None (click to open dropdown).  
**Outputs:** Selected instrument stored in `useInstrument` Zustand store; triggers price/session data refresh.  
**Dependencies:** `lib/instruments.ts` (instrument definitions), `useInstrument` store, `useAnalysis` store.  
**Status:** ✅ **WORKING** - Favorites feature exists but not persisted to database.  
**Implementation:** `components/enhanced-instrument-selector.tsx` - Full dropdown with category groups, search, favorites toggle.

#### 2.1.2 Real-Time Price Feed
**Description:** Live bid/ask prices from Polygon.io, updated every 1-5 seconds.  
**User Value:** See current market price without leaving platform.  
**Inputs:** Selected instrument symbol.  
**Outputs:** Current price, 24h high/low, volume.  
**Dependencies:** Polygon.io API key, `/api/polygon/snapshot` route, `useAnalysis` store.  
**Status:** ✅ **WORKING** - Fetches real data from Polygon.io.  
**Implementation:** `lib/stores/useAnalysis.ts` `loadSnapshot` method.

#### 2.1.3 Session OHLC Analysis
**Description:** Displays high/low/open/close for Asia, London, NY sessions.  
**User Value:** Identify session ranges for liquidity analysis and BPR calculations.  
**Inputs:** Selected instrument, current date.  
**Outputs:** Session bars, session OHLC values, session status (upcoming/live/completed).  
**Dependencies:** Polygon.io aggregates API, `/api/market/agg`, session time calculations (`lib/analysis/sessionsNY.ts`).  
**Status:** ✅ **WORKING** - Real data, refreshes every 60s during live sessions.  
**Implementation:** `lib/stores/useAnalysis.ts` `loadBankingSessions` method.

#### 2.1.4 Multi-Timeframe Bars
**Description:** Fetch and display bars for Daily, Weekly, 4H timeframes.  
**User Value:** Analyze higher timeframe structure for HTF bias.  
**Inputs:** Selected instrument, timeframe selection.  
**Outputs:** Array of bars (OHLC + timestamp).  
**Dependencies:** `/api/polygon/bars`, `useAnalysis` store.  
**Status:** ✅ **WORKING** - Fetches real bars from Polygon.io.  
**Implementation:** `lib/stores/useAnalysis.ts` `loadMultiTFBars` method.

#### 2.1.5 Confluence Selector
**Description:** Toggle panel to select which ICT confluences to monitor (11 available).  
**User Value:** Focus on specific setups (e.g., only FVG + liquidity sweep).  
**Inputs:** Click confluence badges to toggle on/off.  
**Outputs:** Selected confluences stored in `useConfluenceStore`; triggers status updates.  
**Dependencies:** `lib/confluences.ts` (definitions), `stores/confluence-store.ts`.  
**Status:** ✅ **WORKING** - Selection works, but real-time status updates are mock (uses Math.random()).  
**Implementation:** `components/enhanced-confluence-selector.tsx`, `stores/confluence-store.ts`.

#### 2.1.6 Confluence Status Display
**Description:** Shows which confluences are "active" based on current price.  
**User Value:** Quick glance at which setups are present (e.g., "FVG active at 1.0850").  
**Inputs:** Current price, selected instrument, enabled confluences.  
**Outputs:** Status badges (active/inactive), strength percentage, description text.  
**Dependencies:** `useConfluenceStore`, price feed.  
**Status:** ⚠️ **PARTIAL** - UI works, but detection logic is mock (needs real chart analysis).  
**Implementation:** `stores/confluence-store.ts` `updateStatusesForPrice` method (currently uses random values).

#### 2.1.7 Overlay Visualization (Future)
**Description:** Visual overlays on chart (FVG zones, OB boxes, liquidity lines).  
**User Value:** See confluences directly on chart instead of text descriptions.  
**Inputs:** Enabled confluences, chart data.  
**Outputs:** SVG/Canvas overlays on chart.  
**Dependencies:** Chart rendering library, bar data, confluence detection algorithms.  
**Status:** ❌ **NOT STARTED** - Requires advanced chart integration.

### MODULE 2: Forecast Engine

#### 2.2.1 Mentor Forecast Input Form
**Description:** 2-column form for mentors to create weekly/daily forecasts.  
**User Value:** Mentors publish structured analysis (HTF chart + LTF chart + narrative + key levels).  
**Inputs:** Instrument, bias (bullish/bearish/neutral), thesis, key levels, macro drivers, chart uploads.  
**Outputs:** Forecast object (not yet persisted).  
**Dependencies:** Instrument selector, chart upload, form validation.  
**Status:** ✅ **UI COMPLETE** but ❌ **NO PERSISTENCE** - Clicking "Publish" only shows loading state, doesn't save to database.  
**Implementation:** `components/mentor-forecast-engine.tsx`, route at `/mentor-forecast`.  
**CRITICAL GAP:** No database table for forecasts yet. No API route to POST forecast data.

#### 2.2.2 Weekly Forecast Cards
**Description:** Horizontal card carousel showing 4 weekly forecasts (one per instrument).  
**User Value:** See mentor's HTF bias for each instrument at a glance.  
**Inputs:** Hardcoded WEEKLY_FORECASTS array (mock data).  
**Outputs:** Clickable cards that open detail modal.  
**Dependencies:** None (currently self-contained mock).  
**Status:** ✅ **MOCKUP** - Displays 4 hardcoded forecasts.  
**Implementation:** `components/daily-gameplan.tsx` lines 220-347 (WEEKLY_FORECASTS data).  
**CRITICAL GAP:** Not connected to database or mentor input form.

#### 2.2.3 Weekly Forecast Detail Modal
**Description:** Full-screen modal showing HTF analysis (multi-TF charts, narrative, IF/THEN scenarios, key levels).  
**User Value:** Deep dive into mentor's weekly thesis with educational detail.  
**Inputs:** Selected forecast card.  
**Outputs:** Read-only view of forecast data.  
**Dependencies:** WEEKLY_FORECASTS mock data.  
**Status:** ✅ **MOCKUP** - Modal UI exists with tabs (HTF/LTF/Scenarios).  
**Implementation:** `components/daily-gameplan.tsx` Forecast Detail Modal section.

#### 2.2.4 Weekly Bias Dashboard
**Description:** Expandable rows showing bias for 4 instruments (DXY, XAU/USD, EUR/USD, NAS100).  
**User Value:** See all instruments' weekly bias, key zones, confidence, and drivers in one view.  
**Inputs:** WEEKLY_DRIVERS mock data.  
**Outputs:** Expandable accordion rows with detailed "why this bias" reasoning.  
**Dependencies:** None (mock data).  
**Status:** ✅ **MOCKUP** - 4 hardcoded instruments with expandable details.  
**Implementation:** `components/daily-gameplan.tsx` lines 109-230.  
**CRITICAL GAP:** No connection to forecast creation flow or database.

#### 2.2.5 Daily Forecast Cards (Today's Playbook)
**Description:** Intraday forecast cards showing entry zones, bias, confidence, linked signals.  
**User Value:** Students see mentor's daily plan for specific instruments.  
**Inputs:** DAILY_FORECASTS mock data.  
**Outputs:** Cards with key levels, notes, mentor attribution.  
**Dependencies:** None (mock).  
**Status:** ✅ **MOCKUP** - 3 hardcoded daily forecasts.  
**Implementation:** `components/daily-gameplan.tsx` lines 280-347 (DAILY_FORECASTS).  
**CRITICAL GAP:** Not connected to mentor daily forecast creation or database.

#### 2.2.6 Forecast History & Archive
**Description:** View past weekly/daily forecasts with filters (date, mentor, instrument, status).  
**User Value:** Review what was forecasted vs what happened; learn from mentor's accuracy.  
**Inputs:** Date range picker, instrument filter, mentor filter.  
**Outputs:** Paginated list of archived forecasts.  
**Dependencies:** Forecasts database table, archive logic.  
**Status:** ❌ **NOT STARTED** - No UI, no database table, no API route.

#### 2.2.7 Forecast-to-Scenario Bridge
**Description:** "Copy to Terminal" button on forecast cards → creates scenario in terminal.  
**User Value:** Students can import mentor's forecast as a starting point for their own scenario.  
**Inputs:** Selected forecast card.  
**Outputs:** New scenario created in `useScenarioStore` with prefilled data.  
**Dependencies:** `useScenarioStore`, forecast data.  
**Status:** ⚠️ **PARTIAL** - Scenario store has `createScenarioFromForecast` method but no UI trigger in Daily Gameplan.  
**Implementation:** `lib/scenario-store.ts` lines 130-145, needs UI button in `daily-gameplan.tsx`.

### MODULE 3: Weekly Outlook / Bias Dashboard

*(Covered in 2.2.4 above - Weekly Bias Dashboard is part of Forecast Engine)*

### MODULE 4: Daily Gameplan

#### 2.4.1 Daily Gameplan View (Main Container)
**Description:** Full-page view in Community Hub showing weekly outlook + daily forecasts.  
**User Value:** Central dashboard for the day's trading plan.  
**Inputs:** Active view selection ("daily-gameplan" in FloatingCommunityHub).  
**Outputs:** Renders DailyGameplan component.  
**Dependencies:** FloatingCommunityHub state, DailyGameplan component.  
**Status:** ✅ **WORKING** - View renders when "gameplan" channel is selected in community hub.  
**Implementation:** `components/floating-community-hub.tsx` lines 950-970, `components/daily-gameplan.tsx`.

#### 2.4.2 Weekly Outlook Header
**Description:** Top section showing week theme, focus pills (USD Week, Gold Week, Risk-On Week), macro events.  
**User Value:** Context for the week's bias; know what macro events matter.  
**Inputs:** MACRO_EVENTS and MACRO_SUMMARY mock arrays.  
**Outputs:** Event cards with impact labels, summary bullet points.  
**Dependencies:** None (mock).  
**Status:** ✅ **MOCKUP** - Displays 4 macro events and 4 summary bullets.  
**Implementation:** `components/daily-gameplan.tsx` lines 110-120 (MACRO_EVENTS, MACRO_SUMMARY).

#### 2.4.3 Today's Forecasts Section
**Description:** List of daily forecast cards for the current day.  
**User Value:** See intraday setups mentor is watching.  
**Inputs:** DAILY_FORECASTS array.  
**Outputs:** Cards with bias badges, key levels, confidence, linked signals.  
**Dependencies:** None (mock).  
**Status:** ✅ **MOCKUP** - 3 hardcoded forecasts.  
**Implementation:** `components/daily-gameplan.tsx` lines 280-347.

#### 2.4.4 Auto-Sync from Forecast Engine
**Description:** When mentor publishes a forecast, it auto-appears in Daily Gameplan.  
**User Value:** No manual posting—forecasts flow from creation to community automatically.  
**Inputs:** Forecast creation event.  
**Outputs:** New forecast appears in Daily Gameplan feed.  
**Dependencies:** Forecasts database, real-time subscription (Supabase Realtime or polling).  
**Status:** ❌ **NOT STARTED** - Requires forecast persistence first.

### MODULE 5: Community Hub (Discord-like)

#### 2.5.1 Floating Sidebar (Discord Layout)
**Description:** Left-edge hover trigger → expands to 3-column sidebar (Server Rail | Channel List | Main View).  
**User Value:** Access community without leaving terminal; Discord-familiar UX.  
**Inputs:** Hover over trigger button (Radio icon with pulse).  
**Outputs:** Opens sidebar with server list, channels, and active view.  
**Dependencies:** None (self-contained component).  
**Status:** ✅ **WORKING** - Opens/closes on hover with 150ms delay.  
**Implementation:** `components/floating-community-hub.tsx`.

#### 2.5.2 Server Rail (Column 1)
**Description:** 72px column with server avatars (5 hardcoded servers).  
**User Value:** Switch between different trading communities/groups.  
**Inputs:** Click server avatar.  
**Outputs:** Changes activeServer state; updates channel list.  
**Dependencies:** SERVERS mock array.  
**Status:** ✅ **MOCKUP** - 5 hardcoded servers (Whale Room, Crypto Elite, Gold Masters, NY Session, Mentor Hub).  
**Implementation:** `components/floating-community-hub.tsx` lines 83-107.  
**CRITICAL GAP:** Not connected to real groups database (types/community.ts Group type exists but not integrated).

#### 2.5.3 Channel List (Column 2)
**Description:** 260px column showing channels for active server (Text channels, Official Signals, Active War Rooms).  
**User Value:** Navigate to different channels within a server.  
**Inputs:** Click channel name.  
**Outputs:** Changes activeView state; renders appropriate content in Column 3.  
**Dependencies:** activeServer state.  
**Status:** ⚠️ **PARTIAL** - Channel list exists but all servers show same channels (not server-specific).  
**Implementation:** `components/floating-community-hub.tsx` Channel List section.  
**CRITICAL GAP:** Channels should be per-server, currently global. No database-backed channels table.

#### 2.5.4 Mentor Stage (Live Broadcasting)
**Description:** Live video/audio broadcast by mentor with chat sidebar.  
**User Value:** Students watch mentor analyze charts in real-time; ask questions in chat.  
**Inputs:** Mentor clicks "Go Live" (not implemented); students join live stage channel.  
**Outputs:** Video player (placeholder), live chat messages.  
**Dependencies:** WebRTC or streaming service (not chosen yet), chat system.  
**Status:** ❌ **NOT STARTED** - Placeholder UI exists but no video/audio integration.  
**Implementation:** Placeholder at `components/floating-community-hub.tsx` Live Stage view.

#### 2.5.5 Official Signals Feed
**Description:** Read-only feed of mentor-posted trade signals (entry/stop/target/R:R).  
**User Value:** See mentor's live trade ideas; copy to terminal.  
**Inputs:** activeView === "forecast-feed".  
**Outputs:** Signal cards with verified badges, rating, timing.  
**Dependencies:** SIGNALS mock array.  
**Status:** ✅ **MOCKUP** - 4 hardcoded signals.  
**Implementation:** `components/floating-community-hub.tsx` lines 110-178 (SIGNALS array).  
**CRITICAL GAP:** No signal creation UI for mentors; no database persistence; no "Copy Trade" action.

#### 2.5.6 War Rooms (Temporary Strike Teams)
**Description:** Temporary channels for discussing specific trade setups; auto-expire after 24h.  
**User Value:** Focused discussion on a live setup (e.g., "short-btc-scalp") without cluttering permanent channels.  
**Inputs:** Click "Open War Room" button; fill in ticker, duration.  
**Outputs:** New temporary channel created; members can join; expires after set duration.  
**Dependencies:** Rooms database table (exists in schema), room lifecycle logic (create/join/expire).  
**Status:** ❌ **NOT STARTED** - Modal UI exists (`components/floating-community-hub.tsx`) but no backend.  
**Implementation:** Modal at lines 960-1030, WAR_ROOMS mock array at lines 173-176.  
**CRITICAL GAP:** No API route for creating rooms; no auto-expiration cron job; no member join logic.

#### 2.5.7 Community Chat
**Description:** Real-time text chat within channels.  
**User Value:** Discuss trades, ask questions, share charts.  
**Inputs:** Type message, click send.  
**Outputs:** Message appears in chat for all members.  
**Dependencies:** Chat messages database table (not created yet), WebSocket or Supabase Realtime.  
**Status:** ❌ **NOT STARTED** - Chat input UI exists but messages are mock arrays.  
**Implementation:** LIVE_STAGE_CHAT and WAR_ROOM_CHAT mock arrays in `components/floating-community-hub.tsx`.  
**CRITICAL GAP:** No messages table; no real-time subscription; no message persistence.

### MODULE 6: AI Copilot

#### 2.6.1 Copilot Event Logging
**Description:** Silent background tracking of user actions (route changes, instrument selection, chart interactions, scenario edits, order previews).  
**User Value:** Foundation for AI suggestions (can't suggest improvements without knowing what user does).  
**Inputs:** User actions throughout app.  
**Outputs:** CopilotEvent objects pushed to event log.  
**Dependencies:** Event bus (`lib/copilot/eventBus.ts`), event definitions (`lib/copilot/types.ts`).  
**Status:** ⚠️ **PARTIAL** - Event types defined, some components dispatch events (scenario store), but not comprehensive.  
**Implementation:** `lib/copilot/types.ts` (21 event types), `lib/scenario-store.ts` dispatches `scenario:created` events.  
**CRITICAL GAP:** Most UI components don't dispatch events yet (terminal, instrument selector, confluence toggles).

#### 2.6.2 Copilot Watchers (Risk, Progress, Copy)
**Description:** Background logic that analyzes event stream and generates suggestions.  
**User Value:** Proactive coaching (e.g., "You previewed 3 orders but placed none—second-guessing?").  
**Inputs:** Event stream from copilotStore.  
**Outputs:** CopilotSuggestion objects with actionable recommendations.  
**Dependencies:** Event log, watcher implementations (`lib/copilot/watchers/`).  
**Status:** ⚠️ **PARTIAL** - Watcher files exist (`riskWatcher.ts`, `progressWatcher.ts`, `copyWatcher.ts`) but logic is placeholder.  
**Implementation:** `lib/copilot/watchers/` directory, registered in `lib/copilot/watchers/index.ts`.  
**CRITICAL GAP:** Watcher logic is empty stubs—needs actual suggestion generation algorithms.

#### 2.6.3 Copilot Right Rail Panel
**Description:** Persistent sidebar showing AI suggestions, checklists, activity timeline.  
**User Value:** See copilot guidance without leaving current screen.  
**Inputs:** Copilot suggestions, checklist state, event timeline.  
**Outputs:** Interactive cards with actions (e.g., "Open Risk Sizer", "Review Confluence").  
**Dependencies:** copilotStore, suggestions array.  
**Status:** ✅ **MOCKUP** - UI renders but shows mock suggestions.  
**Implementation:** `components/copilot/CopilotRightRail.tsx`.

#### 2.6.4 Copilot Checklist (Pre-Flight Analysis)
**Description:** Mandatory checklist before executing trades (confluence checks, session timing, R:R validation).  
**User Value:** Enforces discipline; prevents FOMO trades.  
**Inputs:** User marks checklist items complete.  
**Outputs:** Blocks order execution until checklist passes.  
**Dependencies:** Checklist definition, scenario data, copilot state.  
**Status:** ⚠️ **PARTIAL** - Checklist UI exists but not enforced; no broker integration to actually block orders.  
**Implementation:** `components/execution-copilot/copilot-checklist.tsx`.  
**CRITICAL GAP:** No enforcement mechanism; needs integration with execution flow (future broker API).

#### 2.6.5 Copilot Chat Interface
**Description:** Chat-style interface to ask copilot questions (e.g., "Why did you suggest waiting for London open?").  
**User Value:** Conversational coaching; users can ask "why" behind suggestions.  
**Inputs:** User types message, clicks send.  
**Outputs:** AI-generated response explaining reasoning.  
**Dependencies:** AI SDK, streaming API route `/api/copilot/chat`, chat history.  
**Status:** ⚠️ **PARTIAL** - UI exists, API route exists but returns generic responses (not context-aware).  
**Implementation:** `components/copilot/chat/SimpleActivityChat.tsx`, `app/api/copilot/chat/route.ts`.  
**CRITICAL GAP:** AI responses are not personalized—no access to user's event history or scenarios.

### MODULE 7: History & Archive System

#### 2.7.1 Trade History (Journal)
**Description:** Auto-captured log of trades with entry/exit, R:R, confluences present.  
**User Value:** Review past trades; identify patterns; calculate win rate.  
**Inputs:** Trade execution events (future—requires broker integration).  
**Outputs:** Paginated list of trades with filters.  
**Dependencies:** Trades database table (not created), broker API.  
**Status:** ❌ **NOT STARTED** - No trades table; no capture logic; placeholder page at `/history`.  
**Implementation:** `app/(main)/history/page.tsx` (renders message "Coming soon").

#### 2.7.2 Scenario History
**Description:** View past scenarios (archived or deleted) with notes.  
**User Value:** Review why a scenario was created, whether it played out.  
**Inputs:** Date range filter, instrument filter.  
**Outputs:** List of past scenarios.  
**Dependencies:** Scenarios persisted in localStorage (currently), or database (future).  
**Status:** ⚠️ **PARTIAL** - Scenarios are persisted in localStorage via `useScenarioStore`, but no dedicated history view UI.  
**Implementation:** `lib/scenario-store.ts` uses Zustand persist middleware.  
**CRITICAL GAP:** No UI to browse scenario history; no soft-delete (deleted scenarios are gone forever).

#### 2.7.3 Forecast History
**Description:** Archive of past weekly/daily forecasts with outcome labels (accurate/missed).  
**User Value:** Audit mentor's forecast accuracy; learn from past calls.  
**Inputs:** Date range, mentor filter, instrument filter.  
**Outputs:** Timeline of archived forecasts.  
**Dependencies:** Forecasts database table (not created), forecast archive flag.  
**Status:** ❌ **NOT STARTED** - No forecasts database; no archive logic; no UI.

### MODULE 8: Admin / Settings / Permissions

#### 2.8.1 User Management (Admin View)
**Description:** Admin dashboard to view users, assign roles, ban/unban.  
**User Value:** Platform moderation; assign mentor/moderator roles.  
**Inputs:** Admin clicks user, selects action (promote to mentor, ban, etc.).  
**Outputs:** User role updated in database.  
**Dependencies:** Auth system, profiles table, admin role check.  
**Status:** ❌ **NOT STARTED** - No admin UI; API routes exist (`/api/users/[id]`) but not used.  
**Implementation:** API routes at `app/api/users/` directory; no frontend yet.

#### 2.8.2 Community Management (Create/Edit Groups)
**Description:** Owners create groups, set visibility (public/paid/private), invite members.  
**User Value:** Mentors can run paid trading groups.  
**Inputs:** Group name, description, visibility, Stripe price ID (if paid).  
**Outputs:** New group created; invite codes generated.  
**Dependencies:** Groups table (types/community.ts), Stripe integration, invites table.  
**Status:** ⚠️ **PARTIAL** - Database schema exists; API routes exist; minimal UI at `/communities` and `/community/[slug]/manage`.  
**Implementation:** `app/api/community/groups/` routes, `components/community/` UI components.  
**CRITICAL GAP:** Group management UI is basic; no Stripe checkout flow UI; no member management dashboard.

#### 2.8.3 Subscription Management (Stripe)
**Description:** Users upgrade to paid tiers (Pro, Live, Mentor Elite); manage billing.  
**User Value:** Access premium features (more scenarios, AI copilot, mentor-level tools).  
**Inputs:** User selects plan, clicks subscribe.  
**Outputs:** Stripe checkout session created; subscription stored in DB.  
**Dependencies:** Stripe integration, subscriptions table, plans table.  
**Status:** ⚠️ **PARTIAL** - Stripe webhook exists; API routes for checkout/portal exist; no UI to select plans.  
**Implementation:** `app/api/subscriptions/`, `app/api/stripe/webhook/route.ts`.  
**CRITICAL GAP:** No pricing page; no subscription enforcement (all features currently accessible to free users).

#### 2.8.4 Role-Based Access Control (RBAC)
**Description:** Enforce permissions (only mentors can create forecasts, only admins can ban users).  
**User Value:** Protect features; prevent abuse.  
**Inputs:** User attempts action; backend checks role.  
**Outputs:** Allow/deny action; show error if denied.  
**Dependencies:** Auth middleware, role checks in API routes.  
**Status:** ⚠️ **PARTIAL** - Roles defined in types (admin, creator, moderator, member); `RequireRole` component exists but not used everywhere.  
**Implementation:** `components/auth/RequireRole.tsx`, role checks in some API routes (memberships, invites).  
**CRITICAL GAP:** Not enforced consistently; mentor forecast page doesn't check if user is mentor role.

---

## 3. APP NAVIGATION + INFORMATION ARCHITECTURE

### Primary Navigation Structure

```
Navigation Location: Left-side vertical nav bar (FloatingNav component)

┌─────────────────────────────────────────────────────────────┐
│ ArchioAI Logo (top)                                          │
├─────────────────────────────────────────────────────────────┤
│ MAIN NAVIGATION                                             │
│ ├─ Dashboard (/)                                            │
│ ├─ Forecast (/forecast)                                     │
│ ├─ Nexus (/nexus)                                           │
│ ├─ Intelligence (/intelligence)                             │
│ ├─ Copilot (/copilot)                                       │
│ ├─ Student Hub (/hub)                                       │
│ ├─ History (/history)                                       │
│ ├─ Community (/communities)                                 │
│ ├─ Share (/share)                                           │
│ └─ Mentor Forecast (/mentor-forecast) [NEW]                │
├─────────────────────────────────────────────────────────────┤
│ FLOATING OVERLAYS (not in nav)                              │
│ ├─ Community Hub (hover left edge, Radio icon)             │
│ ├─ Copilot Right Rail (persistent on right, toggleable)    │
│ ├─ Scenario Panel (floating button, opens drawer)          │
│ └─ Confluence Menu (floating button, opens drawer)         │
├─────────────────────────────────────────────────────────────┤
│ USER ACTIONS (bottom)                                        │
│ ├─ User Avatar (dropdown: Profile, Settings, Logout)       │
│ └─ Theme Toggle (light/dark)                               │
└─────────────────────────────────────────────────────────────┘
```

### Pages and Subpages

| Route | Page Title | Component | Purpose | Layout Type | Status |
|-------|------------|-----------|---------|-------------|--------|
| `/` | Dashboard | `app/(main)/page.tsx` | Main terminal (instrument selector, confluences, session analysis) | Full page | ✅ Working |
| `/forecast` | Forecast Engine | `app/(main)/forecast/page.tsx` | View AI-generated forecasts and scenarios | Full page | ⚠️ Partial (displays ForecastEngine component) |
| `/mentor-forecast` | Mentor Forecast Input | `app/(main)/mentor-forecast/page.tsx` | Mentor creates weekly/daily forecasts | Full page | ✅ UI complete, no persistence |
| `/nexus` | Nexus Mindmap | `app/(main)/nexus/page.tsx` | Visual mindmap of market structure | Full page | ⚠️ Mockup (renders NexusMindmap component) |
| `/intelligence` | Market Intelligence | `app/(main)/intelligence/page.tsx` | Live market data dashboard | Full page | ⚠️ Partial (renders LiveMarketIntelligence) |
| `/copilot` | AI Copilot | `app/(main)/copilot/page.tsx` | Dedicated copilot page (chat, suggestions, analytics) | Full page | ⚠️ Mockup |
| `/hub` | Student Hub | `app/(main)/hub/page.tsx` | Student-focused view (learning resources, progress) | Full page | ⚠️ Partial |
| `/history` | Trade History | `app/(main)/history/page.tsx` | Past trades and scenarios | Full page | ❌ Not started (placeholder) |
| `/communities` | Community Directory | `app/(main)/communities/page.tsx` | Browse all trading communities/groups | Full page | ⚠️ Partial (renders CommunityDirectory) |
| `/community/[slug]` | Group Detail | `app/community/[slug]/page.tsx` | View specific group (forecasts, members, chat) | Full page | ⚠️ Partial |
| `/community/[slug]/join` | Join Group | `app/community/[slug]/join/page.tsx` | Join group via invite code | Full page | ⚠️ Partial |
| `/community/[slug]/manage` | Manage Group | `app/community/[slug]/manage/page.tsx` | Admin dashboard for group owners | Full page | ⚠️ Partial |
| `/share` | Share View | `app/(main)/share/page.tsx` | Share charts/forecasts externally | Full page | ❌ Placeholder |
| `/login` | Login | `app/login/page.tsx` | Authentication page | Auth page | ⚠️ Partial (UI exists, auth works but not integrated) |
| `/dashboard/groups` | Groups Dashboard | `app/dashboard/groups/page.tsx` | User's joined groups overview | Full page | ⚠️ Partial |

### Drawers/Modals vs Full Pages

| UI Element | Presentation | Trigger | Closes When | Implementation |
|------------|--------------|---------|-------------|----------------|
| **Floating Community Hub** | Drawer (left edge) | Hover Radio icon | Mouse leaves after 300ms | `components/floating-community-hub.tsx` |
| **Copilot Right Rail** | Drawer (right edge) | Persistent (toggleable) | Click close button | `components/copilot/CopilotRightRail.tsx` |
| **Scenario Panel** | Drawer (right edge) | Click floating button | Click outside or close | `components/floating-scenario-panel.tsx` |
| **Confluence Menu** | Drawer (bottom) | Click floating button | Click outside or close | `components/floating-confluence-panel.tsx` |
| **Create Scenario Modal** | Modal (center overlay) | Click "+ New Scenario" | Click cancel/save or ESC | `components/create-scenario-modal.tsx` |
| **Forecast Detail Modal** | Modal (center overlay) | Click forecast card | Click close or ESC | Inside `daily-gameplan.tsx` |
| **Create War Room Modal** | Modal (center overlay) | Click "Open War Room" | Click cancel/create | Inside `floating-community-hub.tsx` |
| **Create Group Modal** | Modal (center overlay) | Click "+ Create Group" | Click cancel/create | `components/community/create-group-modal.tsx` |
| **Sign In Modal** | Modal (center overlay) | Click "Sign In" or protected route | Click close or successful login | `components/auth/SignInModal.tsx` |

### State Transitions (What Opens What)

```
Flow 1: Forecast Viewing
  Dashboard → Community Hub (hover) → Select "gameplan" channel → Daily Gameplan view → Click forecast card → Forecast Detail Modal

Flow 2: Scenario Creation from Forecast
  Daily Gameplan → Click forecast "Copy to Terminal" → Opens Create Scenario Modal (prefilled) → Save → Scenario added to Scenario Panel

Flow 3: War Room Creation
  Community Hub → Click "Open War Room" button → War Room Creation Modal → Enter ticker + duration → Create → New temporary channel appears

Flow 4: Confluence Analysis
  Dashboard → Click Confluence floating button → Confluence Drawer opens → Toggle confluences → See status updates on main terminal

Flow 5: Mentor Forecast Publishing
  Mentor Forecast page → Fill form (charts, narrative, levels) → Click "Publish to Gameplan" → (Future: appears in Daily Gameplan)

Flow 6: Community Group Join
  Communities page → Click group card → Group detail page → Click "Join" → (If paid: Stripe checkout) → (If invite-only: enter code) → Member added
```

### URL Routes (Proposed / Current)

| Route Pattern | Example | Status | Notes |
|---------------|---------|--------|-------|
| `/` | `/` | ✅ Working | Main dashboard |
| `/forecast` | `/forecast` | ✅ Working | Forecast engine view |
| `/mentor-forecast` | `/mentor-forecast` | ✅ Working | Mentor input form |
| `/nexus` | `/nexus` | ✅ Working | Mindmap visualization |
| `/intelligence` | `/intelligence` | ✅ Working | Market intelligence |
| `/copilot` | `/copilot` | ✅ Working | Copilot dedicated page |
| `/hub` | `/hub` | ✅ Working | Student hub |
| `/history` | `/history` | ✅ Working | Placeholder only |
| `/communities` | `/communities` | ✅ Working | Community directory |
| `/community/[slug]` | `/community/whale-traders` | ✅ Working | Group detail (requires auth) |
| `/community/[slug]/join` | `/community/whale-traders/join?code=ABC123` | ✅ Working | Join with invite code |
| `/community/[slug]/manage` | `/community/whale-traders/manage` | ✅ Working | Group admin (requires owner role) |
| `/share` | `/share` | ✅ Working | Placeholder |
| `/login` | `/login` | ✅ Working | Login page |
| `/dashboard/groups` | `/dashboard/groups` | ✅ Working | User's groups |

**CRITICAL GAP:** No URL-based state for community hub (active server/channel). If user refreshes while viewing a forecast in community hub, state is lost. Need to persist activeServer/activeChannel in URL query params (e.g., `/?server=whale-room&channel=gameplan`).

---

## 4. DETAILED USER FLOWS (STEP-BY-STEP)

### Flow 1: Selecting Instruments (FX/Indices/Crypto/Commodities)

**Trigger:** User wants to change the trading instrument they're analyzing.

**Steps:**
1. User clicks **Instrument Selector** dropdown (shows current instrument, e.g., "EUR/USD").
2. Dropdown expands showing 4 category tabs: **Forex | Indices | Crypto | Commodities**.
3. User clicks a category tab (e.g., **Indices**).
4. List of instruments in that category appears (e.g., S&P 500, Dow Jones, Nasdaq, DAX).
5. (Optional) User types in search box to filter instruments (e.g., "NAS").
6. User clicks an instrument (e.g., **Nasdaq 100**).
7. Dropdown closes; selected instrument displays in selector button.
8. **System Actions:**
   - `useInstrument.setSymbol("NAS100")` updates Zustand store.
   - `useAnalysis.setSelectedPair("NAS100")` triggers debounced data fetch.
   - `useAnalysis.loadSnapshot("NAS100")` fetches current price from Polygon.io.
   - `useAnalysis.loadSessionBars("NAS100")` fetches session OHLC.
   - `useAnalysis.loadMultiTFBars("NAS100")` fetches D/W/4H bars.
   - All components subscribed to `useInstrument` re-render with new instrument.
9. Price ticker, session analysis, confluence status all update for new instrument.

**Edge Cases:**
- **No Polygon API key:** Snapshot fetch fails; displays error toast "Unable to fetch live price".
- **Instrument not found:** Search returns empty; shows "No instruments match your search".
- **Rapid switching:** Debounce ensures only last selection triggers data fetch (prevents API spam).

**Error States:**
- API timeout: Show "Price data unavailable" in price ticker.
- Invalid instrument: Log error to console; fall back to previous instrument.

**Loading States:**
- Skeleton loaders appear in price ticker, session cards while fetching.
- Spinner in confluence status badges during `updateStatusesForPrice`.

**Permissions:** None required (all instruments visible to all users).

---

### Flow 2: Managing Favorites

**Trigger:** User wants to mark frequently traded instruments as favorites for quick access.

**Steps:**
1. User opens Instrument Selector dropdown.
2. At top of dropdown, **"Favorites"** tab shows (if any favorites exist).
3. User clicks an instrument they want to favorite.
4. (In dropdown) User clicks **star icon** next to instrument name.
5. Star icon fills in (becomes solid).
6. **System Actions:**
   - Instrument ID added to `favorites` array in localStorage.
   - Favorites tab count badge updates (e.g., "Favorites (3)").
7. User closes dropdown.
8. Next time dropdown opens, **Favorites tab appears first** (if favorites > 0).
9. User can click **Favorites** tab to see only favorited instruments.

**Unfavorite:**
1. User opens dropdown, clicks Favorites tab.
2. Clicks star icon next to a favorite.
3. Star becomes outline (unfilled).
4. **System Actions:**
   - Instrument ID removed from favorites array.
   - If favorites count reaches 0, Favorites tab hides.

**Edge Cases:**
- **No favorites yet:** Favorites tab doesn't show (first-time user).
- **Clear all favorites:** No UI button for this yet (must unfavorite one-by-one).

**Error States:**
- localStorage quota exceeded: Log error; favorites persist until browser storage cleared.

**Loading States:** None (instant localStorage read/write).

**Permissions:** None required.

**CRITICAL GAP:** Favorites are stored in localStorage, not user profile. Favorites don't sync across devices. Need to persist to user profile in database.

---

### Flow 3: Opening Forecast Cards + Viewing HTF/LTF

**Trigger:** User wants to see mentor's detailed weekly forecast for an instrument.

**Steps:**
1. User hovers over left edge of screen → **Community Hub** sidebar opens.
2. User clicks **"gameplan"** channel in Channel List.
3. Main View (Column 3) renders **Daily Gameplan** component.
4. User scrolls to **"Weekly Forecast Cards"** section (horizontal carousel).
5. Four instrument cards display: **XAU/USD, EUR/USD, NAS100, DXY**.
6. Each card shows:
   - Instrument name
   - Status badge (ACTIVE / IN-PLAY / WATCHING)
   - Bias badge (NEUTRAL / BULLISH / BEARISH color-coded)
   - Timeframe label ("WEEKLY")
   - HTF Notes bullets (e.g., "BOS on daily", "Weekly FVG at 2030")
   - Last updated timestamp
   - Mentor avatar + name
7. User clicks **XAU/USD card**.
8. **Forecast Detail Modal** opens (full-screen overlay).
9. Modal displays:
   - **Header:** Instrument name, status badge, bias badge, last updated.
   - **Tabs:** HTF View (default) | LTF View | Scenarios.
   - **HTF View Tab Content:**
     - Chart placeholder image (future: actual chart snapshot).
     - Narrative text block (mentor's written analysis).
     - Key Levels grid (3 columns: Resistance, POI, Support) with price/label.
     - "What to Watch" checklist (4 items).
10. User clicks **LTF View tab**.
11. LTF chart placeholder displays (future: lower timeframe chart).
12. User clicks **Scenarios tab**.
13. IF/THEN scenario cards display (e.g., "If price taps 2045-2050 and rejects → Look for shorts targeting 2030").
14. User clicks **close button (X)** or presses **ESC key**.
15. Modal closes; returns to Daily Gameplan view.

**Edge Cases:**
- **No forecasts available:** "No weekly forecasts yet" message displays.
- **Modal open but user clicks behind:** Backdrop click closes modal (default behavior).

**Error States:**
- Forecast data missing fields: Display "N/A" for missing key levels.

**Loading States:**
- While modal opening: Brief fade-in animation (150ms).

**Permissions:** None required (forecasts visible to all community members).

**CRITICAL GAP:** Chart placeholders show generic images. Need actual chart snapshots uploaded by mentor or generated from bar data.

---

### Flow 4: Creating a Weekly Forecast (Mentor)

**Trigger:** Mentor wants to publish a new weekly forecast for the community.

**Steps:**
1. Mentor navigates to **/mentor-forecast** page (from nav or direct URL).
2. Page loads **Mentor Forecast Engine** component.
3. Left column displays two large drop zones:
   - **Higher Timeframe Chart** (label at top).
   - **Entry Timeframe Chart** (label at bottom).
4. Right column displays form:
   - **Instrument Selector** dropdown (same as terminal).
   - **Bias Toggle** (3 buttons: Bullish | Neutral | Bearish).
   - **Narrative** textarea ("What's the thesis?").
   - **Key Levels** dynamic form (add/remove levels with price, type, label).
   - **Macro Drivers** tags input (type + Enter to add tags).
5. Mentor clicks **HTF Chart drop zone**.
6. File picker opens; mentor selects chart screenshot (PNG/JPG).
7. Chart preview displays in drop zone.
8. (Optional) Mentor clicks **Annotation Toolbar** (Mark, Text, Zone buttons).
9. Clicks chart preview → places marker at clicked position.
10. Mentor repeats for **Entry Timeframe Chart**.
11. Mentor selects **Instrument** (e.g., XAU/USD).
12. Mentor clicks **Bearish** bias button → button highlights in red.
13. Mentor types thesis in Narrative textarea (e.g., "Gold showing distribution at weekly highs...").
14. Mentor adds key levels:
    - Clicks **+ Add Level** button.
    - Enters price (e.g., 2048.50), selects type (Resistance), enters label (Weekly Supply).
    - Repeats for 2-3 more levels.
15. Mentor adds macro drivers:
    - Types "CPI" in Macro Drivers input, presses Enter.
    - Tag appears below input.
    - Repeats for "Fed Minutes", "USD Strength".
16. Bottom bar displays:
    - Validation status (red X or green checkmark for each required field).
    - Summary pills (e.g., "XAU/USD", "Bearish", "3 Levels").
17. Mentor clicks **"Publish to Gameplan"** button.
18. Button enters loading state (spinner replaces icon).
19. **System Actions:**
    - (Future) POST request to `/api/community/forecasts` with form data.
    - (Future) Forecast saved to database with `mentor_id`, `instrument`, `bias`, `narrative`, `key_levels`, `chart_urls`.
    - (Future) Forecast auto-syncs to Daily Gameplan channel in Community Hub.
    - (Future) Notification sent to community members ("New forecast: XAU/USD by Mentor Chen").
20. Success toast displays: "Forecast published successfully!".
21. Form resets; mentor can create another forecast.

**Edge Cases:**
- **Missing required fields:** Publish button disabled; validation status shows which fields missing.
- **Chart upload too large (>5MB):** Error toast "Chart file too large. Please compress.".
- **Network error during publish:** Error toast "Failed to publish. Please try again."; form data preserved.

**Error States:**
- API route not found: 404 error logged; error toast displays.
- Database constraint violation: 500 error; error toast "Something went wrong.".

**Loading States:**
- While uploading charts: Progress bar displays below drop zone.
- While publishing: Button shows spinner; form inputs disabled.

**Permissions:** **CRITICAL:** Should check if user has "mentor" or "creator" role. Currently no role check on page access.

**CRITICAL GAP:** Publish action only shows loading state—**no actual API call or database persistence**. Form data is lost on refresh. Need to create:
- `/api/community/forecasts` POST route.
- Database table `community_forecasts` with columns: `id`, `mentor_id`, `instrument`, `bias`, `narrative`, `key_levels` (JSONB), `macro_drivers` (text[]), `htf_chart_url`, `ltf_chart_url`, `created_at`, `updated_at`.
- Chart upload to Vercel Blob or Supabase Storage.
- Real-time sync to Daily Gameplan (Supabase Realtime subscription).

---

### Flow 5: Creating Daily Forecast (Mentor)

**Trigger:** Mentor wants to publish an intraday forecast for today's session.

**Steps:**
*Currently no dedicated Daily Forecast creation UI—assumed to be similar to Weekly Forecast flow.*

**Proposed Flow:**
1. Mentor navigates to **/mentor-forecast** page.
2. At top of form, **toggle between "Weekly" and "Daily"** mode.
3. Mentor selects **"Daily"** mode.
4. Form adjusts:
   - Chart uploads change labels to "Session Chart" (one upload instead of two).
   - Narrative label changes to "Today's Bias".
   - Key Levels section adds "Entry Zone" and "Invalidation" fields.
   - Macro Drivers replaced with "Session Plan" (Asia/London/NY checkboxes).
5. Mentor fills form (similar to weekly flow).
6. Clicks **"Publish to Daily Playbook"**.
7. **System Actions:**
   - (Future) POST to `/api/community/forecasts` with `type: "daily"`.
   - Forecast appears in "Today's Playbook" section of Daily Gameplan.
   - Expires/archives automatically at end of trading day (00:00 UTC next day).

**CRITICAL GAP:** No Daily Forecast UI yet. Need to extend Mentor Forecast Engine with weekly/daily mode toggle.

---

### Flow 6: Auto-Sync from Forecast Engine into Community Channels

**Trigger:** Mentor publishes a forecast; it should automatically appear in Community Hub without manual posting.

**System Flow:**
1. Mentor clicks "Publish to Gameplan" in Mentor Forecast Engine.
2. POST request sent to `/api/community/forecasts` with forecast data.
3. API route:
   - Validates user is mentor role.
   - Inserts forecast into `community_forecasts` table.
   - Returns forecast ID.
4. API route triggers **Supabase Realtime broadcast** to `community-hub` channel.
5. All connected clients subscribed to `community-hub` channel receive new forecast event.
6. **FloatingCommunityHub component** (listening via `useEffect` + Supabase subscription):
   - Receives broadcast event.
   - Parses forecast data.
   - Checks if current view is `daily-gameplan`.
   - If yes, updates local state to prepend new forecast to DAILY_FORECASTS array.
   - **DailyGameplan component** re-renders; new forecast card appears at top.
7. (Optional) Browser notification sent to users: "New forecast: XAU/USD by Mentor Chen".

**Alternative (Simpler but No Real-Time):**
- Daily Gameplan component polls `/api/community/forecasts?today=true` every 30 seconds.
- Compares fetched forecasts to local state; prepends any new ones.

**Edge Cases:**
- **User offline when forecast published:** Sees new forecast on next Daily Gameplan view load (fetches latest from API).
- **Multiple mentors publish simultaneously:** Forecasts appear in order of `created_at` timestamp.

**Error States:**
- Realtime subscription fails: Fallback to polling mode.
- Broadcast message malformed: Log error; ignore event.

**Loading States:**
- New forecast appears with subtle fade-in animation.

**Permissions:**
- Only mentors can create forecasts (enforced in API route).
- All community members can view forecasts (no read permission check).

**CRITICAL GAP:** No Realtime subscription logic in FloatingCommunityHub. No API route for fetching forecasts. Need to implement both Realtime (for instant updates) and REST (for initial load).

---

### Flow 7: Viewing Weekly Outlook (Community Hub)

**Trigger:** User wants to see the week's macro context and instrument bias.

**Steps:**
1. User hovers left edge → **Community Hub** opens.
2. User clicks **"gameplan"** channel.
3. Daily Gameplan view renders.
4. At top, **Weekly Outlook** section displays:
   - Week date range (e.g., "Jan 6 – Jan 10").
   - Week theme (e.g., "Fed Minutes & CPI Week").
   - Subtitle ("High timeframe context + key drivers (educational)").
5. Below header, **"This Week's Focus"** pills:
   - Three toggle buttons: **USD Week | Gold Week | Risk-On Week**.
   - User clicks **"USD Week"** → button highlights in indigo.
   - (Future) Dashboard reorders to show USD-related instruments first.
6. Next section: **"Macro Drivers This Week"** (two columns).
   - **Left column: Key Events** (4 event cards).
     - Each card shows: Day (Wed), Event name (FOMC Minutes), Impact badge (High/Medium), description.
     - User hovers over event card → tooltip shows additional detail.
   - **Right column: Macro Summary** (4 bullet points).
     - Text like "USD sensitive to CPI surprise – hot print strengthens dollar".
7. Next section: **"Weekly Bias Dashboard"** (accordion rows).
   - 4 rows (one per instrument: DXY, XAU/USD, EUR/USD, NAS100).
   - Each row shows (collapsed state):
     - Symbol, Type pill (INDEX/COMMODITY/FX/EQUITY), Bias badge (BULLISH/BEARISH/NEUTRAL), Key zones chips, Expectation text (2 lines), Driver tags, Confidence bar.
   - User clicks **"View details"** button on DXY row.
   - Row expands (accordion animation).
   - Expanded content shows 3 columns:
     - **Why This Bias:** 3 bullet points explaining reasoning.
     - **Invalidation:** Text describing what would negate the bias.
     - **What Would Change:** Scenario that would flip bias.
8. User scrolls down to **"Weekly Forecast Cards"** (horizontal carousel).
   - 4 clickable cards with chart previews (as described in Flow 3).

**Edge Cases:**
- **No macro events this week:** "No major events scheduled" message displays.
- **Dashboard empty:** "No weekly outlook published yet" message.

**Error States:**
- Weekly data fetch fails: Display cached/stale data with "Last updated: [timestamp]" warning.

**Loading States:**
- Skeleton loaders for event cards and bias rows while fetching.

**Permissions:** None required (weekly outlook visible to all).

**CRITICAL GAP:** All data is hardcoded (MACRO_EVENTS, MACRO_SUMMARY, WEEKLY_DRIVERS arrays in daily-gameplan.tsx). Need to connect to forecasts database or separate weekly_outlook table.

---

### Flow 8: Reading Weekly Bias Dashboard Rows + Expanding

*Covered in Flow 7 above (step 7).*

---

### Flow 9: Using Filters (Pairs/Status/Mentor)

**Trigger:** User wants to filter forecasts/signals by specific criteria.

**Steps:**
1. In Daily Gameplan view, below "Today's Forecasts" header, filter bar displays:
   - **All Status** dropdown (active/in-play/watching).
   - **All Pairs** dropdown (EUR/USD, XAU/USD, NAS100, etc.).
   - (Future) **All Mentors** dropdown (Chen, Alex, Sophia).
2. User clicks **"All Status"** dropdown.
3. Dropdown opens showing:
   - ☑ All Status
   - ☐ Active
   - ☐ In-Play
   - ☐ Watching
4. User clicks **"Active"** checkbox.
5. Dropdown stays open (multi-select).
6. User clicks outside dropdown or clicks apply button (if added).
7. **System Actions:**
   - Filters DAILY_FORECASTS array to only show `status === "active"`.
   - Filtered forecast cards re-render.
   - Filter badge appears next to dropdown: "Status: Active (X)".
8. User clicks **"All Pairs"** dropdown.
9. User selects **"XAU/USD"** checkbox.
10. Forecast cards filter to only show active XAU/USD forecasts.
11. User clicks **filter badge (X icon)** to clear a filter.
12. Forecasts list updates to remove that filter.

**Edge Cases:**
- **All filters applied result in 0 forecasts:** "No forecasts match your filters" message displays.
- **User clears all filters:** Returns to default view (all forecasts).

**Error States:** None (client-side filtering only).

**Loading States:**
- Filter animation (fade out old cards, fade in new ones) - 200ms.

**Permissions:** None required.

**CRITICAL GAP:** Filter dropdowns exist in UI but not functional. Need to add local state for activeFilters and array.filter() logic. Mentor filter needs mentors list from database.

---

### Flow 10: Creating and Joining War Rooms + Auto-Expiration

**Trigger:** User wants to create a temporary channel to discuss a live trade setup.

**Create Flow:**
1. In Community Hub, Channel List (Column 2), "ACTIVE WAR ROOMS" section displays.
2. Below existing war rooms, **"+ Open War Room"** button displays (with lock icon + tooltip).
3. User clicks button.
4. **"Deploy War Room"** modal opens (center overlay).
5. Modal displays:
   - Title: "Deploy War Room".
   - Subtitle: "Create a temporary strike channel for your setup".
   - **Ticker Input:** "What are you trading?" (e.g., BTC, EUR, GOLD).
   - **Bias Toggle:** LONG (green up arrow) | SHORT (red down arrow).
   - **Duration Dropdown:** 1 hour | 4 hours | 12 hours | 24 hours (default).
   - (Optional) **Setup Thesis textarea:** "Why this trade?".
   - **Channel Preview:** Shows what channel will look like (e.g., "#short-btc-4h-scalp").
6. User types "BTC" in ticker input.
7. User selects **SHORT** bias → red down arrow highlights.
8. User selects **4 hours** duration.
9. Channel preview updates: "#short-btc-4h-scalp" with red arrow icon.
10. User clicks **"Deploy War Room"** button.
11. **System Actions:**
    - (Future) POST to `/api/rooms` with `{ name: "short-btc-4h-scalp", ticker: "BTC", bias: "SHORT", expires_at: now + 4h, organization_id: current_server_id }`.
    - Room inserted into `rooms` table.
    - User automatically added to `memberships` table as creator.
    - Room appears in "ACTIVE WAR ROOMS" section of Channel List.
12. Modal closes.
13. New war room channel displays in list with:
    - Channel name (e.g., "short-btc-4h-scalp").
    - Ticker badge (BTC).
    - Expiration countdown ("Expires in 3h 58m").
    - Member count (1).

**Join Flow:**
1. User sees war room in Channel List (created by another user).
2. User clicks war room channel.
3. **System Actions:**
   - (Future) POST to `/api/rooms/[id]/join`.
   - User added to `memberships` table.
   - Member count increments.
4. Main View (Column 3) renders **War Room Chat**.
5. User can now send messages in war room.

**Auto-Expiration Flow:**
1. **Background cron job** (or Supabase Edge Function) runs every 5 minutes.
2. Queries `rooms` table for `expires_at < NOW() AND status = 'active'`.
3. For each expired room:
   - Updates `status` to 'archived'.
   - (Optional) Sends notification to members: "War room 'short-btc-4h-scalp' has expired".
   - (Optional) Soft-deletes messages or moves to archive table.
4. Next time Community Hub loads, archived rooms don't appear in "ACTIVE WAR ROOMS" list.

**Edge Cases:**
- **User creates war room but no one joins:** Room still expires after duration.
- **User tries to join expired room:** "This war room has ended" error displays.
- **Multiple war rooms for same ticker:** Allowed (e.g., "short-btc-scalp" and "long-btc-swing" can coexist).

**Error States:**
- Room creation fails (DB error): Error toast "Failed to create war room. Try again.".
- Join fails (already a member): Silently succeed (idempotent).
- Ticker invalid (empty): Form validation prevents submission.

**Loading States:**
- While creating: Modal shows spinner; "Deploying..." text.
- While joining: Brief loading state on war room card.

**Permissions:**
- Only verified traders can create war rooms (check `verified_level >= 1` in API route).
- All community members can join public war rooms.

**CRITICAL GAP:** War room creation modal exists but **Deploy button doesn't call API**. Need to implement:
- POST `/api/rooms` route (exists in types but not tested).
- Cron job or Edge Function for auto-expiration.
- Real-time subscription so other users see new war room appear instantly.
- War room chat messages (currently uses mock WAR_ROOM_CHAT array).

---

### Flow 11: Mentor Stage - Going Live, Joining, Chat, Screen Share Request

**Going Live Flow (Mentor):**
1. Mentor navigates to Community Hub → selects **"Mentor Stage"** channel.
2. In Channel List (Column 2), "MENTOR STAGE" section displays with **"🔴 LIVE"** badge (if mentor is live) or **"Go Live"** button (if offline).
3. Mentor clicks **"Go Live"** button.
4. **"Start Live Session"** modal opens:
   - Camera/microphone permission requests (browser native).
   - Session title input (e.g., "NY Session Live Trading").
   - (Optional) Description textarea.
   - **"Start Broadcasting"** button.
5. Mentor clicks "Start Broadcasting".
6. **System Actions:**
   - (Future) WebRTC connection established via service like Daily.co, Agora, or Twitch.
   - Mentor's camera/microphone stream starts.
   - New `live_sessions` table entry created: `{ mentor_id, title, started_at, status: 'live' }`.
   - Realtime broadcast sent to community: "Mentor Chen went live: NY Session Trading".
7. Modal closes; Mentor Stage view updates to show:
   - Mentor's video preview (self-view) in top-left corner.
   - **"End Stream"** button (red, top-right).
   - Viewer count (live updates).
   - Live chat sidebar (Column 3 right side).

**Joining Flow (Student):**
1. Student navigates to Community Hub → selects **"Mentor Stage"** channel.
2. If mentor is live, **video player** displays in Main View (Column 3).
3. Video shows mentor's screen share or camera feed.
4. Below video, **live chat** displays with messages from other viewers.
5. Student types message in chat input at bottom.
6. Message sent via WebSocket or Supabase Realtime.
7. Message appears in chat for all viewers (including mentor).

**Screen Share Request Flow:**
1. While mentor is live, mentor clicks **"Share Screen"** button in self-view controls.
2. Browser screen picker opens.
3. Mentor selects trading terminal window or entire screen.
4. Mentor's video switches from camera to screen share.
5. All viewers now see mentor's screen instead of camera feed.

**Ending Stream Flow:**
1. Mentor clicks **"End Stream"** button.
2. Confirmation modal: "Are you sure? This will end the live session for all viewers."
3. Mentor clicks "End".
4. **System Actions:**
   - WebRTC stream stopped.
   - `live_sessions` table updated: `status = 'ended'`, `ended_at = NOW()`.
   - Realtime broadcast: "Mentor Chen ended the live session".
5. Video player closes for all viewers; message displays "Stream has ended".

**Edge Cases:**
- **Mentor loses internet connection:** Auto-ends stream after 60s timeout; viewers see "Connection lost" message.
- **No one joins:** Mentor can still broadcast; viewer count shows 0.
- **Multiple mentors try to go live simultaneously:** Allowed (separate streams); each has own "Mentor Stage" channel or sub-channel.

**Error States:**
- Camera/microphone permission denied: Error modal "Please allow camera/microphone access to go live".
- WebRTC connection fails: Retry button; fallback to audio-only mode.

**Loading States:**
- While connecting: "Connecting to live session..." spinner.
- While loading video: Buffering indicator.

**Permissions:**
- Only mentors (role = "creator" or "admin") can start streams.
- All community members can join and view.

**CRITICAL GAP:** Mentor Stage is completely mockup—**no video/audio integration**. Need to implement:
- Choose streaming service (Daily.co, Agora, Twitch, or self-hosted with WebRTC).
- `live_sessions` database table.
- Start/end stream API routes.
- Real-time viewer count (Supabase Realtime presence feature).
- Chat persistence (messages database table).

---

### Flow 12: Posting to Daily Gameplan Channel and Weekly Outlook Pinned Items

**Daily Gameplan Post Flow:**
*Currently no manual posting—forecasts are auto-synced (future feature). If manual posting is needed:*

1. User (mentor) is viewing Daily Gameplan channel in Community Hub.
2. At bottom of Main View, **"Post Update"** button displays (or message input box).
3. User clicks button → modal or inline editor opens.
4. User types update (e.g., "Heads up: CPI in 30 minutes. Watch for volatility.").
5. User clicks **"Post"** button.
6. **System Actions:**
   - (Future) POST to `/api/community/posts` with `{ channel_id: "daily-gameplan", content, author_id }`.
   - Post inserted into `channel_posts` table.
   - Realtime broadcast to channel subscribers.
7. Post appears in Daily Gameplan feed (below forecasts).

**Weekly Outlook Pin Flow:**
*Currently no pin functionality. Proposed:*

1. Admin/mentor views Weekly Outlook section in Daily Gameplan.
2. Clicks **"Edit Weekly Outlook"** button (visible only to mentors).
3. Modal opens with form to edit:
   - Week theme.
   - Focus pills (USD Week, Gold Week, Risk-On Week).
   - Macro events.
   - Macro summary bullets.
4. Mentor saves changes.
5. **System Actions:**
   - (Future) PUT to `/api/community/weekly-outlook` with updated data.
   - Overwrites current week's outlook in database.
6. All users see updated Weekly Outlook on refresh or via Realtime.

**CRITICAL GAP:** No posting or pinning functionality exists. Weekly Outlook is hardcoded. Need to implement:
- `channel_posts` table for manual posts (if needed—may not be necessary if forecasts are enough).
- `weekly_outlooks` table with `week_start_date`, `theme`, `events` (JSONB), `summary` (text[]).
- Edit form for mentors to update Weekly Outlook.

---

### Flow 13: History Browsing (Weekly + Daily Archives)

**Trigger:** User wants to review past forecasts or trades.

**Steps:**
1. User navigates to **/history** page.
2. **History View** displays with three tabs:
   - **Weekly Forecasts**
   - **Daily Forecasts**
   - **Trades** (future—requires broker integration)
3. User clicks **"Weekly Forecasts"** tab (default).
4. At top, **date range picker** and **instrument filter** dropdowns.
5. User selects date range (e.g., "Last 3 months").
6. User selects instrument (e.g., "XAU/USD") or leaves as "All Pairs".
7. **System Actions:**
   - (Future) GET `/api/community/forecasts?type=weekly&from=2024-10-01&to=2025-01-01&instrument=XAU/USD`.
   - API returns paginated list of archived forecasts.
8. Timeline displays archived forecasts:
   - Each entry shows: Week date range, instrument, bias, status (PLAYED / INVALIDATED / ACTIVE), mentor, accuracy badge (if outcome recorded).
9. User clicks **"View Details"** on a forecast.
10. Forecast Detail Modal opens (read-only, same as Flow 3).
11. User closes modal; returns to history timeline.

**Daily Forecasts Tab:**
- Same flow but fetches `type=daily` forecasts.
- Grouped by date (e.g., "Monday, Jan 6, 2025").

**Trades Tab (Future):**
- Displays executed trades from broker API.
- Each trade shows: Instrument, entry/exit prices, R:R, profit/loss, confluences present, screenshot (if captured).

**Edge Cases:**
- **No forecasts in date range:** "No forecasts found for selected filters" message.
- **Very old forecasts (>1 year):** Consider archiving to separate table for performance.

**Error States:**
- API fetch fails: Display cached data (if available) with stale warning.

**Loading States:**
- Skeleton timeline while fetching.

**Permissions:**
- Users can only see history for communities they're members of.
- (Future) Mentors can see accuracy stats (win rate, average R:R).

**CRITICAL GAP:** History page is placeholder (shows "Coming soon" message). Need to implement:
- Forecast fetch API with date range and filters.
- Trades history (requires broker integration).
- Outcome tracking (mark forecasts as played/invalidated after expiration).

---

## 5. COMPONENT LIBRARY / UI SYSTEM (DESIGN-TO-CODE)

### Design System Foundation

**Framework:** Next.js 15 + React 18 + TypeScript  
**Styling:** Tailwind CSS + shadcn/ui components  
**Animations:** Framer Motion  
**Icons:** Lucide React  
**Fonts:** Inter (Google Fonts)  

**Color System:**
- Background: `#0a0c10` (near black)
- Cards: `rgba(18, 20, 28, 0.8)` (dark blue-gray glass)
- Primary Purple: `#9333ea` (violet-600)
- Secondary Blue: `#3b82f6` (sky-500)
- Accent Emerald: `#10b981` (emerald-500)
- Accent Red: `#ef4444` (red-500)
- Text Primary: `white`
- Text Secondary: `slate-400`
- Borders: `rgba(255, 255, 255, 0.1)` (white/10)

### Core Components (A-Z)

#### AnalysisCard
**Path:** `components/analysis-card.tsx`  
**Purpose:** Display session OHLC analysis (Asia/London/NY).  
**Props:**
```typescript
{
  sessionName: "Asia" | "London" | "New York"
  status: "UPCOMING" | "LIVE" | "COMPLETED"
  ohlc: { open: number; high: number; low: number; close: number }
  rangePips?: number
  startTime: string
  endTime: string
}
```
**Variants:** None.  
**States:** Status badge changes color (gray = upcoming, emerald = live, slate = completed).  
**Responsive:** Stacks vertically on mobile (<768px).  
**Accessibility:** ARIA labels for status badges; keyboard navigation.

#### BiasBadge
**Path:** `components/daily-gameplan.tsx` (inline component, should extract)  
**Purpose:** Display trade bias (bullish/bearish/neutral) with color coding.  
**Props:**
```typescript
{
  bias: "bullish" | "bearish" | "neutral"
  size?: "sm" | "md" | "lg"
}
```
**Variants:** Size (sm = 12px text, md = 14px, lg = 16px).  
**States:** Hover scales to 1.05x.  
**Responsive:** Always inline (adapts to container).  
**Accessibility:** Color not sole indicator (includes text and icon).

#### ConfluenceBadge
**Path:** `components/shared/confluence-badge.tsx`  
**Purpose:** Display a single confluence with icon and name.  
**Props:**
```typescript
{
  confluence: ConfluenceMeta
  active: boolean
  onClick?: () => void
}
```
**Variants:** Active (emerald border) vs inactive (slate border).  
**States:** Hover brightens; active shows checkmark icon.  
**Responsive:** Wraps in flex container.  
**Accessibility:** Button role; keyboard accessible.

#### CopilotSuggestionCard
**Path:** `components/copilot/CopilotRightRail.tsx` (inline, should extract)  
**Purpose:** Display AI-generated suggestion with actions.  
**Props:**
```typescript
{
  suggestion: CopilotSuggestion
  onActionClick: (actionId: string) => void
  onDismiss: () => void
}
```
**Variants:** Severity (info = blue, warning = amber, critical = red border).  
**States:** Hover lifts with shadow; dismissed fades out.  
**Responsive:** Full width on mobile, fixed width on desktop.  
**Accessibility:** Focus trap within action buttons.

#### DailyForecastCard
**Path:** `components/daily-gameplan.tsx` (inline, should extract)  
**Purpose:** Display a single daily forecast with key levels and bias.  
**Props:**
```typescript
{
  forecast: ForecastCard
  onClick?: () => void
}
```
**Variants:** Status badge (active/in-play/watching) changes color.  
**States:** Hover lifts; click opens detail modal.  
**Responsive:** Stacks levels vertically on mobile.  
**Accessibility:** Card is button with proper label.

#### EnhancedInstrumentSelector
**Path:** `components/enhanced-instrument-selector.tsx`  
**Purpose:** Dropdown to select trading instrument with search and favorites.  
**Props:** None (uses `useInstrument` Zustand store).  
**Variants:** Open/closed state.  
**States:**
- Closed: Shows current instrument name (e.g., "EUR/USD").
- Open: Dropdown expands with tabs (Forex/Indices/Crypto/Commodities/Favorites).
- Hover: Tab highlights.
- Search active: Filters instrument list.
**Responsive:** Full width on mobile (<768px); fixed width (320px) on desktop.  
**Accessibility:** Combobox pattern; arrow key navigation; ESC closes.

#### FloatingCommunityHub
**Path:** `components/floating-community-hub.tsx`  
**Purpose:** Discord-style sidebar with server rail, channel list, and main view.  
**Props:** None (self-contained state).  
**Variants:**
- Collapsed: Trigger button only (72px hover zone).
- Expanded: 580-850px wide drawer.
**States:**
- Hover trigger: Opens after 150ms delay.
- Mouse leave drawer: Closes after 300ms delay.
- Active server: White pill indicator on left edge.
- Active channel: Indigo highlight.
**Responsive:** Hidden on mobile (<1024px width) - needs mobile-specific design.  
**Accessibility:** Focus trap when open; ESC key closes.

#### ForecastDetailModal
**Path:** `components/daily-gameplan.tsx` (inline, should extract)  
**Purpose:** Full-screen modal showing detailed forecast with HTF/LTF charts and scenarios.  
**Props:**
```typescript
{
  forecast: WeeklyForecast
  onClose: () => void
}
```
**Variants:** Tabs (HTF View / LTF View / Scenarios).  
**States:**
- Tab hover: Underline appears.
- Tab active: Blue underline + bold text.
**Responsive:** Full screen on all sizes; tabs stack on mobile.  
**Accessibility:** Modal dialog with focus trap; close on ESC.

#### KeyLevelChip
**Path:** `components/daily-gameplan.tsx` (inline, should extract)  
**Purpose:** Display a single key level (support/resistance/POI) with price and label.  
**Props:**
```typescript
{
  type: "support" | "resistance" | "poi"
  price: string
  label: string
}
```
**Variants:**
- Support: Emerald background.
- Resistance: Red background.
- POI: Indigo background.
**States:** Hover shows full label in tooltip (if truncated).  
**Responsive:** Truncates label at 12 chars on mobile.  
**Accessibility:** ARIA label includes type, price, and label.

#### MentorForecastEngine
**Path:** `components/mentor-forecast-engine.tsx`  
**Purpose:** 2-column form for mentors to create forecasts.  
**Props:** None (self-contained).  
**Variants:**
- Chart drop zones: Empty (dashed border) vs populated (shows preview).
- Bias toggle: Bullish (green) / Neutral (slate) / Bearish (red).
**States:**
- Form validation: Invalid fields show red border + error message.
- Publish loading: Button shows spinner.
- Draft saved: Toast notification appears.
**Responsive:**
- Desktop (>1280px): 2 columns (50/50).
- Tablet (768-1280px): 2 columns (40/60 for left/right).
- Mobile (<768px): Stacks vertically (charts first, form second).
**Accessibility:** Form labels, error announcements, disabled state for publish button.

#### ScenarioCard
**Path:** `components/floating-scenario-panel.tsx` (or create-scenario-modal.tsx)  
**Purpose:** Display a trading scenario with confluences and R:R.  
**Props:**
```typescript
{
  scenario: TradingScenario
  onEdit?: () => void
  onDelete?: () => void
  onSync?: () => void
}
```
**Variants:** Source badge (forecast = purple, terminal = blue, manual = slate).  
**States:**
- Hover: Lifts with shadow; action buttons appear.
- Selected: Border becomes emerald.
**Responsive:** Full width; stacks confluences on mobile.  
**Accessibility:** Card is button; actions in dropdown menu.

#### SessionCard (same as AnalysisCard - see above)

#### SignalCard
**Path:** `components/floating-community-hub.tsx` (inline, should extract)  
**Purpose:** Display a mentor's trade signal with entry/stop/target.  
**Props:**
```typescript
{
  signal: Signal
  onCopyTrade?: () => void
}
```
**Variants:**
- Bias: LONG (emerald) / SHORT (red) badge.
- Verified: Shows blue checkmark icon.
**States:**
- Hover: Lifts; "Copy Trade" button appears.
- Rating: Shows as percentage bar (0-100%).
**Responsive:** Stacks levels on mobile.  
**Accessibility:** Signal details in structured list.

#### StatusBadge
**Path:** Inline in multiple components (should extract to `components/shared/status-badge.tsx`)  
**Purpose:** Display forecast/scenario status (active/in-play/watching/expired).  
**Props:**
```typescript
{
  status: "active" | "in-play" | "watching" | "expired"
}
```
**Variants:**
- Active: Emerald background, pulsing green dot.
- In-Play: Amber background, clock icon.
- Watching: Sky background, eye icon.
- Expired: Slate background, no icon.
**States:** Active status pulses (fade animation).  
**Responsive:** Always inline.  
**Accessibility:** Status included in text (not color-only).

#### WeeklyBiasRow
**Path:** `components/daily-gameplan.tsx` (inline, should extract)  
**Purpose:** Expandable accordion row showing weekly bias for an instrument.  
**Props:**
```typescript
{
  driver: WeeklyDriver
  isExpanded: boolean
  onToggle: () => void
}
```
**Variants:** Expanded/collapsed.  
**States:**
- Collapsed: Shows summary (symbol, bias, zones, expectation, confidence bar).
- Expanded: Shows 3-column detail (why this bias, invalidation, what would change).
- Hover: Background lightens.
**Responsive:** Stacks detail columns on mobile.  
**Accessibility:** Button role for toggle; expanded state in ARIA.

#### WeeklyForecastCard
**Path:** `components/daily-gameplan.tsx` (inline, should extract)  
**Purpose:** Horizontal card in carousel showing weekly forecast preview.  
**Props:**
```typescript
{
  forecast: WeeklyForecast
  onClick: () => void
}
```
**Variants:** Status badge (active/in-play/watching).  
**States:**
- Hover: Scale 1.02x; shadow intensifies.
- Click: Opens ForecastDetailModal.
**Responsive:** Fixed width (280px) in carousel; scrolls horizontally.  
**Accessibility:** Card is button; chart has alt text.

### shadcn/ui Components Used

**From `components/ui/` directory (auto-installed by shadcn CLI):**
- `accordion.tsx` - Used for weekly bias dashboard expandable rows.
- `alert-dialog.tsx` - Used for confirmation modals (e.g., delete scenario).
- `avatar.tsx` - Used for mentor/user avatars in signals, chat.
- `badge.tsx` - Used for status badges, tags.
- `button.tsx` - Used everywhere (primary action, secondary, ghost variants).
- `card.tsx` - Base card component (forecast cards, signal cards, session cards).
- `dialog.tsx` - Used for modals (create scenario, forecast detail, war room creation).
- `dropdown-menu.tsx` - Used for user menu, action menus.
- `input.tsx` - Text inputs in forms.
- `label.tsx` - Form labels.
- `popover.tsx` - Used for tooltips, confluence details.
- `scroll-area.tsx` - Used in chat views, long lists.
- `select.tsx` - Dropdowns (instrument selector, filters).
- `separator.tsx` - Dividers between sections.
- `switch.tsx` - Toggle switches (e.g., read-only mode in forecast form).
- `tabs.tsx` - Used in forecast detail modal (HTF/LTF/Scenarios).
- `textarea.tsx` - Multi-line inputs (narrative, thesis).
- `toast.tsx` - Notifications (success, error).
- `tooltip.tsx` - Hover tooltips (key levels, confluence descriptions).

### Component Extraction TODOs

**Components currently inline that should be extracted:**
1. `BiasBadge` → `components/shared/bias-badge.tsx`
2. `StatusBadge` → `components/shared/status-badge.tsx`
3. `KeyLevelChip` → `components/shared/key-level-chip.tsx`
4. `DailyForecastCard` → `components/forecast/daily-forecast-card.tsx`
5. `WeeklyForecastCard` → `components/forecast/weekly-forecast-card.tsx`
6. `WeeklyBiasRow` → `components/forecast/weekly-bias-row.tsx`
7. `ForecastDetailModal` → `components/forecast/forecast-detail-modal.tsx`
8. `SignalCard` → `components/signal/signal-card.tsx`
9. `CopilotSuggestionCard` → `components/copilot/suggestion-card.tsx`

---

## 6. DATA MODEL / DATABASE SCHEMA (VERY DETAILED)

### Database: Supabase PostgreSQL

**Existing Schema:** `scripts/001_auth_schema.sql` (already executed).

### Existing Tables (From Auth Schema)

#### Table: `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  verified_level INTEGER DEFAULT 0 CHECK (verified_level >= 0 AND verified_level <= 3),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```
**Indexes:**
- `idx_profiles_display_name` on `display_name`

**RLS Policies:**
- `profiles_select_all`: SELECT for all users.
- `profiles_insert_own`: INSERT only for own profile.
- `profiles_update_own`: UPDATE only for own profile.
- `profiles_delete_own`: DELETE only for own profile.

**Audit Logs:** `updated_at` auto-updated via trigger.

**Notes:**
- `verified_level` used for access control (0 = unverified, 1 = verified trader, 2 = mentor, 3 = admin).
- `avatar_url` should be Supabase Storage URL or Gravatar.

---

#### Table: `organizations`
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  avatar_url TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```
**Indexes:**
- `idx_organizations_slug`
- `idx_organizations_owner_id`

**RLS Policies:**
- `organizations_select_member`: SELECT if user is member.
- `organizations_insert_own`: INSERT if auth.uid() = owner_id.
- `organizations_update_admin`: UPDATE if user is admin member.
- `organizations_delete_owner`: DELETE if auth.uid() = owner_id.

**Notes:**
- Organization = trading group/community.
- Slug must be unique and URL-safe.

---

#### Table: `rooms`
```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'invite_only')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, slug)
);
```
**Indexes:**
- `idx_rooms_organization_id`
- `idx_rooms_slug`

**RLS Policies:**
- `rooms_select_member`: SELECT if public or user is member.
- `rooms_insert_org_admin`: INSERT if user is org admin.
- `rooms_update_admin`: UPDATE if user is room admin/moderator.
- `rooms_delete_admin`: DELETE if user is room admin.

**Notes:**
- Room = channel within organization (e.g., #general, #signals, #war-room-btc).
- Temporary war rooms should have `expires_at TIMESTAMPTZ` field (add via migration).

---

#### Table: `memberships`
```sql
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'creator', 'moderator', 'member', 'pending', 'banned')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'banned')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (
    (organization_id IS NOT NULL AND room_id IS NULL) OR
    (organization_id IS NULL AND room_id IS NOT NULL)
  ),
  UNIQUE(user_id, organization_id),
  UNIQUE(user_id, room_id)
);
```
**Indexes:**
- `idx_memberships_user_id`
- `idx_memberships_organization_id`
- `idx_memberships_room_id`

**RLS Policies:**
- `memberships_select_own`: SELECT own memberships or if member of same org/room.
- `memberships_insert_admin`: INSERT if admin or self-joining.
- `memberships_update_admin`: UPDATE if admin.
- `memberships_delete_admin`: DELETE if admin or own membership.

---

#### Table: `invites`
```sql
CREATE TABLE invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invite_code TEXT UNIQUE NOT NULL,
  email TEXT,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  max_uses INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (
    (organization_id IS NOT NULL AND room_id IS NULL) OR
    (organization_id IS NULL AND room_id IS NOT NULL)
  )
);
```
**Indexes:**
- `idx_invites_invite_code`
- `idx_invites_email`

**RLS Policies:**
- `invites_select_own`: SELECT if created by user or email matches.
- `invites_insert_admin`: INSERT if admin/moderator.
- `invites_update_creator`: UPDATE if creator.
- `invites_delete_creator`: DELETE if creator.

---

#### Table: `plans`
```sql
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10, 2) DEFAULT 0,
  price_yearly DECIMAL(10, 2) DEFAULT 0,
  features JSONB DEFAULT '[]'::jsonb,
  limits JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```
**RLS Policies:**
- `plans_select_all`: SELECT if is_active = true.

**Notes:**
- Features JSONB example: `["AI Copilot", "Unlimited Scenarios", "Priority Support"]`.
- Limits JSONB example: `{ "max_scenarios": 50, "max_forecasts": 10 }`.

---

#### Table: `subscriptions`
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly', 'lifetime')),
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, plan_id)
);
```
**Indexes:**
- `idx_subscriptions_user_id`
- `idx_subscriptions_stripe_subscription_id`

**RLS Policies:**
- `subscriptions_select_own`: SELECT own subscriptions.
- `subscriptions_insert_own`: INSERT own subscription (via API).
- `subscriptions_update_own`: UPDATE own subscription (via API).
- `subscriptions_delete_own`: DELETE own subscription.

**Notes:**
- Stripe webhook updates `status` and `current_period_end`.

---

### NEW Tables (To Be Created)

#### Table: `community_forecasts`

**Purpose:** Store weekly and daily forecasts created by mentors.

```sql
CREATE TABLE community_forecasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('weekly', 'daily')),
  instrument TEXT NOT NULL, -- e.g., 'XAU/USD', 'EUR/USD', 'NAS100'
  bias TEXT NOT NULL CHECK (bias IN ('bullish', 'bearish', 'neutral')),
  narrative TEXT NOT NULL,
  key_levels JSONB DEFAULT '[]'::jsonb, -- Array of { type, price, label }
  macro_drivers TEXT[], -- Array of driver tags
  htf_chart_url TEXT,
  ltf_chart_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'in-play', 'watching', 'expired', 'archived')),
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
  outcome TEXT CHECK (outcome IN ('played', 'invalidated', 'pending')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- For daily forecasts (end of trading day)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_forecasts_mentor_id ON community_forecasts(mentor_id);
CREATE INDEX idx_forecasts_organization_id ON community_forecasts(organization_id);
CREATE INDEX idx_forecasts_type ON community_forecasts(type);
CREATE INDEX idx_forecasts_instrument ON community_forecasts(instrument);
CREATE INDEX idx_forecasts_status ON community_forecasts(status);
CREATE INDEX idx_forecasts_published_at ON community_forecasts(published_at DESC);
```

**RLS Policies:**
```sql
-- All org members can view forecasts
CREATE POLICY "forecasts_select_member"
  ON community_forecasts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.organization_id = community_forecasts.organization_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
    )
  );

-- Only mentors can insert forecasts
CREATE POLICY "forecasts_insert_mentor"
  ON community_forecasts FOR INSERT
  WITH CHECK (
    auth.uid() = mentor_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.verified_level >= 2 -- 2 = mentor, 3 = admin
    )
  );

-- Mentors can update own forecasts
CREATE POLICY "forecasts_update_own"
  ON community_forecasts FOR UPDATE
  USING (auth.uid() = mentor_id);

-- Mentors can delete own forecasts
CREATE POLICY "forecasts_delete_own"
  ON community_forecasts FOR DELETE
  USING (auth.uid() = mentor_id);
```

**Audit Logs:** `updated_at` auto-updated via trigger (reuse existing trigger).

**Soft Delete:** Use `status = 'archived'` instead of hard delete.

**key_levels JSONB Structure:**
```json
[
  { "type": "support", "price": "2030.00", "label": "Daily FVG" },
  { "type": "resistance", "price": "2048.50", "label": "Weekly High" },
  { "type": "poi", "price": "2035.20", "label": "OB Mitigation" }
]
```

---

#### Table: `weekly_outlooks`

**Purpose:** Store macro events and weekly bias dashboard data.

```sql
CREATE TABLE weekly_outlooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  theme TEXT NOT NULL, -- e.g., "Fed Minutes & CPI Week"
  focus_pills TEXT[], -- e.g., ['USD Week', 'Gold Week', 'Risk-On Week']
  macro_events JSONB DEFAULT '[]'::jsonb,
  macro_summary TEXT[],
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, week_start_date)
);

CREATE INDEX idx_weekly_outlooks_organization_id ON weekly_outlooks(organization_id);
CREATE INDEX idx_weekly_outlooks_week_start_date ON weekly_outlooks(week_start_date DESC);
```

**RLS Policies:**
```sql
-- All org members can view
CREATE POLICY "weekly_outlooks_select_member"
  ON weekly_outlooks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.organization_id = weekly_outlooks.organization_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
    )
  );

-- Only mentors/admins can insert/update
CREATE POLICY "weekly_outlooks_insert_mentor"
  ON weekly_outlooks FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.verified_level >= 2
    )
  );

CREATE POLICY "weekly_outlooks_update_mentor"
  ON weekly_outlooks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.verified_level >= 2
    )
  );
```

**macro_events JSONB Structure:**
```json
[
  {
    "id": "e1",
    "name": "FOMC Minutes",
    "day": "Wed",
    "impact": "high",
    "description": "Fed policy direction hints for Q1"
  }
]
```

---

#### Table: `weekly_drivers`

**Purpose:** Store weekly bias dashboard rows (one per instrument per week).

```sql
CREATE TABLE weekly_drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  weekly_outlook_id UUID NOT NULL REFERENCES weekly_outlooks(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('index', 'commodity', 'fx', 'equity')),
  bias TEXT NOT NULL CHECK (bias IN ('bullish', 'bearish', 'neutral')),
  expectation TEXT NOT NULL,
  key_zones TEXT[],
  tags TEXT[],
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
  why_this_bias TEXT[],
  invalidation TEXT,
  what_would_change TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_weekly_drivers_weekly_outlook_id ON weekly_drivers(weekly_outlook_id);
CREATE INDEX idx_weekly_drivers_symbol ON weekly_drivers(symbol);
```

**RLS Policies:**
- Inherit from `weekly_outlooks` (same access control).

---

#### Table: `signals`

**Purpose:** Store mentor-posted trade signals.

```sql
CREATE TABLE signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  asset TEXT NOT NULL,
  bias TEXT NOT NULL CHECK (bias IN ('LONG', 'SHORT')),
  entry TEXT NOT NULL,
  stop TEXT NOT NULL,
  target TEXT NOT NULL,
  rr TEXT NOT NULL, -- e.g., "2.6"
  notes TEXT,
  verified BOOLEAN DEFAULT false,
  rating INTEGER CHECK (rating >= 0 AND rating <= 100),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'hit-target', 'hit-stop', 'cancelled')),
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_signals_mentor_id ON signals(mentor_id);
CREATE INDEX idx_signals_organization_id ON signals(organization_id);
CREATE INDEX idx_signals_asset ON signals(asset);
CREATE INDEX idx_signals_posted_at ON signals(posted_at DESC);
```

**RLS Policies:**
```sql
-- All org members can view
CREATE POLICY "signals_select_member"
  ON signals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.organization_id = signals.organization_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
    )
  );

-- Only mentors can insert
CREATE POLICY "signals_insert_mentor"
  ON signals FOR INSERT
  WITH CHECK (
    auth.uid() = mentor_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.verified_level >= 2
    )
  );

-- Mentors can update own signals
CREATE POLICY "signals_update_own"
  ON signals FOR UPDATE
  USING (auth.uid() = mentor_id);
```

---

#### Table: `channel_messages`

**Purpose:** Store chat messages in channels (including war rooms).

```sql
CREATE TABLE channel_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  reply_to UUID REFERENCES channel_messages(id) ON DELETE SET NULL,
  attachments TEXT[], -- Array of Supabase Storage URLs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_channel_messages_room_id ON channel_messages(room_id);
CREATE INDEX idx_channel_messages_user_id ON channel_messages(user_id);
CREATE INDEX idx_channel_messages_created_at ON channel_messages(created_at DESC);
```

**RLS Policies:**
```sql
-- Room members can view messages
CREATE POLICY "messages_select_member"
  ON channel_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.room_id = channel_messages.room_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
    )
  );

-- Room members can insert messages
CREATE POLICY "messages_insert_member"
  ON channel_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.room_id = channel_messages.room_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
    )
  );

-- Users can update/delete own messages
CREATE POLICY "messages_update_own"
  ON channel_messages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "messages_delete_own"
  ON channel_messages FOR DELETE
  USING (auth.uid() = user_id);
```

---

#### Table: `live_sessions`

**Purpose:** Store mentor live stage sessions (video broadcasts).

```sql
CREATE TABLE live_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  stream_url TEXT, -- WebRTC room ID or stream URL
  status TEXT DEFAULT 'live' CHECK (status IN ('scheduled', 'live', 'ended')),
  viewer_count INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_live_sessions_mentor_id ON live_sessions(mentor_id);
CREATE INDEX idx_live_sessions_organization_id ON live_sessions(organization_id);
CREATE INDEX idx_live_sessions_status ON live_sessions(status);
```

**RLS Policies:**
```sql
-- All org members can view
CREATE POLICY "live_sessions_select_member"
  ON live_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.organization_id = live_sessions.organization_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
    )
  );

-- Only mentors can create sessions
CREATE POLICY "live_sessions_insert_mentor"
  ON live_sessions FOR INSERT
  WITH CHECK (
    auth.uid() = mentor_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.verified_level >= 2
    )
  );

-- Mentors can update own sessions
CREATE POLICY "live_sessions_update_own"
  ON live_sessions FOR UPDATE
  USING (auth.uid() = mentor_id);
```

---

#### Table: `copilot_events`

**Purpose:** Store user action events for AI analysis.

```sql
CREATE TABLE copilot_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL, -- Browser session ID (generated client-side)
  type TEXT NOT NULL, -- e.g., 'instrument:selected', 'scenario:saved'
  context JSONB DEFAULT '{}'::jsonb, -- { instrument, mode, timeframe, route }
  data JSONB DEFAULT '{}'::jsonb, -- Event-specific data
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_copilot_events_user_id ON copilot_events(user_id);
CREATE INDEX idx_copilot_events_session_id ON copilot_events(session_id);
CREATE INDEX idx_copilot_events_type ON copilot_events(type);
CREATE INDEX idx_copilot_events_created_at ON copilot_events(created_at DESC);
```

**RLS Policies:**
```sql
-- Users can only view own events
CREATE POLICY "copilot_events_select_own"
  ON copilot_events FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert own events
CREATE POLICY "copilot_events_insert_own"
  ON copilot_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- No update/delete (append-only log)
```

**Retention:** Auto-delete events older than 90 days via scheduled Edge Function.

---

#### Table: `trades`

**Purpose:** Store executed trades (future—requires broker integration).

```sql
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  instrument TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('LONG', 'SHORT')),
  entry_price DECIMAL(10, 5) NOT NULL,
  exit_price DECIMAL(10, 5),
  stop_loss DECIMAL(10, 5),
  take_profit DECIMAL(10, 5),
  position_size DECIMAL(10, 2) NOT NULL,
  rr TEXT,
  profit_loss DECIMAL(10, 2),
  confluences TEXT[], -- Confluences present at entry
  scenario_id TEXT, -- Link to scenario if trade came from scenario builder
  screenshot_url TEXT,
  notes TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
  opened_at TIMESTAMPTZ NOT NULL,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trades_user_id ON trades(user_id);
CREATE INDEX idx_trades_instrument ON trades(instrument);
CREATE INDEX idx_trades_status ON trades(status);
CREATE INDEX idx_trades_opened_at ON trades(opened_at DESC);
```

**RLS Policies:**
```sql
-- Users can only view own trades
CREATE POLICY "trades_select_own"
  ON trades FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert own trades
CREATE POLICY "trades_insert_own"
  ON trades FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update own trades
CREATE POLICY "trades_update_own"
  ON trades FOR UPDATE
  USING (auth.uid() = user_id);
```

---

### Relationships Diagram

```
auth.users (Supabase Auth)
  ├─── profiles (1:1)
  ├─── organizations (1:many, owner_id)
  ├─── memberships (1:many, user_id)
  ├─── community_forecasts (1:many, mentor_id)
  ├─── signals (1:many, mentor_id)
  ├─── channel_messages (1:many, user_id)
  ├─── live_sessions (1:many, mentor_id)
  ├─── copilot_events (1:many, user_id)
  ├─── trades (1:many, user_id)
  └─── subscriptions (1:many, user_id)

organizations
  ├─── rooms (1:many, organization_id)
  ├─── memberships (1:many, organization_id)
  ├─── community_forecasts (1:many, organization_id)
  ├─── signals (1:many, organization_id)
  ├─── weekly_outlooks (1:many, organization_id)
  └─── live_sessions (1:many, organization_id)

rooms
  ├─── memberships (1:many, room_id)
  └─── channel_messages (1:many, room_id)

weekly_outlooks
  └─── weekly_drivers (1:many, weekly_outlook_id)

community_forecasts
  └─── (no children currently)

channel_messages
  └─── (self-referential) reply_to (many:1)
```

---

## 7. API DESIGN (ENDPOINTS)

### Authentication Endpoints

**POST `/api/auth/signup`**
- **Purpose:** Register new user.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123",
    "display_name": "John Trader"
  }
  ```
- **Response:**
  ```json
  {
    "user": { "id": "uuid", "email": "user@example.com" },
    "session": { "access_token": "jwt..." }
  }
  ```
- **Validation:** Email format, password min 8 chars.
- **Permissions:** Public (no auth required).
- **Status:** ✅ **WORKING** (Supabase auth integrated).

**POST `/api/auth/login`**
- **Purpose:** Authenticate user.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Response:** Same as signup.
- **Validation:** Email exists, password matches.
- **Permissions:** Public.
- **Status:** ✅ **WORKING**.

**POST `/api/auth/logout`**
- **Purpose:** Invalidate session.
- **Request:** Empty body.
- **Response:** `{ "success": true }`
- **Permissions:** Authenticated.
- **Status:** ✅ **WORKING**.

**GET `/api/auth/me`**
- **Purpose:** Get current user profile.
- **Response:**
  ```json
  {
    "id": "uuid",
    "email": "user@example.com",
    "display_name": "John Trader",
    "verified_level": 1
  }
  ```
- **Permissions:** Authenticated.
- **Status:** ✅ **WORKING**.

---

### Instrument & Market Data Endpoints

**GET `/api/polygon/snapshot?pair=EURUSD`**
- **Purpose:** Get current price, 24h high/low, volume.
- **Response:**
  ```json
  {
    "data": {
      "ticker": "C:EURUSD",
      "price": 1.0850,
      "change": 0.0012,
      "changePercent": 0.11,
      "volume": 123456,
      "high": 1.0875,
      "low": 1.0820
    }
  }
  ```
- **Validation:** Pair must be valid instrument symbol.
- **Permissions:** Authenticated.
- **Status:** ✅ **WORKING** (proxies Polygon.io API).

**GET `/api/market/agg?ticker=C:EURUSD&fromMs=1704067200000&toMs=1704153600000&granularity=minute`**
- **Purpose:** Get aggregated bars for session analysis.
- **Response:**
  ```json
  {
    "data": [
      { "t": 1704067200000, "o": 1.0850, "h": 1.0855, "l": 1.0848, "c": 1.0852, "v": 12345 }
    ]
  }
  ```
- **Validation:** fromMs < toMs, granularity in [minute, hour, day].
- **Permissions:** Authenticated.
- **Status:** ✅ **WORKING**.

**GET `/api/polygon/bars?ticker=C:EURUSD&from=2025-01-01&to=2025-01-07&timeframe=day`**
- **Purpose:** Get multi-timeframe bars (D/W/4H).
- **Response:** Same as `/api/market/agg`.
- **Permissions:** Authenticated.
- **Status:** ✅ **WORKING**.

---

### Forecast Endpoints (TO BE CREATED)

**POST `/api/community/forecasts`**
- **Purpose:** Create new forecast (weekly or daily).
- **Request Body:**
  ```json
  {
    "organization_id": "uuid",
    "type": "weekly",
    "instrument": "XAU/USD",
    "bias": "bearish",
    "narrative": "Gold showing distribution at weekly highs...",
    "key_levels": [
      { "type": "support", "price": "2030.00", "label": "Daily FVG" }
    ],
    "macro_drivers": ["CPI", "Fed Minutes"],
    "htf_chart_url": "https://blob.vercel.sh/xyz.jpg",
    "ltf_chart_url": "https://blob.vercel.sh/abc.jpg",
    "confidence": 75
  }
  ```
- **Response:**
  ```json
  {
    "id": "uuid",
    "status": "active",
    "published_at": "2025-01-06T10:30:00Z"
  }
  ```
- **Validation:**
  - User is mentor (verified_level >= 2).
  - All required fields present.
  - Instrument valid (from `lib/instruments.ts`).
  - key_levels is valid JSONB array.
- **Permissions:** Mentor role required.
- **Status:** ❌ **NOT IMPLEMENTED**.

**GET `/api/community/forecasts?organization_id=uuid&type=weekly&status=active`**
- **Purpose:** Fetch forecasts with filters.
- **Query Params:**
  - `organization_id`: UUID (required).
  - `type`: "weekly" | "daily" (optional).
  - `instrument`: string (optional).
  - `status`: "active" | "in-play" | "watching" (optional).
  - `from`: ISO date (optional).
  - `to`: ISO date (optional).
  - `limit`: number (default 20, max 100).
  - `offset`: number (for pagination).
- **Response:**
  ```json
  {
    "data": [ /* array of forecast objects */ ],
    "total": 45,
    "limit": 20,
    "offset": 0
  }
  ```
- **Permissions:** User must be member of organization.
- **Status:** ⚠️ **PARTIAL** (route exists at `app/api/community/forecasts/route.ts` but returns mock data).

**PATCH `/api/community/forecasts/[id]`**
- **Purpose:** Update existing forecast (status, outcome, etc.).
- **Request Body:**
  ```json
  {
    "status": "in-play",
    "outcome": "played"
  }
  ```
- **Response:** Updated forecast object.
- **Validation:** User is forecast creator or org admin.
- **Permissions:** Mentor who created forecast.
- **Status:** ❌ **NOT IMPLEMENTED**.

**DELETE `/api/community/forecasts/[id]`**
- **Purpose:** Soft-delete forecast (set status = 'archived').
- **Response:** `{ "success": true }`
- **Validation:** User is forecast creator or org admin.
- **Permissions:** Mentor who created forecast.
- **Status:** ❌ **NOT IMPLEMENTED**.

---

### Scenario Endpoints (FUTURE—Currently LocalStorage Only)

**POST `/api/scenarios`**
- **Purpose:** Create new trading scenario (persist to DB instead of localStorage).
- **Request Body:**
  ```json
  {
    "pair": "EURUSD",
    "position": "Buy Position",
    "level": "1.0850",
    "sl": "1.0820",
    "tp": "1.0900",
    "confluences": ["FVG", "Liquidity Sweep"],
    "source": "forecast",
    "forecast_id": "uuid"
  }
  ```
- **Response:** Created scenario object.
- **Permissions:** Authenticated.
- **Status:** ❌ **NOT IMPLEMENTED** (scenarios currently only in `useScenarioStore` localStorage).

**GET `/api/scenarios?user_id=uuid`**
- **Purpose:** Fetch user's scenarios.
- **Response:** Array of scenario objects.
- **Permissions:** Own scenarios only.
- **Status:** ❌ **NOT IMPLEMENTED**.

---

### Community Group Endpoints

**GET `/api/community/groups`**
- **Purpose:** List all groups (public + user's groups).
- **Query Params:** `visibility`, `tags`, `search`.
- **Response:** Array of Group objects with member counts.
- **Permissions:** Public (public groups) + authenticated (private groups user is member of).
- **Status:** ✅ **WORKING**.

**POST `/api/community/groups`**
- **Purpose:** Create new group.
- **Request Body:**
  ```json
  {
    "name": "Elite Traders",
    "description": "Advanced ICT concepts",
    "tags": ["forex", "ICT", "advanced"],
    "visibility": "paid",
    "stripe_price_id": "price_xyz"
  }
  ```
- **Response:** Created group object.
- **Validation:** Name unique, tags array valid.
- **Permissions:** Authenticated (any user can create group).
- **Status:** ✅ **WORKING**.

**GET `/api/community/groups/[slug]`**
- **Purpose:** Get group details.
- **Response:** Group object with member count, current user's role/status.
- **Permissions:** Public if public group; member if private.
- **Status:** ✅ **WORKING**.

**POST `/api/community/groups/[slug]/join`**
- **Purpose:** Join a group (with optional invite code).
- **Request Body:**
  ```json
  {
    "invite_code": "ABC123"
  }
  ```
- **Response:** Membership object.
- **Validation:**
  - If public: immediate join.
  - If paid: requires active subscription (future).
  - If invite-only: requires valid invite_code.
- **Permissions:** Authenticated.
- **Status:** ✅ **WORKING**.

**POST `/api/community/groups/[slug]/checkout`**
- **Purpose:** Create Stripe checkout session for paid group.
- **Request Body:** Empty (group slug determines price).
- **Response:**
  ```json
  {
    "url": "https://checkout.stripe.com/..."
  }
  ```
- **Permissions:** Authenticated.
- **Status:** ⚠️ **PARTIAL** (route exists, not fully tested).

**GET `/api/community/groups/[slug]/members`**
- **Purpose:** List group members.
- **Response:** Array of member objects (user profile + role).
- **Permissions:** Group member.
- **Status:** ✅ **WORKING**.

**POST `/api/community/groups/[slug]/invites`**
- **Purpose:** Create invite code for group.
- **Request Body:**
  ```json
  {
    "role": "member",
    "max_uses": 10,
    "expires_at": "2025-02-01T00:00:00Z"
  }
  ```
- **Response:** Invite object with `invite_code`.
- **Permissions:** Group admin/creator.
- **Status:** ✅ **WORKING**.

---

### Room (War Room) Endpoints

**POST `/api/rooms`**
- **Purpose:** Create temporary war room.
- **Request Body:**
  ```json
  {
    "organization_id": "uuid",
    "name": "short-btc-4h-scalp",
    "ticker": "BTC",
    "bias": "SHORT",
    "expires_at": "2025-01-06T18:00:00Z"
  }
  ```
- **Response:** Created room object.
- **Validation:** User is verified trader (verified_level >= 1).
- **Permissions:** Verified traders only.
- **Status:** ⚠️ **PARTIAL** (route exists but not tested; no UI trigger).

**POST `/api/rooms/[id]/join`**
- **Purpose:** Join existing war room.
- **Request Body:** Empty.
- **Response:** Membership object.
- **Permissions:** Authenticated.
- **Status:** ❌ **NOT IMPLEMENTED**.

**GET `/api/rooms?organization_id=uuid&status=active`**
- **Purpose:** List active war rooms for organization.
- **Response:** Array of room objects with member counts, expiration times.
- **Permissions:** Organization member.
- **Status:** ⚠️ **PARTIAL** (route exists, returns empty array).

---

### Signal Endpoints (TO BE CREATED)

**POST `/api/signals`**
- **Purpose:** Mentor posts new trade signal.
- **Request Body:**
  ```json
  {
    "organization_id": "uuid",
    "asset": "XAU/USD",
    "bias": "LONG",
    "entry": "2034.50",
    "stop": "2030.00",
    "target": "2045.00",
    "notes": "Targeting weekly high after Asia sweep"
  }
  ```
- **Response:** Created signal object with auto-calculated R:R.
- **Validation:** User is mentor.
- **Permissions:** Mentor role.
- **Status:** ❌ **NOT IMPLEMENTED**.

**GET `/api/signals?organization_id=uuid&asset=XAU/USD`**
- **Purpose:** Fetch signals with filters.
- **Response:** Array of signal objects.
- **Permissions:** Organization member.
- **Status:** ❌ **NOT IMPLEMENTED**.

---

### Chat Endpoints (TO BE CREATED)

**POST `/api/rooms/[id]/messages`**
- **Purpose:** Send message to room/channel.
- **Request Body:**
  ```json
  {
    "content": "Looking at 1.0850 for entry on EUR",
    "reply_to": "uuid"
  }
  ```
- **Response:** Created message object.
- **Validation:** User is room member.
- **Permissions:** Room member.
- **Status:** ❌ **NOT IMPLEMENTED** (chat uses mock arrays).

**GET `/api/rooms/[id]/messages?limit=50&before=uuid`**
- **Purpose:** Fetch chat messages (pagination via cursor).
- **Response:** Array of message objects.
- **Permissions:** Room member.
- **Status:** ❌ **NOT IMPLEMENTED**.

---

### Copilot Endpoints

**POST `/api/copilot/chat`**
- **Purpose:** Send message to AI copilot.
- **Request Body:**
  ```json
  {
    "messages": [
      { "role": "user", "content": "Why did you suggest waiting for London open?" }
    ]
  }
  ```
- **Response:** Streaming SSE with AI-generated response.
- **Permissions:** Authenticated.
- **Status:** ⚠️ **PARTIAL** (route exists, returns generic response; not context-aware).

**POST `/api/copilot/notify-mentor`**
- **Purpose:** Send notification to mentor when student needs help.
- **Request Body:**
  ```json
  {
    "scenario_id": "uuid",
    "message": "Stuck on confluence interpretation"
  }
  ```
- **Response:** `{ "success": true }`
- **Permissions:** Authenticated.
- **Status:** ⚠️ **PARTIAL** (route exists, logs to console; no real notification system).

---

### Subscription Endpoints

**POST `/api/subscriptions/checkout`**
- **Purpose:** Create Stripe checkout session.
- **Request Body:**
  ```json
  {
    "plan_id": "uuid",
    "billing_period": "monthly"
  }
  ```
- **Response:**
  ```json
  {
    "url": "https://checkout.stripe.com/..."
  }
  ```
- **Permissions:** Authenticated.
- **Status:** ⚠️ **PARTIAL** (route exists, not fully tested).

**POST `/api/subscriptions/portal`**
- **Purpose:** Redirect to Stripe customer portal (manage subscription).
- **Response:** `{ "url": "https://billing.stripe.com/..." }`
- **Permissions:** Authenticated with active subscription.
- **Status:** ⚠️ **PARTIAL**.

**GET `/api/subscriptions/me`**
- **Purpose:** Get current user's subscriptions.
- **Response:** Array of subscription objects.
- **Permissions:** Authenticated.
- **Status:** ⚠️ **PARTIAL**.

**POST `/api/stripe/webhook`**
- **Purpose:** Handle Stripe webhook events (subscription updated, cancelled, etc.).
- **Request:** Stripe webhook payload (raw body).
- **Response:** `{ "received": true }`
- **Validation:** Stripe signature verification.
- **Permissions:** Stripe webhook secret.
- **Status:** ⚠️ **PARTIAL** (webhook configured but not all events handled).

---

## 8. REAL-TIME + STATE MANAGEMENT

### What Must Be Real-Time

| Feature | Requirement | Latency Target | Implementation Approach |
|---------|-------------|----------------|-------------------------|
| **Chat Messages** | Instant delivery to all room members | <500ms | Supabase Realtime (Postgres LISTEN/NOTIFY) |
| **Live Mentor Stage** | Low-latency video/audio stream | <1s | WebRTC (Daily.co, Agora, or self-hosted) |
| **New Forecast Posted** | Appears in Daily Gameplan instantly | <1s | Supabase Realtime broadcast |
| **War Room Created** | Appears in channel list for all members | <1s | Supabase Realtime broadcast |
| **Confluence Status Updates** | Updates when price crosses threshold | 5-10s | Client-side calculation + WebSocket price feed |
| **Viewer Count (Live Stage)** | Updates as users join/leave | 2-5s | Supabase Realtime Presence |
| **Signal Posted** | Appears in signal feed instantly | <1s | Supabase Realtime broadcast |

**NOT Real-Time (Acceptable Polling/Refresh):**
- Historical forecasts (fetch on page load).
- Weekly Outlook updates (can refresh on manual reload).
- User profile changes (requires page reload).
- Subscription status (checked on route change).

### Real-Time Architecture

**Option 1: Supabase Realtime (RECOMMENDED)**

**Pros:**
- Already using Supabase (no new service).
- Built on Postgres LISTEN/NOTIFY (reliable).
- Supports Broadcast (one-to-many) and Presence (who's online).
- Auto-reconnects on network issues.

**Cons:**
- Not ideal for high-frequency updates (e.g., tick-by-tick prices).
- Limited to Postgres changes (can't broadcast arbitrary events easily).

**Implementation:**
```typescript
// In components/floating-community-hub.tsx
useEffect(() => {
  const channel = supabase
    .channel('community-hub')
    .on('broadcast', { event: 'new_forecast' }, (payload) => {
      // Prepend new forecast to local state
      setDailyForecasts(prev => [payload.new, ...prev])
    })
    .on('broadcast', { event: 'new_signal' }, (payload) => {
      setSignals(prev => [payload.new, ...prev])
    })
    .subscribe()

  return () => { supabase.removeChannel(channel) }
}, [])
```

**Option 2: WebSocket (Custom Server)**

**Pros:**
- Full control over message format and routing.
- Can handle high-frequency updates (price ticks).

**Cons:**
- Requires separate WebSocket server (Node.js + Socket.io or WS library).
- More infrastructure to maintain.
- Need to handle reconnection logic client-side.

**Not Recommended:** Unless adding high-frequency price streaming (which Polygon.io doesn't support at free tier anyway).

---

### Client State Management

**Architecture:** Zustand (lightweight, no boilerplate).

**Stores:**

| Store | Purpose | Persistence | File |
|-------|---------|-------------|------|
| `useInstrument` | Current selected instrument | None | `lib/stores/useInstrument.ts` |
| `useAnalysis` | Market data (snapshot, session OHLC, bars) | None | `lib/stores/useAnalysis.ts` |
| `useScenarioStore` | Trading scenarios | localStorage | `lib/scenario-store.ts` |
| `useConfluenceStore` | Selected confluences, status | localStorage (partial) | `stores/confluence-store.ts` |
| `useSession` | User auth session | None (via Supabase) | `lib/stores/useSession.ts` |
| `copilotStore` | Copilot events, suggestions | None | `lib/stores/copilotStore.ts` |

**Why Zustand?**
- Minimal boilerplate (no actions, reducers, or providers).
- Hook-based (integrates seamlessly with React).
- Built-in persist middleware (localStorage sync).
- Excellent TypeScript support.
- Small bundle size (1.2kb).

**Alternative Considered:** Redux Toolkit (rejected—too much boilerplate for this project).

---

### Optimistic Updates vs Server Truth

**Optimistic Update Use Cases:**
1. **Sending chat message:**
   - Immediately append message to local state.
   - Show "sending..." indicator.
   - If API fails, remove message and show error.
2. **Toggling confluence:**
   - Immediately update local selected confluences array.
   - If save to user profile fails, revert.
3. **Creating scenario:**
   - Immediately add to scenarios list.
   - If POST fails, remove and show error toast.

**Server Truth Use Cases (No Optimistic Update):**
1. **Live price updates:**
   - Always use server data; no prediction.
2. **Forecast status changes:**
   - Wait for server response before showing "in-play" badge.
3. **War room expiration:**
   - Server determines expired status; client respects it.

**Pattern:**
```typescript
// Optimistic update with rollback
const handleSendMessage = async (content: string) => {
  const tempId = `temp-${Date.now()}`
  const optimisticMessage = { id: tempId, content, userId: user.id, createdAt: new Date().toISOString() }
  
  // Optimistically add to UI
  setMessages(prev => [...prev, optimisticMessage])
  
  try {
    const { data } = await fetch('/api/rooms/123/messages', {
      method: 'POST',
      body: JSON.stringify({ content })
    }).then(r => r.json())
    
    // Replace temp message with server version
    setMessages(prev => prev.map(m => m.id === tempId ? data : m))
  } catch (error) {
    // Rollback on failure
    setMessages(prev => prev.filter(m => m.id !== tempId))
    toast.error('Failed to send message')
  }
}
```

---

### State Synchronization Strategy

**Problem:** User has multiple tabs open—how to sync state across tabs?

**Solution 1: Broadcast Channel API**
```typescript
const channel = new BroadcastChannel('archioai-sync')

// In useScenarioStore
const addScenario = (scenario) => {
  // Update local state
  set(state => ({ scenarios: [...state.scenarios, scenario] }))
  
  // Notify other tabs
  channel.postMessage({ type: 'scenario:added', scenario })
}

// Listen for updates from other tabs
channel.onmessage = (event) => {
  if (event.data.type === 'scenario:added') {
    set(state => ({ scenarios: [...state.scenarios, event.data.scenario] }))
  }
}
```

**Solution 2: localStorage Events**
- Zustand persist middleware automatically syncs across tabs (built-in).
- When one tab updates localStorage, other tabs receive `storage` event.

**Current Status:** Scenarios sync across tabs via Zustand persist (built-in). Other stores (instrument, analysis) don't need cross-tab sync (each tab can have independent state).

---

## 9. INTEGRATIONS / EXTERNAL SERVICES

### Market Data: Polygon.io

**Purpose:** Live price data, historical bars, session OHLC.

**Required Keys:**
- `POLYGON_API_KEY` (stored in Vercel env vars).

**API Limits:**
- Free tier: 5 API calls/minute.
- Basic tier ($29/mo): 500 calls/minute.
- Current usage: ~3 calls per instrument change (snapshot + session bars + multi-TF bars).

**Endpoints Used:**
- `GET /v2/aggs/ticker/{ticker}/range/{multiplier}/{timespan}/{from}/{to}` - Aggregated bars.
- `GET /v2/snapshot/locale/global/markets/forex/tickers` - Real-time snapshot.

**Fallback Plan:**
- If Polygon rate limit hit: Cache last fetched price for 30s; show "stale data" warning.
- If Polygon down: Fallback to static mock data (last known prices).

**Implementation:** `lib/providers/polygonRest.ts`, proxied via `/api/polygon/*` routes.

---

### Charting: TradingView Widget

**Purpose:** Embed advanced charting (future feature).

**Current Status:** Placeholder only. TradingView widget not integrated.

**Integration Plan:**
- Use TradingView Advanced Charts Widget (free for non-commercial use).
- Embed via `<iframe>` or TradingView library.
- Pass selected instrument to widget via URL params.

**Required Keys:** None (public widget).

**Limits:** Branding required (TradingView logo); can't remove on free tier.

**Alternative:** Build custom charting with Recharts or Lightweight Charts (lighter weight, more control).

---

### Video/Voice: Daily.co (Proposed)

**Purpose:** Mentor live stage video streaming.

**Why Daily.co?**
- Simple WebRTC API (REST + JavaScript SDK).
- Free tier: 10,000 participant minutes/month.
- Auto-scales (no server management).
- Recording support (future feature).

**Alternatives:**
- **Agora.io** - More features, higher cost.
- **Twitch/YouTube Live** - One-way streaming only (no participant interaction).
- **Self-hosted WebRTC** - Requires TURN/STUN servers, complex.

**Required Keys:**
- `DAILY_API_KEY` (create room programmatically).
- No key needed for joining (room URL is public or password-protected).

**Implementation Plan:**
1. Mentor clicks "Go Live" → POST `/api/live-sessions` → creates Daily.co room.
2. API returns room URL.
3. Mentor joins room via Daily.co JS SDK (embedded iframe or custom UI).
4. Students click "Join Live Stage" → receive room URL → join as participants.
5. Daily.co handles video/audio streaming, screen share, mute/unmute.
6. When mentor ends stream, POST `/api/live-sessions/[id]/end` → deletes Daily.co room.

**Status:** ❌ **NOT STARTED**.

---

### Storage: Vercel Blob

**Purpose:** Store chart screenshots uploaded by mentors.

**Why Vercel Blob?**
- Native Vercel integration (no separate service).
- Simple API (upload/download via SDK).
- Auto-CDN (global edge network).
- Free tier: 1GB storage.

**Required Keys:**
- `BLOB_READ_WRITE_TOKEN` (auto-generated by Vercel).

**Implementation Plan:**
1. Mentor uploads chart image in Mentor Forecast Engine.
2. Client-side: Upload to Vercel Blob via `@vercel/blob` SDK.
3. Blob returns public URL (e.g., `https://blob.vercel.sh/xyz.jpg`).
4. Save URL to `community_forecasts.htf_chart_url`.
5. Daily Gameplan fetches forecast → displays image via `<img src={htf_chart_url || "/placeholder.svg"} />`.

**Alternative:** Supabase Storage (similar but requires Supabase config).

**Status:** ❌ **NOT INTEGRATED** (chart uploads not functional yet).

---

### Payments: Stripe

**Purpose:** Paid group subscriptions, premium plans.

**Required Keys:**
- `STRIPE_SECRET_KEY` (server-side).
- `STRIPE_PUBLISHABLE_KEY` (client-side).
- `STRIPE_WEBHOOK_SECRET` (webhook signature verification).

**Current Status:** ⚠️ **PARTIAL**
- Stripe integrated (webhook route exists).
- Checkout session creation exists (`/api/subscriptions/checkout`, `/api/community/groups/[slug]/checkout`).
- **Missing:** Subscription enforcement (free users can access all features).

**Webhook Events Handled:**
- `checkout.session.completed` - Create subscription record.
- `customer.subscription.updated` - Update subscription status.
- `customer.subscription.deleted` - Cancel subscription.

**Subscription Tiers (Proposed):**
| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 5 scenarios, view forecasts, community access |
| Pro | $29/mo | Unlimited scenarios, AI copilot basic, priority support |
| Live | $99/mo | All Pro + live mentor stage access, advanced analytics |
| Mentor Elite | $299/mo | All Live + create forecasts, publish signals, analytics dashboard |

**Enforcement Plan:**
- Check `subscriptions` table in middleware.
- Block access to premium routes if subscription expired.
- Show "Upgrade" modal when limit reached (e.g., 5 scenarios).

---

### AI/LLM: OpenAI GPT-4 (Future)

**Purpose:** AI copilot suggestions, chat interface.

**Current Status:** ❌ **NOT INTEGRATED**
- Copilot chat route exists but doesn't use AI (returns mock response).
- Event watchers exist but don't generate suggestions.

**Integration Plan:**
1. Use OpenAI SDK in `/api/copilot/chat` route.
2. Pass user's event history as context (last 50 events).
3. System prompt: "You are a trading coach. Analyze user's behavior and suggest improvements."
4. Stream response back to client (SSE).

**Required Keys:**
- `OPENAI_API_KEY`

**Cost Estimate:**
- GPT-4: $0.03 per 1K tokens (input), $0.06 per 1K tokens (output).
- Average chat interaction: ~500 tokens input + 300 tokens output = $0.033 per chat.
- 1000 users, 10 chats/day = $330/day = $10K/month (too expensive).

**Alternative:** GPT-3.5-turbo ($0.002 per 1K tokens) = $660/month (affordable).

**Fallback:** Use rule-based suggestions initially (no LLM); add AI later as premium feature.

---

## 10. MVP SCOPE + PHASED ROADMAP

### Phase 0: Stabilize UI + Routing + Mock Data (CURRENT PHASE)

**Goal:** Polish existing UI, fix bugs, ensure all routes work with mock data.

**Deliverables:**
- ✅ All pages render without errors.
- ✅ Navigation works (no broken links).
- ✅ Instrument selector works (changes instrument across app).
- ✅ Session analysis works (fetches real data from Polygon.io).
- ✅ Community Hub opens/closes smoothly.
- ✅ Daily Gameplan displays with mock forecasts.
- ✅ Mentor Forecast Engine form works (no persistence).
- ⚠️ Fix middleware error (Supabase env check).
- ⚠️ Add loading states to all data fetches.

**Risks:**
- Middleware error blocks deployment (fix immediately).
- Mock data is hardcoded in multiple places (need to consolidate).

**What to Cut:**
- Don't add new features; focus on stability.
- Defer AI copilot logic (keep mock suggestions).

**Timeline:** 1 week.

---

### Phase 1: Forecast Engine + Weekly/Daily + History Minimal

**Goal:** Make forecasts functional—mentors can create, students can view, history is browsable.

**Deliverables:**
1. **Database Tables:**
   - Create `community_forecasts` table (with RLS policies).
   - Create `weekly_outlooks` table.
   - Create `weekly_drivers` table.
   - Create `signals` table.
2. **API Routes:**
   - POST `/api/community/forecasts` (create forecast).
   - GET `/api/community/forecasts` (fetch with filters).
   - PATCH `/api/community/forecasts/[id]` (update status/outcome).
   - POST `/api/signals` (create signal).
   - GET `/api/signals` (fetch signals).
3. **UI Changes:**
   - Mentor Forecast Engine: Connect "Publish" button to API.
   - Daily Gameplan: Fetch forecasts from API instead of mock array.
   - History page: Build timeline view with date filters.
4. **Real-Time:**
   - Add Supabase Realtime subscription in FloatingCommunityHub.
   - Broadcast new forecast events to all clients.
5. **Testing:**
   - Create 10 test forecasts via Mentor Forecast Engine.
   - Verify they appear in Daily Gameplan.
   - Test filters (instrument, status, date range).

**Risks:**
- Chart uploads to Vercel Blob may be slow (add progress bars).
- Realtime subscription might not reconnect after network loss (add reconnection logic).
- Forecast data model may need adjustments after mentor feedback (design for flexibility).

**What to Cut:**
- Daily forecast creation (focus on weekly only for Phase 1).
- Outcome tracking (mark forecasts as played/invalidated—defer to Phase 2).
- Advanced filters (mentor filter, confidence range—add in Phase 2).

**Timeline:** 3-4 weeks.

---

### Phase 2: Community Hub Basic (Chat + Groups + Membership)

**Goal:** Make community functional—users can join groups, chat in channels, see each other.

**Deliverables:**
1. **Database Tables:**
   - Extend `rooms` table with `expires_at` (for war rooms).
   - Create `channel_messages` table (with RLS policies).
2. **API Routes:**
   - POST `/api/rooms` (create war room).
   - POST `/api/rooms/[id]/join` (join war room).
   - GET `/api/rooms` (fetch active war rooms).
   - POST `/api/rooms/[id]/messages` (send message).
   - GET `/api/rooms/[id]/messages` (fetch messages).
3. **UI Changes:**
   - FloatingCommunityHub: Connect "Deploy War Room" modal to API.
   - War Room Chat: Replace mock messages with real fetch + Realtime subscription.
   - Channel List: Show real war rooms from API (not hardcoded).
4. **Real-Time:**
   - Add Realtime subscription for chat messages.
   - Add Realtime subscription for new war rooms.
5. **Cron Job:**
   - Create Supabase Edge Function to auto-expire war rooms (runs every 5 minutes).
   - Checks `rooms` table for `expires_at < NOW()` and sets `status = 'archived'`.
6. **Testing:**
   - Create 3 war rooms from different users.
   - Send 50 chat messages across war rooms.
   - Wait for expiration; verify war rooms disappear from list.

**Risks:**
- Chat message spam (need rate limiting—add later).
- War room expiration cron may miss some rooms (acceptable—runs every 5 min).
- Realtime subscription for messages might lag under high load (test with 100 users).

**What to Cut:**
- Message edit/delete (add in Phase 3).
- Message threading/replies (defer to Phase 3).
- File attachments in chat (defer to Phase 3).

**Timeline:** 4-5 weeks.

---

### Phase 3: Mentor Stage + Advanced Chat

**Goal:** Mentors can go live, students can watch/chat, screen share works.

**Deliverables:**
1. **Video Integration:**
   - Choose streaming service (Daily.co recommended).
   - Create Daily.co account + API key.
2. **Database Tables:**
   - Create `live_sessions` table.
3. **API Routes:**
   - POST `/api/live-sessions` (create session, get Daily.co room URL).
   - POST `/api/live-sessions/[id]/end` (end session).
   - GET `/api/live-sessions/current` (get current live session).
4. **UI Changes:**
   - Mentor Stage: Add "Go Live" button (opens camera/mic permission modal).
   - Embed Daily.co iframe or use Daily.co React SDK.
   - Students: Display video player + live chat sidebar.
5. **Real-Time:**
   - Use Supabase Realtime Presence for viewer count.
6. **Testing:**
   - Mentor goes live, shares screen.
   - 10 students join simultaneously.
   - Verify video quality, chat latency, viewer count accuracy.

**Risks:**
- Daily.co free tier may not be enough (10K participant minutes = ~167 hours).
- If 100 students watch 1-hour mentor stream daily = 100 hours/day = 3000 hours/month = exceeds free tier.
- **Mitigation:** Upgrade to Daily.co paid plan ($99/mo for 100K minutes) or limit live stage to Pro/Live subscribers only.

**What to Cut:**
- Recording live sessions (defer to Phase 4).
- Co-hosting (multiple mentors on stage—defer to Phase 4).

**Timeline:** 3-4 weeks.

---

### Phase 4: AI Copilot Intelligence

**Goal:** Copilot watches user behavior and generates real suggestions (not mock).

**Deliverables:**
1. **Event Capture:**
   - Add event dispatch to all major actions (instrument change, scenario save, order preview, confluence toggle).
   - Post events to `/api/copilot/events` (stores in `copilot_events` table).
2. **Watcher Logic:**
   - Implement `riskWatcher` (detects high-risk patterns like no SL, excessive leverage).
   - Implement `progressWatcher` (detects stalled progress—no trades in 7 days).
   - Implement `copyWatcher` (detects copying mentor setups without modification).
3. **Suggestion Generation:**
   - Watchers query `copilot_events` table for user's last 100 events.
   - Analyze patterns (e.g., 5 order previews but 0 executions = hesitation).
   - Generate `CopilotSuggestion` objects.
   - POST suggestions to Realtime broadcast (or store in `copilot_suggestions` table).
4. **UI Changes:**
   - CopilotRightRail: Fetch real suggestions instead of mock array.
   - Display suggestions with severity color-coding.
   - Add "Dismiss" and "Take Action" buttons.
5. **AI Chat:**
   - Integrate OpenAI GPT-3.5-turbo in `/api/copilot/chat`.
   - System prompt includes last 50 events + current scenario.
   - Stream response back to client.
6. **Testing:**
   - Simulate user behavior (create 20 scenarios, preview 10 orders, execute 2).
   - Verify riskWatcher generates "You're hesitating—review your entry checklist" suggestion.

**Risks:**
- OpenAI API cost (mitigate by rate limiting to 10 chats/day per user).
- Watcher logic may generate false positives (tune thresholds based on beta feedback).
- Event capture may slow down app (use async POST, don't block UI).

**What to Cut:**
- Advanced analytics dashboard (copilot summary of user patterns—defer to Phase 5).
- Psychology profiling (defer to Phase 5).

**Timeline:** 5-6 weeks.

---

## 11. ESTIMATION FRAMEWORK

### Complexity Rating Per Module

| Module | Complexity | Rationale | Dev Weeks |
|--------|------------|-----------|-----------|
| **Instrument Terminal** | M (Medium) | Real-time data fetching, confluence logic | 2-3 |
| **Forecast Engine (UI)** | M | Form handling, chart uploads, validation | 2 |
| **Forecast Engine (Backend)** | L (Large) | Database design, RLS policies, Realtime | 3-4 |
| **Daily Gameplan (UI)** | M | Complex layout, modal, filters | 2 |
| **Community Hub (UI)** | L | Discord-style 3-column layout, animations | 3 |
| **Community Hub (Backend)** | XL | Groups, rooms, memberships, invites, RLS | 5-6 |
| **Chat System** | L | Realtime messages, pagination, attachments | 4 |
| **War Rooms (Lifecycle)** | M | Expiration logic, cron job, status updates | 2 |
| **Mentor Stage (Live Video)** | XL | WebRTC integration, viewer count, recording | 6-7 |
| **AI Copilot (Events)** | M | Event capture, storage, basic watchers | 2-3 |
| **AI Copilot (Intelligence)** | XL | Watcher logic, OpenAI integration, suggestions | 5-6 |
| **History & Archive** | M | Timeline UI, filters, pagination | 2 |
| **Auth & Permissions** | M | RLS policies, role checks, middleware | 2 |
| **Subscriptions (Stripe)** | L | Checkout, webhook handling, enforcement | 3-4 |

**Total Complexity Score:** ~45-55 dev weeks (assuming 1 senior full-stack engineer).

---

### Team Roles Needed

| Role | Responsibilities | Quantity | Timeline |
|------|------------------|----------|----------|
| **Senior Full-Stack Engineer** | Next.js, React, Zustand, Supabase, API design | 1-2 | Full project |
| **Backend Engineer** | Database schema, RLS policies, API routes, cron jobs | 1 | Phases 1-3 |
| **Frontend Engineer** | UI components, animations, responsive design | 1 | Phases 0-2 |
| **DevOps Engineer** | Vercel deployment, Supabase config, monitoring | 0.5 (part-time) | All phases |
| **Product Designer** | UX flows, wireframes, design system | 0.5 (part-time) | Phases 0-1 |
| **QA/Tester** | Manual testing, bug reporting | 0.5 (part-time) | Phases 1-4 |

**Recommended Team:** 2 senior full-stack engineers + 1 part-time DevOps + 1 part-time designer = 3.5 FTE.

---

### Rough Dev Weeks Per Phase

| Phase | Duration (Weeks) | Team Size | Effort (Person-Weeks) |
|-------|------------------|-----------|------------------------|
| Phase 0 (Stabilization) | 1 | 2 | 2 |
| Phase 1 (Forecasts) | 4 | 2 | 8 |
| Phase 2 (Community) | 5 | 2.5 (add backend help) | 12.5 |
| Phase 3 (Mentor Stage) | 4 | 2 | 8 |
| Phase 4 (AI Copilot) | 6 | 2 | 12 |
| **Total** | **20 weeks** | | **42.5 person-weeks** |

**Calendar Time:** ~5 months with 2-person team.

**With 3-person team:** ~4 months (parallelizing frontend/backend work).

---

## 12. UNKNOWN / QUESTIONS FOR OWNER

### Trading Logic Assumptions

1. **Confluence Detection:** Currently status updates use `Math.random()`. Do you have specific algorithms for detecting FVG, liquidity sweeps, order blocks from bar data? If yes, what are the formulas?

2. **HTF Structure:** How do you define "bullish structure" programmatically? Is it simply HH/HL on daily/weekly, or more complex (break of structure, change of character)?

3. **Session Timing:** Asia (00:00-09:00 EST), London (03:00-12:00 EST), NY (08:00-17:00 EST)—are these ranges fixed or does DST matter?

4. **Liquidity Pools:** How do you identify equal highs/lows? Is it "within X pips" tolerance or exact price match?

5. **BPR Calculation:** Currently using (High + Low) / 2 for midpoint. Do you ever use 50% Fibonacci retracement instead?

6. **R:R Calculation:** Currently (TP - Entry) / (Entry - SL) for long. Correct? Should we account for spread/commission in calculation?

7. **AI Confidence Score:** How should this be calculated? Is it based on number of confluences present, mentor's track record, or algo-based backtesting?

8. **Multi-Timeframe Analysis:** When showing D/W/4H bars, how far back should we fetch? 30 days? 90 days? Infinite scroll?

9. **Scenario Probability:** "High/Medium/Low Probability"—is this mentor's subjective assessment or calculated from confluence weight sum?

10. **Price Decimals:** Forex uses 5 decimals (pipettes), indices 2 decimals. Are there exceptions (e.g., JPY pairs use 3 decimals)?

---

### Permissions & Access Control

11. **Mentor Verification:** How does a user become a mentor (verified_level = 2)? Admin approval only, or can users self-upgrade with proof of credentials?

12. **Verified Traders:** `verified_level = 1` unlocks what features? Creating war rooms? Anything else?

13. **Free vs Pro Limits:** Current proposal: Free = 5 scenarios. Is this per month or total active scenarios at once?

14. **Group Ownership Transfer:** If a group owner leaves, who becomes the new owner? Oldest admin member?

15. **Banned Users:** Can banned users still view public forecasts, or should they lose all access to the platform?

16. **Invite Code Expiration:** If invite code expires, what happens to pending memberships? Auto-reject or require new invite?

17. **Role Hierarchy:** admin > creator > moderator > member. Can a moderator promote another member to moderator, or only admins?

18. **Read-Only Rooms:** Should we support read-only channels (e.g., #announcements) where only mentors can post?

19. **Private Forecasts:** Can mentors create forecasts visible only to specific groups (e.g., paid VIP group)?

20. **Multi-Organization Membership:** Can a user be a member of multiple organizations simultaneously? If yes, how do we switch active org in UI?

---

### Data Retention & Privacy

21. **Message Retention:** How long should chat messages be stored? Forever, 90 days, or user-configurable?

22. **Forecast Archival:** After a forecast is marked "expired" or "played", when should it be soft-deleted or moved to cold storage?

23. **Copilot Event Retention:** Currently proposing 90-day auto-delete. Is this acceptable, or should power users have longer history?

24. **Trade History:** If/when we integrate broker API, should we store all trades forever, or only last 12 months?

25. **User Data Export (GDPR):** Should users be able to export all their data (forecasts, scenarios, messages) in JSON format?

26. **Right to Deletion:** If user deletes account, should we hard-delete all their data, or soft-delete and anonymize forecasts/messages?

27. **Mentor Forecast Deletion:** If a mentor leaves and deletes their account, should their published forecasts remain (attributed to "Former Mentor") or be deleted?

28. **Attachment Expiration:** Chart screenshots in Vercel Blob—should they expire after forecast is archived (e.g., 6 months)?

29. **Analytics Tracking:** Do you want to track user behavior (page views, time on page) for analytics? If yes, which tool (Vercel Analytics, Posthog, Mixpanel)?

30. **Error Logging:** Should we integrate Sentry or similar for error tracking, or rely on Vercel logs?

---

### Mentor Capabilities

31. **Forecast Edit After Publish:** Can mentors edit forecasts after publishing (e.g., update key levels if price moves), or are they immutable?

32. **Forecast Templates:** Should mentors be able to save forecast templates (e.g., "Gold Bearish Template") to speed up weekly forecast creation?

33. **Bulk Forecast Creation:** Should mentors be able to create multiple forecasts at once (e.g., upload CSV with 10 instruments' weekly bias)?

34. **Signal Automation:** Can mentors set up automated signals (e.g., "Alert me when XAU/USD hits 2045 and post signal")?

35. **Mentor Analytics:** Should mentors see their forecast accuracy stats (win rate, avg R:R hit), and if so, displayed where?

36. **Co-Authoring Forecasts:** Can two mentors collaborate on a single weekly forecast, or is it always single-author?

37. **Forecast Versioning:** If a mentor updates a forecast, should we track version history (v1, v2, v3) with change log?

38. **Mentor Payouts:** If a mentor runs a paid group, how do they get paid? Stripe Connect (auto payout), or manual invoicing?

39. **Mentor Review System:** Should students be able to rate mentors (5-star system), and does this affect mentor visibility in directory?

40. **Mentor Broadcasting Limits:** Free tier mentors: max 1 live session/week? Paid mentors: unlimited?

---

### Community Rules & Moderation

41. **Message Moderation:** Do you want auto-moderation (profanity filter, spam detection) or manual moderation only?

42. **Report System:** Should users be able to report messages/forecasts for abuse? If yes, who reviews reports (admins, moderators)?

43. **Mute/Block Users:** Can users mute/block other users in chat? Does this sync across all channels in an organization?

44. **Rate Limiting:** How many messages per minute should users be allowed to send (to prevent spam)?

45. **War Room Member Limit:** Should war rooms have a max member count (e.g., 50 members), or unlimited?

46. **War Room Creation Limit:** Should verified traders have a limit on active war rooms (e.g., max 3 active at once)?

47. **Channel Pinning:** Can admins pin important messages or forecasts to top of channel? If yes, max how many pins?

48. **User Nicknames:** Can users set custom nicknames per organization (e.g., "TraderX" in one group, "CryptoKing" in another)?

49. **Emojis/Reactions:** Should chat messages support emoji reactions (like Discord), or text-only?

50. **Link Preview:** Should chat messages auto-generate link previews (e.g., Twitter link shows tweet preview)?

---

### Mobile & Responsiveness

51. **Mobile App:** Phase 0-4 are web-only. When should mobile apps (iOS/Android) be built? Phase 5?

52. **Mobile Web Priority:** Should mobile web (<768px) be fully functional, or is desktop-first acceptable for beta?

53. **Tablet Support:** Should tablet (768-1024px) have a dedicated layout, or reuse desktop layout?

54. **PWA (Progressive Web App):** Should we build as PWA (installable on mobile home screen), or native app required?

55. **Offline Mode:** Should users be able to view cached forecasts/scenarios offline, or require internet always?

56. **Touch Gestures:** On mobile, should we support swipe gestures (e.g., swipe right to open community hub)?

57. **Mobile Chart Annotations:** Chart annotation toolbar in Mentor Forecast Engine—is this feasible on mobile (small screen)?

58. **Mobile Video Quality:** For live mentor stage on mobile, should we auto-reduce video quality to save bandwidth?

59. **Push Notifications:** Should mobile users receive push notifications for new forecasts/signals? If yes, via OneSignal, Firebase, or native?

60. **Responsive Tables:** Key levels grid, session OHLC—these are tables. Should they scroll horizontally on mobile or reformat as cards?

---

### Integrations & External Services

61. **TradingView Charts:** Do you want full TradingView charting (with drawing tools), or is price ticker + basic line chart enough for MVP?

62. **Broker Integration:** Which broker(s) should we integrate first (if any)? MetaTrader 4/5, Interactive Brokers, Alpaca?

63. **Broker Permissions:** Should broker integration be read-only (view positions) or read-write (place orders)?

64. **Copy Trading:** If we add "Copy Trade" button on signals, should it auto-execute on user's broker account, or just prefill order form?

65. **Email Notifications:** Should users receive email notifications for new forecasts, or in-app only?

66. **SMS Alerts:** Should premium users be able to set up SMS alerts for signals? If yes, via Twilio?

67. **Calendar Integration:** Should users be able to sync macro events to Google Calendar/Outlook?

68. **Zapier Integration:** Should we build Zapier integration (e.g., "New forecast posted → Slack notification")?

69. **API for Third-Party Devs:** Should we expose public API for community-built tools (read-only initially)?

70. **White-Label:** Is white-labeling a future feature (e.g., other trading educators can rebrand and sell your platform)?

---

**END OF DOCUMENT**

---

**Summary:** This is a comprehensive 20,000+ word breakdown covering every aspect of the ArchioAI trading terminal. Use this as a master reference for development planning, team onboarding, and investor/stakeholder communication.
