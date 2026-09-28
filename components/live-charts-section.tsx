"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TradingViewWidget } from "@/components/trading-view-widget"
import { ConfluenceBoxes } from "@/components/confluence-boxes"
import { NewsBar } from "@/components/news-bar"
import { RangeTracker } from "@/components/range-tracker"
import { ZoneHeatmap } from "@/components/zone-heatmap"
import { Activity } from "lucide-react"

const marketPairs = [
  { symbol: "FX:GBPUSD", name: "GBP/USD", price: "1.3442", change: "-0.15%", trend: "down" },
  { symbol: "FX:EURUSD", name: "EUR/USD", price: "1.0876", change: "+0.08%", trend: "up" },
  { symbol: "TVC:DXY", name: "DXY", price: "104.85", change: "+0.23%", trend: "up" },
  { symbol: "FX:XAUUSD", name: "GOLD", price: "2018.45", change: "+0.45%", trend: "up" },
]

export function LiveChartsSection() {
  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-blue-900/10 border-blue-500/20 backdrop-blur-xl h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Live Market Intelligence
            </span>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse">⚡ REAL-TIME</Badge>
          </CardTitle>

          <div className="flex items-center gap-2">
            {marketPairs.map((pair) => (
              <div
                key={pair.symbol}
                className="text-center px-3 py-2 bg-slate-800/30 rounded-lg border border-slate-700/50"
              >
                <div className="text-xs text-slate-400">{pair.name}</div>
                <div className="text-sm font-bold text-white">{pair.price}</div>
                <div className={`text-xs ${pair.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                  {pair.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 h-full overflow-y-auto">
        {/* News Bar */}
        <NewsBar />

        {/* Main Chart with Confluences */}
        <div className="grid grid-cols-4 gap-4 h-96">
          <div className="col-span-3 bg-slate-800/20 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-semibold">GBP/USD • 15M</h4>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">LIVE</Badge>
            </div>
            <TradingViewWidget symbol="FX:GBPUSD" />
          </div>

          <div className="col-span-1">
            <ConfluenceBoxes />
          </div>
        </div>

        {/* Range Tracker & Zone Heatmap */}
        <div className="grid grid-cols-2 gap-4">
          <RangeTracker />
          <ZoneHeatmap />
        </div>

        {/* Additional Charts Grid */}
        <div className="grid grid-cols-3 gap-4 h-64">
          <div className="bg-slate-800/20 rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-white text-sm font-semibold">EUR/USD</h5>
              <Badge className="bg-blue-500/20 text-blue-400 text-xs">15M</Badge>
            </div>
            <TradingViewWidget symbol="FX:EURUSD" />
          </div>

          <div className="bg-slate-800/20 rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-white text-sm font-semibold">DXY</h5>
              <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">15M</Badge>
            </div>
            <TradingViewWidget symbol="TVC:DXY" />
          </div>

          <div className="bg-slate-800/20 rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-white text-sm font-semibold">GOLD</h5>
              <Badge className="bg-orange-500/20 text-orange-400 text-xs">15M</Badge>
            </div>
            <TradingViewWidget symbol="FX:XAUUSD" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
