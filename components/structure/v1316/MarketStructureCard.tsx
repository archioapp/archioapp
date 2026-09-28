"use client"

import { motion } from "framer-motion"
import { Clock, TrendingUp, TrendingDown } from "lucide-react"
import { useState } from "react"

interface MarketStructureCardProps {
  timeframe: "Weekly" | "Daily" | "4H"
  data: {
    bos: { status: "Bullish" | "Bearish"; confirmed: boolean }
    choch: { status: "Pending" | "Confirmed"; type: "Bullish" | "Bearish" }
    orderBlocks: number
    fvg: number
    smartMoney: "Accumulation" | "Distribution" | "Neutral"
    trendStrength: number
  }
}

export function MarketStructureCard({ timeframe, data }: MarketStructureCardProps) {
  const [activeTab, setActiveTab] = useState<"Structure" | "Confluences" | "Levels">("Structure")

  const getTimeframeColor = () => {
    switch (timeframe) {
      case "Weekly":
        return {
          bg: "from-purple-900/40 via-purple-800/30 to-indigo-900/40",
          border: "border-purple-500/40",
          accent: "purple",
        }
      case "Daily":
        return { bg: "from-blue-900/40 via-blue-800/30 to-cyan-900/40", border: "border-blue-500/40", accent: "blue" }
      case "4H":
        return {
          bg: "from-green-900/40 via-green-800/30 to-emerald-900/40",
          border: "border-green-500/40",
          accent: "green",
        }
    }
  }

  const colors = getTimeframeColor()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl backdrop-blur-xl border bg-gradient-to-br ${colors.bg} ${colors.border} group hover:scale-[1.02] transition-all duration-300`}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br from-${colors.accent}-500/30 to-${colors.accent}-600/30 flex items-center justify-center border border-${colors.accent}-500/40`}
          >
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{timeframe}</h3>
            <p className="text-sm text-gray-300">Market Structure</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(["Structure", "Confluences", "Levels"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeTab === tab
                  ? `bg-${colors.accent}-500/30 text-${colors.accent}-300 border border-${colors.accent}-500/40`
                  : "bg-black/20 text-gray-400 border border-white/10 hover:bg-black/30"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* BOS and CHoCH Status */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-300">BOS</span>
            <span
              className={`text-xs font-medium ${data.bos.status === "Bullish" ? "text-green-400" : "text-red-400"}`}
            >
              {data.bos.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-gray-300">CHoCH</span>
            <span
              className={`text-xs font-medium ${data.choch.status === "Confirmed" ? "text-green-400" : "text-orange-400"}`}
            >
              {data.choch.status}
            </span>
          </div>
        </div>

        {/* Order Blocks and FVG */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span className="text-sm text-gray-300">Order Blocks</span>
            </div>
            <span className="text-white font-bold text-lg">{data.orderBlocks}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-sm text-gray-300">FVG</span>
            </div>
            <span className="text-white font-bold text-lg">{data.fvg}</span>
          </div>
        </div>

        {/* Smart Money */}
        <div
          className={`p-3 rounded-xl bg-gradient-to-r from-${colors.accent}-500/10 to-${colors.accent}-600/10 border border-${colors.accent}-500/20 mb-4`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-sm">$</span>
              <span className="text-sm text-gray-300">Smart Money</span>
            </div>
            <span
              className={`text-sm font-medium ${
                data.smartMoney === "Accumulation"
                  ? "text-green-400"
                  : data.smartMoney === "Distribution"
                    ? "text-red-400"
                    : "text-yellow-400"
              }`}
            >
              {data.smartMoney}
            </span>
          </div>
        </div>

        {/* Trend Strength */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Trend Strength</span>
            <span className="text-white font-bold">{data.trendStrength}%</span>
          </div>
          <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r from-${colors.accent}-500 to-cyan-400 rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${data.trendStrength}%` }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
