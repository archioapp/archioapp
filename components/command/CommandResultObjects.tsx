"use client"

import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  User,
  BarChart3,
  Zap,
} from "lucide-react"
import type {
  ResultObject,
  ForecastCardData,
  EntryCardData,
  MentorCardData,
  AccountCardData,
  ComparisonBoardData,
  StatGridData,
  MacroPanelData,
  PlanChecklistData,
  AlertBannerData,
  WinRateTableData,
  SuggestionChip,
} from "@/lib/command/types"

const EASE = [0.22, 1, 0.36, 1] as const

/* ── Forecast Card ── */
function ForecastCard({ data }: { data: ForecastCardData }) {
  const isLong = data.direction === "LONG"
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="rounded-xl p-3 border transition-all duration-200 hover:border-white/16"
      style={{
        background: "linear-gradient(180deg, rgba(14,18,32,0.95) 0%, rgba(11,15,26,0.92) 100%)",
        borderColor: "rgba(148,163,184,0.07)",
        boxShadow: "0 0 24px rgba(139,92,246,0.04), 0 1px 3px rgba(0,0,0,0.3)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-white/90">{data.pair}</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isLong ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"}`}>
            {data.direction}
          </span>
        </div>
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
          data.status === "hit_tp" ? "bg-emerald-500/15 text-emerald-400" :
          data.status === "hit_sl" ? "bg-rose-500/15 text-rose-400" :
          data.status === "active" ? "bg-cyan-500/15 text-cyan-400" :
          "bg-slate-500/15 text-slate-400"
        }`}>
          {data.status.replace("_", " ").toUpperCase()}
        </span>
      </div>
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-5 h-5 rounded-md bg-purple-500/20 flex items-center justify-center">
          <User className="w-3 h-3 text-purple-400" />
        </div>
        <span className="text-[11px] text-white/70">{data.mentor}</span>
        <span className="text-[10px] text-white/30 ml-auto">{data.confidence}% conf.</span>
      </div>
      {data.confluences.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {data.confluences.slice(0, 3).map((c) => (
            <span key={c} className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300/70 font-mono">
              {c}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

/* ── Entry Card ── */
function EntryCard({ data }: { data: EntryCardData }) {
  const isWin = data.pnl > 0
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="rounded-xl p-3 border transition-all duration-200 hover:border-white/16"
      style={{
        background: "linear-gradient(180deg, rgba(14,18,32,0.95) 0%, rgba(11,15,26,0.92) 100%)",
        borderColor: "rgba(148,163,184,0.07)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-white/90">{data.pair}</span>
          <span className={`text-[10px] font-bold ${data.direction === "LONG" ? "text-emerald-400" : "text-rose-400"}`}>
            {data.direction}
          </span>
        </div>
        <span className={`text-sm font-mono font-bold ${isWin ? "text-emerald-400" : "text-rose-400"}`}>
          {isWin ? "+" : ""}{data.rMultiple.toFixed(1)}R
        </span>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-white/50">
        <span>{data.session}</span>
        <span>{data.setup}</span>
        {data.accountName && <span className="ml-auto text-purple-300/50">{data.accountName}</span>}
      </div>
    </motion.div>
  )
}

/* ── Mentor Card ── */
function MentorCard({ data }: { data: MentorCardData }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="rounded-xl p-3 border transition-all duration-200 hover:border-white/16"
      style={{
        background: "linear-gradient(180deg, rgba(14,18,32,0.95) 0%, rgba(11,15,26,0.92) 100%)",
        borderColor: "rgba(148,163,184,0.07)",
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/20 flex items-center justify-center text-sm font-bold text-white">
          {data.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white/90 truncate">{data.name}</span>
            {data.isFollowed && <span className="text-[8px] px-1 py-0.5 rounded bg-emerald-500/15 text-emerald-400">FOLLOWING</span>}
          </div>
          <div className="flex items-center gap-3 text-[10px] text-white/50 mt-0.5">
            <span>{data.accuracy}% acc.</span>
            <span>{data.totalCalls} calls</span>
            <span>{data.winRate}% WR</span>
          </div>
        </div>
      </div>
      {data.specialization.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {data.specialization.map((s) => (
            <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300/70">
              {s}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

/* ── Account Card ── */
function AccountCard({ data }: { data: AccountCardData }) {
  const typeColors: Record<string, string> = {
    prop: "bg-amber-500/15 text-amber-400",
    funded: "bg-emerald-500/15 text-emerald-400",
    personal: "bg-cyan-500/15 text-cyan-400",
    demo: "bg-slate-500/15 text-slate-400",
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="rounded-xl p-3 border transition-all duration-200 hover:border-white/16"
      style={{
        background: "linear-gradient(180deg, rgba(14,18,32,0.95) 0%, rgba(11,15,26,0.92) 100%)",
        borderColor: "rgba(148,163,184,0.07)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-white/90">{data.name}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${typeColors[data.type] || typeColors.demo}`}>
          {data.type.toUpperCase()}{data.phase ? ` ${data.phase}` : ""}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-[10px] text-white/40 font-mono uppercase">Balance</div>
          <div className="text-xs font-mono font-bold text-white/90">${data.balance.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-[10px] text-white/40 font-mono uppercase">DD</div>
          <div className={`text-xs font-mono font-bold ${data.drawdown > 5 ? "text-rose-400" : data.drawdown > 3 ? "text-amber-400" : "text-emerald-400"}`}>
            {data.drawdown.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-[10px] text-white/40 font-mono uppercase">WR</div>
          <div className="text-xs font-mono font-bold text-white/90">{data.winRate}%</div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Comparison Board ── */
function ComparisonBoard({ data }: { data: ComparisonBoardData }) {
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-400",
    rose: "text-rose-400",
    amber: "text-amber-400",
    slate: "text-slate-400",
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="rounded-xl border overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(14,18,32,0.95) 0%, rgba(11,15,26,0.92) 100%)",
        borderColor: "rgba(148,163,184,0.07)",
      }}
    >
      <div className="px-3 py-2 border-b" style={{ borderColor: "rgba(148,163,184,0.07)" }}>
        <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">{data.title}</span>
      </div>
      <div className="grid grid-cols-3 px-3 py-1.5 border-b text-[10px] font-mono uppercase tracking-wider text-white/30" style={{ borderColor: "rgba(148,163,184,0.05)" }}>
        <span>Metric</span>
        <span className="text-center">{data.leftLabel}</span>
        <span className="text-center">{data.rightLabel}</span>
      </div>
      {data.metrics.map((m, i) => (
        <div key={i} className="grid grid-cols-3 px-3 py-2 border-b last:border-b-0 text-xs" style={{ borderColor: "rgba(148,163,184,0.04)" }}>
          <span className="text-white/60">{m.label}</span>
          <span className={`text-center font-mono font-semibold ${m.leftColor ? colorMap[m.leftColor] : "text-white/90"}`}>{m.leftValue}</span>
          <span className={`text-center font-mono font-semibold ${m.rightColor ? colorMap[m.rightColor] : "text-white/90"}`}>{m.rightValue}</span>
        </div>
      ))}
    </motion.div>
  )
}

/* ── Stat Grid ── */
function StatGrid({ data }: { data: StatGridData }) {
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-400",
    rose: "text-rose-400",
    amber: "text-amber-400",
    cyan: "text-cyan-400",
    purple: "text-purple-400",
    slate: "text-slate-400",
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-2 gap-2"
    >
      {data.items.map((item, i) => (
        <div
          key={i}
          className="rounded-xl p-3 border text-center"
          style={{
            background: "linear-gradient(180deg, rgba(14,18,32,0.95) 0%, rgba(11,15,26,0.92) 100%)",
            borderColor: "rgba(148,163,184,0.07)",
          }}
        >
          <div className="text-[9px] font-mono uppercase tracking-wider text-white/40 mb-1">{item.label}</div>
          <div className={`text-lg font-mono font-bold ${item.color ? colorMap[item.color] : "text-white/90"}`}>{item.value}</div>
          {item.change !== undefined && (
            <div className={`text-[10px] font-mono mt-0.5 ${item.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {item.change >= 0 ? "+" : ""}{item.change}%
            </div>
          )}
        </div>
      ))}
    </motion.div>
  )
}

/* ── Macro Panel ── */
function MacroPanel({ data }: { data: MacroPanelData }) {
  const impactColors: Record<string, string> = {
    high: "bg-rose-500/15 text-rose-400",
    medium: "bg-amber-500/15 text-amber-400",
    low: "bg-slate-500/15 text-slate-400",
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="rounded-xl border overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(14,18,32,0.95) 0%, rgba(11,15,26,0.92) 100%)",
        borderColor: "rgba(148,163,184,0.07)",
      }}
    >
      <div className="px-3 py-2 border-b flex items-center gap-2" style={{ borderColor: "rgba(148,163,184,0.07)" }}>
        <Zap className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">Macro Events</span>
      </div>
      {data.events.map((event, i) => (
        <div key={i} className="px-3 py-2.5 border-b last:border-b-0 flex items-start gap-2" style={{ borderColor: "rgba(148,163,184,0.04)" }}>
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold mt-0.5 ${impactColors[event.impact]}`}>
            {event.impact.toUpperCase()}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white/90">{event.name}</div>
            <div className="flex items-center gap-2 text-[10px] text-white/50 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>{event.time}</span>
              <span className="text-white/30">|</span>
              <span>{event.currency}</span>
            </div>
            {event.affectedPairs.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {event.affectedPairs.map((p) => (
                  <span key={p} className="text-[8px] px-1 py-0.5 rounded bg-amber-500/10 text-amber-300/60 font-mono">{p}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </motion.div>
  )
}

/* ── Plan Checklist ── */
function PlanChecklist({ data }: { data: PlanChecklistData }) {
  const statusIcons: Record<string, React.ReactNode> = {
    "on-track": <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
    warning: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
    violation: <XCircle className="w-3.5 h-3.5 text-rose-400" />,
    pending: <Clock className="w-3.5 h-3.5 text-slate-400" />,
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="rounded-xl border overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(14,18,32,0.95) 0%, rgba(11,15,26,0.92) 100%)",
        borderColor: "rgba(148,163,184,0.07)",
      }}
    >
      <div className="px-3 py-2 border-b flex items-center justify-between" style={{ borderColor: "rgba(148,163,184,0.07)" }}>
        <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">Plan Compliance</span>
        <span className={`text-sm font-mono font-bold ${data.compliance >= 80 ? "text-emerald-400" : data.compliance >= 50 ? "text-amber-400" : "text-rose-400"}`}>
          {data.compliance}%
        </span>
      </div>
      {data.items.map((item, i) => (
        <div key={i} className="px-3 py-2 border-b last:border-b-0 flex items-center gap-2.5" style={{ borderColor: "rgba(148,163,184,0.04)" }}>
          {statusIcons[item.status]}
          <div className="flex-1 min-w-0">
            <span className="text-xs text-white/80">{item.label}</span>
            {item.detail && <span className="text-[10px] text-white/40 ml-2">{item.detail}</span>}
          </div>
        </div>
      ))}
    </motion.div>
  )
}

/* ── Alert Banner ── */
function AlertBanner({ data }: { data: AlertBannerData }) {
  const styles: Record<string, { bg: string; border: string; icon: React.ReactNode }> = {
    warning: { bg: "bg-amber-500/8", border: "border-amber-500/20", icon: <AlertTriangle className="w-4 h-4 text-amber-400" /> },
    info: { bg: "bg-cyan-500/8", border: "border-cyan-500/20", icon: <Info className="w-4 h-4 text-cyan-400" /> },
    success: { bg: "bg-emerald-500/8", border: "border-emerald-500/20", icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
    danger: { bg: "bg-rose-500/8", border: "border-rose-500/20", icon: <AlertTriangle className="w-4 h-4 text-rose-400" /> },
  }
  const s = styles[data.type] || styles.info
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: EASE }}
      className={`rounded-xl p-3 border ${s.bg} ${s.border} flex items-start gap-2.5`}
    >
      {s.icon}
      <div>
        <div className="text-xs font-semibold text-white/90">{data.title}</div>
        <div className="text-[11px] text-white/60 mt-0.5">{data.message}</div>
      </div>
    </motion.div>
  )
}

/* ── Suggestion Chips Row ── */
export function SuggestionChips({
  chips,
  onSelect,
}: {
  chips: SuggestionChip[]
  onSelect: (chip: SuggestionChip) => void
}) {
  const categoryColors: Record<string, string> = {
    compare: "border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/30",
    drill: "border-purple-500/20 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/30",
    explain: "border-amber-500/20 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/30",
    navigate: "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30",
    action: "border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30",
    synthesize: "border-blue-500/20 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30",
    monitor: "border-slate-500/20 text-slate-400 hover:bg-slate-500/10 hover:border-slate-500/30",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15, ease: EASE }}
      className="flex flex-wrap gap-1.5 mt-2"
    >
      {chips.map((chip, i) => (
        <motion.button
          key={chip.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.05 * i, ease: EASE }}
          onClick={() => onSelect(chip)}
          className={`text-[10px] px-2.5 py-1 rounded-lg border font-medium transition-all duration-200 ${categoryColors[chip.category] || categoryColors.drill}`}
        >
          {chip.label}
        </motion.button>
      ))}
    </motion.div>
  )
}

/* ── Main Renderer ── */
export function RenderResultObject({ obj }: { obj: ResultObject }) {
  switch (obj.type) {
    case "forecast-card": {
      const items = Array.isArray(obj.data) ? obj.data : [obj.data]
      return (
        <div className="space-y-2">
          {(items as ForecastCardData[]).map((d) => (
            <ForecastCard key={d.id} data={d} />
          ))}
        </div>
      )
    }
    case "entry-card": {
      const items = Array.isArray(obj.data) ? obj.data : [obj.data]
      return (
        <div className="space-y-2">
          {(items as EntryCardData[]).map((d) => (
            <EntryCard key={d.id} data={d} />
          ))}
        </div>
      )
    }
    case "mentor-card": {
      const items = Array.isArray(obj.data) ? obj.data : [obj.data]
      return (
        <div className="space-y-2">
          {(items as MentorCardData[]).map((d) => (
            <MentorCard key={d.id} data={d} />
          ))}
        </div>
      )
    }
    case "account-card": {
      const items = Array.isArray(obj.data) ? obj.data : [obj.data]
      return (
        <div className="space-y-2">
          {(items as AccountCardData[]).map((d) => (
            <AccountCard key={d.id} data={d} />
          ))}
        </div>
      )
    }
    case "comparison-board":
      return <ComparisonBoard data={obj.data as ComparisonBoardData} />
    case "stat-grid":
      return <StatGrid data={obj.data as StatGridData} />
    case "macro-panel":
      return <MacroPanel data={obj.data as MacroPanelData} />
    case "plan-checklist":
      return <PlanChecklist data={obj.data as PlanChecklistData} />
    case "alert-banner":
      return <AlertBanner data={obj.data as AlertBannerData} />
    case "summary-text":
      return (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[11px] text-white/70 leading-relaxed"
        >
          {obj.data as string}
        </motion.p>
      )
    default:
      return null
  }
}
