"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Trophy,
  Medal,
  TrendingUp,
  Target,
  BarChart3,
  Flame,
  Crown,
  ChevronUp,
  ChevronDown,
  Star,
  Zap,
  Shield,
  Award,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

type TimeRange = "weekly" | "monthly" | "all-time"
type SortBy = "pnl" | "winRate" | "accuracy" | "trades"

interface LeaderboardTrader {
  rank: number
  previousRank: number
  name: string
  avatar: string
  level: "Beginner" | "Intermediate" | "Advanced" | "Elite"
  stats: {
    pnl: string
    pnlValue: number
    winRate: number
    accuracy: number
    trades: number
    avgRR: string
    bestTrade: string
    streak: number
  }
  badges: string[]
  isCurrentUser?: boolean
}

const LEADERBOARD: LeaderboardTrader[] = [
  {
    rank: 1,
    previousRank: 1,
    name: "David Park",
    avatar: "DP",
    level: "Elite",
    stats: {
      pnl: "+42.6R",
      pnlValue: 42.6,
      winRate: 82,
      accuracy: 91,
      trades: 34,
      avgRR: "2.4",
      bestTrade: "+8.2R BTC",
      streak: 7,
    },
    badges: ["Top Trader", "7-Win Streak", "Mentor Approved"],
  },
  {
    rank: 2,
    previousRank: 4,
    name: "Alex Chen",
    avatar: "AC",
    level: "Advanced",
    stats: {
      pnl: "+31.2R",
      pnlValue: 31.2,
      winRate: 76,
      accuracy: 89,
      trades: 28,
      avgRR: "1.9",
      bestTrade: "+5.1R GBP/USD",
      streak: 4,
    },
    badges: ["Rising Star", "Consistency King"],
  },
  {
    rank: 3,
    previousRank: 2,
    name: "Marcus Webb",
    avatar: "MW",
    level: "Advanced",
    stats: {
      pnl: "+28.4R",
      pnlValue: 28.4,
      winRate: 71,
      accuracy: 84,
      trades: 41,
      avgRR: "2.1",
      bestTrade: "+6.3R NAS100",
      streak: 2,
    },
    badges: ["Volume Trader", "Scalp Master"],
  },
  {
    rank: 4,
    previousRank: 3,
    name: "Sophia Reyes",
    avatar: "SR",
    level: "Intermediate",
    stats: {
      pnl: "+19.8R",
      pnlValue: 19.8,
      winRate: 65,
      accuracy: 72,
      trades: 22,
      avgRR: "2.3",
      bestTrade: "+4.6R XAU/USD",
      streak: 3,
    },
    badges: ["Most Improved"],
  },
  {
    rank: 5,
    previousRank: 7,
    name: "James Liu",
    avatar: "JL",
    level: "Advanced",
    stats: {
      pnl: "+16.5R",
      pnlValue: 16.5,
      winRate: 69,
      accuracy: 78,
      trades: 19,
      avgRR: "1.8",
      bestTrade: "+3.8R EUR/USD",
      streak: 1,
    },
    badges: ["Sniper Entry"],
  },
  {
    rank: 6,
    previousRank: 5,
    name: "You",
    avatar: "Y",
    level: "Intermediate",
    stats: {
      pnl: "+12.1R",
      pnlValue: 12.1,
      winRate: 62,
      accuracy: 70,
      trades: 15,
      avgRR: "1.6",
      bestTrade: "+3.2R XAU/USD",
      streak: 2,
    },
    badges: ["Active Learner"],
    isCurrentUser: true,
  },
  {
    rank: 7,
    previousRank: 6,
    name: "Emma Li",
    avatar: "EL",
    level: "Beginner",
    stats: {
      pnl: "+4.3R",
      pnlValue: 4.3,
      winRate: 52,
      accuracy: 58,
      trades: 18,
      avgRR: "1.2",
      bestTrade: "+2.1R EUR/USD",
      streak: 0,
    },
    badges: ["Persistent"],
  },
  {
    rank: 8,
    previousRank: 10,
    name: "Carlos Vega",
    avatar: "CV",
    level: "Intermediate",
    stats: {
      pnl: "+3.8R",
      pnlValue: 3.8,
      winRate: 55,
      accuracy: 63,
      trades: 12,
      avgRR: "1.4",
      bestTrade: "+2.8R GBP/USD",
      streak: 1,
    },
    badges: [],
  },
]

const levelColors = {
  Beginner: "text-slate-400",
  Intermediate: "text-sky-400",
  Advanced: "text-violet-400",
  Elite: "text-amber-400",
}

const podiumGradients = [
  "from-amber-400 via-yellow-500 to-amber-600",
  "from-slate-300 via-slate-400 to-slate-500",
  "from-amber-600 via-amber-700 to-orange-700",
]

export function Leaderboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly")
  const [sortBy, setSortBy] = useState<SortBy>("pnl")

  const sorted = [...LEADERBOARD].sort((a, b) => {
    if (sortBy === "pnl") return b.stats.pnlValue - a.stats.pnlValue
    if (sortBy === "winRate") return b.stats.winRate - a.stats.winRate
    if (sortBy === "accuracy") return b.stats.accuracy - a.stats.accuracy
    return b.stats.trades - a.stats.trades
  })

  const top3 = sorted.slice(0, 3)
  const rest = sorted.slice(3)

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-white">Leaderboard</span>
          </div>
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
            {(["weekly", "monthly", "all-time"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all capitalize ${
                  timeRange === t ? "bg-amber-500/20 text-amber-400" : "text-slate-400 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-500 mr-1">Sort:</span>
          {(
            [
              { id: "pnl" as const, label: "P&L", icon: TrendingUp },
              { id: "winRate" as const, label: "Win Rate", icon: Target },
              { id: "accuracy" as const, label: "Accuracy", icon: BarChart3 },
              { id: "trades" as const, label: "Volume", icon: Zap },
            ] as const
          ).map((s) => (
            <button
              key={s.id}
              onClick={() => setSortBy(s.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                sortBy === s.id
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <s.icon className="w-3 h-3" />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Podium - Top 3 */}
          <div className="flex items-end justify-center gap-3 pb-4">
            {[1, 0, 2].map((podiumIdx) => {
              const trader = top3[podiumIdx]
              if (!trader) return null
              const height = podiumIdx === 0 ? "h-28" : podiumIdx === 1 ? "h-20" : "h-16"
              const actualRank = podiumIdx + 1
              return (
                <motion.div
                  key={trader.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: podiumIdx * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative mb-2">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${podiumGradients[podiumIdx]} flex items-center justify-center text-sm font-bold text-white ring-2 ring-white/20 ${
                        podiumIdx === 0 ? "w-14 h-14" : ""
                      }`}
                    >
                      {trader.avatar}
                    </div>
                    {podiumIdx === 0 && (
                      <Crown className="w-5 h-5 text-amber-400 absolute -top-3 left-1/2 -translate-x-1/2" />
                    )}
                    <div
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${
                        podiumIdx === 0 ? "bg-amber-500" : podiumIdx === 1 ? "bg-slate-400" : "bg-amber-700"
                      }`}
                    >
                      {actualRank}
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-white mb-0.5 text-center">{trader.name}</p>
                  <p className="text-[10px] text-emerald-400 font-mono font-bold">{trader.stats.pnl}</p>
                  <p className="text-[9px] text-slate-500">WR {trader.stats.winRate}%</p>
                  {/* Podium bar */}
                  <div
                    className={`${height} w-20 mt-2 rounded-t-lg bg-gradient-to-t ${podiumGradients[podiumIdx]} opacity-20`}
                  />
                </motion.div>
              )
            })}
          </div>

          {/* Rest of list */}
          <div className="space-y-1.5">
            {rest.map((trader, idx) => {
              const rankChange = trader.previousRank - trader.rank
              return (
                <motion.div
                  key={trader.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    trader.isCurrentUser
                      ? "bg-indigo-500/10 border border-indigo-500/30 ring-1 ring-indigo-500/20"
                      : "bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10"
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 text-center">
                    <span className="text-sm font-bold text-slate-400 font-mono">{trader.rank}</span>
                    {rankChange !== 0 && (
                      <div
                        className={`flex items-center justify-center gap-0.5 text-[9px] ${
                          rankChange > 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {rankChange > 0 ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                        {Math.abs(rankChange)}
                      </div>
                    )}
                  </div>

                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                      trader.isCurrentUser
                        ? "bg-gradient-to-br from-indigo-500 to-violet-600 ring-2 ring-indigo-500/30"
                        : "bg-gradient-to-br from-slate-600 to-slate-700"
                    }`}
                  >
                    {trader.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${trader.isCurrentUser ? "text-indigo-300" : "text-white"}`}>
                        {trader.name}
                      </span>
                      <span className={`text-[9px] font-medium ${levelColors[trader.level]}`}>{trader.level}</span>
                      {trader.stats.streak >= 3 && (
                        <span className="flex items-center gap-0.5 text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                          <Flame className="w-2.5 h-2.5" />
                          {trader.stats.streak}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {trader.badges.slice(0, 2).map((badge, i) => (
                        <span
                          key={i}
                          className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500 border border-white/5"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-xs font-mono font-bold text-emerald-400">{trader.stats.pnl}</p>
                      <p className="text-[9px] text-slate-500">{trader.stats.trades} trades</p>
                    </div>
                    <div>
                      <p className="text-xs font-mono font-bold text-white">{trader.stats.winRate}%</p>
                      <p className="text-[9px] text-slate-500">win rate</p>
                    </div>
                    <div className="w-12">
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            trader.stats.accuracy >= 80
                              ? "bg-emerald-500"
                              : trader.stats.accuracy >= 60
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${trader.stats.accuracy}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-slate-500 text-center mt-0.5">{trader.stats.accuracy}%</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Your Position Summary (if scrolled past) */}
          <div className="mt-4 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-white">Your Standing</span>
              </div>
              <span className="text-xs text-indigo-400 font-mono">Rank #6 of 48 traders</span>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-3">
              {[
                { label: "P&L", value: "+12.1R", color: "text-emerald-400" },
                { label: "Win Rate", value: "62%", color: "text-white" },
                { label: "Avg RR", value: "1.6", color: "text-white" },
                { label: "To Top 5", value: "+4.4R", color: "text-amber-400" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className={`text-sm font-bold font-mono ${s.color}`}>{s.value}</p>
                  <p className="text-[9px] text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
