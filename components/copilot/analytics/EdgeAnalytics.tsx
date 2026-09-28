"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Target, Shield, Brain, Activity, Zap, TrendingUp, TrendingDown,
  ChevronRight, Eye, Clock, Crosshair, Gauge, AlertTriangle,
  CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, Flame,
  BarChart3, Layers, Lock, Unlock,
} from "lucide-react"

/* ══════════════════════════════════════════════════════════════════════════
   EDGE TRACKER — "PROBABILITY ENGINE"
   
   The convergence of all 4 pillars into one decision-quality score.
   Strategy alignment + Psychology readiness + Market conditions + AI signal
   = Trading Edge. This is what separates the professional from the gambler.
   ══════════════════════════════════════════════════════════════════════════ */

/* ────── Types ────── */
interface EdgeFactor {
  id: string
  pillar: "strategy" | "psychology" | "market" | "ai"
  label: string
  score: number // 0-100
  weight: number // 0-1 importance
  status: "aligned" | "neutral" | "conflicting"
  detail: string
  icon: "crosshair" | "brain" | "activity" | "zap"
}

interface EdgeSession {
  id: string
  timestamp: number
  edgeScore: number
  decision: "trade" | "wait" | "skip"
  outcome?: "win" | "loss" | "pending"
  factors: number
  pair: string
}

interface Playbook {
  id: string
  name: string
  winRate: number
  avgRR: number
  totalTrades: number
  edgeThreshold: number
  lastUsed: string
  conditions: string[]
  status: "active" | "paused"
}

/* ────── Mock Data Engine ────── */
function useEdgeData() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 4000)
    return () => clearInterval(iv)
  }, [])

  return useMemo(() => {
    const jitter = (base: number, range: number) => Math.max(0, Math.min(100, base + (Math.sin(tick * 0.7 + base) * range)))

    const factors: EdgeFactor[] = [
      { id: "f1", pillar: "strategy", label: "Setup Confluence", score: jitter(82, 5), weight: 0.3, status: "aligned", detail: "OB + FVG + Liquidity sweep aligned on H1. 3/3 confluences met.", icon: "crosshair" },
      { id: "f2", pillar: "strategy", label: "Rule Adherence", score: jitter(91, 3), weight: 0.15, status: "aligned", detail: "Last 5 trades followed all entry rules. Streak: 5 days.", icon: "crosshair" },
      { id: "f3", pillar: "psychology", label: "Emotional State", score: jitter(68, 8), weight: 0.2, status: "neutral", detail: "Slight FOMO detected from missed move. Awareness level: moderate.", icon: "brain" },
      { id: "f4", pillar: "psychology", label: "Decision Quality", score: jitter(75, 6), weight: 0.1, status: "neutral", detail: "Average deliberation time 4.2min. Target: >5min. Slightly rushed.", icon: "brain" },
      { id: "f5", pillar: "market", label: "Session Alignment", score: jitter(88, 4), weight: 0.1, status: "aligned", detail: "London killzone active. High probability window. Volume confirmed.", icon: "activity" },
      { id: "f6", pillar: "market", label: "Volatility Regime", score: jitter(72, 7), weight: 0.05, status: "neutral", detail: "ATR within normal range. No extreme conditions detected.", icon: "activity" },
      { id: "f7", pillar: "ai", label: "Pattern Recognition", score: jitter(85, 5), weight: 0.05, status: "aligned", detail: "AI identifies bullish displacement with 85% historical match.", icon: "zap" },
      { id: "f8", pillar: "ai", label: "Risk Assessment", score: jitter(79, 6), weight: 0.05, status: "neutral", detail: "Current R:R ratio 2.8. Position sizing within 1% rule.", icon: "zap" },
    ]

    const weightedScore = factors.reduce((sum, f) => sum + f.score * f.weight, 0)
    const aligned = factors.filter(f => f.status === "aligned").length
    const conflicting = factors.filter(f => f.status === "conflicting").length

    const sessions: EdgeSession[] = [
      { id: "s1", timestamp: Date.now() - 3600000, edgeScore: 84, decision: "trade", outcome: "win", factors: 7, pair: "EURUSD" },
      { id: "s2", timestamp: Date.now() - 7200000, edgeScore: 62, decision: "wait", outcome: undefined, factors: 5, pair: "GBPUSD" },
      { id: "s3", timestamp: Date.now() - 14400000, edgeScore: 91, decision: "trade", outcome: "win", factors: 8, pair: "USDJPY" },
      { id: "s4", timestamp: Date.now() - 28800000, edgeScore: 45, decision: "skip", outcome: undefined, factors: 3, pair: "XAUUSD" },
      { id: "s5", timestamp: Date.now() - 43200000, edgeScore: 78, decision: "trade", outcome: "loss", factors: 6, pair: "EURUSD" },
    ]

    const playbooks: Playbook[] = [
      { id: "p1", name: "London OB Sweep", winRate: 72, avgRR: 2.8, totalTrades: 34, edgeThreshold: 75, lastUsed: "Today", conditions: ["London session", "Order Block", "Liquidity sweep", "H1 FVG"], status: "active" },
      { id: "p2", name: "NY AM Displacement", winRate: 68, avgRR: 3.1, totalTrades: 22, edgeThreshold: 70, conditions: ["NY AM killzone", "Displacement", "Volume spike", "M15 confluence"], lastUsed: "Yesterday", status: "active" },
      { id: "p3", name: "Asia Range Break", winRate: 58, avgRR: 2.2, totalTrades: 15, edgeThreshold: 80, conditions: ["Asia range defined", "Break + retest", "Low spread"], lastUsed: "3 days ago", status: "paused" },
    ]

    return { factors, weightedScore, aligned, conflicting, sessions, playbooks, tick }
  }, [tick])
}

/* ────── Edge Score Ring ────── */
function EdgeScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444"
  const label = score >= 80 ? "HIGH EDGE" : score >= 60 ? "MODERATE" : "LOW EDGE"

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        {/* Track */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
        {/* Progress */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth="3" strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        {/* Glow circle at tip */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          opacity={0.15}
          filter="blur(4px)"
        />
      </svg>
      <div className="flex flex-col items-center gap-0.5">
        <motion.span
          className="font-mono text-[28px] font-black tabular-nums leading-none"
          style={{ color }}
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          {Math.round(score)}
        </motion.span>
        <span className="text-[7px] font-mono uppercase tracking-[0.2em] font-bold" style={{ color, opacity: 0.6 }}>
          {label}
        </span>
      </div>
    </div>
  )
}

/* ────── Pillar Mini Score ────── */
function PillarScore({ pillar, score, count, color }: { pillar: string; score: number; count: number; color: string }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-1.5 py-2 px-1 rounded-lg hover:bg-white/[0.02] transition-colors cursor-default">
      <div className="relative w-8 h-8">
        <svg width={32} height={32} className="-rotate-90">
          <circle cx={16} cy={16} r={12} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
          <motion.circle cx={16} cy={16} r={12} fill="none"
            stroke={color} strokeWidth="2" strokeLinecap="round"
            strokeDasharray={75.4}
            animate={{ strokeDashoffset: 75.4 - (score / 100) * 75.4 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold" style={{ color }}>
          {Math.round(score)}
        </span>
      </div>
      <span className="text-[7px] font-mono uppercase tracking-[0.15em] text-white/30 font-bold">{pillar}</span>
      <span className="text-[7px] text-white/15 font-mono">{count} factors</span>
    </div>
  )
}

/* ────── Factor Row ────── */
function FactorRow({ factor, index }: { factor: EdgeFactor; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const iconMap = {
    crosshair: <Crosshair className="w-3 h-3" />,
    brain: <Brain className="w-3 h-3" />,
    activity: <Activity className="w-3 h-3" />,
    zap: <Zap className="w-3 h-3" />,
  }
  const statusColor = factor.status === "aligned" ? "#10b981" : factor.status === "neutral" ? "#f59e0b" : "#ef4444"
  const statusIcon = factor.status === "aligned" ? <CheckCircle2 className="w-2.5 h-2.5" /> : factor.status === "neutral" ? <Eye className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="flex-shrink-0" style={{ color: statusColor, opacity: 0.7 }}>
          {iconMap[factor.icon]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-white/55 font-medium truncate">{factor.label}</span>
            <span className="flex-shrink-0" style={{ color: statusColor }}>{statusIcon}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Score bar */}
          <div className="w-12 h-1 rounded-full bg-white/[0.04] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: statusColor }}
              animate={{ width: `${factor.score}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <span className="text-[8px] font-mono font-bold tabular-nums w-5 text-right" style={{ color: statusColor, opacity: 0.8 }}>
            {Math.round(factor.score)}
          </span>
          <ChevronRight className={`w-2.5 h-2.5 text-white/15 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`} />
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-2 pl-8">
              <p className="text-[8px] text-white/25 leading-[1.6]">{factor.detail}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[7px] font-mono uppercase text-white/15 tracking-wider">Weight: {(factor.weight * 100).toFixed(0)}%</span>
                <span className="text-[7px] font-mono uppercase tracking-wider" style={{ color: statusColor, opacity: 0.5 }}>{factor.pillar}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ────── Playbook Card ────── */
function PlaybookCard({ playbook, edgeScore }: { playbook: Playbook; edgeScore: number }) {
  const meetsThreshold = edgeScore >= playbook.edgeThreshold
  const wrColor = playbook.winRate >= 65 ? "#10b981" : playbook.winRate >= 55 ? "#f59e0b" : "#ef4444"

  return (
    <motion.div
      className="rounded-lg p-3 transition-colors"
      style={{
        background: meetsThreshold ? "rgba(16,185,129,0.04)" : "rgba(255,255,255,0.01)",
        border: `1px solid ${meetsThreshold ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)"}`,
      }}
      whileHover={{ scale: 1.005 }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {playbook.status === "active" ? (
            <Unlock className="w-2.5 h-2.5 text-emerald-400/50" />
          ) : (
            <Lock className="w-2.5 h-2.5 text-white/20" />
          )}
          <span className="text-[10px] font-bold text-white/65">{playbook.name}</span>
        </div>
        {meetsThreshold && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-400/10"
          >
            <Zap className="w-2 h-2 text-emerald-400" />
            <span className="text-[7px] font-mono font-bold text-emerald-400/80">READY</span>
          </motion.div>
        )}
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center gap-1">
          <Target className="w-2.5 h-2.5 text-white/20" />
          <span className="text-[8px] font-mono font-bold" style={{ color: wrColor }}>{playbook.winRate}%</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-2.5 h-2.5 text-white/20" />
          <span className="text-[8px] font-mono font-bold text-white/40">{playbook.avgRR}R</span>
        </div>
        <div className="flex items-center gap-1">
          <BarChart3 className="w-2.5 h-2.5 text-white/20" />
          <span className="text-[8px] font-mono text-white/25">{playbook.totalTrades}</span>
        </div>
        <span className="text-[7px] text-white/15 font-mono ml-auto">{playbook.lastUsed}</span>
      </div>

      <div className="flex flex-wrap gap-1">
        {playbook.conditions.map((c, i) => (
          <span key={i} className="px-1.5 py-0.5 rounded text-[7px] font-mono text-white/25 bg-white/[0.03]">{c}</span>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <span className="text-[7px] font-mono text-white/15 uppercase tracking-wider">Edge threshold:</span>
        <div className="flex-1 h-px bg-white/[0.04]" />
        <span className={`text-[8px] font-mono font-bold ${meetsThreshold ? "text-emerald-400/70" : "text-white/25"}`}>{playbook.edgeThreshold}</span>
      </div>
    </motion.div>
  )
}

/* ────── Session Log Row ────── */
function SessionRow({ session }: { session: EdgeSession }) {
  const scoreColor = session.edgeScore >= 80 ? "#10b981" : session.edgeScore >= 60 ? "#f59e0b" : "#ef4444"
  const decisionColors = { trade: "#10b981", wait: "#f59e0b", skip: "#ef4444" }
  const outcomeColors = { win: "#10b981", loss: "#ef4444", pending: "#6b7280" }
  const ago = Math.round((Date.now() - session.timestamp) / 3600000)

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/[0.01] transition-colors rounded-md">
      <span className="text-[8px] font-mono font-bold tabular-nums w-5" style={{ color: scoreColor }}>{session.edgeScore}</span>
      <div className="w-6 h-px bg-white/[0.04]" />
      <span className="text-[7px] font-mono uppercase font-bold tracking-wider" style={{ color: decisionColors[session.decision] }}>{session.decision}</span>
      <div className="flex-1" />
      <span className="text-[8px] font-mono text-white/30 font-bold">{session.pair}</span>
      {session.outcome && (
        <span className="text-[7px] font-mono uppercase font-bold px-1 py-0.5 rounded" style={{
          color: outcomeColors[session.outcome],
          background: `${outcomeColors[session.outcome]}10`,
        }}>{session.outcome}</span>
      )}
      <span className="text-[7px] text-white/15 font-mono tabular-nums">{ago}h</span>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════════════ */
export function EdgeAnalytics() {
  const { factors, weightedScore, aligned, conflicting, sessions, playbooks } = useEdgeData()
  const [activeSection, setActiveSection] = useState<"factors" | "playbooks" | "history">("factors")

  const pillarGroups = useMemo(() => {
    const groups = { strategy: [] as EdgeFactor[], psychology: [] as EdgeFactor[], market: [] as EdgeFactor[], ai: [] as EdgeFactor[] }
    factors.forEach(f => groups[f.pillar].push(f))
    return groups
  }, [factors])

  const pillarScores = useMemo(() => ({
    strategy: pillarGroups.strategy.reduce((s, f) => s + f.score, 0) / (pillarGroups.strategy.length || 1),
    psychology: pillarGroups.psychology.reduce((s, f) => s + f.score, 0) / (pillarGroups.psychology.length || 1),
    market: pillarGroups.market.reduce((s, f) => s + f.score, 0) / (pillarGroups.market.length || 1),
    ai: pillarGroups.ai.reduce((s, f) => s + f.score, 0) / (pillarGroups.ai.length || 1),
  }), [pillarGroups])

  const readiness = weightedScore >= 80 ? "DEPLOY" : weightedScore >= 60 ? "STANDBY" : "HOLD"
  const readinessColor = weightedScore >= 80 ? "#10b981" : weightedScore >= 60 ? "#f59e0b" : "#ef4444"

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">

        {/* ─── EDGE SCORE HERO ─── */}
        <div className="flex flex-col items-center pt-2 pb-1">
          <EdgeScoreRing score={weightedScore} size={110} />
          
          {/* Readiness badge */}
          <motion.div
            className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: `${readinessColor}08`, border: `1px solid ${readinessColor}15` }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: readinessColor }}
              animate={{ scale: [0.8, 1.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
            <span className="text-[8px] font-mono font-black uppercase tracking-[0.2em]" style={{ color: readinessColor }}>
              {readiness}
            </span>
            <span className="text-[7px] text-white/20 font-mono">{aligned}/{factors.length} aligned</span>
          </motion.div>
        </div>

        {/* ─── PILLAR BREAKDOWN ─── */}
        <div className="flex items-center gap-0.5 rounded-xl p-1" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)" }}>
          <PillarScore pillar="Strategy" score={pillarScores.strategy} count={pillarGroups.strategy.length} color="#22d3ee" />
          <PillarScore pillar="Psych" score={pillarScores.psychology} count={pillarGroups.psychology.length} color="#ec4899" />
          <PillarScore pillar="Market" score={pillarScores.market} count={pillarGroups.market.length} color="#10b981" />
          <PillarScore pillar="AI" score={pillarScores.ai} count={pillarGroups.ai.length} color="#8b5cf6" />
        </div>

        {/* ─── SECTION TABS ─── */}
        <div className="flex items-center gap-1 px-1">
          {(["factors", "playbooks", "history"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSection(tab)}
              className={`px-2.5 py-1 rounded-md text-[8px] font-mono uppercase tracking-[0.12em] font-bold transition-all ${
                activeSection === tab
                  ? "text-amber-400/80 bg-amber-400/[0.08]"
                  : "text-white/20 hover:text-white/35 hover:bg-white/[0.02]"
              }`}
            >
              {tab === "factors" ? "Factors" : tab === "playbooks" ? "Playbooks" : "History"}
            </button>
          ))}
          <div className="flex-1" />
          <span className="text-[7px] text-white/12 font-mono tabular-nums">{factors.length} signals</span>
        </div>

        {/* ─── CONTENT SECTIONS ─── */}
        <AnimatePresence mode="wait">
          {activeSection === "factors" && (
            <motion.div
              key="factors"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-0.5"
            >
              {/* Grouped by pillar */}
              {(["strategy", "psychology", "market", "ai"] as const).map(pillar => {
                const group = pillarGroups[pillar]
                if (!group.length) return null
                const pillarColors = { strategy: "#22d3ee", psychology: "#ec4899", market: "#10b981", ai: "#8b5cf6" }
                const pillarLabels = { strategy: "Strategy", psychology: "Psychology", market: "Market", ai: "AI" }
                return (
                  <div key={pillar}>
                    <div className="flex items-center gap-2 px-3 pt-2 pb-1">
                      <div className="w-1 h-1 rounded-full" style={{ backgroundColor: pillarColors[pillar], opacity: 0.5 }} />
                      <span className="text-[7px] font-mono uppercase tracking-[0.18em] font-bold" style={{ color: pillarColors[pillar], opacity: 0.4 }}>
                        {pillarLabels[pillar]}
                      </span>
                      <div className="flex-1 h-px bg-white/[0.03]" />
                    </div>
                    {group.map((f, i) => <FactorRow key={f.id} factor={f} index={i} />)}
                  </div>
                )
              })}

              {/* Quick summary bar */}
              <div className="flex items-center justify-between px-3 pt-3 pb-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400/40" />
                    <span className="text-[7px] font-mono text-emerald-400/40 font-bold">{aligned} aligned</span>
                  </div>
                  {conflicting > 0 && (
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5 text-red-400/40" />
                      <span className="text-[7px] font-mono text-red-400/40 font-bold">{conflicting} conflicting</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "playbooks" && (
            <motion.div
              key="playbooks"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {playbooks.map(pb => (
                <PlaybookCard key={pb.id} playbook={pb} edgeScore={weightedScore} />
              ))}

              {/* Edge vs Playbook match */}
              <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-3 h-3 text-amber-400/40" />
                  <span className="text-[8px] font-mono uppercase tracking-wider text-amber-400/40 font-bold">Playbook Match</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-white/40">
                    {playbooks.filter(pb => weightedScore >= pb.edgeThreshold && pb.status === "active").length} of {playbooks.filter(pb => pb.status === "active").length} active playbooks meet current edge threshold.
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-1"
            >
              <div className="flex items-center gap-2 px-3 pb-1">
                <Clock className="w-2.5 h-2.5 text-white/15" />
                <span className="text-[7px] font-mono uppercase tracking-wider text-white/20 font-bold">Recent Decisions</span>
              </div>
              {sessions.map(s => <SessionRow key={s.id} session={s} />)}

              {/* Stats summary */}
              <div className="rounded-lg p-3 mt-2" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)" }}>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Avg Edge", value: Math.round(sessions.reduce((s, x) => s + x.edgeScore, 0) / sessions.length), color: "#f59e0b" },
                    { label: "Trade Rate", value: `${Math.round((sessions.filter(s => s.decision === "trade").length / sessions.length) * 100)}%`, color: "#10b981" },
                    { label: "Win Rate", value: `${Math.round((sessions.filter(s => s.outcome === "win").length / sessions.filter(s => s.outcome).length) * 100)}%`, color: "#22d3ee" },
                  ].map(stat => (
                    <div key={stat.label} className="flex flex-col items-center gap-0.5">
                      <span className="text-[12px] font-mono font-bold" style={{ color: stat.color }}>{stat.value}</span>
                      <span className="text-[6px] font-mono uppercase tracking-wider text-white/20">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </ScrollArea>
  )
}
