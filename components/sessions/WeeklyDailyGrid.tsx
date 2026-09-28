"use client"

import { useState, useEffect } from "react"
import { useInstrument } from "@/lib/stores/useInstrument"
import { useAnalysis } from "@/lib/stores/useAnalysis"

type DaySlice = {
  start: number
  end: number
  label: string
  name: "Mon" | "Tue" | "Wed" | "Thu" | "Fri"
  date: string
}

type DayData = {
  open: number
  high: number
  low: number
  close: number
  range: number
}

type Props = {
  symbol?: string
  provider?: string
  now?: number
}

// Helper to get NY 5pm boundaries for a day
function getNYDayBoundaries(dayOffset: number, refNow: number): { start: number; end: number } {
  const nyDate = new Date(refNow * 1000)

  // Get the target day
  const targetDate = new Date(nyDate)
  targetDate.setDate(targetDate.getDate() + dayOffset)

  // Set to 5 PM NY time (17:00)
  const start = new Date(targetDate)
  start.setHours(17, 0, 0, 0)

  const end = new Date(start)
  end.setDate(end.getDate() + 1)

  return {
    start: Math.floor(start.getTime() / 1000),
    end: Math.floor(end.getTime() / 1000),
  }
}

// Helper to format range in pips/ticks
function rangeToDisplay(range: number, symbol: string): string {
  const sym = symbol.toUpperCase()

  if (sym.includes("JPY")) {
    const pips = range / 0.01
    return `${pips.toFixed(1)} pips`
  } else if (sym.includes("XAU") || sym.includes("XPT") || sym.includes("XPD")) {
    const pips = range / 0.01
    return `${pips.toFixed(1)} pips`
  } else if (sym.includes("XAG")) {
    const pips = range / 0.001
    return `${pips.toFixed(1)} pips`
  } else if (sym.includes("US30") || sym.includes("US500") || sym.includes("NAS100") || sym.includes("GER")) {
    return `${range.toFixed(0)} ticks`
  } else {
    // Standard FX pairs
    const pips = range / 0.0001
    return `${pips.toFixed(1)} pips`
  }
}

export default function WeeklyDailyGrid({ symbol, provider, now }: Props) {
  const { instrument } = useInstrument()
  const sym = symbol ?? instrument?.symbol ?? "EURUSD"
  const prov = provider ?? instrument?.provider ?? "OANDA"
  const { overlays } = useAnalysis()
  const refNow = now ?? overlays?.meta?.now ?? Math.floor(Date.now() / 1000)

  const [currentWeekData, setCurrentWeekData] = useState<Record<string, DayData>>({})
  const [previousWeekData, setPreviousWeekData] = useState<Record<string, DayData>>({})
  const [hoveredDay, setHoveredDay] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Build week arrays
  const buildWeekDays = (weekOffset: number): DaySlice[] => {
    const days: DaySlice[] = []
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const

    for (let i = 0; i < 5; i++) {
      const dayOffset = weekOffset * 7 + i - 4 // Adjust for Monday start
      const boundaries = getNYDayBoundaries(dayOffset, refNow)
      const date = new Date(boundaries.start * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "America/New_York",
      })

      days.push({
        start: boundaries.start,
        end: boundaries.end,
        label: date,
        name: dayNames[i],
        date: new Date(boundaries.start * 1000).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          timeZone: "America/New_York",
        }),
      })
    }

    return days
  }

  const currentWeek = buildWeekDays(0)
  const previousWeek = buildWeekDays(-1)

  // Fetch candle data for a day
  const fetchDayData = async (day: DaySlice): Promise<DayData | null> => {
    try {
      const response = await fetch(
        `/api/market/candles?symbol=${sym}&provider=${prov}&resolution=1m&from=${day.start}&to=${day.end}&limit=1440`,
      )

      if (!response.ok) return null

      const data = await response.json()
      if (!data.candles || data.candles.length === 0) return null

      const candles = data.candles
      const open = candles[0].o
      const close = candles[candles.length - 1].c
      const high = Math.max(...candles.map((c: any) => c.h))
      const low = Math.min(...candles.map((c: any) => c.l))
      const range = high - low

      return { open, high, low, close, range }
    } catch (error) {
      console.error("Error fetching day data:", error)
      return null
    }
  }

  // Load data for all days
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true)

      // Fetch current week data
      const currentPromises = currentWeek.map(async (day) => {
        const data = await fetchDayData(day)
        return [day.name, data] as const
      })

      // Fetch previous week data
      const previousPromises = previousWeek.map(async (day) => {
        const data = await fetchDayData(day)
        return [day.name, data] as const
      })

      const [currentResults, previousResults] = await Promise.all([
        Promise.all(currentPromises),
        Promise.all(previousPromises),
      ])

      const currentData: Record<string, DayData> = {}
      const previousData: Record<string, DayData> = {}

      currentResults.forEach(([name, data]) => {
        if (data) currentData[name] = data
      })

      previousResults.forEach(([name, data]) => {
        if (data) previousData[name] = data
      })

      setCurrentWeekData(currentData)
      setPreviousWeekData(previousData)
      setLoading(false)
    }

    loadAllData()
  }, [sym, prov, refNow])

  // Calculate week highs/lows
  const currentWeekHigh = Math.max(...Object.values(currentWeekData).map((d) => d.high))
  const currentWeekLow = Math.min(...Object.values(currentWeekData).map((d) => d.low))
  const previousWeekHigh = Math.max(...Object.values(previousWeekData).map((d) => d.high))
  const previousWeekLow = Math.min(...Object.values(previousWeekData).map((d) => d.low))

  const DayBox = ({ day, data, isPrevious }: { day: DaySlice; data?: DayData; isPrevious: boolean }) => (
    <div
      className={`relative h-16 bg-black/30 rounded-lg border border-white/10 p-2 cursor-pointer transition-all duration-200 hover:bg-black/50 hover:border-purple-400/50 hover:scale-105 ${isPrevious ? "opacity-80" : ""}`}
      onMouseEnter={() => setHoveredDay(`${isPrevious ? "prev" : "curr"}-${day.name}`)}
      onMouseLeave={() => setHoveredDay(null)}
    >
      <div className="text-xs text-white/70 font-medium">{day.name}</div>
      <div className="text-xs text-white/50">{day.label}</div>

      {data && (
        <div className="absolute inset-x-2 bottom-1 h-1 bg-gradient-to-r from-purple-500/30 to-purple-400/30 rounded-full">
          <div
            className="h-full bg-purple-400 rounded-full transition-all duration-300"
            style={{ width: `${Math.random() * 60 + 40}%` }}
          />
        </div>
      )}

      {/* Hover popover */}
      {hoveredDay === `${isPrevious ? "prev" : "curr"}-${day.name}` && data && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl min-w-48">
          <div className="text-sm font-medium text-white mb-2">
            {day.name} • {day.date.split(",")[1]} (NY)
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-green-400">High:</span>
              <span className="text-white font-mono">{data.high.toFixed(5)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-400">Low:</span>
              <span className="text-white font-mono">{data.low.toFixed(5)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-400">Range:</span>
              <span className="text-white">{rangeToDisplay(data.range, sym)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-400">Open:</span>
              <span className="text-white font-mono">{data.open.toFixed(5)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-yellow-400">Close:</span>
              <span className="text-white font-mono">{data.close.toFixed(5)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white/50 text-sm">Loading week data...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col gap-3 p-4">
      {/* Week summary chips */}
      <div className="flex gap-2 mb-2">
        <div className="px-3 py-1 bg-black/40 rounded-full border border-white/10 text-xs">
          <span className="text-white/70">Current Week:</span>
          <span className="text-green-400 ml-1">{currentWeekHigh.toFixed(5)}</span>
          <span className="text-white/50 mx-1">/</span>
          <span className="text-red-400">{currentWeekLow.toFixed(5)}</span>
        </div>
        <div className="px-3 py-1 bg-black/40 rounded-full border border-white/10 text-xs opacity-80">
          <span className="text-white/70">Previous Week:</span>
          <span className="text-green-400 ml-1">{previousWeekHigh.toFixed(5)}</span>
          <span className="text-white/50 mx-1">/</span>
          <span className="text-red-400">{previousWeekLow.toFixed(5)}</span>
        </div>
      </div>

      {/* Current week row */}
      <div className="grid grid-cols-5 gap-3">
        {currentWeek.map((day) => (
          <DayBox key={`current-${day.name}`} day={day} data={currentWeekData[day.name]} isPrevious={false} />
        ))}
      </div>

      {/* Previous week row */}
      <div className="grid grid-cols-5 gap-3">
        {previousWeek.map((day) => (
          <DayBox key={`previous-${day.name}`} day={day} data={previousWeekData[day.name]} isPrevious={true} />
        ))}
      </div>
    </div>
  )
}

export { WeeklyDailyGrid }
