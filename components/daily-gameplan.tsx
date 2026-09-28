"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Pin,
  History,
  Target,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Filter,
  Sparkles,
  FileText,
  ArrowUpRight,
  BarChart3,
  Layers,
  X,
  Eye,
  Info,
  Zap,
  Globe,
  DollarSign,
  Activity,
  LineChart,
  ImageIcon,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Types
type Bias = "bullish" | "bearish" | "neutral"
type Status = "active" | "in-play" | "watching" | "completed" | "invalidated"
type ConfidenceLevel = "high" | "medium" | "low"
type ImpactLevel = "high" | "medium" | "low"
type AssetType = "index" | "fx" | "commodity" | "equity"
type WeekFocus = "usd" | "gold" | "risk" // Changed from "risk-on" to "risk"

interface KeyLevel {
  type: "support" | "resistance" | "poi"
  price: string
  label?: string
}

interface MacroEvent {
  id: string
  name: string
  day: string
  impact: ImpactLevel
  description: string
}

interface WeeklyDriver {
  id: string
  symbol: string
  type: AssetType
  bias: Bias
  expectation: string
  keyZones?: string[]
  tags: string[]
  confidence: number
  details: {
    whyThisBias: string[]
    invalidation: string
    whatWouldChange: string
  }
}

interface WeeklyForecast {
  id: string
  instrument: string
  status: Status
  timeframe: string
  chartSnapshot?: string
  htfNotes: string[]
  lastUpdated: string
  mentor: string
  mentorAvatar: string
  // Modal content
  narrative?: string
  keyLevels?: KeyLevel[]
  whatToWatch?: string[]
  scenarios?: { trigger: string; reaction: string }[]
}

interface ForecastCard {
  id: string
  instrument: string
  bias: Bias
  keyLevels: KeyLevel[]
  confidence: ConfidenceLevel
  status: Status
  notes?: string
  mentor: string
  mentorAvatar: string
  createdAt: string
  linkedSignals?: number
}

const MACRO_EVENTS: MacroEvent[] = [
  { id: "e1", name: "FOMC Minutes", day: "Wed", impact: "high", description: "Fed policy direction hints for Q1" },
  { id: "e2", name: "CPI Data", day: "Thu", impact: "high", description: "Inflation print drives USD direction" },
  { id: "e3", name: "Jobless Claims", day: "Thu", impact: "medium", description: "Labor market health indicator" },
  { id: "e4", name: "PPI Data", day: "Fri", impact: "medium", description: "Producer prices feed CPI expectations" },
]

const MACRO_SUMMARY = [
  "USD sensitive to CPI surprise – hot print strengthens dollar",
  "Risk assets waiting for Fed clarity before directional move",
  "Gold inversely correlated to real yields this week",
  "European data light – EUR follows USD lead",
]

const WEEKLY_DRIVERS: WeeklyDriver[] = [
  {
    id: "wd-1",
    symbol: "DXY",
    type: "index",
    bias: "bullish",
    expectation:
      "Expect USD strength early week if CPI prints hot; look for pullbacks to be defended into mid-week. 105.50 is key support.",
    keyZones: ["105.50 support", "106.80 resistance", "105.00 invalidation"],
    tags: ["Rates", "Fed tone", "CPI"],
    confidence: 78,
    details: {
      whyThisBias: [
        "Fed expected to maintain hawkish stance in minutes",
        "CPI consensus points to sticky inflation",
        "Real yields supportive of dollar strength",
      ],
      invalidation: "Close below 105.00 on daily would negate bullish bias",
      whatWouldChange: "Dovish surprise in FOMC minutes or soft CPI print",
    },
  },
  {
    id: "wd-2",
    symbol: "XAU/USD",
    type: "commodity",
    bias: "bearish",
    expectation:
      "Gold under pressure from USD strength. Looking for rallies into 2045-2050 to be sold. Below 2030 opens 2010.",
    keyZones: ["2045-2050 supply", "2030 support", "2010 target"],
    tags: ["Risk-off", "Real yields", "USD inverse"],
    confidence: 72,
    details: {
      whyThisBias: [
        "Dollar strength weighing on precious metals",
        "Real yields expected to rise with hot CPI",
        "ETF outflows continue",
      ],
      invalidation: "Break and hold above 2055 with volume",
      whatWouldChange: "Risk-off spike or dovish Fed surprise",
    },
  },
  {
    id: "wd-3",
    symbol: "EUR/USD",
    type: "fx",
    bias: "bearish",
    expectation: "Rate differential widening favors USD. Shorts from 1.0880-1.0900 supply, targeting 1.0750.",
    keyZones: ["1.0880-1.0900 supply", "1.0820 support", "1.0750 target"],
    tags: ["Rates", "ECB dovish", "USD strength"],
    confidence: 68,
    details: {
      whyThisBias: ["ECB expected to cut before Fed", "European growth concerns persist", "Rate differential widening"],
      invalidation: "Daily close above 1.0920",
      whatWouldChange: "Weak US data or hawkish ECB rhetoric",
    },
  },
  {
    id: "wd-4",
    symbol: "NAS100",
    type: "equity",
    bias: "neutral",
    expectation:
      "Choppy conditions expected before CPI. No clear directional bias until data clarity. Range 18300-18550.",
    keyZones: ["18300 support", "18550 resistance", "ATH 18650"],
    tags: ["CPI", "Earnings", "Liquidity"],
    confidence: 45,
    details: {
      whyThisBias: [
        "Markets waiting for CPI before committing",
        "Earnings season starting to factor in",
        "ATH resistance overhead",
      ],
      invalidation: "Strong move outside 18200-18600 range",
      whatWouldChange: "Clear CPI direction or earnings surprises",
    },
  },
]

const WEEKLY_FORECASTS: WeeklyForecast[] = [
  {
    id: "wf-1",
    instrument: "XAU/USD",
    status: "active",
    timeframe: "WEEKLY",
    htfNotes: ["BOS on daily", "Weekly FVG at 2030", "Supply zone 2045-2050"],
    lastUpdated: "6h ago",
    mentor: "Chen",
    mentorAvatar: "C",
    narrative:
      "Gold showing signs of distribution at weekly highs. The daily BOS suggests continuation lower, with the weekly FVG at 2030 as the first target. Supply zone at 2045-2050 should cap any rallies.",
    keyLevels: [
      { type: "resistance", price: "2048.50", label: "Weekly Supply" },
      { type: "poi", price: "2035.00", label: "OB Mitigation" },
      { type: "support", price: "2030.00", label: "Weekly FVG" },
    ],
    whatToWatch: [
      "Asian session sweep of 2040 before reversal",
      "DXY correlation – inverse relationship",
      "Volume confirmation at supply zone",
      "CPI reaction Thursday",
    ],
    scenarios: [
      { trigger: "If price taps 2045-2050 and rejects", reaction: "Look for shorts targeting 2030" },
      { trigger: "If CPI comes in soft", reaction: "Gold may rally – wait for structure before shorting" },
    ],
  },
  {
    id: "wf-2",
    instrument: "EUR/USD",
    status: "in-play",
    timeframe: "WEEKLY",
    htfNotes: ["H4 supply at 1.0880", "Weekly structure bearish", "FVG fill at 1.0855"],
    lastUpdated: "4h ago",
    mentor: "Alex",
    mentorAvatar: "A",
    narrative:
      "EUR/USD in a clear downtrend on the weekly. The H4 supply at 1.0880 has been respected multiple times. Looking for continuation lower toward 1.0750 weekly target.",
    keyLevels: [
      { type: "resistance", price: "1.0880", label: "H4 Supply" },
      { type: "poi", price: "1.0855", label: "FVG Fill" },
      { type: "support", price: "1.0820", label: "Weekly Low" },
    ],
    whatToWatch: ["DXY strength confirmation", "ECB speakers this week", "US data reactions"],
    scenarios: [
      { trigger: "If price rallies to 1.0880 and rejects", reaction: "Add to shorts, target 1.0750" },
      { trigger: "If breaks above 1.0900", reaction: "Bias invalidated, reassess" },
    ],
  },
  {
    id: "wf-3",
    instrument: "NAS100",
    status: "watching",
    timeframe: "WEEKLY",
    htfNotes: ["Consolidating at ATH", "Daily EQ at 18350", "Waiting for CPI"],
    lastUpdated: "8h ago",
    mentor: "Sophia",
    mentorAvatar: "S",
    narrative:
      "NAS100 in a tight range near all-time highs. No clear directional bias until CPI provides clarity. Trading the range for now.",
    keyLevels: [
      { type: "resistance", price: "18550", label: "ATH Zone" },
      { type: "poi", price: "18425", label: "Range Mid" },
      { type: "support", price: "18350", label: "Daily EQ" },
    ],
    whatToWatch: ["CPI reaction Thursday", "Tech earnings expectations", "VIX compression/expansion"],
    scenarios: [
      { trigger: "If CPI hot and breaks 18300", reaction: "Look for shorts to 18100" },
      { trigger: "If CPI soft and breaks ATH", reaction: "Momentum longs to 18800" },
    ],
  },
  {
    id: "wf-4",
    instrument: "DXY",
    status: "active",
    timeframe: "WEEKLY",
    htfNotes: ["Bullish structure intact", "Support at 105.50", "Targeting 106.80"],
    lastUpdated: "2h ago",
    mentor: "Chen",
    mentorAvatar: "C",
    narrative:
      "DXY maintaining bullish structure. Key support at 105.50 should hold for continuation higher. CPI is the main catalyst this week.",
    keyLevels: [
      { type: "resistance", price: "106.80", label: "Weekly Target" },
      { type: "poi", price: "106.00", label: "Current Level" },
      { type: "support", price: "105.50", label: "Key Support" },
    ],
    whatToWatch: ["CPI print Thursday", "FOMC minutes Wednesday", "Bond yields correlation"],
    scenarios: [
      { trigger: "If CPI hot", reaction: "Expect push to 106.80+" },
      { trigger: "If CPI soft", reaction: "Pullback to 105.50, then reassess" },
    ],
  },
]

const DAILY_FORECASTS: ForecastCard[] = [
  {
    id: "fc-1",
    instrument: "XAU/USD",
    bias: "bullish",
    keyLevels: [
      { type: "support", price: "2030.00", label: "Daily FVG" },
      { type: "resistance", price: "2048.50", label: "Weekly High" },
      { type: "poi", price: "2035.20", label: "OB Mitigation" },
    ],
    confidence: "high",
    status: "active",
    notes: "Looking for sweep of Asian low, then reversal into London. Target weekly high.",
    mentor: "Chen",
    mentorAvatar: "C",
    createdAt: "6:30 AM",
    linkedSignals: 2,
  },
  {
    id: "fc-2",
    instrument: "EUR/USD",
    bias: "bearish",
    keyLevels: [
      { type: "resistance", price: "1.0880", label: "H4 Supply" },
      { type: "support", price: "1.0820", label: "Weekly Low" },
      { type: "poi", price: "1.0855", label: "FVG Fill" },
    ],
    confidence: "medium",
    status: "in-play",
    notes: "DXY strength continues. Short from supply zone rejection.",
    mentor: "Alex",
    mentorAvatar: "A",
    createdAt: "7:15 AM",
    linkedSignals: 1,
  },
  {
    id: "fc-3",
    instrument: "NAS100",
    bias: "neutral",
    keyLevels: [
      { type: "support", price: "18350", label: "Daily EQ" },
      { type: "resistance", price: "18520", label: "ATH Zone" },
    ],
    confidence: "low",
    status: "watching",
    notes: "Choppy conditions expected before CPI. No clear directional bias.",
    mentor: "Sophia",
    mentorAvatar: "S",
    createdAt: "8:00 AM",
  },
]

// Helper Components
const BiasIndicator = ({ bias, size = "md" }: { bias: Bias; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 text-[8px]",
    md: "w-6 h-6 text-xs",
    lg: "w-8 h-8 text-sm",
  }

  const config = {
    bullish: { icon: TrendingUp, color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    bearish: { icon: TrendingDown, color: "bg-red-500/20 text-red-400 border-red-500/30" },
    neutral: { icon: Minus, color: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
  }

  const Icon = config[bias].icon

  return (
    <div className={`${sizeClasses[size]} rounded-md flex items-center justify-center border ${config[bias].color}`}>
      <Icon className={size === "sm" ? "w-2.5 h-2.5" : size === "md" ? "w-3.5 h-3.5" : "w-4 h-4"} />
    </div>
  )
}

// Helper component for Bias Badge in the new weekly forecast card layout
const BiasBadge = ({ bias, size = "md" }: { bias: Bias; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 text-[8px]",
    md: "w-6 h-6 text-xs",
    lg: "w-8 h-8 text-sm",
  }

  const config = {
    bullish: { label: "Bullish", color: "bg-emerald-500/20 text-emerald-400" },
    bearish: { label: "Bearish", color: "bg-red-500/20 text-red-400" },
    neutral: { label: "Neutral", color: "bg-slate-500/20 text-slate-400" },
  }

  const biasConfig = config[bias] || config.neutral

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase ${biasConfig.color}`}
    >
      {biasConfig.label}
    </span>
  )
}

const StatusBadge = ({ status }: { status: Status }) => {
  const config = {
    active: { icon: Target, color: "bg-emerald-500/20 text-emerald-400", label: "Active" },
    "in-play": { icon: Activity, color: "bg-sky-500/20 text-sky-400", label: "In-Play" },
    watching: { icon: Eye, color: "bg-amber-500/20 text-amber-400", label: "Watching" },
    completed: { icon: CheckCircle2, color: "bg-violet-500/20 text-violet-400", label: "Completed" },
    invalidated: { icon: XCircle, color: "bg-red-500/20 text-red-400", label: "Invalidated" },
  }

  const Icon = config[status].icon

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${config[status].color}`}
    >
      <Icon className="w-3 h-3" />
      {config[status].label}
    </span>
  )
}

const ConfidenceMeter = ({ level }: { level: ConfidenceLevel }) => {
  const bars = level === "high" ? 3 : level === "medium" ? 2 : 1
  const color = level === "high" ? "bg-emerald-400" : level === "medium" ? "bg-amber-400" : "bg-slate-400"

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all ${i <= bars ? color : "bg-white/10"}`}
          style={{ height: 4 + i * 3 }}
        />
      ))}
    </div>
  )
}

const ImpactDot = ({ level }: { level: ImpactLevel }) => {
  const colors = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-slate-500",
  }
  return <span className={`w-1.5 h-1.5 rounded-full ${colors[level]}`} />
}

const AssetTypePill = ({ type }: { type: AssetType }) => {
  const config = {
    index: { label: "Index", color: "bg-violet-500/20 text-violet-400" },
    fx: { label: "FX", color: "bg-sky-500/20 text-sky-400" },
    commodity: { label: "Commodity", color: "bg-amber-500/20 text-amber-400" },
    equity: { label: "Equity", color: "bg-emerald-500/20 text-emerald-400" },
  }
  return (
    <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium uppercase ${config[type].color}`}>
      {config[type].label}
    </span>
  )
}

const ConfidenceBar = ({ value }: { value: number }) => {
  const color = value >= 70 ? "bg-emerald-500" : value >= 50 ? "bg-amber-500" : "bg-slate-500"
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[10px] font-mono text-slate-400">{value}%</span>
    </div>
  )
}

// Main Component
export function DailyGameplan() {
  // Renamed state for clarity and updated types
  const [view, setView] = useState<"today" | "history">("today")
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "in-play" | "watching" | "completed" | "invalidated"
  >("all")
  const [pairFilter, setPairFilter] = useState<string>("all")
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string | null>(null)

  // Renamed and updated state for weekly focus
  const [weeklyFocus, setWeeklyFocus] = useState<"usd" | "gold" | "risk">("usd") // Changed from "risk-on" to "risk"
  const [expandedDriver, setExpandedDriver] = useState<string | null>(null)
  const [selectedForecast, setSelectedForecast] = useState<WeeklyForecast | null>(null)
  const [forecastModalTab, setForecastModalTab] = useState<"htf" | "ltf" | "scenarios">("htf")
  const carouselRef = useRef<HTMLDivElement>(null)

  const filteredForecasts = DAILY_FORECASTS.filter((f) => {
    if (statusFilter !== "all" && f.status !== statusFilter) return false
    if (pairFilter !== "all" && f.instrument !== pairFilter) return false
    return true
  })

  const uniqueInstruments = [...new Set(DAILY_FORECASTS.map((f) => f.instrument))]

  const sortedDrivers = [...WEEKLY_DRIVERS].sort((a, b) => {
    if (weeklyFocus === "usd" && a.symbol === "DXY") return -1
    if (weeklyFocus === "usd" && b.symbol === "DXY") return 1
    if (weeklyFocus === "gold" && a.symbol === "XAU/USD") return -1
    if (weeklyFocus === "gold" && b.symbol === "XAU/USD") return 1
    if (weeklyFocus === "risk" && a.symbol === "NAS100") return -1 // Changed from "risk-on" to "risk"
    if (weeklyFocus === "risk" && b.symbol === "NAS100") return 1 // Changed from "risk-on" to "risk"
    return 0
  })

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 280
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0c10] overflow-visible relative">
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Daily Gameplan</h2>
              <p className="text-[10px] text-slate-500">Friday, Jan 3, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("today")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                view === "today"
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
              Today
            </button>
            <button
              onClick={() => setView("history")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                view === "history"
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <History className="w-3.5 h-3.5 inline mr-1.5" />
              History
            </button>
          </div>
        </div>

        {/* Filters - Only show on Today tab */}
        {view === "today" && (
          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(v) =>
                setStatusFilter(v as "all" | "active" | "in-play" | "watching" | "completed" | "invalidated")
              }
            >
              <SelectTrigger className="w-[120px] h-8 text-xs bg-white/5 border-white/10 text-white">
                <Filter className="w-3 h-3 mr-1.5 text-slate-400" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#111318] border-white/10">
                <SelectItem value="all" className="text-white text-xs">
                  All Status
                </SelectItem>
                <SelectItem value="active" className="text-white text-xs">
                  Active
                </SelectItem>
                <SelectItem value="in-play" className="text-white text-xs">
                  In-Play
                </SelectItem>
                <SelectItem value="watching" className="text-white text-xs">
                  Watching
                </SelectItem>
                <SelectItem value="invalidated" className="text-white text-xs">
                  Invalidated
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={pairFilter} onValueChange={setPairFilter}>
              <SelectTrigger className="w-[120px] h-8 text-xs bg-white/5 border-white/10 text-white">
                <BarChart3 className="w-3 h-3 mr-1.5 text-slate-400" />
                <SelectValue placeholder="Instrument" />
              </SelectTrigger>
              <SelectContent className="bg-[#111318] border-white/10">
                <SelectItem value="all" className="text-white text-xs">
                  All Pairs
                </SelectItem>
                {uniqueInstruments.map((inst) => (
                  <SelectItem key={inst} value={inst} className="text-white text-xs">
                    {inst}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left side: Main gameplan content (shrinks when detail is open) */}
        <motion.div
          className="flex-1 min-w-0 overflow-hidden"
          animate={{
            width: selectedForecast ? "45%" : "100%",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <ScrollArea className="h-full">
            <div className="p-5 space-y-6">
              {view === "today" ? (
                <>
                  {/* Weekly Outlook Section */}
                  <div className="bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-transparent border border-indigo-500/20 rounded-xl p-4 space-y-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Pin className="w-4 h-4 text-indigo-400" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">Weekly Outlook</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-medium">
                              Jan 6 – Jan 10
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">Fed Minutes & CPI Week</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500">4 instruments tracked</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 italic">
                      High timeframe context + key drivers (educational)
                    </p>

                    {/* This Week's Focus Selector */}
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">This Week's Focus</p>
                      <div className="flex gap-2">
                        {[
                          { id: "usd" as const, label: "USD Week", icon: DollarSign },
                          { id: "gold" as const, label: "Gold Week", icon: Zap },
                          { id: "risk" as const, label: "Risk-On Week", icon: TrendingUp }, // Changed from "risk-on" to "risk"
                        ].map((focus) => (
                          <button
                            key={focus.id}
                            onClick={() => setWeeklyFocus(focus.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                              weeklyFocus === focus.id
                                ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                                : "bg-white/5 text-slate-400 border border-white/5 hover:border-white/10"
                            }`}
                          >
                            <focus.icon className="w-3 h-3" />
                            {focus.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Macro Drivers Section */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-3 flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-violet-400" />
                      Macro Drivers This Week
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Key Events */}
                      <div className="space-y-2">
                        <p className="text-[10px] text-slate-400 font-medium">Key Events</p>
                        <div className="space-y-1.5">
                          <TooltipProvider>
                            {MACRO_EVENTS.map((event) => (
                              <Tooltip key={event.id}>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 cursor-help">
                                    <span className="text-[9px] font-medium text-slate-500 w-8">{event.day}</span>
                                    <ImpactDot level={event.impact} />
                                    <span className="text-[10px] text-white font-medium">{event.name}</span>
                                    <span className="text-[9px] text-slate-500 capitalize ml-auto">{event.impact}</span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="right"
                                  className="bg-[#111318] border-white/10 text-xs max-w-[200px]"
                                >
                                  <p className="text-slate-300">{event.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                          </TooltipProvider>
                        </div>
                      </div>

                      {/* Macro Summary */}
                      <div className="space-y-2">
                        <p className="text-[10px] text-slate-400 font-medium">Macro Summary</p>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-2">
                          {MACRO_SUMMARY.map((point, idx) => (
                            <p key={idx} className="text-[10px] text-slate-300 leading-relaxed flex items-start gap-2">
                              <span className="text-indigo-400 mt-0.5">•</span>
                              {point}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Bias Dashboard */}
                  <div className="space-y-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-indigo-400" />
                      Weekly Bias Dashboard
                    </p>

                    {sortedDrivers.map((driver) => (
                      <motion.div
                        key={driver.id}
                        layout
                        className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors"
                      >
                        <button
                          onClick={() => setExpandedDriver(expandedDriver === driver.id ? null : driver.id)}
                          className="w-full p-4 text-left"
                        >
                          <div className="flex items-start gap-4">
                            {/* Left: Asset Identity */}
                            <div className="flex-shrink-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-base font-mono font-bold text-white">{driver.symbol}</span>
                                <AssetTypePill type={driver.type} />
                              </div>
                            </div>

                            {/* Middle: Bias + Expectation */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                    driver.bias === "bullish"
                                      ? "bg-emerald-500/20 text-emerald-400"
                                      : driver.bias === "bearish"
                                        ? "bg-red-500/20 text-red-400"
                                        : "bg-slate-500/20 text-slate-400"
                                  }`}
                                >
                                  {driver.bias}
                                </span>
                                {driver.keyZones && (
                                  <div className="flex gap-1.5">
                                    {driver.keyZones.slice(0, 2).map((zone, idx) => (
                                      <span
                                        key={idx}
                                        className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500"
                                      >
                                        {zone}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                                {driver.expectation}
                              </p>
                            </div>

                            {/* Right: Tags + Confidence */}
                            <div className="flex-shrink-0 text-right">
                              <div className="flex flex-wrap gap-1 justify-end mb-2">
                                {driver.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <ConfidenceBar value={driver.confidence} />
                              <div className="flex items-center justify-end gap-1 mt-2">
                                <Eye className="w-3 h-3 text-slate-500" />
                                <span className="text-[10px] text-slate-500">View details</span>
                                <ChevronDown
                                  className={`w-3 h-3 text-slate-500 transition-transform ${expandedDriver === driver.id ? "rotate-180" : ""}`}
                                />
                              </div>
                            </div>
                          </div>
                        </button>

                        {/* Expanded Details */}
                        <AnimatePresence>
                          {expandedDriver === driver.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 pt-0 border-t border-white/5 space-y-3">
                                {/* Why This Bias */}
                                <div>
                                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">
                                    Why This Bias
                                  </p>
                                  <ul className="space-y-1">
                                    {driver.details.whyThisBias.map((reason, idx) => (
                                      <li key={idx} className="text-[10px] text-slate-400 flex items-start gap-2">
                                        <span className="text-emerald-400 mt-0.5">✓</span>
                                        {reason}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Invalidation */}
                                <div>
                                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                                    Invalidation
                                  </p>
                                  <p className="text-[10px] text-red-400 flex items-start gap-2">
                                    <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                    {driver.details.invalidation}
                                  </p>
                                </div>

                                {/* What Would Change */}
                                <div>
                                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                                    What Would Change My Mind
                                  </p>
                                  <p className="text-[10px] text-amber-400 flex items-start gap-2">
                                    <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                    {driver.details.whatWouldChange}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>

                  {/* Weekly Forecast Cards - Horizontal Scroll */}
                  <div className="mt-6">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      Weekly Forecast Cards
                    </p>
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                      {WEEKLY_FORECASTS.map((forecast) => (
                        <motion.button
                          key={forecast.id}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedForecast(forecast)
                            setForecastModalTab("htf")
                          }}
                          className={`flex-shrink-0 w-[200px] p-3 rounded-xl border transition-all text-left ${
                            selectedForecast?.id === forecast.id
                              ? "bg-indigo-500/20 border-indigo-500/40"
                              : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
                          }`}
                        >
                          {/* Chart Preview */}
                          <div className="aspect-[16/9] rounded-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5 mb-2 flex items-center justify-center overflow-hidden">
                            <ImageIcon className="w-6 h-6 text-slate-600" />
                          </div>
                          {/* Card Info */}
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-mono font-bold text-white">{forecast.instrument}</span>
                            <StatusBadge status={forecast.status} />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <BiasBadge bias={forecast.bias} size="sm" />
                            <span className="text-[10px] text-slate-500">{forecast.timeframe}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Today's Forecast Cards - Existing Section */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        Today's Forecasts
                        <span className="ml-1 px-1.5 py-0.5 rounded bg-white/10 text-slate-400">
                          {filteredForecasts.length}
                        </span>
                      </p>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Auto-synced from Forecast Engine
                      </span>
                    </div>

                    {filteredForecasts.map((forecast, idx) => (
                      <motion.div
                        key={forecast.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`bg-white/5 border rounded-xl p-4 hover:bg-white/[0.07] transition-all ${
                          forecast.status === "invalidated"
                            ? "border-red-500/20 opacity-60"
                            : forecast.status === "in-play"
                              ? "border-sky-500/20"
                              : "border-white/10 hover:border-indigo-500/30"
                        }`}
                      >
                        {/* Card Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-base font-mono font-bold text-white">{forecast.instrument}</span>
                            <BiasIndicator bias={forecast.bias} />
                            <ConfidenceMeter level={forecast.confidence} />
                          </div>
                          <StatusBadge status={forecast.status} />
                        </div>

                        {/* Key Levels */}
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {forecast.keyLevels.map((level, levelIdx) => (
                            <div
                              key={levelIdx}
                              className={`p-2 rounded-lg border ${
                                level.type === "support"
                                  ? "bg-emerald-500/10 border-emerald-500/20"
                                  : level.type === "resistance"
                                    ? "bg-red-500/10 border-red-500/20"
                                    : "bg-indigo-500/10 border-indigo-500/20"
                              }`}
                            >
                              <p
                                className={`text-[9px] uppercase tracking-wider mb-0.5 ${
                                  level.type === "support"
                                    ? "text-emerald-400"
                                    : level.type === "resistance"
                                      ? "text-red-400"
                                      : "text-indigo-400"
                                }`}
                              >
                                {level.type === "poi" ? "POI" : level.type}
                              </p>
                              <p className="text-sm font-mono font-bold text-white">{level.price}</p>
                              {level.label && (
                                <p className="text-[9px] text-slate-400 mt-0.5 truncate">{level.label}</p>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Notes */}
                        {forecast.notes && (
                          <p className="text-xs text-slate-400 leading-relaxed mb-3 italic">"{forecast.notes}"</p>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-[9px] font-bold text-white">
                              {forecast.mentorAvatar}
                            </div>
                            <span className="text-[10px] text-slate-400">by {forecast.mentor}</span>
                            <span className="text-[10px] text-slate-500">• {forecast.createdAt}</span>
                          </div>
                          {forecast.linkedSignals && forecast.linkedSignals > 0 && (
                            <button className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium hover:bg-emerald-500/20 transition-colors">
                              <ArrowUpRight className="w-3 h-3" />
                              {forecast.linkedSignals} Signal{forecast.linkedSignals > 1 ? "s" : ""}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                /* History View */
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="p-4 space-y-4"
                >
                  {/* History Navigation */}
                  <div className="flex items-center justify-between">
                    <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-white">Week of Dec 30 - Jan 3</p>
                      <p className="text-[10px] text-slate-500">3 trading days</p>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Past Weekly Outlook */}
                  <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Pin className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-xs font-semibold text-white">Weekly Outlook</span>
                      <span className="text-[10px] text-indigo-400">Fed Minutes & CPI Week</span>
                    </div>
                    <p className="text-[10px] text-slate-400">4 instruments tracked • View archived outlook</p>
                  </div>

                  {/* Filter Options */}
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Filter className="w-3 h-3" />
                      Filter History
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400 hover:text-white hover:border-white/20 transition-colors">
                        By Mentor
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400 hover:text-white hover:border-white/20 transition-colors">
                        By Instrument
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400 hover:text-white hover:border-white/20 transition-colors">
                        By Status
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedForecast && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "55%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="border-l border-white/10 bg-[#0d0f14] overflow-hidden flex flex-col"
            >
              {/* Detail Header */}
              <div className="flex-shrink-0 px-5 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedForecast(null)}
                    className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <LineChart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-mono font-bold text-white">{selectedForecast.instrument}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400">
                        {selectedForecast.timeframe}
                      </span>
                      <StatusBadge status={selectedForecast.status} />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-400">by {selectedForecast.mentor}</span>
                      <span className="text-[10px] text-slate-500">• Updated {selectedForecast.lastUpdated}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedForecast(null)}
                  className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Disclaimer */}
              <div className="flex-shrink-0 px-5 py-2 bg-amber-500/5 border-b border-amber-500/10">
                <p className="text-[10px] text-amber-400 flex items-center gap-1.5">
                  <Info className="w-3 h-3" />
                  Educational analysis — not financial advice
                </p>
              </div>

              {/* Tabs */}
              <div className="flex-shrink-0 px-5 py-3 border-b border-white/5 flex gap-2">
                {[
                  { id: "htf" as const, label: "HTF (W/D)" },
                  { id: "ltf" as const, label: "LTF (4H/1H)" },
                  { id: "scenarios" as const, label: "Scenarios" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setForecastModalTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      forecastModalTab === tab.id
                        ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Detail Content */}
              <ScrollArea className="flex-1">
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-5">
                    {/* Left: Chart Viewer */}
                    <div className="space-y-3">
                      <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5 flex items-center justify-center">
                        <div className="text-center">
                          <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                          <span className="text-xs text-slate-600">
                            {forecastModalTab === "htf"
                              ? "Weekly/Daily Chart"
                              : forecastModalTab === "ltf"
                                ? "4H/1H Chart"
                                : "Scenario Diagram"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Text Blocks */}
                    <div className="space-y-4">
                      {/* Narrative */}
                      {selectedForecast.narrative && (
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Narrative</p>
                          <p className="text-xs text-slate-300 leading-relaxed">{selectedForecast.narrative}</p>
                        </div>
                      )}

                      {/* Key Levels */}
                      {selectedForecast.keyLevels && (
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Key Levels</p>
                          <div className="grid grid-cols-3 gap-2">
                            {selectedForecast.keyLevels.map((level, idx) => (
                              <div
                                key={idx}
                                className={`p-2 rounded-lg border ${
                                  level.type === "support"
                                    ? "bg-emerald-500/10 border-emerald-500/20"
                                    : level.type === "resistance"
                                      ? "bg-red-500/10 border-red-500/20"
                                      : "bg-indigo-500/10 border-indigo-500/20"
                                }`}
                              >
                                <p
                                  className={`text-[9px] uppercase tracking-wider ${
                                    level.type === "support"
                                      ? "text-emerald-400"
                                      : level.type === "resistance"
                                        ? "text-red-400"
                                        : "text-indigo-400"
                                  }`}
                                >
                                  {level.type === "poi" ? "POI" : level.type}
                                </p>
                                <p className="text-sm font-mono font-bold text-white">{level.price}</p>
                                {level.label && <p className="text-[9px] text-slate-400 truncate">{level.label}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* What to Watch */}
                      {selectedForecast.whatToWatch && (
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">What to Watch</p>
                          <div className="space-y-1.5">
                            {selectedForecast.whatToWatch.map((item, idx) => (
                              <p key={idx} className="text-[10px] text-slate-400 flex items-start gap-2">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                                {item}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* If/Then Scenarios */}
                      {forecastModalTab === "scenarios" && selectedForecast.scenarios && (
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">If/Then Scenarios</p>
                          <div className="space-y-2">
                            {selectedForecast.scenarios.map((scenario, idx) => (
                              <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/5">
                                <p className="text-[10px] text-amber-400 mb-1">
                                  <span className="font-semibold">IF:</span> {scenario.trigger}
                                </p>
                                <p className="text-[10px] text-emerald-400">
                                  <span className="font-semibold">THEN:</span> {scenario.reaction}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Detail Footer */}
              <div className="flex-shrink-0 px-5 py-3 border-t border-white/5 flex justify-between items-center">
                <p className="text-[9px] text-slate-500">Educational analysis only</p>
                <button
                  onClick={() => setSelectedForecast(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-white/10 transition-colors"
                >
                  Back to Gameplan
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
