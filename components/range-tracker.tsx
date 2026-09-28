"use client"

import { Badge } from "@/components/ui/badge"
import { Clock, Target } from "lucide-react"

export function RangeTracker() {
  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-purple-400" />
        <h4 className="text-white font-semibold">Asia/Frankfurt Range</h4>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">8PM-12AM EST</Badge>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center p-2 bg-slate-800/30 rounded-lg">
          <span className="text-sm text-slate-300">Range High</span>
          <span className="text-white font-mono">1.3498</span>
          <Badge className="bg-red-500/20 text-red-400 text-xs">SWEPT ✓</Badge>
        </div>

        <div className="flex justify-between items-center p-2 bg-slate-800/30 rounded-lg">
          <span className="text-sm text-slate-300">Range Low</span>
          <span className="text-white font-mono">1.3421</span>
          <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">PENDING</Badge>
        </div>

        <div className="flex justify-between items-center p-2 bg-slate-800/30 rounded-lg">
          <span className="text-sm text-slate-300">Current Price</span>
          <span className="text-white font-mono">1.3442</span>
          <Badge className="bg-blue-500/20 text-blue-400 text-xs">LIVE</Badge>
        </div>

        <div className="mt-3 p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-semibold text-sm">Range Sweep Detected</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">High swept at 1.3498 - Looking for reversal</p>
        </div>
      </div>
    </div>
  )
}
