"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Star } from "lucide-react"
import { allAnalysisData } from "@/lib/analysis-data"

export function AnalysisBoxes() {
  const generalAnalysisBoxes = allAnalysisData.filter(
    (item) => item.placement === "generalAnalysis" || item.placement === "macroAnalysis",
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {generalAnalysisBoxes.map((box, index) => (
        <div
          key={index}
          className={`group p-4 rounded-xl bg-gradient-to-r ${box.bgColor} border ${box.borderColor} hover:scale-[1.02] transition-all duration-300 cursor-pointer backdrop-blur-sm shadow-lg hover:shadow-xl`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg bg-gradient-to-r ${box.color} shadow-lg group-hover:scale-110 transition-transform`}
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

          <div className="mb-3">
            <div className="text-xs text-slate-400 mb-1">Level:</div>
            <div className="text-white font-mono text-base font-bold bg-slate-800/50 px-2 py-1 rounded">
              {box.level}
            </div>
          </div>

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

          <div className="space-y-1.5 mb-3">
            {box.details.map((detail, idx) => (
              <div key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${box.color}`} />
                {detail}
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              variant="ghost"
              className="text-slate-400 hover:text-white text-xs h-7 px-2 flex-1 hover:bg-slate-700/50"
            >
              <Eye className="w-3 h-3 mr-1.5" />
              Watch
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-slate-400 hover:text-white text-xs h-7 px-2 flex-1 hover:bg-slate-700/50"
            >
              <Star className="w-3 h-3 mr-1.5" />
              Alert
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
