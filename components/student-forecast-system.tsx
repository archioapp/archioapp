"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { LucideCheckCircle, ThumbsUp, Eye, MessageSquare, Brain, TrendingUp, TrendingDown } from "lucide-react"
import { StudentForecastModal } from "./student-forecast-modal"
import { mockForecasts as seedForecasts } from "@/lib/community-data"

// Types for AI commentary and Student Forecast
export type AICommentary = {
  rating: number
  summary: string
  confluenceAnalysis: {
    hit: string[]
    miss: string[]
  }
  executionReview: {
    entry: string
    stopLoss: string
    takeProfit: string
  }
  actionPlan: string[]
}

export type StudentForecast = {
  id: number
  student: string
  level: "Advanced" | "Intermediate" | "Beginner"
  time: string
  status: "SETUP VALID" | "AGGRESSIVE" | "INVALID"
  pair: string
  forecast: string
  chartImage: string
  comments: number
  likes: number
  views: number
  accuracy: number
  winRate: number
  trades: number
  direction: "LONG" | "SHORT"
  timeframe: string
  entry: string
  stop: string
  target: string
  rr: string
  confluences: Array<{ name: string; score: number }>
  commentary: AICommentary
}

// Individual Forecast Card Component
export const ForecastCard = ({ forecast }: { forecast: StudentForecast }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const initials = (forecast.student || "S")
    .split(" ")
    .map((n) => n?.[0] || "")
    .join("")
    .slice(0, 2)

  return (
    <>
      <div
        className="relative group cursor-pointer"
        onMouseEnter={() => setTimeout(() => setIsHovered(true), 150)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
      >
        {/* AI VERIFIED Badge - Top Right Corner */}
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/40 backdrop-blur-sm font-bold text-xs px-3 py-1.5 shadow-lg">
            <LucideCheckCircle className="w-3 h-3 mr-1.5" />
            AI VERIFIED
          </Badge>
        </div>

        {/* Card Container with Dynamic Height */}
        <div
          className={cn(
            "rounded-2xl border border-white/10 bg-black/60 p-6 shadow-2xl shadow-black/40 hover:border-purple-400/50 hover:shadow-purple-500/10",
            "transform-gpu will-change-transform transition-all duration-700 ease-in-out",
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
              <Avatar className="w-12 h-12 border-2 border-white/20 shadow-lg">
                <AvatarImage src={forecast.chartImage || "/placeholder.svg?height=48&width=48&query=student-avatar"} />
                <AvatarFallback className="bg-gradient-to-br from-zinc-800 to-zinc-900 text-white font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse" />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-white text-lg leading-tight">{forecast.student}</h3>
              <p className="text-sm text-zinc-400">
                {forecast.level} • {forecast.time}
              </p>
            </div>
          </div>

          {/* Default State: Large Chart Image */}
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
                  src={forecast.chartImage || "/placeholder.svg?height=192&width=320&query=trading-chart"}
                  alt={`Chart for ${forecast.pair}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed mb-4">{forecast.forecast}</p>

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
                  <p className="text-2xl font-bold text-cyan-400">{forecast.rr}</p>
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
                  {forecast.pair}
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
                  {forecast.timeframe}
                </Badge>
              </div>

              {/* Trade Levels */}
              <div
                className="grid grid-cols-3 gap-3 mb-6 transition-all duration-500 delay-200"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "translateY(0px)" : "translateY(20px)",
                }}
              >
                <div className="text-center p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg shadow-inner shadow-cyan-500/10">
                  <div className="text-xs text-cyan-400 font-semibold mb-1">ENTRY</div>
                  <div className="text-lg font-bold text-white">{forecast.entry}</div>
                </div>
                <div className="text-center p-3 bg-red-500/10 border border-red-500/30 rounded-lg shadow-inner shadow-red-500/10">
                  <div className="text-xs text-red-400 font-semibold mb-1">STOP</div>
                  <div className="text-lg font-bold text-white">{forecast.stop}</div>
                </div>
                <div className="text-center p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg shadow-inner shadow-emerald-500/10">
                  <div className="text-xs text-emerald-400 font-semibold mb-1">TARGET</div>
                  <div className="text-lg font-bold text-white">{forecast.target}</div>
                </div>
              </div>

              {/* Analysis Summary */}
              <div
                className="mb-6 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-500 delay-250"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "translateY(0px)" : "translateY(20px)",
                }}
              >
                <p className="text-sm text-white leading-relaxed">{forecast.forecast}</p>
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
                  {forecast.confluences?.slice(0, 3).map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-400/30 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <LucideCheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-emerald-300 font-medium">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-700"
                            style={{ width: `${c.score}%` }}
                          />
                        </div>
                        <span className="text-xs text-emerald-400 font-bold w-10 text-right">{c.score}/100</span>
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
                    {forecast.commentary.rating}/10
                  </Badge>
                </div>
                <p className="text-sm text-white leading-relaxed">{forecast.commentary.summary}</p>
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
                  <a
                    href="#"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 hover:text-white transition-colors duration-300"
                  >
                    <ThumbsUp className="w-4 h-4" /> {forecast.likes}
                  </a>
                  <a
                    href="#"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 hover:text-white transition-colors duration-300"
                  >
                    <MessageSquare className="w-4 h-4" /> {forecast.comments}
                  </a>
                  <a
                    href="#"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 hover:text-white transition-colors duration-300"
                  >
                    <Eye className="w-4 h-4" /> {forecast.views}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <StudentForecastModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} forecast={forecast} />
    </>
  )
}

// Normalize raw event data into a StudentForecast
function normalizeForecast(data: any): StudentForecast {
  const confluences: Array<{ name: string; score: number }> = Array.isArray(data?.confluences)
    ? data.confluences.map((c: any) => ({ name: c.name || "Unnamed", score: c.score || 80 }))
    : [
        { name: "BPR Rejection", score: 92 },
        { name: "Institutional Confluence", score: 85 },
        { name: "DXY Strength", score: 78 },
      ]

  const direction = String(data?.trade?.direction || data?.direction || "SHORT").toUpperCase() as "LONG" | "SHORT"

  return {
    id: Number(data?.id) || Date.now(),
    student: data?.user?.name || data?.student || "Samantha Bee",
    level: (data?.level as StudentForecast["level"]) || "Intermediate",
    time: data?.time || "5 hours ago",
    status: (data?.status as StudentForecast["status"]) || "AGGRESSIVE",
    pair: data?.trade?.pair || data?.pair || "GBPUSD",
    forecast:
      data?.trade?.summary ||
      data?.forecast ||
      "GBPUSD Short from 1.3520 - BPR rejection with institutional confluence and DXY strength confirmation",
    chartImage: data?.screenshotUrl || data?.chartImage || "/placeholder.svg?height=320&width=512",
    comments: Number(data?.comments) || 24,
    likes: Number(data?.likes) || 8,
    views: Number(data?.views) || 156,
    accuracy: Number(data?.accuracy) || 89,
    winRate: Number(data?.winRate) || 76,
    trades: Number(data?.trades) || 1,
    direction,
    timeframe: data?.timeframe || "4H",
    entry: data?.entry || "1.3520",
    stop: data?.stop || "1.3580",
    target: data?.target || "1.3420",
    rr: data?.rr || "1:1.7",
    confluences,
    commentary: data?.aiAnalysis ||
      data?.commentary || {
        rating: 8.5,
        summary:
          "Excellent read on institutional flow, aligning with key technical levels for a high-probability setup.",
        confluenceAnalysis: { hit: confluences.map((c) => c.name), miss: [] },
        executionReview: { entry: "Pending", stopLoss: "Pending", takeProfit: "Pending" },
        actionPlan: ["Await community feedback."],
      },
  }
}

// Student Forecast System: lists forecasts and listens for events
export function StudentForecastSystem({ initialForecasts = [] }: { initialForecasts?: StudentForecast[] }) {
  const [forecastList, setForecastList] = useState<StudentForecast[]>([])

  // Seed with initial and mock data once
  useEffect(() => {
    setForecastList(() => {
      const combined = [...initialForecasts, ...seedForecasts]
      const unique = Array.from(new Map(combined.map((f) => [f.id, f])).values())
      return unique.map(normalizeForecast) // Normalize all data
    })
  }, [initialForecasts])

  // Listen for "forecast:created", normalize, then re-broadcast as "forecast:submitted"
  useEffect(() => {
    const handleCreated = (event: Event) => {
      const raw = (event as CustomEvent).detail
      const normalized = normalizeForecast(raw)

      setForecastList((prev) => [normalized, ...prev])

      // Notify downstream listeners (e.g., FloatingCommunityHub, ForecastRoom)
      window.dispatchEvent(new CustomEvent("forecast:submitted", { detail: normalized }))
    }

    window.addEventListener("forecast:created", handleCreated)
    return () => window.removeEventListener("forecast:created", handleCreated)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {forecastList.map((forecast) => (
        <ForecastCard key={forecast.id} forecast={forecast} />
      ))}
    </div>
  )
}

// Also provide a default export to prevent import mismatches in other files.
export default StudentForecastSystem
