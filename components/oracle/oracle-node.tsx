"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { SURFACE, ACCENT, GLOW, ELEVATION, RADIUS, GRADIENT } from "@/components/mtf/mtf-theme"
import { NeuralOrb, type OrbState } from "@/components/dashboard/command-desk/neural-orb"
import { parseIntent } from "@/lib/command/intent-parser"
import { generateSuggestions } from "@/lib/command/suggestions"
import type { SuggestionChip } from "@/lib/command/types"
import type { SummonedResult } from "@/components/dashboard/command-desk/summoned-workspace"
import { RenderResultObject } from "@/components/command/CommandResultObjects"
import {
  Send, Mic, Search, Clock, Sparkles, X,
  TrendingUp, Target, Shield, Brain, Crosshair,
  Activity, BarChart3, Globe, Zap, Users,
  ChevronRight, ArrowUpRight,
} from "lucide-react"

/* ═══════════════════════════════════════════════════════════════
   ORACLE NODE — Global Intelligence Layer

   4 States:
   A. IDLE NODE        — small orb, top-center, quiet
   B. WHISPER POD      — compact hover preview, right-anchored
   C. INVOCATION STAGE — full command deck, drops from top
   D. RESULT SURFACE   — intelligence tray within stage

   Rules:
   - Fixed overlay, pointer-events-none container, zero layout
   - Uses MTF SURFACE/ELEVATION tokens -- no raw rgba mush
   - Color identity per-section (emerald/cyan/amber/rose) --
     NOT monotone blue-purple everywhere
   ═══════════════════════════════════════════════════════════════ */

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

type OracleMode = "idle" | "whisper" | "stage" | "result"

/* Page context -- each page gets its OWN accent, not generic purple */
const PAGE_CONTEXT: Record<string, { label: string; accent: typeof ACCENT.purple; domain: string }> = {
  "/dashboard":    { label: "Your Space",       accent: ACCENT.emerald, domain: "dashboard" },
  "/intelligence": { label: "Signal Terminal",  accent: ACCENT.cyan,    domain: "signals" },
  "/forecast":     { label: "Forecast Hub",     accent: ACCENT.amber,   domain: "forecasts" },
  "/communities":  { label: "Communities",      accent: ACCENT.rose,    domain: "community" },
  "/copilot":      { label: "Execution",        accent: ACCENT.emerald, domain: "execution" },
  "/journal":      { label: "Journal",          accent: ACCENT.amber,   domain: "journal" },
}

const INTENT_LABELS: Record<string, { label: string; accent: typeof ACCENT.purple }> = {
  show:     { label: "SHOW",    accent: ACCENT.cyan },
  compare:  { label: "COMPARE", accent: ACCENT.amber },
  explain:  { label: "EXPLAIN", accent: ACCENT.purple },
  guide:    { label: "GUIDE",   accent: ACCENT.emerald },
  drill:    { label: "DRILL",   accent: ACCENT.cyan },
  navigate: { label: "GO TO",   accent: ACCENT.rose },
}

/* Per-page quick suggestions with distinct color identities */
const PAGE_SUGGESTIONS: Record<string, Array<{ label: string; query: string; icon: typeof Brain; accent: typeof ACCENT.purple }>> = {
  "/dashboard": [
    { label: "London Session",   query: "Show me London session dashboard",  icon: Globe,   accent: ACCENT.cyan },
    { label: "Today's Plan",     query: "Show my trading plan for today",    icon: Target,  accent: ACCENT.emerald },
    { label: "Risk Check",       query: "Run my risk assessment",            icon: Shield,  accent: ACCENT.amber },
  ],
  "/intelligence": [
    { label: "EUR/USD Analysis", query: "Analyze EUR/USD across timeframes", icon: TrendingUp, accent: ACCENT.cyan },
    { label: "Macro Events",     query: "Show macro events and DXY context", icon: Activity,   accent: ACCENT.amber },
    { label: "Confluence Map",   query: "Show confluences on my watchlist",  icon: Crosshair,  accent: ACCENT.emerald },
  ],
  "/forecast": [
    { label: "Active Forecasts", query: "Show my active forecasts",                 icon: BarChart3, accent: ACCENT.amber },
    { label: "Top Setups",       query: "What are the highest probability setups?",  icon: Zap,       accent: ACCENT.emerald },
    { label: "Mentor Views",     query: "What did my mentors post?",                 icon: Users,     accent: ACCENT.rose },
  ],
}

const RECENT_COMMANDS = [
  "Show me London session dashboard",
  "Analyze EUR/USD on H4",
  "What's my win rate this week?",
]

/* ── Mock response engine ── */
function generateMockResponse(query: string): SummonedResult {
  const parsed = parseIntent(query)
  const suggestions = generateSuggestions(parsed.intent, parsed.entities)
  const lower = query.toLowerCase()

  if (lower.includes("london") && (lower.includes("open") || lower.includes("session") || lower.includes("dashboard"))) {
    return {
      framing: "London session dashboard loaded. Your highest-probability window is active.",
      category: "SESSION",
      detectedEntities: ["London", "EUR/USD", "Session Dashboard"],
      sessionBadge: "London",
      sourceStatus: "live",
      objects: [
        { type: "stat-grid", data: { items: [
          { label: "Session", value: "London", color: "cyan" },
          { label: "Win Rate", value: "72%", color: "emerald" },
          { label: "Focus Pair", value: "EUR/USD" },
          { label: "Trades Left", value: "2", color: "amber" },
        ] } },
      ],
      insight: {
        primary: "Your EUR/USD London win rate is 74% over the last 20 entries. FVG + OB is your strongest confluence.",
        risk: "ECB Rate Decision in 47 minutes. EUR pairs will see elevated volatility.",
      },
      suggestions,
    }
  }

  if (lower.includes("mentor") && (lower.includes("live") || lower.includes("call"))) {
    return {
      framing: "Mentor live-call entries loaded. 12 entries across 4 mentors this week.",
      category: "MENTORS",
      detectedEntities: ["Mentors", "Live Calls", "Entries"],
      sourceStatus: "live",
      objects: [
        { type: "stat-grid", data: { items: [
          { label: "Mentors Active", value: "4" },
          { label: "Entries This Week", value: "12", color: "cyan" },
          { label: "Win Rate (Mentors)", value: "68%", color: "emerald" },
          { label: "Your Match Rate", value: "71%", color: "purple" },
        ] } },
      ],
      insight: {
        primary: "Marcus Wei posted 3 EUR/USD setups this week with 100% hit rate. His OB + liquidity sweep pattern aligns with your strongest setup.",
        risk: "2 mentor calls conflict on GBP/USD direction. Review before session.",
      },
      suggestions,
    }
  }

  if (lower.includes("dxy") || lower.includes("macro") || lower.includes("news") || lower.includes("ecb")) {
    return {
      framing: "Macro intelligence loaded. 3 events on calendar, 1 high-impact in 47 minutes.",
      category: "MACRO",
      detectedEntities: ["ECB", "EUR", "USD", "Macro Calendar"],
      sourceStatus: "live",
      objects: [
        { type: "macro-panel", data: { events: [
          { name: "ECB Rate Decision", time: "08:30", impact: "high" as const, currency: "EUR", affectedPairs: ["EUR/USD", "EUR/GBP"] },
          { name: "US Jobless Claims", time: "13:30", impact: "medium" as const, currency: "USD", affectedPairs: ["EUR/USD", "GBP/USD"] },
        ] } },
      ],
      insight: {
        primary: "EUR pairs will be most volatile around 08:30. Historical ECB days show 2.3x average EUR/USD range.",
        risk: "Trading during ECB releases has historically resulted in 38% win rate for you.",
      },
      suggestions,
    }
  }

  if (lower.includes("take me") || lower.includes("go to") || lower.includes("open") || lower.includes("navigate")) {
    return {
      framing: `Navigating to requested surface...`,
      category: "NAVIGATE",
      sourceStatus: "live",
      objects: [{ type: "summary-text", data: { text: `Route identified. Opening the requested page.` } }],
      suggestions,
    }
  }

  return {
    framing: `Archio is analyzing: "${query}"`,
    category: "GENERAL",
    sourceStatus: "mock",
    objects: [{ type: "summary-text", data: { text: `Processing your request. Full result surfaces will render in the stage below.` } }],
    suggestions,
  }
}


/* ═══════════════════════════════════════════════════════════════
   ORACLE NODE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export function OracleNode() {
  const pathname = usePathname()
  const [mode, setMode] = useState<OracleMode>("idle")
  const [orbState, setOrbState] = useState<OrbState>("idle")
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<SummonedResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const stageInputRef = useRef<HTMLInputElement>(null)
  const nodeRef = useRef<HTMLDivElement>(null)
  const whisperTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pageCtx = PAGE_CONTEXT[pathname] || { label: "Platform", accent: ACCENT.emerald, domain: "general" }
  const suggestions = PAGE_SUGGESTIONS[pathname] || PAGE_SUGGESTIONS["/dashboard"] || []
  const pAccent = pageCtx.accent // page accent shorthand

  /* Intent preview */
  const [intentPreview, setIntentPreview] = useState<{ intent: string; entities: string[] } | null>(null)
  useEffect(() => {
    if (query.trim().length > 3) {
      const parsed = parseIntent(query)
      const info = INTENT_LABELS[parsed.intent] || INTENT_LABELS.show
      setIntentPreview({
        intent: info.label,
        entities: parsed.entities.map(e => e.value),
      })
    } else {
      setIntentPreview(null)
    }
  }, [query])

  /* Keyboard: Cmd+K toggle, Escape close */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        if (mode === "stage" || mode === "result") restore()
        else invokeStage()
      }
      if (e.key === "Escape") {
        if (mode === "stage" || mode === "result") restore()
        else if (mode === "whisper") setMode("idle")
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [mode])

  /* Click outside to close stage */
  useEffect(() => {
    if (mode !== "stage" && mode !== "result") return
    const handler = (e: MouseEvent) => {
      const stageEl = document.getElementById("oracle-stage")
      const nodeEl = nodeRef.current
      if (stageEl && !stageEl.contains(e.target as Node) && nodeEl && !nodeEl.contains(e.target as Node)) {
        restore()
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [mode])

  /* ── Mode transitions ── */
  const invokeStage = useCallback(() => {
    setMode("stage")
    setOrbState("listening")
    setTimeout(() => stageInputRef.current?.focus(), 200)
  }, [])

  const restore = useCallback(() => {
    setMode("idle")
    setOrbState("idle")
    setQuery("")
    setResult(null)
    setIsProcessing(false)
    setIntentPreview(null)
  }, [])

  const executeCommand = useCallback((q: string) => {
    if (!q.trim()) return
    setIsProcessing(true)
    setOrbState("processing")
    setMode("stage")
    setTimeout(() => {
      setOrbState("rendering")
      setTimeout(() => {
        const response = generateMockResponse(q)
        setResult(response)
        setIsProcessing(false)
        setOrbState("ready")
        setMode("result")
      }, 500)
    }, 700)
  }, [])

  const handleSubmit = useCallback(() => {
    if (!query.trim()) return
    executeCommand(query)
  }, [query, executeCommand])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }, [handleSubmit])

  /* ── Whisper hover intent ── */
  const handleOrbEnter = useCallback(() => {
    if (mode === "stage" || mode === "result") return
    if (whisperTimeoutRef.current) clearTimeout(whisperTimeoutRef.current)
    setOrbState("hover")
    whisperTimeoutRef.current = setTimeout(() => setMode("whisper"), 250)
  }, [mode])

  const handleWhisperLeave = useCallback(() => {
    if (mode === "stage" || mode === "result") return
    whisperTimeoutRef.current = setTimeout(() => {
      setMode("idle")
      setOrbState("idle")
    }, 350)
  }, [mode])

  const handleWhisperEnter = useCallback(() => {
    if (whisperTimeoutRef.current) clearTimeout(whisperTimeoutRef.current)
  }, [])

  const handleOrbClick = useCallback(() => {
    if (mode === "whisper" || mode === "idle") invokeStage()
  }, [mode, invokeStage])

  const isStageActive = mode === "stage" || mode === "result"

  return (
    <>
      {/* ═══ PAGE DIM OVERLAY ═══ */}
      <AnimatePresence>
        {isStageActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0"
            style={{ zIndex: 49, background: "rgba(4,5,10,0.72)", backdropFilter: "blur(6px)" }}
            onClick={restore}
          />
        )}
      </AnimatePresence>

      {/* ═══ ORACLE OVERLAY — zero layout ═══ */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 55 }}>

        {/* ── A. IDLE NODE ── */}
        <div
          ref={nodeRef}
          className="absolute pointer-events-auto"
          style={{ top: 10, left: "50%", transform: "translateX(-50%)" }}
          onMouseEnter={handleOrbEnter}
          onMouseLeave={handleWhisperLeave}
        >
          <div className="relative">
            {/* Subtle ambient halo -- uses page accent, not generic blue */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{
                width: 80,
                height: 80,
                background: `radial-gradient(circle, rgba(${pAccent.rgb},${isStageActive ? 0.06 : 0.015}), transparent 70%)`,
              }}
              animate={{
                opacity: isProcessing ? [0.5, 1, 0.5] : 1,
                scale: isStageActive ? 1.2 : 1,
              }}
              transition={isProcessing ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 }}
            />

            <motion.div
              animate={{ scale: isStageActive ? 0.85 : 1 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="cursor-pointer relative"
            >
              <NeuralOrb state={orbState} size={46} onHover={() => {}} onLeave={() => {}} onClick={handleOrbClick} />

              {/* Processing ring */}
              <AnimatePresence>
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: [1, 1.25, 1] }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ scale: { duration: 1.2, repeat: Infinity, ease: "easeInOut" } }}
                    className="absolute inset-[-5px] rounded-full border pointer-events-none"
                    style={{ borderColor: `rgba(${pAccent.rgb},0.2)` }}
                  />
                )}
              </AnimatePresence>
            </motion.div>

            {/* Cmd+K hint */}
            <AnimatePresence>
              {mode === "idle" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 2 }}
                  className="absolute left-1/2 -translate-x-1/2 mt-1.5"
                  style={{ top: "100%" }}
                >
                  <span
                    className="text-[7px] font-mono tracking-wider px-1.5 py-0.5 rounded whitespace-nowrap"
                    style={{ color: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    {"⌘K"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ═══ B. WHISPER POD ═══ */}
            <AnimatePresence>
              {mode === "whisper" && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="absolute pointer-events-auto"
                  style={{ top: -4, left: "calc(100% + 12px)", width: 230, transformOrigin: "left top" }}
                  onMouseEnter={handleWhisperEnter}
                  onMouseLeave={handleWhisperLeave}
                >
                  {/* Tether */}
                  <div className="absolute pointer-events-none"
                    style={{ top: 20, left: -12, width: 12, height: 1, background: `linear-gradient(90deg, rgba(${pAccent.rgb},0.15), rgba(${pAccent.rgb},0.03))` }}
                  />

                  <div
                    className="rounded-xl overflow-hidden"
                    style={{
                      background: SURFACE.card,
                      border: `1px solid rgba(${pAccent.rgb},0.08)`,
                      boxShadow: ELEVATION.tooltip,
                    }}
                  >
                    {/* Top accent -- page color */}
                    <div className="h-px" style={{ background: GRADIENT.cardAccent(pAccent.rgb) }} />

                    <div className="px-3 pt-2.5 pb-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: pAccent.hex }} />
                        <span className="text-[9px] font-mono uppercase tracking-[0.12em] font-semibold" style={{ color: `rgba(${pAccent.rgb},0.7)` }}>
                          {pageCtx.label}
                        </span>
                      </div>
                      <span className="text-[7px] font-mono text-white/10">Oracle</span>
                    </div>

                    {/* Click to invoke */}
                    <button
                      onClick={invokeStage}
                      className="w-full px-3 py-2 flex items-center gap-2 transition-colors duration-150 hover:bg-white/[0.03]"
                    >
                      <Search className="w-3 h-3 flex-shrink-0 text-white/20" />
                      <span className="text-[10px] text-white/25 flex-1 text-left">Ask Archio anything...</span>
                      <span className="text-[7px] font-mono px-1 py-0.5 rounded text-white/12 bg-white/[0.03] border border-white/[0.04]">{"⌘K"}</span>
                    </button>

                    {/* Two quick suggestions -- each with its OWN accent color */}
                    <div className="px-3 pb-2.5 flex flex-col gap-0.5">
                      {suggestions.slice(0, 2).map((s) => {
                        const Icon = s.icon
                        return (
                          <button
                            key={s.label}
                            onClick={() => { invokeStage(); setTimeout(() => executeCommand(s.query), 250) }}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors duration-150 hover:bg-white/[0.04] group/s"
                          >
                            <Icon className="w-3 h-3 flex-shrink-0" style={{ color: `rgba(${s.accent.rgb},0.55)` }} />
                            <span className="text-[9px] font-medium text-white/40 group-hover/s:text-white/65 transition-colors">{s.label}</span>
                            <ChevronRight className="w-2.5 h-2.5 ml-auto text-white/8" />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ═══ C + D. INVOCATION STAGE + RESULT SURFACE ═══ */}
        <AnimatePresence>
          {isStageActive && (
            <motion.div
              id="oracle-stage"
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="absolute pointer-events-auto"
              style={{
                top: 68,
                left: "50%",
                transform: "translateX(-50%)",
                width: "min(680px, calc(100vw - 48px))",
                maxHeight: "calc(100vh - 100px)",
                transformOrigin: "top center",
              }}
            >
              <div
                className="rounded-2xl overflow-hidden flex flex-col"
                style={{
                  background: SURFACE.card,
                  border: `1px solid rgba(${pAccent.rgb},0.08)`,
                  boxShadow: [
                    ELEVATION.cardHover,
                    `0 0 80px rgba(${pAccent.rgb},0.04)`,
                  ].join(", "),
                  maxHeight: "calc(100vh - 100px)",
                }}
              >
                {/* Top accent line -- page color, not generic blue */}
                <div className="h-px flex-shrink-0" style={{ background: GRADIENT.cardAccent(pAccent.rgb) }} />

                {/* Stage header */}
                <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: pAccent.hex }} />
                      <span className="text-[9px] font-mono uppercase tracking-[0.12em] font-semibold" style={{ color: `rgba(${pAccent.rgb},0.7)` }}>
                        {pageCtx.label}
                      </span>
                    </div>
                    <span className="text-[8px] text-white/8">/</span>
                    <span className="text-[9px] font-mono uppercase tracking-[0.1em] text-white/35">
                      {isProcessing ? "Processing" : mode === "result" ? "Result" : "Oracle"}
                    </span>
                    {result?.category && mode === "result" && (
                      <>
                        <span className="text-[8px] text-white/8">/</span>
                        <span
                          className="text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                          style={{
                            background: `rgba(${ACCENT.emerald.rgb},0.08)`,
                            color: `rgba(${ACCENT.emerald.rgb},0.65)`,
                            border: `1px solid rgba(${ACCENT.emerald.rgb},0.1)`,
                          }}
                        >
                          {result.category}
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={restore}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors duration-150 hover:bg-white/[0.04]"
                    aria-label="Close Oracle"
                  >
                    <span className="text-[8px] font-mono uppercase tracking-wider text-white/18">Esc</span>
                    <X className="w-3.5 h-3.5 text-white/25" />
                  </button>
                </div>

                {/* Command input */}
                <div className="px-5 pb-3 flex-shrink-0">
                  <div
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                    style={{
                      background: (orbState === "listening" || query.trim()) ? SURFACE.raised : SURFACE.recess,
                      border: `1px solid rgba(${(orbState === "listening" || query.trim()) ? pAccent.rgb : "255,255,255"},${(orbState === "listening" || query.trim()) ? 0.12 : 0.04})`,
                    }}
                  >
                    <Search className="w-4 h-4 flex-shrink-0" style={{ color: orbState === "listening" ? pAccent.hex : "rgba(255,255,255,0.18)" }} />
                    <input
                      ref={stageInputRef}
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setOrbState("listening")}
                      onBlur={() => { if (!query.trim() && !result) setOrbState("hover") }}
                      placeholder="Ask Archio anything..."
                      className="flex-1 bg-transparent text-[13px] text-white/90 placeholder:text-white/20 focus:outline-none font-medium"
                      autoComplete="off"
                      spellCheck={false}
                      disabled={isProcessing}
                    />
                    <div className="flex items-center gap-1.5">
                      <button disabled className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.02]" aria-label="Voice" title="Voice -- Phase 2">
                        <Mic className="w-3.5 h-3.5 text-white/10" />
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!query.trim() || isProcessing}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-20"
                        style={{
                          background: query.trim() ? `rgba(${pAccent.rgb},0.15)` : "rgba(255,255,255,0.02)",
                          border: query.trim() ? `1px solid rgba(${pAccent.rgb},0.25)` : "1px solid transparent",
                        }}
                        aria-label="Send command"
                      >
                        <Send className="w-3.5 h-3.5" style={{ color: query.trim() ? pAccent.hex : "rgba(255,255,255,0.1)" }} />
                      </button>
                    </div>
                  </div>

                  {/* Intent preview */}
                  <AnimatePresence>
                    {intentPreview && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pt-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(() => {
                            const parsed = parseIntent(query)
                            const info = INTENT_LABELS[parsed.intent] || INTENT_LABELS.show
                            return (
                              <span
                                className="text-[7px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                                style={{
                                  background: `rgba(${info.accent.rgb},0.1)`,
                                  color: `rgba(${info.accent.rgb},0.7)`,
                                  border: `1px solid rgba(${info.accent.rgb},0.12)`,
                                }}
                              >
                                {intentPreview.intent}
                              </span>
                            )
                          })()}
                          {intentPreview.entities.slice(0, 3).map((entity, i) => (
                            <span key={i} className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-white/45">
                              {entity}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Divider */}
                <div className="h-px flex-shrink-0 mx-5 bg-white/[0.04]" />

                {/* Stage body */}
                <div className="overflow-y-auto flex-1" style={{ maxHeight: "calc(100vh - 280px)" }}>
                  {mode === "stage" && !isProcessing && (
                    <div className="px-5 py-4">
                      {/* Page-aware suggestions -- each card uses its OWN accent */}
                      <div className="mb-5">
                        <span className="text-[8px] font-mono uppercase tracking-[0.14em] mb-3 block text-white/20">
                          Suggestions for {pageCtx.label}
                        </span>
                        <div className="grid grid-cols-3 gap-2.5">
                          {suggestions.map((s) => {
                            const Icon = s.icon
                            return (
                              <button
                                key={s.label}
                                onClick={() => { setQuery(s.query); executeCommand(s.query) }}
                                className="flex flex-col items-start gap-2.5 p-3.5 rounded-xl text-left transition-all duration-200 group/card"
                                style={{
                                  background: SURFACE.recess,
                                  border: `1px solid rgba(${s.accent.rgb},0.06)`,
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = `rgba(${s.accent.rgb},0.06)`
                                  e.currentTarget.style.borderColor = `rgba(${s.accent.rgb},0.14)`
                                  e.currentTarget.style.boxShadow = GLOW.low(s.accent.rgb)
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = SURFACE.recess
                                  e.currentTarget.style.borderColor = `rgba(${s.accent.rgb},0.06)`
                                  e.currentTarget.style.boxShadow = "none"
                                }}
                              >
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                                  style={{ background: `rgba(${s.accent.rgb},0.1)`, border: `1px solid rgba(${s.accent.rgb},0.12)` }}
                                >
                                  <Icon className="w-4 h-4" style={{ color: `rgba(${s.accent.rgb},0.7)` }} />
                                </div>
                                <span className="text-[10px] font-semibold text-white/50 group-hover/card:text-white/80 transition-colors leading-tight">{s.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Recent commands */}
                      <div>
                        <span className="text-[8px] font-mono uppercase tracking-[0.14em] mb-2 block text-white/15">Recent</span>
                        <div className="flex flex-col gap-0.5">
                          {RECENT_COMMANDS.map((cmd, i) => (
                            <button
                              key={i}
                              onClick={() => { setQuery(cmd); stageInputRef.current?.focus() }}
                              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors duration-150 hover:bg-white/[0.03]"
                            >
                              <Clock className="w-3 h-3 flex-shrink-0 text-white/12" />
                              <span className="text-[10px] text-white/30 hover:text-white/55 transition-colors truncate">{cmd}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Processing */}
                  {isProcessing && (
                    <div className="px-5 py-10 flex flex-col items-center gap-3">
                      <motion.div
                        className="w-8 h-8 rounded-full border-2"
                        style={{ borderColor: `rgba(${pAccent.rgb},0.12)`, borderTopColor: pAccent.hex }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: `rgba(${pAccent.rgb},0.5)` }}>Processing</span>
                    </div>
                  )}

                  {/* ── D. RESULT SURFACE ── */}
                  {mode === "result" && result && (
                    <div className="px-5 py-4">
                      {/* Framing */}
                      <div className="flex items-start gap-3 mb-4">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: `rgba(${ACCENT.emerald.rgb},0.1)`, border: `1px solid rgba(${ACCENT.emerald.rgb},0.12)` }}
                        >
                          <Sparkles className="w-4 h-4" style={{ color: ACCENT.emerald.hex }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium text-white/75 leading-relaxed">{result.framing}</p>
                          {result.detectedEntities && result.detectedEntities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {result.detectedEntities.map((entity, i) => (
                                <span key={i} className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                                  style={{ background: `rgba(${pAccent.rgb},0.07)`, color: `rgba(${pAccent.rgb},0.6)`, border: `1px solid rgba(${pAccent.rgb},0.08)` }}
                                >
                                  {entity}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Result objects */}
                      <div className="space-y-3 mb-4">
                        {result.objects.map((obj, i) => (
                          <RenderResultObject key={i} obj={obj} />
                        ))}
                      </div>

                      {/* Insight + Risk -- proper distinct colors */}
                      {result.insight && (
                        <div className="space-y-2.5 mb-4">
                          {result.insight.primary && (
                            <div className="px-4 py-3 rounded-xl"
                              style={{ background: `rgba(${ACCENT.emerald.rgb},0.04)`, border: `1px solid rgba(${ACCENT.emerald.rgb},0.08)` }}
                            >
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <Sparkles className="w-3 h-3" style={{ color: ACCENT.emerald.hex }} />
                                <span className="text-[8px] font-mono uppercase tracking-wider" style={{ color: `rgba(${ACCENT.emerald.rgb},0.6)` }}>Insight</span>
                              </div>
                              <p className="text-[11px] leading-relaxed" style={{ color: `rgba(${ACCENT.emerald.rgb},0.65)` }}>{result.insight.primary}</p>
                            </div>
                          )}
                          {result.insight.risk && (
                            <div className="px-4 py-3 rounded-xl"
                              style={{ background: `rgba(${ACCENT.rose.rgb},0.04)`, border: `1px solid rgba(${ACCENT.rose.rgb},0.08)` }}
                            >
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <Shield className="w-3 h-3" style={{ color: `rgba(${ACCENT.rose.rgb},0.7)` }} />
                                <span className="text-[8px] font-mono uppercase tracking-wider" style={{ color: `rgba(${ACCENT.rose.rgb},0.6)` }}>Risk</span>
                              </div>
                              <p className="text-[11px] leading-relaxed" style={{ color: `rgba(${ACCENT.rose.rgb},0.65)` }}>{result.insight.risk}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Next actions */}
                      {result.suggestions && result.suggestions.length > 0 && (
                        <div>
                          <span className="text-[8px] font-mono uppercase tracking-[0.14em] mb-2 block text-white/18">Next Actions</span>
                          <div className="flex flex-wrap gap-1.5">
                            {result.suggestions.slice(0, 5).map((s, i) => (
                              <button
                                key={i}
                                onClick={() => { setQuery(s.label); executeCommand(s.label) }}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-medium transition-all duration-150 hover:bg-white/[0.05]"
                                style={{
                                  background: `rgba(${pAccent.rgb},0.04)`,
                                  border: `1px solid rgba(${pAccent.rgb},0.07)`,
                                  color: `rgba(${pAccent.rgb},0.6)`,
                                }}
                              >
                                {s.label}
                                <ArrowUpRight className="w-2.5 h-2.5 opacity-40" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom accent */}
                <div className="h-px flex-shrink-0" style={{ background: `linear-gradient(90deg, transparent 15%, rgba(${pAccent.rgb},0.06) 50%, transparent 85%)` }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
