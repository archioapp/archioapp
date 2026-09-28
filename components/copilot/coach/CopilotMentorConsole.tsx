"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Activity,
  Target,
  Brain,
  Compass,
  Route,
  Star,
  Award,
  CheckCircle2,
  Lightbulb,
  MessageSquare,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react"
import { MentorGuideAndTutorial } from "@/components/copilot/coach/MentorGuideAndTutorial"

/* ═══════════════════════════════════════════════════════════════
   COPILOT MENTOR INTELLIGENCE CONSOLE

   Same carousel pattern as Strategy/Activity/Psychology consoles.
   Presents expert-derived decision frameworks across 5 mentorship
   modules, each with specific teachings, case studies, and
   actionable guidance.

   Carousel profiles represent different learning paths:
   FOUNDATION / EXECUTION / PSYCHOLOGY / RISK MASTERY / ELITE EDGE
   ═══════════════════════════════════════════════════════════════ */

/* ── Mentorship Modules ── */

interface MentorModule {
  id: string
  label: string
  grade: string
  color: string
  description: string
  teachings: {
    id: string
    title: string
    category: string
    insight: string
    application: string
    commonMistake: string
    status: "mastered" | "practicing" | "introduced" | "locked"
  }[]
  caseStudies: {
    title: string
    scenario: string
    lesson: string
    outcome: string
  }[]
  progressPct: number
  lessonsCompleted: number
  totalLessons: number
}

const MODULES: MentorModule[] = [
  {
    id: "foundation",
    label: "FOUNDATION",
    grade: "I",
    color: "#94a3b8",
    description: "Core principles that every successful trader must internalize. Market structure, price action fundamentals, and the discipline framework. This is where mastery begins.",
    teachings: [
      {
        id: "f1", title: "Market Structure Hierarchy", category: "Structure",
        insight: "Price respects structure on all timeframes. Higher timeframe structure always overrides lower timeframe patterns. Learn to read the hierarchy before placing any trade.",
        application: "Before every entry, identify the current H4/D1 structure. Your LTF entry must align with the HTF direction.",
        commonMistake: "Taking counter-trend trades on M15 when D1 is clearly trending. The small timeframe pattern looks perfect but the higher structure destroys it.",
        status: "mastered",
      },
      {
        id: "f2", title: "Liquidity Concepts", category: "Mechanics",
        insight: "Price moves from one pool of liquidity to another. Every swing high and low is a target. Understanding who is trapped tells you where price is going.",
        application: "Map the obvious highs and lows. These are targets, not support/resistance. Price will hunt these levels before moving.",
        commonMistake: "Treating obvious support/resistance as places to enter. These are the exact levels where liquidity is collected, not where you should be placing stops.",
        status: "mastered",
      },
      {
        id: "f3", title: "Session Timing", category: "Timing",
        insight: "Not all hours are created equal. 80% of institutional flow occurs in 20% of the trading day. Trade when the edge exists, not when you are available.",
        application: "Only trade during London (07:00-10:00 UTC) and New York (13:00-16:00 UTC) killzones. Everything else is noise.",
        commonMistake: "Trading during Asia or transition periods because you are bored or available. Low-volume periods produce the most false signals.",
        status: "practicing",
      },
      {
        id: "f4", title: "Bias Construction", category: "Analysis",
        insight: "Your daily bias should be constructed before the session opens. If you are building your bias during live trading, you are already behind.",
        application: "Complete bias analysis during off-hours. Mark HTF levels, identify the narrative, and define your plan before the session.",
        commonMistake: "Opening charts at session open without a pre-built bias and reacting to the first candle. This is not trading -- it is gambling.",
        status: "introduced",
      },
    ],
    caseStudies: [
      {
        title: "The Monday Trap",
        scenario: "Strong displacement on Monday breaks Friday's high. Looks like a clear bullish breakout with volume confirmation.",
        lesson: "Monday's primary move is often a liquidity hunt. Smart money uses Monday to establish one side of the weekly range. The real direction reveals on Tuesday.",
        outcome: "Monday's move reversed completely by Tuesday open. Traders who entered the breakout were trapped and stopped out as Tuesday displaced in the opposite direction.",
      },
    ],
    progressPct: 72,
    lessonsCompleted: 18,
    totalLessons: 25,
  },
  {
    id: "execution",
    label: "EXECUTION",
    grade: "II",
    color: "#3b82f6",
    description: "Translating analysis into precise entries and exits. Order types, position sizing, entry timing, and trade management. The gap between knowing and doing.",
    teachings: [
      {
        id: "e1", title: "Limit Order Discipline", category: "Entries",
        insight: "Limit orders force patience. Market orders reward impulsiveness. The difference in win rate between the two is 15-20% across all strategies.",
        application: "Place limit orders at your identified level and walk away. If price doesn't fill you, the setup wasn't valid. Never chase.",
        commonMistake: "Watching price approach your level, then market ordering in because you are afraid it will leave without you. This is FOMO disguised as execution.",
        status: "mastered",
      },
      {
        id: "e2", title: "Position Sizing Framework", category: "Risk",
        insight: "Position size determines your emotional state during the trade. Too large and you cannot think clearly. The correct size lets you be emotionally indifferent to the outcome.",
        application: "Risk 1% of account per trade. Calculate the exact lot size based on your stop distance. Never round up.",
        commonMistake: "Increasing size on high-conviction trades. High conviction is an emotion, not a statistical edge. Every trade gets the same risk.",
        status: "practicing",
      },
      {
        id: "e3", title: "Trade Management", category: "Management",
        insight: "The entry is 20% of the trade. Management is 80%. Most traders focus on the entry and neglect everything after. Your management rules should be as precise as your entry rules.",
        application: "Define your management rules before entry: partial targets, trailing stop rules, and conditions for early exit. Write them down.",
        commonMistake: "Moving your stop to breakeven too early. This feels safe but converts winning trades into breakeven trades. Trust the original stop placement.",
        status: "introduced",
      },
    ],
    caseStudies: [
      {
        title: "The Breakeven Trap",
        scenario: "Perfect setup. Entry triggers, moves 10 pips in favor. Trader moves stop to breakeven for safety. Price retraces to entry, stops them out, then continues to the original target for +3R.",
        lesson: "Breakeven stops are not free trades -- they are voluntary exits. The market's retracement to your entry is normal and expected. Trust your original analysis.",
        outcome: "The trade would have been +3.2R. Instead it was 0R. The trader felt smart for protecting capital but lost the entire edge of the setup.",
      },
    ],
    progressPct: 45,
    lessonsCompleted: 9,
    totalLessons: 20,
  },
  {
    id: "psychology",
    label: "PSYCHOLOGY",
    grade: "III",
    color: "#f59e0b",
    description: "The invisible edge. Understanding how your mind sabotages your trading. Emotional regulation, cognitive biases, and the neurochemistry of risk-taking.",
    teachings: [
      {
        id: "p1", title: "Loss Aversion Mechanics", category: "Bias",
        insight: "You feel losses 2.5x more intensely than equivalent gains. This biological fact distorts every trading decision. Acknowledging it is the first step to neutralizing it.",
        application: "Before taking a loss, remind yourself: this is the cost of doing business. A controlled loss is a successful trade. Reframe losses as operational expenses.",
        commonMistake: "Moving your stop loss to avoid the pain of a loss. This converts a controlled -1R loss into an uncontrolled -3R or -5R loss. The medicine is worse than the disease.",
        status: "practicing",
      },
      {
        id: "p2", title: "Revenge Trading Pattern", category: "Behavior",
        insight: "After a loss, cortisol floods your brain for 20-45 minutes. During this window, your risk assessment is impaired. Any trade taken during this window is statistically a revenge trade.",
        application: "After any loss, close your charts for 30 minutes. Set a timer. Do not even look at price. When you return, you are a different person neurochemically.",
        commonMistake: "Believing you are calm enough to trade immediately after a loss. You are not. Your subjective experience of calm is not the same as actual neurochemical baseline.",
        status: "introduced",
      },
      {
        id: "p3", title: "FOMO Neurochemistry", category: "Bias",
        insight: "FOMO triggers the same brain regions as physical pain. The fear of missing out is literally painful. Understanding this helps you recognize FOMO as a signal to NOT trade.",
        application: "When you feel urgency to enter a trade, pause. Urgency is the enemy of precision. If the setup is valid, there will be another one. There is always another setup.",
        commonMistake: "Chasing a move because it looks like it will never come back. It always comes back. And if it doesn't, there will be a better setup tomorrow.",
        status: "introduced",
      },
    ],
    caseStudies: [
      {
        title: "The Tilt Cascade",
        scenario: "First trade: -1R. Trader feels fine. Second trade 5 minutes later: -1R. Cortisol rising. Third trade 2 minutes later: -2R (doubled size). Fourth trade immediately: -3R (tripled size). Total session: -7R.",
        lesson: "Each subsequent loss narrowed the decision window and expanded the position size. This is the textbook tilt cascade. The first loss was fine. The second should have triggered a cooldown.",
        outcome: "A -1R day became a -7R day. The additional -6R was entirely preventable with a simple rule: stop after 2 consecutive losses.",
      },
    ],
    progressPct: 28,
    lessonsCompleted: 7,
    totalLessons: 25,
  },
  {
    id: "risk-mastery",
    label: "RISK MASTERY",
    grade: "IV",
    color: "#06b6d4",
    description: "Advanced risk management beyond basic position sizing. Portfolio heat, correlation risk, drawdown management, and the mathematics of survival.",
    teachings: [
      {
        id: "r1", title: "Portfolio Heat", category: "Portfolio",
        insight: "Individual trade risk is only half the equation. Total portfolio exposure (heat) determines whether a single bad day can damage your account. Max heat should never exceed 5%.",
        application: "Before any new trade, calculate total open risk across all positions. If adding this trade pushes you above 5% total heat, do not take it.",
        commonMistake: "Having 5 trades open at 1% each and thinking you are being conservative. You have 5% total heat. One correlated move can hit all 5 stops.",
        status: "practicing",
      },
      {
        id: "r2", title: "Correlation Awareness", category: "Portfolio",
        insight: "Trading EURUSD, GBPUSD, and AUDUSD simultaneously is not diversification -- it is concentrated USD risk. Correlated positions multiply risk, not opportunity.",
        application: "Check correlation before opening new positions. If your new trade is 70%+ correlated with an existing position, treat them as the same trade.",
        commonMistake: "Feeling diversified because you are in different instruments. EURUSD and GBPUSD move together 85% of the time. Two positions = double the risk, not double the edge.",
        status: "introduced",
      },
    ],
    caseStudies: [
      {
        title: "The Correlation Wipeout",
        scenario: "Trader has long positions in EURUSD, GBPUSD, and AUDUSD. Each at 1% risk. USD strengthens across the board.",
        lesson: "Three separate trades became one 3% USD bet. The perceived 1% risk per trade was actually 3% concentrated directional exposure.",
        outcome: "All three trades stopped out within 20 minutes. -3R in a single move. The trader thought they were diversified.",
      },
    ],
    progressPct: 15,
    lessonsCompleted: 3,
    totalLessons: 20,
  },
  {
    id: "elite-edge",
    label: "ELITE EDGE",
    grade: "V",
    color: "#a78bfa",
    description: "The final frontier. Institutional-level concepts, market microstructure, order flow reading, and the meta-game. Reserved for operators who have mastered all prior modules.",
    teachings: [
      {
        id: "x1", title: "Institutional Order Flow", category: "Advanced",
        insight: "Large orders cannot be filled at a single price. Institutions split orders across time and price levels. Learning to read this splitting pattern reveals their intent before the move completes.",
        application: "Watch for absorption patterns at key levels. Large resting orders that absorb selling pressure without price moving down indicate institutional accumulation.",
        commonMistake: "Trying to read order flow without first mastering structure and timing. Order flow is a refinement tool, not a replacement for foundational analysis.",
        status: "locked",
      },
      {
        id: "x2", title: "The Meta-Game", category: "Advanced",
        insight: "At the highest level, you are not trading price -- you are trading the behavior of other traders. Understanding what retail traders will do at a given level tells you where smart money will exploit them.",
        application: "At obvious support/resistance levels, ask: where are retail stops clustered? That is where price will go to fuel the institutional move.",
        commonMistake: "Placing stops where everyone else places stops. If your stop is at the same level as 10,000 other traders, it will be hunted.",
        status: "locked",
      },
    ],
    caseStudies: [
      {
        title: "The Stop Hunt Engine",
        scenario: "D1 shows a clear support at 1.0850 with a visible cluster of equal lows. Every retail trader has their stop just below at 1.0840.",
        lesson: "Price dipped to 1.0835, collected all the stops (selling pressure from stop-outs), then reversed violently. The stop hunt was the fuel for the move up.",
        outcome: "Traders who understood the meta-game had limit buy orders at 1.0835. They entered exactly where everyone else was stopped out.",
      },
    ],
    progressPct: 0,
    lessonsCompleted: 0,
    totalLessons: 15,
  },
]

/* ── Status Badge ── */
function StatusBadge({ status }: { status: "mastered" | "practicing" | "introduced" | "locked" }) {
  const config = {
    mastered: { label: "MASTERED", color: "#10b981" },
    practicing: { label: "PRACTICING", color: "#f59e0b" },
    introduced: { label: "INTRODUCED", color: "#06b6d4" },
    locked: { label: "LOCKED", color: "#52525b" },
  }
  const c = config[status]
  return (
    <span className="text-[6px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
      style={{ color: `${c.color}80`, backgroundColor: `${c.color}08`, border: `1px solid ${c.color}15` }}>
      {c.label}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN CONSOLE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export function CopilotMentorConsole() {
  const [moduleIdx, setModuleIdx] = useState(0)
  const [expandedTeaching, setExpandedTeaching] = useState<string | null>(null)
  const [showCaseStudy, setShowCaseStudy] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const mod = MODULES[moduleIdx]

  const goToModule = useCallback((idx: number) => {
    setModuleIdx(((idx % MODULES.length) + MODULES.length) % MODULES.length)
    setExpandedTeaching(null)
    setShowCaseStudy(false)
  }, [])

  return (
    <div className="relative flex flex-col h-full bg-transparent">
      <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 scrollbar-terminal">

        {/* ── Mentor Guide & Tutorial ── */}
        <MentorGuideAndTutorial />

        {/* ── Module Navigation Bar ── */}
        <div className="sticky top-0 z-20 px-3 pt-3 pb-2"
          style={{ background: "linear-gradient(180deg, rgba(12,14,22,0.98) 0%, rgba(12,14,22,0.92) 80%, transparent 100%)" }}>

          <div className="flex items-center gap-1">
            <button
              onClick={() => goToModule(moduleIdx - 1)}
              className="w-6 h-6 flex items-center justify-center text-white/15 hover:text-white/40 transition-colors shrink-0"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <div className="flex-1 flex items-center justify-center gap-1.5">
              {MODULES.map((m, i) => {
                const isActive = i === moduleIdx
                return (
                  <button
                    key={m.id}
                    onClick={() => goToModule(i)}
                    className="group flex flex-col items-center gap-1 shrink-0 py-1 px-1"
                  >
                    <div
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: isActive ? 20 : 6,
                        height: 6,
                        backgroundColor: isActive ? m.color : `${m.color}25`,
                        boxShadow: isActive ? `0 0 10px ${m.color}40` : "none",
                      }}
                    />
                    <span
                      className="text-[6px] font-mono font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap"
                      style={{
                        color: isActive ? m.color : "rgba(255,255,255,0.12)",
                        opacity: isActive ? 1 : 0.8,
                      }}
                    >
                      {isActive ? m.label : ""}
                    </span>
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => goToModule(moduleIdx + 1)}
              className="w-6 h-6 flex items-center justify-center text-white/15 hover:text-white/40 transition-colors shrink-0"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Case study toggle */}
            <button
              onClick={() => setShowCaseStudy(!showCaseStudy)}
              className={`ml-1 flex items-center gap-1 px-2 py-1 rounded-md border text-[7px] font-mono font-black uppercase tracking-wider transition-all shrink-0 ${
                showCaseStudy
                  ? "border-amber-400/25 bg-amber-400/[0.06] text-amber-400/70"
                  : "border-white/[0.04] bg-white/[0.01] text-white/20 hover:border-white/[0.08] hover:text-white/35"
              }`}
            >
              <BookOpen className="w-2.5 h-2.5" />
              {showCaseStudy ? "CASE" : "TEACH"}
            </button>
          </div>

          {/* Module identity */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <motion.div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: mod.color }}
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <motion.div className="absolute inset-0 w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: mod.color }}
                  animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>

              <motion.span className="text-[11px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: `${mod.color}10`,
                  color: `${mod.color}90`,
                  border: `1px solid ${mod.color}20`,
                }}
                animate={{ borderColor: [`${mod.color}20`, `${mod.color}45`, `${mod.color}20`] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                MODULE {mod.grade}
              </motion.span>

              <span className="text-[12px] font-mono font-black uppercase tracking-wider"
                style={{ color: mod.color }}>
                {mod.label}
              </span>
            </div>

            <span className="text-[8px] font-mono text-white/15 tabular-nums">
              {moduleIdx + 1} / {MODULES.length}
            </span>
          </div>

          <p className="text-[9px] font-mono text-white/25 leading-relaxed mt-1.5 max-w-[500px]">
            {mod.description}
          </p>

          {/* Progress bar */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1 bg-white/[0.04] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: `${mod.color}60` }}
                initial={{ width: 0 }}
                animate={{ width: `${mod.progressPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <span className="text-[7px] font-mono text-white/20 tabular-nums shrink-0">
              {mod.lessonsCompleted}/{mod.totalLessons}
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${mod.id}-${showCaseStudy}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {showCaseStudy ? (
              /* ═══ CASE STUDY VIEW ═══ */
              <div className="px-3 pb-4">
                {mod.caseStudies.map((cs, i) => (
                  <div key={i} className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-3 h-3" style={{ color: `${mod.color}60` }} />
                      <span className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-wider">{cs.title}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="px-3 py-2 bg-white/[0.01] border-l-2" style={{ borderColor: `${mod.color}30` }}>
                        <div className="text-[7px] font-mono text-white/20 uppercase tracking-wider mb-1">Scenario</div>
                        <p className="text-[9px] font-mono text-white/40 leading-relaxed">{cs.scenario}</p>
                      </div>
                      <div className="px-3 py-2 bg-white/[0.01] border-l-2 border-amber-400/30">
                        <div className="text-[7px] font-mono text-amber-400/40 uppercase tracking-wider mb-1">Lesson</div>
                        <p className="text-[9px] font-mono text-white/40 leading-relaxed">{cs.lesson}</p>
                      </div>
                      <div className="px-3 py-2 bg-white/[0.01] border-l-2 border-emerald-400/30">
                        <div className="text-[7px] font-mono text-emerald-400/40 uppercase tracking-wider mb-1">Outcome</div>
                        <p className="text-[9px] font-mono text-white/40 leading-relaxed">{cs.outcome}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* ═══ TEACHINGS VIEW ═══ */
              <div className="px-3 pb-4">
                <div className="space-y-[2px]">
                  {mod.teachings.map((t) => {
                    const isExpanded = expandedTeaching === t.id
                    const isLocked = t.status === "locked"

                    return (
                      <div key={t.id}>
                        <button
                          onClick={() => !isLocked && setExpandedTeaching(prev => prev === t.id ? null : t.id)}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 transition-all group ${
                            isLocked
                              ? "bg-white/[0.005] opacity-40 cursor-not-allowed"
                              : "bg-white/[0.01] hover:bg-white/[0.03] cursor-pointer"
                          }`}
                        >
                          <div className="w-5 h-5 flex items-center justify-center border border-white/[0.06] shrink-0">
                            <span className="text-[7px] font-mono font-bold" style={{ color: `${mod.color}60` }}>
                              {t.category.charAt(0)}
                            </span>
                          </div>

                          <div className="flex-1 text-left">
                            <span className="text-[9px] font-mono font-bold text-white/40 group-hover:text-white/60 transition-colors">
                              {t.title}
                            </span>
                          </div>

                          <StatusBadge status={t.status} />

                          <div className="w-4 h-4 flex items-center justify-center text-white/15 group-hover:text-white/30 transition-colors">
                            <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                          </div>
                        </button>

                        {isExpanded && !isLocked && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 py-2.5 ml-4 border-l border-white/[0.04] space-y-2">
                              <div className="px-2 py-1.5 bg-white/[0.01]">
                                <div className="text-[7px] font-mono uppercase tracking-wider mb-1" style={{ color: `${mod.color}50` }}>Insight</div>
                                <p className="text-[8px] font-mono text-white/35 leading-relaxed">{t.insight}</p>
                              </div>
                              <div className="px-2 py-1.5 bg-white/[0.01]">
                                <div className="text-[7px] font-mono text-emerald-400/40 uppercase tracking-wider mb-1">Application</div>
                                <p className="text-[8px] font-mono text-white/35 leading-relaxed">{t.application}</p>
                              </div>
                              <div className="px-2 py-1.5 bg-white/[0.01]">
                                <div className="flex items-center gap-1 mb-1">
                                  <AlertTriangle className="w-2 h-2 text-red-400/40" />
                                  <span className="text-[7px] font-mono text-red-400/40 uppercase tracking-wider">Common Mistake</span>
                                </div>
                                <p className="text-[8px] font-mono text-white/35 leading-relaxed">{t.commonMistake}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  )
}
