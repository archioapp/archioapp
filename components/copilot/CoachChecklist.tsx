"use client"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

const checklistItems = [
  { id: "market-structure", label: "Market structure analyzed", category: "Technical" },
  { id: "key-levels", label: "Key levels identified", category: "Technical" },
  { id: "risk-reward", label: "Risk/reward calculated", category: "Risk" },
  { id: "position-size", label: "Position size determined", category: "Risk" },
  { id: "news-check", label: "News events checked", category: "Fundamental" },
  { id: "session-timing", label: "Session timing considered", category: "Fundamental" },
]

export function CoachChecklist() {
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  const toggleItem = (id: string) => {
    const newCompleted = new Set(completed)
    if (newCompleted.has(id)) {
      newCompleted.delete(id)
    } else {
      newCompleted.add(id)
    }
    setCompleted(newCompleted)
  }

  const completionRate = Math.round((completed.size / checklistItems.length) * 100)

  return (
    <ScrollArea className="h-full p-3">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white">Pre-Trade Checklist</h4>
          <Badge variant={completionRate === 100 ? "default" : "secondary"}>{completionRate}%</Badge>
        </div>

        <div className="space-y-3">
          {checklistItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <Checkbox
                id={item.id}
                checked={completed.has(item.id)}
                onCheckedChange={() => toggleItem(item.id)}
                className="border-white/30"
              />
              <div className="flex-1">
                <label htmlFor={item.id} className="text-sm text-white cursor-pointer">
                  {item.label}
                </label>
                <div className="text-xs text-white/60">{item.category}</div>
              </div>
            </div>
          ))}
        </div>

        {completionRate === 100 && (
          <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <div className="text-sm font-medium text-green-300">Ready to Trade</div>
            <div className="text-xs text-green-200/80">All checklist items completed</div>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
