"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Search,
  Filter,
  Download,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Tag,
  Clock,
  BarChart3,
} from "lucide-react"
import { analysisHistoryManager, type AnalysisSnapshot, type HistoryFilter } from "@/lib/analysis-history"

interface AnalysisHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  onLoadAnalysis?: (analysis: AnalysisSnapshot) => void
}

export function AnalysisHistoryModal({ isOpen, onClose, onLoadAnalysis }: AnalysisHistoryModalProps) {
  const [history, setHistory] = useState<AnalysisSnapshot[]>([])
  const [filteredHistory, setFilteredHistory] = useState<AnalysisSnapshot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<HistoryFilter>({})
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadHistory()
    }
  }, [isOpen])

  useEffect(() => {
    applyFilters()
  }, [history, searchQuery, filter])

  const loadHistory = async () => {
    setIsLoading(true)
    try {
      const data = await analysisHistoryManager.getHistory()
      setHistory(data)
    } catch (error) {
      console.error("Failed to load history:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = async () => {
    const currentFilter: HistoryFilter = {
      ...filter,
      searchQuery: searchQuery || undefined,
    }

    try {
      const filtered = await analysisHistoryManager.getHistory(currentFilter)
      setFilteredHistory(filtered)
    } catch (error) {
      console.error("Failed to apply filters:", error)
      setFilteredHistory(history)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await analysisHistoryManager.deleteAnalysis(id)
      await loadHistory()
      setSelectedItems(new Set())
    } catch (error) {
      console.error("Failed to delete analysis:", error)
    }
  }

  const handleExport = async () => {
    if (selectedItems.size === 0) return

    try {
      const exportData = await analysisHistoryManager.exportAnalysis(Array.from(selectedItems), {
        format: "json",
        includeCharts: true,
        includeMetadata: true,
      })

      const blob = new Blob([exportData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `analysis_export_${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to export analyses:", error)
    }
  }

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedItems)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedItems(newSelection)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-red-400 bg-red-500/20 border-red-500/30"
      case "medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"
      case "low":
        return "text-green-400 bg-green-500/20 border-green-500/30"
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30"
    }
  }

  const getBiasIcon = (bias: string) => {
    switch (bias) {
      case "bullish":
        return <TrendingUp className="w-4 h-4 text-green-400" />
      case "bearish":
        return <TrendingDown className="w-4 h-4 text-red-400" />
      default:
        return <div className="w-4 h-4 rounded-full bg-yellow-400" />
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-6xl h-[90vh] relative"
          >
            <div className="h-full rounded-3xl bg-gradient-to-br from-black/40 via-purple-900/20 to-blue-900/20 backdrop-blur-3xl border border-purple-500/30 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center border border-purple-500/40">
                    <BarChart3 className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                      Analysis History
                    </h2>
                    <p className="text-purple-300/80 text-sm">Manage and review your saved analyses</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedItems.size > 0 && (
                    <>
                      <button onClick={handleExport} className="premium-glass-icon-button">
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (selectedItems.size === 1) {
                            handleDelete(Array.from(selectedItems)[0])
                          }
                        }}
                        className="premium-glass-icon-button hover:bg-red-500/20"
                        disabled={selectedItems.size !== 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button onClick={onClose} className="premium-glass-icon-button hover:bg-red-500/20">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="p-4 border-b border-purple-500/10">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <input
                      type="text"
                      placeholder="Search analyses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-black/20 border border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`premium-glass-icon-button ${showFilters ? "bg-purple-500/20" : ""}`}
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                </div>

                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 bg-black/20 rounded-xl border border-purple-500/20"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-purple-300 mb-2">Currency Pair</label>
                        <select
                          value={filter.pair || ""}
                          onChange={(e) => setFilter({ ...filter, pair: e.target.value || undefined })}
                          className="w-full p-2 bg-black/30 border border-purple-500/30 rounded-lg text-white"
                        >
                          <option value="">All Pairs</option>
                          <option value="EUR/USD">EUR/USD</option>
                          <option value="GBP/USD">GBP/USD</option>
                          <option value="USD/JPY">USD/JPY</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-purple-300 mb-2">Risk Level</label>
                        <select
                          value={filter.riskLevel || ""}
                          onChange={(e) => setFilter({ ...filter, riskLevel: (e.target.value as any) || undefined })}
                          className="w-full p-2 bg-black/30 border border-purple-500/30 rounded-lg text-white"
                        >
                          <option value="">All Levels</option>
                          <option value="low">Low Risk</option>
                          <option value="medium">Medium Risk</option>
                          <option value="high">High Risk</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-purple-300 mb-2">Date Range</label>
                        <select
                          onChange={(e) => {
                            const days = Number.parseInt(e.target.value)
                            if (days > 0) {
                              const end = Date.now()
                              const start = end - days * 24 * 60 * 60 * 1000
                              setFilter({ ...filter, dateRange: { start, end } })
                            } else {
                              setFilter({ ...filter, dateRange: undefined })
                            }
                          }}
                          className="w-full p-2 bg-black/30 border border-purple-500/30 rounded-lg text-white"
                        >
                          <option value="0">All Time</option>
                          <option value="7">Last 7 Days</option>
                          <option value="30">Last 30 Days</option>
                          <option value="90">Last 90 Days</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* History List */}
              <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="premium-glass-panel p-4 animate-pulse">
                        <div className="h-4 bg-purple-500/20 rounded mb-2"></div>
                        <div className="h-3 bg-purple-500/10 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-purple-300">No analyses found matching your criteria</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredHistory.map((analysis, index) => (
                      <motion.div
                        key={analysis.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`premium-glass-panel p-4 cursor-pointer transition-all duration-300 hover:scale-[1.01] ${
                          selectedItems.has(analysis.id) ? "ring-2 ring-purple-500/50" : ""
                        }`}
                        onClick={() => toggleSelection(analysis.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-white">{analysis.name}</h3>
                              <span className="text-sm text-purple-300 bg-purple-500/20 px-2 py-1 rounded">
                                {analysis.pair}
                              </span>
                              <div
                                className={`px-2 py-1 rounded text-xs font-medium border ${getRiskColor(analysis.metadata.riskLevel)}`}
                              >
                                {analysis.metadata.riskLevel.toUpperCase()}
                              </div>
                            </div>
                            <p className="text-purple-300/80 text-sm mb-2">{analysis.description}</p>
                            <div className="flex items-center gap-4 text-xs text-purple-400">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(analysis.timestamp).toLocaleString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                {analysis.metadata.confidence}% confidence
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getBiasIcon(analysis.multiTimeframe.confluence.overallBias)}
                            <input
                              type="checkbox"
                              checked={selectedItems.has(analysis.id)}
                              onChange={() => toggleSelection(analysis.id)}
                              className="w-4 h-4 text-purple-500 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500"
                            />
                          </div>
                        </div>

                        {analysis.tags.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <Tag className="w-3 h-3 text-purple-400" />
                            {analysis.tags.slice(0, 5).map((tag) => (
                              <span key={tag} className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {onLoadAnalysis && (
                          <div className="mt-3 pt-3 border-t border-purple-500/20">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onLoadAnalysis(analysis)
                                onClose()
                              }}
                              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              Load Analysis →
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-purple-500/20">
                <div className="flex items-center justify-between text-sm text-purple-300">
                  <span>{filteredHistory.length} analyses found</span>
                  {selectedItems.size > 0 && <span>{selectedItems.size} selected</span>}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
