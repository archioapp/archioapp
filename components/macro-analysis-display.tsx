"use client"

import { motion } from "framer-motion"
import { Globe, TrendingUp, TrendingDown, AlertTriangle, Calendar } from "lucide-react"
import type { MacroAnalysis, MacroFactor, EconomicIndicator } from "@/lib/macro-analysis"

interface MacroAnalysisDisplayProps {
  analysis: MacroAnalysis | null
  isLoading: boolean
}

function FactorImpactChart({ factors }: { factors: MacroFactor[] }) {
  const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="premium-glass-panel p-6"
    >
      <h3 className="text-xl font-bold text-white mb-6">Factor Impact Distribution</h3>

      {/* Donut Chart */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {factors.map((factor, index) => {
              const percentage = (factor.weight / totalWeight) * 100
              const circumference = 2 * Math.PI * 35
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`
              const strokeDashoffset = -factors
                .slice(0, index)
                .reduce((sum, f) => sum + (f.weight / totalWeight) * circumference, 0)

              return (
                <circle
                  key={factor.id}
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke={factor.color}
                  strokeWidth="8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 hover:stroke-width-10"
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-sm text-purple-300">Total Impact</div>
            </div>
          </div>
        </div>
      </div>

      {/* Factor Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {factors.map((factor, index) => (
          <motion.div
            key={factor.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="p-4 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-black/30 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: factor.color }} />
              <span className="text-white font-medium">{factor.name}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-300 text-sm">Impact Weight</span>
              <span className="text-white font-mono">{factor.weight.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-purple-300 text-sm">Trend</span>
              <div className="flex items-center gap-1">
                {factor.trend === "bullish" ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : factor.trend === "bearish" ? (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-yellow-400" />
                )}
                <span
                  className={`text-sm font-medium ${
                    factor.trend === "bullish"
                      ? "text-green-400"
                      : factor.trend === "bearish"
                        ? "text-red-400"
                        : "text-yellow-400"
                  }`}
                >
                  {factor.trend.toUpperCase()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function EconomicIndicatorsPanel({ indicators }: { indicators: EconomicIndicator[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="premium-glass-panel p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center border border-blue-500/40">
          <Calendar className="w-5 h-5 text-blue-300" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Economic Indicators</h3>
          <p className="text-purple-300/80 text-sm">Key Economic Data Points</p>
        </div>
      </div>

      <div className="space-y-4">
        {indicators.slice(0, 6).map((indicator, index) => (
          <motion.div
            key={indicator.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="p-4 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-black/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    indicator.impact === "high"
                      ? "bg-red-400"
                      : indicator.impact === "medium"
                        ? "bg-yellow-400"
                        : "bg-green-400"
                  }`}
                />
                <span className="text-white font-medium">{indicator.name}</span>
                <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded">{indicator.currency}</span>
              </div>
              <div className="flex items-center gap-1">
                {indicator.trend === "improving" ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : indicator.trend === "deteriorating" ? (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-yellow-400" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-purple-300">Current</span>
                <div className="text-white font-mono">{indicator.value.toFixed(2)}%</div>
              </div>
              <div>
                <span className="text-purple-300">Previous</span>
                <div className="text-white font-mono">{indicator.previousValue.toFixed(2)}%</div>
              </div>
              <div>
                <span className="text-purple-300">Forecast</span>
                <div className="text-white font-mono">{indicator.forecast.toFixed(2)}%</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function MacroOverview({ analysis }: { analysis: MacroAnalysis }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="premium-glass-panel p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center border border-purple-500/40">
          <Globe className="w-6 h-6 text-purple-300" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Macroeconomic Overview</h3>
          <p className="text-purple-300/80 text-sm">{analysis.pair} • Fundamental Analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-purple-300">Overall Bias</span>
            <div className="flex items-center gap-2">
              {analysis.overallBias === "bullish" ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : analysis.overallBias === "bearish" ? (
                <TrendingDown className="w-5 h-5 text-red-400" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-yellow-400" />
              )}
              <span
                className={`font-bold uppercase ${
                  analysis.overallBias === "bullish"
                    ? "text-green-400"
                    : analysis.overallBias === "bearish"
                      ? "text-red-400"
                      : "text-yellow-400"
                }`}
              >
                {analysis.overallBias}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-purple-300">Confidence</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-3 bg-purple-900/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.confidence}%` }}
                />
              </div>
              <span className="text-white font-mono">{Math.round(analysis.confidence)}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-purple-300">Risk Level</span>
            <div className="flex items-center gap-2">
              <AlertTriangle
                className={`w-5 h-5 ${
                  analysis.riskAssessment.level === "high"
                    ? "text-red-400"
                    : analysis.riskAssessment.level === "medium"
                      ? "text-yellow-400"
                      : "text-green-400"
                }`}
              />
              <span
                className={`font-bold uppercase ${
                  analysis.riskAssessment.level === "high"
                    ? "text-red-400"
                    : analysis.riskAssessment.level === "medium"
                      ? "text-yellow-400"
                      : "text-green-400"
                }`}
              >
                {analysis.riskAssessment.level}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-purple-300">Active Factors</span>
            <span className="text-white font-bold">{analysis.factors.length}</span>
          </div>
        </div>
      </div>

      {/* Outlook */}
      <div className="mt-6 pt-4 border-t border-purple-500/20">
        <h4 className="text-lg font-bold text-white mb-4">Market Outlook</h4>
        <div className="space-y-3">
          <div>
            <span className="text-purple-300 text-sm font-medium">Short Term:</span>
            <p className="text-white text-sm mt-1">{analysis.outlook.shortTerm}</p>
          </div>
          <div>
            <span className="text-purple-300 text-sm font-medium">Medium Term:</span>
            <p className="text-white text-sm mt-1">{analysis.outlook.mediumTerm}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function MacroAnalysisDisplay({ analysis, isLoading }: MacroAnalysisDisplayProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="premium-glass-panel p-6 animate-pulse">
          <div className="h-6 bg-purple-500/20 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-4 bg-purple-500/10 rounded"></div>
            <div className="h-4 bg-purple-500/10 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="premium-glass-panel p-6 animate-pulse">
            <div className="w-48 h-48 bg-purple-500/10 rounded-full mx-auto mb-4"></div>
          </div>
          <div className="premium-glass-panel p-6 animate-pulse">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-purple-500/10 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="text-center py-12">
        <p className="text-purple-300">No macroeconomic analysis data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <MacroOverview analysis={analysis} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FactorImpactChart factors={analysis.factors} />
        <EconomicIndicatorsPanel indicators={analysis.indicators} />
      </div>
    </div>
  )
}
