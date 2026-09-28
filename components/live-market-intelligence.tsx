"use client"

import type React from "react"
import { generateUUID } from "@/lib/utils/uuid"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronDown, TrendingUp, TrendingDown, History, SlidersHorizontal, Eye, EyeOff, RotateCcw, GripVertical, Pencil, Check, Activity as ActivityIcon, Calculator, Rss, GitBranch, CalendarDays, Gauge, BarChart2, Bell, Palette, Layers } from "lucide-react"
import { TradingViewWidget } from "@/components/trading-view-widget"
import { FloatingConfluencePanel } from "@/components/floating-confluence-panel"
import { allInstruments, instrumentsByCategory, type Instrument } from "@/lib/instruments"
import { InstrumentSearchModal } from "@/components/execution-copilot/instrument-search-modal"

import { EnhancedInstrumentSelector } from "@/components/enhanced-instrument-selector"
import { PremiumChartAnalysisModal } from "@/components/premium-chart-analysis-modal"
import { InlineChartAnalysis } from "@/components/inline-chart-analysis"
import { AnalysisHistoryModal } from "@/components/analysis-history-modal"
import { useInstrument } from "@/lib/stores/useInstrument"
import { useAnalysis } from "@/lib/stores/useAnalysis"
import { normalizePair } from "@/lib/market/symbols"
import { CopilotRightRail } from "@/components/copilot/CopilotRightRail"
import { copilotBus } from "@/lib/copilot/eventBus"
import { activityAnalyzeRun } from "@/lib/copilot/activityApi"
import { MarketStateInstrument } from "@/components/market-state-instrument"
import { useNavigatorConfig, type NavSection } from "@/lib/stores/useNavigatorConfig"
import { TradeJournalDashboard } from "@/components/copilot/journal/TradeJournalDashboard"


import { TradeExecutionPanel } from "@/components/copilot/trade/TradeExecutionPanel"
import {
  FileText, MessageCircle, Crosshair as CrosshairIcon,
  ArrowDown, X, Activity, Clock, Droplets, Globe, Maximize2
} from "lucide-react"

const getTradingViewSymbol = (instrument: { symbol: string }) => {
  const s = instrument.symbol.toUpperCase().replace(/[^A-Z]/g, "")
  return `OANDA:${s}`
  // e.g. OANDA:GBPUSD
}

/* CompactTimeDisplay replaced by MarketStateInstrument */

/* Price data helper for dropdown */
const generateMockPriceData = (symbol: string) => {
  // Deterministic seed from symbol so values don't flicker on re-render
  let seed = 0
  for (let i = 0; i < symbol.length; i++) seed = (seed * 31 + symbol.charCodeAt(i)) | 0
  const r = (s: number) => { s = Math.sin(s) * 10000; return s - Math.floor(s) }
  const basePrice = r(seed) * 100 + 1
  const change = (r(seed + 1) - 0.5) * 10
  const changePercent = (change / basePrice) * 100
  return {
    price: basePrice.toFixed(symbol.includes("JPY") ? 3 : 5),
    changePercent: changePercent.toFixed(2),
    isPositive: change >= 0,
  }
}

const getCategoryColor = (cat: string) => {
  switch (cat) {
    case "forex": return "from-cyan-500/20 to-blue-500/20"
    case "indices": return "from-amber-500/20 to-orange-500/20"
    case "crypto": return "from-orange-500/20 to-yellow-500/20"
    case "commodities": return "from-emerald-500/20 to-green-500/20"
    default: return "from-white/10 to-white/5"
  }
}

/* Category visual identity map */
const CATEGORY_IDENTITY: Record<string, { color: string; hoverColor: string; glowColor: string; icon: React.ReactNode }> = {
  forex: {
    color: "text-cyan-400/40",
    hoverColor: "group-hover/cat:text-cyan-300/90",
    glowColor: "from-cyan-500/[0.08]",
    icon: (
      <svg viewBox="0 0 18 18" className="w-4 h-4" fill="none">
        <motion.path d="M4 13 L7 9 L10 11 L14 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3, ease: "easeOut" }} />
        <circle cx="14" cy="5" r="1.5" fill="currentColor" opacity="0.6" />
        <path d="M2 15h14" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      </svg>
    ),
  },
  indices: {
    color: "text-amber-400/40",
    hoverColor: "group-hover/cat:text-amber-300/90",
    glowColor: "from-amber-500/[0.08]",
    icon: (
      <svg viewBox="0 0 18 18" className="w-4 h-4" fill="none">
        <motion.rect x="3" y="10" width="2.5" height="6" rx="0.5" fill="currentColor" opacity="0.3"
          animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }} />
        <motion.rect x="7" y="6" width="2.5" height="10" rx="0.5" fill="currentColor" opacity="0.5"
          animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} />
        <motion.rect x="11" y="3" width="2.5" height="13" rx="0.5" fill="currentColor" opacity="0.7"
          animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} />
        <path d="M2 16h14" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      </svg>
    ),
  },
  crypto: {
    color: "text-orange-400/40",
    hoverColor: "group-hover/cat:text-orange-300/90",
    glowColor: "from-orange-500/[0.08]",
    icon: (
      <svg viewBox="0 0 18 18" className="w-4 h-4" fill="none">
        <motion.circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1" opacity="0.3"
          animate={{ r: [5.5, 6.5, 5.5], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
        <motion.path d="M9 5v8M7 7h4M7 11h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
          animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
      </svg>
    ),
  },
  commodities: {
    color: "text-emerald-400/40",
    hoverColor: "group-hover/cat:text-emerald-300/90",
    glowColor: "from-emerald-500/[0.08]",
    icon: (
      <svg viewBox="0 0 18 18" className="w-4 h-4" fill="none">
        <motion.path d="M9 3 L14 9 L9 15 L4 9 Z" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.08"
          animate={{ fillOpacity: [0.05, 0.15, 0.05], scale: [0.95, 1.05, 0.95] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
        <motion.path d="M4 9h10" stroke="currentColor" strokeWidth="0.7" opacity="0.3"
          animate={{ opacity: [0.15, 0.4, 0.15] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
      </svg>
    ),
  },
}

/* Mini sparkline generator from symbol hash */
const generateSparkline = (symbol: string): number[] => {
  let seed = 0
  for (let i = 0; i < symbol.length; i++) seed = (seed * 31 + symbol.charCodeAt(i)) | 0
  const r = (s: number) => { s = Math.sin(s) * 10000; return s - Math.floor(s) }
  return Array.from({ length: 12 }, (_, i) => 20 + r(seed + i) * 60)
}

const CATEGORY_ACCENT: Record<string, { hex: string; rgb: string; hoverBg: string }> = {
  forex: { hex: "#22d3ee", rgb: "34,211,238", hoverBg: "hover:bg-cyan-500/[0.04]" },
  indices: { hex: "#fbbf24", rgb: "251,191,36", hoverBg: "hover:bg-amber-500/[0.04]" },
  crypto: { hex: "#fb923c", rgb: "251,146,60", hoverBg: "hover:bg-orange-500/[0.04]" },
  commodities: { hex: "#34d399", rgb: "52,211,153", hoverBg: "hover:bg-emerald-500/[0.04]" },
}

const HybridInstrumentSelector = ({
  instruments,
  onSelect,
  label,
  category,
}: {
  instruments: Instrument[]
  onSelect: (instrument: Instrument) => void
  label: string
  category: string
}) => {
  const [showEnhancedSelector, setShowEnhancedSelector] = useState(false)
  const [buttonPosition, setButtonPosition] = useState<{ top: number; left: number } | undefined>()
  const defaultFavorites = useMemo(() => instruments.slice(0, 6), [instruments])
  const [favorites, setFavorites] = useState<Instrument[]>(defaultFavorites)
  const identity = CATEGORY_IDENTITY[category] || CATEGORY_IDENTITY.forex
  const accent = CATEGORY_ACCENT[category] || CATEGORY_ACCENT.forex

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const saved = window.localStorage.getItem(`favorites_${category}`)
      if (saved) {
        const favoriteIds = JSON.parse(saved) as string[]
        const restored = instruments.filter((inst: Instrument) => favoriteIds.includes(inst.id))
        if (restored.length > 0) setFavorites(restored)
      }
    } catch {
      // SSR or parse error -- ignore
    }
  }, [category, instruments])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setButtonPosition({ top: rect.bottom, left: rect.left })
    setShowEnhancedSelector(true)
  }

  const handleFavoriteSelect = (instrument: Instrument) => onSelect(instrument)
  const handleEnhancedSelect = (instrument: Instrument) => { onSelect(instrument); setShowEnhancedSelector(false) }
  const handleFavoritesUpdate = (newFavorites: Instrument[]) => {
    setFavorites(newFavorites)
    localStorage.setItem(`favorites_${category}`, JSON.stringify(newFavorites.map((f) => f.id)))
  }

  return (
    <>
      <div className="relative group/cat">
        {/* Trigger */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 cursor-pointer rounded-xl transition-all duration-400 hover:bg-white/[0.025] relative" onClick={handleClick}>
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover/cat:opacity-100 transition-all duration-500 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 30% 50%, rgba(${accent.rgb},0.06), transparent 70%)` }} />

          <span className={`relative z-10 transition-all duration-400 ${identity.color} ${identity.hoverColor}`}>
            {identity.icon}
          </span>
          <span className="text-[11px] font-semibold tracking-wide relative z-10 transition-all duration-400 text-white/20 group-hover/cat:text-white/65">
            {label}
          </span>
          <ChevronDown className="w-2.5 h-2.5 text-white/8 group-hover/cat:text-white/25 group-hover/cat:rotate-180 transition-all duration-400 relative z-10" />
        </div>

        {/* Premium dropdown panel */}
        <div className="absolute top-full left-0 pt-3 w-[340px] opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-300 transform translate-y-2 group-hover/cat:translate-y-0 z-50 pointer-events-none group-hover/cat:pointer-events-auto">
          <div className="rounded-2xl bg-[#0a0b0f]/95 backdrop-blur-3xl shadow-2xl shadow-black/60 overflow-hidden relative border border-white/[0.05]">
            {/* Category tint gradient */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{ background: `linear-gradient(135deg, rgba(${accent.rgb},0.04) 0%, transparent 50%)` }} />

            {/* Header */}
            <div className="relative px-5 pt-4 pb-3 flex items-center gap-2.5">
              <span className={`transition-all duration-400 ${identity.color}`} style={{ opacity: 0.6 }}>
                {identity.icon}
              </span>
              <span className="text-[10px] text-white/35 uppercase tracking-[0.14em] font-bold flex-1">{label}</span>
              <span className="text-[9px] text-white/15 font-mono tabular-nums">{favorites.length} instruments</span>
              <button
                onClick={(e) => { e.stopPropagation(); handleClick(e) }}
                className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-all duration-200 group/set"
                title={`Manage ${label}`}
              >
                <SlidersHorizontal className="w-3 h-3 text-white/12 group-hover/set:text-white/35 transition-all duration-200" />
              </button>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

            {/* Instrument list */}
            <div className="py-2 px-2 relative z-10 max-h-[340px] overflow-y-auto scrollbar-hide">
              {favorites.map((instrument) => {
                const mockData = generateMockPriceData(instrument.symbol)
                const sparkline = generateSparkline(instrument.symbol)

                return (
                  <button
                    key={instrument.id}
                    onClick={() => handleFavoriteSelect(instrument)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all duration-250 relative overflow-hidden group/item ${accent.hoverBg}`}
                  >
                    {/* Hover sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-600 ease-out pointer-events-none" />

                    {/* Symbol badge */}
                    <div className="relative z-10 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 group-hover/item:scale-105 transition-all duration-200 border border-white/[0.05]"
                      style={{ background: `rgba(${accent.rgb},0.06)` }}
                    >
                      <span className="text-[10px] font-bold text-white/60 group-hover/item:text-white/90 transition-colors duration-200 font-mono">
                        {instrument.symbol.substring(0, 3)}
                      </span>
                    </div>

                    {/* Pair info */}
                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-mono font-bold text-white/60 group-hover/item:text-white/95 transition-colors duration-200 tracking-wide">
                          {instrument.symbol}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono text-white/25 group-hover/item:text-white/50 tabular-nums transition-colors duration-200">
                          {mockData.price}
                        </span>
                        <span className={`text-[9px] font-mono font-semibold tabular-nums transition-colors duration-200 ${
                          mockData.isPositive
                            ? "text-emerald-400/40 group-hover/item:text-emerald-400/80"
                            : "text-red-400/40 group-hover/item:text-red-400/80"
                        }`}>
                          {mockData.isPositive ? "+" : ""}{mockData.changePercent}%
                        </span>
                      </div>
                    </div>

                    {/* Mini sparkline */}
                    <div className="relative z-10 flex-shrink-0 w-[48px] h-[22px] opacity-30 group-hover/item:opacity-70 transition-opacity duration-300">
                      <svg viewBox="0 0 48 22" fill="none" className="w-full h-full">
                        <path
                          d={`M0 ${sparkline[0] / 4} ${sparkline.map((v, i) => `L${(i / (sparkline.length - 1)) * 48} ${v / 4}`).join(" ")}`}
                          stroke={mockData.isPositive ? "#34d399" : "#f87171"}
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                        <path
                          d={`M0 ${sparkline[0] / 4} ${sparkline.map((v, i) => `L${(i / (sparkline.length - 1)) * 48} ${v / 4}`).join(" ")} L48 22 L0 22 Z`}
                          fill={mockData.isPositive ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)"}
                        />
                      </svg>
                    </div>

                    {/* Trend arrow */}
                    <div className={`relative z-10 flex-shrink-0 transition-all duration-200 ${
                      mockData.isPositive
                        ? "text-emerald-400/20 group-hover/item:text-emerald-400/60"
                        : "text-red-400/20 group-hover/item:text-red-400/60"
                    }`}>
                      {mockData.isPositive
                        ? <TrendingUp className="w-3.5 h-3.5 group-hover/item:scale-110 transition-transform duration-200" />
                        : <TrendingDown className="w-3.5 h-3.5 group-hover/item:scale-110 transition-transform duration-200" />
                      }
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Footer */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
            <div className="flex items-center">
              <button
                onClick={handleClick}
                className="flex-1 px-4 py-3 text-center text-[9px] text-white/20 hover:text-white/50 hover:bg-white/[0.025] transition-all duration-200 uppercase tracking-[0.12em] font-semibold relative overflow-hidden group/view"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover/view:translate-x-full transition-transform duration-600 pointer-events-none" />
                <span className="relative z-10">View All {label}</span>
              </button>
              <div className="w-px h-5 bg-white/[0.04]" />
              <button
                onClick={handleClick}
                className="px-4 py-3 text-[9px] text-white/15 hover:text-white/40 hover:bg-white/[0.025] transition-all duration-200 uppercase tracking-[0.12em] font-semibold"
                title="Manage instruments"
              >
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEnhancedSelector && (
        <EnhancedInstrumentSelector
          instruments={instruments}
          onSelect={handleEnhancedSelect}
          onClose={() => setShowEnhancedSelector(false)}
          label={label}
          category={category}
          favorites={favorites}
          onFavoritesUpdate={handleFavoritesUpdate}
          isOpen={showEnhancedSelector}
          position={buttonPosition}
        />
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   NAVIGATOR CUSTOMIZE PANEL -- premium tabbed settings overlay
   ═══════════════════════════════════════════════════════════════════════ */

const GADGET_ICONS: Record<string, React.ReactNode> = {
  activity: <ActivityIcon className="w-3.5 h-3.5" />,
  calculator: <Calculator className="w-3.5 h-3.5" />,
  rss: <Rss className="w-3.5 h-3.5" />,
  "git-branch": <GitBranch className="w-3.5 h-3.5" />,
  calendar: <CalendarDays className="w-3.5 h-3.5" />,
  gauge: <Gauge className="w-3.5 h-3.5" />,
  "bar-chart-2": <BarChart2 className="w-3.5 h-3.5" />,
  bell: <Bell className="w-3.5 h-3.5" />,
}

function NavigatorCustomizePanel() {
  const {
    sections, gadgets, customizeOpen, activeTab,
    setCustomizeOpen, setActiveTab, toggleSection, renameSection,
    reorderSections, toggleGadget, resetSections, resetGadgets,
  } = useNavigatorConfig()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  const startRename = (sec: NavSection) => {
    setEditingId(sec.id)
    setEditValue(sec.customLabel || sec.label)
  }
  const commitRename = () => {
    if (editingId) {
      renameSection(editingId, editValue)
      setEditingId(null)
    }
  }

  const handleDragStart = (idx: number) => setDragIdx(idx)
  const handleDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOverIdx(idx) }
  const handleDrop = (idx: number) => {
    if (dragIdx === null || dragIdx === idx) { setDragIdx(null); setDragOverIdx(null); return }
    const reordered = [...sections]
    const [moved] = reordered.splice(dragIdx, 1)
    reordered.splice(idx, 0, moved)
    reorderSections(reordered)
    setDragIdx(null)
    setDragOverIdx(null)
  }

  const enabledGadgetCount = gadgets.filter(g => g.enabled).length

  const tabs = [
    { id: "sections" as const, label: "Sections", icon: <Layers className="w-3 h-3" /> },
    { id: "gadgets" as const, label: "Gadgets", icon: <SlidersHorizontal className="w-3 h-3" />, badge: enabledGadgetCount > 0 ? enabledGadgetCount : undefined },
    { id: "appearance" as const, label: "Style", icon: <Palette className="w-3 h-3" /> },
  ]

  return (
    <AnimatePresence>
      {customizeOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="absolute top-full right-0 mt-2.5 w-[380px] z-[80]"
        >
          <div className="rounded-2xl bg-[#0a0b0f]/95 backdrop-blur-3xl border border-white/[0.05] shadow-2xl shadow-black/60 overflow-hidden">
            {/* Header */}
            <div className="px-5 pt-5 pb-3 flex items-center gap-2.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-white/25" />
              <span className="text-[10px] text-white/40 uppercase tracking-[0.14em] font-bold flex-1">Customize Navigator</span>
              <button
                onClick={() => { resetSections(); resetGadgets() }}
                className="p-1.5 rounded-lg hover:bg-white/[0.04] transition-all duration-200 group/rst"
                title="Reset all to defaults"
              >
                <RotateCcw className="w-3 h-3 text-white/12 group-hover/rst:text-white/35 transition-colors duration-200" />
              </button>
              <button
                onClick={() => setCustomizeOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/[0.04] transition-all duration-200 group/cls"
              >
                <X className="w-3 h-3 text-white/12 group-hover/cls:text-white/35 transition-colors duration-200" />
              </button>
            </div>

            {/* Tab bar */}
            <div className="px-5 pb-3 flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-[0.1em] transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-white/[0.06] text-white/60 border border-white/[0.06]"
                      : "text-white/20 hover:text-white/40 hover:bg-white/[0.02] border border-transparent"
                  }`}
                >
                  <span className={activeTab === tab.id ? "text-white/50" : "text-white/15"}>
                    {tab.icon}
                  </span>
                  {tab.label}
                  {tab.badge && (
                    <span className="ml-0.5 w-4 h-4 rounded-full bg-white/[0.08] flex items-center justify-center text-[8px] font-bold text-white/40 tabular-nums">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {/* ═══ SECTIONS TAB ═══ */}
              {activeTab === "sections" && (
                <motion.div
                  key="sections"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="py-2 px-2.5 space-y-0.5 max-h-[320px] overflow-y-auto scrollbar-hide">
                    {sections.map((sec, idx) => (
                      <div
                        key={sec.id}
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDrop={() => handleDrop(idx)}
                        onDragEnd={() => { setDragIdx(null); setDragOverIdx(null) }}
                        className={`group/sec relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-grab active:cursor-grabbing overflow-hidden ${
                          dragOverIdx === idx ? "bg-white/[0.05] border border-white/[0.08]" : "hover:bg-white/[0.02] border border-transparent"
                        }`}
                      >
                        {/* Drag handle */}
                        <GripVertical className="w-3 h-3 text-white/6 group-hover/sec:text-white/20 transition-colors duration-200 flex-shrink-0 relative z-10" />

                        {/* Status dot */}
                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 relative z-10 flex-shrink-0 ${
                          sec.visible ? "bg-emerald-400/50" : "bg-white/[0.06]"
                        }`} />

                        {/* Label or edit field */}
                        <div className="flex-1 min-w-0 relative z-10">
                          {editingId === sec.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && commitRename()}
                                onBlur={commitRename}
                                autoFocus
                                className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1 text-[11px] text-white/80 font-medium w-full outline-none focus:border-white/[0.15] transition-colors duration-200"
                              />
                              <button onClick={commitRename} className="p-1 rounded-lg hover:bg-white/[0.06] transition-colors duration-200">
                                <Check className="w-3 h-3 text-emerald-400/50" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className={`text-[11px] font-semibold tracking-wide transition-colors duration-200 ${sec.visible ? "text-white/55 group-hover/sec:text-white/80" : "text-white/15 line-through"}`}>
                                {sec.customLabel || sec.label}
                              </span>
                              {sec.customLabel && sec.customLabel !== sec.label && (
                                <span className="text-[8px] text-white/10 font-mono">{sec.label}</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Rename button */}
                        {editingId !== sec.id && (
                          <button
                            onClick={(e) => { e.stopPropagation(); startRename(sec) }}
                            className="p-1 rounded-lg opacity-0 group-hover/sec:opacity-100 hover:bg-white/[0.04] transition-all duration-200 relative z-10"
                          >
                            <Pencil className="w-2.5 h-2.5 text-white/20 hover:text-white/40 transition-colors duration-200" />
                          </button>
                        )}

                        {/* Visibility toggle */}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSection(sec.id) }}
                          className="p-1 rounded-lg hover:bg-white/[0.04] transition-all duration-200 relative z-10"
                        >
                          {sec.visible
                            ? <Eye className="w-3 h-3 text-white/25 hover:text-white/50 transition-colors duration-200" />
                            : <EyeOff className="w-3 h-3 text-white/10 hover:text-white/30 transition-colors duration-200" />
                          }
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Section count */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
                  <div className="px-5 py-2.5 flex items-center justify-between">
                    <p className="text-[9px] text-white/12 leading-relaxed">Drag to reorder. Eye to toggle. Pencil to rename.</p>
                    <span className="text-[9px] text-white/12 font-mono tabular-nums">{sections.filter(s => s.visible).length}/{sections.length}</span>
                  </div>
                </motion.div>
              )}

              {/* ═══ GADGETS TAB ═══ */}
              {activeTab === "gadgets" && (
                <motion.div
                  key="gadgets"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="py-2.5 px-2.5 space-y-1 max-h-[360px] overflow-y-auto scrollbar-hide">
                    {gadgets.map((gadget) => (
                      <button
                        key={gadget.id}
                        onClick={() => toggleGadget(gadget.id)}
                        className={`group/gad w-full relative flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-300 text-left overflow-hidden border ${
                          gadget.enabled
                            ? "bg-white/[0.03] border-white/[0.06]"
                            : "border-transparent hover:bg-white/[0.015] hover:border-white/[0.03]"
                        }`}
                      >
                        {/* Icon container */}
                        <div className={`relative z-10 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 border ${
                          gadget.enabled
                            ? "bg-white/[0.06] border-white/[0.08] text-white/50"
                            : "bg-white/[0.02] border-white/[0.03] text-white/15 group-hover/gad:text-white/30 group-hover/gad:bg-white/[0.04]"
                        }`}>
                          {GADGET_ICONS[gadget.icon] || <SlidersHorizontal className="w-3.5 h-3.5" />}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 relative z-10">
                          <span className={`text-[11px] font-semibold tracking-wide transition-colors duration-200 block ${
                            gadget.enabled ? "text-white/60" : "text-white/30 group-hover/gad:text-white/50"
                          }`}>
                            {gadget.label}
                          </span>
                          <span className={`text-[9px] transition-colors duration-200 block mt-0.5 ${
                            gadget.enabled ? "text-white/20" : "text-white/10 group-hover/gad:text-white/15"
                          }`}>
                            {gadget.description}
                          </span>
                        </div>

                        {/* Toggle indicator */}
                        <div className={`relative z-10 w-8 h-[18px] rounded-full transition-all duration-300 flex-shrink-0 ${
                          gadget.enabled ? "bg-emerald-400/20 border border-emerald-400/30" : "bg-white/[0.04] border border-white/[0.06]"
                        }`}>
                          <motion.div
                            className={`absolute top-[2px] w-[12px] h-[12px] rounded-full transition-colors duration-300 ${
                              gadget.enabled ? "bg-emerald-400/70" : "bg-white/15"
                            }`}
                            animate={{ left: gadget.enabled ? 14 : 2 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Gadget count */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
                  <div className="px-5 py-2.5 flex items-center justify-between">
                    <p className="text-[9px] text-white/12 leading-relaxed">Toggle gadgets on/off. Enabled gadgets appear in the navigator.</p>
                    <span className="text-[9px] text-white/12 font-mono tabular-nums">{enabledGadgetCount} active</span>
                  </div>
                </motion.div>
              )}

              {/* ═══ APPEARANCE TAB ═══ */}
              {activeTab === "appearance" && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="py-3 px-5 space-y-4">
                    {/* Navigator density */}
                    <div>
                      <span className="text-[9px] text-white/20 uppercase tracking-[0.12em] font-bold block mb-2.5">Density</span>
                      <div className="flex gap-2">
                        {(["Compact", "Normal", "Spacious"] as const).map((d) => (
                          <button
                            key={d}
                            className={`flex-1 py-2 rounded-xl text-[10px] font-semibold tracking-wide transition-all duration-200 border ${
                              d === "Normal"
                                ? "bg-white/[0.05] border-white/[0.08] text-white/50"
                                : "border-white/[0.03] text-white/20 hover:text-white/35 hover:bg-white/[0.02]"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Navigator accent */}
                    <div>
                      <span className="text-[9px] text-white/20 uppercase tracking-[0.12em] font-bold block mb-2.5">Accent Color</span>
                      <div className="flex gap-2">
                        {[
                          { name: "Default", color: "bg-white/20" },
                          { name: "Cyan", color: "bg-cyan-400" },
                          { name: "Amber", color: "bg-amber-400" },
                          { name: "Emerald", color: "bg-emerald-400" },
                          { name: "Rose", color: "bg-rose-400" },
                        ].map((c) => (
                          <button
                            key={c.name}
                            className={`group/col flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200 border ${
                              c.name === "Default"
                                ? "bg-white/[0.03] border-white/[0.06]"
                                : "border-transparent hover:bg-white/[0.02] hover:border-white/[0.04]"
                            }`}
                            title={c.name}
                          >
                            <div className={`w-5 h-5 rounded-full ${c.color} transition-transform duration-200 group-hover/col:scale-110`}
                              style={{ opacity: c.name === "Default" ? 0.5 : 0.6 }} />
                            <span className="text-[7px] text-white/15 uppercase tracking-wide font-medium">{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Animation toggle */}
                    <div>
                      <span className="text-[9px] text-white/20 uppercase tracking-[0.12em] font-bold block mb-2.5">Animations</span>
                      <div className="flex gap-2">
                        {(["Full", "Reduced", "None"] as const).map((a) => (
                          <button
                            key={a}
                            className={`flex-1 py-2 rounded-xl text-[10px] font-semibold tracking-wide transition-all duration-200 border ${
                              a === "Full"
                                ? "bg-white/[0.05] border-white/[0.08] text-white/50"
                                : "border-white/[0.03] text-white/20 hover:text-white/35 hover:bg-white/[0.02]"
                            }`}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Clock format */}
                    <div>
                      <span className="text-[9px] text-white/20 uppercase tracking-[0.12em] font-bold block mb-2.5">Clock Format</span>
                      <div className="flex gap-2">
                        {(["24h UTC", "12h Local", "Both"] as const).map((f) => (
                          <button
                            key={f}
                            className={`flex-1 py-2 rounded-xl text-[10px] font-semibold tracking-wide transition-all duration-200 border ${
                              f === "24h UTC"
                                ? "bg-white/[0.05] border-white/[0.08] text-white/50"
                                : "border-white/[0.03] text-white/20 hover:text-white/35 hover:bg-white/[0.02]"
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
                  <div className="px-5 py-2.5">
                    <p className="text-[9px] text-white/12 leading-relaxed">Appearance settings apply to the navigator bar only.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute block h-1.5 w-1.5 rounded-full bg-purple-400/20 shadow-[0_0_14px_rgba(168,85,247,0.2)]"
          style={{
            top: `${Math.random() * 90 + 5}%`,
            left: `${Math.random() * 90 + 5}%`,
          }}
          animate={{
            y: [0, Math.random() * 10 - 5, 0],
            x: [0, Math.random() * 10 - 5, 0],
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}

/* UtcClock replaced by MarketStateInstrument */

const REFRESH_MS = 60_000

export function LiveMarketIntelligence() {
  const pathname = usePathname()
  const { instrument } = useInstrument()

  const timerRef = useRef<number | null>(null)

  const { sections, customizeOpen, setCustomizeOpen } = useNavigatorConfig()

  const [activeInstrument, setActiveInstrument] = useState<Instrument>(allInstruments[0])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAnalysisModalOpen, setAnalysisModalOpen] = useState(false)
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false)
  const [widgetKey, setWidgetKey] = useState(Date.now())
  const [isCompactMode, setIsCompactMode] = useState(false)
  const [activeSection, setActiveSection] = useState<"terminal" | "execute" | "journal" | "analysis">("terminal")
  const [showExecutePanel, setShowExecutePanel] = useState(false)
  const [showLeftDock, setShowLeftDock] = useState(false)
  
  // Resizable split-pane — direct set, zero lag
  const [copilotWidthPct, setCopilotWidthPct] = useState(36)
  const [isDraggingDivider, setIsDraggingDivider] = useState(false)
  const splitContainerRef = useRef<HTMLDivElement>(null)
  
  const journalRef = useRef<HTMLDivElement>(null)
  const feedRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const analysisRef = useRef<HTMLDivElement>(null)

  const scrollToSection = useCallback((section: "terminal" | "execute" | "journal" | "analysis") => {
    setActiveSection(section)
    if (section === "terminal") {
      terminalRef.current?.scrollIntoView({ behavior: "smooth" })
      setShowExecutePanel(false)
    } else if (section === "execute") {
      terminalRef.current?.scrollIntoView({ behavior: "smooth" })
      setShowExecutePanel(true)
    } else if (section === "analysis") {
      setShowExecutePanel(false)
      analysisRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    } else if (section === "journal") {
      setShowExecutePanel(false)
      journalRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  }, [])

  // Direct divider drag — no lerp, no lag, instant response
  const handleDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDraggingDivider(true)
  }, [])

  const handleDividerDoubleClick = useCallback(() => {
    setCopilotWidthPct(36)
  }, [])

  useEffect(() => {
    if (!isDraggingDivider) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!splitContainerRef.current) return
      const rect = splitContainerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const pct = 100 - (x / rect.width) * 100
      setCopilotWidthPct(Math.max(20, Math.min(50, pct)))
    }

    const handleMouseUp = () => setIsDraggingDivider(false)

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    document.body.style.userSelect = "none"
    document.body.style.cursor = "col-resize"

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.userSelect = ""
      document.body.style.cursor = ""
    }
  }, [isDraggingDivider])

  const handleInstrumentSelect = (instrument: Instrument) => {
    setActiveInstrument(instrument)

    copilotBus.emit({
      id: generateUUID(),
      type: "instrument:selected",
      ts: Date.now(),
      sessionId: window.localStorage.getItem("sessionId") ?? "anon",
      context: { instrument: instrument.symbol },
      data: { instrumentId: instrument.id, category: instrument.category },
    })

    const normalizedPair = normalizePair(instrument.symbol)
    const { setSelectedPair } = useAnalysis.getState()
    setSelectedPair(normalizedPair)

    setWidgetKey(Date.now())
  }

  useEffect(() => {
    if (!isAnalysisModalOpen) return

    const tick = async () => {
      const { loadSnapshot, loadBankingSessions } = useAnalysis.getState()
      const pair = activeInstrument.symbol?.toUpperCase() || "EURUSD"
      try {
        await loadSnapshot(pair)
        await loadBankingSessions(pair, Date.now())
      } catch (e) {
        console.debug("[Analyze] refresh failed", e)
      }
    }

    timerRef.current = window.setInterval(tick, REFRESH_MS) as unknown as number
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [isAnalysisModalOpen, activeInstrument.symbol])

  const handleSaveAnalysis = async () => {
    try {
      const analysisName = `${activeInstrument.symbol} Analysis - ${new Date().toLocaleDateString()}`
      const description = `Comprehensive analysis of ${activeInstrument.symbol} including multi-timeframe, session, liquidity, and macro factors.`
      setHistoryModalOpen(true)
    } catch (error) {
      console.error("Failed to save analysis:", error)
    }
  }

  return (
    <>
      {isSearchOpen && (
        <InstrumentSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelect={(inst) => {
            handleInstrumentSelect(inst)
            setIsSearchOpen(false)
          }}
        />
      )}
      {isAnalysisModalOpen && (
        <PremiumChartAnalysisModal
          isOpen={isAnalysisModalOpen}
          onClose={() => setAnalysisModalOpen(false)}
          activeInstrument={activeInstrument}
        />
      )}
      {isHistoryModalOpen && (
        <AnalysisHistoryModal isOpen={isHistoryModalOpen} onClose={() => setHistoryModalOpen(false)} />
      )}
      <div className="bg-[#0c0c10] min-h-screen flex flex-col relative z-0 overflow-x-hidden">
        {/* Atmospheric depth layers -- purple/blue institutional ambience */}
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-900/5 via-transparent to-blue-900/5 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% 20%, rgba(88,28,135,0.06) 0%, transparent 70%)" }}
        />

        <div ref={terminalRef} className="w-full flex flex-col h-screen relative z-10 px-2 sm:px-3 lg:px-4 py-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-[40px] flex-shrink-0"
          />

          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-1 mb-3 flex-shrink-0"
          >
            {/* ═══ Config-driven navigator sections ═══ */}
            {sections.map((sec) => {
              if (!sec.visible) return null

              if (sec.id === "time-session") {
                return <MarketStateInstrument key={sec.id} />
              }

              const sectionMap: Record<string, { instruments: Instrument[]; label: string; category: string }> = {
                forex: { instruments: instrumentsByCategory.forex, label: sec.customLabel || "Forex Pairs", category: "forex" },
                indices: { instruments: instrumentsByCategory.indices, label: sec.customLabel || "Indices", category: "indices" },
                crypto: { instruments: instrumentsByCategory.crypto, label: sec.customLabel || "Crypto", category: "crypto" },
                commodities: { instruments: instrumentsByCategory.commodities, label: sec.customLabel || "Commodities", category: "commodities" },
              }
              const cfg = sectionMap[sec.id]
              if (cfg) {
                return (
                  <HybridInstrumentSelector
                    key={sec.id}
                    instruments={cfg.instruments}
                    onSelect={handleInstrumentSelect}
                    label={cfg.label}
                    category={cfg.category}
                  />
                )
              }

              // analyze is handled on the right side
              return null
            })}

            {/* Search + Customize */}
            <div className="flex items-center gap-0.5 ml-1 relative">
              <button onClick={() => setIsSearchOpen(true)} className="p-1.5 rounded-full hover:bg-white/[0.03] transition-all duration-300 group/s">
                <Search className="w-3 h-3 text-white/15 group-hover/s:text-white/45 transition-all duration-300" />
              </button>
              <button
                onClick={() => setCustomizeOpen(!customizeOpen)}
                className={`p-1.5 rounded-full transition-all duration-300 group/c ${customizeOpen ? "bg-white/[0.04]" : "hover:bg-white/[0.03]"}`}
                title="Customize Navigator"
              >
                <SlidersHorizontal className={`w-3 h-3 transition-all duration-300 ${customizeOpen ? "text-white/50 rotate-12" : "text-white/15 group-hover/c:text-white/45 group-hover/c:rotate-12"}`} />
              </button>
              <NavigatorCustomizePanel />
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* ═══ Chart-Chrome Oracle Utility — concise micro-cluster ═══ */}
            {sections.find(s => s.id === "analyze")?.visible !== false && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Primary: Analyze */}
              <motion.button
                onClick={async () => {
                  setAnalysisModalOpen(true)
                  const pair = activeInstrument.symbol?.toUpperCase() || "EURUSD"
                  activityAnalyzeRun({ instrument: pair })
                  try {
                    const { loadSnapshot, loadBankingSessions, loadMultiTFBars } = useAnalysis.getState()
                    await loadSnapshot(pair)
                    await loadBankingSessions(pair, Date.now())
                    await loadMultiTFBars(pair)
                  } catch (e) {
                    console.warn("[Analyze] load failed", e)
                  }
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-300 group/ai overflow-hidden"
                style={{
                  background: "rgba(6,182,212,0.04)",
                  border: "1px solid rgba(6,182,212,0.08)",
                }}
              >
                <motion.div
                  className="w-1 h-1 rounded-full"
                  style={{ background: "rgba(6,182,212,0.7)" }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[10px] font-mono font-bold text-cyan-400/55 group-hover/ai:text-cyan-300/80 transition-all duration-200 tracking-wide">
                  Analyze
                </span>
                <TrendingUp className="w-3 h-3 text-cyan-400/30 group-hover/ai:text-cyan-400/60 transition-colors" />
              </motion.button>

              {/* Secondary: History */}
              <button
                onClick={handleSaveAnalysis}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-200 hover:bg-white/[0.03] group/hist"
              >
                <History className="w-3 h-3 text-white/15 group-hover/hist:text-white/35 transition-colors" />
              </button>
            </div>
            )}
          </motion.div>

          <div ref={splitContainerRef} className="flex-1 flex min-h-0 relative">
            {/* ═══ Chart Area -- with Execute overlay ═══ */}
            <div 
              className="min-h-0 flex flex-col relative"
              style={{ 
                width: `${100 - copilotWidthPct}%`,
                transition: isDraggingDivider ? "none" : "width 0.3s ease",
              }}
            >
              <div className="flex-1 min-h-0 premium-glass-chart-container relative">
                <div className="h-full p-1">
                  <TradingViewWidget key={widgetKey} symbol={getTradingViewSymbol(activeInstrument)} />
                </div>

                {/* Execute trigger button -- bottom-right of chart */}
                <motion.button
                  onClick={() => { setShowExecutePanel(!showExecutePanel); setActiveSection(showExecutePanel ? "terminal" : "execute") }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={`absolute bottom-3 right-3 z-30 flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-xl transition-all duration-300 group ${
                    showExecutePanel
                      ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-300 shadow-lg shadow-emerald-500/10"
                      : "bg-[#0a0c12]/80 border-white/[0.08] text-white/40 hover:text-white/70 hover:border-white/[0.15] hover:bg-[#0a0c12]/95"
                  }`}
                >
                  <div className="relative">
                    <CrosshairIcon className="w-4 h-4" />
                    {showExecutePanel && (
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400"
                      />
                    )}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.12em] font-semibold">
                    {showExecutePanel ? "Close" : "Execute"}
                  </span>
                </motion.button>
              </div>
            </div>

            {/* ═══ Resizable Divider ═══ */}
            <div
              onMouseDown={handleDividerMouseDown}
              onDoubleClick={handleDividerDoubleClick}
              className="w-3 flex-shrink-0 cursor-col-resize group relative z-20"
            >
              {/* Center line */}
              <div 
                className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-px transition-colors duration-200 ${
                  isDraggingDivider ? "bg-white/20" : "bg-white/[0.06] group-hover:bg-white/[0.14]"
                }`}
              />
              {/* Grip dots */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-[3px] transition-opacity duration-200 ${
                isDraggingDivider ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}>
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-[3px] h-[3px] rounded-full bg-white/20" />
                ))}
              </div>
            </div>

            {/* ═══ Command Center -- intelligence rail with execute swap ═══ */}
            <div 
              className="flex-shrink-0 relative"
              style={{ 
                width: `${copilotWidthPct}%`, 
                minWidth: 380,
                transition: isDraggingDivider ? "none" : "width 0.3s ease",
              }}
            >
              <div className="absolute inset-0">
                <CopilotRightRail
                  executeMode={showExecutePanel}
                  executeContent={
                    <TradeExecutionPanel
                      instrument={activeInstrument.name}
                      currentPrice={activeInstrument.id === "EURUSD" ? 1.08423 : activeInstrument.id === "BTCUSD" ? 67234 : activeInstrument.id === "XAUUSD" ? 2341.50 : 1.0000}
                      onClose={() => { setShowExecutePanel(false); setActiveSection("terminal") }}
                    />
                  }
                  onExitExecute={() => { setShowExecutePanel(false); setActiveSection("terminal") }}
                />
              </div>
            </div>

            <FloatingConfluencePanel activeInstrument={activeInstrument.id} />
          </div>
        </div>

        {/* ═══ Scroll Down Indicator ═══ */}
        <div className="max-w-screen-2xl mx-auto w-full flex justify-center -mt-8 mb-2 relative z-10">
          <motion.button
            onClick={() => scrollToSection("analysis")}
            className="flex flex-col items-center gap-1 py-3 px-6 group cursor-pointer"
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/20 group-hover:text-white/40 transition-colors">
              Analysis + Journal
            </span>
            <ArrowDown className="w-4 h-4 text-white/15 group-hover:text-white/40 transition-colors" />
          </motion.button>
        </div>

        {/* ═══ Chart Analysis Section (inline canvas) ═══ */}
        <div ref={analysisRef} className="scroll-mt-4">
          <div className="max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-4">
            <InlineChartAnalysis
              activeInstrument={activeInstrument}
              onOpenFullModal={() => {
                setAnalysisModalOpen(true)
                const pair = activeInstrument.symbol?.toUpperCase() || "EURUSD"
                activityAnalyzeRun({ instrument: pair })
                ;(async () => {
                  try {
                    const { loadSnapshot, loadBankingSessions, loadMultiTFBars } = useAnalysis.getState()
                    await loadSnapshot(pair)
                    await loadBankingSessions(pair, Date.now())
                    await loadMultiTFBars(pair)
                  } catch (e) { /* ignore */ }
                })()
              }}
            />
          </div>
        </div>

        {/* ═══ Journal Section ═══ */}
        <div ref={journalRef} className="scroll-mt-4">
          <div className="max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-0.5 h-5 rounded-full bg-emerald-400" />
              <FileText className="w-4 h-4 text-white/30" />
              <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/40 font-bold">Trade Journal</span>
              <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
            </div>
            <TradeJournalDashboard />
          </div>
        </div>

        {/* Feed moved to /dashboard */}
        <div ref={feedRef} className="scroll-mt-4 pb-24" />

        {/* ═══════════════════════════════════════════════════
            BOTTOM SECTION NAV -- FloatingNav-style hover menu
            ═══════════════════════════════════════════════════ */}
        <div
          className="fixed left-0 bottom-[8%] z-50 h-[180px] w-5"
          onMouseEnter={() => setShowLeftDock(true)}
          onMouseLeave={() => setShowLeftDock(false)}
        >
          {/* Chevron hint -- breathing arrow, always visible */}
          <motion.div
            className="absolute top-1/2 left-1 -translate-y-1/2"
            animate={{
              opacity: showLeftDock ? 0 : 0.6,
              scale: showLeftDock ? 0.5 : 1,
              x: showLeftDock ? -20 : 0,
            }}
            transition={{ duration: 0.15 }}
          >
            <div className="p-1.5 rounded-full">
              <ChevronDown className="w-4 h-4 text-emerald-300/70 -rotate-90" />
            </div>
          </motion.div>

          {/* Cards that pop out from left */}
          <AnimatePresence mode="wait">
            {showLeftDock && (
              <motion.nav
                key="section-nav"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="absolute top-1/2 -translate-y-1/2 left-0 flex flex-col gap-1.5 w-[220px] pl-1"
              >
                <motion.div
                  initial={{ y: -16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 12, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="flex flex-col gap-1.5"
                >
                  {([
                    { id: "terminal" as const, icon: Activity, label: "Terminal", subtitle: "Live chart & signals", color: "purple", colorRgb: "147,51,234" },
                    { id: "analysis" as const, icon: TrendingUp, label: "Analysis", subtitle: "Chart analysis canvas", color: "emerald", colorRgb: "16,185,129" },
                    { id: "journal" as const, icon: FileText, label: "Journal", subtitle: "Trade log & performance", color: "amber", colorRgb: "245,158,11" },
                  ]).map((item, i) => {
                    const isActive = activeSection === item.id
                    const Icon = item.icon
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ y: -12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.05, type: "spring", stiffness: 380, damping: 26 }}
                      >
                        <button
                          onClick={() => scrollToSection(item.id)}
                          className="block w-full"
                        >
                          <div
                            className="group relative select-none rounded-xl p-2.5 mx-1 overflow-hidden transition-all duration-150 will-change-transform backdrop-blur-xl bg-gradient-to-br from-black/20 via-black/10 to-transparent hover:border hover:border-white/10"
                            style={{
                              border: isActive ? `1px solid rgba(${item.colorRgb},0.3)` : undefined,
                              background: isActive ? `linear-gradient(135deg, rgba(${item.colorRgb},0.1), rgba(${item.colorRgb},0.03), transparent)` : undefined,
                            }}
                          >
                            {isActive && (
                              <span
                                className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full"
                                style={{ background: `linear-gradient(180deg, rgba(${item.colorRgb},0.8), rgba(${item.colorRgb},0.4))` }}
                              />
                            )}
                            <div className="relative z-10 flex items-center gap-2.5">
                              <div
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 shadow-lg shadow-black/20 transition-all duration-150"
                                style={{
                                  background: isActive
                                    ? `linear-gradient(135deg, rgba(${item.colorRgb},0.2), rgba(${item.colorRgb},0.08))`
                                    : "linear-gradient(135deg, rgba(255,255,255,0.05), transparent, rgba(255,255,255,0.05))",
                                }}
                              >
                                <Icon
                                  className="w-4 h-4 transition-all duration-150"
                                  style={{ color: isActive ? `rgba(${item.colorRgb},0.9)` : "rgba(255,255,255,0.7)" }}
                                />
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <p className="font-semibold text-xs whitespace-nowrap truncate transition-all duration-150 text-white/90">
                                  {item.label}
                                </p>
                                <p
                                  className="text-[10px] transition-colors duration-150 truncate"
                                  style={{ color: isActive ? `rgba(${item.colorRgb},0.7)` : "rgba(255,255,255,0.35)" }}
                                >
                                  {item.subtitle}
                                </p>
                              </div>
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    )
                  })}

                  {/* Back to top card */}
                  <motion.div
                    initial={{ y: -12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 380, damping: 26 }}
                  >
                    <button
                      onClick={() => { terminalRef.current?.scrollIntoView({ behavior: "smooth" }); setActiveSection("terminal"); setShowExecutePanel(false) }}
                      className="block w-full"
                    >
                      <div className="group relative select-none rounded-xl p-2 mx-1 overflow-hidden transition-all duration-150 backdrop-blur-xl bg-gradient-to-br from-black/10 via-transparent to-transparent hover:border hover:border-white/10 flex items-center justify-center gap-2">
                        <ArrowDown className="w-3 h-3 text-white/25 rotate-180 group-hover:text-white/50 transition-colors" />
                        <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-white/25 group-hover:text-white/50 transition-colors">
                          Back to top
                        </span>
                      </div>
                    </button>
                  </motion.div>
                </motion.div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>

      </div>
    </>
  )
}
