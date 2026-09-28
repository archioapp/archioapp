"use client"

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users, ChevronDown, ChevronRight, X, Target, Brain,
  TrendingUp, BarChart3, Crosshair,
  Plus, Minus, Flame,
  Award, CircleDot, Send, RotateCcw,
  Wrench, ArrowUpRight, ArrowDownRight, Check
} from "lucide-react"
import { ALL_PERSONAS, FRESH_SETUP, type TraderPersona } from "./trader-personas"
import type { CopilotAnalyticsSnapshot } from "../analytics/CopilotAnalytics"

/* ══════════════════════════════════════════════════════════════════════════
   PERSONA SIMULATOR -- The Trading Lab
   Load any of 13 real trader profiles + fresh setup to see how the system
   reacts to different types of traders. Build a custom persona from scratch.
   ══════════════════════════════════════════════════════════════════════════ */

interface PersonaSimulatorProps {
  onSelectPersona: (snapshot: CopilotAnalyticsSnapshot, persona: TraderPersona | null, customLabel?: string) => void
  currentPersonaId?: string
}

/* ── Sub-components ── */

function TierBadge({ tier, tierLabel, tierColor }: { tier: string; tierLabel: string; tierColor: string }) {
  return (
    <span
      className="text-[8px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded-sm border"
      style={{ color: tierColor, borderColor: `${tierColor}30`, backgroundColor: `${tierColor}08` }}
    >
      {tierLabel}
    </span>
  )
}

function StatPill({ label, value, color, suffix }: { label: string; value: string | number; color: string; suffix?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-md bg-white/[0.02] border border-white/[0.04]">
      <span className="text-[8px] font-mono text-white/25 uppercase tracking-wider">{label}</span>
      <span className="text-[11px] font-mono font-bold" style={{ color }}>{value}{suffix}</span>
    </div>
  )
}

/* ── Compact slider with label ── */
function MiniSlider({ label, value, min, max, step, suffix, color, onChange }: {
  label: string; value: number; min: number; max: number; step: number; suffix?: string; color: string
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-mono text-white/25 uppercase tracking-wider">{label}</span>
        <span className="text-[10px] font-mono font-bold" style={{ color }}>{value}{suffix}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-thumb w-full h-1 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.06) ${((value - min) / (max - min)) * 100}%)`,
        }}
      />
    </div>
  )
}

/* ── Individual trade entry for the trade log ── */
interface CustomTrade {
  id: string
  instrument: string
  direction: "long" | "short"
  result: "win" | "loss" | "breakeven"
  rMultiple: number
  date: string
  entryType: "market" | "limit" | "stop"
}

const INSTRUMENTS = ["EURUSD", "GBPUSD", "USDJPY", "XAUUSD", "NAS100", "BTCUSD", "GBPJPY", "AUDUSD", "US30", "SPX500"]
const TIMEFRAMES = ["M1", "M5", "M15", "H1", "H4", "D1", "W1"]
const EMOTIONS = ["FOMO", "Fear", "Frustration", "Overconfidence", "Calm", "Focused", "Anxious", "Rushed"]
const PITFALLS = ["Overtrading", "Chasing", "No stop-loss", "Cut winners early", "Revenge trading", "Didn't follow plan"]

/* ════════════════════════════════════════════════════════════════════════
   CUSTOM BUILD PANEL -- Full trade builder inside the dropdown
   ════════════════════════════════════════════════════════════════════════ */

function CustomBuildPanel({ onApply }: {
  onApply: (snapshot: CopilotAnalyticsSnapshot, label: string) => void
}) {
  const [trades, setTrades] = useState<CustomTrade[]>([])
  const [winRate, setWinRate] = useState(50)
  const [avgR, setAvgR] = useState(1.0)
  const [totalTrades, setTotalTrades] = useState(0)
  const [accountGrowth, setAccountGrowth] = useState(0)
  const [activeSection, setActiveSection] = useState<"trades" | "psychology" | "strategy" | null>("trades")

  // Psychology state
  const [moodPositive, setMoodPositive] = useState(0)
  const [moodNegative, setMoodNegative] = useState(0)
  const [activeEmotions, setActiveEmotions] = useState<Record<string, number>>({})
  const [activePitfalls, setActivePitfalls] = useState<Record<string, number>>({})
  const [decisionMins, setDecisionMins] = useState(5)
  const [activeDays, setActiveDays] = useState(3)

  // Strategy state
  const [selectedInstruments, setSelectedInstruments] = useState<Record<string, number>>({})
  const [selectedTimeframes, setSelectedTimeframes] = useState<Record<string, number>>({})
  const [entryMix, setEntryMix] = useState({ market: 0, limit: 0, stop: 0 })

  // Trade form
  const [showTradeForm, setShowTradeForm] = useState(false)
  const [tradeInstrument, setTradeInstrument] = useState("EURUSD")
  const [tradeDirection, setTradeDirection] = useState<"long" | "short">("long")
  const [tradeResult, setTradeResult] = useState<"win" | "loss" | "breakeven">("win")
  const [tradeR, setTradeR] = useState(1.0)
  const [tradeEntry, setTradeEntry] = useState<"market" | "limit" | "stop">("market")
  const [tradeDate, setTradeDate] = useState(new Date().toISOString().split("T")[0])

  const addTrade = useCallback(() => {
    const newTrade: CustomTrade = {
      id: `t-${Date.now()}`,
      instrument: tradeInstrument,
      direction: tradeDirection,
      result: tradeResult,
      rMultiple: tradeResult === "win" ? tradeR : tradeResult === "loss" ? -tradeR : 0,
      date: tradeDate,
      entryType: tradeEntry,
    }
    const updated = [...trades, newTrade]
    setTrades(updated)

    // Auto-update derived stats
    const wins = updated.filter(t => t.result === "win").length
    const total = updated.length
    setTotalTrades(total)
    setWinRate(total > 0 ? Math.round((wins / total) * 100) : 0)
    const totalR = updated.reduce((s, t) => s + t.rMultiple, 0)
    setAvgR(total > 0 ? Number((totalR / total).toFixed(2)) : 0)
    setAccountGrowth(Number((totalR * 1.5).toFixed(1)))

    // Auto-update instrument + entry counts
    setSelectedInstruments(prev => ({ ...prev, [tradeInstrument]: (prev[tradeInstrument] || 0) + 1 }))
    setEntryMix(prev => ({ ...prev, [tradeEntry]: prev[tradeEntry] + 1 }))

    setShowTradeForm(false)
  }, [trades, tradeInstrument, tradeDirection, tradeResult, tradeR, tradeEntry, tradeDate])

  const removeTrade = useCallback((id: string) => {
    const updated = trades.filter(t => t.id !== id)
    setTrades(updated)
    const wins = updated.filter(t => t.result === "win").length
    const total = updated.length
    setTotalTrades(total)
    setWinRate(total > 0 ? Math.round((wins / total) * 100) : 0)
    const totalR = updated.reduce((s, t) => s + t.rMultiple, 0)
    setAvgR(total > 0 ? Number((totalR / total).toFixed(2)) : 0)
    setAccountGrowth(Number((totalR * 1.5).toFixed(1)))
  }, [trades])

  const toggleEmotion = useCallback((em: string) => {
    setActiveEmotions(prev => {
      const next = { ...prev }
      if (next[em]) { next[em] += 1 } else { next[em] = 1 }
      return next
    })
  }, [])

  const togglePitfall = useCallback((p: string) => {
    setActivePitfalls(prev => {
      const next = { ...prev }
      if (next[p]) { next[p] += 1 } else { next[p] = 1 }
      return next
    })
  }, [])

  const toggleTimeframe = useCallback((tf: string) => {
    setSelectedTimeframes(prev => {
      const next = { ...prev }
      if (next[tf]) { delete next[tf] } else { next[tf] = 1 }
      return next
    })
  }, [])

  const buildSnapshot = useCallback((): CopilotAnalyticsSnapshot => {
    // Build activity by hour from trades
    const activityByHour = Array(24).fill(0)
    trades.forEach((_, i) => { activityByHour[9 + (i % 8)] += 1 })

    return {
      activity: {
        counts: { alertsToday: Math.max(totalTrades, 1), actionsCompleted: totalTrades, avgResponseTime: decisionMins },
        recentAlerts: trades.slice(-5).map(t => ({
          id: t.id,
          title: `${t.direction.toUpperCase()} ${t.instrument}`,
          message: `${t.result} | ${t.rMultiple > 0 ? "+" : ""}${t.rMultiple}R via ${t.entryType}`,
          timestamp: new Date(t.date).getTime(),
          category: "trading" as const,
          priority: t.result === "loss" ? "high" as const : "medium" as const,
        })),
        activityByHour,
        topCategories: [
          { label: "trades", value: totalTrades },
          { label: "analysis", value: Math.round(totalTrades * 0.6) },
          { label: "journal", value: moodPositive + moodNegative },
        ].filter(c => c.value > 0),
      },
      strategy: {
        counts: {
          scenariosOpen: Math.ceil(totalTrades * 0.3),
          forecastsOpen: Math.ceil(totalTrades * 0.2),
          instrumentsActive: Object.keys(selectedInstruments).length,
        },
        entryMix: [
          { label: "market" as const, value: entryMix.market },
          { label: "limit" as const, value: entryMix.limit },
          { label: "stop" as const, value: entryMix.stop },
        ],
        timeframes: Object.entries(selectedTimeframes).map(([label, value]) => ({ label, value })),
        topModels: totalTrades > 0
          ? [{ label: "Custom Setup", value: totalTrades }]
          : [],
        instruments: Object.entries(selectedInstruments).map(([symbol, count]) => ({ symbol, count })),
        openForecasts: [],
      },
      psychology: {
        counts: {
          moodChecks7d: moodPositive + moodNegative,
          activeDays7d: activeDays,
          medianDecisionMins: decisionMins,
        },
        moodMix7d: [
          { label: "Positive" as const, value: moodPositive },
          { label: "Negative" as const, value: moodNegative },
        ],
        topEmotions: Object.entries(activeEmotions).map(([label, value]) => ({ label, value })),
        topPitfalls: Object.entries(activePitfalls).map(([label, value]) => ({ label, value })),
        pace24h: activityByHour,
      },
    }
  }, [trades, totalTrades, winRate, avgR, moodPositive, moodNegative, activeEmotions, activePitfalls, decisionMins, activeDays, selectedInstruments, selectedTimeframes, entryMix])

  const handleApply = useCallback(() => {
    const snap = buildSnapshot()
    const label = totalTrades > 0 ? `Custom (${totalTrades} trades)` : "Custom (empty)"
    onApply(snap, label)
  }, [buildSnapshot, totalTrades, onApply])

  // Quick presets
  const loadPreset = useCallback((preset: "empty" | "10" | "50" | "100") => {
    if (preset === "empty") {
      setTrades([]); setTotalTrades(0); setWinRate(0); setAvgR(0); setAccountGrowth(0)
      setMoodPositive(0); setMoodNegative(0); setActiveEmotions({}); setActivePitfalls({})
      setSelectedInstruments({}); setSelectedTimeframes({}); setEntryMix({ market: 0, limit: 0, stop: 0 })
      return
    }
    const count = Number(preset)
    setTotalTrades(count)
    setWinRate(preset === "100" ? 58 : preset === "50" ? 52 : 48)
    setAvgR(preset === "100" ? 1.3 : preset === "50" ? 1.0 : 0.8)
    setAccountGrowth(preset === "100" ? 12.5 : preset === "50" ? 4.2 : -1.5)
    setMoodPositive(Math.round(count * 0.4)); setMoodNegative(Math.round(count * 0.2))
    setActiveDays(preset === "100" ? 7 : preset === "50" ? 5 : 3)
    setSelectedInstruments({ EURUSD: Math.round(count * 0.3), GBPUSD: Math.round(count * 0.2), XAUUSD: Math.round(count * 0.15) })
    setSelectedTimeframes({ H1: 1, H4: 1, D1: 1 })
    setEntryMix({ market: Math.round(count * 0.5), limit: Math.round(count * 0.3), stop: Math.round(count * 0.2) })
    setActiveEmotions({ Focused: Math.round(count * 0.3), Calm: Math.round(count * 0.2) })
    setActivePitfalls(preset === "10" ? { Overtrading: 2 } : {})
  }, [])

  const sections = [
    { id: "trades" as const, label: "Trades", icon: Crosshair, color: "#10b981" },
    { id: "psychology" as const, label: "Psych", icon: Brain, color: "#a78bfa" },
    { id: "strategy" as const, label: "Strategy", icon: Target, color: "#06b6d4" },
  ]

  return (
    <div className="border-b border-white/[0.06]">
      {/* Summary bar */}
      <div className="px-3 py-2 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Wrench className="w-3 h-3 text-amber-400/70" />
            <span className="text-[9px] font-mono font-bold text-amber-400/70 uppercase tracking-widest">Custom Build</span>
          </div>
          <button
            onClick={handleApply}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/[0.1] border border-amber-500/[0.2] text-amber-400 text-[9px] font-mono font-bold hover:bg-amber-500/[0.2] transition-all"
          >
            <Send className="w-2.5 h-2.5" />
            APPLY
          </button>
        </div>

        {/* Quick presets row */}
        <div className="flex gap-1">
          {([
            { id: "empty" as const, label: "0 trades", desc: "Fresh" },
            { id: "10" as const, label: "10 trades", desc: "Week 1" },
            { id: "50" as const, label: "50 trades", desc: "Month 1" },
            { id: "100" as const, label: "100 trades", desc: "Quarter" },
          ]).map(p => (
            <button
              key={p.id}
              onClick={() => loadPreset(p.id)}
              className="flex-1 py-1.5 rounded-md text-center bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all"
            >
              <div className="text-[9px] font-mono font-bold text-white/50">{p.label}</div>
              <div className="text-[7px] font-mono text-white/20">{p.desc}</div>
            </button>
          ))}
        </div>

        {/* Live stats strip */}
        <div className="flex gap-1">
          <StatPill label="TRADES" value={totalTrades} color="rgba(255,255,255,0.5)" />
          <StatPill label="WR" value={winRate} color={winRate >= 55 ? "#10b981" : winRate >= 45 ? "#f59e0b" : "#ef4444"} suffix="%" />
          <StatPill label="AVG R" value={avgR.toFixed(1)} color={avgR >= 1 ? "#10b981" : avgR >= 0 ? "#f59e0b" : "#ef4444"} />
          <StatPill label="P&L" value={`${accountGrowth >= 0 ? "+" : ""}${accountGrowth}%`} color={accountGrowth >= 0 ? "#10b981" : "#ef4444"} />
        </div>

        {/* Global sliders */}
        <div className="space-y-1.5">
          <MiniSlider label="Total Trades" value={totalTrades} min={0} max={500} step={1} color="#06b6d4" onChange={setTotalTrades} />
          <MiniSlider label="Win Rate" value={winRate} min={0} max={100} step={1} suffix="%" color="#10b981" onChange={setWinRate} />
          <MiniSlider label="Avg R" value={avgR} min={-3} max={5} step={0.1} suffix="R" color="#a78bfa" onChange={setAvgR} />
          <MiniSlider label="Account Growth" value={accountGrowth} min={-50} max={100} step={0.5} suffix="%" color="#f59e0b" onChange={setAccountGrowth} />
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex border-t border-white/[0.04]">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(activeSection === s.id ? null : s.id)}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[8px] font-mono font-bold uppercase tracking-wider transition-all border-b-2"
            style={{
              borderBottomColor: activeSection === s.id ? s.color : "transparent",
              color: activeSection === s.id ? s.color : "rgba(255,255,255,0.25)",
              backgroundColor: activeSection === s.id ? `${s.color}06` : "transparent",
            }}
          >
            <s.icon className="w-3 h-3" />
            {s.label}
          </button>
        ))}
      </div>

      {/* Section content */}
      <AnimatePresence mode="wait">
        {/* ── TRADES ── */}
        {activeSection === "trades" && (
          <motion.div key="trades" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
            <div className="px-3 py-2 space-y-2">
              {/* Add trade button */}
              {!showTradeForm ? (
                <button
                  onClick={() => setShowTradeForm(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-md border border-dashed border-emerald-500/[0.2] bg-emerald-500/[0.03] text-emerald-400/70 text-[9px] font-mono font-bold hover:bg-emerald-500/[0.06] hover:border-emerald-500/[0.3] transition-all"
                >
                  <Plus className="w-3 h-3" />
                  ADD TRADE
                </button>
              ) : (
                /* Trade entry form */
                <div className="rounded-lg border border-emerald-500/[0.15] bg-emerald-500/[0.03] p-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold text-emerald-400/70 uppercase tracking-wider">New Trade</span>
                    <button onClick={() => setShowTradeForm(false)} className="p-0.5 rounded hover:bg-white/[0.04] text-white/20 hover:text-white/50 transition-all">
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Instrument select */}
                  <div className="space-y-1">
                    <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider">Instrument</span>
                    <div className="flex flex-wrap gap-1">
                      {INSTRUMENTS.map(inst => (
                        <button
                          key={inst}
                          onClick={() => setTradeInstrument(inst)}
                          className="px-1.5 py-0.5 rounded text-[8px] font-mono transition-all"
                          style={{
                            backgroundColor: tradeInstrument === inst ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.02)",
                            borderWidth: 1,
                            borderColor: tradeInstrument === inst ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.06)",
                            color: tradeInstrument === inst ? "#10b981" : "rgba(255,255,255,0.35)",
                          }}
                        >
                          {inst}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Direction + Result row */}
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-1">
                      <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider">Direction</span>
                      <div className="flex gap-1">
                        <button onClick={() => setTradeDirection("long")}
                          className="flex-1 flex items-center justify-center gap-1 py-1 rounded text-[8px] font-mono font-bold transition-all"
                          style={{
                            backgroundColor: tradeDirection === "long" ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.02)",
                            borderWidth: 1,
                            borderColor: tradeDirection === "long" ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)",
                            color: tradeDirection === "long" ? "#10b981" : "rgba(255,255,255,0.3)",
                          }}
                        >
                          <ArrowUpRight className="w-2.5 h-2.5" /> LONG
                        </button>
                        <button onClick={() => setTradeDirection("short")}
                          className="flex-1 flex items-center justify-center gap-1 py-1 rounded text-[8px] font-mono font-bold transition-all"
                          style={{
                            backgroundColor: tradeDirection === "short" ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.02)",
                            borderWidth: 1,
                            borderColor: tradeDirection === "short" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)",
                            color: tradeDirection === "short" ? "#ef4444" : "rgba(255,255,255,0.3)",
                          }}
                        >
                          <ArrowDownRight className="w-2.5 h-2.5" /> SHORT
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider">Result</span>
                      <div className="flex gap-1">
                        {(["win", "loss", "breakeven"] as const).map(r => (
                          <button key={r} onClick={() => setTradeResult(r)}
                            className="flex-1 py-1 rounded text-[7px] font-mono font-bold uppercase transition-all"
                            style={{
                              backgroundColor: tradeResult === r ? (r === "win" ? "rgba(16,185,129,0.1)" : r === "loss" ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.04)") : "rgba(255,255,255,0.02)",
                              borderWidth: 1,
                              borderColor: tradeResult === r ? (r === "win" ? "rgba(16,185,129,0.2)" : r === "loss" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.1)") : "rgba(255,255,255,0.06)",
                              color: tradeResult === r ? (r === "win" ? "#10b981" : r === "loss" ? "#ef4444" : "rgba(255,255,255,0.5)") : "rgba(255,255,255,0.25)",
                            }}
                          >
                            {r === "breakeven" ? "BE" : r}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* R Multiple + Entry Type + Date */}
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-1">
                      <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider">R Multiple</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setTradeR(Math.max(0.1, tradeR - 0.1))} className="p-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-white/60 transition-all"><Minus className="w-2.5 h-2.5" /></button>
                        <span className="flex-1 text-center text-[10px] font-mono font-bold text-white/60">{tradeR.toFixed(1)}R</span>
                        <button onClick={() => setTradeR(tradeR + 0.1)} className="p-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-white/60 transition-all"><Plus className="w-2.5 h-2.5" /></button>
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider">Entry</span>
                      <div className="flex gap-1">
                        {(["market", "limit", "stop"] as const).map(et => (
                          <button key={et} onClick={() => setTradeEntry(et)}
                            className="flex-1 py-1 rounded text-[7px] font-mono font-bold uppercase transition-all"
                            style={{
                              backgroundColor: tradeEntry === et ? "rgba(6,182,212,0.1)" : "rgba(255,255,255,0.02)",
                              borderWidth: 1,
                              borderColor: tradeEntry === et ? "rgba(6,182,212,0.2)" : "rgba(255,255,255,0.06)",
                              color: tradeEntry === et ? "#06b6d4" : "rgba(255,255,255,0.25)",
                            }}
                          >
                            {et.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="space-y-1">
                    <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider">Date</span>
                    <input
                      type="date" value={tradeDate} onChange={(e) => setTradeDate(e.target.value)}
                      className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-[9px] font-mono text-white/60 focus:outline-none focus:border-emerald-500/[0.3]"
                    />
                  </div>

                  {/* Submit */}
                  <button onClick={addTrade}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md bg-emerald-500/[0.1] border border-emerald-500/[0.2] text-emerald-400 text-[9px] font-mono font-bold hover:bg-emerald-500/[0.15] transition-all"
                  >
                    <Check className="w-3 h-3" /> CONFIRM TRADE
                  </button>
                </div>
              )}

              {/* Trade log */}
              {trades.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">Trade Log ({trades.length})</span>
                  <div className="space-y-0.5 max-h-[120px] overflow-y-auto">
                    {trades.map(t => (
                      <div key={t.id} className="flex items-center gap-1.5 px-1.5 py-1 rounded bg-white/[0.015] border border-white/[0.04] group">
                        {t.direction === "long"
                          ? <ArrowUpRight className="w-2.5 h-2.5 text-emerald-400/60 shrink-0" />
                          : <ArrowDownRight className="w-2.5 h-2.5 text-red-400/60 shrink-0" />
                        }
                        <span className="text-[8px] font-mono text-white/50 flex-1">{t.instrument}</span>
                        <span className="text-[8px] font-mono" style={{ color: t.result === "win" ? "#10b981" : t.result === "loss" ? "#ef4444" : "rgba(255,255,255,0.3)" }}>
                          {t.rMultiple > 0 ? "+" : ""}{t.rMultiple.toFixed(1)}R
                        </span>
                        <span className="text-[7px] font-mono text-white/15">{t.date.slice(5)}</span>
                        <button onClick={() => removeTrade(t.id)} className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-white/[0.04] text-white/20 hover:text-red-400 transition-all">
                          <X className="w-2 h-2" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── PSYCHOLOGY ── */}
        {activeSection === "psychology" && (
          <motion.div key="psych" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
            <div className="px-3 py-2 space-y-2">
              {/* Mood */}
              <div className="space-y-1">
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">Mood Balance</span>
                <div className="flex gap-1">
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[7px] font-mono text-emerald-400/40">Positive</span>
                      <span className="text-[9px] font-mono font-bold text-emerald-400/70">{moodPositive}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setMoodPositive(Math.max(0, moodPositive - 1))} className="p-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-white/25 hover:text-white/50 transition-all"><Minus className="w-2 h-2" /></button>
                      <div className="flex-1 h-1 rounded-full bg-white/[0.04]">
                        <div className="h-full rounded-full bg-emerald-500/40" style={{ width: `${Math.min(100, (moodPositive / Math.max(moodPositive + moodNegative, 1)) * 100)}%` }} />
                      </div>
                      <button onClick={() => setMoodPositive(moodPositive + 1)} className="p-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-white/25 hover:text-white/50 transition-all"><Plus className="w-2 h-2" /></button>
                    </div>
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[7px] font-mono text-red-400/40">Negative</span>
                      <span className="text-[9px] font-mono font-bold text-red-400/70">{moodNegative}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setMoodNegative(Math.max(0, moodNegative - 1))} className="p-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-white/25 hover:text-white/50 transition-all"><Minus className="w-2 h-2" /></button>
                      <div className="flex-1 h-1 rounded-full bg-white/[0.04]">
                        <div className="h-full rounded-full bg-red-500/40" style={{ width: `${Math.min(100, (moodNegative / Math.max(moodPositive + moodNegative, 1)) * 100)}%` }} />
                      </div>
                      <button onClick={() => setMoodNegative(moodNegative + 1)} className="p-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-white/25 hover:text-white/50 transition-all"><Plus className="w-2 h-2" /></button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emotions */}
              <div className="space-y-1">
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">Emotions (tap to add)</span>
                <div className="flex flex-wrap gap-1">
                  {EMOTIONS.map(em => {
                    const count = activeEmotions[em] || 0
                    return (
                      <button key={em} onClick={() => toggleEmotion(em)}
                        className="relative px-1.5 py-0.5 rounded text-[8px] font-mono transition-all"
                        style={{
                          backgroundColor: count > 0 ? "rgba(167,139,250,0.08)" : "rgba(255,255,255,0.02)",
                          borderWidth: 1,
                          borderColor: count > 0 ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.06)",
                          color: count > 0 ? "#a78bfa" : "rgba(255,255,255,0.3)",
                        }}
                      >
                        {em}{count > 0 && <span className="ml-0.5 text-[7px] opacity-60">x{count}</span>}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Pitfalls */}
              <div className="space-y-1">
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">Pitfalls (tap to add)</span>
                <div className="flex flex-wrap gap-1">
                  {PITFALLS.map(p => {
                    const count = activePitfalls[p] || 0
                    return (
                      <button key={p} onClick={() => togglePitfall(p)}
                        className="relative px-1.5 py-0.5 rounded text-[8px] font-mono transition-all"
                        style={{
                          backgroundColor: count > 0 ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.02)",
                          borderWidth: 1,
                          borderColor: count > 0 ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)",
                          color: count > 0 ? "#ef4444" : "rgba(255,255,255,0.3)",
                        }}
                      >
                        {p}{count > 0 && <span className="ml-0.5 text-[7px] opacity-60">x{count}</span>}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Decision time + Active days */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <MiniSlider label="Decision Mins" value={decisionMins} min={0} max={60} step={1} color="#a78bfa" onChange={setDecisionMins} />
                </div>
                <div className="flex-1">
                  <MiniSlider label="Active Days" value={activeDays} min={0} max={7} step={1} suffix="/7" color="#10b981" onChange={setActiveDays} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STRATEGY ── */}
        {activeSection === "strategy" && (
          <motion.div key="strat" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
            <div className="px-3 py-2 space-y-2">
              {/* Entry type mix */}
              <div className="space-y-1">
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">Entry Type Mix</span>
                <div className="flex gap-1">
                  {(["market", "limit", "stop"] as const).map(et => (
                    <div key={et} className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[7px] font-mono text-cyan-400/40 uppercase">{et}</span>
                        <span className="text-[8px] font-mono font-bold text-cyan-400/60">{entryMix[et]}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <button onClick={() => setEntryMix(p => ({ ...p, [et]: Math.max(0, p[et] - 1) }))} className="p-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-white/25 hover:text-white/50 transition-all"><Minus className="w-2 h-2" /></button>
                        <button onClick={() => setEntryMix(p => ({ ...p, [et]: p[et] + 1 }))} className="p-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-white/25 hover:text-white/50 transition-all"><Plus className="w-2 h-2" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeframes */}
              <div className="space-y-1">
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">Timeframes</span>
                <div className="flex flex-wrap gap-1">
                  {TIMEFRAMES.map(tf => {
                    const active = !!selectedTimeframes[tf]
                    return (
                      <button key={tf} onClick={() => toggleTimeframe(tf)}
                        className="px-2 py-0.5 rounded text-[8px] font-mono font-bold transition-all"
                        style={{
                          backgroundColor: active ? "rgba(6,182,212,0.1)" : "rgba(255,255,255,0.02)",
                          borderWidth: 1,
                          borderColor: active ? "rgba(6,182,212,0.2)" : "rgba(255,255,255,0.06)",
                          color: active ? "#06b6d4" : "rgba(255,255,255,0.25)",
                        }}
                      >
                        {tf}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Instruments */}
              <div className="space-y-1">
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">Instruments (tap to add count)</span>
                <div className="flex flex-wrap gap-1">
                  {INSTRUMENTS.map(inst => {
                    const count = selectedInstruments[inst] || 0
                    return (
                      <button key={inst} onClick={() => setSelectedInstruments(p => ({ ...p, [inst]: (p[inst] || 0) + 1 }))}
                        className="px-1.5 py-0.5 rounded text-[8px] font-mono transition-all"
                        style={{
                          backgroundColor: count > 0 ? "rgba(6,182,212,0.08)" : "rgba(255,255,255,0.02)",
                          borderWidth: 1,
                          borderColor: count > 0 ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.06)",
                          color: count > 0 ? "#06b6d4" : "rgba(255,255,255,0.3)",
                        }}
                      >
                        {inst}{count > 0 && <span className="ml-0.5 text-[7px] opacity-50">x{count}</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN SIMULATOR COMPONENT
   ══════════════════════════════════════════════════════════════════════════ */

export function PersonaSimulator({ onSelectPersona, currentPersonaId }: PersonaSimulatorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPersona, setSelectedPersona] = useState<TraderPersona | null>(null)
  const [customLabel, setCustomLabel] = useState<string | null>(null)
  const [expandedTier, setExpandedTier] = useState<string | null>(null)
  const [showCustomBuild, setShowCustomBuild] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const tiers = useMemo(() => [
    { id: "professional", label: "Professional", color: "#10b981", icon: Award, personas: ALL_PERSONAS.filter(p => p.tier === "professional") },
    { id: "advanced", label: "Advanced", color: "#06b6d4", icon: Crosshair, personas: ALL_PERSONAS.filter(p => p.tier === "advanced") },
    { id: "good", label: "Good", color: "#22d3ee", icon: Target, personas: ALL_PERSONAS.filter(p => p.tier === "good") },
    { id: "intermediate", label: "Intermediate", color: "#a78bfa", icon: BarChart3, personas: ALL_PERSONAS.filter(p => p.tier === "intermediate") },
    { id: "developing", label: "Developing", color: "#f59e0b", icon: TrendingUp, personas: ALL_PERSONAS.filter(p => p.tier === "developing") },
    { id: "starter", label: "Starter", color: "#94a3b8", icon: CircleDot, personas: ALL_PERSONAS.filter(p => p.tier === "starter") },
    { id: "gambler", label: "Gambler", color: "#ef4444", icon: Flame, personas: ALL_PERSONAS.filter(p => p.tier === "gambler") },
  ], [])

  const handleSelect = useCallback((persona: TraderPersona) => {
    setSelectedPersona(persona)
    setCustomLabel(null)
    setShowCustomBuild(false)
    const snap = JSON.parse(JSON.stringify(persona.snapshot)) as CopilotAnalyticsSnapshot
    onSelectPersona(snap, persona)
    setIsOpen(false)
  }, [onSelectPersona])

  const handleClear = useCallback(() => {
    setSelectedPersona(null)
    setCustomLabel(null)
    setShowCustomBuild(false)
    onSelectPersona(null as unknown as CopilotAnalyticsSnapshot, null)
  }, [onSelectPersona])

  const handleCustomApply = useCallback((snapshot: CopilotAnalyticsSnapshot, label: string) => {
    setSelectedPersona(null)
    setCustomLabel(label)
    onSelectPersona(snapshot, null, label)
    setIsOpen(false)
  }, [onSelectPersona])

  // Click outside to close
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClick)
      return () => document.removeEventListener("mousedown", handleClick)
    }
  }, [isOpen])

  const displayLabel = selectedPersona ? selectedPersona.alias : customLabel ? customLabel : "SIMULATOR"
  const displayColor = selectedPersona ? selectedPersona.tierColor : customLabel ? "#f59e0b" : "rgba(255,255,255,0.35)"

  return (
    <div ref={panelRef} className="relative">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-mono font-bold tracking-wider transition-all hover:bg-white/[0.04]"
        style={{
          color: displayColor,
          backgroundColor: (selectedPersona || customLabel) ? `${displayColor}08` : "transparent",
          borderWidth: 1,
          borderColor: (selectedPersona || customLabel) ? `${displayColor}20` : "rgba(255,255,255,0.06)",
        }}
      >
        <Users className="w-3 h-3" />
        {displayLabel}
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-1 z-50 rounded-lg border border-white/[0.08] bg-[#0c0c12]/98 backdrop-blur-xl shadow-2xl overflow-hidden"
            style={{ maxHeight: "80vh", width: "340px" }}
          >
            {/* Header */}
            <div className="px-3 py-2 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-white/70 tracking-wider">PERSONA SIMULATOR</span>
              </div>
              <div className="flex items-center gap-1.5">
                {(selectedPersona || customLabel) && (
                  <button onClick={handleClear} className="text-[8px] font-mono text-white/20 hover:text-red-400 transition-all">RESET</button>
                )}
                <span className="text-[8px] font-mono text-white/20">{ALL_PERSONAS.length} PROFILES</span>
              </div>
            </div>

            {/* Scrollable list */}
            <div className="overflow-y-auto" style={{ maxHeight: "70vh" }}>
              {/* ── CUSTOM BUILD SECTION ── */}
              <div>
                <button
                  onClick={() => setShowCustomBuild(!showCustomBuild)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/[0.02] transition-all border-b border-white/[0.04]"
                >
                  <Wrench className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-mono font-bold tracking-wider text-amber-400">CUSTOM BUILD</span>
                  <span className="text-[8px] font-mono text-white/20 ml-auto">Your data</span>
                  <ChevronRight className={`w-3 h-3 text-amber-400/40 transition-transform ${showCustomBuild ? "rotate-90" : ""}`} />
                </button>

                <AnimatePresence>
                  {showCustomBuild && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <CustomBuildPanel onApply={handleCustomApply} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Separator ── */}
              <div className="px-3 py-1.5 flex items-center gap-2">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[7px] font-mono text-white/15 uppercase tracking-widest">Presets</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              {/* ── TIER SECTIONS ── */}
              {tiers.map(tier => {
                const isExpanded = expandedTier === tier.id
                const TierIcon = tier.icon
                return (
                  <div key={tier.id}>
                    <button
                      onClick={() => setExpandedTier(isExpanded ? null : tier.id)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-white/[0.02] transition-all"
                    >
                      <TierIcon className="w-3 h-3" style={{ color: tier.color }} />
                      <span className="text-[9px] font-mono font-bold tracking-wider" style={{ color: tier.color }}>
                        {tier.label.toUpperCase()}
                      </span>
                      <span className="text-[8px] font-mono text-white/15 ml-auto">{tier.personas.length}</span>
                      <ChevronRight className={`w-3 h-3 text-white/15 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {isExpanded && tier.personas.map(persona => {
                        const isActive = selectedPersona?.id === persona.id
                        return (
                          <motion.button
                            key={persona.id}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            onClick={() => handleSelect(persona)}
                            className="w-full text-left overflow-hidden"
                          >
                            <div
                              className="mx-2 mb-1 p-2 rounded-md transition-all"
                              style={{
                                backgroundColor: isActive ? `${persona.tierColor}08` : "rgba(255,255,255,0.01)",
                                borderWidth: 1,
                                borderColor: isActive ? `${persona.tierColor}25` : "rgba(255,255,255,0.03)",
                              }}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 mb-0.5">
                                    <span className="text-[10px] font-bold text-white/80 truncate">{persona.alias}</span>
                                    <TierBadge tier={persona.tier} tierLabel={persona.tierLabel} tierColor={persona.tierColor} />
                                  </div>
                                  <span className="text-[8px] text-white/25 font-mono">{persona.name}</span>
                                  <p className="text-[8px] text-white/30 mt-0.5 line-clamp-2 leading-relaxed">{persona.description}</p>
                                </div>
                              </div>
                              <div className="flex gap-1 mt-1.5">
                                <StatPill label="WR" value={persona.winRate} color={persona.winRate >= 55 ? "#10b981" : persona.winRate >= 45 ? "#f59e0b" : "#ef4444"} suffix="%" />
                                <StatPill label="AVG R" value={persona.avgR.toFixed(1)} color={persona.avgR >= 1 ? "#10b981" : persona.avgR >= 0 ? "#f59e0b" : "#ef4444"} />
                                <StatPill label="TRADES" value={persona.totalTrades} color="rgba(255,255,255,0.5)" />
                                <StatPill label="P&L" value={persona.accountGrowth} color={persona.accountGrowth.startsWith("+") ? "#10b981" : persona.accountGrowth === "0.0%" ? "rgba(255,255,255,0.3)" : "#ef4444"} />
                              </div>
                            </div>
                          </motion.button>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ══ Compact detail bar -- renders below copilot header when a persona is active ══ */
export function PersonaDetailBar({ persona, customLabel, onReset }: {
  persona: TraderPersona | null
  customLabel?: string | null
  onReset: () => void
}) {
  if (!persona && !customLabel) return null
  return (
    <div className="px-2 py-1.5 border-b border-white/[0.04] bg-white/[0.01]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: persona ? persona.tierColor : "#f59e0b" }} />
          <span className="text-[10px] font-bold text-white/70 truncate">{persona ? persona.alias : customLabel}</span>
          {persona && <TierBadge tier={persona.tier} tierLabel={persona.tierLabel} tierColor={persona.tierColor} />}
          {!persona && customLabel && (
            <span className="text-[8px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded-sm border text-amber-400 border-amber-400/30 bg-amber-400/[0.08]">CUSTOM</span>
          )}
          {persona && <span className="text-[8px] font-mono text-white/20 truncate">{persona.methodology}</span>}
        </div>
        <button onClick={onReset} className="p-0.5 rounded hover:bg-white/[0.04] text-white/20 hover:text-white/50 transition-all shrink-0" title="Clear">
          <X className="w-2.5 h-2.5" />
        </button>
      </div>
      {persona && (
        <div className="flex gap-1 mt-1 flex-wrap">
          {persona.strengths.slice(0, 3).map(s => (
            <span key={s} className="text-[7px] font-mono px-1 py-0.5 rounded bg-emerald-500/[0.06] border border-emerald-500/[0.08] text-emerald-400/60">{s}</span>
          ))}
          {persona.weaknesses.slice(0, 2).map(w => (
            <span key={w} className="text-[7px] font-mono px-1 py-0.5 rounded bg-red-500/[0.06] border border-red-500/[0.08] text-red-400/60">{w}</span>
          ))}
        </div>
      )}
    </div>
  )
}
