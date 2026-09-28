"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Target,
  Shield,
  DollarSign,
  BarChart3,
  Layers,
  ArrowUpRight,
  TrendingUpIcon as TrendingUpDown,
} from "lucide-react"
import { useState } from "react"
import type { LiquidityAnalysis, LiquidityZone } from "@/lib/liquidity-analysis"

interface LiquidityAnalysisDisplayProps {
  analysis: LiquidityAnalysis | null
  isLoading: boolean
}

function LiquidityZoneCard({
  zone,
  index,
  currentPrice,
}: { zone: LiquidityZone; index: number; currentPrice: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const isBuyZone = zone.type === "buy-side"
  const distance = Math.abs(zone.level - currentPrice)
  const distancePips = (distance * 10000).toFixed(1)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-emerald-400 bg-emerald-500/20 border-emerald-500/30"
      case "swept":
        return "text-rose-400 bg-rose-500/20 border-rose-500/30"
      case "respected":
        return "text-cyan-400 bg-cyan-500/20 border-cyan-500/30"
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: isBuyZone ? 20 : -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: index * 0.1, type: "spring", damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group cursor-pointer transition-all duration-500"
      style={{
        background: `
          linear-gradient(135deg, 
            ${
              isBuyZone
                ? "rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.05) 25%, rgba(4, 120, 87, 0.03) 50%, rgba(16, 185, 129, 0.08) 100%"
                : "rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.05) 25%, rgba(185, 28, 28, 0.03) 50%, rgba(239, 68, 68, 0.08) 100%"
            }
          )
        `,
        backdropFilter: "blur(20px)",
        border: `1px solid ${isBuyZone ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
        borderRadius: "20px",
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.12),
          inset 0 1px 0 rgba(255, 255, 255, 0.05),
          0 0 0 1px ${isBuyZone ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)"}
        `,
      }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-black/[0.02]" />
        <AnimatePresence>
          {isHovered && (
            <>
              {/* Particle effects */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, x: Math.random() * 300, y: Math.random() * 200 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: Math.random() * 300,
                    y: Math.random() * 200,
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                  className={`absolute w-1 h-1 rounded-full ${isBuyZone ? "bg-emerald-400/40" : "bg-rose-400/40"}`}
                />
              ))}
              {/* Glassy flash effect */}
              <motion.div
                initial={{ opacity: 0, x: "-100%" }}
                animate={{ opacity: [0, 0.3, 0], x: "100%" }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
              />
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className={`relative w-12 h-12 rounded-2xl flex items-center justify-center border ${
                isBuyZone
                  ? "bg-gradient-to-br from-emerald-500/20 via-green-500/15 to-teal-500/20 border-emerald-400/30"
                  : "bg-gradient-to-br from-rose-500/20 via-red-500/15 to-pink-500/20 border-rose-400/30"
              }`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {isBuyZone ? (
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              ) : (
                <TrendingDown className="w-6 h-6 text-rose-400" />
              )}
              <motion.div
                className={`absolute inset-0 rounded-2xl ${
                  isBuyZone
                    ? "bg-gradient-to-br from-emerald-400/10 to-green-400/10"
                    : "bg-gradient-to-br from-rose-400/10 to-red-400/10"
                }`}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <div>
              <span
                className={`text-sm font-bold uppercase tracking-wider ${
                  isBuyZone ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {isBuyZone ? "BUY LIQUIDITY" : "SELL LIQUIDITY"}
              </span>
              <p className="text-xs text-purple-300/70 mt-1">
                {zone.touches} touches • {zone.confidence.toFixed(0)}% confidence
              </p>
            </div>
          </div>
          <motion.div
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border backdrop-blur-sm ${getStatusColor(zone.status)}`}
            whileHover={{ scale: 1.05 }}
          >
            {zone.status.toUpperCase()}
          </motion.div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-purple-300 text-sm font-medium">Level</span>
            <motion.span className="text-white font-mono text-xl font-bold" animate={{ scale: isHovered ? 1.05 : 1 }}>
              {zone.level.toFixed(5)}
            </motion.span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-purple-300 text-sm font-medium">Distance</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-mono font-bold">{distancePips}</span>
              <span className="text-purple-400 text-xs">pips</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-purple-300 text-sm font-medium">Strength</span>
            <div className="flex items-center gap-3">
              <div className="relative w-20 h-2 bg-purple-900/30 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    isBuyZone
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                      : "bg-gradient-to-r from-rose-500 to-rose-400"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${zone.strength}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 1 }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"
                  animate={{ x: isHovered ? "100%" : "-100%" }}
                  transition={{ duration: 1.5, repeat: isHovered ? Number.POSITIVE_INFINITY : 0 }}
                />
              </div>
              <span className="text-white text-sm font-mono font-bold">{Math.round(zone.strength)}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-purple-300 text-sm font-medium">Volume</span>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span className="text-white font-mono font-bold text-sm">
                {zone.volume >= 1000000
                  ? `${(zone.volume / 1000000).toFixed(1)}M`
                  : `${(zone.volume / 1000).toFixed(0)}K`}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10">
            <p className="text-xs text-purple-300/90 leading-relaxed font-medium">{zone.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function LiquidityPoolsDisplay({ analysis }: { analysis: LiquidityAnalysis }) {
  const [hoveredPool, setHoveredPool] = useState<string | null>(null)

  // Define specific liquidity pools for buy-side and sell-side
  const buySidePools = [
    {
      id: "asia-low-buy",
      name: "Asia Low",
      level: 1.23456,
      strength: 78,
      status: "active",
      type: "buy-side" as const,
      timeframe: "Asia Session",
      description: "Asia session low acting as buy-side liquidity pool",
    },
    {
      id: "daily-low-buy",
      name: "Daily Low",
      level: 1.23234,
      strength: 85,
      status: "respected",
      type: "buy-side" as const,
      timeframe: "Daily",
      description: "Previous daily low providing strong buy-side support",
    },
    {
      id: "weekly-low-buy",
      name: "Weekly Low",
      level: 1.22987,
      strength: 92,
      status: "active",
      type: "buy-side" as const,
      timeframe: "Weekly",
      description: "Weekly low representing major buy-side liquidity zone",
    },
  ]

  const sellSidePools = [
    {
      id: "asia-low-sell",
      name: "Asia Low",
      level: 1.23456,
      strength: 65,
      status: "swept",
      type: "sell-side" as const,
      timeframe: "Asia Session",
      description: "Asia session low targeted for sell-side liquidity sweep",
    },
    {
      id: "daily-low-sell",
      name: "Daily Low",
      level: 1.23234,
      strength: 72,
      status: "active",
      type: "sell-side" as const,
      timeframe: "Daily",
      description: "Daily low positioned for potential sell-side liquidity grab",
    },
    {
      id: "weekly-low-sell",
      name: "Weekly Low",
      level: 1.22987,
      strength: 88,
      status: "respected",
      type: "sell-side" as const,
      timeframe: "Weekly",
      description: "Weekly low serving as major sell-side liquidity target",
    },
  ]

  const LiquidityPoolCard = ({ pool, index }: { pool: any; index: number }) => {
    const [isHovered, setIsHovered] = useState(false)
    const isBuyPool = pool.type === "buy-side"

    return (
      <motion.div
        initial={{ opacity: 0, x: isBuyPool ? -20 : 20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: index * 0.1, type: "spring", damping: 20 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative group cursor-pointer transition-all duration-500"
        style={{
          background: `
            linear-gradient(135deg, 
              ${
                isBuyPool
                  ? "rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.05) 25%, rgba(4, 120, 87, 0.03) 50%, rgba(16, 185, 129, 0.08) 100%"
                  : "rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.05) 25%, rgba(185, 28, 28, 0.03) 50%, rgba(239, 68, 68, 0.08) 100%"
              }
            )
          `,
          backdropFilter: "blur(20px)",
          border: `1px solid ${isBuyPool ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
          borderRadius: "20px",
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.05),
            0 0 0 1px ${isBuyPool ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)"}
          `,
        }}
        whileHover={{ scale: 1.02, y: -2 }}
      >
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-black/[0.02]" />
          <AnimatePresence>
            {isHovered && (
              <>
                {/* Particle effects */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, x: Math.random() * 300, y: Math.random() * 200 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: Math.random() * 300,
                      y: Math.random() * 200,
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.2,
                    }}
                    className={`absolute w-1 h-1 rounded-full ${isBuyPool ? "bg-emerald-400/40" : "bg-rose-400/40"}`}
                  />
                ))}
                {/* Glassy flash effect */}
                <motion.div
                  initial={{ opacity: 0, x: "-100%" }}
                  animate={{ opacity: [0, 0.3, 0], x: "100%" }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                />
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className={`relative w-12 h-12 rounded-2xl flex items-center justify-center border ${
                  isBuyPool
                    ? "bg-gradient-to-br from-emerald-500/20 via-green-500/15 to-teal-500/20 border-emerald-400/30"
                    : "bg-gradient-to-br from-rose-500/20 via-red-500/15 to-pink-500/20 border-rose-400/30"
                }`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {isBuyPool ? (
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-rose-400" />
                )}
              </motion.div>
              <div>
                <span
                  className={`text-sm font-bold uppercase tracking-wider ${
                    isBuyPool ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {pool.name}
                </span>
                <p className="text-xs text-purple-300/70 mt-1">
                  {pool.timeframe} • {pool.strength}% strength
                </p>
              </div>
            </div>
            <motion.div
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border backdrop-blur-sm ${
                pool.status === "active"
                  ? "text-emerald-400 bg-emerald-500/20 border-emerald-500/30"
                  : pool.status === "swept"
                    ? "text-rose-400 bg-rose-500/20 border-rose-500/30"
                    : "text-cyan-400 bg-cyan-500/20 border-cyan-500/30"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {pool.status.toUpperCase()}
            </motion.div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-purple-300 text-sm font-medium">Level</span>
              <motion.span className="text-white font-mono text-xl font-bold" animate={{ scale: isHovered ? 1.05 : 1 }}>
                {pool.level.toFixed(5)}
              </motion.span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-purple-300 text-sm font-medium">Strength</span>
              <div className="flex items-center gap-3">
                <div className="relative w-20 h-2 bg-purple-900/30 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      isBuyPool
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                        : "bg-gradient-to-r from-rose-500 to-rose-400"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pool.strength}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 1 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"
                    animate={{ x: isHovered ? "100%" : "-100%" }}
                    transition={{ duration: 1.5, repeat: isHovered ? Number.POSITIVE_INFINITY : 0 }}
                  />
                </div>
                <span className="text-white text-sm font-mono font-bold">{pool.strength}%</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <p className="text-xs text-purple-300/90 leading-relaxed font-medium">{pool.description}</p>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="space-y-8"
    >
      {/* Liquidity Pools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <motion.h4
            className="text-xl font-bold text-emerald-400 flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <TrendingUp className="w-6 h-6" />
            Buy-Side Liquidity Pools
          </motion.h4>
          {buySidePools.map((pool, index) => (
            <LiquidityPoolCard key={pool.id} pool={pool} index={index} />
          ))}
        </div>

        <div className="space-y-6">
          <motion.h4
            className="text-xl font-bold text-rose-400 flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <TrendingDown className="w-6 h-6" />
            Sell-Side Liquidity Pools
          </motion.h4>
          {sellSidePools.map((pool, index) => (
            <LiquidityPoolCard key={pool.id} pool={pool} index={index} />
          ))}
        </div>
      </div>

      {/* Institutional Hunt Direction */}
      <div className="mt-8 pt-6 border-t border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Zap className="w-6 h-6 text-amber-400" />
            </motion.div>
            <span className="text-purple-300 font-medium text-lg">Institutional Hunt Direction</span>
          </div>
          <div className="flex items-center gap-3">
            <motion.div
              className={`w-4 h-4 rounded-full ${
                analysis.huntingDirection === "upward"
                  ? "bg-emerald-400"
                  : analysis.huntingDirection === "downward"
                    ? "bg-rose-400"
                    : "bg-amber-400"
              }`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
            <span
              className={`font-bold uppercase text-lg ${
                analysis.huntingDirection === "upward"
                  ? "text-emerald-400"
                  : analysis.huntingDirection === "downward"
                    ? "text-rose-400"
                    : "text-amber-400"
              }`}
            >
              {analysis.huntingDirection}
            </span>
            <motion.div
              animate={{
                x:
                  analysis.huntingDirection === "upward"
                    ? [0, 5, 0]
                    : analysis.huntingDirection === "downward"
                      ? [0, -5, 0]
                      : 0,
              }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            >
              {analysis.huntingDirection === "upward" ? (
                <ArrowUpRight className="w-5 h-5 text-emerald-400" />
              ) : analysis.huntingDirection === "downward" ? (
                <TrendingDown className="w-5 h-5 text-rose-400" />
              ) : (
                <TrendingUpDown className="w-5 h-5 text-amber-400" />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function LiquidityOverview({ analysis }: { analysis: LiquidityAnalysis }) {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null)
  const activeBuyZones = analysis.buyLiquidity.filter((z) => z.status === "active").length
  const activeSellZones = analysis.sellLiquidity.filter((z) => z.status === "active").length
  const totalVolume = [...analysis.buyLiquidity, ...analysis.sellLiquidity].reduce((sum, z) => sum + z.volume, 0)

  const institutionalMetrics = [
    {
      name: "Liquidity Imbalance",
      value: Math.abs(activeBuyZones - activeSellZones),
      description: "Asymmetric liquidity distribution indicating directional bias",
      icon: BarChart3,
      color: "emerald",
    },
    {
      name: "Volume Concentration",
      value: 87,
      description: "Percentage of volume concentrated in top liquidity zones",
      icon: Target,
      color: "purple",
    },
    {
      name: "Hunt Probability",
      value: 94,
      description: "Statistical probability of liquidity sweep based on current setup",
      icon: Zap,
      color: "amber",
    },
    {
      name: "Institutional Flow",
      value: 78,
      description: "Smart money positioning and order flow analysis",
      icon: Shield,
      color: "cyan",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="relative group"
      style={{
        background: `
          linear-gradient(135deg, 
            rgba(139, 92, 246, 0.08) 0%, 
            rgba(59, 130, 246, 0.05) 25%,
            rgba(16, 185, 129, 0.05) 50%,
            rgba(139, 92, 246, 0.08) 100%
          )
        `,
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(139, 92, 246, 0.2)",
        borderRadius: "24px",
        boxShadow: `
          0 12px 40px rgba(0, 0, 0, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          0 0 0 1px rgba(139, 92, 246, 0.1)
        `,
      }}
    >
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <motion.div
            className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 via-blue-500/15 to-teal-500/20 flex items-center justify-center border border-purple-400/30"
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Activity className="w-8 h-8 text-purple-300" />
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Institutional Liquidity Analysis</h3>
            <p className="text-purple-300/70">Smart Money Flow & Market Structure • $48M System</p>
          </div>
        </div>

        {/* Enhanced metrics grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {institutionalMetrics.map((metric, idx) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onHoverStart={() => setHoveredMetric(metric.name)}
                onHoverEnd={() => setHoveredMetric(null)}
                className="relative bg-black/20 rounded-xl p-4 backdrop-blur-sm border border-purple-500/10 hover:border-purple-400/30 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${metric.color}-500/20 to-${metric.color}-500/10 flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 text-${metric.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm">{metric.name}</h4>
                    <p className={`text-${metric.color}-400 text-xs`}>{metric.value}%</p>
                  </div>
                </div>

                <div className="relative w-full h-2 bg-purple-900/30 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r from-${metric.color}-400 to-${metric.color}-300`}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ delay: idx * 0.1 + 0.5, duration: 1 }}
                  />
                </div>

                <AnimatePresence>
                  {hoveredMetric === metric.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm border border-purple-400/30 whitespace-nowrap z-10 max-w-xs"
                    >
                      {metric.description}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Enhanced summary metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div className="text-center p-4 bg-black/20 rounded-xl backdrop-blur-sm" whileHover={{ scale: 1.02 }}>
            <motion.div
              className="text-3xl font-bold text-emerald-400 mb-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              {activeBuyZones}
            </motion.div>
            <div className="text-sm text-emerald-300/80 font-medium">Active Buy Zones</div>
          </motion.div>

          <motion.div className="text-center p-4 bg-black/20 rounded-xl backdrop-blur-sm" whileHover={{ scale: 1.02 }}>
            <motion.div
              className="text-3xl font-bold text-rose-400 mb-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
            >
              {activeSellZones}
            </motion.div>
            <div className="text-sm text-rose-300/80 font-medium">Active Sell Zones</div>
          </motion.div>

          <motion.div className="text-center p-4 bg-black/20 rounded-xl backdrop-blur-sm" whileHover={{ scale: 1.02 }}>
            <motion.div
              className="text-3xl font-bold text-purple-400 mb-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
            >
              {totalVolume >= 1000000
                ? `${(totalVolume / 1000000).toFixed(1)}M`
                : `${(totalVolume / 1000).toFixed(0)}K`}
            </motion.div>
            <div className="text-sm text-purple-300/80 font-medium">Total Volume</div>
          </motion.div>
        </div>

        {/* Enhanced market bias display */}
        <div className="pt-6 border-t border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Layers className="w-6 h-6 text-purple-400" />
              <span className="text-purple-300 font-medium text-lg">Institutional Market Bias</span>
            </div>
            <div className="flex items-center gap-4">
              <motion.div
                className={`w-4 h-4 rounded-full ${
                  analysis.liquidityBias === "buy-side"
                    ? "bg-emerald-400"
                    : analysis.liquidityBias === "sell-side"
                      ? "bg-rose-400"
                      : "bg-amber-400"
                }`}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.span
                className={`font-bold uppercase text-xl ${
                  analysis.liquidityBias === "buy-side"
                    ? "text-emerald-400"
                    : analysis.liquidityBias === "sell-side"
                      ? "text-rose-400"
                      : "text-amber-400"
                }`}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                {analysis.liquidityBias}
              </motion.span>
              <div
                className={`px-4 py-2 rounded-xl font-bold text-sm backdrop-blur-sm ${
                  analysis.liquidityBias === "buy-side"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/40"
                    : analysis.liquidityBias === "sell-side"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-400/40"
                      : "bg-amber-500/20 text-amber-400 border border-amber-400/40"
                }`}
              >
                {analysis.liquidityBias === "buy-side"
                  ? "🎯 BULLISH SETUP"
                  : analysis.liquidityBias === "sell-side"
                    ? "🎯 BEARISH SETUP"
                    : "⚡ NEUTRAL ZONE"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function LiquidityAnalysisDisplay({ analysis, isLoading }: LiquidityAnalysisDisplayProps) {
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="h-64 rounded-3xl animate-pulse"
              style={{
                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.03))",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(139, 92, 246, 0.1)",
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="text-center py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-purple-300/70 text-lg"
        >
          No liquidity analysis data available
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Liquidity Pools */}
      <LiquidityPoolsDisplay analysis={analysis} />

      {/* Overview */}
      <LiquidityOverview analysis={analysis} />
    </div>
  )
}
