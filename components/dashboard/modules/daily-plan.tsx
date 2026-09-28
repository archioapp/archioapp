"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SURFACE, ACCENT, TYPE, RADIUS, GLOW } from "@/components/mtf/mtf-theme"
import type { DailyPlan } from "../dashboard-types"
import { Calendar, Clock, Target, AlertTriangle, Sparkles, Check, Zap } from "lucide-react"

interface Props {
  plan: DailyPlan
}

export function DailyPlanModule({ plan }: Props) {
  const [showSuggestion, setShowSuggestion] = useState(true)
  const tradeProgress = plan.maxTrades > 0 ? (plan.tradesUsed / plan.maxTrades) * 100 : 0
  const lossProgress = plan.maxDailyLoss > 0 ? (plan.dailyLossUsed / plan.maxDailyLoss) * 100 : 0
  const isOverTrading = tradeProgress > 100

  return (
    <div
      className="h-full"
      style={{
        background: SURFACE.card,
        borderRadius: RADIUS.card,
        border: `1px solid rgba(${ACCENT.cyan.rgb},0.08)`,
      }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4" style={{ color: `rgba(${ACCENT.cyan.rgb},0.6)` }} />
            <span className={TYPE.label} style={{ color: `rgba(${ACCENT.slate.rgb},0.5)` }}>{"Today's Plan"}</span>
          </div>
          {plan.isActive && (
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-mono uppercase font-bold"
              style={{ background: `rgba(${ACCENT.emerald.rgb},0.1)`, color: ACCENT.emerald.hex }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT.emerald.hex }} />
              Active
            </span>
          )}
        </div>

        {/* Focus pairs */}
        <div className="mb-3">
          <div className={`${TYPE.label} mb-1.5`} style={{ color: `rgba(${ACCENT.slate.rgb},0.4)` }}>Focus</div>
          <div className="flex flex-wrap gap-1.5">
            {plan.focusPairs.map((pair) => (
              <span
                key={pair}
                className="px-2 py-1 rounded-md text-[10px] font-mono font-semibold"
                style={{ background: `rgba(${ACCENT.cyan.rgb},0.08)`, color: `rgba(${ACCENT.cyan.rgb},0.7)` }}
              >
                {pair}
              </span>
            ))}
            {plan.sessionFocus.map((session) => (
              <span
                key={session}
                className="px-2 py-1 rounded-md text-[10px] font-mono font-semibold"
                style={{ background: `rgba(${ACCENT.blue.rgb},0.08)`, color: `rgba(${ACCENT.blue.rgb},0.7)` }}
              >
                {session}
              </span>
            ))}
          </div>
        </div>

        {/* Meters */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="p-2.5 rounded-lg" style={{ background: SURFACE.recess }}>
            <div className="flex items-center justify-between mb-1">
              <span className={TYPE.caption}>Trades</span>
              <span className="text-[10px] font-mono font-bold" style={{ color: isOverTrading ? ACCENT.rose.hex : "white" }}>
                {plan.tradesUsed}/{plan.maxTrades}
              </span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: `rgba(${ACCENT.slate.rgb},0.08)` }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(tradeProgress, 100)}%` }}
                transition={{ duration: 0.8 }}
                style={{ background: isOverTrading ? ACCENT.rose.hex : ACCENT.cyan.hex }}
              />
            </div>
          </div>
          <div className="p-2.5 rounded-lg" style={{ background: SURFACE.recess }}>
            <div className="flex items-center justify-between mb-1">
              <span className={TYPE.caption}>Daily Loss</span>
              <span className="text-[10px] font-mono font-bold" style={{ color: lossProgress > 80 ? ACCENT.rose.hex : "white" }}>
                {plan.dailyLossUsed.toFixed(1)}%/{plan.maxDailyLoss}%
              </span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: `rgba(${ACCENT.slate.rgb},0.08)` }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${lossProgress}%` }}
                transition={{ duration: 0.8 }}
                style={{ background: lossProgress > 80 ? ACCENT.rose.hex : ACCENT.emerald.hex }}
              />
            </div>
          </div>
        </div>

        {/* Personal rules */}
        <div className="mb-3">
          <div className={`${TYPE.label} mb-1.5`} style={{ color: `rgba(${ACCENT.slate.rgb},0.4)` }}>Rules</div>
          <div className="space-y-1">
            {plan.personalRules.map((rule, i) => (
              <div key={i} className="flex items-start gap-2 px-2 py-1.5 rounded-md" style={{ background: SURFACE.recess }}>
                <Check className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: `rgba(${ACCENT.emerald.rgb},0.4)` }} />
                <span className="text-[10px] leading-relaxed" style={{ color: `rgba(255,255,255,0.6)` }}>{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Macro events */}
        <div className="mb-3">
          <div className={`${TYPE.label} mb-1.5`} style={{ color: `rgba(${ACCENT.slate.rgb},0.4)` }}>Events</div>
          <div className="space-y-1">
            {plan.macroEvents.map((event, i) => (
              <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-md" style={{ background: SURFACE.recess }}>
                <Clock className="w-3 h-3 flex-shrink-0" style={{ color: `rgba(${ACCENT.slate.rgb},0.4)` }} />
                <span className="text-[10px] font-mono" style={{ color: `rgba(255,255,255,0.4)` }}>{event.time}</span>
                <span className="text-[10px] flex-1" style={{ color: `rgba(255,255,255,0.6)` }}>{event.event}</span>
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: event.impact === "high" ? ACCENT.rose.hex :
                      event.impact === "medium" ? ACCENT.amber.hex : ACCENT.slate.hex,
                  }}
                />
                <span className="text-[9px] font-mono" style={{ color: `rgba(${ACCENT.slate.rgb},0.5)` }}>{event.currency}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI suggestion */}
        {plan.aiSuggestion && showSuggestion && (
          <div
            className="p-3 rounded-lg"
            style={{ background: `rgba(${ACCENT.purple.rgb},0.04)`, border: `1px solid rgba(${ACCENT.purple.rgb},0.06)` }}
          >
            <div className="flex items-start gap-2">
              <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: `rgba(${ACCENT.purple.rgb},0.5)` }} />
              <p className="text-[10px] leading-relaxed flex-1" style={{ color: `rgba(255,255,255,0.5)` }}>
                {plan.aiSuggestion}
              </p>
            </div>
            <button
              onClick={() => setShowSuggestion(false)}
              className="mt-2 text-[9px] font-mono uppercase tracking-wider"
              style={{ color: `rgba(${ACCENT.slate.rgb},0.4)` }}
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
