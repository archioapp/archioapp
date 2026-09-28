"use client"

import { motion } from "framer-motion"
import type { Mode } from "@/lib/types/trading-modes"
import { TrendingUp, Clock, BarChart3 } from "lucide-react"

interface ModeSelectorProps {
  value: Mode
  onChange: (mode: Mode) => void
  className?: string
}

const modeConfig = {
  scalp: {
    icon: Clock,
    label: "Scalp",
    description: "5M  15M  1H",
    activeText: "text-emerald-400",
    activeBorder: "border-emerald-400/30",
    activeBg: "bg-emerald-400/[0.06]",
    dot: "bg-emerald-400",
  },
  day: {
    icon: TrendingUp,
    label: "Day",
    description: "15M  1H  4H",
    activeText: "text-blue-400",
    activeBorder: "border-blue-400/30",
    activeBg: "bg-blue-400/[0.06]",
    dot: "bg-blue-400",
  },
  swing: {
    icon: BarChart3,
    label: "Swing",
    description: "4H  1D  1W",
    activeText: "text-amber-400",
    activeBorder: "border-amber-400/30",
    activeBg: "bg-amber-400/[0.06]",
    dot: "bg-amber-400",
  },
}

export function ModeSelector({ value, onChange, className = "" }: ModeSelectorProps) {
  const modes: Mode[] = ["scalp", "day", "swing"]

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-1.5 mr-1">
        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
        <span className="text-xs font-medium text-white/40">Trading Mode</span>
      </div>

      <div className="flex items-center bg-white/[0.02] backdrop-blur-sm rounded-lg p-0.5 border border-white/[0.06]">
        {modes.map((mode) => {
          const config = modeConfig[mode]
          const Icon = config.icon
          const isActive = mode === value

          return (
            <button
              key={mode}
              onClick={() => onChange(mode)}
              className={`
                relative flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium
                transition-all duration-200 min-w-[90px] justify-center
                ${
                  isActive
                    ? `${config.activeText} ${config.activeBorder} ${config.activeBg} border`
                    : "text-white/30 hover:text-white/50 hover:bg-white/[0.03] border border-transparent"
                }
              `}
              aria-pressed={isActive}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <div className="flex flex-col items-start leading-tight">
                <span className="font-semibold text-xs">{config.label}</span>
                <span className={`text-[9px] font-mono ${isActive ? "opacity-60" : "opacity-40"}`}>
                  {config.description}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
