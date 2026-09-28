"use client"

import { Badge } from "@/components/ui/badge"
import { Zap, Target } from "lucide-react"

const zones = [
  { level: "1.3509", type: "BPR", status: "hit", reactions: 3, strength: 94 },
  { level: "1.3445", type: "Weekly", status: "tested", reactions: 2, strength: 87 },
  { level: "1.3387", type: "Fib", status: "pending", reactions: 0, strength: 82 },
  { level: "1.3304", type: "Demand", status: "pending", reactions: 0, strength: 78 },
]

export function ZoneHeatmap() {
  return (
    <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-5 h-5 text-orange-400" />
        <h4 className="text-white font-semibold">Zone Reaction Heatmap</h4>
        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">LIVE</Badge>
      </div>

      <div className="space-y-2">
        {zones.map((zone, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg hover:bg-slate-700/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  zone.status === "hit"
                    ? "bg-red-400 animate-pulse"
                    : zone.status === "tested"
                      ? "bg-yellow-400"
                      : "bg-gray-400"
                }`}
              />
              <span className="text-white font-mono text-sm">{zone.level}</span>
              <Badge className="bg-slate-700 text-slate-300 text-xs">{zone.type}</Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{zone.reactions}x</span>
              <div className="w-12 bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    zone.strength >= 90
                      ? "bg-gradient-to-r from-red-400 to-red-500"
                      : zone.strength >= 80
                        ? "bg-gradient-to-r from-orange-400 to-orange-500"
                        : "bg-gradient-to-r from-yellow-400 to-yellow-500"
                  }`}
                  style={{ width: `${zone.strength}%` }}
                />
              </div>
              <span className="text-xs text-white font-semibold">{zone.strength}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-red-400 animate-pulse" />
          <span className="text-red-400 font-semibold text-sm">High Activity Zone</span>
        </div>
        <p className="text-xs text-slate-300 mt-1">BPR at 1.3509 showing strong rejection signals</p>
      </div>
    </div>
  )
}
