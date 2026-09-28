"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain } from "lucide-react"

export function AIForecastHeader() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/20 via-slate-900/50 to-blue-900/20 border border-purple-500/20 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 px-4 py-1 text-sm font-semibold animate-pulse">
              NEURAL ACTIVE
            </Badge>
          </div>
          <Button
            variant="outline"
            className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 bg-transparent"
          >
            View AI Analysis
          </Button>
        </div>

        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-2">
            AI-Powered Trading Intelligence
          </h1>
          <p className="text-slate-400 text-lg">
            Real-time AI forecasts • Neural network analysis • Professional community • Student mentorship
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">⚡</div>
              <div className="text-sm text-slate-400">
                AI predicts 89% probability of GBP/USD reaching 1.3675 within 24H
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-slate-400 mb-1">AI Confidence Level</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              96%
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Neural Active</Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Learning Mode</Badge>
            </div>
          </div>
        </div>

        <div className="absolute top-4 right-4 text-xs text-slate-500">Updated 30 seconds ago</div>
      </div>
    </div>
  )
}
