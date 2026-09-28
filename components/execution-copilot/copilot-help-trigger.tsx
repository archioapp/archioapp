"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { HelpCircle } from "lucide-react"
import { CopilotInstructionsPanel } from "./copilot-instructions-panel"

export function CopilotHelpTrigger() {
  const [isPanelVisible, setIsPanelVisible] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPanelVisible(true)}
      onMouseLeave={() => setIsPanelVisible(false)}
    >
      <button className="p-2 rounded-full text-zinc-400 hover:bg-slate-800 hover:text-white transition-colors relative">
        <HelpCircle className="w-6 h-6" />
        <AnimatePresence>
          {isPanelVisible && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-luxury-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-luxury-gold"></span>
            </span>
          )}
        </AnimatePresence>
      </button>
      <AnimatePresence>{isPanelVisible && <CopilotInstructionsPanel />}</AnimatePresence>
    </div>
  )
}
