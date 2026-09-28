"use client"

import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  TrendingUp, TrendingDown, ChevronDown, Eye
} from "lucide-react"
import type {
  MultiTimeframeAnalysis,
  TimeframeAnalysis,
} from "@/lib/multi-timeframe-analysis"
import { useAnalysis } from "@/lib/stores/useAnalysis"
import { type Mode, type Legs, MODE_CONFIG } from "@/lib/types/trading-modes"
import { cn } from "@/lib/utils"

import { CompactChart } from "@/components/mtf/compact-chart"
import { CommandDeck } from "@/components/mtf/command-deck"
import { AmbientField } from "@/components/mtf/ambient-field"
import { getCardAnalysis } from "@/components/mtf/get-card-analysis"
import type { CardAnalysisResult } from "@/components/mtf/types"
import {
  SURFACE, ACCENT, MODE_ACCENT, PHASE_COLOR, ELEVATION, RADIUS,
  MOTION, TYPE, GLOW, GRADIENT,
} from "@/components/mtf/mtf-theme"

const TF_FULL: Record<string, string> = {
  "5M": "5 Minute", "15M": "15 Minute", "1H": "1 Hour",
  "4H": "4 Hour", "1D": "Daily", "1W": "Weekly",
}

interface MultiTimeframeDisplayProps {
  analysis: MultiTimeframeAnalysis | null
  isLoading: boolean
}

/* ═══════════════════════════════════════════════════════════════
   CARD PARTICLES
   ═══════════════════════════════════════════════════════════════ */
function CardParticles({ phaseRgb, count = 5 }: { phaseRgb: string; count?: number }) {
  const dots = useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i, x: 20 + ((i * 19) % 65), y: 15 + ((i * 27) % 60),
      size: 1.2 + (i % 3) * 0.5, dur: 4 + i * 0.9, delay: i * 0.5,
    })), [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {dots.map((d) => (
        <motion.div key={d.id} className="absolute rounded-full"
          style={{
            width: d.size, height: d.size,
            left: `${d.x}%`, top: `${d.y}%`,
            background: `rgba(${phaseRgb},0.15)`,
            boxShadow: `0 0 ${d.size * 4}px rgba(${phaseRgb},0.08)`,
          }}
          animate={{ y: [-8, 8, -8], opacity: [0.2, 0.5, 0.2], scale: [1, 1.6, 1] }}
          transition={{ duration: d.dur, repeat: Infinity, ease: "easeInOut", delay: d.delay }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CANDLE METRIC -- Centered layout, no bullish/bearish split boxes
   Everything centered: icon, label, big count, avg pip, total
   ═══════════════════════════════════════════════════════════════ */
function CandleMetric({
  side, count, avgRange, totalRange, isHighlighted, onHover, onLeave,
}: {
  side: "bull" | "bear"; count: number; avgRange: number; totalRange: number
  isHighlighted: boolean; onHover: () => void; onLeave: () => void
}) {
  const accent = side === "bull" ? ACCENT.emerald : ACCENT.rose
  const Icon = side === "bull" ? TrendingUp : TrendingDown
  const label = side === "bull" ? "Bullish" : "Bearish"

  return (
    <motion.div
      className="relative cursor-default flex flex-col items-center justify-center text-center p-4"
      style={{
        background: isHighlighted ? `rgba(${accent.rgb},0.07)` : SURFACE.recess,
        borderRadius: RADIUS.inner,
        boxShadow: isHighlighted
          ? `0 0 24px rgba(${accent.rgb},0.06), inset 0 1px 0 rgba(${accent.rgb},0.06)`
          : "none",
        transition: "all 0.4s cubic-bezier(0.33, 1, 0.68, 1)",
      }}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {isHighlighted && (
        <motion.div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.8, 0], scale: [0, 1.5, 0] }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ background: `rgba(${accent.rgb},0.5)` }}
        />
      )}

      {/* Label row centered */}
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3.5 h-3.5 transition-colors duration-300"
          style={{ color: isHighlighted ? `rgba(${accent.rgb},0.7)` : `rgba(${accent.rgb},0.3)` }}
        />
        <span className={TYPE.label}
          style={{ color: isHighlighted ? `rgba(${accent.rgb},0.6)` : `rgba(${accent.rgb},0.25)` }}>
          {label}
        </span>
      </div>

      {/* Big count -- centered */}
      <motion.div className={TYPE.metric}
        style={{ color: `rgba(${accent.rgb},0.85)` }}
        animate={{ opacity: isHighlighted ? 1 : 0.7, scale: isHighlighted ? 1.05 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {count}
      </motion.div>

      {/* Avg pip -- centered */}
      <div className="text-[11px] font-mono mt-1.5" style={{ color: "rgba(148,163,184,0.35)" }}>
        {avgRange > 0 ? `${avgRange.toFixed(1)} avg pip` : "\u00A0"}
      </div>

      {/* Total -- centered */}
      {totalRange > 0 && (
        <div className="mt-2 pt-2 flex items-center justify-center gap-3 w-full"
          style={{ borderTop: `1px solid rgba(${accent.rgb},0.06)` }}>
          <span className={TYPE.label} style={{ color: "rgba(148,163,184,0.2)" }}>Total</span>
          <span className="text-[13px] font-bold font-mono"
            style={{ color: `rgba(${accent.rgb},0.6)` }}>
            {totalRange.toFixed(0)}p
          </span>
        </div>
      )}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TIMEFRAME CARD v4 -- Streamlined: Header + Chart + CandleMetrics
   NO signal chamber inside card anymore -- that moves to ConvergenceMatrix
   ═══════════════════════════════════════════════════════════════ */
function TimeframeCard({
  analysis, index, mode, legs, isOtherCardHovered,
  onCardHover, onCardLeave, cardData,
}: {
  analysis: TimeframeAnalysis; index: number; mode: Mode; legs: Legs
  isOtherCardHovered: boolean
  onCardHover: () => void; onCardLeave: () => void
  cardData: CardAnalysisResult | null
}) {
  const [isFocused, setIsFocused] = useState(false)
  const [highlightType, setHighlightType] = useState<"bull" | "bear" | null>(null)

  const cardConfig = MODE_CONFIG[mode].cards[index]
  const tf = cardConfig ? cardConfig.displayName : analysis.timeframe
  const fullTf = TF_FULL[tf] || tf
  const modeAccent = MODE_ACCENT[mode] || ACCENT.purple

  const phase = cardData?.sentiment === "accumulation" ? "accumulation"
    : cardData?.sentiment === "distribution" ? "distribution" : "range"
  const phaseAccent = PHASE_COLOR[phase] || PHASE_COLOR.range
  const phaseRgb = phaseAccent.rgb
  const phaseLabel = phase === "accumulation" ? "Bullish"
    : phase === "distribution" ? "Bearish" : "Neutral"

  const handleHoverStart = useCallback(() => { setIsFocused(true); onCardHover() }, [onCardHover])
  const handleHoverEnd = useCallback(() => { setIsFocused(false); onCardLeave() }, [onCardLeave])

  return (
    <motion.div
      initial={{ opacity: 0, y: MOTION.slideIn }}
      animate={{ opacity: isOtherCardHovered && !isFocused ? 0.85 : 1, y: 0 }}
      transition={{ delay: index * MOTION.stagger, duration: 0.7, ease: MOTION.ease }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      className="relative overflow-hidden"
      style={{
        borderRadius: RADIUS.card,
        background: isFocused ? SURFACE.cardHover : SURFACE.card,
        boxShadow: isFocused ? ELEVATION.cardGlow(phaseRgb) : ELEVATION.card,
        transform: isFocused ? `translateY(${MOTION.hoverLift}px)` : "translateY(0)",
        transition: "all 0.5s cubic-bezier(0.33, 1, 0.68, 1)",
      }}
    >
      <CardParticles phaseRgb={phaseRgb} />

      {/* Top accent gradient */}
      <motion.div className="absolute top-0 left-0 right-0 h-[2px]"
        animate={{ opacity: isFocused ? 0.8 : 0.2 }}
        transition={{ duration: 0.5 }}
        style={{
          background: `linear-gradient(90deg, transparent 5%, rgba(${phaseRgb},0.5) 30%, rgba(${modeAccent.rgb},0.3) 70%, transparent 95%)`,
        }}
      />

      {/* Hover glow orb */}
      <motion.div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 pointer-events-none"
        animate={{ opacity: isFocused ? 0.18 : 0, scale: isFocused ? 1.1 : 0.5 }}
        transition={{ duration: 0.6, ease: MOTION.ease }}
        style={{
          background: `radial-gradient(circle, rgba(${phaseRgb},0.3) 0%, transparent 70%)`,
          filter: "blur(30px)",
        }}
      />

      <div className="relative p-6 z-10">
        {/* HEADER */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className={TYPE.subtitle}
              style={{ color: `rgba(${modeAccent.rgb},0.35)`, marginBottom: 4 }}>
              {fullTf}
            </div>
            <div className={TYPE.title} style={{ color: "rgba(226,232,240,0.95)" }}>{tf}</div>
          </div>
          <motion.div className="flex items-center gap-2 px-3 py-1.5 mb-1"
            style={{
              background: `rgba(${phaseRgb},0.08)`, borderRadius: RADIUS.pill,
              boxShadow: GLOW.low(phaseRgb),
            }}
            animate={isFocused ? { boxShadow: GLOW.med(phaseRgb) } : { boxShadow: GLOW.low(phaseRgb) }}
            transition={{ duration: 0.4 }}
          >
            <motion.div className="w-[6px] h-[6px] rounded-full"
              style={{ background: `rgba(${phaseRgb},0.6)` }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: `rgba(${phaseRgb},0.65)` }}>{phaseLabel}</span>
          </motion.div>
        </div>

        {/* CHART */}
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-4 z-10 pointer-events-none"
            style={{ background: `linear-gradient(180deg, ${isFocused ? SURFACE.cardHover : SURFACE.card}, transparent)` }}
          />
          <CompactChart timeframe={tf} mode={mode} legs={legs}
            highlightType={highlightType} phaseRgb={phaseRgb} />
          <div className="absolute bottom-0 left-0 right-0 h-4 z-10 pointer-events-none"
            style={{ background: `linear-gradient(0deg, ${isFocused ? SURFACE.cardHover : SURFACE.card}, transparent)` }}
          />
        </div>

        {/* CANDLE METRICS -- just bull/bear boxes, centered content */}
        {cardData && (
          <div className="mt-5 grid grid-cols-2 gap-3">
            <CandleMetric side="bull" count={cardData.bullCount}
              avgRange={cardData.avgBullishRange} totalRange={cardData.bullishTotalRange}
              isHighlighted={highlightType === "bull"}
              onHover={() => setHighlightType("bull")}
              onLeave={() => setHighlightType(null)}
            />
            <CandleMetric side="bear" count={cardData.bearCount}
              avgRange={cardData.avgBearishRange} totalRange={cardData.bearishTotalRange}
              isHighlighted={highlightType === "bear"}
              onHover={() => setHighlightType("bear")}
              onLeave={() => setHighlightType(null)}
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FLOWING CONNECTION SVG -- Animated lines from 3 cards into
   the convergence matrix below. Creates a "melting" travel effect.
   ═══════════════════════════════════════════════════════════════ */
function FlowingConnections({ modeAccent }: { modeAccent: string }) {
  return (
    <div className="relative h-12 overflow-visible pointer-events-none" aria-hidden="true">
      <svg className="w-full h-full" viewBox="0 0 900 48" preserveAspectRatio="none">
        <defs>
          <linearGradient id="flow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={`rgba(${modeAccent},0.35)`} />
            <stop offset="100%" stopColor={`rgba(${modeAccent},0.05)`} />
          </linearGradient>
          <filter id="flow-glow">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Left card flow */}
        <motion.path d="M150,0 C150,24 250,24 300,48"
          fill="none" stroke="url(#flow-grad)" strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: MOTION.ease }}
        />
        <motion.path d="M150,0 C150,24 250,24 300,48"
          fill="none" stroke={`rgba(${modeAccent},0.15)`} strokeWidth="6"
          filter="url(#flow-glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 1.2, delay: 0.3, ease: MOTION.ease }}
        />

        {/* Center card flow -- straight down */}
        <motion.path d="M450,0 L450,48"
          fill="none" stroke="url(#flow-grad)" strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: MOTION.ease }}
        />
        <motion.path d="M450,0 L450,48"
          fill="none" stroke={`rgba(${modeAccent},0.2)`} strokeWidth="8"
          filter="url(#flow-glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 0.8, delay: 0.5, ease: MOTION.ease }}
        />

        {/* Right card flow */}
        <motion.path d="M750,0 C750,24 650,24 600,48"
          fill="none" stroke="url(#flow-grad)" strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: MOTION.ease }}
        />
        <motion.path d="M750,0 C750,24 650,24 600,48"
          fill="none" stroke={`rgba(${modeAccent},0.15)`} strokeWidth="6"
          filter="url(#flow-glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 1.2, delay: 0.3, ease: MOTION.ease }}
        />

        {/* Traveling pulse dots along each path */}
        {[150, 450, 750].map((startX, i) => (
          <motion.circle key={i} r="2.5"
            fill={`rgba(${modeAccent},0.6)`}
            filter="url(#flow-glow)"
            animate={{
              cy: [0, 48],
              cx: i === 0 ? [startX, 300] : i === 2 ? [startX, 600] : [startX, startX],
              opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{
              duration: 2, repeat: Infinity, ease: "easeInOut",
              delay: i * 0.4 + 1,
            }}
          />
        ))}
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   STRUCTURE ANALYSIS v8 -- METRIC CARD ARCHITECTURE
   5 horizontal metric cards (Frequency, Momentum, Displacement,
   Alignment, Conviction). Each card shows a per-TF comparison
   with interactive hover/click. Below cards: per-TF full breakdown.
   ═══════════════════════════════════════════════════════════════ */

/* helper: compute per-TF metrics once */
function computeTfMetrics(d: CardAnalysisResult) {
  const totalRange = d.bullishTotalRange + d.bearishTotalRange
  const rs = totalRange > 0 ? (d.bullishTotalRange - d.bearishTotalRange) / totalRange : 0
  const dom = rs > 0.05 ? "bull" as const : rs < -0.05 ? "bear" as const : "neutral" as const
  const rgb = dom === "bull" ? ACCENT.emerald.rgb : dom === "bear" ? ACCENT.rose.rgb : ACCENT.slate.rgb
  const ratio = d.rangeRatio >= 1 ? d.rangeRatio : d.rangeRatio > 0 ? 1 / d.rangeRatio : 1
  const bullPct = totalRange > 0 ? (d.bullishTotalRange / totalRange) * 100 : 50
  const cs = d.total > 0 ? (d.bullCount - d.bearCount) / d.total : 0
  const countAligned = (d.bullCount > d.bearCount && rs > 0.05) || (d.bearCount > d.bullCount && rs < -0.05)
  const strength = Math.min((Math.abs(rs) * 2 + Math.abs(cs)) / 2, 1)
  return { totalRange, rs, dom, rgb, ratio, bullPct, cs, countAligned, strength }
}

/* compute all 5 metrics for a single TF */
function computeAllMetrics(d: CardAnalysisResult, fullTf: string) {
  const m = computeTfMetrics(d)
  const freqPct = d.total > 0 ? (Math.max(d.bullCount, d.bearCount) / d.total) * 100 : 50
  const bigAvg = Math.max(d.avgBullishRange, d.avgBearishRange)
  const smallAvg = Math.min(d.avgBullishRange, d.avgBearishRange)
  const momRatio = smallAvg > 0 ? bigAvg / smallAvg : 1
  const totalBig = Math.max(d.bullishTotalRange, d.bearishTotalRange)
  const totalSmall = Math.min(d.bullishTotalRange, d.bearishTotalRange)
  const convScore = (m.countAligned ? 40 : 0) + Math.min(m.ratio * 15, 30) + Math.min(Math.abs(m.cs) * 100, 30)

  return {
    frequency: { pct: freqPct, value: `${Math.max(d.bullCount, d.bearCount)}/${d.total}`, strength: (freqPct - 50) * 2 },
    momentum: { pct: Math.min((momRatio - 1) * 60, 100), value: `${bigAvg.toFixed(1)}p`, bigAvg, smallAvg, momRatio },
    displacement: { pct: Math.min((m.ratio - 1) * 40, 100), value: `${totalBig.toFixed(0)}p`, totalBig, totalSmall, dir: d.bullishTotalRange > d.bearishTotalRange ? "up" : "down" as string },
    alignment: { aligned: m.countAligned, pct: m.countAligned ? Math.min(m.ratio * 25, 100) : 15 },
    conviction: { score: convScore, pct: convScore },
    meta: m,
  }
}

/* generate per-TF full breakdown text -- non-repetitive, context-aware */
function generateTfBreakdown(d: CardAnalysisResult, tf: string): string {
  const m = computeTfMetrics(d)
  const allM = computeAllMetrics(d, tf)
  const domWord = m.dom === "bull" ? "buyers" : m.dom === "bear" ? "sellers" : "neither side"
  const freqPct = d.total > 0 ? (Math.max(d.bullCount, d.bearCount) / d.total) * 100 : 50
  const freqDir = d.bullCount >= d.bearCount ? "up" : "down"
  const momDir = d.avgBullishRange >= d.avgBearishRange ? "upside" : "downside"

  const freqStrength = freqPct > 60 ? "dominant" : freqPct > 53 ? "leaning" : "balanced"
  const momForce = allM.momentum.momRatio > 1.5 ? "significant" : allM.momentum.momRatio > 1.15 ? "moderate" : "negligible"
  const dispStrength = m.ratio > 2 ? "decisive" : m.ratio > 1.3 ? "meaningful" : "minimal"

  return `The ${TF_FULL[tf] || tf} structure shows ${freqStrength} ${freqDir} frequency (${d.bullCount} bull vs ${d.bearCount} bear candles, ${freqPct.toFixed(0)}% skew). Per-candle momentum favors ${momDir} with ${momForce} force at ${allM.momentum.bigAvg.toFixed(1)}p avg vs ${allM.momentum.smallAvg.toFixed(1)}p (${allM.momentum.momRatio.toFixed(1)}x ratio). Net displacement is ${dispStrength}: ${allM.displacement.totalBig.toFixed(0)}p in the dominant direction vs ${allM.displacement.totalSmall.toFixed(0)}p counter (1:${m.ratio.toFixed(1)}). Frequency and displacement are ${m.countAligned ? "aligned -- confirming that " + domWord + " control both rhythm and force on this timeframe" : "conflicted -- the side printing more candles is not the side generating more total movement, signaling a transitional state"}. Composite conviction: ${allM.conviction.score.toFixed(0)}%.`
}

/* ═══════════════════════════════════════════════════════════════
   METRIC TYPES + EDUCATIONAL DESCRIPTIONS
   ═══════════════════════════════════════════════════════════════ */
type MetricName = "Frequency" | "Momentum" | "Displacement" | "Alignment" | "Conviction"

const METRIC_EDUCATION: Record<MetricName, { what: string; why: string }> = {
  Frequency: {
    what: "Measures which side prints more candles. If buyers close more candles than sellers, they control the rhythm of the market on this timeframe.",
    why: "Frequency matters because consistent directional printing reveals sustained institutional order flow. A side that prints 60%+ candles is being actively driven by real participants, not noise.",
  },
  Momentum: {
    what: "Compares the average pip range per candle between the dominant side and the weaker side. Tells you HOW HARD each side pushes when they do move.",
    why: "Even if both sides print equal candles, the side with larger average range per candle is carrying more force. A 1.5x+ momentum ratio means every dominant candle delivers 50% more movement than the opposition.",
  },
  Displacement: {
    what: "The total cumulative pip movement for each side. This is the NET structural pressure -- how far price has actually been pushed in each direction.",
    why: "Displacement reveals true structural flow. A 2:1+ ratio means price has been displaced decisively. This metric filters out noise and shows where the real money is flowing across the entire sample.",
  },
  Alignment: {
    what: "Checks whether Frequency and Displacement agree. When the side that prints more candles ALSO has more total displacement, the timeframe is in a clean trending state.",
    why: "Misalignment (more candles one way but more pips the other) signals a transitional or distorted market. Large candles on one side are overpowering the count advantage. This is where most retail traders get trapped.",
  },
  Conviction: {
    what: "A composite score (0-100%) combining Frequency, Momentum, Displacement, and Alignment into a single confidence grade for this timeframe.",
    why: "High conviction (70%+) means all metrics agree -- enter with standard risk. Moderate (40-70%) means lean directional but manage tight. Low (<40%) means mixed data -- do not anchor bias to this timeframe alone.",
  },
}

/* ═══════════════════════════════════════════════════════════════
   METRIC POPUP -- Extracted component for AnimatePresence compat
   ��══════════════════════════════════════════════════════════════ */
function MetricPopup({ metric: met }: {
  metric: { name: MetricName; value: string; rgb: string; subValues: Array<{ label: string; val: string; rgb: string }>; dataText: string }
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15, ease: MOTION.ease }}
    >
      <div className="mt-1 overflow-hidden"
        style={{
          background: `rgba(${met.rgb},0.03)`,
          borderRadius: 8,
          border: `1px solid rgba(${met.rgb},0.08)`,
        }}
      >
        {/* Header + sub-values in one compact row */}
        <div className="flex items-center gap-2 px-2.5 py-1.5"
          style={{ borderBottom: `1px solid rgba(${met.rgb},0.05)` }}>
          <motion.div className="w-[4px] h-[4px] rounded-full shrink-0"
            style={{ background: `rgba(${met.rgb},0.5)` }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-[8px] font-mono uppercase tracking-[0.1em] font-bold"
            style={{ color: `rgba(${met.rgb},0.5)` }}>
            {met.name}
          </span>
          <div className="flex-1" />
          {met.subValues.map((sv, si) => (
            <div key={si} className="flex items-center gap-1">
              <span className="text-[6.5px] font-mono uppercase tracking-wider"
                style={{ color: `rgba(${sv.rgb},0.28)` }}>
                {sv.label}
              </span>
              <span className="text-[8.5px] font-mono font-bold"
                style={{ color: `rgba(${sv.rgb},0.55)` }}>
                {sv.val}
              </span>
            </div>
          ))}
        </div>
        {/* Data breakdown text */}
        <div className="px-2.5 py-2">
          <p className="text-[8.5px] leading-[1.7]"
            style={{ color: "rgba(203,213,225,0.45)" }}>
            {met.dataText}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TF ANALYSIS CARD v10 -- Premium header + 5 horizontal metric
   buttons with hover-to-reveal breakdown below.
   ═══════════════════════════════════════════════════════════════ */
function TfAnalysisCard({
  tf, fullTf, data, index, isHovered, onHover, onLeave, modeAccentRgb,
}: {
  tf: string; fullTf: string; data: CardAnalysisResult; index: number
  isHovered: boolean; onHover: () => void; onLeave: () => void
  modeAccentRgb: string
}) {
  const m = computeTfMetrics(data)
  const all = computeAllMetrics(data, tf)
  const [activeMetric, setActiveMetric] = useState<number | null>(null)

  const metrics = useMemo(() => {
    const freqPct = data.total > 0 ? (Math.max(data.bullCount, data.bearCount) / data.total) * 100 : 50
    const freqDir = data.bullCount >= data.bearCount ? "up" : "down"
    const momDir = data.avgBullishRange >= data.avgBearishRange ? "up" : "down"
    const domWord = m.dom === "bull" ? "buyers" : m.dom === "bear" ? "sellers" : "neither side"

    return [
      {
        name: "Frequency" as MetricName,
        value: `${Math.max(data.bullCount, data.bearCount)}/${data.total}`,
        subValues: [
          { label: "Bull", val: `${data.bullCount}`, rgb: ACCENT.emerald.rgb },
          { label: "Bear", val: `${data.bearCount}`, rgb: ACCENT.rose.rgb },
          { label: "Skew", val: `${freqPct.toFixed(0)}%`, rgb: m.rgb },
        ],
        pct: Math.max((freqPct - 50) * 2, 3),
        rgb: m.rgb,
        dataText: `Out of ${data.total} candles on ${tf}, ${data.bullCount} closed bullish and ${data.bearCount} closed bearish. ${freqPct.toFixed(0)}% ${freqDir}-side skew.`,
      },
      {
        name: "Momentum" as MetricName,
        value: `${all.momentum.bigAvg.toFixed(1)}p`,
        subValues: [
          { label: "Dominant", val: `${all.momentum.bigAvg.toFixed(1)}p`, rgb: m.rgb },
          { label: "Opposite", val: `${all.momentum.smallAvg.toFixed(1)}p`, rgb: ACCENT.slate.rgb },
          { label: "Ratio", val: `${all.momentum.momRatio.toFixed(1)}x`, rgb: m.rgb },
        ],
        pct: Math.max(all.momentum.pct, 3),
        rgb: m.rgb,
        dataText: `${momDir.charAt(0).toUpperCase() + momDir.slice(1)} candles avg ${all.momentum.bigAvg.toFixed(1)}p vs ${all.momentum.smallAvg.toFixed(1)}p opposite. ${all.momentum.momRatio.toFixed(1)}x ratio.`,
      },
      {
        name: "Displacement" as MetricName,
        value: `${all.displacement.totalBig.toFixed(0)}p`,
        subValues: [
          { label: "Net", val: `${all.displacement.totalBig.toFixed(0)}p`, rgb: m.rgb },
          { label: "Counter", val: `${all.displacement.totalSmall.toFixed(0)}p`, rgb: ACCENT.slate.rgb },
          { label: "Ratio", val: `1:${m.ratio.toFixed(1)}`, rgb: m.rgb },
        ],
        pct: Math.max(all.displacement.pct, 3),
        rgb: m.rgb,
        dataText: `${all.displacement.dir}-side: ${all.displacement.totalBig.toFixed(0)}p total. Counter: ${all.displacement.totalSmall.toFixed(0)}p. Net ratio 1:${m.ratio.toFixed(1)} favoring ${domWord}.`,
      },
      {
        name: "Alignment" as MetricName,
        value: m.countAligned ? "Aligned" : "Conflict",
        subValues: [
          { label: "Count", val: data.bullCount > data.bearCount ? "Bull" : "Bear", rgb: data.bullCount > data.bearCount ? ACCENT.emerald.rgb : ACCENT.rose.rgb },
          { label: "Range", val: data.bullishTotalRange > data.bearishTotalRange ? "Bull" : "Bear", rgb: data.bullishTotalRange > data.bearishTotalRange ? ACCENT.emerald.rgb : ACCENT.rose.rgb },
          { label: "Status", val: m.countAligned ? "Match" : "Split", rgb: m.countAligned ? m.rgb : ACCENT.amber.rgb },
        ],
        pct: Math.max(m.countAligned ? Math.min(m.ratio * 25, 100) : 15, 3),
        rgb: m.countAligned ? m.rgb : ACCENT.amber.rgb,
        dataText: `Count: ${data.bullCount > data.bearCount ? "bulls" : "bears"} (${Math.max(data.bullCount, data.bearCount)} vs ${Math.min(data.bullCount, data.bearCount)}). Range: ${data.bullishTotalRange > data.bearishTotalRange ? "bulls" : "bears"} (${Math.max(data.bullishTotalRange, data.bearishTotalRange).toFixed(0)}p vs ${Math.min(data.bullishTotalRange, data.bearishTotalRange).toFixed(0)}p). ${m.countAligned ? "Both agree." : "They disagree -- split signal."}`,
      },
      {
        name: "Conviction" as MetricName,
        value: `${all.conviction.score.toFixed(0)}%`,
        subValues: [
          { label: "Score", val: `${all.conviction.score.toFixed(0)}%`, rgb: all.conviction.score > 60 ? m.rgb : all.conviction.score > 35 ? ACCENT.amber.rgb : ACCENT.slate.rgb },
          { label: "Grade", val: all.conviction.score > 70 ? "Strong" : all.conviction.score > 40 ? "Moderate" : "Weak", rgb: all.conviction.score > 60 ? m.rgb : all.conviction.score > 35 ? ACCENT.amber.rgb : ACCENT.slate.rgb },
          { label: "Bias", val: m.dom === "bull" ? "Buy" : m.dom === "bear" ? "Sell" : "Flat", rgb: m.rgb },
        ],
        pct: Math.max(all.conviction.pct, 3),
        rgb: all.conviction.score > 60 ? m.rgb : all.conviction.score > 35 ? ACCENT.amber.rgb : ACCENT.slate.rgb,
        dataText: `Conviction: ${all.conviction.score.toFixed(0)}%. Bias: ${m.dom === "bull" ? "buyers" : m.dom === "bear" ? "sellers" : "neutral"}. Grade: ${all.conviction.score > 70 ? "strong" : all.conviction.score > 40 ? "moderate" : "weak"}.`,
      },
    ]
  }, [data, m, all, tf])

  const domLabel = m.dom === "bull" ? "BUY" : m.dom === "bear" ? "SELL" : "FLAT"
  const convScore = all.conviction.score

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.12, duration: 0.6, ease: MOTION.ease }}
      className="relative overflow-hidden flex flex-col group/tf"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        background: isHovered ? `rgba(${m.rgb},0.03)` : SURFACE.recess,
        borderRadius: RADIUS.inner,
        transition: "all 0.4s cubic-bezier(0.33,1,0.68,1)",
        boxShadow: isHovered ? `inset 0 0 30px rgba(${m.rgb},0.03), ${GLOW.low(m.rgb)}` : "none",
      }}
    >
      {/* Top gradient accent */}
      <motion.div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${m.rgb},${isHovered ? 0.5 : 0.15}), rgba(${modeAccentRgb},${isHovered ? 0.3 : 0.08}), transparent)`,
          transition: "all 0.3s",
        }}
        animate={isHovered ? { opacity: [0.6, 1, 0.6] } : {}}
        transition={isHovered ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : {}}
      />

      {/* Hover glow */}
      {isHovered && (
        <motion.div className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
          style={{ background: `radial-gradient(ellipse at 50% 0%, rgba(${m.rgb},0.05) 0%, transparent 60%)` }}
        />
      )}

      <div className="relative z-10 px-4 py-3 flex-1 flex flex-col">
        {/* ── PREMIUM HEADER ── */}
        <div className="flex items-center gap-3 mb-3">
          {/* TF badge */}
          <motion.div className="relative flex items-center justify-center"
            style={{
              width: 44, height: 44,
              borderRadius: 12,
              background: `linear-gradient(135deg, rgba(${m.rgb},${isHovered ? 0.12 : 0.06}), rgba(${modeAccentRgb},0.03))`,
              border: `1px solid rgba(${m.rgb},${isHovered ? 0.15 : 0.05})`,
              transition: "all 0.3s",
            }}
            animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
          >
            <span className="text-[16px] font-black font-mono tracking-tighter"
              style={{ color: `rgba(226,232,240,${isHovered ? 0.95 : 0.7})`, transition: "color 0.3s" }}>
              {tf}
            </span>
            {/* Corner dot */}
            <motion.div className="absolute -top-0.5 -right-0.5 w-[7px] h-[7px] rounded-full"
              style={{
                background: `rgba(${m.rgb},${isHovered ? 0.7 : 0.3})`,
                boxShadow: isHovered ? `0 0 6px rgba(${m.rgb},0.4)` : "none",
                transition: "all 0.3s",
              }}
              animate={isHovered ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Title + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-tight"
                style={{ color: `rgba(226,232,240,${isHovered ? 0.85 : 0.55})`, transition: "color 0.3s" }}>
                {fullTf}
              </span>
              <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-[2px] rounded"
                style={{
                  color: `rgba(${m.rgb},${isHovered ? 0.8 : 0.5})`,
                  background: `rgba(${m.rgb},${isHovered ? 0.12 : 0.05})`,
                  transition: "all 0.3s",
                }}>
                {domLabel}
              </span>
            </div>
            {/* Micro stats row */}
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[9px] font-mono"
                style={{ color: `rgba(${ACCENT.emerald.rgb},0.4)` }}>
                {data.bullCount}
              </span>
              <span className="text-[7px]" style={{ color: "rgba(148,163,184,0.15)" }}>{"/"}</span>
              <span className="text-[9px] font-mono"
                style={{ color: `rgba(${ACCENT.rose.rgb},0.4)` }}>
                {data.bearCount}
              </span>
              <span className="text-[7px] font-mono" style={{ color: "rgba(148,163,184,0.15)" }}>{"/"}</span>
              <span className="text-[9px] font-mono" style={{ color: "rgba(148,163,184,0.25)" }}>
                {data.total}
              </span>
            </div>
          </div>

          {/* Ratio + conviction */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <motion.span className="text-[16px] font-black font-mono tracking-tighter leading-none"
              style={{ color: `rgba(${m.rgb},${isHovered ? 0.85 : 0.45})` }}
              animate={isHovered ? { opacity: [0.65, 1, 0.65] } : {}}
              transition={isHovered ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : {}}
            >{"1:"}{m.ratio.toFixed(1)}</motion.span>
            <div className="flex items-center gap-1">
              <div className="w-10 h-[3px] rounded-full overflow-hidden"
                style={{ background: "rgba(148,163,184,0.06)" }}>
                <motion.div className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${convScore}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: MOTION.ease }}
                  style={{ background: `rgba(${metrics[4].rgb},0.5)` }}
                />
              </div>
              <span className="text-[8px] font-mono font-bold"
                style={{ color: `rgba(${metrics[4].rgb},0.45)` }}>
                {convScore.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Dominance bar */}
        <div className="relative h-[3px] mb-3 overflow-hidden"
          style={{ borderRadius: 4, background: "rgba(148,163,184,0.04)" }}>
          <motion.div className="absolute left-0 top-0 bottom-0"
            initial={{ width: 0 }}
            animate={{ width: `${m.bullPct}%` }}
            transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: MOTION.ease }}
            style={{ background: `rgba(${ACCENT.emerald.rgb},0.4)`, borderRadius: 4 }}
          />
          <motion.div className="absolute right-0 top-0 bottom-0"
            initial={{ width: 0 }}
            animate={{ width: `${100 - m.bullPct}%` }}
            transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: MOTION.ease }}
            style={{ background: `rgba(${ACCENT.rose.rgb},0.4)`, borderRadius: 4 }}
          />
        </div>

        {/* ── 5 METRIC BUTTONS -- Full names, horizontal strip ── */}
        <div className="flex gap-[3px] mb-1">
          {metrics.map((met, mi) => {
            const isActive = activeMetric === mi
            return (
              <motion.button key={met.name}
                className="flex-1 flex flex-col items-center gap-[3px] py-2 px-1.5 cursor-pointer relative overflow-hidden"
                onMouseEnter={() => setActiveMetric(mi)}
                onMouseLeave={() => setActiveMetric(null)}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.12 + mi * 0.05, duration: 0.3, ease: MOTION.ease }}
                style={{
                  background: isActive ? `rgba(${met.rgb},0.08)` : `rgba(${met.rgb},0.015)`,
                  borderRadius: 8,
                  border: `1px solid rgba(${met.rgb},${isActive ? 0.18 : 0.03})`,
                  transition: "all 0.25s cubic-bezier(0.33,1,0.68,1)",
                }}
              >
                {/* Active top accent */}
                <motion.div className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: `rgba(${met.rgb},${isActive ? 0.5 : 0})`, transition: "all 0.2s" }}
                />
                {/* Label -- FULL NAME */}
                <span className="text-[7px] font-mono uppercase tracking-[0.08em] font-bold leading-none"
                  style={{ color: `rgba(${met.rgb},${isActive ? 0.75 : 0.28})`, transition: "color 0.2s" }}>
                  {met.name}
                </span>
                {/* Value */}
                <span className="text-[11px] font-mono font-black leading-none"
                  style={{ color: `rgba(${met.rgb},${isActive ? 0.9 : 0.45})`, transition: "color 0.2s" }}>
                  {met.value}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* ── HOVER WINDOW POPUP -- Rich educational breakdown ── */}
        <AnimatePresence>
          {activeMetric !== null && (
            <MetricPopup key={activeMetric} metric={metrics[activeMetric]} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   DIRECTIONAL BIAS PANEL -- Permanent panel showing final
   directional bias with per-TF breakdown. Replaces the old
   confluence map SVG.
   ═══════════════════════════════════════════════════════════════ */
function DirectionalBiasPanel({
  tfMetrics, convergence, domRgb, modeAccentRgb, modeLabel,
}: {
  tfMetrics: Array<{ tf: string; dom: string; ratio: number; rgb: string; strength: number; convScore: number }>
  convergence: { allAligned: boolean; aligned: boolean; domSide: string; ratio: number; totalBull: number; totalBear: number; totalBullRange: number; totalBearRange: number }
  domRgb: string; modeAccentRgb: string; modeLabel: string
}) {
  const biasDirection = convergence.domSide === "bull" ? "BUY" : convergence.domSide === "bear" ? "SELL" : "NEUTRAL"
  const agreeing = tfMetrics.filter(t => t.dom === convergence.domSide).length
  const total = tfMetrics.length
  const avgConv = total > 0 ? tfMetrics.reduce((s, t) => s + t.convScore, 0) / total : 0

  const tfBreakdowns = useMemo(() => {
    return tfMetrics.map((tm, i) => {
      const role = i === 0 ? "entry timing" : i === 1 ? "directional anchor" : "structural context"
      const agrees = tm.dom === convergence.domSide
      return {
        tf: tm.tf,
        agrees,
        role,
        text: agrees
          ? `${tm.tf} confirms the ${biasDirection.toLowerCase()} bias with a 1:${tm.ratio.toFixed(1)} displacement ratio and ${tm.convScore.toFixed(0)}% conviction. Use this timeframe for ${role}. The structure supports continuation -- ${tm.tf} is actively printing in the same direction as the overall read.`
          : `${tm.tf} diverges from the primary bias. Its structure leans ${tm.dom === "bull" ? "bullish" : tm.dom === "bear" ? "bearish" : "flat"} with a 1:${tm.ratio.toFixed(1)} ratio. This is the timeframe to monitor for either a flip (confirming the broader bias) or a structural break (warning of reversal). As ${role}, this divergence demands caution.`,
      }
    })
  }, [tfMetrics, convergence.domSide, biasDirection])

  return (
    <motion.div className="mt-auto"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6, ease: MOTION.ease }}
    >
      <div className="relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg, rgba(${domRgb},0.05), rgba(12,15,22,0.95), rgba(${domRgb},0.02))`,
          borderRadius: 10,
          border: `1px solid rgba(${domRgb},0.1)`,
          boxShadow: `inset 0 1px 0 rgba(${domRgb},0.05)`,
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 px-3 py-2.5"
          style={{ borderBottom: `1px solid rgba(${domRgb},0.06)` }}>
          <motion.div className="w-[6px] h-[6px] rounded-full"
            style={{ background: `rgba(${domRgb},0.6)` }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-[9px] font-mono uppercase tracking-[0.1em] font-bold"
            style={{ color: `rgba(${domRgb},0.55)` }}>
            Final Directional Bias
          </span>
          <div className="flex-1" />
          <span className="text-[14px] font-mono font-black"
            style={{ color: `rgba(${domRgb},0.8)` }}>
            {biasDirection}
          </span>
        </div>

        {/* Summary stats */}
        <div className="flex gap-4 px-3 py-2"
          style={{ borderBottom: `1px solid rgba(${domRgb},0.04)` }}>
          <div className="flex items-center gap-1.5">
            <span className="text-[7px] font-mono uppercase" style={{ color: "rgba(148,163,184,0.25)" }}>Agreement</span>
            <span className="text-[10px] font-mono font-bold" style={{ color: `rgba(${domRgb},0.6)` }}>{agreeing}/{total}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[7px] font-mono uppercase" style={{ color: "rgba(148,163,184,0.25)" }}>Avg Conv</span>
            <span className="text-[10px] font-mono font-bold" style={{ color: `rgba(${domRgb},0.6)` }}>{avgConv.toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[7px] font-mono uppercase" style={{ color: "rgba(148,163,184,0.25)" }}>Net Ratio</span>
            <span className="text-[10px] font-mono font-bold" style={{ color: `rgba(${domRgb},0.6)` }}>1:{convergence.ratio.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[7px] font-mono uppercase" style={{ color: "rgba(148,163,184,0.25)" }}>Status</span>
            <span className="text-[10px] font-mono font-bold"
              style={{ color: `rgba(${convergence.allAligned ? domRgb : convergence.aligned ? ACCENT.amber.rgb : ACCENT.slate.rgb},0.6)` }}>
              {convergence.allAligned ? "Confirmed" : convergence.aligned ? "Partial" : "Split"}
            </span>
          </div>
        </div>

        {/* Per-TF breakdown */}
        <div className="px-3 py-2.5 space-y-2.5">
          {tfBreakdowns.map((tb, i) => (
            <motion.div key={tb.tf}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 + i * 0.1, duration: 0.3, ease: MOTION.ease }}
            >
              <div className="flex items-center gap-2 mb-1">
                <motion.div className="w-[5px] h-[5px] rounded-full"
                  style={{ background: `rgba(${tfMetrics[i]?.rgb || domRgb},${tb.agrees ? 0.6 : 0.25})` }}
                  animate={tb.agrees ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                />
                <span className="text-[8px] font-mono font-bold uppercase tracking-wider"
                  style={{ color: `rgba(${tfMetrics[i]?.rgb || domRgb},0.5)` }}>
                  {tb.tf}
                </span>
                <span className="text-[7px] font-mono uppercase tracking-wider"
                  style={{ color: "rgba(148,163,184,0.2)" }}>
                  {tb.role}
                </span>
                <div className="flex-1" />
                <span className="text-[7px] font-mono font-bold uppercase"
                  style={{ color: `rgba(${tb.agrees ? (tfMetrics[i]?.rgb || domRgb) : ACCENT.amber.rgb},0.45)` }}>
                  {tb.agrees ? "Confirms" : "Diverges"}
                </span>
              </div>
              <p className="text-[8.5px] leading-[1.7] pl-[13px]"
                style={{ color: "rgba(203,213,225,0.42)" }}>
                {tb.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Final action line */}
        <div className="px-3 pb-3 pt-1"
          style={{ borderTop: `1px solid rgba(${domRgb},0.04)` }}>
          <p className="text-[8.5px] leading-[1.7] italic"
            style={{ color: `rgba(${domRgb},0.3)` }}>
            {convergence.allAligned
              ? `All ${total} timeframes converge on ${biasDirection.toLowerCase()}. This is the strongest possible structural confirmation for ${modeLabel.toLowerCase()} entries. Counter-trend positions require a visible break on at least one timeframe before becoming viable.`
              : convergence.aligned
                ? `${agreeing} of ${total} timeframes agree on ${biasDirection.toLowerCase()}. The diverging timeframe is the critical variable -- monitor it for either a confirming flip or a warning of structural reversal. Proceed with directional bias but manage risk tighter than full-confluence scenarios.`
                : `Timeframes are split. No clear multi-timeframe agreement exists. This is a high-risk environment for directional bets. Wait for at least ${Math.ceil(total * 0.66)} timeframes to agree before committing to a ${modeLabel.toLowerCase()} entry.`
            }
          </p>
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CONVERGENCE MATRIX v9 -- SYNTHESIS TOP + 3 TF CARDS
   Top: Swing Synthesis (conviction gauge + narrative)
   Below: 3 TF cards side by side, each with 5 hoverable metric
   rows and a permanent combined breakdown at the bottom.
   ═══════════════════════════════════════════════════════════════ */
function ConvergenceMatrix({
  allData, timeframes, mode, modeAccentRgb,
}: {
  allData: Array<{ tf: string; fullTf: string; data: CardAnalysisResult | null }>
  timeframes: string[]
  mode: Mode
  modeAccentRgb: string
}) {
  const [hoveredTf, setHoveredTf] = useState<number | null>(null)

  const convergence = useMemo(() => {
    let totalBull = 0, totalBear = 0, totalBullRange = 0, totalBearRange = 0
    allData.forEach(({ data: d }) => {
      if (!d) return
      totalBull += d.bullCount; totalBear += d.bearCount
      totalBullRange += d.bullishTotalRange; totalBearRange += d.bearishTotalRange
    })
    const totalCandles = totalBull + totalBear
    const totalRange = totalBullRange + totalBearRange
    const candleSkew = totalCandles > 0 ? (totalBull - totalBear) / totalCandles : 0
    const rangeSkew = totalRange > 0 ? (totalBullRange - totalBearRange) / totalRange : 0
    const aligned = (candleSkew >= 0 && rangeSkew >= 0) || (candleSkew <= 0 && rangeSkew <= 0)
    const domSide = rangeSkew > 0.05 ? "bull" : rangeSkew < -0.05 ? "bear" : "neutral"
    const tfDomSides = allData.map(({ data: d }) => {
      if (!d) return "neutral"
      const tr = d.bullishTotalRange + d.bearishTotalRange
      const rs_ = tr > 0 ? (d.bullishTotalRange - d.bearishTotalRange) / tr : 0
      return rs_ > 0.05 ? "bull" : rs_ < -0.05 ? "bear" : "neutral"
    })
    const allAligned = tfDomSides.every(s => s === tfDomSides[0]) && tfDomSides[0] !== "neutral"
    const ratio = totalBullRange > totalBearRange
      ? totalBearRange > 0 ? totalBullRange / totalBearRange : 99
      : totalBullRange > 0 ? totalBearRange / totalBullRange : 99
    return {
      totalBull, totalBear, totalBullRange, totalBearRange,
      candleSkew, rangeSkew, aligned, allAligned,
      domSide, ratio: Math.min(ratio, 99), tfDomSides,
    }
  }, [allData])

  const domRgb = convergence.domSide === "bull" ? ACCENT.emerald.rgb
    : convergence.domSide === "bear" ? ACCENT.rose.rgb : ACCENT.slate.rgb
  const modeLabel = mode === "scalp" ? "Scalp" : mode === "day" ? "Day Trade" : "Swing"

  /* Synthesis */
  const synthesis = useMemo(() => {
    const valid = allData.filter(d => d.data) as Array<{ tf: string; data: CardAnalysisResult }>
    if (valid.length === 0) return { title: "", text: "", actionText: "", convictionPct: 0 }

    const sides = valid.map(({ tf, data: dd }) => {
      const m = computeTfMetrics(dd)
      return { tf, dom: m.dom, ratio: m.ratio, countAligned: m.countAligned }
    })
    const allSame = sides.every(s => s.dom === sides[0].dom) && sides[0].dom !== "neutral"

    if (allSame) {
      const dir = sides[0].dom === "bull" ? "buyers" : "sellers"
      const strongest = sides.reduce((a, b) => a.ratio > b.ratio ? a : b)
      const pct = Math.min(80 + convergence.ratio * 4, 100)
      return {
        title: `Full Confluence -- ${dir.charAt(0).toUpperCase() + dir.slice(1)} Confirmed`,
        text: `All ${valid.length} timeframes confirm ${dir} in control. ${strongest.tf} leads with the strongest signal at 1:${strongest.ratio.toFixed(1)}. Every layer of market structure agrees -- this is the clearest read you can get across ${modeLabel.toLowerCase()} timeframes.`,
        actionText: `${modeLabel} entries aligned with ${dir} carry the highest probability here. Counter-trend setups require a structural break on at least one timeframe before becoming viable. Anchor your bias to the ${strongest.tf} for timing.`,
        convictionPct: pct,
      }
    } else {
      const groups: Record<string, string[]> = {}
      sides.forEach(s => { (groups[s.dom] ??= []).push(s.tf) })
      const majority = Object.entries(groups).sort((a, b) => b[1].length - a[1].length)[0]
      const pct = Math.min(20 + (majority[1].length / valid.length) * 45, 100)
      const desc = Object.entries(groups).map(([side, tfs]) => `${tfs.join(" + ")} reading ${side === "bull" ? "buyers" : side === "bear" ? "sellers" : "neutral"}`).join(" while ")
      return {
        title: "Diverging Structure -- Timeframes Split",
        text: `${desc}. The market is in a transitional phase -- one timeframe may be leading a directional shift while others lag behind. This is where most traders get trapped by acting on a single timeframe.`,
        actionText: `For ${modeLabel.toLowerCase()} setups, wait for at least 2-of-3 timeframes to agree before taking directional risk. The minority timeframe is the one to watch -- when it flips, that creates the entry signal. Until then, reduce size or stay flat.`,
        convictionPct: pct,
      }
    }
  }, [allData, convergence.ratio, modeLabel])

  /* Per-TF computed metrics for the SVG confluence viz */
  const tfMetrics = useMemo(() => {
    return allData.map(({ tf, data: d }) => {
      if (!d) return { tf, dom: "neutral" as const, ratio: 1, rgb: ACCENT.slate.rgb, strength: 0, convScore: 0 }
      const m = computeTfMetrics(d)
      const all = computeAllMetrics(d, tf)
      return { tf, dom: m.dom, ratio: m.ratio, rgb: m.rgb, strength: m.strength, convScore: all.conviction.score }
    })
  }, [allData])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8, ease: MOTION.ease }}
      className="relative overflow-hidden"
      style={{ background: SURFACE.card, borderRadius: RADIUS.card, boxShadow: ELEVATION.card }}
    >
      {/* Top accent line */}
      <motion.div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent 5%, rgba(${domRgb},0.4) 30%, rgba(${modeAccentRgb},0.3) 70%, transparent 95%)`,
        }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Ambient glow */}
      <motion.div className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: `radial-gradient(ellipse at 15% 20%, rgba(${domRgb},0.05) 0%, transparent 50%), radial-gradient(ellipse at 85% 80%, rgba(${modeAccentRgb},0.03) 0%, transparent 50%)`,
        }}
      />

      <div className="relative z-10 p-6">
        {/* ═══ HEADER ═══ */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <motion.div className="w-[3px] h-6 rounded-full"
              style={{ background: `rgba(${domRgb},0.5)` }}
              animate={{ opacity: [0.3, 0.8, 0.3], scaleY: [0.85, 1, 0.85] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div>
              <div className={TYPE.subtitle} style={{ color: `rgba(${modeAccentRgb},0.4)`, marginBottom: 2 }}>
                Structure Analysis
              </div>
              <div className="text-[15px] font-bold tracking-tight"
                style={{ color: "rgba(226,232,240,0.9)" }}>
                {modeLabel} -- {timeframes.join(" / ")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-2">
              <motion.span className="text-[24px] font-black font-mono leading-none tracking-tighter"
                style={{ color: `rgba(${domRgb},0.85)` }}
                animate={convergence.allAligned ? { opacity: [0.6, 1, 0.6] } : {}}
                transition={convergence.allAligned ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : {}}
              >{"1:"}{convergence.ratio.toFixed(1)}</motion.span>
              <span className="text-[9px] font-semibold uppercase tracking-wider"
                style={{ color: `rgba(${domRgb},0.35)` }}>
                {convergence.domSide === "bull" ? "Buyers" : convergence.domSide === "bear" ? "Sellers" : "Balanced"}
              </span>
            </div>

            <motion.div className="flex items-center gap-2 px-3 py-1.5"
              style={{
                background: convergence.allAligned ? `rgba(${domRgb},0.1)` : "rgba(148,163,184,0.04)",
                borderRadius: RADIUS.pill,
                boxShadow: convergence.allAligned ? GLOW.med(domRgb) : "none",
              }}
            >
              <motion.div className="w-[6px] h-[6px] rounded-full"
                style={{ background: convergence.allAligned ? `rgba(${domRgb},0.8)` : "rgba(148,163,184,0.2)" }}
                animate={convergence.allAligned ? { scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] } : {}}
                transition={convergence.allAligned ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : {}}
              />
              <span className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: convergence.allAligned ? `rgba(${domRgb},0.7)` : "rgba(148,163,184,0.3)" }}>
                {convergence.allAligned ? "Full Confluence" : convergence.aligned ? "Partial" : "Diverging"}
              </span>
            </motion.div>
          </div>
        </div>

        {/* ═══ MAIN LAYOUT: LEFT = Swing Synthesis | RIGHT = 3 TF Cards Stacked ═══ */}
        <div className="flex gap-5">

          {/* ── LEFT HALF: Enhanced Swing Synthesis ── */}
          <motion.div className="relative overflow-hidden flex-1 flex flex-col"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.7, ease: MOTION.ease }}
            style={{
              background: `linear-gradient(160deg, rgba(${domRgb},0.04), ${SURFACE.recess}, rgba(${modeAccentRgb},0.02))`,
              borderRadius: RADIUS.inner,
              padding: "20px 22px",
            }}
          >
            {/* Top accent */}
            <motion.div className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, rgba(${domRgb},0.3), rgba(${modeAccentRgb},0.18), transparent)`,
              }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Corner glow */}
            <motion.div className="absolute top-0 left-0 w-40 h-40 pointer-events-none"
              animate={{ opacity: [0.03, 0.08, 0.03] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ background: `radial-gradient(circle at 0% 0%, rgba(${domRgb},0.15) 0%, transparent 60%)` }}
            />

            {/* Synthesis header */}
            <div className="flex items-center gap-2.5 mb-4">
              <Eye className="w-3.5 h-3.5" style={{ color: `rgba(${domRgb},0.45)` }} />
              <span className="text-[9px] font-mono uppercase tracking-[0.15em] font-bold"
                style={{ color: `rgba(${modeAccentRgb},0.4)` }}>
                Swing Synthesis
              </span>
              <motion.div className="h-px flex-1"
                style={{ background: `linear-gradient(90deg, rgba(${domRgb},0.1), transparent)` }}
              />
            </div>

            {/* Conviction row -- horizontal with gauge + text */}
            <div className="flex items-center gap-4 mb-4">
              {/* Mini gauge */}
              <div className="relative shrink-0" style={{ width: 64, height: 64 }}>
                <motion.div className="absolute inset-[-5px] rounded-full"
                  animate={convergence.allAligned ? { scale: [1, 1.06, 1], opacity: [0.05, 0.12, 0.05] } : { opacity: 0 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{ border: `1px solid rgba(${domRgb},0.15)` }}
                />
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(148,163,184,0.04)"
                    strokeWidth="4" strokeDasharray={`${Math.PI * 52 * 0.75} ${Math.PI * 52 * 0.25}`}
                    strokeLinecap="round" transform="rotate(135, 32, 32)" />
                  <motion.circle cx="32" cy="32" r="26" fill="none"
                    stroke={`rgba(${domRgb},0.55)`} strokeWidth="4"
                    strokeDasharray={`${Math.PI * 52 * 0.75} ${Math.PI * 52 * 0.25}`}
                    strokeLinecap="round" transform="rotate(135, 32, 32)"
                    initial={{ strokeDashoffset: Math.PI * 52 * 0.75 }}
                    animate={{ strokeDashoffset: Math.PI * 52 * 0.75 * (1 - synthesis.convictionPct / 100) }}
                    transition={{ duration: 1.8, delay: 0.8, ease: MOTION.ease }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span className="text-[18px] font-black font-mono leading-none"
                    style={{ color: `rgba(${domRgb},0.9)` }}
                    animate={convergence.allAligned ? { opacity: [0.7, 1, 0.7] } : {}}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >{synthesis.convictionPct.toFixed(0)}</motion.span>
                </div>
              </div>

              {/* Title + status */}
              <div className="flex-1">
                <div className="text-[12px] font-bold tracking-tight mb-1"
                  style={{ color: `rgba(${domRgb},0.65)` }}>
                  {synthesis.title}
                </div>
                <div className="flex items-center gap-2">
                  <motion.div className="w-[5px] h-[5px] rounded-full"
                    style={{ background: `rgba(${domRgb},${convergence.allAligned ? 0.7 : 0.2})` }}
                    animate={convergence.allAligned ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span className="text-[9px] font-mono font-bold"
                    style={{ color: `rgba(${domRgb},0.4)` }}>
                    {"1:"}{convergence.ratio.toFixed(1)} {convergence.domSide === "bull" ? "Buyers" : convergence.domSide === "bear" ? "Sellers" : "Balanced"}
                  </span>
                </div>
              </div>
            </div>

            {/* Synthesis narrative */}
            <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5, ease: MOTION.ease }}
              className="text-[10px] leading-[1.85] mb-3"
              style={{ color: "rgba(203,213,225,0.5)" }}>
              {synthesis.text}
            </motion.p>

            {/* Action callout */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.5, ease: MOTION.ease }}
              className="relative pl-3 mb-5"
              style={{ borderLeft: `2px solid rgba(${domRgb},0.12)` }}
            >
              <p className="text-[10px] leading-[1.85]"
                style={{ color: `rgba(${domRgb},0.38)` }}>
                {synthesis.actionText}
              </p>
            </motion.div>

            {/* ── DIRECTIONAL BIAS PANEL -- Permanent ── */}
            <DirectionalBiasPanel
              tfMetrics={tfMetrics}
              convergence={convergence}
              domRgb={domRgb}
              modeAccentRgb={modeAccentRgb}
              modeLabel={modeLabel}
            />
          </motion.div>

          {/* ── RIGHT HALF: 3 TF Cards Stacked Vertically ── */}
          <div className="flex-1 flex flex-col gap-2.5">
            {allData.map(({ tf, fullTf, data: d }, i) => {
              if (!d) return null
              return (
                <TfAnalysisCard key={tf}
                  tf={tf} fullTf={fullTf} data={d} index={i}
                  isHovered={hoveredTf === i}
                  onHover={() => setHoveredTf(i)}
                  onLeave={() => setHoveredTf(null)}
                  modeAccentRgb={modeAccentRgb}
                />
              )
            })}
          </div>

        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MULTI-TIMEFRAME DISPLAY -- MAIN EXPORT
   ═══════════════════════════════════════════════════════════════ */
export function MultiTimeframeDisplay({ analysis, isLoading }: MultiTimeframeDisplayProps) {
  const [mode, setMode] = useState<Mode>("swing")
  const [legs, setLegs] = useState<Legs>(1)
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null)
  const analysisStore = useAnalysis()
  const { multiTimeframeBars = {} } = analysisStore || {}

  const modeAccent = MODE_ACCENT[mode] || ACCENT.purple

  /* Compute card data for all 3 cards */
  const allCardData = useMemo(() => {
    if (!analysis) return []
    const tfAnalyses = [analysis.weekly, analysis.daily, analysis.fourHour]
    return tfAnalyses.map((tfAnalysis, i) => {
      const cardConfig = MODE_CONFIG[mode].cards[i]
      const tf = cardConfig ? cardConfig.displayName : tfAnalysis.timeframe
      const fullTf = TF_FULL[tf] || tf
      const data = getCardAnalysis(multiTimeframeBars, mode, legs, i)
      return { tf, fullTf, data, analysis: tfAnalysis }
    })
  }, [analysis, mode, legs, multiTimeframeBars])

  const timeframeLabels = allCardData.map(d => d.tf)

  /* Loading */
  if (isLoading) {
    return (
      <div className="relative">
        <AmbientField />
        <div className="relative z-10">
          <CommandDeck mode={mode} legs={legs} onModeChange={setMode} onLegsChange={setLegs} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="relative h-80 overflow-hidden"
                style={{ background: SURFACE.card, borderRadius: RADIUS.card }}>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <div className="h-2.5 w-16 rounded" style={{ background: SURFACE.recess }} />
                      <div className="h-8 w-10 rounded" style={{ background: SURFACE.recess }} />
                    </div>
                    <div className="h-6 w-20 rounded-full" style={{ background: SURFACE.recess }} />
                  </div>
                  <div className="h-32 rounded-xl" style={{ background: SURFACE.recess }} />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-20 rounded-xl" style={{ background: SURFACE.recess }} />
                    <div className="h-20 rounded-xl" style={{ background: SURFACE.recess }} />
                  </div>
                </div>
                <motion.div className="absolute inset-0 pointer-events-none"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
                  style={{ background: GRADIENT.shimmer, width: "50%" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* Empty */
  if (!analysis) {
    return (
      <div className="relative">
        <AmbientField />
        <div className="relative z-10">
          <CommandDeck mode={mode} legs={legs} onModeChange={setMode} onLegsChange={setLegs} />
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <motion.div className="relative w-12 h-12"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: `rgba(${ACCENT.purple.rgb},0.3)`,
                      left: `${50 + 40 * Math.cos(i * 2.094)}%`,
                      top: `${50 + 40 * Math.sin(i * 2.094)}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                  />
                ))}
              </motion.div>
              <span className="text-[12px] font-mono uppercase tracking-wider"
                style={{ color: "rgba(148,163,184,0.3)" }}>No analysis data available</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <AmbientField hoveredCard={hoveredCardIndex} />

      <div className="relative z-10">
        <CommandDeck mode={mode} legs={legs} onModeChange={setMode} onLegsChange={setLegs} />

        <AnimatePresence mode="wait">
          <motion.div key={`${mode}-${legs}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 3 TIMEFRAME CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {allCardData.map((cd, i) => (
                <TimeframeCard key={`${mode}-${legs}-${i}`}
                  analysis={cd.analysis} index={i} mode={mode} legs={legs}
                  cardData={cd.data}
                  isOtherCardHovered={hoveredCardIndex !== null && hoveredCardIndex !== i}
                  onCardHover={() => setHoveredCardIndex(i)}
                  onCardLeave={() => setHoveredCardIndex(null)}
                />
              ))}
            </div>

            {/* FLOWING CONNECTIONS */}
            <div className="hidden md:block">
              <FlowingConnections modeAccent={modeAccent.rgb} />
            </div>

            {/* CONVERGENCE MATRIX */}
            <ConvergenceMatrix
              allData={allCardData}
              timeframes={timeframeLabels}
              mode={mode}
              modeAccentRgb={modeAccent.rgb}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
