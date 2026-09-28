"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, CheckCircle, Target, Star, BarChart3, Shield, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
type StudentForecast = {
  id: number
  student: string
  level: "Advanced" | "Intermediate" | "Beginner"
  time: string
  status: "SETUP VALID" | "AGGRESSIVE" | "INVALID"
  pair: string
  forecast: string
  chartImage: string
  comments: number
  likes: number
  views: number
  accuracy: number
  winRate: number
  trades: number
  direction: "LONG" | "SHORT"
  timeframe: string
  entry: string
  stop: string
  target: string
  rr: string
  confluences: Array<{ name: string; score: number }>
  commentary: { rating: number; summary: string; confluenceAnalysis: { hit: string[]; miss: string[] }; executionReview: { entry: string; stopLoss: string; takeProfit: string }; actionPlan: string[] }
}

interface StrategicReviewTabProps {
  forecast: StudentForecast & {
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
}

// Confluence Hover Popup Component
const ConfluencePopup = ({
  children,
  confluenceName,
  strength,
  description,
}: {
  children: React.ReactNode
  confluenceName: string
  strength: number
  description: string
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 left-0 top-full mt-2 w-80 p-4 bg-black/95 border border-emerald-400/30 rounded-xl backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-emerald-400 text-sm">{confluenceName}</h4>
              <div className="flex items-center gap-2">
                <Progress value={strength * 10} className="w-16 h-2" />
                <span className="text-xs text-emerald-400 font-bold">{strength}/10</span>
              </div>
            </div>
            <p className="text-xs text-white leading-relaxed mb-3">{description}</p>
            <div className="flex items-center gap-2 text-xs">
              <Star className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">
                {strength >= 8 ? "Very Strong" : strength >= 6 ? "Strong" : "Moderate"} Confluence
              </span>
            </div>
            {/* Arrow pointer */}
            <div className="absolute -top-2 left-4 w-4 h-4 bg-black/95 border-l border-t border-emerald-400/30 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Enhanced Confluence Card with Popup
const ConfluenceCard = ({
  confluenceName,
  strength,
  description,
  index,
}: {
  confluenceName: string
  strength: number
  description: string
  index: number
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <ConfluencePopup confluenceName={confluenceName} strength={strength} description={description}>
      <motion.div
        className="group relative p-4 rounded-2xl cursor-pointer transition-all duration-500 overflow-hidden"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(139, 92, 246, 0.08) 0%, 
              rgba(59, 130, 246, 0.05) 25%,
              rgba(16, 185, 129, 0.05) 50%,
              rgba(139, 92, 246, 0.08) 100%
            )
          `,
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(139, 92, 246, 0.2)",
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.05),
            0 0 0 1px rgba(139, 92, 246, 0.05)
          `,
        }}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          delay: index * 0.1,
          duration: 0.5,
          type: "spring",
          stiffness: 100,
        }}
        whileHover={{
          scale: 1.05,
          y: -4,
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Premium particle effects */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <AnimatePresence>
            {isHovered && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, x: Math.random() * 200, y: Math.random() * 100 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: Math.random() * 200,
                      y: Math.random() * 100,
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.2,
                    }}
                    className="absolute w-1 h-1 bg-emerald-400/40 rounded-full"
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-green-500/20 border border-emerald-400/30 flex items-center justify-center backdrop-blur-sm"
            >
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400/10 to-teal-400/10"
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <div className="flex-1">
              <h4 className="text-white font-semibold text-sm group-hover:text-emerald-200 transition-colors leading-tight">
                {confluenceName}
              </h4>
              <div className="flex items-center gap-3 mt-2">
                <div className="relative w-20 h-2 bg-emerald-900/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${strength * 10}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 1 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full"
                      animate={{ x: isHovered ? ["0%", "100%"] : "0%" }}
                      transition={{ duration: 1.5, repeat: isHovered ? Number.POSITIVE_INFINITY : 0 }}
                    />
                  </motion.div>
                </div>
                <span className="text-emerald-400 font-bold text-sm font-mono">{strength}/10</span>
              </div>
            </div>
          </div>

          {/* Enhanced glow effect on hover */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            animate={{
              background: isHovered
                ? [
                    "linear-gradient(90deg, rgba(16, 185, 129, 0), rgba(16, 185, 129, 0.1), rgba(20, 184, 166, 0))",
                    "linear-gradient(90deg, rgba(20, 184, 166, 0), rgba(20, 184, 166, 0.1), rgba(16, 185, 129, 0))",
                  ]
                : "linear-gradient(90deg, rgba(16, 185, 129, 0), rgba(16, 185, 129, 0), rgba(20, 184, 166, 0))",
            }}
            transition={{ duration: 2, repeat: isHovered ? Number.POSITIVE_INFINITY : 0 }}
          />
        </div>
      </motion.div>
    </ConfluencePopup>
  )
}

const MarketStructureAnalysis = () => {
  const [hoveredStructure, setHoveredStructure] = useState<string | null>(null)

  const structures = [
    { name: "Higher Timeframe Trend", status: "Bullish", color: "emerald", strength: 94 },
    { name: "Market Structure", status: "Intact", color: "cyan", strength: 87 },
    { name: "Institutional Flow", status: "Aligned", color: "purple", strength: 91 },
    { name: "Liquidity Zones", status: "Identified", color: "blue", strength: 83 },
  ]

  return (
    <motion.div
      className="relative p-6 rounded-2xl overflow-hidden"
      style={{
        background: `
          linear-gradient(135deg, 
            rgba(139, 92, 246, 0.08) 0%, 
            rgba(59, 130, 246, 0.05) 50%,
            rgba(139, 92, 246, 0.08) 100%
          )
        `,
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(139, 92, 246, 0.2)",
        boxShadow: `
          0 12px 40px rgba(0, 0, 0, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          0 0 0 1px rgba(139, 92, 246, 0.1)
        `,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {/* Premium background particles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/20 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 20 - 10, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 via-blue-500/15 to-purple-500/20 flex items-center justify-center border border-purple-400/30"
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <BarChart3 className="w-6 h-6 text-purple-400" />
          </motion.div>
          <div>
            <h4 className="font-bold text-white text-lg">Market Structure Analysis</h4>
            <p className="text-purple-300/70 text-sm">Institutional Grade • $48M System</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {structures.map((structure, index) => (
            <motion.div
              key={structure.name}
              className={`relative p-4 rounded-xl border text-center cursor-pointer transition-all duration-500 overflow-hidden`}
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(${
                      structure.color === "emerald"
                        ? "16, 185, 129"
                        : structure.color === "cyan"
                          ? "6, 182, 212"
                          : structure.color === "purple"
                            ? "139, 92, 246"
                            : "59, 130, 246"
                    }, 0.1) 0%, 
                    rgba(${
                      structure.color === "emerald"
                        ? "16, 185, 129"
                        : structure.color === "cyan"
                          ? "6, 182, 212"
                          : structure.color === "purple"
                            ? "139, 92, 246"
                            : "59, 130, 246"
                    }, 0.05) 100%
                  )
                `,
                backdropFilter: "blur(16px)",
                border: `1px solid rgba(${
                  structure.color === "emerald"
                    ? "16, 185, 129"
                    : structure.color === "cyan"
                      ? "6, 182, 212"
                      : structure.color === "purple"
                        ? "139, 92, 246"
                        : "59, 130, 246"
                }, 0.3)`,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              onHoverStart={() => setHoveredStructure(structure.name)}
              onHoverEnd={() => setHoveredStructure(null)}
            >
              {/* Hover glow effect */}
              <motion.div
                className={`absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300`}
                style={{
                  background: `radial-gradient(circle at center, rgba(${
                    structure.color === "emerald"
                      ? "16, 185, 129"
                      : structure.color === "cyan"
                        ? "6, 182, 212"
                        : structure.color === "purple"
                          ? "139, 92, 246"
                          : "59, 130, 246"
                  }, 0.2), transparent 70%)`,
                }}
                animate={{ opacity: hoveredStructure === structure.name ? 1 : 0 }}
              />

              <div className="relative z-10">
                <div className="text-sm text-white font-semibold mb-2">{structure.name}</div>
                <div className={`text-sm font-bold mb-3 text-${structure.color}-400`}>{structure.status}</div>

                {/* Strength indicator */}
                <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r from-${structure.color}-400 to-${structure.color}-300`}
                    initial={{ width: 0 }}
                    animate={{ width: `${structure.strength}%` }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 1 }}
                  />
                </div>
                <div className="text-xs text-white/70 mt-1">{structure.strength}% confidence</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const ExecutionPlan = () => {
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null)

  const phases = [
    {
      phase: "Pre-Market Analysis",
      status: "Complete",
      details: "HTF structure confirmed, confluences identified",
      color: "emerald",
      progress: 100,
      icon: CheckCircle,
    },
    {
      phase: "Entry Execution",
      status: "Pending",
      details: "Waiting for LTF confirmation at 130.50",
      color: "amber",
      progress: 65,
      icon: Target,
    },
    {
      phase: "Risk Management",
      status: "Set",
      details: "Stop loss at 130.10, 1.5% account risk",
      color: "red",
      progress: 90,
      icon: Shield,
    },
    {
      phase: "Profit Taking",
      status: "Planned",
      details: "Multiple targets: 130.80, 131.20, 131.50",
      color: "purple",
      progress: 45,
      icon: TrendingUp,
    },
  ]

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 via-blue-500/15 to-purple-500/20 flex items-center justify-center border border-purple-400/30"
          whileHover={{ scale: 1.1, rotate: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Target className="w-6 h-6 text-purple-400" />
        </motion.div>
        <div>
          <h4 className="font-bold text-white text-lg">Enhanced Execution Plan</h4>
          <p className="text-purple-300/70 text-sm">Institutional Grade Strategy</p>
        </div>
      </div>

      {phases.map((phase, index) => {
        const Icon = phase.icon
        return (
          <motion.div
            key={phase.phase}
            className="relative p-4 rounded-xl transition-all duration-500 cursor-pointer overflow-hidden"
            style={{
              background: `
                linear-gradient(135deg, 
                  rgba(${
                    phase.color === "emerald"
                      ? "16, 185, 129"
                      : phase.color === "amber"
                        ? "245, 158, 11"
                        : phase.color === "red"
                          ? "239, 68, 68"
                          : "139, 92, 246"
                  }, 0.1) 0%, 
                  rgba(${
                    phase.color === "emerald"
                      ? "16, 185, 129"
                      : phase.color === "amber"
                        ? "245, 158, 11"
                        : phase.color === "red"
                          ? "239, 68, 68"
                          : "139, 92, 246"
                  }, 0.05) 100%
                )
              `,
              backdropFilter: "blur(16px)",
              border: `1px solid rgba(${
                phase.color === "emerald"
                  ? "16, 185, 129"
                  : phase.color === "amber"
                    ? "245, 158, 11"
                    : phase.color === "red"
                      ? "239, 68, 68"
                      : "139, 92, 246"
              }, 0.3)`,
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ x: 4, scale: 1.02 }}
            onHoverStart={() => setHoveredPhase(phase.phase)}
            onHoverEnd={() => setHoveredPhase(null)}
          >
            {/* Premium hover glow */}
            <motion.div
              className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at center, rgba(${
                  phase.color === "emerald"
                    ? "16, 185, 129"
                    : phase.color === "amber"
                      ? "245, 158, 11"
                      : phase.color === "red"
                        ? "239, 68, 68"
                        : "139, 92, 246"
                }, 0.2), transparent 70%)`,
              }}
              animate={{ opacity: hoveredPhase === phase.phase ? 1 : 0 }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${phase.color}-500/20 to-${phase.color}-400/20 flex items-center justify-center border border-${phase.color}-400/30`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className={`w-5 h-5 text-${phase.color}-400`} />
                  </motion.div>
                  <span className="text-white font-semibold">{phase.phase}</span>
                </div>
                <motion.span
                  className={`text-sm font-bold px-3 py-1 rounded-lg bg-${phase.color}-500/20 text-${phase.color}-400 border border-${phase.color}-400/30`}
                  animate={{ scale: hoveredPhase === phase.phase ? 1.05 : 1 }}
                >
                  {phase.status}
                </motion.span>
              </div>

              <p className="text-sm text-white/80 mb-3">{phase.details}</p>

              {/* Progress bar */}
              <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r from-${phase.color}-400 to-${phase.color}-300 relative`}
                  initial={{ width: 0 }}
                  animate={{ width: `${phase.progress}%` }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full"
                    animate={{ x: hoveredPhase === phase.phase ? ["0%", "100%"] : "0%" }}
                    transition={{ duration: 1.5, repeat: hoveredPhase === phase.phase ? Number.POSITIVE_INFINITY : 0 }}
                  />
                </motion.div>
              </div>
              <div className="text-xs text-white/60 mt-1 text-right">{phase.progress}% complete</div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export function StrategicReviewTab({ forecast }: StrategicReviewTabProps) {
  const confluences = [
    {
      name: "Higher Timeframe Structure",
      strength: 9,
      description:
        "Daily and weekly charts show strong bullish structure with clear higher highs and higher lows. The current pullback represents a healthy retracement within the larger uptrend, providing an optimal entry opportunity.",
    },
    {
      name: "Liquidity Sweep",
      strength: 8,
      description:
        "Recent price action swept liquidity below the previous low at 130.20, creating a classic liquidity grab scenario. This move likely triggered stop losses and provided liquidity for institutional accumulation.",
    },
    {
      name: "Inverted FVG (iFVG)",
      strength: 7,
      description:
        "An inverted Fair Value Gap formed during the recent bearish move, creating an imbalance that price is likely to return to fill. This provides a high-probability reversal zone at current levels.",
    },
    {
      name: "Weekly/Daily Open + PD",
      strength: 8,
      description:
        "Price is currently trading near the weekly open with a premium discount analysis showing we're in a discount zone. This confluence with other factors creates a strong buying opportunity.",
    },
    {
      name: "Breaker Block",
      strength: 6,
      description:
        "A breaker block formed at 130.45-130.55 level where previous resistance became support. This zone has been tested and held, indicating strong institutional interest at these levels.",
    },
    {
      name: "Order Block (OB)",
      strength: 9,
      description:
        "A strong bullish order block is present at 130.40-130.60, representing the last bearish candle before the significant bullish move. This is where institutions likely have pending orders.",
    },
    {
      name: "Power of Three (PO3)",
      strength: 7,
      description:
        "The current price action follows the Power of Three model: Accumulation (sideways), Manipulation (liquidity sweep), and now Distribution (expected bullish move) phase is beginning.",
    },
    {
      name: "Fair Value Gap (FVG)",
      strength: 8,
      description:
        "Multiple Fair Value Gaps exist above current price levels, creating magnetic zones that price is likely to fill. The nearest FVG at 130.80-131.00 aligns perfectly with our first target.",
    },
  ]

  return (
    <div className="h-full flex flex-col space-y-4">
      <motion.div
        className="flex items-center gap-2 mb-2"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div whileHover={{ rotate: 180, scale: 1.1 }} transition={{ duration: 0.3 }}>
          <Brain className="w-5 h-5 text-purple-400" />
        </motion.div>
        <h3 className="text-lg font-bold text-white">Strategic Review</h3>
      </motion.div>

      {/* Confluences Grid with Enhanced Popups */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          Technical Confluences ({confluences.length})
        </h4>
        <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
          {confluences.map((confluence, index) => (
            <ConfluenceCard
              key={confluence.name}
              confluenceName={confluence.name}
              strength={confluence.strength}
              description={confluence.description}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Market Structure Analysis */}
      <MarketStructureAnalysis />

      {/* Enhanced Execution Plan */}
      <ExecutionPlan />
    </div>
  )
}
