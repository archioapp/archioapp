"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SURFACE, ACCENT, TYPE, RADIUS, GLOW } from "@/components/mtf/mtf-theme"
import {
  Sparkles, Target, Users, Bell, BookOpen,
  AlertTriangle, TrendingUp, CheckCircle, ArrowUpRight,
  ChevronRight, Bookmark, Clock,
} from "lucide-react"

/* ── Relevance Item Types ── */
type RelevanceType =
  | "ai_insight"
  | "mentor_update"
  | "forecast_outcome"
  | "challenge_alert"
  | "plan_reminder"
  | "community_relevant"
  | "goal_progress"
  | "behavior_nudge"

interface RelevanceItem {
  id: string
  type: RelevanceType
  title: string
  description: string
  timestamp: string
  actionLabel?: string
  actionUrl?: string
  priority: "high" | "medium" | "low"
  dismissed: boolean
}

const TYPE_CONFIG: Record<RelevanceType, { icon: typeof Sparkles; color: string; label: string }> = {
  ai_insight: { icon: Sparkles, color: ACCENT.purple.rgb, label: "AI Insight" },
  mentor_update: { icon: Users, color: ACCENT.amber.rgb, label: "Mentor" },
  forecast_outcome: { icon: Target, color: ACCENT.blue.rgb, label: "Forecast" },
  challenge_alert: { icon: AlertTriangle, color: ACCENT.rose.rgb, label: "Alert" },
  plan_reminder: { icon: Clock, color: ACCENT.cyan.rgb, label: "Plan" },
  community_relevant: { icon: Users, color: ACCENT.emerald.rgb, label: "Community" },
  goal_progress: { icon: TrendingUp, color: ACCENT.emerald.rgb, label: "Goal" },
  behavior_nudge: { icon: BookOpen, color: ACCENT.amber.rgb, label: "Nudge" },
}

/* ── Mock relevance data ── */
const RELEVANCE_ITEMS: RelevanceItem[] = [
  {
    id: "r1", type: "ai_insight",
    title: "Your EUR/USD London pattern is holding strong",
    description: "74% win rate over the last 20 London-session entries on EUR/USD. This is your strongest edge right now. Today's setup looks aligned with your historical entries.",
    timestamp: "Just now", priority: "high", dismissed: false,
    actionLabel: "View in Copilot", actionUrl: "/copilot",
  },
  {
    id: "r2", type: "forecast_outcome",
    title: "Forecast resolved: EUR/USD LONG -- WON",
    description: "Your forecast from 2 days ago resolved successfully at +42 pips. Your forecast accuracy is now 67.3%.",
    timestamp: "2h ago", priority: "medium", dismissed: false,
    actionLabel: "View Forecast", actionUrl: "/forecast",
  },
  {
    id: "r3", type: "mentor_update",
    title: "Marcus Wei shared a new market outlook",
    description: "Weekly outlook on EUR/USD with key levels mapped. His analysis aligns with your current bias. Worth reviewing before London open.",
    timestamp: "4h ago", priority: "medium", dismissed: false,
    actionLabel: "Read Analysis", actionUrl: "/hub",
  },
  {
    id: "r4", type: "challenge_alert",
    title: "FTMO Challenge: On track",
    description: "You are at 4.2% profit with 3.2% drawdown used. 5.8% remaining to target. You have traded 7 of the minimum 4 required days. Stay disciplined.",
    timestamp: "Today", priority: "high", dismissed: false,
  },
  {
    id: "r5", type: "behavior_nudge",
    title: "Friday NY sessions: handle with care",
    description: "Your historical discipline score on Friday NY sessions is 58/100 -- your lowest. Consider reducing position size or skipping this session today.",
    timestamp: "AI Pattern", priority: "medium", dismissed: false,
  },
  {
    id: "r6", type: "plan_reminder",
    title: "ECB Rate Decision at 08:30",
    description: "High-impact EUR event in 47 minutes. Your plan says: no trading 30 minutes before high-impact news. Consider closing any open positions or tightening stops.",
    timestamp: "47min", priority: "high", dismissed: false,
    actionLabel: "View Plan", actionUrl: "/copilot",
  },
  {
    id: "r7", type: "goal_progress",
    title: "Consistency streak: 5 days following plan",
    description: "You have followed your trading plan for 5 consecutive sessions. This is your longest streak this month. Keep going.",
    timestamp: "Today", priority: "low", dismissed: false,
  },
]

interface Props {
  className?: string
}

export function RelevanceStream({ className }: Props) {
  const [items, setItems] = useState(RELEVANCE_ITEMS)
  const [filter, setFilter] = useState<"all" | "high">("all")

  const visibleItems = items
    .filter(i => !i.dismissed)
    .filter(i => filter === "all" || i.priority === "high")

  const dismiss = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, dismissed: true } : i))
  }

  return (
    <div
      className={className}
      style={{
        background: SURFACE.card,
        borderRadius: RADIUS.card,
        border: `1px solid rgba(${ACCENT.purple.rgb},0.06)`,
      }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4" style={{ color: `rgba(${ACCENT.purple.rgb},0.5)` }} />
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] font-semibold" style={{ color: `rgba(${ACCENT.slate.rgb},0.4)` }}>
              What matters to you now
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {(["all", "high"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-2.5 py-1 rounded-lg text-[9px] font-mono uppercase tracking-wider font-semibold transition-all duration-150"
                style={{
                  background: filter === f ? `rgba(${ACCENT.purple.rgb},0.1)` : "transparent",
                  border: `1px solid rgba(${ACCENT.purple.rgb},${filter === f ? 0.15 : 0.04})`,
                  color: filter === f ? `rgba(${ACCENT.purple.rgb},0.7)` : `rgba(${ACCENT.slate.rgb},0.4)`,
                }}
              >
                {f === "all" ? "All" : "Priority"}
              </button>
            ))}
          </div>
        </div>

        {/* Stream items */}
        <div className="space-y-2.5">
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, i) => {
              const config = TYPE_CONFIG[item.type]
              const Icon = config.icon

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl group transition-all duration-200"
                  style={{
                    background: item.priority === "high"
                      ? `rgba(${config.color},0.03)`
                      : SURFACE.recess,
                    border: `1px solid rgba(${config.color},${item.priority === "high" ? 0.06 : 0.03})`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: `rgba(${config.color},0.08)`,
                        border: `1px solid rgba(${config.color},0.08)`,
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: `rgba(${config.color},0.7)` }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white text-[12px] font-semibold">{item.title}</span>
                        {item.priority === "high" && (
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: `rgba(${config.color},0.7)` }} />
                        )}
                      </div>
                      <p className="text-[11px] leading-[1.65] mb-2" style={{ color: `rgba(255,255,255,0.45)` }}>
                        {item.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-mono" style={{ color: `rgba(${ACCENT.slate.rgb},0.3)` }}>
                          {item.timestamp}
                        </span>
                        <span className="text-[8px] font-mono uppercase font-bold" style={{ color: `rgba(${config.color},0.4)` }}>
                          {config.label}
                        </span>
                        {item.actionLabel && (
                          <button
                            className="flex items-center gap-1 text-[9px] font-mono font-semibold transition-all duration-150 hover:scale-105 ml-auto"
                            style={{ color: `rgba(${config.color},0.6)` }}
                          >
                            {item.actionLabel}
                            <ArrowUpRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                        <button
                          onClick={() => dismiss(item.id)}
                          className="text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: `rgba(${ACCENT.slate.rgb},0.3)` }}
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {visibleItems.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="w-6 h-6 mx-auto mb-2" style={{ color: `rgba(${ACCENT.emerald.rgb},0.3)` }} />
            <p className="text-[12px]" style={{ color: `rgba(255,255,255,0.3)` }}>All caught up. Nothing needs your attention right now.</p>
          </div>
        )}
      </div>
    </div>
  )
}
