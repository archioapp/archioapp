"use client"

import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface FeatureButtonProps {
  icon: LucideIcon
  label: string
  isActive: boolean
  onClick: () => void
}

export function FeatureButton({ icon: Icon, label, isActive, onClick }: FeatureButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="relative flex flex-col items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={`relative p-3 rounded-lg transition-all duration-300 ${
          isActive ? "bg-luxury-gold/20" : "bg-zinc-800/50"
        }`}
      >
        <Icon className={`w-6 h-6 transition-colors duration-300 ${isActive ? "text-luxury-gold" : ""}`} />
      </div>
      <span className="text-xs font-medium">{label}</span>
      {isActive && (
        <motion.div
          layoutId="active-feature-indicator"
          className="absolute -bottom-2 w-1.5 h-1.5 bg-luxury-gold rounded-full"
        />
      )}
    </motion.button>
  )
}
