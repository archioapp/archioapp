"use client"

// ═══════════════════════════════════════════════════════════════════
// ORDER LAYER PANEL -- Phase 3 (Architecture), 4 (Truth Strip), 5 (Missions)
//
// Layout: Truth Strip -> Gates -> Mission Stack -> Danger Feed
// No tabs. One continuous intelligence surface.
// ═══════════════════════════════════════════════════════════════════

import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield, Lock, TrendingUp, BookOpen, ChevronRight, AlertTriangle,
  Zap, Target, Eye, ArrowRight, Crosshair, Activity, Brain, BarChart3
} from "lucide-react"

import {
  type OrderLayerState,
  type Mission,
  type Gate,
  type DangerSignal,
  type StrategyInput,
  type PsychologyInput,
  type ActivityInput,
  deriveOrderLayerState,
  DIRECTIVE_CONFIG,
  STATE_CONFIG,
  SESSION_MODE_CONFIG,
  CATEGORY_CONFIG,
} from "./order-layer-engine"

// ─── ICON MAP ────────────────────────────────────────────────────

const CategoryIcon = ({ category }: { category: Mission["category"] }) => {
  switch (category) {
    case "stabilize": return <Shield className="w-3 h-3" />
    case "protect": return <Lock className="w-3 h-3" />
    case "optimize": return <TrendingUp className="w-3 h-3" />
    case "learn": return <BookOpen className="w-3 h-3" />
  }
}

const SourceIcon = ({ source }: { source: "strategy" | "psychology" | "activity" }) => {
  switch (source) {
    case "strategy": return <BarChart3 className="w-2.5 h-2.5" />
    case "psychology": return <Brain className="w-2.5 h-2.5" />
    case "activity": return <Activity className="w-2.5 h-2.5" />
  }
}

// ─── PROPS ───────────────────────────────────────────────────────

interface OrderLayerPanelProps {
  strategyInput: StrategyInput
  psychologyInput: PsychologyInput
  activityInput: ActivityInput
  onNavigate: (tab: "strategy" | "psychology" | "activity", section?: string) => void
  onAsk?: (prompt: string) => void
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────

export function OrderLayerPanel({
  strategyInput,
  psychologyInput,
  activityInput,
  onNavigate,
  onAsk,
}: OrderLayerPanelProps) {
  const [expandedMission, setExpandedMission] = useState<string | null>(null)
  const [expandedGate, setExpandedGate] = useState<string | null>(null)
  const [showAllDangers, setShowAllDangers] = useState(false)

  // ── Derive the unified state ──
  const state = useMemo(
    () => deriveOrderLayerState(strategyInput, psychologyInput, activityInput),
    [strategyInput, psychologyInput, activityInput]
  )

  const directiveConfig = DIRECTIVE_CONFIG[state.directive]
  const stateConfig = STATE_CONFIG[state.systemState]
  const modeConfig = SESSION_MODE_CONFIG[state.sessionMode]

  const handleMissionClick = useCallback((mission: Mission) => {
    onNavigate(mission.targetTab, mission.targetSection)
  }, [onNavigate])

  const handleGateResolve = useCallback((gate: Gate) => {
    onNavigate(gate.targetTab, gate.targetSection)
  }, [onNavigate])

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* ═══════════════════════════════════════════════════════════
          TRUTH STRIP -- Phase 4
          Always visible. 2-second comprehension.
          ═══════════════════════════════════════════════════════════ */}
      <TruthStrip state={state} directiveConfig={directiveConfig} stateConfig={stateConfig} modeConfig={modeConfig} />

      {/* ═══════════════════════════════════════════════════════════
          SCROLLABLE INTELLIGENCE -- Phase 3 Architecture
          Gates -> Missions -> Danger Feed
          ═══════════════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto min-h-0" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.06) transparent" }}>

        {/* ── OS Score Bar ── */}
        <OSScoreBar state={state} onNavigate={onNavigate} />

        {/* ── Gates (if any) ── */}
        {state.gates.length > 0 && (
          <GatesSection gates={state.gates} expandedGate={expandedGate} setExpandedGate={setExpandedGate} onResolve={handleGateResolve} />
        )}

        {/* ── Mission Stack -- Phase 5 ── */}
        <MissionStack
          missions={state.missions}
          expandedMission={expandedMission}
          setExpandedMission={setExpandedMission}
          onMissionClick={handleMissionClick}
          onAsk={onAsk}
        />

        {/* ── Danger Feed ── */}
        {state.dangerSignals.length > 0 && (
          <DangerFeed
            signals={state.dangerSignals}
            showAll={showAllDangers}
            setShowAll={setShowAllDangers}
          />
        )}

        {/* Bottom padding */}
        <div className="h-4" />
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TRUTH STRIP -- Phase 4
// ═══════════════════════════════════════════════════════════════════

function TruthStrip({
  state,
  directiveConfig,
  stateConfig,
  modeConfig,
}: {
  state: OrderLayerState
  directiveConfig: (typeof DIRECTIVE_CONFIG)[keyof typeof DIRECTIVE_CONFIG]
  stateConfig: (typeof STATE_CONFIG)[keyof typeof STATE_CONFIG]
  modeConfig: (typeof SESSION_MODE_CONFIG)[keyof typeof SESSION_MODE_CONFIG]
}) {
  return (
    <div className="flex-shrink-0 border-b border-white/[0.04] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ background: `radial-gradient(ellipse at 50% 0%, ${stateConfig.color}, transparent 70%)` }} />

      <div className="relative px-3.5 pt-3 pb-2.5">
        {/* Row 1: Directive + State + Mode */}
        <div className="flex items-center gap-2 mb-2">
          {/* Directive badge */}
          <motion.div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
            style={{ backgroundColor: directiveConfig.bgColor, border: `1px solid ${directiveConfig.borderColor}` }}
            animate={state.systemState === "critical" ? { borderColor: [directiveConfig.borderColor, `${directiveConfig.color}50`, directiveConfig.borderColor] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {state.hasHardGate && <AlertTriangle className="w-3 h-3" style={{ color: directiveConfig.color }} />}
            <span className="text-[10px] font-mono font-black tracking-wider" style={{ color: directiveConfig.color }}>
              {directiveConfig.label}
            </span>
          </motion.div>

          {/* System state */}
          <div className="flex items-center gap-1">
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: stateConfig.color }}
              animate={{ opacity: state.systemState === "critical" ? [1, 0.3, 1] : [1, 0.6, 1] }}
              transition={{ duration: state.systemState === "critical" ? 0.8 : 3, repeat: Infinity }}
            />
            <span className="text-[8px] font-mono font-bold tracking-wider" style={{ color: `${stateConfig.color}90` }}>
              {stateConfig.label}
            </span>
          </div>

          <div className="flex-1" />

          {/* Session mode */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.03]">
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: modeConfig.color }} />
            <span className="text-[7px] font-mono font-bold tracking-wider" style={{ color: `${modeConfig.color}80` }}>
              {modeConfig.label}
            </span>
          </div>
        </div>

        {/* Row 2: Readiness score + Dominant risk */}
        <div className="flex items-start gap-3 mb-1.5">
          {/* Readiness arc */}
          <div className="flex flex-col items-center shrink-0">
            <ReadinessArc score={state.readinessScore} label={state.readinessLabel} color={stateConfig.color} />
          </div>

          {/* Risk + Correction text */}
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-[10px] font-mono text-white/35 leading-relaxed line-clamp-2">
              {state.dominantRisk}
            </p>
            <p className="text-[9px] font-mono text-white/20 leading-relaxed mt-1 line-clamp-1">
              {state.primaryCorrection}
            </p>
          </div>
        </div>

        {/* Row 3: Quick counts */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Target className="w-2.5 h-2.5 text-white/15" />
            <span className="text-[8px] font-mono text-white/25">
              <span className="text-white/40 font-bold">{state.activeMissionCount}</span> missions
            </span>
          </div>
          {state.gates.length > 0 && (
            <div className="flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" style={{ color: `${DIRECTIVE_CONFIG.DO_NOT_TRADE.color}60` }} />
              <span className="text-[8px] font-mono" style={{ color: `${DIRECTIVE_CONFIG.DO_NOT_TRADE.color}50` }}>
                <span className="font-bold">{state.gates.filter(g => g.severity === "hard").length}</span> gate{state.gates.filter(g => g.severity === "hard").length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
          {state.dangerSignals.length > 0 && (
            <div className="flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-amber-500/40" />
              <span className="text-[8px] font-mono text-amber-500/40">
                <span className="font-bold">{state.dangerSignals.length}</span> signal{state.dangerSignals.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
          <div className="flex-1" />
          {state.killzoneActive && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/[0.06] border border-emerald-500/[0.12]">
              <Crosshair className="w-2.5 h-2.5 text-emerald-400/50" />
              <span className="text-[7px] font-mono font-bold text-emerald-400/50 tracking-wider">KZ LIVE</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── READINESS ARC ───────────────────────────────────────────────

function ReadinessArc({ score, label, color }: { score: number; label: string; color: string }) {
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const dashOffset = circumference - progress

  return (
    <div className="relative w-11 h-11">
      <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
        <circle cx="22" cy="22" r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2.5" />
        <motion.circle
          cx="22" cy="22" r={radius} fill="none" stroke={color} strokeWidth="2.5"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[11px] font-mono font-black tabular-nums leading-none" style={{ color }}>{score}</span>
        <span className="text-[5px] font-mono text-white/20 uppercase tracking-wider mt-0.5">{label}</span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// OS SCORE BAR -- Transparency layer
// ═══════════════════════════════════════════════════════════════════

function OSScoreBar({
  state,
  onNavigate,
}: {
  state: OrderLayerState
  onNavigate: (tab: "strategy" | "psychology" | "activity", section?: string) => void
}) {
  const scores = [
    { label: "STRATEGY", score: state.strategyScore, color: "#06b6d4", tab: "strategy" as const, detail: `${state.riskGrade} / D:${state.disciplineScore}` },
    { label: "PSYCHOLOGY", score: state.psychologyScore, color: "#8b5cf6", tab: "psychology" as const, detail: `S:${state.stabilityIndex} / ${state.dominantHemisphere[0].toUpperCase()}` },
    { label: "ACTIVITY", score: state.activityScore, color: "#10b981", tab: "activity" as const, detail: state.sessionName },
  ]

  return (
    <div className="flex items-stretch gap-px px-3 py-2">
      {scores.map((s) => (
        <button
          key={s.label}
          className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg bg-white/[0.015] hover:bg-white/[0.03] border border-white/[0.03] hover:border-white/[0.06] transition-all group"
          onClick={() => onNavigate(s.tab)}
        >
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-[6px] font-mono text-white/20 uppercase tracking-wider font-bold group-hover:text-white/30 transition-colors">{s.label}</span>
          </div>
          <span className="text-[13px] font-mono font-black tabular-nums leading-none" style={{ color: s.color }}>
            {s.score}
          </span>
          <span className="text-[6px] font-mono text-white/15 truncate max-w-full px-1">{s.detail}</span>
        </button>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// GATES SECTION
// ═══════════════════════════════════════════════════════════════════

function GatesSection({
  gates,
  expandedGate,
  setExpandedGate,
  onResolve,
}: {
  gates: Gate[]
  expandedGate: string | null
  setExpandedGate: (id: string | null) => void
  onResolve: (gate: Gate) => void
}) {
  return (
    <div className="px-3 pt-1 pb-2">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Lock className="w-3 h-3 text-red-500/30" />
        <span className="text-[8px] font-mono text-red-500/30 uppercase tracking-wider font-black">Active Gates</span>
        <div className="flex-1 h-px bg-red-500/[0.06]" />
      </div>

      <div className="space-y-1">
        {gates.map((gate) => {
          const isHard = gate.severity === "hard"
          const isExpanded = expandedGate === gate.id
          const borderColor = isHard ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.10)"
          const bgColor = isHard ? "rgba(239,68,68,0.03)" : "rgba(245,158,11,0.02)"
          const textColor = isHard ? "#ef4444" : "#f59e0b"

          return (
            <motion.div
              key={gate.id}
              className="rounded-lg overflow-hidden"
              style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}
              layout
            >
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-left"
                onClick={() => setExpandedGate(isExpanded ? null : gate.id)}
              >
                {isHard ? (
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <AlertTriangle className="w-3 h-3 shrink-0" style={{ color: textColor }} />
                  </motion.div>
                ) : (
                  <Eye className="w-3 h-3 shrink-0" style={{ color: textColor }} />
                )}
                <span className="text-[9px] font-mono font-bold flex-1" style={{ color: `${textColor}B0` }}>
                  {gate.label}
                </span>
                <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.15 }}>
                  <ChevronRight className="w-3 h-3 text-white/15" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-2.5 space-y-1.5">
                      <p className="text-[8px] font-mono text-white/25 leading-relaxed">{gate.reason}</p>
                      <button
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border transition-all hover:border-white/[0.12]"
                        style={{ borderColor, backgroundColor: bgColor }}
                        onClick={() => onResolve(gate)}
                      >
                        <ArrowRight className="w-2.5 h-2.5" style={{ color: textColor }} />
                        <span className="text-[8px] font-mono font-bold" style={{ color: `${textColor}90` }}>
                          {gate.resolveAction}
                        </span>
                      </button>
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

// ═══════════════════════════════════════════════════════════════════
// MISSION STACK -- Phase 5
// ═══════════════════════════════════════════════════════════════════

function MissionStack({
  missions,
  expandedMission,
  setExpandedMission,
  onMissionClick,
  onAsk,
}: {
  missions: Mission[]
  expandedMission: string | null
  setExpandedMission: (id: string | null) => void
  onMissionClick: (mission: Mission) => void
  onAsk?: (prompt: string) => void
}) {
  if (missions.length === 0) {
    return (
      <div className="px-3 py-4">
        <div className="flex flex-col items-center gap-2 py-4 rounded-xl bg-emerald-500/[0.02] border border-emerald-500/[0.06]">
          <Target className="w-5 h-5 text-emerald-400/20" />
          <span className="text-[10px] font-mono text-emerald-400/30 font-bold">ALL CLEAR</span>
          <span className="text-[8px] font-mono text-white/15 text-center px-6">No active missions. System is nominal. Focus on process quality.</span>
        </div>
      </div>
    )
  }

  // Group by category
  const grouped = missions.reduce((acc, m) => {
    if (!acc[m.category]) acc[m.category] = []
    acc[m.category].push(m)
    return acc
  }, {} as Record<string, Mission[]>)

  const categoryOrder: Mission["category"][] = ["stabilize", "protect", "optimize", "learn"]

  return (
    <div className="px-3 pt-1 pb-2">
      <div className="flex items-center gap-1.5 mb-2">
        <Target className="w-3 h-3 text-white/15" />
        <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider font-black">Mission Briefing</span>
        <div className="flex-1 h-px bg-white/[0.03]" />
        <span className="text-[7px] font-mono text-white/12 tabular-nums">{missions.filter(m => !m.completed).length} active</span>
      </div>

      <div className="space-y-2">
        {categoryOrder.map((cat) => {
          const catMissions = grouped[cat]
          if (!catMissions || catMissions.length === 0) return null
          const config = CATEGORY_CONFIG[cat]

          return (
            <div key={cat}>
              {/* Category header */}
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1 h-3 rounded-full" style={{ backgroundColor: `${config.color}30` }} />
                <span className="text-[7px] font-mono uppercase tracking-wider font-black" style={{ color: `${config.color}50` }}>
                  {config.label}
                </span>
              </div>

              {/* Mission cards */}
              <div className="space-y-1 ml-2.5">
                {catMissions.map((mission, mi) => {
                  const isExpanded = expandedMission === mission.id

                  return (
                    <motion.div
                      key={mission.id}
                      className="rounded-lg overflow-hidden bg-white/[0.015] border border-white/[0.04] hover:border-white/[0.08] transition-all"
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: mi * 0.03 }}
                      layout
                    >
                      <button
                        className="w-full flex items-center gap-2 px-2.5 py-2 text-left group"
                        onClick={() => setExpandedMission(isExpanded ? null : mission.id)}
                      >
                        <div className="shrink-0" style={{ color: config.color }}>
                          <CategoryIcon category={mission.category} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] font-mono font-bold text-white/40 group-hover:text-white/55 transition-colors block truncate">
                            {mission.label}
                          </span>
                          {mission.rImpact && (
                            <span className="text-[7px] font-mono text-red-400/40 font-bold">{mission.rImpact}</span>
                          )}
                        </div>
                        <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.15 }}>
                          <ChevronRight className="w-3 h-3 text-white/10 group-hover:text-white/20 transition-colors" />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-2.5 pb-2.5 space-y-1.5">
                              <p className="text-[8px] font-mono text-white/25 leading-relaxed">
                                {mission.description}
                              </p>
                              <div className="flex items-center gap-1.5">
                                <button
                                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all"
                                  onClick={(e) => { e.stopPropagation(); onMissionClick(mission) }}
                                >
                                  <ArrowRight className="w-2.5 h-2.5" style={{ color: config.color }} />
                                  <span className="text-[7px] font-mono font-bold" style={{ color: `${config.color}80` }}>
                                    Go to {mission.targetTab}
                                  </span>
                                </button>
                                {onAsk && (
                                  <button
                                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.10] transition-all"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onAsk(`Help me with: ${mission.label}. ${mission.description}`)
                                    }}
                                  >
                                    <Brain className="w-2.5 h-2.5 text-white/15" />
                                    <span className="text-[7px] font-mono font-bold text-white/20">Ask Copilot</span>
                                  </button>
                                )}
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
        })}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// DANGER FEED
// ═══════════════════════════════════════════════════════════════════

function DangerFeed({
  signals,
  showAll,
  setShowAll,
}: {
  signals: DangerSignal[]
  showAll: boolean
  setShowAll: (v: boolean) => void
}) {
  const visible = showAll ? signals : signals.slice(0, 3)

  return (
    <div className="px-3 pt-1 pb-2">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Zap className="w-3 h-3 text-amber-500/20" />
        <span className="text-[8px] font-mono text-amber-500/20 uppercase tracking-wider font-black">Active Signals</span>
        <div className="flex-1 h-px bg-amber-500/[0.04]" />
        <span className="text-[7px] font-mono text-white/12 tabular-nums">{signals.length}</span>
      </div>

      <div className="space-y-1">
        {visible.map((signal, si) => {
          const sevConfig = STATE_CONFIG[signal.severity]

          return (
            <motion.div
              key={signal.id}
              className="flex items-start gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.01] border border-white/[0.03]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: si * 0.03 }}
            >
              <div className="shrink-0 mt-0.5" style={{ color: `${sevConfig.color}50` }}>
                <SourceIcon source={signal.source} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[8px] font-mono text-white/30 leading-relaxed">{signal.message}</p>
                {signal.rCost && (
                  <span className="text-[7px] font-mono font-bold" style={{ color: `${sevConfig.color}60` }}>{signal.rCost}</span>
                )}
              </div>
              <div className="w-1 h-1 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: sevConfig.color }} />
            </motion.div>
          )
        })}
      </div>

      {signals.length > 3 && (
        <button
          className="w-full mt-1 py-1 text-[7px] font-mono text-white/15 hover:text-white/25 transition-colors"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show less" : `Show all ${signals.length} signals`}
        </button>
      )}
    </div>
  )
}

export default OrderLayerPanel
