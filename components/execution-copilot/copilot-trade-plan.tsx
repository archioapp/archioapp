"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, Shield, Zap, PlayCircle } from "lucide-react"
import type { TradeState } from "./types"

interface CopilotTradePlanProps {
  tradeState: TradeState
  onPlaceTrade: () => void
}

export function CopilotTradePlan({ tradeState, onPlaceTrade }: CopilotTradePlanProps) {
  const { status, pair, bias, entry, stopLoss, takeProfit, setupScore } = tradeState
  const rr =
    stopLoss && entry && takeProfit ? (Math.abs(takeProfit - entry) / Math.abs(entry - stopLoss)).toFixed(2) : "N/A"

  return (
    <Card className="bg-matte-black/50 border-zinc-800">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md font-bold text-white">Trade Plan</CardTitle>
          <Badge
            className={
              status === "live"
                ? "bg-muted-emerald/10 text-muted-emerald"
                : status === "stalking"
                  ? "bg-amber-500/10 text-amber-400"
                  : "bg-zinc-700 text-zinc-300"
            }
          >
            {status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div className="space-y-1">
            <p className="text-zinc-400">Pair</p>
            <p className="font-semibold text-white">{pair}</p>
          </div>
          <div className="space-y-1">
            <p className="text-zinc-400">Bias</p>
            <p className={`font-semibold ${bias === "long" ? "text-muted-emerald" : "text-scarlet-red"}`}>
              {bias?.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between items-center p-2 bg-zinc-900/50 rounded-md">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Target className="w-3 h-3 text-muted-emerald" /> Entry
            </span>
            <span className="font-mono text-white">{entry}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-zinc-900/50 rounded-md">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-scarlet-red" /> Stop Loss
            </span>
            <span className="font-mono text-white">{stopLoss}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-zinc-900/50 rounded-md">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-blue-400" /> Take Profit
            </span>
            <span className="font-mono text-white">{takeProfit}</span>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm mb-4">
          <p className="text-zinc-400">Risk/Reward:</p>
          <p className="font-semibold text-white">1:{rr}</p>
        </div>
        <div className="flex justify-between items-center text-sm mb-4">
          <p className="text-zinc-400">Setup Score:</p>
          <p className="font-semibold text-luxury-gold">{setupScore}%</p>
        </div>
        {status === "stalking" && (
          <Button
            onClick={onPlaceTrade}
            className="w-full bg-luxury-gold text-matte-black hover:bg-amber-300 font-bold shadow-lg shadow-luxury-gold/20"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            Confirm Entry & Activate Co-Pilot
          </Button>
        )}
        {status === "live" && (
          <Button
            variant="outline"
            className="w-full border-scarlet-red/50 bg-scarlet-red/10 text-scarlet-red hover:bg-scarlet-red/20 hover:text-scarlet-red"
          >
            Close Position
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
