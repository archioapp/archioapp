"use client"

import type React from "react"
import {
  Timer,
  Clock,
  CandlestickChart,
  CheckCircle,
  History,
  Flame,
  AlertTriangle,
  TrendingUp,
  Move,
  Lock,
  Smile,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const Widget = ({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  className?: string
}) => (
  <Card className={cn("bg-matte-black/50 border-zinc-800 h-full", className)}>
    <CardHeader className="p-3 pb-2">
      <CardTitle className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-luxury-gold" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-3 pt-0">{children}</CardContent>
  </Card>
)

export function CopilotMonitoringWidgets() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      <Widget title="Time Monitor" icon={Timer} className="lg:col-span-2">
        <div className="flex items-center justify-around h-full text-center pt-2">
          <div>
            <p className="text-2xl font-bold text-white">03:12</p>
            <p className="text-[10px] text-zinc-500 uppercase">Time In Trade</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-white">Frankfurt</p>
            <p className="text-xs text-zinc-400 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" /> 3:12 AM
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">00:48</p>
            <p className="text-[10px] text-zinc-500 uppercase flex items-center justify-center gap-1">
              <CandlestickChart className="w-3 h-3" /> M15 Close
            </p>
          </div>
        </div>
      </Widget>

      <Widget title="Entry Alignment" icon={CheckCircle}>
        <div className="text-center flex flex-col justify-center h-full pt-2">
          <p className="text-4xl font-bold text-muted-emerald">89%</p>
          <p className="text-[10px] text-zinc-400 flex items-center justify-center gap-1">
            <History className="w-3 h-3" /> vs. Historical
          </p>
        </div>
      </Widget>

      <Widget title="Market Environment" icon={Flame}>
        <div className="text-center flex flex-col justify-center h-full pt-2">
          <p className="text-lg font-bold text-white">High Volatility</p>
          <p className="text-xs text-zinc-400">Spread: 2.1 pips</p>
          <div className="mt-1 text-xs text-amber-400 flex items-center justify-center gap-1 p-1 bg-amber-500/10 rounded-md">
            <AlertTriangle className="w-3 h-3" />
            <span>ISM in 27m</span>
          </div>
        </div>
      </Widget>

      <Widget title="Exit Readiness" icon={TrendingUp} className="lg:col-span-2">
        <div className="text-center flex flex-col justify-center h-full pt-2">
          <p className="text-sm font-semibold text-green-400">Target Zone Approaching</p>
          <p className="text-xs text-zinc-400">RR Hit: 1:1.8 | DXY Reversing</p>
          <div className="flex gap-1 mt-2">
            <Button
              size="xs"
              variant="ghost"
              className="text-zinc-400 hover:text-white text-[10px] h-6 px-1 flex-1 hover:bg-zinc-700/50"
            >
              Trail
            </Button>
            <Button
              size="xs"
              variant="ghost"
              className="text-zinc-400 hover:text-white text-[10px] h-6 px-1 flex-1 hover:bg-zinc-700/50"
            >
              Close 50%
            </Button>
            <Button
              size="xs"
              variant="ghost"
              className="text-zinc-400 hover:text-white text-[10px] h-6 px-1 flex-1 hover:bg-zinc-700/50"
            >
              <Move className="w-3 h-3 mr-1" /> BE
            </Button>
            <Button
              size="xs"
              variant="ghost"
              className="text-zinc-400 hover:text-white text-[10px] h-6 px-1 flex-1 hover:bg-zinc-700/50"
            >
              <Lock className="w-3 h-3 mr-1" /> Journal
            </Button>
          </div>
        </div>
      </Widget>

      <Widget title="Mental State" icon={Smile}>
        <div className="text-center flex flex-col justify-center h-full pt-2">
          <p className="text-2xl font-bold text-white">⚖️</p>
          <p className="text-xs text-zinc-400">Balanced</p>
        </div>
      </Widget>
    </div>
  )
}
