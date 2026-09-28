# AI COPILOT SYSTEM -- INTERNAL ARCHITECTURE DOCUMENT
## Version 1.0 | March 2026

---

# TABLE OF CONTENTS

1. [System 1: AI Copilot / "You Lead the AI"](#system-1)
2. [System 2: Psychology OS (Neural Cortex 2.0)](#system-2)
3. [System 3: Strategy OS (Strategy Mirror)](#system-3)
4. [System 4: Activity Live OS](#system-4)
5. [Order Layer Engine (Unified Intelligence)](#order-layer-engine)
6. [System Connections & Dependencies](#dependencies)
7. [Recommended Agent Architecture](#agent-architecture)
8. [Priority Map](#priority-map)
9. [Executive Summary](#executive-summary)

---

# SYSTEM 1: AI COPILOT / "You Lead the AI" {#system-1}

## A. PURPOSE

**Exact purpose**: The AI Copilot is the unified conversational intelligence layer that sits above all three OS systems (Psychology, Strategy, Activity). It is the trader's real-time partner -- not an auto-trader, but a behavioral mirror that speaks back.

**User problem it solves**: Traders are blind to their own patterns. They know their rules but break them under pressure. They cannot simultaneously trade, monitor their psychology, check their discipline, AND track session timing. The AI Copilot watches all of this and surfaces the one thing that matters most right now.

**What the user should feel**: "This system knows me better than I know myself. It caught something I would have missed. It is not telling me what to trade -- it is telling me what I am doing wrong and how to fix it before it costs me money."

**Operating philosophy**: The AI never generates trade signals. It never tells you to buy or sell. It watches YOUR behavior, YOUR rules, YOUR emotions -- and reflects the truth back with surgical precision. The trader leads. The AI protects.

## B. USER EXPERIENCE FLOW

**First view**: The CopilotAIView opens with an AI Nucleus visualization (animated orbital SVG with breathing intelligence rings) and two home sections: Signals and Modes.

**Actions available**:
- Chat with the AI via a text input (sends messages to a conversational interface)
- Browse behavior signals (critical/high/medium severity) that the system has detected
- Explore conversation modes (Strategy, Psychology, Execution, Learning, Review, Custom)
- View the Intelligence Gateway (detailed pipeline visualization of how the AI reads the trader)
- View the Intelligence Board (4-channel scanner: Psychology, Discipline, Strategy, Risk)

**Dynamic vs static**:
- Static: UI structure, pipeline diagrams, mode definitions
- Dynamic: Behavior signals (change based on trader state), chat responses, signal severity levels, scanner activity indicators

**Default vs triggered**:
- Default: Home view with nucleus, signal count badges, mode selector
- Triggered: Clicking a behavior signal opens contextual chat; clicking a mode starts a guided conversation; clicking Intelligence Gateway expands the 6-stage pipeline visualization

## C. FEATURE BREAKDOWN

### Feature 1: AI Nucleus Visualization
- **What**: Animated SVG with orbital particles, breathing rings, neural connection threads
- **Why**: Visual representation of system intelligence -- alive, watching, thinking
- **Inputs**: `isThinking` boolean (active during chat generation)
- **Outputs**: Visual state change (faster pulses when thinking, slower breathing when idle)
- **UI state**: Controls pulse speed, glow intensity, particle opacity
- **Type**: Pure UI (rules-based animation timing)
- **Dependencies**: None

### Feature 2: Behavior Signal Scanner
- **What**: Categorized behavior alerts (critical/high/medium) surfaced from Psychology, Discipline, Strategy, Risk channels
- **Why**: Proactive danger detection -- surfaces problems before losses occur
- **Inputs**: PsychologyInput, StrategyInput, ActivityInput (from order-layer-engine)
- **Outputs**: Ranked danger signals with severity, source, R-cost estimates, one-sentence truths
- **UI state**: Signal count badges, expandable signal cards, severity color coding
- **Type**: Rules-based (deterministic scoring from order-layer-engine `buildDangerSignals`)
- **Dependencies**: Order Layer Engine, Psychology OS data, Strategy OS data

### Feature 3: Conversation Modes
- **What**: 6 predefined conversation contexts (Strategy, Psychology, Execution, Learning, Review, Custom)
- **Why**: Focused AI interaction -- forces the conversation to be relevant to the trader's current need
- **Inputs**: User-selected mode, current trader state, chat history
- **Outputs**: Contextual AI responses tailored to the selected mode
- **UI state**: Active mode indicator, mode-specific SVG visualization, chat thread scoping
- **Type**: AI-based (LLM conversation) with rules-based mode selection
- **Dependencies**: Chat system, Psychology/Strategy data for context

### Feature 4: Intelligence Gateway
- **What**: 6-stage visual pipeline showing how the AI processes trader behavior: INGEST -> NORMALIZE -> PATTERN MATCH -> CORRELATE -> CLASSIFY -> SCORE
- **Why**: Transparency -- the trader must understand HOW the AI reads them to trust it
- **Inputs**: None (educational/visual component)
- **Outputs**: Visual understanding of the AI pipeline
- **UI state**: Active stage highlighting, auto-cycling through stage pairs every 2.5s
- **Type**: Pure UI (static educational content with animation)
- **Dependencies**: None

### Feature 5: Intelligence Board (4-Channel Scanner)
- **What**: Live scanner visualization for Psychology, Discipline, Strategy, Risk -- each with 4 detailed metrics
- **Why**: Deep transparency into what each scanner channel measures, why it matters, and how it works
- **Inputs**: Static metric definitions with dynamic signal counts
- **Outputs**: Expandable channel cards with metric breakdowns
- **UI state**: Active channel expansion, metric detail visibility
- **Type**: Rules-based (static definitions, dynamic counts from event system)
- **Dependencies**: Psychology OS, Strategy OS for signal count data

### Feature 6: Chat Interface
- **What**: Message-based conversational UI with the AI
- **Why**: Natural language interaction for nuanced coaching, questions, and behavioral analysis
- **Inputs**: User text messages, current conversation mode, trader state context
- **Outputs**: AI-generated responses with behavioral insights, suggestions, corrections
- **UI state**: Message thread, typing indicator, quick action buttons
- **Type**: AI-based (requires LLM)
- **Dependencies**: All OS systems for context injection

## D. LOGIC / DECISION SYSTEM

### Behavior Signal Generation Logic
- **Trigger**: Computed on every state derivation cycle (when OS inputs change)
- **Variables**: 14 distinct conditions across Psychology and Strategy inputs
- **Decision flow**:
  1. Check each condition against threshold
  2. If met, create DangerSignal with severity, source, message, R-cost
  3. Sort by severity (critical > reactive > elevated > stable)
  4. Surface top N signals to the UI
- **Rules are 100% deterministic**: No AI needed for signal generation

### Conversation Mode Logic
- **Trigger**: User selects a mode
- **Decision**: Mode selection scopes the system prompt for the LLM
- **What changes**: The AI's personality, focus area, and suggested actions change based on mode
- **AI requirement**: Yes -- LLM is needed for natural language responses within each mode

### Signal Priority Logic
- **Critical**: Revenge risk critical, size escalation critical, stability < 40, cortex reactive, risk grade D
- **Reactive**: Overtrading warning/critical, cutting winners warning/critical, discipline < 50
- **Elevated**: Limbic dominance, emotion volatility > 60, fast decision latency, correlation risk, entry quality < 40

## E. DATA INPUTS

| Data | Source | Type | Real-time? | Minimum needed |
|------|--------|------|------------|----------------|
| Mood check results | User-entered | Manual | Session-based | 3 mood checks |
| Trade entries/exits | Order system | Automatic | Real-time | 1 trade |
| Rule adherence scores | Strategy OS | Calculated | Per-trade | 3 trades |
| Position sizing data | Order system | Automatic | Real-time | 1 position |
| Session timing | System clock | Automatic | Real-time | Always available |
| Emotion labels | User-tagged or inferred | Manual/AI | Session-based | 1 emotion tag |
| Historical patterns | Event log | Calculated | End-of-session | 5 sessions |
| Confluence selections | User-selected | Manual | Per-setup | 1 confluence |

## F. OUTPUTS / DELIVERABLES

| Output | Format | When | Importance | Proactive/Reactive |
|--------|--------|------|------------|-------------------|
| Danger signals | Color-coded cards with R-cost | Always visible | Critical | Proactive |
| Behavioral coaching | Chat messages | On user query | High | Reactive |
| Mode-specific guidance | Contextual AI responses | On mode selection | Medium | Reactive |
| Pipeline transparency | Visual diagrams | On expansion | Educational | Reactive |
| Signal severity badges | Count badges on scanner | Always visible | High | Proactive |

## G. STATES / MODES

The AI Copilot inherits its state from the Order Layer Engine:
- **stable**: Normal coaching mode, educational content available
- **elevated**: Warning signals active, coaching becomes more directive
- **reactive**: Multiple warnings, AI shifts to intervention mode
- **critical**: Hard gates active, AI blocks trading and forces review

---

# SYSTEM 2: PSYCHOLOGY OS (Neural Cortex 2.0) {#system-2}

## A. PURPOSE

**Exact purpose**: An MRI of the trader's mind. Maps emotional state to decision quality, tracks behavioral patterns across sessions, identifies cause-effect chains between emotions and losses, and produces a real-time "neural stability index."

**User problem it solves**: Traders do not see the connection between their mood at 10:00 AM and their revenge trade at 10:45 AM. Psychology OS makes the invisible visible -- it shows the chain of: trigger -> emotion -> action -> result -> cost.

**What the user should feel**: "I can see exactly where my mind breaks down. I can see the pattern. I can see the cost. And I can see the specific protocol to interrupt it."

**Operating philosophy**: Every emotion is data. Every decision is a data point. The system does not judge -- it measures. The trader sees their own neural topology and can course-correct before the damage is done.

## B. USER EXPERIENCE FLOW

**First view**: PsychologyGuideAndTutorial (educational walkthrough of the Neural Cortex system), followed by the PsychologyAnalytics dashboard showing the full neural cortex visualization.

**Actions available**:
- Browse 5 psychological profiles (FOCUSED / CAUTIOUS / REACTIVE / TILTED / SPIRALING) via carousel
- View profile-specific data: mood mix, top emotions, top pitfalls, decision latency, active days
- Explore the Neural Cortex visualization (brain zones, hemisphere dominance, stability index)
- View Cause-Effect Chains (trigger -> emotion -> action -> result -> cost -> interrupt protocol)
- Access Decision Pace analysis (reaction speed over 24h)
- Toggle Live/Manual profile cycling

**Dynamic elements**:
- Profile-specific data generation (each profile produces different PsychologyData)
- Brain zone activation levels (intensity percentages change per profile)
- Stability index and verdict level change with profile
- Cause-effect chains update with profile context

## C. FEATURE BREAKDOWN

### Feature 1: Psychological Profile Carousel
- **What**: 5 trader psychological profiles (FOCUSED A+ / CAUTIOUS B+ / REACTIVE C / TILTED D / SPIRALING F)
- **Why**: Shows the full spectrum of psychological states so the trader can identify where they are
- **Inputs**: Profile definition data (mood percentages, decision timing, emotion distributions)
- **Outputs**: Profile-specific PsychologyData object
- **Type**: Rules-based (deterministic data generation from profile parameters)
- **Dependencies**: None

### Feature 2: Neural Cortex Visualization
- **What**: Brain topology mapping showing 8 zones (Prefrontal Control, Fear/Amygdala Response, Reward Processing, Pattern Recognition, Risk Assessment, Impulse Control, Emotional Memory, Strategic Planning)
- **Why**: Visual representation of which brain regions are driving decisions
- **Inputs**: PsychologyData (mood mix, top emotions, pitfalls)
- **Outputs**: Zone intensity percentages, hemisphere dominance, stability index
- **UI state**: Zone highlighting on hover, hemisphere balance indicator
- **Type**: Rules-based (deterministic mapping from emotion data to zone activation)
- **Dependencies**: PsychologyData

### Feature 3: Cause-Effect Chain Engine
- **What**: Maps trigger -> emotion -> action -> result -> cost -> interrupt protocol chains
- **Why**: Shows the exact cost of emotional trading and provides the specific intervention
- **Inputs**: Top pitfalls data, trade history patterns
- **Outputs**: Chains with R-cost estimates and interrupt protocols
- **Type**: Currently rules-based (template chains). Future: AI-generated from actual trade data
- **Dependencies**: PsychologyData, Trade journal data

### Feature 4: Decision Pace Analysis
- **What**: 24-hour heatmap of decision speed (fast/measured/slow)
- **Why**: Impulsive decisions cluster at specific times; this reveals the pattern
- **Inputs**: Trade timestamps, decision latency measurements
- **Outputs**: Hourly pace distribution, speed classification
- **Type**: Rules-based (statistical analysis)
- **Dependencies**: Trade event log

### Feature 5: Mood Mix Dashboard
- **What**: Positive/Negative mood split over 7 days with emotion breakdown
- **Why**: Emotional baseline tracking -- shows trends across the week
- **Inputs**: User mood check-ins (manual), emotion tags
- **Outputs**: Percentage split, emotion ranking, trend direction
- **Type**: Rules-based (aggregation)
- **Dependencies**: User mood data

### Feature 6: Cortex Verdict System
- **What**: Three-level verdict (STABLE / ELEVATED / REACTIVE) based on composite analysis
- **Why**: Single-word summary of neural readiness
- **Inputs**: All PsychologyData + derived intelligence
- **Outputs**: Verdict level, recommendations
- **Type**: Rules-based
- **Dependencies**: All psychology features

## D. LOGIC / DECISION SYSTEM

### Stability Index Computation
```
stabilityIndex = f(moodPositivePct, emotionVolatility, decisionConsistency)
- moodPositivePct > 70 -> +30 stability
- moodPositivePct < 40 -> -20 stability
- topPitfall severity > 25% -> -15 per pitfall
- decisionLatency "fast" -> -10 (impulsive)
- decisionLatency "measured" -> +10 (controlled)
```

### Hemisphere Dominance Logic
```
Left (logical): Calm Confidence > 30%, Patient Focus > 20%, Detached Clarity > 15%
Right (emotional): Frustration > 20%, FOMO > 15%, Excitement > 15%, Fear > 10%
Balanced: Neither side dominant by > 15%
```

### Pattern Severity Classification
```
critical: Single pitfall > 25% AND mood negative > 60%
warning: Single pitfall > 20% OR mood negative > 50%
watch: Single pitfall > 10%
clear: All pitfalls < 10%
```

### Brain Zone Activation Mapping
```
Prefrontal Control = f(moodPositive, decisionLatency_measured)
Fear/Amygdala = f(pitfall_revenge, pitfall_fear, moodNegative)
Reward Processing = f(pitfall_overconfidence, pitfall_FOMO, emotionExcitement)
Pattern Recognition = f(activeDays, moodChecks_frequency)
Risk Assessment = f(pitfall_sizeCreep, pitfall_overtrade)
Impulse Control = f(decisionLatency, pitfall_impulsive)
Emotional Memory = f(pitfall_revenge, topEmotion_frustration)
Strategic Planning = f(moodPositive, activeDays, medianDecisionMins)
```

## E. DATA INPUTS

| Data | Source | Type | Minimum needed |
|------|--------|------|----------------|
| Mood check-ins (positive/negative) | User-entered | Manual | 3 per week |
| Emotion labels | User-tagged | Manual | 1 per check-in |
| Decision timestamps | Order system | Automatic | 1 trade |
| Pitfall occurrences | Strategy OS correlation | Calculated | 5 trades |
| Active trading days | Calendar | Automatic | 1 week |
| Median decision minutes | Trade timestamps | Calculated | 3 trades |

## F. OUTPUTS

| Output | When | Importance | Proactive/Reactive |
|--------|------|------------|-------------------|
| Stability Index (0-100) | Always visible | Critical | Proactive |
| Cortex Verdict (STABLE/ELEVATED/REACTIVE) | Always visible | Critical | Proactive |
| Hemisphere Dominance | Always visible | High | Proactive |
| Brain Zone Heatmap | On expansion | Medium | Reactive |
| Cause-Effect Chains | On expansion | High | Reactive |
| Pattern Severity Alerts | Always visible | Critical | Proactive |
| Interrupt Protocols | On chain expansion | High | Reactive |
| Decision Pace Distribution | On expansion | Medium | Reactive |

## G. STATES

| State | Trigger | Behavior |
|-------|---------|----------|
| Stable | Stability > 70, no critical patterns | Green indicators, educational mode |
| Elevated | Stability 40-70, 1+ watch patterns | Amber indicators, gentle warnings |
| Reactive | Stability < 40, 2+ warning patterns | Red indicators, intervention mode |
| Spiraling | Multiple critical patterns + low stability | Red flash, hard gate activation |

---

# SYSTEM 3: STRATEGY OS (Strategy Mirror) {#system-3}

## A. PURPOSE

**Exact purpose**: A forensic mirror of trading execution. Compares what the trader committed to (their rules, their plan, their identity) with what they actually did. Every gap between intent and action is measured, visualized, and assigned an R-cost.

**User problem it solves**: Traders think they follow their rules. They do not. Strategy OS proves the gap with data. "You said you would only trade killzones. You entered 4 trades outside killzones this week. Those 4 trades cost you -3.2R."

**What the user should feel**: "I cannot hide from this. The data is right there. I said I would do X, I did Y, and it cost me Z. Now I know exactly what to fix."

**Operating philosophy**: Rules without measurement are suggestions. The Strategy Mirror turns every trading rule into a measured commitment with violation logs, streak tracking, and impact quantification.

## B. USER EXPERIENCE FLOW

**First view**: StrategyGuideAndTutorial (walkthrough of the Strategy Mirror system), followed by the StrategyAnalytics dashboard.

**Actions available**:
- Browse 5 trader profiles (ELITE A+ / DISCIPLINED A / DEVELOPING B / STRUGGLING C / RECKLESS D) via carousel
- View Rule Commitments with adherence %, violation count, streaks, weekly history sparklines
- Expand any rule to see: teaching (why the rule exists), impact when followed, impact when broken, full violation log with dates and context
- View Entry Type Mix (market vs limit vs stop order distribution)
- View Instrument Exposure map
- View Timeframe and Model distribution
- Access Strategic Mirror timeline (intent vs action gap)

## C. FEATURE BREAKDOWN

### Feature 1: Trader Profile Carousel
- **What**: 5 execution profiles with grade, description, and data generation parameters
- **Why**: Shows the spectrum from elite to reckless so the trader can self-locate
- **Inputs**: Profile parameters (limitPct, stopPct, scenarioCount, instrumentSpread)
- **Outputs**: Profile-specific StrategyData + RuleCommitment arrays
- **Type**: Rules-based
- **Dependencies**: None

### Feature 2: Rule Commitment Tracker
- **What**: Individual rule cards with adherence %, violations, streak, best streak, weekly sparkline, expandable teaching + violation log
- **Why**: Each rule the trader defined becomes a measured contract with consequences
- **Inputs**: Trade data cross-referenced against user-defined rules
- **Outputs**: Per-rule adherence score, violation count, streak data, impact metrics
- **UI state**: Collapsed (summary) vs expanded (full detail with teaching and logs)
- **Type**: Rules-based (aggregation and cross-referencing)
- **Dependencies**: Trade journal data, user-defined rules

### Feature 3: Entry Type Analysis
- **What**: Market/Limit/Stop order distribution as a horizontal bar
- **Why**: Market orders indicate impulsive entries; limit orders indicate planned entries
- **Inputs**: All trade entries classified by order type
- **Outputs**: Percentage distribution, quality assessment
- **Type**: Rules-based
- **Dependencies**: Trade execution data

### Feature 4: Exposure Gravity Map
- **What**: Instrument-level exposure distribution with concentration risk indicators
- **Why**: Concentrated exposure = concentrated risk. Hidden correlation kills accounts.
- **Inputs**: Open positions, historical position data
- **Outputs**: Instrument weights, correlation flags, concentration warnings
- **Type**: Rules-based (with potential AI for correlation detection)
- **Dependencies**: Position data, instrument metadata

### Feature 5: Intent-Action Gap (Mirror Timeline)
- **What**: Visual comparison of planned vs actual execution scores
- **Why**: The gap between what you said you would do and what you did IS the edge leak
- **Inputs**: Pre-session plan scores, actual execution scores
- **Outputs**: Gap measurement, trend direction, R-cost of gap
- **Type**: Rules-based
- **Dependencies**: Pre-session planning data, execution data

## D. LOGIC / DECISION SYSTEM

### Overall Discipline Score
```
discipline = weighted_avg(
  rule_adherences * rule_importance_weights
) * killzone_multiplier * session_multiplier
```

### Risk Grade Computation
```
A: discipline >= 80 AND limitRatio >= 50 AND no correlation risk
B: discipline >= 65 AND limitRatio >= 35
C: discipline >= 45 OR limitRatio >= 20
D: discipline < 45 AND limitRatio < 20
```

### Entry Quality Score
```
entryQuality = (limitPct * 0.6) + (stopPct * 0.25) + (scenarioDepth * 0.15)
- Penalized by: market order ratio > 40%, no scenario context, off-killzone entries
```

### Rule Violation Detection
```
For each user-defined rule:
1. Extract rule criteria (e.g., "only trade during killzones")
2. For each new trade, check if criteria was met
3. If violated: increment violation count, reset streak, log context
4. If followed: increment streak, maintain adherence
5. Compute: adherence = (total_followed / total_tracked) * 100
```

## E. DATA INPUTS

| Data | Source | Type | Minimum needed |
|------|--------|------|----------------|
| Trade entries (type, time, instrument) | Order system | Automatic | 3 trades |
| User-defined rules | User configuration | Manual | 1 rule |
| Scenario context | Scenario system | Manual | Optional |
| Forecast linkage | Forecast system | Manual | Optional |
| Position sizing | Order system | Automatic | 1 position |
| Session timing | System clock | Automatic | Always available |

## F. OUTPUTS

| Output | When | Importance | Proactive/Reactive |
|--------|------|------------|-------------------|
| Discipline Score (0-100) | Always visible | Critical | Proactive |
| Risk Grade (A/B/C/D) | Always visible | Critical | Proactive |
| Rule Adherence per rule | Always visible | High | Proactive |
| Violation Logs | On rule expansion | High | Reactive |
| Impact Quantification | On rule expansion | High | Reactive |
| Entry Quality Score | Always visible | Medium | Proactive |
| Exposure Concentration | Always visible | High | Proactive |
| Intent-Action Gap | Always visible | High | Proactive |

---

# SYSTEM 4: ACTIVITY LIVE OS {#system-4}

## A. PURPOSE

**Exact purpose**: The real-time session commander. Knows exactly what trading session is active (Asia/London/NY/Off-hours), what sub-phase the session is in, what the session-specific threats are, and what the trader should do RIGHT NOW.

**User problem it solves**: Traders lose track of session context. They trade during dead zones. They miss killzone windows. They do not adapt their behavior to session-specific conditions. Activity OS is a military-grade session awareness system.

**What the user should feel**: "I know exactly where I am in the session. I know what phase we are in. I know what is coming next. I know what my specific threats are for this session. I am operating with total situational awareness."

**Operating philosophy**: Time is the most underrated variable in trading. Activity OS turns the clock into a weapon -- not just showing time, but interpreting it with session-specific intelligence.

## B. USER EXPERIENCE FLOW

**First view**: ActivityGuideAndDemo (educational walkthrough with demo mode), followed by the CopilotActivityConsole showing the live session intelligence dashboard.

**Actions available**:
- View current session phase (name, phase, sub-phase, killzone status)
- Monitor killzone progress bar (elapsed/remaining)
- View session-specific intelligence questions generated by the Order Layer Engine
- Monitor Order Layer state (directive, gates, missions, danger signals)
- Toggle demo mode with overrides (session, threat level, killzone status)
- View session-adaptive coaching content

**Dynamic elements**:
- Session phase updates every minute based on UTC time
- Killzone progress bar animates in real-time
- Intelligence questions regenerate based on trader state changes
- Directive changes based on composite readiness score

## C. FEATURE BREAKDOWN

### Feature 1: Session Intelligence Engine
- **What**: Pure function `getSessionPhase(nowMs)` that determines current trading session, phase, sub-phase, killzone status, elapsed/remaining time, and progress percentage
- **Why**: Institutional trading revolves around sessions; retail traders need this awareness
- **Inputs**: Current UTC timestamp
- **Outputs**: `{ name, phase, phaseColor, killzone, subPhase, elapsed, remaining, totalMinutes, kzProgress }`
- **Type**: 100% deterministic rules-based
- **Dependencies**: None (pure time function)

**Session Mapping (UTC)**:
| Time Range | Session | Phase | Killzone |
|------------|---------|-------|----------|
| 00:00-04:00 | Asia | Accumulation | No |
| 04:00-07:00 | Pre-London | Preparation | No |
| 07:00-10:00 | London | Displacement | Yes |
| 10:00-13:00 | London-NY Transition | Low Volume | No |
| 13:00-16:00 | New York | Prime Execution | Yes |
| 15:00-16:00 | London Close | Reversal Window | Yes |
| 16:00-21:00 | Post-NY | Cooldown | No |
| 21:00-00:00 | Off-Hours | No Session | No |

### Feature 2: Order Layer Panel
- **What**: Unified intelligence dashboard showing directive, readiness score, gates, missions, danger signals
- **Why**: Single source of truth for "can I trade right now?"
- **Inputs**: StrategyInput, PsychologyInput, ActivityInput
- **Outputs**: OrderLayerState (directive, readiness, gates, missions, signals)
- **Type**: 100% rules-based (deterministic engine)
- **Dependencies**: All three OS systems

### Feature 3: Intelligence Questions Generator
- **What**: Context-aware questions the system asks the trader based on current state
- **Why**: Forces the trader to think before acting; Socratic method
- **Inputs**: Current OrderLayerState, session context
- **Outputs**: Prioritized question list with source attribution
- **Type**: Rules-based (template questions with dynamic context injection)
- **Dependencies**: Order Layer Engine

### Feature 4: Truth Strip
- **What**: One-sentence dominant risk + one-sentence primary correction displayed at all times
- **Why**: The single most important thing the trader needs to know RIGHT NOW
- **Inputs**: Danger signals (sorted by severity), active missions
- **Outputs**: Two sentences
- **Type**: Rules-based (picks highest-severity signal and highest-priority mission)
- **Dependencies**: Order Layer Engine

### Feature 5: Gate System
- **What**: Blocking mechanisms that prevent trading until conditions are resolved
- **Why**: Hard gates = you CANNOT trade. Soft gates = you SHOULD NOT trade.
- **Inputs**: Psychology state, Strategy state
- **Outputs**: Gate cards with label, reason, resolve action, target tab/section
- **Type**: Rules-based (deterministic threshold checks)
- **Dependencies**: Psychology OS, Strategy OS

### Feature 6: Mission System
- **What**: Prioritized actionable steps (interrupt revenge loop, restore stability, review rule X, etc.)
- **Why**: Turns problems into concrete tasks with clear resolution paths
- **Inputs**: Current system state, pattern severities, rule violations
- **Outputs**: Mission list with priority, description, target tab, R-impact
- **Type**: Rules-based
- **Dependencies**: All three OS systems

## D. LOGIC / DECISION SYSTEM

### Readiness Score Computation
```
readinessScore = round(
  psychologyScore * 0.40 +
  strategyScore * 0.35 +
  activityScore * 0.25
)

Labels:
>= 75: "Fit"
>= 55: "Caution"
>= 35: "Compromised"
< 35:  "Unfit"
```

### Directive Derivation
```
if mode == "cooldown" -> COOLDOWN_ACTIVE
if state == "critical" OR hasHardGate -> DO_NOT_TRADE
if state == "reactive" -> AUDIT_REQUIRED
if state == "elevated" -> ONLY_A_PLUS
if readiness < 55 -> REDUCE_RISK
else -> CLEAR_TO_TRADE
```

### System State Derivation
```
CRITICAL if:
  revengeRisk == critical OR
  sizeEscalation == critical OR
  cortexVerdictLevel == reactive OR
  stabilityIndex < 40 OR
  readinessScore < 30

REACTIVE if:
  warningCount >= 2 OR
  riskGrade == D OR
  readinessScore < 45

ELEVATED if:
  warningCount >= 1 OR
  riskGrade == C OR
  hemisphereRight OR
  emotionVolatility > 60 OR
  discipline < 60 OR
  readinessScore < 65

else STABLE
```

---

# ORDER LAYER ENGINE (Unified Intelligence) {#order-layer-engine}

## Architecture

The Order Layer Engine (`order-layer-engine.ts`) is the BRAIN of the entire system. It is a **pure logic module with zero React dependencies**. It takes three inputs (StrategyInput, PsychologyInput, ActivityInput) and produces one unified output (OrderLayerState).

```
                 StrategyInput ──┐
                                 │
  PsychologyInput ──────────────>│ deriveOrderLayerState() ──> OrderLayerState
                                 │
    ActivityInput ──────────────┘

OrderLayerState contains:
  - systemState (stable/elevated/reactive/critical)
  - sessionMode (pre/in/post/cooldown/off-hours)
  - directive (CLEAR_TO_TRADE / ONLY_A_PLUS / REDUCE_RISK / AUDIT_REQUIRED / DO_NOT_TRADE / COOLDOWN_ACTIVE)
  - readinessScore (0-100)
  - gates[] (blocking conditions)
  - missions[] (actionable steps)
  - dangerSignals[] (truth statements)
  - strategyScore, psychologyScore, activityScore (transparency)
```

### Sub-Functions
1. `computeStrategyScore(StrategyInput) -> 0-100`
2. `computePsychologyScore(PsychologyInput) -> 0-100`
3. `computeActivityScore(ActivityInput) -> 0-100`
4. `deriveSystemState(psych, strat, readiness) -> SystemState`
5. `deriveSessionMode(activity, state) -> SessionMode`
6. `deriveDirective(state, mode, hasHardGate, readiness) -> Directive`
7. `buildGates(psych, strat, activity) -> Gate[]`
8. `buildDangerSignals(psych, strat, activity) -> DangerSignal[]`
9. `buildMissions(psych, strat, activity, state) -> Mission[]`
10. `deriveDominantRisk(signals, psych, strat) -> string`
11. `derivePrimaryCorrection(missions) -> string`
12. `generateIntelligenceQuestions(state) -> IntelligenceQuestion[]`

All functions are deterministic. No AI required.

---

# SYSTEM CONNECTIONS & DEPENDENCIES {#dependencies}

```
                    ┌──────────────────────┐
                    │     AI COPILOT       │
                    │  (Conversation +     │
                    │   Signal Surface)    │
                    └──────────┬───────────┘
                               │ reads all
                    ┌──────────┴───────────┐
                    │  ORDER LAYER ENGINE  │
                    │  (Unified Logic Hub) │
                    └──┬───────┬───────┬───┘
                       │       │       │
              ┌────────┘       │       └────────┐
              │                │                │
    ┌─────────┴──────┐ ┌──────┴───────┐ ┌──────┴──────────┐
    │  PSYCHOLOGY OS  │ │  STRATEGY OS  │ │  ACTIVITY OS    │
    │  (Neural       │ │  (Strategy    │ │  (Session       │
    │   Cortex 2.0)  │ │   Mirror)     │ │   Intelligence) │
    └───────┬────────┘ └──────┬────────┘ └──────┬──────────┘
            │                 │                  │
            └────────┬────────┘                  │
                     │                           │
              ┌──────┴──────┐            ┌───────┴───────┐
              │  EVENT BUS  │            │  SYSTEM CLOCK │
              │  (Telemetry │            │  (UTC Session │
              │   Pipeline) │            │   Engine)     │
              └──────┬──────┘            └───────────────┘
                     │
              ┌──────┴──────┐
              │  TRADE DATA │
              │  (Orders,   │
              │   Journal,  │
              │   Positions)│
              └─────────────┘
```

### Cross-System Data Flows

| From | To | Data | Purpose |
|------|----|------|---------|
| Psychology OS | Order Layer | PsychologyInput | Readiness scoring |
| Strategy OS | Order Layer | StrategyInput | Discipline scoring |
| Activity OS | Order Layer | ActivityInput | Session context |
| Order Layer | AI Copilot | OrderLayerState | Signal generation |
| Order Layer | Activity OS | Directive, Gates | Panel rendering |
| Event Bus | Psychology OS | Trade events | Pattern detection |
| Event Bus | Strategy OS | Trade events | Rule compliance |
| Event Bus | AI Copilot | All events | Context for chat |

### What should be shared:
- Trade event data (Event Bus)
- Current instrument context (useInstrument store)
- Readiness scores and directives (Order Layer output)

### What should stay isolated:
- Psychology internal state (brain zones, hemisphere calculations)
- Strategy internal state (rule definitions, violation logs)
- AI conversation history (per-mode threads)

---

# RECOMMENDED AGENT ARCHITECTURE {#agent-architecture}

## Summary: 5 Agents Total

Based on deep analysis of every feature, most of this system is DETERMINISTIC and does NOT need AI agents. The Order Layer Engine, Psychology scoring, Strategy scoring, Session intelligence, Gate system, Mission system, Danger signals -- all 100% rules-based. AI is only needed where natural language understanding or generation is required.

## Proposed Agent Architecture

### Agent 1: Orchestrator Agent (Central Intelligence)
- **Responsibility**: Routes user queries to the correct specialist, maintains conversation context, decides when to escalate
- **Inputs**: User chat messages, current OrderLayerState, active mode
- **Outputs**: Routing decision, context package for specialist
- **When it runs**: Every user message
- **Type**: LLM (needs reasoning to understand intent)
- **Always-on**: Yes (listens for chat input)
- **Dependencies**: All OS state data
- **Should be**: LLM with structured tool calling

### Agent 2: Psychology Coach Agent
- **Responsibility**: Generates natural language coaching for emotional and behavioral issues
- **Inputs**: PsychologyInput, cause-effect chains, user question, conversation history
- **Outputs**: Coaching messages, interrupt protocol recommendations, behavioral pattern explanations
- **When it runs**: When user asks psychology-related questions OR when Orchestrator routes to it
- **Type**: LLM with psychology context injection
- **Always-on**: No (event-triggered)
- **Dependencies**: Psychology OS data
- **Should be**: LLM with domain-specific system prompt

### Agent 3: Strategy Advisor Agent
- **Responsibility**: Generates natural language feedback on rule adherence, execution quality, and strategic improvement
- **Inputs**: StrategyInput, RuleCommitments, violation logs, user question
- **Outputs**: Strategy coaching, rule violation analysis, improvement recommendations
- **When it runs**: When user asks strategy-related questions OR when Orchestrator routes to it
- **Type**: LLM with strategy context injection
- **Always-on**: No (event-triggered)
- **Dependencies**: Strategy OS data
- **Should be**: LLM with domain-specific system prompt

### Agent 4: Session Intelligence Agent
- **Responsibility**: Provides session-specific guidance, killzone awareness, and timing-based coaching
- **Inputs**: ActivityInput, session phase data, historical session performance
- **Outputs**: Session-specific advice, timing recommendations, phase-aware coaching
- **When it runs**: On session transitions, on user query, on killzone entry/exit
- **Type**: Hybrid (rules-based session logic + LLM for natural language output)
- **Always-on**: Partially (session transition monitoring is always-on)
- **Dependencies**: Activity OS, System clock
- **Should be**: Rules engine + LLM for explanation

### Agent 5: Journal & Review Agent
- **Responsibility**: Generates end-of-session reviews, trade journal summaries, weekly performance analysis
- **Inputs**: All trade data, all OS scores, session history
- **Outputs**: Structured journal entries, performance summaries, trend analysis
- **When it runs**: End of session, on user request, weekly
- **Type**: LLM with structured output
- **Always-on**: No (event-triggered: session end, user request)
- **Dependencies**: All OS data, trade journal
- **Should be**: LLM with structured JSON output + templates

## Agents NOT Needed

The following systems should remain purely rules-based:

| System | Why no agent |
|--------|-------------|
| Order Layer Engine | 100% deterministic. Adding AI would introduce unpredictability to trading gates. |
| Session Phase Detection | Pure UTC time mapping. No ambiguity. |
| Gate System | Binary threshold checks. Must be deterministic for safety. |
| Danger Signal Generation | Deterministic pattern matching. Speed matters more than nuance. |
| Mission System | Template-based with variable injection. Rules are sufficient. |
| Readiness Score | Weighted formula. Must be reproducible and auditable. |
| Discipline Score | Cross-reference against defined rules. No interpretation needed. |
| Rule Adherence Tracking | Boolean check: did the trade match the rule or not? |
| Brain Zone Mapping | Formula-based activation from emotion data. |

---

# FEATURE-WITHIN-FEATURE BREAKDOWN {#sub-features}

## AI Copilot Sub-Features
1. **Signal Triage** -- Filters and ranks behavior signals. Rules engine.
2. **Mode Router** -- Selects conversation context. Rules engine.
3. **Context Builder** -- Assembles OS data into LLM-ready context. Rules engine.
4. **Response Generator** -- Produces coaching messages. LLM (Agent 1/2/3).
5. **Pipeline Visualizer** -- Renders intelligence pipeline. Pure UI.

## Psychology OS Sub-Features
1. **Mood Aggregator** -- Collects and averages mood check-ins. Rules engine.
2. **Emotion Classifier** -- Labels emotions from check-in data. Rules engine (predefined labels). Future: AI classifier.
3. **Pattern Detector** -- Identifies behavioral patterns (revenge, FOMO, etc.). Rules engine with threshold checks.
4. **Chain Builder** -- Maps cause-effect chains. Currently template-based. Future: AI-generated from trade data.
5. **Hemisphere Calculator** -- Determines left/right brain dominance. Rules engine (emotion-to-hemisphere mapping).
6. **Pace Analyzer** -- Builds 24h decision speed heatmap. Rules engine (time bucketing).
7. **Cortex Verditer** -- Produces final stability verdict. Rules engine (composite threshold).

## Strategy OS Sub-Features
1. **Rule Matcher** -- Cross-references trades against rules. Rules engine.
2. **Violation Logger** -- Records context of each violation. Rules engine + future AI for context extraction.
3. **Streak Tracker** -- Maintains consecutive adherence streaks. Rules engine.
4. **Entry Classifier** -- Categorizes order types. Rules engine.
5. **Exposure Calculator** -- Maps instrument-level risk. Rules engine.
6. **Correlation Detector** -- Identifies correlated positions. Rules engine. Future: statistical model.
7. **Gap Measurer** -- Computes intent vs action delta. Rules engine.

## Activity Live OS Sub-Features
1. **Session Phase Engine** -- UTC time to session mapping. Rules engine.
2. **Killzone Timer** -- Progress bar with elapsed/remaining. Rules engine.
3. **Question Generator** -- Produces context-aware questions. Rules engine (templates with variable injection).
4. **State Derivation** -- Computes system state from composite inputs. Rules engine.
5. **Directive Engine** -- Produces trading directive. Rules engine.
6. **Gate Builder** -- Creates blocking conditions. Rules engine.
7. **Mission Builder** -- Creates actionable tasks. Rules engine.
8. **Truth Strip** -- Selects dominant risk and primary correction. Rules engine.

---

# PRIORITY MAP {#priority-map}

## 1. MUST-HAVE NOW (Production V1)

| Feature | System | Type |
|---------|--------|------|
| Order Layer Engine (all 12 functions) | Unified | Rules engine |
| Session Phase Detection | Activity OS | Rules engine |
| Gate System (hard + soft gates) | Activity OS | Rules engine |
| Directive System | Activity OS | Rules engine |
| Danger Signal Generation | Unified | Rules engine |
| Mission System | Unified | Rules engine |
| Truth Strip | Unified | Rules engine |
| Readiness Score | Unified | Rules engine |
| Rule Adherence Tracking | Strategy OS | Rules engine |
| Discipline Score | Strategy OS | Rules engine |
| Stability Index | Psychology OS | Rules engine |
| Event Bus (telemetry pipeline) | Infrastructure | Event system |

## 2. SHOULD-HAVE SOON (Production V2)

| Feature | System | Type |
|---------|--------|------|
| AI Chat (single orchestrator + 3 specialists) | AI Copilot | LLM agents |
| Cause-Effect Chain generation from real trade data | Psychology OS | LLM (Agent 2) |
| Journal & Review generation | Activity OS | LLM (Agent 5) |
| Violation context extraction | Strategy OS | LLM (Agent 3) |
| Mood check-in system with emotion tagging | Psychology OS | UI + rules |
| Pre-session planning workflow | Strategy OS | UI + rules |

## 3. ADVANCED LATER (V3)

| Feature | System | Type |
|---------|--------|------|
| Emotion classification from trade patterns (no manual input) | Psychology OS | ML classifier |
| Correlation detection with statistical modeling | Strategy OS | Statistical model |
| Predictive pattern detection (will they revenge trade?) | Psychology OS | ML predictor |
| Session performance prediction | Activity OS | ML model |
| Adaptive coaching style (learns trader's response patterns) | AI Copilot | Reinforcement learning |

## 4. EXPERIMENTAL LATER (V4+)

| Feature | System | Type |
|---------|--------|------|
| Voice-based mood check-ins with sentiment analysis | Psychology OS | Speech-to-text + sentiment |
| Autonomous agent that monitors AND intervenes without user prompt | AI Copilot | Autonomous agent |
| Cross-user pattern comparison (anonymized) | All systems | Federated analytics |
| Market condition correlation with psychology state | Cross-system | ML |

---

# EXECUTIVE SUMMARY {#executive-summary}

## Total AI Agent Count: 5

1. **Orchestrator Agent** -- Routes queries, maintains context (LLM)
2. **Psychology Coach Agent** -- Emotional/behavioral coaching (LLM)
3. **Strategy Advisor Agent** -- Execution/discipline coaching (LLM)
4. **Session Intelligence Agent** -- Timing/session coaching (Hybrid: rules + LLM)
5. **Journal & Review Agent** -- Summaries and analysis (LLM)

## Features That Should NOT Use Separate Agents
- Order Layer Engine (12 functions -- all deterministic)
- Session Phase Detection
- Gate System
- Danger Signal Generation
- Mission System
- Truth Strip
- Readiness/Discipline/Stability scoring
- Rule Adherence Tracking
- Brain Zone Mapping

**These represent ~75% of the system's intelligence and are 100% rules-based.**

## Features That Should Be Merged Under One Intelligence Layer
- Psychology Coach + Cause-Effect Chain generation = **Psychology Agent**
- Strategy Advisor + Violation context extraction = **Strategy Agent**
- Session coaching + Journal generation could share context but should remain separate for latency reasons

## Features Requiring Specialized AI
- Natural language conversation (Orchestrator + 3 specialists)
- Journal generation from trade data (structured output LLM)
- Future: Emotion classification from behavioral patterns (ML classifier, not LLM)

## Features That Must Stay Deterministic
- Everything that touches trading permission (gates, directives, readiness)
- Everything that touches risk (exposure calculation, correlation detection)
- Everything that touches session timing (killzone detection, session phase)

**Reason**: Trading gates MUST be deterministic. If the system says "DO NOT TRADE," there must be zero ambiguity about why. An LLM hallucinating a gate open could cost real money.

## Smartest First Production Architecture

```
                         ┌───────────────┐
                         │  Orchestrator  │ (GPT-4o / Claude)
                         │  Agent         │
                         └───────┬───────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
            ┌───────┴──────┐ ┌──┴──────────┐ ┌┴──────────────┐
            │  Psychology  │ │  Strategy   │ │  Session      │
            │  Coach       │ │  Advisor    │ │  Intelligence │
            └──────────────┘ └─────────────┘ └───────────────┘
                    │            │            │
                    └────────────┼────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │   ORDER LAYER ENGINE    │ (Pure Rules)
                    │   12 deterministic      │
                    │   functions             │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
     ┌────────┴────────┐ ┌──────┴──────┐ ┌─────────┴────────┐
     │  Psychology OS   │ │ Strategy OS │ │  Activity OS     │
     │  (Rules Engine)  │ │ (Rules Eng) │ │  (Rules Engine)  │
     └─────────────────┘ └─────────────┘ └──────────────────┘
```

**V1 ships with**: All rules engines operational (no AI). The system fully functions with deterministic intelligence alone. Chat interface exists but returns templated responses based on state.

**V2 adds**: LLM-powered chat via 4 agents (Orchestrator + 3 specialists). The rules engine continues to make all safety-critical decisions. LLM agents provide coaching, explanation, and natural language interaction ON TOP OF the deterministic layer.

**This architecture ensures**: The system is useful from day 1 (rules-only), becomes powerful at V2 (rules + AI coaching), and becomes exceptional at V3+ (rules + AI + ML prediction).

---

*Document generated from codebase analysis of the NetworkApp trading platform.*
*Files analyzed: 48 components, 11 stores, 6 engine modules, 1 event bus, 4 analytics dashboards.*
