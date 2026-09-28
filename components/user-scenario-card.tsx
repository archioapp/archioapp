"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { TradingScenario } from "@/lib/scenario-store"
import { cn } from "@/lib/utils"
import {
  Target,
  Clock,
  Activity,
  Zap,
  Shield,
  BarChart3,
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Brain,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

interface UserScenarioCardProps {
  scenario: TradingScenario
}

/**
 * Animated, glowing direction icon inside a glass circle.
 */
function PremiumTrendIcon({ direction }: { direction: "up" | "down" }) {
  const Up = direction === "up"
  const Icon = Up ? ArrowUpRight : ArrowDownRight
  return (
    <div
      className={cn(
        "relative p-3 rounded-full border transition-all duration-300",
        "backdrop-blur-md",
        Up
          ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-300 soft-green-glow"
          : "bg-red-500/15 border-red-400/40 text-red-300 soft-red-glow",
      )}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent" />
      <Icon className="h-5 w-5 drop-shadow-[0_0_8px_rgba(16,185,129,0.35)]" />
      <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-current" />
    </div>
  )
}

/**
 * Count-up numeric animation with text-only, subtle glow.
 * The glow is applied via textShadow to the digits only (no background flash).
 */
function AnimatedCounter({
  value,
  format = "number",
  digits = 2,
  className,
}: {
  value: number | string
  format?: "number" | "ratio"
  digits?: number
  className?: string
}) {
  const target = useMemo(() => {
    if (format === "ratio" && typeof value === "string") {
      const parts = value.split(":")
      const right = Number.parseFloat(parts[1] || "0")
      return isNaN(right) ? 0 : right
    }
    const num = typeof value === "string" ? Number.parseFloat(value) : value
    return isNaN(Number(num)) ? 0 : Number(num)
  }, [value, format])

  const [n, setN] = useState(0)
  const [highlight, setHighlight] = useState(false)

  useEffect(() => {
    let raf: number
    const start = performance.now()
    const duration = 900
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      setN(target * (0.5 - 0.5 * Math.cos(Math.PI * p))) // ease-in-out
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    // Trigger subtle white glow on digits only
    setHighlight(true)
    const off = setTimeout(() => setHighlight(false), 800)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(off)
    }
  }, [target])

  const display =
    format === "ratio" ? `1:${n.toFixed(digits)}` : (Number.isInteger(target) ? Math.round(n) : n).toFixed(digits)

  return (
    <span
      className={cn("font-mono digital-display", highlight && "digits-flash", className)}
      aria-live="polite"
      aria-atomic="true"
    >
      {display}
    </span>
  )
}

/**
 * Circular confidence indicator with purple gradient stroke.
 */
function CircularProgress({ pct, size = 42 }: { pct: number; size?: number }) {
  const radius = (size - 4) / 2
  const circumference = 2 * Math.PI * radius
  const [dash, setDash] = useState(0)

  useEffect(() => {
    const anim = requestAnimationFrame(() => {
      setDash((pct / 100) * circumference)
    })
    return () => cancelAnimationFrame(anim)
  }, [pct, circumference])

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(147,51,234,.2)" strokeWidth="2" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#pg)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          fill="none"
          className="transition-[stroke-dasharray] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="text-[11px] font-bold text-purple-300">{pct}%</span>
      </div>
    </div>
  )
}

/**
 * Minimal sparkline (bar) visualization for tiny data preview.
 */
function MiniSparkline({ data = [1, 3, 2, 4, 3, 5, 4] }: { data?: number[] }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = Math.max(1, max - min)
  return (
    <div className="flex items-end h-6 w-16 gap-0.5">
      {data.map((v, i) => {
        const h = ((v - min) / range) * 18 + 4
        return (
          <div
            key={i}
            className="rounded-sm bg-gradient-to-t from-purple-600/60 to-purple-300/70"
            style={{ height: h, width: 2, animation: "pulse 2s ease-in-out infinite", animationDelay: `${i * 90}ms` }}
          />
        )
      })}
    </div>
  )
}

/**
 * Live ticking clock (hh:mm:ss).
 */
function LiveClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="flex items-center gap-1 text-xs text-purple-300">
      <Clock className="h-3 w-3 animate-pulse" />
      <span className="font-mono">{now.toLocaleTimeString([], { hour12: false })}</span>
    </div>
  )
}

/**
 * Floating, pulsing glass chip with tooltip details.
 */
function ConfluenceChip({ text, index }: { text: string; index: number }) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="relative px-3 py-1.5 rounded-full cursor-pointer premium-glass-container hover:scale-[1.04] transition-all duration-300"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-300" />
              <span className="text-[11px] font-medium text-purple-100">{text}</span>
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 hover:opacity-100 transition-opacity" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="premium-glass-modal px-3 py-2 text-xs">
          <p className="text-white">{text}</p>
          <p className="text-purple-300 mt-0.5">Strength: High • Impact: Contextual</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function UserScenarioCard({ scenario }: UserScenarioCardProps) {
  const isBuy = scenario.position?.toLowerCase().includes("buy")
  const confidence =
    scenario.probability === "High Probability" ? 86 : scenario.probability === "Medium Probability" ? 65 : 45

  // Persistent hover state: activated on entering the card, released on leaving the card.
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="ultra-premium-scenario-card group relative w-80 outline-none"
      role="button"
      tabIndex={0}
      data-hovered={isHovered ? "true" : "false"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {/* Depth layers and particles */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="floating-particles" />
      </div>

      <Card
        className={cn(
          "relative premium-glass-chart-container overflow-hidden border-purple-500/30",
          // persistent hover styles controlled by parent data-hovered
          "transition-all duration-300 will-change-transform",
          "group-data-[hovered=true]:-translate-y-px group-data-[hovered=true]:ring-1 group-data-[hovered=true]:ring-purple-400/30",
          "group-data-[hovered=true]:shadow-[0_10px_26px_rgba(10,10,20,0.35)]",
        )}
      >
        {/* subtle flowing border light */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-2xl animate-border-flow bg-gradient-to-r from-purple-500/20 via-transparent to-pink-500/20",
            "opacity-40 transition-opacity group-data-[hovered=true]:opacity-60",
          )}
        />
        <CardContent className="relative z-10 p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <PremiumTrendIcon direction={isBuy ? "up" : "down"} />
              <div>
                <h4 className="text-white font-bold text-lg tracking-wide drop-shadow-[0_0_12px_rgba(147,51,234,.25)]">
                  {scenario.pair}
                </h4>
                <p className="text-sm text-purple-200 font-medium">{scenario.position}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CircularProgress pct={confidence} />
              <Badge
                className={cn(
                  "text-[11px] px-3 py-1 font-bold premium-glass-container",
                  scenario.probability === "High Probability"
                    ? "text-emerald-300 border-emerald-400/40"
                    : scenario.probability === "Medium Probability"
                      ? "text-amber-300 border-amber-400/40"
                      : "text-red-300 border-red-400/40",
                )}
              >
                <Eye className="h-3 w-3 mr-1" />
                {scenario.probability?.split(" ")[0] ?? "Low"}
              </Badge>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="premium-glass-segment">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-purple-300 font-medium flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Entry
                </span>
                <MiniSparkline />
              </div>
              <AnimatedCounter value={Number(scenario.level)} digits={2} className="text-white text-lg" />
            </div>

            <div className="premium-glass-segment">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-purple-300 font-medium flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" />
                  R/R
                </span>
                <Activity className="h-3.5 w-3.5 text-emerald-400 group-data-[hovered=true]:animate-spin" />
              </div>
              <AnimatedCounter
                value={typeof scenario.rr === "string" ? scenario.rr : String(scenario.rr)}
                format="ratio"
                digits={2}
                className="text-emerald-400 text-lg"
              />
            </div>

            <div className="premium-glass-segment">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-purple-300 font-medium flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Stop Loss
                </span>
              </div>
              <AnimatedCounter value={Number(scenario.sl)} digits={2} className="text-red-400 text-lg" />
            </div>

            <div className="premium-glass-segment">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-purple-300 font-medium flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Take Profit
                </span>
              </div>
              <AnimatedCounter value={Number(scenario.tp)} digits={2} className="text-emerald-400 text-lg" />
            </div>
          </div>

          {/* Confluences */}
          {scenario.confluences?.length ? (
            <div className="premium-glass-container p-3 rounded-xl mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-purple-400" />
                <h5 className="text-sm text-purple-300 font-semibold">Key Confluences</h5>
                <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent" />
              </div>
              <div className="flex flex-wrap gap-2">
                {scenario.confluences.slice(0, 6).map((c, i) => (
                  <ConfluenceChip key={i} text={typeof c === "string" ? c : c.text} index={i} />
                ))}
                {scenario.confluences.length > 6 && (
                  <div className="px-3 py-1.5 rounded-full premium-glass-container text-[11px] text-purple-300">
                    +{scenario.confluences.length - 6}
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Notes */}
          {scenario.notes ? (
            <div className="premium-glass-container p-3 rounded-xl mb-3">
              <h6 className="text-[11px] text-purple-300 mb-1.5 font-semibold flex items-center gap-1">
                <Layers className="h-3 w-3" />
                Notes
              </h6>
              <p className="text-sm text-zinc-300 leading-relaxed">{scenario.notes}</p>
            </div>
          ) : null}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-purple-500/25">
            <LiveClock />
            <div className="flex items-center gap-2">
              <Target className="h-3 w-3 text-purple-400" />
              <span className="text-[11px] text-purple-300">{scenario.source ?? "forecast"}</span>
            </div>
          </div>

          {/* Liquid glass CTA */}
          <button className="liquid-glass-button w-full mt-4 transition-opacity opacity-95 group-data-[hovered=true]:opacity-100">
            <div className="flex items-center justify-center gap-2">
              <Activity className="h-4 w-4 group-data-[hovered=true]:animate-spin" />
              <span className="font-semibold">View Forecast</span>
            </div>
          </button>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserScenarioCard
