"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { MethodVaultEntry } from "@/lib/mentor/types"

const CATEGORY_CONFIG: Record<string, { color: string; label: string }> = {
  lesson:           { color: "#3b82f6", label: "LESSON" },
  trade_plan:       { color: "#10b981", label: "PLAN" },
  chart_example:    { color: "#f59e0b", label: "CHART" },
  war_room_archive: { color: "#a78bfa", label: "ARCHIVE" },
}

interface Props {
  entries: MethodVaultEntry[]
  accentColor: string
}

export function MethodVault({ entries, accentColor }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="mx-3 my-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between rounded-xl px-3 py-2 cursor-pointer"
        style={{ backgroundColor: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[7px] font-mono font-black tracking-[0.14em] uppercase text-white/25">
            METHOD VAULT
          </span>
          <span className="text-[8px] font-mono tabular-nums text-white/15">{entries.length} items</span>
        </div>
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          className="transition-transform duration-200"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="M3 4L5 6L7 4" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-1.5 flex flex-col gap-1">
              {entries.map(entry => {
                const cat = CATEGORY_CONFIG[entry.category] || CATEGORY_CONFIG.lesson
                return (
                  <button
                    key={entry.id}
                    className="w-full text-left rounded-lg px-2.5 py-2 transition-all group hover:bg-white/[0.02]"
                    style={{ border: "1px solid rgba(255,255,255,0.03)" }}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span
                            className="text-[6px] font-mono font-black tracking-wider uppercase px-1 py-0.5 rounded shrink-0"
                            style={{ color: cat.color, backgroundColor: `${cat.color}10` }}
                          >
                            {cat.label}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-white/50 group-hover:text-white/70 transition-colors line-clamp-2">
                          {entry.title}
                        </span>
                        <p className="text-[8px] font-mono text-white/20 mt-0.5 line-clamp-1">
                          {entry.description}
                        </p>
                      </div>
                      <span className="text-[8px] font-mono text-white/10 group-hover:text-white/25 transition-colors shrink-0 mt-2">
                        {"->"}
                      </span>
                    </div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {entry.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[6px] font-mono text-white/10 px-1 py-0.5 rounded" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
