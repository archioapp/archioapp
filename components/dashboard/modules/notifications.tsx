"use client"

import { motion } from "framer-motion"
import { SURFACE, ACCENT, TYPE, RADIUS, GLOW, ELEVATION } from "@/components/mtf/mtf-theme"
import type { Notification } from "../dashboard-types"
import { Bell, X, Check, ExternalLink, AlertTriangle, Info, Target, Users, Clock, ShieldCheck } from "lucide-react"

const TYPE_CONFIG: Record<string, { icon: any; color: string }> = {
  forecast_resolved: { icon: Target, color: ACCENT.blue.rgb },
  challenge_alert: { icon: AlertTriangle, color: ACCENT.amber.rgb },
  mentor_activity: { icon: Users, color: ACCENT.purple.rgb },
  community_relevance: { icon: Users, color: ACCENT.cyan.rgb },
  plan_compliance: { icon: ShieldCheck, color: ACCENT.emerald.rgb },
  reminder: { icon: Clock, color: ACCENT.slate.rgb },
}

const SEVERITY_COLOR = {
  info: ACCENT.blue.rgb,
  warning: ACCENT.amber.rgb,
  critical: ACCENT.rose.rgb,
}

interface Props {
  notifications: Notification[]
  onClose: () => void
  onMarkRead: (id: string) => void
}

export function NotificationsModule({ notifications, onClose, onMarkRead }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="fixed top-16 right-4 z-40 w-96 max-h-[70vh] overflow-y-auto"
      style={{
        background: SURFACE.card,
        borderRadius: RADIUS.card,
        border: `1px solid rgba(${ACCENT.purple.rgb},0.15)`,
        boxShadow: ELEVATION.tooltip,
      }}
    >
      {/* Header */}
      <div className="sticky top-0 p-4 flex items-center justify-between" style={{ background: `${SURFACE.card}`, borderBottom: `1px solid ${SURFACE.divider}` }}>
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" style={{ color: `rgba(${ACCENT.purple.rgb},0.6)` }} />
          <span className="text-white text-xs font-semibold">Notifications</span>
          <span
            className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold"
            style={{ background: `rgba(${ACCENT.purple.rgb},0.1)`, color: `rgba(${ACCENT.purple.rgb},0.7)` }}
          >
            {notifications.filter(n => !n.read).length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg transition-all duration-150 hover:scale-110"
          style={{ background: `rgba(${ACCENT.slate.rgb},0.08)` }}
        >
          <X className="w-3.5 h-3.5" style={{ color: `rgba(255,255,255,0.3)` }} />
        </button>
      </div>

      {/* Notifications list */}
      <div className="p-2">
        {notifications.map((notification, i) => {
          const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.reminder
          const Icon = config.icon
          const sevColor = SEVERITY_COLOR[notification.severity]

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="p-3 rounded-xl mb-1.5 transition-all duration-150 cursor-pointer hover:scale-[1.01]"
              style={{
                background: notification.read ? "transparent" : `rgba(${config.color},0.03)`,
                border: `1px solid rgba(${notification.read ? ACCENT.slate.rgb : config.color},0.04)`,
              }}
              onClick={() => onMarkRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: `rgba(${config.color},0.08)`,
                    border: `1px solid rgba(${config.color},0.1)`,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: `rgba(${config.color},0.7)` }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white text-[11px] font-semibold truncate">{notification.title}</span>
                    {!notification.read && (
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: `rgba(${sevColor},0.8)` }} />
                    )}
                  </div>
                  <p className="text-[10px] leading-relaxed" style={{ color: `rgba(255,255,255,0.45)` }}>
                    {notification.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[9px] font-mono" style={{ color: `rgba(${ACCENT.slate.rgb},0.35)` }}>{notification.timestamp}</span>
                    {notification.actionUrl && (
                      <span className="flex items-center gap-0.5 text-[9px] font-mono" style={{ color: `rgba(${ACCENT.purple.rgb},0.5)` }}>
                        View <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
