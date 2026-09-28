"use client"

import { motion } from "framer-motion"
import { SURFACE, ACCENT, TYPE, RADIUS, GLOW } from "@/components/mtf/mtf-theme"
import type { PerformanceSnapshot } from "../dashboard-types"
import { TrendingUp, TrendingDown, Sparkles, BarChart3 } from "lucide-react"

interface Props {
  data: PerformanceSnapshot
}

export function PerformanceModule({ data }: Props) {
  const sparkMax = Math.max(...data.sparkline)
  const sparkMin = Math.min(...data.sparkline)
  const sparkRange = sparkMax - sparkMin || 1

  return (
    <div
      className="h-full"
      style={{
        background: SURFACE.card,
        borderRadius: RADIUS.card,
        border: `1px solid rgba(${ACCENT.emerald.rgb},0.08)`,
      }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-4 h-4" style={{ color: `rgba(${ACCENT.emerald.rgb},0.6)` }} />
            <span className={`${TYPE.label}`} style={{ color: `rgba(${ACCENT.slate.rgb},0.5)` }}>Performance Intelligence</span>
          </div>
          <div className="flex items-center gap-1.5">
            {data.accuracyTrend >= 0 ? (
              <TrendingUp className="w-3 h-3" style={{ color: ACCENT.emerald.hex }} />
            ) : (
              <TrendingDown className="w-3 h-3" style={{ color: ACCENT.rose.hex }} />
            )}
            <span
              className="text-[10px] font-mono font-semibold"
              style={{ color: data.accuracyTrend >= 0 ? ACCENT.emerald.hex : ACCENT.rose.hex }}
            >
              {data.accuracyTrend > 0 ? "+" : ""}{data.accuracyTrend}%
            </span>
          </div>
        </div>

        {/* Accuracy + Sparkline */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="text-white font-mono text-3xl font-bold tracking-tighter">{data.accuracy}%</div>
            <div className={TYPE.caption}>30-day accuracy</div>
          </div>
          {/* Sparkline */}
          <svg viewBox={`0 0 ${data.sparkline.length * 4} 32`} className="w-32 h-8" style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="sparkGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={`rgba(${ACCENT.emerald.rgb},0.2)`} />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d={`M ${data.sparkline.map((v, i) => `${i * 4},${32 - ((v - sparkMin) / sparkRange) * 28}`).join(" L ")} L ${(data.sparkline.length - 1) * 4},32 L 0,32 Z`}
              fill="url(#sparkGrad)"
            />
            <path
              d={`M ${data.sparkline.map((v, i) => `${i * 4},${32 - ((v - sparkMin) / sparkRange) * 28}`).join(" L ")}`}
              fill="none"
              stroke={ACCENT.emerald.hex}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Win Rate", value: `${data.winRate}%` },
            { label: "Profit Factor", value: data.profitFactor.toFixed(2) },
            { label: "Avg R:R", value: `${data.averageRR.toFixed(1)}` },
          ].map((stat) => (
            <div key={stat.label} className="p-2.5 rounded-lg" style={{ background: SURFACE.recess }}>
              <div className={`${TYPE.label} mb-1`} style={{ color: `rgba(${ACCENT.slate.rgb},0.4)` }}>{stat.label}</div>
              <div className="text-white font-mono text-sm font-semibold">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Best / Worst setups */}
        <div className="space-y-2">
          <div
            className="p-3 rounded-lg flex items-center justify-between"
            style={{ background: `rgba(${ACCENT.emerald.rgb},0.04)`, border: `1px solid rgba(${ACCENT.emerald.rgb},0.06)` }}
          >
            <div>
              <div className={TYPE.caption} style={{ color: `rgba(${ACCENT.emerald.rgb},0.5)` }}>Best setup</div>
              <div className="text-white text-xs font-semibold mt-0.5">{data.bestSetup.name}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono font-bold" style={{ color: ACCENT.emerald.hex }}>{data.bestSetup.winRate}%</div>
              <div className={TYPE.caption}>{data.bestSetup.sampleSize} trades</div>
            </div>
          </div>

          <div
            className="p-3 rounded-lg"
            style={{ background: `rgba(${ACCENT.rose.rgb},0.04)`, border: `1px solid rgba(${ACCENT.rose.rgb},0.06)` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className={TYPE.caption} style={{ color: `rgba(${ACCENT.rose.rgb},0.5)` }}>Worst setup</div>
                <div className="text-white text-xs font-semibold mt-0.5">{data.worstSetup.name}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono font-bold" style={{ color: ACCENT.rose.hex }}>{data.worstSetup.winRate}%</div>
                <div className={TYPE.caption}>{data.worstSetup.sampleSize} trades</div>
              </div>
            </div>
            {data.worstSetup.aiSuggestion && (
              <div className="flex items-start gap-2 mt-2 pt-2" style={{ borderTop: `1px solid rgba(${ACCENT.rose.rgb},0.06)` }}>
                <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: `rgba(${ACCENT.purple.rgb},0.5)` }} />
                <p className="text-[10px] leading-relaxed" style={{ color: `rgba(255,255,255,0.5)` }}>
                  {data.worstSetup.aiSuggestion}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
