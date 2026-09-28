"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CandleMiniChart } from "@/components/charts/CandleMiniChart"
import { useAnalysis } from "@/lib/stores/useAnalysis"
import { toPips, formatNYWeek, formatPercentChange } from "@/lib/utils/formatters"
import { type Mode, type Legs, MODE_CONFIG, type Candle } from "@/lib/types/trading-modes"
import { sliceByLegs } from "@/lib/analysis/market-structure-scan"
import { cn } from "@/lib/utils"
import { SURFACE, ELEVATION, RADIUS, MOTION, ACCENT, GLOW, GRADIENT } from "./mtf-theme"

interface CompactChartProps {
  timeframe: string
  mode: Mode
  legs: Legs
  highlightType?: "bull" | "bear" | null
  phaseRgb: string
}

export function CompactChart({
  timeframe,
  mode,
  legs,
  highlightType,
  phaseRgb,
}: CompactChartProps) {
  const analysisStore = useAnalysis()
  const { multiTimeframeBars = {} } = analysisStore || {}
  const [hover, setHover] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [chartWidth, setChartWidth] = useState(320)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.floor(entry.contentRect.width)
        if (w > 0) setChartWidth(w)
      }
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const bars = useMemo(() => {
    const tfBarMap: Record<string, keyof typeof multiTimeframeBars> = {
      "1W": "weekly",
      Weekly: "weekly",
      "1D": "daily",
      Daily: "daily",
      "4H": "h4",
      "1H": "h4",
      "15M": "h4",
      "5M": "h4",
    }
    const key = tfBarMap[timeframe]
    const allBars = key && multiTimeframeBars[key] ? (multiTimeframeBars[key] as Candle[]) : []
    const cardConfig = MODE_CONFIG[mode].cards.find((c) => {
      const m: Record<string, string> = {
        Weekly: "1w",
        Daily: "1d",
        "4H": "4h",
        "1D": "1d",
        "1W": "1w",
        "1H": "1h",
        "15M": "15m",
        "5M": "5m",
      }
      return c.tf === m[timeframe]
    })
    return cardConfig
      ? sliceByLegs(allBars, legs, cardConfig.fractalK, cardConfig.counts[legs])
      : allBars
  }, [multiTimeframeBars, timeframe, mode, legs])

  const bar = hover !== null && bars[hover] ? bars[hover] : undefined

  const filter =
    highlightType === "bull"
      ? { showBull: true, showBear: false }
      : highlightType === "bear"
        ? { showBull: false, showBear: true }
        : { showBull: true, showBear: true }

  /* ── Volume data ── */
  const volumeData = useMemo(() => {
    if (bars.length === 0) return []
    const maxRange = Math.max(...bars.map((b) => b.h - b.l)) || 1
    return bars.map((b) => ({
      pct: Math.min(100, ((b.h - b.l) / maxRange) * 100),
      isBull: b.c >= b.o,
    }))
  }, [bars])

  /* ── Empty ── */
  if (bars.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-[150px]"
        style={{ background: SURFACE.recess, borderRadius: RADIUS.inner }}
      >
        <div className="flex items-center gap-3">
          {/* Scan line animation */}
          <div className="relative w-24 h-[2px] overflow-hidden rounded-full" style={{ background: SURFACE.recess }}>
            <motion.div
              className="absolute top-0 h-full w-8"
              animate={{ left: ["-20%", "120%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: `linear-gradient(90deg, transparent, rgba(${phaseRgb},0.4), transparent)`,
                borderRadius: "2px",
              }}
            />
          </div>
          <span
            className="text-[11px] font-mono tracking-wider"
            style={{ color: "rgba(148,163,184,0.35)" }}
          >
            {"Loading " + timeframe + " candles..."}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative overflow-hidden" style={{ borderRadius: RADIUS.inner }}>
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{ borderRadius: RADIUS.inner }}
      >
        {[25, 50, 75].map((pct) => (
          <div
            key={pct}
            className="absolute left-0 right-0 h-px"
            style={{
              top: `${pct}%`,
              background:
                pct === 50
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(255,255,255,0.02)",
              borderStyle: pct !== 50 ? "dashed" : "solid",
            }}
          />
        ))}
      </div>

      {/* Phase region shading */}
      <div
        className="absolute inset-0 pointer-events-none z-[0]"
        style={{
          background: `linear-gradient(180deg, rgba(${phaseRgb},0.015) 0%, transparent 40%, transparent 60%, rgba(${phaseRgb},0.01) 100%)`,
          borderRadius: RADIUS.inner,
        }}
      />

      {/* Chart */}
      <CandleMiniChart
        bars={bars}
        width={chartWidth}
        height={150}
        pairSymbol="EURUSD"
        showGrid
        filter={filter}
        onHover={(i) => setHover(i)}
        className="rounded-[14px]"
      />

      {/* Hover crosshair vertical line */}
      {hover !== null && bars.length > 0 && (
        <div
          className="absolute top-0 bottom-0 w-px pointer-events-none z-[2]"
          style={{
            left: `${((hover + 0.5) / bars.length) * 100}%`,
            background: `rgba(${phaseRgb},0.15)`,
          }}
        />
      )}

      {/* Hover Tooltip -- enhanced card */}
      <AnimatePresence>
        {hover !== null && bar && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute top-2.5 right-2.5 px-3.5 py-2.5 z-20"
            style={{
              background: SURFACE.card,
              borderRadius: RADIUS.inner,
              boxShadow: ELEVATION.tooltip,
            }}
          >
            {/* Direction arrow */}
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background:
                    bar.c >= bar.o
                      ? `rgba(${ACCENT.emerald.rgb},0.6)`
                      : `rgba(${ACCENT.rose.rgb},0.6)`,
                }}
              />
              <span
                className="text-[9px] font-mono font-bold uppercase"
                style={{
                  color:
                    bar.c >= bar.o
                      ? `rgba(${ACCENT.emerald.rgb},0.7)`
                      : `rgba(${ACCENT.rose.rgb},0.7)`,
                }}
              >
                {bar.c >= bar.o ? "Bullish" : "Bearish"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-mono">
              <span style={{ color: "rgba(148,163,184,0.3)" }}>O</span>
              <span className="text-slate-300">{bar.o.toFixed(5)}</span>
              <span style={{ color: "rgba(148,163,184,0.3)" }}>H</span>
              <span className="text-slate-300">{bar.h.toFixed(5)}</span>
              <span style={{ color: "rgba(148,163,184,0.3)" }}>L</span>
              <span className="text-slate-300">{bar.l.toFixed(5)}</span>
              <span style={{ color: "rgba(148,163,184,0.3)" }}>C</span>
              <span className="text-slate-300">{bar.c.toFixed(5)}</span>
              <span style={{ color: "rgba(148,163,184,0.3)" }}>Range</span>
              <span style={{ color: `rgba(${ACCENT.emerald.rgb},0.8)` }}>
                {toPips(bar.h - bar.l, "EURUSD")}p
              </span>
              <span style={{ color: "rgba(148,163,184,0.3)" }}>Change</span>
              <span
                style={{
                  color:
                    bar.c >= bar.o
                      ? `rgba(${ACCENT.emerald.rgb},0.8)`
                      : `rgba(${ACCENT.rose.rgb},0.8)`,
                }}
              >
                {formatPercentChange(bar.o, bar.c)}
              </span>
              {timeframe === "1W" && (
                <>
                  <span style={{ color: "rgba(148,163,184,0.3)" }}>Week</span>
                  <span style={{ color: `rgba(${ACCENT.blue.rgb},0.6)` }}>
                    {formatNYWeek(bar.t)}
                  </span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Volume + Range Heatmap Strip */}
      <div className="flex gap-px mt-2.5 px-0.5">
        {volumeData.map((v, i) => {
          const dimmed =
            highlightType === "bull" ? !v.isBull : highlightType === "bear" ? v.isBull : false
          return (
            <div
              key={i}
              className={cn(
                "flex-1 overflow-hidden transition-opacity duration-200",
                dimmed ? "opacity-15" : "opacity-100",
              )}
              style={{ background: SURFACE.recess, borderRadius: "2px" }}
            >
              {/* Main range bar */}
              <div
                style={{
                  height: 5,
                  width: `${v.pct}%`,
                  borderRadius: "2px",
                  background: v.isBull
                    ? `rgba(${ACCENT.emerald.rgb},0.45)`
                    : `rgba(${ACCENT.rose.rgb},0.45)`,
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
