"use client"

import type React from "react"

import {
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Globe,
  Rocket,
  XCircle,
  ChevronDown,
  Bot,
  Scale,
  Clock,
  Zap,
  Target,
  ShieldAlert,
  TrendingUp,
  Info,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { TradeState } from "./types"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface PreFlightAnalysisProps {
  tradeState: TradeState
  onAbort: () => void
  onExecute: () => void
}

const ScoreGauge = ({ score }: { score: number }) => {
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (score / 100) * circumference
  const color = score > 75 ? "text-green-400" : score > 50 ? "text-yellow-400" : "text-red-400"

  return (
    <div className="relative h-28 w-28">
      <svg className="h-full w-full" viewBox="0 0 100 100">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle className="stroke-current text-zinc-700/50" strokeWidth="5" cx="50" cy="50" r="45" fill="transparent" />
        <motion.circle
          className={`stroke-current ${color}`}
          strokeWidth="5"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: "url(#glow)" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-3xl font-bold tracking-tighter ${color}`}>{score}</span>
      </div>
    </div>
  )
}

const DetailPill = ({
  label,
  value,
  status,
}: { label: string; value: string; status: "success" | "warning" | "danger" | "neutral" }) => {
  const statusClasses = {
    success: "border-green-500/50 bg-green-500/10 text-green-300",
    warning: "border-yellow-500/50 bg-yellow-500/10 text-yellow-300",
    danger: "border-red-500/50 bg-red-500/10 text-red-300",
    neutral: "border-zinc-500/50 bg-zinc-500/10 text-zinc-300",
  }
  return (
    <div
      className={cn("flex justify-between items-center rounded-full border px-3 py-1 text-xs", statusClasses[status])}
    >
      <span className="font-semibold">{label}:</span>
      <span>{value}</span>
    </div>
  )
}

const AnalysisDetailItem = ({
  icon: Icon,
  title,
  status,
  description,
  details,
}: {
  icon: React.ElementType
  title: string
  status: "success" | "warning" | "danger"
  description: string
  details: React.ReactNode
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const config = {
    success: {
      color: "border-green-500/50",
      iconColor: "text-green-400",
      glow: "hover:shadow-[0_0_15px_rgba(74,222,128,0.3)]",
    },
    warning: {
      color: "border-yellow-500/50",
      iconColor: "text-yellow-400",
      glow: "hover:shadow-[0_0_15px_rgba(250,204,21,0.3)]",
    },
    danger: {
      color: "border-red-500/50",
      iconColor: "text-red-400",
      glow: "hover:shadow-[0_0_15px_rgba(248,113,113,0.3)]",
    },
  }
  const StatusIcon = status === "success" ? CheckCircle2 : status === "warning" ? ShieldAlert : XCircle

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-slate-800/50 p-4 transition-all duration-300 hover:bg-slate-800",
        config[status].color,
        config[status].glow,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-zinc-400" />
          <h5 className="font-medium text-white">{title}</h5>
        </div>
        <StatusIcon className={`h-5 w-5 flex-shrink-0 ${config[status].iconColor}`} />
      </div>
      <p className="mt-2 pl-8 text-sm text-zinc-400 transition-colors duration-300 group-hover:text-zinc-200">
        {description}
      </p>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: "16px" }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="pl-8"
          >
            <div className="space-y-2 border-l-2 border-luxury-gold/30 pl-4 text-sm text-zinc-300">{details}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const AnalysisSection = ({
  icon: Icon,
  title,
  score,
  children,
  delay = 0,
}: {
  icon: React.ElementType
  title: string
  score: number
  children: React.ReactNode
  delay?: number
}) => {
  const color = score > 75 ? "text-green-400" : score > 50 ? "text-yellow-400" : "text-red-400"
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.15 }}
    >
      <Collapsible defaultOpen className="rounded-xl border border-zinc-800 bg-slate-900/70 backdrop-blur-sm">
        <CollapsibleTrigger className="group w-full p-4 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Icon className="h-7 w-7 text-luxury-gold" />
              <h4 className="text-lg font-bold text-white">{title}</h4>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-bold ${color}`}>{score}/100</span>
              <ChevronDown className="h-5 w-5 text-zinc-400 transition-transform duration-300 group-data-[state=open]:rotate-180" />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t border-zinc-800 p-4">
          <div className="space-y-3">{children}</div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  )
}

const AIVerdict = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay * 0.15 }}
    className="mt-4 rounded-xl border-2 border-luxury-gold/30 bg-gradient-to-b from-slate-800/50 to-slate-900/50 p-6 backdrop-blur-sm"
  >
    <div className="flex items-center gap-4">
      <Bot className="h-10 w-10 flex-shrink-0 text-luxury-gold" />
      <h3 className="text-xl font-bold text-white">AI Final Verdict & Strategic Recommendation</h3>
    </div>
    <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <h4 className="mb-3 font-semibold text-green-400">Bullish Factors</h4>
        <ul className="space-y-2 text-sm text-zinc-300">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
            <span>
              <strong>HTF Alignment:</strong> Strong bullish conviction across Daily and H4 charts.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
            <span>
              <strong>Optimal R:R:</strong> Setup offers a statistically favorable 1:3.2 Risk-to-Reward.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
            <span>
              <strong>Psychological State:</strong> Calm and objective mindset detected.
            </span>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="mb-3 font-semibold text-red-400">Bearish Factors</h4>
        <ul className="space-y-2 text-sm text-zinc-300">
          <li className="flex items-start gap-2">
            <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
            <span>
              <strong>Macro Headwinds:</strong> Risk-off sentiment could invalidate bullish technicals.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
            <span>
              <strong>Resistance Proximity:</strong> Entry is close to a major weekly resistance zone.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
            <span>
              <strong>Liquidity Pool:</strong> Major liquidity pool at previous day's low remains untapped.
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div className="mt-6 border-t border-zinc-700 pt-4">
      <div className="flex flex-col items-center text-center">
        <Info className="h-6 w-6 text-luxury-gold mb-2" />
        <p className="text-sm font-bold text-white">AI Strategic Recommendation</p>
        <p className="text-sm italic text-zinc-400 mt-1">
          Proceed with reduced risk. The strong technicals are challenged by significant macro pressure.
        </p>
        <div className="mt-3 space-y-1 text-xs text-zinc-300">
          <p>
            <strong>Primary Action:</strong> Reduce position size by 25-30%.
          </p>
          <p>
            <strong>Contingency Plan:</strong> Set a price alert 10 pips below weekly resistance to manage the trade
            proactively.
          </p>
        </div>
      </div>
    </div>
  </motion.div>
)

export function PreFlightAnalysis({ tradeState, onAbort, onExecute }: PreFlightAnalysisProps) {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <header className="flex items-center justify-between border-b-2 border-luxury-gold/20 p-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Pre-Flight Analysis: Complete</h3>
          <p className="text-sm text-zinc-400">AI has completed a full-spectrum review of your setup.</p>
        </div>
        <ScoreGauge score={82} />
      </header>

      <main className="flex-grow space-y-4 overflow-y-auto p-4">
        <AnalysisSection icon={BarChart3} title="Technical Analysis" score={88} delay={0}>
          <AnalysisDetailItem
            icon={Target}
            title="Balanced Price Range (BPR)"
            status="success"
            description="Price has respected a key BPR, indicating institutional support."
            details={
              <div className="space-y-2">
                <DetailPill label="Timeframe" value="H4" status="neutral" />
                <DetailPill label="Location" value="Lower Third" status="success" />
                <DetailPill label="Context" value="Post-NY Session" status="success" />
              </div>
            }
          />
          <AnalysisDetailItem
            icon={Clock}
            title="Weekly Open"
            status="success"
            description="Trade is positioned in a premium relative to the weekly open."
            details={
              <div className="space-y-2">
                <DetailPill label="Position" value="Premium" status="success" />
                <DetailPill label="Implication" value="Bullish Order Flow" status="success" />
              </div>
            }
          />
          <AnalysisDetailItem
            icon={Zap}
            title="Liquidity Sweep"
            status="warning"
            description="A minor liquidity sweep occurred, but a major pool remains."
            details={
              <div className="space-y-2">
                <DetailPill label="Swept" value="Asian Lows" status="success" />
                <DetailPill label="Remaining" value="Previous Day Low" status="danger" />
              </div>
            }
          />
          <AnalysisDetailItem
            icon={Scale}
            title="4H Pivots"
            status="success"
            description="Entry is above the current 4H pivot point."
            details={
              <div className="space-y-2">
                <DetailPill label="Position" value="Above Pivot" status="success" />
                <DetailPill label="Bias" value="Short-term Bullish" status="success" />
              </div>
            }
          />
        </AnalysisSection>

        <AnalysisSection icon={BrainCircuit} title="Psychological Profile" score={92} delay={1}>
          <AnalysisDetailItem
            icon={TrendingUp}
            title="Emotional State"
            status="success"
            description="Biometric data and journal entries suggest a calm, objective mindset."
            details={
              <div className="space-y-2">
                <DetailPill label="Heart Rate Var." value="Optimal" status="success" />
                <DetailPill label="Anxiety Markers" value="None Detected" status="success" />
              </div>
            }
          />
          <AnalysisDetailItem
            icon={TrendingUp}
            title="Discipline Score"
            status="success"
            description="Setup adheres to 95% of your defined trading plan rules."
            details={
              <div className="space-y-2">
                <DetailPill label="Model" value="Trend Continuation" status="success" />
                <DetailPill label="Adherence" value="5/6 Rules Met" status="success" />
                <DetailPill label="Deviation" value="Entry Timing" status="warning" />
              </div>
            }
          />
        </AnalysisSection>

        <AnalysisSection icon={Globe} title="Macroeconomic Factors" score={65} delay={2}>
          <AnalysisDetailItem
            icon={TrendingUp}
            title="High-Impact News"
            status="success"
            description="No red-folder news events scheduled for the next 8 hours."
            details={
              <div className="space-y-2">
                <DetailPill label="USD Events" value="None" status="success" />
                <DetailPill label="EUR Events" value="None" status="success" />
              </div>
            }
          />
          <AnalysisDetailItem
            icon={TrendingUp}
            title="Central Bank Sentiment"
            status="warning"
            description="Recent ECB commentary was more dovish than expected."
            details={
              <div className="space-y-2">
                <DetailPill label="ECB Stance" value="Dovish" status="warning" />
                <DetailPill label="Fed Stance" value="Neutral-Hawkish" status="neutral" />
              </div>
            }
          />
        </AnalysisSection>
        <AIVerdict delay={3} />
      </main>

      <footer className="grid grid-cols-2 gap-4 border-t-2 border-luxury-gold/20 p-4">
        <Button
          onClick={onAbort}
          variant="outline"
          className="group w-full rounded-lg border-2 border-red-500/50 bg-transparent py-3 text-lg font-bold text-red-400 transition-all duration-300 hover:border-red-500 hover:bg-red-500/20 hover:text-white"
        >
          <XCircle className="mr-2 h-6 w-6" />
          Abort
        </Button>
        <Button
          onClick={onExecute}
          className="group w-full rounded-lg border-2 border-transparent bg-gradient-to-r from-green-500 to-green-600 py-3 text-lg font-bold text-white shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30"
        >
          <Rocket className="mr-2 h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
          Execute
        </Button>
      </footer>
    </div>
  )
}
