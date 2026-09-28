"use client"

import { useState } from "react"
import { SignalTerminalHeader } from "./signal-terminal-header"
import { CopilotChartPanel } from "./copilot-chart-panel"
import { ConfluenceBottomBar } from "./bottom-bar/confluence-bottom-bar"
import { CopilotRightRail } from "@/components/copilot/CopilotRightRail"
import { TradeExecutionPanel } from "@/components/copilot/trade/TradeExecutionPanel"
import { TradeJournalDashboard } from "@/components/copilot/journal/TradeJournalDashboard"
import { SocialFeed } from "@/components/copilot/social/SocialFeed"
import { getInstrumentById, type Instrument } from "@/lib/instruments"
import { motion } from "framer-motion"
import { BarChart3, Crosshair, Activity } from "lucide-react"

type RailMode = "copilot" | "trade"

export function ExecutionCopilotLayout() {
  const [activeInstrument, setActiveInstrument] = useState<Instrument>(getInstrumentById("EURUSD")!)
  const [railMode, setRailMode] = useState<RailMode>("copilot")

  return (
    <div className="flex flex-col h-screen bg-[#0D0F17] text-white">
      {/* ── Top Header ── */}
      <header>
        <SignalTerminalHeader activeInstrument={activeInstrument} setActiveInstrument={setActiveInstrument} />
      </header>

      {/* ── Main Content ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── Left: Chart + Scrollable Below-fold ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chart Area (fixed height) */}
          <div className="flex-1 min-h-0">
            <CopilotChartPanel instrument={activeInstrument} />
          </div>

          {/* Below-fold: scrollable journal + social */}
          <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 400px)" }}>
            <TradeJournalDashboard />
            <SocialFeed />
          </div>
        </div>

        {/* ── Right Rail ── */}
        <aside className="w-[380px] flex-shrink-0 border-l border-white/[0.06] flex flex-col bg-[#0a0a0e]">
          {/* Rail Mode Toggle */}
          <div className="flex border-b border-white/[0.04]">
            {([
              { key: "copilot" as const, label: "Copilot", icon: Activity, color: "emerald" },
              { key: "trade" as const, label: "Execute", icon: Crosshair, color: "cyan" },
            ]).map(tab => {
              const active = railMode === tab.key
              const Icon = tab.icon
              const activeColor = tab.color === "emerald" ? "text-emerald-400 bg-emerald-400/[0.06]" : "text-cyan-400 bg-cyan-400/[0.06]"
              const borderColor = tab.color === "emerald" ? "bg-emerald-400" : "bg-cyan-400"
              return (
                <button
                  key={tab.key}
                  onClick={() => setRailMode(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-[10px] font-bold uppercase tracking-[0.1em] transition-all relative ${
                    active ? activeColor : "text-white/25 hover:text-white/40 hover:bg-white/[0.02]"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {tab.label}
                  {active && (
                    <motion.div
                      layoutId="rail-mode-indicator"
                      className={`absolute bottom-0 left-2 right-2 h-[1.5px] ${borderColor}`}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Rail Content */}
          <div className="flex-1 min-h-0 relative">
            {railMode === "copilot" ? (
              <CopilotRightRail />
            ) : (
              <div className="absolute inset-0 overflow-y-auto">
                <TradeExecutionPanel instrument={activeInstrument.name} currentPrice={activeInstrument.id === "EURUSD" ? 1.08423 : activeInstrument.id === "BTCUSD" ? 67234 : activeInstrument.id === "XAUUSD" ? 2341.50 : 1.0000} />
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ── Bottom Bar (confluence floating) ── */}
      <ConfluenceBottomBar />
    </div>
  )
}
