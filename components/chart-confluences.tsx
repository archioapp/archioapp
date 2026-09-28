"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Star, Zap } from "lucide-react"

// Consolidated data for all analysis boxes, including confluences, ranges, and heatmaps
const allAnalysisData = [
  {
    title: "BPR Resistance",
    subtitle: "Weekly",
    level: "1.35091 - 1.35320",
    status: "ACTIVE",
    confidence: "94%",
    strength: 94,
    riskReward: "1:3.2",
    tests: "3x",
    lastTest: "2h ago",
    icon: Zap, // Using Zap for general confluence icon
    color: "from-red-500 to-orange-500",
    bgColor: "from-red-500/10 to-orange-500/10",
    borderColor: "border-red-500/30",
    statusColor: "bg-green-500/20 text-green-400 border-green-500/30",
    details: [
      "Weekly BPR rejection zone",
      "Smart money distribution",
      "Institutional flow bearish",
      "Volume spike on test",
      "3x rejection confirmation",
    ],
    relevantPairs: ["GBPUSD", "EURUSD"],
    displayType: "confluence",
  },
  {
    title: "Weekly Open",
    subtitle: "Weekly",
    level: "1.34451",
    status: "TESTED",
    confidence: "87%",
    strength: 87,
    riskReward: "1:2.8",
    tests: "2x",
    lastTest: "4h ago",
    icon: Zap,
    color: "from-yellow-500 to-amber-500",
    bgColor: "from-yellow-500/10 to-amber-500/10",
    borderColor: "border-yellow-500/30",
    statusColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    details: [
      "Weekly opening price",
      "Key pivot level",
      "Price tested 2x",
      "Continuation signal",
      "Break = bearish momentum",
    ],
    relevantPairs: ["GBPUSD", "EURUSD"],
    displayType: "confluence",
  },
  {
    title: "Asia/Frankfurt Range",
    subtitle: "8PM-12AM EST",
    level: "1.3498 - 1.3421",
    status: "SWEPT",
    confidence: "91%",
    strength: 91,
    riskReward: "1:3.7",
    tests: "4x",
    lastTest: "6h ago",
    icon: Zap,
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-500/10 to-pink-500/10",
    borderColor: "border-purple-500/30",
    statusColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    details: [
      "Asia session range",
      "High swept at 1.3498",
      "Liquidity manipulation",
      "Bearish continuation",
      "Smart money trap",
    ],
    relevantPairs: ["GBPUSD", "EURUSD"],
    displayType: "range",
  },
  {
    title: "Zone Reaction Heatmap",
    subtitle: "Live Analysis",
    level: "Multiple Zones",
    status: "LIVE",
    confidence: "89%",
    strength: 89,
    riskReward: "Variable",
    tests: "Live",
    lastTest: "Real-time",
    icon: Zap,
    color: "from-orange-500 to-red-500",
    bgColor: "from-orange-500/10 to-red-500/10",
    borderColor: "border-orange-500/30",
    statusColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    details: [
      "Real-time zone strength",
      "Reaction probability",
      "Volume confirmation",
      "Price action signals",
      "Institutional interest",
    ],
    relevantPairs: ["GBPUSD", "EURUSD", "DXY", "BXY"],
    displayType: "heatmap",
  },
  {
    title: "Demand Zone",
    subtitle: "Daily",
    level: "1.33042",
    status: "PENDING",
    confidence: "78%",
    strength: 78,
    riskReward: "1:4.1",
    tests: "0x",
    lastTest: "Never",
    icon: Zap,
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-500/10 to-emerald-500/10",
    borderColor: "border-green-500/30",
    statusColor: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    details: [
      "Macro demand zone",
      "Reversal potential",
      "Strong buying interest",
      "Confluence with 200MA",
      "Risk/reward optimal",
    ],
    relevantPairs: ["GBPUSD", "EURUSD"],
    displayType: "confluence",
  },
  {
    title: "Fibonacci 61.8%",
    subtitle: "4H Retracement",
    level: "1.33874",
    status: "WATCH",
    confidence: "82%",
    strength: 82,
    riskReward: "1:2.5",
    tests: "1x",
    lastTest: "1d ago",
    icon: Zap,
    color: "from-indigo-500 to-purple-500",
    bgColor: "from-indigo-500/10 to-purple-500/10",
    borderColor: "border-indigo-500/30",
    statusColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    details: [
      "Golden ratio retracement",
      "High probability reversal",
      "Confluence with structure",
      "Institutional level",
      "Watch for rejection",
    ],
    relevantPairs: ["GBPUSD", "EURUSD"],
    displayType: "confluence",
  },
  {
    title: "Market Structure",
    subtitle: "Higher Timeframe",
    level: "1.3600 - 1.3200",
    status: "BEARISH",
    confidence: "92%",
    strength: 92,
    riskReward: "1:5.0",
    tests: "Multiple",
    lastTest: "Ongoing",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-500/30",
    statusColor: "bg-red-500/20 text-red-400 border-red-500/30",
    details: [
      "Higher timeframe structure",
      "Bearish market structure",
      "Lower highs, lower lows",
      "Trend continuation",
      "Institutional alignment",
    ],
    relevantPairs: ["GBPUSD", "EURUSD", "DXY", "BXY"],
    displayType: "general",
  },
  {
    title: "Liquidity Pools",
    subtitle: "Smart Money",
    level: "1.3500 / 1.3300",
    status: "HUNTING",
    confidence: "88%",
    strength: 88,
    riskReward: "1:3.5",
    tests: "Active",
    lastTest: "Continuous",
    icon: Zap,
    color: "from-teal-500 to-cyan-500",
    bgColor: "from-teal-500/10 to-cyan-500/10",
    borderColor: "border-teal-500/30",
    statusColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    details: [
      "Liquidity pool mapping",
      "Smart money targets",
      "Stop loss hunting zones",
      "Algorithmic levels",
      "Institutional flow",
    ],
    relevantPairs: ["GBPUSD", "EURUSD", "DXY", "BXY"],
    displayType: "general",
  },
  {
    title: "USD Strength Analysis",
    subtitle: "Macroeconomic",
    level: "104.80+",
    status: "BULLISH",
    confidence: "94%",
    strength: 94,
    riskReward: "N/A",
    tests: "Ongoing",
    lastTest: "Real-time",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-500/20",
    statusColor: "bg-green-500/20 text-green-400 border-green-500/30",
    details: [
      "CPI & PPI remain elevated",
      "Fed hawkish stance maintained",
      "Rate cut expectations pushed to Q3 2024",
      "DXY holding critical support",
      "Institutional backing",
    ],
    relevantPairs: ["DXY", "BXY"],
    displayType: "macro",
  },
  {
    title: "GBP Weakness Signals",
    subtitle: "Macroeconomic",
    level: "135.57",
    status: "BEARISH",
    confidence: "91%",
    strength: 91,
    riskReward: "N/A",
    tests: "Ongoing",
    lastTest: "Real-time",
    icon: Zap,
    color: "from-red-500 to-orange-500",
    bgColor: "from-red-500/10 to-orange-500/10",
    borderColor: "border-red-500/20",
    statusColor: "bg-red-500/20 text-red-400 border-red-500/30",
    details: [
      "BXY exited BPR range",
      "BoE dovish pivot amid recession fears",
      "UK inflation cooling faster than expected",
      "Liquidity magnet at 1.3500 detected",
      "Neural confirmation of weakness",
    ],
    relevantPairs: ["GBPUSD", "EURUSD"],
    displayType: "macro",
  },
]

interface ChartConfluencesProps {
  pairs: string[] // Changed from 'pair' to 'pairs' (array of strings)
}

export function ChartConfluences({ pairs }: ChartConfluencesProps) {
  const filteredConfluences = allAnalysisData.filter(
    (item) =>
      item.relevantPairs.some((rp) => pairs.includes(rp)) && // Check if any of item's relevantPairs are in the 'pairs' prop
      (item.displayType === "confluence" || item.displayType === "range" || item.displayType === "heatmap"),
  )

  return (
    <div className="space-y-3 h-full overflow-y-auto pr-2">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-bold text-lg flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
          {pairs.join(" & ")} Confluences
        </h4>
      </div>

      {filteredConfluences.map((box, index) => (
        <div
          key={index}
          className={`group p-3 rounded-xl bg-gradient-to-r ${box.bgColor} border ${box.borderColor} hover:scale-[1.02] transition-all duration-300 cursor-pointer backdrop-blur-sm shadow-lg hover:shadow-xl`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`p-1.5 rounded-lg bg-gradient-to-r ${box.color} shadow-lg group-hover:scale-110 transition-transform`}
              >
                <box.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-sm">{box.title}</span>
                <div className="text-xs text-slate-400 font-medium">{box.subtitle}</div>
              </div>
            </div>

            <Badge className={`font-bold text-xs animate-pulse ${box.statusColor}`}>{box.status}</Badge>
          </div>

          {/* Level */}
          <div className="mb-3">
            <div className="text-xs text-slate-400 mb-1">Level:</div>
            <div className="text-white font-mono text-sm font-bold bg-slate-800/50 px-2 py-1 rounded">{box.level}</div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
            <div className="text-center bg-slate-800/30 rounded p-2">
              <div className="text-slate-400">R/R</div>
              <div className="text-white font-bold">{box.riskReward}</div>
            </div>
            <div className="text-center bg-slate-800/30 rounded p-2">
              <div className="text-slate-400">Tests</div>
              <div className="text-white font-bold">{box.tests}</div>
            </div>
            <div className="text-center bg-slate-800/30 rounded p-2">
              <div className="text-slate-400">Last</div>
              <div className="text-white font-bold text-xs">{box.lastTest}</div>
            </div>
          </div>

          {/* Confidence */}
          <div className="space-y-2 mb-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs">AI Confidence:</span>
              <span className={`font-bold text-sm bg-gradient-to-r ${box.color} bg-clip-text text-transparent`}>
                {box.confidence}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className={`bg-gradient-to-r ${box.color} h-2 rounded-full transition-all duration-700 animate-pulse`}
                style={{ width: `${box.strength}%` }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-1 mb-3">
            {box.details.slice(0, 3).map((detail, idx) => (
              <div key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${box.color}`} />
                {detail}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white text-xs h-6 px-2 flex-1">
              <Eye className="w-3 h-3 mr-1" />
              Watch
            </Button>
            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white text-xs h-6 px-2 flex-1">
              <Star className="w-3 h-3 mr-1" />
              Alert
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
