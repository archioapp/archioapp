"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LayoutGrid, Shuffle, Target, Network } from "lucide-react"

interface NexusControlPanelProps {
  layouts: string[]
  activeLayout: string
  onLayoutChange: (layout: string) => void
}

export function NexusControlPanel({ layouts, activeLayout, onLayoutChange }: NexusControlPanelProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getLayoutIcon = (layout: string) => {
    switch (layout) {
      case "circular":
        return Target
      case "force":
        return Network
      case "hierarchical":
        return LayoutGrid
      case "random":
        return Shuffle
      default:
        return LayoutGrid
    }
  }

  const getLayoutLabel = (layout: string) => {
    return layout.charAt(0).toUpperCase() + layout.slice(1)
  }

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="absolute top-4 left-1/2 -translate-x-1/2 z-40"
    >
      <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl p-2">
        <div className="flex items-center gap-2">
          <div className="text-white font-semibold text-sm px-3 py-2">Layout:</div>
          {layouts.map((layout) => {
            const IconComponent = getLayoutIcon(layout)
            const isActive = activeLayout === layout

            return (
              <motion.button
                key={layout}
                onClick={() => onLayoutChange(layout)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                  ${
                    isActive ? "bg-blue-600 text-white shadow-lg" : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{getLayoutLabel(layout)}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
