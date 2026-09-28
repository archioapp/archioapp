"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, AlertTriangle, TrendingUp, TrendingDown, BarChart2 } from "lucide-react"
import type { NewsEvent } from "./news-bar"

interface NewsAIBreakdownModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  event: NewsEvent | null
}

export function NewsAIBreakdownModal({ isOpen, onOpenChange, event }: NewsAIBreakdownModalProps) {
  if (!event) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-slate-950/80 border-purple-500/30 backdrop-blur-2xl text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI News Breakdown
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-200">{event.event}</h3>
            <div className="flex items-center gap-2">
              <Badge className="text-lg" variant="secondary">
                {event.currency}
              </Badge>
              <Badge
                className={`text-lg ${
                  event.impact === "high" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {event.impact.toUpperCase()} IMPACT
              </Badge>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <div className="flex justify-between">
                <div>
                  <div className="text-slate-400 text-sm">Forecast</div>
                  <div className="text-xl font-bold">{event.forecast}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Previous</div>
                  <div className="text-xl font-bold">{event.previous}</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 text-sm">Time (EST)</div>
                  <div className="text-xl font-bold">{event.time}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-purple-400">AI Analysis Summary</h4>
              <p className="text-slate-300 text-sm">{event.aiAnalysis.summary}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <h4 className="font-semibold text-slate-300 mb-3">AI Impact Metrics</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Impact Score</span>
                    <span className="font-bold text-white">{event.aiAnalysis.impactScore}/100</span>
                  </div>
                  <Progress value={event.aiAnalysis.impactScore} className="h-3" />
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Expected Volatility</div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`w-5 h-5 ${
                        event.aiAnalysis.expectedVolatility === "High"
                          ? "text-red-400"
                          : event.aiAnalysis.expectedVolatility === "Medium"
                            ? "text-yellow-400"
                            : "text-green-400"
                      }`}
                    />
                    <span className="font-bold text-lg">{event.aiAnalysis.expectedVolatility}</span>
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Potential Direction</div>
                  <div className="flex items-center gap-2">
                    {event.aiAnalysis.potentialDirection.includes("Bullish") ? (
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    )}
                    <span className="font-bold text-lg">{event.aiAnalysis.potentialDirection}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <h4 className="font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                Pairs to Watch
              </h4>
              <div className="flex flex-wrap gap-2">
                {event.aiAnalysis.pairsToWatch.map((pair) => (
                  <Badge key={pair} variant="secondary" className="text-sm bg-blue-500/20 text-blue-300">
                    {pair}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
