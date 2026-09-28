"use client"

import { motion } from "framer-motion"
import { BarChart, CheckCircle, MapPin, Shield, Target, TrendingUp, Info } from "lucide-react"
import type { Scenario } from "@/lib/analysis-data"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const InfoIcon = ({ text }: { text: string }) => (
  <TooltipProvider delayDuration={150}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button>
          <Info size={12} className="text-zinc-500 hover:text-white transition-colors" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs bg-slate-800 border-slate-700 text-white">
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export function AnalysisCard({ item, onClick }: { item: Scenario; onClick: () => void }) {
  const isBuy = item.position === "Buy Position"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-slate-grey/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 w-[340px] shadow-2xl cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2 rounded-lg",
              isBuy ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400",
            )}
          >
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="font-bold text-white">{item.pair}</h3>
            <p className={cn("text-sm", isBuy ? "text-emerald-400" : "text-red-400")}>{item.position}</p>
          </div>
        </div>
        <div className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full">
          {item.probability}
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 my-4 text-center">
        <div className="flex items-center justify-center gap-1 text-xs text-pink-400 mb-1">
          <MapPin size={12} />
          <span>Level</span>
        </div>
        <p className="text-white font-mono text-lg">{item.level}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center text-xs">
        <div>
          <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
            <Shield size={12} />
            <span>R/R</span>
          </div>
          <p className="text-white font-semibold">{item.rr}</p>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
            <Shield size={12} />
            <span>SL</span>
          </div>
          <p className="text-white font-mono">{item.sl}</p>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
            <Target size={12} />
            <span>TP</span>
          </div>
          <p className="text-white font-mono">{item.tp}</p>
        </div>
      </div>

      <div className="border-t border-slate-800 my-4" />

      <div>
        <h4 className="font-semibold text-white mb-2 text-sm flex items-center gap-2">
          <BarChart size={16} />
          Key Confluences
        </h4>
        <div className="space-y-2 text-sm">
          {item.confluences.map((conf, index) => (
            <div key={index} className="flex items-center gap-2 text-zinc-300">
              <CheckCircle size={16} className="text-emerald-400" />
              <span>{conf.text}</span>
              {conf.tooltip && <InfoIcon text={conf.tooltip} />}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-zinc-400">AI Confidence:</span>
          <span className="font-bold text-cyan-400">{item.aiConfidence}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-1">
          <div className="bg-cyan-400 h-2 rounded-full" style={{ width: `${item.aiConfidence}%` }} />
        </div>
      </div>
    </motion.div>
  )
}
