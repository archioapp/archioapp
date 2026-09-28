"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Trophy,
  Target,
  BarChart3,
  Flame,
  TrendingUp,
  TrendingDown,
  Clock,
  Award,
  Shield,
  Star,
  MessageSquare,
} from "lucide-react"

interface MemberProfileData {
  name: string
  avatar: string
  level: "Beginner" | "Intermediate" | "Advanced" | "Elite"
  rank: number
  joinDate: string
  bio: string
  stats: {
    winRate: number
    accuracy: number
    totalTrades: number
    avgRR: string
    totalPnl: string
    streak: number
    bestMonth: string
  }
  recentTrades: {
    pair: string
    direction: "LONG" | "SHORT"
    result: "win" | "loss"
    rr: string
  }[]
  badges: { name: string; icon: string; earned: string }[]
  activeServers: string[]
}

const PROFILES: Record<string, MemberProfileData> = {
  default: {
    name: "Alex Chen",
    avatar: "AC",
    level: "Advanced",
    rank: 2,
    joinDate: "Mar 2025",
    bio: "ICT methodology trader focusing on FX and Gold. Swing + intraday hybrid approach.",
    stats: {
      winRate: 76,
      accuracy: 89,
      totalTrades: 342,
      avgRR: "1.9",
      totalPnl: "+124.6R",
      streak: 4,
      bestMonth: "+31.2R (Jan)",
    },
    recentTrades: [
      { pair: "GBP/USD", direction: "SHORT", result: "win", rr: "+1.7R" },
      { pair: "XAU/USD", direction: "LONG", result: "win", rr: "+2.3R" },
      { pair: "EUR/USD", direction: "SHORT", result: "loss", rr: "-1R" },
      { pair: "NAS100", direction: "LONG", result: "win", rr: "+1.4R" },
      { pair: "BTC/USD", direction: "SHORT", result: "win", rr: "+2.8R" },
    ],
    badges: [
      { name: "Rising Star", icon: "star", earned: "Dec 2025" },
      { name: "Consistency King", icon: "target", earned: "Jan 2026" },
      { name: "5-Win Streak", icon: "flame", earned: "Jan 2026" },
    ],
    activeServers: ["Whale Room", "Gold Masters", "Mentor Hub"],
  },
}

const levelGradients = {
  Beginner: "from-slate-500 to-slate-600",
  Intermediate: "from-sky-500 to-blue-600",
  Advanced: "from-violet-500 to-indigo-600",
  Elite: "from-amber-500 to-orange-600",
}

const levelBorder = {
  Beginner: "ring-slate-500/30",
  Intermediate: "ring-sky-500/30",
  Advanced: "ring-violet-500/30",
  Elite: "ring-amber-500/30",
}

export function MemberProfile({
  isOpen,
  onClose,
  profileId = "default",
}: {
  isOpen: boolean
  onClose: () => void
  profileId?: string
}) {
  const profile = PROFILES[profileId] || PROFILES.default

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] max-h-[80vh] bg-[#111318] border border-white/10 rounded-2xl shadow-2xl z-40 overflow-hidden"
          >
            {/* Header Gradient */}
            <div className={`h-20 bg-gradient-to-r ${levelGradients[profile.level]} opacity-30`} />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-md bg-black/30 hover:bg-white/10 text-white/70 hover:text-white transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Info */}
            <div className="px-5 -mt-10 relative z-10">
              <div className="flex items-end gap-4 mb-4">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${levelGradients[profile.level]} flex items-center justify-center text-xl font-bold text-white ring-4 ${levelBorder[profile.level]} shadow-lg`}
                >
                  {profile.avatar}
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{profile.name}</h2>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-semibold bg-gradient-to-r ${levelGradients[profile.level]} text-white`}
                    >
                      {profile.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      Rank #{profile.rank}
                    </span>
                    <span className="text-[10px] text-slate-500">Joined {profile.joinDate}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{profile.bio}</p>
            </div>

            {/* Stats Grid */}
            <div className="px-5 mb-4">
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Win Rate", value: `${profile.stats.winRate}%`, color: "text-emerald-400" },
                  { label: "Accuracy", value: `${profile.stats.accuracy}%`, color: "text-sky-400" },
                  { label: "Total P&L", value: profile.stats.totalPnl, color: "text-emerald-400" },
                  { label: "Avg RR", value: profile.stats.avgRR, color: "text-white" },
                ].map((s) => (
                  <div key={s.label} className="p-2 rounded-xl bg-white/5 border border-white/5 text-center">
                    <p className={`text-sm font-bold font-mono ${s.color}`}>{s.value}</p>
                    <p className="text-[8px] text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-2 px-1">
                <span className="text-[10px] text-slate-500">
                  {profile.stats.totalTrades} total trades
                </span>
                {profile.stats.streak >= 2 && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-400">
                    <Flame className="w-3 h-3" />
                    {profile.stats.streak}-win streak
                  </span>
                )}
                <span className="text-[10px] text-slate-500">
                  Best: {profile.stats.bestMonth}
                </span>
              </div>
            </div>

            {/* Recent Trades */}
            <div className="px-5 mb-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Recent Trades</p>
              <div className="flex gap-1.5">
                {profile.recentTrades.map((t, i) => (
                  <div
                    key={i}
                    className={`flex-1 p-2 rounded-lg border text-center ${
                      t.result === "win"
                        ? "bg-emerald-500/5 border-emerald-500/20"
                        : "bg-red-500/5 border-red-500/20"
                    }`}
                  >
                    <p className="text-[9px] font-mono text-white font-bold">{t.pair}</p>
                    <div className="flex items-center justify-center gap-0.5 mt-0.5">
                      {t.direction === "LONG" ? (
                        <TrendingUp className={`w-2.5 h-2.5 ${t.result === "win" ? "text-emerald-400" : "text-red-400"}`} />
                      ) : (
                        <TrendingDown className={`w-2.5 h-2.5 ${t.result === "win" ? "text-emerald-400" : "text-red-400"}`} />
                      )}
                      <span
                        className={`text-[9px] font-mono font-bold ${
                          t.result === "win" ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {t.rr}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="px-5 mb-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Badges</p>
              <div className="flex gap-2">
                {profile.badges.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/5 border border-amber-500/20"
                  >
                    {b.icon === "star" && <Star className="w-3 h-3 text-amber-400" />}
                    {b.icon === "target" && <Target className="w-3 h-3 text-amber-400" />}
                    {b.icon === "flame" && <Flame className="w-3 h-3 text-amber-400" />}
                    <span className="text-[10px] text-amber-400 font-medium">{b.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Servers */}
            <div className="px-5 pb-5">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Active In</p>
              <div className="flex gap-1.5">
                {profile.activeServers.map((s, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-slate-400"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Footer */}
            <div className="px-5 py-3 border-t border-white/5 flex items-center gap-2 bg-black/20">
              <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                <MessageSquare className="w-3.5 h-3.5" />
                Message
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-violet-500/20 border border-violet-500/30 text-xs text-violet-400 hover:bg-violet-500/30 transition-all">
                <Award className="w-3.5 h-3.5" />
                View Trades
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
