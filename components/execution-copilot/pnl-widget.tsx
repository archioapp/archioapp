"use client"

import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { BarChart2 } from "lucide-react"

const data = [
  { pnl: 100 },
  { pnl: 250 },
  { pnl: 200 },
  { pnl: 400 },
  { pnl: 350 },
  { pnl: 600 },
  { pnl: 800 },
  { pnl: 1240.5 },
]

export function PnLWidget() {
  return (
    <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 text-zinc-400">
          <BarChart2 className="w-4 h-4" />
          <p className="text-sm font-semibold">Live P&L</p>
        </div>
        <p className="text-3xl font-bold text-green-400 mt-2">+$1,240.50</p>
      </div>
      <div className="h-16 -mb-4 -mx-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="pnl"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#pnlGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
