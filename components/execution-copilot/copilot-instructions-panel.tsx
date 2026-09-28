"use client"

import { motion } from "framer-motion"
import { HelpCircle, MousePointer, ListChecks, Bot, Rocket } from "lucide-react"

const instructionSteps = [
  {
    icon: MousePointer,
    title: "Define Your Trade on the Chart",
    description:
      "Use your charting tools to mark your precise Entry, Stop Loss, and Target levels for your intended trade.",
  },
  {
    icon: ListChecks,
    title: "Complete the Pre-Flight Checklist",
    description:
      "Open the Co-Pilot panel and fill out the checklist covering both the psychological and technical aspects of your trade plan.",
  },
  {
    icon: Bot,
    title: "Initiate AI Analysis",
    description:
      "Press the 'Initiate Analysis' button. The AI will take a snapshot of your chart setup and cross-reference it with your checklist to provide a validation score.",
  },
  {
    icon: Rocket,
    title: "Execute or Abort",
    description: "Based on the AI verdict, make an informed decision to execute the trade or abort and reassess.",
  },
]

export function CopilotInstructionsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full right-0 mt-2 w-96 bg-slate-grey/90 backdrop-blur-lg border border-zinc-700 rounded-xl shadow-2xl p-6 text-white"
    >
      <div className="flex items-center gap-3 mb-4">
        <HelpCircle className="w-6 h-6 text-luxury-gold" />
        <h3 className="text-lg font-bold">How to Use the Execution Co-Pilot</h3>
      </div>
      <div className="space-y-4">
        {instructionSteps.map((step, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
              <step.icon className="w-5 h-5 text-zinc-300" />
            </div>
            <div>
              <h4 className="font-semibold">{step.title}</h4>
              <p className="text-sm text-zinc-400">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
