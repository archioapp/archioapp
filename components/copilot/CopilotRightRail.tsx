"use client"

import { useState, useCallback, useRef, useEffect, lazy, Suspense } from "react"
import { CopilotAnalytics, type CopilotAnalyticsSnapshot } from "@/components/copilot/analytics/CopilotAnalytics"
import { motion, AnimatePresence } from "framer-motion"
import { Settings2, Activity, Target, Brain, Sparkles, Diamond, GraduationCap, ChevronRight } from "lucide-react"
import { MentorDashboardRail } from "@/components/mentor/MentorDashboardRail"
import { useScenarioStore, type TradingScenario } from "@/lib/scenario-store"
import { UserScenarioCard } from "@/components/user-scenario-card"
import { ScenarioEditModal } from "@/components/scenario-edit-modal"

const OnboardingShell = lazy(() =>
  import("@/components/copilot/onboarding/OnboardingShell").then((m) => ({ default: m.OnboardingShell }))
)

/* ═══════════════════════════════════════════════════════════════
   INTELLIGENCE RAIL -- Redesigned Architecture
   
   The rail represents the trader's decision pipeline:
   
   1. OBSERVE  (Live Feed)    -- What is happening right now?
   2. PLAN     (Strategy)     -- What is my plan for this session?
   3. CHECK    (Psychology)   -- Am I in the right state to trade?
   4. ANALYZE  (AI Copilot)   -- What does the machine see?
   5. FOLLOW   (Mentor)       -- What does my mentor's method say?
   6. DECIDE   (Edge)         -- Do I have a real edge right now?
   
   Each layer builds on the one above.
   You don't trade until all layers align.
   ═══════════════════════════════════════════════════════════════ */

interface CopilotRightRailProps {
  executeMode?: boolean
  executeContent?: React.ReactNode
  onExitExecute?: () => void
}

type ViewMode = "activity" | "strategy" | "psychology" | "ai" | "mentor" | "edge"

/* ── Psychological architecture for each rail item ── */
const RAIL_ARCHITECTURE: Record<ViewMode, {
  icon: typeof Activity
  label: string
  shortLabel: string
  phase: string
  phaseNumber: number
  color: string
  colorActive: string
  colorBg: string
  colorBorder: string
  colorDot: string
  colorGlow: string
  groupClass: string
  question: string
  purpose: string
  whenToUse: string
  warning: string
  flow: string
}> = {
  activity: {
    icon: Activity,
    label: "Live Feed",
    shortLabel: "LIVE",
    phase: "OBSERVE",
    phaseNumber: 1,
    color: "text-white/25",
    colorActive: "text-emerald-400",
    colorBg: "bg-emerald-400/[0.06]",
    colorBorder: "border-emerald-400/[0.12]",
    colorDot: "bg-emerald-400",
    colorGlow: "bg-emerald-400/40",
    groupClass: "group/live",
    question: "What is happening right now?",
    purpose: "Raw market pulse. Session state, price action events, volume shifts, and news triggers as they happen. This is your situational awareness layer -- observe before you plan.",
    whenToUse: "Open this first every session. Before any analysis, know what the market did overnight and what is moving now.",
    warning: "Watching the feed without a plan creates impulse trades. Observe, then move to Strategy.",
    flow: "After observing, move to Strategy to build your plan.",
  },
  strategy: {
    icon: Target,
    label: "Strategy OS",
    shortLabel: "STRAT",
    phase: "PLAN",
    phaseNumber: 2,
    color: "text-white/20",
    colorActive: "text-cyan-400",
    colorBg: "bg-cyan-400/[0.06]",
    colorBorder: "border-cyan-400/20",
    colorDot: "bg-cyan-400",
    colorGlow: "bg-cyan-400/40",
    groupClass: "group/strat",
    question: "What is my plan for this session?",
    purpose: "Your structured trade plan. Confluence scoring, entry/exit rules, execution checklists, and scenario mapping. This turns observation into intention -- you define WHAT you are looking for before you look.",
    whenToUse: "After checking the Live Feed. Write your thesis, define your levels, set your scenarios. Never enter a trade without a plan written here first.",
    warning: "A plan without psychological readiness is dangerous. Check your state next.",
    flow: "Plan is set. Now check if YOU are ready to execute it.",
  },
  psychology: {
    icon: Brain,
    label: "Psychology",
    shortLabel: "PSYCH",
    phase: "CHECK",
    phaseNumber: 3,
    color: "text-white/20",
    colorActive: "text-pink-400",
    colorBg: "bg-pink-400/[0.06]",
    colorBorder: "border-pink-400/20",
    colorDot: "bg-pink-400",
    colorGlow: "bg-pink-400/40",
    groupClass: "group/psych",
    question: "Am I in the right state to trade?",
    purpose: "Your inner game dashboard. Emotional state tracking, cognitive bias detection, discipline scoring, fatigue monitoring, and tilt warnings. The market doesn't care about your feelings -- but your P&L does.",
    whenToUse: "Before every trade. After every loss. When you feel the urge to revenge trade or overtrade. This is your mirror -- it shows you what you don't want to see.",
    warning: "Red psychology score = sit out. No strategy survives a tilted mind. Protect your capital from yourself.",
    flow: "If green, proceed to AI analysis. If red, step away.",
  },
  ai: {
    icon: Sparkles,
    label: "AI Copilot",
    shortLabel: "AI",
    phase: "ANALYZE",
    phaseNumber: 4,
    color: "text-white/20",
    colorActive: "text-purple-300",
    colorBg: "bg-purple-400/[0.07]",
    colorBorder: "border-purple-400/20",
    colorDot: "bg-purple-400",
    colorGlow: "bg-purple-400/40",
    groupClass: "group/ai",
    question: "What does the machine see?",
    purpose: "Neutral AI analysis with no method bias. Pattern recognition, statistical edge scoring, behavioral pattern detection, and intelligent recommendations. The AI sees what your emotions hide -- use it to validate or challenge your thesis.",
    whenToUse: "After your plan is set AND your psychology is green. Ask the AI to challenge your thesis. If you agree with the plan, the AI confirms. If you disagree, listen to why.",
    warning: "AI is a tool, not a decision maker. It validates -- you decide.",
    flow: "AI confirms your thesis? Check what your mentor's method says.",
  },
  mentor: {
    icon: GraduationCap,
    label: "Mentor Dashboard",
    shortLabel: "MENTOR",
    phase: "FOLLOW",
    phaseNumber: 5,
    color: "text-white/20",
    colorActive: "text-violet-400",
    colorBg: "bg-violet-400/[0.06]",
    colorBorder: "border-violet-400/[0.08]",
    colorDot: "bg-violet-400",
    colorGlow: "bg-violet-400/40",
    groupClass: "group/mentor",
    question: "What does my mentor's method say?",
    purpose: "Your mentor's live operating method as an interactive decision system. Session gates, entry models, conditions checklists, and real-time bias. This is not education -- this is execution guidance from someone who has walked the path.",
    whenToUse: "When your own analysis aligns AND you want to validate against a proven method. The mentor's dashboard tells you if NOW is the right time according to their system.",
    warning: "Following blindly is not learning. Use this to develop your own eye, not to replace it.",
    flow: "All layers aligned? You have an edge. Check the Edge Tracker.",
  },
  edge: {
    icon: Diamond,
    label: "Edge Tracker",
    shortLabel: "EDGE",
    phase: "DECIDE",
    phaseNumber: 6,
    color: "text-white/20",
    colorActive: "text-amber-400",
    colorBg: "bg-amber-400/[0.06]",
    colorBorder: "border-amber-400/20",
    colorDot: "bg-amber-400",
    colorGlow: "bg-amber-400/40",
    groupClass: "group/edge",
    question: "Do I have a real edge right now?",
    purpose: "The convergence layer. Scores your setup across strategy, psychology, AI analysis, and mentor alignment. When multiple layers agree, your edge is real. When they conflict, your edge is imagined. This is the final gate before execution.",
    whenToUse: "Before pulling the trigger. This is your last checkpoint. If the edge score is high, execute with confidence. If it is low, wait -- the next setup is coming.",
    warning: "A high edge score is not a guarantee. It means the odds are in your favor. Risk management still applies. Always.",
    flow: "Edge confirmed? Execute your plan. Edge missing? Wait for the next one.",
  },
}

/* ── Mock positions for showcase ── */
interface MockPosition {
  id: string
  pair: string
  type: "market" | "limit" | "stop"
  status: "live" | "pending" | "partial"
  direction: "buy" | "sell"
  entry: string
  sl: string
  tp: string
  lots: string
  pnl: string
  pnlPips: string
  openTime: string
  broker: string
}

const MOCK_POSITIONS: MockPosition[] = [
  { id: "pos_1", pair: "USDJPY", type: "market", status: "live", direction: "sell", entry: "149.823", sl: "150.200", tp: "148.900", lots: "0.50", pnl: "+$234.50", pnlPips: "+38.2", openTime: "2h 14m", broker: "IC Markets" },
  { id: "pos_2", pair: "EURUSD", type: "limit", status: "pending", direction: "buy", entry: "1.08200", sl: "1.07800", tp: "1.09100", lots: "1.00", pnl: "--", pnlPips: "--", openTime: "Waiting", broker: "Pepperstone" },
  { id: "pos_3", pair: "GBPUSD", type: "stop", status: "pending", direction: "buy", entry: "1.27450", sl: "1.27000", tp: "1.28200", lots: "0.25", pnl: "--", pnlPips: "--", openTime: "Waiting", broker: "IC Markets" },
]

/* ── Entry Dot -- single position dot in vertical strip, hovers LEFT ── */
function EntryDot({ position, index }: { position: MockPosition; index: number }) {
  const [hovered, setHovered] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isBuy = position.direction === "buy"
  const isLive = position.status === "live"

  const dotColor = isLive
    ? isBuy ? "bg-emerald-400" : "bg-red-400"
    : position.type === "limit" ? "bg-amber-400" : "bg-blue-400"
  const accentColor = isLive
    ? isBuy ? "from-emerald-500/[0.06]" : "from-red-500/[0.06]"
    : position.type === "limit" ? "from-amber-500/[0.06]" : "from-blue-500/[0.06]"
  const pnlColor = position.pnl.startsWith("+") ? "text-emerald-400" : position.pnl.startsWith("-") ? "text-red-400" : "text-zinc-400"

  const show = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setHovered(true)
  }, [])
  const hide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setHovered(false), 350)
  }, [])

  useEffect(() => () => { if (hideTimer.current) clearTimeout(hideTimer.current) }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25, delay: index * 0.06 }}
      className="relative flex items-center justify-center w-full py-1"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <div className="relative cursor-pointer group/dot">
        <motion.div
          animate={isLive ? { opacity: [0.5, 1, 0.5], scale: [1, 1.25, 1] } : { opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: isLive ? 1.5 : 3, ease: "easeInOut" }}
          className={`w-2.5 h-2.5 rounded-full ${dotColor} transition-transform duration-200 group-hover/dot:scale-150`}
        />
        <div className={`absolute -inset-1 rounded-full border border-transparent group-hover/dot:border-current ${
          isLive ? (isBuy ? "text-emerald-400/20" : "text-red-400/20") : "text-white/10"
        } transition-all duration-200 scale-0 group-hover/dot:scale-100`} />
      </div>

      {hovered && (
        <div className="absolute right-full top-1/2 -translate-y-1/2 w-4 h-16 z-[60]"
          onMouseEnter={show} onMouseLeave={hide} />
      )}

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 8, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 z-[62] w-[280px]"
            onMouseEnter={show} onMouseLeave={hide}
          >
            <div className="rounded-2xl bg-[#0a0b10]/92 backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden border border-white/[0.04]">
              <motion.div
                animate={{ opacity: [0.02, 0.07, 0.02] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute inset-0 bg-gradient-to-br ${accentColor} to-transparent pointer-events-none rounded-2xl`}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none w-1/3"
              />

              <div className="relative px-4 pt-3 pb-2 flex items-center gap-2.5">
                <motion.div
                  animate={isLive ? { opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotColor}`}
                />
                <span className="text-[13px] font-bold text-white/85 font-mono">{position.pair}</span>
                <span className={`text-[8px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-md ${
                  isBuy ? "bg-emerald-500/[0.08] text-emerald-400/80" : "bg-red-500/[0.08] text-red-400/80"
                }`}>{position.direction}</span>
                <span className="text-[8px] text-white/20 font-mono uppercase ml-auto">
                  {position.type === "market" ? "MKT" : position.type === "limit" ? "LMT" : "STP"}
                </span>
              </div>

              <div className="px-4 py-2">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Entry", value: position.entry, color: "text-white/65" },
                    { label: "SL", value: position.sl, color: "text-red-400/60" },
                    { label: "TP", value: position.tp, color: "text-emerald-400/60" },
                  ].map((item) => (
                    <div key={item.label}>
                      <span className="text-[7px] text-white/20 uppercase tracking-[0.12em] font-medium block mb-0.5">{item.label}</span>
                      <span className={`text-[11px] font-mono font-semibold tabular-nums ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent mx-3" />

              <div className="px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-[14px] font-mono font-bold tabular-nums ${pnlColor}`}>{position.pnl}</span>
                  {position.pnlPips !== "--" && (
                    <span className={`text-[9px] font-mono opacity-50 ${pnlColor}`}>{position.pnlPips}p</span>
                  )}
                </div>
                <span className="text-[9px] font-mono text-white/20">{position.lots} lots</span>
              </div>

              <div className="px-4 pb-3 pt-0.5 flex items-center justify-between">
                <span className="text-[8px] text-white/12 font-mono">{position.openTime}</span>
                <span className="text-[8px] text-white/12 font-mono">{position.broker}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Scenario Dot -- single scenario dot in vertical strip, hovers LEFT ── */
function ScenarioDot({ scenario, index }: { scenario: TradingScenario; index: number }) {
  const [hovered, setHovered] = useState(false)
  const [editing, setEditing] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isBuy = scenario.position === "Buy Position"

  const show = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setHovered(true)
  }, [])
  const hide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setHovered(false), 350)
  }, [])

  useEffect(() => () => { if (hideTimer.current) clearTimeout(hideTimer.current) }, [])

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: -4 }}
        transition={{ type: "spring", stiffness: 400, damping: 25, delay: index * 0.06 }}
        className="relative flex items-center justify-center w-full py-1"
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        <motion.button
          onClick={() => setEditing(true)}
          whileHover={{ scale: 1.5 }}
          className="relative cursor-pointer"
        >
          <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className={`w-2 h-2 rounded-full border ${isBuy ? "bg-emerald-400/50 border-emerald-400/30" : "bg-red-400/50 border-red-400/30"}`}
          />
        </motion.button>

        {hovered && (
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-4 h-16 z-[60]"
            onMouseEnter={show} onMouseLeave={hide} />
        )}

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: 8, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 z-[62] drop-shadow-xl w-max max-w-[380px]"
              onMouseEnter={show} onMouseLeave={hide}
            >
              <UserScenarioCard scenario={scenario} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {editing && (
        <ScenarioEditModal
          isOpen={editing}
          scenario={scenario}
          onClose={() => setEditing(false)}
          onSave={() => setEditing(false)}
          onDelete={() => setEditing(false)}
        />
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════
   RICH TOOLTIP -- Full psychological explanation on hover
   ═══════════════════════════════════════════════════════════════ */
function RailTooltip({ config }: { config: typeof RAIL_ARCHITECTURE[ViewMode] }) {
  return (
    <div className="w-[260px] rounded-xl bg-[#07080c]/[0.98] backdrop-blur-2xl border border-white/[0.06] shadow-2xl shadow-black/70 overflow-hidden">
      {/* Header */}
      <div className="px-3.5 pt-3 pb-2 border-b border-white/[0.04]">
        <div className="flex items-center gap-2 mb-1.5">
          <div className={`w-2 h-2 rounded-full ${config.colorDot}`} />
          <span className={`text-[11px] font-bold ${config.colorActive}`}>{config.label}</span>
          <span className="text-[8px] font-mono text-white/20 ml-auto px-1.5 py-0.5 rounded bg-white/[0.04]">
            PHASE {config.phaseNumber}
          </span>
        </div>
        <p className={`text-[10px] font-semibold ${config.colorActive} opacity-70 italic`}>
          {`"${config.question}"`}
        </p>
      </div>
      
      {/* Purpose */}
      <div className="px-3.5 py-2.5">
        <p className="text-[7px] font-mono text-white/25 uppercase tracking-[0.15em] mb-1">What this does</p>
        <p className="text-[9.5px] text-white/45 leading-[1.6]">{config.purpose}</p>
      </div>
      
      {/* When to use */}
      <div className="px-3.5 py-2 border-t border-white/[0.03]">
        <p className="text-[7px] font-mono text-emerald-400/40 uppercase tracking-[0.15em] mb-1">When to use</p>
        <p className="text-[9px] text-emerald-400/30 leading-[1.5]">{config.whenToUse}</p>
      </div>
      
      {/* Warning */}
      <div className="px-3.5 py-2 border-t border-white/[0.03] bg-red-500/[0.015]">
        <p className="text-[7px] font-mono text-red-400/40 uppercase tracking-[0.15em] mb-1">Watch out</p>
        <p className="text-[9px] text-red-400/25 leading-[1.5]">{config.warning}</p>
      </div>
      
      {/* Flow arrow */}
      <div className="px-3.5 py-2 border-t border-white/[0.04] flex items-center gap-2">
        <ChevronRight className={`w-3 h-3 ${config.colorActive} opacity-40`} />
        <p className="text-[8.5px] text-white/25 leading-snug">{config.flow}</p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   RAIL NAV BUTTON -- Reusable icon button with rich tooltip
   ═══════════════════════════════════════════════════════════════ */
function RailNavButton({ viewKey, activeView, onClick, railOpen }: {
  viewKey: ViewMode
  activeView: ViewMode
  onClick: () => void
  railOpen: boolean
}) {
  const config = RAIL_ARCHITECTURE[viewKey]
  const isActive = activeView === viewKey
  const Icon = config.icon

  return (
    <div className={`relative ${config.groupClass} transition-opacity duration-200 ${railOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <button
        onClick={onClick}
        className="relative w-full flex flex-col items-center justify-center py-2.5 gap-1 transition-all duration-300"
      >
        {isActive && (
          <motion.div layoutId="rail-highlight"
            className={`absolute inset-x-0 inset-y-0 ${config.colorBg} border-l-2 ${config.colorBorder}`}
            transition={{ type: "spring", stiffness: 400, damping: 30 }} />
        )}
        <div className="relative z-10">
          <Icon className={`w-[18px] h-[18px] transition-colors duration-300 ${
            isActive ? config.colorActive : `${config.color} ${config.groupClass.replace("group/", "group-hover/")}:text-white/50`
          }`} strokeWidth={isActive ? 2 : 1.6} />
          {isActive && (
            <motion.div className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${config.colorDot}`}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
          )}
        </div>
        <div className="flex items-center gap-0.5 relative z-10">
          <span className={`text-[7px] font-mono uppercase tracking-[0.08em] font-bold transition-colors duration-300 ${
            isActive ? `${config.colorActive} opacity-90` : `text-white/18 ${config.groupClass.replace("group/", "group-hover/")}:text-white/35`
          }`}>{config.shortLabel}</span>
          {isActive && (
            <span className={`text-[6px] font-mono ${config.colorActive} opacity-30`}>{config.phaseNumber}</span>
          )}
        </div>
      </button>
      
      {/* Rich psychological tooltip LEFT */}
      <div className={`absolute right-full top-1/2 -translate-y-1/2 mr-2.5 pointer-events-none opacity-0 ${config.groupClass.replace("group/", "group-hover/")}:opacity-100 transition-all duration-200 ${config.groupClass.replace("group/", "group-hover/")}:translate-x-0 translate-x-1 z-50`}>
        <RailTooltip config={config} />
      </div>
    </div>
  )
}


export function CopilotRightRail({ executeMode, executeContent, onExitExecute }: CopilotRightRailProps) {
  const [activeView, setActiveView] = useState<ViewMode>("activity")
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [simulatorSnapshot] = useState<CopilotAnalyticsSnapshot | null>(null)
  const [tradesExpanded, setTradesExpanded] = useState(false)
  const { scenarios } = useScenarioStore()

  /* ── Auto-hide rail logic ── */
  const [railOpen, setRailOpen] = useState(false)
  const railOpenTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const railCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openRail = useCallback(() => {
    if (railCloseTimer.current) { clearTimeout(railCloseTimer.current); railCloseTimer.current = null }
    if (railOpen) return
    railOpenTimer.current = setTimeout(() => setRailOpen(true), 280)
  }, [railOpen])

  const closeRail = useCallback(() => {
    if (railOpenTimer.current) { clearTimeout(railOpenTimer.current); railOpenTimer.current = null }
    railCloseTimer.current = setTimeout(() => setRailOpen(false), 400)
  }, [])

  const handleNavClick = useCallback((view: ViewMode) => {
    setActiveView(activeView === view ? "activity" : view)
    if (railCloseTimer.current) clearTimeout(railCloseTimer.current)
    railCloseTimer.current = setTimeout(() => setRailOpen(false), 600)
  }, [activeView])

  useEffect(() => {
    return () => {
      if (railOpenTimer.current) clearTimeout(railOpenTimer.current)
      if (railCloseTimer.current) clearTimeout(railCloseTimer.current)
    }
  }, [])

  const handleOnboardingComplete = useCallback(() => {
    setShowOnboarding(false)
  }, [])

  const totalEntries = MOCK_POSITIONS.length + scenarios.length
  const activeConfig = RAIL_ARCHITECTURE[activeView]

  /* Pipeline phase positions for the glow indicator */
  const phasePositions: Record<ViewMode, string> = {
    activity: "8%",
    strategy: "35%",
    psychology: "45%",
    ai: "57%",
    mentor: "70%",
    edge: "83%",
  }

  return (
    <div className="absolute inset-0 flex">

      {/* ══════════════════════════════════════════════
          DECISION PIPELINE RAIL -- Auto-hide
          6 phases of the trading decision process.
          ══════════════════════════════════════════════ */}
      {!executeMode && (
        <div
          className="flex-shrink-0 relative z-10 overflow-visible"
          onMouseEnter={openRail}
          onMouseLeave={closeRail}
        >
          <motion.div
            initial={false}
            animate={{
              width: railOpen ? 54 : 6,
              opacity: 1,
            }}
            transition={{
              width: { type: "spring", stiffness: 500, damping: 35 },
              opacity: { duration: 0.15 },
            }}
            className="h-full flex flex-col items-center relative overflow-y-auto overflow-x-hidden"
            style={{ scrollbarWidth: "none" }}
          >
          {/* Collapsed state: subtle trigger strip */}
          <AnimatePresence>
            {!railOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 z-20 cursor-pointer"
              >
                <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-400/10 via-purple-400/15 to-amber-400/10" />
                <motion.div
                  className={`absolute right-[1px] w-1 h-8 rounded-l-full ${activeConfig.colorGlow}`}
                  animate={{ top: phasePositions[activeView], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ top: { type: "spring", stiffness: 300, damping: 25 }, opacity: { repeat: Infinity, duration: 2 } }}
                />
                <motion.div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-16 rounded-l bg-white/5"
                  animate={{ opacity: [0.02, 0.08, 0.02] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Background */}
          <div className={`absolute inset-0 bg-[#08090d]/80 backdrop-blur-sm border-r transition-colors duration-300 ${railOpen ? "border-white/[0.05]" : "border-transparent"}`} />

          {/* ─── PHASE 1: OBSERVE (Live Feed) ─── */}
          <div className={`relative w-full z-10 ${RAIL_ARCHITECTURE.activity.groupClass}`}>
            <RailNavButton viewKey="activity" activeView={activeView} onClick={() => handleNavClick("activity")} railOpen={railOpen} />
          </div>

          {/* ─── TRADES COUNT ─── */}
          <div className={`relative z-10 w-full flex flex-col items-center transition-opacity duration-200 ${railOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <button
              onClick={() => setTradesExpanded(!tradesExpanded)}
              className="relative flex flex-col items-center py-1.5 cursor-pointer group/trades w-full"
            >
              <div className="w-7 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
              <div className={`relative mt-1 mb-1 w-5 h-5 rounded-md flex items-center justify-center transition-all duration-300 ${
                tradesExpanded
                  ? "bg-emerald-400/[0.1] border border-emerald-400/20"
                  : "bg-white/[0.02] border border-white/[0.05] group-hover/trades:border-white/[0.1]"
              }`}>
                <span className={`text-[9px] font-mono font-bold tabular-nums transition-colors ${
                  tradesExpanded ? "text-emerald-400/90" : "text-white/30 group-hover/trades:text-white/50"
                }`}>{totalEntries}</span>
              </div>
              <div className="w-7 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
            </button>
            <AnimatePresence>
              {tradesExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  className="w-full flex flex-col items-center overflow-hidden"
                >
                  {MOCK_POSITIONS.map((pos, i) => (
                    <EntryDot key={pos.id} position={pos} index={i} />
                  ))}
                  {scenarios.length > 0 && (
                    <div className="w-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-0.5" />
                  )}
                  {scenarios.map((s, i) => (
                    <ScenarioDot key={s.id} scenario={s} index={MOCK_POSITIONS.length + i} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─── FLOW LINE: Observe -> Plan/Check ─── */}
          <div className={`flex-1 flex flex-col items-center justify-center z-10 min-h-[12px] transition-opacity duration-200 ${railOpen ? "opacity-100" : "opacity-0"}`}>
            <div className="w-px h-full bg-gradient-to-b from-emerald-400/8 via-white/[0.06] to-cyan-400/8" />
          </div>

          {/* ═══════════════════════════════════════════
              PHASES 2+3: PLAN + CHECK (Human Layer)
              Strategy and Psychology are grouped because
              they represent the HUMAN side of trading --
              your plan and your state. Both must be green
              before you proceed to machine analysis.
              ═══════════════════════════════════════════ */}
          <div className={`relative w-full z-10 px-1 transition-opacity duration-200 ${railOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className="rounded-lg border border-white/[0.05] bg-white/[0.012] overflow-hidden">
              {/* Phase label */}
              <div className={`flex items-center justify-center py-1 transition-opacity duration-200 ${railOpen ? "opacity-100" : "opacity-0"}`}>
                <span className="text-[6px] font-mono text-white/15 uppercase tracking-[0.2em]">Human</span>
              </div>

              <RailNavButton viewKey="strategy" activeView={activeView} onClick={() => handleNavClick("strategy")} railOpen={railOpen} />

              {/* Bridge line */}
              <div className="flex items-center justify-center relative z-10">
                <div className="w-5 h-px bg-gradient-to-r from-cyan-400/10 via-white/[0.06] to-pink-400/10" />
              </div>

              <RailNavButton viewKey="psychology" activeView={activeView} onClick={() => handleNavClick("psychology")} railOpen={railOpen} />
            </div>
          </div>

          {/* ─── Layer gap ─── */}
          <div className={`flex flex-col items-center py-2 z-10 transition-opacity duration-200 ${railOpen ? "opacity-100" : "opacity-0"}`}>
            <div className="w-5 h-px bg-white/[0.04]" />
          </div>

          {/* ═══════════════════════════════════════════
              PHASE 4: ANALYZE (AI Layer)
              Machine intelligence -- no emotion, no bias.
              ═══════════════════════════════════════════ */}
          <div className={`relative w-full z-10 px-1 ${RAIL_ARCHITECTURE.ai.groupClass} transition-opacity duration-200 ${railOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className="rounded-lg border border-purple-400/[0.08] bg-purple-500/[0.02] overflow-hidden">
              <RailNavButton viewKey="ai" activeView={activeView} onClick={() => handleNavClick("ai")} railOpen={railOpen} />
            </div>
          </div>

          {/* ─── Layer gap ─── */}
          <div className={`flex flex-col items-center py-1.5 z-10 transition-opacity duration-200 ${railOpen ? "opacity-100" : "opacity-0"}`}>
            <div className="w-5 h-px bg-white/[0.04]" />
          </div>

          {/* ═══════════════════════════════════════════
              PHASE 5: FOLLOW (Mentor Layer)
              The mentor's method as a live system.
              ═══════════════════════════════════════════ */}
          <div className={`relative w-full z-10 px-1 ${RAIL_ARCHITECTURE.mentor.groupClass} transition-opacity duration-200 ${railOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className="rounded-lg border border-violet-400/[0.08] bg-violet-500/[0.02] overflow-hidden">
              <RailNavButton viewKey="mentor" activeView={activeView} onClick={() => handleNavClick("mentor")} railOpen={railOpen} />
            </div>
          </div>

          {/* ─── Layer gap ─── */}
          <div className={`flex flex-col items-center py-1.5 z-10 transition-opacity duration-200 ${railOpen ? "opacity-100" : "opacity-0"}`}>
            <div className="w-5 h-px bg-white/[0.04]" />
          </div>

          {/* ═══════════════════════════════════════════
              PHASE 6: DECIDE (Convergence Layer)
              All layers converge here. Edge or no edge.
              ═══════════════════════════════════════════ */}
          <div className={`relative w-full z-10 px-1 ${RAIL_ARCHITECTURE.edge.groupClass} transition-opacity duration-200 ${railOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className="rounded-lg border border-amber-400/[0.06] bg-amber-500/[0.015] overflow-hidden">
              <RailNavButton viewKey="edge" activeView={activeView} onClick={() => handleNavClick("edge")} railOpen={railOpen} />
            </div>
          </div>

          {/* Settings -- pushed to bottom */}
          <div className="flex-1 min-h-0 z-10" />
          <button
            onClick={() => { setShowOnboarding(true); setRailOpen(false) }}
            className={`p-2.5 mb-2 rounded-lg hover:bg-white/[0.04] text-white/25 hover:text-white/50 transition-all z-10 ${railOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            title="Configure Profile"
          >
            <Settings2 className="w-4 h-4" strokeWidth={1.6} />
          </button>
          </motion.div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          MAIN CONTENT AREA
          ══════════════════════════════════════════════ */}
      <div className="flex-1 min-w-0 flex flex-col relative">
        
        {/* View indicator with phase context */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-1.5 border-b border-white/[0.03]">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className={`w-1.5 h-1.5 rounded-full ${activeConfig.colorDot}`}
            />
            <span className={`text-[9px] font-mono uppercase tracking-[0.15em] font-bold ${activeConfig.colorActive} opacity-60`}>
              {activeConfig.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-[7px] font-mono uppercase tracking-[0.12em] ${activeConfig.colorActive} opacity-25`}>
              {activeConfig.phase}
            </span>
            <span className={`text-[8px] font-mono ${activeConfig.colorActive} opacity-15`}>
              {activeConfig.phaseNumber}/6
            </span>
          </div>
        </div>

        <AnimatePresence>
          {showOnboarding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-50"
            >
              <Suspense fallback={<div className="absolute inset-0 bg-[#050508] flex items-center justify-center"><div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" /></div>}>
                <OnboardingShell onComplete={handleOnboardingComplete} />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 min-h-0 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {executeMode ? (
              <motion.div
                key="execute-content"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 40, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-0"
              >
                {executeContent}
              </motion.div>
            ) : (
              <motion.div
                key={`view-${activeView}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                className="absolute inset-0"
              >
                {activeView === "mentor" ? (
                  <MentorDashboardRail />
                ) : (
                  <CopilotAnalytics activeTab={activeView as "activity" | "strategy" | "psychology" | "ai" | "edge"} externalSnapshot={simulatorSnapshot} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-shrink-0 px-3 py-1.5 flex items-center justify-between border-t border-white/[0.03]">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className={`w-1 h-1 rounded-full ${activeConfig.colorDot}`}
            />
            <span className="text-[7px] text-white/20 font-mono tracking-wider">{activeView === "mentor" ? "MENTOR OS" : "CORTEX"}</span>
          </div>
          {/* Pipeline progress dots */}
          <div className="flex items-center gap-1">
            {(Object.keys(RAIL_ARCHITECTURE) as ViewMode[]).map((key) => (
              <div
                key={key}
                className={`w-1 h-1 rounded-full transition-colors duration-300 ${
                  key === activeView ? RAIL_ARCHITECTURE[key].colorDot : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default CopilotRightRail
