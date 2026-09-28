import type { MultiTimeframeAnalysis } from "./multi-timeframe-analysis"
import type { SessionAnalysis } from "./session-analysis"
import type { LiquidityAnalysis } from "./liquidity-analysis"
import type { MacroAnalysis } from "./macro-analysis"

export interface AnalysisSnapshot {
  id: string
  userId: string
  pair: string
  timestamp: number
  name: string
  description: string
  tags: string[]
  multiTimeframe: MultiTimeframeAnalysis
  session: SessionAnalysis
  liquidity: LiquidityAnalysis
  macro: MacroAnalysis
  metadata: {
    version: string
    analysisType: "complete" | "partial"
    confidence: number
    riskLevel: "low" | "medium" | "high"
  }
}

export interface HistoryFilter {
  pair?: string
  dateRange?: {
    start: number
    end: number
  }
  tags?: string[]
  riskLevel?: "low" | "medium" | "high"
  searchQuery?: string
}

export interface ExportOptions {
  format: "json" | "csv" | "pdf"
  includeCharts: boolean
  includeMetadata: boolean
  dateRange?: {
    start: number
    end: number
  }
}

class AnalysisHistoryManager {
  private readonly STORAGE_KEY = "analysis_history"
  private readonly MAX_HISTORY_ITEMS = 100

  private generateId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getUserId(): string {
    // In a real implementation, this would get the actual user ID
    // For now, we'll use a localStorage-based user ID
    let userId = localStorage.getItem("user_id")
    if (!userId) {
      userId = `user_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("user_id", userId)
    }
    return userId
  }

  private getStorageKey(userId: string): string {
    return `${this.STORAGE_KEY}_${userId}`
  }

  private loadHistory(userId: string): AnalysisSnapshot[] {
    try {
      const stored = localStorage.getItem(this.getStorageKey(userId))
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Failed to load analysis history:", error)
      return []
    }
  }

  private saveHistory(userId: string, history: AnalysisSnapshot[]): void {
    try {
      // Keep only the most recent items
      const trimmedHistory = history.slice(0, this.MAX_HISTORY_ITEMS)
      localStorage.setItem(this.getStorageKey(userId), JSON.stringify(trimmedHistory))
    } catch (error) {
      console.error("Failed to save analysis history:", error)
    }
  }

  async saveAnalysis(
    pair: string,
    name: string,
    description: string,
    multiTimeframe: MultiTimeframeAnalysis,
    session: SessionAnalysis,
    liquidity: LiquidityAnalysis,
    macro: MacroAnalysis,
    tags: string[] = [],
  ): Promise<string> {
    const userId = this.getUserId()
    const history = this.loadHistory(userId)

    // Calculate overall confidence and risk level
    const confidence = Math.round(
      (multiTimeframe.confluence.confidence + macro.confidence + (session ? 85 : 0) + (liquidity ? 80 : 0)) / 4,
    )

    let riskLevel: "low" | "medium" | "high" = "low"
    if (macro.riskAssessment.level === "high" || confidence < 60) {
      riskLevel = "high"
    } else if (macro.riskAssessment.level === "medium" || confidence < 75) {
      riskLevel = "medium"
    }

    const snapshot: AnalysisSnapshot = {
      id: this.generateId(),
      userId,
      pair,
      timestamp: Date.now(),
      name,
      description,
      tags: [...tags, pair.split("/")[0], pair.split("/")[1]],
      multiTimeframe,
      session,
      liquidity,
      macro,
      metadata: {
        version: "1.0",
        analysisType: "complete",
        confidence,
        riskLevel,
      },
    }

    // Add to beginning of history
    history.unshift(snapshot)
    this.saveHistory(userId, history)

    return snapshot.id
  }

  async getHistory(filter?: HistoryFilter): Promise<AnalysisSnapshot[]> {
    const userId = this.getUserId()
    let history = this.loadHistory(userId)

    if (!filter) return history

    // Apply filters
    if (filter.pair) {
      history = history.filter((item) => item.pair === filter.pair)
    }

    if (filter.dateRange) {
      history = history.filter(
        (item) => item.timestamp >= filter.dateRange!.start && item.timestamp <= filter.dateRange!.end,
      )
    }

    if (filter.tags && filter.tags.length > 0) {
      history = history.filter((item) => filter.tags!.some((tag) => item.tags.includes(tag)))
    }

    if (filter.riskLevel) {
      history = history.filter((item) => item.metadata.riskLevel === filter.riskLevel)
    }

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase()
      history = history.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.pair.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    return history
  }

  async getAnalysisById(id: string): Promise<AnalysisSnapshot | null> {
    const userId = this.getUserId()
    const history = this.loadHistory(userId)
    return history.find((item) => item.id === id) || null
  }

  async deleteAnalysis(id: string): Promise<boolean> {
    const userId = this.getUserId()
    const history = this.loadHistory(userId)
    const filteredHistory = history.filter((item) => item.id !== id)

    if (filteredHistory.length !== history.length) {
      this.saveHistory(userId, filteredHistory)
      return true
    }
    return false
  }

  async exportAnalysis(ids: string[], options: ExportOptions): Promise<string> {
    const userId = this.getUserId()
    const history = this.loadHistory(userId)
    const selectedAnalyses = history.filter((item) => ids.includes(item.id))

    if (options.dateRange) {
      selectedAnalyses.filter(
        (item) => item.timestamp >= options.dateRange!.start && item.timestamp <= options.dateRange!.end,
      )
    }

    switch (options.format) {
      case "json":
        return this.exportAsJSON(selectedAnalyses, options)
      case "csv":
        return this.exportAsCSV(selectedAnalyses, options)
      case "pdf":
        return this.exportAsPDF(selectedAnalyses, options)
      default:
        throw new Error("Unsupported export format")
    }
  }

  private exportAsJSON(analyses: AnalysisSnapshot[], options: ExportOptions): string {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalAnalyses: analyses.length,
      options,
      analyses: options.includeMetadata ? analyses : analyses.map(({ metadata, ...rest }) => rest), // Remove metadata if not requested
    }

    return JSON.stringify(exportData, null, 2)
  }

  private exportAsCSV(analyses: AnalysisSnapshot[], options: ExportOptions): string {
    const headers = ["ID", "Pair", "Name", "Date", "Confidence", "Risk Level", "Overall Bias", "Liquidity Bias", "Tags"]

    const rows = analyses.map((analysis) => [
      analysis.id,
      analysis.pair,
      analysis.name,
      new Date(analysis.timestamp).toISOString(),
      analysis.metadata.confidence,
      analysis.metadata.riskLevel,
      analysis.multiTimeframe.confluence.overallBias,
      analysis.liquidity.liquidityBias,
      analysis.tags.join(";"),
    ])

    return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
  }

  private exportAsPDF(analyses: AnalysisSnapshot[], options: ExportOptions): string {
    // In a real implementation, this would generate a proper PDF
    // For now, return a formatted text representation
    const content = analyses
      .map(
        (analysis) => `
Analysis: ${analysis.name}
Pair: ${analysis.pair}
Date: ${new Date(analysis.timestamp).toLocaleString()}
Confidence: ${analysis.metadata.confidence}%
Risk Level: ${analysis.metadata.riskLevel.toUpperCase()}
Overall Bias: ${analysis.multiTimeframe.confluence.overallBias.toUpperCase()}
Description: ${analysis.description}
Tags: ${analysis.tags.join(", ")}
---
`,
      )
      .join("\n")

    return `ANALYSIS HISTORY EXPORT
Generated: ${new Date().toLocaleString()}
Total Analyses: ${analyses.length}

${content}`
  }

  async getAnalyticsData(): Promise<{
    totalAnalyses: number
    pairDistribution: Record<string, number>
    riskDistribution: Record<string, number>
    confidenceAverage: number
    recentActivity: number[]
  }> {
    const userId = this.getUserId()
    const history = this.loadHistory(userId)

    const pairDistribution: Record<string, number> = {}
    const riskDistribution: Record<string, number> = {}
    let totalConfidence = 0

    history.forEach((analysis) => {
      pairDistribution[analysis.pair] = (pairDistribution[analysis.pair] || 0) + 1
      riskDistribution[analysis.metadata.riskLevel] = (riskDistribution[analysis.metadata.riskLevel] || 0) + 1
      totalConfidence += analysis.metadata.confidence
    })

    // Calculate recent activity (last 7 days)
    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000
    const recentActivity = Array.from({ length: 7 }, (_, i) => {
      const dayStart = now - (i + 1) * dayMs
      const dayEnd = now - i * dayMs
      return history.filter((analysis) => analysis.timestamp >= dayStart && analysis.timestamp < dayEnd).length
    }).reverse()

    return {
      totalAnalyses: history.length,
      pairDistribution,
      riskDistribution,
      confidenceAverage: history.length > 0 ? Math.round(totalConfidence / history.length) : 0,
      recentActivity,
    }
  }
}

export const analysisHistoryManager = new AnalysisHistoryManager()
