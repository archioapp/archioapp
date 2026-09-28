"use client"

import { useState, useEffect, useRef } from "react"
import { CopilotChatPanel } from "@/components/copilot/chat/CopilotChatPanel"
import { motion, AnimatePresence } from "framer-motion"

interface NewsItem {
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
}

interface ActivityNotificationsProps {
  onClose: () => void
}

export function ActivityNotifications({ onClose }: ActivityNotificationsProps) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sampleNews: NewsItem[] = [
      {
        id: "1",
        title: "Major Support Break",
        message: "EURUSD has broken below key support at 1.0850. Consider reviewing open positions.",
        timestamp: Date.now() - 300000, // 5 minutes ago
        category: "trading",
        priority: "high",
        metadata: {
          instrument: "EURUSD",
          value: 1.0845,
          change: -0.0012,
        },
      },
      {
        id: "2",
        title: "Market Volatility Alert",
        message: "Increased volatility detected across major pairs. Risk management protocols activated.",
        timestamp: Date.now() - 600000, // 10 minutes ago
        category: "market",
        priority: "medium",
      },
      {
        id: "3",
        title: "Session Transition",
        message: "London session opening in 15 minutes. Prepare for increased liquidity.",
        timestamp: Date.now() - 900000, // 15 minutes ago
        category: "system",
        priority: "low",
      },
    ]

    setNewsItems(sampleNews)

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newItem: NewsItem = {
          id: Date.now().toString(),
          title: "Market Update",
          message: "New market condition detected - monitoring for opportunities.",
          timestamp: Date.now(),
          category: "market",
          priority: "medium",
        }
        setNewsItems((prev) => [newItem, ...prev.slice(0, 4)]) // Keep max 5 items
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "from-red-500 to-orange-500"
      case "medium":
        return "from-yellow-500 to-orange-500"
      case "low":
        return "from-blue-500 to-cyan-500"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  return (
    <div className="h-full flex flex-col premium-glass-container" ref={containerRef}>
      {/* <div className="absolute top-4 right-4 z-10">
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 group"
        >
          <svg
            className="w-4 h-4 text-white/70 group-hover:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div> */}

      <div className="p-4 border-b border-white/10 overflow-y-auto max-h-[40%]">
        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {newsItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="premium-glass-card p-4 hover:border-white/20 transition-all duration-300 group cursor-pointer"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start gap-3">
                  {/* Priority indicator */}
                  <motion.div
                    className={`w-3 h-3 rounded-full bg-gradient-to-r ${getPriorityColor(item.priority)} shadow-lg mt-1`}
                    animate={{
                      scale: item.priority === "high" ? [1, 1.2, 1] : 1,
                    }}
                    transition={{
                      duration: 2,
                      repeat: item.priority === "high" ? Number.POSITIVE_INFINITY : 0,
                    }}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-white truncate">{item.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 bg-white/10 text-white/70 rounded-full border border-white/20">
                          {item.category}
                        </span>
                        <span className="text-xs text-white/60">
                          {new Date(item.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-white/80 leading-relaxed">{item.message}</p>

                    {/* Metadata */}
                    {item.metadata && (
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        {item.metadata.instrument && (
                          <div className="flex items-center gap-1">
                            <span className="text-white/60">Instrument:</span>
                            <span className="text-white font-medium">{item.metadata.instrument}</span>
                          </div>
                        )}
                        {item.metadata.value && (
                          <div className="flex items-center gap-1">
                            <span className="text-white/60">Value:</span>
                            <span
                              className={`font-medium ${item.metadata.change && item.metadata.change < 0 ? "text-red-400" : "text-emerald-400"}`}
                            >
                              {item.metadata.value}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>

      <div className="flex-1 min-h-0">
        <CopilotChatPanel />
      </div>
    </div>
  )
}
