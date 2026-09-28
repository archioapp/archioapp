"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import * as Icons from "lucide-react"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useConfluenceStore, strengthFromCount, RECOMMENDED_MAX_SELECTED } from "@/stores/confluence-store"

type IconName = keyof typeof Icons

export interface BottomConfluenceCardProps {
  id: string
  label: string
  icon: IconName
  hoverDescription?: string
  summary?: string
  onInfo: (id: string) => void
}

export function BottomConfluenceCard({
  id,
  label,
  icon,
  hoverDescription,
  summary,
  onInfo,
}: BottomConfluenceCardProps) {
  const Icon = (Icons as any)[icon] ?? Icons.CircleDot
  const [hovered, setHovered] = useState(false)

  const selectedConfluences = useConfluenceStore((s) => s.selectedConfluences)
  const toggleConfluence = useConfluenceStore((s) => s.toggleConfluence)
  const confluenceStatus = useConfluenceStore((s) => s.confluenceStatus)

  const isSelected = selectedConfluences.includes(id)
  const globalStrength = strengthFromCount(selectedConfluences.length, RECOMMENDED_MAX_SELECTED)
  const status = confluenceStatus[id]
  const isActive = status?.active ?? false
  const liveStrength = status?.strength ?? 0

  return (
    <motion.button
      type="button"
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => toggleConfluence(id)}
      className={cn(
        "relative group rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center",
        "bg-slate-900/60 border border-zinc-700/60 shadow-lg shadow-black/30 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md",
        isSelected ? "ring-2 ring-luxury-gold/70" : "hover:border-zinc-600",
      )}
      aria-pressed={isSelected}
    >
      {/* Info icon */}
      <motion.span
        className="absolute -top-1 -right-1 z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: hovered ? 1 : 0.6, scale: hovered ? 1 : 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onInfo(id)
          }}
          className="rounded-full bg-slate-800/90 border border-zinc-700/60 p-1 text-zinc-300 hover:text-white hover:bg-slate-800"
          aria-label={`Open ${label} details`}
          title="Details"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </motion.span>

      {/* Icon */}
      <Icon className={cn("w-6 h-6 md:w-7 md:h-7", isSelected ? "text-luxury-gold" : "text-slate-300")} />

      {/* Label */}
      <span className="sr-only">{label}</span>

      {/* Live dot */}
      <span
        className={cn("absolute bottom-1.5 left-1.5 w-2 h-2 rounded-full", isActive ? "bg-emerald-400" : "bg-zinc-600")}
        aria-hidden="true"
      />

      {/* Strength chip - shows global selection strength to match forecast modal logic */}
      <div className="absolute bottom-1.5 right-1.5">
        <Badge
          variant="secondary"
          className={cn(
            "px-1.5 py-0 h-4 text-[10px] leading-none bg-zinc-800/70 border-zinc-700/70",
            isSelected ? "text-luxury-gold" : "text-zinc-300",
          )}
        >
          {isSelected ? `${globalStrength}%` : "0%"}
        </Badge>
      </div>

      {/* Hover panel with detailed hover info (reuse from forecast) */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: -6, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-full min-w-[220px] max-w-[280px] z-20"
          >
            <motion.div
              onClick={() => toggleConfluence(id)}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(90, 82, 66, 0.2)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-zinc-800/50 p-4 rounded-lg flex flex-col justify-between cursor-pointer border border-transparent hover:border-luxury-gold/50"
            >
              <div className="flex items-center justify-between text-zinc-400">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <h5 className="text-sm font-semibold">{label}</h5>
                </div>
                <div className={cn("w-2 h-2 rounded-full", isActive ? "bg-green-500 animate-pulse" : "bg-zinc-600")} />
              </div>
              <div className="text-right mt-4">
                <p className="text-xl font-bold text-white">{globalStrength}%</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
