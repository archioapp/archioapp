"use client"

import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Zap,
  Upload,
  AlertCircle,
  Crosshair,
  Clock,
  Shield,
  CheckCircle2,
  BookOpen,
  Cpu,
} from "lucide-react"
import { SURFACE, ACCENT, RADIUS, ELEVATION, GLOW, GRADIENT, MOTION, TYPE } from "@/components/mtf/mtf-theme"

const INSTRUMENTS = [
  { value: "EURUSD", label: "EUR/USD", type: "Forex" },
  { value: "GBPUSD", label: "GBP/USD", type: "Forex" },
  { value: "USDJPY", label: "USD/JPY", type: "Forex" },
  { value: "GBPJPY", label: "GBP/JPY", type: "Forex" },
  { value: "XAUUSD", label: "XAU/USD", type: "Commodities" },
  { value: "BTCUSD", label: "BTC/USD", type: "Crypto" },
  { value: "ETHUSD", label: "ETH/USD", type: "Crypto" },
  { value: "NAS100", label: "NAS100", type: "Indices" },
  { value: "SPX500", label: "SPX500", type: "Indices" },
]

const TIMEFRAMES = ["1m", "5m", "15m", "30m", "1H", "4H", "1D", "1W"]

const CONFLUENCE_OPTIONS = [
  "Order Block", "Fair Value Gap", "Break of Structure", "Change of Character",
  "Liquidity Sweep", "RSI Divergence", "Supply Zone", "Demand Zone",
  "Session Open", "London Kill Zone", "NY Kill Zone", "Equal Highs/Lows",
]

const EXPIRY_OPTIONS = [
  { value: "1h", label: "1 Hour" },
  { value: "4h", label: "4 Hours" },
  { value: "12h", label: "12 Hours" },
  { value: "1d", label: "1 Day" },
  { value: "3d", label: "3 Days" },
  { value: "1w", label: "1 Week" },
]

interface ForecastSubmitDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function ForecastSubmitDrawer({ isOpen, onClose }: ForecastSubmitDrawerProps) {
  const [direction, setDirection] = useState<"LONG" | "SHORT" | null>(null)
  const [instrument, setInstrument] = useState("")
  const [timeframe, setTimeframe] = useState("")
  const [entry, setEntry] = useState("")
  const [stopLoss, setStopLoss] = useState("")
  const [takeProfit, setTakeProfit] = useState("")
  const [confidence, setConfidence] = useState(50)
  const [commentary, setCommentary] = useState("")
  const [invalidation, setInvalidation] = useState("")
  const [selectedConfluences, setSelectedConfluences] = useState<string[]>([])
  const [expiry, setExpiry] = useState("")
  const [showInstrumentPicker, setShowInstrumentPicker] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)

  const toggleConfluence = useCallback((c: string) => {
    setSelectedConfluences((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])
  }, [])

  const step1Valid = direction && instrument && entry && stopLoss && takeProfit && timeframe
  const isValid = step1Valid && commentary.length > 10 && expiry

  const handleSubmit = useCallback(() => {
    if (!isValid) return
    onClose()
  }, [isValid, onClose])

  const confidenceColor = confidence >= 75 ? ACCENT.emerald.rgb : confidence >= 50 ? ACCENT.amber.rgb : ACCENT.rose.rgb
  const confidenceLabel = confidence >= 75 ? "High" : confidence >= 50 ? "Moderate" : "Low"

  /* Compute R:R */
  const riskReward = useMemo(() => {
    const e = parseFloat(entry.replace(/,/g, ""))
    const sl = parseFloat(stopLoss.replace(/,/g, ""))
    const tp = parseFloat(takeProfit.replace(/,/g, ""))
    if (!e || !sl || !tp || e === sl) return null
    const risk = Math.abs(e - sl)
    const reward = Math.abs(tp - e)
    if (risk === 0) return null
    return (reward / risk).toFixed(1)
  }, [entry, stopLoss, takeProfit])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-[61] w-full max-w-[540px] overflow-y-auto"
            style={{
              background: SURFACE.void,
              borderLeft: `1px solid rgba(${ACCENT.purple.rgb}, 0.1)`,
              boxShadow: `-20px 0 60px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4" style={{
              background: `rgba(10,12,21,0.95)`, backdropFilter: "blur(20px)",
              borderBottom: `1px solid rgba(${ACCENT.purple.rgb}, 0.06)`,
            }}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8" style={{
                  background: `rgba(${ACCENT.purple.rgb}, 0.1)`, borderRadius: RADIUS.badge,
                }}>
                  <Crosshair size={15} style={{ color: ACCENT.purple.hex }} />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-white">Publish Your Forecast</h2>
                  <p className="text-[10px] text-slate-500">This becomes part of your permanent, verifiable record</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Step indicator */}
                <div className="flex items-center gap-1.5">
                  {[1, 2].map((s) => (
                    <div
                      key={s}
                      className="flex items-center justify-center w-5 h-5 text-[9px] font-bold"
                      style={{
                        borderRadius: RADIUS.dot,
                        background: step >= s ? `rgba(${ACCENT.purple.rgb}, 0.15)` : `rgba(${ACCENT.slate.rgb}, 0.06)`,
                        color: step >= s ? ACCENT.purple.hex : `rgba(${ACCENT.slate.rgb}, 0.25)`,
                        border: step === s ? `1px solid rgba(${ACCENT.purple.rgb}, 0.3)` : "1px solid transparent",
                      }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
                <button onClick={onClose} className="flex items-center justify-center w-8 h-8 cursor-pointer hover:bg-white/5 transition-colors" style={{ borderRadius: RADIUS.badge }}>
                  <X size={16} className="text-slate-400" />
                </button>
              </div>
            </div>

            <div className="px-6 py-6 space-y-6">
              {step === 1 ? (
                /* ── STEP 1: Setup ── */
                <>
                  <div className="flex items-center gap-2 px-3 py-2" style={{
                    background: `rgba(${ACCENT.purple.rgb}, 0.04)`, borderRadius: RADIUS.inner,
                    border: `1px solid rgba(${ACCENT.purple.rgb}, 0.06)`,
                  }}>
                    <span className="text-[10px] font-semibold" style={{ color: `rgba(${ACCENT.purple.rgb}, 0.6)` }}>Step 1:</span>
                    <span className="text-[10px]" style={{ color: `rgba(${ACCENT.slate.rgb}, 0.5)` }}>Define your market prediction</span>
                  </div>

                  {/* Direction */}
                  <div>
                    <label className={`${TYPE.label} block mb-2`} style={{ color: `rgba(${ACCENT.slate.rgb}, 0.5)` }}>Direction</label>
                    <div className="flex gap-2">
                      {(["LONG", "SHORT"] as const).map((d) => {
                        const isSelected = direction === d
                        const color = d === "LONG" ? ACCENT.emerald : ACCENT.rose
                        const Icon = d === "LONG" ? ArrowUpRight : ArrowDownRight
                        return (
                          <motion.button
                            key={d}
                            onClick={() => setDirection(d)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 cursor-pointer"
                            style={{
                              background: isSelected ? `rgba(${color.rgb}, 0.1)` : SURFACE.recess,
                              borderRadius: RADIUS.inner,
                              border: `1px solid ${isSelected ? `rgba(${color.rgb}, 0.25)` : "rgba(255,255,255,0.04)"}`,
                              color: isSelected ? color.hex : `rgba(${ACCENT.slate.rgb}, 0.4)`,
                              boxShadow: isSelected ? GLOW.low(color.rgb) : "none",
                            }}
                            whileHover={{ borderColor: `rgba(${color.rgb}, 0.3)` }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Icon size={16} />
                            <span className="text-[13px] font-bold uppercase tracking-wider">{d}</span>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Instrument */}
                  <div>
                    <label className={`${TYPE.label} block mb-2`} style={{ color: `rgba(${ACCENT.slate.rgb}, 0.5)` }}>Instrument</label>
                    <div className="relative">
                      <button
                        onClick={() => setShowInstrumentPicker(!showInstrumentPicker)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer"
                        style={{ background: SURFACE.recess, borderRadius: RADIUS.inner, border: `1px solid rgba(255,255,255,0.04)`, color: instrument ? "#fff" : `rgba(${ACCENT.slate.rgb}, 0.3)` }}
                      >
                        <span className="text-[13px] font-mono">{instrument || "Select instrument..."}</span>
                        <ChevronDown size={14} className="text-slate-500" />
                      </button>
                      <AnimatePresence>
                        {showInstrumentPicker && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                            className="absolute top-full left-0 right-0 z-20 mt-1 p-2 max-h-[200px] overflow-y-auto"
                            style={{ background: `rgba(12,14,24,0.98)`, borderRadius: RADIUS.inner, border: `1px solid rgba(${ACCENT.purple.rgb}, 0.15)`, boxShadow: ELEVATION.tooltip, backdropFilter: "blur(20px)" }}
                          >
                            {INSTRUMENTS.map((inst) => (
                              <button
                                key={inst.value}
                                onClick={() => { setInstrument(inst.value); setShowInstrumentPicker(false) }}
                                className="w-full flex items-center justify-between px-3 py-2 text-left cursor-pointer transition-all duration-150"
                                style={{ borderRadius: RADIUS.badge, background: instrument === inst.value ? `rgba(${ACCENT.purple.rgb}, 0.1)` : "transparent" }}
                              >
                                <span className="text-[12px] font-mono text-white">{inst.label}</span>
                                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">{inst.type}</span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Timeframe */}
                  <div>
                    <label className={`${TYPE.label} block mb-2`} style={{ color: `rgba(${ACCENT.slate.rgb}, 0.5)` }}>Timeframe</label>
                    <div className="flex gap-1.5 flex-wrap">
                      {TIMEFRAMES.map((tf) => (
                        <button
                          key={tf}
                          onClick={() => setTimeframe(tf)}
                          className="px-3 py-1.5 text-[11px] font-mono cursor-pointer transition-all duration-200"
                          style={{
                            borderRadius: RADIUS.badge,
                            background: timeframe === tf ? `rgba(${ACCENT.purple.rgb}, 0.12)` : SURFACE.recess,
                            color: timeframe === tf ? ACCENT.purple.hex : `rgba(${ACCENT.slate.rgb}, 0.4)`,
                            border: `1px solid ${timeframe === tf ? `rgba(${ACCENT.purple.rgb}, 0.2)` : "rgba(255,255,255,0.04)"}`,
                          }}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price levels */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Entry Price", value: entry, setter: setEntry, placeholder: "0.0000" },
                      { label: "Stop Loss", value: stopLoss, setter: setStopLoss, placeholder: "0.0000", color: ACCENT.rose.rgb },
                      { label: "Take Profit", value: takeProfit, setter: setTakeProfit, placeholder: "0.0000", color: ACCENT.emerald.rgb },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className={`${TYPE.label} block mb-1.5`} style={{ color: `rgba(${ACCENT.slate.rgb}, 0.5)` }}>{field.label}</label>
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) => field.setter(e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2.5 text-[13px] font-mono text-white placeholder:text-slate-600 outline-none"
                          style={{ background: SURFACE.recess, borderRadius: RADIUS.badge, border: `1px solid ${field.value && field.color ? `rgba(${field.color}, 0.15)` : "rgba(255,255,255,0.04)"}` }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Computed R:R */}
                  {riskReward && (
                    <div className="flex items-center gap-2 px-3 py-2" style={{
                      background: `rgba(${ACCENT.purple.rgb}, 0.04)`, borderRadius: RADIUS.inner,
                      border: `1px solid rgba(${ACCENT.purple.rgb}, 0.06)`,
                    }}>
                      <span className="text-[10px]" style={{ color: `rgba(${ACCENT.slate.rgb}, 0.4)` }}>Computed R:R</span>
                      <span className="text-[13px] font-mono font-bold" style={{ color: ACCENT.purple.hex }}>1:{riskReward}</span>
                    </div>
                  )}

                  {/* Next button */}
                  <motion.button
                    onClick={() => step1Valid && setStep(2)}
                    disabled={!step1Valid}
                    className="w-full py-3 text-[13px] font-semibold text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
                    style={{
                      background: step1Valid ? `rgba(${ACCENT.purple.rgb}, 0.15)` : `rgba(${ACCENT.slate.rgb}, 0.06)`,
                      borderRadius: RADIUS.pill,
                      border: `1px solid ${step1Valid ? `rgba(${ACCENT.purple.rgb}, 0.2)` : "rgba(255,255,255,0.04)"}`,
                    }}
                    whileHover={step1Valid ? { backgroundColor: `rgba(${ACCENT.purple.rgb}, 0.2)` } : {}}
                  >
                    Continue to reasoning
                  </motion.button>
                </>
              ) : (
                /* ── STEP 2: Reasoning + Publish ── */
                <>
                  <div className="flex items-center gap-2 px-3 py-2" style={{
                    background: `rgba(${ACCENT.blue.rgb}, 0.04)`, borderRadius: RADIUS.inner,
                    border: `1px solid rgba(${ACCENT.blue.rgb}, 0.06)`,
                  }}>
                    <span className="text-[10px] font-semibold" style={{ color: `rgba(${ACCENT.blue.rgb}, 0.6)` }}>Step 2:</span>
                    <span className="text-[10px]" style={{ color: `rgba(${ACCENT.slate.rgb}, 0.5)` }}>Provide reasoning and publish</span>
                  </div>

                  {/* Summary of step 1 */}
                  <div className="flex items-center gap-3 px-4 py-3" style={{
                    background: SURFACE.recess, borderRadius: RADIUS.inner,
                  }}>
                    <span className="text-[16px] font-bold font-mono text-white">{instrument}</span>
                    <div className="flex items-center gap-1 px-2 py-0.5" style={{
                      background: `rgba(${(direction === "LONG" ? ACCENT.emerald : ACCENT.rose).rgb}, 0.1)`,
                      borderRadius: RADIUS.badge,
                    }}>
                      {direction === "LONG" ? <ArrowUpRight size={11} style={{ color: ACCENT.emerald.hex }} /> : <ArrowDownRight size={11} style={{ color: ACCENT.rose.hex }} />}
                      <span className="text-[10px] font-bold uppercase" style={{ color: (direction === "LONG" ? ACCENT.emerald : ACCENT.rose).hex }}>{direction}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{timeframe}</span>
                    {riskReward && <span className="text-[10px] font-mono" style={{ color: ACCENT.purple.hex }}>1:{riskReward}</span>}
                    <button onClick={() => setStep(1)} className="ml-auto text-[10px] cursor-pointer text-slate-500 hover:text-white transition-colors">Edit</button>
                  </div>

                  {/* Confidence */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={`${TYPE.label}`} style={{ color: `rgba(${ACCENT.slate.rgb}, 0.5)` }}>Conviction Level</label>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px]" style={{ color: `rgba(${confidenceColor}, 0.6)` }}>{confidenceLabel}</span>
                        <span className="text-[13px] font-mono font-bold" style={{ color: `rgba(${confidenceColor}, 0.9)` }}>{confidence}%</span>
                      </div>
                    </div>
                    <input
                      type="range" min={10} max={100} value={confidence}
                      onChange={(e) => setConfidence(Number(e.target.value))}
                      className="w-full h-2 appearance-none cursor-pointer slider-thumb"
                      style={{ background: `linear-gradient(to right, rgba(${confidenceColor}, 0.6) ${confidence}%, rgba(${ACCENT.slate.rgb}, 0.08) ${confidence}%)`, borderRadius: RADIUS.dot }}
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-[9px] text-slate-600">Low conviction</span>
                      <span className="text-[9px] text-slate-600">High conviction</span>
                    </div>
                    <p className="text-[9px] mt-1" style={{ color: `rgba(${ACCENT.slate.rgb}, 0.3)` }}>
                      High-conviction calls that lose impact your credibility score more. Be honest.
                    </p>
                  </div>

                  {/* Expiry */}
                  <div>
                    <label className={`${TYPE.label} block mb-2`} style={{ color: `rgba(${ACCENT.slate.rgb}, 0.5)` }}>Prediction Window</label>
                    <div className="flex gap-1.5 flex-wrap">
                      {EXPIRY_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setExpiry(opt.value)}
                          className="px-3 py-1.5 text-[11px] font-mono cursor-pointer transition-all duration-200"
                          style={{
                            borderRadius: RADIUS.badge,
                            background: expiry === opt.value ? `rgba(${ACCENT.blue.rgb}, 0.12)` : SURFACE.recess,
                            color: expiry === opt.value ? ACCENT.blue.hex : `rgba(${ACCENT.slate.rgb}, 0.4)`,
                            border: `1px solid ${expiry === opt.value ? `rgba(${ACCENT.blue.rgb}, 0.2)` : "rgba(255,255,255,0.04)"}`,
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-[9px] mt-1.5" style={{ color: `rgba(${ACCENT.slate.rgb}, 0.3)` }}>
                      After this window, your forecast will be checked against real market data.
                    </p>
                  </div>

                  {/* Confluences */}
                  <div>
                    <label className={`${TYPE.label} block mb-2`} style={{ color: `rgba(${ACCENT.slate.rgb}, 0.5)` }}>Confluences</label>
                    <div className="flex gap-1.5 flex-wrap">
                      {CONFLUENCE_OPTIONS.map((c) => {
                        const isSelected = selectedConfluences.includes(c)
                        return (
                          <button
                            key={c}
                            onClick={() => toggleConfluence(c)}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium cursor-pointer transition-all duration-200"
                            style={{
                              borderRadius: RADIUS.badge,
                              background: isSelected ? `rgba(${ACCENT.purple.rgb}, 0.12)` : SURFACE.recess,
                              color: isSelected ? ACCENT.purple.hex : `rgba(${ACCENT.slate.rgb}, 0.4)`,
                              border: `1px solid ${isSelected ? `rgba(${ACCENT.purple.rgb}, 0.2)` : "rgba(255,255,255,0.04)"}`,
                            }}
                          >
                            {isSelected && <Zap size={9} />}
                            {c}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Commentary */}
                  <div>
                    <label className={`${TYPE.label} block mb-2`} style={{ color: `rgba(${ACCENT.slate.rgb}, 0.5)` }}>Reasoning</label>
                    <textarea
                      value={commentary}
                      onChange={(e) => setCommentary(e.target.value)}
                      placeholder="Explain your reasoning clearly. What confluences support your view? What is your thesis?"
                      rows={4}
                      className="w-full px-4 py-3 text-[12px] leading-relaxed text-white placeholder:text-slate-600 outline-none resize-none"
                      style={{ background: SURFACE.recess, borderRadius: RADIUS.inner, border: `1px solid rgba(255,255,255,0.04)` }}
                    />
                    <p className="text-[9px] text-slate-600 mt-1">
                      Minimum 10 characters. Clear reasoning builds credibility and helps mentor reviewers.
                    </p>
                  </div>

                  {/* Invalidation */}
                  <div>
                    <label className={`${TYPE.label} block mb-2`} style={{ color: `rgba(${ACCENT.slate.rgb}, 0.5)` }}>What Invalidates This Setup?</label>
                    <input
                      type="text"
                      value={invalidation}
                      onChange={(e) => setInvalidation(e.target.value)}
                      placeholder="e.g. Break below 1.0780 with displacement"
                      className="w-full px-4 py-2.5 text-[12px] text-white placeholder:text-slate-600 outline-none"
                      style={{ background: SURFACE.recess, borderRadius: RADIUS.badge, border: `1px solid rgba(255,255,255,0.04)` }}
                    />
                    <p className="text-[9px] text-slate-600 mt-1">Optional. Knowing what kills a setup shows disciplined thinking.</p>
                  </div>

                  {/* Chart upload */}
                  <div className="flex flex-col items-center justify-center py-7 cursor-pointer transition-all duration-200 hover:bg-white/[0.01]" style={{
                    background: SURFACE.recess, borderRadius: RADIUS.inner,
                    border: `1px dashed rgba(${ACCENT.purple.rgb}, 0.12)`,
                  }}>
                    <Upload size={18} style={{ color: `rgba(${ACCENT.purple.rgb}, 0.25)` }} />
                    <span className="text-[11px] text-slate-500 mt-2">Upload chart screenshot</span>
                    <span className="text-[9px] text-slate-600 mt-0.5">Visual evidence strengthens your forecast</span>
                  </div>

                  {/* Publication warning */}
                  <div className="flex items-start gap-2.5 px-4 py-3" style={{
                    background: `rgba(${ACCENT.amber.rgb}, 0.04)`, borderRadius: RADIUS.inner,
                    border: `1px solid rgba(${ACCENT.amber.rgb}, 0.08)`,
                  }}>
                    <AlertCircle size={14} style={{ color: `rgba(${ACCENT.amber.rgb}, 0.6)`, flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <p className="text-[11px] font-semibold mb-0.5" style={{ color: `rgba(${ACCENT.amber.rgb}, 0.7)` }}>Permanent Record</p>
                      <p className="text-[10px] leading-relaxed" style={{ color: `rgba(${ACCENT.amber.rgb}, 0.5)` }}>
                        This forecast will be timestamped and published. It cannot be edited or deleted after submission. The outcome will be verified against real market data and added to your track record.
                      </p>
                    </div>
                  </div>

                  {/* Platform connections */}
                  <div className="flex items-center gap-3 px-3 py-2" style={{
                    background: `rgba(${ACCENT.slate.rgb}, 0.03)`, borderRadius: RADIUS.inner,
                    border: `1px solid rgba(255,255,255,0.02)`,
                  }}>
                    <span className="text-[9px]" style={{ color: `rgba(${ACCENT.slate.rgb}, 0.3)` }}>After publishing:</span>
                    <div className="flex items-center gap-1">
                      <Cpu size={9} style={{ color: `rgba(${ACCENT.purple.rgb}, 0.4)` }} />
                      <span className="text-[9px]" style={{ color: `rgba(${ACCENT.slate.rgb}, 0.35)` }}>Run in Copilot</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield size={9} style={{ color: `rgba(${ACCENT.amber.rgb}, 0.4)` }} />
                      <span className="text-[9px]" style={{ color: `rgba(${ACCENT.slate.rgb}, 0.35)` }}>Request mentor review</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="px-5 py-3 text-[12px] font-medium cursor-pointer text-slate-400 hover:text-white transition-colors"
                      style={{ background: SURFACE.recess, borderRadius: RADIUS.pill, border: `1px solid rgba(255,255,255,0.04)` }}
                    >
                      Back
                    </button>
                    <motion.button
                      onClick={handleSubmit}
                      disabled={!isValid}
                      className="flex-1 py-3 text-[13px] font-bold text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
                      style={{
                        background: isValid ? `linear-gradient(135deg, rgba(${ACCENT.purple.rgb}, 0.9), rgba(${ACCENT.purple.rgb}, 0.7))` : `rgba(${ACCENT.slate.rgb}, 0.1)`,
                        borderRadius: RADIUS.pill,
                        border: `1px solid ${isValid ? `rgba(${ACCENT.purple.rgb}, 0.4)` : "rgba(255,255,255,0.04)"}`,
                        boxShadow: isValid ? GLOW.med(ACCENT.purple.rgb) : "none",
                      }}
                      whileHover={isValid ? { y: -1, boxShadow: GLOW.high(ACCENT.purple.rgb) } : {}}
                      whileTap={isValid ? { scale: 0.98 } : {}}
                    >
                      {isValid ? "Publish Forecast" : "Complete all required fields"}
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
