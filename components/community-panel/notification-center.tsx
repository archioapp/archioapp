"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell,
  Radio,
  Target,
  Trophy,
  MessageSquare,
  Zap,
  Timer,
  TrendingUp,
  TrendingDown,
  Award,
  Users,
  CheckCheck,
  X,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

type NotifType = "signal" | "war-room" | "live" | "mention" | "review" | "leaderboard" | "forecast"

interface Notification {
  id: string
  type: NotifType
  title: string
  message: string
  time: string
  read: boolean
  server?: string
  actionLabel?: string
}

const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "signal",
    title: "New Signal: XAU/USD LONG",
    message: "Mentor Chen posted a verified signal with 94% rating",
    time: "2m ago",
    read: false,
    server: "Whale Room",
    actionLabel: "View Signal",
  },
  {
    id: "n2",
    type: "live",
    title: "Mentor Alex is LIVE",
    message: "NY Session Trading - analyzing Gold & EUR/USD setups",
    time: "5m ago",
    read: false,
    server: "Whale Room",
    actionLabel: "Join Stage",
  },
  {
    id: "n3",
    type: "war-room",
    title: "War Room Opened",
    message: "#short-btc-scalp deployed by Marcus - 34 traders active",
    time: "12m ago",
    read: false,
    server: "Crypto Elite",
    actionLabel: "Join Room",
  },
  {
    id: "n4",
    type: "review",
    title: "Mentor Review Received",
    message: "Alex rated your EUR/USD short 7.5/10 - \"Good structure read\"",
    time: "1h ago",
    read: true,
    actionLabel: "View Review",
  },
  {
    id: "n5",
    type: "mention",
    title: "You were mentioned",
    message: "SarahFX mentioned you in #forecast-feed: \"Great call @You\"",
    time: "2h ago",
    read: true,
    server: "Whale Room",
  },
  {
    id: "n6",
    type: "leaderboard",
    title: "Rank Change",
    message: "You moved up to #6 on the weekly leaderboard (+2 spots)",
    time: "3h ago",
    read: true,
  },
  {
    id: "n7",
    type: "forecast",
    title: "Gameplan Updated",
    message: "Daily Gameplan for Friday is now live - 3 forecasts posted",
    time: "6h ago",
    read: true,
    server: "Whale Room",
    actionLabel: "View Gameplan",
  },
  {
    id: "n8",
    type: "war-room",
    title: "War Room Expiring",
    message: "#nvda-earnings-play expires in 40m - 67 traders still active",
    time: "8h ago",
    read: true,
    server: "NY Session",
  },
]

const typeConfig: Record<NotifType, { icon: typeof Bell; color: string; bg: string }> = {
  signal: { icon: Target, color: "text-emerald-400", bg: "bg-emerald-500/20" },
  "war-room": { icon: Timer, color: "text-amber-400", bg: "bg-amber-500/20" },
  live: { icon: Radio, color: "text-red-400", bg: "bg-red-500/20" },
  mention: { icon: MessageSquare, color: "text-sky-400", bg: "bg-sky-500/20" },
  review: { icon: Award, color: "text-violet-400", bg: "bg-violet-500/20" },
  leaderboard: { icon: Trophy, color: "text-amber-400", bg: "bg-amber-500/20" },
  forecast: { icon: Zap, color: "text-indigo-400", bg: "bg-indigo-500/20" },
}

export function NotificationCenter({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const unreadCount = notifications.filter((n) => !n.read).length
  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute top-12 right-3 w-[340px] bg-[#111318] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <CheckCheck className="w-3 h-3" />
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-white/5">
            {(["all", "unread"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all capitalize ${
                  filter === f ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {f} {f === "unread" && unreadCount > 0 ? `(${unreadCount})` : ""}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <ScrollArea className="max-h-[400px]">
            <div className="p-2">
              {filtered.length === 0 ? (
                <div className="py-8 text-center">
                  <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">All caught up</p>
                </div>
              ) : (
                filtered.map((notif, idx) => {
                  const config = typeConfig[notif.type]
                  const Icon = config.icon
                  return (
                    <motion.button
                      key={notif.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => markRead(notif.id)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                        !notif.read
                          ? "bg-white/[0.04] hover:bg-white/[0.06]"
                          : "hover:bg-white/[0.03] opacity-70"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-white truncate">{notif.title}</span>
                          {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0" />}
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{notif.message}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[9px] text-slate-500">{notif.time}</span>
                          {notif.server && (
                            <>
                              <span className="text-[9px] text-slate-600">in</span>
                              <span className="text-[9px] text-slate-500">{notif.server}</span>
                            </>
                          )}
                        </div>
                        {notif.actionLabel && (
                          <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-md bg-white/5 text-[10px] text-sky-400 font-medium hover:bg-white/10 transition-colors">
                            {notif.actionLabel}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
