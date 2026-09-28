"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

const mockEvents = [
  { id: "1", time: "14:32", type: "scenario:opened", detail: "EURUSD scenario started", severity: "info" },
  { id: "2", time: "14:33", type: "scenario:changed", detail: "Entry: 1.0850, SL: 1.0830", severity: "info" },
  { id: "3", time: "14:34", type: "risk:warning", detail: "No stop loss detected", severity: "warning" },
  { id: "4", time: "14:35", type: "scenario:saved", detail: "Setup completed", severity: "info" },
  { id: "5", time: "14:36", type: "order:previewed", detail: "Risk: 1.2%, RR: 2.1", severity: "info" },
]

export function EventTimeline() {
  return (
    <ScrollArea className="h-full p-3">
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-white">Event Timeline</h4>

        <div className="space-y-3">
          {mockEvents.map((event) => (
            <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg bg-white/5">
              <div className="text-xs text-white/60 font-mono w-12 flex-shrink-0">{event.time}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={event.severity === "warning" ? "secondary" : "outline"} className="text-xs px-1 py-0">
                    {event.type}
                  </Badge>
                </div>
                <div className="text-xs text-white/80">{event.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
