"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Clock,
  AlertTriangle,
  Zap,
  ArrowRight,
  Eye,
  Brain,
  Shield,
  Crosshair,
  Layers,
  Target,
  Fingerprint,
  Scan,

  Gauge,
  Settings2,
  Sparkles,
} from "lucide-react"

// ═══════════════════════════════════════════════════════════════════
// ACTIVITY GUIDE OVERLAY
// Full-page tutorial panel explaining each section of Activity
// ═══════════════════════════════════════════════════════════════════

interface GuideSection {
  id: string
  title: string
  icon: typeof Brain
  color: string
  dataSource: "time" | "day" | "state"
  description: string
  howItWorks: string
  whatChangesIt: string
  variationCount: string
  perspective: string
  // Advanced: live preview, component references, pop-up actions
  componentRef: string        // which component in Activity page this maps to
  livePreviewType: "session-strip" | "phase-bar" | "day-card" | "focus-hero" | "trap-tabs" | "threat-card" | "action-card"
  interactiveButtons: { label: string; action: string; color: string }[]
  codeSignals: { name: string; value: string; type: "function" | "prop" | "state" }[]
  keyElements: { label: string; desc: string }[]
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "session",
    title: "Session Identity",
    icon: Clock,
    color: "#3b82f6",
    dataSource: "time",
    description: "This is the first thing you check every time you open the platform. Session Identity answers the most important question in trading: where are you in the trading day? Not what the chart looks like. Not what your gut says. Where the institutional clock says you are. The market operates on a fixed daily rhythm -- Asia accumulates, London displaces, New York continues or reverses, and the rest is noise. This section locks you into that rhythm so you never trade outside of context. When the killzone indicator is pulsing, institutional order flow is statistically active. When it is not pulsing, you are trading in low-probability territory. This is not a suggestion -- it is the structural reality of how liquidity moves through global markets.",
    howItWorks: "The system reads your UTC clock and maps it against the 8 major market sessions. Each session has strict time boundaries. During killzone windows (London 07:00-10:00, New York 13:00-16:00, London Close 15:00-16:00), the system activates high-probability mode. The progress bar shows exactly how far into the current session you are, so you always know whether you are early, mid, or late in the window. This removes the most common timing mistake traders make: entering when the session has already exhausted its move.",
    whatChangesIt: "The clock. Nothing else. This is deliberate. Session Identity is immune to emotions, chart noise, and impulse. It changes only when real time advances. You cannot manipulate it, override it, or rationalize around it. That is what makes it reliable.",
    variationCount: "8 sessions, each with 2-6 internal phases = ~30 unique states across the full trading day",
    perspective: "Check this BEFORE you look at the chart. If you are outside a killzone, close the chart. If the session is winding down, do not initiate new positions. If the killzone dot is pulsing and you have done your analysis, this is your window. Let Session Identity be your permission system -- not your chart, not your feelings, not a random alert from someone else.",
    componentRef: "Your real-time session clock",
    livePreviewType: "session-strip",
    interactiveButtons: [
      { label: "Switch Session", action: "Navigate through all 8 sessions to understand the full daily rhythm and when each window opens", color: "#3b82f6" },
      { label: "Toggle 24H", action: "Watch the full 24-hour cycle play out -- see how sessions transition and which windows actually matter", color: "#f59e0b" },
    ],
    codeSignals: [
      { name: "getSessionInfo()", type: "function", value: "Returns session name, phase, killzone status, remaining time from UTC" },
      { name: "kzProgress", type: "state", value: "0.0 - 1.0 float representing position within killzone" },
      { name: "session.killzone", type: "prop", value: "Boolean: true during London KZ, NY KZ, London Close" },
    ],
    keyElements: [
      { label: "Session Name", desc: "Tells you which market session is currently running -- this sets the context for everything else" },
      { label: "Killzone Pulse", desc: "When this pulses, institutional flow is statistically active -- this is your GO signal for entries" },
      { label: "Progress Bar", desc: "Shows how far through the session you are -- early means patience, late means caution, expired means stop" },
      { label: "Time Remaining", desc: "Exact minutes left in the current window -- prevents the mistake of entering when the session has already peaked" },
    ],
  },
  {
    id: "phase-timeline",
    title: "Phase Timeline",
    icon: Layers,
    color: "#10b981",
    dataSource: "time",
    description: "Session Identity tells you WHICH session you are in. Phase Timeline tells you WHERE inside that session you are. This distinction is critical. A killzone is not one uniform block of time -- it has internal structure. The first minutes are for observation, not action. The middle is for execution. The final stretch is for management, not new entries. Most traders treat an entire session as one opportunity. Professionals know that the phase within the session determines what you are allowed to do. Phase Timeline enforces this structure so you stop treating all killzone minutes as equal. They are not.",
    howItWorks: "Each major session is divided into sequential phases. London and New York each have 6 phases: Opening Volatility, Direction Window, Optimal Entry, Expansion, Momentum Fade, and Wind Down. As minutes pass within the killzone, the active phase advances automatically. Each phase carries a specific operational instruction -- what to watch for, what to execute, and what to avoid. The transition between phases is your signal to adjust behavior, not continue doing whatever you were doing in the last phase.",
    whatChangesIt: "Time progression within the active killzone. Each phase has a start and end percentage of the killzone window. As minutes pass, the system advances through phases automatically. You cannot skip phases. You cannot go back. This mirrors the market -- it does not wait for you, and neither does the phase system.",
    variationCount: "6 phases per major killzone, each with unique focus instructions -- 18+ phase states across the trading day",
    perspective: "Before entering any trade, check which phase you are in. If you are in the Opening phase, your job is to observe how price reacts to the session open -- not to enter. If you are in the Entry phase, you have permission to execute. If you are in the Fade or Wind Down phase, your only job is to manage existing positions or stand down. The number one execution mistake is entering during the wrong phase. Phase Timeline exists to eliminate that mistake. Read the phase. Obey the phase. Every phase prepares you for the next one.",
    componentRef: "Your execution rhythm inside each session",
    livePreviewType: "phase-bar",
    interactiveButtons: [
      { label: "Walk Through Phases", action: "Step through each phase to understand what is expected of you at every stage of the killzone", color: "#10b981" },
      { label: "Phase Discipline Rules", action: "See the exact behavioral rules for each phase -- when to wait, when to act, when to stop", color: "#8b5cf6" },
    ],
    codeSignals: [
      { name: "getPhaseBlocks()", type: "function", value: "Returns array of phase objects with name, start%, end%, focus text" },
      { name: "activePhaseIdx", type: "state", value: "Index of currently active phase block" },
      { name: "phase.focus", type: "prop", value: "Text describing what to focus on during this phase" },
    ],
    keyElements: [
      { label: "Phase Blocks", desc: "Sequential segments showing the internal rhythm of the killzone -- each block represents a different operational mode" },
      { label: "Active Phase", desc: "The highlighted phase is where you are NOW -- its instruction overrides whatever you were doing in the previous phase" },
      { label: "Phase Instruction", desc: "The text beneath tells you exactly what to focus on -- this is not a suggestion, it is the phase's operational rule" },
      { label: "Phase Progress", desc: "Shows how far through the current phase you are -- approaching the end means prepare for the next phase's rules" },
    ],
  },
  {
    id: "day-intel",
    title: "Day Intelligence",
    icon: Calendar,
    color: "#f59e0b",
    dataSource: "day",
    description: "Not every trading day is created equal. Monday behaves differently than Tuesday. Friday is not Wednesday. This is not opinion -- it is structural market behavior built into how institutional order flow distributes across the week. Day Intelligence gives you the weekly rhythm before you even look at a chart. It tells you what kind of day this is, what manipulation pattern to expect, how aggressively to size your positions, and what behavioral trap is most likely to affect you today. Read this section before every session. It sets the frame for your entire decision-making process. If the day is marked AVOID, your best trade is no trade. If it is marked PRIME, you have statistical permission to operate at full capacity.",
    howItWorks: "Each day of the week carries a fixed intelligence profile based on how institutional markets historically behave. Monday is typically a manipulation day -- price often establishes false direction to trap early-week traders. Tuesday is historically the highest-probability day for clean directional moves. Wednesday often continues or corrects Tuesday's move. Thursday is selective -- trends may exhaust. Friday is high-risk for reversals and end-of-week positioning. Weekends are no-trade zones. This framework gives you a behavioral baseline before any technical analysis begins.",
    whatChangesIt: "The calendar. Day Intelligence updates at midnight UTC when the trading day changes. It is immune to price action, news, and emotion. This is intentional. The weekly rhythm exists whether you acknowledge it or not. Day Intelligence makes sure you acknowledge it before you trade.",
    variationCount: "7 distinct day profiles, each with unique recommendation, manipulation warning, sizing guidance, and behavioral risk",
    perspective: "This is your pre-session briefing. Open it before you analyze any chart. If today is a CAUTION day, reduce your size before you even start. If today is an AVOID day, the most disciplined thing you can do is close the platform. The traders who lose the most are the ones who trade every day the same way. Day Intelligence prevents that mistake. It forces you to adapt your aggression to the structural character of the day. Trust the rhythm. The market does not care that you want to trade today.",
    componentRef: "Your daily pre-session briefing",
    livePreviewType: "day-card",
    interactiveButtons: [
      { label: "Browse All Days", action: "Step through Monday to Sunday to understand the full weekly rhythm and how each day shapes your behavior", color: "#f59e0b" },
      { label: "Day Briefing Detail", action: "Expand the full intelligence profile -- manipulation pattern, sizing rules, behavioral warning, and historical edge", color: "#10b981" },
    ],
    codeSignals: [
      { name: "getDayContext()", type: "function", value: "Returns { name, quality, recommendation, manipulation, edge, sizing }" },
      { name: "dayOverride", type: "state", value: "null for real day, 0-6 for simulation (Sun=0)" },
      { name: "day.quality", type: "prop", value: "'PRIME' | 'KEY DAY' | 'CAUTION' | 'AVOID' | 'NO TRADE'" },
    ],
    keyElements: [
      { label: "Day Quality Badge", desc: "PRIME, KEY DAY, CAUTION, AVOID, or NO TRADE -- this is your permission level for the day, not a suggestion" },
      { label: "Recommendation", desc: "One clear directive that sets the behavioral frame for your entire trading day" },
      { label: "Manipulation Pattern", desc: "The specific deception this day is known for -- knowing the trap in advance is how you avoid it" },
      { label: "Position Sizing", desc: "Full / Reduced / None -- your size should match the day's quality, not your desire to trade" },
    ],
  },
  {
    id: "focus-now",
    title: "Focus Now",
    icon: Crosshair,
    color: "#10b981",
    dataSource: "time",
    description: "This is the command layer of the entire Activity system. Session Identity tells you where you are. Phase Timeline tells you what stage you are in. Focus Now tells you what to DO with that information right now. It is the single most important piece of text on the screen at any given moment. When Focus Now says 'Wait for displacement,' your job is to wait. When it says 'Execute entries,' you have permission to act. When it says 'Manage positions,' you stop looking for new trades. This is not ambient guidance. This is your operational directive. Every session, every phase, every moment has exactly one correct focus. This section delivers it without ambiguity. The traders who struggle most are the ones who know what session they are in but do not know what to DO in that session. Focus Now solves that problem completely.",
    howItWorks: "Focus Now combines your session identity and phase progress to generate a real-time instruction. As the killzone progresses, the directive evolves. Early in the session, it tells you to observe and wait for direction. Once the market shows its hand, it shifts to execution mode. Late in the session, it transitions to management and wind-down. Each Focus Now instruction comes with three supporting layers: WHY this is the current focus, what to EXPECT from price action right now, and a BEHAVIOR warning about the psychological trap most likely to hit you during this phase. Together, these four elements give you everything you need to act correctly.",
    whatChangesIt: "Session progression. As the killzone advances through its phases, Focus Now automatically updates to match the new operational context. The transitions are not random -- they follow the natural structure of how institutional sessions unfold. Early minutes require patience. Middle minutes permit action. Late minutes demand restraint. Focus Now keeps you synchronized with this rhythm.",
    variationCount: "13 unique operational directives spanning all sessions and phases -- each precisely calibrated to the current moment",
    perspective: "Read Focus Now before every decision. If your intended action contradicts what Focus Now says, you are trading against the system. That does not mean the system is wrong. It means your impulse is overriding structure. The purpose of Focus Now is to give you one clear instruction that removes doubt, eliminates guessing, and prevents the most common mistake traders make: doing the right thing at the wrong time. Trust it. Follow it. Let it simplify your decision-making to one question: am I doing what Focus Now says?",
    componentRef: "Your real-time operational directive",
    livePreviewType: "focus-hero",
    interactiveButtons: [
      { label: "Full Briefing", action: "Expand the complete intelligence -- the WHY behind the directive, what to EXPECT, and the BEHAVIOR trap to watch for", color: "#10b981" },
      { label: "Walk the Timeline", action: "Step through progress to see how the directive evolves as the session unfolds -- understand the sequence of commands", color: "#3b82f6" },
    ],
    codeSignals: [
      { name: "getSessionIntelligence()", type: "function", value: "Returns { focus, why, expect, behavior } for current session+phase" },
      { name: "kzProgress thresholds", type: "state", value: "0.17 and 0.50 trigger text changes within a killzone" },
      { name: "intelligence.focus", type: "prop", value: "The primary instruction text shown in the hero section" },
    ],
    keyElements: [
      { label: "Primary Directive", desc: "The single instruction for this exact moment -- this is what you should be doing, nothing else" },
      { label: "Why It Matters", desc: "The reasoning behind the directive -- understanding WHY builds trust and prevents you from overriding it" },
      { label: "What to Expect", desc: "What price action should look like if the session is behaving normally -- so you can distinguish signal from noise" },
      { label: "Behavior Warning", desc: "The specific psychological trap most likely to hit you during this phase -- forewarning is your defense" },
    ],
  },
  {
    id: "behavioral-traps",
    title: "Behavioral Traps",
    icon: AlertTriangle,
    color: "#ef4444",
    dataSource: "state",
    description: "This is the section most traders will resist reading. That resistance is exactly why it exists. Behavioral Traps identifies the specific self-destructive patterns that are most likely to affect you RIGHT NOW based on where you are in the session, what phase is active, and what psychological state the system detects. There are two categories: Strategy traps (mistakes in HOW you trade) and Psychology traps (mistakes in WHO you become while trading). Strategy traps include entering too early before confirmation, chasing price after it has already moved, entering too late when the session is exhausted, overtrading after a win or loss, and fighting the trend. Psychology traps include revenge trading after a loss, overconfidence after a win, fear that paralyzes execution, impatience that rushes entries, and emotional detachment that leads to reckless decisions. Each trap includes its trigger (the exact thought or feeling that activates it), its consequence (what happens if you fall into it), and its escape protocol (the specific action that breaks the pattern). This is your defense system against yourself.",
    howItWorks: "The system evaluates your current session, killzone status, and progress to determine which traps are most relevant right now. Early in the killzone, the Early Entry trap is active because that is when traders are most tempted to jump in before confirmation. Mid-session, the Chasing trap activates because price has started moving and FOMO peaks. Late in the session, the Late Entry trap warns you that the move is likely exhausted. Psychology traps run parallel -- their severity adjusts based on your behavioral state. This is not a static list of warnings. It is a real-time behavioral radar that surfaces the traps most likely to destroy your edge in the current moment.",
    whatChangesIt: "Session timing and behavioral state. As the killzone progresses, different traps become more or less relevant. The system does not show you all 10 traps at once -- it shows you the ones that statistically affect traders most during the current phase. This precision is what makes it useful. A general warning is easy to ignore. A specific warning that matches exactly what you are feeling right now is much harder to dismiss.",
    variationCount: "10 distinct traps across two categories, with 6-7 active at any given moment -- each calibrated to the current session phase",
    perspective: "Before you execute any trade, scan the active traps. Read each trigger description. If any trigger matches what you are thinking or feeling right now -- even slightly -- you are inside that trap. Do not rationalize. Do not bargain with it. Read the escape protocol and follow it. The escape route is not advice. It is a behavioral circuit-breaker. The traders who survive are not the ones who never fall into traps. They are the ones who recognize the trap fast enough to escape before it costs them R. This section is your early warning system. Use it every single session.",
    componentRef: "Your real-time self-defense system",
    livePreviewType: "trap-tabs",
    interactiveButtons: [
      { label: "Strategy Traps", action: "See the 5 execution mistakes most likely to cost you money right now -- timing errors, overtrading, counter-trend entries", color: "#ef4444" },
      { label: "Psychology Traps", action: "See the 5 psychological states most likely to compromise your decision-making -- revenge, overconfidence, fear, impatience", color: "#f97316" },
    ],
    codeSignals: [
      { name: "getActiveTraps()", type: "function", value: "Filters 10 traps based on session, killzone, and progress" },
      { name: "trap.severity", type: "state", value: "'high' | 'medium' | 'low' based on psychology score" },
      { name: "trap.escape", type: "prop", value: "Specific action to break free from this behavioral pattern" },
    ],
    keyElements: [
      { label: "Strategy / Psychology Tabs", desc: "Two domains of self-sabotage -- strategy traps are execution errors, psychology traps are emotional states that distort judgment" },
      { label: "Severity Level", desc: "HIGH, MEDIUM, or LOW -- tells you how dangerous this trap is in the current context, not in general" },
      { label: "Trigger Pattern", desc: "The exact thought, feeling, or impulse that means you are INSIDE this trap -- if you recognize it, act immediately" },
      { label: "Escape Protocol", desc: "The specific behavioral action that breaks the pattern -- not vague advice, but a concrete step you take right now" },
    ],
  },
  {
    id: "threat",
    title: "Primary Threat",
    icon: Zap,
    color: "#ef4444",
    dataSource: "state",
    description: "Behavioral Traps shows you the landscape of risks. Primary Threat cuts through all of them and names the single biggest danger to your edge RIGHT NOW. This is not a list. This is a verdict. The system evaluates your overall behavioral state -- whether you are operating from a stable, guarded, reactive, or critical posture -- and identifies the one threat most likely to cost you real R-multiples if you ignore it. Primary Threat does not overwhelm you with possibilities. It gives you the one thing that matters most. When your system state is stable, the threat is minor and manageable. When your state is critical, the threat is severe and immediate. Reading this section before every trade gives you something most traders never have: a clear understanding of where your biggest risk is coming from. Not from the market. From you.",
    howItWorks: "The system evaluates your behavioral state across four levels: STABLE (decision-making is clean, execute your plan), GUARDED (minor risks present, proceed with awareness), REACTIVE (emotional interference detected, slow down significantly), and CRITICAL (decision-making is compromised, stop trading). Each state maps to a specific threat profile that includes how this threat shows up in your behavior (manifestation), the destructive cycle it creates (pattern), and the quantified damage in R-multiples if you ignore it (R cost). The transition between states is based on accumulated behavioral signals -- not chart data.",
    whatChangesIt: "Your behavioral state. This is driven by the Order Layer -- the system that tracks discipline, psychology, and decision-making quality. As your behavioral signals shift, the Primary Threat updates to reflect the most current and relevant danger. In the current version, the state is set to a baseline for demonstration purposes. In production, this becomes a live reflection of your actual trading behavior.",
    variationCount: "4 threat profiles mapped to 4 system states -- each with unique manifestation, pattern analysis, and R cost quantification",
    perspective: "Open this section EVERY session. Read the full threat profile, especially the manifestation description. If the behavior it describes sounds anything like what you are currently doing or feeling, take it seriously. This is the system telling you where your blind spot is. The manifestation section is written to mirror real trader behavior -- if it matches your inner experience, you have been warned. The R cost tells you what you are risking by ignoring the warning. This is not abstract. It is quantified in the language of your trading account. The traders who read this and act on it protect their capital. The ones who skip it pay the price the system predicted.",
    componentRef: "Your single most important risk right now",
    livePreviewType: "threat-card",
    interactiveButtons: [
      { label: "See All States", action: "Step through all 4 system states to understand how the threat escalates from stable to critical", color: "#ef4444" },
      { label: "Full Threat Profile", action: "Expand the complete analysis -- how it manifests, what cycle it creates, and what it costs you in R", color: "#f97316" },
    ],
    codeSignals: [
      { name: "getThreatData()", type: "function", value: "Returns { title, manifestation, pattern, rCost } from systemState" },
      { name: "systemState", type: "state", value: "'critical' | 'reactive' | 'guarded' | 'stable'" },
      { name: "threat.rCost", type: "prop", value: "Estimated R-multiple cost if threat is ignored" },
    ],
    keyElements: [
      { label: "Threat Name", desc: "The single most dangerous behavioral risk in your current state -- not a list, a verdict" },
      { label: "Manifestation", desc: "How this threat appears in your actual behavior -- read this carefully, if it sounds like you, act immediately" },
      { label: "Pattern Cycle", desc: "The self-reinforcing loop this threat creates -- understanding the cycle is how you break it" },
      { label: "R Cost", desc: "The quantified damage in R-multiples if you ignore this warning -- makes the risk real and measurable" },
    ],
  },
  {
    id: "action",
    title: "Next Action",
    icon: ArrowRight,
    color: "#10b981",
    dataSource: "state",
    description: "This is the final layer of Activity, and it answers the question that every other section has been building toward: what do I do RIGHT NOW? Session Identity told you where you are. Phase Timeline told you what stage of the session is active. Day Intelligence framed the day. Focus Now gave you the operational directive. Behavioral Traps warned you about self-sabotage. Primary Threat named your biggest risk. Now, Next Action takes everything into account and delivers a single, unambiguous instruction. There are only three possible states: STOP (your decision-making is compromised -- close the order panel and walk away), SLOW DOWN (proceed with caution, reduce size, question every impulse before acting), or CLEAR TO EXECUTE (you are in a clean state, your plan is valid, act with conviction and follow through). This is the system's final verdict. Not a suggestion. Not a recommendation. A verdict.",
    howItWorks: "Next Action evaluates your system state -- the same behavioral assessment that drives Primary Threat -- and converts it into a direct operational instruction. When your state is CRITICAL or REACTIVE, the system tells you to stop. Not because the market is bad, but because your ability to make sound decisions is compromised. When your state is GUARDED, it tells you to slow down -- add an extra step of verification before every action. When your state is STABLE, it clears you to execute your plan with full confidence. Each directive comes with a consequence statement (what happens if you ignore it) and a check-in protocol (a structured self-assessment you complete before your next trade).",
    whatChangesIt: "Your behavioral state. This mirrors the Primary Threat assessment. When your state changes, your Next Action changes. The system does not give you permission based on market conditions -- it gives you permission based on your condition. A stable market means nothing if your psychology is compromised. Next Action enforces that reality.",
    variationCount: "3 clear operational states: Stop, Slow Down, Clear to Execute -- no ambiguity, no middle ground",
    perspective: "This is the section that separates disciplined traders from everyone else. When Next Action says STOP, the disciplined trader stops. No rationalization. No 'just one more look.' Stop means stop. When it says CLEAR, the disciplined trader executes without hesitation -- because every prior layer has confirmed the conditions are right. The check-in protocol is not optional. Before your next trade, answer its three questions honestly. If you cannot answer them cleanly, you are not ready to trade. The system has done its job by telling you the truth. Your job is to listen. Activity began with Session Identity -- understanding where you are in time. It ends here with Next Action -- understanding what you are allowed to do in this moment. Follow this sequence every session, and you will trade with more structure, more discipline, and more clarity than you have ever experienced.",
    componentRef: "Your immediate operational verdict",
    livePreviewType: "action-card",
    interactiveButtons: [
      { label: "See All Verdicts", action: "Step through all system states to understand when the system says Stop, Slow Down, or Clear to Execute", color: "#10b981" },
      { label: "Check-in Protocol", action: "Open the 3-step self-assessment that you must complete before your next trade -- this is non-negotiable discipline", color: "#3b82f6" },
    ],
    codeSignals: [
      { name: "getNextAction()", type: "function", value: "Returns { directive, consequence, checkIn } from systemState" },
      { name: "action.directive", type: "prop", value: "'Stop' | 'Slow down' | 'Clear to execute'" },
      { name: "action.checkIn", type: "prop", value: "Self-assessment protocol before next trade" },
    ],
    keyElements: [
      { label: "Directive", desc: "STOP, SLOW DOWN, or CLEAR -- this is the system's final word, not a starting point for negotiation" },
      { label: "Consequence", desc: "What specifically happens to your trading if you ignore this verdict -- stated plainly so you cannot claim ignorance" },
      { label: "Check-in Protocol", desc: "Three questions you answer honestly before your next trade -- if you struggle with any of them, you are not ready" },
    ],
  },
]


// ═══════════════════════════════════════════════════════════════════
// DEMO CONTROLS -- override day, session, system state to see all variations
// ═══════════════════════════════════════════════════════════════════
export interface DemoOverrides {
  dayOverride: number | null        // 0-6 (Sun-Sat) or null for real
  sessionOverride: string | null    // session name or null for real
  progressOverride: number | null   // 0-1 or null for real
  systemStateOverride: string | null // critical/reactive/guarded/stable or null for real
}

export const DAY_OPTIONS = [
  { value: 0, label: "SUN", full: "Sunday", color: "#52525b", quality: "NO TRADE" },
  { value: 1, label: "MON", full: "Monday", color: "#f59e0b", quality: "CAUTION" },
  { value: 2, label: "TUE", full: "Tuesday", color: "#10b981", quality: "PRIME" },
  { value: 3, label: "WED", full: "Wednesday", color: "#3b82f6", quality: "KEY DAY" },
  { value: 4, label: "THU", full: "Thursday", color: "#f59e0b", quality: "SELECTIVE" },
  { value: 5, label: "FRI", full: "Friday", color: "#ef4444", quality: "AVOID" },
  { value: 6, label: "SAT", full: "Saturday", color: "#52525b", quality: "NO TRADE" },
]

export const SESSION_OPTIONS = [
  { value: "asia", label: "Asia", time: "00:00-04:00", color: "#8b5cf6", killzone: false },
  { value: "pre-london", label: "Pre-London", time: "04:00-07:00", color: "#71717a", killzone: false },
  { value: "london", label: "London KZ", time: "07:00-10:00", color: "#10b981", killzone: true },
  { value: "london-ny", label: "LDN-NY Gap", time: "10:00-13:00", color: "#52525b", killzone: false },
  { value: "newyork", label: "New York KZ", time: "13:00-16:00", color: "#3b82f6", killzone: true },
  { value: "london-close", label: "London Close", time: "15:00-16:00", color: "#f59e0b", killzone: true },
  { value: "post-ny", label: "Post-NY", time: "16:00-21:00", color: "#52525b", killzone: false },
  { value: "off", label: "Off-Hours", time: "21:00-00:00", color: "#3f3f46", killzone: false },
]

export const PROGRESS_OPTIONS = [
  { value: 0.05, label: "5%", phase: "Opening" },
  { value: 0.17, label: "17%", phase: "Direction" },
  { value: 0.35, label: "35%", phase: "Entry" },
  { value: 0.55, label: "55%", phase: "Expansion" },
  { value: 0.75, label: "75%", phase: "Fade" },
  { value: 0.92, label: "92%", phase: "Wind Down" },
]

const STATE_OPTIONS = [
  { value: "critical", label: "CRITICAL", color: "#ef4444", desc: "Decision-making compromised" },
  { value: "reactive", label: "REACTIVE", color: "#f97316", desc: "Moving too fast" },
  { value: "guarded", label: "GUARDED", color: "#f59e0b", desc: "Functional but not optimal" },
  { value: "stable", label: "STABLE", color: "#10b981", desc: "Operating within parameters" },
]


// ═══════════════════════════════════════════════════════════════════
// LIVE PREVIEW MINI-COMPONENTS -- embedded in guide to show real UI
// ═══════════════════════════════════════════════════════════════════

function LivePreviewSessionStrip({ color }: { color: string }) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-[#0a0c14] p-3.5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <motion.div className="w-3 h-3 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }} />
          <span className="text-[13px] font-mono font-black text-emerald-400 uppercase tracking-wider">London Killzone</span>
          <motion.span className="text-[8px] font-mono font-black px-2 py-0.5 rounded-md bg-emerald-400/10 text-emerald-400/80 border border-emerald-400/20"
            animate={{ borderColor: ["rgba(16,185,129,0.2)", "rgba(16,185,129,0.5)", "rgba(16,185,129,0.2)"] }}
            transition={{ duration: 2.5, repeat: Infinity }}>
            KILLZONE ACTIVE
          </motion.span>
        </div>
      </div>
      <div className="flex items-center gap-0 rounded-lg border border-white/[0.05] bg-white/[0.02] overflow-hidden text-[10px] font-mono font-black">
        <div className="px-3 py-2 border-r border-white/[0.04]">
          <span className="text-white/15">Pair</span>{" "}
          <span className="text-white/50">EURUSD</span>
        </div>
        <div className="px-3 py-2 border-r border-white/[0.04] text-emerald-400/60">Bullish</div>
        <div className="px-3 py-2 border-r border-white/[0.04]">
          <motion.span className="text-emerald-400" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>42m</motion.span>
        </div>
        <div className="px-3 py-2 text-white/25">08:18 UTC</div>
      </div>
      <div className="mt-2.5 h-[5px] bg-white/[0.03] rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full bg-emerald-400 relative" initial={{ width: 0 }} animate={{ width: "42%" }} transition={{ duration: 1.5, ease: "easeOut" }}>
          <motion.div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-400" style={{ filter: "blur(5px)" }}
            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
        </motion.div>
      </div>
    </div>
  )
}

function LivePreviewPhaseBar({ color }: { color: string }) {
  const phases = [
    { name: "Opening", active: false, done: true },
    { name: "Direction", active: true, done: false },
    { name: "Entry", active: false, done: false },
    { name: "Expansion", active: false, done: false },
    { name: "Fade", active: false, done: false },
    { name: "Wind Down", active: false, done: false },
  ]
  return (
    <div className="rounded-xl border border-white/[0.05] bg-[#0a0c14] p-3.5 relative overflow-hidden">
      <div className="flex gap-1 mb-2.5">
        {phases.map((p) => (
          <motion.div key={p.name} className="flex-1 h-7 rounded-md flex items-center justify-center border"
            style={{
              backgroundColor: p.active ? `${color}15` : p.done ? `${color}06` : "rgba(255,255,255,0.01)",
              borderColor: p.active ? `${color}30` : p.done ? `${color}08` : "rgba(255,255,255,0.03)",
            }}
            animate={p.active ? { borderColor: [`${color}20`, `${color}45`, `${color}20`] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-[8px] font-mono font-black uppercase tracking-wider"
              style={{ color: p.active ? `${color}90` : p.done ? `${color}40` : "rgba(255,255,255,0.12)" }}>
              {p.name}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center gap-2.5">
        <Crosshair className="w-3.5 h-3.5" style={{ color: `${color}50` }} />
        <span className="text-[11px] font-mono font-bold" style={{ color: `${color}65` }}>Direction forming -- wait for displacement</span>
      </div>
    </div>
  )
}

function LivePreviewDayCard({ color }: { color: string }) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-[#0a0c14] p-3.5 relative overflow-hidden">
      <div className="flex items-center gap-2.5 mb-2.5">
        <Calendar className="w-4 h-4 text-amber-400/50" />
        <span className="text-[12px] font-mono font-black text-white/45 uppercase tracking-wider">Tuesday</span>
        <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded-md bg-emerald-400/10 text-emerald-400/70 border border-emerald-400/20">PRIME</span>
      </div>
      <p className="text-[11px] font-mono text-white/30 leading-relaxed mb-3">Full execution authority. Highest probability day for clean setups with strong follow-through.</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="px-3 py-2 rounded-lg border border-white/[0.04] bg-white/[0.01]">
          <span className="text-[8px] font-mono font-black text-white/18 uppercase block mb-0.5">Sizing</span>
          <span className="text-[11px] font-mono font-bold text-white/45">Full Position</span>
        </div>
        <div className="px-3 py-2 rounded-lg border border-white/[0.04] bg-white/[0.01]">
          <span className="text-[8px] font-mono font-black text-white/18 uppercase block mb-0.5">Manipulation</span>
          <span className="text-[11px] font-mono font-bold text-white/45">Minimal</span>
        </div>
      </div>
    </div>
  )
}

function LivePreviewFocusHero({ color }: { color: string }) {
  return (
    <div className="rounded-xl border bg-[#0a0c14] p-4 relative overflow-hidden"
      style={{ borderColor: `${color}15` }}>
      <motion.div className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.02, 0.05, 0.02] }}
        transition={{ duration: 4, repeat: Infinity }}>
        <div className="absolute left-0 top-0 w-20 h-20 rounded-full" style={{ backgroundColor: color, filter: "blur(25px)" }} />
      </motion.div>
      <div className="flex items-center gap-2.5 mb-2.5">
        <Crosshair className="w-4.5 h-4.5" style={{ color: `${color}60` }} />
        <span className="text-[10px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${color}45` }}>Focus Now</span>
      </div>
      <p className="text-[14px] font-mono font-bold text-white/60 leading-relaxed mb-3">
        Direction forming -- wait for displacement before committing.
      </p>
      <div className="flex gap-2">
        <span className="text-[8px] font-mono font-black px-2 py-1 rounded-md" style={{ backgroundColor: `${color}10`, color: `${color}60` }}>WHY</span>
        <span className="text-[8px] font-mono font-black px-2 py-1 rounded-md" style={{ backgroundColor: `${color}10`, color: `${color}60` }}>EXPECT</span>
        <span className="text-[8px] font-mono font-black px-2 py-1 rounded-md bg-red-400/10 text-red-400/60">BEHAVIOR</span>
      </div>
    </div>
  )
}

function LivePreviewTrapTabs({ color }: { color: string }) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-[#0a0c14] p-3.5 relative overflow-hidden">
      <div className="flex gap-1.5 mb-3">
        <div className="flex-1 py-1.5 rounded-lg text-center text-[10px] font-mono font-black uppercase tracking-wider border"
          style={{ backgroundColor: `${color}08`, borderColor: `${color}15`, color: `${color}80` }}>
          Strategy
        </div>
        <div className="flex-1 py-1.5 rounded-lg text-center text-[10px] font-mono font-black uppercase tracking-wider border border-white/[0.04] text-white/20 bg-white/[0.01]">
          Psychology
        </div>
      </div>
      {[{ name: "Early Entry", sev: "HIGH", sevColor: "#ef4444" }, { name: "Overtrading", sev: "MED", sevColor: "#f59e0b" }].map(trap => (
        <div key={trap.name} className="flex items-center justify-between py-2.5 border-b border-white/[0.03] last:border-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400/40" />
            <span className="text-[11px] font-mono font-bold text-white/40">{trap.name}</span>
          </div>
          <span className="text-[8px] font-mono font-black px-2 py-0.5 rounded-md" style={{ backgroundColor: `${trap.sevColor}10`, color: `${trap.sevColor}80` }}>{trap.sev}</span>
        </div>
      ))}
    </div>
  )
}

function LivePreviewThreatCard({ color }: { color: string }) {
  return (
    <div className="rounded-xl border bg-[#0a0c14] p-3.5 relative overflow-hidden" style={{ borderColor: `${color}12` }}>
      <motion.div className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.01, 0.04, 0.01] }}
        transition={{ duration: 3, repeat: Infinity }}>
        <div className="absolute right-0 top-0 w-20 h-20 rounded-full" style={{ backgroundColor: color, filter: "blur(25px)" }} />
      </motion.div>
      <div className="flex items-center gap-2.5 mb-2">
        <motion.div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }} />
        <span className="text-[12px] font-mono font-black uppercase tracking-wider" style={{ color: `${color}80` }}>
          Impulse Overload
        </span>
        <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded-md" style={{ backgroundColor: `${color}10`, color: `${color}60` }}>-2.4R</span>
      </div>
      <p className="text-[11px] font-mono text-white/30 leading-relaxed">Taking trades without analysis. Speed replaces structure. 3+ entries in 10 minutes.</p>
    </div>
  )
}

function LivePreviewActionCard({ color }: { color: string }) {
  return (
    <div className="rounded-xl border bg-[#0a0c14] p-3.5 relative overflow-hidden" style={{ borderColor: `${color}12` }}>
      <div className="flex items-center gap-2.5 mb-2">
        <ArrowRight className="w-4 h-4" style={{ color: `${color}60` }} />
        <span className="text-[12px] font-mono font-black uppercase tracking-wider" style={{ color: `${color}80` }}>Next Action</span>
      </div>
      <p className="text-[12px] font-mono font-bold text-white/50 mb-2.5">Clear to execute your trading plan with conviction.</p>
      <div className="flex gap-2">
        <span className="text-[8px] font-mono font-black px-2 py-1 rounded-md" style={{ backgroundColor: `${color}10`, color: `${color}60` }}>DIRECTIVE</span>
        <span className="text-[8px] font-mono font-black px-2 py-1 rounded-md bg-white/[0.03] text-white/20">CHECK-IN</span>
      </div>
    </div>
  )
}

const PREVIEW_COMPONENTS: Record<string, React.FC<{ color: string }>> = {
  "session-strip": LivePreviewSessionStrip,
  "phase-bar": LivePreviewPhaseBar,
  "day-card": LivePreviewDayCard,
  "focus-hero": LivePreviewFocusHero,
  "trap-tabs": LivePreviewTrapTabs,
  "threat-card": LivePreviewThreatCard,
  "action-card": LivePreviewActionCard,
}


// ═══════════════════════════��═══════════════════════════════════════
// GUIDE OVERLAY COMPONENT
// ══════════════════════�����════════════════════════════════════════════
function ActivityGuideOverlay({ onClose }: { onClose: () => void }) {
  const [expandedSection, setExpandedSection] = useState<string | null>("session")
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col bg-[#06080c]"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex-shrink-0 relative overflow-hidden">
        {/* Multi-layer ambient field */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 80% 100% at 20% 0%, rgba(59,130,246,0.06), transparent)" }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 60% 80% at 80% 100%, rgba(139,92,246,0.04), transparent)" }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
          {/* Scan line */}
          <motion.div className="absolute inset-y-0"
            style={{ width: 1, background: "linear-gradient(to bottom, transparent, rgba(59,130,246,0.08), transparent)" }}
            animate={{ left: ["-5%", "105%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(59,130,246,0.12), rgba(139,92,246,0.08), transparent)" }} />

        <div className="relative px-4 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.04] transition-all"
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4 text-white/40" />
              </motion.button>
              <div>
                <div className="flex items-center gap-2.5">
                  <motion.div className="w-2.5 h-2.5 rounded-full bg-blue-400"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity }} />
                  <span className="text-[15px] font-mono font-black text-white/75 uppercase tracking-wider">
                    Activity Guide
                  </span>
                  <span className="text-[8px] font-mono font-black px-2 py-0.5 rounded-md bg-blue-400/10 text-blue-400/60 border border-blue-400/15">
                    INTERACTIVE
                  </span>
                </div>
                <span className="text-[10px] font-mono text-white/25 ml-5">
                  Deep-dive into every section with live previews and actions
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-terminal">
        {/* System overview -- ENHANCED */}
        <div className="px-4 pt-3 pb-4">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-5 relative overflow-hidden">
            <motion.div className="absolute inset-0 pointer-events-none"
              animate={{ opacity: [0, 0.02, 0] }}
              transition={{ duration: 5, repeat: Infinity }}>
              <div className="absolute left-0 top-0 w-40 h-40 rounded-full"
                style={{ backgroundColor: "#3b82f6", filter: "blur(50px)" }} />
              <div className="absolute right-0 bottom-0 w-32 h-32 rounded-full"
                style={{ backgroundColor: "#8b5cf6", filter: "blur(40px)" }} />
            </motion.div>
            <div className="relative space-y-4">
              <div className="flex items-center gap-2.5">
                <motion.div className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-400/8 border border-blue-400/15"
                  animate={{ boxShadow: ["0 0 12px rgba(59,130,246,0.04)", "0 0 20px rgba(59,130,246,0.1)", "0 0 12px rgba(59,130,246,0.04)"] }}
                  transition={{ duration: 4, repeat: Infinity }}>
                  <Brain className="w-4 h-4 text-blue-400/60" />
                </motion.div>
                <div>
                  <h3 className="text-[14px] font-mono font-black text-white/60 uppercase tracking-wider">
                    System Architecture
                  </h3>
                  <p className="text-[10px] font-mono text-white/20 mt-0.5">How the Activity intelligence engine operates</p>
                </div>
              </div>

              <p className="text-[13px] text-white/40 leading-[1.8]">
                The Activity tab is a real-time intelligence system built on three inputs: UTC time, day of week, and system state. Every text you see is selected from a predetermined set of variations -- there are no AI-generated texts in the Activity view itself.
              </p>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { label: "TIME-DRIVEN", color: "#3b82f6", count: "4 sections", desc: "Session, Phase, Focus, Intelligence" },
                  { label: "DAY-DRIVEN", color: "#f59e0b", count: "1 section", desc: "Day intelligence and sizing" },
                  { label: "STATE-DRIVEN", color: "#ef4444", count: "2 sections", desc: "Threat assessment and actions" },
                ].map(source => (
                  <motion.div key={source.label}
                    className="px-3 py-3 rounded-xl border relative overflow-hidden cursor-default"
                    style={{
                      backgroundColor: `${source.color}03`,
                      borderColor: `${source.color}10`,
                    }}
                    whileHover={{ borderColor: `${source.color}25`, backgroundColor: `${source.color}06` }}
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

              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 h-px bg-white/[0.04]" />
                <span className="text-[9px] font-mono font-bold text-white/15">7 intelligent sections below</span>
                <div className="flex-1 h-px bg-white/[0.04]" />
              </div>
            </div>
          </div>
        </div>

        {/* Section breakdowns -- ENHANCED */}
        <div className="px-4 pb-6 space-y-2.5">
          {GUIDE_SECTIONS.map((section, i) => {
            const isExpanded = expandedSection === section.id
            const SectionIcon = section.icon
            const PreviewComponent = PREVIEW_COMPONENTS[section.livePreviewType]
            const dataSourceColor = section.dataSource === "time" ? "#3b82f6" : section.dataSource === "day" ? "#f59e0b" : "#ef4444"
            const dataSourceLabel = section.dataSource === "time" ? "TIME" : section.dataSource === "day" ? "DAY" : "STATE"

            return (
              <motion.div
                key={section.id}
                className="rounded-xl border overflow-hidden relative"
                style={{
                  backgroundColor: isExpanded ? `${section.color}02` : "rgba(255,255,255,0.006)",
                  borderColor: isExpanded ? `${section.color}15` : "rgba(255,255,255,0.04)",
                }}
                animate={isExpanded ? {
                  borderColor: [`${section.color}12`, `${section.color}22`, `${section.color}12`],
                  boxShadow: [
                    `0 0 0 0 ${section.color}00, inset 0 0 0 0 ${section.color}00`,
                    `0 0 30px 0 ${section.color}04, inset 0 0 20px 0 ${section.color}02`,
                    `0 0 0 0 ${section.color}00, inset 0 0 0 0 ${section.color}00`,
                  ],
                } : {}}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {/* Ambient glow when expanded */}
                {isExpanded && (
                  <motion.div className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.02, 0.04, 0.02] }}
                    transition={{ duration: 5, repeat: Infinity }}>
                    <div className="absolute left-0 top-0 w-24 h-24 rounded-full"
                      style={{ backgroundColor: section.color, filter: "blur(30px)" }} />
                    <div className="absolute right-0 bottom-0 w-16 h-16 rounded-full"
                      style={{ backgroundColor: section.color, filter: "blur(25px)" }} />
                  </motion.div>
                )}

                {/* Header button */}
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                  className="w-full text-left px-4 py-3.5 flex items-center gap-3.5 group relative z-10"
                >
                  {/* Section number */}
                  <motion.div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: isExpanded ? `${section.color}10` : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isExpanded ? `${section.color}25` : "rgba(255,255,255,0.04)"}`,
                      boxShadow: isExpanded ? `0 0 12px ${section.color}08` : "none",
                    }}
                    animate={isExpanded ? { boxShadow: [`0 0 10px ${section.color}05`, `0 0 20px ${section.color}10`, `0 0 10px ${section.color}05`] } : {}}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <span className="text-[11px] font-mono font-black tabular-nums"
                      style={{ color: isExpanded ? section.color : "rgba(255,255,255,0.25)" }}>
                      {i + 1}
                    </span>
                  </motion.div>

                  {/* Icon */}
                  <SectionIcon className="w-[18px] h-[18px] shrink-0 transition-colors duration-300"
                    style={{ color: isExpanded ? `${section.color}80` : "rgba(255,255,255,0.2)" }} />

                  {/* Title + data source badge */}
                  <div className="flex-1 flex items-center gap-2.5">
                    <span className="text-[13px] font-mono font-black uppercase tracking-wider transition-colors duration-300"
                      style={{ color: isExpanded ? section.color : "rgba(255,255,255,0.45)" }}>
                      {section.title}
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

                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                    <ChevronDown className="w-4 h-4 shrink-0"
                      style={{ color: isExpanded ? `${section.color}50` : "rgba(255,255,255,0.1)" }} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-5 space-y-4 relative z-10">
                        <div className="h-px" style={{ background: `linear-gradient(to right, ${section.color}15, ${section.color}06, transparent)` }} />

                        {/* ═══ LIVE PREVIEW ═══ */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5">
                            <motion.div className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: section.color }}
                              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1.5, repeat: Infinity }} />
                            <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em]"
                              style={{ color: `${section.color}55` }}>
                              Live Preview
                            </span>
                            <div className="flex-1 h-px" style={{ backgroundColor: `${section.color}08` }} />
                            <span className="text-[8px] font-mono font-bold text-white/12">{section.componentRef}</span>
                          </div>
                          {PreviewComponent && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.15 }}
                            >
                              <PreviewComponent color={section.color} />
                            </motion.div>
                          )}
                        </div>

                        {/* ═══ DESCRIPTION ═══ */}
                        <p className="text-[13px] text-white/45 leading-[1.8]">
                          {section.description}
                        </p>

                        {/* ═══ KEY ELEMENTS ═══ */}
                        <motion.div className="space-y-2"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}>
                          <div className="flex items-center gap-2 mb-2">
                            <Scan className="w-3.5 h-3.5" style={{ color: `${section.color}40` }} />
                            <span className="text-[9px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${section.color}40` }}>
                      Key Elements
                            </span>
                            <div className="flex-1 h-px" style={{ backgroundColor: `${section.color}06` }} />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {section.keyElements.map((el, j) => (
                              <motion.div
                                key={el.label}
                                className="px-3 py-2.5 rounded-xl border relative overflow-hidden group cursor-default"
                                style={{
                                  backgroundColor: hoveredElement === `${section.id}-${j}` ? `${section.color}06` : "rgba(255,255,255,0.008)",
                                  borderColor: hoveredElement === `${section.id}-${j}` ? `${section.color}22` : "rgba(255,255,255,0.04)",
                                }}
                                onMouseEnter={() => setHoveredElement(`${section.id}-${j}`)}
                                onMouseLeave={() => setHoveredElement(null)}
                                whileHover={{ scale: 1.015, borderColor: `${section.color}28` }}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + j * 0.06 }}
                              >
                                {hoveredElement === `${section.id}-${j}` && (
                                  <motion.div className="absolute inset-0 pointer-events-none"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}>
                                    <div className="absolute left-0 top-0 w-14 h-14 rounded-full"
                                      style={{ backgroundColor: section.color, filter: "blur(16px)", opacity: 0.06 }} />
                                  </motion.div>
                                )}
                                <span className="text-[10px] font-mono font-black block mb-1 relative z-10"
                                  style={{ color: hoveredElement === `${section.id}-${j}` ? section.color : `${section.color}65` }}>
                                  {el.label}
                                </span>
                                <span className="text-[9px] font-mono text-white/25 leading-relaxed block relative z-10">{el.desc}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>

                        {/* ═══ HOW IT WORKS ═══ */}
                        <motion.div className="rounded-xl border relative overflow-hidden"
                          style={{ borderColor: `${section.color}10`, backgroundColor: `${section.color}02` }}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 }}>
                          <motion.div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
                            style={{ backgroundColor: `${section.color}15` }}
                            animate={{ backgroundColor: [`${section.color}10`, `${section.color}35`, `${section.color}10`] }}
                            transition={{ duration: 3.5, repeat: Infinity }} />
                          <motion.div className="absolute inset-0 pointer-events-none"
                            animate={{ opacity: [0.01, 0.03, 0.01] }}
                            transition={{ duration: 5, repeat: Infinity }}>
                            <div className="absolute left-0 top-0 w-20 h-20 rounded-full"
                              style={{ backgroundColor: section.color, filter: "blur(25px)" }} />
                          </motion.div>
                          <div className="px-4 py-3.5 relative z-10 space-y-2">
                            <div className="flex items-center gap-2">
                              <Settings2 className="w-4 h-4" style={{ color: `${section.color}45` }} />
                              <span className="text-[10px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${section.color}45` }}>
                        How This Section Works
                              </span>
                            </div>
                            <p className="text-[12px] text-white/45 leading-[1.8]">
                              {section.howItWorks}
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
                        What Drives Changes
                              </span>
                            </div>
                            <p className="text-[11px] text-white/30 leading-[1.7]">
                              {section.whatChangesIt}
                            </p>
                          </div>
                          <div className="px-3.5 py-3 rounded-xl border relative overflow-hidden"
                            style={{ backgroundColor: `${section.color}03`, borderColor: `${section.color}10` }}>
                            <motion.div className="absolute inset-0 pointer-events-none"
                              animate={{ opacity: [0.01, 0.03, 0.01] }}
                              transition={{ duration: 4, repeat: Infinity }}>
                              <div className="absolute right-0 bottom-0 w-12 h-12 rounded-full"
                                style={{ backgroundColor: section.color, filter: "blur(14px)" }} />
                            </motion.div>
                            <div className="flex items-center gap-2 mb-2 relative z-10">
                              <Layers className="w-3.5 h-3.5" style={{ color: `${section.color}35` }} />
                              <span className="text-[9px] font-mono font-black uppercase tracking-[0.12em]" style={{ color: `${section.color}35` }}>
                                Variations
                              </span>
                            </div>
                            <p className="text-[11px] leading-[1.7] relative z-10" style={{ color: `${section.color}50` }}>{section.variationCount}</p>
                          </div>
                        </motion.div>

                        {/* ═══ INTERACTIVE ACTIONS ═══ */}
                        <motion.div className="space-y-2.5"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35 }}>
                          <div className="flex items-center gap-2">
                            <Fingerprint className="w-3.5 h-3.5" style={{ color: `${section.color}35` }} />
                            <span className="text-[9px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${section.color}35` }}>
                      Try It Yourself
                            </span>
                            <div className="flex-1 h-px" style={{ backgroundColor: `${section.color}06` }} />
                          </div>
                          <div className="space-y-2">
                            {section.interactiveButtons.map((btn) => (
                              <motion.div
                                key={btn.label}
                                className="group"
                              >
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
                          style={{ backgroundColor: `${section.color}03`, borderColor: `${section.color}12` }}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}>
                          <motion.div className="absolute inset-0 pointer-events-none"
                            style={{ background: `linear-gradient(135deg, ${section.color}04, transparent 50%)` }}
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 5, repeat: Infinity }} />
                          <motion.div className="absolute right-0 bottom-0 w-20 h-20 rounded-full pointer-events-none"
                            style={{ backgroundColor: section.color, filter: "blur(25px)" }}
                            animate={{ opacity: [0.02, 0.05, 0.02] }}
                            transition={{ duration: 4, repeat: Infinity }} />
                          <div className="flex items-center gap-2 mb-2 relative z-10">
                            <Eye className="w-4 h-4" style={{ color: `${section.color}40` }} />
                            <span className="text-[10px] font-mono font-black uppercase tracking-[0.12em]" style={{ color: `${section.color}40` }}>
                      Operational Guidance
                            </span>
                          </div>
                          <p className="text-[12px] text-white/40 leading-[1.8] relative z-10">{section.perspective}</p>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}


// ═══════════════════════════════════════════════════════════════════
// DEMO CONTROLS OVERLAY
// ═══════════════════════════════════════════════════════════════════
function DemoControlsOverlay({
  overrides,
  onUpdate,
  onClose,
}: {
  overrides: DemoOverrides
  onUpdate: (overrides: DemoOverrides) => void
  onClose: () => void
}) {
  const [activeTab, setActiveTab] = useState<"day" | "session" | "progress" | "state">("day")

  const handleDayChange = (val: number | null) => {
    onUpdate({ ...overrides, dayOverride: val })
  }
  const handleSessionChange = (val: string | null) => {
    onUpdate({ ...overrides, sessionOverride: val })
  }
  const handleProgressChange = (val: number | null) => {
    onUpdate({ ...overrides, progressOverride: val })
  }
  const handleStateChange = (val: string | null) => {
    onUpdate({ ...overrides, systemStateOverride: val })
  }
  const handleResetAll = () => {
    onUpdate({ dayOverride: null, sessionOverride: null, progressOverride: null, systemStateOverride: null })
  }

  const hasOverrides = overrides.dayOverride !== null || overrides.sessionOverride !== null || overrides.progressOverride !== null || overrides.systemStateOverride !== null

  const tabs = [
    { id: "day" as const, label: "DAY", icon: Calendar, color: "#f59e0b", active: overrides.dayOverride !== null },
    { id: "session" as const, label: "SESSION", icon: Clock, color: "#3b82f6", active: overrides.sessionOverride !== null },
    { id: "progress" as const, label: "PROGRESS", icon: Target, color: "#10b981", active: overrides.progressOverride !== null },
    { id: "state" as const, label: "STATE", icon: Shield, color: "#ef4444", active: overrides.systemStateOverride !== null },
  ]

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col bg-[#08080c]"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex-shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(245,158,11,0.05), transparent)" }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute inset-y-0"
            style={{ width: 1, background: "linear-gradient(to bottom, transparent, rgba(245,158,11,0.06), transparent)" }}
            animate={{ left: ["-5%", "105%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(245,158,11,0.1), transparent)" }} />

        <div className="relative px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.04] transition-all"
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4 text-white/40" />
              </motion.button>
              <div>
                <div className="flex items-center gap-2">
                  <motion.div className="w-2 h-2 rounded-full bg-amber-400"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }} />
                  <span className="text-[13px] font-mono font-black text-white/70 uppercase tracking-wider">
                    Demo Controls
                  </span>
                  <span className="text-[8px] font-mono font-black px-1.5 py-0.5 rounded-md bg-amber-400/10 text-amber-400/60 border border-amber-400/15">
                    DEV
                  </span>
                </div>
                <span className="text-[9px] font-mono text-white/20 ml-4">
                  Override inputs to see all Activity variations
                </span>
              </div>
            </div>
            {hasOverrides && (
              <motion.button
                onClick={handleResetAll}
                className="text-[8px] font-mono font-black text-white/30 hover:text-white/60 uppercase tracking-wider px-2 py-1 rounded-lg border border-white/[0.06] hover:border-white/[0.12] transition-all"
                whileTap={{ scale: 0.95 }}
              >
                RESET ALL
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex-shrink-0 px-4 pb-3">
        <div className="flex gap-1.5">
          {tabs.map((tab) => {
            const TabIcon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 group"
              >
                <div className={`relative rounded-lg border px-2 py-2.5 overflow-hidden transition-all duration-300 ${
                  isActive
                    ? `border-white/[0.08] bg-white/[0.03]`
                    : "border-white/[0.03] bg-white/[0.005] hover:border-white/[0.06]"
                }`} style={isActive ? { borderColor: `${tab.color}20`, backgroundColor: `${tab.color}04` } : undefined}>
                  {isActive && (
                    <motion.div className="absolute inset-0 pointer-events-none"
                      animate={{ opacity: [0, 0.02, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}>
                      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-12 h-12 rounded-full"
                        style={{ backgroundColor: tab.color, filter: "blur(15px)" }} />
                    </motion.div>
                  )}
                  <div className="relative flex flex-col items-center gap-1.5">
                    <div className="flex items-center gap-1">
                      <TabIcon className="w-3 h-3 transition-colors duration-300"
                        style={{ color: isActive ? `${tab.color}70` : "rgba(255,255,255,0.15)" }} />
                      {tab.active && (
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tab.color }} />
                      )}
                    </div>
                    <span className="text-[7px] font-mono font-black uppercase tracking-wider transition-colors duration-300"
                      style={{ color: isActive ? `${tab.color}80` : "rgba(255,255,255,0.2)" }}>
                      {tab.label}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-terminal">
        <AnimatePresence mode="wait">
          {/* ─── DAY TAB ─── */}
          {activeTab === "day" && (
            <motion.div key="day-tab" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }} className="px-4 pb-6 space-y-3">

              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-black text-white/30 uppercase tracking-wider">Day of Week Override</span>
                {overrides.dayOverride !== null && (
                  <button onClick={() => handleDayChange(null)}
                    className="text-[8px] font-mono font-bold text-amber-400/50 hover:text-amber-400/80 transition-colors uppercase tracking-wider">
                    Use Real Day
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                {DAY_OPTIONS.map((day) => {
                  const isSelected = overrides.dayOverride === day.value
                  const isToday = new Date().getUTCDay() === day.value && overrides.dayOverride === null

                  return (
                    <button
                      key={day.value}
                      onClick={() => handleDayChange(day.value)}
                      className="w-full text-left group"
                    >
                      <div className={`rounded-xl border px-4 py-3 transition-all duration-300 relative overflow-hidden ${
                        isSelected
                          ? "border-amber-400/20 bg-amber-400/[0.04]"
                          : isToday
                          ? "border-white/[0.08] bg-white/[0.02]"
                          : "border-white/[0.03] bg-white/[0.005] hover:border-white/[0.08] hover:bg-white/[0.015]"
                      }`}>
                        {isSelected && (
                          <motion.div className="absolute inset-0 pointer-events-none"
                            animate={{ opacity: [0, 0.02, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}>
                            <div className="absolute right-0 top-0 w-20 h-20 rounded-full"
                              style={{ backgroundColor: day.color, filter: "blur(25px)" }} />
                          </motion.div>
                        )}
                        <div className="relative flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300"
                            style={{
                              backgroundColor: isSelected ? `${day.color}10` : "rgba(255,255,255,0.02)",
                              borderColor: isSelected ? `${day.color}25` : "rgba(255,255,255,0.04)",
                            }}>
                            <span className="text-[10px] font-mono font-black"
                              style={{ color: isSelected ? day.color : "rgba(255,255,255,0.25)" }}>
                              {day.label}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-[11px] font-mono font-black uppercase tracking-wider transition-colors duration-300 ${
                                isSelected ? "text-white/70" : "text-white/35"
                              }`}>{day.full}</span>
                              <span className="text-[7px] font-mono font-black px-1.5 py-0.5 rounded-md transition-all duration-300"
                                style={{
                                  backgroundColor: isSelected ? `${day.color}10` : "rgba(255,255,255,0.02)",
                                  color: isSelected ? `${day.color}80` : "rgba(255,255,255,0.2)",
                                  border: `1px solid ${isSelected ? `${day.color}15` : "rgba(255,255,255,0.03)"}`,
                                }}>
                                {day.quality}
                              </span>
                              {isToday && (
                                <span className="text-[7px] font-mono font-bold text-white/15 uppercase tracking-wider">today</span>
                              )}
                            </div>
                          </div>
                          {isSelected && (
                            <motion.div className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: day.color }}
                              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }} />
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* ─── SESSION TAB ─── */}
          {activeTab === "session" && (
            <motion.div key="session-tab" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }} className="px-4 pb-6 space-y-3">

              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-black text-white/30 uppercase tracking-wider">Session Override</span>
                {overrides.sessionOverride !== null && (
                  <button onClick={() => handleSessionChange(null)}
                    className="text-[8px] font-mono font-bold text-blue-400/50 hover:text-blue-400/80 transition-colors uppercase tracking-wider">
                    Use Real Session
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                {SESSION_OPTIONS.map((sess) => {
                  const isSelected = overrides.sessionOverride === sess.value

                  return (
                    <button
                      key={sess.value}
                      onClick={() => handleSessionChange(sess.value)}
                      className="w-full text-left group"
                    >
                      <div className={`rounded-xl border px-4 py-3 transition-all duration-300 relative overflow-hidden ${
                        isSelected
                          ? "border-blue-400/20 bg-blue-400/[0.04]"
                          : "border-white/[0.03] bg-white/[0.005] hover:border-white/[0.08] hover:bg-white/[0.015]"
                      }`}>
                        <div className="relative flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: isSelected ? sess.color : `${sess.color}30` }} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-[11px] font-mono font-black uppercase tracking-wider transition-colors duration-300 ${
                                isSelected ? "text-white/70" : "text-white/35"
                              }`}>{sess.label}</span>
                              {sess.killzone && (
                                <span className="text-[7px] font-mono font-black px-1 py-0.5 rounded"
                                  style={{
                                    backgroundColor: isSelected ? `${sess.color}12` : "rgba(255,255,255,0.02)",
                                    color: isSelected ? `${sess.color}70` : "rgba(255,255,255,0.15)",
                                  }}>
                                  KZ
                                </span>
                              )}
                            </div>
                            <span className="text-[8px] font-mono text-white/15">{sess.time} UTC</span>
                          </div>
                          {isSelected && (
                            <motion.div className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: sess.color }}
                              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }} />
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* ─── PROGRESS TAB ─── */}
          {activeTab === "progress" && (
            <motion.div key="progress-tab" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }} className="px-4 pb-6 space-y-3">

              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-black text-white/30 uppercase tracking-wider">KZ Progress Override</span>
                {overrides.progressOverride !== null && (
                  <button onClick={() => handleProgressChange(null)}
                    className="text-[8px] font-mono font-bold text-emerald-400/50 hover:text-emerald-400/80 transition-colors uppercase tracking-wider">
                    Use Real Progress
                  </button>
                )}
              </div>

              <p className="text-[9px] text-white/20 leading-relaxed">
                Controls killzone progress percentage. This affects which Focus Now text shows (thresholds at 17% and 50%) and which behavioral traps are active (thresholds at 15%, 20%, 50%). Only meaningful when a killzone session is active.
              </p>

              <div className="space-y-1.5">
                {PROGRESS_OPTIONS.map((prog) => {
                  const isSelected = overrides.progressOverride === prog.value

                  return (
                    <button
                      key={prog.value}
                      onClick={() => handleProgressChange(prog.value)}
                      className="w-full text-left group"
                    >
                      <div className={`rounded-xl border px-4 py-3 transition-all duration-300 relative overflow-hidden ${
                        isSelected
                          ? "border-emerald-400/20 bg-emerald-400/[0.04]"
                          : "border-white/[0.03] bg-white/[0.005] hover:border-white/[0.08] hover:bg-white/[0.015]"
                      }`}>
                        <div className="relative flex items-center gap-3">
                          {/* Progress bar mini */}
                          <div className="w-16 h-[4px] bg-white/[0.04] rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-emerald-400 transition-all duration-300"
                              style={{ width: `${prog.value * 100}%`, opacity: isSelected ? 1 : 0.3 }} />
                          </div>
                          <span className={`text-[12px] font-mono font-black tabular-nums transition-colors duration-300 ${
                            isSelected ? "text-emerald-400/90" : "text-white/30"
                          }`}>{prog.label}</span>
                          <span className={`text-[9px] font-mono font-bold uppercase tracking-wider transition-colors duration-300 ${
                            isSelected ? "text-white/50" : "text-white/15"
                          }`}>{prog.phase}</span>
                          {isSelected && (
                            <motion.div className="ml-auto w-2 h-2 rounded-full bg-emerald-400"
                              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }} />
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* ─── STATE TAB ─── */}
          {activeTab === "state" && (
            <motion.div key="state-tab" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }} className="px-4 pb-6 space-y-3">

              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-black text-white/30 uppercase tracking-wider">System State Override</span>
                {overrides.systemStateOverride !== null && (
                  <button onClick={() => handleStateChange(null)}
                    className="text-[8px] font-mono font-bold text-red-400/50 hover:text-red-400/80 transition-colors uppercase tracking-wider">
                    Use Real State
                  </button>
                )}
              </div>

              <p className="text-[9px] text-white/20 leading-relaxed">
                Controls the system state that drives Primary Threat (4 variations), Next Action (3 variations), and behavioral trap severity levels. Also affects the directive strip.
              </p>

              <div className="space-y-2">
                {STATE_OPTIONS.map((state) => {
                  const isSelected = overrides.systemStateOverride === state.value

                  return (
                    <button
                      key={state.value}
                      onClick={() => handleStateChange(state.value)}
                      className="w-full text-left group"
                    >
                      <div className={`rounded-xl border px-4 py-3.5 transition-all duration-300 relative overflow-hidden ${
                        isSelected
                          ? "border-white/[0.08]"
                          : "border-white/[0.03] bg-white/[0.005] hover:border-white/[0.08] hover:bg-white/[0.015]"
                      }`} style={isSelected ? { borderColor: `${state.color}20`, backgroundColor: `${state.color}04` } : undefined}>
                        {isSelected && (
                          <motion.div className="absolute inset-0 pointer-events-none"
                            animate={{ opacity: [0, 0.03, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}>
                            <div className="absolute left-0 top-0 w-24 h-24 rounded-full"
                              style={{ backgroundColor: state.color, filter: "blur(30px)" }} />
                          </motion.div>
                        )}
                        <div className="relative flex items-center gap-3">
                          <motion.div className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: isSelected ? state.color : `${state.color}30` }}
                            animate={isSelected && (state.value === "critical" || state.value === "reactive")
                              ? { scale: [1, 1.3, 1], opacity: [1, 0.4, 1] }
                              : {}
                            }
                            transition={{ duration: state.value === "critical" ? 0.8 : 1.5, repeat: Infinity }} />
                          <div className="flex-1 min-w-0">
                            <span className={`text-[11px] font-mono font-black uppercase tracking-wider block transition-colors duration-300`}
                              style={{ color: isSelected ? state.color : "rgba(255,255,255,0.35)" }}>
                              {state.label}
                            </span>
                            <span className="text-[9px] font-mono text-white/20">{state.desc}</span>
                          </div>
                          {isSelected && (
                            <motion.div className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: state.color }}
                              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }} />
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}


// ═══════════════════════════════════════════════════════════════════
// INTERACTIVE TUTORIAL OVERLAY -- blur-reveal step-by-step
// ═══════════════════════════════════════════════════════════════════

// Tutorial now directly uses GUIDE_SECTIONS data for full content in each step

function ActivityTutorialOverlay({
  onClose,
  onStartDemo,
}: {
  onClose: () => void
  onStartDemo: () => void
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)

  // Map tutorial steps to guide sections: step 0 = welcome (no guide section), steps 1-7 = GUIDE_SECTIONS[0-6]
  const totalSteps = GUIDE_SECTIONS.length + 1 // +1 for welcome
  const isLast = currentStep === totalSteps - 1
  const isWelcome = currentStep === 0

  // Get the guide section for the current step (null for welcome)
  const guideSection = isWelcome ? null : GUIDE_SECTIONS[currentStep - 1]
  const stepColor = isWelcome ? "#3b82f6" : guideSection!.color
  const StepIcon = isWelcome ? Brain : guideSection!.icon
  const PreviewComponent = guideSection ? PREVIEW_COMPONENTS[guideSection.livePreviewType] : null
  const dataSourceColor = guideSection
    ? guideSection.dataSource === "time" ? "#3b82f6" : guideSection.dataSource === "day" ? "#f59e0b" : "#ef4444"
    : "#3b82f6"
  const dataSourceLabel = guideSection
    ? guideSection.dataSource === "time" ? "TIME" : guideSection.dataSource === "day" ? "DAY" : "STATE"
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
                    Interactive Tutorial
                  </span>
                  <span className="text-[8px] font-mono font-black px-2 py-0.5 rounded-md border"
                    style={{ backgroundColor: `${stepColor}10`, color: `${stepColor}60`, borderColor: `${stepColor}15` }}>
                    {currentStep + 1} / {totalSteps}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-white/20 ml-0.5">
                  {isWelcome ? "Welcome to your real-time command center" : guideSection!.title}
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
                {/* System overview card (same as guide) */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-5 relative overflow-hidden">
                  <motion.div className="absolute inset-0 pointer-events-none"
                    animate={{ opacity: [0, 0.02, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}>
                    <div className="absolute left-0 top-0 w-40 h-40 rounded-full"
                      style={{ backgroundColor: "#3b82f6", filter: "blur(50px)" }} />
                    <div className="absolute right-0 bottom-0 w-32 h-32 rounded-full"
                      style={{ backgroundColor: "#8b5cf6", filter: "blur(40px)" }} />
                  </motion.div>
                  <div className="relative space-y-4">
                    <div className="flex items-center gap-2.5">
                      <motion.div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-400/8 border border-blue-400/15"
                        animate={{ boxShadow: ["0 0 12px rgba(59,130,246,0.04)", "0 0 20px rgba(59,130,246,0.1)", "0 0 12px rgba(59,130,246,0.04)"] }}
                        transition={{ duration: 4, repeat: Infinity }}>
                        <Brain className="w-5 h-5 text-blue-400/60" />
                      </motion.div>
                      <div>
                        <h3 className="text-[16px] font-mono font-black text-white/70 uppercase tracking-wider">
                          Activity Intelligence Engine
                        </h3>
                        <p className="text-[10px] font-mono text-white/25 mt-0.5">Operator Guide -- Learn How to Use Every Section</p>
                      </div>
                    </div>

                    <p className="text-[13px] text-white/40 leading-[1.8]">
                      Activity is not a dashboard you glance at. It is an operational system that tells you what to do, when to do it, and what to avoid -- at every moment of the trading day. It processes three intelligence streams and converts them into structured guidance that replaces guessing, impulse, and emotional decision-making with disciplined, time-aware execution. This tutorial teaches you how to read, interpret, and act on each section. Read it once fully, then use it as a reference before every session.
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {[
                        { label: "TIME-DRIVEN", color: "#3b82f6", count: "4 sections", desc: "Where you are, what phase is active, and what to focus on -- updated every minute" },
                        { label: "DAY-DRIVEN", color: "#f59e0b", count: "1 section", desc: "Your daily pre-session briefing -- sets the frame for aggression, sizing, and behavior" },
                        { label: "STATE-DRIVEN", color: "#ef4444", count: "2 sections", desc: "Your behavioral defense -- identifies threats and delivers your operational verdict" },
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

                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-3.5">
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 bg-blue-400/10 border border-blue-400/15">
                          <Fingerprint className="w-3 h-3 text-blue-400/50" />
                        </div>
                        <div>
                          <span className="text-[7px] font-mono font-black uppercase tracking-[0.15em] text-white/20 block mb-1">
                            HOW THIS TUTORIAL WORKS
                          </span>
                          <p className="text-[11px] text-white/35 leading-relaxed">
                            Navigate through 7 sections in order. Each section teaches you what the feature does, why it matters, when to trust it, how it shapes your behavior, and what mistake it prevents. The sections are sequenced to mirror the correct thinking order for every trading session: first understand where you are, then what to do, then what to avoid, then what to do next.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : guideSection && (
              /* ═══ GUIDE SECTION STEP -- full breakdown from Activity Guide ═══ */
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
                    <motion.div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${guideSection.color}10`,
                        border: `1px solid ${guideSection.color}25`,
                        boxShadow: `0 0 12px ${guideSection.color}08`,
                      }}
                      animate={{ boxShadow: [`0 0 10px ${guideSection.color}05`, `0 0 20px ${guideSection.color}10`, `0 0 10px ${guideSection.color}05`] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <StepIcon className="w-5 h-5" style={{ color: `${guideSection.color}80` }} />
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5">
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
                      <span className="text-[10px] font-mono text-white/25 mt-0.5 block">{guideSection.componentRef}</span>
                    </div>
                  </div>
                </div>

                {/* ═══ LIVE PREVIEW ═══ */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <motion.div className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: guideSection.color }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }} />
                    <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em]"
                      style={{ color: `${guideSection.color}55` }}>
                      Live Preview
                    </span>
                    <div className="flex-1 h-px" style={{ backgroundColor: `${guideSection.color}08` }} />
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
                <p className="text-[13px] text-white/45 leading-[1.8]">
                  {guideSection.description}
                </p>

                {/* ═══ KEY ELEMENTS ═══ */}
                <motion.div className="space-y-2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Scan className="w-3.5 h-3.5" style={{ color: `${guideSection.color}40` }} />
                    <span className="text-[9px] font-mono font-black uppercase tracking-[0.15em]" style={{ color: `${guideSection.color}40` }}>
                      What You See
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
                        How It Works
                      </span>
                    </div>
                    <p className="text-[12px] text-white/45 leading-[1.8]">
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
                        What Triggers Updates
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
                        Coverage Depth
                      </span>
                    </div>
                    <p className="text-[11px] leading-[1.7] relative z-10" style={{ color: `${guideSection.color}50` }}>{guideSection.variationCount}</p>
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
                      Explore This Section
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
                      How to Use This
                    </span>
                  </div>
                  <p className="text-[12px] text-white/40 leading-[1.8] relative z-10">{guideSection.perspective}</p>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Section navigation buttons -- 4x2 grid, staggered entrance */}
      <div className="flex-shrink-0 px-4 pb-2 pt-1">
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { idx: 0, label: "Intro", icon: Brain, color: "#3b82f6" },
            ...GUIDE_SECTIONS.map((s, i) => ({
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
              {isLast ? "Start Live Demo" : "Next Section"}
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
// MAIN EXPORT -- Guide button only (demo controls embedded in session header)
// ═══════════════════════════════════════════════════════════════════
export function ActivityGuideAndDemo({
  overrides,
  onOverridesChange,
}: {
  overrides: DemoOverrides
  onOverridesChange: (overrides: DemoOverrides) => void
}) {
  const [guideOpen, setGuideOpen] = useState(false)
  const [tutorialOpen, setTutorialOpen] = useState(false)

  const hasOverrides = overrides.dayOverride !== null || overrides.sessionOverride !== null || overrides.progressOverride !== null || overrides.systemStateOverride !== null

  return (
    <>
      {/* ─── FLOATING BUTTON BAR ─── */}
      <div className="flex items-center gap-2 px-4 py-2.5">
        {/* Guide button */}
        <motion.button
          onClick={() => setGuideOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all group relative overflow-hidden"
          style={{ borderColor: "rgba(59,130,246,0.12)", backgroundColor: "rgba(59,130,246,0.03)" }}
          whileHover={{ backgroundColor: "rgba(59,130,246,0.06)", borderColor: "rgba(59,130,246,0.25)" }}
          whileTap={{ scale: 0.97 }}
        >
          <motion.div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 20% 50%, rgba(59,130,246,0.06), transparent 70%)" }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }} />
          <BookOpen className="w-3.5 h-3.5 text-blue-400/40 group-hover:text-blue-400/70 transition-colors relative z-10" />
          <span className="text-[9px] font-mono font-black text-blue-400/40 group-hover:text-blue-400/70 transition-colors uppercase tracking-wider relative z-10">
            System Guide
          </span>
        </motion.button>

        {/* Interactive Tutorial button */}
        <motion.button
          onClick={() => setTutorialOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all group relative overflow-hidden"
          style={{ borderColor: "rgba(139,92,246,0.12)", backgroundColor: "rgba(139,92,246,0.03)" }}
          whileHover={{ backgroundColor: "rgba(139,92,246,0.06)", borderColor: "rgba(139,92,246,0.25)" }}
          whileTap={{ scale: 0.97 }}
        >
          <motion.div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 20% 50%, rgba(139,92,246,0.06), transparent 70%)" }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} />
          <Sparkles className="w-3.5 h-3.5 text-purple-400/40 group-hover:text-purple-400/70 transition-colors relative z-10" />
          <span className="text-[9px] font-mono font-black text-purple-400/40 group-hover:text-purple-400/70 transition-colors uppercase tracking-wider relative z-10">
            Tutorial
          </span>
        </motion.button>

        {/* Live Demo button */}
        <motion.button
          onClick={() => {
            onOverridesChange({
              dayOverride: 2,
              sessionOverride: "london",
              progressOverride: 0.35,
              systemStateOverride: null,
            })
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all group relative overflow-hidden"
          style={{ borderColor: "rgba(16,185,129,0.12)", backgroundColor: "rgba(16,185,129,0.03)" }}
          whileHover={{ backgroundColor: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.25)" }}
          whileTap={{ scale: 0.97 }}
        >
          <motion.div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 20% 50%, rgba(16,185,129,0.06), transparent 70%)" }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }} />
          <Zap className="w-3.5 h-3.5 text-emerald-400/40 group-hover:text-emerald-400/70 transition-colors relative z-10" />
          <span className="text-[9px] font-mono font-black text-emerald-400/40 group-hover:text-emerald-400/70 transition-colors uppercase tracking-wider relative z-10">
            Live Demo
          </span>
          <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400 relative z-10"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }} />
        </motion.button>

        <div className="flex-1" />

        {/* Active overrides indicator */}
        {hasOverrides && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-400/15 bg-amber-400/[0.03]">
              <motion.div className="w-2 h-2 rounded-full bg-amber-400"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }} />
              <span className="text-[8px] font-mono font-black text-amber-400/50 uppercase tracking-wider">
                SIMULATION
              </span>
            </div>
            <motion.button
              onClick={() => onOverridesChange({ dayOverride: null, sessionOverride: null, progressOverride: null, systemStateOverride: null })}
              className="text-[8px] font-mono font-black text-white/20 hover:text-white/50 uppercase tracking-wider px-2 py-1.5 rounded-lg border border-white/[0.06] hover:border-white/[0.12] transition-all"
              whileTap={{ scale: 0.95 }}
            >
              EXIT
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* ─── OVERLAYS ─── */}
      <AnimatePresence>
        {guideOpen && (
          <ActivityGuideOverlay onClose={() => setGuideOpen(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {tutorialOpen && (
          <ActivityTutorialOverlay
            onClose={() => setTutorialOpen(false)}
            onStartDemo={() => {
              onOverridesChange({
                dayOverride: 2,
                sessionOverride: "london",
                progressOverride: 0.35,
                systemStateOverride: null,
              })
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
