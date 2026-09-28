"use client"

import type React from "react"
import { useCallback, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { technicalConfluences, confluenceById, type ConfluenceId } from "@/lib/confluences"
import { useAnalysis } from "@/lib/stores/useAnalysis"
import { useInstrument } from "@/lib/stores/useInstrument"
import { useConfluenceStore } from "@/stores/confluence-store"
import { useScenarioStore } from "@/lib/scenario-store"
import { CandleMiniChart } from "@/components/charts/CandleMiniChart"
import {
  X,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Lock,
  FileText,
  Sparkles,
  Layers,
  Target,
  Activity,
  BarChart3,
  Crosshair,
  RefreshCw,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  Save,
  Send,
} from "lucide-react"

interface CreateForecastCockpitProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Direction = "long" | "short" | null
type PrimarySession = "asia" | "london" | "newyork" | null

interface ReceiptModule {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  hasData: boolean
  isAttached: boolean
}

interface TradePlan {
  direction: Direction
  entry: string
  stopLoss: string
  takeProfit: string
  invalidation: string
  managementNotes: string
}

// Helper to format price with 5 decimal places
const formatPrice = (price: number | undefined) => {
  if (price === undefined || price === null) return "—"
  return price.toFixed(5)
}

// Helper to calculate pips
const toPips = (value: number | undefined, pair: string) => {
  if (value === undefined || value === null) return "—"
  const multiplier = pair.includes("JPY") ? 100 : 10000
  return (value * multiplier).toFixed(1)
}

// Session Mini Chart Component - Compact version for forecast
function SessionMiniChartCompact({
  sessionKey,
  label,
  isSelected,
  onSelect,
}: {
  sessionKey: "asia" | "london" | "newyork"
  label: string
  isSelected: boolean
  onSelect: () => void
}) {
  const { sessionBars, sessionOHLC } = useAnalysis()
  const bars = sessionBars[sessionKey] || []
  const ohlc = sessionOHLC[sessionKey]

  const hasData = bars.length > 0
  const isBullish = hasData && ohlc?.close && ohlc?.open ? ohlc.close >= ohlc.open : null

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "LIVE":
        return "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
      case "COMPLETED":
        return "bg-purple-500/20 border-purple-500/40 text-purple-400"
      case "UPCOMING":
        return "bg-amber-500/20 border-amber-500/40 text-amber-400"
      default:
        return "bg-slate-500/20 border-slate-500/40 text-slate-400"
    }
  }

  return (
    <motion.div
      onClick={onSelect}
      className={cn(
        "relative rounded-xl border p-3 cursor-pointer transition-all duration-300",
        "bg-slate-900/60 backdrop-blur-sm",
        isSelected
          ? "border-purple-500/60 ring-2 ring-purple-500/30 shadow-lg shadow-purple-500/10"
          : "border-slate-700/50 hover:border-slate-600/60"
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-300">{label}</span>
        <Badge className={cn("text-[10px] px-1.5 py-0 h-4", getStatusColor(ohlc?.status))}>
          {ohlc?.status || "—"}
        </Badge>
      </div>

      {/* Mini Chart - Same candlestick rendering as main session analysis */}
      {hasData ? (
        <div className="h-24 mb-2 bg-slate-900/40 rounded-lg p-1">
          <CandleMiniChart
            bars={bars}
            width={160}
            height={88}
            pairSymbol="EURUSD"
            showGrid={true}
            className="rounded w-full"
          />
        </div>
      ) : (
        <div className="h-24 mb-2 flex items-center justify-center bg-slate-800/40 rounded-lg border border-slate-700/30">
          <div className="text-center">
            <span className="text-[10px] text-slate-500 block">No data</span>
            <span className="text-[9px] text-slate-600">Run analysis first</span>
          </div>
        </div>
      )}

      {/* OHLC Stats */}
      <div className="grid grid-cols-2 gap-1 text-[10px]">
        <div className="flex justify-between">
          <span className="text-slate-500">O:</span>
          <span className="text-slate-300 font-mono">{formatPrice(ohlc?.open)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">H:</span>
          <span className="text-emerald-400 font-mono">{formatPrice(ohlc?.high)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">C:</span>
          <span className={cn("font-mono", isBullish ? "text-emerald-400" : isBullish === false ? "text-rose-400" : "text-slate-300")}>
            {formatPrice(ohlc?.close)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">L:</span>
          <span className="text-rose-400 font-mono">{formatPrice(ohlc?.low)}</span>
        </div>
      </div>

      {/* Range */}
      {ohlc?.range && (
        <div className="mt-1 pt-1 border-t border-slate-700/30 flex justify-between text-[10px]">
          <span className="text-slate-500">Range:</span>
          <span className="text-purple-400 font-mono">{toPips(ohlc.range, "EURUSD")} pips</span>
        </div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
          <CheckCircle2 className="w-3 h-3 text-white" />
        </div>
      )}
    </motion.div>
  )
}

// Candle Context Card - Mini version
function CandleContextCard({
  timeframe,
  bars,
  stats,
}: {
  timeframe: string
  bars: any[]
  stats?: { bullish: number; bearish: number; maxRange: number }
}) {
  const hasData = bars && bars.length > 0
  const lastBar = hasData ? bars[bars.length - 1] : null
  const isBullish = lastBar ? lastBar.c >= lastBar.o : null

  return (
    <div className="rounded-lg border border-slate-700/40 bg-slate-800/40 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-300">{timeframe}</span>
        {isBullish !== null && (
          <Badge className={cn("text-[10px]", isBullish ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400")}>
            {isBullish ? "Bullish" : "Bearish"}
          </Badge>
        )}
      </div>

      {hasData ? (
        <>
          <div className="h-16 mb-2 bg-slate-900/40 rounded p-1">
            <CandleMiniChart
              bars={bars.slice(-8)}
              width={140}
              height={60}
              pairSymbol="EURUSD"
              showGrid={true}
              className="rounded w-full"
            />
          </div>
          {stats && (
            <div className="flex justify-between text-[10px]">
              <span className="text-emerald-400">{stats.bullish} bull</span>
              <span className="text-rose-400">{stats.bearish} bear</span>
            </div>
          )}
        </>
      ) : (
        <div className="h-16 flex items-center justify-center bg-slate-900/40 rounded border border-slate-700/30">
          <span className="text-[10px] text-slate-500">Run analysis first</span>
        </div>
      )}
    </div>
  )
}

// Receipt Module Component
function ReceiptModuleCard({
  module,
  isExpanded,
  onToggle,
  onAttachChange,
  children,
}: {
  module: ReceiptModule
  isExpanded: boolean
  onToggle: () => void
  onAttachChange: (attached: boolean) => void
  children: React.ReactNode
}) {
  return (
    <motion.div
      layout
      className={cn(
        "rounded-xl border transition-all duration-300",
        module.isAttached
          ? "border-purple-500/40 bg-slate-900/70"
          : "border-slate-700/40 bg-slate-900/50"
      )}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            module.hasData ? "bg-purple-500/20 text-purple-400" : "bg-slate-700/40 text-slate-500"
          )}>
            {module.icon}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">{module.title}</h4>
            <p className="text-[10px] text-slate-500">{module.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!module.hasData && (
            <Badge className="text-[10px] bg-slate-700/40 text-slate-500 border-slate-600/40">
              Not available
            </Badge>
          )}
          <Switch
            checked={module.isAttached}
            onCheckedChange={onAttachChange}
            disabled={!module.hasData}
            className="data-[state=checked]:bg-purple-500"
          />
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </motion.div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && module.isAttached && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 border-t border-slate-700/30 pt-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Confluence Chip
function ConfluenceChip({
  id,
  isSelected,
  onToggle,
}: {
  id: string
  isSelected: boolean
  onToggle: () => void
}) {
  const confluence = confluenceById.get(id)
  if (!confluence) return null

  const Icon = confluence.icon

  return (
    <motion.button
      onClick={onToggle}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all",
        isSelected
          ? "border-purple-500/60 bg-purple-500/20 text-purple-300"
          : "border-slate-600/40 bg-slate-800/40 text-slate-400 hover:border-slate-500/60"
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-3 h-3" />
      <span>{confluence.short || confluence.name}</span>
      {isSelected && <CheckCircle2 className="w-3 h-3 text-purple-400" />}
    </motion.button>
  )
}

// Main Component
export function CreateForecastCockpit({ open, onOpenChange }: CreateForecastCockpitProps) {
  // Stores
  const { instrument } = useInstrument()
  const analysisStore = useAnalysis()
  const { selectedConfluences: storeConfluences } = useConfluenceStore()
  const { scenarios, createScenarioFromForecast } = useScenarioStore()

  // Local state
  const [primarySession, setPrimarySession] = useState<PrimarySession>(null)
  const [selectedConfluences, setSelectedConfluences] = useState<string[]>(storeConfluences)
  const [expandedModules, setExpandedModules] = useState<string[]>(["key-levels", "confluences"])
  const [attachedModules, setAttachedModules] = useState<string[]>(["key-levels", "confluences", "session-bias", "candle-context"])
  const [commentary, setCommentary] = useState("")
  const [tradePlan, setTradePlan] = useState<TradePlan>({
    direction: null,
    entry: "",
    stopLoss: "",
    takeProfit: "",
    invalidation: "",
    managementNotes: "",
  })

  // Derived data
  const { sessionBars, sessionOHLC, weeklyBars, dailyBars, h4Bars, weeklyStats, dailyStats, h4Stats, snapshot } = analysisStore

  const hasSessionData = Object.values(sessionBars).some((bars) => bars && bars.length > 0)
  const hasMultiTFData = (weeklyBars?.length || 0) > 0 || (dailyBars?.length || 0) > 0 || (h4Bars?.length || 0) > 0
  const hasConfluences = selectedConfluences.length > 0
  const currentPrice = snapshot?.last

  // Active scenario from store
  const activeScenario = scenarios.find(s => s.pair === instrument.symbol)

  // Calculate R:R
  const calculateRR = useMemo(() => {
    const { entry, stopLoss, takeProfit, direction } = tradePlan
    if (!entry || !stopLoss || !takeProfit || !direction) return null

    const e = parseFloat(entry)
    const sl = parseFloat(stopLoss)
    const tp = parseFloat(takeProfit)

    if (isNaN(e) || isNaN(sl) || isNaN(tp)) return null

    const risk = Math.abs(e - sl)
    const reward = Math.abs(tp - e)

    if (risk === 0) return null

    return (reward / risk).toFixed(2)
  }, [tradePlan])

  // Bias based on analysis
  const bias = useMemo(() => {
    if (!hasMultiTFData) return "neutral"
    const bullish = (weeklyStats?.bullish || 0) + (dailyStats?.bullish || 0) + (h4Stats?.bullish || 0)
    const bearish = (weeklyStats?.bearish || 0) + (dailyStats?.bearish || 0) + (h4Stats?.bearish || 0)
    if (bullish > bearish * 1.2) return "bullish"
    if (bearish > bullish * 1.2) return "bearish"
    return "neutral"
  }, [weeklyStats, dailyStats, h4Stats, hasMultiTFData])

  // Handlers
  const toggleModule = (id: string) => {
    setExpandedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  const toggleAttachment = (id: string, attached: boolean) => {
    setAttachedModules((prev) =>
      attached ? [...prev, id] : prev.filter((m) => m !== id)
    )
  }

  const toggleConfluence = (id: string) => {
    setSelectedConfluences((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const pullFromScenario = () => {
    if (!activeScenario) return
    setTradePlan({
      direction: activeScenario.position === "Buy Position" ? "long" : "short",
      entry: activeScenario.level,
      stopLoss: activeScenario.sl,
      takeProfit: activeScenario.tp,
      invalidation: "",
      managementNotes: activeScenario.notes || "",
    })
  }

  const handleSubmit = () => {
    // Create the forecast
    const forecastData = {
      pair: instrument.symbol,
      direction: tradePlan.direction === "long" ? "Long" : "Short",
      confluences: selectedConfluences,
      commentary,
    }

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("forecast:created", {
        detail: {
          user: { name: "Trader" },
          trade: {
            pair: instrument.symbol,
            direction: tradePlan.direction,
            entry: tradePlan.entry,
            stopLoss: tradePlan.stopLoss,
            takeProfit: tradePlan.takeProfit,
            rr: calculateRR,
          },
          confluences: selectedConfluences,
          attachedModules,
          primarySession,
          sessionData: primarySession ? sessionOHLC[primarySession] : null,
          commentary,
          timestamp: new Date().toISOString(),
        },
      })
    )

    onOpenChange(false)
  }

  // Receipt modules configuration
  const receiptModules: ReceiptModule[] = [
    {
      id: "key-levels",
      title: "Key Levels & HTF Zones",
      description: "Weekly/Daily/Session key levels",
      icon: <Layers className="w-4 h-4" />,
      hasData: hasMultiTFData,
      isAttached: attachedModules.includes("key-levels"),
    },
    {
      id: "confluences",
      title: "Technical Confluences",
      description: "ICT concepts and technical factors",
      icon: <Target className="w-4 h-4" />,
      hasData: true, // Always available for tagging
      isAttached: attachedModules.includes("confluences"),
    },
    {
      id: "market-structure",
      title: "Market Structure",
      description: "HTF structure and directional bias",
      icon: <Activity className="w-4 h-4" />,
      hasData: hasMultiTFData,
      isAttached: attachedModules.includes("market-structure"),
    },
    {
      id: "candle-context",
      title: "Candle Context",
      description: "Weekly/Daily/4H candle summaries",
      icon: <BarChart3 className="w-4 h-4" />,
      hasData: hasMultiTFData,
      isAttached: attachedModules.includes("candle-context"),
    },
    {
      id: "session-bias",
      title: "Session Bias & Narrative",
      description: "Why this session matters",
      icon: <Clock className="w-4 h-4" />,
      hasData: hasSessionData,
      isAttached: attachedModules.includes("session-bias"),
    },
    {
      id: "active-scenario",
      title: "Active Scenario",
      description: "Pull from existing scenario",
      icon: <Crosshair className="w-4 h-4" />,
      hasData: !!activeScenario,
      isAttached: attachedModules.includes("active-scenario"),
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[98vw] max-w-[1600px] h-[95vh] border-0 bg-transparent p-0 text-white flex flex-col overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl rounded-2xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-950/90 to-purple-950/40 rounded-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(147,51,234,0.08),transparent_50%)] rounded-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.06),transparent_50%)] rounded-2xl" />
        <div className="absolute inset-0 rounded-2xl border border-slate-700/60" />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-purple-500/10" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="px-6 py-4 flex-shrink-0 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-100">
                    Create Forecast
                  </DialogTitle>
                  <p className="text-xs text-slate-400">
                    Capture this moment with structured receipts
                  </p>
                </div>
                <Badge className="ml-2 text-[10px] bg-slate-700/50 text-slate-400 border-slate-600/40">
                  From Analyze Charts
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>

          {/* Main Content - 50/50 Split */}
          <div className="flex-1 flex overflow-hidden">
            {/* LEFT PANEL - Chart Context */}
            <div className="w-1/2 border-r border-slate-700/50 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Context Summary Strip */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-sm font-mono">
                      {instrument.symbol}
                    </Badge>
                    <Badge className="bg-slate-700/50 text-slate-300 border-slate-600/40">
                      {instrument.timeframe}
                    </Badge>
                    <Badge className={cn(
                      "border",
                      bias === "bullish" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                      bias === "bearish" ? "bg-rose-500/20 text-rose-400 border-rose-500/30" :
                      "bg-slate-700/50 text-slate-400 border-slate-600/40"
                    )}>
                      {bias === "bullish" && <TrendingUp className="w-3 h-3 mr-1" />}
                      {bias === "bearish" && <TrendingDown className="w-3 h-3 mr-1" />}
                      {bias === "neutral" && <Minus className="w-3 h-3 mr-1" />}
                      {bias.charAt(0).toUpperCase() + bias.slice(1)}
                    </Badge>
                  </div>
                  {currentPrice && (
                    <span className="text-sm font-mono text-slate-300">
                      {formatPrice(currentPrice)}
                    </span>
                  )}
                </div>

                {/* Live Chart Area */}
                <div className="relative rounded-xl border border-slate-700/40 bg-slate-900/60 overflow-hidden">
                  {/* Chart placeholder - In production, embed TradingView widget */}
                  <div className="aspect-video bg-gradient-to-br from-slate-800/80 to-slate-900/80 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">Chart context from Analyze Charts</p>
                      <p className="text-xs text-slate-600 mt-1">{instrument.symbol} | {instrument.timeframe}</p>
                    </div>
                  </div>

                  {/* Context Locked Pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700/60 backdrop-blur-sm">
                    <Lock className="w-3 h-3 text-purple-400" />
                    <span className="text-[10px] text-slate-400">Context locked</span>
                  </div>
                </div>

                {/* Session Snapshot */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-300">Banking Sessions</h3>
                    <span className="text-[10px] text-slate-500">Select primary session</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <SessionMiniChartCompact
                      sessionKey="asia"
                      label="Asia (5pm-2am)"
                      isSelected={primarySession === "asia"}
                      onSelect={() => setPrimarySession(primarySession === "asia" ? null : "asia")}
                    />
                    <SessionMiniChartCompact
                      sessionKey="london"
                      label="London (2am-8am)"
                      isSelected={primarySession === "london"}
                      onSelect={() => setPrimarySession(primarySession === "london" ? null : "london")}
                    />
                    <SessionMiniChartCompact
                      sessionKey="newyork"
                      label="New York (8am-5pm)"
                      isSelected={primarySession === "newyork"}
                      onSelect={() => setPrimarySession(primarySession === "newyork" ? null : "newyork")}
                    />
                  </div>
                </div>

                {/* Chart Snapshot Capture */}
                <div className="rounded-xl border border-slate-700/40 bg-slate-800/40 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-slate-300">Chart Snapshot</h3>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-400 hover:text-slate-200">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Re-capture
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-400 hover:text-slate-200">
                        <Upload className="w-3 h-3 mr-1" />
                        Upload
                      </Button>
                    </div>
                  </div>
                  <div className="h-20 rounded-lg bg-slate-900/60 border border-dashed border-slate-600/40 flex items-center justify-center">
                    <span className="text-xs text-slate-500">Auto-captured from Analyze Charts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL - Receipts Builder */}
            <div className="w-1/2 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Receipt Modules */}
                {receiptModules.map((module) => (
                  <ReceiptModuleCard
                    key={module.id}
                    module={module}
                    isExpanded={expandedModules.includes(module.id)}
                    onToggle={() => toggleModule(module.id)}
                    onAttachChange={(attached) => toggleAttachment(module.id, attached)}
                  >
                    {/* Module-specific content */}
                    {module.id === "key-levels" && (
                      <div className="space-y-2">
                        {hasMultiTFData ? (
                          <div className="space-y-1">
                            {weeklyBars && weeklyBars.length > 0 && (
                              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-800/40">
                                <span className="text-slate-400">Weekly High</span>
                                <span className="font-mono text-emerald-400">{formatPrice(Math.max(...weeklyBars.map(b => b.h)))}</span>
                              </div>
                            )}
                            {weeklyBars && weeklyBars.length > 0 && (
                              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-800/40">
                                <span className="text-slate-400">Weekly Low</span>
                                <span className="font-mono text-rose-400">{formatPrice(Math.min(...weeklyBars.map(b => b.l)))}</span>
                              </div>
                            )}
                            {dailyBars && dailyBars.length > 0 && (
                              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-800/40">
                                <span className="text-slate-400">Daily High</span>
                                <span className="font-mono text-emerald-400">{formatPrice(Math.max(...dailyBars.map(b => b.h)))}</span>
                              </div>
                            )}
                            {dailyBars && dailyBars.length > 0 && (
                              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-800/40">
                                <span className="text-slate-400">Daily Low</span>
                                <span className="font-mono text-rose-400">{formatPrice(Math.min(...dailyBars.map(b => b.l)))}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-500 text-center py-2">
                            No HTF levels detected yet
                          </div>
                        )}
                      </div>
                    )}

                    {module.id === "confluences" && (
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {technicalConfluences.map((c) => (
                            <ConfluenceChip
                              key={c.id}
                              id={c.id}
                              isSelected={selectedConfluences.includes(c.id)}
                              onToggle={() => toggleConfluence(c.id)}
                            />
                          ))}
                        </div>
                        {selectedConfluences.length > 0 && (
                          <div className="pt-2 border-t border-slate-700/30">
                            <p className="text-[10px] text-slate-500 mb-2">Selected Confluences Preview:</p>
                            <div className="space-y-1">
                              {selectedConfluences.slice(0, 4).map((id) => {
                                const c = confluenceById.get(id)
                                if (!c) return null
                                return (
                                  <div key={id} className="flex items-start gap-2 text-xs p-2 rounded bg-slate-800/40">
                                    <c.icon className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <span className="text-slate-300 font-medium">{c.name}</span>
                                      <p className="text-[10px] text-slate-500 mt-0.5">{c.hoverDescription.slice(0, 80)}...</p>
                                    </div>
                                  </div>
                                )
                              })}
                              {selectedConfluences.length > 4 && (
                                <p className="text-[10px] text-slate-500">+{selectedConfluences.length - 4} more</p>
                              )}
                            </div>
                          </div>
                        )}
                        <p className="text-[10px] text-slate-500 italic">
                          Tagging only (auto-detection available in Analyze Charts)
                        </p>
                      </div>
                    )}

                    {module.id === "market-structure" && (
                      <div className="space-y-2">
                        {hasMultiTFData ? (
                          <>
                            <div className="flex items-center gap-2 p-2 rounded bg-slate-800/40">
                              <Badge className={cn(
                                "text-xs",
                                bias === "bullish" ? "bg-emerald-500/20 text-emerald-400" :
                                bias === "bearish" ? "bg-rose-500/20 text-rose-400" :
                                "bg-slate-700/50 text-slate-400"
                              )}>
                                {bias.charAt(0).toUpperCase() + bias.slice(1)} Structure
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-400">
                              Based on multi-timeframe candle analysis
                            </p>
                          </>
                        ) : (
                          <div className="text-xs text-slate-500 text-center py-2">
                            Structure analysis not available yet
                          </div>
                        )}
                      </div>
                    )}

                    {module.id === "candle-context" && (
                      <div className="grid grid-cols-3 gap-2">
                        <CandleContextCard timeframe="Weekly" bars={weeklyBars || []} stats={weeklyStats} />
                        <CandleContextCard timeframe="Daily" bars={dailyBars || []} stats={dailyStats} />
                        <CandleContextCard timeframe="4H" bars={h4Bars || []} stats={h4Stats} />
                      </div>
                    )}

                    {module.id === "session-bias" && (
                      <div className="space-y-2">
                        {primarySession ? (
                          <div className="p-2 rounded bg-slate-800/40 text-xs">
                            <p className="text-slate-300 font-medium mb-1">
                              Primary: {primarySession.charAt(0).toUpperCase() + primarySession.slice(1)} Session
                            </p>
                            <p className="text-slate-500">
                              {primarySession === "asia" && "Asian session often sets the range for London/NY manipulation."}
                              {primarySession === "london" && "London session typically provides the manipulation move."}
                              {primarySession === "newyork" && "NY session often completes the daily move with distribution."}
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 text-center py-2">
                            Select a primary session from the left panel
                          </p>
                        )}
                      </div>
                    )}

                    {module.id === "active-scenario" && (
                      <div className="space-y-2">
                        {activeScenario ? (
                          <>
                            <div className="flex items-center justify-between p-2 rounded bg-slate-800/40">
                              <div className="flex items-center gap-2">
                                <Badge className={cn(
                                  "text-xs",
                                  activeScenario.position === "Buy Position" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                                )}>
                                  {activeScenario.position}
                                </Badge>
                                <span className="text-xs text-slate-300">{activeScenario.pair}</span>
                              </div>
                              <span className="text-xs font-mono text-purple-400">{activeScenario.rr}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="p-2 rounded bg-slate-800/40">
                                <span className="text-slate-500">Entry</span>
                                <p className="font-mono text-slate-300">{activeScenario.level}</p>
                              </div>
                              <div className="p-2 rounded bg-slate-800/40">
                                <span className="text-slate-500">SL</span>
                                <p className="font-mono text-rose-400">{activeScenario.sl}</p>
                              </div>
                              <div className="p-2 rounded bg-slate-800/40">
                                <span className="text-slate-500">TP</span>
                                <p className="font-mono text-emerald-400">{activeScenario.tp}</p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={pullFromScenario}
                              className="w-full h-8 text-xs border-purple-500/40 text-purple-400 hover:bg-purple-500/10 bg-transparent"
                            >
                              Pull into Trade Plan
                            </Button>
                          </>
                        ) : (
                          <p className="text-xs text-slate-500 text-center py-2">
                            No active scenario for {instrument.symbol}
                          </p>
                        )}
                      </div>
                    )}
                  </ReceiptModuleCard>
                ))}

                {/* Trade Plan - Always Visible */}
                <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-semibold text-slate-200">Trade Plan</h3>
                    {calculateRR && (
                      <Badge className="ml-auto bg-purple-500/20 text-purple-300 border-purple-500/30">
                        R:R 1:{calculateRR}
                      </Badge>
                    )}
                  </div>

                  {/* Direction */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTradePlan((p) => ({ ...p, direction: "long" }))}
                      className={cn(
                        "flex-1 h-9",
                        tradePlan.direction === "long"
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                          : "border-slate-600/40 text-slate-400"
                      )}
                    >
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      Long
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTradePlan((p) => ({ ...p, direction: "short" }))}
                      className={cn(
                        "flex-1 h-9",
                        tradePlan.direction === "short"
                          ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                          : "border-slate-600/40 text-slate-400"
                      )}
                    >
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                      Short
                    </Button>
                  </div>

                  {/* Entry/SL/TP */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-1">Entry</label>
                      <input
                        type="text"
                        value={tradePlan.entry}
                        onChange={(e) => setTradePlan((p) => ({ ...p, entry: e.target.value }))}
                        placeholder="1.08500"
                        className="w-full h-8 px-2 text-xs font-mono bg-slate-800/60 border border-slate-600/40 rounded text-slate-200 placeholder:text-slate-600 focus:border-purple-500/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-1">Stop Loss</label>
                      <input
                        type="text"
                        value={tradePlan.stopLoss}
                        onChange={(e) => setTradePlan((p) => ({ ...p, stopLoss: e.target.value }))}
                        placeholder="1.08200"
                        className="w-full h-8 px-2 text-xs font-mono bg-slate-800/60 border border-slate-600/40 rounded text-rose-400 placeholder:text-slate-600 focus:border-rose-500/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-1">Take Profit</label>
                      <input
                        type="text"
                        value={tradePlan.takeProfit}
                        onChange={(e) => setTradePlan((p) => ({ ...p, takeProfit: e.target.value }))}
                        placeholder="1.09100"
                        className="w-full h-8 px-2 text-xs font-mono bg-slate-800/60 border border-slate-600/40 rounded text-emerald-400 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Invalidation */}
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Invalidation</label>
                    <input
                      type="text"
                      value={tradePlan.invalidation}
                      onChange={(e) => setTradePlan((p) => ({ ...p, invalidation: e.target.value }))}
                      placeholder="Breaks above 1.09500"
                      className="w-full h-8 px-2 text-xs bg-slate-800/60 border border-slate-600/40 rounded text-slate-200 placeholder:text-slate-600 focus:border-purple-500/50 focus:outline-none"
                    />
                  </div>

                  {/* Management Notes */}
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Management Notes</label>
                    <input
                      type="text"
                      value={tradePlan.managementNotes}
                      onChange={(e) => setTradePlan((p) => ({ ...p, managementNotes: e.target.value }))}
                      placeholder="Move SL to BE after 1R"
                      className="w-full h-8 px-2 text-xs bg-slate-800/60 border border-slate-600/40 rounded text-slate-200 placeholder:text-slate-600 focus:border-purple-500/50 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Commentary */}
                <div className="rounded-xl border border-slate-700/40 bg-slate-900/50 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <h3 className="text-sm font-semibold text-slate-200">Commentary</h3>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-purple-400 hover:text-purple-300">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Enhance with AI
                    </Button>
                  </div>
                  <Textarea
                    value={commentary}
                    onChange={(e) => setCommentary(e.target.value)}
                    placeholder="Explain structure, session timing, catalyst, and invalidation. Keep it factual."
                    className="min-h-[100px] resize-none text-sm bg-slate-800/60 border-slate-600/40 focus:border-purple-500/50 text-slate-200 placeholder:text-slate-600"
                  />
                  <p className="text-[10px] text-slate-500">
                    {commentary.length} characters
                  </p>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="flex-shrink-0 p-4 border-t border-slate-700/50 bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    className="border-slate-600/40 text-slate-400 hover:bg-slate-800/50 bg-transparent"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!tradePlan.direction}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Forecast
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
