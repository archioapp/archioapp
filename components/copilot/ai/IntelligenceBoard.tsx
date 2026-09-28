"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Target, Shield, Brain, Compass, Sparkles,
  Globe, Waypoints, HeartPulse, Cpu, Activity,
  Layers, Scale, ArrowRight, ChevronRight,
  Eye, Zap, TrendingUp, BarChart3,
  ScanLine, Fingerprint, AlertTriangle, BarChart2,
  Network
} from "lucide-react"
import { BEHAVIOR_SIGNALS } from "./copilot-ai-data"
import { AiCopilotStageSvg } from "./pipeline-svgs"
import { GuidedSessionStageSvg } from "./session-svgs"
import { OutputSvg } from "./output-svg"

interface IntelligenceBoardProps {
  homeSection: "signals" | "modes"
  setHomeSection: (section: "signals" | "modes") => void
  criticalCount: number
}

/* ── Scanner channel data with deep explanations ── */
const SCAN_CHANNELS = [
  {
    label: "Psychology", color: "#f59e0b", icon: HeartPulse, signals: 2, scanDelay: 0,
    tagline: "Emotional intelligence layer",
    whatItDoes: "Continuously monitors your emotional state through trading patterns. Detects when fear, greed, frustration, or overconfidence are influencing your decisions before you consciously notice.",
    whyItMatters: "Emotions are the #1 edge killer. Traders lose an average of 30% more when emotionally compromised. This scanner catches the behavioral signatures of emotional trading in real-time.",
    howItWorks: [
      { metric: "Emotional State Oscillation", detail: "Measures rapid shifts between euphoria and despair through trade frequency and sizing changes" },
      { metric: "Revenge Pattern Detection", detail: "Identifies post-loss entries that skip your checklist, typically within 5-15 minutes of a losing trade" },
      { metric: "FOMO Intensity Index", detail: "Tracks chase-entry patterns when price has already moved beyond your predefined entry zone" },
      { metric: "Confidence Drift Analysis", detail: "Monitors when winning streaks lead to oversized positions and relaxed entry criteria" },
    ],
  },
  {
    label: "Discipline", color: "#10b981", icon: Shield, signals: 2, scanDelay: 0.5,
    tagline: "Rule adherence engine",
    whatItDoes: "Tracks every trade against your personal ruleset. Measures how consistently you follow your own plan, from entry criteria to position sizing to session boundaries.",
    whyItMatters: "Edge only exists when rules are followed consistently. A single rule bend trains your brain to accept lower standards, compounding into a systematic edge leak over weeks.",
    howItWorks: [
      { metric: "Rule Adherence Scoring", detail: "Cross-references each trade entry against your defined checklist criteria and assigns a compliance score" },
      { metric: "Checklist Completion Rate", detail: "Tracks which specific rules you skip most often and under what conditions" },
      { metric: "Plan Deviation Frequency", detail: "Measures how often mid-trade adjustments violate your original trade thesis" },
      { metric: "Session Boundary Respect", detail: "Monitors whether you trade outside your optimal hours where your historical win-rate drops" },
    ],
  },
  {
    label: "Strategy", color: "#8b5cf6", icon: Target, signals: 1, scanDelay: 1.0,
    tagline: "Setup quality analyzer",
    whatItDoes: "Evaluates the structural quality of every setup you take. Checks timeframe alignment, context awareness, and whether the trade matches the dominant market structure.",
    whyItMatters: "Counter-trend trades without confirmation have a structurally lower win rate. Knowing your position relative to higher-timeframe bias changes your entire expectancy profile.",
    howItWorks: [
      { metric: "Timeframe Alignment Check", detail: "Verifies your entry timeframe aligns with the directional bias on the next 2 higher timeframes" },
      { metric: "Setup Quality Scoring", detail: "Rates each setup against your historical best-performing patterns to quantify edge strength" },
      { metric: "Edge Consistency Analysis", detail: "Tracks whether your recent setups match your proven edge or if you are drifting into new territory" },
      { metric: "Context Awareness Level", detail: "Measures awareness of key events, session times, and liquidity conditions that affect your setup" },
    ],
  },
  {
    label: "Risk", color: "#ef4444", icon: Scale, signals: 1, scanDelay: 1.5,
    tagline: "Exposure & sizing guardian",
    whatItDoes: "Maps your total portfolio exposure in real-time. Detects correlated positions, concentration risk, and whether your aggregate risk exceeds your defined thresholds.",
    whyItMatters: "What feels like 3 separate trades can behave like 1 oversized bet during volatility spikes. Hidden correlation is the #1 cause of unexpected large drawdowns.",
    howItWorks: [
      { metric: "Position Correlation Mapping", detail: "Identifies when multiple open positions share directional exposure to the same underlying driver" },
      { metric: "Exposure Concentration Index", detail: "Calculates aggregate risk as a percentage of account equity across all active positions" },
      { metric: "Drawdown Proximity Alert", detail: "Warns when your current drawdown approaches your historically defined maximum loss threshold" },
      { metric: "Volatility-Adjusted Sizing", detail: "Checks if your position sizes account for current market volatility vs your entry conditions" },
    ],
  },
]

/* ── SCAN PIPELINE STAGES -- How Pattern Detection works ── */
const SCAN_PIPELINE = [
  {
    id: "capture",
    num: "01",
    title: "Behavioral Data Capture",
    subtitle: "Continuous passive monitoring",
    desc: "Four specialized scanners run in the background analyzing every trade, decision, and behavioral micro-pattern. No input required from you -- the system observes trade timing, position sizing, emotional triggers, and structural quality automatically.",
    details: [
      { label: "4 Active Channels", note: "Psychology, Discipline, Strategy, and Risk scanners run simultaneously" },
      { label: "Zero-Input Required", note: "Data flows passively from your trading activity -- no manual journaling needed" },
      { label: "Temporal Awareness", note: "Captures not just what you did, but when, how fast, and in what sequence" },
    ],
    color: "#f59e0b",
    svgType: "capture" as const,
  },
  {
    id: "detect",
    num: "02",
    title: "Pattern Recognition",
    subtitle: "AI cross-references your behavior",
    desc: "The AI engine cross-references incoming data against your historical baseline, known cognitive biases, and proven behavioral models. It identifies deviations, recurring patterns, and emerging risks before they compound into costly mistakes.",
    details: [
      { label: "Baseline Comparison", note: "Every action is measured against your own established behavioral norms" },
      { label: "Bias Detection", note: "Flags 12+ cognitive biases including recency, anchoring, and loss aversion" },
      { label: "Severity Scoring", note: "Patterns are ranked Critical, High, or Medium based on historical impact" },
    ],
    color: "#d97706",
    svgType: "detect" as const,
  },
  {
  id: "surface",
  num: "03",
  title: "Intelligent Signal Routing",
  subtitle: "From raw patterns to precise trader guidance",
  desc: "Every pattern the AI detects gets routed through a decision layer that determines what to tell you, when to intervene, and which AI session to launch. Signals are packaged with full context -- the trigger event, the psychological root cause, your historical response to similar situations, and a mapped intervention path ready to execute.",
  details: [
  { label: "Signal Packaging", note: "Each signal carries the what (behavior detected), the why (root cause), and the how (intervention path)" },
  { label: "Intervention Mapping", note: "Every signal auto-maps to the right AI session: Coach for tilt, Analyst for bias, Mirror for blind spots" },
  { label: "Delivery Timing", note: "Signals queue by urgency -- capital threats surface instantly, behavioral drift waits for natural pauses" },
    ],
    color: "#b45309",
    svgType: "surface" as const,
  },
]

/* ── PIPELINE STAGE DATA ── */
const PIPELINE_STAGES = [
  {
    id: "select",
    num: "01",
    title: "Select Your Engine",
    subtitle: "Choose your AI thinking framework",
    desc: "Each intelligence engine is a specialized AI personality with its own analytical lens, response style, and decision-making architecture. The engine you pick determines how the AI interprets your situation, what questions it asks, and how it structures its guidance. Click any engine below to explore what it does.",
    details: [
      { label: "8 Specialized Engines", note: "Analyst, Strategist, Coach, Mirror, Focus, Mentor, Review, Psychology -- each with a unique framework" },
      { label: "Response Styles", note: "Each engine responds differently: structured breakdowns, reflective questions, direct coaching, or educational layers" },
      { label: "When to Use", note: "Every engine maps to specific trading moments -- pre-trade, mid-session, post-trade, or emotional states" },
    ],
    color: "#a78bfa",
    svgType: "mode-grid" as const,
  },
  {
  id: "calibrate",
  num: "02",
  title: "Situational Deep Scan",
  subtitle: "AI reads your trading state in real-time",
  desc: "Before the AI speaks, it scans your full trading context. It reads your open positions, recent P&L swings, session timing, emotional signals, and rule compliance to understand exactly where you are in your trading day.",
  details: [
  { label: "Depth Probing", note: "Questions narrow from broad context to the specific issue affecting your edge" },
      { label: "History Awareness", note: "References your past patterns, rules, and behavioral signals from the scanner" },
      { label: "Emotional Mapping", note: "Detects urgency, frustration, or overconfidence in your responses" },
    ],
    color: "#818cf8",
    svgType: "calibrate" as const,
  },
  {
    id: "output",
    num: "03",
    title: "Precision Output",
    subtitle: "Structured intelligence response",
    desc: "The response isn't a wall of text. It's a structured analysis built from your context, your rules, your history, and the specific mode's analytical framework. Every output is actionable and mapped to your situation.",
    details: [
      { label: "Structured Breakdown", note: "Analysis, risk assessment, action steps, and follow-up questions" },
      { label: "Rule Integration", note: "Your personal trading rules are embedded in every recommendation" },
      { label: "Signal Connection", note: "Links the response to any active behavioral signals from the scanner" },
    ],
    color: "#7c3aed",
    svgType: "output" as const,
  },
]

function ScanHowItWorks() {
  const [activeStage, setActiveStage] = useState<string | null>(null)

  return (
    <div className="mb-5">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-400/10">
            <ScanLine className="w-4 h-4 text-amber-400/80" />
          </div>
          <motion.div className="absolute inset-[-3px] rounded-lg pointer-events-none"
            animate={{ opacity: [0.03, 0.15, 0.03] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ backgroundColor: "#f59e0b", filter: "blur(5px)" }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-amber-300/85 uppercase tracking-[0.12em]">How the Scan Works</span>
            <span className="text-[7.5px] font-mono text-white/25">Explore each phase</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-amber-400/15 to-transparent mt-1" />
        </div>
      </div>

      {/* ── VERTICAL CONNECTED PIPELINE -- amber themed ── */}
      <div className="flex flex-col relative">
        {SCAN_PIPELINE.map((stage, stageIdx) => {
          const isActive = activeStage === stage.id
          const isLast = stageIdx === SCAN_PIPELINE.length - 1

          return (
            <div key={stage.id} className="relative">
              {/* Vertical connecting line */}
              {!isLast && (
                <div className="absolute left-[15px] top-[32px] w-[2px] bottom-0 z-0">
                  <div className="w-full h-full" style={{ background: `linear-gradient(180deg, ${stage.color}30, ${SCAN_PIPELINE[stageIdx + 1].color}30)` }} />
                  <motion.div
                    className="absolute left-0 w-full rounded-full"
                    style={{ height: "14px", background: `linear-gradient(180deg, ${stage.color}65, ${stage.color}00)` }}
                    animate={{ top: ["0%", "100%"] }}
                    transition={{ duration: 2 + stageIdx * 0.3, repeat: Infinity, ease: "easeInOut", delay: stageIdx * 0.5 }}
                  />
                </div>
              )}

              {/* Stage row */}
              <button
                onClick={() => setActiveStage(isActive ? null : stage.id)}
                className="w-full text-left relative z-10 flex items-start gap-3 py-2.5 px-1 transition-all duration-300 group"
              >
                <div className="relative shrink-0">
                  <motion.div
                    className="w-[32px] h-[32px] rounded-full flex items-center justify-center relative z-10"
                    style={{
                      backgroundColor: isActive ? `${stage.color}20` : "rgba(15,15,20,0.95)",
                      border: `2px solid ${isActive ? `${stage.color}55` : `${stage.color}20`}`,
                      boxShadow: isActive ? `0 0 20px ${stage.color}30, inset 0 0 8px ${stage.color}10` : "none",
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-[11px] font-black" style={{ color: isActive ? stage.color : `${stage.color}66` }}>{stage.num}</span>
                  </motion.div>
                  {isActive && (
                    <motion.div className="absolute inset-[-4px] rounded-full pointer-events-none"
                      style={{ border: `1.5px solid ${stage.color}30` }}
                      animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                  )}
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[13px] font-black leading-tight tracking-tight transition-colors duration-300 ${isActive ? "text-white" : "text-white/60 group-hover:text-white/80"}`}>{stage.title}</span>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[7px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: `${stage.color}15`, color: stage.color }}
                      >Active</motion.span>
                    )}
                  </div>
                  <p className="text-[9.5px] mt-0.5 transition-colors duration-300"
                    style={{ color: isActive ? `${stage.color}88` : "rgba(255,255,255,0.3)" }}>{stage.subtitle}</p>
                </div>

                <motion.div
                  animate={{ rotate: isActive ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-6 h-6 rounded-md flex items-center justify-center mt-1 shrink-0"
                  style={{ backgroundColor: isActive ? `${stage.color}12` : "transparent" }}>
                  <ChevronRight className="w-3.5 h-3.5" style={{ color: isActive ? `${stage.color}88` : "rgba(255,255,255,0.2)" }} />
                </motion.div>
              </button>

              {/* ── EXPANDED DETAIL ── */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    className="overflow-hidden relative z-10"
                  >
                    <div className="ml-[40px] pb-3">
                      {/* Stage SVG -- extracted to pipeline-svgs.tsx */}
                      <div className="mb-3 rounded-lg overflow-hidden"
                        style={{ background: `linear-gradient(145deg, ${stage.color}04, transparent)`, border: `0.5px solid ${stage.color}0a` }}>
                          <AiCopilotStageSvg svgType={stage.svgType} color={stage.color} />
                      </div>

                      {/* Description */}
                      <p className="text-[10.5px] text-white/55 leading-[1.7] mb-3">{stage.desc}</p>

                      {/* Detail breakdown -- borderless */}
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className="w-4 h-4 rounded flex items-center justify-center"
                          style={{ backgroundColor: `${stage.color}12` }}>
                          <span className="text-[7px] font-mono font-black" style={{ color: `${stage.color}cc` }}>i</span>
                        </div>
                        <span className="text-[8.5px] font-mono uppercase tracking-wider font-bold" style={{ color: `${stage.color}80` }}>Deep Breakdown</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {stage.details.map((detail, dIdx) => (
                          <motion.div key={dIdx}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: dIdx * 0.08 }}
                            className="rounded-lg px-3 py-2 cursor-default transition-all duration-300 group/detail hover:bg-white/[0.025]"
                            style={{ backgroundColor: `${stage.color}03` }}
                          >
                            <div className="flex items-center gap-2 mb-0.5">
                              <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/detail:scale-110"
                                style={{ backgroundColor: `${stage.color}10` }}>
                                <span className="text-[8px] font-mono font-black" style={{ color: `${stage.color}cc` }}>{String(dIdx + 1).padStart(2, '0')}</span>
                              </div>
                              <span className="text-[10.5px] font-bold leading-tight text-white/70 group-hover/detail:text-white/90 transition-colors duration-300">{detail.label}</span>
                            </div>
                            <p className="text-[9.5px] leading-[1.6] pl-7 text-white/30 group-hover/detail:text-white/50 transition-colors duration-300">{detail.note}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HowItWorksInteractive() {
  const [activeStage, setActiveStage] = useState<string | null>(null)
  const [hoveredDetail, setHoveredDetail] = useState<number | null>(null)

  return (
    <div className="mb-5">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-purple-400/10">
            <Waypoints className="w-4 h-4 text-purple-400/80" />
          </div>
          <motion.div className="absolute inset-[-3px] rounded-lg pointer-events-none"
            animate={{ opacity: [0.03, 0.15, 0.03] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ backgroundColor: "#8b5cf6", filter: "blur(5px)" }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-purple-300/85 uppercase tracking-[0.12em]">How It Works</span>
            <span className="text-[7.5px] font-mono text-white/25">Click each stage</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-400/15 to-transparent mt-1" />
        </div>
      </div>

      {/* ── VERTICAL CONNECTED PIPELINE -- no borders, seamless flow ── */}
      <div className="flex flex-col relative">
        {PIPELINE_STAGES.map((stage, stageIdx) => {
          const isActive = activeStage === stage.id
          const isLast = stageIdx === PIPELINE_STAGES.length - 1

          return (
            <div key={stage.id} className="relative">
              {/* Vertical connecting line -- runs behind everything */}
              {!isLast && (
                <div className="absolute left-[15px] top-[32px] w-[2px] bottom-0 z-0">
                  <div className="w-full h-full" style={{ background: `linear-gradient(180deg, ${stage.color}25, ${PIPELINE_STAGES[stageIdx + 1].color}25)` }} />
                  {/* Animated energy pulse flowing down */}
                  <motion.div
                    className="absolute left-0 w-full rounded-full"
                    style={{ height: "14px", background: `linear-gradient(180deg, ${stage.color}60, ${stage.color}00)` }}
                    animate={{ top: ["0%", "100%"] }}
                    transition={{ duration: 2 + stageIdx * 0.3, repeat: Infinity, ease: "easeInOut", delay: stageIdx * 0.5 }}
                  />
                </div>
              )}

              {/* Stage row -- number + content, no border */}
              <button
                onClick={() => setActiveStage(isActive ? null : stage.id)}
                className="w-full text-left relative z-10 flex items-start gap-3 py-2.5 px-1 transition-all duration-300 group"
              >
                {/* Number node on the vertical line */}
                <div className="relative shrink-0">
                  <motion.div
                    className="w-[32px] h-[32px] rounded-full flex items-center justify-center relative z-10"
                    style={{
                      backgroundColor: isActive ? `${stage.color}20` : "rgba(15,15,20,0.95)",
                      border: `2px solid ${isActive ? `${stage.color}55` : `${stage.color}20`}`,
                      boxShadow: isActive ? `0 0 20px ${stage.color}30, inset 0 0 8px ${stage.color}10` : "none",
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-[11px] font-black" style={{ color: isActive ? stage.color : `${stage.color}66` }}>{stage.num}</span>
                  </motion.div>
                  {isActive && (
                    <motion.div className="absolute inset-[-4px] rounded-full pointer-events-none"
                      style={{ border: `1.5px solid ${stage.color}30` }}
                      animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                  )}
                </div>

                {/* Title + subtitle inline */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[13px] font-black leading-tight tracking-tight transition-colors duration-300 ${isActive ? "text-white" : "text-white/60 group-hover:text-white/80"}`}>{stage.title}</span>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[7px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: `${stage.color}15`, color: stage.color }}
                      >Active</motion.span>
                    )}
                  </div>
                  <p className="text-[9.5px] mt-0.5 transition-colors duration-300"
                    style={{ color: isActive ? `${stage.color}88` : "rgba(255,255,255,0.3)" }}>{stage.subtitle}</p>
                </div>

                {/* Expand chevron */}
                <motion.div
                  animate={{ rotate: isActive ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-6 h-6 rounded-md flex items-center justify-center mt-1 shrink-0"
                  style={{ backgroundColor: isActive ? `${stage.color}12` : "transparent" }}>
                  <ChevronRight className="w-3.5 h-3.5" style={{ color: isActive ? `${stage.color}88` : "rgba(255,255,255,0.2)" }} />
                </motion.div>
              </button>

              {/* ── EXPANDED DETAIL -- no border, gradient fade ── */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    className="overflow-hidden relative z-10"
                  >
                    <div className="ml-[40px] pb-3">
                      {/* Stage-specific SVG -- extracted to separate files */}
                      <div className="mb-3 rounded-lg overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${stage.color}06, transparent)` }}>
                        <div className="px-2 py-2.5">
                          <GuidedSessionStageSvg svgType={stage.svgType} color={stage.color} />
                          {stage.svgType === "output" && <OutputSvg color={stage.color} />}
                        </div>
                      </div>

                      {/* Description -- seamless */}
                      <p className="text-[10.5px] text-white/55 leading-[1.7] mb-3">{stage.desc}</p>

                      {/* Detail breakdown -- borderless cards */}
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className="w-4 h-4 rounded flex items-center justify-center"
                          style={{ backgroundColor: `${stage.color}12` }}>
                          <span className="text-[7px] font-mono font-black" style={{ color: `${stage.color}cc` }}>i</span>
                        </div>
                        <span className="text-[8.5px] font-mono uppercase tracking-wider font-bold" style={{ color: `${stage.color}80` }}>Deep Breakdown</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {stage.details.map((detail, dIdx) => (
                          <motion.div key={dIdx}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: dIdx * 0.08 }}
                            onMouseEnter={() => setHoveredDetail(dIdx + 10)}
                            onMouseLeave={() => setHoveredDetail(null)}
                            className="rounded-lg px-3 py-2 cursor-default transition-all duration-300"
                            style={{
                              backgroundColor: hoveredDetail === dIdx + 10 ? `${stage.color}0a` : `${stage.color}03`,
                              boxShadow: hoveredDetail === dIdx + 10 ? `0 0 12px ${stage.color}08` : "none",
                            }}
                          >
                            <div className="flex items-center gap-2 mb-0.5">
                              <motion.div
                                className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${stage.color}10` }}
                                animate={hoveredDetail === dIdx + 10 ? { scale: [1, 1.15, 1] } : {}}
                                transition={{ duration: 0.6, repeat: hoveredDetail === dIdx + 10 ? Infinity : 0 }}
                              >
                                <span className="text-[8px] font-mono font-black" style={{ color: `${stage.color}cc` }}>{String(dIdx + 1).padStart(2, '0')}</span>
                              </motion.div>
                              <span className="text-[10.5px] font-bold leading-tight"
                                style={{ color: hoveredDetail === dIdx + 10 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.7)" }}>{detail.label}</span>
                            </div>
                            <p className="text-[9.5px] leading-[1.6] pl-7 transition-colors duration-300"
                              style={{ color: hoveredDetail === dIdx + 10 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)" }}>{detail.note}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function IntelligenceBoard({ homeSection, setHomeSection, criticalCount }: IntelligenceBoardProps) {
  const [expandedChannel, setExpandedChannel] = useState<string | null>(null)

  return (
    <div className="px-3 mb-2 mt-0.5">
      <div className="rounded-2xl border border-white/[0.06] overflow-hidden"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.012) 0%, rgba(255,255,255,0.004) 100%)" }}>

        {/* ══════════════════════════════════════════════════════
            LANE SELECTOR -- full-width, one at a time
            ══════════════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {homeSection === "signals" ? (
            <motion.div
              key="lane-scan"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="relative overflow-hidden"
              style={{ backgroundColor: "rgba(245,158,11,0.02)" }}
            >
              <motion.div className="absolute inset-0 pointer-events-none"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(245,158,11,0.04), transparent 60%)" }} />
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: "linear-gradient(90deg, rgba(245,158,11,0.5), rgba(245,158,11,0.15), rgba(245,158,11,0.4))" }}
                animate={{ backgroundPositionX: ["0%", "200%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <motion.div className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(105deg, transparent 40%, rgba(245,158,11,0.03) 50%, transparent 60%)", backgroundSize: "250% 100%" }}
                animate={{ backgroundPositionX: ["-100%", "250%"] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />

              <div className="px-5 py-4 relative">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <motion.div className="absolute inset-[-6px] rounded-xl pointer-events-none"
                      animate={{ opacity: [0.02, 0.15, 0.02], scale: [0.95, 1.05, 0.95] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      style={{ backgroundColor: "#f59e0b", filter: "blur(8px)" }} />
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-amber-400/15 border border-amber-400/30 shadow-[0_0_20px_rgba(245,158,11,0.08)]">
                      <motion.div
                        animate={{ y: [0, -1.5, 0], scale: [1, 1.05, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
                        <Activity className="w-5 h-5 text-amber-400" />
                      </motion.div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="text-[15px] font-black text-white leading-tight tracking-tight">Behavioral Scan</span>
                      {criticalCount > 0 && (
                        <motion.div
                          animate={{ scale: [1, 1.06, 1] }}
                          transition={{ duration: 2.5, repeat: Infinity }}
                          className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-500/[0.12] border border-red-500/[0.2]">
                          <motion.div className="w-1.5 h-1.5 rounded-full bg-red-400"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.2, repeat: Infinity }} />
                          <span className="text-[9px] font-mono font-black text-red-400/90">{criticalCount}</span>
                        </motion.div>
                      )}
                    </div>
                    <p className="text-[10.5px] text-amber-200/55 leading-snug">
                      AI-detected patterns in your behavior. Each signal leads to a focused conversation.
                    </p>
                  </div>
                  <motion.div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-400/[0.06] border border-amber-400/[0.15]"
                    animate={{ borderColor: ["rgba(245,158,11,0.15)", "rgba(245,158,11,0.3)", "rgba(245,158,11,0.15)"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                    <motion.div className="w-2 h-2 rounded-full bg-amber-400"
                      animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.2, 0.9] }}
                      transition={{ duration: 1.5, repeat: Infinity }} />
                    <span className="text-[8.5px] font-mono font-bold text-amber-400/80 uppercase tracking-wide">Scanning</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="lane-session"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="relative overflow-hidden"
              style={{ backgroundColor: "rgba(139,92,246,0.02)" }}
            >
              <motion.div className="absolute inset-0 pointer-events-none"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.04), transparent 60%)" }} />
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.5), rgba(139,92,246,0.15), rgba(139,92,246,0.4))" }}
                animate={{ backgroundPositionX: ["0%", "200%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <motion.div className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(105deg, transparent 40%, rgba(139,92,246,0.03) 50%, transparent 60%)", backgroundSize: "250% 100%" }}
                animate={{ backgroundPositionX: ["-100%", "250%"] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />

              <div className="px-5 py-4 relative">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <motion.div className="absolute inset-[-6px] rounded-xl pointer-events-none"
                      animate={{ opacity: [0.02, 0.15, 0.02], scale: [0.95, 1.05, 0.95] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      style={{ backgroundColor: "#8b5cf6", filter: "blur(8px)" }} />
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-purple-400/12 border border-purple-400/25 shadow-[0_0_20px_rgba(139,92,246,0.08)]">
                      <motion.div
                        animate={{ scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                        <Waypoints className="w-5 h-5 text-purple-400" />
                      </motion.div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="text-[15px] font-black text-white leading-tight tracking-tight">Intelligence Session</span>
                      <motion.div
                        animate={{ scale: [1, 1.04, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-purple-400/10 border border-purple-400/20">
                        <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.8, repeat: Infinity }} />
                        <span className="text-[7.5px] font-mono font-bold text-emerald-400/80">Online</span>
                      </motion.div>
                    </div>
                    <p className="text-[10.5px] text-purple-200/50 leading-snug">
                      Select a specialized thinking framework. Each mode reshapes how the AI analyzes your situation.
                    </p>
                  </div>
                  <motion.div className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-400/[0.06] border border-purple-400/[0.12]"
                    animate={{ borderColor: ["rgba(139,92,246,0.12)", "rgba(139,92,246,0.25)", "rgba(139,92,246,0.12)"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                    <div className="flex items-center gap-1.5">
                      <Cpu className="w-3 h-3 text-purple-400/70" />
                      <span className="text-[8.5px] font-mono font-bold text-purple-400/80 uppercase tracking-wide">8 Engines</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(8)].map((_, i) => (
                        <motion.div key={i} className="w-[3px] h-[3px] rounded-full"
                          animate={{ opacity: [0.2, 0.8, 0.2] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                          style={{ backgroundColor: "#a78bfa" }} />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════════════════════
            JOURNEY DETAIL ZONE
            ══════════════════════════════════════════════════════ */}
        <div className="border-t border-white/[0.04]">
          <AnimatePresence mode="wait">
            {homeSection === "signals" ? (
              <motion.div key="journey-scan"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                className="overflow-hidden"
              >
                <div className="px-1.5 pt-4 pb-5"
                  style={{ background: "linear-gradient(180deg, rgba(245,158,11,0.012) 0%, transparent 100%)" }}>

                  {/* ── HOW THE SCAN WORKS -- Interactive Pipeline ── */}
                  <ScanHowItWorks />

                  {/* ────────────────────────────────────────────
                      SECTION 1: LIVE SCANNER - Deep Feature Explanation
                      ──────────────────────────────────────────── */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-400/10 border border-amber-400/20">
                            <ScanLine className="w-4 h-4 text-amber-400/80 relative z-10" />
                          </div>
                          <motion.div className="absolute inset-[-3px] rounded-lg pointer-events-none"
                            animate={{ opacity: [0.03, 0.15, 0.03] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            style={{ backgroundColor: "#f59e0b", filter: "blur(6px)" }} />
                        </div>
                        <div>
                          <span className="text-[11px] font-mono text-white/65 uppercase tracking-[0.12em] font-bold block">Live Scanner</span>
                          <span className="text-[8.5px] text-white/30 leading-none">4 behavioral channels active</span>
                        </div>
                      </div>
                      <motion.div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-amber-400/[0.06] border border-amber-400/[0.12]"
                        animate={{ borderColor: ["rgba(245,158,11,0.12)", "rgba(245,158,11,0.25)", "rgba(245,158,11,0.12)"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                        <motion.div className="w-2 h-2 rounded-full bg-amber-400"
                          animate={{ opacity: [0.4, 1, 0.4], scale: [0.85, 1.15, 0.85] }}
                          transition={{ duration: 1.5, repeat: Infinity }} />
                        <span className="text-[8px] font-mono font-bold text-amber-400/80">Active</span>
                      </motion.div>
                    </div>

                    {/* Channel cards -- premium expandable with deep insight */}
                    <div className="flex flex-col gap-2">
                      {SCAN_CHANNELS.map((ch, i) => {
                        const isExpanded = expandedChannel === ch.label
                        const IconComp = ch.icon
                        return (
                          <motion.div key={ch.label}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 + i * 0.06 }}
                            className="group/ch"
                          >
                            {/* Channel header -- premium card with icon, tagline, badge */}
                            <button
                              onClick={() => setExpandedChannel(isExpanded ? null : ch.label)}
                              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all duration-400 text-left"
                              style={{
                                backgroundColor: isExpanded ? `${ch.color}08` : "rgba(255,255,255,0.012)",
                                borderColor: isExpanded ? `${ch.color}30` : "rgba(255,255,255,0.05)",
                              }}
                            >
                              {/* Channel icon with glow */}
                              <div className="relative">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
                                  style={{
                                    backgroundColor: isExpanded ? `${ch.color}15` : `${ch.color}08`,
                                    border: `1px solid ${isExpanded ? `${ch.color}35` : `${ch.color}15`}`,
                                  }}>
                                  <IconComp className="w-4 h-4 transition-colors duration-300" style={{ color: isExpanded ? ch.color : `${ch.color}99` }} />
                                </div>
                                {isExpanded && (
                                  <motion.div className="absolute inset-[-4px] rounded-lg pointer-events-none"
                                    animate={{ opacity: [0.03, 0.12, 0.03] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    style={{ backgroundColor: ch.color, filter: "blur(6px)" }} />
                                )}
                              </div>

                              {/* Channel info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[12px] font-black leading-tight" style={{ color: ch.color }}>{ch.label}</span>
                                  <span className="text-[8px] text-white/30 font-mono">{ch.tagline}</span>
                                </div>
                                {/* Live metrics bar */}
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex-1 h-[3px] rounded-full overflow-hidden bg-white/[0.04]">
                                    <motion.div className="h-full rounded-full"
                                      style={{ backgroundColor: ch.color }}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(ch.signals / 3) * 100}%` }}
                                      transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: "easeOut" }} />
                                  </div>
                                  <span className="text-[8px] font-mono font-bold shrink-0" style={{ color: `${ch.color}bb` }}>{ch.signals} signals</span>
                                </div>
                              </div>

                              {/* Expand indicator */}
                              <motion.div
                                animate={{ rotate: isExpanded ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="w-6 h-6 rounded-md flex items-center justify-center"
                                style={{ backgroundColor: isExpanded ? `${ch.color}12` : "transparent" }}>
                                <ChevronRight className="w-3.5 h-3.5 text-white/25" />
                              </motion.div>
                            </button>

                            {/* ── Expanded deep-dive panel ── */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mx-1 mt-1.5 rounded-xl border overflow-hidden"
                                    style={{ borderColor: `${ch.color}18`, background: `linear-gradient(180deg, ${ch.color}06 0%, transparent 100%)` }}>

                                    {/* What it does */}
                                    <div className="px-4 pt-3.5 pb-3 border-b" style={{ borderColor: `${ch.color}10` }}>
                                      <div className="flex items-center gap-2 mb-2">
                                        <Fingerprint className="w-3.5 h-3.5" style={{ color: `${ch.color}80` }} />
                                        <span className="text-[9px] font-mono uppercase tracking-wider font-bold" style={{ color: `${ch.color}90` }}>What this scanner does</span>
                                      </div>
                                      <p className="text-[10.5px] text-white/60 leading-[1.65]">{ch.whatItDoes}</p>
                                    </div>

                                    {/* Why it matters */}
                                    <div className="px-4 pt-3 pb-3 border-b" style={{ borderColor: `${ch.color}10` }}>
                                      <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="w-3.5 h-3.5" style={{ color: `${ch.color}80` }} />
                                        <span className="text-[9px] font-mono uppercase tracking-wider font-bold" style={{ color: `${ch.color}90` }}>Why it matters</span>
                                      </div>
                                      <p className="text-[10.5px] text-white/60 leading-[1.65]">{ch.whyItMatters}</p>
                                    </div>

                                    {/* How it works -- detailed metric breakdown */}
                                    <div className="px-4 pt-3 pb-4">
                                      <div className="flex items-center gap-2 mb-3">
                                        <BarChart2 className="w-3.5 h-3.5" style={{ color: `${ch.color}80` }} />
                                        <span className="text-[9px] font-mono uppercase tracking-wider font-bold" style={{ color: `${ch.color}90` }}>How it works</span>
                                      </div>
                                      <div className="flex flex-col gap-2.5">
                                        {ch.howItWorks.map((item, idx) => (
                                          <motion.div key={idx}
                                            initial={{ opacity: 0, x: -6 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.08 }}
                                            className="rounded-lg px-3.5 py-2.5 border"
                                            style={{ backgroundColor: `${ch.color}04`, borderColor: `${ch.color}12` }}
                                          >
                                            <div className="flex items-center gap-2 mb-1">
                                              <div className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                                                style={{ backgroundColor: `${ch.color}12`, border: `1px solid ${ch.color}22` }}>
                                                <span className="text-[8px] font-mono font-black" style={{ color: `${ch.color}cc` }}>{String(idx + 1).padStart(2, '0')}</span>
                                              </div>
                                              <span className="text-[10.5px] font-bold text-white/80 leading-tight">{item.metric}</span>
                                            </div>
                                            <p className="text-[9.5px] text-white/45 leading-[1.6] pl-7">{item.detail}</p>
                                          </motion.div>
                                        ))}
                                      </div>
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

                  {/* ────────────────────────────────────────────
                      SECTION 2: SEVERITY BREAKDOWN
                      ──────────────────────────────────────────── */}
                  <div className="mb-5">
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-3.5 h-3.5 text-white/40" />
                        <span className="text-[9px] font-mono text-white/50 uppercase tracking-[0.12em] font-bold">Severity Breakdown</span>
                      </div>
                      <div className="flex-1 h-px bg-white/[0.04]" />
                      <span className="text-[10px] font-mono text-white/40 font-bold">{BEHAVIOR_SIGNALS.length} detected</span>
                    </div>

                    <div className="flex items-center gap-1 h-3 rounded-lg overflow-hidden bg-white/[0.02] border border-white/[0.04]">
                      {(() => {
                        const critical = BEHAVIOR_SIGNALS.filter(s => s.impact === "critical").length
                        const high = BEHAVIOR_SIGNALS.filter(s => s.impact === "high").length
                        const medium = BEHAVIOR_SIGNALS.filter(s => s.impact === "medium").length
                        const total = BEHAVIOR_SIGNALS.length
                        return (
                          <>
                            <motion.div className="h-full rounded-l-md"
                              initial={{ width: 0 }}
                              animate={{ width: `${(critical / total) * 100}%` }}
                              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                              style={{ background: "linear-gradient(90deg, rgba(239,68,68,0.7), rgba(239,68,68,0.5))" }} />
                            <motion.div className="h-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${(high / total) * 100}%` }}
                              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                              style={{ background: "linear-gradient(90deg, rgba(245,158,11,0.6), rgba(245,158,11,0.4))" }} />
                            <motion.div className="h-full rounded-r-md"
                              initial={{ width: 0 }}
                              animate={{ width: `${(medium / total) * 100}%` }}
                              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                              style={{ background: "linear-gradient(90deg, rgba(59,130,246,0.5), rgba(59,130,246,0.3))" }} />
                          </>
                        )
                      })()}
                    </div>

                    <div className="flex items-center gap-5 mt-2">
                      {[
                        { label: "Critical", color: "#ef4444", count: BEHAVIOR_SIGNALS.filter(s => s.impact === "critical").length },
                        { label: "High", color: "#f59e0b", count: BEHAVIOR_SIGNALS.filter(s => s.impact === "high").length },
                        { label: "Medium", color: "#3b82f6", count: BEHAVIOR_SIGNALS.filter(s => s.impact === "medium").length },
                      ].map(s => (
                        <div key={s.label} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                          <span className="text-[9px] font-mono text-white/45 font-bold">{s.count} {s.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="journey-session"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                className="overflow-hidden"
              >
                <div className="px-4 pt-4 pb-4">

                  {/* ── HOW IT WORKS -- Interactive Pipeline ── */}
                  <HowItWorksInteractive />

                  {/* ── AI PERSONALITIES ── */}
                  <div className="border-t border-white/[0.05] pt-3.5">
                    <div className="flex items-center gap-2 mb-3">
                      <Cpu className="w-3.5 h-3.5 text-purple-400/55" />
                      <span className="text-[8.5px] font-mono text-white/55 uppercase tracking-[0.15em]">Intelligence Modes</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          name: "Analyst", color: "#3b82f6", focus: "Market structure & bias",
                          bestFor: "Understanding where price is and where it could go",
                          style: "Direct, structured, data-driven",
                          useWhen: "You need clarity on market direction before a trade"
                        },
                        {
                          name: "Strategist", color: "#10b981", focus: "Plans & scenarios",
                          bestFor: "Building and stress-testing your trade plan",
                          style: "Methodical, if-then logic, risk-focused",
                          useWhen: "You have an idea but need to pressure-test it"
                        },
                        {
                          name: "Coach", color: "#f43f5e", focus: "Discipline & emotion",
                          bestFor: "Staying within your rules when emotions rise",
                          style: "Firm but supportive, accountability-focused",
                          useWhen: "You just took a loss or feel the urge to overtrade"
                        },
                        {
                          name: "Mirror", color: "#06b6d4", focus: "Reflection & patterns",
                          bestFor: "Seeing your own behavior patterns objectively",
                          style: "Neutral, observational, pattern-surfacing",
                          useWhen: "After a session to review what you did and why"
                        },
                      ].map((ai, i) => (
                        <motion.div key={ai.name}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + i * 0.05 }}
                          className="group/ai relative"
                        >
                          <div className="rounded-lg border border-white/[0.05] bg-white/[0.015] group-hover/ai:bg-white/[0.035] group-hover/ai:border-white/[0.14] transition-all duration-300 cursor-default">
                            <div className="px-3 py-2.5">
                              <div className="flex items-center gap-2">
                                <motion.div className="w-[7px] h-[7px] rounded-full shrink-0"
                                  style={{ backgroundColor: ai.color }}
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }} />
                                <span className="text-[11px] font-black" style={{ color: ai.color }}>{ai.name}</span>
                              </div>
                              <p className="text-[9.5px] text-white/55 leading-snug mt-1">{ai.focus}</p>
                            </div>
                          </div>

                          {/* Hover tooltip */}
                          <div className="absolute left-0 right-0 bottom-full mb-1.5 z-50 pointer-events-none opacity-0 group-hover/ai:opacity-100 transition-all duration-200 translate-y-1 group-hover/ai:translate-y-0">
                            <div className="rounded-lg border bg-[#131320]/95 backdrop-blur-sm px-3 py-2.5 shadow-xl shadow-black/40"
                              style={{ borderColor: `${ai.color}25` }}>
                              <div className="flex items-center gap-1.5 mb-2">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ai.color }} />
                                <span className="text-[9.5px] font-bold" style={{ color: `${ai.color}cc` }}>{ai.name}</span>
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <div>
                                  <span className="text-[8px] font-mono text-white/40 uppercase tracking-wider">Best for</span>
                                  <p className="text-[9.5px] text-white/75 leading-snug mt-px">{ai.bestFor}</p>
                                </div>
                                <div>
                                  <span className="text-[8px] font-mono text-white/40 uppercase tracking-wider">Response style</span>
                                  <p className="text-[9.5px] text-white/75 leading-snug mt-px">{ai.style}</p>
                                </div>
                                <div>
                                  <span className="text-[8px] font-mono text-white/40 uppercase tracking-wider">Use when</span>
                                  <p className="text-[9.5px] text-white/75 leading-snug mt-px">{ai.useWhen}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* ── BEYOND MODES ── */}
                  <div className="border-t border-white/[0.05] pt-5 mt-4">
                    {/* Section header */}
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center relative"
                        style={{ backgroundColor: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)" }}>
                        <Layers className="w-3.5 h-3.5 text-purple-400/70 relative z-10" />
                        <motion.div className="absolute inset-[-2px] rounded-lg pointer-events-none"
                          animate={{ opacity: [0.03, 0.12, 0.03] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          style={{ backgroundColor: "#8b5cf6", filter: "blur(6px)" }} />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-black text-purple-300/80 uppercase tracking-[0.12em]">Beyond Modes</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-purple-400/10 to-transparent mt-1" />
                      </div>
                    </div>

                    <p className="text-[11px] text-white/55 leading-[1.65] mb-5 pl-[38px]">
                      {'Modes are how you start a conversation. Models are how the AI learns to think like you, or like a mentor you trust. This is the next layer.'}
                    </p>

                    <div className="flex flex-col gap-4">
                      {/* ── BUILD YOUR INTELLIGENCE CARD ── */}
                      <div className="rounded-xl border border-purple-400/[0.1] bg-purple-400/[0.015] overflow-hidden group/build hover:border-purple-400/[0.22] transition-all duration-400 relative">
                        {/* Ambient glow */}
                        <motion.div className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                          animate={{ opacity: [0.02, 0.06, 0.02] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)" }} />

                        <div className="px-4 pt-4 pb-1 relative">
                          <div className="flex items-center gap-2.5 mb-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
                              <Brain className="w-4 h-4 text-purple-400/70 group-hover/build:text-purple-400/90 transition-colors" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-[13px] font-black text-white leading-tight">Build Your Intelligence</h4>
                                <span className="text-[7px] font-mono font-bold text-purple-400/90 bg-purple-400/[0.12] border border-purple-400/[0.2] px-1.5 py-px rounded-full uppercase tracking-wider">New</span>
                              </div>
                              <p className="text-[9px] text-purple-300/50 mt-0.5">Personal AI model architecture</p>
                            </div>
                          </div>

                          <p className="text-[10.5px] text-white/60 leading-[1.6] mb-3.5">
                            {'Create a personal AI model shaped by how you think, trade, and make decisions. The system learns your patterns over time and adapts its responses to match your cognitive framework.'}
                          </p>

                          {/* Feature breakdown */}
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            {[
                              { icon: Eye, label: "Pattern Memory", desc: "AI remembers your decision patterns", color: "#a78bfa" },
                              { icon: TrendingUp, label: "Adaptive Logic", desc: "Evolves with your trading style", color: "#818cf8" },
                              { icon: Fingerprint, label: "Cognitive Map", desc: "Maps how you process information", color: "#c084fc" },
                              { icon: Zap, label: "Context Engine", desc: "Applies your rules automatically", color: "#7c3aed" },
                            ].map((feat, i) => (
                              <motion.div key={feat.label}
                                initial={{ opacity: 0, y: 3 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.04 }}
                                className="flex items-start gap-2 px-2.5 py-2 rounded-lg border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] hover:border-purple-400/[0.12] transition-all duration-300"
                              >
                                <feat.icon className="w-3 h-3 mt-0.5 shrink-0" style={{ color: `${feat.color}99` }} />
                                <div>
                                  <span className="text-[9px] font-bold text-white/80 leading-tight block">{feat.label}</span>
                                  <span className="text-[8px] text-white/40 leading-tight block mt-px">{feat.desc}</span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Progress indicator */}
                        <div className="px-4 py-2.5 border-t border-purple-400/[0.06]"
                          style={{ background: "linear-gradient(180deg, rgba(139,92,246,0.02), transparent)" }}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {[1,2,3,4].map(n => (
                                  <div key={n} className="w-[5px] h-[5px] rounded-full"
                                    style={{ backgroundColor: n <= 1 ? "rgba(139,92,246,0.5)" : "rgba(139,92,246,0.1)" }} />
                                ))}
                              </div>
                              <span className="text-[8px] font-mono text-purple-400/40">Phase 1 of 4</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-400/[0.06] border border-purple-400/[0.1]">
                              <span className="text-[7.5px] font-mono font-bold text-purple-400/60 uppercase tracking-wider">Coming Soon</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ── LEARN FROM A MENTOR CARD ── */}
                      <div className="rounded-xl border border-amber-400/[0.08] bg-amber-400/[0.008] overflow-hidden group/mentor hover:border-amber-400/[0.18] transition-all duration-400 relative">
                        {/* Ambient glow */}
                        <motion.div className="absolute top-0 left-0 w-28 h-28 pointer-events-none"
                          animate={{ opacity: [0.02, 0.05, 0.02] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                          style={{ background: "radial-gradient(circle, rgba(245,158,11,0.12), transparent 70%)" }} />

                        <div className="px-4 pt-4 pb-1 relative">
                          <div className="flex items-center gap-2.5 mb-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}>
                              <Globe className="w-4 h-4 text-amber-400/60 group-hover/mentor:text-amber-400/80 transition-colors" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-[13px] font-black text-white/95 leading-tight">Learn From a Mentor</h4>
                              <p className="text-[9px] text-amber-400/45 mt-0.5">Verified mentor intelligence systems</p>
                            </div>
                          </div>

                          <p className="text-[10.5px] text-white/55 leading-[1.6] mb-3.5">
                            {"Access AI models trained on verified mentors' strategies, psychology frameworks, and trading philosophies. Each mentor system is a complete operating framework, not a generic template."}
                          </p>

                          {/* Mentor framework pillars */}
                          <div className="flex flex-col gap-1.5 mb-3">
                            {[
                              { label: "Strategy Framework", desc: "Entry logic, confluence systems, execution models", color: "#f59e0b" },
                              { label: "Psychology System", desc: "Emotional regulation, discipline architecture, review methods", color: "#fbbf24" },
                              { label: "Risk Architecture", desc: "Position sizing, exposure rules, drawdown protocols", color: "#d97706" },
                            ].map((pillar, i) => (
                              <motion.div key={pillar.label}
                                initial={{ opacity: 0, x: -4 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 + i * 0.05 }}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.025] transition-all duration-300"
                              >
                                <div className="w-1 h-6 rounded-full shrink-0" style={{ backgroundColor: `${pillar.color}40` }} />
                                <div className="flex-1 min-w-0">
                                  <span className="text-[9.5px] font-bold text-white/75 block leading-tight">{pillar.label}</span>
                                  <span className="text-[8.5px] text-white/35 block leading-snug mt-px">{pillar.desc}</span>
                                </div>
                                <ChevronRight className="w-3 h-3 text-white/15 shrink-0" />
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Mentor access indicator */}
                        <div className="px-4 py-2.5 border-t border-amber-400/[0.05]"
                          style={{ background: "linear-gradient(180deg, rgba(245,158,11,0.015), transparent)" }}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-1.5">
                                {["#f59e0b", "#10b981", "#3b82f6"].map((c, i) => (
                                  <div key={i} className="w-4 h-4 rounded-full border border-[#0d0d1a]" style={{ backgroundColor: `${c}30` }} />
                                ))}
                              </div>
                              <span className="text-[8px] font-mono text-amber-400/40">3 mentor systems in development</span>
                            </div>
                            <Shield className="w-3 h-3 text-amber-400/25" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Coming model types */}
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/[0.03]">
                      <div className="flex-1 h-px bg-white/[0.03]" />
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.015] border border-white/[0.04]">
                        <motion.div className="w-1 h-1 rounded-full bg-purple-400/50"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                        <span className="text-[8px] font-mono text-white/30">+4 model types in development</span>
                      </div>
                      <div className="flex-1 h-px bg-white/[0.03]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
