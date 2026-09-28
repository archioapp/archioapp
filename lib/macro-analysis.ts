export interface EconomicIndicator {
  id: string
  name: string
  country: string
  currency: string
  value: number
  previousValue: number
  forecast: number
  impact: "high" | "medium" | "low"
  releaseDate: number
  nextRelease: number
  trend: "improving" | "deteriorating" | "stable"
  description: string
}

export interface CentralBankPolicy {
  id: string
  bank: string
  country: string
  currency: string
  currentRate: number
  previousRate: number
  nextMeeting: number
  stance: "hawkish" | "dovish" | "neutral"
  confidence: number
  keyPoints: string[]
  impactScore: number
}

export interface NewsImpact {
  id: string
  headline: string
  summary: string
  currencies: string[]
  impact: "positive" | "negative" | "neutral"
  severity: number
  timestamp: number
  source: string
  category: "monetary-policy" | "economic-data" | "geopolitical" | "market-sentiment"
}

export interface MacroFactor {
  id: string
  name: string
  impact: number
  weight: number
  trend: "bullish" | "bearish" | "neutral"
  confidence: number
  description: string
  color: string
}

export interface MacroAnalysis {
  pair: string
  baseCurrency: string
  quoteCurrency: string
  overallBias: "bullish" | "bearish" | "neutral"
  confidence: number
  factors: MacroFactor[]
  indicators: EconomicIndicator[]
  centralBankPolicies: CentralBankPolicy[]
  newsImpacts: NewsImpact[]
  riskAssessment: {
    level: "low" | "medium" | "high"
    factors: string[]
    score: number
  }
  outlook: {
    shortTerm: string
    mediumTerm: string
    longTerm: string
  }
  timestamp: number
}

class MacroAnalysisEngine {
  private generateEconomicIndicators(currency: string): EconomicIndicator[] {
    const indicators = [
      {
        name: "GDP Growth Rate",
        impact: "high" as const,
        description: "Quarterly economic growth measurement",
      },
      {
        name: "Inflation Rate (CPI)",
        impact: "high" as const,
        description: "Consumer price index year-over-year",
      },
      {
        name: "Unemployment Rate",
        impact: "medium" as const,
        description: "Labor market health indicator",
      },
      {
        name: "Retail Sales",
        impact: "medium" as const,
        description: "Consumer spending strength",
      },
      {
        name: "Manufacturing PMI",
        impact: "medium" as const,
        description: "Manufacturing sector activity",
      },
      {
        name: "Trade Balance",
        impact: "low" as const,
        description: "Export vs import balance",
      },
    ]

    return indicators.map((indicator, index) => {
      const baseValue = Math.random() * 5 + 1
      const change = (Math.random() - 0.5) * 0.5

      return {
        id: `${currency}-${indicator.name.toLowerCase().replace(/\s+/g, "-")}-${index}`,
        name: indicator.name,
        country: this.getCurrencyCountry(currency),
        currency,
        value: baseValue + change,
        previousValue: baseValue,
        forecast: baseValue + (Math.random() - 0.5) * 0.3,
        impact: indicator.impact,
        releaseDate: Date.now() - Math.random() * 86400000 * 7, // Last week
        nextRelease: Date.now() + Math.random() * 86400000 * 30, // Next month
        trend: change > 0.1 ? "improving" : change < -0.1 ? "deteriorating" : "stable",
        description: indicator.description,
      }
    })
  }

  private generateCentralBankPolicy(currency: string): CentralBankPolicy {
    const banks = {
      USD: { name: "Federal Reserve", country: "United States" },
      EUR: { name: "European Central Bank", country: "European Union" },
      GBP: { name: "Bank of England", country: "United Kingdom" },
      JPY: { name: "Bank of Japan", country: "Japan" },
      AUD: { name: "Reserve Bank of Australia", country: "Australia" },
      CAD: { name: "Bank of Canada", country: "Canada" },
    }

    const bank = banks[currency as keyof typeof banks] || { name: "Central Bank", country: "Unknown" }
    const currentRate = Math.random() * 5 + 0.5
    const rateChange = (Math.random() - 0.5) * 0.5

    const stances = ["hawkish", "dovish", "neutral"] as const
    const stance = stances[Math.floor(Math.random() * stances.length)]

    return {
      id: `${currency}-central-bank`,
      bank: bank.name,
      country: bank.country,
      currency,
      currentRate,
      previousRate: currentRate - rateChange,
      nextMeeting: Date.now() + Math.random() * 86400000 * 45, // Next 45 days
      stance,
      confidence: 70 + Math.random() * 25,
      keyPoints: this.generateKeyPoints(stance),
      impactScore: 80 + Math.random() * 15,
    }
  }

  private generateKeyPoints(stance: "hawkish" | "dovish" | "neutral"): string[] {
    const hawkishPoints = [
      "Inflation concerns driving policy tightening",
      "Labor market strength supports rate increases",
      "Economic growth remains robust",
      "Asset price bubbles need addressing",
    ]

    const dovishPoints = [
      "Economic growth showing signs of weakness",
      "Inflation below target levels",
      "Employment data suggests caution",
      "Global uncertainties warrant accommodation",
    ]

    const neutralPoints = [
      "Data-dependent approach to policy",
      "Balanced risks to economic outlook",
      "Monitoring inflation expectations",
      "Gradual policy normalization",
    ]

    const points = stance === "hawkish" ? hawkishPoints : stance === "dovish" ? dovishPoints : neutralPoints

    return points.slice(0, Math.floor(Math.random() * 2) + 2) // 2-3 points
  }

  private generateNewsImpacts(currencies: string[]): NewsImpact[] {
    const headlines = [
      {
        headline: "Central Bank Signals Policy Shift",
        category: "monetary-policy" as const,
        impact: "positive" as const,
      },
      {
        headline: "Economic Data Beats Expectations",
        category: "economic-data" as const,
        impact: "positive" as const,
      },
      {
        headline: "Geopolitical Tensions Rise",
        category: "geopolitical" as const,
        impact: "negative" as const,
      },
      {
        headline: "Market Sentiment Improves",
        category: "market-sentiment" as const,
        impact: "positive" as const,
      },
      {
        headline: "Trade Relations Under Pressure",
        category: "geopolitical" as const,
        impact: "negative" as const,
      },
    ]

    return headlines.slice(0, 3).map((news, index) => ({
      id: `news-${index}`,
      headline: news.headline,
      summary: `${news.headline} affecting ${currencies.join("/")} pair dynamics and market sentiment.`,
      currencies,
      impact: news.impact,
      severity: 60 + Math.random() * 35,
      timestamp: Date.now() - Math.random() * 86400000 * 3, // Last 3 days
      source: "Financial News Network",
      category: news.category,
    }))
  }

  private generateMacroFactors(baseCurrency: string, quoteCurrency: string): MacroFactor[] {
    const factorTemplates = [
      {
        name: "Interest Rate Differential",
        baseWeight: 35,
        color: "#3B82F6", // Blue
      },
      {
        name: "Economic Growth Divergence",
        baseWeight: 25,
        color: "#10B981", // Green
      },
      {
        name: "Inflation Expectations",
        baseWeight: 20,
        color: "#F59E0B", // Amber
      },
      {
        name: "Geopolitical Risk",
        baseWeight: 15,
        color: "#EF4444", // Red
      },
      {
        name: "Market Sentiment",
        baseWeight: 5,
        color: "#8B5CF6", // Purple
      },
    ]

    return factorTemplates.map((template, index) => {
      const impact = (Math.random() - 0.5) * 100 // -50 to +50
      const weight = template.baseWeight + (Math.random() - 0.5) * 10 // ±5% variation

      return {
        id: `factor-${index}`,
        name: template.name,
        impact,
        weight,
        trend: impact > 10 ? "bullish" : impact < -10 ? "bearish" : "neutral",
        confidence: 70 + Math.random() * 25,
        description: this.getFactorDescription(template.name, impact),
        color: template.color,
      }
    })
  }

  private getFactorDescription(factorName: string, impact: number): string {
    const direction = impact > 0 ? "supportive" : impact < 0 ? "pressuring" : "neutral"
    const strength = Math.abs(impact) > 30 ? "strongly" : Math.abs(impact) > 15 ? "moderately" : "mildly"

    return `${factorName} is ${strength} ${direction} for the currency pair based on current economic conditions.`
  }

  private getCurrencyCountry(currency: string): string {
    const countries = {
      USD: "United States",
      EUR: "European Union",
      GBP: "United Kingdom",
      JPY: "Japan",
      AUD: "Australia",
      CAD: "Canada",
      CHF: "Switzerland",
      NZD: "New Zealand",
    }
    return countries[currency as keyof typeof countries] || "Unknown"
  }

  private calculateOverallBias(factors: MacroFactor[]): {
    bias: "bullish" | "bearish" | "neutral"
    confidence: number
  } {
    let weightedScore = 0
    let totalWeight = 0

    factors.forEach((factor) => {
      weightedScore += (factor.impact * factor.weight) / 100
      totalWeight += factor.weight
    })

    const normalizedScore = weightedScore / totalWeight
    const confidence = Math.min(95, 50 + Math.abs(normalizedScore) * 2)

    let bias: "bullish" | "bearish" | "neutral" = "neutral"
    if (normalizedScore > 15) bias = "bullish"
    else if (normalizedScore < -15) bias = "bearish"

    return { bias, confidence }
  }

  private generateOutlook(
    bias: "bullish" | "bearish" | "neutral",
    confidence: number,
  ): {
    shortTerm: string
    mediumTerm: string
    longTerm: string
  } {
    const outlooks = {
      bullish: {
        shortTerm: "Positive momentum expected to continue with supportive economic fundamentals.",
        mediumTerm: "Sustained upward pressure likely as macro factors remain favorable.",
        longTerm: "Long-term bullish outlook supported by structural economic advantages.",
      },
      bearish: {
        shortTerm: "Near-term weakness anticipated due to challenging macro environment.",
        mediumTerm: "Downward pressure may persist as economic headwinds continue.",
        longTerm: "Long-term challenges require significant policy adjustments for recovery.",
      },
      neutral: {
        shortTerm: "Mixed signals suggest range-bound trading in the near term.",
        mediumTerm: "Balanced macro factors point to sideways price action.",
        longTerm: "Long-term direction depends on resolution of current uncertainties.",
      },
    }

    return outlooks[bias]
  }

  async analyzeMacroeconomics(pair: string): Promise<MacroAnalysis> {
    const [baseCurrency, quoteCurrency] = pair.split("/")

    // Generate analysis components
    const baseIndicators = this.generateEconomicIndicators(baseCurrency)
    const quoteIndicators = this.generateEconomicIndicators(quoteCurrency)
    const baseCentralBank = this.generateCentralBankPolicy(baseCurrency)
    const quoteCentralBank = this.generateCentralBankPolicy(quoteCurrency)
    const newsImpacts = this.generateNewsImpacts([baseCurrency, quoteCurrency])
    const factors = this.generateMacroFactors(baseCurrency, quoteCurrency)

    // Calculate overall bias
    const { bias, confidence } = this.calculateOverallBias(factors)

    // Generate risk assessment
    const riskFactors = factors.filter((f) => Math.abs(f.impact) > 20).map((f) => f.name)
    const riskLevel = riskFactors.length > 2 ? "high" : riskFactors.length > 0 ? "medium" : "low"
    const riskScore = Math.min(100, riskFactors.length * 25 + Math.random() * 25)

    return {
      pair,
      baseCurrency,
      quoteCurrency,
      overallBias: bias,
      confidence,
      factors,
      indicators: [...baseIndicators, ...quoteIndicators],
      centralBankPolicies: [baseCentralBank, quoteCentralBank],
      newsImpacts,
      riskAssessment: {
        level: riskLevel,
        factors: riskFactors,
        score: riskScore,
      },
      outlook: this.generateOutlook(bias, confidence),
      timestamp: Date.now(),
    }
  }
}

export const macroAnalysisEngine = new MacroAnalysisEngine()
