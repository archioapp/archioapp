"use client"

import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Zap, Newspaper, Landmark, BrainCircuit } from "lucide-react"

const legendItems = [
  { label: "Asset", icon: DollarSign, color: "text-primary" },
  { label: "Event", icon: Zap, color: "text-destructive" },
  { label: "News", icon: Newspaper, color: "text-accent" },
  { label: "Institution", icon: Landmark, color: "text-blue-400" },
  { label: "Concept", icon: BrainCircuit, color: "text-green-400" },
]

export function NexusLegend() {
  return (
    <Card className="bg-slate-grey/80 backdrop-blur-sm border-zinc-800">
      <CardContent className="p-3">
        <div className="flex items-center gap-4">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-xs text-zinc-400">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
