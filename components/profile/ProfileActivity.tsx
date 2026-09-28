"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Activity,
  TrendingUp,
  Radio,
  Users,
  BookOpen,
  Award,
  Target,
  ChevronRight,
  Clock,
} from "lucide-react"
import type { ActivityItem, ActivityType } from "@/types/profile"

interface ProfileActivityProps {
  activity: ActivityItem[]
}

const activityIcons: Record<ActivityType, React.ComponentType<{ className?: string }>> = {
  trade: TrendingUp,
  forecast: Radio,
  "war-room": Users,
  journal: BookOpen,
  badge: Award,
  milestone: Target,
  "mentor-session": Users,
}

const activityColors: Record<ActivityType, string> = {
  trade: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  forecast: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  "war-room": "text-violet-400 bg-violet-500/10 border-violet-500/20",
  journal: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  badge: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  milestone: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  "mentor-session": "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
}

function getRelativeTime(timestamp: string): string {
  const now = new Date()
  const then = new Date(timestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return then.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function ProfileActivity({ activity }: ProfileActivityProps) {
  const [filter, setFilter] = useState<ActivityType | "all">("all")
  const [showAll, setShowAll] = useState(false)

  const filteredActivity = filter === "all" ? activity : activity.filter((a) => a.type === filter)
  const displayActivity = showAll ? filteredActivity : filteredActivity.slice(0, 5)

  const activityTypes: (ActivityType | "all")[] = ["all", "trade", "forecast", "war-room", "journal", "badge"]

  return (
    <div className="rounded-2xl bg-[#111318] border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-2 border-b border-white/5 flex gap-1 overflow-x-auto scrollbar-hide">
        {activityTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              filter === type
                ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                : "text-slate-500 hover:text-white hover:bg-white/5"
            }`}
          >
            {type === "all" ? "All" : type === "war-room" ? "War Rooms" : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="p-4 space-y-3">
        {displayActivity.length === 0 ? (
          <p className="text-center text-sm text-slate-500 py-4">No activity found</p>
        ) : (
          displayActivity.map((item, index) => {
            const Icon = activityIcons[item.type]
            const colors = activityColors[item.type]

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group cursor-pointer"
              >
                {/* Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${colors}`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm text-white font-medium truncate">{item.title}</p>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      {getRelativeTime(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{item.description}</p>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
              </motion.div>
            )
          })
        )}

        {/* Show More Button */}
        {filteredActivity.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full py-2 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            {showAll ? "Show Less" : `Show ${filteredActivity.length - 5} More`}
          </button>
        )}
      </div>
    </div>
  )
}
