"use client"

import { useEffect, useRef } from "react"
import { useCopilotStore } from "@/lib/stores/copilotStore"
import { CopilotDrawer } from "./CopilotDrawer"
import { Badge } from "@/components/ui/badge"
import { Bot } from "lucide-react"

export function CopilotFAB() {
  const { open, setOpen, unread } = useCopilotStore()
  const ref = useRef<HTMLButtonElement>(null)

  // Very light "swipe up" gesture for mobile
  useEffect(() => {
    const btn = ref.current
    if (!btn) return
    let startY = 0
    const start = (e: TouchEvent) => (startY = e.touches[0].clientY)
    const move = (e: TouchEvent) => {
      const dy = startY - e.touches[0].clientY
      if (dy > 40) setOpen(true) // swipe up
    }
    btn.addEventListener("touchstart", start)
    btn.addEventListener("touchmove", move)
    return () => {
      btn.removeEventListener("touchstart", start)
      btn.removeEventListener("touchmove", move)
    }
  }, [setOpen])

  return (
    <>
      <button
        ref={ref}
        aria-label="Open Copilot"
        className="fixed bottom-4 right-4 z-50 rounded-full premium-glass-button px-4 py-3 shadow-lg backdrop-blur border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Bot className="w-4 h-4 text-purple-400" />
          <span className="text-white">Copilot</span>
          {unread > 0 && (
            <Badge variant="destructive" className="bg-red-500/80 text-white">
              {unread}
            </Badge>
          )}
        </div>
      </button>
      <CopilotDrawer />
    </>
  )
}
