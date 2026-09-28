"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { RiskGuidance } from "@/lib/mentor/types"

interface Props {
  guidance: RiskGuidance
}

export function RiskGuidanceBar({ guidance }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="mx-3 my-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left rounded-xl overflow-hidden transition-all duration-200 cursor-pointer"
        style={{ backgroundColor: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="px-3 py-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[7px] font-mono font-black tracking-[0.14em] uppercase text-white/25">RISK GUIDANCE</span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="transition-transform duration-200" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
              <path d="M2.5 4L5 6.5L7.5 4" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>

          <div className="mt-2 grid grid-cols-4 gap-2">
            {[
              { label: "PER TRADE", value: `${guidance.maxRiskPerTrade}%`, color: "#3b82f6" },
              { label: "DAILY MAX", value: `${guidance.maxDailyLoss}%`, color: "#ef4444" },
              { label: "MAX TRADES", value: `${guidance.maxTradesPerDay}`, color: "#f59e0b" },
              { label: "MIN R:R", value: `1:${guidance.minRiskReward}`, color: "#10b981" },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center gap-1 py-1.5 rounded transition-colors duration-200" style={{ backgroundColor: `${item.color}04` }}>
                <span className="text-[11px] font-mono font-black tabular-nums" style={{ color: `${item.color}80` }}>{item.value}</span>
                <span className="text-[6px] font-mono font-bold tracking-wider uppercase text-white/15">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Rules */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {guidance.noAveraging && (
              <span className="text-[6px] font-mono font-black tracking-wider uppercase px-1.5 py-0.5 rounded bg-red-500/[0.06] text-red-400/40 border border-red-500/[0.08]">NO AVERAGING</span>
            )}
            {guidance.noMartingale && (
              <span className="text-[6px] font-mono font-black tracking-wider uppercase px-1.5 py-0.5 rounded bg-red-500/[0.06] text-red-400/40 border border-red-500/[0.08]">NO MARTINGALE</span>
            )}
            <span className="text-[6px] font-mono font-black tracking-wider uppercase px-1.5 py-0.5 rounded bg-cyan-500/[0.06] text-cyan-400/40 border border-cyan-500/[0.08]">MAX {guidance.maxConcurrentTrades} CONCURRENT</span>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="px-3 pb-3 pt-1 flex flex-col gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                {/* Position sizing explanation */}
                <div className="rounded-lg px-2.5 py-2" style={{ backgroundColor: "rgba(59,130,246,0.03)", border: "1px solid rgba(59,130,246,0.08)" }}>
                  <span className="text-[7px] font-mono font-black tracking-wider uppercase text-blue-400/35">POSITION SIZING</span>
                  <div className="mt-1.5 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-mono text-white/25">Account size</span>
                      <span className="text-[8px] font-mono font-bold text-white/40">$50,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-mono text-white/25">Max risk per trade</span>
                      <span className="text-[8px] font-mono font-bold text-blue-400/50">${(50000 * guidance.maxRiskPerTrade / 100).toFixed(0)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-mono text-white/25">Daily max drawdown</span>
                      <span className="text-[8px] font-mono font-bold text-red-400/50">${(50000 * guidance.maxDailyLoss / 100).toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                {/* Mentor risk philosophy */}
                <div className="rounded-lg px-2.5 py-2" style={{ backgroundColor: "rgba(167,139,250,0.03)", border: "1px solid rgba(167,139,250,0.08)" }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1 h-1 rounded-full bg-violet-400" />
                    <span className="text-[7px] font-mono font-black tracking-wider uppercase text-violet-400/35">JADECAP PHILOSOPHY</span>
                  </div>
                  <p className="text-[8px] font-mono text-violet-300/25 leading-relaxed">
                    {"\"Risk management is not optional. If you lose 1% you need 1.01% to recover. Lose 50% and you need 100%. The math is not on your side. Stay small, stay consistent, compound over time.\""}
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
