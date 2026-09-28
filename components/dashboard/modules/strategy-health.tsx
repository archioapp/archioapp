"use client"

import { motion } from "framer-motion"
import { SURFACE, ACCENT, TYPE, RADIUS } from "@/components/mtf/mtf-theme"
import type { StrategyHealth } from "../dashboard-types"
import { Activity, TrendingUp, TrendingDown, Minus, Sparkles, AlertTriangle, Pause } from "lucide-react"

const TREND_ICON = { improving: TrendingUp, stable: Minus, decaying: TrendingDown }
const TREND_COLOR = { improving: ACCENT.emerald.rgb, stable: ACCENT.slate.rgb, decaying: ACCENT.rose.rgb }
const REC_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  keep: { label: "Keep", color: ACCENT.emerald.rgb, icon: TrendingUp },
  review: { label: "Review", color: ACCENT.amber.rgb, icon: AlertTriangle },
  pause: { label: "Pause", color: ACCENT.rose.rgb, icon: Pause },
  insufficient_data: { label: "Need Data", color: ACCENT.slate.rgb, icon: Activity },
}

interface Props {
  strategies: StrategyHealth[]
}

export function StrategyHealthModule({ strategies }: Props) {
  const sorted = [...strategies].sort((a, b) => b.pnlContribution - a.pnlContribution)

  return (
    <div
      className="h-full"
      style={{
        background: SURFACE.card,
        borderRadius: RADIUS.card,
        border: `1px solid rgba(${ACCENT.amber.rgb},0.08)`,
      }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <Activity className="w-4 h-4" style={{ color: `rgba(${ACCENT.amber.rgb},0.6)` }} />
          <span className={TYPE.label} style={{ color: `rgba(${ACCENT.slate.rgb},0.5)` }}>Strategy Health</span>
        </div>

        {/* Strategy list */}
        <div className="space-y-2">
          {sorted.map((strategy, i) => {
            const TrendIcon = TREND_ICON[strategy.winRateTrend]
            const trendColor = TREND_COLOR[strategy.winRateTrend]
            const rec = REC_CONFIG[strategy.aiRecommendation]
            const isHurting = strategy.pnlContribution < 0

            return (
              <motion.div
                key={strategy.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="p-3 rounded-xl"
                style={{
                  background: SURFACE.recess,
                  border: `1px solid rgba(${isHurting ? ACCENT.rose.rgb : ACCENT.slate.rgb},0.04)`,
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white text-xs font-semibold">{strategy.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <TrendIcon className="w-3 h-3" style={{ color: `rgba(${trendColor},0.7)` }} />
                      <span className="text-xs font-mono font-bold" style={{ color: `rgba(${trendColor},0.8)` }}>
                        {strategy.winRate}%
                      </span>
                    </div>
                    <span
                      className="px-1.5 py-0.5 rounded text-[8px] font-mono uppercase font-bold"
                      style={{
                        background: `rgba(${rec.color},0.1)`,
                        color: `rgba(${rec.color},0.8)`,
                      }}
                    >
                      {rec.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={TYPE.caption}>{strategy.sampleSize} trades | R:R {strategy.averageRR.toFixed(1)}</span>
                  <span
                    className="text-[10px] font-mono font-semibold"
                    style={{ color: isHurting ? ACCENT.rose.hex : ACCENT.emerald.hex }}
                  >
                    {isHurting ? "" : "+"}${strategy.pnlContribution}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* AI summary */}
        <div
          className="mt-3 p-3 rounded-lg flex items-start gap-2"
          style={{ background: `rgba(${ACCENT.purple.rgb},0.04)`, border: `1px solid rgba(${ACCENT.purple.rgb},0.06)` }}
        >
          <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: `rgba(${ACCENT.purple.rgb},0.5)` }} />
          <p className="text-[10px] leading-relaxed" style={{ color: `rgba(255,255,255,0.5)` }}>
            {sorted.filter(s => s.aiRecommendation === "pause").length > 0
              ? `${sorted.filter(s => s.aiRecommendation === "pause").length} setup${sorted.filter(s => s.aiRecommendation === "pause").length > 1 ? "s" : ""} recommended for pause. Your profitable setups are carrying the account.`
              : "All active strategies are contributing positively. Maintain current approach."
            }
          </p>
        </div>
      </div>
    </div>
  )
}
