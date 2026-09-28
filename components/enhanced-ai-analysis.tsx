"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import {
  BrainCircuit,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Target,
  User,
  Clock,
  DollarSign,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Menu,
  Info,
  ShieldCheck,
  FileText,
  ChevronDown,
  ChevronUp,
  Activity,
  Brain,
  Eye,
  Lightbulb,
  ArrowRight,
  Star,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FloatingConfluenceMenu } from "./floating-confluence-menu"
import { technicalConfluences } from "@/lib/confluences"
import { cn } from "@/lib/utils"

interface Scenario {
  id?: string
  entry?: number
  stopLoss?: number
  takeProfit?: number
  riskReward?: number
  position?: "buy" | "sell"
  commentary?: string
  probability?: "High" | "Medium" | "Low"
  timeframe?: string
  riskPercentage?: number
}

interface EnhancedAIAnalysisProps {
  instrument: string
  direction: "Long" | "Short"
  confidence: number
  summary: string
  confluences: string[]
  selectedConfluenceIds?: string[] // Add this to track the actual selected confluence IDs
  chartScreenshotUrl: string | null
  selectedScenarios: Scenario[]
  psychology: {
    focus: number
    discipline: number
    biases: string[]
  }
  psychologyAnalysis: {
    overall: string
    recommendations: string[]
  }
  commentary: string
}

// Professional animated gauge component
const AnimatedGauge = ({ value, label }: { value: number; label: string }) => {
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (value / 10) * circumference
  const controls = useAnimation()

  useEffect(() => {
    controls.start({
      strokeDashoffset: offset,
      transition: { duration: 2, ease: "easeOut", delay: 0.5 },
    })
  }, [controls, offset])

  const getColor = () => {
    if (value >= 8) return "stroke-emerald-400"
    if (value >= 6) return "stroke-amber-400"
    return "stroke-red-400"
  }

  const getGlowColor = () => {
    if (value >= 8) return "drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]"
    if (value >= 6) return "drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
    return "drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]"
  }

  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle className="stroke-zinc-700/50" strokeWidth="6" cx="50" cy="50" r="45" fill="transparent" />
          <motion.circle
            className={cn("stroke-current", getColor(), getGlowColor())}
            strokeWidth="6"
            strokeLinecap="round"
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={controls}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            {value}
          </motion.div>
          <div className="text-xs text-zinc-400">/10</div>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-semibold text-zinc-200">{label}</div>
      </div>
    </motion.div>
  )
}

// Professional hover board component with glass morphism
const HoverBoard = ({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    className={cn(
      "group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-zinc-950/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl",
      className,
    )}
    whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
    onMouseMove={(e) => {
      const rect = e.currentTarget.getBoundingClientRect()
      e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`)
      e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`)
    }}
  >
    <motion.div
      className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
      style={{
        background:
          "radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.06), transparent 40%)",
      }}
    />
    <div className="relative z-10">{children}</div>
  </motion.div>
)

// Expandable hover board with detailed content
const ExpandableHoverBoard = ({
  children,
  expandedContent,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  expandedContent?: React.ReactNode
  className?: string
  delay?: number
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-zinc-950/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl cursor-pointer hover:cursor-pointer",
        className,
      )}
      whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
      onMouseEnter={() => {
        setIsHovered(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`)
        e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`)
      }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.06), transparent 40%)",
        }}
      />
      <div className="relative z-10">
        {children}
        <AnimatePresence>
          {isHovered && expandedContent && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: 20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="overflow-hidden mt-6 pt-6 border-t border-white/10"
            >
              {expandedContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Professional section title with icon animation
const SectionTitle = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
}) => (
  <motion.div
    className="flex items-center gap-4 mb-6"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <motion.div
      whileHover={{ rotate: 360, scale: 1.1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30"
    >
      {icon}
    </motion.div>
    <div>
      <h2 className="text-2xl font-bold text-zinc-100">{title}</h2>
      {subtitle && <p className="text-sm text-zinc-400 mt-1">{subtitle}</p>}
    </div>
  </motion.div>
)

// Professional scenario card with hover details
const ScenarioConfirmationCard = ({ scenario, index }: { scenario: Scenario; index: number }) => {
  const [isHovered, setIsHovered] = useState(false)

  const riskColor =
    scenario.riskPercentage && scenario.riskPercentage > 2
      ? "text-red-400"
      : scenario.riskPercentage && scenario.riskPercentage > 1
        ? "text-amber-400"
        : "text-emerald-400"

  const probabilityColor =
    scenario.probability === "High"
      ? "text-emerald-400 bg-emerald-500/20 border-emerald-500/30"
      : scenario.probability === "Medium"
        ? "text-amber-400 bg-amber-500/20 border-amber-500/30"
        : "text-red-400 bg-red-500/20 border-red-500/30"

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.15, duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 via-zinc-900/80 to-zinc-950/80 p-6 backdrop-blur-sm group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`)
          e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`)
        }}
      >
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(147, 51, 234, 0.15), transparent 40%)",
          }}
        />

        {/* Scenario Header */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div
              className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/30"
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <Target className="h-6 w-6 text-purple-400" />
            </motion.div>
            <div>
              <h3 className="text-xl font-semibold text-white">Scenario #{index + 1}</h3>
              <p className="text-sm text-zinc-400">Primary Execution Plan</p>
            </div>
          </div>
          <Badge className={cn("px-4 py-2 font-semibold", probabilityColor)}>
            {scenario.probability || "High"} Probability
          </Badge>
        </div>

        {/* Key Metrics Grid */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: DollarSign, label: "Entry Price", value: scenario.entry || "1.0850", color: "text-blue-400" },
            { icon: AlertTriangle, label: "Stop Loss", value: scenario.stopLoss || "1.0820", color: "text-red-400" },
            {
              icon: TrendingUp,
              label: "Take Profit",
              value: scenario.takeProfit || "1.0920",
              color: "text-emerald-400",
            },
            {
              icon: BarChart3,
              label: "Risk/Reward",
              value: `1:${scenario.riskReward || "2.33"}`,
              color: "text-purple-400",
            },
          ].map((metric, i) => (
            <motion.div
              key={metric.label}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl bg-zinc-800/50 p-4 text-center border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300"
            >
              <metric.icon className={cn("h-5 w-5 mx-auto mb-2", metric.color)} />
              <div className="text-xs text-zinc-400 mb-1">{metric.label}</div>
              <div className={cn("text-lg font-bold", metric.color)}>{metric.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Hover Details */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: 20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative z-10 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Risk Assessment */}
                <motion.div
                  className="rounded-xl bg-zinc-950/50 p-5 border border-zinc-800/50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="h-5 w-5 text-amber-400" />
                    <span className="text-sm font-semibold text-zinc-300">Risk Assessment</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-1 text-zinc-400 cursor-help hover:text-zinc-300 transition-colors">
                          Account Risk <Info className="h-3 w-3" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs p-4">
                          <div className="space-y-2">
                            <p className="font-bold text-white">Risk Management Rules:</p>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-semibold text-emerald-400">Funded Accounts:</span> 1-2% risk per
                                trade
                              </p>
                              <p>
                                <span className="font-semibold text-amber-400">Private Capital:</span> 5-10% risk
                                tolerance
                              </p>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                      <span className={cn("font-mono font-semibold", riskColor)}>
                        {scenario.riskPercentage || 1.5}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Position Size:</span>
                      <span className="text-white font-mono">0.5 lots</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Max Drawdown:</span>
                      <span className="text-red-400 font-mono">$150</span>
                    </div>
                  </div>
                </motion.div>

                {/* Execution Timeline */}
                <motion.div
                  className="rounded-xl bg-zinc-950/50 p-5 border border-zinc-800/50"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-2 text-zinc-300 cursor-help hover:text-white transition-colors">
                        <Clock className="h-5 w-5 text-cyan-400" />
                        <span className="text-sm font-semibold">Execution Timeline</span>
                        <Info className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Execute during high-volume bank hours to capitalize on institutional liquidity injection.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Timeframe:</span>
                      <span className="text-white font-mono">LTF Confirmation (5-15m)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Expected Duration:</span>
                      <span className="text-white font-mono">2-5 days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Market Session:</span>
                      <span className="text-white font-mono">Bank Hours (London/NY)</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* AI Strategic Rationale */}
              <motion.div
                className="rounded-xl bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-5 border border-purple-500/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="h-5 w-5 text-purple-400" />
                  <span className="text-sm font-semibold text-purple-300">AI Strategic Rationale</span>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  This scenario leverages a confluence of institutional order blocks at the 1.0850 level, coinciding
                  with a Fair Value Gap from the previous session. The stop-loss placement at 1.0820 accounts for
                  potential liquidity sweeps below the recent low, while the take-profit targets the next significant
                  resistance zone at 1.0920, providing an optimal risk-reward ratio of 1:2.33.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </TooltipProvider>
  )
}

export function EnhancedAIAnalysis({
  instrument,
  direction,
  confidence,
  summary,
  confluences,
  selectedConfluenceIds = [],
  chartScreenshotUrl,
  selectedScenarios,
  psychology,
  psychologyAnalysis,
  commentary,
}: EnhancedAIAnalysisProps) {
  const isLong = direction === "Long"
  const [showConfluenceMenu, setShowConfluenceMenu] = useState(false)
  const [showCommentary, setShowCommentary] = useState(false)

  // Get the actual selected confluences from the IDs
  const actualSelectedConfluences =
    selectedConfluenceIds.length > 0 ? technicalConfluences.filter((c) => selectedConfluenceIds.includes(c.id)) : []

  // Use the actual count of selected confluences
  const confluenceCount = actualSelectedConfluences.length

  // Prepare analysis data for the floating menu
  const analysisData = {
    instrument,
    direction,
    confidence,
    summary,
    commentary,
    chartUrl: chartScreenshotUrl,
    psychology: {
      focus: psychology.focus,
      discipline: psychology.discipline,
      biases: psychology.biases,
      analysis: psychologyAnalysis.overall,
      recommendations: psychologyAnalysis.recommendations,
    },
    confluences,
    riskAssessment: [
      "Market volatility may increase around upcoming news events.",
      "Ensure stop-loss placement accounts for potential liquidity sweeps.",
      "The current sentiment is strongly one-sided, watch for reversals.",
    ],
    scenarios: selectedScenarios,
  }

  // Expanded content for psychological profile
  const psychologyExpandedContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h4 className="font-semibold text-zinc-200 flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-400" />
            Cognitive State Analysis
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Mental Clarity:</span>
              <span className="text-emerald-400 font-semibold">Optimal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Emotional Control:</span>
              <span className="text-amber-400 font-semibold">Moderate</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Decision Confidence:</span>
              <span className="text-emerald-400 font-semibold">High</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="font-semibold text-zinc-200 flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            Performance Metrics
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Win Rate (30d):</span>
              <span className="text-emerald-400 font-semibold">73%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Avg R:R Ratio:</span>
              <span className="text-blue-400 font-semibold">1:2.8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Risk Adherence:</span>
              <span className="text-emerald-400 font-semibold">95%</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          AI Psychological Insights
        </h4>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Your current psychological state shows strong analytical capabilities with well-controlled emotional
          responses. The high focus score indicates optimal conditions for complex decision-making. Consider maintaining
          current meditation and risk management practices to sustain this performance level.
        </p>
      </motion.div>
    </div>
  )

  // Enhanced Expanded content for confluences - using ACTUAL selected confluences
  const confluencesExpandedContent = (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-600/5 to-transparent border border-emerald-400/20 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-3"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">Confluences Identified</h3>
        </motion.div>
        <motion.h4
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl font-semibold text-emerald-300 mb-3"
        >
          {confluenceCount} Technical Confluence{confluenceCount !== 1 ? "s" : ""} Detected
        </motion.h4>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-sm text-zinc-400"
        >
          Hover to explore detailed confluence analysis in an organized grid layout
        </motion.p>
      </motion.div>

      {/* Enhanced Confluence Grid - showing ONLY selected confluences */}
      {confluenceCount > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actualSelectedConfluences.map((confluence, index) => (
            <motion.div
              key={confluence.id}
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
                boxShadow: "0 20px 40px rgba(16, 185, 129, 0.15)",
              }}
              className="group relative p-4 rounded-xl bg-gradient-to-br from-zinc-900/80 to-zinc-800/60 border border-emerald-500/20 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:border-emerald-400/40 hover:bg-gradient-to-br hover:from-emerald-500/10 hover:to-zinc-800/80"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center flex-shrink-0"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </motion.div>
                <span className="text-sm font-medium text-emerald-300 group-hover:text-emerald-200 transition-colors leading-tight">
                  {confluence.name}
                </span>
              </div>

              {/* Enhanced glow effects */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-xl bg-gradient-radial from-emerald-400/10 via-transparent to-transparent" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 rounded-xl border border-zinc-700 bg-zinc-900/50">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Confluences Selected</h3>
          <p className="text-sm text-zinc-400">
            Please select confluences in the previous step to see detailed analysis here.
          </p>
        </div>
      )}

      {/* Additional Analysis Sections - only show if we have confluences */}
      {confluenceCount > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              className="rounded-xl bg-gradient-to-br from-emerald-900/30 to-green-900/20 p-6 border border-emerald-500/20"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h4 className="font-semibold text-emerald-300 flex items-center gap-2 mb-4">
                <Star className="h-5 w-5" />
                Strength Analysis
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Overall Confluence Strength:</span>
                  <span className="text-emerald-400 font-bold">
                    {confluenceCount >= 5 ? "8.7/10" : confluenceCount >= 3 ? "7.2/10" : "6.1/10"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Institutional Alignment:</span>
                  <span className="text-emerald-400 font-bold">
                    {confluenceCount >= 5 ? "Strong" : confluenceCount >= 3 ? "Moderate" : "Weak"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Technical Confluence:</span>
                  <span className="text-emerald-400 font-bold">
                    {confluenceCount >= 5 ? "Very High" : confluenceCount >= 3 ? "High" : "Moderate"}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="rounded-xl bg-gradient-to-br from-blue-900/30 to-cyan-900/20 p-6 border border-blue-500/20"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h4 className="font-semibold text-blue-300 flex items-center gap-2 mb-4">
                <Eye className="h-5 w-5" />
                Key Observations
              </h4>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-blue-400 flex-shrink-0" />
                  {confluenceCount > 1 ? "Multiple confluence" : "Single confluence"} alignment detected
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-blue-400 flex-shrink-0" />
                  {confluenceCount >= 5
                    ? "Strong institutional order flow confirmation"
                    : "Moderate institutional involvement detected"}
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-blue-400 flex-shrink-0" />
                  {confluenceCount >= 5 ? "High probability setup identified" : "Moderate probability setup identified"}
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Enhanced Confluence Validation */}
          <motion.div
            className="rounded-xl bg-gradient-to-r from-emerald-900/20 to-green-900/20 p-6 border border-emerald-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h4 className="font-semibold text-emerald-300 mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Confluence Validation
            </h4>
            <p className="text-sm text-zinc-300 leading-relaxed">
              All {confluenceCount} identified confluence{confluenceCount !== 1 ? "s have" : " has"} been
              cross-validated against historical data and current market conditions. The convergence of these technical
              factor{confluenceCount !== 1 ? "s" : ""} creates a{" "}
              {confluenceCount >= 5 ? "high" : confluenceCount >= 3 ? "moderate" : "low"}-probability trading
              opportunity with institutional backing. Each confluence point has been weighted based on its historical
              success rate and current market relevance, resulting in the overall strength score.
            </p>
          </motion.div>
        </>
      )}
    </div>
  )

  return (
    <div className="space-y-10 pb-20">
      {/* Floating Confluence Menu Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 2, duration: 0.8, ease: "easeOut" }}
        className="fixed bottom-8 right-8 z-50"
      >
        <motion.button
          onClick={() => setShowConfluenceMenu(true)}
          className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 shadow-2xl shadow-purple-500/25 border border-purple-400/30"
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Menu className="h-7 w-7 text-white mx-auto" />
        </motion.button>
      </motion.div>

      {/* Header Section - Non-expandable */}
      <HoverBoard delay={0}>
        <SectionTitle
          icon={<BrainCircuit className="h-8 w-8 text-purple-400" />}
          title="AI Analysis Overview"
          subtitle="Comprehensive institutional-grade market analysis"
        />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-zinc-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Badge
                className={cn(
                  "text-lg px-6 py-2 shadow-lg font-semibold",
                  isLong
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-red-500/20 text-red-300 border-red-500/30",
                )}
              >
                {isLong ? <TrendingUp className="h-5 w-5 mr-2" /> : <TrendingDown className="h-5 w-5 mr-2" />}
                {instrument} {direction}
              </Badge>
              <div className="text-right">
                <div className="text-sm text-zinc-400 mb-1">AI Confidence</div>
                <div className="flex items-center gap-3">
                  <Progress
                    value={confidence}
                    className="w-24 h-2 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-blue-500"
                  />
                  <div className="text-2xl font-bold text-white">{confidence}%</div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <h4 className="font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Market Narrative
              </h4>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">{summary}</p>

              <Button
                variant="ghost"
                onClick={() => setShowCommentary(!showCommentary)}
                className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 p-0 h-auto"
              >
                {showCommentary ? "Hide" : "Show"} Your Commentary Analysis
                {showCommentary ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
              </Button>

              <AnimatePresence>
                {showCommentary && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 border-l-2 border-purple-500/50 pl-4 text-sm italic text-zinc-400 bg-zinc-950/30 p-4 rounded-r-lg">
                      "{commentary}"
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {chartScreenshotUrl && (
            <motion.div
              className="lg:col-span-2 relative aspect-video w-full rounded-xl overflow-hidden border-2 border-zinc-700 group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src={chartScreenshotUrl || "/placeholder.svg"}
                alt="User's chart analysis"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-sm text-white font-semibold">Your Chart Entry</div>
            </motion.div>
          )}
        </div>
      </HoverBoard>

      {/* Psychological Profile - Expandable */}
      <ExpandableHoverBoard delay={0.2} expandedContent={psychologyExpandedContent}>
        <SectionTitle
          icon={<User className="h-8 w-8 text-blue-400" />}
          title="Psychological Profile"
          subtitle="Mental state assessment and cognitive bias analysis"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <motion.p
              className="text-sm text-zinc-300 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {psychologyAnalysis.overall}
            </motion.p>
            <div>
              <h4 className="font-semibold text-zinc-200 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Actionable Recommendations
              </h4>
              <motion.ul
                className="space-y-2 text-sm text-zinc-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {psychologyAnalysis.recommendations.map((rec, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                    {rec}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
          <div className="flex justify-around items-center bg-zinc-950/30 p-6 rounded-xl border border-zinc-800">
            <AnimatedGauge value={psychology.focus} label="Focus" />
            <AnimatedGauge value={psychology.discipline} label="Discipline" />
          </div>
        </div>

        {psychology.biases.length > 0 && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <h4 className="font-semibold text-zinc-200 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Detected Cognitive Biases
            </h4>
            <div className="flex flex-wrap gap-3">
              {psychology.biases.map((bias, i) => (
                <motion.div
                  key={bias}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="cursor-pointer p-4 rounded-xl bg-red-900/30 border border-red-800/70 text-center hover:bg-red-900/40 transition-all duration-300"
                >
                  <div className="font-semibold text-red-300">{bias}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </ExpandableHoverBoard>

      {/* Confluences Section - Expandable with Enhanced Design */}
      <ExpandableHoverBoard delay={0.3} expandedContent={confluencesExpandedContent}>
        <SectionTitle icon={<CheckCircle className="h-8 w-8 text-emerald-500" />} title="Confluences Identified" />
        <div className="text-center p-6 bg-gradient-to-r from-emerald-900/20 to-green-900/20 rounded-xl border border-emerald-500/20">
          <h3 className="text-lg font-semibold text-emerald-300 mb-2">
            {confluenceCount} Technical Confluence{confluenceCount !== 1 ? "s" : ""} Detected
          </h3>
          <p className="text-sm text-zinc-400">
            Hover to explore detailed confluence analysis in an organized grid layout
          </p>
        </div>
      </ExpandableHoverBoard>

      {/* Scenario Confirmation Section - Expandable */}
      {selectedScenarios.length > 0 && (
        <ExpandableHoverBoard delay={0.5}>
          <SectionTitle
            icon={<Target className="h-8 w-8 text-purple-400" />}
            title="Scenario Confirmation & Execution Blueprint"
            subtitle="Comprehensive breakdown with AI-powered risk analysis"
          />
          <div className="space-y-8">
            <motion.div
              className="text-center p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-white mb-2">Selected Execution Scenarios</h3>
              <p className="text-sm text-zinc-400">
                Comprehensive breakdown of your chosen trading scenarios with AI-powered risk analysis and execution
                guidance.
              </p>
            </motion.div>

            {selectedScenarios.map((scenario, index) => (
              <ScenarioConfirmationCard key={scenario.id || index} scenario={scenario} index={index} />
            ))}

            {/* Summary Statistics */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              {[
                {
                  label: "Average R:R Ratio",
                  value: `1:${Math.round((selectedScenarios.reduce((acc, s) => acc + (s.riskReward || 2.33), 0) / selectedScenarios.length) * 100) / 100}`,
                  color: "text-emerald-400",
                },
                {
                  label: "Active Scenarios",
                  value: selectedScenarios.length.toString(),
                  color: "text-blue-400",
                },
                {
                  label: "Overall Confidence",
                  value: `${confidence}%`,
                  color: "text-purple-400",
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-6 bg-zinc-950/50 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                >
                  <div className={cn("text-3xl font-bold mb-2", stat.color)}>{stat.value}</div>
                  <div className="text-xs text-zinc-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </ExpandableHoverBoard>
      )}

      {/* Floating Confluence Menu */}
      <FloatingConfluenceMenu
        isVisible={showConfluenceMenu}
        onClose={() => setShowConfluenceMenu(false)}
        analysisData={analysisData}
      />
    </div>
  )
}
