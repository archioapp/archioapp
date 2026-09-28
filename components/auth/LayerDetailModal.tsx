"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { CopilotActivityConsole } from "@/components/copilot/activity/CopilotActivityConsole"
import { CopilotStrategyConsole } from "@/components/copilot/strategy/CopilotStrategyConsole"
import { CopilotPsychologyConsole } from "@/components/copilot/psychology/CopilotPsychologyConsole"
import { CopilotSecureConsole } from "@/components/copilot/onboarding/CopilotSecureConsole"
import { CopilotMentorConsole } from "@/components/copilot/coach/CopilotMentorConsole"
import { CopilotAICopilotConsole } from "@/components/copilot/ai/CopilotAICopilotConsole"
import { TradingViewWidget } from "@/components/trading-view-widget"

// ═══════════════════════════════════════════════════════════════════
// LAYER DETAIL MODAL -- REAL SYSTEM TERMINAL
//
// When the user clicks a layer on the Access Architecture panel,
// this modal opens a FULL LIVE INSTANCE of that system.
//
// For Activity Intelligence: renders the actual CopilotActivityConsole
// component (zero props, fully self-contained) -- the exact same
// live feed, demo controls, behavioral traps, primary threat,
// focus now, session intelligence that runs in the real app.
//
// All 6 layers now have live console terminals:
// Activity Intelligence, Strategy OS, Psychology Mapping,
// Secure Environment, Mentor Intelligence, AI Copilot.
// ═══════════════════════════════════════════════════════════════════

interface LayerDetailModalProps {
  layerId: string
  layerName: string
  layerColor: string
  isOpen: boolean
  onClose: () => void
}

// ── LAYER METADATA ──
const LAYER_META: Record<string, {
  title: string
  subtitle: string
  hasLiveSystem: boolean
}> = {
  "activity-intelligence": {
    title: "Activity Intelligence Engine",
    subtitle: "Live operational terminal. Inspect session state, behavioral traps, primary threat, focus directives, and demo controls in real time.",
    hasLiveSystem: true,
  },
  "strategy-os": {
    title: "Strategy Operating System",
    subtitle: "Live strategy terminal. Cycle through trader profiles to inspect discipline, rules, exposure, execution DNA, and full trade logs in real time.",
    hasLiveSystem: true,
  },
  "psychology-mapping": {
    title: "Psychology Mapping System",
    subtitle: "Live neural cortex. Cycle through psychological states to inspect emotional patterns, decision biases, pitfall detection, and behavioral analytics in real time.",
    hasLiveSystem: true,
  },
  "secure-environment": {
    title: "Secure Environment Protocol",
    subtitle: "Live security terminal. Inspect encryption protocols, access control, data isolation, threat monitoring, and full audit trail in real time.",
    hasLiveSystem: true,
  },
  "mentor-intelligence": {
    title: "Mentor Intelligence Network",
    subtitle: "Live mentorship terminal. Navigate expert-derived decision frameworks, case studies, and learning paths across five progressive modules.",
    hasLiveSystem: true,
  },
  "ai-copilot": {
    title: "AI Copilot System",
    subtitle: "Live AI assistant. Contextual interpretation, adaptive assistance, intelligent automation, and natural language interface.",
    hasLiveSystem: true,
  },
}

const COLOR_MAP: Record<string, string> = {
  emerald: "rgb(34,197,94)",
  blue: "rgb(96,165,250)",
  amber: "rgb(245,158,11)",
  slate: "rgb(148,163,184)",
  violet: "rgb(167,139,250)",
}

// ── Chart Symbol Tab ──
function ChartSymbolTab({ symbol, active }: { symbol: string; active?: boolean }) {
  return (
    <button className={cn(
      "text-[8px] font-mono font-bold px-2 py-0.5 rounded transition-all",
      active
        ? "text-white/60 bg-white/[0.05] border border-white/[0.08]"
        : "text-white/15 hover:text-white/30 border border-transparent"
    )}>
      {symbol}
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════
// MAIN MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function LayerDetailModal({ layerId, layerName, layerColor, isOpen, onClose }: LayerDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const meta = LAYER_META[layerId]
  const accentColor = COLOR_MAP[layerColor] || COLOR_MAP.slate

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    if (isOpen) window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, onClose])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose()
    }
    if (isOpen) {
      setTimeout(() => window.addEventListener("click", handler), 100)
    }
    return () => window.removeEventListener("click", handler)
  }, [isOpen, onClose])

  if (!isOpen || !meta) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop -- deep cinematic black */}
      <div
        className="absolute inset-0 animate-in fade-in duration-300"
        style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.95) 100%)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      />

      {/* Modal -- premium dark terminal */}
      <div
        ref={modalRef}
        className="relative z-10 flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-300 rounded-xl w-[98vw] max-w-[1400px] h-[94vh]"
        style={{
          background: "linear-gradient(180deg, rgba(8,10,16,0.99) 0%, rgba(6,8,12,0.99) 100%)",
          border: `1px solid rgba(${accentColor.match(/\d+/g)?.join(",")},0.10)`,
          boxShadow: `0 0 0 1px rgba(255,255,255,0.02), 0 40px 80px rgba(0,0,0,0.7), 0 0 80px rgba(${accentColor.match(/\d+/g)?.join(",")},0.05)`,
        }}
      >
        {/* Top edge accent */}
        <div className="absolute top-0 left-0 right-0 h-px pointer-events-none" style={{ background: `linear-gradient(90deg, transparent 5%, rgba(${accentColor.match(/\d+/g)?.join(",")},0.20) 30%, rgba(${accentColor.match(/\d+/g)?.join(",")},0.35) 50%, rgba(${accentColor.match(/\d+/g)?.join(",")},0.20) 70%, transparent 95%)` }} />

        {/* Terminal Header Bar */}
        <div className="flex-shrink-0 px-4 pt-2.5 pb-2 relative"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Window dots */}
              <div className="flex items-center gap-1.5">
                <button onClick={onClose} className="w-[10px] h-[10px] rounded-full bg-[#ff5f57] hover:brightness-110 transition-all" />
                <div className="w-[10px] h-[10px] rounded-full bg-[#febc2e]" />
                <div className="w-[10px] h-[10px] rounded-full bg-[#28c840]" />
              </div>

              {/* Terminal title */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentColor }} />
                  <div className="absolute inset-0 w-[5px] h-[5px] rounded-full animate-ping" style={{ backgroundColor: accentColor, opacity: 0.3, animationDuration: "2s" }} />
                </div>
                <span className="text-[8px] font-mono tracking-[0.2em] uppercase" style={{ color: "rgba(148,163,184,0.4)" }}>
                  {"Live Terminal"} {"// "}{layerId.toUpperCase().replace(/-/g, " ")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[13px] font-sans font-semibold text-slate-200 tracking-tight">{meta.title}</span>
<span className="text-[7px] font-mono font-black tracking-wider uppercase px-2 py-0.5 rounded border"
  style={{ color: `${accentColor}90`, backgroundColor: `${accentColor}08`, borderColor: `${accentColor}20` }}>
  LIVE DEMO

                </span>
            </div>

            {/* Close X */}
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center text-white/15 hover:text-white/50 transition-all rounded-md hover:bg-white/[0.04]"
            >
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content -- Live System Split-Screen Terminal */}
          <div className="flex-1 flex min-h-0 overflow-hidden">

            {/* LEFT PANEL: TradingView Chart */}
            <div className="flex flex-col border-r border-white/[0.04]" style={{ width: "55%" }}>
              {/* Chart toolbar */}
              <div className="flex items-center justify-between px-3 py-1.5 flex-shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-mono font-bold tracking-wider text-white/30 uppercase">Market View</span>
                  <div className="w-px h-3 bg-white/[0.06]" />
                  <ChartSymbolTab symbol="EURUSD" active />
                  <ChartSymbolTab symbol="GBPUSD" />
                  <ChartSymbolTab symbol="XAUUSD" />
                  <ChartSymbolTab symbol="NAS100" />
                </div>
                <div className="flex items-center gap-1">
                  {["1m", "5m", "15m", "1H", "4H", "D"].map((tf, i) => (
                    <button key={tf} className={cn(
                      "text-[7px] font-mono font-bold px-1.5 py-0.5 rounded transition-all",
                      i === 2
                        ? "text-white/60 bg-white/[0.06] border border-white/[0.08]"
                        : "text-white/15 hover:text-white/30"
                    )}>
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* TradingView embed */}
              <div className="flex-1 min-h-0 relative">
                <TradingViewWidget
                  symbol="FX:EURUSD"
                  interval="15"
                  theme="dark"
                  allow_symbol_change={false}
                />
                {/* Subtle overlay gradient at edges */}
                <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
                  style={{ background: "linear-gradient(180deg, transparent, rgba(8,10,16,0.3))" }} />
              </div>

              {/* Bottom status strip */}
              <div className="flex items-center justify-between px-3 py-1 flex-shrink-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[7px] font-mono text-white/20">Connected to live feed</span>
                </div>
                <span className="text-[7px] font-mono text-white/10">TradingView</span>
              </div>
            </div>

            {/* RIGHT PANEL: Strategy/Activity Console */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ maxWidth: "45%" }}>
              <div className="flex-1 overflow-y-auto min-h-0 scrollbar-terminal">
                {layerId === "strategy-os" ? <CopilotStrategyConsole />
                  : layerId === "psychology-mapping" ? <CopilotPsychologyConsole />
                  : layerId === "secure-environment" ? <CopilotSecureConsole />
                  : layerId === "mentor-intelligence" ? <CopilotMentorConsole />
                  : layerId === "ai-copilot" ? <CopilotAICopilotConsole />
                  : <CopilotActivityConsole />}
              </div>
            </div>
          </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 pointer-events-none" style={{ borderTop: `1px solid rgba(${accentColor.match(/\d+/g)?.join(",")},0.12)`, borderLeft: `1px solid rgba(${accentColor.match(/\d+/g)?.join(",")},0.12)`, borderTopLeftRadius: "12px" }} />
        <div className="absolute top-0 right-0 w-3 h-3 pointer-events-none" style={{ borderTop: `1px solid rgba(${accentColor.match(/\d+/g)?.join(",")},0.12)`, borderRight: `1px solid rgba(${accentColor.match(/\d+/g)?.join(",")},0.12)`, borderTopRightRadius: "12px" }} />
        <div className="absolute bottom-0 left-0 w-3 h-3 pointer-events-none" style={{ borderBottom: `1px solid rgba(${accentColor.match(/\d+/g)?.join(",")},0.08)`, borderLeft: `1px solid rgba(${accentColor.match(/\d+/g)?.join(",")},0.08)`, borderBottomLeftRadius: "12px" }} />
        <div className="absolute bottom-0 right-0 w-3 h-3 pointer-events-none" style={{ borderBottom: `1px solid rgba(${accentColor.match(/\d+/g)?.join(",")},0.08)`, borderRight: `1px solid rgba(${accentColor.match(/\d+/g)?.join(",")},0.08)`, borderBottomRightRadius: "12px" }} />
      </div>
    </div>
  )
}
