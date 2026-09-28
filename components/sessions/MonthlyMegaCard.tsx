"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAnalysis } from "@/lib/stores/useAnalysis"

interface Props {
  session: any
  index: number
  currentPrice: number
}

interface MonthData {
  month: string
  year: number
  high: number
  low: number
  open: number
  close: number
  range: number
  startDate: Date
  endDate: Date
}

export default function MonthlyMegaCard({ session, index, currentPrice }: Props) {
  const { instrument, overlays } = useAnalysis()
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null)
  const [monthsData, setMonthsData] = useState<MonthData[]>([])
  const [loading, setLoading] = useState(true)

  // Generate months from beginning of current year
  const generateYearMonths = () => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const months = []

    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1)
      const endDate = new Date(currentYear, month + 1, 0, 23, 59, 59)

      // Don't include future months
      if (startDate > currentDate) break

      months.push({
        month: startDate.toLocaleDateString("en-US", { month: "short" }),
        year: currentYear,
        startDate,
        endDate,
        high: 0,
        low: 0,
        open: 0,
        close: 0,
        range: 0,
      })
    }

    return months
  }

  // Fetch monthly data
  useEffect(() => {
    const fetchMonthlyData = async () => {
      if (!instrument?.symbol) return

      setLoading(true)
      const months = generateYearMonths()
      const updatedMonths = []

      for (const month of months) {
        try {
          const response = await fetch(
            `/api/market/candles?symbol=${instrument.symbol}&provider=${instrument.provider}&resolution=1D&from=${Math.floor(month.startDate.getTime() / 1000)}&to=${Math.floor(month.endDate.getTime() / 1000)}`,
          )
          const data = await response.json()

          if (data.candles && data.candles.length > 0) {
            const highs = data.candles.map((c: any) => c.high)
            const lows = data.candles.map((c: any) => c.low)
            const high = Math.max(...highs)
            const low = Math.min(...lows)
            const open = data.candles[0].open
            const close = data.candles[data.candles.length - 1].close

            updatedMonths.push({
              ...month,
              high,
              low,
              open,
              close,
              range: high - low,
            })
          } else {
            updatedMonths.push(month)
          }
        } catch (error) {
          console.error(`Error fetching data for ${month.month}:`, error)
          updatedMonths.push(month)
        }
      }

      setMonthsData(updatedMonths)
      setLoading(false)
    }

    fetchMonthlyData()
  }, [instrument])

  const formatPrice = (price: number) => {
    if (!price) return "—"
    return price.toFixed(5)
  }

  const formatRange = (range: number) => {
    if (!range || !instrument) return "—"

    // Determine if it's FX/metals (pips) or indices (ticks)
    const isFX =
      instrument.symbol?.includes("/") ||
      ["XAUUSD", "XAGUSD", "XPTUSD", "XPDUSD"].some((metal) => instrument.symbol?.toUpperCase().includes(metal))

    if (isFX) {
      const pips = range * (instrument.symbol?.includes("JPY") ? 100 : 10000)
      return `${pips.toFixed(1)} pips`
    } else {
      return `${range.toFixed(1)} ticks`
    }
  }

  const currentMonth = monthsData[monthsData.length - 1]
  const previousMonth = monthsData[monthsData.length - 2]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative h-80 bg-gradient-to-br from-black/40 via-black/30 to-black/20 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" />
      <div className="absolute inset-0 backdrop-blur-sm" />

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.5,
            }}
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + i * 8}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse" />
            <h3 className="text-lg font-semibold text-white">Monthly Analysis</h3>
          </div>

          <div className="flex gap-2">
            {previousMonth && (
              <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="text-xs text-gray-300">Prev: {previousMonth.month}</div>
                <div className="text-sm font-mono text-white">
                  H: {formatPrice(previousMonth.high)} L: {formatPrice(previousMonth.low)}
                </div>
              </div>
            )}

            {currentMonth && (
              <div className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-lg border border-purple-400/30">
                <div className="text-xs text-purple-300">Current: {currentMonth.month}</div>
                <div className="text-sm font-mono text-white">
                  H: {formatPrice(currentMonth.high)} L: {formatPrice(currentMonth.low)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="text-sm text-gray-400 mb-3">Year-to-Date Months</div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="flex-1 grid grid-cols-6 gap-2">
              {monthsData.map((month, idx) => (
                <motion.div
                  key={`${month.month}-${month.year}`}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setHoveredMonth(`${month.month}-${month.year}`)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="h-16 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-lg border border-white/20 p-2 group-hover:border-purple-400/50 transition-all duration-300">
                    <div className="text-xs font-medium text-white mb-1">{month.month}</div>
                    <div className="text-xs text-gray-300">{month.high ? formatRange(month.range) : "—"}</div>
                  </div>

                  <AnimatePresence>
                    {hoveredMonth === `${month.month}-${month.year}` && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
                      >
                        <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-4 min-w-48 shadow-2xl">
                          <div className="text-sm font-semibold text-white mb-2">
                            {month.month} {month.year}
                          </div>

                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-green-400">High:</span>
                              <span className="text-white font-mono">{formatPrice(month.high)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-red-400">Low:</span>
                              <span className="text-white font-mono">{formatPrice(month.low)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-400">Open:</span>
                              <span className="text-white font-mono">{formatPrice(month.open)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-yellow-400">Close:</span>
                              <span className="text-white font-mono">{formatPrice(month.close)}</span>
                            </div>
                            <div className="flex justify-between border-t border-white/10 pt-2">
                              <span className="text-purple-400">Range:</span>
                              <span className="text-white font-mono">{formatRange(month.range)}</span>
                            </div>
                          </div>

                          {/* Popover arrow */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/20" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export { MonthlyMegaCard }
