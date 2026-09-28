"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, TrendingUp, TrendingDown, Activity, Users } from "lucide-react"

interface NexusNode {
  id: string
  data: {
    label: string
    category: string
    strength: number
    connections: number
    impact: "high" | "medium" | "low"
    description?: string
  }
}

interface NexusNodeDetailPanelProps {
  node: NexusNode | null
  onClose: () => void
}

export function NexusNodeDetailPanel({ node, onClose }: NexusNodeDetailPanelProps) {
  if (!node) return null

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "economic":
        return "from-blue-500 to-blue-700"
      case "geopolitical":
        return "from-red-500 to-red-700"
      case "market":
        return "from-green-500 to-green-700"
      case "technical":
        return "from-purple-500 to-purple-700"
      case "sentiment":
        return "from-yellow-500 to-yellow-700"
      default:
        return "from-gray-500 to-gray-700"
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "high":
        return TrendingUp
      case "medium":
        return Activity
      case "low":
        return TrendingDown
      default:
        return Activity
    }
  }

  const mockMetrics = [
    { label: "Volatility Impact", value: "23.4%", trend: "up" },
    { label: "Correlation Strength", value: "0.87", trend: "up" },
    { label: "Time Sensitivity", value: "4.2 hrs", trend: "down" },
    { label: "Market Exposure", value: "67%", trend: "up" },
  ]

  const mockConnections = [
    { name: "USD Strength", strength: 89, category: "market" },
    { name: "Fed Policy", strength: 76, category: "economic" },
    { name: "Risk Sentiment", strength: 64, category: "sentiment" },
    { name: "Tech Sector", strength: 52, category: "market" },
  ]

  const ImpactIcon = getImpactIcon(node.data.impact)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-96 bg-slate-900/95 backdrop-blur-sm border-l border-slate-700 z-50 overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(node.data.category)} rounded-lg flex items-center justify-center`}
              >
                <ImpactIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">{node.data.label}</h2>
                <p className="text-slate-400 text-sm capitalize">{node.data.category}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Strength Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 text-sm font-medium">Signal Strength</span>
              <span className="text-white font-bold">{node.data.strength}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${
                  node.data.strength > 70
                    ? "from-green-500 to-green-400"
                    : node.data.strength > 40
                      ? "from-yellow-500 to-yellow-400"
                      : "from-red-500 to-red-400"
                }`}
                style={{ width: `${node.data.strength}%` }}
              />
            </div>
          </div>

          {/* Description */}
          {node.data.description && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-2">Description</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{node.data.description}</p>
            </div>
          )}

          {/* Key Metrics */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Key Metrics</h3>
            <div className="space-y-3">
              {mockMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-300 text-sm">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{metric.value}</span>
                    {metric.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connections */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Connected Factors ({node.data.connections})
            </h3>
            <div className="space-y-2">
              {mockConnections.map((connection, index) => (
                <div key={index} className="p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-medium">{connection.name}</span>
                    <span className="text-slate-400 text-xs capitalize">{connection.category}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${connection.strength}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Level */}
          <div className="bg-slate-800/30 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Impact Assessment</h3>
            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  node.data.impact === "high"
                    ? "bg-red-500/20 text-red-400"
                    : node.data.impact === "medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/20 text-green-400"
                }`}
              >
                {node.data.impact.toUpperCase()} IMPACT
              </div>
              <span className="text-slate-300 text-sm">
                {node.data.impact === "high"
                  ? "Significant market influence expected"
                  : node.data.impact === "medium"
                    ? "Moderate market influence expected"
                    : "Limited market influence expected"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
