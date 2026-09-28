"use client"

import { TradingViewWidget } from "@/components/trading-view-widget"
import { Badge } from "@/components/ui/badge"

export function SingleTradingChart() {
  return (
    <div className="bg-slate-grey/20 rounded-2xl p-4 border border-slate-grey h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-semibold text-lg">GBPUSD • 15M</h4>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hidden sm:flex">LIVE</Badge>
        </div>
      </div>
      <div className="flex-1 rounded-lg overflow-hidden">
        <TradingViewWidget symbol="FX:GBPUSD" />
      </div>
    </div>
  )
}
