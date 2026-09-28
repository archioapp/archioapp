"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { MarketBias } from "@/lib/mentor/types"

const DIR_CFG = {
  BULLISH: { color: "#10b981", bg: "rgba(16,185,129,0.04)" },
  BEARISH: { color: "#ef4444", bg: "rgba(239,68,68,0.04)" },
  NEUTRAL: { color: "#f59e0b", bg: "rgba(245,158,11,0.04)" },
}

interface Props {
  bias: MarketBias
}

export function BiasContext({ bias }: Props) {
  const [expanded, setExpanded] = useState(false)
  const cfg = DIR_CFG[bias.direction]

  return (
    <div className="mx-3 my-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left rounded-xl overflow-hidden transition-all duration-300 cursor-pointer group"
        style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.color}10` }}
      >
        <div className="px-3 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[7px] font-mono font-black tracking-[0.14em] uppercase text-white/25">BIAS / CONTEXT</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold text-white/30">{bias.instrument}</span>
              <span className="text-[8px] font-mono text-white/15">|</span>
              <span className="text-[9px] font-mono text-white/25">{bias.timeframe}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="transition-transform duration-200" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
                <path d="M2.5 4L5 6.5L7.5 4" stroke={`${cfg.color}40`} strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-2.5 mt-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ backgroundColor: `${cfg.color}12`, border: `1px solid ${cfg.color}18` }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                {bias.direction === "BULLISH" && <path d="M5 2L8 6H2L5 2Z" fill={cfg.color} />}
                {bias.direction === "BEARISH" && <path d="M5 8L2 4H8L5 8Z" fill={cfg.color} />}
                {bias.direction === "NEUTRAL" && <rect x="1" y="4" width="8" height="2" rx="1" fill={cfg.color} />}
              </svg>
              <span className="text-[9px] font-mono font-black tracking-wider" style={{ color: cfg.color }}>{bias.direction}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-12 h-1 rounded-full overflow-hidden" style={{ backgroundColor: `${cfg.color}10` }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${bias.confidence}%`, backgroundColor: cfg.color }} />
              </div>
              <span className="text-[8px] font-mono tabular-nums text-white/30">{bias.confidence}%</span>
            </div>
          </div>

          <p className="text-[9px] font-mono text-white/35 leading-relaxed mt-2">{bias.reasoning}</p>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="px-3 pb-3 pt-1 flex flex-col gap-2" style={{ borderTop: `1px solid ${cfg.color}08` }}>
                {/* Key levels */}
                <div className="rounded-lg px-2.5 py-2" style={{ backgroundColor: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)" }}>
                  <span className="text-[7px] font-mono font-black tracking-wider uppercase text-white/18">KEY LEVELS</span>
                  <div className="mt-1.5 flex flex-col gap-1.5">
                    {[
                      { label: "D1 Breaker Block", price: "1.0920", type: "resistance" },
                      { label: "H4 Order Block", price: "1.0865", type: "support" },
                      { label: "Liquidity Pool", price: "1.0840", type: "target" },
                    ].map(level => (
                      <div key={level.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: level.type === "resistance" ? "#ef4444" : level.type === "support" ? "#10b981" : "#f59e0b" }} />
                          <span className="text-[8px] font-mono text-white/30">{level.label}</span>
                        </div>
                        <span className="text-[8px] font-mono font-bold tabular-nums text-white/40">{level.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* HTF structure note */}
                <div className="rounded-lg px-2.5 py-2" style={{ backgroundColor: `${cfg.color}03`, border: `1px solid ${cfg.color}08` }}>
                  <span className="text-[7px] font-mono font-black tracking-wider uppercase" style={{ color: `${cfg.color}35` }}>HTF STRUCTURE</span>
                  <p className="text-[8px] font-mono text-white/25 leading-relaxed mt-1">
                    D1 bearish engulfing confirmed. H4 broke structure south with clean displacement. 
                    Expecting retracement to H4 OB at 1.0920 before continuation to 1.0840 liquidity.
                  </p>
                </div>

                {/* Mentor note */}
                <div className="rounded-lg px-2.5 py-2" style={{ backgroundColor: "rgba(167,139,250,0.03)", border: "1px solid rgba(167,139,250,0.08)" }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1 h-1 rounded-full bg-violet-400" />
                    <span className="text-[7px] font-mono font-black tracking-wider uppercase text-violet-400/35">JADECAP NOTE</span>
                  </div>
                  <p className="text-[8px] font-mono text-violet-300/25 leading-relaxed">
                    {"\"Don't fight the D1 structure. If you're confused about direction, you haven't zoomed out enough. The H4 OB is our magnet -- wait for price to show you displacement before committing.\""}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  )
}
