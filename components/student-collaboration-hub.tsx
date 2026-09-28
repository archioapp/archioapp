"use client"

import type React from "react"

import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Upload,
  CheckCircle,
  Sparkles,
  Users,
  Trophy,
  Target,
  BookOpen,
  ImageIcon,
  History,
  ThumbsUp,
  MessageSquare,
  Eye,
  TrendingDown,
  TrendingUp,
  Heart,
  MessageCircle,
  Play,
  X,
  Crown,
  Rocket,
  Shield,
  BarChart3,
  Activity,
  Calendar,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

import { AdvancedFilterSystem, type FilterState } from "./advanced-filter-system"
import { PremiumLeaderboard } from "./premium-leaderboard"
import { ProfessionalGuideModal } from "./professional-guide-modal"
import { ForecastHistoryPanel } from "./forecast-history-panel"
import { CreateForecastModal } from "./create-forecast-modal"

type AnalysisStatus = "idle" | "analyzing" | "success" | "error"
type FilterType = "all" | "forex" | "crypto" | "indices" | "commodities"
type TimeFilter = "week" | "month" | "quarter" | "year"
type ForecastFlowState = "pre-submit" | "analyzing" | "post-submit" | "detailed-view" | "released"

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
}

interface LeaderboardEntry {
  rank: number
  student: string
  avatar: string
  totalForecasts: number
  accuracy: number
  winRate: number
  points: number
  badge: string
}

const mockForecasts: ForecastEntry[] = [
  {
    id: "1",
    student: "Alexandra Chen",
    avatar: "/diverse-student-studying.png",
    level: "Expert",
    instrument: "EURUSD",
    category: "forex",
    direction: "LONG",
    accuracy: 94,
    winRate: 87,
    timestamp: new Date(), // Today
    chartImage: "/placeholder-6qcsy.png",
    analysis: "Strong bullish momentum with institutional support at key levels",
    confluences: ["BPR Rejection", "DXY Weakness", "Institutional Flow"],
    likes: 24,
    comments: 8,
    views: 156,
  },
  {
    id: "2",
    student: "Marcus Rodriguez",
    avatar: "/diverse-student-studying.png",
    level: "Advanced",
    instrument: "BTCUSD",
    category: "crypto",
    direction: "SHORT",
    accuracy: 89,
    winRate: 82,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
    chartImage: "/placeholder-j3got.png",
    analysis: "Bearish divergence with volume confirmation at resistance",
    confluences: ["RSI Divergence", "Volume Profile", "Resistance Zone"],
    likes: 18,
    comments: 12,
    views: 203,
  },
  {
    id: "3",
    student: "Sarah Kim",
    avatar: "/diverse-student-studying.png",
    level: "Intermediate",
    instrument: "GBPJPY",
    category: "forex",
    direction: "LONG",
    accuracy: 76,
    winRate: 71,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    chartImage: "/placeholder-6qcsy.png",
    analysis: "Break and retest of daily resistance, targeting weekly high",
    confluences: ["Break of Structure", "Liquidity Sweep", "Order Block"],
    likes: 15,
    comments: 6,
    views: 89,
  },
  {
    id: "4",
    student: "David Thompson",
    avatar: "/diverse-student-studying.png",
    level: "Advanced",
    instrument: "XAUUSD",
    category: "commodities",
    direction: "SHORT",
    accuracy: 91,
    winRate: 85,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    chartImage: "/placeholder-j3got.png",
    analysis: "Gold rejection at key resistance with dollar strength",
    confluences: ["Resistance Zone", "DXY Strength", "Risk Off Sentiment"],
    likes: 32,
    comments: 14,
    views: 267,
  },
  {
    id: "5",
    student: "Emma Wilson",
    avatar: "/diverse-student-studying.png",
    level: "Expert",
    instrument: "USDJPY",
    category: "forex",
    direction: "LONG",
    accuracy: 88,
    winRate: 83,
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    chartImage: "/placeholder-6qcsy.png",
    analysis: "BoJ intervention levels holding, targeting 155.00",
    confluences: ["Central Bank Policy", "Technical Breakout", "Momentum"],
    likes: 28,
    comments: 11,
    views: 198,
  },
  {
    id: "6",
    student: "James Park",
    avatar: "/diverse-student-studying.png",
    level: "Intermediate",
    instrument: "ETHUSD",
    category: "crypto",
    direction: "LONG",
    accuracy: 72,
    winRate: 68,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    chartImage: "/placeholder-j3got.png",
    analysis: "ETH showing strength against BTC, altcoin season potential",
    confluences: ["Relative Strength", "Volume Increase", "Support Hold"],
    likes: 19,
    comments: 7,
    views: 134,
  },
]

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    student: "Alexandra Chen",
    avatar: "/inspiring-leader.png",
    totalForecasts: 47,
    accuracy: 94,
    winRate: 87,
    points: 2840,
    badge: "Diamond",
  },
  {
    rank: 2,
    student: "Marcus Rodriguez",
    avatar: "/inspiring-leader.png",
    totalForecasts: 39,
    accuracy: 89,
    winRate: 82,
    points: 2650,
    badge: "Platinum",
  },
  {
    rank: 3,
    student: "Sarah Kim",
    avatar: "/abstract-geometric-leader.png",
    totalForecasts: 52,
    accuracy: 86,
    winRate: 79,
    points: 2480,
    badge: "Gold",
  },
]

export function StudentCollaborationHub() {
  const [activeSection, setActiveSection] = useState<"intro" | "submit" | "history" | "leaderboard" | "weekly">("intro")
  const [showGuide, setShowGuide] = useState(false)
  const [showCreateForecast, setShowCreateForecast] = useState(false)

  const [showWeeklyCalendar, setShowWeeklyCalendar] = useState(false)
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)
  const [hoveredDayForecasts, setHoveredDayForecasts] = useState<any[]>([])

  const weeklyCalendarTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleWeeklyHoverEnter = useCallback(() => {
    if (weeklyCalendarTimeoutRef.current) {
      clearTimeout(weeklyCalendarTimeoutRef.current)
      weeklyCalendarTimeoutRef.current = null
    }
    setShowWeeklyCalendar(true)
  }, [])

  const handleWeeklyHoverLeave = useCallback(() => {
    weeklyCalendarTimeoutRef.current = setTimeout(() => {
      setShowWeeklyCalendar(false)
      setHoveredDay(null)
      setHoveredDayForecasts([])
    }, 300) // Increased delay for more stable interaction
  }, [])

  const handleDayHoverEnter = useCallback((date: number, forecasts: any[]) => {
    if (weeklyCalendarTimeoutRef.current) {
      clearTimeout(weeklyCalendarTimeoutRef.current)
      weeklyCalendarTimeoutRef.current = null
    }
    setHoveredDay(date)
    setHoveredDayForecasts(forecasts)
  }, [])

  const handleDayHoverLeave = useCallback(() => {
    setTimeout(() => {
      setHoveredDay(null)
      setHoveredDayForecasts([])
    }, 100)
  }, [])

  const [filterType, setFilterType] = useState<FilterType>("all")
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("month")
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [hoveredForecast, setHoveredForecast] = useState<string | null>(null)

  // Added advanced filter state management
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    direction: "all",
    level: "all",
    timeRange: "all",
    accuracyRange: [0, 100],
    winRateRange: [0, 100],
    sortBy: "newest",
    sortOrder: "desc",
  })

  const [forecastFlowState, setForecastFlowState] = useState<ForecastFlowState>("pre-submit")
  const [selectedInstrument, setSelectedInstrument] = useState("EURUSD")
  const [selectedDirection, setSelectedDirection] = useState<"LONG" | "SHORT">("LONG")
  const [aiInsights, setAiInsights] = useState("")
  const [detectedConfluences, setDetectedConfluences] = useState<string[]>([])

  const [selectedConfluences, setSelectedConfluences] = useState<string[]>([
    "Higher Timeframe Structure",
    "Liquidity Sweep",
    "Balanced Price Range",
    "Fair Value Gap (FVG)",
    "Inverted FVG (iFVG)",
  ])

  const [focusLevel, setFocusLevel] = useState(8)
  const [disciplineLevel, setDisciplineLevel] = useState(7)
  const [psychologicalStates, setPsychologicalStates] = useState<string[]>(["Confidence", "Focus"])

  const confluenceOptions = [
    { id: "Higher Timeframe Structure", icon: "📈", strength: 92 },
    { id: "Liquidity Sweep", icon: "🌊", strength: 88 },
    { id: "Balanced Price Range", icon: "⚖️", strength: 85 },
    { id: "Fair Value Gap (FVG)", icon: "📊", strength: 90 },
    { id: "Inverted FVG (iFVG)", icon: "📉", strength: 87 },
    { id: "Order Block (OB)", icon: "🧱", strength: 83 },
    { id: "Breaker Block", icon: "💥", strength: 79 },
    { id: "Power of Three (PO3)", icon: "⚡", strength: 81 },
    { id: "Bank Session Filter", icon: "🏦", strength: 76 },
    { id: "Weekly/Daily Open + PD", icon: "📅", strength: 74 },
    { id: "Pivot Points", icon: "🎯", strength: 78 },
  ]

  const psychologicalOptions = [
    "Confidence",
    "Patience",
    "Discipline",
    "Focus",
    "FOMO",
    "Overconfidence",
    "Revenge Trading",
    "Confirmation Bias",
  ]

  const toggleConfluence = (confluence: string) => {
    setSelectedConfluences((prev) =>
      prev.includes(confluence) ? prev.filter((c) => c !== confluence) : [...prev, confluence],
    )
  }

  const togglePsychologicalState = (state: string) => {
    setPsychologicalStates((prev) => (prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]))
  }

  const getAverageStrength = () => {
    if (!confluenceOptions || !Array.isArray(confluenceOptions)) {
      return 0
    }
    const selectedStrengths = confluenceOptions.filter((c) => selectedConfluences.includes(c.id)).map((c) => c.strength)
    return selectedStrengths.length > 0
      ? Math.round(selectedStrengths.reduce((a, b) => a + b, 0) / selectedStrengths.length)
      : 0
  }

  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>("idle")

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setUploadedImage(url)
      setAnalysisStatus("idle")
    }
  }

  const handleAnalyze = async () => {
    if (!uploadedImage) return
    setAnalysisStatus("analyzing")
    setForecastFlowState("analyzing")

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setAiInsights("Strong bullish reversal pattern detected at key support level with RSI oversold conditions.")
    setDetectedConfluences(["BPR Rejection", "DXY Weakness", "Institutional Flow"])
    setAnalysisStatus("success")
    setForecastFlowState("post-submit")
  }

  const handleReleaseForecast = () => {
    setForecastFlowState("released")
    // Add to forecasts list logic here
  }

  const DetailedForecastCard = ({ forecast }: { forecast: ForecastEntry }) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
      <motion.div
        className="relative group cursor-pointer"
        onMouseEnter={() => setTimeout(() => setIsHovered(true), 150)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
      >
        {/* AI VERIFIED Badge - Top Right Corner */}
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/40 backdrop-blur-sm font-bold text-xs px-3 py-1.5 shadow-lg">
            <CheckCircle className="w-3 h-3 mr-1.5" />
            AI VERIFIED
          </Badge>
        </div>

        {/* Card Container with Dynamic Height */}
        <div
          className={cn(
            "rounded-2xl border border-white/10 bg-black/60 p-6 shadow-2xl shadow-black/40 hover:border-purple-400/50 hover:shadow-purple-500/10",
            "transform-gpu will-change-transform transition-all duration-700 ease-in-out ultra-premium-scenario-card",
          )}
          style={{
            background:
              "radial-gradient(circle at 100% 0%, rgba(168, 85, 247, 0.1), transparent 30%), radial-gradient(circle at 0% 100%, rgba(59, 130, 246, 0.1), transparent 30%), #111113",
            height: isHovered ? "auto" : "400px",
          }}
        >
          {/* Header - Always Visible */}
          <div className="flex items-start gap-4 mb-4 pr-24">
            <div className="relative flex-shrink-0">
              <Image
                src={forecast.avatar || "/placeholder.svg"}
                alt={forecast.student}
                width={48}
                height={48}
                className="rounded-full border-2 border-white/20 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse" />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-white text-lg leading-tight">{forecast.student}</h3>
              <p className="text-sm text-zinc-400">
                {forecast.level} • {forecast.timestamp.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Default State: Large Chart Image (Brief View) */}
          {!isHovered && (
            <div
              className="transition-all duration-700 ease-in-out"
              style={{
                opacity: isHovered ? 0 : 1,
                transform: isHovered ? "translateY(-10px)" : "translateY(0px)",
              }}
            >
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg border border-white/10 group-hover:border-amber-300/40 transition-all duration-500">
                <Image
                  src={forecast.chartImage || "/placeholder.svg"}
                  alt={`Chart for ${forecast.instrument}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed mb-4">{forecast.analysis}</p>

              <div className="flex items-center justify-between text-zinc-400 pt-4 border-t border-white/10">
                <div className="flex items-center gap-4 text-sm">
                  <span className="inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-white">
                    <ThumbsUp className="w-4 h-4" /> {forecast.likes}
                  </span>
                  <span className="inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-white">
                    <MessageSquare className="w-4 h-4" /> {forecast.comments}
                  </span>
                  <span className="inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-white">
                    <Eye className="w-4 h-4" /> {forecast.views}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Expanded State: Detailed Information */}
          {isHovered && (
            <div
              className="transition-all duration-700 ease-in-out"
              style={{
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "translateY(0px)" : "translateY(10px)",
              }}
            >
              {/* Performance Metrics */}
              <div
                className="grid grid-cols-3 gap-4 mb-6 text-center transition-all duration-500 delay-100"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "translateY(0px)" : "translateY(20px)",
                }}
              >
                <div>
                  <p className="text-2xl font-bold text-emerald-400">{forecast.winRate}%</p>
                  <p className="text-xs text-zinc-400">Win Rate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-cyan-400">1:{((forecast.winRate / 100) * 2.5).toFixed(1)}</p>
                  <p className="text-xs text-zinc-400">Avg R:R</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-400">{forecast.accuracy}%</p>
                  <p className="text-xs text-zinc-400">Accuracy</p>
                </div>
              </div>

              {/* Trade Badges */}
              <div
                className="flex items-center gap-2 mb-4 transition-all duration-500 delay-150"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "translateY(0px)" : "translateY(20px)",
                }}
              >
                <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm font-semibold px-3 py-1">
                  {forecast.instrument}
                </Badge>
                <Badge
                  className={cn(
                    "border backdrop-blur-sm font-semibold px-3 py-1",
                    forecast.direction === "SHORT"
                      ? "bg-red-500/20 text-red-300 border-red-400/30"
                      : "bg-green-500/20 text-green-300 border-green-400/40",
                  )}
                >
                  {forecast.direction === "SHORT" ? (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  )}
                  {forecast.direction}
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 font-semibold px-3 py-1">
                  4H
                </Badge>
              </div>

              {/* Key Confluences */}
              <div
                className="mb-6 transition-all duration-500 delay-300"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "translateY(0px)" : "translateY(20px)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h4 className="text-sm font-semibold text-emerald-400">Key Confluences</h4>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {forecast.confluences?.slice(0, 3).map((confluence, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-400/30 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-emerald-300 font-medium">{confluence}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-700"
                            style={{ width: `${85 + Math.random() * 15}%` }}
                          />
                        </div>
                        <span className="text-xs text-emerald-400 font-bold w-10 text-right">
                          {Math.floor(85 + Math.random() * 15)}/100
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Analysis */}
              <div
                className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl mb-6 transition-all duration-500 delay-350"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "translateY(0px)" : "translateY(20px)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-semibold text-purple-400">AI Analysis</span>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-sm px-2 py-1">
                    {(8.5 + Math.random() * 1.5).toFixed(1)}/10
                  </Badge>
                </div>
                <p className="text-sm text-white leading-relaxed">
                  Excellent read on institutional flow, aligning with key technical levels for a high-probability setup.
                </p>
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-start text-zinc-400 pt-4 border-t border-white/10 transition-all duration-500 delay-400"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "translateY(0px)" : "translateY(20px)",
                }}
              >
                <div className="flex items-center gap-4 text-sm">
                  <span className="inline-flex items-center gap-1.5 hover:text-white transition-colors duration-300">
                    <ThumbsUp className="w-4 h-4" /> {forecast.likes}
                  </span>
                  <span className="inline-flex items-center gap-1.5 hover:text-white transition-colors duration-300">
                    <MessageSquare className="w-4 h-4" /> {forecast.comments}
                  </span>
                  <span className="inline-flex items-center gap-1.5 hover:text-white transition-colors duration-300">
                    <Eye className="w-4 h-4" /> {forecast.views}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  const SubmitSection = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
      style={{ marginTop: "8vh" }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 digital-display">
          <Upload className="w-6 h-6 text-purple-400" />
          Submit Your Forecast
        </h2>
        <Button
          onClick={() => setShowGuide(true)}
          variant="outline"
          className="border-purple-400/50 text-purple-300 hover:bg-purple-500/10 glassy-flash liquid-glass-button"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Guide with Pictures
        </Button>
      </div>

      {/* Enhanced Create New Forecast Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="premium-glass-card p-8 space-y-8 ultra-premium-scenario-card text-center"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 inline-block">
            <Sparkles className="w-12 h-12 text-purple-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white digital-display mb-2">Create New Forecast</h3>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Upload your chart, add commentary, confirm confluences, and analyze with AI using our comprehensive
              forecast creation system.
            </p>
          </div>
        </div>

        <Button
          onClick={() => setShowCreateForecast(true)}
          className="premium-glow-button bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold px-12 py-4 text-lg"
        >
          <Brain className="w-6 h-6 mr-3" />
          Create Forecast
        </Button>
      </motion.div>
    </motion.div>
  )

  const HistorySection = () => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 digital-display">
          <History className="w-6 h-6 text-emerald-400" />
          Professional Forecast History
        </h2>
        <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border-purple-400/30 px-3 py-1 liquid-glass-button">
          $177M Premium System
        </Badge>
      </div>

      <AdvancedFilterSystem filters={filters} onFiltersChange={setFilters} />

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Community Forecasts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockForecasts.map((forecast) => (
            <DetailedForecastCard key={forecast.id} forecast={forecast} />
          ))}
        </div>
      </div>
    </motion.div>
  )

  const IntroductionSection = () => {
    const [activeFeature, setActiveFeature] = useState(0)
    const [showDemo, setShowDemo] = useState(false)
    const [demoStep, setDemoStep] = useState(0)
    const [hoveredStat, setHoveredStat] = useState<number | null>(null)
    const [activeWalkthroughStep, setActiveWalkthroughStep] = useState(0)
    const [walkthroughProgress, setWalkthroughProgress] = useState(0)
    const [showWalkthroughDetails, setShowWalkthroughDetails] = useState(false)

    // Enhanced features for What is this Hub section
    const platformFeatures = [
      {
        icon: Brain,
        title: "AI-Powered Analysis Engine",
        description:
          "Advanced neural networks analyze your trading setups with 97.3% accuracy, identifying hidden confluences and market inefficiencies that professional traders use.",
        stats: { accuracy: "97.3%", speed: "0.3s", confluences: "47+" },
        color: "from-purple-500 to-violet-600",
      },
      {
        icon: Shield,
        title: "Institutional-Grade Security",
        description:
          "Bank-level encryption and data protection protocols ensure your trading strategies and personal information remain completely secure and confidential.",
        stats: { encryption: "AES-256", uptime: "99.9%", compliance: "SOC2" },
        color: "from-emerald-500 to-teal-600",
      },
      {
        icon: Users,
        title: "Elite Trading Community",
        description:
          "Connect with verified institutional traders, hedge fund analysts, and market makers. Share insights, receive feedback, and accelerate your trading evolution.",
        stats: { members: "12,847", countries: "94", success: "89%" },
        color: "from-blue-500 to-cyan-600",
      },
      {
        icon: TrendingUp,
        title: "Real-Time Market Intelligence",
        description:
          "Live market analysis, confluence detection, and performance tracking with institutional-grade tools used by professional trading desks worldwide.",
        stats: { updates: "Real-time", markets: "150+", alerts: "24/7" },
        color: "from-amber-500 to-orange-600",
      },
    ]

    // Platform statistics with live updating animation
    const platformStats = [
      { label: "Total Forecasts", value: "2,847,392", change: "+24.7%", icon: BarChart3 },
      { label: "Success Rate", value: "89.3%", change: "+2.1%", icon: Target },
      { label: "Active Traders", value: "12,847", change: "+15.8%", icon: Users },
      { label: "Daily Analysis", value: "47,293", change: "+31.2%", icon: Activity },
    ]

    const walkthroughSteps = [
      {
        title: "Upload Multiple Timeframes",
        description:
          "Drag & drop your higher timeframe, main analysis, and lower timeframe charts for comprehensive AI analysis",
        time: "30-45 seconds",
        difficulty: "Beginner",
        tips: [
          "Use clear, high-resolution screenshots (1920x1080 recommended)",
          "Include at least 3 timeframes: Higher TF context, Main analysis, Lower TF entry",
          "Ensure all key levels and confluences are visible in your charts",
        ],
        commonMistakes: [
          "Uploading blurry or low-resolution images",
          "Missing key timeframes for context",
          "Charts with cluttered indicators that obscure price action",
        ],
        preview: "Interactive chart upload interface with drag-and-drop zones",
        visualDemo: {
          type: "upload",
          steps: [
            "Select files or drag charts into upload zones",
            "AI automatically detects timeframes and instruments",
            "Preview uploaded charts with quality validation",
            "Confirm chart order and proceed to analysis",
          ],
        },
        bestPractices: [
          "Clean charts with minimal indicators work best",
          "Mark your key levels before uploading",
          "Use consistent chart themes for better AI recognition",
        ],
      },
      {
        title: "AI Confluence Detection & Analysis",
        description:
          "Advanced AI analyzes your setup and identifies key confluences with institutional-grade precision",
        time: "15-30 seconds",
        difficulty: "Automatic",
        tips: [
          "Review AI suggestions carefully - they're based on institutional patterns",
          "Add your own confluence observations to enhance the analysis",
          "Pay attention to confluence strength ratings (0-100 scale)",
        ],
        commonMistakes: [
          "Ignoring AI-detected confluences without proper review",
          "Not adding personal confluence observations",
          "Misunderstanding confluence strength ratings",
        ],
        preview: "Real-time confluence analysis with confidence scores and visual overlays",
        visualDemo: {
          type: "analysis",
          steps: [
            "AI scans charts for institutional patterns",
            "Confluence detection with strength ratings",
            "Visual overlay of detected levels and zones",
            "Detailed analysis report generation",
          ],
        },
        bestPractices: [
          "Cross-reference AI findings with your own analysis",
          "Focus on confluences with 80+ strength ratings",
          "Document why you agree or disagree with AI suggestions",
        ],
      },
      {
        title: "Community Collaboration & Feedback",
        description:
          "Share with verified traders and receive institutional-grade feedback from global trading community",
        time: "Ongoing engagement",
        difficulty: "Intermediate",
        tips: [
          "Engage constructively with community feedback",
          "Ask specific questions to get targeted advice",
          "Share your thought process behind key decisions",
        ],
        commonMistakes: [
          "Not responding to valuable feedback",
          "Being defensive about analysis critiques",
          "Sharing incomplete or unclear analysis",
        ],
        preview: "Community feed with interactive forecast cards and real-time engagement",
        visualDemo: {
          type: "community",
          steps: [
            "Forecast appears in community feed",
            "Traders provide detailed feedback and suggestions",
            "Interactive discussions on analysis approach",
            "Collaborative learning and skill development",
          ],
        },
        bestPractices: [
          "Be open to different perspectives and approaches",
          "Provide detailed explanations of your analysis",
          "Learn from higher-ranked community members",
        ],
      },
      {
        title: "Performance Tracking & Improvement",
        description:
          "Monitor your forecast accuracy and climb the global leaderboards while tracking detailed performance metrics",
        time: "Continuous monitoring",
        difficulty: "Advanced",
        tips: [
          "Track your progress across different market conditions",
          "Identify patterns in your successful vs unsuccessful forecasts",
          "Use performance data to refine your trading approach",
        ],
        commonMistakes: [
          "Focusing only on win rate without considering risk-reward",
          "Not analyzing failed forecasts for learning opportunities",
          "Ignoring performance trends and patterns",
        ],
        preview: "Comprehensive analytics dashboard with performance metrics and improvement suggestions",
        visualDemo: {
          type: "tracking",
          steps: [
            "Real-time performance metrics update",
            "Detailed analytics and trend analysis",
            "Leaderboard position and ranking changes",
            "Personalized improvement recommendations",
          ],
        },
        bestPractices: [
          "Review performance weekly to identify trends",
          "Focus on consistent improvement over short-term wins",
          "Use analytics to identify your strongest market conditions",
        ],
      },
    ]

    useEffect(() => {
      const interval = setInterval(() => {
        setWalkthroughProgress((prev) => {
          const newProgress = (prev + 1) % 101
          if (newProgress === 0) {
            setActiveWalkthroughStep((prevStep) => (prevStep + 1) % walkthroughSteps.length)
          }
          return newProgress
        })
      }, 50)
      return () => clearInterval(interval)
    }, [])

    // Auto-rotate features
    useEffect(() => {
      const interval = setInterval(() => {
        setActiveFeature((prev) => (prev + 1) % platformFeatures.length)
      }, 4000)
      return () => clearInterval(interval)
    }, [])

    // Demo progression
    useEffect(() => {
      if (showDemo) {
        const interval = setInterval(() => {
          setDemoStep((prev) => (prev + 1) % walkthroughSteps.length)
        }, 3000)
        return () => clearInterval(interval)
      }
    }, [showDemo])

    return (
      <div className="space-y-12">
        {/* Premium Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/30"
            whileHover={{ scale: 1.05 }}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-purple-300">$100M Premium Trading Intelligence</span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Forecast Student
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Collaboration Hub
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            The world's most advanced AI-powered trading intelligence platform. Where aspiring traders evolve into{" "}
            <span className="text-purple-400 font-semibold">institutional-grade professionals</span> through
            cutting-edge technology and elite community collaboration.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={() => setActiveSection("submit")}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold px-8 py-4 text-lg rounded-xl shadow-2xl shadow-purple-500/25"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Start Your Journey
            </Button>
            <Button
              onClick={() => setShowDemo(true)}
              variant="outline"
              className="border-purple-400/50 text-purple-300 hover:bg-purple-500/10 px-8 py-4 text-lg rounded-xl"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">Interactive Step-by-Step Walkthrough</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Master the platform with our comprehensive guided experience featuring visual demonstrations and expert
              tips
            </p>
          </div>

          {/* Interactive Walkthrough Container */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Step Navigation */}
            <div className="lg:col-span-1 space-y-4">
              {walkthroughSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-500 ${
                    activeWalkthroughStep === index
                      ? "border-purple-400/50 bg-gradient-to-r from-purple-500/10 to-blue-500/10 shadow-lg shadow-purple-500/20"
                      : "border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50 hover:bg-slate-700/40"
                  }`}
                  onClick={() => setActiveWalkthroughStep(index)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-3">
                    <motion.div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        activeWalkthroughStep === index ? "bg-purple-500 text-white" : "bg-slate-700 text-zinc-400"
                      }`}
                      animate={activeWalkthroughStep === index ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      {index + 1}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm mb-1">{step.title}</h3>
                      <p className="text-xs text-zinc-400 mb-2">{step.description}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 px-2 py-0.5">
                          {step.time}
                        </Badge>
                        <Badge
                          className={`px-2 py-0.5 ${
                            step.difficulty === "Beginner"
                              ? "bg-green-500/20 text-green-300 border-green-400/30"
                              : step.difficulty === "Intermediate"
                                ? "bg-amber-500/20 text-amber-300 border-amber-400/30"
                                : step.difficulty === "Advanced"
                                  ? "bg-red-500/20 text-red-300 border-red-400/30"
                                  : "bg-blue-500/20 text-blue-300 border-blue-400/30"
                          }`}
                        >
                          {step.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar for Active Step */}
                  {activeWalkthroughStep === index && (
                    <motion.div
                      className="mt-3 w-full h-1 bg-slate-700 rounded-full overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                        style={{ width: `${walkthroughProgress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Visual Demo Panel */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                key={activeWalkthroughStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-slate-900/50 rounded-2xl border border-slate-700/50 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">{walkthroughSteps[activeWalkthroughStep].title}</h3>
                  <Button
                    onClick={() => setShowWalkthroughDetails(!showWalkthroughDetails)}
                    variant="outline"
                    className="border-purple-400/50 text-purple-300 hover:bg-purple-500/10"
                    size="sm"
                  >
                    {showWalkthroughDetails ? "Hide Details" : "Show Details"}
                  </Button>
                </div>

                {/* Visual Demo Area */}
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 mb-6 flex items-center justify-center relative overflow-hidden">
                  <motion.div
                    key={`demo-${activeWalkthroughStep}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4 p-8"
                  >
                    {/* Dynamic Visual Demo Content */}
                    {walkthroughSteps[activeWalkthroughStep].visualDemo.type === "upload" && (
                      <div className="space-y-4">
                        <motion.div
                          className="grid grid-cols-3 gap-4 max-w-md mx-auto"
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border-2 border-dashed border-blue-400/30 flex items-center justify-center">
                            <div className="text-xs text-blue-300 font-medium">Higher TF</div>
                          </div>
                          <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border-2 border-dashed border-purple-400/30 flex items-center justify-center">
                            <div className="text-xs text-purple-300 font-medium">Main TF</div>
                          </div>
                          <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-lg border-2 border-dashed border-emerald-400/30 flex items-center justify-center">
                            <div className="text-xs text-emerald-300 font-medium">Lower TF</div>
                          </div>
                        </motion.div>
                        <p className="text-blue-300 font-medium">Drag & drop your charts or click to browse</p>
                        <div className="flex justify-center gap-2">
                          <Badge className="bg-blue-500/20 text-blue-300">PNG/JPG supported</Badge>
                          <Badge className="bg-emerald-500/20 text-emerald-300">Max 10MB each</Badge>
                        </div>
                      </div>
                    )}

                    {walkthroughSteps[activeWalkthroughStep].visualDemo.type === "analysis" && (
                      <div className="space-y-4">
                        <motion.div
                          className="w-20 h-20 border-4 border-purple-400 border-t-transparent rounded-full mx-auto"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        />
                        <p className="text-purple-300 font-medium">AI analyzing confluences and patterns...</p>
                        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                          <motion.div
                            className="p-3 bg-emerald-500/10 border border-emerald-400/30 rounded-lg"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                          >
                            <div className="text-emerald-300 font-bold text-sm">BPR Rejection</div>
                            <div className="text-emerald-400 text-xs">Strength: 94%</div>
                          </motion.div>
                          <motion.div
                            className="p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
                          >
                            <div className="text-blue-300 font-bold text-sm">Fair Value Gap</div>
                            <div className="text-blue-400 text-xs">Strength: 87%</div>
                          </motion.div>
                          <motion.div
                            className="p-3 bg-amber-500/10 border border-amber-400/30 rounded-lg"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.6 }}
                          >
                            <div className="text-amber-300 font-bold text-sm">Order Block</div>
                            <div className="text-amber-400 text-xs">Strength: 91%</div>
                          </motion.div>
                          <motion.div
                            className="p-3 bg-purple-500/10 border border-purple-400/30 rounded-lg"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.9 }}
                          >
                            <div className="text-purple-300 font-bold text-sm">Liquidity Sweep</div>
                            <div className="text-purple-400 text-xs">Strength: 89%</div>
                          </motion.div>
                        </div>
                      </div>
                    )}

                    {walkthroughSteps[activeWalkthroughStep].visualDemo.type === "community" && (
                      <div className="space-y-4">
                        <motion.div
                          className="flex justify-center gap-3"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <div className="w-10 h-10 bg-emerald-400 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-white" />
                          </div>
                          <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center">
                            <Heart className="w-5 h-5 text-white" />
                          </div>
                        </motion.div>
                        <p className="text-emerald-300 font-medium">Community engaging with your forecast...</p>
                        <div className="space-y-2 max-w-md mx-auto">
                          <motion.div
                            className="p-3 bg-slate-800/50 rounded-lg text-left"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 }}
                          >
                            <div className="text-white font-medium text-sm">@ProTrader_Alex</div>
                            <div className="text-zinc-300 text-xs">
                              "Great confluence analysis! Consider the weekly level at 1.0850"
                            </div>
                          </motion.div>
                          <motion.div
                            className="p-3 bg-slate-800/50 rounded-lg text-left"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.5 }}
                          >
                            <div className="text-white font-medium text-sm">@InstitutionalFlow</div>
                            <div className="text-zinc-300 text-xs">
                              "Solid setup. Watch for NY session liquidity sweep"
                            </div>
                          </motion.div>
                        </div>
                        <div className="flex justify-center gap-4 text-sm">
                          <div className="text-emerald-400">+47 views</div>
                          <div className="text-blue-400">+12 comments</div>
                          <div className="text-purple-400">+8 likes</div>
                        </div>
                      </div>
                    )}

                    {walkthroughSteps[activeWalkthroughStep].visualDemo.type === "tracking" && (
                      <div className="space-y-4">
                        <motion.div
                          className="text-4xl font-bold text-amber-400"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                        >
                          📈 Rank #47 → #32
                        </motion.div>
                        <p className="text-amber-300 font-medium">Performance tracking and ranking update!</p>
                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                          <div className="p-3 bg-emerald-500/10 border border-emerald-400/30 rounded-lg">
                            <div className="text-emerald-400 font-bold text-lg">89.3%</div>
                            <div className="text-emerald-300 text-xs">Accuracy</div>
                          </div>
                          <div className="p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                            <div className="text-blue-400 font-bold text-lg">+247</div>
                            <div className="text-blue-300 text-xs">Points Gained</div>
                          </div>
                          <div className="p-3 bg-purple-500/10 border border-purple-400/30 rounded-lg">
                            <div className="text-purple-400 font-bold text-lg">1:2.4</div>
                            <div className="text-purple-300 text-xs">Avg R:R</div>
                          </div>
                          <div className="p-3 bg-amber-500/10 border border-amber-400/30 rounded-lg">
                            <div className="text-amber-400 font-bold text-lg">73%</div>
                            <div className="text-amber-300 text-xs">Win Rate</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Step Details Panel */}
                <AnimatePresence>
                  {showWalkthroughDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6 overflow-hidden"
                    >
                      {/* Tips Section */}
                      <div className="bg-emerald-500/5 border border-emerald-400/20 rounded-xl p-4">
                        <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Pro Tips
                        </h4>
                        <ul className="space-y-2">
                          {walkthroughSteps[activeWalkthroughStep].tips.map((tip, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="text-emerald-300 text-sm flex items-start gap-2"
                            >
                              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              {tip}
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {/* Common Mistakes Section */}
                      <div className="bg-red-500/5 border border-red-400/20 rounded-xl p-4">
                        <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                          <X className="w-4 h-4" />
                          Common Mistakes to Avoid
                        </h4>
                        <ul className="space-y-2">
                          {walkthroughSteps[activeWalkthroughStep].commonMistakes.map((mistake, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="text-red-300 text-sm flex items-start gap-2"
                            >
                              <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              {mistake}
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {/* Best Practices Section */}
                      <div className="bg-purple-500/5 border border-purple-400/20 rounded-xl p-4">
                        <h4 className="text-purple-400 font-semibold mb-3 flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          Best Practices
                        </h4>
                        <ul className="space-y-2">
                          {walkthroughSteps[activeWalkthroughStep].bestPractices.map((practice, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="text-purple-300 text-sm flex items-start gap-2"
                            >
                              <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              {practice}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced What is this Hub Section */}

        {/* Platform Statistics */}

        {/* Demo Modal */}
        <AnimatePresence>
          {showDemo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
              onClick={() => setShowDemo(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-slate-900/95 backdrop-blur-2xl border border-purple-500/30 rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Play className="w-8 h-8 text-purple-400" />
                    Interactive Platform Demo
                  </h2>
                  <Button onClick={() => setShowDemo(false)} variant="ghost" className="text-zinc-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </Button>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Demo Steps */}
                  <div className="space-y-4">
                    {walkthroughSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        className={`p-6 rounded-2xl border transition-all duration-500 ${
                          demoStep === index
                            ? "border-purple-400/50 bg-purple-500/10"
                            : "border-slate-700/50 bg-slate-800/30"
                        }`}
                        animate={demoStep === index ? { scale: 1.02, x: 10 } : { scale: 1, x: 0 }}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              demoStep === index ? "bg-purple-500 text-white" : "bg-slate-700 text-zinc-400"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                            <p className="text-sm text-purple-400">~{step.time}</p>
                          </div>
                        </div>
                        <p className="text-zinc-300 mb-3">{step.description}</p>
                        <div className="text-xs text-emerald-400 bg-emerald-500/10 rounded-lg p-2">
                          💡 {step.tips[0]}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Live Demo Visualization */}
                  <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 text-center">Live Demo Preview</h3>
                    <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 flex items-center justify-center relative overflow-hidden">
                      <motion.div
                        key={demoStep}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-4"
                      >
                        {demoStep === 0 && (
                          <div className="space-y-4">
                            <motion.div
                              className="grid grid-cols-3 gap-2 max-w-xs mx-auto"
                              animate={{ y: [0, -10, 0] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded border border-blue-400/30" />
                              <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded border border-purple-400/30" />
                              <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded border border-emerald-400/30" />
                            </motion.div>
                            <p className="text-blue-300 font-medium">Uploading multiple timeframes...</p>
                          </div>
                        )}
                        {demoStep === 1 && (
                          <div className="space-y-4">
                            <motion.div
                              className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full mx-auto"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            />
                            <p className="text-purple-300 font-medium">AI analyzing confluences...</p>
                            <div className="flex justify-center gap-2">
                              <Badge className="bg-emerald-500/20 text-emerald-300">BPR: 94%</Badge>
                              <Badge className="bg-blue-500/20 text-blue-300">FVG: 87%</Badge>
                              <Badge className="bg-amber-500/20 text-amber-300">OB: 91%</Badge>
                            </div>
                          </div>
                        )}
                        {demoStep === 2 && (
                          <div className="space-y-4">
                            <motion.div
                              className="flex justify-center gap-2"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-white" />
                              </div>
                              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                                <MessageCircle className="w-4 h-4 text-white" />
                              </div>
                              <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
                                <Heart className="w-4 h-4 text-white" />
                              </div>
                            </motion.div>
                            <p className="text-emerald-300 font-medium">Community engaging...</p>
                            <div className="text-sm text-zinc-400">+47 views • +12 comments • +8 likes</div>
                          </div>
                        )}
                        {demoStep === 3 && (
                          <div className="space-y-4">
                            <motion.div
                              className="text-4xl font-bold text-amber-400"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                            >
                              📈 Rank #47
                            </motion.div>
                            <p className="text-amber-300 font-medium">Performance tracking active!</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-emerald-400 font-bold">89.3%</div>
                                <div className="text-zinc-400">Accuracy</div>
                              </div>
                              <div>
                                <div className="text-blue-400 font-bold">+247</div>
                                <div className="text-zinc-400">Points</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-zinc-400">{walkthroughSteps[demoStep].preview}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="flex justify-center mt-8 gap-2">
                  {walkthroughSteps.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`w-3 h-3 rounded-full cursor-pointer ${
                        demoStep === index ? "bg-purple-400" : "bg-slate-600"
                      }`}
                      animate={demoStep === index ? { scale: 1.3 } : { scale: 1 }}
                      onClick={() => setDemoStep(index)}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  const EnhancedLeaderboardSection = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3 digital-display">
          <Trophy className="w-8 h-8 text-amber-400" />
          Premium Leaderboard
        </h2>
        <Badge className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-400/30 px-4 py-2 liquid-glass-button">
          $442M Elite System
        </Badge>
      </div>

      {/* Top Performers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {mockLeaderboard.map((entry, index) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="group relative cursor-pointer"
            whileHover={{
              scale: 1.05,
              rotateY: 5,
              z: 50,
              transition: { duration: 0.3 },
            }}
          >
            {/* Rank Badge */}
            <div className="absolute -top-3 -right-3 z-20">
              <motion.div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-2xl",
                  entry.rank === 1 && "bg-gradient-to-br from-amber-400 to-yellow-500 text-black",
                  entry.rank === 2 && "bg-gradient-to-br from-gray-300 to-gray-400 text-black",
                  entry.rank === 3 && "bg-gradient-to-br from-amber-600 to-orange-500 text-white",
                  entry.rank > 3 && "bg-gradient-to-br from-purple-500 to-blue-500 text-white",
                )}
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                  scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                }}
              >
                #{entry.rank}
              </motion.div>
            </div>

            {/* Main Card */}
            <div className="premium-glass-card p-6 h-full relative overflow-hidden ultra-premium-scenario-card">
              {/* Floating Particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-purple-400/40 rounded-full"
                    animate={{
                      x: [0, Math.random() * 200, 0],
                      y: [0, Math.random() * 150, 0],
                      opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                      duration: 4 + Math.random() * 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: Math.random() * 2,
                    }}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </div>

              {/* Glass Sweep Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 2,
                  ease: "easeInOut",
                }}
              />

              {/* Profile Section */}
              <div className="relative z-10 flex items-center gap-4 mb-6">
                <motion.div className="relative" whileHover={{ scale: 1.1, rotate: 5 }}>
                  <Image
                    src={entry.avatar || "/placeholder.svg"}
                    alt={entry.student}
                    width={64}
                    height={64}
                    className="rounded-full border-3 border-purple-400/50 shadow-lg"
                  />
                  <motion.div
                    className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-black"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                </motion.div>
                <div>
                  <h3 className="font-bold text-white text-lg">{entry.student}</h3>
                  <Badge
                    className={cn(
                      "text-xs px-2 py-1",
                      entry.badge === "Diamond" && "bg-cyan-500/20 text-cyan-300 border-cyan-400/30",
                      entry.badge === "Platinum" && "bg-gray-300/20 text-gray-300 border-gray-400/30",
                      entry.badge === "Gold" && "bg-amber-500/20 text-amber-300 border-amber-400/30",
                    )}
                  >
                    {entry.badge}
                  </Badge>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
                <motion.div
                  className="text-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/30"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl font-bold text-emerald-400">{entry.accuracy}%</div>
                  <div className="text-xs text-emerald-300">Accuracy</div>
                </motion.div>
                <motion.div
                  className="text-center p-3 rounded-xl bg-blue-500/10 border border-blue-400/30"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl font-bold text-blue-400">{entry.winRate}%</div>
                  <div className="text-xs text-blue-300">Win Rate</div>
                </motion.div>
              </div>

              {/* Stats */}
              <div className="relative z-10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Total Forecasts</span>
                  <span className="font-bold text-white">{entry.totalForecasts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Points</span>
                  <span className="font-bold text-purple-400">{entry.points.toLocaleString()}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative z-10 mt-4">
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(entry.points / 3000) * 100}%` }}
                    transition={{ duration: 1.5, delay: index * 0.2 }}
                  />
                </div>
                <div className="text-xs text-zinc-400 mt-1 text-center">Progress to next tier</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="premium-glass-card p-6 text-center ultra-premium-scenario-card"
        >
          <div className="text-3xl font-bold text-emerald-400 mb-2">2,847</div>
          <div className="text-sm text-zinc-400">Total Active Traders</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="premium-glass-card p-6 text-center ultra-premium-scenario-card"
        >
          <div className="text-3xl font-bold text-blue-400 mb-2">12,394</div>
          <div className="text-sm text-zinc-400">Forecasts This Month</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="premium-glass-card p-6 text-center ultra-premium-scenario-card"
        >
          <div className="text-3xl font-bold text-purple-400 mb-2">87.3%</div>
          <div className="text-sm text-zinc-400">Community Accuracy</div>
        </motion.div>
      </div>
    </motion.div>
  )

  const LeaderboardSection = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      {/* Replaced basic leaderboard with premium leaderboard component */}
      <PremiumLeaderboard />
    </motion.div>
  )

  const WeeklySection = () => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 digital-display">
          <Calendar className="w-6 h-6 text-purple-400" />
          This Week's Forecast Archive
        </h2>
      </div>
      <ForecastHistoryPanel />
    </motion.div>
  )

  const handleSectionChange = useCallback((section: "intro" | "submit" | "history" | "leaderboard" | "weekly") => {
    setActiveSection(section)
  }, [])

  const handleShowGuide = useCallback(() => {
    setShowGuide(true)
  }, [])

  const handleCloseGuide = useCallback(() => {
    setShowGuide(false)
  }, [])

  const handleShowCreateForecast = useCallback(() => {
    setShowCreateForecast(true)
  }, [])

  const handleCloseCreateForecast = useCallback((open: boolean) => {
    setShowCreateForecast(open)
  }, [])

  const navItems = useMemo(
    () => [
      { id: "submit", label: "SUBMIT FORECAST", icon: Upload, subtitle: "Create new forecast analysis" },
      { id: "intro", label: "Introduction", icon: BookOpen, subtitle: "Getting started guide" },
      { id: "history", label: "History", icon: History, subtitle: "View past forecasts" },
      { id: "leaderboard", label: "Leaderboard", icon: Trophy, subtitle: "Top performing traders" },
      { id: "weekly", label: "This Week Forecast", icon: Calendar, subtitle: "Weekly forecast archive" },
    ],
    [],
  )

  const PremiumNavigationMenu = useMemo(() => {
    const NavigationComponent = () => {
      const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
      const [hoveredItem, setHoveredItem] = useState<string | null>(null)

      const handleMouseMove = useCallback((e: React.MouseEvent, itemId: string) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setMousePosition({ x, y })
      }, [])

      const handleMouseEnter = useCallback((itemId: string) => {
        setHoveredItem(itemId)
      }, [])

      const handleMouseLeave = useCallback(() => {
        setHoveredItem(null)
      }, [])

      return (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 p-3 rounded-3xl backdrop-blur-3xl shadow-lg shadow-purple-500/10 bg-gradient-to-r from-black/20 via-black/10 to-transparent border border-purple-400/20 gpu-accelerated"
          style={{ marginTop: "12vh" }}
        >
          {navItems.map(({ id, label, icon: Icon, subtitle }) => (
            <motion.div
              key={id}
              className="relative select-none rounded-2xl p-4 mx-1 overflow-hidden cursor-pointer performance-critical"
              style={{
                background:
                  activeSection === id
                    ? "linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)"
                    : "linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border:
                  activeSection === id ? "1px solid rgba(147, 51, 234, 0.3)" : "1px solid rgba(255, 255, 255, 0.1)",
                transformStyle: "preserve-3d",
              }}
              onMouseMove={(e) => handleMouseMove(e, id)}
              onMouseEnter={() => handleMouseEnter(id)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleSectionChange(id as any)}
              whileHover={{
                scale: 1.05,
                rotateX: 2,
                rotateY: 2,
                transition: { duration: 0.15 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Active indicator */}
              {activeSection === id && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full bg-gradient-to-b from-purple-400/80 to-purple-600/80"
                />
              )}

              {/* Hover glow effect */}
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200"
                style={{
                  background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.06), rgba(147, 51, 234, 0.02) 40%, transparent 70%)`,
                  opacity: hoveredItem === id ? 1 : 0,
                }}
              />

              {/* Glass sweep effect */}
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0"
                style={{
                  background: "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)",
                  transform: hoveredItem === id ? "translateX(100%)" : "translateX(-100%)",
                  transition: "transform 0.6s ease-in-out, opacity 0.2s ease",
                  opacity: hoveredItem === id ? 1 : 0,
                }}
              />

              {/* Content */}
              <div className="relative z-10 flex items-center gap-3">
                <motion.div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-150",
                    "backdrop-blur-sm border border-white/10",
                    "bg-gradient-to-br from-white/5 via-transparent to-white/5",
                    hoveredItem === id &&
                      "border-purple-400/30 bg-gradient-to-br from-purple-500/20 via-purple-400/10 to-transparent",
                    "shadow-lg shadow-black/20",
                  )}
                  whileHover={{
                    scale: 1.1,
                    rotateY: 5,
                    transition: { duration: 0.15 },
                  }}
                >
                  <Icon
                    className={cn(
                      "w-6 h-6 transition-all duration-150",
                      activeSection === id ? "text-purple-300" : "text-white/80",
                      hoveredItem === id && "text-purple-300 drop-shadow-[0_0_8px_rgba(147,51,234,0.15)]",
                    )}
                  />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <motion.p
                    className={cn(
                      "font-semibold text-sm whitespace-nowrap truncate transition-all duration-150",
                      activeSection === id ? "text-white" : "text-white/90",
                      hoveredItem === id && "text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.075)]",
                    )}
                    whileHover={{ x: 2 }}
                  >
                    {label}
                  </motion.p>
                  <motion.p
                    className={cn(
                      "text-xs transition-colors duration-150 truncate",
                      activeSection === id ? "text-purple-300/80" : "text-purple-300/60",
                      hoveredItem === id && "text-purple-300/90",
                    )}
                    whileHover={{ x: 2 }}
                  >
                    {subtitle}
                  </motion.p>
                </div>
              </div>

              {/* Enhanced shadow on hover */}
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200"
                style={{
                  opacity: hoveredItem === id ? 1 : 0,
                  boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(147, 51, 234, 0.1)`,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      )
    }
    return NavigationComponent
  }, [activeSection, navItems, handleSectionChange])

  const mockWeeklyForecasts = [
    {
      date: 10,
      forecasts: [
        {
          author: "Alex",
          pair: "EURUSD",
          direction: "LONG",
          accuracy: 85,
          level: "Advanced",
          likes: 22,
          views: 147,
          confluences: ["BPR Rejection", "DXY Weakness", "Institutional Flow"],
        },
        {
          author: "Sarah",
          pair: "GBPJPY",
          direction: "SHORT",
          accuracy: 78,
          level: "Intermediate",
          likes: 15,
          views: 92,
          confluences: ["RSI Divergence", "Volume Profile", "Resistance Zone"],
        },
      ],
    },
    {
      date: 11,
      forecasts: [
        {
          author: "David",
          pair: "XAUUSD",
          direction: "LONG",
          accuracy: 91,
          level: "Expert",
          likes: 35,
          views: 284,
          confluences: ["Break of Structure", "Liquidity Sweep", "Order Block"],
        },
      ],
    },
    {
      date: 12,
      forecasts: [
        {
          author: "Emma",
          pair: "USDJPY",
          direction: "SHORT",
          accuracy: 82,
          level: "Advanced",
          likes: 29,
          views: 211,
          confluences: ["Resistance Zone", "DXY Strength", "Risk Off Sentiment"],
        },
        {
          author: "James",
          pair: "ETHUSD",
          direction: "LONG",
          accuracy: 75,
          level: "Intermediate",
          likes: 21,
          views: 155,
          confluences: ["Central Bank Policy", "Technical Breakout", "Momentum"],
        },
      ],
    },
    {
      date: 13,
      forecasts: [
        {
          author: "Olivia",
          pair: "AUDUSD",
          direction: "SHORT",
          accuracy: 88,
          level: "Expert",
          likes: 31,
          views: 245,
          confluences: ["Relative Strength", "Volume Increase", "Support Hold"],
        },
      ],
    },
    {
      date: 14,
      forecasts: [
        {
          author: "Daniel",
          pair: "NZDUSD",
          direction: "LONG",
          accuracy: 94,
          level: "Advanced",
          likes: 38,
          views: 312,
          confluences: ["BPR Rejection", "DXY Weakness", "Institutional Flow"],
        },
        {
          author: "Sophia",
          pair: "EURGBP",
          direction: "SHORT",
          accuracy: 79,
          level: "Intermediate",
          likes: 18,
          views: 112,
          confluences: ["RSI Divergence", "Volume Profile", "Resistance Zone"],
        },
        {
          author: "Matthew",
          pair: "GBPAUD",
          direction: "LONG",
          accuracy: 86,
          level: "Expert",
          likes: 27,
          views: 198,
          confluences: ["Break of Structure", "Liquidity Sweep", "Order Block"],
        },
      ],
    },
    {
      date: 15,
      forecasts: [
        {
          author: "Isabella",
          pair: "USDCHF",
          direction: "SHORT",
          accuracy: 81,
          level: "Advanced",
          likes: 24,
          views: 176,
          confluences: ["Resistance Zone", "DXY Strength", "Risk Off Sentiment"],
        },
      ],
    },
    {
      date: 16,
      forecasts: [
        {
          author: "Ethan",
          pair: "USDCAD",
          direction: "LONG",
          accuracy: 77,
          level: "Intermediate",
          likes: 16,
          views: 101,
          confluences: ["Central Bank Policy", "Technical Breakout", "Momentum"],
        },
        {
          author: "Ava",
          pair: "EURJPY",
          direction: "SHORT",
          accuracy: 90,
          level: "Expert",
          likes: 33,
          views: 267,
          confluences: ["Relative Strength", "Volume Increase", "Support Hold"],
        },
      ],
    },
  ]

  const getDayForecasts = (date: number) => {
    const dayData = mockWeeklyForecasts.find((item) => item.date === date)
    return dayData ? dayData.forecasts : []
  }

  const getDateString = (date: number) => {
    return `May ${date}`
  }

  const getDayName = (index: number) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return days[index]
  }

  return (
    <div className="bg-[#0c0c10] min-h-screen h-[100dvh] flex flex-col relative z-0 overflow-y-auto">
      {/* Background Effects */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-900/5 via-transparent to-blue-900/5 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_50%)] tracking-normal pointer-events-none"
      />

      <div className="max-w-screen-2xl mx-auto w-full flex flex-col min-h-0 h-full relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Floating Nav Spacer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="h-[40px] flex-shrink-0"
        />

        {/* Enhanced Navigation Menu */}
        <motion.nav
          className="flex justify-center items-center gap-2 px-8 py-4 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          {[
            {
              key: "submit",
              icon: Upload,
              label: "SUBMIT FORECAST",
              subtitle: "Create new forecast analysis",
              action: () => setShowCreateForecast(true),
            },
            {
              key: "intro",
              icon: BookOpen,
              label: "Introduction",
              subtitle: "Getting started guide",
              action: () => handleSectionChange("intro"),
            },
            {
              key: "history",
              icon: History,
              label: "History",
              subtitle: "View past forecasts",
              action: () => handleSectionChange("history"),
            },
            {
              key: "leaderboard",
              icon: Trophy,
              label: "Leaderboard",
              subtitle: "Top performing traders",
              action: () => handleSectionChange("leaderboard"),
            },
            {
              key: "weekly",
              icon: Calendar,
              label: "This Week Forecast",
              subtitle: "Weekly forecast archive",
              action: () => handleSectionChange("weekly"),
            },
          ].map((item, index) => (
            <motion.div
              key={item.key}
              className="relative"
              onMouseEnter={item.key === "weekly" ? handleWeeklyHoverEnter : undefined}
              onMouseLeave={item.key === "weekly" ? handleWeeklyHoverLeave : undefined}
            >
              <motion.button
                onClick={item.action}
                className={cn(
                  "relative px-6 py-4 rounded-2xl border-2 transition-all duration-300 group overflow-hidden",
                  item.key === "weekly"
                    ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border-emerald-400/30 hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-500/20"
                    : "bg-slate-900/80 backdrop-blur-xl border-purple-400/20 hover:bg-slate-800/90 hover:border-purple-400/40 hover:shadow-2xl hover:shadow-purple-500/20",
                  (activeSection === item.key || (item.key === "submit" && showCreateForecast)) &&
                    "bg-gradient-to-r from-purple-600/30 to-blue-600/30 border-purple-400/60 shadow-xl shadow-purple-500/20",
                )}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Glass Sweep Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />

                <div className="relative z-10 flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 group-hover:text-purple-300",
                        item.key === "weekly" ? "text-emerald-400" : "text-purple-400",
                      )}
                    />
                  </motion.div>
                  <div className="text-left">
                    <div className="font-bold text-white group-hover:text-purple-100 text-sm">{item.label}</div>
                    <div className="text-xs text-zinc-400 group-hover:text-zinc-300">{item.subtitle}</div>
                  </div>
                </div>
              </motion.button>

              {item.key === "weekly" && showWeeklyCalendar && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 z-50 w-[480px] pointer-events-auto"
                  onMouseEnter={handleWeeklyHoverEnter}
                  onMouseLeave={handleWeeklyHoverLeave}
                  style={{ pointerEvents: "auto" }}
                >
                  <div className="premium-glass-card p-6 border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 bg-slate-900/95 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-400/30">
                          <Calendar className="w-5 h-5 text-emerald-400" />
                        </div>
                        This Week's Forecast Archive
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowWeeklyCalendar(false)}
                        className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-slate-600/50 hover:border-slate-500/70 transition-all duration-200"
                      >
                        <X className="w-4 h-4 text-slate-400 hover:text-white" />
                      </motion.button>
                    </div>

                    <div className="text-sm text-emerald-300 mb-4 font-medium">
                      5 forecasts • Premium AI Analysis System
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-7 gap-2 text-xs text-center text-emerald-300 font-semibold">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                          <div key={day} className="p-2 rounded-md bg-slate-800/50">
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-2 relative">
                        {[10, 11, 12, 13, 14, 15, 16].map((date, index) => {
                          const dayForecasts = getDayForecasts(date)
                          const hasForecasts = dayForecasts.length > 0

                          return (
                            <div key={date} className="relative">
                              <motion.div
                                whileHover={{ scale: hasForecasts ? 1.1 : 1.05 }}
                                className={cn(
                                  "aspect-square rounded-xl border-2 flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-300 relative overflow-hidden",
                                  date === 14
                                    ? "bg-gradient-to-br from-purple-500/40 to-purple-600/40 text-purple-100 border-purple-400/60 shadow-lg shadow-purple-500/25"
                                    : hasForecasts
                                      ? "bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 text-emerald-100 border-emerald-400/50 hover:border-emerald-400/80 hover:bg-emerald-500/30"
                                      : "bg-gradient-to-br from-slate-800/80 to-slate-700/80 text-slate-400 border-slate-600/30 hover:border-slate-500/60 hover:bg-slate-700/60",
                                )}
                                onMouseEnter={() => {
                                  if (hasForecasts) {
                                    handleDayHoverEnter(date, dayForecasts)
                                  }
                                }}
                                onMouseLeave={handleDayHoverLeave}
                              >
                                {date === 14 && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent animate-pulse" />
                                )}
                                <span className="relative z-10">{date}</span>
                                {hasForecasts && (
                                  <div className="absolute bottom-1 right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                )}
                                {hasForecasts && (
                                  <div className="absolute top-1 left-1 text-[10px] font-bold text-emerald-300">
                                    {dayForecasts.length}
                                  </div>
                                )}
                              </motion.div>

                              {hoveredDay === date && hasForecasts && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                  transition={{ duration: 0.2, ease: "easeOut" }}
                                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-[70] w-72 pointer-events-auto"
                                  onMouseEnter={() => handleDayHoverEnter(date, dayForecasts)}
                                  onMouseLeave={handleDayHoverLeave}
                                >
                                  <div className="bg-slate-900/98 backdrop-blur-xl border border-emerald-400/40 rounded-xl shadow-2xl shadow-emerald-500/20 p-4">
                                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-slate-900/98 border-l border-t border-emerald-400/40 rotate-45 backdrop-blur-xl"></div>

                                    <div className="relative z-10">
                                      <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                          {getDateString(date)} Forecasts ({dayForecasts.length})
                                        </h4>
                                        <div className="text-xs text-slate-400 bg-slate-800/60 px-2 py-1 rounded-md">
                                          {getDayName(index)}
                                        </div>
                                      </div>

                                      <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                        {dayForecasts.map((forecast, idx) => (
                                          <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 hover:border-emerald-400/30 hover:bg-slate-800/80 transition-all duration-200 group"
                                          >
                                            <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                                                  <span className="text-xs font-bold text-emerald-300">
                                                    {forecast.author.charAt(0)}
                                                  </span>
                                                </div>
                                                <div>
                                                  <div className="text-sm font-semibold text-white group-hover:text-emerald-100">
                                                    {forecast.author}
                                                  </div>
                                                  <div className="text-xs text-slate-400">{forecast.level}</div>
                                                </div>
                                              </div>
                                              <div className="text-right">
                                                <div className="text-sm font-bold text-emerald-300">
                                                  {forecast.accuracy}%
                                                </div>
                                                <div className="text-xs text-slate-400">accuracy</div>
                                              </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-white">{forecast.pair}</span>
                                                <span
                                                  className={cn(
                                                    "text-xs px-2 py-1 rounded-md font-semibold",
                                                    forecast.direction === "LONG"
                                                      ? "bg-green-500/20 text-green-300 border border-green-400/30"
                                                      : "bg-red-500/20 text-red-300 border border-red-400/30",
                                                  )}
                                                >
                                                  {forecast.direction}
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Heart className="w-3 h-3" />
                                                <span>{forecast.likes}</span>
                                                <Eye className="w-3 h-3 ml-1" />
                                                <span>{forecast.views}</span>
                                              </div>
                                            </div>

                                            {forecast.confluences && (
                                              <div className="mt-2 pt-2 border-t border-slate-700/50">
                                                <div className="text-xs text-slate-400 mb-1">Key Confluences:</div>
                                                <div className="flex flex-wrap gap-1">
                                                  {forecast.confluences.slice(0, 3).map((confluence, cIdx) => (
                                                    <span
                                                      key={cIdx}
                                                      className="text-xs bg-emerald-500/10 text-emerald-300 px-2 py-1 rounded-md border border-emerald-400/20"
                                                    >
                                                      {confluence}
                                                    </span>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </motion.div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-4">
                      {[
                        { label: "Total Forecasts", value: "5", color: "emerald" },
                        { label: "Avg Accuracy", value: "88%", color: "purple" },
                        { label: "Total Likes", value: "117", color: "blue" },
                      ].map((stat, idx) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={cn(
                            "text-center p-4 rounded-xl border transition-all duration-300 hover:scale-105",
                            stat.color === "emerald" &&
                              "bg-emerald-500/10 border-emerald-400/30 hover:border-emerald-400/50",
                            stat.color === "purple" &&
                              "bg-purple-500/10 border-purple-400/30 hover:border-purple-400/50",
                            stat.color === "blue" && "bg-blue-500/10 border-blue-400/30 hover:border-blue-400/50",
                          )}
                        >
                          <div
                            className={cn(
                              "text-2xl font-bold mb-1",
                              stat.color === "emerald" && "text-emerald-300",
                              stat.color === "purple" && "text-purple-300",
                              stat.color === "blue" && "text-blue-300",
                            )}
                          >
                            {stat.value}
                          </div>
                          <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.nav>

        {activeSection === "intro" && <IntroductionSection />}
        {activeSection === "submit" && <SubmitSection />}
        {activeSection === "history" && <HistorySection />}
        {activeSection === "leaderboard" && <LeaderboardSection />}
        {activeSection === "weekly" && <WeeklySection />}
      </div>

      <ProfessionalGuideModal open={showGuide} onClose={handleCloseGuide} />
      <CreateForecastModal open={showCreateForecast} onOpenChange={handleCloseCreateForecast} />
    </div>
  )
}
