"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, TrendingUp, AlertTriangle, Zap } from "lucide-react"

export function NexusAISynthesisPanel() {
  const [isExpanded, setIsExpanded] = useState(false)

  const insights = [
    {
      type: "correlation",
      icon: Brain,
      title: "Strong Correlation Detected",
      description: "USD strength correlating 87% with tech sector decline",
      confidence: 94,
      color: "text-blue-400",
    },
    {
      type: "trend",
      icon: TrendingUp,
      title: "Emerging Pattern",
      description: "Central bank divergence creating volatility clusters",
      confidence: 78,
      color: "text-green-400",
    },
    {
      type: "risk",
      icon: AlertTriangle,
      title: "Risk Alert",
      description: "Geopolitical tensions may amplify market reactions",
      confidence: 85,
      color: "text-yellow-400",
    },
    {
      type: "opportunity",
      icon: Zap,
      title: "Trading Opportunity",
      description: "Mean reversion setup forming in currency pairs",
      confidence: 72,
      color: "text-purple-400",
    },
  ]

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50"
    >
      <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl">
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 p-4 w-full text-left hover:bg-slate-800/50 transition-colors rounded-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">AI Synthesis</h3>
            <p className="text-slate-400 text-sm">4 insights detected</p>
          </div>
        </motion.button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 space-y-3 max-w-sm">
                {insights.map((insight, index) => {
                  const IconComponent = insight.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`${insight.color} mt-1`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm mb-1">{insight.title}</h4>
                          <p className="text-slate-300 text-xs leading-relaxed mb-2">{insight.description}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${
                                  insight.confidence > 80
                                    ? "from-green-500 to-green-400"
                                    : insight.confidence > 60
                                      ? "from-yellow-500 to-yellow-400"
                                      : "from-red-500 to-red-400"
                                }`}
                                style={{ width: `${insight.confidence}%` }}
                              />
                            </div>
                            <span className="text-slate-400 text-xs font-medium">{insight.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
