"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SURFACE, ACCENT, RADIUS, GLOW, GRADIENT, TYPE } from "@/components/mtf/mtf-theme"
import { RenderResultObject } from "@/components/command/CommandResultObjects"
import type { OrbState } from "./neural-orb"
import type { ResultObject, SuggestionChip } from "@/lib/command/types"
import {
  X, Pin, Copy, ExternalLink, Sparkles, ChevronRight,
  Crosshair, TrendingUp, BarChart3, Layers, Shield, Target,
  Eye, Users, DollarSign, MessageSquare, Calendar, Lock,
  LineChart, ArrowUpRight, History, Bookmark, Download,
  AlertTriangle, CheckCircle2, Zap, Info,
} from "lucide-react"

/* ═══════════════════════════════════════════════════════
   SUMMONED WORKSPACE v1.5 — Structured Command Workspace
   
   7 Zones:
   A. WORKSPACE HEADER (framing, category, entities, badges, toolbar)
   B. CONTEXT BAR (session, pair, route affinity, source, news alert)
   C. PRIMARY CONTENT + D. SIDE ACTION RAIL (split layout)
   E. INTELLIGENCE TAKEAWAY (primary/risk/opportunity/protection)
   F. NEXT MOVES MATRIX (categorized rich action cards)
   G. SOURCE / STATUS / PIN / DOCK TOOLS
   ═══════════════════════════════════════════════════════ */

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

/* ── Chart Action ── */
interface ChartAction {
  label: string
  description: string
  icon: string
  route?: string
  query?: string
}

/* ── Next Move ── */
interface NextMove {
  title: string
  description: string
  category: "continue" | "deepen" | "compare" | "protect" | "navigate"
  route?: string
  query?: string
  urgency: "high" | "medium" | "low"
  icon: string
}

/* ── Insight Layers ── */
interface InsightLayers {
  primary: string
  risk?: string
  opportunity?: string
  protection?: string
}

/* ── Context Bar ── */
interface ContextBarData {
  session?: string
  pair?: string
  routeAffinity?: string[]
  planActive?: boolean
  newsAlert?: string
}

/* ── Summoned Result Type ── */
export interface SummonedResult {
  framing: string
  category?: string
  detectedEntities?: string[]
  sessionBadge?: string
  sourceStatus?: "live" | "partial" | "mock"
  objects: ResultObject[]
  insight?: string | InsightLayers
  suggestions: SuggestionChip[]
  contextBar?: ContextBarData
  chartActions?: ChartAction[]
  nextPaths?: { label: string; query?: string; route?: string; icon?: string }[]
  nextMoves?: NextMove[]
}

interface SummonedWorkspaceProps {
  result: SummonedResult
  orbState: OrbState
  isEngaged?: boolean
  onClear: () => void
  onExecuteCommand: (query: string) => void
}

/* ── Icon resolver ── */
function ActionIcon({ icon, className }: { icon: string; className?: string }) {
  const cls = className || "w-3.5 h-3.5"
  switch (icon) {
    case "crosshair": return <Crosshair className={cls} />
    case "trending": return <TrendingUp className={cls} />
    case "chart": return <LineChart className={cls} />
    case "layers": return <Layers className={cls} />
    case "shield": return <Shield className={cls} />
    case "target": return <Target className={cls} />
    case "eye": return <Eye className={cls} />
    case "users": return <Users className={cls} />
    case "dollar": return <DollarSign className={cls} />
    case "message": return <MessageSquare className={cls} />
    case "calendar": return <Calendar className={cls} />
    case "lock": return <Lock className={cls} />
    default: return <ChevronRight className={cls} />
  }
}

/* Category colors for next moves */
const MOVE_CATEGORIES: Record<string, { label: string; color: string; icon: typeof ChevronRight }> = {
  continue: { label: "Continue", color: ACCENT.emerald.rgb, icon: ArrowUpRight },
  deepen: { label: "Deepen", color: ACCENT.purple.rgb, icon: Layers },
  compare: { label: "Compare", color: ACCENT.cyan.rgb, icon: BarChart3 },
  protect: { label: "Protect", color: ACCENT.amber.rgb, icon: Shield },
  navigate: { label: "Navigate", color: ACCENT.blue.rgb, icon: ExternalLink },
}

/* Source status colors */
const SOURCE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  live: { bg: `rgba(${ACCENT.emerald.rgb},0.06)`, text: `rgba(${ACCENT.emerald.rgb},0.6)`, dot: `rgba(${ACCENT.emerald.rgb},0.7)` },
  partial: { bg: `rgba(${ACCENT.amber.rgb},0.06)`, text: `rgba(${ACCENT.amber.rgb},0.6)`, dot: `rgba(${ACCENT.amber.rgb},0.7)` },
  mock: { bg: `rgba(${ACCENT.slate.rgb},0.06)`, text: `rgba(${ACCENT.slate.rgb},0.4)`, dot: `rgba(${ACCENT.slate.rgb},0.4)` },
}

export function SummonedWorkspace({
  result,
  orbState,
  isEngaged,
  onClear,
  onExecuteCommand,
}: SummonedWorkspaceProps) {
  const [pinned, setPinned] = useState(false)
  const insightData: InsightLayers = typeof result.insight === "string"
    ? { primary: result.insight }
    : result.insight || { primary: "" }
  const sourceStyle = SOURCE_COLORS[result.sourceStatus || "live"]
  const hasChartActions = result.chartActions && result.chartActions.length > 0
  const nextMoves = result.nextMoves || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative"
      style={{ marginTop: isEngaged ? 8 : 16 }}
    >
      {/* Materialization line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="h-px mx-auto mb-5"
        style={{ width: "50%", background: GRADIENT.headerLine(ACCENT.blue.rgb), transformOrigin: "center" }}
      />

      {/* Workspace container */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, rgba(${ACCENT.blue.rgb},0.02) 0%, ${SURFACE.card} 4%)`,
          borderRadius: RADIUS.card,
          border: `1px solid rgba(${ACCENT.blue.rgb},0.08)`,
        }}
      >
        {/* Top accent line */}
        <div className="h-px" style={{ background: GRADIENT.cardAccent(ACCENT.blue.rgb) }} />

        {/* Ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] pointer-events-none"
          style={{ background: `radial-gradient(ellipse at center top, rgba(${ACCENT.blue.rgb},0.04), transparent 70%)` }}
        />

        <div className="relative z-10">
          {/* ═══════════════════════════════════════════
              A. WORKSPACE HEADER
              ═══════════════════════════════════════════ */}
          <div className="px-6 pt-5 pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Category + entities */}
                <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                  {result.category && (
                    <span
                      className="text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-md"
                      style={{
                        background: `rgba(${ACCENT.blue.rgb},0.1)`,
                        color: `rgba(${ACCENT.blue.rgb},0.7)`,
                        border: `1px solid rgba(${ACCENT.blue.rgb},0.15)`,
                      }}
                    >
                      {result.category}
                    </span>
                  )}
                  {result.sessionBadge && (
                    <span
                      className="text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{
                        background: `rgba(${ACCENT.cyan.rgb},0.06)`,
                        color: `rgba(${ACCENT.cyan.rgb},0.5)`,
                      }}
                    >
                      {result.sessionBadge}
                    </span>
                  )}
                  {result.detectedEntities?.slice(0, 4).map((e, i) => (
                    <span
                      key={i}
                      className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                      style={{
                        background: `rgba(${ACCENT.purple.rgb},0.05)`,
                        color: `rgba(${ACCENT.purple.rgb},0.5)`,
                      }}
                    >
                      {e}
                    </span>
                  ))}
                </div>

                {/* Framing */}
                <motion.p
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3, ease: EASE }}
                  className="text-[14px] font-semibold text-white/88 leading-relaxed"
                >
                  {result.framing}
                </motion.p>
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => setPinned(!pinned)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-white/5"
                  title={pinned ? "Unpin" : "Pin workspace"}
                >
                  <Pin className="w-3.5 h-3.5" style={{ color: pinned ? `rgba(${ACCENT.blue.rgb},0.7)` : `rgba(${ACCENT.slate.rgb},0.25)` }} />
                </button>
                <button
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-white/5"
                  title="Copy summary"
                >
                  <Copy className="w-3.5 h-3.5" style={{ color: `rgba(${ACCENT.slate.rgb},0.25)` }} />
                </button>
                <button
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-white/5"
                  title="Bookmark"
                >
                  <Bookmark className="w-3.5 h-3.5" style={{ color: `rgba(${ACCENT.slate.rgb},0.25)` }} />
                </button>
                <button
                  onClick={onClear}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-white/5"
                  title="Clear workspace"
                >
                  <X className="w-3.5 h-3.5" style={{ color: `rgba(${ACCENT.slate.rgb},0.3)` }} />
                </button>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              B. CONTEXT BAR
              ═══════════════════════════════════════════ */}
          {result.contextBar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="mx-6 mb-4 px-4 py-2.5 rounded-xl flex items-center gap-3 flex-wrap"
              style={{
                background: `rgba(${ACCENT.slate.rgb},0.02)`,
                border: `1px solid rgba(${ACCENT.slate.rgb},0.04)`,
              }}
            >
              {result.contextBar.session && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-mono uppercase tracking-wider" style={{ color: `rgba(${ACCENT.slate.rgb},0.3)` }}>Session</span>
                  <span className="text-[9px] font-mono font-bold text-white/60">{result.contextBar.session}</span>
                </div>
              )}
              {result.contextBar.pair && (
                <>
                  <span className="w-px h-3" style={{ background: `rgba(${ACCENT.slate.rgb},0.08)` }} />
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-mono uppercase tracking-wider" style={{ color: `rgba(${ACCENT.slate.rgb},0.3)` }}>Pair</span>
                    <span className="text-[9px] font-mono font-bold text-white/60">{result.contextBar.pair}</span>
                  </div>
                </>
              )}
              {result.contextBar.routeAffinity && (
                <>
                  <span className="w-px h-3" style={{ background: `rgba(${ACCENT.slate.rgb},0.08)` }} />
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-mono uppercase tracking-wider" style={{ color: `rgba(${ACCENT.slate.rgb},0.3)` }}>Routes</span>
                    {result.contextBar.routeAffinity.map(r => (
                      <span key={r} className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ background: `rgba(${ACCENT.blue.rgb},0.05)`, color: `rgba(${ACCENT.blue.rgb},0.45)` }}>
                        {r}
                      </span>
                    ))}
                  </div>
                </>
              )}
              {result.contextBar.planActive && (
                <>
                  <span className="w-px h-3" style={{ background: `rgba(${ACCENT.slate.rgb},0.08)` }} />
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" style={{ color: `rgba(${ACCENT.emerald.rgb},0.5)` }} />
                    <span className="text-[8px] font-mono" style={{ color: `rgba(${ACCENT.emerald.rgb},0.4)` }}>Plan Active</span>
                  </div>
                </>
              )}
              {result.contextBar.newsAlert && (
                <>
                  <span className="w-px h-3" style={{ background: `rgba(${ACCENT.slate.rgb},0.08)` }} />
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" style={{ color: `rgba(${ACCENT.amber.rgb},0.6)` }} />
                    <span className="text-[8px] font-mono font-bold" style={{ color: `rgba(${ACCENT.amber.rgb},0.5)` }}>{result.contextBar.newsAlert}</span>
                  </div>
                </>
              )}
              {/* Source status */}
              <div className="ml-auto flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: sourceStyle.dot }} />
                <span className="text-[8px] font-mono uppercase tracking-wider" style={{ color: sourceStyle.text }}>
                  {result.sourceStatus || "live"}
                </span>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════
              C + D. PRIMARY CONTENT + SIDE ACTION RAIL
              ═══════════════════════════════════════════ */}
          <div className={`px-6 pb-4 ${hasChartActions ? "grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-5" : ""}`}>
            {/* C. PRIMARY CONTENT */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4, ease: EASE }}
              className="space-y-3"
            >
              {result.objects.map((obj, i) => (
                <motion.div
                  key={`obj-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.08, duration: 0.3, ease: EASE }}
                >
                  <RenderResultObject obj={obj} />
                </motion.div>
              ))}
            </motion.div>

            {/* D. SIDE ACTION RAIL (Chart Intelligence + Actions) */}
            {hasChartActions && (
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.4, ease: EASE }}
                className="hidden lg:flex flex-col gap-2"
              >
                {/* Chart Intelligence header */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-3 rounded-full" style={{ background: `rgba(${ACCENT.cyan.rgb},0.4)` }} />
                  <span className={TYPE.micro} style={{ color: `rgba(${ACCENT.slate.rgb},0.3)` }}>
                    Chart + Analysis
                  </span>
                </div>

                {/* Chart action buttons */}
                {result.chartActions!.map((action, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.06, duration: 0.25, ease: EASE }}
                    onClick={() => {
                      if (action.route) window.location.href = action.route
                      else if (action.query) onExecuteCommand(action.query)
                    }}
                    className="group text-left p-3 rounded-xl transition-all duration-200"
                    style={{
                      background: `rgba(${ACCENT.cyan.rgb},0.02)`,
                      border: `1px solid rgba(${ACCENT.cyan.rgb},0.05)`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `rgba(${ACCENT.cyan.rgb},0.06)`
                      e.currentTarget.style.borderColor = `rgba(${ACCENT.cyan.rgb},0.15)`
                      e.currentTarget.style.transform = "translateY(-1px)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `rgba(${ACCENT.cyan.rgb},0.02)`
                      e.currentTarget.style.borderColor = `rgba(${ACCENT.cyan.rgb},0.05)`
                      e.currentTarget.style.transform = "translateY(0)"
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `rgba(${ACCENT.cyan.rgb},0.1)` }}
                      >
                        <ActionIcon icon={action.icon} className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-white/75 font-semibold leading-tight mb-0.5">{action.label}</div>
                        <div className="text-[9px] leading-[1.4] text-white/35">{action.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {action.route ? (
                        <ExternalLink className="w-2.5 h-2.5" style={{ color: `rgba(${ACCENT.cyan.rgb},0.4)` }} />
                      ) : (
                        <ArrowUpRight className="w-2.5 h-2.5" style={{ color: `rgba(${ACCENT.cyan.rgb},0.4)` }} />
                      )}
                    </div>
                  </motion.button>
                ))}

                {/* Separator */}
                <div className="h-px my-1" style={{ background: `rgba(${ACCENT.slate.rgb},0.04)` }} />

                {/* Quick side actions */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-3 rounded-full" style={{ background: `rgba(${ACCENT.purple.rgb},0.3)` }} />
                  <span className={TYPE.micro} style={{ color: `rgba(${ACCENT.slate.rgb},0.25)` }}>
                    Actions
                  </span>
                </div>
                {[
                  { label: "Open in Copilot", icon: Crosshair, route: "/copilot" },
                  { label: "Save as Routine", icon: Bookmark },
                  { label: "Pin to Today", icon: Pin },
                ].map((action, i) => {
                  const Icon = action.icon
                  return (
                    <button
                      key={i}
                      onClick={() => action.route && (window.location.href = action.route)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-[9px] font-medium transition-all duration-200 text-white/40 hover:text-white/60 hover:bg-white/[0.03]"
                    >
                      <Icon className="w-3 h-3" />
                      {action.label}
                    </button>
                  )
                })}
              </motion.div>
            )}
          </div>

          {/* ═══════════════════════════════════════════
              E. INTELLIGENCE TAKEAWAY (Layered)
              ═══════════════════════════════════════════ */}
          {insightData.primary && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.3, ease: EASE }}
              className="mx-6 mb-4"
            >
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-3 rounded-full" style={{ background: `rgba(${ACCENT.purple.rgb},0.3)` }} />
                <span className={TYPE.micro} style={{ color: `rgba(${ACCENT.slate.rgb},0.3)` }}>
                  Intelligence
                </span>
                <div className="flex-1 h-px" style={{ background: `rgba(${ACCENT.slate.rgb},0.04)` }} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Primary */}
                <div
                  className="p-3.5 rounded-xl col-span-full"
                  style={{
                    background: `rgba(${ACCENT.purple.rgb},0.03)`,
                    border: `1px solid rgba(${ACCENT.purple.rgb},0.06)`,
                  }}
                >
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: `rgba(${ACCENT.purple.rgb},0.5)` }} />
                    <div>
                      <span className={TYPE.micro} style={{ color: `rgba(${ACCENT.purple.rgb},0.45)` }}>Primary Insight</span>
                      <p className="text-[11px] leading-[1.7] mt-1 text-white/55">{insightData.primary}</p>
                    </div>
                  </div>
                </div>

                {/* Risk */}
                {insightData.risk && (
                  <div
                    className="p-3 rounded-xl"
                    style={{
                      background: `rgba(${ACCENT.rose.rgb},0.02)`,
                      border: `1px solid rgba(${ACCENT.rose.rgb},0.05)`,
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: `rgba(${ACCENT.rose.rgb},0.5)` }} />
                      <div>
                        <span className={TYPE.micro} style={{ color: `rgba(${ACCENT.rose.rgb},0.4)` }}>Risk</span>
                        <p className="text-[10px] leading-[1.6] mt-1 text-white/45">{insightData.risk}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Opportunity */}
                {insightData.opportunity && (
                  <div
                    className="p-3 rounded-xl"
                    style={{
                      background: `rgba(${ACCENT.emerald.rgb},0.02)`,
                      border: `1px solid rgba(${ACCENT.emerald.rgb},0.05)`,
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: `rgba(${ACCENT.emerald.rgb},0.5)` }} />
                      <div>
                        <span className={TYPE.micro} style={{ color: `rgba(${ACCENT.emerald.rgb},0.4)` }}>Opportunity</span>
                        <p className="text-[10px] leading-[1.6] mt-1 text-white/45">{insightData.opportunity}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Protection */}
                {insightData.protection && (
                  <div
                    className="p-3 rounded-xl col-span-full"
                    style={{
                      background: `rgba(${ACCENT.amber.rgb},0.02)`,
                      border: `1px solid rgba(${ACCENT.amber.rgb},0.05)`,
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <Shield className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: `rgba(${ACCENT.amber.rgb},0.5)` }} />
                      <div>
                        <span className={TYPE.micro} style={{ color: `rgba(${ACCENT.amber.rgb},0.4)` }}>Protection</span>
                        <p className="text-[10px] leading-[1.6] mt-1 text-white/45">{insightData.protection}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════
              F. NEXT MOVES MATRIX
              ═══════════════════════════════════════════ */}
          {nextMoves.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.3, ease: EASE }}
              className="mx-6 mb-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-3 rounded-full" style={{ background: `rgba(${ACCENT.emerald.rgb},0.3)` }} />
                <span className={TYPE.micro} style={{ color: `rgba(${ACCENT.slate.rgb},0.3)` }}>
                  Next Moves
                </span>
                <div className="flex-1 h-px" style={{ background: `rgba(${ACCENT.slate.rgb},0.04)` }} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {nextMoves.map((move, i) => {
                  const cat = MOVE_CATEGORIES[move.category] || MOVE_CATEGORIES.navigate
                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.05, duration: 0.25, ease: EASE }}
                      onClick={() => {
                        if (move.route) window.location.href = move.route
                        else if (move.query) onExecuteCommand(move.query)
                      }}
                      className="group text-left rounded-xl transition-all duration-300 overflow-hidden"
                      style={{
                        background: SURFACE.recess,
                        border: `1px solid rgba(${cat.color},0.05)`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `rgba(${cat.color},0.04)`
                        e.currentTarget.style.borderColor = `rgba(${cat.color},0.15)`
                        e.currentTarget.style.transform = "translateY(-2px)"
                        e.currentTarget.style.boxShadow = `0 6px 20px rgba(${cat.color},0.06)`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = SURFACE.recess
                        e.currentTarget.style.borderColor = `rgba(${cat.color},0.05)`
                        e.currentTarget.style.transform = "translateY(0)"
                        e.currentTarget.style.boxShadow = "none"
                      }}
                    >
                      <div className="p-3.5">
                        {/* Category + urgency badges */}
                        <div className="flex items-center gap-1.5 mb-2">
                          <span
                            className="text-[7px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                            style={{
                              background: `rgba(${cat.color},0.1)`,
                              color: `rgba(${cat.color},0.65)`,
                            }}
                          >
                            {cat.label}
                          </span>
                          {move.urgency === "high" && (
                            <span
                              className="text-[7px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                              style={{
                                background: `rgba(${ACCENT.amber.rgb},0.08)`,
                                color: `rgba(${ACCENT.amber.rgb},0.5)`,
                              }}
                            >
                              Now
                            </span>
                          )}
                        </div>

                        {/* Icon + Title */}
                        <div className="flex items-start gap-2 mb-1.5">
                          <div
                            className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: `rgba(${cat.color},0.1)`, color: `rgba(${cat.color},0.7)` }}
                          >
                            <ActionIcon icon={move.icon} className="w-3 h-3" />
                          </div>
                          <span className="text-[11px] text-white/80 font-semibold leading-tight">{move.title}</span>
                        </div>

                        {/* Description */}
                        <p className="text-[9px] leading-[1.5] text-white/35 pl-8">
                          {move.description}
                        </p>
                      </div>

                      {/* Action indicator */}
                      <div
                        className="px-3.5 py-1.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{
                          background: `rgba(${cat.color},0.02)`,
                          borderTop: `1px solid rgba(${cat.color},0.05)`,
                        }}
                      >
                        <span className="text-[8px] font-mono" style={{ color: `rgba(${cat.color},0.35)` }}>
                          {move.route ? "Opens route" : "Summons workspace"}
                        </span>
                        {move.route ? (
                          <ExternalLink className="w-2.5 h-2.5" style={{ color: `rgba(${cat.color},0.4)` }} />
                        ) : (
                          <ArrowUpRight className="w-2.5 h-2.5" style={{ color: `rgba(${cat.color},0.4)` }} />
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════
              G. SOURCE / STATUS / DOCK TOOLS
              ═══════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mx-6 mb-5 flex items-center justify-between pt-3"
            style={{ borderTop: `1px solid rgba(${ACCENT.slate.rgb},0.04)` }}
          >
            <div className="flex items-center gap-3">
              <span className={TYPE.micro} style={{ color: `rgba(${ACCENT.slate.rgb},0.2)` }}>
                Phase 1.5 Command
              </span>
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-md"
                style={{ background: sourceStyle.bg }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: sourceStyle.dot }} />
                <span className="text-[8px] font-mono font-bold" style={{ color: sourceStyle.text }}>
                  {(result.sourceStatus || "live").toUpperCase()}
                </span>
              </div>
              {pinned && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md" style={{ background: `rgba(${ACCENT.blue.rgb},0.06)` }}>
                  <Pin className="w-2.5 h-2.5" style={{ color: `rgba(${ACCENT.blue.rgb},0.5)` }} />
                  <span className="text-[8px] font-mono" style={{ color: `rgba(${ACCENT.blue.rgb},0.4)` }}>Pinned</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button className="flex items-center gap-1 px-2 py-1 rounded-md text-[8px] font-mono transition-all hover:bg-white/[0.03]" style={{ color: `rgba(${ACCENT.slate.rgb},0.25)` }}>
                <History className="w-3 h-3" /> History
              </button>
              <button className="flex items-center gap-1 px-2 py-1 rounded-md text-[8px] font-mono transition-all hover:bg-white/[0.03]" style={{ color: `rgba(${ACCENT.slate.rgb},0.25)` }}>
                <Download className="w-3 h-3" /> Export
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
