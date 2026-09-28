"use client"

import { motion } from "framer-motion"
import { Activity, LockIcon, TrendingDownIcon, TrendingUpIcon, UnlockIcon } from "lucide-react"
import { useEffect, useState } from "react"
import type { SessionAnalysis, SessionData } from "@/lib/session-analysis"
import { useOverlaysSelectors } from "@/lib/selectors/overlays"
import { useLivePrice } from "@/lib/hooks/useLivePrice"
import { useAnalysis } from "@/lib/stores/useAnalysis"
import { useInstrument } from "@/lib/stores/useInstrument"
import { valuesFor, valPrev, f5, sessionState } from "@/lib/analysis/sessionSelectors"
import { WeeklyMegaCard } from "./sessions/WeeklyMegaCard"
// import { MonthlyMegaCard } from "./MonthlyMegaCard"

interface SessionAnalysisDisplayProps {
  analysis: SessionAnalysis | null
  isLoading: boolean
}

function getCurrentSession() {
  const now = new Date()
  const hour = now.getHours()

  // Convert to UTC and then to different timezone hours for session detection
  // Asia: 8pm - 12am (20:00 - 00:00)
  // London: 2am - 8am (02:00 - 08:00)
  // New York: 8am - 5pm (08:00 - 17:00)

  if (hour >= 20 || hour < 0) return "Asia Session"
  if (hour >= 2 && hour < 8) return "London Session"
  if (hour >= 8 && hour < 17) return "New York Session"
  return null
}

function getIncomingSessions(currentActiveSession: string | null) {
  if (!currentActiveSession) return []

  switch (currentActiveSession) {
    case "Asia Session":
      return ["London Session", "New York Session"]
    case "London Session":
      return ["New York Session"]
    case "New York Session":
      return ["Asia Session"]
    default:
      return []
  }
}

const getSessionDisplayName = (sessionName: string) => {
  switch (sessionName) {
    case "Asia Session":
      return "Asian Banking Hours"
    case "London Session":
      return "European Banking Hours"
    case "New York Session":
      return "USA Banking Hours"
    default:
      return sessionName
  }
}

const getStatusEmoji = (sessionName: string) => {
  switch (sessionName) {
    case "Asia Session":
      return "" // COMPLETED - removed emoji
    case "London Session":
      return "" // LIVE - removed emoji
    case "New York Session":
      return "" // UPCOMING - removed emoji
    default:
      return ""
  }
}

const formatCountdownTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

function getSessionCountdownTime(sessionName: string) {
  const now = new Date()
  const hour = now.getHours()
  const minute = now.getMinutes()

  const sessionTimes = {
    "Asia Session": { start: 17, end: 24 }, // 5pm - 12am
    "London Session": { start: 2, end: 8 }, // 2am - 8am
    "New York Session": { start: 8, end: 17 }, // 8am - 5pm
  }

  const session = sessionTimes[sessionName as keyof typeof sessionTimes]
  if (!session) return { status: "UNKNOWN", timeLeft: 0, timeToNext: 0 }

  const currentMinutes = hour * 60 + minute
  const startMinutes = session.start * 60
  const endMinutes = session.end === 24 ? 0 : session.end * 60

  // Check if session is currently live
  const isLive =
    session.end === 24
      ? currentMinutes >= startMinutes || currentMinutes < endMinutes
      : currentMinutes >= startMinutes && currentMinutes < endMinutes

  if (isLive) {
    const timeLeft =
      session.end === 24
        ? currentMinutes < endMinutes
          ? endMinutes - currentMinutes
          : 24 * 60 - currentMinutes + endMinutes
        : endMinutes - currentMinutes
    return { status: "LIVE", timeLeft, timeToNext: 0 }
  }

  // Check if session is upcoming
  const isUpcoming = currentMinutes < startMinutes
  if (isUpcoming) {
    const timeToNext = startMinutes - currentMinutes
    return { status: "UPCOMING", timeLeft: 0, timeToNext }
  }

  // Session is completed
  return { status: "COMPLETED", timeLeft: 0, timeToNext: 0 }
}

function formatCountdownTime2(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

const SessionStatusIndicator = ({ sessionName }: { sessionName: string }) => {
  const [countdown, setCountdown] = useState(getSessionCountdownTime(sessionName))

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getSessionCountdownTime(sessionName))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [sessionName])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "LIVE":
        return "text-green-400"
      case "UPCOMING":
        return "text-orange-400"
      case "COMPLETED":
        return "text-purple-300/60"
      default:
        return "text-slate-400"
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case "LIVE":
        return "bg-green-400/10 border-green-400/20"
      case "UPCOMING":
        return "bg-orange-400/10 border-orange-400/20"
      case "COMPLETED":
        return "bg-purple-400/5 border-purple-400/10"
      default:
        return "bg-slate-400/10 border-slate-400/20"
    }
  }

  return (
    <div className="space-y-2">
      {/* Main Status */}
      <div className={`px-3 py-2 rounded-xl border backdrop-blur-sm ${getStatusBg(countdown.status)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${countdown.status === "LIVE" ? "bg-green-400 animate-pulse" : countdown.status === "UPCOMING" ? "bg-orange-400" : "bg-purple-300/60"}`}
            />
            <span className={`text-sm font-bold ${getStatusColor(countdown.status)}`}>{countdown.status}</span>
          </div>
          {countdown.status === "LIVE" && countdown.timeLeft > 0 && (
            <span className="text-green-300 text-xs font-mono">Ends in {formatCountdownTime2(countdown.timeLeft)}</span>
          )}
        </div>
      </div>

      {/* Next Session Info */}
      {countdown.status !== "LIVE" && countdown.timeToNext > 0 && (
        <div className="px-3 py-1.5 rounded-lg bg-slate-800/30 border border-slate-700/30">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs">
              {countdown.status === "UPCOMING" ? "Starts in" : "Next session"}
            </span>
            <span className="text-slate-300 text-xs font-mono">{formatCountdownTime2(countdown.timeToNext)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

const SessionMiniChart = ({ session, currentPrice }: { session: any; currentPrice: number }) => {
  const analysisStore = useAnalysis()
  const { sessionBars = {}, sessionOHLC = {}, selectedPair } = analysisStore || {}
  const width = 350
  const height = 220

  const getSessionKey = (): "asia" | "london" | "newyork" => {
    switch (session.name) {
      case "Asia":
        return "asia"
      case "London":
        return "london"
      case "New York":
        return "newyork"
      default:
        return "asia"
    }
  }

  const sessionKey = getSessionKey()
  const bars = sessionBars[sessionKey] || []
  const ohlc = sessionOHLC[sessionKey]

  const renderChart = () => {
    const chartBars = bars

    if (!chartBars || chartBars.length === 0) {
      // Show empty chart with grid when no real data is available
      return (
        <svg width={width} height={height} className="w-full" style={{ height: "220px" }}>
          <defs>
            <linearGradient id="emptyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(100, 116, 139, 0.3)" />
              <stop offset="100%" stopColor="rgba(100, 116, 139, 0.1)" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={(i * height) / 4}
              x2={width}
              y2={(i * height) / 4}
              stroke="rgba(100, 116, 139, 0.2)"
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={(i * width) / 8}
              y1="0"
              x2={(i * width) / 8}
              y2={height}
              stroke="rgba(100, 116, 139, 0.2)"
              strokeWidth="1"
            />
          ))}

          {/* No data message */}
          <text x={width / 2} y={height / 2} textAnchor="middle" className="fill-gray-400 text-sm font-medium">
            Loading session data...
          </text>
        </svg>
      )
    }

    // Render actual candlestick chart with bars data
    const chartHeight = height - 40
    const chartWidth = width - 100
    const padding = 20

    // Calculate price range
    const allPrices = chartBars.flatMap((bar) => [bar.o, bar.h, bar.l, bar.c])
    const minPrice = Math.min(...allPrices)
    const maxPrice = Math.max(...allPrices)
    const priceRange = maxPrice - minPrice || 0.001

    // Scale functions
    const xScale = (index: number) => padding + (index * chartWidth) / Math.max(chartBars.length - 1, 1)
    const yScale = (price: number) => padding + ((maxPrice - price) / priceRange) * chartHeight

    return (
      <svg width={width} height={height} className="w-full" style={{ height: "220px" }}>
        <defs>
          <linearGradient id="bullishGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(34, 197, 94, 0.8)" />
            <stop offset="100%" stopColor="rgba(34, 197, 94, 0.4)" />
          </linearGradient>
          <linearGradient id="bearishGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(239, 68, 68, 0.8)" />
            <stop offset="100%" stopColor="rgba(239, 68, 68, 0.4)" />
          </linearGradient>
        </defs>

        {/* Chart grid */}
        <line
          x1={padding}
          y1={padding}
          x2={width - 80}
          y2={padding}
          stroke="rgba(100, 116, 139, 0.3)"
          strokeWidth="1"
          strokeDasharray="6,4"
        />
        <line
          x1={padding}
          y1={height / 2}
          x2={width - 80}
          y2={height / 2}
          stroke="rgba(100, 116, 139, 0.2)"
          strokeWidth="1"
          strokeDasharray="6,4"
        />
        <line
          x1={padding}
          y1={height - padding}
          x2={width - 80}
          y2={height - padding}
          stroke="rgba(100, 116, 139, 0.3)"
          strokeWidth="1"
          strokeDasharray="6,4"
        />

        {/* Render candlesticks */}
        {chartBars.map((bar, index) => {
          const x = xScale(index)
          const isBullish = bar.c >= bar.o
          const bodyTop = yScale(Math.max(bar.o, bar.c))
          const bodyBottom = yScale(Math.min(bar.o, bar.c))
          const bodyHeight = Math.max(bodyBottom - bodyTop, 2)
          const candleWidth = Math.max((chartWidth / chartBars.length) * 0.6, 2)

          return (
            <g key={index}>
              {/* Wick */}
              <line
                x1={x}
                y1={yScale(bar.h)}
                x2={x}
                y2={yScale(bar.l)}
                stroke={isBullish ? "#22c55e" : "#ef4444"}
                strokeWidth="1"
              />
              {/* Body */}
              <rect
                x={x - candleWidth / 2}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                fill={isBullish ? "url(#bullishGradient)" : "url(#bearishGradient)"}
                stroke={isBullish ? "#22c55e" : "#ef4444"}
                strokeWidth="1"
              />
            </g>
          )
        })}

        {/* Price labels */}
        <text x={width - 70} y={padding + 5} fill="rgba(100, 116, 139, 0.8)" fontSize="10" fontFamily="monospace">
          {maxPrice.toFixed(5)}
        </text>
        <text
          x={width - 70}
          y={height - padding + 5}
          fill="rgba(100, 116, 139, 0.8)"
          fontSize="10"
          fontFamily="monospace"
        >
          {minPrice.toFixed(5)}
        </text>

        {bars.length === 0 && (
          <text x={padding + 10} y={height - 10} fill="rgba(100, 116, 139, 0.6)" fontSize="9" fontFamily="monospace">
            Recent Session Data
          </text>
        )}
      </svg>
    )
  }

  return (
    <div className="w-full relative" style={{ height: "220px" }}>
      {renderChart()}
    </div>
  )
}

const SessionPriceChart = ({
  session,
  width = 200,
  height = 80,
}: { session: SessionData; width?: number; height?: number }) => {
  const [priceData, setPriceData] = useState<{ time: number; price: number }[]>([])
  const [currentPrice, setCurrentPrice] = useState(session.open || 1.23456)

  useEffect(() => {
    // Generate realistic price movement data for the session
    const generatePriceData = () => {
      const data = []
      const basePrice = session.open || 1.23456
      const high = session.high || basePrice + 0.001
      const low = session.low || basePrice - 0.001
      const volatility = (high - low) / 4

      for (let i = 0; i < 60; i++) {
        const time = Date.now() - (60 - i) * 60000 // 1 minute intervals
        const randomWalk = (Math.random() - 0.5) * volatility
        const price = Math.max(low, Math.min(high, basePrice + randomWalk + Math.sin(i / 10) * volatility * 0.5))
        data.push({ time, price })
      }
      return data
    }

    setPriceData(generatePriceData())

    // Animate current price
    const interval = setInterval(() => {
      const lastPrice = priceData[priceData.length - 1]?.price || currentPrice
      const change = (Math.random() - 0.5) * 0.0001
      const newPrice = Math.max(session.low || 1.23, Math.min(session.high || 1.24, lastPrice + change))
      setCurrentPrice(newPrice)

      setPriceData((prev) => {
        const newData = [...prev.slice(1), { time: Date.now(), price: newPrice }]
        return newData
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [session])

  const minPrice = Math.min(...priceData.map((d) => d.price))
  const maxPrice = Math.max(...priceData.map((d) => d.price))
  const priceRange = maxPrice - minPrice || 0.001

  const getY = (price: number) => height - ((price - minPrice) / priceRange) * height
  const getX = (index: number) => (index / (priceData.length - 1)) * width

  const pathData = priceData
    .map((point, index) => `${index === 0 ? "M" : "L"} ${getX(index)} ${getY(point.price)}`)
    .join(" ")

  return (
    <div className="relative">
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={`priceGradient-${session.name}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
          </linearGradient>
          <filter id={`glow-${session.name}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* High/Low dashed lines */}
        <motion.line
          x1="0"
          y1={getY(session.high || maxPrice)}
          x2={width}
          y2={getY(session.high || maxPrice)}
          stroke="#10b981"
          strokeWidth="1"
          strokeDasharray="3,3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.5 }}
        />
        <motion.line
          x1="0"
          y1={getY(session.low || minPrice)}
          x2={width}
          y2={getY(session.low || minPrice)}
          stroke="#ef4444"
          strokeWidth="1"
          strokeDasharray="3,3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.5 }}
        />

        {/* Price area fill */}
        <motion.path
          d={`${pathData} L ${width} ${height} L 0 ${height} Z`}
          fill={`url(#priceGradient-${session.name})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Price line */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="2"
          filter={`url(#glow-${session.name})`}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Current price dot */}
        <motion.circle
          cx={getX(priceData.length - 1)}
          cy={getY(currentPrice)}
          r="3"
          fill="#8b5cf6"
          filter={`url(#glow-${session.name})`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        />
      </svg>

      {/* High/Low labels */}
      <div className="absolute top-0 right-0 text-xs text-emerald-400 font-mono">
        H: {(session.high || maxPrice).toFixed(5)}
      </div>
      <div className="absolute bottom-0 right-0 text-xs text-red-400 font-mono">
        L: {(session.low || minPrice).toFixed(5)}
      </div>
    </div>
  )
}

const FloatingCurrencyDots = ({ session }: { session: string }) => {
  const getCurrencySymbol = () => {
    if (session.includes("Asian")) return "¥"
    if (session.includes("European")) return "€"
    if (session.includes("USA")) return "$"
    return "$"
  }

  const getColor = () => {
    if (session.includes("Asian")) return "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
    if (session.includes("European")) return "text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
    if (session.includes("USA")) return "text-emerald-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]"
    return "text-emerald-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]"
  }

  return (
    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-40">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute text-lg font-bold ${getColor()}`}
          style={{
            left: `${i === 0 ? -70 : -40 + i * 40}px`,
            top: `${-8 + (i % 2) * 12}px`,
          }}
          animate={{
            y: [-15, 15, -15],
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.6,
          }}
        >
          {getCurrencySymbol()}
        </motion.div>
      ))}
    </div>
  )
}

function SessionCard({ session, index, currentPrice }: { session: SessionData; index: number; currentPrice: number }) {
  const { overlays, stats } = useOverlaysSelectors()
  const livePrice = useLivePrice()
  const { last } = livePrice || { last: null }
  const { overlays: overlaysData = {}, sessionOHLC = {} } = useAnalysis()
  const A = valuesFor(overlaysData, "asia")
  const L = valuesFor(overlaysData, "london")
  const N = valuesFor(overlaysData, "newyork")
  const D = valuesFor(overlaysData, "daily")
  const W = valuesFor(overlaysData, "weekly")
  const M = valuesFor(overlaysData, "monthly")
  const AP = valPrev(overlaysData, "asia")
  const LP = valPrev(overlaysData, "london")
  const NP = valPrev(overlaysData, "newyork")

  const [currentActiveSession, setCurrentActiveSession] = useState<string | null>(null)
  const [dayOpen, setDayClose] = useState<number | undefined>(undefined)
  const [dayClose, setDayOpen] = useState<number | undefined>(undefined)
  const [stats2, setStats] = useState<any>(undefined)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showCurrentAnalysis, setShowCurrentAnalysis] = useState(false)
  const [historicalOHLC, setHistoricalOHLC] = useState<{
    open: number
    high: number
    low: number
    close: number
  } | null>(null)
  const [showPrediction, setShowPrediction] = useState(false)

  const { dailyHi, dailyLo, asiaHi, asiaLo, wkOpen, pdSide } = useOverlaysSelectors()
  const { symbol } = useInstrument()

  useEffect(() => {
    let isMounted = true
    async function run() {
      if (!overlays?.meta?.windows?.prevDaily || !symbol) return
      const [prevDailyOpen, currentDailyOpen] = overlays.meta.windows.prevDaily as [number, number]
      // Try /stats first
      try {
        const q = new URLSearchParams({ symbol, provider: "OANDA" })
        const res = await fetch(`/api/market/stats?${q}`, { cache: "no-store" })
        if (res.ok) {
          const j = await res.json()
          if (!isMounted) return
          setStats(j)
          // Prefer stats if it contains daily open/close
          if (j?.daily?.open != null) setDayClose(j.daily.open)
          if (j?.daily?.close != null) setDayOpen(j.daily.close)
          return
        }
      } catch {}
      // Fallback: /candles 1m, filter to prevDailyOpen..currentDailyOpen
      try {
        const q2 = new URLSearchParams({ symbol, provider: "OANDA", tf: "1m", limit: "3000" })
        const r2 = await fetch(`/api/market/candles?${q2}`, { cache: "no-store" })
        if (!r2.ok) return
        const candles = (await r2.json()) as Array<{ t: number; o: number; h: number; l: number; c: number }>
        if (!isMounted) return
        const dayCandles = candles.filter((x) => x.t >= prevDailyOpen && x.t < currentDailyOpen)
        if (dayCandles.length) {
          setDayClose(dayCandles[0].o)
          setDayOpen(dayCandles[dayCandles.length - 1].c)
        }
      } catch {}
    }
    run()
    return () => {
      isMounted = false
    }
  }, [symbol, overlays?.meta?.windows?.prevDaily])

  useEffect(() => {
    let alive = true
    ;(async () => {
      if (!symbol) return
      try {
        const res = await fetch(`/api/market/stats?${new URLSearchParams({ symbol, provider: "OANDA" })}`, {
          cache: "no-store",
        })
        if (res.ok) {
          const j = await res.json()
          if (!alive) return
          setStats((prev) => ({ ...(prev || {}), ...j }))
          return
        }
      } catch {}
      // Fallback: fetch 15m candles (limit 3000) and compute weekly Mon 5pm→this Mon 5pm NY
      try {
        const r = await fetch(
          `/api/market/candles?${new URLSearchParams({ symbol, provider: "OANDA", tf: "15m", limit: "3000" })}`,
          { cache: "no-store" },
        )
        if (!r.ok) return
        const arr = (await r.json()) as Array<{ t: number; o: number; h: number; l: number; c: number }>
        if (!alive) return
        // derive NY Monday-17:00 boundaries from timestamps (tiny helper; no refactor)
        const bounds = computeWeeklyBoundsMon5pmNY(arr.map((x) => x.t)) // implement tiny local helper below
        const seg = arr.filter((x) => x.t >= bounds.start && x.t < bounds.end)
        if (seg.length) {
          const hi = Math.max(...seg.map((x) => x.h))
          const lo = Math.min(...seg.map((x) => x.l))
          const op = seg[0].o
          const cl = seg[seg.length - 1].c
          setStats((prev) => ({ ...(prev || {}), weekly: { open: op, high: hi, low: lo, range: hi - lo, close: cl } }))
        }
      } catch {}
      // Fallback: 60m candles; compute prev calendar month using NY 5pm boundaries
      try {
        const r = await fetch(
          `/api/market/candles?${new URLSearchParams({ symbol, provider: "OANDA", tf: "60m", limit: "3000" })}`,
          { cache: "no-store" },
        )
        if (!r.ok) return
        const arr = (await r.json()) as Array<{ t: number; o: number; h: number; l: number; c: number }>
        if (!alive) return
        const mb = computePrevCalendarMonthNY5pm(arr.map((x) => x.t))
        const seg = arr.filter((x) => x.t >= mb.start && x.t < mb.end)
        if (seg.length) {
          const hi = Math.max(...seg.map((x) => x.h))
          const lo = Math.min(...seg.map((x) => x.l))
          const op = seg[0].o
          const cl = seg[seg.length - 1].c
          setStats((prev) => ({ ...(prev || {}), monthly: { open: op, high: hi, low: lo, range: hi - lo, close: cl } }))
        }
      } catch {}
    })()
    return () => {
      alive = false
    }
  }, [symbol])

  function computeWeeklyBoundsMon5pmNY(tsList: number[]) {
    // tiny helper: derive latest Monday 17:00 NY before "now"
    // Use the latest timestamp as "now"
    const nowSec = tsList.length ? tsList[tsList.length - 1] : Math.floor(Date.now() / 1000)
    // Get NY local date of "now" and walk back to Monday
    const d = new Date(nowSec * 1000)
    const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short" })
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const idx = days.indexOf(fmt.format(d))
    // distance to Monday (Mon=1). Convert to days back in NY sense.
    const back = (idx - 1 + 7) % 7
    // Take NY calendar day at noon to avoid DST jumps; then set 17:00
    const nyDate = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(d)
    // We don't need exact Y/M/D of now; we reconstruct by subtracting "back" days in UTC seconds and then map to 17:00 NY.
    const noonNow = new Date(d.toLocaleString("en-US", { timeZone: "America/New_York" }))
    noonNow.setHours(12, 0, 0, 0)
    const monNoon = new Date(noonNow.getTime() - back * 24 * 3600 * 1000)
    const start =
      Date.parse(monNoon.toLocaleString("en-US", { timeZone: "America/New_York" })) / 1000 + (17 - 12) * 3600
    const end = start + 7 * 24 * 3600
    return { start, end }
  }

  function computePrevCalendarMonthNY5pm(tsList: number[]) {
    // Take "now" from the latest candle; compute previous calendar month boundaries at NY 17:00.
    const now = new Date((tsList.at(-1) ?? Math.floor(Date.now() / 1000)) * 1000)
    const nyNow = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }))
    const y = nyNow.getFullYear(),
      m = nyNow.getMonth() // 0-based
    const prevStartLocal = new Date(y, m - 1, 1, 17, 0, 0) // prev month 1st 17:00 NY
    const prevEndLocal = new Date(y, m, 1, 17, 0, 0) // this month 1st 17:00 NY
    const start = Date.parse(prevStartLocal.toLocaleString("en-US", { timeZone: "America/New_York" })) / 1000
    const end = Date.parse(prevEndLocal.toLocaleString("en-US", { timeZone: "America/New_York" })) / 1000
    return { start, end }
  }

  useEffect(() => {
    const updateActiveSession = () => {
      setCurrentActiveSession(getCurrentSession())
    }

    updateActiveSession()
    const sessionInterval = setInterval(updateActiveSession, 60000)

    return () => clearInterval(sessionInterval)
  }, [])

  const lastPrice =
    (typeof window !== "undefined" && (window as any).__lastPrice) ?? // if you already track it
    last ??
    dayClose ??
    (overlays?.daily ? (overlays.daily.low + overlays.daily.high) / 2 : undefined)

  const brokenUp =
    session.name === "Daily" && dailyHi && last != null
      ? last > Number(dailyHi)
      : session.name === "Weekly" && stats?.weekly?.high && last != null
        ? last > stats.weekly.high
        : session.name === "Monthly" && stats?.monthly?.high && last != null
          ? last > stats.monthly.high
          : currentPrice > session.high
  const brokenDown =
    session.name === "Daily" && dailyLo && last != null
      ? last < Number(dailyLo)
      : session.name === "Weekly" && stats?.weekly?.low && last != null
        ? last < stats.weekly.low
        : session.name === "Monthly" && stats?.monthly?.low && last != null
          ? last < stats.monthly.low
          : currentPrice < session.low

  const sessionStatus = getSessionStatusTime(session.name, currentActiveSession)
  const isCurrentlyActive = sessionStatus.isActive
  const isIncoming = sessionStatus.status === "INCOMING SESSION"

  const Lsrc = sessionState(overlaysData, "london") === "INCOMING SESSION" ? (LP ?? L) : L
  const Nsrc = sessionState(overlaysData, "newyork") === "INCOMING SESSION" ? (NP ?? N) : N

  const getRangeValue = () => {
    if (session.name === "Daily")
      return (
        f5(D?.range) ??
        (D?.high != null && D?.low != null ? (D.high - D.low).toFixed(5) : session.range.toFixed(1) + " pips")
      )
    if (session.name === "Asia Session") {
      const asiaOHLC = sessionOHLC.asia
      return asiaOHLC?.rangePips ? `${asiaOHLC.rangePips} pips` : "—"
    }
    if (session.name === "London Session") {
      const londonOHLC = sessionOHLC.london
      return londonOHLC?.rangePips ? `${londonOHLC.rangePips} pips` : "—"
    }
    if (session.name === "New York Session") {
      const newyorkOHLC = sessionOHLC.newyork
      return newyorkOHLC?.rangePips ? `${newyorkOHLC.rangePips} pips` : "—"
    }
    if (session.name === "Weekly")
      return (W?.range ?? (W?.high != null && W?.low != null ? W.high - W.low : undefined))?.toFixed?.(5) ?? "—"
    if (session.name === "Monthly")
      return (M?.range ?? (M?.high != null && M?.low != null ? M.high - M.low : undefined))?.toFixed?.(5) ?? "—"
    return session.range.toFixed(1) + " pips"
  }

  const getOpenValue = () => {
    if (session.name === "Daily") return dayOpen?.toFixed(5) ?? "—"
    if (session.name === "Asia Session") {
      const asiaOHLC = sessionOHLC.asia
      return asiaOHLC?.open?.toFixed(5) ?? "—"
    }
    if (session.name === "London Session") {
      const londonOHLC = sessionOHLC.london
      return londonOHLC?.open?.toFixed(5) ?? "—"
    }
    if (session.name === "New York Session") {
      const newyorkOHLC = sessionOHLC.newyork
      return newyorkOHLC?.open?.toFixed(5) ?? "—"
    }
    if (session.name === "Weekly") return W?.open?.toFixed?.(5) ?? "—"
    if (session.name === "Monthly") return M?.open?.toFixed?.(5) ?? "—"
    return "—"
  }

  const getHighValue = () => {
    if (session.name === "Asia Session") {
      const asiaOHLC = sessionOHLC.asia
      return asiaOHLC?.high?.toFixed(5) ?? "—"
    }
    if (session.name === "London Session") {
      const londonOHLC = sessionOHLC.london
      return londonOHLC?.high?.toFixed(5) ?? "—"
    }
    if (session.name === "New York Session") {
      const newyorkOHLC = sessionOHLC.newyork
      return newyorkOHLC?.high?.toFixed(5) ?? "—"
    }
    return "—"
  }

  const getLowValue = () => {
    if (session.name === "Asia Session") {
      const asiaOHLC = sessionOHLC.asia
      return asiaOHLC?.low?.toFixed(5) ?? "—"
    }
    if (session.name === "London Session") {
      const londonOHLC = sessionOHLC.london
      return londonOHLC?.low?.toFixed(5) ?? "—"
    }
    if (session.name === "New York Session") {
      const newyorkOHLC = sessionOHLC.newyork
      return newyorkOHLC?.low?.toFixed(5) ?? "—"
    }
    return "—"
  }

  const getCloseValue = () => {
    if (session.name === "Asia Session") {
      const asiaOHLC = sessionOHLC.asia
      return asiaOHLC?.close?.toFixed(5) ?? "—"
    }
    if (session.name === "London Session") {
      const londonOHLC = sessionOHLC.london
      return londonOHLC?.close?.toFixed(5) ?? "—"
    }
    if (session.name === "New York Session") {
      const newyorkOHLC = sessionOHLC.newyork
      return newyorkOHLC?.close?.toFixed(5) ?? "—"
    }
    return "—"
  }

  const getCurrentWeekDates = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 (Sunday) to 6 (Saturday)
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // adjust when day is sunday
    const monday = new Date(today.setDate(diff))
    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(monday)
      currentDate.setDate(monday.getDate() + i)
      weekDates.push(currentDate)
    }
    return weekDates
  }

  const getRangeUnits = (high: number | undefined, low: number | undefined) => {
    if (!high || !low) return "—"
    return ((high - low) * 10000).toFixed(0) + " pips"
  }

  const formatPrice = (price: number | undefined) => {
    return price?.toFixed(5) ?? "—"
  }

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: `
          linear-gradient(135deg, 
            rgba(139, 92, 246, 0.03) 0%, 
            rgba(59, 130, 246, 0.02) 25%,
            rgba(16, 185, 129, 0.02) 50%,
            rgba(139, 92, 246, 0.03) 100%
          )
        `,
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(139, 92, 246, 0.1)",
        borderRadius: "24px",
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.12),
          inset 0 1px 0 rgba(255, 255, 255, 0.05),
          0 0 0 1px rgba(139, 92, 246, 0.05)
        `,
      }}
    >
      {session.name !== "Daily" && <FloatingCurrencyDots session={session.name || ""} />}

      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full z-0"
            style={{
              backgroundColor: (dayClose ?? session.close) > (dayOpen ?? session.open) ? "#22c55e" : "#ef4444",
              left: `${30 + i * 8}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.8, 1],
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative p-6 z-10">
        {session.name === "Daily" ? (
          <div className="relative flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {/* Premium emoji container with glass morphism */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                    {session.name === "Asia Session" && (
                      <motion.div
                        className="text-xl font-bold text-purple-300"
                        animate={{
                          rotate: [0, 90, 180, 270, 360],
                          scale: [1, 1.4, 1, 1.4, 1],
                          opacity: [0.8, 1, 0.8, 1, 0.8],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                          delay: 1,
                        }}
                      >
                        {Math.floor(Date.now() / 2000) % 3 === 0 && "¥"}
                        {Math.floor(Date.now() / 2000) % 3 === 1 && "₩"}
                        {Math.floor(Date.now() / 2000) % 3 === 2 && "₹"}
                      </motion.div>
                    )}
                    {session.name === "London Session" && (
                      <motion.div
                        className="text-xl font-bold text-blue-300"
                        animate={{
                          rotate: [0, 90, 180, 270, 360],
                          scale: [1, 1.4, 1, 1.4, 1],
                          opacity: [0.8, 1, 0.8, 1, 0.8],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                          delay: 1,
                        }}
                      >
                        {Math.floor(Date.now() / 2500) % 2 === 0 && "€"}
                        {Math.floor(Date.now() / 2500) % 2 === 1 && "£"}
                      </motion.div>
                    )}
                    {session.name === "New York Session" && (
                      <motion.div
                        className="text-xl font-bold text-emerald-300"
                        animate={{
                          rotate: [0, 90, 180, 270, 360],
                          scale: [1, 1.4, 1, 1.4, 1],
                          opacity: [0.8, 1, 0.8, 1, 0.8],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                          delay: 1,
                        }}
                      >
                        $
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
                      Daily Candle Analysis
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400 font-medium">
                      {historicalOHLC
                        ? selectedDate.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : new Date().toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                    <span className="text-xs text-slate-400">5:00 PM EST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main section - Candlestick centered with OHLC positioned around it */}
            <div className="relative flex items-center justify-center h-96 mt-8">
              {/* High - Positioned above the candlestick at top of wick */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-black/20 backdrop-blur-sm relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <TrendingUpIcon className="w-5 h-5 text-emerald-400 relative z-10" />
                  <span className="text-emerald-400 font-medium text-sm relative z-10">High</span>
                  <div className="text-white font-mono text-base ml-2 relative z-10">
                    {historicalOHLC ? historicalOHLC.high.toFixed(5) : getHighValue()}
                  </div>
                </div>
              </div>

              {/* Open - Positioned on the left side, closer to candlestick */}
              <div className="absolute left-8 top-28 z-10">
                <motion.div
                  className="bg-black/20 rounded-xl p-4 backdrop-blur-sm relative group overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <div className="flex items-center justify-center gap-2 mb-2 relative z-10">
                    <UnlockIcon className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-400 text-sm font-medium">Open</span>
                  </div>
                  <div className="text-white font-mono text-base font-bold text-center relative z-10">
                    {historicalOHLC ? historicalOHLC.open.toFixed(5) : getOpenValue()}
                  </div>
                </motion.div>
              </div>

              {/* Close - Positioned below Open on the left side, keeping same position */}
              <div className="absolute left-8 top-52 z-10">
                <motion.div
                  className="bg-black/20 rounded-xl p-4 backdrop-blur-sm relative group overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <div className="flex items-center justify-center gap-2 mb-2 relative z-10">
                    <LockIcon className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-400 text-sm font-medium">Close</span>
                  </div>
                  <div className="text-white font-mono text-base font-bold text-center relative z-10">
                    {historicalOHLC ? historicalOHLC.close.toFixed(5) : getCloseValue()}
                  </div>
                </motion.div>
              </div>

              <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10">
                <div className="flex flex-col items-center gap-2">
                  {historicalOHLC && (
                    <button
                      onClick={() => {
                        setHistoricalOHLC(null)
                        setSelectedDate(new Date())
                      }}
                      className="w-8 h-8 rounded-lg bg-green-500/20 backdrop-blur-sm border border-green-400/30 flex items-center justify-center hover:bg-green-500/30 transition-all duration-300 hover:scale-105 mb-1"
                    >
                      <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  )}

                  <div className="relative group mb-2">
                    <button className="w-8 h-8 rounded-lg bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 flex items-center justify-center hover:bg-purple-500/30 transition-all duration-300 hover:scale-105">
                      <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </button>

                    <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-purple-400/20 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                      <div className="p-2">
                        {Array.from({ length: 3 }, (_, i) => {
                          const date = new Date()
                          date.setDate(date.getDate() - i - 1)
                          const dayName = date.toLocaleDateString("en-US", { weekday: "long" })
                          const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

                          // Generate mock OHLC data
                          const basePrice = 1.23456 + (Math.random() - 0.5) * 0.001
                          const open = basePrice
                          const high = basePrice + Math.random() * 0.0005
                          const low = basePrice - Math.random() * 0.0005
                          const close = basePrice + (Math.random() - 0.5) * 0.0003

                          return (
                            <button
                              key={i}
                              onClick={() => {
                                setSelectedDate(date)
                                setHistoricalOHLC({
                                  open: open,
                                  high: high,
                                  low: low,
                                  close: close,
                                })
                              }}
                              className="w-full p-3 rounded-lg bg-slate-800/50 hover:bg-purple-500/20 transition-all duration-200 text-left group/item mb-1 last:mb-0"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center flex-shrink-0">
                                  <span className="text-purple-300 text-xs font-bold">{date.getDate()}</span>
                                </div>

                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-slate-200 text-sm font-medium">{dayName}</span>
                                    <span className="text-slate-400 text-xs">{dateStr}</span>
                                  </div>
                                  <div className="text-slate-400 text-xs">Daily Candle</div>
                                </div>

                                <div className="flex-shrink-0">
                                  <span className={`text-xs ${close > open ? "text-green-400" : "text-red-400"}`}>
                                    {close > open ? "↗" : "↘"}
                                  </span>
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="text-purple-400 text-sm font-medium text-center">Next Daily Open</div>
                  <div className="text-purple-300 font-mono text-lg font-bold">
                    {(() => {
                      const now = new Date()
                      const next5PM = new Date()
                      next5PM.setHours(17, 0, 0, 0)

                      // If it's past 5 PM today, set to tomorrow's 5 PM
                      if (now.getHours() >= 17) {
                        next5PM.setDate(next5PM.getDate() + 1)
                      }

                      const diff = next5PM.getTime() - now.getTime()
                      const hours = Math.floor(diff / (1000 * 60 * 60))
                      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

                      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
                    })()}
                  </div>
                </div>
              </div>

              {/* Low - Positioned below the candlestick at bottom of wick */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 z-10">
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-black/20 backdrop-blur-sm relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <TrendingDownIcon className="w-5 h-5 text-rose-400 relative z-10" />
                  <span className="text-rose-400 font-medium text-sm relative z-10">Low</span>
                  <div className="text-white font-mono text-base ml-2 relative z-10">
                    {historicalOHLC ? historicalOHLC.low.toFixed(5) : getLowValue()}
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-center flex-shrink-0 z-20" style={{ width: "140px" }}>
                <motion.div
                  className="absolute w-1.5 bg-gradient-to-b from-purple-300 via-purple-400 to-purple-300 rounded-full shadow-lg"
                  style={{
                    height: "280px",
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(168, 85, 247, 0.4)",
                      "0 0 30px rgba(168, 85, 247, 0.6)",
                      "0 0 20px rgba(168, 85, 247, 0.4)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                {/* Enhanced Candle Body */}
                <motion.div
                  className={`relative rounded-lg border-2 shadow-2xl backdrop-blur-sm ${
                    /* Use historical data for candle color if available */
                    historicalOHLC
                      ? historicalOHLC.close > historicalOHLC.open
                        ? "bg-gradient-to-b from-green-400 to-green-600 border-green-300"
                        : "bg-gradient-to-b from-red-400 to-red-600 border-red-300"
                      : (dayClose ?? session.close) > (dayOpen ?? session.open)
                        ? "bg-gradient-to-b from-green-400 to-green-600 border-green-300"
                        : "bg-gradient-to-b from-red-400 to-red-600 border-red-300"
                  }`}
                  style={{
                    width: "60px", // Wider candle body
                    height: "140px", // Taller candle body
                    zIndex: 2,
                  }}
                  initial={{ height: 0, opacity: 0, scale: 0.5 }}
                  animate={{ height: "140px", opacity: 1, scale: 1 }}
                  transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
                  whileHover={{
                    scale: 1.15,
                    transition: { duration: 0.3 },
                  }}
                >
                  {/* Open Price Marker */}
                  <motion.div
                    className="absolute -left-3 w-5 h-0.5 bg-blue-400 rounded-full shadow-lg"
                    style={{
                      top: historicalOHLC
                        ? historicalOHLC.close > historicalOHLC.open
                          ? "75%"
                          : "25%"
                        : (dayClose ?? session.close) > (dayOpen ?? session.open)
                          ? "75%"
                          : "25%",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: "20px" }}
                    transition={{ duration: 0.8, delay: 2.2 }}
                  />

                  {/* Close Price Marker */}
                  <motion.div
                    className="absolute -right-3 w-5 h-0.5 bg-yellow-400 rounded-full shadow-lg"
                    style={{
                      top: historicalOHLC
                        ? historicalOHLC.close > historicalOHLC.open
                          ? "75%"
                          : "25%"
                        : (dayClose ?? session.close) > (dayOpen ?? session.open)
                          ? "75%"
                          : "25%",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: "20px" }}
                    transition={{ duration: 0.8, delay: 2.4 }}
                  />
                </motion.div>

                {/* Enhanced Animated Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-full opacity-30"
                  style={{
                    background: `radial-gradient(circle, ${
                      historicalOHLC
                        ? historicalOHLC.close > historicalOHLC.open
                          ? "rgba(34, 197, 94, 0.3)"
                          : "rgba(239, 68, 68, 0.3)"
                        : (dayClose ?? session.close) > (dayOpen ?? session.open)
                          ? "rgba(34, 197, 94, 0.3)"
                          : "rgba(239, 68, 68, 0.3)"
                    } 0%, transparent 70%)`,
                    width: "140px",
                    height: "140px",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </div>

              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full z-0"
                  style={{
                    backgroundColor: historicalOHLC
                      ? historicalOHLC.close > historicalOHLC.open
                        ? "#22c55e"
                        : "#ef4444"
                      : (dayClose ?? session.close) > (dayOpen ?? session.open)
                        ? "#22c55e"
                        : "#ef4444",
                    left: `${30 + i * 8}%`,
                    top: `${20 + (i % 3) * 25}%`,
                  }}
                  animate={{
                    y: [-15, 15, -15],
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.8, 1],
                  }}
                  transition={{
                    duration: 3 + i * 0.3,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>

            <div className="flex-1 mt-6">
              <div className="bg-black/20 rounded-xl p-6 backdrop-blur-sm h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center">
                    <span className="text-2xl">🔮</span>
                  </div>
                  <h4 className="text-lg font-semibold text-amber-400">Future Prediction</h4>
                </div>

                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <p className="text-white text-sm leading-relaxed">
                      Based on current market structure and institutional flow patterns, the analysis suggests continued
                      consolidation with potential breakout scenarios.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/20 rounded-xl p-3 backdrop-blur-sm hover:bg-green-500/10 transition-colors">
                        <div className="text-green-400 text-xs font-medium mb-1">Bullish Scenario</div>
                        <div className="text-green-300 text-sm">65% Probability</div>
                      </div>
                      <div className="bg-black/10 rounded-xl p-3 backdrop-blur-sm hover:bg-red-500/10 transition-colors">
                        <div className="text-red-400 text-xs font-medium mb-1">Bearish Scenario</div>
                        <div className="text-red-300 text-sm">35% Probability</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 text-xs">Key Resistance</span>
                        <span className="text-amber-300 text-sm font-mono">1.2450</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 text-xs">Key Support</span>
                        <span className="text-amber-300 text-sm font-mono">1.2280</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 text-xs">Target Range</span>
                        <span className="text-amber-300 text-sm font-mono">170 pips</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-amber-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-xs">Confidence Level</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-amber-500/20 rounded-full overflow-hidden">
                          <div className="w-3/4 h-full bg-amber-400 rounded-full"></div>
                        </div>
                        <span className="text-amber-300 text-xs">75%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <FloatingCurrencyDots session={session.name || ""} />

            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Open box */}
              <motion.div
                className="bg-black/20 rounded-xl p-3 backdrop-blur-sm relative group overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="flex flex-col items-center justify-center h-full relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <UnlockIcon className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-400 text-sm font-medium">Open</span>
                  </div>
                  <div className="text-white font-mono text-sm font-bold text-center">{session.open?.toFixed(5)}</div>
                </div>
              </motion.div>

              {/* High box */}
              <motion.div
                className="bg-black/20 rounded-xl p-3 backdrop-blur-sm relative group overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="flex flex-col items-center justify-center h-full relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUpIcon className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400 text-sm font-medium">High</span>
                  </div>
                  <div className="text-white font-mono text-sm font-bold text-center">{session.high?.toFixed(5)}</div>
                </div>
              </motion.div>

              {/* Close box */}
              <motion.div
                className="bg-black/20 rounded-xl p-3 backdrop-blur-sm relative group overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="flex flex-col items-center justify-center h-full relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <LockIcon className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-400 text-sm font-medium">Close</span>
                  </div>
                  <div className="text-white font-mono text-sm font-bold text-center">{session.close?.toFixed(5)}</div>
                </div>
              </motion.div>

              {/* Low box */}
              <motion.div
                className="bg-black/20 rounded-xl p-3 backdrop-blur-sm relative group overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="flex flex-col items-center justify-center h-full relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDownIcon className="w-5 h-5 text-rose-400" />
                    <span className="text-rose-400 text-sm font-medium">Low</span>
                  </div>
                  <div className="text-white font-mono text-sm font-bold text-center">{session.low?.toFixed(5)}</div>
                </div>
              </motion.div>
            </div>

            {/* Enhanced SVG visibility and positioning */}
            <div className="mb-4 bg-black/20 rounded-xl p-4 backdrop-blur-sm border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-purple-300 text-sm font-medium">Live Price Movement</span>
                <span className="text-white text-sm font-mono bg-purple-500/20 px-2 py-1 rounded">
                  {currentPrice.toFixed(5)}
                </span>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-2 border border-purple-500/20">
                <SessionPriceChart session={session} width={280} height={80} />
              </div>
            </div>

            {/* Range and Volatility - Updated layout to fill empty space properly */}
            <div className="flex gap-2 w-full">
              {/* Range box - takes half the width */}
              <motion.div className="flex-1 bg-black/20 rounded-xl p-2 backdrop-blur-sm" whileHover={{ scale: 1.02 }}>
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-indigo-400 text-xs font-medium mb-1">Range</span>
                  <span className="text-white font-mono text-xs font-bold text-center">{getRangeValue()}</span>
                </div>
              </motion.div>

              {/* Volatility box - takes half the width */}
              <motion.div className="flex-1 bg-black/20 rounded-xl p-2 backdrop-blur-sm" whileHover={{ scale: 1.02 }}>
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-orange-400 text-xs font-medium mb-1">Volatility</span>
                  <span className="text-white font-mono text-xs font-bold text-center">
                    {session.name === "Asia Session" ? "Low" : session.name === "London Session" ? "High" : "Medium"}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function SessionOverview({ analysis }: { analysis: SessionAnalysis }) {
  const sessions = [analysis.asiaSession, analysis.previousDaily, analysis.previousWeekly]

  const getMarketBias = () => {
    let bullishCount = 0
    let bearishCount = 0

    sessions.forEach((session) => {
      if (analysis.currentPrice > session.high) bullishCount++
      if (analysis.currentPrice < session.low) bearishCount++
    })

    if (bullishCount > bearishCount) return { bias: "BULLISH", color: "text-green-400", confidence: bullishCount * 33 }
    if (bearishCount > bearishCount) return { bias: "BEARISH", color: "text-red-400", confidence: bearishCount * 33 }
    return { bias: "NEUTRAL", color: "text-yellow-400", confidence: 50 }
  }

  const marketBias = getMarketBias()

  return (
    <motion.div className="bg-black/20 rounded-xl p-6 backdrop-blur-sm hover:scale-[1.01] transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center border border-purple-500/40">
          <Activity className="w-6 h-6 text-purple-300" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Session Analysis Overview</h3>
          <p className="purple-300/80 text-sm">Multi-Session Price Action Analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <motion.div
            className="flex items-center justify-between hover:bg-white/5 p-2 rounded-lg transition-colors"
            whileHover={{ x: 5 }}
          >
            <span className="text-purple-300">Current Price</span>
            <span className="text-white font-mono text-lg">{analysis.currentPrice.toFixed(5)}</span>
          </motion.div>

          <motion.div
            className="flex items-center justify-between hover:bg-white/5 p-2 rounded-lg transition-colors"
            whileHover={{ x: 5 }}
          >
            <span className="text-purple-300">Market Bias</span>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${marketBias.color}`}>{marketBias.bias}</span>
              <div className="w-16 h-2 bg-purple-900/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${marketBias.confidence}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-4">
          <motion.div
            className="flex items-center justify-between hover:bg-white/5 p-2 rounded-lg transition-colors"
            whileHover={{ x: 5 }}
          >
            <span className="text-purple-300">Active Sessions</span>
            <span className="text-white font-bold">
              {sessions.filter((s) => s.isActive).length}/{sessions.length}
            </span>
          </motion.div>

          <motion.div
            className="flex items-center justify-between hover:bg-white/5 p-2 rounded-lg transition-colors"
            whileHover={{ x: 5 }}
          >
            <span className="text-purple-300">Key Levels</span>
            <span className="text-white font-bold">{sessions.length * 2} Levels</span>
          </motion.div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-purple-500/20">
        <div className="flex items-center justify-center">
          <motion.div
            className={`px-4 py-2 rounded-xl font-semibold text-sm border ${
              marketBias.confidence > 66
                ? `${marketBias.color.replace("text-", "bg-").replace("-400", "-500/20")} ${marketBias.color.replace("text-", "border-").replace("-400", "-500/30")}`
                : "bg-purple-500/20 text-purple-400 border-purple-500/30"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {marketBias.confidence > 66 ? `HIGH CONFIDENCE ${marketBias.bias}` : `MIXED SIGNALS - ${marketBias.bias}`}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export function SessionAnalysisDisplay({ analysis, isLoading }: SessionAnalysisDisplayProps) {
  const { overlays = {}, snapshot, sessionBars, multiTimeframeBars, sessionOHLC } = useAnalysis()
  const A = valuesFor(overlays, "asia")
  const L = valuesFor(overlays, "london")
  const N = valuesFor(overlays, "newyork")
  const D = valuesFor(overlays, "daily")
  const W = valuesFor(overlays, "weekly")
  const M = valuesFor(overlays, "monthly")
  const AP = valPrev(overlays, "asia")
  const LP = valPrev(overlays, "london")
  const NP = valPrev(overlays, "newyork")

  const [currentActiveSession, setCurrentActiveSession] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  const getRangeValue = (session: any) => {
    if (session.name === "Daily")
      return (
        f5(D?.range) ??
        (D?.high != null && D?.low != null ? (D.high - D.low).toFixed(5) : session.range.toFixed(1) + " pips")
      )
    if (session.name === "Asia Session") {
      const asiaOHLC = sessionOHLC?.asia
      return asiaOHLC?.rangePips ? `${asiaOHLC.rangePips} pips` : "—"
    }
    if (session.name === "London Session") {
      const londonOHLC = sessionOHLC?.london
      return londonOHLC?.rangePips ? `${londonOHLC.rangePips} pips` : "—"
    }
    if (session.name === "New York Session") {
      const newyorkOHLC = sessionOHLC?.newyork
      return newyorkOHLC?.rangePips ? `${newyorkOHLC.rangePips} pips` : "—"
    }
    if (session.name === "Weekly")
      return (W?.range ?? (W?.high != null && W?.low != null ? W.high - W.low : undefined))?.toFixed?.(5) ?? "—"
    if (session.name === "Monthly")
      return (M?.range ?? (M?.high != null && M?.low != null ? M.high - M.low : undefined))?.toFixed?.(5) ?? "—"
    return session.range.toFixed(1) + " pips"
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [])

  const formatCurrentDate = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const dayName = days[currentTime.getDay()]
    const monthName = months[currentTime.getMonth()]
    const date = currentTime.getDate()

    return `${dayName}, ${monthName} ${date}`
  }

  useEffect(() => {
    const updateActiveSession = () => {
      setCurrentActiveSession(getCurrentSession())
    }

    updateActiveSession()
    const sessionInterval = setInterval(updateActiveSession, 60000) // Check every minute

    return () => clearInterval(sessionInterval)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="premium-glass-panel p-6 animate-pulse">
              <div className="h-4 bg-purple-500/20 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-12 bg-purple-500/10 rounded"></div>
                <div className="h-12 bg-purple-500/10 rounded"></div>
                <div className="h-32 bg-purple-500/10 rounded"></div>
                <div className="h-8 bg-purple-500/10 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[4, 5, 6].map((i) => (
            <div key={i} className="premium-glass-panel p-6 animate-pulse">
              <div className="h-4 bg-purple-500/20 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-12 bg-purple-500/10 rounded"></div>
                <div className="h-12 bg-purple-500/10 rounded"></div>
                <div className="h-32 bg-purple-500/10 rounded"></div>
                <div className="h-8 bg-purple-500/10 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="text-center py-12">
        <p className="text-purple-300">No session analysis data available</p>
      </div>
    )
  }

  const dailyData = {
    open: snapshot?.day?.o || D?.open || 1.23,
    high: snapshot?.day?.h || D?.high || 1.24,
    low: snapshot?.day?.l || D?.low || 1.225,
    close: snapshot?.day?.c || D?.close || 1.235,
    last: snapshot?.last || 1.235,
  }

  const sessions = [
    {
      name: "Asia Session",
      time: "5:00 PM - 2:00 AM",
      icon: "🌏",
      startHour: 17, // 5 PM
      endHour: 2, // 2 AM next day
      color: "from-purple-500 to-indigo-600",
    },
    {
      name: "London Session",
      time: "2:00 AM - 11:00 AM",
      icon: "🇬🇧",
      startHour: 2, // 2 AM
      endHour: 11, // 11 AM
      color: "from-blue-500 to-cyan-600",
    },
    {
      name: "New York Session",
      time: "8:00 AM - 5:00 PM",
      icon: "🇺🇸",
      startHour: 8, // 8 AM
      endHour: 17, // 5 PM
      color: "from-emerald-500 to-teal-600",
    },
  ]

  const tradingSessions: SessionData[] = [
    {
      name: "Asia Session",
      time: "5:00 PM - 2:00 AM",
      high: overlays?.sessions?.asia?.h || A?.high || 1.2345,
      low: overlays?.sessions?.asia?.l || A?.low || 1.23,
      range: overlays?.sessions?.asia ? overlays.sessions.asia.h - overlays.sessions.asia.l : A?.range || 0.0045,
      open: overlays?.sessions?.asia?.o || A?.open || 1.232,
      close: overlays?.sessions?.asia?.c || A?.close || 1.234,
      color: "rgba(147, 51, 234, 0.2)",
      borderColor: "rgba(147, 51, 234, 0.6)",
    },
    {
      name: "London Session",
      time: "2:00 AM - 11:00 AM",
      high: overlays?.sessions?.london?.h || L?.high || 1.238,
      low: overlays?.sessions?.london?.l || L?.low || 1.232,
      range: overlays?.sessions?.london ? overlays.sessions.london.h - overlays.sessions.london.l : L?.range || 0.006,
      open: overlays?.sessions?.london?.o || L?.open || 1.234,
      close: overlays?.sessions?.london?.c || L?.close || 1.2365,
      color: "rgba(59, 130, 246, 0.2)",
      borderColor: "rgba(59, 130, 246, 0.6)",
    },
    {
      name: "New York Session",
      time: "8:00 AM - 5:00 PM",
      high: overlays?.sessions?.newyork?.h || N?.high || 1.24,
      low: overlays?.sessions?.newyork?.l || N?.low || 1.234,
      range: overlays?.sessions?.newyork
        ? overlays.sessions.newyork.h - overlays.sessions.newyork.l
        : N?.range || 0.006,
      open: overlays?.sessions?.newyork?.o || N?.open || 1.2365,
      close: overlays?.sessions?.newyork?.c || N?.close || 1.2385,
      color: "rgba(34, 197, 94, 0.2)",
      borderColor: "rgba(34, 197, 94, 0.6)",
    },
  ]

  const timeframeSessions = [
    {
      name: "Daily",
      open: dailyData.open,
      high: dailyData.high,
      low: dailyData.low,
      close: dailyData.close,
      last: dailyData.last,
    },
    {
      name: "Weekly",
      open: W?.open || 1.225,
      high: W?.high || 1.245,
      low: W?.low || 1.22,
      close: W?.close || 1.235,
      last: dailyData.last,
    },
    // Monthly removed - Weekly will span its space
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Daily Card - Takes 2 columns (40% width) */}
        <div className="md:col-span-2 h-full">
          <div className="ml-4">
            <SessionCard
              key="Daily"
              session={timeframeSessions.find((s) => s.name === "Daily") || { name: "Daily" }}
              index={0}
              currentPrice={dailyData.last}
            />
          </div>
        </div>

        {/* Session Cards - Takes 3 columns (60% width) */}
        {/* Reduced spacing between session cards by 40% */}
        <div className="md:col-span-3 flex flex-col gap-2 h-full">
          {tradingSessions.map((session, index) => (
            <div
              key={session.name}
              className="relative overflow-hidden rounded-2xl flex-1 border mb-4"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(139, 92, 246, 0.03) 0%, 
                    rgba(59, 130, 246, 0.02) 25%,
                    rgba(16, 185, 129, 0.02) 50%,
                    rgba(139, 92, 246, 0.03) 100%
                  )
                `,
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(139, 92, 246, 0.1)",
                borderRadius: "24px",
                boxShadow: `
                  0 8px 32px rgba(0, 0, 0, 0.12),
                  inset 0 1px 0 rgba(255, 255, 255, 0.05),
                  0 0 0 1px rgba(139, 92, 246, 0.05)
                `,
              }}
            >
              {[...Array(8)].map((_, i) => {
                const getCurrencySymbols = () => {
                  if (session.name === "Asia Session") return ["¥", "₩", "₹", "¥", "₩", "₹", "¥", "₩"]
                  if (session.name === "London Session") return ["€", "£", "€", "£", "€", "£", "€", "£"]
                  return ["$", "$", "$", "$", "$", "$", "$", "$"]
                }

                const getColor = () => {
                  if (session.name === "Asia Session") return "#a855f7"
                  if (session.name === "London Session") return "#3b82f6"
                  return "#10b981"
                }

                return (
                  <motion.div
                    key={i}
                    className="absolute text-sm font-bold z-0"
                    style={{
                      color: getColor(),
                      left: `${15 + i * 10}%`,
                      top: `${10 + (i % 4) * 20}%`,
                      textShadow: `0 0 8px ${getColor()}40`,
                    }}
                    animate={{
                      y: [-15, 15, -15],
                      opacity: [0.1, 0.3, 0.1],
                      scale: [1, 1.8, 1],
                    }}
                    transition={{
                      duration: 3 + i * 0.3,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.3,
                    }}
                  >
                    {getCurrencySymbols()[i]}
                  </motion.div>
                )
              })}

              {/* Redesigned session headers with premium quality, dynamic status, dates, and session-specific icons */}
              <div className="flex items-center justify-between h-full p-4 relative z-10">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      {/* Session Icon */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-lg">
                          {session.name === "Asia Session" && (
                            <motion.div
                              className="text-xl font-bold text-purple-300"
                              animate={{
                                rotate: [0, 90, 180, 270, 360],
                                scale: [1, 1.4, 1, 1.4, 1],
                                opacity: [0.8, 1, 0.8, 1, 0.8],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                                delay: 1,
                              }}
                            >
                              {Math.floor(Date.now() / 2000) % 3 === 0 && "¥"}
                              {Math.floor(Date.now() / 2000) % 3 === 1 && "₩"}
                              {Math.floor(Date.now() / 2000) % 3 === 2 && "₹"}
                            </motion.div>
                          )}
                          {session.name === "London Session" && (
                            <motion.div
                              className="text-xl font-bold text-blue-300"
                              animate={{
                                rotate: [0, 90, 180, 270, 360],
                                scale: [1, 1.4, 1, 1.4, 1],
                                opacity: [0.8, 1, 0.8, 1, 0.8],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                                delay: 1,
                              }}
                            >
                              {Math.floor(Date.now() / 2500) % 2 === 0 && "€"}
                              {Math.floor(Date.now() / 2500) % 2 === 1 && "£"}
                            </motion.div>
                          )}
                          {session.name === "New York Session" && (
                            <motion.div
                              className="text-xl font-bold text-emerald-300"
                              animate={{
                                rotate: [0, 90, 180, 270, 360],
                                scale: [1, 1.4, 1, 1.4, 1],
                                opacity: [0.8, 1, 0.8, 1, 0.8],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                                delay: 1,
                              }}
                            >
                              $
                            </motion.div>
                          )}
                        </div>
                        {/* Status indicator ring */}

                        <div className="absolute -top-8 -right-1 flex justify-center"></div>
                      </div>

                      {/* Session Info */}
                      <div className="flex flex-col">
                        <h3 className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
                          {session.name === "Asia Session" && "Asian Banking Hours"}
                          {session.name === "London Session" && "European Banking Hours"}
                          {session.name === "New York Session" && "USA Banking Hours"}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-medium">
                            {new Date().toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                          <p className="text-xs text-slate-400">
                            {session.name === "Asia Session" && "5:00 PM - 2:00 AM"}
                            {session.name === "London Session" && "2:00 AM - 11:00 AM"}
                            {session.name === "New York Session" && "8:00 AM - 5:00 PM"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Open box */}
                    <motion.div
                      className="bg-black/20 rounded-xl p-2 backdrop-blur-sm relative group overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <div className="flex flex-col items-center justify-center h-full relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                          <UnlockIcon className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400 text-xs font-medium">Open</span>
                        </div>
                        <div className="text-white font-mono text-sm font-bold text-center">
                          {session.open?.toFixed(5)}
                        </div>
                      </div>
                    </motion.div>

                    {/* High box */}
                    <motion.div
                      className="bg-black/20 rounded-xl p-2 backdrop-blur-sm relative group overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <div className="flex flex-col items-center justify-center h-full relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUpIcon className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400 text-xs font-medium">High</span>
                        </div>
                        <div className="text-white font-mono text-sm font-bold text-center">
                          {session.high?.toFixed(5)}
                        </div>
                      </div>
                    </motion.div>

                    {/* Close box */}
                    <motion.div
                      className="bg-black/20 rounded-xl p-2 backdrop-blur-sm relative group overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <div className="flex flex-col items-center justify-center h-full relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                          <LockIcon className="w-4 h-4 text-amber-400" />
                          <span className="text-amber-400 text-xs font-medium">Close</span>
                        </div>
                        <div className="text-white font-mono text-sm font-bold text-center">
                          {session.close?.toFixed(5)}
                        </div>
                      </div>
                    </motion.div>

                    {/* Low box */}
                    <motion.div
                      className="bg-black/20 rounded-xl p-2 backdrop-blur-sm relative group overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <div className="flex flex-col items-center justify-center h-full relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingDownIcon className="w-4 h-4 text-rose-400" />
                          <span className="text-rose-400 text-xs font-medium">Low</span>
                        </div>
                        <div className="text-white font-mono text-sm font-bold text-center">
                          {session.low?.toFixed(5)}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Range box */}
                    <motion.div className="bg-black/20 rounded-xl p-2 backdrop-blur-sm" whileHover={{ scale: 1.02 }}>
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className="text-indigo-400 text-xs font-medium mb-1">Range</span>
                        <span className="text-white font-mono text-xs font-bold text-center">
                          {getRangeValue(session)}
                        </span>
                      </div>
                    </motion.div>

                    {/* Volatility box */}
                    <motion.div className="bg-black/20 rounded-xl p-2 backdrop-blur-sm" whileHover={{ scale: 1.02 }}>
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className="text-orange-400 text-xs font-medium mb-1">Volatility</span>
                        <span className="text-white font-mono text-xs font-bold text-center">
                          {session.name === "Asia Session"
                            ? "Low"
                            : session.name === "London Session"
                              ? "High"
                              : "Medium"}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div className="w-1/2 h-full ml-4 flex flex-col">
                  <div className="flex-1 relative">
                    <SessionMiniChart
                      session={{
                        name:
                          session.name === "Asia Session"
                            ? "Asia"
                            : session.name === "London Session"
                              ? "London"
                              : "New York",
                      }}
                      currentPrice={analysis.currentPrice}
                    />
                  </div>

                  <div className="mt-1">
                    {(() => {
                      const sessionKey =
                        session.name === "Asia Session"
                          ? "asia"
                          : session.name === "London Session"
                            ? "london"
                            : "newyork"
                      const sessionData = sessionOHLC[sessionKey]

                      if (sessionData) {
                        const startTime = new Date(sessionData.start * 1000).toLocaleTimeString("en-US", {
                          timeZone: "America/New_York",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                        const endTime = new Date(sessionData.end * 1000).toLocaleTimeString("en-US", {
                          timeZone: "America/New_York",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })

                        return (
                          <div className="text-center">
                            <div className="text-xs text-gray-400 mb-1">
                              {startTime} - {endTime} NY
                            </div>
                            <div
                              className={`text-xs px-2 py-1 rounded-full ${
                                sessionData.status === "LIVE"
                                  ? "bg-green-500/20 text-green-400"
                                  : sessionData.status === "COMPLETED"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-orange-500/20 text-orange-400"
                              }`}
                            >
                              {sessionData.status}
                            </div>
                          </div>
                        )
                      }

                      return null
                    })()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Analysis Section */}
      <div className="mt-8">
        <WeeklyMegaCard />
      </div>
    </div>
  )
}

function getSessionStatusTime(sessionName: string) {
  const now = new Date()
  const hour = now.getHours()

  const sessionTimes = {
    "Asia Session": { start: 17, end: 24 }, // 5pm - 12am
    "London Session": { start: 2, end: 8 }, // 2am - 8am
    "New York Session": { start: 8, end: 17 }, // 8am - 5pm
  }

  const session = sessionTimes[sessionName as keyof typeof sessionTimes]
  if (!session) return { status: "UNKNOWN", timeLeft: 0, timeToNext: 0 }

  const isLive =
    (hour >= session.start && hour < session.end) ||
    (session.start > session.end && (hour >= session.start || hour < session.end))

  if (isLive) {
    const endHour = session.end === 24 ? 0 : session.end
    const timeLeft = endHour > hour ? (endHour - hour) * 60 : (24 - hour + endHour) * 60
    return { status: "LIVE", timeLeft, timeToNext: 0 }
  }

  const isUpcoming = hour < session.start
  if (isUpcoming) {
    const timeToNext = (session.start - hour) * 60
    return { status: "UPCOMING", timeLeft: 0, timeToNext }
  }

  return { status: "COMPLETED", timeLeft: 0, timeToNext: 0 }
}

function generateRealtimeCandlestickData(lastClose = 1.234) {
  const data = []
  const now = Date.now()
  let currentPrice = lastClose

  for (let i = 0; i < 30; i++) {
    const time = new Date(now - (29 - i) * 60000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })

    // Generate realistic OHLC values
    const open = currentPrice
    const volatility = Math.random() * 0.0008 + 0.0002 // 0.02% to 0.1% volatility
    const direction = Math.random() > 0.5 ? 1 : -1
    const momentum = direction * volatility * (0.5 + Math.random() * 0.5)

    // Calculate high and low with realistic spreads
    const spread = volatility * (0.3 + Math.random() * 0.7)
    const high = open + Math.abs(momentum) + spread
    const low = open - Math.abs(momentum) - spread

    // Close price with trend continuation probability
    const trendContinuation = Math.random() > 0.4 // 60% chance to continue trend
    let close = open + (trendContinuation ? momentum : -momentum * 0.5)

    // Ensure close is within high/low bounds
    close = Math.max(low, Math.min(high, close))

    // Keep prices within reasonable bounds
    const minBound = 1.2
    const maxBound = 1.28

    currentPrice = Math.max(minBound, Math.min(maxBound, close))

    data.push({
      time,
      open: Number(open.toFixed(5)),
      high: Number(Math.max(open, high, close).toFixed(5)),
      low: Number(Math.min(open, low, close).toFixed(5)),
      close: Number(close.toFixed(5)),
      timestamp: now - (29 - i) * 60000,
    })
  }

  return data
}

function generateCandlestickData() {
  return generateRealtimeCandlestickData()
}

export default SessionAnalysisDisplay
