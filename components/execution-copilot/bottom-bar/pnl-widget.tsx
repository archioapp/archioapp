"use client"

import { BarChart2 } from "lucide-react"

export function PnLWidget() {
  // In a real app, this would come from state/props
  const pnl = "+$1,240.50"
  const isPositive = pnl.startsWith("+")

  return (
    <div className="flex flex-col items-center gap-2 text-white">
      <div className="flex items-center gap-2">
        <BarChart2 className={`w-5 h-5 ${isPositive ? "text-green-400" : "text-red-400"}`} />
        <span className="text-xs text-zinc-400 font-medium">Live P&L</span>
      </div>
      <span className={`text-2xl font-bold tracking-tight ${isPositive ? "text-green-400" : "text-red-400"}`}>
        {pnl}
      </span>
    </div>
  )
}
