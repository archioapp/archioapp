"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Calendar, TrendingUp, TrendingDown, Clock } from "lucide-react"
import { useState } from "react"

interface MonthlyMegaCardProps {
  session: any
  index: number
  currentPrice: number
}

export function MonthlyMegaCard({ session, index, currentPrice }: MonthlyMegaCardProps) {
  const [showPreviousMonth, setShowPreviousMonth] = useState(false)

  // Generate monthly data for the current and previous month
  const generateMonthlyData = () => {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Get days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const monthlyData = []

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
      const isWeekend = date.getDay() === 0 || date.getDay() === 6

      // Generate realistic OHLC data for each day
      const basePrice = 1.23 + (Math.random() - 0.5) * 0.01
      const volatility = 0.002
      const open = basePrice + (Math.random() - 0.5) * volatility
      const close = open + (Math.random() - 0.5) * volatility * 1.5
      const high = Math.max(open, close) + Math.random() * volatility * 0.8
      const low = Math.min(open, close) - Math.random() * volatility * 0.8

      monthlyData.push({
        day,
        dayName,
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        open: Number(open.toFixed(5)),
        high: Number(high.toFixed(5)),
        low: Number(low.toFixed(5)),
        close: Number(close.toFixed(5)),
        range: Number((high - low).toFixed(5)),
        isWeekend,
        isBullish: close > open,
      })
    }

    return monthlyData
  }

  const [monthlyData] = useState(generateMonthlyData())

  const currentMonthName = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })
  const previousMonthName = new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  // Calculate monthly statistics
  const monthlyHigh = Math.max(...monthlyData.map((d) => d.high))
  const monthlyLow = Math.min(...monthlyData.map((d) => d.low))
  const monthlyRange = monthlyHigh - monthlyLow
  const monthlyOpen = monthlyData[0]?.open || 1.23
  const monthlyClose = monthlyData[monthlyData.length - 1]?.close || 1.235

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative overflow-hidden rounded-2xl backdrop-blur-xl border bg-gradient-to-br from-indigo-900/40 via-purple-800/30 to-pink-900/40 border-indigo-500/40 group"
    >
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-30"
            style={{
              backgroundColor: "#8b5cf6",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="p-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center border border-indigo-500/40">
              <Calendar className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Monthly Analysis</h3>
              <p className="text-indigo-300/80 text-sm">{currentMonthName}</p>
            </div>
          </div>

          <motion.button
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 text-indigo-300 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPreviousMonth(!showPreviousMonth)}
          >
            Previous Month
          </motion.button>
        </div>

        {/* Current Month Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/30 backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-semibold text-sm">High</span>
            </div>
            <div className="text-white font-mono text-lg font-bold">{monthlyHigh.toFixed(5)}</div>
          </motion.div>

          <motion.div
            className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-rose-600/10 border border-red-500/30 backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-semibold text-sm">Low</span>
            </div>
            <div className="text-white font-mono text-lg font-bold">{monthlyLow.toFixed(5)}</div>
          </motion.div>

          <motion.div
            className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border border-blue-500/30 backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-400 text-sm font-bold">O</span>
              <span className="text-blue-400 font-semibold text-sm">Open</span>
            </div>
            <div className="text-white font-mono text-lg font-bold">{monthlyOpen.toFixed(5)}</div>
          </motion.div>

          <motion.div
            className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-violet-600/10 border border-purple-500/30 backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-purple-400 text-sm font-bold">C</span>
              <span className="text-purple-400 font-semibold text-sm">Close</span>
            </div>
            <div className="text-white font-mono text-lg font-bold">{monthlyClose.toFixed(5)}</div>
          </motion.div>
        </div>

        {/* Monthly Calendar Grid */}
        <div className="mb-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-indigo-300/60 text-xs font-medium py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {monthlyData.map((dayData, index) => (
              <motion.div
                key={index}
                className={`relative p-2 rounded-lg border backdrop-blur-sm group cursor-pointer ${
                  dayData.isWeekend
                    ? "bg-gray-500/10 border-gray-500/20"
                    : dayData.isBullish
                      ? "bg-green-500/10 border-green-500/20 hover:bg-green-500/20"
                      : "bg-red-500/10 border-red-500/20 hover:bg-red-500/20"
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
              >
                <div className="text-center">
                  <div
                    className={`text-xs font-bold mb-1 ${
                      dayData.isWeekend ? "text-gray-400" : dayData.isBullish ? "text-green-300" : "text-red-300"
                    }`}
                  >
                    {dayData.day}
                  </div>
                  <div className="text-xs text-white/60 font-mono">{(dayData.range * 10000).toFixed(0)}p</div>
                </div>

                {/* Hover tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                  <div className="bg-black/90 text-white text-xs rounded-lg p-3 whitespace-nowrap border border-indigo-500/30">
                    <div className="font-semibold mb-1">{dayData.date}</div>
                    <div className="space-y-1">
                      <div>O: {dayData.open.toFixed(5)}</div>
                      <div>H: {dayData.high.toFixed(5)}</div>
                      <div>L: {dayData.low.toFixed(5)}</div>
                      <div>C: {dayData.close.toFixed(5)}</div>
                      <div>Range: {(dayData.range * 10000).toFixed(1)} pips</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Range Information */}
        <motion.div
          className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-600/10 border border-indigo-500/30 backdrop-blur-sm"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <span className="text-indigo-400 text-sm font-bold">R</span>
              </div>
              <div>
                <span className="text-indigo-400 font-semibold text-sm">Monthly Range</span>
                <div className="text-indigo-300/60 text-xs">Total Price Movement</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-mono text-lg font-bold">{(monthlyRange * 10000).toFixed(1)} pips</div>
              <div className="text-indigo-300/70 text-xs">
                {monthlyClose > monthlyOpen ? "Bullish Month" : "Bearish Month"}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Previous Month Modal */}
      <AnimatePresence>
        {showPreviousMonth && (
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPreviousMonth(false)}
          >
            <motion.div
              className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 border border-indigo-500/40 rounded-2xl p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-indigo-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">Previous Month</h3>
                  <p className="text-indigo-300/80 text-sm">{previousMonthName}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <span className="text-indigo-300">High</span>
                  <span className="text-white font-mono">{(monthlyHigh - 0.002).toFixed(5)}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <span className="text-indigo-300">Low</span>
                  <span className="text-white font-mono">{(monthlyLow + 0.001).toFixed(5)}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <span className="text-indigo-300">Range</span>
                  <span className="text-white font-mono">{((monthlyRange - 0.003) * 10000).toFixed(1)} pips</span>
                </div>
              </div>

              <motion.button
                className="w-full mt-4 py-2 px-4 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:text-white transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowPreviousMonth(false)}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  )
}
