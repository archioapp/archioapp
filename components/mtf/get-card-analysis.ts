import { type Mode, type Legs, MODE_CONFIG, type Candle } from "@/lib/types/trading-modes"
import { sliceByLegs, analyzeSlice } from "@/lib/analysis/market-structure-scan"
import type { CardAnalysisResult } from "./types"

export function getCardAnalysis(
  multiTimeframeBars: Record<string, unknown>,
  mode: Mode,
  legs: Legs,
  index: number
): CardAnalysisResult | null {
  const currentModeConfig = MODE_CONFIG[mode]
  const cardConfig = currentModeConfig.cards[index]
  if (!cardConfig) return null

  const actualTimeframe = cardConfig.displayName
  let bars: Candle[] = []
  const tfMap: Record<string, string> = {
    "5M": "h1", "15M": "h4", "1H": "h4", "4H": "h4",
    "1D": "daily", "1W": "weekly", Weekly: "weekly", Daily: "daily",
  }
  const barsKey = tfMap[actualTimeframe]
  if (barsKey && (multiTimeframeBars as Record<string, Candle[]>)[barsKey]) {
    bars = (multiTimeframeBars as Record<string, Candle[]>)[barsKey]
  }

  if (bars.length > 0) {
    const slicedBars = sliceByLegs(bars, legs, cardConfig.fractalK, cardConfig.counts[legs])
    const stats = analyzeSlice(cardConfig.tf, slicedBars, 0.0001)
    return {
      bullCount: stats.bullCount,
      bearCount: stats.bearCount,
      sentiment: stats.bias.toLowerCase(),
      total: stats.bars,
      bullishTotalRange: stats.bullishTotalRange || 0,
      bearishTotalRange: stats.bearishTotalRange || 0,
      avgBullishRange: stats.avgBullishRange || 0,
      avgBearishRange: stats.avgBearishRange || 0,
      rangeRatio: stats.rangeDominance,
    }
  }

  const candleCount = cardConfig.counts[legs]
  const bullishCount = Math.ceil(candleCount * 0.55)
  return {
    bullCount: bullishCount,
    bearCount: candleCount - bullishCount,
    sentiment: "range",
    total: candleCount,
    bullishTotalRange: 0,
    bearishTotalRange: 0,
    avgBullishRange: 0,
    avgBearishRange: 0,
    rangeRatio: 1.0,
  }
}
