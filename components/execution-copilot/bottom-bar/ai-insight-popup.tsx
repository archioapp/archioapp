"use client"

import { motion } from "framer-motion"
import { Bot, X } from "lucide-react"

interface AIInsightPopupProps {
  message: string
  onClose: () => void
}

export function AIInsightPopup({ message, onClose }: AIInsightPopupProps) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="absolute bottom-[120px] right-8 w-[350px] z-50"
    >
      <div className="relative bg-gradient-to-br from-indigo-500/20 via-slate-grey/90 to-slate-grey/90 backdrop-blur-lg border border-indigo-400/30 rounded-lg p-4 shadow-2xl shadow-black/50">
        <button onClick={onClose} className="absolute top-2 right-2 text-zinc-500 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 bg-indigo-500/30 rounded-full">
            <Bot className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <h4 className="font-semibold text-indigo-300 mb-1">AI Co-Pilot Insight</h4>
            <p className="text-sm text-zinc-300">{message}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
