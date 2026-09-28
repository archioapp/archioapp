# PHASE 1 -- INVENTORY OF TRUTH

## The System As It Stands

The Copilot Right Rail is currently a 3-tab panel (`CopilotRightRail.tsx`):
- **Activity** tab -> `CopilotActivityConsole` (session intelligence engine, structured prompt categories, real-time session tracking)
- **Strategy** tab -> `StrategyAnalytics` (rules, mirror, exposure, DNA)
- **Psychology** tab -> `PsychologyAnalytics` (cortex, brain zones, interconnection map, emotion chapters, biases, journal)

Each tab is an isolated universe. They share zero state. The user must mentally merge three separate dashboards. There is no director -- only content.

---

## SIGNAL INVENTORY

### STRATEGY OS -- 28 signals

| # | Signal | Source | Current Value Pattern | Danger Threshold | What It Means |
|---|--------|--------|----------------------|------------------|---------------|
| 1 | `overallDiscipline` | `deriveStrategicMirror()` | 0-100 avg across all rule adherence scores | < 60 = critical | Single most important strategy metric. Gap between intent and action. |
| 2 | `riskGrade` | Composite of entry quality + structure depth + discipline + correlation | A/B/C/D | C or D = systemic execution failure | Letter grade the trader can immediately understand. |
| 3 | `entryQuality` | Limit ratio * 70 + (1 - market ratio) * 30 | 0-100 | < 50 = reactive execution, chasing entries | Measures HOW the trader enters -- patience vs impulsiveness. |
| 4 | `structureDepth` | HTF timeframe weight (H1/H4/D1/W1 usage ratio) | 0-100% | < 30 = no HTF backing = gambling | Measures whether decisions have higher-timeframe support. |
| 5 | `limitRatio` | limit orders / total orders | 0-1.0 | < 0.3 = impulsive, 0.7+ = sniper | Raw patience metric. Limit = planned. Market = reactive. |
| 6 | `exposureConcentration` | Top instrument count / total | 0-100% | > 50% = single-instrument tunnel vision | Diversification health. |
| 7 | `correlationRisk` | EUR-pair weight >= 50% | boolean | true = correlated blowup risk | Hidden risk most traders ignore. |
| 8 | `dominantCurrency` | Highest currency weight | string + % | > 35% = overweight | Which currency is pulling the portfolio. |
| 9 | `weeklyAdherence[7]` | Per-day discipline scores | 0-100 per day | Trend declining = discipline leak | The trend matters more than any single day. |
| 10 | `intentVsAction.gap` | intended (85) - actual discipline | 0-85 | > 15pt = disconnected | The lie detector -- what you planned vs what you did. |
| 11 | Per-rule `adherence` | 6 active rules, each 0-100% | Per rule | < 60% = rule is broken | Granular rule-by-rule tracking. |
| 12 | Per-rule `violations` | Count of violations | integer | > 3 in 28 days = pattern, not accident | Frequency reveals behavioral patterns. |
| 13 | Per-rule `streak` | Consecutive days following rule | integer | 0 = just broke it | Streaks build habits. Breaking streak = regression. |
| 14 | Per-rule `weeklyHistory[7]` | Binary (0/1) per day | array | Multiple 0s = systemic | Heatmap of commitment. |
| 15 | Per-rule `impactWhenFollowed` | R-multiple improvement | text + number | N/A | WHY following works -- hard evidence. |
| 16 | Per-rule `impactWhenBroken` | R-multiple cost | text + number | Any negative R | WHY breaking costs -- hard evidence. |
| 17 | Per-rule `violationLog` | Timestamped context entries | array | Today = active danger | The story behind each failure. |
| 18 | `executionIdentity` | SNIPER / HYBRID / REACTIVE / IMPULSIVE | string | REACTIVE or IMPULSIVE = leaking edge | The trader's execution archetype. |
| 19 | `avgSlippage` | Simulated from limit ratio | pips | > 1.0 = paying impatience tax | Cost of market orders. |
| 20 | `limitWinRate` vs `marketWinRate` | Simulated | 62% vs 38% | Market WR < 40% = chasing costs money | Proof that patience = profit. |
| 21 | `timingAccuracy` | limitRatio * 80 + 10 | 0-100 | < 50 = poor timing | Are entries at the right moment? |
| 22 | `emotionalEntries` | (1 - limitRatio) * 30 | count | > 10 = emotion-driven execution | Entries driven by feeling, not plan. |
| 23 | `planAdherence` | limitRatio * 85 + 10 | 0-100 | < 50 = ignoring own plan | Following the plan vs freelancing. |
| 24 | Per-currency `tierWeight` | OVERWEIGHT / HEAVY / BALANCED / LIGHT | tier | OVERWEIGHT = concentrated blowup risk | Exposure health per currency. |
| 25 | Per-pair `winRate` | Simulated | 0-100% | < 40% on any pair = leak | Which pairs make money, which don't. |
| 26 | Per-pair `totalPnl` | Simulated | % | Negative = stop trading this pair | Pair-level P&L truth. |
| 27 | Mirror `gapLabel` | ALIGNED / DRIFTING / DISCONNECTED | string | DISCONNECTED = intent vs action gap > 15pt | Weekly self-deception score. |
| 28 | Mirror daily cards | Per-day: forecasts, entries, rules kept/broken, sessions | object array | Days with 0 adherence = danger | The diary that cannot lie. |

### PSYCHOLOGY OS -- 42 signals

| # | Signal | Source | Danger Threshold | What It Means |
|---|--------|--------|------------------|---------------|
| 1 | `stabilityIndex` | moodBalance + consistencyBonus + decisionBonus | 0-100, < 40 = reactive | Master brain health score. |
| 2 | `stabilityLevel` | stable / elevated / reactive | reactive = stop trading | The traffic light. |
| 3 | `drawdownResponse` | aggressive / defensive / detached | aggressive = revenge loop active | How the brain reacts to losing. |
| 4 | `decisionLatency` | fast / measured / slow | fast = impulsive, dangerous | Time between seeing setup and clicking. |
| 5 | `revengeRisk` | clear / watch / warning / critical | warning+ = do not trade | The single most destructive pattern. |
| 6 | `cutWinnersRisk` | clear -> critical | warning+ = leaking winners | Silent edge killer. |
| 7 | `sizeEscalation` | clear -> critical | warning+ = account in danger | Position sizing discipline. |
| 8 | `overtradingRisk` | clear -> critical | warning+ = dopamine loop | Activity for activity's sake. |
| 9 | `emotionVolatility` | 0-100% | > 60% = mood swings affecting decisions | Emotional amplitude. |
| 10 | `disciplineScore` | 100 - penalty sum | 0-100, < 50 = broken | Psychology-derived discipline. |
| 11 | `consistencyStreak` | activeDays7d | < 3 = inconsistent tracking | Are they even showing up? |
| 12 | `paceShape` | front-loaded / distributed / back-loaded / erratic | erratic = random, no plan | Session rhythm fingerprint. |
| 13 | `dominantHemisphere` | left / right / balanced | right = emotional override | Which brain half is driving decisions. |
| 14 | `dominantEmotion` | Highest-frequency emotion | string | Negative dominant = state compromised | What's running the show. |
| 15 | `cortexVerdict` | Generated text | string | Contains "stop trading" = critical | The AI's blunt assessment. |
| 16 | `cortexVerdictLevel` | stable / elevated / reactive | reactive = red alert | Verdict severity. |
| 17 | `activeAlerts[]` | Generated from pattern severities | array of {message, severity, pattern} | Any critical = immediate action needed | Real-time warning system. |
| 18-24 | `leftBrainZones[3]` + `rightBrainZones[4]` | 7 brain zones with intensity, status, color | Any zone "critical" = compromised | Brain zone health map. |
| 25 | `causeEffectChains` | 4 chains: revenge, cutWinners, sizeEscalation, overtrading | Each has trigger -> emotion -> action -> result -> cost -> interrupt | The "why" behind destructive patterns. |
| 26-30 | `emotionChapters[5]` | FEAR, GREED, HOPE, FRUSTRATION, BOREDOM | Each has definition, markers, evidence, cost, protocol, drill, proof metric | Deep behavioral diagnosis per emotion. |
| 31 | `crossLayerImpacts[]` | Emotion -> Strategy impact bridges | array with R-cost | Any entry = emotion leaking into execution | The cross-OS bridge data. |
| 32 | `emotionTopology[]` | Emotion positions with angle, radius, when, interrupt | array | High-frequency negative emotions = danger | When each emotion appears and how to stop it. |
| 33-36 | `personalityTraits[4]` | Risk Appetite, Conscientiousness, Neuroticism, Openness | Each 0-100 with label and evidence | Extreme scores = personality-driven risk | Who the trader IS. |
| 37-42 | `behavioralBiases[6]` | Confirmation, Loss Aversion, Anchoring, Gambler's Fallacy, Availability, Hindsight | Each detected/severity/example/fix | Detected biases = cognitive blind spots | The invisible enemies. |

### ACTIVITY OS -- 18 signals

| # | Signal | Source | What It Means |
|---|--------|--------|---------------|
| 1 | `sessionPhase` | `getSessionPhase()` real-time UTC | Where in the trading day we are right now. |
| 2 | `killzone` active | boolean | Is this the right time to trade? |
| 3 | `subPhase` | Within-killzone timing | Precision timing within the session. |
| 4 | `kzProgress` | 0-1.0 elapsed ratio | How much time remains in current window. |
| 5 | `dayContext` | Day-of-week intelligence | Tuesday/Wednesday best, Friday worst. |
| 6 | `sessionBias` | Prior session OHLC direction | What the sessions are saying directionally. |
| 7 | Active instrument | `useInstrument()` | What the trader is currently looking at. |
| 8 | Active timeframe | `useInstrument()` | What zoom level they're analyzing. |
| 9 | Selected confluences | `useConfluenceStore()` | How many factors support the setup. |
| 10 | Session OHLC data | `useInstrument()` | Cross-session price delivery. |
| 11 | Structured prompts | `generatePromptCategories()` 4 categories | Contextual guidance system. |
| 12 | Event log | `useEventLog()` | The activity record. |
| 13 | Analysis count | `useAnalysis()` | Has the trader actually analyzed before trading? |
| 14 | `alertsToday` | Activity data counts | Volume of alerts. |
| 15 | `actionsCompleted` | Activity data counts | Response rate to signals. |
| 16 | `avgResponseTime` | Activity data counts | Decision speed on alerts. |
| 17 | `activityByHour[24]` | Hourly distribution | When they trade vs when they should. |
| 18 | `topCategories` | Alert category breakdown | What kind of alerts dominate. |

---

## DANGER SIGNALS (ranked by destruction potential)

### TIER 1 -- STOP TRADING (immediate)
| Signal | Condition | R-Cost/Week | Source |
|--------|-----------|-------------|--------|
| `revengeRisk` = critical | Score >= 8 | -6.3R/wk | Psychology |
| `sizeEscalation` = critical | Score >= 8 | CATASTROPHIC | Psychology |
| `cortexVerdictLevel` = reactive | 2+ critical patterns | Total system failure | Psychology |
| `stabilityIndex` < 40 | Composite below threshold | System unstable | Psychology |
| Rule r4 adherence = 61% | 6 violations, 0 streak | -8.4R/28d (largest single leak) | Strategy |

### TIER 2 -- REDUCE RISK (urgent)
| Signal | Condition | R-Cost/Week | Source |
|--------|-----------|-------------|--------|
| `cutWinnersRisk` = critical | Score >= 8 | -4.1R/wk | Psychology |
| `overtradingRisk` = critical | Count >= 4 | -4.7R/wk | Psychology |
| `riskGrade` = D | Composite below 30 | Systemic execution failure | Strategy |
| `correlationRisk` = true | EUR >= 50% | Correlated blowup | Strategy |
| Mirror = DISCONNECTED | Gap > 15pt | Self-deception active | Strategy |
| `dominantHemisphere` = right | Emotion > Logic by 15+ | Emotions driving decisions | Psychology |

### TIER 3 -- ATTENTION NEEDED (monitor)
| Signal | Condition | Source |
|--------|-----------|--------|
| `decisionLatency` = fast | < 3 min median | Psychology |
| `paceShape` = erratic | High activity variance | Psychology |
| Any rule adherence < 70% | Building but fragile | Strategy |
| `emotionVolatility` > 60% | Mood swings | Psychology |
| Trading outside killzone | Off-session activity | Activity |
| Zero confluences selected | No edge factors | Activity |

---

## READINESS SIGNALS (what indicates FIT TO TRADE)

| Signal | Condition | Weight |
|--------|-----------|--------|
| `stabilityLevel` = stable | stabilityIndex >= 65 | Critical |
| `revengeRisk` = clear | All revenge indicators clean | Critical |
| `dominantHemisphere` = left or balanced | Logic >= Emotion | High |
| `overallDiscipline` >= 75 | Following own rules | High |
| `riskGrade` = A or B | Execution framework solid | High |
| `executionIdentity` = SNIPER or HYBRID | Patience-based entries | Medium |
| `killzone` = true | In a valid trading window | Medium |
| `dayContext.quality` = high | Tuesday/Wednesday | Medium |
| Active confluences >= 2 | Multiple edge factors | Medium |
| `consistencyStreak` >= 5 | Showing up consistently | Low |

---

## IMPROVEMENT PRIORITIES (ranked by R-impact)

| # | Signal Cluster | R-Cost | Fix Path |
|---|---------------|--------|----------|
| 1 | Revenge trading loop | -6.3 to -8.4R/wk | Psychology frustration chain + cooldown -> Strategy "no trading after loss" rule |
| 2 | Cutting winners | -4.1R/wk | Psychology fear chapter -> Strategy exit rule enforcement |
| 3 | Overtrading | -4.7R/wk | Psychology boredom chapter -> Strategy session limits -> Activity killzone discipline |
| 4 | Intent-action gap | Root cause of above | Mirror truth -> Rule integrity -> Emotional stability |

---

## CROSS-OS CAUSAL CHAINS

```
PSYCHOLOGY                    STRATEGY                      ACTIVITY
──────────                    ────────                      ────────
Frustration ────────────────> Rule r4 violations ─────────> Revenge entries in log
  revengeRisk rises             adherence drops               outside-KZ trades
  causeEffectChain.revenge      discipline falls              rapid-fire entries

Fear ───────────────────────> Winners cut early ──────────> Short hold times
  cutWinnersRisk rises          exit rule adherence drops     TP never reached
  causeEffectChain.cutWinners   R-multiple compressed         early closes

Overconfidence ─────────────> Size escalation ────────────> Larger positions
  sizeEscalation rises          risk rule violations          less analysis
  ego zone critical             risk grade degrades           fewer confluences

Boredom ────────────────────> Overtrading ────────────────> High trade count
  overtradingRisk rises         session limit violations      off-KZ entries
  paceShape = erratic           entryQuality drops            boredom trades

Emotional Volatility ───────> All rules degrade ──────────> Erratic activity
  stabilityIndex drops          weeklyAdherence volatile      inconsistent sessions
  dominantHemisphere = right    intent-action gap widens      response time up
```

---

## ARCHITECTURE GAPS (what the Order Layer must solve)

1. **No unified state.** Strategy, Psychology, and Activity compute independently. No composite readiness signal exists.

2. **No director.** The panel presents content but cannot guide action -- no scroll-to-section, no open-relevant-zone, no step-by-step.

3. **No mission system.** Data shows WHAT is wrong but never says WHAT TO DO NEXT in an ordered, interactive sequence.

4. **No cross-OS awareness.** Psychology doesn't know killzone status. Strategy doesn't know emotional state. Activity doesn't know discipline score.

5. **No gates.** Nothing prevents trading when signals say stop. No cooldown protocol. No pre-session check.

6. **No unified reality feed.** Mirror timeline (Strategy), alerts (Activity), and journal (Psychology) are three separate event streams.

7. **No profile trajectory.** No "who you are becoming." No weekly arc. No identity evolution. Just snapshots.

---

## FILES TOUCHED -- NONE
## FILES UNTOUCHED -- ALL

Phase 1 is pure intelligence. Zero code changes.

---

## VERIFICATION

Read the inventory above. Every signal referenced exists in the codebase. Every danger threshold is derived from actual computation logic in `deriveBehavior()` and `deriveStrategicMirror()`. Every causal chain maps to an actual `causeEffectChain` object. Every gap is observable in the current tab-switching architecture.
