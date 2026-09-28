"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  TrendingUp,
  Target,
  BarChart3,
  Flame,
  Award,
  ChevronDown,
  Shield,
  Clock,
} from "lucide-react"
import type { PerformanceStats } from "@/types/profile"

interface ProfileStatsProps {
  stats: PerformanceStats
}

const trustLabels = {
  verified: { label: "Verified", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  linked: { label: "Linked", color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
  "mentor-reviewed": { label: "Reviewed", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  "self-reported": { label: "Self-Reported", color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20" },
  imported: { label: "Imported", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const [expanded, setExpanded] = useState(false)
  const [activeTimeframe, setActiveTimeframe] = useState<"7d" | "30d" | "all">("all")

  const timeframeData = {
    "7d": stats.last7Days,
    "30d": stats.last30Days,
    all: stats.allTime,
  }

  const currentData = timeframeData[activeTimeframe]
  const trust = trustLabels[stats.trustLevel]

  return (
    <div className="rounded-2xl bg-[#111318] border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-white">Performance</h3>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${trust.bg} ${trust.border} border`}>
          <Shield className="w-3 h-3" />
          <span className={`text-[9px] font-bold uppercase ${trust.color}`}>{trust.label}</span>
        </div>
      </div>

      {/* Timeframe Tabs */}
      <div className="px-4 py-2 border-b border-white/5 flex gap-1">
        {(["7d", "30d", "all"] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setActiveTimeframe(tf)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
              activeTimeframe === tf
                ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                : "text-slate-500 hover:text-white hover:bg-white/5"
            }`}
          >
            {tf === "7d" ? "7 Days" : tf === "30d" ? "30 Days" : "All Time"}
          </button>
        ))}
      </div>

      {/* Main Stats Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {/* Win Rate */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Win Rate</span>
            </div>
            <p className="text-xl font-bold font-mono text-emerald-400">{currentData.winRate}%</p>
            <div className="mt-1.5 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentData.winRate}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
              />
            </div>
          </div>

          {/* Total R */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Total R</span>
            </div>
            <p className={`text-xl font-bold font-mono ${currentData.r >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {currentData.r >= 0 ? "+" : ""}{currentData.r.toFixed(1)}R
            </p>
            <p className="text-[10px] text-slate-500 mt-1">{currentData.trades} trades</p>
          </div>

          {/* Avg RR */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Avg RR</span>
            </div>
            <p className="text-xl font-bold font-mono text-white">{stats.avgRR.toFixed(1)}</p>
          </div>

          {/* Streak */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Streak</span>
            </div>
            <p className="text-xl font-bold font-mono text-orange-400">{stats.currentStreak}</p>
            <p className="text-[10px] text-slate-500 mt-1">Best: {stats.longestStreak}</p>
          </div>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          {expanded ? "Show Less" : "Show Advanced Stats"}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>

        {/* Expanded Stats */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 mt-3 border-t border-white/5 space-y-3">
                {/* Advanced Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Profit Factor</span>
                    <p className="text-lg font-bold font-mono text-white mt-1">{stats.profitFactor?.toFixed(2) || "—"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Sharpe Ratio</span>
                    <p className="text-lg font-bold font-mono text-white mt-1">{stats.sharpeRatio?.toFixed(2) || "—"}</p>
                  </div>
                </div>

                {/* Best Month */}
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-amber-400/70 uppercase tracking-wider">Best Month</span>
                    <span className="text-xs text-amber-400 font-mono font-bold">+{stats.bestMonth.r.toFixed(1)}R</span>
                  </div>
                  <p className="text-sm text-amber-400 mt-1">{stats.bestMonth.month}</p>
                </div>

                {/* W/L Breakdown */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2">Win/Loss Breakdown</span>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-emerald-400">Wins</span>
                        <span className="text-emerald-400 font-mono font-bold">{stats.wins}</span>
                      </div>
                      <div className="h-2 bg-emerald-500/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${(stats.wins / stats.totalTrades) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-red-400">Losses</span>
                        <span className="text-red-400 font-mono font-bold">{stats.losses}</span>
                      </div>
                      <div className="h-2 bg-red-500/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${(stats.losses / stats.totalTrades) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
