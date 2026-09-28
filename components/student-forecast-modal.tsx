"use client"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type React from "react"
import { X, TrendingUp, TrendingDown, User, Trophy, Brain, Target, Edit3, Bell, Save } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { StudentForecast } from "./student-forecast-system"
import { StrategicReviewTab } from "./strategic-review-tab"
import { PsychologicalProfileTab } from "./psychological-profile-tab"
import { StudentOriginalAnalysis } from "./student-original-analysis"
import { AiClarificationPanel } from "./ai-clarification-panel"
import { KeyInsightsPanel } from "./key-insights-panel"
import { ForecastNotificationView } from "./forecast-notification-view"
import { allAnalysisData } from "@/lib/analysis-data"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface StudentForecastModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  forecast: StudentForecast | null
}

// Enhanced forecast data structure to include analysis details
interface EnhancedForecast extends StudentForecast {
  analysisData?: {
    confluences: string[]
    psychology: {
      focus: number
      discipline: number
      biases: string[]
    }
    executionDetails: {
      entry: string
      stopLoss: string
      takeProfit: string
      riskReward: string
      timeframe: string
      duration: string
      session: string
    }
    aiStrategicRationale: string
  }
}

// Calculate AI execution score based on confluences and psychology
function calculateExecutionScore(
  confluences: string[],
  psychology: { focus: number; discipline: number; biases: string[] },
): number {
  const baseScore = 5.0
  const confluenceScore = Math.min(3, confluences.length * 0.5)
  const avgPsychScore = (psychology.focus + psychology.discipline) / 2
  const psychologyScore = (avgPsychScore / 10) * 2
  const negativeBiases = psychology.biases.filter((bias) =>
    ["FOMO", "Overconfidence", "Revenge Trading", "Confirmation Bias"].includes(bias),
  )
  const biasPenalty = negativeBiases.length * 0.5
  const finalScore = Math.max(1.0, Math.min(10.0, baseScore + confluenceScore + psychologyScore - biasPenalty))
  return Math.round(finalScore * 10) / 10
}

// Glass Morphism HoverBoard component
const GlassHoverBoard = ({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl",
        "bg-black/40 hover:bg-black/50 transition-all duration-500",
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        scale: 1.02,
        y: -4,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
    >
      {/* Glass reflection effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 50%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Subtle border glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl border border-white/20 opacity-0 transition-opacity duration-300"
        style={{ opacity: isHovered ? 1 : 0 }}
      />

      <div className="relative z-10 p-4">{children}</div>
    </motion.div>
  )
}

// Enhanced Tab Navigation with Edit Mode
const TabNavigation = ({
  activeTab,
  setActiveTab,
  isEditMode,
  setIsEditMode,
}: {
  activeTab: string
  setActiveTab: (tab: string) => void
  isEditMode: boolean
  setIsEditMode: (edit: boolean) => void
}) => {
  const tabs = [
    { id: "notification", label: "Forecast Alert", icon: Bell },
    { id: "strategic", label: "Strategic Review", icon: Target },
    { id: "psychology", label: "Psychology", icon: Brain },
  ]

  return (
    <div className="flex items-center gap-2">
      <div className="flex bg-black/30 rounded-xl p-1 border border-white/10 backdrop-blur-sm flex-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300",
              activeTab === tab.id
                ? "bg-purple-500/30 text-white shadow-lg backdrop-blur-sm border border-purple-400/30"
                : "text-white hover:text-white hover:bg-white/10",
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <tab.icon className="w-4 h-4 text-purple-400" />
            <span className="text-white">{tab.label}</span>
          </motion.button>
        ))}
      </div>

      <motion.button
        onClick={() => setIsEditMode(!isEditMode)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 border",
          isEditMode
            ? "bg-emerald-500/20 text-white border-emerald-400/30 hover:bg-emerald-500/30"
            : "bg-purple-500/20 text-white border-purple-400/30 hover:bg-purple-500/30",
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isEditMode ? (
          <>
            <Save className="w-4 h-4 text-purple-400" />
            <span className="text-white">Save</span>
          </>
        ) : (
          <>
            <Edit3 className="w-4 h-4 text-purple-400" />
            <span className="text-white">Edit</span>
          </>
        )}
      </motion.button>
    </div>
  )
}

// Compact Modal Header
const ModalHeader = ({ forecast, score }: { forecast: EnhancedForecast; score: number }) => {
  const isLong = forecast.direction === "LONG"
  const scoreColor = score >= 8 ? "text-emerald-400" : score >= 6 ? "text-purple-400" : "text-red-400"

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden bg-black/60 backdrop-blur-xl border-b border-white/10"
    >
      <div className="relative flex justify-between items-center p-4">
        <div className="flex items-center gap-4">
          <motion.div
            className="w-12 h-12 rounded-xl bg-black/60 border border-white/20 flex items-center justify-center shadow-xl backdrop-blur-sm"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <User className="w-6 h-6 text-purple-400" />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Post-Forecast Debrief</h2>
            <p className="text-zinc-400 text-sm">
              Analysis of <span className="text-purple-400 font-semibold">{forecast.student}'s</span> Forecast
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge
            className={cn(
              "px-4 py-2 font-bold border backdrop-blur-sm",
              isLong
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-red-500/20 text-red-300 border-red-500/40",
            )}
          >
            {isLong ? (
              <TrendingUp className="w-4 h-4 mr-2 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-2 text-red-400" />
            )}
            <span className="text-white">
              {forecast.pair} {forecast.direction}
            </span>
          </Badge>

          <motion.div
            className="text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="flex items-center gap-1 mb-1">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-white uppercase tracking-wider font-semibold">AI Score</span>
            </div>
            <div className={cn("text-3xl font-bold tracking-tighter", scoreColor)}>{score.toFixed(1)}</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export function StudentForecastModal({ isOpen, onOpenChange, forecast }: StudentForecastModalProps) {
  const [activeTab, setActiveTab] = useState("notification")
  const [isEditMode, setIsEditMode] = useState(false)

  if (!forecast) return null

  const enhancedForecast: EnhancedForecast = {
    ...forecast,
    analysisData: {
      confluences: [
        "Fair Value Gap (FVG)",
        "Order Block",
        "Liquidity Sweep",
        "Weekly Open",
        "Pivot Lines",
        "BPR Resistance",
      ],
      psychology: {
        focus: 8,
        discipline: 7,
        biases: ["Confirmation Bias", "Overconfidence"],
      },
      executionDetails: {
        entry: "Pending retest of imbalance edge with LTF confirmation",
        stopLoss: "Beyond invalidation wick with 15-pip buffer",
        takeProfit: "Next major liquidity pool / 1:3 RR minimum",
        riskReward: "1:3",
        timeframe: "4H - Daily",
        duration: "2-5 days",
        session: "London/NY Overlap",
      },
      aiStrategicRationale:
        "This scenario leverages a confluence of institutional order blocks at the 1.0850 level, coinciding with a Fair Value Gap from the previous session. The stop-loss placement at 1.0820 accounts for potential liquidity sweeps below the recent low, while the take-profit targets the next significant resistance zone at 1.0920, providing an optimal risk-reward ratio of 1:2.33.",
    },
  }

  const executionScore = calculateExecutionScore(
    enhancedForecast.analysisData?.confluences || [],
    enhancedForecast.analysisData?.psychology || { focus: 5, discipline: 5, biases: [] },
  )

  const relevantConfluences = allAnalysisData.filter(
    (item) => item.relevantPairs && (item.relevantPairs.includes("GBPUSD") || item.relevantPairs.includes("EURUSD")),
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50"
          />
          <DialogContent className="max-w-[98vw] w-full h-[95vh] bg-transparent border-0 text-white p-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full h-full bg-black/60 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden"
            >
              <div className="flex-shrink-0">
                <ModalHeader forecast={enhancedForecast} score={executionScore} />
              </div>

              <div className="flex-1 p-3 overflow-hidden">
                <div className="grid grid-cols-12 gap-3 h-full">
                  {/* Left Column: Student's Analysis */}
                  <motion.div
                    className="col-span-4 h-full"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <GlassHoverBoard delay={0.1} className="h-full">
                      <StudentOriginalAnalysis forecast={enhancedForecast} isEditMode={isEditMode} />
                    </GlassHoverBoard>
                  </motion.div>

                  {/* Center Column: AI Analysis */}
                  <motion.div
                    className="col-span-5 h-full flex flex-col gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    {/* AI Analysis with Tabs */}
                    <GlassHoverBoard delay={0.2} className="flex-1">
                      <div className="space-y-3 h-full flex flex-col">
                        <TabNavigation
                          activeTab={activeTab}
                          setActiveTab={setActiveTab}
                          isEditMode={isEditMode}
                          setIsEditMode={setIsEditMode}
                        />

                        <div className="flex-1 overflow-hidden">
                          <AnimatePresence mode="wait">
                            {activeTab === "notification" && (
                              <motion.div
                                key="notification"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="h-full"
                              >
                                <ForecastNotificationView forecast={enhancedForecast} />
                              </motion.div>
                            )}
                            {activeTab === "strategic" && (
                              <motion.div
                                key="strategic"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="h-full"
                              >
                                <StrategicReviewTab
                                  forecast={enhancedForecast}
                                  confluences={relevantConfluences}
                                  executionScore={executionScore}
                                />
                              </motion.div>
                            )}
                            {activeTab === "psychology" && (
                              <motion.div
                                key="psychology"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="h-full"
                              >
                                <PsychologicalProfileTab psychologyData={enhancedForecast.analysisData?.psychology} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </GlassHoverBoard>
                  </motion.div>

                  {/* Right Column: Key Insights + AI Assistant */}
                  <motion.div
                    className="col-span-3 h-full flex flex-col gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    {/* Key Insights */}
                    <GlassHoverBoard delay={0.4} className="flex-1">
                      <KeyInsightsPanel forecast={enhancedForecast} />
                    </GlassHoverBoard>

                    {/* AI Assistant Below Key Insights */}
                    <GlassHoverBoard delay={0.5} className="h-64">
                      <AiClarificationPanel />
                    </GlassHoverBoard>
                  </motion.div>
                </div>
              </div>

              <motion.button
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 border border-white/20 text-zinc-400 hover:text-white hover:bg-black/80 transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
