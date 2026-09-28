"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { SessionPhase } from "@/lib/mentor/types"
import { formatSessionTime } from "@/lib/mentor/engine"

const PHASE_CFG: Record<SessionPhase, { color: string; bg: string; label: string; glow: string }> = {
  KILLZONE:    { color: "#10b981", bg: "rgba(16,185,129,0.04)", label: "KILLZONE ACTIVE", glow: "rgba(16,185,129,0.06)" },
  PRE_SESSION: { color: "#f59e0b", bg: "rgba(245,158,11,0.03)", label: "PRE-SESSION",     glow: "rgba(245,158,11,0.04)" },
  EXTENDED:    { color: "#3b82f6", bg: "rgba(59,130,246,0.03)", label: "EXTENDED SESSION", glow: "rgba(59,130,246,0.04)" },
  CLOSED:      { color: "#6b7280", bg: "rgba(107,114,128,0.02)", label: "SESSION CLOSED",  glow: "transparent" },
}

interface Props {
  phase: SessionPhase
  sessionLabel: string
  timeUntilNext: string
  killzoneStart: number
  killzoneEnd: number
  timezone: string
}

export function SessionGate({ phase, sessionLabel, timeUntilNext, killzoneStart, killzoneEnd, timezone }: Props) {
  const [expanded, setExpanded] = useState(false)
  const cfg = PHASE_CFG[phase]
  const isActive = phase === "KILLZONE"

  const kzDuration = killzoneEnd - killzoneStart
  const kzProgress = isActive ? 35 : phase === "PRE_SESSION" ? 15 : 0

  return (
    <div className="mx-3 my-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left rounded-xl overflow-hidden transition-all duration-300 cursor-pointer"
        style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.color}15`, boxShadow: isActive ? `0 0 20px ${cfg.glow}` : "none" }}
      >
        <div className="px-3 py-3 relative overflow-hidden">
          {isActive && (
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 20% 50%, ${cfg.glow}, transparent 70%)` }} />
          )}
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                  {(isActive || phase === "PRE_SESSION") && (
                    <div className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: cfg.color, opacity: 0.3 }} />
                  )}
                </div>
                <span className="text-[8px] font-mono font-black tracking-[0.12em] uppercase" style={{ color: `${cfg.color}90` }}>{cfg.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-mono tabular-nums" style={{ color: `${cfg.color}50` }}>{timeUntilNext}</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="transition-transform duration-200" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <path d="M2.5 4L5 6.5L7.5 4" stroke={`${cfg.color}40`} strokeWidth="1" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <p className="text-[9px] font-mono text-white/30 mt-1.5">{sessionLabel}</p>
            <div className="mt-2.5 h-[3px] rounded-full overflow-hidden" style={{ backgroundColor: `${cfg.color}08` }}>
              <motion.div className="h-full rounded-full" initial={false} animate={{ width: `${kzProgress}%` }} transition={{ duration: 1, ease: "easeOut" }} style={{ backgroundColor: cfg.color, boxShadow: `0 0 6px ${cfg.color}40` }} />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[7px] font-mono text-white/15">{formatSessionTime(killzoneStart, timezone)}</span>
              <span className="text-[7px] font-mono text-white/15">{formatSessionTime(killzoneEnd, timezone)}</span>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="px-3 pb-3 pt-1" style={{ borderTop: `1px solid ${cfg.color}08` }}>
                <div className="flex flex-col gap-2 mt-1">
                  {[
                    { label: "Pre-Session Analysis", time: "8:00 - 9:30 AM ET", ph: "PRE_SESSION" as const, desc: "Review HTF structure, set bias, identify key levels" },
                    { label: "NY Killzone", time: "9:30 - 11:30 AM ET", ph: "KILLZONE" as const, desc: "Primary execution window. Watch for displacement after open" },
                    { label: "Extended Session", time: "11:30 AM - 4:00 PM ET", ph: "EXTENDED" as const, desc: "Trade management only. No new entries." },
                  ].map(item => {
                    const isCurrent = phase === item.ph
                    const itemCfg = PHASE_CFG[item.ph]
                    return (
                      <div key={item.ph} className="rounded-lg px-2.5 py-2 transition-all duration-200" style={{ backgroundColor: isCurrent ? `${itemCfg.color}06` : "rgba(255,255,255,0.01)", border: `1px solid ${isCurrent ? `${itemCfg.color}15` : "rgba(255,255,255,0.03)"}` }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isCurrent ? itemCfg.color : "rgba(255,255,255,0.1)" }} />
                            <span className="text-[8px] font-mono font-bold" style={{ color: isCurrent ? `${itemCfg.color}80` : "rgba(255,255,255,0.25)" }}>{item.label}</span>
                          </div>
                          <span className="text-[7px] font-mono tabular-nums" style={{ color: isCurrent ? `${itemCfg.color}50` : "rgba(255,255,255,0.12)" }}>{item.time}</span>
                        </div>
                        <p className="text-[7.5px] font-mono text-white/18 mt-1 pl-[18px] leading-relaxed">{item.desc}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  )
}
