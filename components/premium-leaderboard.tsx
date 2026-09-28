"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Medal,
  TrendingUp,
  Target,
  Crown,
  Award,
  Users,
  Filter,
  Flame,
  Activity,
  CheckCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Clock,
  Eye,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LeaderboardEntry {
  id: string
  rank: number
  user: {
    name: string
    username: string
    avatar: string
    role: "mentor" | "student"
    badges: string[]
    verified: boolean
  }
  stats: {
    totalForecasts: number
    accuracy: number
    winRate: number
    currentStreak: number
    totalPoints: number
    avgRiskReward: number
    bestAccuracy: number
    longestStreak: number
    totalComments: number
    totalLikes: number
    totalViews: number
  }
  specialization: string[]
  tier: {
    name: string
    color: string
    gradient: string
  }
  communityId?: string
  joinedDate: string
  lastActive: string
}

type LeaderboardTab = "global" | "communities" | "mentors" | "personal"
type SortBy = "points" | "accuracy" | "winRate" | "forecasts" | "streak"
type TimePeriod = "today" | "week" | "month" | "allTime"
type AssetClass = "all" | "forex" | "crypto" | "stocks" | "indices"

interface WeeklyProgress {
  day: string
  date: string
  forecasts: number
  accuracy: number
  points: number
  winRate: number
  status: "completed" | "partial" | "missed"
}

interface PersonalForecast {
  id: string
  instrument: string
  direction: "LONG" | "SHORT"
  accuracy: number
  points: number
  timestamp: Date
  status: "win" | "loss" | "pending"
  entry: string
  target: string
  stop: string
  rr: string
  likes: number
  comments: number
  views: number
}

const generateWeeklyProgress = (): WeeklyProgress[] => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const today = new Date()

  return days.map((day, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (today.getDay() - 1) + index)

    return {
      day,
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      forecasts: Math.floor(Math.random() * 5) + 1,
      accuracy: Math.floor(Math.random() * 30) + 70,
      points: Math.floor(Math.random() * 500) + 100,
      winRate: Math.floor(Math.random() * 40) + 60,
      status: index < 5 ? "completed" : index === 5 ? "partial" : "missed",
    }
  })
}

const generatePersonalForecasts = (): PersonalForecast[] => {
  const instruments = ["EURUSD", "GBPUSD", "USDJPY", "BTCUSD", "ETHUSD", "SPX500", "GOLD"]
  const forecasts: PersonalForecast[] = []

  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    forecasts.push({
      id: `forecast-${i}`,
      instrument: instruments[Math.floor(Math.random() * instruments.length)],
      direction: Math.random() > 0.5 ? "LONG" : "SHORT",
      accuracy: Math.floor(Math.random() * 40) + 60,
      points: Math.floor(Math.random() * 300) + 50,
      timestamp: date,
      status: Math.random() > 0.3 ? "win" : Math.random() > 0.5 ? "loss" : "pending",
      entry: (Math.random() * 2 + 1).toFixed(4),
      target: (Math.random() * 2 + 1).toFixed(4),
      stop: (Math.random() * 2 + 1).toFixed(4),
      rr: `1:${(Math.random() * 2 + 1).toFixed(1)}`,
      likes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 20),
      views: Math.floor(Math.random() * 200) + 50,
    })
  }

  return forecasts
}

const mockLeaderboardData: LeaderboardEntry[] = [
  {
    id: "1",
    rank: 1,
    user: {
      name: "Alexandra Chen",
      username: "@alextrader",
      avatar: "/professional-trader.png",
      role: "mentor",
      badges: ["Expert", "Verified", "Top Performer"],
      verified: true,
    },
    stats: {
      totalForecasts: 247,
      accuracy: 94.2,
      winRate: 87.3,
      currentStreak: 23,
      totalPoints: 15840,
      avgRiskReward: 2.4,
      bestAccuracy: 98.5,
      longestStreak: 31,
      totalComments: 456,
      totalLikes: 1247,
      totalViews: 8934,
    },
    specialization: ["Forex", "Indices"],
    tier: {
      name: "Diamond Elite",
      color: "text-cyan-400",
      gradient: "from-cyan-400 to-blue-500",
    },
    joinedDate: "2023-01-15",
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    rank: 2,
    user: {
      name: "Marcus Rodriguez",
      username: "@cryptoking",
      avatar: "/forex-expert.png",
      role: "mentor",
      badges: ["Expert", "Crypto Specialist"],
      verified: true,
    },
    stats: {
      totalForecasts: 189,
      accuracy: 91.8,
      winRate: 84.2,
      currentStreak: 18,
      totalPoints: 14650,
      avgRiskReward: 2.1,
      bestAccuracy: 96.2,
      longestStreak: 28,
      totalComments: 321,
      totalLikes: 987,
      totalViews: 7234,
    },
    specialization: ["Crypto", "Forex"],
    tier: {
      name: "Platinum Pro",
      color: "text-purple-400",
      gradient: "from-purple-400 to-pink-500",
    },
    joinedDate: "2023-02-20",
    lastActive: "1 hour ago",
  },
  {
    id: "3",
    rank: 3,
    user: {
      name: "Sarah Kim",
      username: "@sarahstocks",
      avatar: "/student-trader.png",
      role: "student",
      badges: ["Advanced", "Rising Star"],
      verified: false,
    },
    stats: {
      totalForecasts: 156,
      accuracy: 89.4,
      winRate: 81.7,
      currentStreak: 12,
      totalPoints: 12890,
      avgRiskReward: 1.9,
      bestAccuracy: 94.8,
      longestStreak: 22,
      totalComments: 234,
      totalLikes: 756,
      totalViews: 5678,
    },
    specialization: ["Indices", "Commodities"],
    tier: {
      name: "Gold Master",
      color: "text-amber-400",
      gradient: "from-amber-400 to-orange-500",
    },
    joinedDate: "2023-03-10",
    lastActive: "30 minutes ago",
  },
  {
    id: "4",
    rank: 4,
    user: {
      name: "David Thompson",
      username: "@davidfx",
      avatar: "/forex-student.png",
      role: "student",
      badges: ["Advanced", "Consistent"],
      verified: false,
    },
    stats: {
      totalForecasts: 134,
      accuracy: 87.2,
      winRate: 79.1,
      currentStreak: 8,
      totalPoints: 11240,
      avgRiskReward: 1.7,
      bestAccuracy: 92.3,
      longestStreak: 19,
      totalComments: 189,
      totalLikes: 623,
      totalViews: 4567,
    },
    specialization: ["Forex", "Crypto"],
    tier: {
      name: "Silver Elite",
      color: "text-zinc-400",
      gradient: "from-zinc-400 to-slate-500",
    },
    joinedDate: "2023-04-05",
    lastActive: "4 hours ago",
  },
  {
    id: "5",
    rank: 5,
    user: {
      name: "Emma Wilson",
      username: "@emmacrypto",
      avatar: "/professional-trader.png",
      role: "student",
      badges: ["Intermediate", "Fast Learner"],
      verified: false,
    },
    stats: {
      totalForecasts: 98,
      accuracy: 85.7,
      winRate: 76.5,
      currentStreak: 6,
      totalPoints: 9680,
      avgRiskReward: 1.5,
      bestAccuracy: 89.6,
      longestStreak: 15,
      totalComments: 123,
      totalLikes: 445,
      totalViews: 3234,
    },
    specialization: ["Crypto", "Indices"],
    tier: {
      name: "Bronze Pro",
      color: "text-orange-600",
      gradient: "from-orange-600 to-red-500",
    },
    joinedDate: "2023-05-12",
    lastActive: "1 day ago",
  },
]

const globalLeaderboardData: LeaderboardEntry[] = [
  // All public traders data
  ...mockLeaderboardData,
]

const communityLeaderboardData: LeaderboardEntry[] = [
  // Only community members data
  {
    ...mockLeaderboardData[0],
    communityId: "trading-masters",
    user: { ...mockLeaderboardData[0].user, name: "Alex Chen (Trading Masters)" },
  },
  {
    ...mockLeaderboardData[2],
    communityId: "crypto-elite",
    user: { ...mockLeaderboardData[2].user, name: "Sarah Kim (Crypto Elite)" },
  },
]

const mentorLeaderboardData: LeaderboardEntry[] = [
  // Only mentors data
  ...mockLeaderboardData.filter((entry) => entry.user.role === "mentor"),
]

const personalStatsData = {
  // Personal user stats
  rank: 47,
  totalForecasts: 89,
  accuracy: 82.4,
  winRate: 76.8,
  currentStreak: 5,
  totalPoints: 7420,
  avgRiskReward: 1.8,
  bestAccuracy: 91.2,
  longestStreak: 12,
  totalComments: 67,
  totalLikes: 234,
  totalViews: 1456,
  progressData: [
    { month: "Jan", points: 1200 },
    { month: "Feb", points: 2100 },
    { month: "Mar", points: 3400 },
    { month: "Apr", points: 4800 },
    { month: "May", points: 6200 },
    { month: "Jun", points: 7420 },
  ],
}

interface PremiumLeaderboardProps {
  className?: string
}

export function PremiumLeaderboard({ className }: PremiumLeaderboardProps) {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("global")
  const [sortBy, setSortBy] = useState<SortBy>("points")
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("allTime")
  const [assetClass, setAssetClass] = useState<AssetClass>("all")
  const [viewMode, setViewMode] = useState<"overview" | "calendar">("overview")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const tabData = useMemo(() => {
    switch (activeTab) {
      case "global":
        return globalLeaderboardData
      case "communities":
        return communityLeaderboardData
      case "mentors":
        return mentorLeaderboardData
      case "personal":
        return []
      default:
        return globalLeaderboardData
    }
  }, [activeTab])

  const sortedData = useMemo(() => {
    return [...tabData].sort((a, b) => {
      switch (sortBy) {
        case "accuracy":
          return b.stats.accuracy - a.stats.accuracy
        case "winRate":
          return b.stats.winRate - a.stats.winRate
        case "forecasts":
          return b.stats.totalForecasts - a.stats.totalForecasts
        case "streak":
          return b.stats.currentStreak - a.stats.currentStreak
        default:
          return b.stats.totalPoints - a.stats.totalPoints
      }
    })
  }, [tabData, sortBy])

  const weeklyProgress = useMemo(() => generateWeeklyProgress(), [])
  const personalForecasts = useMemo(() => generatePersonalForecasts(), [])

  const handleTabClick = (tabId: LeaderboardTab) => {
    setActiveTab(tabId)
  }

  const tabs = [
    { id: "global", label: "Global Rankings", icon: Trophy, description: "All public traders" },
    { id: "communities", label: "My Communities", icon: Users, description: "Your community rankings" },
    { id: "mentors", label: "Mentor Board", icon: Crown, description: "Top mentors" },
    { id: "personal", label: "Personal Stats", icon: Target, description: "Your performance" },
  ]

  const sortOptions = [
    { id: "points", label: "Points", icon: Crown },
    { id: "accuracy", label: "Accuracy", icon: Target },
    { id: "winRate", label: "Win Rate", icon: TrendingUp },
    { id: "forecasts", label: "Forecasts", icon: Activity },
    { id: "streak", label: "Streak", icon: Flame },
  ]

  const LeaderboardEntry = ({ entry, index }: { entry: LeaderboardEntry; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      className="group relative"
    >
      <div
        className="relative overflow-hidden rounded-xl p-4 transition-all duration-300 cursor-pointer"
        style={{
          background: "rgba(18, 20, 28, 0.6)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(147, 51, 234, 0.15)",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 border border-amber-400/30 flex items-center justify-center">
          {entry.rank === 1 && <Crown className="w-4 h-4 text-amber-400" />}
          {entry.rank === 2 && <Medal className="w-4 h-4 text-zinc-300" />}
          {entry.rank === 3 && <Award className="w-4 h-4 text-orange-400" />}
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex-shrink-0">
            {entry.rank <= 3 ? (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400/20 to-yellow-500/20 border border-amber-400/30 flex items-center justify-center">
                {entry.rank === 1 && <Crown className="w-4 h-4 text-amber-400" />}
                {entry.rank === 2 && <Medal className="w-4 h-4 text-zinc-300" />}
                {entry.rank === 3 && <Award className="w-4 h-4 text-orange-400" />}
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-zinc-700/50 border border-zinc-600/30 flex items-center justify-center">
                <span className="text-xs font-bold text-zinc-300">#{entry.rank}</span>
              </div>
            )}
          </div>

          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-purple-400/20">
              <Image
                src={entry.user.avatar || "/placeholder.svg"}
                alt={entry.user.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            {entry.user.verified && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                <CheckCircle className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white text-sm truncate">{entry.user.name}</h3>
              <Badge
                className={cn(
                  "text-xs px-1.5 py-0.5 border-0",
                  entry.user.role === "mentor" ? "bg-purple-500/20 text-purple-300" : "bg-zinc-600/20 text-zinc-400",
                )}
              >
                {entry.user.role === "mentor" ? "Mentor" : "Student"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {entry.specialization.slice(0, 2).map((spec) => (
                <span
                  key={spec}
                  className="text-xs px-2 py-0.5 rounded bg-zinc-700/30 text-zinc-400 border border-zinc-600/20"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="font-bold text-emerald-400">{entry.stats.accuracy}%</div>
              <div className="text-xs text-zinc-500">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-blue-400">{entry.stats.winRate}%</div>
              <div className="text-xs text-zinc-500">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-purple-400">{entry.stats.totalForecasts}</div>
              <div className="text-xs text-zinc-500">Forecasts</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-orange-400">{entry.stats.currentStreak}</div>
              <div className="text-xs text-zinc-500">Streak</div>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {entry.stats.totalPoints.toLocaleString()}
            </div>
            <div className="text-xs text-zinc-500">points</div>
          </div>
        </div>

        <div className="absolute inset-0 rounded-xl border border-purple-400/0 group-hover:border-purple-400/30 transition-colors duration-300 pointer-events-none" />
      </div>
    </motion.div>
  )

  const PersonalStatsView = () => {
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
        const dayForecasts = personalForecasts.filter((f) => f.timestamp.toDateString() === current.toDateString())

        days.push({
          date: new Date(current),
          dayNumber,
          isCurrentMonth,
          forecasts: dayForecasts,
          hasForecasts: dayForecasts.length > 0,
          totalPoints: dayForecasts.reduce((sum, f) => sum + f.points, 0),
          avgAccuracy:
            dayForecasts.length > 0 ? dayForecasts.reduce((sum, f) => sum + f.accuracy, 0) / dayForecasts.length : 0,
        })

        current.setDate(current.getDate() + 1)
      }

      return days
    }, [currentMonth, personalForecasts])

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
    const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
              <Target className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Personal Performance</h3>
              <p className="text-sm text-zinc-400">Your trading journey and progress</p>
            </div>
          </div>

          <div
            className="flex items-center rounded-lg p-1"
            style={{
              background: "rgba(18, 20, 28, 0.6)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(147, 51, 234, 0.15)",
            }}
          >
            <Button
              onClick={() => setViewMode("overview")}
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-3 text-xs transition-all duration-200 rounded-md",
                viewMode === "overview"
                  ? "bg-purple-600/30 text-purple-300 border border-purple-500/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-700/30",
              )}
            >
              <BarChart3 className="w-3 h-3 mr-1" />
              Overview
            </Button>
            <Button
              onClick={() => setViewMode("calendar")}
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-3 text-xs transition-all duration-200 rounded-md",
                viewMode === "calendar"
                  ? "bg-purple-600/30 text-purple-300 border border-purple-500/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-700/30",
              )}
            >
              <Calendar className="w-3 h-3 mr-1" />
              Calendar
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div
                className="p-4 rounded-xl"
                style={{
                  background: "rgba(18, 20, 28, 0.6)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(147, 51, 234, 0.15)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    This Week's Progress
                  </h4>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs">Last 7 Days</Badge>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {weeklyProgress.map((day, index) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "p-3 rounded-lg text-center space-y-2 transition-all duration-200 cursor-pointer",
                        day.status === "completed"
                          ? "bg-emerald-500/10 border border-emerald-400/30 hover:bg-emerald-500/20"
                          : day.status === "partial"
                            ? "bg-amber-500/10 border border-amber-400/30 hover:bg-amber-500/20"
                            : "bg-zinc-700/20 border border-zinc-600/30 hover:bg-zinc-700/30",
                      )}
                    >
                      <div className="text-xs font-medium text-zinc-400">{day.day}</div>
                      <div className="text-xs text-zinc-500">{day.date}</div>
                      <div className="space-y-1">
                        <div
                          className={cn(
                            "text-sm font-bold",
                            day.status === "completed"
                              ? "text-emerald-400"
                              : day.status === "partial"
                                ? "text-amber-400"
                                : "text-zinc-500",
                          )}
                        >
                          {day.forecasts}
                        </div>
                        <div className="text-xs text-zinc-500">forecasts</div>
                        <div
                          className={cn(
                            "text-xs font-medium",
                            day.accuracy >= 80
                              ? "text-emerald-400"
                              : day.accuracy >= 60
                                ? "text-amber-400"
                                : "text-red-400",
                          )}
                        >
                          {day.accuracy}%
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Points",
                    value: personalStatsData.totalPoints.toLocaleString(),
                    icon: Crown,
                    color: "text-purple-400",
                  },
                  {
                    label: "Accuracy",
                    value: `${personalStatsData.accuracy}%`,
                    icon: Target,
                    color: "text-emerald-400",
                  },
                  {
                    label: "Win Rate",
                    value: `${personalStatsData.winRate}%`,
                    icon: TrendingUp,
                    color: "text-blue-400",
                  },
                  {
                    label: "Current Streak",
                    value: personalStatsData.currentStreak.toString(),
                    icon: Flame,
                    color: "text-orange-400",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl text-center space-y-2"
                    style={{
                      background: "rgba(18, 20, 28, 0.6)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(147, 51, 234, 0.15)",
                    }}
                  >
                    <stat.icon className={cn("w-5 h-5 mx-auto", stat.color)} />
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-zinc-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <div
                className="p-4 rounded-xl"
                style={{
                  background: "rgba(18, 20, 28, 0.6)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(147, 51, 234, 0.15)",
                }}
              >
                <h4 className="text-sm font-semibold text-white mb-4">Progress Over Time</h4>
                <div className="h-32 flex items-end justify-between gap-2">
                  {personalStatsData.progressData.map((data, index) => (
                    <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-gradient-to-t from-purple-500 to-blue-500 rounded-t transition-all duration-500 hover:from-purple-400 hover:to-blue-400"
                        style={{ height: `${(data.points / 8000) * 100}%` }}
                      />
                      <span className="text-xs text-zinc-400">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div
                className="p-4 rounded-xl"
                style={{
                  background: "rgba(18, 20, 28, 0.6)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(147, 51, 234, 0.15)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={prevMonth}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-purple-300 hover:bg-purple-500/10"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <h3 className="text-lg font-bold text-white min-w-[200px] text-center">{monthName}</h3>
                    <Button
                      onClick={nextMonth}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-purple-300 hover:bg-purple-500/10"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs">
                    Personal Calendar
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-7 gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-purple-300 p-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {calendarData.map((day, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: day.hasForecasts ? 1.05 : 1.02 }}
                        onClick={() => day.hasForecasts && setSelectedDate(day.date)}
                        className={cn(
                          "aspect-square rounded-lg border p-2 cursor-pointer transition-all duration-200 relative",
                          day.isCurrentMonth
                            ? day.hasForecasts
                              ? "border-purple-400/50 bg-gradient-to-br from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20"
                              : "border-zinc-700/30 bg-zinc-800/10 hover:bg-zinc-700/20"
                            : "border-zinc-800/20 bg-zinc-900/10 opacity-40",
                        )}
                      >
                        <div className="text-xs font-medium text-white mb-1">{day.dayNumber}</div>

                        {day.hasForecasts && (
                          <div className="space-y-1">
                            <div className="flex gap-1">
                              {day.forecasts.slice(0, 3).map((forecast, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    forecast.status === "win"
                                      ? "bg-emerald-400"
                                      : forecast.status === "loss"
                                        ? "bg-red-400"
                                        : "bg-amber-400",
                                  )}
                                ></div>
                              ))}
                            </div>
                            <div className="text-xs text-purple-300 font-medium">{day.totalPoints}pts</div>
                            <div className="text-xs text-zinc-400">{Math.round(day.avgAccuracy)}%</div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl"
                  style={{
                    background: "rgba(18, 20, 28, 0.6)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(147, 51, 234, 0.15)",
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-white">
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h4>
                    <Button
                      onClick={() => setSelectedDate(null)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-zinc-400 hover:text-white"
                    >
                      ×
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {personalForecasts
                      .filter((f) => f.timestamp.toDateString() === selectedDate.toDateString())
                      .map((forecast) => (
                        <div
                          key={forecast.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30"
                        >
                          <div className="flex items-center gap-3">
                            <Badge
                              className={cn(
                                "text-xs px-2 py-1",
                                forecast.direction === "LONG"
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-red-500/20 text-red-300",
                              )}
                            >
                              {forecast.direction}
                            </Badge>
                            <span className="text-sm font-medium text-white">{forecast.instrument}</span>
                            <Badge
                              className={cn(
                                "text-xs px-2 py-1",
                                forecast.status === "win"
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : forecast.status === "loss"
                                    ? "bg-red-500/20 text-red-300"
                                    : "bg-amber-500/20 text-amber-300",
                              )}
                            >
                              {forecast.status}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-zinc-400">
                            <div className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              {forecast.accuracy}%
                            </div>
                            <div className="flex items-center gap-1">
                              <Crown className="w-3 h-3" />
                              {forecast.points}pts
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {forecast.views}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className="p-4 rounded-xl"
        style={{
          background: "rgba(18, 20, 28, 0.6)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(147, 51, 234, 0.15)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Community Leaderboard</h2>
              <p className="text-sm text-zinc-400">Top performers in the $177M trading community</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs text-zinc-500 mr-2">Sort by:</span>
            {sortOptions.map((option) => {
              const Icon = option.icon
              return (
                <Button
                  key={option.id}
                  onClick={() => setSortBy(option.id as SortBy)}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3 text-xs transition-all duration-200",
                    sortBy === option.id
                      ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-700/30",
                  )}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {option.label}
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      <div
        className="p-2 rounded-xl"
        style={{
          background: "rgba(18, 20, 28, 0.6)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(147, 51, 234, 0.15)",
        }}
      >
        <div className="grid grid-cols-4 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                onClick={() => handleTabClick(tab.id as LeaderboardTab)}
                variant="ghost"
                className={cn(
                  "flex items-center gap-2 p-3 h-auto transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-purple-600/20 text-white border border-purple-500/30"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-700/20",
                )}
              >
                <Icon className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium text-xs">{tab.label}</div>
                  <div className="text-xs opacity-60">{tab.description}</div>
                </div>
              </Button>
            )
          })}
        </div>
      </div>

      {activeTab !== "personal" && (
        <div
          className="p-3 rounded-xl"
          style={{
            background: "rgba(18, 20, 28, 0.6)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(147, 51, 234, 0.15)",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-3 h-3 text-zinc-400" />
              <span className="text-xs text-zinc-500">Filters:</span>
            </div>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
              className="bg-zinc-800/50 border border-zinc-600/30 rounded px-2 py-1 text-xs text-white focus:border-purple-400/50 focus:outline-none"
            >
              <option value="allTime">All Time</option>
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="today">Today</option>
            </select>
            <select
              value={assetClass}
              onChange={(e) => setAssetClass(e.target.value as AssetClass)}
              className="bg-zinc-800/50 border border-zinc-600/30 rounded px-2 py-1 text-xs text-white focus:border-purple-400/50 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="forex">Forex</option>
              <option value="crypto">Crypto</option>
              <option value="stocks">Stocks</option>
              <option value="indices">Indices</option>
            </select>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <AnimatePresence mode="wait">
          {activeTab === "personal" ? (
            <PersonalStatsView />
          ) : (
            sortedData.map((entry, index) => (
              <LeaderboardEntry key={`${activeTab}-${entry.id}`} entry={entry} index={index} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
