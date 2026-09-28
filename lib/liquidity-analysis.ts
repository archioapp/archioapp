export interface LiquidityZone {
  id: string
  type: "buy-side" | "sell-side"
  level: number
  strength: number
  volume: number
  touches: number
  created: number
  lastTested: number
  status: "active" | "swept" | "respected"
  confidence: number
  description: string
}

export interface LiquidityCluster {
  id: string
  zones: LiquidityZone[]
  centerLevel: number
  totalVolume: number
  dominantType: "buy-side" | "sell-side"
  strength: number
  timeframe: string
}

export interface LiquidityAnalysis {
  buyLiquidity: LiquidityZone[]
  sellLiquidity: LiquidityZone[]
  clusters: LiquidityCluster[]
  tokyoHigh: LiquidityZone | null
  tokyoLow: LiquidityZone | null
  currentPrice: number
  liquidityBias: "buy-side" | "sell-side" | "balanced"
  huntingDirection: "upward" | "downward" | "neutral"
  timestamp: number
}

class LiquidityAnalysisEngine {
  private generateLiquidityZone(type: "buy-side" | "sell-side", basePrice: number, index: number): LiquidityZone {
    const priceOffset = type === "buy-side" ? 0.001 + Math.random() * 0.002 : -(0.001 + Math.random() * 0.002)
    const level = basePrice + priceOffset

    return {
      id: `${type}-${index}-${Date.now()}`,
      type,
      level,
      strength: 60 + Math.random() * 35, // 60-95% strength
      volume: 500000 + Math.random() * 2000000, // 500k - 2.5M volume
      touches: Math.floor(Math.random() * 8) + 2, // 2-10 touches
      created: Date.now() - Math.random() * 86400000 * 7, // Created within last week
      lastTested: Date.now() - Math.random() * 86400000 * 2, // Last tested within 2 days
      status: Math.random() > 0.7 ? "swept" : Math.random() > 0.5 ? "respected" : "active",
      confidence: 70 + Math.random() * 25, // 70-95% confidence
      description: this.generateLiquidityDescription(type, index),
    }
  }

  private generateLiquidityDescription(type: "buy-side" | "sell-side", index: number): string {
    const buyDescriptions = [
      "Tokyo Session High - Strong buy-side liquidity pool",
      "Previous Daily High - Institutional buy orders",
      "Weekly High - Major liquidity accumulation",
      "Order Block High - Smart money positioning",
      "Swing High - Retail stop losses above",
      "Resistance Break - Failed breakout liquidity",
    ]

    const sellDescriptions = [
      "Tokyo Session Low - Strong sell-side liquidity pool",
      "Previous Daily Low - Institutional sell orders",
      "Weekly Low - Major liquidity accumulation",
      "Order Block Low - Smart money positioning",
      "Swing Low - Retail stop losses below",
      "Support Break - Failed breakdown liquidity",
    ]

    const descriptions = type === "buy-side" ? buyDescriptions : sellDescriptions
    return descriptions[index % descriptions.length]
  }

  private createLiquidityCluster(zones: LiquidityZone[], id: string, timeframe: string): LiquidityCluster {
    const buyZones = zones.filter((z) => z.type === "buy-side")
    const sellZones = zones.filter((z) => z.type === "sell-side")

    const totalVolume = zones.reduce((sum, zone) => sum + zone.volume, 0)
    const avgLevel = zones.reduce((sum, zone) => sum + zone.level, 0) / zones.length
    const avgStrength = zones.reduce((sum, zone) => sum + zone.strength, 0) / zones.length

    return {
      id,
      zones,
      centerLevel: avgLevel,
      totalVolume,
      dominantType: buyZones.length > sellZones.length ? "buy-side" : "sell-side",
      strength: avgStrength,
      timeframe,
    }
  }

  private identifyTokyoLevels(
    buyZones: LiquidityZone[],
    sellZones: LiquidityZone[],
  ): {
    tokyoHigh: LiquidityZone | null
    tokyoLow: LiquidityZone | null
  } {
    // Find the strongest buy-side zone (Tokyo High)
    const tokyoHigh =
      buyZones.filter((zone) => zone.description.includes("Tokyo")).sort((a, b) => b.strength - a.strength)[0] || null

    // Find the strongest sell-side zone (Tokyo Low)
    const tokyoLow =
      sellZones.filter((zone) => zone.description.includes("Tokyo")).sort((a, b) => b.strength - a.strength)[0] || null

    return { tokyoHigh, tokyoLow }
  }

  private determineLiquidityBias(
    buyZones: LiquidityZone[],
    sellZones: LiquidityZone[],
    currentPrice: number,
  ): "buy-side" | "sell-side" | "balanced" {
    const activeBuyZones = buyZones.filter((z) => z.status === "active" && z.level > currentPrice)
    const activeSellZones = sellZones.filter((z) => z.status === "active" && z.level < currentPrice)

    const buyStrength = activeBuyZones.reduce((sum, z) => sum + z.strength, 0)
    const sellStrength = activeSellZones.reduce((sum, z) => sum + z.strength, 0)

    const difference = Math.abs(buyStrength - sellStrength)
    const threshold = Math.max(buyStrength, sellStrength) * 0.2 // 20% threshold

    if (difference < threshold) return "balanced"
    return buyStrength > sellStrength ? "buy-side" : "sell-side"
  }

  private determineHuntingDirection(
    buyZones: LiquidityZone[],
    sellZones: LiquidityZone[],
    currentPrice: number,
  ): "upward" | "downward" | "neutral" {
    // Find nearest liquidity zones
    const nearestBuyZone = buyZones
      .filter((z) => z.level > currentPrice && z.status === "active")
      .sort((a, b) => a.level - b.level)[0]

    const nearestSellZone = sellZones
      .filter((z) => z.level < currentPrice && z.status === "active")
      .sort((a, b) => b.level - a.level)[0]

    if (!nearestBuyZone && !nearestSellZone) return "neutral"
    if (!nearestBuyZone) return "downward"
    if (!nearestSellZone) return "upward"

    const distanceToBuy = nearestBuyZone.level - currentPrice
    const distanceToSell = currentPrice - nearestSellZone.level

    // Consider strength and distance
    const buyScore = nearestBuyZone.strength / distanceToBuy
    const sellScore = nearestSellZone.strength / distanceToSell

    return buyScore > sellScore ? "upward" : "downward"
  }

  async analyzeLiquidity(symbol: string): Promise<LiquidityAnalysis> {
    // Generate realistic current price
    const currentPrice = 1.2345 + (Math.random() - 0.5) * 0.01

    // Generate buy-side liquidity zones (above current price)
    const buyLiquidity: LiquidityZone[] = []
    for (let i = 0; i < 6; i++) {
      const zone = this.generateLiquidityZone("buy-side", currentPrice, i)
      buyLiquidity.push(zone)
    }

    // Generate sell-side liquidity zones (below current price)
    const sellLiquidity: LiquidityZone[] = []
    for (let i = 0; i < 6; i++) {
      const zone = this.generateLiquidityZone("sell-side", currentPrice, i)
      sellLiquidity.push(zone)
    }

    // Create liquidity clusters
    const clusters: LiquidityCluster[] = [
      this.createLiquidityCluster([...buyLiquidity.slice(0, 3)], "buy-cluster-1", "4H"),
      this.createLiquidityCluster([...sellLiquidity.slice(0, 3)], "sell-cluster-1", "4H"),
      this.createLiquidityCluster([...buyLiquidity.slice(3), ...sellLiquidity.slice(3)], "mixed-cluster-1", "Daily"),
    ]

    // Identify Tokyo levels
    const { tokyoHigh, tokyoLow } = this.identifyTokyoLevels(buyLiquidity, sellLiquidity)

    // Determine market bias and hunting direction
    const liquidityBias = this.determineLiquidityBias(buyLiquidity, sellLiquidity, currentPrice)
    const huntingDirection = this.determineHuntingDirection(buyLiquidity, sellLiquidity, currentPrice)

    return {
      buyLiquidity: buyLiquidity.sort((a, b) => b.level - a.level), // Sort by level descending
      sellLiquidity: sellLiquidity.sort((a, b) => a.level - b.level), // Sort by level ascending
      clusters,
      tokyoHigh,
      tokyoLow,
      currentPrice,
      liquidityBias,
      huntingDirection,
      timestamp: Date.now(),
    }
  }

  formatPrice(price: number): string {
    return price.toFixed(5)
  }

  formatVolume(volume: number): string {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`
    }
    return `${(volume / 1000).toFixed(0)}K`
  }
}

export const liquidityAnalysisEngine = new LiquidityAnalysisEngine()
