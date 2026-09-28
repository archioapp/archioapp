"use client"

import { useState } from "react"
import { TradingViewWidget } from "@/components/trading-view-widget"
import { InstrumentSelector } from "@/components/execution-copilot/instrument-selector"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Settings, Maximize2 } from "lucide-react"

export function CopilotChartPanel() {
  const [selectedSymbol, setSelectedSymbol] = useState("EURUSD")
  const [timeframe, setTimeframe] = useState("1H")

  const timeframes = ["1m", "5m", "15m", "30m", "1H", "4H", "1D", "1W"]

  return (
    <div className="flex flex-col h-full">
      {/* Chart Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
        <div className="flex items-center gap-4">
          <InstrumentSelector selectedSymbol={selectedSymbol} onSymbolChange={setSelectedSymbol} />

          <div className="flex items-center gap-2">
            {timeframes.map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className={`
                  h-8 px-3 text-xs font-medium transition-all duration-200
                  ${
                    timeframe === tf
                      ? "bg-purple-500/20 text-purple-300 border-purple-400/30"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  }
                `}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800/50">
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800/50">
            <TrendingUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800/50">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800/50">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 relative">
        <TradingViewWidget
          symbol={selectedSymbol}
          interval={timeframe}
          theme="dark"
          style="1"
          locale="en"
          toolbar_bg="#0c0c10"
          enable_publishing={false}
          hide_top_toolbar={false}
          hide_legend={false}
          save_image={false}
          container_id="tradingview_chart"
        />
      </div>
    </div>
  )
}
