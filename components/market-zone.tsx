"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, Zap } from "lucide-react"
import { TradingViewWidget } from "@/components/trading-view-widget"

const marketData = [
  { pair: "DXY", price: "104.85", change: "+0.23%", trend: "up", strength: "Strong" },
  { pair: "GBP/USD", price: "1.3442", change: "-0.15%", trend: "down", strength: "Weak" },
  { pair: "EUR/USD", price: "1.0876", change: "+0.08%", trend: "up", strength: "Neutral" },
]

const forecastZones = [
  { level: "1.3509", type: "BPR Resistance", status: "active", confidence: "87%" },
  { level: "1.3445", type: "Weekly Open", status: "tested", confidence: "92%" },
  { level: "1.3304", type: "Demand Zone", status: "pending", confidence: "78%" },
]

export function MarketZone() {
  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-emerald-900/10 border-emerald-500/20 backdrop-blur-xl h-full overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Real-Time Market Zone
          </span>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">LIVE</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 h-full overflow-y-auto">
        {/* Market Overview */}
        <div className="grid grid-cols-3 gap-3">
          {marketData.map((market) => (
            <div
              key={market.pair}
              className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/50 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-200">{market.pair}</span>
                {market.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div className="text-lg font-bold text-white mb-1">{market.price}</div>
              <div className={`text-sm ${market.trend === "up" ? "text-emerald-400" : "text-red-400"} mb-1`}>
                {market.change}
              </div>
              <Badge
                className={`text-xs ${
                  market.strength === "Strong"
                    ? "bg-green-500/20 text-green-400"
                    : market.strength === "Weak"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {market.strength}
              </Badge>
            </div>
          ))}
        </div>

        {/* TradingView Chart */}
        <div className="bg-slate-800/20 rounded-xl p-4 h-80 border border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-semibold">GBP/USD Live Chart</h4>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">15M Timeframe</Badge>
          </div>
          <TradingViewWidget symbol="FX:GBPUSD" />
        </div>

        {/* AI Forecast Zones */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h4 className="text-white font-semibold">AI Forecast Zones</h4>
          </div>
          {forecastZones.map((zone, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-800/30 to-slate-700/30 rounded-xl border border-slate-600/30 hover:border-purple-500/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="text-white font-mono text-lg">{zone.level}</div>
                <div>
                  <div className="text-slate-300 font-medium">{zone.type}</div>
                  <div className="text-xs text-slate-400">Confidence: {zone.confidence}</div>
                </div>
              </div>
              <Badge
                className={
                  zone.status === "active"
                    ? "bg-green-500/20 text-green-400 border-green-500/30 animate-pulse"
                    : zone.status === "tested"
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                }
              >
                {zone.status.toUpperCase()}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
