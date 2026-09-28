"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface MonitoringWidgetProps {
  icon: LucideIcon
  title: string
  value: string
  status?: "positive" | "negative"
}

export function MonitoringWidget({ icon: Icon, title, value, status }: MonitoringWidgetProps) {
  return (
    <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 flex flex-col justify-between">
      <div className="flex items-center gap-2 text-zinc-400">
        <Icon className="w-4 h-4" />
        <h4 className="text-sm font-medium">{title}</h4>
      </div>
      <p
        className={cn(
          "text-2xl font-bold text-right text-white",
          status === "positive" && "text-green-400",
          status === "negative" && "text-red-400",
        )}
      >
        {value}
      </p>
    </div>
  )
}
