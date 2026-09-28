"use client"

import type { Legs } from "@/lib/types/trading-modes"
import { Layers } from "lucide-react"

interface LegsToggleProps {
  value: Legs
  onChange: (legs: Legs) => void
  className?: string
}

export function LegsToggle({ value, onChange, className = "" }: LegsToggleProps) {
  const options: Legs[] = [1, 2]

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-1.5 mr-1">
        <Layers className="w-3.5 h-3.5 text-white/30" />
        <span className="text-xs font-medium text-white/40">Swing Legs</span>
      </div>

      <div className="flex items-center bg-white/[0.02] backdrop-blur-sm rounded-lg p-0.5 border border-white/[0.06]">
        {options.map((legs) => {
          const isActive = legs === value

          return (
            <button
              key={legs}
              onClick={() => onChange(legs)}
              className={`
                flex items-center justify-center gap-1 px-4 py-2 rounded-md text-xs font-medium
                transition-all duration-200 min-w-[52px]
                ${
                  isActive
                    ? "text-white/80 bg-white/[0.06] border border-white/[0.1]"
                    : "text-white/30 hover:text-white/50 hover:bg-white/[0.03] border border-transparent"
                }
              `}
              aria-pressed={isActive}
              title={`${legs} swing leg${legs === 1 ? "" : "s"}`}
            >
              <span className="font-bold text-sm">{legs}</span>
              <span className="text-[9px] opacity-60 uppercase tracking-wider">
                Leg{legs === 1 ? "" : "s"}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
