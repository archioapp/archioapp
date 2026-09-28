"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot } from "lucide-react"
import { PreFlightAnalysis } from "./pre-flight-analysis"
import { CopilotChecklist } from "./copilot-checklist"
import type { TradeState } from "./types"

interface CopilotRightPanelProps {
  tradeState: TradeState
  onClose: () => void
}

type PanelState = "checklist" | "analyzing" | "analysis_complete"

export function CopilotRightPanel({ tradeState, onClose }: CopilotRightPanelProps) {
  const [panelState, setPanelState] = useState<PanelState>("checklist")

  const handleChecklistSubmit = () => {
    setPanelState("analyzing")
    setTimeout(() => {
      setPanelState("analysis_complete")
    }, 2500) // Simulate analysis time
  }

  const handleAbort = () => {
    onClose()
  }

  const handleExecute = () => {
    // Add execution logic here
    console.log("Executing trade...")
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-end bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 35 }}
        className="relative h-full w-[900px] max-w-[90vw] border-l-2 border-blue-500/30 bg-[#111113]/80 shadow-2xl shadow-black backdrop-blur-xl"
      >
        <AnimatePresence mode="wait">
          {panelState === "checklist" && (
            <motion.div
              key="checklist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <CopilotChecklist tradeState={tradeState} onSubmit={handleChecklistSubmit} onCancel={onClose} />
            </motion.div>
          )}

          {panelState === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col items-center justify-center p-6 text-center"
            >
              <Bot className="mb-4 h-16 w-16 animate-pulse text-blue-400" />
              <h4 className="text-xl font-bold text-white">Analyzing Setup...</h4>
              <p className="text-zinc-400">
                Cross-referencing technicals, macroeconomics, and your psychological profile.
              </p>
            </motion.div>
          )}

          {panelState === "analysis_complete" && (
            <motion.div
              key="analysis_complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <PreFlightAnalysis tradeState={tradeState} onAbort={handleAbort} onExecute={handleExecute} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
