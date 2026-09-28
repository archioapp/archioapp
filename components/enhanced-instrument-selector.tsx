"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  Zap,
  BarChart3,
  DollarSign,
  Bitcoin,
  Coins,
  X,
  Heart,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Instrument } from "@/lib/instruments"
import { useAnalysis } from "@/lib/stores/useAnalysis"
import { normalizeSymbolForPolygon } from "@/lib/market/symbols"

interface EnhancedInstrumentSelectorProps {
  instruments: Instrument[]
  onSelect: (instrument: Instrument) => void
  onClose?: () => void
  label: string
  category: "forex" | "indices" | "crypto" | "commodities"
  isOpen?: boolean
  favorites?: Instrument[]
  onFavoritesUpdate?: (favorites: Instrument[]) => void
  position?: { top: number; left: number }
}

// Mock real-time data - in production this would come from a WebSocket or API
const generateMockPriceData = (symbol: string) => {
  const basePrice = Math.random() * 100 + 1
  const change = (Math.random() - 0.5) * 10
  const changePercent = (change / basePrice) * 100
  const volume = Math.floor(Math.random() * 1000000) + 100000
  const volatility = Math.random() * 5 + 0.5

  return {
    price: basePrice.toFixed(symbol.includes("JPY") ? 3 : 5),
    change: change.toFixed(5),
    changePercent: changePercent.toFixed(2),
    volume: volume.toLocaleString(),
    volatility: volatility.toFixed(1),
    isPositive: change >= 0,
    marketStatus: Math.random() > 0.3 ? "open" : "closed",
    spread: (Math.random() * 0.01).toFixed(5),
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "forex":
      return Globe
    case "indices":
      return BarChart3
    case "crypto":
      return Bitcoin
    case "commodities":
      return Coins
    default:
      return DollarSign
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "forex":
      return "from-blue-500/20 to-cyan-500/20 border-blue-400/30"
    case "indices":
      return "from-purple-500/20 to-pink-500/20 border-purple-400/30"
    case "crypto":
      return "from-orange-500/20 to-yellow-500/20 border-orange-400/30"
    case "commodities":
      return "from-green-500/20 to-emerald-500/20 border-green-400/30"
    default:
      return "from-gray-500/20 to-slate-500/20 border-gray-400/30"
  }
}

export function EnhancedInstrumentSelector({
  instruments,
  onSelect,
  onClose,
  label,
  category,
  isOpen = false,
  favorites = [],
  onFavoritesUpdate,
  position,
}: EnhancedInstrumentSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const favoriteSymbols = favorites.map((f) => f.symbol)
  const [sortBy, setSortBy] = useState<"name" | "change" | "volume" | "volatility">("name")
  const [filterBy, setFilterBy] = useState<"all" | "favorites" | "trending">("all")
  const [priceData, setPriceData] = useState<Record<string, any>>({})
  const { setSelectedPair } = useAnalysis()

  // Generate mock price data for all instruments
  useEffect(() => {
    const data: Record<string, any> = {}
    instruments.forEach((instrument) => {
      data[instrument.symbol] = generateMockPriceData(instrument.symbol)
    })
    setPriceData(data)

    // Update prices every 2 seconds
    const interval = setInterval(() => {
      const updatedData: Record<string, any> = {}
      instruments.forEach((instrument) => {
        updatedData[instrument.symbol] = generateMockPriceData(instrument.symbol)
      })
      setPriceData(updatedData)
    }, 2000)

    return () => clearInterval(interval)
  }, [instruments])

  const toggleFavorite = (instrument: Instrument) => {
    if (!onFavoritesUpdate) return

    const isFavorite = favoriteSymbols.includes(instrument.symbol)
    let newFavorites: Instrument[]

    if (isFavorite) {
      newFavorites = favorites.filter((f) => f.symbol !== instrument.symbol)
    } else {
      newFavorites = [...favorites, instrument]
    }

    onFavoritesUpdate(newFavorites)
  }

  const filteredAndSortedInstruments = useMemo(() => {
    let filtered = instruments.filter(
      (instrument) =>
        instrument.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instrument.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    // Apply filters
    if (filterBy === "favorites") {
      filtered = filtered.filter((instrument) => favoriteSymbols.includes(instrument.symbol))
    } else if (filterBy === "trending") {
      filtered = filtered.filter((instrument) => {
        const data = priceData[instrument.symbol]
        return data && Math.abs(Number.parseFloat(data.changePercent)) > 1
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aData = priceData[a.symbol]
      const bData = priceData[b.symbol]

      switch (sortBy) {
        case "change":
          return Number.parseFloat(bData?.changePercent || "0") - Number.parseFloat(aData?.changePercent || "0")
        case "volume":
          return (
            Number.parseInt(bData?.volume?.replace(/,/g, "") || "0") -
            Number.parseInt(aData?.volume?.replace(/,/g, "") || "0")
          )
        case "volatility":
          return Number.parseFloat(bData?.volatility || "0") - Number.parseFloat(aData?.volatility || "0")
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [instruments, searchQuery, filterBy, sortBy, favoriteSymbols, priceData])

  const CategoryIcon = getCategoryIcon(category)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed z-50 w-[420px]"
        style={
          position
            ? {
                top: position.top + 8,
                left: Math.max(16, Math.min(position.left, window.innerWidth - 420 - 16)),
              }
            : {
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }
        }
      >
        <div className="bg-zinc-900/95 border border-zinc-700/50 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden">
          <div className="flex h-[320px]">
            {/* LEFT COLUMN - Controls */}
            <div className="w-[140px] border-r border-zinc-700/50 p-3 flex flex-col bg-zinc-800/30">
              {/* Category Header */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getCategoryColor(category)} flex items-center justify-center`}
                >
                  <CategoryIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white leading-tight">{label}</h3>
                  <span className="text-[10px] text-zinc-400">{filteredAndSortedInstruments.length} pairs</span>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-zinc-500" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-7 h-7 text-[11px] bg-zinc-800/80 border-zinc-600/50 text-white placeholder:text-zinc-500 focus:border-purple-500/50 rounded-md"
                />
              </div>

              {/* Filter Buttons - Vertical Stack */}
              <div className="flex flex-col gap-1.5 mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterBy("all")}
                  className={`justify-start h-7 text-[11px] px-2 rounded-md transition-all ${
                    filterBy === "all"
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
                  }`}
                >
                  <BarChart3 className="w-3 h-3 mr-1.5" />
                  All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterBy("favorites")}
                  className={`justify-start h-7 text-[11px] px-2 rounded-md transition-all ${
                    filterBy === "favorites"
                      ? "bg-red-500/20 text-red-300 border border-red-500/30"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
                  }`}
                >
                  <Heart className="w-3 h-3 mr-1.5" />
                  Favorites
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterBy("trending")}
                  className={`justify-start h-7 text-[11px] px-2 rounded-md transition-all ${
                    filterBy === "trending"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
                  }`}
                >
                  <TrendingUp className="w-3 h-3 mr-1.5" />
                  Trending
                </Button>
              </div>

              {/* Sort Dropdown */}
              <div className="mt-auto">
                <label className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1 block">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full h-7 text-[11px] bg-zinc-800/80 border border-zinc-600/50 rounded-md text-zinc-300 px-2"
                >
                  <option value="name">Name</option>
                  <option value="change">% Change</option>
                  <option value="volume">Volume</option>
                  <option value="volatility">Volatility</option>
                </select>
              </div>
            </div>

            {/* RIGHT COLUMN - Scrollable Pairs List */}
            <div className="flex-1 flex flex-col">
              {/* Close Button */}
              <div className="flex justify-end p-2 border-b border-zinc-700/30">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="w-6 h-6 text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded-md"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Scrollable List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredAndSortedInstruments.map((instrument) => {
                  const data = priceData[instrument.symbol]
                  const isFavorite = favoriteSymbols.includes(instrument.symbol)

                  return (
                    <motion.button
                      key={instrument.id}
                      onClick={() => handleInstrumentSelect(instrument, onSelect, setSelectedPair, onClose)}
                      className="w-full p-2 rounded-lg bg-zinc-800/40 hover:bg-zinc-700/60 border border-zinc-700/30 hover:border-purple-500/40 transition-all duration-150 group"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-full bg-gradient-to-br ${getCategoryColor(category)} flex items-center justify-center flex-shrink-0`}
                          >
                            <span className="text-[9px] font-bold text-white">{instrument.symbol.substring(0, 2)}</span>
                          </div>

                          <div className="text-left min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="text-[11px] font-semibold text-white">{instrument.symbol}</span>
                              {data?.marketStatus === "open" && (
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              )}
                            </div>
                            <div className="text-[9px] text-zinc-500 truncate max-w-[70px]">{instrument.name}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {data && (
                            <div className="text-right">
                              <div className="text-[11px] font-mono text-white">{data.price}</div>
                              <div
                                className={`text-[9px] font-medium flex items-center justify-end gap-0.5 ${
                                  data.isPositive ? "text-emerald-400" : "text-red-400"
                                }`}
                              >
                                {data.isPositive ? (
                                  <TrendingUp className="w-2 h-2" />
                                ) : (
                                  <TrendingDown className="w-2 h-2" />
                                )}
                                {data.changePercent}%
                              </div>
                            </div>
                          )}

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(instrument)
                            }}
                            className="w-6 h-6 rounded-md hover:bg-zinc-600/50"
                          >
                            <Heart
                              className={`w-3 h-3 ${isFavorite ? "fill-red-400 text-red-400" : "text-zinc-500"}`}
                            />
                          </Button>
                        </div>
                      </div>

                      {/* Compact Stats Row */}
                      {data && (
                        <div className="flex items-center gap-3 mt-1.5 pt-1.5 border-t border-zinc-700/30 text-[8px] text-zinc-500">
                          <span className="flex items-center gap-0.5">
                            <Activity className="w-2 h-2" />
                            {data.volume}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Zap className="w-2 h-2" />
                            {data.volatility}%
                          </span>
                          <span className="flex items-center gap-0.5">
                            <BarChart3 className="w-2 h-2" />
                            {data.spread}
                          </span>
                        </div>
                      )}
                    </motion.button>
                  )
                })}

                {filteredAndSortedInstruments.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-zinc-500">
                    <Search className="w-6 h-6 mb-2 opacity-50" />
                    <span className="text-xs">No instruments found</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-2 border-t border-zinc-700/30 bg-zinc-800/30">
                <div className="flex items-center justify-between text-[9px] text-zinc-500">
                  <span>Real-time institutional data</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400">Live Market Data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

const handleInstrumentSelect = (
  instrument: Instrument,
  onSelect: (instrument: Instrument) => void,
  setSelectedPair: any,
  onClose?: () => void,
) => {
  onSelect(instrument)
  // Normalize symbol for Polygon API and update analysis store
  const polygonSymbol = normalizeSymbolForPolygon(instrument.symbol)
  setSelectedPair(polygonSymbol)
  onClose?.()
}
