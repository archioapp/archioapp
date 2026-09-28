"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BrainCircuit, ScanLine } from "lucide-react"

interface CopilotTriggerProps {
  onClick: () => void
}

export function CopilotTrigger({ onClick }: CopilotTriggerProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed top-1/2 right-4 -translate-y-1/2 z-50 flex items-center gap-4"
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <button
              onClick={onClick}
              className="flex items-center gap-3 whitespace-nowrap rounded-lg bg-gradient-to-r from-luxury-gold/90 to-luxury-gold bg-luxury-gold px-6 py-4 text-lg font-bold text-black shadow-lg shadow-luxury-gold/30 transition-all duration-300 hover:shadow-xl hover:shadow-luxury-gold/40"
            >
              <ScanLine className="h-6 w-6" />
              Analyze Entry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-slate-800/80 backdrop-blur-md"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-luxury-gold"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <BrainCircuit className="h-8 w-8 text-luxury-gold" />
      </motion.div>
    </div>
  )
}
