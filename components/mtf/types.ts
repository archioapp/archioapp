export type CardAnalysisResult = {
  bullCount: number
  bearCount: number
  sentiment: string
  total: number
  bullishTotalRange: number
  bearishTotalRange: number
  avgBullishRange: number
  avgBearishRange: number
  rangeRatio: number
}
