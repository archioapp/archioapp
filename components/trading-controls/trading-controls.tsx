"use client"

import { motion } from "framer-motion"
import { type Mode, type Legs, MODE_CONFIG } from "@/lib/types/trading-modes"
import { ModeSelector } from "./mode-selector"
import { LegsToggle } from "./legs-toggle"
import { Settings, Info } from "lucide-react"

interface TradingControlsProps {
  mode: Mode
  legs: Legs
  onModeChange: (mode: Mode) => void
  onLegsChange: (legs: Legs) => void
  className?: string
}

export function TradingControls({ mode, legs, onModeChange, onLegsChange, className = "" }: TradingControlsProps) {
  const currentConfig = MODE_CONFIG[mode]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`
        relative rounded-xl border border-white/[0.06]
        bg-white/[0.015] p-4 ${className}
      `}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center border border-white/[0.06]">
              <Settings className="w-3.5 h-3.5 text-white/35" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white/70">Trading Controls</h3>
              <p className="text-[10px] text-white/30">Configure analysis parameters</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]">
            <Info className="w-3 h-3 text-blue-400/60" />
            <span className="text-[10px] text-blue-400/60 font-medium">Live Analysis</span>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
          <ModeSelector value={mode} onChange={onModeChange} className="flex-1" />
          <LegsToggle value={legs} onChange={onLegsChange} />
        </div>

        {/* Current Configuration */}
        <motion.div
          key={`${mode}-${legs}`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-lg bg-white/[0.025] border border-white/[0.05] px-3.5 py-2.5"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-medium text-white/35 uppercase tracking-wider">Current Configuration</span>
            <div className="flex items-center gap-1.5">
              {currentConfig.cards.map((card, idx) => (
                <div key={card.tf} className="flex items-center gap-1">
                  <span className="text-[10px] font-mono text-white/50 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
                    {card.displayName}={card.counts[legs]}
                  </span>
                  {idx < currentConfig.cards.length - 1 && <span className="text-white/15">·</span>}
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-white/35 leading-relaxed">
            <span className="font-semibold text-white/50">{mode.toUpperCase()} Mode:</span>{" "}
            {currentConfig.description}
            {" · "}
            <span className="font-semibold text-white/50">
              {legs} Leg{legs === 1 ? "" : "s"}:
            </span>{" "}
            Analyzing the latest {legs === 1 ? "swing movement" : "two swing movements"} for precise entry timing.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
