# D1 · Legacy `/` Experience — Feature System Audit

**Status:** TRUTH-GATHERING ONLY · no code changed · no routes changed · no DL decision · not governance
**Date:** 27 Sep 2026 · **Branch:** `visual-dna-extraction` · **Requested by:** Luke (founder brief)
**Scope:** everything reachable from the current `/` route (`app/(main)/page.tsx`) plus the second surface where the same consoles are mounted (the auth-page "layer preview").

Reality labels used below:
`REAL` wired to live data/persistence · `PARTIAL` real logic over fake or partial inputs · `STATIC` hardcoded content that does not change · `MOCK` fabricated data presented as live · `VISUAL-ONLY` animation/decoration with no function · `DEAD` code present but unreachable / gated off / emits into nothing.

---

## 1. OLD `/` EXPERIENCE MAP

```
/  app/(main)/page.tsx  →  <LiveMarketIntelligence />  +  <InstrumentBridge /> (dev-only bridge)
│  wrapped by app/(main)/layout.tsx: CopilotProvider · CommunityHubGate · CommandLayer · Toaster
│
├─ LEFT COLUMN · "Navigator"  (lib/stores/useNavigatorConfig — localStorage navigator_config / navigator_gadgets)
│   ├─ Time & Session      → MarketStateInstrument        REAL clock (UTC session + weekday phase)
│   ├─ Forex / Indices / Crypto / Commodities → instrument pickers (lib/instruments) → TradingViewWidget
│   ├─ Analyze             → InlineChartAnalysis · PremiumChartAnalysisModal · AnalysisHistoryModal
│   │                        (lib/stores/useAnalysis → /api/polygon/bars|snapshot, /api/market/agg)
│   └─ Customize panel     → tabs Sections (toggle · rename · drag-reorder · reset) / Gadgets (8 toggles) / Appearance
│                             — gadget toggles persist but NO gadget component exists anywhere → toggles are inert
│
├─ CENTRE · TradingViewWidget + FloatingConfluencePanel  (stores/confluence-store, persisted "confluence-store")
│
├─ RIGHT · CopilotRightRail — auto-hide "DECISION PIPELINE" rail, 6 phases shown as 1/6 … 6/6
│   1  OBSERVE  Live Feed         → CopilotActivityConsole   (via CopilotAnalytics switch)
│   │     ├─ button bar: System Guide · Tutorial · Live Demo · [SIMULATION / EXIT when overrides active]
│   │     ├─ Demo controls overlay: DAY (Sun–Sat) · SESSION (8) · PROGRESS (6 stops) · STATE (4)
│   │     ├─ ActivityCommandCenter sections: Session Field (carousel of 8 sessions) → Session Identity →
│   │     │   Day Intelligence banner → Session Intelligence Organism (killzone phase blocks) →
│   │     │   Behavioral Trap System (Strategy traps | Psychology traps) → "Analyze Charts" CTA (DEAD) →
│   │     │   inline directive strip → Primary Threat → Next Action (STOP / SLOW DOWN / CLEAR + 3-step Check-in Protocol)
│   │     └─ Self-reflection Q&A chat (prompt categories SYSTEM INTELLIGENCE / PRE-DECISION / RISK AUDIT / session
│   │         context → POST /api/copilot/chat) — whole panel wrapped in `{false && …}` → DEAD
│   2  PLAN     Strategy OS       → StrategyAnalytics
│   │     DisciplineRing · WeeklyMirrorTimeline (intent vs action) · RuleCards + RulePicker (ALL_AVAILABLE_RULES) ·
│   │     ExposureGravityField (currency concentration) · ExecutionDNA (entry-type mix) · "Ask" buttons
│   3  CHECK    Psychology        → PsychologyAnalytics
│   │     StageRail SCAN → DIAGNOSE → UNDERSTAND → ACT → TRACK ·
│   │     BrainVisualization (hemispheres/zones) · AlertStrip · NeuralInterconnectionSystem · Cause-Effect Chains ·
│   │     Cross-Layer Impact · Emotional Topology · Personality Profile · Cognitive Biases · Emotion Timeline ·
│   │     Emotional Journal · Recovery Protocol · Cooldown Control (10-min timer) · Score Evolution ·
│   │     Neural Feedback Loop (emotion ↔ PnL) · InterventionVerdict (STOP / … by score)
│   4  ANALYZE  AI Copilot        → CopilotAIView
│   │     IntelligenceGateway (boot pipeline INGEST→NORMALIZE→PATTERN MATCH→CORRELATE→CLASSIFY→SCORE, "AI Calibration" step,
│   │     4 fixed readiness bars) → IntelligenceBoard · Home: Signals | Modes · Threads (chat) with local scripted replies
│   5  FOLLOW   Mentor Dashboard  → MentorDashboardRail (templateId "jadecap-ict-ny" — the only template)
│   │     MentorIdentityHeader · SessionGate · DayFilterStrip · BiasContext · EntryModelCards (conditions MET/PENDING/FAILED) ·
│   │     RiskGuidanceBar · WarRoomLauncher · MethodVault · MentorAIChat ("JadeCap AI Agent") · DEMO toggle (default ON)
│   6  DECIDE   Edge Tracker      → EdgeAnalytics
│   │     EdgeScoreRing (HIGH ≥80 / MODERATE ≥60 / LOW) · 4 PillarScores (strategy · psychology · market · ai) ·
│   │     8 FactorRows · 3 PlaybookCards · 5 SessionRows (decision history)
│   ├─ Positions strip: MOCK_POSITIONS + user scenarios (lib/scenario-store, persisted) → UserScenarioCard / ScenarioEditModal
│   ├─ footer stamp: "CORTEX" (or "MENTOR OS" on tab 5)
│   └─ ⚙ "Configure Profile" (bottom of rail) → SYSTEM CALIBRATION = OnboardingShell, 5 phases, overlays the rail
│
├─ EXECUTE mode (activeSection "execute") → TradeExecutionPanel replaces the rail (5 hardcoded broker accounts)
└─ BELOW THE FOLD · "Analysis + Journal" → InlineChartAnalysis + TradeJournalDashboard (hardcoded TRADES[], widget grid of 8)
```

**Second mount surface (not `/`):** `/login`, `/register`-adjacent, `/forgot-password`, `/reset-password` render `EntryThreshold → AccessArchitecturePreview → LayerDetailModal`, which mounts the SAME consoles under **older layer names**: Activity Intelligence · Strategy Operating System · Psychology Mapping · Secure Environment · Mentor Intelligence · AI Copilot. "Secure Environment" wraps `CopilotSecureConsole` (fake security metrics: AES-256, 2FA Enforced, 0 threats…) and ALSO mounts `OnboardingShell` (System Calibration).

**Not mounted anywhere (orphans in `components/copilot/`, 38k lines total):** `EnhancedCopilotRightRail`, `OptimizedCopilotRightRail`, `CopilotChatPanel`, `ActivityNotifications`, `CopilotFAB`, `CopilotDrawer`, `CopilotSplit`, `PsychologyCenter`, `StrategyWizard`, `PersonaSimulator`, `OrderLayerPanel`, `ActivityAnalytics`, `tabs/ActivityTab`. `SocialFeed` is mounted only inside `/copilot` (Execution Copilot). `CoachQna` only via `CoachButtons` (itself unmounted).

---

## 2. FEATURE INVENTORY TABLE

| Feature | User job (as the product states it) | Reality | Inputs (what code actually reads) | Outputs | Universal / Personal | Implied journey stage |
|---|---|---|---|---|---|---|
| Navigator (left column) | Pick market/instrument, keep session time in view | REAL (config persisted) | localStorage config; lib/instruments | Instrument selection, TradingView chart | Universal | during trading |
| Navigator Gadgets | Add spread/pip/news/correlation/… widgets | DEAD (toggles persist, nothing renders) | — | — | Universal | configuration |
| Market State Instrument | Know current session + weekday phase | REAL | system clock | session name, phase, day | Universal | before/during |
| Chart Analysis (Analyze) | AI read of the chart + history | PARTIAL (Polygon data path exists; analysis UI not audited deeper) | pair, timeframe, Polygon bars/snapshot | analysis panels, history modal | Universal → personal only if history is per-user (no auth seen) | during |
| Confluence Panel | Tick confluences for the setup | REAL (persisted locally) | user ticks | selected confluence list (feeds Live Feed prompts) | Personal (declared) | before trading |
| **Live Feed** (Activity) | "What is happening right now?" — situational awareness, directive | PARTIAL | real clock → session/killzone/day; sessionOHLC from useAnalysis; confluences; **hardcoded** strategy + psychology inputs (`buildOrderLayerInputs`) | session phases, day quality, traps, Primary Threat, directive STOP/SLOW/CLEAR, readiness 0–100, check-in protocol | Mixed — time parts universal; "your" threat/readiness are fake-personal | before + during |
| System Guide | Learn what each Live Feed section means | STATIC overlay | none | 7 explanatory sections, hover previews | Universal | first visit / learning |
| Tutorial | Step-by-step walkthrough of the Live Feed | STATIC stepper (8 steps) | none; ends in "Start demo" | same 7 sections as Guide + intro, hands off to Live Demo | Universal | first visit / learning |
| Live Demo | See the Live Feed "in action" | MOCK preset (one click = Tue · London KZ · 35%) + Demo controls | override choices | re-renders Live Feed under simulated time/state; SIMULATION badge | Universal | first visit / demo |
| Self-reflection Q&A chat | Answer hard questions, get feedback | DEAD (`{false && …}`) → would call keyword-scripted `/api/copilot/chat` | question + answer text, order-layer context | canned markdown | Personal in intent | before trading |
| **Strategy OS** | "What is my plan?" — discipline, rules, exposure, execution style | MOCK + PARTIAL | `sampleSnapshot.strategy` (hardcoded in CopilotAnalytics) + `DEMO_RULES`; `profileRules` prop exists but is never passed | discipline score/grade, weekly adherence, intent-vs-action gap, rule cards w/ violation logs & teaching, currency exposure, entry mix | Personal by design; today 100% fake-personal | before trading / after (review) |
| **Psychology** | "Am I in the right state?" | MOCK (+ `Math.random()` journal/timeline) | `sampleSnapshot.psychology` (hardcoded) | stability index, alerts, cause-effect chains, biases, personality traits, emotional journal, recovery protocol, cooldown timer, verdict | Personal by design; today fake-personal | before / after / ongoing |
| **AI Copilot** (old tab) | "What does the machine see?" — neutral analysis, chat | MOCK / VISUAL-ONLY | thread text | scripted `generateResponse()` replies; fixed readiness bars (94/87/72/91) | Universal text | during / before |
| **Mentor Dashboard** | "What does my mentor's method say?" — execution guidance | PARTIAL (real time-gating over a STATIC template; DEMO default ON) | clock vs template hours; template day rules, bias, models, risk, persona | session gate, day validity, bias card, entry-model condition states, risk guidance, war room, method vault, scripted mentor chat | Mentor-specific content; not personalised to the user | during (killzone) + learning |
| **Edge Tracker** | "Do I have a real edge right now?" — convergence gate | MOCK (`sin(tick)` jitter) | none | weighted edge score, 4 pillars, 8 factors, 3 playbooks (win-rates), decision history | Personal by design; today fake | immediately before execution |
| **System Calibration** | Configure identity / strategy / risk / psychology / rules | REAL local persistence, **no consumer** | 39 questions (see §3.I) | zustand `coach.profile.v1` in localStorage; progress 0–100% | Personal (declared) | setup / onboarding |
| Positions strip + Scenarios | Track open positions & planned scenarios | MOCK positions + REAL persisted scenarios | scenario-store | dots, cards, edit modal | Personal | during |
| Execute mode (TradeExecutionPanel) | Place the trade across broker accounts | MOCK (5 hardcoded brokers, no API) | UI inputs | order ticket UI | Personal by design | during (execution) |
| Trade Journal (below fold) | Review trades, equity, calendar, streaks | MOCK (`TRADES[]` hardcoded) | none | 8 widgets: cockpit, equity, calendar, sessions, trades, progress, drawdown, streak | Personal by design | after trading |
| CopilotProvider watchers | Background nudges (no SL, weak R:R, progress, copy) | PARTIAL plumbing, **no UI outlet** | `copilotBus` events (only `instrument:selected` is emitted from `/`) | `useCopilotStore` suggestions (read only by unmounted FAB/Drawer) | Personal | during |
| Secure Environment (auth surface) | Trust: "your data is protected" | VISUAL-ONLY (fake metrics) | none | static security readouts | Universal | first visit |

---

## 3. DEEP DIVE

### 3.A System Guide
- **Names:** UI "System Guide" · `ActivityGuideOverlay` in `components/copilot/activity/ActivityGuideAndDemo.tsx` · no route. Sibling guides exist per console (`StrategyGuideAndTutorial`, `PsychologyGuideAndTutorial`, `AIGuideAndTutorial`, `MentorGuideAndTutorial`, `SecureGuideAndTutorial`) but those are only reachable through the auth-page `LayerDetailModal` consoles, not from `/`.
- **Stated purpose:** explain the Live Feed's 7 sections (Session Identity, Phase Timeline, Day Intelligence, Focus Now, Behavioral Traps, Primary Threat, Next Action), grouped TIME-DRIVEN (4) / DAY-DRIVEN (1) / STATE-DRIVEN (2). Each section has "what to try" actions and element-by-element descriptions.
- **Reality:** STATIC. Accordion overlay with hover previews (`LivePreview*` mini components). Does not read the screen state; does not know which section the user is looking at. No persistence.
- **Teaches:** the meaning of the Live Feed only. **Sends user:** nowhere (close). **Interactive:** expand/hover only. **Personalised:** no.

### 3.B Tutorial
- **Names:** UI "Tutorial" · `ActivityTutorialOverlay` (same file) · steps 0 Intro + 1–7 = `GUIDE_SECTIONS[0-6]` (comment line 1442).
- **Reality:** STATIC stepper over the same content as the Guide, framed as "interactive"; last step offers `onStartDemo` → applies the Live Demo preset. No progress persistence (`useState` only; no localStorage/fetch in the activity dir).
- **Verdict on the special question:** Guide and Tutorial are **the same content in two containers** (accordion vs stepper). Live Demo is a different job (state simulation). Neither can read the current screen; neither overlaps Ask Archio's *runtime* guide role beyond being static help text.

### 3.C Live Demo
- **Names:** UI "Live Demo" + "SIMULATION / EXIT" badge · `DemoControlsOverlay` + `DemoOverrides` type · also `student-collaboration-hub.tsx` uses the phrase (different feature, not on `/`).
- **Reality:** MOCK preset: one click sets `dayOverride: 2 (Tuesday, PRIME)`, `sessionOverride: "london"`, `progressOverride: 0.35`. The Demo controls overlay lets the user pick any DAY (Sun–Sat with quality labels NO TRADE / CAUTION / PRIME / KEY DAY / SELECTIVE / AVOID), SESSION (8), PROGRESS (5/17/35/55/75/92%) and STATE (CRITICAL / REACTIVE / GUARDED / STABLE). Overrides feed `buildOverriddenSession` and swap the psychology/strategy inputs for the chosen state, then re-run `deriveOrderLayerState`.
- **Value observed:** it is the only way to see every Live Feed state without waiting for real market hours. It is a **state simulator for the Live Feed**, not a product demo of ARCHIO.

### 3.D Strategy OS
- **Names:** UI "Strategy OS" (rail, phase 2 PLAN) · `StrategyAnalytics` (`components/copilot/analytics/StrategyAnalytics.tsx`, 2.8k lines) · wrapper `CopilotStrategyConsole` + `StrategyGuideAndTutorial` (auth surface only) · older alias "Strategy Operating System" (auth layer `strategy-os`) · a **separate** Flight Deck module `components/dashboard/vantary/strategy-os/*` whose files say they "mirror" this component **in comments only — there is no code import** (`data.ts`, `derive.ts`, `mirror.tsx`).
- **Stated purpose (rail copy):** confluence scoring, entry/exit rules, execution checklists, scenario mapping — "define WHAT you are looking for before you look".
- **What it actually renders:** a **discipline mirror**, not a plan builder: `DisciplineRing` (overall discipline + risk grade A–D), `WeeklyMirrorTimeline` (7-day adherence vs `intended = 85` constant), `RuleCard`s (each `RuleCommitment` = rule, category entry/exit/risk/session/mindset, adherence %, violations, streak/best streak, weekly history, teaching, impactWhenFollowed / impactWhenBroken, violation log) + `RulePicker` from `ALL_AVAILABLE_RULES`, `ExposureGravityField` (currency concentration from instrument counts), `ExecutionDNA` (market/limit/stop mix → "HYBRID" etc.). Every "Ask" button emits `copilot:chat:ask` / `copilot:ask` — **no listener is mounted** (§3.F).
- **Reality:** MOCK data + PARTIAL logic. `deriveStrategicMirror()` is real arithmetic (limit ratio → entry quality; HTF timeframe weight → structure depth; symbol slicing → dominant currency) but its inputs are the hardcoded `sampleSnapshot.strategy` from `CopilotAnalytics` (set on a 1-second `setTimeout` to "simulate loading") and `DEMO_RULES`. Rules added/removed in the picker live in component state only. `profileRules` prop would accept calibration rules but **is never passed**.
- **Inputs it wants:** trades (entry types, timeframes, instruments), user rules, adherence events. **Outputs:** scores, grade, gap, rule cards, exposure map, execution identity.

### 3.E Psychology
- **Names:** UI "Psychology" (phase 3 CHECK) · `PsychologyAnalytics` (3.7k lines) · wrapper `CopilotPsychologyConsole` · alias "Psychology Mapping" (auth layer) · unmounted sibling `PsychologyCenter` (reads calibration profile, never mounted).
- **Stated purpose:** emotional state tracking, bias detection, discipline scoring, fatigue, tilt warnings; "red = sit out".
- **Renders:** 5-stage rail SCAN → DIAGNOSE → UNDERSTAND → ACT → TRACK. `deriveBehavior()` turns `PsychologyData` into a `BehavioralState` (stability index/level stable|elevated|reactive, drawdown response aggressive|defensive|detached, decision latency, revenge/cut-winners/size-escalation/overtrading risks, active alerts, brain zones per hemisphere, emotion chapters, cause-effect chains, cross-layer impacts, emotion topology, personality traits, cognitive biases, journal entries, score evolution, emotion↔PnL correlations). UI blocks: brain visualisation, alert strip, neural graph, cards for each of the above, `CooldownControl` (10-minute local timer, "Start 10m Cooldown"), `InterventionVerdict` (score ≥50 → STOP TRADING …).
- **Reality:** MOCK. Input is `sampleSnapshot.psychology` (9 mood checks, FOMO 3, Overtrading 2 …). Timeline, journal entries and score history are **synthesised with `Math.random()`** on every derive. No persistence, no backend, no emotion input UI on `/` (the calibration's psychology answers are never read here).

### 3.F AI Copilot — every use of the word "Copilot"
Five distinct things share the name:
1. **Old `/` "AI Copilot" tab** — `CopilotAIView` (1.3k lines) + `IntelligenceGateway` (boot animation: mode selector → "AI Calibration" → boot → session active; fixed bars Psychology 94 / Discipline 87 / Strategy 72 / Risk 91) + `IntelligenceBoard` (not audited in depth). Chat threads answer from a **local `generateResponse(msg, threadType)`** string function with a 1.2–2s fake delay. **No network call.** Reality: MOCK / VISUAL-ONLY.
2. **`/api/copilot/chat`** (102 lines) — keyword router (`recap|summarize|confluence`, `checklist`, `next session`, note, reminder, fallback) returning canned markdown with session name + pair note; **no LLM, no auth, no persistence**. Only caller is the DEAD Live Feed chat.
3. **`CopilotProvider`** (mounted in `app/(main)/layout.tsx`) — registers actions (`apply-copy-risk-caps`, `notify-mentor` → `/api/copilot/notify-mentor` which writes to Supabase with the service-role key and a hardcoded `userId: "currentUser"`) and starts `initCopilotWatchers(copilotBus)`: `riskWatcher` ("No Stop Loss", "Weak risk–reward < 1.3R"), `progressWatcher`, `copyWatcher` → `useCopilotStore.addSuggestion`. Suggestions are read **only** by `CopilotFAB`/`CopilotDrawer`, which are **not mounted**. `/` emits only `instrument:selected` on the bus. Reality: PARTIAL plumbing with no outlet.
4. **`/copilot` route = "Execution Copilot"** (`ExecutionCopilotLayout`) — the current Work-zone destination; `/register` pushes here (DL-027 notes this is not final); Command Desk / action-paths / relevance-stream all route to it. Separate codebase from items 1–3.
5. **Flight Deck `ai-copilot` side-slot module** (`trading-desk/modules/registry.ts` id `ai-copilot`: READ · CONFIDENCE · ACTION · LATENCY · MODEL) — a registry **spec** for a future live model read; and `strategy-os/rules.tsx` has an "ASK COPILOT" label.
Also: `lib/copilot/activityApi.ts` + `lib/copilot/suggest.ts` (`pushSuggestion`) — consumed only by unmounted `tabs/ActivityTab`.
**Finding:** these are **different layers sharing a name**, built at different times; none of them is one wired product. Items 1 and 2 are scripted; item 3 is real event plumbing with no UI; item 4 is a separate live surface; item 5 is a design target.

### 3.G Mentor Dashboard
- **Names:** UI "Mentor Dashboard" (phase 5 FOLLOW; footer stamp "MENTOR OS") · `MentorDashboardRail` + `components/mentor/*` · `lib/mentor/{types,engine,useMentorDashboard}.ts` · one template `lib/mentor/templates/jadecap-ict-ny.ts` ("ICT NY Session Method") · alias "Mentor Intelligence" (auth layer) · "Mentor Dashboard Tools" is a *different* concept (a communities discovery dimension, `discovery-dimensions.ts`, and `header.tsx`).
- **Data model (real, typed):** `MentorTemplate` = session window (preSessionStart / killzoneStart / killzoneEnd / extendedEnd), `DayRule[]`, `NewsEvent[]` (severity, impact BLOCKING/CAUTION/IGNORE), `MarketBias` (direction, confidence), `EntryModel[]` (conditions with status MET/PENDING/FAILED, `ModelEducation` steps with media, `winRate`, `sampleSize`), `RiskGuidance`, `WarRoom` (FORMING→ACTIVE→EXECUTED→REVIEW→CLOSED), `MentorAIPersona` (coreBeliefs, patience, refusalPattern…), `MethodVaultEntry[]`.
- **Sourcing:** everything is **static in the template** (bias BEARISH 72, OB Sweep win-rate/sampleSize 147, day rules, risk guidance, persona). `engine.computeDashboardState(template, now, demoMode)` adds real logic: session phase from UTC hour vs template hours; day validity from `dayRules`; entry-model conditions whose label contains "killzone"/"session" flip MET/PENDING by time, "htf"/"bias" are always MET, all others stay as authored; model state INACTIVE/FORMING/TRIGGERED derived from that. **`demoMode` defaults to `true`** and fakes a time inside the killzone. Recomputed every 30s.
- **MentorAIChat:** scripted `generateMentorResponse()` from persona fields; random `coreBelief` picks. No network.
- **Mentor-created data model:** the TypeScript shape exists; **no authoring UI, no storage, no fetch, no per-mentor account**. JadeCap is fully hardcoded demo content.
- **What it combines:** live-execution gating (session/day/conditions), education (`ModelEducation` steps + media), strategy intelligence (bias, models, risk), community/live-call adjacency (war room), and an AI persona — five concepts in one rail.

### 3.H Edge Tracker
- **Names:** UI "Edge Tracker" (phase 6 DECIDE) · `EdgeAnalytics` (`components/copilot/analytics/EdgeAnalytics.tsx`, 525 lines) · the only file in the repo carrying the name.
- **How scores are calculated today:** `useEdgeData()` ticks every 4s; each of 8 factors is `jitter(base, range) = base + sin(tick·0.7 + base)·range` around **hardcoded bases** (Setup Confluence 82 w0.30 · Rule Adherence 91 w0.15 · Emotional State 68 w0.20 · Decision Quality 75 w0.10 · Session Alignment 88 w0.10 · Volatility Regime 72 w0.05 · Pattern Recognition 85 w0.05 · Risk Assessment 79 w0.05). `weightedScore = Σ score·weight`. Factor `status` (aligned/neutral/conflicting) is hardcoded per factor. Sessions (5 rows) and playbooks (London OB Sweep 72% WR 2.8R 34 trades; NY AM Displacement; Asia Range Break) are literal arrays. **Not algorithmic on user data, not AI, not persisted.**
- **What "edge" means in the code:** a weighted convergence of four pillars **strategy · psychology · market · ai**. Note: the rail's own copy promises the pillars "strategy, psychology, AI analysis, and **mentor** alignment" — the mentor pillar does not exist in the code; "market" does.
- **Nothing flows in** from Strategy OS, Psychology, AI Copilot or Mentor Dashboard — the "convergence layer" reads none of the other five tabs.

### 3.I System Calibration — special audit
- **Names:** UI header "System Calibration" (`OnboardingShell.tsx` line 579) · reached from the rail's ⚙ button titled **"Configure Profile"** · component `OnboardingShell` (`components/copilot/onboarding/`) · also mounted inside `CopilotSecureConsole` ("Secure Environment", auth surface), whose header comment describes a stale phase list (Identity, Risk, Rules, Psychology, Confirmation).
- **What it calibrates:** **the user's declared profile** — identity, strategy framework, risk architecture, psychology self-assessment and rule commitments. It does not calibrate AI, market settings or the workspace.
- **Phases & every question (39):**
  1. *Trading Identity* — Trading Style (scalp/day/swing/position/hybrid) · Methodology (ICT/SMC/Price Action/Supply&Demand/VSA/Indicator/Custom) · Experience Level · Markets (multi) · Primary Instruments (text) · Trading Goal · Weekly Hours.
  2. *Strategy Framework* — Preferred Sessions (Asia/London/NY) · Confluences (multi) · Minimum R:R · Entry Type (limit/market/stop) · Analysis Timeframes · Entry Timeframes · Stop Loss Method · Take Profit Strategy · News Filter (mins) · Counter-Trend Trades.
  3. *Risk Architecture* — Risk Per Trade % · Daily Loss Cap · Weekly Loss Cap · Max Trades/Session · Max Trades/Day · Max Portfolio Exposure · Max Correlated Pairs · Weekly R Target · Drawdown Kill Switch · Scale Into Positions.
  4. *Psychology Profile* — After a Loss · Biggest Weaknesses (multi) · Winning Streak Behavior · Cooldown After Loss (mins) · Emotional Triggers (multi) · Strength Areas (multi) · Self-Assessment Discipline (1–10) · Self-Assessment Patience (1–10) · Journal Habit · Pre-Session Routine (multi) · Post-Session Routine (multi).
  5. *Trading Rules* — pick from `RULE_LIBRARY` (Entry/Exit/Risk/Session/Mindset) or type a custom rule.
- **States:** per-phase intro screen → questions → "mark complete" → next phase; `DNAProgress` shows completed phases; `overallProgress = completed/5·100`; finishing phase 5 calls `completeOnboarding()` + closes the overlay.
- **Storage:** every answer writes immediately via `setIdentity / setStrategy / setRisk / setPsych / addTradingRule` into the zustand store `useCoachProfile`, persisted to **localStorage key `coach.profile.v1`** (`lib/stores/coachProfile.ts`; also holds `stats` + `recordEvent/recordResult`). No backend, no user id.
- **Consumers of the result:** `OnboardingShell` (itself), `PsychologyCenter` and `StrategyWizard` (both **unmounted**), `lib/copilot/coachRecorder.ts` (**zero callers**). **No live console on `/` reads the profile**; `StrategyAnalytics.profileRules` is never wired. → Calibration is a real, persisted, **write-only dead end**.

### 3.J Systems Luke did not list (substantial)
- **Order-Layer engine** — `lib/copilot/order-layer-engine.ts`: `deriveOrderLayerState(strategy, psychology, activity)` → `systemState` stable|elevated|reactive|critical, `directive`, `readinessScore` 0–100 + label Fit/Caution/Compromised/Unfit, `dominantRisk`, `gates[]`, `missions[]`, `dangerSignals[]`; plus `generateIntelligenceQuestions()` (sources strategy/psychology/session/system/risk; priorities critical→standard). This is the **only genuine decision-state algorithm on `/`**; today it runs on hardcoded strategy/psychology inputs. Consumed by Live Feed and the unmounted `OrderLayerPanel`.
- **Day Intelligence** (`getDayContext`) and **Killzone Phase model** (`getKillzonePhases`: London 6 phases Opening Volatility → Direction Window → Optimal Entry Zone → Expansion → Momentum Fade → Wind Down; NY 6; Asia 3; London Close 2) — codified session doctrine, real-time-driven, universal.
- **Behavioral Trap System** — 5 strategy traps + 5 psychology traps with severity, trigger pattern, escape protocol (content in `ActivityCommandCenter`).
- **Trade Journal dashboard** (below fold) — 8-widget grid over a hardcoded `TRADES[]`.
- **Execute mode / TradeExecutionPanel** — order ticket over 5 hardcoded broker accounts (IC Markets, FTMO, Pepperstone, OANDA, MT5) with copy-trade flags; no API.
- **Scenario store** — persisted user scenarios shown as dots in the rail; edited via `ScenarioEditModal`; `activityScenarioSaved` would push suggestions (unreachable outlet).
- **Navigator customisation** — sections toggle/rename/reorder persisted; gadget catalogue of 8 with no implementations.
- **CommandLayer / CommunityHubGate** ride on the layout (audited elsewhere in SoT 12/13).

---

## 4. OVERLAP MATRIX — POSSIBLE OVERLAP / RELATIONSHIP, NOT A PRODUCT DECISION

| Pair | Why they appear to overlap (evidence) |
|---|---|
| Strategy OS ↔ Edge Tracker | Edge's "Setup Confluence" and "Rule Adherence" factors restate Strategy OS's discipline/rule adherence; Edge's playbooks (win-rate, conditions) restate rule/setup tracking; both are meant to be computed from the same trade + rule history. |
| Psychology ↔ Trading DNA (canon) | Psychology already produces personality traits, biases, emotion↔PnL correlation, "execution identity" — the exact content Trading DNA is defined to own (Trader OS + Psychology OS). |
| Strategy OS ↔ Flight Deck `vantary/strategy-os` | Same name; FD module files declare themselves a "mirror" of `StrategyAnalytics`; no shared code. Two implementations of one concept. |
| Old AI Copilot ↔ `/api/copilot/chat` ↔ CopilotProvider watchers ↔ `/copilot` Execution Copilot ↔ FD `ai-copilot` module ↔ Ask Archio | Five "Copilot"s + Ask Archio (`/api/command`, `/api/archio` — the only real LLM endpoints, per SoT 12) all promise "the AI's read"; none share a pipeline. |
| Mentor Dashboard ↔ Academy / Education | `ModelEducation` steps with annotated charts inside entry models = curriculum content living in an execution surface. |
| Mentor Dashboard ↔ Strategy Intelligence / Strategy OS | Template bias, entry-model conditions, risk guidance = a *mentor's* strategy OS; user's Strategy OS = the *user's*. Same shape, different author. |
| Mentor Dashboard ↔ Collective / Live Room | War Room phases, "Mentor Dashboard Tools" discovery dimension, `notify-mentor` route. |
| Mentor Dashboard ↔ Live Feed | Both compute session phase / killzone from the clock, independently (`engine.ts` vs `getSessionPhase`), with different hour tables. |
| System Guide ↔ Tutorial | Identical `GUIDE_SECTIONS` content; accordion vs stepper. |
| Tutorial/Guide ↔ Ask Archio product-guide role | Both are "explain the screen"; Guide/Tutorial are static and screen-blind. |
| System Calibration ↔ onboarding/personalization (DL-029 first-use, `/register`) | Calibration is a 39-question first-use flow that no surface consumes; `IdentityCreation`/register is the live onboarding. Both collect "who are you". |
| System Calibration ↔ Strategy OS rules ↔ Order-Layer inputs | Calibration stores real `tradingRules` + risk caps; Strategy OS shows `DEMO_RULES`; Order-Layer hardcodes rules — three unconnected rule sets. |
| Live Feed Order-Layer ↔ Edge Tracker ↔ Psychology verdict | Three separate "should I trade now" verdicts: readiness/directive (Live Feed), edge score (Edge), STOP/… (Psychology), none reading each other. |
| Confluence Panel ↔ Calibration "Confluences" ↔ Strategy OS confluence scoring | Confluences are declared in two places and scored in a third. |
| Trade Journal (mock) ↔ Psychology Emotional Journal (random) ↔ canon Accounts & History / Trade Review | Two fake journals on one page; canon says the journal is the persisted decision record. |
| Execute mode brokers ↔ canon "Broker rails · TradeLocker · not connected" | Hardcoded brokers vs the honest "not connected" stance in the deck. |

---

## 5. CURRENT DATA / BACKEND REALITY

| System | Data it would need to be real | Exists today? |
|---|---|---|
| Live Feed / Order-Layer | clock + session doctrine (have); user rules & adherence; recent emotional/behavioural signals; account exposure | clock REAL; session OHLC via Polygon routes; rules/psychology inputs **hardcoded** |
| Strategy OS | trade history (entry type, timeframe, instrument), user rules, per-trade rule adherence events | none persisted (calibration rules exist in localStorage, unread) |
| Psychology | mood check-ins, emotion tags per trade, PnL per trade, timing data | none; synthesised |
| AI Copilot (old) | an LLM endpoint with context | `/api/copilot/chat` is scripted; real LLMs exist only in `/api/command`, `/api/archio` |
| Mentor Dashboard | mentor-authored templates (sessions, rules, bias, models, education, persona), live bias updates, war-room events | one hardcoded template; typed model exists; no storage/authoring |
| Edge Tracker | outputs of the other four layers + market regime + trade outcomes | nothing flows in |
| System Calibration | — (already persists) | localStorage `coach.profile.v1`, no server, no user id |
| Trade Journal / Execute | broker connection, trade records | hardcoded arrays |
| CopilotProvider watchers | scenario/order events on `copilotBus`, a UI outlet | bus works; only `instrument:selected` emitted from `/`; FAB/Drawer unmounted |
| notify-mentor | Supabase table + real user id | writes with service-role key and literal `"currentUser"` |

---

## 6. PERSONALIZATION MAP (repo evidence)

- **Universal (no personal data needed):** Market State clock, session/killzone phase model, Day Intelligence, Behavioral Trap library, System Guide/Tutorial content, `/api/copilot/chat` canned notes, rule library (`ALL_AVAILABLE_RULES`, `RULE_LIBRARY`), mentor template *content*.
- **Configured by the user (declared):** System Calibration (39 answers), confluence ticks, scenarios, navigator layout, rules picked in Strategy OS (not persisted), demo overrides.
- **Intended to be learned by ARCHIO (not implemented):** Psychology personality traits/biases/topology, Strategy OS discipline and "intent vs action", Edge factor statuses, watcher suggestions.
- **Intended to be calculated from trading behaviour (not implemented):** rule adherence/violations/streaks, entry-type mix, currency exposure, emotion↔PnL correlation, edge history, journal widgets, playbook win-rates.
- **Mentor-specific:** everything in `MentorTemplate` (session window, day rules, bias, entry models, risk guidance, persona, vault).
- **How the UI fakes it today:** hardcoded snapshots (`sampleSnapshot`, `DEMO_RULES`, `buildOrderLayerInputs`, `MOCK_POSITIONS`, `TRADES[]`, `BROKER_ACCOUNTS`), `Math.random()` journals/timelines, `sin(tick)` edge jitter, `demoMode = true` in the mentor engine, and a 1-second fake "Loading analytics…".

---

## 7. WHAT WOULD BE LOST IF `/` WERE REMOVED TODAY (product concepts only)

1. The **six-phase decision pipeline** as a navigational metaphor (OBSERVE → PLAN → CHECK → ANALYZE → FOLLOW → DECIDE) with per-phase question / purpose / when-to-use / warning / flow copy.
2. The **Order-Layer engine**: readiness score, system state, directive STOP/SLOW DOWN/CLEAR, gates, missions, danger signals, and generated self-reflection questions — the one real algorithm.
3. Codified **session doctrine**: 8 sessions, killzone phase blocks with per-phase instructions, day-quality calendar (PRIME/KEY DAY/CAUTION/AVOID/NO TRADE) with manipulation pattern + sizing rule per day.
4. The **Behavioral Trap library** (10 traps with severity, trigger, escape protocol) and the **Primary Threat / Next Action / Check-in Protocol** framing.
5. The **rule-commitment model** (`RuleCommitment`: teaching, impact when followed/broken, violation log, streaks) and the **strategic mirror** metrics (discipline, entry quality, structure depth, exposure concentration, intent-vs-action).
6. The **behavioural-state model** (`BehavioralState`: stability, drawdown response, latency, revenge/cut-winners/size-escalation risks, cause-effect chains, cross-layer impacts, recovery protocol, cooldown, intervention verdict).
7. The **mentor operating-method data model** (`MentorTemplate`: session gate, day rules, bias, entry models with conditions + education steps, risk guidance, war room, persona, vault) and the time-gated condition engine.
8. The **edge-convergence idea**: weighted pillars → one pre-execution score, plus playbooks with thresholds and a decision history.
9. The **39-question calibration questionnaire** and its persisted profile schema (`TradingIdentity`, `StrategyProfile`, `RiskParameters`, `PsychologyProfile`, `TradingRule`).
10. The **Live Demo state simulator** pattern (override day/session/progress/state to preview every UI state).
11. **Copilot watcher plumbing** (event bus → suggestions: no-SL, weak R:R, progress, copy) and the `activityApi` suggestion vocabulary.
12. Smaller: navigator gadget catalogue (8 ideas), scenario dots in the rail, 8-widget journal layout, multi-broker execution ticket concept.

---

## 8. QUESTIONS PRODUCT BRAIN MUST ANSWER NEXT (max 8 — not answered here)

1. Is the six-phase decision pipeline (OBSERVE→DECIDE) a **user-facing journey ARCHIO wants to keep**, or was it a wrapper for showcasing six modules?
2. There are **three "should I trade now" verdicts** (Order-Layer directive, Edge score, Psychology intervention) and **two session-phase engines**. Which single concept owns "readiness", and which owns "session state"?
3. Is a mentor's method (template) the **same object** as a user's strategy (Strategy OS / calibration), authored by a different person — or two different products?
4. Which of the five "Copilot" layers is the **canon meaning of Copilot**, and does the old AI Copilot tab have any job Ask Archio does not already cover?
5. Does **System Calibration's 39-question profile** become the seed of Trading DNA / Personal Intelligence, or is first-use (DL-029) meant to collect far less and let ARCHIO learn the rest?
6. Where does **rule commitment + adherence tracking** live canonically (Strategy OS, Trading DNA, Intent Loop's Rules check, Accounts & History)? Today three unconnected rule sets exist.
7. Is the **mentor entry-model education** (steps + annotated charts inside an execution card) Academy content or Collective/mentor content?
8. Is the **Live Demo / state-simulator** pattern something ARCHIO wants as a product capability (preview any state) or a dev tool only?

---

## 9. FILES / COMPONENTS INSPECTED

Route & shell: `app/(main)/page.tsx` · `app/(main)/layout.tsx` · `components/live-market-intelligence.tsx` · `components/dev/InstrumentBridge.tsx` · `lib/stores/useNavigatorConfig.ts` · `components/market-state-instrument.tsx` · `lib/stores/useAnalysis.ts` · `lib/scenario-store.ts` · `stores/confluence-store.ts`
Rail & analytics: `components/copilot/CopilotRightRail.tsx` · `components/copilot/analytics/CopilotAnalytics.tsx` · `components/copilot/analytics/EdgeAnalytics.tsx` · `components/copilot/analytics/StrategyAnalytics.tsx` · `components/copilot/analytics/PsychologyAnalytics.tsx`
Live Feed: `components/copilot/activity/CopilotActivityConsole.tsx` · `components/copilot/activity/ActivityGuideAndDemo.tsx` · `lib/copilot/order-layer-engine.ts` · `lib/copilot/activityApi.ts` · `lib/copilot/suggest.ts`
AI Copilot layers: `components/copilot/ai/CopilotAIView.tsx` · `components/copilot/ai/IntelligenceGateway.tsx` · `app/api/copilot/chat/route.ts` · `app/api/copilot/notify-mentor/route.ts` · `components/copilot/CopilotProvider.tsx` · `lib/copilot/eventBus.ts` · `lib/copilot/watchers/index.ts` · `lib/copilot/watchers/riskWatcher.ts` · `app/(main)/copilot/page.tsx` · `components/dashboard/vantary/trading-desk/modules/registry.ts` (ai-copilot) · `components/dashboard/command-desk/command-desk.tsx` (routes to /copilot)
Mentor: `components/mentor/MentorDashboardRail.tsx` · `components/mentor/MentorAIChat.tsx` · `lib/mentor/types.ts` · `lib/mentor/engine.ts` · `lib/mentor/useMentorDashboard.ts` · `lib/mentor/templates/jadecap-ict-ny.ts`
Calibration: `components/copilot/onboarding/OnboardingShell.tsx` · `components/copilot/onboarding/CopilotSecureConsole.tsx` · `lib/stores/coachProfile.ts` · `lib/copilot/coachRecorder.ts`
Auth mount surface: `components/auth/EntryThreshold.tsx` · `components/auth/AccessArchitecturePreview.tsx` · `components/auth/LayerDetailModal.tsx`
Below-fold / execute: `components/copilot/journal/TradeJournalDashboard.tsx` · `components/copilot/trade/TradeExecutionPanel.tsx`
Flight Deck cross-refs: `components/dashboard/vantary/strategy-os/{data,derive,mirror}.ts(x)` · `components/dashboard/vantary/flight-deck/communities-source.ts` · `components/communities/discovery-dimensions.ts` · `docs/source-of-truth/12-*.md` (Copilot rows)
Mount/orphan verification: grep of every `*Console`, `CopilotFAB/Drawer/Split`, `Enhanced/OptimizedCopilotRightRail`, `CopilotChatPanel`, `PsychologyCenter`, `StrategyWizard`, `PersonaSimulator`, `OrderLayerPanel`, `SocialFeed`, `CoachQna`; listeners for `copilot:switch-tab`, `copilot:chat:ask`, `copilot:chat:seed`; `copilotBus.on` subscribers; `useCoachProfile` and `coachRecorder` consumers.

Not audited in depth (noted, not claimed): `IntelligenceBoard` internals, `MethodVault`/`WarRoomLauncher` internals, `PremiumChartAnalysisModal` internals, the Polygon route implementations, `TradeJournalDashboard` widget logic beyond its hardcoded `TRADES[]` source.
