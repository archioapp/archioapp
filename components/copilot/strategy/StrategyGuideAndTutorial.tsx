"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
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
  CircleDot,
  AlertTriangle,
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Flame,
  Lock,
  Hexagon,
  ChevronDown,
} from "lucide-react"

// ═══════════════════════════════════════════════════════════════════
// STRATEGY OPERATING SYSTEM — INTERACTIVE TUTORIAL & GUIDE
// Adapted from the Activity Intelligence Engine tutorial template.
// 5 deep-dive sections covering every pillar of the Strategy OS:
//   1. Strategy Nerve Center (cockpit + signal nodes)
//   2. The Discipline Mirror (weekly adherence timeline)
//   3. Rule Commitments (living rule cards)
//   4. Capital Exposure Map (gravity field)
//   5. Execution DNA Profile (concentric rings + identity)
// Each section has: live preview, description, how it works,
// what changes it, key elements, interactive actions, and perspective.
// ═══════════════════════════════════════════════════════════════════

interface StrategyGuideSection {
  id: string
  title: string
  icon: typeof Brain
  color: string
  dataSource: "profile" | "rules" | "instruments" | "entries" | "composite"
  description: string
  howItWorks: string
  whatChangesIt: string
  variationCount: string
  perspective: string
  componentRef: string
  livePreviewType: "nerve-center" | "mirror-timeline" | "rule-card" | "exposure-field" | "dna-rings"
  interactiveButtons: { label: string; action: string; color: string }[]
  codeSignals: { name: string; value: string; type: "function" | "prop" | "state" }[]
  keyElements: { label: string; desc: string }[]
}

const STRATEGY_GUIDE_SECTIONS: StrategyGuideSection[] = [
  {
    id: "nerve-center",
    title: "Strategy Nerve Center",
    icon: Brain,
    color: "#10b981",
    dataSource: "composite",
    description: "This is where you start every session inside Strategy OS. The Nerve Center is a single-glance assessment of your entire strategic health. Four signal nodes -- Mirror, Rules, Exposure, and DNA -- radiate from a central discipline ring that fills based on your overall adherence score. In under five seconds, you can see whether your discipline is intact, whether your rules are being honored, whether your capital is dangerously concentrated, and whether your execution identity is aligned with your plan. Every node is live. Every node is interactive. Hover any node to see its full intelligence overlay -- a deeper layer of data including gauges, sparklines, trend lines, and contextual alerts. Click any node to jump directly to its detailed section below. The Nerve Center does not just display information. It organizes your attention. It answers the question every serious trader should ask before touching a chart: how am I operating right now?",
    howItWorks: "The Nerve Center computes a composite strategic state from two data streams: your trading activity data (entry types, instruments, timeframes, models) and your rule commitment data (adherence rates, violations, streaks, weekly patterns). From these two streams, it derives a single unified picture: your overall discipline score, risk grade, entry quality, structure depth, exposure concentration, correlation risk, dominant currency, weekly adherence trend, and the gap between your intended behavior and your actual behavior. All four signal nodes draw from this same computed state, ensuring that every metric you see is consistent and interconnected. When one area deteriorates, the entire system reflects it.",
    whatChangesIt: "Your trading behavior data. Every profile represents a different behavioral reality. When the underlying data shifts -- new trades, rule violations, instrument changes -- the Nerve Center recalculates instantly. The discipline ring fills or empties. Alert indicators pulse or go quiet. Sparklines shift direction. This is not a static dashboard -- it is a living readout of your current strategic condition.",
    variationCount: "5 trader profiles, 4 signal nodes, each with 3+ hover intel layers -- 60+ unique visual states revealing different strategic conditions",
    perspective: "Read the Nerve Center BEFORE you open any individual section. It is designed to give you a truthful 5-second assessment. If the discipline ring is below 70%, something is wrong -- drill into the node that shows the alert. If all four nodes are green with no alerts, you are operating within your system. If the DNA node reads IMPULSIVE, your execution identity has drifted and you need to examine your entry behavior before your next trade. The Nerve Center is not decoration. It is the diagnostic layer that tells you where to focus your attention and what needs correction right now.",
    componentRef: "Your 5-second strategic health assessment",
    livePreviewType: "nerve-center",
    interactiveButtons: [
      { label: "Inspect Signal Nodes", action: "Hover each node to reveal its intelligence overlay -- gauges, sparklines, alerts, and trend data for that domain", color: "#10b981" },
      { label: "Navigate to Section", action: "Click any node to jump directly to its full deep-dive section -- Mirror, Rules, Exposure, or DNA", color: "#06b6d4" },
      { label: "Read the Discipline Ring", action: "The center ring shows your composite discipline score -- watch how it fills, breathes, and changes color based on your health", color: "#f59e0b" },
    ],
    codeSignals: [
      { name: "deriveStrategicMirror()", type: "function", value: "Computes full strategic state from activity data + rule commitments: discipline, grade, entry quality, exposure, correlation, weekly trend" },
      { name: "nerveNodes[]", type: "state", value: "4 signal node objects with live metrics, alerts, sparklines, and hover intelligence panels" },
      { name: "hoveredNode", type: "state", value: "Tracks which node is being inspected -- triggers the intelligence overlay for that domain" },
      { name: "openAndScrollTo(id)", type: "function", value: "Navigates directly to any section when a node is clicked -- connects the cockpit to the deep-dive layers" },
    ],
    keyElements: [
      { label: "Discipline Ring", desc: "The central score -- fills from 0 to 100%, changes color with your health, and pulses with a breathing animation that signals system awareness" },
      { label: "Signal Nodes", desc: "Four interactive domains: Mirror (weekly behavior), Rules (commitment adherence), Exposure (capital distribution), DNA (execution identity)" },
      { label: "Alert Indicators", desc: "Pulsing warnings on any node that needs attention -- discipline below threshold, rules broken, exposure too concentrated, or identity drift detected" },
      { label: "Intelligence Overlays", desc: "Hover any node to see deeper metrics, sparkline trends, and contextual alerts -- this is where the 5-second read becomes a 30-second diagnosis" },
      { label: "Weekly Sparklines", desc: "7-day trend lines showing whether each domain is improving, stable, or deteriorating" },
      { label: "Risk Grade", desc: "An A through D composite grade derived from all four domains -- your overall strategic rating at a glance" },
    ],
  },
  {
    id: "discipline-mirror",
    title: "The Discipline Mirror",
    icon: Eye,
    color: "#06b6d4",
    dataSource: "rules",
    description: "The Discipline Mirror shows you what actually happened during your trading week -- not what you intended, not what you remember, but what your data recorded. Each day of the week is represented as a vertical bar colored by your adherence score for that day. Green means you followed your system. Amber means you drifted. Red means you deviated significantly. Hover any day to see a summary: how many forecasts you posted, how many entries you took, which rules you honored, and which ones you broke. Click a day to expand its full card and see every forecast, every entry, every rule status, and every session detail for that 24-hour window. Above the timeline, you will see two critical numbers: your intended discipline level and your actual discipline level. The gap between them determines your status label -- ALIGNED, DRIFTING, or DISCONNECTED. This gap is the most important single metric in the Mirror. If you are ALIGNED, your execution matches your plan. If you are DRIFTING, you are slipping without realizing it. If you are DISCONNECTED, you are operating outside your own framework. The Mirror does not judge you -- it reflects you. The gap between intent and action is where your trading edge either compounds or leaks. Serious traders review the Mirror before every session to understand where they stand.",
    howItWorks: "The Mirror pulls a 7-day adherence array from your computed strategic state, where each value represents a discipline score between 0 and 100 for that day. It also pulls your intent-vs-action numbers: what you planned to achieve versus what you actually did. The gap between these two numbers determines your operational status. Each day cell can be expanded to reveal granular breakdowns: individual forecasts with pair and direction, individual entries with order type and result, specific rules broken with context, and session-level activity data. Everything is linked back to your actual trading record.",
    whatChangesIt: "Your daily trading behavior. Every trade taken, every rule followed or broken, every forecast published or missed -- it all flows into the Mirror automatically. Different behavioral patterns produce dramatically different weekly timelines. A disciplined week shows consistent green bars with a small intent-action gap. An inconsistent week shows scattered colors with widening gaps between what you planned and what you did.",
    variationCount: "7 days of detailed breakdowns per week, each day containing forecasts, entries, rule status, and session data -- expanding to reveal the full behavioral story of each trading day",
    perspective: "Open the Mirror at the start of every session. Do not check your P&L first. Check the Mirror first. It answers the only question that matters before you trade: am I operating inside my own system? If the gap between intent and action is widening, stop and diagnose before placing another order. The Mirror catches behavioral drift early -- before it becomes a blown account. An ALIGNED status means you earned the right to trade today. A DISCONNECTED status means your plan exists on paper but not in your execution. Fix the gap before you add more positions.",
    componentRef: "Your weekly behavioral accountability timeline",
    livePreviewType: "mirror-timeline",
    interactiveButtons: [
      { label: "Read Day Scores", action: "Hover each day bar to see your adherence score, forecast count, entry count, and rule compliance for that day", color: "#06b6d4" },
      { label: "Expand Daily Detail", action: "Click any day to open its full breakdown -- every forecast, every trade, every rule violation, every session detail", color: "#10b981" },
      { label: "Measure the Gap", action: "Compare your intended discipline percentage against your actual execution -- this gap is where your edge leaks or compounds", color: "#f59e0b" },
    ],
    codeSignals: [
      { name: "weeklyAdherence[]", type: "state", value: "7-day discipline scores (MON-SUN) -- each value drives bar height and color in the timeline" },
      { name: "intentVsAction", type: "state", value: "Intended vs actual adherence -- the gap between these two numbers reveals your true operational state" },
      { name: "gap / gapLabel", type: "state", value: "Gap <= 5% = ALIGNED (green), <= 15% = DRIFTING (amber), > 15% = DISCONNECTED (red)" },
      { name: "expandedCard", type: "state", value: "Currently expanded day -- reveals full forecast, entry, rule, and session breakdown for that day" },
    ],
    keyElements: [
      { label: "Adherence Bars", desc: "Seven vertical bars mapping your week -- height and color show exactly how disciplined each day was" },
      { label: "Intent vs Action", desc: "Two numbers that tell the truth: what you planned to do and what you actually did. The gap is everything." },
      { label: "Status Label", desc: "ALIGNED means your execution matches your plan. DRIFTING means you are slipping. DISCONNECTED means you left your system behind." },
      { label: "Day Detail Cards", desc: "Click any day to expand and see every forecast published, every entry taken, every rule followed or broken" },
      { label: "Entry Breakdowns", desc: "Individual trade entries inside each day showing pair, order type, risk-reward, and outcome" },
      { label: "Violation Context", desc: "Specific rules broken on each day, listed with the exact context of what happened and why it matters" },
    ],
  },
  {
    id: "rule-commitments",
    title: "Rule Commitments",
    icon: Shield,
    color: "#f59e0b",
    dataSource: "rules",
    description: "Your rules are not a checklist. They are a behavioral contract between who you want to become as a trader and who you actually are right now. Each rule in this section is a living system -- tracked across time, measured against real behavior, and taught with context so you understand not just WHAT the rule says but WHY it exists. In its default state, each rule card shows the essentials: the rule category, the rule text, your adherence percentage, your current streak, and your violation count. This compact view gives you an instant behavioral reading. Click any rule to expand it fully and see the deeper profile: the Teaching section explains the trading wisdom behind the rule and what it protects you from. The Impact Analysis compares what happens to your results when you follow the rule versus when you break it -- with real statistics from your own data. The Violation Timeline logs every single instance you broke the rule, with the exact date and behavioral context of what happened. The Weekly Adherence Strip shows a 7-day pattern of whether you followed or broke that rule each day. And the Copilot button lets you send the rule context directly to the AI for personalized coaching. Below all your active rules, the Rule Picker gives you access to a curated library of 30+ trading rules across five categories -- Entry, Exit, Risk Management, Session Discipline, and Mindset. These are not generic advice. They are structured operational commitments you can adopt into your system.",
    howItWorks: "Each rule contains a full behavioral profile: category classification, adherence percentage, violation count, current streak, personal best streak, total days tracked, a 7-day binary adherence history, teaching text, impact analysis for both compliance and violation, and a detailed violation log with dates and context. The system color-codes everything based on adherence thresholds: green above 80%, amber above 60%, red below 60%. Each rule card is expandable, revealing progressively deeper layers of behavioral data. The Rule Picker at the bottom offers a categorized library of additional rules you can add to your commitment list at any time.",
    whatChangesIt: "Your daily adherence to each rule. Every time you follow a rule, the adherence gauge fills, the streak counter increments, and the weekly strip updates. Every time you break a rule, the violation counter increases, the violation log records the context, the streak resets, and the adherence gauge adjusts. Different trading behaviors produce dramatically different rule profiles -- from near-perfect adherence with long streaks to frequent violations with detailed behavioral records.",
    variationCount: "5-6 active rules per profile, each with teaching text, impact analysis, violation logs, weekly patterns, and expandable detail layers. Plus 30+ additional rules available in the picker across 5 categories.",
    perspective: "Read your rules before every trading session. Not as a reminder -- as a confrontation. Each rule card holds a mirror to a specific behavioral commitment. If your adherence is above 80%, the rule is becoming part of your execution identity. If it is below 60%, the rule exists in theory but not in practice -- and the violation log will tell you exactly when and why you broke it. The teaching section is not filler. It explains the market logic behind each rule. The impact analysis is not abstract. It shows you the real cost of non-compliance from your own results. Expanding a rule card is not casual browsing. It is reviewing your behavioral record. Treat this section like your compliance report -- because it is.",
    componentRef: "Your behavioral contract and compliance system",
    livePreviewType: "rule-card",
    interactiveButtons: [
      { label: "Expand Rule Profile", action: "Open any rule card to reveal its teaching, impact analysis, violation timeline, weekly adherence strip, and copilot integration", color: "#f59e0b" },
      { label: "Review Violations", action: "See every time you broke a rule -- with the date, the context, and the behavioral pattern behind each violation", color: "#ef4444" },
      { label: "Add New Rules", action: "Browse 30+ curated trading rules across 5 categories and adopt new commitments into your system", color: "#10b981" },
      { label: "Ask the Copilot", action: "Send any rule and its violation context to the AI copilot for personalized coaching and behavioral analysis", color: "#06b6d4" },
    ],
    codeSignals: [
      { name: "RuleCommitment", type: "state", value: "Full behavioral profile: rule text, category, adherence, violations, streaks, weekly history, teaching, impact analysis, and violation log" },
      { name: "categoryConfig", type: "state", value: "Five rule categories with distinct colors: Entry (cyan), Exit (green), Risk (amber), Session (blue), Mindset (purple)" },
      { name: "ALL_AVAILABLE_RULES[]", type: "state", value: "Library of 30+ curated rules across all categories, each with structured teaching text" },
      { name: "askCopilot(text)", type: "function", value: "Sends rule context to the AI copilot for personalized coaching and accountability analysis" },
    ],
    keyElements: [
      { label: "Adherence Gauge", desc: "Visual bar showing rule compliance -- green above 80%, amber above 60%, red below. This is the instant health indicator for each commitment." },
      { label: "Streak Counter", desc: "How many consecutive days you honored this rule. The flame icon lights when you are on an active streak. Your best-ever streak is always visible." },
      { label: "Category Badge", desc: "Color-coded classification: which domain this rule protects -- your entries, exits, risk, session discipline, or mindset" },
      { label: "Teaching Section", desc: "The operational wisdom behind each rule. Not what the rule says, but why it exists and what market behavior it protects you from." },
      { label: "Impact Analysis", desc: "Real consequences: what happens to your results when you follow this rule versus when you break it. Side-by-side comparison from your data." },
      { label: "Violation Timeline", desc: "Every recorded rule break with date and context. This is your behavioral record -- the truth of what happened when discipline failed." },
      { label: "Weekly Strip", desc: "A 7-day visual pattern showing follow/break status per day. Reveals consistency or inconsistency at a glance." },
      { label: "Rule Picker", desc: "30+ structured trading rules organized by category. Browse, review, and adopt new commitments into your operating system." },
    ],
  },
  {
    id: "exposure-map",
    title: "Capital Exposure Map",
    icon: CircleDot,
    color: "#8b5cf6",
    dataSource: "instruments",
    description: "Most traders do not know how concentrated their capital exposure actually is until it is too late. The Capital Exposure Map solves this by visualizing your portfolio as a gravitational field. Each currency you trade becomes a celestial body. The size of each body represents how much of your total exposure is tied to that currency. Pairs connecting those currencies appear as orbital lines between the bodies. When your exposure is balanced, the field looks stable -- bodies are proportionally sized and evenly distributed. When one currency dominates, its body grows massive, the gravity well deepens, and the system becomes visually and structurally unstable. Hover any currency body to see its exact weight percentage, every pair it appears in, and whether it creates correlation risk with other positions. Click any orbital connection to isolate that specific pair and analyze its directional exposure contribution. The system tracks a critical threshold: if any single currency exceeds 35% of your total exposure, a concentration alert triggers. This is not a cosmetic warning. Concentration above this level means a single central bank announcement, a single interest rate decision, or a single geopolitical event could affect the majority of your open positions simultaneously.",
    howItWorks: "The system decomposes every instrument you trade into its base and quote currencies. EURUSD becomes EUR and USD. GBPJPY becomes GBP and JPY. XAUUSD becomes XAU and USD. It counts how many trades involve each currency, calculates the percentage weight, and builds a connection graph showing which currencies share trading pairs. Each currency is rendered as a positioned body with size proportional to its weight. Orbital connection lines animate between currencies that share pairs. Concentration is measured using the Herfindahl index -- if any single currency exceeds 35% of total weight, the exposure alert activates. Correlation risk is flagged when multiple pairs share the same dominant currency, amplifying directional risk.",
    whatChangesIt: "The instruments you trade. Every pair you add, every position you open, every instrument in your active portfolio changes the gravitational field. A diversified portfolio shows balanced bodies with proportional connections. A concentrated portfolio shows one massive body pulling everything toward it. Changing instruments restructures the entire visualization -- new bodies appear, sizes shift, connections redraw, and correlation warnings activate or deactivate based on the new distribution.",
    variationCount: "Each instrument universe generates a unique gravitational field with 4-8 currency bodies, 3-10 orbital connections, and hover intelligence overlays per currency",
    perspective: "If one body is significantly larger than the others, you are not diversified -- you are concentrated. Many traders confuse concentration with conviction. They are not the same. Conviction is a thesis about a specific trade. Concentration is a structural vulnerability in your portfolio. When your USD exposure reaches 40%, every USD-driven news event affects the majority of your positions simultaneously. The Exposure Map makes this impossible to ignore. A balanced field means your risk is distributed across currencies. A concentrated field means a single market shock can cascade through most of your book. Check this before you add more positions in the same currency direction. If the alert is active, consider whether you are building conviction or accumulating correlated risk.",
    componentRef: "Your capital distribution and concentration detector",
    livePreviewType: "exposure-field",
    interactiveButtons: [
      { label: "Inspect Currency Bodies", action: "Hover each body to see its weight percentage, connected pairs, and whether it creates concentration or correlation risk", color: "#8b5cf6" },
      { label: "Isolate Pair Connections", action: "Click any orbital connection line to isolate that specific pair and see its directional exposure contribution", color: "#06b6d4" },
      { label: "Detect Correlation Risk", action: "Identify pairs sharing the same dominant currency -- if they move against you, they move together", color: "#ef4444" },
    ],
    codeSignals: [
      { name: "currencyMap", type: "state", value: "Derived exposure per currency: count of trades, list of connected pairs, and percentage weight in total portfolio" },
      { name: "dominantCurrency / dominantPct", type: "state", value: "The heaviest currency and its exact percentage -- triggers concentration alert at 35%+" },
      { name: "correlationRisk", type: "state", value: "True when multiple pairs share a dominant base currency with combined weight exceeding 30%" },
      { name: "hoveredCurrency / selectedPair", type: "state", value: "Controls which body is highlighted and which orbital connection is isolated for analysis" },
    ],
    keyElements: [
      { label: "Currency Bodies", desc: "Sized by exposure weight -- the bigger the body, the more of your capital is tied to that currency. Pulsing glow on hover reveals full intelligence." },
      { label: "Orbital Connections", desc: "Animated lines between currencies that share a trading pair. Line thickness represents trade volume on that pair." },
      { label: "Concentration Alert", desc: "A red warning field activates when any single currency exceeds 35% of total exposure -- your portfolio has a structural vulnerability." },
      { label: "Weight Percentages", desc: "Exact percentage labels on each body so you can see the precise distribution without guessing" },
      { label: "Pair Isolation", desc: "Click any connection to isolate and highlight a specific pair's contribution to the overall exposure field" },
      { label: "Balance Status", desc: "Overall field stability: BALANCED (no currency dominates), WEIGHTED (approaching concentration), or CONCENTRATED (alert active)" },
    ],
  },
  {
    id: "execution-dna",
    title: "Execution DNA Profile",
    icon: Target,
    color: "#ef4444",
    dataSource: "entries",
    description: "This is the section that answers the most honest question in trading: how are you actually entering the market? Not how you think you enter. Not how your journal says you enter. How your order history says you enter. Three concentric rings decode your execution identity from the outside in. The outer ring shows your order type distribution -- what percentage of your entries are limit orders (planned, patient), market orders (reactive, emotional), or stop orders (conditional, automated). The middle ring shows your timing quality -- how many of your entries landed during institutional killzones versus off-hours when liquidity is thin. The inner core displays your execution verdict: SNIPER if you predominantly use limit orders and wait for price to come to you. HYBRID if you mix patient and reactive entries. REACTIVE if you lean toward market orders but show some planning. IMPULSIVE if you are consistently market-ordering into positions because you cannot wait for your level. Below the rings, a behavioral spectrum bar maps your position on a gradient from IMPULSIVE (red, left) to SNIPER (green, right). An animated marker shows exactly where you sit. This is not a label someone assigned you. It is computed directly from your order history. Each segment of the ring can be expanded to reveal a deep-dive analysis of what that execution style means for your edge, your risk, and your long-term results.",
    howItWorks: "The DNA Profile takes your entry mix data -- the count of market orders, limit orders, and stop orders -- and derives a limit ratio: limit orders divided by total orders. This ratio determines your execution identity. A limit ratio of 0.7 or higher means SNIPER: you wait for your price levels and enter with patience. A ratio of 0.5 to 0.7 means HYBRID: a mix of planned and reactive entries. 0.3 to 0.5 means REACTIVE: you lean toward market orders but show some structure. Below 0.3 means IMPULSIVE: you are predominantly market-ordering, which usually indicates emotional entry behavior. The outer ring renders each order type as a colored SVG arc -- cyan for limits, red for markets, amber for stops. The middle ring uses green and gray to show killzone versus off-hours timing. The spectrum bar uses the limit ratio to position an animated marker on the patience gradient.",
    whatChangesIt: "Your order history. Every entry you make shifts the DNA rings. Adding more limit orders moves you toward SNIPER. Adding more market orders moves you toward IMPULSIVE. The visual change is immediate and dramatic -- a disciplined trader shows a ring dominated by cyan arcs, while a reactive trader shows a ring dominated by red. The spectrum marker physically slides across the gradient to reflect your current identity. This is a living metric that changes as your behavior changes.",
    variationCount: "4 execution identities (SNIPER, HYBRID, REACTIVE, IMPULSIVE) with 3 ring layers, 3 expandable analysis panels, and dynamic spectrum positioning",
    perspective: "The DNA Profile answers a question most traders avoid: are you trading with intention or reacting to emotion? SNIPER identity means you are setting limit orders at planned price levels and waiting. This is the mark of patience and structure. IMPULSIVE identity means you are clicking market order because you are afraid the trade will leave without you. This is the mark of emotional entry. There is no moral judgment here -- only data. But the data matters because limit orders consistently produce better fill prices, tighter stops, and higher win rates than market orders. If your DNA reads IMPULSIVE, the fix is not to try harder. The fix is to build a pre-session plan with specific levels and commit to limit entries only. Watch the ring change as your behavior changes. That visual shift from red to cyan is not cosmetic -- it is evidence that your execution identity is evolving.",
    componentRef: "Your execution identity and patience measurement",
    livePreviewType: "dna-rings",
    interactiveButtons: [
      { label: "Inspect Ring Segments", action: "Hover each arc to see the exact percentage and behavioral meaning of that order type in your execution profile", color: "#ef4444" },
      { label: "Read Analysis Panels", action: "Expand detailed panels explaining what each execution style means for your edge, your risk, and your long-term results", color: "#06b6d4" },
      { label: "Track the Spectrum", action: "Watch the animated marker show your exact position on the patience scale -- from IMPULSIVE to SNIPER based on your real data", color: "#10b981" },
    ],
    codeSignals: [
      { name: "entryMix[]", type: "state", value: "Raw order type counts: market, limit, and stop -- the foundation of your execution identity calculation" },
      { name: "limitRatio", type: "state", value: "Limit orders divided by total orders (0 to 1) -- the single metric that determines your DNA identity" },
      { name: "dnaIdentity", type: "state", value: "SNIPER (>= 0.7), HYBRID (>= 0.5), REACTIVE (>= 0.3), or IMPULSIVE (< 0.3) -- computed from your limit ratio" },
      { name: "expandedPanel", type: "state", value: "Which segment is expanded for behavioral analysis -- market, limit, or stop order deep-dive" },
    ],
    keyElements: [
      { label: "Outer Ring", desc: "Order type distribution rendered as colored arcs: cyan (limit/patient), red (market/reactive), amber (stop/conditional). The dominant color tells your story." },
      { label: "Middle Ring", desc: "Timing quality: green arcs for killzone entries, gray for off-hours. Institutional sessions produce better results." },
      { label: "Inner Core", desc: "Your execution verdict displayed at the center -- SNIPER, HYBRID, REACTIVE, or IMPULSIVE -- with a breathing glow that reflects your identity strength" },
      { label: "Behavioral Spectrum", desc: "A horizontal gradient from IMPULSIVE (red) to SNIPER (green) with an animated marker showing exactly where your order history places you" },
      { label: "Analysis Panels", desc: "Expandable deep-dives per order type explaining the behavioral implications and edge impact of each execution pattern" },
      { label: "Entry Quality Score", desc: "A composite rating combining your limit ratio with your structure depth -- the final measure of execution discipline" },
    ],
  },
]

/* ══════════════════════════════════════════════════════════════════
   LIVE PREVIEW COMPONENTS
   Miniature animated representations of each Strategy section
   ══════════════════════════════════════════════════════════════════ */

function LivePreviewNerveCenter({ color }: { color: string }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const nodes = [
    { label: "MIRROR", metric: "82%", subtext: "Adherence", color: "#06b6d4", icon: Eye, alert: false, sparkline: [72, 78, 85, 80, 88, 82, 82] },
    { label: "RULES", metric: "87%", subtext: "6 Active", color: "#f59e0b", icon: Shield, alert: false, sparkline: [90, 88, 85, 92, 87, 84, 87] },
    { label: "EXPOSURE", metric: "28%", subtext: "USD Heavy", color: "#8b5cf6", icon: CircleDot, alert: false, sparkline: [22, 25, 28, 30, 28, 26, 28] },
    { label: "DNA", metric: "HYBRID", subtext: "55% Limit", color: "#ef4444", icon: Target, alert: false, sparkline: [48, 50, 52, 55, 53, 56, 55] },
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
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-3.5 h-3.5" style={{ color: `${color}60` }} />
          <span className="text-[9px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${color}55` }}>Strategy Nerve Center</span>
          <div className="flex-1" />
          <motion.span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-md border"
            style={{ backgroundColor: "#10b98112", color: "#10b98180", borderColor: "#10b98125" }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}>ONLINE</motion.span>
        </div>
        {/* Center discipline ring */}
        <div className="flex items-center justify-center mb-4">
          <motion.div className="relative cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}>
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="27" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
              <motion.circle cx="32" cy="32" r="27" fill="none" stroke={color} strokeWidth="3"
                strokeLinecap="round" strokeDasharray={2 * Math.PI * 27}
                initial={{ strokeDashoffset: 2 * Math.PI * 27 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 27 * 0.18 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                transform="rotate(-90 32 32)"
                style={{ filter: `drop-shadow(0 0 6px ${color}50)` }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span className="text-[16px] font-black tabular-nums" style={{ color }}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity }}>82</motion.span>
              <span className="text-[7px] font-mono font-bold text-white/30 uppercase tracking-widest">Grade A</span>
            </div>
          </motion.div>
        </div>
        {/* 4 signal nodes with hover intelligence */}
        <div className="grid grid-cols-2 gap-2">
          {nodes.map((n) => {
            const NodeIcon = n.icon
            const isHovered = hoveredNode === n.label
            return (
              <motion.div key={n.label}
                className="relative flex flex-col gap-1.5 px-3 py-2.5 rounded-lg border cursor-pointer overflow-hidden"
                style={{
                  borderColor: isHovered ? `${n.color}35` : `${n.color}15`,
                  backgroundColor: isHovered ? `${n.color}10` : `${n.color}04`,
                }}
                onMouseEnter={() => setHoveredNode(n.label)}
                onMouseLeave={() => setHoveredNode(null)}
                whileHover={{ scale: 1.02, boxShadow: `0 0 20px ${n.color}10` }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                {isHovered && (
                  <motion.div className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="absolute left-0 top-0 w-16 h-16 rounded-full"
                      style={{ backgroundColor: n.color, filter: "blur(20px)", opacity: 0.08 }} />
                  </motion.div>
                )}
                <div className="flex items-center gap-2 relative z-10">
                  <NodeIcon className="w-3.5 h-3.5" style={{ color: isHovered ? n.color : `${n.color}60` }} />
                  <span className="text-[8px] font-mono font-black uppercase tracking-wider" style={{ color: isHovered ? `${n.color}90` : `${n.color}55` }}>{n.label}</span>
                  <div className="flex-1" />
                  <span className="text-[11px] font-mono font-black tabular-nums relative z-10" style={{ color: n.color }}>{n.metric}</span>
                </div>
                <div className="flex items-center gap-2 relative z-10">
                  <span className="text-[8px] font-mono text-white/25">{n.subtext}</span>
                  <div className="flex-1" />
                  {/* Mini sparkline */}
                  <svg width="32" height="10" viewBox="0 0 32 10" className="opacity-50">
                    <motion.polyline
                      fill="none" stroke={n.color} strokeWidth="1" strokeLinecap="round"
                      points={n.sparkline.map((v, i) => `${(i / 6) * 32},${10 - (v / 100) * 10}`).join(" ")}
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.3 }} />
                  </svg>
                </div>
                {/* Hover expanded intel */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="relative z-10 mt-1 pt-1.5 border-t"
                      style={{ borderColor: `${n.color}15` }}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}>
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-2.5 h-2.5" style={{ color: `${n.color}50` }} />
                        <span className="text-[7px] font-mono text-white/30">7-day trend: stable</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function LivePreviewMirrorTimeline({ color }: { color: string }) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
  const values = [88, 92, 75, 95, 68, 45, 82]
  const forecasts = [3, 2, 1, 4, 2, 0, 1]
  const entries = [2, 3, 1, 5, 3, 1, 2]
  return (
    <div className="rounded-xl border overflow-hidden relative" style={{ borderColor: `${color}20`, backgroundColor: `${color}04` }}>
      <div className="relative z-10 p-4">
        <div className="flex items-center gap-2 mb-3.5">
          <Eye className="w-3.5 h-3.5" style={{ color: `${color}60` }} />
          <span className="text-[9px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${color}55` }}>Weekly Discipline Mirror</span>
          <div className="flex-1" />
          <motion.span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-md border"
            style={{ backgroundColor: "#f59e0b12", color: "#f59e0b80", borderColor: "#f59e0b25" }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity }}>DRIFTING</motion.span>
        </div>
        <div className="flex items-end gap-1.5 h-20 mb-1.5">
          {days.map((d, i) => {
            const h = (values[i] / 100) * 100
            const barColor = values[i] >= 80 ? "#10b981" : values[i] >= 60 ? "#f59e0b" : "#ef4444"
            const isHovered = hoveredDay === i
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 relative"
                onMouseEnter={() => setHoveredDay(i)}
                onMouseLeave={() => setHoveredDay(null)}>
                {/* Hover tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute -top-[52px] left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded-lg border z-20 whitespace-nowrap"
                      style={{ backgroundColor: "#0a0e14", borderColor: `${barColor}30`, boxShadow: `0 4px 12px rgba(0,0,0,0.4)` }}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}>
                      <div className="text-[8px] font-mono font-bold" style={{ color: barColor }}>{values[i]}% discipline</div>
                      <div className="text-[7px] font-mono text-white/30">{forecasts[i]} forecasts, {entries[i]} entries</div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div
                  className="w-full rounded-t cursor-pointer"
                  style={{
                    backgroundColor: barColor,
                    opacity: isHovered ? 0.95 : 0.65,
                    boxShadow: isHovered ? `0 0 12px ${barColor}30` : "none",
                  }}
                  initial={{ height: 0 }} animate={{ height: `${h}%` }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                  whileHover={{ opacity: 0.95 }} />
                <span className="text-[7px] font-mono font-bold" style={{ color: isHovered ? `${color}80` : "rgba(255,255,255,0.2)" }}>{d}</span>
              </div>
            )
          })}
        </div>
        {/* Intent vs Action with visual gap */}
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 mt-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[8px] font-mono font-bold text-white/25">Intent vs Action Gap</span>
            <span className="text-[9px] font-mono font-bold" style={{ color: "#f59e0b" }}>12% gap</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[7px] font-mono text-white/20">Intended</span>
                <span className="text-[8px] font-mono font-bold text-white/35">90%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div className="h-full rounded-full bg-white/20" style={{ borderRight: "1px dashed rgba(255,255,255,0.3)" }}
                  initial={{ width: 0 }} animate={{ width: "90%" }}
                  transition={{ duration: 0.8, delay: 0.5 }} />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[7px] font-mono text-white/20">Actual</span>
                <span className="text-[8px] font-mono font-bold" style={{ color: `${color}70` }}>78%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }} animate={{ width: "78%" }}
                  transition={{ duration: 0.8, delay: 0.7 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LivePreviewRuleCard({ color }: { color: string }) {
  const [expandedRule, setExpandedRule] = useState<number | null>(null)
  const [hoveredRule, setHoveredRule] = useState<number | null>(null)
  const categories = [
    { icon: Crosshair, label: "SESSION", color: "#06b6d4" },
    { icon: Shield, label: "RISK", color: "#f59e0b" },
    { icon: Brain, label: "MINDSET", color: "#8b5cf6" },
  ]
  const rules = [
    { text: "Only enter during killzones", adherence: 87, streak: 5, bestStreak: 12, violations: 2, cat: 0, weeklyHistory: [1, 1, 1, 0, 1, 1, 1], teaching: "Killzones have the highest institutional order flow. Trading outside them means competing in thin liquidity." },
    { text: "Max 1% risk per trade", adherence: 94, streak: 11, bestStreak: 18, violations: 1, cat: 1, weeklyHistory: [1, 1, 1, 1, 1, 1, 0], teaching: "Position sizing is the foundation of longevity. One oversized loss can erase weeks of disciplined gains." },
    { text: "No trading after a loss", adherence: 61, streak: 0, bestStreak: 4, violations: 6, cat: 2, weeklyHistory: [1, 0, 1, 0, 0, 1, 0], teaching: "Revenge trading is the most common account killer. The urge to recover immediately leads to emotional entries." },
  ]
  return (
    <div className="rounded-xl border overflow-hidden relative" style={{ borderColor: `${color}20`, backgroundColor: `${color}04` }}>
      <div className="relative z-10 p-4 space-y-2.5">
        <div className="flex items-center gap-2 mb-1.5">
          <Shield className="w-3.5 h-3.5" style={{ color: `${color}60` }} />
          <span className="text-[9px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${color}55` }}>Rule Commitments</span>
          <div className="flex-1" />
          <span className="text-[8px] font-mono font-bold text-white/20">{rules.length} active</span>
        </div>
        {rules.map((r, i) => {
          const cat = categories[r.cat]
          const CatIcon = cat.icon
          const barColor = r.adherence >= 80 ? "#10b981" : r.adherence >= 60 ? "#f59e0b" : "#ef4444"
          const isExpanded = expandedRule === i
          const isHovered = hoveredRule === i
          return (
            <motion.div key={i}
              className="px-3 py-2.5 rounded-lg border cursor-pointer relative overflow-hidden"
              style={{
                borderColor: isHovered ? `${cat.color}30` : "rgba(255,255,255,0.05)",
                backgroundColor: isHovered ? `${cat.color}06` : "rgba(255,255,255,0.01)",
              }}
              onClick={() => setExpandedRule(isExpanded ? null : i)}
              onMouseEnter={() => setHoveredRule(i)}
              onMouseLeave={() => setHoveredRule(null)}
              whileHover={{ boxShadow: `0 0 16px ${cat.color}08` }}>
              {isHovered && (
                <motion.div className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="absolute left-0 top-0 w-12 h-12 rounded-full"
                    style={{ backgroundColor: cat.color, filter: "blur(14px)", opacity: 0.06 }} />
                </motion.div>
              )}
              <div className="flex items-center gap-2 mb-1.5 relative z-10">
                <CatIcon className="w-3 h-3" style={{ color: isHovered ? cat.color : `${cat.color}55` }} />
                <span className="text-[7px] font-mono font-black uppercase tracking-wider" style={{ color: `${cat.color}60` }}>{cat.label}</span>
                <div className="flex-1" />
                <span className="text-[10px] font-mono font-black tabular-nums" style={{ color: barColor }}>{r.adherence}%</span>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-3 h-3 text-white/20" />
                </motion.div>
              </div>
              <span className="text-[10px] font-mono text-white/40 block mb-2 relative z-10">{r.text}</span>
              <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden relative z-10">
                <motion.div className="h-full rounded-full"
                  style={{ backgroundColor: barColor, boxShadow: `0 0 6px ${barColor}30` }}
                  initial={{ width: 0 }} animate={{ width: `${r.adherence}%` }}
                  transition={{ duration: 0.7, delay: i * 0.12 }} />
              </div>
              <div className="flex items-center gap-3 mt-2 relative z-10">
                <span className="text-[8px] font-mono text-white/20 flex items-center gap-1">
                  <Flame className="w-2.5 h-2.5" style={{ color: r.streak > 0 ? "#f59e0b60" : "rgba(255,255,255,0.1)" }} />
                  {r.streak} day streak
                </span>
                <span className="text-[8px] font-mono text-white/15">best: {r.bestStreak}</span>
                <div className="flex-1" />
                <span className="text-[8px] font-mono" style={{ color: r.violations > 3 ? "#ef444460" : "rgba(255,255,255,0.15)" }}>{r.violations} violations</span>
              </div>
              {/* Expandable teaching + weekly strip */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="relative z-10 mt-2.5 pt-2.5 border-t space-y-2"
                    style={{ borderColor: `${cat.color}15` }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}>
                    {/* Teaching */}
                    <div className="px-2 py-1.5 rounded-md" style={{ backgroundColor: `${cat.color}06` }}>
                      <span className="text-[7px] font-mono font-bold uppercase tracking-wider" style={{ color: `${cat.color}50` }}>Teaching</span>
                      <p className="text-[9px] font-mono text-white/30 leading-relaxed mt-0.5">{r.teaching}</p>
                    </div>
                    {/* Weekly adherence strip */}
                    <div>
                      <span className="text-[7px] font-mono font-bold text-white/20 uppercase tracking-wider block mb-1">This Week</span>
                      <div className="flex items-center gap-1">
                        {["M", "T", "W", "T", "F", "S", "S"].map((d, di) => (
                          <div key={di} className="flex-1 flex flex-col items-center gap-0.5">
                            <div className="w-full h-2 rounded-sm" style={{
                              backgroundColor: r.weeklyHistory[di] === 1 ? "#10b98140" : "#ef444430",
                              border: `1px solid ${r.weeklyHistory[di] === 1 ? "#10b98125" : "#ef444420"}`,
                            }} />
                            <span className="text-[5px] font-mono text-white/15">{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function LivePreviewExposureField({ color }: { color: string }) {
  const [hoveredCurrency, setHoveredCurrency] = useState<string | null>(null)
  const currencies = [
    { label: "USD", weight: 34, x: 50, y: 38, pairs: ["EURUSD", "GBPUSD", "USDJPY", "XAUUSD"] },
    { label: "EUR", weight: 22, x: 22, y: 28, pairs: ["EURUSD", "EURGBP"] },
    { label: "GBP", weight: 18, x: 78, y: 52, pairs: ["GBPUSD", "EURGBP", "GBPJPY"] },
    { label: "JPY", weight: 14, x: 28, y: 72, pairs: ["USDJPY", "GBPJPY"] },
    { label: "XAU", weight: 12, x: 72, y: 22, pairs: ["XAUUSD"] },
  ]
  const connections = [
    { from: 0, to: 1, pair: "EURUSD", thickness: 1.2 },
    { from: 0, to: 2, pair: "GBPUSD", thickness: 0.8 },
    { from: 0, to: 3, pair: "USDJPY", thickness: 0.6 },
    { from: 0, to: 4, pair: "XAUUSD", thickness: 0.5 },
    { from: 1, to: 2, pair: "EURGBP", thickness: 0.4 },
    { from: 2, to: 3, pair: "GBPJPY", thickness: 0.4 },
  ]
  const isConcentrated = currencies[0].weight > 33
  return (
    <div className="rounded-xl border overflow-hidden relative" style={{ borderColor: `${color}20`, backgroundColor: `${color}04` }}>
      <div className="relative z-10 p-4">
        <div className="flex items-center gap-2 mb-2.5">
          <CircleDot className="w-3.5 h-3.5" style={{ color: `${color}60` }} />
          <span className="text-[9px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${color}55` }}>Capital Exposure Field</span>
          <div className="flex-1" />
          <motion.span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-md border"
            style={{
              backgroundColor: isConcentrated ? "#f59e0b12" : "#10b98112",
              color: isConcentrated ? "#f59e0b80" : "#10b98180",
              borderColor: isConcentrated ? "#f59e0b25" : "#10b98125",
            }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity }}>{isConcentrated ? "WEIGHTED" : "BALANCED"}</motion.span>
        </div>
        <div className="relative h-28">
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {connections.map((conn, ci) => {
              const from = currencies[conn.from]
              const to = currencies[conn.to]
              const isHighlighted = hoveredCurrency === from.label || hoveredCurrency === to.label
              return (
                <motion.line key={ci}
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={isHighlighted ? `${color}40` : `${color}12`}
                  strokeWidth={isHighlighted ? conn.thickness * 2 : conn.thickness}
                  strokeDasharray={isHighlighted ? "none" : "2 2"}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.2 + ci * 0.1 }} />
              )
            })}
          </svg>
          {/* Currency bodies */}
          {currencies.map((c, i) => {
            const size = 14 + (c.weight / 34) * 18
            const isHovered = hoveredCurrency === c.label
            return (
              <motion.div key={c.label}
                className="absolute flex flex-col items-center cursor-pointer"
                style={{ left: `${c.x}%`, top: `${c.y}%`, transform: "translate(-50%, -50%)" }}
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 200 }}
                onMouseEnter={() => setHoveredCurrency(c.label)}
                onMouseLeave={() => setHoveredCurrency(null)}>
                <motion.div className="rounded-full flex items-center justify-center relative"
                  style={{
                    width: size, height: size,
                    backgroundColor: isHovered ? `${color}25` : `${color}12`,
                    border: `1.5px solid ${isHovered ? `${color}50` : `${color}25`}`,
                    boxShadow: isHovered ? `0 0 ${size * 2}px ${color}20` : `0 0 ${size}px ${color}08`,
                  }}
                  animate={isHovered ? { scale: [1, 1.15, 1] } : { boxShadow: [`0 0 ${size}px ${color}06`, `0 0 ${size * 1.5}px ${color}12`, `0 0 ${size}px ${color}06`] }}
                  transition={{ duration: isHovered ? 0.4 : 3, repeat: isHovered ? 0 : Infinity, delay: i * 0.5 }}>
                  <span className="text-[7px] font-mono font-black" style={{ color: isHovered ? color : `${color}70` }}>{c.label}</span>
                </motion.div>
                <span className="text-[7px] font-mono font-bold mt-0.5" style={{ color: isHovered ? `${color}80` : `${color}40` }}>{c.weight}%</span>
                {/* Hover tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute top-full mt-1 px-2.5 py-1.5 rounded-lg border z-30 whitespace-nowrap"
                      style={{ backgroundColor: "#0a0e14", borderColor: `${color}30`, boxShadow: `0 4px 12px rgba(0,0,0,0.5)` }}
                      initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -2 }}
                      transition={{ duration: 0.15 }}>
                      <div className="text-[8px] font-mono font-bold" style={{ color }}>{c.label}: {c.weight}% exposure</div>
                      <div className="text-[7px] font-mono text-white/30">{c.pairs.join(", ")}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
        {/* Balance indicator bar */}
        <div className="flex items-center gap-2 mt-1">
          {currencies.map((c) => (
            <motion.div key={c.label} className="flex-1 flex flex-col items-center gap-0.5"
              whileHover={{ scale: 1.05 }}>
              <div className="w-full h-1 rounded-full overflow-hidden bg-white/[0.04]">
                <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
                  initial={{ width: 0 }} animate={{ width: `${c.weight * 2.9}%` }}
                  transition={{ duration: 0.6, delay: 0.8 }} />
              </div>
              <span className="text-[6px] font-mono" style={{ color: `${color}40` }}>{c.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LivePreviewDNARings({ color }: { color: string }) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null)
  const [expandedSegment, setExpandedSegment] = useState<string | null>(null)
  const segments = [
    { label: "LIMIT", pct: 55, color: "#06b6d4", meaning: "Patient, planned entries at pre-determined price levels" },
    { label: "MARKET", pct: 30, color: "#ef4444", meaning: "Reactive entries, often driven by urgency or emotion" },
    { label: "STOP", pct: 15, color: "#f59e0b", meaning: "Conditional entries triggered by price breakouts" },
  ]
  const identity = "HYBRID"
  const identityColor = "#06b6d4"
  return (
    <div className="rounded-xl border overflow-hidden relative" style={{ borderColor: `${color}20`, backgroundColor: `${color}04` }}>
      <div className="relative z-10 p-4">
        <div className="flex items-center gap-2 mb-3.5">
          <Target className="w-3.5 h-3.5" style={{ color: `${color}60` }} />
          <span className="text-[9px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${color}55` }}>Execution DNA Profile</span>
          <div className="flex-1" />
          <motion.span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-md border"
            style={{ backgroundColor: `${identityColor}12`, color: `${identityColor}80`, borderColor: `${identityColor}25` }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity }}>{identity}</motion.span>
        </div>
        {/* Concentric rings */}
        <div className="flex items-center justify-center mb-3.5">
          <div className="relative">
            <svg width="96" height="96" viewBox="0 0 96 96">
              {/* Outer ring segments */}
              <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="7" />
              {(() => {
                const r = 42
                const circ = 2 * Math.PI * r
                let offset = 0
                return segments.map((seg, i) => {
                  const dash = (seg.pct / 100) * circ
                  const isHovered = hoveredSegment === seg.label
                  const el = (
                    <motion.circle key={seg.label} cx="48" cy="48" r={r} fill="none"
                      stroke={seg.color} strokeWidth={isHovered ? 9 : 7}
                      strokeDasharray={`${dash} ${circ - dash}`}
                      strokeDashoffset={-offset}
                      transform="rotate(-90 48 48)"
                      initial={{ opacity: 0 }} animate={{ opacity: isHovered ? 1 : 0.7 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        filter: isHovered ? `drop-shadow(0 0 8px ${seg.color}50)` : `drop-shadow(0 0 3px ${seg.color}25)`,
                        cursor: "pointer",
                      }}
                      onMouseEnter={() => setHoveredSegment(seg.label)}
                      onMouseLeave={() => setHoveredSegment(null)}
                      onClick={() => setExpandedSegment(expandedSegment === seg.label ? null : seg.label)} />
                  )
                  offset += dash
                  return el
                })
              })()}
              {/* Middle ring -- timing quality */}
              <circle cx="48" cy="48" r="30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="5" />
              <motion.circle cx="48" cy="48" r="30" fill="none" stroke="#10b981" strokeWidth="5"
                strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 30 * 0.72} ${2 * Math.PI * 30 * 0.28}`}
                transform="rotate(-90 48 48)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                style={{ filter: "drop-shadow(0 0 4px #10b98130)" }} />
              <motion.circle cx="48" cy="48" r="30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 30 * 0.28} ${2 * Math.PI * 30 * 0.72}`}
                strokeDashoffset={-(2 * Math.PI * 30 * 0.72)}
                transform="rotate(-90 48 48)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                transition={{ duration: 0.7, delay: 0.7 }} />
              {/* Inner core */}
              <circle cx="48" cy="48" r="18" fill={`${identityColor}08`} stroke={`${identityColor}20`} strokeWidth="1.5" />
              <motion.circle cx="48" cy="48" r="18" fill="none" stroke={`${identityColor}15`} strokeWidth="1"
                animate={{ r: [18, 20, 18], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span className="text-[10px] font-mono font-black tracking-wider"
                style={{ color: identityColor }}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, type: "spring" }}>{identity}</motion.span>
              <span className="text-[6px] font-mono text-white/20 mt-0.5">55% limit</span>
            </div>
          </div>
        </div>
        {/* Behavioral Spectrum */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[7px] font-mono font-bold text-white/20 uppercase tracking-wider">Patience Spectrum</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden relative" style={{ background: "linear-gradient(to right, #ef4444, #f59e0b, #06b6d4, #10b981)" }}>
            <motion.div className="absolute top-0 w-2.5 h-2 rounded-full bg-white border border-white/60"
              style={{ boxShadow: "0 0 8px rgba(255,255,255,0.6)" }}
              initial={{ left: "0%" }} animate={{ left: "55%" }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[7px] font-mono text-red-400/50">IMPULSIVE</span>
            <span className="text-[7px] font-mono text-amber-400/40">REACTIVE</span>
            <span className="text-[7px] font-mono text-cyan-400/40">HYBRID</span>
            <span className="text-[7px] font-mono text-green-400/50">SNIPER</span>
          </div>
        </div>
        {/* Segment legend with hover and expandable detail */}
        <div className="space-y-1.5">
          {segments.map(s => {
            const isHovered = hoveredSegment === s.label
            const isExpanded = expandedSegment === s.label
            return (
              <motion.div key={s.label}
                className="flex flex-col px-2.5 py-1.5 rounded-lg border cursor-pointer"
                style={{
                  borderColor: isHovered ? `${s.color}30` : "rgba(255,255,255,0.04)",
                  backgroundColor: isHovered ? `${s.color}06` : "transparent",
                }}
                onMouseEnter={() => setHoveredSegment(s.label)}
                onMouseLeave={() => setHoveredSegment(null)}
                onClick={() => setExpandedSegment(isExpanded ? null : s.label)}
                whileHover={{ boxShadow: `0 0 12px ${s.color}08` }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color, boxShadow: isHovered ? `0 0 6px ${s.color}40` : "none" }} />
                  <span className="text-[8px] font-mono font-bold" style={{ color: isHovered ? s.color : `${s.color}60` }}>{s.label}</span>
                  <div className="flex-1" />
                  <span className="text-[9px] font-mono font-black tabular-nums" style={{ color: s.color }}>{s.pct}%</span>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-2.5 h-2.5 text-white/15" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      className="mt-1.5 pt-1.5 border-t"
                      style={{ borderColor: `${s.color}12` }}
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}>
                      <p className="text-[8px] font-mono text-white/30 leading-relaxed">{s.meaning}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const STRATEGY_PREVIEW_COMPONENTS: Record<string, React.FC<{ color: string }>> = {
  "nerve-center": LivePreviewNerveCenter,
  "mirror-timeline": LivePreviewMirrorTimeline,
  "rule-card": LivePreviewRuleCard,
  "exposure-field": LivePreviewExposureField,
  "dna-rings": LivePreviewDNARings,
}


// ═════════════════════════════════════�����═════════════════════════════
// STRATEGY TUTORIAL OVERLAY -- Step-by-step interactive guide
// Adapted from ActivityTutorialOverlay with Strategy-specific content
// ═══════════════════════════════════════════════════════════════════

function StrategyTutorialOverlay({
  onClose,
  onStartDemo,
}: {
  onClose: () => void
  onStartDemo: () => void
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)

  const totalSteps = STRATEGY_GUIDE_SECTIONS.length + 1 // +1 for welcome
  const isLast = currentStep === totalSteps - 1
  const isWelcome = currentStep === 0

  const guideSection = isWelcome ? null : STRATEGY_GUIDE_SECTIONS[currentStep - 1]
  const stepColor = isWelcome ? "#10b981" : guideSection!.color
  const StepIcon = isWelcome ? Hexagon : guideSection!.icon
  const PreviewComponent = guideSection ? STRATEGY_PREVIEW_COMPONENTS[guideSection.livePreviewType] : null
  const dataSourceColor = guideSection
    ? guideSection.dataSource === "composite" ? "#10b981" : guideSection.dataSource === "rules" ? "#f59e0b" : guideSection.dataSource === "instruments" ? "#8b5cf6" : guideSection.dataSource === "entries" ? "#ef4444" : "#06b6d4"
    : "#10b981"
  const dataSourceLabel = guideSection
    ? guideSection.dataSource === "composite" ? "COMPOSITE" : guideSection.dataSource === "rules" ? "RULES" : guideSection.dataSource === "instruments" ? "INSTRUMENTS" : guideSection.dataSource === "entries" ? "ENTRIES" : "PROFILE"
    : ""

  const goNext = () => {
    if (isLast) {
      onStartDemo()
      onClose()
      return
    }
    setCurrentStep(currentStep + 1)
  }

  const goPrev = () => {
    if (currentStep === 0) return
    setCurrentStep(currentStep - 1)
  }

  return (
    <motion.div
      className="absolute inset-0 z-[60] flex flex-col bg-[#06080c]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
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
                    Strategy OS Tutorial
                  </span>
                  <span className="text-[8px] font-mono font-black px-2 py-0.5 rounded-md border"
                    style={{ backgroundColor: `${stepColor}10`, color: `${stepColor}60`, borderColor: `${stepColor}15` }}>
                    {currentStep + 1} / {totalSteps}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-white/25 ml-0.5">
                  {isWelcome ? "Learn how to operate your strategic discipline framework" : guideSection!.componentRef}
                </span>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="text-[8px] font-mono font-black text-white/20 hover:text-white/50 uppercase tracking-wider px-3 py-1.5 rounded-lg border border-white/[0.06] hover:border-white/[0.12] transition-all"
              whileTap={{ scale: 0.95 }}
            >
              SKIP
            </motion.button>
          </div>
        </div>
      </div>

      {/* Step progress bar */}
      <div className="flex-shrink-0 px-4 pb-3">
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 h-[3px] rounded-full overflow-hidden cursor-pointer"
              style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
              onClick={() => setCurrentStep(i)}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: i <= currentStep ? stepColor : "transparent" }}
                initial={{ width: 0 }}
                animate={{ width: i <= currentStep ? "100%" : "0%" }}
                transition={{ duration: 0.4, delay: i === currentStep ? 0.2 : 0 }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-terminal">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {isWelcome ? (
              /* ═══ WELCOME STEP ═══ */
              <div className="px-4 pb-6">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-5 relative overflow-hidden">
                  <motion.div className="absolute inset-0 pointer-events-none"
                    animate={{ opacity: [0, 0.02, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}>
                    <div className="absolute left-0 top-0 w-40 h-40 rounded-full"
                      style={{ backgroundColor: "#10b981", filter: "blur(50px)" }} />
                    <div className="absolute right-0 bottom-0 w-32 h-32 rounded-full"
                      style={{ backgroundColor: "#06b6d4", filter: "blur(40px)" }} />
                  </motion.div>
                  <div className="relative space-y-4">
                    <div className="flex items-center gap-2.5">
                      <motion.div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-400/8 border border-emerald-400/15"
                        animate={{ boxShadow: ["0 0 12px rgba(16,185,129,0.04)", "0 0 20px rgba(16,185,129,0.1)", "0 0 12px rgba(16,185,129,0.04)"] }}
                        transition={{ duration: 4, repeat: Infinity }}>
                        <Hexagon className="w-5 h-5 text-emerald-400/60" />
                      </motion.div>
                      <div>
                        <h3 className="text-[16px] font-mono font-black text-white/70 uppercase tracking-wider">
                          Strategy Operating System
                        </h3>
                        <p className="text-[10px] font-mono text-white/25 mt-0.5">{"Your complete strategic discipline and execution framework"}</p>
                      </div>
                    </div>

                    <p className="text-[13px] text-white/40 leading-[1.8]">
                      {"The Strategy OS is not a dashboard. It is an operating system for strategic discipline. It processes your complete trading identity through five interconnected pillars: the Nerve Center gives you a 5-second health assessment. The Discipline Mirror shows the gap between what you planned and what you actually did. Rule Commitments tracks every behavioral contract you made with yourself. The Capital Exposure Map reveals concentration risk you cannot see in a standard portfolio view. And your Execution DNA Profile decodes how you actually enter the market versus how you think you enter. Together, these five systems form a living reflection of who you are as a trader -- built from your real data, not your assumptions. Every element is interactive. Every metric is computed. Every section teaches you something about your own behavior that you would not discover on your own."}
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {[
                        { label: "DIAGNOSTIC", color: "#10b981", count: "2 pillars", desc: "Nerve Center cockpit for system health and Discipline Mirror for weekly behavioral accountability" },
                        { label: "BEHAVIORAL", color: "#f59e0b", count: "2 pillars", desc: "Rule Commitments tracking your compliance record and the teaching wisdom behind every rule" },
                        { label: "STRUCTURAL", color: "#ef4444", count: "2 pillars", desc: "Capital Exposure Map for concentration risk and Execution DNA Profile for order identity" },
                      ].map(source => (
                        <motion.div key={source.label}
                          className="px-3 py-3 rounded-xl border relative overflow-hidden cursor-default"
                          style={{
                            backgroundColor: `${source.color}03`,
                            borderColor: `${source.color}10`,
                          }}
                        >
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

                    {/* Trader profiles overview */}
                    <div className="rounded-xl border border-white/[0.05] bg-white/[0.01] p-3.5">
                      <div className="flex items-center gap-2 mb-2.5">
                        <Activity className="w-3.5 h-3.5 text-white/25" />
                        <span className="text-[8px] font-mono font-black uppercase tracking-[0.15em] text-white/25">5 Trader Profiles</span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {[
                          { label: "Elite", grade: "A+", color: "#10b981" },
                          { label: "Disciplined", grade: "A", color: "#06b6d4" },
                          { label: "Developing", grade: "B", color: "#f59e0b" },
                          { label: "Struggling", grade: "C", color: "#f97316" },
                          { label: "Reckless", grade: "D", color: "#ef4444" },
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
                        <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 bg-emerald-400/10 border border-emerald-400/15">
                          <Fingerprint className="w-3 h-3 text-emerald-400/50" />
                        </div>
                        <div>
                          <span className="text-[7px] font-mono font-black uppercase tracking-[0.15em] text-white/20 block mb-1">
                            HOW TO USE THIS TUTORIAL
                          </span>
                          <p className="text-[11px] text-white/35 leading-relaxed">
                            {"This tutorial walks you through every pillar of the Strategy OS in sequence. Each step includes a live interactive preview that behaves like the real feature, a detailed explanation of what the section does and why it matters, the data architecture behind it, and practical operator guidance on how to read and use it correctly. Press NEXT SECTION to advance, or use the navigation grid below to jump directly to any pillar. Hover and interact with the live previews -- they respond just like the real system."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : guideSection && (
              /* ═══ GUIDE SECTION STEP ═══ */
              <div className="px-4 pb-6 space-y-4">
                {/* Section header card */}
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
                      style={{
                        backgroundColor: `${guideSection.color}12`,
                        border: `1px solid ${guideSection.color}28`,
                        boxShadow: `0 0 16px ${guideSection.color}10`,
                      }}
                      animate={{ boxShadow: [`0 0 12px ${guideSection.color}06`, `0 0 24px ${guideSection.color}14`, `0 0 12px ${guideSection.color}06`] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <StepIcon className="w-5 h-5" style={{ color: `${guideSection.color}85` }} />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-[15px] font-mono font-black uppercase tracking-wider"
                          style={{ color: guideSection.color }}>
                          {guideSection.title}
                        </span>
                        <span className="text-[7px] font-mono font-black px-1.5 py-0.5 rounded tracking-wider"
                          style={{
                            backgroundColor: `${dataSourceColor}08`,
                            color: `${dataSourceColor}55`,
                            border: `1px solid ${dataSourceColor}15`,
                          }}>
                          {dataSourceLabel}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-white/30 mt-1 block">{guideSection.componentRef}</span>
                    </div>
                  </div>
                </div>

                {/* ═══ LIVE PREVIEW ═══ */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <motion.div className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: guideSection.color }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }} />
                    <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em]"
                      style={{ color: `${guideSection.color}60` }}>
                      Interactive Preview
                    </span>
                    <div className="flex-1 h-px" style={{ backgroundColor: `${guideSection.color}10` }} />
                    <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider">hover to explore</span>
                  </div>
                  {PreviewComponent && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                    >
                      <PreviewComponent color={guideSection.color} />
                    </motion.div>
                  )}
                </div>

                {/* ═══ DESCRIPTION ═══ */}
                <div className="rounded-xl border border-white/[0.05] bg-white/[0.01] px-4 py-3.5">
                  <p className="text-[13px] text-white/50 leading-[1.85]">
                    {guideSection.description}
                  </p>
                </div>

                {/* ═══ KEY ELEMENTS ═══ */}
                <motion.div className="space-y-2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Scan className="w-3.5 h-3.5" style={{ color: `${guideSection.color}40` }} />
                    <span className="text-[9px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${guideSection.color}40` }}>
                      Key Components
                    </span>
                    <div className="flex-1 h-px" style={{ backgroundColor: `${guideSection.color}06` }} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {guideSection.keyElements.map((el, j) => (
                      <motion.div
                        key={el.label}
                        className="px-3 py-2.5 rounded-xl border relative overflow-hidden group cursor-default"
                        style={{
                          backgroundColor: hoveredElement === `tut-${guideSection.id}-${j}` ? `${guideSection.color}06` : "rgba(255,255,255,0.008)",
                          borderColor: hoveredElement === `tut-${guideSection.id}-${j}` ? `${guideSection.color}22` : "rgba(255,255,255,0.04)",
                        }}
                        onMouseEnter={() => setHoveredElement(`tut-${guideSection.id}-${j}`)}
                        onMouseLeave={() => setHoveredElement(null)}
                        whileHover={{ scale: 1.015, borderColor: `${guideSection.color}28` }}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + j * 0.06 }}
                      >
                        {hoveredElement === `tut-${guideSection.id}-${j}` && (
                          <motion.div className="absolute inset-0 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}>
                            <div className="absolute left-0 top-0 w-14 h-14 rounded-full"
                              style={{ backgroundColor: guideSection.color, filter: "blur(16px)", opacity: 0.06 }} />
                          </motion.div>
                        )}
                        <span className="text-[10px] font-mono font-black block mb-1 relative z-10"
                          style={{ color: hoveredElement === `tut-${guideSection.id}-${j}` ? guideSection.color : `${guideSection.color}65` }}>
                          {el.label}
                        </span>
                        <span className="text-[9px] font-mono text-white/25 leading-relaxed block relative z-10">{el.desc}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* ═══ HOW IT WORKS ═══ */}
                <motion.div className="rounded-xl border relative overflow-hidden"
                  style={{ borderColor: `${guideSection.color}10`, backgroundColor: `${guideSection.color}02` }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}>
                  <motion.div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
                    style={{ backgroundColor: `${guideSection.color}15` }}
                    animate={{ backgroundColor: [`${guideSection.color}10`, `${guideSection.color}35`, `${guideSection.color}10`] }}
                    transition={{ duration: 3.5, repeat: Infinity }} />
                  <motion.div className="absolute inset-0 pointer-events-none"
                    animate={{ opacity: [0.01, 0.03, 0.01] }}
                    transition={{ duration: 5, repeat: Infinity }}>
                    <div className="absolute left-0 top-0 w-20 h-20 rounded-full"
                      style={{ backgroundColor: guideSection.color, filter: "blur(25px)" }} />
                  </motion.div>
                  <div className="px-4 py-3.5 relative z-10 space-y-2">
                    <div className="flex items-center gap-2">
                      <Settings2 className="w-4 h-4" style={{ color: `${guideSection.color}45` }} />
                      <span className="text-[10px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${guideSection.color}45` }}>
                        Under the Hood
                      </span>
                    </div>
                    <p className="text-[12px] text-white/40 leading-[1.85]">
                      {guideSection.howItWorks}
                    </p>
                  </div>
                </motion.div>

                {/* ═══ WHAT CHANGES IT + VARIATIONS ═══ */}
                <motion.div className="grid grid-cols-2 gap-2.5"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}>
                  <div className="px-3.5 py-3 rounded-xl border border-white/[0.05] bg-white/[0.008] relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-white/[0.06]" />
                    <div className="flex items-center gap-2 mb-2">
                      <Gauge className="w-3.5 h-3.5 text-white/25" />
                      <span className="text-[9px] font-mono font-black text-white/22 uppercase tracking-[0.12em]">
                        What Drives Change
                      </span>
                    </div>
                    <p className="text-[11px] text-white/30 leading-[1.7]">
                      {guideSection.whatChangesIt}
                    </p>
                  </div>
                  <div className="px-3.5 py-3 rounded-xl border relative overflow-hidden"
                    style={{ backgroundColor: `${guideSection.color}03`, borderColor: `${guideSection.color}10` }}>
                    <motion.div className="absolute inset-0 pointer-events-none"
                      animate={{ opacity: [0.01, 0.03, 0.01] }}
                      transition={{ duration: 4, repeat: Infinity }}>
                      <div className="absolute right-0 bottom-0 w-12 h-12 rounded-full"
                        style={{ backgroundColor: guideSection.color, filter: "blur(14px)" }} />
                    </motion.div>
                    <div className="flex items-center gap-2 mb-2 relative z-10">
                      <Layers className="w-3.5 h-3.5" style={{ color: `${guideSection.color}35` }} />
                      <span className="text-[9px] font-mono font-black uppercase tracking-[0.12em]" style={{ color: `${guideSection.color}35` }}>
                        Depth & Range
                      </span>
                    </div>
                    <p className="text-[11px] leading-[1.7] relative z-10" style={{ color: `${guideSection.color}50` }}>{guideSection.variationCount}</p>
                  </div>
                </motion.div>

                {/* ═══ CODE SIGNALS ═══ */}
                <motion.div className="space-y-2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32 }}>
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-3.5 h-3.5" style={{ color: `${guideSection.color}35` }} />
                    <span className="text-[9px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${guideSection.color}35` }}>
                      Data Architecture
                    </span>
                    <div className="flex-1 h-px" style={{ backgroundColor: `${guideSection.color}06` }} />
                  </div>
                  <div className="space-y-1.5">
                    {guideSection.codeSignals.map((sig, j) => (
                      <motion.div key={sig.name}
                        className="px-3 py-2 rounded-lg border border-white/[0.04] bg-white/[0.008] relative overflow-hidden"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + j * 0.06 }}>
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

                {/* ═══ INTERACTIVE ACTIONS ═══ */}
                <motion.div className="space-y-2.5"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}>
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-3.5 h-3.5" style={{ color: `${guideSection.color}35` }} />
                    <span className="text-[9px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${guideSection.color}35` }}>
                      How to Interact
                    </span>
                    <div className="flex-1 h-px" style={{ backgroundColor: `${guideSection.color}06` }} />
                  </div>
                  <div className="space-y-2">
                    {guideSection.interactiveButtons.map((btn) => (
                      <motion.div key={btn.label} className="group">
                        <motion.button
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all relative overflow-hidden"
                          style={{
                            borderColor: `${btn.color}12`,
                            backgroundColor: `${btn.color}03`,
                          }}
                          whileHover={{
                            backgroundColor: `${btn.color}08`,
                            borderColor: `${btn.color}25`,
                            boxShadow: `0 0 20px ${btn.color}06, inset 0 0 15px ${btn.color}03`,
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.div className="absolute inset-0 pointer-events-none"
                            style={{ background: `radial-gradient(ellipse 60% 100% at 10% 50%, ${btn.color}06, transparent 70%)` }}
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity }} />
                          <motion.div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 relative z-10"
                            style={{ backgroundColor: `${btn.color}10`, border: `1px solid ${btn.color}18` }}
                            animate={{ boxShadow: [`0 0 8px ${btn.color}05`, `0 0 16px ${btn.color}10`, `0 0 8px ${btn.color}05`] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            <Zap className="w-3.5 h-3.5" style={{ color: `${btn.color}70` }} />
                          </motion.div>
                          <div className="flex-1 relative z-10">
                            <span className="text-[11px] font-mono font-black uppercase tracking-wider block"
                              style={{ color: `${btn.color}70` }}>
                              {btn.label}
                            </span>
                            <span className="text-[10px] font-mono text-white/25 leading-relaxed mt-0.5 block">
                              {btn.action}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 shrink-0 relative z-10 transition-transform group-hover:translate-x-0.5"
                            style={{ color: `${btn.color}30` }} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* ═══ HOW TO USE (perspective) ═══ */}
                <motion.div className="px-4 py-3.5 rounded-xl border relative overflow-hidden"
                  style={{ backgroundColor: `${guideSection.color}03`, borderColor: `${guideSection.color}12` }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}>
                  <motion.div className="absolute inset-0 pointer-events-none"
                    style={{ background: `linear-gradient(135deg, ${guideSection.color}04, transparent 50%)` }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity }} />
                  <motion.div className="absolute right-0 bottom-0 w-20 h-20 rounded-full pointer-events-none"
                    style={{ backgroundColor: guideSection.color, filter: "blur(25px)" }}
                    animate={{ opacity: [0.02, 0.05, 0.02] }}
                    transition={{ duration: 4, repeat: Infinity }} />
                  <div className="flex items-center gap-2 mb-2 relative z-10">
                    <Eye className="w-4 h-4" style={{ color: `${guideSection.color}40` }} />
                    <span className="text-[10px] font-mono font-black uppercase tracking-[0.12em]" style={{ color: `${guideSection.color}40` }}>
                      Operator Guidance
                    </span>
                  </div>
                  <p className="text-[12px] text-white/45 leading-[1.85] relative z-10">{guideSection.perspective}</p>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Section navigation buttons grid */}
      <div className="flex-shrink-0 px-4 pb-2 pt-1">
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { idx: 0, label: "Intro", icon: Hexagon, color: "#10b981" },
            ...STRATEGY_GUIDE_SECTIONS.map((s, i) => ({
              idx: i + 1,
              label: s.title.split(" ").slice(0, 2).join(" "),
              icon: s.icon,
              color: s.color,
            }))
          ].map((s, mapIdx) => {
            const isCurrent = s.idx === currentStep
            const SIcon = s.icon
            return (
              <motion.button
                key={s.idx}
                onClick={() => setCurrentStep(s.idx)}
                className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all"
                style={{
                  backgroundColor: isCurrent ? `${s.color}08` : "rgba(255,255,255,0.01)",
                  borderColor: isCurrent ? `${s.color}20` : "rgba(255,255,255,0.04)",
                }}
                initial={{ opacity: 0, y: 6 }}
                animate={isCurrent
                  ? { opacity: 1, y: 0, borderColor: [`${s.color}15`, `${s.color}30`, `${s.color}15`] }
                  : { opacity: 1, y: 0 }
                }
                transition={{ duration: isCurrent ? 2 : 0.35, delay: mapIdx * 0.06, repeat: isCurrent ? Infinity : 0 }}
              >
                <SIcon className="w-3 h-3" style={{ color: isCurrent ? `${s.color}60` : "rgba(255,255,255,0.2)" }} />
                <span className="text-[8px] font-mono font-black uppercase tracking-wider"
                  style={{ color: isCurrent ? `${s.color}70` : "rgba(255,255,255,0.2)" }}>
                  {s.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Navigation footer */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2">
        <div className="flex items-center gap-3">
          {/* Back button */}
          <motion.button
            onClick={goPrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.01] hover:bg-white/[0.03] text-white/30 hover:text-white/60 transition-all disabled:opacity-20 disabled:pointer-events-none"
            whileTap={{ scale: 0.97 }}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono font-black uppercase tracking-wider">Back</span>
          </motion.button>

          {/* Next / Start Demo button */}
          <motion.button
            onClick={goNext}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border relative overflow-hidden transition-all"
            style={{
              borderColor: `${stepColor}25`,
              backgroundColor: `${stepColor}08`,
              boxShadow: `0 0 30px ${stepColor}06`,
            }}
            whileHover={{
              backgroundColor: `${stepColor}14`,
              borderColor: `${stepColor}40`,
              boxShadow: `0 0 40px ${stepColor}10`,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div className="absolute inset-0 pointer-events-none"
              style={{ background: `linear-gradient(135deg, ${stepColor}05, transparent 60%)` }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }} />
            <span className="text-[11px] font-mono font-black uppercase tracking-wider relative z-10"
              style={{ color: stepColor }}>
              {isLast ? "Enter Strategy OS" : "Next Section"}
            </span>
            <motion.div
              className="relative z-10"
              animate={isLast ? { x: [0, 3, 0] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {isLast ? (
                <Zap className="w-4 h-4" style={{ color: stepColor }} />
              ) : (
                <ChevronRight className="w-4 h-4" style={{ color: `${stepColor}80` }} />
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}


// ═══════════════════════════════════════════════════════════════════
// MAIN EXPORT -- Strategy guide button bar with tutorial overlay
// ═══════════════════════════════════════════════════════════════════

export function StrategyGuideAndTutorial({
  onStartDemo,
}: {
  onStartDemo: () => void
}) {
  const [tutorialOpen, setTutorialOpen] = useState(false)
  return (
    <>
      {/* ─── FLOATING TUTORIAL BUTTON ─── */}
      <div className="flex items-center gap-2 px-3 py-2">
        {/* Interactive Tutorial button */}
        <motion.button
          onClick={() => setTutorialOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all group relative overflow-hidden"
          style={{ borderColor: "rgba(16,185,129,0.12)", backgroundColor: "rgba(16,185,129,0.03)" }}
          whileHover={{ backgroundColor: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.25)" }}
          whileTap={{ scale: 0.97 }}
        >
          <motion.div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 20% 50%, rgba(16,185,129,0.06), transparent 70%)" }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }} />
          <Sparkles className="w-3.5 h-3.5 text-emerald-400/40 group-hover:text-emerald-400/70 transition-colors relative z-10" />
          <span className="text-[9px] font-mono font-black text-emerald-400/40 group-hover:text-emerald-400/70 transition-colors uppercase tracking-wider relative z-10">
            Strategy Tutorial
          </span>
        </motion.button>

        {/* System Guide button */}
        <motion.button
          onClick={() => setTutorialOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all group relative overflow-hidden"
          style={{ borderColor: "rgba(6,182,212,0.12)", backgroundColor: "rgba(6,182,212,0.03)" }}
          whileHover={{ backgroundColor: "rgba(6,182,212,0.06)", borderColor: "rgba(6,182,212,0.25)" }}
          whileTap={{ scale: 0.97 }}
        >
          <motion.div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 20% 50%, rgba(6,182,212,0.06), transparent 70%)" }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} />
          <BookOpen className="w-3.5 h-3.5 text-cyan-400/40 group-hover:text-cyan-400/70 transition-colors relative z-10" />
          <span className="text-[9px] font-mono font-black text-cyan-400/40 group-hover:text-cyan-400/70 transition-colors uppercase tracking-wider relative z-10">
            System Guide
          </span>
        </motion.button>
      </div>

      {/* ─── TUTORIAL OVERLAY ─── */}
      <AnimatePresence>
        {tutorialOpen && (
          <StrategyTutorialOverlay
            onClose={() => setTutorialOpen(false)}
            onStartDemo={() => {
              onStartDemo()
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
