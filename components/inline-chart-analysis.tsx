"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  TrendingUp, TrendingDown, Clock, Droplets, Globe, Target,
  Brain, History, Activity, Maximize2, RefreshCw, Lock, Unlock,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Instrument } from "@/lib/instruments"
import { multiTimeframeAnalysisEngine, type MultiTimeframeAnalysis } from "@/lib/multi-timeframe-analysis"
import { sessionAnalysisEngine, type SessionAnalysis } from "@/lib/session-analysis"
import { liquidityAnalysisEngine, type LiquidityAnalysis } from "@/lib/liquidity-analysis"
import { macroAnalysisEngine, type MacroAnalysis } from "@/lib/macro-analysis"
import { MultiTimeframeDisplay } from "@/components/multi-timeframe-display"
import { SessionAnalysisDisplay } from "@/components/session-analysis-display"
import { LiquidityAnalysisDisplay } from "@/components/liquidity-analysis-display"
import { MacroAnalysisDisplay } from "@/components/macro-analysis-display"
import { StrategicReviewTab } from "@/components/strategic-review-tab"
import { useAnalysis } from "@/lib/stores/useAnalysis"
import { activityAnalyzeRun } from "@/lib/copilot/activityApi"
import {
  SURFACE, ACCENT, TAB_ACCENT, ELEVATION, RADIUS,
  MOTION, TYPE, GLOW, GRADIENT
} from "@/components/mtf/mtf-theme"

/* ═══════════════════════════════════════════════════════════════════
   INLINE CHART ANALYSIS CANVAS v3 -- Premium Redesign
   ─────────────────────────────────────────────────────────────────
   Deep-space premium analysis panel with progressive tab unlocking,
   ambient glow header, live data ribbon, and phase-colored accents.
   ═══════════════════════════════════════════════════════════════════ */

const ANALYSIS_TABS = [
  { id: "multi-timeframe" as const, label: "MTF", icon: TrendingUp, accentKey: "mtf" },
  { id: "sessions" as const, label: "Sessions", icon: Clock, accentKey: "sessions" },
  { id: "liquidity" as const, label: "Liquidity", icon: Droplets, accentKey: "liquidity" },
  { id: "macro" as const, label: "Macro", icon: Globe, accentKey: "macro" },
  { id: "levels" as const, label: "Levels", icon: Target, accentKey: "levels" },
  { id: "structure" as const, label: "Structure", icon: Brain, accentKey: "structure" },
  { id: "history" as const, label: "History", icon: History, accentKey: "history" },
] as const

const FORECAST_TAB = { id: "forecast" as const, label: "Forecast", icon: Sparkles, accentKey: "forecast" }

type TabId = (typeof ANALYSIS_TABS)[number]["id"] | "forecast"

const TAB_ORDER: TabId[] = [
  "multi-timeframe", "sessions", "liquidity", "macro", "levels", "structure", "history",
]

const ENGINE_STATUS = [
  { key: "mtf", label: "MTF", rgb: ACCENT.emerald.rgb },
  { key: "sessions", label: "Sessions", rgb: ACCENT.cyan.rgb },
  { key: "liquidity", label: "Liquidity", rgb: ACCENT.blue.rgb },
  { key: "macro", label: "Macro", rgb: ACCENT.amber.rgb },
]

interface InlineChartAnalysisProps {
  activeInstrument: Instrument
  onOpenFullModal?: () => void
}

/* ── Premium shimmer skeleton ── */
function PremiumSkeleton() {
  return (
    <div className="space-y-4 py-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="relative overflow-hidden"
          style={{ background: SURFACE.card, borderRadius: RADIUS.card }}
        >
          <div className="p-6 space-y-3">
            <div className="h-3 rounded" style={{ background: SURFACE.recess, width: "40%" }} />
            <div className="h-24 rounded-xl" style={{ background: SURFACE.recess }} />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-16 rounded-xl" style={{ background: SURFACE.recess }} />
              <div className="h-16 rounded-xl" style={{ background: SURFACE.recess }} />
            </div>
          </div>
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
            style={{ background: GRADIENT.shimmer, width: "50%" }}
          />
        </div>
      ))}
    </div>
  )
}

/* ── Coming Soon placeholder for future tabs ── */
function ComingSoonPlaceholder({
  icon: Icon,
  label,
  accentKey,
}: {
  icon: React.ElementType
  label: string
  accentKey: string
}) {
  const accent = TAB_ACCENT[accentKey] || ACCENT.slate
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <motion.div
        className="w-14 h-14 flex items-center justify-center mb-4"
        style={{
          background: `rgba(${accent.rgb},0.05)`,
          borderRadius: RADIUS.card,
          boxShadow: GLOW.low(accent.rgb),
        }}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon className="w-6 h-6" style={{ color: `rgba(${accent.rgb},0.4)` }} />
      </motion.div>
      <span className={TYPE.subtitle} style={{ color: `rgba(${accent.rgb},0.5)` }}>
        {label}
      </span>
      <span className="text-[9px] font-mono text-slate-600 mt-2 tracking-wider uppercase">
        Module loading
      </span>
    </div>
  )
}

/* ── Forecast locked state ── */
function ForecastLockedPlaceholder({
  completedCount,
  totalRequired,
}: {
  completedCount: number
  totalRequired: number
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        className="relative w-20 h-20 flex items-center justify-center mb-6"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
          <circle
            cx="40" cy="40" r="36" fill="none"
            stroke={`rgba(${ACCENT.amber.rgb},0.08)`}
            strokeWidth="1"
          />
          <circle
            cx="40" cy="40" r="36" fill="none"
            stroke={`rgba(${ACCENT.amber.rgb},0.4)`}
            strokeWidth="1.5"
            strokeDasharray={`${(completedCount / totalRequired) * 226} 226`}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
          />
        </svg>
        <Lock className="w-6 h-6" style={{ color: `rgba(${ACCENT.amber.rgb},0.35)` }} />
      </motion.div>
      <span className={TYPE.subtitle} style={{ color: `rgba(${ACCENT.amber.rgb},0.55)` }}>
        Forecast Locked
      </span>
      <p className="text-[11px] text-slate-500 mt-2 text-center max-w-xs leading-relaxed">
        {"Complete all "}{totalRequired}{" analysis tabs to unlock AI forecast."}
        {completedCount > 0 && ` ${completedCount}/${totalRequired} complete.`}
      </p>
      <div className="flex gap-2 mt-4">
        {TAB_ORDER.slice(0, totalRequired).map((tabId, i) => {
          const tc = ANALYSIS_TABS.find((t) => t.id === tabId)
          const a = TAB_ACCENT[tc?.accentKey || "slate"]
          return (
            <div
              key={tabId}
              className="w-2 h-2 rounded-full transition-all duration-500"
              style={{
                background: i < completedCount ? `rgba(${a.rgb},0.6)` : "rgba(148,163,184,0.08)",
                boxShadow: i < completedCount ? `0 0 8px rgba(${a.rgb},0.3)` : "none",
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export function InlineChartAnalysis({ activeInstrument, onOpenFullModal }: InlineChartAnalysisProps) {
  const [activeTab, setActiveTab] = useState<TabId>("multi-timeframe")
  const [isAnalysisLoaded, setIsAnalysisLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [analysis, setAnalysis] = useState<MultiTimeframeAnalysis | null>(null)
  const [sessionAnalysis, setSessionAnalysis] = useState<SessionAnalysis | null>(null)
  const [liquidityAnalysis, setLiquidityAnalysis] = useState<LiquidityAnalysis | null>(null)
  const [macroAnalysis, setMacroAnalysis] = useState<MacroAnalysis | null>(null)
  const [lastLoadedPair, setLastLoadedPair] = useState("")
  const [loadedAt, setLoadedAt] = useState<Date | null>(null)
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)

  /* ── Tab progression ── */
  const [completedTabs, setCompletedTabs] = useState<Set<TabId>>(new Set())
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<TabId | null>(null)
  const tabTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [forecastUnlocked, setForecastUnlocked] = useState(false)
  const [forecastJustUnlocked, setForecastJustUnlocked] = useState(false)
  const [enginesLoaded, setEnginesLoaded] = useState<Set<string>>(new Set())

  const REQUIRED_TABS: TabId[] = useMemo(
    () => ["multi-timeframe", "sessions", "liquidity", "macro", "levels", "structure"],
    [],
  )

  /* ── Timer: 3s to complete a tab ── */
  useEffect(() => {
    if (tabTimerRef.current) clearTimeout(tabTimerRef.current)

    tabTimerRef.current = setTimeout(() => {
      setCompletedTabs((prev) => {
        if (prev.has(activeTab)) return prev
        const next = new Set(prev)
        next.add(activeTab)

        const ci = TAB_ORDER.indexOf(activeTab)
        if (ci >= 0 && ci < TAB_ORDER.length - 1) {
          const nt = TAB_ORDER[ci + 1]
          if (!prev.has(nt)) {
            setRecentlyUnlocked(nt)
            setTimeout(() => setRecentlyUnlocked(null), 1200)
          }
        }

        if (REQUIRED_TABS.every((t) => next.has(t)) && !forecastUnlocked) {
          setForecastUnlocked(true)
          setForecastJustUnlocked(true)
          setTimeout(() => setForecastJustUnlocked(false), 2500)
        }

        return next
      })
    }, MOTION.tabViewTime)

    return () => {
      if (tabTimerRef.current) clearTimeout(tabTimerRef.current)
    }
  }, [activeTab, REQUIRED_TABS, forecastUnlocked])

  const isTabLocked = useCallback(
    (tabId: TabId): boolean => {
      if (tabId === "multi-timeframe") return false
      if (tabId === "forecast") return !forecastUnlocked
      const idx = TAB_ORDER.indexOf(tabId)
      if (idx <= 0) return false
      return !completedTabs.has(TAB_ORDER[idx - 1])
    },
    [completedTabs, forecastUnlocked],
  )

  /* ── Analysis loading ── */
  const loadAnalysis = useCallback(async (pair: string, isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true)
    else setIsLoading(true)
    setEnginesLoaded(new Set())

    try {
      const [mtfR, sesR, liqR, macR] = await Promise.all([
        multiTimeframeAnalysisEngine.analyzeMultiTimeframe(pair).then((r) => {
          setEnginesLoaded((p) => new Set(p).add("mtf"))
          return r
        }),
        sessionAnalysisEngine.analyzeSessionData(pair).then((r) => {
          setEnginesLoaded((p) => new Set(p).add("sessions"))
          return r
        }),
        liquidityAnalysisEngine.analyzeLiquidity(pair).then((r) => {
          setEnginesLoaded((p) => new Set(p).add("liquidity"))
          return r
        }),
        macroAnalysisEngine.analyzeMacroeconomics(pair).then((r) => {
          setEnginesLoaded((p) => new Set(p).add("macro"))
          return r
        }),
      ])

      setAnalysis(mtfR)
      setSessionAnalysis(sesR)
      setLiquidityAnalysis(liqR)
      setMacroAnalysis(macR)
      setIsAnalysisLoaded(true)
      setLastLoadedPair(pair)
      setLoadedAt(new Date())

      const { loadSnapshot, loadBankingSessions, loadMultiTFBars } = useAnalysis.getState()
      await Promise.all([
        loadSnapshot(pair).catch(() => {}),
        loadBankingSessions(pair, Date.now()).catch(() => {}),
        loadMultiTFBars(pair).catch(() => {}),
      ])
      activityAnalyzeRun({ instrument: pair })
    } catch (error) {
      console.error("[InlineAnalysis] Analysis failed:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    const pair = activeInstrument.symbol?.toUpperCase() || "EURUSD"
    if (pair !== lastLoadedPair) loadAnalysis(pair)
  }, [activeInstrument.symbol, lastLoadedPair, loadAnalysis])

  const handleRefresh = () => {
    loadAnalysis(activeInstrument.symbol?.toUpperCase() || "EURUSD", true)
  }

  /* ── Derived ── */
  const activeTabConfig =
    [...ANALYSIS_TABS, FORECAST_TAB].find((t) => t.id === activeTab) || ANALYSIS_TABS[0]
  const tabAccent = TAB_ACCENT[activeTabConfig.accentKey] || ACCENT.slate
  const bias = analysis?.confluence?.overallBias || "neutral"
  const confidence = analysis?.confluence?.confidence || 0
  const biasAccent = bias === "bullish" ? ACCENT.emerald : bias === "bearish" ? ACCENT.rose : ACCENT.slate
  const BiasIcon = bias === "bullish" ? TrendingUp : bias === "bearish" ? TrendingDown : Activity
  const completedCount = REQUIRED_TABS.filter((t) => completedTabs.has(t)).length

  const visibleTabs = useMemo(() => {
    const tabs: Array<{ id: string; label: string; icon: React.ElementType; accentKey: string }> = [
      ...ANALYSIS_TABS,
    ]
    if (forecastUnlocked) tabs.push(FORECAST_TAB)
    return tabs
  }, [forecastUnlocked])

  return (
    <div className="relative">
      {/* ═══ HEADER BAR ═══ */}
      <div
        className="relative overflow-hidden mb-3"
        style={{
          background: SURFACE.card,
          borderRadius: RADIUS.card,
          boxShadow: ELEVATION.flat,
        }}
      >
        <div className="px-5 py-3.5 flex items-center gap-3">
          {/* Left cluster */}
          <div className="flex items-center gap-3">
            <div
              className="w-[3px] h-7 rounded-full"
              style={{
                background: `linear-gradient(180deg, rgba(${tabAccent.rgb},0.6), rgba(${tabAccent.rgb},0.15))`,
              }}
            />
            <motion.div
              animate={isRefreshing ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <TrendingUp className="w-4 h-4" style={{ color: `rgba(${tabAccent.rgb},0.5)` }} />
            </motion.div>
            <span className={TYPE.subtitle} style={{ color: "rgba(226,232,240,0.55)" }}>
              Chart Analysis
            </span>
            <span
              className="px-2 py-0.5 text-[7px] font-mono font-bold uppercase tracking-[0.18em] leading-none"
              style={{
                background: `rgba(${ACCENT.emerald.rgb},0.08)`,
                color: `rgba(${ACCENT.emerald.rgb},0.65)`,
                borderRadius: RADIUS.badge,
                boxShadow: GLOW.low(ACCENT.emerald.rgb),
              }}
            >
              Pro
            </span>
            <span className="text-[10px] font-mono text-slate-500 tracking-wide">
              {activeInstrument.symbol}
            </span>
          </div>

          {/* Center -- live data ribbon */}
          <div className="flex-1 flex items-center justify-center gap-4">
            {isAnalysisLoaded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-4"
              >
                <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                <div className="w-px h-3" style={{ background: SURFACE.divider }} />
                <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">
                  {completedCount}/{REQUIRED_TABS.length} Modules
                </span>
              </motion.div>
            )}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            {isAnalysisLoaded && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: MOTION.ease }}
                className="flex items-center gap-2 px-3 py-1.5"
                style={{
                  background: `rgba(${biasAccent.rgb},0.05)`,
                  borderRadius: RADIUS.pill,
                  boxShadow: GLOW.low(biasAccent.rgb),
                }}
              >
                <span className="relative flex h-2 w-2">
                  <motion.span
                    className="absolute inline-flex h-full w-full rounded-full"
                    style={{ background: `rgba(${biasAccent.rgb},0.3)` }}
                    animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ background: `rgba(${biasAccent.rgb},0.7)` }}
                  />
                </span>
                <BiasIcon className="w-3 h-3" style={{ color: `rgba(${biasAccent.rgb},0.7)` }} />
                <span
                  className="text-[9px] font-mono font-bold uppercase tracking-wider"
                  style={{ color: `rgba(${biasAccent.rgb},0.8)` }}
                >
                  {bias}
                </span>
                <div
                  className="w-12 h-1 rounded-full overflow-hidden"
                  style={{ background: SURFACE.recess }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence}%` }}
                    transition={{ duration: 1, ease: MOTION.ease }}
                    style={{ background: `rgba(${biasAccent.rgb},0.5)` }}
                  />
                </div>
                <span
                  className="text-[8px] font-mono"
                  style={{ color: `rgba(${biasAccent.rgb},0.4)` }}
                >
                  {confidence}%
                </span>
              </motion.div>
            )}

            <motion.button
              onClick={handleRefresh}
              disabled={isRefreshing}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="w-7 h-7 flex items-center justify-center transition-all duration-300"
              style={{ borderRadius: RADIUS.badge, background: "rgba(255,255,255,0.02)" }}
            >
              <RefreshCw
                className={cn(
                  "w-3 h-3 text-slate-500 transition-colors hover:text-slate-300",
                  isRefreshing && "animate-spin",
                )}
              />
            </motion.button>

            {onOpenFullModal && (
              <motion.button
                onClick={onOpenFullModal}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 transition-all duration-300"
                style={{ borderRadius: RADIUS.badge, background: "rgba(255,255,255,0.02)" }}
              >
                <Maximize2 className="w-3 h-3 text-slate-500" />
                <span className="hidden sm:inline text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                  Expand
                </span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Header bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: GRADIENT.headerLine(tabAccent.rgb) }}
        />
      </div>

      {/* ═══ TAB NAVIGATION ═══ */}
      <div className="mb-3">
        <div
          className="flex items-center gap-0.5 p-1 overflow-x-auto"
          role="tablist"
          aria-label="Analysis tabs"
          style={{
            background: SURFACE.recess,
            borderRadius: RADIUS.inner,
            scrollbarWidth: "none",
          }}
        >
          {visibleTabs.map((tab) => {
            const isActive = activeTab === tab.id
            const isHov = hoveredTab === tab.id
            const locked = isTabLocked(tab.id as TabId)
            const isUnlocking = recentlyUnlocked === tab.id
            const isForecast = tab.id === "forecast"
            const accent = TAB_ACCENT[tab.accentKey] || ACCENT.slate
            const TabIcon = tab.icon

            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-disabled={locked}
                onClick={() => !locked && setActiveTab(tab.id as TabId)}
                onMouseEnter={() => setHoveredTab(tab.id)}
                onMouseLeave={() => setHoveredTab(null)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2.5 whitespace-nowrap flex-shrink-0 transition-all duration-300",
                  locked && "cursor-not-allowed",
                )}
                style={{
                  borderRadius: RADIUS.badge,
                  opacity: locked ? 0.2 : isActive ? 1 : isHov ? 0.7 : 0.45,
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="analysisTabBg"
                    className="absolute inset-0"
                    style={{
                      borderRadius: RADIUS.badge,
                      background: `rgba(${accent.rgb},0.07)`,
                      boxShadow: `0 4px 16px rgba(${accent.rgb},0.06)`,
                    }}
                    transition={MOTION.spring}
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId="analysisTabEdge"
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
                    style={{ background: `rgba(${accent.rgb},0.7)` }}
                    transition={MOTION.spring}
                  />
                )}
                {isUnlocking && (
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    initial={{ scale: 0.85, opacity: 0.6 }}
                    animate={{ scale: [0.85, 1.08, 1], opacity: [0.6, 0.4, 0] }}
                    transition={{ duration: 0.8, ease: MOTION.ease }}
                    style={{ background: `rgba(${accent.rgb},0.15)` }}
                  />
                )}
                {isForecast && forecastJustUnlocked && (
                  <motion.div
                    className="absolute inset-[-2px] rounded-lg"
                    animate={{ opacity: [0, 0.5, 0], scale: [0.95, 1.05, 0.95] }}
                    transition={{ duration: 1.5, repeat: 3 }}
                    style={{ background: "transparent", boxShadow: GLOW.med(ACCENT.amber.rgb) }}
                  />
                )}

                <span className="relative z-10">
                  {locked ? (
                    isUnlocking ? (
                      <motion.span
                        initial={{ rotate: -15 }}
                        animate={{ rotate: 0, scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Unlock className="w-3.5 h-3.5 text-slate-500" />
                      </motion.span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                    )
                  ) : (
                    <TabIcon
                      className="w-3.5 h-3.5 transition-colors duration-300"
                      style={{
                        color: isActive
                          ? `rgba(${accent.rgb},0.85)`
                          : isHov
                            ? `rgba(${accent.rgb},0.5)`
                            : "rgba(148,163,184,0.3)",
                      }}
                    />
                  )}
                </span>

                <span
                  className="relative z-10 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors duration-300"
                  style={{
                    color: isActive
                      ? `rgba(${accent.rgb},0.9)`
                      : isHov
                        ? "rgba(226,232,240,0.5)"
                        : "rgba(148,163,184,0.3)",
                  }}
                >
                  {tab.label}
                </span>

                {completedTabs.has(tab.id as TabId) && !isActive && (
                  <div
                    className="w-1.5 h-1.5 rounded-full relative z-10"
                    style={{
                      background: `rgba(${accent.rgb},0.4)`,
                      boxShadow: `0 0 4px rgba(${accent.rgb},0.2)`,
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {REQUIRED_TABS.map((tabId) => {
            const tc = ANALYSIS_TABS.find((t) => t.id === tabId)
            const a = TAB_ACCENT[tc?.accentKey || "slate"]
            const done = completedTabs.has(tabId)
            return (
              <motion.div
                key={tabId}
                className="rounded-full transition-all duration-500"
                animate={{ width: done ? 6 : 4, height: done ? 6 : 4 }}
                style={{
                  background: done ? `rgba(${a.rgb},0.5)` : "rgba(148,163,184,0.06)",
                  boxShadow: done ? `0 0 6px rgba(${a.rgb},0.25)` : "none",
                }}
              />
            )
          })}
          <motion.div
            className="rounded-full"
            animate={{
              width: forecastUnlocked ? 8 : 4,
              height: forecastUnlocked ? 8 : 4,
              opacity: forecastUnlocked ? 1 : 0.3,
            }}
            style={{
              background: forecastUnlocked
                ? `rgba(${ACCENT.amber.rgb},0.6)`
                : "rgba(148,163,184,0.04)",
              boxShadow: forecastUnlocked ? GLOW.med(ACCENT.amber.rgb) : "none",
            }}
          />
        </div>
      </div>

      {/* ═══ CONTENT CANVAS ═══ */}
      <div
        className="relative overflow-hidden"
        role="tabpanel"
        aria-label={`${activeTabConfig.label} analysis`}
        style={{
          background: SURFACE.void,
          borderRadius: RADIUS.card,
          boxShadow: ELEVATION.card,
        }}
      >
        {/* Top accent line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] z-10"
          style={{ background: GRADIENT.headerLine(tabAccent.rgb) }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div
          className="px-4 py-3 min-h-[360px] max-h-[800px] overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.03) transparent",
          }}
        >
          <AnimatePresence mode="wait">
            {isLoading && !isAnalysisLoaded ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PremiumSkeleton />
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: MOTION.ease }}
              >
                {activeTab === "multi-timeframe" && (
                  <MultiTimeframeDisplay
                    analysis={analysis}
                    isLoading={isLoading || isRefreshing}
                  />
                )}
                {activeTab === "sessions" && (
                  <SessionAnalysisDisplay
                    analysis={sessionAnalysis}
                    isLoading={isLoading || isRefreshing}
                  />
                )}
                {activeTab === "liquidity" && (
                  <LiquidityAnalysisDisplay
                    analysis={liquidityAnalysis}
                    isLoading={isLoading || isRefreshing}
                  />
                )}
                {activeTab === "macro" && (
                  <MacroAnalysisDisplay
                    analysis={macroAnalysis}
                    isLoading={isLoading || isRefreshing}
                  />
                )}
                {activeTab === "structure" && (
                  <StrategicReviewTab
                    forecast={{
                      id: "inline-analysis",
                      symbol: activeInstrument.symbol,
                      direction: analysis?.confluence.overallBias || "neutral",
                      confidence: analysis?.confluence.confidence || 50,
                      timeframe: "Multi-TF",
                      createdAt: new Date(),
                      analysisData: {
                        confluences: analysis?.weekly.keyLevels.map((l) => l.type) || [],
                        psychology: {
                          focus: 85,
                          discipline: 90,
                          biases: ["Confirmation Bias", "Anchoring"],
                        },
                        executionDetails: {
                          entry: "Market Order",
                          stopLoss: "2% below entry",
                          takeProfit: "Multiple targets",
                          riskReward: "1:3",
                          timeframe: "4H-Daily",
                          duration: "3-5 days",
                          session: "London/NY Overlap",
                        },
                        aiStrategicRationale:
                          "High-probability setup with multiple confluences",
                      },
                    }}
                  />
                )}
                {activeTab === "levels" && (
                  <ComingSoonPlaceholder
                    icon={Target}
                    label="Advanced Levels"
                    accentKey="levels"
                  />
                )}
                {activeTab === "history" && (
                  <ComingSoonPlaceholder
                    icon={History}
                    label="Analysis History"
                    accentKey="history"
                  />
                )}
                {activeTab === "forecast" &&
                  (forecastUnlocked ? (
                    <ComingSoonPlaceholder
                      icon={Sparkles}
                      label="AI Forecast"
                      accentKey="forecast"
                    />
                  ) : (
                    <ForecastLockedPlaceholder
                      completedCount={completedCount}
                      totalRequired={REQUIRED_TABS.length}
                    />
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Loading progress bar */}
        {(isLoading || isRefreshing) && (
          <motion.div
            className="absolute bottom-0 left-0 h-[2px]"
            initial={{ width: "0%" }}
            animate={{ width: `${(enginesLoaded.size / 4) * 100}%` }}
            transition={{ duration: 0.5, ease: MOTION.ease }}
            style={{
              background: `linear-gradient(90deg, rgba(${tabAccent.rgb},0.5), rgba(${ACCENT.purple.rgb},0.5))`,
              boxShadow: `0 0 8px rgba(${tabAccent.rgb},0.3)`,
            }}
          />
        )}

        {/* ═══ STATUS BAR ═══ */}
        <div
          className="relative flex items-center gap-3 px-4 py-2.5"
          style={{
            background: SURFACE.card,
            borderTop: "1px solid rgba(255,255,255,0.02)",
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-[5px] w-[5px]">
              {isAnalysisLoaded && !isLoading && (
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40"
                  style={{ background: `rgba(${ACCENT.emerald.rgb},0.5)` }}
                />
              )}
              <span
                className="relative inline-flex rounded-full h-[5px] w-[5px]"
                style={{
                  background: isLoading
                    ? `rgba(${ACCENT.amber.rgb},0.6)`
                    : isAnalysisLoaded
                      ? `rgba(${ACCENT.emerald.rgb},0.6)`
                      : "rgba(148,163,184,0.15)",
                }}
              />
            </span>
            <span
              className="text-[8px] font-mono font-semibold uppercase tracking-wider"
              style={{ color: "rgba(148,163,184,0.3)" }}
            >
              {isLoading
                ? "Analyzing"
                : isRefreshing
                  ? "Refreshing"
                  : isAnalysisLoaded
                    ? "Live"
                    : "Idle"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {ENGINE_STATUS.map((eng) => (
              <div key={eng.key} title={eng.label}>
                <div
                  className="w-[4px] h-[4px] rounded-full transition-all duration-500"
                  style={{
                    background: enginesLoaded.has(eng.key)
                      ? `rgba(${eng.rgb},0.6)`
                      : isLoading
                        ? `rgba(${eng.rgb},0.15)`
                        : "rgba(148,163,184,0.06)",
                    boxShadow: enginesLoaded.has(eng.key)
                      ? `0 0 4px rgba(${eng.rgb},0.3)`
                      : "none",
                  }}
                />
              </div>
            ))}
          </div>

          {loadedAt && (
            <>
              <div className="w-px h-2.5" style={{ background: "rgba(255,255,255,0.03)" }} />
              <span className="text-[7px] font-mono" style={{ color: "rgba(148,163,184,0.2)" }}>
                {loadedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </>
          )}

          <div className="flex-1" />

          <span
            className="text-[7px] font-mono uppercase tracking-wider"
            style={{ color: "rgba(148,163,184,0.12)" }}
          >
            {enginesLoaded.size} of 4 engines
          </span>

          {isRefreshing && (
            <motion.div
              className="absolute bottom-2.5 left-4 h-px"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "50%", opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                background: `linear-gradient(90deg, transparent, rgba(${tabAccent.rgb},0.4), transparent)`,
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
