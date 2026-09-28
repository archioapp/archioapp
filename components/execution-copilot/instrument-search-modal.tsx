"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { allInstruments, type Instrument } from "@/lib/instruments"
import { Search, X, TrendingUp, TrendingDown, Activity, Star, Zap } from "lucide-react"

interface InstrumentSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (instrument: Instrument) => void
}

const categoryColors = {
  forex: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
  indices: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
  crypto: "from-orange-500/20 to-amber-500/20 border-orange-500/30",
  commodities: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
}

const categoryIcons = {
  forex: "💱",
  indices: "📊",
  crypto: "₿",
  commodities: "🛢️",
}

// Mock real-time data generator
const generateMarketData = (instrument: Instrument) => {
  const basePrice = Math.random() * 1000 + 100
  const change = (Math.random() - 0.5) * 10
  const changePercent = (change / basePrice) * 100
  const volume = Math.random() * 1000000
  const volatility = Math.random() * 5

  return {
    price: basePrice.toFixed(4),
    change: change.toFixed(4),
    changePercent: changePercent.toFixed(2),
    volume: volume.toFixed(0),
    volatility: volatility.toFixed(1),
    isPositive: change >= 0,
  }
}

export function InstrumentSearchModal({ isOpen, onClose, onSelect }: InstrumentSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"name" | "volume" | "volatility">("name")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const filteredInstruments = useMemo(() => {
    let filtered = allInstruments

    if (searchTerm) {
      filtered = filtered.filter(
        (inst) =>
          inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inst.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((inst) => inst.category === selectedCategory)
    }

    // Sort instruments
    filtered.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "volume") return Math.random() - 0.5 // Mock sorting
      if (sortBy === "volatility") return Math.random() - 0.5 // Mock sorting
      return 0
    })

    return filtered
  }, [searchTerm, selectedCategory, sortBy])

  const categories = [
    { id: "all", name: "All", icon: "🌐" },
    { id: "forex", name: "Forex", icon: "💱" },
    { id: "indices", name: "Indices", icon: "📊" },
    { id: "crypto", name: "Crypto", icon: "₿" },
    { id: "commodities", name: "Commodities", icon: "🛢️" },
  ]

  const toggleFavorite = (instrumentId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(instrumentId)) {
      newFavorites.delete(instrumentId)
    } else {
      newFavorites.add(instrumentId)
    }
    setFavorites(newFavorites)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      >
        {/* Backdrop with blur */}
        <div className="absolute inset-0 backdrop-blur-xl bg-black/60" onClick={onClose} />

        {/* Floating particles background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Main Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(25, 25, 40, 0.95) 100%)",
            backdropFilter: "blur(40px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "24px",
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-[24px] bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-emerald-500/20 opacity-50 animate-pulse" />

          {/* Header */}
          <div className="relative p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/30"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Search className="w-6 h-6 text-purple-400" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Premium Instrument Search</h2>
                  <p className="text-gray-400 text-sm">
                    Discover and analyze {allInstruments.length}+ institutional-grade instruments
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Search Bar */}
            <div className="relative mt-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl blur-sm" />
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-purple-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search instruments by name, symbol, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-black/30 transition-all duration-200"
                  style={{ backdropFilter: "blur(20px)" }}
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedCategory === category.id
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="relative flex-1 overflow-hidden">
            <div className="h-[60vh] overflow-y-auto p-6 space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredInstruments.map((instrument, index) => {
                  const marketData = generateMarketData(instrument)
                  const isFavorite = favorites.has(instrument.id)

                  return (
                    <motion.div
                      key={instrument.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.02 }}
                      className="group relative"
                    >
                      {/* Hoverboard effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-emerald-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.02 }}
                      />

                      <motion.button
                        onClick={() => onSelect(instrument)}
                        className="relative w-full p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/20 transition-all duration-300 text-left group-hover:bg-black/30"
                        style={{ backdropFilter: "blur(20px)" }}
                        whileHover={{
                          y: -2,
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 20px rgba(147, 51, 234, 0.1)",
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Category Icon */}
                            <motion.div
                              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColors[instrument.category as keyof typeof categoryColors]} flex items-center justify-center text-lg`}
                              whileHover={{ rotate: 10, scale: 1.1 }}
                            >
                              {categoryIcons[instrument.category as keyof typeof categoryIcons]}
                            </motion.div>

                            {/* Instrument Info */}
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                                  {instrument.symbol}
                                </h3>
                                <motion.button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleFavorite(instrument.id)
                                  }}
                                  className={`p-1 rounded-full transition-colors ${
                                    isFavorite ? "text-yellow-400" : "text-gray-500 hover:text-yellow-400"
                                  }`}
                                  whileHover={{ scale: 1.2, rotate: 15 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Star className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
                                </motion.button>
                              </div>
                              <p className="text-sm text-gray-400">{instrument.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300 capitalize">
                                  {instrument.category}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Market Data */}
                          <div className="text-right space-y-1">
                            <div className="text-lg font-bold text-white">${marketData.price}</div>
                            <div
                              className={`flex items-center gap-1 text-sm ${
                                marketData.isPositive ? "text-emerald-400" : "text-red-400"
                              }`}
                            >
                              {marketData.isPositive ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              {marketData.changePercent}%
                            </div>
                            <div className="text-xs text-gray-500">
                              Vol: {marketData.volatility}% | Vol:{" "}
                              {(Number.parseInt(marketData.volume) / 1000).toFixed(0)}K
                            </div>
                          </div>
                        </div>

                        {/* Animated progress bar */}
                        <motion.div
                          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                          initial={{ width: 0 }}
                          whileHover={{ width: "100%" }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.button>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {filteredInstruments.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400">No instruments found matching your search</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Footer Stats */}
          <div className="relative p-4 border-t border-white/10 bg-black/20">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>
                Showing {filteredInstruments.length} of {allInstruments.length} instruments
              </span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  Live Data
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  Real-time
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
