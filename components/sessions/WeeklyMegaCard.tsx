"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAnalysis } from "@/lib/stores/useAnalysis"
import { ChevronLeft, ChevronRight, TrendingUpIcon, TrendingDownIcon, UnlockIcon, LockIcon } from "lucide-react"

interface WeeklyMegaCardProps {
  session: any
  index: number
  currentPrice: number
}

interface DayData {
  date: Date
  dayName: string
  high: number
  low: number
  open: number
  close: number
  range: number
  isUpcoming?: boolean
}

interface WeekData {
  current: {
    high: number
    low: number
    days: DayData[]
  }
  previous: {
    high: number
    low: number
    days: DayData[]
  }
}

export default function WeeklyMegaCard({ session, index, currentPrice }: WeeklyMegaCardProps) {
  const { overlays, instrument } = useAnalysis()
  const [weekData, setWeekData] = useState<WeekData | null>(null)
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null)
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })
  const [loading, setLoading] = useState(true)
  const [showPreviousWeek, setShowPreviousWeek] = useState(false)
  const [weekOffset, setWeekOffset] = useState(0)

  const getNYDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getNYDayBoundaries = (date: Date) => {
    const ny = new Date(date.toLocaleString("en-US", { timeZone: "America/New_York" }))
    const startOfDay = new Date(ny)
    startOfDay.setDate(startOfDay.getDate() - 1)
    startOfDay.setHours(17, 0, 0, 0) // Previous day 5pm NY

    const endOfDay = new Date(ny)
    endOfDay.setHours(17, 0, 0, 0) // Current day 5pm NY

    return { start: startOfDay, end: endOfDay }
  }

  const getRangeUnits = (range: number) => {
    if (!instrument?.symbol) return range.toFixed(5)

    const symbol = instrument.symbol.toUpperCase()

    // FX pairs
    if (symbol.includes("JPY")) {
      return `${(range * 100).toFixed(1)} pips`
    } else if (symbol.includes("XAU") || symbol.includes("XPT") || symbol.includes("XPD")) {
      return `${(range * 100).toFixed(1)} pips`
    } else if (symbol.includes("XAG")) {
      return `${(range * 1000).toFixed(1)} pips`
    } else if (symbol.length === 6 && !symbol.includes("US") && !symbol.includes("SPX")) {
      return `${(range * 10000).toFixed(1)} pips`
    } else {
      // Indices
      return `${range.toFixed(1)} ticks`
    }
  }

  const fetchDayData = async (start: Date, end: Date): Promise<DayData | null> => {
    try {
      const response = await fetch(
        `/api/market/candles?symbol=${instrument?.symbol || "EURUSD"}&provider=${instrument?.provider || "OANDA"}&resolution=1m&from=${Math.floor(start.getTime() / 1000)}&to=${Math.floor(end.getTime() / 1000)}`,
      )
      const data = await response.json()

      if (!data.candles || data.candles.length === 0) return null

      const candles = data.candles
      const high = Math.max(...candles.map((c: any) => c.h))
      const low = Math.min(...candles.map((c: any) => c.l))
      const open = candles[0].o
      const close = candles[candles.length - 1].c
      const range = high - low

      return {
        date: start,
        dayName: start.toLocaleDateString("en-US", { weekday: "short", timeZone: "America/New_York" }),
        high,
        low,
        open,
        close,
        range,
      }
    } catch (error) {
      console.error("Error fetching day data:", error)
      return null
    }
  }

  const navigateWeek = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setWeekOffset((prev) => prev - 1)
    } else if (direction === "next" && weekOffset < 0) {
      setWeekOffset((prev) => prev + 1)
    }
  }

  const isDayUpcoming = (date: Date) => {
    const now = new Date()
    const nyNow = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }))
    return date > nyNow
  }

  useEffect(() => {
    const loadWeekData = async () => {
      setLoading(true)

      const now = overlays?.meta?.now ? new Date(overlays.meta.now * 1000) : new Date()
      const nyNow = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }))

      const currentMonday = new Date(nyNow)
      currentMonday.setDate(nyNow.getDate() - nyNow.getDay() + 1 + weekOffset * 7)

      const previousMonday = new Date(currentMonday)
      previousMonday.setDate(currentMonday.getDate() - 7)

      const currentWeekDays: DayData[] = []
      const previousWeekDays: DayData[] = []

      for (let i = 0; i < 5; i++) {
        const day = new Date(currentMonday)
        day.setDate(currentMonday.getDate() + i)
        const boundaries = getNYDayBoundaries(day)

        const isUpcoming = isDayUpcoming(day)

        if (isUpcoming) {
          currentWeekDays.push({
            date: day,
            dayName: day.toLocaleDateString("en-US", { weekday: "short", timeZone: "America/New_York" }),
            high: 0,
            low: 0,
            open: 0,
            close: 0,
            range: 0,
            isUpcoming: true,
          })
        } else {
          const dayData = await fetchDayData(boundaries.start, boundaries.end)
          if (dayData) currentWeekDays.push(dayData)
        }
      }

      for (let i = 0; i < 5; i++) {
        const day = new Date(previousMonday)
        day.setDate(previousMonday.getDate() + i)
        const boundaries = getNYDayBoundaries(day)
        const dayData = await fetchDayData(boundaries.start, boundaries.end)
        if (dayData) previousWeekDays.push(dayData)
      }

      const currentHigh = Math.max(...currentWeekDays.filter((d) => !d.isUpcoming).map((d) => d.high))
      const currentLow = Math.min(...currentWeekDays.filter((d) => !d.isUpcoming).map((d) => d.low))
      const previousHigh = Math.max(...previousWeekDays.map((d) => d.high))
      const previousLow = Math.min(...previousWeekDays.map((d) => d.low))

      setWeekData({
        current: { high: currentHigh, low: currentLow, days: currentWeekDays },
        previous: { high: previousHigh, low: previousLow, days: previousWeekDays },
      })

      setLoading(false)
    }

    loadWeekData()
  }, [instrument, overlays, weekOffset])

  const handleDayHover = (day: DayData, event: React.MouseEvent) => {
    setHoveredDay(day)
    setHoverPosition({ x: event.clientX, y: event.clientY })
  }

  const FloatingDots = () => {
    const dots = [
      { id: 1, color: "bg-purple-400", top: "15%", left: "20%", delay: 0 },
      { id: 2, color: "bg-purple-400", top: "25%", left: "80%", delay: 0.5 },
      { id: 3, color: "bg-purple-400", top: "70%", left: "15%", delay: 1 },
      { id: 4, color: "bg-purple-400", top: "80%", left: "85%", delay: 1.5 },
      { id: 5, color: "bg-purple-400", top: "45%", left: "90%", delay: 2 },
    ]

    return (
      <>
        {dots.map((dot) => (
          <motion.div
            key={dot.id}
            className="absolute pointer-events-none z-20"
            style={{ top: dot.top, left: dot.left }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: dot.delay,
              ease: "easeInOut",
            }}
          >
            <div
              className={`h-2 w-2 rounded-full ${dot.color} shadow-lg`}
              style={{ boxShadow: `0 0 10px currentColor` }}
            />
          </motion.div>
        ))}
      </>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative group w-full"
    >
      <FloatingDots />

      <div className="relative overflow-hidden bg-transparent border-0">
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full animate-pulse"></div>
              {weekOffset === 0 ? "Current Week" : `Week ${Math.abs(weekOffset)} ${weekOffset < 0 ? "Ago" : "Ahead"}`}{" "}
              Candlesticks
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateWeek("prev")}
                className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-purple-400" />
              </button>
              <button
                onClick={() => navigateWeek("next")}
                disabled={weekOffset >= 0}
                className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4 text-purple-400" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border border-purple-400/30"></div>
              </div>
            </div>
          ) : weekData ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="grid grid-cols-5 gap-3">
                  {weekData.current.days.map((day, i) => {
                    if (day.isUpcoming) {
                      return (
                        <motion.div
                          key={`upcoming-${i}`}
                          className="premium-glass-segment backdrop-blur-xl bg-black/10 border border-purple-500/20 rounded-xl opacity-50"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 0.5, y: 0 }}
                          transition={{ duration: 0.6, delay: i * 0.1 + 0.2 }}
                        >
                          <div className="p-4 text-center">
                            <div className="text-sm font-bold mb-1 text-purple-300">{day.dayName}</div>
                            <div className="text-xs font-mono text-purple-400 mb-4">
                              {day.date.toLocaleDateString("en-US", {
                                month: "numeric",
                                day: "numeric",
                                timeZone: "America/New_York",
                              })}
                            </div>
                            <div className="flex items-center justify-center h-32">
                              <div className="text-purple-400 text-sm">Upcoming</div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    }

                    const isBullish = day.close > day.open
                    const isToday = new Date().toDateString() === day.date.toDateString()
                    const bodyHeight = Math.max((Math.abs(day.close - day.open) / (day.high - day.low)) * 200, 12)
                    const wickTopHeight = Math.max(
                      ((day.high - Math.max(day.open, day.close)) / (day.high - day.low)) * 200,
                      20,
                    )
                    const wickBottomHeight = Math.max(
                      ((Math.min(day.open, day.close) - day.low) / (day.high - day.low)) * 200,
                      20,
                    )

                    return (
                      <motion.div
                        key={`current-candle-${i}`}
                        className={`premium-glass-segment backdrop-blur-xl bg-black/20 border border-purple-500/30 ${isToday ? "border-purple-400/50" : "border-purple-500/20"} cursor-pointer overflow-hidden rounded-xl`}
                        whileHover={{ scale: 1.02, y: -2 }}
                        onMouseEnter={(e) => handleDayHover(day, e)}
                        onMouseLeave={() => setHoveredDay(null)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.1 + 0.2 }}
                      >
                        {isToday && (
                          <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-400 rounded-full animate-ping"></div>
                        )}

                        <div className="p-4">
                          <div className="mb-3">
                            <div className={`text-sm font-bold mb-1 ${isToday ? "text-purple-200" : "text-white"}`}>
                              {day.dayName}
                            </div>
                            <div className={`text-xs font-mono ${isToday ? "text-purple-300" : "text-purple-400"}`}>
                              {day.date.toLocaleDateString("en-US", {
                                month: "numeric",
                                day: "numeric",
                                timeZone: "America/New_York",
                              })}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex justify-center flex-shrink-0">
                              <div className="relative w-12 h-48 flex flex-col items-center justify-center">
                                <motion.div
                                  className="w-2 bg-gradient-to-b from-purple-300 to-purple-400 rounded-full"
                                  style={{ height: `${wickTopHeight}px` }}
                                  initial={{ height: 0 }}
                                  animate={{ height: `${wickTopHeight}px` }}
                                  transition={{ duration: 0.8, delay: i * 0.1 + 0.2 }}
                                />

                                <motion.div
                                  className={`w-12 ${isBullish ? "bg-gradient-to-b from-green-400 to-green-600" : "bg-gradient-to-b from-red-400 to-red-600"} rounded-lg shadow-lg relative border-2 ${isBullish ? "border-green-300/50" : "border-red-300/50"}`}
                                  style={{ height: `${bodyHeight}px` }}
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: `${bodyHeight}px`, opacity: 1 }}
                                  transition={{ duration: 0.8, delay: i * 0.1 + 0.4 }}
                                />

                                <motion.div
                                  className="w-2 bg-gradient-to-b from-purple-300 to-purple-400 rounded-full"
                                  style={{ height: `${wickBottomHeight}px` }}
                                  initial={{ height: 0 }}
                                  animate={{ height: `${wickBottomHeight}px` }}
                                  transition={{ duration: 0.8, delay: i * 0.1 + 0.6 }}
                                />
                              </div>
                            </div>

                            <div className="flex-1 space-y-2">
                              <motion.div
                                className="bg-black/20 rounded-xl p-2 backdrop-blur-sm"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: i * 0.1 + 0.8 }}
                              >
                                <div className="flex items-center gap-1 mb-1">
                                  <TrendingUpIcon className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400 font-medium text-xs">High</span>
                                </div>
                                <div className="text-white font-mono text-xs font-bold">{day.high.toFixed(5)}</div>
                              </motion.div>

                              <motion.div
                                className="bg-black/20 rounded-xl p-2 backdrop-blur-sm"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: i * 0.1 + 1.0 }}
                              >
                                <div className="flex items-center gap-1 mb-1">
                                  <LockIcon className="w-3 h-3 text-amber-400" />
                                  <span className="text-amber-400 font-medium text-xs">Close</span>
                                </div>
                                <div className="text-white font-mono text-xs font-bold">{day.close.toFixed(5)}</div>
                              </motion.div>

                              <motion.div
                                className="bg-black/20 rounded-xl p-2 backdrop-blur-sm"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: i * 0.1 + 1.2 }}
                              >
                                <div className="flex items-center gap-1 mb-1">
                                  <UnlockIcon className="w-3 h-3 text-blue-400" />
                                  <span className="text-blue-400 font-medium text-xs">Open</span>
                                </div>
                                <div className="text-white font-mono text-xs font-bold">{day.open.toFixed(5)}</div>
                              </motion.div>

                              <motion.div
                                className="bg-black/20 rounded-xl p-2 backdrop-blur-sm"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: i * 0.1 + 1.4 }}
                              >
                                <div className="flex items-center gap-1 mb-1">
                                  <TrendingDownIcon className="w-3 h-3 text-rose-400" />
                                  <span className="text-rose-400 font-medium text-xs">Low</span>
                                </div>
                                <div className="text-white font-mono text-xs font-bold">{day.low.toFixed(5)}</div>
                              </motion.div>
                            </div>
                          </div>

                          <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.1 + 1.8 }}
                          >
                            <div className="bg-black/40 border border-purple-500/30 rounded-lg px-3 py-2 backdrop-blur-sm">
                              <div className="text-purple-300 font-bold text-xs mb-1">Range of candle</div>
                              <div className="text-white font-mono text-sm font-bold">{getRangeUnits(day.range)}</div>
                            </div>
                          </motion.div>

                          <div
                            className={`absolute top-3 right-3 w-3 h-3 rounded-full ${isBullish ? "bg-green-400" : "bg-red-400"} animate-pulse shadow-lg`}
                          />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-purple-400 py-16">
              <div className="text-lg mb-2">No Market Data Available</div>
              <div className="text-sm">Please check your connection and try again</div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: hoverPosition.x + 10,
              top: hoverPosition.y - 10,
              transform: "translate(0, -100%)",
            }}
          >
            <div className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-xl p-4 shadow-2xl">
              <div className="text-sm font-medium text-white mb-2">
                {hoveredDay.dayName}{" "}
                {hoveredDay.date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  timeZone: "America/New_York",
                })}
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between gap-4">
                  <span className="text-purple-400">High:</span>
                  <span className="text-white font-mono">{hoveredDay.high.toFixed(5)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-violet-400">Low:</span>
                  <span className="text-white font-mono">{hoveredDay.low.toFixed(5)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Open:</span>
                  <span className="text-white font-mono">{hoveredDay.open.toFixed(5)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className={hoveredDay.close > hoveredDay.open ? "text-green-400" : "text-red-400"}>Close:</span>
                  <span className="text-white font-mono">{hoveredDay.close.toFixed(5)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-cyan-400">Range:</span>
                  <span className="text-white font-mono">{getRangeUnits(hoveredDay.range)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export { WeeklyMegaCard }
