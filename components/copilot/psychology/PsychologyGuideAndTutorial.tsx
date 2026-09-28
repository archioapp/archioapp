"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Zap,
  Eye,
  Brain,
  Shield,
  Target,
  Crosshair,
  Layers,
  Fingerprint,
  Scan,
  Gauge,
  Settings2,
  Sparkles,
  AlertTriangle,
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Flame,
  HeartPulse,
  Radar,
  Wind,
  Anchor,
  Orbit,
  Radio,
  Lock,
  Compass,
  Timer,
  Waves,
  Hexagon,
  CircleDot,
} from "lucide-react"

// ═══════════════════════════════════════════════════════════════════
// PSYCHOLOGY MAPPING SYSTEM — COMPLETE INTERACTIVE TUTORIAL & GUIDE
// The deepest tutorial in the platform. 13 sections covering every
// pillar of the Neural Cortex 2.0 psychology operating system:
//   1.  Cortex Command Center (stability overview + cortex verdict)
//   2.  Brain Hemisphere Mapping (left/right hemisphere zones)
//   3.  Emotional Topology Field (emotion orbits + radar)
//   4.  Behavioral Pattern Detector (revenge, FOMO, overtrading, etc.)
//   5.  Mood Architecture Scanner (positive/negative balance)
//   6.  Decision Latency Analyzer (timing quality + pace shape)
//   7.  Cause-Effect Chain Tracer (trigger → emotion → action → result)
//   8.  Pitfall Intelligence Grid (ranked behavioral risks)
//   9.  Emotion Chapter Deep-Dives (per-emotion profiles + protocols)
//   10. Cross-Layer Impact Map (how psychology affects strategy & execution)
//   11. Personality & Bias Profiler (traits + cognitive biases)
//   12. Emotional Journal System (timestamped entries + P&L correlation)
//   13. Score Evolution Tracker (composite improvement + milestones)
// Each section has: live preview, description, how it works,
// what changes it, key elements, interactive actions, and perspective.
// ═══════════════════════════════════════════════════════════════════

interface PsychGuideSection {
  id: string
  title: string
  icon: typeof Brain
  color: string
  dataSource: "mood" | "emotions" | "pitfalls" | "behavior" | "composite" | "journal" | "biases" | "pace"
  description: string
  howItWorks: string
  whatChangesIt: string
  variationCount: string
  perspective: string
  componentRef: string
  livePreviewType: string
  interactiveButtons: { label: string; action: string; color: string }[]
  codeSignals: { name: string; value: string; type: "function" | "prop" | "state" }[]
  keyElements: { label: string; desc: string }[]
}

const PSYCH_GUIDE_SECTIONS: PsychGuideSection[] = [
  {
    id: "cortex-command",
    title: "Cortex Command Center",
    icon: Brain,
    color: "#8b5cf6",
    dataSource: "composite",
    description: "The Cortex Command Center is where you begin every psychological assessment. It is a single-glance diagnostic of your entire mental operating state. At its core sits the Stability Index -- a composite score derived from your mood balance, consistency of engagement, and decision timing quality. This number is not arbitrary. It synthesizes three independent data streams into one actionable truth: how stable is your psychological foundation right now? The Stability Index feeds directly into the Cortex Verdict -- a clinical assessment label that reads STABLE, ELEVATED, or REACTIVE. STABLE means your emotional baseline is supporting good trading decisions. ELEVATED means interference is present -- your emotions are influencing your behavior more than your system. REACTIVE means your limbic system has taken over -- you are making decisions from survival instinct, not from strategy. Around the central verdict, four diagnostic nodes radiate outward: Discipline Score measures how consistently you follow your own rules. Emotion Volatility tracks how erratic your emotional state has been. Consistency Streak shows how many consecutive days you have engaged with self-assessment. Decision Latency reveals whether you are making decisions too fast (impulsive), too slow (overthinking), or at the right pace (measured). Each node pulses with its own health indicator. Each can be hovered for deeper intelligence. Together, they form a neurological cockpit that tells you whether your mind is in a state that supports profitable trading or sabotages it. The most dangerous moment in trading is not a bad setup. It is a good setup executed by an unstable mind. The Cortex Command Center exists to prevent that.",
    howItWorks: "The system computes a Stability Index from three weighted inputs: mood balance (positive vs negative ratio weighted at 50%), consistency bonus (active days out of 7, weighted at 30%), and decision quality bonus (whether median decision time falls in the optimal 3-10 minute window, weighted at 20%). These three streams are independent -- mood data comes from check-ins, consistency from daily engagement records, and decision timing from trade entry analysis. The composite score maps to three stability levels: 65+ is STABLE, 40-64 is ELEVATED, below 40 is REACTIVE. The four diagnostic nodes each derive from separate behavioral computations: Discipline Score subtracts violation penalties (overtrading -10, rule-breaking -15, no stop loss -20, chasing -10). Emotion Volatility calculates the ratio of total emotion reports to mood check frequency. Consistency Streak counts consecutive active days. Decision Latency classifies median decision minutes into FAST (under 3min), MEASURED (3-8min), or SLOW (over 8min). Each node's color, pulse rate, and alert state update independently based on its own thresholds.",
    whatChangesIt: "Everything you log about your psychological state. Every mood check-in shifts the balance. Every day you engage (or skip) affects the streak. Every trade entry's timing contributes to the decision latency calculation. Every rule you follow or break adjusts the discipline score. The Command Center is not a static report -- it is a living readout that recalculates with every behavioral input. A single revenge trade can drop the Stability Index by 15 points. A single week of consistent mood logging can raise it by 20. The system rewards awareness and penalizes avoidance.",
    variationCount: "3 stability levels (STABLE/ELEVATED/REACTIVE), 4 diagnostic nodes each with 3-4 severity states, 5 psychological profiles producing dramatically different command center configurations -- 180+ unique visual states",
    perspective: "Open the Cortex Command Center before you look at a single chart. This is not optional guidance -- this is the most important pre-session ritual in your entire trading process. If the Cortex Verdict reads REACTIVE, you do not trade today. Full stop. No exception. No amount of perfect technical setup can compensate for an unstable psychological state. If it reads ELEVATED, you reduce your position size and tighten your rules. Only if it reads STABLE do you have full psychological clearance to operate. The four diagnostic nodes tell you exactly where to focus your attention. If Discipline Score is low, review your Rule Commitments before proceeding. If Emotion Volatility is high, you are emotionally scattered -- take 10 minutes of structured breathing before analyzing. If your Decision Latency reads FAST, you are likely to impulse-enter -- add a mandatory 5-minute pause between analysis and execution. The Command Center does not tell you what to trade. It tells you whether you should trade at all.",
    componentRef: "Your psychological clearance diagnostic",
    livePreviewType: "cortex-command",
    interactiveButtons: [
      { label: "Read Stability Index", action: "The central score synthesizes mood balance, engagement consistency, and decision timing into one composite number -- this is your psychological readiness score", color: "#8b5cf6" },
      { label: "Inspect Diagnostic Nodes", action: "Hover each of the four nodes to reveal its intelligence overlay -- severity, trend, thresholds, and specific behavioral data driving that metric", color: "#06b6d4" },
      { label: "Decode the Verdict", action: "The Cortex Verdict (STABLE / ELEVATED / REACTIVE) determines your trading clearance level -- understand what each state means for your permission to trade", color: "#10b981" },
      { label: "Track Stability Trend", action: "A 7-day sparkline shows whether your psychological baseline is improving, degrading, or holding steady -- the trend matters more than any single reading", color: "#f59e0b" },
    ],
    codeSignals: [
      { name: "deriveBehavior(data)", type: "function", value: "Master computation: takes raw PsychologyData (mood, emotions, pitfalls, pace) and derives the complete BehavioralState including stability index, all risk scores, brain zones, emotion topology, personality traits, biases, and journal correlations" },
      { name: "stabilityIndex", type: "state", value: "0-100 composite: (moodBalance * 0.5) + (consistencyBonus * 0.3) + (decisionBonus * 0.2) -- maps to STABLE (65+), ELEVATED (40-64), REACTIVE (<40)" },
      { name: "cortexVerdict", type: "state", value: "Clinical label derived from stabilityLevel -- determines the color, pulse rate, and alert state of the entire command center" },
      { name: "diagnosticNodes[]", type: "state", value: "4 independent metrics: disciplineScore, emotionVolatility, consistencyStreak, decisionLatency -- each with its own computation, thresholds, and visual state" },
    ],
    keyElements: [
      { label: "Stability Ring", desc: "The central score visualization -- fills from 0 to 100, changes color from red (reactive) through amber (elevated) to purple (stable), breathes with a pulse that reflects system awareness" },
      { label: "Cortex Verdict", desc: "STABLE means clear to trade. ELEVATED means trade with caution. REACTIVE means do not trade. This is your psychological clearance level." },
      { label: "Discipline Node", desc: "Measures rule compliance -- how consistently you follow your own behavioral commitments. Low scores indicate system breakdown." },
      { label: "Emotion Volatility Node", desc: "Tracks how scattered your emotional state is -- high volatility means your feelings are driving decisions, not your process." },
      { label: "Consistency Streak", desc: "How many consecutive days you have engaged with self-assessment. Gaps in awareness create blind spots in behavior." },
      { label: "Decision Latency", desc: "FAST means impulsive. MEASURED means optimal. SLOW means overthinking. Each has a different correction protocol." },
      { label: "Stability Trend", desc: "7-day sparkline showing trajectory -- an improving trend means your psychological discipline is compounding. A declining trend means something is eroding." },
      { label: "Alert Indicators", desc: "Pulsing warnings on any node that has crossed into warning or critical territory -- these demand attention before trading." },
    ],
  },
  {
    id: "hemisphere-mapping",
    title: "Brain Hemisphere Mapping",
    icon: Orbit,
    color: "#ec4899",
    dataSource: "behavior",
    description: "The Brain Hemisphere Mapping section visualizes your cognitive state as a split neural architecture -- left hemisphere representing analytical functions (Discipline, Patience, Structure) and right hemisphere representing emotional functions (Reactivity, Impulse Control, Emotional Load). This is not a metaphor. It is a functional decomposition of the two competing systems that operate in every trader's mind during live market conditions. The left hemisphere processes rules, structure, and planned behavior. The right hemisphere processes fear, excitement, urgency, and survival instinct. In a healthy trading state, the left hemisphere dominates -- decisions flow from analysis, not emotion. In a deteriorating state, the right hemisphere takes over -- decisions become reactive, impulsive, and driven by the limbic system. Each zone within each hemisphere carries an intensity score (0-100), a status classification (ACTIVE, ELEVATED, CRITICAL, or DORMANT), and a contextual description that explains what the current reading means for your behavior. The system also computes a Dominant Hemisphere indicator: LEFT means analytical processes are leading. RIGHT means emotional processes are leading. BALANCED means both systems are operating at comparable intensity. LEFT dominance is your target state. RIGHT dominance is a warning. The Brain Map makes the invisible visible -- you can literally see whether your rational mind or your emotional mind is winning the battle for control of your trading decisions.",
    howItWorks: "The system constructs 3 left-brain zones and 3 right-brain zones from behavioral data. Left zones: DISCIPLINE (computed from rule violations -- overtrading, rule-breaking, no stop loss, chasing), PATIENCE (computed from decision latency -- fast/measured/slow), STRUCTURE (computed from activity pace shape -- distributed/front-loaded/back-loaded/erratic). Right zones: REACTIVITY (computed from frustration + FOMO + overconfidence scores), IMPULSE CONTROL (inversely correlated with revenge risk and overtrading risk severity), EMOTIONAL LOAD (computed from negative mood percentage + fear/anxiety indicators). Each zone receives an intensity score (0-100), a status assignment based on thresholds (80+ ACTIVE, 50-79 ELEVATED, below 50 CRITICAL, 0 DORMANT), and a color coding (green for healthy, amber for warning, red for critical). The dominant hemisphere is determined by comparing average left-brain intensity against average right-brain intensity. The visualization renders these as positioned brain zones with size, glow, and pulse proportional to intensity.",
    whatChangesIt: "Your trading behavior and emotional state data. Every mood check-in contributes to emotional load calculations. Every trade timing contributes to patience and decision latency. Every rule violation affects discipline zones. Every pitfall recorded shifts the right hemisphere toward dominance. A week of disciplined trading produces a brain map dominated by green left-hemisphere zones. A week of reactive trading produces a map where right-hemisphere zones glow red and pulse with alerts. The shift between these states is gradual and cumulative -- the brain map reflects the rolling aggregate of your behavioral patterns.",
    variationCount: "6 brain zones (3 left, 3 right), each with 4 status levels and dynamic intensity scoring, plus 3 hemisphere dominance states -- producing 4,096+ unique brain map configurations across all psychological profiles",
    perspective: "The Brain Map answers the question that matters most before you trade: which mind is in control right now? If the left hemisphere is dominant (green, high intensity), your analytical processes are leading. You are in a state where your system can be trusted. If the right hemisphere is dominant (red/amber, elevated), your emotional system has gained too much influence. This does not mean you are a bad trader -- it means your neurochemistry is currently interfering with your decision-making. The fix is not willpower. The fix is structure: reduce position size, add waiting periods between analysis and execution, and review your rule commitments. Watch the zones over time. A trader whose PATIENCE zone improves from CRITICAL to ACTIVE over weeks is building genuine psychological edge -- not just skill, but the mental architecture to deploy skill under pressure. The Brain Map is your MRI. Read it honestly.",
    componentRef: "Your cognitive state neural architecture",
    livePreviewType: "hemisphere-map",
    interactiveButtons: [
      { label: "Inspect Brain Zones", action: "Hover each zone to see its intensity score, status classification, and contextual description -- understand exactly what is happening in each cognitive domain", color: "#ec4899" },
      { label: "Read Hemisphere Dominance", action: "The dominance indicator reveals whether analytical or emotional processes are leading -- LEFT is your target, RIGHT is a warning, BALANCED needs monitoring", color: "#8b5cf6" },
      { label: "Compare Left vs Right", action: "Side-by-side comparison of analytical versus emotional intensity -- the gap between them reveals how much influence your emotions have over your decisions", color: "#06b6d4" },
      { label: "Track Zone Evolution", action: "Watch how each zone's intensity changes across different psychological profiles -- from FOCUSED (left-dominant) to SPIRALING (right-dominant)", color: "#10b981" },
    ],
    codeSignals: [
      { name: "leftBrainZones[]", type: "state", value: "3 analytical zones: DISCIPLINE (rule compliance), PATIENCE (decision timing), STRUCTURE (activity distribution) -- each with intensity, status, color, description" },
      { name: "rightBrainZones[]", type: "state", value: "3 emotional zones: REACTIVITY (frustration/FOMO), IMPULSE CONTROL (inverse of revenge/overtrading risk), EMOTIONAL LOAD (negative mood + anxiety) -- each computed independently" },
      { name: "dominantHemisphere", type: "state", value: "'left' | 'right' | 'balanced' -- determined by comparing average intensities across hemispheres. Left dominance = analytical control. Right = emotional override." },
      { name: "zone.intensity", type: "prop", value: "0-100 score per zone that drives visual size, glow radius, pulse rate, and color saturation -- higher intensity = more influence on behavior" },
    ],
    keyElements: [
      { label: "Left Hemisphere", desc: "Your analytical processing center: Discipline, Patience, Structure. Green zones here mean your rational mind is in control. This is where profitable decisions originate." },
      { label: "Right Hemisphere", desc: "Your emotional processing center: Reactivity, Impulse Control, Emotional Load. Red/amber zones here mean emotions are driving decisions. This is where losses compound." },
      { label: "Zone Intensity", desc: "Size and glow of each zone proportional to its 0-100 intensity score. Larger, brighter zones have more influence on your current behavior." },
      { label: "Status Classification", desc: "ACTIVE (healthy, supporting good decisions), ELEVATED (interference detected, monitoring needed), CRITICAL (this zone is undermining your trading), DORMANT (inactive)." },
      { label: "Dominance Indicator", desc: "LEFT / RIGHT / BALANCED -- the single most important label on the brain map. LEFT dominance is your target. RIGHT dominance is an alert." },
      { label: "Zone Descriptions", desc: "Contextual text explaining what the current reading means: 'Rules followed consistently' vs 'Discipline breaking down' -- specific, not generic." },
    ],
  },
  {
    id: "emotion-topology",
    title: "Emotional Topology Field",
    icon: Radar,
    color: "#06b6d4",
    dataSource: "emotions",
    description: "The Emotional Topology Field maps your emotional landscape as a spatial force field. Each emotion you have reported is positioned as a radial node on a circular topology -- its distance from the center represents its intensity, its angle represents its category position, and its size represents its frequency of occurrence. This creates a visual fingerprint of your emotional state that is unique to you and changes over time. Unlike a simple list of emotions, the topology reveals relationships between emotions. Emotions clustered on one side of the field indicate emotional concentration -- you are experiencing a narrow band of feelings. Emotions distributed evenly suggest a more balanced (or scattered) emotional state. The dominant emotion sits at the highest intensity point and is highlighted with a pulsing glow. The system also maps when each emotion tends to appear and provides an interrupt protocol -- a specific behavioral instruction for breaking the emotional pattern before it affects your trading. The Topology Field is your emotional weather map. Before trading, you check the weather. This is the same principle applied to your internal state. A field dominated by one emotion at high intensity is like a storm warning. A field with moderate, distributed emotions is like clear skies. Read the topology before you read the chart.",
    howItWorks: "The system takes your top emotions data and computes a topology configuration. Each emotion is assigned an angle on a 360-degree circle (distributed evenly), a radius based on its value (higher value = further from center = more intense), a frequency score derived from its proportion of total reports, and a color based on whether the emotion supports or undermines trading. Emotions are classified into supportive (calm, focused, patient -- green/cyan tones) and disruptive (FOMO, frustration, fear, impatience -- amber/red tones). The dominant emotion is the one with the highest combined intensity and frequency. Each emotion node includes a 'when' descriptor (the typical trigger context) and an 'interrupt' protocol (the specific action to take when this emotion is detected). The field also renders connection lines between emotionally related nodes and a gradient background that shifts color based on the overall emotional temperature.",
    whatChangesIt: "Your mood check-ins and emotion reports. Every time you log an emotion, it either reinforces an existing node (increasing its intensity and pulling it further from center) or adds a new one. Consistent reporting of the same emotion over days causes its node to grow larger and glow brighter -- making the pattern impossible to ignore. If you stop reporting a previously dominant emotion, its node gradually shrinks. The topology is a rolling window of your emotional reality. Different psychological profiles produce radically different fields -- a FOCUSED trader shows a calm, centered field with supportive emotions dominant. A SPIRALING trader shows an explosive field with disruptive emotions at maximum intensity consuming the entire visualization.",
    variationCount: "4-8 emotion nodes per profile, each with unique position, size, intensity, color, trigger context, and interrupt protocol. 5 psychological profiles producing 5 completely different topological configurations -- from serene to volatile",
    perspective: "The Topology Field answers a question most traders refuse to ask: what am I actually feeling right now? Not what you think you feel. Not what you want to feel. What your data says you feel. If the dominant node is FRUSTRATION at high intensity, your next trade is likely a revenge trade. If it is FOMO, you are about to chase. If it is CALM CONFIDENCE, you are in a state that supports good decisions. Each node comes with an interrupt protocol -- a specific action designed to break the emotional pattern before it reaches your order entry. Read the interrupts. Apply them. The most powerful tool in your psychological arsenal is the ability to name the emotion, recognize it in the topology, and apply the prescribed interruption before it becomes a trade. This is not therapy. This is operational emotional intelligence applied to financial markets.",
    componentRef: "Your emotional state spatial visualization",
    livePreviewType: "emotion-topology",
    interactiveButtons: [
      { label: "Inspect Emotion Nodes", action: "Hover each node to see its intensity, frequency, typical trigger context, and the specific interrupt protocol designed to break that emotional pattern before it becomes a trade", color: "#06b6d4" },
      { label: "Read the Dominant", action: "The highest-intensity emotion is your current primary driver -- understanding what is dominant tells you what bias is most likely to influence your next decision", color: "#ec4899" },
      { label: "Compare Supportive vs Disruptive", action: "See the balance between emotions that support good trading and emotions that sabotage it -- the ratio reveals your emotional trading readiness", color: "#10b981" },
      { label: "Apply Interrupt Protocols", action: "Each disruptive emotion has a specific behavioral interruption -- a concrete action you take to prevent the emotion from reaching your execution", color: "#f59e0b" },
    ],
    codeSignals: [
      { name: "emotionTopology[]", type: "state", value: "Array of topology nodes: { label, value, angle, radius, color, when, interrupt } -- each positioned spatially based on intensity and category" },
      { name: "emotionOrbits[]", type: "state", value: "Orbital representation: { label, value, frequency, color } -- tracks each emotion's proportion of total reports and recurrence rate" },
      { name: "dominantEmotion", type: "state", value: "String label of the highest-intensity emotion -- determines the primary glow color and alert state of the topology field" },
      { name: "dominantEmotionColor", type: "state", value: "Color code of the dominant emotion -- propagates to the field gradient, alert indicators, and the central glow" },
    ],
    keyElements: [
      { label: "Emotion Nodes", desc: "Each reported emotion positioned spatially -- distance from center = intensity, size = frequency, color = supportive (green/cyan) or disruptive (red/amber)" },
      { label: "Dominant Highlight", desc: "The highest-intensity emotion receives a pulsing glow and enlarged visual presence -- this is what is most likely driving your next decision" },
      { label: "Interrupt Protocols", desc: "Per-emotion behavioral interruptions: specific actions to take when an emotion is detected before it reaches your order entry" },
      { label: "Trigger Contexts", desc: "When each emotion typically appears -- after losses, during drawdowns, approaching targets, in low volatility, etc." },
      { label: "Connection Lines", desc: "Links between emotionally related nodes showing how emotions cluster and reinforce each other" },
      { label: "Field Temperature", desc: "The overall gradient of the topology shifts from cool (supportive emotions dominant) to hot (disruptive emotions dominant)" },
      { label: "Frequency Indicators", desc: "How often each emotion recurs -- high frequency emotions are deeply embedded patterns, not one-off occurrences" },
      { label: "Category Balance", desc: "The visual distribution reveals whether you are emotionally concentrated (one feeling dominating) or distributed (multiple feelings competing)" },
    ],
  },
  {
    id: "pattern-detector",
    title: "Behavioral Pattern Detector",
    icon: AlertTriangle,
    color: "#ef4444",
    dataSource: "pitfalls",
    description: "The Behavioral Pattern Detector is the early warning system of the Neural Cortex. It continuously scans your behavioral data for four specific destructive patterns: Revenge Trading Risk, Cut Winners Risk, Size Escalation Risk, and Overtrading Risk. These are not abstract concepts. They are the four most statistically significant behavioral patterns that destroy trading accounts. Each pattern has its own detection algorithm, its own severity classification (CLEAR, WATCH, WARNING, CRITICAL), and its own visual alarm system. When a pattern reaches WARNING or CRITICAL, the detector activates an alert that is visible across the entire psychology dashboard. The detection is not based on your self-report -- it is computed from your actual behavioral data. Revenge Trading Risk scores high when FOMO counts, frustration counts, and overtrading pitfalls combine. Cut Winners Risk scores high when fear of losing is dominant and decision latency is too fast. Size Escalation Risk scores high when overconfidence is present alongside missing stop losses and rule-breaking. Overtrading Risk scores high when chasing and overtrading pitfall reports accumulate. The detector does not wait for you to notice the pattern. It computes severity before you see the damage. It is the difference between catching a behavioral fire at the match stage versus at the inferno stage.",
    howItWorks: "Each of the four patterns has a dedicated scoring algorithm. Revenge Trading: (FOMO_count * 2) + (frustration_count * 2) + (overtrading_pitfall * 3) = revengeScore. Score >= 8 = CRITICAL, >= 5 = WARNING, >= 2 = WATCH, else CLEAR. Cut Winners: (fear_count * 3) + (fast_decision_bonus * 2) = cutScore. Same thresholds. Size Escalation: (overconfidence * 3) + (no_SL * 3) + (rule_breaking * 2) = sizeScore. Same thresholds. Overtrading: overtrading_count + chasing_count -- >= 4 CRITICAL, >= 2 WARNING, >= 1 WATCH, else CLEAR. Each pattern's severity determines its visual state: CLEAR shows a dormant green indicator. WATCH shows a soft amber pulse. WARNING shows a bright amber pulsing alert. CRITICAL shows a red alarm with rapid pulsing and an expanded alert card describing the specific danger.",
    whatChangesIt: "The emotions and pitfalls you report. Every FOMO entry increases revenge risk. Every instance of frustration compounds it. Every overtrading report pushes that pattern toward CRITICAL. Every fear-of-losing check-in raises cut-winners risk. The patterns are mathematically derived from your logged behavioral data -- there is no subjective interpretation, no guesswork, no opinion. The system reads your data and computes the risk. Different psychological profiles produce dramatically different detector states: a FOCUSED trader shows all four patterns at CLEAR. A SPIRALING trader shows 3 or 4 patterns at CRITICAL with active alarms across the entire detector.",
    variationCount: "4 behavioral patterns, each with 4 severity levels (CLEAR/WATCH/WARNING/CRITICAL), producing 256 possible detector configurations across different profiles. Add alert cards, scoring breakdowns, and trend indicators for each pattern.",
    perspective: "The Pattern Detector is your behavioral circuit breaker. When any pattern reaches CRITICAL, that is not a suggestion to be careful -- that is a signal to stop trading immediately and investigate. The pattern that is hardest to detect is the one you are currently inside. Revenge trading feels like conviction when you are doing it. Overtrading feels like opportunity. Size escalation feels like confidence. The detector strips away the self-narrative and shows you the mathematical truth of your behavior. Check it before every session. If any pattern is at WARNING or above, reduce your activity. If any pattern is at CRITICAL, do not trade. Review the scoring breakdown to understand exactly which emotions and pitfalls are driving the elevation. Then address those specific inputs before your next session. The traders who survive long-term are not the ones who never feel these patterns -- they are the ones who detect them early enough to interrupt them.",
    componentRef: "Your destructive pattern early warning system",
    livePreviewType: "pattern-detector",
    interactiveButtons: [
      { label: "Scan All Patterns", action: "Review all four behavioral patterns simultaneously -- see which are CLEAR, which are at WATCH, and which have escalated to WARNING or CRITICAL", color: "#ef4444" },
      { label: "Decode Severity Scores", action: "Expand any pattern to see the exact mathematical scoring: which emotions and pitfalls contribute, how much each one weighs, and what pushes the score up or down", color: "#f59e0b" },
      { label: "Read Alert Cards", action: "When a pattern reaches WARNING or CRITICAL, an alert card appears with specific guidance on what the pattern means and how to interrupt it before it damages your account", color: "#8b5cf6" },
      { label: "Compare Across Profiles", action: "Switch between psychological profiles to see how FOCUSED vs REACTIVE vs SPIRALING traders produce completely different pattern detector configurations", color: "#06b6d4" },
    ],
    codeSignals: [
      { name: "revengeRisk", type: "state", value: "PatternSeverity computed from (FOMO*2 + frustration*2 + overtrading*3). Scores: 8+ CRITICAL, 5+ WARNING, 2+ WATCH, else CLEAR" },
      { name: "cutWinnersRisk", type: "state", value: "PatternSeverity computed from (fear*3 + fast_decision_bonus*2). Detects premature exit from winning trades driven by fear." },
      { name: "sizeEscalation", type: "state", value: "PatternSeverity computed from (overconfidence*3 + no_SL*3 + rule_breaking*2). Detects position size inflation." },
      { name: "overtradingRisk", type: "state", value: "PatternSeverity from overtrading_count + chasing_count. 4+ CRITICAL, 2+ WARNING, 1+ WATCH. The most common account killer." },
    ],
    keyElements: [
      { label: "Pattern Cards", desc: "Four dedicated cards -- one per destructive pattern. Each shows severity, score, contributing factors, and alert state." },
      { label: "Severity Indicators", desc: "Color-coded: green (CLEAR), amber pulse (WATCH), bright amber alert (WARNING), red alarm (CRITICAL). Pulse rate increases with severity." },
      { label: "Score Breakdowns", desc: "Expandable detail showing exactly which emotions and pitfalls contribute to each pattern's score -- forensic-level transparency." },
      { label: "Alert Cards", desc: "Activated at WARNING/CRITICAL -- describe the specific danger and provide actionable interruption steps." },
      { label: "Contributing Factors", desc: "Each pattern lists the specific emotional and behavioral inputs that are driving its score -- FOMO, frustration, fear, overconfidence, etc." },
      { label: "Pattern Trends", desc: "Direction indicators showing whether each pattern is escalating, stable, or de-escalating over your recent sessions." },
    ],
  },
  {
    id: "mood-architecture",
    title: "Mood Architecture Scanner",
    icon: HeartPulse,
    color: "#10b981",
    dataSource: "mood",
    description: "The Mood Architecture Scanner deconstructs your emotional balance into its simplest truth: what percentage of your recorded moods are positive, and what percentage are negative? This binary split is the foundation that everything else in the Neural Cortex builds upon. A positive-dominant mood balance (above 60% positive) creates a neurochemical environment that supports patience, measured risk-taking, and adherence to process. A negative-dominant balance (below 40% positive) creates an environment where fear drives early exits, frustration drives revenge trades, and anxiety drives overtrading. The scanner also tracks your mood check-in frequency (how many check-ins in the past 7 days), your active engagement days, and your median decision time. These three numbers contextualize the mood ratio: are you actually logging enough data for the ratio to be meaningful? Seven check-ins over 3 active days is very different from 14 check-ins over 7 active days. The system accounts for this. Below the primary ratio, a mood strip shows the daily positive/negative split for each of the past 7 days -- revealing whether your mood balance is consistent or oscillating. A trader who is 70% positive on Monday but 20% positive on Thursday is experiencing emotional instability that a weekly average would hide. The strip catches this.",
    howItWorks: "The scanner takes the moodMix7d data (positive count and negative count) and computes a simple ratio: positive / (positive + negative). This ratio becomes the primary percentage. It also reads counts.moodChecks7d (total check-ins), counts.activeDays7d (days with at least one check-in), and counts.medianDecisionMins (median time between seeing a setup and entering). The positive ratio determines the overall color: above 60% is green (supportive), 40-60% is amber (neutral), below 40% is red (hostile). The daily strip is derived by distributing the weekly mood data across 7 days based on activity patterns. Decision timing is classified independently: under 3 minutes is FAST (impulsive -- red), 3-8 minutes is MEASURED (optimal -- green), over 8 minutes is SLOW (overthinking -- amber).",
    whatChangesIt: "Your mood check-ins. Every positive mood entry increases the positive ratio. Every negative entry decreases it. The ratio is a simple running calculation -- no weighting, no normalization, just the raw truth of what you reported. This simplicity is deliberate. The mood ratio should be impossible to misinterpret. Active days and check-in frequency provide context: if you only checked in 3 times this week, the ratio is unreliable. The system signals this with a low-data warning. If you checked in 14 times across 7 days, the ratio is robust. Median decision time comes from a separate data stream (trade entry timing) but is displayed here because it is a direct indicator of psychological pace.",
    variationCount: "Continuous ratio from 0-100%, 3 mood balance classifications, 3 decision latency classifications, 7-day mood strips with individual day resolution, and data reliability indicators based on check-in frequency",
    perspective: "The Mood Architecture Scanner is your emotional weather station. Just as you would not go sailing in a storm, you should not trade in a negative mood state. If your positive ratio is below 40%, your psychology is working against you -- every decision you make is biased toward fear, frustration, or self-protection. In this state, even technically perfect setups will be poorly executed because your emotional system will sabotage the mechanics. If your ratio is above 60%, your mood is supporting your process. If it is between 40-60%, you are in neutral territory -- exercise caution and be particularly strict with your rules. The daily strip is critical: a consistent 70% across all 7 days is very different from oscillating between 90% and 30%. The oscillation indicates emotional instability that a weekly average would mask. Check the strip. Look for consistency. Consistency in mood predicts consistency in execution.",
    componentRef: "Your emotional balance and decision timing readout",
    livePreviewType: "mood-scanner",
    interactiveButtons: [
      { label: "Read Mood Ratio", action: "The primary percentage shows your positive-to-negative mood balance -- above 60% supports trading, below 40% undermines it, between is neutral territory", color: "#10b981" },
      { label: "Check Data Reliability", action: "Low check-in frequency makes the ratio unreliable -- the system warns when you have not logged enough data for meaningful psychological assessment", color: "#f59e0b" },
      { label: "Inspect Daily Strip", action: "Seven-day mood breakdown showing positive/negative split per day -- reveals oscillation patterns that a weekly average would hide", color: "#06b6d4" },
      { label: "Read Decision Timing", action: "Median decision time: FAST (impulsive), MEASURED (optimal), SLOW (overthinking) -- each indicates a different psychological state and requires a different correction", color: "#8b5cf6" },
    ],
    codeSignals: [
      { name: "posRatio", type: "state", value: "posCount / (posCount + negCount) -- the foundational mood ratio that determines your psychological baseline classification" },
      { name: "stabilityIndex", type: "state", value: "Composite: (moodBalance * 50%) + (consistencyBonus * 30%) + (decisionBonus * 20%) -- the mood ratio is the single largest contributor" },
      { name: "decisionLatency", type: "state", value: "'fast' (<3min) | 'measured' (3-8min) | 'slow' (>8min) -- derived from medianDecisionMins, indicates psychological pace" },
      { name: "moodMix7d", type: "prop", value: "Raw input: [{ label: 'Positive', value: N }, { label: 'Negative', value: N }] -- the simplest and most honest data in the system" },
    ],
    keyElements: [
      { label: "Positive Ratio", desc: "The primary percentage -- your emotional weather forecast. Above 60% = clear skies. Below 40% = storm warning." },
      { label: "Check-in Counter", desc: "How many mood check-ins in the past 7 days. Low numbers mean the ratio is unreliable. The system needs data to be truthful." },
      { label: "Active Days", desc: "How many of the past 7 days you engaged with self-assessment. Gaps in awareness create gaps in the data." },
      { label: "Decision Timing", desc: "Your median time from seeing a setup to entering. This is a direct readout of your psychological pace." },
      { label: "Daily Mood Strip", desc: "7-day breakdown showing per-day mood balance. Reveals oscillation patterns that weekly averages hide." },
      { label: "Data Reliability Warning", desc: "When check-in frequency is too low, the system warns that the mood ratio may not reflect your true state." },
    ],
  },
  {
    id: "decision-latency",
    title: "Decision Latency Analyzer",
    icon: Timer,
    color: "#f59e0b",
    dataSource: "pace",
    description: "How fast you make decisions under pressure is one of the most revealing psychological metrics in trading. The Decision Latency Analyzer tracks your median time between identifying a potential trade and executing it. This single number reveals more about your psychological state than almost any other metric. Under 3 minutes is FAST -- classified as impulsive. Your analytical system has not had time to complete its process. You are likely entering from emotion: FOMO, urgency, fear of missing out. Between 3 and 8 minutes is MEASURED -- the optimal window. Your brain has had time to complete its analytical process, check your rules, verify confluence, and make a conscious decision. Over 8 minutes is SLOW -- classified as overthinking. You have over-analyzed the setup, found reasons to doubt, and are likely to either miss the entry entirely or enter with reduced conviction at a worse price. The analyzer also maps your 24-hour activity pace -- a distribution chart showing at what hours of the day you are most active. This reveals whether your activity is structured (concentrated during killzones), front-loaded (heavy early, fading late), back-loaded (building intensity as the day progresses), or erratic (random bursts with no discernible pattern). The pace shape directly correlates with psychological state: structured activity indicates discipline, erratic activity indicates emotional reactivity.",
    howItWorks: "Decision latency is derived from the median decision minutes provided in the psychology data. The classification uses fixed thresholds: under 3 minutes = FAST (impulsive), 3-8 minutes = MEASURED (optimal), over 8 minutes = SLOW (overthinking). The 24-hour pace is computed from the pace24h array (24 values, one per hour). The system calculates variance across the distribution, splits activity into first half (00:00-11:59) and second half (12:00-23:59), and classifies the shape: variance > 3 = erratic, first_half_ratio > 65% = front-loaded, second_half_ratio > 65% = back-loaded, else = distributed. Peak activity hour and low activity hour are identified. The pace shape feeds back into the brain hemisphere mapping (STRUCTURE zone) and contributes to the overall stability calculation.",
    whatChangesIt: "Your trade entry timing and daily activity patterns. Every trade you take contributes to the median decision time calculation. Faster entries pull the median down toward FAST. More deliberate entries push it toward MEASURED or SLOW. Your 24-hour activity distribution changes as you trade at different hours. Concentrated killzone trading produces a structured pace shape. Random trading produces an erratic shape. The analyzer reflects the rolling truth of when and how quickly you make decisions -- it cannot be gamed because it is computed from actual timestamps.",
    variationCount: "3 latency classifications (FAST/MEASURED/SLOW), 4 pace shapes (structured/front-loaded/back-loaded/erratic), 24-hour activity distribution with per-hour resolution, peak and low activity markers",
    perspective: "Before every session, check your decision latency classification. If you are in FAST mode, you must add a mandatory pause between analysis and execution -- set a physical timer for 5 minutes after you identify a setup. Do not touch the order entry until it rings. If you are in SLOW mode, you are overthinking -- simplify your checklist. The trade either meets your criteria or it does not. Stop looking for additional confirmation that does not exist. If you are MEASURED, your pace is supporting your process. The 24-hour pace is equally important: if you are trading outside killzones (visible as activity spikes during off-hours), your pace shape will read ERRATIC, and your brain hemisphere STRUCTURE zone will deteriorate. Structure your day around the sessions that matter. The discipline of when you trade is as important as how you trade.",
    componentRef: "Your decision speed and daily rhythm analysis",
    livePreviewType: "decision-latency",
    interactiveButtons: [
      { label: "Read Latency Grade", action: "FAST / MEASURED / SLOW -- understand which classification you are in and what it means for your decision quality and emotional state", color: "#f59e0b" },
      { label: "Inspect 24H Pace", action: "See your hour-by-hour activity distribution -- identify whether you are trading during high-probability windows or scattering activity across low-quality hours", color: "#06b6d4" },
      { label: "Identify Pace Shape", action: "STRUCTURED (disciplined), FRONT-LOADED (morning heavy), BACK-LOADED (evening heavy), ERRATIC (random) -- each shape tells a different psychological story", color: "#10b981" },
      { label: "Find Peak Hours", action: "Your most active and least active hours reveal when your engagement peaks -- compare this with killzone windows to see if your rhythm aligns with institutional flow", color: "#8b5cf6" },
    ],
    codeSignals: [
      { name: "decisionLatency", type: "state", value: "'fast' | 'measured' | 'slow' -- derived from medianDecisionMins. Fast = impulsive risk. Slow = overthinking risk. Measured = optimal window." },
      { name: "paceShape", type: "state", value: "'front-loaded' | 'distributed' | 'back-loaded' | 'erratic' -- computed from variance analysis of 24h activity distribution" },
      { name: "peakActivityHour", type: "state", value: "The hour (0-23) with the highest activity count -- reveals when you are most engaged" },
      { name: "pace24h[]", type: "prop", value: "24-element array of activity counts per hour -- the raw input for pace shape computation and daily rhythm visualization" },
    ],
    keyElements: [
      { label: "Latency Classification", desc: "FAST (under 3min, impulsive), MEASURED (3-8min, optimal), SLOW (over 8min, overthinking). The single most important decision quality metric." },
      { label: "24-Hour Activity Chart", desc: "Per-hour activity distribution showing when you trade -- peaks should align with killzones, gaps should align with off-hours." },
      { label: "Pace Shape Label", desc: "STRUCTURED / FRONT-LOADED / BACK-LOADED / ERRATIC -- classifies your daily trading rhythm into one of four behavioral patterns." },
      { label: "Peak Hour Marker", desc: "Your most active hour -- if this is outside a killzone, your rhythm is misaligned with institutional flow." },
      { label: "Median Timer", desc: "The actual median minutes between setup identification and trade execution -- the raw number that drives everything." },
      { label: "Structure Zone Link", desc: "Your pace shape directly feeds into the Brain Hemisphere STRUCTURE zone -- erratic pace = critical structure, distributed = active structure." },
    ],
  },
  {
    id: "cause-effect-chains",
    title: "Cause-Effect Chain Tracer",
    icon: Wind,
    color: "#f97316",
    dataSource: "behavior",
    description: "The Cause-Effect Chain Tracer maps the complete behavioral sequence from trigger to consequence. Most traders see only the result: a loss. But losses do not happen in isolation. They are the end of a causal chain that begins with a trigger event, passes through an emotional response, produces a behavioral action, and ends in a trading result. The Chain Tracer makes every link in this chain visible, traceable, and interruptible. Each chain follows the same structure: TRIGGER (what happened) leads to EMOTION (what you felt), leads to ACTION (what you did), leads to RESULT (what happened). For example: Trigger = seeing a pair move without you. Emotion = FOMO (fear of missing opportunity). Action = market order without analysis. Result = stopped out in 8 minutes, -1R loss. But the chain does not stop there. The Tracer also includes a COST ESTIMATE (what this pattern typically costs per week if unchecked) and an INTERRUPT PROTOCOL (the specific behavioral intervention that breaks the chain before it reaches the ACTION stage). The power of the Chain Tracer is not in documenting losses -- it is in making the invisible causal structure visible so you can interrupt it at the EMOTION stage before it produces an ACTION. You cannot prevent triggers. You cannot control emotions. But you can interrupt the transition from emotion to action. That interruption is where psychological edge lives.",
    howItWorks: "The system generates cause-effect chains from a mapping function that takes the dominant emotions and pitfalls from your behavioral data. For each major behavioral pattern detected (revenge trading, FOMO chasing, fear-based exits, overconfidence sizing), it constructs a 6-element chain: trigger (the external event), emotion (the internal response), action (the behavioral output), result (the trading consequence), costEstimate (weekly cost if the pattern continues), and interruptProtocol (the specific intervention). The chains are rendered as connected flow diagrams where each link is a distinct visual node. Hovering any link highlights its connections upstream and downstream. The chain's color shifts from green (trigger, neutral) through amber (emotion, warning) to red (action + result, consequence). Critical chains -- those associated with CRITICAL-severity patterns -- receive pulsing alert borders.",
    whatChangesIt: "Your emotional and behavioral data. Different emotion profiles produce different chains. A FOMO-dominant profile generates chains centered on urgency-driven market orders. A frustration-dominant profile generates chains centered on revenge trades. A fear-dominant profile generates chains centered on premature exits. The chains are dynamically constructed from your actual data -- they are not pre-written templates. If your dominant emotion shifts from FOMO to frustration, the chains restructure accordingly. The tracer adapts to your evolving psychological reality.",
    variationCount: "4-6 cause-effect chains per profile, each with 6 linked nodes (trigger, emotion, action, result, cost estimate, interrupt protocol). Chains are unique to each psychological profile -- FOCUSED profiles produce minimal/dormant chains, SPIRALING profiles produce 4+ critical chains with maximum alert states.",
    perspective: "The Chain Tracer is where self-awareness becomes actionable. Reading the chain for a pattern you recognize is confronting -- you see the exact sequence that cost you money, laid out in forensic detail. But confrontation is the point. Once you can see the chain, you can break it. The interrupt protocol for each chain is the key: it is a specific, concrete action (not a vague suggestion) that you take at the EMOTION stage to prevent the chain from reaching ACTION. For example, the interrupt for a FOMO chain might be: 'Close the chart for 3 minutes. Set a limit order at your pre-analyzed level. If price does not come to you, it was never your trade.' This is not motivational advice -- this is a precise behavioral intervention designed to break a specific causal sequence. The traders who master the Chain Tracer do not stop feeling emotions. They stop letting emotions produce actions. That is the difference between awareness and control.",
    componentRef: "Your behavioral causality forensics",
    livePreviewType: "cause-effect",
    interactiveButtons: [
      { label: "Trace Full Chains", action: "Follow each chain from trigger through emotion and action to result -- see the complete causal sequence that produces your behavioral patterns", color: "#f97316" },
      { label: "Read Interrupt Protocols", action: "Each chain has a specific behavioral interruption at the emotion-to-action transition -- this is where you break the pattern before it becomes a trade", color: "#10b981" },
      { label: "Calculate Weekly Cost", action: "Each chain includes a cost estimate showing what this pattern costs you per week if left unchecked -- make the invisible cost visible", color: "#ef4444" },
      { label: "Identify Active Chains", action: "Chains associated with CRITICAL-severity patterns receive pulsing alerts -- these are the chains actively costing you money right now", color: "#8b5cf6" },
    ],
    codeSignals: [
      { name: "causeEffectChains", type: "state", value: "Record<string, CauseEffectChain> -- maps pattern names to their full 6-node chains: trigger, emotion, action, result, costEstimate, interruptProtocol" },
      { name: "CauseEffectChain", type: "state", value: "{ trigger: string, emotion: string, action: string, result: string, costEstimate: string, interruptProtocol: string } -- complete behavioral forensics for one pattern" },
      { name: "activeAlerts[]", type: "state", value: "Array of active alert objects: { message, severity, pattern } -- generated when patterns reach WARNING or CRITICAL, linked to specific chains" },
    ],
    keyElements: [
      { label: "Chain Flow Diagram", desc: "Connected nodes showing trigger → emotion → action → result. The visual flow makes the causal sequence impossible to ignore." },
      { label: "Trigger Node", desc: "The external event that starts the chain -- seeing a move, taking a loss, reading news, etc. You cannot control triggers." },
      { label: "Emotion Node", desc: "The internal response -- FOMO, frustration, fear, overconfidence. This is where you have the last opportunity to intervene." },
      { label: "Action Node", desc: "The behavioral output -- market order, doubled position, moved stop loss. By this point, the damage is in progress." },
      { label: "Result Node", desc: "The trading consequence -- loss, blown stop, account damage. The end of the chain and the cost of not interrupting." },
      { label: "Interrupt Protocol", desc: "Specific behavioral intervention at the emotion-action transition. Concrete, actionable, designed for that exact pattern." },
      { label: "Weekly Cost Estimate", desc: "What this pattern costs you per week if unchecked -- makes the abstract concept of behavioral cost into a concrete number." },
    ],
  },
  {
    id: "pitfall-grid",
    title: "Pitfall Intelligence Grid",
    icon: Shield,
    color: "#f59e0b",
    dataSource: "pitfalls",
    description: "The Pitfall Intelligence Grid ranks your reported behavioral risks by frequency and severity. Every pitfall you have logged -- overtrading, chasing trades, moving stop losses, revenge trading, early exits, FOMO entries, trading without a stop loss -- is displayed as a ranked card showing how often this behavior occurs relative to your total pitfall reports. The most frequent pitfall sits at the top with the largest visual weight. Each card includes the pitfall name, its percentage of total reports, a frequency bar, and an intensity indicator. This ranking is critical because it reveals your behavioral priorities -- not what you think your biggest problem is, but what your data says your biggest problem is. Many traders believe their biggest issue is something specific, but when the grid ranks their actual pitfall data, the real culprit is often different. The grid is not a guilt system. It is a diagnostic tool that directs your attention to the behaviors that are actually costing you the most. The top-ranked pitfall is your primary behavioral target -- the one behavior that, if corrected, would produce the largest improvement in your results.",
    howItWorks: "The system takes the topPitfalls array from your psychology data, computes total pitfall reports, and derives each pitfall's percentage of the total. Pitfalls are sorted by value (highest first) and rendered as ranked cards with visual bars proportional to their percentage. The top pitfall receives an enlarged card with additional context. Each pitfall's color is determined by its severity relative to the total: above 25% of total reports = critical (red), 15-25% = warning (amber), below 15% = watch (cyan). The grid updates dynamically as new pitfall data is added, re-ranking and re-sizing cards to reflect current behavioral reality.",
    whatChangesIt: "Your pitfall reports. Every time you log a behavioral pitfall, the grid re-ranks. A pitfall that was in 3rd place can move to 1st if you report it enough. A pitfall that was dominant can drop as you address it and report fewer instances. The grid is a living leaderboard of your behavioral risks -- the ranking changes as your behavior changes. Different psychological profiles produce dramatically different grids: a FOCUSED trader shows low-frequency pitfalls evenly distributed. A SPIRALING trader shows one or two pitfalls consuming 40-50% of total reports.",
    variationCount: "4-6 ranked pitfalls per profile, each with percentage, frequency bar, severity classification, and intensity indicators. Rankings shift dynamically across profiles.",
    perspective: "Your top pitfall is your primary target. Not your second. Not all of them at once. The top one. Behavioral change is most effective when focused on a single pattern. If Revenge Trading sits at 28% of your total pitfall reports, that one behavior is responsible for more than a quarter of your behavioral risk. Fix that one thing first. Do not try to address all pitfalls simultaneously -- that is a recipe for addressing none of them effectively. Once the top pitfall drops in percentage (meaning you are doing it less frequently), the grid will automatically promote the next one. This creates a natural progression: solve the biggest problem, watch the grid re-rank, then address the new top problem. Over time, the entire grid should show lower overall frequencies and more even distribution -- that is the visual signature of genuine behavioral improvement.",
    componentRef: "Your ranked behavioral risk directory",
    livePreviewType: "pitfall-grid",
    interactiveButtons: [
      { label: "Read the Rankings", action: "See your pitfalls ranked by actual frequency -- the top one is your primary behavioral target, not the one you think is worst, the one your data says is worst", color: "#f59e0b" },
      { label: "Check Severity", action: "Each pitfall is color-coded by severity: red (critical, >25% of reports), amber (warning, 15-25%), cyan (watch, <15%) -- focus on the reds first", color: "#ef4444" },
      { label: "Track Frequency Change", action: "Watch how pitfall percentages shift as you address specific behaviors -- a dropping percentage means your intervention is working", color: "#10b981" },
    ],
    codeSignals: [
      { name: "topPitfalls[]", type: "prop", value: "Ranked array: [{ label: string, value: number }] -- sorted by frequency, each value represents how many times this pitfall was reported" },
      { name: "pitfallPct", type: "state", value: "Each pitfall's percentage of total reports -- determines ranking position, bar width, and severity classification" },
      { name: "severity", type: "state", value: "Per-pitfall: >25% = critical (red), 15-25% = warning (amber), <15% = watch (cyan) -- drives color coding and alert state" },
    ],
    keyElements: [
      { label: "Ranked Cards", desc: "Each pitfall as a ranked card -- position, percentage, frequency bar, and severity indicator. Top card is largest with most visual emphasis." },
      { label: "Frequency Bars", desc: "Visual bars proportional to each pitfall's percentage of total reports. Longer bars mean higher frequency." },
      { label: "Severity Colors", desc: "Red = critical (>25%), amber = warning (15-25%), cyan = watch (<15%). The color tells you how urgent this pitfall is." },
      { label: "Top Pitfall Highlight", desc: "The highest-frequency pitfall receives enlarged card treatment with additional context -- this is your #1 behavioral target." },
      { label: "Ranking Order", desc: "Position in the grid reflects actual data, not self-assessment. Your biggest problem is at the top, whether you expected it there or not." },
    ],
  },
  {
    id: "emotion-chapters",
    title: "Emotion Chapter Deep-Dives",
    icon: Layers,
    color: "#a78bfa",
    dataSource: "emotions",
    description: "Emotion Chapters are the most comprehensive component of the Neural Cortex. Each emotion you have reported receives its own dedicated chapter -- a full profile that goes far beyond a label and a number. Each chapter contains: a clinical definition of the emotion in a trading context, specific behavioral markers that indicate this emotion is active, evidence from your data showing how this emotion manifests in your behavior, the estimated cost per week if this emotion drives trading decisions, a structured protocol for managing the emotion when it appears, a practical drill you can perform to build resistance, and a proof metric that tells you whether your intervention is working. This is not a feelings chart. This is an operational manual for every emotional state that affects your trading. Each chapter is expandable, revealing progressively deeper layers of intelligence. At the surface level, you see the emotion name, its intensity, and its color. One click reveals the definition and markers. Another click reveals the evidence, cost, protocol, drill, and proof metric. The system tracks every emotion independently, so you can see which emotions are improving (decreasing in intensity) and which are worsening (increasing). Over time, the chapters become your personal psychological playbook -- a reference manual built from your own data.",
    howItWorks: "The system generates emotion chapters from the deriveBehavior function, which maps each top emotion to a full EmotionChapter object. Each chapter includes: id (unique identifier), name (emotion label), color (visual coding), definition (clinical trading context), markers (array of behavioral indicators), evidence (data-derived observation), costPerWeek (estimated financial impact), protocol (array of sequential management steps), drill (practical exercise), proofMetric (measurable indicator of improvement), and intensity (0-100 current intensity level). The intensity determines visual presentation: high-intensity emotions receive larger, brighter cards with pulsing borders. Low-intensity emotions are visually subdued. The chapters are sorted by intensity by default but can be filtered by category (supportive vs disruptive). Each chapter's protocol is a structured sequence -- not generic advice, but ordered steps designed for that specific emotion.",
    whatChangesIt: "Your emotion reports. As you log emotions more or less frequently, chapter intensities adjust. An emotion that was at 80% intensity can drop to 40% if you stop reporting it. An emotion that was barely present can surge to dominance if it suddenly appears frequently. The chapters are live documents -- they evolve with your emotional data. The protocols and drills remain consistent (they are evidence-based interventions), but the intensity, evidence, and cost estimates update based on your current behavioral reality. Different psychological profiles produce completely different chapter configurations: a FOCUSED profile shows calm-confidence and patient-focus at high intensity with disruptive emotions dormant. A TILTED profile shows frustration and revenge at maximum intensity with supportive emotions nearly absent.",
    variationCount: "4-8 emotion chapters per profile, each with 7 layers of intelligence (definition, markers, evidence, cost, protocol, drill, proof metric). 5 profiles producing 35-40 unique chapter configurations with different intensity states.",
    perspective: "When an emotion appears in your trading session, open its chapter. Do not guess what to do. Read the protocol. The protocol is a step-by-step behavioral sequence designed for that exact emotional state. It is not a suggestion to 'calm down' or 'be disciplined' -- those are useless when your limbic system is active. The protocol gives you specific physical and behavioral actions: close the chart for X minutes, breathe in a specific pattern, review a specific rule, journal a specific observation, then reassess. The drill is for off-session practice: building emotional resistance before you need it, not during. The proof metric tells you whether your practice is working -- if the metric improves over weeks, your emotional management is genuinely improving. If it does not, you need to adjust the approach. Treat each chapter like a medical protocol for a specific condition. The emotion is the condition. The protocol is the treatment. The proof metric is the test result.",
    componentRef: "Your per-emotion operational intelligence manual",
    livePreviewType: "emotion-chapters",
    interactiveButtons: [
      { label: "Expand Chapter Profiles", action: "Open any emotion chapter to reveal its full 7-layer intelligence: definition, markers, evidence, cost, protocol, drill, and proof metric -- each layer builds on the last", color: "#a78bfa" },
      { label: "Read Protocols", action: "Step-by-step behavioral sequences for managing each emotion -- not generic advice, but ordered actions designed for that specific emotional state during live trading", color: "#10b981" },
      { label: "Calculate Emotional Cost", action: "Each chapter includes an estimated weekly cost if this emotion drives trading decisions -- making the abstract cost of emotional trading into a concrete financial number", color: "#ef4444" },
      { label: "Track Intensity Changes", action: "Compare emotion intensities across different profiles -- see how the same emotion can range from dormant to dominant depending on your psychological state", color: "#06b6d4" },
    ],
    codeSignals: [
      { name: "EmotionChapter", type: "state", value: "{ id, name, color, definition, markers[], evidence, costPerWeek, protocol[], drill, proofMetric, intensity } -- complete operational intelligence for one emotion" },
      { name: "emotionChapters[]", type: "state", value: "Array of all generated chapters, sorted by intensity. Each chapter is independently computed from your emotion data and behavioral patterns." },
      { name: "chapter.protocol[]", type: "prop", value: "Ordered array of management steps -- sequential, specific, actionable. Not suggestions. Instructions." },
      { name: "chapter.proofMetric", type: "prop", value: "Measurable indicator of improvement: 'Win rate on trades taken during calm state' or 'Revenge trades per week' -- concrete verification that your intervention is working" },
    ],
    keyElements: [
      { label: "Emotion Cards", desc: "Each emotion as an expandable card showing name, intensity, and color at surface level. Click to reveal the full chapter." },
      { label: "Clinical Definition", desc: "What this emotion means in a trading context -- not a dictionary definition, but how this emotion specifically manifests during market interaction." },
      { label: "Behavioral Markers", desc: "Observable signs that this emotion is active: physical (heart rate, breathing), cognitive (racing thoughts, tunnel vision), behavioral (rapid clicking, chart switching)." },
      { label: "Data Evidence", desc: "What your actual behavioral data shows about this emotion's impact -- computed from your entries, not self-reported." },
      { label: "Weekly Cost Estimate", desc: "The estimated financial impact of this emotion driving trading decisions over a week -- makes the abstract tangible." },
      { label: "Management Protocol", desc: "Sequential steps for handling this emotion when it appears: close chart, breathe, review rule, journal, reassess. Specific and ordered." },
      { label: "Practice Drill", desc: "Off-session exercise for building resistance to this emotion before you encounter it during live trading." },
      { label: "Proof Metric", desc: "How you verify your emotional management is improving -- a specific, measurable indicator tracked over time." },
    ],
  },
  {
    id: "cross-layer-impact",
    title: "Cross-Layer Impact Map",
    icon: Anchor,
    color: "#3b82f6",
    dataSource: "composite",
    description: "Psychology does not exist in isolation. Every emotion you experience ripples across your strategy, your execution, and your risk management. The Cross-Layer Impact Map makes these ripples visible. For each emotion detected in your profile, the map shows how it affects other layers of the platform: which strategy behaviors it distorts, which execution patterns it disrupts, which risk management rules it undermines. Each impact is accompanied by an estimated R-cost -- the quantified damage this emotional interference produces per occurrence. FOMO does not just feel bad -- it costs an average of -0.8R per trade because it produces market orders at suboptimal prices during non-killzone hours. Frustration does not just cause discomfort -- it costs -1.2R per trade because it leads to revenge trades with doubled position size. Fear does not just create hesitation -- it costs -0.5R per trade because it produces premature exits from winning positions. The Impact Map connects your psychology to your P&L with a direct causal line. This is where emotional awareness becomes financial intelligence.",
    howItWorks: "The system generates cross-layer impacts from the deriveBehavior function. Each impact object contains: the source emotion (which emotion is causing the impact), the impact description (what the emotion does to strategy, execution, or risk), the R-cost estimate (quantified damage per occurrence), and the color (matching the emotion's visual coding). Impacts are derived by mapping known emotional patterns to their typical trading consequences: FOMO maps to chasing entries, fear maps to premature exits, frustration maps to revenge trades, overconfidence maps to over-sizing. The R-cost estimates are computed from behavioral frequency and typical outcome data. The map renders each impact as a connection node between the psychology layer and the affected trading layer, with line thickness proportional to R-cost severity.",
    whatChangesIt: "Your emotion profile. Different dominant emotions produce different cross-layer impacts. A FOMO-dominant profile generates impacts centered on entry quality degradation. A fear-dominant profile generates impacts centered on premature exit costs. As your emotion profile shifts, the Impact Map restructures to show the new set of cross-layer effects. The R-cost estimates also adjust based on frequency -- an emotion that appears in 30% of your reports has a higher cumulative weekly cost than one at 10%.",
    variationCount: "3-6 cross-layer impacts per profile, each with source emotion, impact description, R-cost estimate, and visual connection. Different profiles produce entirely different impact configurations.",
    perspective: "The Cross-Layer Impact Map is the bridge between feeling and finance. It answers the question: what is this emotion actually costing me? Not in abstract terms, but in R-multiples per trade. When you see that FOMO costs -0.8R per occurrence, and you had 4 FOMO-driven trades this week, you can calculate: 4 * -0.8R = -3.2R lost to one emotion. That number is not theoretical -- it is the real cost of emotional trading, computed from your behavioral data. Use this map to prioritize which emotions to address first: the ones with the highest per-occurrence R-cost and the highest frequency. That combination tells you exactly where your psychology is leaking the most money. Fix that leak first. Then move to the next one.",
    componentRef: "Your emotion-to-P&L causal connection",
    livePreviewType: "cross-layer",
    interactiveButtons: [
      { label: "Trace Impact Lines", action: "Follow each impact from its source emotion to the trading layer it affects -- see exactly how psychology interferes with strategy, execution, and risk management", color: "#3b82f6" },
      { label: "Calculate R-Cost", action: "Each impact includes a per-occurrence R-cost estimate -- multiply by frequency to see total weekly emotional cost in real trading terms", color: "#ef4444" },
      { label: "Identify Highest-Cost Emotions", action: "Sort impacts by R-cost to find which emotions are costing you the most per occurrence -- target these for intervention first", color: "#f59e0b" },
    ],
    codeSignals: [
      { name: "crossLayerImpacts[]", type: "state", value: "Array of { emotion, impact, rCost, color } -- each entry maps a specific emotion to its trading consequence and financial cost" },
      { name: "rCost", type: "prop", value: "Per-occurrence R-cost estimate: '-0.8R', '-1.2R', '-0.5R' etc. -- the quantified damage each emotional pattern produces per trade" },
    ],
    keyElements: [
      { label: "Impact Nodes", desc: "Visual connections between emotions and trading layers, showing the path of psychological interference." },
      { label: "Source Emotion", desc: "Which emotion is causing the cross-layer impact -- the starting point of the causal chain." },
      { label: "Trading Consequence", desc: "What the emotion does to your trading behavior -- chasing entries, premature exits, over-sizing, rule-breaking." },
      { label: "R-Cost Estimate", desc: "Quantified financial damage per occurrence -- transforms abstract emotional concepts into concrete trading costs." },
      { label: "Cumulative Cost", desc: "Frequency * per-occurrence cost = weekly cost. This is the number that makes emotional management a financial priority." },
    ],
  },
  {
    id: "personality-profiler",
    title: "Personality & Bias Profiler",
    icon: Fingerprint,
    color: "#06b6d4",
    dataSource: "biases",
    description: "The Personality & Bias Profiler is a dual-layer analytical system. The first layer maps your trading personality across five core traits: Risk Tolerance (how much uncertainty you naturally embrace), Patience (your ability to wait for setups), Discipline (your consistency in following rules), Emotional Resilience (how quickly you recover from setbacks), and Adaptability (how well you adjust to changing market conditions). Each trait is scored 0-100 with a classification label and data-driven evidence explaining the score. The second layer scans for active cognitive biases: Loss Aversion, Confirmation Bias, Recency Bias, Anchoring, Overconfidence, and Sunk Cost Fallacy. Each bias is either DETECTED or NOT DETECTED based on your behavioral data. Detected biases include a severity classification (WATCH, WARNING, CRITICAL), a real example from your data showing how the bias manifested, and a specific fix protocol. The Profiler does not label you as a type. It maps you across a multi-dimensional space. A trader can be high in Risk Tolerance but low in Patience -- that combination produces specific behavioral patterns (large positions entered impulsively). A trader high in Discipline but low in Adaptability follows their system rigidly even when market conditions change. Every trait combination has implications, and the Profiler makes those implications explicit.",
    howItWorks: "Personality traits are derived from behavioral data: Risk Tolerance from position sizing patterns and drawdown response, Patience from decision latency and chasing frequency, Discipline from rule compliance and violation rates, Emotional Resilience from recovery speed after losses, Adaptability from how behavior changes across different market conditions. Each trait maps to a 0-100 score with thresholds for classification labels. Cognitive biases are detected by scanning for specific behavioral patterns: Loss Aversion is flagged when fear-of-losing reports exceed a threshold, Confirmation Bias when the trader only takes setups that confirm an existing position, Recency Bias when recent results disproportionately influence position sizing, etc. Each detected bias receives a severity based on how strongly the pattern appears in the data.",
    whatChangesIt: "Your behavioral data across all dimensions. Personality traits shift gradually as your trading behavior evolves. Biases are detected or cleared based on rolling behavioral patterns. A trader who improves their patience over weeks will see that trait score increase. A trader who overcomes loss aversion will see that bias clear. The Profiler is a living document that evolves with you.",
    variationCount: "5 personality traits each scored 0-100, 6 cognitive biases each with detected/not-detected status and 3 severity levels. Profiles produce dramatically different personality maps and bias configurations.",
    perspective: "The Personality Profiler is your psychological mirror. It shows you not who you want to be, but who your data says you currently are. If your Patience score is 35, that is not a judgment -- it is information. It tells you that your current behavioral patterns lean heavily toward quick decisions, and that building in mandatory waiting periods would likely improve your results. If Confirmation Bias is detected at WARNING severity, it means your data shows a pattern of selectively interpreting information to support existing positions. The fix protocol gives you specific steps to counter the bias. The Profiler is not static identity classification -- it is dynamic behavioral measurement. Your profile changes as your behavior changes. That is the point.",
    componentRef: "Your multi-dimensional psychological profile and bias scanner",
    livePreviewType: "personality-profiler",
    interactiveButtons: [
      { label: "Map Personality Traits", action: "See your 5-trait profile with scores, labels, and evidence -- understand the multi-dimensional shape of your trading personality", color: "#06b6d4" },
      { label: "Scan Cognitive Biases", action: "Review which biases are currently detected in your behavior, their severity, data examples, and specific fix protocols", color: "#ef4444" },
      { label: "Read Trait Evidence", action: "Each trait score is backed by specific behavioral evidence -- not opinion, but data-driven observations from your actual trading patterns", color: "#10b981" },
      { label: "Apply Bias Fixes", action: "Detected biases include specific fix protocols -- concrete behavioral changes that counter the cognitive distortion", color: "#f59e0b" },
    ],
    codeSignals: [
      { name: "personalityTraits[]", type: "state", value: "Array of { trait, score, label, evidence, color } -- 5 core traits each independently scored from behavioral data" },
      { name: "behavioralBiases[]", type: "state", value: "Array of { bias, detected, severity, example, color, fix } -- 6 cognitive biases scanned from behavioral patterns, each with fix protocol" },
    ],
    keyElements: [
      { label: "Trait Spectrum", desc: "5 personality traits displayed as spectrum bars (0-100) with classification labels. Each bar tells a different story about your trading personality." },
      { label: "Trait Evidence", desc: "Data-driven explanation for each score -- not what you reported, but what your behavior reveals." },
      { label: "Bias Cards", desc: "Detected cognitive biases as alert cards with severity, data example, and fix protocol. Undetected biases shown as cleared indicators." },
      { label: "Severity Indicators", desc: "WATCH / WARNING / CRITICAL per detected bias -- drives urgency of applying the fix protocol." },
      { label: "Fix Protocols", desc: "Specific behavioral changes for each detected bias -- concrete, actionable, measurable." },
    ],
  },
  {
    id: "emotional-journal",
    title: "Emotional Journal System",
    icon: Activity,
    color: "#ec4899",
    dataSource: "journal",
    description: "The Emotional Journal System is a timestamped record of your emotional experiences during trading sessions. Each entry captures the date, time, emotion felt, a personal note about the context, the emotional impact (positive, negative, or neutral), and optionally a reference to a specific trade. This is not a traditional trading journal focused on P&L and setups. This is a psychological journal focused on what you were feeling when you made decisions. Over time, the journal builds a cumulative emotional record that reveals patterns invisible in real-time: do your worst trades consistently happen when you feel a specific emotion? Do your best trades happen during a specific emotional state? Is there a time of day when negative emotions cluster? The journal also powers the Emotion-P&L Correlation analysis: a breakdown showing the average P&L outcome for trades taken during each emotional state. If trades taken during 'Calm Confidence' average +1.2R while trades taken during 'Frustration' average -0.8R, the financial case for emotional management becomes undeniable. The journal entries are displayed as a scrollable timeline with color-coded cards. Each card shows the emotion, the note, and the impact. Clicking a card reveals the full context including trade reference and session details.",
    howItWorks: "Journal entries are stored as structured objects: { id, date, time, emotion, color, note, impact, tradeRef? }. The system renders them as a chronological timeline with each entry as a colored card. Impact determines the card's accent: green for positive, red for negative, gray for neutral. The Emotion-P&L Correlation is computed by grouping entries by emotion, matching trade references to P&L outcomes, and calculating average R per emotion. This produces an array of { emotion, avgPnL, count, color } objects that directly link emotional states to financial results. The journal supports filtering by emotion, by impact, and by date range.",
    whatChangesIt: "Your journal entries. Every entry you add extends the timeline and feeds into the correlation analysis. More entries produce more reliable correlations. The system needs at least 5 entries per emotion to produce statistically meaningful P&L correlations. The journal is the only component in the Neural Cortex that relies on deliberate, manual input -- everything else is derived from automated behavioral data. This manual element is intentional: the act of writing about your emotions during trading is itself a therapeutic intervention that improves self-awareness.",
    variationCount: "5-15 journal entries per profile, each with unique date, time, emotion, note, and impact classification. P&L correlations across 4-6 emotions with per-emotion average outcomes.",
    perspective: "Write in the journal during trading, not after. The value of a journal entry is highest when the emotion is still active -- that is when your observation is most accurate. After the session, your memory reconstructs the emotional experience, and reconstruction is unreliable. In the moment, you know exactly what you feel. Write it down. Over weeks, the Emotion-P&L Correlation becomes your most powerful behavioral tool. When the data shows that trades taken during 'FOMO' average -0.6R while trades taken during 'Patient Focus' average +0.9R, the argument for emotional management is no longer philosophical -- it is financial. That 1.5R per-trade difference is the literal dollar value of psychological discipline. The journal makes this value visible.",
    componentRef: "Your timestamped emotional record and P&L correlator",
    livePreviewType: "emotion-journal",
    interactiveButtons: [
      { label: "Browse Timeline", action: "Scroll through your chronological emotional record -- see patterns of when and how your emotions shift across sessions and days", color: "#ec4899" },
      { label: "Read P&L Correlations", action: "See average trading outcomes per emotional state -- the most direct evidence of how your psychology affects your financial results", color: "#10b981" },
      { label: "Filter by Emotion", action: "Isolate entries for a specific emotion to see its pattern: when it appears, what triggers it, what trades it produces, and what outcomes result", color: "#06b6d4" },
      { label: "Track Improvement", action: "Compare entry frequency and impact trends over time -- fewer negative entries and more positive entries indicate genuine psychological progress", color: "#f59e0b" },
    ],
    codeSignals: [
      { name: "journalEntries[]", type: "state", value: "Array of { id, date, time, emotion, color, note, impact, tradeRef? } -- each entry is a timestamped emotional observation linked to trading context" },
      { name: "emotionPnLCorrelation[]", type: "state", value: "Array of { emotion, avgPnL, count, color } -- groups trades by emotional state at entry and computes average R outcome per emotion" },
    ],
    keyElements: [
      { label: "Timeline Cards", desc: "Chronological entries with date, time, emotion, note, and impact -- color-coded green (positive), red (negative), gray (neutral)." },
      { label: "P&L Correlation", desc: "Average R outcome per emotional state -- the direct financial evidence of how each emotion affects your trading results." },
      { label: "Trade References", desc: "Optional links to specific trades, connecting emotional entries to actual trading outcomes for causal analysis." },
      { label: "Emotion Filters", desc: "Isolate entries by emotion type to see the complete pattern for one specific emotional state across all sessions." },
      { label: "Impact Trend", desc: "The ratio of positive to negative entries over time -- improving ratio indicates genuine psychological progress." },
    ],
  },
  {
    id: "score-evolution",
    title: "Score Evolution Tracker",
    icon: TrendingUp,
    color: "#10b981",
    dataSource: "composite",
    description: "The Score Evolution Tracker is the longitudinal view of your psychological development. It tracks your composite psychological scores over time -- showing not where you are today, but the trajectory of where you are going. Each day produces a composite score (derived from all the systems above) and a delta (change from the previous day). The resulting timeline shows whether your psychological discipline is compounding, stagnating, or deteriorating. The tracker also manages milestones: specific psychological achievements that mark progress. Milestones include completing first 7-day mood streak, reducing top pitfall below 20%, achieving a STABLE cortex verdict for 3 consecutive days, clearing all cognitive biases, and maintaining LEFT hemisphere dominance for a full week. Each milestone is either achieved (with date) or pending, creating a progress map that gamifies psychological development without trivializing it. The improvement velocity metric shows the rate of score change over the past 7 days -- positive velocity means you are getting better, zero means you are plateauing, negative means you are regressing. Combined with current streak (consecutive days of improvement) and best streak (longest improvement run), the tracker creates a comprehensive picture of your psychological trajectory.",
    howItWorks: "Composite scores are an array of { day, score, delta } objects computed from daily psychological assessments. The score is the same Stability Index used in the Cortex Command Center, tracked daily. Delta is the difference between consecutive days. The improvement velocity is the average delta over the past 7 entries. Current streak counts consecutive positive deltas. Best streak is the historical maximum. Milestones are boolean checkpoints that trigger when specific conditions are met: 7-day mood check-in streak, top pitfall below 20%, 3 consecutive STABLE verdicts, all biases cleared, 5+ days of LEFT dominance. Achieved milestones display their unlock date. The tracker also computes and displays the emotion-P&L correlation data as context for the score trajectory -- showing that psychological improvement correlates with trading performance improvement.",
    whatChangesIt: "Your daily psychological engagement. Every day you engage with the Neural Cortex, a new data point is added to the evolution timeline. Consistent engagement produces a smooth trajectory. Gaps in engagement create discontinuities. The scores reflect the rolling state of all psychological systems: mood balance, emotional patterns, behavioral risks, decision quality, and discipline metrics. As each system improves or deteriorates, the composite score adjusts accordingly. Milestones unlock based on sustained performance -- not single-day achievements.",
    variationCount: "7-30 day score timelines, 5-8 milestones each with achieved/pending state, improvement velocity from -10 to +10, current and best streak counters, and emotion-P&L correlation context",
    perspective: "The Score Evolution Tracker answers the question that matters most over time: am I actually getting better, or just doing the same things repeatedly? A rising trajectory with positive velocity means your psychological interventions are working. A flat trajectory means you are maintaining but not improving -- time to review and adjust your approach. A declining trajectory is an alert: something in your behavioral pattern has deteriorated, and the other systems (Pattern Detector, Brain Map, Pitfall Grid) will tell you exactly what. The milestones are not trophies. They are checkpoints that confirm genuine behavioral change. Completing a 7-day mood streak means you have built a daily psychological engagement habit. Clearing all cognitive biases means your behavioral patterns no longer show bias signatures. Each milestone represents a structural improvement in your psychological architecture, not just a good day.",
    componentRef: "Your longitudinal psychological development trajectory",
    livePreviewType: "score-evolution",
    interactiveButtons: [
      { label: "Read Score Timeline", action: "See your composite psychological score over time -- each point represents a day's assessment, and the trajectory shows your development direction", color: "#10b981" },
      { label: "Track Milestones", action: "Review your psychological achievement milestones -- each one represents a structural improvement, not just a good session", color: "#f59e0b" },
      { label: "Measure Velocity", action: "Your improvement velocity shows the rate of change -- positive means compounding improvement, zero means plateau, negative means regression", color: "#06b6d4" },
      { label: "Compare Streaks", action: "Current streak vs best streak -- how your current run of consecutive improvements compares to your historical best", color: "#8b5cf6" },
    ],
    codeSignals: [
      { name: "compositeScores[]", type: "state", value: "Array of { day, score, delta } -- daily composite psychological scores with day-over-day change" },
      { name: "milestones[]", type: "state", value: "Array of { label, achieved, date? } -- psychological achievement checkpoints with completion status and unlock dates" },
      { name: "improvementVelocity", type: "state", value: "Average delta over past 7 entries -- positive = improving, 0 = plateauing, negative = regressing" },
      { name: "currentStreak / bestStreak", type: "state", value: "Consecutive days of positive score change (current) vs historical maximum (best)" },
    ],
    keyElements: [
      { label: "Score Timeline", desc: "Day-by-day composite scores rendered as a connected line chart -- rising = improvement, flat = plateau, falling = regression." },
      { label: "Daily Delta", desc: "Day-over-day change indicators showing whether each day improved (+) or regressed (-) from the previous day." },
      { label: "Milestone Cards", desc: "Achievement checkpoints: completed milestones show dates, pending milestones show what needs to happen to unlock them." },
      { label: "Velocity Indicator", desc: "Rate of improvement: the speed and direction of your psychological development, not just the current state." },
      { label: "Streak Counter", desc: "How many consecutive days you have improved -- building and maintaining streaks is how psychological discipline compounds." },
      { label: "P&L Context", desc: "Emotion-P&L correlation displayed alongside score trajectory -- showing the financial correlation of psychological improvement." },
    ],
  },
]


/* ══════════════════════════════════════════════════════════════════
   LIVE PREVIEW COMPONENTS
   Miniature animated representations of each Psychology section
   ══════════════════════════════════════════════════════════════════ */

function LivePreviewCortexCommand({ color }: { color: string }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const nodes = [
    { label: "DISCIPLINE", metric: "78%", subtext: "Rule compliance", color: "#10b981", alert: false, sparkline: [60, 65, 72, 70, 78, 75, 78] },
    { label: "VOLATILITY", metric: "42%", subtext: "Emotion scatter", color: "#f59e0b", alert: true, sparkline: [35, 40, 55, 48, 45, 42, 42] },
    { label: "STREAK", metric: "5d", subtext: "Consecutive", color: "#06b6d4", alert: false, sparkline: [1, 2, 3, 4, 5, 5, 5] },
    { label: "LATENCY", metric: "MEAS", subtext: "4.2min avg", color: "#8b5cf6", alert: false, sparkline: [8, 6, 5, 4, 4, 5, 4] },
  ]
  return (
    <div className="rounded-xl border overflow-hidden relative" style={{ borderColor: `${color}20`, backgroundColor: `${color}04` }}>
      <motion.div className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.02, 0.06, 0.02] }}
        transition={{ duration: 5, repeat: Infinity }}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
          style={{ backgroundColor: color, filter: "blur(40px)" }} />
      </motion.div>
      <div className="relative z-10 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-3.5 h-3.5" style={{ color: `${color}60` }} />
          <span className="text-[9px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${color}55` }}>Cortex Command Center</span>
          <div className="flex-1" />
          <motion.span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-md border"
            style={{ backgroundColor: "#f59e0b12", color: "#f59e0b80", borderColor: "#f59e0b25" }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity }}>ELEVATED</motion.span>
        </div>
        {/* Stability ring */}
        <div className="flex items-center justify-center mb-4">
          <motion.div className="relative" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="27" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
              <motion.circle cx="32" cy="32" r="27" fill="none" stroke={color} strokeWidth="3"
                strokeLinecap="round" strokeDasharray={2 * Math.PI * 27}
                initial={{ strokeDashoffset: 2 * Math.PI * 27 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 27 * 0.38 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                transform="rotate(-90 32 32)"
                style={{ filter: `drop-shadow(0 0 6px ${color}50)` }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span className="text-[16px] font-black tabular-nums" style={{ color }}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity }}>62</motion.span>
              <span className="text-[7px] font-mono font-bold text-white/30 uppercase tracking-widest">Elevated</span>
            </div>
          </motion.div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {nodes.map((n) => {
            const isHovered = hoveredNode === n.label
            return (
              <motion.div key={n.label}
                className="relative flex flex-col gap-1.5 px-3 py-2.5 rounded-lg border cursor-pointer overflow-hidden"
                style={{ borderColor: isHovered ? `${n.color}35` : `${n.color}15`, backgroundColor: isHovered ? `${n.color}10` : `${n.color}04` }}
                onMouseEnter={() => setHoveredNode(n.label)}
                onMouseLeave={() => setHoveredNode(null)}
                whileHover={{ scale: 1.02 }}>
                {n.alert && (
                  <motion.div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400"
                    animate={{ scale: [1, 1.8, 1], opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1, repeat: Infinity }} />
                )}
                <div className="flex items-center gap-2 relative z-10">
                  <span className="text-[8px] font-mono font-black uppercase tracking-wider" style={{ color: `${n.color}55` }}>{n.label}</span>
                  <div className="flex-1" />
                  <span className="text-[11px] font-mono font-black tabular-nums" style={{ color: n.color }}>{n.metric}</span>
                </div>
                <div className="flex items-center gap-2 relative z-10">
                  <span className="text-[8px] font-mono text-white/25">{n.subtext}</span>
                  <div className="flex-1" />
                  <svg width="32" height="10" viewBox="0 0 32 10" className="opacity-50">
                    <motion.polyline fill="none" stroke={n.color} strokeWidth="1" strokeLinecap="round"
                      points={n.sparkline.map((v, i) => `${(i / 6) * 32},${10 - (v / 100) * 10}`).join(" ")}
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.3 }} />
                  </svg>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function LivePreviewHemisphereMap({ color }: { color: string }) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)
  const leftZones = [
    { label: "DISCIPLINE", intensity: 78, color: "#10b981", status: "ACTIVE" },
    { label: "PATIENCE", intensity: 55, color: "#f59e0b", status: "ELEVATED" },
    { label: "STRUCTURE", intensity: 85, color: "#10b981", status: "ACTIVE" },
  ]
  const rightZones = [
    { label: "REACTIVITY", intensity: 42, color: "#f59e0b", status: "ELEVATED" },
    { label: "IMPULSE", intensity: 68, color: "#06b6d4", status: "ACTIVE" },
    { label: "EMO LOAD", intensity: 35, color: "#10b981", status: "ACTIVE" },
  ]
  return (
    <div className="rounded-xl border overflow-hidden relative" style={{ borderColor: `${color}20`, backgroundColor: `${color}04` }}>
      <div className="relative z-10 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Orbit className="w-3.5 h-3.5" style={{ color: `${color}60` }} />
          <span className="text-[9px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${color}55` }}>Brain Hemisphere Map</span>
          <div className="flex-1" />
          <span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-md border"
            style={{ backgroundColor: "#10b98112", color: "#10b98180", borderColor: "#10b98125" }}>LEFT DOMINANT</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <span className="text-[7px] font-mono font-black text-white/20 uppercase tracking-wider block text-center">Analytical</span>
            {leftZones.map(z => {
              const isHovered = hoveredZone === z.label
              return (
                <motion.div key={z.label}
                  className="px-2.5 py-2 rounded-lg border cursor-pointer"
                  style={{ borderColor: isHovered ? `${z.color}35` : `${z.color}15`, backgroundColor: isHovered ? `${z.color}08` : `${z.color}03` }}
                  onMouseEnter={() => setHoveredZone(z.label)}
                  onMouseLeave={() => setHoveredZone(null)}
                  whileHover={{ scale: 1.02 }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[7px] font-mono font-black" style={{ color: `${z.color}70` }}>{z.label}</span>
                    <span className="text-[9px] font-mono font-black tabular-nums" style={{ color: z.color }}>{z.intensity}</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: z.color }}
                      initial={{ width: 0 }} animate={{ width: `${z.intensity}%` }}
                      transition={{ duration: 0.8 }} />
                  </div>
                </motion.div>
              )
            })}
          </div>
          <div className="space-y-1.5">
            <span className="text-[7px] font-mono font-black text-white/20 uppercase tracking-wider block text-center">Emotional</span>
            {rightZones.map(z => {
              const isHovered = hoveredZone === z.label
              return (
                <motion.div key={z.label}
                  className="px-2.5 py-2 rounded-lg border cursor-pointer"
                  style={{ borderColor: isHovered ? `${z.color}35` : `${z.color}15`, backgroundColor: isHovered ? `${z.color}08` : `${z.color}03` }}
                  onMouseEnter={() => setHoveredZone(z.label)}
                  onMouseLeave={() => setHoveredZone(null)}
                  whileHover={{ scale: 1.02 }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[7px] font-mono font-black" style={{ color: `${z.color}70` }}>{z.label}</span>
                    <span className="text-[9px] font-mono font-black tabular-nums" style={{ color: z.color }}>{z.intensity}</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: z.color }}
                      initial={{ width: 0 }} animate={{ width: `${z.intensity}%` }}
                      transition={{ duration: 0.8 }} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function LivePreviewEmotionTopology({ color }: { color: string }) {
  const [hoveredEmotion, setHoveredEmotion] = useState<string | null>(null)
  const emotions = [
    { label: "Frustration", value: 28, angle: 45, color: "#ef4444" },
    { label: "FOMO", value: 22, angle: 120, color: "#f59e0b" },
    { label: "Calm", value: 18, angle: 210, color: "#10b981" },
    { label: "Anxiety", value: 16, angle: 280, color: "#ec4899" },
    { label: "Focus", value: 12, angle: 340, color: "#06b6d4" },
  ]
  return (
    <div className="rounded-xl border overflow-hidden relative" style={{ borderColor: `${color}20`, backgroundColor: `${color}04` }}>
      <div className="relative z-10 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Radar className="w-3.5 h-3.5" style={{ color: `${color}60` }} />
          <span className="text-[9px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${color}55` }}>Emotional Topology</span>
          <div className="flex-1" />
          <span className="text-[8px] font-mono font-bold text-white/20">Dominant: Frustration</span>
        </div>
        <div className="relative h-28 flex items-center justify-center">
          {/* Radar circles */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 120">
            <circle cx="100" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <circle cx="100" cy="60" r="35" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <circle cx="100" cy="60" r="20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          </svg>
          {emotions.map((e) => {
            const rad = (e.angle * Math.PI) / 180
            const dist = 15 + (e.value / 28) * 35
            const x = 100 + Math.cos(rad) * dist
            const y = 60 + Math.sin(rad) * dist
            const size = 4 + (e.value / 28) * 6
            const isHovered = hoveredEmotion === e.label
            return (
              <motion.div key={e.label}
                className="absolute cursor-pointer flex flex-col items-center"
                style={{ left: `${x / 2}%`, top: `${y / 1.2}%`, transform: "translate(-50%, -50%)" }}
                onMouseEnter={() => setHoveredEmotion(e.label)}
                onMouseLeave={() => setHoveredEmotion(null)}>
                <motion.div className="rounded-full"
                  style={{ width: size, height: size, backgroundColor: e.color, boxShadow: isHovered ? `0 0 12px ${e.color}50` : `0 0 4px ${e.color}25` }}
                  animate={isHovered ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.4 }} />
                <span className="text-[6px] font-mono font-bold mt-0.5" style={{ color: isHovered ? e.color : `${e.color}60` }}>{e.label}</span>
                {isHovered && (
                  <motion.span className="text-[7px] font-mono font-black" style={{ color: e.color }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{e.value}%</motion.span>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function LivePreviewPatternDetector({ color }: { color: string }) {
  const patterns = [
    { label: "Revenge Trading", severity: "WARNING", score: 6, color: "#f59e0b" },
    { label: "Cut Winners", severity: "WATCH", score: 3, color: "#06b6d4" },
    { label: "Size Escalation", severity: "CLEAR", score: 1, color: "#10b981" },
    { label: "Overtrading", severity: "CRITICAL", score: 9, color: "#ef4444" },
  ]
  return (
    <div className="rounded-xl border overflow-hidden relative" style={{ borderColor: `${color}20`, backgroundColor: `${color}04` }}>
      <div className="relative z-10 p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-3.5 h-3.5" style={{ color: `${color}60` }} />
          <span className="text-[9px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${color}55` }}>Pattern Detector</span>
          <div className="flex-1" />
          <motion.span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-md border"
            style={{ backgroundColor: "#ef444412", color: "#ef444480", borderColor: "#ef444425" }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}>2 ALERTS</motion.span>
        </div>
        <div className="space-y-1.5">
          {patterns.map(p => {
            const isCritical = p.severity === "CRITICAL"
            const isWarning = p.severity === "WARNING"
            return (
              <motion.div key={p.label} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg border"
                style={{ borderColor: isCritical ? `${p.color}30` : isWarning ? `${p.color}20` : "rgba(255,255,255,0.05)", backgroundColor: isCritical ? `${p.color}06` : "rgba(255,255,255,0.01)" }}>
                <motion.div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: p.color }}
                  animate={isCritical || isWarning ? { scale: [1, 1.8, 1], opacity: [1, 0.4, 1] } : {}}
                  transition={{ duration: isCritical ? 0.8 : 1.5, repeat: Infinity }} />
                <span className="text-[9px] font-mono font-bold text-white/40 flex-1">{p.label}</span>
                <span className="text-[7px] font-mono font-black px-1.5 py-0.5 rounded"
                  style={{ color: `${p.color}80`, backgroundColor: `${p.color}08`, border: `1px solid ${p.color}15` }}>{p.severity}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function LivePreviewGeneric({ color, icon: Icon, title, items }: { color: string; icon: typeof Brain; title: string; items: { label: string; value: string; barPct: number }[] }) {
  return (
    <div className="rounded-xl border overflow-hidden relative" style={{ borderColor: `${color}20`, backgroundColor: `${color}04` }}>
      <div className="relative z-10 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-3.5 h-3.5" style={{ color: `${color}60` }} />
          <span className="text-[9px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${color}55` }}>{title}</span>
        </div>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[8px] font-mono font-bold text-white/35">{item.label}</span>
                <span className="text-[9px] font-mono font-black" style={{ color }}>{item.value}</span>
              </div>
              <div className="h-1 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
                  initial={{ width: 0 }} animate={{ width: `${item.barPct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const PSYCH_PREVIEW_COMPONENTS: Record<string, React.FC<{ color: string }>> = {
  "cortex-command": LivePreviewCortexCommand,
  "hemisphere-map": LivePreviewHemisphereMap,
  "emotion-topology": LivePreviewEmotionTopology,
  "pattern-detector": LivePreviewPatternDetector,
  "mood-scanner": ({ color }) => <LivePreviewGeneric color={color} icon={HeartPulse} title="Mood Architecture" items={[{ label: "Positive", value: "62%", barPct: 62 }, { label: "Negative", value: "38%", barPct: 38 }, { label: "Check-ins", value: "11", barPct: 78 }, { label: "Active Days", value: "6/7", barPct: 86 }]} />,
  "decision-latency": ({ color }) => <LivePreviewGeneric color={color} icon={Timer} title="Decision Latency" items={[{ label: "Median Time", value: "4.2 min", barPct: 52 }, { label: "Classification", value: "MEASURED", barPct: 70 }, { label: "Peak Hour", value: "14:00", barPct: 58 }, { label: "Pace Shape", value: "DISTRIBUTED", barPct: 85 }]} />,
  "cause-effect": ({ color }) => <LivePreviewGeneric color={color} icon={Wind} title="Cause-Effect Chains" items={[{ label: "FOMO Chain", value: "Active", barPct: 75 }, { label: "Revenge Chain", value: "Warning", barPct: 60 }, { label: "Fear Chain", value: "Watch", barPct: 35 }, { label: "Overconfidence", value: "Clear", barPct: 10 }]} />,
  "pitfall-grid": ({ color }) => <LivePreviewGeneric color={color} icon={Shield} title="Pitfall Rankings" items={[{ label: "Revenge Trading", value: "28%", barPct: 100 }, { label: "FOMO Entry", value: "22%", barPct: 78 }, { label: "Overtrading", value: "18%", barPct: 64 }, { label: "Moving SL", value: "16%", barPct: 57 }]} />,
  "emotion-chapters": ({ color }) => <LivePreviewGeneric color={color} icon={Layers} title="Emotion Chapters" items={[{ label: "Frustration", value: "Int: 82", barPct: 82 }, { label: "FOMO", value: "Int: 68", barPct: 68 }, { label: "Calm Focus", value: "Int: 55", barPct: 55 }, { label: "Anxiety", value: "Int: 42", barPct: 42 }]} />,
  "cross-layer": ({ color }) => <LivePreviewGeneric color={color} icon={Anchor} title="Cross-Layer Impact" items={[{ label: "FOMO → Entry Quality", value: "-0.8R", barPct: 70 }, { label: "Frustration → Revenge", value: "-1.2R", barPct: 90 }, { label: "Fear → Early Exit", value: "-0.5R", barPct: 45 }]} />,
  "personality-profiler": ({ color }) => <LivePreviewGeneric color={color} icon={Fingerprint} title="Personality Profile" items={[{ label: "Risk Tolerance", value: "62", barPct: 62 }, { label: "Patience", value: "45", barPct: 45 }, { label: "Discipline", value: "78", barPct: 78 }, { label: "Resilience", value: "55", barPct: 55 }]} />,
  "emotion-journal": ({ color }) => <LivePreviewGeneric color={color} icon={Activity} title="Emotional Journal" items={[{ label: "Entries This Week", value: "12", barPct: 80 }, { label: "Positive Impact", value: "58%", barPct: 58 }, { label: "Negative Impact", value: "33%", barPct: 33 }, { label: "P&L Correlation", value: "+0.4R", barPct: 65 }]} />,
  "score-evolution": ({ color }) => <LivePreviewGeneric color={color} icon={TrendingUp} title="Score Evolution" items={[{ label: "Current Score", value: "62", barPct: 62 }, { label: "7d Velocity", value: "+2.3", barPct: 58 }, { label: "Current Streak", value: "5 days", barPct: 71 }, { label: "Milestones", value: "3/8", barPct: 37 }]} />,
}


// ═══════════════════════════════════════════════════════════════════
// PSYCHOLOGY TUTORIAL OVERLAY
// ═══════════════════════════════════════════════════════════════════

function PsychologyTutorialOverlay({
  onClose,
  onStartDemo,
}: {
  onClose: () => void
  onStartDemo: () => void
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)

  const totalSteps = PSYCH_GUIDE_SECTIONS.length + 1
  const isLast = currentStep === totalSteps - 1
  const isWelcome = currentStep === 0

  const guideSection = isWelcome ? null : PSYCH_GUIDE_SECTIONS[currentStep - 1]
  const stepColor = isWelcome ? "#8b5cf6" : guideSection!.color
  const StepIcon = isWelcome ? Hexagon : guideSection!.icon
  const PreviewComponent = guideSection ? PSYCH_PREVIEW_COMPONENTS[guideSection.livePreviewType] : null
  const dataSourceColor = guideSection
    ? guideSection.dataSource === "composite" ? "#8b5cf6" : guideSection.dataSource === "mood" ? "#10b981" : guideSection.dataSource === "emotions" ? "#06b6d4" : guideSection.dataSource === "pitfalls" ? "#f59e0b" : guideSection.dataSource === "behavior" ? "#ec4899" : guideSection.dataSource === "pace" ? "#f59e0b" : guideSection.dataSource === "biases" ? "#06b6d4" : guideSection.dataSource === "journal" ? "#ec4899" : "#8b5cf6"
    : "#8b5cf6"
  const dataSourceLabel = guideSection
    ? guideSection.dataSource === "composite" ? "COMPOSITE" : guideSection.dataSource === "mood" ? "MOOD DATA" : guideSection.dataSource === "emotions" ? "EMOTIONS" : guideSection.dataSource === "pitfalls" ? "PITFALLS" : guideSection.dataSource === "behavior" ? "BEHAVIOR" : guideSection.dataSource === "pace" ? "PACE DATA" : guideSection.dataSource === "biases" ? "BIASES" : guideSection.dataSource === "journal" ? "JOURNAL" : "COMPOSITE"
    : ""

  const goNext = () => {
    if (isLast) { onStartDemo(); onClose(); return }
    setCurrentStep(currentStep + 1)
  }
  const goPrev = () => { if (currentStep > 0) setCurrentStep(currentStep - 1) }

  return (
    <motion.div className="absolute inset-0 z-[60] flex flex-col bg-[#06080c]"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>

      {/* Header */}
      <div className="flex-shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute inset-0"
            style={{ background: `radial-gradient(ellipse 80% 100% at 20% 0%, ${stepColor}09, transparent)` }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute inset-y-0"
            style={{ width: 1, background: `linear-gradient(to bottom, transparent, ${stepColor}0d, transparent)` }}
            animate={{ left: ["-5%", "105%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(to right, transparent, ${stepColor}1a, transparent)` }} />
        <div className="relative px-4 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: stepColor }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }} />
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[13px] font-mono font-black text-white/65 uppercase tracking-wider">
                    Psychology Mapping Tutorial
                  </span>
                  <span className="text-[8px] font-mono font-black px-2 py-0.5 rounded-md border"
                    style={{ backgroundColor: `${stepColor}10`, color: `${stepColor}60`, borderColor: `${stepColor}15` }}>
                    {currentStep + 1} / {totalSteps}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-white/25 ml-0.5">
                  {isWelcome ? "Master the Neural Cortex 2.0 -- your mind operating system" : guideSection!.componentRef}
                </span>
              </div>
            </div>
            <motion.button onClick={onClose}
              className="text-[8px] font-mono font-black text-white/20 hover:text-white/50 uppercase tracking-wider px-3 py-1.5 rounded-lg border border-white/[0.06] hover:border-white/[0.12] transition-all"
              whileTap={{ scale: 0.95 }}>SKIP</motion.button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex-shrink-0 px-4 pb-3">
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <motion.div key={i} className="flex-1 h-[3px] rounded-full overflow-hidden cursor-pointer"
              style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
              onClick={() => setCurrentStep(i)}>
              <motion.div className="h-full rounded-full"
                style={{ backgroundColor: i <= currentStep ? stepColor : "transparent" }}
                initial={{ width: 0 }}
                animate={{ width: i <= currentStep ? "100%" : "0%" }}
                transition={{ duration: 0.4, delay: i === currentStep ? 0.2 : 0 }} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-terminal">
        <AnimatePresence mode="wait">
          <motion.div key={currentStep}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>

            {isWelcome ? (
              <div className="px-4 pb-6">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-5 relative overflow-hidden">
                  <motion.div className="absolute inset-0 pointer-events-none"
                    animate={{ opacity: [0, 0.02, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}>
                    <div className="absolute left-0 top-0 w-40 h-40 rounded-full"
                      style={{ backgroundColor: "#8b5cf6", filter: "blur(50px)" }} />
                    <div className="absolute right-0 bottom-0 w-32 h-32 rounded-full"
                      style={{ backgroundColor: "#ec4899", filter: "blur(40px)" }} />
                  </motion.div>
                  <div className="relative space-y-4">
                    <div className="flex items-center gap-2.5">
                      <motion.div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-400/8 border border-violet-400/15"
                        animate={{ boxShadow: ["0 0 12px rgba(139,92,246,0.04)", "0 0 20px rgba(139,92,246,0.1)", "0 0 12px rgba(139,92,246,0.04)"] }}
                        transition={{ duration: 4, repeat: Infinity }}>
                        <Brain className="w-5 h-5 text-violet-400/60" />
                      </motion.div>
                      <div>
                        <h3 className="text-[16px] font-mono font-black text-white/70 uppercase tracking-wider">
                          Neural Cortex 2.0
                        </h3>
                        <p className="text-[10px] font-mono text-white/25 mt-0.5">{"The Mind Operating System for serious traders"}</p>
                      </div>
                    </div>

                    <p className="text-[13px] text-white/40 leading-[1.8]">
                      {"The Neural Cortex is not a mood tracker. It is a neuroscience laboratory built inside a trading terminal. It does not ask how you feel -- it computes your psychological state from behavioral data and presents it as a clinical diagnostic. Thirteen interconnected systems map every dimension of your mental operating state: the Cortex Command Center gives you a 5-second psychological clearance assessment. The Brain Hemisphere Map shows whether your analytical or emotional mind is in control. The Emotional Topology Field visualizes your feelings as a spatial force field. The Behavioral Pattern Detector scans for four specific destructive patterns. The Mood Architecture Scanner tracks your positive-negative balance. The Decision Latency Analyzer reveals whether you are impulsive, measured, or overthinking. The Cause-Effect Chain Tracer maps the complete sequence from trigger to consequence. The Pitfall Intelligence Grid ranks your behavioral risks by frequency. Emotion Chapter Deep-Dives provide full operational manuals for every emotion. The Cross-Layer Impact Map connects psychology to P&L with quantified R-costs. The Personality & Bias Profiler maps your traits and cognitive distortions. The Emotional Journal System timestamps your emotional experiences and correlates them with trading outcomes. And the Score Evolution Tracker shows your longitudinal psychological development trajectory. Together, these thirteen systems form the most comprehensive psychological operating system ever built for trading."}
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {[
                        { label: "DIAGNOSTIC", color: "#8b5cf6", count: "4 systems", desc: "Command Center, Brain Map, Mood Scanner, Decision Latency -- your psychological state assessment layer" },
                        { label: "BEHAVIORAL", color: "#ef4444", count: "5 systems", desc: "Pattern Detector, Pitfall Grid, Cause-Effect Chains, Emotion Chapters, Cross-Layer Impact -- behavioral forensics" },
                        { label: "EVOLUTION", color: "#10b981", count: "4 systems", desc: "Personality Profiler, Emotional Journal, Score Evolution, Topology Field -- your psychological growth trajectory" },
                      ].map(source => (
                        <motion.div key={source.label}
                          className="px-3 py-3 rounded-xl border relative overflow-hidden"
                          style={{ backgroundColor: `${source.color}03`, borderColor: `${source.color}10` }}>
                          <motion.div className="absolute inset-0 pointer-events-none"
                            animate={{ opacity: [0.01, 0.04, 0.01] }}
                            transition={{ duration: 4, repeat: Infinity }}>
                            <div className="absolute left-0 top-0 w-12 h-12 rounded-full"
                              style={{ backgroundColor: source.color, filter: "blur(15px)" }} />
                          </motion.div>
                          <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-1.5">
                              <motion.div className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: source.color }}
                                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2.5, repeat: Infinity }} />
                              <span className="text-[9px] font-mono font-black uppercase tracking-wider"
                                style={{ color: `${source.color}70` }}>{source.label}</span>
                            </div>
                            <span className="text-[12px] font-mono font-bold block mb-1"
                              style={{ color: `${source.color}90` }}>{source.count}</span>
                            <span className="text-[9px] font-mono text-white/20 leading-relaxed block">{source.desc}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="rounded-xl border border-white/[0.05] bg-white/[0.01] p-3.5">
                      <div className="flex items-center gap-2 mb-2.5">
                        <Activity className="w-3.5 h-3.5 text-white/25" />
                        <span className="text-[8px] font-mono font-black uppercase tracking-[0.15em] text-white/25">5 Psychological States</span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {[
                          { label: "Focused", grade: "A+", color: "#10b981" },
                          { label: "Cautious", grade: "B+", color: "#06b6d4" },
                          { label: "Reactive", grade: "C", color: "#f59e0b" },
                          { label: "Tilted", grade: "D", color: "#f97316" },
                          { label: "Spiraling", grade: "F", color: "#ef4444" },
                        ].map(p => (
                          <motion.div key={p.label} className="text-center px-1.5 py-2 rounded-lg border"
                            style={{ borderColor: `${p.color}15`, backgroundColor: `${p.color}04` }}
                            whileHover={{ borderColor: `${p.color}30`, backgroundColor: `${p.color}08` }}>
                            <span className="text-[10px] font-mono font-black block" style={{ color: p.color }}>{p.grade}</span>
                            <span className="text-[7px] font-mono text-white/20 block mt-0.5">{p.label}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-3.5">
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 bg-violet-400/10 border border-violet-400/15">
                          <Fingerprint className="w-3 h-3 text-violet-400/50" />
                        </div>
                        <div>
                          <span className="text-[7px] font-mono font-black uppercase tracking-[0.15em] text-white/20 block mb-1">
                            HOW TO USE THIS TUTORIAL
                          </span>
                          <p className="text-[11px] text-white/35 leading-relaxed">
                            {"This tutorial walks you through all 13 systems of the Neural Cortex in sequence. Each step includes a live interactive preview, a detailed explanation of what the system does and why it matters, the computational architecture behind it, practical operator guidance, and specific interactive actions you can take. Press NEXT SECTION to advance through each system, or use the navigation grid below to jump directly to any section. This is the most comprehensive tutorial in the platform -- take your time with each section."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : guideSection && (
              <div className="px-4 pb-6 space-y-4">
                {/* Section header */}
                <div className="rounded-xl border relative overflow-hidden"
                  style={{ backgroundColor: `${guideSection.color}02`, borderColor: `${guideSection.color}15` }}>
                  <motion.div className="absolute inset-0 pointer-events-none"
                    animate={{ opacity: [0.02, 0.04, 0.02] }}
                    transition={{ duration: 5, repeat: Infinity }}>
                    <div className="absolute left-0 top-0 w-24 h-24 rounded-full"
                      style={{ backgroundColor: guideSection.color, filter: "blur(30px)" }} />
                  </motion.div>
                  <div className="relative z-10 px-4 py-4 flex items-center gap-3.5">
                    <motion.div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${guideSection.color}12`, border: `1px solid ${guideSection.color}28`, boxShadow: `0 0 16px ${guideSection.color}10` }}
                      animate={{ boxShadow: [`0 0 12px ${guideSection.color}06`, `0 0 24px ${guideSection.color}14`, `0 0 12px ${guideSection.color}06`] }}
                      transition={{ duration: 3, repeat: Infinity }}>
                      <StepIcon className="w-5 h-5" style={{ color: `${guideSection.color}85` }} />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-[15px] font-mono font-black uppercase tracking-wider" style={{ color: guideSection.color }}>
                          {guideSection.title}
                        </span>
                        <span className="text-[7px] font-mono font-black px-1.5 py-0.5 rounded tracking-wider"
                          style={{ backgroundColor: `${dataSourceColor}08`, color: `${dataSourceColor}55`, border: `1px solid ${dataSourceColor}15` }}>
                          {dataSourceLabel}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-white/30 mt-1 block">{guideSection.componentRef}</span>
                    </div>
                  </div>
                </div>

                {/* Live preview */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <motion.div className="w-2 h-2 rounded-full" style={{ backgroundColor: guideSection.color }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }} />
                    <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em]" style={{ color: `${guideSection.color}60` }}>Interactive Preview</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: `${guideSection.color}10` }} />
                    <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider">hover to explore</span>
                  </div>
                  {PreviewComponent && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
                      <PreviewComponent color={guideSection.color} />
                    </motion.div>
                  )}
                </div>

                {/* Description */}
                <div className="rounded-xl border border-white/[0.05] bg-white/[0.01] px-4 py-3.5">
                  <p className="text-[13px] text-white/50 leading-[1.85]">{guideSection.description}</p>
                </div>

                {/* Key Elements */}
                <motion.div className="space-y-2" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Scan className="w-3.5 h-3.5" style={{ color: `${guideSection.color}40` }} />
                    <span className="text-[9px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${guideSection.color}40` }}>Key Components</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: `${guideSection.color}06` }} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {guideSection.keyElements.map((el, j) => (
                      <motion.div key={el.label}
                        className="px-3 py-2.5 rounded-xl border relative overflow-hidden cursor-default"
                        style={{
                          backgroundColor: hoveredElement === `tut-${guideSection.id}-${j}` ? `${guideSection.color}06` : "rgba(255,255,255,0.008)",
                          borderColor: hoveredElement === `tut-${guideSection.id}-${j}` ? `${guideSection.color}22` : "rgba(255,255,255,0.04)",
                        }}
                        onMouseEnter={() => setHoveredElement(`tut-${guideSection.id}-${j}`)}
                        onMouseLeave={() => setHoveredElement(null)}
                        whileHover={{ scale: 1.015, borderColor: `${guideSection.color}28` }}
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + j * 0.06 }}>
                        {hoveredElement === `tut-${guideSection.id}-${j}` && (
                          <motion.div className="absolute inset-0 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="absolute left-0 top-0 w-14 h-14 rounded-full" style={{ backgroundColor: guideSection.color, filter: "blur(16px)", opacity: 0.06 }} />
                          </motion.div>
                        )}
                        <span className="text-[10px] font-mono font-black block mb-1 relative z-10"
                          style={{ color: hoveredElement === `tut-${guideSection.id}-${j}` ? guideSection.color : `${guideSection.color}65` }}>{el.label}</span>
                        <span className="text-[9px] font-mono text-white/25 leading-relaxed block relative z-10">{el.desc}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* How It Works */}
                <motion.div className="rounded-xl border relative overflow-hidden"
                  style={{ borderColor: `${guideSection.color}10`, backgroundColor: `${guideSection.color}02` }}
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  <motion.div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
                    style={{ backgroundColor: `${guideSection.color}15` }}
                    animate={{ backgroundColor: [`${guideSection.color}10`, `${guideSection.color}35`, `${guideSection.color}10`] }}
                    transition={{ duration: 3.5, repeat: Infinity }} />
                  <div className="px-4 py-3.5 relative z-10 space-y-2">
                    <div className="flex items-center gap-2">
                      <Settings2 className="w-4 h-4" style={{ color: `${guideSection.color}45` }} />
                      <span className="text-[10px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${guideSection.color}45` }}>Under the Hood</span>
                    </div>
                    <p className="text-[12px] text-white/40 leading-[1.85]">{guideSection.howItWorks}</p>
                  </div>
                </motion.div>

                {/* What Changes + Variations */}
                <motion.div className="grid grid-cols-2 gap-2.5"
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <div className="px-3.5 py-3 rounded-xl border border-white/[0.05] bg-white/[0.008] relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-white/[0.06]" />
                    <div className="flex items-center gap-2 mb-2">
                      <Gauge className="w-3.5 h-3.5 text-white/25" />
                      <span className="text-[9px] font-mono font-black text-white/22 uppercase tracking-[0.12em]">What Drives Change</span>
                    </div>
                    <p className="text-[11px] text-white/30 leading-[1.7]">{guideSection.whatChangesIt}</p>
                  </div>
                  <div className="px-3.5 py-3 rounded-xl border relative overflow-hidden"
                    style={{ backgroundColor: `${guideSection.color}03`, borderColor: `${guideSection.color}10` }}>
                    <div className="flex items-center gap-2 mb-2 relative z-10">
                      <Layers className="w-3.5 h-3.5" style={{ color: `${guideSection.color}35` }} />
                      <span className="text-[9px] font-mono font-black uppercase tracking-[0.12em]" style={{ color: `${guideSection.color}35` }}>Depth & Range</span>
                    </div>
                    <p className="text-[11px] leading-[1.7] relative z-10" style={{ color: `${guideSection.color}50` }}>{guideSection.variationCount}</p>
                  </div>
                </motion.div>

                {/* Code Signals */}
                <motion.div className="space-y-2" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-3.5 h-3.5" style={{ color: `${guideSection.color}35` }} />
                    <span className="text-[9px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${guideSection.color}35` }}>Data Architecture</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: `${guideSection.color}06` }} />
                  </div>
                  <div className="space-y-1.5">
                    {guideSection.codeSignals.map((sig, j) => (
                      <motion.div key={sig.name}
                        className="px-3 py-2 rounded-lg border border-white/[0.04] bg-white/[0.008]"
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + j * 0.06 }}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[7px] font-mono font-black px-1.5 py-0.5 rounded tracking-wider"
                            style={{
                              backgroundColor: sig.type === "function" ? "#06b6d408" : sig.type === "state" ? "#f59e0b08" : "#8b5cf608",
                              color: sig.type === "function" ? "#06b6d460" : sig.type === "state" ? "#f59e0b60" : "#8b5cf660",
                              border: `1px solid ${sig.type === "function" ? "#06b6d415" : sig.type === "state" ? "#f59e0b15" : "#8b5cf615"}`,
                            }}>
                            {sig.type.toUpperCase()}
                          </span>
                          <span className="text-[10px] font-mono font-black" style={{ color: `${guideSection.color}70` }}>{sig.name}</span>
                        </div>
                        <span className="text-[9px] font-mono text-white/25 leading-relaxed block">{sig.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Interactive Actions */}
                <motion.div className="space-y-2.5" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-3.5 h-3.5" style={{ color: `${guideSection.color}35` }} />
                    <span className="text-[9px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${guideSection.color}35` }}>How to Interact</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: `${guideSection.color}06` }} />
                  </div>
                  <div className="space-y-2">
                    {guideSection.interactiveButtons.map((btn) => (
                      <motion.div key={btn.label} className="group">
                        <motion.button
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all relative overflow-hidden"
                          style={{ borderColor: `${btn.color}12`, backgroundColor: `${btn.color}03` }}
                          whileHover={{ backgroundColor: `${btn.color}08`, borderColor: `${btn.color}25`, boxShadow: `0 0 20px ${btn.color}06` }}
                          whileTap={{ scale: 0.98 }}>
                          <motion.div className="absolute inset-0 pointer-events-none"
                            style={{ background: `radial-gradient(ellipse 60% 100% at 10% 50%, ${btn.color}06, transparent 70%)` }}
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity }} />
                          <motion.div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 relative z-10"
                            style={{ backgroundColor: `${btn.color}10`, border: `1px solid ${btn.color}18` }}
                            animate={{ boxShadow: [`0 0 8px ${btn.color}05`, `0 0 16px ${btn.color}10`, `0 0 8px ${btn.color}05`] }}
                            transition={{ duration: 3, repeat: Infinity }}>
                            <Zap className="w-3.5 h-3.5" style={{ color: `${btn.color}70` }} />
                          </motion.div>
                          <div className="flex-1 relative z-10">
                            <span className="text-[11px] font-mono font-black uppercase tracking-wider block" style={{ color: `${btn.color}70` }}>{btn.label}</span>
                            <span className="text-[10px] font-mono text-white/25 leading-relaxed mt-0.5 block">{btn.action}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 shrink-0 relative z-10 transition-transform group-hover:translate-x-0.5" style={{ color: `${btn.color}30` }} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Operator Guidance */}
                <motion.div className="px-4 py-3.5 rounded-xl border relative overflow-hidden"
                  style={{ backgroundColor: `${guideSection.color}03`, borderColor: `${guideSection.color}12` }}
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <motion.div className="absolute inset-0 pointer-events-none"
                    style={{ background: `linear-gradient(135deg, ${guideSection.color}04, transparent 50%)` }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity }} />
                  <div className="flex items-center gap-2 mb-2 relative z-10">
                    <Eye className="w-4 h-4" style={{ color: `${guideSection.color}40` }} />
                    <span className="text-[10px] font-mono font-black uppercase tracking-[0.12em]" style={{ color: `${guideSection.color}40` }}>Operator Guidance</span>
                  </div>
                  <p className="text-[12px] text-white/45 leading-[1.85] relative z-10">{guideSection.perspective}</p>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Section navigation grid */}
      <div className="flex-shrink-0 px-4 pb-2 pt-1">
        <div className="grid grid-cols-5 gap-1">
          {[
            { idx: 0, label: "Intro", icon: Hexagon, color: "#8b5cf6" },
            ...PSYCH_GUIDE_SECTIONS.map((s, i) => ({
              idx: i + 1,
              label: s.title.split(" ").slice(0, 2).join(" "),
              icon: s.icon,
              color: s.color,
            }))
          ].map((s, mapIdx) => {
            const isCurrent = s.idx === currentStep
            const SIcon = s.icon
            return (
              <motion.button key={s.idx}
                onClick={() => setCurrentStep(s.idx)}
                className="flex items-center justify-center gap-1 px-1.5 py-1 rounded-lg border transition-all"
                style={{
                  backgroundColor: isCurrent ? `${s.color}08` : "rgba(255,255,255,0.01)",
                  borderColor: isCurrent ? `${s.color}20` : "rgba(255,255,255,0.04)",
                }}
                initial={{ opacity: 0, y: 6 }}
                animate={isCurrent
                  ? { opacity: 1, y: 0, borderColor: [`${s.color}15`, `${s.color}30`, `${s.color}15`] }
                  : { opacity: 1, y: 0 }
                }
                transition={{ duration: isCurrent ? 2 : 0.35, delay: mapIdx * 0.04, repeat: isCurrent ? Infinity : 0 }}>
                <SIcon className="w-2.5 h-2.5" style={{ color: isCurrent ? `${s.color}60` : "rgba(255,255,255,0.2)" }} />
                <span className="text-[6px] font-mono font-black uppercase tracking-wider"
                  style={{ color: isCurrent ? `${s.color}70` : "rgba(255,255,255,0.2)" }}>{s.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Navigation footer */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2">
        <div className="flex items-center gap-3">
          <motion.button onClick={goPrev} disabled={currentStep === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.01] hover:bg-white/[0.03] text-white/30 hover:text-white/60 transition-all disabled:opacity-20 disabled:pointer-events-none"
            whileTap={{ scale: 0.97 }}>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono font-black uppercase tracking-wider">Back</span>
          </motion.button>
          <motion.button onClick={goNext}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border relative overflow-hidden transition-all"
            style={{ borderColor: `${stepColor}25`, backgroundColor: `${stepColor}08`, boxShadow: `0 0 30px ${stepColor}06` }}
            whileHover={{ backgroundColor: `${stepColor}14`, borderColor: `${stepColor}40`, boxShadow: `0 0 40px ${stepColor}10` }}
            whileTap={{ scale: 0.98 }}>
            <motion.div className="absolute inset-0 pointer-events-none"
              style={{ background: `linear-gradient(135deg, ${stepColor}05, transparent 60%)` }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }} />
            <span className="text-[11px] font-mono font-black uppercase tracking-wider relative z-10" style={{ color: stepColor }}>
              {isLast ? "Enter Neural Cortex" : "Next Section"}
            </span>
            <motion.div className="relative z-10"
              animate={isLast ? { x: [0, 3, 0] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}>
              {isLast ? <Zap className="w-4 h-4" style={{ color: stepColor }} /> : <ChevronRight className="w-4 h-4" style={{ color: `${stepColor}80` }} />}
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}


// ═══════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════

export function PsychologyGuideAndTutorial({
  onStartDemo,
}: {
  onStartDemo: () => void
}) {
  const [tutorialOpen, setTutorialOpen] = useState(false)
  return (
    <>
      <div className="flex items-center gap-2 px-3 py-2">
        <motion.button
          onClick={() => setTutorialOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all group relative overflow-hidden"
          style={{ borderColor: "rgba(139,92,246,0.12)", backgroundColor: "rgba(139,92,246,0.03)" }}
          whileHover={{ backgroundColor: "rgba(139,92,246,0.06)", borderColor: "rgba(139,92,246,0.25)" }}
          whileTap={{ scale: 0.97 }}>
          <motion.div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 20% 50%, rgba(139,92,246,0.06), transparent 70%)" }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }} />
          <Sparkles className="w-3.5 h-3.5 text-violet-400/40 group-hover:text-violet-400/70 transition-colors relative z-10" />
          <span className="text-[9px] font-mono font-black text-violet-400/40 group-hover:text-violet-400/70 transition-colors uppercase tracking-wider relative z-10">
            Psychology Tutorial
          </span>
        </motion.button>
        <motion.button
          onClick={() => setTutorialOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all group relative overflow-hidden"
          style={{ borderColor: "rgba(236,72,153,0.12)", backgroundColor: "rgba(236,72,153,0.03)" }}
          whileHover={{ backgroundColor: "rgba(236,72,153,0.06)", borderColor: "rgba(236,72,153,0.25)" }}
          whileTap={{ scale: 0.97 }}>
          <motion.div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 20% 50%, rgba(236,72,153,0.06), transparent 70%)" }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} />
          <BookOpen className="w-3.5 h-3.5 text-pink-400/40 group-hover:text-pink-400/70 transition-colors relative z-10" />
          <span className="text-[9px] font-mono font-black text-pink-400/40 group-hover:text-pink-400/70 transition-colors uppercase tracking-wider relative z-10">
            Neural Cortex Guide
          </span>
        </motion.button>
      </div>
      <AnimatePresence>
        {tutorialOpen && (
          <PsychologyTutorialOverlay
            onClose={() => setTutorialOpen(false)}
            onStartDemo={() => { onStartDemo() }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
