import type { Candle, Legs, SliceStats, Timeframe } from "@/lib/types/trading-modes"

export function trueRange(c: Candle): number {
  return c.h - c.l
}

export function toPips(points: number, pipSize = 0.0001): number {
  return points / pipSize
}

// Enhanced fractal pivot finder with better swing detection
export function findPivots(candles: Candle[], k: 2 | 3) {
  const highs: number[] = []
  const lows: number[] = []

  for (let i = k; i < candles.length - k; i++) {
    const slice = candles.slice(i - k, i + k + 1)
    const center = slice[k]

    const isHigh = slice.every((x, idx) => (idx === k ? true : x.h <= center.h))
    const isLow = slice.every((x, idx) => (idx === k ? true : x.l >= center.l))

    if (isHigh) highs.push(i)
    if (isLow) lows.push(i)
  }

  const pivots = [...new Set([...highs, ...lows])].sort((a, b) => a - b)
  return { highs, lows, pivots }
}

// Smart slice that respects swing structure
export function sliceByLegs(candles: Candle[], legs: Legs, k: 2 | 3, fallbackBars: number): Candle[] {
  if (candles.length <= fallbackBars) return candles.slice()

  const { pivots } = findPivots(candles, k)
  if (pivots.length < legs + 1) {
    return candles.slice(-fallbackBars)
  }

  // Start at pivot before the visible legs
  const pivotIdx = pivots[pivots.length - (legs + 1)]
  const slice = candles.slice(pivotIdx, candles.length)

  // Ensure minimum bars for analysis
  if (slice.length < Math.min(fallbackBars, 8)) {
    return candles.slice(-fallbackBars)
  }

  return slice
}

// Advanced structure bias calculation
export function structureBias(candles: Candle[], rd: number): "Bullish" | "Bearish" | "Range" {
  if (candles.length < 6) return "Range"

  const k: 2 | 3 = candles.length > 60 ? 3 : 2
  const { highs, lows } = findPivots(candles, k)

  let bosUp = false,
    bosDown = false

  // Check for break of structure
  if (highs.length >= 2) {
    const lastHigh = highs[highs.length - 1]
    const prevHigh = highs[highs.length - 2]
    const maxSincePrevHigh = Math.max(...candles.slice(prevHigh + 1).map((c) => c.c))
    bosUp = maxSincePrevHigh > candles[prevHigh].h
  }

  if (lows.length >= 2) {
    const lastLow = lows[lows.length - 1]
    const prevLow = lows[lows.length - 2]
    const minSincePrevLow = Math.min(...candles.slice(prevLow + 1).map((c) => c.c))
    bosDown = minSincePrevLow < candles[prevLow].l
  }

  // Enhanced bias logic with momentum consideration
  const recentBars = candles.slice(-Math.min(8, candles.length))
  const momentum = recentBars[recentBars.length - 1].c - recentBars[0].o

  if (rd > 1.2 && (bosUp || momentum > 0)) return "Bullish"
  if (rd < 0.8 && (bosDown || momentum < 0)) return "Bearish"
  return "Range"
}

// Comprehensive slice analysis
export function analyzeSlice(tf: Timeframe, slice: Candle[], pipSize = 0.0001): SliceStats {
  let bullCount = 0,
    bearCount = 0
  let bullRange = 0,
    bearRange = 0

  for (const c of slice) {
    const r = trueRange(c)
    if (c.c >= c.o) {
      bullCount++
      bullRange += r
    } else {
      bearCount++
      bearRange += r
    }
  }

  const totalRange = bullRange + bearRange
  const avgRange = toPips(totalRange / Math.max(1, slice.length), pipSize)
  const rd = bearRange === 0 ? (bullRange > 0 ? 999 : 1) : bullRange / bearRange
  const bias = structureBias(slice, rd)

  // Enhanced statistics
  const avgBullishRange = bullCount > 0 ? toPips(bullRange / bullCount, pipSize) : 0
  const avgBearishRange = bearCount > 0 ? toPips(bearRange / bearCount, pipSize) : 0
  const bullishTotalRange = toPips(bullRange, pipSize)
  const bearishTotalRange = toPips(bearRange, pipSize)

  // Smart note generation
  const dominanceText = rd > 1.5 ? "Strong Bull" : rd < 0.67 ? "Strong Bear" : "Balanced"
  const note = `${bias} • ${dominanceText} • RD ${rd.toFixed(2)} • ${bullCount}↑/${bearCount}↓`

  return {
    tf,
    bars: slice.length,
    bullCount,
    bearCount,
    avgRange,
    rangeDominance: rd,
    bias,
    note,
    bullishTotalRange,
    bearishTotalRange,
    avgBullishRange,
    avgBearishRange,
  }
}
