"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { DayValidity, NewsEvent } from "@/lib/mentor/types"

const VALIDITY_CFG: Record<DayValidity, { color: string; label: string }> = {
  VALID:       { color: "#10b981", label: "VALID" },
  CONDITIONAL: { color: "#f59e0b", label: "CONDITIONAL" },
  INVALID:     { color: "#ef4444", label: "INVALID" },
}

const SEVERITY_COLOR: Record<string, string> = { HIGH: "#ef4444", MEDIUM: "#f59e0b", LOW: "#6b7280" }

interface Props {
  dayValidity: DayValidity
  dayNote: string
  activeNews: NewsEvent[]
}

export function DayFilterStrip({ dayValidity, dayNote, activeNews }: Props) {
  const [newsExpanded, setNewsExpanded] = useState(false)
  const dv = VALIDITY_CFG[dayValidity]
  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long", timeZone: "America/New_York" })

  return (
    <div className="mx-3 my-2 flex gap-2">
      {/* Day Filter */}
      <div className="flex-1 rounded-xl px-2.5 py-2 transition-colors duration-200 hover:bg-opacity-80 cursor-default" style={{ backgroundColor: `${dv.color}06`, border: `1px solid ${dv.color}12` }}>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dv.color }} />
          <span className="text-[7px] font-mono font-black tracking-[0.14em] uppercase" style={{ color: `${dv.color}80` }}>DAY FILTER</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-white/60">{dayName}</span>
          <span className="text-[7px] font-mono font-black tracking-wider px-1.5 py-0.5 rounded" style={{ color: dv.color, backgroundColor: `${dv.color}10` }}>{dv.label}</span>
        </div>
        {dayNote && <p className="text-[8px] font-mono text-white/25 mt-1 leading-relaxed">{dayNote}</p>}
      </div>

      {/* News Awareness */}
      <button
        onClick={() => activeNews.length > 0 && setNewsExpanded(!newsExpanded)}
        className="flex-1 rounded-xl px-2.5 py-2 text-left transition-colors duration-200 cursor-pointer"
        style={{ backgroundColor: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400/50" />
          <span className="text-[7px] font-mono font-black tracking-[0.14em] uppercase text-white/25">NEWS</span>
          {activeNews.length > 0 && (
            <span className="text-[7px] font-mono font-bold tabular-nums text-amber-400/60 ml-auto">{activeNews.length}</span>
          )}
        </div>
        {activeNews.length === 0 ? (
          <p className="text-[9px] font-mono text-white/20 mt-1.5">No events in next 4h</p>
        ) : (
          <div className="mt-1.5 flex flex-col gap-1">
            {activeNews.slice(0, newsExpanded ? undefined : 2).map(e => (
              <div key={e.id}>
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: SEVERITY_COLOR[e.severity] }} />
                  <span className="text-[8px] font-mono text-white/40 truncate flex-1">{e.title}</span>
                  <span className="text-[6px] font-mono font-black tracking-wider uppercase shrink-0 px-1 py-0.5 rounded" style={{ color: e.impact === "BLOCKING" ? "#ef4444" : "#f59e0b", backgroundColor: e.impact === "BLOCKING" ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.06)" }}>{e.impact}</span>
                </div>
                <AnimatePresence>
                  {newsExpanded && e.note && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="text-[7px] font-mono text-white/18 pl-3 mt-0.5 leading-relaxed overflow-hidden">{e.note}</motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </button>
    </div>
  )
}
