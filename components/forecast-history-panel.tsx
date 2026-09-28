"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  TrendingUp,
  Globe,
  Coins,
  BarChart3,
  Filter,
  ThumbsUp,
  Target,
  Brain,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

type FilterType = "all" | "forex" | "crypto" | "indices" | "commodities"

interface ForecastEntry {
  id: string
  student: string
  avatar: string
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  instrument: string
  category: FilterType
  direction: "LONG" | "SHORT"
  accuracy: number
  winRate: number
  timestamp: Date
  chartImage: string
  analysis: string
  confluences: string[]
  likes: number
  comments: number
  views: number
  entry: string
  target: string
  stop: string
  rr: string
}

// Mock data for different weeks and categories
const generateMockForecasts = (week: number, category: FilterType = "all"): ForecastEntry[] => {
  const baseForecasts: Omit<ForecastEntry, "id" | "timestamp">[] = [
    {
      student: "Alexandra Chen",
      avatar: "/diverse-student-studying.png",
      level: "Expert",
      instrument: "EURUSD",
      category: "forex",
      direction: "LONG",
      accuracy: 94,
      winRate: 87,
      chartImage: "/placeholder-6qcsy.png",
      analysis: "Strong bullish momentum with institutional support at key levels",
      confluences: ["BPR Rejection", "DXY Weakness", "Institutional Flow"],
      likes: 24,
      comments: 8,
      views: 156,
      entry: "1.0850",
      target: "1.0920",
      stop: "1.0800",
      rr: "1:1.4",
    },
    {
      student: "Marcus Rodriguez",
      avatar: "/diverse-student-studying.png",
      level: "Advanced",
      instrument: "BTCUSD",
      category: "crypto",
      direction: "SHORT",
      accuracy: 89,
      winRate: 82,
      chartImage: "/placeholder-j3got.png",
      analysis: "Bearish divergence with volume confirmation at resistance",
      confluences: ["RSI Divergence", "Volume Profile", "Resistance Zone"],
      likes: 18,
      comments: 12,
      views: 203,
      entry: "43500",
      target: "41800",
      stop: "44200",
      rr: "1:2.4",
    },
    {
      student: "Sarah Kim",
      avatar: "/abstract-geometric-leader.png",
      level: "Advanced",
      instrument: "SPX500",
      category: "indices",
      direction: "LONG",
      accuracy: 86,
      winRate: 79,
      chartImage: "/placeholder-6qcsy.png",
      analysis: "Bullish breakout above key resistance with strong volume",
      confluences: ["Breakout Pattern", "Volume Confirmation", "MA Support"],
      likes: 15,
      comments: 6,
      views: 134,
      entry: "4850",
      target: "4920",
      stop: "4800",
      rr: "1:1.4",
    },
  ]

  return baseForecasts
    .filter((forecast) => category === "all" || forecast.category === category)
    .map((forecast, index) => ({
      ...forecast,
      id: `${week}-${index}`,
      timestamp: new Date(Date.now() - week * 7 * 24 * 60 * 60 * 1000 - index * 60 * 60 * 1000),
    }))
}

interface ForecastHistoryPanelProps {
  className?: string
}

export function ForecastHistoryPanel({ className }: ForecastHistoryPanelProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)

  // Generate calendar data
  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const current = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      const dayNumber = current.getDate()
      const isCurrentMonth = current.getMonth() === month
      const weekNumber = Math.floor(i / 7) + 1
      const hasForecasts = isCurrentMonth && Math.random() > 0.6
      const forecastCount = hasForecasts ? Math.floor(Math.random() * 5) + 1 : 0

      days.push({
        date: new Date(current),
        dayNumber,
        isCurrentMonth,
        weekNumber,
        hasForecasts,
        forecastCount,
        forecasts: hasForecasts ? generateMockForecasts(weekNumber, filterType) : [],
      })

      current.setDate(current.getDate() + 1)
    }

    return days
  }, [currentMonth, filterType])

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
    setSelectedWeek(null)
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
    setSelectedWeek(null)
  }

  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const ForecastMiniCard = ({ forecast }: { forecast: ForecastEntry }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="premium-glass-segment p-3 space-y-2 cursor-pointer group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={forecast.avatar || "/placeholder.svg"}
            alt={forecast.student}
            width={20}
            height={20}
            className="rounded-full border border-purple-400/30"
          />
          <span className="text-xs font-medium text-white truncate">{forecast.student}</span>
        </div>
        <Badge
          className={cn(
            "text-xs px-2 py-0.5",
            forecast.direction === "LONG" ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300",
          )}
        >
          {forecast.direction}
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5">{forecast.instrument}</Badge>
          <span className="text-xs text-zinc-400">{forecast.accuracy}%</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-500">
          <ThumbsUp className="w-3 h-3" />
          <span>{forecast.likes}</span>
        </div>
      </div>

      <div className="relative h-16 rounded-md overflow-hidden border border-zinc-700/50 group-hover:border-purple-400/30 transition-colors">
        <Image src={forecast.chartImage || "/placeholder.svg"} alt="Chart" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-1 left-1 right-1">
          <p className="text-xs text-white line-clamp-1">{forecast.analysis}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex gap-2">
          <span className="text-emerald-400">E: {forecast.entry}</span>
          <span className="text-blue-400">T: {forecast.target}</span>
        </div>
        <span className="text-purple-400 font-medium">R:R {forecast.rr}</span>
      </div>
    </motion.div>
  )

  const WeeklyForecastPopup = ({ weekNumber, forecasts }: { weekNumber: number; forecasts: ForecastEntry[] }) => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute top-full left-0 right-0 mt-4 z-50"
    >
      <div className="premium-glass-card p-4 border border-purple-500/30 shadow-2xl shadow-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            Week {weekNumber} Forecasts
          </h3>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">{forecasts.length} forecasts</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
          {forecasts.map((forecast) => (
            <ForecastMiniCard key={forecast.id} forecast={forecast} />
          ))}
        </div>

        {forecasts.length === 0 && (
          <div className="text-center py-8 text-zinc-400">
            <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No forecasts for this week</p>
          </div>
        )}
      </div>
    </motion.div>
  )

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Navigation and Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={prevMonth}
              variant="outline"
              size="sm"
              className="border-purple-400/50 text-purple-300 hover:bg-purple-500/10 glassy-flash bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-bold text-white min-w-[200px] text-center">{monthName}</h2>
            <Button
              onClick={nextMonth}
              variant="outline"
              size="sm"
              className="border-purple-400/50 text-purple-300 hover:bg-purple-500/10 glassy-flash bg-transparent"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-purple-400" />
          {(["all", "forex", "crypto", "indices"] as FilterType[]).map((filter) => (
            <Button
              key={filter}
              onClick={() => setFilterType(filter)}
              variant={filterType === filter ? "default" : "outline"}
              size="sm"
              className={cn(
                "capitalize glassy-flash",
                filterType === filter
                  ? "bg-purple-500 hover:bg-purple-600 text-white"
                  : "border-purple-400/50 text-purple-300 hover:bg-purple-500/10",
              )}
            >
              {filter === "forex" && <Globe className="w-3 h-3 mr-1" />}
              {filter === "crypto" && <Coins className="w-3 h-3 mr-1" />}
              {filter === "indices" && <BarChart3 className="w-3 h-3 mr-1" />}
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="relative">
        <div className="history-panel-glass p-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-purple-300 p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarData.map((day, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: day.hasForecasts ? 1.05 : 1.02 }}
                onHoverStart={() => {
                  if (day.hasForecasts) {
                    setHoveredDay(index)
                    setSelectedWeek(day.weekNumber)
                  }
                }}
                onHoverEnd={() => {
                  setHoveredDay(null)
                  setSelectedWeek(null)
                }}
                className={cn(
                  "aspect-square rounded-xl border p-3 cursor-pointer transition-all duration-300 premium-hover-board relative",
                  day.isCurrentMonth
                    ? day.hasForecasts
                      ? "border-purple-400/50 bg-gradient-to-br from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20"
                      : "border-zinc-700/50 bg-zinc-800/20 hover:bg-zinc-700/30"
                    : "border-zinc-800/30 bg-zinc-900/20 opacity-50",
                )}
              >
                <div className="flex flex-col h-full">
                  <div className="text-sm font-medium text-white mb-1">{day.dayNumber}</div>

                  {day.hasForecasts && (
                    <div className="flex-1 flex flex-col justify-end space-y-1">
                      <div className="flex gap-1 flex-wrap">
                        {day.forecasts.slice(0, 3).map((forecast, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-2 h-2 rounded-full",
                              forecast.category === "forex"
                                ? "bg-emerald-400"
                                : forecast.category === "crypto"
                                  ? "bg-blue-400"
                                  : "bg-amber-400",
                            )}
                          />
                        ))}
                        {day.forecastCount > 3 && (
                          <div className="text-xs text-purple-300 font-medium">+{day.forecastCount - 3}</div>
                        )}
                      </div>
                      <div className="text-xs text-zinc-400">{day.forecastCount} forecasts</div>
                    </div>
                  )}

                  {/* Hover glow effect */}
                  {hoveredDay === index && day.hasForecasts && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/50"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Weekly Forecast Popup */}
        <AnimatePresence>
          {selectedWeek && hoveredDay !== null && (
            <WeeklyForecastPopup weekNumber={selectedWeek} forecasts={calendarData[hoveredDay]?.forecasts || []} />
          )}
        </AnimatePresence>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Forecasts", value: "247", icon: Target, color: "text-purple-400" },
          { label: "Avg Accuracy", value: "87.3%", icon: Brain, color: "text-emerald-400" },
          { label: "Active Traders", value: "156", icon: TrendingUp, color: "text-blue-400" },
          { label: "This Month", value: "42", icon: Calendar, color: "text-amber-400" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="premium-glass-segment p-4 text-center space-y-2 cursor-pointer"
          >
            <stat.icon className={cn("w-6 h-6 mx-auto", stat.color)} />
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-zinc-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
