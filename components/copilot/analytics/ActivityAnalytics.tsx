"use client"

import { useState, useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"

interface ActivityData {
  counts: {
    alertsToday: number
    actionsCompleted: number
    avgResponseTime: number
  }
  recentAlerts: Array<{
    id: string
    title: string
    message: string
    timestamp: number
    category: "trading" | "market" | "system"
    priority: "high" | "medium" | "low"
    metadata?: {
      instrument?: string
      value?: number
      change?: number
    }
  }>
  activityByHour: Array<number>
  topCategories: Array<{ label: string; value: number }>
}

interface ActivityAnalyticsProps {
  data?: ActivityData
}

// Real-time Activity Stream Chart
const RealTimeActivityStream = ({ data }: { data: number[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const maxValue = Math.max(...data, 1)

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Draw activity line
    if (data.length > 1) {
      const gradient = ctx.createLinearGradient(0, 0, width, 0)
      gradient.addColorStop(0, "rgba(16, 185, 129, 0.8)")
      gradient.addColorStop(1, "rgba(6, 182, 212, 0.8)")

      ctx.strokeStyle = gradient
      ctx.lineWidth = 2
      ctx.beginPath()

      data.forEach((value, index) => {
        const x = (width / (data.length - 1)) * index
        const y = height - (value / maxValue) * height

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Draw area under curve
      ctx.globalAlpha = 0.2
      ctx.fillStyle = gradient
      ctx.lineTo(width, height)
      ctx.lineTo(0, height)
      ctx.closePath()
      ctx.fill()
      ctx.globalAlpha = 1
    }

    // Animate
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [data, currentIndex])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={200}
        height={60}
        className="w-full h-15 rounded-lg bg-gradient-to-r from-black/20 to-black/10"
      />
      <div className="absolute top-1 right-1 flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs text-emerald-400 font-mono">Live</span>
      </div>
    </div>
  )
}

// Enhanced Alert Card
const EnhancedAlertCard = ({
  alert,
  onClick,
}: {
  alert: ActivityData["recentAlerts"][0]
  onClick: () => void
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          bg: "from-red-500/20 to-orange-500/20",
          border: "border-red-500/40",
          text: "text-red-300",
          dot: "bg-red-500",
        }
      case "medium":
        return {
          bg: "from-yellow-500/20 to-orange-500/20",
          border: "border-yellow-500/40",
          text: "text-yellow-300",
          dot: "bg-yellow-500",
        }
      case "low":
        return {
          bg: "from-blue-500/20 to-cyan-500/20",
          border: "border-cyan-500/40",
          text: "text-cyan-300",
          dot: "bg-cyan-500",
        }
      default:
        return {
          bg: "from-gray-500/20 to-gray-600/20",
          border: "border-gray-500/40",
          text: "text-gray-300",
          dot: "bg-gray-500",
        }
    }
  }

  const colors = getPriorityColor(alert.priority)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`premium-glass-card p-3 cursor-pointer group bg-gradient-to-r ${colors.bg} border ${colors.border}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Priority indicator */}
        <motion.div
          className={`w-3 h-3 rounded-full ${colors.dot} shadow-lg mt-1 flex-shrink-0`}
          animate={{
            scale: alert.priority === "high" ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: alert.priority === "high" ? Number.POSITIVE_INFINITY : 0,
          }}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-semibold text-white truncate">{alert.title}</h4>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${colors.border} ${colors.text}`}>
                {alert.category}
              </span>
              <span className="text-xs text-white/60">
                {new Date(alert.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          <p className="text-xs text-white/80 leading-relaxed line-clamp-2">{alert.message}</p>

          {/* Metadata */}
          {alert.metadata && (
            <div className="flex items-center gap-3 mt-2 text-xs">
              {alert.metadata.instrument && (
                <div className="flex items-center gap-1">
                  <span className="text-white/60">Instrument:</span>
                  <span className="text-white font-medium">{alert.metadata.instrument}</span>
                </div>
              )}
              {alert.metadata.value && (
                <div className="flex items-center gap-1">
                  <span className="text-white/60">Value:</span>
                  <span
                    className={`font-medium ${alert.metadata.change && alert.metadata.change < 0 ? "text-red-400" : "text-emerald-400"}`}
                  >
                    {alert.metadata.value}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Activity Pace Strip
const ActivityPaceStrip = ({ data }: { data: number[] }) => {
  const [currentHour, setCurrentHour] = useState(new Date().getHours())
  const maxValue = Math.max(...data, 1)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(new Date().getHours())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-2">
      <div className="flex gap-0.5">
        {data.map((value, index) => (
          <div
            key={index}
            className={`flex-1 bg-white/10 rounded-sm overflow-hidden relative transition-all duration-300 ${
              index === currentHour ? "ring-2 ring-emerald-400/50" : ""
            }`}
            style={{ height: "20px" }}
            title={`${index}:00 - ${value} activities ${index === currentHour ? "(current)" : ""}`}
          >
            <div
              className="bg-gradient-to-t from-emerald-500 to-cyan-400 transition-all duration-1000 ease-out relative"
              style={{
                height: `${(value / maxValue) * 100}%`,
                minHeight: value > 0 ? "2px" : "0",
                boxShadow: value > 0 ? "0 0 4px rgba(16, 185, 129, 0.4)" : "none",
              }}
            >
              {value > 0 && (
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent animate-pulse" />
              )}
            </div>
            {index === currentHour && (
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between text-xs text-white/60">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:59</span>
      </div>
    </div>
  )
}

export function ActivityAnalytics({ data }: ActivityAnalyticsProps) {
  const [realTimeData, setRealTimeData] = useState<number[]>([])

  useEffect(() => {
    const generateData = () => {
      const newData = Array.from({ length: 20 }, (_, i) => {
        return Math.sin(i * 0.3) * 30 + Math.random() * 15 + 50
      })
      setRealTimeData(newData)
    }

    generateData()
    const interval = setInterval(generateData, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!data) {
    return (
      <div className="h-full flex flex-col p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm uppercase tracking-wide text-white/60 font-semibold">Activity Hub</div>
          <div className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
            Initializing...
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-emerald-400 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-sm text-white/60 mb-2">No activity data yet</div>
            <button
              className="premium-glass-action-button text-xs px-4 py-2"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("copilot:chat:ask", {
                    detail: {
                      threadType: "activity",
                      text: "Show me my recent trading activity and alerts.",
                    },
                  }),
                )
              }}
            >
              Initialize Activity Hub
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Enhanced Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-sm uppercase tracking-wide text-white/80 font-bold">Activity Hub</div>
            <div className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
              Live Monitoring
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Enhanced KPIs Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="premium-glass-segment text-center group">
              <div className="text-xs text-emerald-400 font-medium mb-1">Alerts Today</div>
              <div className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                {data.counts.alertsToday}
              </div>
              <div className="text-xs text-white/60 mt-1">+{Math.floor(data.counts.alertsToday / 3)} this hour</div>
            </div>
            <div className="premium-glass-segment text-center group">
              <div className="text-xs text-emerald-400 font-medium mb-1">Actions Done</div>
              <div className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                {data.counts.actionsCompleted}
              </div>
              <div className="text-xs text-emerald-400 mt-1">Great progress!</div>
            </div>
            <div className="premium-glass-segment text-center group">
              <div className="text-xs text-emerald-400 font-medium mb-1">Avg Response</div>
              <div className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                {data.counts.avgResponseTime}m
              </div>
              <div className="text-xs text-white/60 mt-1">Response time</div>
            </div>
          </div>

          {/* Real-time Activity Stream */}
          <div className="premium-glass-segment">
            <div className="text-xs text-emerald-400 font-medium mb-3">Real-time Activity Stream</div>
            <RealTimeActivityStream data={realTimeData} />
          </div>

          {/* Activity Pace (24h) */}
          <div className="premium-glass-segment">
            <div className="text-xs text-emerald-400 font-medium mb-3">Activity Pace (24h)</div>
            <ActivityPaceStrip data={data.activityByHour} />
          </div>

          {/* Recent Alerts */}
          <div className="premium-glass-segment">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-emerald-400 font-medium uppercase">Recent Alerts</div>
              <div className="text-xs text-white/60">{data.recentAlerts.length} active</div>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
              <AnimatePresence>
                {data.recentAlerts.map((alert) => (
                  <EnhancedAlertCard
                    key={alert.id}
                    alert={alert}
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent("copilot:chat:ask", {
                          detail: {
                            threadType: "activity",
                            text: `Tell me more about: ${alert.title}`,
                          },
                        }),
                      )
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              className="premium-glass-action-button text-xs px-4 py-2"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("copilot:chat:ask", {
                    detail: {
                      threadType: "activity",
                      text: "Based on my recent alerts and activity, what should I focus on right now?",
                    },
                  }),
                )
              }}
            >
              AI Activity Analysis
            </button>
            <button
              className="premium-glass-button text-xs px-4 py-2"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("copilot:chat:seed", {
                    detail: {
                      threadType: "activity",
                      text: "📌 **Activity Rules & Alerts** - Pinned for reference",
                    },
                  }),
                )
              }}
            >
              Pin Activity Rules
            </button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
