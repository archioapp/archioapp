"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, TrendingUp, Clock, Globe, Target, Brain, History, Download, Maximize2, Droplets, Save, Send } from "lucide-react"
import type { Instrument } from "@/lib/instruments"
import { multiTimeframeAnalysisEngine, type MultiTimeframeAnalysis } from "@/lib/multi-timeframe-analysis"
import { sessionAnalysisEngine, type SessionAnalysis } from "@/lib/session-analysis"
import { liquidityAnalysisEngine, type LiquidityAnalysis } from "@/lib/liquidity-analysis"
import { macroAnalysisEngine, type MacroAnalysis } from "@/lib/macro-analysis"
import { MultiTimeframeDisplay } from "@/components/multi-timeframe-display"
import { SessionAnalysisDisplay } from "@/components/session-analysis-display"
import { LiquidityAnalysisDisplay } from "@/components/liquidity-analysis-display"
import { MacroAnalysisDisplay } from "@/components/macro-analysis-display"
import { StrategicReviewTab } from "@/components/strategic-review-tab"
import { analysisHistoryManager } from "@/lib/analysis-history"


interface PremiumChartAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  activeInstrument: Instrument
}

export function PremiumChartAnalysisModal({ isOpen, onClose, activeInstrument }: PremiumChartAnalysisModalProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [analysis, setAnalysis] = useState<MultiTimeframeAnalysis | null>(null)
  const [sessionAnalysis, setSessionAnalysis] = useState<SessionAnalysis | null>(null)
  const [liquidityAnalysis, setLiquidityAnalysis] = useState<LiquidityAnalysis | null>(null)
  const [macroAnalysis, setMacroAnalysis] = useState<MacroAnalysis | null>(null)
  // Added state for save functionality
  const [isSaving, setIsSaving] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveForm, setSaveForm] = useState({ name: "", description: "", tags: "" })
  // State for Submit Forecast sheet
  const [showForecastSheet, setShowForecastSheet] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      setAnalysis(null)
      setSessionAnalysis(null)
      setLiquidityAnalysis(null)
      setMacroAnalysis(null)

      Promise.all([
        multiTimeframeAnalysisEngine.analyzeMultiTimeframe(activeInstrument.symbol),
        sessionAnalysisEngine.analyzeSessionData(activeInstrument.symbol),
        liquidityAnalysisEngine.analyzeLiquidity(activeInstrument.symbol),
        macroAnalysisEngine.analyzeMacroeconomics(activeInstrument.symbol),
      ])
        .then(([mtfResult, sessionResult, liquidityResult, macroResult]) => {
          setAnalysis(mtfResult)
          setSessionAnalysis(sessionResult)
          setLiquidityAnalysis(liquidityResult)
          setMacroAnalysis(macroResult)
          setIsLoading(false)

          // Auto-populate save form
          setSaveForm({
            name: `${activeInstrument.symbol} Analysis - ${new Date().toLocaleDateString()}`,
            description: `Comprehensive analysis including ${mtfResult.confluence.overallBias} bias with ${mtfResult.confluence.confidence}% confidence`,
            tags: `${activeInstrument.symbol}, ${mtfResult.confluence.overallBias}, analysis`,
          })
        })
        .catch((error) => {
          console.error("Analysis failed:", error)
          setIsLoading(false)
        })
    }
  }, [isOpen, activeInstrument])

  // Added save functionality
  const handleSaveAnalysis = async () => {
    if (!analysis || !sessionAnalysis || !liquidityAnalysis || !macroAnalysis) return

    setIsSaving(true)
    try {
      const tags = saveForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)

      await analysisHistoryManager.saveAnalysis(
        activeInstrument.symbol,
        saveForm.name,
        saveForm.description,
        analysis,
        sessionAnalysis,
        liquidityAnalysis,
        macroAnalysis,
        tags,
      )

      setShowSaveDialog(false)
      // Show success feedback
    } catch (error) {
      console.error("Failed to save analysis:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: "overview", label: "Multi-Timeframe", icon: TrendingUp },
    { id: "sessions", label: "Sessions", icon: Clock },
    { id: "liquidity", label: "Liquidity", icon: Droplets },
    { id: "macro", label: "Macro", icon: Globe },
    { id: "levels", label: "Levels", icon: Target },
    { id: "structure", label: "Structure", icon: Brain },
    { id: "history", label: "History", icon: History },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(4px)" }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 12 }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="w-full max-w-7xl h-[92vh] relative flex flex-col"
          >
            {/* Premium Container -- dark, dense, institutional */}
            <div
              className="h-full rounded-2xl border border-white/[0.06] shadow-2xl shadow-black/80 overflow-hidden flex flex-col"
              style={{
                background: "linear-gradient(180deg, #0d0f15 0%, #0a0c12 100%)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04] flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center border border-white/[0.06]">
                    <TrendingUp className="w-4 h-4 text-white/50" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-white/90 tracking-wide">
                        Chart Analysis
                      </h2>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/15 text-[8px] font-mono font-bold text-emerald-400/70 uppercase tracking-wider">Pro</span>
                    </div>
                    <p className="text-[10px] text-white/30 font-mono tracking-wider mt-0.5">
                      {activeInstrument.symbol} <span className="text-white/15 mx-1">|</span> Institutional Grade
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Submit Forecast */}
                  <button
                    onClick={() => setShowForecastSheet(true)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white/80 uppercase tracking-wider transition-all duration-200 hover:bg-white/[0.06] border border-white/[0.06] bg-white/[0.03]"
                  >
                    <Send className="w-3 h-3" />
                    Forecast
                  </button>
                  <button onClick={() => setShowSaveDialog(true)} disabled={isLoading}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/25 hover:text-white/50 hover:bg-white/[0.04] border border-white/[0.04] transition-all">
                    <Save className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center text-white/25 hover:text-white/50 hover:bg-white/[0.04] border border-white/[0.04] transition-all">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center text-white/25 hover:text-white/50 hover:bg-white/[0.04] border border-white/[0.04] transition-all">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/25 hover:text-white/50 hover:bg-white/[0.04] border border-white/[0.04] transition-all hover:text-red-400/70 hover:border-red-400/15">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Tab Navigation -- dense, tight, institutional */}
              <div className="flex items-center gap-0 px-2 border-b border-white/[0.04] flex-shrink-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-1.5 px-3 py-2.5 transition-all duration-200 whitespace-nowrap ${
                        isActive
                          ? "text-white/90"
                          : "text-white/30 hover:text-white/55 hover:bg-white/[0.02]"
                      }`}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em]">{tab.label}</span>
                      {isActive && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-white/50" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Content Area */}
              <div className="flex-1 px-4 py-4 overflow-y-auto min-h-0" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.06) transparent" }}>
                <div className="space-y-4">
                  {activeTab === "overview" && <MultiTimeframeDisplay analysis={analysis} isLoading={isLoading} />}

                  {activeTab === "sessions" && (
                    <SessionAnalysisDisplay analysis={sessionAnalysis} isLoading={isLoading} />
                  )}

                  {activeTab === "liquidity" && (
                    <LiquidityAnalysisDisplay analysis={liquidityAnalysis} isLoading={isLoading} />
                  )}

                  {activeTab === "macro" && <MacroAnalysisDisplay analysis={macroAnalysis} isLoading={isLoading} />}

                  {activeTab === "structure" && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                      <StrategicReviewTab
                        forecast={{
                          id: "premium-analysis",
                          symbol: activeInstrument.symbol,
                          direction: analysis?.confluence.overallBias || "neutral",
                          confidence: analysis?.confluence.confidence || 50,
                          timeframe: "Multi-TF",
                          createdAt: new Date(),
                          analysisData: {
                            confluences: analysis?.weekly.keyLevels.map((l) => l.type) || [],
                            psychology: {
                              focus: 85,
                              discipline: 90,
                              biases: ["Confirmation Bias", "Anchoring"],
                            },
                            executionDetails: {
                              entry: "Market Order",
                              stopLoss: "2% below entry",
                              takeProfit: "Multiple targets",
                              riskReward: "1:3",
                              timeframe: "4H-Daily",
                              duration: "3-5 days",
                              session: "London/NY Overlap",
                            },
                            aiStrategicRationale: "High-probability setup with multiple confluences",
                          },
                        }}
                      />
                    </motion.div>
                  )}

                  {activeTab === "levels" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
                          <Target className="w-5 h-5 text-white/30" />
                        </div>
                        <h3 className="text-sm font-bold text-white/60 mb-1 tracking-wide">Advanced Levels Analysis</h3>
                        <p className="text-[10px] text-white/25 font-mono uppercase tracking-wider">HTF Key Zones & Institutional Levels</p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "history" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
                          <History className="w-5 h-5 text-white/30" />
                        </div>
                        <h3 className="text-sm font-bold text-white/60 mb-1 tracking-wide">Analysis History</h3>
                        <p className="text-[10px] text-white/25 font-mono uppercase tracking-wider">Past analyses & performance tracking</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Save dialog */}
          {showSaveDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#0d0f15] border border-white/[0.06] rounded-xl p-5 w-full max-w-md shadow-2xl shadow-black/60"
              >
                <h3 className="text-sm font-bold text-white/80 mb-4 tracking-wide">Save Analysis</h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-white/35 font-mono uppercase tracking-wider mb-1.5">Name</label>
                    <input
                      type="text"
                      value={saveForm.name}
                      onChange={(e) => setSaveForm({ ...saveForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs text-white/80 placeholder-white/20 focus:outline-none focus:border-white/[0.12] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/35 font-mono uppercase tracking-wider mb-1.5">Description</label>
                    <textarea
                      value={saveForm.description}
                      onChange={(e) => setSaveForm({ ...saveForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs text-white/80 placeholder-white/20 focus:outline-none focus:border-white/[0.12] transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/35 font-mono uppercase tracking-wider mb-1.5">Tags</label>
                    <input
                      type="text"
                      value={saveForm.tags}
                      onChange={(e) => setSaveForm({ ...saveForm, tags: e.target.value })}
                      placeholder="EUR/USD, bullish, high-confidence"
                      className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs text-white/80 placeholder-white/20 focus:outline-none focus:border-white/[0.12] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-5">
                  <button
                    onClick={handleSaveAnalysis}
                    disabled={isSaving || !saveForm.name.trim()}
                    className="flex-1 px-4 py-2 rounded-lg text-[10px] font-bold text-white/80 uppercase tracking-wider bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] transition-all disabled:opacity-30"
                  >
                    {isSaving ? "Saving..." : "Save Analysis"}
                  </button>
                  <button
                    onClick={() => setShowSaveDialog(false)}
                    className="px-4 py-2 text-[10px] text-white/30 hover:text-white/60 transition-colors uppercase tracking-wider font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
)}


  </motion.div>
  )}
  </AnimatePresence>
  )
  }
