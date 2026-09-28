"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useScenarioStore } from "@/lib/scenario-store"
import { TrendingUp, TrendingDown, X, ChevronUp, ChevronDown } from "lucide-react"

// Mock execution state for scenarios
function getMockExecState(id: string) {
  const hash = id.charCodeAt(0) + id.charCodeAt(id.length - 1)
  const states = ["live", "pending", "pending", "live", "live"] as const
  return states[hash % states.length]
}

function getMockPnl(id: string, isBuy: boolean) {
  const hash = id.charCodeAt(2) + id.charCodeAt(0)
  const values = [42.8, -18.3, 127.5, -6.2, 88.1, -32.7, 215.4, 11.9]
  return values[hash % values.length]
}

function getMockPips(id: string) {
  const hash = id.charCodeAt(1) + id.charCodeAt(0)
  const values = [12.4, -5.1, 34.7, -2.8, 22.3, -8.9, 56.1, 3.2]
  return values[hash % values.length]
}

export function FloatingPositions() {
  const { scenarios } = useScenarioStore()
  const [collapsed, setCollapsed] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  if (scenarios.length === 0) return null

  const livePositions = scenarios.filter(s => getMockExecState(s.id) === "live")
  const pendingPositions = scenarios.filter(s => getMockExecState(s.id) === "pending")

  const totalPnl = scenarios.reduce((sum, s) => {
    const pnl = getMockPnl(s.id, s.position === "Buy Position")
    return sum + (getMockExecState(s.id) === "live" ? pnl : 0)
  }, 0)

  return (
    <div className="fixed bottom-20 left-4 z-40 max-w-[calc(65vw-32px)]">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Header strip */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-t-xl bg-[#0b0d14]/90 backdrop-blur-xl border border-white/[0.06] border-b-0 cursor-pointer hover:bg-[#0b0d14] transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            />
            <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-white/40 font-bold">Positions</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-white/25">{livePositions.length} live</span>
            <span className="text-[9px] font-mono text-white/15">|</span>
            <span className="text-[9px] font-mono text-white/25">{pendingPositions.length} pending</span>
          </div>

          <div className={`text-[10px] font-mono font-bold ${totalPnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {totalPnl >= 0 ? "+" : ""}{totalPnl.toFixed(1)} USD
          </div>

          {collapsed ? (
            <ChevronUp className="w-3 h-3 text-white/20" />
          ) : (
            <ChevronDown className="w-3 h-3 text-white/20" />
          )}
        </button>

        {/* Position pills */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="overflow-hidden rounded-b-xl rounded-tr-xl bg-[#0b0d14]/90 backdrop-blur-xl border border-white/[0.06] border-t-0"
            >
              <div className="flex flex-wrap gap-1.5 p-2.5">
                {scenarios.map((s, i) => {
                  const isBuy = s.position === "Buy Position"
                  const execState = getMockExecState(s.id)
                  const pnl = getMockPnl(s.id, isBuy)
                  const pips = getMockPips(s.id)
                  const isHovered = hoveredId === s.id
                  const isLive = execState === "live"

                  return (
                    <motion.div
                      key={s.id}
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.05, type: "spring", stiffness: 400, damping: 25 }}
                      className="relative"
                      onMouseEnter={() => setHoveredId(s.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      {/* Mini pill */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`relative flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-200 border ${
                          isLive
                            ? isBuy
                              ? "bg-emerald-500/[0.06] border-emerald-500/15 hover:border-emerald-500/30"
                              : "bg-red-500/[0.06] border-red-500/15 hover:border-red-500/30"
                            : "bg-white/[0.02] border-white/[0.06] border-dashed hover:border-white/[0.12]"
                        }`}
                      >
                        {/* Direction icon */}
                        <div className={`flex items-center justify-center w-5 h-5 rounded-md ${
                          isBuy ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                        }`}>
                          {isBuy ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        </div>

                        {/* Pair */}
                        <span className="text-[10px] font-mono font-bold text-white/70">{s.pair}</span>

                        {/* Status dot */}
                        {isLive ? (
                          <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                          />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400/50" />
                        )}

                        {/* P&L for live */}
                        {isLive && (
                          <span className={`text-[10px] font-mono font-bold ${pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {pnl >= 0 ? "+" : ""}{pnl.toFixed(1)}
                          </span>
                        )}

                        {/* Pending label */}
                        {!isLive && (
                          <span className="text-[8px] font-mono text-amber-400/50 uppercase">Pending</span>
                        )}
                      </motion.div>

                      {/* Hover expand card */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="absolute bottom-full left-0 mb-2 w-[220px] z-50"
                          >
                            <div className={`rounded-xl p-3 border backdrop-blur-xl shadow-2xl shadow-black/40 ${
                              isBuy
                                ? "bg-[#0a0e14]/95 border-emerald-500/15"
                                : "bg-[#0a0e14]/95 border-red-500/15"
                            }`}>
                              {/* Ambient glow */}
                              <div className={`absolute inset-0 rounded-xl opacity-20 pointer-events-none ${
                                isBuy
                                  ? "bg-gradient-to-br from-emerald-500/10 to-transparent"
                                  : "bg-gradient-to-br from-red-500/10 to-transparent"
                              }`} />

                              {/* Header */}
                              <div className="flex items-center justify-between mb-2.5 relative z-10">
                                <div className="flex items-center gap-2">
                                  <div className={`flex items-center justify-center w-6 h-6 rounded-lg ${
                                    isBuy ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                                  }`}>
                                    {isBuy ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                  </div>
                                  <div>
                                    <div className="text-[12px] font-mono font-bold text-white">{s.pair}</div>
                                    <div className={`text-[8px] font-mono uppercase ${isBuy ? "text-emerald-400/60" : "text-red-400/60"}`}>
                                      {isBuy ? "LONG" : "SHORT"}
                                    </div>
                                  </div>
                                </div>
                                <div className={`px-1.5 py-0.5 rounded-md text-[8px] font-mono font-bold uppercase ${
                                  isLive
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                }`}>
                                  {isLive ? "LIVE" : "PENDING"}
                                </div>
                              </div>

                              {/* Data grid */}
                              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 relative z-10">
                                <div>
                                  <div className="text-[8px] font-mono text-white/25 uppercase">Entry</div>
                                  <div className="text-[11px] font-mono text-white/70">{s.level || "1.08420"}</div>
                                </div>
                                <div>
                                  <div className="text-[8px] font-mono text-white/25 uppercase">R:R</div>
                                  <div className="text-[11px] font-mono text-purple-300">{s.rr || "1:3"}</div>
                                </div>
                                <div>
                                  <div className="text-[8px] font-mono text-white/25 uppercase">SL</div>
                                  <div className="text-[11px] font-mono text-red-400/70">{s.sl || "1.08200"}</div>
                                </div>
                                <div>
                                  <div className="text-[8px] font-mono text-white/25 uppercase">TP</div>
                                  <div className="text-[11px] font-mono text-emerald-400/70">{s.tp || "1.09000"}</div>
                                </div>
                              </div>

                              {/* P&L strip for live */}
                              {isLive && (
                                <div className={`mt-2.5 pt-2 border-t relative z-10 ${
                                  isBuy ? "border-emerald-500/10" : "border-red-500/10"
                                }`}>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="text-[8px] font-mono text-white/25 uppercase">Floating P&L</div>
                                      <div className={`text-[14px] font-mono font-bold ${pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                        {pnl >= 0 ? "+" : ""}{pnl.toFixed(2)} USD
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-[8px] font-mono text-white/25 uppercase">Pips</div>
                                      <div className={`text-[12px] font-mono font-bold ${pips >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                        {pips >= 0 ? "+" : ""}{pips.toFixed(1)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Confluences */}
                              {s.confluences.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-white/[0.04] relative z-10">
                                  <div className="flex flex-wrap gap-1">
                                    {s.confluences.slice(0, 3).map((c, ci) => (
                                      <span key={ci} className="text-[7px] font-mono px-1.5 py-0.5 rounded-md bg-purple-500/8 text-purple-300/50 border border-purple-500/10">
                                        {c.text}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
