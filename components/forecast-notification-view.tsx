"use client"

import type React from "react"
import { Bell, Clock, TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle, Star, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { StudentForecast } from "./student-forecast-system"

interface ForecastNotificationViewProps {
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

// Glass Section component
const GlassSection = ({
  title,
  icon: Icon,
  children,
  delay = 0,
  className = "",
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  delay?: number
  className?: string
}) => {
  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm hover:bg-black/40 transition-all duration-300",
        className,
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <div className="relative z-10 p-4">
        <motion.h4
          className="text-sm font-bold text-white mb-3 flex items-center gap-2"
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div whileHover={{ rotate: 180, scale: 1.1 }} transition={{ duration: 0.3 }}>
            <Icon className="w-4 h-4 text-purple-400" />
          </motion.div>
          {title}
        </motion.h4>
        {children}
      </div>
    </motion.div>
  )
}

export function ForecastNotificationView({ forecast }: ForecastNotificationViewProps) {
  const isLong = forecast.direction === "LONG"

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Alert Header */}
      <motion.div
        className="text-center p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-400/30"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="flex items-center justify-center gap-2 mb-2"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Bell className="w-6 h-6 text-purple-400" />
          <span className="text-lg font-bold text-white">New Forecast Alert</span>
        </motion.div>
        <p className="text-sm text-zinc-300">
          <span className="text-purple-400 font-semibold">{forecast.student}</span> has submitted a new forecast
        </p>
      </motion.div>

      {/* Quick Overview */}
      <GlassSection title="Quick Overview" icon={Zap} delay={0.1}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">{forecast.pair}</span>
            <Badge
              className={cn(
                "px-3 py-1 font-bold border",
                isLong
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-red-500/20 text-red-300 border-red-500/40",
              )}
            >
              {isLong ? (
                <TrendingUp className="w-3 h-3 mr-1 text-emerald-400" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1 text-red-400" />
              )}
              <span className="text-white">{forecast.direction}</span>
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-black/40 rounded-lg">
              <div className="text-zinc-400 mb-1">Entry</div>
              <div className="text-cyan-400 font-bold">130.50</div>
            </div>
            <div className="text-center p-2 bg-black/40 rounded-lg">
              <div className="text-zinc-400 mb-1">Stop</div>
              <div className="text-red-400 font-bold">130.10</div>
            </div>
            <div className="text-center p-2 bg-black/40 rounded-lg">
              <div className="text-zinc-400 mb-1">Target</div>
              <div className="text-emerald-400 font-bold">131.50</div>
            </div>
          </div>

          <div className="p-3 bg-black/40 rounded-lg">
            <p className="text-sm text-white leading-relaxed">
              {forecast.pair} {forecast.direction} from 130.50 - Break and retest of daily resistance, targeting weekly
              high with 1:3 R:R ratio.
            </p>
          </div>
        </div>
      </GlassSection>

      {/* Market Conditions */}
      <GlassSection title="Market Conditions" icon={Target} delay={0.2}>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-white">Market Structure</span>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs">Bullish</Badge>
          </div>

          <div className="flex items-center justify-between p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-white">Session</span>
            </div>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-xs">London/NY</Badge>
          </div>

          <div className="flex items-center justify-between p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-white">Volatility</span>
            </div>
            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-xs">Moderate</Badge>
          </div>
        </div>
      </GlassSection>

      {/* AI Pre-Analysis */}
      <div className="flex-1">
        <GlassSection title="AI Pre-Analysis" icon={AlertTriangle} delay={0.3} className="h-full">
          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">Confluence Strength</span>
              </div>
              <p className="text-xs text-white">
                6 technical confluences detected at entry level. Strong institutional alignment with order blocks and
                liquidity zones.
              </p>
            </div>

            <div className="p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-400">Risk Assessment</span>
              </div>
              <p className="text-xs text-white">
                1.5% account risk with 1:3 R:R ratio. Optimal position sizing for current market conditions.
              </p>
            </div>

            <div className="p-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-400">Timing Analysis</span>
              </div>
              <p className="text-xs text-white">
                Entry timing aligns with institutional trading hours. High probability of liquidity injection during
                London/NY overlap.
              </p>
            </div>
          </div>
        </GlassSection>
      </div>
    </div>
  )
}
