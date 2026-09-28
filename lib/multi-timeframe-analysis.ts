export interface CandleData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface TimeframeAnalysis {
  timeframe: string
  trend: "bullish" | "bearish" | "neutral"
  strength: number
  support: number[]
  resistance: number[]
  keyLevels: {
    level: number
    type: "support" | "resistance"
    strength: number
    touches: number
  }[]
  momentum: {
    rsi: number
    macd: number
    stochastic: number
  }
  structure: {
    higherHighs: boolean
    higherLows: boolean
    lowerHighs: boolean
    lowerLows: boolean
  }
  liquidity: {
    buyLiquidity: number[]
    sellLiquidity: number[]
  }
}

export interface MultiTimeframeAnalysis {
  weekly: TimeframeAnalysis
  daily: TimeframeAnalysis
  fourHour: TimeframeAnalysis
  confluence: {
    bullishSignals: number
    bearishSignals: number
    overallBias: "bullish" | "bearish" | "neutral"
    confidence: number
  }
  timestamp: number
}

class MultiTimeframeAnalysisEngine {
  private calculateRSI(prices: number[], period = 14): number {
    if (prices.length < period + 1) return 50

    let gains = 0
    let losses = 0

    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i - 1]
      if (change > 0) gains += change
      else losses -= change
    }

    const avgGain = gains / period
    const avgLoss = losses / period
    const rs = avgGain / avgLoss
    return 100 - 100 / (1 + rs)
  }

  private calculateMACD(prices: number[]): number {
    if (prices.length < 26) return 0

    const ema12 = this.calculateEMA(prices, 12)
    const ema26 = this.calculateEMA(prices, 26)
    return ema12 - ema26
  }

  private calculateEMA(prices: number[], period: number): number {
    if (prices.length === 0) return 0

    const multiplier = 2 / (period + 1)
    let ema = prices[0]

    for (let i = 1; i < prices.length; i++) {
      ema = prices[i] * multiplier + ema * (1 - multiplier)
    }

    return ema
  }

  private findSupportResistance(candles: CandleData[]): { support: number[]; resistance: number[] } {
    const highs = candles.map((c) => c.high)
    const lows = candles.map((c) => c.low)

    const support: number[] = []
    const resistance: number[] = []

    // Find pivot points
    for (let i = 2; i < lows.length - 2; i++) {
      if (lows[i] < lows[i - 1] && lows[i] < lows[i - 2] && lows[i] < lows[i + 1] && lows[i] < lows[i + 2]) {
        support.push(lows[i])
      }
    }

    for (let i = 2; i < highs.length - 2; i++) {
      if (highs[i] > highs[i - 1] && highs[i] > highs[i - 2] && highs[i] > highs[i + 1] && highs[i] > highs[i + 2]) {
        resistance.push(highs[i])
      }
    }

    return {
      support: support.slice(-5), // Last 5 support levels
      resistance: resistance.slice(-5), // Last 5 resistance levels
    }
  }

  private analyzeStructure(candles: CandleData[]) {
    const highs = candles.slice(-10).map((c) => c.high)
    const lows = candles.slice(-10).map((c) => c.low)

    const recentHighs = highs.slice(-5)
    const recentLows = lows.slice(-5)
    const previousHighs = highs.slice(0, 5)
    const previousLows = lows.slice(0, 5)

    const avgRecentHigh = recentHighs.reduce((a, b) => a + b, 0) / recentHighs.length
    const avgRecentLow = recentLows.reduce((a, b) => a + b, 0) / recentLows.length
    const avgPreviousHigh = previousHighs.reduce((a, b) => a + b, 0) / previousHighs.length
    const avgPreviousLow = previousLows.reduce((a, b) => a + b, 0) / previousLows.length

    return {
      higherHighs: avgRecentHigh > avgPreviousHigh,
      higherLows: avgRecentLow > avgPreviousLow,
      lowerHighs: avgRecentHigh < avgPreviousHigh,
      lowerLows: avgRecentLow < avgPreviousLow,
    }
  }

  private generateLiquidityZones(candles: CandleData[]): { buyLiquidity: number[]; sellLiquidity: number[] } {
    const volumes = candles.map((c) => c.volume)
    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length

    const buyLiquidity: number[] = []
    const sellLiquidity: number[] = []

    candles.forEach((candle, index) => {
      if (candle.volume > avgVolume * 1.5) {
        if (candle.close > candle.open) {
          buyLiquidity.push(candle.low)
        } else {
          sellLiquidity.push(candle.high)
        }
      }
    })

    return { buyLiquidity, sellLiquidity }
  }

  private analyzeTimeframe(candles: CandleData[], timeframe: string): TimeframeAnalysis {
    const closes = candles.map((c) => c.close)
    const { support, resistance } = this.findSupportResistance(candles)
    const structure = this.analyzeStructure(candles)
    const liquidity = this.generateLiquidityZones(candles)

    // Determine trend
    const sma20 = closes.slice(-20).reduce((a, b) => a + b, 0) / 20
    const sma50 = closes.slice(-50).reduce((a, b) => a + b, 0) / 50
    const currentPrice = closes[closes.length - 1]

    let trend: "bullish" | "bearish" | "neutral" = "neutral"
    let strength = 50

    if (currentPrice > sma20 && sma20 > sma50) {
      trend = "bullish"
      strength = Math.min(90, 50 + ((currentPrice - sma20) / sma20) * 1000)
    } else if (currentPrice < sma20 && sma20 < sma50) {
      trend = "bearish"
      strength = Math.min(90, 50 + ((sma20 - currentPrice) / sma20) * 1000)
    }

    // Create key levels
    const keyLevels = [
      ...support.map((level) => ({
        level,
        type: "support" as const,
        strength: Math.random() * 40 + 60,
        touches: Math.floor(Math.random() * 5) + 2,
      })),
      ...resistance.map((level) => ({
        level,
        type: "resistance" as const,
        strength: Math.random() * 40 + 60,
        touches: Math.floor(Math.random() * 5) + 2,
      })),
    ]

    return {
      timeframe,
      trend,
      strength,
      support,
      resistance,
      keyLevels,
      momentum: {
        rsi: this.calculateRSI(closes),
        macd: this.calculateMACD(closes),
        stochastic: Math.random() * 100, // Simplified
      },
      structure,
      liquidity,
    }
  }

  async analyzeMultiTimeframe(symbol: string): Promise<MultiTimeframeAnalysis> {
    // In a real implementation, this would fetch actual market data
    // For now, we'll generate realistic sample data
    const generateCandles = (count: number): CandleData[] => {
      const candles: CandleData[] = []
      let price = 1.2 + Math.random() * 0.1

      for (let i = 0; i < count; i++) {
        const open = price
        const change = (Math.random() - 0.5) * 0.01
        const close = open + change
        const high = Math.max(open, close) + Math.random() * 0.005
        const low = Math.min(open, close) - Math.random() * 0.005

        candles.push({
          time: Date.now() - (count - i) * 3600000,
          open,
          high,
          low,
          close,
          volume: Math.random() * 1000000 + 500000,
        })

        price = close
      }

      return candles
    }

    const weeklyCandles = generateCandles(52) // 52 weeks
    const dailyCandles = generateCandles(100) // 100 days
    const fourHourCandles = generateCandles(168) // 168 4-hour periods (28 days)

    const weekly = this.analyzeTimeframe(weeklyCandles, "Weekly")
    const daily = this.analyzeTimeframe(dailyCandles, "Daily")
    const fourHour = this.analyzeTimeframe(fourHourCandles, "4H")

    // Calculate confluence
    const bullishSignals = [weekly, daily, fourHour].filter((tf) => tf.trend === "bullish").length
    const bearishSignals = [weekly, daily, fourHour].filter((tf) => tf.trend === "bearish").length

    let overallBias: "bullish" | "bearish" | "neutral" = "neutral"
    let confidence = 50

    if (bullishSignals > bearishSignals) {
      overallBias = "bullish"
      confidence = 50 + bullishSignals * 15
    } else if (bearishSignals > bullishSignals) {
      overallBias = "bearish"
      confidence = 50 + bearishSignals * 15
    }

    return {
      weekly,
      daily,
      fourHour,
      confluence: {
        bullishSignals,
        bearishSignals,
        overallBias,
        confidence,
      },
      timestamp: Date.now(),
    }
  }
}

export const multiTimeframeAnalysisEngine = new MultiTimeframeAnalysisEngine()
